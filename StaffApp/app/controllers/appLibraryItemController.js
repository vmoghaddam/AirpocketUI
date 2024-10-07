'use strict';
app.controller('appLibraryItemController', ['$scope', '$location','$window', '$routeParams', '$rootScope', 'libraryService', 'activityService', 'authService', 'notificationService', '$route', function ($scope, $location,$window, $routeParams, $rootScope, libraryService, activityService, authService, notificationService, $route) {
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
    $scope.Title = null;
    $scope.ImageUrl = null;
    $scope.Authors = null;
    $scope.Category = null;
    $scope.Publisher = null;
    $scope.ISBN = null;
    $scope.ISSNPrint = null;
    $scope.ISSNElectronic = null;
    $scope.DateRelease = null;
    $scope.DateExposure = null;
    $scope.DateVisit = null;
    $scope.DateDownload = null;
    $scope.IsDownloaded = false;
    $scope.DownloadUrl = null;
    $scope.Keywords = null;
    $scope.Abstract = null;
    $scope.Journal = null;
    $scope.INSPECAccessionNumber = null;
    $scope.ExternalUrl = null;
    $scope.Language = null;
    $scope.Duration = null;
    $scope.NumberOfLessens = null;
    $scope.bind = function () {

        $scope.loadingVisible = true;
        libraryService.getEmployeeBook($rootScope.employeeId, $scope.itemId).then(function (d) {
            $rootScope.$broadcast('ShowFooterItems', d.TypeId);
            $scope.loadingVisible = false;
            $scope.Title = d.Title;
            //$scope.ImageUrl = d.ImageUrl ? $rootScope.clientsFilesUrl + d.ImageUrl : '../../content/images/image.png';
            $scope.ImageUrl = d.ImageUrl ? $rootScope.clientsFilesUrl + d.ImageUrl : null;
            $scope.Authors = d.Authors ? d.Authors : null;
            $scope.Publisher = d.Publisher ? d.Publisher : null;
            $scope.Category = d.Category;
            $scope.ISBN = d.ISBN ? d.ISBN : null;
            $scope.ISSNPrint = d.ISSNPrint ? d.ISSNPrint :null;
            $scope.ISSNElectronic = d.ISSNElectronic ? d.ISSNElectronic : null;
            $scope.DateRelease = d.DateRelease ? moment(d.DateRelease).format('MMM YYYY') : null;
            $scope.DateExposure = d.DateExposure ? moment(d.DateExposure).format('MMM DD YYYY') : null;
            $scope.DateVisit = d.DateVisit ? moment(d.DateVisit).format('MMM DD YYYY, h:mm a') : moment(Date.now()).format('MMM DD YYYY, h:mm a');
            $scope.DateDownload = d.DateDownload ? moment(d.DateDownload).format('MMM DD YYYY, h:mm a') : null;
            $scope.IsDownloaded = d.IsDownloaded;
            $scope.DownloadUrl = $rootScope.webBase + "downloadhandler.ashx?t=book&id=" + $scope.itemId;
            $scope.Keywords = d.Keywords ? d.Keywords : null;
            $scope.Abstract = d.Abstract ? d.Abstract : null;
            $scope.Journal = d.Journal ? d.Journal : null;
            $scope.ExternalUrl = d.ExternalUrl;
            $scope.Language = d.Language ? d.Language : null;
            $scope.Duration = d.Duration ? d.Duration : null;
            $scope.NumberOfLessens = d.NumberOfLessens ? d.NumberOfLessens:'-';
            
            $scope.INSPECAccessionNumber = d.INSPECAccessionNumber ? d.INSPECAccessionNumber : null;
            
            if (!d.IsVisited) {
                activityService.visitLibrary($rootScope.employeeId, $scope.itemId);
            }

            $('.item' + d.TypeId).fadeIn();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.download = function () {
         
        var url = "http://" + $window.location.host + "/pdfjs/web/viewer.html?file=" + "http://fleet.flypersia.aero:90/airpocket/upload/clientsfiles/test2.pdf";
        
        $window.location.href = $rootScope.webBase+"pdfjs/web/viewer.html?file=../../upload/clientsfiles/pdfjs.pdf"; //url;
        return;
        window.location.assign($scope.DownloadUrl);
        if (!$scope.IsDownloaded) {
            $scope.DateDownload = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
            $scope.IsDownloaded = true;
            activityService.downloadLibrary($rootScope.employeeId, $scope.itemId);
        }
        
         
    };
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Library Item';
        $scope.scroll_height = $(window).height() - 45 - 62;
       // alert($('.videocontainer').width());
       // $('#video').attr('width', $('.videocontainer').width());
        $('.libraryitem').fadeIn();
        $scope.bind();
    }

    //////////////////////////////////////////
    $rootScope.$broadcast('AppLibraryItemLoaded', null);


}]);