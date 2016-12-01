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

    // suggestedMovies: {
    //   type: [{movie: String}],
    //   validate: [arrayLimit, '{PATH} exceeds the limit of 20']
    // }
});

// // Validate limit http://stackoverflow.com/questions/28514790/how-to-set-limit-for-array-size-in-mongoose-schema/29418656#29418656
// function arrayLimit(val){
//   return val.length <= 20;
// }

var postSchema = new Schema({
    created_by: { type: Schema.ObjectId, ref: 'User' },
    created_at: {type: Date, default: Date.now},
    text: String
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
mongoose.model('Post', postSchema);
mongoose.model('MovieProfile', movieProfileSchema);
