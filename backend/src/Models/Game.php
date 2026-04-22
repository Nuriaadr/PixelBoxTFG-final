<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Game
{
    private $db;

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
            $result = $this->db->query("SELECT * FROM games ORDER BY nombre ASC");
            return $result ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos: " . $e->getMessage());
        }
    }

    /**
     * Obtener juego por ID
     */
    public function getById($id)
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
    public function search($query)
    {
        try {
            $conn = $this->db->getConnection();
            $searchTerm = "%{$query}%";
            $stmt = $conn->prepare(
                "SELECT * FROM games 
                 WHERE nombre LIKE ? OR desarrollador LIKE ? OR genero LIKE ?
                 ORDER BY nombre ASC"
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
    public function getByGenre($genre)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games WHERE genero = ? ORDER BY nombre ASC");
            $stmt->execute([$genre]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos por género: " . $e->getMessage());
        }
    }

    /**
     * Filtrar juegos por plataforma
     */
    public function getByPlatform($platform)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM games WHERE plataforma = ? ORDER BY nombre ASC");
            $stmt->execute([$platform]);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo juegos por plataforma: " . $e->getMessage());
        }
    }

    /**
     * Crear nuevo juego
     */
    public function create($nombre, $año, $desarrollador, $descripcion, $genero, $plataforma, $rating, $imagen_url = null)
    {
        try {
            $conn = $this->db->getConnection();
            $stmt = $conn->prepare(
                "INSERT INTO games (nombre, año, desarrollador, descripcion, genero, plataforma, rating, imagen_url, fecha_creacion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())"
            );
            
            $stmt->execute([$nombre, $año, $desarrollador, $descripcion, $genero, $plataforma, $rating, $imagen_url]);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error creando juego: " . $e->getMessage());
        }
    }

    /**
     * Actualizar juego
     */
    public function update($id, $data)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Construir dinámicamente la query
            $fields = [];
            $values = [];
            
            $allowedFields = ['nombre', 'año', 'desarrollador', 'descripcion', 'genero', 'plataforma', 'rating', 'imagen_url'];
            
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
    public function delete($id)
    {
        try {
            $conn = $this->db->getConnection();
            
            // Primero eliminar referencias en otras tablas
            $conn->prepare("DELETE FROM reviews WHERE game_id = ?")->execute([$id]);
            $conn->prepare("DELETE FROM favorites WHERE game_id = ?")->execute([$id]);
            $conn->prepare("DELETE FROM user_library WHERE game_id = ?")->execute([$id]);
            
            // Luego eliminar el juego
            $stmt = $conn->prepare("DELETE FROM games WHERE id = ?");
            $result = $stmt->execute([$id]);
            
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
            $stmt = $conn->prepare("SELECT DISTINCT genero FROM games WHERE genero IS NOT NULL ORDER BY genero ASC");
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
            $stmt = $conn->prepare("SELECT DISTINCT plataforma FROM games WHERE plataforma IS NOT NULL ORDER BY plataforma ASC");
            $stmt->execute();
            $results = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            return $results ?: [];
        } catch (PDOException $e) {
            throw new Exception("Error obteniendo plataformas: " . $e->getMessage());
        }
    }

  
}
