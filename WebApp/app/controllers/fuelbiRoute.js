'use strict';
app.controller('fuelbiRouteController', ['$scope', '$location', 'personService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, $routeParams, $rootScope) {

    $scope.year = null;
    $scope.routes = [];
    $scope.routesDs = [];

    $scope.dataSource = [];
    $scope.mainDatasource = null;
    $scope.mainSeries = [];
    $scope.mainStackSeries = [];
    $scope.legSeries = [];
    $scope.paxSeries = [];
    $scope.blockSeries = [];
    $scope.rpkSeries = [];
    $scope.rpkTotalSeries = [];
    $scope.summeries = null;
    $scope.summeriesLeg = null;
    $scope.summeriesPax = null;
    $scope.tagRoutesDs = [];
    $scope.mainPies = [];
    ////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    ///////////////////////////////
    $scope.buildCharts3 = function () {
        $.each($scope.routes, function (_i, _d) {
            $scope.chart_main_instance.getSeriesByName(_d).show();
            $scope.chart_main_instance.getSeriesByName(_d).showInLegend = true;
        });
    };
    $scope.usedStackedDs = [];
    $scope.buildCharts = function () {
        // $scope.bar_airc_series.push({ valueField: _d, name: _d, color: $scope.data.categoryColors[_d] });
        var mainCurrent = Enumerable.From($scope.mainSeries).Select('$.id').ToArray();
        var newRoutes = Enumerable.From($scope.routes).Where(function (x) { return mainCurrent.indexOf(x) == -1; }).ToArray();

        $scope.usedStackedDs = [];
        $scope.mainStackSeries = [];
        $.each($scope.prms.total.items, function (_i, _d) {
            var row = {};
            var sum = 0;
            $.each($scope.routes, function (_j, _r) {
                var data = Enumerable.From($scope.mainDatasource).Where('$.Route=="' + _r + '" && $.ArgNum==' + _d.ArgNum).FirstOrDefault();
                row[_r] = !data ? null : data.UsedKilo;
                row.ArgStr = _d.ArgStr;
                row.ArgNum = _d.ArgNum;
                sum += !data ? 0 : data.UsedKilo;

            });
            row.other = Number((_d.UsedKilo - sum).toFixed(2));
            row.total = _d.UsedKilo;
            $scope.usedStackedDs.push(row);
        });
        $.each($scope.routes, function (_j, _r) {
            $scope.mainStackSeries.push({ valueField: _r, name: _r, color: $scope.getColorFromSet($scope.mainStackSeries.length), id: _r });
        });
        $scope.mainStackSeries.push({ valueField: 'other', name: 'other', color: '#ccc', id: 'other' });
        console.log($scope.usedStackedDs);
        $scope.mainSeries = Enumerable.From($scope.mainSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.legSeries = Enumerable.From($scope.legSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1 && x.id!='Overall'; }).ToArray();
        $scope.legTotalSeries = Enumerable.From($scope.legTotalSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1 && x.id != 'Overall'; }).ToArray();
        $scope.paxSeries = Enumerable.From($scope.paxSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.paxTotalSeries = Enumerable.From($scope.paxTotalSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.blockSeries = Enumerable.From($scope.blockSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.blockTotalSeries = Enumerable.From($scope.blockTotalSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.rpkSeries = Enumerable.From($scope.rpkSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.rpkTotalSeries = Enumerable.From($scope.rpkTotalSeries).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        $scope.mainPies = Enumerable.From($scope.mainPies).Where(function (x) { return $scope.routes.indexOf(x.id) != -1; }).ToArray();
        ///////////////////////////////
        $scope.legSeries.unshift({ id: 'Overall', width: 3, label: { visible: true, }, valueField: 'OverallUsedPerleg', name: 'Overall', showInLegend: true, color: 'gray', dashStyle: 'dot', point: { visible: false } });
        $scope.legTotalSeries.unshift({ id: 'Overall', label: {visible:true,}, type: 'bar', valueField: 'OverallLegs', name: 'Overall', showInLegend: true, color: '#ddd', });
        //////////////////////////////

        $.each(newRoutes, function (_i, _d) {
            var mainserie = {
                valueField: _d.replace("-", "") + 'UsedKilo',
                name: _d,
                color: $scope.getColorFromSet($scope.mainSeries.length),
                id: _d,

            };
            $scope.mainSeries.push(mainserie);


            var legSeriesTotal = { id: _d, valueField: _d.replace("-", "") + 'Legs', name: _d , showInLegend: true,  color: $scope.getColorFromSet($scope.legTotalSeries.length-1 ) };
            var legSeriesBottom = { id: _d, valueField: _d.replace("-", "") + 'UsedPerLeg',   name: _d, showInLegend: true, color: $scope.getColorFromSet($scope.legSeries.length-1 ) };
            $scope.legSeries.push(legSeriesBottom);
            $scope.legTotalSeries.push(legSeriesTotal);
            


            var paxSeriesTop = { id: _d, valueField: _d.replace("-", "") + 'TotalPax', name: _d, showInLegend: true,  color: $scope.getColorFromSet($scope.paxTotalSeries.length  ) };
            var paxSeriesBottom = { id: _d, valueField: _d.replace("-", "") + 'UsedPerPax',   name: _d, showInLegend: true, color: $scope.getColorFromSet($scope.paxSeries.length  ) };
            $scope.paxSeries.push(paxSeriesBottom);
            $scope.paxTotalSeries.push(paxSeriesTop);


            var blockSeriesTop = { id: _d, valueField: _d.replace("-", "") + 'BlockTime', name: _d  , showInLegend: true,   color: $scope.getColorFromSet($scope.blockTotalSeries.length ) };
            var blockSeriesBottom = { id: _d, valueField: _d.replace("-", "") + 'UsedPerBlockTime',   name: _d, showInLegend: true, color: $scope.getColorFromSet($scope.blockSeries.length  ) };
            $scope.blockSeries.push(blockSeriesBottom);
            $scope.blockTotalSeries.push(blockSeriesTop);

            var rpkTotalSeriesRPK = { id: _d, valueField: _d.replace("-", "") + 'PaxKiloDistanceKM', name: _d + '(RPK)', showInLegend: true, color: $scope.getColorFromSet($scope.rpkTotalSeries.length / 2) };
            var rpkSeriesRPK = { id: _d, valueField: _d.replace("-", "") + 'UsedPerPaxKiloDistanceKM', name: _d + '(RPK)', showInLegend: true, color: $scope.getColorFromSet($scope.rpkSeries.length / 2) };

            var rpkTotalSeriesASK = { id: _d, dashStyle: 'dot', valueField: _d.replace("-", "") + 'SeatKiloDistanceKM', name: _d + '(ASK)', showInLegend: true, color: $scope.getColorFromSet($scope.rpkTotalSeries.length / 2) };
            var rpkSeriesASK = { id: _d, dashStyle: 'dot', valueField: _d.replace("-", "") + 'UsedPerSeatKiloDistanceKM', name: _d + '(ASK)', showInLegend: true, color: $scope.getColorFromSet($scope.rpkSeries.length / 2) };
            $scope.rpkSeries.push(rpkSeriesRPK);

            $scope.rpkSeries.push(rpkSeriesASK);
            $scope.rpkTotalSeries.push(rpkTotalSeriesRPK);
            $scope.rpkTotalSeries.push(rpkTotalSeriesASK);

            /////////////////////
            var mainpie = {
                id: _d,
                type: "doughnut",
                palette: 'Ocean',
                paletteExtensionMode: 'extrapolate',
                rtlEnabled: true,
                title: { verticalAlignment: 'bottom', horizontalAlignment: 'center', text: _d, font: { size: 14, weight: 900 } },
                legend: { visible: false, },

                series: [{
                    argumentField: "ArgStr",
                    valueField: _d.replace("-", "") + 'Used',
                    label: {
                        visible: true,

                        font: {
                            size: 11,
                            color: 'white',
                        },
                        //format: "percent",char
                        connector: {
                            visible: true
                        },
                        customizeText: function (arg) {

                            return arg.argumentText + " (" + arg.percentText + ")";
                        }
                    }
                }],
                sizeGroup: 'piecat2',
                size: {
                    height: 400,
                    width: '100%',
                },
                //diameter:0.2,
                dataSource: $scope.mainDatasource,
                bindingOptions: {
                    //  dataSource: 'pie_cat_ds',
                    //palette: 'catColors2',
                    //   diameter:'diameter',
                }
            };

            $scope.mainPies.push(mainpie);
            //mainpie.dataSource = _d.cats;
            //////////////////////



        });
        ///////////////////////////////
        

    };

    $scope.buildCharts2 = function (ds) {
        // $scope.bar_airc_series.push({ valueField: _d, name: _d, color: $scope.data.categoryColors[_d] });


        $.each(ds, function (_i, _d) {
            var mainserie = {
                valueField: _d.replace("-", "") + 'UsedKilo',
                name: _d,
                color: $scope.getColorFromSet(_i),
                id: _d,
                visible: false,
                showInLegend: false,
            };
            $scope.mainSeries.push(mainserie);

            var legSeriesTop = { id: _d, valueField: _d.replace("-", "") + 'Legs', name: _d + '(total)', pane: "topPane", color: $scope.getColorFromSetReverse(_i) };
            var legSeriesBottom = { id: _d, valueField: _d.replace("-", "") + 'UsedPerLeg', pane: "bottomPane", name: _d, showInLegend: true, color: $scope.getColorFromSetReverse(_i) };
            $scope.legSeries.push(legSeriesBottom);
            $scope.legSeries.push(legSeriesTop);

        });

    };


    $scope.bindCharts = function () {
        var ordered = Enumerable.From($scope.routesDs.details).OrderBy('$.Route2').ThenBy('$.ArgNum').ToArray();
        $scope.mainDatasource = ordered;

        $.each($scope.routes, function (_i, _d) {
            var arg = _d.replace("-", "");

        });
        // $scope.chart_main_instance.option('valueAxis[0].constantLines', [{ value: '60', color: 'gray', width: 1, dashStyle: 'dash', label: { font: { size: 11 }, position: 'outside' ,text:''} }]);

    };
    ///////////////////////////////
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
    $scope.monthNames2 = [];
    var monthNames = [];
    const colorSet1 = [
        '#d64161',
        '#00ff00',
        '#ffff4d',
        '#3399ff',

        '#ff7b25',
        '#eca1a6',
        '#6b5b95',
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
    $scope.getColorFromSetReverse = function (n) {
        //0 based
        if (n > colorSet1.length - 1)
            n = n % (colorSet1.length);
        return colorSet1[colorSet1.length - 1 - n];
    };
    ///////////////////////////////
    $scope.chart_main_instance = null;
    $scope.chart_main = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
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
        palette: "GreenMist",
        //title: {
        //    text: "Used Fuel (tone)",
        //    font: {
        //        size: 20,
        //    }

        //},

        commonSeriesSettings: {
            //type: "bar",
            argumentField: 'ArgStr',

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

        //series: [
        //    { valueField: "UpliftKilo", name: "uplift", color: '#00b386' },
        //    { valueField: "UsedKilo", name: "used", color: '#ff471a' },
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
            //customizeTooltip: function (arg) {
            //    alert(arg.seriesName + " " + (arg.value));

            //    return {
            //        text: arg.seriesName + " " + (arg.value)
            //    };
            //}
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 450,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'mainSeries',
            'argumentAxis.categories': 'monthNames2'


        }
    };
    ////////////////////////
    $scope.chart_mainstack_instance = null;
    $scope.chart_mainstack = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
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
            if (!$scope.chart_mainstack_instance)
                $scope.chart_mainstack = e.component;
        },
        palette: "GreenMist",

        commonSeriesSettings: {
            type: "stackedBar",

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
                    text: arg.seriesName + ": " + (arg.value.toFixed(2)) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + arg.total.toFixed(2)
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
            height: 450,
        },
        bindingOptions: {
            "dataSource": "usedStackedDs",
            'argumentAxis.categories': 'monthNames2',
            series: 'mainStackSeries',

        }
    };
    ////////////////////////////
    $scope.chart_leg_instance = null;
    $scope.chart_leg = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_leg_instance.getSeriesByName(name).hide();
                $scope.chart_leg_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_leg_instance.getSeriesByName(name).show();
                $scope.chart_leg_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_leg_instance)
                $scope.chart_leg_instance = e.component;
        },
        palette: "Pastel",


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


        //panes: [{
        //    name: "topPane"
        //}, {
        //    name: "bottomPane"
        //}],
        //defaultPane: "bottomPane",
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
            //customizeTooltip: function (arg) {
            //    alert(arg.seriesName + " " + (arg.value));

            //    return {
            //        text: arg.seriesName + " " + (arg.value)
            //    };
            //}
        },

        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Per Leg"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        //{
        //    pane: "topPane",
        //    grid: {
        //        visible: true
        //    },
        //    title: {
        //        text: "Total"
        //    },
        //    label: {
        //        customizeText: function () {
        //            return (this.value);
        //        }
        //    },
        //}
        ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'legSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.chart_legtotal_instance = null;
    $scope.chart_legtotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_legtotal_instance.getSeriesByName(name).hide();
                $scope.chart_legtotal_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_legtotal_instance.getSeriesByName(name).show();
                $scope.chart_legtotal_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_legtotal_instance)
                $scope.chart_legtotal_instance = e.component;
        },
        palette: "Pastel",


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


        //panes: [{
        //    name: "topPane"
        //}, {
        //    name: "bottomPane"
        //}],
        //defaultPane: "bottomPane",
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
            //customizeTooltip: function (arg) {
            //    alert(arg.seriesName + " " + (arg.value));

            //    return {
            //        text: arg.seriesName + " " + (arg.value)
            //    };
            //}
        },

        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Legs"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
            //{
            //    pane: "topPane",
            //    grid: {
            //        visible: true
            //    },
            //    title: {
            //        text: "Total"
            //    },
            //    label: {
            //        customizeText: function () {
            //            return (this.value);
            //        }
            //    },
            //}
        ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'legTotalSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.chart_pax_instance = null;
    $scope.chart_pax = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_pax_instance.getSeriesByName(name).hide();
                $scope.chart_pax_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_pax_instance.getSeriesByName(name).show();
                $scope.chart_pax_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_pax_instance)
                $scope.chart_pax_instance = e.component;
        },
        palette: "Pastel",


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
            //customizeTooltip: function (arg) {
            //    alert(arg.seriesName + " " + (arg.value));

            //    return {
            //        text: arg.seriesName + " " + (arg.value)
            //    };
            //}
        },

        valueAxis: [{
             
            grid: {
                visible: true
            },
            title: {
                text: "Per Pax"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        } ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'paxSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.chart_paxtotal_instance = null;
    $scope.chart_paxtotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_paxtotal_instance.getSeriesByName(name).hide();
                $scope.chart_paxtotal_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_paxtotal_instance.getSeriesByName(name).show();
                $scope.chart_paxtotal_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_paxtotal_instance)
                $scope.chart_paxtotal_instance = e.component;
        },
        palette: "Pastel",


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
            //customizeTooltip: function (arg) {
            //    alert(arg.seriesName + " " + (arg.value));

            //    return {
            //        text: arg.seriesName + " " + (arg.value)
            //    };
            //}
        },

        valueAxis: [{

            grid: {
                visible: true
            },
            title: {
                text: "Pax"
            },
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
            "dataSource": "mainDatasource",
            series: 'paxTotalSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    //////////////////////////
    $scope.chart_block_instance = null;
    $scope.chart_block = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_block_instance.getSeriesByName(name).hide();
                $scope.chart_block_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_block_instance.getSeriesByName(name).show();
                $scope.chart_block_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_block_instance)
                $scope.chart_block_instance = e.component;
        },
        palette: "Pastel",


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
                return {
                    text: (arg.value)
                };
            }
        },

        valueAxis: [{
            
            grid: {
                visible: true
            },
            title: {
                text: "Per Block Time (Kg/hr)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        } ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'blockSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    //////////////////////////
    $scope.chart_blocktotal_instance = null;
    $scope.chart_blocktotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_blocktotal_instance.getSeriesByName(name).hide();
                $scope.chart_blocktotal_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_blocktotal_instance.getSeriesByName(name).show();
                $scope.chart_blocktotal_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_blocktotal_instance)
                $scope.chart_blocktotal_instance = e.component;
        },
        palette: "Pastel",


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
                return {
                    text: $scope.formatMinutes(arg.value)
                };
                 
                   
            }
        },

        valueAxis: [  {
            
            grid: {
                visible: true
            },
            title: {
                text: "Block Time"
            },
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
            "dataSource": "mainDatasource",
            series: 'blockTotalSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.chart_rpk_instance = null;
    $scope.chart_rpk = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_rpk_instance.getSeriesByName(name).hide();
                $scope.chart_rpk_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_rpk_instance.getSeriesByName(name).show();
                $scope.chart_rpk_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_rpk_instance)
                $scope.chart_rpk_instance = e.component;
        },
        palette: "Pastel",


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


        //panes: [{
        //    name: "topPane"
        //}, {
        //    name: "bottomPane"
        //}],
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
            zIndex: 10000,
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
            title: {
                text: "Fuel Per RPK-ASK"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }
            //, {
            //pane: "topPane",
            //grid: {
            //    visible: true
            //},
            //title: {
            //    text: "Total"
            //},
            //label: {
            //    customizeText: function () {
            //        return  (this.value);
            //    }
            //},
            //}
        ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'rpkSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.chart_rpktotal_instance = null;
    $scope.chart_rpktotal = {
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        onLegendClick: function (e) {
            var visible = e.target.isVisible();
            var name = e.target.name;
            var name2 = name + '(total)';
            if (visible) {
                $scope.chart_rpktotal_instance.getSeriesByName(name).hide();
                $scope.chart_rpktotal_instance.getSeriesByName(name2).hide();
            }
            else {
                $scope.chart_rpktotal_instance.getSeriesByName(name).show();
                $scope.chart_rpktotal_instance.getSeriesByName(name2).show();
            }

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
            if (!$scope.chart_rpktotal_instance)
                $scope.chart_rpktotal_instance = e.component;
        },
        palette: "Pastel",


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
            zIndex: 10000,
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
            title: {
                text: "RPK-ASK"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        size: {
            height: 400,
        },
        bindingOptions: {
            "dataSource": "mainDatasource",
            series: 'rpkTotalSeries',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////
    $scope.scroll1 = {
        scrollByContent: true,
        scrollByThumb: true,
        height: '100%',
        //bindingOptions: { height: 'scroll_height_detd', }
    };
    ////////////////////////
    $scope.doRebuild = false;
    $scope.tagRoutes = {
        searchEnabled: true,
        applyValueMode: 'useButtons',
        showSelectionControls: true,

        onValueChanged: function (e) {

            $scope.rebuild();

        },
        bindingOptions: {
            dataSource: 'tagRoutesDs',
            value: 'routes',

        }
    };
    ////////////////////////
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
    ////////////////////////////
    $scope.popup_visible = false;
    $scope.popup_title = 'Monthly';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            // $scope.pop_height = $(window).height() - 30;
            // $scope.dg_height = $scope.pop_height - 133;
            // $scope.scroll_height = $scope.pop_height - 140;
            //if ($scope.chart_main_instance)
            //    $scope.chart_main_instance.render();
            $scope.routes = $scope.prms.routes;
            $scope.bindCharts();



        },
        onHiding: function () {

            $scope.popup_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },

        bindingOptions: {
            visible: 'popup_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_title',

        }
    };
    /////////////////////////////
    $scope.rebuild = function () {
        // $scope.mainSeries = [];
        // $scope.legSeries = [];
        //$scope.paxSeries = [];

        $scope.summeries = Enumerable.From($scope.routesDs.summary).Where(function (x) {
            return $scope.routes.indexOf(x.Arg) != -1;
        }).OrderByDescending('$.Sum').ToArray();


        //$scope.tagRoutesDs = Enumerable.From($scope.routesDs.summary).Select('$.Arg').OrderBy('$').ToArray();


        $scope.buildCharts();

        //$scope.bindCharts();
    };
    /////////////////////////////
    $scope.tempData = null;
    $scope.init = function () {
        $scope.year = null;
        $scope.routes = [];
        $scope.routesDs = [];

        $scope.dataSource = [];
        $scope.mainDatasource = null;
        $scope.mainSeries = [];
        $scope.legSeries = [];
        $scope.legTotalSeries = [];
        $scope.paxSeries = [];
        $scope.paxTotalSeries = [];
        $scope.blockSeries = [];
        $scope.blockTotalSeries = [];
        $scope.rpkSeries = [];
        $scope.rpkTotalSeries = [];
        $scope.summeries = null;
        $scope.summeriesLeg = null;
        $scope.summeriesPax = null;
        $scope.tagRoutesDs = [];
        $scope.arguments = [];
        ////////////////////
        monthNames = _monthNames;//  Enumerable.From(_monthNames).Where(function (x) { return $scope.prms.arguments.indexOf(x) != -1; }).ToArray();
        $scope.monthNames2 = Enumerable.From(_monthNames).Where(function (x) { return $scope.prms.arguments.indexOf(x) != -1; }).ToArray();
        console.log(monthNames);
        $scope.year = $scope.prms.year;

        $scope.routesDs = $scope.prms.routesDs;

        $scope.tagRoutesDs = Enumerable.From($scope.routesDs.summary).Select('$.Arg').OrderBy('$').ToArray();
        //$scope.routes = $scope.prms.routes;
    };
    $scope.prms = null;
    $scope.$on('InitfuelbiRoute', function (event, prms) {
        $scope.prms = prms;
        console.log(prms.total);
        $scope.init();
        // $scope.buildCharts2($scope.tagRoutesDs);

        //$scope.summeries = Enumerable.From($scope.routesDs.summary).Where(function (x) {
        //    return $scope.routes.indexOf(x.Arg) != -1;
        //}).OrderByDescending('$.Sum').ToArray();


        //$scope.buildCharts();



        $scope.popup_visible = true;

    });
    //////////////////////////////

}]);  