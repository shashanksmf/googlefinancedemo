/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
var jsdom = require("node-jsdom");
var fs = require('fs');
var jquery = fs.readFileSync(path.join(__dirname+"/server/jquery.js"));

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();


app.use(express.static(__dirname + '/dist'));
app.get('/', function response(req, res) {
  
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/getFinanceData', function response(req, res) {
    jsdom.env({
    url: "https://www.google.com/finance",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
    
    var marketArr = []; 
    var marketTableDom = window.$(".quotes")[0].children[0];
    for(var i=0;i<marketTableDom.children.length;i++){  
       for(var j=0;j<marketTableDom.children[i].children.length;j++){
         if(j==0) {
            marketArr[i] = {};
            marketArr[i].symbol = marketTableDom.children[i].children[j].children[0].innerHTML;
            console.log("marketArr[i].symbol",marketArr[i].symbol)
          }
          else if(j==1) {
            marketArr[i].price = marketTableDom.children[i].children[j].children[0].innerHTML;
          }
          
          else if(j==2){
            marketArr[i].change = marketTableDom.children[i].children[j].children[0].innerHTML;
            marketArr[i].changePer = marketTableDom.children[i].children[j].children[1].innerHTML;
          }


       }

    }  
      res.json(marketArr);
  }
   
}); 

    
    
  });



app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
