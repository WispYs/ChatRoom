var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
    console.log('listening on *:3000');
});

//路由，链接到client，访问时直接访问到index.html
app.use(express.static(__dirname + '/client'));

/*app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/img');
});*/
   
// 在线玩家人数
var onlineCount = 0;

//在线玩家
var onlineUser = {};

io.on('connection', function (socket){
    //当前用户信息
    var currentUserId = '';
    var currentUsername = '';
    //新用户加入
    socket.on('add user', function (data){
        //记录当前玩家名字id
        currentUserId = data.userid;
        currentUsername = data.username;
        console.log("新用户加入\nusername : "+currentUsername+"\nuserid : "+currentUserId+"");

        //检查在线列表，如果不在里面就加入
        if(!onlineUser.hasOwnProperty(currentUserId)) {
            onlineUser[currentUserId] = currentUsername;
            onlineCount++;
        }
        console.log(onlineUser)
        //向客户端返回人数
        socket.emit('login', {
            onlineCount: onlineCount,
            onlineUser: onlineUser
        });

        //发送信息给所有连接到server的客户端
        socket.broadcast.emit('user joined', {
            username: currentUsername,
            onlineCount: onlineCount,
            onlineUser: onlineUser
        });
    })
    
    //用户发送信息
    socket.on('chat message', function (data){
        socket.broadcast.emit('chat message', {
            username: data.username,
            message: data.message,
            useravator: data.useravator
        });
        console.log('message: ' + data.message);
    });
    
    //用户退出链接
    socket.on('disconnect', function (){
        //将退出的用户从在线列表中删除
        console.log(onlineUser[currentUserId],currentUsername)
        if(onlineUser.hasOwnProperty(currentUserId)) {
            //删除
            delete onlineUser[currentUserId];
            //在线人数-1
            onlineCount--;

            console.log(currentUsername +'退出了聊天室');
            //向所有客户端广播用户退出
            socket.broadcast.emit('user leave', {
                username: currentUsername,
                onlineCount: onlineCount
            });
        }
    });
});



