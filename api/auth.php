<?php
/**
 * AXIOM Authentication API
 * Endpoints: /login, /register, /validate, /logout
 */

define('AXIOM_ACCESS', true);
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Start session
session_start();

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'register':
            if ($method !== 'POST') throw new Exception('Method not allowed');
            handleRegister();
            break;
            
        case 'login':
            if ($method !== 'POST') throw new Exception('Method not allowed');
            handleLogin();
            break;
            
        case 'validate':
            if ($method !== 'GET') throw new Exception('Method not allowed');
            handleValidate();
            break;
            
        case 'logout':
            if ($method !== 'POST') throw new Exception('Method not allowed');
            handleLogout();
            break;
            
        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    respondError($e->getMessage(), 400);
}

// ═══ REGISTER ═══
function handleRegister() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($email) || empty($password)) {
        throw new Exception('All fields are required');
    }
    
    if (strlen($username) < 3 || strlen($username) > 50) {
        throw new Exception('Username must be 3-50 characters');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    if (strlen($password) < 8) {
        throw new Exception('Password must be at least 8 characters');
    }
    
    // Check if username or email exists
    $stmt = db()->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    $stmt->execute([$username, $email]);
    
    if ($stmt->fetch()) {
        throw new Exception('Username or email already exists');
    }
    
    // Hash password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]);
    
    // Create user
    $stmt = db()->prepare('
        INSERT INTO users (username, email, password_hash, theme, xp, level, integrity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ');
    
    $stmt->execute([
        $username,
        $email,
        $passwordHash,
        'onyx', // Default theme
        0,      // Starting XP
        1,      // Starting level
        100     // Full integrity
    ]);
    
    $userId = db()->lastInsertId();
    
    // Create session
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['created_at'] = time();
    
    // Fetch full user data
    $user = getUserData($userId);
    
    respondSuccess([
        'message' => 'Registration successful',
        'user' => $user
    ]);
}

// ═══ LOGIN ═══
function handleLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        throw new Exception('Username and password are required');
    }
    
    // Fetch user
    $stmt = db()->prepare('
        SELECT id, username, email, password_hash, theme, xp, level, integrity
        FROM users
        WHERE username = ? OR email = ?
    ');
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();
    
    if (!$user) {
        throw new Exception('Invalid credentials');
    }
    
    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        throw new Exception('Invalid credentials');
    }
    
    // Update last login
    $stmt = db()->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['created_at'] = time();
    
    // Remove password hash from response
    unset($user['password_hash']);
    
    respondSuccess([
        'message' => 'Login successful',
        'user' => $user
    ]);
}

// ═══ VALIDATE SESSION ═══
function handleValidate() {
    if (!isset($_SESSION['user_id'])) {
        respondError('Not authenticated', 401);
    }
    
    // Check session age
    $sessionAge = time() - ($_SESSION['created_at'] ?? 0);
    if ($sessionAge > SESSION_LIFETIME) {
        session_destroy();
        respondError('Session expired', 401);
    }
    
    $user = getUserData($_SESSION['user_id']);
    
    if (!$user) {
        session_destroy();
        respondError('User not found', 401);
    }
    
    respondSuccess([
        'authenticated' => true,
        'user' => $user
    ]);
}

// ═══ LOGOUT ═══
function handleLogout() {
    session_destroy();
    respondSuccess(['message' => 'Logged out successfully']);
}

// ═══ HELPERS ═══
function getUserData($userId) {
    $stmt = db()->prepare('
        SELECT id, username, email, theme, xp, level, integrity, created_at, last_login
        FROM users
        WHERE id = ?
    ');
    $stmt->execute([$userId]);
    return $stmt->fetch();
}

function respondSuccess($data, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    exit;
}

function respondError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message
    ]);
    exit;
}