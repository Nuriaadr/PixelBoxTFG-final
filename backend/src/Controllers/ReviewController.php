<?php

namespace App\Controllers;

use App\Models\Review;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ReviewController
{
    private Review $reviewModel;

    public function __construct()
    {
        $this->reviewModel = new Review();
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    /**
     * GET /api/games/{gameId}/reviews
     * Obtener todas las reseñas de un juego
     */
    public function getByGame(Request $request, Response $response, array $args): Response
    {
        try {
            $gameId = $args['gameId'];
            $reviews = $this->reviewModel->getByGame($gameId);
            return $this->json($response, [
                'success' => true,
                'data' => $reviews,
                'count' => count($reviews),
            ]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/users/{userId}/reviews
     * Obtener todas las reseñas de un usuario
     */
    public function getByUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['userId'];
            $reviews = $this->reviewModel->getByUser($userId);
            return $this->json($response, [
                'success' => true,
                'data' => $reviews,
                'count' => count($reviews),
            ]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/games/{gameId}/reviews
     * Crear una reseña
     */
    public function create(Request $request, Response $response, array $args): Response
    {
        try {
            $gameId = $args['gameId'];
            $userId = $request->getAttribute('userId');
            $body   = $request->getParsedBody();

            if (!isset($body['rating']) || $body['rating'] === '') {
                return $this->json($response, [
                    'success' => false,
                    'message' => 'La calificación es requerida',
                ], 400);
            }

            $rating = intval($body['rating']);
            if ($rating < 1 || $rating > 5) {
                return $this->json($response, [
                    'success' => false,
                    'message' => 'La calificación debe ser entre 1 y 5',
                ], 400);
            }

            $reviewId = $this->reviewModel->create(
                $gameId,
                $userId,
                $rating,
                $body['content'] ?? null
            );

            return $this->json($response, [
                'success' => true,
                'message' => 'Reseña creada exitosamente',
                'data'    => ['id' => $reviewId],
            ], 201);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}