angular.module("index.name", ["ngRoute"]).controller("name", function($scope, $http) {
	$scope.$on("nameEvent", function(event, user) { // receive from child controller
		$http.put("/auth/users/"+user.userID,user).success(function(req) { // authenticate user sign up
			if(req.error) { // indicates signup was successful
				$scope.$broadcast("nameError", true);
			}
			else { // failed signup, show alert
				$scope.$broadcast("nameUpdate");
			}
		})
		.error(function(req){
			var message = req.error.message;
			$scope.$broadcast("nameError",message);
		});
	});
});
