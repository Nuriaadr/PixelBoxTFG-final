document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ======================
  // USUARIO
  // ======================
  let user = localStorage.getItem("usuario");

  // Migrar usuario sin @ a con @
  if (user && !user.startsWith("@")) {
    user = "@" + user;
    localStorage.setItem("usuario", user);
  }

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  let userName = document.getElementById("userName");
  if (userName) userName.textContent = user;

  let userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    setupLogoutHandler();
  }

  // ======================
  // CARGA DE DATOS DEL PERFIL
  // ======================
  const userData = USERS_DATA.find(u => u.username === user);

  if (userData) {
    document.getElementById("profileUsername").textContent = userData.username;
    document.getElementById("profileBio").textContent = userData.description;

    // Cargar avatar
    const avatarLarge = document.querySelector(".avatar-large");
    if (avatarLarge && userData.avatar) {
      avatarLarge.style.backgroundImage = `url(${userData.avatar})`;
    }
  }

  // Verificar si hay bio guardada en localStorage
  const savedBio = localStorage.getItem(`bio_${user}`);
  if (savedBio) {
    document.getElementById("profileBio").textContent = savedBio;
  }

  // ======================
  // ESTADÍSTICAS DINÁMICAS DEL PERFIL
  // ======================
  function updateGameStats() {
    // Solo calcular dinámicamente para @jugador_pro (usuario principal)
    if (user !== "@jugador_pro") {
      // Para otros usuarios, usar valores por defecto o del USERS_DATA
      const userData = USERS_DATA.find(u => u.username === user);
      const totalGamesText = document.getElementById("totalGamesText");
      const completedGamesText = document.getElementById("completedGamesText");

      if (totalGamesText && userData) {
        totalGamesText.textContent = userData.games || 0;
      }
      if (completedGamesText) {
        completedGamesText.textContent = "0"; // Por defecto 0 para otros usuarios
      }
      return;
    }

    // Para @jugador_pro: calcular desde la biblioteca real
    const biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");

    // Contar juegos totales
    const totalGames = biblioteca.length;

    // Contar juegos completados
    const completedGames = biblioteca.filter(juego =>
      juego.estado === "completado" || juego.estado === "terminado"
    ).length;

    // Actualizar elementos HTML
    const totalGamesText = document.getElementById("totalGamesText");
    const completedGamesText = document.getElementById("completedGamesText");

    if (totalGamesText) {
      totalGamesText.textContent = totalGames;
    }
    if (completedGamesText) {
      completedGamesText.textContent = completedGames;
    }
  }

  // Actualizar estadísticas iniciales
  updateGameStats();

  // Actualizar estadísticas cuando se regresa a la pestaña
  window.addEventListener("focus", () => {
    updateGameStats();
  });

  // ======================
  // JUEGOS Y LOGROS
  // ======================
  // Los juegos se cargan de GAMES_DATA
  // La biblioteca solo guarda referencias
 

  // Cargar referencias de la biblioteca
  let bibliotecaRaw = JSON.parse(localStorage.getItem("biblioteca") || "[]");
  
  // Migrar datos antiguos al nuevo formato si es necesario
  let bibliotecaReferencias = bibliotecaRaw.map(item => {
    // Si tiene nombreJuego, ya está en nuevo formato
    if (item.nombreJuego) {
      return item;
    }
    // Si tiene nombre, es formato antiguo, migrar
    else if (item.nombre) {
      return {
        nombreJuego: item.nombre,
        estado: item.estado || "pendiente"
      };
    }
    // Si no tiene ninguno, asumir que es nombreJuego
    else {
      return {
        nombreJuego: item,
        estado: "pendiente"
      };
    }
  });
  
  // Guardar la versión migrada
  localStorage.setItem("biblioteca", JSON.stringify(bibliotecaReferencias));

  // Función para obtener juego completo desde GAMES_DATA
  function obtenerJuegoCompleto(nombreJuego) {
    const juego = GAMES_DATA.find(g => g.nombre.toLowerCase() === nombreJuego.toLowerCase());
    if (juego) {
      const ref = bibliotecaReferencias.find(b => b.nombreJuego.toLowerCase() === juego.nombre.toLowerCase());
      return {
        ...juego,
        estado: ref?.estado || "pendiente"
      };
    }
    return null;
  }

  // Obtener todos los juegos con datos 
  function obtenerTodosLosJuegos() {
    return bibliotecaReferencias
      .map(ref => obtenerJuegoCompleto(ref.nombreJuego))
      .filter(juego => juego !== null);
  }

  let gamesData = obtenerTodosLosJuegos();

  // Elementos del DOM
  const tabs = document.querySelectorAll(".tab-btn");
  const gameGrid = document.querySelector(".game-grid");

  const mensaje = document.createElement("p");
  mensaje.id = "noGamesMessage";
  mensaje.textContent = "No hay juegos en este apartado";
  mensaje.classList.add("hidden");

  // Generar tarjetas de juegos dinámicamente con logros
  function renderGameCards(filtro = "todos") {
    gameGrid.innerHTML = "";

    let juegosFiltrados = gamesData;

    if (filtro !== "todos") {
      juegosFiltrados = gamesData.filter(game => {
        if (filtro === "jugando") return game.estado === "jugando";
        if (filtro === "completados") return game.estado === "completado";
        if (filtro === "pendientes") return game.estado === "pendiente";
        if (filtro === "abandonados") return game.estado === "abandonado";
        return true;
      });
    }

    if (juegosFiltrados.length === 0) {
      mensaje.classList.remove("hidden");
      gameGrid.appendChild(mensaje);
      return;
    } else {
      mensaje.classList.add("hidden");
    }

    const fragment = document.createDocumentFragment();

    juegosFiltrados.forEach((game) => {
      const params = new URLSearchParams({
        titulo: game.nombre,
        imagen: game.imagen,
        año: game.año,
        descripcion: game.descripcion,
        rating: game.rating,
        logros: game.logros ? JSON.stringify(game.logros) : "[]",
      }).toString();

      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      gameCard.id = `game-${game.nombre}`;
      gameCard.innerHTML = `
        <a href="detalles_juego.html?${params}">
          <div class="game-img">
            <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
          </div>
          <h3>${game.nombre}</h3>
          <p>${game.año}</p>
        </a>
      `;
      fragment.appendChild(gameCard);
    });

    gameGrid.appendChild(fragment);
  }

  // Renderizar juegos al cargar con filtro inicial
  renderGameCards("jugando");

  // ======================
  // MODAL DE SEGUIDORES
  // ======================
  const followersCounter = document.getElementById("followersCounter");
  const followerCountText = document.getElementById("followerCountText");
  const followersModal = document.getElementById("followersModal");
  const closeFollowersModal = document.getElementById("closeFollowersModal");
  const followersList = document.getElementById("followersList");

  // Actualizar contador de seguidores dinámicamente
  function updateFollowerCounter() {
    const seguidores = getFollowersOfUser(user);
    followerCountText.textContent = seguidores.length;
  }

  // Forzar actualización de contadores después de inicializar seguidores
  setTimeout(() => {
    updateFollowerCounter();
    updateFollowingCounter();
  }, 100);

  function renderFollowers() {
    followersList.innerHTML = "";

    // Obtener seguidores dinámicamente del usuario actual
    const seguidores = getFollowersOfUser(user);

    if (seguidores.length === 0) {
      followersList.innerHTML = "<p style='text-align: center; padding: 32px; color: var(--text-muted);'>No tienes seguidores aún</p>";
      return;
    }

    seguidores.forEach(follower => {
      const isFollowingUser = isFollowing(user, follower.username);
      const buttonText = isFollowingUser ? "Dejar de seguir" : "Seguir";
      const buttonClass = "btn-secondary follow-btn";

      const followerCard = document.createElement("div");
      followerCard.className = "follower-card";
      followerCard.innerHTML = `
        <div class="follower-avatar" style="background-image: url('${follower.avatar}')"></div>
        <div class="follower-info">
          <h3>${follower.username}</h3>
          <p>${follower.description}</p>
          <span class="follower-games">${follower.games} juegos</span>
        </div>
        <button class="${buttonClass}" data-username="${follower.username}">
          ${buttonText}
        </button>
      `;
      followersList.appendChild(followerCard);
    });

    // Añadir event listeners a los botones
    document.querySelectorAll('.follow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetUser = e.target.dataset.username;
        toggleFollow(user, targetUser);
        // Re-render para actualizar botones
        renderFollowers();
        updateFollowerCounter();
      });
    });

    lucide.createIcons();
  }

  if (followersCounter) {
    followersCounter.addEventListener("click", () => {
      updateFollowerCounter();
      renderFollowers();
      followersModal?.classList.remove("hidden");
    });
  }

  if (closeFollowersModal) {
    closeFollowersModal.addEventListener("click", () => {
      followersModal?.classList.add("hidden");
    });
  }

  if (followersModal) {
    followersModal.addEventListener("click", (e) => {
      if (e.target === followersModal) {
        followersModal.classList.add("hidden");
      }
    });
  }

  // ======================
  // MODAL DE SEGUIDOS
  // ======================
  const followingCounter = document.getElementById("followingCounter");
  const followingCountText = document.getElementById("followingCountText");
  const followingModal = document.getElementById("followingModal");
  const closeFollowingModal = document.getElementById("closeFollowingModal");
  const followingList = document.getElementById("followingList");

  // Actualizar contador de seguidos dinámicamente
  function updateFollowingCounter() {
    const following = getUserFollowing(user);
    followingCountText.textContent = following.length;
  }

  // Forzar actualización de contador después de inicializar seguidores
  setTimeout(() => {
    updateFollowingCounter();
  }, 100);

  function renderFollowing() {
    followingList.innerHTML = "";

    // Obtener usuarios que se siguen
    const following = getUserFollowing(user);

    if (following.length === 0) {
      followingList.innerHTML = "<p style='text-align: center; padding: 32px; color: var(--text-muted);'>No sigues a nadie aún</p>";
      return;
    }

    following.forEach(followingUsername => {
      const followedUser = USERS_DATA.find(u => u.username === followingUsername);
      
      if (followedUser) {
        const followingCard = document.createElement("div");
        followingCard.className = "follower-card";
        followingCard.innerHTML = `
          <div class="follower-avatar" style="background-image: url('${followedUser.avatar}')"></div>
          <div class="follower-info">
            <h3>${followedUser.username}</h3>
            <p>${followedUser.description}</p>
            <span class="follower-games">${followedUser.games} juegos</span>
          </div>
          <button class="btn-secondary follow-btn-unfollow" data-username="${followedUser.username}">
            Dejar de Seguir
          </button>
        `;
        followingList.appendChild(followingCard);
      }
    });

    // Añadir event listeners a los botones de dejar de seguir
    document.querySelectorAll('.follow-btn-unfollow').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetUser = e.target.dataset.username;
        toggleFollow(user, targetUser);
        // Re-render para actualizar lista
        renderFollowing();
        updateFollowingCounter();
      });
    });

    lucide.createIcons();
  }

  if (followingCounter) {
    followingCounter.addEventListener("click", () => {
      updateFollowingCounter();
      renderFollowing();
      followingModal?.classList.remove("hidden");
    });
  }

  if (closeFollowingModal) {
    closeFollowingModal.addEventListener("click", () => {
      followingModal?.classList.add("hidden");
    });
  }

  if (followingModal) {
    followingModal.addEventListener("click", (e) => {
      if (e.target === followingModal) {
        followingModal.classList.add("hidden");
      }
    });
  }

  // ======================
  // LOGROS
  // ======================
  function obtenerTodosLosLogros() {
    const todosLosLogros = [];
    gamesData.forEach((game) => {
      // Solo incluir logros de juegos que estén jugando o completados
      if ((game.estado === "jugando" || game.estado === "completado") && game.logros && game.logros.length > 0) {
        game.logros.forEach((logro) => {
          todosLosLogros.push({
            ...logro,
            juego: game.nombre,
            fecha: new Date().toISOString().split("T")[0],
            imagen: "../img/img1.webp",
          });
        });
      }
    });
    return todosLosLogros;
  }

  const logrosData = obtenerTodosLosLogros();

  function renderAchievements() {
    const container = document.getElementById("achievementsContainer");
    container.innerHTML = "";

    if (logrosData.length === 0) {
      container.innerHTML = "<p style='text-align: center; color: var(--text-muted);'>No hay logros aún</p>";
      return;
    }

    logrosData.forEach((logro) => {
      const rarityClass = `rarity-${logro.rarity.toLowerCase()}`;
      const card = document.createElement("div");
      card.className = `achievement-card ${rarityClass}`;
      card.innerHTML = `
        <img src="${logro.imagen}" alt="logro" class="achievement-img">

        <div class="achievement-info">
          <h3>${logro.nombre}</h3>
          <p>${logro.descripcion}</p>
          <span class="rarity rarity-badge-${logro.rarity.toLowerCase()}">${logro.rarity}</span>
        </div>

        <div class="achievement-meta">
          <i data-lucide="award" class="trophy"></i>
          <span class="date">${logro.fecha}</span>
        </div>
      `;
      container.appendChild(card);
    });
    lucide.createIcons();
  }

  // Renderizar logros al cargar
  renderAchievements();

  function actualizarTabs() {
    let jugando = gamesData.filter((g) => g.estado === "jugando").length;
    let completados = gamesData.filter((g) => g.estado === "completado").length;
    let pendientes = gamesData.filter((g) => g.estado === "pendiente").length;
    let abandonados = gamesData.filter((g) => g.estado === "abandonado").length;
    let logros = logrosData.length;

    document.getElementById("tab-jugando").textContent = `Jugando (${jugando})`;
    document.getElementById("tab-completados").textContent =
      `Completados (${completados})`;
    document.getElementById("tab-pendientes").textContent =
      `Pendientes (${pendientes})`;

    document.getElementById("tab-abandonados").textContent =
      `Abandonados (${abandonados})`;
    document.getElementById("tab-logros").textContent = `Logros (${logros})`;
  }

  function actualizarStats() {
    let total = gamesData.length;
    let jugando = gamesData.filter((g) => g.estado === "jugando").length;
    let completados = gamesData.filter((g) => g.estado === "completado").length;
    let pendientes = gamesData.filter((g) => g.estado === "pendiente").length;

    // Actualizar quick-stats
    const quickStats = document.querySelectorAll(".quick-stats span");
    if (quickStats[0])
      quickStats[0].innerHTML = `<i data-lucide="trophy"></i> ${completados} completados`;
    if (quickStats[1])
      quickStats[1].innerHTML = `<i data-lucide="gamepad-2"></i> ${total} jugados`;

    // Actualizar stat-cards
    const statCards = document.querySelectorAll(".stat-card h2");
    if (statCards[0]) statCards[0].textContent = total;
    if (statCards[1]) statCards[1].textContent = completados;
    if (statCards[2]) statCards[2].textContent = jugando;
    if (statCards[3]) statCards[3].textContent = pendientes;

    lucide.createIcons();
  }

  // Tab switching - consolidado
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Ocultar todas las secciones
      gameGrid.classList.add("hidden");
      const achievementsSection = document.getElementById("achievements-section");
      if (achievementsSection) achievementsSection.classList.add("hidden");

      // Mostrar sección correspondiente
      if (tab.id === "tab-jugando") {
        gameGrid.classList.remove("hidden");
        renderGameCards("jugando");
      } else if (tab.id === "tab-completados") {
        gameGrid.classList.remove("hidden");
        renderGameCards("completados");
      } else if (tab.id === "tab-pendientes") {
        gameGrid.classList.remove("hidden");
        renderGameCards("pendientes");
      } else if (tab.id === "tab-abandonados") {
        gameGrid.classList.remove("hidden");
        renderGameCards("abandonados");
      } else if (tab.id === "tab-logros") {
        if (achievementsSection) achievementsSection.classList.remove("hidden");
      }
    });
  });

  actualizarTabs();
  actualizarStats();
});
