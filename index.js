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
            cb(null, String(new Date().valueOf()) + file.originalname);
        }
    }),
});
var fcm = new FCM("AAAAAoow1E0:APA91bHBVS6Ap3mw-22Pht_MF7gOCTncmdUd9N7JRKJUnLj_8rkssZUqhvGZvHF-MORZReFLG8lfrG5l5PhkrjoKdIQAr6Zcrrl1BWINpeFIqntcHdeJX4ojTphHlhNddNuv1xmewQpV");

var tokenList = [{}];
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
var user = mongoose.Schema({
    id: {type: String, unique: true},
    password: String,
    name: String,
    bornYear: Number,
    address: String,
    bankName: String,
    bankNumber: String,
    tel: String,
    tutor: [{type: String}],
    favoriteCategory: [],
    point: Number,
    pointHistory: [],
    review: [],
    channelIntroduction: String,
    token: String,
    contents: [
        {
            id: String,
            fileName: String,
            text: String,
            likes: [{id:String}],
            comments: [{
                id:String,
                text: String,
                date: Date
            }],
            date: Date,
            fileType: Number,
        }
    ],
})
var User = mongoose.model('user', user);

var question = mongoose.Schema({
    date: Date,
    id: String,
    imageName: String,
    answer: 
    {
        id: String,
        fileName: String,
        date: Date,
        fileType: Number,
    },
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

var bank=[];
bank.push({code:'001', name:'은행테스트1'});
bank.push({code:'002', name:'은행테스트2'});
bank.push({code:'003', name:'은행테스트3'});
app.get('/bank', function(req, res){
    res.send(bank);
})

var answer=[];
answer.push({code:'001', name:'문제해설지', price:500});
answer.push({code:'002', name:'문제풀이동영상', price:1000});
answer.push({code:'003', name:'화상과외', price:2000});
app.get('/answer-type', function(req, res){
    res.send(answer);
})

var categoryArr = {
    sc:[
        {
            code:'17', 
            name:'고등',
            ye:[
                {
                    code:'0',
                    name:'고1(상)',
                    bi:[
                        {
                            code:'0',
                            name:'다항식의 연산',
                            mi:[
                                {
                                    code:'0',
                                    name:'다항식의 덧셈과 뺄셈',
                                },
                                {
                                    code:'1',
                                    name:'다항식의 곱셈과 나눗셈',
                                },
                            ]
                        },
                        {
                            code:'1',
                            name:'나머지정리와 인수분해',
                            mi:[
                                {
                                    code:'0',
                                    name:'항등식',
                                },
                                {
                                    code:'1',
                                    name:'나머지정리',
                                },
                                {
                                    code:'2',
                                    name:'인수분해',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'복소수와 이차방정식',
                            mi:[
                                {
                                    code:'0',
                                    name:'복소수와 그 연산'
                                },
                                {
                                    code:'1',
                                    name:'이차방정식',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'이차방정식과 이차함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'이차방정식과 이차함수의 관계',
                                },
                                {
                                    code:'1',
                                    name:'이차함수의 최대, 최소',
                                },
                            ]
                        },
                        {
                            code:'4',
                            name:'여러 가지 방정식과 부등식',
                            mi:[
                                {
                                    code:'0',
                                    name:'삼차방정식과 사차방정식',
                                },
                                {
                                    code:'1',
                                    name:'연립방정식',
                                },
                                {
                                    code:'2',
                                    name:'일차부등식',
                                },
                                {
                                    code:'3',
                                    name:'이차부등식',
                                },
                            ]
                        },
                        {
                            code:'5',
                            name:'평면좌표',
                            mi:[
                                {
                                    code:'0',
                                    name:'두 점 사이의 거리',
                                },
                                {
                                    code:'1',
                                    name:'선분의 내분과 외분',
                                },
                            ]
                        },
                        {
                            code:'6',
                            name:'직선의 방정식',
                            mi:[
                                {
                                    code:'0',
                                    name:'직선의 방정식',
                                },
                            ]
                        },
                        {
                            code:'7',
                            name:'원의 방정식',
                            mi:[
                                {
                                    code:'0',
                                    name:'원의 방정식',
                                },
                                {
                                    code:'1',
                                    name:'원과 직선의 위치 관계',
                                },
                            ]
                        },
                        {
                            code:'8',
                            name:'도형의 이동',
                            mi:[
                                {
                                    code:'0',
                                    name:'평행이동',
                                },
                                {
                                    code:'1',
                                    name:'대칭이동',
                                },
                            ]
                        },
                    ]
                },
                {
                    code:'1',
                    name:'고1(하)',
                    bi:[
                        {
                            code:'0',
                            name:'집합',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'1',
                            name:'명제',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'3',
                            name:'유리함수와 무리함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'4',
                            name:'순열',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'5',
                            name:'조합',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
                {
                    code:'2',
                    name:'기하',
                    bi:[
                        {
                            code:'0',
                            name:'이차곡선',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'1',
                            name:'벡터',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'공간도형',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
                {
                    code:'3',
                    name:'미적분',
                    bi:[
                        {
                            code:'0',
                            name:'수열의 극한',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'1',
                            name:'여러 가지 함수의 미분',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'미분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'3',
                            name:'적분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
                {
                    code:'4',
                    name:'수학Ⅰ',
                    bi:[
                        {
                            code:'1',
                            name:'지수함수와 로그함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'삼각함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'3',
                            name:'수열',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
                {
                    code:'5',
                    name:'수학Ⅱ',
                    bi:[
                        {
                            code:'1',
                            name:'함수의 극한과 연속',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'다항함수의 미분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'3',
                            name:'다항함수의 적분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
                {
                    code:'6',
                    name:'확률과통계',
                    bi:[
                        {
                            code:'1',
                            name:'경우의 수',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'2',
                            name:'확률',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                        {
                            code:'3',
                            name:'통계',
                            mi:[
                                {
                                    code:'0',
                                    name:'',
                                }
                            ]
                        },
                    ]
                },
            ]
        },

    ]
}

app.get('/category', function(req, res){
    groupCode = req.query.groupCode;
    groupName = req.query.groupName;
    if(groupCode){
        if(groupCode == "학교"){
            scArr = [];
            scArr.push({code:"0", name:"초등학교"});
            scArr.push({code:"1", name:"중학교"});
            scArr.push({code:"2", name:"고등학교"});
            res.send(scArr);
        }
        else if(groupCode == "학년"){
            biArr = [];
            if(groupName){
                if(groupName == "고1(상)"){
                    biArr.push({code:"0", name:"다항식의 연산"});
                    biArr.push({code:"1", name:"나머지정리와 인수분해"});
                    biArr.push({code:"2", name:"복소수와 이차방정식"});
                }
            }
            res.send(biArr);
        }
        else if(groupCode == "대단원"){
            miArr = [];
            if(groupName){
                if(groupName == "다항식의 연산"){
                    miArr.push({code:"0", name:"다항식의 덧셈과 뺄셈"});
                    miArr.push({code:"1", name:"다항식의 곱셈과 나눗셈"});
                }
                else if(groupName == "나머지정리와 인수분해"){
                    miArr.push({code:"0", name:"항등식"});
                    miArr.push({code:"1", name:"나머지정리"});
                    miArr.push({code:"2", name:"인수분해"});
                }
                else if(groupName == "복소수와 이차방정식"){
                    miArr.push({code:"0", name:"복소수와 그 연산"});
                    miArr.push({code:"1", name:"이차방정식"});
                }
                else if(groupName == "이차방정식과 이차함수"){
                    miArr.push({code:"0", name:"이차방정식과 이차함수의 관계"});
                    miArr.push({code:"1", name:"이차함수의 최대, 최소"});
                }
            }
            res.send(miArr);
        }
        else if(groupCode == "난이도"){
            levelArr=[];
            levelArr.push({code:"0", name:"하"});
            levelArr.push({code:"1", name:"중"});
            levelArr.push({code:"2", name:"상"});
            levelArr.push({code:"3", name:"최상"});
            res.send(levelArr);
        }
    }
    else{
        res.send(categoryArr);
    }
})

app.get('/terms', function(req, res){
    fs.readFile('terms.txt', 'utf8', function(err, data){
        res.send(data);
    })
})

var sc = [];
var ye = [];
var bi = [];
var mi = [];
var sm = [];
app.get('/content/tutor/:id', function(req, res){
    var id = req.params.id;
// 최신 컨텐츠 부분 상단 DB Schema 참조하여 코딩할것.

    // 해당 ID의 튜터 목록을 조회.
    // 조회 후 해당 튜터들의 컨텐츠를 Date 최신순으로 5개 받아오기.
    // params로 Count를 받아, 스크롤 추가 할 시 Count 더 해서 잘라 return하기.
    // 현재는 그냥 임의의 Video 돌려주기.
})

app.get('/user/validation/:id', function(req, res){
    User.findOne({id:req.params.id}).exec(function (error, data){
        if(error){
            console.log(error);
            res.send({error: error});
        }
        else{
            console.log(data);
            if(data){
                res.status(409).send({msg:'ID exists', code:'409'});
            }
            else{
                res.status(200).send({msg:'ID not exists', code:'200'});
            }
        }
    })
})
// 회원가입
app.post('/user', function(req, res){
    fields = req.body;
    console.log(fields);
    var newUser = new User({
        id: fields.id,
        password: fields.password,
        name: fields.name,
        bornYear: fields.bornYear,
        address: fields.address,
        bankCode: fields.bankCode,
        bankNumber: fields.bankNumber,
        tel: fields.tel,
        point: 0,
    });
    newUser.save(function (error, data) {
        if(error){
            console.log(error);
            res.status(500).send({error:'user created failed'});
        }
        else{
            console.log("saved : " + data);
            res.status(201).send({status: '201'});
        }
    })
})
// 로그인
app.post('/user/:id', function(req, res){
    fields = req.body;
    console.log(req.params.id);
    console.log(fields.password);
    User.findOne({id: req.params.id, password: req.body.password}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({error:'cannot find id', code: 'id'});
        }
        else{
            console.log(data);
            if(data){
                res.status(200).send({user: data});
            }
            else{
                res.status(500).send({error:'cannot match id/password', code: 'id'});
            }
        }
    })
})


// 새로운 질문에 대한 알람 기능은 FCM으로 진행하는게 맞을 듯.
// 새로운 문제가 나올 때 마다 해당하는 관심 카테고리의 튜터들에게 FCM PUSH를 보내고, 
// 접속 시에 question별 transaction을 체크 해 관심 카테고리 영역 내에 transaction이 걸리지 않은 (즉, 답변을 누군가가 달고 있거나 이미 달리지 않은) 문제가 있을 경우 알람에 NEW를 띄워주게끔.

// AI SERVER로 문제에 대한 카테고리 분류 정보 획득
app.post('/inferenceImage', upload.single("image"), function (req, res){
    console.log("inferenceImage");
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

// 동일 문항 찾기
app.get('/question/same', function(req, res){
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var sm = req.query.sm;
    var diff = req.query.diff;
    
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff:diff}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({err:error})
        }
        else{
            res.status(200).send({data:data});
        }
    })
})

// 유사 문항 찾기
app.get('/question/simillar', function(req, res){
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var sm = req.query.sm;
    var diff = req.query.diff;
    
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff:diff}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({err:error})
        }
        else{
            res.status(200).send({data:data});
        }
    })
})

// 전체 질문보기 조회
app.get('/question', function(req, res){    
    Question.find({}).exec(function (error, data){
        if(error){
            console.log(error);
        }
        else{
            res.status(200).send({data:data});
        }
    })
})
// 본인 질문 최신순 보기
app.get('/user/:id/question', function(req, res){
    var bi = req.query.bi;
    var mi = req.query.mi;
    console.log(bi+"&&&"+mi);
    console.log(req.query);
    if(mi && bi){
        console.log("중단원 검색");
        Question.find({id:req.params.id, bi:req.params.bi, mi:req.params.mi}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
    else if(bi){
        console.log("대단원 검색");
        Question.find({id:req.params.id, bi:req.params.bi}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
    else{
        console.log("본인 문제 전체 검색");
        Question.find({id:req.params.id}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
})

// 질문 _id 검색 (show detail)
app.get('/question/:id', function(req, res){
    Question.findOne({_id:req.params.id}).exec(function (error, data){
        if(error){
            console.log(error);
        }
        else{
            if(data){
                res.status(200).send({data:data});
            }
            else{
                res.status(404).send({error:'question cannot find'});
            }
        }
    })
})
app.get('/user/:id/category', function (req, res){
    User.findOne({id:req.params.id}).exec(function(error, data){
        if(error){
            res.status(500).send({error:error});
        }
        else{
            if(data){
                res.status(200).send({_id: data._id, id: data.id, favoriteCategory: data.favoriteCategory});
            }
            else{
                res.status(404).send({error:'user cannot find'})
            }
        }
    })
})
// 유저의 관심카테고리 목록 수정
app.post('/user/:id/category', function (req, res){
    var userId = req.params.id;
    var f = req.query;
    var yeArr = f.ye;
    console.log(yeArr);
    console.log(yeArr[0]);
    User.findOneAndUpdate(
        {id : userId}, 
        {favoriteCategory:yeArr}, 
        function(error, data){
            if(error){
                console.log(error);
                res.status(500).send({error:error});
            }
            else{
                res.status(201).send({status:'201'});
            }
        }
    );
})
// 관심 카테고리 내 미답변 상태의 질문 목록 조회
app.get('/question/unanswerd/ye', function (req, res){
    var f = req.query;
    // 관심 카테고리 array
    var yeArr = f.ye;
    console.log(yeArr);
    console.log(yeArr[0]);
    console.log("???");
    Question.find({answer : { $exists: false }}).where('ye').in(yeArr).exec(function(error, data){
        console.log(data);
        res.send({data:data});
    })

})
// 새로운 질문 등록
app.post('/question', upload.single("image"), function (req, res){
    var image = req.image;
    var fields = req.body;
    console.log(fields);
    console.log("FILENAME::"+req.file.filename);
    
    var formData = {
        file: fs.createReadStream("uploads/"+req.file.filename),
    };
    
    var newQuestion = new Question({ id: fields.id, date:new Date().getTime(), imageName: req.file.filename, answer:[], answerType: fields.answerType, price: Number(fields.price),
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

    var answerTargetType = fields.answerTargetType;
    if(answerTargetType == 0){
        // 누구나
        // 관심카테고리를 설정한 유저 전체에게 보내야함
        User.find({favoriteCategory : {$in : fields.ye}}).exec(function(err, data){
            console.log(data);
            for(i=0;i<data.length;i++){
                fcm.send({
                    to: data[i].token,
                    notification: {
                        title: '선생님께 새 질문이 도착하였어요!',
                        body: '지금 매튜에 접속하여 답변해보세요!',
                        sound: "default",
                        click_action: "OPEN_ACTIVITY_QUESTION",
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
        })
    }
    else if(answerTargetType == 1){
        // my튜터 전체
        // my튜터 목록을 불러와 튜터 아이디 조회 해봐야함
        User.findOne({id: fields.id}).exec(function(err, data){
            if(err){
                console.log(err);
            }
            else{
                var tutorArr = data.tutor;
                User.find({id : {$in : data.tutor}}).exec(function(err, data){
                    if(err){
                        console.log(err);
                    }
                    else{
                        for(i=0;i<data.length;i++){
                            fcm.send({
                                to: data[i].token,
                                notification: {
                                    title: '선생님께 새 질문이 도착하였어요!',
                                    body: '지금 매튜에 접속하여 답변해보세요!',
                                    sound: "default",
                                    click_action: "OPEN_ACTIVITY_QUESTION",
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
                    }
                })
            }
        });
    }
    else if(answerTargetType == 2){
        // my튜터 중 튜터 선택
        // my튜터 목록과 비교하여 튜터 아이디가 있는 지 조회해봐야함
        User.findOne({id: fields.tutor}).exec(function(err, data){
            if(err){
                console.log(err);
            }
            else{
                if(data){
                    fcm.send({
                        to: data.token,
                        notification: {
                            title: '선생님께 새 질문이 도착하였어요!',
                            body: '지금 매튜에 접속하여 답변해보세요!',
                            sound: "default",
                            click_action: "OPEN_ACTIVITY_QUESTION",
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
                else{
                    console.log("USER CANNOT FIND")
                }
            }
        })
    }
    else if(answerTargetType == 3){
        // top 튜터 상위 30%에게 요청
        // 30%의 기준 DB에서 id 조회해와서 보내야함
        User.find({favoriteCategory : {$in : fields.ye}}).exec(function(err, data){
            console.log(data);
            for(i=0;i<data.length;i++){
                // 30%만 정렬하는 알고리즘 개발 해야함. 현재는 누구나와 동일
                fcm.send({
                    to: data[i].token,
                    notification: {
                        title: '선생님께 새 질문이 도착하였어요!',
                        body: '지금 매튜에 접속하여 답변해보세요!',
                        sound: "default",
                        click_action: "OPEN_ACTIVITY_QUESTION",
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
        })
    }
})

// 질문에 새로운 답변 등록
app.post('/answer', upload.single("file"), function (req, res){
    var file = req.file;
    var fields = req.body;
    console.log(fields.questionId);
    var fileType=0;
    if(req.file.mimetype.includes('video')){
        fileType = 1;
    }
    var answer = {id: fields.id, date:new Date().getTime(), fileName: req.file.filename, fileType: fileType};
    Question.findOneAndUpdate(
        {_id: fields.questionId}, 
        { answer : answer },
        function(error, success){
            if(error){
                console.log(error);
                res.status(500).send({error: error});
            }
            else{
                User.findOne({id: success.id}).exec(function(err, data){
                    if(err){
                        console.log(err);
                    }
                    else{
                        fcm.send({
                            to: data.token,
                            notification: {
                                title: '질문에 대한 답변이 도착하였어요!',
                                body: '지금 매튜에 접속하여 확인해보세요!',
                                sound: "default",
                                click_action: "OPEN_ACTIVITY_ANSWER",
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
                })
                res.status(201).send({result:'success'});
            }
        }    
    );
})

app.get('/user/:id/content', function(req, res){
    User.findOne({id: req.params.id}).exec(function (error, data){
        if(error){
            console.log(error);
        }
        else{
            console.log("IN HERE");
            if(data){
                tutorArr = data.tutor;
        
                console.log(tutorArr);
                User.find({id : {$in: tutorArr}}).exec(function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(data);
                        contentsArr = [];
                        for(i=0;i<data.length;i++){
                            for(j=0;j<data[i].contents.length;j++){
                                contentsArr.push(data[i].contents[j]);
                            }
                            // contentsArr.push(data[i].contents)
                        }
                        res.send({data:contentsArr});
                    }
                });

            }
            else{
                res.send({error:'user cannot find'})
            }
            
            
        }
    })
})
// 메인화면 컨텐츠 좋아요 / 댓글 기능 구현 필요함. 시연 이후!

app.post('/user/:id/content', upload.single("file"), function(req, res){
    var id = req.params.id;
    var fileType=0;
    if(req.file.mimetype.includes('video')){
        fileType = 1;
    }
    var content = {id: req.params.id, date:new Date().getTime(), fileName: req.file.filename, text: req.body.text, fileType: fileType};
    
    User.findOne({id: id}, function(error, data){
        if(error){
            console.log(error);
        }
        else{
            data.contents.push(content);
            data.save();
            res.status(201).send({result: 'success'});
        }
    });
})

app.post('/tutor', function(req, res){
    var userId = req.body.userId;
    var tutorId = req.body.tutorId;
    User.findOne({id : userId}, function(error, data){
            if(error){
                console.log(error);
                res.status(500).send({error: error});
                // { $push: { tutor : tutorId } },
            }
            else{
                tutorArr = data.tutor;
                console.log(tutorArr);
                tutorFlag = false;
                for(i=0;i<tutorArr.length;i++){
                    if(tutorArr[i]==tutorId){
                        tutorFlag = true;
                        res.status(200).send({result: 'exist tutor'});
                    }
                }
                if(! tutorFlag){
                    data.tutor.push(tutorId);
                    data.save();
                    res.status(201).send({result: 'success'});
                }
            }

        }
    );
        
})
app.get('/tutor/top/:sc', function(req, res){
    var sc = req.params.sc;
    var rankTop = [];
    for(i=0;i<5;i++){
        rankTop.push({id:'dummy'+sc+'rank'+String(i)});
    }
    res.send(rankTop);
})
app.get('/tutor/:id', function(req, res){
    var id = req.params.id;
    User.findOne({id:id}).exec(function(error, data){
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        else{
            if(data){
                res.status(200).send({tutor:data.tutor});
            }
            else{
                res.status(500).send({error:'cannot find id'});
            }
            console.log(data);
            
        }
    })
})


// app.get('/qna', function(req, res){
//     Question.find().exec(function (error, datas) {
//         if(error) {
//             console.log(error);
//             res.status(500).send({error:'read failed'});
//         }
//         else{
//             console.log("qna find" + datas);
//             for(i=0;i<datas.length;i++){
//                 console.log(datas[i].answers.length);
//             }
//             res.json({datas});
//         }
//     })
// })
// app.get('/question', function(req, res){
//     Question.find().exec(function (error, datas) {
//         if(error) {
//             console.log(error);
//             res.status(500).send({error:'read failed'});
//         }
//         else{
//             console.log("question find" + datas);
//             res.json({datas});
//         }
//     })
// })


// FCM PUSH를 위한 token 수집
app.post('/token', function(req, res){
    console.log(req.body.token);
    console.log(req.body._id);
    console.log(req.body.id);
    
    User.findOneAndUpdate(
        { _id:req.body._id },
        { token : req.body.token },
        function(error, success){
            if(error){
                console.log(error);
                res.status(500).send({error: error});
            }
            else{
                res.status(201).send({result:'token update success'});
            }
        }
    );

    // hasToken = false;
    // for(i=0;i<tokenList.length;i++){
    //     if(tokenList[i].token==req.body.token){
    //         hasToken = true;
    //     }
    // }
    // if(! hasToken)
    //     tokenList.push({token:req.body.token, _id:req.body._id, id:req.body.id});
})
// FCM PUSH 메세지 보내기
app.post('/fcm', function(req, res){
    console.log('앱 통신 확인 완료');
    // console.log(req.body);
    for(i=0;i<tokenList.length;i++){
        fcm.send({
            to: tokenList[i].token,
            notification: {
                title: '서버에서 전송한 PUSH 메세지입니다',
                body: '보낸파일명:'+req.body.name,
                sound: "default",
                click_action: "OPEN_ACTIVITY_QUESTION",
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
    console.log('listening on *:'+process.env.PORT || 8080);
})