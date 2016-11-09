


angular.module("index.moviepage", ["ngRoute"]).controller("movie", function($scope, $http) {
	$scope.$on("movieEvent", function(event, movie_id) { // receive from child controller

		$http.get("/api/movies/" + movie_id).success(function(req) { 
			$scope.$broadcast("movieUpdate", req); 

			$http.get("/api/movies/similar/" + movie_id + "/" + 1).success(function(req2) {
				if (req2 === null) {}
				else {
					console.log(req2);
					$scope.$broadcast("relatedMovieUpdate", req2); 
				}
			});

		});

	});
});
