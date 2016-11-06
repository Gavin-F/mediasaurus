


angular.module("index.moviepage", ["ngRoute"]).controller("movie", function($scope, $http) {
	$scope.$on("movieEvent", function(event, movie_id) { // receive from child controller
		$http.get("/api/movies/" + movie_id).success(function(req) { // authenticate user sign up
				$scope.$broadcast("movieUpdate", req); // send back the user id
		});
	});
});
