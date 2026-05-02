document.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons();

    const userStr = localStorage.getItem("usuario");
    const user = JSON.parse(userStr);

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    const userAvatar = document.getElementById("userAvatar");
    if (userAvatar) {
        userAvatar.style.cursor = "pointer";
        userAvatar.addEventListener("click", () => {
            window.location.href = "perfil.html";
        });
    }

    setupLogoutHandler();
    await initializeGamesData();

    let biblioteca = [];
    let favoritosActuales = [];
    let filtroActual = "todos";

    // CARGAR BIBLIOTECA
    async function cargarBiblioteca() {
        try {
            const response = await fetch(`${API_URL}/api/users/${user.id}/library`);
            if (!response.ok) return;
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                biblioteca = data.data.map(game => ({
                    id: game.id,
                    gameId: game.game_id,
                    nombre: game.title,
                    imagen: game.cover_image_url,
                    año: game.release_year,  
                    desarrollador: game.developer,
                    descripcion: game.description,
                    rating: game.average_rating,
                    genero: game.genre,
                    plataforma: game.platform,
                    estado: game.status || "pendiente" //si no hay estado se pone pendiente por defecto
                }));
            }
        } catch (error) {
            console.error('Error cargando biblioteca:', error);
        }
    }

    // MODAL ELIMINAR
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modalText");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    let juegoAEliminar = null;

    function cerrarModal() {
        if (modal) {
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
        juegoAEliminar = null;
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", async () => {
            if (juegoAEliminar) {
                try {
                    const response = await fetch(
                        `${API_URL}/api/users/${user.id}/library/${juegoAEliminar.gameId}`,
                        { method: "DELETE" }
                    );
                    const data = await response.json();
                    if (data.success) {
                        biblioteca = biblioteca.filter(j => j.gameId !== juegoAEliminar.gameId);
                        renderizarJuegos();
                        await actualizarContadores();
                        aplicarFiltro(favoritosActuales);
                    }
                } catch (error) {
                    console.error('Error eliminando juego:', error);
                }
            }
            cerrarModal();
        });
    }

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", cerrarModal);
    if (modal) modal.addEventListener("click", e => { if (e.target === modal) cerrarModal(); });

    // RENDER
    function renderizarJuegos() {
        const container = document.querySelector(".card-grid");
        if (!container) return;

        container.querySelectorAll(".game-card").forEach(card => card.remove());

        if (biblioteca.length === 0) {
            const noGamesDiv = document.getElementById("noGamesMessage");
            if (noGamesDiv) noGamesDiv.style.display = "block";
            return;
        }

        const noGamesDiv = document.getElementById("noGamesMessage");
        if (noGamesDiv) noGamesDiv.style.display = "none";

        biblioteca.forEach(juego => {
            const card = document.createElement("div");
            card.className = "game-card";
            card.dataset.gameId = juego.gameId;

            //url del juego para ir a detalle juego
            const href = `detalles_juego.html?id=${juego.gameId}&titulo=${encodeURIComponent(juego.nombre)}&imagen=${encodeURIComponent(juego.imagen)}&año=${juego.año}&descripcion=${encodeURIComponent(juego.descripcion || "")}&rating=${juego.rating || 0}&desarrollador=${encodeURIComponent(juego.desarrollador || "")}&genero=${encodeURIComponent(juego.genero || "")}&plataforma=${encodeURIComponent(juego.plataforma || "")}`;

            card.innerHTML = `
                <i class="delete-game" data-lucide="x"></i>
                <a href="${href}">
                    <div class="game-img">
                        <img src="${juego.imagen}" alt="${juego.nombre}" loading="lazy">
                    </div>
                    <h3>${juego.nombre}</h3>
                    <span>${juego.año || ""}</span>
                </a>
            `;
            container.appendChild(card);
        });

        lucide.createIcons();
        agregarEventosEliminar();
    }

    // ELIMINAR
    function agregarEventosEliminar() {
        document.querySelectorAll(".delete-game").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();

                const card = btn.closest(".game-card");
                const gameId = parseInt(card.dataset.gameId);
                const juego = biblioteca.find(j => j.gameId === gameId);
             
                juegoAEliminar = juego;
                if (modalText) modalText.textContent = `¿Seguro que quieres eliminar "${juego.nombre}" de tu biblioteca?`;
                if (modal) {
                    modal.classList.remove("hidden");
                    modal.style.display = "flex";
                }
            });
        });
    }

    // FAVORITOS
    async function obtenerFavoritosList() {
        try {
            const response = await fetch(`${API_URL}/api/users/${user.id}/favorites`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                return data.data.map(g => g.id);
            }
        } catch (error) {
            console.error('Error obteniendo favoritos:', error);
        }
        return [];
    }

    // FILTROS
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filtroActual = btn.dataset.filter || "todos";
            aplicarFiltro(favoritosActuales);
        });
    });

    function aplicarFiltro(favoritosList = []) {
        const cards = document.querySelectorAll(".game-card");
        let visibles = 0;

        //Mostrar u ocultar juegos según el filtro
        cards.forEach(card => {
            const gameId = parseInt(card.dataset.gameId);
            const item = biblioteca.find(b => b.gameId === gameId);
            let mostrar = false;

            if (filtroActual === "todos") {
                mostrar = true;
            } else if (filtroActual === "favoritos") {
                mostrar = favoritosList.includes(gameId);
            } else {
                mostrar = item && item.estado === filtroActual;
            }

            card.style.display = mostrar ? "block" : "none";
            if (mostrar) visibles++;
        });

        // Mostrar mensaje si no hay juegos visibles
        const mensaje = document.getElementById("noGamesMessage");
        if (mensaje) mensaje.style.display = visibles === 0 ? "block" : "none"; 
    }

    // CONTADORES
    async function actualizarContadores() {
        favoritosActuales = await obtenerFavoritosList();

        const total = biblioteca.length;
        const jugando = biblioteca.filter(j => j.estado === "jugando").length;
        const completados = biblioteca.filter(j => j.estado === "completado").length;
        const pendientes = biblioteca.filter(j => j.estado === "pendiente").length;
        const abandonados = biblioteca.filter(j => j.estado === "abandonado").length;
        const favoritos = biblioteca.filter(b => favoritosActuales.includes(b.gameId)).length;

        const cardBlue = document.querySelector(".card-blue .number");
        const numberGreen = document.querySelector(".number.text-green");
        const numberBlueLight = document.querySelector(".number.text-blue-light");
        const numberYellow = document.querySelector(".number.text-yellow");

        if (cardBlue) cardBlue.textContent = total;
        if (numberGreen) numberGreen.textContent = completados;
        if (numberBlueLight) numberBlueLight.textContent = jugando;
        if (numberYellow) numberYellow.textContent = pendientes;

        const filterBtns = document.querySelectorAll(".filter-btn");
        if (filterBtns[0]) filterBtns[0].querySelector(".count").textContent = total;
        if (filterBtns[1]) filterBtns[1].querySelector(".count").textContent = jugando;
        if (filterBtns[2]) filterBtns[2].querySelector(".count").textContent = completados;
        if (filterBtns[3]) filterBtns[3].querySelector(".count").textContent = pendientes;
        if (filterBtns[4]) filterBtns[4].querySelector(".count").textContent = abandonados;
        if (filterBtns[5]) filterBtns[5].querySelector(".count").textContent = favoritos;
    }

    //la biblioteca se carga solo una vez
    await cargarBiblioteca();
    renderizarJuegos();
    await actualizarContadores();
    aplicarFiltro(favoritosActuales);
});