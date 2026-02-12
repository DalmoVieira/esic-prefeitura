/**
 * Rotas de Autenticação
 * 
 * Define as rotas para registro e login de usuários
 */

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registra um novo usuário no sistema
 * Body: { nome, email, cpf, senha, tipo, telefone? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Faz login do usuário e retorna token JWT
 * Body: { email, senha }
 */
router.post('/login', login);

export default router;
