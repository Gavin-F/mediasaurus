// import tmdb_api.js
var tmdb_api = require('./tmdb_api');

function printThis(value) {
  console.log(value);
  console.log(typeof value);
}

// tmdb_api.discoverMovies("2017", null, null, null, null, printThis);
console.log(tmdb_api.getGenreID("action") + "All done!");

printThis(tmdb_api.discoverTrendingMovies(return));
// console.log(tmdb_api.getKeywordID("blood"));
