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
var FormData = require('form-data');
var path = require('path');
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
// JSON CONFIG로 차 후 변경
var fcm = new FCM("AAAAAoow1E0:APA91bHBVS6Ap3mw-22Pht_MF7gOCTncmdUd9N7JRKJUnLj_8rkssZUqhvGZvHF-MORZReFLG8lfrG5l5PhkrjoKdIQAr6Zcrrl1BWINpeFIqntcHdeJX4ojTphHlhNddNuv1xmewQpV");

var tokenList = [{}];
// mongoose.connect('mongodb://gdrc:k3263969@localhost:27017/mathtwo');
// BACKEND 서버 내 DB 설치로 차 후 변경
mongoose.connect('mongodb://gdrc:k3263969@ds221292.mlab.com:21292/heroku_h9mwh8px');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
});

// DB 스키마 소스코드 차 후 분리
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
    diff: String,
    calcTime: String,
    sc_p: Number,
    ye_p: Number,
    bi_p: Number,
    mi_p: Number,
    sim_x: Number,
    sim_y: Number
});
var Question = mongoose.model('question', question);

// socket.io 채팅 모듈 분리
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

// JSON CONFIG 차 후 변경
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

// JSON CONFIG 차 후 분리
var answer=[];
answer.push({code:'001', name:'문제해설지', price:500});
answer.push({code:'002', name:'문제풀이동영상', price:1000});
answer.push({code:'003', name:'화상과외', price:2000});

app.get('/answer-type', function(req, res){
    res.send(answer);
})

// JSON CONFIG 차 후 분리 및 기타 수학교육과정 추가 필요(AI서버도 동일파일 로딩)
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

// ID 중복 확인
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


// // AI SERVER로 문제에 대한 카테고리 분류 정보 획득
// app.post('/inferenceImage', upload.single("image"), function (req, res){
//     console.log("inferenceImage");
//     var image = req.image;
//     var formData = {
//         file: fs.createReadStream("uploads/"+req.file.filename),
//     };

//     request.post({url:'http://34.64.181.16:5000/image', formData: formData}, function optionalCallback(err, httpResponse, body) {
//         if (err) {
//           return console.error('upload failed:', err);
//         }
//         console.log('Upload successful!  Server responded with:', body);
//         res.status(201).send({msg:body});
//     });
// })

// 임시 문제/답변파일 업로드 스크립트
app.get('/ssen/:file', function(req, res){
    var dirUrl = '/home/gdrc/다운로드/쎈/8. 원의 방정식/8.1. 원의 방정식'
    
    var file = req.params.file+'.jpg';
    var ext = file.split('.');
    // 홀수는 문제
    if(ext[0]%2==1){
        console.log(dirUrl);
        console.log(file);
        // console.log(ext[0])
        var formData = {
            file: {
                value: fs.createReadStream(path.join(dirUrl, file)),
                options: {
                    filename: file,
                    contentType: 'image/'+ext[1],
                }
            }
        }
        
        request.post({url:'http://34.64.181.16:5000/image', formData: formData}, function optionalCallback(err, httpResponse, body){
            if (err){
                console.error(err);
                if(err.errno==-2){
                    console.log("no file error!!")
                }
                else{
                    console.log("ANOTHER ERROR!!")
                    res.end();
                    // setTimeout(function(){
                    //     // res.redirect('http://127.0.0.1:8080/ssen/'+(parseInt(ext[0])));
                    //     res.statusCode=301;
                    //     res.setHeader('Location','http://127.0.0.1:8080/ssen/'+(parseInt(ext[0])));
                    //     res.end();
                    // }, 3000)
                    
                }
                
            }
            else{
                d = JSON.parse(body);
                console.log(d);
                var qForm = {
                    sc_p: d.sc_p,
                    ye_p: d.ye_p,
                    bi_p: d.bi_p,
                    mi_p: d.mi_p,
                    sc: d.sc,
                    ye: d.ye,
                    bi: d.bi,
                    mi: d.mi,
                    diff: d.diff,
                    sim_x: d.sim_x,
                    sim_y: d.sim_y,
                    time: d.time,
                    image: {
                        value: fs.createReadStream(path.join(dirUrl, file)),
                        options: {
                            filename: file,
                            contentType: 'image/'+ext[1],
                        }
                    },
                    id: 'student1',
                    answerType: '001',
                    price: '500',
                    answerTargetType: '0',
                }
                request.post({url:'http://34.64.105.2:8080/question', formData : qForm}, function optionalCallback(err, resp, body){
                    if(resp.statusCode == 201){
                        d = JSON.parse(body);
                        var aForm = {
                            file: {
                                value: fs.createReadStream(path.join(dirUrl, (parseInt(ext[0])+1)+'.png')),
                                options: {
                                    filename: (parseInt(ext[0])+1)+'.png',
                                    contentType: 'image/png'
                                }
                            },
                            questionId:d.data._id,
                            id:'tutor1'
                        }
                        request.post({url:'http://34.64.105.2:8080/answer', formData : aForm}, function optionalCallback(err, resp, body){
                            if(resp.statusCode == 201){
                                res.statusCode=301;
                                res.setHeader('Location','http://127.0.0.1:8080/ssen/'+(parseInt(ext[0])+2));
                                // res.redirect('http://127.0.0.1:8080/ssen/'+(parseInt(ext[0])+2));
                                res.end();
                            }
                            else{
                                res.send("FAIL");
                            }
                        })
                    }
                    
                })
            }
        })

        // console.log(file);
    }
    
    // console.log(file);
    
})

