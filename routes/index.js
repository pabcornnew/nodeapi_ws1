var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express 4.16.1' });
});

router.get('/test', function (req, res, next) {
  res.render('test', { title: 'Test' });
})

module.exports = router;
