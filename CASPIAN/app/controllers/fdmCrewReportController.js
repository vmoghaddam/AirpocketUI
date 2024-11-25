'use strict';
app.controller('fdmCrewReportController', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, flightService, fdmService, aircraftService, authService, notificationService, $route) {
    var lowColor = '#0099cc';
    var medColor = '#ffcc66';
    var highColor = '#ff1a1a';

    $scope._crewId = $routeParams.crewId

    $scope.clearPopup = function () {
        $scope.isGround = false;
        $scope.isTraining = false;
    }

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            $scope._crewId = $routeParams.crewId;

            $scope.df = new Date();
            $scope.dt = new Date();
            $scope.df.setFullYear($scope.yf, $scope.mf, 1);
            $scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
            $scope.dt = $scope.dt.toISOString().split('T')[0];
            $scope.df = $scope.df.toISOString().split('T')[0];
            $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
            $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
            $scope.ymf = parseInt($scope.ymf);
            $scope.ymt = parseInt($scope.ymt);
            console.log($scope.ymf);
            console.log($scope.dt, $scope.df);

            if ($scope._crewId != null)
                $scope.bind();
            else
                alert("Select a Cpt")

        }
    };

   



    $scope.btn_FDMEvents = {
        text: 'Events',
        type: 'success',
        width: 120,
        onClick: function (e) {
            $scope.df = new Date();
            $scope.dt = new Date();
            $scope.df.setFullYear($scope.yf, $scope.mf, 1);
            $scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
            $scope.dt = $scope.dt.toISOString().split('T')[0];
            $scope.df = $scope.df.toISOString().split('T')[0];


            fdmService.getCptFDMInfo($scope.df, $scope.dt, $scope._crewId).then(function (response) {

                $scope.popup_fdm_visible = true;
                $scope.dg_events_ds = response.Data;
            });
        }

    };


    $scope.popup_fdm_visible = false;
    $scope.popup_fdm = {
        title: "FDM Events",
        fullScreen: true,
        show_Title: true,
        visible: false,
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_fdm_visible',
        }
    }
 

    /////////////////////////////////////////


    $scope.isContentVisible = false;
    $scope.bind = function () {
		 $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
            $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
            $scope.ymf = parseInt($scope.ymf);
            $scope.ymt = parseInt($scope.ymt);
        $scope.isContentVisible = true;

        if ($scope._jobGroup == 'p2') {
            $scope.isCPT = false;

            fdmService.getFoEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptEventsMonthly = response.Data;
                $scope.arr = [];
                $.each($scope.ds_cptEventsMonthly, function (_i, _d) {
                    $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
                });
                $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getFDMFoMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptMonthly = response.Data.data;
                $scope.ds_cptTotalEvents = [{ level: 'Low', Count: response.Data.TotalLowLevel }, { level: 'Medium', Count: response.Data.TotalMediumLevel }, { level: 'High', Count: response.Data.TotalHighLevel }];

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getFDMFoRegMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptRegEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptPhaseMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptPhaseScore = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        } else {
            $scope.isCPT = true;

            fdmService.getCptEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptEventsMonthly = response.Data;

                $scope.arr = [];
                $.each($scope.ds_cptEventsMonthly, function (_i, _d) {
                    $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
                });

                $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptMonthly = response.Data.data;
                $scope.ds_cptTotalEvents = [{ level: 'Low', Count: response.Data.TotalLowLevel }, { level: 'Medium', Count: response.Data.TotalMediumLevel }, { level: 'High', Count: response.Data.TotalHighLevel }];
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptFoEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptFoEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptIpEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptIpEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getIpCptEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_ipCptEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptRegEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptRegEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptPhaseMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptPhaseScore = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
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


    //$scope.yt = $rootScope.yt;
    //$scope.yf = $rootScope.yf;
    //$scope.mt = $rootScope.mt;
    //$scope.mf = $rootScope.mf;

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


    //$scope.sb_crew_selected = null;
    //$scope.sb_cpt = {
    //    placeholder: 'Captian',
    //    showClearButton: false,
    //    searchEnabled: false,
    //    width: 200,
    //    displayExpr: 'Title',
    //    valueExpr: 'Id',
    //    onSelectionChanged: function (arg) {

    //    },

    //    bindingOptions: {
    //        value: 'sb_crew_index',
    //        dataSource: 'ds_crew',
    //    }
    //};






    /////////////// Charts ////////////////






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

    $scope.typeLineChart = {
        palette: [lowColor, medColor, highColor],
        size: { height: 600, width: $(window).width() - 70 },
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
            type: 'spline',

        },
        series: [

            { valueField: 'LowCount', name: 'Low' },
            { valueField: 'MediumCount', name: 'Medium' },
            { valueField: 'HighCount', name: 'High' },

        ],

        title: 'Events By Type',
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

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            },
            //overlappingBehavior: "rotate",
            tickInterval: 1,
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptMonthly'
        },
    };

    $scope.typeScoreChart = {
        size: { height: 650, width: $(window).width() - 70 },
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
            type: 'stackedbar',

        },

        palette: [lowColor, medColor, highColor],


        series: [

            { valueField: 'LowScore', name: 'Low', barWidth: 50 },
            { valueField: 'MediumScore', name: 'Medium', barWidth: 50 },
            { valueField: 'HighScore', name: 'High', barWidth: 50 },


        ],
        title: 'Scores By Type',
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
            grid: {
                visible: true,
            },
            tickInterval: 1,
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
            dataSource: 'ds_cptMonthly'
        },

    }



    $scope.cptEventsDailyChart = {
        size: { height: 650, width: $(window).width() - 70 },
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
            type: 'stackedbar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            //label: {
            //    visible: false,
            //    format: {
            //        type: 'fixedPoint',
            //        precision: 0,
            //    },
            //},
        },

        palette: 'bright',


        series: [

            { valueField: 'SelfResponse', name: 'Self Response', color: lowColor, barWidth: 50 },
            { valueField: 'OtherResponse', name: 'Other Response', color: medColor, barWidth: 50 },


        ],
        title: 'Events',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            tickInterval: 1,
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
            dataSource: 'ds_cptMonthly'
        },
    };


    $scope.regCptEventsChart = {
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'Register',
            type: 'bar',

        },
        series: [

            { valueField: 'LowLevelCount', name: 'Low', color: lowColor, barWidth: 50 },
            { valueField: 'MediumLevelCount', name: 'Medium', color: medColor, barWidth: 50 },
            { valueField: 'HighLevelCount', name: 'High', color: highColor, barWidth: 50 },

        ],

        palette: 'bright',

        title: 'By Register',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptRegEventsMonthly'
        },
    };

    $scope.cptFoEventsChart = {
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'P2Name',
            type: 'bar',

        },
        series: [

            { valueField: 'LowCount', name: 'Low', color: lowColor, barWidth: 50 },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, barWidth: 50 },

        ],

        palette: 'bright',

        title: 'By FO/CPT',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            tickInterval: 1,
        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptFoEventsMonthly'
        },
    };

    $scope.cptNotResEventsChart = {
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'IpName',
            type: 'bar',

        },
        series: [

            { valueField: 'LowCount', name: 'Low', color: lowColor, barWidth: 50 },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, barWidth: 50 },

        ],

        palette: 'bright',

        title: 'By IP/CPT',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptIpEventsMonthly'
        },
    };

    $scope.cptIpEventsChart = {
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'P1Name',
            type: 'bar',

        },
        series: [

            { valueField: 'LowCount', name: 'Low', color: lowColor, barWidth: 50 },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, barWidth: 50 },

        ],

        palette: 'bright',

        title: 'By CPT/IP',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_ipCptEventsMonthly'
        },
    };



    $scope.typeChart = {

        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 600, width: 600 },

        title: 'Event By Type',

        series: {
            argumentField: 'level',
            valueField: 'Count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


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

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptTotalEvents'
        },
    };

    $scope.phaseChart = {
        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 600, width: 600 },

        title: 'Score By Phase',

        series: {
            argumentField: 'Phase',
            valueField: 'Score',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


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

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],
        bindingOptions:
        {
            dataSource: 'ds_cptPhaseScore'
        },
    };

    $scope.eventsNameChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'EventName',
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
            dataSource: 'ds_cptEventsMonthly'
        },
    };


    $scope.eventsScoreChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 70 },
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
            { valueField: 'Scores', name: 'Events Score', barWidth: 50 },

        ],
        title: 'Events Score',
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
            dataSource: 'ds_cptEventsMonthly'
        },
    };








    $scope.scoresChart = {
        size: { height: 700, width: $(window).width() - 70 },
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
            { valueField: 'FaultPercentagePerFlight', name: 'Scores/Flights', pane: 'topPane', barWidth: 50 },
            { valueField: 'Score', name: 'Scores', pane: 'middlePane', barWidth: 50 },
            { valueField: 'FlightCount', name: 'Flights', pane: 'bottomPane', barWidth: 50 },
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
            tickInterval: 1,
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
            dataSource: 'ds_cptMonthly'
        },
    };


    $scope.eventsTreeMap = {
        title: 'Events',
        size: { height: 600, width: $(window).width() - 70 },

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


    $scope.rightHeight = $(window).height() - 100;
    $scope.fdm_scroll = {
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


    ///////////////////crew //////////////////



    $scope.bindCrew = function () {
        var _dt = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;

        flightService.getCrewForRosterByDate(1, _dt).then(function (response) {
            $scope.loadingVisible = false;
            var _ds = Enumerable.From(response).Where(function (x) { return ['TRI', 'TRE', 'P1', 'P2'].indexOf(x.JobGroup) != -1; }).ToArray();

            $scope.ds_crew = []
            $.each(_ds, function (_i, _d) {

                $scope.ds_crew.push({ Id: _i, Title: _d.LastName + " (" + (_d.JobGroup) + ")", crewId: _d.Id, JobGroup: _d.JobGroup })
            });

            console.log($routeParams.crewId);
            

            if ($routeParams.crewId) {
                $scope._crewId = $routeParams.crewId;

      

                $.each($scope.ds_crew, function (_i, _d) {
                    if (_d.crewId == $routeParams.crewId)
                        $scope.sb_crew_index = _d.Id;

                });

                $scope.bind();

            }
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };


    ///////////////////Data Grid///////////////////
    $scope.dg_fdmEvents_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'PF', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'IPCode', caption: 'IPCode', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P1Code', caption: 'P1Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P2Code', caption: 'P2Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Critical', caption: 'Critical', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Major', caption: 'Major', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Minor', caption: 'Minor', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'AircraftType', caption: 'AircraftType', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

    ];
    $scope.dg_fdmEvents_selected = null;
    $scope.dg_fdmEvents_instance = null;
    $scope.dg_fdmEvents = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'Single' },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: {
            visible: true,
            showOperationChooser: true,
        },

        columnAutoWidth: false,
        height: $(window).height() - 100,
        onContentReady: function (e) {
            if (!$scope.dg_fdmEvents_instance)
                $scope.dg_fdmEvents_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fdmEvents_selected = null;
            }
            else
                $scope.dg_fdmEvents_selected = data;


        },

        columns: $scope.dg_fdmEvents_columns,
        bindingOptions: {
            dataSource: 'dg_events_ds',
        }
    }



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


        $('.fdmDashboardPilot').fadeIn(400, function () {

        });
    }

    $scope.bind();


}]);