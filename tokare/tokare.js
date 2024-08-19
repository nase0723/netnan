const intervalToSendGood = 1500;
const timeout = 1000;
const scrollInterval = 5000;
const maxScrollCount = 10;
const listUrl = '/search/list';
const indexUrl = '/friend/index';
const chatUrl = '/friend/chat';
const message = '写真の雰囲気すごい好きなので仲良くなりたいです！';

let users;
let scrollCount = 0;

const sendGood = (i) => {
    users[i].click();
    const between500and1500 = 500 + Math.floor(Math.random() * 1000);
    setTimeout(() => {
        const btnGood = Array.from(document.querySelectorAll('a')).filter((el) => el.textContent === 'いいね');
        if (btnGood.length) {
            btnGood[0].click();
        }
    }, between500and1500);
    profile_close(); // 既存メソッド
    let nextUserIndex = i + 1;
    if (nextUserIndex < users.length) {
        setTimeout(() => sendGood(nextUserIndex), intervalToSendGood);
    } else {
        location.href = listUrl;
    }
}

const getUsersToSendGood = async () => {
    const interval = 1000;
    setTimeout(() => {
        const getUsers = () => Array.from(document.querySelectorAll('div')).filter((el) => el.className.includes('user_img'));
        users = getUsers();
        if (users.length) {
            sendGood(0);
        } else {
            getUsersToSendGood();
        }
    }, interval);
}

const scrollBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}

const getChatRooms = () => Array.from(document.querySelectorAll('span')).filter((el) => el.textContent === 'メッセージ交換を始めましょう');

const enterFirstChatRoom = () => {
    let chatRooms = getChatRooms();
    if (chatRooms.length) {
        chatRooms[0].click();
    } else if (scrollCount <= maxScrollCount) {
        scrollBottom();
        scrollCount++;
        setTimeout(() => enterFirstChatRoom(), scrollInterval);
    }
}

const sendFirstMessage = () => {
    const messagesElements = document.getElementById('messages');
    if (!messagesElements.children.length) {
        const textarea = document.getElementById('message_mb4_content');
        const btnSubmit = document.getElementsByName('commit')[0];
        textarea.value = message;
        btnSubmit.click();
    }
    setTimeout(() => {
        location.href = indexUrl;
    }, timeout);
}

// いいね送信
if (location.href.includes(listUrl)) {
    getUsersToSendGood();
}

// 初回メッセージ送信（チャットルームに入る）
if (location.href.includes(indexUrl)) {
    setTimeout(() => enterFirstChatRoom(), timeout);
}

// 初回メッセージ送信
if (location.href.includes(chatUrl)) {
    setTimeout(() => sendFirstMessage(), timeout);
}
