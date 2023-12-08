const express = require('express');
const app = express(); // constructor
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');

//WebSocket
const http = require('http')
const server = http.Server(app)
const io = socketIo(server);


const host = 'localhost';
const port = 8080;


//Static content (img, css, js, videos)
app.use(express.static('./public'));


//create handlebars template setup
app.set("view engine", "hbs");

app.engine('.hbs', exphbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname:'hbs',
    defaultLayout: 'index',
}));


//APIs

//GET
//route directory
app.get('/',(req,res)=>{
    res.render('main')
});

app.get('/home',(req,res)=>{
    res.render('main')
});

app.get('/index',(req,res)=>{
    res.render('main')
});

app.get('/contact',(req,res)=>{
    res.render('contact')
});

app.get('/about',(req,res)=>{
    const {about_data} = require('./models/about')
    res.render('about', { about: about_data});
});

app.get('/portfolio',(req,res)=>{
    res.render('portfolio')
});
app.get('/chat',(req,res)=>{
    res.render('chat',{title:'Chat With Me'})
});
app.get('/dragdrop',(req,res)=>{
    res.render('dragdrop',{title:'Drag and Drop'})
});

app.get('/crud',(req,res)=>{
    res.render('crud',{title:'CRUD'})
});


//(Catch all must be the very last at the bottom)
//CATCH ALL GET API
app.get('*',(req,res)=>{
    res.render('404')
});

//POST

//PUT

//DELETE



//CHAT PROGRAM
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

server.listen(port, () => console.log(`Server is live at http://${host}:${port}`));