"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const user = await prisma_1.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'E-mail ou senha inválidos. Verifique os campos e tente novamente.' });
            }
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map