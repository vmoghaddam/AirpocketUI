'use strict';
app.controller('regFlightsMonthlyController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    $scope.pmonth = $routeParams.mm;
    $scope.pyear = $routeParams.yy;
   
    var isTaxiVisible = false;
    //if ($rootScope.userName.toLowerCase() == 'ashrafi')
    //    isTaxiVisible = true;
    ////////////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Total", id: 'b737' },
        // { text: "MD", id: 'md' },
          { text: "Detail", id: 'detail' },
           //{ text: "By Route/Register", id: 'route_register' },

    ];

    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'b737':
                    $scope.dg_737_instance.repaint();
                    if ($scope.bar_ft_737_instance)
                        $scope.bar_ft_737_instance.render();
                    if ($scope.bar_ftl_737_instance)
                        $scope.bar_ftl_737_instance.render();
                    if ($scope.bar_bt_737_instance)
                        $scope.bar_bt_737_instance.render();
                    break;
                case 'md':
                    $scope.dg_md_instance.repaint();
                    if ($scope.bar_ft_md_instance)
                        $scope.bar_ft_md_instance.render();
                    if ($scope.bar_ftl_md_instance)
                        $scope.bar_ftl_md_instance.render();
                    if ($scope.bar_bt_md_instance)
                        $scope.bar_bt_md_instance.render();
                    break;
                case 'detail':
                    $scope.dg_detail_instance.repaint();
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
            $scope.dg_regroute_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };
    /////////////////////////////////////////
    $scope.yf = 1399;
    if ($scope.pyear)
        $scope.yf =Number( $scope.pyear);
    $scope.yt = 2020;
    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1399, 1398],

        onSelectionChanged: function (arg) {
            $scope.bind();
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


    $scope.fleet = 'All Fleets';
    $scope.sb_fleet = {
        placeholder: 'Fleet',
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['All Fleets','B737','MD'],

        onSelectionChanged: function (arg) {
            $scope.bind();
        },

        bindingOptions: {
            value: 'fleet',


        }
    };
    $scope.bind = function () {
        // var yf = 2020;
        // var yt = 2020;
        if (!$scope.month)
            return;
        $scope.dg_737_ds = null;
        $scope.dg_md_ds = null;
        $scope.dg_reg_ds = null;

        $scope.dg_regroute_ds = null;
        $scope.doRefresh = true;

        $scope.loadingVisible = true;
        flightService.getRegFlightsMonthlyReport($scope.yf, $scope.month,$scope.fleet).then(function (response) {



            $scope.loadingVisible = false;
            $.each(response.total, function (_i, _d) {

                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            });
            $.each(response.details, function (_i, _d) {

                _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            });
            //$.each(response.reg, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});
            //$.each(response.route, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});
            //$.each(response.routereg, function (_i, _d) {

            //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
            //});

            $scope.dg_737_ds = Enumerable.From(response.total).OrderBy('$.Fleet').ThenBy('$.AircraftType').ThenBy('$.Register').ToArray();

          //  $scope.dg_737_ds = Enumerable.From(response.total).Where('$.Fleet=="B737"').ToArray();
           // $scope.dg_md_ds = Enumerable.From(response.total).Where('$.Fleet=="MD"').ToArray();
            $scope.dg_detail_ds = response.details;

            //$scope.pie_cat_ds = $scope.dg_737_ds;
            $scope.pie_cat_ds = Enumerable.From(response.total).GroupBy("$.Fleet", null,
                        function (key, g) {
                            var result = {
                                Fleet: key,
                                FlightTime: g.Sum("$.FlightTime"),
                                //Items: g.OrderBy('$.TotalDelay').ToArray(),
                            };
                            return result;
                        }).ToArray();

            $scope.pie_det_ds = Enumerable.From(response.total).GroupBy("$.Register", null,
                       function (key, g) {
                           var result = {
                               Register: key,
                               FlightTime: g.Sum("$.FlightTime"),
                               //Items: g.OrderBy('$.TotalDelay').ToArray(),
                           };
                           return result;
                       }).ToArray();



            setTimeout(function () {
                if ($scope.dg_737_instance)
                    $scope.dg_737_instance.repaint();
                if ($scope.bar_ft_737_instance)
                    $scope.bar_ft_737_instance.render();
                if ($scope.bar_ftl_737_instance)
                    $scope.bar_ftl_737_instance.render();
                if ($scope.bar_bt_737_instance)
                    $scope.bar_bt_737_instance.render();
                $scope.selectedTabIndex = -1;
                $scope.selectedTabIndex = 0;
            }, 500);


            // $scope.dg_regroute_ds = response.routereg;


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

    $scope.dg_height = $(window).height() - 170;
    $scope.getChartBoxStyle = function () {
        return {
            height: $scope.dg_height + 'px'
        };
    };

    $scope.month = null;
    //$scope.$watch("month", function (newValue) {

    //    if (newValue) {
    //        $scope.bind();

    //    }

    //});
    $scope.monthClick = function (m, $event) {
        $('.month').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.month = m;
        $scope.bind();
    }



    //////////////////////////////////
    $scope.dg_737_columns = [


                {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },

    { dataField: 'Fleet', caption: 'Fleet', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
    { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
     { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
     { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
      { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
       { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'TotalPax', caption: 'TotalPax', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     //{ dataField: 'YearMonth', caption: 'Year/Month', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
     // { dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
     // { dataField: 'MonthName', caption: 'MMM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
     //  { dataField: 'Month', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },
     //   { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', },
     //     { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

     //   { dataField: 'Adult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     //          { dataField: 'Child', caption: 'Child', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     //         { dataField: 'Infant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     //           { dataField: 'TotalPax', caption: 'Total(Adult/Child)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
     //           { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



     //  { dataField: 'UpliftFuel', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     //  { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


    ];
    $scope.dg_737_selected = null;
    $scope.dg_737_instance = null;
    $scope.dg_737_ds = null;
    $scope.dg_737 = {
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


        columns: $scope.dg_737_columns,
        onContentReady: function (e) {
            if (!$scope.dg_737_instance)
                $scope.dg_737_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_737_selected = null;
            }
            else
                $scope.dg_737_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "BlockTimeAvgLeg",
                     showInColumn: "BlockTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },
                 {
                     name: "FlightTimeAvgLeg",
                     showInColumn: "FlightTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },



                {
                    column: "TotalPax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return "Total: " + data.value;
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
                        name: "TotalPaxLeg",
                        showInColumn: "TotalPax",
                        displayFormat: "Avg/Leg: {0}",

                        summaryType: "custom"
                    },


                     {
                         column: "Legs",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return "Total: " + data.value;
                         }
                     },
                     {
                         column: "Legs",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },


            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "FlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
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
                if (options.name === "BlockTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TotalPaxLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalPax;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;


                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = options.totalValueMinutes;
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "B737_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'></span>"
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
            dataSource: 'dg_737_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////
    $scope.bar_ftl_737_instance = null;
    $scope.bar_ftl_737 = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ftl_737_instance)
                $scope.bar_ftl_737_instance = e.component;
        },
        palette: "Dark Moon",
        title: {
            text: "Flight Time / Legs",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "FtLeg",
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "Register"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };

    $scope.bar_ftl_md_instance = null;
    $scope.bar_ftl_md = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ftl_md_instance)
                $scope.bar_ftl_md_instance = e.component;
        },
        palette: "Dark Moon",
        title: {
            text: "Flight Time / Legs",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "FtLeg",
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "Register"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_md_ds",
        }
    };
    ///////////////////////////////
    $scope.bar_ft_737_instance = null;
    $scope.bar_ft_737 = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ft_737_instance)
                $scope.bar_ft_737_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Flight-Block Time",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
           // barWidth: 30,
        },
        //seriesTemplate: {
        //    nameField: "Register"
        //},
        series: [
            { valueField: "FlightTime", name: "Flight Time",color:'#00cc99' },
            { valueField: "BlockTime", name: "Block Time",color:'#0099cc' },
        ],
       
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };

    $scope.bar_ft_md_instance = null;
    $scope.bar_ft_md = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ft_md_instance)
                $scope.bar_ft_md_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Flight Time",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "FlightTime",
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "Register"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_md_ds",
        }
    };

    ////////////////////////////
    $scope.bar_bt_737_instance = null;
    $scope.bar_bt_737 = {
        export:{
            enabled:true,
        },
        onInitialized: function (e) {
            if (!$scope.bar_bt_737_instance)
                $scope.bar_bt_737_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Legs",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "Legs",
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //},
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "Register"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " +  (arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //}
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };

    $scope.bar_bt_md_instance = null;
    $scope.bar_bt_md = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_bt_md_instance)
                $scope.bar_bt_md_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Block Time",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "BlockTime",
            argumentField: "Register",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "Register"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_md_ds",
        }
    };
    /////////////////////////////////////
    $scope.diameter = 0.85;
    
    $scope.pie_cat_ds = [];
    $scope.pie_cat = {
        onInitialized: function (e) {
            if (!$scope.pie_cat_instance)
                $scope.pie_cat_instance = e.component;
        },
        title: {
            text: "Flight Time by Fleet",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        type: "doughnut",
        palette: "Ocean",
        // diameter:0.85,
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "Fleet",
            valueField: "FlightTime",
            label: {
                visible: true,
                font: {
                    size: 12,
                    color: 'white',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            dataSource: 'pie_cat_ds',
            //palette: 'catColors',
            //   diameter:'diameter',
        }
    };


    $scope.pie_det_ds = [];
    $scope.pie_det = {
        onInitialized: function (e) {
            if (!$scope.pie_det_instance)
                $scope.pie_det_instance = e.component;
        },
        title: {
            text: "Flight Time by Register",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        type: "doughnut",
        palette: "Pastel",
        // diameter:0.85,
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "Register",
            valueField: "FlightTime",
            label: {
                visible: true,
                font: {
                    size: 12,
                    color: 'white',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            dataSource: 'pie_det_ds',
            //palette: 'catColors',
            //   diameter:'diameter',
        }
    };
    //////////////////////////////////
    $scope.dg_md_columns = [


              {
                  cellTemplate: function (container, options) {
                      $("<div style='text-align:center'/>")
                          .html(options.rowIndex + 1)
                          .appendTo(container);
                  }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
              },

  { dataField: 'Fleet', caption: 'Fleet', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
  { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
   { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
   { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
    { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
     { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
    { dataField: 'TotalPax', caption: 'TotalPax', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

    ];
    $scope.dg_md_selected = null;
    $scope.dg_md_instance = null;
    $scope.dg_md_ds = null;
    $scope.dg_md = {
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


        columns: $scope.dg_md_columns,
        onContentReady: function (e) {
            if (!$scope.dg_md_instance)
                $scope.dg_md_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_md_selected = null;
            }
            else
                $scope.dg_md_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "BlockTimeAvgLeg",
                     showInColumn: "BlockTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },
                 {
                     name: "FlightTimeAvgLeg",
                     showInColumn: "FlightTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },
                  {
                      column: "TotalPax",
                      summaryType: "sum",
                      customizeText: function (data) {
                          return "Total: " + data.value;
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
                      name: "TotalPaxLeg",
                      showInColumn: "TotalPax",
                      displayFormat: "Avg/Leg: {0}",

                      summaryType: "custom"
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
                             return "Total: " + data.value;
                         }
                     },
                     {
                         column: "Legs",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },









            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "FlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
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
                if (options.name === "BlockTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TotalPaxLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalPax;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;


                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = options.totalValueMinutes;
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "MD_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'></span>"
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
            dataSource: 'dg_md_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_detail_columns = [


               {
                   cellTemplate: function (container, options) {
                       $("<div style='text-align:center'/>")
                           .html(options.rowIndex + 1)
                           .appendTo(container);
                   }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
               },

   { dataField: 'Fleet', caption: 'Fleet', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 0, sortOrder: 'asc' },
   { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, sortIndex: 1, sortOrder: 'asc' },
    { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
    { dataField: 'PDate', caption: 'P. Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
    { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 3, sortOrder: 'asc' },
    { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
         { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
              { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
      { dataField: 'OffBlockLocal', caption: 'OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 4, sortOrder: 'asc' },
      { dataField: 'TakeoffLocal', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
      { dataField: 'LandingLocal', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', },
      { dataField: 'OnBlockLocal', caption: 'OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

      { dataField: 'PaxTotal', caption: 'Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 130 },

     { dataField: 'FlightTimeActual2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
      { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },


    ];
    $scope.dg_detail_selected = null;
    $scope.dg_detail_instance = null;
    $scope.dg_detail_ds = null;
    $scope.dg_detail = {
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


        columns: $scope.dg_detail_columns,
        onContentReady: function (e) {
            if (!$scope.dg_detail_instance)
                $scope.dg_detail_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_detail_selected = null;
            }
            else
                $scope.dg_detail_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTimeActual2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTimeActual2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },




                 {
                     column: "PaxTotal",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return "Total: " + data.value;
                     }
                 },
                  {
                      column: "PaxTotal",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },







            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "FlightTimeAvg") {
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
                if (options.name === "BlockTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "Detail_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'></span>"
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
            dataSource: 'dg_detail_ds',
            height: 'dg_height',
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
        $rootScope.page_title = '>  Monthly Flight Time Report';


        $('.regmonthreport').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {
        if ($scope.pmonth) {
             
            $('.month').removeClass('selected');
            //$($event.currentTarget).addClass('selected');
            $('.month.m' + $scope.pmonth).addClass('selected');
            $scope.month = $scope.pmonth;
            $scope.bind();
        }

    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);