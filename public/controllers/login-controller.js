/*
*	Parent controller for login page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.login", ["ngRoute"]).controller("login", function($scope, $http) {
	$scope.$on("loginEvent", function(event, user) { // receive from child controller
		$http.post("/auth/login", user).success(function(req) { // authenticate user login
			if(req.state === "success") { // indicates login was successful
				var user = {userID: req.user, setupDone: req.profileSetups.movieSetup};
				$scope.$broadcast("loginUpdate", user); // send back the user id
			}
			else { // failed signup, show alert
				$scope.$broadcast("loginError", true);
			}
		});
	});
});
