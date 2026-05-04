# Cone Trufado - E-commerce Platform

**Professor**: Deivison Shindi Takatu

Um e-commerce moderno desenvolvido com tecnologias atuais: React, Vite, Express.js e MongoDB.

## Estrutura do Projeto

Este é um **monorepo** contendo aplicação frontend e backend:

```
project-root/
├── web/                    # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── common/     # Componentes reutilizáveis
│   │   │   ├── features/   # Componentes específicos de features
│   │   │   └── layout/     # Componentes de layout
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Chamadas à API
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context API
│   │   ├── styles/         # Estilos globais
│   │   ├── utils/          # Utilitários
│   │   └── constants/      # Constantes
│   └── index.html
│
├── api/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Lógica de requisições
│   │   ├── models/         # Schemas MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── middlewares/    # Middlewares
│   │   ├── services/       # Lógica de negócio
│   │   ├── validators/     # Validações
│   │   ├── utils/          # Utilitários
│   │   ├── constants/      # Constantes
│   │   └── server.js       # Entrada da aplicação
│   └── package.json
│
├── docs/                   # Documentação
├── scripts/                # Scripts auxiliares
├── .github/                # Configurações do GitHub
├── .env.example            # Variáveis de ambiente exemplo
├── package.json            # Dependências unificadas
└── package-lock.json       # Lock file unificado
```

## Começando

### Pré-requisitos

- Node.js v18+
- npm v9+
- MongoDB local ou Atlas

### Instalação

1. **Clonar repositório**

   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Instalar dependências**

   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**

   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

4. **Executar projeto**
   ```bash
   npm run dev
   ```

### Comandos Disponíveis

```bash
# Desenvolvimento (ambos frontend e backend)
npm run dev

# Build frontend
npm run build

# Lint
npm run lint

# Preview
npm run preview

# Start backend (produção)
npm start
```

## Dependências

### Frontend

- React 19
- Vite
- Tailwind CSS
- Axios

### Backend

- Express.js
- MongoDB/Mongoose
- JWT
- Bcrypt
- CORS

## Segurança

- Senhas hasheadas com bcrypt
- Autenticação JWT
- CORS configurado
- Validação de entrada
