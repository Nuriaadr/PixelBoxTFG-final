document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ======================
  // USUARIO
  // ======================
  let user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  let userName = document.getElementById("userName");
  if (userName) userName.textContent = user;

  let userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../index.html";
    });
  }

  // ======================
  // OBTENER DATOS DE LA URL
  // ======================
  const urlParams = new URLSearchParams(window.location.search);
  const titulo = urlParams.get("titulo");
  const imagen = urlParams.get("imagen");
  const año = urlParams.get("año");
  const descripcion = urlParams.get("descripcion") || "Descripción del juego";
  const rating = urlParams.get("rating") || "4.3";

  // ======================
  // ACTUALIZAR ELEMENTOS HTML
  // ======================
  const bannerImg = document.querySelector(".game-banner img");
  if (bannerImg) {
    bannerImg.src = imagen || "../img/img1.webp";
    bannerImg.alt = titulo || "Juego";
  }

  const gameTitle = document.querySelector(".game-info h1");
  if (gameTitle) gameTitle.textContent = titulo || "Título del Juego";

  const yearSpan = document.querySelector(".meta .year");
  if (yearSpan) yearSpan.textContent = año || "2025";

  const ratingSpan = document.querySelector(".meta .rating");
  if (ratingSpan) ratingSpan.textContent = `⭐ ${rating} / 5`;

  const descriptionP = document.querySelector(".game-info .description");
  if (descriptionP) descriptionP.textContent = descripcion;

  // ======================
  // ESTADO DEL JUEGO (guardable en localStorage)
  // ======================
  const statusBtns = document.querySelectorAll(".status-btn");
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      statusBtns.forEach((b) => (b.style.opacity = "0.5"));
      btn.style.opacity = "1";

      // Guardar el estado en localStorage
      const estado = btn.classList.contains("playing")
        ? "jugando"
        : btn.classList.contains("completed")
          ? "completado"
          : btn.classList.contains("pending")
            ? "pendiente"
            : "abandonado";

      localStorage.setItem(`juego_${titulo}`, estado);
    });
  });
});
