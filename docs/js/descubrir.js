document.addEventListener("DOMContentLoaded", async () => {
 
    lucide.createIcons();
  

  // PROTECCIÓN DE PÁGINA
  //si no hay user te manda de nuevo al login
  let user = localStorage.getItem("usuario");
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  // MOSTRAR USUARIO
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

  // CARGAR DATOS DE API
  await initializeGamesData();

  // FILTROS

  const container = document.getElementById("gamesContainer");

  const gen = document.getElementById("gen");
  const platform = document.getElementById("platform");
  const valoracion = document.getElementById("valoracion");
  const gamesCount = document.getElementById("gamesCount");

  //Obtener géneros y plataformas únicos de los datos
  function cargarOpcionesFilters() {
    const generos = [...new Set(GAMES_DATA.map(g => g.genero).filter(Boolean))].sort();
    const plataformas = [...new Set(GAMES_DATA.map(g => g.plataforma).filter(Boolean))].sort();

    //Agregar opciones de género
    generos.forEach(genero => {
      const option = document.createElement("option");
      option.value = genero;
      option.textContent = genero;
      gen.appendChild(option);
    });

    //Agregar opciones de plataforma
    plataformas.forEach(plataforma => {
      const option = document.createElement("option");
      option.value = plataforma;
      option.textContent = plataforma;
      platform.appendChild(option);
    });
  }

  function renderGames(list) {
    container.innerHTML = "";
    
    if (list.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No hay juegos que coincidan con los filtros.</p>';
      gamesCount.textContent = "0 juegos";
      return;
    }

    list.forEach((game) => {
      const url = getGameDetailsUrl(game);

      container.innerHTML += `
        <div class="game-card">
          <a href="${url}">
            <div class="game-img">
              <img src="${game.imagen}" alt="${game.nombre}" loading="lazy">
            </div>
            <h3>${game.nombre}</h3>
            <span>${game.año}</span>
          </a>
        </div>
      `;
    });
    
    gamesCount.textContent = `${list.length} ${list.length === 1 ? 'juego' : 'juegos'}`;
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

    //Ordenar
    if (orden === "Mejor valorados") {
      filtrados.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (orden === "Más recientes") {
      filtrados.sort((a, b) => b.año - a.año);
    } else if (orden === "Más populares") {
      filtrados.sort((a, b) => b.rating - a.rating);
    }
    renderGames(filtrados);
  }

  gen.addEventListener("change", filtrar);
  platform.addEventListener("change", filtrar);
  valoracion.addEventListener("change", filtrar);

  // Cargar opciones de filtros y juegos
  cargarOpcionesFilters();
  filtrar();
  //resetear filtros
  const resetBtn = document.getElementById("resetFilters");
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    gen.value = "Todos los géneros";
    platform.value = "Todas las plataformas";
    valoracion.value = "Mejor valorados";
    filtrar();
  });
});
