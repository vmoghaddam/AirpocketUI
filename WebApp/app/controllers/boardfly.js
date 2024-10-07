'use strict';
app.controller('boardflyController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'flightBagService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, flightBagService, weatherService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    console.log($rootScope.userName.toLowerCase());
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
    if ($rootScope.userName.toLowerCase() == 'ops.rezabandehlou' || $rootScope.userName.toLowerCase() == 'demo')
        $scope.IsJLOG = true;
    $scope.IsPickup = $rootScope.userName.toLowerCase().startsWith('trans.') || $rootScope.userName.toLowerCase().startsWith('demo');
    $scope.IsCrewMobileVisible = $rootScope.userName.toLowerCase().startsWith('parv') || $rootScope.userName.toLowerCase().startsWith('ashrafi') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('razbani');
    $scope.IsSMSVisible = $rootScope.userName.toLowerCase().startsWith('razb') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('rafiei');
    $scope.IsNoCrewVisible = $rootScope.userName.toLowerCase().startsWith('ashrafi') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('razbani')
        || $rootScope.userName.toLowerCase().startsWith('razagh')
        || $rootScope.userName.toLowerCase().startsWith('jafari')
        || $rootScope.userName.toLowerCase().startsWith('lahooti')
        || $rootScope.userName.toLowerCase().startsWith('thrdispatch')
        || $rootScope.userName.toLowerCase().startsWith('gervehei')
        || $rootScope.userName.toLowerCase().startsWith('saraf')
        || $rootScope.userName.toLowerCase().startsWith('parv')
        ;
    $scope.IsCrewMobileVisible = $scope.IsNoCrewVisible;
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
    $scope.IsSave = $scope.IsEditable || $scope.IsStaion;
    //alert((new Date()).yyyymmddtime(false));

    //  return;
    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;

    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 150,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope._datefrom = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));


        },
        onHiding: function () {
            pd1.destroy();

            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };
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
        // if (!$scope.flight.Defuel)
        //    $scope.flight.Defuel = 230;
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
    $scope.showLogX = function (isApply) {

        //if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
        //    General.ShowNotify(Config.Text_NoFlightSelected, 'error');
        //    return;
        //}

        //$scope.flight = $scope.ati_selectedFlights[0];

        if (!$scope.logFlight.FuelUnitID)
            $scope.logFlight.FuelUnitID = 115;
        if (!$scope.logFlight.CargoUnitID)
            $scope.logFlight.CargoUnitID = 111;

        $scope.logFlight.STA2 = new Date($scope.logFlight.STA);
        $scope.logFlight.STD2 = new Date($scope.logFlight.STD);

        //$scope.calculateTotalPax();
        //kook
        //if (!$scope.logFlight.Defuel)
        //    $scope.logFlight.Defuel = 230;
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

        $scope.maxDepartureDate = General.getDayLastHour(new Date(new Date($scope.logFlight.STA).addDays(1)));

        $scope.minDepartureDate = General.getDayFirstHour(new Date(new Date($scope.logFlight.STA).addDays(-1)));

        if ($(window).width() < 1200)
            $scope.popup_departure_visible = true;
        else
            $scope.popup_log_visible = true;


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

        frameDoc.document.write("<div style='height:100%'><div style='text-align:center;margin-top:30px'>" + $rootScope.CustomerName + "</div><div style='text-align:center;margin-top:10px'>Flights</div><img style='margin-top:10px;height:75%'  src = '" + canvas.toDataURL() + "'/></div>");
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
        hint: 'Delete Flight',
        type: 'danger',
        icon: 'fas fa-eraser',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            $scope.ati_resid = $scope.ati_flight.RegisterID;


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



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            $scope.ati_resid = $scope.ati_flight.RegisterID;

            if ($scope.ati_flight.FlightPlanId) {

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
                $scope.time_ir_std_date = new Date($scope.ati_flight.STD);
                $scope.time_ir_std_time = new Date($scope.ati_flight.STD);
                $scope.time_ir_sta_date = new Date($scope.ati_flight.STD);
                $scope.time_ir_sta_time = new Date($scope.ati_flight.STA);
                //$scope.linkEntity.LinkedRemark = $scope.flight.LinkedRemark;
                $scope.doIrRoute = true;
                
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
    ///////////////////////////////////
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
        width: 150,
        type: 'default',
        text: 'Download',
        onClick: function (e) {
            $window.open(atcfiles + $scope.atcTXT, '_blank');
        },
        bindingOptions: {
            visible: 'isATCFile'
        }

    };
    $scope.popup_atc_visible = false;
    $scope.popup_atc_title = 'ATC';
    //X
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

            flightBagService.getATC($scope.ati_selectedFlights[0].ID).then(function (response) {
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


    //////////////////////////////////
    //// DOC



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


    //2023
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
            $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + $scope.fltdoc_url, '_blank');
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


    /////////////////////

    //////////////////////////////////
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
            //$scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;

            $scope.popup_creg_visible = true;



        }
    };
    $scope.IsNiraVisible = $rootScope.userName.toLowerCase() == 'razbani';
    $scope.btn_nira = {
        hint: 'Sync NIRA',
        type: 'default',
        text: 'Sync NIRA',
        width: '100%',

        onClick: function (e) {



            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
            $.each(flights, function (_i, _d) {

                flightService.syncNira(_d).then(function (response) {
                    console.log('NIRA', _d);
                    console.log('NIRA', response);



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });
            });
            //$scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;





        }
    };
    $scope.btn_cnl = {
        hint: 'Cancel Flight(s)',
        type: 'default',
        icon: 'fas fa-ban',
        width: '100%',

        onClick: function (e) {
            if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            //$scope.ati_flight =Enumerable.From($scope.ganttData.flights).Where('$.ID=='+ $scope.ati_selectedFlights[0].ID).FirstOrDefault();
            //$scope.ati_resid=$scope.ati_flight.RegisterID;

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
                $scope.jl.tel = $rootScope.CustomerPhone;
                $scope.jl.email = $rootScope.CustomerEmail;
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
                        sec.type = flight.FlightType ? flight.FlightType[0] : 'S';
                    }

                    $scope.jl.sectors.push(sec);
                }
                // var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                // var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
                console.log('cabin', cabin);
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
    //dooltala
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
                $scope.cl.tel = $rootScope.CustomerPhone;
                $scope.cl.email = $rootScope.CustomerEmail;


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
        dataSource: [{ Id: 1, Title: 'Civil Ramp' }],
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
    var getOffsetDate = function (dt, m) {
        return (new Date(dt)).addMinutes(m * getOffset(dt));
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
    $scope.remark_status = {
        bindingOptions: {
            value: 'logFlight.DepartureRemark',
            height: 'remark_status_height',
            readOnly: 'NotEditable'
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

            $scope.remark_status_height = 54;
            $scope.isTimeStatusVisible = false;
            $scope.isCancelReasonVisible = false;
            // $scope.isRampReasonVisible = false;
            // $scope.isRedirectReasonVisible = false;
            if (e.selectedItem.id == 4) {
                $scope.isCancelReasonVisible = true;
                $scope.remark_status_height = 54;
                $scope.isTimeStatusVisible = true;
                $scope.time_status_value = $scope.logFlight.CancelDate ? new Date($scope.logFlight.CancelDate) : new Date();
                if (!$scope.logFlight.CancelReasonId)
                    $scope.logFlight.CancelReasonId = 10004;
            }
            //ramp
            if (e.selectedItem.id == 9) {
                // $scope.isRampReasonVisible = true;
                $scope.remark_status_height = 54;
                $scope.isTimeStatusVisible = false;
                $scope.time_status_value = $scope.logFlight.RampDate ? new Date($scope.logFlight.RampDate) : new Date();
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


                            //magu

                            if ($scope.linkEntity.ID != -1) {
                                for (var key of Object.keys(response.flight)) {


                                    $scope.ati_flight[key] = response.flight[key];
                                    // console.log(key+'    '+response[key]+'     '+$scope.ati_flight[key]);
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
            $scope.sms_nira_nsf = true;
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
                        var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var entity = {


                            userId: $rootScope.userId,
                            userName: $rootScope.userName,
                            reason: -1,

                            fids: flights,


                        };
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
        dataSource: $scope.getRealMSNs(Config.CustomerId),
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {

        },
        bindingOptions: {
            value: 'creg_msn',

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

                        var flights = Enumerable.From($scope.ati_selectedFlights).Select('$.ID').ToArray();
                        var entity = {

                            NewRegisterId: $scope.creg_msn,
                            UserId: $rootScope.userId,
                            UserName: $rootScope.userName,
                            ReasonId: -1,
                            Remark: $scope.creg_remark,
                            Flights: flights,
                            From: (new Date()).toUTCDateTimeDigits(),
                            To: (new Date()).toUTCDateTimeDigits(),

                        };
                        $scope.loadingVisible = true;
                        flightService.saveFlightRegisterChange2(entity).then(function (response) {
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

                            $scope.popup_creg_visible = false;

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


        },
        onHiding: function () {


            $scope.popup_creg_visible = false;

        },
        bindingOptions: {
            visible: 'popup_creg_visible',

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

    $scope.fillLog = function (entity) {
        if ($scope.timeBase == 'UTC')
            $scope.convertToLCL();
        if ($scope.logFlight.ChocksOut)
            entity.ChocksOut = (new Date($scope.logFlight.ChocksOut)).toUTCString();

        if ($scope.logFlight.Takeoff)
            entity.Takeoff = (new Date($scope.logFlight.Takeoff)).toUTCString();
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
            entity.Landing = (new Date($scope.logFlight.Landing)).toUTCString();
        if ($scope.logFlight.ChocksIn)
            entity.ChocksIn = (new Date($scope.logFlight.ChocksIn)).toUTCString();

        entity.BlockH = $scope.logFlight.BlockH;
        entity.BlockM = $scope.logFlight.BlockM;

        entity.GWLand = $scope.logFlight.GWLand;


        entity.FuelArrival = $scope.logFlight.FuelArrival;

        entity.ArrivalRemark = $scope.logFlight.ArrivalRemark;
        //$scope.flight.FlightStatusID == 9 || $scope.flight.FlightStatusID == 17 || $scope.flight.FlightStatusID == 4
        if ($scope.logFlight.FlightStatusID == 9) {
            $scope.logFlight.RampDate = (new Date($scope.time_status_value)).toUTCString();
            entity.RampDate = (new Date($scope.time_status_value)).toUTCString();
            entity.RampReasonId = $scope.logFlight.RampReasonId;
        }
        //aool
        // if ($scope.flight.FlightStatusID == 17) {
        if ($scope.logFlight.RedirectReasonId) {
            $scope.logFlight.RedirectDate = (new Date($scope.time_redirect_value)).toUTCString();
            entity.RedirectDate = (new Date($scope.time_redirect_value)).toUTCString();

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
            $scope.logFlight.CancelDate = (new Date($scope.time_status_value)).toUTCString();
            entity.CancelDate = (new Date($scope.time_status_value)).toUTCString();
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
            $scope.IsSave = $scope.IsEditable || $scope.IsStaion;
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
                                //doolzad
                                if ($scope.IsPickup)
                                    $scope.popup_cltrans_visible = true;
                                else
                                    $scope.popup_cl_visible = true;
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
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbaclog', bindingOptions: { disabled: 'IsApproved' }, visible: true, onClick: function (arg) {


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




                        //gabi

                        $scope.fillDto(dto);
                        $scope.fillLog(dto);

                        dto.NightTime = $scope.logFlight.NightTime;
                        dto.JLBLHH = $scope.logFlight.JLBLHH;
                        dto.SendDelaySMS = $scope.sms_delay ? 1 : 0;
                        dto.SendCancelSMS = $scope.sms_cancel ? 1 : 0;
                        dto.SendNiraSMS = $scope.sms_nira ? 1 : 0;



                        $scope.loadingVisible = true;
                        flightService.saveFlightLog(dto).then(function (response) {
                            //doolkala
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



                            $scope.getBoardSummary($scope.selectedDate);
                            // $scope.before_refreshed_flight = null;
                            $scope.loadingVisible = false;
                            $scope.sms_delay = false;
                            $scope.sms_cancel = false;
                            $scope.sms_nira = false;
                            //razbani
                            flightService.notifyDelay2($scope.ati_flight.ID).then(function (response) {


                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                            ///////////////////////
                            ///////////////////////
                            //2021-06-28 2021-06-29 MVT
                            //UserName
                            flightService.sendCaoMVT($scope.ati_flight.ID);
                            //flightService.sendMVT($scope.ati_flight.ID, dto.UserName).then(function (response) {


                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                            //////////////////////////
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
            //sepehr
            //if ($scope.logFlight.ChocksOut)
            //    $scope.flightOffBlock2 = $scope.logFlight.ChocksOut;
            //if (!$scope.flightOffBlock2) {

            //    $scope.flightOffBlock2 = $scope.logFlight.STD;
            //}



            //$scope.flightTakeOff2 = $scope.logFlight.Takeoff;
            //if (!$scope.flightTakeOff2)
            //    $scope.flightTakeOff2 = $scope.logFlight.STD;
            //$scope.flightOnBlock2 = $scope.logFlight.ChocksIn;
            //if (!$scope.flightOnBlock2)
            //    $scope.flightOnBlock2 = $scope.logFlight.STA;


            //$scope.flightLanding2 = $scope.logFlight.Landing;
            //if (!$scope.flightLanding2)
            //    $scope.flightLanding2 = $scope.logFlight.STA;



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
            'toolbarItems[6].visible': 'IsSave',

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
    $scope.dg_crew_abs_columns = [
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
        height: 234,

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

        if (!$rootScope.HasAccessToCrewList()) {
            $scope.dg_crew_abs_ds = [];
            return;
        }
        var archived_crews = 0;
        if (new Date($scope.logFlight.Date) < new Date(2020, 6, 1, 0, 0, 0, 0))
            archived_crews = 1;
        archived_crews = 0;

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


                        printElem($('#jl'));

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

    $scope.popup_cledit_visible = false;
    $scope.popup_cledit_title = 'Crew List';
    $scope.popup_cledit = {
        shading: true,
        width: 700,
        height: 700,
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


            $scope.popup_cledit_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cledit_visible',

            title: 'popup_cledit_title',


        }
    };

    $scope.dg_cledit_columns = [

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: true, },
        { dataField: 'Position', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 75, },
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
            dataSource: 'cl.crews',

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
                            //bani
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
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


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
                            //bani
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
                            //bani
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
                    flightService.getViewCrew(Config.CustomerId).then(function (response) {

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
                        PFLR: leg.PFLR,
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
                            PFLR: !$scope.jlogEntity.PFLR ? -1 : $scope.jlogEntity.PFLR,
                            FuelUnitID: $scope.jlogEntity.FuelUnitID,
                            UsedFuel: $scope.jlogEntity.UsedFuel,
                            FuelArrival: $scope.jlogEntity.FuelArrival,
                            FuelDeparture: $scope.jlogEntity.FuelDeparture,
                            UsedFuel: $scope.jlogEntity.UsedFuel,

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
    var stopped;
    //$scope.countdown = function () {
    //    //var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
    //    //var nowleft = (_left * (hourWidth + 1));
    //    //var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
    //    //var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
    //    stopped = $timeout(function () {

    //        var time = moment(new Date()).format('HH:mm');
    //        var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
    //        var nowleft = (_left * (hourWidth + 1)) - 1;
    //        $('.now-line').css('left', nowleft + 'px');
    //        $('#nowTime').css('left', (nowleft + 5) + 'px');
    //        $('#nowTime').html(time);

    //        $scope.countdown();

    //    }, 10000);
    //};
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
    //$scope.getDep = function (flt) {
    //    if (flt.ChocksOut)
    //        return moment(flt.ChocksOut).format('HHmm');
    //    else
    //        return moment(flt.STD).format('HHmm');
    //};
    //$scope.getArr = function (flt) {

    //    if (flt.ChocksIn)
    //        return moment(flt.ChocksIn).format('HHmm');
    //    else
    //        return moment(flt.STA).format('HHmm');
    //};
    $scope.getDep = function (flt) {

        var dt = flt.ChocksOut;
        if (flt.ChocksOut)
            dt = flt.ChocksOut;
        else
            dt = flt.STD;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            dt = (new Date(dt)).addMinutes(offset)
        }
        if ($scope.timeType == 2) {
            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            offset += flt.GWLand;
            dt = (new Date(dt)).addMinutes(offset)
        }
        return moment(dt).format('HHmm');
    };
    $scope.getArr = function (flt) {
        var dt = flt.ChocksIn;
        if (flt.ChocksIn)
            dt = flt.ChocksIn;
        else
            dt = flt.STA;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            dt = (new Date(dt)).addMinutes(offset)
        }
        if ($scope.timeType == 2) {

            var offset = getOffset(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0, 0));
            offset += flt.GWTO;
            dt = (new Date(dt)).addMinutes(offset)
        }
        return moment(dt).format('HHmm');
    };
    $scope.getFlightClass = function (flt) {
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

    //fjk
    $scope.timeType = 0;
    $scope.getFlightStyle = function (f, index, res) {

        /*var style = {};
        style.width = $scope.getFlightWidth(f);
        
        var left = $scope.getDuration(new Date($scope.datefrom),  new Date(f.STD));
        if (new Date(f.STD)<new Date($scope.datefrom))
            left=-1*left;
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;
        if (f.FlightStatusID==4)
            top+=30;
        

        style.top = top + 'px';
        return style;*/
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
        if (stdOffset < datefromOffset)
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
                    str = reg.charAt(reg.length - 1);

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
            $scope.timeTypeChanged();
        },
        bindingOptions: {
            value: 'timeType',

        }
    };
    //$scope.createGantt = function () {
    //    if ($(window).width() < 1200) {
    //        $('.large-gantt').remove();
    //        hourWidth = 69;
    //    }
    //    else
    //        $('.small-gantt').remove();
    //    $scope.nextDay = 0;
    //    var lastDay = (new Date($scope.dateEnd)).getDate();
    //    // alert(lastDay);
    //    var nxtdy = Enumerable.From($scope.ganttData.flights).Where(function (x) {

    //        return x.ChocksOut.getDate() > lastDay || x.Takeoff.getDate() > lastDay || x.Landing.getDate() > lastDay || x.ChocksIn.getDate() > lastDay || x.STA.getDate() > lastDay;
    //    }).ToArray();
    //    if (nxtdy && nxtdy.length > 0)
    //        $scope.nextDay = 1;



    //    var $timeBar = $('.header-time');
    //    var $dayBar = $('.header-date');
    //    var $flightArea = $('.flights');
    //    $timeBar.empty();
    //    $dayBar.empty();
    //    //$flightArea.empty();
    //    $('.reg-row').remove();
    //    $('.hour-line').remove();
    //    $('.halfhour-line').remove();
    //    $('.mid-line').remove();
    //    $('.now-line').remove();
    //    $('#nowTime').remove();
    //    $('.flights').height(0);


    //    $('.flights').off('scroll');
    //    var c = 1;
    //    var cf = 0.5;
    //    $scope.preDay = 0;
    //    var days_count = $scope.days_count + $scope.nextDay;
    //    var tempDate = (new Date(dfrom)).addDays(-1 * $scope.preDay);
    //    days_count = days_count + $scope.preDay;


    //    for (var i = 1; i <= days_count; i++) {
    //        for (var j = 0; j < 24; j++) {
    //            var offset = getOffset(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0));
    //            var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(offset);


    //            var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "<span class='second-time'>" + moment(secondDate).format('HHmm') + "</span></div>";
    //            $timeBar.append(hourElem);
    //            if (c < 24 * days_count) {
    //                var hleft = c * (hourWidth + 1) - 0.8;
    //                var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
    //                $flightArea.append(hline);

    //                var hleft2 = (cf) * (hourWidth + 1) - 0.8;
    //                var hline2 = "<div class='halfhour-line' style='top:0px;left:" + hleft2 + "px'></div>";
    //                $flightArea.append(hline2);
    //            }
    //            cf = cf + 1;
    //            c++;
    //        }

    //        var tbl = "<table style='padding:0;width:95%'><tr>"
    //            + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
    //            + ($(window).width() < 1200 ? "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>" : "")
    //            + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
    //            + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"

    //            + "</tr></table>"
    //        var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + tbl + "</div>";
    //        $dayBar.append(dayElem);

    //        if (i < days_count) {
    //            var midleft = i * 24 * (hourWidth + 1) - 1;
    //            var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
    //            $flightArea.append(midline);
    //        }


    //        tempDate = tempDate.addDays(1);
    //    }
    //    if ($scope.IsNowLine) {
    //        var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
    //        var nowleft = (_left * (hourWidth + 1));
    //        var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
    //        var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
    //        $flightArea.append(nowline);
    //        $flightArea.append(nowTime);
    //    }
    //    $dayBar.append("<div style='clear:both'></div>");
    //    $timeBar.append("<div style='clear:both'></div>");
    //    $('.timeline').width((hourWidth + 1) * days_count * 24);
    //    $('.flights').width((hourWidth + 1) * days_count * 24);


    //};
    $scope.createGantt = function () {
        if ($(window).width() < 1200) {
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
                + ($(window).width() < 1200 ? "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>" : "")
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

            j = j + 50;
        }
    }
    $scope.modifyFlightTimes = function (flt, utc) {
        //$scope.dateEnd

        var m = -1;

        flt.STD = moment(flt.STD);
        flt.STA = moment(flt.STA);


        if (flt.ChocksIn)
            flt.ChocksIn = moment(flt.ChocksIn);
        if (flt.ChocksOut)
            flt.ChocksOut = moment(flt.ChocksOut);

        flt.ChocksOut = getOffsetDate(flt.ChocksOut, m);
        flt.ChocksIn = getOffsetDate(flt.ChocksIn, m);
        flt.Takeoff = getOffsetDate(flt.Takeoff, m);
        flt.Landing = getOffsetDate(flt.Landing, m);
        flt.STA = getOffsetDate(flt.STA, m);
        flt.STD = getOffsetDate(flt.STD, m);
        flt.STA2 = getOffsetDate(flt.STA2, m);
        flt.STD2 = getOffsetDate(flt.STD2, m);
        if (flt.CancelDate)
            flt.CancelDate = getOffsetDate(flt.CancelDate, m);
        if (flt.RampDate)
            flt.RampDate = getOffsetDate(flt.RampDate, m);
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
        flightService.getFlightsGanttUTC(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, /*offset*/0, null, 1, filter).then(function (response) {
            try {

                $scope.baseDate = (new Date(response.baseDate)).toUTCString();
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

                    var flights = Enumerable.From(response.flights).Where('$.RegisterID==' + _d.resourceId)
                        .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                        .ToArray();
                    //if (_d.resourceId == 69)

                    console.log(flights);

                    $.each(flights, function (_j, _q) {

                        _q.GWLand = 270;
                        _q.GWTO = 270;
                        if (_q.FromAirportIATA == 'NJF')
                            _q.GWLand = 180;
                        if (_q.ToAirportIATA == 'NJF')
                            _q.GWTO = 180;
                        $scope.modifyFlightTimes(_q);


                    });
                    $scope.setTop(flights);
                    _d.maxTop = Enumerable.From(flights).Select('Number($.top)').Max();
                    $scope.totalHeight += _d.maxTop;
                    _d.flights = flights;
                });
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
        //tooki
        $scope.utimer = setTimeout(function () {
            //'info' | 'warning' | 'error' | 'success' | 'custom'


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
                console.log('===== BASE DATE =====================');
                console.log($scope.baseDate);

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
    $scope.flightSingleClickedMain = function (flt) {
        // alert('x');
        $scope.ati_flight = flt;
        console.log($scope.ati_flight);

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
        if ($(window).width() < 1200)
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
                $('.gantt-main-container').height($(window).height() - 145 - $scope.absHeight);
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
    //2020-10-27 1
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
    $scope.addCrew = function () {
        $scope.popup_nocrew_visible = true;
    };
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

                        var exist = Enumerable.From($scope.dg_crew_abs_ds).Where('$.CrewId==' + $scope.dg_nocrew_selected.Id).FirstOrDefault();
                        if (exist) {
                            General.ShowNotify('The selected employee already assigned', 'error');
                            return;
                        }


                        var entity = { userId: $scope.dg_nocrew_selected.Id, code: $scope.dg_nocrew_selected.JobGroupCode, flightId: $scope.flight.ID };
                        $scope.loadingVisible = true;
                        flightService.saveNoCrewFDP(entity).then(function (response) {
                            $scope.loadingVisible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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
            $scope.getCrewAbs($scope.logFlight.ID);
            $scope.popup_nocrew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_nocrew_visible',

            title: 'popup_nocrew_title',

        }
    };

    //////////////////////////////////////
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
    ////////////10-12 excel////////////
    $scope.IsFileUploaderVisible = $rootScope.userName.toLowerCase().startsWith('ashrafi') || $rootScope.userName.toLowerCase().startsWith('rahimi') || $rootScope.userName.toLowerCase().startsWith('razbani');

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
        uploadUrl: "https://fleet.flypersia.aero/apixls/api/uploadfile",
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            console.log('upload message', e.request.responseText);
            if (e.request.responseText) {
                //alert(e.request.responseText);
                var _fn = e.request.responseText.split('.')[0];
                _fn = _fn.replace('"', '').replace("'", "");

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
    ///////////////////////
    //////////////////////////////////////
    $scope.IsGNTVisible = false;
    $scope.delayCodes = null;
    $scope.$on('$viewContentLoaded', function () {
        $scope.scroll_dep_height = $(window).height() - 195;
        $scope.scroll2_height = $(window).height() - 266.5 + 87;
        $('.right-col-bottom').height(188);
        $('.right-col').height($(window).height() - 408);
        $('.board').fadeIn(400, function () {


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
        $scope.refreshHeights();

        if ($(window).width() >= 1200)
            $('.gantt-main-container').height($(window).height() - 155 - $scope.absHeight);
        else
            $('.gantt-main-container').height($(window).height() - 145);
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



}]);