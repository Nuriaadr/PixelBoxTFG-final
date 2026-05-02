<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Favorite
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todos los favoritos del usuario
     */
    public function getByUser( int $userId)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT games.*, favorites.user_id
                 FROM favorites
                 JOIN games ON favorites.game_id = games.id
                 WHERE favorites.user_id = ?
                 ORDER BY games.title ASC"
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
    public function isFavorite(int $userId, int $gameId): bool
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
    public function add(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();

            //Verificar que el juego existe
            $stmt = $conn->prepare("SELECT id FROM games WHERE id = ?");
            $stmt->execute([$gameId]);
            if (!$stmt->fetch()) {
                throw new Exception("Juego no encontrado");
            }

            //Verificar que no es ya favorito
            if ($this->isFavorite($userId, $gameId)) {
                throw new Exception("El juego ya está en favoritos");
            }

            //Agregar favorito
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
    public function remove(int $userId, int $gameId)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Verificar que es favorito
            if (!$this->isFavorite($userId, $gameId)) {
                throw new Exception("El juego no está en favoritos");
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
    public function getCount(int $userId): int
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "SELECT COUNT(*) as count FROM favorites WHERE user_id = ?"
            );
            $stmt->execute([$userId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return (int)($result['count'] ?? 0);
        } catch (PDOException $e) {
            throw new Exception("Error contando favoritos: " . $e->getMessage());
        }
    }
}
