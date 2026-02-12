# 📖 DIA 02 - Entendendo o Código

Este documento explica como o sistema E-SIC funciona, ajudando você a entender cada parte do código.

## 🏗️ Arquitetura Geral

O E-SIC é dividido em duas partes:

```
┌─────────────┐      HTTP/JSON      ┌─────────────┐      SQL      ┌──────────┐
│   FRONTEND  │ ←──────────────────→ │   BACKEND   │ ←────────────→│  SQLite  │
│  (React)    │      API REST       │  (Node.js)  │   Prisma      │   (DB)   │
└─────────────┘                     └─────────────┘               └──────────┘
```

- **Frontend**: Interface visual que o usuário vê (React + Tailwind CSS)
- **Backend**: Servidor que processa a lógica (Node.js + Express)
- **Banco de Dados**: Armazena os dados (SQLite + Prisma)

## 📂 Estrutura de Pastas

### Backend

```
backend/
├── prisma/
│   └── schema.prisma          # Define as tabelas do banco
├── src/
│   ├── config/                # Configurações (vazio por enquanto)
│   ├── controllers/           # Lógica de negócio
│   │   ├── authController.js      # Login e registro
│   │   └── solicitacaoController.js # CRUD de solicitações
│   ├── middleware/            # Funções intermediárias
│   │   └── auth.js                # Verifica se usuário está logado
│   ├── routes/                # Define as rotas da API
│   │   ├── auth.routes.js         # Rotas de autenticação
│   │   └── solicitacao.routes.js  # Rotas de solicitações
│   ├── utils/                 # Funções auxiliares
│   │   └── generateProtocol.js    # Gera protocolos únicos
│   └── server.js              # Arquivo principal do servidor
└── package.json               # Dependências do projeto
```

### Frontend

```
frontend/
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Layout.jsx             # Layout da aplicação
│   │   └── PrivateRoute.jsx       # Protege rotas autenticadas
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Login.jsx              # Tela de login
│   │   ├── Register.jsx           # Tela de cadastro
│   │   ├── Dashboard.jsx          # Página inicial
│   │   ├── NovaSolicitacao.jsx    # Criar solicitação
│   │   └── MinhasSolicitacoes.jsx # Listar solicitações
│   ├── context/               # Estado global
│   │   └── AuthContext.jsx        # Gerencia autenticação
│   ├── services/              # Comunicação com API
│   │   └── api.js                 # Configuração do Axios
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Ponto de entrada
│   └── index.css              # Estilos globais
└── package.json               # Dependências do projeto
```

## 🔐 Como Funciona a Autenticação (JWT)

### O que é JWT?

JWT (JSON Web Token) é como um "crachá digital" que prova quem você é.

### Fluxo de Autenticação

```
1. REGISTRO
┌─────────┐                    ┌─────────┐                 ┌──────┐
│ Usuario │                    │ Backend │                 │  DB  │
└────┬────┘                    └────┬────┘                 └──┬───┘
     │                              │                         │
     │ POST /api/auth/register      │                         │
     │ {nome, email, senha, ...}    │                         │
     ├─────────────────────────────→│                         │
     │                              │  Hash da senha          │
     │                              │  (bcrypt)               │
     │                              │                         │
     │                              │  Salva usuário          │
     │                              ├────────────────────────→│
     │                              │                         │
     │                              │  Usuário criado         │
     │   Sucesso!                   │←────────────────────────┤
     │←─────────────────────────────│                         │

2. LOGIN
┌─────────┐                    ┌─────────┐                 ┌──────┐
│ Usuario │                    │ Backend │                 │  DB  │
└────┬────┘                    └────┬────┘                 └──┬───┘
     │                              │                         │
     │ POST /api/auth/login         │                         │
     │ {email, senha}               │                         │
     ├─────────────────────────────→│                         │
     │                              │  Busca usuário          │
     │                              ├────────────────────────→│
     │                              │                         │
     │                              │  Dados do usuário       │
     │                              │←────────────────────────┤
     │                              │                         │
     │                              │  Compara senhas         │
     │                              │  (bcrypt.compare)       │
     │                              │                         │
     │                              │  Gera TOKEN JWT         │
     │  Token + dados do usuário    │  (jsonwebtoken)         │
     │←─────────────────────────────│                         │
     │                              │                         │
     │  Salva token no localStorage │                         │
     │                              │                         │

3. REQUISIÇÕES AUTENTICADAS
┌─────────┐                    ┌─────────┐
│ Usuario │                    │ Backend │
└────┬────┘                    └────┬────┘
     │                              │
     │ GET /api/solicitacoes        │
     │ Header: Authorization:       │
     │         Bearer TOKEN_AQUI    │
     ├─────────────────────────────→│
     │                              │  Middleware verifica token
     │                              │  (auth.js)
     │                              │
     │                              │  Token válido?
     │                              │  ├─ Sim: permite acesso
     │                              │  └─ Não: retorna erro 401
     │   Dados solicitados          │
     │←─────────────────────────────│
```

