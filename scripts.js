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
            if (offcanvas.classList.contains('show')) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
                offcanvasInstance.hide();
            }
        }
    });
});

// ===== REINICIO DE ANIMACIONES SECUENCIALES EN EL HERO =====
const heroCarousel = document.getElementById('hero');
if (heroCarousel) {
    heroCarousel.addEventListener('slide.bs.carousel', function (event) {
        const nextSlide = event.relatedTarget;
        const lines = nextSlide.querySelectorAll('.hero-line');
        lines.forEach(line => {
            line.style.animation = 'none';
            void line.offsetHeight;
            line.style.animation = '';
        });
    });
}

// ===== AJUSTE DE ALTURA PARA MÓVILES =====
function setHeroHeight() {
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.height = window.innerHeight + 'px';
        const items = hero.querySelectorAll('.carousel-item');
        items.forEach(item => {
            item.style.height = window.innerHeight + 'px';
        });
    }
}
window.addEventListener('load', setHeroHeight);
window.addEventListener('resize', setHeroHeight);

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