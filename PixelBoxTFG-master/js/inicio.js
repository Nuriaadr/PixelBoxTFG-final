document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  // PROTEGER PÁGINA
  let user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  // MOSTRAR USUARIO
  let userName = document.getElementById("userName");
  if (userName) {
    userName.textContent = user;
  }

  let userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  // LOGOUT
  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../index.html";
    });
  }

  // MODAL
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const closeModal = document.getElementById("closeModal");

  function showModal(title, message) {
    if (!modal) return;

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
  }

  function hideModal() {
    modal.classList.add("hidden");
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  }

  // BOTÓN
  const addGameBtn = document.getElementById("addGameBtn");

  if (addGameBtn) {
    addGameBtn.addEventListener("click", () => {

      let juegos = JSON.parse(localStorage.getItem("biblioteca")) || [];

      juegos.push("Cyberpunk Chronicles");

      localStorage.setItem("biblioteca", JSON.stringify(juegos));

      showModal("¡Genial!", "Juego añadido a tu biblioteca");
    });
  } else {
    console.error("No existe el botón addGameBtn en esta página");
  }

});