# 📦 DIA 01 - Setup e Instalação do Projeto E-SIC

Este guia mostra como configurar e rodar o projeto E-SIC pela primeira vez.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **Git** - [Download aqui](https://git-scm.com/)
- Um editor de código (recomendamos o **VS Code**)

Para verificar se está tudo instalado:

```bash
node --version  # Deve mostrar v18.0.0 ou superior
npm --version   # Deve mostrar 9.0.0 ou superior
git --version   # Deve mostrar a versão do Git
```

## 🚀 Passo a Passo

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/esic-prefeitura.git
cd esic-prefeitura
```

### 2️⃣ Configurar o Backend

#### 2.1. Entre na pasta do backend
```bash
cd backend
```

#### 2.2. Instale as dependências
```bash
npm install
```

Este comando vai instalar:
- Express (servidor web)
- Prisma (ORM para banco de dados)
- JWT (autenticação)
- bcryptjs (criptografia de senhas)
- E outras dependências...

#### 2.3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Abra o arquivo `.env` e verifique as configurações:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-super-secreto-aqui-mude-em-producao"
PORT=3001
```

⚠️ **IMPORTANTE**: Em produção, mude o `JWT_SECRET` para algo único e seguro!

#### 2.4. Inicialize o banco de dados

```bash
npx prisma migrate dev --name init
```

Este comando vai:
- Criar o banco de dados SQLite
- Criar as tabelas (User e Solicitacao)
- Gerar o Prisma Client

#### 2.5. Inicie o servidor backend

```bash
npm run dev
```

Se tudo deu certo, você verá:
```
🚀 Servidor E-SIC rodando na porta 3001
📍 Acesse: http://localhost:3001
```

✅ **Backend está rodando!** Deixe este terminal aberto.

### 3️⃣ Configurar o Frontend

Abra um **NOVO terminal** (mantenha o backend rodando no outro).

#### 3.1. Entre na pasta do frontend
```bash
cd frontend  # Se estiver na raiz do projeto
# OU
cd ../frontend  # Se estiver na pasta backend
```

#### 3.2. Instale as dependências
```bash
npm install
```

Este comando vai instalar:
- React (biblioteca de interface)
- Vite (bundler rápido)
- Tailwind CSS (estilos)
- Axios (requisições HTTP)
- React Router (rotas)

#### 3.3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Verifique o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

#### 3.4. Inicie o servidor frontend

```bash
npm run dev
```

Se tudo deu certo, você verá:
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend está rodando!**

### 4️⃣ Acesse a Aplicação

Abra seu navegador e acesse:

**http://localhost:5173**

Você deve ver a página de login do E-SIC! 🎉

## 🧪 Testando o Sistema

### Criar um Usuário

1. Clique em "Cadastre-se"
2. Preencha o formulário:
   - Nome: João Silva
   - Email: joao@email.com
   - CPF: 12345678900
   - Senha: 123456
   - Tipo: Cidadão
3. Clique em "Cadastrar"

### Fazer Login

1. Use o email e senha que você cadastrou
2. Clique em "Entrar"

### Criar uma Solicitação

1. No dashboard, clique em "Nova Solicitação"
2. Escolha uma categoria (ex: Saúde)
3. Descreva sua solicitação (mínimo 20 caracteres)
4. Escolha a forma de recebimento
5. Clique em "Enviar Solicitação"

Você receberá um protocolo no formato: **ESIC-20260212-00001**

### Ver Suas Solicitações

1. Clique em "Minhas Solicitações"
2. Você verá todas as suas solicitações
3. Clique em "Ver Detalhes" para ver mais informações

## 🛠️ Comandos Úteis

### Backend

```bash
# Rodar em modo desenvolvimento (com hot reload)
npm run dev

# Rodar em modo produção
npm start

# Ver o banco de dados no navegador
npx prisma studio

# Criar uma nova migration
npx prisma migrate dev

# Resetar o banco de dados
npx prisma migrate reset
```

### Frontend

```bash
# Rodar em modo desenvolvimento
npm run dev

# Criar build para produção
npm run build

# Visualizar build de produção
npm run preview
```

## ❌ Troubleshooting (Problemas Comuns)

### Erro: "Port 3001 is already in use"

**Problema**: A porta 3001 já está sendo usada.

**Solução 1**: Mude a porta no arquivo `.env` do backend:
```env
PORT=3002
```

**Solução 2**: Mate o processo na porta 3001:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <numero_do_pid> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Erro: "Cannot find module '@prisma/client'"

**Problema**: O Prisma Client não foi gerado.

**Solução**:
```bash
cd backend
npx prisma generate
```

### Erro: "Network Error" ao fazer login

**Problema**: O frontend não está conseguindo se conectar ao backend.

**Solução**:
1. Verifique se o backend está rodando em http://localhost:3001
2. Verifique o arquivo `.env` do frontend
3. Tente acessar http://localhost:3001 no navegador

### Erro: "ENOENT: no such file or directory"

**Problema**: Você não está na pasta correta.

**Solução**:
```bash
# Veja onde você está
pwd

# Volte para a raiz do projeto
cd /caminho/para/esic-prefeitura
```

### Frontend não carrega estilos

**Problema**: Tailwind CSS não foi configurado corretamente.

**Solução**:
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

## 🎓 Próximos Passos

Agora que você tem tudo rodando:

1. ✅ Leia o **DIA-02-ENTENDENDO-CODIGO.md** para entender como o código funciona
2. ✅ Leia o **CRONOGRAMA-COMPLETO.md** para ver o plano de 30 dias
3. ✅ Experimente criar mais usuários e solicitações
4. ✅ Explore o código e tente entender cada parte

## 📚 Recursos de Aprendizado

- [Documentação do Node.js](https://nodejs.org/docs/)
- [Documentação do React](https://react.dev/)
- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs/)

## 🆘 Precisa de Ajuda?

Se você encontrou algum problema que não está listado aqui:

1. Leia a mensagem de erro com atenção
2. Pesquise o erro no Google
3. Verifique se todos os passos foram seguidos corretamente
4. Certifique-se de que está na pasta correta

---

**Parabéns! 🎉 Você configurou o projeto E-SIC com sucesso!**

Continue para o próximo documento: **DIA-02-ENTENDENDO-CODIGO.md**
