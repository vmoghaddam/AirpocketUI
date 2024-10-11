'use strict';
app.controller('appCourseController', ['$scope', '$location', '$routeParams', '$rootScope', 'generalService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, generalService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    $scope.active = $route.current.type;

    $scope.title = null;
    switch ($scope.active) {

        case 'pending':

            $scope.title = 'New';
            break;
        case 'active':

            $scope.title = 'Active';
            break;
        case 'archive':

            $scope.title = 'Archive';
            break;

        default:
            break;
    }


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
    $scope.processData = function (data) {
        $.each(data, function (_i, _d) {
            _d.Instructor = _d.Instructor ? _d.Instructor : '-';
            _d.Location = _d.Location ? _d.Location : '-';
            _d.Interval = _d.Interval ? _d.Interval + ' ' + _d.CalendarType: '-';
            _d.DateStart = moment(_d.DateStart).format('MMMM Do YYYY');
            _d.DateEnd = _d.DateEnd ? moment(_d.DateEnd).format('MMMM Do YYYY') : '?';
            _d.DateIssue = _d.DateIssue ? moment(_d.DateIssue).format('MMMM Do YYYY'): '-';
            _d.No = _d.No ? _d.No : '-';
            _d.class = "card w3-text-gray bg-white"; //(_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";

            _d.start = null;
            if (_d.Remain!=null && _d.Remain>=0) {
                if (Number(_d.Remain) == 0)
                    _d.start = "Starts today";
                else if (Number(_d.Remain) == 1)
                    _d.start = "Starts tomorrow";
                else
                    _d.start = "Starts in " + _d.Remain + " days"; //+ moment(_d.DateStart).format('MMMM Do YYYY');
            }
            
            _d.icon = "";
            if (!_d.StatusId) {
                _d.icon = "fas fa-question-circle font-size-35";
                if (_d.Remain != null) {
                    if (Number(_d.Remain) == 0)
                        _d.icon += " text-red";
                    else if (Number(_d.Remain) <=15)
                        _d.icon += " text-warning";
                     
                }
            }

            if (_d.StatusId == 107)
                _d.icon = "fas fa-times-circle text-red font-size-35";
            if (_d.StatusId == 71)
                _d.icon = "fas fa-graduation-cap text-blue font-size-35";
            if (_d.StatusId == 68)
                _d.icon = "fas fa-chalkboard-teacher text-green font-size-30";
            if (_d.StatusId == 67)
                _d.icon = "fas fa-check-circle text-green font-size-35";
            if (_d.StatusId == 69)
                _d.icon = "fas fa-minus-circle text-red font-size-35";
            if (_d.StatusId == 70)
                _d.icon = "fas fa-sticky-note text-red font-size-35";

            switch (_d.Status) {
                case null:
                    _d.Status = 'Pending';
                    break;
                default:
                    break;
            }

            
        });
        $scope.ds = data;
    };
    $scope.bind = function () {
        if ($scope.firstBind)
            $scope.loadingVisible = true;
        if ($scope.active == 'active') {
            generalService.getPersonActiveCourse($rootScope.userId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.firstBind = false;
                $scope.processData(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else {
            generalService.getLastCertificates($rootScope.userId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.firstBind = false;
                $scope.processData(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

       
    };

    $scope.itemClick = function (bookId, employeeId) {
        //alert(bookId+' '+employeeId);
        //$location.path('/applibrary/item/' + bookId);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Courses > ' + $scope.title;
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.course').fadeIn();
        $scope.bind();
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms == 'footer')
            $('.footercourse' + $scope.active).addClass('active');


    });
    $rootScope.$broadcast('AppCourseLoaded', null);


}]);