/*
*	Parent controller for account page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.dashboard", ["ngRoute"]).controller("dashboard", function($scope, $http, $q) {
	// Send back popular movies
	$scope.$on("dashboardPopEvent", function(event, page) { // receive from child controller
		$http.get("/api/movies/popular/" + page).success(function(req) {
			var popMovies = [];
			for(i = 0; i < 20; i++) {
				var movie = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average
				};
				popMovies.push(movie);
			}
			$scope.$broadcast("dashboardPopUpdate", popMovies);
		});
	});
	/*
	// Send back now playing movies
	$scope.$on("dashboardNowEvent", function(event, page) { // receive from child controller
		$http.get("/api/movies/now_playing/" + page).success(function(req) {
			var nowMovies = [];
			for(i = 0; i < 20; i++) {
				var movie = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average
				};
				nowMovies.push(movie);
			}
			$scope.$broadcast("dashboardNowUpdate", nowMovies);
		});
	});
	*/

});
