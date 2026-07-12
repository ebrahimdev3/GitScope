const BASE_URL = "https://api.github.com/users";
function getHeaders() {

    const accessToken =
        localStorage.getItem("github-access-token");

    const headers = {
        Accept: "application/vnd.github+json"
    };

    if (accessToken) {

        headers.Authorization =
            `Bearer ${accessToken}`;

    }

    return headers;

}

export async function getUser(username) {

    const response = await fetch(

        `${BASE_URL}/${username}`,

        {
            headers: getHeaders()
        }

    );

    if (response.status === 404) {
        throw new Error("User not found");
    }

    if (response.status === 403) {
        throw new Error(
            "GitHub API rate limit exceeded. Please try again later or sign in with GitHub."
        );
    }

    if (!response.ok) {
        throw new Error("Something went wrong.");
    }

    return await response.json();

}

export async function getRepositories(username) {

    const response = await fetch(

        `${BASE_URL}/${username}/repos?per_page=100&sort=updated`,

        {
            headers: getHeaders()
        }

    );

    if (response.status === 404) {
        throw new Error("Repositories not found");
    }

    if (response.status === 403) {
        throw new Error(
            "GitHub API rate limit exceeded. Please try again later or sign in with GitHub."
        );
    }

    if (!response.ok) {
        throw new Error("Something went wrong.");
    }

    return await response.json();

}

