import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class DepartmentController {
  async index(req: Request, res: Response) {
    try {
      const departments = await prisma.department.findMany({
        orderBy: { name: 'asc' }
      });
      return res.json(departments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar departamentos' });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      
      const department = await prisma.department.create({
        data: { name, description }
      });
      
      return res.status(201).json(department);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar departamento' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, description } = req.body;
      
      const department = await prisma.department.update({
        where: { id },
        data: { name, description }
      });
      
      return res.json(department);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar departamento' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      
      // Check if there are users or requests in this department
      const usersCount = await prisma.user.count({ where: { departmentId: id } });
      const requestsCount = await prisma.request.count({ where: { departmentId: id } });
      
      if (usersCount > 0 || requestsCount > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir um setor que possui usuários ou solicitações vinculadas.' 
        });
      }
      
      await prisma.department.delete({ where: { id } });
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir departamento' });
    }
  }
}

export default new DepartmentController();
