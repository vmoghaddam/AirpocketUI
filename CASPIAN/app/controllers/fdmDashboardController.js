'use strict';
app.controller('fdmDashboardController', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($http, $scope, $location, $routeParams, $rootScope, flightService, fdmService, aircraftService, authService, notificationService, $route, $window) {




    $scope.prms = $routeParams.prms;

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

    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };
    /////////////////////////////////////////
    $scope.dt = new Date();
    $scope.df = new Date();
    $scope.df.setMonth($scope.dt.getMonth() - 6);
    $scope.dt = $scope.dt.toISOString().split('T')[0]
    $scope.df = $scope.df.toISOString().split('T')[0]
    //$scope.dfSplit = $scope.df.split("-");
    //$scope.dtSplit = $scope.df.split("-");

    $scope.count = 5;


    var MonthDataSource = [
        { Id: 0, Title: 'January' },
        { Id: 1, Title: 'February' },
        { Id: 2, Title: 'March' },
        { Id: 3, Title: 'April' },
        { Id: 4, Title: 'May' },
        { Id: 5, Title: 'June' },
        { Id: 6, Title: 'July' },
        { Id: 7, Title: 'August' },
        { Id: 8, Title: 'September' },
        { Id: 9, Title: 'October' },
        { Id: 10, Title: 'November' },
        { Id: 11, Title: 'December' },

    ];


    $scope.yt = new Date().getFullYear();
    $scope.mt = new Date().getMonth();

    if ($scope.mt - 6 < 0) {
        $scope.result = $scope.mt - 6;
        $scope.yf = $scope.yt - 1;
        $scope.mf = 12 + $scope.result
    } else {
        $scope.yf = $scope.yt;
        $scope.mf = $scope.mt - 6;
    }

    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };
    $scope.sb_mf = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mf',


        }
    };
    $scope.sb_mt = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mt',


        }
    };


    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {


            $scope.bind();

        }


    };


    //$scope.ds_getFdmIncidentType = null;
    $scope.bind = function () {

        $scope.cptSeries = [];
        $scope.compareCpt = [];
        $scope.regSeries = [];
        $scope.compareReg = [];
        $scope.yearMonth2 = [];

        $scope.month = $scope.mt + 1;
        $scope.year = $scope.yt;
        for (let i = 0; i < 13; i++) {
            $scope.yearMonth2.push($scope.year.toString() + ($scope.month < 10 ? "0" : "") + $scope.month.toString());
            if ($scope.month === 1) {
                $scope.year--;
                $scope.month = 12
            } else {
                $scope.month--;
            }


        }


        $scope.yearMonth2.reverse();

        
        $scope.dt = new Date();
        $scope.df = new Date();
        $scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
        $scope.df.setFullYear($scope.yt, $scope.mt, 1);
        $scope.dt = $scope.dt.toISOString().split('T')[0]
        $scope.df = $scope.df.toISOString().split('T')[0]

        $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
        $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
        $scope.ymf = parseInt($scope.ymf);
        $scope.ymt = parseInt($scope.ymt);


        fdmService.getEventsDaily($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
                        var _ds = response.Data.data;
                        $scope.dataType = response.Data;
            
                        $scope.totalIncidentsPie = [{ level: 'Low', Count: response.Data.TotalLowCount }, { level: 'Medium', Count: response.Data.TotalMediumCount }, { level: 'High', Count: response.Data.TotalHighCount },];
                        $.each(_ds, function (_i, _d) {
                         _d._Date = new Date(_d.FlightDate);
                         _d.TotalPercentage = (_d.EventsCount * 100.0) / _d.FlightCount;
                        });
                       _ds = Enumerable.From(_ds).OrderBy('$._Date').ToArray();
                       $scope.eventsDailyData = _ds;
                       $scope.ds_cptEventsGeneral = response.Data;
					   ///////////////////////////
					    fdmService.fdmDashboardMonthly($scope.yt, $scope.mt).then(function (response) {
                           $scope.monthlyDataChart = response.Data;
			               fdmService.FDMAVG().then(function (response) {
				   
                           }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
			               fdmService.FDMRoute($scope.ymf + 1, $scope.ymt + 1).then(function (response) {

                            $scope.ds_cptRoute = response.Data;
                           });
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
					   
					   
					   ///////////////////////////
                      }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        fdmService.getFdmEventsName($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.EventsNameData = response.Data.data;
            $scope.EventsNameDataNoZero = Enumerable.From(response.Data.data).Where('Number($.IncidentCount)>0').ToArray();

            $scope.arr = [];

            $.each($scope.EventsNameData, function (_i, _d) {
                $scope.arr.push({ name: _d.EventName, value: _d.IncidentCount });
            });


            $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];
			
			///////
		    fdmService.getEvetnByRegMonthly($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
             
     			 $scope.registerEventData = response.Data.data;
				 //////
				 fdmService.getTopCpt($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
                   $scope.TopCpt = response.Data;
				   /////////
				   fdmService.compareTopCpt($scope.ymf + 1, $scope.ymt + 1).then(function (response) {

                      $.each(response.Data, function (_i, _d) {
                         console.log(_d);
                         var CptName = _d.CptName
                         var legSeriese = {
                           name: CptName, valueField: 'ScorePerFlight' + '_' + CptName, color: "#bfbfbf", hoverStyle: { color: "#000000" }
                         };
                         $.each(_d.Items, function (_i, _d) {
                            $scope.compareCpt.push({ "YearMonth": _d.YearMonth, ["ScorePerFlight" + "_" + _d.CptName]: _d.ScorePerFlight });
                         });

                          $scope.cptSeries.push(legSeriese);
                      });
					  
					  ///////////////////////////////////
					  fdmService.compareTopRegister($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
                       console.log(response);
                       $.each(response.Data, function (_i, _d) {
                       console.log(_d);
                       var Register = _d.Register
                       var legSeriese = {
                          name: Register, valueField: 'ScorePerFlight' + '_' + Register, color: "#bfbfbf", hoverStyle: { color: "#000000" }
                       };
                       $.each(_d.Items, function (_i, _d) {
 
                          $scope.compareReg.push({ "YearMonth": _d.YearMonth, ["ScorePerFlight" + "_" + _d.Register]: _d.ScorePerFlight });
                    
                        });

                      $scope.regSeries.push(legSeriese);

                     });

                      console.log($scope.compareReg)
					  ////////////////////
					  
					  
					  //////////////////

                     }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
					  
					  /////////////////////////////////

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
				   ///////
				   
				   
                 }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
				 //////
				 
				 
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
			///////


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

       

         

       

       

        
    };
    //////////////////////////////////////////
    // $scope.dt_to = new Date().addDays(0);
    // $scope.dt_from = new Date().addDays(-30);
    //var startDate = new Date(2019, 10, 30);
    //if (startDate > $scope.dt_from)
    //    $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'df',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt',

        }
    };



    $scope.formatDateYYYYMMDD = function (dt) {
        return moment(dt).format('YYYY-MM-DD');
    };
    /////////////// Charts ////////////////

    ///COLORS //////////////
    var lowColor = '#00cc99';
    var medColor = '#ff9933';
    var highColor = '#ff1a1a';
    var scoreColor = '#bfc3c4 ';
    var totalEvent = '#b3b300 ';
    var totalFlight = '#999966 ';
    /////////////////////////

    ///SIZES/////////////////
    $scope.chrt_size = { height: 600, width: $(window).width() - 100 };
    $scope.chrt_sizeXS = { height: 600, width: $(window).width() - 15 };
    $scope.treeChrt_size = { height: 600, width: $(window).width() - 60 };
    $scope.treeChrt_sizeXS = { height: 600, width: $(window).width() };
    $scope.pie_size = { height: 400 };



    $scope.convertYearMonth = function (ym) {

        var yearMonth = String(ym)
        var year = yearMonth.substring(0, 4);
        var month = yearMonth.substring(4);

        $.each(MonthDataSource, function (_i, _d) {
            if (_d.Id == parseInt(month) - 1)
                $scope._title = _d.Title
        });

        return $scope._title + " (" + year + ")";
    }



    $scope.eventsNameChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 100 },
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'IncidentCount', name: 'Events Ccount' },

        ],
        title: 'Events Count',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 10,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            }
        },
        bindingOptions:
        {
            dataSource: 'EventsNameDataNoZero'
        },
    };

    $scope.eventsScoresChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 100 },
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'Scores', name: 'Events Score' },

        ],
        title: 'Events Score',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 10,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            }
        },
        bindingOptions:
        {
            dataSource: 'EventsNameDataNoZero'
        },
    };




    $scope.eventsTreeMap = {
        title: 'Events',
        tooltip: {
            enabled: true,
            // format: 'thousands',
            format: {
                type: "thousands",
                precision: 2
            },
            customizeTooltip(arg) {
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span class='city'>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },

        bindingOptions:
        {
            dataSource: 'ds_eventsNameTree',
            size: 'treeChrt_size'
        },
    };

    $scope.eventsTreeMapXS = {
        title: 'Events',
        tooltip: {
            enabled: true,
            //format: 'thousands',
            format: {
                type: "thousands",
                precision: 2
            },
            customizeTooltip(arg) {
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span class='city'>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },

        bindingOptions:
        {
            dataSource: 'ds_eventsNameTree',
            size: 'treeChrt_sizeXS'
        },
    };



    $scope.totalEventsPie = {
        type: "doughnut",
        //  size: {
        //     height:400,

        //  },
        // palette: 'bright',
        palette: ['#00cc99', '#ff9933', '#ff1a1a'],
        series: [
            {
                argumentField: 'level',
                valueField: 'Count',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },
                    customizeText(arg) {
                        return arg.value;
                    },
                },

            },
        ],
        title: 'Events',
        export: {
            enabled: false,
        },
        onPointClick(e) {
            const point = e.target;

            toggleVisibility(point);
        },
        onLegendClick(e) {
            const arg = e.target;

            toggleVisibility(e.component.getAllSeries()[0].getPointsByArg(arg)[0]);
        },
        legend: {
            //verticalAlignment: 'bottom',
            //horizontalAlignment: 'center',
            verticalAlignment: 'top',
            horizontalAlignment: 'right',
            itemTextPosition: 'right',

        },
        bindingOptions:
        {
            dataSource: 'totalIncidentsPie',
            'size': 'pie_size'
        },
    };

    $scope.totalEventsPieXS = {
        type: "doughnut",
        //  size: {
        //     height:400,

        //  },
        // palette: 'bright',
        palette: ['#00cc99', '#ff9933', '#ff1a1a'],
        series: [
            {
                argumentField: 'level',
                valueField: 'Count',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },
                    customizeText(arg) {
                        return arg.value;
                    },
                },

            },
        ],
        title: 'Events',
        export: {
            enabled: false,
        },
        onPointClick(e) {
            const point = e.target;

            toggleVisibility(point);
        },
        onLegendClick(e) {
            const arg = e.target;

            toggleVisibility(e.component.getAllSeries()[0].getPointsByArg(arg)[0]);
        },
        legend: {
            //verticalAlignment: 'bottom',
            //horizontalAlignment: 'center',
            verticalAlignment: 'top',
            horizontalAlignment: 'right',
            itemTextPosition: 'right',
            visible: false

        },
        bindingOptions:
        {
            dataSource: 'totalIncidentsPie',
            'size': 'pie_size'
        },
    };

    $scope.registerEventsChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        },
        {
            name: 'midPane',

        },
        {
            name: 'bottomPane',

        }
        ],
        series: [
            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Scores', name: 'Score', color: scoreColor, pane: 'topPane', barWidth: 50, type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', barWidth: 50, stack: 'total' },

        ],
        title: 'Scores & Events By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],


        bindingOptions:
        {
            dataSource: 'registerEventData',
            size: 'chrt_size'
        },
    };

    $scope.registerEventsChartXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        },
        {
            name: 'midPane',

        },
        {
            name: 'bottomPane',

        }
        ],
        series: [
            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Scores', name: 'Score', color: scoreColor, pane: 'topPane', barWidth: 50, type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', barWidth: 50, stack: 'total' },

        ],
        title: 'Scores & Events By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],


        bindingOptions:
        {
            dataSource: 'registerEventData',
            size: 'chrt_sizeXS'
        },
    };



    $scope.registerScoresChart = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                precision: 2
            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],

        bindingOptions:
        {
            dataSource: 'registerEventData',
            size: 'chrt_size'
        },
    };

    $scope.registerScoresChartXS = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                precision: 2
            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],
        argumentAxis: {
            tickInterval: 1,
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        bindingOptions:
        {
            dataSource: 'registerEventData',
            size: 'chrt_sizeXS'
        },
    };


    $scope.cptScoresChart = {
        palette: 'Office',

        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventsCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        title: 'Scores & Events By Captain',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],


        bindingOptions:
        {
            dataSource: 'TopCpt',
            size: 'chrt_size'
        },
    };

    $scope.cptScoresChartXS = {
        palette: 'Office',
        //size: { width: $(window).width() - 20},
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventsCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        title: 'Scores & Events By Captain',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 90
            }
        },
        bindingOptions:
        {
            dataSource: 'TopCpt',
            size: 'chrt_sizeXS'
        },
    };


    $scope.topCptEventsChart = {

        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'stackedBar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                //format: {
                //    type: 'fixedPoint',
                //    precision: 0,
                //},
            },
        },
        series: [
            { valueField: 'LowCount', name: 'Low', color: lowColor },
            { valueField: 'MediumCount', name: 'Medium', color: medColor },
            { valueField: 'HighCount', name: 'High', color: highColor },


        ],
        title: 'Events',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        //valueAxis: {
        //    tickInterval: 10,

        //},
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 90
            }
        },
        rotated: true,
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        bindingOptions:
        {
            dataSource: 'TopCpt',
            size: 'chrt_size'
        },
    };

    $scope.eventPerFlightChart = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                precision: 2
            },
        },

        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Captain ',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 90
            }
        },
        bindingOptions:
        {
            dataSource: 'TopCpt',
            size: 'chrt_size'
        },
    };


    $scope.eventPerFlightChartXS = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                precision: 2
            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Captain ',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 90
            }
        },
        bindingOptions:
        {
            dataSource: 'TopCpt',
            size: 'chrt_sizeXS'
        },
    };

    $scope.compareCpt = {
        palette: 'Office',
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
            format: {
                type: "fixedPoint",
                precision: 2
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'spline',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
            point: {
                hoverStyle: {
                    color: "#000000"
                }
            }
        },


        title: 'Scopre Per Flight' + "' " + 'Captain Comparison',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 90,
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);
                },
            }
        },

        valueAxis: {
            tickInterval: 0.1,

        },

        bindingOptions:
        {
            dataSource: 'compareCpt',
            series: 'cptSeries',
            'argumentAxis.categories': 'yearMonth2',
            size: 'chrt_size'
        },
    };


    $scope.compareReg = {
        palette: 'Office',
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
            format: {
                type: "fixedPoint",
                precision: 2
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'spline',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
            point: {
                hoverStyle: {
                    color: "#000000"
                }
            }
        },


        title: 'Score Per Flight' + "' " + 'Register Comparison',
        legend: {
        verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },

    argumentAxis: {
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: 90,
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);
            },
        }
    },

    valueAxis: {
        tickInterval: 10,

    },

    bindingOptions:
    {
        dataSource: 'compareReg',
        series: 'regSeries',
        'argumentAxis.categories': 'yearMonth2',
        size: 'chrt_size'
    },
    };

