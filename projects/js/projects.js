// ===== PROJECTS PAGE JAVASCRIPT =====

// DOM Elements
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const loadMoreBtn = document.getElementById("load-more-btn");
const projectModal = document.getElementById("projectModal");
const projectViewBtns = document.querySelectorAll(".project-view-btn");

// State
let currentFilter = "all";
let visibleProjects = 4;
let totalProjects = projectCards.length;

// Initialize Projects Page
document.addEventListener("DOMContentLoaded", function () {
  initializeFilters();
  initializeLoadMore();
  initializeProjectModals();
  initializeProjectAnimations();
});

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-pressed", "true");

      // Filter projects
      filterProjects(filter);
      currentFilter = filter;

      // Announce to screen readers
      announceToScreenReader(`Mostrando proyectos de ${this.textContent}`);
    });
  });
}

function filterProjects(filter) {
  projectCards.forEach((card, index) => {
    const categories = card.getAttribute("data-category").split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);

    if (shouldShow) {
      card.style.display = "block";
      // Add staggered animation
      setTimeout(() => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
      }, index * 100);
    } else {
      card.classList.add("fade-out");
      setTimeout(() => {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }, 300);
    }
  });

  // Update load more button visibility
  updateLoadMoreButton();
}

// ===== LOAD MORE FUNCTIONALITY =====
function initializeLoadMore() {
  // Initially hide projects beyond the first 4
  updateProjectVisibility();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      visibleProjects += 4;
      updateProjectVisibility();
      updateLoadMoreButton();

      // Announce to screen readers
      announceToScreenReader(
        `Cargados más proyectos. Mostrando ${Math.min(
          visibleProjects,
          totalProjects
        )} de ${totalProjects} proyectos.`
      );
    });
  }
}

function updateProjectVisibility() {
  const visibleCards = Array.from(projectCards).filter((card) => {
    const categories = card.getAttribute("data-category").split(" ");
    return currentFilter === "all" || categories.includes(currentFilter);
  });

  visibleCards.forEach((card, index) => {
    if (index < visibleProjects) {
      card.style.display = "block";
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

function updateLoadMoreButton() {
  if (!loadMoreBtn) return;

  const visibleCards = Array.from(projectCards).filter((card) => {
    const categories = card.getAttribute("data-category").split(" ");
    return currentFilter === "all" || categories.includes(currentFilter);
  });

  if (visibleCards.length <= visibleProjects) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

// ===== PROJECT MODALS =====
function initializeProjectModals() {
  projectViewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const projectId = this.getAttribute("data-project");
      openProjectModal(projectId);
    });
  });

  // Close modal functionality
  if (projectModal) {
    const closeBtn = projectModal.querySelector(".btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeProjectModal);
    }

    // Close on backdrop click
    projectModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeProjectModal();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && projectModal.classList.contains("show")) {
        closeProjectModal();
      }
    });
  }
}

