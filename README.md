# TaskFlow — Gerenciador de Tarefas

O **TaskFlow** é uma aplicação web desenvolvida para facilitar a organização e o gerenciamento de tarefas. Com uma interface intuitiva, permite cadastrar atividades, definir prioridades, estabelecer prazos e acompanhar o progresso das tarefas.

O projeto foi desenvolvido com React no frontend, Node.js e Express no backend, utilizando MySQL para armazenamento dos dados.

## Funcionalidades

- **Cadastro de tarefas:** adicione novas tarefas com título, prioridade e prazo.
- **Listagem de tarefas:** visualize todas as tarefas cadastradas.
- **Edição de tarefas:** atualize as informações de uma tarefa.
- **Exclusão de tarefas:** remova tarefas com confirmação antes da exclusão.
- **Conclusão de tarefas:** marque atividades como concluídas ou pendentes.
- **Filtros:** filtre tarefas por status e prioridade.
- **Dashboard:** acompanhe o total de tarefas, pendentes e concluídas.
- **Validações:** verifique os campos antes de cadastrar ou editar.
- **Notificações:** receba mensagens de sucesso, erro e aviso durante as operações.

## Tecnologias utilizadas

**Frontend**
- React
- JavaScript
- HTML5
- CSS3
- Vite

**Backend**
- Node.js
- Express
- JavaScript
- MySQL

**Ferramentas**
- Visual Studio Code
- MySQL Workbench
- Git e GitHub
- Postman

## Interface

A aplicação possui um dashboard com resumo das tarefas, formulário de cadastro e edição, filtros e listagem de atividades.

## Como executar o projeto

### Pré-requisitos

- Node.js
- npm
- MySQL

### 1. Clone o repositório

```bash
git clone URL_DO_SEU_REPOSITORIO
```

### 2. Configure o banco de dados

Crie um banco de dados MySQL:

```sql
CREATE DATABASE taskflow;
```

Configure a conexão com o banco de dados no arquivo `.env` do backend.

### 3. Execute o backend

Acesse a pasta do backend e instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` com as informações de conexão do MySQL.

Inicie o servidor:

```bash
npm run dev
```

O backend estará disponível em:

```text
http://localhost:3000
```

### 4. Execute o frontend

Em outro terminal, acesse a pasta do frontend e instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

## Build de produção

Para gerar a versão otimizada do frontend:

```bash
npm run build
```

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

## Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de praticar e aprofundar conhecimentos em desenvolvimento web, especialmente na construção de aplicações React integradas a uma API REST, manipulação de dados e operações CRUD com banco de dados MySQL.

## Autora

Desenvolvido por **Giovana Correia**.

Desenvolvedora com formação técnica em Desenvolvimento de Sistemas e interesse em desenvolvimento Front-end e Full Stack.
