/*
*	Parent controller for account page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.account", ["ngRoute"]).controller("account", function($scope, $http) {
	$scope.$on("accountEvent", function(event, user) { // receive from child controller
		$http.get("/api/users/"+user.id).success(function(req) { 
			var userInfo = {
			username: req.username,
			email: req.email,
			firstName: req.firstName,
			lastName: req.lastName
			}
			$scope.$broadcast("accountUpdate", userInfo); 
		});
	});
});