<?php

namespace App\Models;

use App\Utils\Database;
use Exception;
use PDOException;

class Auth
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * 
     * Solo @jugador_pro y @admin pueden loguearse
     */
    public function authenticate($username, $password)
    {
        try {
            $conn = $this->db->getConnection();

            // Solo permitir login de 2 usuarios específicos
            if (!in_array($username, ['@jugador_pro', '@admin'])) {
                return false;
            }

            // Buscar usuario
            $stmt = $conn->prepare(
                "SELECT id, username, email, password_hash, rol
                 FROM users
                 WHERE username = ? AND is_active = TRUE"
            );
            $stmt->execute([$username]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                return false;
            }

            // Verificar contraseña
            if (!password_verify($password, $user['password_hash'])) {
                return false;
            }

            // Remover password_hash de la respuesta
            unset($user['password_hash']);

            return $user;

        } catch (PDOException $e) {
            throw new Exception("Authentication error: " . $e->getMessage());
        }
    }

    /**
     * Verificar si usuario puede hacer login
     */
    public function canLogin($username)
    {
        return in_array($username, ['@jugador_pro', '@admin']);
    }
}
