//var os = require('os');
var fs = require('fs');
//var dns = require('dns');
var chalk = require('chalk');
const mailer = require('nodemailer');
var mongooes = require('mongoose');
var Track = mongooes.model('Tracking');
var config = JSON.parse(fs.readFileSync('config.json'));
//var interfaces = os.networkInterfaces();
//Object.keys(interfaces).forEach(function(name){
//    interfaces[name].forEach(function(type){
//        ipaddress.push({
//            address : type.address,
//            family : type.family,
//            mac : type.mac
//        });
//    });
//});

exports.home =function(req,res){
    //console.log(chalk.green(req.info.remoteAddress));
    res.render('profile');
}

exports.ip = function(req,res){
    var ipaddress = req.params.ipaddress;


    res.send(ipaddress);
}

exports.email = function(req,res){
    var error = '';
    var success = '';
    var name = req.body.full_name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;

    if(name == '' || name == null){
        error = 'Enter your name.';
    }else if(email == ''  || email == null || email.indexOf('@')==-1){
        error = 'Enter correct email.';
    }else if(subject == '' || subject == null){
        error = 'Subject is must';
    }else if(message == '' || message == null){
        error = 'Your message is empty';
    }

    let transpoter = mailer.createTransport({
        service: 'gmail',
        port:25,
        secure:false,
        auth:{
            user:config.username,
            pass:config.password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    let mailOptions = {
        from: name+'<'+email+'>',
        to: 'pnaren93@gmail.com',
        subject: subject,
        text: message+' \n <'+email+'>'
    };


    transpoter.sendMail(mailOptions,function(err,info){

        if(err){
            error = err;
            return  console.log(chalk.red(err));
        }

        if(error!==''){
            res.render('profile',{error:error,redirect:'/',success:success,class:'hide'});
        }else{
            console.log(chalk.green('Message sent successfully: '+info.messageId));
            success = 'Message sent successfully';
            res.render('profile',{error:error,redirect:'/',success:success,prop:'hide'});
        }

    });

}

exports.save = function(req,res){

    var ipaddress = req.body.ipaddress;
    var like = req.body.like;
    var views = req.body.views;
    var browser = new Track();
    browser.ipaddress = ipaddress;
    browser.like = like;
    browser.views =views;

    Track.findOne({ipaddress:ipaddress},function(err,record){

        if(err){
            console.log(chalk.red('Not Found'));
            res.status(400).send("Failed");
        }else if(record == null){
            browser.save(function(err,saved){
                if(err){
                    console.log(chalk.red("Unable to save."));
                    res.status(400).send("Failed");
                }else{
                    console.log(chalk.blue("Entry saved."));
                    res.status(201).json(saved);
                }
            });
        }else{
            Track.findOneAndUpdate({ipaddress:ipaddress},{like:like},function(err,updated){
                res.status(200).json(updated);
            });

        }  
    });

}

exports.retrive = function(req,res){
    Track.count({like:1},function(err,count){
        if(err){
            console.log(chalk.red('No entries in database found'));
            res.status(404).send("No entries found.");
        }
        res.status(200).json(count);
    });


}

exports.checkLikesByIP = function(req,res){
    let ip = req.params.ip;
    
    Track.findOne({ipaddress:ip},function(err,data){
        if(err){
            res.status(404).send("No entries found.");
            return;
        }
       res.status(200).json(data); 
    });
}

exports.views = function(req,res){

    Track.count({views:1},function(err,count){
        if(err){
            console.log(chalk.red('No entries in database found'));
            res.status(404).send("No entries found.");
        }
        res.status(200).json(count);
    });


}



