<?php

namespace App\Controllers;

use App\Models\Game;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class GameController
{
    private $gameModel;

    public function __construct()
    {
        $this->gameModel = new Game();
    }

    /**
     * GET /api/games - Obtener todos los juegos
     */
    public function getAll(Request $request, Response $response)
    {
        try {
            $games = $this->gameModel->getAll();

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juegos recuperados exitosamente',
                    'data' => $games,
                    'count' => count($games)
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
     * GET /api/games/:id - Obtener juego específico
     */
    public function getById(Request $request, Response $response, array $args)
    {
        try {
            $gameId = $args['id'];
            $game = $this->gameModel->getById($gameId);

            if (!$game) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Juego no encontrado'
                    ]));
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $game
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
     * GET /api/games/search/:query - Buscar juegos
     */
    public function search(Request $request, Response $response, array $args)
    {
        try {
            $query = $args['query'] ?? '';



            $games = $this->gameModel->search($query);

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
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/games/genre/:genre - Obtener juegos por género
     */
    public function getByGenre(Request $request, Response $response, array $args)
    {
        try {
            $genre = $args['genre'];
            $games = $this->gameModel->getByGenre($genre);

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
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/games/platform/:platform - Obtener juegos por plataforma
     */
    public function getByPlatform(Request $request, Response $response, array $args)
    {
        try {
            $platform = $args['platform'];
            $games = $this->gameModel->getByPlatform($platform);

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
                ->withStatus(500)
                ->write(json_encode([
                    'success' => false,
                    'message' => $e->getMessage()
                ]));
        }
    }

    /**
     * GET /api/games/genres - Obtener todos los géneros disponibles
     */
    public function getGenres(Request $request, Response $response)
    {
        try {
            $genres = $this->gameModel->getGenres();

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $genres
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
     * GET /api/games/platforms - Obtener todas las plataformas disponibles
     */
    public function getPlatforms(Request $request, Response $response)
    {
        try {
            $platforms = $this->gameModel->getPlatforms();

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $platforms
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
     * POST /api/games - Crear nuevo juego (SOLO ADMIN)
     */
    public function create(Request $request, Response $response)
    {
        try {
            $body = $request->getParsedBody();

            // Validar campos requeridos
            $required = ['nombre', 'año', 'desarrollador', 'descripcion', 'genero', 'plataforma', 'rating'];
            foreach ($required as $field) {
                if (!isset($body[$field]) || empty($body[$field])) {
                    return $response
                        ->withHeader('Content-Type', 'application/json')
                        ->withStatus(400)
                        ->write(json_encode([
                            'success' => false,
                            'message' => "Falta el campo requerido: $field"
                        ]));
                }
            }

            // Validar tipos de datos
            $year = intval($body['año']);
            $rating = floatval($body['rating']);

            if ($year < 1980 || $year > date('Y') + 5) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Año inválido'
                    ]));
            }

            if ($rating < 0 || $rating > 5) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'El rating debe ser entre 0 y 5'
                    ]));
            }

            $imagen_url = $body['imagen_url'] ?? null;

            $gameId = $this->gameModel->create(
                $body['nombre'],
                $year,
                $body['desarrollador'],
                $body['descripcion'],
                $body['genero'],
                $body['plataforma'],
                $rating,
                $imagen_url
            );

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(201)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juego creado exitosamente',
                    'data' => ['id' => $gameId]
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
     * PUT /api/games/:id - Actualizar juego (SOLO ADMIN)
     */
    public function update(Request $request, Response $response, array $args)
    {
        try {
            $gameId = $args['id'];
            $body = $request->getParsedBody();

            // Verificar que el juego exista
            $game = $this->gameModel->getById($gameId);
            if (!$game) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Juego no encontrado'
                    ]));
            }

            $this->gameModel->update($gameId, $body);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juego actualizado exitosamente'
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
     * DELETE /api/games/:id - Eliminar juego (SOLO ADMIN)
     */
    public function delete(Request $request, Response $response, array $args)
    {
        try {
            $gameId = $args['id'];

            // Verificar que el juego exista
            $game = $this->gameModel->getById($gameId);
            if (!$game) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'Juego no encontrado'
                    ]));
            }

            $this->gameModel->delete($gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juego eliminado exitosamente'
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