$scope.compareCptXS = {
    palette: 'Office',
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
        format: {
            type: "fixedPoint",
            precision: 2
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        type: 'spline',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,

        },
        point: {
            hoverStyle: {
                color: "#000000"
            }
        }
    },


    title: 'Scopre Per Flight' + "' " + 'Captain Comparison',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },

    argumentAxis: {
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: 90,
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);
            },
        }
    },

    valueAxis: {
        tickInterval: 10,

    },

    bindingOptions:
    {
        dataSource: 'compareCpt',
        series: 'cptSeries',
        'argumentAxis.categories': 'yearMonth2',
        size: 'chrt_sizeXS'
    },
};


$scope.compareRegXS = {
    palette: 'Office',
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
        format: {
            type: "fixedPoint",
            precision: 2
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        type: 'spline',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,

        },
        point: {
            hoverStyle: {
                color: "#000000"
            }
        }
    },


    title: 'Score Per Flight' + "' " + 'Register Comparison',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },

    argumentAxis: {
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: 90,
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);
            },
        }
    },

    valueAxis: {
        tickInterval: 10,

    },

    bindingOptions:
    {
        dataSource: 'compareReg',
        series: 'regSeries',
        'argumentAxis.categories': 'yearMonth2',
        size: 'chrt_sizeXS'
    },
};