function openProjectModal(projectId) {
  if (!projectModal) return;

  const modalContent = projectModal.querySelector("#project-details-content");

  // Load project details based on ID
  const projectDetails = getProjectDetails(projectId);

  if (modalContent && projectDetails) {
    modalContent.innerHTML = projectDetails;
    projectModal.classList.add("show");
    projectModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Focus management
    const closeBtn = projectModal.querySelector(".btn-close");
    if (closeBtn) closeBtn.focus();

    // Announce to screen readers
    announceToScreenReader("Modal de detalles del proyecto abierto");
  }
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("show");
  setTimeout(() => {
    projectModal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);

  // Return focus to the button that opened the modal
  const lastFocusedBtn = document.activeElement;
  if (lastFocusedBtn && lastFocusedBtn.classList.contains("project-view-btn")) {
    lastFocusedBtn.focus();
  }

  // Announce to screen readers
  announceToScreenReader("Modal cerrado");
}

function getProjectDetails(projectId) {
  const projects = {
    eventosTech: `
            <div class="project-detail">
                <div class="project-detail-header">
                    <h3>EventosTech - Plataforma de Gestión de Eventos</h3>
                    <div class="project-detail-tags">
                        <span class="tag-angular">Angular</span>
                        <span class="tag-php">PHP</span>
                        <span class="tag-mysql">MySQL</span>
                    </div>
                </div>
                <div class="project-detail-content">
                    <div class="project-gallery">
                        <img src="../images/galerias/proy-et1.png" alt="EventosTech Dashboard" />
                        <img src="../images/galerias/proy-et2.png" alt="EventosTech Events" />
                        <img src="../images/galerias/proy-et3.png" alt="EventosTech Analytics" />
                    </div>
                    <div class="project-description">
                        <h4>Descripción del Proyecto</h4>
                        <p>EventosTech es una plataforma integral diseñada para la gestión completa de eventos tecnológicos. La aplicación permite a los organizadores crear, gestionar y promocionar eventos mientras facilita a los asistentes el registro y seguimiento de las actividades.</p>
                        
                        <h4>Características Principales</h4>
                        <ul>
                            <li>Dashboard administrativo completo</li>
                            <li>Sistema de registro de asistentes con validación</li>
                            <li>Gestión de ponentes y horarios</li>
                            <li>Sistema de notificaciones por email</li>
                            <li>Análisis y reportes en tiempo real</li>
                            <li>Interfaz responsive y accesible</li>
                        </ul>
                        
                        <h4>Tecnologías Utilizadas</h4>
                        <ul>
                            <li><strong>Frontend:</strong> Angular 15, TypeScript, Angular Material</li>
                            <li><strong>Backend:</strong> PHP 8, API RESTful</li>
                            <li><strong>Base de datos:</strong> MySQL 8</li>
                            <li><strong>Herramientas:</strong> Git, NPM, Composer</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
    turistApp: `
            <div class="project-detail">
                <div class="project-detail-header">
                    <h3>TuristApp - Aplicación de Turismo</h3>
                    <div class="project-detail-tags">
                        <span class="tag-html">HTML5</span>
                        <span class="tag-css">CSS3</span>
                        <span class="tag-js">JavaScript</span>
                    </div>
                </div>
                <div class="project-detail-content">
                    <div class="project-gallery">
                        <img src="../images/galerias/proy-turist1.png" alt="TuristApp Homepage" />
                        <img src="../images/galerias/proy-turist2.png" alt="TuristApp Gallery" />
                        <img src="../images/galerias/proy-turist3.png" alt="TuristApp Map" />
                    </div>
                    <div class="project-description">
                        <h4>Descripción del Proyecto</h4>
                        <p>TuristApp es una aplicación web moderna diseñada para promover destinos turísticos locales. Combina un diseño atractivo con funcionalidades interactivas para ofrecer una experiencia inmersiva a los usuarios.</p>
                        
                        <h4>Características Principales</h4>
                        <ul>
                            <li>Diseño responsive mobile-first</li>
                            <li>Galería de imágenes con lightbox</li>
                            <li>Mapas interactivos integrados</li>
                            <li>Sistema de filtros por categorías</li>
                            <li>Efectos paralax y animaciones CSS</li>
                            <li>Optimización SEO avanzada</li>
                        </ul>
                        
                        <h4>Tecnologías Utilizadas</h4>
                        <ul>
                            <li><strong>Frontend:</strong> HTML5 semántico, CSS3 Grid/Flexbox</li>
                            <li><strong>JavaScript:</strong> ES6+, APIs Web modernas</li>
                            <li><strong>Herramientas:</strong> Webpack, Sass, PostCSS</li>
                            <li><strong>Librerías:</strong> AOS (Animate On Scroll), Leaflet Maps</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
    workShifts: `
            <div class="project-detail">
                <div class="project-detail-header">
                    <h3>WorkShifts - Sistema de Gestión de Turnos</h3>
                    <div class="project-detail-tags">
                        <span class="tag-php">PHP</span>
                        <span class="tag-mysql">MySQL</span>
                        <span class="tag-bootstrap">Bootstrap</span>
                    </div>
                </div>
                <div class="project-detail-content">
                    <div class="project-gallery">
                        <img src="../images/galerias/proy-shifts1.png" alt="WorkShifts Dashboard" />
                        <img src="../images/galerias/proy-shifts2.png" alt="WorkShifts Calendar" />
                        <img src="../images/galerias/proy-shifts3.png" alt="WorkShifts Reports" />
                    </div>
                    <div class="project-description">
                        <h4>Descripción del Proyecto</h4>
                        <p>WorkShifts es un sistema completo de gestión de turnos laborales diseñado para empresas que necesitan coordinar horarios de trabajo complejos. Ofrece una interfaz intuitiva tanto para administradores como para empleados.</p>
                        
                        <h4>Características Principales</h4>
                        <ul>
                            <li>Calendario interactivo de turnos</li>
                            <li>Gestión de empleados y departamentos</li>
                            <li>Sistema de solicitudes de cambio</li>
                            <li>Notificaciones automáticas por email</li>
                            <li>Reportes de horas trabajadas</li>
                            <li>Dashboard con métricas en tiempo real</li>
                        </ul>
                        
                        <h4>Tecnologías Utilizadas</h4>
                        <ul>
                            <li><strong>Backend:</strong> PHP 7.4, MVC Pattern</li>
                            <li><strong>Frontend:</strong> Bootstrap 5, jQuery</li>
                            <li><strong>Base de datos:</strong> MySQL con triggers y procedures</li>
                            <li><strong>Librerías:</strong> PHPMailer, FullCalendar.js, Chart.js</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
    playsBeach: `
            <div class="project-detail">
                <div class="project-detail-header">
                    <h3>PlaysBeach - Portal de Playas</h3>
                    <div class="project-detail-tags">
                        <span class="tag-html">HTML5</span>
                        <span class="tag-sass">SASS</span>
                        <span class="tag-js">JavaScript</span>
                    </div>
                </div>
                <div class="project-detail-content">
                    <div class="project-gallery">
                        <img src="../images/galerias/proy-playas.png" alt="PlaysBeach Homepage" />
                    </div>
                    <div class="project-description">
                        <h4>Descripción del Proyecto</h4>
                        <p>PlaysBeach es un portal web elegante dedicado a la promoción y descubrimiento de playas costeras. Combina fotografía de alta calidad con una experiencia de usuario excepcional para inspirar y guiar a los viajeros.</p>
                        
                        <h4>Características Principales</h4>
                        <ul>
                            <li>Diseño visual impactante con efectos paralax</li>
                            <li>Galería optimizada con lazy loading</li>
                            <li>Sistema de filtros por ubicación y servicios</li>
                            <li>Integración con redes sociales</li>
                            <li>Sistema de valoraciones y comentarios</li>
                            <li>Búsqueda avanzada con geolocalización</li>
                        </ul>
                        
                        <h4>Tecnologías Utilizadas</h4>
                        <ul>
                            <li><strong>Frontend:</strong> HTML5, SASS, JavaScript ES6+</li>
                            <li><strong>Herramientas:</strong> Gulp, Autoprefixer, ImageMin</li>
                            <li><strong>Librerías:</strong> Swiper.js, Masonry, Intersection Observer API</li>
                            <li><strong>Performance:</strong> Service Workers, Critical CSS</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
  };

  return projects[projectId] || "<p>Detalles del proyecto no disponibles.</p>";
}

// ===== PROJECT ANIMATIONS =====
function initializeProjectAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all project cards
  projectCards.forEach((card) => {
    observer.observe(card);
  });
}

// ===== UTILITY FUNCTIONS =====
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener("keydown", function (e) {
  // Enhanced keyboard navigation for filter buttons
  if (e.target.classList.contains("filter-btn")) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const buttons = Array.from(filterButtons);
      const currentIndex = buttons.indexOf(e.target);
      let nextIndex;

      if (e.key === "ArrowLeft") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
      } else {
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
      }

      buttons[nextIndex].focus();
    }
  }
});
