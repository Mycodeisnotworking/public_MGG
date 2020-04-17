var express = require('express');
var router = express.Router();
const mysql=require('../public/javascripts/config');
const crypto=require('crypto');

function encryptPasswd(passwd){
  return crypto.createHash('sha256').update(passwd).digest('hex');
}
/* GET home page. */
router.get('/', function(req, res, next) {
  mysql.db.query("select * from game_google_tb")
  .then((rows)=>{
    res.render('login', {title: '뭐해야될지 궁금해? 모갓겜!', rows: rows});
  });
});

router.post('/', (req, res, next)=>{
  const id=req.body.id;
  const passwd=encryptPasswd(req.body.passwd);

  const selectQuery="select * from members_tb where id=?";

  mysql.db.query(selectQuery, id)
  .then((rows)=>{
    if(rows.length!=0)
    {
      if(rows[0].passwd == passwd)
      {
        res.send(true);
      }
    }
    res.send(false);
  });
});

module.exports = router;
