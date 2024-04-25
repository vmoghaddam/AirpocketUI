'use strict';
app.controller('flightBoardAllController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.airport = $routeParams.airport;
    $scope.airportEntity = null;
    $scope.filterVisible = false;
    $scope.IsDispatch = $route.current.isDispatch;
    $scope.IsDepartureVisible = false;
    $scope.IsArrivalVisible = false;
    $scope.IsDepartureDisabled = true;
    $scope.IsArrivalDisabled = true;
    $scope.IsAdmin = $routeParams.admin == 1;


    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');

                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');

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
        width: '120',
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
        text: 'Departure',
        type: 'default',
        icon: 'fas fa-plane-departure',
        width: '120',
        bindingOptions: {
            disabled: 'IsDepartureDisabled'
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
    $scope.btn_arr = {
        text: 'Arrival',
        type: 'default',
        icon: 'fas fa-plane-arrival',
        width: '120',
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
        width: '120',
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
        width: '120',
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
        width: '120',
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
        width: '100',
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


    $scope.btn_delay = {
        text: 'Delays',
        type: 'default',
        icon: 'clock',
        width: '110',
        bindingOptions: {
            //disabled: 'IsDepartureDisabled'
        },
        onClick: function (e) {

            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }

            $scope.flight = $scope.selectedFlights[0];
            $scope.popup_delay_visible = true;




        }

    };

    $scope.btn_pax = {
        text: 'Pax',
        type: 'default',
        icon: 'fas fa-user-tag',
        width: '100',
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
            console.log($scope.flight);
            $scope.calculateTotalPax();

            $scope.popup_pax_visible = true;




        }

    };
    $scope.btn_cargo = {
        text: 'Cargo',
        type: 'default',
        icon: 'fas fa-boxes',
        width: '110',
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
        width: '110',
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
        width: '110',
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
            console.log($scope.flight);
            $scope.fuelArrSaved = false;

            $scope.popup_fuelarr_visible = true;




        }

    };

    $scope.IsCancelVisible = false;
    $scope.IsRampVisible = false;
    $scope.btn_cancel = {
        text: 'Cancel',
        type: 'danger',
        icon: 'fas fa-ban',
        width: '120',
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
    $scope.btn_ramp = {
        text: 'Ramp',
        type: 'danger',
        icon: 'fas fa-long-arrow-alt-left',
        width: '100',
        bindingOptions: {
           // visible:'IsRampVisible'
        },
        onClick: function (e) {


            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            
            $scope.flight = $scope.selectedFlights[0];
            
            $scope.entity_ramp.RampDate = new Date($scope.flight.STD);
            $scope.flightRamp = $scope.entity_ramp.RampDate;
            $scope.popup_ramp_visible = true;




        }

    };


    $scope.IsRedirectVisible = false;
    $scope.btn_redirect = {
        text: 'Redirect',
        type: 'danger',
        icon: 'fas fa-random',
        width: '120',
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
        // var statusItem = Enumerable.From(Flight.statusDataSource).Where('$.id==' + status).FirstOrDefault();
        $scope.totalFlights = $scope.dataSource.length;
        $scope.departedFlights = Enumerable.From($scope.dataSource).Where('$.Takeoff && $.FromAirport==' + $scope.airportEntity.Id).ToArray().length;
        $scope.arrivedFlights = Enumerable.From($scope.dataSource).Where('$.Landing && $.ToAirport==' + $scope.airportEntity.Id).ToArray().length;
        $scope.canceledFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==4').ToArray().length;
        $scope.redirectedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID==17').ToArray().length;
        $scope.divertedFlights = Enumerable.From($scope.dataSource).Where('$.FlightStatusID== 7').ToArray().length;
        $scope.totalDelays = Enumerable.From($scope.dataSource).Where('$.FromAirport==' + $scope.airportEntity.Id + ' && $.ChocksOut').Select('$.delay').Sum();
        $scope.departedPax = Enumerable.From($scope.dataSource).Where('$.Takeoff && $.FromAirport==' + $scope.airportEntity.Id).Select('$.TotalPax').Sum();
        $scope.arrivedPax = Enumerable.From($scope.dataSource).Where('$.Landing && $.ToAirport==' + $scope.airportEntity.Id).Select('$.TotalPax').Sum();

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
    $scope.footerfilter = false;
    $scope.searched = false;
    $scope.bindFlights = function (saveState) {
        var xs = 0;
        if (saveState) {
            try {
               xs=($('.e-ganttviewerbodyContianer').data("ejScroller").scrollLeft());
            }
            catch (ex) {
                //exc
            }
        }
        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo
        };
        $scope.hideButtons2();
        $scope.selectedFlights = [];
        $scope.dg_flights_instance.deselectAll();
        var offset = -1 * (new Date()).getTimezoneOffset();
        //xati
        $scope.loadingVisible = true;
        flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), (new Date($scope.dateto)).toUTCDateTimeDigits(), offset, ($scope.IsAdmin ? null : $scope.airportEntity.Id), filter).then(function (response) {
            $scope.loadingVisible = false;
            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            console.log('===========');
            console.log(response.flights);
            $scope.dataSource = Flight.proccessDataSource(response.flights);
            console.log($scope.dataSource);
            Flight.activeDatasource = $scope.dataSource;
            $scope.dg_flights_ds = $scope.dataSource;
            $scope.calculateSummary();

            $scope.createGantt();
            //  if ($scope.dataSource.length > 0)
            //    $scope.scrollGantt($scope.dataSource[0]);
            //kooks
            if (saveState) {
                $scope.scrollGanttX(xs);
            }
           //  else
            //    $scope.scrollGanttNow();

            var nw = new Date();
            var nf = new Date($scope.datefrom);
            var nt = new Date($scope.dateto);
            if (nw.getTime() >= nf.getTime() && nw.getTime() <= nt.getTime()) {

                $scope.scrollGanttNow();
            }


            $scope.footerfilter = true;
            $scope.searched = true;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.baseDate = null;
    $scope.btn_search = {
        text: '',
        type: 'success',
        icon: 'search',
        width: '35',

        bindingOptions: {},
        onClick: function (e) {
           
            $scope.StopNowLineTimer();
            $scope.updatedFlightsCount = 0;
            $scope.updatedFlights = [];
            $scope.bindFlights(false);
        }

    };
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
        data.FuelUnit = newData.FuelUnit;
        data.DateStatus = newData.DateStatus;
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

    $scope.StartUTimer = function () {
        $scope.utimer = setTimeout(function () {
            //////////////////////////
            var dto = {
                from: (new Date($scope.datefrom)).toUTCString(),
                to: (new Date($scope.dateto)).toUTCString(),
                baseDate: $scope.baseDate,
                airport: $scope.airportEntity.Id,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                userid: $rootScope.userId

            };

            flightService.getUpdatedFlights(dto).then(function (response) {
                console.log(response);
                $scope.baseDate = (new Date(Date.now())).toUTCString();
                var ganttObj = $("#resourceGanttba").data("ejGantt");
                $.each(response, function (_i, _d) {
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


            }, function (err) { });

            /////////////////////////////
            $scope.StartUTimer();
        }, 1000 * 60);
    };
    $scope.StopUTimer = function () {
        if ($scope.utimer)
            clearTimeout($scope.utimer);
    };
    ///////////////////////////////////////////
    $scope.nowlinetimer = null;
    $scope.nowlinelastdate = new Date();
    $scope.IsUTC = false;

    $scope.StartNowLineTimer = function (interval) {

        $scope.nowlinetimer = setTimeout(function () {
            var dtstr = (new Date()).yyyymmddtimenow($scope.IsUTC);
            var ganttObj = $("#resourceGanttba").data("ejGantt");
            //  stripLines: [{ day: "6/5/2019  03:00:00 AM", lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
            ganttObj.setModel2({ "stripLines": [{ day: dtstr, lineWidth: "2", lineColor: "ORange", lineStyle: "solid" }] }, null, function () {

            });
            /////////////////////////////
            $scope.nowlinelastdate = (new Date());
            var nowtime = $('#stripline0');
            var html = "<div style='font-size:11px;font-weight:bold;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow(true) + "</div>";
            if ($scope.IsUTC)
                html = "<div style='font-size:11px;font-weight:bold;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow() + "</div>" + "<div style='font-size:11px;padding-left:2px;'>" + $scope.nowlinelastdate.hhmmnow(true) + "</div>";
            nowtime.html(html);
            // console.log((new Date()).hhmmnow());
            ////////////////////////////
            //oosk
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
    /////////////////////////////////////////////
    $scope.autoUpdate = false;

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
                airport: $scope.airportEntity.Id,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                userid: $rootScope.userId

            };
            $scope.loadingVisible = true;
            flightService.getUpdatedFlights(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.baseDate = (new Date(Date.now())).toUTCString();
                var ganttObj = $("#resourceGanttba").data("ejGantt");
                $.each(response, function (_i, _d) {
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




    $scope.btn_test = {
        text: 'test',
        type: 'success',
        icon: 'search',
        width: '100%',

        bindingOptions: {},
        onClick: function (e) {
            var $task = $('#task-4908');

            console.log($task.length);
        }

    };
    $scope.datefrom = General.getDayFirstHour(new Date(Date.now() /*'2019-02-20'*/));
    $scope.date_from = {
        type: "datetime",
        displayFormat: "yyyy-MM-dd HH:mm",
        width: '95%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            if (arg.value) {
                var d = new Date(arg.value);

            }

        },
        bindingOptions: {
            value: 'datefrom',

        }
    };
    $scope.dateto = General.getDayLastHour(new Date(Date.now())); //General.getDayLastHour(new Date(new Date(Date.now()).addDays(1)));
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

    $scope.flightTakeOff2 = null;

    $scope.time_takeoff2 = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightTakeOff2',
            min: 'flight.baseStartDate',
            readOnly: 'depReadOnly'
        }
    };


    $scope.flightOffBlock = null;
    $scope.time_offblock = {
        type: "datetime",
        width: '100%',
        interval: 5,
        bindingOptions: {
            value: 'flightOffBlock',
           // min: 'flight.baseStartDate',
        }
    };
    $scope.depReadOnly = true;
    $scope.flightOffBlock2 = null;
    $scope.time_offblock2 = {
        type: "datetime",
        width: '100%',
        interval: 5,
        bindingOptions: {
            value: 'flightOffBlock2',
            // min: 'flight.baseStartDate',
            readOnly: 'depReadOnly'
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
        type: "datetime",
        width: '100%',
        interval: 5,
        bindingOptions: {
            value: 'flightOnBlock2',
            min: 'flight.STA',
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
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightLanding2',
            // min: 'flight.STA',

        }
    };


    $scope.flightRamp = null;
    $scope.landingReadOnly = false;
    $scope.time_ramp = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'flightRamp',
           // min: 'flight.STA',
           // readOnly: 'landingReadOnly'
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
        if ($scope.flight.PaxInfant)
            sum += $scope.flight.PaxInfant;
        if ($scope.flight.TotalSeat && sum > $scope.flight.TotalSeat) {
            $scope.flight.PaxOver = sum - $scope.flight.TotalSeat;
        }
        else
            $scope.flight.PaxOver = 0;
        $scope.flight.TotalPax = sum;

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
    $scope.pax_adult = {
        readOnly: false,
        min: 0,
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
    $scope.entity_ramp = {
        UserId: null,
        FlightId: null,
        RampReasonId: null,
        RampRemark: null,
        RampDate: null,
    };
    $scope.clear_entity_ramp = function () {
        $scope.entity_ramp.UserId = null;
        $scope.entity_ramp.FlightId = null;
        $scope.entity_ramp.CancelReasonId = null;
        $scope.entity_ramp.CancelRemark = null;
        $scope.entity_ramp.CancelDate = null;
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

    $scope.sb_cancel_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity_cancel.CancelReasonId',

        }
    };

    $scope.sb_ramp_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity_ramp.RampReasonId',

        }
    };

     

    $scope.sb_redirect_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1147),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity_redirect.RedirectReasonId',

        }
    };
    $scope.time_redirect = {
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
    $scope.txt_ramp_remark = {
        bindingOptions: {
            value: 'entity_ramp.RampRemark',


        }
    };
    $scope.txt_redirect_remark = {
        bindingOptions: {
            value: 'entity_redirect.RedirectRemark',


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
        height: 531,
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacarr', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
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


    $scope.fillDto = function (entity) {
        entity.ID = $scope.flight.ID;
        entity.UserId = $rootScope.userId;
        entity.FlightStatusID = $scope.flight.FlightStatusID;

        entity.Delays = [];
        var delays = Enumerable.From($scope.flight.delays).Where("$.Selected==1").ToArray();
        $.each(delays, function (_i, _d) {
            entity.Delays.push({
                FlightId: $scope.flight.ID,
                DelayCodeId: _d.DelayCodeId,
                HH: _d.HH,
                MM: _d.MM,
                UserId: $rootScope.userId,
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacflight', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
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

            $scope.dg_instance.repaint();
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

        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150,   },
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

        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150,   },
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
    $scope.dg_delay_selected = null;
    $scope.dg_delay_columns = [

        
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
      //  { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, sortOrder: 'asc', sortIndex: 0 },

        
        
        //  { dataField: 'HH', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 80 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 90, fixed: true, fixedPosition: 'right' },
        { dataField: 'MM', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 90, fixed: true, fixedPosition: 'right' },

        




    ];
    $scope.dg_delay_height = 100;

    $scope.dg_delay_instance = null;
    $scope.dg_delay_ds = null;
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
        height: 485,
        summary: {
            totalItems: [{
                column: "MM",
                summaryType: "sum"
            }]
        },

        bindingOptions: {
            dataSource: 'dg_delay_ds', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };


    $scope.popup_delay_visible = false;
    $scope.popup_delay_title = 'Delays';
    $scope.popup_delay = {
        shading: true,
        width: 1150,
        height: 600, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
        //hix

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check',   bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        var entity = {
                            ID: $scope.flight.ID,

                        };
                        entity.Delays = [];
                        var delays = Enumerable.From($scope.flight.delays).Where("$.Selected==1").ToArray();
                        var sum = 0;
                        $.each(delays, function (_i, _d) {
                            entity.Delays.push({
                                FlightId: $scope.flight.ID,
                                DelayCodeId: _d.DelayCodeId,
                                HH: _d.HH,
                                MM: _d.MM,
                                UserId: $rootScope.userId,
                            });
                            sum += _d.MM;
                        });
                        $scope.loadingVisible = true;
                        flightService.saveFlightDelays(entity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            //toosk
                            $scope.flight.EstimatedDelay = sum;
                            Flight.calculateEstimatedDelay($scope.flight);
                            ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.loadingVisible = false;

                            $scope.popup_delay_visible = false;
                             

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }


                }, toolbar: 'bottom'
            },
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
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'success', text: 'Notification', icon: 'fas fa-bell', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
            //            //takeoff save
            //            var result = arg.validationGroup.validate();

            //            if (!result.isValid) {
            //                General.ShowNotify(Config.Text_FillRequired, 'error');
            //                return;
            //            }


            //        }


            //    }, toolbar: 'bottom'
            //},

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_delay_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            if (!$scope.flight.delays) {
                $scope.loadingVisible = true;
                flightService.getFlightDelayCodes($scope.flight.ID).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.flight.delays = response;
                    $scope.dg_delay_ds = response;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                $scope.dg_delay_ds = $scope.flight.delays;
        },
        onHiding: function () {
            $scope.dg_delay_ds = [];

            $scope.popup_delay_visible = false;

        },
        bindingOptions: {
            visible: 'popup_delay_visible',

            title: 'popup_delay_title',

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
                        console.log('Before');
                        console.log(JSON.stringify( $scope.flight));
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

    $scope.popup_ramp_visible = false;
    $scope.popup_ramp_title = 'Ramp';
    $scope.popup_ramp = {
        shading: true,
        width: 360,
        height: '380', //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fbacramp', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.entity_ramp.Date = (new Date(Date.now())).toUTCString();
                        $scope.entity_ramp.RampDate = (new Date($scope.flightRamp)).toUTCString();
                        $scope.entity_ramp.UserId = $rootScope.userId;
                        $scope.entity_ramp.FlightId = $scope.flight.ID;

                        var ganttObj = $("#resourceGanttba").data("ejGantt");
                        //rampoosk
                        $scope.setStatus($scope.flight, 9);
                        $scope.loadingVisible = true;
                        flightService.saveFlightRamp($scope.entity_ramp).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.flight.RampDate = $scope.flightRamp;
                            ganttObj.updateRecordByTaskId($scope.flight);
                            $scope.showButtons2($scope.flight);

                            $scope.loadingVisible = false;

                            $scope.popup_ramp_visible = false;
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

            $scope.clear_entity_ramp();
            $scope.popup_ramp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_ramp_visible',

            title: 'popup_ramp_title',

        }
    };

    //close button
    $scope.popup_ramp.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_ramp_visible = false;

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
    $scope.getCrew = function (fid) {


        $scope.loadingVisible = true;
        flightService.getFlightCrew2(fid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getBoxFlights = function (bid) {

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


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.dg_crew_columns = [
        {
            fixed: true, fixedPosition: 'left',
            dataField: "ImageUrl",
            width: 85,
            alignment: 'center',
            caption: '',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value : 'imguser.png'), "css": { height: '50px', width: '50px', borderRadius: '100%' } }))
                    .appendTo(container);
            }
        },
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, fixed: true, fixedPosition: 'left' },
        { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        //{ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        // { dataField: 'AvStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Address', caption: 'Address', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        {
            dataField: "", caption: 'Passport',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsPassportExpired || !options.data.PassportNumber) { color = 'red'; icon = 'ion-md-alert'; }
                else if (options.data.IsPassportExpiring) {
                    color = 'orange'; icon = 'ion-md-alert';
                }


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);



            },

        },
        {
            dataField: "", caption: 'CAO',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsCAOExpired || !options.data.CaoCardNumber) { color = 'red'; icon = 'ion-md-alert'; }
                else if (options.data.IsCAOExpiring) {
                    color = 'orange'; icon = 'ion-md-alert';
                }


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);



            },

        },
        {
            dataField: "", caption: 'Medical',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsMedicalExpired == 1) { color = 'red'; icon = 'ion-md-alert'; }
                else if (options.data.IsMedicalExpiring) {
                    color = 'orange'; icon = 'ion-md-alert';
                }


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },
        {
            dataField: "PPLExpireStatus", caption: 'PPL',
            width: 60,
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                switch (options.value) {
                    case 1:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                    case 2:
                        color = 'orange';
                        icon = 'ion-md-alert';
                        break;
                    case 3:
                        color = 'green';
                        break;
                    default:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                }
                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);
            },

        },
        {
            dataField: "CPLExpireStatus", caption: 'CPL',
            width: 60,
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                switch (options.value) {
                    case 1:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                    case 2:
                        color = 'orange';
                        icon = 'ion-md-alert';
                        break;
                    case 3:
                        color = 'green';
                        break;
                    default:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                }
                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);
            },

        },
        {
            dataField: "ATPLExpireStatus", caption: 'ATPL',
            width: 60,
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                switch (options.value) {
                    case 1:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                    case 2:
                        color = 'orange';
                        icon = 'ion-md-alert';
                        break;
                    case 3:
                        color = 'green';
                        break;
                    default:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                }
                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);
            },

        },
        {
            dataField: "MCCExpireStatus", caption: 'MCC',
            width: 60,
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                switch (options.value) {
                    case 1:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                    case 2:
                        color = 'orange';
                        icon = 'ion-md-alert';
                        break;
                    case 3:
                        color = 'green';
                        break;
                    default:
                        color = 'red';
                        icon = 'ion-md-alert';
                        break;
                }
                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);
            },

        },


        { dataField: 'CurrentLocationAirporIATA', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
        { dataField: 'PassportNumber', caption: 'Passport No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DatePassportExpire', caption: 'Passport Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DateCaoCardExpire', caption: 'CAO Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        //{ dataField: 'Types', caption: 'Types', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left' },


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

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 320,// $(window).height() - 250,// 490 

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




        bindingOptions: {
            dataSource: 'dg_crew_ds',

        }
    };


    $scope.dg_boxflight_columns = [
        {
            caption: 'Flights', columns: [
                { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
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
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Make GD', icon: 'fas fa-file-excel', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                       
                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Transport', icon: 'fas fa-taxi', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Notification', icon: 'fas fa-bell', validationGroup: 'fbacredirect', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_crew_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.getCrew($scope.flight.ID);
            $scope.getBoxFlights($scope.flight.BoxId);
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
        var hours = (Flight.subtractDatesHours(df, dd) * ($('.e-schedule-day-headercell').width()-0)) - 50;
      
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

        $scope.$apply(function () {
            $scope.offBlockVisible = false;
            $scope.takeOffVisible = false;
            $scope.landingVisible = false;
            $scope.onBlockVisible = false;
            $scope.IsDepartureVisible = false;
            $scope.IsArrivalVisible = false;
            $scope.IsDepartureDisabled = true;
            $scope.IsArrivalDisabled = true;

            $scope.IsCancelVisible = false;

            $scope.IsRampVisible = false;
        });
    };
    $scope.hideButtons2 = function () {


        $scope.offBlockVisible = false;
        $scope.takeOffVisible = false;
        $scope.landingVisible = false;
        $scope.onBlockVisible = false;
        $scope.IsDepartureVisible = false;
        $scope.IsArrivalVisible = false;
        $scope.IsDepartureDisabled = true;
        $scope.IsArrivalDisabled = true;
        $scope.IsCancelVisible = false;
        $scope.IsRampVisible = false;

    };

    $scope.showButtons = function (item) {

        $scope.$apply(function () {
            $scope.offBlockVisible = (item.status == 1 || item.status==9) && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
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
            $scope.IsRedirectVisible = item.Takeoff /*&& item.status != 17*/ && item.status != 7 && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);

            $scope.IsRampVisible = (item.FromAirportIATA == $scope.airport || $scope.IsAdmin) && item.status != 9;

        });
    };
    $scope.showButtons2 = function (item) {


        $scope.offBlockVisible =( item.status == 1 || item.status == 9) && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
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
        $scope.IsRedirectVisible = item.Takeoff /*&& item.status != 17*/ && (item.FromAirportIATA == $scope.airport || $scope.IsAdmin);
        $scope.IsRampVisible = (item.FromAirportIATA == $scope.airport || $scope.IsAdmin) && item.status != 9;

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
            $scope.selectedFlights = [];
            $scope.selectedFlights.push(item);
            $scope.flight = item;

            $scope.showButtons(item);
            if ($scope.popup_inf_visible)
                $scope.setWeather();

            $scope.doGridSelectedChanged = false;
            $scope.dg_flights_instance.selectRows([item], false);

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
            alert('x');
        }
        else

            $scope.selectedResource = { index: data.index, item: data.item };
    };
    $scope.ganttCreated = false;
    $scope.renderTopTimeHeader = function () {
        var _whcs = $('.e-schedule-week-headercell-content');
        $.each(_whcs, function (_i, _d) {
            var whcs = $(_d);
            var oldwc = whcs.html().split('(')[0];
            var year = Number(oldwc.split(',')[1]);
            var prts = (oldwc.split(',')[0]).split(' ');
            var mo = prts[1];
            var da = prts[3];
            var wdate = new Date(year + "/" + mo + "/" + da);
            var newwc = oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
            whcs.html(newwc);
        });
       
    };
    $scope.renderTimeHeader = function () {
        var dhcs = $('.e-schedule-day-headercell-content');
        //joosk

        $.each(dhcs, function (_i, _d) {
            var $d = $(_d);
            var oldc = $d.html();
            

            var $dhour = Number($d.html());
            var spanlen = $d.find('span').length;
            if (spanlen > 0) {
                oldc = $($d.find('span')[0]).html();
                $dhour = Number(oldc);
            }
            var sech = 0;
            if (!$scope.IsUTC)
                sech = getUTCHour($dhour);
            else
                sech = getUTCHour($dhour);
            var newc = "<span style='font-size:13px'>" + oldc + "</span>" + "<span style='font-size:11px;display:inline-block;margin-left:3px;color:gray'>" + sech + "</span>";
            $d.html(newc);

        });


        // var _date = new Date(whcs.html());

        //alert(_date);
    };
    $scope.createGantt = function () {
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        var h = $(window).height() - 139 - 50;
        h = h + 'px';
        $("#resourceGanttba").ejGantt({
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,
            taskbarClick: function (args) {
                $scope.addSelectedFlight(args.data.item);
                $("#resourceGanttba").data("ejGantt").clearSelection();
            },
            dataSource: $scope.dataSource, //self.datasource, //resourceGanttData,
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
            resources: $scope.resources, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 40,
            taskbarHeight: 35,
            scheduleStartDate: $scope.datefrom,
            scheduleEndDate: $scope.dateto,
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
                position: 180,
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
                console.log('load');
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 180;
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


            },
            create: function (args) {


                $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX($scope.scroll); //.scrollLeft(1000)  ;
               // $scope.renderTopTimeHeader();
               // $scope.renderTimeHeader();
               // $scope.StartNowLineTimer(1);

                var nw = new Date();
                var nf = new Date($scope.datefrom);
                var nt = new Date($scope.dateto);
                if (nw.getTime() >= nf.getTime() && nw.getTime() <= nt.getTime()) {
                    
                    $scope.StartNowLineTimer(1);
                }
                else {
                    ////////
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

                if (args.requestType && args.requestType == 'beginedit') {

                    args.cancel = true;

                    //  $scope.InitUpdate();
                }


            },
            actionComplete: function (args) {
                console.log(args);

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
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                dayHeaderFormat: "MMM MM ddd dd , yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
                timescaleUnitSize: "500%"
            },

            taskbarTemplate: "#taskbarTemplate",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
        });
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
    $scope.$on('$viewContentLoaded', function () {
        $scope.scroll2_height = $(window).height() - 266.5 + 87;
        $('.flightboardall').fadeIn(400, function () {

            $scope.loadingVisible = true;
            flightService.getAirportByIATA($scope.airport).then(function (response) {
                $scope.airportEntity = response;

                $scope.airportEntity.Latitude2 = Number($scope.airportEntity.Latitude).toFixed(3);
                $scope.airportEntity.Longitude2 = Number($scope.airportEntity.Longitude).toFixed(3);
                $scope.airportEntity.LtLg = '(' + $scope.airportEntity.Latitude2 + ', ' + $scope.airportEntity.Longitude2 + ')';
                $scope.loadingVisible = false;

                $scope.getAirportWeather();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        });


    });
    $rootScope.$broadcast('FlightBoardAllLoaded', null);





}]);