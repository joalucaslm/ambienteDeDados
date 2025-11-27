'CREATE TABLE `endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCliente` int DEFAULT NULL,
  `idRestaurante` int DEFAULT NULL,
  `logradouro` varchar(100) NOT NULL,
  `numero` int DEFAULT NULL,
  `complemento` varchar(45) DEFAULT NULL,
  `bairro` varchar(45) NOT NULL,
  `cidade` varchar(60) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `referencia` varchar(45) DEFAULT NULL,
  `tipo` enum(''Residencial'',''Comercial'',''Entrega'',''Cobranca'') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enderecoClienteCliente_idx` (`idCliente`),
  CONSTRAINT `enderecoClienteCliente` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'