const express = require('express');

const routes = express.Router();

const homeCtl = require('../controllers/HomeControolers');

const passport = require('passport');

const UserModel = require('../models/UserModel');

routes.get('/', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}) , homeCtl.getData);

routes.get('/unauthorised', async (req, res) => {
    return res.status(400).json({msg : "User unauthorised"})
})

routes.post('/addData', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}), UserModel.uploadimageFile , homeCtl.addData);

routes.delete('/deleteData/:id', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}) , homeCtl.deleteData);

routes.get('/getsingleData', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}) , homeCtl.getsingleData);

routes.put('/updateData', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}), UserModel.uploadimageFile , homeCtl.updateData);

routes.get('/changeStatus', passport.authenticate('jwt', {failureRedirect : '/unauthorised'}), homeCtl.changeStatus);

routes.post('/multiDelete', homeCtl.multiDelete);

// Auth Routes
routes.use('/auth', require('./AuthRoutes'))

module.exports = routes;