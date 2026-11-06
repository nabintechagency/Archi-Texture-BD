-- =========================================================
-- MariaDB / MySQL Complete Database Dump
-- Target Database : `architex_web`
-- Target User     : `architex_web`
-- Generated on    : 2026-11-06 18:52:38 UTC
-- Application     : ARCHI-TEXTURE Interior Showroom
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = '+00:00';

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ---------------------------------------------------------
-- Database Initialization
-- ---------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `architex_web` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `architex_web`;

-- ---------------------------------------------------------
-- Table structure for table `users`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users` (1 rows)
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Studio Admin', 'admin@architexturebd.com', '2026-10-04 17:59:06', '$2y$12$pTxLdDdPLsAug.1niKcv8.Pon45y6i0oZQTpsKQ.Hf7fFexotARy2', 'bed7CkQ9X2KpQZFZConkUY27WG7SVPcCmLMWTmaQoBtPU3J0AHPWA6GSOHRL', '2026-10-04 17:59:06', '2026-11-05 18:09:59', 'admin');

-- ---------------------------------------------------------
-- Table structure for table `password_reset_tokens`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `sessions`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `sessions` (22 rows)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0ssetfynMkuZMh0zz8jjiCDTxebKSxqqcADIJbse', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ3NFlUdGpnTThkVmNjcVd4dnJtcllzWTN5STM0ekdvMXNTdzhoZUtPIiwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMCIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793958735),
('FYdTcXvlRB3tJLkAeeHFUZFqPtJ9hZ7l3I0bloBE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:159.0) Gecko/20100101 Firefox/159.0', 'eyJfdG9rZW4iOiJqWlNnbjA3WEZ0Unlhcmdkb0lySmJHTTVnMFdzQUNSaEl4aTRoZElIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793957796),
('id8bTlr1jvZT2a5XvSXG5aJ7ahicfYqQth4WL9yT', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJhZkJoMzJBSTJYcmpYNmhKSGg4NHNXVEFHZkdnOGtKUGs3c3FtSXhDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793951568),
('VhEt12FCCf0Z7u7FZCDmKAynpoWYYRz2cWGvHbWr', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJGVTNvR0l6WVl6SDM0bU9MWWlHRFV5bHhoMWhHSzhKYTRGRGJvdzhQIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2FkbWluXC9wcm9qZWN0c1wvY3JlYXRlIn0sIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYWRtaW5cL3Byb2plY3RzXC9jcmVhdGUiLCJyb3V0ZSI6ImFkbWluLnByb2plY3RzLmNyZWF0ZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793951936),
('B6hidGhbpmpLMrz5WhRXOjNdWwdvvh7AwghbgwSN', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJNR0hIZENXTkJqOU04ZGd4NXJmaTRLclNhejk1TGJqbjBWMDBOdEEzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793951942),
('AxtKLbQTECRtFQO6nChz7DSLm0GcejVkxllqAXQQ', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ4NmsxTHJVRnU2YjJnY3JMUmxxbEJhMkl5M0tQbUZKMldlc1I4Qld1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793952872),
('nKPmmU2GJFPIrzVzewM7ndei5wDmpcaXJoxvbjxa', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJFMWlUMDBtYlEzemV6VlRaSHZQU0hQbVROdjMzV1JWTVZYR2hiQUVHIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2FkbWluXC9wcm9qZWN0c1wvY3JlYXRlIn0sIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYWRtaW5cL3Byb2plY3RzXC9jcmVhdGUiLCJyb3V0ZSI6ImFkbWluLnByb2plY3RzLmNyZWF0ZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793952877),
('HVeUDIoyMO0Q4IaydnesaTueThhcGMY6cn6oocyP', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJobmxTcU5HZE1WeGdzZ3ZWNkxIZ211UUw0Tm1YOVVPU3NFbU9rbWxYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793954229),
('F3cquokCnl7LyqydKQi0Gl1I6U7ON0H0qbnNMk2A', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiIzb3pPMlNWZG5YbDMxSlNoYzRiQVlCWXhteFc2OXk4UUtVMnNFdjZxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793954657),
('VhFR8LvflCGvzBGWBl5x1S1WS0FYhSfMTZ85zt80', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiIzVWtXdkxoRjlCSmNtYnRVUU1ZcTdtd2I1aG5pUlY0ZGdHaEtmbDlBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793954971),
('bvaDX4GaTV3HGC8iyU0hD4n0NuJPtDgIdJY2PETr', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJLaDdYRGNpZXJYbDhSOW9DZTVHeGdwQ3F5Qms1T01uck1vVWFRbk1tIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793955277),
('n2M4SgmWh1Te3YZFPqSKaBSUKOCK2TrlYM9GFhSh', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJQWE43ZnRYeTM5cEQwb1p2cm1QUTJ2anFRcGxDM1hFb3FnSW9KZVRIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793955674),
('1VMuJyDWyQSKmZWPdGaX7lBckz4uT4xsXa5TMJQ7', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJOT2VHcnJuYzZsdDJtTmxwR2tlVTJMY0NnWEJlWkRuZjlDbXRBU3JpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jb250YWN0Iiwicm91dGUiOiJjb250YWN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793956032),
('wi7RpCbYWsO37EAitNYUnX4CrTtRiMNSc1GvKlO5', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ1WnBaZkZYN25IdklCTFlYVDJtcXhrT29DYWRMNmdqMFdnOXdkd25GIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jb250YWN0Iiwicm91dGUiOiJjb250YWN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793956347),
('fEzbndufnSouFvirYExcadQ6CdgZtCkvMMpU10tz', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJhTGNoeXBFWXFYNEluSTAwcmFaRnhmSkJjeGplazNiaGRzNUwxRlhhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793957119),
('UGTjszClx5PSYqLRKX771mrIjlAMYw4Gdd6KU98J', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJqZVg2bzQ5bXNxNFRlWnlwVExyQVJYNlNOcmFja1d4WTBKc3lyS01pIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793957674),
('B1TEcey9xriTBnAjMTu3BjHGCIAenwKKc7vJ0qJI', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJpR3JyeHFKSXZYTktBTHBMM2thM1hoeXVQb1g5VUIyQkdkSHZWR2d6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793958017),
('ZowzxOGz4hhNNZ4pfZ9kyg3DOnpBh8Zcvp8cXPoV', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ5eVJLVUNFT0ZuNEpBR1ZBVWZ2eWQ4ZEszdEpSY1pJYzk1d0RBclpZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793958269),
('dhBhvd0RDOBIJGwKJmpGoHtUDYkNHOzbUQJByRzH', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ6N2FnUjc1bVJnM2dYYlNIMHdYQUJaeUkxSVMyeFF4NklHenVocnNXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1793987419),
('2VI7zV0KGAmzpHaCqGycDTBI4Kyyj6MJiRmVWKq6', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJnWHZSRWZzZGFNQ1ZsRGlSOE1WcDhWS2cxVlBNMnA0Ync5cnM5cktIIiwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYWRtaW5cL29yZGVyc1wvMiIsInJvdXRlIjoiYWRtaW4ub3JkZXJzLnNob3cifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1793989190),
('CuSsGPADhnqEqs0vYEZBI0ypZNXJuAIkhrRkhB8E', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJTVnNZVTQ3bFllOU1HaVdQbG9VR2Y0aWFJNktPc3A1SzkzQ1dKdkM0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wb3J0Zm9saW8iLCJyb3V0ZSI6InBvcnRmb2xpbyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1793988493),
('9bDMxvrCebZFiaAd8UttAJjZOvF3K8xip6ezHLVq', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ6Y0NyNlpPRzkwblVvYXRLT0J3Q2lKcENwZWM0d0k4QUU4OWlwOTRlIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2FkbWluXC9vcmRlcnMifSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hZG1pblwvb3JkZXJzIiwicm91dGUiOiJhZG1pbi5vcmRlcnMifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1793988959);

-- ---------------------------------------------------------
-- Table structure for table `cache`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cache` (4 rows)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('archi-texture-cache-dmin@architexturebd.com|127.0.0.1:timer', 'i:1793856124;', 1793856124),
('archi-texture-cache-dmin@architexturebd.com|127.0.0.1', 'i:1;', 1793856124),
('archi-texture-cache-admin@architexture.com|127.0.0.1:timer', 'i:1793901793;', 1793901793),
('archi-texture-cache-admin@architexture.com|127.0.0.1', 'i:1;', 1793901793);

