var mongoose =  require('mongoose');
var chalk = require('chalk');
var db = 'mongodb://profile:naren539@ds121345.mlab.com:21345/portfolio';

mongoose.Promise = global.Promise;

mongoose.connect(db);

mongoose.connection.on("connected", function(){
    console.log(chalk.green("Mongoose connected to" +db));
});

mongoose.connection.on("error", function(err){
    console.log(chalk.red("Mongoose connection error" +err));
});

mongoose.connection.on("disconnected", function(){
    console.log(chalk.red("Mongoose disconnected with" +db));
});


var appTracking = new mongoose.Schema({
    ipaddress:{type:String,unique:true,required:true},
    like:{type:Number},
    views:{type:Number,required:true}
});

mongoose.model('Tracking',appTracking);