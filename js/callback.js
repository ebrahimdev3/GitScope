const params = new URLSearchParams(window.location.search);

const code = params.get("code");

if (!code) {

    alert("GitHub login failed.");

    window.location.href = "index.html";

}

try {

    const response = await fetch(
        "http://127.0.0.1:8000/auth/github",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        }
    );

    if (!response.ok) {

        throw new Error("Authentication failed.");

    }

    const data = await response.json();

    localStorage.setItem(
        "github-access-token",
        data.access_token
    );

    window.location.href = "index.html";

} catch (error) {

    console.error(error);

    alert(error.message);

    window.location.href = "index.html";

}