'use strict';
app.controller('appMessageController', ['$scope', '$location', '$routeParams', '$rootScope', 'generalService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, generalService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    

    $scope.title = 'Messages';
   


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
    //$scope.processData = function (data) {
    //    $.each(data, function (_i, _d) {
    //        _d.class = "card w3-text-gray bg-white";
    //        _d.bold = "font-size-16";
    //        _d.IsVisited = _d.DateAppVisited != null;
    //        _d.Sender = "Sent by <i><b>" + _d.Sender + "</b></i> on <i><b>" + moment(_d.DateSent).format('MMMM Do YYYY, h:mm:ss a') + "</b></i>";
    //        if (window.innerWidth <= 800 && window.innerHeight <= 600) {
    //            _d.Abstract = General.shortenString(General.removeHtmlTags(_d.Abstract), 100);
    //        }
    //        else {
    //            _d.Abstract = General.shortenString(General.removeHtmlTags(_d.Abstract), 150);
    //        }
          
    //        if (!_d.IsVisited) {
    //            _d.bold = " bold text-red";
    //            _d.icon = "fas fa-eye-slash text-red font-size-30";
    //        }

             
    //        //_d.CourseOrganization = _d.CourseOrganization ? '(' + _d.CourseOrganization + ')' : '';
    //        //_d.DateIssue = moment(_d.DateIssue).format('MMMM Do YYYY');
    //        //_d.ExpireDate = _d.ExpireDate ? moment(_d.ExpireDate).format('MMMM Do YYYY') : '?';
    //        //_d.Remain = _d.Remain != null ? _d.Remain : '?';
    //        //_d.class = "card w3-text-gray bg-white"; //(_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
    //        //if (_d.IsLast && _d.ExpireStatus == 1)
    //        //    _d.class = "card text-white bg-red";
    //        //if (_d.IsLast && _d.ExpireStatus == 2)
    //        //    _d.class = "card text-white bg-orange";
    //    });
    //    $scope.ds = data;
    //};
    function formatTime2(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();


        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        alert(strTime);
        return strTime;
    }
    $scope.moment2 = function (date) {
        if (!date)
            return "";
        return moment(date).format('MM-DD-YYYY HH:mm');
    };
    $scope.getTimeFormated = function (dt) {
        if (!dt)
            return "-";

        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return formatTime2(_dt);
    };
    $scope.getDateTimeFormated = function (dt) {
        if (!dt)
            return "-";

        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        alert(_dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return moment2(_dt);
    };
    $scope.getNotificationClass = function (id) {
        switch (id) {
            case 10010:
            case 10011:
            case 10012:
            case 10013:
                return 'text-pickup';
            case 10014:
                return 'text-cancel';
            case 10015:
                return 'text-delay';
            default:
                return 'text-general';
        }
    };
    $scope.bind = function () {
       
        //if ($scope.firstBind)
        //    $scope.loadingVisible = true;
         
        //generalService.getNotifications($rootScope.employeeId).then(function (response) {
        //        $scope.loadingVisible = false;
        //        $scope.firstBind = false;
        //        $scope.processData(response);
        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
       

        //getSMSNotification
        generalService.getSMSNotification($rootScope.userId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds = response;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        
    };

    //$scope.itemClick = function (mid ) {
    //    //alert(bookId+' '+employeeId);
    //    $location.path('/appmessage/item/' + mid);
    //};

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Messages';
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.message').fadeIn();
         $scope.bind();
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        //if (prms == 'footer')
        //    $('.footer' + $scope.active).addClass('active');


    });
    $rootScope.$broadcast('AppMessageLoaded', null);


}]);