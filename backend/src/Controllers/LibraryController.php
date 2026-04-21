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

    /**
     * GET /api/users/:userId/library - Obtener biblioteca completa del usuario
     */
    public function get(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $library = $this->libraryModel->getByUser($userId);
            $stats = $this->libraryModel->getStats($userId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $library,
                    'stats' => $stats,
                    'count' => count($library)
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/users/:userId/library/:estado - Obtener juegos por estado
     */
    public function getByState(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $estado = $args['estado'];
            $games = $this->libraryModel->getByState($userId, $estado);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $games,
                    'count' => count($games)
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/users/:userId/library/stats - Obtener estadísticas
     */
    public function getStats(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $stats = $this->libraryModel->getStats($userId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $stats
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/users/:userId/library/:gameId - Obtener entrada específica
     */
    public function getEntry(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $entry = $this->libraryModel->getEntry($userId, $gameId);

            if (!$entry) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Juego no encontrado en la biblioteca'
                    ]));
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $entry
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * POST /api/users/:userId/library/:gameId - Agregar juego a biblioteca
     */
    public function add(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $body = $request->getParsedBody();
            $estado = $body['estado'] ?? 'pendiente';
            $this->libraryModel->add($userId, $gameId, $estado);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(201)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juego agregado a la biblioteca exitosamente'
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * PUT /api/users/:userId/library/:gameId - Actualizar entrada de biblioteca
     */
    public function update(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $body = $request->getParsedBody();



            // Actualizar estado si se proporciona
            if (isset($body['estado'])) {
                $this->libraryModel->updateStatus($userId, $gameId, $body['estado']);
            }


            // Actualizar calificación personal si se proporciona
            if (isset($body['calificacion_personal'])) {
                $this->libraryModel->updateRating($userId, $gameId, $body['calificacion_personal']);
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Library entry updated successfully'
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * DELETE /api/users/:userId/library/:gameId - Eliminar juego de biblioteca
     */
    public function remove(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];

            $this->libraryModel->remove($userId, $gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Game removed from library successfully'
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/users/:userId/library/has/:gameId - Verificar si tiene juego en biblioteca
     */
    public function hasGame(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $has = $this->libraryModel->hasGame($userId, $gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => ['has_game' => $has]
                ]));
        } catch (\Exception $e) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }
}
