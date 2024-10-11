'use strict';
app.controller('atcAddController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', '$compile', '$sce', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window, $compile, $sce) {

    $scope.$on('InitATCAdd', function (event, prms) {



        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);
