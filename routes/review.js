var express = require('express');
var router = express.Router();
var store = require('app-store-scraper');
var gplay = require('google-play-scraper');
var db=require('../public/javascripts/config');

/* GET home page. */
router.get('/:appId', function(req, res, next) {
    var appId = JSON.stringify(req.params.appId);
    var selectQuery_google='select * from game_google_tb where appid='+appId+';';
    var selectScreenshot_google='select * from SShots_Google_Received_TB where appid=?;';
    var selectReview_google='select * from review_google_received_tb where appid=?;';
    var selectReview_user='select * from review_google_tb as r join members_tb as m on r.id = m.id where appid=?;';
    var selectGoogle_Like='select (select COUNT(case when appid=? then 1 end) from review_like_google_tb) as googlelike, (select COUNT(case when appid=? then 1 end) from review_bad_google_tb) as googlebad from DUAL;';
    var result_google, screenshots_google, reviews_google, like_google;
    var result_apple, screenshots_apple, reviews_apple;
    var result_user, screenshots_user, reviews_user;

    db.db.query(selectQuery_google)
    .then((rows)=>{
        result_google=Object.assign({}, rows[0]);
    })
    .then(()=>{
        db.db.query(selectScreenshot_google, appId)
        .then((rows)=>{
            screenshots_google=rows;
        })
        .then(()=>{
            db.db.query(selectReview_google, appId)
            .then(rows=>{
                reviews_google=rows;
            })
            .then(()=>{
                db.db.query(selectReview_user, appId)
                .then((rows)=>{
                    reviews_user=rows;
                })
                .then(()=>{
                    db.db.query(selectGoogle_Like, [appId, appId])
                    .then((rows)=>{
                        like_google=rows;
                        res.render('reviewread', { title: '뭐해야될지 궁금해? 모갓겜!', result_google: result_google, screenshots_google: screenshots_google, reviews_google, reviews_google, reviews_user, reviews_user, like_google: like_google});
                    })
                    .catch(console.log);
                })
                .catch(console.log);
            })
            .catch(console.log);
        })
        .catch(console.log);
    })
    .catch(console.log);
});

router.post('/reviewwrite', (req, res, next)=>{
    var insertQuery="insert into review_google_tb (appid, gametitle, id, playability, creativity, billingpromotion, design, story, sound, vfm, review) value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var body=req.body;
    var datas=[body.appid, body.gametitle, body.id, body.playability, body.creativity, body.billingpromotion, body.design, body.story, body.sound, body.vfm, body.reviewbody];
    console.log(datas);
    db.db.query(insertQuery, datas)
    .then((rows)=>{
        res.redirect('/');
    })
    .catch(console.log);
});

router.get('/reviewwrite/:appid', (req, res, next)=>{
    var appid=req.params.appid;
    var sql="select title from game_google_tb where appid=?";
    db.db.query(sql, appid)
    .then((rows)=>{
        res.render('reviewwrite', { title: '뭐해야될지 궁금해? 모갓겜!', appid: appid, gametitle: rows[0].title} );
    })
    .catch(console.log);
    
})

module.exports = router;
