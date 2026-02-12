# 🏛️ E-SIC - Sistema de Informação ao Cidadão

Sistema completo para gestão de solicitações de informação baseado na Lei de Acesso à Informação (LAI - Lei nº 12.527/2011).

## 📋 Sobre o Projeto

O E-SIC é um sistema web que permite aos cidadãos solicitarem informações públicas e acompanharem o andamento de suas solicitações, conforme garantido pela Lei de Acesso à Informação.

### ✨ Funcionalidades

- ✅ **Autenticação JWT** - Sistema seguro de login e registro
- ✅ **Gestão de Solicitações** - Criar, listar e acompanhar solicitações
- ✅ **Protocolos Únicos** - Cada solicitação recebe um protocolo no formato ESIC-YYYYMMDD-XXXXX
- ✅ **Dashboard Interativo** - Visualização de estatísticas e status
- ✅ **Controle de Prazos** - Cálculo automático de prazo de resposta (20 dias úteis)
- ✅ **Interface Responsiva** - Design moderno com Tailwind CSS

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

### Frontend
- **React** - Biblioteca para interfaces
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Router** - Gerenciamento de rotas

## 📦 Estrutura do Projeto

```
esic-prefeitura/
├── backend/                    # Servidor Node.js
│   ├── prisma/                # Schema e migrations do banco
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── middleware/        # Autenticação e validações
│   │   ├── routes/            # Rotas da API
│   │   ├── utils/             # Funções auxiliares
│   │   └── server.js          # Ponto de entrada
│   └── package.json
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── context/           # Estado global
│   │   ├── services/          # Comunicação com API
│   │   └── App.jsx
│   └── package.json
└── docs/                       # Documentação completa
    ├── DIA-01-SETUP.md
    ├── DIA-02-ENTENDENDO-CODIGO.md
    └── CRONOGRAMA-COMPLETO.md
```

## 🎯 Começando

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Git

### Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/DalmoVieira/esic-prefeitura.git
cd esic-prefeitura
```

#### 2. Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

O backend estará rodando em `http://localhost:3001`

#### 3. Configure o Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 🧪 Testando o Sistema

1. Acesse `http://localhost:5173`
2. Clique em "Cadastre-se"
3. Preencha o formulário de registro
4. Faça login com suas credenciais
5. Crie uma nova solicitação
6. Acompanhe no dashboard

## 📚 Documentação

- **[DIA-01-SETUP.md](docs/DIA-01-SETUP.md)** - Guia completo de instalação e configuração
- **[DIA-02-ENTENDENDO-CODIGO.md](docs/DIA-02-ENTENDENDO-CODIGO.md)** - Explicação detalhada do código
- **[CRONOGRAMA-COMPLETO.md](docs/CRONOGRAMA-COMPLETO.md)** - Plano de estudos de 30 dias

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Validação de dados no backend
- Proteção de rotas privadas
- CORS configurado

## 🎓 Para Desenvolvedores

Este projeto foi criado com foco educacional, contendo:

- 📝 **Código comentado em português** - Cada arquivo tem explicações detalhadas
- 📖 **Documentação completa** - Guias passo a passo
- 🎯 **Cronograma de estudos** - 30 dias de aprendizado
- 💡 **Boas práticas** - Exemplos de arquitetura e organização

### API Endpoints

#### Autenticação
```
POST /api/auth/register  # Registrar usuário
POST /api/auth/login     # Fazer login
```

#### Solicitações
```
POST /api/solicitacoes           # Criar solicitação
GET  /api/solicitacoes           # Listar minhas solicitações
GET  /api/solicitacoes/:protocolo # Buscar por protocolo
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto educacional para aprendizado de desenvolvimento web full stack.

## 🙏 Agradecimentos

- Lei de Acesso à Informação (LAI)
- Comunidade open source
- Todos que contribuíram com feedback

---

**⭐ Se este projeto te ajudou, considere dar uma estrela!**
