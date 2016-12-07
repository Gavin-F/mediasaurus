var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var genreList = require(('../../models/genres.json'));


// API key goes here
APIKEY = "8f9caf52038412780f3c4037b2b114ca";

// CONSTANT Declaration
var API_BASE = "https://api.themoviedb.org/3/";
var API_DISCOVER1 = "discover/movie?api_key=";
var API_DISCOVER2 = "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1";
var API_SEARCH = "search/movie?api_key=" + APIKEY;

// getMovieWithID consumes an integer
// integer is the movie ID requested
module.exports = {
    // getMoviesWithID consumes an integer and a function(JSONString)
    // calls the callback on the function while passing a JSONString that contains the movie with the given ID (integer)
    /*
    *   getMovieWithID passes a JSONString that is a movie that is associated with the ID to the callback
    *   @param {Number} id
    *   @param {function(JSONString)} callback
    */
    getMovieWithID: function (id, callback) {
        consAPI_URL = API_BASE + "movie/" + id + "?api_key=" + APIKEY + "& language=en-US";

        this.httpGetAsync(consAPI_URL, callback);
    },

    // discoverMovieswithGenre consumes a string, that discribes a genre type
    // consumes callback, a function handler that is called when function is finished
    // Returns a JSON object that contains the movies in an array to the callback as an argument

    /*
    *   discoverMovieswithGenre passes a JSONString of movies that has the genre associated with it to the callback
    *   @param {String} genre
    *   @param {function(JSONString)} callback
    */
    discoverMovieswithGenre: function (genre, callback) {
        genreID = getGenreID(genre);

        consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2 + "&with_genres=" + genreID;

        this.httpGetAsync(consAPI_URL, callback);
    },

    /* 
    *   getKeywordID returns the keywordID associated to the keyword
    *   @param {String} keyword
    *   @return {Integer} keyWordID 
    */
    getKeywordID: function (keyword) {
        consAPI_URL = API_BASE + "search/keyword?api_key=" + APIKEY + "&query=" + keyword;

        var response = this.httpGetSync(consAPI_URL);
        var JSONObj = JSON.parse(response);
        var JSONArr = JSONObj.results;

        for (var i = JSONArr.length - 1; i >= 0; i--) {
            if(JSONArr[i].name.toLowerCase() === keyword.toLowerCase()) {
                return JSONArr[i].id;
            }
        }

        return -1;
    },

    /*
    *   getGenreID returns the genreID associated to the genre
    *   @param {String} genre
    *   @return {Number} genreID
    */
    getGenreID: function (genre) {
        consAPI_URL = API_BASE + "genre/movie/list?api_key=" + APIKEY + "&language=en-US";

        var response = this.httpGetSync(consAPI_URL);
        var JSONObj = JSON.parse(response);
        var JSONArr = JSONObj.genres;

        for (var i = JSONArr.length - 1; i >= 0; i--) {
            if(JSONArr[i].name.toLowerCase() === genre.toLowerCase()) {
                return JSONArr[i].id;
            }
        }


        return -1;
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

    /*
    * discoverMovies passes a JSONString that contatins a list of movies that is associated to the specifications given to the callback
    * @param {Integer} year
    * @param {Array<String>} keywordArray: An array of keywords
    * @param {Array<String>} genreArray: An array of Genres
    * @param {Array<String>} notGenreArray: An array of genres to not include
    * @param {Array<String>} castArray: <<depreciated>>
    * @param {function(JSONString)} callback
    */

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

        // Depreciated
        // if (castArray !== null) {
        //     cast_url = "&with_cast=";
        //     for (i = castArray.length - 1; i >= 0; i--) {
        //         cast_url += castArray[i];
        //         if (i !== 0) {
        //             cast_url += ",";
        //         }
        //     }
        // }

        consAPI_URL = API_BASE + API_DISCOVER1 + APIKEY + API_DISCOVER2 + year_url + keyword_url + genre_url + not_genre_url + cast_url;

        this.httpGetAsync(consAPI_URL, callback);
    },
    /*
    *   discoverPopularByGenreSync passes an array of movies associated with the genre_id to the callback
    *   @param {Number} genre_id
    *   @param {function(JSONString)} callback
    */
    discoverPopularByGenreSync: function(genre_id, callback) {
        consAPI_URL = API_BASE + 'discover/movie?api_key=' + APIKEY + '&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=' + genre_id;
        return this.httpGetSync(consAPI_URL);
    },
    /*
    *   searchMovies passes a JSONString of movies from the search query to the callback
    *   @param {String} req: query
    *   @param {function(JSONString)} callback
    */
    searchMovies: function (req, callback) {
        consAPI_URL = API_BASE + API_SEARCH + "&query=" + req.body.query + '&page=' + req.params.page;
        this.httpGetAsync(consAPI_URL, callback);
    },
    /*
    *   getMOvieDetails passes a JSONString that contains the movie details from the movieID to the callback
    *   @param {Number} id: MovieID
    *   @param {function(JSONString)} callback
    */
     getMovieDetails: function(id, callback) {
        consAPI_URL = API_BASE + 'movie/' + id + '?api_key=' + APIKEY;
        this.httpGetAsync(consAPI_URL, callback);
     },
     /*
     *  getMovieCredits passes a JSONString containing the credits of the movies from the movieID to the callback
     *  @param {Number} id: MovieID
     *  @param {function(JSONString)} callback
     */
     getMovieCredits: function(id, callback) {
        consAPI_URL = API_BASE + 'movie/' + id + '/credits?api_key=' + APIKEY;
        this.httpGetAsync(consAPI_URL, callback);
     },
     /*
     *  getMovieRecommendations passes a JSONString containing the recomendations from the movieID to the callback
     *  @param {Number} id: MovieID
     *  @param {function(JSONString)} callback
     */
     getMovieRecommendations: function(id, callback){
        consAPI_URL = API_BASE + 'movie/' + id + '/recommendations?api_key=' + APIKEY;
        this.httpGetAsync(consAPI_URL, callback);
     },
     /*
     *  getMovieRecommendationsSync returns a JSONString that contains the movie reccomendations
     *  @param {Number} id: MovieID
     *  @return {String} JSONString of Movie reccomendations
     */
     getMovieRecommendationsSync: function(id){
        consAPI_URL = API_BASE + 'movie/' + id + '/recommendations?api_key=' + APIKEY;
        return this.httpGetSync(consAPI_URL); 
     },
     /*
     *  getSimilarMovies passes a JSONString that is an JSONArray that contains movies that are similar to the movieID to the callback
     *  @oaram {Number} req: MovieID
     *  @param {function(JSONString)} callback
     */
     getSimilarMovies: function(req, callback){
        consAPI_URL = API_BASE + 'movie/' + req.params.movie_id + '/similar?api_key=' + APIKEY + '&page=' + req.params.page;
        this.httpGetAsync(consAPI_URL, callback);
     },
     /*
     *  getPopularMovies passes a JSONString that contains the currently popular movies, indexed by the page (in decending order) to the callback
     *  @param {Number} page
     *  @param {function(JSONString)} callback
     */
     getPopularMovies: function(page, callback) {
        consAPI_URL = API_BASE + 'movie/popular?api_key=' + APIKEY + '&page=' + page;
        this.httpGetAsync(consAPI_URL, callback);
     },
     /*
     *  getNowPlayingMovies passes a JSONString that contains the currently playing movies, indexed by the page (in decending popularity) to the callback
     *  @param {Number} page
     *  @param {function(JSONString)} callback
     */
     getNowPlayingMovies: function(page, callback) {
        consAPI_URL = API_BASE + 'movie/now_playing?api_key=' + APIKEY + '&page=' + page;
        this.httpGetAsync(consAPI_URL, callback);
     },


    // Function inspiration taken from StackOverflow
    // http://stackoverflow.com/questions/247483/http-get-request-in-javascript

    httpGetAsync: function (theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        // var xmlHttp = xhr;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    },

    // Function inspiration taken from StackOverflow
    // http://stackoverflow.com/questions/247483/http-get-request-in-javascript

    httpGetSync: function (theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
};