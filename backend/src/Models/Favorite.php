<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Favorite
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todos los favoritos del usuario
     */
    public function getByUser($userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT g.*, f.user_id
                 FROM favorites f
                 JOIN games g ON f.game_id = g.id
                 WHERE f.user_id = ?
                 ORDER BY g.nombre ASC"
            );
            $stmt->execute([$userId]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo favoritos: " . $e->getMessage());
        }
    }

    /**
     * Verificar si juego es favorito
     */
    public function isFavorite($userId, $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT id FROM favorites WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);
            return (bool)$stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Error comprobando favorito: " . $e->getMessage());
        }
    }

    /**
     * Agregar favorito
     */
    public function add($userId, $gameId)
    {
        try {
            $conn = $this->db->getConnection();

            // Verificar que el juego existe
            $stmt = $conn->prepare("SELECT id FROM games WHERE id = ?");
            $stmt->execute([$gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Game not found");
            }

            // Verificar que no es ya favorito
            if ($this->isFavorite($userId, $gameId)) {
                throw new Exception("Game already in favorites");
            }

            // Agregar favorito
            $stmt = $conn->prepare(
                "INSERT INTO favorites (user_id, game_id) VALUES (?, ?)"
            );
            $stmt->execute([$userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error agregando favorito: " . $e->getMessage());
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar favorito
     */
    public function remove($userId, $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Verificar que es favorito
            if (!$this->isFavorite($userId, $gameId)) {
                throw new Exception("Game is not in favorites");
            }

            $stmt = $conn->prepare(
                "DELETE FROM favorites WHERE user_id = ? AND game_id = ?"
            );
            $stmt->execute([$userId, $gameId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("Error eliminando favorito: " . $e->getMessage());
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener cantidad de favoritos del usuario
     */
    public function getCount($userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT COUNT(*) as count FROM favorites WHERE user_id = ?"
            );
            $stmt->execute([$userId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        } catch (PDOException $e) {
            throw new Exception("Error contando favoritos: " . $e->getMessage());
        }
    }


}
