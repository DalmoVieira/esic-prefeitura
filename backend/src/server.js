/**
 * Servidor Principal do Sistema E-SIC
 * 
 * Configura e inicia o servidor Express
 * Define as rotas e middlewares
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import solicitacaoRoutes from './routes/solicitacao.routes.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a aplicação Express
const app = express();

// Pega a porta do ambiente ou usa 3001 como padrão
const PORT = process.env.PORT || 3001;

/**
 * MIDDLEWARES
 * São executados antes das rotas
 */

// CORS - Permite requisições do frontend
app.use(cors());

// Parser JSON - Permite receber dados em JSON no body
app.use(express.json());

// Parser URL encoded - Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

/**
 * ROTAS
 */

// Rota de teste - Para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API E-SIC está rodando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      solicitacoes: '/api/solicitacoes'
    }
  });
});

// Rotas de autenticação (registro e login)
app.use('/api/auth', authRoutes);

// Rotas de solicitações
app.use('/api/solicitacoes', solicitacaoRoutes);

/**
 * TRATAMENTO DE ERROS
 */

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada' 
  });
});

// Erro interno do servidor (500)
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor' 
  });
});

/**
 * INICIA O SERVIDOR
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor E-SIC rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints disponíveis:`);
  console.log(`   POST /api/auth/register - Cadastrar usuário`);
  console.log(`   POST /api/auth/login - Fazer login`);
  console.log(`   POST /api/solicitacoes - Criar solicitação`);
  console.log(`   GET  /api/solicitacoes - Listar minhas solicitações`);
  console.log(`   GET  /api/solicitacoes/:protocolo - Buscar por protocolo\n`);
});
