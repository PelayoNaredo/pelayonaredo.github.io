/* ===== PHOTOGRAPHY PAGE JAVASCRIPT ===== */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all photography features
  initGalleryFilters();
  initLazyLoading();
  initAnimations();
  initLightbox();
  initPhotoModal(); // Nueva función para el modal de imágenes
  initStats();
  initScrollBehavior(); // Initialize scroll behavior for sticky filter

  console.log("Photography page initialized successfully");
});

// Gallery Filter Functionality
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const photoItems = document.querySelectorAll(".photo-item");

  if (filterButtons.length === 0) return;

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

      // Filter gallery items
      photoItems.forEach((item) => {
        const categories = item.getAttribute("data-category").split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);

        if (shouldShow) {
          item.style.display = "block";
          setTimeout(() => {
            item.classList.remove("fade-out");
            item.classList.add("fade-in");
          }, 50);
        } else {
          item.classList.add("fade-out");
          item.classList.remove("fade-in");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });

      // Update URL without page reload
      const url = new URL(window.location);
      if (filter === "all") {
        url.searchParams.delete("filter");
      } else {
        url.searchParams.set("filter", filter);
      }
      window.history.replaceState(null, "", url);
    });
  });

  // Apply filter from URL on page load
  const urlParams = new URLSearchParams(window.location.search);
  const filterFromUrl = urlParams.get("filter");
  if (filterFromUrl) {
    const targetButton = document.querySelector(
      `[data-filter="${filterFromUrl}"]`
    );
    if (targetButton) {
      targetButton.click();
    }
  }
}

// Lazy Loading for Images
function initLazyLoading() {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");

          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
            img.classList.add("loading");

            img.onload = () => {
              img.classList.remove("loading");
              img.classList.add("loaded");
            };

            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  // Observe all images with data-src
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Animation on Scroll
function initAnimations() {
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe elements with animation classes
  document.querySelectorAll(".fade-in, .scale-in").forEach((el) => {
    animationObserver.observe(el);
  });
}

// Enhanced Lightbox Integration
function initLightbox() {
  // Configure lightbox if available
  if (typeof lightbox !== "undefined") {
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      albumLabel: "Imagen %1 de %2",
      fadeDuration: 300,
      imageFadeDuration: 300,
    });
  }

  // Add keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Close lightbox if open
      const lightboxOverlay = document.querySelector(".lightboxOverlay");
      if (lightboxOverlay && lightboxOverlay.style.display !== "none") {
        if (typeof lightbox !== "undefined") {
          lightbox.end();
        }
      }
    }
  });
}

// Animated Statistics Counter
function initStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  const countUp = (element, target) => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, duration / steps);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute("data-count"));

          if (target && !element.classList.contains("counted")) {
            element.classList.add("counted");
            countUp(element, target);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });
}

// Gallery Category Navigation
function showCategory(category) {
  const filterButton = document.querySelector(`[data-filter="${category}"]`);
  if (filterButton) {
    filterButton.click();

    // Scroll to gallery
    const gallery = document.querySelector(".photography-gallery");
    if (gallery) {
      gallery.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}

// Image Preloading for Better Performance
function preloadImages() {
  const images = document.querySelectorAll(".gallery-item img");

  images.forEach((img) => {
    const imageUrl = img.src || img.getAttribute("data-src");
    if (imageUrl) {
      const preloadImg = new Image();
      preloadImg.src = imageUrl;
    }
  });
}

// Error Handling for Failed Image Loads
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".gallery-item img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src = "../images/placeholder.jpg"; // Fallback image
      this.alt = "Imagen no disponible";
      console.warn("Failed to load image:", this.src);
    });
  });
});

