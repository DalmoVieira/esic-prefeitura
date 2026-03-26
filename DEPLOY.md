# Guia de Deploy - e-SIC Rio Claro (Hostinger VPS)

Este guia descreve os passos para implantar o sistema e-SIC em um VPS da Hostinger com Ubuntu (recomendado).

## 1. Preparação do Servidor (SSH)

Acesse seu VPS via terminal:
```bash
ssh root@seu_ip_vps
```

Atualize o sistema e instale as dependências básicas:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx git
```

Instale o **PM2** (process manager):
```bash
sudo npm install -y pm2 -g
```

## 2. Configuração do Banco de Dados (PostgreSQL)

Entre no console do Postgres:
```bash
sudo -u postgres psql
```

Crie o banco de dados e o usuário:
```sql
CREATE DATABASE esic_rioclaro;
CREATE USER esic_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE esic_rioclaro TO esic_user;
\q
```

## 3. Clonagem e Configuração do Projeto

Clone seu repositório no VPS:
```bash
cd /var/www
git clone https://github.com/seu-usuario/esic-prefeitura.git
cd esic-prefeitura
```

### Backend
1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Configure o arquivo `.env`:
   ```bash
   nano .env
   ```
   Adicione:
   ```env
   DATABASE_URL="postgresql://esic_user:sua_senha_segura@localhost:5432/esic_rioclaro?schema=public"
   PORT=3000
   JWT_SECRET="um_segredo_super_seguro_e_longo"
   ```
3. Execute as migrações do banco:
   ```bash
   npx prisma migrate deploy
   ```
4. Inicie o backend com PM2:
   ```bash
   pm2 start src/index.js --name esic-backend
   ```

### Frontend
1. Instale as dependências:
   ```bash
   cd ../frontend
   npm install
   ```
2. Gere a build de produção:
   ```bash
   npm run build
   ```
   Isso criará a pasta `dist` dentro de `frontend/`.

## 4. Configuração do Apache (Servidor Web)

Como você está usando Apache, siga estes passos:

### Ativar Módulos Necessários
Certifique-se de que os módulos de proxy e rewrite estão ativos:
```bash
sudo a2enmod proxy proxy_http rewrite
sudo systemctl restart apache2
```

### Configurar o VirtualHost
Crie ou edite o arquivo de configuração do seu site (geralmente em `/etc/apache2/sites-available/000-default.conf` ou um arquivo específico):
```bash
sudo nano /etc/apache2/sites-available/esic.conf
```

Adicione a configuração abaixo:
```apache
<VirtualHost *:80>
    ServerName seu_dominio_ou_ip
    DocumentRoot /var/www/esic-prefeitura/frontend/dist

    <Directory /var/www/esic-prefeitura/frontend/dist>
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy para o Backend (API)
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api

    ErrorLog ${APACHE_LOG_DIR}/esic_error.log
    CustomLog ${APACHE_LOG_DIR}/esic_access.log combined
</VirtualHost>
```

Ative o site e reinicie o Apache:
```bash
sudo a2ensite esic.conf
sudo systemctl restart apache2
```

### Configuração do Frontend (React Router)
Como o React usa roteamento no lado do cliente, você precisa de um arquivo `.htaccess` na pasta `dist` do frontend para que as rotas funcionem corretamente.

Crie o arquivo:
```bash
nano /var/www/esic-prefeitura/frontend/dist/.htaccess
```

Cole o conteúdo abaixo:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## 5. SSL (HTTPS) com Apache

Instale o Certbot para Apache:
```bash
sudo apt install python3-certbot-apache
sudo certbot --apache -d seu_dominio.com.br
```

## Comandos Úteis no VPS
- `pm2 status`: Verifica se o backend está rodando.
- `pm2 logs esic-backend`: Visualiza logs de erro do backend.
- `sudo systemctl status apache2`: Verifica o estado do Apache.
- `sudo tail -f /var/log/apache2/esic_error.log`: Acompanha erros do Apache em tempo real.
