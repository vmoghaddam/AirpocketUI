﻿﻿'use strict';
app.controller('boardController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'fbService', '$http','$q','logService', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, fbService, $http,$q,logService) {
    $scope.prms = $routeParams.prms;

    var hourWidth = 85;
    authService.setModule($rootScope.moduleId);
    $rootScope.setTheme();
	$scope.IsCAA= $rootScope.userName.toLowerCase() == 'caa' || $rootScope.userName.toLowerCase() == 'cabin.service';
	
    $scope.isPGS=$rootScope.userName.toLowerCase().startsWith('pgs.') || $rootScope.userName.toLowerCase() == 'ops.pgs';
    $scope.IsPlanning = $rootScope.HasMenuAccess('flight_planning', 3);
    //flight_planning-edit
    $scope.IsStaion =$rootScope.roles &&  $rootScope.roles.indexOf('Station') != -1;

    $scope.IsFuelReadOnly = false;
    $scope.IsJLAccess = $rootScope.HasMenuAccess('flight_board_jl', 3) || $scope.IsStaion;
    $scope.IsCLAccess = $rootScope.HasMenuAccess('flight_board_jl', 3) 
	|| $rootScope.userName.toLowerCase().startsWith('trans.') 
	|| $scope.IsStaion 
	|| $rootScope.userName.toLowerCase().startsWith('d.najafi')
	|| $rootScope.HasViewFSG;
    //ops.rezabandehlou
    $scope.IsJLOG = false;
    if ($rootScope.userName.toLowerCase() == 'ops.rezabandehlou' || $rootScope.userName.toLowerCase() == 'demo' || $rootScope.userName.toLowerCase() == 'razbani'
	   || $rootScope.userName.toLowerCase() == 'ops.askari'
	   )
        $scope.IsJLOG = true;
    $scope.IsPickup = $rootScope.userName.toLowerCase().startsWith('trans.') || $rootScope.userName.toLowerCase().startsWith('transport') || $rootScope.userName.toLowerCase().startsWith('d.najafi');
    $scope.IsCrewMobileVisible =$rootScope.HasDispatch() || $rootScope.userName.toLowerCase().startsWith('dis') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('trans');
    $scope.IsSMSVisible =$rootScope.HasDispatch() || $rootScope.userName.toLowerCase().startsWith('dis') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('cs.') || $rootScope.userName.toLowerCase().startsWith('razbani');
   
	$scope.IsNoCrewVisible = $rootScope.userName.toLowerCase().startsWith('dis') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('razbani') || $rootScope.userName.toLowerCase().startsWith('ops.darabian')
	|| $rootScope.userName.toLowerCase().startsWith('ops.pazoki')
	|| $rootScope.userName.toLowerCase().startsWith('line.')
	|| $rootScope.roles.indexOf('F/M') != -1
	|| ($rootScope.roles &&  $rootScope.roles.indexOf('Dispatch') != -1)
	|| $rootScope.userName.toLowerCase().startsWith('cs.')
	||  $rootScope.HasViewFSG();
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
    $scope.IsSTBYVisible = $rootScope.IsFlightBoardEditable() || $rootScope.userName.toLowerCase().startsWith('cs.')  ;

    //2021-1-17
    $scope.IsRemark = $rootScope.userName.toLowerCase().startsWith('sale.');
    $scope.IsSave = $scope.IsEditable || $scope.IsStaion || $scope.IsRemark;

    //divargar-ok
    $scope.IsComm =$rootScope.IsFlightPlan() ||  $rootScope.userName.toLowerCase().startsWith('comm.') || $rootScope.userName.toLowerCase().startsWith('com.') || $rootScope.userName.toLowerCase().startsWith('demo');
	$scope.NotIsComm = !$scope.IsComm;
   // $scope.IsComm = true;
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
		//if ($rootScope.userName.toLowerCase().startsWith('kusha'))
       //			return;
		if ($rootScope.userName.toLowerCase()=='mehregan')
			return;
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
    $scope.showLogX = function (isApply) {
		 if (/*$rootScope.userName.toLowerCase()=='caa'*/ $scope.IsCAA)
			return;
        if ($rootScope.userName.toLowerCase()=='mehregan')
			return;
        //if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
        //    General.ShowNotify(Config.Text_NoFlightSelected, 'error');
        //    return;
        //}

        //$scope.flight = $scope.ati_selectedFlights[0];
        //kakal
		//if ($rootScope.userName.toLowerCase().startsWith('kusha'))
	    //		return;
	//	alert(moment($scope.logFlight.STA).format('HH:mm'))
	//	console.log($scope.logFlight.STD);
		
        if (!$scope.logFlight.FuelUnitID)
            $scope.logFlight.FuelUnitID = 115;
        if (!$scope.logFlight.CargoUnitID)
            $scope.logFlight.CargoUnitID = 111;

        $scope.logFlight.STA2 = new Date($scope.logFlight.STA);
		console.log('sssss');
		 console.log($scope.logFlight.STA2);
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
        
        $scope.convertToLCLFromLCB(); 

         if ($(window).width() < 1400 /*|| $rootScope.userName.toLowerCase()=='demo'*/ )
     //2024-02-06   
        $scope.popup_lognew_visible = true;
         else
            $scope.popup_log_visible = true;
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
            $scope.showLogX(false);




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
		return;
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
        readOnly: false,
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
        readOnly: false,
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
        searchExpr: ["IATA" ],
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
        searchExpr: ["IATA" ],
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
        flightService.getRealRegisters(cid).then(function (response) {
            $scope.realMSNs = Enumerable.From(response)
                //.Where(function (x) { return !x.Register.startsWith('CNL') && (x.Register.startsWith('V') || x.Register.startsWith('R') || x.Register.startsWith('FS')) ; })
                .OrderBy('$.isvirtual').ThenBy('$.TFC')
                .ThenBy('$.Register').ToArray();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    ////////////////////////////////////////////
    //dools
    $scope.getSbTemplateAircraft = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left'>" + data.Register + "</div>"
            + "<div class='tmpl-col-right'>" + data.AircraftType + "</div>"


            + "</div>";
        return tmpl;
    };
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
	$scope.todayFlights = [];
    $scope.btn_free = {
        // text: 'Nonscheduled Flight',
        //text: 'N/S Flight',
        hint: 'New Flight',
        type: 'default',
        icon: 'fas fa-plus',
        width: '100%',

        onClick: function (e) {
			
			$scope.todayFlights = $scope.ganttData.flights.filter(function(item) {
				return item.STD.getDate() == (new Date($scope.selectedDate)).getDate();
			});
			//console.log(1, $scope.ganttData.flights);
			//console.log(2, $scope.todayFlights);
			
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
    $scope.btn_deleteXXXX = {
        hint: 'Delete Flight',
        type: 'danger',
        icon: 'fas fa-eraser',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            if ($scope.ati_selectedFlights[0].FlightStatusID != 1) {
                General.ShowNotify("The flight cannot be deleted.", 'error');
                return;
            }
            _getFDPItemCount($scope.ati_selectedFlights[0].ID).then(function (response) {
                if (response) {
                    General.ShowNotify("The flight cannot be deleted.", 'error');
                    return;
                }
                $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
                $scope.ati_resid = $scope.ati_flight.RegisterID;

                if ($scope.IsComm) {
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



          



        }
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
            if ($scope.ati_selectedFlights[0].FlightStatusID != 1) {
                General.ShowNotify("The flight cannot be deleted.", 'error');
                return;
            }

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
				   $scope.linkEntity.ChrCode = $scope.ati_flight.ChrCode;
                $scope.linkEntity.ChrTitle = $scope.ati_flight.ChrTitle;
				
				
				
				var diff_from=$scope.ati_flight.GWLand-210;
				var diff_to=$scope.ati_flight.GWTO-210;
				 
				
				var _xstd=new Date($scope.ati_flight.STD);
				_xstd=new Date(_xstd.addMinutes(diff_from));
				/*if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-30));
               if (['DYU','FEG','NMA','TAS'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(90));
				 if (['FRU'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(150));
				if (['PNQ'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(120));
			  if (['TBS','BUS','EVN'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(30));
				*/
										
				var _xsta=new Date($scope.ati_flight.STA);
				_xsta=new Date(_xsta.addMinutes(diff_to));
				/*if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(-30));
				if (['DYU','FEG','NMA','TAS'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(90));
				if (['FRU'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(150));
				if (['PNQ'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(120));
				if (['TBS','BUS','EVN'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(30));*/
				
               
				//alert($scope.ati_flight.GWTO);
				 
				
				
                $scope.time_ir_std_date =new Date(_xstd); //new Date($scope.ati_flight.STD);
                $scope.time_ir_std_time =new Date(_xstd); //new Date($scope.ati_flight.STD);
				
				
				
                $scope.time_ir_sta_date =new Date(_xsta); //new Date($scope.ati_flight.STA);
                $scope.time_ir_sta_time =new Date(_xsta); //new Date($scope.ati_flight.STA);

                //divargar-ok
                $scope.time_interval_from_date = new Date($scope.ati_flight.STD);
                $scope.time_interval_to_date = new Date($scope.ati_flight.STD);
                $scope.interval_days = [];
                $scope.interval_days.push((new Date($scope.ati_flight.STD)).getDay());
                //$scope.linkEntity.LinkedRemark = $scope.flight.LinkedRemark;
                $scope.doIrRoute = true;
                //hoda
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
	//11-16
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
		  if (key == 'flight_doc') {
            $scope.popup_doc_visible = true;
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
        height: 470,
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
	
	
	 $scope.atcTXT = null;
    $scope.txt_atc = {
        height: 530,
        bindingOptions: {

            value: "atcTXT"
        }
    };
    $scope.isATCFile = false;
    $scope.btn_atcdnl = {
        width:150,
        type: 'default',
        text: 'Download',
        onClick: function (e) {
            $window.open( atcfiles + $scope.atcTXT, '_blank');
        },
        bindingOptions: {
            visible:'isATCFile'
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
            $scope.popup_atc_visible = false;

        },
        bindingOptions: {
            visible: 'popup_atc_visible',

            title: 'popup_atc_title',

        }
    };
	
		 $scope.uploaderValueATC = [];
    $scope.uploadedATC = null;
    $scope.uploader_atc = {
        //uploadedMessage: 'Ø¨Ø§Ø±Ú¯Ø²Ø§Ø±ÛŒ Ø´Ø¯',
        multiple: false,
        selectButtonText: 'Upload ATC Flight Plan',
        // selectButtonText: 'Ø§Ù†ØªØ®Ø§Ø¨ ØªØµÙˆÛŒØ±',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl:apiapsb+ "api/upload/atc/flightplan",
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
	
	
	
	$scope.uploaderValueDoc = [];
    $scope.uploadedDoc = null;
    $scope.uploader_doc = {
        //uploadedMessage: 'Ø¨Ø§Ø±Ú¯Ø²Ø§Ø±ÛŒ Ø´Ø¯',
        multiple: false,
        selectButtonText: 'Upload ATC Flight Plan',
        // selectButtonText: 'Ø§Ù†ØªØ®Ø§Ø¨ ØªØµÙˆÛŒØ±',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: apiapsb + "api/upload/atc/flightplan",
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
	
	 $scope.fltdoc_type = null;
    $scope.fltdoc_url = '';
    $scope.fltdocClick = function (key) {
        $scope.fltdoc_type = key;
        if (key == 'spwx') {
            $scope.popup_fltdoc_title = 'Special WX';
            $scope.popup_fltdoc_visible = true;
        }
        if (key == 'ddl') {
            $scope.popup_fltdoc_title = 'DDL';
            $scope.popup_fltdoc_visible = true;
        }
        if (key == 'notam') {
            $scope.popup_fltdoc_title = 'NOTAM';
            $scope.popup_fltdoc_visible = true;
        }
        if (key == 'packinglist') {
            $scope.popup_fltdoc_title = 'PACKING LIST';
            $scope.popup_fltdoc_visible = true;
        }
        if (key == 'other') {
            $scope.popup_fltdoc_title = 'OTHER';
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
        uploadUrl: apiapsb + "api/upload/flight/doc",
        onValueChanged: function (arg) {

        },

        onUploaded: function (e) {
            $scope.uploadedFltDoc = e.request.responseText;
            console.log('upload doc', e.request.responseText);

            if (e.request.responseText) {
                alert("Document Uploaded.");
                e.component.reset();
                $scope.isFltDocFile = true;
                $scope.fltdoc_url = e.request.responseText.replace('"', '').replace('"', '').replace("'", "").replace("'", "");

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
        height: 230,
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
            $window.open('https://_files.airpocket.online/varesh/flt/' + $scope.fltdoc_url, '_blank');
        },
        bindingOptions: {
            visible: 'isFltDocFile'
        }

    };
    $scope.popup_fltdoc_visible = false;
    $scope.popup_fltdoc_title = 'DOC';
    $scope.popup_fltdoc = {

        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 400,
        width: 700,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', icon: 'check', validationGroup: 'ofptext', onClick: function (e) {
                        if (!$scope.fltdoc_url) {
                            // $scope.popup_atc_visible = false;

                            return;
                        }


                        // var dto = { user: $rootScope.userName, fltId: $scope.ati_selectedFlights[0].ID, text: $scope.atcTXT };
                        var dto = {
                            FlightId: $scope.ati_selectedFlights[0].ID,
                            Remark: $scope.fltdoc_remark,
                            DocumentUrl: $scope.fltdoc_url,
                            DocumentType: $scope.fltdoc_type,
                        };

                        $scope.loadingVisible = true;

                        flightService.saveFlightDoc(dto).then(function (response) {
                            $scope.loadingVisible = false;


                            $scope.popup_fltdoc_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_fltdoc_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.loadingVisible = true;

            flightService.getFlightDoc($scope.ati_selectedFlights[0].ID, $scope.fltdoc_type).then(function (response) {
                $scope.loadingVisible = false;
                $scope.fltdoc_url = response.DocumentUrl;
                $scope.isFltDocFile = $scope.fltdoc_url;
                $scope.fltdoc_remark = response.Remark;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        onHiding: function () {
            $scope.isFltDocFile = false;
            $scope.fltdoc_url = null;
            $scope.isFltDocFile = null;
            $scope.fltdoc_remark = null;
            $scope.popup_fltdoc_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fltdoc_visible',

            title: 'popup_fltdoc_title',

        }
    };
    ///////
	////////
	////////
	//END 11-16
	/////////////
	////////////////
	
	
	
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
    //doolrahm
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
                        //dooltak
                        $scope.loadingVisible = true;
                        flightService.updatePlanItemFlight($scope.planEntity).then(function (response) {
                            //doolrahm
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
        searchExpr: ["IATA" ],
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
        searchExpr: ["IATA" ],
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
    //doolrahm




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
    //dooltala

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
	
	
//09-03

    $scope._dateto_x = (new Date()).addDays(3);
	
	
	$scope._min_date=$scope.IsCAA?(new Date()).addDays(-14):new Date(1980,1,1);
	$scope._max_date=$scope.IsCAA?(new Date()).addDays(3):new Date(2100,1,1);;
	
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_datefrom',
			 max:'_max_date',
			min:'_min_date',

        }
    };
	 $scope.date_to_x = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_dateto_x',
            max:'_max_date',
			min:'_min_date',
        }
    };
	 $scope.date_to_xxs = {
        type: "date",
        placeholder: 'From',
        pickerType: 'rollers',
        width: '100%',
        displayFormat: "yy-MM-dd",
        bindingOptions: {
            value: '_dateto_x',
            max:'_max_date',
			min:'_min_date',
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
			 max:'_max_date',
			min:'_min_date',

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
        var d1 = new Date($scope.logFlight.STD2);
        var d2 = new Date($scope.logFlight.ChocksOut);
		
		console.log('calculate delay STD',$scope.logFlight.STD2);
		console.log('calculate delay OFF',d2);
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
        //dool
        $scope.logFlight.ChocksOut = getUtcDate($scope.logFlight.ChocksOut);
        $scope.logFlight.ChocksIn = getUtcDate($scope.logFlight.ChocksIn);
        $scope.logFlight.Takeoff = getUtcDate($scope.logFlight.Takeoff);
        $scope.logFlight.Landing = getUtcDate($scope.logFlight.Landing);
        $scope.logFlight.STA2 = getUtcDate($scope.logFlight.STA2);
        $scope.logFlight.STD2 = getUtcDate($scope.logFlight.STD2);


        $scope.time_status_value = getUtcDate($scope.time_status_value);

    };
    $scope._convertToLCL = function () {
        $scope.logFlight.ChocksOut = getLocalDate($scope.logFlight.ChocksOut);
        $scope.logFlight.ChocksIn = getLocalDate($scope.logFlight.ChocksIn);
        $scope.logFlight.Takeoff = getLocalDate($scope.logFlight.Takeoff);
        $scope.logFlight.Landing = getLocalDate($scope.logFlight.Landing);
        $scope.logFlight.STA2 = getLocalDate($scope.logFlight.STA2);
        $scope.logFlight.STD2 = getLocalDate($scope.logFlight.STD2);

        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
	$scope.getLCL=function(dt,extra){
		dt=new Date(dt);
		 var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
		 offset += extra;
		 dt = (new Date(dt)).addMinutes(offset)
		 return dt;
	};
	$scope.getUTC=function(dt,extra){
		dt=new Date(dt);
		 //var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
		// offset += extra;
		 dt = (new Date(dt)).addMinutes(-1*extra)
		 return dt;
	};
	

    $scope.getLCB=function(dt,extra){
		console.log('getLCB');
		console.log( moment(dt).format('HH:mm'));
		console.log(extra);
		dt=new Date(dt);
		 var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
		var dif=(-1*offset)-extra;
		 console.log(dif);
		 dt = (new Date(dt)).addMinutes(dif);
		console.log( moment(dt).format('HH:mm'));
		 return dt;
	};


    $scope.convertToLCLFromLCB = function () {
		
		
		
        $scope.logFlight.ChocksOut = $scope.getLCL($scope.logFlight.ChocksOut,$scope.logFlight.GWLand);
        $scope.logFlight.ChocksIn = $scope.getLCL($scope.logFlight.ChocksIn,$scope.logFlight.GWTO);
        $scope.logFlight.Takeoff = $scope.getLCL($scope.logFlight.Takeoff,$scope.logFlight.GWLand);
        $scope.logFlight.Landing = $scope.getLCL($scope.logFlight.Landing,$scope.logFlight.GWTO);
        $scope.logFlight.STA2 = $scope.getLCL($scope.logFlight.STA2,$scope.logFlight.GWTO);
        $scope.logFlight.STD2 = $scope.getLCL($scope.logFlight.STD2,$scope.logFlight.GWLand);
      // console.log($scope.logFlight.STA2);
        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
	
     $scope.convertToLCBFromLCL = function () {
		
		
		
        $scope.logFlight.ChocksOut = $scope.getLCB($scope.logFlight.ChocksOut,$scope.logFlight.GWLand);
        $scope.logFlight.ChocksIn = $scope.getLCB($scope.logFlight.ChocksIn,$scope.logFlight.GWTO);
        $scope.logFlight.Takeoff = $scope.getLCB($scope.logFlight.Takeoff,$scope.logFlight.GWLand);
        $scope.logFlight.Landing = $scope.getLCB($scope.logFlight.Landing,$scope.logFlight.GWTO);
        $scope.logFlight.STA2 = $scope.getLCB($scope.logFlight.STA2,$scope.logFlight.GWTO);
        $scope.logFlight.STD2 = $scope.getLCB($scope.logFlight.STD2,$scope.logFlight.GWLand);
        
        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
	
 $scope.convertToLCBFromUTC = function () {
		
		
		
        $scope.logFlight.ChocksOut = $scope.getLCB($scope.logFlight.ChocksOut,0);
        $scope.logFlight.ChocksIn = $scope.getLCB($scope.logFlight.ChocksIn,0);
        $scope.logFlight.Takeoff = $scope.getLCB($scope.logFlight.Takeoff,0);
        $scope.logFlight.Landing = $scope.getLCB($scope.logFlight.Landing,0);
        $scope.logFlight.STA2 = $scope.getLCB($scope.logFlight.STA2,0);
        $scope.logFlight.STD2 = $scope.getLCB($scope.logFlight.STD2,0);
        
        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
	
	 $scope.convertToUTCNew = function () {
        //dool
        $scope.logFlight.ChocksOut = $scope.getUTC($scope.logFlight.ChocksOut,$scope.logFlight.GWLand);
        $scope.logFlight.ChocksIn = $scope.getUTC($scope.logFlight.ChocksIn,$scope.logFlight.GWTO);
        $scope.logFlight.Takeoff = $scope.getUTC($scope.logFlight.Takeoff,$scope.logFlight.GWLand);
        $scope.logFlight.Landing = $scope.getUTC($scope.logFlight.Landing,$scope.logFlight.GWTO);
        $scope.logFlight.STA2 = $scope.getUTC($scope.logFlight.STA2,$scope.logFlight.GWTO);
        $scope.logFlight.STD2 = $scope.getUTC($scope.logFlight.STD2,$scope.logFlight.GWLand);


        $scope.time_status_value = getUtcDate($scope.time_status_value);

    };
	 $scope.convertToLCLFromUTC = function () {
		 console.log('$scope.convertToLCLFromUTC');
        $scope.logFlight.ChocksOut = $scope.getUTC($scope.logFlight.ChocksOut,-1*$scope.logFlight.GWLand);
        $scope.logFlight.ChocksIn = $scope.getUTC($scope.logFlight.ChocksIn,-1*$scope.logFlight.GWTO);
        $scope.logFlight.Takeoff = $scope.getUTC($scope.logFlight.Takeoff,-1*$scope.logFlight.GWLand);
        $scope.logFlight.Landing = $scope.getUTC($scope.logFlight.Landing,-1*$scope.logFlight.GWTO);
        $scope.logFlight.STA2 = $scope.getUTC($scope.logFlight.STA2,-1*$scope.logFlight.GWTO);
        $scope.logFlight.STD2 = $scope.getUTC($scope.logFlight.STD2,-1*$scope.logFlight.GWLand);

        $scope.time_status_value = getLocalDate($scope.time_status_value);
    };
    $scope.otimes = null;
    $scope.timeBase = 'LCL';
    $scope.timeBaseReadOnly = false;
	//12-05
    $scope.sb_timebase = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['UTC', 'LCL', 'LCB'],
        //readOnly:true,
        onValueChanged: function (e) {
            console.log('OOOOOOOOOOOOOOOOOO   TIME BASE');
			console.log('value',e.value);
			console.log('pre',e.previousValue);
            if (e.value == 'UTC' && (e.previousValue == 'LCL')) {
                $scope.convertToUTCNew();
           }
          else if ((e.value == 'UTC') && e.previousValue == 'LCB')
                $scope.convertToUTC();
			else if ((e.value == 'LCL') && e.previousValue == 'UTC')
                $scope.convertToLCLFromUTC();
			else if ((e.value == 'LCL') && e.previousValue == 'LCB')
                $scope.convertToLCLFromLCB();
			else if ((e.value =='LCB') && e.previousValue == 'UTC')
				$scope.convertToLCBFromUTC();
			else if ((e.value =='LCB') && e.previousValue == 'LCL')
				$scope.convertToLCBFromLCL();
			//console.log($scope.logFlight.ChocksOut);

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
 $scope.parkingPosition = {
        bindingOptions: {
            value: 'logFlight.ArrivalRemark',

        }
    };

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
    //parisa
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
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 0, Title: 'Left' }, { Id: 1, Title: 'Right' }],
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
        searchExpr: ["IATA" ],
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
         var oldSTD = $scope.linkEntity.STD;
        var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
        var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
		var stdNo=Number(moment(new Date($scope.time_ir_std_time)).format("HHmm"));
		var staNo=Number(moment(new Date($scope.time_ir_sta_time)).format("HHmm"));
		if (staNo<stdNo)
		  $scope.time_ir_sta_date=new Date((new Date($scope.time_ir_std_date)).addDays(1));
			else
		  $scope.time_ir_sta_date=(new Date($scope.time_ir_std_date));
		
		
        var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
		 var sta_dates = (new Date($scope.time_ir_sta_date)).getDatePartArray();
        var sta_times = (new Date($scope.time_ir_sta_time)).getTimePartArray();
        var sta = new Date(sta_dates[0], sta_dates[1], sta_dates[2], sta_times[0], sta_times[1], 0, 0);
		
		 var _diffx = Math.abs(new Date(sta) - new Date(std));
		 var _minutes = Math.floor((_diffx/1000)/60);
		 $scope.linkEntity.FlightH=Math.trunc(_minutes/60);
		 $scope.linkEntity.FlightM=_minutes % 60;
		 
		
		
       /* if ([152340,132316,133405,152352,150903,132636, 152384, 152370, 152391,135749,152349,152356].indexOf($scope.linkEntity.FromAirportId)!=-1)
		{
		   std=new Date( std.addMinutes(30));	
		}
        if ([146698,152383, 152390, 152357].indexOf($scope.linkEntity.FromAirportId)!=-1)
		{
		   std=new Date( std.addMinutes(-90));	
		}
		if ([102338].indexOf($scope.linkEntity.FromAirportId)!=-1)
		{
		   std=new Date( std.addMinutes(-120));	
		}
        if ([152366,152362,141866].indexOf($scope.linkEntity.FromAirportId)!=-1)
		{
		   std=new Date( std.addMinutes(-30));	
		}
        

        var sta_dates = (new Date($scope.time_ir_sta_date)).getDatePartArray();
        var sta_times = (new Date($scope.time_ir_sta_time)).getTimePartArray();
        var sta = new Date(sta_dates[0], sta_dates[1], sta_dates[2], sta_times[0], sta_times[1], 0, 0);
        if ([152340,132316,133405,152352,150903,132636, 152384, 152370, 152391,135749,152349,152356].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(30));	
		}
        if ([146698,152383, 152390, 152357].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(-90));	
		}
		if ([102338].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(-120));	
		}
		 if ([152379].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(-150));	
		}
        if ([152366,152362, 141866].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(-30));	
		}
		*/
       
        var _flight = JSON.parse(JSON.stringify($scope.linkEntity));
        //9-8
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
        //var stdOffset = (new Date(std)).addMinutes(_zoffset);
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

        _flight.time_mode='lcl';


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

//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=180;
						
						if (response.flight.FromAirportIATA=='DAM'  )
							response.flight.GWLand=120;
						if (response.flight.ToAirportIATA=='DAM' ) 
							response.flight.GWTO=120;
						
						
						if (response.flight.FromAirportIATA=='DYU'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='DYU' ) 
							response.flight.GWTO=300;
				if (response.flight.FromAirportIATA=='TAS'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='TAS' ) 
							response.flight.GWTO=300;
						if (response.flight.FromAirportIATA=='FEG'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='FEG' ) 
							response.flight.GWTO=300;
				if (response.flight.FromAirportIATA=='NMA'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='NMA' ) 
							response.flight.GWTO=300;
				
				if (response.flight.FromAirportIATA=='PNQ'  )
							response.flight.GWLand=330;
						if (response.flight.ToAirportIATA=='PNQ' ) 
							response.flight.GWTO=330;
				
				if (response.flight.FromAirportIATA=='FRU'  )
							response.flight.GWLand=360;
						if (response.flight.ToAirportIATA=='FRU' ) 
							response.flight.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=240;
////////////////////////////////////////////////////////


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
            //flightService.saveFlightGroup(_flight).then(function (response) {
				 flightService.saveFlightGroupUTC(_flight).then(function (response) {
					




                General.ShowNotify(Config.Text_SavedOk, 'success');
				 if (response.messages && response.messages.length>0){
						 var _msgs=response.messages.join(" ");
						 alert(_msgs);
						 
				 }

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
							//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( resFlt.ToAirportIATA)!=-1 )
							resFlt.GWTO=180;
						
						if (resFlt.FromAirportIATA=='DAM'  )
							resFlt.GWLand=120;
						if (resFlt.ToAirportIATA=='DAM' ) 
							resFlt.GWTO=120;
						
						
						if (resFlt.FromAirportIATA=='DYU'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='DYU' ) 
							resFlt.GWTO=300;
						if (resFlt.FromAirportIATA=='TAS'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='TAS' ) 
							resFlt.GWTO=300;
						
						if (resFlt.FromAirportIATA=='FEG'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='FEG' ) 
							resFlt.GWTO=300;
							
							if (resFlt.FromAirportIATA=='NMA'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='NMA' ) 
							resFlt.GWTO=300;
							
							if (resFlt.FromAirportIATA=='PNQ'  )
							resFlt.GWLand=330;
						if (resFlt.ToAirportIATA=='PNQ' ) 
							resFlt.GWTO=330;
								if (resFlt.FromAirportIATA=='FRU'  )
							resFlt.GWLand=360;
						if (resFlt.ToAirportIATA=='FRU' ) 
							resFlt.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( resFlt.ToAirportIATA)!=-1 )
							resFlt.GWTO=240;
////////////////////////////////////////////////////////
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
						//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _f.FromAirportIATA)!=-1 )
							_f.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _f.ToAirportIATA)!=-1 )
							_f.GWTO=180;
						
						if (_f.FromAirportIATA=='DAM'  )
							_f.GWLand=120;
						if (_f.ToAirportIATA=='DAM' ) 
							_f.GWTO=120;
						
						
						if (_f.FromAirportIATA=='DYU'  )
							_f.GWLand=300;
						if (_f.ToAirportIATA=='DYU' ) 
							_f.GWTO=300;
						if (_f.FromAirportIATA=='TAS'  )
							_f.GWLand=300;
						if (_f.ToAirportIATA=='TAS' ) 
							_f.GWTO=300;
						
						if (_f.FromAirportIATA=='FEG'  )
							_f.GWLand=300;
						if (_f.ToAirportIATA=='FEG' ) 
							_f.GWTO=300;
						
						if (_f.FromAirportIATA=='NMA'  )
							_f.GWLand=300;
						if (_f.ToAirportIATA=='NMA' ) 
							_f.GWTO=300;
						
						if (_f.FromAirportIATA=='PNQ'  )
							_f.GWLand=330;
						if (_f.ToAirportIATA=='PNQ' ) 
							_f.GWTO=330;
						if (_f.FromAirportIATA=='FRU'  )
							_f.GWLand=360;
						if (_f.ToAirportIATA=='FRU' ) 
							_f.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( _f.FromAirportIATA)!=-1 )
							_f.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( _f.ToAirportIATA)!=-1 )
							_f.GWTO=240;
////////////////////////////////////////////////////////
           
                        $scope.modifyFlightTimes(_f);
						console.log('saved flight',_f);
                        $scope.addToGantt(_f, response.ressq[0]);
                    });

                }

                if ($scope.linkEntity.ID != -1)
                    $scope.popup_free_visible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

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
	
	
    $scope.popup_free_visible = false;
    $scope.popup_free_title = 'Flight';
    $scope.freeSaved = false;
    $scope.popup_free_height = $scope.IsComm ? 790 : 580;
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
						var duplicateFlightNo =[];
						duplicateFlightNo = $scope.todayFlights.filter(function(item) {
							return (item.FlightNumber == $scope.linkEntity.FlightNumber && item.ID != $scope.linkEntity.ID);
						});
						console.log($scope.linkEntity);
						//console.log($scope.linkEntity.FlightNumber);
						console.log(1, duplicateFlightNo);
						//if (duplicateFlightNo.length > 0) {
						//	General.ShowNotify('Duplicate Flight Number', 'error');
                        //    return;
						//}

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
            $scope.linkEntity = null;
			 $scope.sb_fchr_ins.reset();
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

    ///////////////////////////////////////

    //doolsabz
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
                            //doolrahm
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

                            fids: $scope.IsComm ? flights : allflights,
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
								
								
								//if (response.flights_crew && response.flights_crew.length>0){
									
									/* var myDialog = DevExpress.ui.dialog.custom({
											rtlEnabled: true,
											title: "ERROR",
												message: 'Assigend crews (visible or hidden) found. The flight(s): '+response.flights_crew.join(',')+' cannot be cancelled.',
											buttons: [{ text: "OK", onClick: function () { } }]
										});
										myDialog.show();
								    }*/
								
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
		console.log('FILL',$scope.logFlight);
		console.log($scope.logFlight.ChocksOut);
		//alert($scope.timeBase);
        if ($scope.timeBase == 'UTC')
           // $scope.convertToLCL();
			$scope.convertToLCBFromUTC();
		if ($scope.timeBase=='LCL')
			 $scope.convertToLCBFromLCL();
		console.log($scope.logFlight.ChocksOut);
		
		//return;
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
        entity.CargoUnitID = $scope.logFlight.CargoUnitID;
        entity.BaggageCount = $scope.logFlight.BaggageCount;

        entity.CargoCount = $scope.logFlight.CargoCount;
        entity.BaggageWeight = $scope.logFlight.BaggageWeight;
        entity.FuelUnitID = $scope.logFlight.FuelUnitID;

        entity.FPFlightHH = $scope.logFlight.FPFlightHH;
        entity.FPFlightMM = $scope.logFlight.FPFlightMM;
        entity.FPFuel = $scope.logFlight.FPFuel;
        entity.Defuel = $scope.logFlight.Defuel;
        entity.UsedFuel = $scope.logFlight.UsedFuel;
        entity.JLBLHH = $scope.logFlight.JLBLHH;
        entity.JLBLMM = $scope.logFlight.JLBLMM;
        entity.PFLR = $scope.logFlight.PFLR;
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
        entity.CargoUnitID = $scope.flight.CargoUnitID;
        entity.BaggageCount = $scope.flight.BaggageCount;

        entity.CargoCount = $scope.flight.CargoCount;
        entity.BaggageWeight = $scope.flight.BaggageWeight;
        entity.FuelUnitID = $scope.flight.FuelUnitID;

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
    $scope.dep_offblock = {
        //pickerType: "rollers",
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
       // pickerType: "rollers",
        displayFormat: "HHmm",
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
        //pickerType: "rollers",
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
        //pickerType: "rollers",
        displayFormat: "HHmm",
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
       // pickerType: "rollers",
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
       // pickerType: "rollers",
        displayFormat: "HHmm",
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
        //pickerType: "rollers",
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
        displayFormat: "HHmm",
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
                            flightService.saveFlightLog(dto).then(function (response) {
								flightService.sendCaoMVT($scope.logFlight.ID);
				//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=180;
						
						if (response.flight.FromAirportIATA=='DAM'  )
							response.flight.GWLand=120;
						if (response.flight.ToAirportIATA=='DAM' ) 
							response.flight.GWTO=120;
						
						
						if (response.flight.FromAirportIATA=='DYU'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='DYU' ) 
							response.flight.GWTO=300;
						if (response.flight.FromAirportIATA=='TAS'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='TAS' ) 
							response.flight.GWTO=300;
						
						if (response.flight.FromAirportIATA=='FEG'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='FEG' ) 
							response.flight.GWTO=300;
								if (response.flight.FromAirportIATA=='NMA'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='NMA' ) 
							response.flight.GWTO=300;
				if (response.flight.FromAirportIATA=='PNQ'  )
							response.flight.GWLand=330;
						if (response.flight.ToAirportIATA=='PNQ' ) 
							response.flight.GWTO=330;
				if (response.flight.FromAirportIATA=='FRU'  )
							response.flight.GWLand=360;
						if (response.flight.ToAirportIATA=='FRU' ) 
							response.flight.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=240;
////////////////////////////////////////////////////////
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
        width: 1350,
        //height: function () { return $(window).height() * 0.95 },
        height: 687,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Journey Log', icon: '', onClick: function (e) {
						return;
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
								  // alert($rootScope.HasAccessToCrewList());
									 if ($rootScope.HasAccessToCrewList())
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

                            console.log('SAVE LOG',dto);
                            
                            $scope.loadingVisible = true;
                            flightService.saveFlightLog(dto).then(function (response) {
								flightService.sendCaoMVT($scope.logFlight.ID);
                                //doolkala
                                //console.log('update log result');
								
								//12-05
								//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=180;
						
						if (response.flight.FromAirportIATA=='DAM'  )
							response.flight.GWLand=120;
						if (response.flight.ToAirportIATA=='DAM' ) 
							response.flight.GWTO=120;
						
						
						if (response.flight.FromAirportIATA=='DYU'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='DYU' ) 
							response.flight.GWTO=300;
						if (response.flight.FromAirportIATA=='TAS'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='TAS' ) 
							response.flight.GWTO=300;
						
						if (response.flight.FromAirportIATA=='FEG'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='FEG' ) 
							response.flight.GWTO=300;
								
								if (response.flight.FromAirportIATA=='NMA'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='NMA' ) 
							response.flight.GWTO=300;
								
				if (response.flight.FromAirportIATA=='PNQ'  )
							response.flight.GWLand=330;
						if (response.flight.ToAirportIATA=='PNQ' ) 
							response.flight.GWTO=330;
				if (response.flight.FromAirportIATA=='FRU'  )
							response.flight.GWLand=360;
						if (response.flight.ToAirportIATA=='FRU' ) 
							response.flight.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=240;
////////////////////////////////////////////////////////
								
								
								

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
                else { $scope.timeBase = 'LCL'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);
 //janfe
		console.log('chr chr chr chr xxxx',$scope.logFlight);
		
        $scope.mchr.Adult = $scope.logFlight.ChrAdult;
        $scope.mchr.Child = $scope.logFlight.ChrChild;
        $scope.mchr.Infant = $scope.logFlight.ChrInfant;
        $scope.mchr.Capacity = $scope.logFlight.ChrCapacity;
        $scope.mchr.Code = $scope.logFlight.ChrCode;
        $scope.mchr.Title = $scope.logFlight.ChrTitle;
        var _mchr = Enumerable.From($scope.mchr_ds).Where('$.Code=="' + $scope.logFlight.ChrCode + '"').FirstOrDefault();
        if (_mchr)
		    $scope.mchr.ChartererId = _mchr.Id;
		else 
			 $scope.mchr.ChartererId =null;
		  if ($scope.IsComm && !$scope.mchr.ChartererId)
            $scope.mchr.ChartererId = $scope.logFlight.DefaultChrId;
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
                $scope.timeBase = 'LCL';

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
        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65, fixed: true, fixedPosition: 'left' },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180 },
		  { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
		{ dataField: 'Sex', caption: 'Pass.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
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
        height: 200,// $(window).height() - 250,// 490 

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
		//12-05
		console.log('$rootScope.HasAccessToCrewList()',$rootScope.HasAccessToCrewList());
        if (!$rootScope.HasAccessToCrewList()) {
            $scope.dg_crew_abs_ds = [];
            return;
        }
        var archived_crews = 0;
        //if (new Date($scope.logFlight.Date) < new Date(2020, 6, 1, 0, 0, 0, 0))
         if (new Date($scope.logFlight.Date) < new Date(2022, 8, 22, 0, 0, 0, 0))
            archived_crews = 1;


        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid, archived_crews).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.RP = _d.PickupLocal;
            });
			
			if ($rootScope.userName.toLowerCase()!='line')
                $scope.dg_crew_abs_ds = response;
			else
				 $scope.dg_crew_abs_ds =Enumerable.From( response).Where('$.Position=="GE"').ToArray();
			
            


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
			if ($rootScope.userName.toLowerCase()!='line')
                $scope.dg_crew_abs2_ds = response;
			else
				 $scope.dg_crew_abs2_ds =Enumerable.From( response).Where('$.Position=="GE"').ToArray();


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
    //doolrahm
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
	
	 var detector2 = new MobileDetect(window.navigator.userAgent);
	$scope.is_notify_full_screen=detector2.tablet();
	$scope.get_notify_height=function(){
		var h=$(window).height()-120;
		return {
			'height':h+'px',
		}
	};
	
    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notify Pickup Time';
    $scope.popup_notify = {

        //fullScreen: false,
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
                                //kiro
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
        //doolsabz
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',
			
			fullScreen:'is_notify_full_screen'


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

{ dataField: 'RefId', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        //{ dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
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
            /*{
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (e) {
                        $scope.refreshSMSStatus2();
                    }
                }, toolbar: 'bottom'
            },*/

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
                                //kiro

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
                                //kiro

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
		return;
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

                //dooltopol
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
    //doolu
    $scope.sb_jlpflr = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'Left' }, { Id: 2, Title: 'Right' }],
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
                    //dooltopol

                    $scope.jlogEntity = {
                        OffBlock: leg.JLOffBlock ? leg.JLOffBlock : leg.ChocksOut,
                        OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                        TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                        Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                        PFLR: leg.notes, //leg.PFLR,
                        FuelUnitID: leg.FuelUnitID,
                        UsedFuel: leg.UsedFuel,
                        FuelArrival: leg.FuelArrival,
                        FuelDeparture: leg.FuelDeparture,
                        UsedFuel: leg.UsedFuel,
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

                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
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
		$('.row-top-mirror').height(50);
		console.log('row-top',$('.row-top').height());
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


      //  if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
      //      dfirst = (new Date($scope.datefrom)).addMinutes(-60);
      //  if (stdOffset > datefromOffset)
      //      dfirst = (new Date($scope.datefrom)).addMinutes(60);

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
	$scope.getFlightCaption=function(f){
		var dh=f.PlanId==-1?'':'*';
	   if (f.FlightStatusID==4)
		   return (f.notes? f.FlightNumber+"("+f.notes+")":f.FlightNumber)+dh;
		return f.FlightNumber+dh;
	};
	
	$scope.isFuelVisible=function(f){
        return !f.FuelPlanned;
	};
	$scope.isNewTimeVisible=function(f){
		try{
		 if (f.taskName && f.taskName.split('-')[0]=='1')
			return true;
		else
			return false;
		} catch(ee){
		return false;
		}
	   
	};
	$scope.isNewRegVisible=function(f){
	    if (f.FlightStatusID==4)
			return false;
		
			try{
		 if (f.taskName && f.taskName.split('-')[1]=='1')
			return true;
		else
			return false;
		} catch(ee){
		return false;
		}
	};
    $scope.getDep = function (flt) {
        //2022-02-28
       // console.log(flt);
		/*var dt = flt.ChocksOut;
        if (flt.ChocksOut)
            dt = flt.ChocksOut;
        else
            dt = flt.STD;
        */
		var dt = flt.Takeoff;
        if (flt.Takeoff)
            dt = flt.Takeoff;
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
            //if (flt.FlightNumber == '6809')
            //    console.log(offset + '   ' + flt.GWLand+ '  '+ dt);
            offset += flt.GWLand;
            dt = (new Date(dt)).addMinutes(offset)
           
        }
        return moment(dt).format('HHmm');
    };
    //zooti
    $scope.getArr = function (flt) {
      /*  var dt = flt.ChocksIn;
        if (flt.ChocksIn)
            dt = flt.ChocksIn;
        else
            dt = flt.STA;
			*/
		var dt = flt.Landing;
        if (flt.Landing)
            dt = flt.Landing;
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
			 if (flt.ID == 523120 || flt.ID == 523112) {
				// offset = offset - 60;
			 }
            dt = (new Date(dt)).addMinutes(offset)
        }
        if ($scope.timeType == 2) {

            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            if (flt.FlightNumber == '7900' || flt.FlightNumber == '0040')
                console.log('ARR: ' + flt.FlightNumber+'  ' + offset + '   ' + flt.GWTO);
            offset += flt.GWTO;
             
            dt = (new Date(dt)).addMinutes(offset)
        }
        return moment(dt).format('HHmm');
    };
    //////////////////////////
    //9-8
    $scope.getFlightClass = function (flt) {
        if (flt.FlightStatusID==4 && flt.CancelDate) {
            
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
	// $scope.getFlightWidth(f)
    $scope.getDepHeaderStyle=function(f){
	  var style = {};
		if ( $scope.getFlightWidth(f).replace('px','')<85)
		{
			style.minWidth='85px';
			style.textAlign='left';
		}
		return style;
	};
    $scope.getFlightStyle = function (f, index, res) {
         
        var style = {};
        style.width = $scope.getFlightWidth(f);

        var std = f.STD;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(std.getFullYear(), std.getMonth(), std.getDate(), 1, 0, 0, 0));
            if (f.ID == 70888  || f.ID == 70889 ) {
                offset = offset - 120;
            }
            std = (new Date(std)).addMinutes(offset)

        }

        var datefromOffset = (new Date($scope.datefrom)).getTimezoneOffset();
        var stdOffset = (new Date(std)).getTimezoneOffset();
        var dfirst = new Date($scope.datefrom);

        var mm = (new Date($scope.datefrom)).getMonth();
        var dd = (new Date($scope.datefrom)).getDate();


        //if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
        //    dfirst = (new Date($scope.datefrom)).addMinutes(-60);
        //if (stdOffset > datefromOffset)
        //    dfirst = (new Date($scope.datefrom)).addMinutes(60);


        var left = $scope.getDuration(new Date(dfirst), /*new Date(f.ChocksOut?f.ChocksOut: f.STD)*/new Date(std));

        if (new Date(std) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top+10;
        if (f.FlightStatusID == 4 )
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
                            
                            Flights:   flights  ,
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
        var w = duration * (hourWidth+1)+6;
        return w + "px";
    }
    $scope.getFDPStyle = function (f, index, res) {

        var style = {};
        style.width = $scope.getFDPWidth(f) ;

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


        var left = $scope.getDuration(new Date(dfirst), /*new Date(f.ChocksOut?f.ChocksOut: f.STD)*/new Date(std)) ;

        if (new Date(std) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = ((left * (hourWidth + 1)) -3) + "px";
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
            dataSource:'ctr_ds',
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

        closeOnOutsideClick: true,
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

        var ext = 15;
        if (res.resourceName.includes('CNL')  )
            ext = 40;
        return {
            minHeight: (res.maxTop + 50 + ext) + 'px'
        };
    };
    $scope.getResCaptionStyle = function (res) {
        return {
            lineHeight: (res.maxTop + 60) + 'px'
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
			//else if (reg.includes("RBC"))
            //    str = "ZZZZZY";
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
			$scope.ganttData.flights.push(flt);
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
    $scope.timeType = 2;
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
          
            $scope.timeTypeChanged();
        },
        bindingOptions: {
            value: 'timeType',

        }
    };
	 var detector = new MobileDetect(window.navigator.userAgent);
	console.log('isPhoneSized ',detector.isPhoneSized());
	console.log('mobile ',detector.mobile());
	console.log('tablet ',detector.tablet());
	console.log('os ',detector.os());
    $scope.createGantt = function () {
        if ($(window).width() < 1200) {
           // $('.large-gantt').remove();
            hourWidth = 69;
        }
        else
		{
		   //	$('.small-gantt').remove();
		}
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


            //if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
            //    dfirst = (new Date($scope.datefrom)).addMinutes(-60);
            //if (stdOffset > datefromOffset)
            //    dfirst = (new Date($scope.datefrom)).addMinutes(60);
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
       
        flt.STA = moment(flt.STA);


        if (flt.ChocksIn)
            flt.ChocksIn = moment(flt.ChocksIn);
        if (flt.ChocksOut)
            flt.ChocksOut = moment(flt.ChocksOut);

        flt.ChocksOut = getOffsetDate(flt.ChocksOut, m,n);
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
	$scope.old_selected_date=null;
    $scope.bindFlights = function (callback) { 
	
	    
	    
		$scope.old_selected_date=$scope.selectedDate;
        $scope.baseDate = (new Date(Date.now())).toUTCString();
        dfrom = $scope._datefrom;
        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
		
		if ($scope.IsCAA){
			var _dcnt_=  Math.floor(($scope._dateto_x - $scope.datefrom) / 86400000)+1;
			 
			$scope.days_count=_dcnt_; 
		}
		
		
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
						//09-08
					if ($scope.IsCAA){
					//	flights = Enumerable.From(response.flights).Where('$.FlightStatusID!=4'  )
                       // .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                     //   .ToArray();
						
					}
                    //if (_d.resourceId == 69)

                    $.each(flights, function (_j, _q) {

                        if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _q.FromAirportIATA)!=-1 )
							_q.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _q.ToAirportIATA)!=-1 )
							_q.GWTO=180;
						
						if (_q.FromAirportIATA=='DAM'  )
							_q.GWLand=120;
						if (_q.ToAirportIATA=='DAM' ) 
							_q.GWTO=120;
						
						
						if (_q.FromAirportIATA=='DYU'  )
							_q.GWLand=300;
						if (_q.ToAirportIATA=='DYU' ) 
							_q.GWTO=300;
						if (_q.FromAirportIATA=='TAS'  )
							_q.GWLand=300;
						if (_q.ToAirportIATA=='TAS' ) 
							_q.GWTO=300;
						
						if (_q.FromAirportIATA=='FEG'  )
							_q.GWLand=300;
						if (_q.ToAirportIATA=='FEG' ) 
							_q.GWTO=300;
						
						
						if (_q.FromAirportIATA=='NMA'  )
							_q.GWLand=300;
						if (_q.ToAirportIATA=='NMA' ) 
							_q.GWTO=300;
						
						if (_q.FromAirportIATA=='PNQ'  )
							_q.GWLand=330;
						if (_q.ToAirportIATA=='PNQ' ) 
							_q.GWTO=330;
						if (_q.FromAirportIATA=='FRU'  )
							_q.GWLand=360;
						if (_q.ToAirportIATA=='FRU' ) 
							_q.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( _q.FromAirportIATA)!=-1 )
							_q.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( _q.ToAirportIATA)!=-1 )
							_q.GWTO=240;
						
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
				//getRegStr(res.resourceName)
				if ($scope.IsCAA){
					response.resources = Enumerable.From(response.resources).Where(function(res){ return $scope.getRegStr(res.resourceName)!='CNL'; }).OrderBy(function (x) { return $scope.getResOrderIndex($scope.getRegStr(x.resourceName)); }).ToArray();
				}
				else
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
        }, 1000 * 30);
    };
    $scope.StopUTimer = function () {
        if ($scope.utimer)
            clearTimeout($scope.utimer);
    };
//10-31
	function _datediff(first, second) {        
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }
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
				try{
					if ($scope.old_selected_date){
						var _ndf=Number(moment($scope.datefrom).format('YYYYMMDD'));
					    var _ndt=Number(moment($scope.dateEnd).format('YYYYMMDD'));
						var _old=Number(moment($scope.old_selected_date).format('YYYYMMDD'));
						if (_old>=_ndf && _old<=_ndt){
							var _nnn=_datediff(new Date($scope.datefrom),new Date($scope.old_selected_date));
							//alert(_nnn);
							$scope.selectedTabDateIndex = _nnn;
							
						}
					}
					
				}
				catch(exex){
					
				}
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
        // alert('x');
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
        if ($(window).width() < 1400)
            return;

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
	//2024-06-30
    $scope.getNoCrew = function () {
        if ($scope.dg_nocrew_ds == null) {
            $scope.loadingVisible = true;
            flightService.getNoCrews().then(function (response) {
                $scope.loadingVisible = false;
				//2023-05-10
                console.log(response);
				if ($rootScope.HasDispatch() || $rootScope.userName == 'demo' || $rootScope.HasViewFSG()){
					var _ds=Enumerable.From(response).Where(function(x){ return   !x.InActive;}).ToArray();
                    $scope.dg_nocrew_ds = _ds;
				}
				else
				{
					var _ds=Enumerable.From(response).Where(function(x){ return x.JobGroup=='F/M' && !x.InActive;}).ToArray();
                    $scope.dg_nocrew_ds = _ds;
				}
				


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
        || $rootScope.userName.toLowerCase().includes('razbani')
	|| $rootScope.userName.toLowerCase().includes('kave');
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
    $scope.btn_aptxls = {
        //text: 'Log',
        hint: 'Daily Report',
        type: 'default',
        icon: 'fas fa-file-excel',
        width: '100%',

        onClick: function (e) {
 
           $scope.popup_tt_visible = true;
			 
        }

    };
	$scope.btn_dspxls = {
        hint: 'Dispatch Daily Report',
        type: 'normal',
        icon: 'fas fa-file-excel',
        width: '100%',

        onClick: function (e) {
            var _dtd=moment(new Date($scope.selectedDate)).format('YYYY-MM-DD');
            
           $window.open(serviceBaseAPI + 'api/xls/roster/all/daily/dr03?df=' + _dtd, '_blank');

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

        searchExpr: ["IATA" ],
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
	/////////////////////////////////10-15
	///Upload Excel
	$scope.btn_uploadxls = {
        hint: 'Upload XLSX',
        type: 'default',
        icon: '	fas fa-upload',
        width: '100%',

        onClick: function (e) {
            $scope.popup_uploadxls_visible = true;
        }
    };
	$scope._uploadFromDate = null;
$scope._uploadToDate = null;
$scope.uploadFromDate = {
        type: "date",
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_uploadFromDate',
        }
    };

$scope.uploadToDate = {
        type: "date",
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_uploadToDate',
        }
    };

	$scope.xlsFileData = [];
    $scope.xlsFileName = null;
	$scope.isFileUploaded = false;
    $scope.xlsUploader = {
        multiple: false,
        selectButtonText:'Upload XLSX',
        labelText: '',
        accept: ".xlsx",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
		uploadUrl: "https://ava.xls.airpocket.app/api/plan/uploadxlsplan",
        //uploadUrl: "https://api.apvaresh.ir/api/uploadfile",
        onValueChanged: function (arg) {
        },
        onUploaded: function (e) {
			var _fn = "";
			if ( e.request.responseText ) {
				_fn = e.request.responseText;
				_fn = _fn.replace('"','').replace('"','');
			}
			$scope.xlsFileName = _fn;
			if($scope.xlsFileName != null) {
				$scope.isFileUploaded = true;
			   }
        },
        bindingOptions: {
            value: 'xlsFileData'
        }
    }

	$scope.popup_uploadxls_visible = false;
    $scope.popup_uploadxls_title = 'Upload XLSX Plan';

    $scope.popup_uploadxls = {
        elementAttr: {
            class: "popup_uploadxlsx"
        },
        shading: true,
        height: 350,
        width: 330,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'uploaddates', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
						console.log(1);
                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
						if($scope._uploadFromDate > $scope._uploadToDate){
							General.ShowNotify("Invalid Dates!", 'error');
                            return;
						}
						if(!$scope.isFileUploaded){
							General.ShowNotify("No file has been uploaded yet!", 'error');
                            return;
						}
                       
                        $scope.loadingVisible = true;
						flightService.getImportFlightsNew($scope.xlsFileName, moment($scope._uploadFromDate).format("YYYY-MM-DD"), moment($scope._uploadToDate).format("YYYY-MM-DD")).then(function (ee) {
						   $scope.loadingVisible = false;
							alert(ee.message);
							$scope.popup_uploadxls_visible = false;
						}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', 
onClick: function(arg){$scope.popup_uploadxls_visible = false;}
															  }, toolbar: 'bottom' }
        ],
        visible: false,
        closeOnOutsideClick: false,
        bindingOptions: {
            visible: 'popup_uploadxls_visible',
            title: 'popup_uploadxls_title',
        },
		onHiding: function(){
			$scope.xlsFileName = null;
			$scope.isFileUploaded = false;
			$scope._uploadFromDate = null;
			$scope._uploadToDate = null;
		}
    };

    ////////////10-12 excel////////////
    $scope.IsFileUploaderVisible = $rootScope.IsFlightPlan();
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_file = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        selectButtonText:'Upload XLSX',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: "https://ava.api.airpocket.app/api/uploadfile",
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            console.log('upload message',e.request.responseText);
            if ( e.request.responseText ) {
				//alert(e.request.responseText);
				var _fn=e.request.responseText.split('.')[0];
				_fn=_fn.replace('"','').replace("'","");
				$scope.loadingVisible = true;
				flightService.getImportFlights(_fn).then(function (ee) {
                   $scope.loadingVisible = false;
					alert(ee.message);
                   

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                
            }
             
        },
        bindingOptions: {
            value: 'uploaderValueImage'
        }
    }
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
        Total:0,

    };
    $scope.chr_ds = null;
    $scope.chr_id = null;
    $scope.sb_chr = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title1",
        valueExpr: 'Id',
        searchExpr: ["Title1","Title2","Code","NiraCode"],
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
        readOnly:true,
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

            if (!$scope.chr.ChartererId || $scope.chr.ChartererId==-1) {
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

                var rec = response ;
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
        
height: function () {
             
            return 250;//$scope.lognew_height-400;
        },
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
        width: 400,
        height: 550, //function () { return $(window).height() * 0.8 },
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
                         var _tturl='https://ava.api.airpocket.app/' + 'api/xls/' + '?dt1=' + moment(new Date($scope.datefrom)).format('YYYY-MM-DD') + '&dt2=' + moment(new Date($scope.dateEnd)).format('YYYY-MM-DD') + "&chr=" + $scope.tt_chr + "&crew=" + $scope.tt_crew + "&cnl=" + $scope.tt_cnl + "&sort=" + $scope.tt_sort + "&time=" + $scope.tt_time+"&sep=1";
						console.log(_tturl);
                        $window.open('https://ava.api.airpocket.app/' + 'api/xls/' + '?dt1=' + moment(new Date($scope.datefrom)).format('YYYY-MM-DD') + '&dt2=' + moment(new Date($scope.dateEnd)).format('YYYY-MM-DD') + "&chr=" + $scope.tt_chr + "&crew=" + $scope.tt_crew + "&cnl=" + $scope.tt_cnl + "&sort=" + $scope.tt_sort + "&time=" + $scope.tt_time+"&sep=1", '_blank');
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_tt_visible = false; } }, toolbar: 'bottom' }
        ],

        

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
        dataSource: [{ Id: -1, Title: 'Do Not Show' }, { Id: 1, Title: 'Show' }, ],

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
        disabled:true,
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
        dataSource: [{ Id: -1, Title: 'Do Not Show' },{ Id: 1, Title: 'Cockpit' }, { Id: 2, Title: 'Cabin' }, { Id: 3, Title: 'Cockpit & Cabin' }],

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'tt_crew',
        }
    };
  ////////////////////////
 /////////////////////////////
    $scope.mchr = {
        ChartererId: null,
        Code: null,
        Title: null,
        Adult: 0,
        Child: 0,
        Infant: 0,
        Capacity:0,
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

 readOnly:'NotIsComm',
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
                        $window.open(apigd + 'api/xls/cl?flts=' + idsStr, '_blank');


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
                        $window.open(apigd + 'api/xls/gd?flts=' + idsStr, '_blank');
                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_clnew_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_cl_height =300;

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
	//11-16
	/*$scope.uploaderValueATC = [];
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
        uploadUrl: "https://api.apvaresh.ir/api/upload/atc/flightplan",
        onValueChanged: function (arg) {

        },
        
        onUploaded: function (e) {
            $scope.uploadedATC = e.request.responseText;
            console.log('upload atc', e.request.responseText);
            
            if ( e.request.responseText) {
                $scope.loadingVisible = true;
                flightService.updateATC($scope.ati_selectedFlights[0].ID, e.request.responseText.replace('"', '').replace("'", "").replace('.','X')).then(function (response) {
                    $scope.loadingVisible = false;
                    alert("ATC Flight Plan Uploaded.")

                    e.component.reset();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                alert('ERROR');
                e.component.reset();
            }
        },
        
    }*/
	/////////////////////////////
//2022-06-21
 $scope.isMobile = $(window).width() <= 1200;
 $scope.selectedTabLNIndex = -1;
    $scope.$watch("selectedTabLNIndex", function (newValue) {

        try {
            var selectedTab = $scope.tabs_ln[newValue];
            $('.dep_tab').hide();
            if (selectedTab) {
                $('.' + selectedTab.id).fadeIn(100, function () { });

                if ($scope.dg_crew_lognew_instance)
                    $scope.dg_crew_lognew_instance.repaint();
				//if ( $scope.dg_pax_instance)
			//		$scope.dg_pax_instance.refresh();
				
				console.log('ds_pax',$scope.ds_pax);
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
		{ text: "Charterer", id: 'dep_cht' },
		//{ text: "Catering", id: 'dep_cat' },
		//{ text: "History", id: 'dep_history' },
        // { text: "Delay", id: 'dep_delay' },
        //   { text: "Diversion/Ramp", id: 'dep_ramp' },




    ];
    $scope.tabs_ln_options = {
        scrollByContent: true,
        showNavButtons: true,

        elementAttr: {
            // id: "elementId",
            class: "tabsln"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

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
    $scope.lognew_height = 750;
    

    $scope.popup_lognew_visible = false;
    $scope.popup_lognew_title = 'Flight Log';
    $scope.popup_lognew_instance = null;
    $scope.popup_lognew_full = $(window).width() <= 1200;

    $scope.scroll_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 200 : $(window).height()-200;
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
                    type: 'default', text: 'J/L', icon: '', onClick: function (e) {
						//return;
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
                    type: 'default', text: 'Crew List/GD', icon: '', onClick: function (e) {

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
								  // alert($rootScope.HasAccessToCrewList());
									 if ($rootScope.HasAccessToCrewList())
									$scope.popup_clgd_visible = true;
                            });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'History', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_history_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Pickup', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_notify_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Notify', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


                        $scope.popup_notify2_visible = true;
                        /////////////////////////////////////
                    }
                }, toolbar: 'bottom'
            },
            
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: '', icon: 'save', validationGroup: 'deplog', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
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
							
							dto.ChrCapacity = $scope.mchr.Capacity;
                            dto.ChrTitle = $scope.mchr.Title;
                            dto.ChrCode = $scope.mchr.Code;
                            dto.ChrAdult = $scope.mchr.Adult;
                            dto.ChrChild = $scope.mchr.Child;
                            dto.ChrInfant = $scope.mchr.Infant



                            $scope.loadingVisible = true;
                            flightService.saveFlightLog(dto).then(function (response) {
								if ($scope.ds_pax){
								$.each($scope.ds_pax,function(_z,_q){
									_q.Id=-1;
									_q.FlightId=$scope.logFlight.ID;
									
								});
								var _ds_pax=Enumerable.From($scope.ds_pax).Where('$.AirportId').ToArray();
								var pax_dto={id:$scope.logFlight.ID,dto:_ds_pax};
								flightService.savePax(pax_dto).then(function (responsepx) {}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
								
									
								}
							flightService.sendCaoMVT($scope.logFlight.ID);
				//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=180;
						
						if (response.flight.FromAirportIATA=='DAM'  )
							response.flight.GWLand=120;
						if (response.flight.ToAirportIATA=='DAM' ) 
							response.flight.GWTO=120;
						
						
						if (response.flight.FromAirportIATA=='DYU'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='DYU' ) 
							response.flight.GWTO=300;
						if (response.flight.FromAirportIATA=='TAS'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='TAS' ) 
							response.flight.GWTO=300;
						
						if (response.flight.FromAirportIATA=='FEG'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='FEG' ) 
							response.flight.GWTO=300;
								if (response.flight.FromAirportIATA=='NMA'  )
							response.flight.GWLand=300;
						if (response.flight.ToAirportIATA=='NMA' ) 
							response.flight.GWTO=300;
				if (response.flight.FromAirportIATA=='PNQ'  )
							response.flight.GWLand=330;
						if (response.flight.ToAirportIATA=='PNQ' ) 
							response.flight.GWTO=330;
				if (response.flight.FromAirportIATA=='FRU'  )
							response.flight.GWLand=360;
						if (response.flight.ToAirportIATA=='FRU' ) 
							response.flight.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( response.flight.ToAirportIATA)!=-1 )
							response.flight.GWTO=240;
////////////////////////////////////////////////////////
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
                    type: 'danger', text: '', icon: 'remove', onClick: function (e) {
                        $scope.popup_lognew_visible = false;
                    }
                }, toolbar: 'bottom'
            }
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
          //$scope.ds_pax=[];
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
                else { $scope.timeBase = 'LCL'; }

                //sooki

                $scope.calculateTotalDelay();

                //if ($scope.flight.BoxId) {
                $scope.getCrewAbs($scope.logFlight.ID);
				
				
				 if (!$scope.chr_ds) {
                $scope.loadingVisible = true;
                flightService.getCharterers().then(function (response) {
                    $scope.chr_ds = response;
                    $scope.loadingVisible = false;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }
            $scope.dg_chr_ds = [];


            flightService.getFlightCharterers($scope.flight.ID).then(function (responsec) {
                $scope.dg_chr_ds = responsec;
			}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
				 $scope.mchr.Adult = $scope.logFlight.ChrAdult;
        $scope.mchr.Child = $scope.logFlight.ChrChild;
        $scope.mchr.Infant = $scope.logFlight.ChrInfant;
        $scope.mchr.Capacity = $scope.logFlight.ChrCapacity;
        $scope.mchr.Code = $scope.logFlight.ChrCode;
        $scope.mchr.Title = $scope.logFlight.ChrTitle;
        var _mchr = Enumerable.From($scope.mchr_ds).Where('$.Code=="' + $scope.logFlight.ChrCode + '"').FirstOrDefault();
        if (_mchr)
		    $scope.mchr.ChartererId = _mchr.Id;
		else 
			 $scope.mchr.ChartererId =null;
		 
		  flightService.getFlightPax($scope.flight.ID).then(function (responsepx) {
			 $scope.ds_pax =responsepx;
			 while ($scope.ds_pax.length<5) {
               $scope.ds_pax.push({Id: -1 * ($scope.ds_pax.length+1)});
             }
			  $scope.dg_pax_instance.refresh();
			// $scope.ds_pax.push({AirportId:77158});
			 // $scope.dg_pax_instance.refresh();
			 
			 
                //$scope.ds_pax = responsepx;
				console.log(responsepx);
				// if ($scope.ds_pax.length==0){
			     //      $scope.ds_pax.push({AirportId:$scope.logFlight.FromAirport});
		        //}
			}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		 
		
		 
		 
		 

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
                $scope.timeBase = 'LCL';



            $scope.dg_delay_ds = [];
            $scope.flightTakeOff2 = null;
            $scope.flightOnBlock2 = null;
            $scope.flightOffBlock2 = null;
            $scope.flightLanding2 = null;
            $scope.time_status_value = null;
			$scope.ds_pax=[];
			
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
            fullScreen:'popup_lognew_full',
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

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth:300,  },
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
            height:'dg_crew_lognew_height',
        }
    };

/////////////////////////////////////
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
///////////////////
			 General.Confirm('Are You Sure?', function (res) {
                        if (res) {

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
					var tn=(_flt.NewTime?'1':'0')+'-'+(_flt.NewReg?'1':'0');
                    aflt.taskName = tn;
                   
                });




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
 

                        }
                    });
			/////////////////
          

        }
    };
   $scope.btn_newreg = {
        hint: 'New Register',
        type: 'normal',
        icon: 'fas fa-plane',
        width: '100%',

        onClick: function (e) {

             if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
///////////////////
			 General.Confirm('Are You Sure?', function (res) {
                        if (res) {

                             var dto = {
                ids: Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray(),
                username: '',
            };
            $scope.loadingVisible = true;
            flightService.saveNewReg(dto).then(function (response) {

                General.ShowNotify(Config.Text_SavedOk, 'success');
                $scope.loadingVisible = false;


                $.each(response, function (_i, _flt) {
                    var aflt = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _flt.ID).FirstOrDefault();
					var tn=(_flt.NewTime?'1':'0')+'-'+(_flt.NewReg?'1':'0');
                    aflt.taskName = tn;
                   
                });




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
 

                        }
                    });
			/////////////////
          


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
	$scope.modifyIntAirports=function(resFlt){
		
		if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( resFlt.ToAirportIATA)!=-1 )
							resFlt.GWTO=180;
						
						if (resFlt.FromAirportIATA=='DAM'  )
							resFlt.GWLand=120;
						if (resFlt.ToAirportIATA=='DAM' ) 
							resFlt.GWTO=120;
						
						
						if (resFlt.FromAirportIATA=='DYU'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='DYU' ) 
							resFlt.GWTO=300;
		if (resFlt.FromAirportIATA=='TAS'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='TAS' ) 
							resFlt.GWTO=300;
						
						if (resFlt.FromAirportIATA=='FEG'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='FEG' ) 
							resFlt.GWTO=300;
		if (resFlt.FromAirportIATA=='NMA'  )
							resFlt.GWLand=300;
						if (resFlt.ToAirportIATA=='NMA' ) 
							resFlt.GWTO=300;
		if (resFlt.FromAirportIATA=='PNQ'  )
							resFlt.GWLand=330;
						if (resFlt.ToAirportIATA=='PNQ' ) 
							resFlt.GWTO=330;
		if (resFlt.FromAirportIATA=='FRU'  )
							resFlt.GWLand=360;
						if (resFlt.ToAirportIATA=='FRU' ) 
							resFlt.GWTO=360;
						
						  if (['TBS','BUS','EVN'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=240;
						if (['TBS','BUS','EVN'].indexOf( resFlt.ToAirportIATA)!=-1 )
							resFlt.GWTO=240;
	};
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
					
					
					$scope.modifyIntAirports(_d);
					
					
					var _xstd=new Date( _d.STDLocal);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _d.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-30));
               if (['DYU','FEG','NMA','TAS'].indexOf( _d.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(90));
					  if (['FRU'].indexOf( _d.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(150));
					if (['PNQ'].indexOf( _d.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(120));
			  if (['TBS','BUS','EVN'].indexOf( _d.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(30));
				
										
				var _xsta=new Date(_d.STALocal);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _d.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(-30));
				if (['DYU','FEG','NMA','TAS'].indexOf( _d.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(90));
					if (['FRU'].indexOf( _d.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(150));
					if (['PNQ'].indexOf( _d.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(120));
				if (['TBS','BUS','EVN'].indexOf( _d.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(30));
				
				 _d.STDLocal=new Date(_xstd);
				 _d.STALocal=new Date(_xsta);
					
					
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
		{ ID: 222, Register: "FSK" },
        { ID: 30, Register: "VAR" },
        { ID: 33, Register: "VBM" },
        { ID: 191, Register: "CNR" },
        { ID: 187, Register: "CNB" },
		
		 { ID: 224, Register: "VAV" },
        { ID: 223, Register: "VAK" },
    ];
    $scope.tbl_apts = [
       {IATA:"BDF",Id:77158},
{IATA:"VRS",Id:78093},
{IATA:"YHM",Id:86766},
{IATA:"CYM",Id:88340},
{IATA:"YEG",Id:88766},
{IATA:"YHZ",Id:88967},
{IATA:"FMU",Id:89143},
{IATA:"YDG",Id:89327},
{IATA:"YWH",Id:89919},
{IATA:"CNO",Id:89934},
{IATA:"YPQ",Id:89987},
{IATA:"YQG",Id:90301},
{IATA:"YYJ",Id:90465},
{IATA:"YSB",Id:90908},
{IATA:"BFT",Id:90926},
{IATA:"HIE",Id:90993},
{IATA:"APF",Id:91144},
{IATA:"PLY",Id:91216},
{IATA:"CGE",Id:91229},
{IATA:"BML",Id:91363},
{IATA:"BMT",Id:91365},
{IATA:"YVE",Id:91375},
{IATA:"BFR",Id:91378},
{IATA:"LVM",Id:91511},
{IATA:"AUG",Id:91830},
{IATA:"EFK",Id:91856},
{IATA:"ELY",Id:91865},
{IATA:"ORN",Id:92044},
{IATA:"WSG",Id:92238},
{IATA:"HPT",Id:92334},
{IATA:"DNL",Id:92513},
{IATA:"HSI",Id:92694},
{IATA:"LDJ",Id:92734},
{IATA:"HAO",Id:93050},
{IATA:"ILF",Id:93537},
{IATA:"MEV",Id:93600},
{IATA:"OIC",Id:93654},
{IATA:"CBH",Id:93724},
{IATA:"WGO",Id:93732},
{IATA:"MTJ",Id:93752},
{IATA:"THV",Id:93945},
{IATA:"MAC",Id:94012},
{IATA:"RME",Id:94108},
{IATA:"CGN",Id:94161},
{IATA:"DUS",Id:94165},
{IATA:"VJI",Id:94195},
{IATA:"WJF",Id:94207},
{IATA:"REO",Id:94289},
{IATA:"SGT",Id:94363},
{IATA:"TXL",Id:94390},
{IATA:"MMS",Id:94489},
{IATA:"SME",Id:94546},
{IATA:"OCW",Id:94569},
{IATA:"OXC",Id:94591},
{IATA:"OXD",Id:94594},
{IATA:"ONP",Id:94655},
{IATA:"PHT",Id:94674},
{IATA:"PMH",Id:94677},
{IATA:"OEA",Id:94708},
{IATA:"PYM",Id:94732},
{IATA:"RCR",Id:94751},
{IATA:"WDR",Id:94869},
{IATA:"SRW",Id:94974},
{IATA:"VNC",Id:95042},
{IATA:"BWE",Id:95220},
{IATA:"SLO",Id:95232},
{IATA:"ZMG",Id:95366},
{IATA:"DRS",Id:95385},
{IATA:"SUD",Id:95414},
{IATA:"IES",Id:95477},
{IATA:"NUE",Id:95638},
{IATA:"XFW",Id:95674},
{IATA:"FMO",Id:95806},
{IATA:"HAM",Id:95810},
{IATA:"LEJ",Id:96015},
{IATA:"NRN",Id:96060},
{IATA:"LBC",Id:96372},
{IATA:"FMM",Id:96375},
{IATA:"RBM",Id:96501},
{IATA:"BYU",Id:96523},
{IATA:"AOC",Id:96551},
{IATA:"ZQL",Id:96608},
{IATA:"STR",Id:96754},
{IATA:"CBU",Id:96884},
{IATA:"SXF",Id:96897},
{IATA:"EIB",Id:97017},
{IATA:"BBJ",Id:97052},
{IATA:"DTM",Id:97204},
{IATA:"AGB",Id:97206},
{IATA:"BFE",Id:97256},
{IATA:"MGL",Id:97259},
{IATA:"SCN",Id:97345},
{IATA:"MHG",Id:97359},
{IATA:"KSF",Id:97390},
{IATA:"GWT",Id:97416},
{IATA:"PAD",Id:97619},
{IATA:"EME",Id:97713},
{IATA:"LBA",Id:97847},
{IATA:"FDH",Id:97866},
{IATA:"ZQW",Id:97914},
{IATA:"WVN",Id:98200},
{IATA:"FLF",Id:98205},
{IATA:"QHU",Id:98209},
{IATA:"LSI",Id:98399},
{IATA:"INV",Id:98403},
{IATA:"GLA",Id:98404},
{IATA:"NWI",Id:98572},
{IATA:"STN",Id:98575},
{IATA:"MJR",Id:98708},
{IATA:"LTN",Id:98746},
{IATA:"NHT",Id:98864},
{IATA:"DSA",Id:99046},
{IATA:"BOH",Id:99086},
{IATA:"CVT",Id:99261},
{IATA:"LHR",Id:99356},
{IATA:"BLK",Id:99564},
{IATA:"HUY",Id:99567},
{IATA:"EMA",Id:99592},
{IATA:"HAW",Id:99609},
{IATA:"SWS",Id:99612},
{IATA:"FAB",Id:99794},
{IATA:"NQT",Id:99834},
{IATA:"EXT",Id:100011},
{IATA:"CAX",Id:100046},
{IATA:"MME",Id:100070},
{IATA:"LPL",Id:100119},
{IATA:"EDI",Id:100331},
{IATA:"MAN",Id:100673},
{IATA:"BWF",Id:100695},
{IATA:"MHZ",Id:100808},
{IATA:"WAW",Id:100845},
{IATA:"CRZ",Id:100847},
{IATA:"SCW",Id:100851},
{IATA:"KZN",Id:100852},
{IATA:"NBC",Id:100853},
{IATA:"OSW",Id:100854},
{IATA:"IDR",Id:100860},
{IATA:"CCU",Id:100869},
{IATA:"IMF",Id:100871},
{IATA:"DIB",Id:100872},
{IATA:"YEO",Id:100880},
{IATA:"CWL",Id:100885},
{IATA:"SOU",Id:100898},
{IATA:"BQH",Id:100908},
{IATA:"LGW",Id:100910},
{IATA:"SYY",Id:100927},
{IATA:"PAT",Id:101153},
{IATA:"TRV",Id:101173},
{IATA:"LMN",Id:101197},
{IATA:"BKI",Id:101434},
{IATA:"SDK",Id:101435},
{IATA:"CGK",Id:101438},
{IATA:"BTJ",Id:101441},
{IATA:"QUY",Id:102122},
{IATA:"KTW",Id:102134},
{IATA:"MQF",Id:102199},
{IATA:"TAZ",Id:102201},
{IATA:"KSQ",Id:102203},
{IATA:"VOZ",Id:102205},
{IATA:"IXU",Id:102210},
{IATA:"BHU",Id:102211},
{IATA:"IXY",Id:102212},
{IATA:"GAU",Id:102217},
{IATA:"IXC",Id:102222},
{IATA:"EGO",Id:102331},
{IATA:"GOJ",Id:102332},
{IATA:"REN",Id:102334},
{IATA:"HBX",Id:102337},
{IATA:"PNQ",Id:102338},
{IATA:"IXB",Id:102342},
{IATA:"SPD",Id:102344},
{IATA:"IXD",Id:102345},
{IATA:"BEK",Id:102347},
{IATA:"KNU",Id:102348},
{IATA:"JDH",Id:102351},
{IATA:"JAI",Id:102352},
{IATA:"IXJ",Id:102353},
{IATA:"BPM",Id:102361},
{IATA:"IXL",Id:102411},
{IATA:"LKO",Id:102413},
{IATA:"PNY",Id:102423},
{IATA:"KBV",Id:102427},
{IATA:"LBU",Id:102452},
{IATA:"TIR",Id:102595},
{IATA:"DMK",Id:102597},
{IATA:"TWU",Id:102623},
{IATA:"JHB",Id:102631},
{IATA:"CZW",Id:102706},
{IATA:"KOQ",Id:102775},
{IATA:"LST",Id:102891},
{IATA:"JAD",Id:102904},
{IATA:"CEK",Id:102964},
{IATA:"BGO",Id:102977},
{IATA:"XDA",Id:103081},
{IATA:"PER",Id:103201},
{IATA:"FRZ",Id:103214},
{IATA:"KZG",Id:103229},
{IATA:"RLG",Id:103238},
{IATA:"SGC",Id:103291},
{IATA:"WRO",Id:103292},
{IATA:"SVO",Id:103295},
{IATA:"KLD",Id:103296},
{IATA:"BOM",Id:103298},
{IATA:"PAB",Id:103301},
{IATA:"UDR",Id:103304},
{IATA:"IXA",Id:103308},
{IATA:"AJL",Id:103311},
{IATA:"AIP",Id:103317},
{IATA:"DEL",Id:103318},
{IATA:"KTU",Id:103320},
{IATA:"BEP",Id:103322},
{IATA:"IXM",Id:103324},
{IATA:"HDY",Id:103335},
{IATA:"BZG",Id:103395},
{IATA:"SCP",Id:103526},
{IATA:"LCJ",Id:103599},
{IATA:"RDO",Id:103693},
{IATA:"RZE",Id:103694},
{IATA:"SZZ",Id:103699},
{IATA:"LDU",Id:103778},
{IATA:"BKK",Id:103831},
{IATA:"PEE",Id:103932},
{IATA:"KGP",Id:103933},
{IATA:"URS",Id:103936},
{IATA:"BHJ",Id:103942},
{IATA:"BDQ",Id:103943},
{IATA:"BHO",Id:103944},
{IATA:"JGA",Id:103945},
{IATA:"NJC",Id:103954},
{IATA:"PBD",Id:103965},
{IATA:"SSE",Id:103968},
{IATA:"ATQ",Id:103979},
{IATA:"BKB",Id:103980},
{IATA:"SXR",Id:103986},
{IATA:"XRH",Id:104045},
{IATA:"AAH",Id:104109},
{IATA:"GDN",Id:104148},
{IATA:"BBI",Id:104173},
{IATA:"ZER",Id:104176},
{IATA:"COK",Id:104189},
{IATA:"RJA",Id:104193},
{IATA:"PXR",Id:104203},
{IATA:"AMQ",Id:104213},
{IATA:"VAC",Id:104310},
{IATA:"HKT",Id:104374},
{IATA:"SBW",Id:104391},
{IATA:"HLP",Id:104395},
{IATA:"KTE",Id:104401},
{IATA:"MKZ",Id:104402},
{IATA:"WMI",Id:104414},
{IATA:"QYD",Id:104415},
{IATA:"POZ",Id:104421},
{IATA:"SZY",Id:104449},
{IATA:"EUM",Id:104457},
{IATA:"MVV",Id:104563},
{IATA:"OAG",Id:104670},
{IATA:"VKO",Id:104691},
{IATA:"RTW",Id:104693},
{IATA:"UFA",Id:104694},
{IATA:"KUF",Id:104695},
{IATA:"AKD",Id:104696},
{IATA:"IXG",Id:104698},
{IATA:"GOP",Id:104708},
{IATA:"JRH",Id:104709},
{IATA:"IXS",Id:104710},
{IATA:"IXR",Id:104712},
{IATA:"VTZ",Id:104715},
{IATA:"IXE",Id:104729},
{IATA:"MAA",Id:104730},
{IATA:"IXZ",Id:104731},
{IATA:"SXV",Id:104733},
{IATA:"BTU",Id:104735},
{IATA:"ORM",Id:104923},
{IATA:"QUG",Id:104929},
{IATA:"TJV",Id:104970},
{IATA:"MYY",Id:104996},
{IATA:"PCB",Id:104999},
{IATA:"IPH",Id:105005},
{IATA:"TGG",Id:105006},
{IATA:"FCN",Id:105030},
{IATA:"FNB",Id:105046},
{IATA:"WIE",Id:105055},
{IATA:"FEL",Id:105059},
{IATA:"SPM",Id:105068},
{IATA:"SXE",Id:105070},
{IATA:"LCV",Id:105147},
{IATA:"KAA",Id:105171},
{IATA:"CSO",Id:105286},
{IATA:"SXN",Id:105300},
{IATA:"TMW",Id:105386},
{IATA:"CII",Id:105422},
{IATA:"DPE",Id:105554},
{IATA:"IGS",Id:105628},
{IATA:"DCG",Id:105774},
{IATA:"DWC",Id:105951},
{IATA:"ABB",Id:105973},
{IATA:"RCS",Id:106120},
{IATA:"MCQ",Id:106228},
{IATA:"BNT",Id:106253},
{IATA:"BHR",Id:106259},
{IATA:"NDC",Id:106326},
{IATA:"BLC",Id:106344},
{IATA:"SZS",Id:106354},
{IATA:"ACS",Id:106540},
{IATA:"RNA",Id:106596},
{IATA:"LSO",Id:106765},
{IATA:"BHP",Id:106911},
{IATA:"XBX",Id:107282},
{IATA:"LWK",Id:107559},
{IATA:"KRH",Id:107562},
{IATA:"FNU",Id:107639},
{IATA:"GDI",Id:107654},
{IATA:"ECN",Id:107784},
{IATA:"BTZ",Id:107922},
{IATA:"VIN",Id:108042},
{IATA:"ONQ",Id:108051},
{IATA:"AZS",Id:108056},
{IATA:"HDD",Id:109070},
{IATA:"GDG",Id:109153},
{IATA:"DJH",Id:109179},
{IATA:"PMM",Id:109198},
{IATA:"GDZ",Id:109507},
{IATA:"IJK",Id:109678},
{IATA:"IXN",Id:109695},
{IATA:"IXT",Id:109696},
{IATA:"QRT",Id:109851},
{IATA:"EPS",Id:109855},
{IATA:"KHC",Id:109978},
{IATA:"JIW",Id:110039},
{IATA:"AAU",Id:110138},
{IATA:"ATX",Id:110146},
{IATA:"BWO",Id:110170},
{IATA:"DBA",Id:110649},
{IATA:"KPI",Id:110696},
{IATA:"KRO",Id:110697},
{IATA:"ALY",Id:110702},
{IATA:"GOC",Id:110729},
{IATA:"KSZ",Id:111002},
{IATA:"BXP",Id:111127},
{IATA:"DNF",Id:111381},
{IATA:"LUZ",Id:111397},
{IATA:"FAH",Id:111528},
{IATA:"JGB",Id:111695},
{IATA:"AHJ",Id:111723},
{IATA:"OXB",Id:111764},
{IATA:"NRM",Id:111891},
{IATA:"OMN",Id:112033},
{IATA:"KDC",Id:112073},
{IATA:"KVR",Id:112142},
{IATA:"FBD",Id:112197},
{IATA:"KMW",Id:112392},
{IATA:"LDA",Id:112410},
{IATA:"SMJ",Id:112443},
{IATA:"RMD",Id:112865},
{IATA:"IAA",Id:113168},
{IATA:"PRS",Id:113366},
{IATA:"KGU",Id:113460},
{IATA:"PEX",Id:113565},
{IATA:"NKT",Id:113603},
{IATA:"IWA",Id:113631},
{IATA:"RYB",Id:113726},
{IATA:"RDP",Id:113739},
{IATA:"BNH",Id:113797},
{IATA:"RNU",Id:113825},
{IATA:"SGI",Id:114170},
{IATA:"SMM",Id:114211},
{IATA:"MYQ",Id:114867},
{IATA:"YKO",Id:114936},
{IATA:"HBE",Id:114947},
{IATA:"TIP",Id:115103},
{IATA:"TBW",Id:115316},
{IATA:"SUH",Id:115722},
{IATA:"PEZ",Id:115795},
{IATA:"NEF",Id:115852},
{IATA:"PLV",Id:115917},
{IATA:"NOZ",Id:116124},
{IATA:"MJI",Id:116279},
{IATA:"TPG",Id:116354},
{IATA:"TOX",Id:116505},
{IATA:"TVU",Id:116519},
{IATA:"MEF",Id:116625},
{IATA:"UTR",Id:116830},
{IATA:"MXH",Id:116918},
{IATA:"PYB",Id:116997},
{IATA:"RGH",Id:117025},
{IATA:"KHE",Id:117126},
{IATA:"UMY",Id:117128},
{IATA:"SBQ",Id:117745},
{IATA:"OVS",Id:117955},
{IATA:"KCK",Id:118365},
{IATA:"TQL",Id:118382},
{IATA:"USK",Id:118388},
{IATA:"AGS",Id:118535},
{IATA:"ISG",Id:118588},
{IATA:"REW",Id:118687},
{IATA:"ATG",Id:118691},
{IATA:"BHM",Id:118783},
{IATA:"DOV",Id:118818},
{IATA:"SAG",Id:119080},
{IATA:"AXN",Id:119297},
{IATA:"FLO",Id:119449},
{IATA:"TQN",Id:119452},
{IATA:"BOS",Id:119545},
{IATA:"CLE",Id:119554},
{IATA:"KVK",Id:119578},
{IATA:"KQH",Id:119746},
{IATA:"VKT",Id:119917},
{IATA:"AEX",Id:120114},
{IATA:"WGC",Id:120195},
{IATA:"OSF",Id:120309},
{IATA:"CKL",Id:120318},
{IATA:"DCA",Id:120393},
{IATA:"OHH",Id:120625},
{IATA:"EWR",Id:120637},
{IATA:"PID",Id:120649},
{IATA:"ZAJ",Id:120725},
{IATA:"CNN",Id:120807},
{IATA:"KCZ",Id:121274},
{IATA:"HYD",Id:121310},
{IATA:"ESF",Id:121311},
{IATA:"NYM",Id:121315},
{IATA:"LFI",Id:121686},
{IATA:"TEI",Id:121768},
{IATA:"TOF",Id:121807},
{IATA:"LOZ",Id:121850},
{IATA:"TYD",Id:121968},
{IATA:"UIK",Id:121993},
{IATA:"ABR",Id:122227},
{IATA:"BFD",Id:122243},
{IATA:"BQK",Id:122248},
{IATA:"PSM",Id:122655},
{IATA:"CGF",Id:122753},
{IATA:"RDG",Id:122799},
{IATA:"RMG",Id:122817},
{IATA:"ROC",Id:122828},
{IATA:"RST",Id:122832},
{IATA:"NHZ",Id:122928},
{IATA:"LNS",Id:123069},
{IATA:"ORH",Id:123207},
{IATA:"SLE",Id:123254},
{IATA:"MFD",Id:123296},
{IATA:"GGW",Id:123315},
{IATA:"SBY",Id:123456},
{IATA:"IAD",Id:123745},
{IATA:"RIC",Id:124158},
{IATA:"LNK",Id:124565},
{IATA:"LTU",Id:124763},
{IATA:"VAR",Id:124774},
{IATA:"MCN",Id:124968},
{IATA:"BED",Id:125110},
{IATA:"UUA",Id:125685},
{IATA:"GZI",Id:125703},
{IATA:"CSF",Id:126683},
{IATA:"VCT",Id:126958},
{IATA:"XMW",Id:127085},
{IATA:"LYS",Id:127322},
{IATA:"TYA",Id:127418},
{IATA:"LBG",Id:127624},
{IATA:"CDG",Id:127630},
{IATA:"QNJ",Id:127746},
{IATA:"KVA",Id:127860},
{IATA:"NTE",Id:127946},
{IATA:"HRR",Id:127977},
{IATA:"SKT",Id:128088},
{IATA:"INA",Id:128191},
{IATA:"FOG",Id:128219},
{IATA:"KCI",Id:128302},
{IATA:"NCE",Id:128323},
{IATA:"WGB",Id:128333},
{IATA:"LRG",Id:128336},
{IATA:"KZI",Id:128555},
{IATA:"LRA",Id:128557},
{IATA:"TSF",Id:128625},
{IATA:"EKB",Id:128852},
{IATA:"SAY",Id:128923},
{IATA:"AUR",Id:129059},
{IATA:"LBY",Id:129136},
{IATA:"DOL",Id:129141},
{IATA:"LAI",Id:129160},
{IATA:"PRX",Id:129176},
{IATA:"RAN",Id:129265},
{IATA:"GOA",Id:129289},
{IATA:"KLX",Id:129427},
{IATA:"HER",Id:129710},
{IATA:"BGG",Id:129911},
{IATA:"IAS",Id:129916},
{IATA:"QAQ",Id:130023},
{IATA:"BRI",Id:130096},
{IATA:"PSR",Id:130102},
{IATA:"MXP",Id:130139},
{IATA:"TRN",Id:130271},
{IATA:"CSB",Id:130397},
{IATA:"SBZ",Id:130407},
{IATA:"TSR",Id:130415},
{IATA:"ANK",Id:130448},
{IATA:"UAB",Id:130451},
{IATA:"TJK",Id:130465},
{IATA:"RMI",Id:130508},
{IATA:"QPA",Id:130512},
{IATA:"SXB",Id:130531},
{IATA:"GFR",Id:130650},
{IATA:"DIY",Id:130761},
{IATA:"VRN",Id:130806},
{IATA:"UKX",Id:130862},
{IATA:"KLF",Id:130863},
{IATA:"KVX",Id:130868},
{IATA:"PEG",Id:130931},
{IATA:"VAN",Id:131026},
{IATA:"BAL",Id:131031},
{IATA:"UOX",Id:131204},
{IATA:"AOE",Id:131212},
{IATA:"ERC",Id:131222},
{IATA:"DEB",Id:131306},
{IATA:"TAR",Id:131326},
{IATA:"KSO",Id:131353},
{IATA:"NVY",Id:131377},
{IATA:"BBU",Id:131529},
{IATA:"CRA",Id:131534},
{IATA:"CAG",Id:131561},
{IATA:"TGP",Id:131704},
{IATA:"SKX",Id:131706},
{IATA:"BDS",Id:131735},
{IATA:"GZP",Id:131737},
{IATA:"USR",Id:131765},
{IATA:"CLJ",Id:131775},
{IATA:"LNX",Id:131808},
{IATA:"BLQ",Id:131843},
{IATA:"VCE",Id:131861},
{IATA:"NAP",Id:131877},
{IATA:"PSA",Id:131879},
{IATA:"ESB",Id:132024},
{IATA:"LIN",Id:132244},
{IATA:"FCO",Id:132276},
{IATA:"KYA",Id:132293},
{IATA:"MZH",Id:132297},
{IATA:"NAV",Id:132314},
{IATA:"IST",Id:132316},
{IATA:"FLR",Id:132577},
{IATA:"DOH",Id:132636},
{IATA:"TZL",Id:132641},
{IATA:"BAY",Id:132645},
{IATA:"OGU",Id:132649},
{IATA:"BJX",Id:132728},
{IATA:"TEQ",Id:132779},
{IATA:"USQ",Id:132869},
{IATA:"DLM",Id:132875},
{IATA:"BUZ",Id:133030},
{IATA:"JWN",Id:133037},
{IATA:"AWZ",Id:133133},
{IATA:"BND",Id:133138},
{IATA:"SXZ",Id:133139},
{IATA:"AFY",Id:133191},
{IATA:"MLX",Id:133209},
{IATA:"ASR",Id:133212},
{IATA:"BCM",Id:133305},
{IATA:"OMR",Id:133323},
{IATA:"SCV",Id:133331},
{IATA:"PSI",Id:133335},
{IATA:"XQC",Id:133336},
{IATA:"ALP",Id:133338},
{IATA:"MMJ",Id:133366},
{IATA:"KUH",Id:133373},
{IATA:"SHB",Id:133374},
{IATA:"OIT",Id:133375},
{IATA:"AOJ",Id:133377},
{IATA:"JYR",Id:133379},
{IATA:"GBT",Id:133382},
{IATA:"PFQ",Id:133384},
{IATA:"AZD",Id:133385},
{IATA:"KYE",Id:133391},
{IATA:"DXB",Id:133394},
{IATA:"NHD",Id:133395},
{IATA:"SLL",Id:133396},
{IATA:"BHV",Id:133398},
{IATA:"MUX",Id:133401},
{IATA:"DAM",Id:133405},
{IATA:"MSR",Id:133426},
{IATA:"KCM",Id:133430},
{IATA:"ADF",Id:133432},
{IATA:"OBO",Id:133636},
{IATA:"IZO",Id:133641},
{IATA:"YGJ",Id:133642},
{IATA:"FKS",Id:133643},
{IATA:"KIJ",Id:133665},
{IATA:"ORA",Id:133698},
{IATA:"BOU",Id:133784},
{IATA:"TZX",Id:133807},
{IATA:"ISE",Id:133829},
{IATA:"BJV",Id:133833},
{IATA:"CKZ",Id:133884},
{IATA:"ZIC",Id:133971},
{IATA:"PPJ",Id:134080},
{IATA:"MRS",Id:134089},
{IATA:"KBH",Id:134100},
{IATA:"SWN",Id:134101},
{IATA:"XAB",Id:134122},
{IATA:"YEI",Id:134144},
{IATA:"UNA",Id:134320},
{IATA:"ORY",Id:134368},
{IATA:"ERZ",Id:134404},
{IATA:"KSY",Id:134408},
{IATA:"EDO",Id:134437},
{IATA:"TSE",Id:134464},
{IATA:"KVD",Id:134466},
{IATA:"IKT",Id:134469},
{IATA:"DNK",Id:134470},
{IATA:"KGD",Id:134475},
{IATA:"OVB",Id:134478},
{IATA:"KRR",Id:134479},
{IATA:"XCZ",Id:134775},
{IATA:"NAS",Id:134880},
{IATA:"KBL",Id:134900},
{IATA:"DMB",Id:134927},
{IATA:"KSN",Id:134929},
{IATA:"HTA",Id:134932},
{IATA:"KBP",Id:134933},
{IATA:"NAL",Id:134938},
{IATA:"OGZ",Id:134939},
{IATA:"CKT",Id:135145},
{IATA:"KHS",Id:135152},
{IATA:"JAG",Id:135154},
{IATA:"IQA",Id:135159},
{IATA:"DDU",Id:135186},
{IATA:"SPJ",Id:135407},
{IATA:"SKG",Id:135419},
{IATA:"BUD",Id:135423},
{IATA:"TSJ",Id:135434},
{IATA:"HIJ",Id:135437},
{IATA:"AHB",Id:135490},
{IATA:"GIZ",Id:135493},
{IATA:"IFN",Id:135500},
{IATA:"THR",Id:135502},
{IATA:"LRR",Id:135504},
{IATA:"OMH",Id:135507},
{IATA:"MWD",Id:135513},
{IATA:"NHS",Id:135515},
{IATA:"GGT",Id:135594},
{IATA:"CHC",Id:135609},
{IATA:"SOB",Id:135674},
{IATA:"CTA",Id:135689},
{IATA:"RYK",Id:135746},
{IATA:"TUK",Id:135748},
{IATA:"BGW",Id:135749},
{IATA:"MMB",Id:135790},
{IATA:"YNB",Id:135856},
{IATA:"ABD",Id:135857},
{IATA:"BSM",Id:135865},
{IATA:"SYZ",Id:135866},
{IATA:"MCT",Id:135870},
{IATA:"DEA",Id:135871},
{IATA:"LHE",Id:135873},
{IATA:"AHO",Id:135983},
{IATA:"PMF",Id:136011},
{IATA:"CUF",Id:136018},
{IATA:"KMI",Id:136026},
{IATA:"NGS",Id:136028},
{IATA:"NKM",Id:136030},
{IATA:"TOY",Id:136032},
{IATA:"ITM",Id:136033},
{IATA:"GAJ",Id:136035},
{IATA:"ONJ",Id:136038},
{IATA:"SDJ",Id:136039},
{IATA:"UKB",Id:136099},
{IATA:"FUK",Id:136102},
{IATA:"KKJ",Id:136104},
{IATA:"HSG",Id:136105},
{IATA:"KMQ",Id:136108},
{IATA:"IWK",Id:136110},
{IATA:"MSJ",Id:136113},
{IATA:"LLK",Id:136119},
{IATA:"AOI",Id:136276},
{IATA:"CIA",Id:136281},
{IATA:"QLT",Id:136291},
{IATA:"OKO",Id:136343},
{IATA:"OKA",Id:136347},
{IATA:"GUW",Id:136469},
{IATA:"OPS",Id:136474},
{IATA:"BAH",Id:136629},
{IATA:"HAS",Id:136633},
{IATA:"OMI",Id:136640},
{IATA:"KSH",Id:136644},
{IATA:"IIL",Id:136645},
{IATA:"RAS",Id:136647},
{IATA:"HDM",Id:136650},
{IATA:"JAR",Id:136651},
{IATA:"SHJ",Id:136659},
{IATA:"XJM",Id:136661},
{IATA:"BDN",Id:136662},
{IATA:"VVO",Id:136712},
{IATA:"VSG",Id:136713},
{IATA:"OZH",Id:136714},
{IATA:"RWN",Id:136715},
{IATA:"BQT",Id:136716},
{IATA:"BAX",Id:136718},
{IATA:"HKD",Id:136886},
{IATA:"WKJ",Id:136887},
{IATA:"UBJ",Id:136889},
{IATA:"KOJ",Id:136890},
{IATA:"QGU",Id:136891},
{IATA:"NTQ",Id:136893},
{IATA:"IGD",Id:137172},
{IATA:"OTP",Id:137174},
{IATA:"GDX",Id:137244},
{IATA:"HRK",Id:137245},
{IATA:"GML",Id:137246},
{IATA:"PKV",Id:137248},
{IATA:"PES",Id:137249},
{IATA:"OMS",Id:137250},
{IATA:"TAB",Id:137383},
{IATA:"KGF",Id:137385},
{IATA:"PWQ",Id:137387},
{IATA:"LWN",Id:137388},
{IATA:"IEV",Id:137391},
{IATA:"MMK",Id:137394},
{IATA:"AAQ",Id:137397},
{IATA:"AER",Id:137399},
{IATA:"ESL",Id:137400},
{IATA:"SUJ",Id:137692},
{IATA:"TCE",Id:137697},
{IATA:"ADA",Id:137983},
{IATA:"DNZ",Id:138001},
{IATA:"ADB",Id:138016},
{IATA:"GKD",Id:138418},
{IATA:"BDA",Id:138422},
{IATA:"IKS",Id:138427},
{IATA:"DYR",Id:138428},
{IATA:"CKC",Id:138430},
{IATA:"UDJ",Id:138431},
{IATA:"ODS",Id:138432},
{IATA:"KEJ",Id:138435},
{IATA:"STW",Id:138436},
{IATA:"EZS",Id:138611},
{IATA:"SFQ",Id:138623},
{IATA:"SZF",Id:138895},
{IATA:"SAW",Id:138897},
{IATA:"RAH",Id:140850},
{IATA:"TUU",Id:140853},
{IATA:"KIH",Id:140857},
{IATA:"IKA",Id:140866},
{IATA:"GZW",Id:140867},
{IATA:"KER",Id:140868},
{IATA:"XBJ",Id:140869},
{IATA:"MHD",Id:140870},
{IATA:"KLM",Id:140871},
{IATA:"SRY",Id:140874},
{IATA:"GWD",Id:140877},
{IATA:"KHI",Id:140878},
{IATA:"UET",Id:140881},
{IATA:"NRT",Id:141156},
{IATA:"KIX",Id:141157},
{IATA:"MYJ",Id:141163},
{IATA:"IWJ",Id:141164},
{IATA:"ALA",Id:141861},
{IATA:"EVN",Id:141866},
{IATA:"PWE",Id:141868},
{IATA:"BTK",Id:141869},
{IATA:"NSK",Id:141874},
{IATA:"VOG",Id:141877},
{IATA:"GFD",Id:144637},
{IATA:"YXU",Id:145096},
{IATA:"WIB",Id:145128},
{IATA:"GLW",Id:145170},
{IATA:"HAB",Id:145191},
{IATA:"NPT",Id:145505},
{IATA:"ERF",Id:145716},
{IATA:"HAJ",Id:145748},
{IATA:"BRE",Id:145752},
{IATA:"KEL",Id:145777},
{IATA:"HOQ",Id:145846},
{IATA:"FKB",Id:145864},
{IATA:"BHX",Id:146140},
{IATA:"NQY",Id:146173},
{IATA:"BRS",Id:146186},
{IATA:"ESH",Id:146206},
{IATA:"ABZ",Id:146268},
{IATA:"PIK",Id:146284},
{IATA:"DND",Id:146290},
{IATA:"CBG",Id:146303},
{IATA:"BEQ",Id:146376},
{IATA:"KRK",Id:146626},
{IATA:"SVX",Id:146697},
{IATA:"DYU",Id:146698},
{IATA:"DME",Id:146699},
{IATA:"CSY",Id:146701},
{IATA:"AMD",Id:146703},
{IATA:"HJR",Id:146705},
{IATA:"RAJ",Id:146706},
{IATA:"RPR",Id:146707},
{IATA:"SHL",Id:146710},
{IATA:"IXW",Id:146713},
{IATA:"DMU",Id:146715},
{IATA:"DAC",Id:146718},
{IATA:"VNS",Id:146721},
{IATA:"DED",Id:146724},
{IATA:"GWL",Id:146725},
{IATA:"IXP",Id:146726},
{IATA:"CJB",Id:146728},
{IATA:"UTP",Id:146734},
{IATA:"KCH",Id:146752},
{IATA:"KUA",Id:146758},
{IATA:"LEA",Id:146791},
{IATA:"RMA",Id:146796},
{IATA:"MGH",Id:146941},
{IATA:"BNJ",Id:147004},
{IATA:"PSL",Id:147102},
{IATA:"HYC",Id:147112},
{IATA:"CIY",Id:147215},
{IATA:"KFS",Id:147260},
{IATA:"MNS",Id:147303},
{IATA:"QGF",Id:147325},
{IATA:"KIQ",Id:147360},
{IATA:"NOP",Id:147392},
{IATA:"ADH",Id:147421},
{IATA:"AKU",Id:147426},
{IATA:"BIN",Id:147452},
{IATA:"ORO",Id:147830},
{IATA:"KDD",Id:148003},
{IATA:"KHM",Id:148009},
{IATA:"KUD",Id:148043},
{IATA:"KYZ",Id:148050},
{IATA:"MEP",Id:148138},
{IATA:"WHL",Id:148210},
{IATA:"SLH",Id:148595},
{IATA:"ULK",Id:148792},
{IATA:"OTY",Id:148808},
{IATA:"VGD",Id:148837},
{IATA:"DIU",Id:149199},
{IATA:"BKL",Id:149231},
{IATA:"LYU",Id:149284},
{IATA:"MHT",Id:149522},
{IATA:"SSI",Id:149872},
{IATA:"GRT",Id:150374},
{IATA:"PST",Id:150482},
{IATA:"IOA",Id:150539},
{IATA:"CRV",Id:150613},
{IATA:"PMO",Id:150625},
{IATA:"BGY",Id:150656},
{IATA:"QSR",Id:150701},
{IATA:"ZTU",Id:150723},
{IATA:"UKS",Id:150761},
{IATA:"DEP",Id:150788},
{IATA:"GNY",Id:150792},
{IATA:"ARW",Id:150825},
{IATA:"QEO",Id:150827},
{IATA:"CND",Id:150828},
{IATA:"TGK",Id:150847},
{IATA:"AYT",Id:150903},
{IATA:"GZT",Id:150905},
{IATA:"VAS",Id:150913},
{IATA:"MQM",Id:151013},
{IATA:"LTO",Id:151220},
{IATA:"HLZ",Id:151266},
{IATA:"NSN",Id:151269},
{IATA:"WLG",Id:151272},
{IATA:"PYK",Id:151294},
{IATA:"AFZ",Id:151296},
{IATA:"TCX",Id:151297},
{IATA:"FAZ",Id:151298},
{IATA:"ADU",Id:151299},
{IATA:"TBZ",Id:151300},
{IATA:"LYP",Id:151304},
{IATA:"SKZ",Id:151309},
{IATA:"KIK",Id:151311},
{IATA:"OKD",Id:151344},
{IATA:"KMJ",Id:151345},
{IATA:"NGO",Id:151346},
{IATA:"TTJ",Id:151349},
{IATA:"TKS",Id:151350},
{IATA:"TAK",Id:151351},
{IATA:"AXT",Id:151352},
{IATA:"HND",Id:151355},
{IATA:"BKN",Id:151482},
{IATA:"SCO",Id:151489},
{IATA:"CWC",Id:151497},
{IATA:"ABA",Id:151500},
{IATA:"ZBR",Id:152331},
{IATA:"LPR",Id:152333},
{IATA:"GSM",Id:152334},
{IATA:"PGU",Id:152335},
{IATA:"MRX",Id:152337},
{IATA:"UGT",Id:152338},
{IATA:"TTQ",Id:152339},
{IATA:"NJF",Id:152340},
{IATA:"ZAH",Id:152341},
{IATA:"ASF",Id:152342},
{IATA:"AUH",Id:152343},
{IATA:"BEY",Id:152344},
{IATA:"CMB",Id:152345},
{IATA:"DEF",Id:152346},
{IATA:"GYD",Id:152347},
{IATA:"IKA0700",Id:152348},
{IATA:"JED",Id:152349},
{IATA:"KHD",Id:152350},
{IATA:"KLB",Id:152351},
{IATA:"KWI",Id:152352},
{IATA:"LED",Id:152353},
{IATA:"MZR",Id:152354},
{IATA:"RJN",Id:152355},
{IATA:"RUH",Id:152356},
{IATA:"TAS",Id:152357},
{IATA:"TBN",Id:152358},
{IATA:"YAZ",Id:152359},
{IATA:"YZD",Id:152360},
{IATA:"AJK",Id:152361},
{IATA:"BUS",Id:152362},
{IATA:"DEZ",Id:152363},
{IATA:"NSH",Id:152364},
{IATA:"SOF",Id:152365},
{IATA:"TBS",Id:152366},
{IATA:"SDG",Id:152367},
{IATA:"AAN",Id:152368},
{IATA:"ACP",Id:152369},
{IATA:"AMM",Id:152370},
{IATA:"BJB",Id:152371},
{IATA:"IMQ",Id:152372},
{IATA:"KKS",Id:152373},
{IATA:"PGF",Id:152374},
{IATA:"SYJ",Id:152375},
{IATA:"OHS",Id:152376},
{IATA:"THR0720",Id:152377},
{IATA:"ELQ",Id:152378},
{IATA:"FRU",Id:152379},
{IATA:"GOI",Id:152380},
{IATA:"LVP",Id:152381},
{IATA:"CIT",Id:152382},
{IATA:"FEG",Id:152383},
{IATA:"2641",Id:152384},
{IATA:"5",Id:152385},
{IATA:"AEU",Id:152386},
{IATA:"AKW",Id:152387},
{IATA:"BDH",Id:152388},
{IATA:"CQD",Id:152389},
{IATA:"DMM",Id:152390},
{IATA:"GCH",Id:152391},
{IATA:"IAQ",Id:152392},
{IATA:"JAS",Id:152393},
{IATA:"JSK",Id:152394},
{IATA:"KH",Id:152395},
{IATA:"KHK",Id:152396},
{IATA:"LFM",Id:152397},
{IATA:"PAM",Id:152398},
{IATA:"RZR",Id:152399},
{IATA:"SXI",Id:152400},
{IATA:"TEW",Id:152401},
{IATA:"THHR",Id:152402},
{IATA:"YES",Id:152403},
{IATA:"IFM",Id:152404},
{IATA:"SAR",Id:152405},
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
            mode: 'row',
            allowUpdating: true,
            allowAdding: false,
            allowDeleting: true,
        },
        height: $(window).height() - 420,
        selection: {
            mode: 'single',
        },
        onEditorPrepared: function (e) {

          

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
                        date =new Date( date.addDays(1));
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
                editorOptions: { type: "time",},
                format: "HHmm",
                alignment: 'center',
                //sortIndex: 2,
               // calculateSortValue: function (e) { return Number(moment(new Date(e.STDLocal)).format('YYYYMMDDHHmm')); },
                //sortOrder: 'asc',
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
        
        bindingOptions: {
            'dataSource': 'tbl_ds'
        },
    };
	
	
	
	  $scope.btn_pax_add = {
        //text: 'Search',
        type: 'default',
        icon: 'add',
        width: 40,
       // validationGroup: 'tbladd',
        bindingOptions: {},
        onClick: function (e) {
           // var result = e.validationGroup.validate();

           // if (!result.isValid) {
           //     General.ShowNotify(Config.Text_FillRequired, 'error');
           //     return;
           // }
            // moment(date).format('YY-MM-DD HHmm') 
            

            var rec = {
                 
                Id: -1 * ($scope.ds_pax.length+1),
            };
            
            $scope.ds_pax.push(rec);
            
            $scope.dg_pax_instance.refresh();


        }

    };
	
	$scope.ds_pax=[] ;
	$scope.dg_pax_instance = null;
    $scope.dg_pax = {
        onContentReady: function (e) {
            if (!$scope.dg_pax_instance)
                $scope.dg_pax_instance = e.component;

        },
        keyExpr: "Id",
        showBorders: true,
        filterRow: {
            visible: false,
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
			popup:{
				
				height:200,
				width:400,
			}
        },
        height: $(window).height() - 500,
        selection: {
            mode: 'single',
        },
        onEditorPrepared: function (e) {

            

        },
        onSelectionChanged(data) {
            //$scope.selectedItemKeys = data.selectedRowKeys;
           // $scope.disabled = !$scope.selectedItemKeys.length;
        },

        onRowUpdating: function (e) {
            
        },
        onRowUpdated: function (e) {
            

        },
        onRowRemoved: function (e) {
            

        },
        onRowInserting: function (e) {
            console.log('inserting....');
        },
		onRowInserted:function(e){
			console.log(e);
			var _ds=$scope.dg_pax_instance.getDataSource();
			console.log(_ds);
		},
        onInitNewRow: function (e) {
            
        },
        columns: [
            
            {
                alignment: 'center',
                dataField: 'AirportId',
                caption: 'Apt.',
                width: 120,
                lookup: {
                    dataSource: $scope.tbl_apts,
                    displayExpr: 'IATA',
                    valueExpr: 'Id',
                },
                validationRules: [{ type: 'required' }],

            },
            
            
             
			 
			 {caption:'RES',columns:[
			     {
                     caption: 'ADL',
                    dataField: 'RES_Adult',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'CHD',
                    dataField: 'RES_Child',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'INF',
                    dataField: 'RES_Infant',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
			 ]},
			 
			 
			 
			  {caption:'STN',columns:[
			     {
                     caption: 'ADL',
                    dataField: 'STN_Adult',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'CHD',
                    dataField: 'STN_Child',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'INF',
                    dataField: 'STN_Infant',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
			 ]},
			 
			 {caption:'CHR',columns:[
			     {
                     caption: 'ADL',
                    dataField: 'CHR_Adult',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'CHD',
                    dataField: 'CHR_Child',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
				{
                     caption: 'INF',
                    dataField: 'CHR_Infant',
                     dataType: 'number',
                     
                     alignment: 'center',
                 
                    //width: 100,
                   
                },
			 ]},
			 
			 
			 
        ],
        onRowPrepared: function (e) {

 

        },
         //'dataSource': $scope.ds_pax,
        bindingOptions: {
            'dataSource': 'ds_pax'
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
                STDDay:new Date( General.getDayFirstHour(new Date($scope._new_std))),
                RegisterID: $scope._new_reg,
                FromAirport: $scope._new_from,
                FlightNumber: $scope._new_fltno,
                ToAirport: $scope._new_to,
                STDLocal: $scope._new_std,
                STALocal: $scope._new_sta,
                Updated: 1,
                ID: -1 * ($scope.tbl_ds.length+1),
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
                        console.log('save',$scope.tbl_ds);
                        var recs = Enumerable.From($scope.tbl_ds).Where('$.Updated==1').ToArray();
                        //moment(date).format('YY-MM-DD HHmm') 
                        $.each(recs, function (_i, _d) {
							
								var _xstd=new Date( _d.STDLocal);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _d.FromAirportIATA)!=-1 || [152340,132316,152352,133405,150903,132636, 152384, 152370, 152391,135749,152349,152356].indexOf( _d.FromAirport)!=-1)
					_xstd=new Date(_xstd.addMinutes(30));
               if (['DYU','FEG','NMA','TAS'].indexOf( _d.FromAirportIATA)!=-1 || [146698,152383, 152390, 152357].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-90));
							 if (['FRU'].indexOf( _d.FromAirportIATA)!=-1 || [152379].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-150));
							if (['PNQ'].indexOf( _d.FromAirportIATA)!=-1 || [102338].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-120));
			  if (['TBS','BUS', 'EVN'].indexOf( _d.FromAirportIATA)!=-1 || [152366,152362, 141866].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-30));
				
										
				var _xsta=new Date(_d.STALocal);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ','BGW','JED','RUH'].indexOf( _d.ToAirportIATA)!=-1 || [152340,132316,152352,13340,150903,132636, 152384, 152370, 152391,135749,152349,152356].indexOf( _d.ToAirport)!=-1)
					_xsta=new Date(_xsta.addMinutes(30));
				if (['DYU','FEG','NMA','TAS'].indexOf( _d.ToAirportIATA)!=-1  || [146698,152383, 152390, 152357].indexOf( _d.ToAirport)!=-1)
					_xsta=new Date(_xsta.addMinutes(-90));
								if (['FRU'].indexOf( _d.ToAirportIATA)!=-1  || [152379].indexOf( _d.ToAirport)!=-1)
					_xsta=new Date(_xsta.addMinutes(-150));
							if (['PNQ'].indexOf( _d.ToAirportIATA)!=-1  || [102338].indexOf( _d.ToAirport)!=-1)
					_xsta=new Date(_xsta.addMinutes(-120));
				if (['TBS','BUS', 'EVN'].indexOf( _d.ToAirportIATA)!=-1 || [152366,152362, 141866].indexOf( _d.ToAirport)!=-1 )
					_xsta=new Date(_xsta.addMinutes(-30));
				
				_d.STDLocal=new Date(_xstd);
				_d.STALocal=new Date(_xsta);
							
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
		console.log('resize',$(window).width());
		console.log('hgt1',$('.gantt-main-container').height());
		 $scope.isMobile = $(window).width() <= 1200;
		 $scope.popup_lognew_full = $(window).width() <= 1200;
        $scope.scroll_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 200 : $(window).height() - 200;
        $scope.dg_crew_lognew_height = !$scope.popup_lognew_full ? $scope.lognew_height - 250 : $(window).height() - 250;

        $scope.refreshHeights();

        if ($(window).width() >= 1200)
            $('.gantt-main-container').height($(window).height() - 145 - $scope.absHeight );
        else
            $('.gantt-main-container').height($(window).height() - 145);
		console.log('hgt2',$('.gantt-main-container').height());
        $scope.$apply(function () {

            $scope.scroll_dep_height = $(window).height() - 195;

        });
		
        //if ($(window).width() > $(window).height()) {
        //    $scope.$apply(function () {
        //        $scope.footerfilter = false;
        //        $scope.IsLandscape = true;

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
	
//// FlightRadar
$scope.btn_flightradar = {
        text: 'View Flight',
        type: 'default',
        icon: 'fas fa-plane',
        width: 160,

        onClick: function (e) {
			//console.log('hello');
			//var airlineCode = "vrh";
			var fltNoTotal = airlineCode + $scope.logFlight.FlightNumber;
			var flightRadarURL = "https://flightradar24.com"
			fetch(apiExternal+'api/flightradar?flightNumber='+fltNoTotal)
			  .then((response) => {
					if (response.ok)
						return response.json();
						})
			  .then((data) => {
						if (data.isLive != 0)
							window.open(flightRadarURL+'/' + fltNoTotal + '/' + data.flightRadarFlightId, '_blank').focus();
						else
							alert('Flight is not live!');
						});
        }
    };



}]);