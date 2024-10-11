'use strict';
app.controller('gntController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window) {

    $scope.prms = $routeParams.prms;
    $scope.footerfilter = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    $scope.IsMobile = detector.mobile() ? true : false;
    $scope.IsLandscape = $(window).width() > $(window).height();
    authService.setModule(3);
    $scope.tabsdatevisible = false;
    //////////////////////////////////////
    $scope._datefrom = new Date();


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '130px',
        displayFormat: "yyyy-MM-dd",
        adaptivityEnabled: true,
        pickerType: 'rollers',
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
    $scope.search = function () {
        $scope.stop();
        $scope.StopUTimer();
        $scope.bindFlights(function () {
            $scope.createGantt();

        });
    };
    $scope.btn_search_mobile = {
        text: '',
        type: 'success',
        icon: 'search',
        width: 40,
        validationGroup: 'flightboarddate',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            //yati
            $scope.search();

        }

    };
    $scope.btn_log_mobile = {
        text: '',
        type: 'default',
        icon: 'fas fa-plane-departure',
        width: '40',
        bindingOptions: {
            // disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {

            $scope.showLog();

        }

    };


    $scope.autoUpdate = true;

    /////////////////////////////////////////
    $scope.boardSummary = {
        Arrived: '-',
        Departed: '-',
        TotalFlight: '-',
        BaggageWeight: '-',
        BlockTime: '-',
        Canceled: '-',
        Date: '-',
        Delay: '-',
        Diverted: '-',
        FuelActual: '-',
        Pax: '-',
        TotalSeat: '-',
        CargoPerPax: '-',
        DelayRatio: '-',
        PaxLoad: '-',
        DelayStr: '-',
        BlockTimeStr: '-',
    };
    $scope.getBoardSummary = function (date) {
        $scope.boardSummary = {
            Arrived: '-',
            Departed: '-',
            TotalFlight: '-',
            BaggageWeight: '-',
            BlockTime: '-',
            Canceled: '-',
            Date: '-',
            Delay: '-',
            Diverted: '-',
            FuelActual: '-',
            Pax: '-',
            TotalSeat: '-',
            CargoPerPax: '-',
            DelayRatio: '-',
            PaxLoad: '-',
            DelayStr: '-',
            BlockTimeStr: '-',
        };
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        //zook
        flightService.getBoardSummary(Config.CustomerId, y, m, d).then(function (response) {

            if (response)

                $scope.boardSummary = response;

            console.log($scope.boardSummary);


        }, function (err) { $scope.loadingVisible = false; });
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
             
            $scope.getBoardSummary($scope.selectedDate);
 


        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_date = [


    ];
    $scope.tabs_date_options = {
        scrollByContent: true,
        showNavButtons: true,
        
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
    var hourWidth = 65;
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
        return flt.FlightStatus.toLowerCase();
    }
    $scope.getDuration = function (d1, d2) {
        var diff = Math.abs(d1.getTime() - d2.getTime()) / 3600000;
        return diff;
    }

    $scope.getFlightWidth = function (flt) {
        var duration = $scope.getDuration(new Date(flt.ChocksIn ? flt.ChocksIn : flt.STA), new Date(flt.STD));
        var w = duration * hourWidth;
        return w + "px";
    }
    $scope.getDelayStyle = function (flt) {
        if (!flt.ChocksOut || new Date(flt.ChocksOut) <= new Date(flt.STD))
            return { width: 0 };
        var duration = $scope.getDuration(new Date(flt.ChocksOut), new Date(flt.STD));
        var w = duration * hourWidth;
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
        //console.log(f.FlightNumber);
        //if (f.FlightNumber == '0020') {
        //           alert(new Date($scope.datefrom));
        //           alert(new Date(f.STD));
        //       }
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
        if (new Date(f.STD) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;
        //console.log(index);
        //console.log(res);

        style.top = top + 'px';
        return style;
    }
    $scope.getResStyle = function (res) {
        return {
            minHeight: (res.maxTop + 50) + 'px'
        };
    };
    $scope.getResCaptionStyle = function (res) {
        return {
            lineHeight: (res.maxTop + 45) + 'px'
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
    $scope.nextDay = 0;
    $scope.preDay = 0;
    var getOffset = function (dt) {
        var _oof = (new Date(dt)).getTimezoneOffset();
        return _oof;
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
        for (var i = 1; i <= $scope.days_count; i++) {
            for (var j = 0; j < 24; j++) {
                var offset = getOffset(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0));
                var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(offset);
                //var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-270);

                var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "<span class='second-time'>" + moment(secondDate).format('HH:mm') + "</span></div>";
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
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"

                + "</tr></table>"
            var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + tbl + "</div>";
            $dayBar.append(dayElem);

            if (i < $scope.days_count) {
                var midleft = i * 24 * (hourWidth + 1) - 1;
                var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
                $flightArea.append(midline);
            }


            tempDate = tempDate.addDays(1);
        }
        if ($scope.IsNowLine) {
            var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
            var nowleft = (_left * (hourWidth + 1));
            var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
            var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
            $flightArea.append(nowline);
            $flightArea.append(nowTime);
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

        
        //return new Date(x.STD) <= new Date(flt.STD) && x.ID != flt.ID
        //   && (
        //       (new Date(flt.STD) >= new Date(x.STD) && new Date(flt.STD) < new Date(x.STA))
        //     || (new Date(flt.STA) > new Date(x.STD) && new Date(flt.STA) < new Date(x.STA))
        //    || (new Date(flt.STD) > new Date(x.ChocksOut) && new Date(flt.STD) < new Date(x.ChocksIn))
        //       || (new Date(flt.STA) > new Date(x.ChocksOut) && new Date(flt.STA) < new Date(x.ChocksIn))
       


        //       || (new Date(flt.ChocksOut) >= new Date(x.STD) && new Date(flt.ChocksOut) < new Date(x.STA))
        //       || (new Date(flt.ChocksIn) > new Date(x.STD) && new Date(flt.ChocksIn) < new Date(x.STA))


        //        || (new Date(flt.ChocksOut) >= new Date(x.ChocksOut) && new Date(flt.ChocksOut) < new Date(x.ChocksIn))
        //       || (new Date(flt.ChocksIn) > new Date(x.ChocksOut) && new Date(flt.ChocksIn) < new Date(x.ChocksIn))
        //    );
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
                if (i == 0)
                { cf.top = j; last = cf;  }
                else
                {
                    if (!$scope.IsConflict(cf, last))
                    { cf.top = j; last = cf; } 
                }
               
            }
            _flights = Enumerable.From(_flights).Where('$.top==null').ToArray();
            console.log('_flights.length');
            console.log(_flights.length);
            j=j+50;
        }
    }
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
    $scope.bindFlights = function (callback) {
        $scope.baseDate = (new Date(Date.now())).toUTCString();
        dfrom = $scope._datefrom;
        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
        $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));
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

                // var nextdayFlight = Enumerable.From(response.flights).Where(function (x) { return new Date(x.STA) > $scope.dateEnd || (!x.ChocksIn ? false : new Date(x.ChocksIn) > $scope.dateEnd); }).FirstOrDefault();
                // if (nextdayFlight)
                //    $scope.days_count++;
                $.each(response.resources, function (_i, _d) {

                    var flights = Enumerable.From(response.flights).Where('$.RegisterID==' + _d.resourceId)
                        .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                        .ToArray();
                     //if (_d.resourceId == 69)
                       
                    $.each(flights, function (_j, _q) {
                      
                        _q.STD = moment(_q.STD);
                        _q.STA = moment(_q.STA);

                        if (_q.ChocksIn)
                            _q.ChocksIn = moment(_q.ChocksIn);
                        if (_q.ChocksOut)
                            _q.ChocksOut = moment(_q.ChocksOut);


                        if (!_q.ChocksIn)
                            _q.ChocksIn = new Date(_q.STA);
                        if (!_q.ChocksOut)
                            _q.ChocksOut = new Date(_q.STD);

                       
                        //_q.top = 0;
                        //if (_j > 0) {
                        //    var cnflt = $scope.findConflict(_q, flights);
                           
                        //    if (cnflt)
                        //    { _q.top = 50 + (cnflt.top ? cnflt.top : 0); }
                        //}
                    });
                    $scope.setTop(flights);
                    _d.maxTop = Enumerable.From(flights).Select('Number($.top)').Max();
                    $scope.totalHeight += _d.maxTop;
                    _d.flights = flights;
                });

                //5-17
                response.resources = Enumerable.From(response.resources).OrderBy(function (x) { return $scope.getResOrderIndex(x.resourceName); }).ToArray();


                $scope.ganttData = response;
                console.log(response);
                callback();
            }
            catch (ex) {
                alert(ex);
            }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.utimer = null;
    $scope.baseDate = null;
    $scope.StartUTimer = function () {
        // return;
        //tooki
        $scope.utimer = setTimeout(function () {
            //'info' | 'warning' | 'error' | 'success' | 'custom'
            console.log(new Date());

            //////////////////////////
            var dto = {
                from: (new Date($scope.datefrom)).toUTCString(),
                to: (new Date($scope.dateEnd)).toUTCString(),
                baseDate: $scope.baseDate,
                airport: $scope.airportEntity ? $scope.airportEntity.Id : -1,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                //yati
                userid: $rootScope.userId ? $rootScope.userId : -1,

            };

            flightService.getUpdatedFlights(dto).then(function (response) {
                console.log('UpdatedFlights');
                console.log(response);
                $scope.baseDate = (new Date(Date.now())).toUTCString();

                $.each(response.flights, function (_i, _d) {
                    _d.STD = moment(_d.STD);
                    _d.STA = moment(_d.STA);
                    _d.ChocksIn = moment(_d.ChocksIn);
                    _d.ChocksOut = moment(_d.ChocksOut);
                    var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();
                    if (_flight)
                        for (var key in _d) {
                            if (_d.hasOwnProperty(key)) {
                                _flight[key] = _d[key];
                                //console.log(key + " -> " + _d[key]);
                            }
                        }
                    //var data = Enumerable.From($scope.dataSource).Where("$.ID==" + _d.ID).FirstOrDefault();
                    //if (data) {


                    //    $scope.doActionCompleteSave = false;
                    //    $scope.fillFlight(data, _d);
                    //    Flight.processDataOffBlock(data);
                    //    $scope.addUpdatedFlights(data);


                    //    ganttObj.reRenderChart();


                    //    if ($scope.flight)
                    //        $('.task-' + $scope.flight.ID).parent().addClass('e-gantt-taskbarSelection');

                    //    $scope.calculateSummary();

                    //}
                });
                if (response.summary != -1)
                    $scope.baseSum = response.summary;
                ///////////////////////////////////////////
                ////////////////////////////////////////////
                if (response && response.flights && response.flights.length > 0) {
                    var ff = response.flights[0];
                    var time = moment(ff.DateStatus).format("MMMM Do YYYY, h:mm:ss a");
                    var text = ff.FromAirportIATA + "-" + ff.ToAirportIATA + ", " + ff.FlightNumber + ", " + ff.FlightStatus;
                    //DevExpress.ui.notify({
                    //    contentTemplate: function (e) {
                    //        var html = "<div style='width:100%;text-align:center'><span style=' font-size:16px;display:inline-block'>" + time + ": </span> "
                    //            + "<span style=' font-size:16px;display:inline-block;font-weight:bold;margin-left:10px'>" + text + "</span> <div>";
                    //        return html;
                    //    },
                    //    // message: "fight updated",
                    //    position: {
                    //        my: "top center",
                    //        at: "top center"
                    //    },
                    //    type: 'custom',
                    //    displayTime: 5000,
                    //    minHeight: 100,
                    //});
                }

                //////////////////////////////////////////
                $scope.getBoardSummary($scope.selectedDate);
                ///////////////////////////////////////////

            }, function (err) { });

            /////////////////////////////
            $scope.StartUTimer();
        }, 1000 * 30);
    };
    $scope.StopUTimer = function () {
        if ($scope.utimer)
            clearTimeout($scope.utimer);
    };

    $scope.finished = function () {
        $scope.flightsRendered++;
        if ($scope.flightsRendered == $scope.ganttData.flights.length) {
            
            $scope.refreshHeights();
            if ($scope.IsNowLine) {
                $scope.autoUpdate = true;
                $scope.StartUTimer();

            }
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
        var std = Enumerable.From($scope.ganttData.flights).Where(function (x) { return new Date(x.STD) >= dt; }).ToArray();
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

    $scope.showLog = function (isApply) {
        if (!$scope.flight) {
            General.ShowNotify(Config.Text_NoFlightSelected, 'error');
            return;
        }

        console.log($scope.flight);
        if (!$scope.flight.FuelUnitID)
            $scope.flight.FuelUnitID = 115;
        if (!$scope.flight.CargoUnitID)
            $scope.flight.CargoUnitID = 111;

        $scope.flight.STA2 = new Date($scope.flight.STA);
        $scope.flight.STD2 = new Date($scope.flight.STD);

        //$scope.calculateTotalPax();
        $scope.popup_xlog_visible = true;

        //if (isApply) {
        //    $scope.$apply(function () {
        //        if ($(window).width() > 1400)
        //            $scope.popup_log_visible = true;
        //        else
        //            $scope.popup_xlog_visible = true;
        //    });
        //}
        //else {
        //    if ($(window).width() > 1400)
        //        $scope.popup_log_visible = true;
        //    else
        //        $scope.popup_xlog_visible = true;
        //}


    }
    ////////////////////////////////
    $scope.IsOffBlockReadOnly = false;
    $scope.IsTakeOffReadOnly = false;
    $scope.IsLandingReadOnly = false;
    $scope.IsOnBlockReadOnly = false;
    $scope.isRedirectReasonVisible = true;
    $scope.isRampReasonVisible = true;
    ////////////////////////////////////
    $scope.dg_delay_selected = null;
    $scope.dg_delay_columns = [
        {
            caption: 'Delay', columns: [
                { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: true, fixedPosition: 'left' },
                { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', width: 70, dataType: 'string', allowEditing: false, },
                { dataField: 'Remark', caption: 'Remark', allowResizing: true, dataType: 'string', allowEditing: false, },

                //  { dataField: 'HH', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 80 },
                { dataField: 'Amount', caption: 'Amount', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 80 },

      //  { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

            ]
        }





    ];
    $scope.dg_delay_height = 100;

    $scope.dg_delay_instance = null;
    $scope.dg_delay_ds = [];
    $scope.dg_delay = {
        editing: {
            allowUpdating: true,
            mode: 'cell'
        },
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
        },
        searchPanel: {
            visible: false
        },
        groupPanel: {
            visible: false
        },
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

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_delay_columns,
        onContentReady: function (e) {
            if (!$scope.dg_delay_instance)
                $scope.dg_delay_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_delay_selected = null;



            }
            else {
                $scope.dg_delay_selected = data;


            }


        },
        height: 210,
        summary: {
            totalItems: [{
                name: "TotalDelay",
                showInColumn: "Amount",
                displayFormat: "{0}",

                summaryType: "custom"
            },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "TotalDelay") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Total;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }




            }
        },

        bindingOptions: {
            dataSource: 'dg_delay_ds', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };
    $scope.dg_crew_abs_columns = [
       {
           caption: 'Crew', columns: [
                { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
               { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
              // { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
              // { dataField: 'ScName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
               { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },



           ]
       }

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
        height: 274,// $(window).height() - 250,// 490 

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
    $scope.timeBase = 'LCB';
    $scope.sb_timebase = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['UTC', 'LCL', 'LCB'],
        //readOnly:true,
        onValueChanged: function (e) {
            if (e.value == 'UTC' && (e.previousValue == 'LCL' || e.previousValue == 'LCB')) {
                $scope.convertToUTC();
            }
            else if ((e.value == 'LCL' || e.value == 'LCB') && e.previousValue == 'UTC')
                $scope.convertToLCL();

        },
        bindingOptions: {
            value: 'timeBase',
            // readOnly: 'depReadOnly'
        }
    };
    $scope.sb_status = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: Enumerable.From(Flight.statusDataSource).Where('$.selectable').ToArray(),
        onSelectionChanged: function (e) {
            //$scope.IsOffBlockReadOnly = true;
            //$scope.IsTakeOffReadOnly = true;
            //$scope.IsLandingReadOnly = true;
            //$scope.IsOnBlockReadOnly = true;
            /////////////////////////////
            var bg = 'rgb(238, 238, 238)';
            var color = '#000';
            if (e && e.selectedItem) {
                bg = e.selectedItem.bgcolor;
                color = e.selectedItem.color;
            }
            // $('#status_caption').css('color', color).css('background', bg);

            $scope.remark_status_height = 128;
            $scope.isTimeStatusVisible = false;
            $scope.isCancelReasonVisible = false;
            // $scope.isRampReasonVisible = false;
            // $scope.isRedirectReasonVisible = false;
            if (e.selectedItem.id == 4) {
                $scope.isCancelReasonVisible = true;
                $scope.remark_status_height = 74;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.flight.CancelDate ? new Date($scope.flight.CancelDate) : null;
            }
            //ramp
            if (e.selectedItem.id == 9) {
                // $scope.isRampReasonVisible = true;
                $scope.remark_status_height = 74;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.flight.RampDate ? new Date($scope.flight.RampDate) : null;
            }
            //redirect
            if (e.selectedItem.id == 17) {
                // $scope.isRedirectReasonVisible = true;
                $scope.remark_status_height = 40;
                // $scope.isTimeStatusVisible = true;
                //$scope.time_status_value = $scope.flight.RedirectDate? new Date($scope.flight.RedirectDate):null;
                //$scope.entity_redirect.AirportId = $scope.flight.ToAirport? $scope.flight.ToAirport:null;
            }

            /////////////////////////

            //if (e.selectedItem.id == 21) {
            //    $scope.IsOffBlockReadOnly = false;

            //}

            //if (e.selectedItem.id == 2) {
            //    $scope.IsOffBlockReadOnly = false;
            //    $scope.IsTakeOffReadOnly = false;

            //}
            //if (e.selectedItem.id == 3) {
            //    $scope.IsOffBlockReadOnly = false;
            //    $scope.IsTakeOffReadOnly = false;
            //    $scope.IsLandingReadOnly = false;

            //}
            //if (e.selectedItem.id == 3) {
            //    $scope.IsOffBlockReadOnly = false;
            //    $scope.IsTakeOffReadOnly = false;
            //    $scope.IsLandingReadOnly = false;

            //}
            //if (e.selectedItem.id == 15) {
            //    $scope.IsOffBlockReadOnly = false;
            //    $scope.IsTakeOffReadOnly = false;
            //    $scope.IsLandingReadOnly = false;
            //    $scope.IsOnBlockReadOnly = false;

            //}
            ///////////////////////////

        },
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'flight.FlightStatusID',

        }
    };
    $scope.sb_flighttype = {
        readOnly: true,
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.FlightTypeID',

        }
    };
    $scope.sb_massunit = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(110),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.CargoUnitID',
            readOnly: 'depReadOnly'
        }
    };
    $scope.sb_volumeunit = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.FuelUnitID',
            text: 'flight.FuelUnit',
            readOnly: 'depReadOnly'
        }
    };
    $scope.sb_volumeunit2 = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        readOnly: true,
        bindingOptions: {
            value: 'flight.FuelUnitID',

        }
    };
    $scope.sb_cancel_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.CancelReasonId',
            // visible:'isCancelReasonVisible'
        }
    };
    $scope.sb_redirect_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1147),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.RedirectReasonId',

        }
    };
    $scope.sb_ramp_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.RampReasonId',

        }
    };
    $scope.num_fphh = {
        max: 99, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'flight.FPFlightHH'
        }
    };
    $scope.num_fpmm = {
        max: 59, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'flight.FPFlightMM'
        }
    };
    $scope.num_totaldelayhh = {
        max: 99, min: 0, width: 45, showSpinButtons: false, readOnly: true,
        bindingOptions: {
            value: 'flight.TotalDelayHH'
        }
    };
    $scope.num_totaldelayhhmm = {
        max: 59, min: 0, width: 45, showSpinButtons: false, readOnly: true,
        bindingOptions: {
            value: 'flight.TotalDelayMM'
        }
    };

    $scope._time_redirect = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',

        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'entity_redirect.RedirectDate',


        }
    };
    $scope.txt_cancel_remark = {
        bindingOptions: {
            value: 'entity_cancel.CancelRemark',


        }
    };
    $scope.txt_redirect_remark = {
        bindingOptions: {
            value: 'entity_redirect.RedirectRemark',


        }
    };

    $scope.txt_charterer = {
        readOnly: true,
        bindingOptions: {
            //value: 'entity_redirect.RedirectRemark',


        }
    };
    $scope.time_redirect_sta = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'entity_redirect.STA',
            min: 'flight.Takeoff',

        }
    };
    $scope.sb_redirect_airport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;

        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity_redirect.AirportId',
            selectedItem: 'entity_redirect.Airport',
        }
    };
    $scope.flightTakeOff = null;
    $scope.takeOffReadOnly = false;
    $scope.time_takeoff = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightTakeOff',
            min: 'flight.ChocksOut',
            readOnly: 'takeOffReadOnly'
        }
    };
    $scope.calculateTotalDelay = function () {
        if (!$scope.flightOffBlock2) {
            $scope.flight.TotalDelayHH = null;
            $scope.flight.TotalDelayMM = null;
            $scope.flight.TotalDelayTotalMM = 0;
            return;
        }
        var d1 = new Date($scope.flight.STD);
        var d2 = new Date($scope.flightOffBlock2);
        if (d1 > d2) {
            $scope.flight.TotalDelayHH = 0;
            $scope.flight.TotalDelayMM = 0;
            $scope.flight.TotalDelayTotalMM = 0;
            return;
        }
        var delay = (subtractDates(d1, d2));
        var hh = Math.floor(delay / 60);
        var mm = delay % 60;
        $scope.flight.TotalDelayHH = hh;
        $scope.flight.TotalDelayMM = mm;
        $scope.flight.TotalDelayTotalMM = delay;
        if (delay && delay > 0) {
            $('.tdelay').addClass('pink');
        }
        else {
            $('.tdelay').removeClass('pink');
        }
    };
    $scope.flightTakeOff2 = null;

    $scope.time_takeoff2 = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            //  $scope.calculateTotalDelay();

        },
        bindingOptions: {
            value: 'flightTakeOff2',
            //    min: 'flight.baseStartDate',
            readOnly: 'IsTakeOffReadOnly',
            disabled: 'IsTakeOffReadOnly',
        }
    };
    $scope.time_takeoff2_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightTakeOff2',
            //  min: 'flight.baseStartDate',
            readOnly: 'IsTakeOffReadOnly',
            disabled: 'IsTakeOffReadOnly',
        }
    };


    $scope.flightOffBlock = null;
    $scope.time_offblock = {
        type: "datetime",
        width: '100%',
        interval: 5,
        bindingOptions: {
            value: 'flightOffBlock',
            min: 'flight.baseStartDate',
        }
    };
    $scope.depReadOnly = true;
    $scope.flightOffBlock2 = null;
    $scope.time_offblock2 = {
        //type: "datetime",
        //displayFormat: "yyyy MMM dd",
        type: "date",
        width: '100%',
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        interval: 5,
        bindingOptions: {
            value: 'flightOffBlock2',
            // min: 'flight.baseStartDate',
            readOnly: 'IsOffBlockReadOnly',
            disabled: 'IsOffBlockReadOnly'
        }
    };
    $scope.time_offblock2_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        bindingOptions: {
            value: 'flightOffBlock2',
            readOnly: 'IsOffBlockReadOnly',
            disabled: 'IsOffBlockReadOnly'
        }
    };

    $scope.flightOnBlock = null;
    $scope.time_onblock = {
        type: "datetime",
        width: '100%',
        interval: 5,
        bindingOptions: {
            value: 'flightOnBlock',
            //  min: 'flight.Landing',
        }
    };

    $scope.flightOnBlock2 = null;
    $scope.time_onblock2 = {
        type: "date",
        width: '100%',
        interval: 5,

        bindingOptions: {
            value: 'flightOnBlock2',
            //min: 'flight.STA',
            readOnly: 'IsOnBlockReadOnly',
            disabled: 'IsOnBlockReadOnly',
        }
    };
    $scope.time_onblock2_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightOnBlock2',
            //min: 'flight.STA',
            readOnly: 'IsOnBlockReadOnly',
            disabled: 'IsOnBlockReadOnly',
        }
    };


    $scope.flightLanding = null;
    $scope.landingReadOnly = false;
    $scope.time_landing = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightLanding',
            min: 'flight.STA',
            readOnly: 'landingReadOnly'
        }
    };


    $scope.flightLanding2 = null;

    $scope.time_landing2 = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightLanding2',
            // min: 'flight.STA',
            readOnly: 'IsLandingReadOnly',
            disabled: 'IsLandingReadOnly',
        }
    };
    $scope.time_landing2_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightLanding2',
            readOnly: 'IsLandingReadOnly',
            disabled: 'IsLandingReadOnly',
        }
    };




    $scope.time_std = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.STD',

        }
    };

    $scope.time_sta = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.STA',

        }
    };
    $scope.time_baseStart = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.baseStartDate',

        }
    };
    $scope.time_baseEnd = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.baseEndDate',

        }
    };
    $scope.time_chocksout = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.ChocksOut',

        }
    };
    $scope.time_chocksin = {
        type: "time",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.ChocksIn',

        }
    };

    $scope.time_landed = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.Landing',

        }
    };


    $scope.remark_dep = {
        bindingOptions: {
            value: 'flight.DepartureRemark',
            readOnly: 'depReadOnly'
        }
    };
    $scope.remark_arr = {
        bindingOptions: {
            value: 'flight.ArrivalRemark',
        }
    };
    $scope.fuel_dep = {
        min: 0,
        bindingOptions: {
            value: 'flight.FuelDeparture',
            readOnly: 'depReadOnly'
        }
    };
    $scope.fuel_fp = {
        min: 0,
        bindingOptions: {
            value: 'flight.FPFuel',
            readOnly: 'depReadOnly'
        }
    };
    $scope.fuel_defuel = {
        min: 0,
        bindingOptions: {
            value: 'flight.Defuel',
            readOnly: 'depReadOnly'
        }
    };
    $scope.fuel_arr = {
        min: 0,
        bindingOptions: {
            value: 'flight.FuelArrival'
        }
    };

    $scope.paxTotal = 0;
    $scope.paxOver = 0;
    $scope.calculateTotalPax = function () {
        $scope.paxTotal = 0;
        var sum = 0;
        if ($scope.flight.PaxAdult)
            sum += $scope.flight.PaxAdult;
        if ($scope.flight.PaxChild)
            sum += $scope.flight.PaxChild;
        // if ($scope.flight.PaxInfant)
        //     sum += $scope.flight.PaxInfant;
        if ($scope.flight.TotalSeat && sum > $scope.flight.TotalSeat) {
            $scope.flight.PaxOver = sum - $scope.flight.TotalSeat;
        }
        else
            $scope.flight.PaxOver = 0;
        $scope.flight.TotalPax = sum;

        if ($scope.flight.TotalSeat) {
            var cof = round2(sum * 100.0 / (1.0 * $scope.flight.TotalSeat), 2);
            $scope.loadPax = cof + ' %';

        }

    };
    $scope.total_seats = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.TotalSeat'
        }
    };
    $scope.total_pax = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.TotalPax'
        }
    };
    $scope.loadPax = null;
    $scope.load_pax = {
        readOnly: true,
        bindingOptions: {
            value: 'loadPax'
        }
    };
    $scope.pax_adult = {
        readOnly: false,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'flight.PaxAdult',
            readOnly: 'depReadOnly'
        }
    };
    $scope.sb_acpos = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 0, Title: 'Caspian Ramp' }, { Id: 1, Title: 'Civil Ramp' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.JLBLHH',


        }
    };
    $scope.pax_child = {
        readOnly: false,
        showSpinButtons: true,
        min: 0,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'flight.PaxChild',
            readOnly: 'depReadOnly'
        }
    };
    $scope.pax_infant = {
        readOnly: false,
        showSpinButtons: true,
        min: 0,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'flight.PaxInfant',
            readOnly: 'depReadOnly'
        }
    };
    $scope.pax_over = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            readOnly: 'depReadOnly',
            value: 'flight.PaxOver',
        }
    };
    $scope.cargo_piece = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'flight.CargoCount',
            readOnly: 'depReadOnly'
        }
    };
    $scope.cargo_weight = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'flight.CargoWeight',
            readOnly: 'depReadOnly'
        }
    };
    $scope.cargo_excess = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            readOnly: 'depReadOnly'
        }
    };
    $scope.bag_piece = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'flight.BaggageCount',
            readOnly: 'depReadOnly'
        }
    };
    $scope.bag_weight = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'flight.BaggageWeight',
            readOnly: 'depReadOnly'
        }
    };
    $scope.bag_excess = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            readOnly: 'depReadOnly'
        }
    };

    //ati log
    $scope.convertToUTC = function () {
        //dlu
        var offset = -1 * (new Date()).getTimezoneOffset();
        offset = -1 * offset;
        //(new Date(_d.STA)).addMinutes(offset);
        $scope.flight.STA2 = (new Date($scope.flight.STA)).addMinutes(offset);
        $scope.flight.STD2 = (new Date($scope.flight.STD)).addMinutes(offset);

        $scope.flightOffBlock2 = (new Date($scope.flightOffBlock2)).addMinutes(offset);
        $scope.flightTakeOff2 = (new Date($scope.flightTakeOff2)).addMinutes(offset);
        $scope.flightLanding2 = (new Date($scope.flightLanding2)).addMinutes(offset);
        $scope.flightOnBlock2 = (new Date($scope.flightOnBlock2)).addMinutes(offset);

        $scope.time_status_value = (new Date($scope.time_status_value)).addMinutes(offset);

    };
    $scope.convertToLCL = function () {
        //dlu
        var offset = -1 * (new Date()).getTimezoneOffset();

        //(new Date(_d.STA)).addMinutes(offset);
        $scope.flight.STA2 = (new Date($scope.flight.STA)).addMinutes(offset);
        $scope.flight.STD2 = (new Date($scope.flight.STD)).addMinutes(offset);

        $scope.flightOffBlock2 = (new Date($scope.flightOffBlock2)).addMinutes(offset);
        $scope.flightTakeOff2 = (new Date($scope.flightTakeOff2)).addMinutes(offset);
        $scope.flightLanding2 = (new Date($scope.flightLanding2)).addMinutes(offset);
        $scope.flightOnBlock2 = (new Date($scope.flightOnBlock2)).addMinutes(offset);

        $scope.time_status_value = (new Date($scope.time_status_value)).addMinutes(offset);
    };
    $scope.otimes = null;
    $scope.timeBase = 'LCB';
    $scope.sb_timebase = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['UTC', 'LCL', 'LCB'],
        //readOnly:true,
        onValueChanged: function (e) {
            if (e.value == 'UTC' && (e.previousValue == 'LCL' || e.previousValue == 'LCB')) {
                $scope.convertToUTC();
            }
            else if ((e.value == 'LCL' || e.value == 'LCB') && e.previousValue == 'UTC')
                $scope.convertToLCL();

        },
        bindingOptions: {
            value: 'timeBase',
            // readOnly: 'depReadOnly'
        }
    };
    $scope.remark_status_height = 128;
    $scope.remark_status = {
        bindingOptions: {
            value: 'flight.DepartureRemark',
            height: 'remark_status_height',
        }
    };
    $scope.isTimeStatusVisible = false;
    $scope.time_status_value = null;
    $scope.time_status = {
        type: "datetime",

        width: '100%',


        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'time_status_value',


        }
    };

    $scope.time_redirect_value = null;
    $scope.time_redirect = {
        type: "datetime",

        width: '100%',


        onValueChanged: function (arg) {

            //  console.log(arg);
        },
        bindingOptions: {
            value: 'time_redirect_value',


        }
    };

    $scope.remark_redirect = {
        bindingOptions: {
            value: 'flight.RedirectRemark',
            height: '38',
        }
    };


    $scope.time_ramp_value = null;
    $scope.time_ramp = {
        type: "datetime",

        width: '100%',


        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'time_ramp_value',


        }
    };

    $scope.remark_ramp = {
        bindingOptions: {
            value: 'flight.RampRemark',
            height: '40',
        }
    };

    ////////////////////////////////
    $scope.FromWeatherVisible = true;
    $scope.moment = function (date) {
        return moment(date).format('MMMM Do YYYY');
    };
    $scope.momenttime = function (date) {
        if (!date)
            return '--';
        return moment(date).format('HH:mm');
    };
    $scope.getCrewAbs = function (fid) {
        //5-9
        if (!$rootScope.HasAccessToCrewList()) {
            $scope.dg_crew_abs_ds = [];
            return;
        }
        $scope.loadingVisible = true;
        var archived_crews = 0;
        if (new Date($scope.flight.Date) < new Date(2020, 6, 1, 0, 0, 0, 0))
            archived_crews = 1;

        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid, archived_crews).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_abs_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 120 },
        //height: 571,
    };
    ////////////////////////////////
    $scope.popup_xlog_visible = false;
    $scope.popup_xlog_title = 'Log';
    $scope.popup_xlog = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_xlog"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1520,
        //height: function () { return $(window).height() * 0.95 },
        height: 687,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_xlog_visible = false;
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
            //  $scope.otimes = {};
            //  $scope.otimes.STA = $scope.flight.STA;
            //  $scope.otimes.STD = $scope.flight.STD;

            if ($scope.flight.ChocksOut)
                $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            if (!$scope.flightOffBlock2)
                $scope.flightOffBlock2 = $scope.flight.STD;

            //else {

            //    $scope.flightOffBlock2 = Flight.getEstimatedOffBlock($scope.flight);
            //}

            $scope.flightTakeOff2 = $scope.flight.Takeoff;
            if (!$scope.flightTakeOff2)
                $scope.flightTakeOff2 = $scope.flight.STD;
            $scope.flightOnBlock2 = $scope.flight.ChocksIn;
            if (!$scope.flightOnBlock2)
                $scope.flightOnBlock2 = $scope.flight.STA;


            $scope.flightLanding2 = $scope.flight.Landing;
            if (!$scope.flightLanding2)
                $scope.flightLanding2 = $scope.flight.STA;

            if ($scope.flight.FlightStatusID == 4) {
                $scope.time_status_value = new Date($scope.flight.CancelDate);
            }
            else
                if ($scope.flight.FlightStatusID == 9) {
                    $scope.time_status_value = new Date($scope.flight.RampDate);
                }
            //else if ($scope.flight.FlightStatusID == 17) {
            //    $scope.time_status_value = new Date($scope.flight.RedirectDate);
            //    $scope.entity_redirect.AirportId = $scope.flight.ToAirport ;

            //}
            if ($scope.flight.RedirectReasonId) {

                $scope.time_redirect_value = new Date($scope.flight.RedirectDate);
                $scope.entity_redirect.AirportId = $scope.flight.ToAirport;
                // alert($scope.flight.ToAirport);
            }
            //hook
            $scope.depReadOnly = false;
            // $scope.selectedTabIndex = 0;
            // $scope.setWeather();

        },
        onShown: function (e) {
            $scope.loadingVisible = true;
            flightService.getFlightDelays($scope.flight.ID).then(function (response) {
                $scope.loadingVisible = false;
                $.each(response, function (_i, _d) {
                    var dc = {
                        Id: _d.DelayCodeId,
                        HH: _d.DelayHH ? _d.DelayHH : 0,
                        MM: _d.DelayMM ? _d.DelayMM : 0,
                        Code: _d.Code,
                        Title: _d.Title,
                        Remark: _d.Remark,
                        Total: null,
                    };

                    dc.Total = dc.HH * 60 + dc.MM;
                    dc.Amount = pad(dc.HH.toString()) + ':' + pad(dc.MM.toString());
                    $scope.dg_delay_ds.push(dc);
                });

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.flight.ID);

                // }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            if ($scope.before_refreshed_flight) {

                $scope.undoRefresh();
                // console.log($scope.flight);
                $scope.before_refreshed_flight = null;
            }
            $scope.timeBase = 'LCL';

            //  $scope.flight.STA= $scope.otimes.STA ;
            //   $scope.flight.STD= $scope.otimes.STD  ;



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;

            $scope.popup_xlog_visible = false;


        },
        bindingOptions: {
            visible: 'popup_xlog_visible',

            title: 'popup_xlog_title',


        }
    };
    //////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        $('.gnt').fadeIn(400, function () {
            ////////////////////////////////
            setTimeout(function () {
                $scope.bindFlights(function () {
                    $scope.createGantt();
                    if ($(window).width() > $(window).height()) {
                        //height: calc(100% - 300px);
                        $scope.footerfilter = false;
                        $('.gantt-main-container').height($(window).height() - 85);//.css('height', 'calc(100% - 40px)');
                    }
                    else {
                        $scope.footerfilter = true;
                        $('.gantt-main-container').height($(window).height() - 205);
                    }
                });
            }, 4000);








            ///////////////////////////////////
        });


    });
    $scope.$on("$destroy", function (event) {
        $scope.StopUTimer();
        //$scope.StopNowLineTimer();
        $scope.stop();

    });

    var appWindow = angular.element($window);

    appWindow.bind('resize', function () {

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