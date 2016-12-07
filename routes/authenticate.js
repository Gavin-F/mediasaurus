var express = require('express');
var router = express.Router();

module.exports = function(passport){

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user._id : null});
		//res.send(true);
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log in via Facebook
    router.post('/login/facebook', passport.authenticate('facebook'));

    router.post('/login/facebook/return', passport.authenticate('facebook'), {failureRedirect: '/login'}),
        function(req, res) {
            res.redirect('/');
        }

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

    return router;

}
