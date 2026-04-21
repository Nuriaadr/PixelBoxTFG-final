<?php

namespace App\Controllers;

use App\Models\Auth;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    private $authModel;

    public function __construct()
    {
        $this->authModel = new Auth();
    }

    /**
     * POST /api/auth/login - Login simple
     * Solo @jugador_pro y @admin pueden loguearse
     */
    public function login(Request $request, Response $response)
    {
        try {
            $body = $request->getParsedBody();

            if (!isset($body['username']) || !isset($body['password'])) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Nombre de usuario y contraseña requeridos'
                    ]));
            }

            $username = trim($body['username']);
            $password = $body['password'];

            // Solo 2 usuarios pueden loguearse
            if (!in_array($username, ['@jugador_pro', '@admin'])) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(403)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Acceso denegado'
                    ]));
            }

            // Verificar credenciales
            $user = $this->authModel->authenticate($username, $password);

            if (!$user) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Credenciales inválidas'
                    ]));
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'rol' => $user['rol']
                    ]
                ]));

        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => 'Error: ' . $e->getMessage()
                ]));
        }
    }

    /**
     * POST /api/auth/verify - Verificar credenciales
     * Para usar en cada request del frontend
     */
    public function verify(Request $request, Response $response)
    {
        try {
            $body = $request->getParsedBody();

            if (!isset($body['username']) || !isset($body['password'])) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Usuario y contraseña requeridos'
                    ]));
            }

            $username = trim($body['username']);
            $password = $body['password'];

            // Verificar credenciales
            $user = $this->authModel->authenticate($username, $password);

            if (!$user) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Invalid credentials'
                    ]));
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'rol' => $user['rol']
                    ]
                ]));

        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => 'Error: ' . $e->getMessage()
                ]));
        }
    }
}
