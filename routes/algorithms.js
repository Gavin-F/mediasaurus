/*
  Algorithm structure;

  top level method:
    - getSuggestedMovies
      - Get a stored list of 20 movie ids from user profile
      - calcSuggestedMovies if null
    - findSuggestedMovies
      - Grab categories from user profile (genre, cast, rating)
      - Weigh categories on point scale
      - Use API to return relevant movies
      - Return top 20 scoring movies
    -
*/

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');
var express = require('express');
var tmdb = require('../api/tmdb_api');


module.exports = {
	// movieProfile: User's movieProfile
	findSuggestedMovies: function(movieProfile, callback)   {
	  var suggestedMovies = [];

	  // Get 5 most recently-liked movies from movieProfile
	  var preferredMovies = movieProfile.preferences;
	  preferredMovies = preferredMovies.slice(-5);

    var moviesProcessed = 0;

	  // Call API to get recommended movies for each recently-liked movie
	  for (var i = 0; i < preferredMovies.length; i++){
  		tmdb.getMovieRecommendations(preferredMovies[i].movie_id, function (recommendations){
            // Return 10 recommended movies each and add to suggestedMovies
            var results = JSON.parse(recommendations).results;
            for (var j = 0; j < 10 && j < results.length; j++){
              var entry = {movie_id: results[m].id,
                           title: results[m].title,
                           poster_path: results[m].poster_path };
              suggestedMovies.push(entry);
            }

            moviesProcessed++;
            // Return suggestedMovies list to callback
            if (moviesProcessed == preferredMovies.length) {
              // TODO: Weigh each movie based on genre, rating, etc on a point scale
              callback(suggestedMovies);
            }
        });
    }
  }
};
