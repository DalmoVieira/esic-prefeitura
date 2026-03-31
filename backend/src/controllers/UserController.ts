import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { validateCPF, validateCNPJ } from '../utils/validators';

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  cpfCnpj: z.string().refine(
    (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length === 11) return validateCPF(digits);
      if (digits.length === 14) return validateCNPJ(digits);
      return false;
    },
    { message: 'CPF ou CNPJ inválido. Verifique os dados informados.' }
  ),
  password: z.string().min(6),
  role: z.enum(['CITIZEN', 'ADMIN', 'TECHNICIAN', 'AUTHORITY', 'CONTROL']).default('CITIZEN'),
  departmentId: z.string().optional(),
});

class UserController {
  async create(req: Request, res: Response) {
    try {
      if (req.body.website) {
        console.warn('Bot detected via honeypot in UserController');
        return res.status(400).json({ error: 'Comportamento suspeito detectado.' });
      }
      const { name, email, cpfCnpj, password, role, departmentId } = userSchema.parse(req.body);

      // Validate departmentId if role is not CITIZEN
      if (role !== 'CITIZEN' && !departmentId) {
        return res.status(400).json({ error: 'departmentId é obrigatório para este tipo de usuário' });
      }

      const userExists = await prisma.user.findFirst({
        where: { OR: [{ email }, { cpfCnpj }] },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado com este e-mail ou CPF/CNPJ' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          cpfCnpj,
          password: hashedPassword,
          role: role || 'CITIZEN',
          departmentId: (role !== 'CITIZEN' && departmentId) ? departmentId : null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          cpfCnpj: true,
          role: true,
          createdAt: true,
        }
      });

      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          cpfCnpj: true,
          role: true,
          departmentId: true,
          department: { select: { name: true } },
          createdAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, email, cpfCnpj, role, departmentId, password } = req.body;

      // Check if email or cpfCnpj already exists for another user
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { cpfCnpj }
          ],
          NOT: { id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: existingUser.email === email 
            ? 'Este e-mail já está em uso por outro usuário.' 
            : 'Este CPF/CNPJ já está cadastrado para outro usuário.' 
        });
      }

      const data: any = {
        name,
        email,
        cpfCnpj,
        role,
        departmentId: (role !== 'CITIZEN' && departmentId) ? departmentId : null,
      };

      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          cpfCnpj: true,
          role: true,
          departmentId: true,
        }
      });

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      
      // Check if user has requests or movements
      const requestsCount = await prisma.request.count({ where: { userId: id } });
      const movementsCount = await prisma.movement.count({ 
        where: { OR: [{ originUserId: id }, { destinationUserId: id }] } 
      });

      if (requestsCount > 0 || movementsCount > 0) {
        return res.status(400).json({ error: 'Não é possível excluir um usuário que possui pedidos ou movimentações vinculadas.' });
      }

      await prisma.user.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  }
}

export default new UserController();
