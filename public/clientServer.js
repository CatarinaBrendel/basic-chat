const socket = io.connect();

const form = document.getElementById('form');
const message = document.getElementById('m');

const name = prompt('What is you name?');
appendMessage(`Welcome to the chat ${name}`);

socket.emit('user', name);

socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
});

socket.on('chat message', data => {
    console.log(`${data.name}: ${data.message} `);
    appendMessage(`${data.name}: ${data.message} `);
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const message = document.getElementById('m').value;
    appendMessage(`You: ${message}`);

    socket.emit('chat message', message);

    document.getElementById('m').value = '';
});

function appendMessage(message) {
    const ul = document.getElementById('messages'); 
    const li = document.createElement('li');

    li.textContent = message;
    ul.appendChild(li);
}