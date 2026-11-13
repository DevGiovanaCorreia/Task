
import './App.css'

function App() {
  

  return (
  <div className="container">
   
   <aside className="sidebar">
    <h2>TaskFlow</h2>

    <nav>
      <a href="#">Dashboard</a>
      <a href="#">Minhas tarefas</a>
      <a href="#">Concluidas</a>
    </nav>
</aside>

<main className="main">
  <header className='header'>
    <div>
      <h1>Olá seja bem-vinda</h1>
      <p>Organize suas tarefas e acompanhe seu proguesso.</p>
    </div>
  </header>

  <section className='resumo'>
    <div className="card">
      <h3>Total de tarefas </h3>
      <p>0</p>
    </div>

    <div className="card">
      <h3>Pendentes</h3>
      <p>0</p>
    </div>

    <div className="card">
      <h3>Concluidas</h3>
      <p>0</p>
    </div>
  </section>

  <section className="tarefas">
    <h2>Minhas tarefas</h2>

    <button type='button'> + Nova tarefa</button>

    <p>nenhuma tarefa cadastrada.</p>
  </section>



</main>


















  </div>

  )
  
}

export default App
