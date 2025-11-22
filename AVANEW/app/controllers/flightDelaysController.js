'use strict';
app.controller('flightDelaysController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {

    $scope.prms = $routeParams.prms;
    //////////////////////////////////
    var tabs = [
        { text: "By Code", id: 'code' },
        { text: "By Source Airport", id: 'source' },
        { text: "By Register", id: 'register' },
        { text: "By Route", id: 'route' },
        { text: "Details", id: 'details' },

    ];
    $scope.tabs = tabs;

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;
        $('#' + id).fadeIn();
        // $scope.dg_course_visible = newValue == 0;
        // $scope.dg_course_all_visible = newValue == 1;
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
    $scope.selectedTabIndex = 0;
    //////////////////////////////////
    $scope.boardSummary = {
        arrived: '-',

        flights: '-',
        flightTime: '-',
        flightTimeStr: '-',
        fixTime: '-',
        blockTime: '-',
        blockTimeStr: '-',
        cancled: '-',
        delayRatio: '-',
        delay: '-',
        delayStr: '-',

        pax: '-',
        seat: '-',

        paxLoad: '-',


    };
    //////////////////////////////////
    var offset = -1 * (new Date()).getTimezoneOffset();
    $scope.dsUrl = null;
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.bind = function () {
        // Config.CustomerId
        var dt = $scope.dt_to ? $scope.dt_to : new Date(2200, 4, 19, 0, 0, 0);
        var df = $scope.dt_from ? $scope.dt_from : new Date(1900, 4, 19, 0, 0, 0);
        //////////////////////////////
        $scope.boardSummary = {
            arrived: '-',

            flights: '-',
            flightTime: '-',
            flightTimeStr: '-',
            fixTime: '-',
            blockTime: '-',
            blockTimeStr: '-',
            cancled: '-',
            delayRatio: '-',
            delay: '-',
            delayStr: '-',

            pax: '-',
            seat: '-',

            paxLoad: '-',


        };
        //////////////////////////////
        $scope.loadingVisible = true;
        flightService.getSummary(Config.CustomerId, df, dt).then(function (ressum) {
            $scope.loadingVisible = false;
            $scope.boardSummary.arrived = ressum.arrived;

            $scope.boardSummary.flights = ressum.flights;
            $scope.boardSummary.flightTime = ressum.flightTime;
            $scope.boardSummary.flightTimeStr = $scope.formatMinutes(ressum.flightTime);
            $scope.boardSummary.fixTime = ressum.fixTime;
            $scope.boardSummary.blockTime = ressum.blockTime;
            $scope.boardSummary.blockTimeStr = $scope.formatMinutes(ressum.blockTime);
            $scope.boardSummary.cancled = ressum.cancled;
            $scope.boardSummary.delayRatio = ressum.delayRatio;
            $scope.boardSummary.delay = ressum.delay;
            $scope.boardSummary.delayStr = $scope.formatMinutes(ressum.delay);

            $scope.boardSummary.pax = ressum.pax;
            $scope.boardSummary.seat = ressum.seat;

            $scope.boardSummary.paxLoad = ressum.paxLoad;

            ////////////////////////////////////////////////////
            flightService.getDelaysTotalByCode(Config.CustomerId, df, dt).then(function (response) {
                $scope.loadingVisible = false;
                $.each(response, function (_i, _d) {

                    var fh = _d.TotalDelay;
                    _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                });
                $scope.dg_ds = response;
                ////source airport/////////////////
                flightService.getDelaysTotalBySource(Config.CustomerId, df, dt).then(function (response2) {

                    $.each(response2, function (_i, _d) {

                        var fh = _d.TotalDelay;
                        _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                    });
                    $scope.dg_src_ds = response2;
                    $scope.grp_src = Enumerable.From(response2).GroupBy("$.FromAirportIATA", null,
                        function (key, g) {
                            var result = {
                                FromAirportIATA: key,
                                TotalDelay: g.Sum("$.TotalDelay"),
                                Items: g.OrderBy('$.TotalDelay').ToArray(),
                            };
                            return result;
                        }).ToArray();

                    //////////////register ////////////////
                    flightService.getDelaysTotalByRegister(Config.CustomerId, df, dt).then(function (response3) {
                        $scope.grp_reg = Enumerable.From(response3).GroupBy("$.Register", null,
                            function (key, g) {
                                var result = {
                                    Register: key,
                                    TotalDelay: g.Sum("$.TotalDelay"),
                                    Items: g.OrderBy('$.TotalDelay').ToArray(),
                                };
                                return result;
                            }).ToArray();
                        $.each(response3, function (_i, _d) {

                            var fh = _d.TotalDelay;
                            _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                        });
                        $scope.dg_reg_ds = response3;
                        //////////////route ////////////////
                        flightService.getDelaysTotalByRoute(Config.CustomerId, df, dt).then(function (response4) {
                            $scope.grp_route = Enumerable.From(response4).GroupBy("$.Route", null,
                                function (key, g) {
                                    var result = {
                                        Route: key,
                                        TotalDelay: g.Sum("$.TotalDelay"),
                                        Items: g.OrderBy('$.TotalDelay').ToArray(),
                                    };
                                    return result;
                                }).ToArray();
                            $.each(response4, function (_i, _d) {

                                var fh = _d.TotalDelay;
                                _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                            });
                            $scope.dg_route_ds = response4;


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        ///////////////////////////////////

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    ///////////////////////////////////

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                /////////////////////////////////////

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //////////////////////////////////////


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        return;
        ////////////////////////////////

        $scope.loadingVisible = true;
        flightService.getDelaysTotalByCode(Config.CustomerId, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                var fh = _d.TotalDelay;
                _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


            });
            $scope.dg_ds = response;
            ////source airport/////////////////
            flightService.getDelaysTotalBySource(Config.CustomerId, df, dt).then(function (response2) {

                $.each(response2, function (_i, _d) {

                    var fh = _d.TotalDelay;
                    _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                });
                $scope.dg_src_ds = response2;
                $scope.grp_src = Enumerable.From(response2).GroupBy("$.FromAirportIATA", null,
                    function (key, g) {
                        var result = {
                            FromAirportIATA: key,
                            TotalDelay: g.Sum("$.TotalDelay"),
                            Items: g.OrderBy('$.TotalDelay').ToArray(),
                        };
                        return result;
                    }).ToArray();

                //////////////register ////////////////
                flightService.getDelaysTotalByRegister(Config.CustomerId, df, dt).then(function (response3) {
                    $scope.grp_reg = Enumerable.From(response3).GroupBy("$.Register", null,
                        function (key, g) {
                            var result = {
                                Register: key,
                                TotalDelay: g.Sum("$.TotalDelay"),
                                Items: g.OrderBy('$.TotalDelay').ToArray(),
                            };
                            return result;
                        }).ToArray();
                    $.each(response3, function (_i, _d) {

                        var fh = _d.TotalDelay;
                        _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                    });
                    $scope.dg_reg_ds = response3;
                    //////////////route ////////////////
                    flightService.getDelaysTotalByRoute(Config.CustomerId, df, dt).then(function (response4) {
                        $scope.grp_route = Enumerable.From(response4).GroupBy("$.Route", null,
                            function (key, g) {
                                var result = {
                                    Route: key,
                                    TotalDelay: g.Sum("$.TotalDelay"),
                                    Items: g.OrderBy('$.TotalDelay').ToArray(),
                                };
                                return result;
                            }).ToArray();
                        $.each(response4, function (_i, _d) {

                            var fh = _d.TotalDelay;
                            _d.TotalDelay2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();


                        });
                        $scope.dg_route_ds = response4;


                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    ///////////////////////////////////

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                ///////////////////////////////////

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            /////////////////////////////////////

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'crewreportsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_ds = null;
            $scope.bind();
        }

    };
    $scope.selected_employee_id = null;

    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
        }

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
    ///////////////////////////////////
    $scope.dt_from = new Date().addDays(-30);
    $scope.dt_to = new Date();
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
    $scope.scroll_height = $(window).height() - 245;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Flights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'TotalDelay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
        wordWrapEnabled: true,
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
        height: $(window).height() - 275,

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
            else
                $scope.dg_selected = data;


        },
        summary: {
            totalItems: [{
                name: "DelayTotal",
                showInColumn: "TotalDelay2",
                displayFormat: "{0}",

                summaryType: "custom"
            },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalDelay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    $scope.pie_code = {
        type: 'doughnut',
        palette: "bright",
        size: {
            height: $(window).height() - 265
        },
        // dataSource: dataSource,
        bindingOptions: {
            dataSource: 'dg_ds'
        },
        //title: {
        //    text: "Delays (Codes)",
        //    margin: { bottom: 20 },
        //    font: {
        //        size:20,
        //    }
        //},
        margin: {
            top: 20
        },
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 10
        },
        "export": {
            enabled: false
        },
        series: [{
            argumentField: "Title",
            valueField: "TotalDelay",
            label: {
                // backgroundColor:'transparent',
                visible: true,
                font: {
                    size: 12,
                    //  color:'black',
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "outside",
                customizeText: function (arg) {

                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],

    };
    $scope.pie_src = {
        type: 'doughnut',
        palette: "ocean",
        size: {
            height: $(window).height() - 400
        },
        // dataSource: dataSource,
        bindingOptions: {
            dataSource: 'grp_src'
        },

        margin: {
            top: 20
        },
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 10
        },
        "export": {
            enabled: false
        },
        series: [{
            argumentField: "FromAirportIATA",
            valueField: "TotalDelay",
            label: {
                // backgroundColor:'transparent',
                visible: true,
                font: {
                    size: 12,
                    //  color:'black',
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "outside",
                customizeText: function (arg) {

                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],

        onPointClick: function (e) {
            var point = e.target;
            $scope.grp_src_items = point.data.Items;

        },

    };
    $scope.bar_src = {
        palette: "ocean",
        legend: { visible: false },
        size: {
            height: 200
        },
        bindingOptions: {
            dataSource: 'grp_src_items'
        },
        series: {
            barWidth: 30,
            argumentField: "Code",
            valueField: "TotalDelay",
            // name: "My oranges",
            type: "bar",
            // color: '#ffaa66'
        }
    };
    $scope.pie_reg = {
        type: 'doughnut',
        palette: "vintage",
        size: {
            height: $(window).height() - 400
        },
        // dataSource: dataSource,
        bindingOptions: {
            dataSource: 'grp_reg'
        },

        margin: {
            top: 20
        },
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 10
        },
        "export": {
            enabled: false
        },
        series: [{
            argumentField: "Register",
            valueField: "TotalDelay",
            label: {
                // backgroundColor:'transparent',
                visible: true,
                font: {
                    size: 12,
                    //  color:'black',
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "outside",
                customizeText: function (arg) {

                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        onPointClick: function (e) {
            var point = e.target;
            $scope.grp_reg_items = point.data.Items;

        },
    };
    $scope.bar_reg = {
        palette: "vintage",
        legend: { visible: false },
        size: {
            height: 200
        },
        bindingOptions: {
            dataSource: 'grp_reg_items'
        },
        series: {
            barWidth: 30,
            argumentField: "Code",
            valueField: "TotalDelay",
            // name: "My oranges",
            type: "bar",
            // color: '#ffaa66'
        }
    };
    $scope.pie_route = {
        type: 'doughnut',
        palette: "violet",
        size: {
            height: $(window).height() - 400
        },
        // dataSource: dataSource,
        bindingOptions: {
            dataSource: 'grp_route'
        },

        margin: {
            top: 20
        },
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 10
        },
        "export": {
            enabled: false
        },
        series: [{
            argumentField: "Route",
            valueField: "TotalDelay",
            label: {
                // backgroundColor:'transparent',
                visible: true,
                font: {
                    size: 12,
                    //  color:'black',
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "outside",
                customizeText: function (arg) {

                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        onPointClick: function (e) {
            var point = e.target;
            $scope.grp_route_items = point.data.Items;

        },
    };
    $scope.bar_route = {
        palette: "violet",
        legend: { visible: false },
        size: {
            height: 200
        },
        bindingOptions: {
            dataSource: 'grp_route_items'
        },
        series: {
            barWidth: 30,
            argumentField: "Code",
            valueField: "TotalDelay",
            // name: "My oranges",
            type: "bar",
            // color: '#ffaa66'
        }
    };
    //////////////////////////////////
    $scope.dg_src_columns = [
        { dataField: 'FromAirportIATA', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Flights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'TotalDelay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
    ];

    $scope.dg_src_selected = null;
    $scope.dg_src_instance = null;
    $scope.dg_src_ds = null;
    $scope.grp_src = null;
    $scope.dg_src = {
        wordWrapEnabled: true,
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
        height: $(window).height() - 175,

        columns: $scope.dg_src_columns,
        onContentReady: function (e) {
            if (!$scope.dg_src_instance)
                $scope.dg_src_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_src_selected = null;
            }
            else
                $scope.dg_src_selected = data;


        },
        summary: {
            totalItems: [{
                name: "DelayTotal",
                showInColumn: "TotalDelay2",
                displayFormat: "{0}",

                summaryType: "custom"
            },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalDelay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_src_ds'
        }
    };
    ///////////////////////////////////
    $scope.dg_reg_columns = [
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Flights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'TotalDelay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
    ];

    $scope.dg_reg_selected = null;
    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = null;
    $scope.dg_reg = {
        wordWrapEnabled: true,
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
        height: $(window).height() - 175,

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
        summary: {
            totalItems: [{
                name: "DelayTotal",
                showInColumn: "TotalDelay2",
                displayFormat: "{0}",

                summaryType: "custom"
            },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalDelay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_reg_ds'
        }
    };
    ///////////////////////////////////
    $scope.dg_route_columns = [
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, fixed: false, fixedPosition: 'left' },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Flights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'TotalDelay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
    ];

    $scope.dg_route_selected = null;
    $scope.dg_route_instance = null;
    $scope.dg_route_ds = null;
    $scope.dg_route = {
        wordWrapEnabled: true,
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
        height: $(window).height() - 175,

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
        summary: {
            totalItems: [{
                name: "DelayTotal",
                showInColumn: "TotalDelay2",
                displayFormat: "{0}",

                summaryType: "custom"
            },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalDelay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_route_ds'
        }
    };
    ///////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yyyy-MMM-dd' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        {
            caption: 'Airports', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            ]
        },

        {
            caption: 'Departure',
            columns: [

                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [


                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
            ]
        },

        {
            caption: 'Times', fixed: true, fixedPosition: 'right', columns: [
                //  { dataField: 'DurationH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dhh', },
                //  { dataField: 'DurationM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dmm', },
                { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]
        },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
        height: $(window).height() - 235,

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
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ActualFlightHOffBlock * 60 + options.value.ActualFlightMOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    //////////////////////////////////

    //////////////////////////////////
    $scope.doRefresh = false;

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
    $scope.bind1 = function () {
        //iruser558387
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        console.log($scope.dt_from);
        var url = 'odata/crew/report/main?date=' + _dt;//2019-06-06T00:00:00';
        if (!$scope.dg_ds) {
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
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };








    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Delays';
        $('.flightdelays').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);