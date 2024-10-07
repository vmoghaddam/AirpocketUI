'use strict';
app.controller('appDocumentController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, libraryService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    
    
    

    $scope.scroll_height = 200;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: true,
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

    $scope.ds = null;
    $scope.bind = function () {
        if ($scope.firstBind)
            $scope.loadingVisible = true;
        libraryService.getPersonLibrary($rootScope.employeeId, 86).then(function (response) {
            $scope.loadingVisible = false;
            $scope.firstBind = false;
            $.each(response, function (_i, _d) {
                // _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/imguser.png';
                _d.DateExposure = moment(_d.DateExposure).format('MMMM Do YYYY, h:mm:ss a');
                _d.VisitedClass = "fa " + (_d.IsVisited ? "fa-eye w3-text-blue" : "fa-eye-slash w3-text-red");
                //_d.IsDownloaded = true;
                _d.DownloadedClass = "fa " + (_d.IsDownloaded ? "fa-cloud-download-alt w3-text-blue" : "fa-cloud w3-text-red");
                _d.class = (_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
                _d.class = "card w3-text-dark-gray bg-white";
                _d.titleClass = (_d.IsDownloaded && _d.IsVisited) ? "" : "w3-text-red";
                _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/image.png';
            });
            $scope.ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.itemClick = function (bookId, employeeId) {
        //alert(bookId+' '+employeeId);
        $location.path('/appdocument/item/' + bookId);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Documents';
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.document').fadeIn();
        $scope.bind();
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        


    });
    $rootScope.$broadcast('AppDocumentLoaded', null);


}]);