//header
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
//end header
function startIq(type) {
    // Stocke le type de test dans localStorage
    localStorage.setItem('IQType', type);

    // Redirige vers la page de test
    window.location.href = '/test';
}

function startQuiz(category) {
    // Chercher le niveau sélectionné dans les boutons radio de cette catégorie
    const selectedDifficulty = document.querySelector(`input[name="difficulty-${category}"]:checked`);
    
    if (selectedDifficulty) {
        const difficulty = selectedDifficulty.value;
        console.log("Type de quiz:", category);
        console.log("Niveau sélectionné:", difficulty);
        localStorage.setItem('QuizzType',difficulty);
        localStorage.setItem('category',category);
        window.location.href = '/quizz'
    } else {
        alert("Veuillez choisir un niveau de difficulté.");
    }
}


        // Animation au survol des cartes
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Effet de parallaxe léger sur les cartes au scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const cards = document.querySelectorAll('.quiz-card');
            
            cards.forEach((card, index) => {
                const speed = 0.02 + (index * 0.01);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Animation d'entrée séquentielle au chargement
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.quiz-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            cards.forEach(card => {
                observer.observe(card);
            });
        });

        // Gestion du clavier pour l'accessibilité
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('quiz-card')) {
                    focusedElement.click();
                }
            }
        });

        // Rendre les cartes accessibles au clavier
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Commencer le test ${card.querySelector('.quiz-title').textContent}`);
        });
        

        document.addEventListener('DOMContentLoaded', () => {
  // Supprimer les radio sélectionnés par défaut
  document.querySelectorAll('.selection-card input[type="radio"]').forEach(input => {
    input.checked = false;
  });

  // Gérer les clics sur les niveaux de difficulté
  document.querySelectorAll('.selection-card .difficulty-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault(); // Empêche les radios d'être sélectionnés automatiquement

      const card = option.closest('.selection-card');

      // Supprimer la classe selected pour tous les labels de la même carte
      card.querySelectorAll('.difficulty-option').forEach(label => {
        label.classList.remove('selected');
        label.querySelector('input').checked = false;
      });

      // Appliquer la classe selected au label cliqué et cocher son input
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
});