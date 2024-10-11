'use strict';
app.controller('qaReportStatus', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'qaService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, qaService, fdmService, aircraftService, authService, notificationService, $route) {
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "New", id: 'new' },
        { text: "Open", id: 'open' },
        { text: "Determined", id: 'determined' },

    ];


    $scope.clearEntity = function () {
        $scope.uploaderValueDocument = [];
        $scope.uploadedFileDocument = null;
        $scope.fileList = [];
        $scope.fileNames = [];
        $scope.fileCount = 0;

    };

    $rootScope.employeeId = 4011;
    $scope.entity = {
        employeeId: $rootScope.employeeId,
    }

    $scope.entity.type = $routeParams.type;


    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'new':

                    break;

                case 'open':

                    break;

                case 'determined':

                    break;

                default:
                    break;
            }
            if ($scope.dg_new_instance)
                $scope.dg_new_instance.refresh();
            if ($scope.dg_confirmed_instance)
                $scope.dg_confirmed_instance.refresh();
            if ($scope.dg_notDetermined_instance)
                $scope.dg_notDetermined_instance.refresh();

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

                case 'failed':

                    break;

                default:
                    break;
            }
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
        },
        onItemRendered: function (e) {
            $scope.popupselectedTabIndex = -1;
            $scope.popupselectedTabIndex = 0;
        },
        bindingOptions: {
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
        bindingOptions: {},
        onClick: function (e) {
            $rootScope.dg_new_ds = null;
            $scope.dg_confirmed_ds = null;
            $rootScope.dg_determined_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };

    $scope.btn_confirm = {
        text: 'Confirm',
        type: 'success',
        icon: 'check',
        width: 140,
        validationGroup: 'finmrpt',
        bindingOptions: {},
        onClick: function (e) {
            qaService.confirmReport($rootScope.employeeId, $scope.entity.type).then(function (response) {
            });
        }

    };

    $scope.btn_referred = {
        text: 'Referred',
        type: 'normal',
        //icon: 'check',
        width: 120,
        validationGroup: 'finmrpt',
        bindingOptions: {},
        onClick: function (e) {

        }

    };




    /////////////////////////////////////////



    $scope.bind = function () {
        qaService.getQAStatus($scope.entity).then(function (response) {
            $rootScope.dg_open_ds = response.Data.Open;
            $rootScope.dg_new_ds = response.Data.New;
            $rootScope.dg_determined_ds = response.Data.Determined;
            $scope.loadingVisible = false;
            console.log($rootScope.dg_determined_ds);

        });
    };


    //////////////////////////////////////////
    $scope.entity.dt_to = new Date().addDays(0);
    $scope.entity.dt_from = new Date().addDays(-30);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'entity.dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'entity.dt_to',

        }
    };
    //////////////////////////////////




    $scope.dg_new_columns = [


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
        { dataField: 'ReviewResultTitle', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },






    ];
    $scope.dg_new_selected = null;
    $scope.dg_new_instance = null;
    $rootScope.dg_new_ds = null;
    $scope.dg_new = {



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
        height: $(window).height() - 155,

        columns: $scope.dg_new_columns,
        onContentReady: function (e) {
            if (!$scope.dg_new_instance)
                $scope.dg_new_instance = e.component;

        },

        onRowClick: function (e) {


            var data = {
                Id: e.data.Id,
                Type: $scope.entity.type,
                EmployeeId: $rootScope.employeeId,
                isNotDetermined: true,
                Category: 'new'
            };


            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;


            switch ($scope.entity.type) {
                case '0':
                    $rootScope.$broadcast('InitQACabin', data);
                    break;
                case '1':
                    $rootScope.$broadcast('InitQAGround', data);
                    break;
                case '2':
                    $rootScope.$broadcast('InitVHR', data);
                    break;
                case '3':
                    $rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case '4':
                    $rootScope.$broadcast('InitQACatering', data);
                    break;
                case '5':
                    $rootScope.$broadcast('InitQASecurity', data);
                    break;
                case '6':
                    $rootScope.$broadcast('InitQADispatch', data);
                    break;

            }
        },

        onRowPrepared: function (e) {
            if (e.rowType == 'data' && e.data && e.data.Status == 1) {
                e.rowElement.css('background', '#ccffcc');
                $scope.dg_new_ds.ReviewResultTitle = "Closed"
            }
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_new_selected = null;
            }
            else
                $scope.dg_new_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_new_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_open_columns = [


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
        { dataField: 'ReviewResultTitle', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: 'Status', caption: ' Main Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, cellTemplate: function (container, options) {
                var value = options.data.Status;

                // Check if ReviewResultTitle is equal to 1
                if (value === 1) {
                    $('<div>')
                        .text('Closed')
                        .appendTo(container);
                } else {
                    // Display the original value if not equal to 1
                    $('<div>')
                        .text(' ')
                        .appendTo(container);
                }
            } },
        { dataField: 'ReferCount', caption: 'Referred', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ClosedCount', caption: 'Closed', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },





    ];
    $scope.dg_open_selected = null;
    $scope.dg_open_instance = null;
    $rootScope.dg_open_ds = null;
    $scope.dg_open = {
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

        columnAutoWidth: true,
        height: $(window).height() - 155,

        columns: $scope.dg_open_columns,
        onContentReady: function (e) {
            if (!$scope.dg_open_instance)
                $scope.dg_open_instance = e.component;

        },

        onRowClick: function (e) {

            var data = {
                Id: e.data.Id,
                Type: $scope.entity.type,
                EmployeeId: $rootScope.employeeId,
                Status: e.data.Status,
                Category: 'open'

            }

            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;

            var type = $scope.entity.type;
            switch (type) {
                case '0':
                    $rootScope.$broadcast('InitQACabin', data);
                    break;
                case '1':
                    $rootScope.$broadcast('InitQAGround', data);
                    break;
                case '2':
                    $rootScope.$broadcast('InitVHR', data);
                    break;
                case '3':
                    $rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case '4':
                    $rootScope.$broadcast('InitQACatering', data);
                    break;
                case '5':
                    $rootScope.$broadcast('InitQASecurity', data);
                    break;
                case '6':
                    $rootScope.$broadcast('InitQADispatch', data);
                    break;

            }
        },



        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            if (!data) {
                $scope.dg_open_selected = null;
            }
            else
                $scope.dg_open_selected = data;


        },

       
        onRowPrepared: function (e) {
            if (e.rowType == 'data' && e.data && e.data.Status == 1)
                e.rowElement.css('background', '#ccffcc');

        },

        bindingOptions: {
            dataSource: 'dg_open_ds'
        },
        columnChooser: {
            enabled: false
        },

    };




    $scope.dg_determined_columns = [


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
        { dataField: 'EmployeeStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: 'Status', caption: 'Main Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, cellTemplate: function (container, options) {
                var value = options.data.Status;

                // Check if ReviewResultTitle is equal to 1
                if (value === 1) {
                    $('<div>')
                        .text('Closed')
                        .appendTo(container);
                } else {
                    // Display the original value if not equal to 1
                    $('<div>')
                        .text(' ')
                        .appendTo(container);
                }
            } },
        { dataField: 'ReferCount', caption: 'Referred', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ClosedCount', caption: 'Closed', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },





    ];
    $scope.dg_determined_selected = null;
    $scope.dg_determined_instance = null;
    $rootScope.dg_determined_ds = null;
    $scope.dg_determined = {
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
        height: $(window).height() - 155,

        columns: $scope.dg_determined_columns,
        onContentReady: function (e) {
            if (!$scope.dg_determined_instance)
                $scope.dg_determined_instance = e.component;

        },

        onRowClick: function (e) {


            var data = {
                Id: e.data.Id,
                Type: $scope.entity.type,
                EmployeeId: $rootScope.employeeId,
                Status: e.data.Status,
            };

            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;


            switch ($scope.entity.type) {
                case '0':
                    $rootScope.$broadcast('InitQACabin', data);
                    break;
                case '1':
                    $rootScope.$broadcast('InitQAGround', data);
                    break;
                case '2':
                    $rootScope.$broadcast('InitVHR', data);
                    break;
                case '3':
                    $rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case '4':
                    $rootScope.$broadcast('InitQACatering', data);
                    break;
                case '5':
                    $rootScope.$broadcast('InitQASecurity', data);
                    break;
                case '6':
                    $rootScope.$broadcast('InitQADispatch', data);
                    break;
            };

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_determined_selected = null;
            }
            else
                $scope.dg_determined_selected = data;


        },

        onRowPrepared: function (e) {


            if (e.rowType == 'data' && e.data && e.data.Status == 1) {
                e.rowElement.css('background', '#ccffcc');
               
            }

        },

        bindingOptions: {
            dataSource: 'dg_determined_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
















    /////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        height: function () { return $(window).height() - 200 },

    };

    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> ' + $rootScope.Title;


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

    //$rootScope.$broadcast('FlightsReportLoaded', null);
}]);