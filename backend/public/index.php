<?php

require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
use Slim\Routing\Route;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Importar controllers
use App\Controllers\UserController;
use App\Controllers\GameController;
use App\Controllers\ReviewController;
use App\Controllers\LibraryController;
use App\Controllers\FavoriteController;
use App\Controllers\AuthController;

use App\Middleware\SimpleAuthMiddleware;
// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Crear aplicación Slim
$app = AppFactory::create();

// Instanciar controllers
$userController = new UserController();
$gameController = new GameController();
$reviewController = new ReviewController();
$libraryController = new LibraryController();
$favoriteController = new FavoriteController();
$authController = new AuthController();

$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ORIGIN'] ?? '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Content-Type', 'application/json');
});

$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// =====================================================
// RUTAS - AUTENTICACIÓN (SIMPLIFICADO)
// =====================================================
$app->post('/api/auth/login', [$authController, 'login']);
$app->post('/api/auth/verify', [$authController, 'verify']);

// =====================================================
// RUTAS - USUARIOS (SIMPLIFICADO)
// =====================================================
$app->get('/api/users', [$userController, 'getAll']);
$app->get('/api/users/{id}', [$userController, 'getById']);
$app->put('/api/users/{id}', [$userController, 'update'])->add(new SimpleAuthMiddleware());
$app->delete('/api/users/{id}', [$userController, 'delete'])->add(new SimpleAuthMiddleware());

// Perfil del usuario autenticado
$app->get('/api/me', [$userController, 'getProfile'])->add(new SimpleAuthMiddleware());
$app->put('/api/me', [$userController, 'updateProfile'])->add(new SimpleAuthMiddleware());

// Seguidores
$app->get('/api/users/{id}/followers', [$userController, 'getFollowers']);
$app->get('/api/users/{id}/following', [$userController, 'getFollowing']);
$app->post('/api/users/{id}/follow', [$userController, 'follow'])->add(new SimpleAuthMiddleware());
$app->delete('/api/users/{id}/follow', [$userController, 'unfollow'])->add(new SimpleAuthMiddleware());
$app->get('/api/users/{id}/stats', [$userController, 'getStats']);

// =====================================================
// RUTAS - JUEGOS (SIMPLIFICADO)
// =====================================================
$app->get('/api/games', [$gameController, 'getAll']);
$app->get('/api/games/genres', [$gameController, 'getGenres']);
$app->get('/api/games/platforms', [$gameController, 'getPlatforms']);
$app->get('/api/games/search/{query}', [$gameController, 'search']);
$app->get('/api/games/genre/{genre}', [$gameController, 'getByGenre']);
$app->get('/api/games/platform/{platform}', [$gameController, 'getByPlatform']);
$app->get('/api/games/{id}', [$gameController, 'getById']);

// Solo admin puede modificar juegos
$app->post('/api/games', [$gameController, 'create'])->add(new SimpleAuthMiddleware());
$app->put('/api/games/{id}', [$gameController, 'update'])->add(new SimpleAuthMiddleware());
$app->delete('/api/games/{id}', [$gameController, 'delete'])->add(new SimpleAuthMiddleware());


// =====================================================
// RUTAS - BIBLIOTECA (SIMPLIFICADO)
// =====================================================
$app->get('/api/users/{userId}/library', [$libraryController, 'getAll']);
$app->get('/api/users/{userId}/library/stats', [$libraryController, 'getStats']);
$app->get('/api/users/{userId}/library/has/{gameId}', [$libraryController, 'hasGame']);
$app->post('/api/users/{userId}/library/{gameId}', [$libraryController, 'add'])->add(new SimpleAuthMiddleware());
$app->put('/api/users/{userId}/library/{gameId}', [$libraryController, 'update'])->add(new SimpleAuthMiddleware());
$app->delete('/api/users/{userId}/library/{gameId}', [$libraryController, 'remove'])->add(new SimpleAuthMiddleware());
$app->get('/api/users/{userId}/library/{estado}', [$libraryController, 'getByState']);

// =====================================================
// RUTAS - FAVORITOS (SIMPLIFICADO)
// =====================================================
$app->get('/api/users/{userId}/favorites', [$favoriteController, 'getAll']);
$app->get('/api/users/{userId}/favorites/count', [$favoriteController, 'getCount']);
$app->post('/api/users/{userId}/favorites/{gameId}', [$favoriteController, 'add'])->add(new SimpleAuthMiddleware());
$app->delete('/api/users/{userId}/favorites/{gameId}', [$favoriteController, 'remove'])->add(new SimpleAuthMiddleware());

// =====================================================
// RUTAS - RESEÑAS (SIMPLIFICADO)
// =====================================================
$app->get('/api/games/{id}/reviews', [$reviewController, 'getByGame']);
$app->get('/api/reviews/{id}', [$reviewController, 'getById']);
$app->post('/api/games/{id}/reviews', [$reviewController, 'create'])->add(new SimpleAuthMiddleware());

// Ejecutar la aplicación
$app->run();
