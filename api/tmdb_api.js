var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();


// API key goes here
APIKEY = "8f9caf52038412780f3c4037b2b114ca";

// https://api.themoviedb.org/3/genre/movie/list?api_key=8f9caf52038412780f3c4037b2b114ca&language=en-US

// API BASE

var API_BASE = "https://api.themoviedb.org/3/";
var API_DISCOVER1 = "discover/movie?api_key=";
var API_DISCOVER2 = "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1";
var API_SEARCH = "search/movie?api_key=" + APIKEY;
var API_MOVIEDETAILS = 'movie/';


// https://api.themoviedb.org/3/movie/405?api_key=8f9caf52038412780f3c4037b2b114ca&language=en-US

// https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_genres=99

// getMovieWithID consumes an integer
// integer is the movie ID requested
module.exports = {
    getMovieWithID: function (id, callback) {
        consAPI_URL = API_BASE + "movie/" + id + "?api_key=" + APIKEY + "& language=en-US";

        this.httpGetAsync(consAPI_URL, callback);
    },

    // discoverMovieswithGenre consumes a string, that discribes a genre type
    // consumes callback, a function handler that is called when function is finished
    // Returns a JSON object that contains the movies in an array to the callback as an argument

    discoverMovieswithGenre: function (genre, callback) {

        // TODO: Parse the genre, use the API to retrieve the list of Movies
        genreID = getGenreID(genre);

        consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2 + "&with_genres=" + genreID;

        this.httpGetAsync(consAPI_URL, callback);
    },

    getKeywordID: function (keyword) {
        //https://api.themoviedb.org/3/search/keyword?api_key=8f9caf52038412780f3c4037b2b114ca&query=bloo

        consAPI_URL = API_BASE + "search/keyword?api_key=" + APIKEY + "&query=" + keyword;

        jsonObj = this.httpGetRequest(consAPI_URL);

        // return ;
    },

    // This function consumes a String of a name of a Genre
    // Returns the GenreID of the given string from the mongodb server
    getGenreID: function (genre) {
        // STUB
        // https://api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US
        // consAPI_URL = API_BASE +

        return 0;
    },

    // discoverTrendingMovies returns a JSON object containing the currently trending movies
    // fn callback is run
    discoverTrendingMovies: function (callback) {
        consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2;

        this.httpGetAsync(consAPI_URL, callback);
    },

    // PARAMETERS
    // year is an integer of the year the movie (and any secondaries) are released
    // keywordArray is an array of String containing the keyword tags
    // genreArray is an array of String containing the genre tags
    // notGenreArray is an array of String containing the genre tags to filter out
    // castArray is an array of String containing the actors names
    discoverMovies: function (year,keywordArray,genreArray,notGenreArray,castArray,callback) {
        var year_url = "";
        var keyword_url = "";
        var genre_url = "";
        var not_genre_url = "";
        var cast_url = "";
        var i;

        // If year != null
        // Add the year API
        if (year !== null) {
            year_url = "&primary_release_date.gte=" + year + "-01-01";
        }

        // If KeywordArray != null
        // Add each keyword to the keyword_api
        if (keywordArray !== null) {
            keyword_url = "&with_keywords=";
            for (i = keywordArray.length - 1; i >= 0; i--) {
                keyword_url += this.getKeywordID(keywordArray[i]);
                if (i !== 0) {
                    keyword_url += ",";
                }
            }
        }

        if (genreArray !== null) {
            genre_url = "&with_genres=";
            for (i = genreArray.length - 1; i >= 0; i--) {
                genre_url += this.getGenreID(genreArray[i]);
                if (i !== 0) {
                    genre_url += ",";
                }
            }
        }

        if (notGenreArray !== null) {
            not_genre_url = "&without_genres=";
            for (i = notGenreArray.length - 1; i >= 0; i--) {
                not_genre_url += this.getGenreID(notGenreArray[i]);
                if (i !== 0) {
                    not_genre_url += ",";
                }
            }
        }

        if (castArray !== null) {
            cast_url = "&with_genres=";
            for (i = castArray.length - 1; i >= 0; i--) {
                cast_url += castArray[i];
                if (i !== 0) {
                    cast_url += ",";
                }
            }
        }

        consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2 + year_url + keyword_url + genre_url + not_genre_url + cast_url;

        this.httpGetAsync(consAPI_URL, callback);
    },

    searchMovies: function (query, callback) {
      consAPI_URL = API_BASE + API_SEARCH + "&query=" + query;

      this.httpGetAsync(consAPI_URL, callback);
    },

	 getMovieDetails: function(id, callback) {
		consAPI_URL = API_BASE + 'movie/' + id + '?api_key=' + APIKEY;
		this.httpGetAsync(consAPI_URL, callback);
	 },

	 getMovieRecommendations: function(id, callback){
		consAPI_URL = API_BASE + 'movie/' + id + '/recommendations?api_key=' + APIKEY;
		this.httpGetAsync(consAPI_URL, callback);
	 },

	 getSimilarMovies: function(id, callback){
		consAPI_URL = API_BASE + 'movie/' + id + '/similar?api_key=' + APIKEY;
		this.httpGetAsync(consAPI_URL, callback);
	 },

    // Function inspiration taken from StackOverflow
    // http://stackoverflow.com/questions/247483/http-get-request-in-javascript

    httpGetAsync: function (theUrl, callback) {
        // var xmlHttp = new XMLHttpRequest();
        var xmlHttp = xhr;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    },

    httpGetRequest: function (theURL) {
       var xmlHttp = xhr;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                return xmlHttp.responseText;
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    },


    printThis: function (value) {
      console.log(value);
    }

};


// <<TEST BANK>>

// dis;coverMovieswithGenre("action", printThis);

// discoverMovies("2017", null, null, null, null, printThis);

// <<END TEST BANK>>
