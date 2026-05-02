-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 30-04-2026 a las 10:27:19
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pixelbox`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_favorite` (`user_id`,`game_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_game_id` (`game_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `game_id`, `added_at`) VALUES
(24, 2, 7, '2026-04-29 07:24:42'),
(26, 2, 8, '2026-04-29 07:32:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `followers`
--

DROP TABLE IF EXISTS `followers`;
CREATE TABLE IF NOT EXISTS `followers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_follow` (`follower_id`,`following_id`),
  KEY `idx_follower` (`follower_id`),
  KEY `idx_following` (`following_id`)
) ;

--
-- Volcado de datos para la tabla `followers`
--

INSERT INTO `followers` (`id`, `follower_id`, `following_id`, `created_at`) VALUES
(5, 2, 3, '2026-04-30 07:17:08'),
(2, 3, 2, '2026-04-28 08:29:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `developer` varchar(150) DEFAULT NULL,
  `release_year` int DEFAULT NULL,
  `description` longtext,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `idx_title` (`title`(100)),
  KEY `idx_developer` (`developer`(100)),
  KEY `idx_genre` (`genre`),
  KEY `idx_platform` (`platform`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `games`
--

INSERT INTO `games` (`id`, `title`, `developer`, `release_year`, `description`, `cover_image_url`, `genre`, `platform`, `average_rating`, `created_at`, `updated_at`) VALUES
(2, 'Dragon Quest Online', 'Square Enix', 2023, 'Vive una aventura MMORPG en un mundo de dragones. Únete a otros jugadores en un viaje épico.', '../img/img2.webp', 'RPG', 'PC', 4.50, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(3, 'Velocity Racing', 'Midnight Racing', 2025, 'Las carreras más adrenalínicas del mundo de los videojuegos. Compite en diferentes pistas.', '../img/img4.webp', 'Acción', 'PlayStation', 4.30, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(4, 'Cyberpunk Chronicles', 'Neon Games', 2025, 'Sumérgete en una ciudad futurista donde la tecnología y la humanidad colisionan.', '../img/img4.webp', 'Acción', 'PC', 4.50, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(5, 'Nightmare Manor', 'Dark Souls Dev', 2024, 'Un juego de horror psicológico que te hará cuestionar la realidad.', '../img/space.webp', 'Terror', 'PC', 4.20, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(6, 'Stellar Odyssey', 'Cosmic Games', 2025, 'Explora galaxias desconocidas, combate amenazas alienígenas y descubre los secretos del universo.', '../img/img1.webp', 'RPG', 'Xbox', 4.30, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(7, 'Shadow Castle', 'Shadow Studios', 2024, 'Un metroidvania oscuro lleno de desafíos y secretos. Explora un castillo en ruinas.', '../img/puzzle.webp', 'Aventura', 'PC', 4.60, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(8, 'Pixel Warriors', 'Retro Games Inc', 2023, 'Batalla en un mundo pixelado retro lleno de acción y adrenalina.', '../img/zombie.webp', 'Acción', 'PC', 4.00, '2026-04-28 08:29:33', '2026-04-28 08:29:33'),
(10, 'PHP Y SUS PENURIAS', 'nURIA', 2026, 'hOLA NO ENTIENDO PORQUE EL MIDDLEWARE NO VAAAAAAAAA (UPDATE YA FUNICONA JIJIJIJ)', '../img/img1.webp', 'AYUDA', 'AYUDA', 1.00, '2026-04-30 06:32:51', '2026-04-30 06:33:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `rating` int NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_game_review` (`user_id`,`game_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_game_id` (`game_id`),
  KEY `idx_rating` (`rating`),
  KEY `idx_created_at` (`created_at`)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `description`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@pixelbox.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Por favor no elimineis este usuario :(', 'admin', '2026-04-28 08:29:33', '2026-04-30 06:52:18'),
(2, 'jugador_pro', 'jugador@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hola soy jugador', 'user', '2026-04-28 08:29:33', '2026-04-30 07:29:11'),
(3, 'luna_gamer', 'luna@example.com', '$2y$10$example_hash_luna', 'buenas buenas buenas', 'user', '2026-04-28 08:29:33', '2026-04-29 07:39:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_games`
--

DROP TABLE IF EXISTS `user_games`;
CREATE TABLE IF NOT EXISTS `user_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `status` enum('pendiente','jugando','completado','abandonado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_game` (`user_id`,`game_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_game_id` (`game_id`),
  KEY `idx_status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_games`
--

INSERT INTO `user_games` (`id`, `user_id`, `game_id`, `status`, `added_at`, `updated_at`) VALUES
(27, 2, 6, 'completado', '2026-04-30 07:17:48', '2026-04-30 07:17:50'),
(26, 2, 8, 'jugando', '2026-04-29 07:32:06', '2026-04-29 07:32:07'),
(28, 2, 4, 'jugando', '2026-04-30 07:18:19', '2026-04-30 07:18:19'),
(23, 2, 7, 'completado', '2026-04-29 07:24:37', '2026-04-30 10:03:16'),
(24, 2, 3, 'completado', '2026-04-29 07:26:25', '2026-04-29 07:26:26');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
