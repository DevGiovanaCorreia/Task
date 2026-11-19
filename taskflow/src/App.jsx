const API_URL = 'http://localhost:3000/api/tarefas'

import { useState, useEffect } from 'react'
import './App.css'

function App() {

    // Estados
    const [tarefas, setTarefas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    const [idEditando, setIdEditando] = useState(null)

    const [novaTarefa, setNovaTarefa] = useState('')
    const [prioridade, setPrioridade] = useState('media')
    const [prazo, setPrazo] = useState('')

    const [filtroStatus, setFiltroStatus] = useState('todas')
    const [filtroPrioridade, setFiltroPrioridade] = useState('todas')


    // Buscar tarefas no banco de dados
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


    // Limpar formulário
    function limparFormulario() {
        setIdEditando(null)
        setNovaTarefa('')
        setPrioridade('media')
        setPrazo('')
    }


    // Adicionar tarefa
    async function adicionarTarefa(e) {
        e.preventDefault()

        if (!novaTarefa.trim()) {
            return
        }

        try {
            const resposta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: novaTarefa.trim(),
                    prioridade,
                    prazo: prazo || null
                })
            })

            if (!resposta.ok) {
                throw new Error('Erro ao cadastrar tarefa.')
            }

            const tarefaSalva = await resposta.json()

            setTarefas(anteriores => [...anteriores, tarefaSalva])

            limparFormulario()

        } catch (erro) {
            console.error(erro)
            alert('Não foi possível cadastrar a tarefa.')
        }
    }


    // Concluir ou desfazer tarefa
    async function concluirTarefa(id) {

        const tarefaAtual = tarefas.find(tarefa => tarefa.id === id)

        if (!tarefaAtual) {
            return
        }

        const novaSituacao = !Boolean(tarefaAtual.concluida)

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: tarefaAtual.titulo,
                    prioridade: tarefaAtual.prioridade,
                    prazo: tarefaAtual.prazo,
                    concluida: novaSituacao
                })
            })

            if (!resposta.ok) {
                throw new Error('Erro ao atualizar tarefa.')
            }

            setTarefas(anteriores =>
                anteriores.map(tarefa =>
                    tarefa.id === id
                        ? { ...tarefa, concluida: novaSituacao }
                        : tarefa
                )
            )

        } catch (erro) {
            console.error(erro)
            alert('Não foi possível atualizar a tarefa.')
        }
    }


    // Excluir tarefa
    async function excluirTarefa(id) {

        const confirmar = window.confirm(
            'Tem certeza que deseja excluir esta tarefa?'
        )

        if (!confirmar) {
            return
        }

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })

            if (!resposta.ok) {
                throw new Error('Erro ao excluir tarefa.')
            }

            setTarefas(anteriores =>
                anteriores.filter(tarefa => tarefa.id !== id)
            )

        } catch (erro) {
            console.error(erro)
            alert('Não foi possível excluir a tarefa.')
        }
    }


    // Selecionar tarefa para edição
    function editarTarefa(tarefa) {
        setIdEditando(tarefa.id)
        setNovaTarefa(tarefa.titulo)
        setPrioridade(tarefa.prioridade)
        setPrazo(tarefa.prazo || '')
    }


    // Salvar edição
    async function salvarEdicao(e) {
        e.preventDefault()

        if (!novaTarefa.trim()) {
            return
        }

        const tarefaAtual = tarefas.find(
            tarefa => tarefa.id === idEditando
        )

        if (!tarefaAtual) {
            return
        }

        try {
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

            if (!resposta.ok) {
                throw new Error('Erro ao editar tarefa.')
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

        } catch (erro) {
            console.error(erro)
            alert('Não foi possível editar a tarefa.')
        }
    }


    // Indicadores do Dashboard
    const concluidas = tarefas.filter(
        tarefa => Boolean(tarefa.concluida)
    ).length

    const pendentes = tarefas.length - concluidas


    // Filtrar tarefas
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


    // Interface
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


                {/* Lista de tarefas */}
                <section className="tarefas" id="tarefas">

                    <h2>Minhas tarefas</h2>


                    {/* Formulário */}
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

                        <button type="submit">
                            {idEditando !== null
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

                    </form>


                    {/* Filtros */}
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


                    {/* Exibição das tarefas */}
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

        </div>
    )
}

export default App