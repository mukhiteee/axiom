<?php
// 1. Error Reporting (So you never see a white screen again)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 2. Database Connection (Update these details)
$host = 'localhost';
$db   = 'axiom';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
     $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (\PDOException $e) {
     die("Connection Failed: " . $e->getMessage());
}

// 3. The Deep SQL Query
// This fetches habits and checkins, calculating streaks and performance in one go.
$query = "
    SELECT 
        c.*, 
        h.name as habit_name, 
        h.category
    FROM habit_checkins c
    JOIN habits h ON c.habit_id = h.id
    WHERE c.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    ORDER BY c.date ASC
";

$data = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);

// 4. Data Processing for Charts
$dates = [];
$dailyCount = [];
$moodDistribution = ['great'=>0, 'happy'=>0, 'okay'=>0, 'tired'=>0, 'stressed'=>0];
$hourlySuccess = array_fill(0, 24, 0);

foreach ($data as $row) {
    if ($row['completed']) {
        $date = $row['date'];
        $dailyCount[$date] = ($dailyCount[$date] ?? 0) + 1;
        
        if ($row['mood']) $moodDistribution[$row['mood']]++;
        
        if ($row['checkin_time']) {
            $hour = (int)date('H', strtotime($row['checkin_time']));
            $hourlySuccess[$hour]++;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Axiom Intelligence | Deep Analytics</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #030712;
            --card: #111827;
            --accent: #3b82f6;
            --text: #f9fafb;
            --border: #1f2937;
        }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0; padding: 40px;
        }

        .container { max-width: 1200px; margin: 0 auto; }

        .header { margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; margin: 0; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* Bento Grid */
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: auto;
            gap: 20px;
        }

        .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 24px;
            transition: transform 0.2s;
        }

        .card:hover { transform: translateY(-5px); border-color: var(--accent); }

        .span-2 { grid-column: span 2; }
        .span-3 { grid-column: span 3; }
        .tall { grid-row: span 2; }

        .metric { font-size: 3rem; font-weight: 800; color: var(--accent); }
        .label { color: #9ca3af; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1.5px; }

        .chart-wrapper { height: 280px; margin-top: 20px; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Intelligence Dashboard</h1>
        <p style="color: #6b7280;">Advanced habit-environment correlation engine</p>
    </div>

    <div class="bento-grid">
        <div class="card">
            <span class="label">Total Check-ins</span>
            <div class="metric"><?php echo count(array_filter($data, fn($x) => $x['completed'])); ?></div>
            <p style="color: #10b981; font-size: 0.9rem;">Last 30 Days</p>
        </div>

        <div class="card">
            <span class="label">Average Quality</span>
            <div class="metric">
                <?php 
                $avgMood = count($data) > 0 ? count(array_filter($data, fn($x) => $x['mood'] == 'great' || $x['mood'] == 'happy')) : 0;
                echo ($avgMood > 0) ? round(($avgMood / count($data)) * 100) : 0;
                ?>%
            </div>
            <p style="color: #6b7280; font-size: 0.8rem;">High-vibe sessions</p>
        </div>

        <div class="card span-2">
            <span class="label">30-Day Momentum</span>
            <div class="chart-wrapper">
                <canvas id="momentumChart"></canvas>
            </div>
        </div>

        <div class="card span-2 tall">
            <span class="label">Psychological Profile (Mood vs. Success)</span>
            <div class="chart-wrapper">
                <canvas id="moodChart"></canvas>
            </div>
        </div>
        

        <div class="card span-2">
            <span class="label">Peak Performance Window</span>
            <div class="chart-wrapper">
                <canvas id="timeChart"></canvas>
            </div>
        </div>
        

    </div>
</div>

<script>
    // Data Injected from PHP
    const dailyData = <?php echo json_encode(array_values($dailyCount)); ?>;
    const dailyLabels = <?php echo json_encode(array_keys($dailyCount)); ?>;
    const moodData = <?php echo json_encode(array_values($moodDistribution)); ?>;
    const hourlyData = <?php echo json_encode(array_values($hourlySuccess)); ?>;

    // Momentum Chart
    new Chart(document.getElementById('momentumChart'), {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Habits Done',
                data: dailyData,
                borderColor: '#3b82f6',
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Mood Radar
    new Chart(document.getElementById('moodChart'), {
        type: 'radar',
        data: {
            labels: ['Great', 'Happy', 'Okay', 'Tired', 'Stressed'],
            datasets: [{
                label: 'Frequency',
                data: moodData,
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: '#a855f7',
                pointBackgroundColor: '#a855f7'
            }]
        },
        options: { maintainAspectRatio: false }
    });

    // Time Distribution
    new Chart(document.getElementById('timeChart'), {
        type: 'bar',
        data: {
            labels: Array.from({length: 24}, (_, i) => i + ':00'),
            datasets: [{
                data: hourlyData,
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
</script>

</body>
</html>