$scope.eventsDailyChart = {
    // size: { height: 650, width: $(window).width() - 100 },
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'FlightDate',
        type: 'spline',

    },
    panes: [{
        name: 'topPane',
    },

    {
        name: 'bottomPane',
    }],


    series: [
        { valueField: 'EventsCount', name: 'Total', pane: 'topPane' },
        { valueField: 'HighLevelCount', name: 'High', color: highColor, pane: 'bottomPane' },
        { valueField: 'MediumLevelCount', name: 'Medium', color: medColor, pane: 'bottomPane' },
        { valueField: 'LowLevelCount', name: 'Low', color: lowColor, pane: 'bottomPane' },

    ],
    title: 'Daily Events',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [{
        pane: 'topPane',
        grid: {
            visible: true,
        },
        title: {
            text: 'Count',
        },
    },

    {
        pane: 'bottomPane',
        grid: {
            visible: true,
        },
        title: {
            text: ' ',
        },
    }],
    argumentAxis: { // or valueAxis, or commonAxisSettings
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: -45,
            customizeText: function () {

                return $scope.formatDateYYYYMMDD(this.value);


            }
        }
    },
    bindingOptions:
    {
        dataSource: 'eventsDailyData',
        size: 'chrt_size'
    },
};

$scope.eventsMonthlyChart = {
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        label: {
            visible: false,
        },

    },
    panes: [{
        name: 'topPane',

    },
    {
        name: 'midPane',

    },
    {
        name: 'bottomPane',

    }
    ],
    series: [

        { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'spline', stack: 'total' },
        { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
        { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'EventsCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'spline', stack: 'total' },



    ],
    title: 'Monthly Events',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [
        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores',
            },
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Flights',
            },
        },

        {
            height: '80%',
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Events',
            },
        }],

    argumentAxis: { // or valueAxis, or commonAxisSettings
        tickInterval: 1,
        label: {
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);

            },
        }

    },

    bindingOptions:
    {
        dataSource: 'monthlyDataChart',
        size: 'chrt_size'
    },
};

