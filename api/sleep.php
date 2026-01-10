<?php
/**
 * Sleep Tracker API
 * Handles sleep logging and data retrieval
 */

header('Content-Type: application/json');
session_start();

// Database connection (adjust these)
$host = 'localhost';
$dbname = 'axiom';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Get user ID (adjust based on your auth system)
$user_id = $_SESSION['user_id'] ?? 1;

$action = $_GET['action'] ?? '';

switch($action) {
    case 'list':
        listSleepLogs($pdo, $user_id);
        break;
    
    case 'log':
        logSleep($pdo, $user_id);
        break;
    
    case 'delete':
        deleteSleepLog($pdo, $user_id);
        break;
    
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

/**
 * Get all sleep logs for user
 */
function listSleepLogs($pdo, $user_id) {
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM sleep_logs 
            WHERE user_id = ? 
            ORDER BY date DESC 
            LIMIT 30
        ");
        $stmt->execute([$user_id]);
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $logs
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Log sleep entry
 */
function logSleep($pdo, $user_id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $date = $data['date'] ?? null;
    $bedtime = $data['bedtime'] ?? null;
    $wakeup_time = $data['wakeup_time'] ?? null;
    $duration = $data['duration'] ?? 0;
    $quality = $data['quality'] ?? 0;
    $mood = $data['mood'] ?? 'okay';
    $notes = $data['notes'] ?? '';
    $cycle_data = $data['cycle_data'] ?? '';
    
    if (!$date || !$bedtime || !$wakeup_time) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        return;
    }
    
    try {
        // Check if entry exists for this date
        $stmt = $pdo->prepare("SELECT id FROM sleep_logs WHERE user_id = ? AND date = ?");
        $stmt->execute([$user_id, $date]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Update existing entry
            $stmt = $pdo->prepare("
                UPDATE sleep_logs 
                SET bedtime = ?, wakeup_time = ?, duration = ?, quality = ?, 
                    mood = ?, notes = ?, cycle_data = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $bedtime, $wakeup_time, $duration, $quality, 
                $mood, $notes, $cycle_data, $existing['id']
            ]);
        } else {
            // Insert new entry
            $stmt = $pdo->prepare("
                INSERT INTO sleep_logs 
                (user_id, date, bedtime, wakeup_time, duration, quality, mood, notes, cycle_data, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $user_id, $date, $bedtime, $wakeup_time, $duration, 
                $quality, $mood, $notes, $cycle_data
            ]);
        }
        
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Delete sleep log entry
 */
function deleteSleepLog($pdo, $user_id) {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'error' => 'Missing ID']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM sleep_logs WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>