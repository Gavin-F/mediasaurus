angular.module("index.password", ["ngRoute"]).controller("password", function($scope, $http) {
	$scope.$on("passwordEvent", function(event, user) { // receive from child controller
		$http.put("/auth/users/"+user.userID,user).success(function(req) { // authenticate user sign up
			if(req.error) { // indicates signup was successful
				$scope.$broadcast("passwordError", true);
			}
			else { // failed signup, show alert
				$scope.$broadcast("passwordUpdate");
			}
		})
		.error(function(req){
			var message = req.error.message;
			$scope.$broadcast("passwordError",message);
		});
	});
});
