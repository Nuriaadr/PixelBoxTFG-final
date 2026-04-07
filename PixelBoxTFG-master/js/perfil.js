document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ======================
  // USUARIO
  // ======================
  let user = localStorage.getItem("usuario");

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
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../index.html";
    });
  }

  // ======================
  // JUEGOS Y LOGROS
  // ======================
  const gamesData = [
    {
      nombre: "Legends of Eldoria",
      imagen: "../img/img1.webp",
      estado: "completado",
      logros: [
        {nombre: "Explorador del Mundo", descripcion: "Descubre todos los lugares secretos", rarity: "EPIC"},
        {nombre: "Maestro de Combate", descripcion: "Vence 100 enemigos", rarity: "LEGENDARY"}
      ]
    },
    {
      nombre: "Dragon Quest Online",
      imagen: "../img/img2.webp",
      estado: "completado",
      logros: [
        {nombre: "Cazador de Dragones", descripcion: "Derrota 50 dragones", rarity: "EPIC"},
        {nombre: "Héroe del Reino", descripcion: "Completa la historia principal", rarity: "LEGENDARY"}
      ]
    },
    {
      nombre: "Cyberpunk Chronicles",
      imagen: "../img/img4.webp",
      estado: "jugando",
      logros: [
        {nombre: "Hacker Maestro", descripcion: "Hackea 20 terminales", rarity: "EPIC"},
        {nombre: "Nómada Urbano", descripcion: "Visita todos los distritos", rarity: "EPIC"}
      ]
    },
    {
      nombre: "Velocity Racing",
      imagen: "../img/img4.webp",
      estado: "jugando",
      logros: [
        {nombre: "Piloto Velocista", descripcion: "Completa 10 carreras", rarity: "RARE"},
        {nombre: "Campeón de Circuitos", descripcion: "Gana un campeonato", rarity: "EPIC"}
      ]
    },
    {
      nombre: "Nightmare Manor",
      imagen: "../img/img1.webp",
      estado: "completado",
      logros: [
        {nombre: "Superviviente", descripcion: "Sobrevive la noche completa", rarity: "RARE"},
        {nombre: "Desvelador de Secretos", descripcion: "Descubre todos los misterios", rarity: "LEGENDARY"}
      ]
    },
  ];

  const games = [
    { titulo: "Cyberpunk Chronicles", estado: "jugando" },
    { titulo: "Velocity Racing", estado: "jugando" },
  ];

  // Elementos del DOM
  const tabs = document.querySelectorAll(".tab-btn");
  const gameGrid = document.querySelector(".game-grid");

  const mensaje = document.createElement("p");
  mensaje.id = "noGamesMessage";
  mensaje.textContent = "No hay juegos en este apartado";
  mensaje.classList.add("hidden");

  // Generar tarjetas de juegos dinámicamente con logros
  function renderGameCards() {
    gameGrid.innerHTML = "";

    gamesData.forEach((game) => {
      const params = new URLSearchParams({
        titulo: game.nombre,
        imagen: game.imagen,
        año: 2025,
        descripcion: "Descripción del juego",
        rating: 4.5,
        logros: game.logros ? JSON.stringify(game.logros) : "[]",
      }).toString();

      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      gameCard.id = `game-${game.nombre}`;
      gameCard.innerHTML = `
        <a href="detalles_juego.html?${params}">
          <div class="game-img" style="background-image: url('${game.imagen}')">
            <span class="tag">${game.estado.charAt(0).toUpperCase() + game.estado.slice(1)}</span>
          </div>
          <h3>${game.nombre}</h3>
          <p>2025</p>
        </a>
      `;
      gameGrid.appendChild(gameCard);
    });

    gameGrid.appendChild(mensaje);
  }

  // Renderizar juegos al cargar
  renderGameCards();
  filtrarPor("jugando"); // Aplicar filtro inicial

  function filtrarPor(tab) {
    let visibles = 0;
    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card) => {
      if (card.id === "noGamesMessage") return;

      const titulo = card.querySelector("h3").textContent.trim();
      const juego = gamesData.find((j) => j.nombre === titulo);

      let mostrar = false;

      if (tab === "jugando" && juego?.estado === "jugando") mostrar = true;
      if (tab === "completados" && juego?.estado === "completado")
        mostrar = true;
      if (tab === "pendientes" && juego?.estado === "pendiente") mostrar = true;
      if (tab === "abandonado" && juego?.estado === "abandonado") mostrar = true;
      if (tab === "todos") mostrar = true;

      if (mostrar) {
        card.style.display = "block";
        visibles++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibles === 0) {
      mensaje.classList.remove("hidden");
    } else {
      mensaje.classList.add("hidden");
    }
  }

  // ======================
  // BOTÓN SEGUIR
  // ======================
  const followBtn = document.querySelector(".btn-follow");
  const followModal = document.getElementById("followModal");
  const closeFollowModal = document.getElementById("closeFollowModal");

  let siguiendo = false;

  followBtn.addEventListener("click", () => {
    siguiendo = !siguiendo;

    if (siguiendo) {
      followBtn.innerHTML = `<i data-lucide="user-check"></i> Siguiendo`;
      followBtn.classList.add("active-follow");

      followModal.classList.remove("hidden");
      lucide.createIcons();
    } else {
      followBtn.innerHTML = `<i data-lucide="user-plus"></i> Seguir`;
      followBtn.classList.remove("active-follow");
    }
  });

  closeFollowModal.addEventListener("click", () => {
    followModal.classList.add("hidden");
  });

  function actualizarContadores() {
    let total = gamesData.length;
    let jugando = gamesData.filter((g) => g.estado === "jugando").length;
    let completados = gamesData.filter((g) => g.estado === "completado").length;
    let pendientes = gamesData.filter((g) => g.estado === "pendiente").length;

    let logros = document.querySelectorAll(".achievement-card").length;

    document.getElementById("tab-jugando").textContent = `Jugando (${jugando})`;
    document.getElementById("tab-completados").textContent =
      `Completados (${completados})`;
    document.getElementById("tab-pendientes").textContent =
      `Pendientes (${pendientes})`;
    document.getElementById("tab-abandonados").textContent = `Abandonados (0)`;
    document.getElementById("tab-logros").textContent = `Logros (${logros})`;
  }

  actualizarContadores();

  // ======================
  // LOGROS
  // ======================
  function obtenerTodosLosLogros() {
    const todosLosLogros = [];
    gamesData.forEach((game) => {
      if (game.logros && game.logros.length > 0) {
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
      container.innerHTML = "<p style='text-align: center; color: #999;'>No hay logros aún</p>";
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
        filtrarPor("jugando");
      } else if (tab.id === "tab-completados") {
        gameGrid.classList.remove("hidden");
        filtrarPor("completados");
      } else if (tab.id === "tab-pendientes") {
        gameGrid.classList.remove("hidden");
        filtrarPor("pendientes");
      } else if (tab.id === "tab-abandonados") {
        gameGrid.classList.remove("hidden");
        filtrarPor("abandonado");
      } else if (tab.id === "tab-favoritos") {
        gameGrid.classList.remove("hidden");
        filtrarPor("favoritos");
      } else if (tab.id === "tab-logros") {
        if (achievementsSection) achievementsSection.classList.remove("hidden");
      }
    });
  });

  actualizarTabs();
  actualizarStats();
});
