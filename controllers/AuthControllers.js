const SignUpModel = require('../models/signUpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signUp = async (req, res) => {
    try{
        let isEmailExist = await SignUpModel.find({email : req.body.email}).countDocuments();
        if(isEmailExist == 0){
            if(req.body.password == req.body.cnfPassword){

                //bcrypt password
                req.body.password = await bcrypt.hash(req.body.password, 10);

                let signupUser = await SignUpModel.create(req.body);
                if(signupUser){
                    return res.status(200).json({msg : "User register successfully", data : signupUser})
                }
                else{
                    return res.status(200).json({msg : "User not register"})
                }
            }
            else{
                return res.status(200).json({msg : "Password and Confirm password not match! Please try again"})
            }
        }
        else{
            return res.status(200).json({msg : "Email already Exist! Please try with another email"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.signIn = async (req, res) => {
    try{
        let checkEmail = await SignUpModel.findOne({email : req.body.email})
        if(checkEmail){
            let checkPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            
            if(checkPassword){
                let token = await jwt.sign({userData : checkEmail},"tokenAccessKey")
                return res.status(200).json({msg : "login successfully", token : token})
            }
            else{
                return res.status(200).json({msg : "Password is wrong! Please try again"})
            }
        }
        else{
            return res.status(200).json({msg : "Email is wrong! Please try again"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};