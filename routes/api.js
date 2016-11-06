

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');

var tmdb = require('../api/tmdb_api');

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

router.route('/preferences/movies')
	
	/*
	 * Responds with a list of the user's movie likes/dislikes.
	 *
	 * Request: 
	 *		_id: string; same _id of user that is given at login/signup
	 * Response:
	 *		list of user's movie likes/dislikes
	 */
	.post(function(req, res) {
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) res.send(504, err);
			return res.send(user.movieProfile.prefs);
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
	.put(function(req, res){
		if(req.body.movieTitle === null)
			return res.send(506, 'nothing to set');
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.send(505, err);
			}
			var prefItem = {movie: req.body.movieTitle, liked: req.body.liked}
			user.movieProfile.prefs.push(prefItem);
			user.movieProfile.save(function(err){
				if(err) return res.send(506, err);
			});
			return res.send(user);
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
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) return res.send(507, err);
			
			// remove all movies with movieTitle from preferences
			var prefsArr = user.movieProfile.prefs;
			for(var i = user.movieProfile.prefs.length-1; i>=0; i--)
				if(prefsArr[i].movie === req.body.movieTitle)
					prefsArr.splice(i, 1);
			
			user.movieProfile.save(function(err){
				if(err)return res.send(508,err);
				return res.send(user.movieProfile.prefs);
			});
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
	
router.route('/movies/:id')
	.get(function(req, res){
		console.log(req.params.id);
		tmdb.getMovieDetails(req.params.id, function(details){
			jsonDetails = JSON.parse(details);
			return res.send(jsonDetails.status_code ? null : jsonDetails);
		});
	});
	
router.route('/movies/search')
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
		tmdb.searchMovies(req.body.query, function(results){
			return res.send(JSON.parse(results));
		});
	});
//Register the authentication middleware
//router.use('/posts', isAuthenticated);

module.exports = router;