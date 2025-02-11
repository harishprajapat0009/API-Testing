const UserModel = require('../models/UserModel')
const path = require('path');
const fs = require('fs');

module.exports.getData = async (req, res) => {
    try{
        // Pagination
        let perPage = 2;
        let Page = 0;

        if(req.query.page){
            Page = req.query.page
        }

        //Search 
        let Search = '';
        if(req.query.search){
            Search = req.query.search;
        }

        // Sorting
        if(req.query.sortBy == "asc"){
            var userActiveData = await UserModel.find({status : true,
                $or : [
                        {name : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                    ]
            }).sort({name : 1}).skip(Page * perPage).limit(perPage);
            
            var userDeactiveData = await UserModel.find({status : false,
                $or : [
                        {name : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                    ]
            }).sort({name : 1}).skip(Page * perPage).limit(perPage);
       }
       else{
            var userActiveData = await UserModel.find({status : true,
                $or : [
                        {name : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                    ]
            }).sort({name : -1}).skip(Page * perPage).limit(perPage);

            var userDeactiveData = await UserModel.find({status : false,
                $or : [
                        {name : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                    ]
            }).sort({name : -1}).skip(Page * perPage).limit(perPage);
       }

        let totalData = await UserModel.find({status : true,
            $or : [
                    {name : {$regex : Search, $options : 'i'}},
                    {email : {$regex : Search, $options : 'i'}}
                ]
        }).countDocuments();

        let TotalCounts = Math.ceil(totalData/perPage);

        if(userActiveData || userDeactiveData){
            return res.status(200).json({msg : "get data successfully", userActiveData, userDeactiveData, Search : req.query.search, Page, TotalCounts})
        }
        else{
            return res.status(400).json({msg : "Something went wrong"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.addData = async (req, res) => {
    try{
        let checkUser = await UserModel.findOne({email : req.body.email});
        if(!checkUser){
            var image = ''
            if(req.file){
                image = UserModel.imgPath + '/' + req.file.filename;
            }
            req.body.userImage = image;
            let userData = await UserModel.create(req.body);
            if(userData){
                return res.status(200).json({msg : "User added successfully", data : userData})
            }
            else{
                return res.status(400).json({msg : "Something went wrong"})
            }
        }
        else{
            return res.status(400).json({msg : "email already exists"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.deleteData = async (req, res) => {
    try{    
        let getData = await UserModel.findById(req.params.id);
        if(getData){
            let deleteImg = path.join(__dirname, '..', getData.userImage);
            await fs.unlinkSync(deleteImg);

            let deleteData = await UserModel.findByIdAndDelete(req.params.id);
            if(deleteData){
            return res.status(200).json({msg : "User deleted successfully"})
            }
        }
        else{
            return res.status(400).json({msg : "Data not found"})
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
            return res.status(400).json({msg : "Data not found"})
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
            if(req.file){
                try{
                    // Delete old image 
                    let deleteImg = path.join(__dirname, '..', getData.userImage);
                    await fs.unlinkSync(deleteImg);
                    // Insert new image
                }
                catch(err){
                    console.log("image not found")
                }

                let newImage = UserModel.imgPath + '/' + req.file.filename;
                req.body.userImage = newImage;
            }
            else{
                req.body.userImage = getData.userImage;
            }

            let updateData = await UserModel.findByIdAndUpdate(getData._id, req.body)
            if(updateData){ 
                let newData = await UserModel.findById(getData._id);
                if(newData){
                    return res.status(200).json({msg : "Data updated successfully", data : newData});
                }
                else{
                    return res.status(400).json({msg : "New data not found"});
                }
            }
            else{
                return res.status(400).json({msg : "Data not updated"})
            }
        }
        else{
            return res.status(400).json({msg : "Data not found"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.changeStatus = async (req, res) => {
    try{
        let checkUser = await UserModel.findById(req.query.userId);
        if(checkUser.status){
            let updateStatus = await UserModel.findByIdAndUpdate(req.query.userId, {status : false});
            if(updateStatus){
                return res.status(200).json({msg : "Status deactivate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
        else{
            let updateStatus = await UserModel.findByIdAndUpdate(req.query.userId, {status : true});
            if(updateStatus){
                return res.status(200).json({msg : "Status activate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};


module.exports.multiDelete = async (req, res) => {
    try{ 
        // delete Image
        let getData = await UserModel.find({_id : {$in : req.body.Ids}});

        getData.map(async (v,i) => {
            if(v.userImage){
                let deleteImg = path.join(__dirname, '..', v.userImage);
                await fs.unlinkSync(deleteImg);
            }
        })
        
        // delete Data
        let deletedUsers = await UserModel.deleteMany({_id : {$in : req.body.Ids}});
        if(deletedUsers){
            return res.status(200).json({msg : "Selected users deleted", deletedUsers : getData});
        }
        else{
            return res.status(400).json({msg : "Users not deleted"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};
