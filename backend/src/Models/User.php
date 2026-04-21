<?php
/**
 * User Model
 * Maneja toda la lógica de usuarios
 */

namespace App\Models;

use App\Utils\Database;

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Obtener todos los usuarios
     */
    public function getAll() {
        $sql = "SELECT id, username, rol, avatar_url, bio, created_at FROM users WHERE is_active = true";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Obtener usuario por ID
     */
    public function getById($id) {
        $sql = "SELECT id, username, rol, avatar_url, bio, created_at FROM users WHERE id = ? AND is_active = true";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

 
    /**
     * Crear nuevo usuario
     */
    public function create($username, $email, $passwordHash, $avatarUrl = null, $bio = null) {
        $sql = "INSERT INTO users (username, email, password_hash, avatar_url, bio) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$username, $email, $passwordHash, $avatarUrl, $bio]);
    }

    /**
     * Actualizar usuario
     */
    public function update($id, $avatarUrl, $bio) {
        $sql = "UPDATE users SET avatar_url = ?, bio = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$avatarUrl, $bio, $id]);
    }

    /**
     * Obtener seguidores de un usuario
     */
    public function getFollowers($userId) {
        $sql = "SELECT u.id, u.username, u.avatar_url, u.bio 
                FROM followers f
                INNER JOIN users u ON f.follower_user_id = u.id
                WHERE f.following_user_id = ? AND u.is_active = true";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Obtener usuarios que está siguiendo
     */
    public function getFollowing($userId) {
        $sql = "SELECT u.id, u.username, u.avatar_url, u.bio
                FROM followers f
                INNER JOIN users u ON f.following_user_id = u.id
                WHERE f.follower_user_id = ? AND u.is_active = true";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Verificar si un usuario sigue a otro
     */
    public function isFollowing($followerId, $followingId) {
        $sql = "SELECT id FROM followers WHERE follower_user_id = ? AND following_user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$followerId, $followingId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC) !== false;
    }

    /**
     * Agregar seguidor
     */
    public function follow($followerId, $followingId) {
        if ($this->isFollowing($followerId, $followingId)) {
            return false;
        }
        $sql = "INSERT INTO followers (follower_user_id, following_user_id) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$followerId, $followingId]);
    }

    /**
     * Dejar de seguir
     */
    public function unfollow($followerId, $followingId) {
        $sql = "DELETE FROM followers WHERE follower_user_id = ? AND following_user_id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$followerId, $followingId]);
    }

    /**
     * Obtener estadísticas del usuario
     */
    public function getStats($userId) {
        $sql = "SELECT 
                    COUNT(DISTINCT ul.game_id) as total_games,
                    SUM(CASE WHEN ul.estado = 'completado' THEN 1 ELSE 0 END) as completed_games,
                    SUM(CASE WHEN ul.estado = 'jugando' THEN 1 ELSE 0 END) as playing_games,
                    SUM(CASE WHEN ul.estado = 'pendiente' THEN 1 ELSE 0 END) as pending_games
                FROM user_library ul
                WHERE ul.user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}
