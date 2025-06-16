// ===== GLOBAL VARIABLES =====
let isMenuOpen = false;
let currentFilter = "all";
let isScrolled = false;

// ===== DOM ELEMENTS =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const scrollTopBtn = document.getElementById("scroll-top");
const typewriterElement = document.getElementById("typewriter");
const contactForm = document.getElementById("contact-form");

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initializeAOS();
  initializeNavigation();
  initializeScrollEffects();
  initializeTypewriter();
  initializeSkillBars();
  initializeCounters();
  initializeSkillInteractions();
  initializeProjectFilters();
  initializeContactForm();
  initializeLazyLoading();
});

// ===== AOS INITIALIZATION =====
function initializeAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
      delay: 100,
    });
  }
}

// ===== NAVIGATION =====
function initializeNavigation() {
  // Mobile menu toggle with accessibility
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", toggleMobileMenu);

    // Add keyboard support for menu toggle
    navToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMobileMenu();
      }
    });

    // Add ARIA attributes
    navToggle.setAttribute("aria-label", "Abrir menú de navegación");
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.setAttribute("aria-hidden", "true");
  }
  // Enhanced smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetHref = this.getAttribute("href");

      // Check if it's an internal anchor link (starts with #)
      if (targetHref.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(targetHref);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Adjusted for better visibility
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          // Close mobile menu with animation
          if (isMenuOpen) {
            toggleMobileMenu();
          }

          // Update active link with better feedback
          updateActiveNavLink(this);

          // Announce to screen readers
          announceToScreenReader(`Navegando a ${this.textContent}`);
        }
      } else {
        // For external links (like projects.html, photography.html), let them navigate normally
        // Just close the mobile menu if it's open
        if (isMenuOpen) {
          toggleMobileMenu();
        }

        // Announce navigation to screen readers
        announceToScreenReader(`Navegando a ${this.textContent}`);

        // Allow the default link behavior (don't prevent default)
      }
    });

    // Keyboard navigation support
    link.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        this.click();
      }
    });
  });

  // Update active nav link on scroll with throttling
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavOnScroll, 50);
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      isMenuOpen &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen) {
      toggleMobileMenu();
      navToggle.focus(); // Return focus to toggle button
    }
  });
}

function toggleMobileMenu() {
  const wasOpen = isMenuOpen;
  isMenuOpen = !isMenuOpen;

  // Update toggle button
  navToggle.classList.toggle("active", isMenuOpen);
  navToggle.setAttribute("aria-expanded", isMenuOpen.toString());
  navToggle.setAttribute(
    "aria-label",
    isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
  );

  // Update menu
  navMenu.classList.toggle("active", isMenuOpen);
  navMenu.setAttribute("aria-hidden", (!isMenuOpen).toString());

  // Update body scroll and class
  document.body.classList.toggle("nav-open", isMenuOpen);

  // Focus management
  if (isMenuOpen) {
    // Focus first menu item when opening
    const firstLink = navMenu.querySelector(".nav-link");
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  // Announce state change to screen readers
  if (wasOpen !== isMenuOpen) {
    announceToScreenReader(isMenuOpen ? "Menú abierto" : "Menú cerrado");
  }
}

function updateActiveNavLink(activeLink) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.setAttribute("aria-current", "false");
  });

  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 120; // Adjusted offset

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );
      if (activeLink && !activeLink.classList.contains("active")) {
        updateActiveNavLink(activeLink);
      }
    }
  });
}

// Helper function for screen reader announcements
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

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;

    // Navbar scroll effect
    if (scrollY > 50 && !isScrolled) {
      navbar.classList.add("scrolled");
      isScrolled = true;
    } else if (scrollY <= 50 && isScrolled) {
      navbar.classList.remove("scrolled");
      isScrolled = false;
    }
  });

  // Scroll to top functionality
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriter() {
  if (!typewriterElement) return;

  const texts = [
    "Desarrollador Web Full Stack",
    "Fotógrafo Profesional",
    "Creador de Experiencias Digitales",
    "Especialista en Frontend",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeWriter() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
  }

  typeWriter();
}

