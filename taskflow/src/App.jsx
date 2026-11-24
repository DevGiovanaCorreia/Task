const API_URL = 'http://localhost:3000/api/tarefas'

import { useState, useEffect } from 'react'
import './App.css'

function App() {

    
    const [tarefas, setTarefas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    const [idEditando, setIdEditando] = useState(null)

    const [novaTarefa, setNovaTarefa] = useState('')
    const [prioridade, setPrioridade] = useState('media')
    const [prazo, setPrazo] = useState('')

    const [filtroStatus, setFiltroStatus] = useState('todas')
    const [filtroPrioridade, setFiltroPrioridade] = useState('todas')

    const [mensagem,setMensagem] = useState('')
    const [tipoMensagem,setTipoMensagem]= useState('')
    const [salvando,setSalvando]= useState(false)

    const [idParaExcluir, setIdParaExcluir] = useState(null)


    
    useEffect(() => {

        async function buscarTarefas() {
            try {
                const resposta = await fetch(API_URL)

                if (!resposta.ok) {
                    throw new Error('Erro ao buscar tarefas.')
                }

                const dados = await resposta.json()

                setTarefas(dados)

            } catch (erro) {
                 console.error('Erro ao buscar tarefas:', erro)
    setErro(erro.message)
            } finally {
                setCarregando(false)
            }
        }

        buscarTarefas()

    }, [])


    
    function limparFormulario() {
        setIdEditando(null)
        setNovaTarefa('')
        setPrioridade('media')
        setPrazo('')
    }


    
   async function adicionarTarefa(e) {
    e.preventDefault()

    const titulo = novaTarefa.trim()

    
    if (!titulo) {
        exibirMensagem('Digite o título da tarefa.','aviso')
        return
    }

    if (titulo.length > 100) {
        exibirMensagem('O título deve ter no máximo 100 caracteres.','aviso')
        return
    }

    
    if (!prioridade) {
        exibirMensagem('Selecione uma prioridade.','aviso')
        return
    }

    
    if (!prazo) {
        exibirMensagem('Selecione uma data para a tarefa.','aviso')
        return
    }

    try {
        setSalvando(true)
        setMensagem('')

        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                prioridade,
                prazo
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao cadastrar tarefa.')
        }

        setTarefas(anteriores => [...anteriores, dados])

        limparFormulario()

        exibirMensagem('Tarefa cadastrada com sucesso!','sucesso')

    } catch (erro) {
        console.error(erro)
        setMensagem(erro.message || 'Não foi possível cadastrar a tarefa.')
    } finally {
        setSalvando(false)
    }
}


    
   async function concluirTarefa(id) {
    const tarefaAtual = tarefas.find(tarefa => tarefa.id === id)

    if (!tarefaAtual) return

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concluida: !Boolean(tarefaAtual.concluida)
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao atualizar tarefa.')
        }

        setTarefas(anteriores =>
            anteriores.map(tarefa =>
                tarefa.id === id
                    ? { ...tarefa, concluida: !Boolean(tarefa.concluida) }
                    : tarefa
            )
        )

        exibirMensagem(
            tarefaAtual.concluida
                ? 'Tarefa marcada como pendente!'
                : 'Tarefa concluída com sucesso!',
            'sucesso'
        )

    } catch (erro) {
        console.error(erro)
        exibirMensagem(
            erro.message || 'Não foi possível atualizar a tarefa.',
            'erro'
        )
    }
}


    


    
    function editarTarefa(tarefa) {
        setIdEditando(tarefa.id)
        setNovaTarefa(tarefa.titulo)
        setPrioridade(tarefa.prioridade)
        setPrazo(tarefa.prazo || '')
    }


    
    async function salvarEdicao(e) {
    e.preventDefault()

    if (!novaTarefa.trim()) {
        exibirMensagem('Digite o título da tarefa.', 'aviso')
        return
    }

    if (novaTarefa.trim().length > 100) {
        exibirMensagem('O título deve ter no máximo 100 caracteres.', 'aviso')
        return
    }

    const tarefaAtual = tarefas.find(
        tarefa => tarefa.id === idEditando
    )

    if (!tarefaAtual) {
        return
    }

    try {
        setSalvando(true)

        const resposta = await fetch(`${API_URL}/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: novaTarefa.trim(),
                prioridade,
                prazo: prazo || null,
                concluida: Boolean(tarefaAtual.concluida)
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao editar tarefa.')
        }

        setTarefas(anteriores =>
            anteriores.map(tarefa =>
                tarefa.id === idEditando
                    ? {
                        ...tarefa,
                        titulo: novaTarefa.trim(),
                        prioridade,
                        prazo: prazo || null
                    }
                    : tarefa
            )
        )

        limparFormulario()

        exibirMensagem('Tarefa editada com sucesso!', 'sucesso')

    } catch (erro) {
        console.error(erro)

        exibirMensagem(
            erro.message || 'Não foi possível editar a tarefa.',
            'erro'
        )

    } finally {
        setSalvando(false)
    }
}

    
    const concluidas = tarefas.filter(
        tarefa => Boolean(tarefa.concluida)
    ).length

    const pendentes = tarefas.length - concluidas


    
    const tarefasFiltradas = tarefas.filter(tarefa => {

        const correspondeStatus =
            filtroStatus === 'todas' ||
            (filtroStatus === 'pendentes' && !Boolean(tarefa.concluida)) ||
            (filtroStatus === 'concluidas' && Boolean(tarefa.concluida))

        const correspondePrioridade =
            filtroPrioridade === 'todas' ||
            tarefa.prioridade === filtroPrioridade

        return correspondeStatus && correspondePrioridade
    })

    function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem(texto)
    setTipoMensagem(tipo)
}

function excluirTarefa(id) {
    setIdParaExcluir(id)
}

async function confirmarExclusao() {
    try {
        const resposta = await fetch(`${API_URL}/${idParaExcluir}`, {
            method: 'DELETE'
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao excluir tarefa.')
        }

        setTarefas(anteriores =>
            anteriores.filter(tarefa => tarefa.id !== idParaExcluir)
        )

        setIdParaExcluir(null)

        exibirMensagem('Tarefa excluída com sucesso!', 'sucesso')

    } catch (erro) {
        console.error(erro)

        setIdParaExcluir(null)

        exibirMensagem(
            erro.message || 'Não foi possível excluir a tarefa.',
            'erro'
        )
    }
}


    
    return (
        <div className="container">

            <aside className="sidebar">

                <h2>TaskFlow</h2>

                <nav>
                    <a href="#dashboard">Dashboard</a>
                    <a href="#tarefas">Minhas tarefas</a>
                </nav>

            </aside>


            <main className="main">

                <header className="header">
                    <h1>Olá, seja bem-vinda!</h1>
                    <p>
                        Organize suas tarefas e acompanhe seu progresso.
                    </p>
                </header>


                {/* Dashboard */}
                <section className="resumo" id="dashboard">

                    <div className="card">
                        <h3>Total de tarefas</h3>
                        <p>{tarefas.length}</p>
                    </div>

                    <div className="card">
                        <h3>Pendentes</h3>
                        <p>{pendentes}</p>
                    </div>

                    <div className="card">
                        <h3>Concluídas</h3>
                        <p>{concluidas}</p>
                    </div>

                </section>


                
                <section className="tarefas" id="tarefas">

                    <h2>Minhas tarefas</h2>


                    
                   <form onSubmit={idEditando !== null ? salvarEdicao : adicionarTarefa}>

    <input
        type="text"
        placeholder="Digite uma nova tarefa..."
        value={novaTarefa}
        onChange={e => setNovaTarefa(e.target.value)}
    />

    <select
        value={prioridade}
        onChange={e => setPrioridade(e.target.value)}
    >
        <option value="baixa">Prioridade baixa</option>
        <option value="media">Prioridade média</option>
        <option value="alta">Prioridade alta</option>
    </select>

    <input
        type="date"
        value={prazo}
        onChange={e => setPrazo(e.target.value)}
        
    />

    <button type="submit" disabled={salvando}>
        {salvando
            ? 'Salvando...'
            : idEditando !== null
                ? 'Salvar alterações'
                : 'Adicionar tarefa'}
    </button>

    {idEditando !== null && (
        <button
            type="button"
            onClick={limparFormulario}
        >
            Cancelar edição
        </button>
    )}

    {mensagem && (
        <div
            className={`notificacao ${tipoMensagem}`}
            role="alert"
        >
            <span className="notificacao-icone">
                {tipoMensagem === 'sucesso' && '✓'}
                {tipoMensagem === 'erro' && '✕'}
                {tipoMensagem === 'aviso' && '⚠'}
            </span>

            <span>{mensagem}</span>

            <button
                type="button"
                className="fechar-notificacao"
                onClick={() => setMensagem('')}
                aria-label="Fechar notificação"
            >
                ×
            </button>
        </div>
    )}

</form> 


                    
                    <div className="filtros">

                        <select
                            value={filtroStatus}
                            onChange={e => setFiltroStatus(e.target.value)}
                        >
                            <option value="todas">Todas as tarefas</option>
                            <option value="pendentes">Pendentes</option>
                            <option value="concluidas">Concluídas</option>
                        </select>

                        <select
                            value={filtroPrioridade}
                            onChange={e => setFiltroPrioridade(e.target.value)}
                        >
                            <option value="todas">Todas as prioridades</option>
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </select>

                    </div>


                    
                    <div className="lista-tarefas">

                  


                        {carregando ? (

                            <p>Carregando tarefas...</p>

                        ) : erro ? (

                            <p>{erro}</p>

                        ) : tarefasFiltradas.length === 0 ? (

                            <p>Nenhuma tarefa encontrada.</p>

                        ) : (

                            tarefasFiltradas.map(tarefa => (

                                <div
                                    className="item-tarefa"
                                    key={tarefa.id}
                                >

                                    <div className="informacoes-tarefa">

                                        <span className={
                                            Boolean(tarefa.concluida)
                                                ? 'concluida'
                                                : ''
                                        }>
                                            {tarefa.titulo}
                                        </span>

                                        <div className="detalhes-tarefa">

                                            <span className={`prioridade ${tarefa.prioridade}`}>
                                                {tarefa.prioridade === 'baixa'
                                                    ? 'Baixa'
                                                    : tarefa.prioridade === 'media'
                                                        ? 'Média'
                                                        : 'Alta'}
                                            </span>

                                            {tarefa.prazo && (
                                                <span className="prazo">
                                                    Prazo: {String(tarefa.prazo).split('-').reverse().join('/')}
                                                </span>
                                            )}

                                        </div>

                                    </div>


                                    <div className="acoes">

                                        <button
                                            type="button"
                                            onClick={() => concluirTarefa(tarefa.id)}
                                        >
                                            {Boolean(tarefa.concluida)
                                                ? 'Desfazer'
                                                : 'Concluir'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => excluirTarefa(tarefa.id)}
                                        >
                                            Excluir
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => editarTarefa(tarefa)}
                                        >
                                            Editar
                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </section>

            </main>


 { idParaExcluir !== null && (
    <div className="modal-overlay">
        <div className="modal-confirmacao">
            <div className="modal-icone">!</div>

            <h3>Excluir tarefa?</h3>

            <p>
                Tem certeza que deseja excluir esta tarefa?
                Essa ação não poderá ser desfeita.
            </p>

            <div className="modal-acoes">
                <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setIdParaExcluir(null)}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    className="btn-excluir"
                    onClick={confirmarExclusao}
                >
                    Sim, excluir
                </button>
            </div>
        </div>
    </div>
)}

        </div>

       
    )
}

export default App