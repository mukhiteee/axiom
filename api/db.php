<?php
/**
 * AXIOM Database Connection
 * PDO Singleton Pattern
 */

define('AXIOM_INIT', true);
require_once __DIR__ . '/config.php';

class Database {
    private static $instance = null;
    private $pdo;
    
    private function __construct() {
        // Check if constants are defined
        if (!defined('DB_HOST') || !defined('DB_NAME')) {
            error_log('[AXIOM DB] Database constants not defined');
            die(json_encode([
                'success' => false,
                'error' => 'Database configuration error'
            ]));
        }
        
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_NAME,
            DB_CHARSET
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Log error
            error_log('[AXIOM DB] Connection failed: ' . $e->getMessage());
            
            // Return JSON error instead of dying
            header('Content-Type: application/json');
            die(json_encode([
                'success' => false,
                'error' => 'Database connection failed: ' . ($e->getCode() === 1045 ? 'Invalid credentials' : 'Server unavailable')
            ]));
        }
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection() {
        return $this->pdo;
    }
    
    /**
     * Prevent cloning
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization
     */
    public function __wakeup() {
        throw new Exception('Cannot unserialize singleton');
    }
}

/**
 * Helper function for easy database access
 */
function db() {
    return Database::getInstance()->getConnection();
}