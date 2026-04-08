const express  = require("express");
const app = express();
const parser = require("body-parser");
const morgan = require("morgan");
//From here the app will start, but the listening part will be in the main.js file.

//We will have a body parser that will  parse the json object into a js object under req.body.

app.use(parser.json());
//for logging purposes.
app.use(morgan("tiny"));


















module.exports = app;