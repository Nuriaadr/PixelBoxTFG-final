<?php

namespace App\Controllers;

use App\Models\Game;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class GameController
{
    private Game $gameModel;

    public function __construct()
    {
        $this->gameModel = new Game();
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    // GET /api/games
    public function getAll(Request $request, Response $response): Response
    {
        try {
            $games = $this->gameModel->getAll();
            return $this->json($response, [
                'success' => true,
                'message' => 'Juegos recuperados exitosamente',
                'data'    => $games,
                'count'   => count($games),
            ]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/:id
    public function getById(Request $request, Response $response, array $args): Response
    {
        try {
            $game = $this->gameModel->getById($args['id']);

            if (!$game) {
                return $this->json($response, ['success' => false, 'message' => 'Juego no encontrado'], 404);
            }

            return $this->json($response, ['success' => true, 'data' => $game]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/search/:query
    public function search(Request $request, Response $response, array $args): Response
    {
        try {
            $games = $this->gameModel->search($args['query'] ?? '');
            return $this->json($response, ['success' => true, 'data' => $games, 'count' => count($games)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/genre/:genre
    public function getByGenre(Request $request, Response $response, array $args): Response
    {
        try {
            $games = $this->gameModel->getByGenre($args['genre']);
            return $this->json($response, ['success' => true, 'data' => $games, 'count' => count($games)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/platform/:platform
    public function getByPlatform(Request $request, Response $response, array $args): Response
    {
        try {
            $games = $this->gameModel->getByPlatform($args['platform']);
            return $this->json($response, ['success' => true, 'data' => $games, 'count' => count($games)]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/genres
    public function getGenres(Request $request, Response $response): Response
    {
        try {
            return $this->json($response, ['success' => true, 'data' => $this->gameModel->getGenres()]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/games/platforms
    public function getPlatforms(Request $request, Response $response): Response
    {
        try {
            return $this->json($response, ['success' => true, 'data' => $this->gameModel->getPlatforms()]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/games
    public function create(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();

            $required = ['title', 'release_year', 'developer', 'description', 'genre', 'platform', 'average_rating'];
            foreach ($required as $field) {
                if (empty($body[$field])) {
                    return $this->json($response, [
                        'success' => false,
                        'message' => "Falta el campo requerido: $field",
                    ], 400);
                }
            }

            $year   = intval($body['release_year']);
            $rating = floatval($body['average_rating']);

            if ($year < 1980 || $year > date('Y') + 5) {
                return $this->json($response, ['success' => false, 'message' => 'Año inválido'], 400);
            }

            if ($rating < 0 || $rating > 5) {
                return $this->json($response, ['success' => false, 'message' => 'El rating debe ser entre 0 y 5'], 400);
            }

            $gameId = $this->gameModel->create(
                $body['title'],
                $year,
                $body['developer'],
                $body['description'],
                $body['genre'],
                $body['platform'],
                $rating,
                $body['cover_image_url'] ?? null
            );

            return $this->json($response, [
                'success' => true,
                'message' => 'Juego creado exitosamente',
                'data'    => ['id' => $gameId],
            ], 201);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // PUT /api/games/:id
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $game = $this->gameModel->getById($args['id']);
            if (!$game) {
                return $this->json($response, ['success' => false, 'message' => 'Juego no encontrado'], 404);
            }

            $this->gameModel->update($args['id'], $request->getParsedBody());

            return $this->json($response, ['success' => true, 'message' => 'Juego actualizado exitosamente']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/games/:id
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $game = $this->gameModel->getById($args['id']);
            if (!$game) {
                return $this->json($response, ['success' => false, 'message' => 'Juego no encontrado'], 404);
            }

            $this->gameModel->delete($args['id']);

            return $this->json($response, ['success' => true, 'message' => 'Juego eliminado exitosamente']);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}