
const currentYear = new Date().getFullYear();
const minYear = currentYear - 100;

const questions = [
    { question: "가장 좋아하는 숫자는?", hint: "가장 마음에 드는 숫자는?", min: null, max: null },
    { question: "오늘 기분은 몇 점?", hint: "1점(최악) ~ 10점(최고)", min: 1, max: 10 },
    { question: "행운의 숫자는?", hint: "머릿속에 떠오른 그 숫자!", min: null, max: null },
    {
        question: "기억에 남는 연도는?",
        hint: `예: ${currentYear - 20} (${minYear} ~ ${currentYear})`,
        min: minYear,
        max: currentYear
    },
    { question: "당신의 나이는?", hint: "솔직하게 알려주세요 🤫", min: 1, max: 150 }
];

let currentQuestionIndex = 0;
let answers = [];

function initDots() {
    const container = document.getElementById('progressDots');
    container.innerHTML = '';
    questions.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot' + (idx === 0 ? ' active' : '');
        container.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
        if (idx <= currentQuestionIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function startQuiz() {
    currentQuestionIndex = 0;
    answers = [];
    initDots();
    switchScreen('startScreen', 'questionScreen');
    showQuestion();
}

function switchScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    hideEl.classList.remove('active');

    setTimeout(() => {
        hideEl.style.display = 'none';
        showEl.style.display = 'block';
        setTimeout(() => showEl.classList.add('active'), 50);
    }, 300);
}

function showQuestion() {
    const question = questions[currentQuestionIndex];

    clearError();
    updateDots();

    document.getElementById('questionNumber').textContent = `Q. 0${currentQuestionIndex + 1}`;
    document.getElementById('questionLabel').textContent = question.question;
    document.getElementById('questionHint').textContent = question.hint;

    const input = document.getElementById('answerInput');
    input.value = '';

    setTimeout(() => input.focus(), 300);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const input = document.getElementById('answerInput');
    const rawValue = input.value;
    const question = questions[currentQuestionIndex];

    if (!rawValue || rawValue.toString().trim() === "") {
        showError("숫자를 입력해주세요! ✍️");
        return;
    }

    const numValue = Number(rawValue);

    if (isNaN(numValue)) {
        showError("숫자만 입력 가능해요 🔢");
        return;
    }

    if (question.min !== null && numValue < question.min) {
        showError(`${question.min}보다 큰 숫자여야 해요 ⬆️`);
        return;
    }

    if (question.max !== null && numValue > question.max) {
        showError(`${question.max}보다 작은 숫자여야 해요 ⬇️`);
        return;
    }

    if (question.max === null && numValue > 999999999) {
        showError("숫자가 너무 커요! 😲");
        return;
    }

    answers.push(parseInt(rawValue, 10));
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {

        const screen = document.getElementById('questionScreen');
        screen.style.opacity = '0';
        screen.style.transform = 'translateY(10px)';

        setTimeout(() => {
            showQuestion();
            screen.style.opacity = '1';
            screen.style.transform = 'translateY(0)';
        }, 300);
    } else {
        showResult();
    }
}

function showError(msg) {
    const errorDiv = document.getElementById('errorMessage');
    const input = document.getElementById('answerInput');

    errorDiv.textContent = msg;

    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    input.focus();
}

function clearError() {
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('answerInput').classList.remove('shake');
}

function showResult() {
    switchScreen('questionScreen', 'resultScreen');

    const age = answers[answers.length - 1];
    const resultElement = document.getElementById('resultAge');

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 3);

        const currentAge = Math.floor(ease * age);
        resultElement.innerHTML = `${currentAge}<span class="result-unit">세</span>`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            createConfetti();
        }
    }

    requestAnimationFrame(update);
}

function createConfetti() {
    const colors = ['#a18cd1', '#fbc2eb', '#fad0c4', '#ff9a9e', '#84fab0', '#8fd3f4'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + '%';
        const animDuration = Math.random() * 3 + 2 + 's';
        const size = Math.random() * 8 + 5 + 'px';

        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.animation = `confettiDrop ${animDuration} ease-out forwards`;
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.opacity = Math.random();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        confetti.style.top = '-10px';

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `
            @keyframes confettiDrop {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
document.head.appendChild(styleSheet);

function restart() {
    switchScreen('resultScreen', 'startScreen');
}
