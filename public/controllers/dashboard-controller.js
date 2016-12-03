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
			var size = req.length;
			for(i = 0; i < size; i++) {
				var movie = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average,
					liked: false
				};
				popMovies.push(movie);
			}
			returnMovies.push(popMovies);

			// Send back now playing movies
			$http.get("/api/movies/now_playing/" + obj[0]).success(function(req) {
				var nowMovies = [];
				var size2 = req.length;
				for(i = 0; i < size2; i++) {
					var movie = {
						id: req[i].id,
						title: req[i].title,
						poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
						rating: req[i].vote_average,
						liked: false
					};
					nowMovies.push(movie);
				}
				returnMovies.push(nowMovies);

				// check if user is logged in, dont get recs if not logged in
				if(obj[1] !== undefined) {
					// Send back now playing movies
					$http.get("/api/movies/preferences/" + obj[1]).success(function(req) {
						var recMovies = [];
						var prefMovies = req.preferences;
						var size3 = req.recommendations.length;
						if(size3 != 0) {
							for(i = 0; i < size3; i++) {
								var movie = {
									id: req.recommendations[i].movie_id,
									title: req.recommendations[i].title,
									poster: "https://image.tmdb.org/t/p/w500" + req.recommendations[i].poster_path,
									rating: req.recommendations[i].vote_average
								};
								recMovies.push(movie);
							}
						}
						returnMovies.push(recMovies);
						returnMovies.push(prefMovies);

						for(i = 0; i < returnMovies[0].length - 1; i++) {
							var movie0 = returnMovies[0][i];
							var movie1 = returnMovies[1][i];
							for(j = 0; j < prefMovies.length - 1; j++) {
								if(prefMovies[j].movie_id == movie0.id) {
									movie0.liked = true;
								}
								if(prefMovies[j].movie_id == movie1.id) {
									movie1.liked = true;
								}
							}
						}

						$scope.$broadcast("dashboardUpdate", returnMovies);
					});
				}
				else {
					// fallback filler for when user is not logged in
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
