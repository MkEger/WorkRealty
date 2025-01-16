# WorkRealty
To start working with Realty write the command in the command line ```npm start```
Next you must connect to bd, i use MySql , but you may try to connect smt else
>Sql script:

CREATE DATABASE mydatabase;

USE mydatabase;

CREATE TABLE Properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  type VARCHAR(50),
  address VARCHAR(255),
  price DECIMAL(10,2),
  area DECIMAL(10,2),
  rooms INT,
  status VARCHAR(50),
  description TEXT
);

-- Создание таблицы Clients 
CREATE TABLE Clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  type VARCHAR(50),
  status VARCHAR(50),
  password VARCHAR(255) NOT NULL
);

-- Создание таблицы Agents
CREATE TABLE Agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255), 
  phone VARCHAR(20),
  email VARCHAR(255),
  commission INT
);

-- Создание таблицы Deals
CREATE TABLE Deals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT,
  client_id INT,
  agent_id INT,
  type VARCHAR(50),
  status VARCHAR(50),
  price DECIMAL(10,2),
  date DATE,
  FOREIGN KEY (property_id) REFERENCES Properties(id),
  FOREIGN KEY (client_id) REFERENCES Clients(id),
  FOREIGN KEY (agent_id) REFERENCES Agents(id)
);

-- Создание таблицы Viewings
CREATE TABLE Viewings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT,
  client_id INT,
  agent_id INT,
  date DATETIME,
  FOREIGN KEY (property_id) REFERENCES Properties(id),
  FOREIGN KEY (client_id) REFERENCES Clients(id),
  FOREIGN KEY (agent_id) REFERENCES Agents(id)
);

UPDATE Clients
SET password = '$2a$10$3k6Yg9dpZ7V0JtBz9mQI5eTxLfg/hD6rRj3zwfmZkm32Bge3l0wSe' -- Хеш пароля: "password"
WHERE email = 'user@example.com';
