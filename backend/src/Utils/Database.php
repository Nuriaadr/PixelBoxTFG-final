<?php
/**
 * 
 * Maneja la conexión a la base de datos
 */

namespace App\Utils;
use PDO;
use PDOException;

class Database {
    private PDO $pdo;
    private static $instance = null;

    private function __construct() {
        try {
            //si no le enviamos parametros porel .env usamos estos por defecto que son los locales
            $host = $_ENV['DB_HOST'] ?? 'localhost';
            $dbname = $_ENV['DB_NAME'] ?? 'pixelbox';
            $user = $_ENV['DB_USER'] ?? 'root';
            $password = $_ENV['DB_PASSWORD'] ?? '';
            $port = $_ENV['DB_PORT'] ?? '3306';

            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            
            $this->pdo = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            die('Error de conexión a BD: ' . $e->getMessage());
        }
    }

   
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    
    public function getConnection() {
        return $this->pdo;
    }

    /**
     * Ejecutar query SELECT
     */
    public function query(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Ejecutar query que devuelve un solo resultado
     */
    public function queryOne(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    /**
     * Ejecutar query INSERT/UPDATE/DELETE
     */
    public function execute(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Obtener último ID insertado para que se pueda usar en los insert de las tablas
     */
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
}
