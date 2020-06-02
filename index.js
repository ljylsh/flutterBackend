var SERVER_PATH = "";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var FCM = require('fcm-node');

var fcm = new FCM("AAAApVcTjpQ:APA91bGLfT9_YrMLnqXweHqzgs_7Qnk7npah9MVKG7mkN0BPqvnZCC_AjsRCepnF6UUiIQwJylBsxrYAklNMXmCPg3pCoxN3sYPcpsbJr1lo6o6APSBB-lp_4WRfBXTFFkopRD9Dp83J");

var tokenList = [];
// mongoose.connect('mongodb://gdrc:k3263969@localhost:27017/mathtwo');
// var db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', function () {
// });
// var question = mongoose.Schema({
//     date: 'date',
//     id: 'string',
//     pwd: 'string',
//     auth: 'boolean'
// });
// var Question = mongoose.model('Schema', question);

io.on("connection", (userSocket) => {
    console.log('user connected');
    userSocket.on("send_message", (data) => {
        data.message = "SERVER ECHO MSG:: " + data.message;
        console.log("SERVER RECEIVED :: " + data.message);
        userSocket.emit("receive_message", data)
    })
})

app.use(express.static(SERVER_PATH+'static'));
app.use(bodyParser({limit:'1000mb'}))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/tests', function (req, res){
    // id = req.params.id;
    // UserSchema.findOne({id:id}).exec(function (err, data){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         // console.log("DATA::"+data);
    //         res.json({bank:data.bank, bankNumber:data.bankNumber, bankName:data.bankName});
    //     }
    // })
})
app.post('/token', function(req, res){
    console.log(req.body.token);
    hasToken = false;
    for(i=0;i<tokenList.length;i++){
        if(tokenList[i]==req.body.token){
            hasToken = true;
        }
    }
    if(! hasToken)
        tokenList.push(req.body.token);
})
app.post('/posts', function(req, res){
    console.log('앱 통신 확인 완료');
    // console.log(req.body);
    for(i=0;i<tokenList.length;i++){
        fcm.send({
            to: tokenList[i],
            notification: {
                title: '서버에서 전송한 PUSH 메세지입니다',
                body: '보낸파일명:'+req.body.name,
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon"
            }
        }, function(err, response){
            if(err){
                console.log("PUSH MSG FAILED");
                console.log(err);
            }
            else {
                console.log("PUSH MSG SUCCESS");
            }
        })
    }
    res.json({status:'OK', return:req.body.name})
})


http.listen(3000, function () {
    console.log('listening on *:3000');
})