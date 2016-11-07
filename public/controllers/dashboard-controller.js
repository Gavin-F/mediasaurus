/*
*	Parent controller for Dashboard page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.dashboard", ["ngRoute"]).controller("dashboard", function($scope, $http) {
	$scope.$on("searchEvent", function(event, search_query) { // receive from child controller
		$http.post("/auth/dashboard", search_query).success(function(req) { // authenticate user sign up
			if(req.state === "success") { // indicates search was successful
				var search_query = req.search_query;
				$scope.$broadcast("searchUpdate", search_query); 
			}
			else { // failed signup, show alert
				$scope.$broadcast("searchError", true);
			}
		});
	});
});
