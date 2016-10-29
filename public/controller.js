var index = angular.module("index", 
	["ngRoute", 
	"ngCookies",
	"index.signup"]);

index.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "/html/home.html",
		controller: "home-controller"
	})
	.when("/dashboard", {
		templateUrl: "/html/dashboard.html",
		controller: "dashboard-controller"
	})
	.when("/testpage", {
		templateUrl: "/html/TestPage.html",
		controller: "testpage-controller"
	})
	.when("/account", {
		templateUrl: "/html/account.html",
		controller: "account-controller"
	})
	.when("/password", {
		templateUrl: "/html/resetpassword.html",
		controller: "password-controller"
	})
	.when("/signup", {
		templateUrl: "/html/signup.html",
		controller: "signup-controller"
	})
	.when("/login", {
		templateUrl: "/html/login.html",
		controller: "login-controller"
	})
	.otherwise({redirectTo:'/'});
}); 

///////////////////////////////////////////////////////
// INDEX CONTROLLER
///////////////////////////////////////////////////////
index.controller("index-controller", ["$scope", "$http", "$location", "$window", function($scope, $http, $location, $window) {
	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};
	$scope.isActive2 = function() {
    if(($location.path()=='/account')||($location.path()=='/password')){
    	return 1;
	}	
	else{
		return 0;
	}
	};

}]);

///////////////////////////////////////////////////////
// HOME CONTROLLER
///////////////////////////////////////////////////////
index.controller("home-controller", function($scope, $location) {

	// sign up
	$scope.toSignUp = function(){
		$location.url("/signup");
	}
	
	// login
	$scope.toLogin = function(){
		$location.url("/login");
	}
	
	// continue without logging in
	$scope.continue = function(){
		$location.url("http://google.com");
	}
});

///////////////////////////////////////////////////////
// DASH CONTROLLER
///////////////////////////////////////////////////////
index.controller("dashboard-controller", function($scope, $timeout) {
	
	$scope.message = "hello";
	
	$scope.setText = function() {
		$scope.test = "Hello world!";
	}

	$(document).ready(function() {
		$('.tooltip-custom').tooltipster({
			side: 'right',
			interactive: true,
			arrow: false,
			animation: 'swing'
		});
	});
});


///////////////////////////////////////////////////////
// SIGNUP CONTROLLER
///////////////////////////////////////////////////////
index.controller("signup-controller", function($scope, $location, $http, $cookieStore) {
	
	$scope.signupError = false;
	$scope.userIDs;
	
	$scope.signUp = function() {
		// get form info
		var user = {
			username: $scope.username,
			email: $scope.email,
			password: $scope.password
		};
		// send to parent controller
		$scope.$emit("signupEvent", user);
	}
	// if sign up was successful, update ids and send to new page
	$scope.$on("updateIDs", function(event, userIDs) {
		$scope.userIDs = userIDs;
		$cookies.put("userID", userIDs.user_id);
		$location.url("/dashboard");
	});
	
	// if sign up failed, update page
	$scope.$on("updateError", function(event, error) {
		$scope.signupError = error;
	});
});

///////////////////////////////////////////////////////
// LOGIN CONTROLLER
///////////////////////////////////////////////////////
index.controller("login-controller", function($scope, $location) {
	
	$scope.loginError = false;
	var validUser = false;
	
	$scope.loginAcc = function() {
		if($scope.username == "errortest") {
			$scope.loginError = true;
		}
		else {
			$location.url("/dashboard");
		}
	}
});

///////////////////////////////////////////////////////
// TEST CONTROLLER
///////////////////////////////////////////////////////
index.controller("testpage-controller", function($scope,$location) {
	
	$scope.message = "hello";
	
	$scope.setText = function() {
		$scope.test = "Hello world!";
	} 
	// adding comment to make sure merge went as planned.
	$scope.goHome = function(){
		$location.url("/");
	}
});

///////////////////////////////////////////////////////
// Reset Controller CONTROLLER
///////////////////////////////////////////////////////
index.controller("password-controller", function($scope,$location) {
	
	$scope.message = "hello";
	
	$scope.setText = function() {
		$scope.test = "Hello world!";
	} 
	$scope.goDashboard = function(){
		$location.url("/dashboard");
	}
	$scope.goAccountSettings = function(){
		$location.url("/account");
	}
	$scope.goResetPassword = function(){
		$location.url("/password");
	}
});

///////////////////////////////////////////////////////
// Account CONTROLLER
///////////////////////////////////////////////////////
index.controller("account-controller", function($scope,$location) {
	
	$scope.message = "hello";
	
	$scope.setText = function() {
		$scope.test = "Hello world!";
	} 
});