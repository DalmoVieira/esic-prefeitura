import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { RequestStatus } from '@prisma/client';

class RequestController {
  async create(req: Request, res: Response) {
    try {
      if (req.body.website) {
        console.warn('Bot detected via honeypot in RequestController');
        return res.status(400).json({ error: 'Comportamento suspeito detectado.' });
      }

      const { description, format } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      // Generate protocol (ESIC-YYYY-XXXXX)
      const year = new Date().getFullYear();
      const count = await prisma.request.count();
      const protocol = `ESIC-${year}-${(count + 1).toString().padStart(5, '0')}`;

      const request = await prisma.request.create({
        data: {
          protocol,
          description,
          status: 'OPEN',
          userId,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days deadline
        }
      });

      return res.status(201).json(request);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const departmentId = req.query.departmentId as string;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const where: any = {};

      // Filter by status if provided
      if (status) {
        where.status = status as RequestStatus;
      }

      // Role-based visibility
      if (user.role === 'ADMIN' || user.role === 'CONTROL') {
        // Admins and Control can see everything, but can filter by department
        if (departmentId) {
          where.departmentId = departmentId as string;
        }
      } else if (user.role === 'TECHNICIAN' || user.role === 'AUTHORITY') {
        // Technicians and Authorities see only what is assigned to their department
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser?.departmentId) {
          return res.json([]); // No department, no requests
        }
        where.departmentId = dbUser.departmentId;
      } else {
        // Citizens see only their own requests
        where.userId = user.id;
      }

      const requests = await prisma.request.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, cpfCnpj: true } },
          department: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(requests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { departmentId, description } = req.body;
      const adminId = req.user?.id;

      if (!adminId) return res.status(401).json({ error: 'Não autorizado' });

      const request = await prisma.request.update({
        where: { id },
        data: { 
          departmentId,
          status: 'IN_ANALYSIS'
        }
      });

      // Create a movement record
      await prisma.movement.create({
        data: {
          requestId: id,
          originUserId: adminId,
          destinationUserId: adminId, // For now, just recording the assignment
          description: description || `Pedido encaminhado para o setor.`
        }
      });

      return res.json(request);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao encaminhar pedido' });
    }
  }
}

export default new RequestController();
