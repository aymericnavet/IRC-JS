const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Recuperer l'username et les channels par l'url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//message venant du serv
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll automatique
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//rejoindre le chat
socket.emit('joinRoom', {username, room});

//Recupere les rooms et users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//message envoyé
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //recupere le message
    const msg = e.target.elements.msg.value;

    //envoie le message au serveur
    socket.emit('chatMessage', msg);

    //Vider l'input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//message sortant vers DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//ajouter les nom des room dans le DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//ajoute l'user dans DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}