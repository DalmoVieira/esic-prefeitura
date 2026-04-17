"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
class DepartmentController {
    async index(req, res) {
        try {
            const departments = await prisma_1.prisma.department.findMany({
                orderBy: { name: 'asc' }
            });
            return res.json(departments);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar departamentos' });
        }
    }
    async store(req, res) {
        try {
            const { name, description, phone } = req.body;
            const department = await prisma_1.prisma.department.create({
                data: { name, description, phone }
            });
            return res.status(201).json(department);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao criar departamento' });
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            const { name, description, phone } = req.body;
            const department = await prisma_1.prisma.department.update({
                where: { id },
                data: { name, description, phone }
            });
            return res.json(department);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar departamento' });
        }
    }
    async destroy(req, res) {
        try {
            const id = req.params.id;
            // Check if there are users or requests in this department
            const usersCount = await prisma_1.prisma.user.count({ where: { departmentId: id } });
            const requestsCount = await prisma_1.prisma.request.count({ where: { departmentId: id } });
            if (usersCount > 0 || requestsCount > 0) {
                return res.status(400).json({
                    error: 'Não é possível excluir um setor que possui usuários ou solicitações vinculadas.'
                });
            }
            await prisma_1.prisma.department.delete({ where: { id } });
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir departamento' });
        }
    }
}
exports.default = new DepartmentController();
//# sourceMappingURL=DepartmentController.js.map