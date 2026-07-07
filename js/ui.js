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
blog.href = user.blog || "#";

location.textContent = user.location ? `📍 ${user.location}` : "";
company.textContent = user.company ? `🏢 ${user.company}` : "";
blog.textContent = user.blog ? `🔗 ${user.blog}` : "";

   

    document.getElementById("repo-count").textContent =
        user.public_repos;

    document.getElementById("followers-count").textContent =
        user.followers;

    document.getElementById("following-count").textContent =
        user.following;

}

export function updateStatistics(repositories){

    const totalStars = repositories.reduce(

        (total, repo) => total + repo.stargazers_count,

        0

    );

    document.getElementById("stars-count").textContent = totalStars;

    const languages = new Set();

    repositories.forEach(repo => {

        if(repo.language){

            languages.add(repo.language);

        }

    });

    document.getElementById("languages-count").textContent =
        languages.size;

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

    const updated = new Date(repo.updated_at)
        .toLocaleDateString();

    const card = document.createElement("div");

    card.className = "repository-card";

    card.innerHTML = `

        <h3>${repo.name}</h3>

        <p>
            ${repo.description || "No description available."}
        </p>

        <div class="repository-meta">

            <span>💻 ${repo.language || "Unknown"}</span>

            <span>⭐ ${repo.stargazers_count}</span>

            <span>🍴 ${repo.forks_count}</span>

        </div>

        <p class="repository-updated">
            Updated: ${updated}
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