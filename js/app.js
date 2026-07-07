import { getUser, getRepositories } from "./api.js";

import {
    updateProfile,
    updateStatistics,
    renderRepositories
} from "./ui.js";


const form = document.getElementById("search-form");
const input = document.getElementById("username");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = input.value.trim();

    if (!username) return;

    try {

        const user = await getUser(username);

        const repos = await getRepositories(username);

        updateProfile(user);

        updateStatistics(repos);
      
        renderRepositories(repos);
      
document.getElementById("empty-state").hidden = true;

document.getElementById("results").hidden = false;        

        console.log(user);

        console.log(repos);

    } catch (error) {

        console.error(error.message);

    }

});