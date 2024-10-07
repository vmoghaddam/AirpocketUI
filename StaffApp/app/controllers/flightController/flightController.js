'use strict';
app.controller('appFlightController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    
    $scope.typeId = null;
    $scope.title = "Schedule";
    

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
    //////////////////////////////
  
    ////////////////////////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false,   format: 'yyyy-MMM-dd' },
        { dataField: 'Leg', caption: 'Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   fixed: false, fixedPosition: 'left' },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false,   format: 'HH:mm' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false,  format: 'HH:mm' },
        //{ dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
       // { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        //{ dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
       // { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },

        //{ dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
        //{ dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
      
       // { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       // { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       // { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height: $(window).height() - 45 - 62,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ActualFlightHOffBlock * 60 + options.value.ActualFlightMOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    ////////////////////////////////////////////////////
    $scope.ds = null;
    $scope.bind = function () {
        if ($scope.firstBind)
            $scope.loadingVisible = true;
        //libraryService.getPersonLibrary($rootScope.employeeId, $scope.typeId).then(function (response) {
        //    $scope.loadingVisible = false;
        //    $scope.firstBind = false;
        //    $.each(response, function (_i, _d) {
        //        // _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/imguser.png';
        //        _d.DateExposure = moment(_d.DateExposure).format('MMMM Do YYYY, h:mm:ss a');
        //        _d.VisitedClass = "fa " + (_d.IsVisited ? "fa-eye w3-text-blue" : "fa-eye-slash w3-text-red");
        //        //_d.IsDownloaded = true;
        //        _d.DownloadedClass = "fa " + (_d.IsDownloaded ? "fa-cloud-download-alt w3-text-blue" : "fa-cloud w3-text-red");
        //        _d.class = (_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
        //        _d.class = "card w3-text-dark-gray bg-white";
        //        _d.titleClass = (_d.IsDownloaded && _d.IsVisited) ? "" : "w3-text-red";
        //        _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/image.png';
        //    });
        //    $scope.ds = response;
        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
        //var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);
        var dt = new Date(2200, 4, 19, 0, 0, 0);
        var df = new Date(1900, 4, 19, 0, 0, 0);
       // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        ////////////////////////////////////
    };

    $scope.itemClick = function (bookId, employeeId) {
        //alert(bookId+' '+employeeId);
        $location.path('/applibrary/item/' + bookId);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Flight > ' + $scope.title;
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.flight').fadeIn();
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