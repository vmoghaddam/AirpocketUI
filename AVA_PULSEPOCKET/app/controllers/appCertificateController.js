'use strict';
app.controller('appCertificateController', ['$scope', '$location', '$routeParams', '$rootScope', 'generalService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, generalService, authService, notificationService, $route) {
    //test
    
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    $scope.active = $route.current.type;
    
    $scope.title = null;
    switch ($scope.active) {
        
        case 'all':
             
            $scope.title = 'All';
            break;
        case 'last':
             
            $scope.title = 'Last';
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
    $scope.certificates = [];
    $scope.ds = null;
    $scope.processData = function (data) {
        $.each(data, function (_i, _d) {
            _d.CourseOrganization = _d.CourseOrganization ? '(' + _d.CourseOrganization+')' : '';
            _d.DateIssue = moment(_d.DateIssue).format('MMMM Do YYYY');
            _d.ExpireDate = _d.ExpireDate ? moment(_d.ExpireDate).format('MMMM Do YYYY') : '?';
            _d.Remain = _d.Remain != null ? _d.Remain : '?';
            _d.class = "card w3-text-gray bg-white"; //(_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
            if (_d.IsLast && _d.ExpireStatus == 1)
                _d.class = "card text-white bg-red";
            if (_d.IsLast && _d.ExpireStatus == 2)
                _d.class = "card text-white bg-orange";
        });
        $scope.ds = data;
    };

    $scope.Cockpit = [36, 37, 38, 30, 31, 32, 33, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.formatDateCer = function (dt) {
        if (!dt)
            return "unknown";
        return moment(new Date(dt)).format('MMM-DD-YYYY').toUpperCase();
    };

    $scope.bind = function () {
        //getEmployeeCertificates
        $scope.loadingVisible = true;
        generalService.getEmployeeCertificates($rootScope.employeeId).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            

            if (response  && response .length > 0) {
                var jg = response [0].JobGroup;
                if (jg == 'TRE')
                    $scope.Cockpit.push(35);
                if (jg == 'TRI')
                    $scope.Cockpit.push(34);
                if (['CCM','SCCM','ISCCM'].indexOf(jg) != -1)
                     $scope.Cockpit = [1,  3,  5, 36, 6, 7,  11, 31];
            }
            var _now = new Date();
            var _start = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 0, 0, 0, 0);
            $.each(response , function (_i, _d) {
                var _expDate = new Date(_d.EXPYear, _d.EXPMonth - 1, _d.EXPDay + 1, 0, 0, 0, 0);
                if (_d.Status != 'UNKNOWN')
                    _d.Remain = moment(_expDate).diff(moment(_start), 'days');
                else
                    _d.Remain = 'UNKNOWN';
            });
            var data = Enumerable.From(response ).Where(function (x) { return $scope.Cockpit.indexOf(x.TypeId) != -1; }).OrderBy('$.StatusId').ThenBy('$.Remain').ToArray();


            $scope.certificates = data;
            var scroll_main = $("#scrollview").dxScrollView().dxScrollView("instance");
            scroll_main.scrollBy(1);





        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getRemainClass = function (item) {
        if (item.StatusId == 0)
            return 'cer-expired';
        else if (item.StatusId == 1)
            return 'cer-expiring';
        else if (item.StatusId == 2)
            return 'cer-unknown';
        else return 'cer-valid';

    };
    $scope._bind = function () {
        if ($scope.firstBind)
            $scope.loadingVisible = true;
        if ($scope.active == 'all') {
            generalService.getAllCertificates($rootScope.userId).then(function (response) {
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

        return;
        libraryService.getPersonLibrary($rootScope.employeeId, $scope.typeId).then(function (response) {
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
        return;
        //alert(bookId+' '+employeeId);
        $location.path('/applibrary/item/' + bookId);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
       // $rootScope.page_title = 'Certificates > ' + $scope.title;
        $rootScope.page_title = 'Certificates';
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.certificate').fadeIn();
       $scope.bind();
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms == 'footer')
            $('.footer' + $scope.active).addClass('active');


    });
    $rootScope.$broadcast('AppLibraryLoaded', null);


}]);