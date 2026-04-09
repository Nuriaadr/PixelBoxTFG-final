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
  // Los datos completos se obtienen de GAMES_DATA 
  
  // Verificar que GAMES_DATA está disponible
  if (typeof GAMES_DATA === "undefined" || !Array.isArray(GAMES_DATA)) {
    window.location.reload();
  }
  
  let bibliotecaStorage = JSON.parse(localStorage.getItem("biblioteca") || "[]");
  
  // Asegurar que bibliotecaStorage sea un array
  if (!Array.isArray(bibliotecaStorage)) {
    bibliotecaStorage = [];
  }
  
  // Función para migrar datos antiguos 
  function migrarBibliotecaAntigua(datos) {
    if (!Array.isArray(datos)) {
      return [];
    }
    
    if (datos.length === 0) return [];
    
    // Verificar si están en formato antiguo (tienen 'titulo' o 'imagen')
    if (datos[0] && (datos[0].titulo || datos[0].imagen)) {
      return datos.map(juego => ({
        nombreJuego: juego.nombre || juego.titulo || "Juego sin nombre",
        estado: juego.estado || "pendiente"
      }));
    }
    
    return datos;
  }
  
  let biblioteca = migrarBibliotecaAntigua(bibliotecaStorage);
  
  // Asegurar que biblioteca sea un array
  if (!Array.isArray(biblioteca)) {
    biblioteca = [];
  }
  
  // Guardar la migración
  if (biblioteca.length > 0) {
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  }

  // Validar que los nombres coincidan con GAMES_DATA
  function validarNombresBiblioteca() {
    if (!Array.isArray(GAMES_DATA)) {
      return;
    }

    let actualizada = false;

    biblioteca = biblioteca.map(item => {
      if (!item || !item.nombreJuego) {
        return item;
      }

      const juegoEnGAMES = GAMES_DATA.find(g =>
        g && g.nombre && typeof g.nombre === 'string' &&
        g.nombre.toLowerCase() === item.nombreJuego.toLowerCase()
      );

      if (juegoEnGAMES && juegoEnGAMES.nombre !== item.nombreJuego) {
        actualizada = true;
        return {
          nombreJuego: juegoEnGAMES.nombre,
          estado: item.estado
        };
      }
      return item;
    });

    if (actualizada) {
      localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
    }
  }
  
  // Ejecutar validación
  if (biblioteca.length > 0 && Array.isArray(GAMES_DATA) && GAMES_DATA.length > 0) {
    validarNombresBiblioteca();
  }

  // Función para obtener juego completo desde GAMES_DATA
  function obtenerJuegoCompleto(nombreJuego) {
    if (!nombreJuego) return null;
    
    const juego = GAMES_DATA.find(g => g && g.nombre && g.nombre.toLowerCase() === nombreJuego.toLowerCase());
    if (juego) {
      return { ...juego };
    } else {
      // Intentar encontrar por búsqueda parcial si no hay coincidencia exacta
      const juegoAproximado = GAMES_DATA.find(g => 
        g && g.nombre && 
        (g.nombre.toLowerCase().includes(nombreJuego.toLowerCase()) ||
        nombreJuego.toLowerCase().includes(g.nombre.toLowerCase()))
      );
      if (juegoAproximado) {
        return { ...juegoAproximado };
      }
      console.warn("No encontrado en GAMES_DATA:", nombreJuego);
    }
    return null;
  }

  // Función para obtener todos los juegos de la biblioteca con datos completos
  function obtenerJuegosConDatos() {
    return biblioteca
      .map(item => {
        const juegoCompleto = obtenerJuegoCompleto(item.nombreJuego);
        if (!juegoCompleto) return null;
        return { 
          ...juegoCompleto, 
          nombreBiblioteca: item.nombreJuego,
          estado: item.estado 
        };
      })
      .filter(juego => juego !== null);
  }

  // Guardar en localStorage solo las referencias
  function guardarBiblioteca() {
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  }

  // Si la biblioteca está vacía, cargar juegos iniciales de GAMES_DATA
  function inicializarBibliotecaConDatosDefecto() {
    if (biblioteca.length === 0 && GAMES_DATA && GAMES_DATA.length > 0) {
      
      biblioteca = GAMES_DATA.map(juego => ({
        nombreJuego: juego.nombre,
        estado: juego.estado || "pendiente"
      }));
      
      guardarBiblioteca();
    } 
  }

  //Inicializar si es necesario
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
    

    juegosConDatos.forEach((juego) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.dataset.nombreJuego = juego.nombreBiblioteca || juego.nombre;

      const logrosJSON = juego.logros ? JSON.stringify(juego.logros) : "[]";
      const href = `detalles_juego.html?titulo=${encodeURIComponent(juego.nombre)}&imagen=${encodeURIComponent(juego.imagen)}&año=${juego.año}&descripcion=${encodeURIComponent(juego.descripcion || "")}&rating=${juego.rating || 0}&desarrollador=${encodeURIComponent(juego.desarrollador || "Desarrollador Desconocido")}&genero=${encodeURIComponent(juego.genero || "Género Desconocido")}&plataforma=${encodeURIComponent(juego.plataforma || "Plataforma Desconocida")}&logros=${encodeURIComponent(logrosJSON)}`;

      card.innerHTML = `
        <i class="delete-game" data-lucide="x"></i>
        <a href="${href}">
          <div class="game-img">
            <img src="${juego.imagen}" alt="${juego.nombre}" loading="lazy">
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

      filtroActual = btn.dataset.filter || "todos";
      aplicarFiltro();
    });
  });

  function aplicarFiltro() {
    const cards = document.querySelectorAll(".game-card");
    let visibles = 0;
    const favoritos = getFavoritos(user);

    cards.forEach((card) => {
      const nombreJuego = card.dataset.nombreJuego;
      const item = biblioteca.find((b) => b.nombreJuego === nombreJuego);

      let mostrar = false;

      if (filtroActual === "todos") {
        mostrar = true;
      } else if (filtroActual === "favoritos") {
        mostrar = favoritos.includes(nombreJuego);
      } else {
        mostrar = item && item.estado === filtroActual;
      }

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
    const favoritos = getFavoritos(user).filter(fav => 
      biblioteca.some(b => b.nombreJuego === fav)
    ).length;

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
    if (filterBtns[5])
      filterBtns[5].querySelector(".count").textContent = favoritos;
  }


  
  // Intentar inicializar la biblioteca si está vacía
  inicializarBibliotecaConDatosDefecto();
  
  renderizarJuegos();
  aplicarFiltro();
  actualizarContadores();
});
