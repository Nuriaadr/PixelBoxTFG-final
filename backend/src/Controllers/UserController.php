<?php
/**
 * User Controller
 * Maneja requests relacionadas con usuarios
 */

namespace App\Controllers;

use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    /**
     * GET /api/users
     * Obtener todos los usuarios
     */
    public function getAll(Request $request, Response $response) {
        try {
            $users = $this->userModel->getAll();
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => true,
                    'data' => $users
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }

    /**
     * GET /api/users/{id}
     * Obtener usuario por ID
     */
    public function getById(Request $request, Response $response, array $args) {
        try {
            $user = $this->userModel->getById($args['id']);
            if (!$user) {
                return $response
                    ->withStatus(404)
                    ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                        'success' => false,
                        'error' => 'Usuario no encontrado'
                    ])));
            }
            return $response
                ->withStatus(200)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => true,
                    'data' => $user
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }

    /**
     * GET /api/users/{id}/followers
     * Obtener seguidores de un usuario
     */
    public function getFollowers(Request $request, Response $response, array $args) {
        try {
            $followers = $this->userModel->getFollowers($args['id']);
            return $response
                ->withStatus(200)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => true,
                    'data' => $followers,
                    'count' => count($followers)
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }

    /**
     * GET /api/users/{id}/following
     * Obtener usuarios que está siguiendo
     */
    public function getFollowing(Request $request, Response $response, array $args) {
        try {
            $following = $this->userModel->getFollowing($args['id']);
            return $response
                ->withStatus(200)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => true,
                    'data' => $following,
                    'count' => count($following)
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }

    /**
     * POST /api/users/{id}/follow
     * Seguir a un usuario
     */
    public function follow(Request $request, Response $response, array $args) {
        try {
            $data = $request->getParsedBody();
            $followerId = $data['follower_id'] ?? null;

            if (!$followerId) {
                return $response
                    ->withStatus(400)
                    ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                        'success' => false,
                        'error' => 'follower_id es requerido'
                    ])));
            }

            $result = $this->userModel->follow($followerId, $args['id']);
            return $response
                ->withStatus($result ? 201 : 400)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => $result,
                    'message' => $result ? 'Ahora sigues a este usuario' : 'Ya sigues a este usuario'
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }

    /**
     * POST /api/users/{id}/unfollow
     * Dejar de seguir a un usuario
     */
    public function unfollow(Request $request, Response $response, array $args) {
        try {
            $data = $request->getParsedBody();
            $followerId = $data['follower_id'] ?? null;

            if (!$followerId) {
                return $response
                    ->withStatus(400)
                    ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                        'success' => false,
                        'error' => 'follower_id es requerido'
                    ])));
            }

            $result = $this->userModel->unfollow($followerId, $args['id']);
            return $response
                ->withStatus(200)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => true,
                    'message' => 'Ya no sigues a este usuario'
                ])));
        } catch (\Exception $e) {
            return $response
                ->withStatus(500)
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ])));
        }
    }
}
