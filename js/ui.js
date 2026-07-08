import { formatDate, formatNumber } from "./utils.js";

export function updateProfile(user) {

    const avatar = document.getElementById("profile-avatar");

    avatar.src = user.avatar_url;

    avatar.hidden = false;

    document.getElementById("profile-name").textContent =
        user.name || "No name";

    document.getElementById("profile-login").textContent =
        `@${user.login}`;

    document.getElementById("profile-bio").textContent =
        user.bio || "No bio available.";
      
    const location = document.getElementById("profile-location");
const company = document.getElementById("profile-company");
const blog = document.getElementById("profile-blog");
blog.href = user.blog
    ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`)
    : "#";
blog.target = "_blank";
blog.rel = "noopener noreferrer";

location.hidden = !user.location;
company.hidden = !user.company;
blog.hidden = !user.blog;

location.textContent = `📍 ${user.location || ""}`;
company.textContent = `🏢 ${user.company || ""}`;
blog.textContent = `🔗 ${user.blog || ""}`;

   

    document.getElementById("repo-count").textContent =
    formatNumber(user.public_repos);

document.getElementById("followers-count").textContent =
    formatNumber(user.followers);

document.getElementById("following-count").textContent =
    formatNumber(user.following);

}

export function updateStatistics(repositories){

    const totalStars = repositories.reduce(

        (total, repo) => total + repo.stargazers_count,

        0

    );

    document.getElementById("stars-count").textContent =
    formatNumber(totalStars);
    const languages = new Set();

    repositories.forEach(repo => {

        if(repo.language){

            languages.add(repo.language);

        }

    });

    document.getElementById("languages-count").textContent =
    formatNumber(languages.size);

}

export function renderRepositories(repositories) {

    const container = document.getElementById("repositories-container");

    container.innerHTML = "";

    if (repositories.length === 0) {

        container.innerHTML = `
            <p>No repositories found.</p>
        `;

        return;

    }

    repositories.forEach(repo => {

    const updated = formatDate(repo.updated_at);
    const card = document.createElement("div");

    card.className = "repository-card";

    card.innerHTML = `

        <h3>${repo.name}</h3>
        <p>
            ${repo.description || "No description available."}
        </p>

        <div class="repository-meta">

            <span>💻 ${repo.language || "Unknown"}</span>

            <span>⭐ ${formatNumber(repo.stargazers_count)}</span>

            <span>🍴 ${formatNumber(repo.forks_count)}</span>

        </div>

        <p class="repository-updated">
            🕒 Updated on ${updated}
        </p>

        <a
            href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer">

            Open on GitHub

        </a>

    `;

    container.appendChild(card);

});

}

export function renderTechStack(repositories) {

    const container = document.getElementById("tech-stack-container");

    container.innerHTML = "";

    const techs = {};

    repositories.forEach(repo => {

        if (!repo.language) return;

        techs[repo.language] =
            (techs[repo.language] || 0) + 1;

    });

    const sorted = Object.entries(techs)
        .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {

        container.innerHTML =
            "<p>No technologies detected.</p>";

        return;

    }

    const fragment = document.createDocumentFragment();

sorted.forEach(([language, count]) => {

    const badge = document.createElement("div");

    badge.className = "tech-badge";

    const percentage = Math.round(
    (count / repositories.length) * 100
);

badge.innerHTML = `
    <div class="tech-header">
        <strong>${language}</strong>
        <span>${percentage}%</span>
    </div>

    <div class="tech-progress">

        <div
            class="tech-progress-bar"
            style="width:${percentage}%">
        </div>

    </div>

    <small>${formatNumber(count)} repositories</small>
`;
    fragment.appendChild(badge);

});

container.appendChild(fragment);
  
}

export function updateDeveloperLevel(score) {

    const level = document.getElementById("developer-level");

    if (!level) return;

    if (score >= 90) {

        level.textContent = "🏆 Elite Developer";

    } else if (score >= 75) {

        level.textContent = "🟢 Advanced Developer";

    } else if (score >= 50) {

        level.textContent = "🟡 Intermediate Developer";

    } else if (score >= 25) {

        level.textContent = "🟠 Beginner Developer";

    } else {

        level.textContent = "🔴 New Developer";

    }

}