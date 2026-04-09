document.addEventListener("DOMContentLoaded", () => {
 
    lucide.createIcons();
  

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
  setupLogoutHandler();

  // =========================
  // FILTROS
  // =========================

  const container = document.getElementById("gamesContainer");

  const gen = document.getElementById("gen");
  const platform = document.getElementById("platform");
  const valoracion = document.getElementById("valoracion");
  const gamesCount = document.getElementById("gamesCount");

  function renderGames(list) {
    container.innerHTML = "";
    const usuario = localStorage.getItem("usuario");

    list.forEach((game) => {
      const params = new URLSearchParams({
        titulo: game.nombre,
        imagen: game.imagen,
        año: game.año,
        descripcion: game.descripcion || "Descripción del juego",
        rating: game.rating || 4.0,
        desarrollador: game.desarrollador || "Desarrollador Desconocido",
        genero: game.genero || "Género Desconocido",
        plataforma: game.plataforma || "Plataforma Desconocida",
        logros: game.logros ? JSON.stringify(game.logros) : "[]",
      }).toString();

      container.innerHTML += `
        <div class="game-card">
          <div class="game-card-header">
            <a href="detalles_juego.html?${params}" class="game-card-link">
              <div class="game-img">
                <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
              </div>
              <h3>${game.nombre}</h3>
              <span>${game.año}</span>
            </a>
          </div>
        </div>
      `;
    });
    
    if (gamesCount) {
      gamesCount.textContent = `${list.length} juegos`;
    }

    lucide.createIcons();
  }

  function filtrar() {
    let genero = gen.value;
    let plataforma = platform.value;
    let orden = valoracion.value;

    let filtrados = [...GAMES_DATA];

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

  renderGames(GAMES_DATA);

  const resetBtn = document.getElementById("resetFilters");

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();

    gen.value = "Todos los géneros";
    platform.value = "Todas las plataformas";
    valoracion.value = "Mejor valorados";

    renderGames(GAMES_DATA);
  });
});