$scope.eventsMonthlyChartXS = {
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        label: {
            visible: false,
        },

    },
    panes: [{
        name: 'topPane',

    },
    {
        name: 'midPane',

    },
    {
        name: 'bottomPane',

    }
    ],
    series: [

        { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'spline', stack: 'total' },
        { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
        { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'EventsCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'spline', stack: 'total' },

    ],
    title: 'Monthly Events',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [
        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores',
            },
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Flights',
            },
        },

        {
            height: '80%',
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Events',
            },
        }],

    argumentAxis: { // or valueAxis, or commonAxisSettings
        tickInterval: 1,
        label: {
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);

            },
        }
    },

    bindingOptions:
    {
        dataSource: 'monthlyDataChart',
        size: 'chrt_sizeXS'
    },
};

$scope.scoresMonthlyChart = {
    palette: 'Vintage',
    tooltip: {
        enabled: true,
        location: 'edge',
        format: {
            type: "fixedPoint",
            precision: 2
        },
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,
            precision: 2
        },
    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },
    {
        name: 'bottomPane',
    }],
    series: [
        { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
        { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
        { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

    ],
    title: 'Events & Scores per Flight By Month ',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: {
        tickInterval: 0.1,

    },
    valueAxis: [

        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Score Per Event',
            },

            //constantLines: [{
            //    value: 1.5,
            //    color: '#fc3535',
            //    dashStyle: 'dash',
            //    width: 2,
            //    label: { visible: false },
            //    //bindingOptions:
            //    //{
            //    //    value: 'cptAverage'
            //    //},
            //}],
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Event Per Flight',
            },
        },

        {
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores Per Flight',
            },
        },




    ],
    argumentAxis: {
        tickInterval: 1,
        label: {
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);

            },
        }
    },
    bindingOptions:
    {
        dataSource: 'monthlyDataChart',
        size: 'chrt_size'
    },
};



