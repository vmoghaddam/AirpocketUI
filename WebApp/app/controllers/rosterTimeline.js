'use strict';
app.controller('rosterTimelineController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window) {
    $scope.OnlyRoster = false;
    $scope.IsCabin = true;
    $scope.IsCockpit = false;
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
    $scope.formatMinutes = function (mm) {
        if (!mm)
            return "";
        var sgn = ' ';
        if (mm < 0) {
            mm = -1 * mm; sgn = '-';
        }

        return sgn + (pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString());
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





    //dlui
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
    //dluq
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };



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
    var hourWidth = 3.5;
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
        var _std = General.getDayFirstHour(new Date(flt.STD));
        var _sta = (new Date(General.getDayFirstHour(new Date(flt.STA)))).addDays(0);  
        var duration = $scope.getDuration(new Date(_sta), new Date(_std));
        var w = (duration * (hourWidth + 1))-2;
        flt._width = duration;
        return w + "px";
    }
    $scope.getDelayStyle = function (flt) {
       
        var _std =new Date( General.getDayFirstHour(new Date(flt.STD)) );
        var _sta = (new Date(General.getDayFirstHour(new Date(flt.STA)))).addDays(0);  //(new Date(_std)).addDays(1);
        if (flt.DutyType == 10000) {
            _sta = _sta.addDays(1);
        }
        var duration = $scope.getDuration(new Date(_sta), new Date(_std));
        if (duration < 24)
            duration = 24;
        var w = (duration * (hourWidth + 1)) - 2;
        //if (duration == 0)
         //   duration = 1;
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



       // var left = $scope.getDuration(/*new Date($scope.datefrom)*/new Date(dfirst), new Date(f.STD));

        var _std = General.getDayFirstHour(new Date(f.STD));
         
        var left = $scope.getDuration( new Date(dfirst), new Date( _std));
         style.left = (left * (hourWidth + 1)) + "px";
        
        var top = f.top;


        style.top = /*top*/ '0' + 'px';
        return style;
    }
    $scope.getDutyTextStyle = function (f) {
        var types = [1167, 1168];
        var i = types.indexOf(f.DutyType);
        return i == -1 ? { color: 'white' } : { color: 'black' };
    };
    $scope.getRestStyle = function (f) {
        var bk = '#e6e6e6';
        if (f.InteruptedId)
            bk = '#ff704d';
        return { background: bk };
    };
    $scope.getResStyle = function (res) {
        return {
            minHeight: (/*res.maxTop*/0 + 80) + 'px'
        };
    };
    $scope.getResCaptionStyle = function (res) {
        return {
            lineHeight: (/*res.maxTop*/0 + 75) + 'px'
        };
    }

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
            //for (var j = 0; j < 24; j++) {
            //    var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-270);

            //    var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "</div>";
            //    $timeBar.append(hourElem);
            //    if (c < 24 * $scope.days_count) {
            //        var hleft = c * (hourWidth + 1) - 0.8;
            //        var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
            //        $flightArea.append(hline);
            //    }

            //    c++;
            //}
            var tbl = "<table style='padding:0;width:95%'><tr>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM') + " (" + new persianDate(tempDate).format("DD-MM") + ")" + "</td>"
                
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
        $scope.loadingVisible = true;

        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        flightService.getDutyTimeLine(_df, _dt, $scope.rank, -1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.tabsdatefirst = true;
            $scope.tabs_date = [];
            var i = 1;
            var stdate = (dfrom);
            //for (i = 1; i <=  $scope.days_count  ; i++) {

            while (new Date(stdate) <= new Date($scope.dt_to)) {
                var str = moment(stdate).format("ddd DD-MMM-YYYY");
                $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD'), nkey: Number(moment(stdate).format('YYYYMMDD')), key: moment(stdate).format('YYYY-MM-DD'), dt: moment(stdate) });
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
                _q.dtkey = moment(_q.STD).format('YYYY-MM-DD');
            });
            response.flights = Enumerable.From(response.duties).ToArray();

            $scope.timeline_data = response;

            $scope.tlRes = Enumerable.From(response.resources).ToArray();
            //$scope.tlGroup = Enumerable.From(response.resources).ToArray();
             
            $.each(response.resources, function (_i, _d) {
                _d.flights = Enumerable.From(response.duties).Where('$.CrewId==' + _d.CrewId).ToArray();
                $.each($scope.tabs_date, function (_m, _x) {
                    var _exis = Enumerable.From(_d.flights).Where(function (_v) {
                        return _v.dtkey == _x.key
                            || (_x.nkey >  Number(moment(_v.DateStart).format('YYYYMMDD')) && _x.nkey <=  Number(moment(_v.DateEnd).format('YYYYMMDD')) && _v.DutyType!=1)
                    }).FirstOrDefault();
                    if (!_exis) {
                        var da1 = moment(new Date(_x.dt));
                        var da2 = moment( (new Date(_x.dt)).addHours(10));
                        _d.flights.push({ CrewId: _d.CrewId, DutyType: 1, DutyTypeTitle: 'ADD', STD: da1, STA: da2, ChocksOut: da1, DateStart: da1, DateEnd: da2 });
                    }
                });
                $.each(_d.flights, function (_m, _x) {
                    
                    if (_x.DutyType == 1165) {
                        var _fprts = _x.InitRoute.split(',');
                        var _rts = [];
                        for (let i = 0; i < _fprts.length - 1; i++) {
                            _rts.push('<div class="rts">'+_fprts[i]+'-' + _fprts[i+1]+'</div>');
                        }
                        _x.routes = _rts.join("");;
                    }
                });
                //$.each(_d.flights, function (_j, _q) {
                //    _q.STD = moment(_q.StartLocal);
                //    _q.STA = moment(_q.EndLocal);
                //});
                
                $scope.setTop(_d.flights);
                _d.maxTop = Enumerable.From(_d.flights).Select('Number($.top)').Max();
                $scope.totalHeight += _d.maxTop;


            });


            console.log($scope.timeline_data);
            $scope.ganttData = response;
            $scope.ati_flights = $scope.ganttData.flights;

            callback();


        }, function (err) { });

    };

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
                console.log('gantt', $scope.ganttData);
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
                // console.log();
                var $d = $(_d);
                $scope.ati_selectedFlights.push({ Id: $d.data('flightid'), dh: !$d.data('dh') ? 0 : $d.data('dh'), sta: new Date($d.data('sta')), std: new Date($d.data('std')), no: $d.data('no'), FromAirport: $d.data('from'), ToAirport: $d.data('to') });
                $scope.ati_selectedTypes.push($d.data('type'));

            });
            $scope.ati_selectedTypes = Enumerable.From($scope.ati_selectedTypes).Distinct().ToArray();

            $scope.setSelectedFlightsKey();
            //console.log($scope.ati_selectedTypes);
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

    $scope.rank = 'Cockpit';
    if ($scope.IsCabin && !$scope.IsCockpit)
        $scope.rank = 'Cabin';
    $scope.sb_rank = {
        placeholder: 'Rank',
        showClearButton: false,
        searchEnabled: false,
        readOnly: !($scope.IsCabin && $scope.IsCockpit),
        dataSource:['Cockpit','Cabin'], //['IP,P1', 'P2', 'TRE', 'TRI', 'P1', 'ISCCM,SCCM', 'CCM', 'ISCCM', 'SCCM'],

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
                $scope.createGantt();
               // $scope.initSelection();




                if ($(window).width() > $(window).height()) {
                    //height: calc(100% - 300px);
                    //$scope.footerfilter = false;
                    $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
                }
            });

        }

    };
    ///////////////////////////
    $scope.handleClick = function (evt, data) {
        console.log(data);
        switch (evt.which) {
            case 1:
                 // this is left click
               // $scope.popup_event_visible = true;
                break;
            case 2:
                // in case you need some middle click things
                break;
            case 3:
                 // this is right click
                //alert('right')
                break;
            default:
                alert("you have a strange mouse!");
                break;
        }
    }
    //////////////////////////////
    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
     
    $scope.popup_event_height = 300
    $scope.popup_event = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_event"
        },
        shading: true,
       // position: { my: 'right', at: 'right', of: window, offset: '-15 0' },
        //divargar-ok

        width: 450,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fblink', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //$scope.linkEntity.FromAirportId = $scope.flight.FlightNumber;
                        //$scope.linkEntity.ToAirportId = $scope.flight.FlightNumber;

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        





                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
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
            //magu2-17
            
        },
        onHiding: function () {

            // if ($scope.freeSaved)
            //    $scope.BeginSearch();
           
            $scope.popup_event_visible = false;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            height: 'popup_event_height',
            title: 'popup_event_title',

        }
    };

    //close button
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    //////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        $('.rostertimeline').fadeIn(400, function () {
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


    //////////////////////////////////////

}]);