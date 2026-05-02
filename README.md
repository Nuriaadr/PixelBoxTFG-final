# PixelBox

PixelBox es una plataforma web para gamers donde puedes organizar tu colección de videojuegos, escribir reseñas, marcar favoritos y conectar con otros jugadores.

## Descripción

PixelBox permite a los usuarios:
- Explorar y buscar videojuegos
- Gestionar su biblioteca personal con estados (jugando, completado, pendiente, abandonado)
- Marcar juegos como favoritos
- Escribir y leer reseñas de la comunidad
- Ver y editar su perfil de usuario
- Seguir a otros jugadores
- Panel de administración para gestionar juegos y usuarios

## Tecnologías utilizadas

### Backend
- **PHP 8.0** con **Slim Framework 4**
- **MySQL** como base de datos
- Arquitectura **MVC** (Modelos, Controladores, Vistas)
- **PDO** para la conexión a la base de datos
- **vlucas/phpdotenv** para variables de entorno

### Frontend
- **HTML5**, **CSS3** y **JavaScript** vanilla
- **Lucide Icons** para los iconos
- Comunicación con el backend mediante **Fetch API**

## Instalación y configuración local

### Requisitos previos
- **WAMP** o **XAMPP** con PHP 8.0+
- **MySQL**
- **Composer**

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/Nuriaadr/PixelBoxTFG-final.git
```

**2. Instalar dependencias del backend**
```bash
cd PixelBoxTFG-final/backend
composer install
```

**3. Configurar variables de entorno**

Copia el archivo `.env.example` y renómbralo a `.env`:
```bash
cp .env.example .env
```

Edita el `.env` con tus datos.

**4. Crear la base de datos**

Abre phpMyAdmin y ejecuta el script `database.sql` incluido en el proyecto.

**5. Configurar la URL del frontend**

Edita `docs/js/config.js` con la ruta correcta de tu instalación local.


**6. Abrir el frontend**

Abre `docs/index.html` con Live Server o accede directamente desde el navegador.

##  Autor

Desarrollado como Trabajo de Fin de Grado por el equipo Pentacode :)
