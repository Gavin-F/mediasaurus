
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

//Branch Comment
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
index.controller("index-controller", function($scope,$route, $localStorage, $http, $location, $window) {
	// $scope.isActive = function (viewLocation) {
	// 	return viewLocation === $location.path();
	// };
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
index.controller("dashboard-controller", function($scope,$location, $http, $timeout, $localStorage,$sessionStorage) {
	// logout user for debugging only!!
	$localStorage.setupDone = false;
	if($localStorage.userID !== undefined) {
		$scope.userID = "Logged in!";
		$scope.loggedin = true;
		$scope.recShow = true;
	}
	else {
		$scope.recShow = false;
		$scope.userID = "Not logged in!";
		$scope.loggedin = false;
	}

	$scope.recShow = false;
	$scope.recGet = true;
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
		location.reload();
	}
	// logout user for debugging only!!

	$scope.popMovieDisplay = [];
	$scope.popMovieStore = [];
	$scope.popScrollCount = 0;

	$scope.nowMovieDisplay = [];
	$scope.nowMovieStore = [];
	$scope.nowScrollCount = 0;

	$scope.recMovieDisplay = [];
	$scope.recMovieStore = [];
	$scope.recScrollCount = 0;

	// scrollLeft shifts displayed movies to the left
	$scope.scrollLeft = function(section) {
		switch(section) {
			case "pop":
				if($scope.popScrollCount > 0) $scope.popScrollCount--;
				else if($scope.popScrollCount == 0) $scope.popScrollCount = $scope.popMovieStore.length-1;
				$scope.popMovieDisplay = $scope.popMovieStore[$scope.popScrollCount];
				break;
			case "now":
				if($scope.nowScrollCount > 0) $scope.nowScrollCount--;
				else if($scope.nowScrollCount == 0) $scope.nowScrollCount = $scope.nowMovieStore.length-1;
				$scope.nowMovieDisplay = $scope.nowMovieStore[$scope.nowScrollCount];
				break;
			case "rec":
				if($scope.recScrollCount > 0) $scope.recScrollCount--;
				else if($scope.recScrollCount == 0) $scope.recScrollCount = $scope.recMovieStore.length-1;
				$scope.recMovieDisplay = $scope.recMovieStore[$scope.recScrollCount];
				break;
			default: break;
		}
	}

	// scrollRight shifts displayed movies to the right
	$scope.scrollRight = function(section) {
		switch(section) {
			case "pop":
				if($scope.popScrollCount < $scope.popMovieStore.length-1) $scope.popScrollCount++;
				else if($scope.popScrollCount == $scope.popMovieStore.length-1) $scope.popScrollCount = 0;
				$scope.popMovieDisplay = $scope.popMovieStore[$scope.popScrollCount];
				break;
			case "now":
				if($scope.nowScrollCount < $scope.nowMovieStore.length-1) $scope.nowScrollCount++;
				else if($scope.nowScrollCount == $scope.nowMovieStore.length-1) $scope.nowScrollCount = 0;
				$scope.nowMovieDisplay = $scope.nowMovieStore[$scope.nowScrollCount];
				break;
			case "rec":
				if($scope.recScrollCount < $scope.recMovieStore.length-1) $scope.recScrollCount++;
				else if($scope.recScrollCount == $scope.recMovieStore.length-1) $scope.recScrollCount = 0;
				$scope.recMovieDisplay = $scope.recMovieStore[$scope.recScrollCount];
				break;
			default: break;
		}
	}

	$scope.gotoMovie = function(id){
		$location.url("/movies/" + id);
	}

	$scope.$emit("dashboardEvent", [1, $localStorage.userID]);

	$scope.$on("dashboardUpdate", function(event, returnMovies) {
		if(returnMovies[2].length == 0) $scope.recGet = false;
		for(i = 0; i < returnMovies[0].length/5; i++) {
			$scope.popMovieStore.push(returnMovies[0].slice(5*i,5*i+5));
		}
		for(i = 0; i < returnMovies[1].length/5; i++) {
			$scope.nowMovieStore.push(returnMovies[1].slice(5*i,5*i+5));
		}
		for(i = 0; i < returnMovies[2].length/5; i++) {
			$scope.recMovieStore.push(returnMovies[2].slice(5*i,5*i+5));
		}
		$scope.popMovieDisplay = $scope.popMovieStore[0];
		$scope.nowMovieDisplay = $scope.nowMovieStore[0];
		$scope.recMovieDisplay = $scope.recMovieStore[0];
	});

	$(document).ready(function() {
		$('.tooltip-custom').tooltipster({
			side: 'bottom',
			interactive: false,
			arrow: false,
			theme: 'tooltipster-borderless',
			//animation: 'fall',
			contentCloning: true
		});
	});
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

	// if sign up was successful, update id and send to new page
	$scope.$on("signupUpdate", function(event, userID) {
		$localStorage.userID = userID;
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
index.controller("accsetup-controller", function($scope, $location, $http, $localStorage) {
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
	$scope.movieBuffer = []; // buffer that is displayed on preferences
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
			//$localStorage.setupDone = true; // lock so user can't enter setup again
			var obj = {
				userID: $localStorage.userID,
				movie_ids: $scope.moviePrefs.sort(function() { return 0.5 - Math.random() })
			};
			$scope.$emit("prefEvent", obj); // send list of pref movies to server
			$location.url("/dashboard"); // finish and redirect
		}
		else { // otherwise show new list of movies
			$scope.scramble($scope.count);
		}
	}

	// scramble the 5 lists movies from store
	$scope.scramble = function() {
		scrambleGet5($scope.count);
	}

	// skip out of preference selection
	$scope.skip = function() {
		$location.url("/dashboard");
	}

	// receieve array of movies from genre array
	$scope.$on("genreUpdate", function(event, movies) {
		$scope.movieStore = movies;
		scrambleGet5(0);
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

	// Helper to get new 5 movies for movieBuffer
	function scrambleGet5(i) {
		$scope.movieStore[i].sort(function() { return 0.5 - Math.random() });
		$scope.movieBuffer = $scope.movieStore[i].slice(0,5);
	}
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
	// if login was successful, update id and send to new page
	$scope.$on("loginUpdate", function(event, userID) {
		$localStorage.userID = userID;
		$scope.userID=$localStorage.userID;
		
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
		var like = {
			movie_id: ids.movie_id,
			userID: ids.user_id,
		}
		$scope.likeState = !$scope.likeState;
		if ($scope.likeText == "Like") {
			$scope.likeText = "Liked";
			$scope.$emit("likeEvent", like);
		}
		else {
			$scope.likeText = "Like";
			$scope.$emit("unlikeEvent", like);
		}
	}

	// populating the moviepage
	var movie_rating;
	var runtime;
	var obj_genres = "";
	var obj_cast = "";
	var obj_dir = "";

	$scope.$on("movieUpdate", function(event, obj_movie) {
		$scope.overview = obj_movie[0].details.overview;
		$scope.title = obj_movie[0].details.title;
		$scope.poster = "https://image.tmdb.org/t/p/w500" + obj_movie[0].details.poster_path;
		$scope.date = obj_movie[0].details.release_date;

		for (i = 0; i < obj_movie[0].details.genres.length; i++) {
			if ((i+1) == obj_movie[0].details.genres.length) {
				obj_genres += obj_movie[0].details.genres[i].name;
			}
			else {
    			obj_genres += obj_movie[0].details.genres[i].name + ", ";
			}
		}

		$scope.genres = obj_genres;
		$scope.rating = obj_movie[0].details.vote_average;
		movie_rating = obj_movie[0].details.vote_average*10;
		movie_rating = movie_rating + "%";
		$("#rateYo").rateYo("rating", movie_rating);
		runtime = obj_movie[0].details.runtime + " min";
		$scope.duration = runtime;

		for (i = 0; i < 10; i++) {
			if (i == 9) {
				obj_cast += obj_movie[0].cast[i].name;
			}
			else {
    			obj_cast += obj_movie[0].cast[i].name + ", ";
			}
		}

		$scope.cast = obj_cast;

		var directors = $filter('filter')(obj_movie[0].crew, {job:"Director", department:"Directing"})

		for (i = 0; i < directors.length; i++) {
			if ((i+1) == directors.length) {
				obj_dir += directors[i].name;
			}
			else {
    			obj_dir += directors[i].name + ", ";
			}
		}

		$scope.director = obj_dir;
	});

	$scope.$on("movieError", function(event, error) {

	});

	// initiating the star ratings
    $(function () {
    	$("#rateYo").rateYo({
    		starWidth: "20px",
    		numStars: 10,
    		readOnly: true,
    		rating: "0%",
    		ratedFill: "#33CCCC"
    	});
    });

    // route for other movies
	$scope.gotoMovie = function(id){
		//$location.url("/movie");
		$location.url("/movies/" + id);
	}

	$scope.relatedMovies = [];

	$scope.$on("relatedMovieUpdate", function(event, relatedMovies) {
		for(i = 0; i < relatedMovies.length; i++) {
			//console.log(relatedMovies[i]);
			var relatedMovie = {
				id: relatedMovies[i].id,
				title: relatedMovies[i].title,
				poster: "https://image.tmdb.org/t/p/w500" + relatedMovies[i].poster_path,
				rating: relatedMovies[i].vote_average
			};
			$scope.relatedMovies.push(relatedMovie);
		}
	});
});

///////////////////////////////////////////////////////
// Account CONTROLLER
///////////////////////////////////////////////////////
index.controller("account-controller", function($scope,$location,$localStorage) {
	if($localStorage.userID === undefined) { // if the user isn't signed in, send them back to signup splash
		$location.url("/");
	}
	else if($localStorage.setupDone === true) { // if user has setup already, send to dash
		$location.url("/dashboard");
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
