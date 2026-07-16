const KEY = "gitscope-history";

export function getSearchHistory() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveSearch(username) {
    let history = getSearchHistory();
    history = history.filter(name => name !== username);
    history.unshift(username);
    history = history.slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify(history));
}

export function renderSearchHistory() {
    const container = document.getElementById("recent-searches");
    const clearButton = document.getElementById("clear-history");
    if (!container) return;

    container.innerHTML = "";
    const history = getSearchHistory();

    history.forEach(username => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quick-user";
        button.textContent = username;
        container.appendChild(button);
    });

    if (clearButton) {
        if (history.length === 0) clearButton.setAttribute("hidden", "true");
        else clearButton.removeAttribute("hidden");
    }
}

export function clearSearchHistory() {
    localStorage.removeItem(KEY);
    renderSearchHistory();
}
