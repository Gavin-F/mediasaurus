


angular.module("index.moviepage", ["ngRoute"]).controller("movie", function($scope, $http) {
	$scope.$on("movieEvent", function(event, ids) { // receive from child controller

		$http.get("/api/movies/" + ids.movie_id).success(function(req) { 
			$scope.$broadcast("movieUpdate", req); 

			$http.get("/api/movies/similar/" + ids.movie_id + "/" + 1).success(function(req2) {
				if (req2 !== null) 
					$scope.$broadcast("relatedMovieUpdate", req2); 

				if (ids.user_id !== undefined) {
					$http.get("/api/movies/preferences/" + ids.user_id).success(function(req3) {
						if (req3 !==  null)
					 		$scope.$broadcast("likeUpdate", req3);
					});
				}

				$scope.$on("likeEvent", function (event, likeInfo) {
					if (likeInfo.like == true) {
						$http.post("/api/movies/preferences/" + likeInfo.userID, likeInfo).success(function(req4){
						//console.log("like");
						});
					}
					else {
						$http.patch("/api/movies/preferences/" + likeInfo.userID, likeInfo).success(function(req5){
						//console.log("unlike");
						});
					}
				});

				// $scope.$on("unlikeEvent", function (event, like2) {
				// 	$http.delete("/api/movies/preferences/" + like2.userID, like2).success(function(req5){
				// 	//console.log(req5);
				// 	console.log("unlike");
				// 	});
				// });

			});
		});
	});
});
