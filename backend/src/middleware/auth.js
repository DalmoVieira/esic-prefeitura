/**
 * Middleware de Autenticação
 * 
 * Verifica se o usuário está autenticado através do token JWT
 * Protege rotas que exigem autenticação
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware que verifica o token JWT nas requisições
 * 
 * Verifica se o token está presente no header Authorization
 * e se o token é válido. Se válido, adiciona os dados do
 * usuário na requisição (req.user) e permite o acesso.
 * 
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @param {Function} next - Função next do Express
 */
export const authenticateToken = (req, res, next) => {
  // Pega o token do header Authorization
  // Formato esperado: "Bearer TOKEN_AQUI"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Pega apenas o token

  // Se não houver token, retorna erro 401 (não autorizado)
  if (!token) {
    return res.status(401).json({ 
      error: 'Token não fornecido. Acesso negado.' 
    });
  }

  try {
    // Verifica se o token é válido usando o JWT_SECRET
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adiciona os dados do usuário na requisição
    // Assim, os controllers podem acessar req.user
    req.user = user;
    
    // Continua para o próximo middleware ou controller
    next();
  } catch (error) {
    // Se o token for inválido ou expirado, retorna erro 403
    return res.status(403).json({ 
      error: 'Token inválido ou expirado.' 
    });
  }
};
