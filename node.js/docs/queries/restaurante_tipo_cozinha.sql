'CREATE TABLE `restaurante_tipo_cozinha` (
  `idRestaurante` int NOT NULL,
  `idTipoCozinha` int NOT NULL,
  PRIMARY KEY (`idRestaurante`,`idTipoCozinha`),
  KEY `restauranteTipoCozinha_idx` (`idTipoCozinha`),
  CONSTRAINT `restauranteTipoCozinha` FOREIGN KEY (`idTipoCozinha`) REFERENCES `tipo_cozinha` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `restauranteTipoCozinhaRestaurante` FOREIGN KEY (`idRestaurante`) REFERENCES `restaurante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'