$scope.scoresMonthlyChartXS = {
    palette: 'Vintage',
    tooltip: {
        enabled: true,
        location: 'edge',
        format: {
            type: "fixedPoint",
            precision: 2
        },
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'YearMonth',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,
            precision: 2
        },
    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },
    {
        name: 'bottomPane',
    }],
    series: [
        { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
        { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
        { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

    ],
    title: 'Events & Scores per Flight By Month ',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [

        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Score Per Event',
            },

            //constantLines: [{
            //    value: 1.5,
            //    color: '#fc3535',
            //    dashStyle: 'dash',
            //    width: 2,
            //    label: { visible: false },
            //    //bindingOptions:
            //    //{
            //    //    value: 'cptAverage'
            //    //},
            //}],
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Event Per Flight',
            },
        },

        {
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores Per Flight',
            },
        },




    ],
    argumentAxis: {
        tickInterval: 1,
        label: {
            customizeText: function (d) {
                return $scope.convertYearMonth(this.value);

            },
        }
    },
    bindingOptions:
    {
        dataSource: 'monthlyDataChart',
        size: 'chrt_sizeXS'
    },
};

$scope.cptRouteChart = {
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'Route',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',

    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },

    {
        name: 'bottomPane',
    }],

    series: [

        { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
        { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
        { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

    ],

    title: 'Scores & Events By Route',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [
        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores',
            },
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Flights',
            },
        },

        {
            height: '80%',
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Events',
            },
        }],
    argumentAxis: { // or valueAxis, or commonAxisSettings
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: -90,

        }

    },

    bindingOptions:
    {
        dataSource: 'ds_cptRoute',
        size: 'chrt_size'
    },
};

