'use strict';
app.controller('fdmController', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, flightService, fdmService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "Boeing", id: 'boeing' },
        { text: "MD", id: 'md' },

    ];
    $scope.popup_tabs = [
        { text: "Failed items", id: 'failedItems' },
        //{ text: "Existed File", id: 'exist' },
        { text: "Error", id: 'failed' },

    ];

    $scope.clearEntity = function () {
        $scope.uploaderValueDocument = [];
        $scope.uploadedFileDocument = null;
        $scope.fileList = [],
            $scope.fileNames = [];
        $scope.fileCount = 0

    };




    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'boeing':

                    break;

                case 'md':

                    break;

                default:
                    break;
            }
            if ($scope.dg_boeing_instance)
                $scope.dg_boeing_instance.refresh();
            if ($scope.dg_md_instance)
                $scope.dg_md_instance.refresh();

        }
        catch (e) {

        }


    });

    $scope.$watch("popupselectedTabIndex", function (newValue) {
        try {
            $('.tabEx').hide();
            var id = $scope.popup_tabs[newValue].id;
            $scope.popupselectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {

                case 'failedItems':

                    break;

                //case 'exist':

                //    break;

                case 'failed':

                    break;

                default:
                    break;
            }
            //if ($scope.dg_exist_instance)
            //    $scope.dg_exist_instance.refresh();
            if ($scope.dg_failed_instance)
                $scope.dg_failed_instance.refresh();
            if ($scope.dg_res_instance)
                $scope.dg_res_instance.refresh();

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

    $scope.popup_tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.popupselectedTabIndex = -1;
            $scope.popupselectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "popup_tabs", deep: true },
            selectedIndex: 'popupselectedTabIndex'
        }

    };

    ////////////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'finmrpt',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_boeing_ds = null;
            $scope.dg_md_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };
    /////////////////////////////////////////



    $scope.yf = new Date().getFullYear();
    $scope.yt = 2022;
    $scope.month = new Date().getMonth();
    $scope.sb_yf = {
        placeholder: 'From Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023, 2024],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'To Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023, 2024],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };

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

    $scope.sb_month = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'month',


        }
    };

    $scope.bind = function () {
        // var yf = 2020;
        // var yt = 2020;
        $scope.loadingVisible = true;
        fdmService.getFdm($scope.yf, $scope.month + 1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_boeing_ds = response.Data.Boeing;
            $scope.dg_md_ds = response.Data.MD;
            console.log($scope.dg_md_ds);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-30);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
    //////////////////////////////////
    $scope.dg_boeing_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },


        {
            dataField: "Id",
            caption: '',
            width: 140,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'deleteBoeingTemplate',
            name: 'deleteBoeing',
            fixed: true,
            fixedPosition: 'right',
        },

        { dataField: 'ValidityStatus', caption: 'Validity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 110 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'State', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Critical', caption: 'Critical', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Major', caption: 'Major', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Minor', caption: 'Minor', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },

        //{ dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc' },
        //{ dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },

        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        //{ dataField: 'PFLF', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        //{ dataField: 'IPCode', caption: 'IPCode', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        //{ dataField: 'P1Code', caption: 'P1Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        //{ dataField: 'P2Code', caption: 'P2Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

      //{ dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 100 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },






    ];
    $scope.dg_boeing_selected = null;
    $scope.dg_boeing_instance = null;
    $scope.dg_boeing_ds = null;
    $scope.dg_boeing = {


        
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
        height: $(window).height() - 180,

        columns: $scope.dg_boeing_columns,
        onContentReady: function (e) {
            if (!$scope.dg_boeing_instance)
                $scope.dg_boeing_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_boeing_selected = null;
            }
            else
                $scope.dg_boeing_selected = data;


        },
        onRowPrepared: function (e) {



            if (e.rowType == 'data' && e.data && e.data.Validity == 1)
                e.rowElement.css('background', '#ccffcc');
            if (e.rowType == 'data' && e.data && e.data.Validity == 2)
                e.rowElement.css('background', '#ff8080');
            if (e.rowType == 'data' && e.data && e.data.Confirmation == 1)
                e.rowElement.css('font-weight', 'bold');


        },



        bindingOptions: {
            dataSource: 'dg_boeing_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_md_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        {
            dataField: "Id",
            caption: '',
            width: 140,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'deleteMDTemplate',
            name: 'deleteMD',
            fixed: true,
            fixedPosition: 'right',
        },
        { dataField: 'ValidityStatus', caption: 'Validity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 110 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'State', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Limit', caption: 'Limit', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },


        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 110 },
        //{ dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc', sortIndex: 0 },
        //{ dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },


        //{ dataField: 'PFLR', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        //{ dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        //{ dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },

        { dataField: 'AircraftType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        //{ dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },






    ];
    $scope.dg_md_selected = null;
    $scope.dg_md_instance = null;
    $scope.dg_md_ds = null;
    $scope.dg_md = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_md_columns,
        onContentReady: function (e) {
            if (!$scope.dg_md_instance)
                $scope.dg_md_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_md_selected = null;
            }
            else
                $scope.dg_md_selected = data;


        },

        onRowPrepared: function (e) {



            if (e.rowType == 'data' && e.data && e.data.Validity == 1)
                e.rowElement.css('background', '#ccffcc');
            if (e.rowType == 'data' && e.data && e.data.Validity == 2)
                e.rowElement.css('background', '#ff8080');
            if (e.rowType == 'data' && e.data && e.data.Confirmation == 1)
                e.rowElement.css('font-weight', 'bold');


        },

        bindingOptions: {
            dataSource: 'dg_md_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_res_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 80, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85 },
        { dataField: 'EventName', caption: 'EventName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75 },
        { dataField: 'P1', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'flightNo', caption: 'Flight number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'FileName', caption: 'File Name', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 200 },




    ];
    $scope.dg_res_selected = null;
    $scope.dg_res_instance = null;
    $scope.dg_res_ds = [];
    $scope.dg_res = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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
        height: 565,

        columns: $scope.dg_res_columns,
        onContentReady: function (e) {
            if (!$scope.dg_res_instance)
                $scope.dg_res_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_res_selected = null;
            }
            else
                $scope.dg_res_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_res_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_failed_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 80, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'FileName', caption: 'File Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 720 },



    ];
    $scope.dg_failed_selected = null;
    $scope.dg_failed_instance = null;
    $scope.dg_failed_ds = [];
    $scope.dg_failed = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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
        height: 565,

        columns: $scope.dg_failed_columns,
        onContentReady: function (e) {
            if (!$scope.dg_failed_instance)
                $scope.dg_failed_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_failed_selected = null;
            }
            else
                $scope.dg_failed_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_failed_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.deleteRow = function (row) {
        console.log(row.data.Validity);
        if (row.data.Validity == 2 || row.data.Validity == 1) {
            General.ShowNotify(Config.Text_Permision, 'error');
        } else {
            General.Confirm(Config.Text_DeleteConfirm, function (res) {


                if (res == true) {
                    fdmService.deleteFDM(row.data.Id).then(function (response) {
                        console.log(response);
                    })

                    $scope.dg_boeing_ds = Enumerable.From($scope.dg_boeing_ds).Where(function (x) {
                        return x.Id != row.data.Id;
                    }).ToArray();

                    $scope.dg_md_ds = Enumerable.From($scope.dg_md_ds).Where(function (x) {
                        return x.Id != row.data.Id;
                    }).ToArray();


                }

            });
        }
    }

    //$scope.dg_exist_columns = [


    //    {
    //        cellTemplate: function (container, options) {
    //            $("<div style='text-align:center'/>")
    //                .html(options.rowIndex + 1)
    //                .appendTo(container);
    //        }, name: 'row', caption: '#', width: 80, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
    //    },





    //    { dataField: 'FileName', caption: 'File Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 720 },


    //];
    //$scope.dg_exist_selected = null;
    //$scope.dg_exist_instance = null;
    //$scope.dg_exist_ds = [];
    //$scope.dg_exist = {
    //    wordWrapEnabled: true,
    //    rowAlternationEnabled: true,
    //    headerFilter: {
    //        visible: false
    //    },
    //    filterRow: {
    //        visible: true,
    //        showOperationChooser: true,
    //    },
    //    showRowLines: true,
    //    showColumnLines: true,
    //    sorting: { mode: 'none' },

    //    noDataText: '',

    //    allowColumnReordering: true,
    //    allowColumnResizing: true,
    //    scrolling: { mode: 'infinite' },
    //    paging: { pageSize: 100 },
    //    showBorders: true,
    //    selection: { mode: 'single' },

    //    columnAutoWidth: false,
    //    height: 665,


    //    columns: $scope.dg_exist_columns,
    //    onContentReady: function (e) {
    //        if (!$scope.dg_exist_instance)
    //            $scope.dg_exist_instance = e.component;

    //    },
    //    onSelectionChanged: function (e) {
    //        var data = e.selectedRowsData[0];

    //        if (!data) {
    //            $scope.dg_exist_selected = null;
    //        }
    //        else
    //            $scope.dg_exist_selected = data;


    //    },
    //    bindingOptions: {
    //        dataSource: 'dg_exist_ds'
    //    },
    //    columnChooser: {
    //        enabled: false
    //    },

    //};


    /////////////////////////////////////

    $scope.popup_res_visible = false;
    $scope.popup_res_title = 'Excel Response';
    $scope.popup_res = {

        fullScreen: false,
        showTitle: true,
        height: 700,
        width: 900,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'danger', text: 'close', width: 120, icon: 'remove', onClick: function (e) {
                        $scope.popup_res_visible = false;
                        //$scope.dg_exist_ds = [];
                        $scope.dg_failed_ds = [];
                        $scope.dg_res_ds = [];
                    }
                }

            },
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
        onHidden: function () {
            $scope.bind();
        },

        bindingOptions: {
            visible: 'popup_res_visible',
            title: 'popup_res_title',
        }


    };



    //////////////////////////////////

    $scope.fo = null;

    /////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 200 },

    };

    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> RAW DATA';


        $('.finmonthreport').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////
    $scope.uploaderValueDocument = [];
    $scope.fileList = [];
    $scope.fileNames = [];
    $scope.fileCount = 0
    $scope.uploader_document_instance = null;
    $scope.uploader_document = {
        multiple: true,
        accept: '.xlsx',
        selectButtonText: 'UPLOAD XLSX',
        uploadMethod: 'POST',
        uploadMode: 'instantly',
        uploadUrl: apiFdm + 'api/uploadfile?t=clientfiles',
        //uploadUrl: 'https://apifdm.airpocket.online/api/uploadfile' + '?t=clientfiles',



        onUploadStarted: function (res) {
            $scope.loadingVisible = true;
            $scope.fileList.push(res.file);
            $scope.fileCount = $scope.fileList.length;
            console.log(res);
        },

        //onUploadError: function (res) {
        //    console.log(res);
        //    General.ShowNotify('Upload Failed', 'error');
        //    $scope.fileCount -= 1

        //},

        onUploaded: function (e) {
            $scope.fileCount -= 1;

            if ($scope.fileCount == 0) {

                angular.forEach($scope.fileList, function (x) {
                    $scope.fileNames.push(x.name);
                });

                $http.post(apiFdm + 'api/import', $scope.fileNames).then(function (response) {


                    angular.forEach(response.data, function (x) {
                        //if (x.Status == 200)
                        //    $scope.dg_exist_ds.push(x);
                        if (x.Status == 500)
                            $scope.dg_failed_ds.push(x);
                        if (x.Status == null)
                            $scope.dg_res_ds.push(x);
                    })

                    $scope.loadingVisible = false;
                    $scope.popup_res_visible = true;
                });

                $scope.clearEntity();

            }
        },

        bindingOptions: {
            value: 'uploaderValueDocument'
        }
    };

    //////////////////////////////

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


    /////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {
            $scope.dg_boeing_ds = null;
            $scope.dg_md_ds = null;
            $scope.doRefresh = true;
            $scope.bind();
        }, 1500);

    });

    $rootScope.$broadcast('FlightsReportLoaded', null);
}]);