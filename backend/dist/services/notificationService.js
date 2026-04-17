"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.buildWhatsAppLink = buildWhatsAppLink;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
async function sendEmail(to, subject, html) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[notificationService] SMTP não configurado — email não enviado.');
        return;
    }
    await transporter.sendMail({
        from: `"e-SIC Prefeitura" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
}
function buildWhatsAppLink(phone, message) {
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
//# sourceMappingURL=notificationService.js.map