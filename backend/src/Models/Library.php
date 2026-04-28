<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Library
{
    private Database $db;
    private array $validStates = ['jugando', 'completado', 'pendiente', 'abandonado'];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener biblioteca completa del usuario con información de juegos
     */
    public function getByUser(int $userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ug.*, g.title, g.cover_image_url, g.developer, g.genre, g.platform, g.average_rating
                 FROM user_games ug
                 JOIN games g ON ug.game_id = g.id
                 WHERE ug.user_id = ?
                 ORDER BY ug.added_at DESC"
            );
            $stmt->execute([$userId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo la biblioteca del usuario: " . $e->getMessage());
        }
    }

    /**
     * Obtener juegos en biblioteca filtrados por estado
     */
    public function getByState(int $userId, string $estado)
    {
        try {
            if (!in_array($estado, $this->validStates)) {
                throw new Exception("Estado de juego inválido: $estado");
            }

            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ug.*, g.title, g.cover_image_url, g.developer, g.genre, g.platform, g.average_rating
                 FROM user_games ug
                 JOIN games g ON ug.game_id = g.id
                 WHERE ug.user_id = ? AND ug.status = ?
                 ORDER BY ug.added_at DESC"
            );
            $stmt->execute([$userId, $estado]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo la biblioteca por estado: " . $e->getMessage());
        }
    }

    /**
     * Obtener estadísticas de biblioteca del usuario
     */
    public function getStats(int $userId)
    {
        try {
            $conn = $this->db->getConnection();
            $statsQuery = "SELECT 
                           COUNT(*) as total,
                           SUM(CASE WHEN status = 'jugando' THEN 1 ELSE 0 END) as playing,
                           SUM(CASE WHEN status = 'completado' THEN 1 ELSE 0 END) as completed,
                           SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END) as pending,
                           SUM(CASE WHEN status = 'abandonado' THEN 1 ELSE 0 END) as abandoned
                           FROM user_games
                           WHERE user_id = ?";
            
            $stmt = $conn->prepare($statsQuery);
            $stmt->execute([$userId]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo estadísticas de la biblioteca: " . $e->getMessage());
        }
    }

    /**
     * Obtener entrada de biblioteca específica
     */
    public function getEntry(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ug.*, g.title, g.cover_image_url, g.developer, g.genre, g.platform, g.average_rating
                 FROM user_games ug
                 JOIN games g ON ug.game_id = g.id
                 WHERE ug.user_id = ? AND ug.game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo entrada de biblioteca: " . $e->getMessage());
        }
    }

    /**
     * Agregar juego a biblioteca
     */
    public function add(int $userId, int $gameId, string $status = 'pendiente')
    {
        try {
            if (!in_array($status, $this->validStates)) {
                throw new Exception("Estado de juego inválido: $status");
            }

            $conn = $this->db->getConnection();

            // Verificar que el juego existe
            $stmt = $conn->prepare("SELECT id FROM games WHERE id = ?");
            $stmt->execute([$gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Juego no encontrado");
            }

            // Verificar que el juego no está ya en la biblioteca
            $stmt = $conn->prepare(
                "SELECT id FROM user_games WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            if ($stmt->fetch()) {
                throw new Exception("El juego ya está en la biblioteca");
            }

            // Agregar juego
            $stmt = $conn->prepare(
                "INSERT INTO user_games (user_id, game_id, status)
                 VALUES (?, ?, ?)"
            );
            $stmt->execute([$userId, $gameId, $status]);

            return $conn->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error agregando juego a la biblioteca: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualizar estado del juego en biblioteca
     */
    public function updateStatus(int $userId, int $gameId, string $status)
    {
        try {
            if (!in_array($status, $this->validStates)) {
                throw new Exception("Estado de juego inválido: $status");
            }

            $conn = $this->db->getConnection();

            // Verificar que existe
            $stmt = $conn->prepare(
                "SELECT id FROM user_games WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Juego no encontrado en la biblioteca");
            }

            $stmt = $conn->prepare(
                "UPDATE user_games SET status = ? WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$status, $userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error actualizando estado del juego: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar juego de biblioteca
     */
    public function remove(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();

            // Primero eliminar reseñas asociadas
            $stmt = $conn->prepare(
                "DELETE FROM reviews WHERE game_id = ? AND user_id = ?"
            );
            $stmt->execute([$gameId, $userId]);

            // Luego eliminar de favoritos
            $stmt = $conn->prepare(
                "DELETE FROM favorites WHERE game_id = ? AND user_id = ?"
            );
            $stmt->execute([$gameId, $userId]);

            // Finalmente eliminar de biblioteca
            $stmt = $conn->prepare(
                "DELETE FROM user_games WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error eliminando juego de la biblioteca: " . $e->getMessage());
        }
    }

    /**
     * Verificar si usuario tiene juego en biblioteca
     */
    public function hasGame(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT id FROM user_games WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            return (bool)$stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo entrada de biblioteca: " . $e->getMessage());
        }
    }
}
