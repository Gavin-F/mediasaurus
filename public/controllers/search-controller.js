/*
*	Parent controller for signup page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.search", ["ngRoute"]).controller("search", function($scope, $http) {
	$scope.$on("searchEvent", function(event, searchObject) { // receive from child controller
		$http.post(("/api/movies/search/"+1),searchObject).success(function(req) { // authenticate user login
			var searchArray = [];
			var size = 20;
			var offset = 0;
			var color;
			for(i = 0; i < size; i++) {
				if(i%2==0){
					color ="red";
				}
				else{
					color ="blue";
				}
				var searchItem = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average,
					overview: req[i].overview,
					bColor: color
				};
				if(req[i].poster_path !== null){
					searchArray[i-offset] = searchItem;
				}
				else{
					offset++;
				}
			}
			console.log(searchArray);
			console.log(searchArray[0].bColor);
			$scope.$broadcast("searchUpdate", searchArray);
		});
	});
});