// Mobile Touch Gestures for Gallery Navigation
function initTouchGestures() {
  let startX = 0;
  let currentIndex = 0;
  const gallery = document.querySelector(".gallery-grid");

  if (!gallery) return;

  gallery.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });

  gallery.addEventListener("touchend", function (e) {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    // Swipe threshold
    if (Math.abs(diffX) > 50) {
      const filterButtons = document.querySelectorAll(".filter-btn");

      if (diffX > 0 && currentIndex < filterButtons.length - 1) {
        // Swipe left - next filter
        currentIndex++;
        filterButtons[currentIndex].click();
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe right - previous filter
        currentIndex--;
        filterButtons[currentIndex].click();
      }
    }
  });
}

// Initialize touch gestures on mobile
if ("ontouchstart" in window) {
  initTouchGestures();
}

// Performance Monitoring
function logPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", function () {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        `Photography page load time: ${
          perfData.loadEventEnd - perfData.loadEventStart
        }ms`
      );
    });
  }
}

logPerformance();

// Accessibility Enhancements
function enhanceAccessibility() {
  // Add ARIA labels to gallery items
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, index) => {
    const img = item.querySelector("img");
    if (img && !img.getAttribute("aria-label")) {
      img.setAttribute("aria-label", `Fotografía ${index + 1}`);
    }

    // Make gallery items focusable
    if (!item.getAttribute("tabindex")) {
      item.setAttribute("tabindex", "0");
    }
  });

  // Add keyboard navigation
  document.addEventListener("keydown", function (e) {
    const focusedElement = document.activeElement;

    if (focusedElement.classList.contains("gallery-item")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const link = focusedElement.querySelector("a");
        if (link) {
          link.click();
        }
      }
    }
  });
}

enhanceAccessibility();

// Ajuste de posicionamiento para el filtro stick
function initScrollBehavior() {
  const navbar = document.getElementById("navbar");
  const filterSection = document.querySelector(".filter-section");
  const photographyHeader = document.querySelector(".photography-header");

  // Obtener altura real de la barra de navegación
  const navbarHeight = navbar.offsetHeight;

  // Actualizar el top del filtro para que sea exactamente la altura de la barra de navegación
  if (filterSection) {
    filterSection.style.top = `${navbarHeight}px`;
  }

  // Función para manejar el comportamiento al hacer scroll
  function handleScroll() {
    const scrollY = window.scrollY;

    // Si estamos por debajo de la cabecera, añadir clase para estilos adicionales
    if (scrollY > photographyHeader.offsetHeight - navbarHeight) {
      filterSection.classList.add("filter-scrolled");
    } else {
      filterSection.classList.remove("filter-scrolled");
    }
  }

  // Agregar listener de scroll
  window.addEventListener("scroll", handleScroll);
  // Inicializar estado
  handleScroll();
}

// Photo Modal Functionality
function initPhotoModal() {
  const expandButtons = document.querySelectorAll(".photo-expand-btn");
  const modal = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("photoModalLabel");
  const modalDescription = document.getElementById("modalDescription");

  if (!modal || !modalImage || !modalTitle || !modalDescription) {
    console.warn("Modal elements not found");
    return;
  }

  expandButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const imageSrc = this.getAttribute("data-image");
      const imageTitle = this.getAttribute("data-title");
      const imageDescription = this.getAttribute("data-description");

      // Set modal content
      modalImage.src = imageSrc;
      modalImage.alt = imageTitle;
      modalTitle.textContent = imageTitle;
      modalDescription.textContent = imageDescription;

      // Show modal - using Bootstrap 5 syntax
      if (typeof bootstrap !== "undefined") {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      } else {
        // Fallback for manual modal control
        modal.style.display = "block";
        modal.classList.add("show");
        document.body.classList.add("modal-open");
      }
    });
  });

  // Close modal functionality
  const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (typeof bootstrap !== "undefined") {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      } else {
        // Fallback for manual modal control
        modal.style.display = "none";
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    });
  });

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      if (typeof bootstrap !== "undefined") {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      } else {
        modal.style.display = "none";
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      if (typeof bootstrap !== "undefined") {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      } else {
        modal.style.display = "none";
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    }
  });
}

// Export functions for external use
window.photographyPage = {
  showCategory,
  preloadImages,
  initGalleryFilters,
  initAnimations,
};
