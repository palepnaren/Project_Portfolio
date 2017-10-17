//var chalk = require('chalk');
//const Knex = require('knex');
//
//const knex = connect();
//
//
//function connect(){
//    
//    const config ={
//        host:'35.184.77.86',
//        user:'naren',
//        password:'naren',
//        database:'portfolio' 
//    };
//    
//    const knex = Knex({
//        client:'mysql',
//        connection:config
//    });
//    
//    console.log(chalk.green('connection established with google mysql cloud'));
//    
//    return knex;
//}
//
//function getData(knex){
//    return knex.select()
//    .from('likes')
//    .then(function(results){
//        return resilts;
//    });
//}
//
//var result = getData(knex);
//console.log(chalk.blue(result.length));