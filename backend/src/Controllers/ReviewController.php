<?php

namespace App\Controllers;

use App\Models\Review;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ReviewController
{
    private $reviewModel;

    public function __construct()
    {
        $this->reviewModel = new Review();
    }




    /**
     * GET /api/users/:userId/reviews - Obtener todas las reseñas del usuario
     */
    public function getByUser(Request $request, Response $response, array $args)
    {
        try {
            $userId = $args['userId'];
            $reviews = $this->reviewModel->getByUser($userId);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200)
                ->write(json_encode([
                    'success' => true,
                    'data' => $reviews,
                    'count' => count($reviews)
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
     * POST /api/games/:gameId/reviews - Crear reseña
     */
    public function create(Request $request, Response $response, array $args)
    {
        try {
            $gameId = $args['gameId'];
            $userId = $request->getAttribute('userId'); // Del JWT middleware
            $body = $request->getParsedBody();

            // Validar campos requeridos
            if (!isset($body['rating']) || $body['rating'] === '') {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'La calificación es requerida'
                    ]));
            }

            $rating = intval($body['rating']);
            if ($rating < 1 || $rating > 5) {
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400)
                    ->write(json_encode([
                        'success' => false,
                        'message' => 'La calificación debe ser entre 1 y 5'
                    ]));
            }

            $comentario = $body['comentario'] ?? null;
            $es_spoiler = $body['es_spoiler'] ?? false;

            $reviewId = $this->reviewModel->create($gameId, $userId, $rating, $comentario, $es_spoiler);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(201)
                ->write(json_encode([
                    'success' => true,
                    'message' => 'Review created successfully',
                    'data' => ['id' => $reviewId]
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




}
