document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ======================
  // USUARIO
  // ======================
  const user = localStorage.getItem("usuario");

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const userName = document.getElementById("userName");
  if (userName) userName.textContent = user;

  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.style.cursor = "pointer";
    userAvatar.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  // LOGOUT
  setupLogoutHandler();

  // ======================
  // MODAL
  // ======================
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  let juegoAEliminar = null;

  function cerrarModal() {
    if (modal) {
      modal.classList.add("hidden");
      modal.style.display = "none";
    }
    juegoAEliminar = null;
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (juegoAEliminar) {
        biblioteca = biblioteca.filter((j) => j.nombreJuego !== juegoAEliminar.nombreJuego);
        guardarBiblioteca();

        renderizarJuegos();
        aplicarFiltro();
        actualizarContadores();
      }

      cerrarModal();
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", cerrarModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });
  }

  // ======================
  // DATOS
  // ======================
  // La biblioteca guarda solo: nombre del juego + estado personal
  // Los datos completos se obtienen de GAMES_DATA para consistencia
  
  let bibliotecaStorage = JSON.parse(localStorage.getItem("biblioteca") || "[]");
  
  // Función para migrar datos antiguos a nueva estructura
  function migrarBibliotecaAntigua(datos) {
    if (datos.length === 0) return [];
    
    // Verificar si están en formato antiguo (tienen 'titulo' o 'imagen')
    if (datos[0].titulo || datos[0].imagen) {
      console.log("Migrando biblioteca antigua a nueva estructura...");
      return datos.map(juego => ({
        nombreJuego: juego.nombre || juego.titulo,
        estado: juego.estado || "pendiente"
      }));
    }
    
    return datos;
  }
  
  // Estructura: [{ nombreJuego: "...", estado: "completado/jugando/pendiente/abandonado" }]
  let biblioteca = migrarBibliotecaAntigua(bibliotecaStorage);
  
  // Guardar la migración
  if (biblioteca.length > 0) {
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  }

  // Función para obtener juego completo desde GAMES_DATA
  function obtenerJuegoCompleto(nombreJuego) {
    const juego = GAMES_DATA.find(g => g.nombre.toLowerCase() === nombreJuego.toLowerCase());
    if (juego) {
      return {
        ...juego,
        estado: biblioteca.find(b => b.nombreJuego === juego.nombre)?.estado || "pendiente"
      };
    } else {
      console.warn("No encontrado en GAMES_DATA:", nombreJuego);
    }
    return null;
  }

  // Función para obtener todos los juegos de la biblioteca con datos completos
  function obtenerJuegosConDatos() {
    return biblioteca
      .map(item => obtenerJuegoCompleto(item.nombreJuego))
      .filter(juego => juego !== null);
  }

  // Guardar en localStorage solo las referencias
  function guardarBiblioteca() {
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  }

  // Si la biblioteca está vacía, cargar juegos iniciales de GAMES_DATA
  function inicializarBibliotecaConDatosDefecto() {
    if (biblioteca.length === 0) {
      console.log("Biblioteca vacía, verificando GAMES_DATA...");
      console.log("GAMES_DATA:", GAMES_DATA);
      console.log("GAMES_DATA.length:", GAMES_DATA?.length);
      
      // Fallback: si GAMES_DATA está vacío o no existe, cargar array por defecto
      const juegosDisponibles = GAMES_DATA && GAMES_DATA.length > 0 
        ? GAMES_DATA 
        : [
            { nombre: "Legends of Eldoria" },
            { nombre: "Dragon Quest Online" },
            { nombre: "Velocity Racing" },
            { nombre: "Cyberpunk Chronicles" },
            { nombre: "Nightmare Manor" },
            { nombre: "Stellar Odyssey" },
            { nombre: "Shadow Castle" },
            { nombre: "Pixel Warriors" }
          ];
      
      biblioteca = juegosDisponibles.map(juego => ({
        nombreJuego: juego.nombre,
        estado: "pendiente"
      }));
      guardarBiblioteca();
      console.log("Biblioteca inicializada con", biblioteca.length, "juegos");
    } else {
      console.log("Biblioteca ya tiene", biblioteca.length, "juegos");
    }
  }

  // Inicializar si es necesario
  inicializarBibliotecaConDatosDefecto();

  // ======================
  // RENDER
  // ======================
  function renderizarJuegos() {
    const container = document.querySelector(".card-grid");
    if (!container) {
      console.error("No se encontró .card-grid");
      return;
    }
    
    container.querySelectorAll(".game-card").forEach((card) => card.remove());

    const juegosConDatos = obtenerJuegosConDatos();
    console.log("Renderizando", juegosConDatos.length, "juegos");

    if (juegosConDatos.length === 0) {
      console.warn("No hay juegos para mostrar. Biblioteca:", biblioteca);
    }

    juegosConDatos.forEach((juego) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.dataset.nombreJuego = juego.nombre;

      const logrosJSON = juego.logros ? JSON.stringify(juego.logros) : "[]";
      const href = `detalles_juego.html?titulo=${encodeURIComponent(juego.nombre)}&imagen=${encodeURIComponent(juego.imagen)}&año=${juego.año}&descripcion=${encodeURIComponent(juego.descripcion || "")}&rating=${juego.rating || 0}&logros=${encodeURIComponent(logrosJSON)}`;

      card.innerHTML = `
        <i class="delete-game" data-lucide="x"></i>
        <a href="${href}">
          <div class="game-img">
            <img src="${juego.imagen}" alt="${juego.nombre}">
          </div>
          <h3>${juego.nombre}</h3>
          <span>${juego.año}</span>
        </a>
      `;

      container.appendChild(card);
    });

    if (juegosConDatos.length > 0) {
      lucide.createIcons();
      agregarEventosEliminar();
    }
  }

  // ======================
  // ELIMINAR
  // ======================
  function agregarEventosEliminar() {
    document.querySelectorAll(".delete-game").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest(".game-card");
        const nombreJuego = card.dataset.nombreJuego;

        juegoAEliminar = { nombreJuego };

        if (modalText) {
          modalText.textContent = `¿Seguro que quieres eliminar "${nombreJuego}"?`;
        }

        if (modal) {
          modal.classList.remove("hidden");
          modal.style.display = "flex";
        }
      });
    });
  }

  // ======================
  // FILTROS
  // ======================
  let filtroActual = "todos";

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

  function aplicarFiltro() {
    const cards = document.querySelectorAll(".game-card");
    let visibles = 0;

    cards.forEach((card) => {
      const nombreJuego = card.dataset.nombreJuego;
      const item = biblioteca.find((b) => b.nombreJuego === nombreJuego);

      let mostrar =
        filtroActual === "todos" || (item && item.estado === filtroActual);

      card.style.display = mostrar ? "block" : "none";

      if (mostrar) visibles++;
    });

    const mensaje = document.getElementById("noGamesMessage");
    if (mensaje) {
      mensaje.style.display = visibles === 0 ? "block" : "none";
    }
  }

  // ======================
  // CONTADORES
  // ======================
  function actualizarContadores() {
    const total = biblioteca.length;
    const jugando = biblioteca.filter((j) => j.estado === "jugando").length;
    const completados = biblioteca.filter((j) => j.estado === "completado").length;
    const pendientes = biblioteca.filter((j) => j.estado === "pendiente").length;
    const abandonados = biblioteca.filter((j) => j.estado === "abandonado").length;

    // Actualizar tarjetas de stats
    document.querySelector(".card-blue .number").textContent = total;
    document.querySelector(".number.text-green").textContent = completados;
    document.querySelector(".number.text-blue-light").textContent = jugando;
    document.querySelector(".number.text-yellow").textContent = pendientes;

    // Actualizar botones de filtro con el contador
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (filterBtns[0])
      filterBtns[0].querySelector(".count").textContent = total;
    if (filterBtns[1])
      filterBtns[1].querySelector(".count").textContent = jugando;
    if (filterBtns[2])
      filterBtns[2].querySelector(".count").textContent = completados;
    if (filterBtns[3])
      filterBtns[3].querySelector(".count").textContent = pendientes;
    if (filterBtns[4])
      filterBtns[4].querySelector(".count").textContent = abandonados;

    console.log("Contadores actualizados:", {
      total,
      jugando,
      completados,
      pendientes,
      abandonados,
    });
  }


  
  // Intentar inicializar la biblioteca si está vacía
  inicializarBibliotecaConDatosDefecto();
  
  renderizarJuegos();
  aplicarFiltro();
  actualizarContadores();
});
