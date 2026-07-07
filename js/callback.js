const params = new URLSearchParams(window.location.search);

const code = params.get("code");

if (code) {

    console.log("Authorization Code:", code);

} else {

    console.log("No authorization code.");

}