const express = require("express");
const app = require("./app.js");
/*
We are going to do a couple of things. First, we will create an array that represent a place of storage. Normally that would a database but an array will work here
Second, we  are not going to create other routers, we will be using app directly; Because the app functionality 
is not that complex to require that.
*/

//Create the array holder for messages
const envolope = [];
//The structure of the envolopes is: Id(number),Title(String),amount(Number)

app.post("/envolope",(req,res,next) =>{
    
//We are going to assume that the information is in the body of the  request.
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
    // create the envolope, store it into the  array, then Send the message.
    const object = {id, title, amount};
    envolope.push(object);
    res.status(200).send(object);
}





});

module.exports = app