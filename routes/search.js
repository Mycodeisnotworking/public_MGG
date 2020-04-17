var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('search', { title: '뭐해야될지 궁금해? 모갓겜!'});
});

module.exports = router;
