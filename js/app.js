import { 
    getUser,
    getRepositories,
} from "./api.js";
import {
    updateProfile,
    updateStatistics,
    renderRepositories,
    renderTechStack,
    updateDeveloperLevel
} from "./ui.js";
import { loginWithGitHub } from "./auth.js";
import {
    show,
    hide,
    showError,
    hideError,
    showLoading,
    hideLoading
} from "./utils.js";
import { calculateDeveloperScore } from "./analytics.js";
import { renderCharts } from "./charts.js";
import {
    saveSearch,
    renderSearchHistory,
    clearSearchHistory
} from "./history.js";

const searchButton = document.getElementById("search-button");
const form = document.getElementById("search-form");
const input = document.getElementById("username");
const githubLogin = document.getElementById("github-login");
const quickSearch = document.getElementById("quick-search");
const clearHistoryButton = document.getElementById("clear-history");

let authenticatedUser = null;

async function loadGitHubUser() {

    const token =
        localStorage.getItem("github-access-token");

    if (!token) return;

    try {

        const response = await fetch(

            "https://api.github.com/user",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        if (!response.ok) return;

        const user = await response.json();
        authenticatedUser = user;

        const userBox =
            document.getElementById("github-user");

        const avatar =
            document.getElementById("github-user-avatar");

        const name =
            document.getElementById("github-user-name");

        if (githubLogin) {

    githubLogin.hidden = true;

        }


        if (userBox) {

            userBox.hidden = false;

        }

        if (avatar) {

            avatar.src = user.avatar_url;

        }

        if (name) {

            name.textContent =
                user.name || user.login;

        }

    } catch (error) {

        console.error(error);

    }

}

let isSearching = false;
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

    quickSearch.addEventListener("click", (event) => {

    const button = event.target.closest(".quick-user");

    if (!button) return;

    input.value = button.textContent.trim();

    quickSearch.classList.add("hidden");

    form?.requestSubmit();

});
  
}

if (clearHistoryButton) {

    clearHistoryButton.addEventListener("click", () => {

        clearSearchHistory();

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

    if (isSearching) return;

    isSearching = true;

    try {
      hideError();
      showLoading();
      if (searchButton) {
        searchButton.disabled = true;
        searchButton.textContent = "⏳ Analyzing...";
      }

        const user = await getUser(username);
        const repos = await getRepositories(username);

        saveSearch(username);
        renderSearchHistory();

        input.blur();
        updateProfile(user);
        const ownProfile =
    authenticatedUser &&
    authenticatedUser.login.toLowerCase() ===
    user.login.toLowerCase();

const ownProfileBadge =
    document.getElementById("own-profile");

if (ownProfileBadge) {

    ownProfileBadge.hidden = !ownProfile;

}
        updateStatistics(repos);

        const score = calculateDeveloperScore(user, repos);

        const scoreElement = document.getElementById("developer-score");

if (scoreElement) {
    scoreElement.textContent = `${score}/100`;
}  
    updateDeveloperLevel(score);
        
        renderRepositories(repos);
        renderTechStack(repos);
        renderCharts(repos);
      
        hideLoading();
      
        if (searchButton) {
    searchButton.disabled = false;
    searchButton.textContent = "🔍 Analyze";
        }
      
        isSearching = false;
      
        hide("empty-state");
        show("results");

    } catch (error) {
      
        hideLoading();

      if (searchButton) {
        searchButton.disabled = false;
        searchButton.textContent = "🔍 Analyze";
      }

       isSearching = false;

        console.error(error);

        showError(error.message);
        
        input.focus();
    }
  

});

}
renderSearchHistory();
loadGitHubUser();