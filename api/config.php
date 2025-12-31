<?php
/**
 * AXIOM Configuration
 * Database and system settings
 */

// Prevent direct access
if (!defined('AXIOM_INIT')) {
    http_response_code(403);
    die('Direct access not allowed');
}

// ═══════════════════════════════════════════════════════════
// DATABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════

define('DB_HOST', 'localhost');
define('DB_NAME', 'axiom');
define('DB_USER', 'root');
define('DB_PASS', '');  // Change this to your MySQL password
define('DB_CHARSET', 'utf8mb4');

// ═══════════════════════════════════════════════════════════
// SECURITY SETTINGS
// ═══════════════════════════════════════════════════════════

define('PASSWORD_COST', 12);           // bcrypt cost factor
define('SESSION_LIFETIME', 2592000);   // 30 days in seconds
define('SESSION_NAME', 'axiom_session');

// ═══════════════════════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════

define('TIMEZONE', 'UTC');
date_default_timezone_set(TIMEZONE);

// ═══════════════════════════════════════════════════════════
// ERROR REPORTING
// Change to 0 in production
// ═══════════════════════════════════════════════════════════

define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);  // Don't display in output
    ini_set('log_errors', 1);      // Log to file instead
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// ═══════════════════════════════════════════════════════════
// CORS HEADERS (for API)
// ═══════════════════════════════════════════════════════════

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}