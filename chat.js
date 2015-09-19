var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat');

var routes = require('./routes/routes');    

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handlebars({
    layoutsDir: 'views',
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '5eb63bbbe01eeed093cb22bb8f5acdc3', // 建议使用 128 个字符的随机字符串hello world
}));
app.use('/', routes);

io.on('connection', function (socket) {
    // 广播向其他用户发消息
    // socket.broadcast.emit('message',obj);
    var client = {
        socket: socket,
        username: ""
    };
    socket.on('message', function(msg){
        var obj = {time: getTime()};
        obj['text'] = msg.message;
        obj['username'] = msg.username;
        if (!client.username) {
            client['username'] = msg.nickname;
        }
        io.emit('message', obj);
    });
    socket.on('disconnect', function (socket) {
        var obj = {time: getTime()};
        obj['text'] = client['username'] + "断开连接";
        obj['username'] = "system";
        io.emit('message', obj);
    });
});

var getTime = function(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}

http.listen(3000, function() {
    console.log('listening on: ' + 3000);
});