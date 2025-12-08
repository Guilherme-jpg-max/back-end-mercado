# 🛒 SuperMercado API - Backend

API RESTful completa para sistema de supermercado, desenvolvida com Node.js, Express e PostgreSQL.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Testando a API](#testando-a-api)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Express Validator** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing

## ✅ Requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **npm** ou **yarn** (vem com Node.js)

## 📦 Instalação

### 1. Clone o repositório (ou crie a pasta)

```bash
mkdir supermercado-backend
cd supermercado-backend
```

### 2. Instale as dependências

```bash
npm install
```

## ⚙️ Configuração

### 1. Configure o PostgreSQL

Abra o terminal do PostgreSQL e crie o banco de dados:

```bash
psql -U postgres
```

### 2. Execute os scripts SQL

```bash
# Criar tabelas
psql -U postgres -f scripts/createTables.sql

# Popular com dados iniciais
psql -U postgres -d supermercado -f scripts/seed.sql
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supermercado
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT (IMPORTANTE: Gere uma chave forte!)
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**💡 DICA:** Para gerar uma chave JWT forte, execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🏃 Executando o Projeto

### Modo de Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo de Produção

```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

### Verificar se está funcionando

Acesse: `http://localhost:3000/health`

Você deve ver:

```json
{
  "status": "ok",
  "timestamp": "2024-11-21T10:00:00.000Z",
  "uptime": 5.123
}
```

## 📁 Estrutura do Projeto

```
supermercado-backend/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuração PostgreSQL
│   │   └── jwt.js            # Configuração JWT
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   ├── categoryController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── auth.js           # Autenticação JWT
│   │   └── errorHandler.js   # Tratamento de erros
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── index.js          # Rotas principais
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── categories.js
│   │   ├── admin.js
│   │   └── contact.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── productValidator.js
│   │   └── orderValidator.js
│   ├── app.js                # Configuração Express
│   └── server.js             # Inicialização do servidor
├── scripts/
│   ├── createTables.sql      # SQL para criar tabelas
│   └── seed.sql              # SQL para dados iniciais
├── .env                      # Variáveis de ambiente (não committar!)
├── .env.example              # Exemplo de variáveis
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Endpoints

### Autenticação

| Método | Endpoint           | Descrição         | Auth |
| ------ | ------------------ | ----------------- | ---- |
| POST   | /api/auth/register | Registrar usuário | ❌   |
| POST   | /api/auth/login    | Fazer login       | ❌   |
| GET    | /api/auth/me       | Dados do usuário  | ✅   |
| POST   | /api/auth/logout   | Fazer logout      | ✅   |

### Produtos (Público)

| Método | Endpoint                     | Descrição              | Auth |
| ------ | ---------------------------- | ---------------------- | ---- |
| GET    | /api/products                | Listar produtos        | ❌   |
| GET    | /api/products/search?q=termo | Buscar produtos        | ❌   |
| GET    | /api/products/featured       | Produtos em destaque   | ❌   |
| GET    | /api/products/category/:cat  | Produtos por categoria | ❌   |
| GET    | /api/products/:id            | Produto por ID         | ❌   |

### Pedidos

| Método | Endpoint              | Descrição     | Auth |
| ------ | --------------------- | ------------- | ---- |
| POST   | /api/orders           | Criar pedido  | ✅   |
| GET    | /api/orders/my-orders | Meus pedidos  | ✅   |
| GET    | /api/orders/:id       | Pedido por ID | ✅   |

### Categorias

| Método | Endpoint        | Descrição         | Auth |
| ------ | --------------- | ----------------- | ---- |
| GET    | /api/categories | Listar categorias | ❌   |

### Admin - Produtos

| Método | Endpoint                              | Descrição         | Auth     |
| ------ | ------------------------------------- | ----------------- | -------- |
| POST   | /api/admin/products                   | Criar produto     | 🔐 Admin |
| PUT    | /api/admin/products/:id               | Atualizar produto | 🔐 Admin |
| DELETE | /api/admin/products/:id               | Deletar produto   | 🔐 Admin |
| PATCH  | /api/admin/products/:id/toggle-active | Ativar/Inativar   | 🔐 Admin |
| PATCH  | /api/admin/products/:id/stock         | Atualizar estoque | 🔐 Admin |

### Admin - Pedidos

| Método | Endpoint                     | Descrição        | Auth     |
| ------ | ---------------------------- | ---------------- | -------- |
| GET    | /api/admin/orders            | Listar pedidos   | 🔐 Admin |
| GET    | /api/admin/orders/:id        | Pedido por ID    | 🔐 Admin |
| PATCH  | /api/admin/orders/:id/status | Atualizar status | 🔐 Admin |

### Admin - Dashboard

| Método | Endpoint                           | Descrição        | Auth     |
| ------ | ---------------------------------- | ---------------- | -------- |
| GET    | /api/admin/dashboard/stats         | Estatísticas     | 🔐 Admin |
| GET    | /api/admin/dashboard/recent-orders | Pedidos recentes | 🔐 Admin |

### Contato

| Método | Endpoint     | Descrição       | Auth |
| ------ | ------------ | --------------- | ---- |
| POST   | /api/contact | Enviar mensagem | ❌   |

## 🔒 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Como autenticar:

1. **Registrar ou fazer login:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

2. **Receber o token:**

```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. **Usar o token nas requisições protegidas:**

```bash
GET /api/orders/my-orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testando a API

### Usando cURL

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "phone": "(11) 99999-9999"
  }'

# Listar produtos
curl http://localhost:3000/api/products

# Buscar produtos
curl http://localhost:3000/api/products/search?q=arroz
```

### Usando Postman ou Insomnia

1. Importe os endpoints manualmente
2. Configure o `Authorization` como `Bearer Token`
3. Teste cada endpoint

### Criar Usuário Admin

Por padrão, não há usuário admin. Para criar um:

1. **Opção 1:** Edite o SQL e insira manualmente:

```sql
-- Gere o hash da senha primeiro com bcrypt
-- Ou use o endpoint de registro e depois mude o role no banco

UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
```

2. **Opção 2:** Crie via código:

```javascript
// Criar arquivo scripts/createAdmin.js
const bcrypt = require("bcrypt");
const { query } = require("./src/config/database");

async function createAdmin() {
  const password = await bcrypt.hash("admin123", 10);

  await query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    ["Admin", "admin@supermercado.com", password, "admin"]
  );

  console.log("Admin criado com sucesso!");
  process.exit(0);
}

createAdmin();
```

Então execute: `node scripts/createAdmin.js`

## 🐛 Solução de Problemas

### Erro: "não foi possível conectar ao banco de dados"

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `psql -U postgres -d supermercado`

### Erro: "JWT_SECRET not configured"

- Configure a variável `JWT_SECRET` no `.env`
- Gere uma chave forte (veja seção de configuração)

### Erro: "Port 3000 already in use"

- Mude a porta no `.env`: `PORT=3001`
- Ou pare o processo que está usando a porta 3000

### Erro ao criar pedido: "estoque insuficiente"

- Verifique se há produtos no banco (`SELECT * FROM products;`)
- Execute o script de seed novamente se necessário

## 📚 Scripts Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Criar tabelas
npm run db:create

# Popular banco com dados
npm run db:seed
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT
- ✅ Rate limiting
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Validação de entrada em todos os endpoints
- ✅ SQL injection prevenido (queries parametrizadas)

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Desenvolvido para o Sistema SuperMercado
