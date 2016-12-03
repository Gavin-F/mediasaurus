
var index = angular.module("index",
	["ngRoute",
	"ngStorage",
	"index.signup",
	"index.login",
	"index.accsetup",
	"index.moviepage",
	"index.dashboard",
	"index.search",
	"index.account"
	]);

index.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "/html/home.html",
		controller: "home-controller"
	})
	.when("/about", {
		templateUrl: "/html/about.html",
		controller: "about-controller"
	})
	.when("/dashboard", {
		templateUrl: "/html/dashboard.html",
		controller: "dashboard-controller"
	})
	.when("/search", {
		templateUrl: "/html/search.html",
		controller: "search-controller"
	})
	.when("/account", {
		templateUrl: "/html/account.html",
		controller: "account-controller"
	})
	.when("/password", {
		templateUrl: "/html/resetpassword.html",
		controller: "password-controller"
	})
	.when("/email" , {
		templateUrl: "/html/resetEmail.html",
		controller: "email-controller"
	})
	.when("/name" , {
		templateUrl: "/html/resetname.html",
		controller: "name-controller"
	})
	.when("/signup", {
		templateUrl: "/html/signup.html",
		controller: "signup-controller"
	})
	.when("/setup", {
		templateUrl:"/html/accsetup.html",
		controller: "accsetup-controller"
	})
	.when("/login", {
		templateUrl: "/html/login.html",
		controller: "login-controller"
	})
	.when("/movies/:id", {
		templateUrl: "/html/movie.html",
		controller: "movie-controller"
	})
	.otherwise({redirectTo:'/'});
});

///////////////////////////////////////////////////////
// INDEX CONTROLLER
///////////////////////////////////////////////////////
index.controller("index-controller", function($scope,$route, $localStorage, $http, $location, $window, $timeout) {
	// $scope.isActive = function (viewLocation) {
	// 	return viewLocation === $location.path();
	// };

	$(window).ready(function() {
    	$('html').hide();
    	$(window).on('load', function(){
        	$('html').show();
    	});
	});

	$scope.isActive2 = function() {
	    if(($location.path()=='/account')||($location.path()=='/password')){
	    	return 1;
		}
		else{
			return 0;
		}
	};
	$scope.isActive3 = function() {
	    if($localStorage.userID !== undefined){
	    	return 1;
		}
		else{
			return 0;
		}
	};
	$scope.isActive4 = function() {
	    if($localStorage.userID !== undefined){
	    	return 0;
		}
		else{
			return 1;
		}
	};
	$scope.reset = function() {
		delete $localStorage.userID;
		delete $localStorage.setupDone;
		$location.url("/");
	}

	$scope.goHome = function(){
		$location.url("/");
	}
	$scope.goDashboard = function(){
		$location.url("/dashboard");
	}
	$scope.goAccountSettings = function(){
		$location.url("/account");
	}
	$scope.goResetPassword = function(){
		$location.url("/password");
	}
	$scope.goLogin = function(){
		$location.url("/login");
	}
	$scope.goSignup = function(){
		$location.url("/signup");
	}
	$scope.goAbout = function(){
		$location.url("/about");
	}

});

///////////////////////////////////////////////////////
// HOME CONTROLLER
///////////////////////////////////////////////////////
index.controller("home-controller", function($scope, $location, $localStorage) {

	if($localStorage.userID !== undefined) {
		$location.url("/dashboard");
	}

	// sign up
	$scope.toSignUp = function(){
		$location.url("/signup");
	}

	// login
	$scope.toLogin = function(){
		$location.url("/login");
	}

	// continue without logging in
	$scope.continue = function(){
		$location.url("/dashboard");
	}
});

///////////////////////////////////////////////////////
// ABOUT CONTROLLER
///////////////////////////////////////////////////////
index.controller("about-controller", function($scope, $location, $localStorage) {

});

///////////////////////////////////////////////////////
// DASH CONTROLLER
///////////////////////////////////////////////////////

