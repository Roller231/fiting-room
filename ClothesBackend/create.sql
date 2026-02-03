-- ================================================================
--   Try-On Project — Full Database Schema (MySQL 8.x)
-- ================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS tryon_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tryon_db;

-- ================================================================
--   Shops
-- ================================================================
CREATE TABLE shops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- ================================================================
--   Categories
-- ================================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(100) NULL
);

-- ================================================================
--   Razdels (sections)
-- ================================================================
CREATE TABLE razdels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    isPremium BOOLEAN NOT NULL DEFAULT FALSE
);

-- ================================================================
--   Products
-- ================================================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    photo VARCHAR(1024) NOT NULL,
    price FLOAT NOT NULL DEFAULT 0.0,
    prompt TEXT NULL,

    category_id INT NOT NULL,
    shop_id INT NOT NULL,

    razdel_id INT NULL,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_product_shop
        FOREIGN KEY (shop_id) REFERENCES shops(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_product_razdel
        FOREIGN KEY (razdel_id) REFERENCES razdels(id)
        ON DELETE SET NULL
);

-- ================================================================
--   Users
-- ================================================================
CREATE TABLE users (
    tg_id BIGINT PRIMARY KEY,             -- Telegram ID
    username VARCHAR(255) NULL,
    first_name VARCHAR(255) NULL,
    can_send_count INT NOT NULL DEFAULT 0,
    isPremium BOOLEAN NOT NULL DEFAULT FALSE
);

-- ================================================================
--   Initial data (optional)
-- ================================================================
-- INSERT INTO shops (name) VALUES ('Shop 1');
-- INSERT INTO categories (name, type) VALUES ('Clothes', 'woman');
-- INSERT INTO razdels (name, isPremium) VALUES ('Recommended', FALSE);
