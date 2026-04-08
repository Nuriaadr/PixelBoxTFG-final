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
  const tendenciasData = GAMES_DATA.slice(4, 8); // Últimos 4 juegos como tendencias

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
        logros: game.logros ? JSON.stringify(game.logros) : "[]",
      }).toString();

      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      gameCard.innerHTML = `
        <a href="detalles_juego.html?${params}">
          <div class="game-img" style="background-image: url('${game.imagen}')">
            <img src="${game.imagen}" alt="${game.nombre}" style="display: none;">
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

      let juegos = JSON.parse(localStorage.getItem("biblioteca")) || [];

      juegos.push("Cyberpunk Chronicles");

      localStorage.setItem("biblioteca", JSON.stringify(juegos));

      showModal("¡Genial!", "Juego añadido a tu biblioteca");
    });
  } else {
    console.error("No existe el botón addGameBtn en esta página");
  }

});