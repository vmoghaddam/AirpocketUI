'use strict';
app.controller('formaController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    $scope.Operator = $rootScope.CustomerName;
    var isTaxiVisible = false;
    //if ($rootScope.userName.toLowerCase() == 'ashrafi')
    //    isTaxiVisible = true;
    ////////////////////////////////////////
   

    ////////////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'finmrpt',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_total_ds = null;
            $scope.dg_reg_ds = null;
            $scope.dg_route_ds = null;
            $scope.dg_regroute_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };
    /////////////////////////////////////////
    $scope.yf = 2020;
    $scope.yt = 2020;
    $scope.sb_yf = {
        placeholder: 'From Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2018, 2019, 2020, 2021],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'To Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2018, 2019, 2020, 2021],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };
    $scope.bind = function () {
        // var yf = 2020;
        // var yt = 2020;
        $scope.loadingVisible = true;
        flightService.getFormAReport($scope.yf, $scope.yt).then(function (response) {



            $scope.loadingVisible = false;
            //$.each(response.total, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});
            //$.each(response.reg, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});
            //$.each(response.route, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});
            //$.each(response.routereg, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});

            $scope.dg_total_ds = response ;
            //$scope.dg_reg_ds = response.reg;
            //$scope.dg_route_ds = response.route;
            //$scope.dg_regroute_ds = response.routereg;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-30);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

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
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                // _d.DurationH = Math.floor(_d.FlightTime / 60);
                // _d.DurationM = _d.FlightTime % 60;
                // var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
            });
            $scope.dg_flight_total_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewFlights = function (id, df, dt) {
        $scope.dg_flight_ds = null;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
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
                _d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
    ////////////////////////////////////
    $scope.statusDs = [
        { Id: 1, Title: 'Done' },
         { Id: 2, Title: 'Scheduled' },
         { Id: 3, Title: 'Canceled' },
         { Id: 4, Title: 'Starting' },
          { Id: 5, Title: 'All' },
    ];
    $scope.fstatus = 1;
    $scope.sb_Status = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.statusDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fstatus',


        }
    };



    /////////////////////////////////
    $scope.dg_total_columns = [


                {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },

     // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
     { dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: true, fixedPosition: 'left', width: 170 },
      { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
      { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
       { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },

        {
            caption: 'Aircraft Kilometers', alignment: 'center', columns: [
                { dataField: 'DistanceInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'Distance', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },
       

       //{ dataField: 'Legs', caption: 'Aircraft Departures', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Aircraft Departures', alignment: 'center', columns: [
                { dataField: 'LegsInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'Legs', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'FlightHour', caption: 'Aircraft Hours', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Aircraft Hours', alignment: 'center', columns: [
                { dataField: 'FlightHourInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'FlightHour', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'PaxTotal', caption: 'Passengers Carried', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Passengers Carried', alignment: 'center', columns: [
                { dataField: 'PaxTotalInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'PaxTotal', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'FreightTone', caption: 'Freight Tonnes Carried', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Freight Tonnes Carried', alignment: 'center', columns: [
                { dataField: 'FreightToneInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'FreightTone', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'PaxTotalDistRound', caption: 'Passenger-Kilometers Performed', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 170, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Passenger-Kilometers Performed', alignment: 'center', columns: [
                { dataField: 'PaxTotalDistRoundInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'PaxTotalDistRound', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'TotalSeatDistRound', caption: 'Seat-Kilometers Available', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Seat-Kilometers Available', alignment: 'center', columns: [
                { dataField: 'TotalSeatDistRoundInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'TotalSeatDistRound', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'PaxLoad', caption: 'Passenger Load Factor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Passenger Load Factor', alignment: 'center', columns: [
                { dataField: 'DPaxLoadInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'PaxLoad', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

       // { dataField: 'PaxAllWeightDistance', caption: 'Passengers(Ton-Km)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Passengers(Ton-Km)', alignment: 'center', columns: [
                { dataField: 'PaxAllWeightDistanceInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'PaxAllWeightDistance', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'FreightToneDistance', caption: 'Freight(Ton-Km)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Freight(Ton-Km)', alignment: 'center', columns: [
                { dataField: 'FreightToneDistanceInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'FreightToneDistance', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'TotalToneDistance', caption: 'Total(Ton-Km)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Total(Ton-Km)', alignment: 'center', columns: [
                { dataField: 'TotalToneDistanceInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'TotalToneDistance', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'TotalToneDistanceAvailable', caption: 'Available(Ton-Km)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Available(Ton-Km)', alignment: 'center', columns: [
                { dataField: 'TotalToneDistanceAvailableInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'TotalToneDistanceAvailable', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },

        //{ dataField: 'WeightLoadFactor', caption: 'Weight Load Factor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 160, fixed: false, fixedPosition: 'left', },
        {
            caption: 'Weight Load Factor', alignment: 'center', columns: [
                { dataField: 'WeightLoadFactorInt', caption: 'Int', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
                { dataField: 'WeightLoadFactor', caption: 'DOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
            ]
        },
       // { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', },
       //   { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

       // { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       //        { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       //       { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       //         { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
       //         { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



       //{ dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       //{ dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


    ];
    $scope.dg_total_selected = null;
    $scope.dg_total_instance = null;
    $scope.dg_total_ds = null;
    $scope.dg_total = {
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

        columnAutoWidth: false,
        height: $(window).height() - 140,

        columns: $scope.dg_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_total_instance)
                $scope.dg_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_total_selected = null;
            }
            else
                $scope.dg_total_selected = data;


        },
        summary: {
            totalItems: [


                



                 {
                     column: "Adult",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                  {
                      column: "Adult",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                  {
                      column: "Child",
                      summaryType: "sum",
                      customizeText: function (data) {
                          return data.value;
                      }
                  },
                  {
                      column: "Child",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                   {
                       column: "Infant",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                    {
                        column: "Infant",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },
                   {
                       column: "TotalPax",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                    {
                        column: "TotalPax",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },

                    {
                        column: "TotalSeat",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return data.value;
                        }
                    },
                    {
                        column: "TotalSeat",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },
                     {
                         column: "Legs1",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return data.value;
                         }
                     },



                     {
                         column: "UpliftFuel",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return data.value;
                         }
                     },
                     {
                         column: "UpliftFuel",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },

                      {
                          column: "UsedFuel",
                          summaryType: "sum",
                          customizeText: function (data) {
                              return data.value;
                          }
                      },
                     {
                         column: "UsedFuel",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },









            ],
            calculateCustomSummary: function (options) {
                if (options.name === "ActualFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "ActualFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "DelayAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;

                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.Delay);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }


                if (options.name === "JLFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLFlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;

                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.JLFlightTime);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



                if (options.name === "SITATimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "SITATimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "BlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "JLBlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLBlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TaxiTOTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "TaxiLNDTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "TaxiTOAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "TaxiLNDAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "FormA_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Air Transport Reporting Form</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },


        bindingOptions: {
            dataSource: 'dg_total_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
   
  
   
   
    //////////////////////////////////
    $scope.ip = null;
    $scope.sb_IP = {
        placeholder: 'IP',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceIP(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'ip',


        }
    };
    $scope.cpt = null;
    $scope.sb_CPT = {
        placeholder: 'Captain',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCaptain(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cpt',


        }
    };
    $scope.fo = null;

    /////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 200 },

    };
    $scope.getDatasourceRoutes = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/routes',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Route'],
        });
    };
    $scope.getDatasourceMSN = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/aircrafts/available/customer/type/' + Config.CustomerId + '/-1',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Register'],
        });
    };

    $scope.route = null;
    $scope.tag_route = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceRoutes(),


        searchExpr: ["Route", "FromAirportIATA", "ToAirportIATA"],
        displayExpr: "Route",
        valueExpr: 'Route',
        bindingOptions: {
            value: 'route',
        }
    };

    $scope.reg = null;
    $scope.tag_reg = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceMSN(),


        searchExpr: ["Regsiter"],
        displayExpr: "Register",
        valueExpr: 'ID',
        bindingOptions: {
            value: 'reg',
        }
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Air Transport Report - From A';


        $('.forma').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////
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
        frameDoc.document.write('<link href="content/css/print.css" rel="stylesheet" />');
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
        }, 1500);
    }
    //////////////////////////////////
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.scroll_jl_height = $(window).height() - 10 - 110;
    //////////////////////////////////
    $scope.formatTime = function (date) {
        if (!date)
            return "";
        return moment(date).format('HH:mm');
    };
    $scope.formatDate = function (date) {
        if (!date)
            return "";
        return moment(date).format('YYYY-MM-DD');
    };
    $scope.formatNow = function () {
        return $scope.formatDate(new Date());
    };
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
    /////////////////////////////////////////
    $scope.popup_print_visible = false;
    $scope.popup_print_title = 'Print';
    $scope.popup_print = {

        fullScreen: false,
        showTitle: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        toolbarItems: [

 {
     widget: 'dxButton', location: 'after', options: {
         type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


             printElem($('#rtblfa'));

         }


     }, toolbar: 'bottom'
 },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_print_visible = false;
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

            $scope.scroll_jl_height = $(window).height() - 10 - 110;
        },
        onHiding: function () {


            $scope.popup_print_visible = false;

        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_print_visible',

            title: 'popup_print_title',

        }
    };
    /////////////////////////////////////////////
    $scope.reportData = null;
    $scope.bindReport = function () {

    };

    $scope.btn_print = {
        text: 'Show Form',
        type: 'default',

        width: 150,

        bindingOptions: {},
        onClick: function (e) {

            $scope.reportData = $rootScope.getSelectedRow($scope.dg_total_instance);
            if (!$scope.reportData) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $window.open($rootScope.reportServer + '?type=1&year=' + $scope.reportData .Year+ '&month=' + $scope.reportData.Month, '_blank');
            //$scope.bindReport();

            //$scope.popup_print_visible = true;
        }
    };

    $scope.btn_year = {
        text: 'Yearly Report',
        type: 'default',

        width: 200,

        bindingOptions: {},
        onClick: function (e) {

            $window.open('#!/forma/yearly/', '_blank');
        }
    };


    ///////////////////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);