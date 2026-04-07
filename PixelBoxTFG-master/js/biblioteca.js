document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
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

  // ======================
  // DATOS DE LOS JUEGOS
  // ======================
  let juegosDefault = [
    { 
      titulo: "Legends of Eldoria", 
      estado: "completado", 
      imagen: "../img/img1.webp",
      logros: [
        {nombre: "Explorador del Mundo", descripcion: "Descubre todos los lugares secretos", rarity: "EPIC"},
        {nombre: "Maestro de Combate", descripcion: "Vence 100 enemigos", rarity: "LEGENDARY"}
      ]
    },
    { 
      titulo: "Dragon Quest Online", 
      estado: "jugando", 
      imagen: "../img/img2.webp",
      logros: [
        {nombre: "Cazador de Dragones", descripcion: "Derrota 50 dragones", rarity: "EPIC"},
        {nombre: "Héroe del Reino", descripcion: "Completa la historia principal", rarity: "LEGENDARY"}
      ]
    },
    { 
      titulo: "Velocity Racing", 
      estado: "pendiente", 
      imagen: "../img/img4.webp",
      logros: [
        {nombre: "Piloto Velocista", descripcion: "Completa 10 carreras", rarity: "RARE"},
        {nombre: "Campeón de Circuitos", descripcion: "Gana un campeonato", rarity: "EPIC"}
      ]
    },
    { 
      titulo: "Cyberpunk Chronicles", 
      estado: "jugando", 
      imagen: "../img/img4.webp",
      logros: [
        {nombre: "Hacker Maestro", descripcion: "Hackea 20 terminales", rarity: "EPIC"},
        {nombre: "Nómada Urbano", descripcion: "Visita todos los distritos", rarity: "EPIC"}
      ]
    },
    { 
      titulo: "Nightmare Manor", 
      estado: "pendiente", 
      imagen: "../img/img1.webp",
      logros: [
        {nombre: "Superviviente", descripcion: "Sobrevive la noche completa", rarity: "RARE"},
        {nombre: "Desvelador de Secretos", descripcion: "Descubre todos los misterios", rarity: "LEGENDARY"}
      ]
    },
  ];

  // Obtener juegos de localStorage
  let bibliotecaGuardada = JSON.parse(localStorage.getItem("biblioteca") || "[]");

  // Combinar juegos: primero los de la biblioteca, luego los por defecto
  let juegos = [...bibliotecaGuardada];
  
  // Agregar juegos por defecto que no estén en biblioteca
  juegosDefault.forEach((juegoDefault) => {
    const existe = juegos.some((j) => j.titulo === juegoDefault.titulo);
    if (!existe) {
      juegos.push(juegoDefault);
    }
  });

  // Filtrar juegos sin título válido y completar datos
  juegos = juegos
    .filter((juego) => juego.titulo && juego.titulo.trim() !== "")
    .map((juego) => ({
      titulo: juego.titulo,
      estado: juego.estado || "pendiente",
      imagen: juego.imagen || "../img/img1.webp",
      año: juego.año || 2025,
      descripcion: juego.descripcion || "Descripción del juego",
      rating: juego.rating || 4.0,
      logros: juego.logros || [],
      fechaAgregado: juego.fechaAgregado || null,
    }));

  let filtroActual = "todos";
  let juegoAEliminar = null;

  // Función para guardar la biblioteca en localStorage
  function guardarBiblioteca() {
    localStorage.setItem("biblioteca", JSON.stringify(juegos));
  }

  // Función para renderizar juegos dinámicamente desde el array
  function renderizarJuegos() {
    const container = document.querySelector(".card-grid");
    
    // Limpiar juegos anteriores (mantiene el mensaje)
    const gamecards = container.querySelectorAll(".game-card");
    gamecards.forEach(card => card.remove());
    
    // Renderizar cada juego desde el array
    juegos.forEach((juego) => {
      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      
      gameCard.innerHTML = `
        <i class="delete-game" data-lucide="x"></i>
        <a href="detalles_juego.html?titulo=${encodeURIComponent(juego.titulo)}&imagen=${encodeURIComponent(juego.imagen)}&año=${juego.año}&descripcion=${encodeURIComponent(juego.descripcion)}&rating=${juego.rating}&logros=${encodeURIComponent(JSON.stringify(juego.logros))}">
          <div class="game-img">
            <img src="${juego.imagen}" alt="${juego.titulo}">
          </div>
          <h3>${juego.titulo}</h3>
          <span>${juego.año}</span>
        </a>
      `;
      
      container.appendChild(gameCard);
    });
    
    // Re-agregar event listeners a los botones eliminar
    agregarEventListenersEliminar();
    
    // Actualizar lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Función para agregar event listeners del botón eliminar
  function agregarEventListenersEliminar() {
    document.querySelectorAll(".delete-game").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        let card = btn.closest(".game-card");
        let titulo = card.querySelector("h3").textContent;

        juegoAEliminar = { card, titulo };

        document.getElementById("modalText").textContent =
          `¿Seguro que quieres eliminar "${titulo}"?`;

        document.getElementById("modal").classList.remove("hidden");
      });
    });
  }

  // Función para guardar la biblioteca en localStorage
  function guardarBiblioteca() {
    localStorage.setItem("biblioteca", JSON.stringify(juegos));
  }

  // Renderizar juegos al cargar (DESPUÉS de definir todas las funciones)
  renderizarJuegos();

  // ======================
  // FILTRAR JUEGOS
  // ======================
  function aplicarFiltro() {
    let cards = document.querySelectorAll(".game-card");
    let visibles = 0;

    cards.forEach((card) => {
      let titulo = card.querySelector("h3").textContent.trim().toLowerCase();
      let juego = juegos.find((j) => j.titulo.toLowerCase() === titulo);

      let mostrar = false;

      if (filtroActual === "todos") {
        mostrar = true;
      } else if (juego && juego.estado === filtroActual) {
        mostrar = true;
      }

      if (mostrar) {
        card.style.display = "block";
        visibles++;
      } else {
        card.style.display = "none";
      }
    });

    let mensaje = document.getElementById("noGamesMessage");

    if (visibles === 0) {
      mensaje.style.display = "block";
    } else {
      mensaje.style.display = "none";
    }

    actualizarContadores();
  }
  // ======================
  // CONTADORES
  // ======================
  function actualizarContadores() {
    let total = juegos.length;
    let jugando = juegos.filter((j) => j.estado === "jugando").length;
    let completados = juegos.filter((j) => j.estado === "completado").length;
    let pendientes = juegos.filter((j) => j.estado === "pendiente").length;
    let abandonados = juegos.filter((j) => j.estado === "abandonado").length;

    // Actualizar contadores de stat cards
    document.querySelector(".card-blue .number").textContent = total;
    document.querySelector(".text-green").textContent = completados;
    document.querySelector(".text-blue-light").textContent = jugando;
    document.querySelector(".text-yellow").textContent = pendientes;

    // Actualizar contadores de los botones de filtro
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      const countSpan = btn.querySelector(".count");
      if (!countSpan) return;

      if (btn.textContent.includes("Todos")) {
        countSpan.textContent = total;
      } else if (btn.textContent.includes("Jugando")) {
        countSpan.textContent = jugando;
      } else if (btn.textContent.includes("Completados")) {
        countSpan.textContent = completados;
      } else if (btn.textContent.includes("Pendientes")) {
        countSpan.textContent = pendientes;
      } else if (btn.textContent.includes("Abandonados")) {
        countSpan.textContent = abandonados;
      }
    });
  }

  // ======================
  // BOTONES DE FILTRO
  // ======================
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.textContent.includes("Jugando")) filtroActual = "jugando";
      else if (btn.textContent.includes("Completados"))
        filtroActual = "completado";
      else if (btn.textContent.includes("Pendientes"))
        filtroActual = "pendiente";
      else if (btn.textContent.includes("Abandonados"))
        filtroActual = "abandonado";
      else filtroActual = "todos";

      aplicarFiltro();
    });
  });

  // ======================
  // MODAL
  // ======================
  document.getElementById("confirmDelete").addEventListener("click", () => {
    if (juegoAEliminar) {
      juegoAEliminar.card.remove();

      juegos = juegos.filter((j) => j.titulo !== juegoAEliminar.titulo);
      guardarBiblioteca(); // Guardar cambios en localStorage

      renderizarJuegos(); // Renderizar de nuevo
      aplicarFiltro(); // Aplicar filtro
      actualizarContadores();
    }

    document.getElementById("modal").classList.add("hidden");
  });

  document.getElementById("cancelDelete").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  // cerrar al hacer click fuera
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      e.target.classList.add("hidden");
    }
  });

  // ======================
  // INICIAR
  // ======================
  actualizarContadores();
  aplicarFiltro();
});
