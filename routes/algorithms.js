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

// movieProfile: User's movieProfile
function findSuggestedMovies(movieProfile, callback)   {
  var suggestedMovies = [];

  // Get 5 most recently-liked movies from movieProfile
  var preferredMovies = movieProfile.preferences;
  preferredMovies = preferredMovies.slice(Math.max(preferredMovies.length-5, 1));

  // Call API to get recommended movies for each recently-liked movie
  preferredGenres.forEach(function(entry){
    getRecommendedMovies(entry, function(results){
      // Return 10 recommended movies each and add to suggestedMovies
      for (var i = 0; i < 10 && i < results.length; i++ ){
        suggestedMovies.push(results[i]);
      }
    });
  });

  // TODO: Weigh each movie based on genre, rating, etc on a point scale

  // Return suggestedMovies list to callback
  callback(suggestedMovies);
}
