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

    
    async function cargarPerfil() {
        try {
            //carga los datos del perfil y los muestra en la página
            const response = await fetch(`${API_URL}/api/users/${user.id}`);
            const data = await response.json();
            if (data.success) {
                document.getElementById("profileUsername").textContent = data.data.username;
                document.getElementById("profileBio").textContent = data.data.description || "Sin biografía"; //si no hay descripción se muestra algo por defecto  
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
        }
    }

  
    let biblioteca = [];
    async function cargarBiblioteca() {
        try {
            //carga la biblioteca del usuario y la guarda en la variable biblioteca para usarla luego
            const response = await fetch(`${API_URL}/api/users/${user.id}/library`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                biblioteca = data.data.map(game => ({
                    id: game.game_id,
                    nombre: game.title,
                    imagen: game.cover_image_url,
                    año: game.release_year,
                    desarrollador: game.developer,
                    descripcion: game.description,
                    rating: game.average_rating,
                    genero: game.genre,
                    plataforma: game.platform,
                    estado: game.status || "pendiente"
                }));
            }
        } catch (error) {
            console.error("Error cargando biblioteca:", error);
        }
    }

    // CARGAR STATS
   
    async function cargarStats() {
        try {
            const response = await fetch(`${API_URL}/api/users/${user.id}/stats`);
            const data = await response.json();
            if (data.success) {
                //estadisticas de la pagina, para contadores y demas
                const stats = data.data;
                const total = stats.total_games || 0;
                const completados = stats.completed_games || 0;
                const jugando = stats.playing_games || 0;
                const pendientes = stats.pending_games || 0;
                const abandonados = biblioteca.filter(j => j.estado === "abandonado").length;

                document.getElementById("totalGamesText").textContent = total;
                document.getElementById("completedGamesText").textContent = completados;

                const statCards = document.querySelectorAll(".stat-card h2");
                //actualiza las tarjetas de estadísticas, si alguna tarjeta no se encuentra no se hace nada pero deberían encontrarse todas porque están en el HTML
                if (statCards[0]) statCards[0].textContent = total;
                if (statCards[1]) statCards[1].textContent = completados;
                if (statCards[2]) statCards[2].textContent = jugando;
                if (statCards[3]) statCards[3].textContent = pendientes;

                //actualiza los contadores del perfil, lo mismo que antes
                const quickStats = document.querySelectorAll(".quick-stats span");
                if (quickStats[0]) quickStats[0].innerHTML = `<i data-lucide="trophy"></i> ${completados} completados`;
                if (quickStats[1]) quickStats[1].innerHTML = `<i data-lucide="gamepad-2"></i> ${total} jugados`;

                actualizarTabs(jugando, completados, pendientes, abandonados);
                lucide.createIcons();
            }
        } catch (error) {
            console.error("Error cargando stats:", error);
        }
    }

    // CARGAR SEGUIDORES
    async function cargarSeguidores() {
        try {
            //carga los seguidores y seguidos del usuario, los muestra en los modales correspondientes y devuelve un objeto con ambos arrays para usarlos luego
            const [followersRes, followingRes] = await Promise.all([
                fetch(`${API_URL}/api/users/${user.id}/followers`),
                fetch(`${API_URL}/api/users/${user.id}/following`)
            ]);
            const followersData = await followersRes.json();
            const followingData = await followingRes.json();

            if (followersData.success) {
                document.getElementById("followerCountText").textContent = followersData.count;
            }
            if (followingData.success) {
                document.getElementById("followingCountText").textContent = followingData.count;
            }

            return {
                followers: followersData.success ? followersData.data : [],
                following: followingData.success ? followingData.data : []
            };
        } catch (error) {
            console.error("Error cargando seguidores:", error);
            return { followers: [], following: [] };
        }
    }

    // RENDER JUEGOS
    function renderGameCards(filtro = "jugando") {
        //tarjetas de los juegos, si no hay juegos se muestra un mensaje informativo
        const gameGrid = document.querySelector(".game-grid");
        if (!gameGrid) return;
        gameGrid.innerHTML = "";

        //filtra los juegos según el filtro seleccionado, si el filtro es "todos" se muestran todos los juegos
        const filtrados = filtro === "todos"
            ? biblioteca
            : biblioteca.filter(g => {
                if (filtro === "jugando") return g.estado === "jugando";
                if (filtro === "completados") return g.estado === "completado";
                if (filtro === "pendientes") return g.estado === "pendiente";
                if (filtro === "abandonados") return g.estado === "abandonado";
                return true;
            });

        if (filtrados.length === 0) {
            gameGrid.innerHTML = '<p style="text-align:center; padding: 32px; color: var(--text-muted);">No hay juegos en este apartado</p>';
            return;
        }

        //renderiza las tarjetas de los juegos filtrados, si alguna información del juego no está disponible se muestra un valor por defecto
        filtrados.forEach(game => {
            const params = new URLSearchParams({
                id: game.id,
                titulo: game.nombre,
                imagen: game.imagen,
                año: game.año,
                descripcion: game.descripcion || "",
                rating: game.rating || 0,
                desarrollador: game.desarrollador || "",
                genero: game.genero || "",
                plataforma: game.plataforma || ""
            }).toString();

            const card = document.createElement("div");
            card.className = "game-card";
            card.innerHTML = `
                <a href="detalles_juego.html?${params}">
                    <div class="game-img">
                        <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
                    </div>
                    <h3>${game.nombre}</h3>
                    <p>${game.año || ""}</p>
                </a>
            `;
            gameGrid.appendChild(card);
        });
    }

    // TABS
    //función para actualizar el texto de los tabs con el número de juegos que hay en cada estado
    function actualizarTabs(jugando, completados, pendientes, abandonados) {
        document.getElementById("tab-jugando").textContent = `Jugando (${jugando})`;
        document.getElementById("tab-completados").textContent = `Completados (${completados})`;
        document.getElementById("tab-pendientes").textContent = `Pendientes (${pendientes})`;
        document.getElementById("tab-abandonados").textContent = `Abandonados (${abandonados})`;
    }

    //evento para mostrar los juegos caundo haces click en los tabs, por defecto se muestran los de "jugando"
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            if (tab.id === "tab-jugando") renderGameCards("jugando");
            else if (tab.id === "tab-completados") renderGameCards("completados");
            else if (tab.id === "tab-pendientes") renderGameCards("pendientes");
            else if (tab.id === "tab-abandonados") renderGameCards("abandonados");
        });
    });

    // MODAL SEGUIDORES
    
    let seguidoresData = { followers: [], following: [] };
    function renderFollowersList(lista, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 32px; color: var(--text-muted);">No hay usuarios aquí aún</p>';
            return;
        }

        lista.forEach(u => {
            //renderiza la lista de seguidores o seguidos
            // si no hay descripción se muestra un texto por defecto
            // en la foto de perfil se podrían mostrar imágenes pero como nuestra base de datos no las tiene se muestran las iniciales del usuario
            //  también se muestra un botón para seguir o dejar de seguir dependiendo de si ya se sigue al usuario o no
            const iniciales = u.username.substring(0, 2).toUpperCase();
            const esSiguiendo = seguidoresData.following.some(f => f.id === u.id);
            const card = document.createElement("div");
            card.className = "follower-card";
            card.innerHTML = `
            <div class="follower-avatar" style="display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.2rem;">
                ${iniciales} 
            </div>
            <div class="follower-info">
                <h3>${u.username}</h3>
                <p>${u.description || "Sin biografía"}</p>
            </div>
            ${u.id !== user.id ? `
                <button class="btn-secondary follow-toggle-btn" data-user-id="${u.id}" data-siguiendo="${esSiguiendo}">
                    ${esSiguiendo ? "Dejar de seguir" : "Seguir"}
                </button>
            ` : ''}
        `;
            container.appendChild(card);
        });

        //Eventos de los botones
        container.querySelectorAll(".follow-toggle-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const targetId = btn.dataset.userId;
                const esSiguiendo = btn.dataset.siguiendo === "true";

                try {
                    const method = esSiguiendo ? "DELETE" : "POST";
                    const response = await fetch(`${API_URL}/api/users/${targetId}/follow`, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ follower_id: user.id })
                    });
                    const data = await response.json();

                    if (data.success) {
                        //Actualizar datos de seguidores en la interfaz 
                        if (esSiguiendo) {
                            seguidoresData.following = seguidoresData.following.filter(f => f.id != targetId);
                        } else {
                            seguidoresData.following.push({ id: parseInt(targetId), username: btn.closest(".follower-card").querySelector("h3").textContent });
                        }

                        //Actualizar contador
                        document.getElementById("followingCountText").textContent = seguidoresData.following.length;

                        //Actualizar botón segun si se sigue o no al usuario
                        btn.dataset.siguiendo = esSiguiendo ? "false" : "true";
                        btn.textContent = esSiguiendo ? "Seguir" : "Dejar de seguir";
                    }
                } catch (error) {
                    console.error("Error al seguir/dejar de seguir:", error);
                }
            });
        });
    }

    const followersCounter = document.getElementById("followersCounter");
    const followersModal = document.getElementById("followersModal");
    const closeFollowersModal = document.getElementById("closeFollowersModal");

    if (followersCounter) {
        followersCounter.addEventListener("click", () => {
            renderFollowersList(seguidoresData.followers, "followersList");
            followersModal?.classList.remove("hidden");
        });
    }
    if (closeFollowersModal) closeFollowersModal.addEventListener("click", () => followersModal?.classList.add("hidden"));
    if (followersModal) followersModal.addEventListener("click", e => { if (e.target === followersModal) followersModal.classList.add("hidden"); });

    const followingCounter = document.getElementById("followingCounter");
    const followingModal = document.getElementById("followingModal");
    const closeFollowingModal = document.getElementById("closeFollowingModal");

    if (followingCounter) {
        followingCounter.addEventListener("click", () => {
            renderFollowersList(seguidoresData.following, "followingList");
            followingModal?.classList.remove("hidden");
        });
    }
    if (closeFollowingModal) closeFollowingModal.addEventListener("click", () => followingModal?.classList.add("hidden"));
    if (followingModal) followingModal.addEventListener("click", e => { if (e.target === followingModal) followingModal.classList.add("hidden"); });

    //EDITAR PERFIL (solo la bio srry)
  
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileModal = document.getElementById("editProfileModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const editProfileForm = document.getElementById("editProfileForm");
    const editBio = document.getElementById("editBio");
    const editUsername = document.getElementById("editUsername");

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            if (editUsername) editUsername.value = user.username;
            if (editBio) editBio.value = document.getElementById("profileBio").textContent;
            editProfileModal?.classList.remove("hidden");
        });
    }

    if (closeEditModal) closeEditModal.addEventListener("click", () => editProfileModal?.classList.add("hidden"));
    if (editProfileModal) editProfileModal.addEventListener("click", e => { if (e.target === editProfileModal) editProfileModal.classList.add("hidden"); });

    if (editProfileForm) {
        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newBio = editBio.value.trim();
            try {
                const response = await fetch(`${API_URL}/api/users/${user.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ description: newBio })
                });
                const data = await response.json();
                if (data.success) {
                    document.getElementById("profileBio").textContent = newBio;
                    editProfileModal?.classList.add("hidden");
                }
            } catch (error) {
                console.error("Error actualizando perfil:", error);
            }
        });
    }

    await cargarPerfil();
    await cargarBiblioteca();
    await cargarStats();
    seguidoresData = await cargarSeguidores();
    renderGameCards("jugando"); //carga primero los que tienen el estado jugando
});