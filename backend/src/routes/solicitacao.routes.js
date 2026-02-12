/**
 * Rotas de Solicitações
 * 
 * Define as rotas para gerenciar solicitações
 * Todas as rotas requerem autenticação
 */

import express from 'express';
import { 
  createSolicitacao, 
  listSolicitacoes, 
  getSolicitacaoByProtocolo 
} from '../controllers/solicitacaoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de solicitação exigem autenticação
router.use(authenticateToken);

/**
 * POST /api/solicitacoes
 * Cria uma nova solicitação
 * Body: { categoria, descricao, formaRecebimento, anexos? }
 */
router.post('/', createSolicitacao);

/**
 * GET /api/solicitacoes
 * Lista todas as solicitações do usuário autenticado
 */
router.get('/', listSolicitacoes);

/**
 * GET /api/solicitacoes/:protocolo
 * Busca uma solicitação específica pelo protocolo
 * Params: protocolo
 */
router.get('/:protocolo', getSolicitacaoByProtocolo);

export default router;
