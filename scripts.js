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