index.controller("dashboard-controller", function($scope, $location, $http, $timeout, $localStorage,$sessionStorage) {
	$scope.recShow = false; // show pref box if user is logged in
	$scope.recGet = true; // show recs if get request is successful
	if($localStorage.userID !== undefined) {
		$scope.recShow = true;
	}

	$scope.search = function() {
		var searchObject = {
			query: $scope.searchString
		};
		$sessionStorage.sString=$scope.searchString;
		$scope.$emit("searchEvent", searchObject);
	}
	$scope.$on("searchUpdate", function(event, searchArray) {
		$sessionStorage.searchResult = searchArray;
		$location.url("/search");
	});

	$scope.reset = function() {
		delete $localStorage.userID;
		delete $localStorage.setupDone;
		location.reload();
	}

	// Storage arrays and counters for movie boxes
	$scope.recMovieDisplay = [];
	$scope.recMovieSets = [];
	$scope.recMovieStore = [];
	$scope.recScrollCount = 0;

	$scope.popMovieDisplay = [];
	$scope.popMovieSets = [];
	$scope.popMovieStore = [];
	$scope.popScrollCount = 0;

	$scope.nowMovieDisplay = [];
	$scope.nowMovieSets = [];
	$scope.nowMovieStore = [];
	$scope.nowScrollCount = 0;

	// scrollLeft shifts displayed movies to the left
	$scope.scrollLeft = function(section) {
		switch(section) {
			case "pop":
				if($scope.popScrollCount > 0) $scope.popScrollCount--;
				else if($scope.popScrollCount == 0) $scope.popScrollCount = $scope.popMovieSets.length-1;
				$scope.popMovieDisplay = $scope.popMovieSets[$scope.popScrollCount];
				break;
			case "now":
				if($scope.nowScrollCount > 0) $scope.nowScrollCount--;
				else if($scope.nowScrollCount == 0) $scope.nowScrollCount = $scope.nowMovieSets.length-1;
				$scope.nowMovieDisplay = $scope.nowMovieSets[$scope.nowScrollCount];
				break;
			case "rec":
				if($scope.recScrollCount > 0) $scope.recScrollCount--;
				else if($scope.recScrollCount == 0) $scope.recScrollCount = $scope.recMovieSets.length-1;
				$scope.recMovieDisplay = $scope.recMovieSets[$scope.recScrollCount];
				break;
			default: break;
		}
	}

	// scrollRight shifts displayed movies to the right
	$scope.scrollRight = function(section) {
		switch(section) {
			case "pop":
				if($scope.popScrollCount < $scope.popMovieSets.length-1) $scope.popScrollCount++;
				else if($scope.popScrollCount == $scope.popMovieSets.length-1) $scope.popScrollCount = 0;
				$scope.popMovieDisplay = $scope.popMovieSets[$scope.popScrollCount];
				break;
			case "now":
				if($scope.nowScrollCount < $scope.nowMovieSets.length-1) $scope.nowScrollCount++;
				else if($scope.nowScrollCount == $scope.nowMovieSets.length-1) $scope.nowScrollCount = 0;
				$scope.nowMovieDisplay = $scope.nowMovieSets[$scope.nowScrollCount];
				break;
			case "rec":
				if($scope.recScrollCount < $scope.recMovieSets.length-1) $scope.recScrollCount++;
				else if($scope.recScrollCount == $scope.recMovieSets.length-1) $scope.recScrollCount = 0;
				$scope.recMovieDisplay = $scope.recMovieSets[$scope.recScrollCount];
				break;
			default: break;
		}
	}

	// movie redirect
	$scope.gotoMovie = function(id){
		$location.url("/movies/" + id);
	}

	$scope.$emit("dashboardEvent", [1, $localStorage.userID]);

	$scope.numberOfMovies = getNumberOfMovies();
	$scope.timeOut = null;
	window.onresize = function(){
	   if ($scope.timeOut != null)
	       clearTimeout($scope.timeOut);

	   $scope.timeOut = setTimeout(function(){
		   var update = getNumberOfMovies();
   			if($scope.numberOfMovies != update) {
	   			$scope.numberOfMovies = update;
	   			updateSets($scope.numberOfMovies);
				$scope.$apply();
			}
	   }, 0);
	};

	$scope.$on("dashboardUpdate", function(event, returnMovies) {
		if(returnMovies[2].length == 0) $scope.recGet = false;
		$scope.popMovieStore = returnMovies[0];
		$scope.nowMovieStore = returnMovies[1];
		$scope.recMovieStore = returnMovies[2];
		updateSets($scope.numberOfMovies);
	});

	function updateSets(x) {
		$scope.popMovieSets = [];
		$scope.nowMovieSets = [];
		$scope.recMovieSets = [];
		$scope.popMovieDisplay = [];
		$scope.nowMovieDisplay = [];
		$scope.recMovieDisplay = [];
		for(i = 0; i < $scope.popMovieStore.length/x; i++) {
			$scope.popMovieSets.push($scope.popMovieStore.slice(x*i,x*i+x));
		}
		for(i = 0; i < $scope.nowMovieStore.length/x; i++) {
			$scope.nowMovieSets.push($scope.nowMovieStore.slice(x*i,x*i+x));
		}
		$scope.recMovieStore.sort(function() { return 0.5 - Math.random() });
		for(i = 0; i < $scope.recMovieStore.length/x; i++) {
			$scope.recMovieSets.push($scope.recMovieStore.slice(x*i,x*i+x));
		}

		if($scope.popScrollCount >= $scope.popMovieSets.length-1) $scope.popScrollCount = 0;
		if($scope.nowScrollCount >= $scope.nowMovieSets.length-1) $scope.nowScrollCount = 0;
		if($scope.recScrollCount >= $scope.recMovieSets.length-1) $scope.recScrollCount = 0;

		$scope.popMovieDisplay = $scope.popMovieSets[$scope.popScrollCount];
		$scope.nowMovieDisplay = $scope.nowMovieSets[$scope.nowScrollCount];
		$scope.recMovieDisplay = $scope.recMovieSets[$scope.recScrollCount];
	};

	function getNumberOfMovies() {
		if(window.innerWidth <= 1200 && window.innerWidth > 991)
    		return 4;
    	else if(window.innerWidth <= 991 && window.innerWidth > 740)
    		return 3;
    	else if(window.innerWidth <= 740 && window.innerWidth > 560)
			return 2;
		else if(window.innerWidth <= 560)
			return 1;
		else
			return 5;
	};
});

