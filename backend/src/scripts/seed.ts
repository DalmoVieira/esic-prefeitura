import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Start seeding...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@esic.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Mudar@123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador do Sistema',
      email: adminEmail,
      cpfCnpj: '00000000000',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log(`Created admin user: ${admin.email} (ID: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
