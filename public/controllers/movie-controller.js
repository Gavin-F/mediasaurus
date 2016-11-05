


angular.module("index.moviepage", ["ngRoute"]).controller("movie", function($scope, $http) {
	$scope.$on("movieEvent", function(event, movie_id) { // receive from child controller
		$http.post("/api/movies/" + "109445").success(function(req) { // authenticate user sign up
			if(req.state === "success") { // indicates signup was successful
				$scope.$broadcast("movieUpdate", req.movie); // send back the user id
			}
			else { // failed signup, show alert
				$scope.$broadcast("movieError", true);
			}
		});
	});
});
