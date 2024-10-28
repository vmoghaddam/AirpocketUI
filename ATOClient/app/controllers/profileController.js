'use strict';
app.controller('profileController', ['$scope', '$location', '$routeParams', '$rootScope', '$route', '$window', '$timeout', 'authService',
    function ($scope, $location, $routeParams, $rootScope, $route, $window, $timeout, authService) {
        $scope.prms = $routeParams.prms;


        $scope.windowHeight = $(window).height()

        $scope.selectedTab = 1;

        $scope.selectTab = function (tabIndex) {
            $scope.selectedTab = tabIndex;
        };

        $scope.isActiveTab = function (tabIndex) {
            return $scope.selectedTab === tabIndex;
        };
        ///////////////////////////////////
        var storedUserData = localStorage.getItem('profile')

        if (storedUserData) {
            var profile = JSON.parse(storedUserData)
            $scope.person_id = profile.Id;
            // You can use userData here...
        } else {
            console.log('User data not found in local storage')
        }

        //////////////////////////////////
        $scope.exam = function () {
            $window.location.href = '/#!/quiz/list';
        };

        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Profile';
            $('.profile').fadeIn();
        }

        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            setTimeout(function () {

            }, 500);
        });
        $rootScope.$broadcast('ProfileLoaded', null);
        ///end
    }]);