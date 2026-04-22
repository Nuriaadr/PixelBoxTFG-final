<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Library
{
    private $db;
    private $validStates = ['jugando', 'completado', 'pendiente', 'abandonado'];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener biblioteca completa del usuario con información de juegos
     */
    public function getByUser($userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ul.*, g.nombre, g.imagen_url, g.desarrollador, g.genero, g.plataforma, g.rating
                 FROM user_library ul
                 JOIN games g ON ul.game_id = g.id
                 WHERE ul.user_id = ?
                 ORDER BY ul.fecha_agregado DESC"
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
    public function getByState($userId, $estado)
    {
        try {
            if (!in_array($estado, $this->validStates)) {
                throw new Exception("Estado de juego inválido: $estado");
            }

            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ul.*, g.nombre, g.imagen_url, g.desarrollador, g.genero, g.plataforma, g.rating
                 FROM user_library ul
                 JOIN games g ON ul.game_id = g.id
                 WHERE ul.user_id = ? AND ul.estado = ?
                 ORDER BY ul.fecha_agregado DESC"
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
    public function getStats($userId)
    {
        try {
            $conn = $this->db->getConnection();
            $statsQuery = "SELECT 
                           COUNT(*) as total,
                           SUM(CASE WHEN estado = 'jugando' THEN 1 ELSE 0 END) as playing,
                           SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completed,
                           SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pending,
                           SUM(CASE WHEN estado = 'abandonado' THEN 1 ELSE 0 END) as abandoned,
                           AVG(COALESCE(calificacion_personal, 0)) as average_rating
                           FROM user_library
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
    public function getEntry($userId, $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT ul.*, g.nombre, g.imagen_url, g.desarrollador, g.genero, g.plataforma, g.rating
                 FROM user_library ul
                 JOIN games g ON ul.game_id = g.id
                 WHERE ul.user_id = ? AND ul.game_id = ?"
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
    public function add($userId, $gameId, $estado = 'pendiente')
    {
        try {
            if (!in_array($estado, $this->validStates)) {
                throw new Exception("Invalid game state: $estado");
            }

            $conn = $this->db->getConnection();

            // Verificar que el juego existe
            $stmt = $conn->prepare("SELECT id FROM games WHERE id = ?");
            $stmt->execute([$gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Game not found");
            }

            // Verificar que el juego no está ya en la biblioteca
            $stmt = $conn->prepare(
                "SELECT id FROM user_library WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            if ($stmt->fetch()) {
                throw new Exception("Game already in user library");
            }

            // Agregar juego
            $stmt = $conn->prepare(
                "INSERT INTO user_library (user_id, game_id, estado, fecha_agregado, horas_jugadas)
                 VALUES (?, ?, ?, NOW(), 0)"
            );
            $stmt->execute([$userId, $gameId, $estado]);

            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error agregando juego a la biblioteca: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualizar estado del juego en biblioteca
     */
    public function updateStatus($userId, $gameId, $estado)
    {
        try {
            if (!in_array($estado, $this->validStates)) {
                throw new Exception("Invalid game state: $estado");
            }

            $conn = $this->db->getConnection();

            // Verificar que existe
            $stmt = $conn->prepare(
                "SELECT id FROM user_library WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Game not in user library");
            }


            $query = "UPDATE user_library SET estado = ?";
            $params = [$estado];

            if ($estado === 'completado') {
                $query .= ", fecha_completado = NOW()";
            }

            $query .= " WHERE user_id = ? AND game_id = ?";
            $params[] = $userId;
            $params[] = $gameId;

            $stmt = $conn->prepare($query);
            $stmt->execute($params);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error actualizando estado del juego: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }

  
    /**
     * Actualizar calificación personal
     */
    public function updateRating($userId, $gameId, $rating)
    {
        try {
            // Validar rating
            if ($rating !== null && ($rating < 1 || $rating > 5)) {
                throw new Exception("La calificación debe estar entre 1 y 5");
            }

            $conn = $this->db->getConnection();

            $stmt = $conn->prepare(
                "UPDATE user_library SET calificacion_personal = ? 
                 WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$rating, $userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error cambiando calificación del juego: " . $e->getMessage());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar juego de biblioteca
     */
    public function remove($userId, $gameId)
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
                "DELETE FROM user_library WHERE user_id = ? AND game_id = ?"
            );
            $result = $stmt->execute([$userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error eliminando juego de la biblioteca: " . $e->getMessage());
        }
    }

    /**
     * Verificar si usuario tiene juego en biblioteca
     */
    public function hasGame($userId, $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT id FROM user_library WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            return (bool)$stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo entrada de biblioteca: " . $e->getMessage());
        }
    }

}
