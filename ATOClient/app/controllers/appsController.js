'use strict';
app.controller('appsController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {
   
    

    $('.apps').fadeIn();
    
    $scope.logOut = function () {  authService.logOut(); };
    $scope.userName = authService.authentication.userName;
    $scope.link4 = "";
    $scope.link3 = "";
    //#!home
    $scope.go = function (moduleId) {
       
        var ok=false;
        switch (moduleId) {
            case 1:
                ok = $rootScope.HasAccessToBasePocket();


                break;
            case 2:
                ok = $rootScope.HasAccessToLearningPocket();

               
                break;
            case 3:
                ok = $rootScope.HasAccessToFlightPocket();
            case 5:
               
                ok = false;
            case 6:
                ok = $rootScope.HasAccessToLGS();
                
                if (ok)
                    $rootScope.fill_vira_information();
                
                 
                 
                break;
            default:
                break;
        }
        if (ok) {

            authService.setModule(Number(moduleId));
            $rootScope.navigatehome();
        }
        
        
    };

}]);