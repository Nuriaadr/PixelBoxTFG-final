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
      descripcion: "Una aventura épica en un mundo mágico",
      rating: 4.5,
    },
    {
      nombre: "Dragon Quest Online",
      genero: "RPG",
      plataforma: "PC",
      año: 2025,
      img: "../img/img2.webp",
      descripcion: "Un MMORPG épico con miles de aventuras",
      rating: 4.8,
    },
    {
      nombre: "Velocity Racing",
      genero: "Acción",
      plataforma: "PlayStation",
      año: 2025,
      img: "../img/img4.webp",
      descripcion: "Carreras de velocidad en circuitos futuristas",
      rating: 4.2,
    },
    {
      nombre: "Cyberpunk Chronicles",
      genero: "Acción",
      plataforma: "PC",
      año: 2025,
      img: "../img/img4.webp",
      descripcion: "Vive en una metrópolis futurista llena de peligros",
      rating: 4.6,
    },
    {
      nombre: "Nightmare Manor",
      genero: "Aventura",
      plataforma: "PC",
      año: 2024,
      img: "../img/img5.webp",
      descripcion: "Terror psicológico en una mansión embrujada",
      rating: 4.1,
    },
    {
      nombre: "Stellar Odyssey",
      genero: "RPG",
      plataforma: "Xbox",
      año: 2025,
      img: "../img/puzzle.webp",
      descripcion: "Explora galaxias desconocidas en una aventura espacial",
      rating: 4.3,
    },
    {
      nombre: "Shadow Castle",
      genero: "Aventura",
      plataforma: "PC",
      año: 2023,
      img: "../img/zombie.webp",
      descripcion: "Un castillo lleno de sombras y secretos oscuros",
      rating: 3.9,
    },
    {
      nombre: "Pixel Warriors",
      genero: "Acción",
      plataforma: "PC",
      año: 2023,
      img: "../img/space.webp",
      descripcion: "Batalla en un mundo pixelado retro",
      rating: 4.0,
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
      const params = new URLSearchParams({
        titulo: game.nombre,
        imagen: game.img,
        año: game.año,
        descripcion: game.descripcion || "Descripción del juego",
        rating: game.rating || 4.0,
      }).toString();

      container.innerHTML += `
        <div class="game-card">
          <a href="detalles_juego.html?${params}">
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
