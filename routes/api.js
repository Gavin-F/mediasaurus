// Middleware
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');

var tmdb = require('../helpers/tmdb/tmdb_api');
var justwatch = require('../helpers/just_watch/justwatch_api');
var algorithms = require('../helpers/movieRecAlgorithmsV3');

var NUM_RECENT_MOVIES = 6;
var NUM_RECS_PER_LIKE = 5;
var NUM_RECOMMENDATIONS = NUM_RECENT_MOVIES * NUM_RECS_PER_LIKE;

// Unused backend authentication protection
//Used for routes that must be authenticated.
/*function isAuthenticated (req, res, next) {
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
};*/

// Unused backend authentication protection
//Register the authentication middleware
//router.use('/movies', isAuthenticated);

router.route('/movies/preferences/:uid')

	/*
	 * Responds with a list of the user's movie likes/dislikes.
	 *
	 * params:
	 *		uid: string - user ID that is given at login/signup
	 * response:
	 *		400: error payload
	 *		200: list of user's movie likes/dislikes 
	 */
	.get(function(req, res) {
		User.findById(req.params.uid)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) res.status(400).send({error: err});
			return res.status(200).send({recommendations: user.movieProfile.recommendations, preferences: user.movieProfile.preferences});
		});
	})

	/*
	 * Adds a user movie preference on movie with ID movie_id.
	 * Also adjusts recommendations.
	 *
	 * params:
	 *		uid: string - user ID that is given at login/signup
	 * body:
	 *		movie_id: string - ID of movie to add
	 *		liked: boolean - true if liked said movie
	 * response:
	 *		304, 400: error payload
	 *		200: null
	 */
	.post(function(req, res){
		if(req.body.movie_id === null)
			return res.status(400).send({error: {message: 'nothing to set'}});
		User.findById(req.params.uid)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.status(400).send({error:err});
			}
			var prefItem = {movie_id: req.body.movie_id, liked: req.body.liked};
			user.movieProfile.preferences.unshift(prefItem);
			console.log(req.body.movie_id);
			algorithms.updateRecommendedMovies(user.movieProfile, req.body.movie_id, true, res);
		}); 
	})
	
	/*
	 * Adds multiple user movie preferences on movies with ID movie_id.
	 * Also adjusts recommendations.
	 *
	 * params:
	 *		uid: string - user ID that is given at login/signup
	 * body:
	 *		movie_ids: [string] - IDs of movies to like
	 * response:
	 *		304, 400: error payload
	 *		200: null
	 */
	.put(function(req, res) {
		if(req.body.movie_ids === null)
			return res.send(400).send({error:{message: 'nothing in ids'}});
		User.findById(req.params.uid)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			
			for(var i = 0; i < req.body.movie_ids.length; i++){
				var prefItem = {movie_id: req.body.movie_ids[i], liked: true};
				user.movieProfile.preferences.unshift(prefItem);
			}
			
			return algorithms.massUpdateRecommendedMovies(user.movieProfile, req.body.movie_ids, res);
		});
		
	})

	/*
	 * Removes a user movie preference on movie with ID movie_id.
	 * Also adjusts recommendations.
	 *
	 * params:
	 *		uid: string - user ID that is given at login/signup
	 * body:
	 *		movie_id: string - ID of movie to remove
	 * response:
	 *		304, 400: error payload
	 *		200: null
	 */
	.patch(function(req, res) {
		User.findById(req.params.uid)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) return res.status(400).send({error:err});

			var preferencesArr = user.movieProfile.preferences;
			
			for(var i = preferencesArr.length-1; i>=0; i--) {
				if(preferencesArr[i].movie_id == req.body.movie_id){
					preferencesArr.splice(i, 1);
					
					if(i < NUM_RECENT_MOVIES){
						user.movieProfile.recommendations.splice(i*NUM_RECS_PER_LIKE, NUM_RECS_PER_LIKE);
						if(preferencesArr.length >= NUM_RECENT_MOVIES)
							return algorithms.updateRecommendedMovies(user.movieProfile, preferencesArr[NUM_RECENT_MOVIES-1].movie_id, false, res);
					}
					break;
				}
			}
			user.movieProfile.save(function(err){
				if(err) return res.status(304).send({error:err});
				return res.status(200).send();
			});	
		});
	})
	
	/*
	 * Wipes all user movie preferences and recommendations.
	 *
	 * params:
	 *		uid: string - user ID that is given at login/signup
	 * response:
	 *		304, 400: error payload
	 *		200: null
	 */
	.delete(function(req,res){
		User.findById(req.params.uid)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) return res.status(400).send({error:err});
			
			user.movieProfile.recommendations = [];
			user.movieProfile.preferences = [];
		
			user.movieProfile.save(function(err){
				if(err) return res.status(304).send({error:err});
				return res.status(200).send(user.movieProfile);
			});
		});
	});
 
