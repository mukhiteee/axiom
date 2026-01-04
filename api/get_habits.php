<?php
/**
 * AXIOM // API - GET HABITS
 * Path: /api/get_habits.php
 */

session_name('axiom_session');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
require_once '../db.php'; 

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'AUTH_REQUIRED']);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Get all habits owned by the user
    $query = "SELECT id, name, category FROM habits WHERE user_id = ? ORDER BY name ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $habits = [];
    while ($row = $result->fetch_assoc()) {
        $habits[] = $row;
    }

    echo json_encode($habits);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'SQL_ERROR', 'message' => $e->getMessage()]);
}
?>