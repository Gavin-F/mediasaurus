

/*
*	Parent controller for account setup page
*	Sends an update to the genres of a movie profile
* 	to server when childsends the array to this controlller
*/
angular.module("index.accsetup", ["ngRoute"]).controller("accsetup", function($scope, $http) {
	$scope.$on("prefEvent", function(event, moviePrefs) { // receive from child controller
		$scope.$broadcast("prefUpdate", "done"); // redirect
	});

	$scope.$on("genreEvent", function(event, genre_id) {
		var movies = [];
		$http.get("/api/movies/genre/" + genre_id).success(function(req) {
			req.sort(function() { return 0.5 - Math.random() });
			for(i = 0; i < 5; i++) {
				var movie = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average
				};
				movies.push(movie);
			}
			$scope.$broadcast("genreUpdate", movies);
		});
	});
});
