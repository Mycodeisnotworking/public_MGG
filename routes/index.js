var express = require('express');
var router = express.Router();
var mysql=require('../public/javascripts/config');
var gstore=new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sql="select * from game_google_tb limit 20";
  mysql.db.query(sql)
  .then((rows)=>{
    res.render('index',{ title: '뭐해야될지 궁금해? 모갓겜!', rows: rows } );
  })
  .catch(console.log);
});

module.exports = router;
