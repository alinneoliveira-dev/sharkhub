let sharks = [];
let quizQuestions = [];
let quizRoundQuestions = [];
let personalityRoundQuestions = [];
let personalityCurrentQuestion = 0;
let personalityScores = {};
let personalityResultId = null;

let currentQuestion = 0;
let score = 0;
let quizAnswered = false;

const screens = document.querySelectorAll(".screen");
const navigationItems = document.querySelectorAll("[data-screen]");

/* navegacao */
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

    if (screenId === "personality-screen") {
    resetPersonalityQuiz();
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

/* tubaroes */

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
                    alt="${shark.name}">
            </div>
            <div class="species-info">
                <strong> ${shark.name} </strong> <em> ${shark.scientific_name}</em>
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
    const detailImg = document.getElementById("detail-img");
    detailImg.src = `/static/images/${shark.image}`;
    detailImg.alt = shark.name;
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

/* qual tubarao é voce? */

async function loadPersonalityQuestions() {
    try {
        const response = await fetch(
            "/static/data/personality-quiz.json"
        );

        if (!response.ok) {
            throw new Error("Não foi possível carregar as perguntas.");
        }

        personalityQuestions = await response.json();

    } catch (error) {
        console.error("Erro ao carregar o teste:", error);
    }
}

function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


const personalityProfiles = {
    1: {
        type: "O(a) protagonista",
        description: "Você não costuma fugir de um desafio. Quando decide fazer alguma coisa, vai atrás e encara o que aparecer. Sua energia é de quem prefere tentar a ficar imaginando como teria sido."
    },
    2: {
        type: "A paz em pessoa",
        description: "Você sabe que nem toda situação merece sua energia. Gosta de aproveitar a vida no seu ritmo e não vê necessidade de transformar tudo em uma competição."
    },
    3: {
        type: "A mente investigativa",
        description: "Sua cabeça dificilmente fica sem assunto. Você observa detalhes, cria teorias e gosta de entender o que está por trás das coisas. Às vezes, pensa tanto que até uma mensagem vira investigação."
    },
    4: {
        type: "Camaleão do rolê",
        description: "Você sabe se virar quando os planos mudam. Gosta de experiências diferentes e consegue encontrar um caminho mesmo quando ninguém sabe direito o que está acontecendo."
    },
    5: {
        type: "O(a) guardião(a) da tranquilidade",
        description: "Seu lema poderia ser: menos drama, mais qualidade de vida. Você valoriza o próprio espaço, gosta de conforto e sabe que descansar também é aproveitar."
    },
    6: {
        type: "Fora da caixinha",
        description: "Você dificilmente escolhe sempre o caminho óbvio. Gosta de explorar ideias, encontrar alternativas e surpreender as pessoas com soluções que ninguém tinha considerado."
    },
    7: {
        type: "A acelerada oficial",
        description: "Esperar não é exatamente seu talento. Você gosta de movimento, desafios e novidades. Quando alguma coisa chama sua atenção, já quer começar — de preferência, agora."
    },
    8: {
        type: "A alma antiga",
        description: "Enquanto o mundo parece estar correndo uma maratona, você lembra que não precisa acompanhar todo mundo. Tem seu próprio ritmo e não sente necessidade de entrar em cada onda."
    },
    9: {
        type: "O(a) observador(a) do grupo",
        description: "Você gosta de entender o ambiente antes de entrar na conversa. Percebe detalhes, acompanha as histórias e sabe aproveitar os momentos sem precisar ser o centro das atenções."
    },
    10: {
        type: "A personalidade marcante",
        description: "Você tem suas preferências, sabe o que gosta e não precisa concordar com todo mundo. Sua presença tem identidade própria e você prefere ser autêntica a tentar agradar a todos."
    }
};


function resetPersonalityQuiz() {
    personalityCurrentQuestion = 0;
    personalityScores = {};
    personalityResultId = null;

    document.querySelector(".personality-intro").hidden = false;
    document.getElementById("personality-game").hidden = true;
    document.getElementById("personality-result").hidden = true;
}


async function startPersonalityGame() {
    if (!personalityQuestions.length) {
        await loadPersonalityQuestions();
    }

    if (!sharks.length) {
        await loadSharks();
    }

    if (!personalityQuestions.length || !sharks.length) {
        alert("Não foi possível carregar o teste. Tente novamente.");
        return;
    }

    personalityRoundQuestions = shuffleArray(personalityQuestions)
    .slice(0, 5);

    personalityCurrentQuestion = 0;
    personalityScores = {};

    document.querySelector(".personality-intro").hidden = true;
    document.getElementById("personality-result").hidden = true;
    document.getElementById("personality-game").hidden = false;

    renderPersonalityQuestion();
}


function renderPersonalityQuestion() {
    const question = personalityRoundQuestions[personalityCurrentQuestion];

    document.getElementById("personality-question-number").textContent =
        `PERGUNTA ${personalityCurrentQuestion + 1} DE ${personalityRoundQuestions.length}`;

    const percentage = Math.round(
        (personalityCurrentQuestion / personalityRoundQuestions.length) * 100
    );

    document.getElementById("personality-progress-percent").textContent =
        `${percentage}%`;

    document.getElementById("personality-progress-fill").style.width =
        `${percentage}%`;

    document.getElementById("personality-question").textContent =
        question.question;

    const optionsContainer = document.getElementById("personality-options");
    optionsContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "personality-option";

        button.style.animationDelay = `${index * 60}ms`;

        const emoji = document.createElement("span");
        emoji.className = "personality-option-emoji";
        emoji.textContent = answer.emoji;

        const text = document.createElement("span");
        text.className = "personality-option-text";
        text.textContent = answer.text;

        button.append(emoji, text);

        button.addEventListener("click", () => {
            answerPersonalityQuestion(answer.sharkId);
        });

        optionsContainer.appendChild(button);
    });
}


