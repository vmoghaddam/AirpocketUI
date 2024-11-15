'use strict';
app.controller('finmonthController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    var isTaxiVisible = false;
    //if ($rootScope.userName.toLowerCase() == 'ashrafi')
    //    isTaxiVisible = true;
    ////////////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Total", id: 'total' },
         { text: "By Route", id: 'route' },
          { text: "By Register", id: 'register' },
           { text: "By Route/Register", id: 'route_register' },
             
    ];

    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
           $('#' + id).fadeIn();
            
            switch (id) {
                case 'total':
                     
                    break;
                case 'route':
                     
                    break;
                case 'register':
                    
                    break;
                case 'route_register':
                     
                    break;
                
                default:
                    break;
            }
            if ($scope.dg_total_instance)
                $scope.dg_total_instance.refresh();
            if ($scope.dg_reg_instance)
                $scope.dg_reg_instance.refresh();
            if ($scope.dg_route_instance)
                $scope.dg_route_instance.refresh();
            if ($scope.dg_regroute_instance)
                $scope.dg_regroute_instance.refresh();

            //$scope.dg_crew_instance.refresh();
        }
        catch (e) {

        }

    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

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
            $scope.dg_regroute_ds  = null;
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
        dataSource: [2018,2019,2020,2021],

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
        flightService.getFinMonthlyReport($scope.yf,$scope.yt).then(function (response) {

             

            $scope.loadingVisible = false;
            $.each(response.total, function (_i, _d) {
 
                _d.Delay2 = $scope.formatMinutes(_d.Delay);
            });
            $.each(response.reg, function (_i, _d) {

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
            });
            $.each(response.route, function (_i, _d) {

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
            });
            $.each(response.routereg, function (_i, _d) {

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
            });

            $scope.dg_total_ds = response.total;
            $scope.dg_reg_ds = response.reg;
            $scope.dg_route_ds = response.route;
            $scope.dg_regroute_ds = response.routereg;


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



    //////////////////////////////////
    $scope.dg_flight_columns = [


                  {
                      cellTemplate: function (container, options) {
                          $("<div style='text-align:center'/>")
                              .html(options.rowIndex + 1)
                              .appendTo(container);
                      }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                  },

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },

       {
           caption: 'Aircraft', columns: [
                 { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 2, sortOrder: 'asc' },
           ]
       },
      {
          caption: 'Route',
          columns: [
              { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
              { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
          ]
      },
       {
           caption: 'Dep/Arr',
           columns: [
                 { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                 { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                  { dataField: 'TakeoffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
                { dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                 { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

           ]
       },
       //{
       //    caption: 'UTC',
       //    columns: [
       //          { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
       //          { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
       //          { dataField: 'Takeoff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
       //          { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       //    ]
       //},

        {
            caption: 'Pax',
            columns: [
                { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                 { dataField: 'PaxChild', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                  { dataField: 'PaxTotal', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                  { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

            ]
        },

        {
            caption: 'Fuel',
            columns: [
                { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                 { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

            ]
        },












    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [
                 {
                     name: "TaxiTOTotal",
                     showInColumn: "TaxiTO2",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },
                  {
                      name: "TaxiLNDTotal",
                      showInColumn: "TaxiLND2",
                      displayFormat: "{0}",

                      summaryType: "custom"
                  },
                   {
                       name: "TaxiTOAvg",
                       showInColumn: "TaxiTO2",
                       displayFormat: "Avg: {0}",

                       summaryType: "custom"
                   },
                    {
                        name: "TaxiLNDAvg",
                        showInColumn: "TaxiLND2",
                        displayFormat: "Avg: {0}",

                        summaryType: "custom"
                    },

                {
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "ActualFlightTimeTotal",
                     showInColumn: "FlightTimeActual2",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },
                 {
                     name: "ActualFlightTimeAvg",
                     showInColumn: "FlightTimeActual2",
                     displayFormat: "Avg: {0}",

                     summaryType: "custom"
                 },
                {
                    name: "SITATimeTotal",
                    showInColumn: "SITATime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "SITATimeAvg",
                    showInColumn: "SITATime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "JLBlockTimeTotal",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLBlockTimeAvg",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "JLFlightTimeTotal",
                    showInColumn: "JLFlightTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLFlightTimeAvg",
                    showInColumn: "JLFlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },


                 {
                     column: "PaxAdult",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                  {
                      column: "PaxAdult",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                  {
                      column: "PaxChild",
                      summaryType: "sum",
                      customizeText: function (data) {
                          return data.value;
                      }
                  },
                  {
                      column: "PaxChild",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                   {
                       column: "PaxInfant",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                    {
                        column: "PaxInfant",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },
                   {
                       column: "PaxTotal",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                    {
                        column: "PaxTotal",
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
                             return data.value;
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
                             return data.value;
                         }
                     },







                      {
                          column: "CargoCount",
                          summaryType: "sum",
                          customizeText: function (data) {
                              return data.value;
                          }
                      },
                        {
                            column: "CargoWeight",
                            summaryType: "sum",
                            customizeText: function (data) {
                                return data.value;
                            }
                        },
                          {
                              column: "BaggageWeight",
                              summaryType: "sum",
                              customizeText: function (data) {
                                  return data.value;
                              }
                          },
                           {
                               column: "BaggageCount",
                               summaryType: "sum",
                               customizeText: function (data) {
                                   return data.value;
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
            fileName: "Financial_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: true
        },

    };
    //////////////////////////////////
    $scope.dg_total_columns = [


                {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },

     // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
     { dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: false, fixedPosition: 'left',width:200  },
      { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left',   sortIndex: 0, sortOrder: 'asc' },
      { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left',     },
       { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left',   sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left',   },
          { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
               { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


      
       { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

        
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
        height: $(window).height() - 180,

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
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 


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
                         column: "Legs",
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
            fileName: "Financial_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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
    $scope.dg_route_columns = [

           {
               cellTemplate: function (container, options) {
                   $("<div style='text-align:center'/>")
                       .html(options.rowIndex + 1)
                       .appendTo(container);
               }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
           },

     // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
     { dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: false, fixedPosition: 'left',width:200   },
      { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
      { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
       { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },
       { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
          { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
               { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



       { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


 
    ];
    $scope.dg_route_selected = null;
    $scope.dg_route_instance = null;
    $scope.dg_route_ds = null;
    $scope.dg_route = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_route_columns,
        onContentReady: function (e) {
            if (!$scope.dg_route_instance)
                $scope.dg_route_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_route_selected = null;
            }
            else
                $scope.dg_route_selected = data;


        },
       
        "export": {
            enabled: true,
            fileName: "Financial_Monthly_Route_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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

        summary: {
            totalItems: [


                {
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },



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
                         column: "Legs",
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
        bindingOptions: {
            dataSource: 'dg_route_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_reg_columns = [

            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },

     // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
     { dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' ,width:200},
      { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
      { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
       { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },
       { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 3, sortOrder: 'asc' },

        { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
          { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
               { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



       { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


    ];
    $scope.dg_reg_selected = null;
    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = null;
    $scope.dg_reg = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_reg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reg_instance)
                $scope.dg_reg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_reg_selected = null;
            }
            else
                $scope.dg_reg_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "Financial_Monthly_Register_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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

        summary: {
            totalItems: [


                {
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },



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
                         column: "Legs",
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
        bindingOptions: {
            dataSource: 'dg_reg_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    ////////////////////////////////
    $scope.dg_regroute_columns = [

           {
               cellTemplate: function (container, options) {
                   $("<div style='text-align:center'/>")
                       .html(options.rowIndex + 1)
                       .appendTo(container);
               }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
           },

     // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
     { dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',width:200 },
      { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
      { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
       { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },
       { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
         { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', sortIndex: 3, sortOrder: 'asc' },
       { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 4, sortOrder: 'asc' },

       { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
          { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
               { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



       { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
       { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


    ];
    $scope.dg_regroute_selected = null;
    $scope.dg_regroute_instance = null;
    $scope.dg_regroute_ds = null;
    $scope.dg_regroute = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_regroute_columns,
        onContentReady: function (e) {
            if (!$scope.dg_regroute_instance)
                $scope.dg_regroute_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_regroute_selected = null;
            }
            else
                $scope.dg_regroute_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "Financial_Monthly_Register_Route_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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

        summary: {
            totalItems: [


                {
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },



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
                         column: "Legs",
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
        bindingOptions: {
            dataSource: 'dg_regroute_ds'
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
        $rootScope.page_title = '> Financial Monthly Report';


        $('.finmonthreport').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);