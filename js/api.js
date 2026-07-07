const BASE_URL = "https://api.github.com/users";

export async function getUser(username) {

    const response = await fetch(`${BASE_URL}/${username}`);

    if (!response.ok) {
        throw new Error("User not found");
    }

    return await response.json();

}

export async function getRepositories(username) {

    const response = await fetch(
        `${BASE_URL}/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
        throw new Error("Repositories not found");
    }

    return await response.json();

}