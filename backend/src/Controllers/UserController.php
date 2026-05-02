<?php

namespace App\Controllers;

use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    //GET /api/users
    public function getAll(Request $request, Response $response): Response
    {
        try {
            $users = $this->userModel->getAll();
            return $this->json($response, ['success' => true, 'data' => $users]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //GET /api/users/{id}
    public function getById(Request $request, Response $response, array $args): Response
    {
        try {
            $user = $this->userModel->getById($args['id']);

            if (!$user) {
                return $this->json($response, ['success' => false, 'error' => 'Usuario no encontrado'], 404);
            }

            return $this->json($response, ['success' => true, 'data' => $user]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //GET /api/users/{id}/followers
    public function getFollowers(Request $request, Response $response, array $args): Response
    {
        try {
            $followers = $this->userModel->getFollowers($args['id']);
            return $this->json($response, ['success' => true, 'data' => $followers, 'count' => count($followers)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //GET /api/users/{id}/following
    public function getFollowing(Request $request, Response $response, array $args): Response
    {
        try {
            $following = $this->userModel->getFollowing($args['id']);
            return $this->json($response, ['success' => true, 'data' => $following, 'count' => count($following)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //GET /api/users/{id}/stats
    public function getStats(Request $request, Response $response, array $args): Response
    {
        try {
            $stats = $this->userModel->getStats($args['id']);
            return $this->json($response, ['success' => true, 'data' => $stats]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //POST /api/users/{id}/follow
    public function follow(Request $request, Response $response, array $args): Response
    {
        try {
            $followingId = $args['id'];
            $data = $request->getParsedBody();
            $followerId = $data['follower_id'] ?? null;

            if (!$followerId) {
                return $this->json($response, ['success' => false, 'error' => 'follower_id es requerido'], 400);
            }

            $result = $this->userModel->follow($followerId, $followingId);

            return $this->json($response, [
                'success' => $result,
                'message' => $result ? 'Ahora sigues a este usuario' : 'Ya sigues a este usuario',
            ], $result ? 201 : 400);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //POST /api/users/{id}/unfollow
    public function unfollow(Request $request, Response $response, array $args): Response
    {
        try {
            $followingId = $args['id'];
            $data = $request->getParsedBody();
            $followerId = $data['follower_id'] ?? null;

            if (!$followerId) {
                return $this->json($response, ['success' => false, 'error' => 'follower_id es requerido'], 400);
            }

            $this->userModel->unfollow($followerId, $followingId);

            return $this->json($response, ['success' => true, 'message' => 'Ya no sigues a este usuario']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //PUT /api/users/{id}
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['id'];
            $data = $request->getParsedBody();

            $this->userModel->update($userId, $data);

            return $this->json($response, ['success' => true, 'message' => 'Usuario actualizado exitosamente']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //DELETE /api/users/{id}
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['id'];
            $this->userModel->delete($userId);
            return $this->json($response, ['success' => true, 'message' => 'Usuario eliminado exitosamente']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // POST /api/users
    public function create(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();
            $newData = [
                'username' => $data['new_username'] ?? null,
                'password' => $data['new_password'] ?? null,
                'description' => $data['description'] ?? null
            ];
            $result = $this->userModel->create($newData);
            if (!$result) {
                return $this->json($response, ['success' => false, 'message' => 'No se pudo crear el usuario o ya existe'], 400);
            }
            return $this->json($response, ['success' => true, 'message' => 'Usuario creado exitosamente'], 201);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
