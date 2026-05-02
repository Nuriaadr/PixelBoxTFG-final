document.addEventListener("DOMContentLoaded", async () => {
  const userStr = localStorage.getItem("usuario");
  const user = JSON.parse(userStr);

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("id")?.trim();
  const titulo = urlParams.get("titulo");

  const reviewBtn = document.querySelector(".btn-review");
  const reviewModal = document.getElementById("reviewModal");
  const closeReviewModal = document.getElementById("closeReviewModal");
  const cancelReviewBtn = document.getElementById("cancelReviewBtn");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const reviewStarsInput = document.getElementById("reviewStarsInput");
  const reviewComment = document.getElementById("reviewComment");
  const reviewGameName = document.getElementById("reviewGameName");
  const reviewUserName = document.getElementById("reviewUserName");

  if (reviewGameName) reviewGameName.textContent = titulo || "Juego";
  if (reviewUserName)
    reviewUserName.textContent = user ? user.username : "usuario";

  async function verificarEnBiblioteca() {
    if (!user || !gameId) return false;
    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/library/has/${gameId}`,
      );
      const data = await response.json();
      return data.success ? data.data.has_game : false;
    } catch (error) {
      return false;
    }
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", async () => {
      const enBiblioteca = await verificarEnBiblioteca();
      if (!enBiblioteca) {
        mostrarMensaje(
          "Error",
          "Debes añadir el juego a tu biblioteca antes de escribir una reseña.",
        );
        return;
      }
      reviewModal?.classList.remove("hidden");
    });
  }

  function cerrarModal() {
    reviewModal?.classList.add("hidden");
    limpiarFormulario();
  }

  closeReviewModal?.addEventListener("click", cerrarModal);
  cancelReviewBtn?.addEventListener("click", cerrarModal);
  reviewModal?.addEventListener("click", (e) => {
    if (e.target === reviewModal) cerrarModal();
  });

  if (reviewStarsInput) {
    reviewStarsInput.style.cursor = "pointer";

    reviewStarsInput.addEventListener("click", (e) => {
      //Calcular la calificación basada en la posición del clic dentro del elemento
      const rect = reviewStarsInput.getBoundingClientRect();
      const clickX = e.clientX - rect.left; //posición horizontal del clic dentro del elemento
      const starWidth = rect.width / 5; //ancho de cada estrella 
      let rating = Math.max(1, Math.min(5, Math.floor(clickX / starWidth) + 1)); 
      reviewStarsInput.dataset.rating = rating; 
      actualizarEstrellas(rating); //actualizar como se ven  las estrellas para reflejar la calificacion puesta
    });

    //Agregar efecto hover para mostrar la calificación que se seleccionaría al hacer clic
    reviewStarsInput.addEventListener("mousemove", (e) => {
      const rect = reviewStarsInput.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const starWidth = rect.width / 5;
      let hoverRating = Math.max(
        1,
        Math.min(5, Math.floor(clickX / starWidth) + 1),
      );
      actualizarEstrellas(hoverRating);
    });

    //volver la visualización de las estrellas a la calificación actual al salir del area de las estrellas
    reviewStarsInput.addEventListener("mouseleave", () => {
      actualizarEstrellas(reviewStarsInput.dataset.rating || 5);
    });
  }

  //para actualizar la visualización de las estrellas según la calificación dada
  function actualizarEstrellas(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "★" : "☆";
    }
    reviewStarsInput.textContent = stars;
  }

  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", async () => {
      const rating = parseInt(reviewStarsInput.dataset.rating || 5);
      const comment = reviewComment.value.trim();

      if (!comment) {
        mostrarMensaje("Campo vacío", "Por favor escribe un comentario");
        return;
      }
      if (comment.length < 10) {
        mostrarMensaje(
          "Comentario muy corto",
          "El comentario debe tener al menos 10 caracteres",
        );
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/games/${gameId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            rating: rating,
            content: comment,
          }),
        });
        const data = await response.json();

        if (data.success) {
          mostrarMensaje(
            "¡Reseña publicada!",
            "Tu reseña ha sido publicada exitosamente",
          );
          await cargarResenas();
          setTimeout(cerrarModal, 500);
        } else {
          mostrarMensaje(
            "Error",
            data.message || "No se pudo publicar la reseña",
          );
        }
      } catch (error) {
        console.error("Error publicando reseña:", error);
        mostrarMensaje("Error", "No se pudo conectar con el servidor");
      }
    });
  }

  async function cargarResenas() {
    const reviewsContainer = document.getElementById("reviewsContainer");
    if (!reviewsContainer || !gameId) return;

    try {
      const response = await fetch(`${API_URL}/api/games/${gameId}/reviews`);
      const data = await response.json();

      if (!data.success || data.data.length === 0) {
        reviewsContainer.innerHTML =
          '<div class="empty-reviews">Aún no hay reseñas. ¡Sé el primero en escribir una!</div>';
        return;
      }

      //Mapear cada reseña a un bloque HTML
      reviewsContainer.innerHTML = data.data
        .map((resena) => {
          //visual de la calificación con estrellas
          const stars =
            "★".repeat(resena.rating) + "☆".repeat(5 - resena.rating);
          const fecha = resena.created_at
            ? resena.created_at.split(" ")[0]
            : "";
          const likes = Math.floor(Math.random() * 101);
          const likesText =
            likes === 1
              ? "1 persona encontró útil esta reseña"
              : `${likes} personas encontraron útil esta reseña`;

          return `
                    <div class="review-card">
                        <div class="review-img">
                            <img src="../img/user1.webp" alt="${resena.username}">
                        </div>
                        <div class="review-content">
                            <h3>${resena.username}</h3>
                            <span class="review-meta">${resena.username} · ${fecha}</span>
                            <p>${resena.content || ""}</p>
                            <span class="review-likes">${likesText}</span>
                        </div>
                        <div class="review-rating">${stars}</div>
                    </div>
                `;
        }).join("");
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    }
  }

  //para limpiar el formulario de la reseña al cerrar el modal
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

  const closeModal = document.getElementById("closeModal");
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      document.getElementById("modal")?.classList.add("hidden");
    });
  }

  document.getElementById("modal")?.addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      document.getElementById("modal")?.classList.add("hidden");
    }
  });

  await cargarResenas();
});
