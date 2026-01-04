<?php
/**
 * AXIOM // UNIFIED ANALYTICS DATA ENGINE
 * Version: 2.8.3 (Buffered to prevent JSON corruption)
 */

// 1. START BUFFERING IMMEDIATELY
// This catches warnings so they don't precede the JSON
ob_start();

// 2. SESSION CONFIGURATION (Your exact logic)
if (!defined('SESSION_NAME')) define('SESSION_NAME', 'axiom_session');
session_name(SESSION_NAME);
session_set_cookie_params([
    'path' => '/',
    'samesite' => 'Lax'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. INITIALIZATION
if (!defined('AXIOM_INIT')) define('AXIOM_INIT', true);
require_once __DIR__ . DIRECTORY_SEPARATOR . 'db.php';

// 4. CLEAN THE BUFFER
// This wipes the "Constant already defined" warnings out of existence
ob_clean();
header('Content-Type: application/json');

$db = db(); 
$user_id = $_SESSION['user_id'] ?? null;

// 5. AUTHENTICATION CHECK
if (!$user_id) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'error' => 'Not authenticated.',
        'debug_info' => 'Looking for session: ' . SESSION_NAME
    ]);
    exit;
}

try {
    $period = isset($_GET['period']) ? intval($_GET['period']) : 30;

    // 6. FETCH HABITS
    $hStmt = $db->prepare("SELECT id, name, category FROM habits WHERE user_id = ? AND is_active = 1");
    $hStmt->execute([$user_id]);
    $habitsData = $hStmt->fetchAll(PDO::FETCH_ASSOC);

    // 7. FETCH LOGS
    $lQuery = "SELECT 
                    c.date, 
                    h.category, 
                    c.completed, 
                    c.difficulty AS intensity 
               FROM habit_checkins c
               JOIN habits h ON c.habit_id = h.id
               WHERE c.user_id = ? 
               AND c.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
               ORDER BY c.date ASC";

    $lStmt = $db->prepare($lQuery);
    $lStmt->execute([$user_id, $period]);
    $logsData = $lStmt->fetchAll(PDO::FETCH_ASSOC);

    // 8. FORMAT DATA FOR JS ENGINE
    $formattedLogs = [];
    foreach ($logsData as $row) {
        $formattedLogs[] = [
            'date'      => $row['date'],
            'category'  => strtolower($row['category']),
            'completed' => (bool)$row['completed'],
            'intensity' => (float)$row['intensity']
        ];
    }

    // 9. UNIFIED RESPONSE
    echo json_encode([
        'success' => true,
        'data' => [
            'logs'   => $formattedLogs,
            'habits' => $habitsData
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

// Ensure clean exit
ob_end_flush();