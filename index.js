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
bank.push({code:'003', name:'기업은행'});
bank.push({code:'004', name:'KB국민은행'});
bank.push({code:'005', name:'외환은행'});
bank.push({code:'007', name:'수협중앙회'});
bank.push({code:'008', name:'수출입은행'});
bank.push({code:'011', name:'농협중앙회'});
bank.push({code:'012', name:'단위 농협'});
bank.push({code:'020', name:'우리은행'});
bank.push({code:'023', name:'SC은행'});
bank.push({code:'027', name:'한국씨티은행'});
bank.push({code:'045', name:'새마을금고중앙회'});
bank.push({code:'048', name:'신협중앙회'});
bank.push({code:'071', name:'우체국'});
bank.push({code:'081', name:'하나은행'});
bank.push({code:'088', name:'신한은행'});
bank.push({code:'031', name:'대구은행'});
bank.push({code:'032', name:'부산은행'});
bank.push({code:'034', name:'광주은행'});
bank.push({code:'035', name:'제주은행'});
bank.push({code:'037', name:'전북은행'});
bank.push({code:'039', name:'경남은행'});
bank.push({code:'050', name:'상호저축은행'});
bank.push({code:'064', name:'산림조합중앙회'});
bank.push({code:'052', name:'모건스탠리은행'});
bank.push({code:'054', name:'HSBC은행'});
bank.push({code:'055', name:'도이치은행'});
bank.push({code:'056', name:'알비에스피엘씨은행'});
bank.push({code:'057', name:'제이피모간체이스은행'});
bank.push({code:'058', name:'미즈호은행'});
bank.push({code:'059', name:'미쓰비시도쿄UFJ은행'});
bank.push({code:'060', name:'BOA은행'});
bank.push({code:'061', name:'비엔피파리바은행'});
bank.push({code:'062', name:'중국공상은행'});
bank.push({code:'063', name:'중국은행'});
bank.push({code:'065', name:'대화은행'});
bank.push({code:'076', name:'신용보증기금'});
bank.push({code:'077', name:'기술보증기금'});
bank.push({code:'092', name:'한국정책금융공사'});
bank.push({code:'093', name:'한국주택금융공사'});
bank.push({code:'094', name:'서울보증보험'});
bank.push({code:'095', name:'경찰청'});
bank.push({code:'096', name:'한국전자금융(주)'});
bank.push({code:'099', name:'금융결제원'});
bank.push({code:'209', name:'유안타증권'});
bank.push({code:'218', name:'현대증권'});
bank.push({code:'230', name:'미래에셋증권'});
bank.push({code:'238', name:'대우증권'});
bank.push({code:'240', name:'삼성증권'});
bank.push({code:'243', name:'한국투자증권'});
bank.push({code:'247', name:'우리투자증권'});
bank.push({code:'261', name:'교보증권'});
bank.push({code:'262', name:'하이투자증권'});
bank.push({code:'263', name:'HMC투자증권'});
bank.push({code:'264', name:'키움증권'});
bank.push({code:'265', name:'이트레이드증권'});
bank.push({code:'266', name:'SK증권'});
bank.push({code:'267', name:'대신증권'});
bank.push({code:'268', name:'아이엠투자증권'});
bank.push({code:'269', name:'한화투자증권'});
bank.push({code:'270', name:'하나대투증권'});
bank.push({code:'278', name:'신한금융투자'});
bank.push({code:'279', name:'동부증권'});
bank.push({code:'280', name:'유진투자증권'});
bank.push({code:'287', name:'메리츠종합금융증권'});
bank.push({code:'289', name:'NH농협증권'});
bank.push({code:'290', name:'부국증권'});
bank.push({code:'291', name:'신영증권'});
bank.push({code:'292', name:'LIG투자증권'});
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
    deepen:[
        {
            code:'0',
            name:'하',
        },
        {
            code:'1',
            name:'중',
        },
        {
            code:'2',
            name:'상',
        },
        {
            code:'3',
            name:'최상',
        }
    ],
    sc:[
        {
            code:'0', 
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
                                    name:'집합의 뜻과 표현',
                                },
                                {
                                    code:'1',
                                    name:'집합의 연산'
                                }
                            ]
                        },
                        {
                            code:'1',
                            name:'명제',
                            mi:[
                                {
                                    code:'0',
                                    name:'명제',
                                },
                                {
                                    code:'1',
                                    name:'절대부등식',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'함수의 뜻과 그래프',
                                },
                                {
                                    code:'1',
                                    name:'여러 가지 함수',
                                },
                                {
                                    code:'2',
                                    name:'합성함수',
                                },
                                {
                                    code:'3',
                                    name:'역함수',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'유리함수와 무리함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'유리식',
                                },
                                {
                                    code:'1',
                                    name:'유리함수',
                                },
                                {
                                    code:'2',
                                    name:'무리식',
                                },
                                {
                                    code:'3',
                                    name:'무리함수',
                                },
                            ]
                        },
                        {
                            code:'4',
                            name:'순열',
                            mi:[
                                {
                                    code:'0',
                                    name:'경우의 수',
                                },
                                {
                                    code:'1',
                                    name:'순열',
                                },
                            ]
                        },
                        {
                            code:'5',
                            name:'조합',
                            mi:[
                                {
                                    code:'0',
                                    name:'조합',
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
                                    name:'이차곡선',
                                },
                                {
                                    code:'1',
                                    name:'이차곡선과 직선',
                                },
                            ]
                        },
                        {
                            code:'1',
                            name:'벡터',
                            mi:[
                                {
                                    code:'0',
                                    name:'벡터의 연산',
                                },
                                {
                                    code:'1',
                                    name:'벡터의 성분과 내적',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'공간도형',
                            mi:[
                                {
                                    code:'0',
                                    name:'공간도형',
                                },
                                {
                                    code:'1',
                                    name:'공간좌표',
                                },
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
                                    name:'수열의 극한',
                                },
                                {
                                    code:'1',
                                    name:'급수',
                                },
                            ]
                        },
                        {
                            code:'1',
                            name:'여러 가지 함수의 미분',
                            mi:[
                                {
                                    code:'0',
                                    name:'지수함수와 로그함수의 미분',
                                },
                                {
                                    code:'1',
                                    name:'삼각함수의 미분',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'미분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'여러 가지 미분법',
                                },
                                {
                                    code:'1',
                                    name:'도함수의 활용(1)',
                                },
                                {
                                    code:'2',
                                    name:'도함수의 활용(2)',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'적분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'여러 가지 적분법',
                                },
                                {
                                    code:'1',
                                    name:'정적분',
                                },
                                {
                                    code:'2',
                                    name:'정적분의 활용',
                                },
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
                                    name:'지수',
                                },
                                {
                                    code:'1',
                                    name:'로그',
                                },
                                {
                                    code:'2',
                                    name:'지수함수',
                                },
                                {
                                    code:'3',
                                    name:'로그함수',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'삼각함수',
                            mi:[
                                {
                                    code:'0',
                                    name:'삼각함수',
                                },
                                {
                                    code:'1',
                                    name:'삼각함수의 그래프',
                                },
                                {
                                    code:'2',
                                    name:'삼각함수의 활용',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'수열',
                            mi:[
                                {
                                    code:'0',
                                    name:'등차수열과 등비수열',
                                },
                                {
                                    code:'1',
                                    name:'수열의 합',
                                },
                                {
                                    code:'2',
                                    name:'수학적 귀납법',
                                },
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
                                    name:'함수의 극한',
                                },
                                {
                                    code:'1',
                                    name:'함수의 연속',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'다항함수의 미분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'미분계수와 도함수',
                                },
                                {
                                    code:'1',
                                    name:'도함수의 활용',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'다항함수의 적분법',
                            mi:[
                                {
                                    code:'0',
                                    name:'부정적분',
                                },
                                {
                                    code:'1',
                                    name:'정적분',
                                },
                                {
                                    code:'2',
                                    name:'정적분의 활용',
                                },
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
                                    name:'여러가지 순열',
                                },
                                {
                                    code:'1',
                                    name:'중복조합과 이항정리',
                                },
                            ]
                        },
                        {
                            code:'2',
                            name:'확률',
                            mi:[
                                {
                                    code:'0',
                                    name:'확률의 뜻과 활용',
                                },
                                {
                                    code:'1',
                                    name:'조건부확률',
                                },
                            ]
                        },
                        {
                            code:'3',
                            name:'통계',
                            mi:[
                                {
                                    code:'0',
                                    name:'확률분포',
                                },
                                {
                                    code:'1',
                                    name:'통계적 추정',
                                },
                            ]
                        },
                    ]
                },
            ]
        },

    ]
}

