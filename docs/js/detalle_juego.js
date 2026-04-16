// ===================== DETALLE JUEGO (GAME DETAILS) =====================
// Todas las operaciones CRUD deben implementarse en PHP con Slim
// - CREATE: POST /api/user/{userId}/biblioteca/{gameId} (agregar a biblioteca)
// - READ: GET /api/user/{userId}/biblioteca (obtener biblioteca)
// - UPDATE: PUT /api/user/{userId}/biblioteca/{gameId}/status (actualizar estado)
// - DELETE: DELETE /api/user/{userId}/biblioteca/{gameId} (eliminar de biblioteca)
// - CREATE: POST /api/user/{userId}/favorites/{gameId} (agregar favorito)
// - DELETE: DELETE /api/user/{userId}/favorites/{gameId} (eliminar favorito)
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

  function updateHeartButtonDetail(btn, isFavorite) {
    if (isFavorite) {
      btn.classList.add("favorited");
    } else {
      btn.classList.remove("favorited");
    }
    lucide.createIcons();
  }

  // ======================
  // OBTENER DATOS DE LA URL
  // ======================
  const urlParams = new URLSearchParams(window.location.search);
  const titulo = urlParams.get("titulo");
  const imagen = urlParams.get("imagen");
  const año = urlParams.get("año");
  const descripcion = urlParams.get("descripcion") || "Descripción del juego";
  const rating = urlParams.get("rating") || "4.3";
  const desarrollador = urlParams.get("desarrollador") || "Desarrollador Desconocido";
  const genero = urlParams.get("genero") || "Género Desconocido";
  const plataforma = urlParams.get("plataforma") || "Plataforma Desconocida";

  const LIBRARY_STORAGE_KEY = "biblioteca";

  /**
   * ELIMINAR - CRUD READ: Implementar en PHP
   * Reemplazar con API GET /api/user/{userId}/biblioteca
   */
  function obtenerBiblioteca() {
    const biblioteca = JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY) || "[]");
    return Array.isArray(biblioteca) ? biblioteca : [];
  }

  /**
   * ELIMINAR - CRUD CREATE/UPDATE: Implementar en PHP
   * Reemplazar con API POST/PUT /api/user/{userId}/biblioteca/{gameId}
   */
  function guardarBiblioteca(biblioteca) {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(biblioteca));
  }

  /**
   * TODO: MODIFICAR - CRUD READ: Implementar en PHP
   * Reemplazar con API GET /api/user/{userId}/biblioteca/{gameId}
   */
  function estaEnBiblioteca(titulo) {
    const biblioteca = obtenerBiblioteca();
    return biblioteca.some(juego => juego.nombreJuego === titulo);
  }

  function obtenerEstadoDelJuego(titulo) {
    const biblioteca = obtenerBiblioteca();
    const item = biblioteca.find(juego => juego.nombreJuego === titulo);
    return item ? item.estado : null;
  }

  function actualizarStatusActivo(estado) {
    const statusClassByEstado = {
      jugando: "playing",
      completado: "completed",
      pendiente: "pending",
      abandonado: "abandoned"
    };

    const classToActivate = estado ? statusClassByEstado[estado] : null;
    const statusBtns = document.querySelectorAll(".status-btn");

    statusBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (classToActivate && btn.classList.contains(classToActivate)) {
        btn.classList.add("active");
      }
    });
  }

  // ======================
  // AÑADIR A BIBLIOTECA
  // ======================
  const addToLibraryBtn = document.getElementById("addToLibraryBtn");
  if (addToLibraryBtn) {
    // Verificar estado inicial
    if (estaEnBiblioteca(titulo)) {
      addToLibraryBtn.textContent = "Ya en Biblioteca";
      addToLibraryBtn.disabled = true;
      addToLibraryBtn.style.opacity = "0.6";
    } else {
      addToLibraryBtn.textContent = "Añadir a Biblioteca";
      addToLibraryBtn.disabled = false;
      addToLibraryBtn.style.opacity = "1";
    }

    const currentEstado = obtenerEstadoDelJuego(titulo);
    if (currentEstado) {
      actualizarStatusActivo(currentEstado);
      activarStatusBtns();
    }

    addToLibraryBtn.addEventListener("click", () => {
      if (estaEnBiblioteca(titulo)) {
        showModal("Info", "Este juego ya está en tu biblioteca.");
        return;
      }

      // Añadir a biblioteca
      const biblioteca = obtenerBiblioteca();
      biblioteca.push({
        nombreJuego: titulo,
        estado: "pendiente"
      });
      guardarBiblioteca(biblioteca);

      // Actualizar botón
      addToLibraryBtn.textContent = "Ya en Biblioteca";
      addToLibraryBtn.disabled = true;
      addToLibraryBtn.style.opacity = "0.6";

      activarStatusBtns();
      actualizarStatusActivo("pendiente");

      showModal("Éxito", "Juego añadido a tu biblioteca correctamente.");
    });
  }

  // ======================
  // FAVORITOS
  // ======================
  const favoriteBtn = document.getElementById("favoriteBtn");
  if (favoriteBtn) {
    const isFavorite = isFavorito(user, titulo);
    updateHeartButtonDetail(favoriteBtn, isFavorite);

    favoriteBtn.addEventListener("click", () => {
      if (!estaEnBiblioteca(titulo)) {
        showModal("Error", "Debes añadir el juego a tu biblioteca antes de poder marcarlo como favorito.");
        return;
      }
      const isFav = toggleFavorito(user, titulo);
      updateHeartButtonDetail(favoriteBtn, isFav);
    });
  }

  // ======================
  // ACTUALIZAR ELEMENTOS HTML
  // ======================
  const bannerImg = document.querySelector(".game-banner img");
  if (bannerImg) {
    bannerImg.src = imagen || "../img/img1.webp";
    bannerImg.alt = titulo || "Juego";
  }

  const gameTitle = document.querySelector(".game-info h1");
  if (gameTitle) gameTitle.textContent = titulo || "Título del Juego";

  const yearSpan = document.querySelector(".meta .year");
  if (yearSpan) yearSpan.textContent = año || "2025";

  const ratingSpan = document.querySelector(".meta .rating");
  if (ratingSpan) ratingSpan.textContent = `★ ${rating} / 5`;

  const descriptionP = document.querySelector(".game-info .description");
  if (descriptionP) descriptionP.textContent = descripcion;

  // Actualizar desarrollador
  const infoCards = document.querySelectorAll(".info-card h3");
  if (infoCards[0]) infoCards[0].textContent = desarrollador;
  if (infoCards[1]) infoCards[1].textContent = genero;
  if (infoCards[2]) infoCards[2].textContent = plataforma;

  // ======================
  // MODAL
  // ======================
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

  function hideModal() {
    modal.classList.add("hidden");
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal();
    });
  }

  // ======================
  // FUNCIÓN PARA VERIFICAR SI JUEGO ESTÁ EN BIBLIOTECA
  // ======================
  function verificarJuegoEnBiblioteca() {
    return estaEnBiblioteca(titulo);
  }

  // Desactivar status buttons al cargar
  function desactivarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    });
  }

  // Activar status buttons
  function activarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });
  }

  // Verificar al cargar si el juego ya está en biblioteca
  if (verificarJuegoEnBiblioteca()) {
    activarStatusBtns();
  } else {
    desactivarStatusBtns();
  }

  // ======================
  // INICIALIZACIÓN
  // ======================
  desactivarStatusBtns();

  // Si el juego está en biblioteca, activar status buttons
  if (verificarJuegoEnBiblioteca()) {
    activarStatusBtns();
  }

  // ======================
  // STATUS BUTTONS
  // ======================
  const statusBtns = document.querySelectorAll(".status-btn");
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!verificarJuegoEnBiblioteca()) {
        showModal("Este juego no está en tu biblioteca", "Debes agregar el juego a tu biblioteca primero");
        return;
      }

      // Remover clase active de todos
      statusBtns.forEach((b) => b.classList.remove("active"));

      // Agregar clase active al botón clickeado
      btn.classList.add("active");

      // Actualizar estado en biblioteca
      let biblioteca = obtenerBiblioteca();
      const juegoIndex = biblioteca.findIndex((item) => item.nombreJuego === titulo);

      if (juegoIndex !== -1) {
        if (btn.classList.contains("playing")) {
          biblioteca[juegoIndex].estado = "jugando";
        } else if (btn.classList.contains("completed")) {
          biblioteca[juegoIndex].estado = "completado";
        } else if (btn.classList.contains("pending")) {
          biblioteca[juegoIndex].estado = "pendiente";
        } else if (btn.classList.contains("abandoned")) {
          biblioteca[juegoIndex].estado = "abandonado";
        }

        guardarBiblioteca(biblioteca);
      }
    });
  });
});


