export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

export function show(id) {
    document.getElementById(id).hidden = false;
}

export function hide(id) {
    document.getElementById(id).hidden = true;
}