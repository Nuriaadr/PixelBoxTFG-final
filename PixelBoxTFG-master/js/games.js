// ===================== DATOS CENTRALIZADOS DE JUEGOS =====================
// Este archivo contiene la lista unificada de todos los juegos de la plataforma
// Se importa en: search.js, descubrir.js, y cualquier otra página que necesite juegos

const GAMES_DATA = [
  {
    nombre: "Legends of Eldoria",
    imagen: "../img/img1.webp",
    año: 2024,
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
    imagen: "../img/img5.webp",
    año: 2024,
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
    descripcion: "Explora galaxias desconocidas, combate amenazas alienígenas y descubre los secretos del universo.",
    rating: 4.3,
    genero: "RPG",
    plataforma: "Xbox",
    estado: "por_jugar",
    logros: [
      {nombre: "Explorador Galáctico", descripcion: "Explora 50 planetas", rarity: "EPIC"},
      {nombre: "Conquistador del Espacio", descripcion: "Completa todas las misiones", rarity: "LEGENDARY"}
    ]
  },
  {
    nombre: "Shadow Castle",
    imagen: "../img/img2.webp",
    año: 2024,
    descripcion: "Un metroidvania oscuro lleno de desafíos y secretos.",
    rating: 4.6,
    genero: "Aventura",
    plataforma: "PC",
    estado: "por_jugar",
    logros: [
      {nombre: "Explorador de Castillos", descripcion: "Descubre todas las salas", rarity: "RARE"},
      {nombre: "Vencedor del Castillo", descripcion: "Derrota al jefe final", rarity: "LEGENDARY"}
    ]
  },
  {
    nombre: "Pixel Memories",
    imagen: "../img/img1.webp",
    año: 2023,
    descripcion: "Un viaje nostálgico a través de mundos pixel art clásicos.",
    rating: 4.4,
    genero: "Acción",
    plataforma: "PC",
    estado: "por_jugar",
    logros: [
      {nombre: "Coleccionista de Píxeles", descripcion: "Encuentra 50 secretos", rarity: "RARE"},
      {nombre: "Maestro Retro", descripcion: "Completa todos los mundos en difícil", rarity: "EPIC"}
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
