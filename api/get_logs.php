<?php
/**
 * AXIOM // NEURAL DATA BRIDGE (get_logs.php)
 */

// 1. Session Setup - MUST match your login script name
session_name('axiom_session'); 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. Error Reporting - This forces PHP to tell us what's wrong
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    // 3. Database Connection
    // If this fails, it's usually because the path '../db.php' is wrong
    if (!file_exists('../db.php')) {
        throw new Exception("Critical Error: db.php not found at ../db.php");
    }
    require_once '../db.php'; 

    // 4. Auth Check
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'AUTH_REQUIRED', 'session_name' => session_name()]);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $period = isset($_GET['period']) ? intval($_GET['period']) : 30;

    // 5. Query
    $query = "SELECT 
                c.checkin_date AS date, 
                h.category, 
                c.status, 
                c.intensity 
              FROM habits_checkins c
              JOIN habits h ON c.habit_id = h.id
              WHERE c.user_id = ? 
              AND c.checkin_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
              ORDER BY c.checkin_date ASC";

    // IMPORTANT: Check if $conn exists (defined in your db.php)
    if (!isset($conn)) {
        throw new Exception("Database variable \$conn not found in db.php");
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $period);
    $stmt->execute();
    $result = $stmt->get_result();

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = [
            'date'      => $row['date'],
            'category'  => strtolower($row['category']),
            'completed' => ($row['status'] === 'completed' || $row['status'] == 1),
            'intensity' => (float)$row['intensity']
        ];
    }

    echo json_encode($logs);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'SERVER_CRASH',
        'message' => $e->getMessage()
    ]);
}