// sessionStorage['oldUrls'] = [];

const min = 1;
const max = 2;

const getOldUrls = () => sessionStorage['oldUrls'] ? JSON.parse(sessionStorage['oldUrls']) : [];

const pushOldUrl = (url) => {
    let oldUrls = getOldUrls();
    oldUrls.push(url);
    saveOldUrls(oldUrls);
}

const saveOldUrls = (oldUrls) => sessionStorage['oldUrls'] = JSON.stringify(oldUrls);

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getUsers = (partOfUrl) => Array.from(document.querySelectorAll('a'), a=>a.href).filter((x, i, self) => x.includes(partOfUrl));

const redirect = (oldUrls) => {
    const partOfUrl = '?number=';
    let urls = getUsers(partOfUrl);
    if (oldUrls.length < urls.length) {
        for (const url of urls) {
            if (!oldUrls.includes(url)) {
                pushOldUrl(url);
                location.href = url;
                return true;
            }
        }
    } else {
        scrollBottom();
    }
}

const showUser = () => {
    const home = 'https://with.is/search';
    if (location.href !== home) {
        location.href = home;
        return;
    }
    const oldUrls = getOldUrls();
    if (redirect(oldUrls)) {
        return;
    }
    const located = setInterval(() => {
        if (redirect(oldUrls)) {
            return clearInterval(located);
        }
    }, 1000);
}

setTimeout(() => showUser(), (Math.floor( Math.random() * (max + 1 - min) ) + min) * 1000)
