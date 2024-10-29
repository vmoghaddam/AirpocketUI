'use strict';
app.controller('homeController', ['$scope', '$routeParams', 'authService', 'activityService', 'libraryService', 'flightService', '$rootScope','trnService',
'qaService','$location', '$window',
 function ($scope, $routeParams, authService, activityService, libraryService,flightService, $rootScope,trnService,qaService,$location, $window,) {
    $scope.isManager=$rootScope.HasDepartmentManager();
    if ($rootScope.IsOnlyFlightView()) {
        authService.setModule(3);
        $rootScope.setTheme();
        if ($rootScope.roles.indexOf('Station') != -1)
            $rootScope.navigate('/board', 'flight_board');
        else
            $rootScope.navigate('/flight/board', 'flight_board');

        return;
    }
    $scope.prms = $routeParams.prms;
    $scope.year = $routeParams.year;
    $scope.month = $routeParams.month;
    $scope.day = $routeParams.day;
    $scope.boardSummary = {
        Arrived: '-',
        Departed: '-',
        TotalFlight: '-',
        BaggageWeight: '-',
        BlockTime: '-',
        Canceled: '-',
        Date: '-',
        Delay: '-',
        Diverted: '-',
        FuelActual: '-',
        Pax: '-',
        TotalSeat: '-',
        CargoPerPax: '-',
        DelayRatio: '-',
        PaxLoad: '-',
        DelayStr: '-',
        BlockTimeStr: '-',
    };


    $rootScope.page_title = '> Home';
    $('.home').fadeIn();
    $rootScope.setTheme();
    // $scope.userName=authService.authentication.userName ;


    //   $scope.click=function(e){
    //      DevExpress.ui.themes.current('material.teal-light');
    //   };
    //$scope.click2=function(e){
    //      DevExpress.ui.themes.current('material.purple-light');
    //   };

    //cid,uid,mid,top



    var lastAddedHeight = $(window).height() - 273 - 236;
    //ati 1-14
    var headerheight = $rootScope.headerHeight;
    /////////////////////////////////////////
    var wrapperheight = 1 - headerheight * 1.0 / $(window).height();
    // alert(headerheight * 1.0 / $(window).height());
    $('.wrapper').css('height', wrapperheight * 100 + '%');


    /////////////////////////////////
    Chart.defaults.global.pointHitDetectionRadius = 1;
    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.tooltips.mode = 'index';
    Chart.defaults.global.tooltips.position = 'nearest';
    Chart.defaults.global.pointHitDetectionRadius = 1;
    var customTooltips = function (tooltip) {

        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'chartjs-tooltip';
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            this._chart.canvas.parentNode.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
            tooltipEl.classList.add(tooltip.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // Set Text
        if (tooltip.body) {
            var titleLines = tooltip.title || [];
            var bodyLines = tooltip.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function (title) {

                innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function (body, i) {
                var colors = tooltip.labelColors[i];
                var style = 'background:' + colors.backgroundColor;
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + body + '</td></tr>';

            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');

            tableRoot.innerHTML = innerHtml;
        }

        var positionY = this._chart.canvas.offsetTop;
        var positionX = this._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
        tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
        tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    };
    Chart.defaults.global.tooltips.custom = CustomTooltips;

    ////////////////////////////
    var random = function random() {
        return Math.round(Math.random() * 100);
    };
    /////////////////////////////////
    if ($scope.year && $scope.month && $scope.day) {
        $scope.currentDate = General.getDayFirstHour(new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0));
        $scope._datefrom = General.getDayFirstHour(new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0));
        $scope._dateto = General.getDayFirstHour(new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0));
    }
    else {
        $scope._datefrom = new Date();
        $scope._dateto = new Date();
        $scope.currentDate = General.getDayFirstHour(new Date());
    }

    

    
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        height:20,
        displayFormat: "yyyy-MM-dd",
        onValueChanged: function (e) {
            //var dateObj = e.value;
            //var month = dateObj.getUTCMonth() + 1; //months from 1-12
            //var day = dateObj.getUTCDate();
            //var year = dateObj.getUTCFullYear();
            ////alert(year + "/" + month + "/" + day);
            //$rootScope.navigatehomedate(year,month,day);
        },
        bindingOptions: {
            value: '_datefrom',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        height: 22,
        displayFormat: "yyyy-MM-dd",
        onValueChanged: function (e) {
            //var dateObj = e.value;
            //var month = dateObj.getUTCMonth() + 1; //months from 1-12
            //var day = dateObj.getUTCDate();
            //var year = dateObj.getUTCFullYear();
            ////alert(year + "/" + month + "/" + day);
            //$rootScope.navigatehomedate(year, month, day);
        },
        bindingOptions: {
            value: '_dateto',

        }
    };
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
    $scope.TopDelayedFlights = null;
    $scope.chart_most_delayed = {
        palette: "Vintage",
        commonSeriesSettings: {
            barWidth: 30,
            label: {
                font: {
                    size:11,
                },
                position: 'inside'
            }
        },
        argumentAxis:{
            label: {
                font: {
                    size: 11,
                },
                overlappingBehavior: 'rotate',
                rotationAngle: -45,
                position: 'inside',
            }
        },
        series: {
            argumentField: "Remark",
            valueField: "Delay",
           // name: "My oranges",
            type: "bar",
            //color: '#ffaa66'
        },
        legend:{
            visible:false,
        },
        scrollBar: {
            visible: true,
            width:5,
        },
        zoomAndPan: {
            argumentAxis: "both"
        },
        bindingOptions: {
            dataSource: 'TopDelayedFlights'
        }
    };

    $scope.PaxLoadRoute = null;
    $scope.chart_paxload = {
        palette: "Bright",
        commonSeriesSettings: {
            barWidth: 30,
            label: {
                font: {
                    size: 11,
                },
                position: 'inside'
            }
        },
        argumentAxis: {
            label: {
                font: {
                    size: 11,
                },
                overlappingBehavior: 'rotate',
                rotationAngle: -45,
                position: 'inside',
            }
        },
        series: {
            argumentField: "Route",
            valueField: "PaxLoad",
            // name: "My oranges",
            type: "bar",
            //color: '#ffaa66'
        },
        legend: {
            visible: false,
        },
        scrollBar: {
            visible: true,
            width: 5,
        },
        zoomAndPan: {
            argumentAxis: "both"
        },
        bindingOptions: {
            dataSource: 'PaxLoadRoute'
        }
    };

    $scope.DelayCategories = [];
    $scope.chart_delay_category = {
        type: "doughnut",
        palette: "Soft Pastel",
       
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        //"export": {
        //    enabled: true
        //},
        series: [{
            argumentField: "Category",
            valueField: "Delay",
            label: {
                visible: true,
                font:{
                    size:11,
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText.substr(0,4) + " (" + arg.percentText + ")";
                }
            }
        }],
        bindingOptions: {
            dataSource: 'DelayCategories'
        }
    };

    $scope.chart_pax = {
        type: "doughnut",
        palette: "Bright",

        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        //"export": {
        //    enabled: true
        //},
        series: [{
            argumentField: "Route",
            valueField: "TotalPax",
            label: {
                visible: true,
                font: {
                    size: 11,
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
        bindingOptions: {
            dataSource: 'PaxLoadRoute'
        }
    };


    $scope.BindSummary = function () {
        
        $scope.boardSummary = {
            Arrived: '-',
            Departed: '-',
            TotalFlight: '-',
            BaggageWeight: '-',
            BaggageCount: '-',
            CargoCount: '-',
            CargoWeight: '-',
            BlockTime: '-',
            FlightTime: '-',
            FlightTimeActual: '-',
            FixTime: '-',
            SITATime: '-',
            Canceled: '-',
            DateFrom: '-',
            DateTo: '-',
            Delay: '-',
            Diverted: '-',
            FuelActual: '-',
            FuelUplift: '-',
            Pax: '-',
            PaxLoad: '-',
            TotalSeat: '-',
            CargoPerPax: '-',
            DelayRatio: '-',

            DelayStr: '-',
            DelayPerFlightStr: '-',
            BlockTimeStr: '-',
            FlightTimeStr: '-',
            FixTimeStr: '-',
            FlightTimeActualStr: '-',
            SITATimeStr: '-',
            Types: '-',
            Registers: '-',
            PaxAdult: '-',
            PaxChild: '-',
            PaxInfant: '-',
        };
       var _datefrom = new Date($scope._datefrom);
       var _dateto = new Date($scope._dateto);
        var y = _datefrom.getFullYear();
        var m = _datefrom.getMonth() + 1;
        var d = _datefrom.getDate();

        var y2 = _dateto.getFullYear();
        var m2 = _dateto.getMonth() + 1;
        var d2 = _dateto.getDate();

        //zook
        $scope.loadingVisible = true;
        flightService.getBoardSummaryTotal(Config.CustomerId, y, m, d,y2,m2,d2).then(function (response) {
            $scope.loadingVisible = false;
            if (response)

                $scope.boardSummary = response;
            $scope.TopDelayedFlights = response.TopDelayedFlights;
            $scope.DelayCategories = response.DelayCategories;
            $scope.PaxLoadRoute = response.PaxLoadRoute;
            console.log($scope.boardSummary);


        }, function (err) { $scope.loadingVisible = false; });
    };

    $scope.flight = {
        chartDelayRatioConfig: {
            type: 'doughnut',
            data: {
                labels: ['Delay', 'Flight Time'],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom'

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartDelayRatio: null,
        chartMostDelayedConfig: {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Count',
                    backgroundColor: Chart.helpers.color(Colors.getColor(0)).alpha(0.5).rgbString(),
                    borderColor: Colors.getColor(0),
                    borderWidth: 1,
                    data: []
                }]

            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        maxBarThickness: 50,
                        ticks: {
                            fontSize: 9,
                            autoSkip: false

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart'
                },

            }
        },
        chartMostDelay: null,
        chartPaxLoadConfig: {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Count',
                    backgroundColor: Chart.helpers.color(Colors.getColor(3)).alpha(0.5).rgbString(),
                    borderColor: Colors.getColor(3),
                    borderWidth: 1,
                    data: []
                }]

            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        maxBarThickness: 50,
                        ticks: {
                            fontSize: 9,
                            autoSkip: false

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 1,
                            stepSize: 0.1
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart'
                },

            }
        },
        chartPaxLoad: null,
        Init: function (data) {

            $('.flight').fadeIn();
        },
        flightSummary: {},
        Airports: [],
        Bind: function (data) {
            $scope.BindSummary();
            //var datefrom = $scope.currentDate;
            //activityService.getFlightsSummary(Config.CustomerId, datefrom).then(function (response) {
            //    $scope.flight.flightSummary = (response);
            //    var d1 = $scope.flight.flightSummary.delay1;
            //    $scope.flight.flightSummary.delay1str = pad(Math.floor(d1 / 60)).toString() + ':' + pad(d1 % 60).toString();
            //    $scope.flight.flightSummary.actualtimestr = pad(Math.floor($scope.flight.flightSummary.actualtime / 60)).toString() + ':' + pad($scope.flight.flightSummary.actualtime % 60).toString();

            //    $.each($scope.flight.flightSummary.topdelays, function (_i, _d) {
            //        $scope.flight.chartMostDelayedConfig.data.labels.push(_d.Remark);
            //        $scope.flight.chartMostDelayedConfig.data.datasets[0].data.push(_d.DelayOffBlock);
            //    });
            //    $scope.flight.chartMostDelay = new Chart($('#chart-chartmostdelay'), $scope.flight.chartMostDelayedConfig);


            //    $.each($scope.flight.flightSummary.paxload, function (_i, _d) {
            //        $scope.flight.chartPaxLoadConfig.data.labels.push(_d.Remark);
                    
            //        $scope.flight.chartPaxLoadConfig.data.datasets[0].data.push(_d.TotalPax * 1.0 / _d.TotalSeat);
            //    });


            //    $scope.flight.chartPaxLoad = new Chart($('#chart-chartpaxload'), $scope.flight.chartPaxLoadConfig);


            //    var delayp = $scope.flight.flightSummary.delay1 * 100 / ($scope.flight.flightSummary.delay1 + $scope.flight.flightSummary.actualtime);
            //    var flightp = 100 - delayp;

            //    $scope.flight.chartDelayRatioConfig.data.datasets[0].data.push(delayp);
            //    $scope.flight.chartDelayRatioConfig.data.datasets[0].data.push(flightp);
            //    $scope.flight.chartDistribution = new Chart($('#chart-delayratio'), $scope.flight.chartDelayRatioConfig);
            //    $scope.flight.chartDelayRatioConfig.update();

            //}, function (err) { });
        }
    };
    ///////////////////////////////////
	$scope.has_forms=true;
	$scope.showStatus = function (type, title) {
        console.log(type)
        //$rootScope.Title = title;
		title=title.replaceAll('/','_');
        //$location.url("/qa/status/" + type+"/"+title);
	   //$window.open("/qa/status/" + type);
	  $window.open($location.$$absUrl.replace($location.$$path,"/qa/status/" + type+"/"+title), '_blank');
		qaService.setDateVisit($rootScope.employeeId, type).then(function(res){
		console.log(res);
		});
    }
	$scope.qa = {
        chartDelayRatioConfig: {
            type: 'doughnut',
            data: {
                labels: ['Delay', 'Flight Time'],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom'

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartDelayRatio: null,
        chartMostDelayedConfig: {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Count',
                    backgroundColor: Chart.helpers.color(Colors.getColor(0)).alpha(0.5).rgbString(),
                    borderColor: Colors.getColor(0),
                    borderWidth: 1,
                    data: []
                }]

            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        maxBarThickness: 50,
                        ticks: {
                            fontSize: 9,
                            autoSkip: false

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart'
                },

            }
        },
        chartMostDelay: null,
        chartPaxLoadConfig: {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Count',
                    backgroundColor: Chart.helpers.color(Colors.getColor(3)).alpha(0.5).rgbString(),
                    borderColor: Colors.getColor(3),
                    borderWidth: 1,
                    data: []
                }]

            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        maxBarThickness: 50,
                        ticks: {
                            fontSize: 9,
                            autoSkip: false

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 1,
                            stepSize: 0.1
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart'
                },

            }
        },
        chartPaxLoad: null,
        Init: function (data) {

            $('.qa').fadeIn();
        },
        flightSummary: {},
        Airports: [],
        Bind: function (data) {
			qaService.getQAByEmployee($rootScope.employeeId).then(function (response) {
               $scope.qaStatus = response.Data;
			   $scope.has_forms=$scope.qaStatus && $scope.qaStatus.length>0;
               console.log($scope.qaStatus);
             });
            $scope.BindSummary();
            //var datefrom = $scope.currentDate;
            //activityService.getFlightsSummary(Config.CustomerId, datefrom).then(function (response) {
            //    $scope.flight.flightSummary = (response);
            //    var d1 = $scope.flight.flightSummary.delay1;
            //    $scope.flight.flightSummary.delay1str = pad(Math.floor(d1 / 60)).toString() + ':' + pad(d1 % 60).toString();
            //    $scope.flight.flightSummary.actualtimestr = pad(Math.floor($scope.flight.flightSummary.actualtime / 60)).toString() + ':' + pad($scope.flight.flightSummary.actualtime % 60).toString();

            //    $.each($scope.flight.flightSummary.topdelays, function (_i, _d) {
            //        $scope.flight.chartMostDelayedConfig.data.labels.push(_d.Remark);
            //        $scope.flight.chartMostDelayedConfig.data.datasets[0].data.push(_d.DelayOffBlock);
            //    });
            //    $scope.flight.chartMostDelay = new Chart($('#chart-chartmostdelay'), $scope.flight.chartMostDelayedConfig);


            //    $.each($scope.flight.flightSummary.paxload, function (_i, _d) {
            //        $scope.flight.chartPaxLoadConfig.data.labels.push(_d.Remark);
                    
            //        $scope.flight.chartPaxLoadConfig.data.datasets[0].data.push(_d.TotalPax * 1.0 / _d.TotalSeat);
            //    });


            //    $scope.flight.chartPaxLoad = new Chart($('#chart-chartpaxload'), $scope.flight.chartPaxLoadConfig);


            //    var delayp = $scope.flight.flightSummary.delay1 * 100 / ($scope.flight.flightSummary.delay1 + $scope.flight.flightSummary.actualtime);
            //    var flightp = 100 - delayp;

            //    $scope.flight.chartDelayRatioConfig.data.datasets[0].data.push(delayp);
            //    $scope.flight.chartDelayRatioConfig.data.datasets[0].data.push(flightp);
            //    $scope.flight.chartDistribution = new Chart($('#chart-delayratio'), $scope.flight.chartDelayRatioConfig);
            //    $scope.flight.chartDelayRatioConfig.update();

            //}, function (err) { });
        }
    };
	
	/////////////////////
    $scope.profile = {
        RegisteringCourse: null,
        ActiveCourse: null,
        CompletedCourse: null,
        Passport: null,
        NDT: null,
        CAO: null,
        Medical: null,
        Certificate: null,



        chartEmployeesGroupConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Groups',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesGroup: null,

        chartEmployeesDepartmentConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Departments',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesDepartment: null,

        chartEmployeesStudyConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Fields of Study',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesStudy: null,

        chartEmployeesDegreeConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Education Degree',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesDegree: null,

        chartEmployeesSexConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Gender',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesSex: null,

        chartEmployeesAgeConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Age',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 5,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesAge: null,

        chartEmployeesExpConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Experience',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 5,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesExp: null,

        chartEmployeesExpCompanyConfig: {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Experience (Company)',
                    position: 'top',
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 5,
                        fontSize: 10,
                    }

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartEmployeesExpCompany: null,

        chartCertificatesTypesConfig: {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Count',
                    backgroundColor: Chart.helpers.color(Colors.getColor(1)).alpha(0.5).rgbString(),
                    borderColor: Colors.getColor(1),
                    borderWidth: 1,
                    data: []
                }]

            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        maxBarThickness: 100,
                        ticks: {
                            fontSize: 9,
                            autoSkip: false

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart'
                },

            }
        },
        chartCertificatesTypes: null,

        Bind: function (data) {
            console.log(data.EmployeesJobGroup);
            $scope.profile.RegisteringCourse = data.RegisteringCourse;
            $scope.profile.ActiveCourse = data.ActiveCourse;
            $scope.profile.CompletedCourse = data.CompletedCourse;

            $scope.profile.Passport = data.Passport;
            $scope.profile.NDT = data.NDT;
            $scope.profile.CAO = data.CAO;
            $scope.profile.Medical = data.Medical;
            $scope.profile.Certificate = data.Certificate;
            ////////////////////////////
            $.each(data.CertificatesTypes, function (_i, _d) {
                $scope.profile.chartCertificatesTypesConfig.data.labels.push(_d.CourseTypeTitle);
                $scope.profile.chartCertificatesTypesConfig.data.datasets[0].data.push(_d.Count);
            });
            $.each(data.EmployeesJobGroup, function (_i, _d) {
                var color = Colors.getColor(_i);
                $scope.profile.chartEmployeesGroupConfig.data.labels.push(_d.RootTitle);
                $scope.profile.chartEmployeesGroupConfig.data.datasets[0].data.push(_d.Count);
                $scope.profile.chartEmployeesGroupConfig.data.datasets[0].backgroundColor.push(color);
                $scope.profile.chartEmployeesGroupConfig.data.datasets[0].hoverBackgroundColor.push(color);


            });

            $.each(data.EmployeesLocation, function (_i, _d) {
                var color = Colors.getColorReverse(_i);
                $scope.profile.chartEmployeesDepartmentConfig.data.labels.push(_d.Title);
                $scope.profile.chartEmployeesDepartmentConfig.data.datasets[0].data.push(_d.Count);
                $scope.profile.chartEmployeesDepartmentConfig.data.datasets[0].backgroundColor.push(color);
                $scope.profile.chartEmployeesDepartmentConfig.data.datasets[0].hoverBackgroundColor.push(color);


            });

            $.each(data.EmployeesStudyField, function (_i, _d) {
                var color = Colors.getRandom();
                $scope.profile.chartEmployeesStudyConfig.data.labels.push(_d.StudyField);
                $scope.profile.chartEmployeesStudyConfig.data.datasets[0].data.push(_d.Count);
                $scope.profile.chartEmployeesStudyConfig.data.datasets[0].backgroundColor.push(color);
                $scope.profile.chartEmployeesStudyConfig.data.datasets[0].hoverBackgroundColor.push(color);


            });

            $.each(data.EmployeesDegree, function (_i, _d) {
                var color = Colors.getRandom();
                $scope.profile.chartEmployeesDegreeConfig.data.labels.push(_d.EducationDegree);
                $scope.profile.chartEmployeesDegreeConfig.data.datasets[0].data.push(_d.Count);
                $scope.profile.chartEmployeesDegreeConfig.data.datasets[0].backgroundColor.push(color);
                $scope.profile.chartEmployeesDegreeConfig.data.datasets[0].hoverBackgroundColor.push(color);


            });

            $.each(data.EmployeeSex, function (_i, _d) {
                var color = Colors.getColor(_i);
                $scope.profile.chartEmployeesSexConfig.data.labels.push(_d.Sex);
                $scope.profile.chartEmployeesSexConfig.data.datasets[0].data.push(_d.Count);
                $scope.profile.chartEmployeesSexConfig.data.datasets[0].backgroundColor.push(color);
                $scope.profile.chartEmployeesSexConfig.data.datasets[0].hoverBackgroundColor.push(color);


            });

            /////////EXP///////////////////
            var color = Colors.getColor(9);
            $scope.profile.chartEmployeesExpConfig.data.labels.push('-5');
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].data.push(data.EmployeesExp.Exp0005);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(10);
            $scope.profile.chartEmployeesExpConfig.data.labels.push('5-10');
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].data.push(data.EmployeesExp.Exp0510);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(6);
            $scope.profile.chartEmployeesExpConfig.data.labels.push('10-20');
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].data.push(data.EmployeesExp.Exp1020);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(4);
            $scope.profile.chartEmployeesExpConfig.data.labels.push('+20');
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].data.push(data.EmployeesExp.Exp2000);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpConfig.data.datasets[0].hoverBackgroundColor.push(color);
            /////////EXPCompany///////////////////
            color = Colors.getColor(9);
            $scope.profile.chartEmployeesExpCompanyConfig.data.labels.push('-5');
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].data.push(data.EmployeesExp.ExpCompany0005);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(10);
            $scope.profile.chartEmployeesExpCompanyConfig.data.labels.push('5-10');
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].data.push(data.EmployeesExp.ExpCompany0510);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(6);
            $scope.profile.chartEmployeesExpCompanyConfig.data.labels.push('10-20');
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].data.push(data.EmployeesExp.ExpCompany1020);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(4);
            $scope.profile.chartEmployeesExpCompanyConfig.data.labels.push('+20');
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].data.push(data.EmployeesExp.ExpCompany2000);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesExpCompanyConfig.data.datasets[0].hoverBackgroundColor.push(color);
            /////////Age///////////////
            color = Colors.getColor(9);
            $scope.profile.chartEmployeesAgeConfig.data.labels.push('-25');
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].data.push(data.EmployeesAge.Age0025);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(10);
            $scope.profile.chartEmployeesAgeConfig.data.labels.push('25-30');
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].data.push(data.EmployeesAge.Age2530);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(6);
            $scope.profile.chartEmployeesAgeConfig.data.labels.push('30-40');
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].data.push(data.EmployeesAge.Age3040);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(4);
            $scope.profile.chartEmployeesAgeConfig.data.labels.push('40-50');
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].data.push(data.EmployeesAge.Age4050);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].hoverBackgroundColor.push(color);
            color = Colors.getColor(11);
            $scope.profile.chartEmployeesAgeConfig.data.labels.push('+50');
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].data.push(data.EmployeesAge.Age5000);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].backgroundColor.push(color);
            $scope.profile.chartEmployeesAgeConfig.data.datasets[0].hoverBackgroundColor.push(color);
            ///////////////////////////
        },
        Init: function (data) {



            $scope.profile.chartEmployeesGroup = new Chart($('#chart-employees-group'), $scope.profile.chartEmployeesGroupConfig);
            $scope.profile.chartEmployeesDepartment = new Chart($('#chart-employees-department'), $scope.profile.chartEmployeesDepartmentConfig);
            $scope.profile.chartEmployeesStudy = new Chart($('#chart-employees-study'), $scope.profile.chartEmployeesStudyConfig);
            $scope.profile.chartEmployeesDegree = new Chart($('#chart-employees-degree'), $scope.profile.chartEmployeesDegreeConfig);
            $scope.profile.chartEmployeesSex = new Chart($('#chart-employees-sex'), $scope.profile.chartEmployeesSexConfig);
            $scope.profile.chartEmployeesAge = new Chart($('#chart-employees-age'), $scope.profile.chartEmployeesAgeConfig);
            $scope.profile.chartEmployeesExp = new Chart($('#chart-employees-exp'), $scope.profile.chartEmployeesExpConfig);
            $scope.profile.chartEmployeesExpCompany = new Chart($('#chart-employees-expcompany'), $scope.profile.chartEmployeesExpCompanyConfig);
            $scope.profile.chartCertificatesTypes = new Chart($('#chart-certificatestypes'), $scope.profile.chartCertificatesTypesConfig);

            $scope.profile.Bind(data);
            $('.profile').fadeIn();
        }
    };
    //////////////////////////////////
    $scope.library = {
        publishers: '-',
        authors: '-',
        journals: '-',
        DocumentsTotal: '-',
        BooksTotal: '-',
        PapersTotal: '-',
        VideosTotal: '-',

        DocumentsNotExposed: '-',
        BooksNotExposed: '-',
        PapersNotExposed: '-',
        VideosNotExposed: '-',
        Careless: '-',
        DownloadTotal: '-',
        Total: '-',
        chartDistributionConfig: {
            type: 'doughnut',
            data: {
                labels: ['Books', 'Videos', 'Papers'],
                datasets: [{
                    data: [],// [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom'

                },
                responsive: true,
                cutoutPercentage: 70,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        },
        chartDistribution: null,
        cardChartCarelessConfig: {
            type: 'bar',
            data: {
                labels: ['Books', 'Videos', 'Papers', 'Documents'],
                datasets: [{
                    label: '',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [],//[78, 81, 80, 85]
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false,
                        barPercentage: 0.5
                    }],
                    yAxes: [{
                        display: false
                    }]
                }
            }
        },
        cardChartCareless: null,
        cardChartDownloads: null,
        cardChartDownloadsConfig: {
            type: 'line',
            data: {
                labels: [], //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Downloads',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [],//[65, 59, 84, 84, 51, 55, 40]
                }]
            },
            //options.scales.yAxes[0].ticks.max
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
                            min: 0,
                            //max: 89
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
        },
        cardChartItems: null,
        cardChartItemsConfig: {
            type: 'line',
            data: {
                labels: [],// ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Added',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [], //[random(), random(), random(), random(), random(), random(), random()]
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
                            min: 0,
                            // max: 100
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
        },
        Bind: function (data) {
            $scope.library.Total = data.DocumentsTotal + data.BooksTotal + data.PapersTotal + data.VideosTotal;
            $scope.library.Careless = data.Careless;
            $scope.library.DownloadTotal = data.DownloadTotal;
            $scope.library.publishers = data.Publishers;
            $scope.library.journals = data.Journals;
            $scope.library.authors = data.Authors;
            $scope.library.DocumentsTotal = data.DocumentsTotal;
            $scope.library.BooksTotal = data.BooksTotal;
            $scope.library.PapersTotal = data.PapersTotal;
            $scope.library.VideosTotal = data.VideosTotal;

            $scope.library.DocumentsNotExposed = data.DocumentsNotExposed;
            $scope.library.BooksNotExposed = data.BooksNotExposed;
            $scope.library.PapersNotExposed = data.PapersNotExposed;
            $scope.library.VideosNotExposed = data.VideosNotExposed;

            $('.libcount').fadeIn();

            /////////////////
            $scope.library.chartDistributionConfig.data.datasets[0].data.push(data.BooksTotal);
            $scope.library.chartDistributionConfig.data.datasets[0].data.push(data.VideosTotal);
            $scope.library.chartDistributionConfig.data.datasets[0].data.push(data.PapersTotal);
            $scope.library.chartDistribution.update();
            ///////////////////////////////
            // ['Books', 'Videos', 'Papers', 'Documents']
            $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessBook);
            $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessVideo);
            $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessPaper);
            $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessDocument);
            $scope.library.cardChartCareless.update();
            ///////////////////////////////
            var max = 0;
            $.each(data.Download, function (_i, _d) {
                if (_d.Total > max)
                    max = _d.Total;

                $scope.library.cardChartDownloadsConfig.data.labels.push(_d.MonthName);
                $scope.library.cardChartDownloadsConfig.data.datasets[0].data.push(_d.Total);


            });
            $scope.library.cardChartDownloadsConfig.options.scales.yAxes[0].ticks.max = max + 1;
            $scope.library.cardChartDownloads.update();
            ///////////////////////////////
            max = 0;
            $.each(data.Add, function (_i, _d) {
                if (_d.Total > max)
                    max = _d.Total;

                $scope.library.cardChartItemsConfig.data.labels.push(_d.MonthName);
                $scope.library.cardChartItemsConfig.data.datasets[0].data.push(_d.Total);


            });
            $scope.library.cardChartItemsConfig.options.scales.yAxes[0].ticks.max = max + 1;
            $scope.library.cardChartItems.update();
            //////////////////////////
            libraryService.getLastExposed(Config.CustomerId, 20).then(function (response) {
                var items = [];
                $.each(response, function (_i, _d) {
                    if (_d.ImageUrl) {
                        _d.ImageUrl = $rootScope.clientsFilesUrl + _d.ImageUrl;
                    }
                    else {

                        var fn = '';
                        switch (Number(_d.TypeId)) {
                            case 83:
                                fn = 'book';
                                break;
                            case 84:
                                fn = 'papers2';
                                break;
                            case 85:
                                fn = 'videos2';
                                break;
                            case 86:
                                fn = 'docs2';
                                break;
                            default:
                                break;
                        }
                        _d.ImageUrl = 'content/images/' + fn + '.png';
                    }

                    _d.DateExposure = moment(_d.DateExposure).format('MMMM Do YYYY, h:mm:ss a');
                });
                $scope.recent = response;
                console.log($scope.recent);

            }, function (err) { });
        },
        Init: function (data) {


            $scope.library.cardChartCareless = new Chart($('#card-chart-careless'), $scope.library.cardChartCarelessConfig);



            $scope.library.cardChartDownloads = new Chart($('#card-chart-downloads'), $scope.library.cardChartDownloadsConfig);
            var cardChartActivity = new Chart($('#card-chart-activity'), {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'Activities',
                        backgroundColor: 'transparent',
                        borderColor: '#2A66B0',
                        data: [random(), random(), random(), random(), random(), random(), random()]
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
                                min: 0,
                                max: 110
                            }
                        }]
                    },
                    elements: {
                        line: {
                            borderWidth: 2
                        },
                        point: {
                            radius: 4,
                            hitRadius: 10,
                            hoverRadius: 4
                        }
                    },

                }
            });


            $scope.library.cardChartItems = new Chart($('#card-chart-items'), $scope.library.cardChartItemsConfig);
            var chartDistributionConfig1 = {
                type: 'doughnut',
                data: {
                    labels: ['Books', 'Videos', 'Papers'],
                    datasets: [{
                        data: [],// [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                },
                options: {
                    legend: {
                        display: true,
                        position: 'bottom'

                    },
                    responsive: true,
                    cutoutPercentage: 70,
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    }
                }
            };
            $scope.library.chartDistribution = new Chart($('#chart-distribution'), $scope.library.chartDistributionConfig);

            var chartActive = new Chart($('#chart-active'), {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Inactive',],
                    datasets: [{
                        data: [70, 30,],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#36A2EB', '#FF6384']
                    }]
                },
                options: {
                    legend: {
                        display: false,


                    },
                    responsive: true,
                    cutoutPercentage: 0,
                    layout: {
                        padding: {
                            left: 5,
                            right: 5,
                            top: 10,
                            bottom: 5
                        }
                    }
                }
            });

            $scope.library.Bind(data);
            $('.library').fadeIn();
        }


    };
    $scope.FillLibrary = function (data) {

        /////////////////
    };






    //$scope.recent = [];

    $scope.lastHits = [];
    $scope.lastActivities = [];
    $scope.recent = [];
	
	
	$scope.getExpiringClass = function (n) {
        if (n > 0)
            return "expiring";
        return "valid";
    }
    $scope.getExpiredClass = function (n) {
        if (n > 0)
            return "expired";
        return "valid";
    }
	
	   $scope.dg_course_columns = [
        { dataField: 'LastName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 270, fixed: false, fixedPosition: 'left' },
		{ dataField: 'JobGroupRoot', caption: 'Main Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left' },
        { dataField: 'CertificateType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        //{ dataField: 'CourseTitle', caption: 'Course Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
        //{ dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        //{ dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        //{ dataField: 'Duration', caption: 'Duration(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
        //{ dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        //{ dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        //{ dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        //{ dataField: 'No', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        //{ dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },

    ];
    $scope.dg_course_selected = null;


    $scope.dg_course_instance = null;
    $scope.dg_course_ds = null;
    $scope.dg_course = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 230,

        columns: $scope.dg_course_columns,
        onContentReady: function (e) {
            if (!$scope.dg_course_instance)
                $scope.dg_course_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_course_selected = null;

            }
            else {
                $scope.dg_course_selected = data;

            }



        },
        onCellPrepared: function (e) {
             if (e.rowType === "data" && e.column.dataField == "Remain") {
                //2022-01-22
                $scope.styleCell(e, e.data.Remain, e.data.ValidStatus);
            }
            //if (e.rowType === "data" && e.column.dataField == "Name") {
                //2022-01-22
            //    $scope.styleCell(e, e.data.Remain, e.data.ValidStatus);
            //}
        },
		 onRowClick: function (e) {
            var component = e.component;

            function initialClick() {
                console.log('initial click for key ' + e.key);
                component.clickCount = 1;
                component.clickKey = e.key;
                component.clickDate = new Date();
            }

            function doubleClick() {
                console.log('second click');
                component.clickCount = 0;
                component.clickKey = 0;
                component.clickDate = null;
                if (e.data.CourseId) {
                    var _data = { Id: e.data.CourseId };
                    $rootScope.$broadcast('InitViewCourse', _data);
                }


            }

            if ((!component.clickCount) || (component.clickCount != 1) || (component.clickKey != e.key)) {
                initialClick();
            }
            else if (component.clickKey == e.key) {
                if (((new Date()) - component.clickDate) <= 300)
                    doubleClick();
                else
                    initialClick();
            }

        },
        bindingOptions: {
            dataSource: 'ds_employee',
            
        }
    };
	     $scope.styleCell = function (e, value, status) {
        if (!value && status) {
            e.cellElement.css("backgroundColor", "#80ffcc");
            e.cellElement.css("color", "#000");
            return;
        }
        if (value && value == 1000000) {
            //#a6a6a6

            return;
        }
        if (value > 45) {
            e.cellElement.css("backgroundColor", "#80ffcc");
            e.cellElement.css("color", "#000");
            return;
        }

        //#80ffcc

        if ((!value && value !== 0) || value == -100000) {
            //#a6a6a6
            e.cellElement.css("backgroundColor", "#d9d9d9");
            e.cellElement.css("color", "#000");
            return;
        }
        if (value > 30 && value <= 45) {
            e.cellElement.css("backgroundColor", "#ffd633");
            e.cellElement.css("color", "#000");
        }
        else if (value > 0 && value <= 30) {
            e.cellElement.css("backgroundColor", "#ffa64d");
            e.cellElement.css("color", "#000");
        }
        else if (value <= 0) {
            e.cellElement.css("backgroundColor", "#ff471a");
            e.cellElement.css("color", "#fff");
        }
        //e.cellElement.css("backgroundColor", "#ffcccc");
    }
	$scope.popup_emp_visible = false;
    $scope.popup_emp = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_emp"
        },
        shading: true,
        title: 'Employees',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height()-100,
        width: $(window).width() - 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_emp_visible = false;

                    }
                }, toolbar: 'bottom'
            }
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
            
            if ($scope.dg_course_instance)
                $scope.dg_course_instance.refresh();


        },
        onHiding: function () {
             
            $scope.popup_emp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_emp_visible',
           


        }
    };
    $scope.goExpiring = function (x) {
         //console.log(x);
		 //return;
        // $rootScope.navigateSimple('/expiring/coursetype');
		// return;
		$scope.ds_employee=[];
		 trnService.get_expiring_people(x.title).then(function (response) {

                 console.log(response);
				 if (!response.Data)
					 return;
				 $scope.ds_employee=response.Data;
				 $scope.popup_emp_visible = true;
                   // $scope.ds_expiring = Enumerable.From(response).Where('($.ExpiringCount>0 || $.ExpiredCount>0)').ToArray();



         }, function (err) { General.ShowNotify(err.message, 'error'); });
		
    }
    $scope.bindExpiring = function () {
        $scope.ds_expiring = [];
        if (!$rootScope.HasTrainingAccess())
            return;
		
		//getExpiring
		 if ($rootScope.HasDepartmentManager()) {
		 }
		trnService.get_expiring().then(function (response) {


            $scope.ds_expiring = Enumerable.From(response.Data).OrderByDescending('$.expired').ToArray();
			console.log('expiring',$scope.ds_expiring );
            


        }, function (err) { General.ShowNotify(err.message, 'error'); });
		return;
        if ($rootScope.HasDepartmentManager()) {
            trnService.getEmployee($rootScope.employeeId).then(function (response) {
                $scope.employee = response;
                trnService.getExpiringByMainCode($scope.employee.JobGroupMainCode).then(function (response) {


                    $scope.ds_expiring = Enumerable.From(response).Where('($.ExpiringCount>0 || $.ExpiredCount>0)').ToArray();



                }, function (err) { General.ShowNotify(err.message, 'error'); });
            }, function (err) { General.ShowNotify(err.message, 'error'); });
        }
        else
        trnService.getExpiring().then(function (response) {


            $scope.ds_expiring = Enumerable.From(response).Where('($.ExpiringCount>0 || $.ExpiredCount>0)').ToArray();
            


        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        if ($rootScope.moduleId != 3  &&  $rootScope.moduleId != 5) {
             
            var items = Enumerable.From(Config.MenuItems)//.Where('$.moduleId==' + $rootScope.moduleId)
                .Where(function (x) {
                    return x.moduleId == $rootScope.moduleId && $rootScope.HasMenuAccess(x.key, $rootScope.moduleId);
                })

                .ToArray();

            $scope.lastHits = items;
            activityService.getDashboard(Config.CustomerId, $rootScope.moduleId).then(function (response) {
                switch (Number($rootScope.moduleId)) {
                    case 1:
                        //$scope.FillLibrary(response);
$scope.bindExpiring();
                        $scope.profile.Init(response);
                        break;
                    case 2:
                        //$scope.FillLibrary(response);
                        $scope.library.Init(response);
                        break;
                    case 3:

                        $scope.flight.Init(response);
                        $scope.flight.Bind();
                        break;
                    default: break;
                }

                //////////////////////

                activityService.getLastActivities(Config.CustomerId, $rootScope.moduleId, $rootScope.userId, 10).then(function (response) {
                    var items = [];
                    $.each(response, function (_i, _d) {
                        _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : 'content/images/imguser.png';
                        _d.Date = moment(_d.Date).format('MMMM Do YYYY, h:mm:ss a');
                    });
                    $scope.lastActivities = response;

                }, function (err) { });

                //////////////////////

            }, function (err) { });
            //activityService.getMenuHits(Config.CustomerId, $rootScope.userId, $rootScope.moduleId, 5).then(function (response) {

            //    //var items = [];
            //    //$.each(response, function (_i, _d) {
            //    //    var rec = Enumerable.From(Config.MenuItems).Where('$.moduleId==' + $rootScope.moduleId + ' && $.key=="' + _d.Key + '"').FirstOrDefault();
            //    //    if (rec)
            //    //        items.push(rec);
            //    //});



            //}, function (err) { });
        }
        else if ($rootScope.moduleId == 3) {
            $scope.flight.Init();
            $scope.flight.Bind();
            //Flight Pocket


            ///// End Flight Pocket
        }
			else{
			  $scope.qa.Init();
			  $scope.qa.Bind();
			   qaService.getDateVisit(/*$rootScope.employeeId*/1).then(function (res) {
                 console.log(res.Data)
      var _mes=[];
      $.each(res.Data, function (_i, _d) {
		  console.log(_d)
		  var _j=_i+1;
          switch (_d.Type) {
              case 0:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Cabin Safety Report(' + _d.Count + ')',
                      type: 'info',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				  _mes.push('Cabin Safety Report(' + _d.Count + ')');
                  break;
              case 1 :
				  var _pos='25 '+(_j*-50);
                  DevExpress.ui.notify({
                      message: 'Ground Incident/Accident/Damage Report(' + _d.Count+ ')' ,
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				    _mes.push('Ground Incident/Accident/Damage Report(' + _d.Count + ')');
                  break;
              case 2:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Voluntary Hazard Reporting(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Voluntary Hazard Reporting(' + _d.Count + ')');
                  break;
              case 3:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Maintenance Occurence Report(' + _d.Count +')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Maintenance Occurence Report(' + _d.Count + ')');
                  break;
              case 4:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Catering Hazard Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                     position: { offset: _pos }
                  }); 
				     _mes.push('Catering Hazard Report(' + _d.Count + ')');
                  break;
             
              case 5:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Security Hazard Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Security Hazard Report(' + _d.Count + ')');
                  break;
              case 6:
				   var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Dispatch Hazard Report(' + _d.Count + ')' ,
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				    _mes.push('Dispatch Hazard Report(' + _d.Count + ')');
                  break;
              case 7:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Cyber Security Report(' + _d.Count + ')' ,
                      type: 'success',
                      displayTime: 5000,
                     position: { offset: _pos }
                  }); 
				   _mes.push('Cyber Security Report(' + _d.Count + ')');
                  break;
              case 8:
				   var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Air Safety Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Air Safety Report(' + _d.Count + ')');
                  break;

          }

         
      });
		     	   
					   
  });
			  //2024-01-16  ////////////////
			  setInterval(function() {
                 				       qaService.getDateVisit(1).then(function (res) {
                 console.log(res.Data)
      var _mes=[];
      $.each(res.Data, function (_i, _d) {
		  console.log(_d)
		  var _j=_i+1;
          switch (_d.Type) {
              case 0:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Cabin Safety Report(' + _d.Count + ')',
                      type: 'info',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				  _mes.push('Cabin Safety Report(' + _d.Count + ')');
                  break;
              case 1 :
				  var _pos='25 '+(_j*-50);
                  DevExpress.ui.notify({
                      message: 'Ground Incident/Accident/Damage Report(' + _d.Count+ ')' ,
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				    _mes.push('Ground Incident/Accident/Damage Report(' + _d.Count + ')');
                  break;
              case 2:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Voluntary Hazard Reporting(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Voluntary Hazard Reporting(' + _d.Count + ')');
                  break;
              case 3:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Maintenance Occurence Report(' + _d.Count +')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Maintenance Occurence Report(' + _d.Count + ')');
                  break;
              case 4:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Catering Hazard Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                     position: { offset: _pos }
                  }); 
				     _mes.push('Catering Hazard Report(' + _d.Count + ')');
                  break;
             
              case 5:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Security Hazard Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Security Hazard Report(' + _d.Count + ')');
                  break;
              case 6:
				   var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Dispatch Hazard Report(' + _d.Count + ')' ,
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				    _mes.push('Dispatch Hazard Report(' + _d.Count + ')');
                  break;
              case 7:
				  var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Cyber Security Report(' + _d.Count + ')' ,
                      type: 'success',
                      displayTime: 5000,
                     position: { offset: _pos }
                  }); 
				   _mes.push('Cyber Security Report(' + _d.Count + ')');
                  break;
              case 8:
				   var _pos='25 '+(_j*-50);
                   DevExpress.ui.notify({
                      message: 'Air Safety Report(' + _d.Count + ')',
                      type: 'success',
                      displayTime: 5000,
                      position: { offset: _pos }
                  }); 
				   _mes.push('Air Safety Report(' + _d.Count + ')');
                  break;

          }

         
      });
		     	   
					   
  });

			  }, 30*1000);
			
			  ////////////////////////////
		}
    }



    //////////////////////////////////

}]);