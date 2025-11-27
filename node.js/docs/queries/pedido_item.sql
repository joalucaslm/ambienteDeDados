'CREATE TABLE `pedido_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `idItem` int NOT NULL,
  `quantidade` int NOT NULL,
  `precoUnitario` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidoItemPedido_idx` (`idPedido`),
  KEY `pedidoItem_idx` (`idItem`),
  CONSTRAINT `pedidoItem` FOREIGN KEY (`idItem`) REFERENCES `item` (`id`),
  CONSTRAINT `pedidoItemPedido` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'