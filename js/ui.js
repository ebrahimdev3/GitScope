// --- أدوات مساعدة (من ملف utils.js القديم) ---
export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

export function toggleElement(id, shouldShow) {
    const element = document.getElementById(id);
    if (element) {
        if (shouldShow) element.removeAttribute("hidden");
        else element.setAttribute("hidden", "true");
    }
}

export function toggleError(message = "", isVisible = false) {
    const error = document.getElementById("error-message");
    if (!error) return;
    error.textContent = message;
    if (isVisible) error.removeAttribute("hidden");
    else error.setAttribute("hidden", "true");
}

// --- إدارة الرسم البياني (من ملف charts.js القديم) ---
let languageChart = null;
let starsChart = null;

export function renderCharts(repositories) {
    const container = document.getElementById("charts-container");
    if (!container) return;

    container.innerHTML = `
        <div class="chart-card">
            <h3>Languages Distribution</h3>
            <canvas id="languages-chart"></canvas>
        </div>
        <div class="chart-card">
            <h3>Top Starred Repositories</h3>
            <canvas id="stars-chart"></canvas>
        </div>
    `;

    const languages = {};
    repositories.forEach(repo => {
        if (!repo.language) return;
        languages[repo.language] = (languages[repo.language] || 0) + 1;
    });

    if (languageChart) languageChart.destroy();
    languageChart = new Chart(document.getElementById("languages-chart"), {
        type: "pie",
        data: {
            labels: Object.keys(languages),
            datasets: [{ data: Object.values(languages) }]
        }
    });

    const topRepos = [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    if (starsChart) starsChart.destroy();
    starsChart = new Chart(document.getElementById("stars-chart"), {
        type: "bar",
        data: {
            labels: topRepos.map(repo => repo.name),
            datasets: [{
                label: "Stars",
                data: topRepos.map(repo => repo.stargazers_count)
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

// --- تحديث عناصر الواجهة الفردية ---
export function updateProfile(user) {
    const avatar = document.getElementById("profile-avatar");
    if (avatar) {
        avatar.src = user.avatar_url;
        avatar.removeAttribute("hidden");
    }

    document.getElementById("profile-name").textContent = user.name || "No name";
    document.getElementById("profile-login").textContent = `@${user.login}`;
    document.getElementById("profile-bio").textContent = user.bio || "No bio available.";
      
    const location = document.getElementById("profile-location");
    const company = document.getElementById("profile-company");
    const blog = document.getElementById("profile-blog");

    if (blog) {
        blog.href = user.blog ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`) : "#";
        blog.target = "_blank";
        blog.rel = "noopener noreferrer";
        if (!user.blog) blog.setAttribute("hidden", "true");
        else {
            blog.removeAttribute("hidden");
            blog.textContent = `🔗 ${user.blog}`;
        }
    }

    if (location) {
        if (!user.location) location.setAttribute("hidden", "true");
        else {
            location.removeAttribute("hidden");
            location.textContent = `📍 ${user.location}`;
        }
    }

    if (company) {
        if (!user.company) company.setAttribute("hidden", "true");
        else {
            company.removeAttribute("hidden");
            company.textContent = `🏢 ${user.company}`;
        }
    }

    document.getElementById("repo-count").textContent = formatNumber(user.public_repos);
    document.getElementById("followers-count").textContent = formatNumber(user.followers);
    document.getElementById("following-count").textContent = formatNumber(user.following);
}

export function updateStatistics(repositories) {
    const totalStars = repositories.reduce((total, repo) => total + repo.stargazers_count, 0);
    document.getElementById("stars-count").textContent = formatNumber(totalStars);
    
    const languages = new Set();
    repositories.forEach(repo => {
        if (repo.language) languages.add(repo.language);
    });
    document.getElementById("languages-count").textContent = formatNumber(languages.size);
}

export function renderRepositories(repositories) {
    const container = document.getElementById("repositories-container");
    if (!container) return;
    container.innerHTML = "";

    if (repositories.length === 0) {
        container.innerHTML = `<p>No repositories found.</p>`;
        return;
    }

    repositories.forEach(repo => {
        const card = document.createElement("div");
        card.className = "repository-card";
        card.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available."}</p>
            <div class="repository-meta">
                <span>💻 ${repo.language || "Unknown"}</span>
                <span>⭐ ${formatNumber(repo.stargazers_count)}</span>
                <span>🍴 ${formatNumber(repo.forks_count)}</span>
                <span>👀 ${formatNumber(repo.watchers_count)}</span>
                <span>🐞 ${formatNumber(repo.open_issues_count)}</span>
            </div>
            <div class="repository-timeline">
                <span>📅 Created: ${formatDate(repo.created_at)}</span>
                <span>🕒 Updated: ${formatDate(repo.updated_at)}</span>
                <span>🌿 ${repo.default_branch}</span>
                <span>${repo.archived ? "📦 Archived" : "🟢 Active"}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Open on GitHub</a>
        `;
        container.appendChild(card);
    });
}

export function renderTechStack(repositories) {
    const container = document.getElementById("tech-stack-container");
    if (!container) return;
    container.innerHTML = "";

    const techs = {};
    const frameworkKeywords = ["react", "next", "vue", "angular", "express", "fastapi", "django", "flask", "laravel", "tailwind", "bootstrap", "docker"];

    repositories.forEach(repo => {
        const text = `${repo.name || ""} ${repo.description || ""}`.toLowerCase();
        frameworkKeywords.forEach(kw => {
            if (text.includes(kw)) {
                const key = kw === "next" ? "Next.js" : kw === "tailwind" ? "TailwindCSS" : kw.charAt(0).toUpperCase() + kw.slice(1);
                techs[key] = (techs[key] || 0) + 1;
            }
        });

        if (repo.language) {
            techs[repo.language] = (techs[repo.language] || 0) + 1;
        }
    });

    const total = Object.values(techs).reduce((sum, v) => sum + v, 0) || 1;
    const sorted = Object.entries(techs).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        container.innerHTML = "<p>No technologies detected.</p>";
        return;
    }

    const fragment = document.createDocumentFragment();
    sorted.forEach(([tech, count]) => {
        const badge = document.createElement("div");
        badge.className = "tech-badge";
        const percentage = Math.round((count / total) * 100);

        badge.innerHTML = `
            <div class="tech-header">
                <strong>${tech}</strong>
                <span>${percentage}%</span>
            </div>
            <div class="tech-progress">
                <div class="tech-progress-bar" style="width:${percentage}%"></div>
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

    if (score >= 90) level.textContent = "🏆 Elite Developer";
    else if (score >= 75) level.textContent = "🟢 Advanced Developer";
    else if (score >= 50) level.textContent = "🟡 Intermediate Developer";
    else if (score >= 25) level.textContent = "🟠 Beginner Developer";
    else level.textContent = "🔴 New Developer";
}
