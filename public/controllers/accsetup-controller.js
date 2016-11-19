

/*
*	Parent controller for account setup page
*	Sends an update to the genres of a movie profile
* 	to server when childsends the array to this controlller
*/
angular.module("index.accsetup", ["ngRoute"]).controller("accsetup", function($scope, $http) {
	$scope.$on("setupEvent", function(event, genres) { // receive from child controller
		$scope.$broadcast("setupUpdate", "done"); // redirect
	});

	$scope.$on("genreEvent", function(event, genre_id) {
		var movies = [];
		$http.get("/api/movies/genre/" + genre_id).success(function(req) {
			for(i = 0; i < 20; i++) {
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
