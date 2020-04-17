var express = require('express');
var router = express.Router();
const mysql=require('../public/javascripts/config');
const crypto=require('crypto');

const errMysqlMsg="데이터 베이스 조회 불가. 다시 시도해 주세요";

function encryptPasswd(passwd){
    return crypto.createHash('sha256').update(passwd).digest('hex');
}

/* GET home page. */
router.get('/', function(req, res, next) {
    mysql.db.query("select * from game_google_tb")
    .then((rows)=>{
        res.render('joinform', {title: '뭐해야될지 궁금해? 모갓겜!', rows: rows});
    });
});

router.post('/', (req, res, next)=>{
    const name=req.body.name;
    const nickname=req.body.nickname;
    const id=req.body.id;
    var passwd=req.body.passwd;
    const email=req.body.email;
    const membertype=(req.body.membertype=="일반") ? 0 : 1;
    const insertQuery="insert into members_tb (id, passwd, member_type, nickname, member_point, username, email, joindate) values (?, ?, ?, ?, ?, ?, ?, now())";
    passwd=encryptPasswd(passwd);
    var datas = [id, passwd, membertype, nickname, 0, name, email];

    mysql.db.query(insertQuery, datas)
    .then(()=>{
        res.send(true);
    })
    .catch(()=>{
        res.send(false);
    });
});

router.post('/idcheck', (req, res)=>{
    const takenId=JSON.stringify(req.body.id);
    const idCheckQuery="select * from members_tb where id="+takenId;

    mysql.db.query(idCheckQuery)
    .then((rows)=>{
        var length=rows.length;
        if(length<=0){
            res.send(true);//해당 id 사용가능
        }
        else{
            res.send(false);//해당 id 사용 불가
        }
    })
    .catch(()=>{
        res.send(errMysqlMsg);
    });
});

router.post('/nicknamecheck', (req, res)=>{
    const takenNickName=JSON.stringify(req.body.nickname);
    const nicknameCheckQuery="select * from members_tb where nickname="+takenNickName;
    
    mysql.db.query(nicknameCheckQuery)
    .then((rows) =>{
        var length=rows.length;
        if(length<=0){
            res.send(true);//해당 닉네임 사용 가능
        }
        else{
            res.send(false);//해당 닉네임 사용 불가(중복 존재)
        }
    })
    .catch(()=>{
        res.send(errMysqlMsg);
    });
})

module.exports = router;