// ===== SKILL PROGRESS BARS =====
// ===== SKILL BARS & COUNTERS =====
function initializeSkillBars() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate progress bars
        const progressBars = entry.target.querySelectorAll(".progress-fill");
        progressBars.forEach((bar, index) => {
          const width = bar.getAttribute("data-width");
          setTimeout(() => {
            bar.style.width = width + "%";

            // Add completion effect
            setTimeout(() => {
              bar.classList.add("completed");
            }, 2000);
          }, index * 200 + 300);
        });

        // Animate stat counters
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((statNumber, index) => {
          setTimeout(() => {
            animateCounter(statNumber);
          }, index * 100);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const skillsSection = document.querySelector(".skills");
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

// ===== ENHANCED COUNTER ANIMATION =====
function initializeCounters() {
  const counters = document.querySelectorAll("[data-count]");

  const observerOptions = {
    threshold: 0.7,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(
    element.getAttribute("data-target") || element.getAttribute("data-count")
  );
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);

      // Add completion effect
      element.classList.add("counter-completed");
      setTimeout(() => {
        element.classList.remove("counter-completed");
      }, 500);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// ===== SKILL CARD INTERACTIONS =====
function initializeSkillInteractions() {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    // Add hover sound effect (optional)
    card.addEventListener("mouseenter", function () {
      this.style.setProperty("--hover-scale", "1.02");
    });

    card.addEventListener("mouseleave", function () {
      this.style.setProperty("--hover-scale", "1");
    });

    // Add focus management for accessibility
    card.addEventListener("focus", function () {
      this.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    // Keyboard navigation
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// ===== SKILLS PROGRESS ANIMATION =====
function animateSkillProgress() {
  const progressBars = document.querySelectorAll(".progress-fill");

  progressBars.forEach((bar, index) => {
    const width = bar.getAttribute("data-width");
    const delay = index * 150;

    setTimeout(() => {
      bar.style.transition = "width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      bar.style.width = width + "%";

      // Announce to screen readers
      const skillName = bar
        .closest(".skill-card")
        .querySelector(".skill-name").textContent;
      announceToScreenReader(`${skillName}: ${width}% de habilidad`);
    }, delay);
  });
}

// ===== PROJECT FILTERS =====
function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter projects
      filterProjects(filter, projectCards);
      currentFilter = filter;
    });
  });
}

function filterProjects(filter, cards) {
  cards.forEach((card) => {
    const category = card.getAttribute("data-category");

    if (filter === "all" || category === filter) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// ===== PROJECT MODALS =====
function openProjectModal(projectId) {
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-project-content");

  const projectData = getProjectData(projectId);

  if (projectData && modal && modalContent) {
    modalContent.innerHTML = createProjectModalContent(projectData);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function getProjectData(projectId) {
  const projects = {
    tourist: {
      title: "Plataforma Turística",
      description:
        "Aplicación web completa para la gestión de destinos turísticos con sistema de reservas integrado. Incluye panel de administración, sistema de pagos y gestión de usuarios.",
      fullDescription:
        "Este proyecto es una plataforma completa para el sector turístico que permite a los usuarios explorar destinos, realizar reservas y gestionar sus viajes. La aplicación cuenta con un diseño responsive, integración con APIs de mapas y un sistema de pagos seguro.",
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "PHP",
        "MySQL",
        "Bootstrap",
      ],
      features: [
        "Sistema de reservas en tiempo real",
        "Panel de administración completo",
        "Integración con mapas interactivos",
        "Sistema de pagos seguro",
        "Gestión de usuarios y perfiles",
        "Responsive design",
      ],
      images: [
        "./images/galerias/proy-turist1.png",
        "./images/galerias/proy-turist2.png",
        "./images/galerias/proy-turist3.png",
        "./images/galerias/proy-turist4.png",
        "./images/galerias/proy-turist5.png",
      ],
      liveUrl: "#",
      githubUrl: "#",
    },
    et: {
      title: "Sistema ET",
      description:
        "Sistema de gestión empresarial desarrollado con Angular y tecnologías modernas. Incluye módulos de inventario, ventas, reportes y gestión de empleados.",
      fullDescription:
        "Sistema integral de gestión empresarial que automatiza procesos clave del negocio. Desarrollado con Angular para el frontend y una API REST robusta en el backend.",
      technologies: [
        "Angular",
        "TypeScript",
        "CSS3",
        "Node.js",
        "Express",
        "MongoDB",
      ],
      features: [
        "Gestión de inventario en tiempo real",
        "Módulo de ventas y facturación",
        "Sistema de reportes avanzados",
        "Gestión de empleados y roles",
        "Dashboard interactivo",
        "API REST completa",
      ],
      images: [
        "./images/galerias/proy-et1.png",
        "./images/galerias/proy-et2.png",
        "./images/galerias/proy-et3.png",
        "./images/galerias/proy-et4.png",
        "./images/galerias/proy-et5.png",
      ],
      liveUrl: "#",
      githubUrl: "#",
    },
  };

  return projects[projectId];
}

function createProjectModalContent(project) {
  return `
        <div class="project-modal-header" style="padding: 2rem; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin-bottom: 1rem; color: #1f2937;">${
              project.title
            }</h2>
            <p style="color: #6b7280; line-height: 1.6;">${
              project.description
            }</p>
        </div>
        
        <div class="project-modal-body" style="padding: 2rem;">
            <div class="project-gallery" style="margin-bottom: 2rem;">
                <div class="main-image" style="margin-bottom: 1rem;">
                    <img src="${project.images[0]}" alt="${
    project.title
  }" id="modal-main-image" 
                         style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 0.75rem;">
                </div>
                <div class="thumbnail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem;">
                    ${project.images
                      .map(
                        (img, index) => `
                        <img src="${img}" alt="${project.title} ${index + 1}" 
                             onclick="changeModalImage('${img}')" 
                             class="thumbnail ${index === 0 ? "active" : ""}"
                             style="width: 100%; height: 60px; object-fit: cover; border-radius: 0.5rem; cursor: pointer; border: 2px solid ${
                               index === 0 ? "#2563eb" : "transparent"
                             };">
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="project-details">
                <div class="project-info" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Descripción</h3>
                    <p style="margin-bottom: 1.5rem; color: #6b7280; line-height: 1.6;">${
                      project.fullDescription
                    }</p>
                    
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Características</h3>
                    <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
                        ${project.features
                          .map(
                            (feature) =>
                              `<li style="margin-bottom: 0.5rem; color: #6b7280;">${feature}</li>`
                          )
                          .join("")}
                    </ul>
                    
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Tecnologías</h3>
                    <div class="tech-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                        ${project.technologies
                          .map(
                            (tech) =>
                              `<span class="tech-tag" style="padding: 0.3rem 0.8rem; background: #f3f4f6; color: #2563eb; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${tech}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="project-links" style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="${
                      project.liveUrl
                    }" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; text-decoration: none; border-radius: 0.75rem; font-weight: 500;">
                        <i class="fas fa-external-link-alt"></i> Ver Proyecto
                    </a>
                    <a href="${
                      project.githubUrl
                    }" target="_blank" class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: transparent; color: #2563eb; text-decoration: none; border: 2px solid #2563eb; border-radius: 0.75rem; font-weight: 500;">
                        <i class="fab fa-github"></i> Ver Código
                    </a>
                </div>
            </div>
        </div>
    `;
}

function changeModalImage(imageSrc) {
  const mainImage = document.getElementById("modal-main-image");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (mainImage) {
    mainImage.src = imageSrc;

    thumbnails.forEach((thumb) => {
      thumb.classList.remove("active");
      thumb.style.border = "2px solid transparent";
      if (thumb.src.includes(imageSrc.split("/").pop())) {
        thumb.classList.add("active");
        thumb.style.border = "2px solid #2563eb";
      }
    });
  }
}

// ===== PHOTO MODAL =====
function openPhotoModal(imageSrc, title) {
  const modal = document.getElementById("photo-modal");
  const modalPhoto = document.getElementById("modal-photo");
  const modalTitle = document.getElementById("modal-photo-title");

  if (modal && modalPhoto && modalTitle) {
    modalPhoto.src = imageSrc;
    modalPhoto.alt = title;
    modalTitle.textContent = title;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// ===== MODAL CONTROLS =====
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on outside click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id);
  }
});

// Close modal on escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active");
    if (activeModal) {
      closeModal(activeModal.id);
    }
  }
});

