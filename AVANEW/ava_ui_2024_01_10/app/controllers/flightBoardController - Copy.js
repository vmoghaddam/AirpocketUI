'use strict';
app.controller('flightBoardController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
     
    authService.setModule(3);
    $rootScope.setTheme();
    console.log('Updtae delay remark theme 3');
    $scope.IsPlanning = $rootScope.HasMenuAccess('flight_planning', 3);
    //flight_planning-edit
    $scope.IsJLAccess = $rootScope.HasMenuAccess('flight_board_jl', 3);
    $scope.IsPickup = $rootScope.userName.toLowerCase().startsWith('trans.') || $rootScope.userName.toLowerCase().startsWith('demo');
    $scope.IsCrewMobileVisible = $rootScope.userName.toLowerCase().startsWith('dis.') || $rootScope.userName.toLowerCase().startsWith('demo');
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

    $scope.btn_takeoff = {
        text: 'Take Off',
        type: 'default',
        icon: 'fas fa-plane-departure',
        width: '150',
        bindingOptions: {
            // visible: 'takeOffVisible'
        },
        onClick: function (e) {

            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.takeOffReadOnly = false;
            $scope.flight = $scope.selectedFlights[0];
            $scope.flightTakeOff = $scope.flight.ChocksOut; // $scope.flight.baseStartDate;

            if ((new Date()).getDatePart() == (new Date($scope.flight.STD)).getDatePart())
                $scope.flightTakeOff = new Date();
            //$scope.flight.TakeOff = (new Date(flight.startDate)).addMinutes(20);
            $scope.popup_takeoff_visible = true;




        }

    };
    $scope.btn_information = {
        text: 'Information',
        type: 'default',
        icon: 'fas fa-info-circle',
        width: '100%',
        bindingOptions: {
            //visible:'offBlockVisible'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];

            $scope.popup_inf_visible = true;




        }

    };
    $scope.record = null;
    $scope.btn_dep = {
        text: 'Dep',
        type: 'default',
        icon: 'fas fa-plane-departure',
        width: '100%',
        bindingOptions: {
            // disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];


            $scope.calculateTotalPax();
            $scope.popup_flight_visible = true;




        }

    };
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
    $scope.btn_log = {
        text: 'Log',
        type: 'default',
        icon: 'fas fa-plane-departure',
        width: '100%',
        bindingOptions: {
            // disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {


            $scope.showLog();




        }

    };
    $scope.btn_arr = {
        text: 'Arrival',
        type: 'default',
        icon: 'fas fa-plane-arrival',
        width: '100%',
        bindingOptions: {
            disabled: 'IsArrivalDisabled'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];

            $scope.popup_arr_visible = true;




        }

    };
    $scope.btn_offblock = {
        text: 'Off Block',
        type: 'default',
        icon: 'far fa-square',
        width: '150',
        bindingOptions: {
            //visible:'offBlockVisible'
        },
        onClick: function (e) {

            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            $scope.flightOffBlock = new Date($scope.flight.baseStartDate);
            if ((new Date()).getDatePart() == (new Date($scope.flight.STD)).getDatePart())
                $scope.flightOffBlock = new Date();
            $scope.popup_offblock_visible = true;




        }

    };
    $scope.btn_onblock = {
        text: 'On Block',
        type: 'default',
        icon: 'fas fa-square',
        width: '150',
        bindingOptions: {
            //visible:'offBlockVisible'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            $scope.flightOnBlock = new Date($scope.flight.Landing);
            if ((new Date()).getDatePart() == (new Date($scope.flight.STD)).getDatePart())
                $scope.flightOnBlock = new Date();
            $scope.popup_onblock_visible = true;




        }

    };
    $scope.btn_landing = {
        text: 'Landing',
        type: 'default',
        icon: 'fas fa-plane-arrival',
        width: '150',
        bindingOptions: {
            // visible: 'takeOffVisible'
        },
        onClick: function (e) {

            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            $scope.takeOffReadOnly = true;
            $scope.flightTakeOff = $scope.flight.Takeoff;
            $scope.flightLanding = $scope.flight.baseEndDate;
            if ((new Date()).getDatePart() == (new Date($scope.flight.STA)).getDatePart())
                $scope.flightLanding = new Date();

            $scope.popup_landing_visible = true;




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
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
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
        displayFormat: "HH:mm",
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
    $scope.getRealMSNs = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    //url: $rootScope.serviceUrl + 'odata/aircrafts/customer/'+cid+'?$filter=isvirtual%20eq%20false' ,
                    url: $rootScope.serviceUrl + 'odata/aircrafts/customer/' + cid,
                    version: 4
                }),

            sort: ['AircraftType', 'Register'],
        });
    };
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
        dataSource: $scope.getRealMSNs(Config.CustomerId),
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'linkEntity.RegisterID',

            //dataSource: 'ds_msn',


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
        text: 'N/S Flight',
        type: 'default',
        icon: 'airplane',
        width: 150,

        onClick: function (e) {
            //pipi
            $scope.doIrRoute = true;
            $scope.linkEntity = { ID: -1, CustomerId: Config.CustomerId };
            var _df = General.getDayFirstHour(new Date($scope.selectedDate));
            $scope.time_ir_std_date = new Date(_df);

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
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {



            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];
            //if ($scope.flight.FlightPlanId) {
            //    General.ShowNotify("The selected item cannot be deleted.", 'error');
            //    return;
            //}

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.flight.ID, };
                    $scope.loadingVisible = true;
                    flightService.deleteFlight(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');

                        $scope.BeginSearch();


                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    //sook



    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 110,
        onClick: function (e) {
            console.log($scope.multiSelectedFlights);
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

    $scope.btn_pax = {
        text: 'Pax',
        type: 'default',
        icon: 'fas fa-user-tag',
        width: '100%',
        bindingOptions: {
            disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {
            // alert($scope.$dgrow.length);
            //$($scope.$dgrow).addClass('dx-selection');
            // alert($scope.$dgrow.attr('class'));
            // $scope.dg_flights_instance.selectRows([$scope.flight], true);
            // return;
            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.depReadOnly = false;
            $scope.paxSaved = false;
            $scope.flight = $scope.selectedFlights[0];
            //console.log($scope.flight);
            $scope.calculateTotalPax();

            $scope.popup_pax_visible = true;




        }

    };
    $scope.btn_cargo = {
        text: 'Cargo',
        type: 'default',
        icon: 'fas fa-boxes',
        width: '100%',
        bindingOptions: {
            disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {

            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.depReadOnly = false;
            $scope.flight = $scope.selectedFlights[0];
            $scope.cargoSaved = false;

            $scope.popup_cargo_visible = true;




        }

    };
    $scope.fuelDepSaved = false;
    $scope.fuelArrSaved = false;
    $scope.$dgrow = null;
    $scope.btn_fueldep = {
        text: 'Fuel(D)',
        type: 'default',
        icon: 'fas fa-burn',
        width: '100%',
        bindingOptions: {
            disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {


            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.depReadOnly = false;
            $scope.flight = $scope.selectedFlights[0];
            $scope.fuelDepSaved = false;
            $scope.$dgrow = $('#dg_flights').find('.dx-row.dx-selection');
            $scope.popup_fueldep_visible = true;




        }

    };
    $scope.fuelArrSaved = false;
    $scope.btn_fuelarr = {
        text: 'Fuel(A)',
        type: 'default',
        icon: 'fas fa-burn',
        width: '100%',
        bindingOptions: {
            disabled: 'IsArrivalDisabled'
        },
        onClick: function (e) {

            // console.log($scope.selectedFlights);
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            //console.log($scope.flight);
            $scope.fuelArrSaved = false;

            $scope.popup_fuelarr_visible = true;




        }

    };

    $scope.IsCancelVisible = false;
    $scope.btn_cancel = {
        text: 'Cancel',
        type: 'danger',
        icon: 'fas fa-ban',
        width: '150',
        bindingOptions: {
            //visible:'IsCancelVisible'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            //$scope.flightOnBlock = new Date($scope.flight.Landing);
            //if ((new Date()).getDatePart() == (new Date($scope.flight.STD)).getDatePart())
            //    $scope.flightOnBlock = new Date();
            $scope.entity_cancel.CancelDate = new Date(Date.now());
            $scope.popup_cancel_visible = true;




        }

    };


    $scope.IsRedirectVisible = false;
    $scope.btn_redirect = {
        text: 'Redirect',
        type: 'danger',
        icon: 'fas fa-random',
        width: '150',
        bindingOptions: {
            //visible:'IsCancelVisible'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            //$scope.flightOnBlock = new Date($scope.flight.Landing);
            //if ((new Date()).getDatePart() == (new Date($scope.flight.STD)).getDatePart())
            //    $scope.flightOnBlock = new Date();
            $scope.entity_redirect.RedirectDate = new Date(Date.now());
            $scope.popup_redirect_visible = true;




        }

    };


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
                $scope.BeginSearch();
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
        }
    };

    $scope.sms_nira_sf = false;
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


    $scope.bindFlights = function (saveState) {
        $scope.doUtcEnabled = true;
        var xs = 0;
        if (saveState) {
            try {
                xs = ($('.e-ganttviewerbodyContianer').data("ejScroller").scrollLeft());
            }
            catch (ex) {
                //exc
                alert(ex);
            }
        }
        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo,


        };
        $scope.hideButtons2();
        $scope.selectedFlights = [];
        $scope.dg_flights_instance.deselectAll();

        //xati
        $scope.selectedTabDateIndex = -1;


        $scope.loadingVisible = true;
        var ed = (new Date($scope.dateEnd)).toUTCDateTimeDigits(); //(new Date($scope.dateto)).toUTCDateTimeDigits();
        flightService.getFlightsGantt2(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, offset, /*($scope.IsAdmin ? null : $scope.airportEntity.Id)*/-1, ($scope.doUTC ? 1 : 0), filter).then(function (response) {
            try {
                $scope.tabsdatefirst = true;
                $scope.tabs_date = [];
                var i;
                var stdate = new Date($scope._datefrom);
                for (i = 1; i <= $scope.days_count; i++) {
                    var str = moment(stdate).format("ddd DD-MMM-YYYY");
                    $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                    stdate = stdate.addDays(1);

                }
                $scope.tabsdatevisible = true;
                ////////////////////////////////////////
                //took
                $scope.loadingVisible = false;
                $scope.baseDate = (new Date(Date.now())).toUTCString();
                $scope.ganttData = response;
                $scope.baseSum = $scope.ganttData.baseSummary;
                $scope.resourceGroups = response.resourceGroups;
                $scope.resources = response.resources;
                //  console.log('===========');
                //  console.log($scope.ganttData);
                //cool
                $scope.dataSource = Flight.proccessDataSource(response.flights);

                // console.log($scope.dataSource);
                Flight.activeDatasource = $scope.dataSource;
                $scope.dg_flights_ds = $scope.dataSource;
                $scope.calculateSummary();



                $scope.selectedTabDateIndex = 0;


                //sepehr
                //$scope.createGantt();

                //if (saveState) {
                //    $scope.scrollGanttX(xs);
                //}
                //else
                //boosi
                //    $scope.scrollGanttNow();
                //$scope.footerfilter = true;
                //$scope.searched = true;

                //if ($scope.autoUpdate)
                //    $scope.StartUTimer();

                if (!$scope.activatedStbys) {
                    $scope.activatedStbys = [];
                    var dt = new Date($scope.tabs_date[0].date);
                    var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
                    var df = new Date($scope.tabs_date[$scope.tabs_date.length - 1].date);
                    var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
                    flightService.getActivatedStbys(_dt, _df).then(function (response) {
                        console.log('getActivatedStbys');
                        console.log(response);

                        $.each(response, function (_g, _as) {
                            _as.PositionId = $scope.getDefaultPositionId(_as.JobGroup);
                            $scope.activatedStbys.push(_as);
                        });
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }




            }
            catch (ex) {
                alert(ex);
            }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.baseDate = null;
    $scope.search = function () {
        $scope.updatedFlightsCount = 0;
        $scope.updatedFlights = [];
        $scope.bindFlights(false);
    };
    //$scope.btn_search = {
    //    text: '',
    //    type: 'success',
    //    icon: 'search',
    //    width: '35',

    //    bindingOptions: {},
    //    onClick: function (e) {

    //        $scope.search();

    //    }

    //};
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



    $scope.utimer = null;
    //shash
    $scope.StartUTimer = function () {
        // return;
        //tooki
        console.log('UTimer Started');
        $scope.utimer = setTimeout(function () {
            //'info' | 'warning' | 'error' | 'success' | 'custom'

            //////////////////////////
            var dto = {
                from: (new Date($scope.datefrom)).toUTCString(),
                to: (new Date($scope.dateto)).toUTCString(),
                baseDate: $scope.baseDate,
                airport: $scope.airportEntity ? $scope.airportEntity.Id : -1,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                userid: $rootScope.userId ? $rootScope.userId : -1,

            };

            flightService.getUpdatedFlights(dto).then(function (response) {

                $scope.baseDate = (new Date(Date.now())).toUTCString();
                var ganttObj = $("#resourceGanttba").data("ejGantt");
                $.each(response.flights, function (_i, _d) {
                    var data = Enumerable.From($scope.dataSource).Where("$.ID==" + _d.ID).FirstOrDefault();
                    if (data) {
                        //u bani

                        $scope.doActionCompleteSave = false;
                        $scope.fillFlight(data, _d);
                        Flight.processDataOffBlock(data);
                        $scope.addUpdatedFlights(data);
                        //ganttObj.updateRecordByTaskId(data);
                        ganttObj.reRenderChart();


                        if ($scope.flight)
                            $('.task-' + $scope.flight.ID).parent().addClass('e-gantt-taskbarSelection');

                        $scope.calculateSummary();




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
            console.log('StartUTimer' + '    ' + (new Date()));
        }, 1000 * 60);
    };
    $scope.StopUTimer = function () {
        if ($scope.utimer)
            clearTimeout($scope.utimer);
        console.log('UTimer Stopped');
    };

    //////////////////////////////////////
    $scope.nowlinetimer = null;
    $scope.nowlinelastdate = new Date();
    $scope.IsUTC = false;
    //ati new

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
    $scope.StartNowLineTimerFirst = true;
    $scope.StartNowLineTimerFirstTime = null;
    $scope.nowlineInitLeft = null;
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
    $scope.StartNowLineTimer = function (interval) {
        //boosi

        $scope.nowlinetimer = setTimeout(function () {

            if ($scope.StartNowLineTimerFirst) {
                // alert('x');
                $scope.StartNowLineTimerFirst = false;
                $scope.StartNowLineTimerFirstTime = (new Date()).getTime();
                if ($scope.doUTC) {
                    $scope.StartNowLineTimerFirstTime = (new Date()).addMinutes(-1 * _boffset).getTime();
                    // console.log($scope.StartNowLineTimerFirstTime);

                }
                // var dtstr = (new Date($scope.datefrom)).yyyymmddtimenow($scope.IsUTC);
                var _ndate = new Date();
                var dtstr = (new Date(_ndate)).yyyymmddtimenow($scope.IsUTC);

                if ($scope.doUTC) {
                    _ndate = _ndate.addMinutes(-1 * _boffset);
                    // alert(_ndate);
                    //dtstr = (new Date(_ndate)).yyyymmddtimenow(1);
                    dtstr = yyyymmddtimenow2(_ndate);

                }


                var ganttObj = $("#resourceGanttba").data("ejGantt");

                ganttObj.setModel2({
                    "stripLines": [{ day: dtstr, lineWidth: "2", lineColor: "#ff0066", lineStyle: "solid" }


                    ]
                }, null, function () {

                });


                $('#stripline0').height($('#ganttviewerbodyContianerejGanttChartresourceGanttba').height());

            }
            else {

                $('#stripline0').height($('#ganttviewerbodyContianerejGanttChartresourceGanttba').height());

                if (!$scope.nowlineInitLeft)
                    $scope.nowlineInitLeft = $('#stripline0').position().left;

                if ($scope.nowlineInitLeft) {
                    //var nlp = $('#stripline0').position();
                    var nt = (new Date()).getTime();
                    if ($scope.doUTC) {
                        //_boffset
                        nt = (new Date()).addMinutes(-1 * _boffset).getTime();
                    }
                    var elapsed = (nt - $scope.StartNowLineTimerFirstTime) / 1000;
                    $scope.StartNowLineTimerFirstTime = nt;
                    var dl = $scope.timeCellWidth * /*interval*/(elapsed) * 1.0 / 3600.0;

                    $scope.nowlineInitLeft = Number($scope.nowlineInitLeft + dl);

                    $('#stripline0').css({ left: $scope.nowlineInitLeft });
                    // console.log($scope.nowlineInitLeft + '   ' + dl + '     ' + $('#stripline0').position().left);

                }

            }

            /////////////////////////////
            $scope.nowlinelastdate = (new Date());
            if ($scope.doUTC) {
                $scope.nowlinelastdate = (new Date()).addMinutes(-1 * _boffset);

            }
            var nowtime = $('#stripline0');


            var html = "<div style='font-size:11px;font-weight:bold;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow(true) + "</div>";
            //+ "<div style='font-size:11px;font-weight:bold;padding-left:2px;position:absolute;bottom:50px'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;position:absolute;bottom:30px'>" + $scope.nowlinelastdate.hhmmnow(true) + "</div>";
            if ($scope.doUTC) {
                var html = "<div style='font-size:11px;font-weight:bold;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;'>" + ($scope.nowlinelastdate.addMinutes(_boffset)).hhmmnow() + "</div>";
            }


            if ($scope.IsUTC)
                html = "<div style='font-size:11px;font-weight:bold;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow(true) + "</div>";



            nowtime.html(html);
            // console.log((new Date()).hhmmnow());
            ////////////////////////////
            $scope.renderTopTimeHeader();
            $scope.renderTimeHeader();
            ////////////////////////////
            $scope.StartNowLineTimer(10);

        }, 1000 * interval);
    };
    $scope.StopNowLineTimer = function () {
        if ($scope.nowlinetimer)
            clearTimeout($scope.nowlinetimer);
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
    $scope.selectedTabDateIndex = -1;
    $scope.tabsdatefirst = true;
    $scope.$watch("selectedTabDateIndex", function (newValue) {

        //try 
        {
            
            if ($scope.selectedTabDateIndex == -1)
                return;
            $scope.selectedTab = $scope.tabs_date[newValue];

            $scope.selectedDate = new Date($scope.selectedTab.date);

            $scope.StopNowLineTimer();
            $scope.createGantt();
            $scope.getBoardSummary($scope.selectedDate);

            $scope.footerfilter = true;
            $scope.searched = true;
            
            $scope.StopUTimer();
            if ($scope.autoUpdate)
                $scope.StartUTimer();


        }
        //catch (e) {
        //    alert('y');
        //    alert(e);
        //}

    });
    $scope.tabs_date = [


    ];
    // $scope.selectedTabDateIndex = 0;
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
            console.log(response2);
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


                    console.log($scope.STBYFDPStat);
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
                        //u bani

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
    $scope.btn_swap = {
        text: '',
        type: 'default',
        icon: 'fas fa-exchange-alt',
        width: '40',

        bindingOptions: {},
        onClick: function (e) {
            $scope.createGantt();
            return;
            if ($scope.ganttview) {
                $scope.ganttview = false;
                $('#dg_flights_c').css('top', '0px');
                $('#gantt_container_ba').css('top', '10000px');
                //$scope.gridview = true;
                // $scope.dg_flights_instance.repaint();
            }
            else {
                $scope.ganttview = true;
                $('#dg_flights_c').css('top', '10000px');
                $('#gantt_container_ba').css('top', '0px');
                // $scope.gridview = false;
                //$scope.dg_flights_instance.refresh();
                //$scope.dg_flights_instance.repaint();
            }
        }

    };

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
                        // $scope.doRefresh = true;
                        // $scope.bindlegs();
                        $scope.BeginSearch();


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
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {



            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];

            if ($scope.flight.FlightPlanId) {

                $scope.selectedPlanItemId = $scope.flight.FlightPlanId;
                var offset = -1 * (new Date()).getTimezoneOffset();
                var flight = $scope.selectedFlights[0];

                //$scope.bindEntity($scope.dg_selected);
                $scope.loadingVisible = true;
                flightService.getFlightPlanItem(flight.FlightPlanId, offset).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.IsNew = false;
                    $scope.tempData = response;
                    console.log('flightService.getFlightPlanItem');
                    console.log(response);
                    $scope.doRefresh = false;
                    $scope.doGetPlanItems = false;

                    $scope.popup_planitem_visible = true;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                //General.ShowNotify("The selected item cannot be deleted.", 'error');
                return;
            }
            else {
                $scope.linkEntity = { ID: $scope.flight.ID, CustomerId: Config.CustomerId };
                //var _df = General.getDayFirstHour(new Date($scope.selectedDate));
                //$scope.time_ir_std_date = new Date(_df);
                $scope.doIrRoute = false;
                $scope.linkEntity.RegisterID = $scope.flight.RegisterID;
                $scope.linkEntity.FlightNumber = $scope.flight.FlightNumber;
                $scope.linkEntity.FromAirportId = $scope.flight.FromAirport;
                $scope.linkEntity.ToAirportId = $scope.flight.ToAirport;
                $scope.linkEntity.FlightH = $scope.flight.FlightH;
                $scope.linkEntity.FlightM = $scope.flight.FlightM;
                $scope.linkEntity.FlightTypeID = $scope.flight.FlightTypeID;
                $scope.time_ir_std_date = new Date($scope.flight.STD);
                $scope.time_ir_std_time = new Date($scope.flight.STD);
                $scope.time_ir_sta_date = new Date($scope.flight.STD);
                $scope.time_ir_sta_time = new Date($scope.flight.STA);
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
            console.log('plan    %%%%%%%%%%%%%%%%%%%%%%%%%%%55');
            console.log(flight);
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
            if ($scope.doRefresh)
                $scope.BeginSearch();

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
    $scope.popup_planitem = {
        width: 650,
        height: 400,
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




                        $scope.planEntity.FlightId = $scope.flight.ID;

                        $scope.loadingVisible = true;
                        flightService.updatePlanItemFlight($scope.planEntity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            $scope.sms_nira_sf=false;
                            ////////////////
                            $scope.refreshPlanEntity();

                            $scope.isBaseDisabled = true;
                            $scope.planEntity.STD = (new Date($scope.planEntity.STA)).addMinutes(60);
                            $scope.start = $scope.planEntity.STD;
                            $scope.planEntity.STA = null;
                            $scope.planEntity.FromAirport = $scope.planEntity.ToAirport;
                            $scope.planEntity.ToAirport = null;
                            //jook
                            response.STD = (new Date(response.STD)).addMinutes(offset);
                            response.STA = (new Date(response.STA)).addMinutes(offset);
                            // $scope.plan_dg2_ds.push(response);
                            // $scope.plan_dg2_instance.refresh();

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
            //sook
            if ($scope.tempData)
                $scope.bindPlanEntity2($scope.tempData);
        },
        onHidden: function () {
            $scope.clearPlanEntity();
            $scope.sms_nira_sf = false;
            //$scope.plan_dg2_ds = [];
            //$scope.plan_dg2_instance.refresh();
            $scope.popup_planitem_visible = false;
            if ($scope.doRefresh)
                $scope.BeginSearch();

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
            if ($scope.doRefresh)
                $scope.BeginSearch();

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
        $scope.planEntity.SMSNira =null;
         


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

        $scope.planEntity.FlightNumber = $scope.flight.FlightNumber;

        $scope.planEntity.FromAirport = $scope.flight.FromAirport;

        $scope.planEntity.ToAirport = $scope.flight.ToAirport;

        $scope.planEntity.STA = $scope.flight.STA;

        $scope.planEntity.STD = $scope.flight.STD;

        $scope.planEntity.FlightH = $scope.flight.FlightH;

        $scope.planEntity.FlightM = $scope.flight.FlightM;

        $scope.planEntity.FlightStatus = data.FlightStatus;


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
       // displayFormat: "HH:mm",
        //pickerType: 'rollers',
        interval: 15,
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
    $scope.BeginSearch = function () {
        $scope.datefrom = General.getDayFirstHour(new Date($scope._datefrom));
        $scope.dateEnd = General.getDayLastHour(new Date(new Date($scope._datefrom).addDays($scope.days_count - 1)));
        $scope.dateto = General.getDayLastHour(new Date($scope._datefrom)); //General.getDayLastHour( (new Date(Date.now())) );
        $scope.StopNowLineTimer();
        $scope.search();
    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'flightboarddate',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.StopUTimer();
            $scope.activatedStbys = null;
            $scope.BeginSearch();

        }

    };



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
                    if (co.JobGroup == "TRE" || co.JobGroup == "TRI" || co.JobGroup == "LTC")
                        //co.Position = co.JobGroup;
                        co.Position = 'IP';
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
                $scope.cl.crews = Enumerable.From(response.crew).OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                $.each($scope.cl.crews, function (_i, _d) {
                    if (_d.Position == "Captain")
                        _d.Position = "CPT";
                    if (_d.Position == "Purser")
                        _d.Position = "SCCM";
                    if (_d.Position == "FA")
                        _d.Position = "CCM";
                    if (_d.JobGroup == "ISCCM")
                        _d.Position = "ISCCM";
                    if (_d.JobGroup == "TRE" || _d.JobGroup == "TRI" || _d.JobGroup == "LTC")
                        _d.Position = "IP";// _d.JobGroup;
                    if (_d.IsPositioning)
                        _d.Position = 'DH';

                });

                if ($scope.cl.crews.length < 18)
                    for (var i = $scope.cl.crews.length; i < 18; i++) {
                        $scope.cl.crews.push({ Position: ' ', Name: ' ' });
                    }




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
    $scope.days_count = 2;
    $scope.num_days = {
        min: 1,
        showSpinButtons: false,
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
    //new Date(2019, 4, 19, 0, 0, 0);
    //$scope.datefrom = General.getDayFirstHour(new Date(Date.now() /*'2019-02-20'*/));
    //$scope.dateto = General.getDayLastHour(new Date(new Date(Date.now()).addDays(1))); //General.getDayLastHour( (new Date(Date.now())) );





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
    $scope.txt_wdh = {
        readOnly: false,
        bindingOptions: {
            value: 'flight.NightTime'
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
        //dool
        if (!$scope.convertUTCEnabled) {
            $scope.convertUTCEnabled = true;
            return;
        }
        
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
        //dool
        
        if (!$scope.convertUTCEnabled) {
            $scope.convertUTCEnabled = true;
            return;
        }
          
        var offset = -1 * (new Date()).getTimezoneOffset();

        //(new Date(_d.STA)).addMinutes(offset);
        $scope.flight.STA2 = (new Date($scope.flight.STA)).addMinutes(offset);
        $scope.flight.STD2 = (new Date($scope.flight.STD)).addMinutes(offset);
        $scope.flight.STA2 = (new Date($scope.flight.STA)) ;
        $scope.flight.STD2 = (new Date($scope.flight.STD)) ;


        $scope.flightOffBlock2 = (new Date($scope.flightOffBlock2)).addMinutes(offset);
        $scope.flightTakeOff2 = (new Date($scope.flightTakeOff2)).addMinutes(offset);
        $scope.flightLanding2 = (new Date($scope.flightLanding2)).addMinutes(offset);
        $scope.flightOnBlock2 = (new Date($scope.flightOnBlock2)).addMinutes(offset);

        $scope.time_status_value = (new Date($scope.time_status_value)).addMinutes(offset);
    };
    $scope.otimes = null;
    $scope.timeBase = 'LCB';
    $scope.timeBaseReadOnly = false;
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
            //visible:'!doUTC',
            readOnly: 'timeBaseReadOnly'
        }
    };
    $scope.remark_status_height = 80;
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
            height: '40',
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
            console.log($scope.dg_delay_ds);
            console.log($scope.dg_delay_selected.Id);

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

            $scope.remark_status_height = 54;
            $scope.isTimeStatusVisible = false;
            $scope.isCancelReasonVisible = false;
            // $scope.isRampReasonVisible = false;
            // $scope.isRedirectReasonVisible = false;
            if (e.selectedItem.id == 4) {
                $scope.isCancelReasonVisible = true;
                $scope.remark_status_height = 54;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.flight.CancelDate ? new Date($scope.flight.CancelDate) : null;
            }
            //ramp
            if (e.selectedItem.id == 9) {
                // $scope.isRampReasonVisible = true;
                $scope.remark_status_height = 54;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.flight.RampDate ? new Date($scope.flight.RampDate) : null;
            }
            //redirect
            if (e.selectedItem.id == 17) {
                // $scope.isRedirectReasonVisible = true;
                $scope.remark_status_height = 30;
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
            value: 'flight.FlightTypeID',
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
        showClearButton: true,
        searchEnabled: true,
        // dataSource: $rootScope.getDatasourceOption(110),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'dsMassUnit',
            value: 'flight.CargoUnitID',
            readOnly: 'depReadOnly'
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
            value: 'flight.FuelUnitID',
            text: 'flight.FuelUnit',
            readOnly: 'depReadOnly'
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
            value: 'flight.UsedFuel',

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
    $scope.popup_inf_visible = false;
    $scope.popup_inf_title = 'Flight Information';
    $scope.popup_inf = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_inf"
        },
        shading: false,
        position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 450,
        height: function () { return $(window).height() * 0.95 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {
            $scope.setWeather();

        },
        onShown: function (e) {

        },
        onHiding: function () {


            $scope.popup_inf_visible = false;

        },
        bindingOptions: {
            visible: 'popup_inf_visible',

            title: 'popup_inf_title',

        }
    };

    //close button
    $scope.popup_inf.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_inf_visible = false;

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




    $scope.popup_arr_visible = false;
    $scope.popup_arr_title = 'Arrival';
    $scope.popup_arr = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_arr"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1200,
        //height: function () { return $(window).height() * 0.95 },
        height: 647,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacarr', bindingOptions: { disabled: 'IsApproved' }, visible: false, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //Config.Text_Landing

                        if (new Date($scope.flightLanding2) < new Date($scope.flight.STA)) {
                            General.ShowNotify(Config.Text_Landing, 'error');
                            return;
                        }
                        if ($scope.flightOnBlock2 && new Date($scope.flightOnBlock2) < new Date($scope.flightLanding2)) {
                            General.ShowNotify(Config.Text_OnBlock, 'error');
                            return;
                        }

                        var dto = {
                            StatusLog: [],
                        };

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        $scope.flight.Landing = $scope.flightLanding2;
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 3,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });
                        // $scope.flight.ChocksOut = $scope.flightOffBlock2;


                        if ($scope.flightOnBlock2) {
                            $scope.flight.ChocksIn = $scope.flightOnBlock2;
                            Flight.calculateDelayLandingOnBlock($scope.flight);
                            $scope.setStatus($scope.flight, 15);
                        }
                        else
                            $scope.setStatus($scope.flight, 3);

                        $scope.fillDto(dto);
                        $scope.fillArrival(dto);




                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //console.log('arr edited flight');
                        //console.log($scope.flight);
                        //$scope.showButtons2($scope.flight);
                        //$scope.popup_flight_visible = false;

                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightArr(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);

                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_arr_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

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
            $scope.flightOnBlock2 = $scope.flight.ChocksIn;

            $scope.flightLanding2 = $scope.flight.Landing;
            $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            $scope.flightTakeOff2 = $scope.flight.Takeoff;
            $scope.depReadOnly = true;
            $scope.selectedTabIndex2 = 0;
            $scope.setWeather();

        },
        onShown: function (e) {
            if (!$scope.flight.delays) {
                $scope.loadingVisible = true;
                flightService.getFlightDelayCodes($scope.flight.ID).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.flight.delays = response;
                    $scope.dg2_ds = response;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                $scope.dg2_ds = $scope.flight.delays;
        },
        onHiding: function () {

            $scope.selectedTabIndex2 = -1;
            $scope.popup_arr_visible = false;

        },
        bindingOptions: {
            visible: 'popup_arr_visible',

            title: 'popup_arr_title',

        }
    };

    //close button
    $scope.popup_arr.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_arr_visible = false;

    };
    ///////////////////////////////
    $scope.popup_fueldep_visible = false;
    $scope.popup_fueldep_title = 'Departure Fuel';

    $scope.fuelDepInit = {};
    $scope.popup_fueldep = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fueldep"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 400,
        //height: function () { return $(window).height() * 0.95 },
        height: 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacfueldep', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //entity.ID = $scope.flight.ID;

                        var dto = {
                            ID: $scope.flight.ID,
                            FuelDeparture: $scope.flight.FuelDeparture,
                            FuelUnitID: $scope.flight.FuelUnitID,

                        };


                        $scope.loadingVisible = true;
                        flightService.saveFlightFuelDeparture(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.fuelDepSaved = true;

                            $scope.loadingVisible = false;

                            $scope.popup_fueldep_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);


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

            $scope.fuelDepInit.FuelUnitID = $scope.flight.FuelUnitID;
            $scope.fuelDepInit.FuelDeparture = $scope.flight.FuelDeparture;





        },
        onShown: function (e) {

        },
        onHiding: function () {
            if (!$scope.fuelDepSaved) {

                $scope.flight.FuelDeparture = $scope.fuelDepInit.FuelDeparture;
                $scope.flight.FuelUnitID = $scope.fuelDepInit.FuelUnitID;

            }
            //$($scope.$dgrow).addClass('dx-selection');
            $scope.popup_fueldep_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fueldep_visible',

            title: 'popup_fueldep_title',

        }
    };

    //close button
    $scope.popup_fueldep.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_fueldep_visible = false;

    };
    /////////////////////////////////
    $scope.popup_fuelarr_visible = false;
    $scope.popup_fuelarr_title = 'Arrival Fuel';

    $scope.fuelArrInit = {};
    $scope.popup_fuelarr = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fuelarr"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 400,
        //height: function () { return $(window).height() * 0.95 },
        height: 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacfuelarr', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //entity.ID = $scope.flight.ID;

                        var dto = {
                            ID: $scope.flight.ID,
                            FuelArrival: $scope.flight.FuelArrival,


                        };


                        $scope.loadingVisible = true;
                        flightService.saveFlightFuelArrival(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.fuelArrSaved = true;

                            $scope.loadingVisible = false;

                            $scope.popup_fuelarr_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);

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


            $scope.fuelArrInit.FuelArrival = $scope.flight.FuelArrival;





        },
        onShown: function (e) {

        },
        onHiding: function () {
            if (!$scope.fuelArrSaved) {

                $scope.flight.FuelArrival = $scope.fuelArrInit.FuelArrival;


            }

            $scope.popup_fuelarr_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fuelarr_visible',

            title: 'popup_fuelarr_title',

        }
    };

    //close button
    $scope.popup_fuelarr.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_fuelarr_visible = false;

    };

    ///////////////////////////////
    $scope.popup_pax_visible = false;
    $scope.popup_pax_title = 'Pax';
    $scope.paxSaved = false;
    $scope.paxInit = {};
    $scope.popup_pax = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_pax"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 400,
        //height: function () { return $(window).height() * 0.95 },
        height: 290,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacpax', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //entity.ID = $scope.flight.ID;

                        var dto = {
                            ID: $scope.flight.ID,
                            PaxAdult: $scope.flight.PaxAdult,
                            PaxChild: $scope.flight.PaxChild,
                            PaxInfant: $scope.flight.PaxInfant,
                        };


                        $scope.loadingVisible = true;
                        flightService.saveFlightPax(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.paxSaved = true;

                            $scope.loadingVisible = false;

                            $scope.popup_pax_visible = false;

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

            $scope.paxInit.PaxAdult = $scope.flight.PaxAdult;
            $scope.paxInit.PaxChild = $scope.flight.PaxChild;
            $scope.paxInit.PaxInfant = $scope.flight.PaxInfant;




        },
        onShown: function (e) {

        },
        onHiding: function () {
            if (!$scope.paxSaved) {
                $scope.flight.PaxAdult = $scope.paxInit.PaxAdult;
                $scope.flight.PaxChild = $scope.paxInit.PaxChild;
                $scope.flight.PaxInfant = $scope.paxInit.PaxInfant;
                $scope.calculateTotalPax();

            }

            $scope.popup_pax_visible = false;

        },
        bindingOptions: {
            visible: 'popup_pax_visible',

            title: 'popup_pax_title',

        }
    };

    //close button
    $scope.popup_pax.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_pax_visible = false;

    };
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
                            $scope.BeginSearch();
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
    $scope.popup_free_visible = false;
    $scope.popup_free_title = 'Nonscheduled Flight';
    $scope.freeSaved = false;
    $scope.popup_free = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_free"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 350,
        width: 750,
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
                        _flight.SMSNira = $scope.sms_nira_nsf ? 1 : 0;
                        _flight.UserName = $rootScope.userName;
                        //doog
                        // _flight.LinkedReason = 1133;
                        //_flight.BoxId = $scope.flight.BoxId;
                        //if (!$scope.useCrew)
                        //  _flight.BoxId = -1;
                        //kook
                        $scope.loadingVisible = true;
                        flightService.saveFlight(_flight).then(function (response) {

                            //$scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.sms_nira_nsf = false;
                            $scope.linkEntity.FlightNumber = null;
                            $scope.linkEntity.FromAirportId = $scope.linkEntity.ToAirportId;
                            $scope.linkEntity.ToAirportId = null;
                            $scope.linkEntity.FlightH = null;
                            $scope.linkEntity.FlightM = null;
                            //var _df = General.getDayFirstHour(new Date($scope.selectedDate));
                            $scope.time_ir_std_date = General.getDayFirstHour(new Date($scope.time_ir_sta_date));
                            $scope.time_ir_std_time = (new Date($scope.time_ir_sta_time)).addMinutes(60);
                            $scope.time_ir_sta_date = null;
                            $scope.time_ir_sta_time = null;
                            $scope.loadingVisible = false;
                            $scope.freeSaved = true;
                            if ($scope.linkEntity.ID != -1)
                                $scope.popup_free_visible = false;
                            //$scope.popup_free_visible = false;
                            // $scope.BeginSearch();
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

            if ($scope.freeSaved)
                $scope.BeginSearch();
            $scope.freeSaved = false;
            $scope.sms_nira_nsf = false;
            $scope.linkEntity.ToAirportId = null;
            $scope.linkEntity.FromAirportId = null;
            $scope.time_ir_std_date = null;
            $scope.time_ir_std_time = null;
            $scope.time_ir_sta_date = null;
            $scope.time_ir_sta_time = null;
            $scope.linkEntity = null;
            $scope.popup_free_visible = false;

        },
        bindingOptions: {
            visible: 'popup_free_visible',

            title: 'popup_free_title',

        }
    };

    //close button
    $scope.popup_free.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_free_visible = false;

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
               { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width:100, },

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
            console.log('STBY STAT');
            console.log(response);
            if (response.maxFDPError) {
                General.ShowNotify('ERROR MAX FDP DUE TO STBY REDUCTION', 'error');
                return;
            }
            if (response.durationError) {
                General.ShowNotify('ERROR TOTAL DURATION 18 HOURS', 'error');
                return;
            }
            //int crewId = Convert.ToInt32(dto.crewId);
            //int stbyId = Convert.ToInt32(dto.stbyId);
            //string fids = Convert.ToString(dto.fids);
            //int rank = Convert.ToInt32(dto.rank);

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
        entity.ID = $scope.flight.ID;
        entity.UserId = $rootScope.userId;
        entity.UserName = $rootScope.userName;
        entity.FlightStatusID = $scope.flight.FlightStatusID;

        entity.Delays = [];
        var delays = Enumerable.From($scope.dg_delay_ds).ToArray();
        $.each(delays, function (_i, _d) {
            if (_d.Id == 97)
                $scope.flight.notes = 97;
            entity.Delays.push({
                FlightId: $scope.flight.ID,
                DelayCodeId: _d.DelayCodeId,
                HH: _d.HH,
                MM: _d.MM,
                Remark: _d.Remark,
                UserId: $rootScope.userId,
            });
        });

    };

    $scope.fillLog = function (entity) {

        if ($scope.flight.ChocksOut)
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

        entity.FPFlightHH = $scope.flight.FPFlightHH;
        entity.FPFlightMM = $scope.flight.FPFlightMM;
        entity.FPFuel = $scope.flight.FPFuel;
        entity.Defuel = $scope.flight.Defuel;
        entity.UsedFuel = $scope.flight.UsedFuel;
        entity.JLBLHH = $scope.flight.JLBLHH;
        entity.JLBLMM = $scope.flight.JLBLMM;
        entity.PFLR = $scope.flight.PFLR;
        //landing
        if ($scope.flight.Landing)
            entity.Landing = (new Date($scope.flight.Landing)).toUTCString();
        if ($scope.flight.ChocksIn)
            entity.ChocksIn = (new Date($scope.flight.ChocksIn)).toUTCString();

        entity.BlockH = $scope.flight.BlockH;
        entity.BlockM = $scope.flight.BlockM;

        entity.GWLand = $scope.flight.GWLand;


        entity.FuelArrival = $scope.flight.FuelArrival;

        entity.ArrivalRemark = $scope.flight.ArrivalRemark;
        //$scope.flight.FlightStatusID == 9 || $scope.flight.FlightStatusID == 17 || $scope.flight.FlightStatusID == 4
        if ($scope.flight.FlightStatusID == 9) {
            $scope.flight.RampDate = (new Date($scope.time_status_value)).toUTCString();
            entity.RampDate = (new Date($scope.time_status_value)).toUTCString();
            entity.RampReasonId = $scope.flight.RampReasonId;
        }
        //aool
        // if ($scope.flight.FlightStatusID == 17) {
        if ($scope.flight.RedirectReasonId) {
            $scope.flight.RedirectDate = (new Date($scope.time_redirect_value)).toUTCString();
            entity.RedirectDate = (new Date($scope.time_redirect_value)).toUTCString();

            //$scope.flight.OToAirportId = $scope.flight.ToAirportId;
            $scope.flight.ToAirportId = $scope.entity_redirect.Airport.Id;
            $scope.flight.ToAirport = $scope.entity_redirect.Airport.Id;
            entity.ToAirportId = $scope.entity_redirect.Airport.Id;
            if (!$scope.flight.OToAirportIATA)
                $scope.flight.OToAirportIATA = $scope.flight.ToAirportIATA;
            $scope.flight.ToAirportIATA = $scope.entity_redirect.Airport.IATA;
            entity.RedirectReasonId = $scope.flight.RedirectReasonId;
            entity.RedirectRemark = $scope.flight.RedirectRemark;


        }
        if ($scope.flight.FlightStatusID == 4) {
            $scope.flight.CancelDate = (new Date($scope.time_status_value)).toUTCString();
            entity.CancelDate = (new Date($scope.time_status_value)).toUTCString();
            entity.CancelReasonId = $scope.flight.CancelReasonId;
        }

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

    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Departure';
    $scope.popup_flight = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_flight"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1200,
        //height: function () { return $(window).height() * 0.95 },
        height: 647,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacflight', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {
                        //takeoff save

                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (new Date($scope.flightOffBlock2) < new Date($scope.flight.STD)) {
                            General.ShowNotify(Config.Text_OffBlock, 'error');
                            return;
                        }
                        if ($scope.flightTakeOff2 && new Date($scope.flightTakeOff2) < new Date($scope.flightOffBlock2)) {
                            General.ShowNotify(Config.Text_TakeOff, 'error');
                            return;
                        }
                        var dto = {
                            StatusLog: [],
                        };
                        // $scope.entity.DateFrom = new Date($scope.entity.iDateFrom).ToUTC();

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        var donext = (!$scope.flight.ChocksOut && $scope.flightOffBlock2) || ((new Date($scope.flight.ChocksOut)).getTime() != (new Date($scope.flightOffBlock2)).getTime());
                        $scope.flight.ChocksOut = $scope.flightOffBlock2;
                        Flight.calculateDelayOffBlock($scope.flight);
                        if (donext && $scope.applyNextFlight)
                            Flight.calculateNextTaskDelayOffBlock($scope.flight, $scope.dataSource, ganttObj);
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 14,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });
                        if ($scope.flightTakeOff2) {
                            $scope.flight.Takeoff = $scope.flightTakeOff2;

                            if ($scope.flight.FlightStatusID != 4)
                                $scope.setStatus($scope.flight, 2);
                            dto.StatusLog.push({
                                FlightID: $scope.flight.ID,
                                FlightStatusID: 2,
                                Date: (new Date(Date.now())).toUTCString(),
                                UserId: $rootScope.userId,
                            });

                        }
                        else {
                            if ($scope.flight.FlightStatusID != 4)
                                $scope.setStatus($scope.flight, 14);
                        }

                        //$scope.flight.TakeOff = $scope.flightTakeOff;

                        //$scope.setStatus($scope.flight, 2);
                        //Flight.calculateDelay($scope.flight);
                        //if ($scope.applyNextFlight)
                        //    Flight.calculateNextTaskDelay($scope.flight, $scope.dataSource, ganttObj);

                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //$scope.showButtons2($scope.flight);


                        //kooks
                        $scope.fillDto(dto);
                        $scope.fillDeparture(dto);

                        //console.log(dto);

                        ////////////////////////
                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //console.log('dep edited flight');
                        //console.log($scope.flight);
                        //$scope.showButtons2($scope.flight);
                        //$scope.popup_flight_visible = false;
                        /////////////////////////////
                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightDep(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);

                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_flight_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

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

            if ($scope.flight.ChocksOut)
                $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            else {

                $scope.flightOffBlock2 = Flight.getEstimatedOffBlock($scope.flight);
            }
            $scope.flightTakeOff2 = $scope.flight.Takeoff;
            $scope.depReadOnly = false;
            $scope.selectedTabIndex = 0;
            $scope.setWeather();

        },
        onShown: function (e) {
            if (!$scope.flight.delays) {
                $scope.loadingVisible = true;
                flightService.getFlightDelayCodes($scope.flight.ID).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.flight.delays = response;
                    $scope.dg_ds = response;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                $scope.dg_ds = $scope.flight.delays;
        },
        onHiding: function () {

            $scope.selectedTabIndex = -1;
            $scope.popup_flight_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_visible',

            title: 'popup_flight_title',

        }
    };

    //close button
    $scope.popup_flight.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_flight_visible = false;

    };

    ///////////////////////////////////

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
                                   $scope.popup_cl_visible = true;
                               });

                           }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                       }
                   }, toolbar: 'bottom'
               },
 {
     widget: 'dxButton', location: 'after', options: {
         type: 'default', text: 'Notify Pickup', icon: 'clock', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


             $scope.popup_notify_visible = true;
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
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaclog', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {

                        //var result = arg.validationGroup.validate();

                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}
                        //sooki
                        //if ($scope.doUTC) {
                        //    General.ShowNotify('Saving is disabled in UTC mode.', 'error');
                        //    return;
                        //}

                        //goh4
                       // if ($scope.timeBase == 'UTC')
                        //    return;
                        if (!$scope.flightOffBlock2 && ($scope.flight.FlightStatusID == 2 || $scope.flight.FlightStatusID == 3 || $scope.flight.FlightStatusID == 7 || $scope.flight.FlightStatusID == 9 || $scope.flight.FlightStatusID == 14 || $scope.flight.FlightStatusID == 15 || $scope.flight.FlightStatusID == 17)) {
                            General.ShowNotify(Config.Text_OffBlock, 'error');
                            return;
                        }
                        if (!$scope.flightTakeOff2 && ($scope.flight.FlightStatusID == 2 || $scope.flight.FlightStatusID == 3 || $scope.flight.FlightStatusID == 7 || $scope.flight.FlightStatusID == 15 || $scope.flight.FlightStatusID == 17)) {
                            General.ShowNotify(Config.Text_TakeOff, 'error');
                            return;
                        }
                        if (!$scope.flightLanding2 && ($scope.flight.FlightStatusID == 3 || $scope.flight.FlightStatusID == 15)) {
                            General.ShowNotify(Config.Text_Landing, 'error');
                            return;
                        }
                        if (!$scope.flightOnBlock2 && ($scope.flight.FlightStatusID == 15)) {
                            General.ShowNotify(Config.Text_OnBlock, 'error');
                            return;
                        }



                        if (!$scope.flightOffBlock2 && ($scope.flightTakeOff2 || $scope.flightLanding2 || $scope.flightOnBlock2)) {
                            General.ShowNotify(Config.Text_OffBlock, 'error');
                            return;
                        }
                        if (!$scope.flightTakeOff2 && ($scope.flightLanding2 || $scope.flightOnBlock2)) {
                            General.ShowNotify(Config.Text_TakeOff, 'error');
                            return;
                        }
                        if (!$scope.flightLanding2 && ($scope.flightOnBlock2)) {
                            General.ShowNotify(Config.Text_Landing, 'error');
                            return;
                        }


                        if ($scope.flightTakeOff2 && new Date($scope.flightTakeOff2) < new Date($scope.flightOffBlock2)) {
                            General.ShowNotify(Config.Text_TakeOff, 'error');
                            return;
                        }
                        if ($scope.flightLanding2 && new Date($scope.flightLanding2) < new Date($scope.flightTakeOff2)) {
                            General.ShowNotify(Config.Text_Landing, 'error');
                            return;
                        }
                        if ($scope.flightOnBlock2 && new Date($scope.flightOnBlock2) < new Date($scope.flightLanding2)) {
                            General.ShowNotify(Config.Text_OnBlock, 'error');
                            return;
                        }
                        if ($scope.flight.FlightStatusID == 4 && !$scope.flight.CancelReasonId) {
                            General.ShowNotify(Config.Text_CancelReason, 'error');
                            return;
                        }
                        //if ($scope.flight.FlightStatusID == 17 && !$scope.flight.RedirectReasonId) {
                        //    General.ShowNotify(Config.Text_DiversionReason, 'error');
                        //    return;
                        //}
                        //if ($scope.flight.FlightStatusID == 17 && !$scope.entity_redirect.AirportId) {
                        //    General.ShowNotify(Config.Text_DiversionAltAirport, 'error');
                        //    return;
                        //}
                        //entity_redirect.AirportId
                        //if ($scope.flight.FlightStatusID == 9 && !$scope.flight.RampReasonId) {
                        //    General.ShowNotify(Config.Text_RampReason, 'error');
                        //    return;
                        //}

                        //if (!$scope.time_status_value && ($scope.flight.FlightStatusID == 9 || $scope.flight.FlightStatusID == 17 || $scope.flight.FlightStatusID == 4)) {
                        //    General.ShowNotify(Config.Text_StatusTime, 'error');
                        //    return;
                        //}

                        //entity_cancel.CancelReasonId


                        //////////////////////////////
                        ///////////////////////////////
                        var sumTotalDelayCodesAmount = 0;
                        if (!$scope.dg_delay_ds)
                            $scope.dg_delay_ds = [];
                        //sati new
                        sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                        if (!$scope.flight.TotalDelayTotalMM)
                            $scope.flight.TotalDelayTotalMM = 0;

                        if ($scope.flight.TotalDelayTotalMM > 5 && $scope.dg_delay_ds.length == 0) {
                            // General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                            // return;
                        }

                        if ($scope.dg_delay_ds) {
                            if (!$scope.flight.TotalDelayTotalMM)
                                $scope.flight.TotalDelayTotalMM = 0;
                            sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                            if ($scope.flight.FlightStatusID != 5 && (sumTotalDelayCodesAmount > 5 && sumTotalDelayCodesAmount != $scope.flight.TotalDelayTotalMM) && $scope.flightOffBlock2) {
                                //  General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                //  return;
                            }
                        }

                        //////////////////////////////////
                        //////////////////////////////////
                        /* var sumTotalDelayCodesAmount = 0;
                         if (!$scope.dg_delay_ds)
                             $scope.dg_delay_ds = [];
                         
                         if ($scope.flight.FlightStatusID == 5 && $scope.dg_delay_ds.length == 0) {
                             General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                             return;
                         }
 
                         if ($scope.dg_delay_ds) {
                             if (!$scope.flight.TotalDelayTotalMM)
                                 $scope.flight.TotalDelayTotalMM = 0;
                             sumTotalDelayCodesAmount = Enumerable.From($scope.dg_delay_ds).Select('$.Total').Sum();
                             if ($scope.flight.FlightStatusID != 5 && sumTotalDelayCodesAmount != $scope.flight.TotalDelayTotalMM && $scope.flightOffBlock2) {
                                 General.ShowNotify(Config.Text_DelayCodesNETotalDelay, 'error');
                                 return;
                             }
                         }*/
                        var dto = {
                            StatusLog: [],
                        };

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        $scope.flight.ChocksOut = $scope.flightOffBlock2 /*&& $scope.flight.FlightStatusID!=1*/ ? $scope.flightOffBlock2 : null;

                        $scope.flight.Takeoff = $scope.flightTakeOff2 ? $scope.flightTakeOff2 : null;
                        $scope.flight.Landing = $scope.flightLanding2 ? $scope.flightLanding2 : null;
                        $scope.flight.ChocksIn = $scope.flightOnBlock2 ? $scope.flightOnBlock2 : null;

                        if ($scope.timeBase == 'UTC') {
                            var offset = -1 * (new Date()).getTimezoneOffset();

                            //(new Date(_d.STA)).addMinutes(offset);
                            // $scope.flight.STA = (new Date($scope.flight.STA)).addMinutes(offset);
                            //  $scope.flight.STD = (new Date($scope.flight.STD)).addMinutes(offset);

                            $scope.flight.ChocksOut = (new Date($scope.flight.ChocksOut)).addMinutes(offset);
                            // alert($scope.flight.ChocksOut);
                            $scope.flight.Takeoff = (new Date($scope.flight.Takeoff)).addMinutes(offset);
                            $scope.flight.Landing = (new Date($scope.flight.Landing)).addMinutes(offset);
                            $scope.flight.ChocksIn = (new Date($scope.flight.ChocksIn)).addMinutes(offset);

                            //$scope.time_status_value = (new Date($scope.time_status_value)).addMinutes(offset);
                            if ($scope.time_redirect_value)
                                $scope.time_redirect_value = (new Date($scope.time_redirect_value)).addMinutes(offset);
                            if ($scope.time_ramp_value)
                                $scope.time_ramp_value = (new Date($scope.time_ramp_value)).addMinutes(offset);

                        }


                        if ($scope.flight.ChocksIn) {
                            Flight.calculateDelayLandingOnBlock($scope.flight);
                        }
                        if ($scope.flight.ChocksOut)
                            Flight.XcalculateDelayOffBlock($scope.flight);
                        if ($scope.flight.ChocksIn)
                            Flight.XcalculateDelayLandingOnBlock($scope.flight);
                        // if (!$scope.ChocksOut)
                        $scope.flight.EstimatedDelay = sumTotalDelayCodesAmount;


                        //gabi
                        $scope.setStatus($scope.flight, $scope.flight.FlightStatusID);
                        $scope.fillDto(dto);
                        $scope.fillLog(dto);
                        //   console.log('gabi');
                        //   console.log(dto);

                        //if (dto.FlightStatusID == 5) {
                        //    dto.ChocksIn = null;
                        //    dto.TakeOff = null;
                        //    dto.Landing = null;
                        //   // dto.ChocksOut = null;

                        //}
                        //else
                        //if (dto.FlightStatusID == 2) {
                        //    dto.ChocksIn = null;

                        //    dto.Landing = null;

                        //}
                        //else
                        //if (dto.FlightStatusID == 3) {
                        //    dto.ChocksIn = null;



                        //}
                        dto.NightTime = $scope.flight.NightTime;
                        dto.JLBLHH = $scope.flight.JLBLHH;
                        dto.SendDelaySMS = $scope.sms_delay ? 1 : 0;
                        dto.SendCancelSMS = $scope.sms_cancel ? 1 : 0;
                        dto.SendNiraSMS = $scope.sms_nira ? 1 : 0;
                        $scope.loadingVisible = true;
                        flightService.saveFlightLog(dto).then(function (response) {
                            //  alert($scope.flight.ChocksOut);
                            // var _hhh = $scope.flight.TotalDelayHH;
                            // if (!_hhh)
                            //     _hhh = 0;
                            // var _mmm = $scope.flight.TotalDelayMM;
                            // if (!_mmm)
                            //     _mmm = 0;
                            // if (_hhh*60+_mmm >= 20) {
                            //     notificationService.delayNotification($scope.flight.ID, $scope.flight.FromAirportIATA, $scope.flight.ToAirportIATA, $scope.flight.FlightNumber, _hhh, _mmm).then(function (response) {
                            //     }, function (err) {   });
                            // }

                            // General.ShowNotify(Config.Text_SavedOk, 'success');
                            // if (!$scope.ChocksOut)
                            //     Flight.calculateEstimatedDelay($scope.flight);


                            //////////////////////////////////////////////////////////
                            if ($scope.timeBase == 'UTC' && $scope.doUTC) {

                                var offset = -1 * (new Date()).getTimezoneOffset();

                                //(new Date(_d.STA)).addMinutes(offset);
                                // $scope.flight.STA = (new Date($scope.flight.STA)).addMinutes(offset);
                                //  $scope.flight.STD = (new Date($scope.flight.STD)).addMinutes(offset);

                                $scope.flight.ChocksOut = (new Date($scope.flight.ChocksOut)).addMinutes(-offset);

                                $scope.flight.Takeoff = (new Date($scope.flight.Takeoff)).addMinutes(-offset);
                                $scope.flight.Landing = (new Date($scope.flight.Landing)).addMinutes(-offset);
                                $scope.flight.ChocksIn = (new Date($scope.flight.ChocksIn)).addMinutes(-offset);

                                //$scope.time_status_value = (new Date($scope.time_status_value)).addMinutes(offset);
                                if ($scope.time_redirect_value)
                                    $scope.time_redirect_value = (new Date($scope.time_redirect_value)).addMinutes(-offset);
                                if ($scope.time_ramp_value)
                                    $scope.time_ramp_value = (new Date($scope.time_ramp_value)).addMinutes(-offset);



                                if ($scope.flight.ChocksIn) {
                                    Flight.calculateDelayLandingOnBlock($scope.flight);
                                }
                                if ($scope.flight.ChocksOut)
                                    Flight.XcalculateDelayOffBlock($scope.flight);
                                if ($scope.flight.ChocksIn)
                                    Flight.XcalculateDelayLandingOnBlock($scope.flight);
                                // if (!$scope.ChocksOut)
                                $scope.flight.EstimatedDelay = sumTotalDelayCodesAmount;

                            }
                            ///////////////////////////////////////////////////////////


                            ganttObj.reRenderChart();
                            $('.task-' + $scope.flight.ID).parent().addClass('e-gantt-taskbarSelection');
                            $scope.getBoardSummary($scope.selectedDate);
                            // $scope.before_refreshed_flight = null;
                            $scope.loadingVisible = false;
                            $scope.sms_delay = false;
                            $scope.sms_cancel = false;
                            $scope.sms_nira = false;
                            $scope.popup_log_visible = false;

                            //$scope.calculateSummary();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                        //  ganttObj.updateRecordByTaskId($scope.flight);

                        /////////////////////////////////////
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
        onShowing: function (e) {
            //  $scope.otimes = {};
            //  $scope.otimes.STA = $scope.flight.STA;
            //  $scope.otimes.STD = $scope.flight.STD;
            console.log('Updtae delay remark log showing');

            if ($scope.flight.ChocksOut)
                $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            if (!$scope.flightOffBlock2) {

                $scope.flightOffBlock2 = $scope.flight.STD;
            }

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
                //goh
                console.log(response);
                $.each(response, function (_i, _d) {

                    var dc = {
                        Id: _d.ID, //_d.DelayCodeId,
                        DelayCodeId:_d.DelayCodeId,
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
                if ($scope.doUTC)
                { $scope.timeBase = 'UTC'; }
                else
                { $scope.timeBase = 'LCB'; }

                //sooki



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
            'toolbarItems[1].visible': 'IsJLAccess',
            'toolbarItems[2].visible': 'IsPickup',
            'toolbarItems[3].visible': 'IsEditable',
            'toolbarItems[4].visible': 'IsEditable',

        }
    };

    //close button
    //fuckc
    ///////////////////////////////////



    $scope.popup_takeoff_visible = false;
    $scope.popup_takeoff_title = 'Take Off';
    $scope.popup_takeoff = {
        width: 400,
        height: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbactakeoff', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (new Date($scope.flightTakeOff) < new Date($scope.flight.ChocksOut)) {
                            General.ShowNotify(Config.Text_TakeOff, 'error');
                            return;
                        }

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        $scope.flight.Takeoff = $scope.flightTakeOff;

                        $scope.setStatus($scope.flight, 2);
                        var dto = {
                            Takeoff: (new Date($scope.flight.Takeoff)).toUTCString(),
                            StatusLog: [],
                            EstimatedDelays: [],
                        };
                        dto.ID = $scope.flight.ID;
                        dto.UserId = $rootScope.userId;
                        dto.FlightStatusID = $scope.flight.FlightStatusID;
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 2,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });


                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //$scope.showButtons2($scope.flight);
                        //$scope.popup_takeoff_visible = false;
                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightTakeOff(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);

                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_takeoff_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

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

        },
        onHiding: function () {


            $scope.popup_takeoff_visible = false;

        },
        bindingOptions: {
            visible: 'popup_takeoff_visible',

            title: 'popup_takeoff_title',

        }
    };

    //close button
    $scope.popup_takeoff.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_takeoff_visible = false;

    };
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
    $scope.dg_crew_abs_columns = [
        {
            caption: 'Crew', columns: [
                 { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
                { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, fixed: true, fixedPosition: 'left' },
               // { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
               // { dataField: 'ScName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                 { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,visible:$scope.IsCrewMobileVisible },



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
    //*****************************************/////
    $scope.popup_offblock_visible = false;
    $scope.popup_offblock_title = 'Off Block';
    $scope.popup_offblock = {
        shading: true,
        width: 380,
        height: '380', //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacoffblock', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (new Date($scope.flightOffBlock) < new Date($scope.flight.STD)) {
                            General.ShowNotify(Config.Text_OffBlock, 'error');
                            return;
                        }
                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        var donext = (!$scope.flight.ChocksOut && $scope.flightOffBlock) || ((new Date($scope.flight.ChocksOut)).getTime() != (new Date($scope.flightOffBlock)).getTime());

                        $scope.flight.ChocksOut = $scope.flightOffBlock;

                        Flight.calculateDelayOffBlock($scope.flight);

                        if (donext && $scope.applyNextFlight) {

                            Flight.calculateNextTaskDelayOffBlock($scope.flight, $scope.dataSource, ganttObj);
                        }
                        $scope.setStatus($scope.flight, 14);
                        var dto = {
                            ChocksOut: (new Date($scope.flight.ChocksOut)).toUTCString(),
                            StatusLog: [],
                            EstimatedDelays: [],
                        };
                        dto.ID = $scope.flight.ID;
                        dto.UserId = $rootScope.userId;

                        dto.FlightStatusID = $scope.flight.FlightStatusID;
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 14,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });

                        var estimatedDelaysFlights = Enumerable.From($scope.dataSource).Where('$.EstimatedDelayChanged && $.EstimatedDelayChanged==true && $.EstimatedDelay>0 && $.status==1 && $.startDate.getDatePart()==' + $scope.flight.startDate.getDatePart() + ' && $.startDate.getTime() > ' + $scope.flight.startDate.getTime() + '  && $.RegisterID==' + $scope.flight.RegisterID).OrderBy('$.startDate').ToArray();
                        $.each(estimatedDelaysFlights, function (_i, _d) {
                            dto.EstimatedDelays.push({
                                FlightId: _d.ID,
                                Delay: Math.floor(_d.EstimatedDelay),
                            });
                        });



                        //$scope.showButtons2($scope.flight);

                        //ganttObj.updateRecordByTaskId($scope.flight);

                        //$scope.popup_offblock_visible = false;

                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightOffBlock(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_offblock_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

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

        },
        onHiding: function () {


            $scope.popup_offblock_visible = false;

        },
        bindingOptions: {
            visible: 'popup_offblock_visible',

            title: 'popup_offblock_title',

        }
    };

    //close button
    $scope.popup_offblock.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_offblock_visible = false;

    };



    $scope.popup_landing_visible = false;
    $scope.popup_landing_title = 'Take Off';
    $scope.popup_landing = {
        width: 400,
        height: 450,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaclanding', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //landing save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (new Date($scope.flightLanding) < new Date($scope.flight.STA)) {
                            General.ShowNotify(Config.Text_Landing, 'error');
                            return;
                        }
                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        if ($scope.flight.status != 17)
                            $scope.setStatus($scope.flight, 3);
                        else
                            $scope.setStatus($scope.flight, 7);
                        $scope.flight.Landing = $scope.flightLanding;
                        var dto = {
                            StatusLog: [],
                        };
                        dto.ID = $scope.flight.ID;
                        dto.UserId = $rootScope.userId;
                        dto.Landing = (new Date($scope.flight.Landing)).toUTCString();
                        dto.FlightStatusID = $scope.flight.FlightStatusID;
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 3,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });





                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //$scope.showButtons2($scope.flight);
                        //$scope.popup_landing_visible = false;
                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightLanding(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_landing_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

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

        },
        onHiding: function () {


            $scope.popup_landing_visible = false;

        },
        bindingOptions: {
            visible: 'popup_landing_visible',

            title: 'popup_landing_title',

        }
    };

    //close button
    $scope.popup_landing.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_landing_visible = false;

    };




    $scope.popup_onblock_visible = false;
    $scope.popup_onblock_title = 'Off Block';
    $scope.popup_onblock = {
        width: 400,
        height: 270,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaconblock', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if ($scope.flightOnBlock && new Date($scope.flightOnBlock) < new Date($scope.flight.Landing)) {
                            General.ShowNotify(Config.Text_OnBlock, 'error');
                            return;
                        }
                        var dto = {
                            StatusLog: [],
                        };

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        if ($scope.flight.status != 17 && $scope.flight.status != 7)
                            $scope.setStatus($scope.flight, 15);
                        else
                            $scope.setStatus($scope.flight, 7);
                        $scope.flight.ChocksIn = $scope.flightOnBlock;
                        // alert($scope.flight.duration);
                        //console.log('Before');
                        //console.log(JSON.stringify($scope.flight));
                        // Flight.proccessFlight($scope.flight);
                        // console.log(JSON.stringify($scope.flight));
                        // Flight.calculateDelayLandingOnBlock($scope.flight);
                        // Flight.calculateDelay($scope.flight);

                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 15,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });
                        dto.ID = $scope.flight.ID;
                        dto.UserId = $rootScope.userId;
                        dto.ChocksIn = (new Date($scope.flight.ChocksIn)).toUTCString();
                        dto.FlightStatusID = $scope.flight.FlightStatusID;

                        //$scope.showButtons2($scope.flight);
                        //ganttObj.updateRecordByTaskId($scope.flight);
                        //$scope.popup_onblock_visible = false;
                        //return;
                        $scope.loadingVisible = true;
                        flightService.saveFlightOnBlock(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            //ganttObj.updateRecordByTaskId($scope.flight);
                            //$scope.showButtons2($scope.flight);

                            //$scope.loadingVisible = false;

                            //$scope.popup_onblock_visible = false;
                            //$scope.doGridSelectedChanged = false;
                            //$scope.dg_flights_instance.refresh();
                            //$scope.dg_flights_instance.selectRows([$scope.flight], true);
                            //$scope.calculateSummary();

                            $scope.loadingVisible = false;
                            $scope.popup_onblock_visible = false;
                            $scope.bindFlights(true);

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

        },
        onHiding: function () {


            $scope.popup_onblock_visible = false;

        },
        bindingOptions: {
            visible: 'popup_onblock_visible',

            title: 'popup_onblock_title',

        }
    };

    //close button
    $scope.popup_onblock.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_onblock_visible = false;

    };


    $scope.popup_cancel_visible = false;
    $scope.popup_cancel_title = 'Cancel';
    $scope.popup_cancel = {
        shading: true,
        width: 360,
        height: '380', //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaccancel', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.entity_cancel.Date = (new Date(Date.now())).toUTCString();
                        $scope.entity_cancel.CancelDate = (new Date($scope.entity_cancel.CancelDate)).toUTCString();
                        $scope.entity_cancel.UserId = $rootScope.userId;
                        $scope.entity_cancel.FlightId = $scope.flight.ID;

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        $scope.setStatus($scope.flight, 4);
                        $scope.loadingVisible = true;
                        flightService.saveFlightCancel($scope.entity_cancel).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_cancel_visible = false;
                            $scope.doGridSelectedChanged = false;
                            $scope.dg_flights_instance.refresh();
                            $scope.dg_flights_instance.selectRows([$scope.flight], true);
                            $scope.calculateSummary();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        return;
                        if (new Date($scope.flightOffBlock) < new Date($scope.flight.STD)) {
                            General.ShowNotify(Config.Text_OffBlock, 'error');
                            return;
                        }
                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        var donext = (!$scope.flight.ChocksOut && $scope.flightOffBlock) || ((new Date($scope.flight.ChocksOut)).getTime() != (new Date($scope.flightOffBlock)).getTime());

                        $scope.flight.ChocksOut = $scope.flightOffBlock;

                        Flight.calculateDelayOffBlock($scope.flight);

                        if (donext && $scope.applyNextFlight) {

                            Flight.calculateNextTaskDelayOffBlock($scope.flight, $scope.dataSource, ganttObj);
                        }
                        $scope.setStatus($scope.flight, 14);
                        var dto = {
                            ChocksOut: (new Date($scope.flight.ChocksOut)).toUTCString(),
                            StatusLog: [],
                            EstimatedDelays: [],
                        };
                        dto.ID = $scope.flight.ID;
                        dto.UserId = $rootScope.userId;

                        dto.FlightStatusID = $scope.flight.FlightStatusID;
                        dto.StatusLog.push({
                            FlightID: $scope.flight.ID,
                            FlightStatusID: 14,
                            Date: (new Date(Date.now())).toUTCString(),
                            UserId: $rootScope.userId,
                        });

                        var estimatedDelaysFlights = Enumerable.From($scope.dataSource).Where('$.EstimatedDelayChanged && $.EstimatedDelayChanged==true && $.EstimatedDelay>0 && $.status==1 && $.startDate.getDatePart()==' + $scope.flight.startDate.getDatePart() + ' && $.startDate.getTime() > ' + $scope.flight.startDate.getTime() + '  && $.RegisterID==' + $scope.flight.RegisterID).OrderBy('$.startDate').ToArray();
                        $.each(estimatedDelaysFlights, function (_i, _d) {
                            dto.EstimatedDelays.push({
                                FlightId: _d.ID,
                                Delay: Math.floor(_d.EstimatedDelay),
                            });
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

        },
        onHiding: function () {

            $scope.cleat_entity_cancel();
            $scope.popup_cancel_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cancel_visible',

            title: 'popup_cancel_title',

        }
    };

    //close button
    $scope.popup_cancel.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_cancel_visible = false;

    };
    ///////////////////////////////
    $scope.popup_redirect_visible = false;
    $scope.popup_redirect_title = 'Redirect';
    $scope.popup_redirect = {
        shading: true,
        width: 360,
        height: '490', //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //$scope.updatedFlightsCount = 0;
                        //$scope.updatedFlights = [];
                        //$scope.bindFlights(false);
                        //$scope.popup_redirect_visible = false;


                        $scope.entity_redirect.Date = (new Date(Date.now())).toUTCString();
                        $scope.entity_redirect.RedirectDate = (new Date($scope.entity_redirect.RedirectDate)).toUTCString();
                        $scope.entity_redirect.UserId = $rootScope.userId;
                        $scope.entity_redirect.FlightId = $scope.flight.ID;
                        $scope.entity_redirect.STA = (new Date($scope.entity_redirect.STA)).toUTCString();
                        $scope.entity_redirect.OAirportIATA = $scope.flight.ToAirportIATA;
                        $scope.entity_redirect.Airport = null;

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        $scope.setStatus($scope.flight, 17);
                        $scope.loadingVisible = true;
                        flightService.saveFlightRedirect($scope.entity_redirect).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            //ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.showButtons2($scope.flight);

                            //$scope.loadingVisible = false;

                            //$scope.popup_cancel_visible = false;
                            //$scope.doGridSelectedChanged = false;
                            //$scope.dg_flights_instance.refresh();
                            //$scope.dg_flights_instance.selectRows([$scope.flight], true);
                            //$scope.calculateSummary();
                            $scope.updatedFlightsCount = 0;
                            $scope.updatedFlights = [];
                            $scope.bindFlights(false);
                            $scope.popup_redirect_visible = false;


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

        },
        onHiding: function () {

            $scope.clear_entity_redirect();
            $scope.popup_redirect_visible = false;

        },
        bindingOptions: {
            visible: 'popup_redirect_visible',

            title: 'popup_redirect_title',

        }
    };

    //close button
    $scope.popup_redirect.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_redirect_visible = false;

    };
    ///////////////////////////////
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


        var archived_crews = 0;
        if (new Date($scope.flight.Date) < new Date(2020, 6, 1, 0, 0, 0, 0))
            archived_crews = 1;


        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid, archived_crews).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_abs_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewAbs2 = function (fid) {


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


                         printElem($('#jl'));

                     }


                 }, toolbar: 'bottom'
             },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#jl'));

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
        var scrollable = $scope.dg_flights_instance.getView('rowsView')._scrollable;
        var rowindex = $scope.dg_flights_instance.getRowIndexByKey(data);
        var selectedRowElements = $scope.dg_flights_instance.getRowElement(rowindex);
        scrollable.scrollToElement(selectedRowElements);
    };
    $scope.scrollGantt = function (data) {

        var df = new Date(data.STD);
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


    $scope.dg_flights_selected = null;
    $scope.dg_flights_columns = [
        {
            dataField: "delay1", caption: '',
            width: 50,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                var color = 'lightgray';
                if (options.data.FlightStatusID > 1) {

                    if (options.data.delay > 0 || options.data.delayLanding > 0)
                        color = '#e51400';
                    else
                        color = '#60a917';
                }
                $("<div>")
                    .append('<i class="fas fa-clock" style="color:' + color + ';font-size:16px"></i>')
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
        {
            dataField: "FlightStatusID", caption: '',
            width: 50,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                /*if (options.value == 12)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-add-circle'></i>")
                        .appendTo(container);
                if (options.value == 13)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#4CAF50' class='icon ion-md-create'></i>")
                        .appendTo(container);
                if (options.value == 10)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i>")
                        .appendTo(container);
                if (options.value == 11)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);
                   */
                var st = Flight.getStatus(options.value);
                var color = st.bgcolor;
                var str = options.data.FlightStatus;
                str = '';
                switch (options.value) {
                    case 1:

                        $("<div>")
                            .append('<i class="fas fa-calendar-day" style="color:' + 'lightgray' + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 14:

                        $("<div>")
                            .append('<i class="far fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 2:

                        $("<div>")
                            .append('<i class="fas fa-plane-departure" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 3:

                        $("<div>")
                            .append('<i class="fas fa-plane-arrival" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 4:

                        $("<div>")
                            .append('<i class="fas fa-ban" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 15:

                        $("<div>")
                            .append('<i class="fas fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 17:

                        $("<div>")
                            .append('<i class="fas fa-random" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 7:

                        $("<div>")
                            .append('<i class="fas fa-level-down-alt" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:13px">' + str + '</span>')
                            .appendTo(container);
                        break;

                    default:
                        break;
                }

            },
            fixed: true, fixedPosition: 'left',
        },
        //{ dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,  },
        { dataField: 'ID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
        {
            caption: 'Airports', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },

        {
            caption: 'Departure',
            columns: [
                { dataField: 'STD', caption: 'Scheduled Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 170, alignment: 'center', format: 'yyyy-MMM-dd, HH:mm', sortIndex: 0, sortOrder: "asc" },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [
                { dataField: 'STA', caption: 'Scheduled Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
            ]
        },
        // { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        // { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },

        // { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'right' },
        {
            caption: 'Pax',
            columns: [
                { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxChild', caption: 'Child', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'TotalPax', caption: 'Total', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', name: 'totalpax' },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxOver', caption: 'Over', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },
        {
            caption: 'Cargo',
            columns: [
                { dataField: 'CargoUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'CargoWeight', caption: 'Weight', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'cargoweight', },
                { dataField: 'CargoCount', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },

        {
            caption: 'Baggage',
            columns: [
                { dataField: 'CargoUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'BaggageWeight', caption: 'Weight', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'baggageweight', },
                { dataField: 'BaggageCount', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },
        {
            caption: 'Fuel',
            columns: [
                { dataField: 'FuelUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'FuelDeparture', caption: 'Dep.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FuelArrival', caption: 'Arr.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
            ]
        },
        {
            caption: 'Delays', fixed: true, fixedPosition: 'right', columns: [
                { dataField: 'delay', caption: 'Dep.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delay', },
                { dataField: 'delayLanding', caption: 'Arr.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delayLanding', },

            ]
        },





    ];

    $scope.dg_flights_height = $(window).height() - 139 - 50;

    $scope.dg_flights_instance = null;
    $scope.dg_flights_ds = null;
    $scope.dg_flights = {
        //grouping: {
        //    autoExpandAll: true,
        //    allowCollapsing: true,
        //},
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

        // paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        scrolling: { mode: 'infinite', showScrollbar: 'always' },
        paging: { pageSize: 100 },

        columns: $scope.dg_flights_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flights_instance)
                $scope.dg_flights_instance = e.component;

        },
        onSelectionChanged: function (e) {
            if (!$scope.doGridSelectedChanged) {
                $scope.doGridSelectedChanged = true;
                var scrollable = e.component.getView('rowsView')._scrollable;
                var selectedRowElements = e.component.element().find('tr.dx-selection');
                scrollable.scrollToElement(selectedRowElements);
                return;
            }
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_flights_selected = null;



            }
            else {
                $scope.dg_flights_selected = data;
                $scope.addSelectedFlight2(data);
                var ganttObj = $("#resourceGanttba").data("ejGantt");

                var rec = ganttObj._getRecordByTaskId(data.ID.toString());
                ganttObj._$ganttchartHelper.ejGanttChart("selectTaskbar", rec);
                $scope.scrollGantt(data);



            }


        },

        //summary: {
        //    totalItems: [{
        //        column: "delay",
        //        summaryType: "sum"
        //    }]
        //},
        summary: {
            totalItems: [

                { name: 'delay', showInColumn: 'delay', displayFormat: '{0}', summaryType: 'custom' },
                { name: 'delayLanding', showInColumn: 'delayLanding', displayFormat: '{0}', summaryType: 'custom' },
                { name: 'totalpax', showInColumn: 'totalpax', displayFormat: '{0}', summaryType: 'custom' },
                { name: 'cargoweight', showInColumn: 'cargoweight', displayFormat: '{0}', summaryType: 'custom' },
                { name: 'baggageweight', showInColumn: 'baggageweight', displayFormat: '{0}', summaryType: 'custom' },

            ],
            calculateCustomSummary: function (options) {

                if (options.name === 'delay') {
                    if (options.summaryProcess === 'start') {
                        options.delay = 0;

                    }
                    if (options.summaryProcess === 'calculate') {
                        if (options.value.FlightStatusID == 2 || options.value.FlightStatusID == 3 || options.value.FlightStatusID == 14 || options.value.FlightStatusID == 15)
                            options.delay += options.value.delay;

                    }
                    if (options.summaryProcess === 'finalize') {
                        options.totalValue = options.delay;

                    }
                }
                if (options.name === 'delayLanding') {
                    if (options.summaryProcess === 'start') {
                        options.delayLanding = 0;

                    }
                    if (options.summaryProcess === 'calculate') {
                        if (options.value.FlightStatusID == 2 || options.value.FlightStatusID == 3 || options.value.FlightStatusID == 14 || options.value.FlightStatusID == 15)
                            options.delayLanding += options.value.delayLanding;

                    }
                    if (options.summaryProcess === 'finalize') {
                        options.totalValue = options.delayLanding;

                    }
                }
                if (options.name === 'totalpax') {
                    if (options.summaryProcess === 'start') {
                        options.totalpax = 0;

                    }
                    if (options.summaryProcess === 'calculate') {
                        if (options.value.FlightStatusID == 2 || options.value.FlightStatusID == 3 || options.value.FlightStatusID == 14 || options.value.FlightStatusID == 15)
                            options.totalpax += options.value.TotalPax;

                    }
                    if (options.summaryProcess === 'finalize') {
                        options.totalValue = options.totalpax;

                    }
                }
                if (options.name === 'cargoweight') {
                    if (options.summaryProcess === 'start') {
                        options.cargoweight = 0;

                    }
                    if (options.summaryProcess === 'calculate') {
                        if (options.value.FlightStatusID == 2 || options.value.FlightStatusID == 3 || options.value.FlightStatusID == 14 || options.value.FlightStatusID == 15)
                            options.cargoweight += options.value.CargoWeight;

                    }
                    if (options.summaryProcess === 'finalize') {
                        options.totalValue = options.cargoweight;

                    }
                }
                if (options.name === 'baggageweight') {
                    if (options.summaryProcess === 'start') {
                        options.baggageweight = 0;

                    }
                    if (options.summaryProcess === 'calculate') {
                        if (options.value.FlightStatusID == 2 || options.value.FlightStatusID == 3 || options.value.FlightStatusID == 14 || options.value.FlightStatusID == 15)
                            options.baggageweight += options.value.BaggageWeight;

                    }
                    if (options.summaryProcess === 'finalize') {
                        options.totalValue = options.baggageweight;

                    }
                }

            }
        },
        bindingOptions: {
            dataSource: 'dg_flights_ds', //'dg_employees_ds',
            visible: 'gridview',
            height: 'dg_flights_height',
        }
    };
    ///////////////////////////////
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
        return;
        $scope.$apply(function () {
            $scope.offBlockVisible = item.status == 1 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
            $scope.takeOffVisible = item.status == 14 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
            $scope.landingVisible = ((item.status == 2 || item.status == 17) && (item.ToAirportIATA == $scope.airport || $scope.IsAdmin))
                || (item.status == 17 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin));
            $scope.onBlockVisible = (item.status == 3 || item.status == 7) && (item.ToAirportIATA == $scope.airport || $scope.IsAdmin)
                || (item.status == 7 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin));

            $scope.IsDepartureVisible = (item.FromAirportIATA == $scope.airport);
            $scope.IsArrivalVisible = (item.ToAirportIATA == $scope.airport) || (item.FromAirportIATA == $scope.airport && (item.status == 7 || item.status == 17));

            $scope.IsDepartureDisabled = item.Landing != null;
            $scope.IsArrivalDisabled = item.Takeoff == null;


            $scope.IsCancelVisible = !item.Takeoff && item.status != 4 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
            $scope.IsRedirectVisible = item.Takeoff && item.status != 17 && item.status != 7 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);

        });
    };
    $scope.showButtons2 = function (item) {
        $scope.IsDepartureDisabled = false;
        $scope.IsArrivalDisabled = false;
        return;
        $scope.offBlockVisible = item.status == 1 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
        $scope.takeOffVisible = item.status == 14 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
        $scope.landingVisible = ((item.status == 2 || item.status == 17) && (item.ToAirportIATA == $scope.airport || $scope.IsAdmin))
            || (item.status == 17 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin));
        $scope.onBlockVisible = (item.status == 3 || item.status == 7) && (item.ToAirportIATA == $scope.airport || $scope.IsAdmin)
            || (item.status == 7 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin));

        $scope.IsDepartureVisible = (item.FromAirportIATA == $scope.airport);
        $scope.IsArrivalVisible = (item.ToAirportIATA == $scope.airport) || (item.FromAirportIATA == $scope.airport && (item.status == 7 || item.status == 17));

        $scope.IsDepartureDisabled = item.Landing != null;
        $scope.IsArrivalDisabled = item.Takeoff == null;


        $scope.IsCancelVisible = !item.Takeoff && item.status != 4 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
        $scope.IsRedirectVisible = item.Takeoff && item.status != 17 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);

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
            $scope.dg_flights_instance.selectRows([item], false);

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

            var wdate = new Date(year + "/" + mo + "/" + da);
            persianDate.toLocale('en');
            var newwc =  moment(wdate).format('dd')+" "+  oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
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
    $scope.createGantt = function (_scale) {
        try{
        //alert($(window).width());
        var dtstr = (new Date($scope.datefrom)).yyyymmddtimenow(false);
        //  alert(dtstr);
        // alert($(window).width());
        if (!_scale) {
            _scale = $(window).width() * 0.24;
        }
        var scroll_factor = ($(window).width() / 1536);
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        //alert('gant');
        $scope.StartNowLineTimerFirst = true;
        $scope.nowlineInitLeft = null;
        var h = $(window).height() - 139 - 50 + 50 - 95;
        h = h + 'px';

        var _df = General.getDayFirstHour(new Date($scope.selectedDate));
        var d1 = (new Date(_df)).addDays(1);
        var d2 = (new Date(_df)).addDays(-1);
        //old
        var _dt = General.getDayLastHour(new Date($scope.selectedDate));
        //var _dt = (new Date(_df)).addDays(3);


        //var _dt = General.getDayLastHour(new Date(d2));
        var _data = Enumerable.From($scope.dataSource).Where(function (x) {
            var _ds = new Date(x.STD);
            var _de = new Date(x.STA);
            return (_ds >= _df && _ds <= _dt) || (_de >= _df && _de <= _dt);
        }).ToArray();

        var regs = Enumerable.From(_data).Select('$.Register').ToArray();
        var resources = Enumerable.From($scope.resources).Where(function (x) {
            return regs.indexOf(x.resourceName) != -1;
        }).ToArray();
        

        var nextDayTask = Enumerable.From(_data).Where(function (x) {
            //var _ds = new Date(x.STD);
            var _dsta = new Date(x.STA);
            var _dcin = new Date(x.STA);
            var _dland = new Date(x.STA);
            if (x.Landing)
                _dland = new Date(x.Landing);
            if (x.ChocksIn)
                _dcin = new Date(x.ChocksIn);
            return (_dsta > _dt || _dcin > _dt || _dland > _dt);
        }).ToArray();

        //var preDayTask = Enumerable.From($scope.dataSource).Where(function (x) {
        //    //var _ds = new Date(x.STD);
        //    var _dstd = new Date(x.STD);
        //    var _dcout = new Date(x.STD);
        //    var _dtake = new Date(x.STD);
        //    if (x.Takeoff)
        //        _dtake = new Date(x.Takeoff);
        //    if (x.ChocksOut)
        //        _dcout = new Date(x.ChocksOut);
        //    return (_dstd < _df || _dcout < _df || _dtake < _df);
        //}).ToArray();

        var showscroll = false;
        var scrollnextday = true;
        var _scroll = 1000000;

        if (nextDayTask && nextDayTask.length > 0) {
            _dt = General.getDayLastHour(new Date(d1));
            showscroll = true;
            _scroll = 400 * scroll_factor;

        }
        if ($scope.doUTC)
            _scroll = 0;

        //if (preDayTask && preDayTask.length > 0) {
        //    alert('x');
        //    _df = General.getDayFirstHour(new Date(d2));
        //    showscroll = true;
        //    //_scroll = 400 * scroll_factor;

        //}
        var _rowHeight = 50;

        var linkedExist = Enumerable.From(_data).Where('$.LinkedFlight').FirstOrDefault();


        // console.log(new Date($scope.selectedDate));

        $("#resourceGanttba").ejGantt({
            scheduleStartDate: _df, //$scope.datefrom,
            scheduleEndDate: _dt,//$scope.dateto,

            taskbarBackground: "red",
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,
            taskbarClick: function (args) {
                $scope.addSelectedFlight(args.data.item);
                $("#resourceGanttba").data("ejGantt").clearSelection();
            },
            dataSource: _data, //$scope.dataSource, //self.datasource, //resourceGanttData,
            allowColumnResize: true,
            isResponsive: true,
            taskIdMapping: "taskId",
            taskNameMapping: "taskName",
            fromLocationMapping: "from",
            startDateMapping: "startDate",
            endDateMapping: "endDate",
            progressMapping: "progress",
            durationMapping: "duration",
            groupNameMapping: "Title",
            groupIdMapping: "groupId",
            groupCollection: $scope.resourceGroups,
            resources:resources, //$scope.resources, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: _rowHeight,
            taskbarHeight: _rowHeight,
             
            predecessorMapping: "predecessor",
            allowGanttChartEditing: false,
            allowDragAndDrop: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,

                editMode: "normal",
            },
            splitterSettings: {
                position: 110,
            },
            toolbarSettings: {
                showToolbar: false,
                toolbarItems: [ej.Gantt.ToolbarItems.Add,
                ej.Gantt.ToolbarItems.Delete,
                ej.Gantt.ToolbarItems.Update,
                ej.Gantt.ToolbarItems.Cancel,
                ej.Gantt.ToolbarItems.ExpandAll,
                ej.Gantt.ToolbarItems.CollapseAll,
                ej.Gantt.ToolbarItems.NextTimeSpan,
                ej.Gantt.ToolbarItems.PrevTimeSpan
                ]
            },
            enableContextMenu: false,
            load: function () {
                // console.log('load');
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 110;
                //  console.log('load1');
                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                //this.getColumns().push(customColumn);

                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };
                //this.getColumns().push(columnFrom);

                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };
                //this.getColumns().push(columnbaseDuration);


                //var nowtime = $('#stripline0');
                //alert(nowtime.length);
                //nowtime.html("vahid");
                //zool
                if (linkedExist) {
                    $scope.linkedTimerDone = false;
                    // $scope.StartLinkedTimer();
                }




            },
            create: function (args) {
                try {
                    $('#ejTreeGridresourceGanttbae-gridcontent').height($('#ejTreeGridresourceGanttbae-gridcontent').height() - 20);

                    $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(_scroll);

                    $scope.renderTopTimeHeader();
                    $scope.renderTimeHeader();



                    $('.e-ganttviewerbodyContianer-stripLines').css('z-index', 0);
                    $scope.timeCellWidth = $('.e-schedule-day-headercell-content').width();


                    //datefrom
                    //dateto
                    var nw = new Date();
                    var nf = new Date(_df); //new Date($scope.datefrom);
                    var nt = new Date(_dt); //new Date($scope.dateto);
                    if (nw.getTime() >= nf.getTime() && nw.getTime() <= nt.getTime()) {

                        //old
                        //$scope.autoUpdate = true;
                        $scope.autoUpdate = true;
                        
                        $scope.StartNowLineTimer(1);
                    }
                    else {
                        $scope.autoUpdate = false;

                    }
                }
                catch (ee) {
                    alert('x');
                    alert(ee);
                }






            },

            cellSelecting: function (args) {

                if (!args)
                    return;

                if (args.data.eResourceTaskType != "resourceTask")
                    args.cancel = true;
            },
            cellSelected: function (args) {

                $('.e-gantt-taskbarSelection').removeClass('e-gantt-taskbarSelection');

                // console.log(args.data);
                $scope.setSelectedResource(args.data);
            },
            //  cellSelected: function (args) { console.log(args); },
            actionBegin: function (args) {
                // console.log(args);
                if (args.requestType && args.requestType == 'beginedit') {

                    args.cancel = true;

                    //  $scope.InitUpdate();
                }


            },
            actionComplete: function (args) {
                //  console.log('action complete');
                //  console.log(args.requestType);
                //  console.log(args);

                if (args.requestType == 'save') {
                    if ($scope.doActionCompleteSave)
                        setTimeout(function () {
                            var ganttObj = $("#resourceGanttba").data("ejGantt");
                            ganttObj._$ganttchartHelper.ejGanttChart("selectTaskbar", args.modifiedRecord);
                        }, 100);
                    else {

                        $scope.doActionCompleteSave = true;

                    }


                }

                //console.log(args);
                //renderTasks();
                // renderLables();
                // renderLables();
            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                //poosk
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "dd-MMM-yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.Auto,
                timescaleStartDateMode: ej.Gantt.TimescaleRoundMode.Auto,
                timescaleUnitSize: _scale + "%"
            },

            taskbarTemplate: "#taskbarTemplateLightNew",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
            // stripLines: [{ day: (new Date($scope.datefrom)).yyyymmddtime(false), lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
            //  stripLines: [{ day: dtstr, lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
        });

    }
    catch(eee){
        alert(eee);
    }
    };




    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });


    $scope.linkedTimer = null;
    $scope.linkedTimerDone = false;
    $scope.StartLinkedTimer = function () {
        $scope.linkedTimer = setTimeout(function () {
            if (!$scope.linkedTimerDone) {
                // console.log('linked timer');
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



                    $scope.linkedTimerDone = true;
                }

                $scope.StartLinkedTimer();
            }
            else
                $scope.StopLinkedTimer();

        }, 50);
    };
    $scope.StopLinkedTimer = function () {
        if ($scope.linkedTimer)
            clearTimeout($scope.linkedTimer);
    };



    $scope.wtimer = null;

    $scope.StartWTimer = function () {
        $scope.wtimer = setTimeout(function () {
            var dif = Number(subtractDates(new Date(Date.now()), $scope.weatherUpdateTime)).toFixed(0);

            $scope.$apply(function () {
                $scope.weatherUpdateTimePassed = dif;

            });
            $scope.StartWTimer();
        }, 10000);
    };
    $scope.StopWTimer = function () {
        if ($scope.wtimer)
            clearTimeout($scope.wtimer);
    };

    $scope.getAirportWeather = function () {
        $scope.weatherUpdateTimePassed = 0;
        $scope.StopWTimer();
        $scope.AirportWeatherVisible = false;
        weatherService.getCurrentHourly($scope.airportEntity.Latitude, $scope.airportEntity.Longitude).then(function (response) {
            $scope.weatherUpdateTime = new Date(Date.now());
            $scope.AirportWeather = response;
            $scope.prepareWeather($scope.AirportWeather);
            $scope.StartWTimer();
            $scope.AirportWeatherVisible = true;

        }, function (err) { General.ShowNotify(err.message, 'error'); });

        /////////////////////////////
        //$scope.weatherUpdateTime = new Date(Date.now());

        //$scope.AirportWeatherVisible = true;
        //var fw = JSON.parse(Flight.Weather3);
        //$scope.AirportWeather = fw;
        //$scope.prepareWeather($scope.AirportWeather);
        //$scope.StartWTimer();
        /////////////////////////////
    };
    $scope.updateWeather = function () {
        $scope.getAirportWeather();
    };

    ////////////////////////////////////////
    //atinote
    /////////////////////////////////////
     
    $scope.dsNotificationType = [
        { Id: 10010, Title: 'Pickup Time Notification' },
        { Id: 10011, Title: 'New Pickup Time Notification' },
         { Id: 10012, Title: 'Pickup Stand by Notification' },
          { Id: 10013, Title: 'اعلام تاخیر' },
    ];

    //goh10
    $scope.transportTime = null;
    $scope.time_transportTime = {
        type: "time",
        width: '100%',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged:function(e){
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
                    $scope.Notify.Message = "Dear Flt.Crew : Your pickup time for Flt " + $scope.flight.FlightNumber + " is " + "#Time"/*moment(new Date($scope.transportTime)).format('HH:mm')*/ + " . Transport";
                break;
            case 10011:
                if ($scope.transportTime)
                $scope.Notify.Message = "Dear Flt.Crew : Your new pickup time for Flt " + $scope.flight.FlightNumber + " is " + "#Time"/*moment(new Date($scope.transportTime)).format('HH:mm')*/ + " . Transport";
                break;
            case 10012:

                $scope.Notify.Message = "Dear Flt.Crew : Your Flt " + $scope.flight.FlightNumber + " is Stand By . Transport";
                break;
            case 10013:

                $scope.Notify.Message = "با سلام و احترام، به استحضار می رساند پرواز شماره (" + $scope.flight.FlightNumber + ") به مقصد ("+$scope.flight.ToAirportIATA+")  تا اطلاع بعدی تاخیر دارد لطفاً تا دریافت تایم جدید تامل فرمایید . با تشکر واحد ترانسپورت";
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
        onValueChanged:function(e){
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
        width: 1100,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check', validationGroup: 'notmessage', onClick: function (e) {
                         
                        var result = e.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (!$scope.recs || $scope.recs.length == 0)
                        {
                            General.ShowNotify("Please select flight crews.", 'error');
                            return;
                        }
                        //bani
                        $scope.Notify.ObjectId = -1;
                        $scope.Notify.Message = $scope.Notify.Message.replace(/\r?\n/g, '<br />');
                        var temp = Enumerable.From($scope.recs).Select('{EmployeeId:$.CrewId,Name:$.Name,RP:$.RP,FDPItemId:$.FDPItemId}').ToArray();
                        $.each(temp, function (_i, _d) {
                            $scope.Notify.Employees.push(_d.EmployeeId);
                            $scope.Notify.Names.push(_d.Name);
                            $scope.Notify.Dates.push(_d.RP);
                            $scope.Notify.FDPs.push(_d.FDPItemId);
                        });
                        console.log($scope.Notify);
                        //$scope.Notify.TypeId = $scope.selectedNotificationTypeId;
                        //$scope.Notify.Employees=  Enumerable.From($scope.selectedEmployees).Select('$.EmployeeId').ToArray();
                        $scope.loadingVisible = true;
                        notificationService.notify2($scope.Notify).then(function (response) {

                            $scope.loadingVisible = false;


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.Notify = {
                                ModuleId: $rootScope.moduleId,
                                TypeId: 10010,

                                SMS: true,
                                Email: true,
                                App: true,
                                Message: null,
                                CustomerId: Config.CustomerId,
                                SenderId: null,
                                Employees: [],
                                Dates:[],
                                Names: [],
                                FDPs:[],
                            };


                            $scope.popup_notify_visible = false;




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
            var ds = Enumerable.From($scope.dg_crew_abs_ds).ToArray();
            console.log('var ds = Enumerable.From($scope.dg_crew_abs_ds).ToArray();');
            console.log(ds);
            $scope.dg_emp_ds = ds;

            if ($scope.flightOffBlock2)
                $scope.transportTime = new Date($scope.flightOffBlock2);
            else
                $scope.transportTime = new Date($scope.flight.STD);
           // $.each(ds, function (_i, _d) {
              //  _d.RP = $scope.transportTime;
           // });
            $scope.selectedNotificationTypeId = 10010;
           // $scope.bindEmployees();
        },
        onHiding: function () {

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
                Dates:[],
                Names: [],
                FDPs: [],
            };
            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',

        }
    };

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
        readOnly:true,
        bindingOptions: {
            value: 'Notify.Message',

        }
    };

    $scope.dg_emp_columns = [

          { dataField: 'JobGroup', caption: 'Pos', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
            { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
          //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
          {
              dataField: 'RP', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 200, editorOptions: {
                  type: "time"
              }, format: "HH:mm"
          },
         // { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

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
        text: 'J/L',
        type: 'default',
        
        width: '100%',
         
        onClick: function (e) {
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];

            flightService.getLeg($scope.flight.ID).then(function (leg) {
                $scope.jlogEntity = {
                    OffBlock:leg.JLOffBlock?leg.JLOffBlock: leg.ChocksOut,
                    OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                    TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                    Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                    PFLR: leg.PFLR,
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
        BLOCKTIME:null,
    };
    $scope.jl_flighttime = {
        readOnly:true,
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
    $scope.sb_jlpflr = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 0, Title: 'Left' }, { Id: 1, Title: 'Right' }],
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
        onValueChanged:function(e){
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
              + ((hh > 9 ? '' : '0') + hh) + "" + ((mi > 9 ? '' : '0') + mi)  ;
             
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
        width: 500,
        height: 500, 
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
                            Id:$scope.flight.ID,
                            OffBlock: !$scope.jlogEntity.OffBlock ?'':(new Date($scope.jlogEntity.OffBlock)).yyyymmddtimestring(),
                            OnBlock: !$scope.jlogEntity.OnBlock ? '' : (new Date($scope.jlogEntity.OnBlock)).yyyymmddtimestring(),
                            TakeOff: !$scope.jlogEntity.TakeOff ? '' : (new Date($scope.jlogEntity.TakeOff)).yyyymmddtimestring(),
                            Landing: !$scope.jlogEntity.Landing ? '' : (new Date($scope.jlogEntity.Landing)).yyyymmddtimestring(),
                            PFLR:!$scope.jlogEntity.PFLR?-1: $scope.jlogEntity.PFLR,
                        };
                        //alert((new Date($scope.jlogEntity.OffBlock)).yyyymmddtimestring());

                        
                        $scope.loadingVisible = true;
                        flightService.saveJLog(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                           
                            $scope.loadingVisible = false;

                            $scope.popup_jlog_visible = false;
                          

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
        },
        onHiding: function () {

            $scope.jlogEntity = {
                OffBlock: null,
                OnBlock: null,
                TakeOff: null,
                Landing: null,
                PFLR: null,
                FLIGHTTIME: null,
                BLOCKTIME: null,
            };
            $scope.popup_jlog_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jlog_visible',

            title: 'popup_jlog_title',

        }
    };
    ////////////////////////////////////

    

    $scope.delayCodes = null;
    $scope.$on('$viewContentLoaded', function () {
        $scope.scroll2_height = $(window).height() - 266.5 + 87;
        $('.flightboard').fadeIn(400, function () {
            if ($scope.airport) {
                $scope.loadingVisible = true;
                flightService.getAirportByIATA($scope.airport).then(function (response) {
                    $scope.airportEntity = response;

                    $scope.airportEntity.Latitude2 = Number($scope.airportEntity.Latitude).toFixed(3);
                    $scope.airportEntity.Longitude2 = Number($scope.airportEntity.Longitude).toFixed(3);
                    $scope.airportEntity.LtLg = '(' + $scope.airportEntity.Latitude2 + ', ' + $scope.airportEntity.Longitude2 + ')';
                    $scope.loadingVisible = false;

                    // $scope.getAirportWeather();

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.airportEntity = null;
                // $scope.search();



                //  $scope.airportEntity.Latitude2 = null;
                // $scope.airportEntity.Longitude2 = null;
                // $scope.airportEntity.LtLg = null;
            }

            $scope.loadingVisible = true;
            flightService.getDelayCodes().then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {
                    _d.Title2 = _d.Code + ' ' + _d.Remark;

                });
                $scope.delayCodes = response;
                 
                setTimeout(function () {
                    $scope.StopUTimer();
                    $scope.BeginSearch();
                }, 700);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });


    });
    $scope.$on("$destroy", function (event) {
        $scope.StopUTimer();
        $scope.StopNowLineTimer();
        //$timeout.cancel(mytimeout);
    });
    $rootScope.$broadcast('FlightBoardLoaded', null);





}]);