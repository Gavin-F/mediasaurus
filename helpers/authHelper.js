// Encapsulate bCrypt functions

var bCrypt = require('bcrypt-nodejs');

module.exports = {
	// Checks password validity
	isValidPassword: function(user, password){
        return bCrypt.compareSync(password, user.password);
    },
	
	// Generates hash using bCrypt
    createHash: function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
	
}