'use strict';
app.controller('delaybidailyController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'biService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, biService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams;
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Overall", id: 'overall' },
        { text: "Categories", id: 'category' },
        // { text: "Technical", id: 'technical' },
        { text: "Airports", id: 'airport' },
        //{ text: "Registers", id: 'register' },
        //{ text: "Route", id: 'route' },
        { text: 'Items', id: 'stats' }



    ];
    $scope.activeTab = "";
    $scope.isPivotVisible = false;
    $scope.doTabChanged = function (id) {
        switch (id) {
            case 'overall':
                $scope.activeTab = id;
                $scope.bindmain(function () {
                    $scope.buildmain();
                });
                break;
            case 'category':
                $scope.activeTab = id;
                $scope.bindcats(function () {
                    $scope.buildcats(function () {

                        $scope.bindmain(function () {

                            $scope.ds_catsRatio = [];
                            $.each($scope.ds_cats, function (_i, _d) {
                                var total = Enumerable.From($scope.ds_main).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month + ' && $.Day==' + _d.Day).FirstOrDefault();
                                if (total && total.Delay > 0)
                                    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                                else
                                    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = 0;
                                $scope.ds_catsRatio.push(_d);
                            });

                        });
                    });
                });
                $scope.getCatsSummary(function () { });
                break;
            case 'technical':
                $scope.activeTab = id;
                //$scope.bindTechnical();


                break;
            case 'airport':
                $scope.activeTab = id;
                $scope.bindapts(function () {
                    $scope.buildapts(function () {
                        $scope.bindmain(function () {

                            $scope.ds_aptsRatio = [];
                            $.each($scope.ds_apts, function (_i, _d) {
                                var total = Enumerable.From($scope.ds_main).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month + ' && $.Day==' + _d.Day).FirstOrDefault();
                                if (total && total.Delay > 0)
                                    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                                else
                                    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = 0;
                                $scope.ds_aptsRatio.push(_d);
                            });

                        });
                    });
                });
                $scope.getAptsSummary(function () { });
                break;
            case 'route':
                $scope.activeTab = id;
                //$scope.bindRoutes();

                break;
            case 'aircraft':
                $scope.activeTab = id;
                //$scope.bindAircrafts();
                break;
            case 'register':
                $scope.activeTab = id;
                //$scope.bindRegisters();

                break;

            case 'stats':


                $scope.activeTab = id;
                if ($scope.dg_items_instance)
                    $scope.dg_items_instance.refresh();
                break;

            default:
                break;
        }
    };
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {

            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $scope.activeTab = "";

            $scope.doTabChanged(id);



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
    ////////////////////////////////////
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
    ////////////////////////////////
    $scope.ds_year = [1398, 1399, 1400];
    $scope.ds_month = [
        { title: 'فروردین', id: 1 },
        { title: 'اردیبهشت', id: 2 },
        { title: 'خرداد', id: 3 },
        { title: 'تیر', id: 4 },
        { title: 'مرداد', id: 5 },
        { title: 'شهریور', id: 6 },
        { title: 'مهر', id: 7 },
        { title: 'آبان', id: 8 },
        { title: 'آذر', id: 9 },
        { title: 'دی', id: 10 },
        { title: 'بهمن', id: 11 },
        { title: 'اسفند', id: 12 },
    ];
    $scope.yearmonth = null;
    $scope.ds_yearmonth = [];
    $scope.sb_yearmonth = {

        showClearButton: true,
        searchEnabled: true,
        displayExpr: 'title',

        onSelectionChanged: function (e) {
            //$scope.fillDsYearMonth();
            //if ($scope.dobind) {
            //   $scope.bindmain();
            //}
        },
        bindingOptions: {
            value: 'yearmonth',
            dataSource: 'ds_yearmonth',

        }
    };

    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    ////////////////////////////////////
    const _dayNames = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,


    ];
    $scope.dayNames = _dayNames;
    ////////////////////////////////////
    $scope.chart_main_instance = null;
    $scope.mainSeries = [];
    $scope.chart_main = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        onDone: function (e) {

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_main_instance)
                $scope.chart_main_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Harmony Light',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'mainSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.dcSeries = [];
    $scope.chart_dc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay(minutes) / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Carmine',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'dcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.otfcSeries = [];
    $scope.chart_otfc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'OnTime Flights / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Bright',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'otfcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.dfcSeries = [];
    $scope.chart_dfc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delayed Flights / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Dark Violet',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'dfcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };


    $scope.cycleSeries = [];
    $scope.chart_cycle = {
        legend: {
            font: { size: 15 },
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        margin: {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        },
        title: {
            text: 'Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        palette: "Dark Moon",

        commonSeriesSettings: {
            type: "stackedBar",//stackedBar

            argumentField: "Day",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + (arg.value) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + (arg.total)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'cycleSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.blSeries = [];
    $scope.chart_bl = {
        legend: {

            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            font: { size: 15 },
        },
        margin: {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        },
        title: {
            text: 'Block Time',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        palette: "Carmine",

        commonSeriesSettings: {
            type: "bar",//stackedBar

            argumentField: "Day",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
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
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'blSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };
    //////Cats /////////////////////////
    $scope.catdlSeries = [];
    $scope.chart_catdl = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },

        palette: 'Carmine',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
                cat: e.target.data.ICategory
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_cats",
            series: 'catdlSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.catdcSeries = [];
    $scope.chart_catdc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay(minutes) / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Harmony Light',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
                cat: e.target.data.ICategory
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_cats",
            series: 'catdcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.catcycleSeries = [];
    $scope.chart_catcycle = {
        legend: {
            font: { size: 15 },
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        margin: {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        },
        title: {
            text: 'Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        palette: "Dark Moon",

        commonSeriesSettings: {
            type: "bar",//stackedBar

            argumentField: "Day",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + (arg.value) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + (arg.total)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'catcycleSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.catRatioSeries = [];
    $scope.chart_catratio = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay / Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        palette: 'Bright',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_catsRatio",
            series: 'catRatioSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.catDelaySeries = [];
    $scope.chart_catdelay = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'bar',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        palette: 'Office',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'catDelaySeries',
            'argumentAxis.categories': 'dayNames',

        }
    };
    ////////APT////////////////////////
    $scope.aptdlSeries = [];
    $scope.chart_aptdl = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },

        palette: 'Material',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
                apt: e.target.data.Airport
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_apts",
            series: 'aptdlSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptdcSeries = [];
    $scope.chart_aptdc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay(minutes) / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Carmine',
        onPointClick: function (e) {
            var data = {
                year: e.target.data.Year,
                month: e.target.data.Month,
                day: e.target.data.Day,
                apt: e.target.data.Airport
            };
            $rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_apts",
            series: 'aptdcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptotfcSeries = [];
    $scope.chart_aptotfc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'OnTime Flights / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Bright',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_apts",
            series: 'aptotfcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptdfcSeries = [];
    $scope.chart_aptdfc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delayed Flights / All Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Dark Violet',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_apts",
            series: 'aptdfcSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptlegSeries = [];
    $scope.chart_aptleg = {
        legend: {
            font: { size: 15 },
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        margin: {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        },
        title: {
            text: 'Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        palette: "Dark Moon",

        commonSeriesSettings: {
            type: "stackedBar",//stackedBar

            argumentField: "Day",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + (arg.value) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + (arg.total)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "ds_apts",
            series: 'aptlegSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptRatioSeries = [];
    $scope.chart_aptratio = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay / Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: arg.value + '%' };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value) + '%';
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 400,
        },
        palette: 'Bright',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_aptsRatio",
            series: 'aptRatioSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptcycleSeries = [];
    $scope.chart_aptcycle = {
        legend: {
            font: { size: 15 },
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        margin: {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        },
        title: {
            text: 'Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        palette: "Dark Moon",

        commonSeriesSettings: {
            type: "bar",//stackedBar

            argumentField: "Day",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + (arg.value) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + (arg.total)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'aptcycleSeries',
            'argumentAxis.categories': 'dayNames',

        }
    };

    $scope.aptDelaySeries = [];
    $scope.chart_aptdelay = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                // displayMode: 'rotate',
                // rotationAngle: -45,
                overlappingBehavior: 'stagger',
            },

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 15,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Total Delay',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'bar',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },


        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) };

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 400,
        },
        palette: 'Office',
        onPointClick: function (e) {
            //var data = {
            //    year: e.target.data.Year,
            //    month: e.target.data.Month,
            //    day: e.target.data.Day,
            //};
            //$rootScope.$broadcast('InittblDelayItems', data);
        },
        bindingOptions: {
            "dataSource": "ds_main",
            series: 'aptDelaySeries',
            'argumentAxis.categories': 'dayNames',

        }
    };
    /////////STATS/////////////////////
    $scope.dg_items_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'STDDayPersian', caption: 'Date(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 2, sortOrder: 'asc' },
        {
            caption: 'Route',
            columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'Delay',
            columns: [
                { dataField: 'Delay2', caption: 'hh:mm', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'Delay', name: 'Delaymm', caption: 'mm', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
                //{ dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
                { dataField: 'MapTitle2', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
                { dataField: 'Remark', caption: 'Operator Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
                { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

                { dataField: 'Category', caption: 'IATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },


            ]
        },




        {
            caption: 'Dep/Arr',
            columns: [
                { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                { dataField: 'TakeOffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
                { dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                //   { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

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


    ];


    $scope.dg_items_selected = null;
    $scope.dg_items_instance = null;
    $scope.dg_items_ds = null;
    $scope.dg_height = $(window).height() - 150;
    $scope.dg_items = {
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


        columns: $scope.dg_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_items_instance)
                $scope.dg_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_items_selected = null;
            }
            else
                $scope.dg_items_selected = data;


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
                    column: "Delaymm",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



            ],
            calculateCustomSummary: function (options) {

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








            }
        },
        "export": {
            enabled: true,
            fileName: "Delay_Items",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Items</span>"
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
            if (e.rowType === "data" && e.column.dataField == "Delay2")
                e.cellElement.addClass('rptdelayfield');
        },
        bindingOptions: {
            dataSource: 'dg_items_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: true
        },

    };
    ///////////////////////////////////

    $scope.buildmain = function () {
        $scope.mainSeries = [];
        $scope.dcSeries = [];
        $scope.otfcSeries = [];
        $scope.dfcSeries = [];
        $scope.cycleSeries = [];
        $scope.blSeries = [];
        var ymsds = Enumerable.From($scope.yearmonth).OrderBy('$.year').ThenBy('$.month').ToArray();
        var c = 0;
        $.each(ymsds, function (_i, ym) {
            $scope.cycleSeries.push({ valueField: 'FlightCount' + '_' + ym.year + '_' + ym.month, name: ym.title + '(delayed)', stack: ym.title, color: $rootScope.getColorFromSetRed(c) });
            $scope.cycleSeries.push({ valueField: 'OnTimeFlightCount' + '_' + ym.year + '_' + ym.month, name: ym.title + '(ontime)', stack: ym.title, color: $rootScope.getColorFromSetGreen(c) });

            $scope.blSeries.push({ valueField: 'ABlockTime' + '_' + ym.year + '_' + ym.month, name: ym.title + '(block-time)', /*color: $rootScope.getColorFromSetGray(c)*/ });
            $scope.blSeries.push({ valueField: 'Delay' + '_' + ym.year + '_' + ym.month, name: ym.title + '(delay)', type: 'scatter' });

            var dlSeries = {
                year: ym.year,
                month: ym.month,
                monthTitle: ym.monthTitle,
                valueField: 'Delay' + '_' + ym.year + '_' + ym.month,
                name: 'Delay(' + ym.year + ' - ' + ym.monthTitle + ')',
                showInLegend: true,
                //color: $rootScope.getColorFromSet3(c),
            };
            var _dcSeries = {
                year: ym.year,
                month: ym.month,
                monthTitle: ym.monthTitle,
                valueField: 'DelayPerLeg' + '_' + ym.year + '_' + ym.month,
                name: 'DC(' + ym.year + ' - ' + ym.monthTitle + ')',
                showInLegend: true,

                //color: $rootScope.getColorFromSet3(c),
            };

            var _otfcSeries = {
                year: ym.year,
                month: ym.month,
                monthTitle: ym.monthTitle,
                valueField: 'OnTimeFlightsPerAll' + '_' + ym.year + '_' + ym.month,
                name: 'OTFC(' + ym.year + ' - ' + ym.monthTitle + ')',
                showInLegend: true,
                //color: $rootScope.getColorFromSet2(c),

            };

            var _dfcSeries = {
                year: ym.year,
                month: ym.month,
                monthTitle: ym.monthTitle,
                valueField: 'DelayedFlightsPerAll' + '_' + ym.year + '_' + ym.month,
                name: 'DFC(' + ym.year + ' - ' + ym.monthTitle + ')',
                showInLegend: true,
                //dashStyle:'dot',
                // color: $rootScope.getColorFromSet2(c),

            };


            c++;

            $scope.mainSeries.push(dlSeries);
            $scope.dcSeries.push(_dcSeries);
            $scope.otfcSeries.push(_otfcSeries);
            $scope.dfcSeries.push(_dfcSeries);
        });


    };

    $scope.buildcats = function (callback) {
        $scope.catdlSeries = [];
        $scope.catdcSeries = [];

        $scope.catcycleSeries = [];
        $scope.catDelaySeries = [];
        $scope.catRatioSeries = [];

        var ymsds = Enumerable.From($scope.yearmonth).OrderBy('$.year').ThenBy('$.month').ToArray();
        var c = 0;
        $.each(ymsds, function (_i, ym) {
            $scope.catcycleSeries.push({ valueField: 'AFlightCount' + '_' + ym.year + '_' + ym.month, name: ym.title, });
            $scope.catDelaySeries.push({ valueField: 'Delay' + '_' + ym.year + '_' + ym.month, name: ym.title, });

            $.each($scope.selectedCats, function (_d, cat) {

                //  $scope.cycleSeries.push({ valueField: 'OnTimeFlightCount' + '_' + ym.year + '_' + ym.month, name: ym.title + '(ontime)', stack: ym.title, color: $rootScope.getColorFromSetGreen(c) });
                $scope.catRatioSeries.push({ valueField: 'DelayRatio' + '_' + ym.year + '_' + ym.month + '_' + cat, name: ym.title + ' - ' + cat, });

                $scope.catdlSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'Delay' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: 'Delay(' + ym.year + ' - ' + ym.monthTitle + ' - ' + cat + ')',
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet3(c),
                });
                $scope.catdcSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'DelayPerLeg' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: 'DC(' + ym.year + ' - ' + ym.monthTitle + ' - ' + cat + ')',
                    showInLegend: true,

                    //color: $rootScope.getColorFromSet3(c),
                });




                c++;
            });



        });

        if (callback)
            callback();
    };


    $scope.buildapts = function (callback) {
        $scope.aptdlSeries = [];
        $scope.aptlegSeries = [];
        $scope.aptdcSeries = [];
        $scope.aptotfcSeries = [];
        $scope.aptdfcSeries = [];

        $scope.aptcycleSeries = [];
        $scope.aptDelaySeries = [];
        $scope.aptRatioSeries = [];

        var ymsds = Enumerable.From($scope.yearmonth).OrderBy('$.year').ThenBy('$.month').ToArray();
        var c = 0;
        $.each(ymsds, function (_i, ym) {
            $scope.aptcycleSeries.push({ valueField: 'AFlightCount' + '_' + ym.year + '_' + ym.month, name: ym.title, });
            $scope.aptDelaySeries.push({ valueField: 'Delay' + '_' + ym.year + '_' + ym.month, name: ym.title, });




            $.each($scope.selectedApts, function (_d, cat) {


                $scope.aptlegSeries.push({ valueField: 'FlightCount' + '_' + ym.year + '_' + ym.month + '_' + cat, name: cat + '-' + ym.title + '(d)', stack: ym.title + '-' + cat, });
                $scope.aptlegSeries.push({ valueField: 'OnTimeFlightCount' + '_' + ym.year + '_' + ym.month + '_' + cat, name: cat + '-' + ym.title + '(o)', stack: ym.title + '-' + cat, });


                $scope.aptRatioSeries.push({ valueField: 'DelayRatio' + '_' + ym.year + '_' + ym.month + '_' + cat, name: ym.title + ' - ' + cat, });

                $scope.aptdlSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'Delay' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: ym.year + '-' + ym.monthTitle + '-' + cat,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet3(c),
                });
                $scope.aptdcSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'DelayPerLeg' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: ym.year + '-' + ym.monthTitle + '-' + cat,
                    showInLegend: true,

                    //color: $rootScope.getColorFromSet3(c),
                });
                $scope.aptotfcSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'OnTimeFlightsPerAll' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: ym.year + '-' + ym.monthTitle + '-' + cat,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),

                });

                $scope.aptdfcSeries.push({
                    year: ym.year,
                    month: ym.month,
                    monthTitle: ym.monthTitle,
                    valueField: 'DelayedFlightsPerAll' + '_' + ym.year + '_' + ym.month + '_' + cat,
                    name: ym.year + '-' + ym.monthTitle + '-' + cat,
                    showInLegend: true,
                    //dashStyle:'dot',
                    // color: $rootScope.getColorFromSet2(c),

                });



                c++;
            });



        });

        if (callback)
            callback();
    };
    ////////////////////////////////////
    $scope.ds_main = [];
    $scope.ds_main_summary = [];
    $scope.bindmain = function (callback) {
        var exist = Enumerable.From($scope.ds_main).Select('$.YearMonth').Distinct().ToArray();

        var news = Enumerable.From($scope.yearmonth).Where(function (x) { return exist.indexOf(x.ym) == -1; }).ToArray();
        if (news && news.length > 0) {
            var yms = Enumerable.From(news).Select('$.ym').ToArray().join('#');
            $scope.loadingVisible = true;
            biService.getDelayDailyYMS(yms).then(function (response) {
                $scope.loadingVisible = false;
                $.each(response.items, function (_i, _d) {
                    _d['Delay' + '_' + _d.Year + '_' + _d.Month] = _d.Delay;
                    _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.Month] = _d.DelayPerLeg;
                    _d['OnTimeFlightsPerAll' + '_' + _d.Year + '_' + _d.Month] = _d.OnTimeFlightsPerAll;
                    _d['DelayedFlightsPerAll' + '_' + _d.Year + '_' + _d.Month] = _d.DelayedFlightsPerAll;
                    _d['FlightCount' + '_' + _d.Year + '_' + _d.Month] = _d.FlightCount;
                    _d['AFlightCount' + '_' + _d.Year + '_' + _d.Month] = _d.AFlightCount;
                    _d['OnTimeFlightCount' + '_' + _d.Year + '_' + _d.Month] = _d.OnTimeFlightCount;
                    _d['ABlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.ABlockTime;
                    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    _d.PreDelay2 = $scope.formatMinutes(_d.PreDelay);
                    $scope.ds_main.push(_d);
                });
                $.each(response.summary, function (_i, _d) {
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    $scope.ds_main_summary.push(_d);
                });
                $scope.ds_main_summary = Enumerable.From($scope.ds_main_summary).OrderBy('$.Year').ThenBy('$.Month').ToArray();
                if (callback)
                    callback();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else callback();

    };
    $scope.tagcats = [];
    $scope.tag_cats = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        displayExpr: 'ICategory',
        valueExpr: 'ICategory',
        bindingOptions: {
            value: 'tagcats',
            dataSource: 'ds_catNames'
        }
    };
    $scope.getCatNames = function (callback) {
        if ($scope.ds_catNames.length == 0)
            biService.getCatNames().then(function (response) {
                $scope.ds_catNames = response.categoryNames;
                if (callback)
                    callback();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        else
            callback();
    };
    $scope.tagapts = [];
    $scope.tag_apts = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,

        bindingOptions: {
            value: 'tagapts',
            dataSource: 'ds_aptNames'
        }
    };
    $scope.rangeDs = [
        { Id: 1, Title: 'All' },
        { Id: 2, Title: 'Under 30 min' },
        { Id: 3, Title: 'Above 30 min' },
        { Id: 4, Title: 'Between 31 min & 60 min' },
        { Id: 5, Title: 'Between 1 hrs & 2 hrs' },
        { Id: 6, Title: 'Between 2 hrs & 3 hrs' },
        { Id: 7, Title: 'Above 3 hrs' },
    ];
    $scope.range = 1;
    $scope.sb_range = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.rangeDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'range',


        }
    };
    $scope.getApts = function (callback) {
        if ($scope.ds_aptNames.length == 0)
            biService.getAirports().then(function (response) {
                $scope.ds_aptNames = response;
                if (callback)
                    callback();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        else
            callback();
    };
    $scope.ds_cats = [];
    $scope.ds_cats_summary = [];
    $scope.ds_catsRatio = [];
    $scope.ds_catNames = [];
    $scope.ds_aptNames = [];
    $scope.ds_apts = [];
    $scope.ds_apts_summary = [];
    $scope.getCatsSummary = function (callback) {
        var yms = Enumerable.From($scope.yearmonth).Select('$.ym').ToArray().join('#');
        biService.getMonthCategoriesSummary(yms).then(function (response) {
            $.each(response.summary, function (_i, _d) {

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
                
            });
            $scope.ds_cats_summary = Enumerable.From(response.summary).OrderBy('$.Year').ThenBy('$.Month').ThenByDescending('$.Delay').ToArray();

            if (callback)
                callback();
        });
    };
    $scope.bindcats = function (callback) {
        $scope.getCatNames(function () {
            var exist = Enumerable.From($scope.ds_cats).Select('$.YearMonthCat').Distinct().ToArray();
            var ymscats = [];
            $.each($scope.yearmonth, function (_i, _ym) {
                $.each($scope.selectedCats, function (_j, _c) {
                    ymscats.push(_ym.ym + '-' + _c);
                });
            });
            var news = Enumerable.From(ymscats).Where(function (x) { return exist.indexOf(x) == -1; }).ToArray();
            if (news && news.length > 0) {
                var yms = Enumerable.From(news).Select('$.replaceAll(" ", "_")').ToArray().join('#');

                $scope.loadingVisible = true;

                biService.getDelayCategoriesDailyYMSCat(yms).then(function (response) {
                    $scope.loadingVisible = false;

                    $.each(response.categories, function (_i, _d) {
                        //_d['Delay' + '_' + _d.Year + '_' + _d.Month] = _d.Delay;
                        _d.id = _i + 1;
                        _d['ArgNum'] = _d.Day;
                        _d['ArgStr'] = _d.Day;
                        _d['Delay' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = _d['Delay'];
                        _d['Count' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = _d['Count'];
                        _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = _d['DelayPerLeg'];
                        _d['CountPerLeg' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = _d['CountPerLeg'];
                        _d['AFlightCount' + '_' + _d.Year + '_' + _d.Month] = _d['AFlightCount'];
                        _d.DelayPerLeg2 = $scope.formatMinutes(_d.DelayPerLeg);
                        _d.PreDelayPerLeg2 = $scope.formatMinutes(_d.PreDelayPerLeg);
                        _d.Delay2 = $scope.formatMinutes(_d.Delay);
                        _d.PreDelay2 = $scope.formatMinutes(_d.PreDelay);

                        _d.DelayUnder30Time2 = $scope.formatMinutes(_d.DelayUnder30Time);
                        _d.DelayOver30Time2 = $scope.formatMinutes(_d.DelayOver30Time);
                        _d.PreDelayUnder30Time2 = $scope.formatMinutes(_d.PreDelayUnder30Time);
                        _d.PreDelayOver30Time2 = $scope.formatMinutes(_d.PreDelayOver30Time);

                        _d.Delay3060Time2 = $scope.formatMinutes(_d.Delay3060Time);
                        _d.Delay60120Time2 = $scope.formatMinutes(_d.Delay60120Time);
                        _d.Delay120180Time2 = $scope.formatMinutes(_d.Delay120180Time);
                        _d.DelayOver180Time2 = $scope.formatMinutes(_d.DelayOver180Time);

                        _d.PreDelay3060Time2 = $scope.formatMinutes(_d.PreDelay3060Time);
                        _d.PreDelay60120Time2 = $scope.formatMinutes(_d.PreDelay60120Time);
                        _d.PreDelay120180Time2 = $scope.formatMinutes(_d.PreDelay120180Time);
                        _d.PreDelayOver180Time2 = $scope.formatMinutes(_d.PreDelayOver180Time);

                        //var total = Enumerable.From($scope.ds_main).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month + ' && $.Day==' + _d.Day).FirstOrDefault();
                        //if (total) {
                        //    _d['DelayTotal' + '_' + _d.Year + '_' + _d.Month] = total.Delay;

                        //}
                        //if (total && total.Delay > 0)
                        //    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                        //else
                        //    _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = 0;
                        $scope.ds_cats.push(_d);
                    });
                    //$.each(response.summary, function (_i, _d) {

                    //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    //    $scope.ds_cats_summary.push(_d);
                    //});
                    //$scope.ds_cats_summary = Enumerable.From($scope.ds_cats_summary).OrderBy('$.Year').ThenBy('$.Month').ThenByDescending('$.Delay').ToArray();

                    if (callback)
                        callback();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else callback();
        });



    };
    $scope.getAptsSummary = function (callback) {
        var yms = Enumerable.From($scope.yearmonth).Select('$.ym').ToArray().join('#');
        biService.getMonthAirportsSummary(yms).then(function (response) {
            $.each(response.summary, function (_i, _d) {

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
                
            });
            $scope.ds_apts_summary = Enumerable.From(response.summary).OrderBy('$.Year').ThenBy('$.Month').ThenByDescending('$.Delay').ToArray();
            if (callback)
                callback();
        });
    };
    $scope.bindapts = function (callback) {

        $scope.getApts(function () {
            var exist = Enumerable.From($scope.ds_apts).Select(/*'$.YearMonthCat'*/ '$.YearMonth').Distinct().ToArray();
            var ymsapts = [];
            $.each($scope.yearmonth, function (_i, _ym) {
                // $.each($scope.selectedCats, function (_j, _c) {
                ymsapts.push(_ym.ym /*+ '-' + _c*/);
                // });
            });
            var news = Enumerable.From(ymsapts).Where(function (x) { return exist.indexOf(x) == -1; }).ToArray();
            if (news && news.length > 0) {
                var yms = Enumerable.From(news).Select('$.replaceAll(" ", "_")').ToArray().join('#');

                $scope.loadingVisible = true;

                biService.getDelayAirportsDailyYMS(yms).then(function (response) {
                    $scope.loadingVisible = false;

                    $.each(response.airports, function (_i, _d) {
                        //_d['Delay' + '_' + _d.Year + '_' + _d.Month] = _d.Delay;
                        _d.id = _i + 1;
                        _d['ArgNum'] = _d.Day;
                        _d['ArgStr'] = _d.Day;
                        _d['Delay' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d['Delay'];
                        _d['Count' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d['Count'];
                        _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d['DelayPerLeg'];
                        _d['CountPerLeg' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d['CountPerLeg'];
                        _d['AFlightCount' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d['AFlightCount'];

                        //_d['OnTimeFlightsPerAll' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d.OnTimeFlightsPerAll;
                        _d['DelayedFlightsPerAll' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d.DelayedFlightsPerAll;
                        _d['FlightCount' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d.FlightCount;

                        _d['OnTimeFlightCount' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = _d.OnTimeFlightCount;


                        _d.DelayPerLeg2 = $scope.formatMinutes(_d.DelayPerLeg);
                        _d.PreDelayPerLeg2 = $scope.formatMinutes(_d.PreDelayPerLeg);
                        _d.Delay2 = $scope.formatMinutes(_d.Delay);
                        _d.PreDelay2 = $scope.formatMinutes(_d.PreDelay);

                        _d.DelayUnder30Time2 = $scope.formatMinutes(_d.DelayUnder30Time);
                        _d.DelayOver30Time2 = $scope.formatMinutes(_d.DelayOver30Time);
                        _d.PreDelayUnder30Time2 = $scope.formatMinutes(_d.PreDelayUnder30Time);
                        _d.PreDelayOver30Time2 = $scope.formatMinutes(_d.PreDelayOver30Time);

                        _d.Delay3060Time2 = $scope.formatMinutes(_d.Delay3060Time);
                        _d.Delay60120Time2 = $scope.formatMinutes(_d.Delay60120Time);
                        _d.Delay120180Time2 = $scope.formatMinutes(_d.Delay120180Time);
                        _d.DelayOver180Time2 = $scope.formatMinutes(_d.DelayOver180Time);

                        _d.PreDelay3060Time2 = $scope.formatMinutes(_d.PreDelay3060Time);
                        _d.PreDelay60120Time2 = $scope.formatMinutes(_d.PreDelay60120Time);
                        _d.PreDelay120180Time2 = $scope.formatMinutes(_d.PreDelay120180Time);
                        _d.PreDelayOver180Time2 = $scope.formatMinutes(_d.PreDelayOver180Time);


                        $scope.ds_apts.push(_d);
                    });
                    //$.each(response.summary, function (_i, _d) {

                    //    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    //    $scope.ds_apt_summary.push(_d);
                    //});
                    //$scope.ds_apts_summary = Enumerable.From($scope.ds_apts_summary).OrderBy('$.Year').ThenBy('$.Month').ThenByDescending('$.Delay').ToArray();

                    if (callback)
                        callback();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else callback();
        });



    };

    $scope.bindItems = function () {
        $scope.dg_items_ds = [];
        var yms = Enumerable.From($scope.yearmonth).Select('$.ym').ToArray().join('^');
        var cat = $scope.tagcats && $scope.tagcats.length > 0 ? Enumerable.From($scope.tagcats).Select('$.replaceAll(" ", "_")').ToArray().join('^') : '-';
        var apt = $scope.tagapts && $scope.tagapts.length > 0 ? $scope.tagapts.join('^') : '-';
        biService.getDelayItemsYMS(yms, cat, apt, $scope.range).then(function (response) {

            $.each(response, function (_i, _d) {

                var std = (new Date(_d.STDDay));
                persianDate.toLocale('en');
                _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                _d.Delay2 = $scope.formatMinutes(_d.Delay);


            });
            $scope.dg_items_ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.selectedCats = ['TECHNICAL'];
    $scope.getCatSelectedClass = function (t) {
        var selected = $scope.selectedCats.indexOf(t) != -1;
        if (selected)
            return 'on-type';
        return 'off-type';
    };
    $scope.selectCat = function (t) {
        var exists = $scope.selectedCats.indexOf(t) != -1;


        if (exists) {
            $scope.selectedCats = Enumerable.From($scope.selectedCats).Where('$!="' + t + '"').ToArray();

        }
        else {
            $scope.selectedCats.push(t);

        }
        $scope.bindcats(function () {
            $scope.buildcats(function () {

                $scope.bindmain(function () {

                    $scope.ds_catsRatio = [];
                    $.each($scope.ds_cats, function (_i, _d) {
                        var total = Enumerable.From($scope.ds_main).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month + ' && $.Day==' + _d.Day).FirstOrDefault();
                        if (total && total.Delay > 0)
                            _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                        else
                            _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.ICategory] = 0;
                        $scope.ds_catsRatio.push(_d);
                    });
                    console.log($scope.ds_catsRatio);
                });
            });
        });
    };


    $scope.selectedApts = ['SYZ', 'THR'/*,'KIH','MRX','PGU','AZD','MHD'*/];
    $scope.getAptSelectedClass = function (t) {
        var selected = $scope.selectedApts.indexOf(t) != -1;
        if (selected)
            return 'on-type';
        return 'off-type';
    };
    $scope.selectApt = function (t) {
        var exists = $scope.selectedApts.indexOf(t) != -1;


        if (exists) {
            $scope.selectedApts = Enumerable.From($scope.selectedApts).Where('$!="' + t + '"').ToArray();

        }
        else {
            $scope.selectedApts.push(t);

        }
        $scope.bindapts(function () {
            $scope.buildapts(function () {
                $scope.bindmain(function () {

                    $scope.ds_aptsRatio = [];
                    $.each($scope.ds_apts, function (_i, _d) {
                        var total = Enumerable.From($scope.ds_main).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month + ' && $.Day==' + _d.Day).FirstOrDefault();
                        if (total && total.Delay > 0)
                            _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                        else
                            _d['DelayRatio' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Airport] = 0;
                        $scope.ds_aptsRatio.push(_d);
                    });

                });
            });
        });
    };

    $scope.btn_reload = {

        type: 'success',
        icon: 'refresh',
        width: '100%',

        onClick: function (e) {

            //$scope.bindmain(function () {
            //    $scope.buildmain();
            //});
            $scope.doTabChanged($scope.selectedTabId);
            $scope.bindItems();
        }
    };
    $scope.btn_apply = {

        type: 'default',
        text: 'Apply',
        width: '100%',

        onClick: function (e) {


            $scope.bindItems();
        }
    };
    ///////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 240 },

    };
    /////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Delay';


        $('.delaybidaily').fadeIn(400, function () {

        });
    }
    $scope.$on('$viewContentLoaded', function () {

        $scope.pdate = new persianDate(new Date());
        $scope.month = $scope.pdate.month();

        $scope.nowYear = $scope.pdate.year();
        $scope.nowMonth = $scope.pdate.month();

        $scope.year = 1400;
        $scope.ds_yearmonth = [];
        $scope.pdate = new persianDate(new Date());
        $scope.nowYear = $scope.pdate.year();
        $scope.nowMonth = $scope.pdate.month();
        var c = 1;
        $.each(Enumerable.From($scope.ds_year).OrderByDescending('$').ToArray(), function (_i, _y) {

            $.each(Enumerable.From($scope.ds_month).OrderByDescending('$.id').ToArray(), function (_j, _m) {
                if (_y < $scope.nowYear || (_y == $scope.nowYear && _m.id <= $scope.nowMonth)) {
                    var ym = { id: c, year: _y, month: _m.id, monthTitle: _m.title, ym: _y + '-' + _m.id };
                    if (_m.id < 10)
                        ym.title = _y + '-0' + _m.id;
                    else
                        ym.title = _y + '-' + _m.id;
                    $scope.ds_yearmonth.push(ym);
                    c++;
                }


            });
        });
         $scope.nowMonth = 5;
        $scope.yearmonth = [];
        $scope.yearmonth.push(Enumerable.From($scope.ds_yearmonth).Where('$.year==' + $scope.nowYear + ' && $.month==' + $scope.nowMonth).FirstOrDefault());
        setTimeout(function () {
            $scope.dobind = true;
            $scope.bindItems();
            $scope.getCatNames(function () { });
            $scope.getApts(function () { });
        }, 1000);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);
