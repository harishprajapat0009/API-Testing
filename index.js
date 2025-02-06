const express = require('express');

const port = 9002;

const app = express();

const db = require('./config/db');

const session = require('express-session');
const passport = require('passport');
const JwtStrategy = require('./config/passport-jwt-strategy');

app.use(express.urlencoded());

app.use(session({
    name : 'user',
    secret : 'userkey',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'))

app.listen(port, (err) => {
    if(err){
        console.log(err);
        return false
    }
    console.log("server is running on port :", port)
})