///////////////////////////////////////////////////////
// SEARCH CONTROLLER
///////////////////////////////////////////////////////
index.controller("search-controller", function($scope,$route,$location,$timeout, $localStorage, $sessionStorage) {
	$scope.searchResult = [];
	$scope.searchString = $sessionStorage.sString;
	$scope.searchResult = $sessionStorage.searchResult;

	$scope.search = function() {
		var searchObject = {
			query: $scope.searchString
		};
		$sessionStorage.sString=$scope.searchString;
		$scope.$emit("searchEvent", searchObject);
	}
	$scope.$on("searchUpdate", function(event, searchArray) {
		$scope.searchResult = searchArray;
		$sessionStorage.searchResult = searchArray;
		$sessionStorage.sString = $scope.searchString;
		$location.url("/search");

	});
	$scope.searchReturn = function(){
		if($sessionStorage.searchResult.length === 0){
			return 1;
		}
		else{
			return 0;
		}
	}

	$scope.reset = function() {
		delete $localStorage.userID;
	}

	$scope.gotoMovie = function(id){
		$location.url("/movies/" + id);
	}
});

///////////////////////////////////////////////////////
// SIGNUP CONTROLLER
///////////////////////////////////////////////////////
index.controller("signup-controller", function($scope, $location, $http, $localStorage) {
	$scope.signupError = false;

	$scope.signUp = function() {
		// get form info
		var user = {
			username: $scope.username,
			email: $scope.email,
			password: $scope.password
		};
		// send to parent controller
		$scope.$emit("signupEvent", user);
	}

	$scope.login = function() {
		$location.url("/login");
	}

	// if sign up was successful, update id and send to new page
	$scope.$on("signupUpdate", function(event, user) {
		$localStorage.userID = user.userID;
		$localStorage.setupDone = user.setupDone;
		$location.url("/setup");
	});

	// if sign up failed, update page
	$scope.$on("signupError", function(event, error) {
		$scope.signupError = error;
	});
});

