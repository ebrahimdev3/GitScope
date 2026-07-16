import { getUser, getAccessToken } from "./api.js";

async function loadProfile() {  
    const token = getAccessToken();  
    if (!token) {  
        window.location.replace("index.html");  
        return;  
    }  
  
    try {  
        const authenticatedUser = await getUser(); // جلب المستخدم الحالي تلقائياً من api.js
  
        const backButton = document.getElementById("back-button");  
        if (backButton) {  
            backButton.addEventListener("click", () => {  
                window.location.href = "index.html";  
            });  
        }  
  
        document.getElementById("account-gists").textContent = authenticatedUser.public_gists;  
        
        const avatar = document.getElementById("account-avatar");  
        if (avatar) {
            avatar.src = authenticatedUser.avatar_url;  
            avatar.style.cursor = "pointer";  
            avatar.onclick = () => window.open(authenticatedUser.html_url, "_blank");  
        }
  
        document.getElementById("account-name").textContent = authenticatedUser.name || authenticatedUser.login;  
        document.getElementById("account-login").textContent = `@${authenticatedUser.login}`;  
  
        const bio = document.getElementById("account-bio");  
        if (bio) bio.textContent = authenticatedUser.bio || "No bio";  
  
        const location = document.getElementById("account-location");  
        if (location) {
            if (authenticatedUser.location) location.textContent = `📍 ${authenticatedUser.location}`;  
            else location.style.display = "none";  
        }
  
        const company = document.getElementById("account-company");  
        if (company) {
            if (authenticatedUser.company) company.textContent = `🏢 ${authenticatedUser.company}`;  
            else company.style.display = "none";  
        }
        
        const blog = document.getElementById("account-blog");  
        if (blog) {
            if (authenticatedUser.blog) {  
                let url = authenticatedUser.blog;  
                if (!url.startsWith("http")) url = "https://" + url;  
                blog.href = url;  
                blog.textContent = `🌐 ${new URL(url).hostname}`;  
            } else {  
                blog.style.display = "none";  
            }  
        }
  
        const joined = new Date(authenticatedUser.created_at);  
        document.getElementById("account-created").textContent = `📅Joined ${joined.toLocaleDateString("en-US", {  
            day: "numeric",  
            month: "long",  
            year: "numeric"  
        })}`;  
  
        document.getElementById("account-repos").textContent = authenticatedUser.public_repos;  
        document.getElementById("account-followers").textContent = authenticatedUser.followers;  
        document.getElementById("account-following").textContent = authenticatedUser.following;  
        
        const githubLink = document.getElementById("account-github-link");
        if (githubLink) githubLink.href = authenticatedUser.html_url;  

        const logoutButton = document.getElementById("logout-button");  
        if (logoutButton) {  
            logoutButton.addEventListener("click", () => {  
                localStorage.removeItem("github-access-token");  
                window.location.href = "index.html";  
            });  
        }     
        
        const analyzeButton = document.getElementById("analyze-my-profile");  
        if (analyzeButton) {  
            analyzeButton.addEventListener("click", () => {  
                localStorage.setItem("analyze-user", authenticatedUser.login);  
                window.location.href = "index.html";  
            });  
        }  

        const loading = document.getElementById("profile-loading");  
        const profilePage = document.querySelector(".profile-page");  
  
        if (loading) loading.setAttribute("hidden", "true");  
        if (profilePage) profilePage.removeAttribute("hidden");  
  
    } catch (error) {  
        console.error(error);  
        window.location.replace("index.html");  
    }  
}  
  
loadProfile();
