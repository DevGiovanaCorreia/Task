import { useState ,useEffect} from 'react'
import './App.css'

function App() {

  // Estado das tarefas
  const [tarefas, setTarefas] = useState(() => {

  const tarefasSalvas = localStorage.getItem('taskflow-tarefas')

  if (tarefasSalvas) {
    try {
      const dados = JSON.parse(tarefasSalvas)

      return Array.isArray(dados) ? dados : []

    } catch {
      return []
    }
  }

  return []

})

useEffect(() => {

  localStorage.setItem(
    'taskflow-tarefas',
    JSON.stringify(tarefas)
  )

}, [tarefas])

  // Estado do campo de texto
  const [novaTarefa, setNovaTarefa] = useState('')

  const [prioridade, setPrioridade] = useState('media')
  const [prazo, setPrazo] = useState('')

  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas')

  // Adicionar tarefa
  function adicionarTarefa(e) {
    e.preventDefault()

    if (novaTarefa.trim() === '') {
      return
    }

    const tarefa = {
      id: Date.now(),
      titulo: novaTarefa.trim(),
      prioridade: prioridade,
      prazo: prazo,
      concluida: false
    }

    setTarefas(anteriores => [...anteriores, tarefa])

    setNovaTarefa('')
    setPrioridade('media')
    setPrazo('')
  }

  // Concluir ou reabrir tarefa
  function concluirTarefa(id) {
    setTarefas(anteriores =>
      anteriores.map(tarefa =>
        tarefa.id === id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      )
    )
  }

  // Excluir tarefa
  function excluirTarefa(id) {
    setTarefas(anteriores =>
      anteriores.filter(tarefa => tarefa.id !== id)
    )
  }

  // Contadores
  const concluidas = tarefas.filter(
    tarefa => tarefa.concluida
  ).length

  const pendentes = tarefas.length - concluidas

  // Aplicar filtros
  const tarefasFiltradas = tarefas.filter(tarefa => {

    const correspondeStatus =
      filtroStatus === 'todas' ||
      (filtroStatus === 'pendentes' && !tarefa.concluida) ||
      (filtroStatus === 'concluidas' && tarefa.concluida)

    const correspondePrioridade =
      filtroPrioridade === 'todas' ||
      tarefa.prioridade === filtroPrioridade

    return correspondeStatus && correspondePrioridade
  })

  return (
     <div className="container">

      <aside className="sidebar">
        <h2>TaskFlow</h2>

        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Minhas tarefas</a>
          <a href="#">Concluídas</a>
        </nav>
      </aside>

      <main className="main">

        <header className="header">
          <h1>Olá, seja bem-vinda!</h1>
          <p>Organize suas tarefas e acompanhe seu progresso.</p>
        </header>

        {/* Resumo */}
        <section className="resumo">

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

        {/* Cadastro */}
        <section className="tarefas">

          <h2>Minhas tarefas</h2>

          <form onSubmit={adicionarTarefa}>

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
              + Adicionar
            </button>

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

          {/* Lista */}
          <div className="lista-tarefas">

            {tarefasFiltradas.length === 0 ? (

              <p>Nenhuma tarefa encontrada.</p>

            ) : (

              tarefasFiltradas.map(tarefa => (

                <div className="item-tarefa" key={tarefa.id}>

                  <div className="informacoes-tarefa">

                    <span className={
                      tarefa.concluida ? 'concluida' : ''
                    }>
                      {tarefa.titulo}
                    </span>

                    <div className="detalhes-tarefa">

                      <span className={`prioridade ${tarefa.prioridade}`}>
                        {tarefa.prioridade === 'baixa' ? 'Baixa' :
                         tarefa.prioridade === 'media' ? 'Média' : 'Alta'}
                      </span>

                      {tarefa.prazo && (
                        <span className="prazo">
                          Prazo: {tarefa.prazo.split('-').reverse().join('/')}
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="acoes">

                    <button
                      type="button"
                      onClick={() => concluirTarefa(tarefa.id)}
                    >
                      {tarefa.concluida ? 'Desfazer' : 'Concluir'}
                    </button>

                    <button
                      type="button"
                      onClick={() => excluirTarefa(tarefa.id)}
                    >
                      Excluir
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