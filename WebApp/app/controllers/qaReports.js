'use strict';
app.controller('qaReports', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'qaService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($http, $scope, $location, $routeParams, $rootScope, flightService, qaService, aircraftService, authService, notificationService, $route, $window) {




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



        qaService.getCateringReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.arr = [];

            $.each(response.Data, function (_i, _d) {
                $scope.arr.push({ name: _d.ReasonTitle, value: _d.Count });
            });

            $scope.ds_cateringReportTree = [{ name: 'CateringReport', items: $scope.arr }];
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getGroundReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.arr = [];

            $.each(response.Data, function (_i, _d) {
                $scope.arr.push({ name: _d.DamageByTitle, value: _d.Count });
            });

            $scope.ds_groundReportTree = [{ name: 'DamageReport', items: $scope.arr }];
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getSecurityReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.arr = [];

            $.each(response.Data, function (_i, _d) {
                $scope.arr.push({ name: _d.ReasonTitle, value: _d.Count });
            });

            $scope.ds_securityReportTree = [{ name: 'SecurityReport', items: $scope.arr }];
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        qaService.getCabinReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            console.log("Cabin Safety Report",response);

            $scope.ds_cabinReport = response.Data;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getMaintenanceReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            console.log(response);

            $scope.ds_maintenanceReport = response.Data;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

         qaService.getMaintenanceRegReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            console.log(response);

            $scope.ds_maintenanceRegReport = response.Data;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getDispatchReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            console.log(response);

            $scope.ds_dispatchReport = response.Data;
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







    $scope.qaCateringTreeMap = {
        title: 'Catering By Reason',
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
            dataSource: 'ds_cateringReportTree',
            size: 'treeChrt_size'
        },
    };


    $scope.qaCateringTreeMapXS = {
        title: 'Catering By Reason',
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
            dataSource: 'ds_cateringReportTree',
            size: 'treeChrt_sizeXS'
        },
    };

    $scope.qaGroundTreeMap = {
        title: 'Ground By Damage',
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
            dataSource: 'ds_groundReportTree',
            size: 'treeChrt_size'
        },
    };


    $scope.qaGroundTreeMapXS = {
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
            dataSource: 'ds_groundReportTree',
            size: 'treeChrt_sizeXS'
        },
    };


    $scope.qaSecurityTreeMap = {
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
            dataSource: 'ds_securityReportTree',
            size: 'treeChrt_size'
        },
    };


    $scope.qaSecurityTreeMapXS = {
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
            dataSource: 'ds_securityReportTree',
            size: 'treeChrt_sizeXS'
        },
    };


    $scope.qaCSRChart = {
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

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report',
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
                    text: 'Report Counts',
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
            dataSource: 'ds_cabinReport',
            size: 'chrt_size'
        },
    };

    $scope.qaCSRChartXS = {
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
        //panes: [{
        //    name: 'topPane',

        //},
        //{
        //    name: 'midPane',

        //},
        //{
        //    name: 'bottomPane',

        //}
        //],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report',
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
                    text: 'Report Counts',
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
            dataSource: 'ds_cabinReport',
            size: 'chrt_sizeXS'
        },
    };



    $scope.qaMaintenanceChart = {
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

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report',
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
                    text: ' Report Counts',
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
            dataSource: 'ds_maintenanceReport',
            size: 'chrt_size'
        },
    };

    $scope.qaMaintenanceChartXS = {
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
        //panes: [{
        //    name: 'topPane',

        //},
        //{
        //    name: 'midPane',

        //},
        //{
        //    name: 'bottomPane',

        //}
        //],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report',
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
                    text: 'Report Counts',
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
            dataSource: 'ds_maintenanceReport',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaMaintenanceRegChart = {
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

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report By Register',
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
                    text: ' Report Counts',
                },
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            //label: {
            //    customizeText: function (d) {
            //        return $scope.convertYearMonth(this.value);

            //    },
            //}

        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRegReport',
            size: 'chrt_size'
        },
    };

    $scope.qaMaintenanceRegChartXS = {
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
        //panes: [{
        //    name: 'topPane',

        //},
        //{
        //    name: 'midPane',

        //},
        //{
        //    name: 'bottomPane',

        //}
        //],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report By Register',
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
                    text: 'Report Counts',
                },
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            //label: {
            //    customizeText: function (d) {
            //        return $scope.convertYearMonth(this.value);

            //    },
            //}
        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRegReport',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaDispatchChart = {
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

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Dispatch Report',
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
                    text: 'Report Counts',
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
            dataSource: 'ds_cabinReport',
            size: 'chrt_size'
        },
    };

    $scope.qaDispatchChartXS = {
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
        //panes: [{
        //    name: 'topPane',

        //},
        //{
        //    name: 'midPane',

        //},
        //{
        //    name: 'bottomPane',

        //}
        //],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Dispatch Report',
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
                    text: 'Report Counts',
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
            dataSource: 'ds_cabinReport',
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