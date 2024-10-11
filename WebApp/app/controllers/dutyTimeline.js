 'use strict';
 

app.controller('dutyTimelineController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'schedulingService', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, schedulingService) {
    $scope.OnlyRoster = false;
    if ($rootScope.userName.toLowerCase() == 'train.moradi' || $rootScope.userName.toLowerCase() == 'mohammadifard')
        $scope.OnlyRoster = true;
    //soltani
    $scope.OnlyTraining = false;
    if ($rootScope.userName.toLowerCase() == 'train.moradi' || $rootScope.userName.toLowerCase() == 'mohammadifard' || $rootScope.userName.toLowerCase() == 'demo')
        $scope.OnlyTraining = true;

    $scope.ShowFunctions = !$scope.OnlyRoster;


    $scope.Operator = $rootScope.CustomerName.toUpperCase();
    $scope.firstHour = new Date(General.getDayFirstHour(new Date()));
    $scope.editable = true;
    $scope.isAdmin =
        $route.current.isAdmin;

    $scope.bottom = 120;
    $scope.prms = $routeParams.prms;
    $scope.footerfilter = true;
    var detector = new MobileDetect(window.navigator.userAgent);

    $scope.IsMobile = detector.mobile() ? true : false;
    $scope.IsLandscape = $(window).width() > $(window).height();
    authService.setModule(3);
    $scope.tabsdatevisible = false;
    //////////////////////////////////////
    $scope.selectedTabDetIndex = -1;
    $scope.selectedTabDetId = null;
    $scope.tabsdet = [
        { text: "FDPs", id: 'FDPs' },
        // { text: "Flights", id: 'Flights' },
        { text: "Crew", id: 'Crew' },
        { text: "Assigned", id: 'ASSIGNED' }

    ];
    $scope.$watch("selectedTabDetIndex", function (newValue) {
        //ati
        try {
            $('.tabdet').hide();
            var id = $scope.tabsdet[newValue].id;
            $scope.selectedTabDetId = id;
            $('#' + id).fadeIn();
            if (id == 'ASSIGNED')
                $scope.getAssigned();
        }
        catch (e) {

        }

    });
    //tabsdetoptions
    $scope.tabsdetoptions = {
        scrollByContent: true,
        showNavButtons: true,
        elementAttr: {
            // id: "elementId",
            class: "tabsdetoptions"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDetIndex = -1;
            $scope.selectedTabDetIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabsdet", deep: true },
            selectedIndex: 'selectedTabDetIndex'
        }

    };
    /////////////////////////////////////////
    $scope._formatMinutes = function (mm) {

        if (!mm)
            return "00:00";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    //$scope.formatMinutes = function (mm) {
    //    if (!mm)
    //        return "";
    //    var sgn = ' ';
    //    if (mm < 0) {
    //        mm = -1 * mm; sgn = '-';
    //    }

    //    return sgn + (pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString());
    //};

    $scope.formatMinutes = function (mm) {


        if (!mm && mm !== 0)
            return "-";
        var sgn = "";
        if (mm < 0)
            sgn = "-";
        mm = Math.abs(Math.round(mm));
        return sgn + pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.round((mm % 60))).toString();
    };
    ////////////////////////////////////
    $scope.dt_fromSearched = new Date();
    $scope.dt_toSearched = new Date().addDays(0);
    $scope._datefrom = new Date();


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '130px',
        displayFormat: "yyyy-MM-dd",
        adaptivityEnabled: true,
        //  pickerType: 'rollers',
        onValueChanged: function (arg) {
            //$scope.search();
        },
        bindingOptions: {
            value: '_datefrom',

        }
    };
    $scope.days_count = 2;
    $scope.num_days = {
        min: 1,
        showSpinButtons: false,
        bindingOptions: {
            value: 'days_count',

        }
    };





    //dooli
    $scope.selectedTabDateIndex2 = -1;
    $scope.selectedTab2 = null;
    $scope.selectedDate2 = null;
    $scope.tabsdatefirst2 = true;
    $scope.$watch("selectedTabDateIndex2", function (newValue) {

        try {

            if ($scope.selectedTabDateIndex2 == -1)
                return;

            $scope.selectedTab2 = $scope.tabs_date2[newValue];

            $scope.selectedDate2 = new Date($scope.selectedTab2.date);

            //$scope.checkStbyAdd();
            $scope.setAmPmDs($scope.selectedDate2, 'AM');
            // $scope.setAmPmDs($scope.selectedDate2, 'PM');


        }
        catch (e) {
            alert('error1');
            alert(e);
        }

    });
    $scope.tabs_date2 = [


    ];
    // $scope.selectedTabDateIndex = 0;
    $scope.tabs_date_options2 = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate1"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex2 = -1;
            $scope.selectedTabDateIndex2 = 0;
        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_date2", deep: true },
            selectedIndex: 'selectedTabDateIndex2'
        }

    };
    /////////////////////////



    $scope.formatDay = function (date) {
        if (!date)
            return "";
        return moment(date).format('ddd');
    };
    $scope.formatDatePersian = function (date) {
        if (!date)
            return "";
        return new persianDate(date).format("DD/MM/YYYY")
    }
    $scope.formatDate = function (date) {
        if (!date)
            return "";
        return moment(date).format('YYYY-MM-DD');
    };
    ///////////////////////
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.scroll_jl_height = $(window).height() - 10 - 110;
    ////////////////////////////////


    ////////////////
    $scope.rptcd_dateFrom = new Date();
    $scope.rptcd_dateTo = new Date();
    //doolq
    //$scope.formatMinutes = function (mm) {
    //    return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    //};



    $scope.formatDateTime = function (dt) {
        return moment(dt).format('MM-DD HH:mm');
    };
    $scope.formatTime = function (dt) {
        if (!dt)
            return null;
        return moment(dt).format('HH:mm');
    };




    $scope._eventId = -1;
    $scope.event_status = null;
    function getEventTitle(id) {
        switch (id) {
            case 100000:
                return "Ground";
            case 100001:
                return "Meeting";
            case 100002:
                return "Sick";
            case 100003:
                return "Simulator";
            case 100004:
                return "Expired Licence";
            case 100005:
                return "Expired Medical";
            case 100006:
                return "Expired Passport";
            case 100007:
                return "No Flight";
            case 100008:
                return "Requested Off";
            case 100009:
                return "Refuse";
            case 1169:
                return "Vacation";
            case 1170:
                return "Reserve";
            //2020-10-27
            case 100025:
                return "Mission";
            default:
                return "-";
        }
    }

    $scope.FromDateVisible = new Date();
    $scope.ToDateVisible = new Date();
    $scope.date_from_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateVisible',

        }
    };
    $scope.date_to_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateVisible',

        }
    };

    ///////////////////////////////////////
    $scope.daysds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    $scope.days_count = 2;
    $scope.sb_days = {

        showClearButton: false,
        width: '100%',
        searchEnabled: false,
        dataSource: $scope.daysds,

        onSelectionChanged: function (arg) {
            // $scope.search();
        },
        bindingOptions: {
            value: 'days_count',

        }
    };
    ///////////////////////////////////////
    $scope.selectedTabDateIndex = -1;
    $scope.tabsdatefirst = true;

    $scope.$watch("selectedTabDateIndex", function (newValue) {

        try {

            if ($scope.selectedTabDateIndex == -1)
                return;
            $scope.selectedTab = $scope.tabs_date[newValue];

            $scope.selectedDate = new Date($scope.selectedTab.date);
            $scope.scrollFirstFlightDate($scope.selectedDate);


        }
        catch (e) {
            alert('error2');
            alert(e);
        }

    });
    $scope.tabs_date = [


    ];
    $scope.tabs_date_options = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex = -1;
            $scope.selectedTabDateIndex = 0;

        },
        bindingOptions: {
            visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs_date", deep: true },
            selectedIndex: 'selectedTabDateIndex'
        }

    };
    ///////////////////////////////////////

    //var dfrom = new Date(2020, 6, 2, 0, 0, 0, 0);

    $scope.regs = ['CAR', 'KPA', 'KPB', 'CPD', 'CAS', 'CPV', 'FPA', 'FPC', 'CPQ', 'KPC', 'KPD', 'KPE', 'CNL'];
    /////config/////////////////
    var hourWidth = 20;
    ///////////////////////////

    $scope.refreshHeights = function () {


        $('.cell-hour').width(hourWidth);
        $('.cell-day').width((hourWidth + 1) * 24 - 1);
        $('.row-top-mirror').height($('.row-top').height() - 1);
        var h = ($('.reg-box').height());
        //$('.mid-line').height($('.flights').prop('scrollHeight') );
        //$('.hour-line').height($('.flights').prop('scrollHeight'));
        // $('.now-line').height($('.flights').prop('scrollHeight'));
        $('.mid-line').height(h);
        $('.hour-line').height(h);
        $('.now-line').height(h);

        $('.flights').on('scroll', function () {
            $('.regs').scrollTop($(this).scrollTop());
            //$('.timeline').scrollLeft($(this).scrollLeft());
        });



        $scope.start();

    };

    var stopped;
    $scope.countdown = function () {
        //var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
        //var nowleft = (_left * (hourWidth + 1));
        //var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
        //var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
        stopped = $timeout(function () {

            var time = moment(new Date()).format('HH:mm');
            var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
            var nowleft = (_left * (hourWidth + 1)) - 1;
            $('.now-line').css('left', nowleft + 'px');
            $('#nowTime').css('left', (nowleft + 5) + 'px');
            $('#nowTime').html(time);

            $scope.countdown();

        }, 10000);
    };


    $scope.stop = function () {
        $timeout.cancel(stopped);


    };
    $scope.start = function () {

        $scope.countdown();
    }

    function createDate(year, month, day, hh, mm, ss) {
        var d = new Date();
    }
    function _gpad2(n) {
        var str = "" + n
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        return ans;
    }

    persianDate.toLocale('en');
    $scope.getDep = function (flt) {
        if (flt.ChocksOut)
            return moment(flt.ChocksOut).format('HHmm');
        else
            return moment(flt.STD).format('HHmm');
    };
    $scope.getArr = function (flt) {

        if (flt.ChocksIn)
            return moment(flt.ChocksIn).format('HHmm');
        else
            return moment(flt.STA).format('HHmm');
    };
    $scope.getFlightClass = function (flt) {
        //var cls = 'init-flt';
        //if (flt.FlightStatusID == 4)
        //    cls += ' cnl';

        //if (flt.hasCrew)
        //    cls += ' has-crew';
        //if (flt.hasCrewAll)
        //    cls += ' has-crew-all';
        //if (flt.hasCabinExtra || flt.hasCockpitExtra)
        //    cls += ' has-crew-extra';
        var cls = 'duty-' + flt.DutyType;
        return cls + ' flightitem';
    }
    $scope.getTextClass = function (flt) {

        var cls = 'duty-text-' + flt.DutyType;
        return cls;
    }
    $scope.getCockpitSignClass = function (f) {
        return f.hasCockpitExtra ? 'has-crew-extra' : '';
    };
    $scope.getCabinSignClass = function (f) {
        return f.hasCabinExtra ? 'has-crew-extra' : '';
    };
    $scope.getDuration = function (d1, d2) {
        var diff = Math.abs(d1.getTime() - d2.getTime()) / 3600000;
        return diff;
    }

    $scope.getFlightWidth = function (flt) {
        var duration = $scope.getDuration(new Date(flt.ChocksIn ? flt.ChocksIn : flt.STA), new Date(flt.STD));
        var w = duration * (hourWidth + 1);
        flt._width = duration;
        return w + "px";
    }
    $scope.getDelayStyle = function (flt) {
        if (!flt.ChocksOut || new Date(flt.ChocksOut) <= new Date(flt.STD))
            return { width: 0 };
        var duration = $scope.getDuration(new Date(flt.ChocksOut), new Date(flt.STD));
        var w = duration * (hourWidth + 1);
        return { width: w + "px" };
    };
    $scope.getDelayText = function (flt) {
        if (!flt.ChocksOut || new Date(flt.ChocksOut) <= new Date(flt.STD))
            return "";
        var duration = $scope.getDuration(new Date(flt.ChocksOut), new Date(flt.STD)) * 60;

        return duration != 0 ? duration : "";
    };
    $scope.hasConflict = function (f1, f2) {
        if ((f1.STD >= f2.STD && f1.STD <= f2.STA) || (f1.STA >= f2.STD && f1.STA <= f2.STA))
            return true;
        if ((f2.STD >= f1.STD && f2.STD <= f1.STA) || (f2.STA >= f1.STD && f2.STA <= f1.STA))
            return true;


        if ((f1.ChocksOut >= f2.STD && f1.ChocksOut <= f2.STA) || (f1.ChocksIn >= f2.STD && f1.ChocksIn <= f2.STA))
            return true;
        if ((f2.ChocksOut >= f1.STD && f2.ChocksOut <= f1.STA) || (f2.ChocksIn >= f1.STD && f2.ChocksIn <= f1.STA))
            return true;



        if ((f1.ChocksOut >= f2.ChocksOut && f1.ChocksOut <= f2.ChocksIn) || (f1.ChocksIn >= f2.ChocksOut && f1.ChocksIn <= f2.ChocksIn))
            return true;
        if ((f2.ChocksOut >= f1.ChocksOut && f2.ChocksOut <= f1.ChocksIn) || (f2.ChocksIn >= f1.ChocksOut && f2.ChocksIn <= f1.ChocksIn))
            return true;




        return false;
    };
    $scope.timeType = 0;
    $scope.getFlightStyle = function (f, index, res) {

        var style = {};
        style.width = $scope.getFlightWidth(f);


        var std = f.STD;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(std.getFullYear(), std.getMonth(), std.getDate(), 1, 0, 0, 0));
            std = (new Date(std)).addMinutes(offset)

        }
        var datefromOffset = (new Date($scope.datefrom)).getTimezoneOffset();
        var stdOffset = (new Date(std)).getTimezoneOffset();
        var dfirst = new Date($scope.datefrom);
        var mm = (new Date($scope.datefrom)).getMonth();
        var dd = (new Date($scope.datefrom)).getDate();


        if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
            dfirst = (new Date($scope.datefrom)).addMinutes(-60);
        if (stdOffset > datefromOffset)
            dfirst = (new Date($scope.datefrom)).addMinutes(60);



        var left = $scope.getDuration(/*new Date($scope.datefrom)*/new Date(dfirst), new Date(f.STD));
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;


        style.top = top + 'px';
        return style;
    }
    $scope.getDutyTextStyle = function (f) {
        var types = [1167, 1168, 300013];
        var i = types.indexOf(f.DutyType);
        return i == -1 ? { color: 'white' } : { color: 'black' };
    };
    $scope.getRestStyle = function (f) {
        var bk = '#e6e6e6';
        if (f.InteruptedId)
            bk = '#ff704d';
        return { background: bk };
    };
    $scope.d7style = {
        display: 'inline-block',
    };
    $scope.yfstyle = {
        display: 'inline-block',
    };
    $scope.fstyle = {
        display: 'inline-block',
    };
    $scope.cyfstyle = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    ////////////////////////
    $scope.d14style = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    $scope.d28style = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    $scope.d7 = null;
    $scope.d14 = null;
    $scope.d28 = null;

    $scope.f = null;
    $scope.yf = null;
    $scope.cyf = null;
    $scope.Duties7 = [];
    $scope.DutyColors7 = [];
    $scope.Duties14 = [];
    $scope.DutyColors14 = [];
    $scope.Duties28 = [];
    $scope.DutyColors28 = [];
    $scope.getDutyText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        var dvalue = $scope.data_ftl['Duty' + n] / 60.0;
        var dp = Number((dvalue * 100.0) / m).toFixed();
        var txt = $scope.formatMinutes(dvalue * 60) + ' (' + dp + '%)';
        return txt;
    };
    $scope.getFlightText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28";
        var m = 100;
        if (n == 12) { m = 1000; str = "FlightYear"; }
        if (n == 1) {
            m = 900; str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str] / 60.0;
        var dp = Number((dvalue * 100.0) / m).toFixed();
        var txt = $scope.formatMinutes(dvalue * 60) + ' (' + dp + '%)';
        return txt;
    };
    $scope.getFlightText2 = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getFlightRemainingText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28Remain";

        if (n == 12) { str = "FlightYearRemain"; }
        if (n == 1) {
            str = "FlightCYearRemain";
        }
        var dvalue = ($scope.data_ftl[str]) / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };

    $scope.getDutyText2 = function (n) {
        if (!$scope.data_ftl)
            return "";

        var dvalue = $scope.data_ftl['Duty' + n] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getDutyText3 = function (rec, field) {


        var dvalue = rec[field] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getDutyCellStyle = function (n) {
        if (!$scope.data_ftl)
            return {};
        var dvalue = $scope.data_ftl['Duty' + n];
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };
    $scope.getFlightCellStyle = function (n) {
        if (!$scope.data_ftl)
            return {};
        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str];
        var m = 100;
        if (n == 12)
            m = 1000;
        if (n == 1)
            m = 900;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };


    $scope.getDutyCellStyle3 = function (rec, n) {

        var dvalue = rec['Duty' + n];
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };
    $scope.getFlightCellStyle3 = function (rec, n) {

        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = rec[str];
        var m = 100;
        if (n == 12)
            m = 1000;
        if (n == 1)
            m = 900;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };


    $scope.getDutyRemainingText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var m = 60 * 60;
        if (n == 14)
            m = 110 * 60;
        if (n == 28)
            m = 190 * 60;
        var dvalue = (m - $scope.data_ftl['Duty' + n]) / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.data_ftl = null;
    $scope.ds_exceed = [];
    $scope.bindExceed = function () {
        schedulingService.getFTLExceedAll($scope.profile.Id).then(function (response2) {
            $scope.ds_exceed = response2;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindFTL = function () {


        if (!$scope.dt_ftl)
            return;
        $scope.data_ftl = null;
        $scope.Duties7 = [];
        $scope.DutyColors7 = [];
        $scope.Duties14 = [];
        $scope.DutyColors14 = [];
        $scope.Duties28 = [];
        $scope.DutyColors28 = [];

        $scope.Flights28 = [];
        $scope.FlightColors28 = [];
        $scope.FlightsYear = [];
        $scope.FlightColorsYear = [];
        $scope.FlightsCYear = [];
        $scope.FlightColorsCYear = [];

        $scope.loadingVisible = true;

        schedulingService.getFTL($scope.profile.Id, moment($scope.dt_ftl).format('YYYY-MM-DD')).then(function (response) {

            $scope.loadingVisible = false;
            if (!response.Duty7)
                response.Duty7 = 0;
            if (!response.Duty14)
                response.Duty14 = 0;
            if (!response.Duty28)
                response.Duty28 = 0;

            if (!response.Flight28)
                response.Flight28 = 0;
            if (!response.FlightYear)
                response.FlightYear = 0;
            if (!response.FlightCYear)
                response.FlightCYear = 0;

            $scope.data_ftl = response;

            /*response.Duty7 = 50*60;
            response.Duty14 = 110*60;
            response.Duty28 = 195*60;
            */

            /*response.Flight28 = 100 * 60;
            response.FlightYear = 1000 * 60;
            response.FlightCYear = 1000 * 60;*/

            var d7 = response.Duty7 / 60.0;
            $scope.d7 = $scope.formatMinutes(response.Duty7);
            var d14 = response.Duty14 / 60.0;
            $scope.d14 = $scope.formatMinutes(response.Duty14);
            var d28 = response.Duty28 / 60.0;
            $scope.d28 = $scope.formatMinutes(response.Duty28);

            $scope.Duties28.push(d28);
            var d28color = '#00cc99';
            if (response.Duty28 >= 0.80 * 190 * 60)
                d28color = "#e68a00";
            if (response.Duty28 >= 190 * 60)
                d28color = "#ff1a1a";
            $scope.DutyColors28.push(d28color);
            $scope.d28style.color = d28color;

            $scope.Duties14.push(d14);
            var d14color = '#00cc99';
            if (response.Duty14 >= 0.80 * 110 * 60)
                d14color = "#ff8000";
            if (response.Duty14 >= 110 * 60)
                d14color = "#ff1a1a";
            $scope.DutyColors14.push(d14color);
            $scope.d14style.color = d14color;

            $scope.Duties7.push(d7);
            var d7color = '#00cc99';

            if (response.Duty7 >= 0.80 * 60 * 60) { d7color = "#ffaa00"; }
            if (response.Duty7 >= 60 * 60)
                d7color = "#ff1a1a";
            $scope.DutyColors7.push(d7color);
            $scope.d7style.color = d7color;

            var f28 = response.Flight28 / 60.0;
            $scope.Flights28.push(f28);
            var _fcol = '#00cc99';
            if (response.Flight28 >= 0.80 * 100 * 60)
                _fcol = "#ff8000";
            if (response.Flight28 >= 100 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColors28.push(_fcol);

            $scope.FlightsYear.push(response.FlightYear / 60.0);
            _fcol = '#00cc99';
            if (response.FlightYear >= 0.80 * 1000 * 60)
                _fcol = "#ff8000";
            if (response.FlightYear >= 1000 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColorsYear.push(_fcol);

            $scope.FlightsCYear.push(response.FlightCYear / 60.0);
            _fcol = '#00cc99';
            if (response.FlightCYear >= 0.80 * 900 * 60)
                _fcol = "#ff8000";
            if (response.FlightCYear >= 900 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColorsCYear.push(_fcol);




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





    };





    $scope.IsNowLine = false;
    $scope.clearGantt = function () {
        $scope.ganttData = null;
        $scope.stop();
        var $timeBar = $('.header-time');
        var $dayBar = $('.header-date');
        var $flightArea = $('.flights');
        $timeBar.empty();
        $dayBar.empty();
        $flightArea.empty();

    };
    $scope.createGantt = function () {
        var tempDate = new Date(dfrom);


        //return;
        var $timeBar = $('.header-time');
        var $dayBar = $('.header-date');
        var $flightArea = $('.flights');
        $timeBar.empty();
        $dayBar.empty();
        //$flightArea.empty();
        $('.reg-row').remove();
        $('.hour-line').remove();
        $('.mid-line').remove();
        $('.now-line').remove();
        $('#nowTime').remove();
        $('.flights').height(0);


        $('.flights').off('scroll');
        var c = 1;
        var i = 1;
        var Difference_In_Time = $scope.dt_to.getTime() - $scope.dt_from.getTime();

        // To calculate the no. of days between two dates
        $scope.days_count = (Difference_In_Time / (1000 * 3600 * 24)) + 1 + 1;

        // for (var i = 1; i <= $scope.days_count; i++) {
        while (new Date(tempDate) <= new Date($scope.dt_to)) {
            //console.log('DATE:' + new Date(tempDate));

            for (var j = 0; j < 24; j++) {
                var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-270);

                var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "</div>";
                $timeBar.append(hourElem);
                if (c < 24 * $scope.days_count) {
                    var hleft = c * (hourWidth + 1) - 0.8;
                    var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
                    $flightArea.append(hline);
                }

                c++;
            }
            var tbl = "<table style='padding:0;width:95%'><tr>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                //+ "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                //+ "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                //+ "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"

                + "</tr></table>"
            var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + tbl + "</div>";
            $dayBar.append(dayElem);

            if (i < $scope.days_count) {
                var midleft = i * 24 * (hourWidth + 1) - 1;
                var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
                $flightArea.append(midline);
            }


            tempDate = tempDate.addDays(1);
            i++;
        }
        //if ($scope.IsNowLine) {
        //    var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
        //    var nowleft = (_left * (hourWidth + 1));
        //    var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
        //    var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
        //    $flightArea.append(nowline);
        //    $flightArea.append(nowTime);
        //}
        $dayBar.append("<div style='clear:both'></div>");
        $timeBar.append("<div style='clear:both'></div>");
        $('.timeline').width((hourWidth + 1) * $scope.days_count * 24);
        $('.flights').width((hourWidth + 1) * $scope.days_count * 24);


    };


    $scope.ganttData = null;

    $scope.checkConflict = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.STD) >= new Date(_d.STD) && new Date(x.STD) <= new Date(_d.STA))
                    ||
                    (new Date(x.STA) >= new Date(_d.STD) && new Date(x.STA) <= new Date(_d.STA))
                );
            }).ToArray();

        });

        return hasConflict;
    };
    var getMinDate = function (d1, d2) {
        var result = d1;
        if (d2 < d1)
            result = d2;
        return result;


    }
    var getMaxDate = function (d1, d2) {
        var result = d1;
        if (d2 > d1)
            result = d2;
        return result;


    }
    $scope.IsConflict = function (flt, x) {

        var fltDep = getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = getMaxDate(new Date(x.STA), new Date(x.ChocksIn));



        return (fltDep > xDep && fltDep < xArr) || (fltArr > xDep && fltArr < xArr)
            || (xDep > fltDep && xDep < fltArr) || (xArr > fltDep && xArr < fltArr);



    }

    $scope.IsConflictFlight = function (flt, x) {

        var fltDep = getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = getMaxDate(new Date(x.STA), new Date(x.ChocksIn));



        var fltDep = moment(new Date(fltDep)).format('YYYYDDMMHHmm'); //getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = moment(new Date(xDep)).format('YYYYDDMMHHmm'); //getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = moment(new Date(fltArr)).format('YYYYDDMMHHmm');//getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = moment(new Date(xArr)).format('YYYYDDMMHHmm');// getMaxDate(new Date(x.STA), new Date(x.ChocksIn));



        return (fltDep > xDep && fltDep < xArr) || (fltArr > xDep && fltArr < xArr)
            || (xDep > fltDep && xDep < fltArr) || (xArr > fltDep && xArr < fltArr)
            || (xArr == fltArr && xDep == fltDep);

    }

    $scope.IsConflictDuty = function (flt, x) {
        //moment(x.STD).format('YYYYDDMMHHmm')
        var fltDep = moment(new Date(flt.InitStart)).format('YYYYDDMMHHmm'); //getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = moment(new Date(x.InitStart)).format('YYYYDDMMHHmm'); //getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = moment(new Date(flt.InitRestTo)).format('YYYYDDMMHHmm');//getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = moment(new Date(x.InitRestTo)).format('YYYYDDMMHHmm');// getMaxDate(new Date(x.STA), new Date(x.ChocksIn));



        var c = (fltDep > xDep && fltDep < xArr) || (fltArr > xDep && fltArr < xArr)
            || (xDep > fltDep && xDep < fltArr) || (xArr > fltDep && xArr < fltArr)
            || (xArr == fltArr && xDep == fltDep);
        //console.log('conflict ////////////////');
        //console.log(c);
        //console.log('flt', flt);
        //console.log('x', x);
        return c;



    }
    $scope.findConflict = function (flt, flights) {
        //var query = Enumerable.From(flights).Where(function (x) {
        //    return new Date(x.STD) <= new Date(flt.STD) && x.ID != flt.ID

        //}).OrderByDescending(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenByDescending('$.ID').ToArray();
        var cnflt = Enumerable.From(flights).Where(function (x) {
            return new Date(x.STD) <= new Date(flt.STD) && x.ID != flt.ID
                && (
                    (new Date(flt.STD) >= new Date(x.STD) && new Date(flt.STD) < new Date(x.STA))
                    || (new Date(flt.STA) > new Date(x.STD) && new Date(flt.STA) < new Date(x.STA))

                    || (new Date(flt.ChocksOut) >= new Date(x.STD) && new Date(flt.ChocksOut) < new Date(x.STA))
                    || (new Date(flt.ChocksIn) > new Date(x.STD) && new Date(flt.ChocksIn) < new Date(x.STA))


                    || (new Date(flt.ChocksOut) >= new Date(x.ChocksOut) && new Date(flt.ChocksOut) < new Date(x.ChocksIn))
                    || (new Date(flt.ChocksIn) > new Date(x.ChocksOut) && new Date(flt.ChocksIn) < new Date(x.ChocksIn))


                    // || (new Date(flt.STD) == new Date(x.STD) && new Date(flt.STA) == new Date(x.STA))
                    //|| (moment(flt.STD).format('YYYYDDMMHHmm') == moment(x.STD).format('YYYYDDMMHHmm'))
                );
        }).OrderByDescending(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenByDescending('$.ID').FirstOrDefault();
        return cnflt;
    }

    var dfrom = null;
    $scope.flightsRendered = 0;

    $scope.setTop = function (flts) {

        var _flights = Enumerable.From(flts).ToArray();
        var j = 0;
        var last = null;

        while (_flights.length > 0) {
            for (var i = 0; i < _flights.length; i++) {
                var cf = _flights[i];
                //cf.top = null;
                if (i == 0) { cf.top = j; last = cf; }
                else {
                    if (!$scope.IsConflict(cf, last)) { cf.top = j; last = cf; }
                }

            }
            _flights = Enumerable.From(_flights).Where('$.top==null').ToArray();

            j = j + 80;
        }
    }


    $scope.setTopFlight = function (flts) {

        var _flights = Enumerable.From(flts).ToArray();
        var j = 10;
        var last = null;

        while (_flights.length > 0) {
            for (var i = 0; i < _flights.length; i++) {
                var cf = _flights[i];
                //cf.top = null;
                if (i == 0) { cf.top = j; last = cf; }
                else {
                    if (!$scope.IsConflictFlight(cf, last)) { cf.top = j; last = cf; }
                }

            }
            _flights = Enumerable.From(_flights).Where('$.top==null').ToArray();

            j = j + 60;
        }
    }

    $scope.setTopDuty = function (flts) {

        var _flights = Enumerable.From(flts).OrderBy(function (x) { return moment(new Date(x.InitStart)).format('YYYYMMDD') ; }).ToArray();
        var j = 5;
        var last = null;

        while (_flights.length > 0) {
            for (var i = 0; i < _flights.length; i++) {
                var cf = _flights[i];
                //cf.top = null;
                if (i == 0 ) { cf.top = j; last = cf; }
                else {
                    if (!$scope.IsConflictDuty(cf, last)) { cf.top = j; last = cf; }
                }

            }
            _flights = Enumerable.From(_flights).Where('$.top==null').ToArray();

            j = j + duty_height + 5;
        }
    }

    $scope.ati_flights = null;
    //5-17
    $scope.getResOrderIndex = function (reg) {
        try {
            var str = "";

            if (reg.includes("CNL"))
                str = "ZZZZZZ";
            else

                if (reg.includes(".")) {
                    str = "ZZZZ" + reg.charAt(reg.length - 2);

                }

                else
                    // str = reg.charAt(reg.length - 1);
                    str = reg.substring(0, 2) + reg.charAt(reg.length - 1);

            return str;
        }
        catch (ee) {

            return "";
        }

    }

    $scope.showRest = true;
    $scope.chb_rest = {
        text: 'Duty Rest',
        onValueChanged: function (e) {
            $.each($scope.ganttData.duties, function (_i, _q) {
                if (!$scope.showRest) {
                    _q.STA = moment(_q.EndLocal);
                }
                else {
                    if (_q.RestToLocal)
                        _q.STA = moment(_q.RestToLocal);
                    else
                        _q.STA = moment(_q.EndLocal);
                }



            });
        },
        bindingOptions: {
            value: 'showRest',
        }
    };
    $scope.isDutyVisible = function (f) {
        var types = [100020, 100021, 100022, 100023, 100024];
        return types.indexOf(f.DutyType) == -1;
    };



    //2023-05-21
    $scope.prepare_gantt = function () {
        // angular.element(document.querySelector('.col-duty')).bind('scroll', function (e) {
        //     //console.log('scroll', e);
        // })
        $('.col-duty').on('scroll', function () {
            
            $('.col-res').scrollTop($(this).scrollTop());
            $('.row-date').scrollLeft($(this).scrollLeft());

            console.log($(this).scrollTop() + ' ' + $('.col-res').scrollTop());
            if ($(this).scrollTop() > $('.col-res').scrollTop())
                $(this).scrollTop($('.col-res').scrollTop());
            //console.log($(this).scrollLeft());
        });


    };
    var col_height_gap = 150;
    $scope.getLeftColumnStyle = function () {
        var _height = $(window).height() - col_height_gap;
        return {
            height: _height + 'px'
        }
    };
    $scope.getRightColumnStyle = function () {
        var _height = $(window).height() - col_height_gap  + 12;
        return {
            height: _height + 'px'
        }
    };
    var date_cell_width = 190;
    var duty_height = 40;
    var duty_height_fdp = 40;
    var minute_width = date_cell_width * 1.0 / (24 * 60);
    $scope.getRestStyle = function (duty) {
        var start0 = duty.InitStart;
        var start = duty.InitEnd;
        var end = duty.InitRestTo;
        var _start = moment(start);
        var _end = moment(end);
        var duration = _end.diff(_start, 'minutes');
        var _width = duration * minute_width;

        var _left = _start.diff(moment(start0), 'minutes') * minute_width;
        

        return {
            width: _width + 'px',
            left: _left + 'px',
            
            
        };
    };
    $scope.getDutyStyle = function (duty) {
        //   var start = moment('2014-01-01 12:00:00');
        //  var end = moment('2014-01-01 13:00:00');
        //  var minutes = end.diff(start, 'minutes');


        var start = duty.InitStart;
        var end = duty.InitRestTo;
        if (duty.DutyType == 100020) {
         //   var offset = 1 * (new Date()).getTimezoneOffset();
           
            start = new Date(General.getDayFirstHour(duty.InitStart));
            end = new Date(General.getDayLastHour(duty.InitStart));

        }

        var _start = moment(start);
        var _end = moment(end);
        var duration = _end.diff(_start, 'minutes');
        var _width = duration * minute_width;

        var _left = _start.diff(moment($scope.datefrom), 'minutes') * minute_width;
        var dheight = duty_height;
        if ([5000, 5001, 100003, 100001, 100025,300014].indexOf(duty.DutyType) != -1)
            dheight = duty_height_trn;
        if ([1165].indexOf(duty.DutyType) != -1) {
            dheight = duty_height_fdp;
            if (_width < 60) _width = 60;
        }

        return {
            width: _width + 'px',
            left: _left + 'px',
            top: duty.top + 'px',
            height: dheight + 'px'
        };
    };
    $scope.getDateCellStyle = function () {

        return {
            width: date_cell_width + 'px'
        }
    };
    $scope.getDateBarStyle = function () {
        var _width = $scope.ganttData && $scope.ganttData.dates ? $scope.ganttData.dates.length * date_cell_width : 1000;
        return {
            width: _width + 'px'
        }
    };
    //2023
    $scope.getResStyle = function (res) {
        var _width = $scope.ganttData && $scope.ganttData.dates ? $scope.ganttData.dates.length * date_cell_width : 1000;
        return {
            width: _width + 'px',
            height: (res.maxTop + duty_height + 5 ) + 'px'
        };
    };
    $scope.getResCaptionStyle = function (res) {
        return {
            lineHeight: (res.maxTop + duty_height-30) + 'px'
        };
    }
    $scope.getCellId = function (res, dt) {
        var dt_str = moment(new Date(dt.date)).format('YYYY-MM-DD');
        return res.CrewId + '_' + dt_str;
    };
    $scope.getCellDutyId = function (dty) {
        var dt_str = dty.CrewId + '_' + dty.Id;
        return dt_str;
    };
    $scope.prepare_gantt();



    $scope.btn_add = {
        text: 'add',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.popup_flt_visible = true;
            return;
            alert($scope.ganttData.resources[0].maxTop);
            $scope.ganttData.resources[0].duties.push({
                caption: 'OFFICE',
                InitStart: new Date(2023, 2, 4, 8, 0, 0),
                InitEnd: new Date(2023, 2, 4, 12, 0, 0),
                InitRestTo: new Date(2023, 2, 4, 12, 0, 0),
            });
            $.each($scope.ganttData.resources[0].duties, function (_j, _f) {
                _f.top = null;
            });
            $scope.setTopDuty($scope.ganttData.resources[0].duties);
            $scope.ganttData.resources[0].maxTop = Enumerable.From($scope.ganttData.resources[0].duties).Select('Number($.top)').Max();

        }

    };
    $scope.getDuties = function (df, dt, callback) {
        var _code = '';
        switch ($scope.rank) {
            case 'IP,P1':
                _code = 1;
                break;
            case 'P1':
                _code = 2;
                break;
            case 'P2':
                _code = 3;
                break;
            case 'TRE':
                _code = 4;
                break;
            case 'TRI':
                _code = 5;
                break;
            case 'ISCCM,SCCM':
                _code = 6;
                break;
            case 'ISCCM':
                _code = 7;
                break;
            case 'SCCM':
                _code = 8;
                break;
            case 'CCM':
                _code = 9;
                break;
            case 'COCKPIT':
                _code = 10;
                break;
            case 'CABIN':
                _code = 11;
                break;
            default:
                break;
        }
        $scope.loadingVisible = true;
        schedulingService.getDutiesForGanttByDateNew(df, dt, _code).then(function (response) {

            $scope.loadingVisible = false;
            $.each(response, function (_i, _c) {
                $.each(_c.Items, function (_j, _d) {

                    var offset1 = -1 * (new Date(_d.InitStart)).getTimezoneOffset();
                    _d.InitStart = (new Date(_d.InitStart)).addMinutes(offset1);

                    var offset2 = -1 * (new Date(_d.InitEnd)).getTimezoneOffset();
                    _d.InitEnd = (new Date(_d.InitEnd)).addMinutes(offset2);

                    var offset3 = -1 * (new Date(_d.InitRestTo)).getTimezoneOffset();
                    _d.InitRestTo = (new Date(_d.InitRestTo)).addMinutes(offset3);
                });


            });
            if (callback) {
                callback(response);
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };


    $scope.getAllFlightTime = function (df, dt, callback) {
        var _code = '';
        switch ($scope.rank) {
            case 'IP,P1':
                _code = 1;
                break;
            case 'P1':
                _code = 2;
                break;
            case 'P2':
                _code = 3;
                break;
            case 'TRE':
                _code = 4;
                break;
            case 'TRI':
                _code = 5;
                break;
            case 'ISCCM,SCCM':
                _code = 6;
                break;
            case 'ISCCM':
                _code = 7;
                break;
            case 'SCCM':
                _code = 8;
                break;
            case 'CCM':
                _code = 9;
                break;
            case 'COCKPIT':
                _code = 10;
                break;
            case 'CABIN':
                _code = 11;
                break;
            default:
                break;
        }
        
        schedulingService.getCrewFlightTime(_code,df, dt).then(function (response) {

            console.log('FLIGHT TIME', response);
            //$.each(response, function (_i, _c) {
            //    $.each(_c.Items, function (_j, _d) {

            //        var offset1 = -1 * (new Date(_d.InitStart)).getTimezoneOffset();
            //        _d.InitStart = (new Date(_d.InitStart)).addMinutes(offset1);

            //        var offset2 = -1 * (new Date(_d.InitEnd)).getTimezoneOffset();
            //        _d.InitEnd = (new Date(_d.InitEnd)).addMinutes(offset2);

            //        var offset3 = -1 * (new Date(_d.InitRestTo)).getTimezoneOffset();
            //        _d.InitRestTo = (new Date(_d.InitRestTo)).addMinutes(offset3);
            //    });


            //});
             if (callback) {
                 callback(response);
             }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    }



    $scope.getHomeBase = function (dty) {
        var cl = 'black';
        if (dty.OutOfHomeBase)
            cl = 'black';
        return { color: cl };
    };
    $scope.getCrew = function (callback) {


        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');


        $scope.loadingVisible = true;
        // schedulingService.getCrewForRosterByDateNew(1, _dt).then(function (response) {
        var _code = '';
        switch ($scope.rank) {
            case 'IP,P1':
                _code = 1;
                break;
            case 'P1':
                _code = 2;
                break;
            case 'P2':
                _code = 3;
                break;
            case 'TRE':
                _code = 4;
                break;
            case 'TRI':
                _code = 5;
                break;
            case 'ISCCM,SCCM':
                _code = 6;
                break;
            case 'ISCCM':
                _code = 7;
                break;
            case 'SCCM':
                _code = 8;
                break;
            case 'CCM':
                _code = 9;
                break;
            case 'COCKPIT':
                _code = 10;
                break;
            case 'CABIN':
                _code = 11;
                break;
            default:
                break;
        }
        schedulingService.getCrewForGanttByDateNew(_code, '', _dt).then(function (response) {

            $scope.loadingVisible = false;

            //$scope.ds_crew = response;

            //if ($scope.IsCabin && $scope.IsCockpit) {
            //    $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).ToArray();
            //}
            //if ($scope.IsCockpit) {
            //    $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).Where('$.JobGroupCode.startsWith("00101")').ToArray();
            //}
            //if ($scope.IsCabin) {
            //    $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).Where('$.JobGroupCode.startsWith("00102")').ToArray();
            //}

            ////$scope.updateFlightsDsInit();
            //$.each($scope.ds_crew, function (_i, crw) {
            //    crw._OrderIndex = $scope.getCrewOrderIndex(crw.JobGroup);
            //    //var _cflts = $scope.getCrewFlightsObj(crw.Id);
            //    var _cfltsSum = 0;//Enumerable.From(_cflts).Sum('$.FlightTime');


            //    crw.isFtl = false;
            //    crw.CurrentFlightsTime = _cfltsSum;

            //    crw.RosterFlights = crw.Flight28 + _cfltsSum;
            //    crw.RosterFlightsStr = $scope.formatMinutes(crw.RosterFlights);



            //});




            //$scope.crewDuties = [];

            if (callback) {
                callback(response);
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////
    $scope.getDaysDiff = function (d1, d2) {
        var date1 = new Date(General.getDayFirstHour(d1));
        var date2 = new Date(General.getDayLastHour(d2));

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days;
    };
    $scope.getDaysDiffMoment = function (dt1, dt2) {
        var date1 = moment(dt1); // create a moment object for the first date
        var date2 = moment(dt2); // create a moment object for the second date
        var days = date1.diff(date2, 'days');
        return days;
    }

    ////PROFILE /////////////////////////////////
    $scope.popup_profile_visible = false;
    $scope.popup_profile_title = 'Profile';

    $scope.scroll_profile_height = $(window).height() - 100 - 180;
    $scope.scroll_profile = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_profile_height', }
    };

    $scope.popup_profile = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cduties"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 100,
        width: 1100,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        title: 'Profile',
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_profile_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            $scope.dt_dty_to = new Date($scope.selectedDate);
            $scope.dt_dty_from = (new Date($scope.selectedDate)).addDays(-28);
            $scope.selectedTabProfileIndex = 0;
            $scope.bindExceed();
            if ($scope.dg_cer_instance)
                $scope.dg_cer_instance.refresh();
            if ($scope.dg_pdty_instance)
                $scope.dg_pdty_instance.refresh();
            if ($scope.chart_bl_instance)
                $scope.chart_bl_instance.render();
            if ($scope.chart_cnt_instance)
                $scope.chart_cnt_instance.render();
            if ($scope.chart_fltratio_instance)
                $scope.chart_fltratio_instance.render();

            $scope.bindFTL();

        },
        onHiding: function () {
            $scope.ds_exceed = [];
            $scope.ds_profile_duties = [];
            $scope.bl_year = null;
            $scope.data_bl = [];
            $scope.dt_ftl = null;
            $scope.data_ftl = null;
            $scope.Duties7 = [];
            $scope.DutyColors7 = [];
            $scope.Duties14 = [];
            $scope.DutyColors14 = [];
            $scope.Duties28 = [];
            $scope.DutyColors28 = [];

            $scope.Flights28 = [];
            $scope.FlightColors28 = [];
            $scope.FlightsYear = [];
            $scope.FlightColorsYear = [];
            $scope.FlightsCYear = [];
            $scope.FlightColorsCYear = [];
            $scope.popup_profile_visible = false;

        },
        bindingOptions: {
            visible: 'popup_profile_visible',


        }
    };
    $scope.tabsprofile = [
        { text: "Certificates/Licences", id: 'profilemain', visible_btn: false },
        { text: "FTL", id: 'profileftl', visible_btn: false },
        { text: "Flights", id: 'profileflights', visible_btn: false },
        { text: "Duties", id: 'profileduties', visible_btn: false },



    ];
    $scope.selectedTabProfileIndex = -1;
    $scope.$watch("selectedTabProfileIndex", function (newValue) {

        try {

            $scope.selectedTabProfile = $scope.tabsprofile[newValue];
            $('.tabprofile').hide();
            $('.' + $scope.selectedTabProfile.id).fadeIn(100, function () {

                if ($scope.chart_bl_instance)
                    $scope.chart_bl_instance.render();
                if ($scope.chart_cnt_instance)
                    $scope.chart_cnt_instance.render();
                if ($scope.chart_fltratio_instance)
                    $scope.chart_fltratio_instance.render();
            });
            if ($scope.selectedTabProfile.id == 'profileftl' && !$scope.dt_ftl)
                $scope.dt_ftl = new Date($scope.selectedDate);
            if ($scope.selectedTabProfile.id == 'profileflights' && !$scope.bl_year)
                $scope.bl_year = Number(moment(new Date()).format('YYYY'));
            if ($scope.dg_cer_instance)
                $scope.dg_cer_instance.repaint();



        }
        catch (e) {

        }

    });
    $scope.tabs_profile = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabsprofile", deep: true },
            selectedIndex: 'selectedTabProfileIndex'
        }

    };

    $scope.profile = { certificates: [] };
    $scope.profile_crew = null;
    $scope.bind_profile_cer = function () {
        $scope.profile.certificates = Enumerable.From($scope.getCrewCerStatus($scope.profile_crew, $scope.dt_ftl).certificates).OrderBy('$.remain').ToArray();
    };
    $scope.showProfile2 = function () {
        //console.log($scope.selected_crew);
        //Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault()
        $scope.showProfile($scope.selected_crew.item, $scope.contextMenuCellData.startDate);
    }
    $scope.showProfileContextMenu = function (id) {
        //console.log($scope.selected_crew);
        var c=Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault()
        $scope.showProfile(c.item, $scope.contextMenuCellData.startDate);
    }
    $scope.showProfile = function (c, dt) {

        //console.log(c);
        if (dt)
            $scope.dt_ftl = new Date(dt);
        else $scope.dt_ftl = new Date();
        $scope.profile = { certificates: [] };
        var crew = c;//Enumerable.From($scope.ds_crew).Where('$.Id==' + c.Id).FirstOrDefault();
        $scope.profile_crew = c;
        if (!crew)
            return;
        $scope.profile = JSON.parse(JSON.stringify(crew));

        $scope.bind_profile_cer();
        //$scope.profile.certificates.push({ Title: 'Flight Crew Licence', Issue: $scope.profile.LicenceIssued, Expire: $scope.profile.LicenceExpired });
        //$scope.profile.certificates.push({ Title: 'Crew Member Certificate', Issue: null, Expire: $scope.profile.CMCExpired });
        //$scope.profile.certificates.push({ Title: 'Medical', Issue: $scope.profile.MedicalIssued, Expire: $scope.profile.MedicalExpired });


        //$scope.profile.certificates.push({ Title: 'SEPT Theoretical', Issue: $scope.profile.SEPTIssued, Expire: $scope.profile.SEPTExpired });
        //$scope.profile.certificates.push({ Title: 'SEPT Practical', Issue: $scope.profile.SEPTPIssued, Expire: $scope.profile.SEPTPExpired });

        //$scope.profile.certificates.push({ Title: 'Dangerous Goods', Issue: $scope.profile.DGIssued, Expire: $scope.profile.DGExpired });
        //$scope.profile.certificates.push({ Title: 'CRM', Issue: $scope.profile.CRMIssued, Expire: $scope.profile.CRMExpired });
        //$scope.profile.certificates.push({ Title: 'CCRM', Issue: $scope.profile.CCRMIssued, Expire: $scope.profile.CCRMExpired });

        //$scope.profile.certificates.push({ Title: 'SMS', Issue: $scope.profile.SMSIssued, Expire: $scope.profile.SMSExpired });
        //$scope.profile.certificates.push({ Title: 'Aviation Security', Issue: $scope.profile.AvSecIssued, Expire: $scope.profile.AvSecExpired });
        ////cockpit
        //if (crew.JobGroupCode.startsWith('00101')) {
        //    if (crew.JobGroupCode == '0010103' || crew.JobGroupCode == '0010104') {
        //        $scope.profile.certificates.push({ Title: 'TRE', Issue: null, Expire: $scope.profile.TREExpired });
        //        $scope.profile.certificates.push({ Title: 'TRI', Issue: null, Expire: $scope.profile.TRIExpired });
        //    }
        //    $scope.profile.certificates.push({ Title: 'Skill Test/Proficiency LPC', Issue: $scope.profile.LPCIssued, Expire: $scope.profile.LPCExpired });
        //    $scope.profile.certificates.push({ Title: 'Skill Test/Proficiency OPC', Issue: $scope.profile.OPCIssued, Expire: $scope.profile.OPCExpired });
        //    //ICAO LPR
        //    $scope.profile.certificates.push({ Title: 'ICAO LPR', Issue: null, Expire: $scope.profile.LPRExpired });
        //    //Cold Weather Operation
        //    $scope.profile.certificates.push({ Title: 'Cold Weather Operation', Issue: $scope.profile.ColdWXIssued, Expire: $scope.profile.ColdWXExpired });
        //    //Hot Weather Operation
        //    $scope.profile.certificates.push({ Title: 'Hot Weather Operation', Issue: $scope.profile.HotWXIssued, Expire: $scope.profile.HotWXExpired });
        //    //Line Check 
        //    $scope.profile.certificates.push({ Title: 'Line Check', Issue: $scope.profile.LineIssued, Expire: $scope.profile.LineExpired });
        //}
        //else {
        //    //Recurrent Training
        //    $scope.profile.certificates.push({ Title: 'Recurrent Training', Issue: $scope.profile.RecurrentIssued, Expire: $scope.profile.RecurrentExpired });
        //    //First Aid
        //    $scope.profile.certificates.push({ Title: 'First Aid', Issue: $scope.profile.FirstAidIssued, Expire: $scope.profile.FirstAidExpired });
        //}
        $scope.popup_profile_visible = true;
    };

    $scope.txt_ScheduleName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.ScheduleName',

        }
    };
    $scope.txt_Group = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.JobGroup',

        }
    };
    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.FirstName',

        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.LastName',

        }
    };
    $scope.txt_Mobile = {


        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',
        readOnly: true,
        bindingOptions: {
            value: 'profile.Mobile',

        }
    };

    $scope.dg_cer_columns = [



        { dataField: 'title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },



        // { dataField: 'Issue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd', allowEditing: false, width: 200 },
        { dataField: 'expire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd', allowEditing: false, width: 200 },
        { dataField: 'remain', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },


    ];
    $scope.dg_cer_selected = null;
    $scope.dg_cer_instance = null;
    $scope.dg_cer_ds = null;
    $scope.dg_cer = {

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

        columnAutoWidth: false,
        height: $(window).height() - 300,

        columns: $scope.dg_cer_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cer_instance)
                $scope.dg_cer_instance = e.component;

        },
        onSelectionChanged: function (e) {

        },
        onCellPrepared: function (e) {

            if (e.rowType === "data" && e.column.dataField == "remain" && !e.data.remain)
                e.cellElement.css("backgroundColor", "#ffa64d");
            else if (e.rowType === "data" && e.column.dataField == "remain" && e.data.remain < 0)
                e.cellElement.css("backgroundColor", "#ff6666");

        },

        bindingOptions: {
            dataSource: 'profile.certificates',

        }
    };




    $scope.dg_pdty_columns = [



        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },



        { dataField: 'StartLocal', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'EndLocal', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'RestToLocal', caption: 'Rest To', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'InitRoute', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 220 },
        { dataField: 'InitFlts', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'IsFDPOver', caption: 'IsOver', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'DurationDuty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DurationFDP2', caption: 'FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'MaxFDP2', caption: 'Max FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

    ];
    $scope.dg_pdty_selected = null;
    $scope.dg_pdty_instance = null;

    $scope.dg_pdty = {

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

        columnAutoWidth: false,
        height: $(window).height() - 320,

        columns: $scope.dg_pdty_columns,
        onContentReady: function (e) {
            if (!$scope.dg_pdty_instance)
                $scope.dg_pdty_instance = e.component;

        },
        onSelectionChanged: function (e) {

        },

        onCellPrepared: function (e) {

            if (e.rowType === "data" && e.column.dataField == "RestToLocal" && e.data.InteruptedId) {
                // //console.log('e.data.InteruptedId', e.data.InteruptedId);
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");
            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsFDPOver) {
                e.rowElement.css('background', '#ffcc00');

            }

        },
        bindingOptions: {
            dataSource: 'ds_profile_duties',

        }
    };

    //////////////////////////
    //mook
    $scope.dt_dty_from = null;
    $scope.date_dty_from = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width: '100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {



        },
        bindingOptions: {
            value: 'dt_from'
        }
    };
    $scope.dt_dty_to = null;
    $scope.date_dty_to = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width: '100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {



        },
        bindingOptions: {
            value: 'dt_to'
        }
    };

    $scope.btn_search_duties = {
        //text: 'Search',
        type: 'success',
        icon: 'search',
        width: 40,

        bindingOptions: {},
        onClick: function (e) {
            if (!$scope.dt_dty_to)
                return;
            if (!$scope.dt_dty_from)
                return;
            $scope.bindDuties();

        }

    };
    $scope.ds_profile_duties = [];
    $scope.bindDuties = function () {
        $scope.loadingVisible = true;

        var _df = moment($scope.dt_dty_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_dty_to).format('YYYY-MM-DD');
        schedulingService.getDutyTimeLineByCrew(_df, _dt, $scope.profile.Id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_profile_duties = response;
            $.each($scope.ds_profile_duties, function (_i, _d) {
                if (_d.DutyType == 1165) {
                    _d.MaxFDP2 = $scope.formatMinutes(_d.MaxFDP);
                    _d.DurationDuty2 = $scope.formatMinutes(_d.DurationDuty);
                    _d.DurationFDP2 = $scope.formatMinutes(_d.DurationFDP);
                }
            });
        }, function (err) { });
    };

    $scope.dtFtlGo = function (d) {
        $scope.dt_ftl = (new Date($scope.dt_ftl)).addDays(d);
    };
    $scope.dt_ftl = null;
    $scope.date_ftl = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width: '100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {

            //nook
            $scope.bind_profile_cer();
            $scope.bindFTL();
        },
        bindingOptions: {
            value: 'dt_ftl'
        }
    };
    $scope.bl_year = null;
    $scope.sb_year = {
        // openOnFieldClick: false,
        // showDropDownButton: false,
        showClearButton: false,
        searchEnabled: false,

        onSelectionChanged: function (arg) {


            $scope.bindBL();
        },
        dataSource: [2019, 2020, 2021, 2022],
        bindingOptions: {
            value: 'bl_year',


        }
    };

    $scope.dt_bl = null;

    $scope.date_bl = {
        displayFormat: "yyyy",
        adaptivityEnabled: true,
        type: "date",
        width: 150,
        //pickerType: "rollers",

        useMaskBehavior: true,
        calendarOptions: {
            zoomLevel: 'decade',
            minZoomLevel: 'decade',
            maxZoomLevel: 'decade',
        },
        onValueChanged: function (e) {
            var _dt = moment($scope.dt_bl).format('YYYY-MM-DDTHH:mm:ss');
            localStorageService.set('stat_bl_date', _dt);
            $scope.bindBL();
        },
        bindingOptions: {
            value: 'dt_bl'
        }
    };

    $scope.chart_bl = {
        title: {
            text: 'FLIGHT & BLOCK TIME',
            font: { color: 'gray', size: 14 },
            horizontalAlignment: 'center',
        },
        legend: {

            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#ccc', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_bl_instance)
                $scope.chart_bl_instance = e.component;
        },
        palette: "Green Mist",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return $scope.formatMinutes(this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'BlockTime', name: 'Block', },
            { valueField: 'FlightTime', name: 'Flight', },
        ],


        tooltip: {
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 350,

        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };

    $scope.chart_cnt = {
        title: {
            text: 'TOTAL NUMBER OF FLIGHTS',
            font: { color: 'gray', size: 14 },
            horizontalAlignment: 'center',
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#eeeeee', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_cnt_instance)
                $scope.chart_cnt_instance = e.component;
        },
        palette: "Soft Blue",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return (this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'Flights', name: 'Sectors', },

        ],


        tooltip: {
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 350,
        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };


    $scope.chart_fltratio = {
        title: {
            text: 'FLIGHT TIME / TOTAL NUMBER OF FLIGHTS (mm)',
            font: { color: 'gray', size: 14 },
            horizontalAlignment: 'center',
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#eeeeee', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_fltratio_instance)
                $scope.chart_fltratio_instance = e.component;
        },
        palette: "Harmony Light",

        commonSeriesSettings: {
            type: "spline",
            width: 4,
            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return $scope.formatMinutes(this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'FLTRatio', name: 'Ratio', },

        ],


        tooltip: {
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            valueType: "numeric",
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 350,
        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };


    $scope.data_bl = null;
    $scope.bindBL = function () {
        if (!$scope.bl_year)
            return;
        $scope.loadingVisible = true;

        schedulingService.getFlightTimeYear($scope.profile.Id, /*moment($scope.dt_bl).format('YYYY')*/$scope.bl_year).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                if (!_d.FlightTime)
                    _d.FLTRatio = 0;
                else
                    _d.FLTRatio = ((_d.FlightTime * 1.0) / _d.Flights).toFixed();
            });
            $scope.data_bl = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.duty7Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 60,
        size: { height: 200 },
        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties7[arg.index];
                var dp = Number((dvalue * 100.0) / 60).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "7 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties7',
            palette: 'DutyColors7',
        }
    };
    $scope.duty14Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 110,
        size: { height: 200 },
        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties14[arg.index];
                var dp = Number((dvalue * 100.0) / 110).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "14 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties14',
            palette: 'DutyColors14',
        }
    };
    $scope.duty28Gauge = {
        barSpacing: 4,
        size: { height: 200 },
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 190,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties28[arg.index];
                var dp = Number((dvalue * 100.0) / 190).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "28 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties28',
            palette: 'DutyColors28',
        }
    };



    $scope.flight28Gauge = {
        barSpacing: 4,
        size: { height: 200 },
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 100,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Flights28[arg.index];
                var dp = Number((dvalue * 100.0) / 100).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "28 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Flights28',
            palette: 'FlightColors28',
        }
    };
    $scope.flightYearGauge = {
        barSpacing: 4,
        size: { height: 200 },
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 1000,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.FlightsYear[arg.index];
                var dp = Number((dvalue * 100.0) / 1000).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "12 Consecutive Months",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'FlightsYear',
            palette: 'FlightColorsYear',
        }
    };
    $scope.flightCYearGauge = {
        barSpacing: 4,
        size: { height: 200 },
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 900,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.FlightsCYear[arg.index];
                var dp = Number((dvalue * 100.0) / 900).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "Calendar Year",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'FlightsCYear',
            palette: 'FlightColorsCYear',
        }
    };


    $scope.barGaugeOptions = {
        size: { height: 500, width: 500 },
        startValue: 0,
        endValue: 200,
        values: [121.4, 135.4, 115.9, 141.1, 127.5],
        label: { visible: false },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: getText(arg, arg.valueText),
                };
            },
        },
        export: {
            enabled: true,
        },
        title: {
            text: 'Average Speed by Racer',
            font: {
                size: 28,
            },
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            customizeText(arg) {
                return getText(arg.item, arg.text);
            },
        },
    };

    function getText(item, text) {
        return `Racer ${item.index + 1} - ${text} km/h`;
    }



    ////////////////////////////////////
    $scope.getCrewCerStatus = function (c, dt) {
        var item = c.item ? c.item : c;
        ////console.log(item);
        var _dt = dt.date ? new Date(dt.date) : new Date(dt);
        var result = { expired: [], certificates: [] };


        result.RemainMedical = !item.MedicalExpired ? null : $scope.getDaysDiffMoment(new Date(item.MedicalExpired), _dt);
        result.certificates.push({ title: 'Medical', expire: item.MedicalExpired, remain: result.RemainMedical });
        if (result.RemainMedical < 0)
            result.expired.push({ title: 'Medical', date: item.MedicalExpired, remain: result.RemainMedical });
        //_d.RemainCMC = !_d.CMCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CMCExpired));
        result.RemainCMC = !item.CMCExpired ? null : $scope.getDaysDiffMoment(new Date(item.CMCExpired), _dt);
        result.certificates.push({ title: 'CMC', expire: item.CMCExpired, remain: result.RemainCMC });
        if (result.RemainCMC < 0)
            result.expired.push({ title: 'CMC', date: item.CMCExpired, remain: result.RemainCMC });


        //_d.RemainSEPT = !_d.SEPTExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SEPTExpired));
        result.RemainSEPT = !item.SEPTExpired ? null : $scope.getDaysDiffMoment(new Date(item.SEPTExpired), _dt);
        result.certificates.push({ title: 'SEPT', expire: item.SEPTExpired, remain: result.RemainSEPT });
        if (result.RemainSEPT < 0)
            result.expired.push({ title: 'SEPT', date: item.SEPTExpired, remain: result.RemainSEPT });
        //_d.RemainDG = !_d.DGExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.DGExpired));
        result.RemainDG = !item.DGExpired ? null : $scope.getDaysDiffMoment(new Date(item.DGExpired), _dt);
        result.certificates.push({ title: 'DG', expire: item.DGExpired, remain: result.RemainDG });
        if (result.RemainDG < 0)
            result.expired.push({ title: 'DG', date: item.DGExpired, remain: result.RemainDG });
        //_d.RemainCCRM = !_d.CCRMExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CCRMExpired));
        result.RemainCCRM = !item.CCRMExpired ? null : $scope.getDaysDiffMoment(new Date(item.CCRMExpired), _dt);
        result.certificates.push({ title: 'CCRM', expire: item.CCRMExpired, remain: result.RemainCCRM });
        if (result.RemainCCRM < 0)
            result.expired.push({ title: 'CCRM', date: item.CCRMExpired, remain: result.RemainCCRM });
        //_d.RemainSMS = !_d.SMSExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SMSExpired));
        result.RemainSMS = !item.SMSExpired ? null : $scope.getDaysDiffMoment(new Date(item.SMSExpired), _dt);
        result.certificates.push({ title: 'SMS', expire: item.SMSExpired, remain: result.RemainSMS });
        if (result.RemainSMS < 0)
            result.expired.push({ title: 'SMS', date: item.SMSExpired, remain: result.RemainSMS });
        //_d.RemainAvSec = !_d.AvSecExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.AvSecExpired));
        result.RemainAvSec = !item.AvSecExpired ? null : $scope.getDaysDiffMoment(new Date(item.AvSecExpired), _dt);
        result.certificates.push({ title: 'AVSEC', expire: item.AvSecExpired, remain: result.RemainAvSec });
        if (result.RemainAvSec < 0)
            result.expired.push({ title: 'AVSEC', date: item.AvSecExpired, remain: result.RemainAvSec });

        if (item.IsCockpit) {
            //_d.RemainLPC = !_d.LPCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPCExpired));
            result.RemainLPC = !item.LPCExpired ? null : $scope.getDaysDiffMoment(new Date(item.LPCExpired), _dt);
            result.certificates.push({ title: 'LPC', expire: item.LPCExpired, remain: result.RemainLPC });
            if (result.RemainLPC < 0)
                result.expired.push({ title: 'LPC', date: item.LPCExpired, remain: result.RemainLPC });
            //_d.RemainLPR = !_d.LPRExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPRExpired));
            result.RemainLPR = !item.LPRExpired ? null : $scope.getDaysDiffMoment(new Date(item.LPRExpired), _dt);
            result.certificates.push({ title: 'LPR', expire: item.LPRExpired, remain: result.RemainLPR });
            if (result.RemainLPR < 0)
                result.expired.push({ title: 'LPR', date: item.LPRExpired, remain: result.RemainLPR });
            //_d.RemainLicence = !_d.LicenceExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LicenceExpired));
            result.RemainLicence = !item.LicenceExpired ? null : $scope.getDaysDiffMoment(new Date(item.LicenceExpired), _dt);
            result.certificates.push({ title: 'LICENCE', expire: item.LicenceExpired, remain: result.RemainLicence });
            if (result.RemainLicence < 0)
                result.expired.push({ title: 'Licence', date: item.LicenceExpired, remain: result.RemainLicence });

            //_d.RemainOPC = !_d.OPCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.OPCExpired));
            result.RemainOPC = !item.OPCExpired ? null : $scope.getDaysDiffMoment(new Date(item.OPCExpired), _dt);
            result.certificates.push({ title: 'OPC', expire: item.OPCExpired, remain: result.RemainOPC });
            if (result.RemainOPC < 0)
                result.expired.push({ title: 'OPC', date: item.OPCExpired, remain: result.RemainOPC });
            //_d.RemainLine = !_d.LineExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LineExpired));
            result.RemainLine = !item.LineExpired ? null : $scope.getDaysDiffMoment(new Date(item.LineExpired), _dt);
            result.certificates.push({ title: 'LINE', expire: item.LineExpired, remain: result.RemainLine });
            if (result.RemainLine < 0)
                result.expired.push({ title: 'LINE', date: item.LineExpired, remain: result.RemainLine });
            //_d.RemainColdWx = !_d.ColdWXExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.ColdWXExpired));
            result.RemainColdWx = !item.ColdWXExpired ? null : $scope.getDaysDiffMoment(new Date(item.ColdWXExpired), _dt);
            result.certificates.push({ title: 'COLD-WX', expire: item.ColdWXExpired, remain: result.RemainColdWx });
            if (result.RemainColdWx < 0)
                result.expired.push({ title: 'COLD-WX', date: item.ColdWXExpired, remain: result.RemainFirstAid });
            //_d.RemainHotWx = !_d.HotWXExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.HotWXExpired));
            result.RemainHotWx = !item.HotWXExpired ? null : $scope.getDaysDiffMoment(new Date(item.HotWXExpired), _dt);
            result.certificates.push({ title: 'HOT-WX', expire: item.HotWXExpired, remain: result.RemainHotWx });
            if (result.RemainHotWx < 0)
                result.expired.push({ title: 'HOT-WX', date: item.HotWXExpired, remain: result.RemainHotWx });
        }
        if (item.IsCabin) {
            //_d.RemainFirstAid = !_d.FirstAidExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.FirstAidExpired));
            result.RemainFirstAid = !item.FirstAidExpired ? null : $scope.getDaysDiffMoment(new Date(item.FirstAidExpired), _dt);
            result.certificates.push({ title: 'FIRSTAID', expire: item.FirstAidExpired, remain: result.RemainFirstAid });
            if (result.RemainFirstAid < 0)
                result.expired.push({ title: 'FIRSTAID', date: item.FirstAidExpired, remain: result.RemainFirstAid });
            //_d.RemainRecurrent = !_d.RecurrentExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.RecurrentExpired));
            result.RemainRecurrent = !item.RecurrentExpired ? null : $scope.getDaysDiffMoment(new Date(item.RecurrentExpired), _dt);
            result.certificates.push({ title: 'RECURRENT', expire: item.RecurrentExpired, remain: result.RemainRecurrent });
            if (result.RemainRecurrent < 0)
                result.expired.push({ title: 'RECURRENT', date: item.RecurrentExpired, remain: result.RemainRecurrent });
            result.RemainFlightCheck = !item.TypeMDExpired ? null : $scope.getDaysDiffMoment(new Date(item.TypeMDExpired), _dt);
            result.certificates.push({ title: 'FLIGHT-CHECK', expire: item.TypeMDExpired, remain: result.RemainFlightCheck });
            if (result.RemainFlightCheck < 0)
                result.expired.push({ title: 'FLIGHT-CHECK', date: item.TypeMDExpired, remain: result.RemainFlightCheck });


            result.RemainType = !item.Type737Expired ? null : $scope.getDaysDiffMoment(new Date(item.Type737Expired), _dt);
            result.certificates.push({ title: 'TYPE', expire: item.Type737Expired, remain: result.RemainType });
            if (result.RemainType < 0)
                result.expired.push({ title: 'TYPE', date: item.Type737Expired, remain: result.RemainType });


        }

        //_d.RemainSEPTP = !_d.SEPTPExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SEPTPExpired));
        result.RemainSEPTP = !item.SEPTPExpired ? null : $scope.getDaysDiffMoment(new Date(item.SEPTPExpired), _dt);
        result.certificates.push({ title: 'SEPTP', expire: item.SEPTPExpired, remain: result.RemainSEPTP });
        if (result.RemainSEPTP < 0)
            result.expired.push({ title: 'SEPTP', date: item.SEPTPExpired, remain: result.RemainSEPTP });
        //_d.RemainCRM = !_d.CRMExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CRMExpired));
        result.RemainCRM = !item.CRMExpired ? null : $scope.getDaysDiffMoment(new Date(item.CRMExpired), _dt);
        result.certificates.push({ title: 'CRM', expire: item.CRMExpired, remain: result.RemainCRM });
        if (result.RemainCRM < 0)
            result.expired.push({ title: 'CRM', date: item.CRMExpired, remain: result.RemainCRM });



        //_d.RemainFirstAid = !_d.FirstAidExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.FirstAidExpired));
        result.RemainPassport = !item.PassportExpired ? null : $scope.getDaysDiffMoment(new Date(item.PassportExpired), _dt);
        result.certificates.push({ title: 'PASSPORT', expire: item.PassportExpired, remain: result.RemainPassport });
        if (result.RemainPassport < 0)
            result.expired.push({ title: 'PASSPORT', date: item.PassportExpired, remain: result.RemainPassport });




        result.IsExpired = result.expired.length > 0;
        return result;
    };


    $scope.timeline_data = null;
    $scope.bindDutyTimeLine = function (callback) {

        $scope.days_count = 31;
        $scope.baseDate = (new Date(Date.now())).toUTCString();
        dfrom = new Date($scope.dt_from);
        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));

        $scope.dateEnd = General.getDayLastHour(new Date($scope.dt_to));

        // $scope.dt_fromSearched = new Date($scope.datefrom);
        // $scope.dt_toSearched = new Date($scope.dateEnd);

        $scope.btnGanttDisabled = false;
        var now = new Date();

        $scope.flightsRendered = 0;

        $scope.midnightLines = [];
        $scope.doUtcEnabled = true;
        var xs = 0;


        $scope.selectedFlights = [];


        //xati
        $scope.selectedTabDateIndex = -1;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.totalHeight = 0;
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');



        ///////////////////////////
        $scope.ganttData = {};
        $scope.totalHeight = 0;
        $scope.getCrew(function (crews) {
            //nool
            $scope.getDuties(_df, _dt, function (dts) {
                $scope.duties = dts;
                crews.duties = [];

                $.each(crews, function (_i, _d) {
                    // _d._IsCockpit = ['TRE', 'TRI', 'LTC', 'SFE', 'SFI', 'P1', 'P2'].indexOf(_d.JobGroup) != -1;
                    // _d._IsCockpit = ['TRE', 'TRI', 'LTC', 'SFE', 'SFI', 'P1', 'P2'].indexOf(_d.JobGroup) != -1;
                    _d.dates = [];
                    var cdts = Enumerable.From(dts).Where('$.CrewId==' + _d.CrewId).FirstOrDefault();
                    if (cdts)

                        _d.duties = cdts.Items;
                    else
                        _d.duties = [];

                    ////////////////////////////
                    //if (_i == 0) {
                    //    crews[0].duties.push({
                    //        caption: 'DUTY',
                    //        InitStart: new Date(2023, 2, 3, 6, 0, 0),
                    //        InitEnd: new Date(2023, 2, 8, 15, 0, 0),
                    //        InitRestTo: new Date(2023, 2, 8, 15, 0, 0),
                    //    });


                    //    crews[0].duties.push({
                    //        caption: 'FDP',
                    //        InitStart: new Date(2023, 2, 4, 10, 0, 0),
                    //        InitEnd: new Date(2023, 2, 4, 19, 0, 0),
                    //        InitRestTo: new Date(2023, 2, 7, 3, 0, 0),
                    //    });

                    //    //crews[0].duties.push({
                    //    //    caption: 'OFFICE',
                    //    //    InitStart: new Date(2023, 2, 4, 8, 0, 0),
                    //    //    InitEnd: new Date(2023, 2, 4, 12, 0, 0),
                    //    //    InitRestTo: new Date(2023, 2, 4, 12, 0, 0),
                    //    //});
                    //}

                    //if (_i == 1)
                    //    crews[1].duties.push({
                    //        caption: 'FDP',
                    //        InitStart: new Date(2023, 2, 3, 12, 0, 0),
                    //        InitEnd: new Date(2023, 2, 3, 18, 0, 0),
                    //        InitRestTo: new Date(2023, 2, 4, 6, 0, 0),
                    //    });

                    /////////////////////////////

                    if (_d.duties && _d.duties.length > 0) {
                        // _d.flights = Enumerable.From(crews.duties).Where('$.CrewId==' + _d.CrewId).ToArray();

                        $scope.setTopDuty(_d.duties);
                        _d.maxTop = Enumerable.From(_d.duties).Select('Number($.top)').Max();
                    }
                    else
                        _d.maxTop = 0;

                    $scope.totalHeight += _d.maxTop;


                });

                $scope.crews = crews;
                $scope.ganttData.resources = crews;
                $scope.ganttData.dates = [];
                var tempDate = new Date(dfrom);
                var i = 1;
                while (new Date(tempDate) <= new Date($scope.dt_to)) {
                    $scope.ganttData.dates.push({
                        date: new Date(tempDate),
                        caption:   moment(tempDate).format("MMM-DD"),
                        day: moment(tempDate).format("ddd"),
                        pdate: new persianDate(tempDate).format("MM-DD"),
                    });
                    $.each($scope.crews, function (_j, _c) {
                        _c.dates.push({
                            date: new Date(tempDate),
                            caption: moment(tempDate).format("MMM-DD")
                        });
                    });
                    tempDate = tempDate.addDays(1);
                    i++;
                }




                //console.log($scope.ganttData);
                callback();
            });

            $scope.getAllFlightTime(_df, _dt, function (dstime) {
                $.each($scope.crews, function (_i, _d) {
                    var _cr = Enumerable.From(dstime).Where('$.CrewId==' + _d.id).FirstOrDefault();
                    if (_cr) {
                        _d.FX = _cr.FixTime;
                        _d.BL = _cr.JLBlockTime;
                        _d.FL = _cr.JLFlightTime;
                    }
                    else {
                        _d.FX = 0;
                        _d.BL = 0;
                        _d.FL = 0;
                    }
                });

                console.log('FSDFSDFSDFSDFSD', $scope.crews);
            });





        });



        return;

        $scope.loadingVisible = true;


        flightService.getDutyTimeLine(_df, _dt, $scope.rank, -1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.tabsdatefirst = true;
            $scope.tabs_date = [];
            var i = 1;
            var stdate = (dfrom);
            //for (i = 1; i <=  $scope.days_count  ; i++) {

            while (new Date(stdate) <= new Date($scope.dt_to)) {
                var str = moment(stdate).format("ddd DD-MMM-YYYY");
                $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                stdate = stdate.addDays(1);
                i++;
            }
            $scope.tabsdatevisible = true;

            $.each(response.duties, function (_i, _q) {
                _q.STD = moment(_q.StartLocal);
                if (_q.RestToLocal)
                    _q.STA = moment(_q.RestToLocal);
                else
                    _q.STA = moment(_q.EndLocal);

                _q.ChocksOut = moment(_q.EndLocal);
            });
            response.flights = Enumerable.From(response.duties).ToArray();

            $scope.timeline_data = response;

            $scope.tlRes = Enumerable.From(response.resources).ToArray();
            //$scope.tlGroup = Enumerable.From(response.resources).ToArray();

            $.each(response.resources, function (_i, _d) {
                _d.flights = Enumerable.From(response.duties).Where('$.CrewId==' + _d.CrewId).ToArray();
                //$.each(_d.flights, function (_j, _q) {
                //    _q.STD = moment(_q.StartLocal);
                //    _q.STA = moment(_q.EndLocal);
                //});
                $scope.setTop(_d.flights);
                _d.maxTop = Enumerable.From(_d.flights).Select('Number($.top)').Max();
                $scope.totalHeight += _d.maxTop;


            });


            //console.log($scope.timeline_data);
            $scope.ganttData = response;
            $scope.ati_flights = $scope.ganttData.flights;

            callback();


        }, function (err) { });

    };

    $scope.getTime = function (dt) {
        // dt = new Date(dt);
        // var offset = -1 * (dt).getTimezoneOffset();
        //var dt1 = (dt).addMinutes(offset)
        return moment(new Date(dt)).format('HHmm');
    };
    $scope.getDutyTitle = function (dty) {
        var id = dty.DutyType;
        switch (id) {
            case 100000:
                return "GRND";
            case 100001:
                return "MTG";
            case 100002:
                return "SICK";
            case 100003:
                return "SIM";
            case 100004:
                return "EXP LIC";
            case 100005:
                return "EXP MED";
            case 100006:
                return "EXP PASS";
            case 100007:
                return "NO FLT";
            case 100008:
                return "REQ OFF";
            case 100009:
                return "REFUSE";
            case 1169:
                return "VAC";
            case 1170:
                return "RES";
            //2020-10-27
            case 100025:
                return "MSN";
            case 300008:
                return "DTY";
            case 300009:
                return "RST";
            //lay
            case 300010:
                return "O/A STB";
            case 5000:
                return "TRN";
            case 5001:
                return "OFC";
            case 10000:
                return "RERRP";
            case 1166:
                return "OFF";

            case 1168:
                return "STBA";
            case 1167:
                return "STBP";
            case 300013:
                return "STBC";
            case 300014:
                return "BRF";

            default:
                return dty.DutyTypeTitle;
        }
    }

    $scope.getDutyClass = function (duty) {
        var str = '';
        if (duty.DutyType == 1165 && duty.OutOfHomeBase)
            str += "-oh";
        return 'obj-duty duty-' + duty.DutyType+str;
    }

    $scope.bindFlights = function (callback) {
        $scope.baseDate = (new Date(Date.now())).toUTCString();
        dfrom = $scope._datefrom;
        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
        $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));

        $scope.dt_fromSearched = new Date($scope.datefrom);
        $scope.dt_toSearched = new Date($scope.dateEnd);

        $scope.btnGanttDisabled = false;
        var now = new Date();
        if (now >= $scope.datefrom && now <= $scope.dateEnd)
            $scope.IsNowLine = true;
        else
            $scope.IsNowLine = false;
        $scope.flightsRendered = 0;

        $scope.midnightLines = [];
        $scope.doUtcEnabled = true;
        var xs = 0;

        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo,


        };

        $scope.selectedFlights = [];


        //xati
        $scope.selectedTabDateIndex = -1;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.totalHeight = 0;
        $scope.loadingVisible = true;
        var ed = (new Date($scope.dateEnd)).toUTCDateTimeDigits(); //(new Date($scope.dateto)).toUTCDateTimeDigits();
        //flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, offset, /*($scope.IsAdmin ? null : $scope.airportEntity.Id)*/-1, 0, filter).then(function (response) {
        flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, offset, null, filter).then(function (response) {
            try {
                $scope.loadingVisible = false;
                $scope.tabsdatefirst = true;
                $scope.tabs_date = [];
                var i;
                var stdate = new Date($scope.datefrom);
                for (i = 1; i <= $scope.days_count; i++) {
                    var str = moment(stdate).format("ddd DD-MMM-YYYY");
                    $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                    stdate = stdate.addDays(1);

                }
                $scope.tabsdatevisible = true;


                $.each(response.resources, function (_i, _d) {
                    _d.text = _d.resourceName;
                    var flights = Enumerable.From(response.flights).Where('$.RegisterID==' + _d.resourceId)
                        .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                        .ToArray();


                    $.each(flights, function (_j, _q) {

                        _q.STD = moment(_q.STD);
                        _q.STA = moment(_q.STA);

                        //if (_q.ChocksIn)
                        //    _q.ChocksIn = moment(_q.ChocksIn);
                        //if (_q.ChocksOut)
                        //    _q.ChocksOut = moment(_q.ChocksOut);


                        //if (!_q.ChocksIn)
                        //    _q.ChocksIn = new Date(_q.STA);
                        //if (!_q.ChocksOut)
                        //    _q.ChocksOut = new Date(_q.STD);



                    });
                    $scope.setTop(flights);
                    _d.maxTop = Enumerable.From(flights).Select('Number($.top)').Max();
                    $scope.totalHeight += _d.maxTop;
                    _d.flights = flights;
                });

                //5-17
                response.resources = Enumerable.From(response.resources).OrderBy(function (x) { return $scope.getResOrderIndex(x.resourceName); }).ToArray();


                $scope.ganttData = response;
                $scope.ati_flights = $scope.ganttData.flights;
                //console.log('gantt', $scope.ganttData);
                callback();
            }
            catch (ex) {
                alert('error3');
                alert(ex);
            }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.utimer = null;
    $scope.baseDate = null;


    $scope.finished = function () {
        $scope.flightsRendered++;
        if ($scope.flightsRendered == $scope.ganttData.flights.length) {
            $scope.refreshHeights();
            //if ($scope.IsNowLine) {
            //    $scope.autoUpdate = true;
            //    $scope.StartUTimer();

            //}
            //if ( $scope.selectedTabDateIndex =-1)
            $scope.selectedTabDateIndex = 0;

        }

        //$scope.scrollFirstFlight();
    };

    $scope.scrollTo = function (dt) {
        var _left = $scope.getDuration(new Date($scope.datefrom), dt);
        var nowleft = (_left * (hourWidth + 1)) - 1;
        $('.col-flights').scrollLeft(nowleft - 50);
        //$('.col-flights').animate({
        //    scrollLeft: nowleft-50
        //}, 500);
    };

    $scope.scrollFirstFlight = function () {
        var std = new Date($scope.ganttData.flights[0].STD);
        $scope.scrollTo(std);
    };
    $scope.scrollFirstFlightDate = function (dt) {

        var std = Enumerable.From($scope.ganttData.flights).Where(function (x) { return new Date(x.STD) >= dt; }).OrderBy(function (x) { return new Date(x.STD); }).ToArray();

        //ew Date($scope.ganttData.flights[0].STD);
        if (std && std.length > 0) {

            $scope.scrollTo(new Date(std[0].STD));
        }
        else
            $scope.scrollTo(new Date(dt));


    };

    $scope.test = function () {
        // $scope.ganttData.resources[0].flights.push($scope.ganttData.resources[1].flights[0]);
        // $scope.scrollTo(new Date());
        $scope.clearGantt();

    }
    $scope.flight = null;
    $scope.selectFlight = function (f) {
        $scope.flight = f;
        $scope.showLog();
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
    ///////////////////////////////////

    ////////////////////////////////
    $scope.FromWeatherVisible = true;
    $scope.formatCellDateDay = function (dt) {
        return moment(new Date(dt)).format('DD');
    };
    $scope.formatCellDatePersian = function (dt) {
        persianDate.toLocale('en');
        return new persianDate(new Date(dt)).format("DD-MM-YY");

    };
    $scope.moment = function (date) {
        return moment(date).format('MMMM Do YYYY');
    };
    $scope.momenttime = function (date) {
        if (!date)
            return '--';
        return moment(date).format('HHmm');
    };
    $scope.momenttimerest = function (date) {
        if (!date)
            return '--';
        return moment(date).format('MM-DD HHmm');
    };




    $scope.getFlightLength = function (fdp) {
        var total = 0;
        $.each(fdp.flights, function (_i, _d) {
            var prts = _d.split('_');
            var _std = prts[2];
            var _sta = prts[3];
            var std = $scope.StrToDate(_std);
            var sta = $scope.StrToDate(_sta);
            var diff = Math.abs(sta - std);
            total += Math.floor((diff / 1000) / 60);
        });

        return total;
    }
    //book

    ///////////////////////

    $scope.checkConflict = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.STD) >= new Date(_d.STD) && new Date(x.STD) <= new Date(_d.STA))
                    ||
                    (new Date(x.STA) >= new Date(_d.STD) && new Date(x.STA) <= new Date(_d.STA))
                );
            }).FirstOrDefault();
            if (f)
                hasConflict = true;
        });

        return hasConflict;
    };


    ////////////////////////
    $scope.ati_selectedTypes = [];
    $scope.initSelection = function () {
        /////////////////////////////////


        // Initialize selectionjs
        const selection = Selection.create({

            // Class for the selection-area
            class: 'selection',

            // All elements in this container can be selected
            selectables: ['.box-wrap1 > .flightarea'],

            // The container is also the boundary in this case
            boundaries: ['.mainselection']
        }).on('beforestart', evt => {


            return evt.oe.target.tagName !== 'SPAN';

        }).on('start', ({ inst, selected, oe }) => {

            // Remove class if the user isn't pressing the control key or ⌘ key
            if (!oe.ctrlKey && !oe.metaKey) {

                // Unselect all elements
                for (const el of selected) {
                    el.classList.remove('selected');
                    inst.removeFromSelection(el);
                }

                // Clear previous selection 
                inst.clearSelection();

            }
            $scope.rangeFdps = [];
            $scope.clearPos();

        }).on('move', ({ changed: { removed, added } }) => {

            // Add a custom class to the elements that where selected.
            for (const el of added) {
                el.classList.add('selected');
            }

            // Remove the class from elements that where removed
            // since the last selection
            for (const el of removed) {
                el.classList.remove('selected');
            }

        }).on('stop', ({ inst, selected }) => {
            inst.keepSelection();
            $scope.ati_selectedFlights = [];
            $scope.ati_selectedTypes = [];

            //var temps=[];
            //$.each(selected,function(_i,_d){

            //    var $d=$(_d);
            //    temps.push(Enumerable.From($scope.ati_flights).Where('$.ID=='+$d.data('flightid')).FirstOrDefault());


            //});
            //var conflict = $scope.checkConflict(temps);
            //var continuity = $scope.checkContinuity(temps);
            //if (conflict || continuity) {
            //    General.ShowNotify('Interuption/Continuity Error', 'error');
            //    selection.clearSelection();

            //    return;
            //}

            $.each(selected, function (_i, _d) {
                //  alert($(_d).data('flightid')+'    '+ $(_d).data('dh'));
                // //console.log();
                var $d = $(_d);
                $scope.ati_selectedFlights.push({ Id: $d.data('flightid'), dh: !$d.data('dh') ? 0 : $d.data('dh'), sta: new Date($d.data('sta')), std: new Date($d.data('std')), no: $d.data('no'), FromAirport: $d.data('from'), ToAirport: $d.data('to') });
                $scope.ati_selectedTypes.push($d.data('type'));

            });
            $scope.ati_selectedTypes = Enumerable.From($scope.ati_selectedTypes).Distinct().ToArray();

            $scope.setSelectedFlightsKey();
            ////console.log($scope.ati_selectedTypes);
            $scope.fillPos();
            $scope.fillRangeFdps();
            $scope.useExtension = false;
            $scope.getFDPStat();
            $scope.fillRangeCrews();
            $scope.getAssigned();
        });

        ///////////////////////////////////
    };

    //2020-10-20///////////
    $scope.getDaysDiff = function (d1, d2) {
        var date1 = new Date(General.getDayFirstHour(d1));
        var date2 = new Date(General.getDayLastHour(d2));

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days;
    };
    ///////////////////// 
    $scope.dt_from = new Date();//new Date(2021,11,1).addDays(0);
    $scope.dt_to = new Date($scope.dt_from).addDays(14);

    $scope.rank = 'COCKPIT';
    $scope.sb_rank = {
        placeholder: 'Rank',
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['COCKPIT','CABIN','IP,P1', 'P2', 'TRE', 'TRI', 'P1', 'ISCCM,SCCM', 'CCM', 'ISCCM', 'SCCM'],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'rank',


        }
    };

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.bindDutyTimeLine(function () {

                //  $scope.createGantt();
                // $scope.initSelection();




                if ($(window).width() > $(window).height()) {
                    //height: calc(100% - 300px);
                    //$scope.footerfilter = false;
                    $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
                }
            });

        }

    };
    $scope.IsEventOverLapped = function (event) {
        //2023
        return false;
        //4-20
        var f;
        if (event.dutyType == 10000) {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {

                var _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }
        else {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {
                //EndUTC
                var _until = x.RestUntil;
                if (!_until)
                    _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }

        //console.log('IsEventOverLapped-------------------------------------');
        //console.log(event);
        //console.log($scope.cal_crew_ds);
        //console.log('---------------');
        //console.log(f);
        //console.log('IsEventOverLapped-------------------------------------');
        if (f)
            return true;
        return false;
    };

    $scope.saveNewDutyCal = function (crewid, callback) {
        //2023
        var dto = {
            DateStart: new Date($scope.FromDateEvent),
            DateEnd: new Date($scope.ToDateEvent),
            CityId: -1,
            CrewId: crewid,
            DutyType: $scope.event_status,
            Remark: $scope.RemarkEvent,
            EXTRERRP: $scope.ex48 ? 1 : 0,
            TIMELINE: 1
        }
        dto.BL = 0;
        dto.FX = 0;
        if ($scope.event_status == 100025) {
            var _blmm = ($scope.bl_hh ? $scope.bl_hh : 0) * 60 + $scope.bl_mm;
            dto.BL = _blmm;

            var _fxmm = ($scope.ev_fx_hh ? $scope.ev_fx_hh : 0) * 60 + $scope.ev_fx_mm;
            dto.FX = _fxmm;

        }
        $scope.loadingVisible = true;

        schedulingService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            //2023
            if (response.Code == '406') {

                General.ShowNotify(response.message, 'error');
                return;

            }
            ////////////
            //console.log(response);
            // response.dutyTypeTitle = response.DutyTypeTitle;
            // response.dutyType = response.DutyType;
            // $scope.cal_crew_ds.push(response);
            var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + crewid).FirstOrDefault();

            var offset1 = -1 * (new Date(response.InitStart)).getTimezoneOffset();
            response.InitStart = (new Date(response.InitStart)).addMinutes(offset1);

            var offset2 = -1 * (new Date(response.InitEnd)).getTimezoneOffset();
            response.InitEnd = (new Date(response.InitEnd)).addMinutes(offset2);

            var offset3 = -1 * (new Date(response.InitRestTo)).getTimezoneOffset();
            response.InitRestTo = (new Date(response.InitRestTo)).addMinutes(offset3);


            resource.duties.push(response);
            $.each(resource.duties, function (_j, _f) {
                _f.top = null;
            });
            $scope.setTopDuty(resource.duties);
            resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();

            $scope.bl_hh = null;
            $scope.bl_mm = null;
            //reposition
            $scope.ev_fx_hh = null;
            $scope.ev_fx_mm = null;
            callback();




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope._eventId = -1;
    $scope.event_status = null;
    function getEventTitle(id) {
        switch (id) {
            case 100000:
                return "Ground";
            case 100001:
                return "Meeting";
            case 100002:
                return "Sick";
            case 100003:
                return "Simulator";
            case 100004:
                return "Expired Licence";
            case 100005:
                return "Expired Medical";
            case 100006:
                return "Expired Passport";
            case 100007:
                return "No Flight";
            case 100008:
                return "Requested Off";
            case 100009:
                return "Refuse";
            case 1169:
                return "Vacation";
            case 1170:
                return "Reserve";
            //2020-10-27
            case 100025:
                return "Mission";
            case 300008:
                return "Duty";
            case 300009:
                return "Rest";
            //lay
            case 300010:
                return "Other Airline STBY";
            default:
                return "-";
        }
    }
    $scope.createEvent = function (_crewid, _type, _typeTitle, eventFrom, eventEnd, remark) {
        //if ([300007, 300010].indexOf(_type) == -1 && new Date(eventFrom) < $scope.firstHour && !$scope.isAdmin) {

        //    var myDialog = DevExpress.ui.dialog.custom({
        //        rtlEnabled: true,
        //        title: "Error",
        //        message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
        //        buttons: [{ text: "OK", onClick: function () { } }]
        //    });
        //    myDialog.show();
        //    return;
        //}
        var crewid = _crewid; //_crew.data.Id;
        var crew = Enumerable.From($scope.crews).Where('$.CrewId==' + _crewid).FirstOrDefault(); //_crew.data;
        if (!_typeTitle)
            _typeTitle = getEventTitle(_type);

        //$scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).Where('$.Id!=' + crewid).ToArray();
        $scope._eventId = $scope._eventId - 1;
        var offset = 1 * (new Date()).getTimezoneOffset();
        var stby = {
            Id: $scope._eventId, //-($scope.crewDuties.length + 1),
            type: 0,
            JobGroup: crew.JobGroup,
            GroupId: crew.GroupId,
            ScheduleName: crew.ScheduleName,
            //Duty: 180,
        };
        stby.crewId = crewid;
        stby.isPrePost = false;
        stby.LastLocationId = crew.LastLocationId;
        stby.LastLocation = crew.LastLocation;
        stby.FirstLocationId = crew.LastLocationId;
        stby.FirstLocation = crew.LastLocation;
        stby.day = new Date(eventFrom);
        stby.DutyStartLocal = new Date(eventFrom);
        stby.Remark = remark;
        stby.DutyEndLocal = new Date(eventEnd);
        stby.dutyType = _type;
        stby.dutyTypeTitle = _typeTitle;


        stby.DutyStart = (new Date(stby.DutyStartLocal)).addMinutes(offset);
        stby.DutyEnd = (new Date(stby.DutyEndLocal)).addMinutes(offset);
        if (_type != 10000 && _type != 1169 && _type != 100000 && _type != 100001 && _type != 100002 && _type != 100004 && _type != 100005 && _type != 100006 && _type != 100007 && _type != 100008 && _type != 100009
            //2020-10-27
            && _type != 100025
        ) {
            stby.RestToLocal = (new Date(stby.DutyEndLocal)).addMinutes(12 * 60);
            stby.RestTo = (new Date(stby.RestToLocal)).addMinutes(offset);
        }
        else {
            stby.RestToLocal = stby.DutyEndLocal;
            stby.RestTo = stby.DutyEnd;
        }
        var diff = Math.abs(new Date(eventEnd) - new Date(eventFrom));
        stby.Duty = Math.floor((diff / 1000) / 60);

        stby.flights = null;
        stby.IsOver = false;

        return stby;

    };


    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    $scope.popup_event = {
        width: 350,
        height: 460,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd2', onClick: function (arg) {

                        // //console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var crewid = $scope.selected_crew_id;

                        var eventFrom = new Date($scope.FromDateEvent);
                        var eventEnd = new Date($scope.ToDateEvent);
                        //  var rosterFrom = new Date(General.getDayFirstHour(new Date($scope.dt_fromSearched)));
                        //getDayLastHour
                        //   var rosterTo = new Date(getMidNight(new Date($scope.dt_toSearched)));
                        //////////////////////////////
                        if ($scope.event_status == 10000) {
                            //nool

                            //  alert(crewid);
                            var _event = $scope.createEvent($scope.selected_crew_id, 10000, 'RERRP', eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {
                                $scope.saveNewDutyCal($scope.selected_crew_id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        ///////////////////////////////////
                        //if ($scope.event_status == 5000 || $scope.event_status == 5001) {
                        //    if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                        //        // alert(crewid);

                        //        var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, ($scope.event_status==5000?'Training':'Office'), eventFrom, eventEnd);
                        //        var check = $scope.IsEventOverLapped(_event);
                        //        if (check) {
                        //            General.ShowNotify('Overlapped Duties Found', 'error');
                        //            return;
                        //        }
                        //        else
                        //        {
                        //            $scope.cal_crew_ds.push(_event);
                        //            $scope.cal_crew_instance.repaint();
                        //            $scope.crewDuties.push(_event);
                        //            //console.log('event duties');
                        //            //console.log($scope.crewDuties);
                        //            $scope.popup_event_visible = false;
                        //        }


                        //    }


                        //}
                        else if ($scope.event_status == 5000 || $scope.event_status == 5001 || $scope.event_status == 300014
                            || $scope.event_status == 100001 || $scope.event_status == 100003 || $scope.event_status == 1170 || $scope.event_status == 1167
                            || $scope.event_status == 1168
                            || $scope.event_status == 300013
                        ) {
                            //nool


                            var _event = $scope.createEvent($scope.selected_crew_id, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.selected_crew_id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        //2020-10-27
                        else if ($scope.event_status == 100025) {
                            $scope.saveNewDutyCal($scope.selected_crew_id, function () { $scope.popup_event_visible = false; });
                        }
                        //dlutopol
                        else {
                            //nool


                            var _event = $scope.createEvent($scope.selected_crew_id, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = false; //$scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.selected_crew_id, function () { $scope.popup_event_visible = false; });

                            }


                        }

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.ToDateEvent = null;
            $scope.FromDateEvent = null;
            $scope.event_status = null;
            $scope.RemarkEvent = null;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    $scope.FromDateEvent = null;
    $scope.ToDateEvent = null;
    $scope.RemarkEvent = null;





    $scope.date_from_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    $scope.date_from_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'FromDateEvent',
        }
    };
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    $scope.date_to_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'ToDateEvent',
        }
    };
    $scope.remark_event = {
        height: 60,
        bindingOptions: {
            value: 'RemarkEvent',

        }
    };
    $scope.bl_hh = null;
    $scope.num_bl_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_hh',

        }
    };
    $scope.bl_mm = null;
    $scope.num_bl_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_mm',

        }
    };
    //reposition
    $scope.ev_fx_hh = null;
    $scope.num_ev_fx_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ev_fx_hh',

        }
    };
    $scope.ev_fx_mm = null;
    $scope.num_ev_fx_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ev_fx_mm',

        }
    };
    $scope.ex48 = false;
    $scope.check_ex48 = {

        text: "Extended (48 hours)",

        bindingOptions: {
            value: 'ex48',
        }
    };
    $scope.assign10000 = function (e) {
        $scope.event_status = 10000;
        var _rs = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        if (e && moment(e).format('YYYYMMDD') == moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD'))
            _rs = e;
        $scope.FromDateEvent = _rs;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((23 * 60) + 59);
        //$scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        //$scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(12);
        $scope.popup_event_title = 'RERRP';
        $scope.popup_event_visible = true;

    };
    $scope.assign1166 = function (e) {
        $scope.event_status = 1166;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((23 * 60) + 59);
        $scope.popup_event_title = 'OFF';
        $scope.popup_event_visible = true;

    };
    $scope.assign100008 = function (e) {
        $scope.event_status = 100008;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((23 * 60) + 59);
        $scope.popup_event_title = 'Requested Off';
        $scope.popup_event_visible = true;

    };
    //300008
    $scope.assign300008 = function (e) {
        $scope.event_status = 300008;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60 + 59);
        $scope.popup_event_title = 'Duty';
        $scope.popup_event_visible = true;
    };
    $scope.assign1168 = function (e) {

        $scope.event_status = 1168;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
        $scope.popup_event_title = 'STBY AM';
        $scope.popup_event_visible = true;
    };
    $scope.assign1167 = function (e) {
        $scope.event_status = 1167;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(12, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((11 * 60) + 59);
        $scope.popup_event_title = 'STBY PM';
        $scope.popup_event_visible = true;
    };

    $scope.assign5000 = function (e) {
        $scope.event_status = 5000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Training';
        $scope.popup_event_visible = true;
    };
    $scope.assign5001 = function (e) {
        $scope.event_status = 5001;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
        $scope.popup_event_title = 'Office';
        $scope.popup_event_visible = true;
    };

    $scope.assign1169 = function (e) {
        $scope.event_status = 1169;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Vacation';
        $scope.popup_event_visible = true;
    };
    $scope.assign100000 = function (e) {
        $scope.event_status = 100000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Ground';
        $scope.popup_event_visible = true;
    };
    $scope.assign100001 = function (e) {
        $scope.event_status = 100001;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Meeting';
        $scope.popup_event_visible = true;
    };

    $scope.assign100002 = function (e) {
        $scope.event_status = 100002;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Sick';
        $scope.popup_event_visible = true;
    };
    $scope.assign100003 = function (e) {
        $scope.event_status = 100003;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Simulator';
        $scope.popup_event_visible = true;
    };
    $scope.assign100004 = function (e) {
        $scope.event_status = 100004;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Licence';
        $scope.popup_event_visible = true;
    };
    $scope.assign100005 = function (e) {
        $scope.event_status = 100005;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Medical';
        $scope.popup_event_visible = true;
    };
    $scope.assign100006 = function (e) {
        $scope.event_status = 100006;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Passport';
        $scope.popup_event_visible = true;
    };
    $scope.assign100007 = function (e) {
        $scope.event_status = 100007;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'No Flt';
        $scope.popup_event_visible = true;

    };


    $scope.assign300014 = function (e) {
        $scope.event_status = 300014;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
        $scope.popup_event_title = 'Briefing';
        $scope.popup_event_visible = true;

    };
    $scope.assign100009 = function (e) {
        $scope.event_status = 100009;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Refuse';
        $scope.popup_event_visible = true;

    };
    $scope.assign1170 = function (e) {
        $scope.event_status = 1170;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Reserve';
        $scope.popup_event_visible = true;
    };
    //2020-10-27
    $scope.assign100025 = function (e) {
        $scope.event_status = 100025;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60 );
        $scope.popup_event_title = 'Mission';
        $scope.popup_event_visible = true;
    };

    //300009
    $scope.assign300009 = function (e) {
        $scope.event_status = 300009;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60 + 59);
        $scope.popup_event_title = 'Rest';
        $scope.popup_event_visible = true;
    };
    //300010
    //lay
    $scope.assign300010 = function (e) {
        $scope.event_status = 300010;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(4, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(10 * 60);
        $scope.popup_event_title = 'Other Airline STBY';
        $scope.popup_event_visible = true;
    };

    $scope.selected_crew_id = null;
    $scope.sb_crews = {
        
        showClearButton: false,
        searchEnabled: true,
        
        valueExpr: 'CrewId',
        displayExpr: "ScheduleName",
        onSelectionChanged: function (arg) {
            $scope.prepare_fdp_inserting();
            $scope.getFDPsByFlights();
            $scope.getDutiesByCrew();
        },

        bindingOptions: {
            value: 'selected_crew_id',
            dataSource: 'crews',


        }
    };
    $scope.selected_crew = null;
    $scope.prepare_fdp_inserting = function () {
       
        $scope.selected_crew = Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault();
        switch ($scope.selected_crew.JobGroup) {
            case 'P1':
                $scope.position_ds = ['CPT', 'SAFETY', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'CPT';
                break;
            case 'P2':
                $scope.position_ds = ['FO', 'SAFETY', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'FO';
                break;
            case 'TRE':
            case 'TRI':
            case 'LTC':
            case 'SFE':
            case 'SFI':
                $scope.position_ds = ['IP', 'CPT', 'SAFETY', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'IP';
                break;
            case 'ISCCM':
            case 'CCE':
            case 'CCI':
                $scope.position_ds = ['ISCCM', 'SCCM', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'ISCCM';
                break;
            case 'SCCM':
            case 'SCC':
                $scope.position_ds = ['SCCM', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'SCCM';
                break;
            case 'CCM':
            case 'CC':
                $scope.position_ds = ['CCM', 'CHECK', 'OBS', 'D/H'];
                $scope.default_pos = 'CCM';
                break;

            default:
                $scope.position_ds = [];
                break;
        }
    };


    $scope.last_clicked_date = null;
    $scope.new_event = function (key, id) {
        $scope.$apply(function () {
            var prts = id.split('_');
            $scope.selected_crew_id =Number( prts[0]);
            var dt_parts = prts[1].split('-');
            $scope.contextMenuCellData = {};
            $scope.contextMenuCellData.startDate = new Date(dt_parts[0], Number(dt_parts[1] - 1), dt_parts[2]);


            var isvalid = $scope.getCrewCerStatus(Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault(), $scope.contextMenuCellData.startDate);
            console.log('isvalid', isvalid);
            

            switch (key) {
                case 'PROFILE':
                     
                    $scope.showProfileContextMenu($scope.selected_crew_id);
                    break;
                case 'FDP':
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) { return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                if (moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD') != $scope.last_clicked_date) {
                                    $scope.flt_selected = [];
                                    $scope.flt_selected_obj = [];
                                }
                                $scope.last_clicked_date = moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD');

                                $scope.prepare_fdp_inserting();
                                $scope.popup_flt_title = '';
                                $scope.popup_flt_visible = true;
                            });
                        });
                    }
                    else {
                        if (moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD') != $scope.last_clicked_date) {
                            $scope.flt_selected = [];
                            $scope.flt_selected_obj = [];
                        }
                        $scope.last_clicked_date = moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD');

                        $scope.prepare_fdp_inserting();
                        $scope.popup_flt_title = '';
                        $scope.popup_flt_visible = true;
                    }
                    break;
                case 'RERRP':
                    var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault();
                    var duty = Enumerable.From(resource.duties).Where(
                        function (x) {
                            return moment(new Date($scope.contextMenuCellData.startDate)).format('YYYYMMDD') == moment(new Date(x.InitStart)).format('YYYYMMDD');
                        }
                    ).OrderByDescending(function (x) { return moment(new Date(x.InitStart)).format('YYYYMMDD');}).FirstOrDefault();
                    var _rs = null;
                    if (duty)
                        _rs = duty.InitEnd;

                    $scope.assign10000(_rs);
                    break;
                case 'OFF':
                    $scope.assign1166();
                    break;
                case 'REQUESTED OFF':
                    $scope.assign100008();
                    break;
                case 'VACATION':
                    $scope.assign1169();
                    break;
                case 'SICK':
                    $scope.assign100002();
                    break;
                case 'EXP. LICENCE':
                    $scope.assign100004();
                    break;
                case 'EXP. MEDICAL':
                    $scope.assign100005();
                    break;
                case 'EXP. PASSPORT':
                    $scope.assign100006();
                    break;
                case 'DUTY':
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) { return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                $scope.assign300008();
                            });
                        });
                    }
                    else
                    $scope.assign300008();
                    break;
                case 'GROUND':
                    $scope.assign100000();
                    break;
                case 'STBY-AM':
                    //1168
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) { return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                $scope.addStby(1168);
                            });
                        });
                    }
                    else
                    $scope.addStby(1168);
                    break;
                case 'STBY-PM':
                    //1167
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) { return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                $scope.addStby(1167);
                            });
                        });
                    }
                    else
                    $scope.addStby(1167);
                    break;
                case 'STBY-C':
                    //300013
                    if (isvalid.IsExpired) {
                        General.ShowNotify('Violation of Certificates/License/FTL', 'error');
                        //        return;
                    }
                    $scope.addStby(300013);
                    break;
                case 'RESERVE':
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) { return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                $scope.addStby(1170);
                            });
                        });
                    }
                    else
                    $scope.addStby(1170);
                    break;
                case 'OFFICE':
                    $scope.assign5001();
                    break;
                case 'TRAINING':
                    $scope.assign5000();
                    break;
                case 'MEETING':
                    $scope.assign100001();
                    break;
                case 'SIMULATOR':
                    if (isvalid.IsExpired) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "ERROR",
                            message: 'Violation of Certificates/License/FTL',
                            buttons: [{ text: "OK", onClick: function (e) {   return { buttonText: "OK" }; } }]
                        });
                        myDialog.show().done(function (dialogResult) {
                            //console.log(dialogResult.buttonText);
                            //s02
                            $scope.$apply(function () {
                                $scope.assign100003();
                            });
                        }); 
                    }
                    else
                    $scope.assign100003();
                    break;
                case 'MISSION':
                    $scope.assign100025();
                    break;
                case 'BRIEFING':
                    $scope.assign300014();
                    break;
                default:
                    break;
            }

        });



        //$scope.contextMenuCellData.startDate

    };
    $scope.get_crewtime = function (crewid) {
        var _dfx = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dtx = moment($scope.dt_to).format('YYYY-MM-DD');
        schedulingService.getCrewFlightTimeByCrew(crewid, _dfx, _dtx).then(function (_cres) {
            console.log('cres cres ', _cres);
            var _res = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + crewid).FirstOrDefault();
            if (_res) {
                _res.FX = 0
                _res.BL = 0;
                _res.FL = 0;
                if (_cres) {
                    _res.FX = _cres.FixTime;
                    _res.BL = _cres.JLBlockTime;
                    _res.FL = _cres.JLFlightTime;
                }

            }
        });
    }
    $scope.removeFDP = function (x,row) {
        console.log(x);
        var dto = { Id: x.FDPId };

        $scope.loadingVisible = true;
        schedulingService.deleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;
            //khar
            var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + x.CrewId).FirstOrDefault();

            try {
                resource.duties = Enumerable.From(resource.duties).Where('$.Id!=' + x.FDPId).ToArray();
                $.each(resource.duties, function (_j, _f) {
                    _f.top = null;
                });
                $scope.setTopDuty(resource.duties);
                resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();

                $scope.get_crewtime(x.CrewId);

            }
            catch (eeeee) {

            }

          
            if (x.CrewId == $scope.selected_crew_id) {
                $scope.getDutiesByCrew();
            }
            row.item = Enumerable.From(row.item).Where('$.FDPId!=' + x.FDPId).ToArray();


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.delete_event = function (key, id) {
        $scope.$apply(function () {
            var prts = id.split('_');
            var crew_id = prts[0];
            var duty_id = prts[1];

            var dto = { Id: duty_id };

            $scope.loadingVisible = true;
            schedulingService.deleteFDP(dto).then(function (response) {
                $scope.loadingVisible = false;
                //khar
                var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + crew_id).FirstOrDefault();



                resource.duties = Enumerable.From(resource.duties).Where('$.Id!=' + duty_id).ToArray();
                $.each(resource.duties, function (_j, _f) {
                    _f.top = null;
                });
                $scope.setTopDuty(resource.duties);
                resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();
                $scope.get_crewtime(crew_id);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        });



        //$scope.contextMenuCellData.startDate

    };
    $scope.getRoute = function (str,no) {
        if (!str)
            return "";
        if (!no || !no.includes("dh"))
            return str.replaceAll(',', ' ');
        else {
            var no_prts = no.split(',');
            var str_prts = str.split(',');
            $.each(no_prts, function (_i, _d) {
                if (_d.includes("dh"))
                    str_prts[_i + 1] += '*';

            });
            return str_prts.join(',').replaceAll(',', ' ');
        }
    }

    $scope.addStby = function (_type) {
       
        $scope.selected_crew = Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault();


        var dto = {
            date: new Date($scope.contextMenuCellData.startDate),
            crewId: $scope.selected_crew.CrewId,
            type: _type,
            isgantt: 1,
        };
        ///////////////////////////////
        $scope.loadingVisible = true;
        schedulingService.saveSTBY(dto).then(function (response) {
            $scope.loadingVisible = false;

            if (response.Code == 406 || (response.data && response.data.Code==406)) {
                if (response.message) {
                    var myDialog = DevExpress.ui.dialog.custom({
                        rtlEnabled: true,
                        title: "Error",
                        message: response.message,
                        buttons: [{ text: "OK", onClick: function () { } }]
                    });
                    myDialog.show();
                }

            }
            else {
                //dlubaz
                var gres = response;

                var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + $scope.selected_crew.CrewId).FirstOrDefault();

                var offset1 = -1 * (new Date(gres.InitStart)).getTimezoneOffset();
                gres.InitStart = (new Date(gres.InitStart)).addMinutes(offset1);

                var offset2 = -1 * (new Date(gres.InitEnd)).getTimezoneOffset();
                gres.InitEnd = (new Date(gres.InitEnd)).addMinutes(offset2);

                var offset3 = -1 * (new Date(gres.InitRestTo)).getTimezoneOffset();
                gres.InitRestTo = (new Date(gres.InitRestTo)).addMinutes(offset3);


                resource.duties.push(gres);
                $.each(resource.duties, function (_j, _f) {
                    _f.top = null;
                });
                $scope.setTopDuty(resource.duties);
                resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();



                //$scope.dg_crew_stby_ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                //    return x.Id != _crew.Id && (($scope.IsCabin && x.JobGroupCode.startsWith('00102')) || ($scope.IsCockpit && x.JobGroupCode.startsWith('00101')));
                //}).OrderBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();
                //if (_type == 1168) {
                //    $scope.AmDs.push(response);
                //    $scope.AmDs = Enumerable.From($scope.AmDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                //}
                //else if (_type == 1167) {
                //    $scope.PmDs.push(response);
                //    $scope.PmDs = Enumerable.From($scope.PmDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                //}
                //else {
                //    $scope.ReservedDs.push(response);
                //    $scope.ReservedDs = Enumerable.From($scope.ReservedDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                //}


            }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        ////////////////////////////////
    };

    //////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        $('.dutytimeline').fadeIn(400, function () {
            ////////////////////////////////
            setTimeout(function () {
                //$scope.bindFlights(function () {

                //    $scope.createGantt();
                //    $scope.initSelection();




                //    if ($(window).width() > $(window).height()) {
                //        //height: calc(100% - 300px);
                //        //$scope.footerfilter = false;
                //        $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
                //    }
                //    //else {
                //    //    $scope.footerfilter = true;
                //    //    $('.gantt-main-container').height($(window).height() - 205);
                //    //}
                //});




            }, 2000);








            ///////////////////////////////////
        });


    });


    ////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }

    $scope.$on("$destroy", function (event) {

        //$scope.StopNowLineTimer();
        $scope.stop();

    });

    var appWindow = angular.element($window);

    appWindow.bind('resize', function () {
        return;
        if ($(window).width() > $(window).height()) {
            $scope.$apply(function () {
                $scope.footerfilter = false;
                $scope.IsLandscape = true;

            });

            $('.gantt-main-container').height($(window).height() - 85);


        } else {
            // alert('x');
            $scope.$apply(function () {

                $scope.footerfilter = true;
                $scope.IsLandscape = false;

            });
            $('.gantt-main-container').height($(window).height() - 205);
        }

    });


    //////// GANTT FLIGHTS //////////////////////////
    //gntflt
    $scope.prepare_gantt_flt = function () {
        // angular.element(document.querySelector('.col-duty')).bind('scroll', function (e) {
        //     //console.log('scroll', e);
        // })
        $('.col-duty-flt').on('scroll', function () {
            $('.col-res-flt').scrollTop($(this).scrollTop());
            $('.row-date-flt').scrollLeft($(this).scrollLeft());
            //console.log($(this).scrollLeft());
        });


    };
    var col_height_gap_flt = 350;
    $scope.getLeftColumnStyle_flt = function () {
        var _height = $(window).height() - col_height_gap_flt;
        return {
            height: _height + 'px'
        }
    };
    $scope.getRightColumnStyle_flt = function () {
        var _height = $(window).height() - col_height_gap_flt + 20;
        return {
            height: _height + 'px'
        }
    };

    var date_cell_width_hour = 50;
    var date_cell_width_flt = (date_cell_width_hour + 0) * 24 + 1;
    var duty_height_flt = 45;
    var duty_height_trn = 30;
    var minute_width_flt = date_cell_width_hour * 1.0 / (60);
    $scope.getDutyStyle_flt = function (duty) {
        //   var start = moment('2014-01-01 12:00:00');
        //  var end = moment('2014-01-01 13:00:00');
        //  var minutes = end.diff(start, 'minutes');
        //zook

        var start = getMinDate(duty.STDLocal, duty.ChocksOutLocal);// duty.InitStart;
        var end = getMaxDate(duty.STALocal, duty.ChocksInLocal); //duty.InitRestTo;

        var _start = moment(start);
        var _end = moment(end);
        var duration = _end.diff(_start, 'minutes');
        var _width = duration * minute_width_flt;

        var _left = _start.diff(moment($scope.datefrom_flt), 'minutes') * minute_width_flt;

        return {
            width: _width + 'px',
            left: _left + 'px',
            top: duty.top + 'px',
            height: duty_height_flt + 'px'
        };
    };
    $scope.getDutyClass_flt = function (duty) {
        return '';//'duty-' + duty.DutyType;
    }
    $scope.getDateCellStyle_flt = function () {

        return {
            width: date_cell_width_flt + 'px'
        }
    };
    $scope.getHourCellStyle_flt = function () {

        return {
            width: date_cell_width_hour + 'px'
        }
    };
    $scope.getDateBarStyle_flt = function () {
        var _width = $scope.ganttFlightData && $scope.ganttFlightData.dates ? $scope.ganttFlightData.dates.length * date_cell_width_flt : 1000;
        return {
            width: _width + 'px'
        }
    };
    //2023
    $scope.getResStyle_flt = function (res) {
        var _width = $scope.ganttFlightData && $scope.ganttFlightData.dates ? $scope.ganttFlightData.dates.length * date_cell_width_flt : 1000;
        return {
            width: _width + 'px',
            height: (res.maxTop + duty_height_flt + 15) + 'px'
        };
    };
    $scope.getResCaptionStyle_flt = function (res) {
        return {
            lineHeight: (res.maxTop + duty_height_flt) + 'px'
        };
    }
    $scope.getCellId_flt = function (res, dt) {
        var dt_str = moment(new Date(dt.date)).format('YYYY-MM-DD');
        return res.CrewId + '_' + dt_str;
    };

    $scope.getFlightRoute = function (flt) {
        return flt.FromAirportIATA + '-' + flt.ToAirportIATA;
    };
    $scope.getFlightCaption = function (flt) {
        return flt.FlightNumber;
    };
    $scope.getFlightMVT = function (flt) {
        return moment(new Date(flt.ChocksOutLocal)).format('HHmm') + '-' + moment(new Date(flt.ChocksInLocal)).format('HHmm');
    };

    $scope.getFlightStyle = function (flt) {
        var bk = '#00e6b8';
        if (flt.FlightStatusID != 1)
            bk = '#80dfff';
        if ($scope.flt_selected.indexOf(flt.ID) != -1)
            bk = '#ff9966';
        if (flt.FlightStatusID == 4)
            bk = '#b3b3b3';
        return {
            background: bk,
        };
    };
    $scope.flt_selected = [];
    $scope.flt_selected_obj = [];
    $scope.FDPStat = {};
    $scope.flt_fdps = [];
    $scope.get_flt_fdps_style = function () {
        return {
            height: $(window).height() - 490,
        };
    };
    $scope.crew_duties_history = [];
    $scope.getDutiesByCrew = function () {
        //s01
        //moment(new Date(dt)).format("YYYY-MM-DD");
        if (!$scope.selected_crew_id)
            return;
       var _df = new Date($scope.contextMenuCellData.startDate).addDays(-2);
       var _dt = new Date($scope.contextMenuCellData.startDate).addDays(3);
        var df = General.getDayFirstHour(new Date(_df));
        var dt = General.getDayFirstHour(new Date(_dt));
        $scope.crew_duties_history = [];
        schedulingService.getDutiesForGanttByDateCrewNew(moment(new Date(df)).format("YYYY-MM-DD")
            , moment(new Date(dt)).format("YYYY-MM-DD")
            , $scope.selected_crew_id).then(function (response) {
                if (response && response.length > 0) {
                    $.each(response[0].Items, function (_i, _d) {
                        var offset = -1 * (new Date(_d.InitStart)).getTimezoneOffset();
                        _d.DateLocal = (new Date(_d.InitStart)).addMinutes(offset);
                    });
                    $scope.crew_duties_history = Enumerable.From(response[0].Items).OrderBy(function (x) { return Number(moment(new Date(x.DateLocal)).format("YYYYMMDD")); }).ToArray();
                }
               
                
                console.log('history1', response);
                console.log('history', $scope.crew_duties_history);
        });
    };
    $scope.duty_info = {};
    $scope.show_info = function (dty) {
        $scope.duty_info = {duty:dty};
        if (dty.DutyType == 1165) {
            schedulingService.getFdpsByFlight(dty.InitKey).then(function (response) {
                $scope.duty_info.fdps = response;
                console.log($scope.duty_info.fdps);
                 
            });
        }
        $scope.popup_info_visible = true;
    }


    $scope.popup_info_visible = false;
    $scope.popup_info_title = 'Profile';

    $scope.popup_info = {
        
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 600,
        width: 500,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        title: 'Information',
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_info_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            

        },
        onHiding: function () {
            
            $scope.popup_info_visible = false;

        },
        bindingOptions: {
            visible: 'popup_info_visible',


        }
    };



    $scope.getFDPsByFlights = function () {
        //getFdpsByFlight
        $scope.flt_fdps = [];
        //alert($scope.flt_selectd.length);
        if (!$scope.flt_selected || $scope.flt_selected.length == 0)
            return;
        var ids = $scope.flt_selected.join('_');

        schedulingService.getFdpsByFlight(ids).then(function (response) {
            $scope.flt_fdps = response;
            console.log($scope.flt_fdps);
        });
    };
    $scope.flightClick = function (flt) {
        if (flt.FlightStatusID == 4)
            return;
        if ($scope.flt_selected.indexOf(flt.ID) != -1) {
            $scope.flt_selected = Enumerable.From($scope.flt_selected).Where('$!=' + flt.ID).ToArray();
            $scope.flt_selected_obj = Enumerable.From($scope.flt_selected_obj).Where(function (x) { return x.ID != flt.ID; }).OrderBy('$.ChocksOut').ToArray();
        }
        else {
            $scope.flt_selected.push(flt.ID);
            var fltobj = Enumerable.From($scope.gantt_flights).Where(function (x) { return flt.ID == x.ID; }).FirstOrDefault();
            fltobj.Position = $scope.default_pos;
            fltobj.DH = false;
            $scope.flt_selected_obj.push(fltobj);
            $scope.flt_selected_obj = Enumerable.From($scope.flt_selected_obj).OrderBy('$.ChocksOut').ToArray();
        }

        var flts = Enumerable.From($scope.gantt_flights).Where(function (x) { return $scope.flt_selected.indexOf(x.ID) != -1; }).OrderBy('$.ChocksOut').ToArray();
        //$scope.flt_selected_obj = flts;

        $scope.continuity = $scope.checkContinuity2(flts);
        $scope.overlapping = $scope.checkConflict2(flts);
       // alert($scope.continuity + '   ' + $scope.overlapping);
        $scope.FDPStat = {};
        $scope.useSplit = false;
        if (!$scope.continuity && !$scope.overlapping)
            $scope.getFDPStat();
        $scope.getFDPsByFlights();
    };
    $scope.useSplit = false;
    $scope.check_split = {
        width: '100%',
        text: "",
        onValueChanged: function (e) {
            //alert(e.value);
            if (e.value) {
                $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDPExtended;
            }
            else {
                $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDP;
            }
            // $scope.dg3_instance.refresh();

        },
        bindingOptions: {
            value: 'useSplit',

        }
    };
    $scope.apply_all = true;
    $scope.check_apply_all = {
        width: '100%',
        text: "",

        bindingOptions: {
            value: 'apply_all',

        }
    };


    $scope.overlapping = false;
    $scope.check_overlapping = {
        width: '100%',
        text: "",
        readOnly: true,
        bindingOptions: {
            value: 'overlapping',

        }
    };

    $scope.continuity = false;
    $scope.check_continuity = {
        width: '100%',
        text: "",
        readOnly: true,
        bindingOptions: {
            value: 'continuity',

        }
    };
    $scope.getHistoryCellStyle = function (x) {
        var clr = '#ddd';
        if (moment(new Date(x.DateLocal)).format("YYYY-MM-DD") == moment(new Date($scope.contextMenuCellData.startDate)).format("YYYY-MM-DD"))
            clr = '#b3ffd9';
        return {
            background: clr
        }
    };
    $scope.getOverlappedStyle = function () {
        var clr = '#fff';
        if ($scope.overlapping)
            clr = '#ff8080';
        return {
            background: clr
        }
    };
    $scope.getContiuityStyle = function () {
        var clr = '#fff';
        if ($scope.continuity)
            clr = '#ff8080';
        return {
            background: clr
        }
    };
    $scope.getFDPCellStyle = function () {
        var clr = '#66ff99';
        if ($scope.FDPStat.IsOver)
            clr = '#ff8080';
        return {
            background: clr
        }
    };
    $scope.getFDPStat = function () {
        $scope.FDPDuty = null;
        $scope.FDPFlight = null;
        $scope.IsExtensionVisible = false;
        $scope.IsSplitVisible = false;
        $scope.loadingVisible = false;
        var ids = Enumerable.From($scope.flt_selected_obj).Select('$.ID').ToArray();
        var dhs = 0; //Enumerable.From($scope.ati_selectedFlights).Where('$.dh==1').ToArray().length;
        schedulingService.getFDPStats(ids.join('_'), dhs).then(function (response) {


            $scope.loadingVisible = false;
            try {
                var _end = (new Date(response.RestFrom)).addMinutes(-30);

                $scope.editable = !(_end < $scope.firstHour);


            }
            catch (e) {

            }


           

            $scope.FDPStat = response;
            $scope.FDPDuty = response.Duty;
            $scope.FDPFlight = response.Flight;
            response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
            response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
            response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
            response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
            response.AllowedExtensionStr = pad(Math.floor(response.AllowedExtension / 60)).toString() + ':' + pad(Math.round(response.AllowedExtension % 60)).toString();
            response.WOCLStr = pad(Math.floor(response.WOCL / 60)).toString() + ':' + pad(Math.round(response.WOCL % 60)).toString();
            response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
            response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
            response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
            $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDP;
            $scope.dg3_ds = [];
            $scope.dg3_height = $scope.bottom - 108;
            //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
            $scope.dg3_ds.push({ Title: 'WOCL', Value: response.WOCLStr });

            if (response.Extended > 0) {
                $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                $scope.dg3_ds.push({ Title: 'By Split', Value: response.ExtendedStr });
                $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });
                $scope.dg3_height = $scope.bottom - 108 - 60;
                $scope.IsSplitVisible = true;
                $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDPExtended;
                $scope.useSplit = true;
            } else
                if (response.AllowedExtension > 0) {
                    $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPExtendedStr });
                    $scope.dg3_ds.push({ Title: 'By Extension', Value: response.AllowedExtensionStr });
                    $scope.dg3_height = $scope.bottom - 108 - 60;
                    $scope.IsExtensionVisible = true;
                } else {
                    $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                    //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPExtendedStr });
                }


            $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
            $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
            $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
            $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });
        });
    };

    $scope.checkConflict2 = function (flights) {
        //2022-01-23
        var hasConflict = false;
        $.each(flights, function (_i, _d) {

            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.ChocksOut) >= new Date(_d.ChocksOut) && new Date(x.ChocksOut) <= new Date(_d.ChocksIn))
                    ||
                    (new Date(x.onblock) >= new Date(_d.ChocksOut) && new Date(x.ChocksIn) <= new Date(_d.ChocksIn))
                );
            }).FirstOrDefault();
            if (f)
                hasConflict = true;
        });

        return hasConflict;


    };
    $scope.checkContinuity2 = function (flights) {
        //2022-01-23
        var hasError = false;
        var ordered = Enumerable.From(flights).OrderBy(function (x) { return new Date(x.ChocksOut); }).ToArray();
        $.each(ordered, function (_i, _d) {
            if (_i >= 0 && _i < ordered.length - 1) {

                if (_d.ToAirportIATA != ordered[_i + 1].FromAirportIATA)
                    hasError = true;
            }
        });
        return hasError;


    };
    $scope.position_ds = [];
    $scope.dg_flt_columns = [


        { dataField: 'FlightNumber', caption: 'No', width: '60', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        // { dataField: 'FromAirportIATA', caption: 'From',width:40, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        // { dataField: 'ToAirportIATA', caption: 'To',width:40, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        //{ dataField: 'Position', caption: 'POS', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        {
            allowEditing: true,
            alignment: 'center',
            dataField: 'Position',
            caption: 'POS',

            lookup: {
                dataSource: [],

            },
            validationRules: [{ type: 'required' }],

        },
        // { dataField: 'DH', caption: 'D/H',width:40, allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, },



    ];
    $scope.dg_flt_selected = null;
    $scope.dg_flt_instance = null;
    $scope.dg_flt_ds = null;
    $scope.dg_flt_height = 220; //$(window).height() -   550; 
    $scope.dg_flt = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        editing: {
            mode: 'cell',
            allowUpdating: true,
            allowAdding: false,
            allowDeleting: false,
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
        // height: $scope.bottom-108,

        columns: $scope.dg_flt_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flt_instance)
                $scope.dg_flt_instance = e.component;

        },
        onRowPrepared: function (e) {
            //if (e.rowType === "data") {
            //    var day = (new Date(e.data.STDDay)).getDay();
            //    e.rowElement.css("backgroundColor", $scope.palete[day]);
            //}
            //42 %  10

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flt_selected = null;
                $scope.dg_crew_abs_ds = [];
            }
            else {
                $scope.dg_flt_selected = data;
                schedulingService.getFlightCrewsNew(data.ID).then(function (response) {
                    $.each(response, function (_i, _d) {
                        _d.FlightNumber = data.FlightNumber;
                    });
                    $scope.dg_crew_abs_ds = response;
                });
            }


        },
        onEditingStart: function (e) {
            schedulingService.getFlightCrewsNew(e.data.ID).then(function (response) {
                $.each(response, function (_i, _d) {
                    _d.FlightNumber = e.data.FlightNumber;
                });
                $scope.dg_crew_abs_ds = response;
            });
        },
        onCellPrepared: function (e) {
            ////lightgray
            //if (e.rowType === "data" && e.column.dataField == "Title")
            //    e.cellElement.css("backgroundColor", "lightgray");
            //if (e.rowType === "data" && e.column.dataField == "Value" && e.data.Title == 'FDP' && $scope.FDPStat.IsOver)
            //    e.cellElement.css("backgroundColor", "#ffcccc");

        },

        bindingOptions: {
            dataSource: 'flt_selected_obj',
            height: 'dg_flt_height'
        }
    };

    $scope.default_pos = null;
    $scope.sb_position = {
        // openOnFieldClick: false,
        // showDropDownButton: false,
        showClearButton: false,
        searchEnabled: false,

        onSelectionChanged: function (arg) {
            $.each($scope.flt_selected_obj, function (_i, _d) {
                _d.Position = $scope.default_pos;
            });
        },

        bindingOptions: {
            value: 'default_pos',
            dataSource: 'position_ds'


        }
    };

    $scope.dg_crew_abs_columns = [
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },

        { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

    ];
    $scope.dg_crew_abs_selected = null;
    $scope.dg_crew_abs_instance = null;
    $scope.dg_crew_abs_ds = null;
    $scope.dg_crew_abs = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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

        columnAutoWidth: false,
        //2020-10-27 1 s
        height:  $(window).height() - 200-290,

        columns: $scope.dg_crew_abs_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_abs_instance)
                $scope.dg_crew_abs_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_abs_selected = null;

            }
            else {
                $scope.dg_crew_abs_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_crew_abs_ds',

        }
    };

    $scope.getDefaultPos = function (grp) {
        switch (grp) {
            case 'P1':
                return 'P1';
            case 'P2':
                return 'P2';
            case 'TRE':
            case 'TRI':
            case 'LTC':
            case 'SFI':
            case 'SFE':
                return 'IP';
            case 'ISCCM':
            case 'CCI':
            case 'CCE':
                return 'ISCCM';
            case 'SCCM':
                return 'SCCM';
            case 'CCM':
            case 'CC':
                return 'CCM';
            default:
                return grp;
        }
    };
    $scope.getPosScore = function (pos) {
        switch (pos) {
            case 'IP':
                return 1000;
            case 'P1':
            case 'CPT':
                return 950;
            case 'FO':
            case 'P2':
                return 900;
            case 'CCE':
                return 850;
            case 'ISCCM':
            case 'CCI':
                return 800;
            case 'CCM':
            case 'CC':
                return 750;
            case 'SAFETY':
            case 'SO':
                return 700;
            case 'CHECK':
                return 650;
            case 'OBS':
                return 600;
            default:
                return 0;
        }
    }
    $scope.getPos = function (str) {
        switch (str) {
            case 'CPT':
                return 'P1';
            case 'FO':
                return 'P2';

            default:
                return str;
        }
    }
    $scope.getMainPos = function (ids) {
        var d = Enumerable.From(ids).OrderByDescending(function (x) { return $scope.getPosScore(x.pos); }).ToArray();
        return d[0].pos;
    }
    $scope.getFtlAbs = function (crewid, dt, callback) {
        var crewIds = [];
        crewIds.push(crewid);
        var date = moment(new Date(dt)).format("YYYY-MM-DD");
        var dto = {
            CDate: date,
            CrewIds: crewIds,
        };
       
        schedulingService.getFTLByCrewIds(dto).then(function (response) {
            var sumFLT28 = 0;
            var sumFL = 0;
            $.each(response, function (_i, _d) {
                sumFL += _d.Ratio ? _d.Ratio : 0;
                sumFLT28 += _d.Flight28 ? _d.Flight28 : 0;
                _d._Duty7 = $scope.formatMinutes(_d.Duty7);
                _d._Duty7Remain = $scope.formatMinutes(_d.Duty7Remain);
                _d._Duty14 = $scope.formatMinutes(_d.Duty14);
                _d._Duty14Remain = $scope.formatMinutes(_d.Duty14Remain);
                _d._Duty28 = $scope.formatMinutes(_d.Duty28);
                _d._Duty28Remain = $scope.formatMinutes(_d.Duty28Remain);
                _d._Flight28 = $scope.formatMinutes(_d.Flight28);
                _d._Flight28Remain = $scope.formatMinutes(_d.Flight28Remain);
                _d._FlightCYear = $scope.formatMinutes(_d.FlightCYear);
                _d._FlightCYearRemain = $scope.formatMinutes(_d.FlightCYearRemain);
                _d._FlightYear = $scope.formatMinutes(_d.FlightYear);
                _d._FlightYearRemain = $scope.formatMinutes(_d.FlightYearRemain);

            });
            if (response.length > 0) {
                $scope.FLT28Avg = (sumFLT28 * 1.0) / response.length;
                $scope.FLAvg = (sumFL * 1.0) / response.length;
            }
            callback(response);

        }, function (err) { });

    };

    $scope.getFLT28Class = function (x) {
        if ($scope.FLT28Avg) {
            if (x >= $scope.FLT28Avg)
                return "";
            var diff = Math.abs((x - $scope.FLT28Avg) / ($scope.FLT28Avg * 1.0));
            if (diff > 0.15)
                return " aboveavg";
            return "";
        }

        return "";
    };

    $scope.getFLClass = function (x) {
        if ($scope.FLAvg) {
            if (x >= $scope.FLAvg)
                return "";
            var diff = Math.abs((x - $scope.FLAvg) / ($scope.FLAvg * 1.0));
            if (diff > 0.15)
                return " aboveavg";
            return "";
        }

        return "";
    };

    $scope.getCertificationStyle = function (_d) {
        var res = $scope.getCrewCerStatus($scope.selected_crew, $scope.contextMenuCellData.startDate);
        var style = { background: 'cornflowerblue' };
        var invalid =   res.expired.length > 0;
        if (invalid)
            return { background: '#cc0000' };

        return style;
    };

    //$scope.getCertificationStyle = function (_d) {
    //    var style = { background: '#f7f7f7' };
    //    var isValid = true;
    //    if ((!_d.RemainMedical && _d.RemainMedical !== 0) || _d.RemainMedical < 0)
    //        return { background: '#cc0000' };

    //    return style;
    //};
    $scope.calculateOrder = function (c) {
        if (!c.FTL) {
            
            return;
        }
        if (!c.FTL.Flight28Remain && c.FTL.Flight28Remain !== 0)
            return 10000;
        return Number(c.FTL.Flight28Remain);
    };
    $scope.getCFTLStyle = function (v, t) {
        if (!$scope.FDPStat.Duty || !$scope.FDPStat.Flight)
            return;
        var m = $scope.FDPStat.Duty;
        if (t == 1)
            m = $scope.FDPStat.Flight;

        var n = v - m;

        if (n < 0) return " isover";
        else
            return "";

    };
    $scope.doFDP = function () {

        var dto = {
            Id: -1,
            IsGantt: 1,
            IsAdmin: $scope.isAdmin ? 1 : 0,
            Extension: Math.round($scope.FDPStat.Extended),
            UserName: $rootScope.userName,
            CrewId: $scope.selected_crew.CrewId,
        };
        var _ids = [];
        $.each($scope.flt_selected_obj, function (_i, _d) {
            var _id = { id: _d.ID, dh: _d.Position == 'DH' || _d.Position == 'D/H' ? 1 : 0 };
            _id.pos = _d.Position == 'DH' ? $scope.getDefaultPos($scope.selected_crew.JobGroup) : $scope.getPos(_d.Position);
            _ids.push(_id);

        });
        dto.ids = _ids;
        dto.rank = $scope.getPos($scope.getMainPos(_ids));
        dto.group = $scope.selected_crew.JobGroup;
        dto.no = Enumerable.From($scope.flt_selected_obj).Select('$.FlightNumber').ToArray().join('_');
        dto.key = Enumerable.From($scope.flt_selected_obj).Select('$.ID').ToArray().join('_');
        dto.key2 = Enumerable.From(_ids).Select('$.id+"*"+$.dh').ToArray().join('_');
        dto.scheduleName = $scope.selected_crew.ScheduleName;
        dto.from = $scope.flt_selected_obj[0].FromAirportId;
        dto.to = $scope.flt_selected_obj[$scope.flt_selected_obj.length - 1].ToAirportId;
        dto.homeBase = $scope.selected_crew.BaseAirportId;
        dto.split = $scope.useSplit;
        dto.maxFDP = $scope.FDPStat.MaxFDPExtended;
        dto.flights = [];
       
        //yook
        schedulingService.getFDPIndex(dto.key2, dto.rank).then(function (responsex) {
            //alert(response);
            ///////////////
            ///////////////
            dto.index = responsex;
            $scope.loadingVisible = true;
            schedulingService.saveFDP(dto).then(function (response) {
                $scope.loadingVisible = false;

             
                if (response.Code == 406 || (response.data && response.data.Code == 406)) {
                    if (response.data.message) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "Error",
                            message: response.data.message,
                            buttons: [{ text: "OK", onClick: function () { } }]
                        });
                        myDialog.show();
                    }

                } else
                    if (response.data && response.data.Code == 501) {
                        var _data = response.data.data;
 
                        General.Confirm("The selected crew is on STANDBY. Do you want to activate him/her?", function (res) {
                            if (res) {

                                $scope.activeStby($scope.selected_crew, _data.Id, dto.rank, dto.index, dto);

                            }
                        });
                    }
                    else
                        if (response.Code == 304 || (response.data && response.data.Code == 304)) {
                            var myDialog = DevExpress.ui.dialog.custom({
                                rtlEnabled: true,
                                title: "Error",
                                message: "You can not activate this reserved crew.",
                                buttons: [{ text: "OK", onClick: function () { } }]
                            });
                            myDialog.show();
                        }
                else if ([413, 412, 428, 314, 307, 328,308].indexOf(response.Code)!=-1 || (response.data && [413, 412, 428, 314, 307, 328,308].indexOf(response.data.Code)!=-1  )) {
                    var myDialog = DevExpress.ui.dialog.custom({
                        rtlEnabled: true,
                        title: "Error",
                        message: response.data.message,
                        buttons: [{ text: "OK", onClick: function () { } }]
                    });
                    myDialog.show();
                }
                        else {
                           
                            var gres = response.data;

                            var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + $scope.selected_crew.CrewId).FirstOrDefault();

                            var offset1 = -1 * (new Date(gres.InitStart)).getTimezoneOffset();
                            gres.InitStart = (new Date(gres.InitStart)).addMinutes(offset1);

                            var offset2 = -1 * (new Date(gres.InitEnd)).getTimezoneOffset();
                            gres.InitEnd = (new Date(gres.InitEnd)).addMinutes(offset2);

                            var offset3 = -1 * (new Date(gres.InitRestTo)).getTimezoneOffset();
                            gres.InitRestTo = (new Date(gres.InitRestTo)).addMinutes(offset3);


                            resource.duties.push(gres);
                            $.each(resource.duties, function (_j, _f) {
                                _f.top = null;
                            });
                            $scope.setTopDuty(resource.duties);
                            resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();


                            $scope.dg_crew_abs_ds = [];
                            $scope.getFDPsByFlights();


                             
                                $scope.getDutiesByCrew();


                    var _dfx = moment($scope.dt_from).format('YYYY-MM-DD');
                    var _dtx = moment($scope.dt_to).format('YYYY-MM-DD');
                    schedulingService.getCrewFlightTimeByCrew($scope.selected_crew_id, _dfx, _dtx).then(function (_cres) {
                        console.log('cres cres ',_cres);
                        var _res = Enumerable.From($scope.crews).Where('$.CrewId==' + $scope.selected_crew_id).FirstOrDefault();
                        if (_res) {
                            _res.FX = 0;
                            _res.BL = 0;
                            _res.FL =0;
                            if (_cres) {
                                _res.FX = _cres.FixTime;
                                _res.BL = _cres.JLBlockTime;
                                _res.FL = _cres.JLFlightTime;
                            }

                           
                        }
                    });

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            // $scope.popup_flt_visible = false;
                            //$scope.ati_fdps.push(fdp);

                            //$scope.currentAssigned.CrewIds.push(crew.Id);
                            //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'] = crew.Id;
                            //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString()] = crew.ScheduleName;
                            //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Group'] = crew.JobGroup;
                            //if (!crew.FlightSum)
                            //    crew.FlightSum = 0;
                            //crew.FlightSum += $scope.FDPStat.Flight;
                            //$scope.fillFilteredCrew();
                            //$scope.fillRangeFdps();
                            //$scope.fillFlightCrews();
                            //$scope.fillRangeCrews();
                            //$scope.getAssigned();
                        }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //////////////
            ///////////////
        });
    };
    $scope.popup_flt_visible = false;
    $scope.popup_flt_title = 'Flights';
    $scope.popup_flt = {
        shading: true,
        width: $(window).width()-100,
        height: $(window).height() - 40,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Profile', icon: '', onClick: function (e) {
                        //$scope.showProfile2();
                        $scope.getDutiesByCrew();
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'save', onClick: function (e) {
                        //test obs,check for cockpit and cabin
                        if ($scope.continuity || $scope.overlapping) {
                            General.ShowNotify('Interuption/Continuity Error in selected flights.', 'error');
                            return;
                        }
                        if ($scope.FDPStat.IsOver) {
                            General.ShowNotify('The FDP is OVER', 'error');
                            return;
                        }
                        $scope.doFDP();


                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_flt_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            

        },
        onShown: function (e) {
            
            $scope.prepare_gantt_flt();
            $scope._datefrom_flt = $scope.contextMenuCellData.startDate;
            $scope.datefrom_flt = General.getDayFirstHour(new Date($scope._datefrom_flt));
            var dt = $scope.contextMenuCellData.startDate;
            $scope.getFlights(new Date(dt));
            $scope.getFtlAbs($scope.selected_crew.CrewId, dt, function (ftl) {
                $scope.selected_crew.FTL = ftl[0];
                
            });
            $scope.getFDPsByFlights();
            $scope.dg_flt_instance.repaint();
            $scope.dg_crew_abs_instance.repaint();
        },
        onHiding: function () {
            $scope.crew_duties_history = [];
            $scope.selected_crew_id = null;
            $scope.popup_flt_visible = false;

        },
       // position: { my: 'right', at: 'right', of: window, offset: '-15 0' },
        bindingOptions: {
            visible: 'popup_flt_visible',

            title: 'popup_flt_title',
            //'toolbarItems[0].visible': 'IsEditable',
            //'toolbarItems[1].visible': 'IsEditable',

        }
    };
    $scope.getDefaultPositionId = function (pos) {

        switch (pos) {
            case 'IP':
            case 'IP1':
            case 'IP2':
            case 'IP3':
            case 'IP4':
            case 'IP5':
            case 'TRE':
            case 'TRI':
            case 'LTC':
                //return 1206;
                return 12000;
            case 'P1':
            case 'P12':
            case 'P13':
            case 'P14':
            case 'P15':
            case 'P11':
                return 1160;
            case 'P2':
            case 'P21':
            case 'P22':
            case 'P23':
            case 'P24':
            case 'P25':
                return 1161;
            case 'Safety':
            case 'Safety1':
            case 'Safety2':
            case 'SAFETY':
            case 'SAFETY1':
            case 'SAFETY2':
            case 'SAFETY3':
            case 'SAFETY4':
            case 'SAFETY5':
                return 1162;
            case 'ISCCM':
            case 'ISCCM1':
            case 'ISCCM2':
            case 'ISCCM3':
            case 'ISCCM4':
            case 'ISCCM5':
                return 10002;
            case 'SCCM':
            case 'SCCM1':
            case 'SCCM2':
            case 'SCCM3':
            case 'SCCM4':
            case 'SCCM5':
                return 1157;
            case 'CCM':
            case 'CCM1':
            case 'CCM2':
            case 'CCM3':
            case 'CCM4':
            case 'CCM5':
                return 1158;
            case 'OBS':
            case 'OBS1':
            case 'OBS2':
            case 'OBS3':
            case 'OBS4':
            case 'OBS5':
                return 1153;
            case 'CHECK':
            case 'CHECK1':
            case 'CHECK2':
            case 'CHECK3':
            case 'CHECK4':
            case 'CHECK5':

                return 1154;
            default:
                return pos;
        }
    };
    $scope.activeStby = function (crew, stbyid, rank, index, fdp) {

        //FDPId
        var flts = Enumerable.From($scope.flt_selected_obj).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
        var fltIds = Enumerable.From(flts).Select('$.ID').ToArray();
        var fltIdsStr = fltIds.join('*');

       

        $scope.loadingVisible = true;
        schedulingService.checkStbyActivation(($scope.FDPStat.Extended > 0 ? 1 : 0), stbyid, flts[0].ID, $scope.FDPStat.Duty, $scope.FDPStat.MaxFDPExtended).then(function (response) {
            $scope.loadingVisible = false;
            
            if (response.maxFDPError) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: 'MAX FDP ERROR DUE TO STBY REDUCTION',
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }
            if (response.durationError) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: 'TOTAL DURATION IS GREATER THAN 18 HOURS',
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }

            //dlunaz
            var dto = {
                crewId: crew.CrewId,
                stbyId: stbyid,
                fids: fltIdsStr,
                rank: $scope.getDefaultPositionId(rank),
                rank2: Enumerable.From(flts).Select(function (_d) { return _d.Position == 'DH' ? $scope.getDefaultPos($scope.selected_crew.JobGroup) : $scope.getPos(_d.Position) }).ToArray().join('_'),
                index: index,
                isgantt:1,
            };
           
            
            $scope.loadingVisible = true;

            schedulingService.activateStby(dto).then(function (response) {
                $scope.loadingVisible = false;
                 
                var gres = response;//.data;

                var resource = Enumerable.From($scope.ganttData.resources).Where('$.CrewId==' + $scope.selected_crew.CrewId).FirstOrDefault();

                var offset1 = -1 * (new Date(gres.InitStart)).getTimezoneOffset();
                gres.InitStart = (new Date(gres.InitStart)).addMinutes(offset1);

                var offset2 = -1 * (new Date(gres.InitEnd)).getTimezoneOffset();
                gres.InitEnd = (new Date(gres.InitEnd)).addMinutes(offset2);

                var offset3 = -1 * (new Date(gres.InitRestTo)).getTimezoneOffset();
                gres.InitRestTo = (new Date(gres.InitRestTo)).addMinutes(offset3);


                resource.duties.push(gres);
                $.each(resource.duties, function (_j, _f) {
                    _f.top = null;
                });
                $scope.setTopDuty(resource.duties);
                resource.maxTop = Enumerable.From(resource.duties).Select('Number($.top)').Max();


                $scope.dg_crew_abs_ds = [];

                $scope.popup_flt_visible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };

    $scope.ganttFlightData = {};

    $scope._datefrom_flt = new Date();  // new Date(2023, 2, 6);
    $scope.datefrom_flt = General.getDayFirstHour(new Date($scope._datefrom_flt));

     
    $scope.getRegisterOrder = function (reg) {
        if (reg == 'CNL')
            return "ZZZZZZZZZ";
        var c = reg.slice(-1);
        return c;
    };
    $scope.gantt_flights = null;
    $scope.getFlights = function (df, callback) {
        var dt = new Date(df);
        dt = dt.addDays(1);
        var _df = moment(new Date(df)).format('YYYY-MM-DD');
        var _dt = moment(new Date(dt)).format('YYYY-MM-DD');
        $scope.loadingVisible = true;
        schedulingService.getSchFlights(_df, _dt).then(function (response0) {
            var response = response0.result;
            $scope.gantt_flights = response0.flights;
            response = Enumerable.From(response).OrderBy(function (x) { return $scope.getRegisterOrder(x.Register); }).ToArray();
            $scope.loadingVisible = false;
            //console.log(response);
            response.dates = [];
            var tempDate = new Date(df);
            var i = 1;
            while (new Date(tempDate) <= new Date(dt)) {
                response.dates.push({
                    date: new Date(tempDate),
                    caption: moment(tempDate).format("MMM-DD"),
                    hours:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
                });
                tempDate = tempDate.addDays(1);
                i++;
            }
            response.dates.push({
                date: new Date(tempDate),
                caption: moment(tempDate).format("MMM-DD"),
                hours: ['00', '01', '02', '03', '04', '05', '06' ],
            });
           
            $.each(response, function (_i, _d) {
               


                if (_d.Flights && _d.Flights.length > 0) {
                    // _d.flights = Enumerable.From(crews.duties).Where('$.CrewId==' + _d.CrewId).ToArray();

                    $scope.setTopFlight(_d.Flights);
                    _d.maxTop = Enumerable.From(_d.Flights).Select('Number($.top)').Max();
                }
                else
                    _d.maxTop = 0;

            //    $.each(_c.Items, function (_j, _d) {

            //        var offset1 = -1 * (new Date(_d.InitStart)).getTimezoneOffset();
            //        _d.InitStart = (new Date(_d.InitStart)).addMinutes(offset1);

            //        var offset2 = -1 * (new Date(_d.InitEnd)).getTimezoneOffset();
            //        _d.InitEnd = (new Date(_d.InitEnd)).addMinutes(offset2);

            //        var offset3 = -1 * (new Date(_d.InitRestTo)).getTimezoneOffset();
            //        _d.InitRestTo = (new Date(_d.InitRestTo)).addMinutes(offset3);
            //    });


            });
            $scope.ganttFlightData = response;
            //if (callback) {
            //    callback(response);
            //}

            $scope.dg_flt_instance.columnOption('Position', 'lookup.dataSource', $scope.position_ds);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    }
    
      
    /////////////////////////////////////////////////
    //menux
    $scope.$on('$viewContentLoaded', function () {

        $(function () {
            $.contextMenu({
                selector: '.context-menu-one',
                callback: function (itemKey, opt, e) {
                    // Alert the key of the item and the trigger element's id.
                    
                   // alert("Clicked on " + itemKey + " on element " + opt.$trigger[0].id);
                    $scope.new_event(itemKey, opt.$trigger[0].id);
                    // Do not close the menu after clicking an item
                    //return true;
                },
                items:
                {
                    "PROFILE": {
                        name: "<span style='font-weight: bold; color:green'>PROFILE</span>",
                        isHtmlName: true, icon: "help"
                    },
                   "sep1000": "---------",
                    "FDP": {
                        name: "<span style='font-weight: bold'>FDP</span>",
                        isHtmlName: true, icon: "add"
                    },
                  //  "sep1000": "---------",
                    "STBY-AM": {
                        name: "<span style='font-weight: bold'>STBY-AM</span>",
                        isHtmlName: true, icon: "add"
                    },
                  //  "sep1001": "---------",
                    "STBY-PM": {
                        name: "<span style='font-weight: bold'>STBY-PM</span>",
                        isHtmlName: true, icon: "add"
                    },
                  //  "sep1002": "---------",
                    "STBY-C": {
                        name: "<span style='font-weight: bold'>STBY-C</span>",
                        isHtmlName: true, icon: "add"
                    },
                   // "sep1003": "---------",
                    "RESERVE": {
                        name: "<span style='font-weight: bold'>RESERVE</span>",
                        isHtmlName: true, icon: "add"
                    },
                  //  "sep1004": "---------",
                    "RERRP": {
                        name: "<span style='font-weight: bold'>RERRP</span>",
                        isHtmlName: true, icon: "add"
                    },
                   // "sep1": "---------",

                    "OFF": {
                        name: "<span style='font-weight: bold'>OFF</span>",
                        isHtmlName: true, icon: "add"
                    },
                    "OFFICE": {
                        name: "<span style='font-weight: bold'>OFFICE</span>",
                        isHtmlName: true, icon: "add"
                    },

                    "TRAINING": {
                        name: "<span style='font-weight: bold'>TRAINING</span>",
                        isHtmlName: true, icon: "add"
                    },
                    "SIMULATOR": {
                        name: "<span style='font-weight: bold'>SIMULATOR</span>",
                        isHtmlName: true, icon: "add"
                    },
                   // "sep2": "---------",
                    "REQUESTED OFF": {
                        name: "<span style='font-weight: bold'>REQUESTED OFF</span>",
                        isHtmlName: true, icon: "add"
                    },
                   // "sep3": "---------",
                    "VACATION": {
                        name: "<span style='font-weight: bold'>VACATION</span>",
                        isHtmlName: true, icon: "add"
                    },
                   // "sep4": "---------",
                    "SICK": {
                        name: "<span style='font-weight: bold'>SICK</span>",
                        isHtmlName: true, icon: "add"
                    },
                    //"sep5": "---------",
                    //"GROUND": {
                    //    name: "<span style='font-weight: bold'>GROUND</span>",
                    //    isHtmlName: true, icon: "add"
                    //},
                   
                    //"EXP. LICENCE": {
                    //    name: "<span style='font-weight: bold'>EXP. LICENCE</span>",
                    //    isHtmlName: true, icon: "add"
                    //},
                   
                    //"EXP. MEDICAL": {
                    //    name: "<span style='font-weight: bold'>EXP. MEDICAL</span>",
                    //    isHtmlName: true, icon: "add"
                    //},
                  
                    //"EXP. PASSPORT": {
                    //    name: "<span style='font-weight: bold'>EXP. PASSPORT</span>",
                    //    isHtmlName: true, icon: "add"
                    //},
                   
                    
                    
                   
                    "MEETING": {
                        name: "<span style='font-weight: bold'>MEETING</span>",
                        isHtmlName: true, icon: "add"
                    },
                    "MISSION": {
                        name: "<span style='font-weight: bold'>MISSION</span>",
                        isHtmlName: true, icon: "add"
                    },
                    "BRIEFING": {
                        name: "<span style='font-weight: bold'>BRIEFING</span>",
                        isHtmlName: true, icon: "add"
                    },
                    
                    "DUTY": {
                        name: "<span style='font-weight: bold'>DUTY</span>",
                        isHtmlName: true, icon: "add"
                    },

                     
                }
            });

            $('.context-menu-one').on('click', function (e) {
                //console.log('clicked', this);
            });


            
                $.contextMenu({
                    selector: '.obj-duty',
                    callback: function (itemKey, opt, e) {
                        // Alert the key of the item and the trigger element's id.

                        // alert("Clicked on " + itemKey + " on element " + opt.$trigger[0].id);
                        $scope.delete_event(itemKey, opt.$trigger[0].id);
                        // Do not close the menu after clicking an item
                        //return true;
                    },
                    items:
                    {
                        "DELETE": {
                            name: "<span style='font-weight: bold'>DELETE</span>",
                            isHtmlName: true, icon: "delete"
                        },
                       


                    }
                });





        });

    });


    //////////////////////////////////////

}]);