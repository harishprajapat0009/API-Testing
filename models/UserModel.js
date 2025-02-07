const mongoose = require('mongoose');

const path = require('path');

const imagePath = '/uploads';

const multer = require('multer');


const UserSchema = mongoose.Schema({
    name : {
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
    },
    gender : {
        type : String,
        required : true
    },
    hobby : {
        type : Array,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    userImage : {
        type : String,
        required : true
    }
},
{timestamps : true});

const imageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath))
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

UserSchema.statics.uploadimageFile = multer({storage : imageStorage}).single('image')
UserSchema.statics.imgPath = imagePath;

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;