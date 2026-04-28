lucide.createIcons();

const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const errorUsuario = document.getElementById("errorUsuario");
const errorPassword = document.getElementById("errorPassword");

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    errorUsuario.textContent = "";
    errorPassword.textContent = "";

    let valido = true;

    if (usuario.value.trim() === "" || usuario.value.length < 4) {
      errorUsuario.textContent = "El usuario debe tener al menos 4 caracteres";
      valido = false;
    }

    if (password.value.trim() === "" || password.value.length < 6) {
      errorPassword.textContent =
        "La contraseña debe tener al menos 6 caracteres";
      valido = false;
    }

    if (!valido) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usuario.value.trim(),
          password: password.value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("usuario", JSON.stringify(data.user));
        localStorage.setItem("rol", data.user.role);

        if (data.user.role === "admin") {
          window.location.href = "html/vista_admin.html";
        } else {
          window.location.href = "html/inicio.html";
        }
      } else {
        errorPassword.textContent =
          data.message || "Usuario o contraseña incorrecta";
      }
    } catch (error) {
      console.error("Error:", error);
      errorPassword.textContent = "No se pudo conectar con el servidor";
    }
  });
