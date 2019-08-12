var express = require('express');
var router = express.Router();
const baseUrl = require('./../helper/base_url').baseurl
const _  = require('lodash')
const request = require('request')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome'});
});

router.post('/login', function(req, res, next) {
 
  // req.session.name = 'Flavio'
  console.log(req.body)
  const userLogin = _.pick(req.body, ['username','password'])
  console.log(userLogin)
  const options = {
    method: 'POST',
    url: process.env.API_URL+'user/auth',
    json : userLogin  
  };
  request(options, function(err, response, body) {
  console.log(response.statusCode)
  if(response.statusCode==200){
    req.session.userdata = body.response
    res.redirect(baseUrl(req)+'/home');
    // res.render('home', { title: 'My Home',status:true});
  }else{
    res.render('index', { title: 'Welcome',statuslogin:body.response});
  }
})
})



router.get('/home', function(req, res, next) {
  
  res.render('home', { title: 'Start'});


})
router.post('/checkword', function(req, res, next) {
  const token = req.session.userdata.token
  const wordData = _.pick(req.body, ['word','level'])
  const options = {
    headers: {
      'authorization' : 'STK '+token
    },
    method: 'POST',
    url: process.env.API_URL+'word/checkWord',
    json : wordData  
  };
  request(options, function(err, response, body) {
  res.status(200).send({'status':true})
  if(err)res.status(200).send({'status':false})
})


})

router.get('/score', function(req, res, next) {
  const token = req.session.userdata.token
  // console.log(req.session.userdata)
  // console.log(token)
  const options = {
    headers: {
      'authorization' : 'STK '+token
    },
    method: 'GET',
    url: process.env.API_URL+'score/detail',
    json : true  
  };
  request(options, function(err, response, body) {
  if(response.statusCode==200){
    const dataUSer = { level: body.response.level,score:body.response.score}
    getQuestion(dataUSer,token,req,res)
    // res.render('score', { level: body.response.level,score:body.response.score});
    
    // res.redirect(baseUrl(req)+'/home');
  }
})
})

function getQuestion(dataUSer,token,req,res){
  
  const options = {
    headers: {
      'authorization' : 'STK '+token
    },
    method: 'GET',
    url: process.env.API_URL+'word/getWord?level='+dataUSer.level,
    json : true  
  };
  request(options, function(err, response, body) {
 var ask =""
  if(dataUSer.level==1) {
     ask = 'startup teknologi periklanan yang, secara revolusioner, menghubungkan brand, pengemudi dan konsumen lewat iklan yang menggunakan kendaraan sebagai medium' 
  }
  if(dataUSer.level==2){
     ask = 'Anthony Tan mendirikan startup OJOL Bernama ?'
  }
  if(dataUSer.level==3) {
    ask = 'Persaingan perusahaan startup sangat ketat salah satu yang tidak dapat bersaing ?'
  }
  console.log(ask,'aaaaaaaaaaaaa')
  if(response.statusCode==200){
    res.render('score', { level: dataUSer.level,score:dataUSer.score,question:body.response,wordquestion:ask});
  }
})
}





module.exports = router;
