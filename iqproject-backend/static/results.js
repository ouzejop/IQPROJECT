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

////////////////////////////////////////////////

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hh = h > 0 ? String(h).padStart(2, '0') + ':' : '';
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');

    return `${hh}${mm}:${ss}`;
}


function getIQ(correct, total) {
    const percent = (correct / total) * 100;
    return Math.round(70 + (percent * 0.9)); // IQ entre 70 et 160 environ
}

function estimatePercentile(iq) {
    if (iq >= 145) return 99;
    if (iq >= 130) return 95;
    if (iq >= 120) return 90;
    if (iq >= 110) return 75;
    if (iq >= 100) return 60;
    if (iq >= 90) return 50;
    if (iq >= 80) return 35;
    return 20;
}

function getComment(iq) {
    if (iq >= 140) return "Extraordinaire ! Vous possédez des capacités intellectuelles exceptionnelles.";
    if (iq >= 130) return "Remarquable ! Votre intelligence est nettement au-dessus de la moyenne.";
    if (iq >= 120) return "Excellent raisonnement logique ! Vous démontrez des capacités analytiques remarquables.";
    if (iq >= 110) return "Très bon résultat ! Vous avez de solides capacités de raisonnement.";
    if (iq >= 90)  return "Bon travail ! Votre performance est dans la moyenne haute.";
    if (iq >= 80)  return "Résultat correct. Il y a de la marge pour progresser !";
    return "Continuez à vous entraîner, la pratique améliore les performances !";
}

function getIcon(iq) {
    if (iq >= 140) return '🏆';
    if (iq >= 120) return '🎉';
    if (iq >= 110) return '👏';
    if (iq >= 90)  return '😊';
    return '🤔';
}

document.addEventListener('DOMContentLoaded', () => {
    const correct = parseInt(localStorage.getItem('score') || 0);
    const type = localStorage.getItem('IQType');
    switch (type) {
            case 'easy':
                timeLeft = 600; // 10 minutes
                total = 10;
                break;
            case 'mid':
                timeLeft = 900; // 15 minutes
                total = 20;
                break;
            case 'complete':
                timeLeft = 1500; // 25 minutes
                total = 30;
                break;
        }
    //const total = parseInt(localStorage.getItem('total') || 10);
    const time = localStorage.getItem('time') || "00:00";

    const iq = getIQ(correct, total);
    const percentile = (correct/total)*100;
    const comment = getComment(iq);
    const icon = getIcon(iq);

    // Affichage QI
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = iq;

    // Animation du score
    scoreElement.style.animation = 'none';
    setTimeout(() => {
        scoreElement.style.animation = 'scaleIn 0.8s ease-out';
    }, 10);

    // Commentaire
    const commentElement = document.getElementById('commentaire');
    commentElement.textContent = comment;

    // Icône
    document.getElementById('celebration').textContent = icon;

    // Statistiques
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = `${correct}/${total}`;
    
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = formatTime(timeLeft-time);

    const percentileEl = document.querySelector('.stat-item:nth-child(3)');
    percentileEl.innerHTML = `
        <p>Percentile estimé : ${percentile}%</p>
    `;
});


/*
 // Fonction pour afficher un score dynamiquement
 function displayScore(scoreValue) {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = scoreValue;
    
    // Animation du score
    scoreElement.style.animation = 'none';
    setTimeout(() => {
        scoreElement.style.animation = 'scaleIn 0.8s ease-out';
    }, 10);
}

// Fonction pour afficher un commentaire dynamiquement
function displayComment(comment) {
    const commentElement = document.getElementById('commentaire');
    commentElement.textContent = comment;
    
    // Animation du commentaire
    commentElement.style.animation = 'none';
    setTimeout(() => {
        commentElement.style.animation = 'fadeIn 1s ease-out';
    }, 10);
}

// Fonction pour définir l'icône de célébration en fonction du score
function setCelebrationIcon(score) {
    const celebrationElement = document.getElementById('celebration');
    
    if (score >= 140) {
        celebrationElement.textContent = '🏆'; // Génie
    } else if (score >= 120) {
        celebrationElement.textContent = '🎉'; // Excellent
    } else if (score >= 110) {
        celebrationElement.textContent = '👏'; // Très bon
    } else if (score >= 90) {
        celebrationElement.textContent = '😊'; // Bon
    } else {
        celebrationElement.textContent = '🤔'; // À améliorer
    }
}

// Fonction principale pour mettre à jour les résultats
function updateResults(score, correctAnswers = 8, timeUsed = "12:45", percentile = 85) {
    // Mettre à jour le score
    displayScore(score);
    
    // Définir le commentaire en fonction du score
    let comment = "";
    if (score >= 140) {
        comment = "Extraordinaire ! Vous possédez des capacités intellectuelles exceptionnelles.";
    } else if (score >= 130) {
        comment = "Remarquable ! Votre intelligence est nettement au-dessus de la moyenne.";
    } else if (score >= 120) {
        comment = "Excellent raisonnement logique ! Vous démontrez des capacités analytiques remarquables.";
    } else if (score >= 110) {
        comment = "Très bon résultat ! Vous avez de solides capacités de raisonnement.";
    } else if (score >= 90) {
        comment = "Bon travail ! Votre performance est dans la moyenne haute.";
    } else if (score >= 80) {
        comment = "Résultat correct. Il y a de la marge pour progresser !";
    } else {
        comment = "Continuez à vous entraîner, la pratique améliore les performances !";
    }
    
    displayComment(comment);
    setCelebrationIcon(score);
    
    // Mettre à jour les statistiques
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = `${correctAnswers}/10`;
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = timeUsed;
    document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = `${percentile}%`;
}

// Exemple d'utilisation - remplacer par vos données réelles
// updateResults(125, 9, "11:23", 92);

// Simulation d'un résultat aléatoire pour la démo
document.addEventListener('DOMContentLoaded', function() {
    // Vous pouvez récupérer le score depuis localStorage, URL params, etc.
    const score = localStorage.getItem('score') || 120;
    updateResults(parseInt(score));
});

// Gestion du partage (exemple basique)
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const score = document.getElementById('score').textContent;
        iq = 100 + (score - 5) * 5
        const text = `Je viens de passer un test de QI et j'ai obtenu un score de ${score} ! 🧠`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mon résultat au test de QI',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback pour navigateurs non compatibles
            navigator.clipboard.writeText(text + ' ' + window.location.href)
                .then(() => alert('Texte copié dans le presse-papiers !'));
        }
    });
});*/