app.get('/category', function(req, res){
    res.send(categoryArr);
    // groupCode = req.query.groupCode;
    // groupName = req.query.groupName;
    // if(groupCode){
    //     if(groupCode == "학교"){
    //         scArr = [];
    //         scArr.push({code:"0", name:"초등학교"});
    //         scArr.push({code:"1", name:"중학교"});
    //         scArr.push({code:"2", name:"고등학교"});
    //         res.send(scArr);
    //     }
    //     else if(groupCode == "학년"){
    //         yeArr = [];
    //         if(groupName){
    //             if(groupName == "고등학교"){
    //                 yeArr.push({code:"0", name:"고1(상)"});
    //                 yeArr.push({code:"1", name:"고1(하)"});
    //             }
    //         }
    //         res.send(yeArr);
    //     }
    //     else if(groupCode == "대단원"){
    //         biArr = [];
    //         if(groupName){
    //             if(groupName == "고1(상)"){
    //                 biArr.push({code:"0", name:"다항식의 연산"});
    //                 biArr.push({code:"1", name:"나머지정리와 인수분해"});
    //                 biArr.push({code:"2", name:"복소수와 이차방정식"});
    //             }
    //         }
    //         res.send(biArr);
    //     }
    //     else if(groupCode == "중단원"){
    //         miArr = [];
    //         if(groupName){
    //             if(groupName == "다항식의 연산"){
    //                 miArr.push({code:"0", name:"다항식의 덧셈과 뺄셈"});
    //                 miArr.push({code:"1", name:"다항식의 곱셈과 나눗셈"});
    //             }
    //             else if(groupName == "나머지정리와 인수분해"){
    //                 miArr.push({code:"0", name:"항등식"});
    //                 miArr.push({code:"1", name:"나머지정리"});
    //                 miArr.push({code:"2", name:"인수분해"});
    //             }
    //             else if(groupName == "복소수와 이차방정식"){
    //                 miArr.push({code:"0", name:"복소수와 그 연산"});
    //                 miArr.push({code:"1", name:"이차방정식"});
    //             }
    //             else if(groupName == "이차방정식과 이차함수"){
    //                 miArr.push({code:"0", name:"이차방정식과 이차함수의 관계"});
    //                 miArr.push({code:"1", name:"이차함수의 최대, 최소"});
    //             }
    //         }
    //         res.send(miArr);
    //     }
    //     else if(groupCode == "난이도"){
    //         levelArr=[];
    //         levelArr.push({code:"0", name:"하"});
    //         levelArr.push({code:"1", name:"중"});
    //         levelArr.push({code:"2", name:"상"});
    //         levelArr.push({code:"3", name:"최상"});
    //         res.send(levelArr);
    //     }
    // }
    // else{
    //     res.send(categoryArr);
    // }
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
    
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff:diff, answer:{$ne:null}}).exec(function (error, data){
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
// 유사문항 sim_x와 sim_y값의 범위를 어떻게 줘야할 지 강성구 연구원에게 물어봐야함.
// 쌍둥이 문제의 경우 sim_x와 sim_y의 값이 어느정도 편차가 있는지 확인하고 오차범위를 설정해야할듯?
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

// 심화 문항 찾기
app.get('/question/deepen', function(req, res){
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var sm = req.query.sm;
    var diff = req.query.diff;
    
    var deepen = "중";
    if(diff == "하"){
        deepen = "중";
    }
    else if(diff == "중"){
        deepen = "상";
    }
    else if(diff == "상"){
        deepen = "최상";
    }
    else if(diff == "최상"){
        deepen = "최상";
    }
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, sm:sm, diff:deepen}).exec(function (error, data){
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
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    
    console.log(req.query);
    // 현재 대단원, 중단원이 인공지능 예측 수행 시 String값으로 돌아옴.
    // 인공지능 예측 결과 예시 bi: 1. 다항식의 연산 mi: 1.1. 다항식의 덧셈과 뺄셈
    // 하지만 공통코드에서 내려주는 Tag는 bi: 다항식의 연산 mi: 다항식의 덧셈과 뺄셈 이런 식으로 나옴.
    // equals 비교를 할 시, 동일하지 않으므로 contains 비교를 통해 임시로 결과를 돌려준 후, 차후 카테고리 코드 정보를 작성 후 포스텍에 공유하여
    // 카테고리 코드값으로 주고 받게끔 수정이 필요할듯.

    if(mi && bi && ye && sc){
        console.log("중단원 검색");
        Question.find({id:req.params.id, mi:mi, bi:bi, ye:ye, sc:sc,}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
    else if(bi && ye && sc){
        console.log("대단원 검색");
        Question.find({id:req.params.id, bi:bi, ye:ye, sc:sc,}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
    else if(ye && sc){
        console.log("학년 검색");
        Question.find({id:req.params.id, ye:ye, sc:sc,}).sort({date:-1}).exec(function (error, data){
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send({data:data});
            }
        })
    }
    else if(sc){
        console.log("학교 검색")
        Question.find({id:req.params.id, sc:sc}).sort({date:-1}).exec(function (error, data){
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
// 탑 튜터 30% 개발 필요함.
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