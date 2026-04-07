lucide.createIcons();

let usuario = document.getElementById("usuario");
let password = document.getElementById("password");

let errorUsuario = document.getElementById("errorUsuario");
let errorPassword = document.getElementById("errorPassword");

usuario.addEventListener("input", function () {
    this.classList.remove("input-error", "input-correct");

    if (this.value.trim() === "") {
        errorUsuario.textContent = "El usuario es obligatorio";
        this.classList.add("input-error");
    } else if (this.value.length < 4) {
        errorUsuario.textContent = "Mínimo 4 caracteres";
        this.classList.add("input-error");
    } else {
        errorUsuario.textContent = "";
        this.classList.add("input-correct");
    }
});

password.addEventListener("input", function () {
    this.classList.remove("input-error", "input-correct");

    if (this.value.trim() === "") {
        errorPassword.textContent = "La contraseña es obligatoria";
        this.classList.add("input-error");
    } else if (this.value.length < 6) {
        errorPassword.textContent = "Mínimo 6 caracteres";
        this.classList.add("input-error");
    } else {
        errorPassword.textContent = "";
        this.classList.add("input-correct");
    }
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let valido = true;

    errorUsuario.textContent = "";
    errorPassword.textContent = "";

    usuario.classList.remove("input-error", "input-correct");
    password.classList.remove("input-error", "input-correct");

    if (usuario.value.trim() === "" || usuario.value.length < 4) {
        errorUsuario.textContent = "Usuario inválido";
        usuario.classList.add("input-error");
        valido = false;
    } else {
        usuario.classList.add("input-correct");
    }

    if (password.value.trim() === "" || password.value.length < 6) {
        errorPassword.textContent = "Contraseña inválida";
        password.classList.add("input-error");
        valido = false;
    } else {
        password.classList.add("input-correct");
    }

    if (valido) {
        if (usuario.value === "admin" && password.value === "admin123") {
            localStorage.setItem("usuario", "admin");
            window.location.href = "html/inicio.html";
        } else if (usuario.value === "jugador_pro" && password.value === "password") {
            localStorage.setItem("usuario", "jugador_pro");
            window.location.href = "html/inicio.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }
});

//Comprobar si hay usuario logueado
let user = localStorage.getItem("usuario");
if (!user) {
    window.location.href = "../index.html";
}

document.getElementById("userName").textContent = user;

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
});

document.getElementById("addGameBtn").addEventListener("click", function () {

    let juegos = JSON.parse(localStorage.getItem("biblioteca")) || [];

    juegos.push("Cyberpunk Chronicles");

    localStorage.setItem("biblioteca", JSON.stringify(juegos));

    alert("Juego añadido a tu biblioteca");
});