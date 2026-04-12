// ===================== INICIO (HOME PAGE) =====================
// Operaciones CRUD deben implementarse en PHP 
// - CREATE: POST /api/user/{userId}/biblioteca/{gameId} (agregar juego a biblioteca)
// - READ: GET /api/games/trending (obtener juegos trending)
document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  let user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  //  USUARIO
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

  setupLogoutHandler();

  // ======================
  // JUEGOS DE TENDENCIAS
  // ======================
  // Seleccionar juegos de tendencia de GAMES_DATA
  const tendenciasData = GAMES_DATA.slice(4, 8); // Últimos 4 juegos como tendencias puedes cambiarlo como te de la gana xd

  // Renderizar juegos de tendencias 
  function renderTrendingGames() {
    const cardGrid = document.querySelector(".section .card-grid");
    if (!cardGrid) {
      console.error("No se encontró .card-grid");
      return;
    }

    cardGrid.innerHTML = "";

    tendenciasData.forEach((game) => {
      const params = new URLSearchParams({
        titulo: game.nombre,
        imagen: game.imagen,
        año: game.año,
        descripcion: game.descripcion,
        rating: game.rating,
        desarrollador: game.desarrollador || "Desarrollador Desconocido",
        genero: game.genero || "Género Desconocido",
        plataforma: game.plataforma || "Plataforma Desconocida"
      }).toString();

      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      gameCard.innerHTML = `
        <a href="detalles_juego.html?${params}">
          <div class="game-img">
            <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
          </div>
          <h3>${game.nombre}</h3>
          <p>${game.año}</p>
        </a>
      `;
      cardGrid.appendChild(gameCard);
    });
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

  function hideModal() {
    modal.classList.add("hidden");
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  }

  // BOTÓN
  const addGameBtn = document.getElementById("addGameBtn");

  if (addGameBtn) {
    addGameBtn.addEventListener("click", () => {

      let biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [];

      // Verificar si ya está en biblioteca
      const existe = biblioteca.some(item => 
        (item.nombreJuego || item.nombre || item) === "Cyberpunk Chronicles"
      );

      if (existe) {
        showModal("Ya en biblioteca", "Este juego ya está en tu biblioteca");
        return;
      }

      // Agregar en nuevo formato
      biblioteca.push({
        nombreJuego: "Cyberpunk Chronicles",
        estado: "jugando"
      });

      localStorage.setItem("biblioteca", JSON.stringify(biblioteca));

      showModal("¡Genial!", "Juego añadido a tu biblioteca");
    });
  } 
});