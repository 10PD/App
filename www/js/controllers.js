angular.module('app.controllers', [])

.service('userToken', function() {
    this.setToken = function (token) {
        this.token = token;
    }

    this.getToken = function() {
        return this.token;
    }
})

.service('jwtDecode', function(){
    this.decodeToken = function(t){
        var one = t.split('.')[1];
        var two = one.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(two))._doc;
    }
})

.controller('linkDumbbellCtrl', ['$scope', '$stateParams', 'userToken',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, userToken) {

    alert("Token Scan Page:" + userToken.getToken());

}])
   
.controller('workoutsCtrl', ['$scope', '$stateParams', 'userToken', '$http', 'jwtDecode', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, userToken, $http, jwtDecode) {
    
    

}])
   
.controller('profileCtrl', ['$scope', '$stateParams', 'userToken', 'jwtDecode',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, userToken, jwtDecode) {
    //var decodedToken = jwtDecode.decodeToken($scope.token);
    $scope.user = {
        name: jwtDecode.decodeToken(userToken.getToken()).name,
        dateJoined: jwtDecode.decodeToken(userToken.getToken()).date_Joined,
        workoutNum: jwtDecode.decodeToken(userToken.getToken()).workouts.length
    };
    //alert(jwtDecode.decodeToken(userToken.getToken()).name);

}])
      
.controller('homescreenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', '$http', '$state', 'userToken', 'jwtDecode',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, userToken, jwtDecode) {
    
    $scope.loginData = {
        'email':'',
        'password':''
    }

    $scope.login = function(){
        $http.post('http://46.101.3.244/api/authUser', $scope.loginData, {headers: {'Content-Type': 'application/json'}}).then(function(res){
            if(res.data.success){
                $scope.token = res.data.token;
                userToken.setToken($scope.token);
                alert("About to decode");
                alert("Decoded Token: "  + JSON.stringify(jwtDecode.decodeToken($scope.token)));
                $state.go('tabsController.linkDumbbell');
            } else {
                alert("Couldn't log you in, please try again");
            }
        }, function(err){
            alert("Couldn't log you in, please try again");
            console.log(JSON.stringify(err));
        })
};
}])
   
.controller('signupCtrl', ['$scope', '$stateParams', '$http', '$state', 'userToken', 'jwtDecode',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, userToken, jwtDecode) {
$scope.signupData = {
    'name':'',
    'email':'',
    'password':''
};

$scope.signup = function(){
    $http.post('http://46.101.3.244/api/registerUser', $scope.signupData, {headers: {'Content-Type': 'application/json'}}).then(function(res){
        if(res.data.success){
            $scope.token = res.data.token;
            userToken.setToken($scope.token);
            alert("About to decode");
            alert("Decoded Token: "  + JSON.stringify(jwtDecode.decodeToken($scope.token)));
            alert("signup complete");
            $state.go('tabsController.linkDumbbell');
        } else {
             alert("Couldn't sign you up, please try again");
        }
    }, function(err){
        alert("Couldn't sign you up, please try again");
        console.log(JSON.stringify(err));
    })
};

}])
 