const UserModel = require('../models/UserModel')

module.exports.getData = async (req, res) => {
    try{
        let userData = await UserModel.find();
        if(userData){
            return res.status(200).json({msg : "get data successfully", data : userData})
        }
        else{
            return res.status(200).json({msg : "Something went wrong"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.addData = async (req, res) => {
    try{
        let userData = await UserModel.create(req.body);
        if(userData){
            return res.status(200).json({msg : "User added successfully", data : userData})
        }
        else{
            return res.status(200).json({msg : "Something went wrong"})
        }
        
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.deleteData = async (req, res) => {
    try{    
        let deleteData = await UserModel.findByIdAndDelete(req.params.id);
        if(deleteData){
            return res.status(200).json({msg : "User deleted successfully"})
        }
        else{
            return res.status(200).json({msg : "Something went wrong"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.getsingleData = async (req, res) => {
    try{
        let getData = await UserModel.findById(req.query.dataId);
        if(getData){
            return res.status(200).json({msg : "Data found successfully", data : getData})
        }
        else{
            return res.status(200).json({msg : "Data not found"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.updateData = async (req, res) => {
    try{
        let getData = await UserModel.findById(req.body.userId);
        if(getData){
            let updateData = await UserModel.findByIdAndUpdate(getData._id, req.body)
            if(updateData){
                let newData = await UserModel.findById(getData._id);
                if(newData){
                    return res.status(200).json({msg : "Data updated successfully", data : newData});
                }
                else{
                    return res.status(200).json({msg : "New data not found"});
                }
            }
            else{
                return res.status(200).json({msg : "Data not updated"})
            }
        }
        else{
            return res.status(200).json({msg : "Data not found"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

