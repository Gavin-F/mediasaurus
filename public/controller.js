
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
	.when("/dashboard", {
		templateUrl: "/html/dashboard.html",
		controller: "dashboard-controller"
	})
	.when("/search", {
		templateUrl: "/html/search.html",
		controller: "search-controller"
	})
	.when("/testpage", {
		templateUrl: "/html/TestPage.html",
		controller: "testpage-controller"
	})
	.when("/account", {
		templateUrl: "/html/account.html",
		controller: "account-controller"
	})
	.when("/password", {
		templateUrl: "/html/resetpassword.html",
		controller: "password-controller"
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
index.controller("index-controller", ["$scope", "$http", "$location", "$window", function($scope, $http, $location, $window) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
	$scope.isActive2 = function() {
    if(($location.path()=='/account')||($location.path()=='/password')){
    	return 1;
	}
	else{
		return 0;
	}
	};

	$scope.reset = function() {
		delete $localStorage.userID;
		location.reload();
	}
	
	$scope.goHome = function(){
		$location.url("/home");
		console.log("goHome");
	}

}]);

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
		$location.url("http://google.com");
	}
});



///////////////////////////////////////////////////////
// DASH CONTROLLER
///////////////////////////////////////////////////////
index.controller("dashboard-controller", function($scope,$location, $http, $timeout, $localStorage,$sessionStorage) {
	// logout user for debugging only!!
	if($localStorage.userID !== undefined) {
		$scope.userID = "Logged in!";
		$scope.loggedin = true;
	}
	else {
		$scope.userID = "Not logged in!";
		$scope.loggedin = false;
	}

	$scope.searchResult = [];
	$scope.search = function() {
		var searchObject = {
			query: $scope.search_string
		};
		$sessionStorage.sString=$scope.search_string;
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
			default: break;
		}
	}

	$scope.gotoMovie = function(id){
		$location.url("/movies/" + id);
	}

	$scope.$emit("dashboardEvent", 1);

	$scope.$on("dashboardUpdate", function(event, returnMovies) {
		$scope.popMovieDisplay = returnMovies[0].slice(0,5);
		$scope.nowMovieDisplay = returnMovies[1].slice(0,5);
		$scope.popMovieStore.push(returnMovies[0].slice(0,5),
			returnMovies[0].slice(5,10),
			returnMovies[0].slice(10,15),
			returnMovies[0].slice(15,20));
		$scope.nowMovieStore.push(returnMovies[1].slice(0,5),
		  	returnMovies[1].slice(5,10),
		  	returnMovies[1].slice(10,15),
		  	returnMovies[1].slice(15,20));
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
index.controller("search-controller", function($scope,$route,$location, $timeout, $localStorage, $sessionStorage) {
	
	$scope.searchResult = [];
	$scope.searchResult = $sessionStorage.searchResult;
	$scope.search = function() {
		var searchObject = {
			query: $scope.search_string
		};
		$sessionStorage.sString=$scope.search_string;
		$scope.$emit("searchEvent", searchObject);
	}
	$scope.$on("searchUpdate", function(event, searchArray) {
		if($sessionStorage.searchResult !== undefined) {
			$scope.searchResult = $sessionStorage.searchResult;
			delete $sessionStorage.searchResult;
		}
		else{
			$scope.searchResult = searchArray;
		}
		$location.url("/search");
	});


	$scope.searchNext = function() {
		$location.url("/search");
		$route.reload();
	}
	$scope.searchPrevious = function() {
		$location.url("/search");
		$route.reload();
	}
	$scope.reset = function() {
		delete $localStorage.userID;
	}
	$scope.gotoMovie = function(id){
		//$location.url("/movie");
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
	// if the user isn't signed in, send them back to signup splash
	if($localStorage.userID === undefined) {
		$location.url("/");
	}

	$scope.genres = []; // array to pass to server, contains all the genres the user has selected
	$scope.genreClick = function(genre) {
		var index = $scope.genres.indexOf(genre);
		if(index > -1) {// array contains the genre
			$scope.genres.splice(index, 1);
		}
		else { // else remove genre from array
			$scope.genres.push(genre);
		}
		updateGenre(genre);
	};

	$scope.next = function() {
		console.log($scope.genres.toString());
		$scope.$emit("setupEvent", $scope.genres);
	}

	$scope.skip = function() {
		$location.url("/dashboard");
	}

	// if sign up was successful, update id and send to new page
	$scope.$on("setupUpdate", function(event, setup) {
		$location.url("/dashboard");
	});

	// Helper function to update the scope variables
	function updateGenre(genre) {
		switch(genre) {
			case "action": $scope.actionState = !$scope.actionState ; break;
			case "adventure": $scope.adventureState = !$scope.adventureState; break;
			case "animation": $scope.animationState = !$scope.animationState; break;
			case "biography": $scope.biographyState = !$scope.biographyState; break;
			case "comedy": $scope.comedyState = !$scope.comedyState; break;
			case "crime": $scope.crimeState = !$scope.crimeState; break;
			case "drama": $scope.dramaState = !$scope.dramaState; break;
			case "family": $scope.familyState = !$scope.familyState; break;
			case "fantasy": $scope.fantasyState = !$scope.fantasyState; break;
			case "filmnoir": $scope.filmnoirState = !$scope.filmnoirState; break;
			case "history": $scope.historyState = !$scope.historyState; break;
			case "horror": $scope.horrorState = !$scope.horrorState; break;
			case "music": $scope.musicState = !$scope.musicState; break;
			case "musical": $scope.musicalState = !$scope.musicalState; break;
			case "mystery": $scope.mysteryState = !$scope.mysteryState; break;
			case "romance": $scope.romanceState = !$scope.romanceState; break;
			case "scifi": $scope.scifiState	= !$scope.scifiState; break;
			case "sport": $scope.sportState = !$scope.sportState; break;
			case "thriller": $scope.thrillerState = !$scope.thrillerState; break;
			case "war": $scope.warState = !$scope.warState; break;
			case "western": $scope.westernState = !$scope.westernState; break;
			default: break;
		}
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
	// if login was successful, update id and send to new page
	$scope.$on("loginUpdate", function(event, userID) {
		$localStorage.userID = userID;
		$location.url("/dashboard");
	});

	// if login failed, update page
	$scope.$on("loginError", function(event, error) {
		$scope.loginError = error;
	});
});



///////////////////////////////////////////////////////
// TEST CONTROLLER
///////////////////////////////////////////////////////
index.controller("testpage-controller", function($scope,$location) {

	$scope.message = "hello";

	$scope.setText = function() {
		$scope.test = "Hello world!";
	}
	// adding comment to make sure merge went as planned.
	$scope.goHome = function(){
		$location.url("/");
	}
});



///////////////////////////////////////////////////////
// Reset Controller CONTROLLER
///////////////////////////////////////////////////////
index.controller("password-controller", function($scope,$location) {

	$scope.message = "hello";

	$scope.setText = function() {
		$scope.test = "Hello world!";
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
});
///////////////////////////////////////////////////////
// Movie CONTROLLER
///////////////////////////////////////////////////////
index.controller("movie-controller", function($scope,$location,$routeParams) {
	var movie_id = $routeParams.id;

	$scope.$emit("movieEvent", movie_id);

    $('.rating').likeDislike({
        initialValue: 0,
        click: function (value, l, d, event) {
            var likes = $(this.element).find('.likes');
            var dislikes = $(this.element).find('.dislikes');

            likes.text(parseInt(likes.text()) + l);
            dislikes.text(parseInt(dislikes.text()) + d);
        }
    });

	var movie_rating;
	var runtime;
	var obj_genres = [];

    $(function() {
		$('.tooltip-custom').tooltipster({
			side: 'right',
			interactive: true,
			arrow: false,
			animation: 'swing',
			contentCloning: true
		});
	});

	$scope.$on("movieUpdate", function(event, obj_movie) {
		console.log(obj_movie);
		$scope.overview = obj_movie.overview;
		$scope.title = obj_movie.title;
		$scope.poster = "https://image.tmdb.org/t/p/w500" + obj_movie.poster_path;
		$scope.date = obj_movie.release_date;

		for (i = 0; i < obj_movie.genres.length; i++) {
			if ((i+1) == obj_movie.genres.length) {
				obj_genres += obj_movie.genres[i].name;
			}
			else {
    			obj_genres += obj_movie.genres[i].name + ", ";
			}
		}

		$scope.genres = obj_genres;
		$scope.rating = obj_movie.vote_average;
		movie_rating = obj_movie.vote_average*10;
		movie_rating = movie_rating + "%";
		$("#rateYo").rateYo("rating", movie_rating);
		runtime = obj_movie.runtime + " min";
		$scope.duration = runtime;
	});

	$scope.$on("movieError", function(event, error) {

	});

    $(function () {
    	console.log(movie_rating);
    	$("#rateYo").rateYo({
    		starWidth: "20px",
    		numStars: 10,
    		readOnly: true,
    		rating: "0%",
    		ratedFill: "#33CCCC"
    	});
    });
});

///////////////////////////////////////////////////////
// Account CONTROLLER
///////////////////////////////////////////////////////
index.controller("account-controller", function($scope,$location,$localStorage) {
	$scope.userID=$localStorage.userID;
	var user = {
		id: $scope.userID
	};
	$scope.$emit("accountEvent", user);
	// if login was successful, update id and send to new page
	$scope.$on("accountUpdate", function(event, userInfo) {
		$scope.username = userInfo.username;
		$scope.email = userInfo.email;
		console.log(userInfo);
	});

});
