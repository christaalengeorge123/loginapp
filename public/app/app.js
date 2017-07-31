angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','emailController','apiControllers'])

.config(function($httpProvider){

	$httpProvider.interceptors.push('AuthInterceptors');
});
