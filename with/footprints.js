// sessionStorage['oldUrls'] = [];
// sessionStorage['urls'] = [];

// const maxArraySavedCount = 3000;
const maxArraySavedCount = 30;
const min = 5;
const max = 10;

const getUrlsFromSession = (key) => sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];

const pushUrlToSession = (key, url) => {
    let urls = getUrlsFromSession(key);
    urls.push(url);
    saveUrlsToSession(key, urls);
}

const removeUrlFromSession = (key, value) => {
    let urls = getUrlsFromSession(key);
    urls = urls.filter((url) => !(url === value));
    saveUrlsToSession(key, urls);
}

const saveUrlsToSession = (key, values) => sessionStorage[key] = JSON.stringify(values);

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getUsers = (partOfUrl) => Array.from(document.querySelectorAll('a'), a=>a.href).filter((x, i, self) => x.includes(partOfUrl));


const redirect = (urls, oldUrls) => {
    console.log('urls '+urls.length);
    console.log('oldUrls '+oldUrls.length);
    for (const url of urls) {
        if (!oldUrls.includes(url)) {
            pushUrlToSession('oldUrls', url);
            removeUrlFromSession('urls', url);
            location.href = url;
            return true;
        }
    }
    return false;
}

const redirectToHome = () => {
    const home = 'https://with.is/search';
    if (location.href !== home) {
        location.href = home;
        return;
    }
}

const showUser = () => {
    const urls = getUrlsFromSession('urls');
    const oldUrls = getUrlsFromSession('oldUrls');
    if (redirect(urls, oldUrls)) {
        return true;
    }
    const located = setInterval(() => {
        if (redirect(urls, oldUrls)) {
            return clearInterval(located);
        }
        if (maxArraySavedCount < oldUrls.length) {
            sessionStorage['oldUrls'] = [];
        }
        sessionStorage['urls'] = [];
        redirectToHome();
        scrollBottom();
        const users = getUsers('?number=');
        saveUrlsToSession('urls', users);
    }, 1000);
}

setTimeout(() => showUser(), (Math.floor( Math.random() * (max + 1 - min) ) + min) * 100)