### Código Simplificado

**Login (backend)**:
```javascript
// 1. Recebe email e senha
const { email, senha } = req.body;

// 2. Busca usuário no banco
const user = await prisma.user.findUnique({ where: { email } });

// 3. Verifica se a senha está correta
const valid = await bcrypt.compare(senha, user.senha);

// 4. Gera o token JWT
const token = jwt.sign({ id: user.id, email: user.email }, SECRET);

// 5. Retorna o token
res.json({ token, user });
```

**Uso do Token (frontend)**:
```javascript
// Quando o usuário faz login, salva o token
localStorage.setItem('token', token);

// Em toda requisição, envia o token no header
headers: {
  Authorization: `Bearer ${token}`
}
```

**Verificação (backend)**:
```javascript
// Middleware pega o token do header
const token = req.headers.authorization.split(' ')[1];

// Verifica se o token é válido
const user = jwt.verify(token, SECRET);

// Se válido, permite o acesso
req.user = user; // Adiciona dados do usuário na requisição
next();
```

## 🗄️ Como Funciona o Prisma ORM

### O que é ORM?

ORM (Object-Relational Mapping) permite trabalhar com banco de dados usando JavaScript, sem escrever SQL.

### Schema do Prisma

```prisma
// Define a tabela User
model User {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  // ... outros campos
  
  solicitacoes Solicitacao[] // Um usuário tem várias solicitações
}

// Define a tabela Solicitacao
model Solicitacao {
  id               Int      @id @default(autoincrement())
  protocolo        String   @unique
  usuarioId        Int
  // ... outros campos
  
  usuario User @relation(fields: [usuarioId], references: [id])
}
```

### Usando o Prisma

**Criar um usuário**:
```javascript
const user = await prisma.user.create({
  data: {
    nome: "João Silva",
    email: "joao@email.com",
    senha: hashedPassword
  }
});
```

**Buscar um usuário**:
```javascript
const user = await prisma.user.findUnique({
  where: { email: "joao@email.com" }
});
```

**Listar solicitações com dados do usuário**:
```javascript
const solicitacoes = await prisma.solicitacao.findMany({
  where: { usuarioId: 1 },
  include: {
    usuario: true  // Inclui dados do usuário
  }
});
```

## 🔄 Fluxo de Dados: Frontend → Backend → Database

### Exemplo: Criar uma Solicitação

**1. Usuário preenche o formulário (Frontend)**
```javascript
// NovaSolicitacao.jsx
const handleSubmit = async (e) => {
  const response = await api.post('/solicitacoes', {
    categoria: 'Saúde',
    descricao: 'Quero saber sobre...',
    formaRecebimento: 'portal'
  });
};
```

**2. Requisição vai para o backend**
```javascript
// api.js (interceptor adiciona o token automaticamente)
headers: {
  Authorization: `Bearer ${token}`
}
```

**3. Backend recebe e processa**
```javascript
// solicitacaoController.js
export const createSolicitacao = async (req, res) => {
  // Pega dados da requisição
  const { categoria, descricao, formaRecebimento } = req.body;
  const usuarioId = req.user.id; // Vem do token JWT
  
  // Gera protocolo único
  const protocolo = generateProtocol();
  
  // Salva no banco
  const solicitacao = await prisma.solicitacao.create({
    data: {
      protocolo,
      usuarioId,
      categoria,
      descricao,
      formaRecebimento,
      prazoResposta: calculateDeadline(),
      status: 'pendente'
    }
  });
  
  // Retorna resposta
  res.json({ solicitacao });
};
```

**4. Frontend recebe a resposta**
```javascript
// NovaSolicitacao.jsx
const response = await api.post('/solicitacoes', formData);
const protocolo = response.data.solicitacao.protocolo;

// Redireciona com mensagem de sucesso
navigate('/minhas-solicitacoes', {
  state: { 
    message: `Solicitação criada! Protocolo: ${protocolo}` 
  }
});
```

## 🎨 Como Funciona o React

### Componentes

Componentes são como "blocos de LEGO" que você junta para criar a interface.

```javascript
// Componente simples
function MinhasSolicitacoes() {
  return (
    <div>
      <h1>Minhas Solicitações</h1>
      <p>Lista de solicitações...</p>
    </div>
  );
}
```

### Estado (State)

Estado é a "memória" do componente, armazena dados que podem mudar.

```javascript
// useState cria uma variável de estado
const [solicitacoes, setSolicitacoes] = useState([]);

// Para atualizar:
setSolicitacoes([...novasSolicitacoes]);
```

### Efeitos (useEffect)

Executa código quando o componente é montado ou atualizado.

