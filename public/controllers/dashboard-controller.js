/*
*	Parent controller for account page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.dashboard", ["ngRoute"]).controller("dashboard", function($scope, $http) {
	$scope.$on("dashboardEvent", function(event, input) { // receive from child controller
		$http.get("/api/movies/popular/" + 1).success(function(req) {
			var movies = [];
			for(i = 0; i < 20; i++) {
				var movie = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average
				};
				movies.push(movie);
			}
			$scope.$broadcast("dashboardUpdate", movies);
		});
	});
});
