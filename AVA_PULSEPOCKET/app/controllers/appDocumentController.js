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
        libraryService.getCrewPIFs($rootScope.employeeId, 86).then(function (response) {
            $scope.loadingVisible = false;
            $scope.firstBind = false;
            $scope.ds = response;
            console.log('PIFs:');
            console.log($scope.ds);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////////
    $scope.formatDate = function (dt) {
        return moment(dt.DateRelease).format('MMM DD YYYY');
    };

    $scope.getVisitedClass = function (x) {
        return "far fa-eye " + (x.IsVisited ? "file-visited" : "");
    };

    $scope.getSignedClass = function (x) {
        return "fas fas fa-signature " + (x.IsSigned ? "file-visited" : "");
    };

    $scope.getTitleClass = function (x) {
        return (x.IsVisited && x.IsSigned) ? "" : "w3-text-red";
    };

    $scope.getCardClass = function (x) {
        return "card w3-text-dark-gray bg-white";
    };

    $scope.getValidRemaining = function (x) {
        if (!x.DateValidUntil)
            return "&nbsp;";

        return -1;
    }

    $scope.getValidUntilRemaining = function (x) {
        if (!x.DateValidUntil)
            return "&nbsp;";
        if (x.RemainingValid < 0)
            return "Not Valid";
        return x.RemainingValid + ' day(s)';
    }


    $scope.getValidUntil = function (x) {
        if (!x.DateValidUntil)
            return "";
        return "Valid Until: " + moment(x.DateValidUntil).format('MMM DD YYYY');;
    };
    $scope.getValidClass = function (x) {
        //if (!x.DeadLine || x.RemainingDeadLine > 15 || x.IsVisited)
        //    return "";
        //if (x.RemainingDeadLine <= 15 && x.RemainingDeadLine > 10)
        //    return "alert-orange-text";
        //return "alert-red-text bold";
        return "";
    };

    $scope.getValidBackClass = function (x) {
        if (!x.DateValidUntil)
            return "";
        if (x.RemainingValid < 0)
            return "";
        if (x.RemainingValid >= 0)
            return "valid-back";
        return "";
    };
    $scope.getNotValidBackClass = function (x) {
        if (x.DateValidUntil && x.RemainingValid < 0)
            return "lib-flight notvalid-back";
       
        return "lib-flight";
    };

    $scope.ImageUrl = function (x) {
        _ImageUrl = x.ImageUrl ? $rootScope.clientsFilesUrl + x.ImageUrl : '../../content/images/image.png';
        return (_ImageUrl);
    };

    ////////////////////////////////
    $scope.getDay = function (dt) {
        return (new Date(dt)).getDate();
    };
    $scope.getTileMonth = function (dt) {
        var mns = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var _dt = new Date(dt);
        var m = _dt.getMonth();
        var mstr = mns[m];
        var year = _dt.getFullYear();
        var yearstr = year.toString().substring(2, 4);
        var str = mstr + ' ' + yearstr;
        return str;
    };

    //////////////////////////////////////
    $scope.ItemClick = function (x) {
        var dtSigned = x.DateSigned ? x.DateSigned : -1;
        $location.path('/docviewer/' + x.FileUrl + '/' + x.Title + '/' + x.FileId + '/' + x.BookId + '/' + dtSigned);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'PIFs/CIFs';
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.document').fadeIn();
        $scope.bind();
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {



    });
    $rootScope.$broadcast('AppDocumentLoaded', null);


}]);