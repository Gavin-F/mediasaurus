// Middleware
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');   
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');

var authHelper = require('./authHelper');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
		//console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
            console.log('deserializing user:',user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        //console.log('User Not Found with username '+username);
                        return done(null, false);                 
                    }
                    // User exists but wrong password, log the error 
                    if (!authHelper.isValidPassword(user, password)){
                        //console.log('Invalid Password');
                        return done(null, false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
					//console.log('Successful login');
					return done(null, user);
                }
            );
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // find a user in mongo with provided username
            User.findOne({ 'username' :  username }, function(err, user) {
                // In case of any error, return using the done method
                if (err){
                    //console.log('Error in SignUp: '+err);
                    return done(err);
                }
                // already exists
                if (user) {
                    //console.log('User already exists with username: '+username);
                    return done(null, false);
                } 
				else {
                   User.findOne({'email' : req.body.email}, function(errE, userE){
					   if(errE) return done(errE);
					   if(userE){
						   //console.log('User already exists with this email: ' + req.body.email);
						   return done(null, false);
					   }
						// if there is no user, create the user
						var newUser = new User();
						var movieProfile = new MovieProfile();
					
						// set the user's local credentials
						newUser.username = username;
						newUser.password = authHelper.createHash(password);
						newUser.email = req.body.email;
						newUser.movieProfile = movieProfile;
						
						// set name if exists
						if(req.body.firstName != null && req.body.lastName != null) {
							newUser.firstName = req.body.firstName;
							newUser.lastName = req.body.lastName;
						}
						
						// save movie profile for this user
						movieProfile.save(function(err){
							if(err) {
								//console.log('Error generating new MovieProfile' + err);
								throw err;
							}
						});

						// save the user
						newUser.save(function(err) {
							if (err){
								// console.log('Error in Saving user: '+err);  
								throw err;  
							}
							//console.log(newUser.username + ' Registration succesful ' + newUser.id);    
							return done(null, newUser);
						});
				   });
                }
            });
        })
    );
	
};