<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Review
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todas las reseñas de un juego
     */
    public function getByGame(int $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT r.*, u.username, u.email
                 FROM reviews r
                 JOIN users u ON r.user_id = u.id
                 WHERE r.game_id = ?
                 ORDER BY r.created_at DESC"
            );
            $stmt->execute([$gameId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo reseñas: " . $e->getMessage());
        }
    }

    /**
     * Obtener reseña del usuario para un juego
     */
    public function getUserReviewForGame(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT * FROM reviews 
                 WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo la reseña del jugador: " . $e->getMessage());
        }
    }

    /**
     * Obtener todas las reseñas de un usuario
     */
    public function getByUser(int $userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT r.*, g.title, g.cover_image_url
                 FROM reviews r
                 JOIN games g ON r.game_id = g.id
                 WHERE r.user_id = ?
                 ORDER BY r.created_at DESC"
            );
            $stmt->execute([$userId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo reseñas del usuario: " . $e->getMessage());
        }
    }

    /**
     * Crear reseña
     */
    public function create(int $gameId, int $userId, int $rating, string $content)
    {
        try {
            $conn = $this->db->getConnection();

            // Verificar que el usuario tenga el juego en su biblioteca
            $stmt = $conn->prepare(
                "SELECT id FROM user_games WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);

            if (!$stmt->fetch()) {
                throw new Exception("El usuario no tiene este juego en su biblioteca");
            }

            // Verificar si ya existe reseña
            $existingReview = $this->getUserReviewForGame($userId, $gameId);
            if ($existingReview) {
                throw new Exception("El usuario ya tiene una reseña para este juego");
            }

            // Validar rating
            if ($rating < 1 || $rating > 5) {
                throw new Exception("El rating debe estar entre 1 y 5");
            }

            // Crear reseña
            $stmt = $conn->prepare(
                "INSERT INTO reviews (user_id, game_id, rating, content)
                 VALUES (?, ?, ?, ?)"
            );

            $stmt->execute([$userId, $gameId, $rating, $content]);
            return $conn->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error creando reseña: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }
   
}
