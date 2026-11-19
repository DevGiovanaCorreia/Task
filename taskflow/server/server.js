
const express = require('express')
const cors = require('cors')
const conexao = require('./database')

const app = express()

app.use(cors())
app.use(express.json())

// Rota inicial
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API TaskFlow funcionando!'
    })
})

// Listar tarefas
app.get('/api/tarefas', async (req, res) => {
    try {
        const [tarefas] = await conexao.query(
            'SELECT * FROM tarefas ORDER BY id DESC'
        )

        res.json(tarefas)

    } catch (erro) {
        console.error(erro)

        res.status(500).json({
            mensagem: 'Erro ao buscar tarefas.'
        })
    }
})

// Iniciar servidor
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})


app.post('/api/tarefas', async (req, res) => {
    try {
        const { titulo, prioridade, prazo } = req.body

        if (!titulo || !titulo.trim()) {
            return res.status(400).json({
                mensagem: 'O título da tarefa é obrigatório.'
            })
        }

        const [resultado] = await conexao.query(
            `INSERT INTO tarefas (titulo, prioridade, prazo)
             VALUES (?, ?, ?)`,
            [titulo.trim(), prioridade || 'media', prazo || null]
        )

        res.status(201).json({
            id: resultado.insertId,
            titulo: titulo.trim(),
            prioridade: prioridade || 'media',
            prazo: prazo || null,
            concluida: false,
            mensagem: 'Tarefa cadastrada com sucesso!'
        })

    } catch (erro) {
        console.error(erro)

        res.status(500).json({
            mensagem: 'Erro ao cadastrar tarefa.'
        })
    }
})

app.put('/api/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, prioridade, prazo, concluida } = req.body

        if (!titulo || !titulo.trim()) {
            return res.status(400).json({
                mensagem: 'O título da tarefa é obrigatório.'
            })
        }

        const [resultado] = await conexao.query(
            `UPDATE tarefas
             SET titulo = ?, prioridade = ?, prazo = ?, concluida = ?
             WHERE id = ?`,
            [
                titulo.trim(),
                prioridade,
                prazo || null,
                concluida ?? false,
                id
            ]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            })
        }

        res.json({
            mensagem: 'Tarefa atualizada com sucesso!'
        })

    } catch (erro) {
        console.error(erro)

        res.status(500).json({
            mensagem: 'Erro ao editar tarefa.'
        })
    }
})

app.delete('/api/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params

        const [resultado] = await conexao.query(
            'DELETE FROM tarefas WHERE id = ?',
            [id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            })
        }

        res.json({
            mensagem: 'Tarefa excluída com sucesso!'
        })

    } catch (erro) {
        console.error(erro)

        res.status(500).json({
            mensagem: 'Erro ao excluir tarefa.'
        })
    }
})