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
.controller("QRScanner", function($scope, $cordovaBarcodeScanner, userToken, $http){
    //var userToken = userToken.getToken();

    $scope.dumbbellLinked = false;

    $scope.scanBarcode = function(){
        ionic.Platform.ready(function(){
            $cordovaBarcodeScanner.scan().then(function(imgData){
                var dumbbellId = imgData.text;
                $http.get("http://46.101.3.244/api/linkDumbbell/" + dumbbellId, {headers: {'Content-Type': 'application/json', 'token': userToken.getToken()}}).then(function(res){
                    if(res.data.status){
                        alert("The dumbbell has been linked to your account!");
                        $scope.dumbbellLinked = true;
                    } else {
                        alert("Couldn't connect to the server, try again in a minute");
                    }
                    }, function(err){
                        alert("HTML Error: " + JSON.stringify(err));
                    })
            }, function(err){
                alert("Barcode Error: " + JSON.stringify(err));
            })
        })
    }
})
.controller('linkDumbbellCtrl', ['$scope', '$stateParams', 'userToken', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaBarcodeScanner) {

    /*$scope.scanBarcode = function(){
        $cordovaBarcodeScanner.scan().then(function(imgData){
            alert(imgData.text);
        }, function(err){
            alert("Error: " + err);
        })
    }*/

}])
   
.controller('workoutsCtrl', ['$scope', '$stateParams', 'userToken', '$http', 'jwtDecode', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, userToken, $http, jwtDecode) {

    $http.get("http://46.101.3.244/api/workoutData", {headers: {'Content-Type': 'application/json', 'token': userToken.getToken()}}).then(function(res){
        //alert(JSON.stringify(res));
        if(res.data.status){
            $scope.wokouts = res.data.data;
        } else {
            alert("An error occured, try again in a bit!");
        }
    })

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
 