/*
*	Parent controller for signup page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.signup", ["ngRoute"]).controller("signup", function($scope, $http) {
	$scope.$on("signupEvent", function(event, user) { // receive from child controller
		$http.post("/auth/signup", user).success(function(req) { // authenticate user sign up
			if(req.state === "success") { // indicates signup was successful
				var userIDs = {	// new object for user IDs
					user_id: req.user._id,
					movie_id: req.user.movieProfile
				};
				$scope.$broadcast("signupUpdate", userIDs); // send back the user ids
			} 
			else { // failed signup, show alert
				$scope.$broadcast("signupError", true);
			}
		});
	});
});