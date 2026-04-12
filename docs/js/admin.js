
// ===================== ADMIN PANEL JS =====================
// Este archivo necesita refactorización para trabajar con la API PHP backend
//  Todas las operaciones CRUD deben implementarse en PHP con Slim
// - CREATE: POST /api/admin/users (crear usuario)
// - READ: GET /api/admin/users (obtener usuarios)
// - UPDATE: PUT /api/admin/users/{id} (actualizar usuario)
// - DELETE: DELETE /api/admin/users/{id} (eliminar usuario)
// - CREATE: POST /api/games (crear juego)
// - READ: GET /api/games (obtener juegos)
// - UPDATE: PUT /api/games/{id} (actualizar juego)
// - DELETE: DELETE /api/games/{id} (eliminar juego)

let usersDatabase = [...USERS_DATA];
let editingGameId = null;
let deletingGameId = null;
let deletingUserId = null;

// Funciones para guardar/cargar usuarios
/**
 *  ELIMINAR - CRUD CREATE/UPDATE: Implementar en PHP
 * Reemplazar con API POST /api/admin/users para crear/actualizar usuarios
 */
function saveUsersToStorage() {
  localStorage.setItem("usersData", JSON.stringify(usersDatabase));
}

/**
 * ELIMINAR - CRUD READ: Implementar en PHP
 * Reemplazar con API GET /api/admin/users para obtener usuarios
 */
function loadUsersFromStorage() {
  const savedUsers = localStorage.getItem("usersData");
  if (savedUsers) {
    try {
      usersDatabase = JSON.parse(savedUsers);
      // Actualizar descripciones con bios guardadas
      usersDatabase.forEach(user => {
        const savedBio = localStorage.getItem(`bio_${user.username}`);
        if (savedBio) {
          user.description = savedBio;
        }
      });
    } catch (error) {
      console.error("Error cargando usuarios del storage", error);
      usersDatabase = [...USERS_DATA];
      // Actualizar descripciones por defecto
      usersDatabase.forEach(user => {
        const savedBio = localStorage.getItem(`bio_${user.username}`);
        if (savedBio) {
          user.description = savedBio;
        }
      });
    }
  } else {
    usersDatabase = [...USERS_DATA];
    // Actualizar descripciones por defecto
    usersDatabase.forEach(user => {
      const savedBio = localStorage.getItem(`bio_${user.username}`);
      if (savedBio) {
        user.description = savedBio;
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Logout
  setupLogoutHandler("logoutBtnAdmin");

  // Tabs
  setupTabs();

  // Search
  setupSearch();

  // Modals
  setupModals();

  // Add Game/User buttons
  const addBtn = document.getElementById("addBtn");
  
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (currentPage === "games") {
        openAddGameModal();
      } else if (currentPage === "users") {
        openAddUserModal();
      }
    });
  }

  // Render 
  loadUsersFromStorage();
  renderGames();
  renderUsers();

  // Actualizar estadísticas cuando se regresa a la pestaña
  window.addEventListener("focus", () => {
    loadGamesFromStorage();
    loadUsersFromStorage();
    renderGames();
    renderUsers();
  });
});

// ===================== TABS =====================
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-item");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      
      button.classList.add("active");

      const tabName = button.getAttribute("data-tab");

      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  currentPage = tabName;

  const gamesList = document.getElementById("gamesList");
  const usersList = document.getElementById("usersList");
  const addBtnText = document.getElementById("addBtnText");

  if (tabName === "games") {
    gamesList?.classList.remove("hidden");
    usersList?.classList.add("hidden");
    if (addBtnText) addBtnText.textContent = "Añadir Juego";
  } else if (tabName === "users") {
    gamesList?.classList.add("hidden");
    usersList?.classList.remove("hidden");
    if (addBtnText) addBtnText.textContent = "Añadir Usuario";
  }
}

// ===================== RENDER GAMES =====================
function renderGames() {
  const gamesList = document.getElementById("gamesList");
  if (!gamesList) return;

  gamesList.innerHTML = GAMES_DATA.map((game, index) => `
    <article class="game-item">
      <img src="${game.imagen}" class="game-thumb" alt="${game.nombre}">
      <div class="game-details">
        <h2>${game.nombre}</h2>
        <p class="developer">${game.desarrollador}</p>
        <div class="tags">
          <span>${game.genero}</span>
          <span>${game.plataforma}</span>
        </div>
        <p class="year">${game.año}</p>
        <div class="platforms">
          <span>Rating: ${game.rating}/5</span>
        </div>
      </div>
      <div class="actions">
        <button class="edit" aria-label="btn" onclick="openEditGameModal(${index})" title="Editar">
          <i data-lucide="pencil"></i>
        </button>
        <button class="delete" aria-label="btn" onclick="openDeleteGameModal(${index})" title="Eliminar">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </article>
  `).join("");

  // Actualizar contador de juegos
  const gamesCount = document.getElementById("gamesCount");
  if (gamesCount) {
    gamesCount.textContent = `(${GAMES_DATA.length})`;
  }

  lucide.createIcons();
}

