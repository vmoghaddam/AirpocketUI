'use strict';
app.controller('trnexpiringTypesController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService) {
    $scope.prms = $routeParams.prms;


    //////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Groups';
        $('.expiringgrps').fadeIn();
    }
    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {

            $scope.bind();

        }, 1500);
    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);