
const user = JSON.parse(localStorage.getItem("usuario"));


async function isGameInLibrary(gameId) {
    if (!user) return false; //si no hay user no se hace nada, realmente esto no es necesario porque la página ya tiene protección de acceso pero por si acaso
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/library/has/${gameId}`);
        const data = await response.json();
        return data.success ? data.data.has_game : false;
    } catch (error) {
        console.error('Error verificando biblioteca:', error);
        return false;
    }
}

async function isFavorito(gameId) {
    if (!user) return false;
    try {
        //verifica si el juego es favorito haciendo una petición a la API
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`);
        const data = await response.json();
        return data.success ? data.data.is_favorite : false;
    } catch (error) {
        console.error('Error comprobando favorito:', error);
        return false;
    }
}

async function addFavorito(gameId) {
    if (!user) return false;
    try {
        //añade el juego a los favoritos 
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`, {
            method: 'POST'
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error añadiendo favorito:', error);
        return false;
    }
}

async function removeFavorito(gameId) {
    if (!user) return false;
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error eliminando favorito:', error);
        return false;
    }
}

async function toggleFavorito(gameId) {
    const esFavorito = await isFavorito(gameId);
    if (esFavorito) {
        return await removeFavorito(gameId);
    } else {
        return await addFavorito(gameId);
    }
}

async function getFavoritosConDatos() {
    if (!user) return []; 
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites`);
        const data = await response.json();
        if (!data.success) return [];
        return data.data.map(game => ({
            id: game.id,
            nombre: game.title,
            imagen: game.cover_image_url,
            año: game.release_year,
            desarrollador: game.developer,
            descripcion: game.description,
            rating: game.average_rating,
            genero: game.genre,
            plataforma: game.platform
        }));
    } catch (error) {
        console.error('Error obteniendo favoritos:', error);
        return [];
    }
}

function updateHeartButton(btn, isFavorite) {
    if (isFavorite) {
        //si es favorito se añade la clase favorited al botón para que se muestre el corazón rojo, si no se quita esa clase para que se muestre el corazón vacío
        btn.classList.add("favorited");
    } else {
        btn.classList.remove("favorited");
    }
    btn.innerHTML = '<i data-lucide="heart"></i>';
    lucide.createIcons();
}