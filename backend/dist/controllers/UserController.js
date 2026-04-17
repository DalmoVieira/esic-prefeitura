"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const validators_1 = require("../utils/validators");
const userSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    cpfCnpj: zod_1.z.string().refine((val) => {
        const digits = val.replace(/\D/g, '');
        if (digits.length === 11)
            return (0, validators_1.validateCPF)(digits);
        if (digits.length === 14)
            return (0, validators_1.validateCNPJ)(digits);
        return false;
    }, { message: 'CPF ou CNPJ inválido. Verifique os dados informados.' }),
    password: zod_1.z.string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres.')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
        .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
        .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial (!@#$...).'),
    role: zod_1.z.enum(['CITIZEN', 'ADMIN', 'TECHNICIAN', 'AUTHORITY', 'CONTROL']).default('CITIZEN'),
    departmentId: zod_1.z.string().optional(),
});
class UserController {
    async create(req, res) {
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
            const userExists = await prisma_1.prisma.user.findFirst({
                where: { OR: [{ email }, { cpfCnpj }] },
            });
            if (userExists) {
                return res.status(400).json({ error: 'Usuário já cadastrado com este e-mail ou CPF/CNPJ' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await prisma_1.prisma.user.create({
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: error.issues });
            }
            console.error(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async index(req, res) {
        try {
            const users = await prisma_1.prisma.user.findMany({
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
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            const { name, email, cpfCnpj, role, departmentId, password } = req.body;
            // Check if email or cpfCnpj already exists for another user
            const existingUser = await prisma_1.prisma.user.findFirst({
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
            const data = {
                name,
                email,
                cpfCnpj,
                role,
                departmentId: (role !== 'CITIZEN' && departmentId) ? departmentId : null,
            };
            if (password) {
                data.password = await bcryptjs_1.default.hash(password, 10);
            }
            const user = await prisma_1.prisma.user.update({
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
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }
    async destroy(req, res) {
        try {
            const id = req.params.id;
            // Check if user has requests or movements
            const requestsCount = await prisma_1.prisma.request.count({ where: { userId: id } });
            const movementsCount = await prisma_1.prisma.movement.count({
                where: { OR: [{ originUserId: id }, { destinationUserId: id }] }
            });
            if (requestsCount > 0 || movementsCount > 0) {
                return res.status(400).json({ error: 'Não é possível excluir um usuário que possui pedidos ou movimentações vinculadas.' });
            }
            await prisma_1.prisma.user.delete({ where: { id } });
            return res.status(204).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map