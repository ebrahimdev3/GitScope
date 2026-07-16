import { getUser, getRepositories, loginWithGitHub, getAccessToken } from "./api.js";
import {
    updateProfile,
    updateStatistics,
    renderRepositories,
    renderTechStack,
    updateDeveloperLevel,
    renderCharts,
    toggleElement,
    toggleError
} from "./ui.js";
import { saveSearch, renderSearchHistory, clearSearchHistory } from "./history.js";
import { calculateDeveloperScore } from "./analytics.js";

const form = document.getElementById("search-form");
const input = document.getElementById("username");
const githubLogin = document.getElementById("github-login");
const quickSearch = document.getElementById("quick-search");
const clearHistoryButton = document.getElementById("clear-history");
const searchButton = document.getElementById("search-button");

let authenticatedUser = null;
let isSearching = false;

// دمج جلب بيانات حساب التوثيق لـ GitHub
async function loadGitHubUser() {
    const token = getAccessToken();
    if (!token) return;

    try {
        const user = await getUser(); // استدعاء فارغ يحضر الحساب الشخصي من api.js
        authenticatedUser = user;

        const userBox = document.getElementById("github-user");
        const avatar = document.getElementById("github-user-avatar");
        const name = document.getElementById("github-user-name");

        if (githubLogin) githubLogin.hidden = true;

        if (userBox) {
            userBox.removeAttribute("hidden");
            userBox.style.cursor = "pointer";
            userBox.addEventListener("click", () => {
                window.location.href = "profile.html";
            });
        }

        if (avatar) avatar.src = user.avatar_url;
        if (name) name.textContent = user.name || user.login;

    } catch (error) {
        console.error("Failed to load authenticated user:", error);
    }
}

// السجل السريع لعمليات البحث الأخيرة
if (quickSearch && input) {
    input.addEventListener("focus", () => quickSearch.classList.remove("hidden"));
    
    document.addEventListener("click", (e) => {
        if (!quickSearch.contains(e.target) && e.target !== input) {
            quickSearch.classList.add("hidden");
        }
    });

    quickSearch.addEventListener("click", (e) => {
        const button = e.target.closest(".quick-user");
        if (!button) return;
        input.value = button.textContent.trim();
        quickSearch.classList.add("hidden");
        form?.requestSubmit();
    });
}

if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", () => clearSearchHistory());
}

if (githubLogin) {
    githubLogin.addEventListener("click", () => loginWithGitHub());
}

// معالج البحث الأساسي
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = input.value.trim();
        if (!username || isSearching) return;

        isSearching = true;
        try {
            toggleError("", false);
            toggleElement("loading", true);
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

            const profileAvatar = document.getElementById("profile-avatar");
            if (profileAvatar) {
                profileAvatar.style.cursor = "pointer";
                profileAvatar.onclick = () => window.open(user.html_url, "_blank");
            }

            const ownProfile = authenticatedUser && authenticatedUser.login.toLowerCase() === user.login.toLowerCase();
            const ownProfileBadge = document.getElementById("own-profile");
            if (ownProfileBadge) {
                if (ownProfile) ownProfileBadge.removeAttribute("hidden");
                else ownProfileBadge.setAttribute("hidden", "true");
            }

            updateStatistics(repos);
            const score = calculateDeveloperScore(user, repos);

            const scoreElement = document.getElementById("developer-score");
            if (scoreElement) scoreElement.textContent = `${score}/100`;

            updateDeveloperLevel(score);
            renderRepositories(repos);
            renderTechStack(repos);
            renderCharts(repos);

            toggleElement("loading", false);
            if (searchButton) {
                searchButton.disabled = false;
                searchButton.textContent = "🔍 Analyze";
            }
            isSearching = false;

            toggleElement("empty-state", false);
            toggleElement("results", true);

        } catch (error) {
            toggleElement("loading", false);
            if (searchButton) {
                searchButton.disabled = false;
                searchButton.textContent = "🔍 Analyze";
            }
            isSearching = false;
            console.error(error);
            toggleError(error.message, true);
            input.focus();
        }
    });
}

// مقارنة المستخدمين
const compareButton = document.getElementById("compare-button");
if (compareButton) {
    compareButton.addEventListener("click", compareUsers);
}

