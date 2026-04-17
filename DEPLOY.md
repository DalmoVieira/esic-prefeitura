# Guia de Deploy - e-SIC Rio Claro (AlmaLinux 9)

Este guia descreve os passos para implantar o sistema e-SIC em um VPS da Hostinger rodando **AlmaLinux 9**.

> **ATENÇÃO:** O AlmaLinux possui regras estritas de segurança (SELinux e Firewalld). Siga os comandos de firewall e SELinux à risca para evitar erros 403 e 503.

## 1. Preparação Básica e Instalação (Pacotes)

Acesse seu VPS via SSH e atualize o sistema:
```bash
dnf update -y
```

Instale as dependências essenciais (Git, GCC, Apache, PostgreSQL):
```bash
dnf install -y git gcc-c++ make httpd mod_ssl postgresql-server postgresql-contrib nano policycoreutils-python-utils
```

Instale o Node.js v20 usando o repositório oficial da NodeSource:
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs
```

Instale o gerenciador de processos **PM2** globalmente:
```bash
npm install -y pm2 -g
```

## 2. Firewall (Liberação de Portas)

O AlmaLinux usa o `firewalld`. Vamos liberar as portas da web (80 e 443):
```bash
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

## 3. Configuração do Banco de Dados (PostgreSQL)

Inicialize e ligue o banco de dados no AlmaLinux:
```bash
postgresql-setup --initdb
systemctl enable postgresql
systemctl start postgresql
```

Crie o banco e o usuário. Altere `SuaSenhaSeguraAqui` para algo forte:
```bash
su - postgres -c "psql -c \"CREATE USER esic_user WITH PASSWORD 'SuaSenhaSeguraAqui';\""
su - postgres -c "psql -c \"CREATE DATABASE esic_rioclaro OWNER esic_user;\""
```
Para permitir a autenticação por senha local no Postgres, é necessário editar a configuração do HBA:
```bash
sed -i 's/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf
systemctl restart postgresql
```

## 4. Clonagem e Configuração do Projeto

Crie a pasta base e clone o repositório:
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/DalmoVieira/esic-rioclarorj.git
cd esic-rioclarorj
```

### Backend (API na porta 3001)
1. Instale e gere a build:
   ```bash
   cd backend
   npm install
   npm run build
   ```
2. Crie e configure o arquivo `.env`:
   ```bash
   nano .env
   ```
   Adicione e salve (substitua a senha pela senha definida no passo do Postgres):
   ```env
   DATABASE_URL="postgresql://esic_user:SuaSenhaSeguraAqui@localhost:5432/esic_rioclaro?schema=public"
   PORT=3001
   JWT_SECRET="um_segredo_super_seguro_e_longo_2026"
   ADMIN_EMAIL="admin@esic.local"
   ADMIN_PASSWORD="Mudar@123"
   ```
3. Execute as migrações e ligue o backend:
   ```bash
   npx prisma db push
   pm2 start dist/index.js --name esic-backend
   pm2 save
   pm2 startup
   ```

### Frontend (Pasta dist)
Gere os arquivos estáticos para o Apache servir:
```bash
cd ../frontend
npm install
npm run build
```

## 5. Configuração do Apache (httpd) e SELinux

### Configurar o VirtualHost
Crie o arquivo de configuração para o domínio:
```bash
nano /etc/httpd/conf.d/esic.conf
```

Cole a configuração abaixo (nós adicionaremos o SSL com o Certbot depois):
```apache
<VirtualHost *:80>
    ServerName dvsinformaticarc.com
    ServerAlias www.dvsinformaticarc.com
    DocumentRoot /var/www/esic-rioclarorj/frontend/dist

    <Directory /var/www/esic-rioclarorj/frontend/dist>
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy para o Backend (API na porta 3001 com IP explícito)
    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:3001/api
    ProxyPassReverse /api http://127.0.0.1:3001/api
    ProxyPass /uploads http://127.0.0.1:3001/uploads
    ProxyPassReverse /uploads http://127.0.0.1:3001/uploads

    ErrorLog /var/log/httpd/esic_error.log
    CustomLog /var/log/httpd/esic_access.log combined
</VirtualHost>
```

### 🚨 Regras do SELinux (Obrigatoriamente rodar!)
Se não rodar isso, o Apache não poderá ler sua pasta nem fazer o proxy (Erro 403 e 503 garantidos):
```bash
# Permite que o Apache se comunique com o backend Node.js (ProxyPass)
setsebool -P httpd_can_network_connect 1

# Permite que o Apache leia/escreva nos arquivos do sistema (Frontend)
chcon -Rt httpd_sys_content_t /var/www/esic-rioclarorj/frontend/dist/
```

Reinicie e ative o Apache:
```bash
systemctl enable httpd
systemctl restart httpd
```

## 6. SSL (Certbot)
Instale e rode o Certbot para o httpd:
```bash
dnf install -y certbot python3-certbot-apache
certbot --apache -d dvsinformaticarc.com -d www.dvsinformaticarc.com
```
*(Ele cuidará da porta 443 e das rotas de ProxyPass seguro de forma automática).*
