<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Game
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todos los juegos
     */
    public function getAll()
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games ORDER BY title ASC");
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos: " . $e->getMessage());
        }
    }

    /**
     * Obtener juego por ID
     */
    public function getById(int $id)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juego: " . $e->getMessage());
        }
    }

    /**
     * Buscar juegos por nombre o desarrollador
     */
    public function search(string $query)
    {
        try {
            $conn = $this->db->getConnection();
            $searchTerm = "%{$query}%";
            $stmt = $conn->prepare(
                "SELECT * FROM games 
                 WHERE title LIKE ? OR developer LIKE ? OR genre LIKE ?
                 ORDER BY title ASC"
            );
            $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error buscando juegos: " . $e->getMessage());
        }
    }

    /**
     * Filtrar juegos por género
     */
    public function getByGenre(string $genre)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games WHERE genre = ? ORDER BY title ASC");
            $stmt->execute([$genre]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos por género: " . $e->getMessage());
        }
    }

    /**
     * Filtrar juegos por plataforma
     */
    public function getByPlatform(string $platform)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games WHERE platform = ? ORDER BY title ASC");
            $stmt->execute([$platform]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos por plataforma: " . $e->getMessage());
        }
    }

    /**
     * Crear nuevo juego
     */
    public function create(string $title, int $release_year, string $developer, string $description, string $genre, string $platform, float $average_rating, string $cover_image_url)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "INSERT INTO games (title, release_year, developer, description, genre, platform, average_rating, cover_image_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            );
            
            $stmt->execute([$title, $release_year, $developer, $description, $genre, $platform, $average_rating, $cover_image_url]);
            return $conn->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error creando juego: " . $e->getMessage());
        }
    }

    /**
     * Actualizar juego
     */
    public function update(int $id, array $data)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Construir dinámicamente la query
            $fields = [];
            $values = [];
            
            $allowedFields = ['title', 'release_year', 'developer', 'description', 'genre', 'platform', 'average_rating', 'cover_image_url'];
            
            foreach ($data as $key => $value) {
                if (in_array($key, $allowedFields)) {
                    $fields[] = "$key = ?";
                    $values[] = $value;
                }
            }
            
            if (empty($fields)) {
                throw new Exception("No hay campos válidos para actualizar");
            }
            
            $values[] = $id;
            $query = "UPDATE games SET " . implode(", ", $fields) . " WHERE id = ?";
            
            $stmt = $conn->prepare($query);
            $stmt->execute($values);
            
            return true;
        } catch (PDOException $e) {
            throw new Exception("Error actualizando juego: " . $e->getMessage());
        }
    }

    /**
     * Eliminar juego
     */
    public function delete(int $id)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Primero eliminar referencias en otras tablas (cascadas)
            $conn->prepare("DELETE FROM reviews WHERE game_id = ?")->execute([$id]);
            $conn->prepare("DELETE FROM favorites WHERE game_id = ?")->execute([$id]);
            $conn->prepare("DELETE FROM user_games WHERE game_id = ?")->execute([$id]);
            
            // Luego eliminar el juego
            $stmt = $conn->prepare("DELETE FROM games WHERE id = ?");
            $stmt->execute([$id]);
            
            return true;
        } catch (PDOException $e) {
            throw new Exception("Error eliminando juego: " . $e->getMessage());
        }
    }

    /**
     * Obtener géneros disponibles
     */
    public function getGenres()
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT DISTINCT genre FROM games WHERE genre IS NOT NULL ORDER BY genre ASC");
            $stmt->execute();
            $results = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            return $results ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo géneros: " . $e->getMessage());
        }
    }

    /**
     * Obtener plataformas disponibles
     */
    public function getPlatforms()
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT DISTINCT platform FROM games WHERE platform IS NOT NULL ORDER BY platform ASC");
            $stmt->execute();
            $results = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            return $results ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo plataformas: " . $e->getMessage());
        }
    }
}
