const CLIENT_ID = "Ov23li0SImFBl0XuYcqz";

const REDIRECT_URI = "http://localhost:8158/callback.html";

const SCOPES = "read:user public_repo";

export function loginWithGitHub() {

    const url =
        "https://github.com/login/oauth/authorize" +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(SCOPES)}`;

    window.location.href = url;

}