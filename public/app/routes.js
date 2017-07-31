angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

	$routeProvider

	.when('/',{
		templateUrl:'app/view/pages/home.html'

	})

	.when('/about',{

		templateUrl:'app/view/pages/about.html',
		controller:'keyCtrl',
		controllerAs:'key'
	})

	.when('/register',{
		templateUrl:'app/view/pages/users/register.html',
		controller:'regCtrl',
		controllerAs:'register'

	})
	.when('/login',{

		templateUrl:'app/view/pages/users/login.html'
	})
	.when('/logout',{

		templateUrl:'app/view/pages/users/logout.html'
	})

	.when('/profile',{
		templateUrl:'app/view/pages/users/profile.html'
	})

	.when('/facebook/:token',{
		templateUrl:'app/view/pages/users/social/social.html',
		controller:'facebookCtrl',
		controllerAs:'facebook'
	})

	.when('/facebookerror',{
		templateUrl:'app/view/pages/users/login.html',
		controller:'facebookCtrl',
		controllerAs:'facebook'
	})

	.when('/activate/:token', {
        templateUrl: 'app/view/pages/users/activation/activate.html',
        controller:'emailCtrl',
        controllerAs: 'email'
    })

	.otherwise({redirectTo:'/'} );



		$locationProvider.html5Mode({
  		enabled: true,
  		requireBase: false
	});

});





