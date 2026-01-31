<?php
// 1. SYSTEM SETTINGS
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// 2. INTEGRATE AXIOM DATABASE
// This pulls in your Database class and the db() helper function
require_once __DIR__ . '/db.php';

// 3. REGISTRATION LOGIC
$message = "";
$status = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['signup_btn'])) {
    $user_name = trim($_POST['username']);
    $user_email = trim($_POST['email']);
    $user_pass = $_POST['password'];

    // Basic Validation
    if (empty($user_name) || empty($user_email) || empty($user_pass)) {
        $message = "All fields are required.";
        $status = "error";
    } else {
        // Securely hash the password (Bcrypt)
        $hashed_password = password_hash($user_pass, PASSWORD_DEFAULT);

        try {
            // Using your db() helper function from db.php
            $stmt = db()->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            
            if ($stmt->execute([$user_name, $user_email, $hashed_password])) {
                $message = "Success! Your account is active. <a href='login.php' style='color:inherit; font-weight:bold;'>Login here</a>";
                $status = "success";
            }
        } catch (PDOException $e) {
            // Check for duplicate entry (Error Code 23000)
            if ($e->getCode() == 23000) {
                $message = "Username or Email is already taken.";
                $status = "error";
            } else {
                // Log the real error for the dev, show a generic one to the user
                error_log("Signup Error: " . $e->getMessage());
                $message = "An internal error occurred. Please try again later.";
                $status = "error";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Axiom | Sign Up</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #030712;
            --glass: rgba(255, 255, 255, 0.03);
            --border: rgba(255, 255, 255, 0.1);
            --accent: #3b82f6;
            --text: #f9fafb;
        }

        body {
            background: radial-gradient(circle at 0% 0%, #1e1b4b 0%, #030712 100%);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }

        .auth-card {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            padding: 40px;
            border-radius: 32px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            text-align: center;
        }

        .logo { font-size: 2rem; font-weight: 800; margin-bottom: 10px; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 30px; }

        .form-group { text-align: left; margin-bottom: 20px; }
        label { display: block; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-left: 4px; }
        
        input {
            width: 100%;
            padding: 14px 18px;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--border);
            border-radius: 16px;
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        input:focus { outline: none; border-color: var(--accent); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: var(--accent);
            border: none;
            border-radius: 16px;
            color: white;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;
            margin-top: 10px;
        }

        .btn-submit:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-submit:active { transform: translateY(0); }

        .alert { padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.4; }
        .error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
        .success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }

        .footer-link { margin-top: 25px; font-size: 0.85rem; color: #64748b; }
        .footer-link a { color: var(--accent); text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>

    <div class="auth-card">
        <div class="logo">AXIOM</div>
        <p class="subtitle">Create your neural habit profile</p>

        <?php if($message): ?>
            <div class="alert <?php echo $status; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="signup.php">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="quantum_user" required>
            </div>

            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="user@axiom.ai" required>
            </div>

            <div class="form-group">
                <label>Master Password</label>
                <input type="password" name="password" placeholder="••••••••" required>
            </div>

            <button type="submit" name="signup_btn" class="btn-submit">Initialize Account</button>
        </form>

        <div class="footer-link">
            Already a member? <a href="login.php">Sign In</a>
        </div>
    </div>

</body>
</html>