const compareInputs = [
    document.getElementById("compare-user-1"),
    document.getElementById("compare-user-2")
];

compareInputs.forEach(inp => {
    inp?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            compareUsers();
        }
    });
});

async function compareUsers() {
    const username1 = document.getElementById("compare-user-1").value.trim();
    const username2 = document.getElementById("compare-user-2").value.trim();

    if (!username1 || !username2) {
        alert("Enter both usernames.");
        return;
    }

    try {
        const [user1, user2, repos1, repos2] = await Promise.all([
            getUser(username1),
            getUser(username2),
            getRepositories(username1),
            getRepositories(username2)
        ]);

        const score1 = calculateDeveloperScore(user1, repos1);
        const score2 = calculateDeveloperScore(user2, repos2);

        const stars1 = repos1.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const stars2 = repos2.reduce((sum, repo) => sum + repo.stargazers_count, 0);

        const languages1 = {};
        const languages2 = {};

        repos1.forEach(repo => {
            if (repo.language) languages1[repo.language] = (languages1[repo.language] || 0) + 1;
        });

        repos2.forEach(repo => {
            if (repo.language) languages2[repo.language] = (languages2[repo.language] || 0) + 1;
        });

        const topLanguage1 = Object.entries(languages1).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
        const topLanguage2 = Object.entries(languages2).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

        let wins1 = 0;
        let wins2 = 0;

        function winner(value1, value2, name1, name2) {
            if (value1 > value2) { wins1++; return `🏆 ${name1}`; }
            if (value2 > value1) { wins2++; return `🏆 ${name2}`; }
            return "🤝 Draw";
        }

        const compareResults = document.getElementById("compare-results");
        const compareContent = document.getElementById("compare-content");

        compareResults.removeAttribute("hidden");

        compareContent.innerHTML = `
            <div class="compare-header">
                <div class="compare-profile">
                    <img src="${user1.avatar_url}" alt="${user1.login}">
                    <h3>${user1.login}</h3>
                    <p>${user1.name ?? ""}</p>
                </div>
                <div class="vs">VS</div>
                <div class="compare-profile">
                    <img src="${user2.avatar_url}" alt="${user2.login}">
                    <h3>${user2.login}</h3>
                    <p>${user2.name ?? ""}</p>
                </div>
            </div>
            <table class="compare-table">
                <tr><th>Category</th><th>${user1.login}</th><th>${user2.login}</th><th>Winner</th></tr>
                <tr><td>Repositories</td><td>${user1.public_repos}</td><td>${user2.public_repos}</td><td>${winner(user1.public_repos, user2.public_repos, user1.login, user2.login)}</td></tr>
                <tr><td>Followers</td><td>${user1.followers}</td><td>${user2.followers}</td><td>${winner(user1.followers, user2.followers, user1.login, user2.login)}</td></tr>
                <tr><td>Total Stars</td><td>${stars1}</td><td>${stars2}</td><td>${winner(stars1, stars2, user1.login, user2.login)}</td></tr>
                <tr><td>Developer Score</td><td>${score1}</td><td>${score2}</td><td>${winner(score1, score2, user1.login, user2.login)}</td></tr>
                <tr><td>Top Language</td><td>${topLanguage1}</td><td>${topLanguage2}</td><td>${topLanguage1 === topLanguage2 ? "🤝 Same" : "-"}</td></tr>
                <tr><td>Public Gists</td><td>${user1.public_gists}</td><td>${user2.public_gists}</td><td>${winner(user1.public_gists, user2.public_gists, user1.login, user2.login)}</td></tr>
            </table>
            <div class="overall-winner">
                <h2>${wins1 > wins2 ? `🏆 Overall Winner: ${user1.login}` : wins2 > wins1 ? `🏆 Overall Winner: ${user2.login}` : "🤝 Overall Result: Draw"}</h2>
                <p>${wins1} - ${wins2}</p>
            </div>
        `;

        compareResults.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// التهيئة عند تحميل الصفحة
renderSearchHistory();
loadGitHubUser();

const autoAnalyze = localStorage.getItem("analyze-user");
if (autoAnalyze && form) {
    input.value = autoAnalyze;
    localStorage.removeItem("analyze-user");
    form.requestSubmit();
}
