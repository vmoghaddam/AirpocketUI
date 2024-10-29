'use strict';
app.controller('helpController', ['$scope', '$location', '$routeParams', '$rootScope', '$window', 'flightService', 'authService', 'notificationService', '$route', 'activityService', 'QAService', function ($scope, $location, $routeParams, $rootScope, $window, flightService, authService, notificationService, $route, activityService, QAService) {
   $rootScope.page_title ='Help';
    $scope.open_file=function(x){
		window.open('https://cpo.apvaresh.ir/help/'+x);
	};

    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        //alert('w: '+$(window).width());

        $scope.$apply(function () {
            $scope.scroll_height = $(window).height() - 150;
        });
    });
    ///////////////////////////////////////

}]);