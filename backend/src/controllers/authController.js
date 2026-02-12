/**
 * Controller de Autenticação
 * 
 * Gerencia o registro e login de usuários
 * Cria e valida tokens JWT
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Registra um novo usuário no sistema
 * 
 * Recebe os dados do usuário, valida, faz hash da senha
 * e salva no banco de dados
 * 
 * POST /api/auth/register
 * Body: { nome, email, cpf, senha, tipo, telefone }
 */
export const register = async (req, res) => {
  try {
    const { nome, email, cpf, senha, tipo, telefone } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !email || !cpf || !senha || !tipo) {
      return res.status(400).json({ 
        error: 'Todos os campos obrigatórios devem ser preenchidos.' 
      });
    }

    // Verifica se o tipo é válido
    if (tipo !== 'cidadao' && tipo !== 'servidor') {
      return res.status(400).json({ 
        error: 'Tipo de usuário inválido. Use "cidadao" ou "servidor".' 
      });
    }

    // Verifica se já existe usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este email já está cadastrado.' 
      });
    }

    // Verifica se já existe usuário com este CPF
    const existingCPF = await prisma.user.findUnique({
      where: { cpf }
    });

    if (existingCPF) {
      return res.status(400).json({ 
        error: 'Este CPF já está cadastrado.' 
      });
    }

    // Cria o hash da senha (não salvamos a senha em texto puro)
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        cpf,
        senha: hashedPassword,
        tipo,
        telefone: telefone || null
      }
    });

    // Remove a senha do objeto antes de retornar
    const { senha: _, ...userWithoutPassword } = user;

    // Retorna sucesso com os dados do usuário (sem a senha)
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ 
      error: 'Erro ao cadastrar usuário. Tente novamente.' 
    });
  }
};

/**
 * Faz login do usuário
 * 
 * Valida as credenciais e retorna um token JWT
 * 
 * POST /api/auth/login
 * Body: { email, senha }
 */
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios.' 
      });
    }

    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Se não encontrar o usuário, retorna erro
    if (!user) {
      return res.status(401).json({ 
        error: 'Email ou senha incorretos.' 
      });
    }

    // Verifica se a senha está correta
    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Email ou senha incorretos.' 
      });
    }

    // Cria o token JWT com os dados do usuário
    // O token expira em 7 dias
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        tipo: user.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove a senha antes de retornar
    const { senha: _, ...userWithoutPassword } = user;

    // Retorna o token e os dados do usuário
    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer login. Tente novamente.' 
    });
  }
};
