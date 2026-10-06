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

# Production stage - Nginx
FROM nginx:alpine AS runner

# Copia configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build da etapa anterior
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Expõe porta
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]