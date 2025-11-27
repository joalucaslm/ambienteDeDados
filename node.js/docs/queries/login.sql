CREATE TABLE `ambientededados`.`login` (
  `idlogin` INT NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idlogin`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);