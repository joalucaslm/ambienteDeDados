'CREATE TABLE `horario_funcionamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idRestaurante` int NOT NULL,
  `diaSemana` enum(''Segunda'',''Terça'',''Quarta'',''Quinta'',''Sexta'',''Sábado'',''Domingo'') DEFAULT NULL,
  `horaAbertura` time NOT NULL,
  `horaFechamento` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `horarioFuncionamentoRestaurante_idx` (`idRestaurante`),
  CONSTRAINT `horarioFuncionamentoRestaurante` FOREIGN KEY (`idRestaurante`) REFERENCES `restaurante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'