"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBrasao = void 0;
const prisma_1 = require("../lib/prisma");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const UPLOADS_DIR = path_1.default.resolve('uploads');
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const prefix = file.fieldname === 'favicon' ? 'favicon' : 'brasao';
        cb(null, `${prefix}-${Date.now()}${ext}`);
    },
});
exports.uploadBrasao = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Formato de imagem inválido. Use PNG, JPG, SVG ou WebP.'));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
class ConfigController {
    async show(_req, res) {
        try {
            let config = await prisma_1.prisma.municipalConfig.findUnique({ where: { id: '1' } });
            if (!config) {
                config = await prisma_1.prisma.municipalConfig.create({
                    data: { id: '1', cityName: 'Minha Cidade', state: 'SP' },
                });
            }
            return res.json(config);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar configurações' });
        }
    }
    async update(req, res) {
        try {
            const { cityName, state, cnpj, slogan, address, phone, email, website, primaryColor, } = req.body;
            const data = {};
            if (cityName !== undefined)
                data.cityName = cityName;
            if (state !== undefined)
                data.state = state;
            if (cnpj !== undefined)
                data.cnpj = cnpj;
            if (slogan !== undefined)
                data.slogan = slogan;
            if (address !== undefined)
                data.address = address;
            if (phone !== undefined)
                data.phone = phone;
            if (email !== undefined)
                data.email = email;
            if (website !== undefined)
                data.website = website;
            if (primaryColor !== undefined)
                data.primaryColor = primaryColor;
            // File uploads (brasão e favicon)
            const files = req.files;
            if (files?.coatOfArms?.[0]) {
                data.coatOfArmsFile = files.coatOfArms[0].filename;
            }
            if (files?.favicon?.[0]) {
                data.faviconFile = files.favicon[0].filename;
            }
            const config = await prisma_1.prisma.municipalConfig.upsert({
                where: { id: '1' },
                update: data,
                create: { id: '1', cityName: cityName || 'Minha Cidade', state: state || 'SP', ...data },
            });
            return res.json(config);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao salvar configurações' });
        }
    }
}
exports.default = new ConfigController();
//# sourceMappingURL=ConfigController.js.map