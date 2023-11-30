const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

let port = 3000;

app.get('/',(req,res) => {
    res.status(200).send('News Aggregator API application!!');
});

app.listen(port , (err,res) =>{
    if(!err){
        console.log(`Server is running on ${port}`);
        }else{
            console.log("Error in starting server");
            }
});
