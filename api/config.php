<?php
/**
 * AXIOM Configuration
 * Database credentials and system constants
 */

// Prevent direct access
if (!defined('AXIOM_ACCESS')) {
    http_response_code(403);
    exit('Direct access forbidden');
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'axiom');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Security
define('PASSWORD_COST', 12); // bcrypt cost factor
define('SESSION_LIFETIME', 60 * 60 * 24 * 30); // 30 days
define('TOKEN_LENGTH', 32);

// Timezone
date_default_timezone_set('UTC');

// Error Reporting (change in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS (adjust for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}