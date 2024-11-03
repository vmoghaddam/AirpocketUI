'use strict';
app.controller('appMessageItemController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'activityService', 'authService', 'generalService', '$route', function ($scope, $location, $routeParams, $rootScope, libraryService, activityService, authService, generalService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.itemId = $routeParams.id;


    $scope.scroll_height = 200;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            $scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        bindingOptions: { height: 'scroll_height', }
    };

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
    $scope.data = {};
     
    $scope.bind = function () {
         
        $scope.loadingVisible = true;
        generalService.getNotification($scope.itemId).then(function (d) {
            
            $scope.loadingVisible = false;
            d.DateSent = moment(d.DateSent).format('MMMM Do YYYY, h:mm:ss a');
            $scope.data = d;

            console.log($scope.data.Subject);
            if (d.DateAppVisited==null) {
                activityService.visitMessage( $scope.itemId);
            }

            
            $('.messageitemdetail').fadeIn();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Message';
        $scope.scroll_height = $(window).height() - 45 - 62;
        // alert($('.videocontainer').width());
        // $('#video').attr('width', $('.videocontainer').width());
        $('.messageitem').fadeIn();
        $scope.bind();
    }

    //////////////////////////////////////////
    $rootScope.$broadcast('AppMessageItemLoaded', null);


}]);