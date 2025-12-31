<?php
/**
 * AXIOM Debug Test
 * Check if everything is configured correctly
 */

header('Content-Type: application/json');

$errors = [];
$checks = [];

// Test 1: Check if config loads
if (!defined('AXIOM_INIT')) {
    define('AXIOM_INIT', true);
}
try {
    require_once __DIR__ . '/config.php';
    $checks['config'] = 'OK';
} catch (Exception $e) {
    $errors[] = 'Config error: ' . $e->getMessage();
    $checks['config'] = 'FAIL';
}

// Test 2: Check if constants are defined
$checks['constants'] = [
    'DB_HOST' => defined('DB_HOST') ? DB_HOST : 'MISSING',
    'DB_NAME' => defined('DB_NAME') ? DB_NAME : 'MISSING',
    'DB_USER' => defined('DB_USER') ? DB_USER : 'MISSING',
    'DB_PASS' => defined('DB_PASS') ? '***' : 'MISSING',
    'SESSION_LIFETIME' => defined('SESSION_LIFETIME') ? SESSION_LIFETIME : 'MISSING',
];

// Test 3: Try database connection
try {
    require_once __DIR__ . '/db.php';
    $pdo = db();
    $checks['database'] = 'Connected';
    
    // Test query
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM users');
    $result = $stmt->fetch();
    $checks['users_count'] = $result['count'];
    
} catch (Exception $e) {
    $errors[] = 'Database error: ' . $e->getMessage();
    $checks['database'] = 'FAIL';
}

// Output results
echo json_encode([
    'status' => count($errors) === 0 ? 'OK' : 'ERROR',
    'checks' => $checks,
    'errors' => $errors
], JSON_PRETTY_PRINT);