// ===================== RENDER USERS =====================
function renderUsers() {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

  usersList.innerHTML = usersDatabase.map((user, index) => {
    // Para @jugador_pro, calcular estadísticas dinámicamente
    let gamesCount = user.games;
    let followersCount = user.followers;
    let followingCount = user.following;

    if (user.username === "@jugador_pro") {
      // Juegos desde biblioteca
      const biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");
      gamesCount = biblioteca.length;

      // Followers y following desde las funciones de users.js
      followersCount = getFollowersOfUser("@jugador_pro").length;
      followingCount = getUserFollowing("@jugador_pro").length;
    }

    return `
    <article class="user-card">
      <div class="user-avatar">
        <img src="${user.avatar}" alt="${user.username}">
      </div>
      <div class="user-info">
        <h2>${user.username}</h2>
        <p class="user-desc">${user.description}</p>
        <div class="user-stats">
          <span><strong>${gamesCount}</strong> juegos</span>
          <span><strong>${followersCount}</strong> seguidores</span>
          <span><strong>${followingCount}</strong> siguiendo</span>
        </div>
      </div>
      <div class="user-actions">
        <button class="edit" aria-label="boton" onclick="openEditUserModal(${index})" title="Editar">
          <i data-lucide="pencil"></i>
        </button>
        <button class="delete" aria-label="boton" onclick="openDeleteUserModal(${index})" title="Eliminar">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </article>
  `}).join("");

  // Actualizar contador de usuarios
  const usersCount = document.getElementById("usersCount");
  if (usersCount) {
    usersCount.textContent = `(${usersDatabase.length})`;
  }

  lucide.createIcons();
}

// ===================== MODALS =====================
function setupModals() {
  const gameModal = document.getElementById("gameModal");
  const gameForm = document.getElementById("gameForm");
  const closeGameModal = document.getElementById("closeGameModal");
  const cancelGameBtn = document.getElementById("cancelGameBtn");

  if (closeGameModal) {
    closeGameModal.addEventListener("click", closeModal);
  }
  if (cancelGameBtn) {
    cancelGameBtn.addEventListener("click", closeModal);
  }
  if (gameForm) {
    gameForm.addEventListener("submit", handleGameFormSubmit);
  }

  // User Modal
  const userModal = document.getElementById("userModal");
  const userForm = document.getElementById("userForm");
  const closeUserModalBtn = document.getElementById("closeUserModal");
  const cancelUserBtn = document.getElementById("cancelUserBtn");

  if (closeUserModalBtn) {
    closeUserModalBtn.addEventListener("click", closeUserModal);
  }
  if (cancelUserBtn) {
    cancelUserBtn.addEventListener("click", closeUserModal);
  }
  if (userForm) {
    userForm.addEventListener("submit", handleUserFormSubmit);
  }

  if (userModal) {
    userModal.addEventListener("click", (e) => {
      if (e.target === userModal) closeUserModal();
    });
  }

  const deleteModal = document.getElementById("deleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", handleDelete);
  }

  const successModal = document.getElementById("successModal");
  const closeSuccessBtn = document.getElementById("closeSuccessModal");

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", closeSuccessModalFunc);
  }

  if (gameModal) {
    gameModal.addEventListener("click", (e) => {
      if (e.target === gameModal) closeModal();
    });
  }
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
  }
  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) closeSuccessModalFunc();
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeModal() {
  const gameModal = document.getElementById("gameModal");
  if (gameModal) {
    gameModal.classList.add("hidden");
  }
  editingGameId = null;
  resetGameForm();
}

function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.classList.add("hidden");
  }
  deletingGameId = null;
  deletingUserId = null;
}

function openSuccessModal(title, message) {
  const successModal = document.getElementById("successModal");
  document.getElementById("successModalTitle").textContent = title;
  document.getElementById("successModalMessage").textContent = message;
  
  if (successModal) {
    successModal.classList.remove("hidden");
  }
}

