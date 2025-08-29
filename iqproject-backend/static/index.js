// Gestion du menu mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// Effet de scroll sur le header
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Gestion de l'état actif des liens
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Appeler au chargement de la page
setActiveLink();

// Fermer le menu mobile en cliquant en dehors
document.addEventListener('click', function(event) {
    const isClickInsideNav = mobileNav.contains(event.target);
    const isClickOnButton = mobileMenuBtn.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnButton && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
    }
});

// Animation des liens au hover (effet optionnel)
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});