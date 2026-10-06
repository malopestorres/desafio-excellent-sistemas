-- Script de inicialização do banco de dados
-- Executado automaticamente na primeira criação do container PostgreSQL

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configuração de timezone
SET timezone = 'America/Sao_Paulo';

-- Comentário no banco
COMMENT ON DATABASE desafio_excellent IS 'Banco de dados do desafio Excellent Sistemas - CRUD Cliente, Produto e Pedido';