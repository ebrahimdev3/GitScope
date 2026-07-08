let languageChart = null;
let starsChart = null;

export function renderCharts(repositories) {

    const container = document.getElementById("charts-container");

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

    /* ---------- Languages ---------- */

    const languages = {};

    repositories.forEach(repo => {

        if (!repo.language) return;

        languages[repo.language] =
            (languages[repo.language] || 0) + 1;

    });

    if (languageChart) languageChart.destroy();

    languageChart = new Chart(
        document.getElementById("languages-chart"),
        {
            type: "pie",
            data: {
                labels: Object.keys(languages),
                datasets: [{
                    data: Object.values(languages)
                }]
            }
        }
    );

    /* ---------- Stars ---------- */

    const topRepos = [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    if (starsChart) starsChart.destroy();

    starsChart = new Chart(
        document.getElementById("stars-chart"),
        {
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
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );

}