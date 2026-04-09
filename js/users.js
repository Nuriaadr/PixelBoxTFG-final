// ===================== DATOS CENTRALIZADOS DE USUARIOS =====================
// Este archivo contiene la lista unificada de todos los usuarios de la plataforma
const USERS_DATA = [
  {
    id: 1,
    username: "@jugador_pro",
    avatar: "../img/user1.webp",
    description: "Amante de los RPG y juegos indie. Siempre buscando la próxima aventura.",
    games: 342,
    followers: 1243,
    following: 892
  },
  {
    id: 2,
    username: "@gamer_elite",
    avatar: "../img/space.webp",
    description: "Speedrunner profesional. Récord mundial en 3 juegos.",
    games: 567,
    followers: 5432,
    following: 234
  },
  {
    id: 3,
    username: "@indie_lover",
    avatar: "../img/user2.webp",
    description: "Descubriendo gemas ocultas del gaming indie.",
    games: 289,
    followers: 2341,
    following: 456
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
    "@jugador_pro": ["@gamer_elite"],  // @jugador_pro sigue a @gamer_elite
    "@gamer_elite": ["@jugador_pro", "@indie_lover"],  // @gamer_elite sigue a @jugador_pro e @indie_lover
    "@indie_lover": ["@jugador_pro"]  // @indie_lover sigue a @jugador_pro
  };

  // Inicializar cada usuario si no tiene datos
  USERS_DATA.forEach(user => {
    const key = `siguiendo_${user.username}`;
    if (!localStorage.getItem(key)) {
      const following = initialFollowerData[user.username] || [];
      localStorage.setItem(key, JSON.stringify(following));
    }
  });
}

// Limpiar datos viejos y reinicializar
// localStorage.removeItem("siguiendo_@jugador_pro");
// localStorage.removeItem("siguiendo_@gamer_elite");
// localStorage.removeItem("siguiendo_@indie_lover");
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
