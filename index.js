var SERVER_PATH = "";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
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
        console.log("SERVER RECEIVED :: " + data);
        userSocket.emit("receive_message", data)
    })
})

app.use(express.static(SERVER_PATH+'static'));
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
app.post('/posts', function(req, res){
    console.log('!!!');
    // console.log(req.body);
    
    res.json({status:'OK', return:req.body.name})
})


http.listen(3000, function () {
    console.log('listening on *:3000');
})