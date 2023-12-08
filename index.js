const express = require("express");
const app = express();
const { MongoClient } = require('mongodb'); // Import MongoClient from mongodb
const assert = require('assert');
const url = 'mongodb://127.0.0.1:27017/test';
const exphbs = require('express-handlebars').engine; // version 6+
const http = require('http'); 
const socketIo = require('socket.io');

// WebSocket setup
const server = http.Server(app);
const io = socketIo(server);

const host = 'localhost';
const port = 8080;

//Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    layoutsDir: __dirname + '/views/layouts',    
    partialsDir: __dirname + '/views/partials', 
    extname: 'hbs',
    defaultLayout: 'index',
}));


const client = new MongoClient(url); //MongoClient from mongodb

// ** DB CONNECTION **
async function connect(database = 'test', collection = 'users') {
    try {
        const conn = await client.connect();
        return conn.db(database).collection(collection);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//static content
app.use(express.static('./public'));

// APIs
app.set("view engine", "hbs");

// GET routes
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/home', (req, res) => {
    res.render('main');
});

app.get('/index', (req, res) => {
    res.render('main');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    const { about_data } = require('./models/about');
    res.render('about', { about: about_data });
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

app.get('/chat', (req, res) => {
    res.render('chat', { title: 'Chat With Me' });
});

app.get('/dragdrop', (req, res) => {
    res.render('dragdrop', { title: 'Drag and Drop' });
});

app.get('/ajax', (req, res) => {
    res.render('ajax', { title: 'AJAX' });
});

app.get('/crud', (req, res) => {
    res.render('crud', { title: 'CRUD' });
});

app.get('/api/users', async (req, res) => {
    let result = null;
    try {
        const db = await connect();
        result = await db.find({}).toArray();
        console.log(result);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
    res.render('users', { data: result, layout: false });
});

app.get('/api/users/:id', async (req, res) => {
    let result = null;
    const uid = req.params.userid;
    try {
        const db = await connect();
        result = await db.find({ userid: uid }).toArray();
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    res.render('users', { data: result, layout: false });
});


// Handle 404 route
app.get('*', (req, res) => {
    res.render('404');
});

// WebSocket chat program
var usernames = {};
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});


server.listen(port, () => {
    console.log(`Listening to server: http://localhost:${port}`);
});
