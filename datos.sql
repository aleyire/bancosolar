CREATE DATABASE bancosolar;

\c bancosolar

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(50),
    balance FLOAT CHECK (balance >= 0)
);

CREATE TABLE transferencias (
    id SERIAL PRIMARY KEY, 
    emisor INT, 
    receptor INT, 
    monto FLOAT, 
    fecha TIMESTAMP, 
    FOREIGN KEY (emisor) REFERENCES usuarios(id), 
    FOREIGN KEY (receptor) REFERENCES usuarios(id)
);

SELECT * FROM usuarios;

SELECT * FROM transferencias;

INSERT INTO transferencias (
    emisor, 
    receptor, 
    monto, 
    fecha
) VALUES ($1, $2, $3, now());

INSERT INTO usuarios (nombre, balance) values ($1, $2);

UPDATE usuarios SET
        nombre = $1,
        balance = $2
        WHERE id = $3;

DELETE FROM usuarios WHERE id = $1;

SELECT t.fecha, u.nombre AS emisor, u_2.nombre AS receptor, t.monto 
FROM transferencias t 
INNER JOIN usuarios u 
ON t.emisor = u.id 
INNER JOIN usuarios AS u_2 
ON t.receptor = u_2.id;

DELETE emisor FROM transferencias WHERE id = $1;
DELETE receptor FROM transferencias WHERE id = $1;
