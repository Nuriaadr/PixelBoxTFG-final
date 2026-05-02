<?php

namespace App\Controllers;

use App\Models\Library;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class LibraryController
{
    private Library $libraryModel;


    public function __construct()
    {
        $this->libraryModel = new Library();
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    // GET /api/users/:userId/library
    public function getAll(Request $request, Response $response, array $args): Response
    {
        try {
            $userId  = $args['userId'];
            $library = $this->libraryModel->getByUser($userId);
            $stats   = $this->libraryModel->getStats($userId);

            return $this->json($response, [
                'success' => true,
                'data'    => $library,
                'stats'   => $stats,
                'count'   => count($library),
            ]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/users/:userId/library/:status
    public function getByState(Request $request, Response $response, array $args): Response
    {
        try {
            $games = $this->libraryModel->getByState($args['userId'], $args['status']);
            return $this->json($response, ['success' => true, 'data' => $games, 'count' => count($games)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // GET /api/users/:userId/library/stats
    public function getStats(Request $request, Response $response, array $args): Response
    {
        try {
            $stats = $this->libraryModel->getStats($args['userId']);
            return $this->json($response, ['success' => true, 'data' => $stats]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

   

    // POST /api/users/:userId/library/:gameId
    public function add(Request $request, Response $response, array $args): Response
    {
        try {
            $body   = $request->getParsedBody();
            $status = $body['status'] ?? 'pendiente';

            $this->libraryModel->add($args['userId'], $args['gameId'], $status);

            return $this->json($response, [
                'success' => true,
                'message' => 'Juego agregado a la biblioteca exitosamente',
            ], 201);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // PUT /api/users/:userId/library/:gameId
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $body   = $request->getParsedBody();

            if (isset($body['status'])) {
                $this->libraryModel->updateStatus($userId, $gameId, $body['status']);
            }

            return $this->json($response, ['success' => true, 'message' => 'Biblioteca actualizada exitosamente']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // DELETE /api/users/:userId/library/:gameId
    public function remove(Request $request, Response $response, array $args): Response
    {
        try {
            $this->libraryModel->remove($args['userId'], $args['gameId']);
            return $this->json($response, ['success' => true, 'message' => 'Game removed from library successfully']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // GET /api/users/:userId/library/has/:gameId
    public function hasGame(Request $request, Response $response, array $args): Response
    {
        try {
            $has = $this->libraryModel->hasGame($args['userId'], $args['gameId']);
            return $this->json($response, ['success' => true, 'data' => ['has_game' => $has]]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}