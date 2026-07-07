export function calculateDeveloperScore(user, repositories) {

    let score = 0;

    score += Math.min(user.public_repos, 30);

    score += Math.min(user.followers, 25);

    const stars = repositories.reduce(
        (total, repo) => total + repo.stargazers_count,
        0
    );

    score += Math.min(stars, 25);

    const languages = new Set();

    repositories.forEach(repo => {
        if (repo.language) {
            languages.add(repo.language);
        }
    });

    score += Math.min(languages.size * 2, 20);

    return Math.min(score, 100);

}