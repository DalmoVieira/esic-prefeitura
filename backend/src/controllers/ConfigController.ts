import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.resolve('uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'favicon' ? 'favicon' : 'brasao';
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

export const uploadBrasao = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagem inválido. Use PNG, JPG, SVG ou WebP.'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

class ConfigController {
  async show(_req: Request, res: Response) {
    try {
      let config = await prisma.municipalConfig.findUnique({ where: { id: '1' } });
      if (!config) {
        config = await prisma.municipalConfig.create({
          data: { id: '1', cityName: 'Minha Cidade', state: 'SP' },
        });
      }
      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const {
        cityName, state, cnpj, slogan, address,
        phone, email, website, primaryColor,
      } = req.body;

      const data: Record<string, any> = {};
      if (cityName !== undefined)    data.cityName    = cityName;
      if (state !== undefined)       data.state       = state;
      if (cnpj !== undefined)        data.cnpj        = cnpj;
      if (slogan !== undefined)      data.slogan      = slogan;
      if (address !== undefined)     data.address     = address;
      if (phone !== undefined)       data.phone       = phone;
      if (email !== undefined)       data.email       = email;
      if (website !== undefined)     data.website     = website;
      if (primaryColor !== undefined) data.primaryColor = primaryColor;

      // File uploads (brasão e favicon)
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      if (files?.coatOfArms?.[0]) {
        data.coatOfArmsFile = files.coatOfArms[0].filename;
      }
      if (files?.favicon?.[0]) {
        data.faviconFile = files.favicon[0].filename;
      }

      const config = await prisma.municipalConfig.upsert({
        where: { id: '1' },
        update: data,
        create: { id: '1', cityName: cityName || 'Minha Cidade', state: state || 'SP', ...data },
      });

      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
  }
}

export default new ConfigController();