// 동일 / 유사 / 심화 문항 Cosine Similarity Search 개선 필요. 2차원->차원 추가 예정. DB 서칭 알고리즘 수정. 
// 동일 문항 찾기
app.get('/question/same', function(req, res){
    console.log("IN SAME QUESTION API");
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var diff = req.query.diff;
    
    Question.find({sim_x:sim_x, sim_y:sim_y, sc:sc, ye:ye, bi:bi, mi:mi, diff:diff, answer:{$ne:null}}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({err:error})
        }
        else{
            dataArray=[];
            for(i=0;i<data.length;i++){
                console.log(i+"번째 비교");
                console.log(sim_x + " && " + sim_y);
                console.log(data[i].sim_x + " && " + data[i].sim_y + "@@");
                dataArray.push(data[i]);
            }
            const options = {
                uri:'http://34.64.181.16:5000/simillar',
                method: 'POST',
                body:{
                    q_data:{sim_x:sim_x, sim_y:sim_y},
                    dataArray:dataArray,
                },
                json:true
            };
            
            request.post(options,
                function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error(err);
                }
                else{
                    body.sort(function(a, b){
                        return b.result - a.result;
                    })
                    console.log(body);
                    var resultArr = [];
                    for(i=0;i<body.length;i++){
                        if(body[i].result >= 0.99){
                            resultArr.push(body[i]);
                        }
                    }
                    res.status(200).send({data:resultArr});
                }
                
            });
        }
    })
})

// 유사 문항 찾기
// stressed hold check. 1차 범위 추론 값 0.99
app.get('/question/simillar', function(req, res){
    var sim_x = req.query.sim_x;
    var sim_y = req.query.sim_y;
    var sc = req.query.sc;
    var ye = req.query.ye;
    var bi = req.query.bi;
    var mi = req.query.mi;
    var diff = req.query.diff;
    
    Question.find({sc:sc, ye:ye, bi:bi, mi:mi, diff:diff, answer:{$ne:null}}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({err:error})
        }
        else{
            dataArray=[];
            for(i=0;i<data.length;i++){
                if(data[i].sim_x == sim_x && data[i].sim_y == sim_y)
                {
                    console.log("유사문항을 찾으려는 문제와 동일함");
                }
                else{
                    dataArray.push(data[i]);
                    console.log("문항 추가됨");
                }
            }
            const options = {
                uri:'http://34.64.181.16:5000/simillar',
                method: 'POST',
                body:{
                    q_data:{sim_x:sim_x, sim_y:sim_y},
                    dataArray:dataArray,
                },
                json:true
            };
            
            request.post(options,
                function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error(err);
                }
                else{
                    body.sort(function(a, b){
                        return b.result - a.result;
                    })
                    console.log(body);
                    var resultArr = [];
                    for(i=0;i<body.length;i++){
                        if(body[i].result < 0.99){
                            resultArr.push(body[i]);
                        }
                    }
                    res.status(200).send({data:resultArr});
                }
            });
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
    var diff = req.query.diff;
    
    var deepen = "1";
    if(diff == "0"){
        deepen = "1";
    }
    else if(diff == "1"){
        deepen = "2";
    }
    else if(diff == "2"){
        deepen = "3";
    }
    else if(diff == "3"){
        deepen = "3";
    }
    Question.find({sc:sc, ye:ye, bi:bi, mi:mi, diff:deepen, answer:{$ne:null}}).exec(function (error, data){
        if(error){
            console.log(error);
            res.status(500).send({err:error})
        }
        else{
            dataArray=[];
            for(i=0;i<data.length;i++){
                if(data[i].sim_x == sim_x && data[i].sim_y == sim_y)
                {
                    console.log("심화문항을 찾으려는 문제와 동일함");
                }
                else{
                    dataArray.push(data[i]);
                    console.log("문항 추가됨");
                }
            }
            const options = {
                uri:'http://34.64.181.16:5000/simillar',
                method: 'POST',
                body:{
                    q_data:{sim_x:sim_x, sim_y:sim_y},
                    dataArray:dataArray,
                },
                json:true
            };
            
            request.post(options,
                function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error(err);
                }
                else{
                    body.sort(function(a, b){
                        return b.result - a.result;
                    })
                    console.log(body);
                    res.status(200).send({data:body});
                }
                
                // res.status(201).send({msg:body});
            });
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
    sc: fields.sc, ye: fields.ye, bi: fields.bi, mi:fields.mi, diff: fields.diff, calcTime: fields.calcTime, sc_p: fields.sc_p, ye_p: fields.ye_p, bi_p: fields.bi_p, mi_p:fields.mi_p, sim_x:fields.sim_x, sim_y:fields.sim_y })
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

// 메인화면 컨텐츠 좋아요 / 댓글 기능 구현 필요. 시연 이후
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

// 탑 튜터 30% 이내 서칭 수정 필요. 시연까지 dummy data.
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
