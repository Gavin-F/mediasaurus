/*
*	Parent controller for account page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.dashboard", ["ngRoute"]).controller("dashboard", function($scope, $http, $q) {
	// Send back popular movies
	$scope.$on("dashboardEvent", function(event, obj) { // receive from child controller
		var returnMovies = [];
		$http.get("/api/movies/popular/" + obj[0]).success(function(req) {
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
			returnMovies.push(popMovies);

			// Send back now playing movies
			$http.get("/api/movies/now_playing/" + obj[0]).success(function(req) {
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
				returnMovies.push(nowMovies);

				if(obj[1] !== undefined) {
					// Send back now playing movies
					$http.get("/api/movies/recommendations/" + obj[1]).success(function(req) {
						var recMovies = [];
						if(req.length != 0) {
							for(i = 0; i < 20; i++) {
								var movie = {
									id: req[i].movie_id,
									title: req[i].title,
									poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
									rating: req[i].vote_average
								};
								recMovies.push(movie);
							}
						}
						returnMovies.push(recMovies);
						$scope.$broadcast("dashboardUpdate", returnMovies);
					});
				}
				else {
					var filler = [];
					for(i = 0; i < 20; i++) {
						var movie = {
							id: "",
							title: "",
							poster: "",
							rating: 0
						};
						filler.push(movie);
					}
					returnMovies.push(filler);
					$scope.$broadcast("dashboardUpdate", returnMovies);
				}

			});
		});
	});
});
