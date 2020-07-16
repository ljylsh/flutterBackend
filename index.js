var SERVER_PATH = "";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var FCM = require('fcm-node');
var multer = require('multer');
var fs = require('fs');
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, String(new Date().valueOf()) + '.jpeg');
        }
    }),
});
var fcm = new FCM("AAAApVcTjpQ:APA91bGLfT9_YrMLnqXweHqzgs_7Qnk7npah9MVKG7mkN0BPqvnZCC_AjsRCepnF6UUiIQwJylBsxrYAklNMXmCPg3pCoxN3sYPcpsbJr1lo6o6APSBB-lp_4WRfBXTFFkopRD9Dp83J");

var tokenList = [];
// mongoose.connect('mongodb://gdrc:k3263969@localhost:27017/mathtwo');
mongoose.connect('mongodb://gdrc:k3263969@ds221292.mlab.com:21292/heroku_h9mwh8px');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
});

// var answer = mongoose.Schema({
//     id: String,
//     question_id: String,
//     imageName: String,
//     date: Date,
// });
// var Answer = mongoose.model('answer', answer);

var question = mongoose.Schema({
    date: Date,
    id: String,
    imageName: String,
    answers: [
        {
            id: String,
            imageName: String,
            date: Date
        }
    ],
    answerType: String,
    tutor: String,
    price: Number,
    sc: String,
    ye: String,
    bi: String,
    mi: String,
    sm: String,
    diff: String,
    calcTime: String,
    sc_p: Number,
    ye_p: Number,
    bi_p: Number,
    mi_p: Number,
    sm_p: Number,
    sim_x: Number,
    sim_y: Number
});
var Question = mongoose.model('question', question);

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
app.use('/uploads', express.static('uploads'));

app.get('/qna', function(req, res){
    Question.find().exec(function (error, datas) {
        if(error) {
            console.log(error);
            res.status(500).send({error:'read failed'});
        }
        else{
            console.log("qna find" + datas);
            for(i=0;i<datas.length;i++){
                console.log(datas[i].answers.length);
            }
            res.json({datas});
        }
    })
})
app.get('/question', function(req, res){
    Question.find().exec(function (error, datas) {
        if(error) {
            console.log(error);
            res.status(500).send({error:'read failed'});
        }
        else{
            console.log("question find" + datas);
            res.json({datas});
        }
    })
})
app.post('/image', upload.single("image"), function (req, res){
    console.log(" I AM IN IMAGE POST REQUEST");
    var image = req.image;
    var formData = {
        file: fs.createReadStream("uploads/"+req.file.filename),
    };

    request.post({url:'http://34.64.181.16:5000/image', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
        res.status(201).send({msg:body});
    });
})
app.get('/simillarQuestion', function(req, res){
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var sm = req.query.sm;
    var diff = req.query.diff;
    console.log(sim_x);
    console.log(sim_y);
    console.log("end of simillarQuestion");

    // 동일 문항 찾기
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff:diff}).exec(function (error, data){
        if(error){
            console.log(error);
        }
        else{
            let answers = [];
            for(i=0;i<data.length;i++){
                for(j=0;j<data[i].answers.length;j++){
                    data[i].answer[j]['question_id']=data[i]._id;
                    data[i].answer[j]['price']=data[i].price;
                    answers.push(data[i].answers[j]);
                }
            }
            console.log("QUESTION FOUND SAME")
            console.log(answers);
            res.status(200).send({data:answers});
        }
    })
    // 유사 문항 찾기
    // Question.find({sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff: diff}).exec(function (error, data){
    //         if(error){
    //             console.log(error);
    //         }
    //         else{
    //             data.answer.push(newAnswer);
    //             data.save();
    //         }
    //     });
    
})
// uploads 저장하기 부터 이어서
app.post('/question', upload.single("image"), function (req, res){
    var image = req.image;
    var fields = req.body;
    console.log(fields);
    console.log("FILENAME::"+req.file.filename);

    var formData = {
        file: fs.createReadStream("uploads/"+req.file.filename),
    };
    // http://34.64.181.16
    
    var newQuestion = new Question({ id: fields.id, date:new Date().getTime(), imageName: req.file.filename, answer:[], answerType: fields.answerType, tutor: fields.tutor, price: Number(fields.price),
    sc: fields.sc, ye: fields.ye, bi: fields.bi, mi:fields.mi, sm: fields.sm, diff: fields.diff, calcTime: fields.calcTime, sc_p: fields.sc_p, ye_p: fields.ye_p, bi_p: fields.bi_p, mi_p:fields.mi_p, sm_p:fields.sm_p, sim_x:fields.sim_x, sim_y:fields.sim_y })
    newQuestion.save(function (error, data) {
        if(error) {
            console.log(error);
            res.status(500).send({error:'created failed'});
        }
        else {
            console.log("saved : " + data);
            res.status(201).send({data: data});
        }
    });
})

app.post('/answer', upload.single("image"), function (req, res){
    var image = req.image;
    var fields = req.body;
    console.log(fields.question_id);
    var answer = {id: fields.id, date:new Date().getTime(), imageName: req.file.filename};
    Question.findOneAndUpdate(
        {_id: fields.question_id}, 
        { $push: { answers : answer } },
        function(error,success){
            if(error){
                console.log(error);
                res.status(500).send({data: error});
            }
            else{
                console.log(success);
                res.status(201).send({data: success});
            }
        }    
    );
    // Question.findOne({_id: fields.question_id}).exec(function (error, data){
    //     if(error){

    //     }
    //     else{
    //         data.answers.Push(answer);
    //         data.save(done);
    //     }
    // })
    // var newAnswer = new Answer();
    // newAnswer.save(function (error, data) {
    //     if(error) {
    //         console.log(error);
    //         res.status(500).send({error:'created failed'});
    //     }
    //     else {
    //         console.log("saved : " + data);
    //         res.status(201).send({msg: 'answer created success'});
    //     }
    // })
    // Question.find({_id:fields.question_id}).exec(function (error, data){
    //     if(error){
    //         console.log(error);
    //     }
    //     else{
    //         data.answer.push(newAnswer);
    //         data.save();
    //     }
    // });
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


http.listen(process.env.PORT || 8080, function () {
// http.listen(8080, function () {
    console.log('listening on *:'+process.env.PORT);
})