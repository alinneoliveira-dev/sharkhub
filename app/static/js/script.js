let sharks = [];

const screens = document.querySelectorAll(".screen");
const navigationItems = document.querySelectorAll("[data-screen]");


function showScreen(screenId) {
    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(screenId);

    if (targetScreen) {
        targetScreen.classList.add("active");
    }

    updateNavigation(screenId);
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


async function loadSharks() {
    try {
        const response = await fetch("/static/data/sharks.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar as espécies.");
        }

        sharks = await response.json();

        renderSpecies();

    } catch (error) {
        console.error("Erro ao carregar tubarões:", error);
    }
}


function renderSpecies() {
    const speciesList = document.getElementById("species-list");

    if (!speciesList) {
        return;
    }

    speciesList.innerHTML = "";

    sharks.forEach((shark) => {

        const card = document.createElement("button");

        card.classList.add("species-card");

        card.innerHTML = `
            <div class="species-image">
                <img
                    src="/static/images/${shark.image}"
                    alt="${shark.name}"
                >
            </div>

            <div class="species-info">
                <strong>${shark.name}</strong>
                <em>${shark.scientific_name}</em>
            </div>

            <span class="arrow">›</span>
        `;

        card.addEventListener("click", () => {
            showSharkDetails(shark.id);
        });

        speciesList.appendChild(card);
    });
}

function showSharkDetails(sharkId) {

    const shark = sharks.find((item) => item.id === sharkId);

    if (!shark) {
        return;
    }

    document.getElementById("detail-name").textContent = shark.name;

    document.getElementById("detail-scientific-name").textContent =
        shark.scientific_name;

    document.getElementById("detail-description").textContent =
        shark.description;

    document.getElementById("detail-habitat").textContent =
        shark.habitat;

    document.getElementById("detail-size").textContent =
        shark.size;

    document.getElementById("detail-diet").textContent =
        shark.diet;

    document.getElementById("detail-status").textContent =
        shark.status;

    showScreen("shark-detail-screen");
}


function updateClock() {

    const clock = document.getElementById("current-time");

    if (!clock) {
        return;
    }

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    clock.textContent = `${hours}:${minutes}`;
}


updateClock();

setInterval(updateClock, 30000);

loadSharks();