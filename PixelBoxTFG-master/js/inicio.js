lucide.createIcons();

// PROTEGER PÁGINA
let user = localStorage.getItem("usuario");

if (!user) {
  window.location.href = "../index.html";
}

// MOSTRAR USUARIO
let userName = document.getElementById("userName");
if (userName) {
  userName.textContent = user;
}
let userAvatar = document.getElementById("userAvatar");

if (userAvatar) {
  userAvatar.style.cursor = "pointer";

  userAvatar.addEventListener("click", function () {
    window.location.href = "perfil.html";
  });
}
// LOGOUT
let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
  });
}

// BIBLIOTECA
let addGameBtn = document.getElementById("addGameBtn");
if (addGameBtn) {
  addGameBtn.addEventListener("click", function () {
    let juegos = JSON.parse(localStorage.getItem("biblioteca")) || [];

    juegos.push("Cyberpunk Chronicles");

    localStorage.setItem("biblioteca", JSON.stringify(juegos));

    alert("Juego añadido a tu biblioteca");
  });
}
