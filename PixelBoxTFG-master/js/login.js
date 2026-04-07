lucide.createIcons();

let usuario = document.getElementById("usuario");
let password = document.getElementById("password");

let errorUsuario = document.getElementById("errorUsuario");
let errorPassword = document.getElementById("errorPassword");

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let valido = true;

  errorUsuario.textContent = "";
  errorPassword.textContent = "";

  if (usuario.value.trim() === "" || usuario.value.length < 4) {
    errorUsuario.textContent = "Usuario inválido";
    valido = false;
  }

  if (password.value.trim() === "" || password.value.length < 6) {
    errorPassword.textContent = "Contraseña inválida";
    valido = false;
  }

  if (valido) {
    if (usuario.value === "admin" && password.value === "admin123") {
      localStorage.setItem("usuario", "admin");
      localStorage.setItem("rol", "admin");
      window.location.href = "html/vista_admin.html";
    } else if (
      usuario.value === "jugador_pro" &&
      password.value === "password"
    ) {
      localStorage.setItem("usuario", "jugador_pro");
      localStorage.setItem("rol", "jugador");
      window.location.href = "html/inicio.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  let user = localStorage.getItem("usuario");
  let rol = localStorage.getItem("rol");

  if (!user || rol !== "admin") {
    window.location.href = "../index.html";
  }
});
