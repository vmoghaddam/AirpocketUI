'use strict';
app.controller('fdmRegMonthlyController', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, flightService, fdmService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    var lowColor = '#0099cc';
    var medColor = '#ffcc66';
    var highColor = '#ff1a1a';
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


            if ($scope.reg != null)
                $scope.bind();
            else
                alert("Select a register")

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

                    //console.log(new Date(unix));
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


    //$scope.df = "2021-01-01";
    //$scope.dt = "2021-09-30";


    $scope.isContentVisible = false;
    $scope.bind = function () {


        $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
        $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
        $scope.ymf = parseInt($scope.ymf);
        $scope.ymt = parseInt($scope.ymt);

        $scope.isContentVisible = true;

        fdmService.getFDMRegMonthly($scope.ymf, $scope.ymt, $scope.reg).then(function (response) {
            $scope.ds_regEventsMonthly = response.Data.data;
            $scope.ds_regEventsMonthlyGeneral = response.Data;

            console.log(response)

            $.each($scope.ds_regEventsDaily, function (i, d) {

                d.AVG = $scope.ds_regEventsGeneral.AverageScores;

            })
            $scope.ds_regTotalEvents = [{ level: 'Low', Count: response.Data.TotalLowLevel }, { level: 'High', Count: response.Data.TotalHighLevel }, { level: 'Medium', Count: response.Data.TotalMediumLevel }];

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        fdmService.getFDMRegCptMonthly($scope.ymf, $scope.ymt, $scope.reg).then(function (response) {
            console.log(response);
            $scope.ds_regCprEventsMonthly = response.Data;
            console.log($scope.ds_regCprEventsMonthly);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        fdmService.getRegEventsMonthly($scope.ymf, $scope.ymt, $scope.reg).then(function (response) {
            $scope.ds_regEventsNameMonthly = response.Data;
            $scope.arr = [];
            $.each($scope.ds_regEventsNameMonthly, function (_i, _d) {
                $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
            });


            $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };
    //////////////////////////////////////////
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

    var registers = [
        { Id: 0, Title: 'KPA', },
        { Id: 1, Title: 'KPB', },
        { Id: 2, Title: 'CPU', },
        { Id: 3, Title: 'CPD', },
        { Id: 4, Title: 'CPX', },
        { Id: 5, Title: 'CAR', },
        { Id: 6, Title: 'CAP', },
        { Id: 7, Title: 'CAS', },
        { Id: 8, Title: 'CPV', }
    ]

    $scope.reg = null;

    $scope.sb_reg = {
        placeholder: 'Register',
        searchEnabled: false,
        showClearButton: false,
        dataSource: registers,
        displayExpr: 'Title',
        valueExpr: 'Title',
        bindingOptions: {
            value: 'reg',
        }
    }

    $scope.getEventsPerFlightTotal = function () {
        //{{ds_foEventsMonthlyGeneral.TotalEvent * 1.0 / ds_foEventsMonthlyGeneral.TotalFilght.toFixed(2)}}
        if (!$scope.ds_regEventsMonthlyGeneral)
            return 0;
        if (!$scope.ds_regEventsMonthlyGeneral.TotalEvent)
            return 0;
        if (!$scope.ds_regEventsMonthlyGeneral.TotalFilght)
            return 0;
        return ($scope.ds_regEventsMonthlyGeneral.TotalEvent * 1.0 / $scope.ds_regEventsMonthlyGeneral.TotalFilght).toFixed(2);


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
    ///SIZES/////////////////
    $scope.chrt_size = { height: 600, width: $(window).width() - 100 };
    $scope.chrt_sizeXS = { height: 600, width: $(window).width() - 15 };
    $scope.treeChrt_size = { height: 600, width: $(window).width() - 60 };
    $scope.treeChrt_sizeXS = { height: 600, width: $(window).width() };
    $scope.pie_size = { height: 400 };


    $scope.formatDateYYYYMMDD = function (dt) {
        return moment(dt).format('YYYY-MM-DD');
    };

    $scope.monthConvert = function (monthNo) {
        $.each(MonthDataSource, function (_i, _d) {
            if (_d.Id == monthNo - 1)
                $scope._title = _d.Title
        });

        return $scope._title;

    }

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
            dataSource: 'ds_regEventsMonthly',
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
            dataSource: 'ds_regEventsMonthly',
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
            dataSource: 'ds_regEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };


    $scope.regEventsMonthlyChart = {
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
            argumentField: 'Month',
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
        title: 'Scores & Events By Month',
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
            tickInterval: 1,
            label: {
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);

                },
            }
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
            dataSource: 'ds_regEventsMonthly',
            size: 'chrt_size'
        },
        
    };

    $scope.eventsChart = {
        type: "doughnut",
        
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
            dataSource: 'ds_regTotalEvents',
            'size': 'pie_size'
        },

      
    };

    $scope.scoresChart = {
        size: { height: 700, width: $(window).width() - 60 },
        palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'Month',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'middlePane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePercentage', name: 'Scores/Flights', pane: 'topPane', barWidth: 50 },
            { valueField: 'Scores', name: 'Scores', pane: 'middlePane', barWidth: 50 },
            { valueField: 'FlightCount', name: 'Flights', pane: 'bottomPane', barWidth: 50 },
            { valueField: 'AVG', pane: 'middlePane', type: 'spline', },
        ],
        title: 'Scores',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
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
                text: 'Scores/Flights',
            },
        },
        {
            pane: 'middlePane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Scores',
            },
        },
        {
            pane: 'bottomPane',
            grid: {
                visible: true,
            },
            title: {
                text: 'Flights',
            },
        }],

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
            dataSource: 'ds_regEventsMonthly'
        },
    };

    $scope.cptEventsCountChart = {
        size: { height: 700, width: $(window).width() - 60 },
        palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'CptCode',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },

        series: [
            { valueField: 'EventCount', name: 'EventCount', barWidth: 50 },
        ],

        title: 'CPT Events/Reg',
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
            grid: {
                visible: true,
            },
        }],

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 0,

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_regCprEventsMonthly'
        },
    };

    $scope.cptScoresChart = {
        size: { height: 700, width: $(window).width() - 60 },
        palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'CptCode',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },

        series: [
            { valueField: 'Scores', name: 'Scores', barWidth: 50 },
        ],

        title: 'CPT Scores/Reg',
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
            grid: {
                visible: true,
            },
        }],

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 0,

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_regCprEventsMonthly'
        },
    };

    $scope.cptFlightCountChart = {
        size: { height: 700, width: $(window).width() - 60 },
        palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'CptCode',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },

        series: [
            { valueField: 'FlightCount', name: 'FlightCount', barWidth: 50 },
        ],

        title: 'CPT Flights/Reg',
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
            grid: {
                visible: true,
            },
        }],

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 0,

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_regCprEventsMonthly'
        },
    };

    $scope.cptSctFltChart = {
        size: { height: 700, width: $(window).width() - 60 },
        palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'CptCode',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },

        series: [
            { valueField: 'ScorePercentage', name: 'Score/Flight', barWidth: 50 },
        ],

        title: 'CPT Scores/Flights',
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
            grid: {
                visible: true,
            },
        }],

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 0,

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_regCprEventsMonthly'
        },
    };

    $scope.eventsCountChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 60 },
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
            { valueField: 'EventCount', name: 'Events Count', barWidth: 50 },

        ],
        title: 'Events Count',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

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
            dataSource: 'ds_regEventsNameMonthly'
        },
    };

    $scope.eventsScoreChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 60 },
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
            { valueField: 'Scores', name: 'Events Count', barWidth: 50 },

        ],
        title: 'Events Scores',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

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
            dataSource: 'ds_regEventsNameMonthly'
        },
    };


    $scope.eventsTreeMap = {
        title: 'Events',
        size: { height: 600, width: $(window).width() - 63 },

        tooltip: {
            enabled: true,
            format: 'thousands',
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
            dataSource: 'ds_eventsNameTree'
        },
    };




    ////////////////// scroll ////////////////


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




    //$scope.bindRegData = function (reg) {
    //    $scope.reg = reg;
    //    $scope.bind();
    //}


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

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> FDM Dashboard Capitan monthly';


        $('.fdmFoDashboardMonthly').fadeIn(400, function () {

        });
    }





}]);