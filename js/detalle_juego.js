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
    setupLogoutHandler();
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
  const logrosParam = urlParams.get("logros");
  let logros = [];
  

  
  try {
    if (logrosParam) {
      logros = JSON.parse(decodeURIComponent(logrosParam));
    } else {
      console.warn("No se encontró parámetro logros en la URL");
    }
  } catch (e) {
    console.error("Error al parsear logros:", e);
  }

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
  // MODAL
  // ======================
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
      if (e.target === modal) hideModal();
    });
  }

  // ======================
  // RENDERIZAR LOGROS DINÁMICOS
  // ======================
  const achievementsSection = document.querySelector(".achievements-section");
  if (achievementsSection) {
    // Actualizar el título con el conteo de logros
    const achievementsTitle = achievementsSection.querySelector(".achievements-title");
    if (achievementsTitle) {
      achievementsTitle.textContent = `Logros (${logros.length}/${logros.length})`;
    }

    const oldCards = achievementsSection.querySelectorAll(".achievement-card");
    oldCards.forEach((card) => card.remove());

    // Renderizar los nuevos logros
    if (logros.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No hay logros para este juego aún";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.color = "#999";
      achievementsSection.appendChild(emptyMsg);
    } else {
      logros.forEach((logro) => {
        const card = document.createElement("div");
        const rarityClass = `rarity-${(logro.rarity || "COMMON").toLowerCase()}`;
        card.className = `achievement-card ${rarityClass}`;
        const hoy = new Date().toISOString().split("T")[0];
        card.innerHTML = `
          <img src="${logro.imagen || "../img/img1.webp"}" alt="logro" class="achievement-img">

          <div class="achievement-info">
            <h3>${logro.nombre}</h3>
            <p>${logro.descripcion}</p>
            <span class="rarity rarity-badge-${(logro.rarity || "COMMON").toLowerCase()}">${logro.rarity || "COMMON"}</span>
          </div>

          <div class="achievement-meta">
            <i data-lucide="award" class="trophy"></i>
            <span class="date">${logro.fecha || hoy}</span>
          </div>
        `;
        achievementsSection.appendChild(card);
      });
      lucide.createIcons();
    }
  }

  // ======================
  // FUNCIÓN PARA VERIFICAR SI JUEGO ESTÁ EN BIBLIOTECA
  // ======================
  function verificarJuegoEnBiblioteca() {
    let biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");
    return biblioteca.some((item) => item.nombreJuego === titulo);
  }

  // Desactivar status buttons al cargar
  function desactivarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    });
  }

  // Activar status buttons
  function activarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });
  }

  // Verificar al cargar si el juego ya está en biblioteca
  if (verificarJuegoEnBiblioteca()) {
    activarStatusBtns();
  } else {
    desactivarStatusBtns();
  }

  // ======================
  // ESTADO DEL JUEGO 
  // ======================
  const statusBtns = document.querySelectorAll(".status-btn");
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Si el botón está desactivado, no hacer nada
      if (btn.disabled) return;
      // eliminar clase active de todos los botones
      statusBtns.forEach((b) => b.classList.remove("active"));
      // Agregar clase active al botón clicado
      btn.classList.add("active");

      // Determinar el estado
      const estado = btn.classList.contains("playing")
        ? "jugando"
        : btn.classList.contains("completed")
          ? "completado"
          : btn.classList.contains("pending")
            ? "pendiente"
            : "abandonado";

      // Obtener biblioteca y actualizar el juego
      let biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");
      const itemIndex = biblioteca.findIndex((item) => item.nombreJuego === titulo);
      
      if (itemIndex !== -1) {
        // Si el juego está en biblioteca, actualizar su estado
        biblioteca[itemIndex].estado = estado;
        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        showModal("Estado actualizado", `El estado de ${titulo} ha sido cambiado a ${estado}`);
      } else {
        // Si no está en biblioteca, informar al usuario
        showModal("No en biblioteca", "Debes agregar el juego a tu biblioteca primero");
      }
    });
  });

  // ======================
  // AGREGAR A BIBLIOTECA
  // ======================
  const addToLibraryBtn = document.getElementById("addToLibraryBtn");
  if (addToLibraryBtn) {
    addToLibraryBtn.addEventListener("click", () => {
      // Obtener biblioteca actual del localStorage
      let biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");

      // Verificar si el juego ya está en la biblioteca
      const existe = biblioteca.some((item) => item.nombreJuego === titulo);

      if (existe) {
        showModal("Ya en biblioteca", "Este juego ya está en tu biblioteca");
        return;
      }

      // Determinar el estado seleccionado
      let estadoSeleccionado = "pendiente";
      const statusBtns = document.querySelectorAll(".status-btn");
      statusBtns.forEach((btn) => {
        if (btn.classList.contains("active")) {
          estadoSeleccionado = btn.classList.contains("playing")
            ? "jugando"
            : btn.classList.contains("completed")
              ? "completado"
              : btn.classList.contains("pending")
                ? "pendiente"
                : "abandonado";
        }
      });

      
      const referencia = {
        nombreJuego: titulo,
        estado: estadoSeleccionado
      };

      // Agregar a la biblioteca
      biblioteca.push(referencia);
      localStorage.setItem("biblioteca", JSON.stringify(biblioteca));

      // Cambiar estado del botón
      addToLibraryBtn.innerHTML = `<i data-lucide="check"></i> Agregado a biblioteca`;
      addToLibraryBtn.classList.add("active-follow");
      addToLibraryBtn.disabled = true;

      // Activar los status buttons
      activarStatusBtns();

      // Mostrar modal de confirmación
      showModal("¡Éxito!", `${titulo} ha sido agregado a tu biblioteca con estado: ${estadoSeleccionado}`);

      // Actualizar iconos
      lucide.createIcons();
    });
  }
});
