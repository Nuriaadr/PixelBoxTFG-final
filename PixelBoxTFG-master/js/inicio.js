document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  // PROTEGER PÁGINA
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
  // JUEGOS DE TENDENCIAS
  // ======================
  const tendenciasData = [
    {
      nombre: "Stellar Odyssey",
      imagen: "../img/img1.webp",
      año: 2025,
      descripcion: "Explora galaxias desconocidas en una aventura espacial",
      rating: 4.3,
      logros: [
        { nombre: "Viajero Estelar", descripcion: "Descubre 10 galaxias", rarity: "RARE" },
        { nombre: "Explorador del Universo", descripcion: "Completa la odyssey galáctica", rarity: "LEGENDARY" }
      ]
    },
    {
      nombre: "Shadow Castle",
      imagen: "../img/img2.webp",
      año: 2023,
      descripcion: "Un castillo lleno de sombras y secretos oscuros",
      rating: 3.9,
      logros: [
        { nombre: "Cazador de Sombras", descripcion: "Derrota 15 enemigos sombra", rarity: "RARE" },
        { nombre: "Guardián del Castillo", descripcion: "Desbloquea todos los secretos", rarity: "EPIC" }
      ]
    },
    {
      nombre: "Velocity Racing",
      imagen: "../img/img4.webp",
      año: 2025,
      descripcion: "Carreras de velocidad en circuitos futuristas",
      rating: 4.2,
      logros: [
        { nombre: "Piloto Velocista", descripcion: "Completa 10 carreras", rarity: "RARE" },
        { nombre: "Campeón de Circuitos", descripcion: "Gana un campeonato", rarity: "EPIC" }
      ]
    },
    {
      nombre: "Nightmare Manor",
      imagen: "../img/img1.webp",
      año: 2024,
      descripcion: "Terror psicológico en una mansión embrujada",
      rating: 4.1,
      logros: [
        { nombre: "Superviviente", descripcion: "Sobrevive la noche completa", rarity: "RARE" },
        { nombre: "Desvelador de Secretos", descripcion: "Descubre todos los misterios", rarity: "LEGENDARY" }
      ]
    }
  ];

  // Renderizar juegos de tendencias dinámicamente
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