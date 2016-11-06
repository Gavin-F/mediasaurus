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
	  preferredMovies = preferredMovies.slice(Math.max(preferredMovies.length-5, 1));

	  console.log("preferredMovies" + preferredMovies);
	  
	  // Call API to get recommended movies for each recently-liked movie
	  preferredMovies.forEach(function(entry){
		  console.log("entry" + entry);
		tmdb.getMovieRecommendations(entry, function(recommendations){
		console.log("recommendations" + recommendations);
		 // Return 10 recommended movies each and add to suggestedMovies
		  var results = JSON.parse(recommendations).results;
		 
		  for (var i = 0; i < 10 && i < results.length; i++ ){
			suggestedMovies.push(results[i].id);
		  }
		});
	});

	  // TODO: Weigh each movie based on genre, rating, etc on a point scale

	  // Return suggestedMovies list to callback
	  //console.log(suggestedMovies);
	  callback(suggestedMovies);
	}
};
