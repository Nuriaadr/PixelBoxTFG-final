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
     * POST /api/auth/login
     * Solo @jugador_pro y @admin pueden loguearse en nuestra app pero bueno, el login es necesario para obtener el id del usuario y su rol, 
     * que se necesitan para otras funcionalidades como seguir o dejar de seguir
     * agregar juegos a la biblioteca, etc.
     */
    public function login(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();

            if (!isset($body['username']) || !isset($body['password'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Nombre de usuario y contraseña requeridos',
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $username = trim($body['username']);
            $password = $body['password'];

            $user = $this->authModel->authenticate($username, $password);

            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Credenciales inválidas',
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Login hecho',
                'user'    => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                    'email'    => $user['email'],
                    'role'     => $user['role'], 
                ],
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    /**
     * POST /api/auth/verify
     * realmente se usa esta ruta? no se si es necesaria, pero bueno, la dejo por si acaso, que ya llevo mucho tiempo aqui sentada
     * y empiezo a delirar, aunque podria ser util la funcion supongo para verificar las credenciales antes de realizar alguna accion
     */
    public function verify(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();

            if (!isset($body['username']) || !isset($body['password'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Usuario y contraseña requeridos',
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $username = trim($body['username']);
            $password = $body['password'];

            $user = $this->authModel->authenticate($username, $password);

            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Credenciales invalidas',
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'user'    => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                    'email'    => $user['email'],
                    'role'      => $user['role'],
                ],
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
