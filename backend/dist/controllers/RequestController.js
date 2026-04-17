"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const prisma_1 = require("../lib/prisma");
const notificationService_1 = require("../services/notificationService");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.resolve('uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif|zip/;
        const ext = path_1.default.extname(file.originalname).replace('.', '').toLowerCase();
        if (allowed.test(ext))
            return cb(null, true);
        cb(new Error('Tipo de arquivo não permitido.'));
    },
});
class RequestController {
    async create(req, res) {
        try {
            if (req.body.website) {
                console.warn('Bot detected via honeypot in RequestController');
                return res.status(400).json({ error: 'Comportamento suspeito detectado.' });
            }
            const { description } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Não autorizado' });
            }
            const year = new Date().getFullYear();
            const count = await prisma_1.prisma.request.count();
            const protocol = `ESIC-${year}-${(count + 1).toString().padStart(5, '0')}`;
            const request = await prisma_1.prisma.request.create({
                data: {
                    protocol,
                    description,
                    status: 'OPEN',
                    userId,
                    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                },
            });
            return res.status(201).json(request);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar pedido' });
        }
    }
    async show(req, res) {
        try {
            const id = req.params.id;
            const user = req.user;
            if (!user)
                return res.status(401).json({ error: 'Não autorizado' });
            const request = await prisma_1.prisma.request.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    department: { select: { id: true, name: true } },
                    attachments: { orderBy: { createdAt: 'asc' } },
                    movements: {
                        include: {
                            originUser: { select: { id: true, name: true } },
                            destinationUser: { select: { id: true, name: true } },
                        },
                        orderBy: { date: 'asc' },
                    },
                    appeals: {
                        include: { user: { select: { name: true } } },
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
            if (!request)
                return res.status(404).json({ error: 'Pedido não encontrado' });
            if (user.role === 'CITIZEN' && request.userId !== user.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            return res.json(request);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar pedido' });
        }
    }
    async index(req, res) {
        try {
            const status = req.query.status;
            const departmentId = req.query.departmentId;
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'Não autorizado' });
            }
            const where = {};
            if (status) {
                where.status = status;
            }
            if (user.role === 'ADMIN' || user.role === 'CONTROL') {
                if (departmentId) {
                    where.departmentId = departmentId;
                }
            }
            else if (user.role === 'TECHNICIAN' || user.role === 'AUTHORITY') {
                const dbUser = await prisma_1.prisma.user.findUnique({ where: { id: user.id } });
                if (!dbUser?.departmentId) {
                    return res.json([]);
                }
                where.departmentId = dbUser.departmentId;
            }
            else {
                where.userId = user.id;
            }
            const requests = await prisma_1.prisma.request.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true, cpfCnpj: true } },
                    department: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return res.json(requests);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    }
    async assign(req, res) {
        try {
            const id = req.params.id;
            const { departmentId, description } = req.body;
            const adminId = req.user?.id;
            if (!adminId)
                return res.status(401).json({ error: 'Não autorizado' });
            const deptUser = departmentId
                ? await prisma_1.prisma.user.findFirst({ where: { departmentId } })
                : null;
            const destinationUserId = deptUser?.id ?? adminId;
            const request = await prisma_1.prisma.request.update({
                where: { id },
                data: { departmentId, status: 'IN_ANALYSIS' },
            });
            await prisma_1.prisma.movement.create({
                data: {
                    requestId: id,
                    originUserId: adminId,
                    destinationUserId,
                    description: description || 'Pedido encaminhado para o setor.',
                },
            });
            return res.json(request);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao encaminhar pedido' });
        }
    }
    async respond(req, res) {
        try {
            const id = req.params.id;
            const { response: responseText } = req.body;
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ error: 'Não autorizado' });
            if (!responseText?.trim())
                return res.status(400).json({ error: 'Resposta não pode estar vazia' });
            const request = await prisma_1.prisma.request.update({
                where: { id },
                data: { status: 'RESPONDED', response: responseText },
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    department: { select: { name: true } },
                },
            });
            await prisma_1.prisma.movement.create({
                data: {
                    requestId: id,
                    originUserId: userId,
                    destinationUserId: request.userId,
                    description: 'Resposta oficial enviada ao requerente.',
                },
            });
            const appUrl = process.env.APP_URL || 'http://localhost:5173';
            await (0, notificationService_1.sendEmail)(request.user.email, `[e-SIC] Resposta ao seu pedido ${request.protocol}`, `<p>Olá, <strong>${request.user.name}</strong>.</p>
         <p>O seu pedido <strong>${request.protocol}</strong> foi respondido.</p>
         <p><strong>Resposta:</strong></p>
         <blockquote style="border-left:4px solid #ccc;padding-left:1rem;margin:1rem 0;">${responseText}</blockquote>
         <p>Acesse o sistema para consultar os documentos anexados: <a href="${appUrl}">${appUrl}</a></p>`);
            const phone = request.user.phone?.replace(/\D/g, '') ?? '';
            const waMessage = `Olá ${request.user.name}, seu pedido e-SIC ${request.protocol} foi respondido. Acesse: ${appUrl}`;
            const whatsappLink = phone ? (0, notificationService_1.buildWhatsAppLink)(phone, waMessage) : null;
            return res.json({ ...request, whatsappLink });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao responder pedido' });
        }
    }
    async uploadAttachment(req, res) {
        try {
            const id = req.params.id;
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            }
            const attachments = await prisma_1.prisma.$transaction(files.map((file) => prisma_1.prisma.attachment.create({
                data: {
                    requestId: id,
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                },
            })));
            return res.status(201).json(attachments);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao salvar anexos' });
        }
    }
    async listAttachments(req, res) {
        try {
            const id = req.params.id;
            const attachments = await prisma_1.prisma.attachment.findMany({
                where: { requestId: id },
                orderBy: { createdAt: 'asc' },
            });
            return res.json(attachments);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao listar anexos' });
        }
    }
    async publicSearch(req, res) {
        try {
            const q = (req.query.q || '').trim();
            const where = { status: 'RESPONDED' };
            if (q) {
                where.OR = [
                    { description: { contains: q, mode: 'insensitive' } },
                    { response: { contains: q, mode: 'insensitive' } },
                    { protocol: { contains: q, mode: 'insensitive' } },
                ];
            }
            const requests = await prisma_1.prisma.request.findMany({
                where,
                select: {
                    id: true,
                    protocol: true,
                    description: true,
                    response: true,
                    openingDate: true,
                    department: { select: { name: true } },
                },
                orderBy: { openingDate: 'desc' },
                take: 20,
            });
            return res.json(requests);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro na busca pública' });
        }
    }
}
exports.default = new RequestController();
//# sourceMappingURL=RequestController.js.map