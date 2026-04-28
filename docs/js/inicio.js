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

    // Cargar juegos desde la API
    await initializeGamesData();

    // Tendencias: últimos 4 juegos
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
        if (!modal) return;
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
            const cyberpunk = findGameByName("Cyberpunk Chronicles");
            if (!cyberpunk) return;

            try {
                const checkResponse = await fetch(`${API_URL}/api/users/${user.id}/library/has/${cyberpunk.id}`);
                const checkData = await checkResponse.json();

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

    // Likes aleatorios
    document.querySelectorAll(".review-likes").forEach(span => {
        const likes = Math.floor(Math.random() * 101);
        span.textContent = likes === 1
            ? "1 persona encontró útil esta reseña"
            : `${likes} personas encontraron útil esta reseña`;
    });
});