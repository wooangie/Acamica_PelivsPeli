CREATE TABLE `competencias`.`votacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pelicula_id` INT UNSIGNED NOT NULL,
  `competencia_id` INT NOT NULL,
  `votos` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `relacionPelicula_idx` (`pelicula_id` ASC) VISIBLE,
  INDEX `relacionCompetencia_idx` (`competencia_id` ASC) VISIBLE,
  CONSTRAINT `relacionCompetencia`
    FOREIGN KEY (`competencia_id`)
    REFERENCES `competencias`.`competencia` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `relacionPelicula`
    FOREIGN KEY (`pelicula_id`)
    REFERENCES `competencias`.`pelicula` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `genero_id` INT UNSIGNED NULL AFTER `nombre`,
ADD INDEX `genero_competencia_idx` (`genero_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `genero_competencia`
  FOREIGN KEY (`genero_id`)
  REFERENCES `competencias`.`genero` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `actor_id` INT UNSIGNED NULL AFTER `genero_id`,
ADD COLUMN `competenciacol` INT NULL AFTER `actor_id`,
ADD COLUMN `director_id` INT UNSIGNED NULL AFTER `competenciacol`,
ADD INDEX `director_competencia_idx` (`director_id` ASC) VISIBLE,
ADD INDEX `actor_competencia_idx` (`actor_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `director_competencia`
  FOREIGN KEY (`director_id`)
  REFERENCES `competencias`.`director` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `actor_competencia`
  FOREIGN KEY (`actor_id`)
  REFERENCES `competencias`.`actor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `competencias`.`competencia` 
DROP FOREIGN KEY `actor_competencia`,
DROP FOREIGN KEY `director_competencia`,
DROP FOREIGN KEY `genero_competencia`;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `actor_competencia`
  FOREIGN KEY (`actor_id`)
  REFERENCES `competencias`.`actor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `director_competencia`
  FOREIGN KEY (`director_id`)
  REFERENCES `competencias`.`director` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `genero_competencia`
  FOREIGN KEY (`genero_id`)
  REFERENCES `competencias`.`genero` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

