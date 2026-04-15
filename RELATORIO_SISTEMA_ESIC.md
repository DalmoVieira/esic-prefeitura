# RELATÓRIO TÉCNICO E GERENCIAL
## Sistema e-SIC — Serviço de Informação ao Cidadão
### Prefeitura Municipal de Rio Claro — RJ

---

**Data de emissão:** 15 de abril de 2026  
**Elaborado por:** Equipe de Tecnologia da Informação  
**Destinatário:** Gestão Municipal — Prefeitura Municipal de Rio Claro - RJ  
**Classificação:** Interno

---

## 1. APRESENTAÇÃO

O presente relatório descreve o Sistema e-SIC (Serviço de Informação ao Cidadão) implantado para a Prefeitura Municipal de Rio Claro - RJ, contemplando sua finalidade legal, arquitetura tecnológica, funcionalidades disponíveis, perfis de acesso, estrutura de dados e orientações operacionais para a gestão municipal.

---

## 2. BASE LEGAL E FINALIDADE

O sistema foi desenvolvido em atendimento à **Lei Federal nº 12.527/2011 — Lei de Acesso à Informação (LAI)**, que obriga todos os órgãos e entidades da Administração Pública a garantir o direito de acesso à informação a qualquer cidadão.

A LAI estabelece:

- Prazo máximo de **20 dias corridos** para resposta ao pedido, prorrogável por mais 10 dias mediante justificativa.
- Possibilidade de **3 instâncias de recurso** em caso de negativa ou resposta insatisfatória.
- Obrigatoriedade de **portal de transparência** com informações públicas acessíveis sem cadastro.

O e-SIC digitaliza integralmente esse fluxo, eliminando o atendimento presencial e garantindo rastreabilidade e conformidade legal em cada etapa.

---

## 3. VISÃO GERAL DO SISTEMA

O sistema é uma plataforma web de uso exclusivamente municipal, configurada com a identidade visual e os dados da Prefeitura de Rio Claro - RJ (brasão, favicon, cor institucional, CNPJ, endereço e contatos). Ele opera 24 horas por dia, 7 dias por semana, e é acessível por qualquer dispositivo com navegador de internet.

### 3.1 Endereços de Acesso

| Ambiente | URL |
|---|---|
| Sistema (produção) | A configurar conforme hospedagem |
| Portal de Transparência | Página inicial — acesso público sem login |
| Painel Administrativo | `/admin` — exige autenticação |

---

## 4. ARQUITETURA TECNOLÓGICA

O sistema é composto por duas camadas independentes que se comunicam via API REST:

### 4.1 Backend (Servidor de Aplicação)

| Componente | Tecnologia |
|---|---|
| Linguagem | TypeScript / Node.js |
| Framework | Express 5 |
| Banco de dados | PostgreSQL 14+ |
| ORM | Prisma 5.21 |
| Autenticação | JSON Web Token (JWT) |
| Upload de arquivos | Multer (armazenamento local) |
| E-mail | Nodemailer (SMTP configurável) |
| Porta padrão | 3001 |

### 4.2 Frontend (Interface do Usuário)

| Componente | Tecnologia |
|---|---|
| Linguagem | TypeScript / React 19 |
| Build | Vite |
| Roteamento | React Router v7 |
| Ícones | Lucide React |
| Porta padrão | 5173 (dev) / 80 (produção) |

### 4.3 Diagrama Simplificado

```
Cidadão / Servidor  ──►  Frontend (React)  ──►  Backend (Node.js)  ──►  PostgreSQL
                                                       │
                                                       ├── /uploads  (brasão, favicon, anexos)
                                                       └── SMTP      (notificações por e-mail)
```

---

## 5. MÓDULOS E FUNCIONALIDADES

### 5.1 Portal Público (sem login)

| Funcionalidade | Descrição |
|---|---|
| Página inicial | Apresentação institucional com slogan e identidade da prefeitura |
| Portal de Transparência | Busca textual em pedidos respondidos por qualquer cidadão |
| Cadastro de cidadão | Registro com CPF/CNPJ, e-mail, telefone e senha segura |
| Login | Autenticação por e-mail e senha com token JWT |
| Recuperação de senha | Tela de recuperação disponível (fluxo de e-mail configurável) |

### 5.2 Painel do Cidadão

| Funcionalidade | Descrição |
|---|---|
| Novo pedido de acesso | Formulário com descrição detalhada e nível de sigilo (Reservado, Secreto, Ultrassecreto) |
| Acompanhamento | Listagem de todos os pedidos com status em tempo real |
| Detalhe do pedido | Visualização completa com histórico de tramitação, datas e resposta |
| Upload de anexos | Envio de documentos de suporte ao pedido |
| Recurso | Abertura de recurso em 1ª, 2ª e 3ª instância em caso de insatisfação com a resposta |

