var express = require('express');
// import 'axios' module
const axios = require('axios');
// Encoding QueryString 
const qs = require('querystring');
// File Stream
var fs = require('fs');

var app = express();
var client_id = 'Bx3k9QA02ShYeDVyLQpf';
var client_secret = 'DvfCZekAZs';

app.get('/naverSearchAPI/:query', function (req, res) {

  console.log('::: naverSearchAPI is called.');
  console.log('::: Search Keyword : ' + req.params.query);

  var config = {
    headers: {
      'X-Naver-Client-Id' : 'dKOtBRuD3Lq5XXkoQS07',
      'X-Naver-Client-Secret' : 'Utv6o9mrTL'
    }
  };

  var textStr = '';
  var resultStr;
  // for Browser Print
  var htmlStr = '<p><b><font color="orange">[ Search Keyword ]</font></b></p>'+
                '<b>' + req.params.query + '</b><br><br>' +
                '<p><b><font color="blue">[ (KR) Original Sarch Result ]</font></b></p>';

  // NAVER Search NEWS API 
  axios.get(
    `https://openapi.naver.com/v1/search/news.json?query=${qs.escape(req.params.query)}&display=1&start=1&sort=date`,
    config
  )
    .then( response=>{
     
      res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
      
      // papagoNMT Setting variables
      var papagoNMTStr;
      var papagoNMTJSON;
      var koResultArray = [];

      // papagoNMT node.js file load
      var papagoQuery = require('./papagoNMTTrans.js');
      
      // make for Browser HTML String
      for ( var i=0 ; i < response.data.items.length; i++) {
        htmlStr += response.data.items[i].description + '<br>';
        textStr += response.data.items[i].description + '.';
        koResultArray.push(response.data.items[i].description);
      }

      htmlStr += '<br><p><b><font color="green">[ (EN) Translated Search Result ]</font></b></p>';

      var message = "";

      // Promise() #1 : PapagoNMT Execute & Result
      var papagoNMTResult = new Promise((resolve, reject) => {

        var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
        var request = require('request');

        // PapagoNMT HTTP Options
        var options = {
            url: api_url,
            form: {'source':'ko', 'target':'en', 'text':textStr},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };

        request.post(options, function (error, response, body) {   
          message = JSON.parse(body);
          // retrun callback function
          resolve(message);
        });

      })

      // Promise() #2 : Clova CSS Execute & File Save
      var clovaCSSResult = new Promise((resolve, reject) => {

        var tranTextStr = fs.readFileSync('./trans_text_file/translatedText.txt', 'utf8');
        console.log(tranTextStr);

        var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';
        var request = require('request');
        var options = {
            url: api_url,
            form: {'speaker':'clara', 'speed':'2', 'text':tranTextStr},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };

        var writeStream = fs.createWriteStream('./make_css_file/news_en.mp3');
        var _req = request.post(options).on('response', function(response) {
          console.log(response.statusCode) // 200
          console.log(response.headers['content-type'])
        });

        _req.pipe(writeStream); // file로 출력
       
      })

      // PapagoNMT 실행 후 번역된 텍스트를 파일로 저장 
      var papagoResult = (results) => { 
        resultStr = JSON.stringify(results);
        var resultJSON = results[0].message.result.translatedText;

        htmlStr += resultJSON + '<br><br>';

        fs.unlink('./trans_text_file/translatedText.txt');
        fs.appendFileSync('./trans_text_file/translatedText.txt', resultJSON);

        res.write(htmlStr);
        res.end();
      }

      var cssResult = (results) => { 
        console.log('cssResult is called');
      }

      // Execute Promise.all() 
      Promise.all([papagoNMTResult]).then(papagoResult);
      Promise.all([clovaCSSResult]).then(cssResult);

    })
    .catch( error =>{
      console.log( error );
    })

});

app.listen(3000, function () {
  console.log('::: MyTranlation Service App listening on port 3000!');
});