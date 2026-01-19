-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2026 at 01:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `axiom`
--

-- --------------------------------------------------------

--
-- Table structure for table `habits`
--

CREATE TABLE `habits` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#22d3ee',
  `category` enum('physical','mental','social','educational','productivity','spiritual','wellness') NOT NULL,
  `frequency` enum('daily','custom-days','per-week') NOT NULL DEFAULT 'daily',
  `custom_days` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of day numbers [0-6] for custom frequency' CHECK (json_valid(`custom_days`)),
  `per_week_count` int(10) UNSIGNED DEFAULT NULL COMMENT 'Target completions per week',
  `duration` int(10) UNSIGNED DEFAULT NULL COMMENT 'Expected duration in minutes',
  `duration_unit` enum('minutes','hours') DEFAULT 'minutes',
  `expected_time` time DEFAULT NULL COMMENT 'Expected time of day',
  `is_public` tinyint(1) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `habits`
--

INSERT INTO `habits` (`id`, `user_id`, `name`, `description`, `color`, `category`, `frequency`, `custom_days`, `per_week_count`, `duration`, `duration_unit`, `expected_time`, `is_public`, `start_date`, `end_date`, `is_active`, `archived_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'Deep Work Block', 'High-intensity coding session', '#3b82f6', 'social', 'daily', NULL, NULL, 90, 'minutes', '09:00:00', 0, NULL, NULL, 1, NULL, '2025-10-04 23:48:15', '2025-12-31 15:01:48'),
(2, 1, 'Morning Meditation', 'Mindfulness and breathing', '#a855f7', 'mental', 'daily', NULL, NULL, 15, 'minutes', '06:30:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(3, 1, 'Gym: Upper Body', 'Strength training at local gym', '#ef4444', 'physical', 'daily', NULL, NULL, 60, 'minutes', '17:00:00', 1, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(4, 1, 'Hydration Goal', 'Drink 3 Liters of water', '#22d3ee', 'physical', 'daily', NULL, NULL, NULL, 'minutes', NULL, 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(5, 1, 'Technical Reading', 'Read 5 pages of Documentation', '#3b82f6', 'spiritual', 'daily', NULL, NULL, 30, 'minutes', '21:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:01:54'),
(6, 1, 'Journaling', 'Reflect on wins and losses', '#a855f7', 'mental', 'daily', NULL, NULL, 10, 'minutes', '22:30:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(7, 1, 'Networking', 'Engage with 3 LinkedIn posts', '#f59e0b', 'social', 'daily', NULL, NULL, 20, 'minutes', '12:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(8, 1, 'UI Design Sketch', 'Practice layout components', '#ec4899', 'wellness', 'daily', NULL, NULL, 45, 'minutes', '14:00:00', 1, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:00'),
(9, 1, 'Cold Shower', 'Morning alertness boost', '#3b82f6', 'physical', 'daily', NULL, NULL, 5, 'minutes', '06:45:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(10, 1, 'Daily Standup Prep', 'Notes for the team meeting', '#f59e0b', 'social', 'daily', NULL, NULL, 10, 'minutes', '08:45:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:05'),
(11, 1, 'Stretching/Yoga', 'Improve flexibility', '#10b981', 'physical', 'daily', NULL, NULL, 20, 'minutes', '07:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(12, 1, 'Supplement Intake', 'Vitamins and minerals', '#10b981', 'physical', 'daily', NULL, NULL, NULL, 'minutes', '08:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(13, 1, 'Language Learning', 'Practice Yoruba on Duolingo', '#3b82f6', 'productivity', 'daily', NULL, NULL, 15, 'minutes', '13:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:11'),
(14, 1, 'Gratitude Log', 'Write 3 things I am thankful for', '#a855f7', 'mental', 'daily', NULL, NULL, 5, 'minutes', '22:45:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(15, 1, 'Walking', 'Reach 10,000 steps', '#ef4444', 'physical', 'daily', NULL, NULL, 60, 'minutes', NULL, 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(16, 1, 'Workspace Reset', 'Clean and organize desk', '#3b82f6', 'mental', 'daily', NULL, NULL, 5, 'minutes', '18:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(17, 1, 'Expense Tracking', 'Log all spending for today', '#3b82f6', 'social', 'daily', NULL, NULL, 10, 'minutes', '21:30:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:17'),
(18, 1, 'No Processed Sugar', 'Strict diet adherence', '#10b981', 'physical', 'daily', NULL, NULL, NULL, 'minutes', NULL, 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(19, 1, 'Project Writing', 'Contribute to README/Docs', '#ec4899', 'mental', 'daily', NULL, NULL, 30, 'minutes', '10:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:31'),
(20, 1, 'Box Breathing', 'Manage stress levels', '#a855f7', 'mental', 'daily', NULL, NULL, 5, 'minutes', '15:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(21, 1, 'Tech Podcast', 'Stay updated with industry', '#3b82f6', 'educational', 'daily', NULL, NULL, 40, 'minutes', '08:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:23'),
(22, 1, 'Core Workout', '15 mins of planks and crunches', '#ef4444', 'physical', 'daily', NULL, NULL, 15, 'minutes', '17:45:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(23, 1, 'Nightly Skincare', 'Face wash and moisturize', '#10b981', 'physical', 'daily', NULL, NULL, 10, 'minutes', '23:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(24, 1, 'Early Sleep', 'Lights out by 11:00 PM', '#f59e0b', 'physical', 'daily', NULL, NULL, 8, 'hours', '23:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(25, 1, 'Early Wakeup', 'Out of bed by 6:00 AM', '#f59e0b', 'mental', 'daily', NULL, NULL, NULL, 'minutes', '06:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(26, 1, 'Goal Review', 'Check weekly objectives', '#a855f7', 'mental', 'daily', NULL, NULL, 15, 'minutes', '09:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(27, 1, 'Email Cleanup', 'Achieve Inbox Zero', '#3b82f6', 'mental', 'daily', NULL, NULL, 20, 'minutes', '16:30:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:37'),
(28, 1, 'Family Call', 'Check in with parents', '#f59e0b', 'social', 'daily', NULL, NULL, 15, 'minutes', '19:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-30 23:48:15'),
(29, 1, 'Macro Photography', 'Take one high-quality shot', '#ec4899', 'physical', 'daily', NULL, NULL, 20, 'minutes', '13:00:00', 1, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:41'),
(30, 1, 'Code Refactoring', 'Clean up one old function', '#3b82f6', 'spiritual', 'daily', NULL, NULL, 45, 'minutes', '11:00:00', 0, NULL, NULL, 1, NULL, '2025-12-30 23:48:15', '2025-12-31 15:02:51'),
(31, 1, 'No Name', 'No Description', '#001338', 'mental', 'daily', NULL, NULL, 10, 'minutes', '17:56:00', 0, NULL, NULL, 1, NULL, '2025-12-31 01:56:28', '2025-12-31 01:56:28'),
(32, 5, 'My First Habit', 'This Is My First Habit', '#ffffff', 'mental', 'daily', NULL, NULL, 1, 'minutes', '00:00:00', 0, NULL, NULL, 1, NULL, '2025-12-31 02:05:17', '2025-12-31 02:05:17'),
(33, 1, 'Habits', 'Habits', '#ff7a7a', 'wellness', 'daily', NULL, NULL, 0, 'minutes', '00:00:00', 0, NULL, NULL, 1, NULL, '2025-12-31 07:59:12', '2025-12-31 15:03:11'),
(34, 5, 'Subhi', 'Morning Prayer', '#f10000', 'physical', 'daily', NULL, NULL, 0, 'minutes', '05:20:00', 0, NULL, NULL, 1, NULL, '2025-12-31 13:49:13', '2025-12-31 13:49:13'),
(35, 5, 'Zuhr', 'Mid Noon Prayer', '#f4437b', 'physical', 'daily', NULL, NULL, 0, 'minutes', '13:00:00', 0, NULL, NULL, 1, NULL, '2025-12-31 13:50:03', '2025-12-31 13:50:03'),
(36, 5, 'Morning Workout', 'Early Morning Workout', '#5a8437', 'physical', 'daily', NULL, NULL, 0, 'minutes', '00:00:00', 0, NULL, NULL, 1, NULL, '2025-12-31 14:32:14', '2025-12-31 15:03:15'),
(37, 5, 'Evening Workout', 'Late Evening Workout', '#070f45', 'educational', 'custom-days', NULL, NULL, 5, 'minutes', '18:00:00', 0, NULL, NULL, 1, NULL, '2025-12-31 14:35:07', '2025-12-31 15:03:19'),
(38, 1, 'Morning Meditation', 'Meditation in the morning', '#c33bd8', 'educational', 'custom-days', '[\"1\",\"3\",\"5\"]', 3, NULL, 'minutes', '06:00:00', 0, '2025-12-31', NULL, 1, NULL, '2025-12-31 14:54:50', '2025-12-31 15:40:03'),
(39, 7, 'Subhi', 'Morning Prayer', '#0000ff', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '05:20:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 08:38:20', '2026-01-01 08:38:20'),
(40, 7, 'Morning Workout', 'Early morning workout around 9', '#2e2e2e', 'physical', 'daily', '[]', 3, 30, 'minutes', '09:00:00', 0, '2026-01-01', '2026-01-31', 1, NULL, '2026-01-01 09:04:45', '2026-01-04 20:22:30'),
(41, 7, 'Zuhr', 'Early Afternoon Prayer', '#04da7e', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '13:00:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 21:09:22', '2026-01-09 02:03:42'),
(42, 7, 'Asr', 'Late Afternoon Prayer', '#f7ec6a', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '16:00:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 21:09:57', '2026-01-09 02:03:48'),
(43, 7, 'Evening Workout', '', '#7b6cdf', 'wellness', 'daily', '[]', 3, 0, 'minutes', '17:30:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 21:10:55', '2026-01-01 21:10:55'),
(44, 7, 'Magrib', 'Evening Prayer', '#f37862', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '18:30:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 21:12:02', '2026-01-01 21:12:02'),
(45, 7, 'Isha', 'Early Night Prayer', '#72282e', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '19:30:00', 0, '2026-01-01', NULL, 1, NULL, '2026-01-01 21:12:43', '2026-01-01 21:12:43'),
(46, 7, 'Morning Recitation', 'I gotta read Qur\'an every morning', '#f22295', 'spiritual', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 04:37:16', '2026-01-02 04:37:16'),
(47, 17, 'Subhi', 'Pray the morning prayer', '#000042', 'spiritual', 'daily', '[]', 3, 5, 'minutes', '05:20:00', 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:48:22', '2026-01-02 13:48:22'),
(48, 17, 'Morning Duas', 'To perform askars', '#000042', 'spiritual', 'daily', '[]', 3, 10, 'minutes', '05:25:00', 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:49:50', '2026-01-02 13:49:50'),
(49, 17, 'Exercise', '', '#22d3ee', '', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:50:33', '2026-01-02 13:50:33'),
(50, 17, 'Evening Workout', '', '#b5aa48', 'physical', 'daily', '[]', 3, 30, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:51:48', '2026-01-02 13:51:48'),
(51, 17, 'EveningB', '', '#6e7998', '', 'daily', '[]', 3, 10, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:52:26', '2026-01-02 13:52:26'),
(52, 17, 'Zuhr', '', '#899844', '', 'daily', '[]', 3, 5, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:53:09', '2026-01-02 13:53:09'),
(53, 17, 'Asr', '', '#22d3ee', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '04:00:00', 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:54:01', '2026-01-02 13:54:01'),
(54, 17, 'Maghrib', '', '#eb6f83', 'spiritual', 'daily', '[]', 3, 0, 'minutes', '06:40:00', 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:54:57', '2026-01-02 13:54:57'),
(55, 17, 'Isha', '', '#92ffed', '', 'daily', '[]', 3, 0, 'minutes', '07:30:00', 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:55:31', '2026-01-02 13:55:31'),
(56, 17, 'Math', '', '#22d3ee', '', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:55:43', '2026-01-02 13:55:43'),
(57, 17, 'Computer', '', '#22d3ee', '', 'custom-days', '[\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"0\"]', 3, 30, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:57:18', '2026-01-02 13:57:18'),
(58, 17, 'Civic', '', '#22d3ee', '', 'per-week', '[]', 5, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 13:58:20', '2026-01-02 13:58:20'),
(59, 17, 'Read', '', '#b4a79a', 'social', 'daily', '[]', 3, 1, 'hours', NULL, 1, '2026-01-01', '2026-12-31', 1, NULL, '2026-01-02 14:01:19', '2026-01-02 14:01:19'),
(60, 17, 'Business studies', '', '#22d3ee', '', 'per-week', '[]', 4, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:02:40', '2026-01-02 14:02:40'),
(61, 17, 'Read qu\'ran', '', '#22d3ee', '', 'daily', '[]', 3, 30, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:05:55', '2026-01-02 14:05:55'),
(62, 17, 'Coding', '', '#22d3ee', '', 'daily', '[]', 3, 30, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:06:11', '2026-01-02 14:06:11'),
(63, 17, 'Twist of fate', '', '#22d3ee', '', 'daily', '[]', 3, 1, 'hours', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:06:52', '2026-01-02 14:06:52'),
(64, 17, 'Kings of hearts', '', '#22d3ee', '', 'daily', '[]', 3, 1, 'hours', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:07:16', '2026-01-02 14:07:16'),
(65, 17, 'Meditate', '', '#22d3ee', '', 'daily', '[]', 3, 20, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:07:36', '2026-01-02 14:07:36'),
(66, 17, 'Sleep', '', '#07741a', '', 'daily', '[]', 3, 7, 'hours', NULL, 1, '2026-01-02', NULL, 1, NULL, '2026-01-02 14:08:39', '2026-01-02 14:08:39'),
(67, 7, 'Fable Check In', 'I just have to check in my daily readings on Fable', '#000875', 'productivity', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-02', NULL, 1, NULL, '2026-01-02 22:56:45', '2026-01-04 19:06:33'),
(68, 17, 'Morning Bath', '', '#61444e', '', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-03', NULL, 1, NULL, '2026-01-03 05:21:44', '2026-01-03 05:21:44'),
(69, 7, 'Hisnul Muslim', 'My Daily Does of Azkar', '#c50042', 'spiritual', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-03', NULL, 1, NULL, '2026-01-03 09:04:07', '2026-01-03 09:04:07'),
(70, 17, 'Afternoon Bath', '', '#77808b', 'physical', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-03', NULL, 1, NULL, '2026-01-03 13:26:31', '2026-01-03 13:26:31'),
(71, 7, 'Learn Spanish', 'My Daily Dose Of Spanish Tutorial', '#ffea00', 'educational', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-03', NULL, 1, NULL, '2026-01-03 13:32:33', '2026-01-03 13:32:33'),
(72, 17, 'Total Hours', 'To calculate al, total percent of habits done', '#80f1d7', '', 'daily', '[]', 3, 0, 'hours', NULL, 0, '2026-01-05', NULL, 1, NULL, '2026-01-05 05:48:41', '2026-01-05 05:48:41'),
(73, 19, 'Subhi', 'pray morning salat', '#25750e', 'spiritual', 'daily', '[]', 3, 5, 'minutes', '05:20:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:28:05', '2026-01-09 05:28:05'),
(74, 19, 'Bath', 'Taking a bath in the morning', '#6036e7', 'physical', 'daily', '[]', 3, 10, 'minutes', '05:30:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:29:13', '2026-01-09 05:29:13'),
(75, 19, 'Morning workout', 'Doing workout and stretches in the morning', '#f76b52', 'physical', 'daily', '[]', 3, 10, 'minutes', '05:40:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:30:48', '2026-01-09 05:30:48'),
(76, 19, 'Meditate', 'To breath in and out deeply', '#040291', 'mental', 'daily', '[]', 3, 5, 'minutes', '05:50:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:32:00', '2026-01-09 05:32:00'),
(77, 19, 'Zuhr', 'praying salat in the afternoon', '#525884', 'spiritual', 'daily', '[]', 3, 5, 'minutes', '13:00:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:33:28', '2026-01-09 05:33:28'),
(78, 19, 'Morning Reciatation', 'reciting Qur\'an in the morning', '#0beca8', 'spiritual', 'daily', '[]', 3, 20, 'minutes', NULL, 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:34:42', '2026-01-09 05:34:42'),
(79, 19, 'Afternoon Bath', 'Taking bath in the afternoon', '#87e6b5', 'physical', 'daily', '[]', 3, 10, 'minutes', '00:30:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 05:35:55', '2026-01-09 05:35:55'),
(80, 19, 'Asr', 'pray salat in the afternoon', '#142c95', 'spiritual', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 06:16:18', '2026-01-09 06:16:18'),
(81, 19, 'Magrib', 'Praying in the evening', '#4a8db6', 'spiritual', 'daily', '[]', 3, 5, 'minutes', '18:40:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 06:18:44', '2026-01-09 06:18:44'),
(82, 19, 'Isha', 'praying in the evening', '#570229', 'spiritual', 'daily', '[]', 3, 5, 'minutes', '19:40:00', 0, '2026-01-09', NULL, 1, NULL, '2026-01-09 06:19:31', '2026-01-09 06:19:31'),
(83, 7, 'Tajweed', 'Road To Qur\'an mastery', '#1564fd', 'educational', 'daily', '[]', 3, 0, 'minutes', NULL, 0, '2026-01-19', '2026-01-19', 1, NULL, '2026-01-17 23:56:43', '2026-01-18 22:26:53');

-- --------------------------------------------------------

--
-- Table structure for table `habit_checkins`
--

CREATE TABLE `habit_checkins` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `habit_id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `completed` tinyint(1) DEFAULT 1,
  `difficulty` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1=Easy, 2=Medium, 3=Hard',
  `mood` enum('terrible','bad','okay','good','great') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `actual_duration` int(10) UNSIGNED DEFAULT NULL COMMENT 'Actual time spent in minutes',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `checkin_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `habit_checkins`
--

INSERT INTO `habit_checkins` (`id`, `user_id`, `habit_id`, `date`, `completed`, `difficulty`, `mood`, `notes`, `actual_duration`, `created_at`, `updated_at`, `checkin_time`) VALUES
(1, 1, 1, '2025-12-29', 1, 2, 'good', 'Great morning session!', NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(2, 1, 4, '2025-12-29', 1, 1, 'great', 'Felt very peaceful', NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(3, 1, 1, '2025-12-28', 1, 2, 'okay', 'Felt tired but pushed through', NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(4, 1, 3, '2025-12-28', 1, 1, 'good', 'Read an interesting article', NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(5, 1, 4, '2025-12-28', 1, 1, 'good', NULL, NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(6, 1, 1, '2025-12-27', 0, 1, 'great', NULL, NULL, '2025-12-29 08:57:24', '2025-12-30 09:55:23', NULL),
(7, 1, 3, '2025-12-27', 1, 2, 'good', NULL, NULL, '2025-12-29 08:57:24', '2025-12-29 08:57:24', NULL),
(9, 1, 1, '2025-12-01', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:02', '2025-12-30 23:38:02', NULL),
(10, 1, 2, '2025-12-03', 0, NULL, NULL, NULL, NULL, '2025-12-30 23:38:05', '2025-12-30 23:49:02', NULL),
(11, 1, 3, '2025-12-04', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:06', '2025-12-30 23:38:06', NULL),
(12, 1, 2, '2025-12-27', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:09', '2025-12-30 23:38:09', NULL),
(13, 1, 5, '2025-12-31', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:11', '2025-12-30 23:38:11', NULL),
(14, 1, 1, '2025-12-31', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:13', '2025-12-30 23:38:13', NULL),
(15, 1, 2, '2025-12-01', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:17', '2025-12-30 23:38:17', NULL),
(16, 1, 1, '2025-12-05', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:38:21', '2025-12-30 23:38:21', NULL),
(17, 1, 1, '2025-12-10', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:48:59', '2025-12-30 23:48:59', NULL),
(18, 1, 1, '2025-12-02', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:01', '2025-12-30 23:49:05', NULL),
(22, 1, 4, '2025-12-07', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:07', '2025-12-30 23:49:07', NULL),
(23, 1, 5, '2025-12-10', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:07', '2025-12-30 23:49:07', NULL),
(24, 1, 11, '2025-12-06', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:10', '2025-12-30 23:49:10', NULL),
(25, 1, 10, '2025-12-08', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:10', '2025-12-30 23:49:10', NULL),
(26, 1, 7, '2025-12-14', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:12', '2025-12-30 23:49:12', NULL),
(27, 1, 6, '2025-12-07', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:12', '2025-12-30 23:49:12', NULL),
(28, 1, 7, '2025-12-05', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:14', '2025-12-30 23:49:14', NULL),
(29, 1, 11, '2025-12-18', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:17', '2025-12-30 23:49:17', NULL),
(30, 1, 22, '2025-12-11', 1, NULL, NULL, NULL, NULL, '2025-12-30 23:49:22', '2025-12-30 23:49:22', NULL),
(31, 1, 3, '2025-12-14', 1, NULL, NULL, NULL, NULL, '2025-12-31 00:10:27', '2025-12-31 00:10:27', NULL),
(32, 1, 2, '2025-12-13', 1, NULL, NULL, NULL, NULL, '2025-12-31 00:29:00', '2025-12-31 00:29:00', NULL),
(33, 1, 2, '2025-12-16', 1, NULL, NULL, NULL, NULL, '2025-12-31 00:29:02', '2025-12-31 00:29:02', NULL),
(34, 1, 3, '2025-12-17', 1, NULL, NULL, NULL, NULL, '2025-12-31 00:29:05', '2025-12-31 00:29:05', NULL),
(35, 1, 4, '2025-12-18', 1, NULL, NULL, NULL, NULL, '2025-12-31 00:29:07', '2025-12-31 00:29:07', NULL),
(36, 1, 2, '2025-12-20', 1, NULL, NULL, '', NULL, '2025-12-31 00:43:50', '2025-12-31 00:43:50', NULL),
(37, 1, 31, '2025-12-31', 1, 1, 'okay', 'No Thoughts\n', NULL, '2025-12-31 01:57:11', '2025-12-31 01:57:11', NULL),
(38, 1, 9, '2025-12-31', 1, 1, 'okay', 'No Thoughts', NULL, '2025-12-31 07:58:25', '2025-12-31 07:58:25', NULL),
(39, 1, 38, '2025-12-31', 1, 2, 'terrible', 'Nome', NULL, '2025-12-31 14:55:55', '2025-12-31 14:55:55', '15:55:00'),
(40, 1, 6, '2025-12-31', 1, 1, 'bad', 'uojdjI', NULL, '2025-12-31 16:11:03', '2025-12-31 16:11:03', '21:14:00'),
(41, 1, 2, '2025-12-31', 1, 1, 'terrible', 'NIL', NULL, '2025-12-31 21:22:58', '2025-12-31 21:22:58', '22:26:00'),
(42, 1, 7, '2025-12-31', 1, 1, 'terrible', 'NIL', NULL, '2025-12-31 21:24:19', '2025-12-31 21:24:19', '22:24:00'),
(43, 1, 10, '2025-12-31', 1, 1, 'terrible', 'None\n', NULL, '2025-12-31 21:25:27', '2025-12-31 21:25:27', '22:28:00'),
(44, 1, 8, '2025-12-31', 1, 1, 'terrible', 'None Notes', NULL, '2025-12-31 21:33:21', '2025-12-31 21:33:21', '02:01:00'),
(45, 1, 11, '2025-12-31', 1, 1, 'terrible', 'No thoughts', 100, '2025-12-31 21:38:48', '2025-12-31 21:38:48', '02:01:00'),
(46, 1, 4, '2025-12-31', 1, 1, 'okay', '', NULL, '2025-12-31 23:19:19', '2025-12-31 23:19:19', '23:19:19'),
(47, 1, 3, '2025-12-31', 1, 1, 'okay', '', 0, '2025-12-31 23:19:24', '2025-12-31 23:19:24', '00:00:00'),
(48, 7, 39, '2026-01-01', 1, 1, 'great', 'Woke up late. I\'ll try to be early next time', NULL, '2026-01-01 08:39:40', '2026-01-01 08:39:40', '08:00:00'),
(49, 7, 40, '2026-01-01', 1, 2, 'okay', 'Exhausting but I feel good', 30, '2026-01-01 21:14:04', '2026-01-01 21:14:04', '21:00:00'),
(50, 7, 43, '2026-01-01', 1, 2, 'okay', 'Tiring but Great', NULL, '2026-01-01 21:14:44', '2026-01-01 21:14:44', '20:30:00'),
(51, 7, 41, '2026-01-01', 1, 2, 'bad', 'I prayed at the wrong time today. I\'ll never do it again', NULL, '2026-01-01 21:52:02', '2026-01-01 21:52:02', '22:26:00'),
(52, 7, 42, '2026-01-01', 1, 3, 'bad', 'I didn\'t do well today\n', NULL, '2026-01-01 21:52:47', '2026-01-01 21:52:47', '22:28:00'),
(53, 7, 44, '2026-01-01', 1, 3, 'okay', 'Bad Day!', NULL, '2026-01-01 21:53:11', '2026-01-01 21:53:11', '22:30:00'),
(54, 7, 45, '2026-01-01', 1, 3, 'terrible', 'I prayed at the wrong time the whole day. I promise to do better', NULL, '2026-01-01 21:53:50', '2026-01-01 21:53:50', '22:32:00'),
(55, 7, 39, '2026-01-02', 1, 1, 'great', 'At the right time\n', NULL, '2026-01-02 04:36:14', '2026-01-02 04:36:14', '05:30:00'),
(56, 7, 40, '2026-01-02', 1, 1, 'great', 'Perfect, but I didn\'t do much workout', 10, '2026-01-02 08:38:21', '2026-01-02 08:38:21', '08:00:00'),
(57, 7, 41, '2026-01-02', 1, 1, 'great', 'Great', NULL, '2026-01-02 13:30:50', '2026-01-02 13:30:50', '14:20:00'),
(58, 17, 47, '2026-01-02', 1, 1, 'okay', '', 0, '2026-01-02 17:00:03', '2026-01-02 17:00:03', '00:00:00'),
(60, 17, 50, '2026-01-02', 1, 1, 'okay', '', 0, '2026-01-02 17:29:09', '2026-01-02 17:29:09', '17:29:09'),
(61, 7, 42, '2026-01-02', 1, 1, 'great', '', NULL, '2026-01-02 17:59:57', '2026-01-02 17:59:57', '18:58:00'),
(62, 7, 44, '2026-01-02', 1, 1, 'great', '', NULL, '2026-01-02 18:00:19', '2026-01-02 18:00:19', '19:00:00'),
(63, 7, 45, '2026-01-02', 1, 1, 'good', 'Cool', NULL, '2026-01-02 20:31:17', '2026-01-02 20:31:17', '21:25:00'),
(64, 7, 43, '2026-01-02', 1, 2, 'okay', 'Not the best but at least I didn\'t miss it\n', NULL, '2026-01-02 20:40:18', '2026-01-02 20:40:18', '19:30:00'),
(65, 7, 67, '2026-01-02', 1, 1, 'great', 'I read a reasonable amount today', NULL, '2026-01-02 22:57:12', '2026-01-02 22:57:12', '22:57:12'),
(66, 7, 46, '2026-01-02', 1, 3, 'terrible', 'I was unable to stick to my routine. I\'ll try better tomorrow.\n', NULL, '2026-01-02 22:57:47', '2026-01-02 22:57:47', '22:57:47'),
(67, 17, 59, '2026-01-03', 1, 1, 'okay', '', 0, '2026-01-03 05:20:17', '2026-01-03 05:20:17', '05:20:17'),
(68, 17, 47, '2026-01-03', 1, 1, 'okay', '', 0, '2026-01-03 05:20:59', '2026-01-03 05:20:59', '00:00:00'),
(69, 17, 48, '2026-01-03', 1, 1, 'okay', '', 0, '2026-01-03 05:21:13', '2026-01-03 05:21:13', '00:00:00'),
(70, 17, 49, '2026-01-03', 1, 1, 'okay', '', NULL, '2026-01-03 05:21:17', '2026-01-03 05:21:17', '05:21:17'),
(71, 17, 68, '2026-01-03', 1, 1, 'okay', '', NULL, '2026-01-03 05:21:59', '2026-01-03 05:21:59', '05:21:59'),
(72, 7, 39, '2026-01-03', 1, 1, 'terrible', 'I woke up late', NULL, '2026-01-03 06:48:51', '2026-01-03 06:48:51', '07:30:00'),
(73, 7, 40, '2026-01-03', 1, 1, 'okay', 'Not Bad', 5, '2026-01-03 09:03:39', '2026-01-03 09:03:39', '10:00:00'),
(74, 7, 69, '2026-01-03', 1, 1, 'great', 'Nice', NULL, '2026-01-03 13:08:31', '2026-01-03 13:08:31', '13:08:31'),
(75, 17, 66, '2026-01-02', 1, 1, 'okay', '', 9, '2026-01-02 13:21:37', '2026-01-02 13:21:37', '13:21:37'),
(76, 17, 64, '2026-01-02', 1, 1, 'good', 'Interesting', 1, '2026-01-02 13:22:32', '2026-01-02 13:22:32', '13:22:32'),
(77, 17, 62, '2026-01-02', 1, 2, 'okay', '', 40, '2026-01-02 13:22:53', '2026-01-02 13:22:53', '13:22:53'),
(78, 17, 59, '2026-01-02', 1, 3, 'great', 'Helped me finish Atomic Habits', 0, '2026-01-02 13:24:23', '2026-01-02 13:24:23', '13:24:23'),
(79, 17, 49, '2026-01-02', 1, 3, 'okay', '', NULL, '2026-01-02 13:24:48', '2026-01-02 13:24:48', '13:24:48'),
(80, 17, 52, '2026-01-03', 1, 2, 'okay', '', 5, '2026-01-03 13:25:47', '2026-01-03 13:25:47', '13:25:47'),
(81, 17, 70, '2026-01-03', 1, 1, 'okay', '', NULL, '2026-01-03 13:26:42', '2026-01-03 13:26:42', '13:26:42'),
(82, 7, 41, '2026-01-03', 1, 1, 'great', 'Not the right time but it\'s still cool though\n', NULL, '2026-01-03 13:31:21', '2026-01-03 13:31:21', '14:25:00'),
(83, 17, 65, '2026-01-03', 1, 2, 'okay', '', 0, '2026-01-03 18:29:16', '2026-01-03 18:29:16', '18:29:16'),
(84, 17, 63, '2026-01-02', 1, 1, 'great', '', 1, '2026-01-02 18:31:01', '2026-01-02 18:31:01', '18:31:01'),
(85, 17, 62, '2026-01-03', 1, 2, 'okay', 'I did very small', 10, '2026-01-03 18:32:45', '2026-01-03 18:32:45', '18:32:45'),
(86, 17, 50, '2026-01-03', 1, 2, 'good', '', 15, '2026-01-03 18:33:19', '2026-01-03 18:33:19', '18:33:19'),
(87, 17, 51, '2026-01-03', 1, 1, 'okay', '', 5, '2026-01-03 18:33:32', '2026-01-03 18:33:32', '18:33:32'),
(88, 17, 53, '2026-01-03', 1, 2, 'okay', '', NULL, '2026-01-03 18:35:06', '2026-01-03 18:35:06', '00:00:00'),
(89, 17, 54, '2026-01-03', 1, 2, 'okay', '', NULL, '2026-01-03 18:35:20', '2026-01-03 18:35:20', '00:00:00'),
(90, 17, 61, '2026-01-03', 1, 2, 'okay', '', 1, '2026-01-03 18:36:15', '2026-01-03 18:36:41', '18:36:41'),
(93, 17, 55, '2026-01-03', 1, 1, 'okay', '', NULL, '2026-01-03 18:43:43', '2026-01-03 18:43:43', '00:00:00'),
(94, 17, 56, '2026-01-03', 1, 1, 'okay', '', NULL, '2026-01-03 18:45:55', '2026-01-03 18:45:55', '18:45:55'),
(95, 7, 42, '2026-01-03', 1, 1, 'bad', 'I slept off so I couldn\'t pray at the right time\n', NULL, '2026-01-03 19:01:04', '2026-01-03 19:01:04', '19:40:00'),
(96, 7, 44, '2026-01-03', 1, 1, 'okay', 'I slept off and woke up late', NULL, '2026-01-03 19:03:19', '2026-01-03 19:03:19', '19:02:00'),
(97, 7, 46, '2026-01-03', 1, 1, 'bad', 'I read at Islamiya', NULL, '2026-01-03 19:03:55', '2026-01-03 19:03:55', '19:03:55'),
(98, 7, 45, '2026-01-03', 1, 1, 'great', 'I prayed somewhere around the right time\n', NULL, '2026-01-03 19:04:28', '2026-01-03 19:04:28', '19:47:00'),
(99, 7, 71, '2026-01-03', 1, 1, 'great', 'I learnt Pronouns in Spanish', NULL, '2026-01-03 20:16:06', '2026-01-03 20:16:06', '20:16:06'),
(100, 7, 67, '2026-01-03', 1, 1, 'great', 'I didn\'t read as much as expected but I\'m gonna finish the book tomorrow', NULL, '2026-01-03 22:50:14', '2026-01-03 22:50:14', '22:50:14'),
(101, 7, 43, '2026-01-03', 1, 1, 'terrible', 'Just some simple leg workouts\n', NULL, '2026-01-03 22:50:40', '2026-01-03 22:50:40', '23:40:00'),
(102, 7, 39, '2026-01-04', 1, 1, 'terrible', 'Very Late', NULL, '2026-01-04 07:37:12', '2026-01-04 07:37:12', '08:00:00'),
(103, 7, 40, '2026-01-04', 1, 1, 'good', 'Just Chest Workout', 20, '2026-01-04 07:38:04', '2026-01-04 07:38:04', '07:20:00'),
(104, 7, 69, '2026-01-04', 1, 1, 'great', 'Very Great, Leant the fourth part of Azkar when you wake up with Translation', NULL, '2026-01-04 07:38:53', '2026-01-04 07:38:53', '07:38:53'),
(105, 7, 71, '2026-01-04', 1, 1, 'great', 'I learnt about verbs', NULL, '2026-01-04 18:42:21', '2026-01-04 18:42:21', '18:42:21'),
(106, 7, 43, '2026-01-04', 1, 1, 'okay', 'Subtle workout but I felt the impact', NULL, '2026-01-04 22:25:07', '2026-01-04 22:25:07', '23:10:00'),
(107, 7, 46, '2026-01-04', 1, 1, 'great', 'Went To Islmaiya and I read there', NULL, '2026-01-04 22:25:24', '2026-01-04 22:25:24', '22:25:24'),
(108, 7, 67, '2026-01-04', 1, 1, 'great', 'I finished reading my first book of the year today. Its No More Mr Nice Guy by Robert A Glover', NULL, '2026-01-04 22:46:02', '2026-01-04 22:46:02', '22:46:02'),
(109, 7, 41, '2026-01-04', 1, 1, 'terrible', 'My routine was messed up today', NULL, '2026-01-04 22:46:28', '2026-01-04 22:46:28', '23:50:00'),
(110, 7, 42, '2026-01-04', 1, 1, 'terrible', 'Messed up routine today', NULL, '2026-01-04 22:46:51', '2026-01-04 22:46:51', '23:52:00'),
(111, 7, 44, '2026-01-04', 1, 1, 'terrible', 'Messed Up Routine Today', NULL, '2026-01-04 22:47:09', '2026-01-04 22:47:09', '23:54:00'),
(112, 7, 45, '2026-01-04', 1, 1, 'terrible', 'Today, my routine wasn\'t on tract at all', NULL, '2026-01-04 22:47:40', '2026-01-04 22:47:40', '23:50:00'),
(113, 17, 50, '2026-01-04', 1, 1, 'okay', '', 20, '2026-01-04 05:38:46', '2026-01-04 05:38:46', '05:38:46'),
(114, 17, 51, '2026-01-04', 1, 1, 'okay', '', 0, '2026-01-04 05:38:52', '2026-01-04 05:38:52', '05:38:52'),
(115, 17, 54, '2026-01-04', 1, 1, 'okay', '', NULL, '2026-01-04 05:39:01', '2026-01-04 05:39:01', '00:00:00'),
(116, 17, 53, '2026-01-04', 1, 1, 'okay', '', NULL, '2026-01-04 05:39:07', '2026-01-04 05:39:07', '00:00:00'),
(117, 17, 55, '2026-01-04', 1, 1, 'okay', '', NULL, '2026-01-04 05:39:22', '2026-01-04 05:39:22', '00:00:00'),
(118, 17, 56, '2026-01-04', 1, 1, 'okay', '', NULL, '2026-01-04 05:39:28', '2026-01-04 05:39:28', '05:39:28'),
(119, 17, 61, '2026-01-04', 1, 1, 'okay', '', 0, '2026-01-04 05:39:40', '2026-01-04 05:39:40', '05:39:40'),
(120, 17, 62, '2026-01-04', 1, 2, 'okay', '', 0, '2026-01-04 05:39:49', '2026-01-04 05:39:49', '05:39:49'),
(121, 17, 64, '2026-01-04', 1, 1, 'okay', '', 0, '2026-01-04 05:39:59', '2026-01-04 05:39:59', '05:39:59'),
(122, 17, 65, '2026-01-04', 1, 1, 'okay', '', 0, '2026-01-04 05:40:06', '2026-01-04 05:40:06', '05:40:06'),
(123, 17, 66, '2026-01-04', 1, 1, 'okay', '', 0, '2026-01-04 05:40:11', '2026-01-04 05:40:11', '05:40:11'),
(124, 17, 47, '2026-01-05', 1, 1, 'okay', '', 0, '2026-01-05 05:41:01', '2026-01-05 05:41:01', '00:00:00'),
(125, 17, 48, '2026-01-05', 1, 1, 'okay', '', 0, '2026-01-05 05:41:04', '2026-01-05 05:41:04', '00:00:00'),
(126, 17, 49, '2026-01-05', 1, 1, 'okay', '', NULL, '2026-01-05 05:41:07', '2026-01-05 05:41:07', '05:41:07'),
(127, 17, 68, '2026-01-05', 1, 1, 'okay', '', NULL, '2026-01-05 05:41:22', '2026-01-05 05:41:22', '05:41:22'),
(128, 17, 66, '2026-01-03', 1, 1, 'okay', '', 0, '2026-01-03 05:44:12', '2026-01-03 05:44:12', '05:44:12'),
(129, 17, 56, '2026-01-05', 1, 1, 'okay', '', NULL, '2026-01-05 05:47:04', '2026-01-05 05:47:04', '05:47:04'),
(130, 7, 39, '2026-01-05', 1, 1, 'great', '', NULL, '2026-01-05 09:11:00', '2026-01-05 09:11:00', '06:05:00'),
(131, 7, 71, '2026-01-06', 1, 1, 'great', 'I still spent my day studying verbs', NULL, '2026-01-07 19:10:27', '2026-01-07 19:10:27', '19:10:27'),
(132, 7, 69, '2026-01-06', 1, 1, 'great', 'Completed Azkar for when you wake up in the morning', NULL, '2026-01-06 19:11:36', '2026-01-06 19:11:36', '19:11:36'),
(133, 7, 67, '2026-01-06', 1, 1, 'great', 'Started reading my first book of the year. It is titled \'Grit\'', NULL, '2026-01-06 19:12:04', '2026-01-06 19:12:04', '19:12:04'),
(134, 7, 45, '2026-01-06', 1, 1, 'terrible', 'My BaD!', NULL, '2026-01-06 19:12:34', '2026-01-06 19:12:34', '23:48:00'),
(135, 7, 40, '2026-01-06', 1, 1, 'great', 'Just some push ups', 5, '2026-01-06 19:13:06', '2026-01-06 19:13:06', '10:12:00'),
(136, 7, 39, '2026-01-06', 1, 1, 'great', '', NULL, '2026-01-06 19:13:24', '2026-01-06 19:13:24', '06:30:00'),
(137, 7, 41, '2026-01-06', 1, 1, 'great', '', NULL, '2026-01-06 19:13:40', '2026-01-06 19:13:40', '14:15:00'),
(138, 7, 42, '2026-01-06', 1, 1, 'terrible', '', NULL, '2026-01-06 19:13:59', '2026-01-06 19:13:59', '23:40:00'),
(139, 7, 44, '2026-01-06', 1, 1, 'terrible', '', NULL, '2026-01-06 19:14:20', '2026-01-06 19:14:20', '23:45:00'),
(140, 7, 39, '2026-01-07', 1, 1, 'bad', '', NULL, '2026-01-07 07:07:01', '2026-01-07 07:07:01', '07:30:00'),
(141, 7, 41, '2026-01-07', 1, 1, 'bad', '', NULL, '2026-01-07 18:39:37', '2026-01-07 18:39:37', '19:26:00'),
(142, 7, 42, '2026-01-07', 1, 1, 'bad', '', NULL, '2026-01-07 18:39:52', '2026-01-07 18:39:52', '19:28:00'),
(143, 7, 71, '2026-01-07', 1, 1, 'bad', 'Still learning verbs', NULL, '2026-01-07 18:40:01', '2026-01-07 18:40:01', '18:40:01'),
(144, 7, 44, '2026-01-07', 1, 1, 'bad', '', NULL, '2026-01-07 18:41:32', '2026-01-07 18:41:32', '19:30:00'),
(145, 7, 45, '2026-01-07', 1, 1, 'bad', '', NULL, '2026-01-07 18:41:44', '2026-01-07 18:41:44', '19:33:00'),
(146, 7, 43, '2026-01-07', 1, 1, 'good', 'Chest and Arm Workout', NULL, '2026-01-07 18:42:34', '2026-01-07 18:42:34', '19:00:00'),
(147, 7, 69, '2026-01-07', 1, 1, 'okay', '', NULL, '2026-01-07 20:31:28', '2026-01-07 20:31:28', '20:31:28'),
(148, 7, 71, '2026-01-08', 1, 1, 'great', 'Still on verb Part 2/4', NULL, '2026-01-08 19:56:57', '2026-01-08 19:56:57', '19:56:57'),
(149, 7, 69, '2026-01-08', 1, 1, 'great', 'Completed Azkar for when you wake up from sleep', NULL, '2026-01-08 19:57:20', '2026-01-08 19:57:20', '19:57:20'),
(150, 7, 67, '2026-01-08', 1, 1, 'great', 'Still reading my second book of the year \"Grit\"', NULL, '2026-01-08 19:57:49', '2026-01-08 19:57:49', '19:57:49'),
(151, 7, 39, '2026-01-08', 1, 1, 'great', '', NULL, '2026-01-08 19:58:08', '2026-01-08 19:58:08', '06:10:00'),
(152, 7, 41, '2026-01-08', 1, 1, 'great', '', NULL, '2026-01-08 19:58:27', '2026-01-08 19:58:27', '16:10:00'),
(153, 7, 42, '2026-01-08', 1, 1, 'great', '', NULL, '2026-01-08 19:58:39', '2026-01-08 19:58:39', '16:12:00'),
(154, 7, 44, '2026-01-08', 1, 1, 'great', '', NULL, '2026-01-08 19:58:52', '2026-01-08 19:58:52', '20:47:00'),
(155, 7, 45, '2026-01-08', 1, 1, 'great', '', NULL, '2026-01-08 19:59:04', '2026-01-08 19:59:04', '20:51:00'),
(156, 19, 74, '2026-01-09', 1, 1, 'okay', '', 0, '2026-01-09 06:17:09', '2026-01-09 06:17:09', '00:00:00'),
(157, 19, 75, '2026-01-09', 1, 1, 'okay', '', 0, '2026-01-09 06:19:44', '2026-01-09 06:19:44', '00:00:00'),
(158, 7, 39, '2026-01-09', 1, 1, 'terrible', '', NULL, '2026-01-09 11:43:50', '2026-01-09 11:43:50', '07:30:00'),
(159, 7, 71, '2026-01-09', 1, 1, 'great', 'Sill on Verb Part 3/4', NULL, '2026-01-09 11:44:35', '2026-01-09 11:44:35', '11:44:35'),
(160, 7, 40, '2026-01-09', 1, 1, 'good', 'Did some Chest, Arm and Leg workout', 20, '2026-01-09 20:06:11', '2026-01-09 20:06:11', '13:10:00'),
(161, 7, 41, '2026-01-09', 1, 1, 'great', 'It\'s friday. Jum\'ah', NULL, '2026-01-09 20:06:50', '2026-01-09 20:06:50', '14:20:00'),
(162, 7, 42, '2026-01-09', 1, 1, 'bad', '', NULL, '2026-01-09 20:07:11', '2026-01-09 20:07:11', '20:55:00'),
(163, 7, 44, '2026-01-09', 1, 1, 'bad', '', NULL, '2026-01-09 20:07:37', '2026-01-09 20:07:37', '20:58:00'),
(164, 7, 45, '2026-01-09', 1, 1, 'bad', '', NULL, '2026-01-09 20:07:49', '2026-01-09 20:07:49', '21:01:00'),
(165, 7, 69, '2026-01-09', 1, 1, 'good', '', NULL, '2026-01-09 20:23:16', '2026-01-09 20:23:16', '20:23:16'),
(166, 7, 46, '2026-01-09', 1, 1, 'okay', '', NULL, '2026-01-09 20:35:33', '2026-01-09 20:35:33', '20:35:33'),
(167, 7, 67, '2026-01-09', 1, 1, 'great', '', NULL, '2026-01-09 21:30:32', '2026-01-09 21:30:32', '21:30:32'),
(168, 7, 39, '2026-01-10', 1, 1, 'great', '', NULL, '2026-01-10 09:45:37', '2026-01-10 09:45:37', '07:10:00'),
(169, 7, 41, '2026-01-10', 1, 1, 'great', '', NULL, '2026-01-10 12:39:37', '2026-01-10 12:39:37', '13:30:00'),
(170, 7, 42, '2026-01-10', 1, 1, 'okay', '', NULL, '2026-01-10 19:18:04', '2026-01-10 19:18:04', '19:55:00'),
(171, 7, 44, '2026-01-10', 1, 1, 'good', '', NULL, '2026-01-10 19:18:21', '2026-01-10 19:18:21', '20:10:00'),
(172, 7, 45, '2026-01-10', 1, 1, 'okay', '', NULL, '2026-01-10 19:18:49', '2026-01-10 19:18:49', '20:13:00'),
(173, 7, 46, '2026-01-10', 1, 1, 'great', '', NULL, '2026-01-10 19:18:58', '2026-01-10 19:18:58', '19:18:58'),
(174, 7, 71, '2026-01-10', 1, 1, 'great', 'I skipped part 4/4 of Verb and took part 1/4 on adjective', NULL, '2026-01-10 19:19:43', '2026-01-10 19:19:43', '19:19:43'),
(175, 7, 69, '2026-01-10', 1, 1, 'great', 'Revised the previous ones and learnt and also took Azkar for when putting on clothes', NULL, '2026-01-10 19:21:09', '2026-01-10 19:21:09', '19:21:09'),
(176, 7, 40, '2026-01-10', 1, 1, 'great', 'I had to do it along evening workout', 15, '2026-01-10 20:46:16', '2026-01-10 20:46:16', '21:21:00'),
(177, 7, 43, '2026-01-10', 1, 1, 'great', '', NULL, '2026-01-10 20:46:32', '2026-01-10 20:46:32', '21:40:00'),
(178, 7, 67, '2026-01-10', 1, 1, 'great', 'Still reading Grit', NULL, '2026-01-10 22:47:56', '2026-01-10 22:47:56', '22:47:56'),
(179, 7, 39, '2026-01-11', 1, 1, 'okay', '', NULL, '2026-01-11 09:36:45', '2026-01-11 09:36:45', '07:30:00'),
(180, 7, 40, '2026-01-11', 1, 1, 'great', 'Stretches', 10, '2026-01-11 09:37:08', '2026-01-11 09:37:08', '07:00:00'),
(181, 7, 69, '2026-01-11', 1, 1, 'great', 'I learnt Azkar for when wearing a new cloth', NULL, '2026-01-11 09:37:53', '2026-01-11 09:37:53', '09:37:53'),
(182, 7, 41, '2026-01-11', 1, 1, 'great', '', NULL, '2026-01-11 09:00:28', '2026-01-11 09:00:28', '16:05:00'),
(183, 7, 42, '2026-01-11', 1, 1, 'great', '', NULL, '2026-01-11 09:00:49', '2026-01-11 09:00:49', '16:10:00'),
(184, 7, 67, '2026-01-11', 1, 1, 'great', 'Still reading Grit. Page 40/267', NULL, '2026-01-11 09:01:09', '2026-01-11 09:01:09', '09:01:09'),
(185, 7, 71, '2026-01-11', 1, 1, 'great', 'Part 2/4 of Adjectives', NULL, '2026-01-11 09:01:23', '2026-01-11 09:01:23', '09:01:23'),
(186, 7, 39, '2026-01-12', 1, 1, 'great', '', NULL, '2026-01-12 09:02:06', '2026-01-12 09:02:06', '07:00:00'),
(187, 7, 71, '2026-01-12', 1, 1, 'great', 'Revised Verb 4/4', NULL, '2026-01-12 22:57:15', '2026-01-12 22:57:15', '22:57:15'),
(188, 7, 69, '2026-01-12', 1, 1, 'great', '', NULL, '2026-01-12 22:57:22', '2026-01-12 22:57:22', '22:57:22'),
(189, 7, 67, '2026-01-12', 1, 1, 'great', '', NULL, '2026-01-12 22:57:32', '2026-01-12 22:57:32', '22:57:32'),
(190, 7, 39, '2026-01-13', 1, 1, 'okay', '', NULL, '2026-01-13 17:55:07', '2026-01-13 17:55:07', '07:30:00'),
(191, 7, 40, '2026-01-13', 1, 1, 'good', 'Chest and Leg Workout', 30, '2026-01-13 17:55:52', '2026-01-13 17:55:52', '11:00:00'),
(192, 7, 71, '2026-01-13', 1, 1, 'great', '2/4 of Adjective', NULL, '2026-01-13 17:56:06', '2026-01-13 17:56:06', '17:56:06'),
(193, 7, 69, '2026-01-13', 1, 1, 'great', '', NULL, '2026-01-13 17:56:12', '2026-01-13 17:56:12', '17:56:12'),
(194, 7, 46, '2026-01-13', 1, 1, 'great', '', NULL, '2026-01-13 17:56:18', '2026-01-13 17:56:18', '17:56:18'),
(195, 7, 41, '2026-01-13', 1, 1, 'great', '', NULL, '2026-01-13 17:56:43', '2026-01-13 17:56:43', '16:40:00'),
(196, 7, 42, '2026-01-13', 1, 1, 'great', '', NULL, '2026-01-13 17:56:55', '2026-01-13 17:56:55', '16:45:00'),
(197, 7, 44, '2026-01-13', 1, 1, 'great', '', NULL, '2026-01-13 20:17:36', '2026-01-13 20:17:36', '21:05:00'),
(198, 7, 45, '2026-01-13', 1, 1, 'okay', '', NULL, '2026-01-13 20:17:59', '2026-01-13 20:17:59', '21:10:00'),
(199, 7, 67, '2026-01-13', 1, 1, 'great', 'Still reading Grit. Page 65/267', NULL, '2026-01-13 22:26:10', '2026-01-13 22:26:10', '22:26:10'),
(200, 7, 39, '2026-01-14', 1, 1, 'terrible', '', NULL, '2026-01-14 10:25:20', '2026-01-14 10:25:20', '07:50:00'),
(201, 7, 40, '2026-01-14', 1, 1, 'great', 'Chest Workout only', 5, '2026-01-14 16:50:51', '2026-01-14 16:50:51', '10:00:00'),
(202, 7, 71, '2026-01-14', 1, 1, 'great', 'Revised What I have Learnt', NULL, '2026-01-14 20:51:41', '2026-01-14 20:51:41', '20:51:41'),
(203, 7, 69, '2026-01-14', 1, 1, 'great', 'Revise what I have learnt\n', NULL, '2026-01-14 20:51:53', '2026-01-14 20:51:53', '20:51:53'),
(204, 7, 67, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 22:59:44', '2026-01-14 22:59:44', '22:59:44'),
(205, 7, 41, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 22:59:55', '2026-01-14 22:59:55', '00:00:00'),
(206, 7, 42, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 23:00:02', '2026-01-14 23:00:02', '00:00:00'),
(207, 7, 43, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 23:00:07', '2026-01-14 23:00:07', '00:00:00'),
(208, 7, 44, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 23:00:13', '2026-01-14 23:00:13', '00:00:00'),
(209, 7, 45, '2026-01-14', 1, 1, 'great', '', NULL, '2026-01-14 23:00:20', '2026-01-14 23:00:20', '00:00:00'),
(210, 7, 39, '2026-01-15', 1, 1, 'bad', '', NULL, '2026-01-15 09:11:55', '2026-01-15 09:11:55', '08:00:00'),
(211, 7, 40, '2026-01-15', 1, 1, 'great', '', 10, '2026-01-15 08:41:31', '2026-01-15 08:41:31', '10:00:00'),
(212, 7, 41, '2026-01-15', 1, 1, 'great', '', NULL, '2026-01-15 08:42:10', '2026-01-15 08:42:10', '16:30:00'),
(213, 7, 42, '2026-01-15', 1, 1, 'great', '', NULL, '2026-01-15 08:42:24', '2026-01-15 08:42:24', '16:35:00'),
(214, 7, 69, '2026-01-15', 1, 1, 'great', '', NULL, '2026-01-15 08:42:33', '2026-01-15 08:42:33', '08:42:33'),
(215, 7, 71, '2026-01-15', 1, 1, 'great', '', NULL, '2026-01-15 08:42:37', '2026-01-15 08:42:37', '08:42:37'),
(216, 7, 67, '2026-01-15', 1, 1, 'great', '', NULL, '2026-01-15 08:42:43', '2026-01-15 08:42:43', '08:42:43'),
(217, 7, 39, '2026-01-16', 1, 1, 'great', '', NULL, '2026-01-16 08:43:22', '2026-01-16 08:43:22', '06:20:00'),
(218, 7, 40, '2026-01-16', 1, 1, 'great', 'I did Chest Workouts only', 5, '2026-01-16 20:30:57', '2026-01-16 20:30:57', '13:50:00'),
(219, 7, 41, '2026-01-16', 1, 1, 'okay', '', NULL, '2026-01-16 20:31:29', '2026-01-16 20:31:29', '16:20:00'),
(220, 7, 42, '2026-01-16', 1, 1, 'great', '', NULL, '2026-01-16 20:32:09', '2026-01-16 20:32:09', '16:25:00'),
(221, 7, 44, '2026-01-16', 1, 1, 'okay', '', NULL, '2026-01-16 20:32:31', '2026-01-16 20:32:31', '20:38:00'),
(222, 7, 45, '2026-01-16', 1, 1, 'good', '', NULL, '2026-01-16 20:32:48', '2026-01-16 20:32:48', '20:43:00'),
(223, 7, 71, '2026-01-16', 1, 1, 'great', 'I completed Adjectives Part 4/4 and revised all I have learnt on Verbs and Adjectives', NULL, '2026-01-16 20:33:33', '2026-01-16 20:33:33', '20:33:33'),
(224, 7, 69, '2026-01-16', 1, 1, 'great', 'I learnt azkar for hen you\'re leaving home', NULL, '2026-01-16 22:50:55', '2026-01-16 22:50:55', '22:50:55'),
(225, 7, 67, '2026-01-16', 1, 1, 'great', 'Still reading Grit but I also started another book today. \"Eat That Frog\"', NULL, '2026-01-16 22:51:30', '2026-01-16 22:51:30', '22:51:30'),
(226, 7, 46, '2026-01-16', 1, 1, 'good', '', NULL, '2026-01-16 22:51:36', '2026-01-16 22:51:36', '22:51:36'),
(227, 7, 43, '2026-01-16', 1, 1, 'great', 'I did some ABS and Leg', NULL, '2026-01-16 22:52:07', '2026-01-16 22:52:07', '23:50:00'),
(228, 7, 39, '2026-01-17', 1, 1, 'terrible', 'Very Terrible, The WORSE I have ever had!', NULL, '2026-01-17 21:17:30', '2026-01-17 21:17:30', '08:30:00'),
(229, 7, 40, '2026-01-17', 1, 1, 'great', 'Just some chest exercises and stretches', 10, '2026-01-17 21:18:08', '2026-01-17 21:18:08', '07:50:00'),
(230, 7, 71, '2026-01-17', 1, 1, 'great', 'Took Introduction to Adverbs', NULL, '2026-01-17 21:18:27', '2026-01-17 21:18:27', '21:18:27'),
(231, 7, 69, '2026-01-17', 1, 1, 'great', '', NULL, '2026-01-17 21:18:40', '2026-01-17 21:18:40', '21:18:40'),
(232, 7, 67, '2026-01-17', 1, 1, 'great', 'Reading Grit and Eat That Frog', NULL, '2026-01-17 22:33:17', '2026-01-17 22:33:17', '22:33:17'),
(233, 7, 43, '2026-01-17', 1, 1, 'great', 'Chest and Abs exercise', NULL, '2026-01-17 22:34:23', '2026-01-17 22:34:23', '23:30:00'),
(234, 7, 41, '2026-01-17', 1, 1, 'okay', '', NULL, '2026-01-17 22:34:39', '2026-01-17 22:34:39', '00:00:00'),
(235, 7, 42, '2026-01-17', 1, 1, 'terrible', '', NULL, '2026-01-17 22:34:47', '2026-01-17 22:34:47', '00:00:00'),
(236, 7, 44, '2026-01-17', 1, 1, 'terrible', '', NULL, '2026-01-17 22:34:53', '2026-01-17 22:34:53', '00:00:00'),
(237, 7, 45, '2026-01-17', 1, 1, 'terrible', '', NULL, '2026-01-17 22:34:59', '2026-01-17 22:34:59', '00:00:00'),
(238, 7, 39, '2026-01-18', 1, 1, 'good', '', NULL, '2026-01-18 22:22:37', '2026-01-18 22:22:37', '07:22:00'),
(239, 7, 40, '2026-01-18', 1, 1, 'good', 'Chest Exercise', 10, '2026-01-18 22:23:14', '2026-01-18 22:23:14', '13:50:00'),
(240, 7, 41, '2026-01-18', 1, 1, 'great', '', NULL, '2026-01-18 22:23:28', '2026-01-18 22:23:28', '16:10:00'),
(241, 7, 42, '2026-01-18', 1, 1, 'great', '', NULL, '2026-01-18 22:23:40', '2026-01-18 22:23:40', '16:15:00'),
(242, 7, 44, '2026-01-18', 1, 1, 'terrible', '', NULL, '2026-01-18 22:23:54', '2026-01-18 22:23:54', '23:40:00'),
(243, 7, 71, '2026-01-18', 1, 1, 'great', 'Adverbs', NULL, '2026-01-18 22:24:12', '2026-01-18 22:24:12', '22:24:12'),
(244, 7, 45, '2026-01-18', 1, 1, 'bad', '', NULL, '2026-01-18 22:24:28', '2026-01-18 22:24:28', '23:30:00'),
(245, 7, 69, '2026-01-18', 1, 1, 'great', '', NULL, '2026-01-18 22:25:22', '2026-01-18 22:25:22', '22:25:22');

-- --------------------------------------------------------

--
-- Table structure for table `sleep_logs`
--
-- Error reading structure for table axiom.sleep_logs: #1932 - Table &#039;axiom.sleep_logs&#039; doesn&#039;t exist in engine
-- Error reading data for table axiom.sleep_logs: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `axiom`.`sleep_logs`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `sleep_logs2`
--

CREATE TABLE `sleep_logs2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `bedtime` time NOT NULL,
  `wakeup_time` time NOT NULL,
  `duration` decimal(4,2) NOT NULL COMMENT 'Hours of sleep',
  `quality` int(3) NOT NULL COMMENT 'Sleep quality percentage 0-100',
  `mood` enum('terrible','bad','okay','good','great') DEFAULT 'okay',
  `notes` text DEFAULT NULL,
  `cycle_data` text DEFAULT NULL COMMENT 'Comma-separated sleep phases: awake,sleep,deep',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sleep_logs2`
--

INSERT INTO `sleep_logs2` (`id`, `user_id`, `date`, `bedtime`, `wakeup_time`, `duration`, `quality`, `mood`, `notes`, `cycle_data`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-01-10', '22:00:00', '06:30:00', 8.50, 90, 'great', 'No Dreams ', 'sleep,awake,sleep,sleep,sleep,sleep,sleep,deep,awake,sleep,deep,sleep,sleep,sleep,awake,deep,awake,deep,awake,awake,awake,sleep,sleep,sleep,sleep,deep,sleep,sleep,deep,sleep', '2026-01-10 22:49:10', NULL),
(2, 1, '2026-01-11', '03:10:00', '08:00:00', 4.83, 95, 'great', '', 'deep,sleep,awake,sleep,sleep,deep,sleep,awake,awake,sleep,deep,sleep,sleep,sleep,deep,deep,deep,awake,awake,sleep,awake,sleep,sleep,sleep,deep,sleep,awake,sleep,sleep,deep', '2026-01-11 09:34:52', '2026-01-12 09:13:28'),
(3, 1, '2026-01-12', '02:00:00', '06:30:00', 4.50, 50, 'bad', 'I was having stomach ache', 'awake, awake, awake, awake, awake, sleep, sleep, sleep, sleep, sleep, sleep, sleep, sleep, sleep, sleep, deep, deep, deep, deep, deep, deep, deep, deep, deep, deep, deep, deep, awake, awake, awake, awake, awake, awake', '2026-01-12 09:03:38', '2026-01-12 09:13:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `theme` enum('onyx','light','amethyst','emerald','amber') DEFAULT 'onyx',
  `xp` int(10) UNSIGNED DEFAULT 0,
  `level` int(10) UNSIGNED DEFAULT 1,
  `integrity` decimal(5,2) DEFAULT 100.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `theme`, `xp`, `level`, `integrity`, `created_at`, `last_login`, `updated_at`) VALUES
(1, 'Mukhiteee2', 'themusicianmkay@gmail.com', '$2y$10$COSuIk9vgjNIBI8q97dXgeEzNN2KhUy53fTLoYKZl9NS02iKB1lOu', 'onyx', 0, 1, 100.00, '2025-12-29 08:57:24', '2025-12-31 22:44:42', '2025-12-31 23:20:55'),
(2, 'AxiomAlpha', 'alpha@axiom.com', '$2y$10$COSuIk9vgjNIBI8q97dXgeEzNN2KhUy53fTLoYKZl9NS02iKB1lOu', 'amethyst', 50, 1, 100.00, '2025-12-30 10:10:40', NULL, '2025-12-30 10:10:40'),
(3, 'TestUser', 'test@axiom.com', '$2y$10$dgwB9Mf3xaC1pbPpaNuEbOFy72OPryUSXQcZuZuDy6mna5u3JLVd6', 'amber', 0, 1, 100.00, '2025-12-30 10:12:25', '2025-12-31 00:52:12', '2025-12-31 00:52:12'),
(4, 'Diyah', 'diyah@gmail.com', '$2y$10$G0N0eYvRkP1CqY.HlE2Xxe9J8Q.p8N0X1u5yF3g7l9zM0a2B3C4D5$2y$10$aO1.vP.Eaw20COrvr1NIrO8DDtBybD7xfog5HdrFwBRI9vB/hKPeS$2y$10$dgwB9Mf3xaC1pbPpaNuEbOFy72OPryUSXQcZuZuDy6mna5u3JLVd6', 'onyx', 0, 1, 100.00, '2025-12-30 10:15:09', NULL, '2025-12-30 10:20:53'),
(5, 'ismail', 'ismail@gmail.com', '$2y$10$e.qZ9F2WeuztGemj1lW.FeFuKcsLsWhjWM0sgrCvp2Mo37Kvui9m6', 'onyx', 30, 1, 100.00, '2025-12-31 00:55:06', '2025-12-31 13:46:30', '2025-12-31 13:46:30'),
(7, 'mukhiteee', 'mukhiteee@gmail.com', '$2y$10$DG2vmaARel7Dhd5lDBXuruj1qljQRV8DxMYSlpHr.4gRoJt7ahv1i', 'onyx', 0, 1, 100.00, '2025-12-31 23:21:04', '2026-01-16 08:39:40', '2026-01-16 08:39:40'),
(9, 'Isdi', 'Isdi@gmail.com', '$2y$10$AYCkTF6YcUAVS0R.yjVAjeN64KkL005MT70PfPwR3Ys6ljVdxx.Ra', 'onyx', 0, 1, 100.00, '2026-01-02 13:33:40', NULL, '2026-01-02 13:33:40'),
(13, 'Isda', 'Isda@gmail.com', '$2y$10$sUWYeOB/exNb6GWSUG03QuiIm.O9onNmJedBBEW1jtCCUCkOlt.8G', 'onyx', 0, 1, 100.00, '2026-01-02 13:36:43', NULL, '2026-01-02 13:36:43'),
(14, 'Ismumu', 'Ismumu@gmail.com', '$2y$10$.EMCFotoJK4NhiU5/AHdIO5X9zBRj/i0mT259Cdr1sSj52rhIQy4S', 'onyx', 0, 1, 100.00, '2026-01-02 13:39:17', NULL, '2026-01-02 13:39:17'),
(16, 'Isdimumub', 'Isdimumub@gmail.com', '$2y$10$UnyjW1iZFKQn1r0DxzzhWe7nbVUlDiu1JRq8ilsoTNimb2e2FwWA.', 'onyx', 0, 1, 100.00, '2026-01-02 13:40:55', '2026-01-02 13:41:42', '2026-01-02 13:41:42'),
(17, 'Ismail2026', 'Ismail2026@gmail.com', '$2y$10$HK3haj7/ELHhBc3AH8bgVubUM1dlluEZERbmW0wqNbcEzcbQfmvQC', 'onyx', 0, 1, 100.00, '2026-01-02 13:44:13', '2026-01-09 05:18:06', '2026-01-09 05:18:06'),
(19, 'AbdIsmail', 'AbdIsmail@gmail.com', '$2y$10$Y8B7mXbNA9dXJYHpdZplEu8wZWXgWy3AAM4sDN0ldEGRq2fKm6XTO', 'onyx', 0, 1, 100.00, '2026-01-09 05:26:23', '2026-01-09 05:26:56', '2026-01-09 05:26:56');

-- --------------------------------------------------------

--
-- Table structure for table `xp_transactions`
--

CREATE TABLE `xp_transactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `habit_id` int(10) UNSIGNED DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `habits`
--
ALTER TABLE `habits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `habit_checkins`
--
ALTER TABLE `habit_checkins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_habit_date` (`habit_id`,`date`),
  ADD KEY `idx_user_date` (`user_id`,`date`),
  ADD KEY `idx_habit_date` (`habit_id`,`date`),
  ADD KEY `idx_completed` (`completed`);

--
-- Indexes for table `sleep_logs2`
--
ALTER TABLE `sleep_logs2`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_date` (`user_id`,`date`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `date` (`date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_last_login` (`last_login`);

--
-- Indexes for table `xp_transactions`
--
ALTER TABLE `xp_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `habit_id` (`habit_id`),
  ADD KEY `idx_user_date` (`user_id`,`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `habits`
--
ALTER TABLE `habits`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `habit_checkins`
--
ALTER TABLE `habit_checkins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT for table `sleep_logs2`
--
ALTER TABLE `sleep_logs2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `xp_transactions`
--
ALTER TABLE `xp_transactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `habits`
--
ALTER TABLE `habits`
  ADD CONSTRAINT `habits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `habit_checkins`
--
ALTER TABLE `habit_checkins`
  ADD CONSTRAINT `habit_checkins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `habit_checkins_ibfk_2` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `xp_transactions`
--
ALTER TABLE `xp_transactions`
  ADD CONSTRAINT `xp_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `xp_transactions_ibfk_2` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
