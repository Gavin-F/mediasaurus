

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');

var tmdb = require('../api/tmdb_api');
var algorithms = require('./algorithms');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

router.route('/movies/preferences/:id')

	/*
	 * Responds with a list of the user's movie likes/dislikes.
	 *
	 * Request:
	 *		_id: string; same _id of user that is given at login/signup
	 * Response:
	 *		list of user's movie likes/dislikes
	 */
	.get(function(req, res) {
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) res.send(504, err);
			return res.send(user.movieProfile.preferences);
		});
	})

	/*
	 * Adds a user movie rating on movie with title movieTitle.
	 *
	 * Request:
	 *		_id: string; same _id of user that is given at login/signup
	 *		movieTitle: string; name of movie
	 *		liked: boolean; liked or disliked
	 * Response: TBD
	 */
	.post(function(req, res){
		if(req.body.movie_id === null)
			return res.send(505, 'nothing to set');
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.send(506, err);
			}
			var prefItem = {movie_id: req.body.movie_id, liked: req.body.liked};
			user.movieProfile.preferences.unshift(prefItem);
			algorithms.updateRecommendedMovies(user.movieProfile, req.body.movie_id, res);
		});
		
	})

	/*
	 * Removes the user's ratings on movie with title movieTitle.
	 *
	 * Request:
	 *		_id: string; same _id of user that is given at login/signup
	 *		movieTitle: string; name of movie
	 * Response: TBD
	 */
	.delete(function(req, res) {
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) return res.send(507, err);

			// remove all movies with movieTitle from preferences
			var preferencesArr = user.movieProfile.preferences;
			for(var i = user.movieProfile.preferences.length-1; i>=0; i--)
				if(preferencesArr[i].movie_id == req.body.movie_id){
					preferencesArr.splice(i, 1);
					if(i < 4)
						user.movieProfile.recommendations.splice(i*5, 5);
				}

			user.movieProfile.save(function(err){
				if(err) return res.send(508, err);
				return res.send(user.movieProfile);
			});	
		});
	});

router.route('/movies/recommendations/:id')
	.get(function(req, res){
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.send(509, err);
			}
				return res.send(user.movieProfile.recommendations);
			});
	});

router.route('/movies/similar/:movie_id/:page')
	.get(function(req, res){
		tmdb.getSimilarMovies(req, function(results){
			jsonResults = JSON.parse(results);
			return res.send(jsonResults.status_code ? null : jsonResults.results);
		});
	});
	
router.route('/movies/popular/:page')
	.get(function(req, res){
		tmdb.getPopularMovies(req.params.page, function(results){
			return res.send(JSON.parse(results).results);
		});
	});

router.route('/movies/now_playing/:page')
	.get(function(req, res){
		tmdb.getNowPlayingMovies(req.params.page, function(results){
			return res.send(JSON.parse(results).results);
		});
	});
	
router.route('/movies/genre/:genre_id')
	.get(function(req, res) {
		tmdb.discoverPopularByGenre(req.params.genre_id, function(results){
			return res.send(JSON.parse(results).results);
		});
	});
	
router.route('/movies/:id')
	.get(function(req, res){
		tmdb.getMovieDetails(req.params.id, function(details){
			var jsonDetails = JSON.parse(details);
			if(jsonDetails.status_code) return res.send(null);
			tmdb.getMovieCredits(req.params.id, function(credits){
				var jsonCredits = JSON.parse(credits);
				var results = [{details: jsonDetails, cast: jsonCredits.cast, crew: jsonCredits.crew}];
				return res.send(results);
			});
		});
	});

router.route('/movies/search/:page')
	/*
	 * Return 20 search results from TMDB
	 *
	 * Request:
	 *		query: string; query to send to TMDB api
	 *
	 * Response:
	 *
	 */
	.post(function(req, res){
		//TODO call search from TMDB
		tmdb.searchMovies(req, function(results){
			console.log(JSON.parse(results).results);
			return res.send(JSON.parse(results).results);
		});
	});
	
router.route('/users/:id')
	.get(function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err) return res.send(510, err);
			var userInfo = {
				username: user.username,
				email: user.email
			};
			res.send(userInfo);
		});
	});
//Register the authentication middleware
//router.use('/posts', isAuthenticated);

module.exports = router;
