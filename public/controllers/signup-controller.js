/*
*	Parent controller for signup page
*	Performs signup request to server when child
*	sends user data to this controlller
*/
angular.module("index.signup", ["ngRoute"]).controller("signup", function($scope, $http) {
	$scope.$on("signupEvent", function(event, user) { // receive from child controller
		$http.post("/auth/signup", user).success(function(req) { // authenticate user sign up
			if(req.state === "success") { // indicates signup was successful
				console.log(req)
				var user = {userID: req.user, setupDone: req.profileSetups.movieSetup};
				$scope.$broadcast("signupUpdate", user); // send back the user id
			}
			else { // failed signup, show alert
				$scope.$broadcast("signupError", true);
			}
		});
	});
});