///////////////////////////////////////////////////////
// ACCOUNT SETUP CONTROLLER
///////////////////////////////////////////////////////
index.controller("accsetup-controller", function($scope, $location, $http, $localStorage, $timeout) {
	if($localStorage.userID === undefined) { // if the user isn't signed in, send them back to signup splash
		$location.url("/");
	}
	else if($localStorage.setupDone === true) { // if user has setup already, send to dash
		$location.url("/dashboard");
	}

	// ng-show flags for boxes
	$scope.genreShow = true;
	$scope.movieShow = false;

	$scope.genres = []; // array to pass to server, contains all the genres the user has selected
	$scope.movieStore = []; // return array from api get
	$scope.movieSets = []; // return array from api get
	$scope.movieDisplay = []; // buffer that is displayed on preferences
	$scope.moviePrefs = []; // preferences to pass to server
	$scope.count = 0; // count for buffer

	// add genre to array if clicked, remove if already clicked
	$scope.genreClick = function(genre) {
		var index = $scope.genres.indexOf(genre);
		if(index > -1) { // if array contains genre
			$scope.genres.splice(index, 1);
		}
		else { // else add genre to array
			$scope.genres.push(genre);
		}
		updateGenre(genre); // update button
	};

	$scope.movieClick = function(movie) {
		movie.clicked = !movie.clicked; // toggle border
		var index = $scope.moviePrefs.indexOf(movie.id);
		if(index > -1) { // if array contains movie id
			$scope.moviePrefs.splice(index, 1);
		}
		else { // else add movie id to array
			$scope.moviePrefs.push(movie.id);
		}
	}

	// swap boxes
	$scope.genreNext = function() {
		$scope.genreShow = false;
		$scope.movieShow = true;
		if($scope.genres.length == 0) {
			$scope.skip(); // if no genres were selected, end the preference setup
		}
		else {
			var obj = {genres: $scope.genres};
			$scope.$emit("genreEvent", obj);
		}
	}

	// display next set of movies
	$scope.nextMovies = function() {
		$scope.count++;
		if($scope.count == $scope.movieStore.length) { // if no more, send them to dashboard
			var obj = {
				userID: $localStorage.userID,
				movie_ids: $scope.moviePrefs.sort(function() { return 0.5 - Math.random() })
			};
			$scope.$emit("prefEvent", obj); // send list of pref movies to server
			$localStorage.setupDone = true;
			$location.url("/dashboard"); // finish and redirect
		}
		else { // otherwise show new list of movies
			scramble();
		}
	}

	$scope.scramble = function() {
		scrambleGet($scope.count);
	}

	// skip out of preference selection
	$scope.skip = function() {
		$location.url("/dashboard");
	}

	// receieve array of movies from genre array
	$scope.$on("genreUpdate", function(event, movies) {
		$scope.movieStore = movies;
		scrambleGet(0);
	});

	// Helper function to update the scope variables
	function updateGenre(genre) {
		switch(genre) {
			case 28: $scope.actionState = !$scope.actionState ; break;
			case 12: $scope.adventureState = !$scope.adventureState; break;
			case 16: $scope.animationState = !$scope.animationState; break;
			case 35: $scope.comedyState = !$scope.comedyState; break;
			case 80: $scope.crimeState = !$scope.crimeState; break;
			case 18: $scope.dramaState = !$scope.dramaState; break;
			case 10751: $scope.familyState = !$scope.familyState; break;
			case 14: $scope.fantasyState = !$scope.fantasyState; break;
			case 36: $scope.historyState = !$scope.historyState; break;
			case 27: $scope.horrorState = !$scope.horrorState; break;
			case 10402: $scope.musicState = !$scope.musicState; break;
			case 9648: $scope.mysteryState = !$scope.mysteryState; break;
			case 10749: $scope.romanceState = !$scope.romanceState; break;
			case 878: $scope.scifiState	= !$scope.scifiState; break;
			case 53: $scope.thrillerState = !$scope.thrillerState; break;
			case 10770: $scope.tvmovieState = !$scope.tvmovieState; break;
			case 10752: $scope.warState = !$scope.warState; break;
			case 37: $scope.westernState = !$scope.westernState; break;
			default: break;
		}
	};

	$scope.numberOfMovies = getNumberOfMovies();
	$scope.timeOut = null;
	window.onresize = function(){
		if($scope.movieStore.length != 0) {
		    if ($scope.timeOut != null)
		        clearTimeout($scope.timeOut);

		    $scope.timeOut = setTimeout(function(){
			    var update = getNumberOfMovies();
	   			if($scope.numberOfMovies != update) {
					$scope.numberOfMovies = update;
		   			updateMovies();
					$scope.$apply();
				}
		    }, 0);
	   }
	};

	function updateMovies() {
		$scope.movieDisplay = $scope.movieStore[$scope.count].slice(0, getNumberOfMovies());
	}

	// Helper to get new 5 movies for movieDisplay
	function scrambleGet(i) {
		$scope.movieStore[i].sort(function() { return 0.5 - Math.random() });
		$scope.movieDisplay = $scope.movieStore[i].slice(0,getNumberOfMovies());
	}

	function getNumberOfMovies() {
		if(window.innerWidth <= 1200 && window.innerWidth > 991)
    		return 4;
    	else if(window.innerWidth <= 991 && window.innerWidth > 740)
    		return 3;
    	else if(window.innerWidth <= 740 && window.innerWidth > 560)
			return 2;
		else if(window.innerWidth <= 560)
			return 1;
		else
			return 5;
	};
});

