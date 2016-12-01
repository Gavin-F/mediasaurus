/*
*	Parent controller for account setup page
*	Sends an update to the genres of a movie profile
* 	to server when childsends the array to this controlller
*/
angular.module("index.accsetup", ["ngRoute"]).controller("accsetup", function($scope, $http) {
	// send list of genres to server, get back a array containing array of movies
	$scope.$on("genreEvent", function(event, obj) {
		var movies = [];
		$http.post("/api/movies/genres", obj).success(function(req) {
			for(i = 0; i < req.length; i++) {
				var movieSubset = [];
				for(j = 0; j < 20; j++) {
					var movie = {
						id: req[i][j].id,
						title: req[i][j].title,
						poster: "https://image.tmdb.org/t/p/w500" + req[i][j].poster_path,
						rating: req[i][j].vote_average
					};
					movieSubset.push(movie);
				}
				movies.push(movieSubset);
			}
			$scope.$broadcast("genreUpdate", movies);
		});
	});

	// send the list of pref'd movies to database
	$scope.$on("prefEvent", function(event, obj) { // receive from child controller
		$http.put("/api/movies/preferences/" + obj.userID , obj).success(function(req) {
			setup = {movieSetup: true};
			$http.patch("/api/users/" + obj.userID + "/setups", setup);
		});
	});

});
