-- Amazon Prime Retail Ecosystem Database Schema (MySQL 8.0 / H2 Compatible)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'ROLE_CUSTOMER',
    is_prime_member BOOLEAN DEFAULT FALSE,
    wallet_balance DECIMAL(12,2) DEFAULT 0.00,
    avatar VARCHAR(512),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    image VARCHAR(512) NOT NULL,
    is_prime BOOLEAN DEFAULT TRUE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INT DEFAULT 100,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    date VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    shipping_recipient VARCHAR(255) NOT NULL,
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    shipping_state VARCHAR(64) NOT NULL,
    shipping_zip VARCHAR(32) NOT NULL,
    delivery_option VARCHAR(64) NOT NULL,
    tracking_number VARCHAR(128) NOT NULL,
    carrier VARCHAR(64) NOT NULL,
    estimated_delivery VARCHAR(128) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(512) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS backup_snapshots (
    id VARCHAR(64) PRIMARY KEY,
    timestamp VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    orders_count INT NOT NULL,
    products_count INT NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    encrypted_payload LONGTEXT NOT NULL,
    auto_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    event VARCHAR(255) NOT NULL,
    timestamp VARCHAR(64) NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    device VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    signature VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
