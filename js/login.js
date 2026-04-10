// ===================== LOGIN =====================
// TODO: MIGRACIÓN CRÍTICA AL BACKEND - Reemplazar autenticación hardcodeada con API
// PRIORIDAD: ALTA - Debe implementar autenticación backend apropiada
// Cambios clave: Reemplazar credenciales hardcodeadas con llamadas API a /api/auth/login

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
    errorUsuario.textContent = "El usuario debe tener al menos 4 caracteres";
    valido = false;
  }

  if (password.value.trim() === "" || password.value.length < 6) {
    errorPassword.textContent =
      "La contraseña debe tener al menos 6 caracteres";
    valido = false;
  }

  if (valido) {
    /**
     * TODO: REFACTORIZAR - Reemplazar autenticación hardcodeada con API backend
     * Razón: Las credenciales deben validarse de forma segura por el servidor
     * API backend: POST /api/auth/login
     *
     * Implementación actual (ELIMINAR/REEMPLAZAR):
     *   if (usuario.value === "admin" && password.value === "admin123") {
     *     localStorage.setItem("usuario", "admin");
     *     localStorage.setItem("rol", "admin");
     *   }
     *
     * Después (NUEVO):
     *   const response = await fetch('/api/auth/login', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *       username: usuario.value,
     *       password: password.value
     *     })
     *   });
     *
     *   if (response.ok) {
     *     const data = await response.json();
     *     localStorage.setItem("token", data.token);  // JWT o token de sesión
     *     localStorage.setItem("usuario", data.username);
     *     localStorage.setItem("rol", data.role);
     *     window.location.href = data.redirect_url;
     *   } else {
     *     errorPassword.textContent = "Usuario o contraseña incorrecta";
     *   }
     */
    if (usuario.value === "admin" && password.value === "admin123") {
      localStorage.setItem("usuario", "admin");
      localStorage.setItem("rol", "admin");
      window.location.href = "html/vista_admin.html";
    } else if (
      usuario.value === "jugador_pro" &&
      password.value === "password"
    ) {
      localStorage.setItem("usuario", "@jugador_pro");
      localStorage.setItem("rol", "jugador");
      window.location.href = "html/inicio.html";
    } else {
      errorPassword.textContent =
        "Usuario o contraseña incorrecta";
    }
  }
});

let rol = localStorage.getItem("rol");
