<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\UserController;
use App\Controllers\GameController;
use App\Controllers\ReviewController;
use App\Controllers\LibraryController;
use App\Controllers\FavoriteController;
use App\Controllers\AuthController;
use App\Middleware\SimpleAuthMiddleware;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$app = AppFactory::create();

$app->setBasePath('/PixelBoxTFG-master/backend/public'); //ajusta esto a tu ruta base si es diferente jiji
$app->addBodyParsingMiddleware();//Middleware para parsear el cuerpo de las peticiones, necesario para manejar JSON en POST, PUT, etc.

//Middleware para manejar CORS y establecer el tipo de contenido a JSON
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ORIGIN'] ?? '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Content-Type', 'application/json');
});
$app->addErrorMiddleware(true, true, true);

//controladores para manejar las rutas y las funcionalidades de cada entidad
$userController = new UserController();
$gameController = new GameController();
$reviewController = new ReviewController();
$libraryController = new LibraryController();
$favoriteController = new FavoriteController();
$authController = new AuthController();

$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// AUTENTICACIÓN
$app->post('/api/auth/login', [$authController, 'login']);
$app->post('/api/auth/verify', [$authController, 'verify']);

// USUARIOS
$app->get('/api/users', [$userController, 'getAll']);//ruta para listar todos los usuarios con sus datos básicos, esta ruta es para la lista de admin
$app->get('/api/users/{id}', [$userController, 'getById']); //ruta para obtener los datos de un usuario específico, esta ruta es para el perfil del usuario
$app->get('/api/users/{id}/followers', [$userController, 'getFollowers']); //ruta para obtener la lista de seguidores de un usuario, esta ruta es para el modal de seguidores
$app->get('/api/users/{id}/following', [$userController, 'getFollowing']); //ruta para obtener la lista de seguidos de un usuario, esta ruta es para el modal de seguidos
$app->get('/api/users/{id}/stats', [$userController, 'getStats']); //ruta para obtener las estadísticas de un usuario, esta ruta es para mostrarlas en el perfil 
$app->post('/api/users/{id}/follow', [$userController, 'follow']); //seguir a un usuario
$app->delete('/api/users/{id}/follow', [$userController, 'unfollow']); //dejar de seguir a un usuario
$app->put('/api/users/{id}', [$userController, 'update']); //esta ruta es para que el usuario pueda actualizar su perfil, no es solo para admin

// Solo admin
$app->post('/api/users', [$userController, 'create'])->add(new SimpleAuthMiddleware()); //ruta para crear un nuevo usuario
$app->delete('/api/users/{id}', [$userController, 'delete'])->add(new SimpleAuthMiddleware()); //ruta para eliminar un usuario

// JUEGOS
$app->get('/api/games', [$gameController, 'getAll']); //listar todos los juegos, esta ruta es para la página principal entre otras cosas
$app->get('/api/games/genres', [$gameController, 'getGenres']); //obtener los generos disponibles, esta ruta es para el filtro de generos
$app->get('/api/games/platforms', [$gameController, 'getPlatforms']); //obtener las plataformas disponibles, esta ruta es para el filtro de plataformas
$app->get('/api/games/search/{query}', [$gameController, 'search']); //buscar juegos por nombre
$app->get('/api/games/genre/{genre}', [$gameController, 'getByGenre']); //obtener juegos por su genero
$app->get('/api/games/platform/{platform}', [$gameController, 'getByPlatform']); //obtener juegos por plataforma
$app->get('/api/games/{id}', [$gameController, 'getById']); //obtener los detalles de un juego específico
// Solo admin
$app->post('/api/games', [$gameController, 'create'])->add(new SimpleAuthMiddleware()); //ruta para crear un nuevo juego
$app->put('/api/games/{id}', [$gameController, 'update'])->add(new SimpleAuthMiddleware()); //ruta para actualizar un juego 
$app->delete('/api/games/{id}', [$gameController, 'delete'])->add(new SimpleAuthMiddleware()); //ruta para eliminar un juego 

// BIBLIOTECA
$app->get('/api/users/{userId}/library/stats', [$libraryController, 'getStats']); //obtiene las estadisticas de la biblioteca de un usuario
$app->get('/api/users/{userId}/library/has/{gameId}', [$libraryController, 'hasGame']); //verificar si un juego está en la biblioteca de un usuario
$app->get('/api/users/{userId}/library', [$libraryController, 'getAll']); //obtiene todos los juegos de la biblioteca de un usuario
$app->get('/api/users/{userId}/library/{estado}', [$libraryController, 'getByState']); //obtiene los juegos de la biblioteca segun su estado
$app->post('/api/users/{userId}/library/{gameId}', [$libraryController, 'add']); //agregar a la biblioteca un juego
$app->put('/api/users/{userId}/library/{gameId}', [$libraryController, 'update']); //actualizar el estado de un juego en la biblioteca
$app->delete('/api/users/{userId}/library/{gameId}', [$libraryController, 'remove']); //eliminar un juego de la biblioteca

// FAVORITOS
$app->get('/api/users/{userId}/favorites/count', [$favoriteController, 'getCount']); //obtiene numero de favs de un usuario
$app->get('/api/users/{userId}/favorites/{gameId}', [$favoriteController, 'check']); //verificar si un juego está en los favoritos de un usuario
$app->get('/api/users/{userId}/favorites', [$favoriteController, 'getAll']); //obtiene todos los juegos favoritos de un usuario
$app->post('/api/users/{userId}/favorites/{gameId}', [$favoriteController, 'add']); //agregar un juego a los favoritos de un usuario
$app->delete('/api/users/{userId}/favorites/{gameId}', [$favoriteController, 'remove']); //eliminar de los favoritos de un usuario un juego

// RESEÑAS
$app->get('/api/games/{id}/reviews', [$reviewController, 'getByGame']); //obtener todas las reseñas de un juego específico
$app->get('/api/reviews/{id}', [$reviewController, 'getById']); //obtener los detalles de una reseña 
$app->post('/api/games/{id}/reviews', [$reviewController, 'create']); //crear una nueva reseña para un juego 
$app->get('/api/users/{userId}/reviews', [$reviewController, 'getByUser']); //obtener todas las reseñas de un usuario 

$app->run();
