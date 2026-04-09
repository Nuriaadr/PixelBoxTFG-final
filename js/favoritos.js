// ===================== SISTEMA DE FAVORITOS =====================

// Obtener favoritos del usuario
function getFavoritos(usuario) {
  const key = `favoritos_${usuario}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Guardar favoritos del usuario
function saveFavoritos(usuario, favoritos) {
  const key = `favoritos_${usuario}`;
  localStorage.setItem(key, JSON.stringify(favoritos));
}

// Añadir juego a favoritos
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
