const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.SECRET_KEY

const verifyToken = (req,res,next) => {

}