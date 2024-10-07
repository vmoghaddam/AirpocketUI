'use strict';
app.controller('boardController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'fbService', '$http', '$q', '$sce', 'logService', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, fbService, $http, $q, $sce, logService) {
    $scope.prms = $routeParams.prms;

    var hourWidth = 85;
    authService.setModule(3);
    $rootScope.setTheme();

    $scope.IsPlanning = $rootScope.HasMenuAccess('flight_planning', 3);
    //flight_planning-edit
    $scope.IsStaion = $rootScope.roles.indexOf('Station') != -1;

    $scope.IsFuelReadOnly = false;
    $scope.IsJLAccess = $rootScope.HasMenuAccess('flight_board_jl', 3) || $scope.IsStaion;
    $scope.IsCLAccess = $rootScope.HasMenuAccess('flight_board_jl', 3) || $rootScope.userName.toLowerCase().startsWith('trans.') || $scope.IsStaion;
    //ops.rezabandehlou
    $scope.IsJLOG = false;
    if ($rootScope.userName.toLowerCase() == 'ops.rezabandehlou' || $rootScope.userName.toLowerCase() == 'demo' || $rootScope.userName.toLowerCase() == 'razbani')
        $scope.IsJLOG = true;
    $scope.IsPickup = $rootScope.userName.toLowerCase().startsWith('trans.');//|| $rootScope.userName.toLowerCase().startsWith('demo');
    $scope.IsCrewMobileVisible = $rootScope.userName.toLowerCase().startsWith('dis.') || $rootScope.userName.toLowerCase().startsWith('demo');
    $scope.IsSMSVisible = $rootScope.userName.toLowerCase().startsWith('dis.') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('ops.soltani') || $rootScope.userName.toLowerCase().startsWith('ops.esmaeili') || $rootScope.userName.toLowerCase().startsWith('razbani');
    $scope.IsNoCrewVisible = $rootScope.userName.toLowerCase().startsWith('dis.') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('razbani');
    $scope.airport = $routeParams.airport;
    $scope.airportEntity = null;
    $scope.filterVisible = false;
    $scope.IsDispatch = $route.current.isDispatch;
    $scope.IsDepartureVisible = true;
    $scope.IsArrivalVisible = true;
    $scope.IsDepartureDisabled = true;
    $scope.IsArrivalDisabled = true;
    $scope.IsAdmin = true;

    $scope.IsEditable = $rootScope.IsFlightBoardEditable();
    $scope.NotEditable = !$scope.IsEditable;
    $scope.IsSTBYVisible = $rootScope.IsFlightBoardEditable() || $rootScope.userName.toLowerCase().startsWith('ops.soltani') || $rootScope.userName.toLowerCase().startsWith('ops.esm');

    //2021-1-17
    $scope.IsRemark = $rootScope.userName.toLowerCase().startsWith('sale.');
    $scope.IsSave = $scope.IsEditable || $scope.IsStaion || $scope.IsRemark;

    //divargar-ok
    $scope.IsComm = $rootScope.userName.toLowerCase().startsWith('comm.') || true;
    $scope.NotIsComm = !$scope.IsComm;


    //alert((new Date()).yyyymmddtime(false));

    //  return;
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                // $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');

                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                // $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');

                $('.filter').show();
            }
        }

    };
    $scope.flight = null;
    $scope.takeOffVisible = false;
    $scope.offBlockVisible = false;
    $scope.onBlockVisible = false;
    $scope.landingVisible = false;



    $scope.record = null;

    $scope.showLog = function (isApply) {
        if ($scope.IsSelectionMode)
            return;
        if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
            General.ShowNotify(Config.Text_NoFlightSelected, 'error');
            return;
        }

        $scope.flight = $scope.selectedFlights[0];
        //if ($scope.flight.TypeId == 1000)
        //    return;
        if (!$scope.flight.FuelUnitID)
            $scope.flight.FuelUnitID = 115;
        if (!$scope.flight.CargoUnitID)
            $scope.flight.CargoUnitID = 111;

        $scope.flight.STA2 = new Date($scope.flight.STA);
        $scope.flight.STD2 = new Date($scope.flight.STD);

        $scope.calculateTotalPax();
        //kook
        if (!$scope.flight.Defuel)
            $scope.flight.Defuel = 230;
        //$rootScope.roles
        if ($rootScope.roles.indexOf('nopax') != -1) {
            $scope.flight.PaxAdult = null;
            $scope.flight.PaxChild = null;
            $scope.flight.PaxInfant = null;
            $scope.flight.TotalPax = null;
            $scope.loadPax = null;

        }

        if (isApply)
            $scope.$apply(function () {
                if ($scope.doUTC)
                    $scope.timeBaseReadOnly = true;
                else
                    $scope.timeBaseReadOnly = false;
                $scope.popup_log_visible = true;
            });
        else {
            if ($scope.doUTC)
                $scope.timeBaseReadOnly = true;
            else
                $scope.timeBaseReadOnly = false;
            $scope.popup_log_visible = true;
        }
    };
    //nook

    //2020-11-22
    $scope.flightGUID = null;
    $scope.forceUpdate = function () {
        var dto = {
            from: (new Date($scope.datefrom)).toUTCString(),
            to: (new Date($scope.dateEnd)).toUTCString(),
            baseDate: $scope.baseDate,
            airport: $scope.airportEntity ? $scope.airportEntity.Id : -1,
            customer: Config.CustomerId,
            tzoffset: -1 * (new Date()).getTimezoneOffset(),

            userid: $rootScope.userId ? $rootScope.userId : -1,

        };

        flightService.getUpdatedFlightsNew(dto).then(function (response) {

            $scope.baseDate = (new Date(Date.now())).toUTCString();

            $.each(response.flights, function (_i, _d) {
                //_d.STD = moment(_d.STD);
                //_d.STA = moment(_d.STA);
                //_d.ChocksIn = moment(_d.ChocksIn);
                //_d.ChocksOut = moment(_d.ChocksOut);
                //var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();
                //if (_flight)
                //    for (var key in _d) {
                //        if (_d.hasOwnProperty(key)) {
                //            _flight[key] = _d[key];
                //            //console.log(key + " -> " + _d[key]);
                //        }
                //    }
                var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();

                if (_flight) {
                    var oldresid = _flight.RegisterID;
                    for (var key of Object.keys(_d)) {
                        _flight[key] = _d[key];

                    }
                    $scope.modifyFlightTimes(_flight);
                    var res = { resourceId: _flight.RegisterID, resourceName: _flight.Register, groupId: _flight.TypeId };
                    $scope.modifyGantt(_flight, res, oldresid);

                }


            });
            if (response.summary != -1)
                $scope.baseSum = response.summary;
            ///////////////////////////////////////////
            ////////////////////////////////////////////
            if (response && response.flights && response.flights.length > 0) {
                var ff = response.flights[0];
                var time = moment(ff.DateStatus).format("MMMM Do YYYY, h:mm:ss a");
                var text = ff.FromAirportIATA + "-" + ff.ToAirportIATA + ", " + ff.FlightNumber + ", " + ff.FlightStatus;

            }

            //////////////////////////////////////////
            $scope.getBoardSummary($scope.selectedDate);
            ///////////////////////////////////////////

        }, function (err) { });
    };

    //aidin
    $scope.showLogX = function (isApply) {

        //if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
        //    General.ShowNotify(Config.Text_NoFlightSelected, 'error');
        //    return;
        //}

        //$scope.flight = $scope.ati_selectedFlights[0];
        //kakal
        if (!$scope.logFlight.FuelUnitID)
            $scope.logFlight.FuelUnitID = 115;
        if (!$scope.logFlight.CargoUnitID)
            $scope.logFlight.CargoUnitID = 111;

        $scope.logFlight.STA2 = new Date($scope.logFlight.STA);
        $scope.logFlight.STD2 = new Date($scope.logFlight.STD);

        //$scope.calculateTotalPax();
        //kook
        if (!$scope.logFlight.Defuel)
            $scope.logFlight.Defuel = 230;
        //$rootScope.roles
        if ($rootScope.roles.indexOf('nopax') != -1) {
            $scope.logFlight.PaxAdult = null;
            $scope.logFlight.PaxChild = null;
            $scope.logFlight.PaxInfant = null;
            $scope.logFlight.TotalPax = null;
            $scope.loadPax = null;

        }

        $scope.flight = $scope.logFlight;
        //janfe
        $scope.mchr.ChrAdult = $scope.logFlight.ChrAdult;
        $scope.mchr.ChrChild = $scope.logFlight.ChrChild;
        $scope.mchr.ChrInfant = $scope.logFlight.ChrInfant;
        $scope.mchr.ChrCapacity = $scope.logFlight.ChrCapacity;
        $scope.mchr.ChrCode = $scope.logFlight.ChrCode;
        $scope.mchr.ChrTitle = $scope.logFlight.ChrTitle;
        var _mchr = Enumerable.From($scope.mchr_ds).Where('$.Code=="' + $scope.logFlight.ChrCode + '"').FirstOrDefault();
        if (_mchr)
            $scope.mchr.ChartererId = _mchr.Id;
        else
            $scope.mchr.ChartererId = null;
        //05-12

        if ($scope.IsComm && !$scope.mchr.ChartererId)
            $scope.mchr.ChartererId = $scope.logFlight.DefaultChrId;


        //  alert($scope.logFlight.DefaultChrId);
        //  $scope.popup_log_visible = true;

        $scope.maxDepartureDate = General.getDayLastHour(new Date(new Date($scope.logFlight.STA).addDays(1)));

        $scope.minDepartureDate = General.getDayFirstHour(new Date(new Date($scope.logFlight.STA).addDays(-1)));

        if ($(window).width() < 1400)
            //$scope.popup_departure_visible = true;
            $scope.popup_lognew_visible = true;
        else
            $scope.popup_log_visible = true;
        //$scope.popup_lognew_visible = true;
        //2020-11-22
        $scope.flightGUID = null;
        flightService.getFlightGUID($scope.logFlight.ID).then(function (response) {
            $scope.flightGUID = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.showLogNew = function (isApply) {

        //if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
        //    General.ShowNotify(Config.Text_NoFlightSelected, 'error');
        //    return;
        //}

        //$scope.flight = $scope.ati_selectedFlights[0];
        //kakal
        if (!$scope.logFlight.FuelUnitID)
            $scope.logFlight.FuelUnitID = 115;
        if (!$scope.logFlight.CargoUnitID)
            $scope.logFlight.CargoUnitID = 111;

        $scope.logFlight.STA2 = new Date($scope.logFlight.STA);
        $scope.logFlight.STD2 = new Date($scope.logFlight.STD);

        //$scope.calculateTotalPax();
        //kook
        if (!$scope.logFlight.Defuel)
            $scope.logFlight.Defuel = 230;
        //$rootScope.roles
        if ($rootScope.roles.indexOf('nopax') != -1) {
            $scope.logFlight.PaxAdult = null;
            $scope.logFlight.PaxChild = null;
            $scope.logFlight.PaxInfant = null;
            $scope.logFlight.TotalPax = null;
            $scope.loadPax = null;

        }

        $scope.flight = $scope.logFlight;
        //alert('x');

        //console.log('fffffffffffffffffffffffff',$scope.flight);
        //  $scope.popup_log_visible = true;

        //janfe
        $scope.mchr.ChrAdult = $scope.logFlight.ChrAdult;
        $scope.mchr.ChrChild = $scope.logFlight.ChrChild;
        $scope.mchr.ChrInfant = $scope.logFlight.ChrInfant;
        $scope.mchr.ChrCapacity = $scope.logFlight.ChrCapacity;
        $scope.mchr.ChrCode = $scope.logFlight.ChrCode;
        $scope.mchr.ChrTitle = $scope.logFlight.ChrTitle;
        var _mchr = Enumerable.From($scope.mchr_ds).Where('$.Code=="' + $scope.logFlight.ChrCode + '"').FirstOrDefault();
        if (_mchr)
            $scope.mchr.ChartererId = _mchr.Id;
        else
            $scope.mchr.ChartererId = null;
        //05-12

        if ($scope.IsComm && !$scope.mchr.ChartererId)
            $scope.mchr.ChartererId = $scope.logFlight.DefaultChrId;
        $scope.maxDepartureDate = General.getDayLastHour(new Date(new Date($scope.logFlight.STA).addDays(1)));

        $scope.minDepartureDate = General.getDayFirstHour(new Date(new Date($scope.logFlight.STA).addDays(-1)));

        if ($(window).width() < 1400)
            $scope.popup_lognew_visible = true;
        else
            $scope.popup_lognew_visible = true;
        //$scope.popup_log_visible = true;
        //2020-11-22
        $scope.flightGUID = null;
        flightService.getFlightGUID($scope.logFlight.ID).then(function (response) {
            $scope.flightGUID = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.btn_log = {
        //text: 'Log',
        hint: 'Flight Log',
        type: 'default',
        icon: 'fas fa-info',
        width: '100%',
        bindingOptions: {
            // disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {


            // $scope.showLog();
            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            $scope.ati_resid = $scope.ati_flight.RegisterID;
            $scope.logFlight = JSON.parse(JSON.stringify($scope.ati_flight));
            //$scope.showLogX(false);
            $scope.showLogNew(false);




        }

    };

    $scope.freeSMS = false;
    $scope.btn_sms = {
        //text: 'SMS',
        hint: 'SMS Panel',
        type: 'default',
        icon: 'fas fa-bell',
        width: '100%',
        bindingOptions: {
            // disabled: 'IsDepartureDisabled'
            visible: 'IsSMSVisible',
        },
        onClick: function (e) {
            $scope.freeSMS = true;
            $scope.popup_notify2_visible = true;
        }

    };

    $scope.btn_crew = {
        text: 'Crew',
        type: 'default',
        icon: 'fas fa-user-circle',
        width: '100%',
        bindingOptions: {
            //disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {

            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            $scope.popup_crew_visible = true;




        }

    };
    $scope.linked_flight = {};
    $scope.linkEntity = {};
    $scope.time_ir_std_date = null;
    $scope.time_ir_std_time = null;
    $scope.time_ir_sta_date = null;
    $scope.time_ir_sta_time = null;
    //jik
    $scope.moment2 = function (date) {
        if (!date)
            return "";
        return moment(date).format('MM-DD-YYYY HH:mm');
    };
    $scope.moment3 = function (date) {
        if (!date)
            return "";
        return moment(date).format('YY-MM-DD HHmm');
    };
    $scope.setArrival = function () {
        if (!$scope.doIrRoute)
            return;
        if ($scope.linkEntity && $scope.time_ir_std_date != null && $scope.time_ir_std_time != null && $scope.linkEntity.FlightH != null && $scope.linkEntity.FlightM != null) {
            var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
            var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
            var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
            //alert(std);
            var sta = new Date(std.addHours($scope.linkEntity.FlightH).addMinutes($scope.linkEntity.FlightM));

            $scope.time_ir_sta_date = General.getDayFirstHour(new Date(sta));
            $scope.time_ir_sta_time = new Date(sta);

        }
        else {
            $scope.time_ir_sta_date = null;
            $scope.time_ir_sta_time = null;
        }
    };
    $scope.text_ir_flightnumber = {

        bindingOptions: {
            value: 'linkEntity.FlightNumber',

        }
    };
    $scope.text_ir_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'linkEntity.FlightH',

        }
    };
    $scope.text_ir_flightm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'linkEntity.FlightM',

        }
    };
    $scope.txt_ir_LinkedRemark = {

        bindingOptions: {
            value: 'linkEntity.LinkedRemark',


        }
    };
    $scope.useCrew = true;
    $scope.chk_ir_crew = {
        text: 'Use Crew',
        bindingOptions: {
            value: 'useCrew',
        }
    };
    //07-10
    $scope.time_ir_start = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {

            $scope.setArrival();
        },
        bindingOptions: {
            value: 'time_ir_std_date',

        }
    };
    $scope.time_ir_start_hh = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.setArrival();
        },
        bindingOptions: {
            value: 'time_ir_std_time',

        }
    };
    $scope.time_ir_end = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        readOnly: true,
        onValueChanged: function (arg) {

            // $scope.setArrival();
        },
        bindingOptions: {
            value: 'time_ir_sta_date',

        }
    };
    $scope.time_ir_end_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HHmm",
        interval: 15,
        readOnly: true,
        onValueChanged: function (arg) {

            //$scope.setArrival();
        },
        bindingOptions: {
            value: 'time_ir_sta_time',

        }
    };
    $scope.sb_ir_fromairport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},
        onSelectionChanged: function (arg) {

            $scope.getIrRoute();
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'linkEntity.FromAirportId',


        }
    };
    $scope.sb_ir_toairport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},
        onSelectionChanged: function (arg) {

            $scope.getIrRoute();
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'linkEntity.ToAirportId',

        }
    };
    $scope.sb_ir_flighttype = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'linkEntity.FlightTypeID',

        }
    };
    //2020-11-16
    $scope.realMSNs = [];

    $scope.getRealMSNs = function (cid, callback) {
        //return new DevExpress.data.DataSource({
        //    store:

        //        new DevExpress.data.ODataStore({
        //            //url: $rootScope.serviceUrl + 'odata/aircrafts/customer/'+cid+'?$filter=isvirtual%20eq%20false' ,
        //            url: $rootScope.serviceUrl + 'odata/aircrafts/customer/' + cid,
        //             version: 4
        //        }),

        //    sort: ['AircraftType', 'Register'],
        //});

        //divargar-ok
        //05-13
        flightService.getRealRegisters(cid).then(function (response) {
            $scope.realMSNs = Enumerable.From(response)
                //.Where('!$.isvirtual')
                .Where(function (x) { return !x.Register.startsWith('CNL') /*&& x.Register.startsWith('V')*/; })
                .OrderBy('$.isvirtual').ThenBy('$.TFC')
                .ThenBy('$.Register').ToArray();
            console.log('REAL MESNS', $scope.realMSNs);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    ////////////////////////////////////////////
    //dlus
    $scope.getSbTemplateAircraft = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left'>" + data.Register + "</div>"
            + "<div class='tmpl-col-right'>" + data.AircraftType + "</div>"


            + "</div>";
        return tmpl;
    };

    //05-13
    $scope.sb_ir_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $scope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Register', 'MSN'],
        //2020-11-16
        //dataSource: $scope.getRealMSNs(Config.CustomerId),
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'linkEntity.RegisterID',
            //2020-11-16
            dataSource: 'realMSNs',


        }
    };
    $scope.getIrRoute = function () {
        if (!$scope.doIrRoute)
            return;
        if ($scope.linkEntity && $scope.linkEntity.FromAirportId && $scope.linkEntity.ToAirportId) {
            $scope.loadingVisible = true;
            flightService.getRoute($scope.linkEntity.FromAirportId, $scope.linkEntity.ToAirportId).then(function (response) {

                if (response) {
                    $scope.linkEntity.FlightH = response.FlightH;
                    $scope.linkEntity.FlightM = response.FlightM;
                }
                $scope.loadingVisible = false;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };
    $scope.btn_link = {
        text: 'Link',
        type: 'default',
        icon: 'fas fa-link',
        width: 120,

        onClick: function (e) {
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];
            $scope.doIrRoute = true;
            $scope.linkEntity = { ID: -1, CustomerId: Config.CustomerId };// JSON.parse(JSON.stringify($scope.flight));
            $scope.linkEntity.LinkedFlight = $scope.flight.ID;
            if ($scope.flight.RedirectReasonId) {
                // $scope.linkEntity.Alt = $scope.flight.ToAirport;
                //    $scope.linkEntity.AltIATA = $scope.flight.ToAirportIATA;
                $scope.linkEntity.ToAirportId = $scope.flight.OToAirportId;
                $scope.linkEntity.ToAirportIATA = $scope.flight.OToAirportIATA;
                $scope.linkEntity.FlightNumber = null;
                $scope.linkEntity.FlightPlanId = null;
                $scope.linkEntity.FromAirportId = $scope.flight.ToAirport;
                $scope.linkEntity.FromAirportIATA = $scope.flight.ToAirportIATA;
                $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.flight.STD));
                $scope.time_ir_std_time = null; //new Date($scope.linkEntity.STD);
                $scope.time_ir_sta_date = null; //General.getDayFirstHour(new Date($scope.linkEntity.STA));
                $scope.time_ir_sta_time = null; //new Date($scope.linkEntity.STA);
                $scope.linkEntity.FlightTypeID = null;
                $scope.linkEntity.RegisterID = $scope.flight.RegisterID;

                //General.getDayFirstHour(new Date($scope._datefrom))

            }
            $scope.popup_link_visible = true;

        }

    };

    $scope.btn_free = {
        // text: 'Nonscheduled Flight',
        //text: 'N/S Flight',
        hint: 'New Flight',
        type: 'default',
        icon: 'fas fa-plus',
        width: '100%',

        onClick: function (e) {
            //pipi
            $scope.doIrRoute = true;
            $scope.linkEntity = { ID: -1, CustomerId: Config.CustomerId };
            var _df = General.getDayFirstHour(new Date($scope.selectedDate));
            $scope.time_ir_std_date = new Date(_df);

            //divargar-ok
            $scope.time_interval_from_date = new Date($scope.selectedDate);
            $scope.time_interval_to_date = new Date($scope.selectedDate);
            $scope.interval_days = [];
            $scope.interval_days.push((new Date($scope.selectedDate)).getDay());

            $scope.popup_free_visible = true;

        }

    };

    $scope.btn_roster = {
        // text: 'Nonscheduled Flight',
        text: 'Roster',
        type: 'default',
        icon: '',
        width: 120,

        onClick: function (e) {

            $scope.popup_roster_visible = true;

        }

    };



    $scope.before_refreshed_flight = null;
    $scope.undoRefresh = function () {
        $scope.flight.FlightStatusID = $scope.before_refreshed_flight.FlightStatusID;
        $scope.flight.DepartureRemark = $scope.before_refreshed_flight.DepartureRemark;
        //   $scope.time_status_value = $scope.before_refreshed_flight.;

        $scope.flight.CancelReasonId = $scope.before_refreshed_flight.CancelReasonId;
        $scope.flight.CancelRemark = $scope.before_refreshed_flight.CancelRemark;
        $scope.flight.CancelDate = $scope.before_refreshed_flight.CancelDate;

        $scope.flight.RedirectReasonId = $scope.before_refreshed_flight.RedirectReasonId;
        $scope.flight.RedirectRemark = $scope.before_refreshed_flight.RedirectRemark;
        $scope.flight.RedirectDate = $scope.before_refreshed_flight.RedirectDate;

        $scope.flight.RampReasonId = $scope.before_refreshed_flight.RampReasonId;
        $scope.flight.RampRemark = $scope.before_refreshed_flight.RampRemark;
        $scope.flight.RampDate = $scope.before_refreshed_flight.RampDate;


        $scope.flight.ToAirport = $scope.before_refreshed_flight.ToAirport;
        $scope.flight.ToAirportIATA = $scope.before_refreshed_flight.ToAirportIATA;
        $scope.flight.OToAirportId = $scope.before_refreshed_flight.OToAirportId;
        $scope.flight.OToAirportIATA = $scope.before_refreshed_flight.OToAirportIATA;


        $scope.flight.FPFlightHH = $scope.before_refreshed_flight.FPFlightHH;
        $scope.flight.FPFlightMM = $scope.before_refreshed_flight.FPFlightMM;
        $scope.flight.FPFuel = $scope.before_refreshed_flight.FPFuel;
        $scope.flight.Defuel = $scope.before_refreshed_flight.Defuel;

        $scope.flight.TotalDelayHH = $scope.before_refreshed_flight.TotalDelayHH;
        $scope.flight.TotalDelayMM = $scope.before_refreshed_flight.TotalDelayMM;
        $scope.flight.TotalDelayTotalMM = $scope.before_refreshed_flight.TotalDelayTotalMM;

        $scope.flight.PaxAdult = $scope.before_refreshed_flight.PaxAdult;
        $scope.flight.PaxChild = $scope.before_refreshed_flight.PaxChild;
        $scope.flight.PaxInfant = $scope.before_refreshed_flight.PaxInfant;
        $scope.flight.BaggageCount = $scope.before_refreshed_flight.BaggageCount;
        $scope.flight.BaggageWeight = $scope.before_refreshed_flight.BaggageWeight;
        $scope.flight.CargoWeight = $scope.before_refreshed_flight.CargoWeight;
        $scope.flight.CargoCount = $scope.before_refreshed_flight.CargoCount;

        $scope.flight.FuelDeparture = $scope.before_refreshed_flight.FuelDeparture;
        $scope.flight.FuelArrival = $scope.before_refreshed_flight.FuelArrival;


        $scope.flight.ChocksOut = $scope.before_refreshed_flight.ChocksOut;
        $scope.flight.Takeoff = $scope.before_refreshed_flight.Takeoff;
        $scope.flight.Landing = $scope.before_refreshed_flight.Landing;
        $scope.flight.ChocksIn = $scope.before_refreshed_flight.ChocksIn;
        //sepehr
        $scope.flightOffBlock2 = $scope.flight.ChocksOut;
        if (!$scope.flightOffBlock2)
            $scope.flightOffBlock2 = $scope.flight.STD;
        $scope.flightTakeOff2 = $scope.flight.Takeoff;
        if (!$scope.flightTakeOff2)
            $scope.flightTakeOff2 = $scope.flight.STD;
        $scope.flightOnBlock2 = $scope.flight.ChocksIn;
        if (!$scope.flightOnBlock2)
            $scope.flightOnBlock2 = $scope.flight.STA;


        $scope.flightLanding2 = $scope.flight.Landing;
        if (!$scope.flightLanding2)
            $scope.flightLanding2 = $scope.flight.STA;


    };
    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'danger',
        //icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.before_refreshed_flight = JSON.parse(JSON.stringify($scope.flight));
            $scope.flight.FlightStatusID = 1;
            $scope.flight.DepartureRemark = null;
            $scope.time_status_value = null;

            $scope.flight.CancelReasonId = null;
            $scope.flight.CancelRemark = null;
            $scope.flight.CancelDate = null;

            $scope.flight.RedirectReasonId = null;
            $scope.flight.RedirectRemark = null;
            $scope.flight.RedirectDate = null;

            $scope.flight.RampReasonId = null;
            $scope.flight.RampRemark = null;
            $scope.flight.RampDate = null;

            if ($scope.flight.OToAirportId) {
                $scope.flight.ToAirport = $scope.flight.OToAirportId;
                $scope.flight.ToAirportIATA = $scope.flight.OToAirportIATA;
            }
            $scope.flight.FPFlightHH = null;
            $scope.flight.FPFlightMM = null;
            $scope.flight.FPFuel = null;
            $scope.flight.Defuel = null;

            $scope.flight.TotalDelayHH = null;
            $scope.flight.TotalDelayMM = null;
            $scope.flight.TotalDelayTotalMM = 0;

            $scope.flight.PaxAdult = null;
            $scope.flight.PaxChild = null;
            $scope.flight.PaxInfant = null;
            $scope.flight.BaggageCount = null;
            $scope.flight.BaggageWeight = null;
            $scope.flight.CargoWeight = null;
            $scope.flight.CargoCount = null;

            $scope.flight.FuelDeparture = null;
            $scope.flight.FuelArrival = null;

            $scope.dg_delay_ds = [];


            $scope.flight.ChocksOut = null;
            $scope.flight.Takeoff = null;
            $scope.flight.Landing = null;
            $scope.flight.ChocksIn = null;
            $scope.flight.UsedFuel = null;
            $scope.flight.JLBLHH = null;
            $scope.flight.JLBLMM = null;
            $scope.flight.PFLR = null;
            $scope.flight.NightTime = null;
            //sepehr
            $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            if (!$scope.flightOffBlock2)
                $scope.flightOffBlock2 = $scope.flight.STD;
            $scope.flightTakeOff2 = $scope.flight.Takeoff;
            if (!$scope.flightTakeOff2)
                $scope.flightTakeOff2 = $scope.flight.STD;
            $scope.flightOnBlock2 = $scope.flight.ChocksIn;
            if (!$scope.flightOnBlock2)
                $scope.flightOnBlock2 = $scope.flight.STA;


            $scope.flightLanding2 = $scope.flight.Landing;
            if (!$scope.flightLanding2)
                $scope.flightLanding2 = $scope.flight.STA;



        }
    };
    function PrintElem2($elem) {
        // var mywindow = window.open('', 'PRINT', 'height=700,width=1300');

        // mywindow.document.write('<html><head><title></title>');
        // mywindow.document.write('<link rel="stylesheet" href="http://localhost:30273/content/css/main.css" type="text/css" />');
        //  mywindow.document.write('</head><body >');
        //  mywindow.document.write('<h1>print</h1>');
        //// mywindow.document.write($elem.html());
        // mywindow.document.write('</body></html>');

        // mywindow.document.close(); // necessary for IE >= 10
        // mywindow.focus(); // necessary for IE >= 10*/

        // mywindow.print();
        // mywindow.close();

        /////////////////////////////////
        var mywindow = window.open('', 'my div', 'height=700,width=1300');
        //mywindow.document.onreadystatechange = function () {
        //    if (this.readyState === 'complete') {
        //        alert('x');
        //        this.onreadystatechange = function () { };
        //        mywindow.focus();
        //        mywindow.print();
        //        mywindow.close();
        //    }
        //}
        mywindow.document.head.innerHTML = '<title>PressReleases</title>';
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/bootstrap.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/w3.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/ionicons.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/fontawsome2.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/dx.common.css" rel="stylesheet" />');


        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/dx.light.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/material.blue-light.custom.css" rel="stylesheet" />');



        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/main.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/content/css/core-ui.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/sfstyles/default.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/sfstyles/default-responsive.css" rel="stylesheet" />');
        mywindow.document.head.innerHTML += ('<link href="http://localhost:30273/sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        mywindow.document.body.innerHTML = '<body>' + $elem.html() + '</body>';

        mywindow.document.close();
        //setTimeout(function () {
        //    mywindow.focus(); // necessary for IE >= 10
        //    mywindow.print();
        //    mywindow.close()
        //}, 500);



        ///////////////////////////////

        return true;
        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>DIV Contents</title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');
        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            //frame1.remove();
        }, 500);
    }
    function printCanvas(canvas) {

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('<style>');
        frameDoc.document.write('*{display: hidden;}');
        frameDoc.document.write('img{display: block; width: 100%; }');
        frameDoc.document.write('</style>');
        frameDoc.document.write('</head><body class="gantt" style="padding:0 !important;">');

        frameDoc.document.write("<div style='height:100%'><div style='text-align:center;margin-top:30px'>Caspian</div><div style='text-align:center;margin-top:10px'>Flights</div><img style='margin-top:10px;height:75%'  src = '" + canvas.toDataURL() + "'/></div>");
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }

    $scope.jl = {};
    //divargar-ok
    var _getFDPItemCount = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/flights/fdpitem/count/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    $scope.btn_delete = {
        hint: 'Delete Flight',
        type: 'danger',
        icon: 'fas fa-eraser',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            //05-12
            if ($scope.ati_selectedFlights[0].FlightStatusID != 1) {
                if ($scope.ati_selectedFlights[0].FlightStatusID != 4) {
                    General.ShowNotify("The flight cannot be deleted.", 'error');
                    return;
                }
            }
            _getFDPItemCount($scope.ati_selectedFlights[0].ID).then(function (response) {
                if (response) {
                    General.ShowNotify("The flight cannot be deleted.", 'error');
                    return;
                }
                $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
                $scope.ati_resid = $scope.ati_flight.RegisterID;

                if ($scope.IsComm && $scope.ati_selectedFlights[0].FlightStatusID != 4) {
                    $scope.time_interval_from_date = new Date($scope.ati_flight.STD);
                    $scope.time_interval_to_date = new Date($scope.ati_flight.STD);
                    $scope.interval_days = [];
                    $scope.interval_days.push((new Date($scope.ati_flight.STD)).getDay());
                    $scope.popup_delete_visible = true;
                }
                else {
                    General.Confirm(Config.Text_DeleteConfirm, function (res) {
                        if (res) {

                            var dto = { Id: $scope.ati_flight.ID, };
                            $scope.loadingVisible = true;
                            flightService.deleteFlight(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                //sooks
                                $scope.removeFromGantt($scope.ati_flight, $scope.ati_resid);


                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                        }
                    });
                }

            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });



            //$scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //$scope.ati_resid = $scope.ati_flight.RegisterID;

            //if ($scope.IsComm) {
            //    $scope.time_interval_from_date = new Date($scope.ati_flight.STD);
            //    $scope.time_interval_to_date = new Date($scope.ati_flight.STD);
            //    $scope.interval_days = [];
            //    $scope.interval_days.push((new Date($scope.ati_flight.STD)).getDay());
            //    $scope.popup_delete_visible = true;
            //}
            //else {
            //    General.Confirm(Config.Text_DeleteConfirm, function (res) {
            //        if (res) {

            //            var dto = { Id: $scope.ati_flight.ID, };
            //            $scope.loadingVisible = true;
            //            flightService.deleteFlight(dto).then(function (response) {
            //                $scope.loadingVisible = false;
            //                General.ShowNotify(Config.Text_SavedOk, 'success');
            //                //sooks
            //                $scope.removeFromGantt($scope.ati_flight, $scope.ati_resid);


            //            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            //        }
            //    });
            //}



        }
    };
    //sook



    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 110,
        onClick: function (e) {

            return;
            html2canvas(document.querySelector("#gantt_container_ba")).then(function (canvas) {
                // document.body.appendChild(canvas);
                //var a = document.createElement('a');

                //a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                // a.download = 'somefilename.jpg';
                //a.click();
                printCanvas(canvas);
            });
        }
    };


    $scope.fuelDepSaved = false;
    $scope.fuelArrSaved = false;
    $scope.$dgrow = null;

    $scope.fuelArrSaved = false;


    $scope.IsCancelVisible = false;



    $scope.IsRedirectVisible = false;



    $scope.getGantt = function () {
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        return ganttObj;
    };
    $scope.ganttData = null;
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.dataSource = [];

    $scope.totalFlights = '-';
    $scope.totalDelays = '-';
    $scope.departedFlights = '-';
    $scope.arrivedFlights = '-';
    $scope.canceledFlights = '-';
    $scope.departedPax = '-';
    $scope.arrivedPax = '-';
    $scope.calculateSummary = function () {
        //console.log('summary');
        //console.log($scope.dataSource);
        {
            $scope.totalFlights = $scope.dataSource.length;
            $scope.departedFlights = Enumerable.From($scope.dataSource).Where('$.Takeoff').ToArray().length;
            $scope.arrivedFlights = Enumerable.From($scope.dataSource).Where('$.Landing').ToArray().length;
            $scope.canceledFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==4').ToArray().length;
            $scope.redirectedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==17').ToArray().length;
            $scope.divertedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID== 7').ToArray().length;
            $scope.totalDelays = Enumerable.From($scope.dataSource).Where('$.ChocksOut').Select('$.delay').Sum();
            $scope.departedPax = Enumerable.From($scope.dataSource).Where('$.Takeoff').Select('$.TotalPax').Sum();
            $scope.arrivedPax = Enumerable.From($scope.dataSource).Where('$.Landing').Select('$.TotalPax').Sum();
        }
        if ($scope.airportEntity) {
            $scope.totalFlights = $scope.dataSource.length;
            $scope.departedFlights = Enumerable.From($scope.dataSource).Where('$.Takeoff && $.FromAirport==' + $scope.airportEntity.Id).ToArray().length;
            $scope.arrivedFlights = Enumerable.From($scope.dataSource).Where('$.Landing && $.ToAirport==' + $scope.airportEntity.Id).ToArray().length;
            $scope.canceledFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==4').ToArray().length;
            $scope.redirectedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==17').ToArray().length;
            $scope.divertedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID== 7').ToArray().length;
            $scope.totalDelays = Enumerable.From($scope.dataSource).Where('$.FromAirport==' + $scope.airportEntity.Id + ' && $.ChocksOut').Select('$.delay').Sum();
            $scope.departedPax = Enumerable.From($scope.dataSource).Where('$.Takeoff && $.FromAirport==' + $scope.airportEntity.Id).Select('$.TotalPax').Sum();
            $scope.arrivedPax = Enumerable.From($scope.dataSource).Where('$.Landing && $.ToAirport==' + $scope.airportEntity.Id).Select('$.TotalPax').Sum();
        }


    };
    $scope.gaugeOptions = {
        valueIndicator: {
            indentFromCenter: 50,
            spindleSize: 0,
            type: 'rangeBar',


        },
        subvalueIndicator: {
            type: "textcloud",
            text: {

                customizeText: function (arg) {
                    return arg.valueText;
                }
            }
        },
        scale: {
            startValue: 0,
            endValue: 150,
            tickInterval: 10,
            label: {
                useRangeColors: true
            }
        },
        rangeContainer: {
            palette: "pastel",
            ranges: [
                { startValue: 0, endValue: 150 },

            ]
        },
        title: {
            text: "Departed",
            font: { size: 14 },
            verticalAlignment: 'bottom'

        },
        size: {
            width: 200,
            height: 200
        },
        value: 90,
        subvalues: [90]
    };
    var offset = -1 * (new Date()).getTimezoneOffset();

    if (new Date($scope.datefrom) < new Date(2020, 2, 21, 0, 0, 0, 0))
        offset += 60;

    $scope.convertUTCEnabled = true;
    $scope.footerfilter = false;
    $scope.searched = false;
    $scope.baseSum = null;
    $scope.doUTC = false;
    $scope.doUtcEnabled = false;
    $scope.check_utc = {
        width: '100%',
        text: "UTC",
        onValueChanged: function (e) {

            if ($scope.doUtcEnabled) {
                //$scope.convertUTCEnabled = false;
                //if (e.value)
                //{  $scope.timeBase = 'UTC';  }
                //else
                //{ $scope.timeBase = 'LCB'; }
                //$scope.convertUTCEnabled = true;
                $scope.StopUTimer();
                // $scope.StartNowLineTimerFirst = true;
                $scope.activatedStbys = null;

            }
            else {
                //  $scope.timeBase = 'LCL';
            }
        },
        bindingOptions: {
            value: 'doUTC',
        }
    };


    $scope.sms_delay = false;
    $scope.check_sms_delay = {
        width: '100%',
        text: "Delay",

        bindingOptions: {
            value: 'sms_delay',
        }
    };
    $scope.sms_cancel = false;
    $scope.check_sms_cancel = {
        width: '100%',
        text: "Cancel",

        bindingOptions: {
            value: 'sms_cancel',
        }
    };

    $scope.sms_nira = false;
    $scope.check_sms_nira = {
        width: '100%',
        text: "NIRA",

        bindingOptions: {
            value: 'sms_nira',
            readOnly: true,
        }
    };

    $scope.sms_nira_sf = true;
    $scope.check_sms_nira_sf = {
        width: '100%',
        text: "Notify NIRA",

        bindingOptions: {
            value: 'sms_nira_sf',
        }
    };
    $scope.sms_nira_nsf = false;
    $scope.check_sms_nira_nsf = {
        width: '100%',
        text: "Notify NIRA",

        bindingOptions: {
            value: 'sms_nira_nsf',
        }
    };

    $scope.midnightLines = [];

    $scope.baseDate = null;
    //najaf
    $scope.fillFlight = function (data, newData) {
        data.FlightPlanId = newData.FlightPlanId;
        data.BaggageCount = newData.BaggageCount;
        data.CargoUnitID = newData.CargoUnitID;
        data.CargoUnit = newData.CargoUnit;
        data.CargoWeight = newData.CargoWeight;
        data.PaxChild = newData.PaxChild;
        data.PaxInfant = newData.PaxInfant;
        data.PaxAdult = newData.PaxAdult;
        data.FuelArrival = newData.FuelArrival;
        data.FuelDeparture = newData.FuelDeparture;
        data.FuelActual = newData.FuelActual;
        data.FuelPlanned = newData.FuelPlanned;
        data.GWLand = newData.GWLand;
        data.GWTO = newData.GWTO;
        data.BlockM = newData.BlockM;
        data.BlockH = newData.BlockH;
        data.FlightH = newData.FlightH;
        data.FlightM = newData.FlightM;
        data.ChocksIn = newData.ChocksIn;
        data.Landing = newData.Landing;
        data.Takeoff = newData.Takeoff;
        data.ChocksOut = newData.ChocksOut;
        data.STD = newData.STD;
        data.STA = newData.STA;
        data.FlightStatusID = newData.FlightStatusID;
        data.RegisterID = newData.RegisterID;
        data.FlightTypeID = newData.FlightTypeID;
        data.TypeId = newData.TypeId;
        data.AirlineOperatorsID = newData.AirlineOperatorsID;
        data.FlightNumber = newData.FlightNumber;
        data.FromAirport = newData.FromAirport;
        data.ToAirport = newData.ToAirport;
        data.STAPlanned = newData.STAPlanned;
        data.STDPlanned = newData.STDPlanned;
        data.FlightHPlanned = newData.FlightHPlanned;
        data.FlightMPlanned = newData.FlightMPlanned;
        data.FlightPlan = newData.FlightPlan;
        data.CustomerId = newData.CustomerId;
        data.IsActive = newData.IsActive;
        data.DateActive = newData.DateActive;
        data.FromAirportName = newData.FromAirportName;
        data.FromAirportIATA = newData.FromAirportIATA;
        data.FromAirportCityId = newData.FromAirportCityId;
        data.ToAirportName = newData.ToAirportName;
        data.ToAirportIATA = newData.ToAirportIATA;
        data.ToAirportCityId = newData.ToAirportCityId;
        data.FromAirportCity = newData.FromAirportCity;
        data.ToAirportCity = newData.ToAirportCity;
        data.AircraftType = newData.AircraftType;
        data.Register = newData.Register;
        data.MSN = newData.MSN;
        data.FlightStatus = newData.FlightStatus;
        data.FlightStatusBgColor = newData.FlightStatusBgColor;
        data.FlightStatusColor = newData.FlightStatusColor;
        data.FlightStatusClass = newData.FlightStatusClass;
        data.from = newData.from;
        data.to = newData.to;
        data.notes = newData.notes;
        data.status = newData.status;
        data.progress = newData.progress;
        data.taskName = newData.taskName;
        data.startDate = newData.startDate;
        data.duration = newData.duration;
        data.taskId = newData.taskId;
        data.FlightGroupID = newData.FlightGroupID;
        data.PlanId = newData.PlanId;
        data.ManufacturerId = newData.ManufacturerId;
        data.Manufacturer = newData.Manufacturer;
        data.ToCountry = newData.ToCountry;
        data.ToSortName = newData.ToSortName;
        data.ToCity = newData.ToCity;
        data.FromSortName = newData.FromSortName;
        data.FromContry = newData.FromContry;
        data.FromCity = newData.FromCity;
        data.FromLatitude = newData.FromLatitude;
        data.FromLongitude = newData.FromLongitude;
        data.ToLatitude = newData.ToLatitude;
        data.ToLongitude = newData.ToLongitude;
        data.CargoCount = newData.CargoCount;
        data.BaggageWeight = newData.BaggageWeight;
        data.FuelUnitID = newData.FuelUnitID;
        data.ArrivalRemark = newData.ArrivalRemark;
        data.DepartureRemark = newData.DepartureRemark;
        data.TotalSeat = newData.TotalSeat;
        data.EstimatedDelay = newData.EstimatedDelay;
        data.PaxOver = newData.PaxOver;
        data.TotalPax = newData.TotalPax;
        data.NightTime = newData.NightTime;
        data.FuelUnit = newData.FuelUnit;
        data.DateStatus = newData.DateStatus;
        data.UsedFuel = newData.UsedFuel;
        data.JLBLHH = newData.JLBLHH;
        data.JLBLMM = newData.JLBLMM;
        data.PFLR = newData.PFLR;
    };
    $scope.doActionCompleteSave = true;
    $scope.updatedFlightsCount = 0;
    $scope.updatedFlights = [];
    $scope.addUpdatedFlights = function (item) {
        $scope.updatedFlights = Enumerable.From($scope.updatedFlights).Where('$.ID!=' + item.ID).ToArray();
        var entity = {
            ID: item.ID,
            FlightNumber: item.FlightNumber,
            ToAirportIATA: item.ToAirportIATA,
            FromAirportIATA: item.FromAirportIATA,
            FlightStatus: item.FlightStatus,
            DateStatus: item.DateStatus,

        };
        $scope.updatedFlights.push(entity);
        $scope.updatedFlightsCount = $scope.updatedFlights.length;
    };
    $scope.removeUpdatedFlights = function (item) {
        $scope.updatedFlights = Enumerable.From($scope.updatedFlights).Where('$.ID!=' + item.ID).ToArray();
        $scope.updatedFlightsCount = $scope.updatedFlights.length;
    };

    $scope.showUpdatedFlights = function () {
        $scope.popup_upd_visible = true;
    };





    //////////////////////////////////////


    $scope.modifyLinkedFlights = function () {
        var linked = $('.linked-flight');
        if (linked.length > 0) {
            linked.each(function () {
                //alert($(this).text())
                var lid = $(this).data('linked');
                if (lid) {
                    //task-13440

                    var $c = $(this).closest('.e-childContainer');
                    var le = $('.task-' + lid).closest('.e-childContainer');
                    if (le.length > 0) {
                        var _left = le.position().left;
                        $c.css({ left: _left + 10, })
                    }


                }
                $(this).show();

            });
        };
    };

    var _boffset = -1 * (new Date()).getTimezoneOffset();

    var yyyymmddtimenow2 = function (dt) {
        var now = new Date();
        var result = "";
        //if (!utc) {
        //    var mm = this.getMonth() + 1; // getMonth() is zero-based
        //    var dd = this.getDate();
        //    var result = [this.getFullYear(),
        //    (mm > 9 ? '' : '0') + mm,
        //    (dd > 9 ? '' : '0') + dd
        //    ].join('/');
        //    var hh = now.getHours();
        //    var mi = now.getMinutes();
        //    var ss = now.getSeconds();
        //    result += " " //+ this.toLocaleTimeString();
        //      + ((hh > 9 ? '' : '0') + hh) + ":" + ((mi > 9 ? '' : '0') + mi) + ":" + ((ss > 9 ? '' : '0') + ss);
        //}

        //else
        {

            var umm = now.getUTCMonth() + 1; // getMonth() is zero-based
            var udd = now.getUTCDate();

            var uhh = now.getUTCHours();

            var umi = now.getUTCMinutes();
            var uss = now.getUTCSeconds();
            result = now.getUTCFullYear() + "/"
                + ((umm > 9 ? '' : '0') + umm) + "/"
                + ((udd > 9 ? '' : '0') + udd) + " "
                +
                ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi) + ":" + ((uss > 9 ? '' : '0') + uss);
        }

        return result;
    };




    //////////////////////////////////////////
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




        }, function (err) { $scope.loadingVisible = false; });
    };
    ////////////////////////////////////////
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
    ////////////////////////////////////////
    $scope.autoUpdate = true;
    $scope.check_autoupdate = {
        width: '100%',
        text: "Auto Update",
        onValueChanged: function (e) {
            if (e.value) {

                $scope.StartUTimer();
            }
            else {
                $scope.StopUTimer();
            }
        },
        bindingOptions: {
            value: 'autoUpdate',
        }
    };

    $scope.IsSelectionMode = false;
    $scope.multiSelectedFlights = [];
    $scope.check_multiselect = {
        width: '100%',
        text: "Multi Select",
        onValueChanged: function (e) {
            if (e.value) {
                $(document).on("click", ".bati", function () {

                    var id = $(this).data("id");


                    var $element = $('#task-' + id).parent();
                    var $parent = $('.task-' + id);
                    // $parent.addClass('thick-border');

                    var data = Enumerable.From($scope.dataSource).Where('$.Id==' + id).FirstOrDefault();
                    // var isBox = data.IsBox;
                    // var BoxId = data.BoxId;

                    if ($parent.hasClass('thick-border')) {
                        // alert('hass');
                        $scope.multiSelectedFlights = Enumerable.From($scope.multiSelectedFlights).Where('$.Id!=' + id).ToArray();
                        $parent.removeClass('thick-border');
                    }
                    else {
                        // alert('not hass');
                        $scope.multiSelectedFlights.push(data);
                        $parent.addClass('thick-border');
                    }








                });

            }
            else {
                $scope.multiSelectedFlights = [];
                $(".bati").removeClass('thick-border').off("click");
            }
        },
        bindingOptions: {
            value: 'IsSelectionMode',
        }
    };



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

    $scope.checkContinuity = function (flights) {
        var hasError = false;
        var ordered = Enumerable.From(flights).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
        $.each(ordered, function (_i, _d) {
            if (_i > 0 && _i < ordered.length - 1) {
                if (_d.ToAirport != ordered[_i + 1].FromAirport)
                    hasError = true;
            }
        });
        return hasError;

    };
    $scope.STBYFDPStat = {};
    //chook
    $scope.getDaySTBYs = function (flt, callback) {
        var _loc = $scope.multiSelectedFlights[0].FromAirport;

        var _time = Number(moment(new Date($scope.multiSelectedFlights[0].STD)).format('HHmm'));
        var _dt = moment($scope.selectedDate).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;
        flightService.rosterSTBYs({}, _dt, _dt, _loc, _time).then(function (response2) {
            $scope.loadingVisible = false;
            // console.log(response2);
            if (callback)
                callback(response2);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.col_stby_class1 = "col-lg-4 col-md-9 col-sm-9 col-xs-9 col1 fc11";
    $scope.col_stby_class2 = "col-lg-4 col-md-9 col-sm-9 col-xs-9 col1 fc11";
    $scope.btn_stby = {
        // text: 'Nonscheduled Flight',
        text: 'StandBy',
        type: 'default',
        icon: '',
        width: 120,

        onClick: function (e) {


            var flights = $scope.multiSelectedFlights;
            if (!flights || flights.length == 0) {

                $scope.col_stby_class1 = "hidden";
                $scope.col_stby_class2 = "col1 fc11";
                $scope.popup_stby_visible = true;

            }
            else {
                $scope.col_stby_class1 = "col-lg-4 col-md-9 col-sm-9 col-xs-9 col1 fc11";
                $scope.col_stby_class2 = "col-lg-4 col-md-9 col-sm-9 col-xs-9 col1 fc11";
                $scope.multiSelectedFlights = Enumerable.From($scope.multiSelectedFlights).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
                var conflict = $scope.checkConflict($scope.multiSelectedFlights);
                var continuity = $scope.checkContinuity($scope.multiSelectedFlights);
                if (conflict || continuity) {
                    return;
                }
                var ids = Enumerable.From($scope.multiSelectedFlights).Select('$.ID').ToArray();
                $scope.STBYFDPStat = {};
                $scope.loadingVisible = true;
                flightService.getFDPStats(ids.join('_')).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.STBYFDPStat = response;
                    ////////////////////////////////////////
                    response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
                    response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
                    response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
                    response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
                    response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
                    response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
                    response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
                    $scope.dg3_ds = [];

                    $scope.dg3_ds.push({ Title: 'Extended', Value: response.ExtendedStr });
                    $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });

                    $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
                    $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
                    $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
                    $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });
                    ////////////////////////////////////////////



                    //sool
                    $scope.getDaySTBYs($scope.multiSelectedFlights[0], function (result) {
                        $scope.crew_stby_ds = result;
                        $scope.fillStbyDs();
                        $scope.popup_stby_visible = true;
                    });


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }

            //$scope.popup_roster_visible = true;

        }

    };

    /////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////

    $scope.btn_update = {
        text: '',
        type: 'success',
        icon: 'pulldown',
        width: '40',

        bindingOptions: {
            disabled: 'autoUpdate',
        },
        onClick: function (e) {
            //var $e1 = $('.task-5095');
            //console.log($e1.length);
            //var $echildContainer = $e1.parents(".e-childContainer");
            //console.log($echildContainer.length);
            //var $echildContainer_left = $echildContainer.position().left;
            //console.log($echildContainer_left);
            //var $echartcell = $echildContainer.parents('.e-chartcell');
            //console.log($echartcell.length);
            //$echartcell.append("<span class='sbani' style='position:absolute;left:" + ($echildContainer_left - 10) + "px'>U</span>");
            ////$('.e-chartcell').remove();

            //return;

            var dto = {
                from: (new Date($scope.datefrom)).toUTCString(),
                to: (new Date($scope.dateto)).toUTCString(),
                baseDate: $scope.baseDate,
                airport: $scope.airportEntity ? $scope.airportEntity.Id : -1,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                userid: $rootScope.userId ? $rootScope.userId : -1

            };
            $scope.loadingVisible = true;
            flightService.getUpdatedFlights(dto).then(function (response) {
                //alert('x');
                $scope.loadingVisible = false;

                $scope.baseDate = (new Date(Date.now())).toUTCString();
                var ganttObj = $("#resourceGanttba").data("ejGantt");

                $.each(response.flights, function (_i, _d) {
                    var data = Enumerable.From($scope.dataSource).Where("$.ID==" + _d.ID).FirstOrDefault();

                    if (data) {


                        $scope.doActionCompleteSave = false;
                        $scope.fillFlight(data, _d);
                        Flight.processDataOffBlock(data);
                        $scope.addUpdatedFlights(data);
                        ganttObj.updateRecordByTaskId(data);

                        $scope.calculateSummary();


                    }
                });


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }

    };
    $scope._flightno = '';
    $scope.text_flightno = {
        bindingOptions: {
            value: '_flightno',

        }
    };

    $scope.btn_goflight = {
        text: '',
        type: 'success',
        icon: 'arrowright',
        width: '35',

        bindingOptions: {},
        onClick: function (e) {
            //  $scope.createGantt($scope._flightno);
            //   return;
            if (!$scope._flightno)
                return;
            var data = Enumerable.From($scope.dataSource).Where("$.FlightNumber.toLowerCase()=='" + $scope._flightno.toLowerCase() + "'").FirstOrDefault();
            if (!data) {
                General.ShowNotify('Flight not found', 'error');
                return;
            }
            $scope.scrollGantt(data);

        }

    };
    $scope.ganttview = true;
    $scope.gridview = true;

    /////////Planning ////////////////////

    $scope.btn_plan_new = {
        // text: 'New',
        type: 'default',
        icon: 'plus',
        width: '40',
        onClick: function (e) {

            $scope.doGetPlanItems = true;
            $scope.doRefresh = false;
            $scope.planEntity.Id = -1;
            $scope.tempData = null;
            $scope.IsNew = true;
            $scope.addMode = true;

            $scope.popup_plan_add_visible = true;

        },
        bindingOptions: {
            visible: 'IsPlanning',
        }

    };
    $scope.btn_plan_delete = {

        type: 'danger',
        icon: 'clear',
        width: '40',

        onClick: function (e) {
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            var flight = $scope.selectedFlights[0];
            // flight.FlightPlanId



            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: flight.FlightPlanId, };
                    $scope.loadingVisible = true;
                    flightService.deletePlanItem(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        },
        bindingOptions: {
            visible: 'IsPlanning',
        }
    };

    $scope.selectedPlanItemId = null;
    $scope.selectedPlanItem = null;
    $scope.doIrRoute = false;
    $scope.btn_edit = {
        hint: 'Edit Flight',
        type: 'default',
        icon: 'fas fa-pencil-alt',
        width: '100%',

        onClick: function (e) {

            //divargar-ok

            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            //if ($scope.ati_selectedFlights[0].FlightStatusID != 1) {
            //    General.ShowNotify("The flight cannot be deleted.", 'error');
            //    return;
            //}

            //FlightStatusID

            $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();

            $scope.ati_resid = $scope.ati_flight.RegisterID;


            if ($scope.ati_flight.FlightPlanId && 1 == 2) {

                $scope.selectedPlanItemId = $scope.ati_flight.FlightPlanId;
                var offset = -1 * (new Date()).getTimezoneOffset();
                //var flight = $scope.selectedFlights[0];

                //$scope.bindEntity($scope.dg_selected);
                $scope.loadingVisible = true;
                flightService.getFlightPlanItem($scope.ati_flight.FlightPlanId, offset).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.IsNew = false;
                    $scope.tempData = response;

                    $scope.doRefresh = false;
                    $scope.doGetPlanItems = false;

                    $scope.popup_planitem_visible = true;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                //General.ShowNotify("The selected item cannot be deleted.", 'error');
                return;
            }
            else {
                $scope.linkEntity = { ID: $scope.ati_flight.ID, CustomerId: Config.CustomerId };

                //var _df = General.getDayFirstHour(new Date($scope.selectedDate));
                //$scope.time_ir_std_date = new Date(_df);
                $scope.doIrRoute = false;
                $scope.linkEntity.RegisterID = $scope.ati_flight.RegisterID;
                $scope.linkEntity.FlightNumber = $scope.ati_flight.FlightNumber;
                $scope.linkEntity.FromAirportId = $scope.ati_flight.FromAirport;
                $scope.linkEntity.ToAirportId = $scope.ati_flight.ToAirport;
                $scope.linkEntity.FlightH = $scope.ati_flight.FlightH;
                $scope.linkEntity.FlightM = $scope.ati_flight.FlightM;
                $scope.linkEntity.FlightTypeID = $scope.ati_flight.FlightTypeID;

                //04-30
                $scope.linkEntity.STD = new Date($scope.ati_flight.STD);

                $scope.time_ir_std_date = new Date($scope.ati_flight.STD);
                $scope.time_ir_std_time = new Date($scope.ati_flight.STD);
                $scope.time_ir_sta_date = new Date($scope.ati_flight.STD);
                $scope.time_ir_sta_time = new Date($scope.ati_flight.STA);

                //divargar-ok
                $scope.time_interval_from_date = new Date($scope.ati_flight.STD);
                $scope.time_interval_to_date = new Date($scope.ati_flight.STD);
                $scope.interval_days = [];
                $scope.interval_days.push((new Date($scope.ati_flight.STD)).getDay());
                //$scope.linkEntity.LinkedRemark = $scope.flight.LinkedRemark;
                $scope.doIrRoute = true;
                //05-17
                $scope.linkEntity.ChrCode = $scope.ati_flight.ChrCode;
                $scope.linkEntity.ChrTitle = $scope.ati_flight.ChrTitle;


                $scope.popup_free_visible = true;
            }

            //$scope.linkEntity = { ID: -1, CustomerId: Config.CustomerId };
            //var _df = General.getDayFirstHour(new Date($scope.selectedDate));
            //$scope.time_ir_std_date = new Date(_df);

            //$scope.popup_free_visible = true;


        }
    };



    $scope.btn_shift = {
        hint: 'Shift STD',
        type: 'default',
        icon: '	fas fa-clock',
        width: '100%',

        onClick: function (e) {




            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            //  $scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //  $scope.ati_resid=$scope.ati_flight.RegisterID;
            $scope.popup_shift_visible = true;



        }
    };

    //08-28
    /////////// FLIGHT FOLDER /////////////////
    $scope.btn_folder = {
        hint: 'Flight Folder',
        type: 'default',
        icon: 'fas fa-folder',
        width: '100%',

        onClick: function (e) {

            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.popup_folder_visible = true;


        }
    };
    $scope.folderItemClick = function (key) {
        if (key == 'dr') {
            var data = { FlightId: $scope.ati_selectedFlights[0].ID };
            $rootScope.$broadcast('InitDrAdd', data);
        }
        if (key == 'ofp') {
            $scope.popup_ofp_visible = true;
        }
        if (key == 'atc') {
            $scope.popup_atc_visible = true;
        }
    };
    $scope.popup_folder_visible = false;
    $scope.popup_folder_title = 'Flight Folder';
    $scope.popup_folder = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptrptrange"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 300,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'danger', text: 'SAVE', icon: 'remove', onClick: function (e) {
            //            var dto = { user: 'demo', fltId: 66287, text: $scope.ofp };
            //            $http.post('http://localhost:12271/api/ofp/parse/text', dto);
            //        }
            //    }, toolbar: 'bottom'
            //},


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_folder_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_folder_visible = false;

        },
        bindingOptions: {
            visible: 'popup_folder_visible',

            title: 'popup_folder_title',

        }
    };

    //close button
    //$scope.popup_folder.toolbarItems[0].options.onClick = function (e) {

    //    $scope.popup_folder_visible = false;

    //};
    ////OFP
    $scope.ofp = null;
    $scope.txt_ofp = {
        height: 530,
        bindingOptions: {

            value: "ofp"
        }
    };

    $scope.txt_ofp_user = {
        hoverStateEnabled: false,
        readOnly: true,
        placeholder: 'Imported By...',
        bindingOptions: {
            value: 'ofp_user',
        }
    };
    $scope.txt_ofp_date = {
        hoverStateEnabled: false,
        placeholder: 'Importing date...',
        readOnly: true,
        bindingOptions: {
            value: 'ofp_date',
        }
    };

    $scope.popup_ofp_visible = false;
    $scope.popup_ofp_title = 'OFP';
    $scope.popup_ofp = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptrptrange"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', icon: 'check', validationGroup: 'ofptext', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var dto = { user: $rootScope.userName, fltId: $scope.ati_selectedFlights[0].ID, text: $scope.ofp };

                        $scope.loadingVisible = true;

                        flightService.saveOFP(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            if (response == "-1") {
                                General.ShowNotify("OFP conversion failed. please check the text", 'error');
                            }
                            else {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.popup_ofp_visible = false;
                            }



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_ofp_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.loadingVisible = true;

            flightService.getOFP($scope.ati_selectedFlights[0].ID).then(function (response) {
                $scope.loadingVisible = false;
                if (response && response.Id != -1) {
                    $scope.ofp = response.Text;
                    $scope.ofp_user = response.User;
                    $scope.ofp_date = moment(new Date(response.DateCreate)).format('YYYY-MM-DD HH:mm');
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        onHiding: function () {

            $scope.ofp = null;
            $scope.ofp_user = null;
            $scope.ofp_date = null;
            $scope.popup_ofp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_ofp_visible',

            title: 'popup_ofp_title',

        }
    };


    //////////////////////////////
    $scope.atcTXT = null;
    $scope.txt_atc = {
        height: 530,
        bindingOptions: {

            value: "atcTXT"
        }
    };
    $scope.isATCFile = false;
    $scope.btn_atcdnl = {
        width: 150,
        type: 'default',
        text: 'Download',
        onClick: function (e) {
            $window.open('https://api.aptaban.ir/' + $scope.atcTXT, '_blank');
        },
        bindingOptions: {
            visible: 'isATCFile'
        }

    };
    $scope.popup_atc_visible = false;
    $scope.popup_atc_title = 'ATC';
    $scope.popup_atc = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptrptrange"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', icon: 'check', validationGroup: 'ofptext', onClick: function (e) {
                        if (!$scope.atcTXT || $scope.atcTXT.includes('atc-')) {
                            $scope.popup_atc_visible = false;

                            return;
                        }


                        var dto = { user: $rootScope.userName, fltId: $scope.ati_selectedFlights[0].ID, text: $scope.atcTXT };

                        $scope.loadingVisible = true;

                        flightService.saveATC(dto).then(function (response) {
                            $scope.loadingVisible = false;


                            $scope.popup_atc_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_atc_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.loadingVisible = true;

            flightService.getATC($scope.ati_selectedFlights[0].ID).then(function (response) {
                $scope.loadingVisible = false;
                $scope.atcTXT = response;
                if ($scope.atcTXT && $scope.atcTXT.includes('atc-')) {
                    $scope.isATCFile = true;
                    $scope.atcTXT = $scope.atcTXT.replace('"', '').replace('"', '').replace("'", "").replace("'", "")
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        onHiding: function () {
            $scope.isATCFile = false;
            //$scope.ofp = null;
            //$scope.ofp_user = null;
            //$scope.ofp_date = null;
            $scope.popup_ofp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_atc_visible',

            title: 'popup_atc_title',

        }
    };




    ////////////END FLIGHT FOLDER///////////////////////
    //magu2-23

    $scope.btn_addemp = {
        hint: 'Add Employees',
        type: 'default',
        icon: 'far fa-id-badge',
        width: '100%',

        onClick: function (e) {




            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            //  $scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //  $scope.ati_resid=$scope.ati_flight.RegisterID;
            $scope.addCrewGroup();



        }
    };

    //magu2-16
    $scope.btn_creg = {
        hint: 'Change Register',
        type: 'default',
        icon: 'fas fa-exchange-alt',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            var ati_flight1 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            var ati_flight2 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;
            if ($scope.IsComm) {
                $scope.time_interval_from_date = new Date(ati_flight1.STD);
                $scope.time_interval_to_date = new Date(ati_flight2.STD);
                $scope.interval_days = [];
                $scope.interval_days.push((new Date(ati_flight1.STD)).getDay());
                $scope.interval_days.push((new Date(ati_flight2.STD)).getDay());

            }
            $scope.popup_creg_visible = true;



        }
    };
    //magu2-16
    //divargar-ok
    $scope.btn_cnl = {
        hint: 'Cancel Flight(s)',
        type: 'danger',
        icon: 'fas fa-toggle-off',
        width: '100%',

        onClick: function (e) {
            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            //$scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;
            var ati_flight1 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            var ati_flight2 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;
            if ($scope.IsComm) {
                $scope.time_interval_from_date = new Date(ati_flight1.STD);
                $scope.time_interval_to_date = new Date(ati_flight2.STD);
                $scope.interval_days = [];
                $scope.interval_days.push((new Date(ati_flight1.STD)).getDay());
                $scope.interval_days.push((new Date(ati_flight2.STD)).getDay());

            }
            $scope.popup_cnl_visible = true;



        }
    };


    $scope.btn_plan_edit = {

        type: 'default',
        icon: 'edit',
        width: 40,

        onClick: function (e) {
            //dodol
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            var offset = -1 * (new Date()).getTimezoneOffset();
            var flight = $scope.selectedFlights[0];

            $scope.plan_dg2_keys = [];


            //$scope.bindEntity($scope.dg_selected);
            $scope.loadingVisible = true;
            flightService.getFlightPlanItem(flight.FlightPlanId, offset).then(function (response) {
                $scope.loadingVisible = false;
                $scope.IsNew = false;
                $scope.tempData = response;
                $scope.doRefresh = false;
                $scope.doGetPlanItems = true;
                $scope.popup_plan_add_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.btn_interval = {
        // text: 'Interval',
        type: 'default',
        icon: 'event',
        width: 40,

        onClick: function (e) {
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            var offset = -1 * (new Date()).getTimezoneOffset();
            var flight = $scope.selectedFlights[0];
            flightService.getFlightPlanView(flight.PlanId).then(function (response2) {


                $scope.entityInterval.FlightPlanId = response2.plan.Id;
                $scope.entityInterval.DateFrom = response2.plan.DateFrom;
                $scope.entityInterval.DateTo = response2.plan.DateTo;
                $scope.entityInterval.Interval = response2.plan.Interval;
                $scope.entityInterval.BaseIATA = response2.plan.BaseIATA;
                $scope.entityInterval.Register = response2.plan.VirtualRegister;
                $scope.entityInterval.Months = [];
                $scope.entityInterval.Days = [];


                if ($scope.entityInterval.Interval == 100) {

                }
                else
                    $scope.popup_interval_visible = true;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }

    };


    $scope.popup_plan_add_visible = false;
    $scope.popup_plan_add_title = 'New';
    $scope.popup_plan_add = {
        width: 1200,
        height: 530,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplan2', onClick: function (arg) {
                        //nook
                        // console.log($scope.data);
                        //return;


                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.planEntity.DateFrom = new Date($scope.planEntity.iDateFrom).ToUTC();
                        $scope.planEntity.DateTo = new Date($scope.planEntity.iDateTo).ToUTC();
                        // $scope.entity.DateFirst = new Date($scope.data[0].startDate).ToUTC();

                        $scope.planEntity.STD = (new Date($scope.planEntity.STD)).toUTCString();

                        $scope.planEntity.STA = (new Date($scope.planEntity.STA)).toUTCString();
                        //startDate

                        if ($scope.planEntity.Interval != 100) {
                            $scope.planEntity.Months = [];
                            $scope.planEntity.Days = [];
                        }






                        $scope.loadingVisible = true;
                        flightService.savePlanItem($scope.planEntity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            ////////////////
                            $scope.refreshPlanEntity();
                            if ($scope.IsNew) {
                                $scope.isBaseDisabled = true;
                                $scope.planEntity.STD = (new Date($scope.planEntity.STA)).addMinutes(60);
                                $scope.start = $scope.planEntity.STD;
                                $scope.planEntity.STA = null;
                                $scope.planEntity.FromAirport = $scope.planEntity.ToAirport;
                                $scope.planEntity.ToAirport = null;
                                //jook
                                response.STD = (new Date(response.STD)).addMinutes(offset);
                                response.STA = (new Date(response.STA)).addMinutes(offset);
                                $scope.plan_dg2_ds.push(response);
                                $scope.plan_dg2_instance.refresh();



                            }
                            else {

                                $scope.popup_plan_add_visible = false;
                            }

                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
            //dook
            if ($scope.tempData)
                $scope.bindPlanEntity($scope.tempData);
            $scope.plan_dg2_instance.refresh();
        },
        onHidden: function () {
            $scope.clearPlanEntity();
            $scope.plan_dg2_ds = [];
            $scope.plan_dg2_keys = [];
            $scope.plan_dg2_instance.refresh();
            $scope.popup_plan_add_visible = false;


        },
        bindingOptions: {
            visible: 'popup_plan_add_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_plan_add_title',

        }
    };

    //close button
    $scope.popup_plan_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_plan_add_visible = false;

    };
    //////////////////////////////////////////////
    $scope.popup_planitem_visible = false;
    $scope.popup_planitem_title = 'Flight';
    //dlurahm
    $scope.lastSTD = null;
    $scope.lastScroll = null;
    $scope.popup_planitem = {
        width: 650,
        height: 430,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'planitemflight', onClick: function (arg) {
                        //nook
                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.planEntity.DateFrom = new Date($scope.planEntity.iDateFrom).ToUTC();
                        $scope.planEntity.DateTo = new Date($scope.planEntity.iDateTo).ToUTC();
                        // $scope.entity.DateFirst = new Date($scope.data[0].startDate).ToUTC();

                        $scope.planEntity.STD = (new Date($scope.planEntity.STD)).toUTCString();

                        $scope.planEntity.STA = (new Date($scope.planEntity.STA)).toUTCString();
                        $scope.planEntity.SMSNira = $scope.sms_nira_sf ? 1 : 0;
                        $scope.planEntity.UserName = $rootScope.userName;
                        //startDate
                        //dood
                        if ($scope.planEntity.Interval != 100) {
                            $scope.planEntity.Months = [];
                            $scope.planEntity.Days = [];
                        }




                        $scope.planEntity.FlightId = $scope.ati_flight.ID;
                        //dlutak
                        $scope.loadingVisible = true;
                        flightService.updatePlanItemFlight($scope.planEntity).then(function (response) {
                            //dlurahm
                            //$scope.lastSTD =new Date( $scope.planEntity.STD);
                            //$scope.lastScroll=($('.e-ganttviewerbodyContianer').data("ejScroller").scrollLeft());

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            $scope.sms_nira_sf = true;
                            $scope.planEntity.Remark = null;
                            ////////////////
                            $scope.refreshPlanEntity();

                            $scope.isBaseDisabled = true;
                            $scope.planEntity.STD = (new Date($scope.planEntity.STA)).addMinutes(60);
                            $scope.start = $scope.planEntity.STD;
                            $scope.planEntity.STA = null;
                            $scope.planEntity.FromAirport = $scope.planEntity.ToAirport;
                            $scope.planEntity.ToAirport = null;
                            //jooki
                            response.STD = (new Date(response.STD)).addMinutes(offset);
                            response.STA = (new Date(response.STA)).addMinutes(offset);
                            // $scope.plan_dg2_ds.push(response);
                            // $scope.plan_dg2_instance.refresh();


                            ///////////////////////////////////
                            for (var key of Object.keys(response.flight)) {


                                $scope.ati_flight[key] = response.flight[key];
                                // console.log(key+'    '+response[key]+'     '+$scope.ati_flight[key]);
                            }
                            $scope.modifyFlightTimes($scope.ati_flight);
                            $scope.modifyGantt($scope.ati_flight, response.ressq[0]);
                            ////////////////////////////////////

                            $scope.popup_planitem_visible = false;



                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
            $scope.sms_nira_nsf = true;
            //sook
            if ($scope.tempData)
                $scope.bindPlanEntity2($scope.tempData);
        },
        onHidden: function () {
            $scope.clearPlanEntity();

            $scope.sms_nira_sf = true;
            //$scope.plan_dg2_ds = [];
            //$scope.plan_dg2_instance.refresh();
            $scope.popup_planitem_visible = false;



        },
        bindingOptions: {
            visible: 'popup_planitem_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_planitem_title',

        }
    };

    //close button
    $scope.popup_planitem.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_planitem_visible = false;

    };
    ////////////////////////////////////////////////

    $scope.popup_interval_visible = false;
    $scope.popup_interval_title = 'Interval';
    $scope.popup_interval = {
        width: 600,
        height: 460,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplaninterval2', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //cati
                        var dto = {
                            Id: $scope.entityInterval.FlightPlanId,
                            DateFrom: new Date($scope.entityInterval.DateFrom).ToUTC(),
                            DateTo: new Date($scope.entityInterval.DateTo).ToUTC(),
                            Interval: $scope.entityInterval.Interval,
                            Months: $scope.entityInterval.Months,
                            Days: $scope.entityInterval.Days,
                            DateFirst: new Date($scope.entityInterval.DateFrom).ToUTC(), //new Date($scope.data[0].startDate).ToUTC(),

                        };
                        $scope.loadingVisible = true;
                        flightService.savePlanInterval(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            ////////////////
                            $scope.clearEntityInterval();
                            $scope.popup_interval_visible = false;

                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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

            //if ($scope.tempData)
            //    $scope.bindEntity($scope.tempData);
        },
        onHiding: function () {


            $scope.popup_interval_visible = false;


        },
        bindingOptions: {
            visible: 'popup_interval_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_interval_title',

        }
    };

    //close button
    $scope.popup_interval.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_interval_visible = false;

    };
    $scope.text_base = {
        readOnly: true,
        bindingOptions: {
            value: 'entityInterval.BaseIATA',

        }
    };
    $scope.text_msn = {
        readOnly: true,
        bindingOptions: {
            value: 'entityInterval.Register',

        }
    };
    $scope.date_from2 = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            //$scope.fillSchedule2();
            // $scope.entityInterval.DateTo = arg.value;
        },
        bindingOptions: {
            value: 'entityInterval.DateFrom',

        }
    };
    $scope.date_to2 = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            //$scope.fillSchedule2();
        },
        bindingOptions: {
            value: 'entityInterval.DateTo',

        }
    };
    $scope.intervalTypes = [{ Id: 1, Title: 'Daily' }
        //, { Id: 2, Title: 'Weekly' }, { Id: 3, Title: 'Every 10 days' }, { Id: 4, Title: 'Every 14 days' }, { Id: 5, Title: 'Every 15 days' }, { Id: 100, Title: 'Custom' },
        // { Id: 101, Title: 'Once' }
    ];
    $scope.sb_interval2 = {

        showClearButton: true,
        width: '100%',
        searchEnabled: false,
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

            $scope.customDisabled = arg.selectedItem && arg.selectedItem.Id != 100;
            // $scope.fillSchedule2();

        },
        bindingOptions: {
            value: 'entityInterval.Interval',

            dataSource: 'intervalTypes',


        }
    };
    $scope.customDisabled = true;
    $scope.tag_months_instance = null;
    $scope.tag_months = {
        dataSource: General.MonthDataSource,
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_months_instance)
                $scope.tag_months_instance = e.component;
        },
        onSelectionChanged: function (arg) {

            // $scope.fillSchedule2();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entityInterval.Months"
        },

    };
    $scope.tag_days_instance = null;
    $scope.tag_days = {
        dataSource: General.WeekDayDataSource,
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_days_instance)
                $scope.tag_days_instance = e.component;
        },
        onSelectionChanged: function (arg) {

            // $scope.fillSchedule2();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entityInterval.Days"
        },

    };
    $scope.entityInterval = {
        FlightPlanId: null,
        DateFrom: null,
        DateTo: null,
        Interval: null,
        BaseIATA: null,
        Register: null,
        Months: [],
        Days: [],
    };
    $scope.clearEntityInterval = function () {
        $scope.entityInterval.FlightPlanId = null;
        $scope.entityInterval.DateFrom = null;
        $scope.entityInterval.DateTo = null;
        $scope.entityInterval.Interval = null;
        $scope.entityInterval.BaseIATA = null;
        $scope.entityInterval.Register = null;
        $scope.entityInterval.Months = [];
        $scope.entityInterval.Days = [];
    };

    $scope.planEntity = {
        Id: null,
        Title: null,
        DateFrom: null,
        DateTo: null,
        DateFirst: null,
        DateLast: null,
        BaseId: null,
        iDateFrom: new Date(),
        iDateTo: new Date(),
        CustomerId: Config.CustomerId,
        IsActive: false,
        DateActive: null,
        Interval: 1,

        TypeId: null,
        RegisterID: null,
        FlightTypeID: null,
        FromAirport: null,
        ToAirport: null,
        STA: null,
        STD: null,
        FlightH: null,
        FlightM: null,
        FlightNumber: null,
        RouteId: null,

        FlightPlanId: -1,
        Months: [],
        Days: [],

    };
    $scope.refreshPlanEntity = function () {
        $scope.planEntity.Id = -1;


        $scope.planEntity.DateFirst = null;
        $scope.planEntity.DateLast = null;
        //  $scope.entity.iDateFrom = new Date();
        //  $scope.entity.iDateTo = new Date();
        $scope.planEntity.CustomerId = Config.CustomerId;
        $scope.planEntity.IsActive = false;
        $scope.planEntity.DateActive = null;
        $scope.planEntity.Interval = 101;


        $scope.planEntity.FlightH = null;
        $scope.planEntity.FlightM = null;
        $scope.planEntity.FlightNumber = null;
        $scope.planEntity.RouteId = null;
        $scope.planEntity.SMSNira = null;



    };
    $scope.clearPlanEntity = function () {
        $scope.planEntity.Id = null;
        $scope.planEntity.BaseId = null;
        $scope.planEntity.Title = null;
        $scope.planEntity.DateFrom = null;
        $scope.planEntity.DateTo = null;
        $scope.planEntity.DateFirst = null;
        $scope.planEntity.DateLast = null;
        $scope.planEntity.iDateFrom = new Date();
        $scope.planEntity.iDateTo = new Date();
        $scope.planEntity.CustomerId = Config.CustomerId;
        $scope.planEntity.IsActive = false;
        $scope.planEntity.DateActive = null;
        $scope.planEntity.Interval = 101;

        $scope.planEntity.TypeId = null;
        $scope.planEntity.RegisterID = null;
        $scope.planEntity.FlightTypeID = null;
        $scope.planEntity.FromAirport = null;
        $scope.planEntity.ToAirport = null;
        $scope.planEntity.STA = null;
        $scope.planEntity.STD = null;
        $scope.planEntity.FlightH = null;
        $scope.planEntity.FlightM = null;
        $scope.planEntity.FlightNumber = null;
        $scope.planEntity.RouteId = null;
        $scope.planEntity.SMSNira = null;
        $scope.planEntity.Months = [];
        $scope.planEntity.Days = [];
        $scope.data = [];
    };
    $scope.DotBlockToBlock = true;
    $scope.bindPlanEntity = function (data) {
        //dodol
        $scope.DotBlockToBlock = false;
        $scope.planEntity.Id = data.Id;
        $scope.planEntity.BaseId = data.BaseId;
        $scope.planEntity.Title = data.Title;
        $scope.planEntity.DateFrom = data.DateFrom;
        $scope.planEntity.DateTo = data.DateTo;
        $scope.planEntity.DateFirst = data.DateFirst;
        $scope.planEntity.DateLast = data.DateLast;
        $scope.planEntity.iDateFrom = data.DateFrom;
        $scope.planEntity.iDateTo = data.DateTo;
        $scope.planEntity.CustomerId = data.CustomerId;
        $scope.planEntity.IsActive = data.IsActive;
        $scope.planEntity.DateActive = data.DateActive;
        $scope.planEntity.Interval = data.Interval;
        $scope.planEntity.Months = data.Months;
        $scope.planEntity.Days = data.Days;

        $scope.planEntity.FlightPlanId = data.FlightPlanId;
        $scope.planEntity.TypeId = data.TypeId;
        $scope.planEntity.RegisterID = data.RegisterID;
        $scope.planEntity.FlightTypeID = data.FlightTypeID;
        $scope.planEntity.AirlineOperatorsID = data.AirlineOperatorsID;
        $scope.planEntity.FlightNumber = data.FlightNumber;
        $scope.planEntity.FromAirport = data.FromAirport;
        $scope.planEntity.ToAirport = data.ToAirport;
        $scope.planEntity.STA = data.STA;
        $scope.planEntity.STD = data.STD;
        $scope.planEntity.FlightH = data.FlightH;
        $scope.planEntity.FlightM = data.FlightM;
        $scope.planEntity.FlightStatus = data.FlightStatus;

        $scope.start = new Date($scope.planEntity.STD);
        $scope.tempToAirport = $scope.planEntity.ToAirport;




    };

    $scope.bindPlanEntity2 = function (data) {
        $scope.DotBlockToBlock = false;
        //$scope.flight
        //  var date = $scope.selectedDate;
        // var date_parts = (new Date(date)).getDatePartArray();
        // var std_times = (new Date(data.STD)).getTimePartArray();
        // var sta_times = (new Date(data.STA)).getTimePartArray();

        // var _std = new Date(date_parts[0], date_parts[1], date_parts[2], std_times[0], std_times[1], 0, 0);
        // var _sta = new Date(date_parts[0], date_parts[1], date_parts[2], sta_times[0], sta_times[1], 0, 0);

        $scope.planEntity.Id = data.Id;
        $scope.planEntity.BaseId = data.BaseId;
        $scope.planEntity.Title = data.Title;
        $scope.planEntity.DateFrom = data.DateFrom;
        $scope.planEntity.DateTo = data.DateTo;
        $scope.planEntity.DateFirst = data.DateFirst;
        $scope.planEntity.DateLast = data.DateLast;
        $scope.planEntity.iDateFrom = data.DateFrom;
        $scope.planEntity.iDateTo = data.DateTo;
        $scope.planEntity.CustomerId = data.CustomerId;
        $scope.planEntity.IsActive = data.IsActive;
        $scope.planEntity.DateActive = data.DateActive;
        $scope.planEntity.Interval = data.Interval;
        $scope.planEntity.Months = data.Months;
        $scope.planEntity.Days = data.Days;

        $scope.planEntity.FlightPlanId = data.FlightPlanId;
        $scope.planEntity.TypeId = data.TypeId;
        $scope.planEntity.RegisterID = data.RegisterID;
        $scope.planEntity.FlightTypeID = data.FlightTypeID;
        $scope.planEntity.AirlineOperatorsID = data.AirlineOperatorsID;

        $scope.planEntity.FlightNumber = $scope.ati_flight.FlightNumber;

        $scope.planEntity.FromAirport = $scope.ati_flight.FromAirport;

        $scope.planEntity.ToAirport = $scope.ati_flight.ToAirport;

        $scope.planEntity.STA = $scope.ati_flight.STA;

        $scope.planEntity.STD = $scope.ati_flight.STD;

        $scope.planEntity.FlightH = $scope.ati_flight.FlightH;

        $scope.planEntity.FlightM = $scope.ati_flight.FlightM;

        $scope.planEntity.FlightStatus = data.FlightStatus;
        $scope.planEntity.Remark = data.DepartureRemark;


        $scope.start2 = new Date($scope.planEntity.STD);
        $scope.tempToAirport = $scope.planEntity.ToAirport;




    };

    $scope.plan_dg2_selected = null;
    $scope.plan_dg2_columns = [






        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm', sortIndex: 0, sortOrder: "asc"

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },






    ];
    $scope.plan_dg2_height = 400;

    $scope.plan_dg2_instance = null;
    $scope.plan_dg2_ds = [];
    $scope.plan_dg2_keys = [];
    $scope.plan_dg2 = {
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
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.plan_dg2_columns,
        onContentReady: function (e) {
            if (!$scope.plan_dg2_instance)
                $scope.plan_dg2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.plan_dg2_selected = null;



            }
            else {
                $scope.plan_dg2_selected = data;


            }


        },
        onCellPrepared: function (cellInfo) {

        },
        //height: '500',
        bindingOptions: {
            dataSource: 'plan_dg2_ds', //'dg_employees_ds',
            height: 'plan_dg2_height',
            selectedRowKeys: 'plan_dg2_keys',
        }
    };
    $scope.plan_date_from = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            // $scope.fillSchedule();
            $scope.planEntity.iDateTo = arg.value;
        },
        bindingOptions: {
            value: 'planEntity.iDateFrom',

        }
    };
    $scope.selectedType = null;
    $scope.ds_msn = [];
    $scope.msn_readOnly = true;
    $scope.sb_type = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Type', 'Manufacturer'],
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',

        onSelectionChanged: function (arg) {
            $scope.ds_msn = [];
            $scope.msn_readOnly = true;
            if (arg && arg.selectedItem) {
                $scope.planEntity.AircraftType = arg.selectedItem.Type;
                aircraftService.getVirtualMSNsByType(Config.CustomerId, arg.selectedItem.Id).then(function (response) {

                    $scope.msn_readOnly = false;
                    $scope.ds_msn = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.msn_readOnly = true;
                $scope.ds_msn = [];
                $scope.planEntity.AircraftType = null;
            }
        },
        bindingOptions: {
            value: 'planEntity.TypeId',
            selectedItem: 'selectedType',


        }
    };
    $scope.unknown_readOnly = false;
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAircraft(data);
        //},
        searchExpr: ['Register', 'MSN'],
        //dataSource: $scope.ds_msn,
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            //koor

            if (arg.selectedItem) {
                $scope.planEntity.Register = arg.selectedItem.Register;
                var offset = -1 * (new Date()).getTimezoneOffset();
                var dto = {
                    CustomerId: Config.CustomerId,
                    Date: new Date($scope.planEntity.iDateFrom).ToUTC(),
                    RegisterId: arg.selectedItem.ID,
                    Offset: offset
                };
                $scope.loadingVisible = true;
                //dook
                flightService.getPlanLastItem(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    if (!response || response.Id == -1) {
                        $scope.isBaseDisabled = false;
                    }
                    else {
                        $scope.isBaseDisabled = true;
                        $scope.planEntity.BaseId = response.BaseId;

                        if ($scope.IsNew) {

                            $scope.planEntity.FromAirport = response.ToAirport;
                            $scope.planEntity.ToAirport = null;
                            $scope.planEntity.STD = new Date(response.STA);
                            $scope.start = new Date($scope.planEntity.STD);

                        }
                        ///////////////////////////
                        if ($scope.doGetPlanItems)
                            flightService.getPlanItems(dto).then(function (response2) {
                                $scope.plan_dg2_ds = response2;
                                if ($scope.selectedFlights && $scope.selectedFlights.length > 0) {
                                    var flight = $scope.selectedFlights[0];
                                    $scope.plan_dg2_keys.push(flight.FlightPlanId);
                                }

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        ///////////////////////////
                    }


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





            }
            else {
                $scope.planEntity.Register = null;
                $scope.planEntity.BaseId = null;
                $scope.isBaseDisabled = true;
            }



        },
        bindingOptions: {
            value: 'planEntity.RegisterID',
            disabled: 'msn_readOnly',
            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    $scope.isBaseDisabled = true;
    $scope.sb_Base = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {

            if (!$scope.isBaseDisabled)
                $scope.planEntity.FromAirport = arg.selectedItem.Id;
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'planEntity.BaseId',
            disabled: 'isBaseDisabled'

        }
    };
    $scope.tempToAirport = null;
    $scope.selectedFromAirport = null;
    $scope.selectedToAirport = null;
    $scope.sb_FromAirport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();
            //frombani
            $scope.planEntity.ToAirport = null;
            if (!arg.selectedItem) {
                $scope.ds_toairport = [];
                $scope.planEntity.FromAirportIATA = null;
                return;
            }
            $scope.planEntity.FromAirportIATA = arg.selectedItem.IATA;
            $scope.loadingVisible = true;
            flightService.getRouteDestination(Config.AirlineId, arg.selectedItem.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds_toairport = response;
                if ($scope.tempToAirport) {
                    $scope.planEntity.ToAirport = $scope.tempToAirport;
                    $scope.tempToAirport = null;
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'planEntity.FromAirport',
            selectedItem: 'selectedFromAirport',
        }
    };
    $scope.ds_toairport = [];
    $scope.sb_ToAirport = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRouteTo(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();

            //mool
            if (arg.selectedItem) {
                $scope.planEntity.RouteId = arg.selectedItem.Id;
                if ($scope.DotBlockToBlock) {
                    $scope.planEntity.FlightH = arg.selectedItem.FlightH;
                    $scope.planEntity.FlightM = arg.selectedItem.FlightM;
                }
                else
                    $scope.DotBlockToBlock = true;

                $scope.planEntity.ToAirportIATA = arg.selectedItem.ToAirportIATA;
            }
            else {
                $scope.planEntity.RouteId = null;
                $scope.planEntity.FlightH = null;
                $scope.planEntity.FlightM = null;
                $scope.planEntity.ToAirportIATA = null;
            }
            $scope.setArrivalPlan();
        },
        searchExpr: ["ToAirportIATA", "ToCity"],
        displayExpr: "ToAirportIATA",
        valueExpr: 'ToAirportId',
        bindingOptions: {
            value: 'planEntity.ToAirport',
            selectedItem: 'selectedRoute',
            dataSource: 'ds_toairport'
        }
    };
    $scope.selectedRoute = null;
    $scope.setArrivalPlan = function () {

        if ($scope.planEntity.STD != null && $scope.planEntity.FlightH != null && $scope.planEntity.FlightM != null) {
            var std = new Date($scope.planEntity.STD);

            $scope.planEntity.STA = new Date(std.addHours($scope.planEntity.FlightH).addMinutes($scope.planEntity.FlightM));

        }
        else
            $scope.planEntity.STA = null;
    };
    $scope.start = null;
    $scope.time_start = {
        type: "time",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            //nook

            if (arg.value) {
                var d = new Date(arg.value);

                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                var dt = (new Date($scope.planEntity.iDateFrom)).getDatePartSlash()/* $scope.Day1*/ + " " + timestring;

                var std = new Date(dt);
                $scope.planEntity.STD = std;

            }
            else
                $scope.planEntity.STD = null;
            $scope.setArrivalPlan();
        },
        bindingOptions: {
            value: 'start',

        }
    };
    $scope.time_end = {
        readOnly: true,
        type: "time",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'planEntity.STA',

        }
    };



    ////////////////////////////////////////
    $scope.setArrivalPlan2 = function () {

        if ($scope.planEntity.STD != null && $scope.planEntity.FlightH != null && $scope.planEntity.FlightM != null) {
            var std = new Date($scope.planEntity.STD);

            $scope.planEntity.STA = new Date(std.addHours($scope.planEntity.FlightH).addMinutes($scope.planEntity.FlightM));

        }
        else
            $scope.planEntity.STA = null;
    };
    //dooj
    $scope.start2 = null;

    $scope.time_start2_d = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            //nook

            if (arg.value) {
                var d = new Date(arg.value);

                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                //var dt = (new Date($scope.planEntity.STD)).getDatePartSlash()/* $scope.Day1*/ + " " + timestring;
                var dt = (new Date(d)).getDatePartSlash()/* $scope.Day1*/ + " " + timestring;

                var std = new Date(dt);
                $scope.planEntity.STD = std;

            }
            else
                $scope.planEntity.STD = null;
            $scope.setArrivalPlan2();

        },
        bindingOptions: {
            value: 'start2',

        }
    };
    $scope.time_start2 = {
        type: "time",
        width: '100%',
        displayFormat: "HH:mm",
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            //nook

            if (arg.value) {
                var d = new Date(arg.value);

                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                var dt = (new Date($scope.planEntity.STD)).getDatePartSlash()/* $scope.Day1*/ + " " + timestring;

                var std = new Date(dt);
                $scope.planEntity.STD = std;

            }
            else
                $scope.planEntity.STD = null;
            $scope.setArrivalPlan2();
        },
        bindingOptions: {
            value: 'start2',

        }
    };
    $scope.time_end2_d = {
        readOnly: true,
        type: "date",
        width: '100%',
        //displayFormat: "HH:mm",
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'planEntity.STA',

        }
    };
    $scope.time_end2 = {
        readOnly: true,
        type: "time",
        width: '100%',
        displayFormat: "HH:mm",
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'planEntity.STA',

        }
    };
    ////////////////////////////////////////



    $scope.text_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrivalPlan();
        },
        bindingOptions: {
            value: 'planEntity.FlightH',

        }
    };
    $scope.text_flightm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrivalPlan();
        },
        bindingOptions: {
            value: 'planEntity.FlightM',

        }
    };
    $scope.text_flightnumber = {

        bindingOptions: {
            value: 'planEntity.FlightNumber',

        }
    };
    $scope.remark_planitem = {
        bindingOptions: {
            value: 'planEntity.Remark',
            height: '40',
        }
    };
    $scope.plan_sb_flighttype = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'planEntity.FlightTypeID',

        }
    };
    ////////////////////////////////////////
    $scope.dateEnd = null;
    $scope.tabsdatevisible = false;
    //dlurahm




    $scope.jlShow = false;
    $scope.btn_fill = {
        text: 'Fill',
        type: 'success',

        width: 100,

        bindingOptions: {},
        onClick: function (e) {
            var ids = [];
            if ($scope.leg1Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg1Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg2Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg2Text + '"').FirstOrDefault();

                ids.push(_id.ID);
            }
            if ($scope.leg3Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg3Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg4Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg4Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg5Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg5Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg6Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg6Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg7Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg7Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg8Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg8Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }

            var idsStr = ids.join('_');
            $scope.loadingVisible = true;
            flightService.getJLDataLegs(idsStr).then(function (response) {

                $scope.loadingVisible = false;
                if (!response)
                    return;
                $scope.jl.MaxFDP = response.max;
                $scope.jl.AcType = $scope.flight.AircraftType;
                $scope.jl.Reg = $scope.flight.Register;
                $scope.jl.Date = moment(new Date($scope.flight.Date)).format('MM-DD-YYYY');
                $scope.jl.STD = moment(new Date($scope.flight.STD)).format('HH:mm');
                $scope.jl.formNo = "FPI-OPS-01";
                $scope.jl.tel = "+982148063000";
                $scope.jl.email = "OpsEng@Caspian.aero";
                $scope.jl.sectors = [];
                for (var i = 0; i < 6; i++) {
                    var s = i + 1;
                    var sec = { sector: s };
                    if (response.flights.length >= s) {
                        var flight = response.flights[i];
                        sec.from = flight.FromAirportIATA;
                        sec.to = flight.ToAirportIATA;
                        sec.no = flight.FlightNumber;
                        sec.mm = moment(new Date(flight.STD)).format('MM');
                        sec.dd = moment(new Date(flight.STD)).format('DD');
                    }

                    $scope.jl.sectors.push(sec);
                }
                // var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                // var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();

                $scope.jl.cockpit = [];
                $scope.jl.cabin = [];
                var n = 0;
                var j = cabin.length;
                if (cockpit.length > j)
                    j = cockpit.length;
                if (8 > j) j = 8;
                $scope.jl.crews = [];
                //bahrami-6-2
                $scope.jl.crewscockpit = [];
                $scope.jl.crewscabin = [];
                //console.log(cockpit);
                $.each(cockpit, function (_i, co) {
                    if (co.Position == "Captain")
                        co.Position = "CPT";
                    if (co.IsPositioning)
                        co.Position = 'DH';
                    $scope.jl.crewscockpit.push(co);

                });
                $.each(cabin, function (_i, co) {
                    if (co.IsPositioning)
                        co.Position = 'DH';
                    if (co.Position && co.Position == 'Purser')
                        co.Position = 'SCCM';
                    if (co.Position && co.Position == 'FA')
                        co.Position = 'CCM';
                    if (co.JobGroup == "ISCCM")
                        co.Position = "ISCCM";
                    $scope.jl.crewscabin.push(co);
                });

                if ($scope.jl.crewscockpit.length < 7)
                    for (var i = $scope.jl.crewscockpit.length; i < 7; i++) {
                        $scope.jl.crewscockpit.push({ Position: ' ', Name: ' ' });

                    }


                if ($scope.jl.crewscabin.length < 7)
                    for (var i = $scope.jl.crewscabin.length; i < 7; i++) {
                        $scope.jl.crewscabin.push({ Position: ' ', Name: ' ' });
                    }


                ///////////////////////////
                for (var i = 0; i < j; i++) {
                    var ca = {};
                    if (cabin.length > i)
                        ca = cabin[i];

                    var co = {};
                    if (cockpit.length > i)
                        co = cockpit[i];

                    //////////////////////////////////
                    if (co.Position == "Captain")
                        co.Position = "CPT";
                    // if (co.JobGroup == "TRE" || co.JobGroup == "TRI" || co.JobGroup == "LTC")

                    // co.Position = 'IP';
                    if (co.IsPositioning)
                        co.Position = 'DH';
                    //////////////////////////////////


                    if (ca.Position && ca.Position == 'Purser')
                        ca.Position = 'SCCM';
                    if (ca.Position && ca.Position == 'FA')
                        ca.Position = 'CCM';
                    if (ca.JobGroup == "ISCCM")
                        ca.Position = "ISCCM";

                    if (ca.IsPositioning)
                        ca.Position = 'DH';

                    // bahrami-6-2
                    if (!ca.Name) { ca.Name = ''; ca.Position = ''; }
                    if (!co.Name) { co.Name = ''; co.Position = ''; }
                    $scope.jl.crews.push({ cabin: ca, cockpit: co });


                }
                //  console.log($scope.jl.crews);



                $scope.jl.rvsm1 = [];
                $scope.jl.rvsm1.push({ leg: 1 });
                $scope.jl.rvsm1.push({ leg: 2 });
                $scope.jl.rvsm1.push({ leg: 3 });
                $scope.jl.rvsm2 = [];
                $scope.jl.rvsm2.push({ leg: 4 });
                $scope.jl.rvsm2.push({ leg: 5 });
                $scope.jl.rvsm2.push({ leg: 6 });
                $scope.jlShow = true;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




        }

    };
    //dlutala

    //kabiri-ok
    $scope.OrderGD = ['IP', 'CPT', 'FO', 'SO', 'CHK(CO)', 'OBS(CO)', 'DH(CO)', 'FD', 'GE', 'FSO', 'ISCCM', 'SCCM', 'CCM', 'CHK(CA)', 'OBS(CA)', 'DH(CA)'];

    $scope.generateGDTables = function (cds) {
        $scope.cl.crewsAll = Enumerable.From(cds).OrderBy('$.IsPositioning')
            //.ThenBy('$.GroupOrder').ThenBy('$.Name')
            .ThenBy('$.GroupOrder').ThenBy('$.PositionId').ThenBy('$.Name')
            .ToArray();

        $.each($scope.cl.crewsAll, function (_i, _d) {
            if (!_d.Position)
                _d.Position = " ";
            if (!_d.Name)
                _d.Name = " ";
            _d.Position = _d.Position.trim().toUpperCase();
            _d.Name = _d.Name.trim().toUpperCase();

            if (_d.Position == "IP" || _d.Position == "TRE" || _d.Position == "TRI")
                _d.Position = "IP";
            if (_d.Position == "Captain")
                _d.Position = "CPT";
            if (_d.Position == "Purser")
                _d.Position = "SCCM";
            if (_d.Position == "FA")
                _d.Position = "CCM";
            if (_d.JobGroup == "ISCCM")
                _d.Position = "ISCCM";
            if (_d.IsPositioning)
                _d.Position = 'DH';

            if (_d.Position == "CHECK" && ['IP', 'TRE', 'TRI', 'LTC', 'P1', 'P2'].indexOf(_d.JobGroup) != -1)
                _d.Position = "CHK(CO)";
            if (_d.Position == "OBS" && ['IP', 'TRE', 'TRI', 'LTC', 'P1', 'P2'].indexOf(_d.JobGroup) != -1)
                _d.Position = "OBS(CO)";
            if (_d.Position == "DH" && ['IP', 'TRE', 'TRI', 'LTC', 'P1', 'P2'].indexOf(_d.JobGroup) != -1)
                _d.Position = "DH(CO)";
            if (_d.Position == "CHECK" && ['ISCCM', 'SCCM', 'CCM'].indexOf(_d.JobGroup) != -1)
                _d.Position = "CHK(CA)";
            if (_d.Position == "OBS" && ['ISCCM', 'SCCM', 'CCM'].indexOf(_d.JobGroup) != -1)
                _d.Position = "OBS(CA)";
            if (_d.Position == "DH" && ['ISCCM', 'SCCM', 'CCM'].indexOf(_d.JobGroup) != -1)
                _d.Position = "DH(CA)";
        });

        $scope.cl.crewsAll = Enumerable.From($scope.cl.crewsAll).OrderBy(function (x) { var idx = $scope.OrderGD.indexOf(x.Position); return idx == -1 ? 1000 : idx; })
            //.ThenBy('$.GroupOrder').ThenBy('$.Name')
            .ThenBy('$.PositionId').ThenBy('$.Name')
            .ToArray();

        $scope.cl.crews = Enumerable.From(cds).Where('$.Position.trim()!="ACM" && $.Position.trim()!="FSO"')
            //.OrderBy('$.IsPositioning')
            //.ThenBy('$.GroupOrder').ThenBy('$.Name')
            //.ThenBy('$.GroupOrder')
            .OrderBy(function (x) { var idx = $scope.OrderGD.indexOf(x.Position); return idx == -1 ? 1000 : idx; })
            .ThenBy('$.PositionId').ThenBy('$.Name')
            .ToArray();


        $.each($scope.cl.crews, function (_i, _d) {


            // if (_d.IsPositioning)
            //     _d.Position = 'DH';

        });

        if ($scope.cl.crews.length < 18)
            for (var i = $scope.cl.crews.length; i < 18; i++) {
                $scope.cl.crews.push({ Position: ' ', Name: ' ' });
            }

        //kabiri
        ////////////////////////////////////
        $scope.cl.crewsfso = Enumerable.From(cds).Where('$.Position.trim()=="ACM" || $.Position.trim()=="FSO"')
            .OrderBy('$.PositionId')

            //.ThenBy('$.GroupOrder').ThenBy('$.PositionId')
            .ThenBy('$.Name')
            .ToArray();
        $.each($scope.cl.crewsfso, function (_i, _d) {

            _d.Position = 'FSO';

        });
        if ($scope.cl.crewsfso.length < 10)
            for (var i = $scope.cl.crewsfso.length; i < 10; i++) {
                $scope.cl.crewsfso.push({ Position: ' ', Name: ' ' });
            }
    };
    $scope.clShow = false;
    $scope.btn_fill2 = {
        text: 'Fill',
        type: 'success',

        width: 100,

        bindingOptions: {},
        onClick: function (e) {
            var ids = [];
            if ($scope.leg1Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg1Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg2Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg2Text + '"').FirstOrDefault();

                ids.push(_id.ID);
            }
            if ($scope.leg3Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg3Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg4Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg4Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg5Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg5Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg6Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg6Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg7Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg7Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }
            if ($scope.leg8Value) {
                var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg8Text + '"').FirstOrDefault();
                ids.push(_id.ID);
            }

            var idsStr = ids.join('_');
            $scope.loadingVisible = true;
            flightService.getCLDataLegs(idsStr).then(function (response) {
                //   console.log('cl');
                //   console.log(response);
                $scope.loadingVisible = false;
                if (!response)
                    return;
                var offset = -1 * (new Date()).getTimezoneOffset();
                $scope.cl.actype = response.actype;
                $scope.cl.regs = response.regs;
                var std = (new Date(response.std)).addMinutes(offset);
                var sta = (new Date(response.sta)).addMinutes(offset);
                persianDate.toLocale('en');
                $scope.cl.std_date = moment(new Date(std)).format('DD-MMM-YYYY');
                $scope.cl.std_persian = new persianDate(std).format("DD-MM-YYYY");
                $scope.cl.std_time = moment(new Date(std)).format('HH:mm');
                $scope.cl.sta_date = moment(new Date(sta)).format('DD-MMM-YYYY');
                $scope.cl.sta_persian = new persianDate(sta).format("DD-MM-YYYY");
                $scope.cl.sta_time = moment(new Date(sta)).format('HH:mm');
                $scope.cl.route = response.route;
                $scope.cl.no = response.no;


                $scope.cl.formNo = "";
                $scope.cl.tel = "+982148063000";
                $scope.cl.email = "OpsEng@Caspian.aero";


                //$scope.cl.crews = Enumerable.From(response.crew).OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                //kabiri-ok
                $scope.generateGDTables(response.crew);

                $scope.clShow = true;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }

    };


    $scope.datefrom = General.getDayFirstHour(new Date(2019, 5, 6, 0, 0, 0));
    $scope.dateto = General.getDayLastHour(new Date(2019, 5, 6, 0, 0, 0)); //General.getDayLastHour( (new Date(Date.now())) );

    $scope._datefrom = new Date();


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_datefrom',

        }
    };
    $scope.date_fromxs = {
        type: "date",
        placeholder: 'From',
        pickerType: 'rollers',
        width: '100%',
        displayFormat: "yy-MM-dd",
        bindingOptions: {
            value: '_datefrom',

        }
    };
    $scope.days_count = 2;
    $scope.num_days = {
        min: 1,
        showSpinButtons: true,
        bindingOptions: {
            value: 'days_count',

        }
    };
    $scope.btn_test = {
        text: 'test',
        type: 'success',
        icon: 'search',
        width: '100%',

        bindingOptions: {},
        onClick: function (e) {
            var $task = $('#task-4908');


        }

    };



    $scope.date_to = {
        type: "datetime",
        displayFormat: "yyyy-MM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            if (arg.value) {
                var d = new Date(arg.value);

            }

        },
        bindingOptions: {
            value: 'dateto',

        }
    };

    ///////////////////////////////////
    $scope.filterStatus = null;
    $scope.tag_status = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['title'],
        dataSource: Flight.filteredStatusDataSource,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'filterStatus',


        }
    };

    $scope.filterType = null;
    $scope.tag_types = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Title'],
        dataSource: $rootScope.getDatasourceFlightsAcTypes(Config.CustomerId),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'filterType',


        }
    };
    //Config.CustomerId
    $scope.filterAircraft = null;
    $scope.tag_aircrafts = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Title'],
        dataSource: $rootScope.getDatasourceFlightsRegisters(Config.CustomerId),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'filterAircraft',


        }
    };
    $scope.filterFrom = null;
    $scope.tag_from = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Title'],
        dataSource: $rootScope.getDatasourceFlightsFrom(Config.CustomerId),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'filterFrom',


        }
    };
    $scope.filterTo = null;
    $scope.tag_to = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Title'],
        dataSource: $rootScope.getDatasourceFlightsTo(Config.CustomerId),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'filterTo',


        }
    };
    //////////////////////////////
    $scope.checkOnBlock = true;
    $scope.check_onblock = {
        width: '100%',
        text: "On Block",
        bindingOptions: {
            value: 'checkOnBlock',
        }
    };
    $scope.checkOffBlock = true;
    $scope.check_offblock = {
        width: '100%',
        text: "Off Block",
        bindingOptions: {
            value: 'checkOffBlock',
        }
    };
    $scope.checkTakeOff = true;
    $scope.check_takeoff = {
        width: '100%',
        text: "Departued",
        bindingOptions: {
            value: 'checkTakeOff',
        }
    };
    $scope.checkLanding = true;
    $scope.check_landing = {
        width: '100%',
        text: "Arrived",
        bindingOptions: {
            value: 'checkLanding',
        }
    };
    $scope.checkScheduled = true;
    $scope.check_scheduled = {
        width: '100%',
        text: "Scheduled",
        bindingOptions: {
            value: 'checkScheduled',
        }
    };
    ///////////////////////////////
    $scope.applyNextFlight = false;
    $scope.check_applynext = {
        width: '100%',
        text: "Apply delay to next flights",
        bindingOptions: {
            value: 'applyNextFlight',
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
    //jooj
    $scope.calculateTotalDelay = function () {

        if (!$scope.logFlight.ChocksOut) {
            $scope.logFlight.TotalDelayHH = null;
            $scope.logFlight.TotalDelayMM = null;
            $scope.logFlight.TotalDelayTotalMM = 0;
            return;
        }
        var d1 = new Date($scope.logFlight.STD);
        var d2 = new Date($scope.logFlight.ChocksOut);
        if (d1 > d2) {
            $scope.logFlight.TotalDelayHH = 0;
            $scope.logFlight.TotalDelayMM = 0;
            $scope.logFlight.TotalDelayTotalMM = 0;
            return;
        }
        var delay = (subtractDates(d1, d2));
        var hh = Math.floor(delay / 60);
        var mm = delay % 60;
        $scope.logFlight.TotalDelayHH = hh;
        $scope.logFlight.TotalDelayMM = mm;
        $scope.logFlight.TotalDelayTotalMM = delay;
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
            value: 'logFlight.Takeoff',
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
            value: 'logFlight.Takeoff',
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

        type: "date",
        width: '100%',
        displayFormat: "MMM-dd",
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        interval: 5,
        bindingOptions: {
            value: 'logFlight.ChocksOut',
            // min: 'flight.baseStartDate',
            readOnly: 'IsOffBlockReadOnly',
            disabled: 'IsOffBlockReadOnly'
        }
    };
    $scope.time_offblock2_hh = {
        type: "time",
        width: '100%',
        // pickerType: "rollers",
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        bindingOptions: {
            value: 'logFlight.ChocksOut',
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
            value: 'logFlight.ChocksIn',
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
            value: 'logFlight.ChocksIn',
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
            value: 'logFlight.Landing',
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
            value: 'logFlight.Landing',
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
            value: 'logFlight.FuelDeparture',
            readOnly: 'IsFuelReadOnly'
        }
    };
    $scope.fuel_fp = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.FPFuel',
            readOnly: 'IsFuelReadOnly'
        }
    };
    $scope.fuel_defuel = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.Defuel',
            readOnly: 'IsFuelReadOnly'
        }
    };
    $scope.fuel_arr = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.FuelArrival',
            readOnly: 'IsFuelReadOnly'

        }
    };

    $scope.paxTotal = 0;
    $scope.paxOver = 0;
    $scope.calculateTotalPax = function () {
        $scope.paxTotal = 0;
        var sum = 0;
        if ($scope.logFlight.PaxAdult)
            sum += $scope.logFlight.PaxAdult;
        if ($scope.logFlight.PaxChild)
            sum += $scope.logFlight.PaxChild;
        // if ($scope.flight.PaxInfant)
        //     sum += $scope.flight.PaxInfant;
        if ($scope.logFlight.TotalSeat && sum > $scope.logFlight.TotalSeat) {
            $scope.logFlight.PaxOver = sum - $scope.logFlight.TotalSeat;
        }
        else
            $scope.logFlight.PaxOver = 0;
        $scope.logFlight.TotalPax = sum;

        if ($scope.logFlight.TotalSeat) {
            var cof = round2(sum * 100.0 / (1.0 * $scope.logFlight.TotalSeat), 2);
            $scope.loadPax = cof + ' %';

        }

    };
    $scope.total_seats = {
        readOnly: true,
        bindingOptions: {
            value: 'logFlight.TotalSeat'
        }
    };
    $scope.total_pax = {
        readOnly: true,
        bindingOptions: {
            value: 'logFlight.TotalPax'
        }
    };
    $scope.txt_wdh = {
        readOnly: false,
        bindingOptions: {
            value: 'logFlight.NightTime'
        }
    };
    $scope.sb_acpos = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 0, Title: 'Caspian Ramp' }, { Id: 1, Title: 'Civil Ramp' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'logFlight.JLBLHH',
            readOnly: 'NotEditable'

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
            value: 'logFlight.PaxAdult',
            readOnly: 'depReadOnly'
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
            value: 'logFlight.PaxChild',
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
            value: 'logFlight.PaxInfant',
            readOnly: 'depReadOnly'
        }
    };
    $scope.pax_over = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            readOnly: 'depReadOnly',
            value: 'logFlight.PaxOver',
        }
    };
    $scope.cargo_piece = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.CargoCount',

        }
    };
    $scope.cargo_weight = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.CargoWeight',

        }
    };
    $scope.cargo_excess = {
        readOnly: false,
        min: 0,

    };
    $scope.bag_piece = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.BaggageCount',

        }
    };
    $scope.bag_weight = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.BaggageWeight',

        }
    };
    $scope.bag_excess = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            readOnly: 'depReadOnly'
        }
    };
    //var _oof=(new Date(2020,8,1,10,0,0,0)).getTimezoneOffset();
    // alert(_oof);
    //ati log

    //najaf
    var getOffset = function (dt) {
        var _oof = (new Date(dt)).getTimezoneOffset();
        return _oof;
    };
    var getUtcDate = function (dt) {
        return (new Date(dt)).addMinutes(getOffset(dt));
    };
    var getLocalDate = function (dt) {
        return (new Date(dt)).addMinutes(-getOffset(dt));
    };
    var getOffsetDate = function (dt, m, n) {
        if (!n)
            n = 0;
        var diff = m * getOffset(dt);
        diff = diff + n;
        return (new Date(dt)).addMinutes(diff);
    };
    $scope.convertToUTC = function () {
        //dlu
        $scope.logFlight.ChocksOut = getUtcDate($scope.logFlight.ChocksOut);
        $scope.logFlight.ChocksIn = getUtcDate($scope.logFlight.ChocksIn);
        $scope.logFlight.Takeoff = getUtcDate($scope.logFlight.Takeoff);
        $scope.logFlight.Landing = getUtcDate($scope.logFlight.Landing);
        $scope.logFlight.STA2 = getUtcDate($scope.logFlight.STA2);
        $scope.logFlight.STD2 = getUtcDate($scope.logFlight.STD2);


        $scope.time_status_value = getUtcDate($scope.time_status_value);

    };
    $scope.convertToLCL = function () {
        $scope.logFlight.ChocksOut = getLocalDate($scope.logFlight.ChocksOut);
        $scope.logFlight.ChocksIn = getLocalDate($scope.logFlight.ChocksIn);
        $scope.logFlight.Takeoff = getLocalDate($scope.logFlight.Takeoff);
        $scope.logFlight.Landing = getLocalDate($scope.logFlight.Landing);
        $scope.logFlight.STA2 = getLocalDate($scope.logFlight.STA2);
        $scope.logFlight.STD2 = getLocalDate($scope.logFlight.STD2);

        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
    $scope.otimes = null;
    $scope.timeBase = 'LCB';
    $scope.timeBaseReadOnly = false;
    $scope.sb_timebase = {
        showClearButton: false,
        searchEnabled: false,
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
            //visible:'!doUTC',
            readOnly: 'timeBaseReadOnly'
        }
    };
    $scope.remark_status_height = 80;
    $scope.isRemarkNotEditable = !($scope.IsEditable || $scope.IsRemark);
    $scope.remark_status = {
        bindingOptions: {
            value: 'logFlight.DepartureRemark',
            height: 'remark_status_height',
            readOnly: 'isRemarkNotEditable'
        }
    };

    $scope.ramp_stand = {
        bindingOptions: {
            value: 'logFlight.ArrivalRemark',

            readOnly: 'isRemarkNotEditable'
        }
    };
    $scope.parkingPosition = {
        bindingOptions: {
            value: 'logFlight.ArrivalRemark',

        }
    }

    $scope.isTimeStatusVisible = false;
    $scope.time_status_value = new Date();
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
            readOnly: 'NotEditable'

        }
    };

    $scope.remark_redirect = {
        bindingOptions: {
            value: 'logFlight.RedirectRemark',
            height: '40',
            readOnly: 'NotEditable'
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
            readOnly: 'NotEditable'

        }
    };

    $scope.remark_ramp = {
        bindingOptions: {
            value: 'logFlight.RampRemark',
            height: '40',
            readOnly: 'NotEditable'
        }
    };

    $scope.delayCodeId = 21;
    $scope.delayCode = {
        Id: 21,
        HH: null,
        MM: null,
        Code: null,
        Title: null,
        Remark: null,
        Total: null,
    };
    $scope.clearDelayCode = function () {
        //$scope.delayCode.Id = 21;
        $scope.delayCode.HH = null;
        $scope.delayCode.MM = null;
        $scope.delayCode.Remark = null;
        $scope.delayCode.Total = null;
        $scope.delayCodeId = null;

    };
    $scope.delayCodeCounter = -1;
    $scope.fillDelayCode = function (d) {
        $scope.delayCodeCounter = $scope.delayCodeCounter - 1;
        $scope.delayCode.Id = $scope.delayCodeCounter; //d.Id;
        $scope.delayCode.DelayCodeId = d.Id;
        $scope.delayCode.Code = d.Code;
        $scope.delayCode.Title = d.Title;
    };
    $scope.txt_delay_remark = {
        width: '98%',
        bindingOptions: {
            value: 'delayCode.Remark',


        }
    };
    $scope.num_delayhh = {
        max: 99, min: 0, width: 40, showSpinButtons: true,
        bindingOptions: {
            value: 'delayCode.HH'
        }
    };
    $scope.num_delaymm = {
        max: 59, min: 0, width: 45, showSpinButtons: true,
        bindingOptions: {
            value: 'delayCode.MM'
        }
    };
    $scope._delayItem = null;
    $scope.$watch("_delayItem", function (newValue) {

        try {

            if ($scope._delayItem)
                $scope.delayCode.Remark = $scope._delayItem.Remark;
            else
                $scope.delayCode.Remark = "";

        }
        catch (e) {

        }

    });
    $scope.sb_delay = {
        showClearButton: false,
        searchEnabled: true,

        onSelectionChanged: function (e) {
            if (!e || !e.selectedItem)
                $scope.clearDelayCode();
            else
                $scope.fillDelayCode(e.selectedItem);
        },
        displayExpr: "Title2",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'delayCodeId',
            dataSource: 'delayCodes',
            selectedItem: '_delayItem',

        }
    };

    //goh
    $scope.btn_add_delay = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        validationGroup: 'movdelay',
        bindingOptions: {},
        onClick: function (e) {
            if (!$scope.delayCode.HH)
                $scope.delayCode.HH = 0;
            if (!$scope.delayCode.MM)
                $scope.delayCode.MM = 0;
            if ($scope.delayCode.HH == 0 && $scope.delayCode.MM == 0) {
                General.ShowNotify('Amount is not valid', 'error');
                return;
            }


            var dc = JSON.parse(JSON.stringify($scope.delayCode));
            dc.Amount = pad($scope.delayCode.HH) + ':' + pad($scope.delayCode.MM);

            dc.Total = $scope.delayCode.HH * 60 + $scope.delayCode.MM;
            $scope.dg_delay_ds.push(dc);
            $scope.clearDelayCode();


        }

    };
    $scope.btn_showcodes = {
        text: '',
        type: 'success',
        icon: 'search',
        width: '20',

        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_codes_visible = true;

        }

    };
    //goh
    $scope.btn_remove_delay = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_delay_selected = $rootScope.getSelectedRow($scope.dg_delay_instance);
            if (!$scope.dg_delay_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }


            var ds = Enumerable.From($scope.dg_delay_ds).Where('$.Id!=' + $scope.dg_delay_selected.Id).ToArray();
            $scope.dg_delay_ds = ds;

        }

    };



    $scope.IsOffBlockReadOnly = false;
    $scope.IsTakeOffReadOnly = false;
    $scope.IsLandingReadOnly = false;
    $scope.IsOnBlockReadOnly = false;
    $scope.isRedirectReasonVisible = true;
    $scope.isRampReasonVisible = true;
    $scope.stationDs = [






        { id: 22, title: 'Boarding', bgcolor: '#ff66ff', color: '#fff', class: 'boarding', selectable: true },


        { id: 23, title: 'Gate Closed', bgcolor: '#cc33ff', color: '#fff', class: 'gateclosed', selectable: true },




        { id: 14, title: 'Off Block', bgcolor: '#80ffff', color: '#fff', class: 'offblock', selectable: true },
        { id: 21, title: 'Taxi', bgcolor: '#00b3b3', color: '#fff', class: 'taxi', selectable: true },


        //  { id: 14, title: 'Off Block', bgcolor: '#00cc66', color: '#fff', class: 'offblock',selectable:true },
        { id: 2, title: 'Take Off', bgcolor: '#00ff00', color: '#000', class: 'takeoff', selectable: true },
        { id: 3, title: 'Landed', bgcolor: '#99ccff', color: '#000', class: 'landing', selectable: true },
        { id: 15, title: 'On Block', bgcolor: '#66b3ff', color: '#000', class: 'onblock', selectable: true },




    ];
    $scope.statusDs = $scope.IsStaion ? $scope.stationDs : Enumerable.From(Flight.statusDataSource).Where('$.selectable').ToArray();
    $scope.sb_status = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: $scope.statusDs,
        onSelectionChanged: function (e) {

            /////////////////////////////
            var bg = 'rgb(238, 238, 238)';
            var color = '#000';
            if (e && e.selectedItem) {
                bg = e.selectedItem.bgcolor;
                color = e.selectedItem.color;
            }
            // $('#status_caption').css('color', color).css('background', bg);

            $scope.remark_status_height = 54 + 96;
            $scope.isTimeStatusVisible = false;
            $scope.isCancelReasonVisible = false;
            // $scope.isRampReasonVisible = false;
            // $scope.isRedirectReasonVisible = false;
            if (e.selectedItem.id == 4) {
                $scope.isCancelReasonVisible = true;
                $scope.remark_status_height = 54 + 96;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.logFlight.CancelDate ? new Date($scope.logFlight.CancelDate) : new Date();
                if (!$scope.logFlight.CancelReasonId)
                    $scope.logFlight.CancelReasonId = 10004;
            }
            //ramp
            if (e.selectedItem.id == 9) {
                // $scope.isRampReasonVisible = true;
                $scope.remark_status_height = 54 + 96;
                $scope.isTimeStatusVisible = false;
                $scope.time_status_value = $scope.logFlight.RampDate ? new Date($scope.logFlight.RampDate) : new Date();
            }
            //redirect
            //2021-1-17
            if (e.selectedItem.id == 17) {
                // $scope.isRedirectReasonVisible = true;
                $scope.remark_status_height = 54;
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
            value: 'logFlight.FlightStatusID',

        }
    };
    $scope.dsFlightType = [
        { Id: 109, Title: 'Schedule', ParentId: 108, IsSystem: 1, OrderIndex: 1, Parent: 'Flight Types' },
        { Id: 1112, Title: 'Charter', ParentId: 108, IsSystem: 1, OrderIndex: 4, Parent: 'Flight Typest' },
        { Id: 1113, Title: 'Free Flight', ParentId: 108, IsSystem: 1, OrderIndex: 5, Parent: 'Flight Types' },
        { Id: 1114, Title: 'Position', ParentId: 108, IsSystem: 1, OrderIndex: 6, Parent: 'Flight Types' }
    ];
    $scope.sb_flighttype = {
        readOnly: true,
        showClearButton: true,
        searchEnabled: true,
        // dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'logFlight.FlightTypeID',
            dataSource: 'dsFlightType',
        }
    };
    /////////////////////
    $scope.dsMassUnit = [
        { Id: 111, Title: 'Kgs', ParentId: 110, IsSystem: 1, OrderIndex: 1, Parent: 'Mass Unit' },
        { Id: 112, Title: 'Lbs', ParentId: 110, IsSystem: 1, OrderIndex: 2, Parent: 'Mass Unit' }
    ];
    $scope.dsVolumeUnit = [
        { Id: 114, Title: 'Ltr', ParentId: 113, IsSystem: 1, OrderIndex: 1, Parent: 'Volume Unit' },
        { Id: 115, Title: 'Kgs', ParentId: 113, IsSystem: 1, OrderIndex: 2, Parent: 'Volume Unit' },
        { Id: 5002, Title: 'Lbs', ParentId: 113, IsSystem: 1, OrderIndex: 3, Parent: 'Volume Unit' }
    ];
    $scope.sb_massunit = {
        showClearButton: false,
        searchEnabled: false,
        // dataSource: $rootScope.getDatasourceOption(110),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'dsMassUnit',
            value: 'logFlight.CargoUnitID',

        }
    };
    $scope.sb_volumeunit = {
        showClearButton: true,
        searchEnabled: false,
        //dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'dsVolumeUnit',
            value: 'logFlight.FuelUnitID',
            text: 'logFlight.FuelUnit',
            readOnly: 'IsFuelReadOnly'
        }
    };
    $scope.sb_volumeunit2 = {
        showClearButton: true,
        searchEnabled: true,
        // dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        readOnly: true,
        bindingOptions: {
            dataSource: 'dsVolumeUnit',
            value: 'flight.FuelUnitID',

        }
    };

    $scope.entity_cancel = {
        UserId: null,
        FlightId: null,
        CancelReasonId: null,
        CancelRemark: null,
        CancelDate: null,
    };
    $scope.cleat_entity_cancel = function () {
        $scope.entity_cancel.UserId = null;
        $scope.entity_cancel.FlightId = null;
        $scope.entity_cancel.CancelReasonId = null;
        $scope.entity_cancel.CancelRemark = null;
        $scope.entity_cancel.CancelDate = null;
    };

    $scope.entity_redirect = {
        UserId: null,
        FlightId: null,
        RedirectReasonId: null,
        RedirectRemark: null,
        RedirectDate: null,
        AirportId: null,
        STA: null,
        OAirportIATA: null,
        AirportIATA: null,
        Airport: null,
    };
    $scope.clear_entity_redirect = function () {
        $scope.entity_redirect.UserId = null;
        $scope.entity_redirect.FlightId = null;
        $scope.entity_redirect.RedirectReasonId = null;
        $scope.entity_redirect.RedirectRemark = null;
        $scope.entity_redirect.RedirectDate = null;
        $scope.entity_redirect.AirportId = null;
        $scope.entity_redirect.Airport = null;
        $scope.entity_redirect.STA = null;
    };

    $scope.isCancelReasonVisible = false;
    $scope.sb_cancel_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'logFlight.CancelReasonId',
            readOnly: 'NotEditable'
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
            value: 'logFlight.RedirectReasonId',
            readOnly: 'NotEditable'
        }
    };

    $scope.sb_ramp_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'logFlight.RampReasonId',
            readOnly: 'NotEditable'
        }
    };
    $scope.num_fphh = {
        max: 99, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'logFlight.FPFlightHH',
            readOnly: 'NotEditable'
        }
    };
    $scope.num_fpmm = {
        max: 59, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'logFlight.FPFlightMM',
            readOnly: 'NotEditable'
        }
    };

    $scope.num_blhh = {
        max: 99, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'flight.JLBLHH'
        }
    };

    $scope.num_blmm = {
        max: 59, min: 0, width: 50, showSpinButtons: true,
        bindingOptions: {
            value: 'flight.JLBLMM'
        }
    };
    $scope.fuel_used = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.UsedFuel',
            readOnly: 'IsFuelReadOnly'

        }
    };

    $scope.sb_pflr = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'I' }, { Id: 2, Title: 'P' }, { id: 3, Title: 'C' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'flight.PFLR',


        }
    };
    ////////////////////////
    $scope.num_totaldelayhh = {
        max: 99, min: 0, width: 45, showSpinButtons: false, readOnly: true,
        bindingOptions: {
            value: 'logFlight.TotalDelayHH'
        }
    };
    $scope.num_totaldelayhhmm = {
        max: 59, min: 0, width: 45, showSpinButtons: false, readOnly: true,
        bindingOptions: {
            value: 'logFlight.TotalDelayMM'
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
            readOnly: 'NotEditable'
        }
    };
    ///popups//////////////////////////
    $scope.moment = function (date) {
        return moment(date).format('MMMM Do YYYY');
    };
    $scope.momenttime = function (date) {
        if (!date)
            return '--';
        return moment(date).format('HH:mm');
    };
    $scope.setStatus = function (flight, status) {
        var statusItem = Enumerable.From(Flight.statusDataSource).Where('$.id==' + status).FirstOrDefault();
        flight.status = status;
        $scope.flight.FlightStatusID = status;
        flight.FlightStatus = statusItem.title;
    };
    $scope.getStatusClass = function (filght) {
        var status = Enumerable.From(Flight.statusDataSource).Where('$.id==' + filght.status).FirstOrDefault();
        return "col-lg-2 col-md-3 col-sm-3 col-xs-3 font-inherit " + status.class;
    };


    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //height: function () { return $(window).height() * 0.95-120 },
        height: 571,
    };
    $scope.scroll2_height = 300;
    $scope.scroll_2 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll2_height', }
        //height: function () { return $(window).height() * 0.95-120 },

    };
    $scope.scroll_dep = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //    height: function () { return $(window).height() * 0.95 - 150 },
        height: 497,
    };

    $scope.scroll_arr = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //    height: function () { return $(window).height() * 0.95 - 150 },
        height: 497,
    };

    var tabs = [
        { text: "Main", id: 'departure', visible: true },
        //{ text: "Arrival", id: 'arrival',  visible: true },

        { text: "Delays", id: 'delays', visible: true },
        //{ text: "Education", id: 'education', visible: true },

        //{ text: "Course", id: 'course', visible: true },
        //{ text: "Group", id: 'group', visible: true },
        //{ text: "Employee", id: 'employee', visible: true },


    ];
    var tabs2 = [
        { text: "Main", id: 'arrival', visible: true },
        { text: "Departure", id: 'depparr', visible: true },


    ];
    $scope.tabs = tabs;
    $scope.selectedTabIndex = -1;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });

            $scope.dg_instance.repaint();


            //var myVar = setInterval(function () {


            //    var scl2 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });


            //    clearInterval(myVar);
            //}, 10);







        }
        catch (e) {

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


    $scope.tabs2 = tabs2;
    $scope.selectedTabIndex2 = -1;
    $scope.$watch("selectedTabIndex2", function (newValue) {

        try {
            $scope.selectedTab2 = tabs2[newValue];

            $('.tab').hide();
            $('.' + $scope.selectedTab2.id).fadeIn(100, function () {


            });
            $scope.dg2_instance.repaint();

        }
        catch (e) {

        }

    });
    $scope.tabs2_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs2", deep: true },
            selectedIndex: 'selectedTabIndex2'
        }

    };




    ///////////////////////////////


    $scope.fuelDepInit = {};

    /////////////////////////////////

    $scope.fuelArrInit = {};


    ///////////////////////////////

    $scope.paxSaved = false;
    $scope.paxInit = {};

    ///////////////////////////////////

    $scope.popup_link_visible = false;
    $scope.popup_link_title = 'Linked Flight';

    $scope.popup_link = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_link"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 490,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fblink', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //$scope.time_ir_std_date
                        //$scope.time_ir_std_time
                        var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
                        var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
                        var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);

                        var sta_dates = (new Date($scope.time_ir_sta_date)).getDatePartArray();
                        var sta_times = (new Date($scope.time_ir_sta_time)).getTimePartArray();
                        var sta = new Date(sta_dates[0], sta_dates[1], sta_dates[2], sta_times[0], sta_times[1], 0, 0);

                        var _flight = JSON.parse(JSON.stringify($scope.linkEntity));

                        _flight.FlightStatusID = 1;
                        _flight.STD = (new Date(std)).toUTCString();
                        _flight.STA = (new Date(sta)).toUTCString();
                        _flight.LinkedReason = 1133;
                        //_flight.BoxId = $scope.flight.BoxId;
                        //if (!$scope.useCrew)
                        //  _flight.BoxId = -1;
                        //kook
                        $scope.loadingVisible = true;
                        flightService.saveFlight(_flight).then(function (response) {

                            //$scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            $scope.loadingVisible = false;

                            $scope.popup_link_visible = false;

                            // $rootScope.$broadcast('onFlightSaved', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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
        },
        onHiding: function () {
            //koosk
            $scope.linkEntity.ToAirportId = null;
            $scope.linkEntity.FromAirportId = null;
            $scope.time_ir_std_date = null;
            $scope.time_ir_std_time = null;
            $scope.time_ir_sta_date = null;
            $scope.time_ir_sta_time = null;
            $scope.linkEntity = null;
            $scope.popup_link_visible = false;

        },
        bindingOptions: {
            visible: 'popup_link_visible',

            title: 'popup_link_title',

        }
    };

    //close button
    $scope.popup_link.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_link_visible = false;

    };
    //////////////////////////////////////
    //divargar-ok
    $scope.popup_delete_visible = false;
    $scope.popup_delete_title = 'Delete Flight(s)';

    $scope.popup_delete = {

        shading: true,
        //position: { my: 'right', at: 'right', of: window, offset: '-15 0' },

        height: 500,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbdelete', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        General.Confirm(Config.Text_DeleteConfirm, function (res) {
                            if (res) {

                                var _flight = { Id: $scope.ati_flight.ID };

                                _flight.UserName = $rootScope.userName;

                                //divargar3
                                //07-10
                                _flight.Days = $scope.interval_days.join('_');
                                var _zoffset = (new Date($scope.ati_flight.STD)).getTimezoneOffset();
                                var stdOffset = (new Date($scope.ati_flight.STD)).addMinutes(_zoffset);


                                var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                                var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
                                var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                                var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
                                //07-10
                                if (stdOffset.getDate() != (new Date($scope.ati_flight.STD)).getDate()) {
                                    intervalFrom = (new Date(intervalFrom)).addDays(-1);
                                    intervalTo = (new Date(intervalTo)).addDays(-1);
                                    var _Days = [];
                                    $.each($scope.interval_days, function (_q, _y) {
                                        var _nd = _y - 1;
                                        if (_nd == -1)
                                            _nd = 6;
                                        _Days.push(_nd);

                                    });
                                    _flight.Days = _Days.join('_');

                                }


                                _flight.IntervalFrom = (new Date(intervalFrom)).toUTCString();
                                _flight.IntervalTo = (new Date(intervalTo)).toUTCString();
                                _flight.Interval = 2;
                                //_flight.Days = $scope.interval_days.join('_');
                                _flight.CheckTime = $scope.interval_checktime ? 1 : 0;


                                $scope.loadingVisible = true;
                                flightService.deleteFlightGroup(_flight).then(function (response) {

                                    General.ShowNotify(Config.Text_SavedOk, 'success');

                                    $scope.loadingVisible = false;
                                    var dels = Enumerable.From($scope.ganttData.flights).Where(function (x) { return response.indexOf(x.ID) != -1 }).ToArray();
                                    $.each(dels, function (_j, _flt) {
                                        $scope.removeFromGantt(_flt, _flt.RegisterID);
                                    });
                                    $scope.popup_delete_visible = false;




                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                            }
                        });






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

            $scope.interval_checktime = true;
        },
        onHiding: function () {

            // if ($scope.freeSaved)
            //    $scope.BeginSearch();

            $scope.sms_nira_nsf = true;

            $scope.popup_delete_visible = false;

        },
        bindingOptions: {
            visible: 'popup_delete_visible',
            height: 'popup_delete_height',
            title: 'popup_delete_title',

        }
    };

    //close button
    $scope.popup_delete.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_delete_visible = false;

    };

    $scope.time_interval_from_date = null;
    $scope.time_interval_to_date = null;
    $scope.time_interval_from = {
        type: "date",
        width: '100%',


        readOnly: true,
        bindingOptions: {
            value: 'time_interval_from_date',

        }
    };
    $scope.time_interval_to = {
        type: "date",
        width: '100%',

        bindingOptions: {
            value: 'time_interval_to_date',

        }
    };

    $scope.interval_checktime = true;
    $scope.check_interval_checktime = {
        width: '100%',
        text: "Check Departure / Arrival",

        bindingOptions: {
            value: 'interval_checktime',
        }
    };

    $scope.interval_days = [];
    $scope.tag_days_instance = null;
    $scope.tag_days = {
        dataSource: General.WeekDayDataSource,
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_days_instance)
                $scope.tag_days_instance = e.component;
        },
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {

            value: "interval_days"
        },

    };

    $scope.actv_reg = null;
    $scope.sb_actv_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $scope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Register', 'MSN'],

        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'actv_reg',
            //2020-11-16
            dataSource: 'realMSNs',


        }
    };
    $scope.actv_remark = "";
    $scope.txt_actv_remark = {
        height: 100,
        bindingOptions: {
            value: 'actv_remark',

        }
    };
    //magu38
    $scope.btn_actv = {
        hint: 'Activate Flight(s)',
        type: 'success',
        icon: 'fas fa-toggle-on',
        width: '100%',

        onClick: function (e) {
            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            var ati_flight1 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            var ati_flight2 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].ID).FirstOrDefault();
            if ($scope.IsComm) {
                $scope.time_interval_from_date = new Date(ati_flight1.STD);
                $scope.time_interval_to_date = new Date(ati_flight2.STD);
                $scope.interval_days = [];
                $scope.interval_days.push((new Date(ati_flight1.STD)).getDay());
                $scope.interval_days.push((new Date(ati_flight2.STD)).getDay());

            }

            $scope.popup_actv_visible = true;



        }
    };

    //magu38
    $scope.popup_actv_visible = false;
    $scope.popup_actv_title = 'Activate Flight(s)';

    $scope.popup_actv = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_actv"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 550,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbactv', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var _utcFlights = [];
                        var _nflights = [];
                        $.each($scope.ati_selectedFlights, function (_q, _w) {
                            var _zoffset = (new Date(_w.STD)).getTimezoneOffset();
                            var _b1 = (new Date(_w.STD)).getDate();
                            var _b2 = (new Date(_w.STD)).addMinutes(_zoffset).getDate();


                            if (_b1 == _b2)
                                _nflights.push(_w);
                            else
                                _utcFlights.push(_w);

                        });

                        var allflights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var flights = Enumerable.From(_nflights).Select('$.ID').ToArray();
                        var utcflights = Enumerable.From(_utcFlights).Select('$.ID').ToArray();
                        // var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var entity = {


                            userId: $rootScope.userId,
                            userName: $rootScope.userName,
                            reason: 0,

                            fids: $scope.IsComm ? flights : allflights,
                            //2020-11-24
                            remark: $scope.actv_remark,
                            reg: $scope.actv_reg


                        };
                        var uentity = {


                            userId: $rootScope.userId,
                            userName: $rootScope.userName,
                            reason: 0,

                            fids: utcflights,
                            //2020-11-24
                            remark: $scope.actv_remark,
                            reg: $scope.actv_reg


                        };

                        if ($scope.IsComm) {
                            var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);

                            var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
                            entity.intervalFrom = (new Date(intervalFrom)).toUTCString();

                            entity.intervalTo = (new Date(intervalTo)).toUTCString();
                            entity.interval = 2;
                            entity.days = $scope.interval_days;
                            var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
                            var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
                            entity.RefDate = (new Date(ref)).toUTCString();
                            entity.RefDays = $scope.days_count;
                            ///////////////////////////////

                            var uinterval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var uintervalFrom = new Date(uinterval_from_dates[0], uinterval_from_dates[1], uinterval_from_dates[2], 12, 0, 0, 0);
                            var uinterval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var uintervalTo = new Date(uinterval_to_dates[0], uinterval_to_dates[1], uinterval_to_dates[2], 12, 0, 0, 0);
                            uentity.intervalFrom = (new Date(uintervalFrom)).addDays(-1).toUTCString();
                            uentity.intervalTo = (new Date(uintervalTo)).addDays(-1).toUTCString();
                            uentity.interval = 2;
                            uentity.days = [];
                            $.each($scope.interval_days, function (_q, _y) {
                                var _nd = _y - 1;
                                if (_nd == -1)
                                    _nd = 6;
                                uentity.days.push(_nd);

                            });
                            var uref_dates = (new Date($scope._datefrom)).addDays(-1).getDatePartArray();
                            var uref = new Date(uref_dates[0], uref_dates[1], uref_dates[2], 12, 0, 0, 0);
                            uentity.RefDate = (new Date(uref)).toUTCString();
                            uentity.RefDays = $scope.days_count;
                            //////////////////////////////////
                            $scope.loadingVisible = true;
                            flightService.activeFlightsGroup(entity).then(function (response) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    if (aflt) {
                                        var oldResId = aflt.RegisterID;
                                        for (var key of Object.keys(_flt)) {


                                            aflt[key] = _flt[key];

                                        }
                                        $scope.modifyFlightTimes(aflt);

                                        var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                        $scope.modifyGantt(aflt, _ressq, oldResId);
                                    }

                                });
                                if (_utcFlights.length > 1) {

                                    $scope.loadingVisible = true;
                                    flightService.activeFlightsGroup(uentity).then(function (response) {

                                        $scope.loadingVisible = false;
                                        $.each(response.flights, function (_i, _flt) {
                                            var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                            if (aflt) {
                                                var oldResId = aflt.RegisterID;
                                                for (var key of Object.keys(_flt)) {


                                                    aflt[key] = _flt[key];

                                                }
                                                $scope.modifyFlightTimes(aflt);

                                                var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                                $scope.modifyGantt(aflt, _ressq, oldResId);
                                            }

                                        });

                                        $scope.popup_actv_visible = false;

                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                }
                                else
                                    $scope.popup_actv_visible = false;


                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else {
                            $scope.loadingVisible = true;
                            flightService.activeFlights(entity).then(function (response) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    var oldResId = aflt.RegisterID;
                                    for (var key of Object.keys(_flt)) {


                                        aflt[key] = _flt[key];

                                    }
                                    $scope.modifyFlightTimes(aflt);

                                    var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                    $scope.modifyGantt(aflt, _ressq, oldResId);
                                });

                                $scope.popup_actv_visible = false;

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }



                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_actv_visible = false;

        },
        bindingOptions: {
            visible: 'popup_actv_visible',

            title: 'popup_actv_title',

        }
    };

    //close button
    $scope.popup_actv.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_actv_visible = false;

    };
    //////////////////////////////////////
    $scope.saveFree = function () {
        //07-10

        //04-30
        var oldSTD = $scope.linkEntity.STD;

        var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
        var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
        var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);


        var sta_dates = (new Date($scope.time_ir_sta_date)).getDatePartArray();
        var sta_times = (new Date($scope.time_ir_sta_time)).getTimePartArray();
        var sta = new Date(sta_dates[0], sta_dates[1], sta_dates[2], sta_times[0], sta_times[1], 0, 0);

        var _flight = JSON.parse(JSON.stringify($scope.linkEntity));

        _flight.FlightStatusID = 1;
        _flight.STD = (new Date(std)).toUTCString();
        _flight.STDRAW = moment(new Date(std)).format("YYYY-MM-DD-HH-mm");

        //9-8
        _flight.STDHH = (new Date(std)).getHours();
        _flight.STDMM = (new Date(std)).getMinutes();

        _flight.STA = (new Date(sta)).toUTCString();
        _flight.STARAW = moment(new Date(sta)).format("YYYY-MM-DD-HH-mm");
        _flight.SMSNira = $scope.sms_nira_nsf ? 1 : 0;
        _flight.UserName = $rootScope.userName;

        _flight.RefDateRAW = moment(new Date($scope._datefrom)).format("YYYY-MM-DD-12-00");

        //divargar-ok3
        var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
        var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
        var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
        var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
        _flight.IntervalFromRAW = moment(new Date(intervalFrom)).format("YYYY-MM-DD-12-00");
        _flight.IntervalToRAW = moment(new Date(intervalTo)).format("YYYY-MM-DD-12-00");

        //07-10
        _flight.Days = $scope.interval_days;
        _flight.DaysUTC = $scope.interval_days;
        var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
        var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
        _flight.RefDate = (new Date(ref)).toUTCString();
        _flight.RefDays = $scope.days_count;

        var _zoffset = (new Date($scope.time_ir_std_date)).getTimezoneOffset();
        // var stdOffset = (new Date(std)).addMinutes(_zoffset);
        var stdOffset = (new Date(oldSTD)).addMinutes(_zoffset);
        if (_flight.ID == -1)
            var stdOffset = (new Date(std)).addMinutes(_zoffset);

        if (stdOffset.getDate() != std.getDate()) {
            intervalFrom = (new Date(intervalFrom)).addDays(-1);
            intervalTo = (new Date(intervalTo)).addDays(-1);
            _flight.Days = [];
            $.each($scope.interval_days, function (_q, _y) {
                var _nd = _y - 1;
                if (_nd == -1)
                    _nd = 6;
                _flight.Days.push(_nd);

            });
            _flight.RefDate = (new Date(ref)).addDays(-1).toUTCString();
        }


        _flight.IntervalFrom = (new Date(intervalFrom)).toUTCString();
        _flight.IntervalTo = (new Date(intervalTo)).toUTCString();
        _flight.Interval = 2;
        //_flight.Days = $scope.interval_days;

        //07-10
        //var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
        //var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
        //_flight.RefDate = (new Date(ref)).toUTCString();
        // _flight.RefDays = $scope.days_count;

        //magu2-16
        _flight.DepartureRemark = $scope.dep_remark_edit;



        $scope.loadingVisible = true;
        //11-18
        if (!$scope.IsComm) {
            flightService.saveFlight(_flight).then(function (response) {




                General.ShowNotify(Config.Text_SavedOk, 'success');

                $scope.linkEntity.FlightNumber = null;
                $scope.linkEntity.FromAirportId = $scope.linkEntity.ToAirportId;
                $scope.linkEntity.ToAirportId = null;
                $scope.linkEntity.FlightH = null;
                $scope.linkEntity.FlightM = null;

                $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.time_ir_sta_date));
                $scope.time_ir_std_time = (new Date($scope.time_ir_sta_time)).addMinutes(60);
                $scope.time_ir_sta_date = null;
                $scope.time_ir_sta_time = null;
                $scope.loadingVisible = false;
                $scope.freeSaved = true;




                if ($scope.linkEntity.ID != -1) {
                    for (var key of Object.keys(response.flight)) {


                        $scope.ati_flight[key] = response.flight[key];

                    }
                    $scope.modifyFlightTimes($scope.ati_flight);
                    $scope.modifyGantt($scope.ati_flight, response.ressq[0]);
                }
                else {
                    $scope.modifyFlightTimes(response.flight);
                    $scope.addToGantt(response.flight, response.ressq[0]);
                }

                if ($scope.linkEntity.ID != -1)
                    $scope.popup_free_visible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else {
            if ($scope.linkEntity.ID == -1)
                _flight.CheckTime = 0;
            else
                _flight.CheckTime = $scope.interval_checktime ? 1 : 0;
            flightService.saveFlightGroupUTC(_flight).then(function (response) {




                General.ShowNotify(Config.Text_SavedOk, 'success');

                $scope.linkEntity.FlightNumber = null;
                $scope.linkEntity.FromAirportId = $scope.linkEntity.ToAirportId;
                $scope.linkEntity.ToAirportId = null;
                $scope.linkEntity.FlightH = null;
                $scope.linkEntity.FlightM = null;

                $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.time_ir_sta_date));
                $scope.time_ir_std_time = (new Date($scope.time_ir_sta_time)).addMinutes(60);
                $scope.time_ir_sta_date = null;
                $scope.time_ir_sta_time = null;
                $scope.loadingVisible = false;
                $scope.freeSaved = true;



                //kakoli3
                if ($scope.linkEntity.ID != -1 && response.flight) {
                    var _ids = Enumerable.From(response.flights).Select('$.ID').ToArray();
                    var _flts = Enumerable.From($scope.ganttData.flights).Where(
                        function (x) {
                            return _ids.indexOf(x.ID) != -1;
                        }
                    ).ToArray();
                    $.each(_flts, function (_z, _f) {
                        var resFlt = Enumerable.From(response.flights).Where('$.ID==' + _f.ID).FirstOrDefault();
                        if (resFlt) {
                            for (var key of Object.keys(resFlt)) {


                                _f[key] = resFlt[key];

                            }
                            $scope.modifyFlightTimes(_f);
                            $scope.modifyGantt(_f, response.ressq[0]);
                        }
                    });

                }
                else {
                    $.each(response.flights, function (_z, _f) {
                        $scope.modifyFlightTimes(_f);
                        $scope.addToGantt(_f, response.ressq[0]);
                    });

                }

                if ($scope.linkEntity.ID != -1)
                    $scope.popup_free_visible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

    };
    $scope.saveFree___ = function () {
        //07-10

        //04-30
        var oldSTD = $scope.linkEntity.STD;

        var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
        var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
        var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);


        var sta_dates = (new Date($scope.time_ir_sta_date)).getDatePartArray();
        var sta_times = (new Date($scope.time_ir_sta_time)).getTimePartArray();
        var sta = new Date(sta_dates[0], sta_dates[1], sta_dates[2], sta_times[0], sta_times[1], 0, 0);

        var _flight = JSON.parse(JSON.stringify($scope.linkEntity));
        //9-8
        _flight.FlightStatusID = 1;

        _flight.STD = (new Date(std)).toUTCString();
        alert(_flight.STD);
        //9-8
        _flight.STDHH = (new Date(std)).getHours();
        _flight.STDMM = (new Date(std)).getMinutes();

        _flight.STA = (new Date(sta)).toUTCString();
        _flight.SMSNira = $scope.sms_nira_nsf ? 1 : 0;
        _flight.UserName = $rootScope.userName;

        //divargar-ok3
        var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
        var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
        var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
        var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);

        //07-10
        _flight.Days = $scope.interval_days;
        var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
        var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
        _flight.RefDate = (new Date(ref)).toUTCString();
        _flight.RefDays = $scope.days_count;

        var _zoffset = (new Date($scope.time_ir_std_date)).getTimezoneOffset();

        //var stdOffset = (new Date(std)).addMinutes(_zoffset);
        var stdOffset = (new Date(oldSTD)).addMinutes(_zoffset);
        //05-11
        if (stdOffset.getDate() != std.getDate()) {

            intervalFrom = (new Date(intervalFrom)).addDays(-1);
            intervalTo = (new Date(intervalTo)).addDays(-1);
            _flight.Days = [];
            $.each($scope.interval_days, function (_q, _y) {
                var _nd = _y - 1;
                if (_nd == -1)
                    _nd = 6;
                _flight.Days.push(_nd);

            });
            _flight.RefDate = (new Date(ref)).addDays(-1).toUTCString();
        }


        _flight.IntervalFrom = (new Date(intervalFrom)).toUTCString();
        _flight.IntervalTo = (new Date(intervalTo)).toUTCString();
        _flight.Interval = 2;
        //_flight.Days = $scope.interval_days;

        //07-10
        //var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
        //var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
        //_flight.RefDate = (new Date(ref)).toUTCString();
        // _flight.RefDays = $scope.days_count;

        //magu2-16
        _flight.DepartureRemark = $scope.dep_remark_edit;



        $scope.loadingVisible = true;
        if (!$scope.IsComm) {
            flightService.saveFlight(_flight).then(function (response) {




                General.ShowNotify(Config.Text_SavedOk, 'success');

                $scope.linkEntity.FlightNumber = null;
                $scope.linkEntity.FromAirportId = $scope.linkEntity.ToAirportId;
                $scope.linkEntity.ToAirportId = null;
                $scope.linkEntity.FlightH = null;
                $scope.linkEntity.FlightM = null;

                $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.time_ir_sta_date));
                $scope.time_ir_std_time = (new Date($scope.time_ir_sta_time)).addMinutes(60);
                $scope.time_ir_sta_date = null;
                $scope.time_ir_sta_time = null;
                $scope.loadingVisible = false;
                $scope.freeSaved = true;




                if ($scope.linkEntity.ID != -1) {
                    for (var key of Object.keys(response.flight)) {


                        $scope.ati_flight[key] = response.flight[key];

                    }
                    $scope.modifyFlightTimes($scope.ati_flight);
                    $scope.modifyGantt($scope.ati_flight, response.ressq[0]);
                }
                else {
                    $scope.modifyFlightTimes(response.flight);
                    $scope.addToGantt(response.flight, response.ressq[0]);
                }

                if ($scope.linkEntity.ID != -1)
                    $scope.popup_free_visible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else {
            if ($scope.linkEntity.ID == -1)
                _flight.CheckTime = 0;
            else
                _flight.CheckTime = $scope.interval_checktime ? 1 : 0;
            flightService.saveFlightGroup(_flight).then(function (response) {




                General.ShowNotify(Config.Text_SavedOk, 'success');

                $scope.linkEntity.FlightNumber = null;
                $scope.linkEntity.FromAirportId = $scope.linkEntity.ToAirportId;
                $scope.linkEntity.ToAirportId = null;
                $scope.linkEntity.FlightH = null;
                $scope.linkEntity.FlightM = null;

                $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.time_ir_sta_date));
                $scope.time_ir_std_time = (new Date($scope.time_ir_sta_time)).addMinutes(60);
                $scope.time_ir_sta_date = null;
                $scope.time_ir_sta_time = null;
                $scope.loadingVisible = false;
                $scope.freeSaved = true;



                //kakoli3
                if ($scope.linkEntity.ID != -1 && response.flight) {
                    var _ids = Enumerable.From(response.flights).Select('$.ID').ToArray();
                    var _flts = Enumerable.From($scope.ganttData.flights).Where(
                        function (x) {
                            return _ids.indexOf(x.ID) != -1;
                        }
                    ).ToArray();
                    $.each(_flts, function (_z, _f) {
                        var resFlt = Enumerable.From(response.flights).Where('$.ID==' + _f.ID).FirstOrDefault();
                        if (resFlt) {
                            for (var key of Object.keys(resFlt)) {


                                _f[key] = resFlt[key];

                            }
                            $scope.modifyFlightTimes(_f);
                            $scope.modifyGantt(_f, response.ressq[0]);
                        }
                    });

                }
                else {
                    $.each(response.flights, function (_z, _f) {
                        $scope.modifyFlightTimes(_f);
                        $scope.addToGantt(_f, response.ressq[0]);
                    });

                }

                if ($scope.linkEntity.ID != -1)
                    $scope.popup_free_visible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

    };
    $scope.popup_free_visible = false;
    $scope.popup_free_title = 'Flight';
    $scope.freeSaved = false;
    //05-17
    $scope.popup_free_height = $scope.IsComm ? 840 : 660;
    $scope.popup_free = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_free"
        },
        shading: true,
        position: { my: 'right', at: 'right', of: window, offset: '-15 0' },
        //divargar-ok

        width: 490,
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
                        if ($scope.sms_nira_nsf)
                            $scope.saveFree();
                        else {
                            General.Confirm('"NOTIFY NIRA" is not checked. Are sure?', function (res) {
                                if (res) {

                                    $scope.saveFree();
                                }
                            });
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
            $scope.sms_nira_nsf = true;
            $scope.interval_checktime = true;
        },
        onHiding: function () {

            // if ($scope.freeSaved)
            //    $scope.BeginSearch();
            $scope.freeSaved = false;
            $scope.sms_nira_nsf = true;
            $scope.linkEntity.ToAirportId = null;
            $scope.linkEntity.FromAirportId = null;
            $scope.time_ir_std_date = null;
            $scope.time_ir_std_time = null;
            $scope.time_ir_sta_date = null;
            $scope.time_ir_sta_time = null;
            //05-17
            $scope.linkEntity.ChrCode = null;
            $scope.sb_fchr_ins.reset();
            $scope.linkEntity = null;
            $scope.popup_free_visible = false;

        },
        bindingOptions: {
            visible: 'popup_free_visible',
            height: 'popup_free_height',
            title: 'popup_free_title',

        }
    };

    //close button
    $scope.popup_free.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_free_visible = false;

    };

    $scope.sb_fchr_ins = null;
    $scope.sb_fchr = {
        showClearButton: true,
        searchEnabled: true,
        onInitialized: function (e) {
            $scope.sb_fchr_ins = e.component;
        },
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title1",
        valueExpr: 'Code',
        searchExpr: ["Title1", "Title2", "Code", "NiraCode"],
        valueChangeEvent: 'keyup',
        onSelectionChanged: function (e) {
            $scope.linkEntity.ChrTitle = null;
            if (e.selectedItem) {
                $scope.linkEntity.ChrTitle = e.selectedItem.Title1;

            }
            else {
                $scope.linkEntity.ChrTitle = null;
            }
        },
        bindingOptions: {
            dataSource: 'mchr_ds',
            value: 'linkEntity.ChrCode',



        }
    };

    ///////////////////////////////////////

    //dlusabz
    $scope.shift_hh = 0;
    $scope.shift_mm = 0;
    $scope.num_shift_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'shift_hh',

        }
    };
    $scope.num_shift_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'shift_mm',

        }
    };
    $scope.shift_forward = 'Forward(+)';
    $scope.sb_forward = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: ['Forward(+)', 'Backward(-)'],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'shift_forward',


        }
    };
    $scope.sms_nira_shift = true;
    $scope.check_sms_nira_shift = {
        width: '100%',
        text: "Notify NIRA",

        bindingOptions: {
            value: 'sms_nira_shift',
        }
    };
    $scope.popup_shift_visible = false;
    $scope.popup_shift_title = 'Shift STD';

    $scope.popup_shift = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_shift"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 330,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbshift', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //  $scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
                        var dto = {
                            ids: Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray(),
                            hour: $scope.shift_hh,
                            minute: $scope.shift_mm,
                            userName: $rootScope.userName,
                            nira: $scope.sms_nira_shift ? 1 : 0,
                            sign: $scope.shift_forward == 'Forward(+)' ? 1 : -1,
                        };
                        $scope.loadingVisible = true;
                        flightService.shiftFlight(dto).then(function (response) {
                            //dlurahm
                            //$scope.lastSTD =new Date( $scope.planEntity.STD);
                            //$scope.lastScroll=($('.e-ganttviewerbodyContianer').data("ejScroller").scrollLeft());

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;

                            $scope.sms_nira_shift = true;

                            //$scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
                            //$scope.ati_resid=$scope.ati_flight.RegisterID;
                            $.each(response.flights, function (_i, _flt) {
                                var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                var oldResId = aflt.RegisterID;
                                for (var key of Object.keys(_flt)) {


                                    aflt[key] = _flt[key];
                                    // console.log(key+'    '+response[key]+'     '+$scope.ati_flight[key]);
                                }
                                $scope.modifyFlightTimes(aflt);
                                //pants
                                var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                $scope.modifyGantt(aflt, _ressq, oldResId);
                            });
                            ///////////////////////////////////


                            $scope.popup_shift_visible = false;



                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {

            $scope.sms_nira_shift = true;
        },
        onHiding: function () {


            $scope.popup_shift_visible = false;

        },
        bindingOptions: {
            visible: 'popup_shift_visible',

            title: 'popup_shift_title',

        }
    };

    //close button
    $scope.popup_shift.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_shift_visible = false;

    };
    /////////////////////////////////////
    $scope.cnl_remark = "";
    $scope.txt_cnl_remark = {
        height: 100,
        bindingOptions: {
            value: 'cnl_remark',

        }
    };
    $scope.cnl_reason = null;
    $scope.sb_cnl_reason = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cnl_reason',

        }
    };
    $scope.popup_cnl_visible = false;
    $scope.popup_cnl_title = 'Cancel Flight(s)';
    //magu2-16
    $scope.dep_remark_edit = null;
    $scope.remark_dep_edit = {
        bindingOptions: {
            value: 'dep_remark_edit',
            height: '50',
        }
    };
    $scope.popup_cnl = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cnl"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbcnl', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //07-10
                        var _utcFlights = [];
                        var _nflights = [];
                        $.each($scope.ati_selectedFlights, function (_q, _w) {
                            var _zoffset = (new Date(_w.STD)).getTimezoneOffset();
                            var _b1 = (new Date(_w.STD)).getDate();
                            var _b2 = (new Date(_w.STD)).addMinutes(_zoffset).getDate();


                            if (_b1 == _b2)
                                _nflights.push(_w);
                            else
                                _utcFlights.push(_w);

                        });

                        var allflights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var flights = Enumerable.From(_nflights).Select('$.ID').ToArray();
                        var utcflights = Enumerable.From(_utcFlights).Select('$.ID').ToArray();


                        var entity = {


                            userId: $rootScope.userId,
                            userName: $rootScope.userName,
                            reason: $scope.cnl_reason,

                            fids: allflights,// $scope.IsComm ? flights : allflights,
                            //2020-11-24
                            remark: $scope.cnl_remark,


                        };

                        var uentity = {


                            userId: $rootScope.userId,
                            userName: $rootScope.userName,
                            reason: $scope.cnl_reason,

                            fids: utcflights,
                            //2020-11-24
                            remark: $scope.cnl_remark,


                        };

                        if (_utcFlights && _utcFlights.length > 0) {
                        }

                        if ($scope.IsComm) {
                            var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
                            var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
                            entity.intervalFrom = (new Date(intervalFrom)).toUTCString();

                            entity.intervalTo = (new Date(intervalTo)).toUTCString();
                            entity.interval = 2;
                            entity.days = $scope.interval_days;
                            var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
                            var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
                            entity.RefDate = (new Date(ref)).toUTCString();
                            entity.RefDays = $scope.days_count;
                            ///////////////////////////////

                            var uinterval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var uintervalFrom = new Date(uinterval_from_dates[0], uinterval_from_dates[1], uinterval_from_dates[2], 12, 0, 0, 0);
                            var uinterval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var uintervalTo = new Date(uinterval_to_dates[0], uinterval_to_dates[1], uinterval_to_dates[2], 12, 0, 0, 0);
                            uentity.intervalFrom = (new Date(uintervalFrom)).addDays(-1).toUTCString();
                            uentity.intervalTo = (new Date(uintervalTo)).addDays(-1).toUTCString();
                            uentity.interval = 2;
                            uentity.days = [];
                            $.each($scope.interval_days, function (_q, _y) {
                                var _nd = _y - 1;
                                if (_nd == -1)
                                    _nd = 6;
                                uentity.days.push(_nd);

                            });
                            var uref_dates = (new Date($scope._datefrom)).addDays(-1).getDatePartArray();
                            var uref = new Date(uref_dates[0], uref_dates[1], uref_dates[2], 12, 0, 0, 0);
                            uentity.RefDate = (new Date(uref)).toUTCString();
                            uentity.RefDays = $scope.days_count;
                            //////////////////////////////////

                            $scope.loadingVisible = true;
                            flightService.cancelFlightsGroup(entity).then(function (response) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    if (aflt) {
                                        var oldResId = aflt.RegisterID;
                                        for (var key of Object.keys(_flt)) {


                                            aflt[key] = _flt[key];

                                        }
                                        $scope.modifyFlightTimes(aflt);

                                        var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                        $scope.modifyGantt(aflt, _ressq, oldResId);
                                    }

                                });
                                if (_utcFlights.length > 1) {

                                    $scope.loadingVisible = true;
                                    flightService.cancelFlightsGroup(uentity).then(function (response) {

                                        $scope.loadingVisible = false;
                                        $.each(response.flights, function (_i, _flt) {
                                            var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                            if (aflt) {
                                                var oldResId = aflt.RegisterID;
                                                for (var key of Object.keys(_flt)) {


                                                    aflt[key] = _flt[key];

                                                }
                                                $scope.modifyFlightTimes(aflt);

                                                var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                                $scope.modifyGantt(aflt, _ressq, oldResId);
                                            }

                                        });

                                        $scope.popup_cnl_visible = false;

                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                }
                                else
                                    $scope.popup_cnl_visible = false;

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else {
                            $scope.loadingVisible = true;
                            flightService.cancelFlights(entity).then(function (response) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    var oldResId = aflt.RegisterID;
                                    for (var key of Object.keys(_flt)) {


                                        aflt[key] = _flt[key];

                                    }
                                    $scope.modifyFlightTimes(aflt);

                                    var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                    $scope.modifyGantt(aflt, _ressq, oldResId);
                                });

                                $scope.popup_cnl_visible = false;

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }



                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_cnl_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cnl_visible',
            height: 'cregHeight',
            title: 'popup_cnl_title',

        }
    };

    //close button
    $scope.popup_cnl.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_cnl_visible = false;

    };
    ////////////////////////////////////////
    $scope.creg_msn = null;
    $scope.sb_creg_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $scope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Register', 'MSN'],
        //2020-11-16
        //dataSource: $scope.getRealMSNs(Config.CustomerId),
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'creg_msn',
            //2020-11-16
            dataSource: 'realMSNs',

        }
    };
    $scope.creg_remark = "";
    $scope.txt_creg_remark = {
        height: 100,
        bindingOptions: {
            value: 'creg_remark',

        }
    };
    $scope.popup_creg_visible = false;
    $scope.popup_creg_title = 'Chenge Register';
    //magu2-16

    $scope.cregHeight = $scope.IsComm ? 540 : 400;
    $scope.popup_creg = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_creg"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbcreg', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //07-10
                        var _utcFlights = [];
                        var _nflights = [];
                        $.each($scope.ati_selectedFlights, function (_q, _w) {
                            var _zoffset = (new Date(_w.STD)).getTimezoneOffset();
                            var _b1 = (new Date(_w.STD)).getDate();
                            var _b2 = (new Date(_w.STD)).addMinutes(_zoffset).getDate();


                            if (_b1 == _b2)
                                _nflights.push(_w);
                            else
                                _utcFlights.push(_w);

                        });

                        var allflights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var flights = Enumerable.From(_nflights).Select('$.ID').ToArray();

                        //9-15

                        var allflightsRegs = Enumerable.From($scope.ati_selectedFlights).Select(function (x) { return x.FlightNumber + '_' + x.Register; }).ToArray().join('*');
                        var flightsRegs = Enumerable.From(_nflights).Select(function (x) { return x.FlightNumber + '_' + x.Register; }).ToArray().join('*');
                        var allflightsRegsId = Enumerable.From($scope.ati_selectedFlights).Select(function (x) { return x.ID + '_' + x.Register; }).ToArray().join('*');
                        var flightsRegsId = Enumerable.From(_nflights).Select(function (x) { return x.ID + '_' + x.Register; }).ToArray().join('*');


                        var utcflights = Enumerable.From(_utcFlights).Select('$.ID').ToArray();

                        // console.log('utc', utcflights);
                        // console.log('normal', flights);

                        //var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var entity = {

                            NewRegisterId: $scope.creg_msn,
                            UserId: $rootScope.userId,
                            UserName: $rootScope.userName,
                            ReasonId: -1,
                            Remark: $scope.creg_remark,
                            Flights: $scope.IsComm ? flights : allflights,
                            From: (new Date()).toUTCDateTimeDigits(),
                            To: (new Date()).toUTCDateTimeDigits(),
                            //2020-11-24

                        };
                        var uentity = {


                            NewRegisterId: $scope.creg_msn,
                            UserId: $rootScope.userId,
                            UserName: $rootScope.userName,
                            ReasonId: -1,
                            Remark: $scope.creg_remark,
                            Flights: utcflights,
                            From: (new Date()).toUTCDateTimeDigits(),
                            To: (new Date()).toUTCDateTimeDigits(),


                        };
                        if ($scope.IsComm) {
                            var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
                            var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
                            entity.intervalFrom = (new Date(intervalFrom)).toUTCString();
                            entity.intervalTo = (new Date(intervalTo)).toUTCString();
                            entity.interval = 2;
                            entity.days = $scope.interval_days;
                            var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
                            var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
                            entity.RefDate = (new Date(ref)).toUTCString();
                            entity.RefDays = $scope.days_count;
                            ///////////////////////////////

                            var uinterval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                            var uintervalFrom = new Date(uinterval_from_dates[0], uinterval_from_dates[1], uinterval_from_dates[2], 12, 0, 0, 0);
                            var uinterval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                            var uintervalTo = new Date(uinterval_to_dates[0], uinterval_to_dates[1], uinterval_to_dates[2], 12, 0, 0, 0);
                            uentity.intervalFrom = (new Date(uintervalFrom)).addDays(-1).toUTCString();
                            uentity.intervalTo = (new Date(uintervalTo)).addDays(-1).toUTCString();
                            uentity.interval = 2;
                            uentity.days = [];
                            $.each($scope.interval_days, function (_q, _y) {
                                var _nd = _y - 1;
                                if (_nd == -1)
                                    _nd = 6;
                                uentity.days.push(_nd);

                            });
                            var uref_dates = (new Date($scope._datefrom)).addDays(-1).getDatePartArray();
                            var uref = new Date(uref_dates[0], uref_dates[1], uref_dates[2], 12, 0, 0, 0);
                            uentity.RefDate = (new Date(uref)).toUTCString();
                            uentity.RefDays = $scope.days_count;
                            //////////////////////////////////

                            $scope.loadingVisible = true;
                            flightService.saveFlightRegisterChangeGroup(entity).then(function (response) {
                                //qeshm 2022-01-18

                                var _grps = response.fltgroups;

                                $.each($scope.ganttData.resources, function (_i, _d) {
                                    _d.fdps = [];
                                    _d.fdps = Enumerable.From(_grps).Where('$.RegisterId==' + _d.resourceId).ToArray();
                                });

                                $scope.clearSelectionX();


                                var notifyObj = JSON.parse(JSON.stringify(entity));
                                notifyObj.Remark = $scope.IsComm ? flightsRegs : allflightsRegs;

                                //$http.post($rootScope.serviceUrl + 'odata/flight/register/change/notify', notifyObj);

                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    if (aflt) {
                                        var oldResId = aflt.RegisterID;
                                        for (var key of Object.keys(_flt)) {


                                            aflt[key] = _flt[key];

                                        }
                                        $scope.modifyFlightTimes(aflt);

                                        var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                        $scope.modifyGantt(aflt, _ressq, oldResId);
                                    }

                                });

                                if (_utcFlights.length >= 1) {

                                    $scope.loadingVisible = true;
                                    flightService.saveFlightRegisterChangeGroup(uentity).then(function (response) {

                                        $scope.loadingVisible = false;
                                        $.each(response.flights, function (_i, _flt) {
                                            var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                            if (aflt) {
                                                var oldResId = aflt.RegisterID;
                                                for (var key of Object.keys(_flt)) {


                                                    aflt[key] = _flt[key];

                                                }
                                                $scope.modifyFlightTimes(aflt);

                                                var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                                $scope.modifyGantt(aflt, _ressq, oldResId);
                                            }

                                        });

                                        $scope.popup_creg_visible = false;

                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                }
                                else
                                    $scope.popup_creg_visible = false;

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else {
                            $scope.loadingVisible = true;
                            flightService.saveFlightRegisterChange2(entity).then(function (response) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');

                                //9-15
                                var notifyObj = JSON.parse(JSON.stringify(entity));
                                notifyObj.Remark = $scope.IsComm ? flightsRegsId : allflightsRegsId;

                                $http.post($rootScope.serviceUrl + 'odata/flight/register/change/notify', notifyObj);


                                $scope.loadingVisible = false;
                                $.each(response.flights, function (_i, _flt) {
                                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                                    var oldResId = aflt.RegisterID;
                                    for (var key of Object.keys(_flt)) {


                                        aflt[key] = _flt[key];

                                    }
                                    $scope.modifyFlightTimes(aflt);

                                    var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                                    $scope.modifyGantt(aflt, _ressq, oldResId);
                                });

                                $scope.popup_creg_visible = false;

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }



                        /////////////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_creg_visible = false;

        },
        bindingOptions: {
            visible: 'popup_creg_visible',
            height: 'cregHeight',
            title: 'popup_creg_title',

        }
    };

    //close button
    $scope.popup_creg.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_creg_visible = false;

    };

    //////////////////////////////////////
    $scope.rosterSelectedFlights = [];
    $scope.rosterFlightClick = function (flt) {
        //  alert(flt.CrewId + ' ' + flt.FlightId);
        //rf-{{row.data.CrewId}}-{{x.FlightId}}
        var id = 'rf-' + flt.CrewId + '-' + flt.FlightId;
        var $tile = $('#' + id);
        // $tile.toggleClass("rfgray");
        if ($tile.hasClass('rfgray')) {
            $tile.removeClass('rfgray');
            $scope.rosterSelectedFlights = Enumerable.From($scope.rosterSelectedFlights).Where(function (x) {
                var key = x.CrewId + '-' + x.FlightId;
                return key != (flt.CrewId + '-' + flt.FlightId);
            }).ToArray();
        }
        else {
            $tile.addClass('rfgray');
            $scope.rosterSelectedFlights.push(JSON.parse(JSON.stringify(flt)));
        }


    };
    $scope.rosterOff = function (crew) {
        var flights = Enumerable.From($scope.rosterSelectedFlights).Where('$.CrewId==' + crew.CrewId).ToArray();
        if (!flights || flights.length == 0)
            return;
        var fs = [];
        var fis = [];
        $.each(flights, function (_i, _d) {
            fs.push(_d.FDPId);
            fis.push(_d.FDPItemId);
        });
        var strFdp = fs.join('*');
        var strItems = fis.join('*');
        var dto = {
            fdps: strFdp,
            items: strItems
        };
        $scope.loadingVisible = true;

        flightService.fdpsOff(dto).then(function (response) {
            $scope.loadingVisible = false;

            $scope.rosterSelectedFlights = Enumerable.From($scope.rosterSelectedFlights).Where(function (x) {
                return fis.indexOf(x.FDPItemId) == -1;
            }).ToArray();

            var dgcrew = Enumerable.From($scope.dg_roster_ds).Where('$.CrewId==' + crew.CrewId).FirstOrDefault();
            dgcrew.flights = Enumerable.From(dgcrew.flights).Where(function (x) {
                return fis.indexOf(x.FDPItemId) == -1;
            }).ToArray();
            $scope.dg_roster_instance.refresh();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    }
    $scope.rosterReplace = function (crew) {

    }
    $scope.rosterRefuse = function (crew) {

    }
    //selectCode
    //goh3
    $scope.selectCode = function (code) {
        var code = Enumerable.From($scope.delayCodes).Where('$.Id==' + code.Id).FirstOrDefault();


        $scope.delayCodeId = code.Id;

        $scope.popup_codes_visible = false;
    }
    //////////////////////////////////////
    $scope.dg_roster_columns = [


        // { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
        // { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
        // { dataField: 'ScName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
        { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

        {
            dataField: "CrewId", caption: 'Flights',
            alignment: 'left',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'rosterFlightTemplate',

        },

        {
            dataField: "CrewId", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'rosterOffTemplate',
            width: 300,

        },
        //{
        //    dataField: "CrewId", caption: '',
        //    alignment: 'center',
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: 'rosterReplaceTemplate',
        //    width: 100,

        //},
        // {
        //     dataField: "CrewId", caption: '',
        //     alignment: 'center',
        //     allowFiltering: false,
        //     allowSorting: false,
        //     cellTemplate: 'rosterRefuseTemplate',
        //     width: 100,

        // },




    ];
    $scope.dg_roster_selected = null;
    $scope.dg_roster_instance = null;
    $scope.dg_roster_ds = null;
    $scope.dg_roster = {
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
        height: $(window).height() - 150,

        columns: $scope.dg_roster_columns,
        onContentReady: function (e) {
            if (!$scope.dg_roster_instance)
                $scope.dg_roster_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_roster_selected = null;

            }
            else {
                $scope.dg_roster_selected = data;

            }
        },
        //onRowPrepared: function (e) {
        //    if (e.data && e.data.IsPositioning)
        //        e.rowElement.css('background', '#ffccff');

        //},

        bindingOptions: {
            dataSource: 'dg_roster_ds',

        }
    };
    //////////////////////////////////////
    //goh2
    $scope.dg_codes_columns = [

        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

        {
            dataField: "Id", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'codeSelectTemplate',
            width: 100,

        },





    ];
    $scope.dg_codes_selected = null;
    $scope.dg_codes_instance = null;
    $scope.dg_codes_ds = null;
    $scope.dg_codes = {
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
        height: 670,

        columns: $scope.dg_codes_columns,
        onContentReady: function (e) {
            if (!$scope.dg_codes_instance)
                $scope.dg_codes_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope._delayItem = null;

            //}
            //else {
            //    $scope._delayItem = data;

            //}
        },


        bindingOptions: {
            dataSource: 'delayCodes',
            //selectedItem: '_delayItem',

        }
    };
    //////////////////////////////////////
    $scope.formatTime = function (dt) {
        return moment(dt).format('HHmm');
    };
    $scope.bindRoster = function () {

        var dt = new Date($scope.selectedDate);

        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;
        //flightService.roster($scope.output,_df,_dt).then(function (response) {
        flightService.getCrewsFlights(_dt).then(function (response) {
            $scope.loadingVisible = false;

            $scope.dg_roster_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////////
    $scope.popup_roster_visible = false;
    $scope.popup_roster_title = 'Roster';

    $scope.popup_roster = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_roster"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (arg) {



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_roster_visible = false;

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
            $scope.bindRoster();
        },
        onHiding: function () {


            $scope.popup_roster_visible = false;

        },
        bindingOptions: {
            visible: 'popup_roster_visible',

            title: 'popup_roster_title',

        }
    };
    ////////////////////////////////////////
    $scope.popup_codes_visible = false;
    $scope.popup_codes_title = 'Delay Codes';

    $scope.popup_codes = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_codes"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_codes_visible = false;

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
            $scope.bindRoster();
        },
        onHiding: function () {


            $scope.popup_codes_visible = false;

        },
        bindingOptions: {
            visible: 'popup_codes_visible',

            title: 'popup_codes_title',

        }
    };
    ////////////////////////////////////////

    $scope.dg_msf_columns = [

        // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 70, format: 'MM-dd', sortIndex: 0, sortOrder: "asc" },

        //{ dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },

        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65, fixed: false, fixedPosition: 'left' },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 78, format: 'HH:mm', sortIndex: 1, sortOrder: "asc" },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 78, format: 'HH:mm' },

        // { dataField: 'Duration', caption: 'DUR', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: "asc" },

    ];
    $scope.dg_msf_selected = null;
    $scope.dg_msf_instance = null;

    $scope.dg_msf = {
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
        height: 322,

        columns: $scope.dg_msf_columns,
        onContentReady: function (e) {
            if (!$scope.dg_msf_instance)
                $scope.dg_msf_instance = e.component;

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
                $scope.dg_msf_selected = null;
            }
            else
                $scope.dg_msf_selected = data;


        },


        bindingOptions: {
            dataSource: 'multiSelectedFlights'
        }
    };
    //////////////////////////////
    $scope.dg_columns3 = [


        { dataField: 'Title', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Value', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },



    ];
    $scope.dg3_selected = null;
    $scope.dg3_instance = null;
    $scope.dg3_ds = null;
    $scope.dg3 = {
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
        height: 300,

        columns: $scope.dg_columns3,
        onContentReady: function (e) {
            if (!$scope.dg3_instance)
                $scope.dg3_instance = e.component;

        },
        onRowPrepared: function (e) {
            //if (e.rowType === "data") {
            //    var day = (new Date(e.data.STDDay)).getDay();
            //    e.rowElement.css("backgroundColor", $scope.palete[day]);
            //}
            //42 %  10

        },
        showColumnHeaders: false,
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg3_selected = null;
            }
            else
                $scope.dg32_selected = data;


        },
        onCellPrepared: function (e) {
            //lightgray
            if (e.rowType === "data" && e.column.dataField == "Title")
                e.cellElement.css("backgroundColor", "lightgray");
            if (e.rowType === "data" && e.column.dataField == "Value" && e.data.Title == 'FDP' && $scope.STBYFDPStat.IsOver)
                e.cellElement.css("backgroundColor", "#ffcccc");

        },

        bindingOptions: {
            dataSource: 'dg3_ds'
        }
    };
    ///////////////////////////////////
    $scope.dg_crew_stby_columns = [

        { dataField: 'JobGroup', caption: 'RNK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'LastLocation', caption: 'Apt', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },

        {
            dataField: "Id", caption: '',
            width: 90,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'activeSTBYTemplate',

        },
        // {
        //     dataField: "Id", caption: '',
        //     width: 70,
        //     allowFiltering: false,
        //     allowSorting: false,
        //     cellTemplate: 'addStbyPMTemplate',

        // },

    ];
    $scope.dg_crew_stby_selected = null;

    $scope.dg_crew_stby_instance = null;
    $scope.dg_crew_stby_ds = null;
    $scope.fillStbyDs = function () {
        var aids = Enumerable.From($scope.activatedStbys).Select('$.CrewId').ToArray();

        $scope.dg_crew_stby_ds = Enumerable.From($scope.crew_stby_ds).Where(function (x) { return aids.indexOf(x.CrewId) == -1; }).ToArray();

    };
    $scope.crew_stby_ds = null;
    $scope.dg_crew_stby = {
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
        height: 655,

        columns: $scope.dg_crew_stby_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_stby_instance)
                $scope.dg_crew_stby_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            //$scope.IsStbyAMVisible = false;
            //$scope.IsStbyPMVisible = false;
            //if (!data) {
            //    $scope.dg_crew_stby_selected = null;
            //    $scope.rowCrew = null;
            //    $scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
            //    $scope.outputTemps = [];
            //    $scope.crewTempFDPs = [];
            //}
            //else {
            //    $scope.dg_crew_stby_selected = data;
            //    $scope.rowCrew = data;

            //    $scope.getTempDutiesSTBY();
            //}


        },



        bindingOptions: {
            dataSource: 'dg_crew_stby_ds'
        }
    };
    /////////////////////////////
    $scope.getDefaultPositionId = function (pos) {

        switch (pos) {
            case 'IP':
            case 'IP1':
            case 'IP2':
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
                return 1162;
            case 'ISCCM':
            case 'ISCCM1':
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
                return 1153;
            case 'CHECK':
            case 'CHECK1':
            case 'CHECK2':
                return 1154;
            default:
                return pos;
        }
    };
    $scope.activatedStbys = null;
    $scope.removeActivatedStby = function (stby) {


        var dto = { fdpId: stby.fdpId };
        $scope.loadingVisible = true;

        flightService.deleteActivateStby(dto).then(function (response) {
            $scope.loadingVisible = false;

            $scope.activatedStbys = Enumerable.From($scope.activatedStbys).Where('$.fdpId!=' + stby.fdpId).ToArray();
            $scope.fillStbyDs();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        ////////////////
    };
    $scope.activeStby = function (row) {
        var crew = row.data;
        //FDPId
        var flts = Enumerable.From($scope.multiSelectedFlights).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
        var fltIds = Enumerable.From(flts).Select('$.ID').ToArray();
        var fltIdsStr = fltIds.join('*');



        $scope.loadingVisible = true;
        flightService.checkStbyActivation(($scope.STBYFDPStat.Extended > 0 ? 1 : 0), crew.FDPId, flts[0].ID, $scope.STBYFDPStat.Duty, $scope.STBYFDPStat.MaxFDPExtended).then(function (response) {
            $scope.loadingVisible = false;

            if (response.maxFDPError) {
                General.ShowNotify('ERROR MAX FDP DUE TO STBY REDUCTION', 'error');
                return;
            }
            if (response.durationError) {
                General.ShowNotify('ERROR TOTAL DURATION 18 HOURS', 'error');
                return;
            }


            var dto = {
                crewId: crew.CrewId,
                stbyId: crew.FDPId,
                fids: fltIdsStr,
                rank: $scope.getDefaultPositionId(crew.JobGroup),
            };
            $scope.loadingVisible = true;

            flightService.activateStby(dto).then(function (response) {
                $scope.loadingVisible = false;

                var fdpId = response.Id; //$scope.activatedStbys.length + 1;
                var record = { flights: [], fdpId: fdpId };
                record.CrewId = crew.CrewId;
                record.Name = crew.Name;
                record.ScheduleName = crew.ScheduleName;
                record.Position = crew.JobGroup;
                record.PositionId = $scope.getDefaultPositionId(crew.JobGroup);
                $.each(flts, function (_i, _d) {
                    record.flights.push(JSON.parse(JSON.stringify(_d)));

                });
                $scope.activatedStbys.push(record);
                $scope.fillStbyDs();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    ///////////////////////////////
    $scope.popup_stby_visible = false;
    $scope.popup_stby_title = 'StandBy / Reserve';

    $scope.popup_stby = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_stby"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1300,
        height: 800,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (arg) {



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_stby_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            $scope.dg_msf_instance.refresh();
            // $scope.bindRoster();
        },
        onHiding: function () {


            $scope.popup_stby_visible = false;

        },
        bindingOptions: {
            visible: 'popup_stby_visible',

            title: 'popup_stby_title',

        }
    };
    ////////////////////////////////////////
    $scope.popup_cargo_visible = false;
    $scope.popup_cargo_title = 'Cargo/Baggage';
    $scope.cargoSaved = false;
    $scope.cargoInit = {};
    $scope.popup_cargo = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cargo"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 400,
        //height: function () { return $(window).height() * 0.95 },
        height: 450,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaccargo', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {
                            ID: $scope.flight.ID,
                            CargoUnitID: $scope.flight.CargoUnitID,
                            CargoWeight: $scope.flight.CargoWeight,
                            CargoCount: $scope.flight.CargoCount,
                            BaggageWeight: $scope.flight.BaggageWeight,
                            BaggageCount: $scope.flight.BaggageCount,
                        };
                        $scope.loadingVisible = true;
                        flightService.saveFlightCargo(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.cargoSaved = true;
                            $scope.loadingVisible = false;

                            $scope.popup_cargo_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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

            $scope.cargoInit.CargoUnitID = $scope.flight.CargoUnitID;
            $scope.cargoInit.CargoWeight = $scope.flight.CargoWeight;
            $scope.cargoInit.CargoCount = $scope.flight.CargoCount;
            $scope.cargoInit.BaggageWeight = $scope.flight.BaggageWeight;
            $scope.cargoInit.BaggageCount = $scope.flight.BaggageCount;
        },
        onShown: function (e) {

        },
        onHiding: function () {
            if (!$scope.cargoSaved) {
                $scope.flight.CargoUnitID = $scope.cargoInit.CargoUnitID;
                $scope.flight.CargoWeight = $scope.cargoInit.CargoWeight;
                $scope.flight.CargoCount = $scope.cargoInit.CargoCount;
                $scope.flight.BaggageWeight = $scope.cargoInit.BaggageWeight;
                $scope.flight.BaggageCount = $scope.cargoInit.BaggageCount;
            }

            $scope.popup_cargo_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cargo_visible',

            title: 'popup_cargo_title',

        }
    };

    //close button
    $scope.popup_cargo.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_cargo_visible = false;

    };
    ///////////////////////////////

    //gohgoh
    //gohgoh
    $scope.fillDto = function (entity) {
        entity.ID = $scope.logFlight.ID;
        entity.UserId = $rootScope.userId;
        entity.UserName = $rootScope.userName;
        entity.FlightStatusID = $scope.logFlight.FlightStatusID;

        entity.Delays = [];
        var delays = Enumerable.From($scope.dg_delay_ds).ToArray();
        $.each(delays, function (_i, _d) {
            if (_d.Id == 97)
                $scope.logFlight.notes = 97;
            entity.Delays.push({
                FlightId: $scope.logFlight.ID,
                DelayCodeId: _d.DelayCodeId,
                HH: _d.HH,
                MM: _d.MM,
                Remark: _d.Remark,
                UserId: $rootScope.userId,
            });
        });

    };
    //5-13
    $scope.fillLog = function (entity) {
        if ($scope.timeBase == 'UTC')
            $scope.convertToLCL();
        //zooti
        var n = 0;
        if ($scope.logFlight.ID == 70888 || $scope.logFlight.ID == 70889)
            n = -60;
        if ($scope.logFlight.ChocksOut)
            entity.ChocksOut = ((new Date($scope.logFlight.ChocksOut)).addMinutes(n)).toUTCString();

        if ($scope.logFlight.Takeoff)
            entity.Takeoff = ((new Date($scope.logFlight.Takeoff)).addMinutes(n)).toUTCString();
        entity.DepartureRemark = $scope.logFlight.DepartureRemark;
        entity.GWTO = $scope.logFlight.GWTO;
        entity.FuelDeparture = $scope.logFlight.FuelDeparture;
        entity.PaxAdult = $scope.logFlight.PaxAdult;
        entity.PaxInfant = $scope.logFlight.PaxInfant;
        entity.PaxChild = $scope.logFlight.PaxChild;
        entity.CargoWeight = $scope.logFlight.CargoWeight;
        entity.CargoCost = $scope.logFlight.CargoCost;
        entity.CargoUnitID = $scope.logFlight.CargoUnitID;
        entity.BaggageCount = $scope.logFlight.BaggageCount;

        entity.CargoCount = $scope.logFlight.CargoCount;
        entity.FreeAWBWeight = $scope.logFlight.FreeAWBWeight;
        entity.FreeAWBCount = $scope.logFlight.FreeAWBCount;
        entity.BaggageWeight = $scope.logFlight.BaggageWeight;

        entity.NoShowCount = $scope.logFlight.NoShowCount;
        entity.NoShowPieces = $scope.logFlight.NoShowPieces;
        entity.NoGoCount = $scope.logFlight.NoGoCount;
        entity.NoGoPieces = $scope.logFlight.NoGoPieces;
        entity.DSBreakfast = $scope.logFlight.DSBreakfast;
        entity.DSWarmFood = $scope.logFlight.DSWarmFood;
        entity.DSColdFood = $scope.logFlight.DSColdFood;
        entity.DSRefreshment = $scope.logFlight.DSRefreshment;


        entity.FuelUnitID = $scope.logFlight.FuelUnitID;

        entity.FPFlightHH = $scope.logFlight.FPFlightHH;
        entity.FPFlightMM = $scope.logFlight.FPFlightMM;
        entity.FPFuel = $scope.logFlight.FPFuel;
        entity.Defuel = $scope.logFlight.Defuel;
        entity.UsedFuel = $scope.logFlight.UsedFuel;
        entity.JLBLHH = $scope.logFlight.JLBLHH;
        entity.JLBLMM = $scope.logFlight.JLBLMM;
        entity.PFLR = $scope.logFlight.PFLR;

        entity.Ready = toStringCustom($scope.logFlight.Ready);
        entity.Start = toStringCustom($scope.logFlight.Start);
        entity.YClass = $scope.logFlight.YClass;
        entity.CClass = $scope.logFlight.CClass;
        entity.TotalTrafficLoad = $scope.logFlight.TotalTrafficLoad;
        entity.PaxAdult50 = $scope.logFlight.PaxAdult50;
        entity.PaxChild50 = $scope.logFlight.PaxChild50;
        entity.PaxInfant50 = $scope.logFlight.PaxInfant50;
        entity.PaxAdult100 = $scope.logFlight.PaxAdult100;
        entity.PaxChild100 = $scope.logFlight.PaxChild100;
        entity.PaxInfant100 = $scope.logFlight.PaxInfant100;
        entity.PaxVIP = $scope.logFlight.PaxVIP;
        entity.PaxCIP = $scope.logFlight.PaxCIP;
        entity.PaxHUM = $scope.logFlight.PaxHUM;
        entity.PaxUM = $scope.logFlight.PaxUM;
        entity.PaxAVI = $scope.logFlight.PaxAVI;
        entity.PaxWCHR = $scope.logFlight.PaxWCHR;
        entity.PaxSTRC = $scope.logFlight.PaxSTRC;
        entity.FreeAWBPieces = $scope.logFlight.FreeAWBPieces;
        entity.CargoPieces = $scope.logFlight.CargoPieces;
        entity.PaxPIRLost = $scope.logFlight.PaxPIRLost;
        entity.PaxPIRDamage = $scope.logFlight.PaxPIRDamage;
        entity.PaxPIRFound = $scope.logFlight.PaxPIRFound;
        entity.CargoPIRLost = $scope.logFlight.CargoPIRLost;
        entity.CargoPIRDamage = $scope.logFlight.CargoPIRDamage;
        entity.CargoPIRFound = $scope.logFlight.CargoPIRFound;
        entity.LimitTag = $scope.logFlight.LimitTag;
        entity.RushTag = $scope.logFlight.RushTag;
        entity.CLCheckIn = toStringCustom($scope.logFlight.CLCheckIn);
        entity.CLPark = toStringCustom($scope.logFlight.CLPark);
        entity.CLAddTools = toStringCustom($scope.logFlight.CLAddTools);
        entity.CLBusReady = toStringCustom($scope.logFlight.CLBusReady);
        entity.CLPaxOut = toStringCustom($scope.logFlight.CLPaxOut);
        entity.CLDepoOut = toStringCustom($scope.logFlight.CLDepoOut);
        entity.CLServicePresence = toStringCustom($scope.logFlight.CLServicePresence);
        entity.CLCleaningStart = toStringCustom($scope.logFlight.CLCleaningStart);
        entity.CLTechReady = toStringCustom($scope.logFlight.CLTechReady);
        entity.CLBagSent = toStringCustom($scope.logFlight.CLBagSent);
        entity.CLCateringLoad = toStringCustom($scope.logFlight.CLCateringLoad);
        entity.CLFuelStart = toStringCustom($scope.logFlight.CLFuelStart);
        entity.CLFuelEnd = toStringCustom($scope.logFlight.CLFuelEnd);
        entity.CLCleaningEnd = toStringCustom($scope.logFlight.CLCleaningEnd);
        entity.CLBoardingStart = toStringCustom($scope.logFlight.CLBoardingStart);
        entity.CLBoardingEnd = toStringCustom($scope.logFlight.CLBoardingEnd);
        entity.CLLoadSheetStart = toStringCustom($scope.logFlight.CLLoadSheetStart);
        entity.CLGateClosed = toStringCustom($scope.logFlight.CLGateClosed);
        entity.CLTrafficCrew = toStringCustom($scope.logFlight.CLTrafficCrew);
        entity.CLLoadCrew = toStringCustom($scope.logFlight.CLLoadCrew);
        entity.CLForbiddenObj = toStringCustom($scope.logFlight.CLForbiddenObj);
        entity.CLLoadSheetSign = toStringCustom($scope.logFlight.CLLoadSheetSign);
        entity.CLLoadingEnd = toStringCustom($scope.logFlight.CLLoadingEnd);
        entity.CLDoorClosed = toStringCustom($scope.logFlight.CLDoorClosed);
        entity.CLEqDC = toStringCustom($scope.logFlight.CLEqDC);
        entity.CLMotorStart = toStringCustom($scope.logFlight.CLMotorStart);
        entity.CLMovingStart = toStringCustom($scope.logFlight.CLMovingStart);
        entity.CLACStart = toStringCustom($scope.logFlight.CLACStart);
        entity.CLACEnd = toStringCustom($scope.logFlight.CLACEnd);
        entity.CLGPUStart = toStringCustom($scope.logFlight.CLGPUStart);
        entity.CLGPUEnd = toStringCustom($scope.logFlight.CLGPUEnd);
        entity.CLDepStairs = $scope.logFlight.CLDepStairs;
        entity.CLDepGPU = $scope.logFlight.CLDepGPU;
        entity.CLDepCrewCar = $scope.logFlight.CLDepCrewCar;
        entity.CLDepCrewCarCount = $scope.logFlight.CLDepCrewCarCount;
        entity.CLDepCabinService = $scope.logFlight.CLDepCabinService;
        entity.CLDepCateringCar = $scope.logFlight.CLDepCateringCar;
        entity.CLDepPatientCar = $scope.logFlight.CLDepPatientCar;
        entity.CLDepPaxCar = $scope.logFlight.CLDepPaxCar;
        entity.CLDepPaxCarCount = $scope.logFlight.CLDepPaxCarCount;
        entity.CLDepPushback = $scope.logFlight.CLDepPushback;
        entity.CLDepWaterService = $scope.logFlight.CLDepWaterService;
        entity.CLDepAC = $scope.logFlight.CLDepAC;
        entity.CLDepDeIce = $scope.logFlight.CLDepDeIce;
        entity.CLDepEqRemark = $scope.logFlight.CLDepEqRemark;
        entity.CLArrStairs = $scope.logFlight.CLArrStairs;
        entity.CLArrGPU = $scope.logFlight.CLArrGPU;
        entity.CLArrCrewCar = $scope.logFlight.CLArrCrewCar;
        entity.CLArrCrewCarCount = $scope.logFlight.CLArrCrewCarCount;
        entity.CLArrCabinService = $scope.logFlight.CLArrCabinService;
        entity.CLArrPatientCar = $scope.logFlight.CLArrPatientCar;
        entity.CLArrPaxCar = $scope.logFlight.CLArrPaxCar;
        entity.CLArrPaxCarCount = $scope.logFlight.CLArrPaxCarCount;
        entity.CLArrToiletService = $scope.logFlight.CLArrToiletService;
        entity.CLArrEqRemark = $scope.logFlight.CLArrEqRemark;
        entity.WLCount = $scope.logFlight.WLCount;
        entity.WLCost = $scope.logFlight.WLCost;
        entity.ExBagWeight = $scope.logFlight.ExBagWeight;
        entity.ExBagCost = $scope.logFlight.ExBagCost;

        //landing
        if ($scope.logFlight.Landing)
            entity.Landing = ((new Date($scope.logFlight.Landing)).addMinutes(n)).toUTCString();
        if ($scope.logFlight.ChocksIn)
            entity.ChocksIn = ((new Date($scope.logFlight.ChocksIn)).addMinutes(n)).toUTCString();

        entity.BlockH = $scope.logFlight.BlockH;
        entity.BlockM = $scope.logFlight.BlockM;

        entity.GWLand = $scope.logFlight.GWLand;


        entity.FuelArrival = $scope.logFlight.FuelArrival;

        entity.ArrivalRemark = $scope.logFlight.ArrivalRemark;
        //$scope.flight.FlightStatusID == 9 || $scope.flight.FlightStatusID == 17 || $scope.flight.FlightStatusID == 4
        if ($scope.logFlight.FlightStatusID == 9) {
            $scope.logFlight.RampDate = ((new Date($scope.time_status_value)).addMinutes(n)).toUTCString();
            entity.RampDate = ((new Date($scope.time_status_value)).addMinutes(n)).toUTCString();
            entity.RampReasonId = $scope.logFlight.RampReasonId;
        }
        //aool
        // if ($scope.flight.FlightStatusID == 17) {
        if ($scope.logFlight.RedirectReasonId) {
            $scope.logFlight.RedirectDate = ((new Date($scope.time_redirect_value)).addMinutes(n)).toUTCString();
            entity.RedirectDate = ((new Date($scope.time_redirect_value)).addMinutes(n)).toUTCString();

            //$scope.flight.OToAirportId = $scope.flight.ToAirportId;
            $scope.logFlight.ToAirportId = $scope.entity_redirect.Airport.Id;
            $scope.logFlight.ToAirport = $scope.entity_redirect.Airport.Id;
            entity.ToAirportId = $scope.entity_redirect.Airport.Id;
            if (!$scope.logFlight.OToAirportIATA)
                $scope.logFlight.OToAirportIATA = $scope.logFlight.ToAirportIATA;
            $scope.logFlight.ToAirportIATA = $scope.entity_redirect.Airport.IATA;
            entity.RedirectReasonId = $scope.logFlight.RedirectReasonId;
            entity.RedirectRemark = $scope.logFlight.RedirectRemark;


        }
        if ($scope.logFlight.FlightStatusID == 4) {
            $scope.logFlight.CancelDate = ((new Date($scope.time_status_value)).addMinutes(n)).toUTCString();
            entity.CancelDate = ((new Date($scope.time_status_value)).addMinutes(n)).toUTCString();
            entity.CancelReasonId = $scope.logFlight.CancelReasonId;
        }

        entity.EstimatedDelays = [];
        //var estimatedDelaysFlights = Enumerable.From($scope.dataSource).Where('$.EstimatedDelayChanged && $.EstimatedDelayChanged==true && $.EstimatedDelay>0 && $.status==1 && $.startDate.getDatePart()==' + $scope.flight.startDate.getDatePart() + ' && $.startDate.getTime() > ' + $scope.flight.startDate.getTime() + '  && $.RegisterID==' + $scope.flight.RegisterID).OrderBy('$.startDate').ToArray();

        //$.each(estimatedDelaysFlights, function (_i, _d) {
        //    entity.EstimatedDelays.push({
        //        FlightId: _d.ID,
        //        Delay: Math.floor(_d.EstimatedDelay),
        //    });
        //});
    };
    $scope.fillDeparture = function (entity) {
        entity.ChocksOut = (new Date($scope.flight.ChocksOut)).toUTCString();
        if ($scope.flight.Takeoff)
            entity.Takeoff = (new Date($scope.flight.Takeoff)).toUTCString();
        entity.DepartureRemark = $scope.flight.DepartureRemark;
        entity.GWTO = $scope.flight.GWTO;
        entity.FuelDeparture = $scope.flight.FuelDeparture;
        entity.PaxAdult = $scope.flight.PaxAdult;
        entity.PaxInfant = $scope.flight.PaxInfant;
        entity.PaxChild = $scope.flight.PaxChild;
        entity.CargoWeight = $scope.flight.CargoWeight;
        entity.CargoCost = $scope.flight.CargoCost;
        entity.CargoUnitID = $scope.flight.CargoUnitID;
        entity.BaggageCount = $scope.flight.BaggageCount;

        entity.CargoCount = $scope.flight.CargoCount;
        entity.FreeAWBWeight = $scope.flight.FreeAWBWeight;
        entity.FreeAWBCount = $scope.flight.FreeAWBCount;
        entity.BaggageWeight = $scope.flight.BaggageWeight;
        entity.FuelUnitID = $scope.flight.FuelUnitID;

        entity.NoShowCount = $scope.flight.NoShowCount;
        entity.NoShowPieces = $scope.flight.NoShowPieces;
        entity.NoGoCount = $scope.flight.NoGoCount;
        entity.NoGoPieces = $scope.flight.NoGoPieces;
        entity.DSBreakfast = $scope.flight.DSBreakfast;
        entity.DSWarmFood = $scope.flight.DSWarmFood;
        entity.DSColdFood = $scope.flight.DSColdFood;
        entity.DSRefreshment = $scope.flight.DSRefreshment;

        entity.Ready = $scope.flight.Ready;
        entity.Start = $scope.flight.Start;
        entity.YClass = $scope.flight.YClass;
        entity.CClass = $scope.flight.CClass;
        entity.TotalTrafficLoad = $scope.flight.TotalTrafficLoad;
        entity.PaxAdult50 = $scope.flight.PaxAdult50;
        entity.PaxChild50 = $scope.flight.PaxChild50;
        entity.PaxInfant50 = $scope.flight.PaxInfant50;
        entity.PaxAdult100 = $scope.flight.PaxAdult100;
        entity.PaxChild100 = $scope.flight.PaxChild100;
        entity.PaxInfant100 = $scope.flight.PaxInfant100;
        entity.PaxVIP = $scope.flight.PaxVIP;
        entity.PaxCIP = $scope.flight.PaxCIP;
        entity.PaxHUM = $scope.flight.PaxHUM;
        entity.PaxUM = $scope.flight.PaxUM;
        entity.PaxAVI = $scope.flight.PaxAVI;
        entity.PaxWCHR = $scope.flight.PaxWCHR;
        entity.PaxSTRC = $scope.flight.PaxSTRC;
        entity.FreeAWBPieces = $scope.flight.FreeAWBPieces;
        entity.CargoPieces = $scope.flight.CargoPieces;
        entity.PaxPIRLost = $scope.flight.PaxPIRLost;
        entity.PaxPIRDamage = $scope.flight.PaxPIRDamage;
        entity.PaxPIRFound = $scope.flight.PaxPIRFound;
        entity.CargoPIRLost = $scope.flight.CargoPIRLost;
        entity.CargoPIRDamage = $scope.flight.CargoPIRDamage;
        entity.CargoPIRFound = $scope.flight.CargoPIRFound;
        entity.LimitTag = $scope.flight.LimitTag;
        entity.RushTag = $scope.flight.RushTag;
        entity.CLCheckIn = $scope.flight.CLCheckIn;
        entity.CLPark = $scope.flight.CLPark;
        entity.CLAddTools = $scope.flight.CLAddTools;
        entity.CLBusReady = $scope.flight.CLBusReady;
        entity.CLPaxOut = $scope.flight.CLPaxOut;
        entity.CLDepoOut = $scope.flight.CLDepoOut;
        entity.CLServicePresence = $scope.flight.CLServicePresence;
        entity.CLCleaningStart = $scope.flight.CLCleaningStart;
        entity.CLTechReady = $scope.flight.CLTechReady;
        entity.CLBagSent = $scope.flight.CLBagSent;
        entity.CLCateringLoad = $scope.flight.CLCateringLoad;
        entity.CLFuelStart = $scope.flight.CLFuelStart;
        entity.CLFuelEnd = $scope.flight.CLFuelEnd;
        entity.CLCleaningEnd = $scope.flight.CLCleaningEnd;
        entity.CLBoardingStart = $scope.flight.CLBoardingStart;
        entity.CLBoardingEnd = $scope.flight.CLBoardingEnd;
        entity.CLLoadSheetStart = $scope.flight.CLLoadSheetStart;
        entity.CLGateClosed = $scope.flight.CLGateClosed;
        entity.CLTrafficCrew = $scope.flight.CLTrafficCrew;
        entity.CLLoadCrew = $scope.flight.CLLoadCrew;
        entity.CLForbiddenObj = $scope.flight.CLForbiddenObj;
        entity.CLLoadSheetSign = $scope.flight.CLLoadSheetSign;
        entity.CLLoadingEnd = $scope.flight.CLLoadingEnd;
        entity.CLDoorClosed = $scope.flight.CLDoorClosed;
        entity.CLEqDC = $scope.flight.CLEqDC;
        entity.CLMotorStart = $scope.flight.CLMotorStart;
        entity.CLMovingStart = $scope.flight.CLMovingStart;
        entity.CLACStart = $scope.flight.CLACStart;
        entity.CLACEnd = $scope.flight.CLACEnd;
        entity.CLGPUStart = $scope.flight.CLGPUStart;
        entity.CLGPUEnd = $scope.flight.CLGPUEnd;
        entity.CLDepStairs = $scope.flight.CLDepStairs;
        entity.CLDepGPU = $scope.flight.CLDepGPU;
        entity.CLDepCrewCar = $scope.flight.CLDepCrewCar;
        entity.CLDepCrewCarCount = $scope.flight.CLDepCrewCarCount;
        entity.CLDepCabinService = $scope.flight.CLDepCabinService;
        entity.CLDepCateringCar = $scope.flight.CLDepCateringCar;
        entity.CLDepPatientCar = $scope.flight.CLDepPatientCar;
        entity.CLDepPaxCar = $scope.flight.CLDepPaxCar;
        entity.CLDepPaxCarCount = $scope.flight.CLDepPaxCarCount;
        entity.CLDepPushback = $scope.flight.CLDepPushback;
        entity.CLDepWaterService = $scope.flight.CLDepWaterService;
        entity.CLDepAC = $scope.flight.CLDepAC;
        entity.CLDepDeIce = $scope.flight.CLDepDeIce;
        entity.CLDepEqRemark = $scope.flight.CLDepEqRemark;
        entity.CLArrStairs = $scope.flight.CLArrStairs;
        entity.CLArrGPU = $scope.flight.CLArrGPU;
        entity.CLArrCrewCar = $scope.flight.CLArrCrewCar;
        entity.CLArrCrewCarCount = $scope.flight.CLArrCrewCarCount;
        entity.CLArrCabinService = $scope.flight.CLArrCabinService;
        entity.CLArrPatientCar = $scope.flight.CLArrPatientCar;
        entity.CLArrPaxCar = $scope.flight.CLArrPaxCar;
        entity.CLArrPaxCarCount = $scope.flight.CLArrPaxCarCount;
        entity.CLArrToiletService = $scope.flight.CLArrToiletService;
        entity.CLArrEqRemark = $scope.flight.CLArrEqRemark;
        entity.WLCount = $scope.flight.WLCount;
        entity.WLCost = $scope.flight.WLCost;
        entity.ExBagWeight = $scope.flight.ExBagWeight;
        entity.ExBagCost = $scope.flight.ExBagCost;



        entity.EstimatedDelays = [];
        var estimatedDelaysFlights = Enumerable.From($scope.dataSource).Where('$.EstimatedDelayChanged && $.EstimatedDelayChanged==true && $.EstimatedDelay>0 && $.status==1 && $.startDate.getDatePart()==' + $scope.flight.startDate.getDatePart() + ' && $.startDate.getTime() > ' + $scope.flight.startDate.getTime() + '  && $.RegisterID==' + $scope.flight.RegisterID).OrderBy('$.startDate').ToArray();
        // console.log(estimatedDelaysFlights);
        $.each(estimatedDelaysFlights, function (_i, _d) {
            entity.EstimatedDelays.push({
                FlightId: _d.ID,
                Delay: Math.floor(_d.EstimatedDelay),
            });
        });
    };
    $scope.fillArrival = function (entity) {
        entity.Landing = (new Date($scope.flight.Landing)).toUTCString();
        if ($scope.flight.ChocksIn)
            entity.ChocksIn = (new Date($scope.flight.ChocksIn)).toUTCString();

        entity.BlockH = $scope.flight.BlockH;
        entity.BlockM = $scope.flight.BlockM;

        entity.GWLand = $scope.flight.GWLand;


        entity.FuelArrival = $scope.flight.FuelArrival;

        entity.ArrivalRemark = $scope.flight.ArrivalRemark;



    };



    ///////////////////////////////////

    $scope.tabsdatefirst = true;

    ///////////////////////////////////////
    $scope.popup_mlog_visible = false;
    $scope.popup_mlog_title = 'Log';
    $scope.popup_mlog_instance = null;
    $scope.popup_mlog = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_mlog"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 750,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fblink', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_mlog_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,

        closeOnOutsideClick: false,

        onShowing: function (e) {
            $scope.IsSave = $scope.IsEditable || $scope.IsStaion || $scope.IsRemark;
            if ($scope.IsStaion) {

                $scope.IsSave = $scope.logFlight.FromAirportIATA == $rootScope.Station || $scope.logFlight.ToAirportIATA == $rootScope.Station;
            }
            $scope.popup_mlog_instance.repaint();

            if ($scope.logFlight.FlightStatusID == 4) {
                $scope.time_status_value = new Date($scope.logFlight.CancelDate);
            }
            else
                if ($scope.logFlight.FlightStatusID == 9) {
                    $scope.time_status_value = new Date($scope.logFlight.RampDate);
                }

            if ($scope.logFlight.RedirectReasonId) {

                $scope.time_redirect_value = new Date($scope.logFlight.RedirectDate);
                $scope.entity_redirect.AirportId = $scope.logFlight.ToAirport;

            }
            //hook

            $scope.depReadOnly = false;


        },
        onShown: function (e) {
            $scope.loadingVisible = true;
            flightService.getFlightDelays($scope.logFlight.ID).then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {

                    var dc = {
                        Id: _d.ID, //_d.DelayCodeId,
                        DelayCodeId: _d.DelayCodeId,
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

                $scope.convertUTCEnabled = true;
                if ($scope.doUTC) { $scope.timeBase = 'UTC'; }
                else { $scope.timeBase = 'LCB'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);

                // }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            if ($scope.before_refreshed_flight) {

                $scope.undoRefresh();
                // console.log($scope.flight);
                $scope.before_refreshed_flight = null;
            }
            if (!$scope.doUTC)
                $scope.timeBase = 'LCB';



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;
            $scope.entity_redirect.ToAirportId = null;
            $scope.popup_mlog_visible = false;


        },
        onContentReady: function (e) {
            if (!$scope.popup_mlog_instance)
                $scope.popup_mlog_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_mlog_visible',

            title: 'popup_mlog_title',

        }
    };

    //////////////////////////////
    $scope.selectedTabHeaderIndex = -1;
    $scope.$watch("selectedTabHeaderIndex", function (newValue) {

        try {
            var selectedTab = $scope.tabs_header[newValue];
            $('.dep_tab').hide();
            if (selectedTab)
                $('.' + selectedTab.id).fadeIn(100, function () { });
        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_header = [
        { text: "Status", id: 'dep_status' },
        { text: "Pax", id: 'dep_pax' },
        { text: "Crew", id: 'dep_crew' },
        // { text: "Delay", id: 'dep_delay' },
        //   { text: "Diversion/Ramp", id: 'dep_ramp' },




    ];
    $scope.tabs_header_options = {
        scrollByContent: true,
        showNavButtons: true,

        elementAttr: {
            // id: "elementId",
            class: "tabsheader"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabHeaderIndex = -1;
            $scope.selectedTabHeaderIndex = 0;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_header", deep: true },
            selectedIndex: 'selectedTabHeaderIndex'
        }

    };

    ///////////////////////////
    $scope.scroll_dep_time = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_dep_height',
        }
        //height: 571,
    };

    $scope.scroll_dep_pax = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_dep_height',
        }
    };
    $scope.scroll_dep_crew = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_dep_height',
        }
    };
    $scope.scroll_dep_delay = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_dep_height',
        }
    };
    $scope.scroll_dep_ramp = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_dep_height',
        }
    };
    ////////////////////////////////
    $scope.maxDepartureDate = new Date();
    $scope.minDepartureDate = new Date();
    $scope.dep_ready = {
        type: "date", pickerType: "rollers", width: '100%', interval: 5, onValueChanged: function (arg) { }, bindingOptions: {
            value: 'logFlight.Ready',
            max: 'maxDepartureDate', min: 'minDepartureDate',
        }
    };
    $scope.dep_ready_hh = {
        type: "time", width: '100%', pickerType: "rollers", displayFormat: "HH:mm", interval: 15, onValueChanged: function (arg) { },
        bindingOptions: { value: 'logFlight.Ready', max: 'maxDepartureDate', min: 'minDepartureDate' }
    };

    $scope.dep_start = {
        type: "date", pickerType: "rollers", width: '100%', interval: 5, onValueChanged: function (arg) { }, bindingOptions: {
            value: 'logFlight.Start',
            max: 'maxDepartureDate', min: 'minDepartureDate',
        }
    };
    $scope.dep_start_hh = {
        type: "time", width: '100%', pickerType: "rollers", displayFormat: "HH:mm", interval: 15, onValueChanged: function (arg) { },
        bindingOptions: { value: 'logFlight.Start', max: 'maxDepartureDate', min: 'minDepartureDate' }
    };

    $scope.dep_offblock = {
        pickerType: "rollers",
        type: "date",
        width: '100%',
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        interval: 5,
        bindingOptions: {
            value: 'logFlight.ChocksOut',
            // min: 'flight.baseStartDate',
            readOnly: 'IsOffBlockReadOnly',
            disabled: 'IsOffBlockReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    $scope.dep_offblock_hh = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculateTotalDelay();
        },
        bindingOptions: {
            value: 'logFlight.ChocksOut',
            readOnly: 'IsOffBlockReadOnly',
            disabled: 'IsOffBlockReadOnly'
        }
    };
    $scope.dep_takeoff = {
        type: "date",
        pickerType: "rollers",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            //  $scope.calculateTotalDelay();

        },
        bindingOptions: {
            value: 'logFlight.Takeoff',
            //    min: 'flight.baseStartDate',
            readOnly: 'IsTakeOffReadOnly',
            disabled: 'IsTakeOffReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    $scope.dep_takeoff_hh = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'logFlight.Takeoff',
            //  min: 'flight.baseStartDate',
            readOnly: 'IsTakeOffReadOnly',
            disabled: 'IsTakeOffReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    ///
    $scope.dep_onblock = {
        pickerType: "rollers",
        type: "date",
        width: '100%',
        onValueChanged: function (arg) {


        },
        interval: 5,
        bindingOptions: {
            value: 'logFlight.ChocksIn',
            // min: 'flight.baseStartDate',
            readOnly: 'IsOnBlockReadOnly',
            disabled: 'IsOnBlockReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    $scope.dep_onblock_hh = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'logFlight.ChocksIn',
            readOnly: 'IsOnBlockReadOnly',
            disabled: 'IsOnBlockReadOnly',
        }
    };
    $scope.dep_landing = {
        type: "date",
        pickerType: "rollers",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            //  $scope.calculateTotalDelay();

        },
        bindingOptions: {
            value: 'logFlight.Landing',
            //    min: 'flight.baseStartDate',
            readOnly: 'IsLandingReadOnly',
            disabled: 'IsLandingReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    $scope.dep_landing_hh = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'logFlight.Landing',
            //  min: 'flight.baseStartDate',
            readOnly: 'IsLandingReadOnly',
            disabled: 'IsLandingReadOnly',
            max: 'maxDepartureDate',
            min: 'minDepartureDate',
        }
    };
    $scope.dep_adult = {
        readOnly: false,
        min: 0,
        showSpinButtons: false,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'logFlight.PaxAdult',
            readOnly: 'depReadOnly'
        }
    };
    $scope.dep_child = {
        readOnly: false,
        showSpinButtons: false,
        min: 0,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'logFlight.PaxChild',
            readOnly: 'depReadOnly'
        }
    };
    $scope.dep_infant = {
        readOnly: false,
        showSpinButtons: false,
        min: 0,
        onValueChanged: function (e) {
            $scope.calculateTotalPax();
        },
        bindingOptions: {
            value: 'logFlight.PaxInfant',
            readOnly: 'depReadOnly'
        }
    };
    ////////////////////////////////
    $scope.popup_departure_visible = false;
    $scope.popup_departure_title = 'Flight Log';
    $scope.popup_departure_instance = null;
    $scope.popup_departure = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_departure"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: function () {
            var wh = $(window).height();
            if (wh > 700)
                wh = 700;
            return wh;
        },
        width: function () {
            var ww = $(window).width();
            alert(ww);
            if (ww > 500)
                ww = 500;
            return 500;
        },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'deplog', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //2020-11-22
                        flightService.getFlightGUID($scope.logFlight.ID).then(function (response) {

                            if ($scope.flightGUID != response) {
                                General.ShowNotify('Your session expired. The Flight data changed by another user. please close this window and open again.', 'error');
                                $scope.forceUpdate();
                                return;
                            }

                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 9 || $scope.logFlight.FlightStatusID == 14 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Takeoff && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksIn && ($scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }



                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Takeoff || $scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }


                            if ($scope.logFlight.Takeoff && new Date($scope.logFlight.Takeoff) < new Date($scope.logFlight.ChocksOut)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if ($scope.logFlight.Landing && new Date($scope.logFlight.Landing) < new Date($scope.logFlight.Takeoff)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if ($scope.logFlight.ChocksIn && new Date($scope.logFlight.ChocksIn) < new Date($scope.logFlight.Landing)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }
                            if ($scope.logFlight.FlightStatusID == 4 && !$scope.logFlight.CancelReasonId) {
                                General.ShowNotify(Config.Text_CancelReason, 'error');
                                return;
                            }



                            //////////////////////////////
                            ///////////////////////////////
                            var sumTotalDelayCodesAmount = 0;
                            if (!$scope.dg_delay_ds)
                                $scope.dg_delay_ds = [];
                            //sati new
                            sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                            if (!$scope.logFlight.TotalDelayTotalMM)
                                $scope.logFlight.TotalDelayTotalMM = 0;

                            if ($scope.logFlight.TotalDelayTotalMM > 5 && $scope.dg_delay_ds.length == 0) {
                                // General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                // return;
                            }

                            if ($scope.dg_delay_ds) {
                                if (!$scope.logFlight.TotalDelayTotalMM)
                                    $scope.logFlight.TotalDelayTotalMM = 0;
                                sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                                if ($scope.logFlight.FlightStatusID != 5 && (sumTotalDelayCodesAmount > 5 && sumTotalDelayCodesAmount != $scope.logFlight.TotalDelayTotalMM) && $scope.logFlight.ChocksOut) {
                                    //  General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                    //  return;
                                }
                            }


                            var dto = {
                                StatusLog: [],
                            };




                            $scope.fillDto(dto);
                            $scope.fillLog(dto);

                            dto.NightTime = $scope.logFlight.NightTime;
                            dto.JLBLHH = $scope.logFlight.JLBLHH;
                            dto.SendDelaySMS = $scope.sms_delay ? 1 : 0;
                            dto.SendCancelSMS = $scope.sms_cancel ? 1 : 0;
                            dto.SendNiraSMS = $scope.sms_nira ? 1 : 0;



                            $scope.loadingVisible = true;
                            logService.saveFlightLog(dto).then(function (response) {

                                for (var key of Object.keys(response.flight)) {


                                    $scope.ati_flight[key] = response.flight[key];

                                }
                                $scope.modifyFlightTimes($scope.ati_flight);
                                $scope.modifyGantt($scope.ati_flight, response.ressq[0]);




                                $scope.getBoardSummary($scope.selectedDate);
                                // $scope.before_refreshed_flight = null;
                                $scope.loadingVisible = false;
                                $scope.sms_delay = false;
                                $scope.sms_cancel = false;
                                $scope.sms_nira = false;
                                $scope.popup_departure_visible = false;

                                //$scope.calculateSummary();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





                            /////////////////////////////////////
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_departure_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,

        closeOnOutsideClick: false,




        onShowing: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.IsSave = $scope.IsEditable || $scope.IsStaion;
            if ($scope.IsStaion) {

                $scope.IsSave = $scope.logFlight.FromAirportIATA == $rootScope.Station || $scope.logFlight.ToAirportIATA == $rootScope.Station;
            }
            $scope.popup_departure_instance.repaint();

            if ($scope.logFlight.FlightStatusID == 4) {
                $scope.time_status_value = new Date($scope.logFlight.CancelDate);
            }
            else
                if ($scope.logFlight.FlightStatusID == 9) {
                    $scope.time_status_value = new Date($scope.logFlight.RampDate);
                }

            if ($scope.logFlight.RedirectReasonId) {

                $scope.time_redirect_value = new Date($scope.logFlight.RedirectDate);
                $scope.entity_redirect.AirportId = $scope.logFlight.ToAirport;

            }
            //hook

            $scope.depReadOnly = false;


        },
        onShown: function (e) {
            $scope.selectedTabIndex = 0;
            $scope.loadingVisible = true;
            flightService.getFlightDelays($scope.logFlight.ID).then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {

                    var dc = {
                        Id: _d.ID, //_d.DelayCodeId,
                        DelayCodeId: _d.DelayCodeId,
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

                $scope.convertUTCEnabled = true;
                if ($scope.doUTC) { $scope.timeBase = 'UTC'; }
                else { $scope.timeBase = 'LCB'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);

                // }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            if ($scope.before_refreshed_flight) {

                $scope.undoRefresh();
                // console.log($scope.flight);
                $scope.before_refreshed_flight = null;
            }
            if (!$scope.doUTC)
                $scope.timeBase = 'LCB';



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;
            $scope.entity_redirect.ToAirportId = null;
            $scope.popup_departure_visible = false;


        },



        onContentReady: function (e) {
            if (!$scope.popup_departure_instance)
                $scope.popup_departure_instance = e.component;
            if (e.component) {

                var contentElement = e.component.content();

                contentElement[0].style.padding = '0px !important';
            }


        },
        bindingOptions: {
            visible: 'popup_departure_visible',

            title: 'popup_departure_title',
            'toolbarItems[0].visible': 'IsSave',

        }
    };

    //look


    /////////////////////////////////////////
    //2020-1-17
    $scope.saveRemark = function () {
        var entity = {};
        entity.ID = $scope.logFlight.ID;
        entity.DepartureRemark = $scope.logFlight.DepartureRemark;
        entity.UserName = $rootScope.userName;
        $scope.loadingVisible = true;
        flightService.saveRemrak(entity).then(function (response) {

            $scope.loadingVisible = false;
            $scope.ati_flight.DepartureRemark = entity.DepartureRemark;
            $scope.popup_log_visible = false;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////////////////
    $scope.popup_log_instance = null;
    $scope.popup_log_visible = false;
    $scope.popup_log_title = 'Log';
    $scope.popup_log = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_log"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1520,
        //height: function () { return $(window).height() * 0.95 },
        height: 687,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Journey Log', icon: '', onClick: function (e) {
                        $scope.line = [];
                        $scope.jlShow = false;

                        $scope.leg1Text = "";
                        $scope.leg1Visible = false;
                        $scope.leg1Value = false;

                        $scope.leg2Text = "";
                        $scope.leg2Visible = false;
                        $scope.leg2Value = false;

                        $scope.leg3Text = "";
                        $scope.leg3Visible = false;
                        $scope.leg3Value = false;

                        $scope.leg4Text = "";
                        $scope.leg4Visible = false;
                        $scope.leg4Value = false;

                        $scope.leg5Text = "";
                        $scope.leg5Visible = false;
                        $scope.leg5Value = false;

                        $scope.leg6Text = "";
                        $scope.leg6Visible = false;
                        $scope.leg6Value = false;

                        $scope.leg7Text = "";
                        $scope.leg7Visible = false;
                        $scope.leg7Value = false;

                        $scope.leg8Text = "";
                        $scope.leg8Visible = false;
                        $scope.leg8Value = false;

                        $scope.loadingVisible = true;
                        flightService.getFlightsLine($scope.flight.ID).then(function (response) {
                            $scope.loadingVisible = false;
                            $.each(response, function (_i, _d) {
                                $scope.line.push(_d);
                                switch (_i) {
                                    case 0:
                                        $scope.leg1Text = _d.FlightNumber;
                                        $scope.leg1Visible = true;
                                        $scope.leg1Value = true;
                                        break;
                                    case 1:
                                        $scope.leg2Text = _d.FlightNumber;
                                        $scope.leg2Visible = true;
                                        $scope.leg2Value = true;
                                        break;
                                    case 2:
                                        $scope.leg3Text = _d.FlightNumber;
                                        $scope.leg3Visible = true;
                                        $scope.leg3Value = true;
                                        break;
                                    case 3:
                                        $scope.leg4Text = _d.FlightNumber;
                                        $scope.leg4Visible = true;
                                        $scope.leg4Value = true;
                                        break;
                                    case 4:
                                        $scope.leg5Text = _d.FlightNumber;
                                        $scope.leg5Visible = true;
                                        $scope.leg5Value = true;
                                        break;
                                    case 5:
                                        $scope.leg6Text = _d.FlightNumber;
                                        $scope.leg6Visible = true;
                                        $scope.leg6Value = true;
                                        break;
                                    case 6:
                                        $scope.leg7Text = _d.FlightNumber;
                                        $scope.leg7Visible = true;
                                        $scope.leg7Value = true;
                                        break;
                                    case 7:
                                        $scope.leg8Text = _d.FlightNumber;
                                        $scope.leg8Visible = true;
                                        $scope.leg8Value = true;
                                        break;
                                    default:
                                        break;
                                }
                                $scope.popup_jl_visible = true;
                            });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            }
            ,

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Crew List', icon: '', onClick: function (e) {

                        //tootnew 
                        $scope.line = [];
                        $scope.clShow = false;

                        $scope.leg1Text = "";
                        $scope.leg1Visible = false;
                        $scope.leg1Value = false;

                        $scope.leg2Text = "";
                        $scope.leg2Visible = false;
                        $scope.leg2Value = false;

                        $scope.leg3Text = "";
                        $scope.leg3Visible = false;
                        $scope.leg3Value = false;

                        $scope.leg4Text = "";
                        $scope.leg4Visible = false;
                        $scope.leg4Value = false;

                        $scope.leg5Text = "";
                        $scope.leg5Visible = false;
                        $scope.leg5Value = false;

                        $scope.leg6Text = "";
                        $scope.leg6Visible = false;
                        $scope.leg6Value = false;

                        $scope.leg7Text = "";
                        $scope.leg7Visible = false;
                        $scope.leg7Value = false;

                        $scope.leg8Text = "";
                        $scope.leg8Visible = false;
                        $scope.leg8Value = false;

                        $scope.loadingVisible = true;
                        flightService.getFlightsLine($scope.flight.ID).then(function (response) {
                            $scope.loadingVisible = false;
                            $.each(response, function (_i, _d) {
                                $scope.line.push(_d);
                                switch (_i) {
                                    case 0:
                                        $scope.leg1Text = _d.FlightNumber;
                                        $scope.leg1Visible = true;
                                        $scope.leg1Value = true;
                                        break;
                                    case 1:
                                        $scope.leg2Text = _d.FlightNumber;
                                        $scope.leg2Visible = true;
                                        $scope.leg2Value = false;
                                        break;
                                    case 2:
                                        $scope.leg3Text = _d.FlightNumber;
                                        $scope.leg3Visible = true;
                                        $scope.leg3Value = false;
                                        break;
                                    case 3:
                                        $scope.leg4Text = _d.FlightNumber;
                                        $scope.leg4Visible = true;
                                        $scope.leg4Value = false;
                                        break;
                                    case 4:
                                        $scope.leg5Text = _d.FlightNumber;
                                        $scope.leg5Visible = true;
                                        $scope.leg5Value = false;
                                        break;
                                    case 5:
                                        $scope.leg6Text = _d.FlightNumber;
                                        $scope.leg6Visible = true;
                                        $scope.leg6Value = false;
                                        break;
                                    case 6:
                                        $scope.leg7Text = _d.FlightNumber;
                                        $scope.leg7Visible = true;
                                        $scope.leg7Value = false;
                                        break;
                                    case 7:
                                        $scope.leg8Text = _d.FlightNumber;
                                        $scope.leg8Visible = true;
                                        $scope.leg8Value = false;
                                        break;
                                    default:
                                        break;
                                }
                                //dluzad
                                if ($scope.IsPickup)
                                    $scope.popup_cltrans_visible = true;
                                else
                                    //$scope.popup_cl_visible = true;
                                    // $scope.popup_clnew_visible = true;
                                    $scope.popup_clgd_visible = true;
                            });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'History', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_history_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Notify Pickup', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_notify_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Notify Crew', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_notify2_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Reporting Time', icon: 'clock', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_crew_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            //qeshm
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Catering', icon: 'food', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_catering_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            //05-07
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Charterers', icon: 'fa fa-credit-card', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_chr_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaclog', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {

                        //2020-11-22

                        flightService.getFlightGUID($scope.logFlight.ID).then(function (response) {

                            if ($scope.flightGUID != response) {
                                General.ShowNotify('Your session expired. The Flight data changed by another user. please close this window and open again.', 'error');
                                $scope.forceUpdate();
                                return;
                            }

                            //2021-1-17

                            if ($scope.IsRemark) {
                                $scope.saveRemark();
                                return;
                            }
                            ////////////////////////////
                            //save method
                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 9 || $scope.logFlight.FlightStatusID == 14 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Takeoff && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksIn && ($scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }



                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Takeoff || $scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }


                            if ($scope.logFlight.Takeoff && new Date($scope.logFlight.Takeoff) < new Date($scope.logFlight.ChocksOut)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if ($scope.logFlight.Landing && new Date($scope.logFlight.Landing) < new Date($scope.logFlight.Takeoff)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if ($scope.logFlight.ChocksIn && new Date($scope.logFlight.ChocksIn) < new Date($scope.logFlight.Landing)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }
                            if ($scope.logFlight.FlightStatusID == 4 && !$scope.logFlight.CancelReasonId) {
                                General.ShowNotify(Config.Text_CancelReason, 'error');
                                return;
                            }



                            //////////////////////////////
                            ///////////////////////////////
                            var sumTotalDelayCodesAmount = 0;
                            if (!$scope.dg_delay_ds)
                                $scope.dg_delay_ds = [];
                            //sati new
                            sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                            if (!$scope.logFlight.TotalDelayTotalMM)
                                $scope.logFlight.TotalDelayTotalMM = 0;

                            if ($scope.logFlight.TotalDelayTotalMM > 5 && $scope.dg_delay_ds.length == 0) {
                                // General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                // return;
                            }

                            if ($scope.dg_delay_ds) {
                                if (!$scope.logFlight.TotalDelayTotalMM)
                                    $scope.logFlight.TotalDelayTotalMM = 0;
                                sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                                if ($scope.logFlight.FlightStatusID != 5 && (sumTotalDelayCodesAmount > 5 && sumTotalDelayCodesAmount != $scope.logFlight.TotalDelayTotalMM) && $scope.logFlight.ChocksOut) {
                                    //  General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                    //  return;
                                }
                            }


                            var dto = {
                                StatusLog: [],
                            };




                            //if ($scope.timeBase == 'UTC') {
                            //    var offset = -1 * (new Date()).getTimezoneOffset();



                            //    $scope.flight.ChocksOut = (new Date($scope.flight.ChocksOut)).addMinutes(offset);

                            //    $scope.flight.Takeoff = (new Date($scope.flight.Takeoff)).addMinutes(offset);
                            //    $scope.flight.Landing = (new Date($scope.flight.Landing)).addMinutes(offset);
                            //    $scope.flight.ChocksIn = (new Date($scope.flight.ChocksIn)).addMinutes(offset);


                            //    if ($scope.time_redirect_value)
                            //        $scope.time_redirect_value = (new Date($scope.time_redirect_value)).addMinutes(offset);
                            //    if ($scope.time_ramp_value)
                            //        $scope.time_ramp_value = (new Date($scope.time_ramp_value)).addMinutes(offset);

                            //}




                            //gabi2

                            $scope.fillDto(dto);
                            $scope.fillLog(dto);

                            dto.NightTime = $scope.logFlight.NightTime;
                            dto.JLBLHH = $scope.logFlight.JLBLHH;
                            dto.SendDelaySMS = $scope.sms_delay ? 1 : 0;
                            dto.SendCancelSMS = $scope.sms_cancel ? 1 : 0;
                            dto.SendNiraSMS = $scope.sms_nira ? 1 : 0;

                            dto.ChrCapacity = $scope.mchr.Capacity;
                            dto.ChrTitle = $scope.mchr.Title;
                            dto.ChrCode = $scope.mchr.Code;
                            dto.ChrAdult = $scope.mchr.Adult;
                            dto.ChrChild = $scope.mchr.Child;
                            dto.ChrInfant = $scope.mchr.Infant

                            //09-02
                            dto.FuelDensity = $scope.logFlight.FuelDensity;
                            dto.SerialNo = $scope.logFlight.SerialNo;
                            dto.LTR = $scope.logFlight.LTR;
                            console.log('SAVE LOG', dto);

                            $scope.loadingVisible = true;
                            logService.saveFlightLog(dto).then(function (response) {
                                //dlukala
                                //console.log('update log result');

                                for (var key of Object.keys(response.flight)) {


                                    $scope.ati_flight[key] = response.flight[key];
                                    //console.log(key+'    '+response[key]+'     '+$scope.ati_flight[key]);
                                }
                                $scope.modifyFlightTimes($scope.ati_flight);
                                $scope.modifyGantt($scope.ati_flight, response.ressq[0]);
                                //console.log($scope.ati_flight);
                                //////////////////////////////////////////////////////////
                                //if ($scope.timeBase == 'UTC' && $scope.doUTC) {

                                //    var offset = -1 * (new Date()).getTimezoneOffset();


                                //    $scope.flight.ChocksOut = (new Date($scope.flight.ChocksOut)).addMinutes(-offset);

                                //    $scope.flight.Takeoff = (new Date($scope.flight.Takeoff)).addMinutes(-offset);
                                //    $scope.flight.Landing = (new Date($scope.flight.Landing)).addMinutes(-offset);
                                //    $scope.flight.ChocksIn = (new Date($scope.flight.ChocksIn)).addMinutes(-offset);


                                //    if ($scope.time_redirect_value)
                                //        $scope.time_redirect_value = (new Date($scope.time_redirect_value)).addMinutes(-offset);
                                //    if ($scope.time_ramp_value)
                                //        $scope.time_ramp_value = (new Date($scope.time_ramp_value)).addMinutes(-offset);



                                //    if ($scope.flight.ChocksIn) {
                                //        Flight.calculateDelayLandingOnBlock($scope.flight);
                                //    }
                                //    if ($scope.flight.ChocksOut)
                                //        Flight.XcalculateDelayOffBlock($scope.flight);
                                //    if ($scope.flight.ChocksIn)
                                //        Flight.XcalculateDelayLandingOnBlock($scope.flight);

                                //    $scope.flight.EstimatedDelay = sumTotalDelayCodesAmount;

                                //}
                                ///////////////////////////////////////////////////////////

                                $scope.mchr = {
                                    ChartererId: null,
                                    Code: null,
                                    Title: null,
                                    Adult: 0,
                                    Child: 0,
                                    Infant: 0,
                                    Capacity: 0,
                                };

                                $scope.getBoardSummary($scope.selectedDate);
                                // $scope.before_refreshed_flight = null;
                                $scope.loadingVisible = false;
                                $scope.sms_delay = false;
                                $scope.sms_cancel = false;
                                $scope.sms_nira = false;
                                //razbani
                                //flightService.notifyDelay2($scope.ati_flight.ID).then(function (response) {


                                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                ///////////////////////
                                //2021-06-28 2021-06-29 MVT
                                //UserName
                                //flightService.sendMVT($scope.ati_flight.ID, dto.UserName).then(function (response) {


                                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                //////////////////////////
                                $scope.popup_log_visible = false;

                                //$scope.calculateSummary();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                            //  ganttObj.updateRecordByTaskId($scope.flight);

                            /////////////////////////////////////
                            ///////////////////////////////
                            ///////////////////////////////

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {


                        $scope.popup_log_visible = false;
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
        onContentReady: function (e) {
            if (!$scope.popup_log_instance)
                $scope.popup_log_instance = e.component;

        },
        onShowing: function (e) {
            $scope.IsSave = $scope.IsEditable || $scope.IsStaion;
            if ($scope.IsStaion) {

                $scope.IsSave = $scope.logFlight.FromAirportIATA == $rootScope.Station || $scope.logFlight.ToAirportIATA == $rootScope.Station;
            }
            $scope.popup_log_instance.repaint();


            if ($scope.logFlight.FlightStatusID == 4) {
                $scope.time_status_value = new Date($scope.logFlight.CancelDate);
            }
            else
                if ($scope.logFlight.FlightStatusID == 9) {
                    $scope.time_status_value = new Date($scope.logFlight.RampDate);
                }

            if ($scope.logFlight.RedirectReasonId) {

                $scope.time_redirect_value = new Date($scope.logFlight.RedirectDate);
                $scope.entity_redirect.AirportId = $scope.logFlight.ToAirport;

            }
            //hook

            $scope.depReadOnly = false;


        },
        onShown: function (e) {
            //$scope.flight


            $scope.nira_charterers = [];
            ////////////////////////////////////
            $scope.loadingVisible = true;
            flightService.getFlightDelays($scope.logFlight.ID).then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {

                    var dc = {
                        Id: _d.ID, //_d.DelayCodeId,
                        DelayCodeId: _d.DelayCodeId,
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

                $scope.convertUTCEnabled = true;
                if ($scope.doUTC) { $scope.timeBase = 'UTC'; }
                else { $scope.timeBase = 'LCB'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);

                console.log($scope.flight);
                //06-13

                var churl = 'https://localhost:44309/api/nira/chrs?flt=' + $scope.flight.FlightNumber + '&dt=' + moment(new Date($scope.flight.Date)).format("YYYY-MM-DD");
                $http.get(churl).then(function (response) {
                    console.log(response);
                    try {
                        $scope.nira_charterers = response.data.NRSCharterOfficesCapacity;
                        var _chsum = Enumerable.From($scope.nira_charterers).Sum('Number($.Book)');

                        if (_chsum)
                            $scope.nira_charterers.push({ OfficeCode: '', Capacity: 'Sum:', Book: _chsum });
                    }
                    catch (xee) {

                    }
                }, function (err, status) {

                    console.log(err);
                });

                // }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            if ($scope.before_refreshed_flight) {

                $scope.undoRefresh();
                // console.log($scope.flight);
                $scope.before_refreshed_flight = null;
            }
            if (!$scope.doUTC)
                $scope.timeBase = 'LCB';

            //gooz
            //$scope.convertUTCEnabled = false;
            //if (!$scope.doUTC)
            //    $scope.timeBase = 'LCB';
            //else
            //    $scope.timeBase = 'UTC';
            //$scope.convertUTCEnabled = true;

            //  $scope.flight.STA= $scope.otimes.STA ;
            //   $scope.flight.STD= $scope.otimes.STD  ;



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;
            $scope.entity_redirect.ToAirportId = null;
            $scope.popup_log_visible = false;


        },
        bindingOptions: {
            visible: 'popup_log_visible',

            title: 'popup_log_title',

            'toolbarItems[0].visible': 'IsJLAccess',
            'toolbarItems[1].visible': 'IsCLAccess',
            'toolbarItems[3].visible': 'IsPickup',
            'toolbarItems[4].visible': 'IsEditable',
            'toolbarItems[5].visible': 'IsEditable',
            //qeshm
            'toolbarItems[8].visible': 'IsSave',


        }
    };

    //close button
    //fuckc
    ///////////////////////////////////



    //*********************************8/////
    $scope.dg_selected = null;
    $scope.dg_columns = [

        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 90, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
        //  { dataField: 'HH', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 80 },
        { dataField: 'MM', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 90 },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },





    ];
    $scope.dg_height = 100;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
            visible: true,
            showOperationChooser: true,
        },
        onEditingStart: function (e) {
            if (e.column.dataField == 'MM' && !e.key.Selected)
                e.cancel = true;
        },
        onRowUpdating: function (e) {
            if (!e.newData.hasOwnProperty('Selected'))
                return;
            if (!e.newData.Selected) {
                //e.key.HH = null;
                // e.key.MM = null;
                e.newData.HH = null;
                e.newData.MM = null;
            }
        },
        onRowUpdated: function (e) {
            //if (!e.key.Selected) {
            //    e.key.HH = null;
            //    e.key.MM = null;
            //}
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


        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_selected = null;



            }
            else {
                $scope.dg_selected = data;


            }


        },
        height: 497,
        summary: {
            totalItems: [{
                column: "MM",
                summaryType: "sum"
            }]
        },

        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };


    $scope.dg2_selected = null;
    $scope.dg2_columns = [

        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 90, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
        //  { dataField: 'HH', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 80 },
        { dataField: 'MM', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 90 },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },





    ];
    $scope.dg2_height = 100;

    $scope.dg2_instance = null;
    $scope.dg2_ds = null;
    $scope.dg2 = {
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
            visible: true,
            showOperationChooser: true,
        },
        onEditingStart: function (e) {
            if (e.column.dataField == 'MM' && !e.key.Selected)
                e.cancel = true;
        },
        onRowUpdating: function (e) {
            if (!e.newData.hasOwnProperty('Selected'))
                return;
            if (!e.newData.Selected) {
                //e.key.HH = null;
                // e.key.MM = null;
                e.newData.HH = null;
                e.newData.MM = null;
            }
        },
        onRowUpdated: function (e) {
            //if (!e.key.Selected) {
            //    e.key.HH = null;
            //    e.key.MM = null;
            //}
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


        columns: $scope.dg2_columns,
        onContentReady: function (e) {
            if (!$scope.dg2_instance)
                $scope.dg2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg2_selected = null;



            }
            else {
                $scope.dg2_selected = data;


            }


        },
        height: 330,
        summary: {
            totalItems: [{
                column: "MM",
                summaryType: "sum"
            }]
        },
        bindingOptions: {
            dataSource: 'dg2_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    //////////////////////////////////////////
    //2020-10-27 1 s
    $scope.dg_crew_abs_columns = [
        //{
        //    caption: 'Crew', columns: [
        //         { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        //        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, fixed: true, fixedPosition: 'left' },

        //        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //         { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
        //           {
        //               dataField: 'RP', caption: 'Pickup', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
        //                   type: "time"
        //               }, format: "HH:mm"
        //           },



        //    ]
        //}
        { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, fixed: true, fixedPosition: 'left' },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
        {
            dataField: 'RP', caption: 'Pickup', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
                type: "time"
            }, format: "HH:mm"
        },
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
        height: 234,// $(window).height() - 250,// 490 

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
    //////////////////////////////////////////
    $scope.dg_crew_abs2_columns = [
        {
            caption: 'Crew', columns: [
                { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
                { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
                { dataField: 'ScName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },


            ]
        }

    ];
    $scope.dg_crew_abs2_selected = null;
    $scope.dg_crew_abs2_instance = null;
    $scope.dg_crew_abs2_ds = null;
    $scope.dg_crew_abs2 = {
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
        height: 200,// $(window).height() - 250,// 490 

        columns: $scope.dg_crew_abs2_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_abs2_instance)
                $scope.dg_crew_abs2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_abs2_selected = null;

            }
            else {
                $scope.dg_crew_abs_selected = data;

            }
        },
        onRowPrepared: function (e) {


        },

        bindingOptions: {
            dataSource: 'dg_crew_abs2_ds',

        }
    };
    //////////////////////////////////////////
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
    /////////////////////////////////////////////
    $scope.dg_upd_selected = null;
    $scope.dg_upd_columns = [

        { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },

        { dataField: 'DateStatus', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd, HH:mm', sortIndex: 0, sortOrder: "asc" },



    ];
    $scope.dg_upd_height = 100;

    $scope.dg_upd_instance = null;

    $scope.dg_upd = {
        editing: {
            allowUpdating: false,
            mode: 'cell'
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
            visible: true,
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


        columns: $scope.dg_upd_columns,
        onContentReady: function (e) {
            if (!$scope.dg_upd_instance)
                $scope.dg_upd_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_upd_selected = null;



            }
            else {
                $scope.dg_upd_selected = data;


            }


        },
        //height: 300,
        height: '100%',


        bindingOptions: {
            dataSource: 'updatedFlights', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };
    /////////////////////////////////////////////
    $scope.popup_upd_visible = false;
    $scope.popup_upd_title = 'Updated Flights';
    $scope.popup_upd = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_upd"
        },
        shading: false,
        position: { my: 'left', at: 'left', of: window, offset: '5 5' },
        width: 500,
        height: 450, //function () { return $(window).height() * 0.95 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Flight', icon: 'arrowright', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        if (!$scope.dg_upd_selected)
                            return;
                        var data = Enumerable.From($scope.dataSource).Where('$.ID==' + $scope.dg_upd_selected.ID).FirstOrDefault();
                        if (!data)
                            return;
                        $scope.scrollGantt(data);
                        $scope.scrollGrid(data);
                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            $(e.titleElement).css('background-color', '#8BC34A');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {


            $scope.popup_upd_visible = false;

        },
        bindingOptions: {
            visible: 'popup_upd_visible',

            title: 'popup_upd_title',

        }
    };

    //close button
    $scope.popup_upd.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_upd_visible = false;

    };
    ////////////////////////////////////////////////////

    //jooj
    $scope.getReporting = function (fid) {



        $scope.loadingVisible = true;
        flightService.getReporting(fid).then(function (response) {
            $scope.loadingVisible = false;

            // $.each(response, function (_i, _d) {
            //     _d.ReportingTime = (new Date(_d.ReportingTime)).addMinutes(offset);

            // });
            //if ($scope.dg_boxflight_ds && $scope.dg_boxflight_ds.length > 0) {
            //    var rpttime = (new Date($scope.dg_boxflight_ds[0].STD)).addHours(-1);

            //}
            var ds = Enumerable.From(response).OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();

            $scope.dg_crew_ds = ds;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrew = function (fid) {



        $scope.loadingVisible = true;
        flightService.getFlightCrew2(fid).then(function (response) {
            $scope.loadingVisible = false;
            //(new Date($scope.flight.STA)).addMinutes(offset);
            $.each(response, function (_i, _d) {
                _d.ReportingTime = (new Date(_d.ReportingTime)).addMinutes(offset);

            });
            if ($scope.dg_boxflight_ds && $scope.dg_boxflight_ds.length > 0) {
                var rpttime = (new Date($scope.dg_boxflight_ds[0].STD)).addHours(-1);

            }


            $scope.dg_crew_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewAbs = function (fid) {
        //5-8
        if (!$rootScope.HasAccessToCrewList()) {
            $scope.dg_crew_abs_ds = [];
            return;
        }
        var archived_crews = 0;
        //if (new Date($scope.logFlight.Date) < new Date(2020, 6, 1, 0, 0, 0, 0))
        if (new Date($scope.logFlight.Date) < new Date(2022, 3, 26, 0, 0, 0, 0))
            archived_crews = 1;


        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid, archived_crews).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.RP = _d.PickupLocal;
            });
            $scope.dg_crew_abs_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewAbs2 = function (fid) {
        if (!$rootScope.HasAccessToCrewList()) {
            $scope.dg_crew_abs2_ds = [];
            return;
        }

        $scope.loadingVisible = true;
        flightService.getFlightCrew2(fid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_abs2_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getBoxFlights = function (bid, callback) {
        //nook
        var offset = -1 * (new Date()).getTimezoneOffset();

        flightService.getBoxFlights(bid).then(function (response) {
            $.each(response, function (_i, _d) {
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




            });
            $scope.dg_boxflight_ds = response;


            if (callback)
                callback();




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.dg_crew_columns = [

        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        //{ dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },




        { dataField: 'RP', caption: 'Reporting Time', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 200, },

    ];
    $scope.dg_crew_selected = null;
    $scope.dg_crew_instance = null;
    $scope.dg_crew_ds = null;
    $scope.dg_crew = {
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
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 300,// 490 

        columns: $scope.dg_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_instance)
                $scope.dg_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_selected = null;

            }
            else {
                $scope.dg_crew_selected = data;

            }
        },
        onRowPrepared: function (e) {


        },

        onRowUpdated: function (e) {

            //xoox
            // console.log(e.key);
            // console.log(e.data);
            // alert(e.key.EmployeeId + ' ' + e.key.Id);
            var dt = (new Date(e.data.RP)).toUTCString();
            //nook
            var offset = -1 * (new Date()).getTimezoneOffset();
            $scope.loadingVisible = true;
            var dto = { CrewId: e.key.CrewId, FDPId: e.key.FDPId, Date: dt, Offset: offset };
            flightService.saveReportingTime(dto).then(function (response) {
                $scope.loadingVisible = false;
                General.ShowNotify(Config.Text_SavedOk, 'success');


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },


        bindingOptions: {
            dataSource: 'dg_crew_ds',

        }
    };


    $scope.dg_boxflight_columns = [
        {
            caption: 'Flights', columns: [
                { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'FlightH', caption: 'HH', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, },
                { dataField: 'FlightM', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, },
                {
                    dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 150, alignment: 'center', format: 'HH:mm',

                },
                { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'HH:mm' },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                //  { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                //  { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
            ]
        }
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },

    ];
    $scope.dg_boxflight_selected = null;
    $scope.dg_boxflight_instance = null;
    $scope.dg_boxflight_ds = null;
    $scope.dg_boxflight = {
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
        scrolling: { mode: 'infinite', },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 200,

        columns: $scope.dg_boxflight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_boxflight_instance)
                $scope.dg_boxflight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_boxflight_selected = null;

            }
            else {
                $scope.dg_boxflight_selected = data;

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvStatusId != 1)
            //    e.rowElement.css('background', '#ffcccc');
            //  if (e.data)
            //    e.rowElement.css({ height: 100 });
        },
        onCellPrepared: function (e) {

        },




        bindingOptions: {
            dataSource: 'dg_boxflight_ds',
            // columns:'dg_crew2_columns',
        }
    };



    $scope.popup_crew_visible = false;
    $scope.popup_crew_title = 'Crew';
    $scope.popup_crew = {
        shading: true,
        width: 1100,
        height: 600, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'success', text: 'Transport', icon: 'fas fa-taxi', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
            //            //takeoff save
            //            var result = arg.validationGroup.validate();

            //            if (!result.isValid) {
            //                General.ShowNotify(Config.Text_FillRequired, 'error');
            //                return;
            //            }


            //        }


            //    }, toolbar: 'bottom'
            //},


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_crew_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            //if ($scope.flight.BoxId) {

            //    $scope.getBoxFlights($scope.flight.BoxId, function () {
            //        $scope.getCrew($scope.flight.ID);
            //    });
            //}

            $scope.getReporting($scope.flight.ID);

        },
        onHiding: function () {
            $scope.dg_crew_ds = [];

            $scope.popup_crew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_crew_visible',

            title: 'popup_crew_title',

        }
    };

    ///////////////////////////////
    $scope.getCHistory = function (fid) {



        $scope.loadingVisible = true;
        flightService.getFlightChangeHistory(fid).then(function (response) {
            $scope.loadingVisible = false;


            $scope.dg_chistory_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.dg_chistory_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yy-MMM-dd HH:mm', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
        { dataField: 'User', caption: 'User', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'NewFlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        { dataField: 'NewFromAirport', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'NewToAirport', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'OldRegister', caption: 'Old Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'NewRegister', caption: 'New Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'OldSTD', caption: 'Old STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewSTD', caption: 'New STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
        { dataField: 'OldSTA', caption: 'Old STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewSTA', caption: 'New STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
        { dataField: 'OldStatus', caption: 'Old Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        { dataField: 'NewStatus', caption: 'New Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },

        { dataField: 'OldOffBlock', caption: 'Old OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewOffBlock', caption: 'New OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },

        { dataField: 'OldTakeOff', caption: 'Old TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewTakeOff', caption: 'New TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },

        { dataField: 'OldLanding', caption: 'Old Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewLanding', caption: 'New Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },

        { dataField: 'OldOnBlock', caption: 'Old OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'NewOnBlock', caption: 'New OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },


        { dataField: 'OldFlightNumber', caption: 'Old Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        { dataField: 'OldFromAirport', caption: 'Old From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'OldToAirport', caption: 'Old To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

    ];
    $scope.dg_chistory_instance = null;
    $scope.dg_chistory_ds = null;
    $scope.dg_chistory = {
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
        height: 600,

        columns: $scope.dg_chistory_columns,
        onContentReady: function (e) {
            if (!$scope.dg_chistory_instance)
                $scope.dg_chistory_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_chistory_ds',
            //selectedRowKeys: 'selectedEmps2',
        }
    };
    $scope.popup_history_visible = false;
    $scope.popup_history_title = 'Change History';
    $scope.popup_history = {
        shading: true,
        width: 1100,
        height: 730, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'success', text: 'Transport', icon: 'fas fa-taxi', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
            //            //takeoff save
            //            var result = arg.validationGroup.validate();

            //            if (!result.isValid) {
            //                General.ShowNotify(Config.Text_FillRequired, 'error');
            //                return;
            //            }


            //        }


            //    }, toolbar: 'bottom'
            //},


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_history_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            if ($scope.dg_chistory_instance)
                $scope.dg_chistory_instance.refresh();

            $scope.getCHistory($scope.flight.ID);

        },
        onHiding: function () {
            $scope.dg_chistory_ds = [];

            $scope.popup_history_visible = false;

        },
        bindingOptions: {
            visible: 'popup_history_visible',

            title: 'popup_history_title',

        }
    };

    ////////////////////////////////
    $scope.sms = null;
    $scope.txt_sms = {
        height: 530,
        bindingOptions: {
            value: 'sms'
        }
    };
    $scope.popup_sms_visible = false;
    $scope.popup_sms_title = 'Notification';
    $scope.popup_sms = {
        shading: true,
        width: 600,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [




            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'fas fa-bell', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var nos = [];
                        $.each($scope.dg_crew_ds, function (_i, _d) {
                            //alert(_d.Name+_d.Mobile);
                            if (_d.Mobile)
                                nos.push(_d.Mobile);
                        });
                        var nos_str = nos.join(',');
                        // var text = "همکار گرامی" + "\n" + "برای مشاهده برنامه پروازی خود به پنل کاربری مراجعه کنید." + "\n" + "فلای پرشیا";
                        var text = $scope.sms;
                        notificationService.sms(text, nos_str).then(function (response) {
                            General.ShowNotify("The message sent successfully.", 'success');



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });
                        return;


                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_sms_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {
            $scope.sms = null;

            $scope.popup_sms_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sms_visible',

            title: 'popup_sms_title',

        }
    };
    ////////////////////////////////
    function printElem($elem) {

        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');

        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');

        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }
    ///////////////////////////////////
    $scope.leg1Text = "";
    $scope.leg1Value = false;
    $scope.leg1Visible = false;

    $scope.leg2Text = "";
    $scope.leg2Value = false;
    $scope.leg2Visible = false;

    $scope.leg3Text = "";
    $scope.leg3Value = false;
    $scope.leg3Visible = false;

    $scope.leg4Text = "";
    $scope.leg4Value = false;
    $scope.leg4Visible = false;

    $scope.leg5Text = "";
    $scope.leg5Value = false;
    $scope.leg5Visible = false;

    $scope.leg6Text = "";
    $scope.leg6Value = false;
    $scope.leg6Visible = false;

    $scope.leg7Text = "";
    $scope.leg7Value = false;
    $scope.leg7Visible = false;

    $scope.leg8Text = "";
    $scope.leg8Value = false;
    $scope.leg8Visible = false;

    $scope.ch_leg1 = {
        bindingOptions: {
            text: 'leg1Text',
            value: 'leg1Value',
            visible: 'leg1Visible',
        }
    };
    $scope.ch_leg2 = {
        bindingOptions: {
            text: 'leg2Text',
            value: 'leg2Value',
            visible: 'leg2Visible',
        }
    };
    $scope.ch_leg3 = {
        bindingOptions: {
            text: 'leg3Text',
            value: 'leg3Value',
            visible: 'leg3Visible',
        }
    };
    $scope.ch_leg4 = {
        bindingOptions: {
            text: 'leg4Text',
            value: 'leg4Value',
            visible: 'leg4Visible',
        }
    };
    $scope.ch_leg5 = {
        bindingOptions: {
            text: 'leg5Text',
            value: 'leg5Value',
            visible: 'leg5Visible',
        }
    };
    $scope.ch_leg6 = {
        bindingOptions: {
            text: 'leg6Text',
            value: 'leg6Value',
            visible: 'leg6Visible',
        }
    };
    $scope.ch_leg7 = {
        bindingOptions: {
            text: 'leg7Text',
            value: 'leg7Value',
            visible: 'leg7Visible',
        }
    };
    $scope.ch_leg8 = {
        bindingOptions: {
            text: 'leg8Text',
            value: 'leg8Value',
            visible: 'leg8Visible',
        }
    };
    ////////////////////////////////
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.popup_jl_visible = false;
    $scope.popup_jl_title = 'Journey Log';
    $scope.popup_jl = {
        shading: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Update', icon: 'save', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        //printElem($('#jl'));
                        //bahrami-6-2
                        $scope.popup_jledit_visible = true;

                    }


                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#jl'));
                        //var jsPDF = window.jspdf.jsPDF;


                        //var doc = new jsPDF();

                        //doc.html($('#jl').get(0), {
                        //    callback: function (doc) {
                        //        doc.save();
                        //    }
                        //});
                        //                        var doc = new jsPDF();
                        //var elementHTML = $('#jl').html();
                        //var specialElementHandlers = {
                        //    '#elementH': function (element, renderer) {
                        //        return true;
                        //    }
                        //};
                        //doc.fromHTML(elementHTML, 15, 15, {
                        //    'width': 170,
                        //    'elementHandlers': specialElementHandlers
                        //});

                        //// Save the PDF
                        //doc.save('sample-document.pdf');

                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jl_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_jl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_jl_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jl_visible',

            title: 'popup_jl_title',
            'toolbarItems[0].visible': 'IsEditable',

        }
    };

    ////////////////////////////////
    $scope.cl = {};
    $scope.scroll_cl_height = 200;
    $scope.scroll_cl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_cl_height', }
    };
    $scope.popup_cl_visible = false;
    $scope.popup_cl_title = 'Crew List';
    $scope.popup_cl = {
        shading: true,
        width: 820,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Edit', icon: 'edit', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        if ($scope.cl && $scope.cl.crews && $scope.cl.crews.length > 0) {


                            $scope.popup_cledit_visible = true;
                        }


                    }


                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#cl'));

                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_cl_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_cl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_cl_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cl_visible',

            title: 'popup_cl_title',
            'toolbarItems[0].visible': 'IsEditable',
            //'toolbarItems[1].visible': 'IsEditable',

        }
    };
    ////////////////////////////////
    $scope.popup_clnew_visible = false;
    $scope.popup_clnew_title = 'Crew List';
    $scope.popup_clnew = {
        shading: true,
        width: 820,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Edit', icon: 'edit', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        if ($scope.cl && $scope.cl.crews && $scope.cl.crews.length > 0) {
                            //kabiri
                            if ($scope.cl.crewsAll.length < 23)
                                for (var i = $scope.cl.crewsAll.length; i < 23; i++) {
                                    $scope.cl.crewsAll.push({ Position: ' ', Name: ' ' });
                                }
                            $scope.popup_cledit_visible = true;
                        }


                    }


                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#clnew'));

                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_clnew_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_cl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_clnew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_clnew_visible',

            title: 'popup_clnew_title',
            'toolbarItems[0].visible': 'IsEditable',
            //'toolbarItems[1].visible': 'IsEditable',

        }
    };
    ////////////////////////////////
    $scope.popup_clgd_visible = false;
    $scope.popup_clgd_title = 'Crew List / GD';
    $scope.popup_clgd = {
        shading: true,
        width: 820,
        height: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Crew List', icon: 'save', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        //printElem($('#clnew'));
                        var ids = [];
                        if ($scope.leg1Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg1Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg2Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg2Text + '"').FirstOrDefault();

                            ids.push(_id.ID);
                        }
                        if ($scope.leg3Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg3Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg4Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg4Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg5Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg5Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg6Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg6Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg7Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg7Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg8Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg8Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }

                        var idsStr = ids.join('_');
                        $window.open('https://api.aptaban.ir/' + 'api/xls/cl?flts=' + idsStr, '_blank');


                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'GD', icon: 'save', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        //printElem($('#clnew'));
                        //printElem($('#clnew'));
                        var ids = [];
                        if ($scope.leg1Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg1Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg2Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg2Text + '"').FirstOrDefault();

                            ids.push(_id.ID);
                        }
                        if ($scope.leg3Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg3Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg4Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg4Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg5Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg5Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg6Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg6Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg7Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg7Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }
                        if ($scope.leg8Value) {
                            var _id = Enumerable.From($scope.line).Where('$.FlightNumber=="' + $scope.leg8Text + '"').FirstOrDefault();
                            ids.push(_id.ID);
                        }

                        var idsStr = ids.join('_');
                        $window.open('https://api.aptaban.ir/' + 'api/xls/gd?flts=' + idsStr, '_blank');
                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_clnew_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_cl_height = 300;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_clgd_visible = false;

        },
        bindingOptions: {
            visible: 'popup_clgd_visible',

            title: 'popup_clgd_title',
            //'toolbarItems[0].visible': 'IsEditable',
            //'toolbarItems[1].visible': 'IsEditable',

        }
    };
    /////////////////////////////////
    $scope.popup_cltrans_visible = false;
    $scope.popup_cltrans_title = 'Crew List (Transport)';
    $scope.popup_cltrans = {
        shading: true,
        width: 820,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Edit', icon: 'edit', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        if ($scope.cl && $scope.cl.crews && $scope.cl.crews.length > 0) {
                            $scope.popup_cledit_visible = true;
                        }


                    }


                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#cltrans'));

                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_cltrans_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_cl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_cltrans_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cltrans_visible',

            title: 'popup_cltrans_title',


        }
    };
    /////////////////////////////////
    $scope.gd_std_time = {
        bindingOptions: {
            value: 'cl.std_time'
        }
    };
    $scope.gd_sta_time = {
        bindingOptions: {
            value: 'cl.sta_time'
        }
    };
    $scope.gd_route = {
        bindingOptions: {
            value: 'cl.route'
        }
    };
    $scope.gd_flightNo = {
        bindingOptions: {
            value: 'cl.no'
        }
    };
    $scope.gd_reg = {
        bindingOptions: {
            value: 'cl.regs'
        }
    };
    $scope.gd_type = {
        bindingOptions: {
            value: 'cl.actype'
        }
    };
    //kabiri
    $scope.gd_remark = {
        height: 60,
        bindingOptions: {
            value: 'cl.remark'
        }
    };
    $scope.gd_user = {

        bindingOptions: {
            value: 'cl.user'
        }
    };
    $scope.popup_cledit_visible = false;
    $scope.popup_cledit_title = 'GD';
    $scope.popup_cledit = {
        shading: true,
        width: 700,
        //kabiri
        height: 770,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_cledit_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            // $scope.scroll_cl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {
            $scope.dg_cledit_instance.refresh();

        },
        onHiding: function () {

            //kabiri

            $scope.cl.crewsAll = Enumerable.From($scope.cl.crewsAll).Where('$.Position.trim()').ToArray();

            $scope.generateGDTables($scope.cl.crewsAll);
            $scope.popup_cledit_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cledit_visible',

            title: 'popup_cledit_title',


        }
    };
    //kabiri
    $scope.dg_cledit_columns = [

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: true, },
        { dataField: 'PositionId', caption: 'Pos', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 100, },
        {
            dataField: 'Position', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 140,
            lookup: {
                dataSource: $scope.OrderGD,

            }
        },
        { dataField: 'PID', caption: 'ID No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 120, },


    ];
    $scope.dg_cledit_selected = null;
    $scope.dg_cledit_instance = null;
    $scope.dg_cledit_ds = null;
    $scope.dg_cledit = {
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
        editing: {
            allowAdding: false,
            allowDeleting: true,
            allowUpdating: true,
            confirmDelete: true,
            mode: 'cell',
        },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 350,// $(window).height() - 250,// 490 

        columns: $scope.dg_cledit_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cledit_instance)
                $scope.dg_cledit_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_cledit_selected = null;

            }
            else {
                $scope.dg_cledit_selected = data;

            }
        },


        bindingOptions: {
            //kabiri
            dataSource: 'cl.crewsAll',

        }
    };
    ////////////////////////////////
    //bahrami-6-2
    $scope.popup_jledit_visible = false;
    $scope.popup_jledit_title = 'Crew List';
    $scope.popup_jledit = {
        shading: true,
        width: 700,
        height: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [







            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jledit_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            // $scope.scroll_cl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {
            $scope.dg_jledit_instance.refresh();

        },
        onHiding: function () {


            $scope.popup_jledit_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jledit_visible',

            title: 'popup_jledit_title',


        }
    };


    $scope.OrderCockpit = ['IP', 'CPT', 'FO', 'SO', 'CHECK', 'OBS', 'DH'];
    $scope.OrderCabin = ['ISCCM', 'SCCM', 'CCM', 'CHECK', 'OBS', 'DH'];
    $scope.refreshJlCrews = function () {
        var cockpit = [];
        var cabin = [];
        $.each($scope.jl.crews, function (_i, _d) {
            if (_d.cockpit.Name)
                cockpit.push(JSON.parse(JSON.stringify(_d.cockpit)));
            if (_d.cabin.Name)
                cabin.push(JSON.parse(JSON.stringify(_d.cabin)));

        });
        cockpit = Enumerable.From(cockpit).OrderBy(function (x) { var idx = $scope.OrderCockpit.indexOf(x.Position); return idx == -1 ? 1000 : idx; }).ToArray();
        cabin = Enumerable.From(cabin).OrderBy(function (x) { var idx = $scope.OrderCabin.indexOf(x.Position); return idx == -1 ? 1000 : idx; }).ToArray();
        $scope.jl.crews = [];
        var j = 8;
        for (var i = 0; i < j; i++) {
            var ca = {};
            if (cabin.length > i)
                ca = cabin[i];

            var co = {};
            if (cockpit.length > i)
                co = cockpit[i];

            //////////////////////////////////
            if (co.Position == "Captain")
                co.Position = "CPT";
            // if (co.JobGroup == "TRE" || co.JobGroup == "TRI" || co.JobGroup == "LTC")

            // co.Position = 'IP';
            if (co.IsPositioning)
                co.Position = 'DH';
            //////////////////////////////////


            if (ca.Position && ca.Position == 'Purser')
                ca.Position = 'SCCM';
            if (ca.Position && ca.Position == 'FA')
                ca.Position = 'CCM';
            if (ca.JobGroup == "ISCCM")
                ca.Position = "ISCCM";

            if (ca.IsPositioning)
                ca.Position = 'DH';

            // bahrami-6-2
            if (!ca.Name) { ca.Name = ''; ca.Position = ''; }
            if (!co.Name) { co.Name = ''; co.Position = ''; }
            $scope.jl.crews.push({ cabin: ca, cockpit: co });


        }
    };
    $scope.dg_jledit_columns = [

        { dataField: 'Name', caption: 'Cockpit', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: true, },
        {
            dataField: 'Position', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 135,
            lookup: {
                dataSource: ['IP', 'CPT', 'FO', 'SO', 'CHECK', 'OBS', 'DH'],

            }
        },
        // { dataField: 'PID', caption: 'ID No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 120, },

    ];
    $scope.dg_jledit_selected = null;
    $scope.dg_jledit_instance = null;
    $scope.dg_jledit_ds = null;
    $scope.dg_jledit = {
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
        editing: {
            allowAdding: false,
            allowDeleting: true,
            allowUpdating: true,
            confirmDelete: true,
            mode: 'row',
        },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 270,// $(window).height() - 250,// 490 

        columns: $scope.dg_jledit_columns,
        onContentReady: function (e) {
            if (!$scope.dg_jledit_instance)
                $scope.dg_jledit_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_jledit_selected = null;

            }
            else {
                $scope.dg_jledit_selected = data;

            }
        },
        onRowRemoved: function (e) {

            var rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cockpit.Name == e.data.Name && x.cockpit.Position == e.data.Position }).FirstOrDefault();
            if (rowcockpit) {

                rowcockpit.cockpit.Name = ''; rowcockpit.cockpit.Position = '';
            }
            $scope.refreshJlCrews();

        },
        onRowUpdating: function (e) {

            var rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cockpit.Name == e.oldData.Name && x.cockpit.Position == e.oldData.Position }).FirstOrDefault();
            if (!rowcockpit) {

                rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cockpit.Name == '' && x.cockpit.Position == '' }).FirstOrDefault();
                rowcockpit.cockpit = { Name: e.newData.Name, Position: e.newData.Position };


            }
            else {
                rowcockpit.cockpit.Name = e.newData.Name ? e.newData.Name : rowcockpit.cockpit.Name;
                rowcockpit.cockpit.Position = e.newData.Position ? e.newData.Position : rowcockpit.cockpit.Position;
            }
            $scope.refreshJlCrews();
        },

        bindingOptions: {
            dataSource: 'jl.crewscockpit',

        }
    };

    $scope.dg_jledit_columns2 = [

        { dataField: 'Name', caption: 'Cabin', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: true, },
        {
            dataField: 'Position', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 135,
            lookup: {
                dataSource: ['ISCCM', 'SCCM', 'CCM', 'CHECK', 'OBS', 'DH'],

            }
        },
        // { dataField: 'PID', caption: 'ID No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 120, },

    ];
    $scope.dg_jledit_selected2 = null;
    $scope.dg_jledit_instance2 = null;
    $scope.dg_jledit_ds2 = null;
    $scope.dg_jledit2 = {
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
        editing: {
            allowAdding: false,
            allowDeleting: true,
            allowUpdating: true,
            confirmDelete: true,
            mode: 'row',
        },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 270,// $(window).height() - 250,// 490 

        columns: $scope.dg_jledit_columns2,
        onContentReady: function (e) {
            if (!$scope.dg_jledit_instance2)
                $scope.dg_jledit_instance2 = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_jledit_selected2 = null;

            }
            else {
                $scope.dg_jledit_selected2 = data;

            }
        },
        onRowRemoved: function (e) {

            var rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cabin.Name == e.data.Name && x.cabin.Position == e.data.Position }).FirstOrDefault();
            if (rowcockpit) {

                rowcockpit.cabin.Name = ''; rowcockpit.cabin.Position = '';
            }
            $scope.refreshJlCrews();

        },
        onRowUpdating: function (e) {

            var rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cabin.Name == e.oldData.Name && x.cabin.Position == e.oldData.Position }).FirstOrDefault();
            if (!rowcockpit) {

                rowcockpit = Enumerable.From($scope.jl.crews).Where(function (x) { return x.cabin.Name == '' && x.cabin.Position == '' }).FirstOrDefault();
                rowcockpit.cabin = { Name: e.newData.Name, Position: e.newData.Position };


            }
            else {
                rowcockpit.cabin.Name = e.newData.Name ? e.newData.Name : rowcockpit.cabin.Name;
                rowcockpit.cabin.Position = e.newData.Position ? e.newData.Position : rowcockpit.cabin.Position;
            }
            $scope.refreshJlCrews();
        },

        bindingOptions: {
            dataSource: 'jl.crewscabin',

        }
    };
    ////////////////////////////////
    $scope.popup_gd_visible = false;
    $scope.popup_gd_title = 'GD';
    $scope.popup_gd = {
        shading: true,
        width: 1100,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_gd_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

            $("#Spreadsheet").ejSpreadsheet({
                importSettings: {
                    importMapper: window.baseurl + "api/Spreadsheet/Import"
                },
                // exportSettings: {
                //     excelUrl: window.baseurl + "api/Spreadsheet/ExcelExport",
                //     csvUrl: window.baseurl + "api/Spreadsheet/CsvExport",
                //     pdfUrl: window.baseurl + "api/Spreadsheet/PdfExport"
                // },
                //sheets: [{
                // rangeSettings: [{ dataSource: window.defaultData }]
                //}],
                //loadComplete: "loadComplete",
                // openFailure: "openfailure"
            });
        },
        onHiding: function () {


            $scope.popup_gd_visible = false;

        },
        bindingOptions: {
            visible: 'popup_gd_visible',

            title: 'popup_gd_title',

        }
    };
    ///////////////////////////////
    $scope.scrollGrid = function (data) {
        //var scrollable = $scope.dg_flights_instance.getView('rowsView')._scrollable;
        //var rowindex = $scope.dg_flights_instance.getRowIndexByKey(data);
        //var selectedRowElements = $scope.dg_flights_instance.getRowElement(rowindex);
        //scrollable.scrollToElement(selectedRowElements);
    };
    $scope.scrollGantt = function (data) {

        var df = new Date(data.STD);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    //dlurahm
    $scope.scrollGantt2 = function (data) {

        var df = new Date(data);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    $scope.scrollGanttX = function (x) {


        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(x);
    };
    $scope.scrollGanttNow = function () {
        var d = new Date(Date.now());
        var df = new Date(d);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };

    $scope.scrollGanttToday = function () {
        var d = new Date(Date.now());
        d.setHours(5, 30, 0, 0);
        var df = new Date(d);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    $scope.scrollGanttFirst = function (df) {
        var d = new Date(df);
        d.setHours(5, 30, 0, 0);
        var df = new Date(d);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };



    //////////////////////////////////
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
    /////////gantt//////////////////////////////
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.scroll = 0;


    ///////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/customer/' + Config.CustomerId;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "Id", desc: false }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };

    $scope.doRefresh = false;
    $scope.filters = [];
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };
    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);


    }
    /////////////////////////////
    $scope.hideButtons = function () {
        $scope.IsDepartureDisabled = true;
        $scope.IsArrivalDisabled = true;
        return;
        $scope.$apply(function () {
            $scope.offBlockVisible = false;
            $scope.takeOffVisible = false;
            $scope.landingVisible = false;
            $scope.onBlockVisible = false;
            $scope.IsDepartureVisible = false;
            $scope.IsArrivalVisible = false;


            $scope.IsCancelVisible = false;
        });
    };
    $scope.hideButtons2 = function () {
        $scope.IsDepartureDisabled = true;
        $scope.IsArrivalDisabled = true;
        return;

        $scope.offBlockVisible = false;
        $scope.takeOffVisible = false;
        $scope.landingVisible = false;
        $scope.onBlockVisible = false;
        $scope.IsDepartureVisible = false;
        $scope.IsArrivalVisible = false;
        $scope.IsDepartureDisabled = true;
        $scope.IsArrivalDisabled = true;
        $scope.IsCancelVisible = false;

    };

    $scope.showButtons = function (item) {
        $scope.IsDepartureDisabled = false;
        $scope.IsArrivalDisabled = false;

    };
    $scope.showButtons2 = function (item) {
        $scope.IsDepartureDisabled = false;
        $scope.IsArrivalDisabled = false;


    };
    $scope.weatherUpdateTime = null;
    $scope.weatherUpdateTimePassed = 0;
    $scope.AirportWeatherVisible = false;
    $scope.AirportWeather = {
        currently: {},
        hourly: {}
    };
    $scope.FromWeather = {
        currently: {}
    };
    $scope.FromWeatherVisible = true;
    $scope.ToWeather = { currently: {} };
    $scope.ToWeatherVisible = true;
    $scope.getIcon = function (weather) {
        if (!weather)
            return '';

        return weather.currently.icon + ' wicon';
    };
    $scope.getIcon2 = function (str) {

        return str + ' wicon';
    };
    $scope.prepareWeather = function (weather) {

        var deg = 90 + Number(weather.currently.windBearing);
        weather.latitude = Number(weather.latitude).toFixed(4);
        weather.longitude = Number(weather.longitude).toFixed(4);
        weather.currently.windDeg = 'rotate(' + deg + 'deg)';
        weather.currently.windPoint = 'Winds from the ' + Weather.getCompassPoint(Number(weather.currently.windBearing));
        weather.currently.humidity = (Number(weather.currently.humidity) * 100).toFixed(1);
        weather.currently.cloudCover = (Number(weather.currently.cloudCover) * 100).toFixed(1);
        weather.currently.visibility = (Number(weather.currently.visibility) * 1000).toFixed(0);
        if (weather.hourly) {
            weather.hourly.h1 = {};
            weather.hourly.h2 = {};
            weather.hourly.h3 = {};
            weather.hourly.h4 = {};
            //  alert(formatHourAMPM($scope.weatherUpdateTime));
            for (var i = 1; i <= 4; i++) {
                var wh = weather.hourly.data[i];
                var hour = null;

                switch (i) {
                    case 1:
                        hour = weather.hourly.h1;
                        break;
                    case 2:
                        hour = weather.hourly.h2;
                        break;
                    case 3:
                        hour = weather.hourly.h3;
                        break;
                    case 4:
                        hour = weather.hourly.h4;
                        break;
                    default:
                        break;
                }

                hour.time = formatHourAMPM(new Date(wh.time * 1000));
                hour.icon = wh.icon;
                hour.summary = wh.summary;
                hour.temperature = wh.temperature;
                hour.windtotal = wh.windSpeed + ' ' + Weather.getCompassPoint(Number(wh.windBearing));
                hour.visibility = Number(wh.visibility) * 1000;
                hour.cloudCover = (Number(wh.cloudCover) * 100).toFixed(1);

            }
        }

    };
    $scope.setWeather = function () {

        if (!$scope.flight)
            return;




        //$scope.ToWeatherVisible = true;
        //$scope.FromWeatherVisible = true;
        //var fw = JSON.parse(Flight.Weather1);
        //$scope.FromWeather = fw;
        //$scope.prepareWeather($scope.FromWeather);

        //var tw = JSON.parse(Flight.Weather2);
        //$scope.ToWeather = tw;
        //$scope.prepareWeather($scope.ToWeather);




        //return;
        $scope.ToWeatherVisible = false;
        $scope.FromWeatherVisible = false;
        var dtime = (new Date($scope.flight.STD)).toUTCDateTimeDigits();
        var atime = (new Date($scope.flight.STA)).toUTCDateTimeDigits();
        weatherService.getFlight($scope.flight.ID, -1).then(function (response) {

            $scope.FromWeather = response;
            $scope.prepareWeather($scope.FromWeather);
            $scope.FromWeatherVisible = true;
            weatherService.getFlight($scope.flight.ID, -2).then(function (response2) {

                $scope.ToWeather = response2;
                $scope.prepareWeather($scope.ToWeather);
                $scope.ToWeatherVisible = true;
            }, function (err) { General.ShowNotify(err.message, 'error'); });
        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };



    $scope.selectedFlights = [];
    $scope.clearSelectedFlights = function () {
        $scope.selectedFlights = [];
        $scope.hideButtons();
    };
    $scope.doGridSelectedChanged = true;
    $scope.addSelectedFlight = function (item) {
        //var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        //if (exist)
        //    $scope.selectedFlights = Enumerable.From($scope.selectedFlights).Where("$.taskId!=" + item.taskId).ToArray();
        //else
        //    $scope.selectedFlights.push(item);
        $scope.removeUpdatedFlights(item);
        $scope.hideButtons();
        var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();

        if (!exist) {
            //noosk
            $scope.selectedFlights = [];
            $scope.selectedFlights.push(item);
            $scope.flight = item;

            $scope.showButtons(item);
            if ($scope.popup_inf_visible)
                $scope.setWeather();

            $scope.doGridSelectedChanged = false;


            $scope.showLog(true);
        }
        else {
            $scope.selectedFlights = [];

            $scope.$apply(function () {
                $scope.popup_inf_visible = false;
            });
        }


    };
    $scope.addSelectedFlight2 = function (item) {
        $scope.removeUpdatedFlights(item);

        $scope.hideButtons2();
        var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        if (!exist) {
            $scope.selectedFlights = [];
            $scope.selectedFlights.push(item);
            $scope.flight = item;

            $scope.showButtons2(item);
            if ($scope.popup_inf_visible)
                $scope.setWeather();

        }
        else {
            $scope.selectedFlights = [];


            $scope.popup_inf_visible = false;

        }


    };
    $scope.selectedResource = null;
    $scope.setSelectedResource = function (data) {
        var index = data.index;
        if ($scope.selectedResource && $scope.setSelectedResource.index == index) {
            $scope.selectedResource = null;
            $("#resourceGanttba").data("ejGantt").clearSelection(index);

        }
        else

            $scope.selectedResource = { index: data.index, item: data.item };
    };
    $scope.ganttCreated = false;
    //$scope.renderTopTimeHeader = function () {

    //    var _whcs = $('.e-schedule-week-headercell-content');
    //    $.each(_whcs, function (_i, _d) {
    //        var whcs = $(_d);
    //        var oldwc = whcs.html().split('(')[0];
    //        var year = Number(oldwc.split(',')[1]);
    //        var prts = (oldwc.split(',')[0]).split(' ');
    //        var mo = prts[1];
    //        var da = prts[3];
    //        var wdate = new Date(year + "/" + mo + "/" + da);
    //        var newwc = oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
    //        whcs.html(newwc);
    //    });
    //};
    //$scope.renderTimeHeader = function () {

    //    var dhcs = $('.e-schedule-day-headercell-content');
    //    //joosk

    //    $.each(dhcs, function (_i, _d) {
    //        var $d = $(_d);
    //        var oldc = $d.html();


    //        var $dhour = Number($d.html());
    //        var spanlen = $d.find('span').length;
    //        if (spanlen > 0) {
    //            oldc = $($d.find('span')[1]).html();
    //            $dhour = Number(oldc);
    //        }
    //        var sech = 0;
    //        if (!$scope.IsUTC)
    //            sech = getUTCHour($dhour);
    //        else
    //            sech = getUTCHour($dhour);
    //        var newc = "<span style='font-size:10px;display:block;color:gray;text-align:left;padding-left:2px'>" + sech + "</span>"+"<span style='font-size:13px;display:block;position:relative;top:-5px'>" + oldc + "</span>" ;
    //        $d.html(newc);

    //    });




    //};
    $scope._days = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
    $scope._hasDay = function () {

    };
    //$scope.renderTopTimeHeader = function () {

    //    var _whcs = $('.e-schedule-week-headercell-content');
    //    $.each(_whcs, function (_i, _d) {
    //        var whcs = $(_d);
    //        // console.log('renderTopTimeHeader');
    //        //console.log(whcs.html());

    //        var oldwc = isNaN((whcs.html().split('(')[0]).substring(0, 1)) ? (whcs.html().split('(')[0]).substring(3) : whcs.html().split('(')[0];

    //        var year = Number(oldwc.split('-')[2]);
    //        var prts = (oldwc.split('-'));
    //        var mo = prts[1];
    //        var da = prts[0];

    //        var wdate = new Date(year + "/" + mo + "/" + da);
    //        persianDate.toLocale('en');
    //        var newwc = moment(wdate).format('dd') + " " + oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
    //        whcs.html(newwc);
    //    });
    //};
    $scope.renderTopTimeHeader = function () {

        var _whcs = $('.e-schedule-week-headercell-content');
        $.each(_whcs, function (_i, _d) {
            var whcs = $(_d);
            // console.log('renderTopTimeHeader');
            //console.log(whcs.html());

            var oldwc = isNaN((whcs.html().split('(')[0]).substring(0, 1)) ? (whcs.html().split('(')[0]).substring(3) : whcs.html().split('(')[0];

            var year = Number(oldwc.split('-')[2]);
            var prts = (oldwc.split('-'));
            var mo = prts[1];
            var da = prts[0];

            //var wdate = new Date(year + "/" + mo + "/" + da);
            var mmm = ("JanFebMarAprMayJunJulAugSepOctNovDec").indexOf(mo) / 3;

            var wdate = new Date(year, mmm, da);
            persianDate.toLocale('en');
            var newwc = moment(wdate).format('dd') + " " + oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
            whcs.html(newwc);
        });
    };
    function getLocalHour(hour) {
        var dt = new Date();
        dt.setHours(hour, 0, 0, 0);
        dt = dt.addMinutes(270 + 60);
        var hh = dt.getHours();
        var mi = dt.getMinutes();
        return ((hh > 9 ? '' : '0') + hh) + ":" + ((mi > 9 ? '' : '0') + mi);
    }
    $scope.renderTimeHeader = function () {

        var dhcs = $('.e-schedule-day-headercell-content');
        var dhcwidth = dhcs.width();
        //console.log('dhcwidth');
        //console.log(dhcwidth);

        $.each(dhcs, function (_i, _d) {
            var $d = $(_d);
            var oldc = $d.html();


            var $dhour = Number($d.html());
            var spanlen = $d.find('span').length;
            if (spanlen > 0) {
                oldc = $($d.find('span')[1]).html();
                $dhour = Number(oldc);
            }
            var tleft = 2;
            if ($scope.doUTC)
                tleft = dhcwidth - 30;
            var sech = 0;

            if (/*!$scope.IsUTC*/$scope.doUTC)
                sech = getLocalHour($dhour);
            //sech = getUTCHour($dhour);
            else
                sech = getUTCHour($dhour);
            var newc = "<span style='font-size:10px;display:block;color:gray;text-align:left;padding-left:" + tleft + "px'>" + sech + "</span>" + "<span style='font-size:13px;display:block;position:relative;top:-5px'>" + oldc + "</span>";
            $d.html(newc);

        });




    };


    $scope.timeCellWidth = 0;
    $scope.selectedDate = null;
    $scope.currentScroll = null;
    $scope.firstCreate = true;





    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });





    ////////////////////////////////////////
    //atinote
    /////////////////////////////////////

    $scope.dsNotificationType = [
        { Id: 10010, Title: 'Pickup Time Notification' },
        { Id: 10011, Title: 'New Pickup Time Notification' },
        { Id: 10012, Title: 'Pickup Stand by Notification' },
        { Id: 10013, Title: 'اعلام تاخیر' },
        { Id: 10017, Title: 'اعلام حضور' },
    ];

    $scope.dsNotificationType2 = [
        { Id: 10014, Title: 'Cancelling Notification' },
        { Id: 10015, Title: 'Delay Notification' },
        { Id: 10016, Title: 'Operation Notification' },

    ];

    //goh10
    $scope.transportTime = null;
    $scope.time_transportTime = {
        type: "time",
        width: '100%',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (e) {
            $scope.buildPickupMessage();
        },
        bindingOptions: {
            value: 'transportTime',

        }
    };
    $scope.selectedNotificationTypeId = -1;
    $scope.buildPickupMessage = function () {
        if ($scope.Notify.TypeId == -1)
            $scope.Notify.Message = "";

        switch ($scope.Notify.TypeId) {
            case 10010:
                if ($scope.transportTime)
                    $scope.Notify.Message = "Dear Flt.Crew, Your pickup time for Flt " + $scope.flight.FlightNumber + " is " + "#Time"/*moment(new Date($scope.transportTime)).format('HH:mm')*/ + " . Transport";
                break;
            case 10011:
                if ($scope.transportTime)
                    $scope.Notify.Message = "Dear Flt.Crew, Your new pickup time for Flt " + $scope.flight.FlightNumber + " is " + "#Time"/*moment(new Date($scope.transportTime)).format('HH:mm')*/ + " . Transport";
                break;
            case 10012:

                $scope.Notify.Message = "Dear Flt.Crew, Your Flt " + $scope.flight.FlightNumber + " is Stand By . Transport";
                break;
            case 10013:

                $scope.Notify.Message = "با سلام و احترام، به استحضار می رساند پرواز شماره (" + $scope.flight.FlightNumber + ") به مقصد (" + $scope.flight.ToAirportIATA + ")  تا اطلاع بعدی تاخیر دارد لطفاً تا دریافت تایم جدید تامل فرمایید . با تشکر واحد ترانسپورت";
                break;

            case 10017:

                //$scope.Notify.Message = "با سلام و احترام، به استحضار می رساند پرواز شماره (" + $scope.flight.FlightNumber + ") به مقصد (" + $scope.flight.ToAirportIATA + ")  تا اطلاع بعدی تاخیر دارد لطفاً تا دریافت تایم جدید تامل فرمایید . با تشکر واحد ترانسپورت";
                $scope.Notify.Message = "با سلام و احترام، کرو پرواز شماره "
                    + $scope.flight.FlightNumber
                    + " "
                    + "زمان حضور شما در ترمینال ساعت "
                    + "#Time"
                    + " "
                    + "می باشد";
                break;
            default: break;

        }
    };
    $scope.sb_notification = {
        dataSource: $scope.dsNotificationType,
        showClearButton: false,
        searchEnabled: false,

        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onValueChanged: function (e) {
            $scope.buildPickupMessage();
        },
        bindingOptions: {
            value: 'Notify.TypeId',

        },


    };
    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notify Pickup Time';
    $scope.popup_notify = {

        fullScreen: false,
        showTitle: true,
        height: 600,
        width: 1200,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (e) {
                        $scope.refreshSMSStatus();
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check', validationGroup: 'notmessage', onClick: function (e) {
                        $scope.dg_emp_instance.saveEditData().then(function () {
                            //**************************
                            var result = e.validationGroup.validate();
                            if (!result.isValid) {
                                General.ShowNotify(Config.Text_FillRequired, 'error');
                                return;
                            }
                            if (!$scope.recs || $scope.recs.length == 0) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }

                            $scope.Notify.ObjectId = -1;
                            $scope.Notify.FlightId = $scope.flight.ID;
                            $scope.Notify.Message = $scope.Notify.Message.replace(/\r?\n/g, '<br />');
                            var temp = Enumerable.From($scope.recs).Select('{EmployeeId:$.CrewId,Name:$.Name,RP:$.RP,FDPItemId:$.FDPItemId}').ToArray();
                            if ($scope.Notify.TypeId == 10012 || $scope.Notify.TypeId == 10013) {
                                $.each($scope.recs, function (_i, _d) {
                                    _d.RP = null;

                                });
                            }
                            $.each(temp, function (_i, _d) {
                                $scope.Notify.Employees.push(_d.EmployeeId);
                                $scope.Notify.Names.push(_d.Name);
                                //karo
                                if ($scope.Notify.TypeId == 10012 || $scope.Notify.TypeId == 10013)
                                    $scope.Notify.Dates.push(null);
                                else
                                    $scope.Notify.Dates.push(_d.RP ? (new Date(_d.RP)).toUTCString() : null);
                                $scope.Notify.FDPs.push(_d.FDPItemId);
                            });
                            console.log($scope.Notify);
                            //$scope.Notify.TypeId = $scope.selectedNotificationTypeId;
                            //$scope.Notify.Employees=  Enumerable.From($scope.selectedEmployees).Select('$.EmployeeId').ToArray();
                            $scope.Notify.SenderName = $rootScope.userName;
                            $scope.loadingVisible = true;
                            notificationService.notify2($scope.Notify).then(function (response) {

                                $scope.loadingVisible = false;
                                $.each(response, function (_i, _d) {
                                    var row = Enumerable.From($scope.dg_emp_ds).Where('$.CrewId==' + _d.Id).FirstOrDefault();
                                    if (row) {
                                        row.RefId = _d.Ref;
                                        row.Status = _d.Status;
                                        row.Message = _d.Message;
                                        row.TypeStr = _d.TypeStr;
                                    }

                                });
                                //$scop.dg_emp_instance.refresh();

                                General.ShowNotify(Config.Text_SavedOk, 'success');

                                //$scope.Notify = {
                                //    ModuleId: $rootScope.moduleId,
                                //    TypeId: 10010,
                                //    FlightId:null,
                                //    SMS: true,
                                //    Email: true,
                                //    App: true,
                                //    Message: null,
                                //    CustomerId: Config.CustomerId,
                                //    SenderId: null,
                                //    Employees: [],
                                //    Dates:[],
                                //    Names: [],
                                //    FDPs:[],
                                //};
                                $scope.Notify.Employees = [];
                                $scope.Notify.Dates = [];
                                $scope.Notify.Names = [];
                                $scope.Notify.FDPs = [];


                                // $scope.popup_notify_visible = false;
                                $scope.start();
                                //***************************
                            });




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {

            $scope.loadingVisible = true;
            notificationService.getPickupHistory($scope.flight.ID).then(function (response) {

                $scope.loadingVisible = false;
                var ds = Enumerable.From($scope.dg_crew_abs_ds).ToArray();


                $scope.dg_emp_ds = ds;
                $.each($scope.dg_emp_ds, function (_i, _d) {
                    _d.RefId = null;
                    _d.Status = null;
                    _d.RP = null;
                    var row = Enumerable.From(response).Where('$.CrewId==' + _d.CrewId).FirstOrDefault();
                    if (row) {
                        _d.RefId = row.RefId;
                        _d.Status = row.Status;
                        _d.RP = row.PickupLocal;
                        _d.TypeStr = row.TypeStr;
                        _d.Message = row.Message;
                    }
                });


                if ($scope.flightOffBlock2)
                    $scope.transportTime = new Date($scope.flightOffBlock2);
                else
                    $scope.transportTime = new Date($scope.flight.STD);

                $scope.selectedNotificationTypeId = 10010;



            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });





        },
        onHiding: function () {
            $scope.stop();
            $scope.dg_emp_instance.clearSelection();
            $scope.selectedNotificationTypeId = -1;
            $scope.Notify = {
                ModuleId: $rootScope.moduleId,
                TypeId: -1,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Dates: [],
                Names: [],
                FDPs: [],
            };
            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //dlusabz
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',


        }
    };

    ////////////////////////////////

    $scope.selectedNotificationTypeId2 = -1;
    $scope.buildMessage = function () {
        if ($scope.Notify2.TypeId == -1)
            $scope.Notify2.Message = "";

        switch ($scope.Notify2.TypeId) {
            //cancel
            case 10014:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is canceled.\n" + $rootScope.userName;
                break;
            //delay
            case 10015:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is delayed.\n"
                    + "New Dep:" + $scope.momenttime($scope.flightOffBlock2) + "\n" + $rootScope.userName;
                break;
            case 10016:

                $scope.Notify2.Message = "Dear #Crew,\n";
                break;

            default: break;

        }
    };
    $scope.sb_notification2 = {
        dataSource: $scope.dsNotificationType2,
        showClearButton: false,
        searchEnabled: false,

        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onValueChanged: function (e) {
            $scope.buildMessage();
        },
        bindingOptions: {
            value: 'Notify2.TypeId',
            disabled: 'freeSMS',

        },


    };
    $scope.dsNotificationType2 = [
        { Id: 10014, Title: 'Cancelling Notification' },
        { Id: 10015, Title: 'Delay Notification' },
        { Id: 10016, Title: 'Operation Notification' },

    ];
    $scope.Notify2 = {
        ModuleId: 3,
        TypeId: -1,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
        Dates: [],
        FDPs: [],
        Names2: [],
        Mobiles2: [],
        Messages2: [],
    };
    $scope.txt_MessageNotify2 = {
        hoverStateEnabled: false,
        height: 100,

        bindingOptions: {
            value: 'Notify2.Message',
            disabled: 'Notify2.TypeId!=10016'

        }
    };
    $scope.dg_emp2_columns = [

        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


    ];
    $scope.dg_emp3_columns = [

        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },



    ];
    $scope.dg_history_columns = [

        //{ dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'TypeStr', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 500 },

        { dataField: 'RefId', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DateSent', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120, /*format: 'EEE MM-dd'*/ format: 'MM-dd HH:mm', sortIndex: 0, sortOrder: "desc" },
        { dataField: 'Sender', caption: 'Sender', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },

    ];

    $scope.dg_emp2_selected = null;
    $scope.selectedEmps2 = null;
    $scope.dg_emp2_instance = null;
    $scope.dg_emp2_ds = null;
    $scope.dg_emp2 = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: 310,

        columns: $scope.dg_emp2_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp2_instance)
                $scope.dg_emp2_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'CrewId',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_crew_abs_ds',
            selectedRowKeys: 'selectedEmps2',
        }
    };


    $scope.dg_emp3_selected = null;
    $scope.selectedEmps3 = null;
    $scope.dg_emp3_instance = null;
    $scope.dg_emp3_ds = null;
    $scope.dg_emp3 = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: 310,

        columns: $scope.dg_emp3_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp3_instance)
                $scope.dg_emp3_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_emp3_ds',
            selectedRowKeys: 'selectedEmps3',
        }
    };

    $scope.dg_history_instance = null;
    $scope.dg_history_ds = null;
    $scope.dg_history = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        height: 545,

        columns: $scope.dg_history_columns,
        onContentReady: function (e) {
            if (!$scope.dg_history_instance)
                $scope.dg_history_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_history_ds',
            //selectedRowKeys: 'selectedEmps2',
        }
    };


    ///////////////////////////////
    $scope.msgrec = null;
    $scope.text_msgrec = {
        placeholder: 'Receiver',
        bindingOptions: {
            value: 'msgrec'
        }
    }

    $scope.msgno = null;
    $scope.text_msgno = {
        placeholder: 'Mobile',
        bindingOptions: {
            value: 'msgno'
        }
    }

    ////////////////////////////
    $scope.popup_notify2_visible = false;
    $scope.popup_notify2_title = 'Notify Crew';
    $scope.popup_notify2 = {

        fullScreen: false,
        showTitle: true,
        height: 700,
        width: 1200,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (e) {
                        $scope.refreshSMSStatus2();
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check', validationGroup: 'notmessage2', onClick: function (e) {
                        ////////////////


                        /////////////////////
                        if (!$scope.freeSMS) {
                            var result = e.validationGroup.validate();
                            if (!result.isValid) {
                                General.ShowNotify(Config.Text_FillRequired, 'error');
                                return;
                            }
                            if ((!$scope.selectedEmps2 || $scope.selectedEmps2.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }
                            var recs = Enumerable.From($scope.dg_crew_abs_ds).Where(function (x) { return $scope.selectedEmps2.indexOf(x.CrewId) != -1; }).OrderBy('$.Name').ToArray();
                            if ((!recs || recs.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }

                            $scope.Notify2.ObjectId = -1;
                            $scope.Notify2.FlightId = $scope.flight.ID;

                            $scope.Notify2.Message = $scope.Notify2.Message.replace(/\r?\n/g, '<br />');
                            var temp = Enumerable.From(recs).Select('{EmployeeId:$.CrewId,Name:$.Name, FDPItemId:$.FDPItemId}').ToArray();

                            $.each(temp, function (_i, _d) {
                                $scope.Notify2.Employees.push(_d.EmployeeId);
                                $scope.Notify2.Names.push(_d.Name);
                                //karo

                            });



                            $scope.Notify2.SenderName = $rootScope.userName;
                            $scope.loadingVisible = true;
                            notificationService.notifyFlight($scope.Notify2).then(function (response) {



                                General.ShowNotify(Config.Text_SavedOk, 'success');


                                $scope.Notify2.Employees = [];
                                $scope.Notify2.Dates = [];
                                $scope.Notify2.Names = [];
                                $scope.Notify2.FDPs = [];

                                ///7-20//////////////
                                $scope.Notify2.Names2 = [],
                                    $scope.Notify2.Mobiles2 = [],
                                    $scope.Notify2.Messages2 = [];
                                //////////////////////

                                $scope.Notify2.Message = null;
                                $scope.Notify2.TypeId = -1;
                                $scope.loadingVisible = true;
                                notificationService.getSMSHistory($scope.flight.ID).then(function (response) {

                                    $scope.loadingVisible = false;
                                    $scope.dg_history_ds = response;

                                    $scope.start22();

                                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                                // $scope.popup_notify_visible = false;




                            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                        }
                        else {

                            if ($scope.msgrec && $scope.msgno) {
                                $scope.Notify2.Names2.push($scope.msgrec);
                                $scope.Notify2.Mobiles2.push($scope.msgno);

                            }


                            var result = e.validationGroup.validate();
                            if (!result.isValid) {
                                General.ShowNotify(Config.Text_FillRequired, 'error');
                                return;
                            }

                            if ((!$scope.selectedEmps3 || $scope.selectedEmps3.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }
                            var recs = $scope.selectedEmps3 ? Enumerable.From($scope.dg_emp3_ds).Where(function (x) { return $scope.selectedEmps3.indexOf(x.Id) != -1; }).OrderBy('$.Name').ToArray() : null;
                            if ((!recs || recs.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }

                            $scope.Notify2.ObjectId = -1;
                            $scope.Notify2.FlightId = null;

                            $scope.Notify2.Message = $scope.Notify2.Message;
                            // if ($scope.msgrec && $scope.msgno) {
                            //     $scope.Notify2.Messages2.push($scope.Notify2.Message);
                            // }
                            var temp = Enumerable.From(recs).Select('{EmployeeId:$.Id,Name:$.Name, FDPItemId:$.FDPItemId}').ToArray();

                            $.each(temp, function (_i, _d) {
                                $scope.Notify2.Employees.push(_d.EmployeeId);
                                $scope.Notify2.Names.push(_d.Name);
                                //karo

                            });

                            $scope.Notify2.SenderName = $rootScope.userName;
                            $scope.loadingVisible = true;
                            notificationService.notifyFlight($scope.Notify2).then(function (response) {



                                General.ShowNotify(Config.Text_SavedOk, 'success');


                                $scope.Notify2.Employees = [];
                                $scope.Notify2.Dates = [];
                                $scope.Notify2.Names = [];
                                $scope.Notify2.FDPs = [];
                                ///7-20//////////////
                                $scope.Notify2.Names2 = [],
                                    $scope.Notify2.Mobiles2 = [],
                                    $scope.Notify2.Messages2 = [];
                                //////////////////////
                                $scope.Notify2.Message = null;
                                if (!$scope.freeSMS)
                                    $scope.Notify2.TypeId = -1;

                                $scope.loadingVisible = true;
                                notificationService.getSMSHistoryAll().then(function (response) {

                                    $scope.loadingVisible = false;
                                    $scope.dg_history_ds = response;

                                    $scope.start22();

                                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                                // $scope.popup_notify_visible = false;




                            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                        }


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify2_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {
            $scope.dg_emp2_instance.refresh();
            $scope.dg_history_instance.refresh();
            $scope.loadingVisible = true;
            if (!$scope.freeSMS)
                notificationService.getSMSHistory($scope.flight.ID).then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.dg_history_ds = response;



                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });
            else {
                $scope.Notify2.TypeId = 10016;
                if (!$scope.dg_emp3_ds) {
                    //Config.CustomerId
                    flightService.getDispatchSmsEmployees(Config.CustomerId).then(function (response) {

                        $scope.dg_emp3_ds = response;

                    }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });
                }

                notificationService.getSMSHistoryAll().then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.dg_history_ds = response;



                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });

            }


            //  $scope.selectedNotificationTypeId2 = 10016;



        },
        onHiding: function () {
            $scope.freeSMS = false;
            $scope.stop2();
            if ($scope.dg_emp2_instance)
                $scope.dg_emp2_instance.clearSelection();
            if ($scope.dg_emp3_instance)
                $scope.dg_emp3_instance.clearSelection();
            if (!$scope.freeSMS)
                $scope.selectedNotificationTypeId2 = -1;
            $scope.Notify2 = {
                ModuleId: $rootScope.moduleId,
                TypeId: -1,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Dates: [],
                Names: [],
                FDPs: [],
                Names2: [],
                Mobiles2: [],
                Messages2: [],
            };
            $scope.popup_notify2_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify2_visible',

            title: 'popup_notify2_title',

        }
    };
    //////////////////////////////////////
    $scope.countDownVisible = false;
    $scope.counter = 30;
    var stopped;
    $scope.countdown = function () {
        $scope.countDownVisible = true;
        stopped = $timeout(function () {

            $scope.counter--;
            if ($scope.counter > 0)
                $scope.countdown();
            else {
                $scope.stop();
                $scope.refreshSMSStatus();
            }
        }, 1000);
    };


    $scope.stop = function () {
        $timeout.cancel(stopped);
        $scope.countDownVisible = false;
        $scope.counter = 30;

    };
    $scope.start = function () {
        $scope.counter = 30;
        $scope.countDownVisible = true;
        $scope.countdown();
    }
    //////////////////////////////////////
    $scope.countDownVisible2 = false;
    $scope.counter2 = 30;
    var stopped2;
    $scope.countdown2 = function () {
        $scope.countDownVisible2 = true;
        stopped2 = $timeout(function () {

            $scope.counter2--;
            if ($scope.counter2 > 0)
                $scope.countdown2();
            else {
                $scope.stop2();
                $scope.refreshSMSStatus2();
            }
        }, 1000);
    };


    $scope.stop2 = function () {
        $timeout.cancel(stopped2);
        $scope.countDownVisible2 = false;
        $scope.counter2 = 30;

    };
    $scope.start22 = function () {
        $scope.counter2 = 30;
        $scope.countDownVisible2 = true;
        $scope.countdown2();
    }
    ////////////////////////////////////
    $scope.refreshSMSStatus = function () {
        $scope.stop();
        var ids = Enumerable.From($scope.dg_emp_ds).Where('$.RefId').Select('$.RefId').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.updatePickupSMSStatus(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_emp_ds).Where('$.RefId==' + _d.RefId).FirstOrDefault();
                rec.RefId = _d.RefId;
                rec.Status = _d.Status;

            });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.refreshSMSStatus2 = function () {
        $scope.stop2();
        var ids = Enumerable.From($scope.dg_history_ds).Where('$.RefId').Select('$.RefId').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.updateSMSStatus(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_history_ds).Where('$.RefId==' + _d.RefId).FirstOrDefault();
                rec.RefId = _d.RefId;
                rec.Status = _d.Status;

            });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    ////////////////////////////////////////

    $scope.Notify = {
        ModuleId: 3,
        TypeId: -1,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
        Dates: [],
        FDPs: [],
    };
    $scope.txt_MessageNotify = {
        hoverStateEnabled: false,
        height: 170,
        readOnly: true,
        bindingOptions: {
            value: 'Notify.Message',

        }
    };

    $scope.dg_emp_columns = [

        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        {
            dataField: 'RP', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
                type: "time"
            }, format: "HH:mm"
        },

        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'TypeStr', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 500 },

        { dataField: 'RefId', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

    ];
    $scope.dg_emp_selected = null;

    $scope.dg_emp_instance = null;
    $scope.dg_emp_ds = null;
    $scope.selectedEmps = null;
    $scope.recs = [];
    $scope.bindRecs = function () {
        //alert($scope.selectedEmps);
        $scope.recs = Enumerable.From($scope.dg_crew_abs_ds).Where(function (x) { return $scope.selectedEmps.indexOf(x.CrewId) != -1; }).OrderBy('$.Name').ToArray();
    };

    $scope.dg_emp = {

        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: 310,

        columns: $scope.dg_emp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_instance)
                $scope.dg_emp_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'CrewId',
        onSelectionChanged: function (e) {
            $scope.bindRecs();
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_crew_selected = null;
            //    $scope.rowCrew = null;
            //    $scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
            //    $scope.outputTemps = [];
            //    $scope.crewTempFDPs = [];
            //}
            //else {
            //    $scope.dg_crew_selected = data;
            //    $scope.rowCrew = data;

            //    $scope.getTempDuties();
            //}


        },


        bindingOptions: {
            dataSource: 'dg_emp_ds',
            selectedRowKeys: 'selectedEmps',
        }
    };

    //////////////////////////////
    //////jlog//////////////////////////
    $scope.btn_jlog = {
        hint: 'Fuel & Journey Log',
        type: 'default',
        icon: 'fas fa-gas-pump',
        width: '100%',

        onClick: function (e) {


            $scope.dg_fuelflt_ds = null;
            $scope.jlogEntity = {
                OffBlock: null,
                OnBlock: null,
                TakeOff: null,
                Landing: null,
                PFLR: null,
                FLIGHTTIME: null,
                BLOCKTIME: null,
                FuelUnitID: 115,
                UsedFuel: null,
                FuelArrival: null,
                FuelDeparture: null,
                UsedFuel: null,

            };
            $scope.popup_jlog_visible = true;
            return;
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];

            flightService.getLeg($scope.flight.ID).then(function (leg) {

                //dlutopol
                $scope.jlogEntity = {
                    OffBlock: leg.JLOffBlock ? leg.JLOffBlock : leg.ChocksOut,
                    OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                    TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                    Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                    PFLR: leg.PFLR,
                    FuelUnitID: leg.FuelUnitID,
                    UsedFuel: leg.UsedFuel,
                    FuelArrival: leg.FuelArrival,
                    FuelDeparture: leg.FuelDeparture,
                    UsedFuel: leg.UsedFuel,
                };
                $scope.popup_jlog_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //get flight

        }

    };
    $scope.jlogEntity = {
        OffBlock: null,
        OnBlock: null,
        TakeOff: null,
        Landing: null,
        PFLR: null,
        FLIGHTTIME: null,
        BLOCKTIME: null,
        FuelUnitID: 115,
        UsedFuel: null,
        FuelArrival: null,
        FuelDeparture: null,
        UsedFuel: null,

    };
    $scope.jl_flighttime = {
        readOnly: true,
        bindingOptions: {
            value: 'jlogEntity.FLIGHTTIME',

        }
    };
    $scope.jl_blocktime = {
        readOnly: true,
        bindingOptions: {
            value: 'jlogEntity.BLOCKTIME',

        }
    };
    //2020-11-30
    //dluu
    $scope.sb_jlpflr = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'I' }, { Id: 2, Title: 'P' }, { Id: 3, Title: 'F' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'jlogEntity.PFLR',


        }
    };
    $scope.jl_offblock = {
        //type: "datetime",
        //displayFormat: "yyyy MMM dd",
        type: "date",
        width: '100%',
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        interval: 5,
        bindingOptions: {
            value: 'jlogEntity.OffBlock',

        }
    };
    $scope.jl_offblock_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OffBlock',

        }
    };



    $scope.jl_onblock = {
        type: "date",
        width: '100%',
        interval: 5,
        onValueChanged: function (e) {
            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OnBlock',

        }
    };
    $scope.jl_onblock_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OnBlock',

        }
    };



    $scope.jl_landing = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            $scope.calculatejlog();

        },
        bindingOptions: {
            value: 'jlogEntity.Landing',

        }
    };
    $scope.jl_landing_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.Landing',

        }
    };



    $scope.jl_takeoff = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            $scope.calculatejlog();

        },
        bindingOptions: {
            value: 'jlogEntity.TakeOff',

        }
    };
    $scope.jl_takeoff_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.TakeOff',

        }
    };

    $scope.calculatejlog = function () {
        if ($scope.jlogEntity.TakeOff && $scope.jlogEntity.Landing) {
            var diff = (subtractDates(new Date($scope.jlogEntity.TakeOff), new Date($scope.jlogEntity.Landing)));

            $scope.jlogEntity.FLIGHTTIME = minutesToHourString(diff);
        }
        else
            $scope.jlogEntity.FLIGHTTIME = null;
        if ($scope.jlogEntity.OffBlock && $scope.jlogEntity.OnBlock) {
            var diff = (subtractDates(new Date($scope.jlogEntity.OffBlock), new Date($scope.jlogEntity.OnBlock)));

            $scope.jlogEntity.BLOCKTIME = minutesToHourString(diff);
        }
        else
            $scope.jlogEntity.BLOCKTIME = null;



    };

    $scope.jl_volumeunit = {
        showClearButton: true,
        searchEnabled: false,
        //dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'dsVolumeUnit',
            value: 'jlogEntity.FuelUnitID',


        }
    };
    //7-29
    //malakh
    $scope.dg_fuelflt_columns = [
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 120, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 2, sortOrder: 'asc', visible: false },
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 120 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 120 },
    ];
    $scope.dg_fuelflt_selected = null;
    $scope.fuelflt = null;
    $scope.dg_fuelflt_instance = null;
    $scope.dg_fuelflt_ds = null;
    $scope.dg_fuelflt = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        height: 400,

        columns: $scope.dg_fuelflt_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fuelflt_instance)
                $scope.dg_fuelflt_instance = e.component;

        },


        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            if (!data) {
                $scope.fuelflt = null;
            }
            else {
                $scope.fuelflt = data;


                $scope.flight = data; //$scope.selectedFlights[0];
                $scope.loadingVisible = true;
                flightService.getLeg($scope.flight.ID).then(function (leg) {
                    $scope.loadingVisible = false;
                    //dtopol

                    $scope.jlogEntity = {
                        OffBlock: leg.JLOffBlock ? leg.JLOffBlock : leg.ChocksOut,
                        OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                        TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                        Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                        PFLR: leg.PFLR,
                        FuelUnitID: leg.FuelUnitID,
                        UsedFuel: leg.UsedFuel,
                        FuelArrival: leg.FuelArrival,
                        FuelDeparture: leg.FuelDeparture,
                        UsedFuel: leg.UsedFuel,
                        FPFuel: leg.FPFuel,
                    };

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }

        },


        bindingOptions: {
            dataSource: 'dg_fuelflt_ds',

        }
    };
    $scope.fueltotal = null;
    $scope.jl_fuel_total = {
        min: 0,
        readOnly: true,
        bindingOptions: {
            value: 'fueltotal'
        }
    };
    $scope.calFuelTotal = function () {
        if (!$scope.jlogEntity.FuelArrival || !$scope.jlogEntity.FuelDeparture)
            $scope.fueltotal = null;
        $scope.fueltotal = $scope.jlogEntity.FuelArrival + $scope.jlogEntity.FuelDeparture;
    }

    $scope.jl_fuel_arr = {
        min: 0,
        onValueChanged: function (e) {
            $scope.calFuelTotal();
        },
        bindingOptions: {
            value: 'jlogEntity.FuelArrival'
        }
    };


    $scope.jl_fuel_dep = {
        min: 0,
        onValueChanged: function (e) {
            $scope.calFuelTotal();
        },
        bindingOptions: {
            value: 'jlogEntity.FuelDeparture',

        }
    };

    $scope.jl_fuel_used = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.UsedFuel',

        }
    };
    //2020-12-01
    $scope.jl_fuel_fp = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.FPFuel',

        }
    };

    //end of 7-29

    Date.prototype.yyyymmddtimestring = function (utc) {


        if (!utc) {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
            var result = [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
            ].join('');
            var hh = this.getHours();
            var mi = this.getMinutes();
            var ss = this.getSeconds();
            result += "" //+ this.toLocaleTimeString();
                + ((hh > 9 ? '' : '0') + hh) + "" + ((mi > 9 ? '' : '0') + mi);

        }

        else {
            result = "";
            var umm = this.getUTCMonth() + 1; // getMonth() is zero-based
            var udd = this.getUTCDate();
            var uhh = this.getUTCHours();
            var umi = this.getUTCMinutes();
            var uss = this.getUTCSeconds();
            result = this.getUTCFullYear() + "/"
                + ((umm > 9 ? '' : '0') + umm) + "/"
                + ((udd > 9 ? '' : '0') + udd) + " "
                +
                ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi) + ":" + ((uss > 9 ? '' : '0') + uss);
        }

        return result;
    };
    $scope.popup_jlog_visible = false;
    $scope.popup_jlog_title = 'Journey Log';
    $scope.popup_jlog = {
        shading: true,
        width: 1200,
        height: 550,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'jlog', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save

                        //var result = arg.validationGroup.validate();

                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}
                        var dto = {
                            Id: $scope.flight.ID,
                            OffBlock: !$scope.jlogEntity.OffBlock ? '' : (new Date($scope.jlogEntity.OffBlock)).yyyymmddtimestring(),
                            OnBlock: !$scope.jlogEntity.OnBlock ? '' : (new Date($scope.jlogEntity.OnBlock)).yyyymmddtimestring(),
                            TakeOff: !$scope.jlogEntity.TakeOff ? '' : (new Date($scope.jlogEntity.TakeOff)).yyyymmddtimestring(),
                            Landing: !$scope.jlogEntity.Landing ? '' : (new Date($scope.jlogEntity.Landing)).yyyymmddtimestring(),
                            PFLR: !$scope.jlogEntity.PFLR ? "-1" : $scope.jlogEntity.PFLR,
                            FuelUnitID: $scope.jlogEntity.FuelUnitID,
                            UsedFuel: $scope.jlogEntity.UsedFuel,
                            FuelArrival: $scope.jlogEntity.FuelArrival,
                            FuelDeparture: $scope.jlogEntity.FuelDeparture,
                            UsedFuel: $scope.jlogEntity.UsedFuel,
                            FPFuel: $scope.jlogEntity.FPFuel,

                        };



                        $scope.loadingVisible = true;
                        flightService.saveJLog(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;

                            // $scope.popup_jlog_visible = false;


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jlog_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.calculatejlog();
            $scope.dg_fuelflt_ds = Enumerable.From($scope.ganttData.flights)
                //.OrderBy(function (x) { return new Date(x.Date); })
                //.ThenBy(function (x) { return x.RegisterID})
                //.ThenBy(function (x) { return new Date(x.STD); })
                .ToArray();

            if (!$scope.dg_fuelflt_instance)
                $scope.dg_fuelflt_instance.refresh();
        },
        onHiding: function () {
            $scope.dg_fuelflt_ds = null;
            $scope.jlogEntity = {
                OffBlock: null,
                OnBlock: null,
                TakeOff: null,
                Landing: null,
                PFLR: null,
                FLIGHTTIME: null,
                BLOCKTIME: null,
                FuelUnitID: 115,
                UsedFuel: null,
                FuelArrival: null,
                FuelDeparture: null,
                UsedFuel: null,

            };
            $scope.popup_jlog_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jlog_visible',

            title: 'popup_jlog_title',

        }
    };
    ////////////////////////////////////
    //New View///////////////////////////
    $scope.regs = ['CAR', 'KPA', 'KPB', 'CPD', 'CAS', 'CPV', 'FPA', 'FPC', 'CPQ', 'KPC', 'KPD', 'KPE', 'CNL'];
    /////config/////////////////


    ///////////////////////////

    $scope.refreshHeights = function () {

        var days_count = $scope.days_count + $scope.nextDay;
        days_count = days_count + $scope.preDay;
        //  $('.cell-hour').width(hourWidth);
        $('.cell-day').width((hourWidth + 1) * 24 - 1);
        $('.timeline').width((hourWidth + 1) * days_count * 24 + 2);
        $('.flights').width((hourWidth + 1) * days_count * 24 + 2);



        $('.row-top-mirror').height($('.row-top').height() - 1);
        var h = ($('.reg-box').height());
        //$('.mid-line').height($('.flights').prop('scrollHeight') );
        //$('.hour-line').height($('.flights').prop('scrollHeight'));
        // $('.now-line').height($('.flights').prop('scrollHeight'));
        $('.mid-line').height(h);
        $('.hour-line').height(h);
        $('.halfhour-line').height(h);
        $('.hour-line').height(h);
        $('.now-line').height(h);

        $('.flights').on('scroll', function () {
            $('.regs').scrollTop($(this).scrollTop());
            //$('.timeline').scrollLeft($(this).scrollLeft());
        });



        $scope.start();

    };
    var stopped;
    //magu 3-17
    $scope.drawNowLine = function () {

        var nowDate = new Date();
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 1, 0, 0, 0));
            nowDate = (new Date()).addMinutes(offset)
        }
        /////////////////////////
        var std = new Date(nowDate);
        var datefromOffset = (new Date($scope.datefrom)).getTimezoneOffset();
        var stdOffset = (new Date(std)).getTimezoneOffset();
        var dfirst = new Date($scope.datefrom);
        var mm = (new Date($scope.datefrom)).getMonth();
        var dd = (new Date($scope.datefrom)).getDate();


        if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
            dfirst = (new Date($scope.datefrom)).addMinutes(-60);
        if (stdOffset > datefromOffset)
            dfirst = (new Date($scope.datefrom)).addMinutes(60);

        var time = moment(/*new Date()*/nowDate).format('HH:mm');
        var _left = $scope.getDuration(new Date(/*$scope.datefrom*/dfirst), /*new Date()*/nowDate);
        //////////////////////////////////////
        var nowleft = (_left * (hourWidth + 1)) - 1;
        $('.now-line').css('left', nowleft + 'px');
        $('#nowTime').css('left', (nowleft + 5) + 'px');
        $('#nowTime').html(time);
    };
    ///////////////////
    $scope.countdown = function () {
        //var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
        //var nowleft = (_left * (hourWidth + 1));
        //var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
        //var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
        stopped = $timeout(function () {

            //var time = moment(new Date()).format('HH:mm');
            //var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
            //var nowleft = (_left * (hourWidth + 1)) - 1;
            //$('.now-line').css('left', nowleft + 'px');
            //$('#nowTime').css('left', (nowleft + 5) + 'px');
            //$('#nowTime').html(time);
            $scope.drawNowLine();
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
    //magu utc 

    //9-21
    //zooti 
    $scope.getDep = function (flt) {
        //2022-02-28
        var dt = flt.ChocksOut;
        if (flt.ChocksOut)
            dt = flt.ChocksOut;
        else
            dt = flt.STD;

        if ($scope.timeType == 1) {

            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            if (flt.ID == 70888 || flt.ID == 70889) {

                offset = offset - 120;
                var hh = Number(moment(new Date(dt)).format('HHmm'));
                if (hh > 330)
                    offset = offset + 60;
            }
            dt = (new Date(dt)).addMinutes(offset);
        }
        if ($scope.timeType == 2) {

            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            // if (flt.FlightNumber == '7900')
            //   console.log(offset + '   ' + flt.GWLand);
            offset += flt.GWLand;
            dt = (new Date(dt)).addMinutes(offset)

        }
        return moment(dt).format('HHmm');
    };
    //zooti
    $scope.getArr = function (flt) {
        var dt = flt.ChocksIn;
        if (flt.ChocksIn)
            dt = flt.ChocksIn;
        else
            dt = flt.STA;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            if (flt.ID == 70888 || flt.ID == 70889) {
                offset = offset - 120;
                var hh = Number(moment(new Date(dt)).format('HHmm'));
                if (hh > 330)
                    offset = offset + 60;
            }
            dt = (new Date(dt)).addMinutes(offset)
        }
        if ($scope.timeType == 2) {

            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            if (flt.FlightNumber == '7900' || flt.FlightNumber == '0040')
                console.log('ARR: ' + flt.FlightNumber + '  ' + offset + '   ' + flt.GWTO);
            offset += flt.GWTO;
            console.log('offset: ' + offset);
            dt = (new Date(dt)).addMinutes(offset)
        }
        return moment(dt).format('HHmm');
    };
    //////////////////////////
    //9-8
    $scope.getFlightClass = function (flt) {
        if (flt.FlightStatusID == 4 && flt.CancelDate) {

            var dt = moment.utc(new Date(flt.CancelDate)).format('YYYY-MM-DD HH:mm');
            var dt1 = moment.utc(new Date(flt.CancelDate));
            var dt2 = moment(new Date(flt.STD));

            var _dtCNL = new Date(dt1.year(), dt1.month(), dt1.date(), dt1.hour(), dt1.minute(), 0);
            var _dtSTD = new Date(dt2.year(), dt2.month(), dt2.date(), dt2.hour(), dt2.minute(), 0);
            var diff = Math.abs(_dtCNL.getTime() - _dtSTD.getTime()) / 3600000;
            if (diff > 24 * 7)
                return flt.FlightStatus.toLowerCase();
            else
                return 'canceled-t2';
            //console.log(_dtCNL);
            //console.log(_dtSTD);
            //console.log(diff);


        }
        else
            return flt.FlightStatus.toLowerCase();
    }
    $scope.getDuration = function (d1, d2) {
        //
        var diff = Math.abs(d1.getTime() - d2.getTime()) / 3600000;
        return diff;
    }

    $scope._getFlightWidth = function (flt) {
        var duration = $scope.getDuration(new Date(flt.ChocksIn ? flt.ChocksIn : flt.STA), new Date(flt.ChocksOut ? flt.ChocksOut : flt.STD));
        var w = duration * hourWidth;
        return w + "px";
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
    $scope._getFlightStyle = function (f, index, res) {

        var style = {};
        style.width = $scope.getFlightWidth(f);
        var left = $scope.getDuration(new Date($scope.datefrom), new Date(f.STD));
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;

        //console.log(index);
        //console.log(res);

        style.top = top + 'px';
        return style;
    }

    //3-16
    //zooki
    $scope.getFlightStyle = function (f, index, res) {

        var style = {};
        style.width = $scope.getFlightWidth(f);

        var std = f.STD;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(std.getFullYear(), std.getMonth(), std.getDate(), 1, 0, 0, 0));
            if (f.ID == 70888 || f.ID == 70889) {
                offset = offset - 120;
            }
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


        var left = $scope.getDuration(new Date(dfirst), /*new Date(f.ChocksOut?f.ChocksOut: f.STD)*/new Date(std));

        if (new Date(std) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;
        if (f.FlightStatusID == 4)
            top += 30;
        //console.log(index); 
        //console.log(res);

        style.top = top + 'px';
        return style;
    }

    //qeshm
    $scope.btn_fdp = {
        hint: 'Group Flights',
        type: 'default',
        icon: 'fas fa-link',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            var ati_flight1 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            var ati_flight2 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;

            $scope.time_interval_from_date = new Date(ati_flight1.STD);
            $scope.time_interval_to_date = new Date(ati_flight2.STD);
            $scope.interval_days = [];
            $scope.interval_days.push((new Date(ati_flight1.STD)).getDay());
            $scope.interval_days.push((new Date(ati_flight2.STD)).getDay());

            $scope.IsFDPCreate = true;
            $scope.popup_fdp_visible = true;



        }
    };
    $scope.clearSelectionX = function () {
        var selected = $scope.selectionElement.getSelection();
        while (selected.length > 0) {
            for (var el of selected) {
                el.classList.remove('selected');
                $scope.selectionElement.removeFromSelection(el);
            }
            selected = $scope.selectionElement.getSelection();
        }


        // Clear previous selection
        $scope.selectionElement.clearSelection(false);
        $scope.ati_selectedFlights = [];
    };
    $scope.getFDPStat = function () {
        $scope.FDPDuty = null;
        $scope.FDPFlight = null;
        $scope.IsExtensionVisible = false;
        $scope.IsSplitVisible = false;
        $scope.loadingVisible = true;
        var ids = Enumerable.From($scope.ati_selectedFlights).Select('$.Id').ToArray();
        var dhs = Enumerable.From($scope.ati_selectedFlights).Where('$.dh==1').ToArray().length;
        flightService.getFDPStats(ids.join('_'), dhs).then(function (response) {


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
    $scope.dg_columns3 = [


        { dataField: 'Title', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Value', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },



    ];
    $scope.dg3_selected = null;
    $scope.dg3_instance = null;
    $scope.dg3_ds = null;
    $scope.dg3_height = $scope.bottom - 108;
    $scope.dg3 = {
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

        columnAutoWidth: true,
        // height: $scope.bottom-108,

        columns: $scope.dg_columns3,
        onContentReady: function (e) {
            if (!$scope.dg3_instance)
                $scope.dg3_instance = e.component;

        },
        onRowPrepared: function (e) {
            //if (e.rowType === "data") {
            //    var day = (new Date(e.data.STDDay)).getDay();
            //    e.rowElement.css("backgroundColor", $scope.palete[day]);
            //}
            //42 %  10

        },
        showColumnHeaders: false,
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg3_selected = null;
            }
            else
                $scope.dg32_selected = data;


        },
        onCellPrepared: function (e) {
            //lightgray
            if (e.rowType === "data" && e.column.dataField == "Title")
                e.cellElement.css("backgroundColor", "lightgray");
            if (e.rowType === "data" && e.column.dataField == "Value" && e.data.Title == 'FDP' && $scope.FDPStat.IsOver)
                e.cellElement.css("backgroundColor", "#ffcccc");

        },

        bindingOptions: {
            dataSource: 'dg3_ds',
            height: 'dg3_height'
        }
    };

    $scope.btn_fdpdelete = {
        hint: 'Group Flights',
        type: 'danger',
        icon: 'fas fa-unlink',
        width: '100%',

        onClick: function (e) {
            // var el = $("div[data-flightid='" + 103805 + "']");

            // var els = [];
            // els.push(el.get(0));

            ////$scope.selectionElement.select($("div[data-flightid='" + 103805 + "']"));
            //var selection_result = $scope.selectionElement.select(/*".flightarea"*/els);
            //$scope.selectionElement.keepSelection();
            //console.log('SELECTION RESULT', selection_result);
            //console.log('SELECTION GET', $scope.selectionElement.getSelection());
            //el.addClass('selected');
            //return;


            if (!$scope.selectedFDP) {
                General.ShowNotify('No Group Selected', 'error');
                return;
            }
            //$scope.ganttData.flights

            var fids = Enumerable.From($scope.selectedFDP.items).Select('Number($.FlightId)').ToArray();

            $scope.ati_selectedFlights = Enumerable.From($scope.ganttData.flights)
                .Where(function (x) { return fids.indexOf(x.ID) != -1; })
                .OrderBy(function (x) { return new Date(x.STD); })
                .ToArray();

            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            var ati_flight1 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            var ati_flight2 = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;

            $scope.time_interval_from_date = new Date(ati_flight1.STD);
            $scope.time_interval_to_date = new Date(ati_flight2.STD);
            $scope.interval_days = [];
            $scope.interval_days.push((new Date(ati_flight1.STD)).getDay());
            $scope.interval_days.push((new Date(ati_flight2.STD)).getDay());

            $scope.IsFDPCreate = false;
            $scope.popup_fdp_visible = true;



        }
    };
    $scope.popup_fdp_visible = false;
    $scope.popup_fdp_title = 'Group Flights';
    //magu2-16

    $scope.IsFDPCreate = true;
    $scope.showFDPs = false;
    $scope.check_fdp = {
        width: '100%',
        text: "Show Groups",

        bindingOptions: {
            value: 'showFDPs',

        }
    };
    $scope.popup_fdp = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fdp"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 550,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbfdp', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        if ($scope.IsFDPCreate) {
                            if ($scope.FDPStat.IsOver) {
                                General.ShowNotify('The FDP is OVER', 'error');
                                return;
                            }
                        }
                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();





                        var entity = {


                            UserId: $rootScope.userId,
                            UserName: $rootScope.userName,
                            ReasonId: -1,

                            Flights: flights,
                            From: (new Date()).toUTCDateTimeDigits(),
                            To: (new Date()).toUTCDateTimeDigits(),


                        };


                        var interval_from_dates = (new Date($scope.time_interval_from_date)).getDatePartArray();
                        var intervalFrom = new Date(interval_from_dates[0], interval_from_dates[1], interval_from_dates[2], 12, 0, 0, 0);
                        var interval_to_dates = (new Date($scope.time_interval_to_date)).getDatePartArray();
                        var intervalTo = new Date(interval_to_dates[0], interval_to_dates[1], interval_to_dates[2], 12, 0, 0, 0);
                        entity.intervalFrom = (new Date(intervalFrom)).toUTCString();
                        entity.intervalTo = (new Date(intervalTo)).toUTCString();
                        entity.interval = 2;
                        entity.days = $scope.interval_days;
                        var ref_dates = (new Date($scope._datefrom)).getDatePartArray();
                        var ref = new Date(ref_dates[0], ref_dates[1], ref_dates[2], 12, 0, 0, 0);
                        entity.RefDate = (new Date(ref)).toUTCString();
                        entity.RefDays = $scope.days_count;
                        ///////////////////////////////



                        $scope.loadingVisible = true;
                        if ($scope.IsFDPCreate)
                            flightService.saveFDPGroup(entity).then(function (response) {
                                //qeshm 1
                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.popup_fdp_visible = false;
                                var _grps = response.data;

                                $.each($scope.ganttData.resources, function (_i, _d) {
                                    _d.fdps = [];
                                    _d.fdps = Enumerable.From(_grps).Where('$.RegisterId==' + _d.resourceId).ToArray();
                                });

                                $scope.clearSelectionX();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        else
                            flightService.deleteFDPGroup(entity).then(function (response) {
                                //qeshm 1
                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.popup_fdp_visible = false;
                                var _grps = response.data;

                                $.each($scope.ganttData.resources, function (_i, _d) {
                                    _d.fdps = [];
                                    _d.fdps = Enumerable.From(_grps).Where('$.RegisterId==' + _d.resourceId).ToArray();
                                });

                                $scope.clearSelectionX();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





                        /////////////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            if ($scope.IsFDPCreate)
                $scope.getFDPStat();

        },
        onHiding: function () {


            // $scope.popup_fdp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fdp_visible',

            title: 'popup_fdp_title',

        }
    };

    //close button
    $scope.popup_fdp.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_fdp_visible = false;
        btn
    };
    $scope.selectedFDPId = null;
    $scope.selectedFDP = null;
    $scope.getFDPClass = function (f) {
        if (f.FLTGroupId == $scope.selectedFDPId)
            return "fdp-selected";
        return "";
    };
    $scope.FDPClick = function (f) {
        $scope.clearSelectionX();
        var _id = $scope.selectedFDPId;
        if (_id != f.FLTGroupId) {
            $scope.selectedFDPId = f.FLTGroupId;
            $scope.selectedFDP = f;
        }
        else {
            $scope.selectedFDPId = null;
            $scope.selectedFDP = null;
        }

    };
    $scope.getFDPWidth = function (fdp) {
        var duration = $scope.getDuration(new Date(fdp.End), new Date(fdp.Start));
        var w = duration * (hourWidth + 1) + 6;
        return w + "px";
    }
    $scope.getFDPStyle = function (f, index, res) {

        var style = {};
        style.width = $scope.getFDPWidth(f);

        var std = f.Start;
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


        var left = $scope.getDuration(new Date(dfirst), /*new Date(f.ChocksOut?f.ChocksOut: f.STD)*/new Date(std));

        if (new Date(std) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = ((left * (hourWidth + 1)) - 3) + "px";
        var top = f.top;

        //console.log(index); 
        //console.log(res);

        //style.top = top + 'px';
        style.backgroundColor = f.BColor;
        return style;
    }

    $scope.ctr_on = 1;
    $scope.ctr_off = 0;
    $scope.num_catering_on = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ctr_on',

        }
    };
    $scope.num_catering_off = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ctr_off',

        }
    };
    $scope.ctr_ds = [];
    $scope.ctr_type = null;
    $scope.sb_catering = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'ctr_ds',
            value: 'ctr_type',


        }
    };

    $scope.ctr_stn_ds = [];
    $scope.ctr_stn = null;
    $scope.sb_catering_stn = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'ctr_stn_ds',
            value: 'ctr_stn',


        }
    };
    $scope.ctr_remark = '';
    $scope.txt_catering_remark = {
        width: '100%',
        bindingOptions: {
            value: 'ctr_remark',


        }
    };
    $scope.btn_add_ctr = {
        text: 'Add',
        type: 'default',

        width: '110',

        bindingOptions: {},
        onClick: function (e) {

            var dto = {
                flightId: $scope.flight.ID,
                typeId: $scope.ctr_type,
                stationId: $scope.ctr_stn,
                on: $scope.ctr_on,
                off: $scope.ctr_off,
                remark: $scope.ctr_remark,

            };
            $scope.loadingVisible = true;
            flightService.cateringItemAdd(dto).then(function (response) {
                $scope.loadingVisible = false;

                var rec = response.data;
                $scope.dg_catering_ds.push(rec);
                $scope.ctr_type = null;
                $scope.ctr_on = 0;
                $scope.ctr_off = 0;
                $scope.ctr_remark = '';
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            ////////////////

        }

    };
    $scope.btn_del_ctr = {
        text: 'Remove',
        type: 'danger',

        width: '110',

        bindingOptions: {},
        onClick: function (e) {

            var selected = $rootScope.getSelectedRow($scope.dg_catering_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var dto = { id: selected.Id };
            //cateringItemRemove
            $scope.loadingVisible = true;
            flightService.cateringItemRemove(dto).then(function (response) {
                $scope.loadingVisible = false;


                $scope.dg_catering_ds = Enumerable.From($scope.dg_catering_ds).Where('$.Id!=' + selected.Id).ToArray();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };


    $scope.popup_catering_visible = false;
    $scope.popup_catering_title = 'Catering';
    $scope.popup_catering = {
        shading: true,
        width: 1400,
        height: 750, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_catering_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            //$scope.flight
            $scope.ctr_stn_ds = [];
            $scope.ctr_stn_ds.push({ Id: $scope.flight.FromAirport, Title: $scope.flight.FromAirportIATA });
            $scope.ctr_stn_ds.push({ Id: $scope.flight.ToAirport, Title: $scope.flight.ToAirportIATA });
            $scope.ctr_stn = $scope.flight.FromAirport;
            flightService.getCateringCodes().then(function (response) {
                $scope.ctr_ds = response.data;

                flightService.getCateringItems($scope.flight.ID).then(function (response) {
                    $scope.dg_catering_ds = response.data;
                    if (!$scope.dg_catering_ds)
                        $scope.dg_catering_ds = [];

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            $scope.dg_catering_ds = [];

            $scope.popup_catering_visible = false;

        },
        bindingOptions: {
            visible: 'popup_catering_visible',

            title: 'popup_catering_title',

        }
    };

    $scope.dg_catering_columns = [
        { dataField: 'AmountLoaded', caption: 'Loaded', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
        { dataField: 'IATA', caption: 'Station', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300, },
        { dataField: 'AmountOffLoaded', caption: 'Off Loaded', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },



    ];
    $scope.dg_catering_selected = null;
    $scope.dg_catering_instance = null;
    $scope.dg_catering_ds = [];
    $scope.dg_catering = {
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
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 450,// 490 

        columns: $scope.dg_catering_columns,
        onContentReady: function (e) {
            if (!$scope.dg_catering_instance)
                $scope.dg_catering_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_catering_selected = null;

            }
            else {
                $scope.dg_catering_selected = data;

            }
        },
        onRowPrepared: function (e) {


        },

        onRowUpdated: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_catering_ds',

        }
    };
    ///////////////////////////////////
    //fjk
    $scope.getResStyle = function (res) {

        var ext = 0;
        if (res.resourceName.includes('CNL'))
            ext = 30;
        return {
            minHeight: (res.maxTop + 50 + ext) + 'px'
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
    $scope.getRegStr = function (reg) {
        if (reg.toLowerCase().indexOf('cnl') != -1)
            return "CNL";
        else
            return reg;
    };
    //5-17
    $scope.getResOrderIndex = function (reg) {
        try {
            var str = "";

            if (reg.includes("CNL"))
                str = "ZZZZZZ";
            else if (reg.includes("RBC"))
                str = "ZZZZZY";
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
    $scope.removeFromGantt = function (flt, res) {
        var gres = Enumerable.From($scope.ganttData.resources).Where('$.resourceId==' + res).FirstOrDefault();



        gres.flights = Enumerable.From(gres.flights).Where('$.ID!=' + flt.ID)
            .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
            .ToArray();
        if (gres.flights.length > 0) {
            $.each(gres.flights, function (_j, _f) {
                _f.top = null;
            });
            $scope.setTop(gres.flights);
            gres.maxTop = Enumerable.From(gres.flights).Select('Number($.top)').Max();
        }
        else {
            $scope.ganttData.resources = Enumerable.From($scope.ganttData.resources).Where('$.resourceId!=' + res).ToArray();
        }

    }
    $scope.addToGantt = function (flt, res) {
        var gres = Enumerable.From($scope.ganttData.resources).Where('$.resourceId==' + res.resourceId).FirstOrDefault();
        if (!gres) {
            gres = res;
            $scope.ganttData.resources.push(gres);
            $scope.ganttData.resources = Enumerable.From($scope.ganttData.resources).OrderBy(function (x) {
                return $scope.getResOrderIndex(x.resourceName);
            }).ToArray();

        }

        if (!gres.flights)
            gres.flights = [];
        var gflt = Enumerable.From(gres.flights).Where('$.ID==' + flt.ID).FirstOrDefault();
        if (!gflt) {
            gres.flights.push(flt);
        }
        gres.flights = Enumerable.From(gres.flights)
            .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
            .ToArray();


        $.each(gres.flights, function (_j, _f) {
            _f.top = null;
        });
        $scope.setTop(gres.flights);
        gres.maxTop = Enumerable.From(gres.flights).Select('Number($.top)').Max();
    }
    $scope.modifyGantt = function (flt, res, oldResId) {
        if (!oldResId)
            oldResId = $scope.ati_resid;

        if (oldResId != flt.RegisterID) {
            var oldres = Enumerable.From($scope.ganttData.resources).Where('$.resourceId==' + oldResId).FirstOrDefault();
            oldres.flights = Enumerable.From(oldres.flights).Where('$.ID!=' + flt.ID).ToArray();
            if (oldres.flights.length > 0) {
                $.each(oldres.flights, function (_j, _f) {
                    _f.top = null;
                });
                $scope.setTop(oldres.flights);
                oldres.maxTop = Enumerable.From(oldres.flights).Select('Number($.top)').Max();
            }
            else {
                $scope.ganttData.resources = Enumerable.From($scope.ganttData.resources).Where('$.resourceId!=' + oldres.resourceId).ToArray();
            }
        }


        var gres = Enumerable.From($scope.ganttData.resources).Where('$.resourceId==' + res.resourceId).FirstOrDefault();
        if (!gres) {
            gres = res;
            $scope.ganttData.resources.push(gres);
            $scope.ganttData.resources = Enumerable.From($scope.ganttData.resources).OrderBy(function (x) {
                return $scope.getResOrderIndex(x.resourceName);
            }).ToArray();

        }

        if (!gres.flights)
            gres.flights = [];
        var gflt = Enumerable.From(gres.flights).Where('$.ID==' + flt.ID).FirstOrDefault();
        if (!gflt) {
            gres.flights.push(flt);
        }
        gres.flights = Enumerable.From(gres.flights)
            .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
            .ToArray();
        $.each(gres.flights, function (_j, _f) {
            _f.top = null;
        });
        $scope.setTop(gres.flights);
        gres.maxTop = Enumerable.From(gres.flights).Select('Number($.top)').Max();


    };

    $scope.nextDay = 0;
    $scope.preDay = 0;
    $scope.timeType = 0;
    $scope.timeTypeChanged = function () {
        if ($scope.timeType == 1) {

            $('.second-time').hide();
            $('.second-time-right').show();
        }
        else {

            $('.second-time').show();
            $('.second-time-right').hide();
        }
        $scope.drawNowLine();
    };
    $scope.sb_timetype = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ id: 0, title: 'LCB' }, { id: 1, title: 'UTC' }, { id: 2, title: 'LCL' },],
        displayExpr: 'title',
        valueExpr: 'id',
        onValueChanged: function (e) {
            console.log('Date  ', $scope.date_from);
            console.log('OFFSET   ', getOffset($scope._datefrom));
            $scope.timeTypeChanged();
        },
        bindingOptions: {
            value: 'timeType',

        }
    };
    $scope.createGantt = function () {
        if ($(window).width() < 1400) {
            $('.large-gantt').remove();
            hourWidth = 69;
        }
        else
            $('.small-gantt').remove();
        $scope.nextDay = 0;
        var lastDay = (new Date($scope.dateEnd)).getDate();
        // alert(lastDay);
        var nxtdy = Enumerable.From($scope.ganttData.flights).Where(function (x) {

            return x.ChocksOut.getDate() > lastDay || x.Takeoff.getDate() > lastDay || x.Landing.getDate() > lastDay || x.ChocksIn.getDate() > lastDay || x.STA.getDate() > lastDay;
        }).ToArray();
        if (nxtdy && nxtdy.length > 0)
            $scope.nextDay = 1;



        var $timeBar = $('.header-time');
        var $dayBar = $('.header-date');
        var $flightArea = $('.flights');
        $timeBar.empty();
        $dayBar.empty();
        //$flightArea.empty();
        $('.reg-row').remove();
        $('.hour-line').remove();
        $('.halfhour-line').remove();
        $('.mid-line').remove();
        $('.now-line').remove();
        $('#nowTime').remove();
        $('.flights').height(0);


        $('.flights').off('scroll');
        var c = 1;
        var cf = 0.5;
        $scope.preDay = 0;
        var days_count = $scope.days_count + $scope.nextDay;
        var tempDate = (new Date(dfrom)).addDays(-1 * $scope.preDay);
        days_count = days_count + $scope.preDay;


        //magu utc
        var floatTime = 'left';

        //var secondTimeClass = 'second-time';
        //if ($scope.timeType == 1) {
        //    floatTime = 'left';
        //    secondTimeClass = 'second-time-right';
        //}
        /////////////////////////////
        for (var i = 1; i <= days_count; i++) {
            for (var j = 0; j < 24; j++) {
                var offset = getOffset(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0));
                ////magu utc
                //if ($scope.timeType == 1)
                //    offset = -1 * offset;
                /////////////
                var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(offset);
                var secondDate2 = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-offset);
                var secondDateStyle = 'display:initial';
                var secondDate2Style = 'display:none';
                if ($scope.timeType == 1) {
                    secondDateStyle = 'display:none';
                    secondDate2Style = 'display:initial';
                }


                var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "<span class='second-time' style='" + secondDateStyle + "'>" + moment(secondDate).format('HHmm') + "</span><span class='second-time-right' style='" + secondDate2Style + "'>" + moment(secondDate2).format('HHmm') + "</span></div>";
                $timeBar.append(hourElem);
                if (c < 24 * days_count) {
                    var hleft = c * (hourWidth + 1) - 0.8;
                    var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
                    $flightArea.append(hline);

                    var hleft2 = (cf) * (hourWidth + 1) - 0.8;
                    var hline2 = "<div class='halfhour-line' style='top:0px;left:" + hleft2 + "px'></div>";
                    $flightArea.append(hline2);
                }
                cf = cf + 1;
                c++;
            }

            var tbl = "<table style='padding:0;width:95%'><tr>"
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + ($(window).width() < 1400 ? "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>" : "")
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"

                + "</tr></table>"
            var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + tbl + "</div>";
            $dayBar.append(dayElem);

            if (i < days_count) {
                var midleft = i * 24 * (hourWidth + 1) - 1;
                var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
                $flightArea.append(midline);
            }


            tempDate = tempDate.addDays(1);
        }
        if ($scope.IsNowLine) {
            //magu utc
            var nowDate = new Date();
            if ($scope.timeType == 1) {
                var offset = getOffset(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 1, 0, 0, 0));
                nowDate = (new Date()).addMinutes(offset)
            }
            /////////////////
            //3-17
            var std = new Date(nowDate);
            var datefromOffset = (new Date($scope.datefrom)).getTimezoneOffset();
            var stdOffset = (new Date(std)).getTimezoneOffset();
            var dfirst = new Date($scope.datefrom);
            var mm = (new Date($scope.datefrom)).getMonth();
            var dd = (new Date($scope.datefrom)).getDate();


            if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
                dfirst = (new Date($scope.datefrom)).addMinutes(-60);
            if (stdOffset > datefromOffset)
                dfirst = (new Date($scope.datefrom)).addMinutes(60);
            ////////////////////
            var _left = $scope.getDuration(new Date(/*$scope.datefrom*/dfirst), /*new Date()*/nowDate);
            var nowleft = (_left * (hourWidth + 1));


            var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
            var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(/*new Date()*/nowDate).format('HH:mm') + "</span>";
            $flightArea.append(nowline);
            $flightArea.append(nowTime);
        }
        $dayBar.append("<div style='clear:both'></div>");
        $timeBar.append("<div style='clear:both'></div>");
        $('.timeline').width((hourWidth + 1) * days_count * 24);
        $('.flights').width((hourWidth + 1) * days_count * 24);


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
        //2020-11-16
        var fltDep = getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = getMaxDate(new Date(x.STA), new Date(x.ChocksIn));

        var result = (fltDep > xDep && fltDep < xArr) || (fltArr > xDep && fltArr < xArr)
            || (xDep > fltDep && xDep < fltArr) || (xArr > fltDep && xArr < fltArr)
            || (moment(xDep).format('YYYYDDMMHHmm') == moment(fltDep).format('YYYYDDMMHHmm') && moment(xArr).format('YYYYDDMMHHmm') == moment(fltArr).format('YYYYDDMMHHmm'))
            ;

        return result;



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

            j = j + 50;
        }
    }

    //zooki
    $scope.modifyFlightTimes = function (flt, utc) {
        //$scope.dateEnd

        var m = -1;
        var n = 0;

        flt.STD = moment(flt.STD);
        //zooki
        if (flt.ID == 70888 || flt.ID == 70889) {
            console.log(flt.STD);
            console.log((new Date(flt.STD)).addMinutes(270 + 60));
            n = 60;
        }
        flt.STA = moment(flt.STA);


        if (flt.ChocksIn)
            flt.ChocksIn = moment(flt.ChocksIn);
        if (flt.ChocksOut)
            flt.ChocksOut = moment(flt.ChocksOut);

        flt.ChocksOut = getOffsetDate(flt.ChocksOut, m, n);
        flt.ChocksIn = getOffsetDate(flt.ChocksIn, m, n);
        flt.Takeoff = getOffsetDate(flt.Takeoff, m, n);
        flt.Landing = getOffsetDate(flt.Landing, m, n);
        flt.STA = getOffsetDate(flt.STA, m, n);
        flt.STD = getOffsetDate(flt.STD, m, n);


        flt.STA2 = getOffsetDate(flt.STA2, m, n);
        flt.STD2 = getOffsetDate(flt.STD2, m, n);

        if (flt.CancelDate)
            flt.CancelDate = getOffsetDate(flt.CancelDate, m, n);
        if (flt.RampDate)
            flt.RampDate = getOffsetDate(flt.RampDate, m, n);
        //  console.log('$scope.modifyFlightTimes=function(flt,utc){');
        //   console.log(flt);

    };
    $scope.grounds = [];
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
        //5-17
        //09-02
        logService.getFlightsGanttUTC(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, /*offset*/0, null, 1, filter).then(function (response) {
            try {
                //2020-11-25
                $scope.baseDate = (new Date(response.baseDate)).toUTCString();
                //alert($scope.baseDate); 
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
                $scope.grounds = response.grounds;
                // var nextdayFlight = Enumerable.From(response.flights).Where(function (x) { return new Date(x.STA) > $scope.dateEnd || (!x.ChocksIn ? false : new Date(x.ChocksIn) > $scope.dateEnd); }).FirstOrDefault();
                // if (nextdayFlight)
                //    $scope.days_count++;
                $.each(response.resources, function (_i, _d) {
                    _d.fdps = Enumerable.From(response.fltgroups).Where('$.RegisterId==' + _d.resourceId).ToArray();

                    var flights = Enumerable.From(response.flights).Where('$.RegisterID==' + _d.resourceId)
                        .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                        .ToArray();
                    //if (_d.resourceId == 69)

                    $.each(flights, function (_j, _q) {


                        $scope.modifyFlightTimes(_q);


                    });
                    $scope.setTop(flights);
                    _d.maxTop = Enumerable.From(flights).Select('Number($.top)').Max();
                    $scope.totalHeight += _d.maxTop;
                    _d.flights = flights;
                });
                //qeshm
                //response.resources[1].fdps = [
                //    { Id: 1, Start: new Date(2022, 0, 14, 9, 40, 0), End: new Date(2022, 0, 14, 14, 15) },
                //    { Id: 2, Start: new Date(2022, 0, 14, 15, 5, 0), End: new Date(2022, 0, 14, 23, 20) }
                //];

                //5-17
                response.resources = Enumerable.From(response.resources).OrderBy(function (x) { return $scope.getResOrderIndex($scope.getRegStr(x.resourceName)); }).ToArray();

                $scope.ganttData = response;

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
        //2020-11-25
        $scope.utimer = setTimeout(function () {
            //'info' | 'warning' | 'error' | 'success' | 'custom'
            //9-15
            // flightService.getDelayedFlights().then(function (responsex) { }, function (errx) { });
            //2020-11-24-2
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
            //noosk
            flightService.getUpdatedFlightsNew(dto).then(function (response) {

                //$scope.baseDate = (new Date(Date.now())).toUTCString();
                //2020-11-25
                $scope.baseDate = (new Date(response.baseDate)).toUTCString();
                // console.log('===== BASE DATE =====================');
                // console.log($scope.baseDate);
                $.each(response.flights, function (_i, _d) {
                    //_d.STD = moment(_d.STD);
                    //_d.STA = moment(_d.STA);
                    //_d.ChocksIn = moment(_d.ChocksIn);
                    //_d.ChocksOut = moment(_d.ChocksOut);
                    //var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();
                    //if (_flight)
                    //    for (var key in _d) {
                    //        if (_d.hasOwnProperty(key)) {
                    //            _flight[key] = _d[key];
                    //            //console.log(key + " -> " + _d[key]);
                    //        }
                    //    }
                    var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();

                    if (_flight) {
                        var oldresid = _flight.RegisterID;
                        for (var key of Object.keys(_d)) {
                            _flight[key] = _d[key];

                        }
                        $scope.modifyFlightTimes(_flight);
                        var res = { resourceId: _flight.RegisterID, resourceName: _flight.Register, groupId: _flight.TypeId };
                        $scope.modifyGantt(_flight, res, oldresid);

                    }


                });
                if (response.summary != -1)
                    $scope.baseSum = response.summary;
                ///////////////////////////////////////////
                ////////////////////////////////////////////
                if (response && response.flights && response.flights.length > 0) {
                    var ff = response.flights[0];
                    var time = moment(ff.DateStatus).format("MMMM Do YYYY, h:mm:ss a");
                    var text = ff.FromAirportIATA + "-" + ff.ToAirportIATA + ", " + ff.FlightNumber + ", " + ff.FlightStatus;

                }

                //////////////////////////////////////////
                $scope.getBoardSummary($scope.selectedDate);
                ///////////////////////////////////////////

            }, function (err) { });

            /////////////////////////////
            $scope.StartUTimer();
        }, 1000 * 60);
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

            $scope.selectedTabDateIndex = 0;
            setTimeout(function () {
                $scope.refreshHeights();
            }, 500);

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
    ////////////////////////////////////
    $scope.logFlight = null;
    $scope.ati_flight = null;
    $scope.ati_resid = null;
    $scope.flightClicked = function (flt) {
        //zool
        // flt.ChocksOut=(new Date(flt.ChocksOut)).addMinutes(35);
        // alert('click');
        //$scope.showLogX(false);
        $scope.ati_flight = flt;
        $scope.ati_resid = flt.RegisterID;
        $scope.logFlight = JSON.parse(JSON.stringify(flt));

        $scope.showLogX(false);


    };
    //2020-12-29
    function getMinutesBetweenDates(startDate, endDate) {
        var diff = endDate.getTime() - startDate.getTime();
        return (diff / 60000);
    }
    $scope.bl = '';
    $scope.fl = '';
    $scope.flightSingleClickedMain = function (flt) {

        $scope.ati_flight = flt;
        //console.log('$scope.ati_flight');
        var offblock = !flt.ChocksOut ? flt.STD : flt.ChocksOut;
        var onblock = !flt.ChocksIn ? flt.STA : flt.ChocksIn;

        var takeoff = !flt.Takeoff ? flt.STD : flt.Takeoff;
        var landing = !flt.Landing ? flt.STA : flt.Landing;

        var mins = getMinutesBetweenDates(new Date(offblock), new Date(onblock));
        var mins2 = getMinutesBetweenDates(new Date(takeoff), new Date(landing));
        $scope.bl = pad(Math.floor(mins / 60).toString()) + ':' + pad(Math.floor(mins % 60).toString());
        $scope.fl = pad(Math.floor(mins2 / 60).toString()) + ':' + pad(Math.floor(mins2 % 60).toString());



    };
    $scope.flightSingleClicked = function (flt, $event) {
        //aidin
        $('.flightareasmall').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.ati_flight = flt;
        $scope.ati_resid = flt.RegisterID;
        $scope.logFlight = JSON.parse(JSON.stringify(flt));



        $scope.showLogX(false);
    }
    ///////////////////////////////////////
    $scope.ati_selectedFlights = [];
    $scope.selectionElement = null;
    $scope.initSelection = function () {
        /////////////////////////////////
        //if ($(window).width() < 1200)
        //  return;

        // Initialize selectionjs
        //const selection 
        $scope.selectionElement = Selection.create({

            // Class for the selection-area
            class: 'selection',

            // All elements in this container can be selected
            selectables: ['.box-wrap1 > .flightarea'],

            // The container is also the boundary in this case
            boundaries: ['.mainselection']
        }).on('beforestart', evt => {


            return true; //evt.oe.target.tagName !== 'SPAN';

        }).on('start', ({ inst, selected, oe }) => {
            $scope.selectedFDPId = null;
            $scope.selectedFDP = null;
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
            //$scope.ati_selectedTypes=[];
            //alert('stop');



            $.each(selected, function (_i, _d) {

                var $d = $(_d);
                $scope.ati_selectedFlights.push($d.data('flight'));
                // $scope.ati_selectedTypes.push($d.data('type'));


            });
            //$scope.ati_selectedTypes=Enumerable.From($scope.ati_selectedTypes).Distinct().ToArray();


        });

        ///////////////////////////////////
    };

    ///////////////////////////////////////
    $scope.absHeight = 60;
    $scope.search = function () {
        $scope.stop();
        $scope.StopUTimer();
        $scope.bindFlights(function () {
            $scope.createGantt();
            $scope.initSelection();
            if ($(window).width() >= 1200)
                $('.gantt-main-container').height($(window).height() - 155 - $scope.absHeight);
            else
                $('.gantt-main-container').height($(window).height() - 145);
        });
    };
    $scope.btn_search = {
        //text: 'Search',
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
            $scope.ati_selectedFlights = [];
            $scope.ati_flight = null;
            $scope.ati_resid = null;
            $scope.search();

        }

    };
    ///////////////////////////////////////
    //2020-10-27 1 s
    $scope.getNoCrew = function () {
        if ($scope.dg_nocrew_ds == null) {
            $scope.loadingVisible = true;
            flightService.getNoCrews().then(function (response) {
                $scope.loadingVisible = false;

                $scope.dg_nocrew_ds = response;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
            $scope.dg_nocrew_instance.refresh();
    };

    //magu2-23
    $scope.noCrewGroup = false;
    $scope.addCrew = function () {
        $scope.noCrewGroup = false;
        $scope.popup_nocrew_visible = true;
    };
    $scope.addCrewGroup = function () {
        $scope.noCrewGroup = true;
        $scope.popup_nocrew_visible = true;
    };
    //////////
    $scope.removeCrew = function () {
        $scope.dg_crew_abs_selected = $rootScope.getSelectedRow($scope.dg_crew_abs_instance);
        if (!$scope.dg_crew_abs_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        if ($scope.dg_crew_abs_selected.JobGroupCode.startsWith('00101') || $scope.dg_crew_abs_selected.JobGroupCode.startsWith('00102')) {
            General.ShowNotify('The flight crew can not be removed', 'error');
            return;
        }
        var entity = { userId: $scope.dg_crew_abs_selected.CrewId, flightId: $scope.flight.ID };
        $scope.loadingVisible = true;
        flightService.deleteNoCrewFDP(entity).then(function (response) {
            $scope.loadingVisible = false;
            $scope.getCrewAbs($scope.logFlight.ID);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bind_nocrew = function () {

    };
    $scope.dg_nocrew_columns = [


        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 150 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


    ];
    $scope.dg_nocrew_selected = null;
    $scope.dg_nocrew_instance = null;
    $scope.dg_nocrew_ds = null;
    $scope.dg_nocrew = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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
        height: 480,
        columnAutoWidth: false,


        columns: $scope.dg_nocrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_nocrew_instance)
                $scope.dg_nocrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_nocrew_selected = null;
            }
            else
                $scope.dg_nocrew_selected = data;


        },

        onRowPrepared: function (e) {
            //if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },


        bindingOptions: {
            dataSource: 'dg_nocrew_ds',

        },
        columnChooser: {
            enabled: false
        },

    };
    $scope.popup_nocrew_visible = false;
    $scope.popup_nocrew_title = 'Employees';


    $scope.popup_nocrew = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_nocrew"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 600,
        width: 600,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Add', icon: '', onClick: function (e) {



                        $scope.dg_nocrew_selected = $rootScope.getSelectedRow($scope.dg_nocrew_instance);
                        if (!$scope.dg_nocrew_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }

                        if (!$scope.noCrewGroup) {
                            var exist = Enumerable.From($scope.dg_crew_abs_ds).Where('$.CrewId==' + $scope.dg_nocrew_selected.Id).FirstOrDefault();
                            if (exist) {
                                General.ShowNotify('The selected employee already assigned', 'error');
                                return;
                            }


                            var entity = { userId: $scope.dg_nocrew_selected.Id, code: $scope.dg_nocrew_selected.JobGroupCode, flightId: $scope.flight.ID };
                            $scope.loadingVisible = true;
                            flightService.saveNoCrewFDP(entity).then(function (response) {
                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');



                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else {
                            var entity = { userId: $scope.dg_nocrew_selected.Id, code: $scope.dg_nocrew_selected.JobGroupCode, };
                            entity.flightIds = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray().join('_');
                            $scope.loadingVisible = true;
                            flightService.saveNoCrewFDPGroup(entity).then(function (response) {
                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');



                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }




                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_nocrew_visible = false;

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
            $scope.getNoCrew();
            if ($scope.dg_nocrew_instance)
                $scope.dg_nocrew_instance.refresh();
        },
        onHiding: function () {
            if (!$scope.noCrewGroup) {
                $scope.getCrewAbs($scope.logFlight.ID);
            }

            $scope.popup_nocrew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_nocrew_visible',

            title: 'popup_nocrew_title',

        }
    };
    //2021-06-16
    $scope.btn_aptrpt = {
        //text: 'Log',
        hint: 'Airport Daily Report',
        type: 'default',
        icon: 'fas fa-print',
        width: '100%',

        onClick: function (e) {
            $scope.popup_aptrpt_visible = true;
        }

    };
    $scope.popup_aptrpt_visible = false;
    $scope.popup_aptrpt_title = 'Daily Report';
    $scope.popup_aptrpt = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptrpt"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Form 1', icon: 'print', validationGroup: 'fbaptrpt', onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $window.open($rootScope.reportServer + '?type=8&apt=' + $scope.aptrpt + '&airline=FlyPersia&dt=' + moment(new Date($scope.selectedDate)).format('YYYY-MM-DD')
                            + ('&user=' + $scope.aptrpt_user) + ('&phone=' + $scope.aptrpt_phone), '_blank');




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Form 2', icon: 'print', validationGroup: 'fbaptrpt', onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $window.open($rootScope.reportServer + '?type=9&apt=' + $scope.aptrpt + '&airline=FlyPersia&dt=' + moment(new Date($scope.selectedDate)).format('YYYY-MM-DD')
                            + ('&user=' + $scope.aptrpt_user) + ('&phone=' + $scope.aptrpt_phone), '_blank');




                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {

            $scope.loadingVisible = true;
            flightService.getDayApts(new Date($scope.selectedDate)).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds_aptrpt = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            $scope.ds_aptrpt = [];

            $scope.popup_aptrpt_visible = false;

        },
        bindingOptions: {
            visible: 'popup_aptrpt_visible',

            title: 'popup_aptrpt_title',

        }
    };

    //close button
    $scope.popup_aptrpt.toolbarItems[2].options.onClick = function (e) {

        $scope.popup_aptrpt_visible = false;

    };
    $scope.aptrpt = null;
    $scope.ds_aptrpt = [];
    $scope.sb_aptrpt = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'aptrpt',
            //2020-11-16
            dataSource: 'ds_aptrpt',

        }
    };
    $scope.aptrpt_user = "";
    $scope.txt_aptuser = {

        bindingOptions: {
            value: 'aptrpt_user',

        }
    };
    $scope.aptrpt_phone = "";
    $scope.txt_aptphone = {

        bindingOptions: {
            value: 'aptrpt_phone',

        }
    };
    //////////////////////////////////////
    //nira
    $scope.IsNiraVisible = $rootScope.userName.toLowerCase().startsWith('comm.') || $rootScope.userName.toLowerCase().startsWith('sale.')
        || $rootScope.userName.toLowerCase().startsWith('demo')
        || $rootScope.userName.toLowerCase().includes('razbani');
    $scope.btn_nira = {
        text: 'NIRA',
        //hint: 'Airport Weekly Report',
        type: 'default',
        //icon: 'fas fa-print',
        width: '100%',

        onClick: function (e) {
            $window.open('#!/nira/', '_blank');
        }

    };
    //aptrange
    $scope.IsAptRangeVisible = $rootScope.userName.toLowerCase().startsWith('comm.') || $rootScope.userName.toLowerCase().startsWith('dis.')
        || $rootScope.userName.toLowerCase().startsWith('demo')
        || $rootScope.userName.toLowerCase().includes('razbani');
    $scope.btn_aptrptrange = {
        //text: 'Log',
        hint: 'Airport Weekly Report',
        type: 'default',
        icon: 'fas fa-print',
        width: '100%',

        onClick: function (e) {
            $scope.popup_aptrptrange_visible = true;
        }

    };

    $scope.aptrptrange = 'THR';
    $scope.aptrangefrom = null;
    $scope.aptrangeto = null;

    $scope.date_fromaptrange = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        onValueChanged: function (e) {
            if (!e.value)
                return;
            $scope.aptrangeto = (new Date(e.value)).addDays(6);
        },
        bindingOptions: {
            value: 'aptrangefrom',

        }
    };
    $scope.date_toaptrange = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'aptrangeto',

        }
    };
    $scope.sb_aptrptrange = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),

        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'IATA',
        bindingOptions: {
            value: 'aptrptrange',


        }
    };
    $scope.popup_aptrptrange_visible = false;
    $scope.popup_aptrptrange_title = 'Weekly Report';
    $scope.popup_aptrptrange = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptrptrange"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 390,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'View', icon: 'print', validationGroup: 'fbaptrptrange', onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if ($scope.apt_rpt_type == 'Weekly')
                            $window.open($rootScope.reportServer + '?type=10&apt=' + $scope.aptrptrange
                                + '&airline=CASPIAN&dtfrom=' + moment(new Date($scope.aptrangefrom)).format('YYYY-MM-DD')
                                + '&dtto=' + moment(new Date($scope.aptrangeto)).format('YYYY-MM-DD'), '_blank');
                        else
                            $window.open($rootScope.reportServer + '?type=13&apt=' + $scope.aptrptrange
                                + '&airline=CASPIAN&dtfrom=' + moment(new Date($scope.aptrangefrom)).format('YYYY-MM-DD')
                                , '_blank');




                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {

            $scope.aptrangefrom = new Date($scope.selectedDate);

            //flightService.getDayApts(new Date($scope.selectedDate)).then(function (response) {
            //    $scope.loadingVisible = false;
            //    $scope.ds_aptrpt = response;

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {


            $scope.popup_aptrptrange_visible = false;

        },
        bindingOptions: {
            visible: 'popup_aptrptrange_visible',

            title: 'popup_aptrptrange_title',

        }
    };

    //close button
    $scope.popup_aptrptrange.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_aptrptrange_visible = false;

    };

    $scope.apt_rpt_type = 'Weekly';
    $scope.sb_aptrange_report_type = {
        dataSource: ['Daily', 'Weekly'],

        showClearButton: false,

        bindingOptions: {
            value: 'apt_rpt_type',

        }
    };
    ////////////10-12 excel////////////
    $scope.IsFileUploaderVisible = true;
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_file = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        selectButtonText: 'Upload XLSX',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: "http://localhost:12271/api/uploadfile",
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            console.log('upload message', e.request.responseText);
            if (!e.request.responseText) {
                alert("ok")
            }
            else {
                alert(e.request.responseText)
            }
        },
        bindingOptions: {
            value: 'uploaderValueImage'
        }
    }
    ///////////////////////////
    $scope.btn_aptxls = {
        //text: 'Log',
        hint: 'Airport Daily Report',
        type: 'default',
        icon: 'fas fa-file-excel',
        width: '100%',

        onClick: function (e) {
            //05-09
            //dfrom = $scope._datefrom;
            //$scope.datefrom = General.getDayFirstHour(new Date(dfrom));
            //$scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));

            //$window.open('https://api.aptaban.ir/' + 'api/xls/' + '?dt1=' + moment(new Date($scope.datefrom)).format('YYYY-MM-DD') + '&dt2=' + moment(new Date($scope.dateEnd)).format('YYYY-MM-DD'), '_blank');
            $scope.popup_tt_visible = true;
        }

    };

    $scope.aptrptday = null;
    $scope.ds_aptrptday = [];
    $scope.sb_aptrptday = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'aptrptday',
            //2020-11-16
            dataSource: 'ds_aptrptday',

        }
    };


    $scope.popup_aptday_visible = false;
    $scope.popup_aptday_title = 'Daily Report';
    $scope.popup_aptday = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_aptday"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 250,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Export', validationGroup: 'fbaptrptday', onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $window.open($rootScope.reportServer + '?type=8&apt=' + $scope.aptrpt + '&airline=FlyPersia&dt=' + moment(new Date($scope.selectedDate)).format('YYYY-MM-DD')
                            + ('&user=' + $scope.aptrpt_user) + ('&phone=' + $scope.aptrpt_phone), '_blank');




                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {

            $scope.loadingVisible = true;
            flightService.getDayApts(new Date($scope.selectedDate)).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds_aptrptday = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            $scope.ds_aptrptday = [];

            $scope.popup_aptrptday_visible = false;

        },
        bindingOptions: {
            visible: 'popup_aptrptday_visible',

            title: 'popup_aptrptday_title',

        }
    };

    //close button
    $scope.popup_aptday.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_aptrptday_visible = false;

    };

    ///////////////////////
    //05-07
    $scope.chr = {
        Id: -1,
        FlightId: -1,
        ChartererId: -1,
        Book: null,
        Capacity: 0,
        Remark: null,
        Adult: 0,
        Child: 0,
        Infanct: 0,
        Code: null,
        Total: 0,

    };
    $scope.chr_ds = null;
    $scope.chr_id = null;
    $scope.sb_chr = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title1",
        valueExpr: 'Id',
        searchExpr: ["Title1", "Title2", "Code", "NiraCode"],
        onSelectionChanged: function (e) {
            $scope.chr.Code = null;
            if (e.selectedItem) {
                $scope.chr.Code = e.selectedItem.Code;


            }
        },
        bindingOptions: {
            dataSource: 'chr_ds',
            value: 'chr.ChartererId',


        }
    };
    $scope.chr_code = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'chr.Code',
        }
    };

    $scope.chr_capacity = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'chr.Capacity',

        }
    };
    $scope.set_chr_total = function () {
        $scope.chr.Total = $scope.chr.Adult + $scope.chr.Child + $scope.chr.Infanct;
    };
    $scope.chr_adult = {
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) { $scope.set_chr_total(); },
        bindingOptions: {
            value: 'chr.Adult',

        }
    };
    $scope.chr_child = {
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) { $scope.set_chr_total(); },
        bindingOptions: {
            value: 'chr.Child',

        }
    };
    $scope.chr_infant = {
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) { $scope.set_chr_total(); },
        bindingOptions: {
            value: 'chr.Infanct',

        }
    };
    $scope.chr_total = {
        min: 0,
        showSpinButtons: true,

        bindingOptions: {
            value: 'chr.Total',

        }
    };
    $scope.chr_remark = {
        width: '100%',
        bindingOptions: {
            value: 'chr.Remark',


        }
    };
    $scope.btn_add_chr = {
        text: 'Add',
        type: 'default',

        width: '110',

        bindingOptions: {},
        onClick: function (e) {

            if (!$scope.chr.ChartererId || $scope.chr.ChartererId == -1) {
                General.ShowNotify("Please select the CHARTERER", 'error');
                return;
            }
            if (!$scope.chr.Capacity || $scope.chr.Capacity == 0) {
                General.ShowNotify("Please fill in the CAPACITY", 'error');
                return;
            }

            var exist = Enumerable.From($scope.dg_chr_ds).Where('$.ChartererId==' + $scope.chr.ChartererId).FirstOrDefault();
            if (exist) {
                General.ShowNotify("The select CHARTERER already exists.", 'error');
                return;
            }
            $scope.loadingVisible = true;
            $scope.chr.FlightId = $scope.flight.ID;
            flightService.saveFlightCharterer($scope.chr).then(function (response) {
                $scope.loadingVisible = false;

                var rec = response;
                $scope.dg_chr_ds.push(rec);
                $scope.chr = {
                    Id: -1,
                    FlightId: -1,
                    ChartererId: -1,
                    Book: null,
                    Capacity: 0,
                    Remark: null,
                    Adult: 0,
                    Child: 0,
                    Infanct: 0,
                    Code: null,
                    Total: 0,

                };

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            ////////////////

        }

    };


    $scope.btn_del_chr = {
        text: 'Remove',
        type: 'danger',

        width: '110',

        bindingOptions: {},
        onClick: function (e) {

            var selected = $rootScope.getSelectedRow($scope.dg_chr_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var dto = { Id: selected.Id };
            //cateringItemRemove
            $scope.loadingVisible = true;
            flightService.deleteFlightCharterer(dto).then(function (response) {
                $scope.loadingVisible = false;


                $scope.dg_chr_ds = Enumerable.From($scope.dg_chr_ds).Where('$.Id!=' + selected.Id).ToArray();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };

    $scope.popup_chr_visible = false;
    $scope.popup_chr_title = 'Charterers';
    $scope.popup_chr = {
        shading: true,
        width: 1400,
        height: 750, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_chr_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            //$scope.flight
            if (!$scope.chr_ds) {
                $scope.loadingVisible = true;
                flightService.getCharterers().then(function (response) {
                    $scope.chr_ds = response;
                    $scope.loadingVisible = false;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }
            $scope.dg_chr_ds = [];


            //$scope.ctr_stn_ds.push({ Id: $scope.flight.FromAirport, Title: $scope.flight.FromAirportIATA });
            //$scope.ctr_stn_ds.push({ Id: $scope.flight.ToAirport, Title: $scope.flight.ToAirportIATA });
            //$scope.ctr_stn = $scope.flight.FromAirport;
            flightService.getFlightCharterers($scope.flight.ID).then(function (response) {
                $scope.dg_chr_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            $scope.dg_chr_ds = [];
            $scope.chr = {
                Id: -1,
                FlightId: -1,
                ChartererId: -1,
                Book: null,
                Capacity: 0,
                Remark: null,
                Adult: 0,
                Child: 0,
                Infanct: 0,
                Code: null,
                Total: 0,

            };
            $scope.popup_chr_visible = false;

        },
        bindingOptions: {
            visible: 'popup_chr_visible',

            title: 'popup_chr_title',

        }
    };


    $scope.dg_chr_columns = [
        { dataField: 'Title1', caption: 'Charterer', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'Capacity', caption: 'Capacity', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        { dataField: 'Adult', caption: 'Adult', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        { dataField: 'Child', caption: 'Child', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        { dataField: 'Infanct', caption: 'Infant', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },


        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 600, },

        { dataField: 'Total', caption: 'Total', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right', alignment: 'center', },
        { dataField: 'TotalRev', caption: 'Rev.', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right', alignment: 'center', },


    ];
    $scope.dg_chr_selected = null;
    $scope.dg_chr_instance = null;
    $scope.dg_chr_ds = [];
    $scope.dg_chr = {
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
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 450,// 490 

        columns: $scope.dg_chr_columns,
        onContentReady: function (e) {
            if (!$scope.dg_chr_instance)
                $scope.dg_chr_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_chr_selected = null;

            }
            else {
                $scope.dg_chr_selected = data;

            }
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data") {
                if ((e.data.TotalRev) > e.data.Capacity) {
                    e.cellElement.css("backgroundColor", "#ff9999");
                    e.cellElement.css("color", "#000");
                }
            }
        },
        onRowPrepared: function (e) {


        },

        onRowUpdated: function (e) {


        },
        summary: {
            totalItems: [
                {
                    column: "Total",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "TotalRev",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
            ]
        },

        bindingOptions: {
            dataSource: 'dg_chr_ds',

        }
    };



    ///////////////////////
    //05-09
    $scope.popup_tt_visible = false;
    $scope.popup_tt_title = 'Options';
    $scope.popup_tt = {
        shading: true,
        width: 600,
        height: 750, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Download', icon: 'save', onClick: function (e) {
                        dfrom = $scope._datefrom;
                        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
                        $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));

                        $window.open(/*'https://api.aptaban.ir/'*/'http://localhost:12271/' + 'api/xls/' + '?dt1=' + moment(new Date($scope.datefrom)).format('YYYY-MM-DD') + '&dt2=' + moment(new Date($scope.dateEnd)).format('YYYY-MM-DD') + "&chr=" + $scope.tt_chr + "&crew=" + $scope.tt_crew + "&cnl=" + $scope.tt_cnl + "&sort=" + $scope.tt_sort + "&time=" + $scope.tt_time + "&sep=" + ($scope.tt_sepdate ? 1 : 0), '_blank');
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_tt_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {

            $scope.popup_tt_visible = false;

        },
        bindingOptions: {
            visible: 'popup_tt_visible',

            title: 'popup_tt_title',

        }
    };

    $scope.tt_sheets = true;
    $scope.tt_chb_sheets = {
        text: 'Seperate Sheets',
        bindingOptions: {

            value: 'tt_sheets',

        }
    };

    $scope.tt_chr = 2;
    $scope.sb_tt_chr = {
        placeholder: 'Cherterer',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: -1, Title: 'Do Not Show' }, { Id: 1, Title: 'By Code' }, { Id: 2, Title: 'By Name' }],

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_chr',
        }
    };

    $scope.tt_cnl = -1;
    $scope.sb_tt_cnl = {
        placeholder: 'Cancelled Flights',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: -1, Title: 'Do Not Show' }, { Id: 1, Title: 'Show' },],

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_cnl',
        }
    };

    $scope.tt_time = 1;
    $scope.sb_tt_time = {
        placeholder: 'Time Zone',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'UTC, Local' }, { Id: 2, Title: 'UTC' }, { Id: 3, Title: 'Local' }],
        disabled: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_time',
        }
    };

    $scope.tt_sort = 2;
    $scope.sb_tt_sort = {
        placeholder: 'Sort By',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'Dep, Station' }, { Id: 2, Title: 'A/C Type, Register, Dep' }, { Id: 3, Title: 'Dep' }, { Id: 4, Title: 'Station, Dep' }],

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_sort',
        }
    };

    $scope.tt_crew = -1;
    $scope.sb_tt_crew = {
        placeholder: 'Crew',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: -1, Title: 'Do Not Show' }, { Id: 1, Title: 'Cockpit' }, { Id: 2, Title: 'Cabin' }, { Id: 3, Title: 'Cockpit & Cabin' }],

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_crew',
        }
    };

    $scope.tt_sepdate = true;
    $scope.chb_sepdate = {

        text: 'Seperated By Days',
        bindingOptions: {
            value: 'tt_sepdate',

        }
    };
    /////////////////////////////
    $scope.mchr = {
        ChartererId: null,
        Code: null,
        Title: null,
        Adult: 0,
        Child: 0,
        Infant: 0,
        Capacity: 0,
    };
    $scope.mchr_ds = null;
    $scope.mchr_id = null;
    $scope.sb_mchr = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title1",
        valueExpr: 'Id',
        searchExpr: ["Title1", "Title2", "Code", "NiraCode"],
        valueChangeEvent: 'keyup',
        onSelectionChanged: function (e) {
            $scope.chr.Code = null;
            if (e.selectedItem) {
                $scope.mchr.Code = e.selectedItem.Code;
                $scope.mchr.Title = e.selectedItem.Title1;


            }
            else {
                $scope.mchr = {
                    ChartererId: null,
                    Code: null,
                    Title: null,
                    Adult: 0,
                    Child: 0,
                    Infant: 0,
                    Capacity: 0,
                };
            }
        },
        bindingOptions: {
            dataSource: 'mchr_ds',
            value: 'mchr.ChartererId',
            //05-12
            readOnly: 'NotIsComm',


        }
    };


    $scope.mchr_capacity = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'mchr.Capacity',

        }
    };

    $scope.mchr_adult = {
        min: 0,
        showSpinButtons: true,

        bindingOptions: {
            value: 'mchr.Adult',

        }
    };
    $scope.mchr_child = {
        min: 0,
        showSpinButtons: true,

        bindingOptions: {
            value: 'mchr.Child',

        }
    };
    $scope.mchr_infant = {
        min: 0,
        showSpinButtons: true,

        bindingOptions: {
            value: 'mchr.Infant',

        }
    };
    //////////////////////////
    //  $scope.atcUrl = $sce.trustAsResourceUrl("http://localhost:20005/upload/atc/atc-2022820152230.png");
    $scope.uploaderValueATC = [];
    $scope.uploadedATC = null;
    $scope.uploader_atc = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        selectButtonText: 'Upload ATC Flight Plan',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: apiapsb+ "api/upload/atc/flightplan",
        onValueChanged: function (arg) {

        },

        onUploaded: function (e) {
            $scope.uploadedATC = e.request.responseText;
            console.log('upload atc', e.request.responseText);

            if (e.request.responseText) {
                $scope.loadingVisible = true;
                flightService.updateATC($scope.ati_selectedFlights[0].ID, e.request.responseText.replace('"', '').replace("'", "").replace('.', 'X')).then(function (response) {
                    $scope.loadingVisible = false;
                    alert("ATC Flight Plan Uploaded.");
                    $scope.atcTXT = e.request.responseText.replace('"', '').replace('"', '').replace("'", "").replace("'", "");
                    $scope.isATCFile = true;
                    //  $scope.atcUrl=  $sce.trustAsResourceUrl("http://localhost:20005/upload/atc/atc-2022820152230.png");
                    e.component.reset();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                alert('ERROR');
                e.component.reset();
            }
        },
        //bindingOptions: {
        //    value: 'uploaderValueATC'
        //}
    }


    //2023
    $scope.fltdocClick = function (key) {
         
        if (key == 'spwwx') {
            $scope.popup_fltdoc_title = 'Special WX';
            $scope.popup_fltdoc_visible = true;
        }
    };



    $scope.uploaderValueFltDoc = [];
    $scope.uploadedFltDoc = null;
    $scope.uploader_fltdoc = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        selectButtonText: 'Upload Document',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: apiapsb + "api/upload/atc/flightplan",
        onValueChanged: function (arg) {

        },

        onUploaded: function (e) {
            $scope.uploadedFltDoc = e.request.responseText;
            console.log('upload doc', e.request.responseText);

            if (e.request.responseText) {
                alert("ATC Flight Plan Uploaded.");
                e.component.reset();
                 
            }
            else {
                alert('ERROR');
                e.component.reset();
            }
        },
        //bindingOptions: {
        //    value: 'uploaderValueATC'
        //}
    }


    $scope.fltdoc_remark = null;
    $scope.txt_fltdoc = {
        height: 530,
        bindingOptions: {

            value: "fltdoc_remark"
        }
    };
    $scope.isFltDocFile = false;
    $scope.btn_fltdocdnl = {
        width: 150,
        type: 'default',
        text: 'Download',
        onClick: function (e) {
            $window.open('https://api.aptaban.ir/' + $scope.atcTXT, '_blank');
        },
        bindingOptions: {
            visible: 'isFltDocFile'
        }

    };
    $scope.popup_fltdoc_visible = false;
    $scope.popup_fltdoc_title = 'DOC';
    $scope.popup_atc = {
         
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', icon: 'check', validationGroup: 'ofptext', onClick: function (e) {
                        if (!$scope.atcTXT || $scope.atcTXT.includes('atc-')) {
                            $scope.popup_atc_visible = false;

                            return;
                        }


                        var dto = { user: $rootScope.userName, fltId: $scope.ati_selectedFlights[0].ID, text: $scope.atcTXT };

                        $scope.loadingVisible = true;

                        flightService.saveATC(dto).then(function (response) {
                            $scope.loadingVisible = false;


                            $scope.popup_atc_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_atc_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.loadingVisible = true;

            //flightService.getATC($scope.ati_selectedFlights[0].ID).then(function (response) {
            //    $scope.loadingVisible = false;
            //    $scope.atcTXT = response;
            //    if ($scope.atcTXT && $scope.atcTXT.includes('atc-')) {
            //        $scope.isATCFile = true;
            //        $scope.atcTXT = $scope.atcTXT.replace('"', '').replace('"', '').replace("'", "").replace("'", "")
            //    }

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        onHiding: function () {
            $scope.isFltDocFile = false;
            //$scope.ofp = null;
            //$scope.ofp_user = null;
            //$scope.ofp_date = null;
            $scope.popup_fltdoc_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fltdoc_visible',

            title: 'popup_fltdoc_title',

        }
    };


    /////////////////////

    $scope.uploaderValueATL = [];
    $scope.uploadedATL = null;
    $scope.uploader_atl = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        selectButtonText: 'Upload ATL',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: "http://localhost:12271/api/upload/atl",
        onValueChanged: function (arg) {

        },

        onUploaded: function (e) {
            $scope.uploadedATL = e.request.responseText;
            console.log('upload atl', e.request.responseText);
            if (e.request.responseText) {
                $scope.loadingVisible = true;
                flightService.updateATL($scope.ati_selectedFlights[0].ID, e.request.responseText.replace('"', '').replace("'", "").replace('.', 'X')).then(function (response) {
                    $scope.loadingVisible = false;
                    alert("ATL Uploaded.")
                    e.component.reset();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                alert('ERROR');
                e.component.reset();
            }
        },
        //bindingOptions: {
        //    value: 'uploaderValueATL'
        //}
    }
    ///////////////////////
    //2022-06-21

    $scope.isMobile = $(window).width() <= 1400;
    $scope.selectedTabLNIndex = -1;
    $scope.$watch("selectedTabLNIndex", function (newValue) {

        try {
            var selectedTab = $scope.tabs_ln[newValue];
            $('.dep_tab').hide();
            if (selectedTab) {
                $('.' + selectedTab.id).fadeIn(100, function () { });

                if ($scope.dg_crew_lognew_instance)
                    $scope.dg_crew_lognew_instance.repaint();
            }
        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_ln = [
        { text: "Movements", id: 'dep_status' },
        { text: "Pax/Baggage/Fuel", id: 'dep_pax' },
        { text: "Crew", id: 'dep_crew' },
        { text: "Diversion/Ramp", id: 'dep_diversion' },
        { text: "Checklist", id: 'dep_checklist' },
        { text: "Equipment", id: 'dep_equipment' },
        // { text: "Delay", id: 'dep_delay' },
        //   { text: "Diversion/Ramp", id: 'dep_ramp' },

    ];
    $scope.tabs_ln_options = {
        scrollByContent: true,
        showNavButtons: true,

        elementAttr: {
            //id: 'selectedIndex',
            class: "tabsln"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;
            var dropdown_alignment = 'left';
            if ($scope.selectedTabLNIndex === 5)
                dropdown_alignment = 'right';
            var sheet = window.document.styleSheets[0];
            sheet.insertRule('.dx-overlay-wrapper {text-align: ' + dropdown_alignment + ';}', sheet.cssRules.length);
        },
        onItemRendered: function (e) {
            $scope.selectedTabLNIndex = -1;
            $scope.selectedTabLNIndex = 0;


        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_ln", deep: true },
            selectedIndex: 'selectedTabLNIndex'
        }

    };


    $scope.lognew_height = 700;


    $scope.popup_lognew_visible = false;
    $scope.popup_lognew_title = 'Flight Log';
    $scope.popup_lognew_instance = null;
    $scope.popup_lognew_full = $(window).width() <= 1200;

    $scope.scroll_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 200 : $(window).height() - 200;
    $scope.scroll_lognew_mvt = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_lognew_height',
        }
        //height: 571,
    };

    $scope.scroll_lognew_pax = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_lognew_height',
        }
        //height: 571,
    };

    $scope.scroll_lognew_div = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        // height: function () { return $(window).height() - 195 },
        bindingOptions: {
            height: 'scroll_lognew_height',
        }
        //height: 571,
    };

    $scope.scroll_lognew_checklist = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: {
            height: 'scroll_lognew_height',
        }
    };
    $scope.scroll_lognew_equipment = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: {
            height: 'scroll_lognew_height',
        }
    };


    $scope.popup_lognew_width = 1000;
    $scope.popup_lognew_height = 700;
    $scope.popup_lognew = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_lognew"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: function () {
            var wh = $(window).height();
            if (wh > 700)
                wh = 700;
            return $scope.lognew_height;
        },
        width: function () {
            var ww = $(window).width();

            if (ww > 1000)
                ww = 1000;
            return 1000;
        },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Journey Log', icon: '', onClick: function (e) {

                        //$scope.flight.ID
                        $window.open(gdapi + 'api/jl/xls/' + $scope.flight.ID, '_blank');

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Crew List / GD', icon: '', onClick: function (e) {

                        //tootnew 
                        $scope.line = [];
                        $scope.clShow = false;

                        $scope.leg1Text = "";
                        $scope.leg1Visible = false;
                        $scope.leg1Value = false;

                        $scope.leg2Text = "";
                        $scope.leg2Visible = false;
                        $scope.leg2Value = false;

                        $scope.leg3Text = "";
                        $scope.leg3Visible = false;
                        $scope.leg3Value = false;

                        $scope.leg4Text = "";
                        $scope.leg4Visible = false;
                        $scope.leg4Value = false;

                        $scope.leg5Text = "";
                        $scope.leg5Visible = false;
                        $scope.leg5Value = false;

                        $scope.leg6Text = "";
                        $scope.leg6Visible = false;
                        $scope.leg6Value = false;

                        $scope.leg7Text = "";
                        $scope.leg7Visible = false;
                        $scope.leg7Value = false;

                        $scope.leg8Text = "";
                        $scope.leg8Visible = false;
                        $scope.leg8Value = false;

                        $scope.loadingVisible = true;
                        flightService.getFlightsLine($scope.flight.ID).then(function (response) {
                            $scope.loadingVisible = false;
                            $.each(response, function (_i, _d) {
                                $scope.line.push(_d);
                                switch (_i) {
                                    case 0:
                                        $scope.leg1Text = _d.FlightNumber;
                                        $scope.leg1Visible = true;
                                        $scope.leg1Value = true;
                                        break;
                                    case 1:
                                        $scope.leg2Text = _d.FlightNumber;
                                        $scope.leg2Visible = true;
                                        $scope.leg2Value = false;
                                        break;
                                    case 2:
                                        $scope.leg3Text = _d.FlightNumber;
                                        $scope.leg3Visible = true;
                                        $scope.leg3Value = false;
                                        break;
                                    case 3:
                                        $scope.leg4Text = _d.FlightNumber;
                                        $scope.leg4Visible = true;
                                        $scope.leg4Value = false;
                                        break;
                                    case 4:
                                        $scope.leg5Text = _d.FlightNumber;
                                        $scope.leg5Visible = true;
                                        $scope.leg5Value = false;
                                        break;
                                    case 5:
                                        $scope.leg6Text = _d.FlightNumber;
                                        $scope.leg6Visible = true;
                                        $scope.leg6Value = false;
                                        break;
                                    case 6:
                                        $scope.leg7Text = _d.FlightNumber;
                                        $scope.leg7Visible = true;
                                        $scope.leg7Value = false;
                                        break;
                                    case 7:
                                        $scope.leg8Text = _d.FlightNumber;
                                        $scope.leg8Visible = true;
                                        $scope.leg8Value = false;
                                        break;
                                    default:
                                        break;
                                }
                                //doolzad
                                if ($scope.IsPickup)
                                    $scope.popup_cltrans_visible = true;
                                else
                                    //$scope.popup_cl_visible = true;
                                    // $scope.popup_clnew_visible = true;

                                    $scope.popup_clgd_visible = true;
                            });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Charterer', onClick: function (e) {
                        $scope.popup_chr_visible = true;
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'deplog', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //2020-11-22
                        flightService.getFlightGUID($scope.logFlight.ID).then(function (response) {

                            if ($scope.flightGUID != response) {
                                General.ShowNotify('Your session expired. The Flight data changed by another user. please close this window and open again.', 'error');
                                $scope.forceUpdate();
                                return;
                            }

                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 9 || $scope.logFlight.FlightStatusID == 14 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Takeoff && ($scope.logFlight.FlightStatusID == 2 || $scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 7 || $scope.logFlight.FlightStatusID == 15 || $scope.logFlight.FlightStatusID == 17)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.FlightStatusID == 3 || $scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksIn && ($scope.logFlight.FlightStatusID == 15)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }



                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Takeoff || $scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_OffBlock, 'error');
                                return;
                            }
                            if (!$scope.logFlight.ChocksOut && ($scope.logFlight.Landing || $scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if (!$scope.logFlight.Landing && ($scope.logFlight.ChocksIn)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }


                            if ($scope.logFlight.Takeoff && new Date($scope.logFlight.Takeoff) < new Date($scope.logFlight.ChocksOut)) {
                                General.ShowNotify(Config.Text_TakeOff, 'error');
                                return;
                            }
                            if ($scope.logFlight.Landing && new Date($scope.logFlight.Landing) < new Date($scope.logFlight.Takeoff)) {
                                General.ShowNotify(Config.Text_Landing, 'error');
                                return;
                            }
                            if ($scope.logFlight.ChocksIn && new Date($scope.logFlight.ChocksIn) < new Date($scope.logFlight.Landing)) {
                                General.ShowNotify(Config.Text_OnBlock, 'error');
                                return;
                            }
                            if ($scope.logFlight.FlightStatusID == 4 && !$scope.logFlight.CancelReasonId) {
                                General.ShowNotify(Config.Text_CancelReason, 'error');
                                return;
                            }



                            //////////////////////////////
                            ///////////////////////////////
                            var sumTotalDelayCodesAmount = 0;
                            if (!$scope.dg_delay_ds)
                                $scope.dg_delay_ds = [];
                            //sati new
                            sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                            if (!$scope.logFlight.TotalDelayTotalMM)
                                $scope.logFlight.TotalDelayTotalMM = 0;

                            if ($scope.logFlight.TotalDelayTotalMM > 5 && $scope.dg_delay_ds.length == 0) {
                                // General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                // return;
                            }

                            if ($scope.dg_delay_ds) {
                                if (!$scope.logFlight.TotalDelayTotalMM)
                                    $scope.logFlight.TotalDelayTotalMM = 0;
                                sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                                if ($scope.logFlight.FlightStatusID != 5 && (sumTotalDelayCodesAmount > 5 && sumTotalDelayCodesAmount != $scope.logFlight.TotalDelayTotalMM) && $scope.logFlight.ChocksOut) {
                                    //  General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                    //  return;
                                }
                            }


                            var dto = {
                                StatusLog: [],
                            };




                            $scope.fillDto(dto);
                            $scope.fillLog(dto);

                            dto.NightTime = $scope.logFlight.NightTime;
                            dto.JLBLHH = $scope.logFlight.JLBLHH;
                            dto.SendDelaySMS = $scope.sms_delay ? 1 : 0;
                            dto.SendCancelSMS = $scope.sms_cancel ? 1 : 0;
                            dto.SendNiraSMS = $scope.sms_nira ? 1 : 0;

                            dto.FuelDensity = $scope.logFlight.FuelDensity;
                            dto.SerialNo = $scope.logFlight.SerialNo;
                            dto.LTR = $scope.logFlight.LTR;

                            $scope.loadingVisible = true;
                            logService.saveFlightLog(dto).then(function (response) {

                                // flightService.sendMVT($scope.logFlight.ID, 'demo');
                                // flightService.sendLDM($scope.logFlight.ID, 'demo');


                                for (var key of Object.keys(response.flight)) {


                                    $scope.ati_flight[key] = response.flight[key];

                                }
                                $scope.modifyFlightTimes($scope.ati_flight);
                                $scope.modifyGantt($scope.ati_flight, response.ressq[0]);




                                $scope.getBoardSummary($scope.selectedDate);
                                // $scope.before_refreshed_flight = null;
                                $scope.loadingVisible = false;
                                $scope.sms_delay = false;
                                $scope.sms_cancel = false;
                                $scope.sms_nira = false;
                                $scope.popup_lognew_visible = false;

                                //$scope.calculateSummary();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





                            /////////////////////////////////////
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_lognew_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],

        visible: false,

        closeOnOutsideClick: false,




        onShowing: function (e) {
            $scope.selectedTabLNIndex = -1;
            $scope.depReadOnly = false;

            $scope.IsSave = $scope.IsEditable || $scope.IsStaion;
            if ($scope.IsStaion) {

                $scope.IsSave = $scope.logFlight.FromAirportIATA == $rootScope.Station || $scope.logFlight.ToAirportIATA == $rootScope.Station;
            }
            $scope.popup_lognew_instance.repaint();

            if ($scope.logFlight.FlightStatusID == 4) {
                $scope.time_status_value = new Date($scope.logFlight.CancelDate);
            }
            else
                if ($scope.logFlight.FlightStatusID == 9) {
                    $scope.time_status_value = new Date($scope.logFlight.RampDate);
                }

            if ($scope.logFlight.RedirectReasonId) {

                $scope.time_redirect_value = new Date($scope.logFlight.RedirectDate);
                $scope.entity_redirect.AirportId = $scope.logFlight.ToAirport;

            }
            //hook

            $scope.depReadOnly = false;


        },
        onShown: function (e) {

            $scope.selectedTabLNIndex = 0;
            $scope.loadingVisible = true;
            flightService.getFlightDelays($scope.logFlight.ID).then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {

                    var dc = {
                        Id: _d.ID, //_d.DelayCodeId,
                        DelayCodeId: _d.DelayCodeId,
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

                $scope.convertUTCEnabled = true;
                if ($scope.doUTC) { $scope.timeBase = 'UTC'; }
                else { $scope.timeBase = 'LCB'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);

                // }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        onHiding: function () {
            if ($scope.before_refreshed_flight) {

                $scope.undoRefresh();
                // console.log($scope.flight);
                $scope.before_refreshed_flight = null;
            }
            if (!$scope.doUTC)
                $scope.timeBase = 'LCB';



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;
            $scope.entity_redirect.ToAirportId = null;
            $scope.popup_lognew_visible = false;


        },



        onContentReady: function (e) {
            if (!$scope.popup_lognew_instance)
                $scope.popup_lognew_instance = e.component;
            if (e.component) {

                var contentElement = e.component.content();

                contentElement[0].style.padding = '0px !important';
            }


        },
        bindingOptions: {
            visible: 'popup_lognew_visible',
            fullScreen: 'popup_lognew_full',
            title: 'popup_lognew_title',
            'toolbarItems[0].visible': 'IsSave',

        }
    };



    $scope.dg_crew_lognew_columns = [
        //{
        //    caption: 'Crew', columns: [
        //         { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        //        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, fixed: true, fixedPosition: 'left' },

        //        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //         { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
        //           {
        //               dataField: 'RP', caption: 'Pickup', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
        //                   type: "time"
        //               }, format: "HH:mm"
        //           },



        //    ]
        //}
        { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 300, },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
        {
            dataField: 'RP', caption: 'Pickup', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
                type: "time"
            }, format: "HH:mm"
        },
    ];
    $scope.dg_crew_lognew_selected = null;
    $scope.dg_crew_lognew_instance = null;
    $scope.dg_crew_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 250 : $(window).height() - 250;
    $scope.dg_crew_lognew = {
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


        columns: $scope.dg_crew_lognew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_lognew_instance)
                $scope.dg_crew_lognew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_lognew_selected = null;

            }
            else {
                $scope.dg_crew_lognew_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_crew_abs_ds',
            height: 'dg_crew_lognew_height',
        }
    };


    ////////////////////////////////////
    //2022-08-20
    var tabsff = [
        { text: "OFP", id: 'OFP', visible: true },
        //{ text: "Arrival", id: 'arrival',  visible: true },

        { text: "Dispacth Release", id: 'DR', visible: true },
        { text: "ATC Flight Plan", id: 'ATC', visible: true },
        //{ text: "Education", id: 'education', visible: true },

        //{ text: "Course", id: 'course', visible: true },
        //{ text: "Group", id: 'group', visible: true },
        //{ text: "Employee", id: 'employee', visible: true },


    ];

    $scope.tabsff = tabsff;
    $scope.selectedTabffIndex = -1;
    $scope.$watch("selectedTabffIndex", function (newValue) {

        try {
            $scope.selectedTabff = tabsff[newValue];
            $('.tabff').hide();
            $('.' + $scope.selectedTabff.id).fadeIn(100, function () {


            });






        }
        catch (e) {

        }

    });
    $scope.tabsff_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabsff", deep: true },
            selectedIndex: 'selectedTabffIndex'
        }

    };
    ////////////////////////
    //09-02
    $scope.txt_fuelsn = {

        bindingOptions: {
            value: 'logFlight.SerialNo',
            readOnly: 'IsFuelReadOnly'

        }
    };
    $scope.fuel_den = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.FuelDensity',
            readOnly: 'IsFuelReadOnly'
        }
    };
    $scope.fuel_ltr = {
        min: 0,
        bindingOptions: {
            value: 'logFlight.LTR',
            readOnly: 'IsFuelReadOnly'
        }
    };
    ////////////////////
    $scope.btn_newtime = {
        hint: 'New Time',
        type: 'normal',
        icon: 'fas fa-history',
        width: '100%',

        onClick: function (e) {

            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            var dto = {
                ids: Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray(),
                username: '',
            };
            $scope.loadingVisible = true;
            flightService.saveNewTime(dto).then(function (response) {

                General.ShowNotify(Config.Text_SavedOk, 'success');
                $scope.loadingVisible = false;


                $.each(response, function (_i, _flt) {
                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
                    aflt.NewTime = _flt.NewTime;
                    //var oldResId = aflt.RegisterID;
                    //for (var key of Object.keys(_flt)) {


                    //    aflt[key] = _flt[key];

                    //}
                    //$scope.modifyFlightTimes(aflt);

                    //var _ressq = Enumerable.From(response.ressq).Where('$.resourceId==' + aflt.RegisterID).FirstOrDefault();
                    //$scope.modifyGantt(aflt, _ressq, oldResId);
                });




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }
    };
    //////////////////////
    $scope.btn_tbl = {
        hint: 'Edit Flights',
        type: 'default',
        icon: 'fa fa-table',
        width: '100%',

        onClick: function (e) {

            $scope.popup_tbl_visible = true;


        }
    };

    $scope.tbl_from = new Date();
    $scope.tbl_to = new Date();
    $scope.date_tbl_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'tbl_from',

        }
    };
    $scope.date_tbl_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'tbl_to',

        }
    };

    $scope.tbl_ds = [];
    $scope.tblvisible = false;
    $scope.btn_tbl_search = {
        //text: 'Search',
        type: 'success',
        icon: 'search',
        width: 40,
        validationGroup: 'tbl',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }

            var _from = moment(new Date($scope.tbl_from)).format('YYYY-MM-DD');
            var _to = moment(new Date($scope.tbl_to)).format('YYYY-MM-DD');
            $scope.loadingVisible = true;
            logService.getPlanFlights(_from, _to).then(function (response) {
                $scope.loadingVisible = false;

                console.log(response);
                $.each(response, function (_i, _d) {
                    _d.Updated = 0;
                });
                $scope.tbl_ds = response;
                $scope._new_date = new Date($scope.tbl_from);
                $scope.tblvisible = true;
                $scope.dg_tbl_instance.repaint();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }

    };

    $scope.tbl_regs = [
        { ID: 32, Register: "VAA" },
        { ID: 31, Register: "VAI" },
        { ID: 34, Register: "VAF" },
        { ID: 221, Register: "RBC" },
        { ID: 30, Register: "VAR" },
        { ID: 33, Register: "VBM" },
        { ID: 191, Register: "CNR" },
        { ID: 187, Register: "CNB" },
    ];
    $scope.tbl_apts = [
        {
            "IATA": "AWZ",
            "Id": 133133
        },
        {
            "IATA": "BND",
            "Id": 133138
        },
        {
            "IATA": "BUS",
            "Id": 152362
        },
        {
            "IATA": "BUZ",
            "Id": 133030
        },
        {
            "IATA": "DYU",
            "Id": 146698
        },
        {
            "IATA": "IFN",
            "Id": 135500
        },
        {
            "IATA": "IKA",
            "Id": 140866
        },
        {
            "IATA": "KIH",
            "Id": 140857
        },
        {
            "IATA": "KSH",
            "Id": 136644
        },
        {
            "IATA": "KWI",
            "Id": 152352
        },
        {
            "IATA": "MHD",
            "Id": 140870
        },
        {
            "IATA": "NJF",
            "Id": 152340
        },
        {
            "IATA": "OMH",
            "Id": 135507
        },
        {
            "IATA": "SRY",
            "Id": 140874
        },
        {
            "IATA": "TBS",
            "Id": 152366
        },
        {
            "IATA": "THR",
            "Id": 135502
        },
        {
            "IATA": "ZBR",
            "Id": 152331
        }
    ];
    $scope.selectedItemKeys = [];
    $scope.tbl_removed = [];
    $scope.disabled = true;
    $scope.dg_tbl_instance = null;
    $scope.dg_tbl = {
        onContentReady: function (e) {
            if (!$scope.dg_tbl_instance)
                $scope.dg_tbl_instance = e.component;

        },
        keyExpr: "ID",
        showBorders: true,
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        paging: {
            enabled: false,
        },
        editing: {
            mode: 'cell',
            allowUpdating: true,
            allowAdding: false,
            allowDeleting: true,
        },
        height: $(window).height() - 420,
        selection: {
            mode: 'single',
        },
        onEditorPrepared: function (e) {

            //if (e.parentType == 'dataRow' && e.dataField == 'FlightNumber') {
            //    e.editorElement.dxTextBox('instance').option('onValueChanged', args => {
            //        e.setValue(args.value);
            //        console.log('fn upd', args);
            //        console.log(e);
            //        e.row.values[3] = 152331;

            //    });
            //    //console.log(e);
            //}
            //if (e.parentType == 'dataRow' && e.dataField == 'FromAirport') {
            //    e.editorElement.dxSelectBox('instance').option('onSelectionChanged', function (arg) {
            //        //your actions here 
            //        console.log('lookup', arg);
            //        console.log(e);
            //    });
            //}  

        },
        onSelectionChanged(data) {
            $scope.selectedItemKeys = data.selectedRowKeys;
            $scope.disabled = !$scope.selectedItemKeys.length;
        },

        onRowUpdating: function (e) {
            console.log('updating', e);
            if (e.newData.hasOwnProperty('FlightNumber')) { 
                var newdata = e.newData;
                if (newdata.FlightNumber) {
                    var row = Enumerable.From($scope.tbl_ds).Where('$.ID==' + e.key).FirstOrDefault();
                    // row.FromAirport = 152362;
                }

            }
            if (e.newData.hasOwnProperty('STDLocal')) {
                var newdata = e.newData;
                if (newdata.STDLocal) {
                    var row = Enumerable.From($scope.tbl_ds).Where('$.ID==' + e.key).FirstOrDefault();
                    var std_dates = (new Date(row.STDDay)).getDatePartArray();
                    var std_times = (new Date(newdata.STDLocal)).getTimePartArray();
                    var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
                    newdata.STDLocal = std;

                }

            }
            if (e.newData.hasOwnProperty('STALocal')) {
                var newdata = e.newData;
                if (newdata.STALocal) {
                    var row = Enumerable.From($scope.tbl_ds).Where('$.ID==' + e.key).FirstOrDefault();
                    var date = (new Date(row.STDDay));
                    if (Number(moment(newdata.STALocal).format('HHmm')) < Number(moment(row.STDLocal).format('HHmm')))
                        date = new Date(date.addDays(1));
                    var std_dates = (new Date(date)).getDatePartArray();
                    var std_times = (new Date(newdata.STALocal)).getTimePartArray();
                    var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
                    newdata.STALocal = std;

                }

            }
        },
        onRowUpdated: function (e) {
            //console.log(e);
            // alert('update');
            var id = e.key;
            var rec = Enumerable.From($scope.tbl_ds).Where('$.ID==' + id).FirstOrDefault();
            rec.Updated = 1;

        },
        onRowRemoved: function (e) {
            //console.log(e);
            // alert('update');
            var id = e.key;
            if (id > 0)
                $scope.tbl_removed.push(id);

        },
        onRowInserting: function (e) {
            //console.log(e);
            // alert('update');
            //var id = -1 * $scope.tbl_ds.length;
            //e.data.ID = id;

            // e.data.Updated = 1;
            // console.log('inserting', e);
        },
        onInitNewRow: function (e) {
            // e.data.ID = -1 * $scope.tbl_ds.length;
            //e.data.FlightNumber = '2333';
            //console.log('init row', e);
        },
        columns: [
            {
                dataField: 'STDDay',
                dataType: 'date',
                format: 'yyyy-MM-dd',
                alignment: 'center',
                sortIndex: 0,
                sortOrder: 'asc',
                //  calculateSortValue: function (e) { return Number(moment(new Date(e.STDDay)).format('YYYYMMDD')); },
                //moment(_d.STDLocal).format('YYYYMMDDHHmm')
                width: 130,
                validationRules: [{ type: 'required' }],
            },
            { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', minWidth: 100, },
            {
                alignment: 'center',
                dataField: 'RegisterID',
                caption: 'Register',
                width: 120,
                lookup: {
                    dataSource: $scope.tbl_regs,
                    displayExpr: 'Register',
                    valueExpr: 'ID',
                },
                sortIndex: 1,
                sortOrder: 'asc',
                validationRules: [{ type: 'required' }],
            },
            {
                alignment: 'center',
                dataField: 'FromAirport',
                caption: 'From',
                width: 120,
                lookup: {
                    dataSource: $scope.tbl_apts,
                    displayExpr: 'IATA',
                    valueExpr: 'Id',
                },
                validationRules: [{ type: 'required' }],

            },
            {
                alignment: 'center',
                dataField: 'ToAirport',
                caption: 'To',
                width: 120,
                lookup: {
                    dataSource: $scope.tbl_apts,
                    displayExpr: 'IATA',
                    valueExpr: 'Id',
                    onSelectionChanged: function (e) { console.log('lookup', e); },
                },
                validationRules: [{ type: 'required' }],
            },
            {
                caption: 'STD',
                dataField: 'STDLocal',
                dataType: 'datetime',
                editorOptions: { type: "time", },
                format: "HHmm",
                alignment: 'center',
                sortIndex: 2,
                // calculateSortValue: function (e) { return Number(moment(new Date(e.STDLocal)).format('YYYYMMDDHHmm')); },
                sortOrder: 'asc',
                width: 150,
                validationRules: [{ type: 'required' }],
            },
            {
                caption: 'STA',
                dataField: 'STALocal',
                dataType: 'datetime',
                format: "HHmm",
                editorOptions: { type: "time", },
                alignment: 'center',

                width: 100,
                validationRules: [{ type: 'required' }],
            },

            /* {
                 dataField: 'Prefix',
                 caption: 'Title',
                 width: 55,
             },
             'FirstName',
             'LastName', {
                 dataField: 'Position',
                 width: 170,
             }, {
                 dataField: 'StateID',
                 caption: 'State',
                 width: 125,
                 lookup: {
                     dataSource: states,
                     displayExpr: 'Name',
                     valueExpr: 'ID',
                 },
             }, {
                 dataField: 'BirthDate',
                 dataType: 'date',
             },
             {
                 dataField: 'STD',
                 dataType: 'datetime',
             },
             */
        ],
        onRowPrepared: function (e) {


            if (e.rowType == 'data' && e.data && e.data.Updated == 1) {
                e.rowElement.css('background', '#ffe6ff');
            }

            if (e.rowType == 'data' && e.data && e.data.ID < 0) {
                e.rowElement.css('background', '#b3f0ff');
            }

        },
        //toolbar: {
        //    items: [
        //        {
        //            name: 'addRowButton',
        //            showText: 'always',
        //        }, {
        //            location: 'after',
        //            widget: 'dxButton',
        //            options: {
        //                text: 'Delete Selected Records',
        //                icon: 'trash',
        //                onClick() {
        //                    $.each($scope.selectedItemKeys, function () {
        //                        //employeesStore.remove(this);
        //                    });
        //                    $scope.dg_tbl_instance.refresh();
        //                },
        //                bindingOptions: {
        //                    disabled: 'disabled',
        //                },
        //            },
        //        },
        //    ],
        //},
        bindingOptions: {
            'dataSource': 'tbl_ds'
        },
    };


    $scope._new_date = null;
    $scope.tbl_new_date = {
        type: "date",
        placeholder: 'Date',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        onValueChanged: function (arg) {
            $scope.setArrivalNew();
        },
        bindingOptions: {
            value: '_new_date',

        }
    };

    $scope._new_fltno = null;
    $scope.tbl_new_fltno = {
        onValueChanged: function (e) {
            var route = Enumerable.From($scope.routes).Where('$.FlightNumber=="' + e.value + '"').FirstOrDefault();
            if (route) {
                $scope._new_from = route.FromAirport;
                $scope._new_to = route.ToAirport;
                if (route.FlightM && route.FlightH) {
                    $scope._new_mm = route.FlightM;
                    $scope._new_hh = route.FlightH;
                }


            }
        },
        bindingOptions: {
            value: '_new_fltno',

        }
    };
    $scope._new_hh = null;
    $scope.tbl_new_hh = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrivalNew();
        },
        bindingOptions: {
            value: '_new_hh',

        }
    };
    $scope._new_mm = null;
    $scope.tbl_new_mm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrivalNew();
        },
        bindingOptions: {
            value: '_new_mm',

        }
    };
    $scope._new_reg = null;
    $scope.tbl_new_reg = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.tbl_regs,
        displayExpr: 'Register',
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;

        },
        searchExpr: ["Register"],

        bindingOptions: {
            value: '_new_reg',

        }
    };
    $scope._new_from = null;
    $scope.tbl_new_from = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.tbl_apts,
        displayExpr: 'IATA',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;

        },
        searchExpr: ["IATA"],

        bindingOptions: {
            value: '_new_from',

        }
    };
    $scope._new_to = null;
    $scope.tbl_new_to = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.tbl_apts,
        displayExpr: 'IATA',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;

        },
        searchExpr: ["IATA"],

        bindingOptions: {
            value: '_new_to',

        }
    };
    $scope._new_std = null;
    $scope.tbl_new_std = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.setArrivalNew();
        },
        bindingOptions: {
            value: '_new_std',

        }
    };
    $scope._new_sta = null;
    $scope.tbl_new_sta = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

            // $scope.setArrival();
        },
        bindingOptions: {
            value: '_new_sta',

        }
    };

    $scope.setArrivalNew = function () {
        if (!$scope._new_date || !$scope._new_std || $scope._new_hh == null || $scope._new_mm == null) {
            $scope._new_sta = null; return;
        }
        var std_dates = (new Date($scope._new_date)).getDatePartArray();
        var std_times = (new Date($scope._new_std)).getTimePartArray();
        var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
        var sta = new Date(std.addHours($scope._new_hh).addMinutes($scope._new_mm));
        $scope._new_sta = new Date(sta);

    };
    $scope.btn_tbl_add = {
        //text: 'Search',
        type: 'default',
        icon: 'add',
        width: 40,
        validationGroup: 'tbladd',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            // moment(date).format('YY-MM-DD HHmm') 
            var std_dates = (new Date($scope._new_date)).getDatePartArray();
            var std_times = (new Date($scope._new_std)).getTimePartArray();
            var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
            $scope._new_std = std;
            $scope.setArrivalNew();

            var rec = {
                STDDay: new Date(General.getDayFirstHour(new Date($scope._new_std))),
                RegisterID: $scope._new_reg,
                FromAirport: $scope._new_from,
                FlightNumber: $scope._new_fltno,
                ToAirport: $scope._new_to,
                STDLocal: $scope._new_std,
                STALocal: $scope._new_sta,
                Updated: 1,
                ID: -1 * ($scope.tbl_ds.length + 1),
            };
            console.log(rec);
            $scope.tbl_ds.push(rec);
            $scope._new_to = null;
            $scope._new_from = null;
            $scope._new_std = (new Date($scope._new_sta)).addHours(1);
            $scope._new_hh = null;
            $scope._new_mm = null;
            $scope._new_sta = null;
            $scope._new_fltno = null;
            $scope._new_date = new Date(General.getDayFirstHour(new Date($scope._new_std)));

            $scope.dg_tbl_instance.refresh();


        }

    };

    $scope.popup_tbl_visible = false;
    $scope.popup_tbl_title = 'Edit Flights';
    $scope.popup_tbl = {
        shading: true,
        width: 950,
        height: $(window).height() - 100,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'save', onClick: function (e) {
                        console.log('save', $scope.tbl_ds);
                        var recs = Enumerable.From($scope.tbl_ds).Where('$.Updated==1').ToArray();
                        //moment(date).format('YY-MM-DD HHmm') 
                        $.each(recs, function (_i, _d) {
                            _d.STDDay2 = moment(_d.STDDay).format('YYYYMMDD');
                            _d.STDLocal2 = moment(_d.STDLocal).format('YYYYMMDDHHmm');
                            _d.STALocal2 = moment(_d.STALocal).format('YYYYMMDDHHmm');
                        });
                        var dto = {
                            updated: recs,
                            deleted: $scope.tbl_removed,
                        };
                        console.log(dto);

                        $scope.loadingVisible = true;
                        logService.saveFlightPlan(dto).then(function (response) {
                            $scope.loadingVisible = false;


                            setTimeout(function () {

                                $scope.ati_selectedFlights = [];
                                $scope.ati_flight = null;
                                $scope.ati_resid = null;
                                $scope.search();
                            }, 2000);

                            $scope.popup_tbl_visible = false;


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_tbl_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            var _datefrom = General.getDayFirstHour(new Date($scope._datefrom));
            var _dateEnd = General.getDayLastHour(new Date(new Date($scope._datefrom).addDays($scope.days_count - 1)));
            $scope.tbl_from = _datefrom;
            $scope.tbl_to = _dateEnd;

        },
        onShown: function (e) {

            $scope.dg_tbl_instance.repaint();
        },
        onHiding: function () {
            console.log($scope.tbl_ds);
            $scope.selectedItemKeys = [];
            $scope.tbl_removed = [];
            $scope.tbl_ds = [];
            $scope.tblvisible = false;
            $scope.popup_tbl_visible = false;

        },
        position: { my: 'right', at: 'right', of: window, offset: '-15 0' },
        bindingOptions: {
            visible: 'popup_tbl_visible',

            title: 'popup_tbl_title',
            //'toolbarItems[0].visible': 'IsEditable',
            //'toolbarItems[1].visible': 'IsEditable',

        }
    };


    ///////////////////////
    $scope.routes = [
        {
            "FlightNumber": "5814",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133138,
            "ToAirportIATA": "BND",
            "cnt": 253,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5815",
            "FromAirport": 133138,
            "FromAirportIATA": "BND",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 253,
            "FlightH": 1,
            "FlightM": 50
        },
        {
            "FlightNumber": "5840",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 253,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5841",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 252,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5858",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152331,
            "ToAirportIATA": "ZBR",
            "cnt": 252,
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "5859",
            "FromAirport": 152331,
            "FromAirportIATA": "ZBR",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 252,
            "FlightH": 2,
            "FlightM": 25
        },
        {
            "FlightNumber": "5818",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 252,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5802",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 252,
            "FlightH": 1,
            "FlightM": 5
        },
        {
            "FlightNumber": "5803",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 252,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5819",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 251,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5852",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 247,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "5853",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 247,
            "FlightH": 1,
            "FlightM": 5
        },
        {
            "FlightNumber": "5872",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133030,
            "ToAirportIATA": "BUZ",
            "cnt": 244,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "5873",
            "FromAirport": 133030,
            "FromAirportIATA": "BUZ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 244,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5820",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 229,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5821",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 229,
            "FlightH": 1,
            "FlightM": 50
        },
        {
            "FlightNumber": "5854",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 197,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5855",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 197,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5816",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133138,
            "ToAirportIATA": "BND",
            "cnt": 155,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5817",
            "FromAirport": 133138,
            "FromAirportIATA": "BND",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 155,
            "FlightH": 1,
            "FlightM": 50
        },
        {
            "FlightNumber": "5857",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 138,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5856",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 129,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5826",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 133138,
            "ToAirportIATA": "BND",
            "cnt": 128,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5827",
            "FromAirport": 133138,
            "FromAirportIATA": "BND",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 128,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5810",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 107,
            "FlightH": 1,
            "FlightM": 55
        },
        {
            "FlightNumber": "5811",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 107,
            "FlightH": 1,
            "FlightM": 45
        },
        {
            "FlightNumber": "5806",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 99,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5807",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 99,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6821",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 79,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6822",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 78,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6813",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 76,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5905",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 76,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "6814",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 75,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "5904",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 75,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5880",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135857,
            "ToAirportIATA": "ABD",
            "cnt": 74,
            "FlightH": 2,
            "FlightM": 5
        },
        {
            "FlightNumber": "5881",
            "FromAirport": 135857,
            "FromAirportIATA": "ABD",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 74,
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "5823",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 73,
            "FlightH": 1,
            "FlightM": 50
        },
        {
            "FlightNumber": "5822",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 72,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5867",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 71,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5866",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 67,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5902",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 65,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5876",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 55,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5877",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 54,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5804",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 54,
            "FlightH": 1,
            "FlightM": 5
        },
        {
            "FlightNumber": "6819",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 52,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6820",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 52,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6808",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152366,
            "ToAirportIATA": "TBS",
            "cnt": 51,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6809",
            "FromAirport": 152366,
            "FromAirportIATA": "TBS",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 51,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5805",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 51,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5886",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152331,
            "ToAirportIATA": "ZBR",
            "cnt": 49,
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "5887",
            "FromAirport": 152331,
            "FromAirportIATA": "ZBR",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 49,
            "FlightH": 2,
            "FlightM": 25
        },
        {
            "FlightNumber": "5833",
            "FromAirport": 135857,
            "FromAirportIATA": "ABD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 45,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5910",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135857,
            "ToAirportIATA": "ABD",
            "cnt": 42,
            "FlightH": 2,
            "FlightM": 5
        },
        {
            "FlightNumber": "5838",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135866,
            "ToAirportIATA": "SYZ",
            "cnt": 41,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5839",
            "FromAirport": 135866,
            "FromAirportIATA": "SYZ",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 41,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5903",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 37,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "6802",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 146698,
            "ToAirportIATA": "DYU",
            "cnt": 36,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6803",
            "FromAirport": 146698,
            "FromAirportIATA": "DYU",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 36,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5846",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 33,
            "FlightH": 2,
            "FlightM": 5
        },
        {
            "FlightNumber": "5847",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 33,
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "5828",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 29,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5829",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 29,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5824",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 22,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5825",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 21,
            "FlightH": 1,
            "FlightM": 50
        },
        {
            "FlightNumber": "5842",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152334,
            "ToAirportIATA": "GSM",
            "cnt": 16,
            "FlightH": 1,
            "FlightM": 35
        },
        {
            "FlightNumber": "5843",
            "FromAirport": 152334,
            "FromAirportIATA": "GSM",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 16,
            "FlightH": 2,
            "FlightM": 10
        },
        {
            "FlightNumber": "6824",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152362,
            "ToAirportIATA": "BUS",
            "cnt": 16,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6823",
            "FromAirport": 152362,
            "FromAirportIATA": "BUS",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 16,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6806",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 152379,
            "ToAirportIATA": "FRU",
            "cnt": 16,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6807",
            "FromAirport": 152379,
            "FromAirportIATA": "FRU",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 16,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6825",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 14,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "6826",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 14,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "6817",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 13,
            "FlightH": 2,
            "FlightM": 10
        },
        {
            "FlightNumber": "6818",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 13,
            "FlightH": 2,
            "FlightM": 20
        },
        {
            "FlightNumber": "5907",
            "FromAirport": 135507,
            "FromAirportIATA": "OMH",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 13,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5912",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 136644,
            "ToAirportIATA": "KSH",
            "cnt": 13,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5913",
            "FromAirport": 136644,
            "FromAirportIATA": "KSH",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 13,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5830",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 13,
            "FlightH": 1,
            "FlightM": 10
        },
        {
            "FlightNumber": "5831",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 13,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "9151",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 13,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6804",
            "FromAirport": 146698,
            "FromAirportIATA": "DYU",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 12,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6805",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 146698,
            "ToAirportIATA": "DYU",
            "cnt": 12,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5914",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135507,
            "ToAirportIATA": "OMH",
            "cnt": 11,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "5906",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135507,
            "ToAirportIATA": "OMH",
            "cnt": 10,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6815",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 152352,
            "ToAirportIATA": "KWI",
            "cnt": 10,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6816",
            "FromAirport": 152352,
            "FromAirportIATA": "KWI",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 10,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5801",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 9,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5915",
            "FromAirport": 135507,
            "FromAirportIATA": "OMH",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 8,
            "FlightH": 1,
            "FlightM": 10
        },
        {
            "FlightNumber": "6831",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 152366,
            "ToAirportIATA": "TBS",
            "cnt": 8,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6832",
            "FromAirport": 152366,
            "FromAirportIATA": "TBS",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 8,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "9150",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 8,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5800",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 7,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5851",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 7,
            "FlightH": 1,
            "FlightM": 5
        },
        {
            "FlightNumber": "5850",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 6,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "0000",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 133385,
            "ToAirportIATA": "AZD",
            "cnt": 6,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "5896",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152375,
            "ToAirportIATA": "SYJ",
            "cnt": 6,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5897",
            "FromAirport": 152375,
            "FromAirportIATA": "SYJ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5908",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 5,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5908",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 5,
            "FlightH": 1,
            "FlightM": 55
        },
        {
            "FlightNumber": "5909",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 5,
            "FlightH": 1,
            "FlightM": 45
        },
        {
            "FlightNumber": "5909",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 5,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "6810",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 141866,
            "ToAirportIATA": "EVN",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6811",
            "FromAirport": 141866,
            "FromAirportIATA": "EVN",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5808",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140869,
            "ToAirportIATA": "XBJ",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5809",
            "FromAirport": 140869,
            "FromAirportIATA": "XBJ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5871",
            "FromAirport": 151300,
            "FromAirportIATA": "TBZ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 5,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "5874",
            "FromAirport": 152334,
            "FromAirportIATA": "GSM",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5875",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 152334,
            "ToAirportIATA": "GSM",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5870",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 151300,
            "ToAirportIATA": "TBZ",
            "cnt": 5,
            "FlightH": 1,
            "FlightM": 5
        },
        {
            "FlightNumber": "5868",
            "FromAirport": 152334,
            "FromAirportIATA": "GSM",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5869",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 152334,
            "ToAirportIATA": "GSM",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6829",
            "FromAirport": 103298,
            "FromAirportIATA": "BOM",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 5,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6840",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 4,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6841",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 4,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "0000",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 4,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6801",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140874,
            "ToAirportIATA": "SRY",
            "cnt": 4,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6800",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 4,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5913",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 4,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5912",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 4,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5916",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 3,
            "FlightH": 1,
            "FlightM": 55
        },
        {
            "FlightNumber": "5917",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 3,
            "FlightH": 1,
            "FlightM": 45
        },
        {
            "FlightNumber": "5904",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 3,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5898",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152355,
            "ToAirportIATA": "RJN",
            "cnt": 3,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5899",
            "FromAirport": 152355,
            "FromAirportIATA": "RJN",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 3,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "0001",
            "FromAirport": 133385,
            "FromAirportIATA": "AZD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 3,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "5836",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135866,
            "ToAirportIATA": "SYZ",
            "cnt": 3,
            "FlightH": 1,
            "FlightM": 10
        },
        {
            "FlightNumber": "5837",
            "FromAirport": 135866,
            "FromAirportIATA": "SYZ",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 3,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "6828",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 103298,
            "ToAirportIATA": "BOM",
            "cnt": 3,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6828",
            "FromAirport": 152341,
            "FromAirportIATA": "ZAH",
            "ToAirport": 103298,
            "ToAirportIATA": "BOM",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6842",
            "FromAirport": 152340,
            "FromAirportIATA": "NJF",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 2,
            "FlightH": 1,
            "FlightM": 20
        },
        {
            "FlightNumber": "6843",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 2,
            "FlightH": 1,
            "FlightM": 25
        },
        {
            "FlightNumber": "5870",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 2,
            "FlightH": 1,
            "FlightM": 15
        },
        {
            "FlightNumber": "5870",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152361,
            "ToAirportIATA": "AJK",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5871",
            "FromAirport": 152361,
            "FromAirportIATA": "AJK",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "0001",
            "FromAirport": 136647,
            "FromAirportIATA": "RAS",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "0000",
            "FromAirport": 133385,
            "FromAirportIATA": "AZD",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": 1,
            "FlightM": 0
        },
        {
            "FlightNumber": "0000",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 136647,
            "ToAirportIATA": "RAS",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "0000",
            "FromAirport": 140874,
            "FromAirportIATA": "SRY",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5832",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135857,
            "ToAirportIATA": "ABD",
            "cnt": 2,
            "FlightH": 1,
            "FlightM": 10
        },
        {
            "FlightNumber": "5899",
            "FromAirport": 152361,
            "FromAirportIATA": "AJK",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5902",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 2,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5903",
            "FromAirport": 135500,
            "FromAirportIATA": "IFN",
            "ToAirport": 135502,
            "ToAirportIATA": "THR",
            "cnt": 2,
            "FlightH": 0,
            "FlightM": 50
        },
        {
            "FlightNumber": "5898",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152361,
            "ToAirportIATA": "AJK",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5898",
            "FromAirport": 135502,
            "FromAirportIATA": "THR",
            "ToAirport": 152341,
            "ToAirportIATA": "ZAH",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5888",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 133382,
            "ToAirportIATA": "GBT",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5889",
            "FromAirport": 133382,
            "FromAirportIATA": "GBT",
            "ToAirport": 140857,
            "ToAirportIATA": "KIH",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5882",
            "FromAirport": 133138,
            "FromAirportIATA": "BND",
            "ToAirport": 140870,
            "ToAirportIATA": "MHD",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "5883",
            "FromAirport": 140870,
            "FromAirportIATA": "MHD",
            "ToAirport": 133138,
            "ToAirportIATA": "BND",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6801",
            "FromAirport": 141861,
            "FromAirportIATA": "ALA",
            "ToAirport": 140866,
            "ToAirportIATA": "IKA",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6824",
            "FromAirport": 133133,
            "FromAirportIATA": "AWZ",
            "ToAirport": 152349,
            "ToAirportIATA": "JED",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6827",
            "FromAirport": 152349,
            "FromAirportIATA": "JED",
            "ToAirport": 135500,
            "ToAirportIATA": "IFN",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6825",
            "FromAirport": 152349,
            "FromAirportIATA": "JED",
            "ToAirport": 133133,
            "ToAirportIATA": "AWZ",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        },
        {
            "FlightNumber": "6826",
            "FromAirport": 140857,
            "FromAirportIATA": "KIH",
            "ToAirport": 152349,
            "ToAirportIATA": "JED",
            "cnt": 2,
            "FlightH": null,
            "FlightM": null
        }
    ];

    ////////NEW LOG///////////////
    $scope.pax_pir_lost = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxPIRLost', } };
    $scope.pax_pir_damage = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxPIRDamage', } };
    $scope.pax_pir_found = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxPIRFound', } };
    $scope.limit_tag = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.LimitTag', } };
    $scope.rush_tag = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.RushTag', } };
    $scope.cargo_pir_lost = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CargoPIRLost', } };
    $scope.cargo_pir_damage = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CargoPIRDamage', } };
    $scope.cargo_pir_found = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CargoPIRFound', } };

    $scope.pax_adult_50 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxAdult50', } };
    $scope.pax_child_50 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxChild50', } };
    $scope.pax_infant_50 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxInfant50', } };
    $scope.pax_adult_100 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxAdult100', } };
    $scope.pax_child_100 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxChild100', } };
    $scope.pax_infant_100 = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxInfant100', } };

    $scope.y_class = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.YClass', } };
    $scope.c_class = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CClass', } };
    $scope.total_traffic_load = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.TotalTrafficLoad', } };
    $scope.pax_vip = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxVIP', } };
    $scope.pax_cip = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxCIP', } };
    $scope.pax_hum = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxHUM', } };
    $scope.pax_um = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxUM', } };
    $scope.pax_avi = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxAVI', } };
    $scope.pax_wchr = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxWCHR', } };
    $scope.pax_strc = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.PaxSTRC', } };


    //// No Show/Go and Delay Service
    $scope.no_show_count = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.NoShowCount',

        }
    };
    $scope.no_show_pieces = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.NoShowPieces',

        }
    };
    $scope.no_go_count = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.NoGoCount',

        }
    };
    $scope.no_go_pieces = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.NoGoPieces',

        }
    };
    $scope.ds_breakfast = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.DSBreakfast',

        }
    };
    $scope.ds_warmfood = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.DSWarmFood',

        }
    };
    $scope.ds_coldfood = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.DSColdFood',

        }
    };
    $scope.ds_refreshment = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.DSRefreshment',

        }
    };


    $scope.free_awb_count = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.FreeAWBCount',
        }
    };
    $scope.free_awb_pieces = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.FreeAWBPieces',
        }
    };
    $scope.free_awb_weight = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.FreeAWBWeight',
        }
    };

    $scope.cargo_cost = {
        readOnly: false,
        min: 0,
        bindingOptions: {
            value: 'logFlight.CargoCost',

        }
    };
    /////////////////Preflight Checklist

    $scope.logStation = {};

    //Date.prototype.toStringCustom = function () {
    function toStringCustom(date) {
        //console.log(date);
        if (!date)
            return null;
        date = new Date(date);
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
        var hh = date.getHours();
        var minutes = date.getMinutes();

        return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd,
        (hh > 9 ? '' : '0') + hh,
        (minutes > 9 ? '' : '0') + minutes
        ].join('');
    };

    function combineDate(timeDate, dateDate, d) {
        var prts = [];
        prts.push(dateDate.getFullYear());
        prts.push(dateDate.getMonth() + 1);
        var day = dateDate.getDate();
        var diff = 0;
        if (d == "+D")
            diff = 1;
        if (d == "-D")
            diff = -1;

        if (diff != 0)
            day = (dateDate.addDays(diff)).getDate();
        prts.push(day);
        prts.push(timeDate.getHours());//
        prts.push(timeDate.getMinutes()); //
        return new Date(prts[0], prts[1] - 1, prts[2], prts[3], prts[4], 0);
    };
    function CompareDateByHour(checkingDate, mainDate) {

        if (!checkingDate || checkingDate == 'undefined' || typeof checkingDate === 'undefined' || checkingDate === undefined)
            return null;
        try {
            if (!checkingDate)
                return null;
            const maxDelay = 12;
            var diff = mainDate.getHours() - checkingDate.getHours();
            if (Math.abs(diff) <= maxDelay) {
                return "D";
            } else if (diff + 24 <= maxDelay) {
                return "-D";
            } else if (24 - diff <= maxDelay) {
                return "+D";
            }
        }
        catch (e) {
            return null;
        }

    };


    $scope.cl_checkin_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLCheckIn', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLCheckIn) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLCheckIn), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLCheckIn = combineDate(new Date($scope.logFlight.CLCheckIn), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_checkin_hh = { hint: 'Check-In', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLCheckIn = new Date(); } };

    $scope.cl_park_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLPark', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLCheckIn) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLPark), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLPark = combineDate(new Date($scope.logFlight.CLPark), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_park_hh = { hint: 'Park', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLPark = new Date(); } };

    $scope.cl_add_tools_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLAddTools', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLAddTools) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLAddTools), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLAddTools = combineDate(new Date($scope.logFlight.CLAddTools), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_add_tools_hh = { hint: 'Additional Tools', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLAddTools = new Date(); } };

    $scope.cl_bus_ready_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLBusReady', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLBusReady) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLBusReady), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLBusReady = combineDate(new Date($scope.logFlight.CLBusReady), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_bus_ready_hh = { hint: 'Bus Ready', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLBusReady = new Date(); } };

    $scope.cl_pax_out_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLPaxOut', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLPaxOut) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLPaxOut), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLPaxOut = combineDate(new Date($scope.logFlight.CLPaxOut), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_pax_out_hh = { hint: 'PAX Out', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLPaxOut = new Date(); } };

    $scope.cl_depo_out_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLDepoOut', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLDepoOut) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLDepoOut), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLDepoOut = combineDate(new Date($scope.logFlight.CLDepoOut), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_depo_out_hh = { hint: 'Depo Out', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLDepoOut = new Date(); } };


    $scope.cl_service_presence_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLServicePresence', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLServicePresence) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLServicePresence), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLServicePresence = combineDate(new Date($scope.logFlight.CLServicePresence), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_service_presence_hh = { hint: 'Service Presence', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLServicePresence = new Date(); } };

    $scope.cl_cleaning_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLCleaningStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLCleaningStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLCleaningStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLCleaningStart = combineDate(new Date($scope.logFlight.CLCleaningStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_cleaning_start_hh = { hint: 'Cleaning Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLCleaningStart = new Date(); } };

    $scope.cl_tech_ready_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLTechReady', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLTechReady) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLTechReady), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLTechReady = combineDate(new Date($scope.logFlight.CLTechReady), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_tech_ready_hh = { hint: 'Tech Ready', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLTechReady = new Date(); } };

    $scope.cl_bag_sent_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLBagSent', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLBagSent) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLBagSent), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLBagSent = combineDate(new Date($scope.logFlight.CLBagSent), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_bag_sent_hh = { hint: 'Baggage Sent', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLBagSent = new Date(); } };

    $scope.cl_catering_load_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLCateringLoad', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLCateringLoad) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLCateringLoad), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLCateringLoad = combineDate(new Date($scope.logFlight.CLCateringLoad), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_catering_load_hh = { hint: 'Catering Load', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLCateringLoad = new Date(); } };


    $scope.cl_fuel_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLFuelStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLFuelStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLFuelStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLFuelStart = combineDate(new Date($scope.logFlight.CLFuelStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_fuel_start_hh = { hint: 'Fueling Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLFuelStart = new Date(); } };

    $scope.cl_fuel_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLFuelEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLFuelEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLFuelEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLFuelEnd = combineDate(new Date($scope.logFlight.CLFuelEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_fuel_end_hh = { hint: 'Fueling End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLFuelEnd = new Date(); } };

    $scope.cl_cleaning_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLCleaningEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLCleaningEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLCleaningEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLCleaningEnd = combineDate(new Date($scope.logFlight.CLCleaningEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_cleaning_end_hh = { hint: 'Cleaning End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLCleaningEnd = new Date(); } };

    $scope.cl_boarding_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLBoardingStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLBoardingStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLBoardingStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLBoardingStart = combineDate(new Date($scope.logFlight.CLBoardingStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_boarding_start_hh = { hint: 'Boarding Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLBoardingStart = new Date(); } };

    $scope.cl_boarding_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLBoardingEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLBoardingEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLBoardingEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLBoardingEnd = combineDate(new Date($scope.logFlight.CLBoardingEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_boarding_end_hh = { hint: 'Boarding End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLBoardingEnd = new Date(); } };


    $scope.cl_loadsheet_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLLoadSheetStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLLoadSheetStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLLoadSheetStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLLoadSheetStart = combineDate(new Date($scope.logFlight.CLLoadSheetStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_loadsheet_start_hh = { hint: 'LoadSheet Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLLoadSheetStart = new Date(); } };

    $scope.cl_gate_closed = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLGateClosed', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLGateClosed) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLGateClosed), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLGateClosed = combineDate(new Date($scope.logFlight.CLGateClosed), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_gate_closed = { hint: 'Gate Closed', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLGateClosed = new Date(); } };

    $scope.cl_traffic_crew_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLTrafficCrew', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLTrafficCrew) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLTrafficCrew), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLTrafficCrew = combineDate(new Date($scope.logFlight.CLTrafficCrew), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_traffic_crew_hh = { hint: 'Traffic Crew', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLTrafficCrew = new Date(); } };

    $scope.cl_load_crew_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLLoadCrew', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLLoadCrew) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLLoadCrew), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLLoadCrew = combineDate(new Date($scope.logFlight.CLLoadCrew), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_load_crew_hh = { hint: 'Load Crew', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLLoadCrew = new Date(); } };

    $scope.cl_forbidden_obj_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLForbiddenObj', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLForbiddenObj) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLForbiddenObj), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLForbiddenObj = combineDate(new Date($scope.logFlight.CLForbiddenObj), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_forbidden_obj_hh = { hint: 'Forbidden Objects', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLForbiddenObj = new Date(); } };


    $scope.cl_loadsheet_sign_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLLoadSheetSign', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLLoadSheetSign) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLLoadSheetSign), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLLoadSheetSign = combineDate(new Date($scope.logFlight.CLLoadSheetSign), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_loadsheet_sign_hh = { hint: 'LoadSheet Sign', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLLoadSheetSign = new Date(); } };

    $scope.cl_loading_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLLoadingEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLLoadingEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLLoadingEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLLoadingEnd = combineDate(new Date($scope.logFlight.CLLoadingEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_loading_end_hh = { hint: 'Loading End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLLoadingEnd = new Date(); } };

    $scope.cl_door_closed_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLDoorClosed', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLDoorClosed) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLDoorClosed), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLDoorClosed = combineDate(new Date($scope.logFlight.CLDoorClosed), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_door_closed_hh = { hint: 'Door Closed', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLDoorClosed = new Date(); } };

    $scope.cl_eq_dc_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLEqDC', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLEqDC) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLEqDC), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLEqDC = combineDate(new Date($scope.logFlight.CLEqDC), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_eq_dc_hh = { hint: 'Equipment Disconnected', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLEqDC = new Date(); } };

    $scope.cl_motor_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLMotorStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLMotorStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLMotorStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLMotorStart = combineDate(new Date($scope.logFlight.CLMotorStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_motor_start_hh = { hint: 'Motor Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLMotorStart = new Date(); } };


    $scope.cl_moving_starrt_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLMovingStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLMovingStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLMovingStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLMovingStart = combineDate(new Date($scope.logFlight.CLMovingStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_moving_starrt_hh = { hint: 'Moving Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLMovingStart = new Date(); } };

    $scope.cl_gpu_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLGPUStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLGPUStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLGPUStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLGPUStart = combineDate(new Date($scope.logFlight.CLGPUStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_gpu_start_hh = { hint: 'GPU Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLGPUStart = new Date(); } };

    $scope.cl_gpu_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLGPUEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLGPUEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLGPUEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLGPUEnd = combineDate(new Date($scope.logFlight.CLGPUEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_gpu_end_hh = { hint: 'GPU End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLGPUEnd = new Date(); } };

    $scope.cl_ac_start_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLACStart', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLACStart) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLACStart), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLACStart = combineDate(new Date($scope.logFlight.CLACStart), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_ac_start_hh = { hint: 'AC Start', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLACStart = new Date(); } };

    $scope.cl_ac_end_hh = {
        type: "time", width: "auto", displayFormat: "HHmm", interval: 15, showClearButton: true, rtlEnabled: true, bindingOptions: { value: 'logFlight.CLACEnd', pickerType: 'cl_pickertype' },
        onValueChanged: function (arg) {
            if ($scope.logFlight.CLACEnd) {
                var shiftDay = CompareDateByHour(new Date($scope.logFlight.CLACEnd), new Date($scope.logFlight.STD2));
                $scope.logFlight.CLACEnd = combineDate(new Date($scope.logFlight.CLACEnd), new Date($scope.logFlight.STD2), shiftDay);
            }
        }
    };
    $scope.btn_cl_ac_end_hh = { hint: 'AC End', type: 'default', icon: 'fas fa-clock', bindingOptions: {}, onClick: function (e) { $scope.logFlight.CLACEnd = new Date(); } };



    ////////////////////////////////
    ////// Equipment
    /// Equipments Tab Checkboxes
    const equipmentsSelectBox = [{ ID: 0, Status: 'استفاده شد' }, { ID: 1, Status: 'استفاده نشد' }, { ID: 2, Status: 'حضور نداشت' }];


    $scope.checkDepStairs = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepStairs', },
    };

    $scope.checkDepGPU = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepGPU', },
    };

    $scope.checkDepCrewCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepCrewCar', },
    };

    $scope.checkDepCabinService = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepCabinService', },
    };

    $scope.checkDepCateringCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepCateringCar', },
    };

    $scope.checkDepPatientCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepPatientCar', },
    };

    $scope.checkDepPaxCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepPaxCar', },
    };

    $scope.checkDepPushback = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepPushback', },
    };

    $scope.checkDepWaterService = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepWaterService', },
    };

    $scope.checkDepAC = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepAC', },
    };

    $scope.checkDepDeIce = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLDepDeIce', },
    };

    //
    $scope.checkDepCrewCarCount = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CLDepCrewCarCount', } };
    $scope.checkDepPaxCarCount = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CLDepPaxCarCount', } };
    //
    $scope.DepEquipmentsRemark = { height: 60, rtlEnabled: true, placeholder: 'سایر', bindingOptions: { value: 'logFlight.CLDepEqRemark', }, };

    /// Arrival Equipment Checklist
    $scope.checkArrStairs = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrStairs', },
    };

    $scope.checkArrGPU = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrGPU', },
    };

    $scope.checkArrCrewCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrCrewCar', },
    };

    $scope.checkArrCabinService = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrCabinService', },
    };

    $scope.checkArrPatientCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrPatientCar', },
    };

    $scope.checkArrPaxCar = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrPaxCar', },
    };


    $scope.checkArrToiletService = {
        items: equipmentsSelectBox, placeholder: 'انتخاب کنید', showClearButton: true, datasource: equipmentsSelectBox, displayExpr: 'Status', valueExpr: 'ID',
        bindingOptions: { value: 'logFlight.CLArrToiletService', },
    };
    //
    //
    $scope.checkArrCrewCarCount = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CLArrCrewCarCount', } };
    $scope.checkArrPaxCarCount = { readOnly: false, min: 0, bindingOptions: { value: 'logFlight.CLArrPaxCarCount', } };
    $scope.ArrEquipmentsRemark = { height: 60, rtlEnabled: true, placeholder: 'سایر', bindingOptions: { value: 'logFlight.CLArrEqRemark', }, };

    ///new log
    ///////////////////////
    $scope.IsGNTVisible = false;
    $scope.delayCodes = null;
    $scope.$on('$viewContentLoaded', function () {
        //2020-11-16
        $scope.getRealMSNs(Config.CustomerId, function () { });
        ////////////////////////////////
        $scope.scroll_dep_height = $(window).height() - 195;
        $scope.scroll2_height = $(window).height() - 266.5 + 87;
        $('.right-col-bottom').height(198);
        $('.right-col').height($(window).height() - 398);
        $('.board').fadeIn(400, function () {





            flightService.getCharterers().then(function (response) {
                $scope.mchr_ds = response;
                $scope.chr_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            $scope.loadingVisible = true;
            flightService.getDelayCodes().then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {
                    _d.Title2 = _d.Code + ' ' + _d.Remark;

                });
                $scope.delayCodes = response;

                setTimeout(function () {

                    $scope.search();
                    $scope.IsGNTVisible = true;
                }, 1500);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });




    });
    $scope.$on("$destroy", function (event) {
        $scope.StopUTimer();
        $scope.StopNowLineTimer();
        //$timeout.cancel(mytimeout);
    }); 
    $rootScope.$broadcast('FlightBoardLoaded', null);
    $scope.scroll_dep_height = $(window).height() - 195;
    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.isMobile = $(window).width() <= 1400;
        $scope.popup_lognew_full = $(window).width() <= 1400;
        $scope.scroll_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 200 : $(window).height() - 200;
        $scope.dg_crew_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 250 : $(window).height() - 250;



        $scope.refreshHeights();

        if ($(window).width() >= 1400)
            $('.gantt-main-container').height($(window).height() - 145 - $scope.absHeight);
        else
            $('.gantt-main-container').height($(window).height() - 145);
        $scope.$apply(function () {

            $scope.scroll_dep_height = $(window).height() - 195;

        });
        //if ($(window).width() > $(window).height()) {
        //    $scope.$apply(function () {
        //        $scope.footerfilter = false;
        //          $scope.IsLandscape = true;

        //    });

        //    $('.gantt-main-container').height($(window).height() - 85);


        //} else {

        //    $scope.$apply(function () {

        //        $scope.footerfilter = true;
        //        $scope.IsLandscape = false;

        //    });
        //    $('.gantt-main-container').height($(window).height() - 205);
        //}

    });



}]);