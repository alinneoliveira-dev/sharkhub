let sharks = [];
let quizQuestions = [];

let currentQuestion = 0;
let score = 0;
let quizAnswered = false;


const screens = document.querySelectorAll(".screen");
const navigationItems = document.querySelectorAll("[data-screen]");


/* =========================
   NAVEGAÇÃO
========================= */

function showScreen(screenId) {

    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(screenId);

    if (targetScreen) {
        targetScreen.classList.add("active");
    }

    updateNavigation(screenId);

    if (screenId === "quiz-screen") {
        startQuiz();
    }
}


function updateNavigation(screenId) {

    document.querySelectorAll(".nav-item").forEach((item) => {

        item.classList.remove("active");

        if (item.dataset.screen === screenId) {
            item.classList.add("active");
        }

    });

}


navigationItems.forEach((item) => {

    item.addEventListener("click", () => {

        showScreen(item.dataset.screen);

    });

});


/* =========================
   TUBARÕES
========================= */

async function loadSharks() {

    try {

        const response = await fetch(
            "/static/data/sharks.json"
        );

        if (!response.ok) {
            throw new Error(
                "Não foi possível carregar as espécies."
            );
        }

        sharks = await response.json();

        renderSpecies();

    } catch (error) {

        console.error(
            "Erro ao carregar tubarões:",
            error
        );

    }

}


function renderSpecies() {

    const speciesList =
        document.getElementById("species-list");

    if (!speciesList) {
        return;
    }

    speciesList.innerHTML = "";


    sharks.forEach((shark) => {

        const card =
            document.createElement("button");

        card.classList.add("species-card");


        card.innerHTML = `

            <div class="species-image">

                <img
                    src="/static/images/${shark.image}"
                    alt="${shark.name}"
                >

            </div>


            <div class="species-info">

                <strong>
                    ${shark.name}
                </strong>

                <em>
                    ${shark.scientific_name}
                </em>

            </div>


            <span class="arrow">
                ›
            </span>

        `;


        card.addEventListener("click", () => {

            showSharkDetails(shark.id);

        });


        speciesList.appendChild(card);

    });

}


function showSharkDetails(sharkId) {

    const shark =
        sharks.find(
            (item) => item.id === sharkId
        );

    if (!shark) {
        return;
    }


    document.getElementById(
        "detail-name"
    ).textContent = shark.name;


    document.getElementById(
        "detail-scientific-name"
    ).textContent =
        shark.scientific_name;


    document.getElementById(
        "detail-description"
    ).textContent =
        shark.description;


    document.getElementById(
        "detail-habitat"
    ).textContent =
        shark.habitat;


    document.getElementById(
        "detail-size"
    ).textContent =
        shark.size;


    document.getElementById(
        "detail-diet"
    ).textContent =
        shark.diet;


    document.getElementById(
        "detail-status"
    ).textContent =
        shark.status;


    showScreen(
        "shark-detail-screen"
    );

}


/* =========================
   QUIZ
========================= */

async function loadQuiz() {

    try {

        const response = await fetch(
            "/static/data/quiz.json"
        );

        if (!response.ok) {
            throw new Error(
                "Não foi possível carregar o quiz."
            );
        }

        quizQuestions =
            await response.json();

    } catch (error) {

        console.error(
            "Erro ao carregar quiz:",
            error
        );

    }

}


function startQuiz() {

    if (!quizQuestions.length) {
        return;
    }


    currentQuestion = 0;
    score = 0;

    showQuestion();

}


function showQuestion() {

    if (
        currentQuestion >=
        quizQuestions.length
    ) {

        showQuizResult();

        return;
    }


    quizAnswered = false;


    const question =
        quizQuestions[currentQuestion];


    const questionNumber =
        document.getElementById(
            "quiz-question-number"
        );


    const scoreElement =
        document.getElementById(
            "quiz-score"
        );


    const questionElement =
        document.getElementById(
            "quiz-question"
        );


    const feedback =
        document.getElementById(
            "quiz-feedback"
        );


    const progressFill =
        document.getElementById(
            "quiz-progress-fill"
        );


    questionNumber.textContent =
        `PERGUNTA ${currentQuestion + 1} DE ${quizQuestions.length}`;


    scoreElement.textContent =
        `${score} PONTO${score === 1 ? "" : "S"}`;


    questionElement.textContent =
        question.statement;


    feedback.hidden = true;


    progressFill.style.width =
        `${(
            (currentQuestion) /
            quizQuestions.length
        ) * 100}%`;


    document
        .querySelectorAll(
            ".quiz-answer-button"
        )
        .forEach((button) => {

            button.disabled = false;

            button.classList.remove(
                "selected",
                "correct",
                "wrong"
            );

        });

}


