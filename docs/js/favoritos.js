// ===================== SISTEMA DE FAVORITOS =====================

const user = JSON.parse(localStorage.getItem("usuario"));

// Verificar si un juego es favorito
async function isFavorito(gameId) {
    if (!user) return false;
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        return data.success ? data.data.is_favorite : false;
    } catch (error) {
        console.error('Error comprobando favorito:', error);
        return false;
    }
}

// Añadir juego a favoritos
async function addFavorito(gameId) {
    if (!user) return false;
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error añadiendo favorito:', error);
        return false;
    }
}

// Eliminar juego de favoritos
async function removeFavorito(gameId) {
    if (!user) return false;
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites/${gameId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error eliminando favorito:', error);
        return false;
    }
}

//añade o elimina según estado actual
async function toggleFavorito(gameId) {
    const esFavorito = await isFavorito(gameId);
    if (esFavorito) {
        return await removeFavorito(gameId);
    } else {
        return await addFavorito(gameId);
    }
}

//Obtener todos los favoritos del usuario
async function getFavoritosConDatos() {
    if (!user) return [];
    try {
        const response = await fetch(`${API_URL}/api/users/${user.id}/favorites`);
        const data = await response.json();
        if (!data.success) return [];

        //Mapeamos al formato que usa el frontend
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

// Actualizar botón de corazón según estado
function updateHeartButton(btn, isFavorite) {
    if (isFavorite) {
        btn.classList.add("favorited");
    } else {
        btn.classList.remove("favorited");
    }
    btn.innerHTML = '<i data-lucide="heart"></i>';
    lucide.createIcons();
}

// Ver si un juego es favorito (id 1 = Legends of Eldoria)
isFavorito(1).then(r => console.log('¿Es favorito?', r));

// Añadir a favoritos
addFavorito(1).then(r => console.log('¿Añadido?', r));

// Ver todos los favoritos
getFavoritosConDatos().then(r => console.log('Favoritos:', r));

// Eliminar de favoritos
removeFavorito(1).then(r => console.log('¿Eliminado?', r));