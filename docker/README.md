# Desafio Excellent Sistemas - Infraestrutura Docker

## Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| PostgreSQL | 5432 | Banco de dados principal |
| PgAdmin | 5050 | Interface web para gerenciamento do PostgreSQL |

## Como usar

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env se necessário
```

### 2. Subir os containers

```bash
# Subir em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e remover volumes (apaga dados do banco)
docker-compose down -v
```

### 3. Acessar PgAdmin

- URL: http://localhost:5050
- Email: admin@desafio.local (ou PGADMIN_EMAIL do .env)
- Senha: admin (ou PGADMIN_PASSWORD do .env)

### 4. Conectar ao PostgreSQL

- Host: localhost (ou postgres dentro da rede Docker)
- Porta: 5432
- Database: desafio_excellent
- Usuário: postgres
- Senha: postgres

## Estrutura de volumes

- `postgres_data`: Dados persistentes do PostgreSQL
- `pgadmin_data`: Configurações do PgAdmin

## Rede

Todos os serviços compartilham a rede `desafio-network`, permitindo comunicação por nome de serviço (ex: `postgres:5432`).