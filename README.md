# 🛰️ AXIOM // ANALYTICS CORE - V1

![Axiom Dashboard](https://img.shields.io/badge/Version-1.0.0--Hardened-00f3ff?style=for-the-badge)
![License](https://img.shields.io/badge/System-Active-10b981?style=for-the-badge)

**Axiom Analytics** is a high-density, cyberpunk-inspired intelligence engine designed to transform raw habit logs into actionable temporal and geometric data. It moves beyond simple completion tracking to measure **System Velocity, Neural Density, and Structural Geometry.**

---

## ⚡ Core Intelligence Modules

### 🔷 Structural Geometry (Radar Tab)
A custom SVG-based visualization engine that maps life balance across multiple nodes.
* **Dynamic Polygon:** Visualizes the "shape" of your life based on category performance.
* **Focus Distribution:** Identifies dominant vs. dormant operational sectors.

### 🔷 Temporal Consistency (Trends Tab)
Tracking the "heartbeat" of the system through time-series data.
* **Neural Density Map:** A GitHub-inspired 7-row calendar grid visualizing completion frequency.
* **Consistency Waveform:** A smoothed line chart tracking daily output velocity.

### 🔷 Diagnostic Engine (Insights Tab)
Advanced data-crunching to identify system leaks and peak performance windows.
* **Recovery Rate:** Probability of success following a missed day.
* **System Drift:** Variance between planned habits and actual yield.

### 🔷 Atomic Center (Habits Tab)
A high-density command center for individual habit nodes.
* **7-Day Pulse:** Individual sparklines for every habit.
* **Streak Logic:** Real-time calculation of consecutive successful days.

---

## 🛠️ Technical Architecture

### Tech Stack
* **Engine:** Vanilla JavaScript (ES6+)
* **Styling:** CSS3 (Glassmorphism, CSS Grid, Flexbox)
* **Visualization:** [Chart.js](https://www.chartjs.org/) & Custom SVG Math
* **Backend:** PHP / MySQL

### Mathematical Formulas
The engine uses weighted logic to determine system health:

**Momentum Score:**
$$Momentum = (BaseCompletion \times 0.75) + \min(25, Streak \times 2)$$

**Evolution System (XP):**
$$TotalXP = (Volume \times 10) + (Power \times 50) + (Momentum \times 5)$$

---

## 🚀 Installation & Data Schema

### 1. API Requirement
The engine expects a JSON response from `api/get_analytics_data.php`. 



```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "date": "2024-01-01",
        "habit_name": "Deep Work",
        "category": "Mind",
        "completed": true,
        "intensity": 2.5
      }
    ],
    "habits": []
  }
}
