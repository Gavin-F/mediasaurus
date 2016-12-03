// Middleware
var express = require('express');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');

var tmdb = require('./tmdb/tmdb_api');

var NUM_RECENT_MOVIES = 6;
var NUM_RECS_PER_LIKE = 5;
var NUM_RECOMMENDATIONS = NUM_RECENT_MOVIES * NUM_RECS_PER_LIKE;

module.exports = {
	// Update recommended movies given 1 movie id
	updateRecommendedMovies: function(movieProfile, movie_id, unshift, res){
		tmdb.getMovieRecommendations(movie_id, function (results){
			algorithmsHelper(movieProfile, movie_id, results, unshift);
					
			movieProfile.save(function(err){
				if(err) return res.status(304).send({error:err});
				return res.status(200).send();
			});
		});
	},
	
	// Update recommended movies given multiple movie ids
	massUpdateRecommendedMovies: function(movieProfile, movie_ids, res){
		var movieIDs = movie_ids.slice(Math.max(movie_ids.length - 6, 0));
		for(var i = 0; i < movieIDs.length; i++){
			var results = tmdb.getMovieRecommendationsSync(movieIDs[i]);
			
			algorithmsHelper(movieProfile, movieIDs[i], results, true);
		}
		
		movieProfile.save(function(err){
			if(err) return res.status(304).send({error:err});
			return res.status(200).send();
		});
	}
	
};

// Helper function
function algorithmsHelper(movieProfile, movie_id, results, unshift) {
	// keep total recommendations under NUM_RECOMMENDATIONS
	if (movieProfile.recommendations.length >= NUM_RECOMMENDATIONS)
			movieProfile.recommendations.splice(NUM_RECOMMENDATIONS - NUM_RECS_PER_LIKE);
	
	// remove liked movie from recommended
	var numRecsToAdd = NUM_RECS_PER_LIKE;
	for(var i = movieProfile.recommendations.length - 1; i >= 0; i--)
		if(movieProfile.recommendations[i].movie_id == movie_id){
			movieProfile.recommendations.splice(i, 1);
			numRecsToAdd++;		// need to add one more recommendation since we removed one
			break;
		}
	
	var jsonResults = JSON.parse(results);
	var i, mAdded;
	for(i = 0, mAdded = 0; i<jsonResults.total_results && mAdded<numRecsToAdd; i++) {
		var addFlag = true;
		// don't add results that are already recommended
		for (var j = 0; j < movieProfile.recommendations.length; j++) {
			if(movieProfile.recommendations[j].movie_id === jsonResults.results[i].id)
				addFlag = false;
		}
		// don't add results that are already liked
		for (var j = 0; j < movieProfile.preferences.length; j++) {
			if(movieProfile.preferences[j].movie_id === jsonResults.results[i].id)
				addFlag = false;
		}
				
		if(addFlag) {
			var entry = {
				movie_id: jsonResults.results[i].id,
				title: jsonResults.results[i].title,
				poster_path: jsonResults.results[i].poster_path,
				vote_average: jsonResults.results[i].vote_average
			};
			// add entry either to front or back of recommendations
			if(unshift) movieProfile.recommendations.unshift(entry);
			else movieProfile.recommendations.push(entry);
			mAdded++;
		}
	}
	return;
}