// ===== CONTACT FORM =====
function initializeContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const formButton = this.querySelector('button[type="submit"]');
    const originalText = formButton.innerHTML;

    // Show loading state
    formButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    formButton.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      // Success simulation
      showFormMessage(
        "¡Mensaje enviado exitosamente! Te contactaré pronto.",
        "success"
      );
      this.reset();

      // Reset button
      formButton.innerHTML = originalText;
      formButton.disabled = false;
    }, 2000);
  });
}

function showFormMessage(message, type) {
  // Remove existing messages
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.innerHTML = `
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        }"></i>
        <span>${message}</span>
    `;

  // Add styles
  messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: ${type === "success" ? "#d1fae5" : "#fee2e2"};
        color: ${type === "success" ? "#065f46" : "#991b1b"};
        border: 1px solid ${type === "success" ? "#a7f3d0" : "#fecaca"};
    `;

  // Insert message
  contactForm.insertBefore(messageDiv, contactForm.firstChild);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(function () {
    updateActiveNavOnScroll();
  }, 100)
);

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== GLOBAL FUNCTIONS (for onclick handlers) =====
window.openProjectModal = openProjectModal;
window.openPhotoModal = openPhotoModal;
window.closeModal = closeModal;
window.changeModalImage = changeModalImage;

// ===== ERROR HANDLING =====
window.addEventListener("error", function (e) {
  console.error("Error caught:", e.error);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(
  "%c¡Hola! 👋",
  "color: #2563eb; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cBienvenido al portfolio de Pelayo Naredo",
  "color: #4b5563; font-size: 16px;"
);
console.log(
  "%c🚀 Desarrollador Web Full Stack & Fotógrafo",
  "color: #f59e0b; font-size: 14px;"
);
console.log(
  "%c📧 ¿Interesado en colaborar? ¡Contacta conmigo!",
  "color: #10b981; font-size: 14px;"
);

// ===== PORTFOLIO TABS =====
// Portfolio tabs functionality removed - redesigned work section
