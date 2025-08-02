'use strict';
app.controller('homeController', ['$scope', '$routeParams', 'authService', 'activityService', 'libraryService', 'flightService', '$rootScope', '$compile', 'mntService', 'mapService',
    '$sce', '$location', '$window',
    function ($scope, $routeParams, authService, activityService, libraryService, flightService, $rootScope, $compile, mntService,mapService,$sce,$location,$window) {

        if ($rootScope.IsOnlyFlightView()) {
            authService.setModule(3);
            $rootScope.setTheme();
            if ($rootScope.roles.indexOf('Station') != -1)
                $rootScope.navigate('/board', 'flight_board');
            else
                $rootScope.navigate('/board', 'flight_board');

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

        $scope.go_board = function () {

            $rootScope.navigate('/board', 'flight_board');
        }
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
        //Chart.defaults.global.pointHitDetectionRadius = 1;
        //Chart.defaults.global.tooltips.enabled = false;
        //Chart.defaults.global.tooltips.mode = 'index';
        //Chart.defaults.global.tooltips.position = 'nearest';
        //Chart.defaults.global.pointHitDetectionRadius = 1;
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
       // Chart.defaults.global.tooltips.custom = CustomTooltips;

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
            height: 20,
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
                argumentField: "Remark",
                valueField: "Delay",
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
                dataSource: 'TopDelayedFlights'
            }
        };

        $scope.PaxLoadRoute = null;
        $scope.chart_paxload = {
            palette: "Office",
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
            size: {
                height: 330
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
                    font: {
                        size: 11,
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
                height: 330
            },
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
            flightService.getBoardSummaryTotal(Config.CustomerId, y, m, d, y2, m2, d2).then(function (response) {
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
                //$scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessBook);
                // $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessVideo);
                // $scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessPaper);
                //$scope.library.cardChartCarelessConfig.data.datasets[0].data.push(data.CarelessDocument);
                // $scope.library.cardChartCareless.update();
                ///////////////////////////////
                var max = 0;
                $.each(data.Download, function (_i, _d) {
                    if (_d.Total > max)
                        max = _d.Total;

                    // $scope.library.cardChartDownloadsConfig.data.labels.push(_d.MonthName);
                    // $scope.library.cardChartDownloadsConfig.data.datasets[0].data.push(_d.Total);


                });
                // $scope.library.cardChartDownloadsConfig.options.scales.yAxes[0].ticks.max = max + 1;
                // $scope.library.cardChartDownloads.update();
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


                // $scope.library.cardChartCareless = new Chart($('#card-chart-careless'), $scope.library.cardChartCarelessConfig);



                // $scope.library.cardChartDownloads = new Chart($('#card-chart-downloads'), $scope.library.cardChartDownloadsConfig);
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


        $scope._value = 2223;
        $scope.get_engine_ranges = function (x) {
            var max = x.initial_remaining;
            var ranges = {
                "0": { "color": "red" }
            };

            var r10 = (Math.floor(max * 0.1)).toString();
            ranges[r10] = { color: 'orange' };

            var r30 = (Math.floor(max * 0.2)).toString();
            ranges[r30] = { color: 'yellow' };

            var r30 = (Math.floor(max * 0.3)).toString();
            ranges[r30] = { color: '#00ffcc' };

            var r40 = (Math.floor(max * 0.4)).toString();
            ranges[r40] = { color: '#00ffbf' };

            var r50 = (Math.floor(max * 0.5)).toString();
            ranges[r50] = { color: '#00e6ac' };

            var r70 = (Math.floor(max * 0.7)).toString();
            ranges[r70] = { color: '#00cc99' };

            var r90 = (Math.floor(max * 0.9)).toString();
            ranges[r90] = { color: '#00b386' };

            //#00ffcc



            console.log(ranges);
            return ranges;
        };

        $scope.get_bar_gauge_bcolor = function (_max, _value) {
            if (_value >= 0.8 * _max)
                return "#00b386";
            if (_value >= 0.7 * _max)
                return "#00e6ac";
            if (_value >= 0.5 * _max)
                return "#99ff99";
            if (_value >= 0.4 * _max)
                return "#ffff66";
            if (_value >= 0.2 * _max)
                return "#ff9966";

            return "#ff471a";
        }
        $scope.set_bar_gauge_value = function (lg) {
            lg.data_days = {};
            lg.data_ldgs = {};

            lg.data_days.ranges = [lg.initial_remaining_days];
            lg.data_ldgs.ranges = [lg.initial_remaining_ldgs];
            lg.data_days.measures = [lg.actual_remaining_days];
            lg.data_ldgs.measures = [lg.actual_remaining_ldgs];



            // data.max = initial_remaining;
            // data.actual_remaining = actual_remaining;
            // data.initial_remaining = initial_remaining;
            // data.ranges = [data.max];
            // data.measures = [data.actual_remaining];
            lg.data_days.bcolor = $scope.get_bar_gauge_bcolor(lg.initial_remaining_days, lg.actual_remaining_days);
            lg.data_ldgs.bcolor = $scope.get_bar_gauge_bcolor(lg.initial_remaining_ldgs, lg.actual_remaining_ldgs);
            lg.data_days.color = ['#404040'];
            lg.data_ldgs.color = ['#404040'];
        }


        $scope.set_bar_gauge_value_apu = function (lg) {
            lg.data_days = {};


            lg.data_days.ranges = [lg.initial_remaining];

            lg.data_days.measures = [lg.actual_remaining];

            lg.data_days.bcolor = $scope.get_bar_gauge_bcolor(lg.initial_remaining, lg.actual_remaining);

            lg.data_days.color = ['#404040'];

        }

        $scope.formatMinutes = function (mm) {


            if (!mm && mm !== 0)
                return "-";
            var sgn = "";
            if (mm < 0)
                sgn = "-";
            mm = Math.abs(Math.round(mm));
            return sgn + pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.round((mm % 60))).toString();
        };
        $scope.bar_gauge_options = {
            "chart": {
                "type": "bulletChart",
                "duration": 500,
                "bullet": {
                    "dispatch": {},
                    "forceX": [
                        0
                    ],
                    "width": 380,
                    "height": 30,
                    "tickFormat": null,
                    "margin": {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    },
                    "orient": "left"
                },


                "tooltip": {

                    "enabled": false,

                },
                "forceX": [
                    0
                ],
                "width": null,
                "height": 40,
                "tickFormat": null,
                "margin": {
                    "top": 5,
                    "right": 20,
                    "bottom": 20,
                    "left": 20
                },
                "orient": "left",
                "ticks": null,
                "noData": null
            },

            "styles": {
                "classes": {
                    "with-3d-shadow": true,
                    "with-transitions": true,
                    "gallery": false
                },
                "css": {},

            }
        }

        $scope._update = function () {
            // alert($('.nv-measure').length);
            // $('.nv-measure').addClass('bar-green');
            // $scope._data.measures[0] = 100;
            // $scope._data.color[0] = 'blue';

            $scope.aircrafts[0].landing_gear.data_days.bcolor = 'green';

        }
        $scope.get_bar_class = function () {
            return 'bar-green';
        }

        $scope.timer_flight_opertation = null;

        $scope.get_mnt_dashboard = function () {
            mntService.getDashboard().then(function (response) {
                $scope.aircrafts = [];
                $.each(response, function(_i, ac){
                    $scope.set_bar_gauge_value(ac.landing_gear);

                    $scope.set_bar_gauge_value_apu(ac.apu);
                    $scope.set_bar_gauge_value_apu(ac.defects);
                    //console.log(ac.checks[0] );
                    if (ac.checks.length > 0) {
                        $scope.set_bar_gauge_value_apu(ac.checks[0])
                        console.log('checks', ac.checks[0]);
                    };
                    if (ac.adsbs.length > 0)
                     $scope.set_bar_gauge_value_apu(ac.adsbs[0]);
                   ac.engine1.ranges = $scope.get_engine_ranges(ac.engine1);
                   ac.engine2.ranges = $scope.get_engine_ranges(ac.engine2);
                    $.each(ac.hts, function (_i, _d) {

                        ac.hts[_i].ranges = $scope.get_engine_ranges(ac.hts[_i]);
                    });
                    $scope.aircrafts.push(ac);
                });
               

               
                //$scope.aircrafts[0].engine1.ranges = $scope.get_engine_ranges($scope.aircrafts[0].engine1);
                //$scope.aircrafts[0].engine2.ranges = $scope.get_engine_ranges($scope.aircrafts[0].engine2);

               

            }, function (err) { });

        }
        $scope.ac_status_visible =  $rootScope.HasACStatus();
        $scope.pax_visible = !$scope.ac_status_visible;
        $scope.baggage_visible = !$scope.ac_status_visible;


        ///////////MAP /////////////////////////////
        $scope.map = $rootScope.userName == 'demo';
        $scope.ds_live = [];
        $scope.get_map_class = function () {
            var cls = 'col-xs-12 col-sm-12 col-md-6 ';
            if ($scope.ds_live.length == 1) cls += 'col-lg-12';
            if ($scope.ds_live.length == 2) cls += 'col-lg-6';
            if ($scope.ds_live.length > 2) cls += 'col-lg-4';

            return cls;

        };
        var _intv;
        $scope.update_maps = function () {
            _intv = setInterval(function () {
                $.each($scope.ds_live, function (_i, _d) {
                    // $('#i1').get(0).contentWindow.postMessage("FUCK", "*");
                    var message = {
                        type: 'info',
                        reg: _d.Register,
                        route: _d.Origin + '-' + _d.Destination,
                        dep: moment(_d.DepLocal).format('HH:mm'),
                        arr: moment(_d.ArrLocal).format('HH:mm'),
                        status: _d.FlightStatus,
                        takeoff: _d.DepLocal,
                        departed: _d.FlightStatus == 'Departed' ? 1 : 0,

                    };
                    //console.log(message);
                    $('#map-' + _d.Id).get(0).contentWindow.postMessage(message, "*");

                });
                clearInterval(_intv);
            }
                , 2000);
        };

        $scope.show_map = function (x) {

            var data = x;
            $rootScope.$broadcast('InitMap', data);
        }


        ////////////////////////////////////////////



        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            if ($rootScope.moduleId != 3 && $rootScope.moduleId != 5 && $rootScope.moduleId != 6 && $rootScope.moduleId != 7 && $rootScope.moduleId != 8) {

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
                $scope.get_mnt_dashboard();
                //Flight Pocket
                //$scope.timer_flight_opertation = setInterval(function () {
                //    console.log('timer_flight_opertation');
                //}, 5000);

                //$scope.aircrafts = [];

                //mapService.getLiveFlights().then(function (response) {
                //    $.each(response, function (_i, _d) {
                //        _d.url = $sce.trustAsResourceUrl('https://map.airpocket.app/fr.html?ver=1&icao=axv&no=' + _d.FlightNo + '&date=' + moment(new Date(_d.DateFlight)).format("YYYY-MM-DD") + '&mode=online');
                //    });
                //    $scope.ds_live = response;
                //    $scope.update_maps();
                //}, function (err) { });
                //setInterval(function () {
                //    mapService.getLiveFlights().then(function (response) {
                //        console.log('search flight');
                //        var new_ids = [];
                //        var ex_ids = Enumerable.From($scope.ds_live).Select('$.Id').ToArray();
                //        $.each(response, function (_i, _d) {
                //            _d.url = $sce.trustAsResourceUrl('https://map.airpocket.app/fr.html?icao=vrh&no=' + _d.FlightNo + '&date=' + moment(new Date(_d.DateFlight)).format("YYYY-MM-DD") + '&mode=online');
                //            new_ids.push(_d.Id);
                //            if (!ex_ids.includes(_d.Id))
                //                $scope.ds_live.push(_d);
                //            else {
                //                var ex = Enumerable.From($scope.ds_live).Where('$.Id==' + _d.Id).FirstOrDefault();
                //                if (ex) {
                //                    ex.Register = _d.Register;
                //                    ex.Origin = _d.Origin;
                //                    ex.Destination = _d.Destination;
                //                    ex.DepLocal = _d.DepLocal;
                //                    ex.ArrLocal = _d.ArrLocal;
                //                    ex.FlightStatus = _d.FlightStatus;

                //                }
                //            }
                //        });
                //        if (!response || response.length == 0) $scope.ds_live = [];
                //        $scope.ds_live = Enumerable.From($scope.ds_live).Where(function (t) { return new_ids.includes(t.Id); }).ToArray();



                //        console.log('repeat', $scope.ds_live);
                //        $scope.update_maps();

                //    }, function (err) { });

                //}, 10000);
                //var ac = {
                //    register: 'RBA',
                //    tfc: 2321,
                //    tfh: 1145,
                //    block: 382,
                //    cycle: 3,
                //    scheduled_cycle: 6,
                //    scheduled_block:'11:20',
                //    std: '06:12',
                //    sta: '22:50',
                //    route:'THR,MHD,THR,SYZ,KIH,THR',
                //    engine1: {

                //        initial_remaining: 5000,
                //        label: 'Engine 1',
                //        append: 'CY',
                //        actual_remaining: 2100,

                //    },
                //    engine2: {
                //        initial_remaining: 8000,
                //        label: 'Engine 2',
                //        append: 'CY',
                //        actual_remaining: 6543,
                //    },
                //    landing_gear: {
                //        initial_remaining_days: 356,
                //        initial_remaining_ldgs: 700,
                //        actual_remaining_days: 210,
                //        actual_remaining_ldgs: 260,
                //        //data_days: {},
                //        // data_ldgs: {},
                //        //data_days: {

                //        //   // "ranges": [300],
                //        //   // "measures": [0],
                //        //  //  color: ['#404040'],
                //        //   // bcolor:  'red' 
                //        //},
                //        //data_ldgs: {
                //        //   // "ranges": [300],
                //        //   // "measures": [0],
                //        //}
                //    }
                //    , apu: {
                //        initial_remaining: 2806,
                //        actual_remaining: 570,
                //        append: 'hrs',
                //    },
                //    deffects: {
                //        count: 2,
                //        initial_remaining: 15,
                //        actual_remaining: 14,
                //        append: 'cy',
                //    },
                //    checks: [
                //        {
                //            title: 'A3',
                //            initial_remaining: 96,
                //            actual_remaining: 43,
                //            append: 'days',
                //        }
                //    ],
                //    adsbs: [
                //        {
                //            title: '',
                //            initial_remaining: 123,
                //            actual_remaining: 63,
                //            append: 'days',
                //        }
                //    ],
                //    hts: [
                //        {
                //            title: 'H/T 1',
                //            initial_remaining: 123,
                //            actual_remaining: 33,
                //            append: 'cy',
                //        },
                //        {
                //            title: 'H/T 2',
                //            initial_remaining: 209,
                //            actual_remaining: 168,
                //            append: 'cy',
                //        },
                //        {
                //            title: 'H/T 3',
                //            initial_remaining: 480,
                //            actual_remaining: 200,
                //            append: 'cy',
                //        },
                //    ]



                //};

                ////ac.landing_gear.data_days.ranges = [300];
                //// ac.landing_gear.data_days.measures = [145];

                //// ac.landing_gear.data_ldgs.ranges = [948];
                //// ac.landing_gear.data_ldgs.measures = [500];

                ////$scope.aircrafts.push(
                ////    {
                ////        register: 'RBB',
                ////        tfc: 1460,
                ////        tfh: 823,
                ////    }
                ////);
                ////$scope.aircrafts.push(
                ////    {
                ////        register: 'RBC',
                ////        tfc: 1980,
                ////        tfh: 1000,
                ////    }
                ////);

                ///// End Flight Pocket
            }
            else if ($rootScope.moduleId == 5) {
            }
            else if ($rootScope.moduleId == 6) {
                if (!$rootScope.vira_locations) {
                    $rootScope.fill_vira_locations(function () {
                        $('.vira_lgs').fadeIn();
                    });
                }
                else
                $('.vira_lgs').fadeIn();
                
            }
        }



        //////////////////////////////////

    }]);