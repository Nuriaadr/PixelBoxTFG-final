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

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../index.html";
    });
  }

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
        juegos = juegos.filter((j) => j.titulo !== juegoAEliminar.titulo);
        localStorage.setItem("biblioteca", JSON.stringify(juegos));

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
  // Juegos por defecto con logros
  const juegosDefault = [
    {
      titulo: "Legends of Eldoria",
      imagen: "../img/space.webp",
      año: 2024,
      descripcion: "Una aventura épica en un mundo mágico",
      rating: 4.5,
      estado: "completado",
      logros: [
        {
          nombre: "Explorador del Mundo",
          descripcion: "Descubre todos los lugares secretos",
          rarity: "EPIC",
        },
        {
          nombre: "Maestro de Combate",
          descripcion: "Vence 100 enemigos",
          rarity: "LEGENDARY",
        },
      ],
    },
    {
      titulo: "Dragon Quest Online",
      imagen: "../img/img5.webp",
      año: 2025,
      descripcion: "Un MMORPG épico con miles de aventuras",
      rating: 4.8,
      estado: "completado",
      logros: [
        {
          nombre: "Cazador de Dragones",
          descripcion: "Derrota 50 dragones",
          rarity: "EPIC",
        },
        {
          nombre: "Héroe del Reino",
          descripcion: "Completa la historia principal",
          rarity: "LEGENDARY",
        },
      ],
    },
    {
      titulo: "Velocity Racing",
      imagen: "../img/img4.webp",
      año: 2025,
      descripcion: "Carreras de velocidad en circuitos futuristas",
      rating: 4.2,
      estado: "jugando",
      logros: [
        {
          nombre: "Piloto Velocista",
          descripcion: "Completa 10 carreras",
          rarity: "RARE",
        },
        {
          nombre: "Campeón de Circuitos",
          descripcion: "Gana un campeonato",
          rarity: "EPIC",
        },
      ],
    },
    {
      titulo: "Cyberpunk Chronicles",
      imagen: "../img/img4.webp",
      año: 2025,
      descripcion: "Vive en una metrópolis futurista llena de peligros",
      rating: 4.6,
      estado: "jugando",
      logros: [
        {
          nombre: "Hacker Maestro",
          descripcion: "Hackea 20 terminales",
          rarity: "EPIC",
        },
        {
          nombre: "Nómada Urbano",
          descripcion: "Visita todos los distritos",
          rarity: "EPIC",
        },
      ],
    },
    {
      titulo: "Nightmare Manor",
      imagen: "../img/img1.webp",
      año: 2024,
      descripcion: "Terror psicológico en una mansión embrujada",
      rating: 4.1,
      estado: "completado",
      logros: [
        {
          nombre: "Superviviente",
          descripcion: "Sobrevive la noche completa",
          rarity: "RARE",
        },
        {
          nombre: "Desvelador de Secretos",
          descripcion: "Descubre todos los misterios",
          rarity: "LEGENDARY",
        },
      ],
    },
    {
      titulo: "Stellar Odyssey",
      imagen: "../img/img2.webp",
      año: 2025,
      descripcion: "Explora galaxias desconocidas en una aventura espacial",
      rating: 4.3,
      estado: "pendiente",
      logros: [
        {
          nombre: "Explorador Galáctico",
          descripcion: "Explora 50 planetas",
          rarity: "EPIC",
        },
        {
          nombre: "Conquistador del Espacio",
          descripcion: "Completa todas las misiones",
          rarity: "LEGENDARY",
        },
      ],
    },
    {
      titulo: "Shadow Castle",
      imagen: "../img/puzzle.webp",
      año: 2023,
      descripcion: "Un castillo lleno de sombras y secretos oscuros",
      rating: 3.9,
      estado: "pendiente",
      logros: [
        {
          nombre: "Explorador de Castillos",
          descripcion: "Descubre todas las salas",
          rarity: "RARE",
        },
        {
          nombre: "Vencedor de Oscuridad",
          descripcion: "Derrota el jefe final",
          rarity: "EPIC",
        },
      ],
    },
    {
      titulo: "Pixel Warriors",
      imagen: "../img/zombie.webp",
      año: 2023,
      descripcion: "Batalla en un mundo pixelado retro",
      rating: 4.0,
      estado: "abandonado",
      logros: [
        {
          nombre: "Guerrero Pixel",
          descripcion: "Vence 100 enemigos",
          rarity: "RARE",
        },
        {
          nombre: "Campeón de Batallas",
          descripcion: "Gana 50 batallas",
          rarity: "EPIC",
        },
      ],
    },
  ];

  let juegosGuardados = JSON.parse(localStorage.getItem("biblioteca") || "[]");

  // Función para asegurar estructura correcta
  function normalizarJuego(juego) {
    return {
      titulo: juego.titulo || "Sin título",
      imagen: juego.imagen || "../img/img1.webp",
      año: juego.año || 2025,
      descripcion: juego.descripcion || "",
      rating: juego.rating || 0,
      estado: juego.estado || "pendiente",
      logros: Array.isArray(juego.logros) ? juego.logros : [],
    };
  }

  // Normalizar TODOS los juegos guardados
  let juegos = juegosGuardados.map(normalizarJuego);

  // Si está vacío, usar default
  if (juegos.length === 0) {
    juegos = juegosDefault.map(normalizarJuego);
    localStorage.setItem("biblioteca", JSON.stringify(juegos));
  }

  // ======================
  // RENDER
  // ======================
  function renderizarJuegos() {
    const container = document.querySelector(".card-grid");

    container.querySelectorAll(".game-card").forEach((card) => card.remove());

    juegos.forEach((juego) => {
      const card = document.createElement("div");
      card.className = "game-card";

      // Crear el href con todos los parámetros incluyendo logros
      const logrosJSON = juego.logros ? JSON.stringify(juego.logros) : "[]";
      const href = `detalles_juego.html?titulo=${encodeURIComponent(juego.titulo)}&imagen=${encodeURIComponent(juego.imagen)}&año=${encodeURIComponent(juego.año)}&descripcion=${encodeURIComponent(juego.descripcion || "")}&rating=${juego.rating || 0}&logros=${encodeURIComponent(logrosJSON)}`;


      card.innerHTML = `
        <i class="delete-game" data-lucide="x"></i>
        <a href="${href}">
          <div class="game-img">
            <img src="${juego.imagen}" alt="${juego.titulo}">
          </div>
          <h3>${juego.titulo}</h3>
          <span>${juego.año}</span>
        </a>
      `;

      container.appendChild(card);
    });

    lucide.createIcons();
    agregarEventosEliminar();
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
        const titulo = card.querySelector("h3")?.textContent || "Juego";

        juegoAEliminar = { titulo };

        if (modalText) {
          modalText.textContent = `¿Seguro que quieres eliminar "${titulo}"?`;
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
      const titulo = card.querySelector("h3").textContent;
      const juego = juegos.find((j) => j.titulo === titulo);

      let mostrar =
        filtroActual === "todos" || (juego && juego.estado === filtroActual);

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
    const total = juegos.length;
    const jugando = juegos.filter((j) => j.estado === "jugando").length;
    const completados = juegos.filter((j) => j.estado === "completado").length;
    const pendientes = juegos.filter((j) => j.estado === "pendiente").length;
    const abandonados = juegos.filter((j) => j.estado === "abandonado").length;

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

  // ======================
  // INICIO
  // ======================
  renderizarJuegos();
  aplicarFiltro();
  actualizarContadores();
});
