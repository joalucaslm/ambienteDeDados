'CREATE TABLE `entregador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `placaMoto` varchar(10) NOT NULL,
  `cnh` varchar(15) NOT NULL,
  `status` enum(''ativo'',''inativo'',''Em entrega'') DEFAULT ''inativo'',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  UNIQUE KEY `placaMoto_UNIQUE` (`placaMoto`),
  UNIQUE KEY `cnh_UNIQUE` (`cnh`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'