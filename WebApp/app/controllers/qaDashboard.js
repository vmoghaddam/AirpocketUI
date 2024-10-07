'use strict';
app.controller('qaDashboard', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'qaService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($http, $scope, $location, $routeParams, $rootScope, flightService, qaService, aircraftService, authService, notificationService, $route, $window) {


    $rootScope.employeeId = 4011;

    $scope.prms = $routeParams.prms;

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.bind();
        }

    };


    ////////////////////////



    $scope.bind = function () {
        //console.log($rootScope.employeeId);

        qaService.getQAByEmployee($rootScope.employeeId).then(function (response) {
            $scope.qaStatus = response.Data;
            console.log($scope.qaStatus);
        });
    };

    //////////////////////////

    $scope.showStatus = function (type, title) {
        console.log(type)
        $rootScope.Title = title;
        $location.url("/qa/status/" + type);
    }

    /////////////////////////

    $scope.rightHeight = $(window).height() - 114;
    $scope.scroll_1 = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'rightHeight'
        }

    };

    //////////////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };



    $scope.popup_visible = false;
    $scope.popup_title = 'Events';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        //  $scope.dg_monthly2_instance.refresh();
                        $scope.popup_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();

            $scope.dg_height = $(window).height() - 170;

        },
        onShown: function (e) {
            // $scope.bindMaster();

            if ($scope.dg_events_instance)
                $scope.dg_events_instance.refresh();


        },
        onHiding: function () {
            //$scope.dg_master_ds = [];

            $scope.popup_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },

        bindingOptions: {
            visible: 'popup_visible',

            title: 'popup_title',

        }
    };




    ///////////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> QA Dashboard';


        $('.qaDashboard').fadeIn(400, function () {

        });
    }

    //$scope.bind();
    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.rightHeight = $(window).height() - 114;
    });


    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {
            $scope.bind();
        }, 1500);
    });




}]);