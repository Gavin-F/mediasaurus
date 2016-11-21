


angular.module("index.moviepage", ["ngRoute"]).controller("movie", function($scope, $http) {
	$scope.$on("movieEvent", function(event, ids) { // receive from child controller

		$http.get("/api/movies/" + ids.movie_id).success(function(req) { 
			$scope.$broadcast("movieUpdate", req); 

			$http.get("/api/movies/similar/" + ids.movie_id + "/" + 1).success(function(req2) {
				if (req2 === null) {}
				else {
					$scope.$broadcast("relatedMovieUpdate", req2); 
				}
				if (ids.user_id !== undefined) {
					$http.get("/api/movies/preferences/" + ids.user_id).success(function(req3) {
						$scope.$broadcast("likeUpdate", req3);
					});
				}

				$scope.$on("likeEvent", function (event, like) {
					$http.post("/api/movies/preferences/" + like.userID, like).success(function(req4){
					console.log("like");
					});
				});

				$scope.$on("unlikeEvent", function (event, like) {
					$http.post("/api/movies/preferences/" + like.userID, like).success(function(req5){
					console.log("unlike");
					});
				});

			});
		});
	});
});