-- ---------------------------------------------------------
-- Table structure for table `cache_locks`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `jobs`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `job_batches`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `failed_jobs`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_conn_queue_failed_idx` (`connection`(191), `queue`(191), `failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `personal_access_tokens`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `skills`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `skills`;
CREATE TABLE IF NOT EXISTS `skills` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `proficiency` tinyint(3) unsigned DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skills_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `services`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `projects`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `project_url` varchar(255) DEFAULT NULL,
  `repository_url` varchar(255) DEFAULT NULL,
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` date DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_slug_unique` (`slug`),
  KEY `projects_category_index` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `projects` (18 rows)
INSERT INTO `projects` (`id`, `title`, `slug`, `summary`, `description`, `featured_image`, `project_url`, `repository_url`, `technologies`, `status`, `is_featured`, `completed_at`, `sort_order`, `created_at`, `updated_at`, `category`, `gallery`) VALUES
(1, 'Nordic Minimalist Living Room', 'nordic-minimalist-living-room', 'Warm oak paneling, boucle textures, and soft diffuse perimeter lighting.', 'Warm oak paneling, boucle textures, and soft diffuse perimeter lighting.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 1, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Living Room', NULL),
(2, 'Sunlit Contemporary Lounge', 'sunlit-contemporary-lounge', 'Floor-to-ceiling glass integration with low-profile Belgian linen seating.', 'Floor-to-ceiling glass integration with low-profile Belgian linen seating.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 2, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Living Room', NULL),
(3, 'Modern Organic Penthouse', 'modern-organic-penthouse', 'Curved architectural plaster wall and custom travertine coffee tables.', 'Curved architectural plaster wall and custom travertine coffee tables.', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 3, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Living Room', NULL),
(4, 'Japandi Master Suite', 'japandi-master-suite', 'Slatted cedar headboard with integrated warm bedside illumination.', 'Slatted cedar headboard with integrated warm bedside illumination.', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 4, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bedroom', NULL),
(5, 'Earthy Minimal Bedroom', 'earthy-minimal-bedroom', 'Textured lime wash walls, raw linen drapery, and woven wool rugs.', 'Textured lime wash walls, raw linen drapery, and woven wool rugs.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 5, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bedroom', NULL),
(6, 'Boutique Loft Retreat', 'boutique-loft-retreat', 'Exposed structural concrete juxtaposed with plush cashmere accents.', 'Exposed structural concrete juxtaposed with plush cashmere accents.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 6, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bedroom', NULL),
(7, 'Monolithic Marble Kitchen Island', 'monolithic-marble-kitchen-island', 'Calacatta Viola marble, handleless smoked walnut cabinetry, and bronze hardware.', 'Calacatta Viola marble, handleless smoked walnut cabinetry, and bronze hardware.', 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 7, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Kitchen', NULL),
(8, 'Scandi Open-Plan Culinary Space', 'scandi-open-plan-culinary-space', 'Fluted glass upper cabinets, integrated quartz splashback, and pendant array.', 'Fluted glass upper cabinets, integrated quartz splashback, and pendant array.', 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 8, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Kitchen', NULL),
(9, 'Minimalist Matte Anthracite Kitchen', 'minimalist-matte-anthracite-kitchen', 'Hidden prep pantry, flush induction cooking, and architectural linear lighting.', 'Hidden prep pantry, flush induction cooking, and architectural linear lighting.', 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 9, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Kitchen', NULL),
(10, 'Terrazzo & Brass Sanctuary', 'terrazzo-brass-sanctuary', 'Custom dual vessel basin with wall-mounted brushed champagne fixtures.', 'Custom dual vessel basin with wall-mounted brushed champagne fixtures.', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 10, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bathroom', NULL),
(11, 'Sculptural Freestanding Bath Suite', 'sculptural-freestanding-bath-suite', 'Seamless micro-cement walls and concealed ambient niche lighting.', 'Seamless micro-cement walls and concealed ambient niche lighting.', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 11, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bathroom', NULL),
(12, 'Japanese Hinoki Wet Room', 'japanese-hinoki-wet-room', 'Cedar bath slats, rainfall shower fixture, and natural stone drainage.', 'Cedar bath slats, rainfall shower fixture, and natural stone drainage.', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 12, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Bathroom', NULL),
(13, 'Executive Walnut Study', 'executive-walnut-study', 'Built-in library shelving with concealed LED strips and leather desk pad.', 'Built-in library shelving with concealed LED strips and leather desk pad.', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 13, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Office', NULL),
(14, 'Minimalist Creative Atelier', 'minimalist-creative-atelier', 'Dual ergonomic workstation setup surrounded by natural botanical elements.', 'Dual ergonomic workstation setup surrounded by natural botanical elements.', 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 14, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Office', NULL),
(15, 'Architectural Design Studio', 'architectural-design-studio', 'High ceilings, acoustic wall baffling, and oversized drafting surfaces.', 'High ceilings, acoustic wall baffling, and oversized drafting surfaces.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 15, '2026-11-05 18:40:55', '2026-11-05 18:40:55', 'Office', NULL),
(16, 'Formal Architectural Dining Hall', 'formal-architectural-dining-hall', 'Solid smoked oak dining table with sculptural ceramic pendant centerpiece.', 'Solid smoked oak dining table with sculptural ceramic pendant centerpiece.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 16, '2026-11-05 18:40:55', '2026-11-06 07:40:03', 'Dining', NULL),
(17, 'Contemporary Light-Filled Dining Room', 'casual-light-filled-breakfast-nook', 'Curated modern dining suite with bespoke natural wood table, sculptural lighting, and upholstered seating.', 'Custom curved banquette upholstered in stain-resistant performance linen.', 'https://images.unsplash.com/photo-1632210826643-9ff7e84be2f9?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 1, NULL, 17, '2026-11-05 18:40:55', '2026-11-06 18:06:36', 'Dining', NULL),
(18, 'Warm Bronze Entertaining Space', 'warm-bronze-entertaining-space', 'Integrated architectural dining room with floor-to-ceiling windows, sculptural centerpiece, and designer dining chairs.', 'Integrated wine storage wall, fluted bronze credenza, and velvet dining chairs.', 'https://images.unsplash.com/photo-1634547588713-edd93045b9f1?auto=format&fit=crop&w=1200&q=80', NULL, NULL, NULL, 'published', 0, NULL, 18, '2026-11-05 18:40:55', '2026-11-06 18:06:36', 'Dining', NULL);

-- ---------------------------------------------------------
-- Table structure for table `project_skill`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `project_skill`;
CREATE TABLE IF NOT EXISTS `project_skill` (
  `project_id` bigint(20) unsigned NOT NULL,
  `skill_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`project_id`, `skill_id`),
  KEY `project_skill_skill_id_foreign` (`skill_id`),
  CONSTRAINT `project_skill_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_skill_skill_id_foreign` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `experiences`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `experiences`;
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `started_at` date NOT NULL,
  `ended_at` date DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `education`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `education`;
CREATE TABLE IF NOT EXISTS `education` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institution` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `started_at` date DEFAULT NULL,
  `ended_at` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `certifications`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `certifications`;
CREATE TABLE IF NOT EXISTS `certifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `credential_id` varchar(255) DEFAULT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `issued_at` date DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `testimonials`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `author_role` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `rating` tinyint(3) unsigned DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `testimonials` (3 rows)
INSERT INTO `testimonials` (`id`, `author_name`, `author_role`, `company`, `content`, `avatar_path`, `rating`, `is_featured`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Sarah Rahman', 'Homeowner', 'Gulshan, Dhaka', 'Working with Archi Texture was an effortless journey from concept to reality. Every custom piece exceeded our expectations.', NULL, 5, 1, 1, '2026-11-05 20:09:10', '2026-11-05 20:19:03'),
(2, 'Tanvir Ahmed', 'Managing Director', 'Banani', 'The bespoke furniture and lighting completely transformed our penthouse. The craftsmanship is world-class.', NULL, 5, 1, 2, '2026-11-05 20:09:10', '2026-11-05 20:09:10'),
(3, 'Nusrat Jahan', 'Architectural Enthusiast', 'Dhanmondi', 'Their attention to tactile materials, lighting warmth, and room proportions is extraordinary.', NULL, 5, 1, 3, '2026-11-05 20:09:10', '2026-11-05 20:09:10');

-- ---------------------------------------------------------
-- Table structure for table `blog_posts`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  KEY `blog_posts_author_id_foreign` (`author_id`),
  KEY `blog_posts_published_at_index` (`published_at`),
  CONSTRAINT `blog_posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `media`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE IF NOT EXISTS `media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `disk` varchar(255) NOT NULL DEFAULT 'public',
  `mime_type` varchar(255) NOT NULL,
  `size` bigint(20) unsigned NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `folder` varchar(255) DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_path_unique` (`path`),
  KEY `media_folder_index` (`folder`),
  KEY `media_uploaded_by_foreign` (`uploaded_by`),
  CONSTRAINT `media_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `media` (8 rows)
INSERT INTO `media` (`id`, `filename`, `original_filename`, `path`, `disk`, `mime_type`, `size`, `alt_text`, `caption`, `folder`, `uploaded_by`, `created_at`, `updated_at`) VALUES
(1, '73ea1790-d6d7-44ce-a365-62a9f5b267c9.png', 'NabinTech_Logo.png', 'products/73ea1790-d6d7-44ce-a365-62a9f5b267c9.png', 'public', 'image/png', 846728, NULL, NULL, 'products', 1, '2026-11-05 04:40:32', '2026-11-05 04:40:32'),
(2, '54930863-5240-4d79-9751-4f68f619c93b.png', 'NabinTech_Logo.png', 'products/54930863-5240-4d79-9751-4f68f619c93b.png', 'public', 'image/png', 846728, NULL, NULL, 'products', 1, '2026-11-05 04:40:32', '2026-11-05 04:40:32'),
(3, '17e7dbf8-adc8-4c25-bdbd-15156ab48962.jpg', 'Nabin Rajbonshi.jpg', 'team/17e7dbf8-adc8-4c25-bdbd-15156ab48962.jpg', 'public', 'image/jpeg', 482115, NULL, NULL, 'team', 1, '2026-11-05 19:37:21', '2026-11-05 19:37:21'),
(4, 'c078b564-1394-4846-9ba2-76a59ff09d20.png', 'NabinTech_Logo.png', 'team/c078b564-1394-4846-9ba2-76a59ff09d20.png', 'public', 'image/png', 846728, NULL, NULL, 'team', 1, '2026-11-05 19:37:39', '2026-11-05 19:37:39'),
(5, '8f848493-d1ad-44e5-bfa8-5e0a4ef457a4.png', 'NabinTech_Logo.png', 'testimonials/8f848493-d1ad-44e5-bfa8-5e0a4ef457a4.png', 'public', 'image/png', 846728, NULL, NULL, 'testimonials', 1, '2026-11-05 20:28:04', '2026-11-05 20:28:04'),
(6, '95c10564-88e2-484c-ae32-461fa40a036e.jpg', 'Nabin Rajbonshi.jpg', 'projects/95c10564-88e2-484c-ae32-461fa40a036e.jpg', 'public', 'image/jpeg', 482115, NULL, NULL, 'projects', 1, '2026-11-06 08:17:24', '2026-11-06 08:17:24'),
(7, 'faeef223-b4ac-494f-b013-5e35dccbf2d2.jpg', 'Nabin Rajbonshi.jpg', 'projects/faeef223-b4ac-494f-b013-5e35dccbf2d2.jpg', 'public', 'image/jpeg', 482115, NULL, NULL, 'projects', 1, '2026-11-06 08:17:24', '2026-11-06 08:17:24'),
(8, '59f80eb7-340b-430d-9c86-310dae28efbe.png', 'NabinTech_Logo.png', 'projects/59f80eb7-340b-430d-9c86-310dae28efbe.png', 'public', 'image/png', 846728, NULL, NULL, 'projects', 1, '2026-11-06 08:17:24', '2026-11-06 08:17:24');

-- ---------------------------------------------------------
-- Table structure for table `messages`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `settings`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`),
  KEY `settings_group_index` (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `settings` (39 rows)
INSERT INTO `settings` (`id`, `key`, `value`, `group`, `created_at`, `updated_at`) VALUES
(1, 'phone', '\"01626778573\"', 'general', '2026-08-27 21:09:18', '2026-11-05 05:18:01'),
(2, 'contact_phone', '\"01626778573\"', 'contact', '2026-08-27 21:09:18', '2026-11-05 05:18:01'),
(3, 'site_title', '\"ARCHI-TEXTURE\"', 'general', '2026-08-30 06:51:19', '2026-09-07 20:16:19'),
(4, 'company_name', '\"ARCHI-TEXTURE\"', 'general', '2026-08-30 06:51:19', '2026-09-07 20:16:19'),
(5, 'site_tagline', '\"Interior Products Wholesale Showroom and Farm\"', 'general', '2026-08-30 06:51:19', '2026-08-30 06:51:19'),
(6, 'notice_bar_text', '\"Interior Products Wholesale Showroom & Farm\"', 'notice', '2026-11-05 04:52:03', '2026-11-05 19:01:39'),
(7, 'notice_bar_active', '\"1\"', 'notice', '2026-11-05 04:52:03', '2026-11-05 19:01:15'),
(8, 'contact_email', '\"contact@architexturebd.com\"', 'contact', '2026-11-05 04:52:03', '2026-11-05 20:47:45'),
(9, 'contact_address', '\"Mohakhali, Dhaka, Bangladesh\"', 'contact', '2026-11-05 04:52:03', '2026-11-05 04:52:03'),
(10, 'contact_hours', '\"Sat - Thu: 10:00 AM - 08:00 PM\"', 'contact', '2026-11-05 04:52:03', '2026-11-05 04:52:03'),
(11, 'email', '\"contact@architexturebd.com\"', 'general', '2026-11-05 05:18:01', '2026-11-05 20:47:45'),
(12, 'about_eyebrow', '\"About ARCHI-TEXTURE\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(13, 'about_title', '\"Where Spatial Harmony Meets Timeless Interior Artistry\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:17:56'),
(14, 'about_bio', '\"At ARCHI-TEXTURE, we curate bespoke residential sanctuaries, wholesale interior products, and luxury architectural spaces. By uniting architectural rigor with tactile natural materials, we transform everyday living into an inspiring experience.\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(15, 'about_stat1_value', '\"12+\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(16, 'about_stat1_label', '\"Years of Craft\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(17, 'about_stat2_value', '\"350+\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(18, 'about_stat2_label', '\"Bespoke Spaces\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(19, 'about_stat3_value', '\"15+\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(20, 'about_stat3_label', '\"Design Accolades\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(21, 'about_stat4_value', '\"100%\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(22, 'about_stat4_label', '\"Delight Guarantee\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(23, 'about_standards_title', '\"Meticulous Precision at Every Stage\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(24, 'about_standards_desc', '\"From structural layout to the final textile drape, our studio upholds an uncompromising standard of execution to guarantee timeless living spaces.\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(25, 'about_image', '\"https:\\/\\/images.unsplash.com\\/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(26, 'about_image_quote', '\"Generational Craft, Modern Living\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(27, 'about_image_subtitle', '\"Every project is custom engineered for longevity and effortless beauty.\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(28, 'about_cta_title', '\"Begin Your Architectural & Interior Journey\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(29, 'about_cta_desc', '\"Collaborate with our senior interior architects and experience the ease of bespoke turnkey transformation.\"', 'general', '2026-11-05 19:05:07', '2026-11-05 19:05:07'),
(30, 'about_team_members', '\"[{\\\"id\\\":1,\\\"name\\\":\\\"LR Rahaman\\\",\\\"role\\\":\\\"Principal Architect & Creative Director\\\",\\\"experience\\\":\\\"12+ Years Experience\\\",\\\"bio\\\":\\\"Specializing in contemporary organic architecture and luxury residential transformations across South Asia and Europe.\\\",\\\"image\\\":\\\"https:\\/\\/images.unsplash.com\\/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80\\\",\\\"tags\\\":[\\\"Spatial Design\\\",\\\"Master Planning\\\",\\\"Bespoke Joinery\\\"],\\\"is_active\\\":true},{\\\"id\\\":2,\\\"name\\\":\\\"Elena Rostova\\\",\\\"role\\\":\\\"Senior Interior Architect\\\",\\\"experience\\\":\\\"9+ Years Experience\\\",\\\"bio\\\":\\\"Focuses on tactile materiality, historical restoration, and harmonious color psychology for private residential estates.\\\",\\\"image\\\":\\\"https:\\/\\/images.unsplash.com\\/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80\\\",\\\"tags\\\":[\\\"Color Theory\\\",\\\"Materiality\\\",\\\"Lighting Schemes\\\"],\\\"is_active\\\":true},{\\\"id\\\":3,\\\"name\\\":\\\"Marcus Sterling\\\",\\\"role\\\":\\\"Head of Furniture & Procurement\\\",\\\"experience\\\":\\\"8+ Years Experience\\\",\\\"bio\\\":\\\"Coordinates artisan trade ateliers and custom furniture fabrications, ensuring flawless white-glove delivery.\\\",\\\"image\\\":\\\"https:\\/\\/images.unsplash.com\\/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80\\\",\\\"tags\\\":[\\\"Artisan Trade\\\",\\\"Custom Millwork\\\",\\\"Procurement\\\"],\\\"is_active\\\":true}]\"', 'about', '2026-11-05 19:16:44', '2026-11-05 19:26:37'),
(31, 'about_team_title', '\"Meet Our Principal Design Team\"', 'about', '2026-11-05 19:16:44', '2026-11-05 19:16:44'),
(32, 'about_team_subtitle', '\"Generational architects, interior sculptors, and procurement specialists dedicated to your vision.\"', 'about', '2026-11-05 19:16:44', '2026-11-05 19:16:44'),
(33, 'about_team_eyebrow', '\"Creative Direction\"', 'about', '2026-11-05 19:16:44', '2026-11-05 19:16:44'),
(34, 'facebook_url', '\"https:\\/\\/facebook.com\\/architexturebd\"', 'general', '2026-11-05 21:36:11', '2026-11-05 21:36:11'),
(35, 'instagram_url', NULL, 'general', '2026-11-05 21:36:11', '2026-11-05 21:39:14'),
(36, 'youtube_url', NULL, 'general', '2026-11-05 21:36:11', '2026-11-05 21:39:14'),
(37, 'whatsapp_url', '\"+8801626778573\"', 'general', '2026-11-05 21:36:11', '2026-11-05 21:36:11'),
(38, 'linkedin_url', NULL, 'general', '2026-11-05 21:39:14', '2026-11-05 21:39:14'),
(39, 'pinterest_url', NULL, 'general', '2026-11-05 21:39:14', '2026-11-05 21:39:14');

-- ---------------------------------------------------------
-- Table structure for table `sliders`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `sliders`;
CREATE TABLE IF NOT EXISTS `sliders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `link_text` varchar(255) DEFAULT NULL,
  `text_position` varchar(255) NOT NULL DEFAULT 'center',
  `text_color` varchar(255) NOT NULL DEFAULT '#ffffff',
  `overlay_opacity` tinyint(3) unsigned NOT NULL DEFAULT 50,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for table `products`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `original_price` decimal(12,2) DEFAULT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `stock_quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `products` (9 rows)
INSERT INTO `products` (`id`, `name`, `slug`, `summary`, `description`, `featured_image`, `gallery`, `price`, `category`, `sku`, `stock_quantity`, `status`, `is_featured`, `sort_order`, `created_at`, `updated_at`, `original_price`, `discount_percent`) VALUES
(1, 'Aethel Bouclé Lounge Chair', 'aethel-boucle-lounge-chair', 'Sculptural armchair upholstered in ivory bouclé fabric with a brushed bronze swivel base.', 'Handcrafted by master artisans, the Aethel Lounge Chair combines organic silhouettes with timeless materials. Designed for relaxed luxury, it features high-resilience cushioning wrapped in premium Italian textured bouclé with an ergonomic curved backrest.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80\"]', 145000, 'Furniture', 'PRD-FUR-001', 9, 'published', 1, 1, '2026-08-27 19:03:57', '2026-11-06 08:20:04', NULL, NULL),
(2, 'Lumina Alabaster Pendant Light', 'lumina-alabaster-pendant-light', 'Hand-carved Spanish alabaster stone dome with aged brass stem and warm dimmable LED.', 'Every Lumina pendant reveals unique mineral veining that casts a soft, ethereal ambient glow. Perfect suspended over kitchen islands, dining tables, or bedside alcoves with solid brass hardware.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80\"]', 82000, 'Lighting', 'PRD-LGT-002', 25, 'published', 1, 2, '2026-08-27 19:03:57', '2026-08-27 19:23:56', NULL, NULL),
(3, 'Travertine Monolith Coffee Table', 'travertine-monolith-coffee-table', 'Solid Roman travertine low table featuring monolithic curved slab legs and honed matte finish.', 'Milled from unfilled Roman travertine with a matte honed finish. The architectural geometry celebrates classical Roman stonework translated into contemporary residential spaces.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80\"]', 189000, 'Furniture', 'PRD-FUR-003', 8, 'published', 1, 3, '2026-08-27 19:03:57', '2026-08-27 19:23:56', NULL, NULL),
(4, 'Komorebi Hand-Knotted Wool Rug', 'komorebi-hand-knotted-wool-rug', 'New Zealand wool and raw silk blend with subtle textural high-low carving in oatmeal tones.', 'Woven with 60 knots per square inch, Komorebi reflects the gentle play of filtered light. Its ultra-soft plush pile delivers grounding warmth and quiet sophistication to living and bedroom spaces.', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80\"]', 125000, 'Decor', 'PRD-TEX-004', 15, 'published', 0, 4, '2026-08-27 19:03:57', '2026-11-05 21:02:57', NULL, NULL),
(5, 'Aura Smoked Oak Dining Table', 'aura-smoked-oak-dining-table', 'Solid French white oak with a subtle smoked cerused finish and soft beveled perimeter.', 'Seats up to eight guests with ample leg clearance. Built with sustainable kiln-dried hardwood, solid mortise and tenon joinery, and finished with a low-VOC matte protective seal.', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80\"]', 265000, 'Furniture', 'PRD-FUR-005', 8, 'published', 0, 5, '2026-08-27 19:03:57', '2026-11-05 18:28:10', NULL, NULL),
(6, 'Solstice Sculptural Ceramic Vase Set', 'solstice-sculptural-ceramic-vase-set', 'Set of two hand-thrown stoneware vessels in raw volcanic sand and matte cream glaze.', 'Organic, asymmetrical silhouettes inspired by wind-swept coastal rock formations. Can be displayed individually or as a harmonious pair on mantels, consoles, and dining tables.', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80\"]', 34000, 'Decor', 'PRD-DEC-006', 30, 'published', 1, 6, '2026-08-27 19:03:57', '2026-08-27 19:23:56', NULL, NULL),
(7, 'Brutalist Cast Bronze Sconce', 'brutalist-cast-bronze-sconce', 'Heavy sand-cast solid bronze wall light with textured relief and dual-directional wash.', 'Each sconce is individually cast using lost-wax methods, resulting in a unique tactile surface that develops a rich, natural patina over time.', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80\"]', 59000, 'Lighting', 'PRD-LGT-007', 18, 'published', 0, 7, '2026-08-27 19:03:57', '2026-11-05 20:00:50', NULL, NULL),
(8, 'Minimalist Belgian Washed Linen Drapes', 'minimalist-belgian-washed-linen-drapes', 'Heavyweight European washed linen panels with concealed pinch pleats in warm sand.', 'Crafted from 100% Belgian flax with a heavy 380 GSM weight that drapes effortlessly while filtering harsh daylight into a golden glow.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80', '[\"https:\\/\\/images.unsplash.com\\/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80\"]', 42000, 'Decor', 'PRD-TEX-008', 22, 'published', 1, 8, '2026-08-27 19:03:57', '2026-11-05 21:02:57', NULL, NULL),
(9, 'Test Product One', 'test-product-one', 'Here is Brief Architectural Summary.', 'Here are the full specifications and description.', '/storage/products/73ea1790-d6d7-44ce-a365-62a9f5b267c9.png', '[\"\\/storage\\/products\\/54930863-5240-4d79-9751-4f68f619c93b.png\"]', 12749.15, 'Architectural Hardware', 'AT-ARC-2118', 10, 'published', 0, 0, '2026-11-05 04:40:32', '2026-11-05 21:11:52', 14999, 15);

-- ---------------------------------------------------------
-- Table structure for table `orders`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `shipping_address` text NOT NULL,
  `city` varchar(255) NOT NULL DEFAULT 'Dhaka',
  `notes` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) NOT NULL DEFAULT 'cash_on_delivery',
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `admin_notes` text DEFAULT NULL,
  `placed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `orders` (2 rows)
INSERT INTO `orders` (`id`, `order_number`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `notes`, `status`, `payment_status`, `payment_method`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `admin_notes`, `placed_at`, `created_at`, `updated_at`) VALUES
(2, 'ORD-20261002-2891', 'Farhana Chowdhury', 'farhana.chowdhury@designarc.net', '+880 1819-876543', 'Apt 6B, The Glasshouse, Gulshan-2', 'Dhaka', 'Fragile glass items, please handle with extra care.', 'confirmed', 'paid', 'BANK TRANSFER', 189000, 0, 5000, 184000, 'Payment verified via bKash TrxID #8AK29N7', '2026-10-03 14:46:10', '2026-10-04 17:46:10', '2026-11-06 08:43:36'),
(6, 'ORD-20261105-0001', 'John Doe', NULL, '01711223344', 'House 12, Road 4, Gulshan 2', 'Dhaka', NULL, 'pending', 'pending', 'cash_on_delivery', 290000, 0, 0, 290000, NULL, '2026-11-05 06:08:42', '2026-11-05 06:08:42', '2026-11-05 06:10:58');

-- ---------------------------------------------------------
-- Table structure for table `order_items`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `total` decimal(12,2) NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `order_items` (2 rows)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `sku`, `price`, `quantity`, `total`, `featured_image`, `created_at`, `updated_at`) VALUES
(3, 2, 3, 'Travertine Monolith Coffee Table', 'PRD-FUR-003', 189000, 1, 189000, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80', '2026-10-04 17:46:10', '2026-10-04 17:46:10'),
(8, 6, 1, 'Aethel Bouclé Lounge Chair', 'PRD-FUR-001', 145000, 2, 290000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', '2026-11-05 06:08:42', '2026-11-05 06:08:42');

-- ---------------------------------------------------------
-- Table structure for table `migrations`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `migrations` (14 rows)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_17_000000_create_portfolio_content_tables', 2),
(5, '2026_08_17_000001_add_role_to_users_table', 2),
(6, '2026_08_17_000002_create_project_skill_table', 3),
(7, '2026_08_17_000003_create_personal_access_tokens_table', 4),
(8, '2026_08_26_000000_create_sliders_table', 5),
(9, '2026_08_26_000001_create_products_table', 5),
(10, '2026_10_04_000000_create_orders_table', 6),
(11, '2026_11_05_045036_add_discount_fields_to_products_table', 7),
(12, '2026_11_05_184015_add_category_to_projects_table', 8),
(13, '2026_11_06_080736_add_gallery_to_projects_table', 9),
(14, '2026_11_06_091046_add_phone_and_make_email_nullable_in_messages_table', 10);

-- ---------------------------------------------------------
-- Grant Privileges for User `architex_web` (if running as root)
-- ---------------------------------------------------------
-- CREATE USER IF NOT EXISTS 'architex_web'@'localhost' IDENTIFIED BY 'VyK4u;y;kX0J56';
-- CREATE USER IF NOT EXISTS 'architex_web'@'%' IDENTIFIED BY 'VyK4u;y;kX0J56';
-- GRANT ALL PRIVILEGES ON `architex_web`.* TO 'architex_web'@'localhost';
-- GRANT ALL PRIVILEGES ON `architex_web`.* TO 'architex_web'@'%';
-- FLUSH PRIVILEGES;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;