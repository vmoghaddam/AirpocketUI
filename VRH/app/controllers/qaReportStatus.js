'use strict';
app.controller('qaReportStatus', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'qaService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, qaService, aircraftService, authService, notificationService, $route) {
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        // { text: "Active", id: 'active' },
        { text: "Active", id: 'new' },
        { text: "Closed", id: 'determined' },

        // { text: "In Progress", id: 'open' },

    ];


    $scope.clearEntity = function () {
        $scope.uploaderValueDocument = [];
        $scope.uploadedFileDocument = null;
        $scope.fileList = [];
        $scope.fileNames = [];
        $scope.fileCount = 0;

    };

    $scope.entity = {
        employeeId: $rootScope.employeeId,
    }

    $scope.entity.type = $routeParams.type;
    $scope.selected_type = Number($scope.entity.type);




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
            if ($scope.dg_open_instance)
                $scope.dg_open_instance.refresh();
            if ($scope.dg_determined_instance)
                $scope.dg_determined_instance.refresh();

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

    $scope.bind_forms = function () {
        $scope.entity.type = $scope.selected_type;
        //qaService.getQAStatus($scope.entity).then(function (response) {
        //    qaService.qa_get_visited($rootScope.employeeId, $scope.selected_type).then(function (response2) {
        //        $rootScope.dg_new_ds = response.Data.Active;
        //        $rootScope.dg_determined_ds = response.Data.Determined;
        //        $scope.loadingVisible = false;
        //    });
        //});

        qaService.getQAStatus($scope.entity).then(function (response) {
            qaService.qa_get_visited($rootScope.employeeId, $scope.selected_type).then(function (response2) {
                var visitedForms = Enumerable.From(response2.Data).Select('$.form_id').ToArray();

                $rootScope.dg_new_ds = Enumerable.From(response.Data.Active)
                    .Select(item => {
                        item.isVisited = visitedForms.includes(item.Id) ? true : false;
                        return item;
                    })
                    .ToArray();

                $rootScope.dg_determined_ds = Enumerable.From(response.Data.Determined)
                    .Select(item => {
                        item.isVisited = visitedForms.includes(item.Id) ? true : false;
                        return item;
                    })
                    .ToArray();

                $scope.loadingVisible = false;
            });
        });


    }

    $scope.bind = function () {

        qaService.getQAByEmployee($rootScope.employeeId).then(function (response2) {
            $scope.qaStatus = response2.Data;
            $scope.bind_forms();

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
            }, name: 'row', caption: '#', minWidth: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'Category', caption: 'Status', name: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DateStatus', caption: 'Status Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 120 },
        //  { dataField: 'TypeTitle', caption: 'Form Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'FormNo', caption: 'Form No', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 180 },

        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'FlightDate', caption: 'Flight Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'EmployeeName', caption: 'Reporter', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        // { dataField: 'ReviewResultTitle', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'DeadLine', caption: 'DeadLine', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
        {
            dataField: 'Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,
            cellTemplate: function (container, options) {
                var priority = options.data.Priority;
                var priorityText = (priority === 0) ? 'Critical' : priority;
                var priorityText = (priority === 1) ? 'Major' : priority;
                var priorityText = (priority === 2) ? 'Minor' : priority;

                $("<div>")
                    .html(priorityText)
                    .appendTo(container);
            }
        },



    ];

    $scope.get_height = function () {
        var h = $(window).height() - 110;
        return {
            'height': h + 'px',
        }
    }

    $scope.showStatus = function (type, type_title) {
        $scope.selected_type = Number(type);
        $scope.bind_forms();

    }
    $scope.get_tile_class = function (type) {
        if (Number(type) == $scope.selected_type)
            return 'tile_selected';

        return 'tile_header';
    }

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
        height: $(window).height() - 180,

        columns: $scope.dg_new_columns,
        onContentReady: function (e) {
            if (!$scope.dg_new_instance)
                $scope.dg_new_instance = e.component;

        },

        onRowClick: function (e) {


            var data = {
                Id: e.data.Id,
                Type: $scope.selected_type,
                EmployeeId: $rootScope.employeeId,
                isNotDetermined: true,
                Category: 'new',
                ProducerId: e.data.EmployeeId,
                FlightId: e.data.FlightId,
                Priority: e.data.Priority,
                Entity: e.data
            };


            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;


            switch ($scope.selected_type) {

                case 0:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQACabin', data);
                    break;
                case 1:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQAGround', data);
                    break;
                case 2:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitVHR', data);
                    break;
                case 3:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case 4:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQACatering', data);
                    break;
                case 5:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQASecurity', data);
                    break;
                case 6:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case 7:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case 8:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case 9:
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;

            }
        },

        onRowPrepared: function (e) {

          
            if (e.rowType == 'data' && e.data && e.data.Status == 1) {
                e.rowElement.css('background', '#ccffcc');
                $scope.dg_new_ds.ReviewResultTitle = "Closed"
            }

            if (e.rowType == 'data' && e.data && e.data.DeadLine != null) {
                e.rowElement.css('background', '#ffcc99');

            }
            if (e.rowType == 'data' && e.data && e.data.isVisited == true && e.rowElement) {
                $(e.rowElement).css('font-weight', 'bold');
            }


        },


        onCellPrepared: function (e) {
            if (e.column.name != "Category")
                return;
            if (e.data && e.data.CategoryOrder == 1) {

                e.cellElement.css('background', '#ffcc66');
            }
            if (e.data && e.data.CategoryOrder == 2) {

                e.cellElement.css('background', '#ffff99');
            }
            if (e.data && e.data.CategoryOrder == 3) {

                e.cellElement.css('background', '#b3e6ff');
            }
            if (e.data && e.data.CategoryOrder == 4) {

                e.cellElement.css('background', '#66ffcc');
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


        { dataField: 'FormNo', caption: 'Form No', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 180 },
        { dataField: 'DeadLine', caption: 'DeadLine', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
        {
            dataField: 'Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,
            cellTemplate: function (container, options) {
                var priority = options.data.Priority;
                var priorityText = (priority === 0) ? 'Critical' : priority;
                var priorityText = (priority === 1) ? 'Major' : priority;
                var priorityText = (priority === 2) ? 'Minor' : priority;

                $("<div>")
                    .html(priorityText)
                    .appendTo(container);
            }
        },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'FlightDate', caption: 'Flight Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'EmployeeName', caption: 'Reporter', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
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
            }
        },
        { dataField: 'ReferCount', caption: 'Referred', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ClosedCount', caption: 'Closed', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },






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
                Type: $scope.selected_type,
                EmployeeId: $rootScope.employeeId,
                isNotDetermined: true,
                Category: 'open',
                ProducerId: e.data.EmployeeId,
                FlightId: e.data.FlightId,
                Priority: e.data.Priority,
                Entity: e.data
            };
            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;

            switch ($scope.selected_type) {
                case '0':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    break;
                case '1':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQAGround', data);
                    break;
                case '2':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitVHR', data);
                    break;
                case '3':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case '4':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQACatering', data);
                    break;
                case '5':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQASecurity', data);
                    break;
                case '6':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '7':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '8':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '9':
                    qaService.qa_update_visited($rootScope.employeeId, $scope.selected_type, e.data.Id).then(function (response) {
                        $rootScope.$broadcast('InitOperationPopup', data);
                        $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                            .Select(item => {
                                if (item.Id == e.data.Id) {
                                    item.isVisited = true;
                                }
                                return item;
                            })
                            .ToArray();
                        if ($scope.dg_new_instance)
                            $scope.dg_new_instance.refresh();
                    });
                    //$rootScope.$broadcast('InitQADispatch', data);
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

            if (e.rowType == 'data' && e.data && e.data.DeadLine != null) {
                e.rowElement.css('background', '#ffcc99');

            }

            if (e.rowType == 'data' && e.data && e.data.isVisited == true) {
                e.rowElement.css(' font-weight', 'bold');

            }

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


        { dataField: 'FormNo', caption: 'FormNo', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 180 },
        { dataField: 'DeadLine', caption: 'DeadLine', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
        {
            dataField: 'Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,
            cellTemplate: function (container, options) {
                var priority = options.data.Priority;
                var priorityText = (priority === 0) ? 'Critical' : priority;
                var priorityText = (priority === 1) ? 'Major' : priority;
                var priorityText = (priority === 2) ? 'Minor' : priority;

                $("<div>")
                    .html(priorityText)
                    .appendTo(container);
            },
        },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'Flight Date', caption: 'FlightDate', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'EmployeeName', caption: 'Reporter', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
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
            }
        },
        { dataField: 'ReferCount', caption: 'Referred', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ClosedCount', caption: 'Closed', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },




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
                Type: $scope.selected_type,
                EmployeeId: $rootScope.employeeId,
                isNotDetermined: true,
                ProducerId: e.data.EmployeeId,
                FlightId: e.data.FlightId,
                Priority: e.data.Priority,
                Entity: e.data
            };

            if (e.data.Status == 1)
                data.isNotLocked = false;
            else
                data.isNotLocked = true;


            switch ($scope.selected_type) {
                case '0':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQACabin', data);
                    break;
                case '1':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQAGround', data);
                    break;
                case '2':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitVHR', data);
                    break;
                case '3':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQAMaintenance', data);
                    break;
                case '4':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQACatering', data);
                    break;
                case '5':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQASecurity', data);
                    break;
                case '6':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '7':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '8':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;
                case '9':
                    $rootScope.$broadcast('InitOperationPopup', data);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds)
                        .Select(item => {
                            if (item.Id == e.data.Id) {
                                item.isVisited = true;
                            }
                            return item;
                        })
                        .ToArray();
                    if ($scope.dg_new_instance)
                        $scope.dg_new_instance.refresh();
                    //$rootScope.$broadcast('InitQADispatch', data);
                    break;

            }

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

            if (e.rowType == 'data' && e.data && e.data.DeadLine != null) {
                e.rowElement.css('background', '#ffcc99');

            }

            if (e.rowType == 'data' && e.data && e.data.isVisited == true) {
                e.rowElement.css(' font-weight', 'bold');

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


    $scope.get_title = function () {
        switch ($scope.selected_type) {
            case 0:
                return 'Cabin Safety Reports';
                break;
            case 1:
                return 'Ground Incident/Accident/Damage Report';
                break;
            case 2:
                return 'Voluntary Hazard Reporting';
                break;
            case 3:
                return 'Maintenance Occurance Repor';
                break;
            case 4:
                return 'Catering Hazard Report';
                break;
            case 5:
                return 'Security Hazard Report';
                break;
            case 6:
                return 'Dispatch Hazard Report';
                break;
            case 7:
                return 'Cyber Security Report';
                break;
            case 8:
                return 'Air Safety Report';
                break;
            case 9:
                return 'Voyage Report';
                break;
            default:
                return 'Others';
                break;
        }
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        //$rootScope.Title = $routeParams.title.replaceAll('_','/');
        //2024-01-17
        //console.log('type',$scope.entity.type);
        //console.log('Route Params',$routeParams.type);
        //switch($routeParams.type){
        //	case '0':
        //		$rootScope.page_title = '> ' + 'Cabin Safety Reports';
        //		break;
        //		case '1':
        //		$rootScope.page_title = '> ' + 'Ground Incident/Accident/Damage Report';
        //		break;
        //		case '2':
        //		$rootScope.page_title = '> ' + 'Voluntary Hazard Reporting';
        //		break;
        //		case '3':
        //		$rootScope.page_title = '> ' + 'Maintenance Occurence Repor';
        //		break;
        //		case '4':
        //		$rootScope.page_title = '> ' + 'Catering Hazard Report';
        //		break;
        //		case '5':
        //		$rootScope.page_title = '> ' + 'Security Hazard Report';
        //		break;
        //		case '6':
        //		$rootScope.page_title = '> ' + 'Dispatch Hazard Report';
        //		break;
        //		case '7':
        //		$rootScope.page_title = '> ' + 'Cyber Security Report';
        //		break;
        //		case '8':
        //		$rootScope.page_title = '> ' + 'Air Safety Report';
        //		break;
        //		case '9':
        //		$rootScope.page_title = '> ' + 'Voyage Report';
        //		break;
        //	default:
        //		$rootScope.page_title = '> ' + 'Others';
        //		break;
        //}
        $rootScope.page_title = '> ' + 'Safety Forms';


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