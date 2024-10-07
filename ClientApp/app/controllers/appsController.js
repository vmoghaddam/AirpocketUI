'use strict';
app.controller('appsController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {
    $('.apps').fadeIn();
    $scope.logOut = function () {  authService.logOut(); };
    $scope.userName = authService.authentication.userName;

    $scope.go = function (moduleId) {
        authService.setModule(Number(moduleId));
    };

}]);