var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http, $location) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';

	$rootScope.signout = function () {
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
		$location.path('/');
	};
	$rootScope.checkStatus = function () {
		$http.get('auth/status').success(function (data) {
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user;
				$rootScope.log('loadStartSiteLoggedIn');
			} else {
				$rootScope.log('loadStartSiteLoggedOut');
			}
		});
	};
	$rootScope.log = function (item) {
		var payload = {};
		payload.action = item;
		$http.post('/logger', payload);
	}
	$rootScope.checkStatus();
});

app.config(function ($routeProvider) {
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		//the session display
		.when('/session', {
			templateUrl: 'sessions.html',
			controller: 'sessionController'
		})//the session display
		.when('/activity/:id', {
			templateUrl: 'activity.html',
			controller: 'activityController'
		});
});

app.factory('postService', function ($resource) {
	return $resource('/api/posts/:id');
});
app.factory('sessionService', function ($resource) {
	return $resource('/sessionlist/:id');
});


app.controller('mainController', function (postService, $scope, $rootScope) {
	$scope.posts = postService.query();
	$scope.newPost = { created_by: '', text: '', created_at: '' };

	$scope.post = function () {
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function () {
			$rootScope.log('posted');
			$scope.posts = postService.query();
			$scope.newPost = { created_by: '', text: '', created_at: '' };
		});
	};
});

app.controller('sessionController', function ( $scope, sessionService) {

	$scope.sessions = sessionService.query(function(){
		for (var i=0 ; i< $scope.sessions.length ; i++ ){
			$scope.sessions[i].key = $scope.sessions[i]._id;
			$scope.sessions[i].user = $scope.$eval($scope.sessions[i].session).passport.user;
		}
	});
});
app.controller('activityController', function ( $scope, $http, $routeParams) {
		$http.get('/activity/'+$routeParams.id).success(function (data) {
				$scope.activities = data;
		});
	
});

app.controller('authController', function ($scope, $http, $rootScope, $location) {
	$scope.user = { username: '', password: '' };
	$scope.error_message = '';

	$scope.login = function () {
		$http.post('/auth/login', $scope.user).success(function (data) {
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function () {
		$http.post('/auth/signup', $scope.user).success(function (data) {
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};
});