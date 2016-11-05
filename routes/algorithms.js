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
var tmdb_api = require('../api/tmdb_api');

// movieProfile:
function findSuggestedMovies(movieProfile, callback) {
  var newSuggestedMovies;
  // discoverMovieswithGenre(); // Returns movies of
  // Sort list of rating
  // Store list in suggestedMovies
  user.update({ suggestedMovies: newSuggestedMovies}, function(err, numAffected){
    if(err)return res.send(509,err);
  });
}