router.route('/movies/popular/:page')
	/*
	 * Gets a list of 20 popular movies.
	 *
	 * params:
	 *		page: Number - specifies which page of popular movies
	 * response:
	 *		200: list of 20 popular movies
	 */
	.get(function(req, res){
		tmdb.getPopularMovies(req.params.page, function(results){
			return res.status(200).send(JSON.parse(results).results);
		});
	});

router.route('/movies/now_playing/:page')
	/*
	 * Gets a list of 20 now playing movies.
	 *
	 * params:
	 *		page: Number - specifies which page of now playing movies
	 * response:
	 *		200: list of 20 now playing movies
	 */
	.get(function(req, res){
		tmdb.getNowPlayingMovies(req.params.page, function(results){
			return res.status(200).send(JSON.parse(results).results);
		});
	});
	
router.route('/movies/genres')
	/*
	 * Gets a list popular movies by genre.
	 *
	 * body:
	 *		genres: [Number] - genre IDs to look up
	 * response:
	 *		200: list of 20 popular movies per genre ID
	 */
	.post(function(req, res) {
		var results = [];
		for(var i = 0; i < req.body.genres.length; i++){
			results.push( JSON.parse( tmdb.discoverPopularByGenreSync(req.body.genres[i]) ).results );
		}
		return res.status(200).send(results);
	});
	
router.route('/movies/:movie_id')
	.get(function(req, res){
		var results = [];
		tmdb.getMovieDetails(req.params.movie_id, function(details){
			var jsonDetails = JSON.parse(details);
			if(jsonDetails.status_code) return res.status(400).send(null);
			
			results.push({details: jsonDetails});
			tmdb.getMovieCredits(req.params.movie_id, function(credits){
				var jsonCredits = JSON.parse(credits);
				results.push({cast: jsonCredits.cast});
				results.push({crew: jsonCredits.crew});
				
				console.log('cast good to go');
				
				tmdb.getSimilarMovies(req, function(similarMovies){
					results.push({similarMovies: JSON.parse(similarMovies).results});
					
					console.log('similar movies good to go');
					
					justwatch.searchForProviders(jsonDetails.title, function(providers) {;
					for(var i = providers.length - 1; i >= 0; i--)
						if(providers[i].provider_id !== 2 &&
							providers[i].provider_id !== 3 && 
							providers[i].provider_id !== 8 &&
							providers[i].provider_id !== 18 &&
							providers[i].provider_id !== 68 ||
							providers[i].monetization_type === 'rent' ||
							providers[i].presentation_type === 'hd') providers.splice(i, 1);
					
					results.push({providers: providers});
					
					console.log('providers good to go');
					
					return res.status(200).send(results);
					});
				});
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
		tmdb.searchMovies(req, function(results){
			return res.status(200).send(JSON.parse(results).results);
		});
	});
	
router.route('/movies/providers/:movie_title')
	.get(function(req,res){
		justwatch.searchForProviders(req.params.movie_title, function(providers) {;
			console.log(providers);
			console.log(providers.length);
			for(var i = providers.length - 1; i >= 0; i--)
				if(providers[i].provider_id !== 2 &&
					providers[i].provider_id !== 3 && 
					providers[i].provider_id !== 8 &&
					providers[i].provider_id !== 18 &&
					providers[i].provider_id !== 68 ||
					providers[i].monetization_type === 'rent' ||
					providers[i].presentation_type === 'hd') providers.splice(i, 1);
			
			return res.status(200).send(providers);
		});
	});
	
router.route('/users/:uid')
	.get(function(req, res){
		User.findById(req.params.uid, function(err, user){
		if(err) return res.status(400).send({error:err});
			var userInfo = {
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			};
			return res.status(200).send(userInfo);
		});
	});
	
router.route('/users/:uid/setups')
	.get(function(req,res){
		User.findById(req.params.uid)
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			return res.status(304).send({movieSetup: user.movieSetup});
		});
	})
	
	.patch(function(req, res){
		User.findById(req.params.uid)
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			user.movieSetup = req.body.movieSetup;
			user.save(function(err){
				if(err) 
					return res.status(304).send({error:{message:'problem adjusting flag(s), make sure \'xSetup\' is a boolean'}});
				return res.status(200).send(null);
			});
		});
	})

module.exports = router;
