const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const users = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {message: 'Hello from Express'});
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    socket.on('chat message', msg => {
        console.log('chat message: ', msg);
        socket.broadcast.emit('chat message', {message:msg, name: users[socket.id]});
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} disconnected`);
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

//Deals with Heroku deployment
if (process.env.NODE_ENV === 'production') {
    //Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    //Handle React routing, return all requests to React app
    app.get('*', function (request, response) {
        response.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    });
}

http.listen(port, () => {
    console.log('Server up and running on port: 3000');
});