### 5.3 Painel do Técnico / Servidor

| Funcionalidade | Descrição |
|---|---|
| Lista de pedidos atribuídos | Visualização dos pedidos encaminhados ao seu setor |
| Responder pedido | Registro de resposta com prazo controlado pelo sistema |
| Triagem de pedidos | Classificação e encaminhamento para o departamento competente |
| Histórico de tramitação | Registro completo de cada etapa, usuário e data |

### 5.4 Painel Administrativo

| Funcionalidade | Descrição |
|---|---|
| Dashboard | Painel gerencial com indicadores: total de pedidos, abertos, respondidos, vencidos, recursos |
| Gestão de pedidos | Visualização, triagem, encaminhamento e acompanhamento de todos os pedidos |
| Encaminhamento com WhatsApp | Ao encaminhar um pedido a um setor, botão gera mensagem pré-formatada para WhatsApp do servidor |
| Gestão de usuários | Criar, editar e excluir servidores com atribuição de perfis |
| Gestão de departamentos | Criar, editar e excluir secretarias/setores da prefeitura, incluindo telefone |
| Configurações do município | Personalização completa: brasão, favicon, cor institucional, CNPJ, slogan, endereço e contatos |

---

## 6. PERFIS DE ACESSO

O sistema possui **5 perfis distintos**, com permissões graduadas:

| Perfil | Quem usa | Permissões principais |
|---|---|---|
| **CITIZEN** (Cidadão) | Munícipes em geral | Abrir pedidos, acompanhar, enviar recursos |
| **TECHNICIAN** (Técnico) | Servidores das secretarias | Responder pedidos atribuídos ao seu setor |
| **AUTHORITY** (Autoridade) | Secretários / Chefes de setor | Responder e acompanhar pedidos do setor |
| **CONTROL** (Controle) | Controladoria / Ouvidoria | Visualizar todos os pedidos e usuários; monitorar prazos |
| **ADMIN** (Administrador) | TI / Gestor do e-SIC | Acesso total: configurar, gerenciar, encaminhar, deletar |

---

## 7. FLUXO DE UM PEDIDO DE ACESSO À INFORMAÇÃO

```
1. Cidadão cadastra-se (se necessário) e faz login
2. Cidadão preenche e envia o pedido
   └── Sistema gera protocolo único (ex: ESIC-2026-001) e registra prazo de 20 dias
3. Administrador ou Controle recebe o pedido com status ABERTO
4. Pedido é encaminhado ao departamento competente
   └── Sistema registra movimento e notifica via WhatsApp e/ou e-mail
5. Técnico ou Autoridade do setor responde o pedido
   └── Status muda para RESPONDIDO
6. Cidadão visualiza a resposta no painel ou por e-mail
7. Se insatisfeito → Cidadão abre recurso (1ª instância)
   └── Controle/Autoridade analisa e registra decisão
8. Se ainda insatisfeito → 2ª e 3ª instâncias disponíveis
```

---

## 8. TRANSPARÊNCIA PÚBLICA

A **página de Transparência** é acessível sem qualquer login. Qualquer cidadão pode:

- Buscar pedidos respondidos por palavra-chave
- Ver o número do protocolo, secretaria responsável, data, pergunta e resposta
- Clicar em temas sugeridos ("assuntos mais pesquisados") para acelerar a busca

Isso cumpre o §3º do Art. 8º da LAI, que exige divulgação proativa das informações de interesse público.

---

## 9. SEGURANÇA E CONFORMIDADE

| Aspecto | Implementação |
|---|---|
| Autenticação | JWT com expiração configurável; senha nunca trafega em texto |
| Senhas | Hash irreversível com bcrypt (salt 10); validação de força no cadastro (8+ chars, maiúscula, minúscula, número, símbolo) |
| Autorização | Middleware de perfil em todas as rotas sensíveis |
| Upload de arquivos | Filtro por tipo MIME; limite de 2 MB por arquivo (configurável) |
| Dados sensíveis | CPF/CNPJ armazenados no banco vinculados ao usuário; não expostos publicamente |
| Controle de acesso por perfil | RBAC (Role-Based Access Control) em todas as rotas da API |
| Prevenção de injeção | Prisma ORM com queries parametrizadas (sem SQL bruto) |

---

## 10. IDENTIDADE VISUAL CONFIGURÁVEL

O sistema foi projetado para ser **multi-município**. As seguintes informações são configuráveis pelo próprio administrador, sem necessidade de alteração no código:

