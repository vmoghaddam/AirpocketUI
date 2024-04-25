'use strict';
app.controller('qaReports', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'qaService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($http, $scope, $location, $routeParams, $rootScope, flightService, qaService, aircraftService, authService, notificationService, $route, $window) {


    $scope.Type = 0;

    $scope.prms = $routeParams.prms;

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.bind();
        }

    };


    $scope.popup_form_list_visible = false;
    //$scope.popup_height = 770;
    //$scope.popup_width = 800;
    $scope.popup_form_list_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_form_list_visible = false;
    $scope.popup_form_list = {

        showTitle: true,
        toolbarItems: [


        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {



        },
        onHiding: function () {
        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_form_list_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_form_list_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };


    $scope.popup_form_visible = false;
    //$scope.popup_height = 770;
    //$scope.popup_width = 800;
    $scope.popup_form_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_form = {

        showTitle: true,
        toolbarItems: [


        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {



        },
        onHiding: function () {
        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_form_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_form_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };







    $scope.dg_form_list_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        { dataField: 'Id', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150 },
        { dataField: 'FlightNumber', caption: 'FlightNumber', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150 },
        { dataField: 'EmployeeName', caption: 'Producer', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minwidth: 250 },
        { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 250 },


    ];
    $scope.dg_form_list_selected = null;
    $scope.dg_form_list_instance = null;
    $rootScope.dg_form_list_ds = null;
    $scope.dg_form_list = {



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
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 60,

        columns: $scope.dg_form_list_columns,
        onContentReady: function (e) {
            if (!$scope.dg_form_list_instance)
                $scope.dg_form_list_instance = e.component;

        },

        onRowClick: function (e) {

            console.log($scope.Type);

            var data = {
                Id: e.data.Id,
                Type: $scope.Type,
                EmployeeId: $rootScope.employeeId,
                isNotDetermined: false,
                Category: ' ',
                ProducerId: e.data.EmployeeId,
            };


            switch ($scope.Type) {
                case 0:
                    $scope.popup_form_visible = true;
                    $scope.cabinLoaded = function () {
                        $rootScope.$broadcast('InitQACabin', data);
                    }
                    break;
                case 1:
                    $scope.popup_form_visible = true;
                    $scope.groundLoaded = function () {
                        $rootScope.$broadcast('InitQAGround', data);
                    }
                    //$rootScope.$broadcast('InitQAGround', data);
                    break;
                case 2:
                    $scope.popup_form_visible = true;
                    $scope.voluntaryLoaded = function () {
                        $rootScope.$broadcast('InitVHR', data);
                    }
                    //$rootScope.$broadcast('InitVHR', data);
                    break;
                case 3:
                    $scope.popup_form_visible = true;
                    $scope.maintenanceLoaded = function () {
                        $rootScope.$broadcast('InitQAMaintenance', data);
                    }
                    //$rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case 4:
                    $scope.popup_form_visible = true;
                    $scope.cateringLoaded = function () {
                        $rootScope.$broadcast('InitQACatering', data);
                    }
                    //$rootScope.$broadcast('InitQACatering', data);
                    break;
                case 5:
                    $scope.popup_form_visible = true;
                    $scope.securityLoaded = function () {
                        $rootScope.$broadcast('InitQASecurity', data);
                    }
                    //$rootScope.$broadcast('InitQASecurity', data);
                    break;
                case 6:
                    $scope.popup_form_visible = true;
                    $scope.dispatchLoaded = function () {
                        $rootScope.$broadcast('InitQADispatch', data);
                    }
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case 7:
                    $scope.popup_form_visible = true;
                    $scope.cyberLoaded = function () {
                        $rootScope.$broadcast('InitQADispatch', data);
                    }
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
					case 8:
    $scope.popup_form_visible = true;
    $scope.asrLoaded = function () {
        $rootScope.$broadcast('InitEfbAsr', data);
    }
    //$rootScope.$broadcast('InitQADispatch', data);
    break;
            }
        },

        onRowPrepared: function (e) {
            if (e.rowType == 'data' && e.data && e.data.Status == 1) {
                e.rowElement.css('background', '#ccffcc');
                $scope.dg_form_list_ds.ReviewResultTitle = "Closed"
            }
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_form_list_selected = null;
            }
            else
                $scope.dg_form_list_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_form_list_ds'
        },
        columnChooser: {
            enabled: false
        },

    };



    /////////////////////////////////////////
    //$scope.dt = new Date();
    //$scope.df = new Date();
    //$scope.df.setMonth($scope.dt.getMonth() - 6);
    //$scope.dt = $scope.dt.toISOString().split('T')[0]
    //$scope.df = $scope.df.toISOString().split('T')[0]

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


    $scope.bind = function () {

        //$scope.dt = new Date();
        //$scope.df = new Date();
        //$scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
        //$scope.df.setFullYear($scope.yt, $scope.mt, 1);
        //$scope.dt = $scope.dt.toISOString().split('T')[0]
        //$scope.df = $scope.df.toISOString().split('T')[0]

        $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
        $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
        $scope.ymf = parseInt($scope.ymf);
        $scope.ymt = parseInt($scope.ymt);



        qaService.getCateringReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_cateringTotal = response.Data.TotalCount;
            $scope.ds_cateringDate = response.Data.DateCount;
            $scope.ds_cateringRegister = response.Data.RegisterCount;
            $scope.ds_cateringRoute = response.Data.RouteCount;
            $scope.ds_cateringReasonTitle = response.Data.ReasonTitle;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getGroundReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_groundTotal = response.Data.TotalCount;
            $scope.ds_groundDate = response.Data.DateCount;
            $scope.ds_groundRegister = response.Data.RegisterCount;
            $scope.ds_groundRoute = response.Data.RouteCount;
            $scope.ds_groundDamage = response.Data.DamageByCount;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getSecurityReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_securityTotal = response.Data.TotalCount;
            $scope.ds_securityDate = response.Data.DateCount;
            $scope.ds_securityRegister = response.Data.RegisterCount;
            $scope.ds_securityRoute = response.Data.RouteCount;
            $scope.ds_securityReasonTitle = response.Data.ReasonTitle;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        qaService.getCabinReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_cabinTotal = response.Data.TotalCount;
            $scope.ds_cabinDate = response.Data.DateCount;
            $scope.ds_cabinRegister = response.Data.RegisterCount;
            $scope.ds_cabinRoute = response.Data.RouteCount;
            $scope.ds_cabinFltPhase = response.Data.FlightPhase;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getCabinEventReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.arr = [];
            $.each(response.Data, function (_i, _d) {


                $scope.arr.push({ name: _d.EventTitle, value: _d.Count });
            });


            $scope.ds_cabinEvent = [{ name: 'Events', items: $scope.arr }];


            console.log($scope.ds_cabinEvent);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getMaintenanceReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_maintenanceTotal = response.Data.TotalCount;
            $scope.ds_maintenanceDate = response.Data.DateCount;
            $scope.ds_maintenanceRegister = response.Data.RegisterCount;
            $scope.ds_maintenanceRoute = response.Data.RouteCount;
            $scope.ds_maint_component = response.Data.components;
            $scope.ds_maint_component_registers = response.Data.components_regs;
            console.log($scope.ds_maint_component);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getDispatchReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_dispatchTotal = response.Data.TotalCount;
            $scope.ds_dispatchDate = response.Data.DateCount;
            $scope.ds_dispatchRegister = response.Data.RegisterCount;
            $scope.ds_dispatchRoute = response.Data.RouteCount;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getCyberReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_cyberTotal = response.Data.TotalCount;
            $scope.ds_cyberDate = response.Data.DateCount;
            $scope.ds_cyberRegister = response.Data.RegisterCount;
            $scope.ds_cyberRoute = response.Data.RouteCount;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        qaService.getVoluntaryReport($scope.ymf + 1, $scope.ymt + 1).then(function (response) {
            $scope.ds_voluntaryTotal = response.Data.TotalCount;
            $scope.ds_voluntaryDate = response.Data.DateCount;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //////////////////////////////////////////

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
    /////////////////////////

    ///SIZES/////////////////
    $scope.chrt_size = { height: 450, width: $(window).width() - 100 };
    $scope.chrt_size100 = { height: 450, width: '100%' };
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



    $scope.qaCSREventChart = {
        title: 'Event Count Report',


        tooltip: {
            enabled: true,
            format: 'thousands',
            customizeTooltip(arg) {
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },
        label: {
            visible: true, // Make sure labels are visible
            font: {
                color: '#333', // Change label text color
                size: 12, // Adjust font size as needed
                weight: 600, // Adjust font weight (boldness) as needed
            },
            border: {
                visible: true, // Show label border
                color: '#ccc', // Change border color
                width: 1, // Adjust border width as needed
                cornerRadius: 5, // Adjust border corner radius as needed
            },
        },
        bindingOptions:
        {
            dataSource: 'ds_cabinEvent',
            size: 'treeChrt_size'
        },
    };

    $scope.qaCSREventChartXS = {
        title: 'Event Count Report',
        tooltip: {
            enabled: true,
            format: 'thousands',
            customizeTooltip(arg) {
                console.log(arg);
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },

        bindingOptions:
        {
            dataSource: 'ds_cabinEvent',
            size: 'treeChrt_sizeXS'
        },
    };

    $scope.cabinFltPhase = {
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Flight Phase',
                ignoreEmptyPoints: true,
                argumentField: "Route",
                valueField: "Count",
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

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'ds_cabinFltPhase',

        }
    };



    $scope.qaCSRChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            //title: {
            //    text: 'Report Counts',
            //},
            tickInterval: 1,
        }],

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
            dataSource: 'ds_cabinDate',
            size: 'chrt_size100'
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
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

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
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts',
            },
            tickInterval: 1,
        }],

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
            dataSource: 'ds_cabinDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaCSRByRegisterChart = {
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

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts By Register',
            },
            tickInterval: 1,
        }],
        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cabinRegister',
            size: 'chrt_size100'
        },
    };

    $scope.qaCSRByRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },
        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts By Register',
            },
            tickInterval: 1,
        }],
        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cabinRegister',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaCSRByRouteChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts By Route',
            },
            tickInterval: 1,
        }],
        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cabinRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaCSRByRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cabin Safety Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts by Route',
            },
            tickInterval: 1,
        }],
        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cabinRoute',
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
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, type: 'stackedbar', barWidth: 50, stack: 'detailed' },

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
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [{
            grid: {
                visible: true,
            },
            title: {
                text: 'Report Counts',
            },
            tickInterval: 1,
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
            dataSource: 'ds_maintenanceDate',
            size: 'chrt_size100'
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
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

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
            dataSource: 'ds_maintenanceDate',
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

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

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
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: ' Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRegister',
            size: 'chrt_size100'
        },
    };

    $scope.pie_maint_component = {
        rtlEnabled: false,
        palette: "Violet",
        onInitialized: function (e) {
            //  if (!$scope.pie_ontime_delayed_instance)
            //      $scope.pie_ontime_delayed_instance = e.component;
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
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
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'component',
                ignoreEmptyPoints: true,
                argumentField: "Component",
                valueField: "Count",
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

        ],
        onPointClick(e) {
            e.target.select();
            // qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
            //    $scope.dg_form_list_ds = response.Data;
            //    $scope.popup_form_list_visible = true;
            //});
            $scope.ds_maint_regs = Enumerable.From($scope.ds_maint_component_registers).Where('$.ComponentId==' + e.target.data.ComponentId).ToArray();
            $scope.maint_component = e.target.data.Component;

        },
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'ds_maint_component',

        }
    };

    $scope.maint_component = 'Component';
    $scope.bar_maint_component = {
        palette: "Violet",
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
            argumentField: 'Component',
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Components',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            // qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
            //    $scope.dg_form_list_ds = response.Data;
            //    $scope.popup_form_list_visible = true;
            //});
            $scope.ds_maint_regs = Enumerable.From($scope.ds_maint_component_registers).Where('$.ComponentId==' + e.target.data.ComponentId).ToArray();
            $scope.maint_component = e.target.data.Component;

        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Count',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },
        size: {
            height: 350,
            width: '100%'
        },
        bindingOptions:
        {
            dataSource: 'ds_maint_component',

        },
    };



    $scope.pie_maint_component_regs = {
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
            //  if (!$scope.pie_ontime_delayed_instance)
            //      $scope.pie_ontime_delayed_instance = e.component;
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        //palette: ['#00cc99', '#ff6666'],
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
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'register',
                ignoreEmptyPoints: true,
                argumentField: "Register",
                valueField: "Count",
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

        ],
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'ds_maint_regs',

        }
    };



    $scope.bar_maint_component_reg = {
        palette: "Postel",
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

            { valueField: 'Count', name: 'Count', pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Registers',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            // qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
            //    $scope.dg_form_list_ds = response.Data;
            //    $scope.popup_form_list_visible = true;
            //});
            $scope.ds_maint_regs = Enumerable.From($scope.ds_maint_component_registers).Where('$.ComponentId==' + e.target.data.ComponentId).ToArray();
            $scope.maint_component = e.target.data.Component;

        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Count',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },
        size: {
            height: 350,
            width: '100%'
        },
        bindingOptions:
        {
            dataSource: 'ds_maint_regs',

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

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

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
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRegister',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaMaintenanceRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: ' Report Counts By Route',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaMaintenanceRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Maintenance Safety Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_maintenanceRoute',
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
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
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
            dataSource: 'ds_dispatchDate',
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
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_dispatchDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaDispatchRegister = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
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

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Dispatch Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,


        },

        bindingOptions:
        {
            dataSource: 'ds_dispatchRegister',
            size: 'chrt_size'
        },
    };

    $scope.qaDispatchRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

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
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_dispatchRegister',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaDispatchRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Dispatch Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_dispatchRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaDispatchRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Dispatch Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_dispatchRoute',
            size: 'chrt_sizeXS'
        },
    };



    $scope.qaGroundChart = {
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

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_groundDate',
            size: 'chrt_size'
        },
    };

    $scope.qaGroundChartXS = {
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

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_groundDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaGroundRegister = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
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
            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,


        },

        bindingOptions:
        {
            dataSource: 'ds_groundRegister',
            size: 'chrt_size'
        },
    };

    $scope.qaGroundRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_groundRegister',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaGroundRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_groundRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaGroundRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'InjuredCount', name: 'Injured Count', color: lowColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },
            { valueField: 'FatalityCount', name: 'Fatality Count', color: medColor, pane: 'topPane', type: 'bar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Ground Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_groundRoute',
            size: 'chrt_sizeXS'
        },
    };


    //$scope.qaGroundDamage = {
    //    size: { height: 600 },
    //    legend: {
    //        verticalAlignment: 'bottom',
    //        horizontalAlignment: 'center',
    //    },

    //    //    title: 'Damage By',
    //    export: {
    //        enabled: false,
    //    },
    //    onPointClick: function (e) {
    //        e.target.select();
    //    },
    //    argumentAxis: {
    //        label: {
    //            visible: true,
    //        },
    //    },
    //    valueAxis: [
    //        {
    //            grid: {
    //                visible: true,
    //            },
    //            tickInterval: 1,
    //        },
    //    ],
    //    bindingOptions: {
    //        dataSource: 'ds_groundDamage',
    //    },
    //};




    $scope.chartConfigs = [
        {
            type: 'doughnut',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,
                    };
                },
            },

            commonSeriesSettings: {
                argumentField: 'DamageBy',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },
                },

            },
            title: 'Count',


            series: [

                { valueField: 'Count', name: 'Count', type: 'doughnut', size: { width: 200 } },
            ],

            legend: {
                visible: false
            },

            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },

            argumentAxis: {
                label: {
                    visible: true
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
                dataSource: 'ds_groundDamage'
            },
        },
        {
            type: 'doughnut',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,
                    };
                },
            },

            commonSeriesSettings: {
                argumentField: 'DamageBy',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },
                },

            },
            title: 'Injured Count',


            series: [

                { valueField: 'InjuredCount', name: 'Injured Count', type: 'doughnut', size: { width: 200 } },

            ],


            legend: {
                visible: false
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },

            argumentAxis: {
                label: {
                    visible: true
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
                dataSource: 'ds_groundDamage'
            },
        },
        {
            type: 'doughnut',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,
                    };
                },
            },

            commonSeriesSettings: {
                argumentField: 'DamageBy',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },
                },

            },
            title: 'Fatality Count',


            series: [

                { valueField: 'FatalityCount', name: 'Fatality Count', type: 'doughnut', size: { width: 200 } },

            ],



            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },

            argumentAxis: {
                label: {
                    visible: true
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
                dataSource: 'ds_groundDamage'
            },
        },
    ];

    $scope.chartConfigs.forEach(function (chartConfig) {
        console.log("configs", chartConfig);
    });


    $scope.qaCateringChart = {
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
        title: 'Catering Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_cateringDate',
            size: 'chrt_size100'
        },
    };

    $scope.qaCateringChartXS = {
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
        title: 'Catering Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_cateringDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaCateringRegister = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
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

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Catering Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,


        },

        bindingOptions:
        {
            dataSource: 'ds_cateringRegister',
            size: 'chrt_size100'
        },
    };

    $scope.qaCateringRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Catering Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_cateringRegister',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaCateringRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Catering Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cateringRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaCateringRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Catering Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cateringRoute',
            size: 'chrt_sizeXS'
        },
    };

    $scope.cateringReasonTitle = {
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Reason',
                ignoreEmptyPoints: true,
                argumentField: "ReasonTitle",
                valueField: "Count",
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

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'ds_cateringReasonTitle',

        }
    };

    $scope.cateringReasonTitleXS = {
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Reason',
                ignoreEmptyPoints: true,
                argumentField: "ReasonTitle",
                valueField: "Count",
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

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'ds_cateringReasonTitle',

        }
    };


    $scope.qaSecurityChart = {
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
        title: 'Security Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_securityDate',
            size: 'chrt_size100'
        },
    };

    $scope.qaSecurityChartXS = {
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
        title: 'Security Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_securityDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaSecurityRegister = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
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

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Security Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,


        },

        bindingOptions:
        {
            dataSource: 'ds_securityRegister',
            size: 'chrt_size100'
        },
    };

    $scope.qaSecurityRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Security Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_securityRegister',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaSecurityRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Security Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_securityRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaSecurityRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Security Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_securityRoute',
            size: 'chrt_sizeXS'
        },
    };

    $scope.securityReasonTitle = {
        center: {
            x: '50%',
            y: '50%',
        },
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
        },
      
        type: "doughnut",
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Reason',
                ignoreEmptyPoints: true,
                argumentField: "ReasonTitle",
                valueField: "Count",
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

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'ds_securityReasonTitle',

        }

    }

    $scope.securityReasonTitleXS = {
        palette: "Green Mist",
        rtlEnabled: false,
        onInitialized: function (e) {
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1
        },
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.value.toFixed(2) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Reason',
                ignoreEmptyPoints: true,
                argumentField: "ReasonTitle",
                valueField: "Count",
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

        ],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'ds_securityReasonTitle',

        }

    }


    $scope.qaVoluntaryChart = {
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
        title: 'Voluntary Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_voluntaryDate',
            size: 'chrt_size'
        },
    };

    $scope.qaVoluntaryChartXS = {
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
        title: 'Voluntary Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_voluntaryDate',
            size: 'chrt_sizeXS'
        },
    };



    $scope.qaCyberChart = {
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
        title: 'Cyber Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_cyberDate',
            size: 'chrt_size100'
        },
    };

    $scope.qaCyberChartXS = {
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
        title: 'Cyber Report',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByDate(e.target.data.YearMonth, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1
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
            dataSource: 'ds_cyberDate',
            size: 'chrt_sizeXS'
        },
    };


    $scope.qaCyberRegister = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
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

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cyber Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Register',
                },
                tickInterval: 1,
            }],

        argumentAxis: {
            tickInterval: 1,


        },

        bindingOptions:
        {
            dataSource: 'ds_cyberRegister',
            size: 'chrt_size100'
        },
    };

    $scope.qaCyberRegisterXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cyber Report By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRegister($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Register, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
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
                tickInterval: 1,
            }],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,

        },

        bindingOptions:
        {
            dataSource: 'ds_cyberRegister',
            size: 'chrt_sizeXS'
        },
    };

    $scope.qaCyberRoute = {
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
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        }],
        series: [

            { valueField: 'Count', name: 'Count', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cyber Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cyberRoute',
            size: 'chrt_size'
        },
    };

    $scope.qaCyberRouteXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            label: {
                visible: false,
            },

        },

        series: [

            { valueField: 'Count', name: 'Count', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },

        ],
        title: 'Cyber Report By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
            qaService.getQAFormByRoute($scope.yf, $scope.yt, $scope.mf, $scope.mt, e.target.data.Route, $scope.Type).then(function (response) {
                $scope.dg_form_list_ds = response.Data;
                $scope.popup_form_list_visible = true;
            });
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Report Counts By Route',
                },
                tickInterval: 1
            }],

        argumentAxis: {
            tickInterval: 1,
        },

        bindingOptions:
        {
            dataSource: 'ds_cyberRoute',
            size: 'chrt_sizeXS'
        },
    };





    ///////////////////////////
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

    $scope.get_form_tile_class = function (n) {

        if ($scope.Type == n)
            return 'tile-form-selected';
        else
            return '';
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
        $rootScope.page_title = '> Forms Report';


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