function closeSuccessModalFunc() {
  const successModal = document.getElementById("successModal");
  if (successModal) {
    successModal.classList.add("hidden");
  }
}

// ===================== IMÁGENES =====================
// Array de imágenes disponibles
const AVAILABLE_IMAGES = [
  "../img/img1.webp",
  "../img/img2.webp",
  "../img/img4.webp",
  "../img/space.webp",
  "../img/puzzle.webp",
  "../img/zombie.webp"
];

// Obtener una imagen aleatoria
function getRandomImage() {
  return AVAILABLE_IMAGES[Math.floor(Math.random() * AVAILABLE_IMAGES.length)];
}

// ===================== ADD / EDIT GAME =====================
let editingUserId = null;

function openAddGameModal() {
  editingGameId = null;
  resetGameForm();
  document.getElementById("gameModalTitle").textContent = "Añadir Juego";
  openModal("gameModal");
}

function openAddUserModal() {
  editingUserId = null;
  resetUserForm();
  document.getElementById("userModalTitle").textContent = "Añadir Usuario";
  document.getElementById("userName").removeAttribute("readonly");
  openModal("userModal");
}

function openEditUserModal(index) {
  editingUserId = index;
  const user = usersDatabase[index];

  document.getElementById("userModalTitle").textContent = "Editar Usuario";
  document.getElementById("userName").setAttribute("readonly", true);
  document.getElementById("userName").value = user.username;
  document.getElementById("userDescription").value = user.description;

  openModal("userModal");
}

function openEditGameModal(index) {
  editingGameId = index;
  const game = GAMES_DATA[index];

  resetGameForm();

  document.getElementById("gameModalTitle").textContent = "Editar Juego";
  document.getElementById("gameName").value = game.nombre;
  document.getElementById("gameYear").value = game.año;
  document.getElementById("gameDeveloper").value = game.desarrollador;
  document.getElementById("gameDescription").value = game.descripcion;
  document.getElementById("gameGenre").value = game.genero;
  document.getElementById("gamePlatform").value = game.plataforma;
  document.getElementById("gameRating").value = game.rating;

  openModal("gameModal");
}

function resetGameForm() {
  const gameForm = document.getElementById("gameForm");
  if (gameForm) {
    gameForm.reset();
  }
}

function resetUserForm() {
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.reset();
  }
}

function handleGameFormSubmit(e) {
  e.preventDefault();

  const gameName = document.getElementById("gameName").value;
  const gameYear = document.getElementById("gameYear").value;
  const gameDeveloper = document.getElementById("gameDeveloper").value;
  const gameDescription = document.getElementById("gameDescription").value;
  const gameGenre = document.getElementById("gameGenre").value;
  const gamePlatform = document.getElementById("gamePlatform").value;
  const gameRating = document.getElementById("gameRating").value;

  if (editingGameId !== null) {
    // conservar imagen existente
    const imagenActual = GAMES_DATA[editingGameId].imagen;
    GAMES_DATA[editingGameId] = {
      ...GAMES_DATA[editingGameId],
      nombre: gameName,
      año: parseInt(gameYear),
      desarrollador: gameDeveloper,
      genero: gameGenre,
      descripcion: gameDescription,
      plataforma: gamePlatform,
      rating: parseFloat(gameRating),
      imagen: imagenActual
    };
    saveGamesToStorage();
    openSuccessModal("¡Juego Actualizado!", "Los cambios han sido guardados correctamente");
  } else {
    // asignar imagen aleatoria a nuevo juego
    const newGame = {
      nombre: gameName,
      año: parseInt(gameYear),
      desarrollador: gameDeveloper,
      genero: gameGenre,
      descripcion: gameDescription,
      plataforma: gamePlatform,
      rating: parseFloat(gameRating),
      imagen: getRandomImage()
    };
    GAMES_DATA.push(newGame);
    saveGamesToStorage();
    openSuccessModal("¡Juego Añadido!", "El juego ha sido añadido a la plataforma");
  }

  closeModal();
  setTimeout(() => {
    renderGames();
    closeSuccessModalFunc();
  }, 1500);
}

