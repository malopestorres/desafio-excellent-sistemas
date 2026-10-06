# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json pnpm-lock.yaml ./

# Instala pnpm e dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia código fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia package files e instala apenas dependências de produção
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copia build da etapa anterior
COPY --from=builder /app/dist ./dist

# Expõe porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main.js"]