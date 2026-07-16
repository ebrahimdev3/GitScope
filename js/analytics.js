export function calculateDeveloperScore(user, repositories) {
    let score = 0;

    // Repositories (Max 20)
    score += Math.min(user.public_repos, 20);

    // Followers (Max 20)
    score += Math.min(user.followers / 5, 20);

    // Stars (Max 20)
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    score += Math.min(totalStars / 10, 20);

    // Languages (Max 15)
    const languages = new Set();
    repositories.forEach(repo => {
        if (repo.language) languages.add(repo.language);
    });
    score += Math.min(languages.size * 2, 15);

    // Recent Activity in the last 12 months (Max 15)
    const activeRepos = repositories.filter(repo => {
        const updated = new Date(repo.updated_at);
        const months = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return months <= 12;
    });
    score += Math.min(activeRepos.length, 15);

    // Profile Completeness (Max 10)
    if (user.bio) score += 2;
    if (user.blog) score += 2;
    if (user.company) score += 2;
    if (user.location) score += 2;
    if (user.avatar_url) score += 2;

    return Math.round(Math.min(score, 100));
}
