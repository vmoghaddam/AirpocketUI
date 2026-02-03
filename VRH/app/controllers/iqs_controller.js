'use strict';
app.controller('iqs_controller', ['$scope', '$routeParams', 'authService', 'activityService', 'libraryService', 'flightService', '$rootScope', '$compile', 'mntService', 'mapService',
    '$sce', '$location', '$window',
    function ($scope, $routeParams, authService, activityService, libraryService, flightService, $rootScope, $compile, mntService, mapService, $sce, $location, $window) {
        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.isRoute = function (route) {
            return $location.path().indexOf(route) === 0;
        };

    }]);