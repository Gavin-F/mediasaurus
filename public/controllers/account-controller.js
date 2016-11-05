/*
*	Parent controller for account page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.account", ["ngRoute"]).controller("account", function($scope, $http) {
	$scope.$on("acountEvent", function(event, user) { // receive from child controller
		$http.post("/auth/acount", user).success(function(req) { // authenticate user login
			if(req.state === "success") { // indicates login was successful
				var userID = req.user._id;
				$scope.$broadcast("accooutUpdate", userID); // send back the user id
			}
			else { // failed signup, show alert
				$scope.$broadcast("accountError", true);
			}
		});
	});
});