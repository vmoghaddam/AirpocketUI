'use strict';
app.controller('fdmOpsController', ['$http', '$scope', '$routeParams', '$rootScope', 'fdmService', 'authService', 'notificationService', function ($http, $scope, $routeParams, $rootScope, fdmService, authService) {
    $scope.prms = $routeParams.prms;
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "Boeing", id: 'boeing' },
        { text: "MD", id: 'md' },

    ];

    function updateFDMStatus(v) {
        console.log(v);
        if ($scope.ConfirmationStatus == 0 || $scope.ConfirmationStatus == null) {
            fdmService.FDMStatus($scope.rowId, v).then(function (resposnse) {
                console.log(resposnse)
                
            });
        } else {
            General.ShowNotify(Config.Text_Permision, 'error');
        }
    };

    $scope.clearEntity = function () {

    };




    $scope.$watch("selectedTabIndex", function (newValue) {
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
    //$scope.yf = 2022;
    $scope.yf = new Date().getFullYear();
    
    //$scope.month = 10;
    $scope.month = new Date().getMonth();

    $scope.sb_yf = {
        placeholder: 'From Year',
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
        placeholder: 'To Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

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

    var validitySource = [
        { Id: 0, Title: " " },
        { Id: 1, Title: "Accept" },
        { Id: 2, Title: "Reject" }
    ]

    $scope.sb_validity = {
        placeholder: ' ',
        showClearButton: false,
        searchEnabled: false,
        dataSource: validitySource,
        displayExpr: 'Title',
        value: 'Id',
        onSelectionChanged: function (arg) {
            if (arg.model.row.data.Confirmation == 0) {
                if (arg.selectedItem.Id == 1)
                    fdmService.confirmFDM(arg.model.row.data.Id).then(function (response) {
                        //$scope.Validity = response
                        console.log(response);
                    });
                else
                    fdmService.rejectFDM(arg.model.row.data.Id).then(function (response) { });
            } else {
                General.ShowNotify(Config.Text_Permision, 'error');
            }
        },

        bindingOptions: {
            value: 'Validity'
        }
    }


    $scope.bind = function () {
        $scope.loadingVisible = true;
        fdmService.getFdm($scope.yf, $scope.month + 1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_boeing_ds = response.Data.Boeing;
            $scope.dg_md_ds = response.Data.MD;

          
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    ///////////////////////////////////
    

    //////////////////////////////////////////
    //$scope.dt_to = new Date().addDays(0);
    //$scope.dt_from = new Date().addDays(-30);
    //var startDate = new Date(2019, 10, 30);
    //if (startDate > $scope.dt_from)
    //    $scope.dt_from = startDate;

    //$scope.date_from = {
    //    type: "date",
    //    placeholder: 'From',
    //    width: '100%',

    //    bindingOptions: {
    //        value: 'dt_from',

    //    }
    //};
    //$scope.date_to = {
    //    type: "date",
    //    placeholder: 'To',
    //    width: '100%',

    //    bindingOptions: {
    //        value: 'dt_to',

    //    }
    //};
    //////////////////////////////////
    $scope.dg_boeing_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'Validity', caption: 'Validity', width: 120, lookup: { dataSource: validitySource, displayExpr: 'Title', valueExpr: 'Id', valueChangeEvent: 'change' }, setCellValue(rowData, value) { updateFDMStatus(value); rowData.Validity = value; $scope.dg_boeing_instance.refresh(); }, allowEditing: true },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 150 },

        { dataField: 'AircraftType', caption: 'AircraftType', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },

        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'PFLF', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'IPCode', caption: 'IPCode', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P1Code', caption: 'P1Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P2Code', caption: 'P2Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Critical', caption: 'Critical', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Major', caption: 'Major', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Minor', caption: 'Minor', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },






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
        editing: {
            mode: 'cell',
            allowUpdating: true,
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
            console.log(e);
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
        onEditingStart(arg) {
            $scope.rowId = arg.key.Id;
            $scope.ConfirmationStatus = arg.key.Confirmation;
            console.log(arg.key.Confirmation);
            if (arg.key.Confirmation == 1) {
                console.log(arg.key.Confirmation);
                arg.cancel = true;
            }
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


        { dataField: 'Validity', caption: 'Validity', width: 120, lookup: { dataSource: validitySource, displayExpr: 'Title', valueExpr: 'Id', valueChangeEvent: 'change' }, setCellValue(rowData, value) { updateFDMStatus(value); rowData.Validity = value; $scope.dg_md_instance.refresh(); }, allowEditing: true },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd', allowEditing: false, width: 150 },
        { dataField: 'AircraftType', caption: 'AircraftType', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc', sortIndex: 0 },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },


        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'PFLR', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },







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
        editing: {
            mode: 'cell',
            allowUpdating: true,
        },
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

        onEditingStart(arg) {
            $scope.rowId = arg.key.Id;
            $scope.ConfirmationStatus = arg.key.Confirmation;
            if (arg.key.Confirmation == 1) {
                console.log(arg.key.Confirmation);
                arg.cancel = true;
            }
        },


        bindingOptions: {
            dataSource: 'dg_md_ds'
        },
        columnChooser: {
            enabled: false
        },

    };






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
}])
