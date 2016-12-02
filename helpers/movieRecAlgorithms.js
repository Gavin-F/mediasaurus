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
	updateRecommendedMovies: function(movieProfile, movie_id, res){
		tmdb.getMovieRecommendations(movie_id, function (results){
			if (movieProfile.recommendations.length >= 20)
					movieProfile.recommendations.splice(15, 5);
			
			var jsonResults = JSON.parse(results);
			
			for (var i = Math.min(4, jsonResults.total_results); i >= 0; i--){
				var entry = {
					movie_id: jsonResults.results[i].id,
					title: jsonResults.results[i].title,
					poster_path: jsonResults.results[i].poster_path,
					vote_average: jsonResults.results[i].vote_average
				};
				movieProfile.recommendations.unshift(entry);
			}
			//movieProfile.recommendations = [];
			movieProfile.save(function(err){
				if(err) return res.send(304, err);
				return res.send(200, movieProfile.recommendations);
			});
			
		});
	},
	
	massUpdateRecommendedMovies: function(movieProfile, movie_ids, res){
		var movieIDs = movie_ids.slice(Math.max(movie_ids.length - 4, 0));
		for(var i = 0; i < movieIDs.length; i++){
			var results = tmdb.getMovieRecommendationsSync(movieIDs[i]);
			//console.log(results);
			var jsonResults = JSON.parse(results);
			for (var j = Math.min(4, jsonResults.total_results); j >= 0; j--){
				var entry = {
					movie_id: jsonResults.results[j].id,
					title: jsonResults.results[j].title,
					poster_path: jsonResults.results[j].poster_path,
					vote_average: jsonResults.results[j].vote_average
				};
				movieProfile.recommendations.unshift(entry);
			}
		}
		
		movieProfile.save(function(err){
			if(err) return res.send(304, err);
			return res.send(200, movieProfile.recommendations);
		});
	}
	
};
/*
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
        });*/
