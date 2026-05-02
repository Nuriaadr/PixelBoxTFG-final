document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();

  // USUARIO
  const userStr = localStorage.getItem("usuario");
  let user = JSON.parse(userStr);

  
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

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

  function updateHeartButtonDetail(btn, isFavorite) {
    if (isFavorite) {
      btn.classList.add("favorited");
    } else {
      btn.classList.remove("favorited");
    }
    lucide.createIcons();
  }

  // OBTENER DATOS DE LA URL
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("id");
  const titulo = urlParams.get("titulo");
  const imagen = urlParams.get("imagen");
  const año = urlParams.get("año");
  const descripcion = urlParams.get("descripcion") || "Descripción del juego";
  const rating = urlParams.get("rating") || "4.3";
  const desarrollador =
    urlParams.get("desarrollador") || "Desarrollador Desconocido";
  const genero = urlParams.get("genero") || "Género Desconocido";
  const plataforma = urlParams.get("plataforma") || "Plataforma Desconocida";

  // FUNCIONES PARA BIBLIOTECA
  async function verificarJuegoEnBibliotecaAPI() {
    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/library/has/${gameId}`,
      );
      const data = await response.json();
      return data.success ? data.data.has_game : false; //si la respuesta es exitosa devuelve el valor de has_game, si no devuelve false para que no se active nada en la página
    } catch (error) {
      console.error("Error verificando biblioteca:", error);
      return false;
    }
  }

  async function obtenerEstadoDelJuegoAPI() {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}/library`);
      const data = await response.json();
      if (!data.success) return null; //esto es por si hay algun error al obtener la biblioteca, asi no se rompe la pagina y simplemente no se activa ningun estado
      const juego = data.data.find((j) => j.game_id == gameId);
      return juego ? juego.status : null; //si el juego no está en la biblioteca se devuelve null, si está se devuelve su estado
    } catch (error) {
      console.error("Error obteniendo estado:", error);
      return null;
    }
  }

  async function agregarABibliotecaAPI() {
    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/library/${gameId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "pendiente" }),
        },
      );
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error agregando a biblioteca:", error);
      return false;
    }
  }

  async function actualizarEstadoAPI(nuevoEstado) {
    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/library/${gameId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nuevoEstado }),
        },
      );
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return false;
    }
  }

  function actualizarStatusActivo(estado) {
    //Mapeo de estados a clases para activar el botón correspondiente
    const statusClassByEstado = {
      jugando: "playing",
      completado: "completed",
      pendiente: "pending",
      abandonado: "abandoned",
    };
    const classToActivate = estado ? statusClassByEstado[estado] : null; //si el estado es null o no coincide con ninguno de los casos, 3esto será null y no se activará ningún botón
    const statusBtns = document.querySelectorAll(".status-btn");

    statusBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (classToActivate && btn.classList.contains(classToActivate)) {
        btn.classList.add("active");
      }
    });
  }

  // AÑADIR A BIBLIOTECA
  const addToLibraryBtn = document.getElementById("addToLibraryBtn");
  if (addToLibraryBtn) {
    // Verificar estado inicial y si esta en biblioteca 
    const enBiblioteca = await verificarJuegoEnBibliotecaAPI();
    const estado = await obtenerEstadoDelJuegoAPI();

    if (enBiblioteca) {
      addToLibraryBtn.textContent = "Ya en Biblioteca";
      addToLibraryBtn.disabled = true;
      addToLibraryBtn.style.opacity = "0.6";
      //si está en la biblioteca activa el btn de status que corresponda
      actualizarStatusActivo(estado);
      activarStatusBtns();
    } else {
      //si no está en la biblitoeca el btn de añadir a biblioteca esta activo pero los de status no
      addToLibraryBtn.textContent = "Añadir a Biblioteca";
      addToLibraryBtn.disabled = false;
      addToLibraryBtn.style.opacity = "1";
    }

    addToLibraryBtn.addEventListener("click", async () => {
      //si esta en bliblioteca no se puede añadir de nuevo y muestra un modal
      if (await verificarJuegoEnBibliotecaAPI()) {
        showModal("¡Oye!", "Este juego ya está en tu biblioteca.");
        return;
      }

      const success = await agregarABibliotecaAPI();
      if (success) {
        //al añadir el juego a la biblioteca, el botón se desactiva y se muestra un mensaje 
        addToLibraryBtn.textContent = "Ya en Biblioteca"; //el texto del btn cambia
        addToLibraryBtn.disabled = true;
        addToLibraryBtn.style.opacity = "0.6";
        activarStatusBtns();
        actualizarStatusActivo("pendiente");
        showModal("Éxito", "Juego añadido a tu biblioteca correctamente.");
      } else {
        showModal("Error", "No se pudo añadir el juego a la biblioteca.");
      }
    });
  }

  // FAVORITOS
  const favoriteBtn = document.getElementById("favoriteBtn");
  if (favoriteBtn && gameId) {
    isFavorito(gameId).then((esFav) => {
      updateHeartButtonDetail(favoriteBtn, esFav);
    });

    favoriteBtn.addEventListener("click", async () => {
      //Verificar si el juego está en la biblioteca y si no está muestra un modal de que tiene que estarlo pa hacer lo de añadir a favoritos
      const inLibrary = await isGameInLibrary(gameId);
      if (!inLibrary) {
        showModal(
          "Acción no permitida",
          "Debes añadir el juego a tu biblioteca primero para marcarlo como favorito.",
        );
        return;
      }

      await toggleFavorito(gameId); //togglea el favorito, si no estaba lo añade y si ya estaba lo quita
      const ahora = await isFavorito(gameId); //obtener el estado actualizado después de togglear
      updateHeartButtonDetail(favoriteBtn, ahora);
    });
  }

  // ACTUALIZAR ELEMENTOS HTML estos datos se pasan por la url desde las otras pag, si no hay por lo que sea se ponen unos valores default por si acaso
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
  if (ratingSpan) ratingSpan.textContent = `★ ${rating} / 5`;
  const descriptionP = document.querySelector(".game-info .description");
  if (descriptionP) descriptionP.textContent = descripcion;
  const infoCards = document.querySelectorAll(".info-card h3");
  if (infoCards[0]) infoCards[0].textContent = desarrollador;
  if (infoCards[1]) infoCards[1].textContent = genero;
  if (infoCards[2]) infoCards[2].textContent = plataforma;

  // MODAL
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const closeModal = document.getElementById("closeModal");

  function showModal(title, message) {
    if (!modal) return; //si no hay modal no se hace nada
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden"); //mostrar modal
  }

  function hideModal() {
    modal.classList.add("hidden"); //esconder modal
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal();
    });
  }

  //Desactivar status buttons al cargar
  function desactivarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    });
  }

  //Activar los btones de nuevo
  function activarStatusBtns() {
    const statusBtns = document.querySelectorAll(".status-btn");
    statusBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });
  }

  //STATUS BUTTONS
  const statusBtns = document.querySelectorAll(".status-btn");
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
    
        //Verificar si el juego está en la biblioteca y si no está muestra un modal de que tiene que estarlo pa hacer lo de actualizar estado
      const enBiblioteca = await verificarJuegoEnBibliotecaAPI();

      if (!enBiblioteca) {
        showModal(
          "Este juego no está en tu biblioteca",
          "Debes agregar el juego a tu biblioteca primero",
        );
        return;
      }

      statusBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      //el estado se pone segun la clase del btn pulsado, por defecto es pendiente pero si el btn tiene la clase jugando, completado o abandonado se cambia a ese estado
      let nuevoEstado = "pendiente";
      if (btn.classList.contains("playing")) {
        nuevoEstado = "jugando";
      } else if (btn.classList.contains("completed")) {
        nuevoEstado = "completado";
      } else if (btn.classList.contains("pending")) {
        nuevoEstado = "pendiente";
      } else if (btn.classList.contains("abandoned")) {
        nuevoEstado = "abandonado";
      }

      const success = await actualizarEstadoAPI(nuevoEstado);

      if (!success) {
        
        showModal("Error", "No se pudo actualizar el estado del juego.");
        btn.classList.remove("active");
      }
    });
  });

});
