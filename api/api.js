
// API key goes here
APIKEY = "8f9caf52038412780f3c4037b2b114ca";

// https://api.themoviedb.org/3/genre/movie/list?api_key=8f9caf52038412780f3c4037b2b114ca&language=en-US

// API BASE

var API_BASE = "https://api.themoviedb.org/3/";
var API_DISCOVER1 = "discover/movie?api_key=";
var API_DISCOVER2 = "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1";

// https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_genres=99

// discoverMovieswithGenre consumes a string, that discribes a genre type
// consumes callback, a function handler that is called when function is finished
// Returns a JSON object that contains the movies in an array to the callback as an argument

function discoverMovieswithGenre(genre, callback) {

    // TODO: Parse the genre, use the API to retrieve the list of Movies
    genreID = getGenreID(genre);

    consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2 + "&with_genres=" + genreID;

    httpGetAsync(consAPI_URL, callback);
}

// This function consumes a String of a name of a Genre
// Returns the GenreID of the given string from the mongodb server
// TODO: Implementation

function getGenreID(genre) {
    // STUB
    return 0;
}

// discoverTrendingMovies returns a JSON object containing the currently trending movies
// fn callback is run 
function discoverTrendingMovies(callback) {
    consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY+ API_DISCOVER2;

    httpGetAsync(consAPI_URL, callback);
}

// PARAMETERS
// year is an integer of the year the movie (and any secondaries) are released
// keywordArray is an array of String containing the keyword tags
// genreArray is an array of String containing the genre tags
// notGenreArray is an array of String containing the genre tags to filter out
// castArray is an array of String containing the actors names
function discoverMovies(year,keywordArray,genreArray,notGenreArray,castArray,callback) {
    // body...
    // TODO: implement
}

// Function inspiration taken from StackOverflow
// http://stackoverflow.com/questions/247483/http-get-request-in-javascript

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function printThis(value) {
  console.log(value);
}

// <<TEST BANK>> 

// discoverMovieswithGenre("action", printThis);

// <<END TEST BANK>>