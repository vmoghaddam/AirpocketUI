'use strict';
app.controller('appDocumentItemController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'activityService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, libraryService, activityService, authService, notificationService, $route) {
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
    $scope.Sender = null;
    $scope.No = null;
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
            
            $scope.loadingVisible = false;
            $scope.Title = d.Title;
            $scope.ImageUrl = d.ImageUrl ? $rootScope.clientsFilesUrl + d.ImageUrl : '../../content/images/image.png';
            $scope.Authors = d.Authors ? d.Authors : '-';
            $scope.Sender = d.Sender ? d.Sender : '-';
            $scope.Category = d.Category;
            $scope.No = d.No ? d.No : '-';
            $scope.ISSNPrint = d.ISSNPrint ? d.ISSNPrint : '-';
            $scope.ISSNElectronic = d.ISSNElectronic ? d.ISSNElectronic : '-';
            $scope.DateRelease = d.DateRelease ? moment(d.DateRelease).format('MMMM YYYY') : '-';
            $scope.DateExposure = d.DateExposure ? moment(d.DateExposure).format('MMMM Do YYYY, h:mm:ss a') : '-';
            $scope.DateVisit = d.DateVisit ? moment(d.DateVisit).format('MMMM Do YYYY, h:mm:ss a') : moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
            $scope.DateDownload = d.DateDownload ? moment(d.DateDownload).format('MMMM Do YYYY, h:mm:ss a') : '-';
            $scope.IsDownloaded = d.IsDownloaded;
            $scope.DownloadUrl = $rootScope.webBase + "downloadhandler.ashx?t=book&id=" + $scope.itemId;
            $scope.Keywords = d.Keywords ? d.Keywords : '-';
            $scope.Abstract = d.Abstract ? d.Abstract : '-';
            $scope.Journal = d.Journal ? d.Journal : '-';
            $scope.ExternalUrl = d.ExternalUrl;
            $scope.Language = d.Language ? d.Language : '-';
            $scope.Duration = d.Duration ? d.Duration : '-';
            $scope.NumberOfLessens = d.NumberOfLessens ? d.NumberOfLessens : '-';

            $scope.INSPECAccessionNumber = d.INSPECAccessionNumber ? d.INSPECAccessionNumber : '-';

            if (!d.IsVisited) {
                activityService.visitLibrary($rootScope.employeeId, $scope.itemId);
            }

           
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.download = function () {
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
        $rootScope.page_title = 'Document';
        $scope.scroll_height = $(window).height() - 45 - 62;
        // alert($('.videocontainer').width());
        // $('#video').attr('width', $('.videocontainer').width());
        $('.documentitem').fadeIn();
        $scope.bind();
    }

    //////////////////////////////////////////
    $rootScope.$broadcast('AppDocumentItemLoaded', null);


}]);