'use strict';
app.controller('profileController', ['$scope', '$location', '$routeParams', '$rootScope', '$route', '$window', '$timeout','authService',
    function ($scope, $location, $routeParams, $rootScope, $route, $window, $timeout, authService) {
    $scope.prms = $routeParams.prms;
   
    ///////////////////////////////////
     
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Profile';
        $('.profile').fadeIn();
        alert('x');
    }
   
    //////////////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        setTimeout(function () {
            
        }, 500);
    });
    $rootScope.$broadcast('ProfileLoaded', null);
    ///end
}]);