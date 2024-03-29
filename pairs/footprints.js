let i = 0;
let j = 0;
let users = [];
const maxViewedCount = 1000;
const maxWaitingCount = 10;
const min = 1;
const max = 3;
const baseUrl = 'https://pairs.lv/search/all';

const getUrlQueries = () => {
    let queryStr = window.location.search.slice(1);
    let queries = {};
    if (!queryStr) {
        return queries;
    }
    queryStr.split('&').forEach(queryStr => {
        let queryArr = queryStr.split('=');
        queries[queryArr[0]] = queryArr[1];
    });
    return queries;
}

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getUsers = () => Array.from(document.querySelectorAll('a')).filter((el) => el.href.includes('search/all/partner'));

const redirectToHomeIfReached = (count, maxCount) => {
    if (maxCount < count) {
        clearInterval(running);
        location.href = baseUrl + '?interval=' + interval;
    }
}

const showUser = () => {
    if (!location.href.includes(baseUrl)) {
        return;
    }
    if (i < users.length) {
        setTimeout(() => users[i].click(), (Math.floor( Math.random() * (max + 1 - min) ) + min) * 1000);
        i++;
        console.log('合計:' + i);
        j = 0;
        redirectToHomeIfReached(i, maxViewedCount);
    } else {
        users = getUsers();
        if (i !== 0) {
            scrollBottom();
        }
        j++;
        redirectToHomeIfReached(j, maxWaitingCount);
    }
}


const interval = getUrlQueries().interval ?? 1500;
const running = setInterval(() => showUser(), interval);