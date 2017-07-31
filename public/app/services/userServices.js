angular.module('userServices',[])

.factory('User',function($http){

	var userFactory={};
	//User.create(regData)
	userFactory.create=function(regData){
		return $http.post('/api/users',regData);
		}

	// Activate user account with e-mail link
        userFactory.activeAccount = function(token) {
            return $http.put('/api/activate/' + token);
        }

	
	return userFactory;
});



