var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var allGenres = require(('./genres.json'));

var userSchema = new Schema({
    username: String,
    password: String, //hash created from password
	email: String,
    created_at: {type: Date, default: Date.now},
	
	firstName: String,
	lastName: String,
	
	movieSetup: {type: Boolean, default: false},
	movieProfile: {type: Schema.ObjectId, ref: 'MovieProfile'}
});

var movieProfileSchema = new Schema({
	genres: {type: [{genre_id: Number, weight: Number}], default: generateDefaultGenres()},
	rating: Number,
	length: Number,
	
	preferences: [{movie_id: Number, liked: Boolean}],
	recommendations: [{movie_id: Number, title: String, poster_path: String, vote_average: Number}]
});

function generateDefaultGenres(){
  var defaultList = [];

  allGenres.forEach(function(entry){
    var g = {genre_id: entry.id, weight: 1};
    defaultList.push(g);
  });

  return defaultList;
}

mongoose.model('User', userSchema);
mongoose.model('MovieProfile', movieProfileSchema);
