document.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons();

    let user = JSON.parse(localStorage.getItem("usuario"));
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    let userAvatar = document.getElementById("userAvatar");
    if (userAvatar) {
        userAvatar.style.cursor = "pointer";
        userAvatar.addEventListener("click", () => {
            window.location.href = "perfil.html";
        });
    }

    setupLogoutHandler();

    //Cargar juegos desde la API
    await initializeGamesData();

    //En tendencias van a salir siempre los ultimos 4 juegos pero podrian salir otros
    function renderTrendingGames() {
        const cardGrid = document.querySelector(".section .card-grid");
        if (!cardGrid) return;

        const tendencias = GAMES_DATA.slice(-4);
        cardGrid.innerHTML = tendencias.map(game => `
            <div class="game-card">
                <a href="${getGameDetailsUrl(game)}">
                    <div class="game-img">
                        <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
                    </div>
                    <h3>${game.nombre}</h3>
                    <p>${game.año}</p>
                </a>
            </div>
        `).join('');
    }

    renderTrendingGames();

    // MODAL
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const closeModal = document.getElementById("closeModal");

    function showModal(title, message) {
        if (!modal) return; //por si acaso no se encuentra el modal, aunque debería estar siempre
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove("hidden");
    }

    function hideModal() { modal.classList.add("hidden"); }
    if (closeModal) closeModal.addEventListener("click", hideModal);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });

    // BOTÓN AGREGAR A BIBLIOTECA
    const addGameBtn = document.getElementById("addGameBtn");
    if (addGameBtn) {
        addGameBtn.addEventListener("click", async () => {
            const cyberpunk = findGameByName("Cyberpunk Chronicles"); //como este es el juego que se muestra en el inicio, se añade ese a la biblioteca al pulsar el botón, pero podria ser cualquier otro
            if (!cyberpunk) return; //si no se encuentra el juego no se hace nada, aunque debería encontrarse siempre porque el juego está en el JSON de datos

            try {
                const checkResponse = await fetch(`${API_URL}/api/users/${user.id}/library/has/${cyberpunk.id}`);
                const checkData = await checkResponse.json();

                //si el juego ya está en la biblioteca se muestra un modal informando de ello, si no se añade a la bibliotec
                if (checkData.hasGame) {
                    showModal("Ya en biblioteca", "Este juego ya está en tu biblioteca");
                    return;
                }

                const addResponse = await fetch(`${API_URL}/api/users/${user.id}/library/${cyberpunk.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'jugando' })
                });

                const addData = await addResponse.json();
                showModal(addData.success ? "¡Genial!" : "Error", addData.message);

            } catch (error) {
                showModal("Error", "No se pudo conectar con el servidor");
            }
        });
    }

    // Likes aleatorios para las reseñas
    document.querySelectorAll(".review-likes").forEach(span => {
        const likes = Math.floor(Math.random() * 101);
        span.textContent = likes === 1
            ? "1 persona encontró útil esta reseña"
            : `${likes} personas encontraron útil esta reseña`;
    });
});