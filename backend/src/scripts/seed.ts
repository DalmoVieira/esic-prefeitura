import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed completo...');

  const senha = await bcrypt.hash('Mudar@123', 10);

  // ── 1. DEPARTAMENTOS ─────────────────────────────────────────────────────────
  const deptData = [
    { name: 'Saúde',              description: 'Secretaria Municipal de Saúde',                                phone: '(19) 99100-0001' },
    { name: 'Educação',           description: 'Secretaria Municipal de Educação',                            phone: '(19) 99100-0002' },
    { name: 'Administração',      description: 'Secretaria de Administração e RH',                            phone: '(19) 99100-0003' },
    { name: 'Obras e Serviços',   description: 'Secretaria de Obras e Serviços Públicos',                     phone: '(19) 99100-0004' },
    { name: 'Finanças',           description: 'Secretaria Municipal de Finanças',                            phone: '(19) 99100-0005' },
    { name: 'Meio Ambiente',      description: 'Secretaria de Meio Ambiente e Sustentabilidade',              phone: '(19) 99100-0006' },
    { name: 'Assistência Social', description: 'Secretaria de Assistência e Desenvolvimento Social',         phone: '(19) 99100-0007' },
  ];

  const depts: Record<string, string> = {};
  for (const d of deptData) {
    const dept = await prisma.department.upsert({
      where: { name: d.name },
      update: { description: d.description, phone: d.phone },
      create: d,
    });
    depts[d.name] = dept.id;
  }
  console.log('✅ Departamentos criados.');

  // ── 2. USUÁRIOS ───────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@esic.local' },
    update: {},
    create: {
      name: 'Administrador e-SIC',
      email: 'admin@esic.local',
      cpfCnpj: '00000000000',
      password: senha,
      role: 'ADMIN',
    },
  });

  const tecSaude = await prisma.user.upsert({
    where: { email: 'tecnico.saude@esic.local' },
    update: {},
    create: {
      name: 'Técnico da Saúde',
      email: 'tecnico.saude@esic.local',
      cpfCnpj: '11111111111',
      phone: '(19) 99100-0001',
      password: senha,
      role: 'TECHNICIAN',
      departmentId: depts['Saúde'],
    },
  });

  const tecEducacao = await prisma.user.upsert({
    where: { email: 'tecnico.educacao@esic.local' },
    update: {},
    create: {
      name: 'Técnica da Educação',
      email: 'tecnico.educacao@esic.local',
      cpfCnpj: '22222222222',
      phone: '(19) 99100-0002',
      password: senha,
      role: 'TECHNICIAN',
      departmentId: depts['Educação'],
    },
  });

  const autoridade = await prisma.user.upsert({
    where: { email: 'autoridade@esic.local' },
    update: {},
    create: {
      name: 'Secretário Municipal',
      email: 'autoridade@esic.local',
      cpfCnpj: '33333333333',
      phone: '(19) 99100-0003',
      password: senha,
      role: 'AUTHORITY',
      departmentId: depts['Administração'],
    },
  });

  const controle = await prisma.user.upsert({
    where: { email: 'controle@esic.local' },
    update: {},
    create: {
      name: 'Controlador Interno',
      email: 'controle@esic.local',
      cpfCnpj: '44444444444',
      phone: '(19) 99100-0004',
      password: senha,
      role: 'CONTROL',
    },
  });

  const cidadaos = await Promise.all([
    prisma.user.upsert({
      where: { email: 'joao.silva@email.com' },
      update: {},
      create: {
        name: 'João da Silva',
        email: 'joao.silva@email.com',
        cpfCnpj: '55555555555',
        phone: '(19) 98800-1111',
        password: senha,
        role: 'CITIZEN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria.santos@email.com' },
      update: {},
      create: {
        name: 'Maria dos Santos',
        email: 'maria.santos@email.com',
        cpfCnpj: '66666666666',
        phone: '(19) 98800-2222',
        password: senha,
        role: 'CITIZEN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos.oliveira@email.com' },
      update: {},
      create: {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        cpfCnpj: '77777777777',
        phone: '(19) 98800-3333',
        password: senha,
        role: 'CITIZEN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ana.lima@email.com' },
      update: {},
      create: {
        name: 'Ana Lima',
        email: 'ana.lima@email.com',
        cpfCnpj: '88888888888',
        phone: '(19) 98800-4444',
        password: senha,
        role: 'CITIZEN',
      },
    }),
  ]);
  console.log('✅ Usuários criados.');

  // ── 3. SOLICITAÇÕES ───────────────────────────────────────────────────────────
  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 86400000);

  const requestsData = [
    {
      protocol: 'ESIC-2026-001',
      description: 'Solicito informações sobre a lista de medicamentos disponíveis na farmácia municipal e o estoque atual de insulina.',
      status: 'OPEN' as const,
      deadline: days(20),
      userId: cidadaos[0].id,
      departmentId: depts['Saúde'],
    },
    {
      protocol: 'ESIC-2026-002',
      description: 'Peço acesso ao número total de vagas em creches municipais para o ano letivo de 2026 e critérios de prioridade de atendimento.',
      status: 'OPEN' as const,
      deadline: days(18),
      userId: cidadaos[1].id,
      departmentId: depts['Educação'],
    },
    {
      protocol: 'ESIC-2026-003',
      description: 'Requer informações sobre contratos de terceirização de limpeza firmados pela prefeitura nos últimos 2 anos, incluindo valor e empresas contratadas.',
      status: 'IN_ANALYSIS' as const,
      deadline: days(10),
      userId: cidadaos[2].id,
      departmentId: depts['Administração'],
    },
    {
      protocol: 'ESIC-2026-004',
      description: 'Solicito o orçamento aprovado para recapeamento asfáltico no bairro Jardim das Flores em 2026 e o cronograma de execução.',
      status: 'IN_ANALYSIS' as const,
      deadline: days(5),
      userId: cidadaos[3].id,
      departmentId: depts['Obras e Serviços'],
    },
    {
      protocol: 'ESIC-2026-005',
      description: 'Pedido de cópia do balanço financeiro municipal referente ao exercício de 2025, incluindo receitas, despesas e resultado primário.',
      status: 'RESPONDED' as const,
      deadline: days(-2),
      userId: cidadaos[0].id,
      departmentId: depts['Finanças'],
    },
    {
      protocol: 'ESIC-2026-006',
      description: 'Solicitação de relação completa de servidores efetivos e comissionados da Secretaria de Saúde, com cargo e remuneração.',
      status: 'RESPONDED' as const,
      deadline: days(-5),
      userId: cidadaos[1].id,
      departmentId: depts['Saúde'],
    },
    {
      protocol: 'ESIC-2026-007',
      description: 'Solicito o Plano Municipal de Educação 2025-2030 e os relatórios semestrais de cumprimento de metas do PME.',
      status: 'EXTENDED' as const,
      deadline: days(30),
      isExtended: true,
      extensionJustification: 'Necessidade de consulta a múltiplas unidades escolares para consolidação dos dados solicitados. Prazo prorrogado por 10 dias úteis conforme Lei 12.527/2011.',
      userId: cidadaos[2].id,
      departmentId: depts['Educação'],
    },
    {
      protocol: 'ESIC-2026-008',
      description: 'Pedido de informação sobre o projeto de revitalização do Parque Municipal, arquivado em 2024.',
      status: 'CANCELED' as const,
      deadline: days(-10),
      userId: cidadaos[3].id,
      departmentId: depts['Meio Ambiente'],
    },
    {
      protocol: 'ESIC-2026-009',
      description: 'Quantos beneficiários do programa Bolsa-Família residem no município? Solicito dados atualizados de janeiro a março de 2026.',
      status: 'OPEN' as const,
      deadline: days(15),
      userId: cidadaos[0].id,
      departmentId: depts['Assistência Social'],
    },
    {
      protocol: 'ESIC-2026-010',
      description: 'Requer cópia integral do contrato de concessão do sistema de transporte coletivo municipal, incluindo aditivos e relatórios de fiscalização.',
      status: 'IN_ANALYSIS' as const,
      deadline: days(8),
      userId: cidadaos[1].id,
      departmentId: depts['Administração'],
    },
  ];

  const createdRequests: Record<string, string> = {};
  for (const req of requestsData) {
    const r = await prisma.request.upsert({
      where: { protocol: req.protocol },
      update: {},
      create: req,
    });
    createdRequests[req.protocol] = r.id;
  }
  console.log('✅ Solicitações criadas.');

  // ── 4. MOVIMENTAÇÕES ─────────────────────────────────────────────────────────
  const movementsData = [
    {
      requestId: createdRequests['ESIC-2026-003'],
      originUserId: admin.id,
      destinationUserId: tecSaude.id,
      description: 'Solicitação recebida e encaminhada ao técnico responsável para análise inicial dos contratos.',
    },
    {
      requestId: createdRequests['ESIC-2026-004'],
      originUserId: admin.id,
      destinationUserId: autoridade.id,
      description: 'Pedido encaminhado à secretaria competente para providências e elaboração de resposta.',
    },
    {
      requestId: createdRequests['ESIC-2026-005'],
      originUserId: admin.id,
      destinationUserId: tecEducacao.id,
      description: 'Solicitação distribuída para elaboração de resposta técnica sobre o balanço financeiro.',
    },
    {
      requestId: createdRequests['ESIC-2026-005'],
      originUserId: tecEducacao.id,
      destinationUserId: admin.id,
      description: 'Resposta elaborada com o balanço completo de 2025 e devolvida para publicação no portal.',
    },
    {
      requestId: createdRequests['ESIC-2026-006'],
      originUserId: admin.id,
      destinationUserId: tecSaude.id,
      description: 'Encaminhado ao técnico de saúde para levantamento da lista de servidores com remunerações.',
    },
    {
      requestId: createdRequests['ESIC-2026-006'],
      originUserId: tecSaude.id,
      destinationUserId: autoridade.id,
      description: 'Lista compilada com 142 servidores. Aguardando autorização da autoridade para divulgação.',
    },
    {
      requestId: createdRequests['ESIC-2026-006'],
      originUserId: autoridade.id,
      destinationUserId: admin.id,
      description: 'Divulgação autorizada. Resposta liberada ao requerente conforme LAI.',
    },
    {
      requestId: createdRequests['ESIC-2026-007'],
      originUserId: admin.id,
      destinationUserId: controle.id,
      description: 'Prorrogação de prazo registrada. Controlador interno notificado para acompanhamento.',
    },
    {
      requestId: createdRequests['ESIC-2026-010'],
      originUserId: admin.id,
      destinationUserId: autoridade.id,
      description: 'Pedido de contrato de concessão encaminhado para análise jurídica e coleta dos aditivos.',
    },
  ];

  for (const m of movementsData) {
    await prisma.movement.create({ data: m });
  }
  console.log('✅ Movimentações criadas.');

  // ── 5. RECURSOS ───────────────────────────────────────────────────────────────
  const appealsData = [
    {
      requestId: createdRequests['ESIC-2026-005'],
      userId: cidadaos[0].id,
      instance: 'FIRST' as const,
      justification: 'A resposta recebida foi incompleta. O balanço entregue não contempla as despesas com pessoal, que foram explicitamente solicitadas.',
      decision: 'Recurso aceito. Informações complementares sobre despesas com pessoal serão prestadas em até 5 dias úteis.',
      decisionDate: days(-1),
    },
    {
      requestId: createdRequests['ESIC-2026-006'],
      userId: cidadaos[1].id,
      instance: 'FIRST' as const,
      justification: 'A relação recebida omitiu os servidores comissionados. Solicito complementação imediata conforme requerimento original.',
    },
    {
      requestId: createdRequests['ESIC-2026-008'],
      userId: cidadaos[3].id,
      instance: 'SECOND' as const,
      justification: 'Discordo do cancelamento unilateral. O projeto de revitalização do Parque Municipal tem impacto ambiental direto na minha comunidade e as informações são de interesse público.',
      decision: 'Mantida a decisão de cancelamento. Pedido arquivado por ausência de objeto — projeto foi definitivamente suspenso por decreto municipal nº 4.521/2024.',
      decisionDate: days(-3),
    },
  ];

  for (const a of appealsData) {
    await prisma.appeal.create({ data: a });
  }
  console.log('✅ Recursos criados.');

  console.log('\n🎉 Seed completo! Resumo:');
  console.log('   🏢 Departamentos:  7');
  console.log('   👥 Usuários:       11 (1 ADMIN · 2 TECHNICIAN · 1 AUTHORITY · 1 CONTROL · 4 CITIZEN)');
  console.log('   📋 Solicitações:   10 (OPEN×3 · IN_ANALYSIS×3 · RESPONDED×2 · EXTENDED×1 · CANCELED×1)');
  console.log('   🔄 Movimentações:  9');
  console.log('   📣 Recursos:       3');
  console.log('\n   🔑 Senha de todos os usuários: Mudar@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
