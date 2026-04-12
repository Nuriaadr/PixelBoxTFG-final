// ===================== DATOS CENTRALIZADOS DE USUARIOS =====================
// CRUD OPERATIONS: Todas las operaciones CRUD deben implementarse en PHP
// - CREATE: POST /api/users (crear usuario)
// - READ: GET /api/users (obtener usuarios)
// - UPDATE: PUT /api/users/{id} (actualizar usuario)
// - DELETE: DELETE /api/users/{id} (eliminar usuario)
// Este archivo contiene la lista unificada de todos los usuarios de la plataforma
const USERS_DATA = [
  {
    id: 1,
    username: "@jugador_pro",
    avatar: "../img/user1.webp",
    description: "Amante de los RPG y juegos indie. Siempre buscando la próxima aventura.",
    games: 0,  // Ahora dinámico basado en biblioteca
    followers: 6,  // Todos los demás usuarios lo siguen
    following: 1   // Sigue a @gamer_elite
  },
  {
    id: 2,
    username: "@gamer_elite",
    avatar: "../img/space.webp",
    description: "Speedrunner profesional. Récord mundial en 3 juegos.",
    games: 15,  // Valor estático para otros usuarios
    followers: 5432,
    following: 234
  },
  {
    id: 3,
    username: "@indie_lover",
    avatar: "../img/user2.webp",
    description: "Descubriendo gemas ocultas del gaming indie.",
    games: 23,  // Valor estático para otros usuarios
    followers: 2341,
    following: 456
  },
  {
    id: 4,
    username: "@arcade_ana",
    avatar: "../img/img4.webp",
    description: "Retro gamer y coleccionista de arcades. Siempre lista para un high score.",
    games: 8,  // Valor estático para otros usuarios
    followers: 890,
    following: 310
  },
  {
    id: 5,
    username: "@nocturno",
    avatar: "../img/img5.webp",
    description: "Noctámbulo del gaming, con preferencia por aventuras oscuras y narrativas intensas.",
    games: 412,
    followers: 1650,
    following: 520
  },
  {
    id: 6,
    username: "@quest_mate",
    avatar: "../img/puzzle.webp",
    description: "Explorador de mundos abiertos y cazador de misiones secundarias.",
    games: 12,  // Valor estático para otros usuarios
    followers: 1042,
    following: 389
  },
  {
    id: 7,
    username: "@pixel_princess",
    avatar: "../img/img2.webp",
    description: "Amante de los pixel-art y las plataformas independientes.",
    games: 18,  // Valor estático para otros usuarios
    followers: 1305,
    following: 470
  }
];

// ===================== PERSISTENCIA EN STORAGE =====================

// Inicializar datos de seguidores si no existen
function initializeFollowersData() {
  // Datos iniciales: quién sigue a quién
  // @gamer_elite sigue a @jugador_pro → @jugador_pro tiene un seguidor
  // @indie_lover sigue a @jugador_pro → @jugador_pro tiene otro seguidor
  // @jugador_pro sigue a @gamer_elite → @gamer_elite tiene un seguidor
  // @gamer_elite sigue a @indie_lover → @indie_lover tiene un seguidor

  const initialFollowerData = {
    "@jugador_pro": ["@gamer_elite"],
    "@gamer_elite": ["@jugador_pro", "@indie_lover", "@nocturno"],
    "@indie_lover": ["@jugador_pro", "@quest_mate"],
    "@arcade_ana": ["@jugador_pro", "@pixel_princess", "@quest_mate"],
    "@nocturno": ["@jugador_pro", "@gamer_elite", "@arcade_ana"],
    "@quest_mate": ["@jugador_pro"],
    "@pixel_princess": ["@jugador_pro", "@arcade_ana", "@nocturno"]
  };

  // Inicializar o actualizar relaciones de seguimiento
  USERS_DATA.forEach(user => {
    const key = `siguiendo_${user.username}`;
    const savedFollowing = JSON.parse(localStorage.getItem(key) || "[]");
    const defaultFollowing = initialFollowerData[user.username] || [];

    const mergedFollowing = Array.isArray(savedFollowing) ? [...savedFollowing] : [];
    defaultFollowing.forEach((followUser) => {
      if (!mergedFollowing.includes(followUser)) {
        mergedFollowing.push(followUser);
      }
    });

    // Que todos sigan a jugador pro porque somos unos pros SIUUUUUUUUUUUU
    // Forzar que todos sigan a @jugador_pro (usuario principal)
    if (user.username !== "@jugador_pro" && !mergedFollowing.includes("@jugador_pro")) {
      mergedFollowing.push("@jugador_pro");
    }

    localStorage.setItem(key, JSON.stringify(mergedFollowing));
  });

  // Asegurar que @jugador_pro tenga al menos un seguidor (forzar consistencia)
  const jugadorProKey = `siguiendo_@jugador_pro`;
  const jugadorProFollowing = JSON.parse(localStorage.getItem(jugadorProKey) || "[]");
  if (!jugadorProFollowing.includes("@gamer_elite")) {
    jugadorProFollowing.push("@gamer_elite");
    localStorage.setItem(jugadorProKey, JSON.stringify(jugadorProFollowing));
  }
}


initializeFollowersData();

// Obtener seguidores del usuario actual desde localStorage
function getFollowersOfUser(username) {
  // todos los usuarios que siguen a este usuario
  const followers = [];
  USERS_DATA.forEach(user => {
    const userFollowing = JSON.parse(localStorage.getItem(`siguiendo_${user.username}`) || "[]");
    if (userFollowing.includes(username)) {
      followers.push(user);
    }
  });
  return followers;
}

//obtener usuarios que sigue el usuario actual desde localStorage
function getUserFollowing(username) {
  return JSON.parse(localStorage.getItem(`siguiendo_${username}`) || "[]");
}

// Agregar/ELIMINAR seguidor
function toggleFollow(followingUser, targetUser) {
  let following = JSON.parse(localStorage.getItem(`siguiendo_${followingUser}`) || "[]");

  if (following.includes(targetUser)) {
    following = following.filter(u => u !== targetUser);
  } else {
    following.push(targetUser);
  }

  localStorage.setItem(`siguiendo_${followingUser}`, JSON.stringify(following));
}

// Verificar si sigue a un usuario
function isFollowing(currentUser, targetUser) {
  const following = JSON.parse(localStorage.getItem(`siguiendo_${currentUser}`) || "[]");
  return following.includes(targetUser);
}

// Obtener usuario por nombre
function getUserByUsername(username) {
  return USERS_DATA.find(u => u.username === username);
}