$scope.cptRouteChartXS = {
    tooltip: {
        enabled: true,
        location: 'edge',
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'Route',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',

    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },

    {
        name: 'bottomPane',
    }],

    series: [

        { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
        { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
        { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
        { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

    ],

    title: 'Scores & Events By Route',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [
        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores',
            },
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Flights',
            },
        },

        {
            height: '80%',
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Events',
            },
        }],
    argumentAxis: { // or valueAxis, or commonAxisSettings
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: -90,

        }

    },


    bindingOptions:
    {
        dataSource: 'ds_cptRoute',
        size: 'chrt_sizeXS'
    },
};

$scope.eventPerFlightRoute = {
    palette: 'Vintage',
    tooltip: {
        enabled: true,
        location: 'edge',
        format: {
            type: "fixedPoint",
            precision: 2
        },
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'Route',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,
            precision: 2
        },
    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },
    {
        name: 'bottomPane',
    }],
    series: [
        { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
        { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
        { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

    ],
    title: 'Events & Scores per Flight By Route ',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [

        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Score Per Event',
            },

            //constantLines: [{
            //    value: 1.5,
            //    color: '#fc3535',
            //    dashStyle: 'dash',
            //    width: 2,
            //    label: { visible: false },
            //    //bindingOptions:
            //    //{
            //    //    value: 'cptAverage'
            //    //},
            //}],
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Event Per Flight',
            },
        },

        {
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores Per Flight',
            },
        },




    ],
    argumentAxis: {
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: -90
        }
    },
    bindingOptions:
    {
        dataSource: 'ds_cptRoute',
        size: 'chrt_size'
    },
};

