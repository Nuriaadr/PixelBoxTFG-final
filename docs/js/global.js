// ===================== DATOS CENTRALIZADOS DE JUEGOS =====================
// Reemplazar datos hardcodeados con API
// Este archivo contiene la lista unificada de todos los juegos de la plataforma
// Se importa en: search.js, descubrir.js, y cualquier otra página que necesite juegos
// Reemplazar la constante GAMES_DATA con llamadas API a /api/games/all

const GAMES_DATA = [
  {
    nombre: "Legends of Eldoria",
    imagen: "../img/img1.webp",
    año: 2024,
    desarrollador: "Epic Studios",
    descripcion: "Una epopeya de fantasía con un mundo abierto expansivo.",
    rating: 4.8,
    genero: "RPG",
    plataforma: "PC",
    estado: "completado"
  },
  {
    nombre: "Dragon Quest Online",
    imagen: "../img/img2.webp",
    año: 2023,
    desarrollador: "Square Enix",
    descripcion: "Vive una aventura MMORPG en un mundo de dragones.",
    rating: 4.5,
    genero: "RPG",
    plataforma: "PC",
    estado: "completado"
  },
  {
    nombre: "Velocity Racing",
    imagen: "../img/img4.webp",
    año: 2025,
    desarrollador: "Midnight Racing",
    descripcion: "Las carreras más adrenalínicas del mundo de los videojuegos.",
    rating: 4.3,
    genero: "Acción",
    plataforma: "PlayStation",
    estado: "jugando"
  },
  {
    nombre: "Cyberpunk Chronicles",
    imagen: "../img/img4.webp",
    año: 2025,
    desarrollador: "Neon Games",
    descripcion: "Sumérgete en una ciudad futurista donde la tecnología y la humanidad colisionan.",
    rating: 4.5,
    genero: "Acción",
    plataforma: "PC",
    estado: "jugando"
  },
  {
    nombre: "Nightmare Manor",
    imagen: "../img/space.webp",
    año: 2024,
    desarrollador: "Dark Souls Dev",
    descripcion: "Un juego de horror psicológico que te hará cuestionar la realidad.",
    rating: 4.2,
    genero: "Aventura",
    plataforma: "PC",
    estado: "completado"
  },
  {
    nombre: "Stellar Odyssey",
    imagen: "../img/img1.webp",
    año: 2025,
    desarrollador: "Cosmic Games",
    descripcion: "Explora galaxias desconocidas, combate amenazas alienígenas y descubre los secretos del universo.",
    rating: 4.3,
    genero: "RPG",
    plataforma: "Xbox",
    estado: "pendiente"
  },
  {
    nombre: "Shadow Castle",
    imagen: "../img/puzzle.webp",
    año: 2024,
    desarrollador: "Shadow Studios",
    descripcion: "Un metroidvania oscuro lleno de desafíos y secretos.",
    rating: 4.6,
    genero: "Aventura",
    plataforma: "PC",
    estado: "pendiente"
  },
  {
    nombre: "Pixel Warriors",
    imagen: "../img/zombie.webp",
    año: 2023,
    desarrollador: "Retro Games Inc",
    descripcion: "Batalla en un mundo pixelado retro lleno de acción y adrenalina.",
    rating: 4.0,
    genero: "Acción",
    plataforma: "PC",
    estado: "pendiente"
  }
];

// Función auxiliar para obtener la URL de detalles de un juego
function getGameDetailsUrl(game) {
  return `detalles_juego.html?titulo=${encodeURIComponent(
    game.nombre
  )}&imagen=${encodeURIComponent(
    game.imagen
  )}&año=${game.año}&descripcion=${encodeURIComponent(
    game.descripcion
  )}&rating=${game.rating}&desarrollador=${encodeURIComponent(
    game.desarrollador
  )}&genero=${encodeURIComponent(
    game.genero
  )}&plataforma=${encodeURIComponent(
    game.plataforma
  )}`;
}

// Función auxiliar para buscar un juego por nombre
function findGameByName(name) {
  return GAMES_DATA.find(game => game.nombre.toLowerCase() === name.toLowerCase());
}

// Función auxiliar para filtrar juegos
function filterGames(query) {
  return GAMES_DATA.filter(game =>
    game.nombre.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 *  Mover al backend PHP
 * API backend: POST /api/games/save
 * Después: Eliminar esta función, los endpoints API manejan la persistencia
 */

// Guardar juegos en localStorage
function saveGamesToStorage() {
  localStorage.setItem("gamesData", JSON.stringify(GAMES_DATA));
}

/**
 * Reemplazar con llamada API
 * Cargar juegos desde la base de datos del backend, no localStorage
 * API backend: GET /api/games/all
 * Estrategia de depreciación:
 * 1. Eliminar esta función
 * 2. Crear initializeGamesData() que llame al backend
 * 3. Llamar durante la configuración de la app antes de renderizar páginas
 */

// Cargar juegos desde localStorage
function loadGamesFromStorage() {
  const savedGames = localStorage.getItem("gamesData");
  if (savedGames) {
    try {
      const parsedGames = JSON.parse(savedGames);
      // Reemplazar GAMES_DATA con los datos guardados
      GAMES_DATA.length = 0;
      GAMES_DATA.push(...parsedGames);
    } catch (error) {
      console.error("Error cargando juegos del storage", error);
    }
  }
}

/**
 *ELIMINAR ESTA LLAMADA al cargar la página
 * loadGamesFromStorage();
 * Reemplazar con: await initializeGamesData();
 */

// Cargar juegos al iniciar 
loadGamesFromStorage();

/**
 * HAY QUE MANTENER ESTO Manejador de eventos para logout
 */

// Función para manejar logout con confirmación
function setupLogoutHandler(buttonId = "logoutBtn") {
  // Buscar el botón en el menú (móvil)
  const logoutBtn = document.getElementById(buttonId);
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showLogoutConfirmation();
    });
  }

  // Buscar el botón en el navbar (desktop)
  const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");
  if (logoutBtnDesktop) {
    logoutBtnDesktop.addEventListener("click", (e) => {
      e.preventDefault();
      showLogoutConfirmation();
    });
  }
}

/**
 * MANTENER ESTO - Modal UI para confirmación de logout
 * Puramente frontend - no se necesitan cambios en el backend
 * Backend: localStorage.removeItem() debe reemplazarse con llamada API a /logout
 */

// Función para mostrar modal de confirmación de logout
function showLogoutConfirmation() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "logoutConfirmation";
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Cerrar sesión</h3>
      <p>¿Seguro que quieres cerrar sesión?</p>
      <div class="modal-actions" style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
        <button id="cancelLogoutBtn" class="btn-secondary">Cancelar</button>
        <button id="confirmLogoutBtn" class="btn-primary">Cerrar sesión</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cancelLogoutBtn").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "../index.html";
  });

  // Cerrar modal al hacer clic fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
