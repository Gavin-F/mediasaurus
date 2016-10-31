/*
*	Parent controller for login page
*	Performs login request to server when child
*	sends user data to this controlller
*/
angular.module("index.login", ["ngRoute"]).controller("login", function($scope, $http) {
	$scope.$on("loginEvent", function(event, user) { // receive from child controller
		$http.post("/auth/login", user).success(function(req) { // authenticate user login
			if(req.state === "success") { // indicates login was successful
				var userIDs = {	// new object for user IDs
					user_id: req.user._id,
					movie_id: req.user.movieProfile
				};
				$scope.$broadcast("loginUpdate", userIDs); // send back the user ids
			} 
			else { // failed signup, show alert
				$scope.$broadcast("loginError", true);
			}
		});
	});
});