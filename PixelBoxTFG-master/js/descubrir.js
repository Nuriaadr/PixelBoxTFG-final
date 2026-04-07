document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // =========================
  // PROTECCIÓN DE PÁGINA
  // =========================
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

  // IR A PERFIL
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
      localStorage.removeItem("rol");

      window.location.href = "../index.html";
    });
  }

  // =========================
  // FILTROS
  // =========================

  const games = [
    {
      nombre: "Legends of Eldoria",
      genero: "RPG",
      plataforma: "PC",
      año: 2024,
      img: "../img/img1.webp",
    },
    {
      nombre: "Dragon Quest Online",
      genero: "RPG",
      plataforma: "PC",
      año: 2025,
      img: "../img/img2.webp",
    },
    {
      nombre: "Velocity Racing",
      genero: "Acción",
      plataforma: "PlayStation",
      año: 2025,
      img: "../img/img4.webp",
    },
    {
      nombre: "Cyberpunk Chronicles",
      genero: "Acción",
      plataforma: "PC",
      año: 2025,
      img: "../img/img4.webp",
    },
    {
      nombre: "Nightmare Manor",
      genero: "Aventura",
      plataforma: "PC",
      año: 2024,
      img: "../img/img5.webp",
    },
    {
      nombre: "Stellar Odyssey",
      genero: "RPG",
      plataforma: "Xbox",
      año: 2025,
      img: "../img/puzzle.webp",
    },
    {
      nombre: "Shadow Castle",
      genero: "Aventura",
      plataforma: "PC",
      año: 2023,
      img: "../img/zombie.webp",
    },
    {
      nombre: "Pixel Warriors",
      genero: "Acción",
      plataforma: "PC",
      año: 2023,
      img: "../img/space.webp",
    },
  ];

  const container = document.getElementById("gamesContainer");

  const gen = document.getElementById("gen");
  const platform = document.getElementById("platform");
  const valoracion = document.getElementById("valoracion");
  const gamesCount = document.getElementById("gamesCount");

  function renderGames(list) {
    container.innerHTML = "";

    list.forEach((game) => {
      container.innerHTML += `
        <div class="game-card">
          <a href="detalles_juego.html">
            <div class="game-img">
              <img src="${game.img}" alt="${game.nombre}">
            </div>
            <h3>${game.nombre}</h3>
            <span>${game.año}</span>
          </a>
        </div>
      `;
    });
    if (gamesCount) {
      gamesCount.textContent = `${list.length} juegos`;
    }
  }

  function filtrar() {
    let genero = gen.value;
    let plataforma = platform.value;
    let orden = valoracion.value;

    let filtrados = [...games];

    if (genero !== "Todos los géneros") {
      filtrados = filtrados.filter((g) => g.genero === genero);
    }

    if (plataforma !== "Todas las plataformas") {
      filtrados = filtrados.filter((g) => g.plataforma === plataforma);
    }

    if (orden === "Más recientes") {
      filtrados.sort((a, b) => b.año - a.año);
    } else if (orden === "Más populares") {
      filtrados.sort((a, b) => b.año - a.año);
    }

    renderGames(filtrados);
  }

  gen.addEventListener("change", filtrar);
  platform.addEventListener("change", filtrar);
  valoracion.addEventListener("change", filtrar);

  renderGames(games);

  const resetBtn = document.getElementById("resetFilters");

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();

    gen.value = "Todos los géneros";
    platform.value = "Todas las plataformas";
    valoracion.value = "Mejor valorados";

    renderGames(games);
  });
});
