const BASE_URL = "https://api.github.com";

// استرجاع توكن التوثيق من التخزين المحلي
export function getAccessToken() {
    return localStorage.getItem("github-access-token");
}

// بناء ترويسة الطلب الموحدة لقواعد بيانات GitHub
function getHeaders() {
    const accessToken = getAccessToken();
    const headers = {
        Accept: "application/vnd.github+json"
    };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

// جلب بيانات أي مستخدم
export async function getUser(username) {
    const url = username ? `${BASE_URL}/users/${username}` : `${BASE_URL}/user`;
    const response = await fetch(url, { headers: getHeaders() });

    if (response.status === 404) throw new Error("User not found");
    if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please sign in with GitHub.");
    }
    if (!response.ok) throw new Error("Something went wrong.");
    return await response.json();
}

// جلب مستودعات المستخدم
export async function getRepositories(username) {
    const response = await fetch(
        `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`,
        { headers: getHeaders() }
    );

    if (response.status === 404) throw new Error("Repositories not found");
    if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please sign in with GitHub.");
    }
    if (!response.ok) throw new Error("Something went wrong.");
    return await response.json();
}

// توثيق الحساب والدخول عبر GitHub (من ملف auth.js القديم)
const CLIENT_ID = "Ov23li0SImFBl0XuYcqz";
const REDIRECT_URI = "http://localhost:8158/callback.html";
const SCOPES = "read:user public_repo";

export function loginWithGitHub() {
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = url;
}
