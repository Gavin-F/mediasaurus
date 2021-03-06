/*
*	Parent controller for signup page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.search", ["ngRoute"]).controller("search", function($scope, $http) {
	$scope.$on("searchEvent", function(event, searchObject) { // receive from child controller
		$http.post(("/api/movies/search/"+1),searchObject).success(function(req) { 
			var searchArray = [];
			var size = req.length;
			var offset = 0;
			var color;
			for(i = 0; i < size; i++) {
				if((i-offset)%2==0){
					color = "#336699";
					text = "#202020"
				}
				else{
					color = "transparent";
					text = "#E9E9E9";
				}
				var searchItem = {
					id: req[i].id,
					title: req[i].title,
					poster: "https://image.tmdb.org/t/p/w500" + req[i].poster_path,
					rating: req[i].vote_average,
					overview: req[i].overview,
					bColor: color,
					tColor: text
				};
				if(req[i].poster_path !== null){
					searchArray[i-offset] = searchItem;
				}
				else{
					offset++;
				}
			}
			$scope.$broadcast("searchUpdate", searchArray);
		});
	});
});
