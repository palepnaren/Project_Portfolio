var express = require('express');
var session = require('express-session');
var db = require('./db/mongo.js');
var chalk = require('chalk');
var os = require('os');
var bodyParser = require('body-parser')
var routes = require('./routes/routes.js');
var app = express();


app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:"jajbdddjhsauqusavxhjvjjhxjajX", resave: false, saveUninitialized: false}));


app.get('/',routes.home);
app.get('/ip/:ipaddress',routes.ip);
app.post('/email',routes.email);
app.post('/save',routes.save);
app.get('/getlikes',routes.retrive);
app.get('/getVews',routes.views);
app.get('/likes/:ip',routes.checkLikesByIP);

var port = process.env.PORT || 9000;
app.listen(port,function(req,res){
    console.log(chalk.blue("Server started on port:"+port));
});



