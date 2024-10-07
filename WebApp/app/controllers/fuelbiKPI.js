'use strict';
app.controller('fuelkpiController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'biService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, biService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams;


    $scope.month = null;
    $scope.year = null;
    //////////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Overall", id: 'overall' },
        { text: "Aircraft Types", id: 'aircraft' },
        { text: "Registers", id: 'register' },
        { text: "Route", id: 'route' },
        { text: 'Statistics', id: 'stats' }



    ];
    $scope.activeTab = "";
    $scope.isPivotVisible = false;
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
                        console.log($scope.fuelPivotChart);
                        //$scope.fuelPivotChart.refresh();
                        $scope.pivot_fuel_instance.repaint();
                        $scope.pivot_fuel_instance.getDataSource().expandHeaderItem("row", [1399]);
                        $scope.pivot_fuel_instance.bindChart($scope.fuelPivotChart, {
                            dataFieldsDisplayMode: "splitPanes",
                            alternateDataFields: false,
                            inverted: true,
                            customizeSeries: function (seriesName, seriesOptions) {
                                // Change series options here
                              //  seriesOptions.visible = false;
                               // console.log(seriesOptions);
                                return seriesOptions; // This line is optional
                            },
                            customizeChart: function (chartOptions) {
                                var panes = Enumerable.From(chartOptions.panes).Where(function (x) {
                                    return ['Used(k)','Uplift(k)'].indexOf(x.name) != -1;
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
                                    return ['RPK','FBL','FRP'].indexOf(x.name) != -1;
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
        var item = Enumerable.From(ds).Where('$.Month==' + $scope.month).FirstOrDefault();
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
        var item = Enumerable.From(ds).Where('$.Month==' + $scope.month).FirstOrDefault();
        if (!item)
            return '#ddd';
        var dindex = ds.indexOf(item);
        let index = context.dataIndex;
        //let value = context.dataset.data[index];
        //return index == $scope.month - 1 ? '#ff33cc' : '#ddd';
        return index == dindex ? '#ff33cc' : '#ddd';
    }
    ////////////////////////////////
    var rpkChart = null;
    $scope.initRPKChart = function () {
        if (rpkChart)
            rpkChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        //console.log(data);
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
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
        rpkChart = new Chart($('.chart-rpk'), config);



    };
    var rpbChart = null;
    $scope.initRPBChart = function () {
        if (rpbChart)
            rpbChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
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
        rpbChart = new Chart($('.chart-rpb'), config);



    };
    var fblChart = null;
    $scope.initFBLChart = function () {
        if (fblChart)
            fblChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerBlockTime').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerBlockTime');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerBlockTime');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'F/Block-Time',
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
        fblChart = new Chart($('.chart-fbl'), config);



    };
    var fpChart = null;
    $scope.initFPChart = function () {
        if (fpChart)
            fpChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerPax').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerPax');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerPax');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'F/Pax',
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
        fpChart = new Chart($('.chart-fpx'), config);



    };

    //fuel per cycle
    var fcChart = null;
    $scope.initFCChart = function () {
        if (fcChart)
            fcChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerLeg').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerLeg');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerLeg');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'F/Cycle',
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
        fcChart = new Chart($('.chart-fc'), config);



    };

    //fuel per weight kilometers
    var fwkChart = null;
    $scope.initFWKChart = function () {
        if (fwkChart)
            fwkChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerWeightDistanceKM').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerWeightDistanceKM');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerWeightDistanceKM');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'F/Tone-KM',
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
        fwkChart = new Chart($('.chart-wk'), config);



    };

    var fusedChart = null;
    $scope.initFUSEDChart = function () {
        if (fusedChart)
            fusedChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerUpLift').ToArray();
        var minRpk = Enumerable.From(data).Min('$.UsedPerUpLift');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerUpLift');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Used/Uplift',
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
        fusedChart = new Chart($('.chart-used'), config);



    };


    var fplChart = null;
    $scope.initFPLChart = function () {
        if (fplChart)
            fplChart.destroy();
        var data = Enumerable.From($scope.total.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.ArgNum)').ToArray();
        var lbls = Enumerable.From(data).Where('$.Year==' + $scope.year).OrderBy('Number($.ArgNum)').Select('$.ArgStr').ToArray();
        //var used = Enumerable.From(data).Select('$.UsedKilo').ToArray();
        var rpk = Enumerable.From(data).Select('$.UsedPerFPFuel').ToArray();

        //var data2 = Enumerable.From($scope.total.items).OrderBy('Number($.ArgNum)').ToArray();
        //$.each(data2, function (_i, _d) {
        //    console.log(_d.Year + '    ' + _d.Month + '   ' + $scope.year + '   ' + $scope.month);
        //    if (_d.Year != $scope.year || _d.Month != $scope.month) { _d.UsedPerFPFuel = null; }
        //});

        //  var rpk2 = Enumerable.From(data2).Select('$.UsedPerFPFuel').ToArray();

        // console.log(rpk2);
        var minRpk = Enumerable.From(data).Min('$.UsedPerFPFuel');
        var maxRpk = Enumerable.From(data).Max('$.UsedPerFPFuel');
        var config = {
            type: 'line',
            data: {
                //labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                labels: lbls,   //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Used/Planned',
                    //backgroundColor: '#d9d9d9',
                    borderColor: '#33adff',
                    ds: data,
                    data: rpk,
                }
                ]
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
                        //radius: 4,
                        radius: customRadius,
                        backgroundColor: customBgColor,
                        hitRadius: 10,
                        hoverRadius: 4,

                    }
                },

            }
        };
        fplChart = new Chart($('.chart-fp'), config);



    };

    ////////////////////////////////
    const regs = ['FPA', 'FPB', 'FPC',

         
        'CPU',
        
        'KPB',
        'CPD',
        'CPX',
        
        'CAR',
         
        'CAP',
        'CAS',
       
        'KPA',
        'CPV',
        'CAX',

    ];
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
    $scope.total = {};
    $scope.bindmain = function () {
        $scope.loadingVisible = true;
        biService.getFuelMonthly(/*$scope.year*/-1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.total = response;
            $scope.current = Enumerable.From($scope.total.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
            $scope.past = Enumerable.From($scope.total.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
            $.each($scope.total.items, function (_i, _d) {
                _d['UsedPerPaxKiloDistanceKM' + '_' + _d.Year] = _d.UsedPerPaxKiloDistanceKM;
                _d['UsedPerPaxKiloDistanceKMDiff' + '_' + _d.Year] = _d.UsedPerPaxKiloDistanceKMDiff;
                _d['UsedPerSeatKiloDistanceKM' + '_' + _d.Year] = _d.UsedPerSeatKiloDistanceKM;
                _d['UsedPerWeightDistanceToneKM_' + _d.Year] = _d['UsedPerWeightDistanceToneKM'];

                _d['UsedPerBlockTime' + '_' + _d.Year] = _d.UsedPerBlockTime;
                _d['UsedPerBlockTimeDiff' + '_' + _d.Year] = _d.UsedPerBlockTimeDiff;

                _d['UsedPerPax' + '_' + _d.Year] = _d.UsedPerPax;
                _d['UsedPerPaxDiff' + '_' + _d.Year] = _d.UsedPerPaxDiff;

                _d['UsedPerLeg' + '_' + _d.Year] = _d.UsedPerLeg;
                _d['UsedDiffPerLeg' + '_' + _d.Year] = _d.UsedDiffPerLeg;

                _d['UsedPerUpLift' + '_' + _d.Year] = _d.UsedPerUpLift;
                _d['UsedPerUpLiftDiff' + '_' + _d.Year] = _d.UsedPerUpLiftDiff;

                _d['UsedPerFPFuel' + '_' + _d.Year] = _d.UsedPerFPFuel;
                _d['UsedPerFPFuelDiff' + '_' + _d.Year] = _d.UsedPerFPFuelDiff;

                _d['UsedPerPaxBlockTime' + '_' + _d.Year] = _d.UsedPerPaxBlockTime;
                _d['UsedPerPaxBlockTimeDiff' + '_' + _d.Year] = _d.UsedPerPaxBlockTimeDiff;

                _d['TotalPax' + '_' + _d.Year] = _d.TotalPax;
                _d['UsedKilo' + '_' + _d.Year] = _d.UsedKilo;
                _d['UpliftKilo' + '_' + _d.Year] = _d.UpliftKilo;
                _d['FPFuelKilo' + '_' + _d.Year] = _d.FPFuelKilo;
                _d['WeightTone' + '_' + _d.Year] = _d.WeightTone;
                _d['Legs' + '_' + _d.Year] = _d.Legs;
                _d['DistanceKM' + '_' + _d.Year] = _d.DistanceKM;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.PreBlockTime2 = $scope.formatMinutes(_d.PreBlockTime);
                _d['BlockTime2' + '_' + _d.Year] = _d.BlockTime2;
                _d['BlockTime_' + _d.Year] = _d['BlockTime'];
                _d['PreBlockTime2' + '_' + _d.Year] = _d.PreBlockTime2;

                _d['TotalPaxDiff' + '_' + _d.Year] = _d.TotalPaxDiff;
                _d['UsedKiloDiff' + '_' + _d.Year] = _d.UsedKiloDiff;
                _d['DistanceDiff' + '_' + _d.Year] = _d.DistanceDiff;

            });

            $scope.initRPKChart();
            $scope.initRPBChart();
            $scope.initFBLChart();
            $scope.initFPChart();
            $scope.initFCChart();
            $scope.initFWKChart();
            $scope.initFUSEDChart();
            $scope.initFPLChart();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
                //  console.log($scope.totalRegisters.items);

                //console.log('$scope.groupedRegisters');
                //console.log($scope.groupedRegisters);
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
                //  console.log($scope.groupedTypes);


                $scope.currentTypes = Enumerable.From($scope.totalTypes.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
                $scope.pastTypes = Enumerable.From($scope.totalTypes.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
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
                //    //console.log('$scope.groupedRegisters');
                //    //console.log($scope.groupedRegisters);

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


            //  console.log($scope.groupedTypes);


            $scope.currentRoute = Enumerable.From($scope.totalRoutes.items).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault();
            $scope.pastRoutes = Enumerable.From($scope.totalRoutes.items).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault();
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
            //    //console.log('$scope.groupedRegisters');
            //    //console.log($scope.groupedRegisters);

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
                if (args.seriesName.indexOf('B/L')!=-1)
                    valueText = $scope.formatMinutes(valueText);
                 
                return {
                    html: args.seriesName
                        
                        + "<div class='currency'>" + args.argumentText + "</div>"
                        + "<div class='currency'>"+ valueText + "</div>"
                };
            }
        },
        size: {
            height: 500
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
            type: "spline"
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
        fieldPanel : {
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
                loadUrl: $rootScope.serviceUrl + "odata/pivot/fuel/total",
                onLoaded: function (result) {
                    console.log(result);
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
                    expanded:false,
                     
                },
                //{
                //    caption: "Season",
                //    width: 120,
                //    dataField: "Season",
                //    area: "row",
                //    showTotals: true,
                //    showGrandTotals: true,
                //    customizeText: function (e) {

                //        return _seasonNames[e.value - 1];
                //    },
                //},
                {
                    caption: "Month",
                    width: 120,
                    dataField: "PMonth",
                    area: "row",
                    showTotals: false,
                    showGrandTotals: false,
                    customizeText: function (e) {
                         
                        return _monthNames[e.value-1];
                    },
                },
                {
                    caption: "Route",
                    width: 120,
                    dataField: "Route",
                    area: "row",
                    showTotals: false,
                    showGrandTotals: false,
                    
                },
                //{
                //    dataField: "PYear",
                //    // dataType: "date",
                //    area: "column"
                //},
                {
                    dataField: "AircraftType",
                    // dataType: "date",
                    area: "column"
                },
                {
                    dataField: "Register",
                    // dataType: "date",
                    area: "column"
                },
               

                {
                    caption: "Used(k)",
                    dataField: "UsedKilo",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    area: "data"
                },
                
                 
                {
                    caption: "Uplift(k)",
                    dataField: "UpliftKilo",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    area: "data"
                },
                {
                    caption: "Pax",
                    dataField: "TotalPax",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    area: "data"
                },
                {
                    caption: "Cycle",
                    dataField: "ID",
                    dataType: "number",
                    summaryType: "count",
                    //format: "currency",
                    area: "data"
                },
                {
                    caption: "B/L",
                    dataField: "BlockTime",
                    dataType: "number",
                    summaryType: "sum",
                    //summaryType: "avgRPK",

                    area: "data",
                    customizeText: function (e) {
                        if (!e.value)
                            return '';
                        else
                            return $scope.formatMinutes( e.value);
                    },
                     
                },
                {
                    caption: "Distance",
                    dataField: "Distance",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    area: "data",
                    visible: true,
                },
                {
                    caption: "RPK",
                    dataField: "UsedPerPaxKiloDistanceKM",
                    dataType: "number",
                    summaryType: "avg",
                    //summaryType: "avgRPK",
                     
                    area: "data",
                    customizeText: function (e) {
                        if (!e.value)
                            return '';
                        else
                            return e.value.toFixed(2);
                    },
                    calculateSummaryValue: function (e) {
                        //console.log(e.children('row'));
                        if (!e.value('PaxKiloDistanceKM'))
                            return null;
                        return e.value('UsedKilo')*1000/ e.value('PaxKiloDistanceKM');
                    },

                },
                {
                    caption: "FBL",
                    dataField: "UsedPerBlockTime",
                    dataType: "number",
                    summaryType: "avg",
                    //summaryType: "avgRPK",

                    area: "data",
                    customizeText: function (e) {
                        if (!e.value)
                            return '';
                        else
                            return e.value.toFixed(2);
                    },
                    calculateSummaryValue: function (e) {
                        //console.log(e.children('row'));
                        if (!e.value('BlockTime'))
                            return null;
                        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                        return (e.value('UsedKilo') * 1000) / e.value('BlockTime');


                    },

                },
                {
                    caption: "FRP",
                    dataField: "UsedPerPax",
                    dataType: "number",
                    summaryType: "avg",
                    //summaryType: "avgRPK",

                    area: "data",
                    customizeText: function (e) {
                        if (!e.value)
                            return '';
                        else
                            return e.value.toFixed(2);
                    },
                    calculateSummaryValue: function (e) {
                        //console.log(e.children('row'));
                        if (!e.value('TotalPax'))
                            return null;
                        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                        return (e.value('UsedKilo') * 1000) / e.value('TotalPax');


                    },

                },
                //{
                //    caption: "ASK",
                //    dataField: "UsedPerSeatKiloDistanceKM",
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
                //        //console.log(e.children('row'));
                //        if (!e.value('SeatKiloDistanceKM') )
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //      return (e.value('UsedKilo') * 1000 )/ e.value('SeatKiloDistanceKM');
                         
                         
                //    },

                //},
                //{
                //    caption: "RPB",
                //    dataField: "UsedPerPaxBlockTime",
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
                //        //console.log(e.children('row'));
                //        if (!e.value('PaxBlockTime'))
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //        return (e.value('UsedKilo') * 1000) / e.value('PaxBlockTime');


                //    },

                //},
                //{
                //    caption: "FTB",
                //    dataField: "UsedPerWeightToneBlockTime",
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
                //        //console.log(e.children('row'));
                //        if (!e.value('WeightBlockTime'))
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //        return (e.value('UsedKilo') * 1000) / e.value('WeightBlockTime');


                //    },

                //},
                //{
                //    caption: "FTK",
                //    dataField: "UsedPerWeightToneDistance",
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
                //        //console.log(e.children('row'));
                //        if (!e.value('WeightDistanceToneKM'))
                //            return null;
                //        //return e.value('Used')/((e.value('TotalSeat') * e.value('Distance')) / 1000) ;
                //        return (e.value('UsedKilo') * 1000) / e.value('WeightDistanceToneKM');


                //    },

                //},
               
                {
                    caption: "PaxDistance",
                    dataField: "PaxKiloDistanceKM",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible:false,
                },
                {
                    caption: "WeightBlockTime",
                    dataField: "WeightBlockTime",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
                {
                    caption: "WeightDistanceToneKM",
                    dataField: "WeightDistanceToneKM",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
                {
                    caption: "PaxBlockTime",
                    dataField: "PaxBlockTime",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
                {
                    caption: "SeatKiloDistanceKM",
                    dataField: "SeatKiloDistanceKM",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
                {
                    caption: "Used",
                    dataField: "Used",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
                {
                    caption: "FPFuelKilo",
                    dataField: "FPFuelKilo",
                    dataType: "number",
                    summaryType: "sum",
                    //format: "currency",
                    //area: "data",
                    visible: false,
                },
               
                //{
                //    caption: "RPK",
                //    dataField: "UsedPerPaxKiloDistanceKM",
                //    dataType: "number",
                //    summaryType: "sum",
                //    //format: "currency",
                //    area: "column"
                //}
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
            visible:'IsStatsPivotVisible',
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
                        dataField: 'PYear', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110,  sortIndex: 0, sortOrder: 'asc',
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
                    { dataField: 'PDay', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width:100, sortIndex: 2, sortOrder: 'asc', visible: true },

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
                    {
                        dataField: 'TakeoffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm'

                    },
                    {
                        dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm'

                    },
                    { dataField: 'TotalPax', caption: 'Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                    { dataField: 'DistanceKM', caption: 'Distance', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

                ]
            },
            {
                caption: 'Fuel',
                columns: [
                    { dataField: 'Used', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                    { dataField: 'UpLift', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                    { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'RPK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                ]
            },
            {
                caption: 'KPI',
                columns: [
                   
                    { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'RPK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerSeatKiloDistanceKM', caption: 'ASK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerPax', caption: 'FRP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerBlockTime', caption: 'FBL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerFPFuel', caption: 'FP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },

                    
                   
                    


                    { dataField: 'UsedPerPaxBlockTime', caption: 'RPB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerWeightToneBlockTime', caption: 'FTB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerWeightToneDistance', caption: 'FTK', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    { dataField: 'UsedPerUpLift', caption: 'FU', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, customizeText: function (e) { return e.value ? e.value.toFixed(2) : null; } },
                    
                ]
            }
           
        ],
        summary: {
            totalItems: [
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "Used",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return (data.value / 1000.0).toFixed(2);
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
                        options.totalValuePaxDistance += options.value.PaxDistanceKM ? (options.value.PaxDistanceKM/1000.0) : 0;
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
        fullScreen:true,
        onShown: function () {
            $scope.drillDownDataGrid.updateDimensions();
        },
        bindingOptions: {
            title: "salesPopupTitle",
            visible: "salesPopupVisible"
        }
    };

    $scope.$on('ngRepeatFinishedTypes', function (ngRepeatFinishedEvent) {
        $.each($scope.typeCharts, function (_i, _d) {
            _d.destroy();
        });
        $scope.initTypesCard();
    });
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
    $scope.routeCharts = [];
    $scope.registerCharts = [];
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
        //dlu
        var bcolor = '#00cc99';
        if (reg)
            bcolor = '#ff9933';
        var $elem = $('.chart-type');
        $.each($elem, function (_i, _d) {
            var kpi = ($(_d).data('kpi'));
            var field = ($(_d).data('field'));
            var typeId = ($(_d).data('type'));
            var grp = Enumerable.From($scope.groupedTypes).Where('$.TypeId==' + typeId).FirstOrDefault();
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
                $scope.typeCharts.push(chart);
            else
                $scope.registerCharts.push(chart);

        });
    };
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
            // console.log(rem + '    ' + regs.indexOf(rem));
            bcolor = regColors[regs.indexOf(rem)];
            var grp = Enumerable.From($scope.groupedRegisters).Where('$.RegisterID==' + typeId).FirstOrDefault();
            var data = Enumerable.From(grp.items).Where('$.Year==' + $scope.year).OrderBy('Number($.Year)').ThenBy('Number($.Month)').ToArray();
            // console.log(typeId);
            // console.log(data);
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
                $scope.typeCharts.push(chart);
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

    $scope.pie_sum_used = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_used_instance)
                $scope.pie_sum_used_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
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
                name: 'Total',
                argumentField: "Type",
                valueField: "sumUsed",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Type",
                valueField: "sumUsedPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Type",
                valueField: "sumUsedCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedTypes',

        }
    };

    $scope.pie_sum_weight = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_weight_instance)
                $scope.pie_sum_weight_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
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
                name: 'Total',
                argumentField: "Type",
                valueField: "sumWeight",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Type",
                valueField: "sumWeightPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Type",
                valueField: "sumWeightCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedTypes',

        }
    };


    $scope.pie_sum_leg = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_leg_instance)
                $scope.pie_sum_leg_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value };
            }
        },
        "export": {
            enabled: false
        },
        series: [
            {
                name: 'Total',
                argumentField: "Type",
                valueField: "sumLeg",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Type",
                valueField: "sumLegPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Type",
                valueField: "sumLegCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedTypes',

        }
    };


    $scope.pie_sum_bl = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_bl_instance)
                $scope.pie_sum_bl_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [
            {
                name: 'Total',
                argumentField: "Type",
                valueField: "sumBL",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Type",
                valueField: "sumBLPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Type",
                valueField: "sumBLCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedTypes',

        }
    };
    ///////////////////////////////
    $scope.pie_sum_usedreg = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_usedreg_instance)
                $scope.pie_sum_usedreg_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart2,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
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
                name: 'Total',
                argumentField: "Register",
                valueField: "sumUsed",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Register",
                valueField: "sumUsedPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Register",
                valueField: "sumUsedCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedRegisters',

        }
    };

    $scope.pie_sum_weightreg = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_weightreg_instance)
                $scope.pie_sum_weightreg_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart2,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
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
                name: 'Total',
                argumentField: "Register",
                valueField: "sumWeight",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Register",
                valueField: "sumWeightPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Register",
                valueField: "sumWeightCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedRegisters',

        }
    };


    $scope.pie_sum_legreg = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_legreg_instance)
                $scope.pie_sum_legreg_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart2,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + this.value };
            }
        },
        "export": {
            enabled: false
        },
        series: [
            {
                name: 'Total',
                argumentField: "Register",
                valueField: "sumLeg",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Register",
                valueField: "sumLegPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Register",
                valueField: "sumLegCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedRegisters',

        }
    };


    $scope.pie_sum_blreg = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_sum_blreg_instance)
                $scope.pie_sum_blreg_instance = e.component;
        },

        type: "doughnut",
        palette: $rootScope.colorSetChart2,
        diameter: 0.85,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "top",
            margin: 0,
            visible: true,
            orientation: 'horizontal',
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [
            {
                name: 'Total',
                argumentField: "Register",
                valueField: "sumBL",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
                    },

                    connector: {
                        visible: false
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    },

                }
            },
            {
                name: 'Past',
                argumentField: "Register",
                valueField: "sumBLPast",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
                argumentField: "Register",
                valueField: "sumBLCurrent",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 11,
                        color: 'black',
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
            height: 250,
        },
        bindingOptions: {
            dataSource: 'groupedRegisters',

        }
    };
    ///////////////////////////////
    $scope.showKPI = function (kpi) {
        var data = { total: $scope.total, current: $scope.current, past: $scope.past, year: $scope.year, month: $scope.month };
        switch (kpi) {
            case 'RPK':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPK';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'RPB':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPB';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'FTK':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FTK';
                $rootScope.$broadcast('InitkpiRPK', data)
                break;
            case 'FBL':
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'FBL';
                $rootScope.$broadcast('InitkpiRPK', data)
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
    $scope.showKPIRoute = function (kpi, typ) {
        var data = {
            total: $scope.totalRoutes, grouped: $scope.groupedRoutes, year: $scope.year, month: $scope.month, current: $scope.currentTypes, past: $scope.pastTypes, type: typ,
        };
        switch (kpi) {
            case 'RPK':

                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPK';
                $rootScope.$broadcast('InitkpiRPKRoute', data)
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
    $scope.showKPIAC = function (kpi, typ) {
        var data = {
            total: $scope.totalTypes, grouped: $scope.groupedTypes, year: $scope.year, month: $scope.month, current: $scope.currentTypes, past: $scope.pastTypes, type: typ,
        };
        switch (kpi) {
            case 'RPK':
                // field:'UsedPerPaxKiloDistanceKM',indexName:'RPK'
                data.field = 'UsedPerPaxKiloDistanceKM';
                data.indexName = 'RPK';
                $rootScope.$broadcast('InitkpiRPKAC', data)
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
        $rootScope.page_title = '> Fuel';


        $('.fuelkpi').fadeIn(400, function () {

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
    $scope.sb_year = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.ds_year,
        onSelectionChanged: function (e) {
            // $scope.emptyRouteTab();
            // $scope.emptyAircraftTab();
            // $scope.bindMonthly();
            if ($scope.dobind) {
                $scope.bindmain();
            }
        },
        bindingOptions: {
            value: 'year',

        }
    };
    $scope.sb_month = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.ds_month,
        displayExpr: 'title',
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            // $scope.emptyRouteTab();
            // $scope.emptyAircraftTab();
            // $scope.bindMonthly();
            if ($scope.dobind) {
                $scope.bindmain();
            }
        },
        bindingOptions: {
            value: 'month',

        }
    };
    $scope.$on('$viewContentLoaded', function () {
        // $scope.period = 1;
        $scope.pdate = new persianDate(new Date());
        $scope.month = $scope.pdate.month();

        $scope.year = 1399; //$scope.pdate.year();
        $scope.month = 8;
        setTimeout(function () {
            $scope.dobind = true;
            $scope.bindmain();
        }, 1000);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);