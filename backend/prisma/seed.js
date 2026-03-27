const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@esic.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Mudar@123';

  try {
    // 1. Create Departments
    const departments = [
      { name: 'Saúde' },
      { name: 'Educação' },
      { name: 'Administração' },
      { name: 'Obras e Serviços' },
      { name: 'Finanças' }
    ];

    for (const dept of departments) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept
      });
    }
    console.log('Departments seeded.');

    const deptSaude = await prisma.department.findUnique({ where: { name: 'Saúde' } });
    if (!deptSaude) {
      throw new Error("Department 'Saúde' not found after upsert.");
    }

    // 2. Create Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@esic.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Mudar@123';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: hashedAdminPassword },
      create: {
        email: adminEmail,
        name: 'Administrador e-SIC',
        cpfCnpj: '00000000000',
        password: hashedAdminPassword,
        role: 'ADMIN',
      },
    });

    console.log(`Created/Updated admin user: ${admin.email}`);

    // 3. Create some sample requests for testing filters
    const sampleRequests = [
      {
        protocol: 'ESIC-2026-001',
        description: 'Pedido de informação sobre medicamentos na farmácia municipal.',
        status: 'OPEN',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        userId: admin.id,
        departmentId: deptSaude.id
      },
      {
        protocol: 'ESIC-2026-002',
        description: 'Solicitação de lista de escolas reformadas em 2025.',
        status: 'RESPONDED',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        userId: admin.id
      }
    ];

    for (const req of sampleRequests) {
      await prisma.request.upsert({
        where: { protocol: req.protocol },
        update: {},
        create: req
      });
    }
    console.log('Sample requests seeded.');

    console.log('Seeding finished successfully.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
