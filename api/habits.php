<?php
/**
 * AXIOM API - Habits Controller
 * Version: 2.7 (Synced with SQL Schema & JSON Constraints)
 */

// 1. SESSION CONFIGURATION
if (!defined('SESSION_NAME')) define('SESSION_NAME', 'axiom_session');
session_name(SESSION_NAME);
session_set_cookie_params([
    'path' => '/',
    'samesite' => 'Lax'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!defined('AXIOM_INIT')) define('AXIOM_INIT', true);
require_once __DIR__ . DIRECTORY_SEPARATOR . 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';
$db = db();

/**
 * 2. AUTHENTICATION CHECK
 */
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id && !in_array($action, ['login', 'register'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'error' => 'Not authenticated.',
        'debug_info' => 'Looking for session: ' . SESSION_NAME
    ]);
    exit;
}

try {
    switch ($action) {
        
        case 'login':
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                session_regenerate_id(true); 
                $_SESSION['user_id'] = $user['id'];
                session_write_close(); 
                echo json_encode(['success' => true, 'message' => 'Logged in', 'user_id' => $user['id']]);
            } else {
                echo json_encode(['success' => false, 'error' => 'User not found']);
            }
            break;

        case 'list':
            $uStmt = $db->prepare("SELECT * FROM users WHERE id = ?");
            $uStmt->execute([$user_id]);
            $userData = $uStmt->fetch(PDO::FETCH_ASSOC);

            $hStmt = $db->prepare("SELECT * FROM habits WHERE user_id = ? AND is_active = 1 AND archived_at IS NULL ORDER BY created_at DESC");
            $hStmt->execute([$user_id]);
            $habitsData = $hStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true, 
                'user' => $userData,
                'data' => $habitsData
            ]);
            break;

        case 'create':
            $input = json_decode(file_get_contents('php://input'), true);
            
            // 1. Convert comma-separated string from JS to JSON array for the SQL CHECK constraint
            $customDaysArray = !empty($input['custom_days']) ? explode(',', $input['custom_days']) : [];
            $customDaysJson = json_encode($customDaysArray);

            // 2. Map frontend 'per_week' to database 'per_week_count'
            $sql = "INSERT INTO habits (
                        user_id, name, description, color, category, frequency, 
                        start_date, end_date, custom_days, per_week_count, 
                        duration, duration_unit, expected_time, is_public
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $user_id, 
                $input['name'], 
                $input['description'] ?? '', 
                $input['color'] ?? '#22d3ee', 
                $input['category'], // Ensure you ran the ALTER TABLE command for new categories
                $input['frequency'],
                !empty($input['start_date']) ? $input['start_date'] : date('Y-m-d'),
                !empty($input['end_date']) ? $input['end_date'] : null,
                $customDaysJson, 
                $input['per_week'] ?? 0, 
                $input['duration'] ?? 0, 
                $input['duration_unit'] ?? 'minutes',
                !empty($input['expected_time']) ? $input['expected_time'] : null,
                $input['is_public'] ?? 0
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;

        case 'checkins':
            // Fetch all checkins for the user to populate the spreadsheet grid
            $stmt = $db->prepare("SELECT habit_id, date, completed, notes, difficulty, mood FROM habit_checkins WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $checkins = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true, 
                'data' => $checkins
            ]);
            break;

        case 'checkin':
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            if (!isset($input['habit_id'], $input['date'])) {
                echo json_encode(['success' => false, 'error' => 'Missing habit ID or date']);
                break;
            }

            // UPDATED SQL: Added actual_duration to columns and ON DUPLICATE KEY section
            $sql = "INSERT INTO habit_checkins (user_id, habit_id, date, completed, notes, difficulty, mood, checkin_time, actual_duration) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE 
                        completed = VALUES(completed), 
                        notes = VALUES(notes), 
                        difficulty = VALUES(difficulty), 
                        mood = VALUES(mood),
                        checkin_time = VALUES(checkin_time),
                        actual_duration = VALUES(actual_duration)"; // <--- ADD THIS
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $user_id, 
                $input['habit_id'], 
                $input['date'], 
                $input['completed'] ?? 1, 
                $input['notes'] ?? null, 
                $input['difficulty'] ?? 1, 
                $input['mood'] ?? 'okay',
                $input['checkin_time'] ?? date('H:i:s'),
                $input['actual_duration'] ?? null // <--- ADD THIS
            ]);
            
            echo json_encode(['success' => true]);
            break;

        case 'register':
            $input = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO users (username, email, level, xp, integrity) VALUES (?, ?, 1, 0, 100)";
            $stmt = $db->prepare($sql);
            $stmt->execute([$input['username'], $input['email']]);
            $new_id = $db->lastInsertId();
            $_SESSION['user_id'] = $new_id; 
            session_write_close();
            echo json_encode(['success' => true, 'id' => $new_id]);
            break;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Action not found']);
    }
} catch (Exception $e) {
    // This will help you see exactly why the database is failing
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage(),
        'trace' => 'Check if column names match your .sql file exactly'
    ]);
}