var index = angular.module("index", ["ngRoute"]);


//Branch 
//merge comment split
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
	.when("/movie", {
		templateUrl: "/html/movie.html",
		controller: "movie-controller"
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
index.controller("dashboard-controller", function($scope,$location ,$timeout) {
	
	$scope.message = "hello";
	
	$scope.setText = function() {
		$scope.test = "Hello world!";
	}
	$scope.gotoMovie = function(){
		$location.url("/movie");
	}

	$(document).ready(function() {
		$('.tooltip-custom').tooltipster({
			side: 'right',
			interactive: true,
			arrow: false,
			animation: 'swing',
			contentCloning: true
		});
	});
});


///////////////////////////////////////////////////////
// SIGNUP CONTROLLER
///////////////////////////////////////////////////////
index.controller("signup-controller", function($scope, $location) {
	
	$scope.signUp = function() {
	//	$location.url("/setup");
	}
});

///////////////////////////////////////////////////////
// LOGIN CONTROLLER
///////////////////////////////////////////////////////
index.controller("login-controller", function($scope, $location) {
	
	$scope.loginError = false;
	var validUser = false;
	
	$scope.loginAcc = function() {
		if($scope.username == "test" && $scope.password == "123456") {
			$location.url("/dashboard");
		}
		else {
			$scope.loginError = true;
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
// Movie CONTROLLER
///////////////////////////////////////////////////////
index.controller("movie-controller", function($scope,$location) {

    $('.rating').likeDislike({
        initialValue: 0,
        click: function (value, l, d, event) {
            var likes = $(this.element).find('.likes');
            var dislikes = $(this.element).find('.dislikes');

            likes.text(parseInt(likes.text()) + l);
            dislikes.text(parseInt(dislikes.text()) + d);

            // $.ajax({
            //     url: 'url',
            //     type: 'post',
            //     data: 'value=' + value,
            // });
        }
    });

    $(function () {
    	$("#rateYo").rateYo({
    		starWidth: "20px",
    		numStars: 10,
    		readOnly: true,
    		rating: "88%"
    	});
    })

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