/* ===== AGP PROJECT PAGE JAVASCRIPT ===== */

// Initialize AOS animations
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    easing: "ease-out-cubic",
    once: true,
    offset: 100,
  });

  // Initialize page functionality
  initializePageAnimations();
  initializeInteractiveElements();
  initializeScrollEffects();
});

// Page-specific animations
function initializePageAnimations() {
  // Hero logo animation
  const logoContainer = document.querySelector(".logo-container");
  if (logoContainer) {
    logoContainer.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
    });

    logoContainer.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
    });
  }

  // Tech tags hover effect
  const techTags = document.querySelectorAll(".tech-tag");
  techTags.forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Overview cards stagger animation
  const overviewCards = document.querySelectorAll(".overview-card");
  overviewCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Interactive elements
function initializeInteractiveElements() {
  // Architecture layers interaction
  const layers = document.querySelectorAll(".layer");
  layers.forEach((layer) => {
    layer.addEventListener("click", function () {
      // Remove active class from all layers
      layers.forEach((l) => l.classList.remove("layer-active"));
      // Add active class to clicked layer
      this.classList.add("layer-active");

      // Add pulse effect
      this.style.animation = "pulse 0.6s ease-in-out";
      setTimeout(() => {
        this.style.animation = "";
      }, 600);
    });
  });

  // Feature showcase parallax effect
  const featureImages = document.querySelectorAll(".feature-image");
  featureImages.forEach((image) => {
    image.addEventListener("mouseenter", function () {
      const placeholder = this.querySelector(".image-placeholder");
      if (placeholder) {
        placeholder.style.transform =
          "perspective(1000px) rotateY(5deg) rotateX(5deg)";
      }
    });

    image.addEventListener("mouseleave", function () {
      const placeholder = this.querySelector(".image-placeholder");
      if (placeholder) {
        placeholder.style.transform =
          "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      }
    });
  });

  // Metric cards counter animation
  animateCounters();

  // Tech items progressive reveal
  const techItems = document.querySelectorAll(".tech-item");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, observerOptions);

  techItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-30px)";
    item.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    techObserver.observe(item);
  });
}

// Scroll effects
function initializeScrollEffects() {
  // Parallax effect for hero background
  const heroBackground = document.querySelector(".hero-background");
  const heroPattern = document.querySelector(".hero-pattern");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (heroBackground) {
      heroBackground.style.transform = `translateY(${
        scrolled * parallaxSpeed
      }px)`;
    }

    if (heroPattern) {
      heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Progress indicator
  createProgressIndicator();

  // Scroll-to-top functionality
  createScrollToTop();
}

// Counter animation for metrics
function animateCounters() {
  const counters = document.querySelectorAll(".metric-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = counter.textContent.replace(/[^\d]/g, ""); // Extract numbers
          const isPercentage = counter.textContent.includes("%");
          const isTime = counter.textContent.includes("s");
          const isPlus = counter.textContent.includes("+");
          const isLess = counter.textContent.includes("<");

          if (target) {
            animateCounter(
              counter,
              parseInt(target),
              isPercentage,
              isTime,
              isPlus,
              isLess
            );
          }

          counterObserver.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

function animateCounter(
  element,
  target,
  isPercentage = false,
  isTime = false,
  isPlus = false,
  isLess = false
) {
  let current = 0;
  const increment = target / 60; // 60 frames for smooth animation

  const updateCounter = () => {
    current += increment;

    if (current < target) {
      let displayValue = Math.floor(current);

      if (isLess) displayValue = `<${displayValue}`;
      if (isTime) displayValue += "s";
      if (isPercentage) displayValue += "%";
      if (isPlus) displayValue += "+";

      element.textContent = displayValue;
      requestAnimationFrame(updateCounter);
    } else {
      let finalValue = target;

      if (isLess) finalValue = `<${finalValue}`;
      if (isTime) finalValue += "s";
      if (isPercentage) finalValue += "%";
      if (isPlus) finalValue += "+";

      element.textContent = finalValue;
    }
  };

  updateCounter();
}

// Progress indicator
function createProgressIndicator() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';

  const progressCSS = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(var(--primary-rgb), 0.1);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .scroll-progress.visible {
      opacity: 1;
    }
    
    .scroll-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      width: 0%;
      transition: width 0.1s ease;
    }
  `;

  const style = document.createElement("style");
  style.textContent = progressCSS;
  document.head.appendChild(style);
  document.body.appendChild(progressBar);

  const progressBarInner = progressBar.querySelector(".scroll-progress-bar");

  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    progressBarInner.style.width = scrolled + "%";

    if (winScroll > 100) {
      progressBar.classList.add("visible");
    } else {
      progressBar.classList.remove("visible");
    }
  });
}

// Scroll to top button
function createScrollToTop() {
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "scroll-to-top";
  scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollTopBtn.setAttribute("aria-label", "Volver arriba");

  const scrollTopCSS = `
    .scroll-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3);
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .scroll-to-top:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(var(--primary-rgb), 0.4);
    }
    
    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 45px;
        height: 45px;
        font-size: 1rem;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = scrollTopCSS;
  document.head.appendChild(style);
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });
}

// Add pulse animation for architecture layers
const pulseCSS = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .layer-active {
    border-color: var(--primary-color) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
  }
`;

const style = document.createElement("style");
style.textContent = pulseCSS;
document.head.appendChild(style);

// Smooth reveal for timeline items
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.2 }
);

timelineItems.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(30px)";
  item.style.transition = `opacity 0.8s ease ${
    index * 0.2
  }s, transform 0.8s ease ${index * 0.2}s`;
  timelineObserver.observe(item);
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    // Activate easter egg
    document.body.style.animation = "rainbow 2s linear infinite";

    const rainbowCSS = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;

    const rainbowStyle = document.createElement("style");
    rainbowStyle.textContent = rainbowCSS;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
      document.body.style.animation = "";
      document.head.removeChild(rainbowStyle);
    }, 4000);

    konamiCode = [];
  }
});
