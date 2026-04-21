<?php

namespace App\Models;
use App\Utils\Database;
use PDOException;

class Review
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todas las reseñas de un juego
     */
    public function getByGame($gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT r.*, u.username, u.avatar_url
                 FROM reviews r
                 JOIN users u ON r.user_id = u.id
                 WHERE r.game_id = ?
                 ORDER BY r.fecha DESC"
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
    public function getUserReviewForGame($userId, $gameId)
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
            throw new Exception("Error obteniendo la reseña del jugador:" . $e->getMessage());
        }
    }

  
    /**
     * Crear reseña
     */
    public function create($gameId, $userId, $rating, $comentario = null, $es_spoiler = false)
    {
        try {
            $conn = $this->db->getConnection();

            // Verificar que el usuario tenga el juego en su biblioteca
            $stmt = $conn->prepare(
                "SELECT id FROM user_library WHERE user_id = ? AND game_id = ?"
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

            // Crear reseña
            $stmt = $conn->prepare(
                "INSERT INTO reviews (game_id, user_id, rating, comentario, es_spoiler, fecha, ayudas_utiles)
                 VALUES (?, ?, ?, ?, ?, NOW(), 0)"
            );

            $stmt->execute([$gameId, $userId, $rating, $comentario, $es_spoiler ? 1 : 0]);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error creating review: " . $e->getMessage());
        } catch (\Exception $e) {
            throw $e;
        }
    }

}
