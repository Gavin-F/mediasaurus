

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');

var tmdb = require('../helpers/tmdb/tmdb_api');
var algorithms = require('../helpers/movieRecAlgorithms');
var justwatch = require('../helpers/just_watch/justwatch_api');

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
			if(err) res.status(400).send({error: err});
			return res.status(200).send(user.movieProfile.preferences);
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
			return res.status(400).send({error: {message: 'nothing to set'}});
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.status(400).send({error:err});
			}
			var prefItem = {movie_id: req.body.movie_id, liked: req.body.liked};
			user.movieProfile.preferences.unshift(prefItem);
			algorithms.updateRecommendedMovies(user.movieProfile, req.body.movie_id, res);
		}); 
		
	})
	
	.put(function(req, res) {
		if(req.body.movie_ids === null)
			return res.send(400).send({error:{message: 'nothing in ids'}});
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			
			for(var i = 0; i < req.body.movie_ids.length; i++){
				var prefItem = {movie_id: req.body.movie_ids[i], liked: true};
				user.movieProfile.preferences.unshift(prefItem);
			}
			
			algorithms.massUpdateRecommendedMovies(user.movieProfile, req.body.movie_ids, res);
			
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
	.patch(function(req, res) {
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err, user){
		if(err) return res.status(400).send({error:err});

			// remove all movies with movieTitle from preferences
			var preferencesArr = user.movieProfile.preferences;
			for(var i = user.movieProfile.preferences.length-1; i>=0; i--) {
				if(preferencesArr[i].movie_id == req.body.movie_id){
					preferencesArr.splice(i, 1);
					if(i < 4)
						user.movieProfile.recommendations.splice(i*5, 5);
				}}

			user.movieProfile.save(function(err){
				if(err) return res.status(304).send({error:err});
				return res.status(200).send(user.movieProfile);
			});	
		});
	});
	

router.route('/movies/recommendations/:id')
	.get(function(req, res){
		User.findById(req.params.id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			return res.status(200).send(user.movieProfile.recommendations);
		});
	});

router.route('/movies/similar/:movie_id/:page')
	.get(function(req, res){
		tmdb.getSimilarMovies(req, function(results){
			jsonResults = JSON.parse(results);
			if(jsonResults.status_code) return res.status(400).send(null);
			return res.status(200).send(jsonResults.results);
		});
	});
	
router.route('/movies/popular/:page')
	.get(function(req, res){
		tmdb.getPopularMovies(req.params.page, function(results){
			return res.status(200).send(JSON.parse(results).results);
		});
	});

router.route('/movies/now_playing/:page')
	.get(function(req, res){
		tmdb.getNowPlayingMovies(req.params.page, function(results){
			return res.status(200).send(JSON.parse(results).results);
		});
	});
	
router.route('/movies/genres')
	.post(function(req, res) {
		var results = [];
		for(var i = 0; i < req.body.genres.length; i++){
			results.push( JSON.parse( tmdb.discoverPopularByGenreSync(req.body.genres[i]) ).results );
		}
		return res.status(200).send(results);
	});
	
router.route('/movies/:movie_id')
	.get(function(req, res){
		tmdb.getMovieDetails(req.params.movie_id, function(details){
			var jsonDetails = JSON.parse(details);
			if(jsonDetails.status_code) return res.status(400).send(null);
			tmdb.getMovieCredits(req.params.movie_id, function(credits){
				var jsonCredits = JSON.parse(credits);
				var results = [{details: jsonDetails, cast: jsonCredits.cast, crew: jsonCredits.crew}];
				//return res.status(200).send(results);
				
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
					return res.status(200).send(results);
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
	
router.route('/users/:id')
	.get(function(req, res){
		User.findById(req.params.id, function(err, user){
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
	
router.route('/users/:id/setups')
	.get(function(req,res){
		User.findById(req.params.id)
		.exec(function(err,user){
			if(err) return res.status(400).send({error:err});
			return res.status(304).send({movieSetup: user.movieSetup});
		});
	})
	
	.patch(function(req, res){
		User.findById(req.params.id)
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
//Register the authentication middleware
//router.use('/posts', isAuthenticated);

module.exports = router;
