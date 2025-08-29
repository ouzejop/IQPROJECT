// Générer ou récupérer un ID utilisateur
function getOrCreateUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('user_id', userId);
    }
    return userId;
}
const userId = getOrCreateUserId();

// Gestion du menu mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

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

// Définir les liens actifs
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}
setActiveLink();

document.addEventListener('click', function (event) {
    const isClickInsideNav = mobileNav.contains(event.target);
    const isClickOnButton = mobileMenuBtn.contains(event.target);
    if (!isClickInsideNav && !isClickOnButton && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
    }
});

document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-1px)';
    });
    link.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Variables pour le test
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];
let correctAnswerCompter=0;

const nextBtn = document.getElementById('next-btn');
const validBtn = document.getElementById('valid-btn');

// Charger les questions depuis le backend Flask
async function loadQuestions(category, difficulty) {
    try {
        const response = await fetch(`http://localhost:5000/generate-quizz?type=${category}&difficulty=${difficulty}`);
        questions = await response.json();

        // Démarrer le quiz
        updateTimer();
        displayQuestion();
        updateProgress(1, questions.length);
    } catch (err) {
        console.error('Erreur chargement des questions:', err);
    }
}



// Affichage d’une question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question) return;

    document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('question-text').textContent = question.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const letter = String.fromCharCode(65 + index);
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.setAttribute('data-value', choice);
        btn.innerHTML = `<span class="option-label">${letter}.</span> ${choice}`;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            btn.classList.add('selected');
            selectedAnswer = choice;
            validBtn.disabled = false;
            validBtn.addEventListener('click', ()=>{
               nextBtn.disabled = false; 
            })
            
        });

        optionsContainer.appendChild(btn);
    });
    validBtn.disabled = true;
    nextBtn.disabled = true;
    selectedAnswer = null;
}

// Timer
let timeLeft = 900; // 15 min
const timerDisplay = document.getElementById('timer-display');

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft > 0) {
        timeLeft--;
        setTimeout(updateTimer, 1000);
    } else {
        timerDisplay.textContent = "Temps écoulé !";
        timerDisplay.style.color = "#dc3545";
        finishTest();
    }
}
//updateTimer();

// Barre de progression
function updateProgress(current, total) {
    const progressBar = document.getElementById('progress');
    const percentage = (current / total) * 100;
    progressBar.style.width = percentage + '%';
}

// Envoi de la réponse et passage à la question suivante
nextBtn.addEventListener('click', () => {
    if (!selectedAnswer) return;
    if ( selectedAnswer === questions[currentQuestionIndex].answer){
        correctAnswerCompter++;
    }
    const currentQuestion = questions[currentQuestionIndex];
    currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
            updateProgress(currentQuestionIndex + 1, questions.length);
            if (currentQuestionIndex == questions.length - 1) {
                nextBtn.textContent='Recommencer'
            }
        } else {
            
            finishTest();
        }

    /*fetch('http://localhost:5000/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            question_id: currentQuestion.id,
            selected_answer: selectedAnswer
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Réponse enregistrée:', data);

        userAnswers.push({
            questionId: currentQuestion.id,
            selected: selectedAnswer
        });

        
    })
    .catch(err => {
        console.error('Erreur enregistrement réponse :', err);
    });*/
});

// Fin du test
function finishTest() {
    console.log("Réponses de l'utilisateur :", userAnswers);
    localStorage.setItem('score', correctAnswerCompter);
    localStorage.setItem('time',timeLeft)
    window.location.href = `/quizzchoice`;
    // Tu peux rediriger ou afficher un résumé ici
}

window.onload = () => {
    const category = localStorage.getItem('category');
    const quizztype = localStorage.getItem('QuizzType');
    if (!category) {
        alert("Type de test non défini !");
        return;
    }
    loadQuestions(category,quizztype);
};
