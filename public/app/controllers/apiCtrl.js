angular.module('apiControllers',[])

.controller('keyCtrl',function($http){

	 var app=this;
	 this.keyUser=function(){
	$http.post('/api/generate').then(function(data){
	console.log(data.data.success);
	console.log(data.data.message);
	if(data.data.success){
		app.successMsg=data.data.message;
	}	
		}); 
	
	};
	
});