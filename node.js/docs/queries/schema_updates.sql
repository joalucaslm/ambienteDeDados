CREATE SCHEMA ambientededados;

# MANIPULAÇÕES NA TABELA cliente
SELECT * FROM cliente;
SHOW CREATE TABLE cliente;
ALTER TABLE cliente MODIFY telefone VARCHAR(20);

INSERT INTO cliente (nome, email, telefone)
VALUES ("João Lucas", "joaolucaslimamaia@gmail.com", "85982194601");

# MANIPULAÇÕES NA TABELA entregador
SELECT * FROM entregador;
SHOW CREATE TABLE entregador;

INSERT INTO entregador(nome, telefone, cpf, placaMoto, cnh)
	VALUES("Eugênio", "85992455424", "98724055420", "NQX0822", "749284104");

ALTER TABLE entregador
MODIFY COLUMN status ENUM('ativo', 'inativo', 'Em entrega') DEFAULT 'inativo';

# MANIPULAÇÕES NA TABELA pagamento
SELECT * FROM pagamento;
SHOW CREATE TABLE pagamento;
INSERT INTO pagamento(nome)
	VALUES("Dinheiro");

# MANIPULAÇÕES NA TABELA tipo_item
SELECT * FROM tipo_item;
SHOW CREATE TABLE tipo_item;

ALTER TABLE tipo_item
DROP COLUMN descricao;

INSERT INTO tipo_item(nome)
	VALUES("Padarias");

# MANIPULAÇÕES NA TABELA tipo_cozinha
SELECT * FROM tipo_cozinha;
SHOW CREATE TABLE tipo_cozinha;
ALTER TABLE tipo_cozinha
DROP COLUMN descricao;

INSERT INTO tipo_cozinha(nome)
	VALUES("Churrascaria");
    
# MANIPULAÇÕES NA TABELA endereco
SELECT * FROM endereco;
SHOW CREATE TABLE endereco;

ALTER TABLE endereco_cliente
MODIFY COLUMN tipo ENUM('Residencial','Comercial','Entrega','Cobranca') NULL DEFAULT NULL;

INSERT INTO endereco_cliente(idCliente, logradouro, numero, complemento, bairro, cidade, estado, cep, referencia)
	VALUES(1, "Rua Leão Veloso", "756", "1404 Ventura", "Parque Iracema", "Fortaleza", "CE", "60824200", "Ao lado do Super Do Povo");

ALTER TABLE endereco_cliente
RENAME TO endereco;

ALTER TABLE endereco
MODIFY COLUMN tipo ENUM('Residencial', 'Comercial', 'Entrega', 'Cobranca') NULL DEFAULT NULL;

ALTER TABLE endereco
MODIFY COLUMN idCliente INT NULL;

ALTER TABLE endereco
ADD COLUMN idRestaurante INT NULL AFTER idCliente;


# MANIPULAÇÕES NA TABELA restaurante
SELECT * FROM restaurante;
SHOW CREATE TABLE restaurante;

ALTER TABLE restaurante
MODIFY COLUMN preco ENUM('$', '$$', '$$$') NULL DEFAULT NULL;

ALTER TABLE restaurante MODIFY telefone VARCHAR(20);

INSERT INTO restaurante(nome, descricao, telefone, preco)
	VALUES("Two Brothers", "A MELHOR PIZZA DE FORTAL", "85997760071", '$$$');

ALTER TABLE restaurante
DROP FOREIGN KEY restauranteEndereco;

ALTER TABLE restaurante
DROP COLUMN idEndereco;

# MANIPULAÇÕES NA TABELA item
SELECT * FROM item;
SHOW CREATE TABLE item;
INSERT INTO item(idRestaurante, nome, descricao, idTipo, preco)
	VALUES(1, "Filé a parmegiana", "File empanado com molho de tomate", 1, '169.99');
    
# MANIPULAÇÕES NA TABELA restaurante_pagamento
SELECT * FROM restaurante_pagamento;
SHOW CREATE TABLE restaurante_pagamento;

INSERT INTO restaurante_pagamento(idRestaurante, idPagamento)
	VALUES(1, 1);
    
# MANIPULAÇÕES NA TABELA restaurante_tipo_cozinha
SELECT * FROM restaurante_tipo_cozinha;
SHOW CREATE TABLE restaurante_tipo_cozinha;

INSERT INTO restaurante_tipo_cozinha(idRestaurante, idTipoCozinha)
	VALUES(1, 1);
    
# MANIPULAÇÕES NA TABELA horario_funcionamento
SELECT * FROM horario_funcionamento;
SHOW CREATE TABLE horario_funcionamento;

ALTER TABLE horario_funcionamento
  MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;

INSERT INTO horario_funcionamento(idRestaurante, diaSemana, horaAbertura, horaFechamento)
	VALUES (1, 'Terça', '08:00:00', '18:00:00');
    
# MANIPULAÇÕES NA TABELA pedido
SELECT * FROM pedido;
SHOW CREATE TABLE pedido;

ALTER TABLE pedido
  MODIFY COLUMN avaliacao VARCHAR(200);
  
ALTER TABLE pedido
  MODIFY COLUMN estrelas TINYINT CHECK (estrelas BETWEEN 1 AND 5) AFTER avaliacao;

INSERT INTO pedido(idCliente, status, idPagamento
, avaliacao, estrelas, precoPedido, idEntregador, idRestaurante, inicioPedido, fimPedido, idEnderecoCliente)
	VALUES (1, 'Entregue', 1, 'A comida estava muito boa, chegou quentinha!', 5, 224.42, 1, 1, '18:12:49', '18:52:22', 1);
    
    
# MANIPULAÇÕES NA TABELA pedido_item
SELECT * FROM pedido_item;
SHOW CREATE TABLE pedido_item;

INSERT INTO pedido_item(idPedido, idItem, quantidade, precoUnitario)
	VALUES (1, 1, 3, 37.99);