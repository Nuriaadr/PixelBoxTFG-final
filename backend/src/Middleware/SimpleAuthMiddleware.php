<?php

namespace App\Middleware;

use App\Models\Auth;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SimpleAuthMiddleware
{
    private Auth $authModel;

    public function __construct()
    {
        $this->authModel = new Auth();
    }

    public function __invoke(Request $request, $handler)
    {
        if (in_array($request->getMethod(), ['POST', 'PUT', 'DELETE', 'PATCH'])) {
            $body = $request->getParsedBody();

            if (!isset($body['username']) || !isset($body['password'])) {
                $response = new \Slim\Psr7\Response();
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Usuario y contraseña requeridos para esta acción'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401);
            }

            $username = trim($body['username']);
            $password = $body['password'];

            $user = $this->authModel->authenticate($username, $password);

            if (!$user) {
                $response = new \Slim\Psr7\Response();
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401);
            }

            //Verificar que sea admin para hacer las acciones de admin
            if ($user['role'] !== 'admin') {
                $response = new \Slim\Psr7\Response();
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'No tienes permisos para realizar esta acción'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(403);
            }

            $request = $request->withAttribute('user', $user);
        }

        return $handler->handle($request);
    }
}
