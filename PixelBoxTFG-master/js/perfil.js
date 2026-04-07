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
  // TABS
  // ======================
  const tabs = document.querySelectorAll(".tab-btn");
  const gameGrid = document.querySelector(".game-grid");

  const games = [
    { titulo: "Cyberpunk Chronicles", estado: "jugando" },
    { titulo: "Velocity Racing", estado: "jugando" },
  ];

  const mensaje = document.createElement("p");
  mensaje.id = "noGamesMessage";
  mensaje.textContent = "No hay juegos en este apartado";
  mensaje.classList.add("hidden");
  gameGrid.appendChild(mensaje);

  function filtrarPor(tab) {
    let visibles = 0;
    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card) => {
      const titulo = card.querySelector("h3").textContent.trim();
      const juego = games.find((j) => j.titulo === titulo);

      let mostrar = false;

      if (tab === "jugando" && juego?.estado === "jugando") mostrar = true;
      if (tab === "completados" && juego?.estado === "completado")
        mostrar = true;
      if (tab === "pendientes" && juego?.estado === "pendiente") mostrar = true;
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

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.id === "tab-jugando") filtrarPor("jugando");
      if (tab.id === "tab-completados") filtrarPor("completados");
      if (tab.id === "tab-pendientes") filtrarPor("pendientes");
      if (tab.id === "tab-favoritos") filtrarPor("favoritos");
      if (tab.id === "tab-logros") filtrarPor("logros");
    });
  });

  filtrarPor("jugando");

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
    let total = games.length;
    let jugando = games.filter((g) => g.estado === "jugando").length;
    let completados = games.filter((g) => g.estado === "completado").length;
    let pendientes = games.filter((g) => g.estado === "pendiente").length;

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

  function actualizarTabs() {
    let jugando = games.filter((g) => g.estado === "jugando").length;
    let completados = games.filter((g) => g.estado === "completado").length;
    let pendientes = games.filter((g) => g.estado === "pendiente").length;
    let abandonados = games.filter((g) => g.estado === "abandonado").length;
    let logros = document.querySelectorAll(".achievement-card").length;

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
    let total = games.length;
    let jugando = games.filter((g) => g.estado === "jugando").length;
    let completados = games.filter((g) => g.estado === "completado").length;
    let pendientes = games.filter((g) => g.estado === "pendiente").length;

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
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelector(".game-grid").classList.add("hidden");
      document.getElementById("achievements-section").classList.add("hidden");

      if (tab.id === "tab-jugando") {
        document.querySelector(".game-grid").classList.remove("hidden");
        filtrarPor("jugando");
      }

      if (tab.id === "tab-completados") {
        document.querySelector(".game-grid").classList.remove("hidden");
        filtrarPor("completados");
      }

      if (tab.id === "tab-pendientes") {
        document.querySelector(".game-grid").classList.remove("hidden");
        filtrarPor("pendientes");
      }

      if (tab.id === "tab-favoritos") {
        document.querySelector(".game-grid").classList.remove("hidden");
        filtrarPor("favoritos");
      }

      if (tab.id === "tab-logros") {
        document
          .getElementById("achievements-section")
          .classList.remove("hidden");
      }
    });
  });
  actualizarTabs();
  actualizarStats();
});
