<?php

namespace App\Controllers;

use App\Models\Library;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class LibraryController
{
    private $libraryModel;

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
    public function get(Request $request, Response $response, array $args): Response
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

    // GET /api/users/:userId/library/:estado
    public function getByState(Request $request, Response $response, array $args): Response
    {
        try {
            $games = $this->libraryModel->getByState($args['userId'], $args['estado']);
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

    // GET /api/users/:userId/library/:gameId
    public function getEntry(Request $request, Response $response, array $args): Response
    {
        try {
            $entry = $this->libraryModel->getEntry($args['userId'], $args['gameId']);

            if (!$entry) {
                return $this->json($response, [
                    'success' => false,
                    'message' => 'Juego no encontrado en la biblioteca',
                ], 404);
            }

            return $this->json($response, ['success' => true, 'data' => $entry]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/users/:userId/library/:gameId
    public function add(Request $request, Response $response, array $args): Response
    {
        try {
            $body   = $request->getParsedBody();
            $estado = $body['estado'] ?? 'pendiente';

            $this->libraryModel->add($args['userId'], $args['gameId'], $estado);

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

            if (isset($body['estado'])) {
                $this->libraryModel->updateStatus($userId, $gameId, $body['estado']);
            }

            if (isset($body['calificacion_personal'])) {
                $this->libraryModel->updateRating($userId, $gameId, $body['calificacion_personal']);
            }

            return $this->json($response, ['success' => true, 'message' => 'Library entry updated successfully']);
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