/**
 * Controller de Solicitações
 * 
 * Gerencia a criação, listagem e visualização de solicitações
 */

import { PrismaClient } from '@prisma/client';
import { generateProtocol, calculateDeadline } from '../utils/generateProtocol.js';

const prisma = new PrismaClient();

/**
 * Cria uma nova solicitação
 * 
 * POST /api/solicitacoes
 * Body: { categoria, descricao, formaRecebimento, anexos? }
 * Requer autenticação (token JWT)
 */
export const createSolicitacao = async (req, res) => {
  try {
    const { categoria, descricao, formaRecebimento, anexos } = req.body;
    
    // req.user vem do middleware de autenticação
    const usuarioId = req.user.id;

    // Validação dos campos obrigatórios
    if (!categoria || !descricao || !formaRecebimento) {
      return res.status(400).json({ 
        error: 'Categoria, descrição e forma de recebimento são obrigatórios.' 
      });
    }

    // Valida a forma de recebimento
    if (formaRecebimento !== 'email' && formaRecebimento !== 'portal') {
      return res.status(400).json({ 
        error: 'Forma de recebimento inválida. Use "email" ou "portal".' 
      });
    }

    // Gera um protocolo único para esta solicitação
    const protocolo = generateProtocol();
    
    // Calcula o prazo de resposta (20 dias úteis)
    const prazoResposta = calculateDeadline();

    // Cria a solicitação no banco de dados
    const solicitacao = await prisma.solicitacao.create({
      data: {
        protocolo,
        usuarioId,
        categoria,
        descricao,
        formaRecebimento,
        prazoResposta,
        status: 'pendente',
        anexos: anexos ? JSON.stringify(anexos) : null
      },
      // Inclui os dados do usuário na resposta
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Solicitação criada com sucesso!',
      solicitacao
    });

  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ 
      error: 'Erro ao criar solicitação. Tente novamente.' 
    });
  }
};

/**
 * Lista todas as solicitações do usuário autenticado
 * 
 * GET /api/solicitacoes
 * Requer autenticação (token JWT)
 */
export const listSolicitacoes = async (req, res) => {
  try {
    // req.user vem do middleware de autenticação
    const usuarioId = req.user.id;

    // Busca todas as solicitações do usuário
    const solicitacoes = await prisma.solicitacao.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' }, // Mais recentes primeiro
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.json({
      total: solicitacoes.length,
      solicitacoes
    });

  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ 
      error: 'Erro ao listar solicitações. Tente novamente.' 
    });
  }
};

/**
 * Busca uma solicitação específica pelo protocolo
 * 
 * GET /api/solicitacoes/:protocolo
 * Requer autenticação (token JWT)
 */
export const getSolicitacaoByProtocolo = async (req, res) => {
  try {
    const { protocolo } = req.params;
    const usuarioId = req.user.id;

    // Busca a solicitação pelo protocolo
    const solicitacao = await prisma.solicitacao.findUnique({
      where: { protocolo },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Verifica se a solicitação existe
    if (!solicitacao) {
      return res.status(404).json({ 
        error: 'Solicitação não encontrada.' 
      });
    }

    // Verifica se a solicitação pertence ao usuário autenticado
    if (solicitacao.usuarioId !== usuarioId) {
      return res.status(403).json({ 
        error: 'Você não tem permissão para acessar esta solicitação.' 
      });
    }

    res.json({ solicitacao });

  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar solicitação. Tente novamente.' 
    });
  }
};
