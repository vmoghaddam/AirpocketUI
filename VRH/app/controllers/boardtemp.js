'use strict';
app.controller('boardtempController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'fbService', '$http','$q','logService', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, fbService, $http,$q,logService) {
    $scope.prms = $routeParams.prms;

    var hourWidth = 85;
    authService.setModule(3);
    $rootScope.setTheme();
    $scope.isPGS=$rootScope.userName.toLowerCase() == 'pgs' || $rootScope.userName.toLowerCase() == 'ops.pgs';
    $scope.IsPlanning = $rootScope.HasMenuAccess('flight_planning', 3);

    $scope.IsFuelReadOnly = false;
    
   
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
    $scope.IsComm = $rootScope.userName.toLowerCase().startsWith('comm.') || $rootScope.userName.toLowerCase().startsWith('com.') || $rootScope.userName.toLowerCase().startsWith('demo');
	$scope.NotIsComm = !$scope.IsComm;
    $scope.flight = null;
    $scope.record = null;
    $scope.flightGUID = null;
        
    $scope.linked_flight = {};
    $scope.linkEntity = {};
    $scope.time_ir_std_date = null;
    $scope.time_ir_std_time = null;
    $scope.time_ir_sta_date = null;
    $scope.time_ir_sta_time = null;
    //jik
    
    
    $scope.setArrival = function () {
		return;
        if (!$scope.doIrRoute)
            return;
        if ($scope.linkEntity && $scope.time_ir_std_date != null && $scope.time_ir_std_time != null && $scope.linkEntity.FlightH != null && $scope.linkEntity.FlightM != null) {
            var std_dates = (new Date($scope.time_ir_std_date)).getDatePartArray();
            var std_times = (new Date($scope.time_ir_std_time)).getTimePartArray();
            var std = new Date(std_dates[0], std_dates[1], std_dates[2], std_times[0], std_times[1], 0, 0);
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
        
        flightService.getRealRegisters(cid).then(function (response) {
            $scope.realMSNs = Enumerable.From(response)
                .Where(function (x) { return !x.Register.startsWith('CNL') && (x.Register.startsWith('V') || x.Register.startsWith('R') || x.Register.startsWith('FS')) ; })
                .OrderBy('$.isvirtual').ThenBy('$.TFC')
                .ThenBy('$.Register').ToArray();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
    
	$scope.todayFlights = [];
    $scope.btn_free = {
        
        hint: 'New Flight',
        type: 'default',
        icon: 'fas fa-plus',
        width: '100%',

        onClick: function (e) {
			
			$scope.todayFlights = $scope.ganttData.flights.filter(function(item) {
				return item.STD.getDate() == (new Date($scope.selectedDate)).getDate();
			});
			
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

    



    $scope.before_refreshed_flight = null;
    

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

        }
    };
    //sook


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
                
                $scope.StopUTimer();
                $scope.activatedStbys = null;
            }
            
        },
        bindingOptions: {
            value: 'doUTC',
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
    


    //////////////////////////////////////////////////////////

    $scope._flightno = '';
    $scope.text_flightno = {
        bindingOptions: {
            value: '_flightno',

        }
    };

    $scope.ganttview = true;
    $scope.gridview = true;

    /////////Planning ////////////////////

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
				
				var _xstd=new Date($scope.ati_flight.STD);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-30));
               if (['DYU','FEG','NMA','TAS'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(90));
				 if (['FRU'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(150));
				if (['PNQ'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(120));
			  if (['TBS','BUS','EVN'].indexOf( $scope.ati_flight.FromAirportIATA)!=-1 )
					_xstd=new Date(_xstd.addMinutes(30));
										
				var _xsta=new Date($scope.ati_flight.STA);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(-30));
				if (['DYU','FEG','NMA','TAS'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(90));
				if (['FRU'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(150));
				if (['PNQ'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(120));
				if (['TBS','BUS','EVN'].indexOf( $scope.ati_flight.ToAirportIATA)!=-1 )
					_xsta=new Date(_xsta.addMinutes(30));
				
				
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
            $scope.popup_shift_visible = true;

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

    $scope.dateEnd = null;
    $scope.tabsdatevisible = false;
    //doolrahm




    $scope.jlShow = false;



    $scope.datefrom = General.getDayFirstHour(new Date(2019, 5, 6, 0, 0, 0));
    $scope.dateto = General.getDayLastHour(new Date(2019, 5, 6, 0, 0, 0)); //General.getDayLastHour( (new Date(Date.now())) );

    $scope._datefrom = new Date('2022-01-01');


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
		visible: false,
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
    $scope.days_count = 7;
    $scope.num_days = {
        min: 1,
        showSpinButtons: true,
		visible: false,
        bindingOptions: {
            value: 'days_count',

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
		// alert(_hhx+' '+_mmx);
		//return;
		
		
        if ([152340,132316,133405,152352,150903,132636, 152384, 152370, 152391].indexOf($scope.linkEntity.FromAirportId)!=-1)
		{
		   std=new Date( std.addMinutes(30));	
		}
        if ([146698,152383, 152390, 152375].indexOf($scope.linkEntity.FromAirportId)!=-1)
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
        if ([152340,132316,133405,152352,150903,132636, 152384, 152370, 152391].indexOf($scope.linkEntity.ToAirportId)!=-1)
		{
		   sta=new Date( sta.addMinutes(30));	
		}
        if ([146698,152383, 152390, 152375].indexOf($scope.linkEntity.ToAirportId)!=-1)
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
       
        var _flight = JSON.parse(JSON.stringify($scope.linkEntity));
        //9-8
        _flight.FlightStatusID = 1;
        _flight.STD = (new Date(std)).toUTCString();

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
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( response.flight.FromAirportIATA)!=-1 )
							response.flight.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( response.flight.ToAirportIATA)!=-1 )
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
							//////////////////////////////////////////////////////////
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( resFlt.ToAirportIATA)!=-1 )
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
				if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _f.FromAirportIATA)!=-1 )
							_f.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _f.ToAirportIATA)!=-1 )
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
    $scope.formatTime = function (dt) {
        return moment(dt).format('HHmm');
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
    
    $scope.ganttCreated = false;
    
    $scope._days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
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
       
        stopped = $timeout(function () {

          
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
	   if (f.FlightStatusID==4)
		   return (f.notes? f.FlightNumber+"("+f.notes+")":f.FlightNumber);
		return f.FlightNumber;
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
        if (f.FlightStatusID == 4 || f.Register.includes('RBC'))
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
    
    //fjk
    $scope.getResStyle = function (res) {

        var ext = 15;
        if (res.resourceName.includes('CNL')  || res.resourceName.includes('RBC'))
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
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('ddd')+ "</td>"
                + ($(window).width() < 1400 ? "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('ddd') + "</td>" : "")
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('ddd')+ "</td>"
                + "<td style='font-size:14px;' class='qdate'>" + moment(tempDate).format('ddd')+ "</td>"

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
        if (flt.ID == 70888 || flt.ID==70889) {
            console.log(flt.STD);
            console.log((new Date(flt.STD)).addMinutes(270 + 60));
            n = 60;
        }
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
        //logService.getFlightsGanttUTC(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, /*offset*/0, null, 1, filter).then(function (response) {
		flightService.getFlightsWeekList().then(function(response){
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
                    var str = moment(stdate).format("ddd");
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

                        if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _q.FromAirportIATA)!=-1 )
							_q.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _q.ToAirportIATA)!=-1 )
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
            
        });
    };
    $scope.btn_search = {
        //text: 'Search',
		visible: false,
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
		
		if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( resFlt.FromAirportIATA)!=-1 )
							resFlt.GWLand=180;
						if (['NJF','BSR','IST','KWI','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( resFlt.ToAirportIATA)!=-1 )
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
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _d.FromAirportIATA)!=-1 )
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
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _d.ToAirportIATA)!=-1 )
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
            "IATA": "FRU",
            "Id": 152379
        },
		{
            "IATA": "PNQ",
            "Id": 102338
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
            "IATA": "FEG",
            "Id": 152383
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
            "IATA": "EVN",
            "Id": 141866
        },
        {
            "IATA": "THR",
            "Id": 135502
        },
        {
            "IATA": "ZBR",
            "Id": 152331
        },
		 {
            "IATA": "JWN",
            "Id": 133037
        },
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
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _d.FromAirportIATA)!=-1 || [152340,132316,152352,133405,150903,132636, 152384, 152370, 152391].indexOf( _d.FromAirport)!=-1)
					_xstd=new Date(_xstd.addMinutes(30));
               if (['DYU','FEG','NMA','TAS'].indexOf( _d.FromAirportIATA)!=-1 || [146698,152383, 152390, 152375].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-90));
							 if (['FRU'].indexOf( _d.FromAirportIATA)!=-1 || [152379].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-150));
							if (['PNQ'].indexOf( _d.FromAirportIATA)!=-1 || [102338].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-120));
			  if (['TBS','BUS', 'EVN'].indexOf( _d.FromAirportIATA)!=-1 || [152366,152362, 141866].indexOf( _d.FromAirport)!=-1 )
					_xstd=new Date(_xstd.addMinutes(-30));
				
										
				var _xsta=new Date(_d.STALocal);
				if (['NJF','BSR','IST','KWI','DAM','AYT','DOH','PDV', 'AMM', 'ADJ'].indexOf( _d.ToAirportIATA)!=-1 || [152340,132316,152352,13340,150903,132636, 152384, 152370, 152391].indexOf( _d.ToAirport)!=-1)
					_xsta=new Date(_xsta.addMinutes(30));
				if (['DYU','FEG','NMA','TAS'].indexOf( _d.ToAirportIATA)!=-1  || [146698,152383, 152390, 152375].indexOf( _d.ToAirport)!=-1)
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
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "6813",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 76,
            "FlightH": 1,
            "FlightM": 0
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
            "FlightH": 2,
            "FlightM": 0
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
            "FlightH": 2,
            "FlightM": 30
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
            "FlightH": 2,
            "FlightM": 20
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
            "FlightH": 2,
            "FlightM": 0
        },
        {
            "FlightNumber": "6826",
            "FromAirport": 140866,
            "FromAirportIATA": "IKA",
            "ToAirport": 152340,
            "ToAirportIATA": "NJF",
            "cnt": 14,
            "FlightH": 1,
            "FlightM": 0
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
            "FlightH": 4,
            "FlightM": 0
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
            "FlightH": 2,
            "FlightM": 40
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
            "FlightM": 0
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

              $scope.search();
			$scope.IsGNTVisible = true;
            

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
		
       

    });
	



}]);