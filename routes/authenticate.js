var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var authHelper = require('../helpers/authHelper');

module.exports = function(passport){

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        return res.send({state: 'success', user: req.user ? req.user._id : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        return res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	
	router.route('/users/:uid')
		.put(function(req,res){
			User.findById(req.params.uid, function(err, user){
			if(err) return res.status(400).send({error:err});
				
				// password not valid don't change anything
				if( !authHelper.isValidPassword(user, req.body.password) )
					return res.status(401).send({error: {message:'bad password'}});
				
				// set the user's local credentials
				user.password = authHelper.createHash(req.body.newPassword);
				user.email = req.body.email;
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				
				user.save(function(err){
					if(err) return res.status(304).send({error: {message:'problem saving user info'}});
					return res.send(200);
				})
			});	
			
		});
	
    return router;
}