///////////////////////////////////////////////////////
// LOGIN CONTROLLER
///////////////////////////////////////////////////////
index.controller("login-controller", function($scope, $location, $http, $localStorage) {
	$scope.loginError = false;

	$scope.loginAcc = function() {
		var user = {
			username: $scope.username,
			password: $scope.password
		};
		$scope.$emit("loginEvent", user);
	}

	$scope.signup = function() {
		$location.url("/signup");
	}

	// if login was successful, update id and send to new page
	$scope.$on("loginUpdate", function(event, user) {
		// replace with $localStorage.user = user;
		$localStorage.userID = user.userID;
		$localStorage.setupDone = user.setupDone;
		$location.url("/dashboard");

	});

	// if login failed, update page
	$scope.$on("loginError", function(event, error) {
		$scope.loginError = error;
	});
});

///////////////////////////////////////////////////////
// Reset Password CONTROLLER
///////////////////////////////////////////////////////
index.controller("password-controller", function($scope,$location,$localStorage) {

	if($localStorage.userID === undefined) {
		$location.url("/");
	}
	$scope.goDashboard = function(){
		$location.url("/dashboard");
	}
	$scope.goAccountSettings = function(){
		$location.url("/account");
	}
});

///////////////////////////////////////////////////////
// Reset email CONTROLLER
///////////////////////////////////////////////////////
index.controller("email-controller", function($scope,$location,$localStorage) {

	if($localStorage.userID === undefined) {
		$location.url("/");
	}
	$scope.goDashboard = function(){
		$location.url("/dashboard");
	}
	$scope.goAccountSettings = function(){
		$location.url("/account");
	}
});

///////////////////////////////////////////////////////
// Reset Name CONTROLLER
///////////////////////////////////////////////////////
index.controller("name-controller", function($scope,$location,$localStorage) {

	if($localStorage.userID === undefined) {
		$location.url("/");
	}
	$scope.goDashboard = function(){
		$location.url("/dashboard");
	}
	$scope.goAccountSettings = function(){
		$location.url("/account");
	}
});

