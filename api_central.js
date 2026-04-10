const express = require("express");
const app = require("./app.js");
/*
We are going to do a couple of things. First, we will create an array that represent a place of storage. Normally that would a database but an array will work here
Second, we  are not going to create other routers, we will be using app directly; Because the app functionality 
is not that complex to require that.
*/

//Create the array holder for messages
let envolope = [];
//The structure of the envolopes is: Id(number),Title(String),amount(Number)

const check_body = (req,res,next) =>{

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
        //store these value into the request object
        req.id = id;
        req.title = title;
        req.amount = amount;
       next();
    }
    



};





app.post("/envolope",check_body,(req,res,next) =>{
    //First chect weather or not id already exist in the list
    let exist = false;
    for(let envolp of envolope){
        if(req.id === envolp.id){
            exist = true;
            break;
        }
    }

    if(!exist){

//create the object, send it to the array, then send the appropriate message.
const object = {id:req.id,title: req.title, amount: req.amount};
envolope.push(object);
res.status(201).send(object);
    }
    else{
        res.status(500).send("envolope already exist");
    }


});



app.get("/envolope" ,(req,res,next) =>{

res.send(envolope);

});


app.get("/envolope/:id",(req,res,next) => {

const envolope_id = Number(req.params.id);
let  found_object = null;
//use the find method in order to find the envolope.
for(let i of envolope){
if(i.id === envolope_id){
    found_object = i;
    break;
}


}
if(found_object){
res.send(found_object);
}
else{
    res.status(404).send("envolope Don't exist");
}


});



app.put("/envolope/:id/:amount",(req,res,next) =>{
const id = Number(req.params.id);
const amount = Number(req.params.amount);
//First, you look for the envolope.
const Envolope = envolope.find((envolp) =>{
return envolp.id === id;

});

if(Envolope.amount === 0 || amount > Envolope.amount){
    res.status(404).send("Not allowed to take money.");
}
else{
Envolope.amount -= amount;
res.status(201).send(Envolope);



}




});




app.delete("/envolope/:id",(req,res,next)=>{
const id = Number(req.params.id);
envolope = envolope.filter((ele) =>{

return ele.id !== id

});

res.status(204).send();

});








module.exports = app