$scope.eventPerFlightRouteXS = {
    palette: 'Vintage',
    tooltip: {
        enabled: true,
        location: 'edge',
        format: {
            type: "fixedPoint",
            precision: 2
        },
        customizeTooltip(arg) {
            return {
                text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
            };
        },
    },
    commonSeriesSettings: {
        argumentField: 'Route',
        type: 'bar',
        hoverMode: 'allArgumentPoints',
        selectionMode: 'allArgumentPoints',
        label: {
            visible: false,

        },
    },
    panes: [{
        name: 'topPane',
    },
    {
        name: 'midPane',
    },
    {
        name: 'bottomPane',
    }],
    series: [
        { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
        { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
        { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

    ],
    title: 'Events & Scores per Flight By Route ',
    legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
    },
    export: {
        enabled: true,
    },
    onPointClick(e) {
        e.target.select();
    },
    valueAxis: [

        {
            pane: 'topPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Score Per Event',
            },

            //constantLines: [{
            //    value: 1.5,
            //    color: '#fc3535',
            //    dashStyle: 'dash',
            //    width: 2,
            //    label: { visible: false },
            //    //bindingOptions:
            //    //{
            //    //    value: 'cptAverage'
            //    //},
            //}],
        },

        {
            pane: 'midPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Event Per Flight',
            },
        },

        {
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores Per Flight',
            },
        },




    ],
    argumentAxis: {
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: -90
        }
    },
    bindingOptions:
    {
        dataSource: 'ds_cptRoute',
        size: 'chrt_sizeXS'
    },
};




////////////////// scroll ////////////////