function answerPersonalityQuestion(sharkId) {
    personalityScores[sharkId] =
        (personalityScores[sharkId] || 0) + 1;

    personalityCurrentQuestion++;

    if (personalityCurrentQuestion >= personalityRoundQuestions.length) {
        showPersonalityResult();
        return;
    }

    renderPersonalityQuestion();
}


function showPersonalityResult() {
    const highestScore = Math.max(
        ...Object.values(personalityScores)
    );

    const tiedIds = Object.keys(personalityScores)
        .filter(id => personalityScores[id] === highestScore)
        .map(Number);

    // Se houver empate, sorteia entre os perfis empatados.
    const winnerId = tiedIds[
        Math.floor(Math.random() * tiedIds.length)
    ];

    const shark = sharks.find(item => item.id === winnerId);
    const profile = personalityProfiles[winnerId];

    if (!shark || !profile) {
        console.error("Não foi possível encontrar o resultado.");
        return;
    }

    personalityResultId = shark.id;

    document.getElementById("personality-game").hidden = true;
    document.getElementById("personality-result").hidden = false;

    document.getElementById("personality-progress-percent").textContent =
        "100%";

    document.getElementById("personality-progress-fill").style.width =
        "100%";

    document.getElementById("personality-result-image").src =
        `/static/images/${shark.image}`;

    document.getElementById("personality-result-image").alt =
        shark.name;

    document.getElementById("personality-result-type").textContent =
        profile.type;

    document.getElementById("personality-result-name").textContent =
        shark.name;

    document.getElementById("personality-result-scientific").textContent =
        shark.scientific_name;

    document.getElementById("personality-result-description").textContent =
        profile.description;
}


document.getElementById("personality-start").addEventListener(
    "click",
    startPersonalityGame
);


document.getElementById("personality-restart").addEventListener(
    "click",
    startPersonalityGame
);


document.getElementById("personality-explore").addEventListener(
    "click",
    () => {
        if (personalityResultId !== null) {
            showSharkDetails(personalityResultId);
        }
    }
);



/* quiz*/

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
    quizRoundQuestions = shuffleArray(quizQuestions).slice(0, 5);
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {

    if (
        currentQuestion >=
        quizRoundQuestions.length
    ) {

        showQuizResult();

        return;
    }


    quizAnswered = false;


    const question = quizRoundQuestions[currentQuestion];
    const questionNumber = document.getElementById("quiz-question-number");
    const scoreElement =document.getElementById("quiz-score");
    const questionElement = document.getElementById("quiz-question");
    const feedback = document.getElementById("quiz-feedback");
    const progressFill = document.getElementById("quiz-progress-fill");

    questionNumber.textContent =`PERGUNTA ${personalityCurrentQuestion + 1} DE ${personalityRoundQuestions.length}`
    scoreElement.textContent = `${score} PONTO${score === 1 ? "" : "S"}`;
    questionElement.textContent = question.statement;
    feedback.hidden = true;

    progressFill.style.width = `${( (currentQuestion) / quizQuestions.length) * 100}%`;

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
    if (quizAnswered) {return;}

    quizAnswered = true;
    const question =quizQuestions[currentQuestion];
    const isCorrect = userAnswer === question.answer;

    if (isCorrect) { score++; }

    document.querySelectorAll( ".quiz-answer-button").forEach((button) => {button.disabled = true;

     const buttonAnswer = button.dataset.answer === "true";
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
loadPersonalityQuestions();