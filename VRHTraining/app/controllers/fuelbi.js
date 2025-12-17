'use strict';
app.controller('fuelController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'biService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, biService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams;

    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    //////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Overall", id: 'overall' },
        { text: "Route", id: 'route' },
        { text: "Aircrafts", id: 'aircraft' },
        //{ text: "Pilots", id: 'pilot' },
        //{ text: "Pax", id: 'pax' },
        //{ text: "Legs", id: 'legs' },
        // { text: "Flight Time", id: 'flighttime' },
        // { text: "Weight-Distance", id: 'weightdistance' },

    ];
    $scope.activeTab = "";
    var routeTabBind = false;
    var aircraftTabBind = false;

    $scope.routeCards = null;
    $scope.routesTopDs = [];


    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {

            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $scope.activeTab = "";

            switch (id) {
                case 'overall':
                    $scope.activeTab = id;
                    break;
                case 'route':
                    $scope.activeTab = id;
                    $scope.bindRouteTab();

                    break;
                case 'aircraft':
                    $scope.activeTab = id;
                    $scope.bindAircraftTab();
                    break;
                case 'legs':
                    $scope.activeTab = id;
                    $scope.line_leg_instance.refresh();

                    break;
                case 'flighttime':
                    $scope.activeTab = id;
                    break;
                case 'weightdistance':
                    $scope.activeTab = id;
                    break;

                default:
                    break;
            }


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
    /////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };
    ////////////////////////////////
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
    ///////////////////////////////
    $scope.emptyRouteTab = function () {
        var routeTabBind = false;
        $scope.routeCards = null;
        $scope.routesTopDs = [];
    };
    $scope.bindRouteTab = function () {
        if (!routeTabBind) {
            routeTabBind = false;
            $scope.routeCards = $scope.routes.items;
            $scope.routesTopDs = Enumerable.From($scope.routes.items).OrderByDescending('$.Used').Take(10).ToArray();
            //daaf
        }
    };
    $scope.emptyAircraftTab = function () {
        var aircraftTabBind = false;
        $scope.aircraftCards = null;
        $scope.typesTopDs = [];
    };
    $scope.bindAircraftTab = function () {
        if (!aircraftTabBind) {
            aircraftTabBind = false;
            $scope.aircraftCards = $scope.types.itemsRegisters;
            $scope.typesTopDs = Enumerable.From($scope.types.details).OrderByDescending('$.Month').ToArray();
            //daaf
        }
    };
    $scope.ds_period = [{ id: 1, title: 'Monthly' }, { id: 2, title: '14 Days' }];
    $scope.period = 1;
    $scope.sb_period = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.ds_period,

        onSelectionChanged: function (arg) {
            $scope.bind();
        },
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'period',


        }
    };

    $scope.ds_year = [1398, 1399, 1400];
    $scope.year = $scope.prms.year ? Number($scope.prms.year) : 1399;
    $scope.sb_year = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.ds_year,
        onSelectionChanged: function (e) {
            $scope.emptyRouteTab();
            $scope.emptyAircraftTab();
            $scope.bindMonthly();
        },
        bindingOptions: {
            value: 'year',

        }
    };
    $scope.total = {};
    $scope.routes = {};
    $scope.bind = function () {
        switch ($scope.period) {
            case 1:
                // $scope.bindMonthly();
                break;
            default:
                break;
        }
    };
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {


        $scope.initRouteCard();
    });
    $scope.$on('ngRepeatFinishedRegs', function (ngRepeatFinishedEvent) {


        $scope.initRegCard();
    });

    $scope.initRouteCard = function () {


        //setTimeout(function () {
        var $elem = $('.chartjs-render-monitor');

        $.each($elem, function (_i, _d) {

            var route = ($(_d).data('route'));
            console.log(route);
            var data = Enumerable.From($scope.routes.details).Where('$.Route=="' + route + '"').OrderBy('Number($.ArgNum)').ToArray();
            var lbls = Enumerable.From(data).Select('$.ArgStr').ToArray();
            //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
            var rpk = Enumerable.From(data).Select('$.UsedPerPaxKiloDistanceKM').ToArray();
            var minRpk = Enumerable.From(data).Min('$.UsedPerPaxKiloDistanceKM');
            var maxRpk = Enumerable.From(data).Max('$.UsedPerPaxKiloDistanceKM');
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'F/RPK',
                        backgroundColor: '#f2f2f2',
                        borderColor: '#33adff',
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: rpk, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'transparent',
                                zeroLineColor: 'transparent'
                            },
                            ticks: {
                                fontSize: 2,
                                fontColor: 'transparent'
                            }
                        }],
                        yAxes: [{
                            display: false,
                            ticks: {
                                display: false,
                                min: minRpk,
                                max: maxRpk
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: 4,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);


        });

        //}, 2000);




    };

    $scope.initRegCard = function () {

        console.log('initRegCard');
        //setTimeout(function () {
        var $elem = $('.chartjs-render-monitor-reg');

        $.each($elem, function (_i, _d) {

            var reg = ($(_d).data('reg'));
            console.log(reg);
            var data = Enumerable.From($scope.types.detailsRegisters).Where('$.Register=="' + reg + '"').OrderBy('Number($.ArgNum)').ToArray();
            console.log(data);
            var lbls = Enumerable.From(data).Select('$.ArgStr').ToArray();
            //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
            var rpk = Enumerable.From(data).Select('$.UsedKilo').ToArray();
            var minRpk = Enumerable.From(data).Min('$.UsedKilo');
            var maxRpk = Enumerable.From(data).Max('$.UsedKilo');
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'F/RPK',
                        backgroundColor: '#f2f2f2',
                        borderColor: '#e60073',
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: rpk, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'transparent',
                                zeroLineColor: 'transparent'
                            },
                            ticks: {
                                fontSize: 2,
                                fontColor: 'transparent'
                            }
                        }],
                        yAxes: [{
                            display: false,
                            ticks: {
                                display: false,
                                min: minRpk,
                                max: maxRpk
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: 4,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);


        });

        //}, 2000);




    };

    $scope.myFunction = function () {
        //$scope.finished = 'Repeater has completed';
        //console.log('Lets see how many times this is logged');
        ////'routeCard-THR-SYZ'
        //var $elem = $('.chartjs-render-monitor');
        //$.each($elem, function (_i, _d) {
        //   // alert($(_d).data('route'));
        //});
        //console.log($elem.length);
    }
    $scope.doSomething = function (x) {
        console.log('do some');
        console.log(x);
        var $elem = $('.chartjs-render-monitor');
        $.each($elem, function (_i, _d) {
            console.log($(_d).data('route'));
        });
    };
    $scope.types = [];
    $scope.routesDetails = null;
    const _monthNames = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ];
    const colorSet1 = [
        '#d64161',
        '#00ff00',
        '#6b5b95',
        '#3399ff',

        '#ff7b25',
        '#eca1a6',
        '#ffff4d',
        '#feb236',
        '#b5e7a0',

        '#bdcebe',
        '#e3eaa7',
        '#86af49',
        '#c1946a',
        '#034f84',
        '#c94c4c',
        '#92a8d1',
        '#50394c',
        '#80ced6',
        '#4040a1',
        '#622569',
        '#eeac99',
        '#588c7e',
        '#ffcc5c',
        '#a2836e',
        '#87bdd8',
        '#CC00CC',
        '#00FF00',
        '#03A9F4',
        '#607D8B',
        '#9966FF',
        '#00FF99',
        '#0099CC',
        '#AD1457',
    ];
    $scope.getColorFromSet = function (n) {
        //0 based
        if (n > colorSet1.length - 1)
            n = n % (colorSet1.length - 1);
        return colorSet1[n];
    };
    $scope.bindMonthly = function () {
        $location.search('year', $scope.year);
        $scope.loadingVisible = true;
        biService.getFuelMonthly($scope.year).then(function (response) {
            $scope.loadingVisible = false;
            $scope.total = response;
            var ums = Enumerable.From($scope.total.items).Select('$.ArgStr').ToArray()
            $scope.monthNames2 = Enumerable.From(_monthNames).Where(function (x) { return ums.indexOf(x) != -1; }).ToArray();
            biService.getFuelRoutesYearly($scope.year).then(function (routes) {
                $scope.routes = routes;
                $.each($scope.routes.details, function (_i, _d) {

                    _d[_d.Route2 + 'Used'] = _d.Used;
                    _d[_d.Route2 + 'UsedKilo'] = _d.UsedKilo;
                    _d[_d.Route2 + 'UsedKiloAvg'] = _d.UsedKiloAvg;
                    _d[_d.Route2 + 'Legs'] = _d.Legs;
                    _d[_d.Route2 + 'TotalPax'] = _d.TotalPax;
                    _d[_d.Route2 + 'BlockTime'] = _d.BlockTime;
                    _d[_d.Route2 + 'UsedPerLeg'] = _d.UsedPerLeg;
                    _d[_d.Route2 + 'UsedPerPax'] = _d.UsedPerPax;
                    _d[_d.Route2 + 'UsedPerBlockTime'] = _d.UsedPerBlockTime;

                    _d[_d.Route2 + 'PaxKiloDistanceKM'] = _d.PaxKiloDistanceKM;
                    _d[_d.Route2 + 'UsedPerPaxKiloDistanceKM'] = _d.UsedPerPaxKiloDistanceKM;
                    _d[_d.Route2 + 'SeatKiloDistanceKM'] = _d.SeatKiloDistanceKM;
                    _d[_d.Route2 + 'UsedPerSeatKiloDistanceKM'] = _d.UsedPerSeatKiloDistanceKM;

                });
                $.each($scope.routes.items, function (_i, _d) {




                    _d['FRPK'] = _d.UsedPerPaxKiloDistanceKM;

                    _d['FASK'] = -1 * _d.UsedPerSeatKiloDistanceKM;

                });
                $scope.routes.details = Enumerable.From($scope.routes.details).OrderBy('$.Route').ThenBy('$.ArgNum').ToArray();
                $.each($scope.total.items, function (_i, _d) {
                    $scope.routes.details.push({ OverallUsedPerleg: _d.UsedPerLeg, ArgNum: _d.ArgNum, ArgStr: _d.ArgStr });
                    $scope.routes.details.push({ OverallLegs: _d.Legs, ArgNum: _d.ArgNum, ArgStr: _d.ArgStr });
                });
                // $scope.routesDetails = null;
                $scope.chart_routes_instance.option('valueAxis[0].constantLines', [{ value: $scope.routes.usedAvg, color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 } } }]);

                //$scope.chart_routes_paxleg_instance.option('valueAxis[0].constantLines', [{ value: $scope.routes.usedLegAvg, color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 },position:'outside' } }]);
                //$scope.chart_routes_paxleg_instance.option('valueAxis[1].constantLines', [{ value: $scope.routes.usedPaxAvg, color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 }, position: 'outside' } }]);


                if ($scope.activeTab == 'route')
                    $scope.bindRouteTab();

                biService.getFuelTypesYearly($scope.year).then(function (types) {
                    $scope.types = types;
                    $.each($scope.types.details, function (_i, _d) {
                        _d[_d.AircraftType + "UsedKilo"] = _d.UsedKilo;
                        console.log(_d[_d.AircraftType + "UsedKilo"]);
                    });
                    $scope.typeSeries = [];
                    $scope.rpkRegSeries = [];
                    $scope.rpkTotalRegSeries = [];
                    $.each($scope.types.items, function (_i, _d) {
                        $scope.typeSeries.push({ valueField: _d.AircraftType + 'UsedKilo', name: _d.AircraftType });
                    });
                    //book
                    $.each($scope.types.detailsRegisters, function (_i, _d) {
                        _d[_d.Register + "UsedPerPaxKiloDistanceKM"] = _d.UsedPerPaxKiloDistanceKM;
                        _d[_d.Register + "UsedPerSeatKiloDistanceKM"] = _d.UsedPerSeatKiloDistanceKM;
                        _d[_d.Register + "PaxKiloDistanceKM"] = _d.PaxKiloDistanceKM;
                        _d[_d.Register + "SeatKiloDistanceKM"] = _d.SeatKiloDistanceKM;
                    });
                    $.each($scope.types.itemsRegisters, function (_i, _d) {
                        var _idx = $scope.rpkRegSeries.length / 2;
                        $scope.rpkRegSeries.push({ valueField: _d.Register + 'UsedPerPaxKiloDistanceKM', name: _d.Register + '(RPK)', color: $scope.getColorFromSet(_idx) });
                        $scope.rpkRegSeries.push({ valueField: _d.Register + 'UsedPerSeatKiloDistanceKM', name: _d.Register + '(ASK)', color: $scope.getColorFromSet(_idx), dashStyle: 'dot' });

                        $scope.rpkTotalRegSeries.push({ valueField: _d.Register + 'PaxKiloDistanceKM', name: _d.Register + '(RPK)', color: $scope.getColorFromSet(_idx) });
                        //$scope.rpkTotalRegSeries.push({ valueField: _d.Register + 'SeatKiloDistanceKM', name: _d.Register + '(ASK)', color: $scope.getColorFromSet(_idx), dashStyle: 'dot' });


                    });
                    //console.log($scope.types.details);
                    //console.log($scope.typeSeries);

                    if ($scope.activeTab == 'aircraft')
                        $scope.bindAircraftTab();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //var value_axises1 = $scope.line_normal1_instance.option('valueAxis[1].constanLines', [{ value: 25 }]);
            // console.log(value_axises1);
            //pax value axis
            //value_axises1[1].constantLines = [{value:25}];
            // $scope.line_normal1_instance.option('valueAxis[1].constantLines', [{ value: $scope.total.usedPerPaxAvg, color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 } } }]);
            // $scope.line_normal1_instance.option('valueAxis[0].constantLines', [{ value: $scope.total.paxAvg, color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 } } }]);
            //console.log(value_axises1);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////////
    $scope.bar_monthly_instance = null;
    $scope.bar_monthly = {
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
            if (!$scope.bar_monthly_instance)
                $scope.bar_monthly_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Used / Uplift Fuel (tone)",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",

            argumentField: "ArgStr",
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
                visible: true,

            },
            // barWidth: 30,
        },

        series: [
            { valueField: "UpliftKilo", name: "uplift", color: '#00b386' },
            { valueField: "UsedKilo", name: "used", color: '#ff471a' },
            {
                type: 'line',
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },
            }
        ],

        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + (arg.value)
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
        size: { height: 450 },
        bindingOptions: {
            "dataSource": "total.items",
        }
    };
    ////////////////////////////////////
    $scope.bar_type_instance = null;
    $scope.bar_type = {
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
            if (!$scope.bar_type_instance)
                $scope.bar_type_instance = e.component;
        },
        palette: "Ocean",
        title: {
            text: "Used Fuel by Type(tone)",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
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
                visible: true,

            },
            // barWidth: 30,
        },

        //series: [
        //    { valueField: "UpliftKilo", name: "uplift",  },
        //    { valueField: "UsedKilo", name: "used",  },
        //    {
        //        type: 'line',
        //        valueField: "FPFuelKilo",
        //        name: "planned(tone)",
        //        color: '#9999ff',
        //        dashStyle: 'dot',
        //        label: { visible: false },
        //        point: { visible: false },
        //    }
        //],

        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + (arg.value)
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
        size: { height: 450 },
        bindingOptions: {
            "dataSource": "types.details",
            "series": "typeSeries",
            'argumentAxis.categories': 'monthNames2'
        }
    };

    //////////////////////////////////
    $scope.diameter = 0.85;

    //$scope.pie_cat_ds = [];
    $scope.pie_used = {
        rtlEnabled: true,
        onInitialized: function (e) {
            if (!$scope.pie_used_instance)
                $scope.pie_used_instance = e.component;
        },
        title: {
            text: "Used Fuel Distribution",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        type: "doughnut",
        palette: "Soft Pastel",
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
            argumentField: "MonthName",
            valueField: "UsedKilo",
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
                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ///////////////////////////////////
    $scope.pie_type = {
        rtlEnabled: true,
        onInitialized: function (e) {
            if (!$scope.pie_type_instance)
                $scope.pie_type_instance = e.component;
        },
        title: {
            text: "Distribution",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        type: "doughnut",
        palette: "Violet",
        diameter: 0.55,
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
            argumentField: "AircraftType",
            valueField: "UsedKilo",
            label: {
                visible: true,
                font: {
                    size: 12,
                    color: 'black',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'types.items',

        }
    };
    ////////////////////////////////////
    $scope.chart_monthly_rpk_instance = null;
    $scope.chart_monthly_rpk = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "Used Fuel Per RPK & ASK",
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
            if (!$scope.chart_monthly_rpk_instance)
                $scope.chart_monthly_rpk_instance = e.component;
        },

        commonSeriesSettings: {
            type:'spline',
            argumentField: "ArgStr",
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
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        series: [

            { valueField: 'UsedPerPaxKiloDistanceKM', name: 'Per Revenue Passengers(kilo) Kilometers (APK)', showInLegend: true, },
            { valueField: 'UsedPerSeatKiloDistanceKM', name: 'Per Available Seats(kilo) Kilometers (ASK)', showInLegend: true, dashStyle: 'dot' },
        ],
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
       // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.items",

            // 'argumentAxis.categories': 'monthNames2'
        }
    };
    ///////////////////////////////////////
    $scope.chart_monthly_rpktotal_instance = null;
    $scope.chart_monthly_rpktotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "APK-ASK",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
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
            if (!$scope.chart_monthly_rpktotal_instance)
                $scope.chart_monthly_rpktotal_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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



        defaultPane: "bottomPane",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        series: [
            { valueField: 'PaxKiloDistanceKM', name: 'RPK', showInLegend: true, },
            { dashStyle: 'dot', valueField: 'SeatKiloDistanceKM', name: 'ASK', }
        ],
        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "total.items",

        }
    };
    ///////////////////////////////////////
    $scope.chart_monthly_rpktotalpanes_instance = null;
    $scope.chart_monthly_rpktotalpanes = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
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
            if (!$scope.chart_monthly_rpktotalpanes_instance)
                $scope.chart_monthly_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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



        defaultPane: "bottomPane",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        panes: [{
            name: "used",
        }, {
            name: "bl"
        }, {
            name: "pax"
        },],
        defaultPane: "pax",
        series: [
            { valueField: 'DistanceKM', name: 'Distance(KM)', pane: "bl", type: 'spline' },
            { valueField: 'TotalPax', name: 'Pax(K)', pane: "pax", type: 'spline' },
            { valueField: 'UsedKilo', name: 'Used(K)', pane: "used", type: 'spline' }
        ],
        valueAxis: [{
            pane: "used",
            grid: {
                visible: true
            },
            title: {
                text: "used(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }, {
            pane: "pax",
            grid: {
                visible: true
            },
            title: {
                text: "pax(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value / 1000.0);
                }
            },
        }
            , {
            pane: "bl",
            title: {
                text: "distance(km)"
            },
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return  (this.value);
                }
            },

        }

        ],
        size: {
            height: 450,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.items",

        }
    };
    ////////////////////////////////////
    //goog
    ////////////////////////////////////kue
    $scope.chart_monthly_rpb_instance = null;
    $scope.chart_monthly_rpb = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "Used Fuel Per RPB & ASB",
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
            if (!$scope.chart_monthly_rpb_instance)
                $scope.chart_monthly_rpb_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "ArgStr",
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
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        series: [

            { valueField: 'UsedPerPaxBlockTime', name: 'Per Revenue Passengers Block Time (RPB)', showInLegend: true, },
            { valueField: 'UsedPerSeatBlockTime', name: 'Per Available Seats Block Time (ASB)', showInLegend: true, dashStyle: 'dot' },
        ],
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "total.items",

            // 'argumentAxis.categories': 'monthNames2'
        }
    };
    ///////////////////////////////////////
    $scope.chart_monthly_rpbtotal_instance = null;
    $scope.chart_monthly_rpbtotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "APB-ASB",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
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
            if (!$scope.chart_monthly_rpbtotal_instance)
                $scope.chart_monthly_rpbtotal_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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



        defaultPane: "bottomPane",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        series: [
            { valueField: 'PaxBlockTimeKilo', name: 'RPB', showInLegend: true, },
            { dashStyle: 'dot', valueField: 'SeatBlockTimeKilo', name: 'ASB', }
        ],
        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "total.items",

        }
    };
    //////////////////////////////////////
    $scope.chart_monthly_rpbtotalpanes_instance = null;
    $scope.chart_monthly_rpbtotalpanes = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
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
            if (!$scope.chart_monthly_rpbtotalpanes_instance)
                $scope.chart_monthly_rpbtotalpanes_instance = e.component;
        },

        commonSeriesSettings: {
            
            argumentField: "ArgStr",
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



        defaultPane: "bottomPane",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        panes: [{
            name: "used",
        }, {
            name: "bl"
        }, {
            name: "pax"
        },],
        defaultPane: "pax",
        series: [
            { valueField: 'BlockTime', name: 'Block Time', pane: "bl",type:'spline' },
            { valueField: 'TotalPax', name: 'Pax(K)', pane: "pax", type: 'spline' },
            { valueField: 'UsedKilo', name: 'Used(K)', pane: "used", type: 'spline' }
        ],
        valueAxis: [{
            pane: "used",
            grid: {
                visible: true
            },
            title: {
                text: "used(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },{
            pane: "pax",
            grid: {
                visible: true
            },
                title: {
                    text: "pax(k)"
                },
            label: {
                customizeText: function () {
                    return (this.value / 1000.0);
                }
            },
        }
            , {
                pane: "bl",
                title: {
                    text: "block time(h)"
                },
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },

        }

        ],
        size: {
            height: 450,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.items",

        }
    };
    ////////////////////////////////////

    $scope.chart_monthly_rpkreg_instance = null;
    $scope.chart_monthly_rpkreg = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "Used Fuel Per APK & ASK",
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
            if (!$scope.chart_monthly_rpkreg_instance)
                $scope.chart_monthly_rpkreg_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        //series: [

        //    { valueField: 'UsedPerPaxKiloDistanceKM', name: 'Per Revenue Passengers(kilo) Kilometers (APK)', showInLegend: true, },
        //    { valueField: 'UsedPerSeatKiloDistanceKM', name: 'Per Available Seats(kilo) Kilometers (ASK)', showInLegend: true, dashStyle: 'dot' },
        //],
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "types.detailsRegisters",
            'series': 'rpkRegSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////////////////
    $scope.chart_monthly_rpktotalreg_instance = null;
    $scope.chart_monthly_rpktotalreg = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "APK",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
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
            if (!$scope.chart_monthly_rpktotalreg_instance)
                $scope.chart_monthly_rpktotalreg_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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



        defaultPane: "bottomPane",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },

        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "types.detailsRegisters",
            'series': 'rpkTotalRegSeries',
            'argumentAxis.categories': 'monthNames2'

        }
    };
    ////////////////////////////////////

    $scope.line_avg_instance = null;
    $scope.line_avg = {
        onInitialized: function (e) {
            if (!$scope.line_avg_instance)
                $scope.line_avg_instance = e.component;
        },
        palette: 'Vintage',
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {

                //pane: "topPane",
                valueField: "AvgUsed",
                name: "average",
                color: '#ffc266',

            }

        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Average Used Fuel",
            font: {
                size: 20,
            }
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////

    $scope.line_avg_det_instance = null;
    $scope.line_avg_det = {
        onInitialized: function (e) {
            if (!$scope.line_avg_det_instance)
                $scope.line_avg_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "Legs",
                name: "leg",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ////////////////////////////////////
    $scope.line_leg_instance = null;
    $scope.line_leg = {
        onInitialized: function (e) {
            if (!$scope.line_leg_instance)
                $scope.line_leg_instance = e.component;
        },
        palette: 'Vintage',
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                type: 'bar',
                //pane: "topPane",
                valueField: "UsedPerLeg",
                name: "used per leg",
                color: '#ffc266',

            }
            , {
                //pane: "topPane",
                valueField: "FPFuelPerLeg",
                name: "planned per leg",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Leg",
            font: {
                size: 20,
            }
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////

    $scope.line_leg_det_instance = null;
    $scope.line_leg_det = {
        onInitialized: function (e) {
            if (!$scope.line_leg_det_instance)
                $scope.line_leg_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "Legs",
                name: "leg",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////
    $scope.line_weightdistance_instance = null;
    $scope.line_weightdistance = {
        onInitialized: function (e) {
            if (!$scope.line_weightdistance_instance)
                $scope.line_weightdistance_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                type: 'bar',
                valueField: "UsedPerWeightDistanceToneKM",
                name: "used per weight-distance",
                color: '#d279a6',

            }
            , {
                //pane: "topPane",
                valueField: "FPFuelPerWeightDistanceToneKM",
                name: "planned per weight-distance",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Weight-Distance (kilo per tone-km)",
            font: {
                size: 20,
            }
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////

    $scope.line_weightdistance_det_instance = null;
    $scope.line_weightdistance_det = {
        onInitialized: function (e) {
            if (!$scope.line_weightdistance_det_instance)
                $scope.line_weightdistance_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "WeightDistanceToneKM",
                name: "weight-distance(tone-km)",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };

    ////////////////////////////////////
    $scope.line_pax_instance = null;
    $scope.line_pax = {
        onInitialized: function (e) {
            if (!$scope.line_pax_instance)
                $scope.line_pax_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                type: 'bar',
                valueField: "UsedPerPax",
                name: "used per Pax",
                color: '#e6e600',

            }
            , {
                //pane: "topPane",
                valueField: "FPFuelPerPax",
                name: "planned per pax",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Pax",
            font: {
                size: 20,
            }
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////

    $scope.line_pax_det_instance = null;
    $scope.line_pax_det = {
        onInitialized: function (e) {
            if (!$scope.line_pax_det_instance)
                $scope.line_pax_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "TotalPax",
                name: "pax (adults & children)",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////
    $scope.line_flight_instance = null;
    $scope.line_flight = {
        onInitialized: function (e) {
            if (!$scope.line_flight_instance)
                $scope.line_flight_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                type: 'bar',
                valueField: "UsedPerBlockTime",
                name: "used per block time",
                color: '#e6ac00',

            },
            {
                //pane: "topPane",
                valueField: "FPFuelPerBlockTime",
                name: "planned per block time",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Block Time",
            font: {
                size: 20,
            }
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    /////////////////////////////////////

    $scope.line_flight_det_instance = null;
    $scope.line_flight_det = {
        onInitialized: function (e) {
            if (!$scope.line_flight_det_instance)
                $scope.line_flight_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "BlockTime",
                name: "block time",
                color: '#248f8f',
                label: {
                    customizeText: function () {
                        return $scope.formatMinutes(this.value);
                    }
                },

            }
        ],
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'total.items',

        }
    };

    ////////////////////////////////////

    $scope.line_distance_instance = null;
    $scope.line_distance = {
        onInitialized: function (e) {
            if (!$scope.line_distance_instance)
                $scope.line_distance_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                valueField: "UsedPerDistanceKM",
                name: "used per distance",
                color: '#ff0066',

            }
            , {
                //pane: "topPane",
                valueField: "FPFuelPerDistance",
                name: "planned per distance",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Distance (kilo per km)",
            font: {
                size: 20,
            }
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ////////////////////////////////////
    $scope.line_distance_det_instance = null;
    $scope.line_distance_det = {
        onInitialized: function (e) {
            if (!$scope.line_distance_det_instance)
                $scope.line_distance_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "DistanceKM",
                name: "distance(km)",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ////////////////////////////////////
    $scope.line_weight_instance = null;
    $scope.line_weight = {
        onInitialized: function (e) {
            if (!$scope.line_weight_instance)
                $scope.line_weight_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                valueField: "UsedPerWeightTone",
                name: "used per weight",
                color: '#cc0000',

            }
            , {
                //pane: "topPane",
                valueField: "FPFuelPerWeightTone",
                name: "planned per weight",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Weight (kilo per tone)",
            font: {
                size: 20,
            }
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ////////////////////////////////////
    $scope.line_weight_det_instance = null;
    $scope.line_weight_det = {
        onInitialized: function (e) {
            if (!$scope.line_weight_det_instance)
                $scope.line_weight_det_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedKilo",
                name: "used(tone)",
                color: '#ffaa00',

            }
            , {
                pane: "topPane",
                valueField: "FPFuelKilo",
                name: "planned(tone)",
                color: '#9999ff',
                dashStyle: 'dot',
                label: { visible: false },
                point: { visible: false },

            },
            {
                pane: "bottomPane",
                valueField: "WeightTone",
                name: "weight(k)",
                color: '#248f8f',

            }
        ],

        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used/Planned",
            font: {
                size: 20,
            }
            , visible: false
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    ////////////////////////////////////
    $scope._line_pax_instance = null;
    $scope._line_pax = {
        onInitialized: function (e) {
            if (!$scope.line_pax_instance)
                $scope.line_pax_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "ArgStr",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedPerPax",
                name: "used per pax",
                color: '#ff8000',

            }, {

                valueField: "TotalPax",
                name: "Total Pax",
                color: '#0099ff',
            }
        ],
        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Total Pax",
                font: {
                    size: 14,
                }
            }
        }, {
            pane: "topPane",

            grid: {
                visible: true
            },
            title: {
                text: "Per Pax",
                font: {
                    size: 14,
                },
                margin: 16,
            },
            name: 'paxaxis',
            // constantLines: [{ value:25 }]
        }],
        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel per Pax",
            font: {
                size: 20,
            }
        },

        bindingOptions: {
            dataSource: 'total.items',

        }
    };
    //////////////////////////////////
    $scope.chart_routes_instance = null;
    $scope.chart_routes = {
        onInitialized: function (e) {
            if (!$scope.chart_routes_instance)
                $scope.chart_routes_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "Route",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {
                //pane: "topPane",
                type: 'bar',
                valueField: "UsedKilo",
                name: "used",
                color: '#ff9933',

            }
            //, {
            //    //pane: "topPane",
            //    valueField: "FPFuelPerPax",
            //    name: "planned per pax",
            //    color: '#9999ff',
            //    dashStyle: 'dot',
            //    label: { visible: false },
            //    point: { visible: false },

            //}
        ],
        valueAxis: [{

            grid: {
                visible: true
            },
            title: {
                text: "tone",

            }
        }],
        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used Fuel by Routes",
            font: {
                size: 20,
            }
        },
        onPointClick: function (e) {
            var routes = [];
            routes.push(e.target.originalArgument);
            var args = Enumerable.From($scope.total.items).Select('$.ArgStr').ToArray();

            //var arguments = Enumerable.From($scope.routes.items).Select('$.ArgStr').ToArray();
            var data = { routes: routes, year: $scope.year, routesDs: $scope.routes, arguments: args, total: $scope.total };
            $rootScope.$broadcast('InitfuelbiRoute', data);
        },
        size: { height: 450 },
        bindingOptions: {
            dataSource: 'routesTopDs',

        }
    };
    $scope.showRoutePage = function (rt) {
        var routes = [];
        routes.push(rt);
        var args = Enumerable.From($scope.total.items).Select('$.ArgStr').ToArray();

        //var arguments = Enumerable.From($scope.routes.items).Select('$.ArgStr').ToArray();
        var data = { routes: routes, year: $scope.year, routesDs: $scope.routes, arguments: args, total: $scope.total };
        $rootScope.$broadcast('InitfuelbiRoute', data);
    };
    ////////////////////////////////
    $scope.chart_routes_paxleg_instance = null;
    $scope.chart_routes_paxleg = {
        onInitialized: function (e) {
            if (!$scope.chart_routes_paxleg_instance)
                $scope.chart_routes_paxleg_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        commonSeriesSettings: {
            argumentField: "Route",
            label: {
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
                visible: true,
                // rotationAngle:90,
            }
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
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        defaultPane: "bottomPane",
        series: [

            {
                pane: "topPane",
                valueField: "UsedPerPax",
                name: "used per pax",
                color: '#9999ff',
                type: 'bar',

            }
            ,
            {
                pane: "bottomPane",
                valueField: "UsedKiloPerLeg",
                name: "used per leg",
                color: '#d98cb3',
                type: 'bar',
            }
        ],
        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Per Leg (tone)",
                margin: 16,
            }
        }, {
            pane: "topPane",
            grid: {
                visible: true
            },
            title: {
                text: "Per Pax"
            }
        }],
        argumentAxis: {
            valueMarginsEnabled: true,

            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //customizeText: function (e) {
                //    return moment(new Date(e.value)).format('YY-MM-DD');
                //}
            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible: true,
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used by Routes Per Pax-Leg",
            font: {
                size: 20,
            }
            , visible: false
        },
        size: { height: 450 },
        bindingOptions: {
            dataSource: 'routesTopDs',

        }
    };
    ////////////////////////////////
    $scope.chart_routes_rpk_instance = null;
    $scope.chart_routes_rpk = {
        onInitialized: function (e) {
            if (!$scope.chart_routes_rpk_instance)
                $scope.chart_routes_rpk_instance = e.component;
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            }
        },
        rotated: true,
        barGroupWidth: 18,
        commonSeriesSettings: {
            type: "stackedbar",
            argumentField: "Route",
            label: {
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return Math.abs(this.value);
                },
                visible: true,
                // rotationAngle:90,
            }
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

        series: [

            {

                valueField: "FRPK",
                name: "Per RPK",
                color: '#9999ff',
                //type: 'bar',

            }
            ,
            {

                valueField: "FASK",
                name: "Per ASK",
                color: '#d98cb3',
                //type: 'bar',
            }
        ],
        valueAxis: {

            grid: {
                visible: true
            },
            label: {
                customizeText: function () {
                    return Math.abs(this.value);
                }
            }
            //title: {
            //    text: "Per Pax"
            //}
        },
        argumentAxis: {
            valueMarginsEnabled: true,
            position: 'right',
            grid: {
                visible: false
            },
            label: {
                font: { size: 10 },
                //rotationAngle: -45,
                overlappingBehavior: 'rotate',

            },
            overlappingBehavior: 'rotate',
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible: true,
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Used by Routes Per RPK-ASK",
            font: {
                size: 20,
            }
            , visible: false
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function () {
                return {
                    text: Math.abs(this.valueText)
                };
            }
        },
        size: { height: 450 },
        bindingOptions: {
            dataSource: 'routesTopDs',

        }
    };
    ////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Fuel';


        $('.fuel').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {
        // $scope.period = 1;

    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);