angular.module('userControllers',['userServices'])

.controller('regCtrl',function($http,$location,$timeout,User){

	var app=this;

	this.regUser=function(regData){
	app.loading=true;
	app.errorMsg=false;
	
		User.create(app.regData).then(function(data){
		console.log(data.data.success);
		console.log(data.data.message);
		if(data.data.success){
			app.loading=false
			//Create success message
			app.successMsg=data.data.message + '...Redirecting';
			//Redirect to home page
			$timeout(function(){

			$location.path('/');

			},2000);
	
		} else{
			//Create an error message
			app.loading=false;
			app.errorMsg=data.data.message;
		}
	});
  };
})

.controller('facebookCtrl',function($routeParams,Auth,$location,$window){

	var app=this;
	if($window.location.pathname=='/facebookerror'){
		app.errorMsg='Facebook e-mail not found in database';
	}else{

	Auth.facebook($routeParams.token);
	$location.path('/');	
	}

});

