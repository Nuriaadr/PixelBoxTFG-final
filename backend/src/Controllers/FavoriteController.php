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

    /**
     * GET /api/users/:userId/favorites - Obtener todos los favoritos
     */
    public function getAll(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $favorites = $this->favoriteModel->getByUser($userId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $favorites,
                    'count' => count($favorites)
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
     * GET /api/users/:userId/favorites/:gameId - Verificar si es favorito
     */
    public function check(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];
            $isFavorite = $this->favoriteModel->isFavorite($userId, $gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => ['is_favorite' => $isFavorite]
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
     * POST /api/users/:userId/favorites/:gameId - Agregar favorito
     */
    public function add(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];

          

            $this->favoriteModel->add($userId, $gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(201)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Juego agregado a favoritos'
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
     * DELETE /api/users/:userId/favorites/:gameId - Eliminar favorito
     */
    public function remove(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $gameId = $args['gameId'];

            $this->favoriteModel->remove($userId, $gameId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Game removed from favorites'
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
     * GET /api/users/:userId/favorites/count - Obtener cantidad de favoritos
     */
    public function getCount(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $count = $this->favoriteModel->getCount($userId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => ['count' => $count]
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
