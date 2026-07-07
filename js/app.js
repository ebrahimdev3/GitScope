import { getUser, getRepositories } from "./api.js";
import {
    updateProfile,
    updateStatistics,
    renderRepositories,
    renderTechStack
} from "./ui.js";
import { loginWithGitHub } from "./auth.js";
import { show, hide } from "./utils.js";
import { calculateDeveloperScore } from "./analytics.js";


const form = document.getElementById("search-form");
const input = document.getElementById("username");
const githubLogin = document.getElementById("github-login");
const quickSearch = document.getElementById("quick-search");
if (quickSearch && input) {

    input.addEventListener("focus", () => {
        quickSearch.classList.remove("hidden");
    });

    document.addEventListener("click", (event) => {

        if (
            !quickSearch.contains(event.target) &&
            event.target !== input
        ) {
            quickSearch.classList.add("hidden");
        }

    });

    document.querySelectorAll(".quick-user").forEach(button => {

        button.addEventListener("click", () => {

            input.value = button.textContent.trim();

            quickSearch.classList.add("hidden");

            form.requestSubmit();

        });

    });

}

if (githubLogin) {

    githubLogin.addEventListener("click", () => {
        loginWithGitHub();
    });

}
if (form) {

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = input.value.trim();

    if (!username) return;

    try {

        const user = await getUser(username);
        const repos = await getRepositories(username);

        updateProfile(user);
        updateStatistics(repos);

        const score = calculateDeveloperScore(user, repos);

        const scoreElement = document.getElementById("developer-score");

if (scoreElement) {
    scoreElement.textContent = `${score}/100`;
}
        renderRepositories(repos);
        renderTechStack(repos);

        hide("empty-state");
        show("results");

    } catch (error) {

        console.error(error.message);

    }

});

}