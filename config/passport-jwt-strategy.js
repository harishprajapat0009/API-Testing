const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'tokenAccessKey'
}

const SignUpModel = require('../models/signUpModel');

passport.use(new JwtStrategy (opts, async function(payload, done) {
    let checkUser = await SignUpModel.findOne({email : payload.userData.email});
    if(checkUser){
        return done(null, checkUser);
    }
    else{
        return done(null, false);
    }
}));

passport.serializeUser(function(user, done) {
    return done(null, user.id)
});

passport.deserializeUser(async function(id, done) {
    let userRecord = await SignUpModel.findById(id);
    if(userRecord){
        return done(null, userRecord);
    }
    else{
        return done(null, false);
    }
})

module.exports = passport