function answerQuestion(userAnswer) {

    if (quizAnswered) {
        return;
    }


    quizAnswered = true;


    const question =
        quizQuestions[currentQuestion];


    const isCorrect =
        userAnswer === question.answer;


    if (isCorrect) {
        score++;
    }


    document
        .querySelectorAll(
            ".quiz-answer-button"
        )
        .forEach((button) => {

            button.disabled = true;


            const buttonAnswer =
                button.dataset.answer === "true";


            if (
                buttonAnswer ===
                question.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                buttonAnswer ===
                userAnswer &&
                !isCorrect
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        });


    showFeedback(
        isCorrect,
        question
    );

}


function showFeedback(
    isCorrect,
    question
) {

    const feedback =
        document.getElementById(
            "quiz-feedback"
        );


    const feedbackIcon =
        document.getElementById(
            "quiz-feedback-icon"
        );


    const feedbackResult =
        document.getElementById(
            "quiz-feedback-result"
        );


    const explanation =
        document.getElementById(
            "quiz-explanation"
        );


    const source =
        document.getElementById(
            "quiz-source"
        );


    feedback.hidden = false;


    if (isCorrect) {

        feedbackIcon.textContent = "✓";

        feedbackResult.textContent =
            "Você acertou!";

    } else {

        feedbackIcon.textContent = "×";

        feedbackResult.textContent =
            "Não foi dessa vez.";

    }


    explanation.textContent =
        question.explanation;


    source.textContent =
        `Fonte: ${question.source}`;


    const progressFill =
        document.getElementById(
            "quiz-progress-fill"
        );


    progressFill.style.width =
        `${(
            (currentQuestion + 1) /
            quizQuestions.length
        ) * 100}%`;

}


function nextQuestion() {

    currentQuestion++;

    showQuestion();

}


function showQuizResult() {

    const questionElement =
        document.getElementById(
            "quiz-question"
        );


    const questionNumber =
        document.getElementById(
            "quiz-question-number"
        );


    const scoreElement =
        document.getElementById(
            "quiz-score"
        );


    const feedback =
        document.getElementById(
            "quiz-feedback"
        );


    const actions =
        document.querySelector(
            ".quiz-actions"
        );


    const progressFill =
        document.getElementById(
            "quiz-progress-fill"
        );


    questionNumber.textContent =
        "EXPEDIÇÃO CONCLUÍDA";


    scoreElement.textContent =
        `${score}/${quizQuestions.length}`;


    questionElement.textContent =
        getQuizResultMessage();


    actions.style.display =
        "none";


    feedback.hidden = false;


    document.getElementById(
        "quiz-feedback-icon"
    ).textContent = "🦈";


    document.getElementById(
        "quiz-feedback-result"
    ).textContent =
        "Seu resultado";


    document.getElementById(
        "quiz-explanation"
    ).textContent =
        `Você acertou ${score} de ${quizQuestions.length} perguntas. Você já sabe bastante sobre esses animais — mas o oceano ainda guarda muitos segredos.`;


    document.getElementById(
        "quiz-source"
    ).textContent =
        "Conteúdo baseado em fontes da NOAA Fisheries e NOAA Ocean Service.";


    document.getElementById(
        "quiz-next"
    ).textContent =
        "Refazer quiz";


    document.getElementById(
        "quiz-next"
    ).onclick = restartQuiz;


    progressFill.style.width = "100%";

}


function getQuizResultMessage() {

    const percentage =
        score / quizQuestions.length;


    if (percentage === 1) {

        return "Você dominou o oceano.";

    }


    if (percentage >= 0.7) {

        return "Você conhece bem os tubarões.";

    }


    if (percentage >= 0.5) {

        return "Você está no caminho certo.";

    }


    return "Parece que temos uma nova expedição pela frente.";

}


function restartQuiz() {

    const actions =
        document.querySelector(
            ".quiz-actions"
        );


    actions.style.display =
        "flex";


    document.getElementById(
        "quiz-next"
    ).onclick =
        nextQuestion;


    startQuiz();

}



document
    .querySelectorAll(
        ".quiz-answer-button"
    )
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const answer =
                    button.dataset.answer === "true";

                answerQuestion(answer);

            }
        );

    });


document
    .getElementById("quiz-next")
    ?.addEventListener(
        "click",
        nextQuestion
    );


function updateClock() {

    const clock =
        document.getElementById(
            "current-time"
        );

    if (!clock) {
        return;
    }


    const now = new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}`;

}


updateClock();

setInterval(
    updateClock,
    30000
);

loadSharks();

loadQuiz();