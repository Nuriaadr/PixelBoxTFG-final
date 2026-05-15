let editingGameId = null;
let deletingGameId = null;
let deletingUserId = null;
let editingUserId = null;
let currentPage = "games";
let gamesDatabase = [];
let usersDatabase = [];

document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  setupLogoutHandler("logoutBtnAdmin");
  setupTabs();
  setupModals();

  const addBtn = document.getElementById("addBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (currentPage === "games") openAddGameModal();
      else if (currentPage === "users") openAddUserModal();
    });
  }

  await cargarJuegos();
  await cargarUsuarios();
  renderGames();
  renderUsers();
});

// CARGAR DATOS DE LA BD
async function cargarJuegos() {
  try {
    const response = await fetch(`${API_URL}/api/games`);
    const data = await response.json();
    if (data.success) gamesDatabase = data.data;
  } catch (error) {
    console.error("Error cargando juegos:", error);
  }
}

async function cargarUsuarios() {
  try {
    const response = await fetch(`${API_URL}/api/users`);
    const data = await response.json();
    if (data.success) usersDatabase = data.data;
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

// TABS
function setupTabs() {
  document.querySelectorAll(".tab-item").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-item")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      switchTab(button.getAttribute("data-tab"));
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
  } else {
    gamesList?.classList.add("hidden");
    usersList?.classList.remove("hidden");
    if (addBtnText) addBtnText.textContent = "Añadir Usuario";
  }
}

// CARGAR GAMES
function renderGames() {
  const gamesList = document.getElementById("gamesList");
  if (!gamesList) return;

  gamesList.innerHTML = gamesDatabase
    .map(
      (game) => `
        <article class="game-item">
            <img src="${game.cover_image_url}" class="game-thumb" alt="${game.title}" onerror="this.src='../img/img1.webp'">
            <div class="game-details">
                <h2>${game.title}</h2>
                <p class="developer">${game.developer}</p>
                <div class="tags">
                    <span>${game.genre}</span>
                    <span>${game.platform}</span>
                </div>
                <p class="year">${game.release_year}</p>
                <div class="platforms">
                    <span>Rating: ${game.average_rating}/5</span>
                </div>
            </div>
            <div class="actions">
                <button class="edit" aria-label="editar" onclick="openEditGameModal(${game.id})" title="Editar">
                    <i data-lucide="pencil"></i>
                </button>
                <button class="delete" aria-label="eliminar" onclick="openDeleteGameModal(${game.id}, '${game.title}')" title="Eliminar">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </article>
    `,
    )
    .join("");

  const gamesCount = document.getElementById("gamesCount");
  if (gamesCount) gamesCount.textContent = `(${gamesDatabase.length})`;

  lucide.createIcons();
}

// CARGAR USERS
function renderUsers() {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

    usersList.innerHTML = usersDatabase
    .map((user) => {
      const initials = (user.username || "").substring(0, 2).toUpperCase();
      const desc = user.description || "Sin descripción";
      const safeDesc = desc.replace(/'/g, "\\'");
      const usernameSafe = (user.username || "").replace(/'/g, "\\'");
      const lower = (user.username || "").toLowerCase().trim();
      const cannotDelete = lower === "admin" || lower === "jugador pro";

      return `
      <article class="user-card">
        <div class="user-avatar">
          <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.2rem; background: var(--accent); border-radius:50%; color:white;">
            ${initials}
          </div>
        </div>
        <div class="user-info">
          <h2>${user.username}</h2>
          <p class="user-desc">${desc}</p>
          <div class="user-stats">
            <span><strong>${user.role}</strong></span>
            <span>${user.email}</span>
          </div>
        </div>
        <div class="user-actions">
          <button class="edit" aria-label="editar" onclick="openEditUserModal(${user.id}, '${usernameSafe}', '${safeDesc}')" title="Editar">
            <i data-lucide="pencil"></i>
          </button>
          ${cannotDelete ? "" : `<button class=\"delete\" aria-label=\"eliminar\" onclick=\"openDeleteUserModal(${user.id}, '${usernameSafe}')\" title=\"Eliminar\">\n                    <i data-lucide=\"trash-2\"></i>\n                </button>`}
        </div>
      </article>
    `;
    })
    .join("");

  const usersCount = document.getElementById("usersCount");
  if (usersCount) usersCount.textContent = `(${usersDatabase.length})`;

  lucide.createIcons();
}

// MODALES
function setupModals() {

  document
    .getElementById("closeGameModal")
    ?.addEventListener("click", closeGameModal);
  document
    .getElementById("cancelGameBtn")
    ?.addEventListener("click", closeGameModal);
  document
    .getElementById("gameForm")
    ?.addEventListener("submit", handleGameFormSubmit);
  document.getElementById("gameModal")?.addEventListener("click", (e) => {
    if (e.target.id === "gameModal") closeGameModal();
  });

  document
    .getElementById("closeUserModal")
    ?.addEventListener("click", closeUserModal);
  document
    .getElementById("cancelUserBtn")
    ?.addEventListener("click", closeUserModal);
  document
    .getElementById("userForm")
    ?.addEventListener("submit", handleUserFormSubmit);
  document.getElementById("userModal")?.addEventListener("click", (e) => {
    if (e.target.id === "userModal") closeUserModal();
  });

  document
    .getElementById("cancelDeleteBtn")
    ?.addEventListener("click", closeDeleteModal);
  document
    .getElementById("confirmDeleteBtn")
    ?.addEventListener("click", handleDelete);
  document.getElementById("deleteModal")?.addEventListener("click", (e) => {
    if (e.target.id === "deleteModal") closeDeleteModal();
  });

  document
    .getElementById("closeSuccessModal")
    ?.addEventListener("click", closeSuccessModal);
  document.getElementById("successModal")?.addEventListener("click", (e) => {
    if (e.target.id === "successModal") closeSuccessModal();
  });
}

function openModal(id) {
  document.getElementById(id)?.classList.remove("hidden");
}
function closeGameModal() {
  document.getElementById("gameModal")?.classList.add("hidden");
  editingGameId = null;
  document.getElementById("gameForm")?.reset();
}
function closeUserModal() {
  document.getElementById("userModal")?.classList.add("hidden");
  editingUserId = null;
  document.getElementById("userForm")?.reset();
}
function closeDeleteModal() {
  document.getElementById("deleteModal")?.classList.add("hidden");
  deletingGameId = null;
  deletingUserId = null;
}
function closeSuccessModal() {
  document.getElementById("successModal")?.classList.add("hidden");
}

function openSuccessModal(title, message) {
  document.getElementById("successModalTitle").textContent = title;
  document.getElementById("successModalMessage").textContent = message;
  openModal("successModal");
}

// AGREGAR O EDITAR GAME

function openAddGameModal() {
  editingGameId = null;
  document.getElementById("gameForm")?.reset();
  document.getElementById("gameModalTitle").textContent = "Añadir Juego";
  openModal("gameModal");
}

function openEditGameModal(gameId) {
  editingGameId = gameId;
  const game = gamesDatabase.find((g) => g.id === gameId);
  if (!game) return;

  document.getElementById("gameModalTitle").textContent = "Editar Juego";
  document.getElementById("gameName").value = game.title;
  document.getElementById("gameYear").value = game.release_year;
  document.getElementById("gameDeveloper").value = game.developer;
  document.getElementById("gameDescription").value = game.description;
  document.getElementById("gameGenre").value = game.genre;
  document.getElementById("gamePlatform").value = game.platform;
  document.getElementById("gameRating").value = game.average_rating;
  openModal("gameModal");
}

async function handleGameFormSubmit(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("usuario"));
  const password = localStorage.getItem("password");

  const gameData = {
    title: document.getElementById("gameName").value,
    release_year: parseInt(document.getElementById("gameYear").value),
    developer: document.getElementById("gameDeveloper").value,
    description: document.getElementById("gameDescription").value,
    genre: document.getElementById("gameGenre").value,
    platform: document.getElementById("gamePlatform").value,
    average_rating: parseFloat(document.getElementById("gameRating").value),
    cover_image_url: "../img/img1.webp", //pone la imagen 1 por defecto 
    username: user.username,
    password: password,
  };
  try {
    const url = editingGameId
      ? `${API_URL}/api/games/${editingGameId}`
      : `${API_URL}/api/games`;
    const method = editingGameId ? "PUT" : "POST"; //si no existe el id de editar pues es porque estás agregando

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    });
    const data = await response.json();

    if (data.success) {
      await cargarJuegos();
      renderGames();
      closeGameModal();
      openSuccessModal(
        editingGameId ? "¡Juego Actualizado!" : "¡Juego Añadido!",
        editingGameId
          ? "Los cambios han sido guardados"
          : "El juego ha sido añadido",
      );
      setTimeout(closeSuccessModal, 1500);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error guardando juego:", error);
  }
}

// AÑADIR O EDITAR USER
function openAddUserModal() {
  editingUserId = null;
  document.getElementById("userForm")?.reset();
  document.getElementById("userModalTitle").textContent = "Añadir Usuario";
  document.getElementById("userName").removeAttribute("readonly");
  openModal("userModal");
}

function openEditUserModal(userId, username, description) {
  editingUserId = userId;
  document.getElementById("userModalTitle").textContent = "Editar Usuario";
  document.getElementById("userName").value = username;
  document.getElementById("userName").setAttribute("readonly", true);
  document.getElementById("userDescription").value = description;
  openModal("userModal");
}

async function handleUserFormSubmit(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("usuario"));
  const password = localStorage.getItem("password");
  const userName = document.getElementById("userName").value;
  const userDescription = document.getElementById("userDescription").value;

  try {
    if (editingUserId !== null) {
      const response = await fetch(`${API_URL}/api/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userDescription }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarUsuarios();
        renderUsers();
        closeUserModal();
        openSuccessModal(
          "¡Usuario Actualizado!",
          "Los cambios han sido guardados",
        );
        setTimeout(closeSuccessModal, 1500);
      }
    } else {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          password: password,
          new_username: userName,
          new_password: "password123", //esto es una contraseña por defecto pero se podria añadir pa que se pueda agregar tambien en el form
          description: userDescription,
        }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarUsuarios();
        renderUsers();
        closeUserModal();
        openSuccessModal("¡Usuario Añadido!", "El usuario ha sido creado");
        setTimeout(closeSuccessModal, 1500);
      }
    }
  } catch (error) {
    console.error("Error guardando usuario:", error);
  }
}
// DELETE
function openDeleteGameModal(gameId, gameName) {
  deletingGameId = gameId;
  deletingUserId = null;
  document.getElementById("deleteItemName").textContent = gameName;
  openModal("deleteModal");
}

function openDeleteUserModal(userId, username) {
  deletingUserId = userId;
  deletingGameId = null;
  document.getElementById("deleteItemName").textContent = username;
  openModal("deleteModal");
}

async function handleDelete() {
  try {
    const user = JSON.parse(localStorage.getItem("usuario"));
    const password = localStorage.getItem("password");

    if (deletingGameId !== null) {
      const response = await fetch(`${API_URL}/api/games/${deletingGameId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, password }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarJuegos();
        renderGames();
        closeDeleteModal();
        openSuccessModal(
          "¡Eliminado!",
          "El juego ha sido eliminado correctamente",
        );
        setTimeout(closeSuccessModal, 1500);
      }
    } else if (deletingUserId !== null) {
      const response = await fetch(`${API_URL}/api/users/${deletingUserId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, password }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarUsuarios();
        renderUsers();
        closeDeleteModal();
        openSuccessModal(
          "¡Eliminado!",
          "El usuario ha sido eliminado correctamente",
        );
        setTimeout(closeSuccessModal, 1500);
      }
    }
  } catch (error) {
    console.error("Error eliminando:", error);
  }
}
