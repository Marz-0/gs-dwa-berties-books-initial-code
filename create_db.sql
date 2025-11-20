# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

# Users table (for registrations)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(100),
    first VARCHAR(50),
    last VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    PRIMARY KEY(id)
);

# Login audit table to track successful and failed logins
CREATE TABLE IF NOT EXISTS login_audit (
    id INT AUTO_INCREMENT,
    identifier VARCHAR(100) NOT NULL,
    success TINYINT(1) NOT NULL,
    reason VARCHAR(255),
    ip VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

# Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO ' berties_books_app'@'localhost';


