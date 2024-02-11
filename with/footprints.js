// sessionStorage['oldIds'] = [];
// sessionStorage['ids'] = [];

const baseUrl = 'https://with.is';
const homeUrl = baseUrl + '/search';
const userUrl = baseUrl + '/users';
const maxArraySavedCount = 3000;
const min = 5;
const max = 10;

const getIdsFromSession = (key) => sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];

const pushIdToSession = (key, id) => {
    let ids = getIdsFromSession(key);
    ids.push(id);
    saveIdsToSession(key, ids);
}

const removeIdFromSession = (key, value) => {
    let ids = getIdsFromSession(key);
    ids = ids.filter((id) => !(id === value));
    saveIdsToSession(key, ids);
}

const saveIdsToSession = (key, values) => sessionStorage[key] = JSON.stringify(values);

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getUsers = (partOfUrl) => {
    const urls = Array.from(document.querySelectorAll('a'), a=>a.href).filter((x, i, self) => x.includes(partOfUrl))
    return urls.map((url) => {
        url = url.split('?')[0];
        const userId = url.replace(userUrl + '/', '');
        return Number(userId);
    });
};

const redirectToUserPage = (userId) => {
    const url = userUrl + '/' + String(userId);
    location.href = url;
}

const redirect = (ids, oldIds) => {
    console.log('id count '+ids.length);
    console.log('oldIds count  '+oldIds.length);
    for (const id of ids) {
        if (!oldIds.includes(id)) {
            pushIdToSession('oldIds', id);
            removeIdFromSession('ids', id);
            redirectToUserPage(id);
            return true;
        }
    }
    return false;
}

const redirectToHome = () => {
    if (location.href !== homeUrl) {
        location.href = homeUrl;
        return;
    }
}

const showUser = () => {
    const ids = getIdsFromSession('ids');
    const oldIds = getIdsFromSession('oldIds');
    if (redirect(ids, oldIds)) {
        return true;
    }
    const located = setInterval(() => {
        if (redirect(ids, oldIds)) {
            return clearInterval(located);
        }
        if (maxArraySavedCount < oldIds.length) {
            sessionStorage['oldIds'] = [];
        }
        sessionStorage['ids'] = [];
        redirectToHome();
        scrollBottom();
        const users = getUsers('?number=');
        saveIdsToSession('ids', users);
    }, 1000);
}

setTimeout(() => showUser(), (Math.floor( Math.random() * (max + 1 - min) ) + min) * 100)
