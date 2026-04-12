// ===================== MODAL DE RESEÑAS =====================
//  Operaciones CRUD deben implementarse en PHP 
// - CREATE: POST /api/games/{gameId}/reviews (crear reseña)
// - READ: GET /api/games/{gameId}/reviews (obtener reseñas)
// Código para manejar el modal de reseñas
document.addEventListener("DOMContentLoaded", () => {
  // Obtener usuario del localStorage
  const user = localStorage.getItem("usuario") || "usuario";

  // Obtener el título del juego de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const titulo = urlParams.get("titulo");

  // Elementos del modal
  const reviewBtn = document.querySelector(".btn-review");
  const reviewModal = document.getElementById("reviewModal");
  const closeReviewModal = document.getElementById("closeReviewModal");
  const cancelReviewBtn = document.getElementById("cancelReviewBtn");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const reviewStarsInput = document.getElementById("reviewStarsInput");
  const reviewComment = document.getElementById("reviewComment");
  const reviewGameName = document.getElementById("reviewGameName");
  const reviewUserName = document.getElementById("reviewUserName");

  // Actualizar nombre del juego y usuario en el modal
  if (reviewGameName) reviewGameName.textContent = titulo || "Juego";
  if (reviewUserName) reviewUserName.textContent = `${user}`;

  // Función para verificar si el juego está en la biblioteca
  function estaEnBiblioteca(titulo) {
    const biblioteca = JSON.parse(localStorage.getItem("biblioteca") || "[]");
    return biblioteca.some(juego => juego.nombreJuego === titulo);
  }

  // Abrir modal
  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      if (!estaEnBiblioteca(titulo)) {
        mostrarMensaje("Error", "Debes añadir el juego a tu biblioteca antes de poder escribir una reseña.");
        return;
      }
      if (reviewModal) {
        reviewModal.classList.remove("hidden");
      }
    });
  }

  // Cerrar modal - botón X
  if (closeReviewModal) {
    closeReviewModal.addEventListener("click", () => {
      if (reviewModal) {
        reviewModal.classList.add("hidden");
        limpiarFormulario();
      }
    });
  }

  // Cerrar modal - botón Cancelar
  if (cancelReviewBtn) {
    cancelReviewBtn.addEventListener("click", () => {
      if (reviewModal) {
        reviewModal.classList.add("hidden");
        limpiarFormulario();
      }
    });
  }

  // Manejo del rating 
  if (reviewStarsInput) {
    reviewStarsInput.style.cursor = "pointer";
    reviewStarsInput.addEventListener("click", (e) => {
      const rect = reviewStarsInput.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const starWidth = rect.width / 5;
      let rating = Math.floor(clickX / starWidth) + 1;
      
      // Asegurar que el rating esté entre 1 y 5
      rating = Math.max(1, Math.min(5, rating));

      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < rating ? "★" : "☆";
      }
      reviewStarsInput.textContent = stars;
      reviewStarsInput.dataset.rating = rating;
    });

    reviewStarsInput.addEventListener("mousemove", (e) => {
      const rect = reviewStarsInput.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const starWidth = rect.width / 5;
      let hoverRating = Math.floor(clickX / starWidth) + 1;
      hoverRating = Math.max(1, Math.min(5, hoverRating));

      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < hoverRating ? "★" : "☆";
      }
      reviewStarsInput.textContent = stars;
    });

    // Restaurar al valor guardado cuando sale del hover
    reviewStarsInput.addEventListener("mouseleave", () => {
      const savedRating = reviewStarsInput.dataset.rating || 5;
      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < savedRating ? "★" : "☆";
      }
      reviewStarsInput.textContent = stars;
    });
  }

  // Enviar reseña
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", () => {
      const rating = reviewStarsInput.dataset.rating || 5;
      const comment = reviewComment.value.trim();

      // Validación
      if (!comment) {
        mostrarMensaje("Campo vacío", "Por favor, escribe un comentario para tu reseña");
        return;
      }

      if (comment.length < 10) {
        mostrarMensaje("Comentario muy corto", "El comentario debe tener al menos 10 caracteres");
        return;
      }

      // Guardar reseña en localStorage
      const resena = {
        usuario: user,
        juego: titulo,
        calificacion: rating,
        comentario: comment,
        fecha: new Date().toISOString().split("T")[0],
      };

      let resenas = JSON.parse(localStorage.getItem("resenas") || "[]");
      resenas.push(resena);
      localStorage.setItem("resenas", JSON.stringify(resenas));

      // Mostrar confirmación
      mostrarMensaje("¡Reseña publicada!", "Tu reseña ha sido publicada exitosamente");

      // Renderizar las reseñas nuevamente
      renderizarResenas();

      // Limpiar y cerrar modal
      setTimeout(() => {
        limpiarFormulario();
        if (reviewModal) {
          reviewModal.classList.add("hidden");
        }
      }, 500);
    });
  }

  // Cerrar modal al hacer click fuera
  if (reviewModal) {
    reviewModal.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.add("hidden");
        limpiarFormulario();
      }
    });
  }

  // Funciones auxiliares
  function limpiarFormulario() {
    if (reviewComment) reviewComment.value = "";
    if (reviewStarsInput) {
      reviewStarsInput.textContent = "★★★★★";
      delete reviewStarsInput.dataset.rating;
    }
  }

  function mostrarMensaje(titulo, mensaje) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");

    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = titulo;
      modalMessage.textContent = mensaje;
      modal.classList.remove("hidden");
    }
  }

  // Renderizar reseñas del juego
  function renderizarResenas() {
    const reviewsContainer = document.getElementById("reviewsContainer");
    if (!reviewsContainer) return;

    // Obtener todas las reseñas
    let resenas = JSON.parse(localStorage.getItem("resenas") || "[]");
    
    // Filtrar por el juego actual
    const resenasjuego = resenas.filter((r) => r.juego === titulo);

    // Limpiar contenedor
    reviewsContainer.innerHTML = "";

    if (resenasjuego.length === 0) {
      reviewsContainer.innerHTML = '<div class="empty-reviews">Aún no hay reseñas. ¡Sé el primero en escribir una!</div>';
      // Actualizar valoración a 0 si no hay reseñas
      const ratingSpan = document.querySelector(".meta .rating");
      if (ratingSpan) {
        ratingSpan.textContent = `⭐ 0.0 / 5`;
      }
      const starsDiv = document.querySelector(".stars");
      if (starsDiv) {
        starsDiv.textContent = "☆☆☆☆☆";
      }
      return;
    }

    // Renderizar cada reseña
    resenasjuego.forEach((resena) => {
      const stars = "★".repeat(resena.calificacion) + "☆".repeat(5 - resena.calificacion);
      
      // Generar número aleatorio de likes entre 0 y 100
      const likes = Math.floor(Math.random() * 101);
      const likesText = likes === 1 ? "1 persona encontró útil esta reseña" : `${likes} personas encontraron útil esta reseña`;
      
      const reviewCard = document.createElement("div");
      reviewCard.className = "review-card";
      reviewCard.innerHTML = `
        <div class="review-img">
          <img src="../img/user1.webp" alt="${resena.usuario}">
        </div>

        <div class="review-content">
          <h3>${resena.juego}</h3>
          <span class="review-meta">${resena.usuario} · ${resena.fecha}</span>
          <p>${resena.comentario}</p>
          <span class="review-likes">${likesText}</span>
        </div>

        <div class="review-rating">
          ${stars}
        </div>
      `;
      
      reviewsContainer.appendChild(reviewCard);
    });

    // Calcular y actualizar la valoración promedio
    if (resenasjuego.length > 0) {
      const average = resenasjuego.reduce((sum, r) => sum + r.calificacion, 0) / resenasjuego.length;
      const ratingSpan = document.querySelector(".meta .rating");
      if (ratingSpan) {
        ratingSpan.textContent = `⭐ ${average.toFixed(1)} / 5`;
      }
      const starsDiv = document.querySelector(".stars");
      if (starsDiv) {
        const filledStars = Math.round(average);
        starsDiv.textContent = "★".repeat(filledStars) + "☆".repeat(5 - filledStars);
      }
    }
  }

  // Inicializar renderización de reseñas al cargar
  renderizarResenas();
});