///////////////////////////////////////////////////////
// Movie CONTROLLER
///////////////////////////////////////////////////////
index.controller("movie-controller", function($scope,$location,$routeParams,$http, $localStorage, $filter) {

	$scope.prefMovies = [];
	var ids = {
		movie_id: $routeParams.id,
		user_id: $localStorage.userID
		}; // get the movie id from the URL

	$scope.likeText = "Like";

	$scope.$emit("movieEvent", ids); // emit movieEvent that gets all the movie data
	if ($localStorage.userID === undefined) {
		document.getElementById("likeButton").disabled = true; // if not logged in, disable the like button
	}

	// check if the user has previously liked the movie
	$scope.$on("likeUpdate", function(event, likedMovies) {
		$scope.prefMovies = likedMovies;

		//console.log($scope.relatedMovieStore);
		//console.log($scope.prefMovies);
		for(i = 0; i < $scope.relatedMovieStore.length - 1; i++) {
			var movie = $scope.relatedMovieStore[i];
			//console.log(movie.id);
			for(j = 0; j < $scope.prefMovies.length - 1; j++) {
				if($scope.prefMovies[j].movie_id == movie.id) {
					//console.log('asg');
					movie.liked = true;
				}
			}
		}

		for (i = 0; i < likedMovies.length; i++) {
			if (likedMovies[i].movie_id == ids.movie_id) {
				$scope.likeText = "Liked";
				$scope.likeState = true; break;
			}
		}
	});

	// when the user clicks like or unlike, its emits an event and changed the look
	// of the button
	$scope.like = function() {
		$scope.likeState = !$scope.likeState;
		if ($scope.likeText == "Like") {
			var likeInfo = {
				movie_id: ids.movie_id,
				userID: ids.user_id,
				like: true
			}
			$scope.$emit("likeEvent", likeInfo);
			$scope.likeText = "Liked";
		}
		else {
			var likeInfo = {
				movie_id: ids.movie_id,
				userID: ids.user_id,
				like: false
			}
			$scope.$emit("likeEvent", likeInfo);
			$scope.likeText = "Like";
		}
	}

	// populating the moviepage
	$scope.doneload = false;
	$scope.movie;
	var movie_rating;
	var runtime;
	var obj_genres = "";
	var obj_cast = "";
	var obj_dir = "";

	$scope.numberOfMovies = getNumberOfMovies();
	$scope.relatedMovieDisplay = [];
	$scope.relatedMovieSets = [];
	$scope.relatedMovieStore = [];
	$scope.relatedScrollCount = 0;

	$scope.netflix = {
		url: "",
		button: false
	}
	$scope.microsoft = {
		url: "",
		button: false
	}
	$scope.google = {
		url: "",
		button: false
	}
	$scope.playstation = {
		url: "",
		button: false
	}
	$scope.itunes = {
		url: "",
		button: false
	}

	$scope.$on("movieUpdate", function(event, obj_movie) {
		$scope.movie = obj_movie;
		for (i = 0; i < obj_movie.similarMovies.length; i++) {
			obj_movie.similarMovies[i].poster_path = "https://image.tmdb.org/t/p/w500" + obj_movie.similarMovies[i].poster_path;
		}
		$scope.relatedMovieStore = obj_movie.similarMovies;
		//console.log($scope.relatedMovieStore);
		updateSets($scope.numberOfMovies);
		//console.log(obj_movie);
		$scope.overview = obj_movie.details.overview;
		$scope.title = obj_movie.details.title;
		$scope.poster = "https://image.tmdb.org/t/p/w500" + obj_movie.details.poster_path;
		$scope.date = obj_movie.details.release_date;

		for (i = 0; i < obj_movie.details.genres.length; i++) {
			if ((i+1) == obj_movie.details.genres.length) {
				obj_genres += obj_movie.details.genres[i].name;
			}
			else {
    			obj_genres += obj_movie.details.genres[i].name + ", ";
			}
		}

		$scope.genres = obj_genres;
		$scope.rating = obj_movie.details.vote_average;
		movie_rating = obj_movie.details.vote_average*10;
		movie_rating = movie_rating + "%";
		$("#rateYo").rateYo("rating", movie_rating);
		runtime = obj_movie.details.runtime + " min";
		$scope.duration = runtime;

		if (obj_movie.cast.length >= 10) {
			for (i = 0; i < 10; i++) {
				if (i == 9) {
					obj_cast += obj_movie.cast[i].name + " ...";
				}
				else {
	    			obj_cast += obj_movie.cast[i].name + ", ";
				}
			}
		}
		else {
			for (i = 0; i < obj_movie.cast.length; i++) {
				if ((i+1) == obj_movie.cast.length) {
					obj_cast += obj_movie.cast[i].name;
				}
				else {
	    			obj_cast += obj_movie.cast[i].name + ", ";
				}
			}
		}

		$scope.cast = obj_cast;

		var directors = $filter('filter')(obj_movie.crew, {job:"Director", department:"Directing"})

		for (i = 0; i < directors.length; i++) {
			if ((i+1) == directors.length) {
				obj_dir += directors[i].name;
			}
			else {
    			obj_dir += directors[i].name + ", ";
			}
		}

		$scope.director = obj_dir;

		if (obj_movie.providers.length !== 0) {
			for (i = 0; i < obj_movie.providers.length; i++) {
				if (obj_movie.providers[i].provider_id == 68) {
					$scope.microsoft.button = true;
					$scope.microsoft.url = obj_movie.providers[i].urls.standard_web;
				}
				if (obj_movie.providers[i].provider_id == 2) {
					$scope.itunes.button = true;
					$scope.itunes.url = obj_movie.providers[i].urls.standard_web;
				}
				if (obj_movie.providers[i].provider_id == 3) {
					$scope.google.button = true;
					$scope.google.url = obj_movie.providers[i].urls.standard_web;
				}
				if (obj_movie.providers[i].provider_id == 18) {
					$scope.playstation.button = true;
					$scope.playstation.url = obj_movie.providers[i].urls.standard_web;
				}
				if (obj_movie.providers[i].provider_id == 8) {
					$scope.netflix.button = true;
					$scope.netflix.url = obj_movie.providers[i].urls.standard_web;
				}
			}
		}

		$scope.doneload = true;

	});

	$scope.gotoNetflix = function() {
		window.location.href = $scope.netflix.url;
	}
	$scope.gotoMicrosoft = function() {
		window.location.href = $scope.microsoft.url;
	}
	$scope.gotoGoogle = function() {
		window.location.href = $scope.google.url;
	}
	$scope.gotoItunes = function() {
		window.location.href = $scope.itunes.url;
	}
	$scope.gotoPlaystation = function() {
		window.location.href = $scope.playstation.url;
	}

	$scope.$on("movieError", function(event, error) {
	});

	// initiating the star ratings
    $(function () {
    	$("#rateYo").rateYo({
    		starWidth: "20px",
    		numStars: 10,
    		readOnly: true,
    		rating: "0%",
    		ratedFill: "#ffffff"
    	});
    });

    // route for other movies
	$scope.gotoMovie = function(id){
		//$location.url("/movie");
		$location.url("/movies/" + id);
	}

	// scrollLeft shifts displayed movies to the left
	$scope.scrollLeft = function() {
		if($scope.relatedScrollCount > 0) $scope.relatedScrollCount--;
		else if($scope.relatedScrollCount == 0) $scope.relatedScrollCount = $scope.relatedMovieSets.length-1;
		$scope.relatedMovieDisplay = $scope.relatedMovieSets[$scope.relatedScrollCount];
	}

	// scrollRight shifts displayed movies to the right
	$scope.scrollRight = function() {
		if($scope.relatedScrollCount < $scope.relatedMovieSets.length-1) $scope.relatedScrollCount++;
		else if($scope.relatedScrollCount == $scope.relatedMovieSets.length-1) $scope.relatedScrollCount = 0;
		$scope.relatedMovieDisplay = $scope.relatedMovieSets[$scope.relatedScrollCount];
	}

	//$scope.$emit("dashboardEvent", [1, $localStorage.userID]);

	$scope.timeOut = null;

	window.onresize = function(){
	   if ($scope.timeOut != null)
	       clearTimeout($scope.timeOut);

	   $scope.timeOut = setTimeout(function(){
		   var update = getNumberOfMovies();
   			if($scope.numberOfMovies != update) {
	   			$scope.numberOfMovies = update;
	   			updateSets($scope.numberOfMovies);
				$scope.$apply();
			}
	   }, 0);
	};

	function updateSets(x) {
		$scope.relatedMovieSets = [];
		$scope.relatedMovieDisplay = [];
		for(i = 0; i < $scope.relatedMovieStore.length/x; i++) {
			$scope.relatedMovieSets.push($scope.relatedMovieStore.slice(x*i,x*i+x));
		}

		if($scope.relatedScrollCount >= $scope.relatedMovieSets.length-1) $scope.relatedScrollCount = 0;

		$scope.relatedMovieDisplay = $scope.relatedMovieSets[$scope.relatedScrollCount];
	};

	function getNumberOfMovies() {
		if(window.innerWidth <= 1200 && window.innerWidth > 991)
    		return 4;
    	else if(window.innerWidth <= 991 && window.innerWidth > 740)
    		return 3;
    	else if(window.innerWidth <= 740 && window.innerWidth > 560)
			return 2;
		else if(window.innerWidth <= 560)
			return 1;
		else
			return 5;
	};


});

///////////////////////////////////////////////////////
// Account CONTROLLER
///////////////////////////////////////////////////////
index.controller("account-controller", function($scope,$location,$localStorage) {
	if($localStorage.userID === undefined) { // if the user isn't signed in, send them back to signup splash
		$location.url("/");
	}
	$scope.goResetPassword = function(){
		$location.url("/password");
	}

	$scope.goResetEmail = function(){
		$location.url("/email");
	}
	$scope.goResetName = function(){
		$location.url("/name");
	}
	$scope.editFirstName = function(){
		return 1;
	}
	$scope.userID=$localStorage.userID;
	var user = {
		id: $scope.userID
	};
	$scope.$emit("accountEvent", user);
	$scope.$on("accountUpdate", function(event, userInfo) {
		$scope.username = userInfo.username;
		$scope.email = userInfo.email;
	});
});