| Campo | Configurado para Rio Claro - RJ |
|---|---|
| Nome do município | Rio Claro |
| Estado | RJ |
| CNPJ | 29.138.489/0001-04 |
| Slogan institucional | Configurável |
| Endereço | Configurável |
| Telefone da Ouvidoria | (24) 3351-5600 |
| E-mail do e-SIC | esic@rioclaro.rj.gov.br |
| Site da Prefeitura | https://rioclaro.rj.gov.br |
| Brasão / Logotipo | Imagem PNG/JPG/SVG/WebP |
| Favicon (aba do navegador) | Imagem PNG/ICO |
| Cor primária institucional | #1a5276 (azul) |

---

## 11. DEPARTAMENTOS CADASTRADOS

Os seguintes setores estão pre-cadastrados no sistema:

| Secretaria | Descrição |
|---|---|
| Saúde | Secretaria Municipal de Saúde |
| Educação | Secretaria Municipal de Educação |
| Administração | Secretaria de Administração e RH |
| Obras e Serviços | Secretaria de Obras e Serviços Públicos |
| Finanças | Secretaria Municipal de Finanças |
| Meio Ambiente | Secretaria de Meio Ambiente e Sustentabilidade |
| Assistência Social | Secretaria de Assistência e Desenvolvimento Social |

Novos departamentos podem ser criados ou removidos pelo administrador a qualquer momento.

---

## 12. CRONOGRAMA DE DESENVOLVIMENTO

| Fase | Entrega |
|---|---|
| Estrutura base (autenticação, rotas, banco de dados) | Concluída |
| Gestão de pedidos, tramitação e recursos | Concluída |
| Encaminhamento via WhatsApp para secretarias | Concluída |
| Portal de transparência com busca pública | Concluída |
| Customização municipal (brasão, favicon, cores, dados) | Concluída |
| Validação de segurança de senhas | Concluída |
| **Situação atual** | **Sistema funcional e operacional** |

---

## 13. REQUISITOS DE INFRAESTRUTURA PARA PRODUÇÃO

Para hospedar o sistema em produção, recomenda-se:

| Componente | Mínimo recomendado |
|---|---|
| Servidor (VPS ou Cloud) | 2 vCPU, 4 GB RAM, 40 GB SSD |
| Banco de dados PostgreSQL | Instância gerenciada ou self-hosted |
| Domínio | ex: `esic.rioclaro.rj.gov.br` |
| Certificado SSL (HTTPS) | Obrigatório — Let's Encrypt (gratuito) |
| Backup automático | Diário, retenção mínima de 30 dias |
| Servidor SMTP | Para envio de e-mails de notificação |

---

## 14. PONTOS DE FUNÇÃO E ESTIMATIVA DE VALOR

O sistema foi avaliado pelo método **IFPUG de Análise de Pontos de Função (APF)**:

| Categoria | Pontos |
|---|---|
| Arquivos Lógicos Internos (7 entidades) | 63 PF |
| Arquivos de Interface Externa (e-mail) | 5 PF |
| Entradas Externas (13 formulários/operações) | 51 PF |
| Saídas Externas (WhatsApp, e-mail, relatórios) | 14 PF |
| Consultas Externas (7 listagens/buscas) | 26 PF |
| **Fator de ajuste aplicado (1,07)** | |
| **Total Ajustado** | **≈ 170 PF** |

**Estimativa de valor de mercado do software:** R$ 136.000 – R$ 306.000

---

## 15. PRÓXIMOS PASSOS RECOMENDADOS

| Ação | Prioridade |
|---|---|
| Configurar domínio e certificado SSL | Alta |
| Configurar servidor SMTP para e-mails | Alta |
| Cadastrar todos os servidores responsáveis por secretaria | Alta |
| Realizar treinamento com os técnicos de cada secretaria | Alta |
| Divulgar o canal aos cidadãos (site, redes sociais) | Média |
| Configurar rotina de backup automático do banco | Alta |
| Definir servidor/responsável pelo monitoramento do prazo de 20 dias | Alta |
| Avaliar integração com sistema de protocolo físico já existente | Baixa |

---

## 16. CONCLUSÃO

O sistema e-SIC entregue à Prefeitura Municipal de Rio Claro - RJ é uma solução completa, segura e em conformidade com a Lei de Acesso à Informação. Sua arquitetura moderna garante escalabilidade, manutenibilidade e facilidade de personalização sem dependência de fornecedor.

A plataforma coloca Rio Claro - RJ em conformidade integral com a LAI, moderniza o atendimento ao cidadão, elimina o fluxo presencial e manual de pedidos de informação, e oferece rastreabilidade total de cada solicitação, do protocolo à resposta final.

---

*Documento gerado em 15 de abril de 2026.*  
*Prefeitura Municipal de Rio Claro — RJ | e-SIC — Serviço de Informação ao Cidadão*
