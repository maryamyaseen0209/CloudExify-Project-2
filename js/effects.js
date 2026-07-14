document.addEventListener('DOMContentLoaded', () => {

  // ─── THREE.JS 3D PARTICLE BACKGROUND ───────────────────────────────
  const canvasContainer = document.getElementById('particle-canvas');
  if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x00f0ff);
    const color2 = new THREE.Color(0xff003c);
    const color3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixColor = Math.random();
      let c;
      if (mixColor < 0.4) c = color1;
      else if (mixColor < 0.7) c = color2;
      else c = color3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 3 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const ctx = textureCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(textureCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 8;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateParticles() {
      requestAnimationFrame(animateParticles);
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0003;
      particles.rotation.x += (mouseY * 0.02 - particles.rotation.x) * 0.02;
      particles.rotation.y += (mouseX * 0.02 - particles.rotation.y) * 0.02;
      renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ─── GSAP SCROLL REVEALS ──────────────────────────────────────────
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero text reveal on load
    const heroReveals = document.querySelectorAll('[data-reveal]');
    heroReveals.forEach((el, i) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.fromTo(el,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.3 + delay, ease: 'power4.out' }
      );
    });

    // Scroll reveal items
    const scrollItems = document.querySelectorAll('[data-scroll-reveal]');
    scrollItems.forEach((el) => {
      gsap.fromTo(el,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Product cards staggered reveal
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0, rotateX: 5 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    // Countdown boxes stagger
    const countdownBoxes = document.querySelectorAll('.countdown-box');
    countdownBoxes.forEach((box, i) => {
      gsap.fromTo(box,
        { y: 40, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.8 + i * 0.1, ease: 'back.out(1.7)' }
      );
    });

    // Filter bar reveal
    gsap.fromTo('.filter-bar',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.filter-bar', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    // Navbar shrink on scroll
    const navbar = document.querySelector('.navbar-glass');
    if (navbar) {
      gsap.to(navbar, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top -80',
          end: 'top -120',
          onEnter: () => navbar.classList.add('navbar-scrolled'),
          onLeaveBack: () => navbar.classList.remove('navbar-scrolled'),
        }
      });
    }
  }

  // ─── 3D CARD TILT EFFECT ──────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.product-card, [data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.transition = 'transform 0.1s ease-out';
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.transition = 'transform 0.5s ease-out';
    });
  });

  // ─── GLARE OVERLAY FOR PRODUCT CARDS ──────────────────────────────
  // Handled via CSS ::after pseudo-element with dynamic CSS custom properties

  // ─── CUSTOM CURSOR ────────────────────────────────────────────────
  const cursorGlow = document.querySelector('.cursor-glow');
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursorGlow && cursorDot) {
    let cursorX = -100;
    let cursorY = -100;
    let glowX = -100;
    let glowY = -100;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    });

    function animateCursor() {
      glowX += (cursorX - glowX) * 0.1;
      glowY += (cursorY - glowY) * 0.1;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .product-card, input, select, .countdown-box');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '12px';
        cursorDot.style.height = '12px';
        cursorGlow.style.width = '60px';
        cursorGlow.style.height = '60px';
        cursorGlow.style.borderColor = 'var(--primary-color)';
        cursorGlow.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '6px';
        cursorDot.style.height = '6px';
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
        cursorGlow.style.borderColor = 'rgba(0, 240, 255, 0.3)';
        cursorGlow.style.boxShadow = 'none';
      });
    });
  }

  // ─── PARALLAX ON SCROLL FOR HERO ─────────────────────────────────
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent && scrollY < heroSection.offsetHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrollY / heroSection.offsetHeight) * 0.5;
      }
    });
  }

  // ─── MOUSE PARALLAX ON HERO ──────────────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const heroTitle = heroContent.querySelector('h1');
      const heroSubtitle = heroContent.querySelector('.hero-subtitle');
      if (heroTitle) heroTitle.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      if (heroSubtitle) heroSubtitle.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
  }

  // ─── COUNTER ANIMATION FOR STATS ──────────────────────────────────
  function animateCounter(el, target, suffix = '') {
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current + suffix;
    }, 16);
  }

  // ─── UPDATE PRODUCT CARDS ON RENDER ──────────────────────────────
  const origRender = window.renderProducts;
  if (origRender) {
    const originalRenderFn = origRender;
    window.renderProducts = function(...args) {
      originalRenderFn.apply(this, args);
      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          const newCards = document.querySelectorAll('.product-card');
          newCards.forEach((card, i) => {
            gsap.fromTo(card,
              { y: 30, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: i * 0.05, ease: 'power2.out' }
            );
          });
        }
        const tiltCards = document.querySelectorAll('.product-card');
        tiltCards.forEach(card => {
          if (!card.hasListener) {
            card.hasListener = true;
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * -8;
              const rotateY = ((x - centerX) / centerX) * 8;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
              const glareX = (x / rect.width) * 100;
              const glareY = (y / rect.height) * 100;
              card.style.setProperty('--glare-x', `${glareX}%`);
              card.style.setProperty('--glare-y', `${glareY}%`);
            });
            card.addEventListener('mouseleave', () => {
              card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
              card.style.transition = 'transform 0.5s ease-out';
            });
          }
        });
      }, 50);
    };
  }

  // ─── UPDATE WISHLIST/CART UI ANIMATIONS ──────────────────────────
  const origUpdateCart = window.updateCartUI;
  if (origUpdateCart) {
    const originalCartFn = origUpdateCart;
    window.updateCartUI = function(...args) {
      originalCartFn.apply(this, args);
      setTimeout(() => {
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach((item, i) => {
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item,
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.3, delay: i * 0.05, ease: 'power2.out' }
            );
          }
        });
      }, 50);
    };
  }

});
