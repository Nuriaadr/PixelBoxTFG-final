// ===================== DATOS CENTRALIZADOS DE JUEGOS =====================
// Este archivo contiene la lista unificada de todos los juegos de la plataforma
// Se importa en: search.js, descubrir.js, y cualquier otra página que necesite juegos

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
    estado: "completado",
    logros: [
      {nombre: "Aventurero Principiante", descripcion: "Completa el primer territorio", rarity: "COMMON"},
      {nombre: "Explorador del Mundo", descripcion: "Descubre todos los lugares secretos", rarity: "EPIC"},
      {nombre: "Maestro de Combate", descripcion: "Vence 100 enemigos", rarity: "LEGENDARY"}
    ]
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
    estado: "completado",
    logros: [
      {nombre: "Cazador de Dragones", descripcion: "Derrota 50 dragones", rarity: "EPIC"},
      {nombre: "Héroe del Reino", descripcion: "Completa la historia principal", rarity: "LEGENDARY"}
    ]
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
    estado: "jugando",
    logros: [
      {nombre: "Piloto Velocista", descripcion: "Completa 10 carreras", rarity: "RARE"},
      {nombre: "Campeón de Circuitos", descripcion: "Gana un campeonato", rarity: "EPIC"}
    ]
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
    estado: "jugando",
    logros: [
      {nombre: "Hacker Maestro", descripcion: "Hackea 20 terminales", rarity: "EPIC"},
      {nombre: "Nómada Urbano", descripcion: "Visita todos los distritos", rarity: "EPIC"}
    ]
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
    estado: "completado",
    logros: [
      {nombre: "Superviviente", descripcion: "Sobrevive la noche completa", rarity: "RARE"},
      {nombre: "Desvelador de Secretos", descripcion: "Descubre todos los misterios", rarity: "LEGENDARY"}
    ]
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
    estado: "pendiente",
    logros: [
      {nombre: "Explorador Galáctico", descripcion: "Explora 50 planetas", rarity: "EPIC"},
      {nombre: "Conquistador del Espacio", descripcion: "Completa todas las misiones", rarity: "LEGENDARY"}
    ]
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
    estado: "pendiente",
    logros: [
      {nombre: "Explorador de Castillos", descripcion: "Descubre todas las salas", rarity: "RARE"},
      {nombre: "Vencedor del Castillo", descripcion: "Derrota al jefe final", rarity: "LEGENDARY"}
    ]
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
    estado: "pendiente",
    logros: [
      {nombre: "Guerrero Pixel", descripcion: "Vence 100 enemigos", rarity: "RARE"},
      {nombre: "Campeón de Batallas", descripcion: "Gana 50 batallas", rarity: "EPIC"}
    ]
  }
];

// Función auxiliar para obtener la URL de detalles de un juego
function getGameDetailsUrl(game) {
  const logrosEncoded = encodeURIComponent(JSON.stringify(game.logros));
  return `detalles_juego.html?titulo=${encodeURIComponent(
    game.nombre
  )}&imagen=${encodeURIComponent(
    game.imagen
  )}&año=${game.año}&descripcion=${encodeURIComponent(
    game.descripcion
  )}&rating=${game.rating}&logros=${logrosEncoded}`;
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

// Guardar juegos en localStorage
function saveGamesToStorage() {
  localStorage.setItem("gamesData", JSON.stringify(GAMES_DATA));
}

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

// Cargar juegos al iniciar 
loadGamesFromStorage();

// Función para manejar logout con confirmación
function setupLogoutHandler(buttonId = "logoutBtn") {
  const logoutBtn = document.getElementById(buttonId);
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showLogoutConfirmation();
    });
  }
}

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
