angular.module("index.email", ["ngRoute"]).controller("email", function($scope, $http) {
	$scope.$on("emailEvent", function(event, user) { // receive from child controller
		$http.put("/auth/users/"+user.userID,user).success(function(req) { // authenticate user sign up
			console.log(req);
			if(req.error) { // indicates signup was successful
				$scope.$broadcast("emailError", true);
			}
			else { // failed signup, show alert
				$scope.$broadcast("emailUpdate");
			}
		})
		.error(function(req){
			console.log(req);
			if(req.error) { // indicates signup was successful
				$scope.$broadcast("emailError", true);
			}
			else { // failed signup, show alert
				$scope.$broadcast("emailUpdate");
			}
		});
	});
});
