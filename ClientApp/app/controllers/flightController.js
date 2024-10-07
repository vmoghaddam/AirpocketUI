'use strict';
app.controller('appFlightController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, authService, notificationService, $route) {

    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    $scope.jgroup = $rootScope.JobGroup;
    $scope.typeId = null;
    $scope.title = "Schedule";
    ///////////////////////////////
    $scope.date_flightDate = {
        placeholder: "Enter Flight Date",
        adaptivityEnabled: true,
        type: "date",
        useMaskBehavior: true,
        bindingOptions: {
            value: 'newFlight.Date'
        }
    };


    ///////////////////////////////////////
    var detector = new MobileDetect(window.navigator.userAgent);
    console.log("Mobile: " + detector.mobile());
    console.log("Phone: " + detector.phone());
    console.log("Tablet: " + detector.tablet());
    console.log("OS: " + detector.os());
    console.log("userAgent: " + detector.userAgent());
    //////////////////////////
    var tabs = [
        { text: "Tomorrow", id: 'tomorrow' },
        { text: "Today", id: 'today' },
        { text: "All", id: 'all' },


    ];
    $scope.tabs = tabs;

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;
        $('#' + id).fadeIn(400, function () {
            var scroll_crew_tomorrow = $("#scroll_crew_tomorrow").dxScrollView().dxScrollView("instance");
            scroll_crew_tomorrow.scrollBy(1);

            var scroll_crew_tday = $("#scroll_crew_today").dxScrollView().dxScrollView("instance");
            scroll_crew_tday.scrollBy(1);

            var scrltom = $("#scrltom").dxScrollView().dxScrollView("instance");
            scrltom.scrollBy(1);

            var scrltod = $("#scrltod").dxScrollView().dxScrollView("instance");
            scrltod.scrollBy(1);

        });
        switch (id) {
            case 'today':
                $scope.bindToday();

                break;
            case 'tomorrow':
                $scope.bindTomorrow();
                break;
            case 'all':
                $scope.buildAcc();
                $scope.bindAll();

                if ($scope.sch_instance)
                    $scope.sch_instance.repaint();
                break;
            default:
                break;
        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.selectedTabIndex = 0;
    //////////////////////

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
    ///////////////////////////
    $scope.scroll_height_all = 100;
    $scope.scroll_all_instance = null;
    $scope.scroll_all = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        onInitialized: function (e) {
            //console.log(e.component);
            if (!$scope.scroll_all_instance)
                $scope.scroll_all_instance = e.component;

        },
        bindingOptions: { height: 'scroll_height_all', }
    };

    $scope.scroll_popup = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        onInitialized: function (e) {


        },
        heigh: '100%',
        //  bindingOptions: { height: 'scroll_height_all', }
    };
    /////////////////////////////
    $scope.scroll_tomorrow = {
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
        height: '100%',

    };
    $scope.scroll_crew = {
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
        height: '100%',

    };
    $scope.scroll_crew_today = {
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
        height: '100%',

    };
    ///////////////////////////
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

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'Leg', caption: 'Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'HH:mm', width: 100 },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'HH:mm', width: 100 },
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
    $scope.ds_today = null;
    $scope.ds_tomorrow = null;
    $scope.ds_all = null;
    $scope.ds_day = null;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    $scope.getDay = function (dt) {
        return (new Date(dt)).getDate();
    };
    $scope.getFlightTileMonth = function (dt) {
        var mns = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var _dt = new Date(dt);
        var m = _dt.getMonth();
        var mstr = mns[m];
        var year = _dt.getFullYear();
        var yearstr = year.toString().substring(2, 4);
        var str = mstr + ' ' + yearstr;
        return str;
    };
    $scope.getStatusClass = function (item) {

        return "fa fa-circle " + item.FlightStatus.toLowerCase();
    };
    $scope.getFlightClass = function (item) {
        var x = "lib-flight";
        if (item.IsPositioning == 1)
            x += " dh";
        return x;
    };
    $scope.getStatus = function (item) {

        switch (item) {
            case 'OffBlocked':
                return 'Block Off';
            case 'OnBlocked':
                return 'Block On';
            case 'Departed':
                return 'Take Off';
            case 'Arrived':
                return 'Landing';

            default:
                return item;
        }
    };
    function formatTime2(date) {
        if ($rootScope.userName.toLowerCase() == 'shamsi')
            alert(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();

        //hours = hours % 12;
        //hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        return strTime;
    }
    $scope.getTimeFormated = function (dt) {
        if (!dt)
            return "-";
        //if ($rootScope.userName.toLowerCase() == 'shamsi')
        //    alert(dt);
        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return formatTime2(_dt);
    };
    $scope.getDuration = function (x) {
        if (!x)
            return "-";
        return pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString() + ' hrs';
    };


    $scope.flight = null;
    $scope.flightDay = null;
    $scope.flightToday = null;
    $scope.flightTomorrow = null;
    $scope.showFlight = function (item, n, $event) {
        if (!detector.tablet()) {
            $scope.flight = item;
            $scope.popup_flight_visible = true;
        }
        else {
            if (n == 0) {
                $('.today-tile').removeClass('selected');
                $scope.flightToday = item;
            }
            if (n == 1) {
                $('.tomorrow-tile').removeClass('selected');
                $scope.flightTomorrow = item;
            }
            if (n == 2) {
                $('.day-tile').removeClass('selected');
                $scope.flightDay = item;
            }
            var tile = $($event.currentTarget);
            tile.addClass('selected');

            $scope.getCrewAbs(item.FlightId, n);
        }
    };
    $scope.crew = null;
    $scope.crewDay = null;
    $scope.crewToday = null;
    $scope.crewTomorrow = null;
    $scope.getCrewAbs = function (fid, n) {
        $scope.crew = null;
        $scope.crewDay = null;
        $scope.crewToday = null;
        $scope.crewTomorrow = null;
        $scope.loadingVisible = true;


        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid).then(function (response) {
            $scope.loadingVisible = false;

            if (!n && n != 0) {
                $scope.crew = response;
            } else
                if (n == 0) {
                    $scope.crewToday = response;

                } else
                    if (n == 1) {
                        $scope.crewTomorrow = response;
                    } else
                        if (n == 2) {
                            $scope.crewDay = response;
                        }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Flight';
    $scope.popup_flight = {
        width: 300,
        height: 260,
        //position: 'left top',
        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.getCrewAbs($scope.flight.FlightId);
        },
        onHiding: function () {

            $scope.flight = null;
            $scope.crew = null;
        },
        bindingOptions: {
            visible: 'popup_flight_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_flight_title',

        }
    };

    //close button
    $scope.popup_flight.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_flight_visible = false;

    };
    //////////////////////////////////
    $scope.bindToday = function () {
        if ($scope.ds_today)
            return;
        $scope.loadingVisible = true;

        var dt = new Date();
        var df = new Date();
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            // $.each(response, function (_i, _d) {
            //_d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //_d.STA = (new Date(_d.STA)).addMinutes(offset);

            //_d.STD = (new Date(_d.STD)).addMinutes(offset);
            //if (_d.ChocksIn)
            //    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //if (_d.ChocksOut)
            //    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //if (_d.Takeoff)
            //    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //if (_d.Landing)
            //    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //_d.DurationH = Math.floor(_d.FlightTime / 60);
            //_d.DurationM = _d.FlightTime % 60;
            //var fh = _d.FlightH * 60 + _d.FlightM;
            //_d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //_d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //poosk
            //});
            $scope.ds_today = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bindTomorrow = function () {

        if ($scope.ds_tomorrow)
            return;
        $scope.loadingVisible = true;

        var dt = (new Date()).addDays(1);
        var df = (new Date()).addDays(1);
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;

            //$.each(response, function (_i, _d) {
            //    _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //    _d.STA = (new Date(_d.STA)).addMinutes(offset);

            //    _d.STD = (new Date(_d.STD)).addMinutes(offset);
            //    if (_d.ChocksIn)
            //        _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //    if (_d.ChocksOut)
            //        _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //    if (_d.Takeoff)
            //        _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //    if (_d.Landing)
            //        _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //    _d.DurationH = Math.floor(_d.FlightTime / 60);
            //    _d.DurationM = _d.FlightTime % 60;
            //    var fh = _d.FlightH * 60 + _d.FlightM;
            //    _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //    var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //    _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //    _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //    //poosk
            //});
            $scope.ds_tomorrow = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bindAll = function () {
        if ($scope.ds_all)
            return;

        $scope.loadingVisible = true;


        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlightsGrouped(id).then(function (response) {
            $scope.loadingVisible = false;

            $scope.ds_all = response;
            if ($scope.sch_instance)
                $scope.sch_instance.repaint();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err, 'error'); });


    };
    $scope.bindDay = function (day) {
        $scope.ds_day = null;
        $scope.loadingVisible = true;

        var dt = new Date(day);
        var df = new Date(day);
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            //$.each(response, function (_i, _d) {
            //    _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //    _d.STA = (new Date(_d.STA)).addMinutes(offset);

            //    _d.STD = (new Date(_d.STD)).addMinutes(offset);
            //    if (_d.ChocksIn)
            //        _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //    if (_d.ChocksOut)
            //        _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //    if (_d.Takeoff)
            //        _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //    if (_d.Landing)
            //        _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //    _d.DurationH = Math.floor(_d.FlightTime / 60);
            //    _d.DurationM = _d.FlightTime % 60;
            //    var fh = _d.FlightH * 60 + _d.FlightM;
            //    _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //    var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //    _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //    _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //    //poosk
            //});
            $scope.ds_day = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };

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
        $scope.scroll_height = $(window).height() - 45 - 62 - 100;

        $scope.scroll_height_all = $(window).height() - 505;
        $('#scrollviewall').height($(window).height() - 505);
        $('.col-tablet').height($(window).height() - 45 - 62 - 45);
        $('.div-crew').height($(window).height() - 552);
        $('#tomorrow').height($(window).height() - 45 - 62 - 30);
        $('#today').height($(window).height() - 45 - 62 - 30);
        $('.flight').fadeIn();

        // $scope.bindTomorrow();
    }
    //////////////////////////////////////////
    $scope.data = [];

    var priorities = [
        {
            text: "High priority",
            id: 1,
            color: "#cc5c53"
        }, {
            text: "Low priority",
            id: 2,
            color: "#ff9747"
        }
    ];

    $scope.sch_instance = null;
    $scope.scheduler = null;
    $scope.sch_current = new Date();
    $scope.schedulerOptions = {
        // dataSource:  $scope.data,
        textExpr: 'Total',
        startDateExpr: 'Start',
        endDateExpr: 'End',
        appointmentTemplate: 'appointmentTemplate',
        views: ["month"],
        adaptivityEnabled: false,
        currentView: "month",
        startDayHour: 0,
        currentDate: new Date(),
        height: 340,
        bindingOptions: {
            dataSource: 'ds_all', //'dg_employees_ds',
            currentDate: 'sch_current',
            // height: 'dg_employees_height'
        },
        onContentReady: function (e) {
            if (!$scope.sch_instance)
                $scope.sch_instance = e.component;

        },
        onAppointmentClick: function (e) {
            $scope.flight = null;
            $scope.flightDay = null;
            $scope.bindDay(e.appointmentData.Start);
            e.cancel = true;
            return;
            var $el = $(e.event.target);
            if ($el.hasClass('cellposition')) {
                e.cancel = true;
                return;
            }
        },

    };

    $scope.speedDialActionOptions = {
        icon: "plus",
        onClick: showAppointmentPopup
    }

    function showAppointmentPopup() {
        var scheduler = $('#scheduler').dxScheduler('instance');
        scheduler.showAppointmentPopup();
    }
    //////////////////////////////////////////
    $scope.accToggle = function ($event) {
        // alert('c');
        //alert($scope.scroll_all_instance);
        $scope.scroll_all_instance.beginUpdate();
        $scope.scroll_height_all = 1000;
        // $scope.scroll_all_instance.repaint();
        $scope.scroll_all_instance.endUpdate();
        //var $this = $($event.target);
        //$this.toggleClass('active');
        //var panel = $this.next();

    };
    //////////////////////////////////////////

    $scope.accBuilt = false;
    $scope.accActive = false;
    $scope.buildAcc = function () {

        //  $scope.scroll_height_all = $(window).height() - 525;
        if ($scope.accBuilt)
            return;
        $scope.accBuilt = true;
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {


            acc[i].addEventListener("click", function () {

                this.classList.toggle("active");
                $scope.accActive = !$scope.accActive;
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {

                    //$scope.scroll_height_all = $(window).height() - 505;
                    $('#scrollviewall').height($(window).height() - 505 + 330);
                    $('.col-tablet2').height($(window).height() - 505 + 330);

                    panel.style.maxHeight = null;
                } else {
                    //alert(panel.scrollHeight);
                    $('#scrollviewall').height($(window).height() - 515);
                    $('.col-tablet2').height($(window).height() - 515);
                    //doof
                    //$scope.scroll_height_all = $(window).height() - 505 + 340;

                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
        for (i = 0; i < acc.length; i++) {
            var acc = acc[i];
            acc.classList.toggle("active");
            $scope.accActive = true;
            var _panel = acc.nextElementSibling;
            if (_panel.style.maxHeight) {
                $('#scrollviewall').height($(window).height() - 505 + 330);
                $('.col-tablet2').height($(window).height() - 505 + 330);
                _panel.style.maxHeight = null;
            } else {
                $('#scrollviewall').height($(window).height() - 515);
                $('.col-tablet2').height($(window).height() - 515);
                _panel.style.maxHeight = _panel.scrollHeight + "px";
            }
        }
    };
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms == 'footer')
            $('.footer' + $scope.active).addClass('active');


    });
    var vhHeight = $("body").height();
    var chromeNavbarHeight = vhHeight - window.innerHeight;
    window.addEventListener("orientationchange", function (event) {
        //   alert(chromeNavbarHeight);
        //var _height = screen.height-100;

        //no-rotate
        setTimeout(function () {
            //alert(window.outerHeight);
            var _height = window.outerHeight;
            // alert(screen.height);
            $('.col-tablet').height(_height - 45 - 62 - 45);
            var tb2 = _height - 515;
            if (!$scope.accActive)
                tb2 = _height - 505 + 330;
            $('.col-tablet2').height(tb2);
            $('.div-crew').height(_height - 552);
            $('#tomorrow').height(_height - 45 - 62 - 30);
            $('#today').height(_height - 45 - 62 - 30);
            if (screen.height < screen.width && !detector.tablet()) {
                $('.no-rotate').hide();
                $('.yes-rotate').show();
            }
            else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        }, 200);

    }, false);

    function reportWindowSize() {
        //heightOutput.textContent = window.innerHeight;
        //widthOutput.textContent = window.innerWidth;

    }

    window.onresize = function (event) {
        return;
        setTimeout(function () {
            //alert(window.outerHeight);
            var _height = window.outerHeight;
            // alert(screen.height);
            $('.col-tablet').height(_height - 45 - 62 - 45);
            var tb2 = _height - 515;
            if (!$scope.accActive)
                tb2 = _height - 505 + 330;
            $('.col-tablet2').height(tb2);
            $('.div-crew').height(_height - 552);
            $('#tomorrow').height(_height - 45 - 62 - 30);
            $('#today').height(_height - 45 - 62 - 30);
            if (screen.height < screen.width && !detector.tablet()) {
                $('.no-rotate').hide();
                $('.yes-rotate').show();
            }
            else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        }, 200);
    };
    //$(window).on("orientationchange", function (event) {
    //    // alert("This device is in " + event.orientation + " mode!");
    //    console.log(event);
    //});

    $rootScope.$broadcast('AppLibraryLoaded', null);
    window.onerror = function (message, url, lineNo) {

        console.log('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
        return true;
    }











}]);