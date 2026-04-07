document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  let user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  // MOSTRAR USUARIO
  let userName = document.getElementById("userName");
  if (userName) {
    userName.textContent = user;
  }

  let userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  // LOGOUT
  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../index.html";
    });
  }

  // ======================
  // DATOS DE LOS JUEGOS
  // ======================
  let juegos = [
    { titulo: "Legends of Eldoria", estado: "completado" },
    { titulo: "Dragon Quest Online", estado: "jugando" },
    { titulo: "Velocity Racing", estado: "pendiente" },
    { titulo: "Cyberpunk Chronicles", estado: "jugando" },
    { titulo: "Nightmare Manor", estado: "pendiente" },
    { titulo: "Stellar Odyssey", estado: "completado" },
    { titulo: "Shadow Castle", estado: "pendiente" },
    { titulo: "Pixel Warriors", estado: "jugando" },
  ];

  let filtroActual = "todos";
  let juegoAEliminar = null;

  // ======================
  // FILTRAR JUEGOS
  // ======================
  function aplicarFiltro() {
    let cards = document.querySelectorAll(".game-card");
    let visibles = 0;

    cards.forEach((card) => {
      let titulo = card.querySelector("h3").textContent.trim().toLowerCase();
      let juego = juegos.find((j) => j.titulo.toLowerCase() === titulo);

      let mostrar = false;

      if (filtroActual === "todos") {
        mostrar = true;
      } else if (juego && juego.estado === filtroActual) {
        mostrar = true;
      }

      if (mostrar) {
        card.style.display = "block";
        visibles++;
      } else {
        card.style.display = "none";
      }
    });

    let mensaje = document.getElementById("noGamesMessage");

    if (visibles === 0) {
      mensaje.style.display = "block";
    } else {
      mensaje.style.display = "none";
    }

    actualizarContadores();
  }
  // ======================
  // CONTADORES
  // ======================
  function actualizarContadores() {
    let total = juegos.length;
    let jugando = juegos.filter((j) => j.estado === "jugando").length;
    let completados = juegos.filter((j) => j.estado === "completado").length;
    let pendientes = juegos.filter((j) => j.estado === "pendiente").length;

    document.querySelector(".card-blue .number").textContent = total;
    document.querySelector(".text-green").textContent = completados;
    document.querySelector(".text-blue-light").textContent = jugando;
    document.querySelector(".text-yellow").textContent = pendientes;

    // filtro "Todos"
    document.querySelector(".filters-bar .count").textContent = total;
  }

  // ======================
  // BOTONES DE FILTRO
  // ======================
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.textContent.includes("Jugando")) filtroActual = "jugando";
      else if (btn.textContent.includes("Completados"))
        filtroActual = "completado";
      else if (btn.textContent.includes("Pendientes"))
        filtroActual = "pendiente";
      else if (btn.textContent.includes("Abandonados"))
        filtroActual = "abandonado";
      else filtroActual = "todos";

      aplicarFiltro();
    });
  });

  // ======================
  // ICONOS ELIMINAR
  // ======================
  document.querySelectorAll(".delete-game").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      let card = btn.closest(".game-card");
      let titulo = card.querySelector("h3").textContent;

      juegoAEliminar = { card, titulo };

      document.getElementById("modalText").textContent =
        `¿Seguro que quieres eliminar "${titulo}"?`;

      document.getElementById("modal").classList.remove("hidden");
    });
  });

  // ======================
  // MODAL
  // ======================
  document.getElementById("confirmDelete").addEventListener("click", () => {
    if (juegoAEliminar) {
      juegoAEliminar.card.remove();

      juegos = juegos.filter((j) => j.titulo !== juegoAEliminar.titulo);

      actualizarContadores();
    }

    document.getElementById("modal").classList.add("hidden");
  });

  document.getElementById("cancelDelete").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  // cerrar al hacer click fuera
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      e.target.classList.add("hidden");
    }
  });

  // ======================
  // INICIAR
  // ======================
  actualizarContadores();
  aplicarFiltro();
});
