// ===================== BÚSQUEDA =====================
// CRUD OPERATIONS: Operaciones CRUD deben implementarse en PHP con Slim
// - READ: GET /api/games/search?q={query} (buscar juegos)
// Modal de búsqueda - Utiliza GAMES_DATA de games.js
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector('i[data-lucide="search"]');
  const searchModal = document.getElementById("searchModal");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const closeSearchModal = document.getElementById("closeSearchModal");

  if (!searchIcon || !searchModal) return;

  // Abrir modal al hacer clic en la lupa
  searchIcon.parentElement.style.cursor = "pointer";
  searchIcon.parentElement.addEventListener("click", () => {
    searchModal.classList.remove("hidden");
    searchInput.focus();
  });

  // Cerrar modal
  closeSearchModal.addEventListener("click", () => {
    searchModal.classList.add("hidden");
    searchInput.value = "";
    searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
  });

  // Cerrar modal al hacer click fuera
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      searchModal.classList.add("hidden");
      searchInput.value = "";
      searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
    }
  });

  // Búsqueda predictiva
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
      return;
    }

    // Filtrar juegos
    const filtered = GAMES_DATA.filter((game) =>
      game.nombre.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = '<p class="search-empty">No se encontraron juegos</p>';
      return;
    }

    // Renderizar resultados
    searchResults.innerHTML = filtered
      .map((game) => {
        const logrosEncoded = encodeURIComponent(JSON.stringify(game.logros));
        const gameUrl = `detalles_juego.html?titulo=${encodeURIComponent(
          game.nombre
        )}&imagen=${encodeURIComponent(
          game.imagen
        )}&año=${game.año}&descripcion=${encodeURIComponent(
          game.descripcion
        )}&rating=${game.rating}&desarrollador=${encodeURIComponent(
          game.desarrollador || "Desarrollador Desconocido"
        )}&genero=${encodeURIComponent(
          game.genero || "Género Desconocido"
        )}&plataforma=${encodeURIComponent(
          game.plataforma || "Plataforma Desconocida"
        )}&logros=${logrosEncoded}`;

        return `
          <div class="search-result-item" onclick="window.location.href='${gameUrl}'">
            <div class="search-result-img">
              <img src="${game.imagen}" alt="${game.nombre}" onerror="this.src='../img/placeholder.webp'">
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${game.nombre}</div>
              <div class="search-result-meta">⭐ ${game.rating} · ${game.año}</div>
            </div>
          </div>
        `;
      })
      .join("");
  });

  // Cerrar modal con tecla Escape pa que sea accesible jijijiji
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
      searchModal.classList.add("hidden");
      searchInput.value = "";
      searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
    }
  });
});
