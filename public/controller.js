var index = angular.module("index",
	["ngRoute",
	"ngStorage",
	"index.signup",
	"index.login",
	"index.accsetup"
	]);

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
	.when("/movie", {
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
index.controller("dashboard-controller", function($scope,$location, $timeout, $localStorage) {

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
	}
	$scope.gotoMovie = function(){
		$location.url("/movie");
	}

	$(document).ready(function() {
		$('.tooltip-custom').tooltipster({
			side: 'right',
			interactive: true,
			arrow: false,
			animation: 'swing',
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
	$scope.genreShow = true;
	$scope.movieShow = false;
	// if the user isn't signed in, send them back to signup splash
	if($localStorage.userID === undefined) {
		$location.url("/");
	}
	else if($localStorage.setupDone === true) {
		$location.url("/dashboard");
	}

	$scope.movies = [];
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

	$scope.genreNext = function() {
		$scope.genreShow = false;
		$scope.movieShow = true;
		//$scope.$emit("setupEvent", $scope.genres);
	}

	$scope.skip = function() {
		$location.url("/dashboard");
	}

	$scope.$emit("genreEvent", 28);

	// if sign up was successful, update id and send to new page
	$scope.$on("setupUpdate", function(event, setup) {
		$location.url("/dashboard");
	});

	$scope.$on("genreUpdate", function(event, movies) {
		movies.sort(function() { return 0.5 - Math.random() }); // scramble the movies
		$scope.movies = movies.slice(0,5);
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
index.controller("movie-controller", function($scope,$location) {

    $('.rating').likeDislike({
        initialValue: 0,
        click: function (value, l, d, event) {
            var likes = $(this.element).find('.likes');
            var dislikes = $(this.element).find('.dislikes');

            likes.text(parseInt(likes.text()) + l);
            dislikes.text(parseInt(dislikes.text()) + d);

            // $.ajax({
            //     url: 'url',
            //     type: 'post',
            //     data: 'value=' + value,
            // });
        }
    });

    $(function () {
    	$("#rateYo").rateYo({
    		starWidth: "20px",
    		numStars: 10,
    		readOnly: true,
    		rating: "88%"
    	});
    });

    var $rateYo = $("#rateYo").rateYo();
    var rating = $rateYo.rateYo("rating");
    rating = rating/10;
    document.getElementById("rating_text").innerHTML = rating;

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
index.controller("account-controller", function($scope,$location) {

	$scope.message = "hello";

	$scope.setText = function() {
		$scope.test = "Hello world!";
	}
});
