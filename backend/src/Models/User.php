<?php

/**
 * User Model
 * Maneja toda la lógica de usuarios
 */

namespace App\Models;

use App\Utils\Database;

class User
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Obtener todos los usuarios
     */
    public function getAll()
    {
        $sql = "SELECT id, username, email, role, description, created_at FROM users";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    /**
     * Obtener usuario por ID
     */
    public function getById(int $id)
    {
        $sql = "SELECT id, username, email, role, description, created_at, updated_at FROM users WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    /**
     * Obtener usuario por username
     */
    public function getByUsername(string $username)
    {
        $sql = "SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE username = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$username]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    /**
     * Crear nuevo usuario
     */
    public function create(array $data)
    {
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        $email = "{$data['username']}@pixelbox.com"; // Generar email ficticio basado en el username

        if (!$username || !$password) {
            return false;
        }

        //comprobar que el usuario no exista ya 
        if ($this->getByUsername($username)) {
            return false; //si el usuario ya existe, no se puede crear
        } else {

            // Hash del password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$username, $email, $hashedPassword]);
        }
    }

    /**
     * Actualizar usuario
     */
    public function update(int $id, array $data)
    {
        $fields = [];
        $values = [];
        $allowedFields = ['description']; // en nuestro proyecto solo permitimos actualizar la descripción, pero se pueden agregar más campos si se quiere en un futuro, de ahi el array

        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $values[] = $id;
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($values);
    }

    /*Eliminar un usuario */
    public function delete(int $id)
    {
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }

    /**
     * Obtener seguidores de un usuario
     */
    public function getFollowers(int $userId)
    {
        $sql = "SELECT users.id, users.username, users.email, users.role, users.description
            FROM followers
            INNER JOIN users ON followers.follower_id = users.id
            WHERE followers.following_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getFollowing(int $userId)
    {
        $sql = "SELECT users.id, users.username, users.email, users.role, users.description
            FROM followers
            INNER JOIN users ON followers.following_id = users.id
            WHERE followers.follower_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Verificar si un usuario sigue a otro
     */
    public function isFollowing(int $followerId, int $followingId)
    {
        $sql = "SELECT id FROM followers WHERE follower_id = ? AND following_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$followerId, $followingId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC) !== false;
    }

    /**
     * Agregar seguidor
     */
    public function follow(int $followerId, int $followingId)
    {
        // Validar que no se intente seguir a uno mismo
        if ($followerId === $followingId) {
            return false;
        }

        if ($this->isFollowing($followerId, $followingId)) {
            return false;
        }
        $sql = "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$followerId, $followingId]);
    }

    /**
     * Dejar de seguir
     */
    public function unfollow(int $followerId, int $followingId)
    {
        $sql = "DELETE FROM followers WHERE follower_id = ? AND following_id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$followerId, $followingId]);
    }

    /**
     * Obtener estadísticas del usuario
     */
    public function getStats(int $userId)
    {
        $sql = "SELECT 
                    COUNT(DISTINCT user_games.game_id) as total_games,
                    SUM(CASE WHEN user_games.status = 'completado' THEN 1 ELSE 0 END) as completed_games,
                    SUM(CASE WHEN user_games.status = 'jugando' THEN 1 ELSE 0 END) as playing_games,
                    SUM(CASE WHEN user_games.status = 'pendiente' THEN 1 ELSE 0 END) as pending_games
                FROM user_games
                WHERE user_games.user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    
}
