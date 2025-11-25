'CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idRestaurante` int NOT NULL,
  `nome` varchar(60) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `idTipo` int NOT NULL,
  `preco` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idTipoTipoItem_idx` (`idTipo`),
  CONSTRAINT `idTipoTipoItem` FOREIGN KEY (`idTipo`) REFERENCES `tipo_item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'