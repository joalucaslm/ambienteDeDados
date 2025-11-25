-- Migração: adicionar coluna senha ao cliente e converter telefone para VARCHAR
-- Faça backup do banco antes de executar.

ALTER TABLE cliente
  MODIFY telefone VARCHAR(20) NOT NULL;

ALTER TABLE cliente
  ADD COLUMN senha VARCHAR(255) NULL AFTER telefone;

-- Opcional: marcar senha como NOT NULL após preencher as senhas existentes
-- ALTER TABLE cliente MODIFY senha VARCHAR(255) NOT NULL;
