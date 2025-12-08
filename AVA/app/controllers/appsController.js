'use strict';
app.controller('appsController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {
   
   if ($rootScope.IsOnlyFDR()){
	   
	   authService.setModule(3);
	   $rootScope.navigate('/fdr', 'fdr_report');
	   return;
   }	   

   if ($rootScope.IsOnlyFlightView()) {
        authService.setModule(3);
        if ($rootScope.roles.indexOf('Station') != -1)
            $rootScope.navigate('/board', 'flight_board');
            else
        $rootScope.navigate('/board', 'flight_board');
        
        return;
    }

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
			//alert('x');
                ok = $rootScope.HasAccessToFlightPocket();
				break;
            case 5:
               
                ok = false;
				break;
            case 6:
               // ok = $rootScope.HasAccessToLGS();
                //alert(ok);
               // if (ok)
               //     $rootScope.fill_vira_information();
                
                 ok=false;
                 
                break;
            default:
                break;
        }
        if (ok) {

            authService.setModule(Number(moduleId));
			//alert('a');
            $rootScope.navigatehome();
        }
        
        
    };

}]);