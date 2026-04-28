// ===================== BÚSQUEDA =====================
document.addEventListener("DOMContentLoaded", () => {
    const searchIcon = document.querySelector('i[data-lucide="search"]');
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const closeSearchModal = document.getElementById("closeSearchModal");

    if (!searchIcon || !searchModal) return;

    // Abrir modal
    searchIcon.parentElement.style.cursor = "pointer";
    searchIcon.parentElement.addEventListener("click", () => {
        searchModal.classList.remove("hidden");
        searchInput.focus();
    });

    // Cerrar modal
    function cerrarModal() {
        searchModal.classList.add("hidden");
        searchInput.value = "";
        searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
    }

    closeSearchModal.addEventListener("click", cerrarModal);
    searchModal.addEventListener("click", (e) => { if (e.target === searchModal) cerrarModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarModal(); });

    // Búsqueda con debounce para no hacer una petición por cada tecla
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();

        clearTimeout(searchTimeout);

        if (!query) {
            searchResults.innerHTML = '<p class="search-placeholder">Escribe para buscar juegos...</p>';
            return;
        }

        // Espera 300ms después de que el usuario deje de escribir
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/api/games/search/${encodeURIComponent(query)}`);
                const data = await response.json();

                if (!data.success || data.data.length === 0) {
                    searchResults.innerHTML = '<p class="search-placeholder">No se encontraron juegos</p>';
                    return;
                }

                searchResults.innerHTML = data.data.map(game => {
                    const params = new URLSearchParams({
                        id: game.id,
                        titulo: game.title,
                        imagen: game.cover_image_url,
                        año: game.release_year,
                        descripcion: game.description,
                        rating: game.average_rating,
                        desarrollador: game.developer,
                        genero: game.genre,
                        plataforma: game.platform
                    }).toString();

                    return `
                        <div class="search-result-item" onclick="window.location.href='detalles_juego.html?${params}'">
                            <div class="search-result-img">
                                <img src="${game.cover_image_url}" alt="${game.title}" onerror="this.src='../img/placeholder.webp'">
                            </div>
                            <div class="search-result-content">
                                <div class="search-result-title">${game.title}</div>
                                <div class="search-result-meta">★ ${game.average_rating} · ${game.release_year}</div>
                            </div>
                        </div>
                    `;
                }).join('');

            } catch (error) {
                console.error('Error buscando juegos:', error);
                searchResults.innerHTML = '<p class="search-placeholder">Error al buscar juegos</p>';
            }
        }, 300);
    });
});