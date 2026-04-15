import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { RequestStatus } from '@prisma/client';
import { sendEmail, buildWhatsAppLink } from '../services/notificationService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif|zip/;
    const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
    if (allowed.test(ext)) return cb(null, true);
    cb(new Error('Tipo de arquivo não permitido.'));
  },
});

class RequestController {
  async create(req: Request, res: Response) {
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
      const count = await prisma.request.count();
      const protocol = `ESIC-${year}-${(count + 1).toString().padStart(5, '0')}`;

      const request = await prisma.request.create({
        data: {
          protocol,
          description,
          status: 'OPEN',
          userId,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        },
      });

      return res.status(201).json(request);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = req.user;

      if (!user) return res.status(401).json({ error: 'Não autorizado' });

      const request = await prisma.request.findUnique({
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

      if (!request) return res.status(404).json({ error: 'Pedido não encontrado' });

      if (user.role === 'CITIZEN' && request.userId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      return res.json(request);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar pedido' });
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

      if (status) {
        where.status = status as RequestStatus;
      }

      if (user.role === 'ADMIN' || user.role === 'CONTROL') {
        if (departmentId) {
          where.departmentId = departmentId;
        }
      } else if (user.role === 'TECHNICIAN' || user.role === 'AUTHORITY') {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser?.departmentId) {
          return res.json([]);
        }
        where.departmentId = dbUser.departmentId;
      } else {
        where.userId = user.id;
      }

      const requests = await prisma.request.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, cpfCnpj: true } },
          department: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
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

      const deptUser = departmentId
        ? await prisma.user.findFirst({ where: { departmentId } })
        : null;
      const destinationUserId = deptUser?.id ?? adminId;

      const request = await prisma.request.update({
        where: { id },
        data: { departmentId, status: 'IN_ANALYSIS' },
      });

      await prisma.movement.create({
        data: {
          requestId: id,
          originUserId: adminId,
          destinationUserId,
          description: description || 'Pedido encaminhado para o setor.',
        },
      });

      return res.json(request);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao encaminhar pedido' });
    }
  }

  async respond(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { response: responseText } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: 'Não autorizado' });
      if (!responseText?.trim()) return res.status(400).json({ error: 'Resposta não pode estar vazia' });

      const request = await prisma.request.update({
        where: { id },
        data: { status: 'RESPONDED', response: responseText },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          department: { select: { name: true } },
        },
      }) as any;

      await prisma.movement.create({
        data: {
          requestId: id,
          originUserId: userId,
          destinationUserId: request.userId,
          description: 'Resposta oficial enviada ao requerente.',
        },
      });

      const appUrl = process.env.APP_URL || 'http://localhost:5173';

      await sendEmail(
        request.user.email,
        `[e-SIC] Resposta ao seu pedido ${request.protocol}`,
        `<p>Olá, <strong>${request.user.name}</strong>.</p>
         <p>O seu pedido <strong>${request.protocol}</strong> foi respondido.</p>
         <p><strong>Resposta:</strong></p>
         <blockquote style="border-left:4px solid #ccc;padding-left:1rem;margin:1rem 0;">${responseText}</blockquote>
         <p>Acesse o sistema para consultar os documentos anexados: <a href="${appUrl}">${appUrl}</a></p>`
      );

      const phone = request.user.phone?.replace(/\D/g, '') ?? '';
      const waMessage = `Olá ${request.user.name}, seu pedido e-SIC ${request.protocol} foi respondido. Acesse: ${appUrl}`;
      const whatsappLink = phone ? buildWhatsAppLink(phone, waMessage) : null;

      return res.json({ ...request, whatsappLink });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao responder pedido' });
    }
  }

  async uploadAttachment(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const attachments = await prisma.$transaction(
        files.map((file) =>
          prisma.attachment.create({
            data: {
              requestId: id,
              filename: file.filename,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
          })
        )
      );

      return res.status(201).json(attachments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao salvar anexos' });
    }
  }

  async listAttachments(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const attachments = await prisma.attachment.findMany({
        where: { requestId: id },
        orderBy: { createdAt: 'asc' },
      });
      return res.json(attachments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar anexos' });
    }
  }
}

export default new RequestController();
