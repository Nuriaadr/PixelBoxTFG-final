//Aqui se cargan todos los datos globales como juegos y eso
let GAMES_DATA = [];
async function initializeGamesData() {
    try {
        const response = await fetch(`${API_URL}/api/games`);
        const data = await response.json();
        if (data.success) {
            GAMES_DATA = data.data.map(game => ({
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
        }
    } catch (error) {
        console.error('Error cargando juegos:', error);
    }
}

//para detalle juego se pasan los datos del juego por parametros de url (si encontráis otra forma decidmelo oye)
function getGameDetailsUrl(game) {
    return `detalles_juego.html?id=${game.id}&titulo=${encodeURIComponent(game.nombre)}&imagen=${encodeURIComponent(game.imagen)}&año=${game.año}&descripcion=${encodeURIComponent(game.descripcion)}&rating=${game.rating}&desarrollador=${encodeURIComponent(game.desarrollador)}&genero=${encodeURIComponent(game.genero)}&plataforma=${encodeURIComponent(game.plataforma)}`;
}

function findGameByName(name) {
    return GAMES_DATA.find(game => game.nombre.toLowerCase() === name.toLowerCase());
}


function filterGames(query) {
    return GAMES_DATA.filter(game =>
        game.nombre.toLowerCase().includes(query.toLowerCase())
    );
}

// LOGOUT
function setupLogoutHandler(buttonId = "logoutBtn") {
    const logoutBtn = document.getElementById(buttonId);
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }

    const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");
    if (logoutBtnDesktop) {
        logoutBtnDesktop.addEventListener("click", (e) => {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }
}

function showLogoutConfirmation() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "logoutConfirmation";
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Cerrar sesión</h3>
            <p>¿Seguro que quieres cerrar sesión?</p>
            <div class="modal-actions" style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button id="cancelLogoutBtn" class="btn-secondary">Cancelar</button>
                <button id="confirmLogoutBtn" class="btn-primary">Cerrar sesión</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("cancelLogoutBtn").addEventListener("click", () => modal.remove());
    document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("rol");
        localStorage.removeItem("token");
        window.location.href = "../index.html";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}