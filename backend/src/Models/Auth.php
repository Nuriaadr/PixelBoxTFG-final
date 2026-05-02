<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Auth
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Autenticar usuario con username y password
     */
    public function authenticate(string $username, string $password): array|false
    {
        try {
            $conn = $this->db->getConnection();

            // Solo buscar por username
            $stmt = $conn->prepare(
                "SELECT id, username, email, password, role, created_at, updated_at
             FROM users
             WHERE username = ?"
            );
            $stmt->execute([$username]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
           
            // Verificar contraseña con bcrypt
            if (!password_verify($password, $user['password'])) {
                return false;
            }

            unset($user['password']);
            return $user;
        } catch (PDOException $e) {
            throw new Exception("Error de autenticación: " . $e->getMessage());
        }
    }
}
