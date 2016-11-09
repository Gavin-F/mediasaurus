/*
*	Parent controller for signup page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.search", ["ngRoute"]).controller("search", function($scope, $http) {
	$scope.$on("searchEvent", function(event, searchObject) { // receive from child controller
		$http.post(("/api/movies/search/"+1),searchObject).success(function(req) { // authenticate user login
			var searchArray=[];
			for(i = 0; i < 20; i++) {
				var searchItem = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average,
					overview: req[i].overview
				};
				searchArray[i]=searchItem;
			}
			$scope.$broadcast("searchUpdate", searchArray);
		});
	});
});
