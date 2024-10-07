'use strict';
app.controller('delaykpiController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'biService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, biService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams;
    $scope.baseYear = 1399;
    $scope.baseMonth = 4;

    $scope.month = null;
    $scope.year = null;
    //////////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Overall", id: 'overall' },
        { text: "Categories", id: 'category' },
        { text: "Technical", id: 'technical' },
        { text: "Airports", id: 'airport' },
        //{ text: "Registers", id: 'register' },
        //{ text: "Route", id: 'route' },
        { text: 'Statistics', id: 'stats' }



    ];
    $scope.activeTab = "";
    $scope.isPivotVisible = false;
    $scope.doTabChanged = function (id) {
        switch (id) {
            case 'overall':
                $scope.activeTab = id;
                break;
            case 'category':
                $scope.activeTab = id;
                $scope.bindCategories();

                break;
            case 'technical':
                $scope.activeTab = id;
                $scope.bindTechnical();
               // $scope.bindCategories();

                break;
            case 'airport':
                $scope.activeTab = id;
                $scope.bindAirport();

                break;
            case 'route':
                $scope.activeTab = id;
                $scope.bindRoutes();

                break;
            case 'aircraft':
                $scope.activeTab = id;
                $scope.bindAircrafts();
                break;
            case 'register':
                $scope.activeTab = id;
                $scope.bindRegisters();

                break;
            case 'flighttime':
                $scope.activeTab = id;
                break;
            case 'weightdistance':
                $scope.activeTab = id;
                break;
            case 'stats':

                setTimeout(function () {


                    $scope.isPivotVisible = true;
                    //console.log($scope.fuelPivotChart);
                    //$scope.fuelPivotChart.refresh();
                    $scope.pivot_fuel_instance.repaint();
                    //$scope.pivot_fuel_instance.getDataSource().expandHeaderItem("row", [1399]);
                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChart, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {
                            // Change series options here
                            //  seriesOptions.visible = false;
                            // //console.log(seriesOptions);
                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['Delay'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });

                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChartPax, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {

                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['Pax'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });

                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChartCycle, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {

                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['Cycle'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });

                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChartBL, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {

                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['B/L'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });

                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChartDistance, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {

                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['Distance'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });

                    $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChartKPI, {
                        dataFieldsDisplayMode: "splitPanes",
                        alternateDataFields: false,
                        inverted: true,
                        customizeSeries: function (seriesName, seriesOptions) {

                            return seriesOptions; // This line is optional
                        },
                        customizeChart: function (chartOptions) {
                            var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                return ['Count'].indexOf(x.name) != -1;
                            }).ToArray();
                            chartOptions.panes = panes; //chartOptions.panes[1];
                        }
                        // putDataFieldsInto:'args',
                    });


                }, 500);
                $scope.activeTab = id;
                break;

            default:
                break;
        }
    };
    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {

            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $scope.activeTab = "";

            $scope.doTabChanged(id);


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
    $scope.getDiffStyle = function (a, value) {
        if (a == 0) {
            return { color: '#999999' };


        } else
            if (a == -1) {
                if (value <= 0) return { color: '#339966' };
                else return { color: '#ff0066' };

            }
            else {
                if (value >= 0) return { color: '#339966' };
                else return { color: '#ff0066' };
            }

    };
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    function customRadius(context) {
        var ds = context.dataset.ds;
        var item = Enumerable.From(ds).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
        if (!item)
            return 3;
        var dindex = ds.indexOf(item);

        let index = context.dataIndex;
        // let value = context.dataset.data[index];
        //return index == $scope.month - 1 ? 6 : 3;
        return index == dindex ? 6 : 3;
    }
    function customBgColor(context) {
        var ds = context.dataset.ds;
        var item = Enumerable.From(ds).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
        if (!item)
            return '#ddd';
        var dindex = ds.indexOf(item);
        let index = context.dataIndex;
        //let value = context.dataset.data[index];
        //return index == $scope.month - 1 ? '#ff33cc' : '#ddd';
        return index == dindex ? '#ff33cc' : '#ddd';
    }
    ////////////////////////////////
    var dcChart = null;
    //4-11
    $scope.initDCChart = function () {
        if (dcChart)
            dcChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        
        var lbls = Enumerable.From(data)//.Where('$.Year==' + $scope.year)

            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.DelayPerLeg').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayPerLeg');
        var maxRpk = Enumerable.From(data).Max('$.DelayPerLeg');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'DL/Cycle',

                    borderColor: '#33adff',
                    //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                    data: rpk, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dcChart = new Chart($('.chart-dc'), config);



    };
    var d30Chart = null;
    $scope.initD30Chart = function () {
        if (d30Chart)
            d30Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerPaxBlockTime').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerPaxBlockTime');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerPaxBlockTime');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'F/RPB',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        d30Chart = new Chart($('.chart-d30'), config);



    };
    var dlChart = null;
    $scope.initDLChart = function () {
        if (dlChart)
            dlChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.Delay').ToArray();
        var minRpk = Enumerable.From(data).Min('$.Delay');
        var maxRpk = Enumerable.From(data).Max('$.Delay');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dlChart = new Chart($('.chart-dl'), config);



    };

    var otfChart = null;
    $scope.initOTFChart = function () {
        if (otfChart)
            otfChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.OnTimeFlightCount').ToArray();
        var minRpk = Enumerable.From(data).Min('$.OnTimeFlightCount');
        var maxRpk = Enumerable.From(data).Max('$.OnTimeFlightCount');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OnTime Flts',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        otfChart = new Chart($('.chart-otf'), config);



    };

    var otfcChart = null;
    $scope.initOTFCChart = function () {
        if (otfcChart)
            otfcChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.OnTimeFlightsPerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.OnTimeFlightsPerAll');
        var maxRpk = Enumerable.From(data).Max('$.OnTimeFlightsPerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        otfcChart = new Chart($('.chart-otfc'), config);



    };

    //magu25
    var dfco30Chart = null;
    $scope.initDFCO30Chart = function () {
        if (dfco30Chart)
            dfco30Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelayOver30PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelayOver30PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelayOver30PerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfco30Chart = new Chart($('.chart-dfco30'), config);



    };

    var dfco180Chart = null;
    $scope.initDFCO180Chart = function () {
        if (dfco180Chart)
            dfco180Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelayOver180PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelayOver180PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelayOver180PerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfco180Chart = new Chart($('.chart-dfco180'), config);



    };

    var dfcu30Chart = null;
    $scope.initDFCU30Chart = function () {
        if (dfcu30Chart)
            dfcu30Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelayUnder30PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelayUnder30PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelayUnder30PerAll');
        var config = {
            type: 'line',
            data: {

                labels: lbls,
                datasets: [{
                    label: 'OTFC',
                    ds: data,
                    borderColor: '#33adff',
                    //backgroundColor:'#f0dfdb',
                    data: rpk,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfcu30Chart = new Chart($('.chart-dfcu30'), config);



    };


    var dfc3060Chart = null;
    $scope.initDFC3060Chart = function () {
        if (dfc3060Chart)
            dfc3060Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelay3060PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelay3060PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelay3060PerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfc3060Chart = new Chart($('.chart-dfc3060'), config);



    };


    var dfc60120Chart = null;
    $scope.initDFC60120Chart = function () {
        if (dfc60120Chart)
            dfc60120Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelay60120PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelay60120PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelay60120PerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfc60120Chart = new Chart($('.chart-dfc60120'), config);



    };

    var dfc120180Chart = null;
    $scope.initDFC120180Chart = function () {
        if (dfc120180Chart)
            dfc120180Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelay120180PerAll').ToArray();

        var minRpk = Enumerable.From(data).Min('$.FltDelay120180PerAll');
        var maxRpk = Enumerable.From(data).Max('$.FltDelay120180PerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'OTFC',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfc120180Chart = new Chart($('.chart-dfc120180'), config);



    };

    //fuel per cycle
    var fd30Chart = null;
    $scope.initFD30Chart = function () {
        if (fd30Chart)
            fd30Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelayOver30').ToArray();
        var minRpk = Enumerable.From(data).Min('$.FltDelayOver30');
        var maxRpk = Enumerable.From(data).Max('$.FltDelayOver30');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'FD30+',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        fd30Chart = new Chart($('.chart-fd30'), config);



    };

    var fd180Chart = null;
    $scope.initFD180Chart = function () {
        if (fd180Chart)
            fd180Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.FltDelayOver180').ToArray();
        var minRpk = Enumerable.From(data).Min('$.FltDelayOver180');
        var maxRpk = Enumerable.From(data).Max('$.FltDelayOver180');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'FD180+',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        fd180Chart = new Chart($('.chart-fd180'), config);



    };

    var pfd180Chart = null;
    $scope.initPFD180Chart = function () {
        if (pfd180Chart)
            pfd180Chart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.PaxDelayOver180').ToArray();
        var minRpk = Enumerable.From(data).Min('$.PaxDelayOver180');
        var maxRpk = Enumerable.From(data).Max('$.PaxDelayOver180');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'PFD180+',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        pfd180Chart = new Chart($('.chart-pfd180'), config);



    };

    var dfChart = null;
    $scope.initDFChart = function () {
        if (dfChart)
            dfChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.DelayedFlightsPerAll').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayedFlightsPerAll');
        var maxRpk = Enumerable.From(data).Max('$.DelayedFlightsPerAll');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'DF',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dfChart = new Chart($('.chart-df'), config);



    };





    var dotfChart = null;
    $scope.initDOTFChart = function () {
        if (dotfChart)
            dotfChart.destroy();
        var data = Enumerable.From($scope.total.items)//.Where('$.Year==' + $scope.year)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.DelayedFlightsPerOnTime').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayedFlightsPerOnTime');
        var maxRpk = Enumerable.From(data).Max('$.DelayedFlightsPerOnTime');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'DOTF',
                    ds: data,
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hoverRadius: 4
                    }
                },

            }
        };
        dotfChart = new Chart($('.chart-dotf'), config);



    };



    /////////////////////////////////////
    var dlTechChart = null;
    //magu2-18
    $scope.initDLTechChart = function () {
        if (dlTechChart)
            dlTechChart.destroy();

        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.Delay').ToArray();
        var minRpk = Enumerable.From(data).Min('$.Delay');
        var maxRpk = Enumerable.From(data).Max('$.Delay');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dlTechChart = new Chart($('.chart-dl-tech'), config);



    };

    var dcTechChart = null;
    $scope.initDCTechChart = function () {
        if (dcTechChart)
            dcTechChart.destroy();
        //var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.DelayPerLeg').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayPerLeg');
        var maxRpk = Enumerable.From(data).Max('$.DelayPerLeg');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dcTechChart = new Chart($('.chart-dc-tech'), config);



    };


    var ocTechChart = null;
    $scope.initOCTechChart = function () {
        if (ocTechChart)
            ocTechChart.destroy();
        //var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.CountPerLeg').ToArray();
        var minRpk = Enumerable.From(data).Min('$.CountPerLeg');
        var maxRpk = Enumerable.From(data).Max('$.CountPerLeg');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        ocTechChart = new Chart($('.chart-oc-tech'), config);



    };


    var dt30TechChart = null;
    $scope.initDT30TechChart = function () {
        if (dt30TechChart)
            dt30TechChart.destroy();
        // var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.DelayUnder30Time').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayUnder30Time');
        var maxRpk = Enumerable.From(data).Max('$.DelayUnder30Time');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dt30TechChart = new Chart($('.chart-dt30-tech'), config);



    };


    var do30TechChart = null;
    $scope.initDO30TechChart = function () {
        if (do30TechChart)
            do30TechChart.destroy();
        //var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.DelayUnder30').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayUnder30');
        var maxRpk = Enumerable.From(data).Max('$.DelayUnder30');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        do30TechChart = new Chart($('.chart-do30-tech'), config);



    };


    var dt180TechChart = null;
    $scope.initDT180TechChart = function () {
        if (dt180TechChart)
            dt180TechChart.destroy();
        //var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.DelayOver180Time').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayOver180Time');
        var maxRpk = Enumerable.From(data).Max('$.DelayOver180Time');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        dt180TechChart = new Chart($('.chart-dt180-tech'), config);



    };


    var do180TechChart = null;
    $scope.initDO180TechChart = function () {
        if (do180TechChart)
            do180TechChart.destroy();
        //var data = Enumerable.From($scope.technicals).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
        var data = Enumerable.From($scope.technicals)
            .Where(function (x) {
                return x.Year >= $scope.year - 1 && x.Year <= $scope.year
            })
            .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
        var lbls = Enumerable.From(data).OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

        var rpk = Enumerable.From(data).Select('$.DelayOver180').ToArray();
        var minRpk = Enumerable.From(data).Min('$.DelayOver180');
        var maxRpk = Enumerable.From(data).Max('$.DelayOver180');
        var config = {
            type: 'line',
            data: {

                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Delay',
                    ds: data,
                    borderColor: '#d2a679',
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
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },

            }
        };
        do180TechChart = new Chart($('.chart-do180-tech'), config);



    };

    $scope.initTechCharts = function () {
        $scope.initDLTechChart();
        $scope.initDCTechChart();
        $scope.initOCTechChart();
        $scope.initDO30TechChart();
        $scope.initDT30TechChart();
        $scope.initDO180TechChart();
        $scope.initDT180TechChart();
    };

    ////////////////////////////////
    const regs = ['FPA', 'FPB', 'FPC'];
    const regColors = ['#ff9933', '#0099cc', '#00ff00'];
    $scope.registers = null;
    $scope.actypes = null;
    $scope.getRealMSNs = function (cid, callback) {
        if ($scope.registers) {
            if (callback)
                callback();
            return;
        }
        $scope.loadingVisible = true;
        flightService.getRealRegisters(cid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.registers = Enumerable.From(response).Where(function (x) {
                return !x.isVirtual && regs.indexOf(x.Register) != -1;
            }).OrderBy('$.Register').ToArray();
            $scope.actypes = Enumerable.From($scope.registers).Select("x => { Type: x.AircraftType, TypeId: x.AircraftTypeId }")
                .Distinct("[$.Type, $.TypeId].join(',')").ToArray();
            if (callback)
                callback();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    ////////////////////////////////
    $scope.mainDatasource = null;
    $scope.mainCategoriesDatasource = null;
    $scope.mainTechnicalsDatasource = null;
    $scope.mainAirportsDatasource = null;
    $scope.getDataMonthly = function (callback) {
        if (!$scope.mainDatasource) {
            $scope.loadingVisible = true; 
            biService.getDelayMonthly(/*$scope.year*/-1).then(function (response) {
                $scope.loadingVisible = false;
                $scope.mainDatasource = response;
                if (callback)
                    callback(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
            callback($scope.mainDatasource);

    };
    //4-17
    $scope.getDataMonthlyCategories = function (callback) {
        if (!$scope.mainCategoriesDatasource) {
            $scope.loadingVisible = true;
            biService.getDelayCategoriesMonthly(/*$scope.year*/-1).then(function (response) {
                $scope.loadingVisible = false;
                $scope.mainCategoriesDatasource = response;
                if (callback)
                    callback(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
            callback($scope.mainCategoriesDatasource);

    };
    $scope.getDataMonthlyTechnicals = function (callback) {
        if (!$scope.mainTechnicalsDatasource) {
            $scope.loadingVisible = true;
            biService.getDelayTechnicalsMonthly(/*$scope.year*/-1).then(function (response) {
                $scope.loadingVisible = false;
                $scope.mainTechnicalsDatasource = response;
                if (callback)
                    callback(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
            callback($scope.mainTechnicalsDatasource);

    };
    $scope.getDataMonthlyAirports = function (callback) {
        if (!$scope.mainAirportsDatasource) {
            $scope.loadingVisible = true;
            biService.getDelayAirportsMonthly(/*$scope.year*/-1).then(function (response) {
                $scope.loadingVisible = false;
                $scope.mainAirportsDatasource = response;
                if (callback)
                    callback(response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
            callback($scope.mainAirportsDatasource);

    };
    ////////////////////////////////
    $scope.getPastMonth = function () {
        if ($scope.month == 1)
            return 12;
        return $scope.month - 1;
    };
    $scope.getPastYear = function () {
        if ($scope.month == 1)
            return $scope.year - 1;
        return $scope.year;
    };
    $scope.total = {};
    $scope.categories = null;
    $scope.bindmain = function () {
        $scope.getDataMonthly(function (response) {
            $scope.total = response;

            $.each($scope.total.yearSummary, function (_i, _d) {
                _d.ArgStr = _d.Year.toString();
                _d.Delay2 = $scope.formatMinutes(_d.Delay);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            });
            var sumax = Enumerable.From($scope.total.yearSummary).Select('$.Year').Max();
            $scope.total.yearSummary.push({ Year: sumax + 1, ArgStr: (sumax + 1).toString(), Delay: 0, BlockTime: 0, Cycles: 0, DelayedFlights: 0, OnTimeFlights: 0, TotalPax: 0, TotalPaxAll: 0 })

           


            //$scope.catNames = Enumerable.From($scope.total./*categories*/categoryNames).Select('$.ICategory').Distinct().ToArray();
            $scope.catNames = Enumerable.From($scope.total.categoryNames).Distinct().ToArray();
            $scope.current = Enumerable.From($scope.total.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();

            $scope.past = Enumerable.From($scope.total.items).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault();
            $.each($scope.total.items, function (_i, _d) {
                _d['ArgStr'] = _d.MonthName;
                _d['ArgNum'] = Number(_d.Month);
                _d['Delay' + '_' + _d.Year] = _d.Delay;
                _d['DelayPerLeg' + '_' + _d.Year] = _d.DelayPerLeg;
                _d['FlightCount' + '_' + _d.Year] = _d.FlightCount;
                _d['AFlightCount' + '_' + _d.Year] = _d.AFlightCount;
                _d['OnTimeFlightCount' + '_' + _d.Year] = _d.OnTimeFlightCount;
                _d.ABlockTime2 = $scope.formatMinutes(_d.ABlockTime);
                _d.PreABlockTime2 = $scope.formatMinutes(_d.PreABlockTime);
                _d.DelayPerLeg2 = $scope.formatMinutes(_d.DelayPerLeg);
                _d.PreDelayPerLeg2 = $scope.formatMinutes(_d.PreDelayPerLeg);

                _d.Delay2 = $scope.formatMinutes(_d.Delay);
                _d.PreDelay2 = $scope.formatMinutes(_d.PreDelay);

                _d['OnTimeFlightsPerAll' + '_' + _d.Year] = _d.OnTimeFlightsPerAll;
                _d['PreOnTimeFlightsPerAll' + '_' + _d.Year] = _d.PreOnTimeFlightsPerAll;

                _d['DelayedFlightsPerAll' + '_' + _d.Year] = _d.DelayedFlightsPerAll;
                _d['PreDelayedFlightsPerAll' + '_' + _d.Year] = _d.PreDelayedFlightsPerAll;
                _d['DelayedFlightsPerOnTime' + '_' + _d.Year] = _d.DelayedFlightsPerOnTime;

                _d['FltDelayUnder30' + '_' + _d.Year] = _d.FltDelayUnder30;
                _d['PreFltDelayUnder30' + '_' + _d.Year] = _d.PreFltDelayUnder30;
                _d['FltDelayUnder30Diff' + '_' + _d.Year] = _d.FltDelayUnder30Diff;
                _d['FltDelayOver30' + '_' + _d.Year] = _d.FltDelayOver30;
                _d['PreFltDelayOver30' + '_' + _d.Year] = _d.PreFltDelayOver30;
                _d['FltDelayOver30Diff' + '_' + _d.Year] = _d.FltDelayOver30Diff;
                _d['FltDelay3060' + '_' + _d.Year] = _d.FltDelay3060;
                _d['PreFltDelay3060' + '_' + _d.Year] = _d.PreFltDelay3060;
                _d['FltDelay3060Diff' + '_' + _d.Year] = _d.FltDelay3060Diff;
                _d['FltDelay60120' + '_' + _d.Year] = _d.FltDelay60120;
                _d['PreFltDelay60120' + '_' + _d.Year] = _d.PreFltDelay60120;
                _d['FltDelay60120Diff' + '_' + _d.Year] = _d.FltDelay60120Diff;
                _d['FltDelay120180' + '_' + _d.Year] = _d.FltDelay120180;
                _d['PreFltDelay120180' + '_' + _d.Year] = _d.PreFltDelay120180;
                _d['FltDelay120180Diff' + '_' + _d.Year] = _d.FltDelay120180Diff;
                _d['FltDelayOver180' + '_' + _d.Year] = _d.FltDelayOver180;
                _d['PreFltDelayOver180' + '_' + _d.Year] = _d.PreFltDelayOver180;
                _d['FltDelayOver180Diff' + '_' + _d.Year] = _d.FltDelayOver180Diff;
                _d['FltDelayOver240' + '_' + _d.Year] = _d.FltDelayOver240;
                _d['PreFltDelayOver240' + '_' + _d.Year] = _d.PreFltDelayOver240;
                _d['FltDelayOver240Diff' + '_' + _d.Year] = _d.FltDelayOver240Diff;
                _d['FltDelayUnder30PerAll' + '_' + _d.Year] = _d.FltDelayUnder30PerAll;
                _d['PreFltDelayUnder30PerAll' + '_' + _d.Year] = _d.PreFltDelayUnder30PerAll;
                _d['FltDelayUnder30PerDelayed' + '_' + _d.Year] = _d.FltDelayUnder30PerDelayed;
                _d['PreFltDelayUnder30PerDelayed' + '_' + _d.Year] = _d.PreFltDelayUnder30PerDelayed;
                _d['FltDelayOver30PerAll' + '_' + _d.Year] = _d.FltDelayOver30PerAll;
                _d['PreFltDelayOver30PerAll' + '_' + _d.Year] = _d.PreFltDelayOver30PerAll;
                _d['FltDelayOver30PerDelayed' + '_' + _d.Year] = _d.FltDelayOver30PerDelayed;
                _d['PreFltDelayOver30PerDelayed' + '_' + _d.Year] = _d.PreFltDelayOver30PerDelayed;
                _d['FltDelay3060PerAll' + '_' + _d.Year] = _d.FltDelay3060PerAll;
                _d['PreFltDelay3060PerAll' + '_' + _d.Year] = _d.PreFltDelay3060PerAll;
                _d['FltDelay3060PerDelayed' + '_' + _d.Year] = _d.FltDelay3060PerDelayed;
                _d['PreFltDelay3060PerDelayed' + '_' + _d.Year] = _d.PreFltDelay3060PerDelayed;
                _d['FltDelay60120PerAll' + '_' + _d.Year] = _d.FltDelay60120PerAll;
                _d['PreFltDelay60120PerAll' + '_' + _d.Year] = _d.PreFltDelay60120PerAll;
                _d['FltDelay60120PerDelayed' + '_' + _d.Year] = _d.FltDelay60120PerDelayed;
                _d['PreFltDelay60120PerDelayed' + '_' + _d.Year] = _d.PreFltDelay60120PerDelayed;
                _d['FltDelay120180PerAll' + '_' + _d.Year] = _d.FltDelay120180PerAll;
                _d['PreFltDelay120180PerAll' + '_' + _d.Year] = _d.PreFltDelay120180PerAll;
                _d['FltDelay120180PerDelayed' + '_' + _d.Year] = _d.FltDelay120180PerDelayed;
                _d['PreFltDelay120180PerDelayed' + '_' + _d.Year] = _d.PreFltDelay120180PerDelayed;
                _d['FltDelayOver180PerAll' + '_' + _d.Year] = _d.FltDelayOver180PerAll;
                _d['PreFltDelayOver180PerAll' + '_' + _d.Year] = _d.PreFltDelayOver180PerAll;
                _d['FltDelayOver180PerDelayed' + '_' + _d.Year] = _d.FltDelayOver180PerDelayed;
                _d['PreFltDelayOver180PerDelayed' + '_' + _d.Year] = _d.PreFltDelayOver180PerDelayed;
                _d['FltDelayOver240PerAll' + '_' + _d.Year] = _d.FltDelayOver240PerAll;
                _d['PreFltDelayOver240PerAll' + '_' + _d.Year] = _d.PreFltDelayOver240PerAll;
                _d['FltDelayOver240PerDelayed' + '_' + _d.Year] = _d.FltDelayOver240PerDelayed;

            });
            //magu2
            $scope.pieOnTimeDs = [
                { type: 'OnTime', current: $scope.current.OnTimeFlightCount, past: $scope.past.OnTimeFlightCount },
                { type: 'Delayed', current: $scope.current.AFlightCount - $scope.current.OnTimeFlightCount, past: $scope.past.AFlightCount - $scope.past.OnTimeFlightCount },
            ];
            $scope.pieDlCountsDs = [
                { type: '-30m', current: $scope.current.DelayUnder30 ? $scope.current.DelayUnder30 : null, past: $scope.past.DelayUnder30 || null },
                { type: '30-60m', current: $scope.current.Delay3060 ? $scope.current.Delay3060 : null, past: $scope.past.Delay3060 || null },
                { type: '1-2h', current: $scope.current.Delay60120 ? $scope.current.Delay60120 : null, past: $scope.past.Delay60120 || null },
                { type: '2-3h', current: $scope.current.Delay120180 ? $scope.current.Delay120180 : null, past: $scope.past.Delay120180 || null },
                { type: '+3h', current: $scope.current.DelayOver180 ? $scope.current.DelayOver180 : null, past: $scope.past.DelayOver180 || null },
            ];
            $scope.pieDlFLTCountsDs = [
                { type: '-30m', current: $scope.current.FltDelayUnder30, past: $scope.past.FltDelayUnder30 },
                { type: '30-60m', current: $scope.current.FltDelay3060, past: $scope.past.FltDelay3060 },
                { type: '1-2h', current: $scope.current.FltDelay60120, past: $scope.past.FltDelay60120 },
                { type: '2-3h', current: $scope.current.FltDelay120180, past: $scope.past.FltDelay120180 },
                { type: '+3h', current: $scope.current.FltDelayOver180, past: $scope.past.FltDelayOver180 },
            ];

            $scope.polarDelaysTime = [{
                arg: "-30",
                current: $scope.current.DelayUnder30Time,
                past: $scope.past.DelayUnder30Time,

            }, {
                arg: "30-60",
                current: $scope.current.Delay3060Time,
                past: $scope.past.Delay3060Time,

            },
            {
                arg: "60-120",
                current: $scope.current.Delay60120Time,
                past: $scope.past.Delay60120Time,

            },
            {
                arg: "120-180",
                current: $scope.current.Delay120180Time,
                past: $scope.past.Delay120180Time,

            },
            {
                arg: "180+",
                current: $scope.current.DelayOver180Time,
                past: $scope.past.DelayOver180Time,

            },

            ];

            $scope.currentFlights = Enumerable.From($scope.total.totalFlights).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
            //console.log('DOOOOOOOOOOOOOOOOOOOOOOOOL');

            //console.log($scope.total.totalFlights);
            $scope.pastFlights = Enumerable.From($scope.total.totalFlights).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault();

            //chico
            $scope.initDCChart();
            $scope.initDLChart();
            $scope.initOTFChart();
            $scope.initOTFCChart();
            $scope.initFD30Chart();
            $scope.initFD180Chart();
            $scope.initPFD180Chart();
            $scope.initDFChart();
            $scope.initDOTFChart();

            $scope.initDFCU30Chart();
            $scope.initDFC3060Chart();
            $scope.initDFC60120Chart();

            $scope.initDFC120180Chart();
            $scope.initDFCO30Chart();
            $scope.initDFCO180Chart();

            $scope.doTabChanged($scope.selectedTabId);
        });

    };
    $scope.filterAirport = [];
    $scope.tagAirports = {
        searchEnabled: true,


        bindingOptions: {
            dataSource: 'tagAirportsDs',
            value: 'filterAirport',

        }
    };
    $scope.bindAirport = function () {
        $scope.getDataMonthlyAirports(function (response) {
            try {
                $scope.total.airports = response.airports;
                $scope.airports = Enumerable.From($scope.total.airports)
                    .Where('Number($.Year)<' + $scope.nowYear + '|| (Number($.Year)==' + $scope.nowYear + ' && Number($.Month)<=' + $scope.nowMonth + ')')
                    .ToArray();
                //$scope.technicalRegisters = Enumerable.From($scope.total.technicals).Where('Number($.Year)<' + $scope.nowYear + '|| (Number($.Year)==' + $scope.nowYear + ' && Number($.Month)<=' + $scope.nowMonth + ')').ToArray();
                $scope.polarTimeAirportDs = [];
                $.each($scope.airports, function (_i, _d) {
                    //karo
                    _d.id = _i + 1;
                    _d['ArgNum'] = _d.Month;
                    _d['ArgStr'] = _d.MonthName;
                    _d['Delay' + '_' + _d.Year + '_' + _d.Airport] = _d['Delay'];
                    _d['Count' + '_' + _d.Year + '_' + _d.Airport] = _d['Count'];
                    _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.Airport] = _d['DelayPerLeg'];
                    _d['CountPerLeg' + '_' + _d.Year + '_' + _d.Airport] = _d['CountPerLeg'];
                    _d['AFlightCount' + '_' + _d.Year + '_' + _d.Airport] = _d['AFlightCount'];

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

                    var total = Enumerable.From($scope.total.items).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month).FirstOrDefault();
                    if (total) {
                        _d['DelayTotal' + '_' + _d.Year] = total.Delay;

                    }
                    if (total && total.Delay > 0)
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.Airport] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                    else
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.Airport] = 0;



                });

                //console.log($scope.airports);
                $scope.currentAirport = Enumerable.From($scope.airports).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).ToArray();
                $scope.pastAirport = Enumerable.From($scope.airports).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).ToArray();


                $scope.groupedAirports = Enumerable.From($scope.airports)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.AirportId + '_' + item.Airport; }, null, (key, g) => {
                        return {
                            AirportId: Number(key.split('_')[0]),
                            Airport: key.split('_')[1],



                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Month').ToArray(),
                            current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(g.source).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault(),
                            //sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                            //sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                            //sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                            //sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),
                            sumDelay: Enumerable.From(g.source).Sum('$.Delay'),
                            sumDelayCurrent: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).Sum('$.Delay'),


                        }
                    })

                    .ToArray();

                $scope.groupedAirports2 = Enumerable.From($scope.groupedAirports)
                    .Where('$.current && $.current.AFlightCount>0')
                    .OrderByDescending(function (x) { return x.current ? x.current.Delay : 0; })
                    .ToArray();
                $scope.tagAirportsDs = Enumerable.From($scope.groupedAirports).OrderBy('$.Airport').Select('$.Airport').ToArray();
                $scope.airportDelayDs = [];
                $scope.airportDelayCycleDs = [];
                var tmp = Enumerable.From($scope.groupedAirports).Where('$.current').OrderByDescending('$.sumDelay').Take(10).ToArray();
                $.each(tmp, function (_i, _d) {

                    $scope.airportDelayDs.push({ Airport: _d.Airport, AirportID: _d.AirportId, DelayCurrent: _d.current.Delay, DelayPast: _d.past.Delay });
                });

                var tmp2 = Enumerable.From($scope.groupedAirports).Where('$.current').OrderByDescending('$.current.DelayPerLeg').Take(10).ToArray();
                $.each(tmp2, function (_i, _d) {

                    $scope.airportDelayCycleDs.push({
                        Airport: _d.Airport, AirportID: _d.AirportId,
                        DLCurrent: _d.current.DelayPerLeg, DLPast: _d.past ? _d.past.DelayPerLeg : 0,
                        DelayCurrent: _d.current.Delay, DelayPast: _d.past ? _d.past.Delay : 0,
                        CycleCurrent: _d.current.AFlightCount, CyclePast: _d.past ? _d.past.AFlightCount : 0,
                    });
                });

                $scope.groupedAirportsByMonth = Enumerable.From($scope.airports)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.Month + '_' + item.MonthName; }, null, (key, g) => {
                        return {
                            Month: Number(key.split('_')[0]),
                            MonthName: key.split('_')[1],

                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Airport').ToArray(),



                        }
                    }).OrderByDescending('$.Month').ToArray();
                $.each($scope.groupedAirportsByMonth, function (_i, _d) {
                    var item = { arg: _d.Month, argStr: _d.MonthName };
                    $.each(_d.items, function (_j, row) {
                        item.Year = Number(row.Year);
                        item[row.Airport + '_' + 'D30Time_' + row.Year] = row.DelayUnder30Time;
                        item[row.Airport + '_' + 'D30pTime_' + row.Year] = row.DelayOver30Time;
                        item[row.Airport + '_' + 'D3060Time_' + row.Year] = row.Delay3060Time;
                        item[row.Airport + '_' + 'D60120Time_' + row.Year] = row.Delay60120Time;
                        item[row.Airport + '_' + 'D120180Time_' + row.Year] = row.Delay120180Time;
                        item[row.Airport + '_' + 'D180Time_' + row.Year] = row.DelayOver180Time;

                        item[row.Airport + '_' + 'D30_' + row.Year] = row.DelayUnder30;
                        item[row.Airport + '_' + 'D30p_' + row.Year] = row.DelayOver30;
                        item[row.Airport + '_' + 'D3060_' + row.Year] = row.Delay3060;
                        item[row.Airport + '_' + 'D60120_' + row.Year] = row.Delay60120;
                        item[row.Airport + '_' + 'D120180_' + row.Year] = row.Delay120180;
                        item[row.Airport + '_' + 'D180_' + row.Year] = row.DelayOver180;
                    });
                    $scope.polarTimeAirportDs.push(item);
                });
            }
            catch (ee) {
                alert(ee);
            }
        });
       


    }
    //4-12
    $scope.bindTechnical = function () {
        //$scope.getDataMonthlyCategories(function (response) {

        //    $scope.total.categories = response.categories;
        //    $scope.total.categoryNames = response.categoryNames;
        //    $scope.categories = $scope.total.categories;
        //    $scope.catNames = Enumerable.From($scope.total.categories).Select('$.ICategory').Distinct().ToArray();
           
        //});
        ///////////////////////////////////
        $scope.bindCategories(function () {
            $scope.getDataMonthlyTechnicals(function (response2) {
                //try {
                $scope.total.technicals = response2.technicals;
                $scope.technicals = Enumerable.From($scope.total.categories).Where('$.ICategory=="TECHNICAL"').ToArray();
                $.each($scope.total.technicals, function (_i, _d) {
                    //karo
                    _d.id = _i + 1;
                    //_d['ArgNum'] = _d.Month;
                    //_d['ArgStr'] = _d.MonthName;
                    _d['Delay' + '_' + _d.Year + '_' + _d.Register] = _d['Delay'];
                    _d['Count' + '_' + _d.Year + '_' + _d.Register] = _d['Count'];
                    _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.Register] = _d['DelayPerLeg'];
                    _d['CountPerLeg' + '_' + _d.Year + '_' + _d.Register] = _d['CountPerLeg'];
                    _d['AFlightCount' + '_' + _d.Year] = _d['AFlightCount'];
                    _d['AFlightCount' + '_' + _d.Year + '_' + _d.Register] = _d['AFlightCount'];
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

                    var total = Enumerable.From($scope.technicals).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month).FirstOrDefault();
                    if (total) {
                        _d['DelayTotal' + '_' + _d.Year] = total.Delay;

                    }
                    if (total && total.Delay > 0)
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.Register] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                    else
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.Register] = 0;



                });

                $scope.currentTechnical = Enumerable.From($scope.technicals).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
                $scope.pastTechnical = Enumerable.From($scope.technicals).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault();


                $scope.technicalRegisters = Enumerable.From($scope.total.technicals).Where('Number($.Year)<' + $scope.nowYear + '|| (Number($.Year)==' + $scope.nowYear + ' && Number($.Month)<=' + $scope.nowMonth + ')').ToArray();


                $scope.groupedTechnicalRegisters = Enumerable.From($scope.technicalRegisters)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.Register + '_' + item.RegisterID + '_' + item.TypeId + '_' + item.AircraftType; }, null, (key, g) => {
                        return {
                            RegisterID: Number(key.split('_')[1]),
                            Register: key.split('_')[0],
                            Type: key.split('_')[3],
                            TypeId: Number(key.split('_')[2]),


                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Month').ToArray(),
                            current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(g.source).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault(),
                            //sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                            //sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                            //sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                            //sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),
                            sumDelay: Enumerable.From(g.source).Sum('$.Delay'),


                        }
                    })
                    //.OrderBy('$.Register')
                    .OrderByDescending('$.current.Delay')
                    .ToArray();

                $scope.registerDelayDs = [];
                var tmp = Enumerable.From($scope.groupedTechnicalRegisters).Where('$.current.Delay>0 || $.past.Delay>0').ToArray();
                $.each(tmp, function (_i, _d) {

                    $scope.registerDelayDs.push({ Register: _d.Register, RegisterID: _d.RegisterID, TypeId: _d.TypeId, Type: _d.Type, DelayCurrent: _d.current.Delay, DelayPast: _d.past.Delay });
                });

                $scope.polarDelaysTechnicalTime = [{
                    arg: "-30",
                    current: $scope.currentTechnical.DelayUnder30Time,
                    past: $scope.pastTechnical.DelayUnder30Time,

                }, {
                    arg: "30-60",
                    current: $scope.currentTechnical.Delay3060Time,
                    past: $scope.pastTechnical.Delay3060Time,

                },
                {
                    arg: "60-120",
                    current: $scope.currentTechnical.Delay60120Time,
                    past: $scope.pastTechnical.Delay60120Time,

                },
                {
                    arg: "120-180",
                    current: $scope.currentTechnical.Delay120180Time,
                    past: $scope.pastTechnical.Delay120180Time,

                },
                {
                    arg: "180+",
                    current: $scope.currentTechnical.DelayOver180Time,
                    past: $scope.pastTechnical.DelayOver180Time,

                },

                ];


                $scope.polarDelaysTechnical = [{
                    arg: "-30",
                    current: $scope.currentTechnical.DelayUnder30,
                    past: $scope.pastTechnical.DelayUnder30,

                }, {
                    arg: "30-60",
                    current: $scope.currentTechnical.Delay3060,
                    past: $scope.pastTechnical.Delay3060,

                },
                {
                    arg: "60-120",
                    current: $scope.currentTechnical.Delay60120,
                    past: $scope.pastTechnical.Delay60120,

                },
                {
                    arg: "120-180",
                    current: $scope.currentTechnical.Delay120180,
                    past: $scope.pastTechnical.Delay120180,

                },
                {
                    arg: "180+",
                    current: $scope.currentTechnical.DelayOver180,
                    past: $scope.pastTechnical.DelayOver180,

                },

                ];
                ////////////////////////
                $scope.polarTimeTechnicalDs = [];
                $scope.groupedTechnicalRegistersByMonth = Enumerable.From($scope.technicalRegisters)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.Month + '_' + item.MonthName; }, null, (key, g) => {
                        return {
                            Month: Number(key.split('_')[0]),
                            MonthName: key.split('_')[1],

                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Register').ToArray(),



                        }
                    }).OrderByDescending('$.Month').ToArray();
                $.each($scope.groupedTechnicalRegistersByMonth, function (_i, _d) {
                    var item = { arg: _d.Month, argStr: _d.MonthName };
                    $.each(_d.items, function (_j, row) {
                        item.Year = Number(row.Year);
                        item[row.Register + '_' + 'D30Time_' + row.Year] = row.DelayUnder30Time;
                        item[row.Register + '_' + 'D30pTime_' + row.Year] = row.DelayOver30Time;
                        item[row.Register + '_' + 'D3060Time_' + row.Year] = row.Delay3060Time;
                        item[row.Register + '_' + 'D60120Time_' + row.Year] = row.Delay60120Time;
                        item[row.Register + '_' + 'D120180Time_' + row.Year] = row.Delay120180Time;
                        item[row.Register + '_' + 'D180Time_' + row.Year] = row.DelayOver180Time;

                        item[row.Register + '_' + 'D30_' + row.Year] = row.DelayUnder30;
                        item[row.Register + '_' + 'D30p_' + row.Year] = row.DelayOver30;
                        item[row.Register + '_' + 'D3060_' + row.Year] = row.Delay3060;
                        item[row.Register + '_' + 'D60120_' + row.Year] = row.Delay60120;
                        item[row.Register + '_' + 'D120180_' + row.Year] = row.Delay120180;
                        item[row.Register + '_' + 'D180_' + row.Year] = row.DelayOver180;
                    });
                    $scope.polarTimeTechnicalDs.push(item);
                });
                ////////////////////////
                $scope.initTechCharts();
                //}
                //catch (ee) {
                //    alert(ee);
                //}
            });
        });


    };
    $scope.lateArr = true;
    $scope.chk_lateArr = {
        text: 'Include LATE ARRIVAL',
        onValueChanged: function (e) {
            $scope.bindCategories();
        },
        bindingOptions: {
            value: 'lateArr',
        }
    };
    $scope.bindCategories = function (callback) {
        $scope.getDataMonthlyCategories(function (response) {
            try {
              
                $scope.total.categories = Enumerable.From(response.categories).ToArray();
                $scope.total.categoryNames = Enumerable.From(response.categoryNames).ToArray();
                 
                if (!$scope.lateArr) {
                    $scope.total.categories = Enumerable.From($scope.total.categories).Where('$.ICategory!="LATE ARRIVAL"').ToArray();
                    $scope.total.categoryNames = Enumerable.From($scope.total.categoryNames).Where('$!="LATE ARRIVAL"').ToArray();
                }
                $scope.categories = $scope.total.categories;
                $scope.catNames = Enumerable.From($scope.total.categories).Select('$.ICategory').Distinct().ToArray();

                $scope.polarTimeDs = [];
                $.each($scope.categories, function (_i, _d) {
                     
                    _d.id = _i + 1;
                    _d['ArgNum'] = _d.Month;
                    _d['ArgStr'] = _d.MonthName;
                    _d['Delay' + '_' + _d.Year + '_' + _d.ICategory] = _d['Delay'];
                    _d['Count' + '_' + _d.Year + '_' + _d.ICategory] = _d['Count'];
                    _d['DelayPerLeg' + '_' + _d.Year + '_' + _d.ICategory] = _d['DelayPerLeg'];
                    _d['CountPerLeg' + '_' + _d.Year + '_' + _d.ICategory] = _d['CountPerLeg'];
                    _d['AFlightCount' + '_' + _d.Year] = _d['AFlightCount'];
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

                    var total = Enumerable.From($scope.total.items).Where('$.Year==' + _d.Year + ' && $.Month==' + _d.Month).FirstOrDefault();
                    if (total) {
                        _d['DelayTotal' + '_' + _d.Year] = total.Delay;

                    }
                    if (total && total.Delay > 0)
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.ICategory] = Number(((_d.Delay * 100.0) / total.Delay).toFixed(2));
                    else
                        _d['DelayRatio' + '_' + _d.Year + '_' + _d.ICategory] = 0;



                }); 
                 
                $scope.currentCategories = Enumerable.From($scope.categories).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).ToArray();
                $scope.pastCategories = Enumerable.From($scope.categories).Where('$.Month==' + $scope.getPastMonth() + ' && $.Year==' + $scope.getPastYear()).ToArray();

                $scope.catDurationStackSeries = [];
                $scope.categoriesByDuration = [];
                var d30 = { title: '-30 min' };
                var d3060 = { title: '30-60 min' };
                var d60120 = { title: '1-2 hrs' };
                var d120180 = { title: '2-3 hrs' };
                var d180 = { title: '+3 hrs' };
                $scope.pieCatDLDs = [];

                $.each($scope.total.categoryNames, function (_i, _d) {
                    var c = Enumerable.From($scope.currentCategories).Where('$.ICategory=="' + _d + '"').FirstOrDefault();
                    var p = Enumerable.From($scope.pastCategories).Where('$.ICategory=="' + _d + '"').FirstOrDefault();

                    $scope.catDurationStackSeries.push({ valueField: 'current_' + _d.replaceAll(' ', ''), name: _d, id: _d, stack: 'current' });
                    //$scope.catDurationStackSeries.push({ valueField: 'past_' + _d.replaceAll(' ', ''), name: 'past: ' + _d, id: _d, stack: 'past'});

                    var dcat = {};
                    dcat.title = _d;
                    dcat.current_delay = c.Delay || 0;
                    dcat.past_delay = p.Delay || 0;
                    dcat.current_count = c.Count || 0;
                    dcat.past_count = p.Count || 0;
                    ////console.log(dcat);

                    $scope.pieCatDLDs.push(dcat);


                    d30['current_' + _d.replaceAll(' ', '')] = c.DelayUnder30Time || 0;
                    d30['past_' + _d.replaceAll(' ', '')] = p.DelayUnder30Time || 0;

                    d3060['current_' + _d.replaceAll(' ', '')] = c.Delay3060Time || 0;
                    d3060['past_' + _d.replaceAll(' ', '')] = p.Delay3060Time || 0;

                    d60120['current_' + _d.replaceAll(' ', '')] = c.Delay60120Time || 0;
                    d60120['past_' + _d.replaceAll(' ', '')] = p.Delay60120Time || 0;

                    d120180['current_' + _d.replaceAll(' ', '')] = c.Delay120180Time || 0;
                    d120180['past_' + _d.replaceAll(' ', '')] = p.Delay120180Time || 0;

                    d180['current_' + _d.replaceAll(' ', '')] = c.DelayOver180Time || 0;
                    d180['past_' + _d.replaceAll(' ', '')] = p.DelayOver180Time || 0;
                });
                $scope.categoriesByDuration.push(d30);
                $scope.categoriesByDuration.push(d3060);
                $scope.categoriesByDuration.push(d60120);
                $scope.categoriesByDuration.push(d120180);
                $scope.categoriesByDuration.push(d180);

                ////console.log($scope.pieCatDLDs);
                $scope.groupedCategories = Enumerable.From($scope.categories)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.ICategory; }, null, (key, g) => {
                        return {
                            ICategory: key,

                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Month').ToArray(),
                            current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            //sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                            //sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                            //sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                            //sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),
                            sumDelay: Enumerable.From(g.source).Sum('$.Delay'),


                        }
                    })
                    //.OrderByDescending('$.sumDelay')
                    .OrderByDescending('$.current.Delay')
                    .ToArray();


                $scope.groupedCategoriesByMonth = Enumerable.From($scope.categories)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.Month + '_' + item.MonthName; }, null, (key, g) => {
                        return {
                            Month: Number(key.split('_')[0]),
                            MonthName: key.split('_')[1],

                            items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.ICategory').ToArray(),



                        }
                    }).OrderByDescending('$.Month').ToArray();
                $.each($scope.groupedCategoriesByMonth, function (_i, _d) {
                    var item = { arg: _d.Month, argStr: _d.MonthName };
                    $.each(_d.items, function (_j, row) {
                        item.Year = Number(row.Year);
                        item[row.ICategory + '_' + 'D30Time_' + row.Year] = row.DelayUnder30Time;
                        item[row.ICategory + '_' + 'D30pTime_' + row.Year] = row.DelayOver30Time;
                        item[row.ICategory + '_' + 'D3060Time_' + row.Year] = row.Delay3060Time;
                        item[row.ICategory + '_' + 'D60120Time_' + row.Year] = row.Delay60120Time;
                        item[row.ICategory + '_' + 'D120180Time_' + row.Year] = row.Delay120180Time;
                        item[row.ICategory + '_' + 'D180Time_' + row.Year] = row.DelayOver180Time;

                        item[row.ICategory + '_' + 'D30_' + row.Year] = row.DelayUnder30;
                        item[row.ICategory + '_' + 'D30p_' + row.Year] = row.DelayOver30;
                        item[row.ICategory + '_' + 'D3060_' + row.Year] = row.Delay3060;
                        item[row.ICategory + '_' + 'D60120_' + row.Year] = row.Delay60120;
                        item[row.ICategory + '_' + 'D120180_' + row.Year] = row.Delay120180;
                        item[row.ICategory + '_' + 'D180_' + row.Year] = row.DelayOver180;
                    });
                    $scope.polarTimeDs.push(item);
                });



            }
            catch (e) {
                alert(e);
            }

            if (callback) {
                callback();
            }
        });


    };



    $scope.totalTypes = {};
    $scope.totalRegisters = {};

    $scope.tabAircraftBound = false;
    $scope.tabRegisterBound = false;
    $scope.bindRegisters = function () {
        if ($scope.tabRegisterBound)
            return;
        $scope.getRealMSNs(Config.CustomerId, function () {

            biService.getFuelMonthlyRegisters(-1).then(function (_reg) {
                $scope.totalRegisters = _reg;
                // $scope.currentRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
                // $scope.pastRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
                $scope.groupedRegisters = Enumerable.From($scope.totalRegisters.items)
                    .Where(function (x) { return regs.indexOf(x.Register) != -1; })
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.TypeId + '_' + item.AircraftType + '_' + item.RegisterID + '_' + item.Register; }, null, (key, g) => {
                        return {
                            TypeId: Number(key.split('_')[0]),
                            Type: key.split('_')[1],
                            RegisterID: Number(key.split('_')[2]),
                            Register: key.split('_')[3],
                            items: g.source,
                            current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                            sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                            sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                            sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),



                        }
                    }).OrderBy('$.Type').ThenBy('$.Register').ToArray();
                $.each($scope.groupedRegisters, function (_x, _g) {
                    _g.sumUsedCurrent = _g.current ? _g.current.UsedKilo : 0;
                    _g.sumUsedPast = _g.past ? _g.past.UsedKilo : 0;
                    _g.sumWeightCurrent = _g.current ? _g.current.WeightTone : 0;
                    _g.sumWeightPast = _g.past ? _g.past.WeightTone : 0;
                    _g.sumLegCurrent = _g.current ? _g.current.Legs : 0;
                    _g.sumLegPast = _g.past ? _g.past.Legs : 0;
                    _g.sumBLCurrent = _g.current ? _g.current.BlockTime : 0;
                    _g.sumBLPast = _g.past ? _g.past.BlockTime : 0;
                });
                $.each($scope.totalRegisters.items, function (_i, _d) {
                    _d.id = _i + 1;
                    _d['UsedPerPaxKiloDistanceKM_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerPaxKiloDistanceKM'];
                    _d['UsedPerSeatKiloDistanceKM_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerSeatKiloDistanceKM'];
                    _d['UsedPerWeightToneDistance_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerWeightToneDistance'];
                    _d['UsedPerLeg_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerLeg'];
                    _d['UsedPerBlockTime_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerBlockTime'];
                    _d['UsedPerWeightToneBlockTime_' + _d.Year + '_' + _d.RegisterID] = _d['UsedPerWeightToneBlockTime'];
                    _d['TotalPax_' + _d.Year + '_' + _d.RegisterID] = _d['TotalPax'];
                    _d['UsedKilo_' + _d.Year + '_' + _d.RegisterID] = _d['UsedKilo'];
                    _d['DistanceKM_' + _d.Year + '_' + _d.RegisterID] = _d['DistanceKM'];
                    _d['WeightTone_' + _d.Year + '_' + _d.RegisterID] = _d['WeightTone'];
                    _d['Legs_' + _d.Year + '_' + _d.RegisterID] = _d['Legs'];
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.PreBlockTime2 = $scope.formatMinutes(_d.PreBlockTime);
                    _d['BlockTime2' + '_' + _d.Year + '_' + _d.RegisterID] = _d.BlockTime2;
                    _d['BlockTime_' + _d.Year + '_' + _d.RegisterID] = _d['BlockTime'];
                    _d['PreBlockTime2' + '_' + _d.Year + '_' + _d.RegisterID] = _d.PreBlockTime2;
                });
                //  //console.log($scope.totalRegisters.items);

                ////console.log('$scope.groupedRegisters');
                ////console.log($scope.groupedRegisters);
                $scope.tabRegisterBound = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //////////////////////////

        });
    };
    $scope.bindAircrafts = function () {
        if ($scope.tabAircraftBound)
            return;
        $scope.getRealMSNs(Config.CustomerId, function () {
            biService.getFuelMonthlyTypes(-1).then(function (_type) {
                $scope.totalTypes = _type;

                $scope.groupedTypes = Enumerable.From($scope.totalTypes.items)
                    //.GroupBy("$.ArgNum", null, (key, g) => {
                    .GroupBy(function (item) { return item.TypeId + '_' + item.AircraftType; }, null, (key, g) => {
                        return {
                            TypeId: Number(key.split('_')[0]),
                            Type: key.split('_')[1],
                            items: g.source,
                            current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                            sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                            sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                            sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),



                        }
                    }).ToArray();
                $.each($scope.groupedTypes, function (_x, _g) {
                    _g.sumUsedCurrent = _g.current ? _g.current.UsedKilo : 0;
                    _g.sumUsedPast = _g.past ? _g.past.UsedKilo : 0;
                    _g.sumWeightCurrent = _g.current ? _g.current.WeightTone : 0;
                    _g.sumWeightPast = _g.past ? _g.past.WeightTone : 0;
                    _g.sumLegCurrent = _g.current ? _g.current.Legs : 0;
                    _g.sumLegPast = _g.past ? _g.past.Legs : 0;
                    _g.sumBLCurrent = _g.current ? _g.current.BlockTime : 0;
                    _g.sumBLPast = _g.past ? _g.past.BlockTime : 0;
                });
                $.each($scope.totalTypes.items, function (_i, _d) {
                    _d.id = _i + 1;
                    _d['UsedPerPaxKiloDistanceKM_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerPaxKiloDistanceKM'];
                    _d['UsedPerSeatKiloDistanceKM_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerSeatKiloDistanceKM'];
                    _d['UsedPerWeightToneDistance_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerWeightToneDistance'];
                    _d['UsedPerLeg_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerLeg'];
                    _d['UsedPerBlockTime_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerBlockTime'];
                    _d['UsedPerWeightToneBlockTime_' + _d.Year + '_' + _d.TypeId] = _d['UsedPerWeightToneBlockTime'];
                    _d['TotalPax_' + _d.Year + '_' + _d.TypeId] = _d['TotalPax'];
                    _d['UsedKilo_' + _d.Year + '_' + _d.TypeId] = _d['UsedKilo'];
                    _d['DistanceKM_' + _d.Year + '_' + _d.TypeId] = _d['DistanceKM'];
                    _d['WeightTone_' + _d.Year + '_' + _d.TypeId] = _d['WeightTone'];
                    _d['Legs_' + _d.Year + '_' + _d.TypeId] = _d['Legs'];
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.PreBlockTime2 = $scope.formatMinutes(_d.PreBlockTime);
                    _d['BlockTime2' + '_' + _d.Year + '_' + _d.Month + '_' + _d.TypeId] = _d.BlockTime2;
                    _d['BlockTime_' + _d.Year + '_' + _d.TypeId] = _d['BlockTime'];
                    _d['PreBlockTime2' + '_' + _d.Year + '_' + _d.Month + '_' + _d.TypeId] = _d.PreBlockTime2;
                });

                $scope.initTypeSummaryCharts();
                //  //console.log($scope.groupedTypes);


                $scope.currentTypes = Enumerable.From($scope.totalTypes.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
                $scope.pastTypes = Enumerable.From($scope.totalTypes.items).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault();
                /////////////////////////////////
                //biService.getFuelMonthlyRegisters(-1).then(function (_reg) {
                //    $scope.totalRegisters = _reg;
                //   // $scope.currentRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
                //   // $scope.pastRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
                //    $scope.groupedRegisters = Enumerable.From($scope.totalRegisters.items)
                //        .Where(function (x) { return regs.indexOf(x.Register) != -1; })
                //        //.GroupBy("$.ArgNum", null, (key, g) => {
                //        .GroupBy(function (item) { return item.TypeId + '_' + item.AircraftType + '_' + item.RegisterID+'_'+item.Register; }, null, (key, g) => {
                //            return {
                //                TypeId: key.split('_')[0],
                //                Type: key.split('_')[1],
                //                RegisterID: key.split('_')[2],
                //                Register: key.split('_')[3],
                //                items: g.source,
                //                current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                //                past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault()

                //            }
                //        }).OrderBy('$.Type').ThenBy('$.Register').ToArray();
                //    ////console.log('$scope.groupedRegisters');
                //    ////console.log($scope.groupedRegisters);

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                ////////////////////////////
                $scope.tabAircraftBound = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        });
    };

    $scope.bindRoutes = function () {
        if ($scope.tabRouteBound)
            return;

        biService.getFuelMonthlyRoutes(-1).then(function (_type) {
            $scope.totalRoutes = _type;

            $scope.groupedRoutes = Enumerable.From($scope.totalRoutes.items)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.FromAirport + '_' + item.FromAirportIATA + '_' + item.ToAirport + '_' + item.ToAirportIATA + '_' + item.Route; }, null, (key, g) => {
                    return {
                        FromAirport: Number(key.split('_')[0]),
                        FromAirportIATA: key.split('_')[1],
                        ToAirport: Number(key.split('_')[2]),
                        ToAirportIATA: key.split('_')[3],
                        Route: key.split('_')[4],
                        TypeId: key.split('_')[4],
                        Type: key.split('_')[4],
                        items: g.source,
                        current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                        past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault(),
                        sumUsed: Enumerable.From(g.source).Sum('$.UsedKilo'),
                        sumLeg: Enumerable.From(g.source).Sum('$.Legs'),
                        sumBL: Enumerable.From(g.source).Sum('$.BlockTime'),
                        sumWeight: Enumerable.From(g.source).Sum('$.WeightTone'),



                    }
                }).ToArray();
            $.each($scope.groupedRoutes, function (_x, _g) {
                _g.sumUsedCurrent = _g.current ? _g.current.UsedKilo : 0;
                _g.sumUsedPast = _g.past ? _g.past.UsedKilo : 0;
                _g.sumWeightCurrent = _g.current ? _g.current.WeightTone : 0;
                _g.sumWeightPast = _g.past ? _g.past.WeightTone : 0;
                _g.sumLegCurrent = _g.current ? _g.current.Legs : 0;
                _g.sumLegPast = _g.past ? _g.past.Legs : 0;
                _g.sumBLCurrent = _g.current ? _g.current.BlockTime : 0;
                _g.sumBLPast = _g.past ? _g.past.BlockTime : 0;
                _g.currentRPKDiff = _g.current ? _g.current.UsedPerPaxKiloDistanceKMDiff : -100000;
            });
            $scope.groupedRoutes = Enumerable.From($scope.groupedRoutes).OrderByDescending('$.currentRPKDiff').ToArray();
            $.each($scope.totalRoutes.items, function (_i, _d) {
                _d.id = _i + 1;
                _d['UsedPerPaxKiloDistanceKM_' + _d.Year + '_' + _d.Route] = _d['UsedPerPaxKiloDistanceKM'];
                _d['UsedPerSeatKiloDistanceKM_' + _d.Year + '_' + _d.Route] = _d['UsedPerSeatKiloDistanceKM'];
                _d['UsedPerWeightToneDistance_' + _d.Year + '_' + _d.Route] = _d['UsedPerWeightToneDistance'];
                _d['UsedPerLeg_' + _d.Year + '_' + _d.Route] = _d['UsedPerLeg'];
                _d['UsedPerBlockTime_' + _d.Year + '_' + _d.Route] = _d['UsedPerBlockTime'];
                _d['UsedPerWeightToneBlockTime_' + _d.Year + '_' + _d.Route] = _d['UsedPerWeightToneBlockTime'];
                _d['TotalPax_' + _d.Year + '_' + _d.Route] = _d['TotalPax'];
                _d['UsedKilo_' + _d.Year + '_' + _d.Route] = _d['UsedKilo'];
                _d['DistanceKM_' + _d.Year + '_' + _d.Route] = _d['DistanceKM'];
                _d['WeightTone_' + _d.Year + '_' + _d.Route] = _d['WeightTone'];
                _d['Legs_' + _d.Year + '_' + _d.Route] = _d['Legs'];
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.PreBlockTime2 = $scope.formatMinutes(_d.PreBlockTime);
                _d['BlockTime2' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Route] = _d.BlockTime2;
                _d['BlockTime_' + _d.Year + '_' + _d.Route] = _d['BlockTime'];
                _d['PreBlockTime2' + '_' + _d.Year + '_' + _d.Month + '_' + _d.Route] = _d.PreBlockTime2;
            });


            //  //console.log($scope.groupedTypes);


            $scope.currentRoute = Enumerable.From($scope.totalRoutes.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
            $scope.pastRoutes = Enumerable.From($scope.totalRoutes.items).Where('$.Month==' + ($scope.getPastMonth()) + ' && $.Year==' + $scope.getPastYear()).FirstOrDefault();
            /////////////////////////////////
            //biService.getFuelMonthlyRegisters(-1).then(function (_reg) {
            //    $scope.totalRegisters = _reg;
            //   // $scope.currentRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
            //   // $scope.pastRegisters = Enumerable.From($scope.totalRegisters.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
            //    $scope.groupedRegisters = Enumerable.From($scope.totalRegisters.items)
            //        .Where(function (x) { return regs.indexOf(x.Register) != -1; })
            //        //.GroupBy("$.ArgNum", null, (key, g) => {
            //        .GroupBy(function (item) { return item.TypeId + '_' + item.AircraftType + '_' + item.RegisterID+'_'+item.Register; }, null, (key, g) => {
            //            return {
            //                TypeId: key.split('_')[0],
            //                Type: key.split('_')[1],
            //                RegisterID: key.split('_')[2],
            //                Register: key.split('_')[3],
            //                items: g.source,
            //                current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
            //                past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault()

            //            }
            //        }).OrderBy('$.Type').ThenBy('$.Register').ToArray();
            //    ////console.log('$scope.groupedRegisters');
            //    ////console.log($scope.groupedRegisters);

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            ////////////////////////////
            $scope.tabRouteBound = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //dlupivot
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
    $scope.monthNames2 = _monthNames;
    const _seasonNames = [
        'بهار',
        'تابستان',
        'پاییز',
        'زمستان',
    ];
    $scope.fuelPivotChart = null;
    $scope.fuelPivotChartOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('Delay') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 550
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChart = e.component;
        }
    };

    $scope.fuelPivotChartPax = null;
    $scope.fuelPivotChartPaxOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('B/L') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 400
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChartPax = e.component;
        }
    };

    $scope.fuelPivotChartCycle = null;
    $scope.fuelPivotChartCycleOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('B/L') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 400
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChartCycle = e.component;
        }
    };

    $scope.fuelPivotChartBL = null;
    $scope.fuelPivotChartBLOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('B/L') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 400
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChartBL = e.component;
        }
    };

    $scope.fuelPivotChartDistance = null;
    $scope.fuelPivotChartDistanceOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('B/L') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 400
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChartDistance = e.component;
        }
    };

    $scope.fuelPivotChartKPI = null;
    $scope.fuelPivotChartKPIOptions = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        palette: 'Bright',
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
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? args.originalValue //new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
                if (args.seriesName.indexOf('B/L') != -1)
                    valueText = $scope.formatMinutes(valueText);

                return {
                    html: args.seriesName

                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>" + valueText + "</div>"
                };
            }
        },
        size: {
            height: 550
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.fuelPivotChartKPI = e.component;
        }
    };

    function expand(dataSource) {
        setTimeout(function () {
            dataSource.expandHeaderItem("row", [1399]);
            //dataSource.expandHeaderItem("column", [2013]);
        }, 100);
    }
    $scope.IsStatsPivotVisible = true;
    $scope.pivot_fuel_instance = null;
    $scope.fuelPivotGridOptions = {
        onContentReady: function (e) {
            if (!$scope.pivot_fuel_instance)
                $scope.pivot_fuel_instance = e.component;

        },
        onCellPrepared: function (e) {

        },
        fieldPanel: {
            showDataFields: true,
            showRowFields: true,
            showColumnFields: true,
            showFilterFields: true,
            allowFieldDragging: true,
            visible: true
        },
        export: {
            enabled: true,
        },
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        height: $(window).height() - 180,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        showRowGrandTotals: true,
        showRowTotals: true,
        showColumnGrandTotals: true,
        showColumnTotals: true,
        dataSource: {

            remoteOperations: true,
            store: DevExpress.data.AspNet.createStore({
                key: "ID",
                loadUrl: $rootScope.serviceUrl + "odata/pivot/delay/total",
                onLoaded: function (result) {
                    //console.log(result);
                }
            }),
            fields: [
                {
                    caption: "Year",
                    width: 120,
                    dataField: "PYear",
                    area: "row",
                    showTotals: false,
                    showGrandTotals: false,
                    expanded: false,

                },

                {
                    caption: "Month",
                    width: 120,
                    dataField: "PMonth",
                    area: "row",
                    showTotals: false,
                    showGrandTotals: false,
                    customizeText: function (e) {

                        return _monthNames[e.value - 1];
                    },
                },
                {
                    caption: "Category",
                    width: 120,
                    dataField: "ICategory",
                    //area: "column",
                    area: "filter",
                    showTotals: false,
                    showGrandTotals: false,

                },

                //{
                //    dataField: "AircraftType",
                //    // dataType: "date",
                //    area: "column"
                //},
                {
                    dataField: "AircraftType",
                    caption: "Type",
                    width: 80,
                    // dataType: "date",
                    area: "filter"
                },
                {
                    dataField: "Register",
                    caption: "Register",
                    width: 80,
                    // dataType: "date",
                    area: "filter"
                },
                {
                    dataField: "FromAirportIATA",
                    caption: "Airport",
                    width: 80,
                    // dataType: "date",
                    area: "filter"
                },


                {
                    caption: "Delay",
                    dataField: "Delay",
                    dataType: "number",
                    summaryType: "sum",
                    //summaryType: "avgRPK",

                    area: "data",
                    customizeText: function (e) {
                        if (!e.value)
                            return '';
                        else
                            return $scope.formatMinutes(e.value);
                    },

                },
                {
                    caption: "Count",
                    dataField: "Delay",
                    dataType: "number",
                    summaryType: "count",
                    //summaryType: "avgRPK",

                    area: "data",


                },

                //{
                //    caption: "Uplift(k)",
                //    dataField: "UpliftKilo",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    area: "data"
                //},
                //{ 
                //    caption: "Pax",
                //    dataField: "TotalPax",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    area: "data"
                //},
                //{
                //    caption: "Cycle",
                //    dataField: "ID",
                //    dataType: "number",
                //    summaryType: "count",
                //    //format: "currency",
                //    area: "data"
                //},
                //{
                //    caption: "B/L",
                //    dataField: "BlockTime",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //summaryType: "avgRPK",

                //    area: "data",
                //    customizeText: function (e) {
                //        if (!e.value)
                //            return '';
                //        else
                //            return $scope.formatMinutes(e.value);
                //    },

                //},
                //{
                //    caption: "Distance",
                //    dataField: "Distance",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    area: "data",
                //    visible: true,
                //},
                //{
                //    caption: "DC",
                //    dataField: "UsedPerPaxKiloDistanceKM",
                //    dataType: "number",
                //    summaryType: "avg",
                //    //summaryType: "avgRPK",

                //    area: "data",
                //    customizeText: function (e) {
                //        if (!e.value)
                //            return '';
                //        else
                //            return $scope.formatMinutes(e.value);
                //    },
                //    calculateSummaryValue: function (e) {
                //        ////console.log(e.children('row'));
                //        if (!e.value('PaxKiloDistanceKM'))
                //            return null;
                //        return e.value('UsedKilo') * 1000 / e.value('PaxKiloDistanceKM');
                //    },

                //},
                //{
                //    caption: "FBL",
                //    dataField: "UsedPerBlockTime",
                //    dataType: "number",
                //    summaryType: "avg",
                //    //summaryType: "avgRPK",

                //    area: "data",
                //    customizeText: function (e) {
                //        if (!e.value)
                //            return '';
                //        else
                //            return e.value.toFixed(2);
                //    },
                //    calculateSummaryValue: function (e) {
                //        ////console.log(e.children('row'));
                //        if (!e.value('BlockTime'))
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //        return (e.value('UsedKilo') * 1000) / e.value('BlockTime');


                //    },

                //},
                //{
                //    caption: "FRP",
                //    dataField: "UsedPerPax",
                //    dataType: "number",
                //    summaryType: "avg",
                //    //summaryType: "avgRPK",

                //    area: "data",
                //    customizeText: function (e) {
                //        if (!e.value)
                //            return '';
                //        else
                //            return e.value.toFixed(2);
                //    },
                //    calculateSummaryValue: function (e) {
                //        ////console.log(e.children('row'));
                //        if (!e.value('TotalPax'))
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //        return (e.value('UsedKilo') * 1000) / e.value('TotalPax');


                //    },

                //},


                //{
                //    caption: "PaxDistance",
                //    dataField: "PaxKiloDistanceKM",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "WeightBlockTime",
                //    dataField: "WeightBlockTime",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "WeightDistanceToneKM",
                //    dataField: "WeightDistanceToneKM",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "PaxBlockTime",
                //    dataField: "PaxBlockTime",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "SeatKiloDistanceKM",
                //    dataField: "SeatKiloDistanceKM",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "Used",
                //    dataField: "Used",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},
                //{
                //    caption: "FPFuelKilo",
                //    dataField: "FPFuelKilo",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    //area: "data",
                //    visible: false,
                //},


            ],


        },
        onInitialized: function (e) {
            //e.component.bindChart($scope.fuelPivotChart, {
            //    dataFieldsDisplayMode: "splitPanes",
            //    alternateDataFields: false
            //});
            // expand(e.component.getDataSource());
        },
        onCellClick: function (e) {
            if (e.area == "data") {
                var pivotGridDataSource = e.component.getDataSource(),
                    rowPathLength = e.cell.rowPath.length,
                    rowPathName = e.cell.rowPath[rowPathLength - 1],
                    popupTitle = (rowPathName ? rowPathName : "Total") + " Drill Down Data";

                $scope.drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
                $scope.salesPopupTitle = popupTitle;
                $scope.salesPopupVisible = true;
            }
        },
        //rowHeaderLayout: "rowHeaderLayout",
        bindingOptions: {
            visible: 'IsStatsPivotVisible',
            //  'dataSource.store': 'totalTypes.items'
        }
    };

    $scope.IsStatsChartVisible = false;
    $scope.showPivotTable = function (t) {
        $('.show-pivot').removeClass('on-type');
        $('.show-pivot-table').addClass('on-type');
        $scope.IsStatsPivotVisible = true;
        $scope.IsStatsChartVisible = false;
    };
    $scope.showPivotCharts = function (t) {
        $('.show-pivot').removeClass('on-type');
        $('.show-pivot-chart').addClass('on-type');
        $scope.IsStatsChartVisible = true;
        $scope.IsStatsPivotVisible = false;
    };
    $scope.drillDownDataSource = {};
    $scope.salesPopupVisible = false;
    $scope.salesPopupTitle = "";
    $scope.drillDownDataGrid = {};
    $scope.ds_yearstr = ['1398', '1399', '1400'];
    $scope.dataGridOptions = {

        bindingOptions: {
            dataSource: {
                dataPath: 'drillDownDataSource',
                deep: false
            }
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        "export": {
            enabled: true,
            fileName: "StatisticsReport",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Details</span>"
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
        onInitialized: function (e) {
            $scope.drillDownDataGrid = e.component;
        },

        height: $(window).height() - 120,
        //columns: ['PYear', 'PMonth','PDate', 'AircraftType','Register', 'UsedKilo']
        columns: [
            {
                caption: 'Date',
                fixed: true, fixedPosition: 'left',
                columns: [
                    {
                        dataField: 'PYear', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, sortIndex: 0, sortOrder: 'asc',
                        lookup: {
                            dataSource: $scope.ds_yearstr,

                        }
                    },
                    { dataField: 'PMonth', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 1, sortOrder: 'asc', visible: false },

                    {
                        dataField: 'PMonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left',
                        lookup: {
                            dataSource: $scope.monthNames2,

                        }
                    },
                    { dataField: 'PDay', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 2, sortOrder: 'asc', visible: true },

                    {
                        dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left',

                    },
                ]
            },
            {
                caption: 'Aircraft',
                fixed: true, fixedPosition: 'left',
                columns: [
                    { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                    { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },

                ]
            },
            {
                caption: 'Flight',
                columns: [
                    {
                        dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,

                    },
                    {
                        dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,

                    },
                    //{
                    //    dataField: 'TakeoffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm'

                    //},
                    //{
                    //    dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm'

                    //},
                    //{ dataField: 'TotalPax', caption: 'Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                    //{ dataField: 'DistanceKM', caption: 'Distance', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

                ]
            },
            {
                caption: 'Delay',
                columns: [
                    { dataField: 'Delay', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                    { dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  },
                   // { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'RPK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                ]
            },
            //{
            //    caption: 'KPI',
            //    columns: [

            //        { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'RPK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerSeatKiloDistanceKM', caption: 'ASK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerPax', caption: 'FRP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerBlockTime', caption: 'FBL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerFPFuel', caption: 'FP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },






            //        { dataField: 'UsedPerPaxBlockTime', caption: 'RPB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerWeightToneBlockTime', caption: 'FTB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerWeightToneDistance', caption: 'FTK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
            //        { dataField: 'UsedPerUpLift', caption: 'FU', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },

            //    ]
            //}

        ],
        summary: {
            totalItems: [
                 
                {
                    column: "Delay",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return (data.value ) ;
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
                    column: "Legs",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "WeightTone",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Distance",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

                {
                    name: "UsedPerPaxKiloDistanceKM",
                    showInColumn: "UsedPerPaxKiloDistanceKM",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "UsedPerSeatKiloDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
                {
                    column: "UsedPerWeightToneDistance",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "UsedPerPaxKiloDistanceKM") {
                    if (options.summaryProcess === "start") {
                        options.totalValuePaxDistance = 0;
                        options.totalValueUsed = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        //options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        // options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                        options.totalValuePaxDistance += options.value.PaxDistanceKM ? (options.value.PaxDistanceKM / 1000.0) : 0;
                        options.totalValueUsed += options.value.Used ? options.value.Used : 0;


                    }
                    if (options.summaryProcess === "finalize") {
                        if (options.totalValuePaxDistance == 0)
                            options.totalValue = 0;
                        else {
                            options.totalValue = (options.totalValueUsed / options.totalValuePaxDistance).toFixed(2);
                        }

                    }
                }
            }
        }
    };

    $scope.popupOptions = {
        width: 700,
        height: 700,
        fullScreen: true,
        onShown: function () {
            $scope.drillDownDataGrid.updateDimensions();
        },
        bindingOptions: {
            title: "salesPopupTitle",
            visible: "salesPopupVisible"
        }
    };


    $scope.$on('ngRepeatFinishedRoutes', function (ngRepeatFinishedEvent) {
        $.each($scope.routeCharts, function (_i, _d) {
            _d.destroy();
        });
        $scope.initRoutesCard();
    });
    $scope.$on('ngRepeatFinishedRegisters', function (ngRepeatFinishedEvent) {
        $.each($scope.registerCharts, function (_i, _d) {
            _d.destroy();
        });
        $scope.initRegistersCard(1);
    });

    $scope.routeSearchParts = [];
    $scope.routeSearchStr = null;
    $scope.text_search_route = {
        placeholder: 'Search',
        valueChangeEvent: 'keyup',
        width: '100%',
        onValueChanged: function (e) {
            //$scope.fillFilteredCrew();
            if (!e.value) {
                $scope.routeSearchParts = [];
                return;
            }
            var str = e.value.toUpperCase();

            $scope.routeSearchParts = str.split(',');
            //$.each(prts, function (_i, _s) {

            //});
        },
        bindingOptions: {
            value: 'routeSearchStr'
        }
    }
    $scope.typeCharts = [];
    $scope.typePolarCharts = [];
    $scope.typeRegsCharts = [];
    $scope.typeRegsPolarCharts = [];
    $scope.routeCharts = [];
    $scope.registerCharts = [];
    $scope.airportCharts = [];
    $scope.initRoutesCard = function (reg) {
        //dlu

        var bcolor = '#ac3973';
        if (reg)
            bcolor = '#ff9933';
        var $elem = $('.chart-route');
        $.each($elem, function (_i, _d) {
            var kpi = ($(_d).data('kpi'));
            var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var grp = Enumerable.From($scope.groupedRoutes).Where('$.Route=="' + typeId + '"').FirstOrDefault();
            var data = Enumerable.From(grp.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
            var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

            var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
            var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'F/' + kpi,
                        ds: data,
                        borderColor: bcolor,
                        borderWidth: 2,
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: kpi_ds, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
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
                                min: minKPI,
                                max: maxKPI
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: customRadius,
                            backgroundColor: customBgColor,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);
            if (!reg)
                $scope.routeCharts.push(chart);
            else
                $scope.routeCharts.push(chart);

        });
    };
    $scope.initTypesCard = function (reg) {
        try {
            //sogi
            var bcolor = '#00cc99';
            if (reg)
                bcolor = '#ff9933';
            var $elem = $('.chart-type');
            $.each($elem, function (_i, _d) {
                var kpi = ($(_d).data('kpi'));
                var field = ($(_d).data('field'));
                var typeId = ($(_d).data('type'));
                var grp = Enumerable.From($scope.groupedCategories).Where('$.ICategory=="' + typeId + '"').FirstOrDefault();

                //console.log($scope.groupedCategories);
                //4-12
                var data = Enumerable.From(grp.items)//.Where('$.Year==' + $scope.year)
                    .Where(function (x) {
                        return x.Year >= $scope.year - 1 && x.Year <= $scope.year
                    })
                    .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();

                var lbls = Enumerable.From(data)//.OrderBy('$.Year==' + $scope.year).ThenBy('Number($.Month)').Select('$.MonthName').ToArray();
                    .OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();
                var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

                var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
                var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
                var config = {
                    type: 'line',
                    data: {
                        //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [{
                            label: kpi,
                            ds: data,
                            borderColor: bcolor,
                            borderWidth: 2,
                            //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                            data: kpi_ds, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
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
                                    min: minKPI,
                                    max: maxKPI
                                }
                            }]
                        },
                        elements: {
                            line: {
                                borderWidth: 1
                            },
                            point: {
                                radius: customRadius,
                                backgroundColor: customBgColor,
                                hitRadius: 10,
                                hoverRadius: 4
                            }
                        },

                    }
                };
                var chart = new Chart($(_d), config);
                if (!reg)
                    $scope.typeCharts.push(chart);
                else
                    $scope.registerCharts.push(chart);

            });
        }
        catch (e) { alert(e);}
    };
    $scope.initTypesRegCard = function (reg) {
        //sogi
        var bcolor = '#e6b800';

        var $elem = $('.chart-reg');
        $.each($elem, function (_i, _d) {
            var kpi = ($(_d).data('kpi'));
            var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var grp = Enumerable.From($scope.groupedTechnicalRegisters).Where('$.RegisterID==' + typeId).FirstOrDefault();


            //var data = Enumerable.From(grp.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
            var data = Enumerable.From(grp.items)//.Where('$.Year==' + $scope.year)
                .Where(function (x) {
                    return x.Year >= $scope.year - 1 && x.Year <= $scope.year
                })
                .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            var lbls = Enumerable.From(data).OrderBy('Number($.Year)').ThenBy('Number($.Month)').Select('$.Year+" "+$.MonthName').ToArray();

            var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

            var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
            var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: kpi,
                        ds: data,
                        borderColor: bcolor,
                        borderWidth: 2,
                        backgroundColor: '#fff5cc',
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: kpi_ds, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
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
                                min: minKPI,
                                max: maxKPI
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: customRadius,
                            backgroundColor: '#fff5cc',
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);
            if (!reg)
                $scope.typeRegsCharts.push(chart);


        });
    };
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    $scope.initTypePolarsCard = function () {
        var bcolor = '#00cc99';
        var chartColors = window.chartColors;
        var color = Chart.helpers.color;
        var $elem = $('.chart-type-polar');
        $.each($elem, function (_i, _d) {
            // var kpi = ($(_d).data('kpi'));
            // var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var grp = Enumerable.From($scope.groupedCategories).Where('$.ICategory=="' + typeId + '"').FirstOrDefault();
            var data = Enumerable.From(grp.items).Where('$.Year==' + $scope.year + ' && $.Month==' + $scope.month).FirstOrDefault();

            //var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
            var lbls = ['-30 min', '30-60 min', '60-120 min', '120-180 min', '180+ min'];
            var kpi_ds = [];
            kpi_ds.push(data.DelayUnder30Time);
            kpi_ds.push(data.Delay3060Time);
            kpi_ds.push(data.Delay60120Time);
            kpi_ds.push(data.Delay120180Time);
            kpi_ds.push(data.DelayOver180Time);
            //var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

            //var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
            //var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
            var config = {

                data: {

                    labels: lbls,
                    datasets: [{
                        label: '',

                        borderWidth: 2,
                        backgroundColor: [
                            color(chartColors.red).alpha(0.5).rgbString(),
                            color(chartColors.orange).alpha(0.5).rgbString(),
                            color(chartColors.yellow).alpha(0.5).rgbString(),
                            color(chartColors.green).alpha(0.5).rgbString(),
                            color(chartColors.blue).alpha(0.5).rgbString(),
                            color(chartColors.purple).alpha(0.5).rgbString(),
                        ],
                        data: kpi_ds,
                        //data:[70,25,36,56,123,50],
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false,
                        //text: 'Chart.js Polar Area Chart'
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        },
                        reverse: false
                    },
                    animation: {
                        animateRotate: false,
                        animateScale: true
                    }
                }
            };
            var chart = Chart.PolarArea($(_d), config);

            $scope.typePolarCharts.push(chart);
        });

    };
    $scope.$on('ngRepeatFinishedCats', function (ngRepeatFinishedEvent) {
        $.each($scope.typeCharts, function (_i, _d) {
            _d.destroy();
        });
        $.each($scope.typePolarCharts, function (_i, _d) {
            _d.destroy();
        });
        $scope.initTypesCard();
        $scope.initTypePolarsCard();
    });

    $scope.$on('ngRepeatFinishedAirports', function (ngRepeatFinishedEvent) {
        $.each($scope.airportCharts, function (_i, _d) {
            _d.destroy();
        });

        $scope.initAirportsCard();

    });

    $scope.$on('ngRepeatFinishedCatsRegs', function (ngRepeatFinishedEvent) {
        $.each($scope.typeRegsCharts, function (_i, _d) {
            _d.destroy();
        });
        $.each($scope.typeRegsPolarCharts, function (_i, _d) {
            _d.destroy();
        });
        $scope.initTypesRegCard();
        //$scope.initTypePolarsCard();
    });
    $scope.initRegistersCard = function (reg) {
        //dlu
        var bcolor = '#00cc99';
        if (reg)
            bcolor = '#ff9933';
        var $elem = $('.chart-reg');
        $.each($elem, function (_i, _d) {
            var kpi = ($(_d).data('kpi'));
            var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var rem = ($(_d).data('rem'));
            // //console.log(rem + '    ' + regs.indexOf(rem));
            bcolor = regColors[regs.indexOf(rem)];
            var grp = Enumerable.From($scope.groupedRegisters).Where('$.RegisterID==' + typeId).FirstOrDefault();
            var data = Enumerable.From(grp.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            // //console.log(typeId);
            // //console.log(data);
            var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.Month)').Select('$.MonthName').ToArray();
            var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

            var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
            var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: kpi,
                        ds: data,
                        borderColor: bcolor,
                        borderWidth: 2,
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: kpi_ds, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
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
                                min: minKPI,
                                max: maxKPI
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: customRadius,
                            backgroundColor: customBgColor,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);
            if (!reg)
                $scope.typeCharts.push(chart);
            else
                $scope.registerCharts.push(chart);

        });
    };
    $scope.initAirportsCard = function (reg) {
        //dlu

        var bcolor = '#00cc99';
        if (reg)
            bcolor = '#ff9933';
        var $elem = $('.chart-apt');
        $.each($elem, function (_i, _d) {
            var kpi = ($(_d).data('kpi'));
            var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var rem = ($(_d).data('rem'));
            // //console.log(rem + '    ' + regs.indexOf(rem));
            bcolor = regColors[regs.indexOf(rem)];
            var grp = Enumerable.From($scope.groupedAirports).Where('$.AirportId==' + typeId).FirstOrDefault();
            var data = Enumerable.From(grp.items)//.Where('$.Year==' + $scope.year)
                .Where(function (x) {
                    return x.Year >= $scope.year - 1 && x.Year <= $scope.year
                })
                .OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            var lbls = Enumerable.From(data).OrderBy('$.Year').ThenBy('Number($.Month)').Select('$.MonthName+" "+$.Year').ToArray();

            var kpi_ds = Enumerable.From(data).Select('$.' + field).ToArray();

            var minKPI = (data && data.length > 0) ? Enumerable.From(data).Min('$.' + field) : null;
            var maxKPI = (data && data.length > 0) ? Enumerable.From(data).Max('$.' + field) : null;
            var config = {
                type: 'line',
                data: {
                    //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: kpi,
                        ds: data,
                        borderColor: bcolor,
                        borderWidth: 2,
                        backgroundColor: '#ffe6e6',
                        //data: [], //[random(), random(), random(), random(), random(), random(), random()]
                        data: kpi_ds, //[Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
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
                                min: minKPI,
                                max: maxKPI
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 1
                        },
                        point: {
                            radius: customRadius,
                            backgroundColor: customBgColor,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            };
            var chart = new Chart($(_d), config);
            if (!reg)
                $scope.airportCharts.push(chart);
            else
                $scope.registerCharts.push(chart);

        });
    };

    $scope.summaryCharts = [];
    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
    };
    $scope.initTypeSummaryCharts = function () {
        return;

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                    ],
                    backgroundColor: [
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'blue',
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue'
                ]
            },
            options: {
                responsive: true
            }
        };
        new Chart($('#type-sum-used'), config);
    };

    $scope.pie_ontime_delayed = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_ontime_delayed_instance)
                $scope.pie_ontime_delayed_instance = e.component;
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        palette: ['#00cc99', '#ff6666'],
        // diameter: 0.85,
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Past',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "past",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            },
            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "current",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            }

        ],
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'pieOnTimeDs',

        }
    };

    $scope.pie_delays_count = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_delays_count_instance)
                $scope.pie_delays_count_instance = e.component;
        },
        palette: "Soft Pastel",
        sizeGroup: 'sg1',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
        //diameter: 0.85,
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value.toFixed(0) };
            }
        },
        "export": {
            enabled: false
        },
        //resolveLabelOverlapping: 'shift',
        series: [

            {
                name: 'Past',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "past",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            },
            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "current",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            }

        ],
        size: {
            height: 350,
        },

        bindingOptions: {
            dataSource: 'pieDlCountsDs',

        }
    };

    $scope.polar_delays_time = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        series: [
            { valueField: "current", name: "Current", color: "#ba4d51" },
            { valueField: "past", name: "Past", color: "#bfbfbf" },
        ],
        commonSeriesSettings: {
            type: "bar"
        },
        size: {
            height: 380,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        bindingOptions: {
            dataSource: 'polarDelaysTime',

        }
    };

    $scope.polar_delaystechnical_time = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        series: [
            { valueField: "current", name: "Current", color: "#ba4d51" },
            { valueField: "past", name: "Past", color: "#bfbfbf" },
        ],
        commonSeriesSettings: {
            type: "bar"
        },
        size: {
            height: 380,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        bindingOptions: {
            dataSource: 'polarDelaysTechnicalTime',

        }
    };


    $scope.polar_delaystechnical = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + (this.value.toFixed(0)) };
            }
        },

        series: [
            { valueField: "current", name: "Current", color: "#ff9933" },
            { valueField: "past", name: "Past", color: "#bfbfbf" },
        ],
        commonSeriesSettings: {
            type: "bar"
        },
        size: {
            height: 380,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        bindingOptions: {
            dataSource: 'polarDelaysTechnical',

        }
    };

    $scope.pie_flights_count = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_flights_count_instance)
                $scope.pie_flights_count_instance = e.component;
        },
        palette: "Soft Pastel",
        sizeGroup: 'sg1',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
        //diameter: 0.85,
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value.toFixed(0) };
            }
        },
        "export": {
            enabled: false
        },
        // resolveLabelOverlapping: 'shift',
        series: [

            {
                name: 'Past',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "past",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'black',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            },
            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "type",
                valueField: "current",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            }

        ],
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'pieDlFLTCountsDs',

        }
    };



    $scope.pie_cats = {
        rtlEnabled: false,
        onInitialized: function (e) {
            //if (!$scope.pie_flights_count_instance)
            //    $scope.pie_flights_count_instance = e.component;
        },
        palette: "Soft",
        // sizeGroup: 'sg2',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
        //diameter: 0.85,
        legend: {
            //verticalAlignment: 'bottom',
            //horizontalAlignment: 'center',
            verticalAlignment: 'top',
            horizontalAlignment: 'right',
            itemTextPosition: 'right',

        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value.toFixed(0) };
            }
        },
        "export": {
            enabled: false
        },
        //resolveLabelOverlapping: 'hide',
        series: [

            {
                name: 'Past',
                smallValuesGrouping: {
                    mode: "smallValueThreshold",
                    threshold: 1
                },
                ignoreEmptyPoints: true,
                argumentField: "title",
                valueField: "past_delay",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            },
            {
                name: 'Current',
                smallValuesGrouping: {
                    mode: "smallValueThreshold",
                    threshold: 30
                },
                ignoreEmptyPoints: true,
                argumentField: "title",
                valueField: "current_delay",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    },

                }
            }

        ],
        size: {
            height: 400,
        },
        bindingOptions: {
            dataSource: 'pieCatDLDs',

        }
    };

    $scope.pie_cats_count = {
        rtlEnabled: false,
        onInitialized: function (e) {
            //if (!$scope.pie_flights_count_instance)
            //    $scope.pie_flights_count_instance = e.component;
        },
        palette: "Green Mist",
        sizeGroup: 'sg2',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
        //diameter: 0.85,
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            // rowCount: 2,
            //  columnCount: 8
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value.toFixed(0) };
            }
        },
        "export": {
            enabled: false
        },
        //resolveLabelOverlapping: 'hide',
        series: [

            {
                name: 'Past',

                ignoreEmptyPoints: true,
                argumentField: "title",
                valueField: "past_count",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    }
                }
            },
            {
                name: 'Current',

                ignoreEmptyPoints: true,
                argumentField: "title",
                valueField: "current_count",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText != '0%' ? arg.percentText : '';
                    },

                }
            }

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'pieCatDLDs',

        }
    };

    ////////////////////////////////
    $scope.chart_catdurationstack_instance = null;
    $scope.chart_catdurationstack = {
        legend: {
            // horizontalAlignment: "right",
            // position: "inside",
            //  border: { visible: true },
            //  columnCount: 2,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
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
        onInitialized: function (e) {
            if (!$scope.catdurationstack_instance)
                $scope.catdurationstack = e.component;
        },
        palette: "Soft",

        commonSeriesSettings: {
            type: "stackedBar",

            argumentField: "title",
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
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value) + " (" + (arg.value * 100.0 / arg.total).toFixed(2) + "%)" + " ,Total: " + $scope.formatMinutes(arg.total)
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
            "dataSource": "categoriesByDuration",
            // 'argumentAxis.categories': 'monthNames2',
            series: 'catDurationStackSeries',

        }
    };




    $scope.chart_techreg_instance = null;
    $scope.chart_techreg = {
        legend: {
            // horizontalAlignment: "right",
            // position: "inside",
            //  border: { visible: true },
            //  columnCount: 2,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
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
        onInitialized: function (e) {
            if (!$scope.catdurationstack_instance)
                $scope.catdurationstack = e.component;
        },
        palette: "Vintage",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "Register",
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
                    return $scope.formatMinutes(this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'DelayCurrent', name: 'Current', },
            { valueField: 'DelayPast', name: 'Past', },
        ],


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
            height: 350,
        },
        bindingOptions: {
            "dataSource": "registerDelayDs",



        }
    };



    $scope.chart_aptdelay_instance = null;
    $scope.chart_aptdelay = {
        legend: {
            // horizontalAlignment: "right",
            // position: "inside",
            //  border: { visible: true },
            //  columnCount: 2,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
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
        onInitialized: function (e) {
            if (!$scope.chart_aptdelay_instance)
                $scope.chart_aptdelay_instance = e.component;
        },
        palette: "Violet",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "Airport",
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
                    return $scope.formatMinutes(this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'DelayCurrent', name: 'Current', },
            { valueField: 'DelayPast', name: 'Past', },
        ],


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
            height: 350,
        },
        bindingOptions: {
            "dataSource": "airportDelayDs",



        }
    };



    $scope.chart_aptdelaycycle_instance = null;
    $scope.chart_aptdelaycycle = {
        legend: {
            // horizontalAlignment: "right",
            // position: "inside",
            //  border: { visible: true },
            //  columnCount: 2,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
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
        onInitialized: function (e) {
            if (!$scope.chart_aptdelaycycle_instance)
                $scope.chart_aptdelaycycle_instance = e.component;
        },
        palette: "Violet",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "Airport",
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
        series: [
            { valueField: 'DLCurrent', name: 'Current', },
            { valueField: 'DLPast', name: 'Past', },
        ],


        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + (arg.value)
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
            height: 350,
        },
        bindingOptions: {
            "dataSource": "airportDelayCycleDs",



        }
    };


    $scope.chart_aptdelaycycledet_instance = null;
    $scope.chart_aptdelaycycledet = {
        legend: {
            // horizontalAlignment: "right",
            // position: "inside",
            //  border: { visible: true },
            //  columnCount: 2,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
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
        onInitialized: function (e) {
            if (!$scope.chart_aptdelaycycle_instance)
                $scope.chart_aptdelaycycle_instance = e.component;
        },
        palette: ['#cc6699', '#ff9999', '#cc6699', '#ff9999'],

        commonSeriesSettings: {
            type: "bar",

            argumentField: "Airport",
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
        panes: [{
            name: "delayPane"
        }, {
            name: "cyclePane"
        }],
        series: [
            { valueField: 'DelayCurrent', name: 'Current', pane: "delayPane", },
            { valueField: 'DelayPast', name: 'Past', pane: "delayPane", },

            { valueField: 'CycleCurrent', name: 'Current-Cycle', pane: "cyclePane", showInLegend: false },
            { valueField: 'CyclePast', name: 'Past-Cycle', pane: "cyclePane", showInLegend: false },
        ],


        tooltip: {
            enabled: true,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName.includes('Cycle') ? arg.seriesName + ": " + (arg.value) : arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [
            {
                pane: "delayPane",
                title: {
                    text: "Delay"
                },
                label: {
                    customizeText: function () {
                        return $scope.formatMinutes(this.value);
                    }
                },
            },
            {
                pane: "cyclePane",
                title: {
                    text: "Cycle"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            }

        ],
        size: {
            height: 350,
        },
        bindingOptions: {
            "dataSource": "airportDelayCycleDs",



        }
    };


    ///////////////////////////////
    //magu3
    $scope.showKPI = function (kpi) {
        var data = { total: $scope.total, current: $scope.current, past: $scope.past, year: $scope.year, month: $scope.month };
        switch (kpi) {
            case 'DL':
                data.field = 'Delay';
                data.indexName = 'DL';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DC':
                data.field = 'DelayPerLeg';
                data.indexName = 'DC';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'OTF':
                data.field = 'OnTimeFlightCount';
                data.indexName = 'OTF';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'OTFC':
                data.field = 'OnTimeFlightsPerAll';
                data.indexName = 'OTFC';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DOTF':
                data.field = 'DelayedFlightsPerOnTime';
                data.indexName = 'DOTF';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC':
                data.field = 'DelayedFlightsPerAll';
                data.indexName = 'DFC';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC-30':
                data.field = 'FltDelayUnder30PerAll';
                data.indexName = 'DFC-30';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC+30':
                data.field = 'FltDelayOver30PerAll';
                data.indexName = 'DFC+30';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC3060':
                data.field = 'FltDelay3060PerAll';
                data.indexName = 'DFC3060';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC60120':
                data.field = 'FltDelay60120PerAll';
                data.indexName = 'DFC60120';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC120180':
                data.field = 'FltDelay120180PerAll';
                data.indexName = 'DFC120180';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'DFC+180':
                data.field = 'FltDelayOver180PerAll';
                data.indexName = 'DFC+180';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD30':
                data.field = 'FltDelayOver30';
                data.indexName = 'FD30';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD180':
                data.field = 'FltDelayOver180';
                data.indexName = 'FD180';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD-30':
                data.field = 'FltDelayUnder30';
                data.indexName = 'FD-30';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD3060':
                data.field = 'FltDelay3060';
                data.indexName = 'FD30-60';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD60120':
                data.field = 'FltDelay60120';
                data.indexName = 'FD60-120';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD120180':
                data.field = 'FltDelay120180';
                data.indexName = 'FD120-180';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FD240':
                data.field = 'FltDelayOver240';
                data.indexName = 'FD240';
                $rootScope.$broadcast('InitkpiDelay', data)
                break;
            case 'FRP':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FRP';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'FC':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FC';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'FU':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FU';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'FP':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FP';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            default: break;
        }
    };
    $scope.showKPIAirport = function (apt) {
        var totalAirports = {};
        totalAirports.items = $scope.total.items;
        totalAirports.airports = $scope.airports;
        var data = {
            total: totalAirports, grouped: $scope.groupedAirports2, year: $scope.year, month: $scope.month, current: $scope.currentAirport,
            past: $scope.pastAirport,
            type: apt,
            polarTimeDs: $scope.polarTimeAirportDs,
            catNames: $scope.catNames,
        };

        data.field = '';
        data.indexName = '';
        $rootScope.$broadcast('InitkpiAirport', data)
        return;
        switch (kpi) {
            case 'RPK':

                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPK';
                $rootScope.$broadcast('InitkpiAirport', data)
                break;
            //case 'RPB':

            //    $rootScope.$broadcast('InitkpiRPB', data)
            //    break;
            //case 'FTK':
            //    data.field = 'UsedPerPaxKiloDistanceKM';
            //    data.indexName = 'FTK';
            //    $rootScope.$broadcast('InitkpiRPKAC', data)
            //    break;
            //case 'FTB':
            //    data.field = 'UsedPerWeightDistanceKM';
            //    data.indexName = 'FTB';
            //    $rootScope.$broadcast('InitkpiRPKAC', data)
            //    break;
            //case 'FBL':
            //    data.field = 'UsedPerWeightDistanceKM';
            //    data.indexName = 'FBL';
            //    $rootScope.$broadcast('InitkpiRPKAC', data)
            //    break;
            //case 'FC':
            //    data.field = 'UsedPerWeightDistanceKM';
            //    data.indexName = 'FC';
            //    $rootScope.$broadcast('InitkpiRPKAC', data)
            //    break;
            default: break;

        }
    };
    //magu2-21
    $scope.showKPITechCat = function (kpi) {
        var typ = { ICategory: 'TECHNICAL' }; //Enumerable.From($scope.groupedCategories).Where('$.ICategory="TECHNICAL"').FirstOrDefault();
        $scope.showKPICat(kpi, typ);
    };
    $scope.showKPICat = function (kpi, typ) {
        //console.log(typ);
        var totalCategories = {};
        totalCategories.items = $scope.total.items;
        totalCategories.categories = $scope.categories;
        var data = {
            total: totalCategories, grouped: $scope.groupedCategories, year: $scope.year, month: $scope.month, current: $scope.currentCategories,
            past: $scope.pastCategories, type: typ,
            polarTimeDs: $scope.polarTimeDs
        };

        switch (kpi) {
            case 'DL':
                // field:'UsedPerPaxKiloDistanceKM',indexName:'RPK'
                data.field = 'Delay';
                data.indexName = 'DL';
                $rootScope.$broadcast('InitkpiCat', data)
                break;
            case 'RPB':

                $rootScope.$broadcast('InitkpiRPB', data)
                break;
            case 'FTK':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FTK';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FTB':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FTB';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FBL':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FBL';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FC':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FC';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            default: break;

        }
    };
    $scope.showKPITech = function (kpi, typ) {
        var totalCategories = {};
        totalCategories.items = $scope.total.items;
        totalCategories.categories = $scope.categories;
        totalCategories.technicals = $scope.technicals;
        totalCategories.technicalRegisters = $scope.technicalRegisters;

        var data = {
            total: totalCategories,
            //grouped: $scope.groupedCategories,
            grouped: $scope.groupedTechnicalRegisters,
            year: $scope.year, month: $scope.month, current: $scope.currentTechnical,
            past: $scope.pastTechnical, type: typ,
            polarTimeDs: $scope.polarTimeTechnicalDs
        };

        switch (kpi) {
            case 'DL':
                // field:'UsedPerPaxKiloDistanceKM',indexName:'RPK'
                data.field = 'Delay';
                data.indexName = 'DL';
                $rootScope.$broadcast('InitkpiTech', data);

                break;
            case 'RPB':

                $rootScope.$broadcast('InitkpiRPB', data)
                break;
            case 'FTK':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FTK';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FTB':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FTB';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FBL':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FBL';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            case 'FC':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FC';
                $rootScope.$broadcast('InitkpiRPKAC', data)
                break;
            default: break;

        }
    };
    $scope.showKPIReg = function (kpi, typ) {
        var data = { total: $scope.totalRegisters, grouped: $scope.groupedRegisters, year: $scope.year, month: $scope.month, type: typ };
        switch (kpi) {
            case 'RPK':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPK';
                $rootScope.$broadcast('InitkpiRPKReg', data)
                break;
            case 'RPB':

                $rootScope.$broadcast('InitkpiRPB', data)
                break;
            case 'FTK':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FTK';
                $rootScope.$broadcast('InitkpiRPKReg', data)
                break;
            case 'FTB':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FTB';
                $rootScope.$broadcast('InitkpiRPKReg', data)
                break;
            case 'FBL':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FBL';
                $rootScope.$broadcast('InitkpiRPKReg', data)
                break;
            case 'FC':
                data.field = 'UsedPerWeightDistanceKM';
                data.indexName = 'FC';
                $rootScope.$broadcast('InitkpiRPKReg', data)
                break;
            default: break;
        }
    };
    ////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Delay';


        $('.delaykpi').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////
    $scope.pdate = null;
    $scope.dobind = false;
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
    $scope.ds_yearmonth = [];
    $scope.fillDsYearMonth = function () {
        $scope.ds_yearmonth = [];
        $scope.month = -1;

        switch ($scope.year) {
            case 1400:

                $scope.ds_yearmonth = Enumerable.From($scope.ds_month).Where('$.id<=6').OrderBy('$.id').ToArray();
                break;
            case 1399:
                $scope.ds_yearmonth = Enumerable.From($scope.ds_month).OrderBy('$.id').ToArray();
                break;
            case 1398:
                $scope.ds_yearmonth = Enumerable.From($scope.ds_month).Where('$.id>=9').OrderBy('$.id').ToArray();
                break;
            default:
                break;
        }

        if ($scope.ds_yearmonth.length > 0) {
            //$scope.month = $scope.ds_yearmonth[0].id;
            //$scope.month = $scope.ds_yearmonth[$scope.ds_yearmonth.length-1].id;
            $scope.month = 5;

        }
        //alert('x ' + $scope.month);
    };
    $scope.sb_year = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.ds_year,
        onSelectionChanged: function (e) {
            $scope.fillDsYearMonth();
            //if ($scope.dobind) {
            //   $scope.bindmain();
            //}
        },
        bindingOptions: {
            value: 'year',

        }
    };
    $scope.sb_month = {

        showClearButton: false,
        searchEnabled: false,
        //dataSource: $scope.ds_month,
        displayExpr: 'title',
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            //if (e.selectedItem)
            //   $scope.bindmain();
            //if ($scope.dobind) {
            //     $scope.bindmain();
            // }
        },
        bindingOptions: {
            value: 'month',
            dataSource: 'ds_yearmonth',

        }
    };
    $scope.btn_reload = {

        type: 'success',
        icon: 'refresh',
        width: '100%',

        onClick: function (e) {

            $scope.bindmain();

        }
    };
    $scope.$on('$viewContentLoaded', function () {
        // $scope.period = 1;
        $scope.pdate = new persianDate(new Date());
        $scope.month = $scope.pdate.month();
         

        $scope.nowYear = $scope.pdate.year();
        $scope.nowMonth = $scope.pdate.month();

        $scope.year = 1400;// $scope.pdate.year();
        //$scope.month = 1;
        setTimeout(function () {
            $scope.dobind = true;
            $scope.bindmain();
        }, 1000);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);