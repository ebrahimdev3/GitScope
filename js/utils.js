export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

export function show(id) {

    const element = document.getElementById(id);

    if (element) {
        element.hidden = false;
    }

}

export function hide(id) {

    const element = document.getElementById(id);

    if (element) {
        element.hidden = true;
    }

}
export function showError(message) {

    const error = document.getElementById("error-message");

    if (!error) return;

    error.textContent = message;
    error.hidden = false;

}

export function hideError() {

    const error = document.getElementById("error-message");

    if (!error) return;

    error.hidden = true;
    error.textContent = "";

}
export function showLoading() {

    const loading = document.getElementById("loading");

    if (loading) {

        loading.hidden = false;

    }

}

export function hideLoading() {

    const loading = document.getElementById("loading");

    if (loading) {

        loading.hidden = true;

    }

}