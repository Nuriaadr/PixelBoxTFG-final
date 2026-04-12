// ===================== SISTEMA DE FAVORITOS =====================
// Este archivo entero necesita refactorización para usar API PHP
// Todas las operaciones CRUD deben implementarse en PHP con Slim
// - CREATE: POST /api/user/{userId}/favorites/{gameId} (agregar favorito)
// - READ: GET /api/user/{userId}/favorites (obtener favoritos)
// - DELETE: DELETE /api/user/{userId}/favorites/{gameId} (eliminar favorito)

// Obtener favoritos del usuario

/**
 * ELIMINAR - CRUD READ: Implementar en PHP
 * Reemplazar con API GET /api/user/{userId}/favorites
 */

function getFavoritos(usuario) {
  const key = `favoritos_${usuario}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Guardar favoritos del usuario
/**
 * CRUD CREATE/UPDATE: Implementar en PHP
 * Reemplazar con API POST /api/user/{userId}/favorites
 */

function saveFavoritos(usuario, favoritos) {
  const key = `favoritos_${usuario}`;
  localStorage.setItem(key, JSON.stringify(favoritos));
}

// Añadir juego a favoritos
/**
 * REFACTORIZAR - CRUD CREATE: Implementar en PHP
 * Reemplazar con API POST /api/user/{userId}/favorites/{gameId}
 */
function addFavorito(usuario, nombreJuego) {
  const favoritos = getFavoritos(usuario);
  if (!favoritos.includes(nombreJuego)) {
    favoritos.push(nombreJuego);
    saveFavoritos(usuario, favoritos);
    return true;
  }
  return false;
}

// Eliminar juego de favoritos
/**
 * REFACTORIZAR - CRUD DELETE: Implementar en PHP
 * Reemplazar con API DELETE /api/user/{userId}/favorites/{gameId}
 */
function removeFavorito(usuario, nombreJuego) {
  const favoritos = getFavoritos(usuario);
  const index = favoritos.indexOf(nombreJuego);
  if (index > -1) {
    favoritos.splice(index, 1);
    saveFavoritos(usuario, favoritos);
    return true;
  }
  return false;
}

// Alternar favorito
/**
 * REFACTORIZAR - CRUD CREATE/DELETE: Implementar en PHP
 * Reemplazar con API POST/DELETE /api/user/{userId}/favorites/{gameId}/toggle
 */
function toggleFavorito(usuario, nombreJuego) {
  const favoritos = getFavoritos(usuario);
  const index = favoritos.indexOf(nombreJuego);
  
  if (index > -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(nombreJuego);
  }
  
  saveFavoritos(usuario, favoritos);
  return index === -1; // Devuelve true si fue añadido, false si fue eliminado
}

// Verificar si un juego está en favoritos
function isFavorito(usuario, nombreJuego) {
  const favoritos = getFavoritos(usuario);
  return favoritos.includes(nombreJuego);
}

// Obtener todos los juegos favoritos 
function getFavoritosConDatos(usuario) {
  const favoritos = getFavoritos(usuario);
  return GAMES_DATA.filter(game => 
    favoritos.includes(game.nombre)
  );
}

// Actualizar botón de corazón según estado
function updateHeartButton(btn, isFavorite) {
  if (isFavorite) {
    btn.classList.add("favorited");
    btn.innerHTML = '<i data-lucide="heart"></i>';
  } else {
    btn.classList.remove("favorited");
    btn.innerHTML = '<i data-lucide="heart"></i>';
  }
  lucide.createIcons();
}
