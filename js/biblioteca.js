document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ======================
  // USUARIO
  // ======================
  const user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const userName = document.getElementById("userName");
  if (userName) userName.textContent = user;

  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  // LOGOUT
  setupLogoutHandler();

  // ======================
  // MODAL
  // ======================
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
    confirmDeleteBtn.addEventListener("click", () => {
      if (juegoAEliminar) {
        juegos = juegos.filter((j) => j.titulo !== juegoAEliminar.titulo);
        localStorage.setItem("biblioteca", JSON.stringify(juegos));

        renderizarJuegos();
        aplicarFiltro();
        actualizarContadores();
      }

      cerrarModal();
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", cerrarModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });
  }

  // ======================
  // DATOS
  // ======================
  // Los juegos se cargan de GAMES_DATA (centralizado)
  // Se manejan estados de "completado", "jugando", "por_jugar"

  let juegosGuardados = JSON.parse(localStorage.getItem("biblioteca") || "[]");

  // Función para asegurar estructura correcta
  function normalizarJuego(juego) {
    return {
      titulo: juego.nombre || juego.titulo || "Sin título",
      imagen: juego.imagen || "../img/img1.webp",
      año: juego.año || 2025,
      descripcion: juego.descripcion || "",
      rating: juego.rating || 0,
      estado: juego.estado || "pendiente",
      logros: Array.isArray(juego.logros) ? juego.logros : [],
    };
  }

  // Normalizar TODOS los juegos guardados
  let juegos = juegosGuardados.map(normalizarJuego);

  // Si está vacío, usar GAMES_DATA como valor por defecto
  if (juegos.length === 0) {
    juegos = GAMES_DATA.map(normalizarJuego);
    localStorage.setItem("biblioteca", JSON.stringify(juegos));
  }

  // ======================
  // RENDER
  // ======================
  function renderizarJuegos() {
    const container = document.querySelector(".card-grid");

    container.querySelectorAll(".game-card").forEach((card) => card.remove());

    juegos.forEach((juego) => {
      const card = document.createElement("div");
      card.className = "game-card";

      // Crear el href con todos los parámetros incluyendo logros
      const logrosJSON = juego.logros ? JSON.stringify(juego.logros) : "[]";
      const href = `detalles_juego.html?titulo=${encodeURIComponent(juego.titulo)}&imagen=${encodeURIComponent(juego.imagen)}&año=${encodeURIComponent(juego.año)}&descripcion=${encodeURIComponent(juego.descripcion || "")}&rating=${juego.rating || 0}&logros=${encodeURIComponent(logrosJSON)}`;


      card.innerHTML = `
        <i class="delete-game" data-lucide="x"></i>
        <a href="${href}">
          <div class="game-img">
            <img src="${juego.imagen}" alt="${juego.titulo}">
          </div>
          <h3>${juego.titulo}</h3>
          <span>${juego.año}</span>
        </a>
      `;

      container.appendChild(card);
    });

    lucide.createIcons();
    agregarEventosEliminar();
  }

  // ======================
  // ELIMINAR
  // ======================
  function agregarEventosEliminar() {
    document.querySelectorAll(".delete-game").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest(".game-card");
        const titulo = card.querySelector("h3")?.textContent || "Juego";

        juegoAEliminar = { titulo };

        if (modalText) {
          modalText.textContent = `¿Seguro que quieres eliminar "${titulo}"?`;
        }

        if (modal) {
          modal.classList.remove("hidden");
          modal.style.display = "flex";
        }
      });
    });
  }

  // ======================
  // FILTROS
  // ======================
  let filtroActual = "todos";

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

  function aplicarFiltro() {
    const cards = document.querySelectorAll(".game-card");
    let visibles = 0;

    cards.forEach((card) => {
      const titulo = card.querySelector("h3").textContent;
      const juego = juegos.find((j) => j.titulo === titulo);

      let mostrar =
        filtroActual === "todos" || (juego && juego.estado === filtroActual);

      card.style.display = mostrar ? "block" : "none";

      if (mostrar) visibles++;
    });

    const mensaje = document.getElementById("noGamesMessage");
    if (mensaje) {
      mensaje.style.display = visibles === 0 ? "block" : "none";
    }
  }

  // ======================
  // CONTADORES
  // ======================
  function actualizarContadores() {
    const total = juegos.length;
    const jugando = juegos.filter((j) => j.estado === "jugando").length;
    const completados = juegos.filter((j) => j.estado === "completado").length;
    const pendientes = juegos.filter((j) => j.estado === "pendiente").length;
    const abandonados = juegos.filter((j) => j.estado === "abandonado").length;

    // Actualizar tarjetas de stats
    document.querySelector(".card-blue .number").textContent = total;
    document.querySelector(".number.text-green").textContent = completados;
    document.querySelector(".number.text-blue-light").textContent = jugando;
    document.querySelector(".number.text-yellow").textContent = pendientes;

    // Actualizar botones de filtro con el contador
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (filterBtns[0])
      filterBtns[0].querySelector(".count").textContent = total;
    if (filterBtns[1])
      filterBtns[1].querySelector(".count").textContent = jugando;
    if (filterBtns[2])
      filterBtns[2].querySelector(".count").textContent = completados;
    if (filterBtns[3])
      filterBtns[3].querySelector(".count").textContent = pendientes;
    if (filterBtns[4])
      filterBtns[4].querySelector(".count").textContent = abandonados;

    console.log("Contadores actualizados:", {
      total,
      jugando,
      completados,
      pendientes,
      abandonados,
    });
  }

  // ======================
  // INICIO
  // ======================
  renderizarJuegos();
  aplicarFiltro();
  actualizarContadores();
});
