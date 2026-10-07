## Tecnologias

**Frontend:** Angular 22, Angular Material 22, Vitest.
**Backend:** NestJS, TypeORM e PostgreSQL Vitest.
**Infraestrutura:** Docker Compose com os serviços de PostgreSQL, pgAdmin, backend e frontend.

## Como subir

1. Crie o arquivo de ambiente a partir do exemplo e preencha as senhas:

   ```bash
   cp .env.example .env
   ```

2. Suba todos os serviços

   ```bash
   docker compose up -d --build
   ```

3. Acesso
   - Frontend http://localhost:4200
   - pgAdmin http://localhost:5050

> **Banco de dados:** ao subir o Docker, o backend popula o banco com seed, **3 produtos, 5 clientes e 3 pedidos** sempre que estiver vazio. Nenhuma configuracao adicional é necessário, para recomeçar do zero, basta subir o compose ou reiniciar o backend com o banco vazio.

**Alternativa sem Docker:** suba apenas PostgreSQL com `docker compose up -d postgres` e rode `npm install && npm run start` dentro de `backend/` e `frontend/`.