//$scope.scroll_1 = {
//    scrollByContent: true,
//    scrollByThumb: true,
//};
$scope.rightHeight = $(window).height() - 114;
$scope.scroll_1 = {
    width: '100%',
    bounceEnabled: false,
    showScrollbar: 'never',
    pulledDownText: '',
    pullingDownText: '',
    useNative: true,
    refreshingText: 'Updating...',
    onPullDown: function (options) {

        options.component.release();

    },
    onInitialized: function (e) {


    },
    bindingOptions: {
        height: 'rightHeight'
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
$scope.showEvents = function () {
    $scope.formatDateYYYYMMDD(this.value);
    $scope.formatDateYYYYMMDD(this.value);
    $scope.getEventsByDate($scope.df, $scope.dt, function () { $scope.popup_visible = true; });

};

//////////////////////////////////
$scope.dg_events_columns = [
    //{
    //    cellTemplate: function (container, options) {
    //        $("<div style='text-align:center'/>")
    //            .html(options.rowIndex + 1)
    //            .appendTo(container);
    //    }, name: 'row', caption: '#', barWidth: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
    //}, 
    { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },

    { dataField: 'StateName', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
    { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
    { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

    { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 115 },
    { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 115 },

    { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
    { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
    { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

    { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    { dataField: 'EventName', caption: 'Even tName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350 },
    // { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 115,  },
    // { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 115,  },



    { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
    { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
    { dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
    { dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
    { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
    { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },

];
$scope.dg_events_selected = null;
$scope.dg_events_instance = null;
$scope.dg_events_ds = null;

$scope.dg_events = {
    wordWrapEnabled: true,
    rowAlternationEnabled: false,
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
    selection: { mode: 'multiple' },

    columnAutoWidth: false,


    columns: [],
    onContentReady: function (e) {
        if (!$scope.dg_events_instance)
            $scope.dg_events_instance = e.component;

    },
    onSelectionChanged: function (e) {
        //var data = e.selectedRowsData[0];

        //if (!data) {
        //    $scope.dg_master_selected = null;
        //}
        //else
        //    $scope.dg_master_selected = data;


    },

    "export": {
        enabled: true,
        fileName: "File",
        allowExportSelectedData: false
    },

    onToolbarPreparing: function (e) {
        var dataGrid = e.component;

        e.toolbarOptions.items.unshift(
            {
                location: "before",
                template: "titleTemplate"
            },

        );
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
        if (e.data && e.data.Severity && e.data.Severity == 'High') e.rowElement.css('background', '#ff8566');
        if (e.data && e.data.Severity && e.data.Severity == 'Medium') e.rowElement.css('background', '#ffd480');
        //  e.rowElement.css('background', '#ffccff');

    },

    onCellPrepared: function (options) {
        var data = options.data;
        var column = options.column;
        var fieldHtml = "";

        if (data && options.value && column.caption == 'Current') {
            fieldHtml += "<span style='font-weight:bold'>" + options.value + "</span>";
            options.cellElement.html(fieldHtml);
        }
        if (data && options.value && column.caption == 'Delayed') {
            fieldHtml += "<span style='color:#cc5200'>" + options.value + "</span>";
            options.cellElement.html(fieldHtml);
        }
        if (data && options.value && column.dataField.includes('Diff')) {
            var cls = options.value <= 0 ? 'pos' : 'neg';
            fieldHtml += "<div class='" + cls + "'>"
                + "<span style='font-size:12px'>" + options.value + "%" + "</span>"
                + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
                + "</div>";
            options.cellElement.html(fieldHtml);
        }



    },
    columns: $scope.dg_events_columns,

    bindingOptions: {
        "dataSource": "dg_events_ds",
        "height": "dg_height",
        //columns: 'dg_monthly_columns',
    },
    //keyExpr: ['Year', 'Month', 'Airport'],
    columnChooser: {
        enabled: false
    },

};
///////////////////////////////////

$scope.getEventsByDate = function (df, dt, callback) {
    $scope.date_from = $scope.formatDateYYYYMMDD(df);
    $scope.date_to = $scope.formatDateYYYYMMDD(dt);
    $scope.p1Id = -1;
    $scope.regId = -1;
    $scope.typeId = -1;

    fdmService.getAllFDM($scope.p1Id, $scope.regId, $scope.typeId, $scope.date_from, $scope.date_to).then(function (response) {
        $scope.dg_events_ds = response.Result.Data;
        if (callback) callback();
    });
}


$scope.popup_visible = false;
$scope.popup_title = 'Events';
$scope.popup_instance = null;
$scope.popup = {

    fullScreen: true,
    showTitle: true,

    toolbarItems: [

        {
            widget: 'dxButton', location: 'after', options: {
                type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                    //  $scope.dg_monthly2_instance.refresh();
                    $scope.popup_visible = false;
                }
            }, toolbar: 'bottom'
        }
    ],

    visible: false,
    dragEnabled: true,
    closeOnOutsideClick: false,
    onShowing: function (e) {
        $scope.popup_instance.repaint();

        $scope.dg_height = $(window).height() - 170;

    },
    onShown: function (e) {
        // $scope.bindMaster();

        if ($scope.dg_events_instance)
            $scope.dg_events_instance.refresh();


    },
    onHiding: function () {
        //$scope.dg_master_ds = [];

        $scope.popup_visible = false;

    },
    onContentReady: function (e) {
        if (!$scope.popup_instance)
            $scope.popup_instance = e.component;

    },

    bindingOptions: {
        visible: 'popup_visible',

        title: 'popup_title',

    }
};


////////////////////////
$scope.monthConvert = function (monthNo) {
    $.each(MonthDataSource, function (_i, _d) {
        if (_d.Id == monthNo - 1)
            $scope._title = _d.Title
    });

    return $scope._title;

}

///////////////////////////////////

if (!authService.isAuthorized()) {

    authService.redirectToLogin();
}
else {
    $rootScope.page_title = '> FDM Dashboard';


    $('.fdmDashboard').fadeIn(400, function () {

    });
}

//$scope.bind();
var appWindow = angular.element($window);
appWindow.bind('resize', function () {
    $scope.rightHeight = $(window).height() - 114;
});


$scope.$on('$viewContentLoaded', function () {
    setTimeout(function () {
        $scope.bind();
    }, 1500);
});




}]);