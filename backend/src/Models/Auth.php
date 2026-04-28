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

            // Buscar usuario por user
            $stmt = $conn->prepare(
                "SELECT id, username, email, password, role, created_at, updated_at
                 FROM users
                 WHERE username = ?"
            );
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                return false;
            }

            // Verificar contraseña (usando password_verify si está hasheada, sino comparar directamente)
            $isValidPassword = false;
            if (password_needs_rehash($user['password'], PASSWORD_BCRYPT)) {
                // Si el password está hasheado con bcrypt, usar password_verify
                $isValidPassword = password_verify($password, $user['password']);
            } else {
                // Si no está hasheado, comparar directamente (para datos de prueba)
                $isValidPassword = $user['password'] === $password || password_verify($password, $user['password']);
            }

            if (!$isValidPassword) {
                return false;
            }

            // Remover password de la respuesta
            unset($user['password']);

            return $user;

        } catch (PDOException $e) {
            throw new Exception(" error de autenticación: " . $e->getMessage());
        }
    }

}
