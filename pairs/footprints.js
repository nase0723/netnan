let i = 0;
let j = 0;
let users = [];
const maxViewedCount = 1000;
const maxWaitingCount = 10;
const min = 1;
const max = 3;

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getUsers = () => Array.from(document.querySelectorAll('a'), a=>a.href).filter((x, i, self) => x.includes('search/all/partner'));

const redirectToHomeIfReached = (count, maxCount) => {
    if (maxCount < count) {
        clearInterval(interval);
        location.href = 'https://pairs.lv/';
    }
}

const showUser = () => {
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

const interval = setInterval(() => showUser(), 1500);