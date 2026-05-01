const express = require("express");
const app = require("./app.js");
const {Pool} = require("pg");
require("dotenv").config();
const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME

});
const create_table = async () =>{
await pool.query("create table if not exists envolope(id integer primary key, title text default 'TBD', amount integer default 0)");
}
create_table();
/*
We are going to do a couple of things. First, we will connect to the database in render that represent a place of storage.
Second, we  are not going to create other routers, we will be using app directly; Because the app functionality 
is not that complex to require that.
*/


//The structure of the envolopes is: Id(number),Title(String),amount(Number)

const check_body = (req,res,next) =>{

    //We are going to assume that the information is in the body of the  request. Assuming that it's a json object
    const body = req.body;
    // We have to see weather all the information is there.
    const {id} = body
    const {title} = body;
    const {amount} = body;
    // check weather these values exist.
    const exist = id && title && amount; // Will evaluate to true if all are truthy value. Else, one of the values is missing.
    // Now for checking for  their types
    const is_title_string = isNaN(title);
    const is_id_not_number = isNaN(id);
    const is_amount_not_number = isNaN(amount);


    
    //Now, we will only store the envolope  if all the values exist and are of correct type. Otherwise, send a 404 response indicating the problem
    if(!exist){
        res.status(404).send("Missing elements");
    }
    else if(!is_title_string || is_id_not_number || is_amount_not_number){
        res.status(404).send("Wrong types for input");
    
    } 
    else{
        //store these value into the request object
        req.id = id;
        req.title = title;
        req.amount = amount;
       next();
    }
    



};





app.post("/envolope",check_body, async (req,res,next) =>{
    try{
    //First chect weather or not id already exist in the list
   let  result = await pool.query("select * from envolope where id = $1",[req.id]);


    if(result.rowCount === 0){

//create the object, send it to the array, then send the appropriate message.
  await pool.query("insert into envolope(id,title,amount) values($1,$2,$3)",[req.id,req.title,req.amount]);
res.status(201).send("envolope saved");
    }
    else{
        res.status(500).send("envolope already exist");
    }
    
    }
    catch(err){
        next(err);
    }
   

});



app.get("/envolope" , async (req,res,next) =>{
try{
//Query all the rows from the envolopes table and send the array as a json
const result = await pool.query("select * from envolope order by id desc");
res.json(result.rows);

}
catch(err){
    next(err);
}

});


app.get("/envolope/:id", async(req,res,next) => {

const query = await pool.query("select * from envolope where id = $1",[Number(req.params.id)]);



if(query.rowCount !==0){
res.json(query.rows[0]);
}
else{
    res.status(404).send("envolope Don't exist");
}


});



app.put("/envolope/:id/:amount",async (req,res,next) =>{
let query = await pool.query("select * from envolope where id = $1",[Number(req.params.id)]);

if(query.rowCount === 0){
    res.status(404).send("Envolope not found");
}
else if(query.rows[0].amount === 0 || Number(req.params.amount) > query.rows[0].amount){
    res.status(404).send("Not allowed to take money.");
}
else{
const new_amount = query.rows[0].amount - Number(req.params.amount);
query = await pool.query("update  envolope  set amount = $1 where id = $2",[new_amount,Number(req.params.id)]);
query = await pool.query("select *  from envolope where id = $1",[Number(req.params.id)]);
res.status(201).json(query.rows[0]);



}




});




app.delete("/envolope/:id",async (req,res,next)=>{
// First check if it exist
let query = await pool.query("select * from envolope where id = $1",[Number(req.params.id)]);

if(query.rowCount === 0){
    res.status(404).send("Envolope not found");
}
else{


 query = await pool.query("delete from envolope where id = $1",[Number(req.params.id)]);

res.status(204).send();
}

});


app.use((err,req,res,next) =>{

console.log(err.stack);
res.status(500).send(err.stack);
});




module.exports = app