function handleUserFormSubmit(e) {
  e.preventDefault();

  const userName = document.getElementById("userName").value;
  const userDescription = document.getElementById("userDescription").value;

  if (editingUserId !== null) {
    const avatarActual = usersDatabase[editingUserId].avatar;
    const gamesActual = usersDatabase[editingUserId].games;
    const followersActual = usersDatabase[editingUserId].followers;
    const followingActual = usersDatabase[editingUserId].following;
    usersDatabase[editingUserId] = {
      ...usersDatabase[editingUserId],
      username: userName,
      description: userDescription,
      games: gamesActual,
      followers: followersActual,
      following: followingActual,
      avatar: avatarActual
    };
    localStorage.setItem(`bio_${userName}`, userDescription);
    saveUsersToStorage();
    openSuccessModal("¡Usuario Actualizado!", "Los cambios han sido guardados correctamente");
  } else {
    const newUser = {
      id: usersDatabase.length + 1,
      username: userName,
      description: userDescription,
      games: 0,
      followers: 0,
      following: 0,
      avatar: "../img/user1.webp"
    };
    usersDatabase.push(newUser);
    localStorage.setItem(`bio_${userName}`, userDescription);
    saveUsersToStorage();
    openSuccessModal("¡Usuario Añadido!", "El usuario ha sido añadido a la plataforma");
  }

  closeUserModal();
  setTimeout(() => {
    renderUsers();
    closeSuccessModalFunc();
  }, 1500);
}

function closeUserModal() {
  const userModal = document.getElementById("userModal");
  if (userModal) {
    userModal.classList.add("hidden");
  }
  editingUserId = null;
  resetUserForm();
}

// ===================== DELETE GAME / USER =====================
function openDeleteGameModal(index) {
  deletingGameId = index;
  const game = GAMES_DATA[index];

  document.getElementById("deleteItemName").textContent = game.nombre;
  openModal("deleteModal");
}

function openDeleteUserModal(index) {
  deletingUserId = index;
  const user = usersDatabase[index];

  document.getElementById("deleteItemName").textContent = user.username;
  openModal("deleteModal");
}

function handleDelete() {
  if (deletingGameId !== null) {
    const gameName = GAMES_DATA[deletingGameId].nombre;
    GAMES_DATA.splice(deletingGameId, 1);
    saveGamesToStorage();
    openSuccessModal("¡Juego Eliminado!", `"${gameName}" ha sido eliminado correctamente`);
    renderGames();
  } else if (deletingUserId !== null) {
    const userName = usersDatabase[deletingUserId].username;
    usersDatabase.splice(deletingUserId, 1);
    localStorage.removeItem(`bio_${userName}`);
    saveUsersToStorage();
    openSuccessModal("¡Usuario Eliminado!", `"${userName}" ha sido eliminado correctamente`);
    renderUsers();
  }

  closeDeleteModal();
  setTimeout(() => {
    closeSuccessModalFunc();
  }, 1500);
}

// ===================== SEARCH =====================
function setupSearch() {
  const searchIconBtn = document.getElementById("openSearchModalBtn");
  const searchModal = document.getElementById("searchModal");
  const closeSearchModal = document.getElementById("closeSearchModal");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchIconBtn) {
    searchIconBtn.addEventListener("click", () => {
      if (searchModal) searchModal.classList.remove("hidden");
    });
  }

  if (closeSearchModal) {
    closeSearchModal.addEventListener("click", () => {
      if (searchModal) searchModal.classList.add("hidden");
    });
  }

  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) {
        searchModal.classList.add("hidden");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      performSearch(query);
    });
  }
}

function performSearch(query) {
  const searchResults = document.getElementById("searchResults");
  if (!searchResults) return;

  let results = [];

  if (currentPage === "games") {
    results = GAMES_DATA.filter(game =>
      game.nombre.toLowerCase().includes(query)
    );
  } else if (currentPage === "users") {
    results = usersDatabase.filter(user =>
      user.username.toLowerCase().includes(query)
    );
  }

  if (query.trim() === "") {
    searchResults.innerHTML = `<p class="search-placeholder">Escribe para buscar...</p>`;
    return;
  }

  if (results.length === 0) {
    searchResults.innerHTML = `<p class="search-placeholder">No se encontraron resultados</p>`;
    return;
  }

  searchResults.innerHTML = results.map(item => {
    if (item.nombre) {
      return `
        <div class="search-result-item" style="padding: 12px 16px; border-bottom: 1px solid var(--secondary); cursor: pointer;">
          <p style="margin: 0; font-weight: 500;">${item.nombre}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">${item.genero} • ${item.año}</p>
        </div>
      `;
    } else {
      return `
        <div class="search-result-item" style="padding: 12px 16px; border-bottom: 1px solid var(--secondary); cursor: pointer;">
          <p style="margin: 0; font-weight: 500;">${item.username}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">${item.games} juegos</p>
        </div>
      `;
    }
  }).join("");
}

