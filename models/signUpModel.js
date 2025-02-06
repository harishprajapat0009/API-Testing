const mongoose = require('mongoose');

const signUpSchema = mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const SignUpModel = mongoose.model('SignUpModel', signUpSchema);

module.exports = SignUpModel;