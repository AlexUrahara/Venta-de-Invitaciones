// ===== SMOOTH SCROLL PARA ENLACES INTERNOS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar offcanvas si está abierto
            const offcanvas = document.getElementById('offcanvasNavbar');
            if (offcanvas && offcanvas.classList.contains('show')) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
                offcanvasInstance.hide();
            }
        }
    });
});

// ===== HERO: AJUSTE DE ALTURA Y CONTROL DE ANIMACIONES =====
(function() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Función para ajustar altura del hero
    function setHeroHeight() {
        hero.style.height = window.innerHeight + 'px';
        const items = hero.querySelectorAll('.carousel-item');
        items.forEach(item => {
            item.style.height = window.innerHeight + 'px';
        });
    }
    window.addEventListener('load', setHeroHeight);
    window.addEventListener('resize', setHeroHeight);

    // Función para reiniciar animaciones de un slide
    function restartAnimations(slide) {
        const lines = slide.querySelectorAll('.hero-line');
        lines.forEach(line => {
            line.style.animation = 'none';
            // Forzar reflow
            void line.offsetHeight;
            // Restaurar animación con los retrasos definidos en CSS
            line.style.animation = '';
        });
    }

    // Reiniciar animaciones del primer slide al cargar
    const firstSlide = hero.querySelector('.carousel-item.active');
    if (firstSlide) {
        restartAnimations(firstSlide);
    }

    // Cuando el carrusel empieza a cambiar (inmediatamente antes del cambio)
    hero.addEventListener('slide.bs.carousel', function (event) {
        // Ocultar momentáneamente las líneas del próximo slide para evitar el destello
        const nextSlide = event.relatedTarget;
        const lines = nextSlide.querySelectorAll('.hero-line');
        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(30px)';
            line.style.animation = 'none';
        });
    });

    // Cuando el cambio ya se ha completado
    hero.addEventListener('slid.bs.carousel', function (event) {
        const activeSlide = hero.querySelector('.carousel-item.active');
        if (activeSlide) {
            restartAnimations(activeSlide);
        }
    });
})();

// ===== CONTROL DE NAVBAR AL HACER SCROLL =====
const navbar = document.getElementById('mainNav');
const hero = document.getElementById('hero');

function checkScroll() {
    if (!navbar || !hero) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - navbar.offsetHeight) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// ===== ACTIVAR NAVBAR SEGÚN SECCIÓN (opcional) =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbarDesktop .nav-link, #offcanvasNavbar .nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== BOTÓN SCROLL DOWN =====
document.querySelector('.scroll-down-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href'); // #credibilidad
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// ===== CONTADORES ANIMADOS Y EFECTO DE APARICIÓN EN CREDIBILIDAD =====
(function() {
    const seccion = document.getElementById('credibilidad');
    if (!seccion) return;

    const items = seccion.querySelectorAll('.credibilidad-item');
    const contadores = seccion.querySelectorAll('.contador');

    // Variable para almacenar los intervalos y poder detenerlos
    let intervalos = [];

    // Función para detener todos los intervalos activos
    function detenerIntervalos() {
        intervalos.forEach(interval => clearInterval(interval));
        intervalos = [];
    }

    // Función para reiniciar los contadores a 0
    function reiniciarContadores() {
        contadores.forEach(contador => {
            contador.textContent = '0';
        });
    }

    // Función para animar un contador
    function animarContador(elemento) {
        const objetivo = parseInt(elemento.getAttribute('data-target'), 10);
        let actual = 0;
        const incremento = Math.ceil(objetivo / 50); // 50 pasos
        const duracion = 50; // ms
        const interval = setInterval(() => {
            actual += incremento;
            if (actual >= objetivo) {
                elemento.textContent = objetivo;
                clearInterval(interval);
                // Remover de la lista de intervalos activos
                intervalos = intervalos.filter(i => i !== interval);
            } else {
                elemento.textContent = actual;
            }
        }, duracion);
        intervalos.push(interval);
    }

    // Función para iniciar las animaciones de todos los contadores
    function iniciarContadores() {
        contadores.forEach(contador => {
            animarContador(contador);
        });
    }

    // Configurar Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // La sección es visible: mostrar items con animación
                items.forEach(item => {
                    item.classList.add('visible');
                });
                // Reiniciar contadores y animarlos
                reiniciarContadores();
                iniciarContadores();
            } else {
                // La sección no es visible: ocultar items y detener contadores
                items.forEach(item => {
                    item.classList.remove('visible');
                });
                detenerIntervalos();
                reiniciarContadores(); // Opcional: para que al volver a entrar empiecen desde 0
            }
        });
    }, { threshold: 0.3 }); // 30% visible

    observer.observe(seccion);

    // Si la sección ya está visible al cargar (por scroll inicial), forzar la activación
    if (seccion.getBoundingClientRect().top < window.innerHeight && seccion.getBoundingClientRect().bottom > 0) {
        items.forEach(item => {
            item.classList.add('visible');
        });
        reiniciarContadores();
        iniciarContadores();
    }
})();

// ===== OBSERVER PARA CREDIBILIDAD Y SERVICIOS =====
(function() {
    // Observar sección credibilidad (ya existente)
    const seccionCredibilidad = document.getElementById('credibilidad');
    if (seccionCredibilidad) {
        // ... tu código actual para credibilidad ...
    }

    // Observar ítems de servicios de impresión
    const serviciosItems = document.querySelectorAll('#servicios-fisicos .servicio-item');
    if (serviciosItems.length) {
        const observerServicios = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.3 });

        serviciosItems.forEach(item => observerServicios.observe(item));
    }
})();