```javascript
// Carrega dados quando a página abre
useEffect(() => {
  loadSolicitacoes();
}, []); // [] = executa apenas uma vez
```

### Context API

Compartilha dados entre componentes sem passar props.

```javascript
// AuthContext.jsx - Cria o contexto
const AuthContext = createContext({});

// Fornece dados para toda a aplicação
<AuthContext.Provider value={{ user, login, logout }}>
  {children}
</AuthContext.Provider>

// Usa os dados em qualquer componente
const { user, logout } = useAuth();
```

## 🛣️ Como Funcionam as Rotas

### Backend (Express)

```javascript
// Define rotas
router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login

// Rota protegida (usa middleware)
router.get('/solicitacoes', authenticateToken, listSolicitacoes);
```

### Frontend (React Router)

```javascript
<Routes>
  {/* Rota pública */}
  <Route path="/login" element={<Login />} />
  
  {/* Rota protegida */}
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
</Routes>
```

## 🎯 Conceitos Importantes

### 1. API REST

- **REST** = Representational State Transfer
- Usa HTTP (GET, POST, PUT, DELETE)
- Troca dados em JSON

```javascript
GET    /api/solicitacoes      → Lista todas
POST   /api/solicitacoes      → Cria nova
GET    /api/solicitacoes/123  → Busca específica
PUT    /api/solicitacoes/123  → Atualiza
DELETE /api/solicitacoes/123  → Deleta
```

### 2. Async/Await

Trabalha com operações assíncronas (banco de dados, APIs).

```javascript
// Sem async/await (complicado)
prisma.user.findUnique({ where: { id: 1 } })
  .then(user => console.log(user))
  .catch(error => console.error(error));

// Com async/await (mais limpo)
try {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  console.log(user);
} catch (error) {
  console.error(error);
}
```

### 3. Middleware

Função que é executada ANTES do controller.

```javascript
// Ordem de execução:
Request → Middleware → Controller → Response
          (verifica    (processa
           token)       lógica)
```

### 4. Environment Variables (.env)

Armazena configurações sensíveis fora do código.

```env
JWT_SECRET=meu-segredo-super-secreto
DATABASE_URL=file:./dev.db
```

```javascript
// Acessa no código
const secret = process.env.JWT_SECRET;
```

## 📊 Fluxo Completo: Do Click ao Banco de Dados

```
1. Usuário clica em "Criar Solicitação"
   ↓
2. React renderiza o formulário
   ↓
3. Usuário preenche e clica em "Enviar"
   ↓
4. handleSubmit() é executado
   ↓
5. api.post() envia dados para http://localhost:3001/api/solicitacoes
   (Axios adiciona token JWT automaticamente)
   ↓
6. Express recebe a requisição
   ↓
7. Middleware authenticateToken verifica o token
   ├─ Token inválido → Retorna erro 401
   └─ Token válido → Continua
   ↓
8. Controller createSolicitacao é executado
   ↓
9. Gera protocolo único (ESIC-20260212-00001)
   ↓
10. Prisma salva no banco de dados SQLite
    ↓
11. Backend retorna JSON com a solicitação criada
    ↓
12. Frontend recebe a resposta
    ↓
13. Redireciona para "Minhas Solicitações" com mensagem de sucesso
    ↓
14. Usuário vê a solicitação na lista
```

## 🧩 Glossário de Termos

- **API**: Interface para comunicação entre sistemas
- **Backend**: Parte do sistema que roda no servidor
- **Frontend**: Parte do sistema que roda no navegador
- **JWT**: Token de autenticação
- **ORM**: Ferramenta para trabalhar com banco de dados
- **Component**: Bloco reutilizável de interface
- **State**: Dados que podem mudar no componente
- **Props**: Dados passados de pai para filho
- **Route**: Caminho de URL (ex: /login, /dashboard)
- **Middleware**: Função executada entre requisição e resposta
- **Hash**: Transformação irreversível de dados (usado em senhas)

## 🎓 Próximos Passos

Agora que você entende como tudo funciona:

1. ✅ Experimente modificar um componente React
2. ✅ Adicione um novo campo no formulário
3. ✅ Crie uma nova rota no backend
4. ✅ Leia o código comentado linha por linha
5. ✅ Veja o **CRONOGRAMA-COMPLETO.md** para o plano de 30 dias

## 💡 Dicas de Estudo

- **Leia os comentários no código**: Todos os arquivos têm explicações
- **Use o console.log()**: Para entender o fluxo dos dados
- **Teste pequenas mudanças**: Mude uma cor, um texto, veja o resultado
- **Use o Prisma Studio**: `npx prisma studio` para ver os dados
- **Leia a documentação oficial**: Links no DIA-01-SETUP.md

---

**Continue aprendendo! 📚 Próximo: CRONOGRAMA-COMPLETO.md**
