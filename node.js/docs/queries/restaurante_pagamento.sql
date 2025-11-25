'CREATE TABLE `restaurante_pagamento` (
  `idRestaurante` int NOT NULL,
  `idPagamento` int NOT NULL,
  PRIMARY KEY (`idRestaurante`,`idPagamento`),
  KEY `restaurantePagamentoPagamento_idx` (`idPagamento`),
  CONSTRAINT `restaurantePagamentoPagamento` FOREIGN KEY (`idPagamento`) REFERENCES `pagamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `restaurantePagamentoRestaurante` FOREIGN KEY (`idRestaurante`) REFERENCES `restaurante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'