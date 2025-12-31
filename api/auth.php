<?php
/**
 * AXIOM Authentication API
 * Handles login, logout, and session validation
 */

// Catch ALL errors and return as JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/db.php';
    
    // 1. Unified Session Configuration
    if (!defined('SESSION_LIFETIME')) define('SESSION_LIFETIME', 2592000);
    if (!defined('SESSION_NAME')) define('SESSION_NAME', 'axiom_session');
    
    // Force session to be available across the entire domain/path
    session_set_cookie_params([
        'lifetime' => SESSION_LIFETIME,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_name(SESSION_NAME);
    session_start();
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'login':
            if ($method !== 'POST') throw new Exception('Method not allowed');
            handleLogin();
            break;
            
        case 'logout':
            handleLogout();
            break;
            
        case 'validate':
            handleValidate();
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    respondError($e->getMessage(), 400);
}

// ═══════════════════════════════════════════════════════════
// LOGIN HANDLER
// ═══════════════════════════════════════════════════════════

function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) throw new Exception('Invalid request data');
    
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        throw new Exception('Username and password are required');
    }
    
    $stmt = db()->prepare('
        SELECT id, username, email, password_hash, xp, level, integrity
        FROM users
        WHERE username = ? OR email = ?
        LIMIT 1
    ');
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();
    
    // Note: In production, use password_verify. 
    // If you haven't hashed passwords yet, use: if($password !== $user['password_hash'])
    if (!$user || !password_verify($password, $user['password_hash'])) {
        throw new Exception('Invalid credentials');
    }
    
    // Update last login
    db()->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);
    
    // 2. CREATE SESSION
    session_regenerate_id(true); // Prevent session fixation
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['created_at'] = time();
    
    // 3. IMPORTANT: Explicitly save session before responding
    session_write_close();
    
    unset($user['password_hash']);
    respondSuccess([
        'message' => 'Login successful',
        'user' => $user
    ]);
}

function handleLogout() {
    session_start();
    session_unset();
    session_destroy();
    // Clear cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    respondSuccess(['message' => 'Logged out successfully']);
}

function handleValidate() {
    if (!isset($_SESSION['user_id'])) {
        respondError('Not authenticated', 401);
    }
    
    $stmt = db()->prepare('SELECT id, username, xp, level, integrity FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        session_destroy();
        respondError('User not found', 401);
    }
    
    respondSuccess(['authenticated' => true, 'user' => $user]);
}

function respondSuccess($data, $code = 200) {
    http_response_code($code);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

function respondError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}