<?php

namespace App\Controllers;

use App\Models\Favorite;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FavoriteController
{
    private $favoriteModel;

    public function __construct()
    {
        $this->favoriteModel = new Favorite();
    }

    // GET /api/users/:userId/favorites
    public function getAll(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $favorites = $this->favoriteModel->getByUser($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data'    => $favorites,
                'count'   => count($favorites),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    // GET /api/users/:userId/favorites/:gameId
    public function check(Request $request, Response $response, array $args): Response
    {
        try {
            $userId     = $args['userId'];
            $gameId     = $args['gameId'];
            $isFavorite = $this->favoriteModel->isFavorite($userId, $gameId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data'    => ['is_favorite' => $isFavorite],
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    // POST /api/users/:userId/favorites/:gameId
    public function add(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];

            $this->favoriteModel->add($userId, $gameId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Juego agregado a favoritos',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    }

    // DELETE /api/users/:userId/favorites/:gameId
    public function remove(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];

            $this->favoriteModel->remove($userId, $gameId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Game removed from favorites',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    }

    // GET /api/users/:userId/favorites/count
    public function getCount(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $count  = $this->favoriteModel->getCount($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data'    => ['count' => $count],
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
