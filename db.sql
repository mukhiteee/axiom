-- ═══════════════════════════════════════════════════════════
-- AXIOM DATABASE SCHEMA
-- Run this in phpMyAdmin or MySQL Workbench
-- ═══════════════════════════════════════════════════════════

-- Create database
CREATE DATABASE IF NOT EXISTS axiom 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE axiom;

-- ═══════════════════════════════════════════════════════════
-- USERS TABLE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- User preferences
    theme ENUM('onyx', 'light') DEFAULT 'onyx',
    
    -- Gamification
    xp INT UNSIGNED DEFAULT 0,
    level INT UNSIGNED DEFAULT 1,
    integrity DECIMAL(5,2) DEFAULT 100.00,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_last_login (last_login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════
-- HABITS TABLE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE habits (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    
    -- Habit details
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('mental', 'physical', 'technical', 'social', 'creative') NOT NULL,
    
    -- Target settings
    target_value INT UNSIGNED DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'count',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════
-- HABIT LOGS TABLE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE habit_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    habit_id INT UNSIGNED NOT NULL,
    
    -- Log data
    value INT UNSIGNED NOT NULL,
    note TEXT,
    
    -- Timestamps
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_date (user_id, logged_at),
    INDEX idx_habit_date (habit_id, logged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════
-- XP TRANSACTIONS TABLE (Audit log)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE xp_transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    habit_id INT UNSIGNED,
    
    -- Transaction details
    amount INT NOT NULL,
    reason VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_user_date (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════
-- INSERT TEST USER
-- Password: password123
-- ═══════════════════════════════════════════════════════════

INSERT INTO users (username, email, password_hash, theme, xp, level, integrity) 
VALUES (
    'admin',
    'admin@axiom.com',
    '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7I8LhrgQ4W',
    'onyx',
    0,
    1,
    100.00
);