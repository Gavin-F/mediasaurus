/*
*	Parent controller for account setup page
*	Sends an update to the genres of a movie profile
* 	to server when childsends the array to this controlller
*/
angular.module("index.accsetup", ["ngRoute"]).controller("accsetup", function($scope, $http) {
	$scope.$on("setupEvent", function(event, genres) { // receive from child controller
		/*
		$http.post("/profile/prefs", genres).success(function(req) { // update user prefs
			$scope.$broadcast("setupUpdate", "done"); // redirect
		});
		*/
		console.log($scope.actionState);
		$scope.actionState = false;

		console.log($scope.actionState);
		$scope.$broadcast("setupUpdate", "done"); // redirect

	});
});
