-- =====================================================
-- BASE DE DATOS PIXELBOX - Proyecto TFG
-- =====================================================


-- Crear base de datos
CREATE DATABASE IF NOT EXISTS pixelbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pixelbox;

-- =====================================================
-- TABLA: USUARIOS
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120)  NOT NULL,
    password VARCHAR(255) NOT NULL,
    description LONGTEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- =====================================================
-- TABLA: JUEGOS
-- =====================================================
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    developer VARCHAR(150),
    release_year INT,
    description LONGTEXT,
    cover_image_url VARCHAR(255),
    genre VARCHAR(100),
    platform VARCHAR(100),
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_developer (developer),
    INDEX idx_genre (genre),
    INDEX idx_platform (platform)
);

-- =====================================================
-- TABLA: BIBLIOTECA DEL USUARIO 
-- =====================================================
CREATE TABLE user_games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    status ENUM('pendiente', 'jugando', 'completado') DEFAULT 'pendiente',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_game (user_id, game_id),
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_status (status)
);

-- =====================================================
-- TABLA: FAVORITOS
-- =====================================================
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, game_id),
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id)
);

-- =====================================================
-- TABLA: RESEÑAS
-- =====================================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_game_review (user_id, game_id),
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLA: SEGUIDORES Y SEGUIDOS
-- =====================================================
CREATE TABLE followers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    CHECK (follower_id != following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
);

-- =====================================================
-- INSERTAR JUEGOS DE EJEMPLO
-- =====================================================
INSERT INTO games (title, developer, release_year, description, cover_image_url, genre, platform, average_rating) VALUES
('Legends of Eldoria', 'Epic Studios', 2024, 'Una epopeya de fantasía con un mundo abierto expansivo lleno de aventuras, misterios y personajes memorables.', '../img/img1.webp', 'RPG', 'PC', 4.8),
('Dragon Quest Online', 'Square Enix', 2023, 'Vive una aventura MMORPG en un mundo de dragones. Únete a otros jugadores en un viaje épico.', '../img/img2.webp', 'RPG', 'PC', 4.5),
('Velocity Racing', 'Midnight Racing', 2025, 'Las carreras más adrenalínicas del mundo de los videojuegos. Compite en diferentes pistas.', '../img/img4.webp', 'Acción', 'PlayStation', 4.3),
('Cyberpunk Chronicles', 'Neon Games', 2025, 'Sumérgete en una ciudad futurista donde la tecnología y la humanidad colisionan.', '../img/img4.webp', 'Acción', 'PC', 4.5),
('Nightmare Manor', 'Dark Souls Dev', 2024, 'Un juego de horror psicológico que te hará cuestionar la realidad.', '../img/space.webp', 'Terror', 'PC', 4.2),
('Stellar Odyssey', 'Cosmic Games', 2025, 'Explora galaxias desconocidas, combate amenazas alienígenas y descubre los secretos del universo.', '../img/img1.webp', 'RPG', 'Xbox', 4.3),
('Shadow Castle', 'Shadow Studios', 2024, 'Un metroidvania oscuro lleno de desafíos y secretos. Explora un castillo en ruinas.', '../img/puzzle.webp', 'Aventura', 'PC', 4.6),
('Pixel Warriors', 'Retro Games Inc', 2023, 'Batalla en un mundo pixelado retro lleno de acción y adrenalina.', '../img/zombie.webp', 'Acción', 'PC', 4.0);

-- =====================================================
-- INSERTAR USUARIOS DE EJEMPLO
-- =====================================================
-- Nota: Las contraseñas deben ser hasheadas en PHP
-- admin: password_hash('admin123', PASSWORD_BCRYPT)
-- jugador_pro: password_hash('password', PASSWORD_BCRYPT)

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@pixelbox.com', '$2y$10$example_hash_admin', 'admin'),
('jugador_pro', 'jugador@example.com', '$2y$10$example_hash_jugador', 'user'),
('luna_gamer', 'luna@example.com', '$2y$10$example_hash_luna', 'user');

-- =====================================================
-- INSERTAR BIBLIOTECA DE EJEMPLO
-- =====================================================
INSERT INTO user_games (user_id, game_id, status) VALUES
(2, 1, 'completado'),
(2, 2, 'jugando'),
(2, 3, 'pendiente'),
(2, 5, 'completado'),
(2, 6, 'jugando');

-- =====================================================
-- INSERTAR FAVORITOS DE EJEMPLO
-- =====================================================
INSERT INTO favorites (user_id, game_id) VALUES
(2, 1),
(2, 7),
(2, 4);

-- =====================================================
-- INSERTAR RESEÑAS DE EJEMPLO
-- =====================================================
INSERT INTO reviews (user_id, game_id, rating, content) VALUES
(2, 1, 5, 'Legends of Eldoria es simplemente increíble. El mundo es vasto, hermoso y lleno de cosas interesantes que descubrir. Los personajes son memorables y la historia te engancha desde el principio.'),
(2, 2, 4, 'Dragon Quest Online es muy divertido en equipo. La comunidad es amigable y hay mucho contenido. Mi única queja es que a veces hay lag.'),
(2, 5, 5, 'Nightmare Manor es horripilante. La atmósfera, la música y los gráficos se combinan para crear una experiencia verdaderamente aterradora.'),
(2, 6, 3, 'Stellar Odyssey tiene conceptos geniales y un mundo fascinante, pero algunas misiones se sienten repetitivas.');

-- =====================================================
-- INSERTAR SEGUIDORES DE EJEMPLO
-- =====================================================
INSERT INTO followers (follower_id, following_id) VALUES
(2, 3),
(3, 2);
