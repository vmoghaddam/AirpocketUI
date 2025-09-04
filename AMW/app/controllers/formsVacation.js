'use strict';
app.controller('formsVacationController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', '$route', 'schedulingService',
    function ($scope, $location, $routeParams, $rootScope, flightService, authService, $route, schedulingService) {

        $scope.caption = 'Requests';
        $scope.url = 'api/vacation/forms/all';
        //////////////////////////////////
        $scope.dsUrl = null;
        $scope.filterVisible = false;
        $scope.btn_delete = {
            text: 'Delete',
            type: 'danger',
            icon: 'clear',
            width: 120,

            onClick: function (e) {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }

                General.Confirm(Config.Text_DeleteConfirm, function (res) {
                    if (res) {

                        var dto = { Id: $scope.dg_selected.Id, };
                        $scope.loadingVisible = true;
                        organizationService.delete(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.doRefresh = true;
                            $scope.bind();



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                });
            }
        };
        $scope.old_status = null;
        $scope.btn_new = {
            text: 'View',
            type: 'default',

            width: 120,
            onClick: function (e) {

                var ins = null;
                if ($scope.selectedTabId == 'new')
                    ins = $scope.dg_instance;
                else if ($scope.selectedTabId == 'rejected')
                    ins = $scope.dg_instance_rej;
                else
                    ins = $scope.dg_instance_acc;


                $scope.dg_selected = $rootScope.getSelectedRow(ins);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                $scope.entity = JSON.parse(JSON.stringify($scope.dg_selected));
                $scope.old_status = $scope.entity.Status;
                $scope.popup_newform_visible = true;
            }

        };
        $scope.btn_edit = {
            text: 'Edit',
            type: 'default',
            icon: 'edit',
            width: 120,

            onClick: function (e) {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var data = $scope.dg_selected;
                data._tid = $scope.TypeId;
                $rootScope.$broadcast('InitAddOrganization', data);
            }

        };
        $scope.btn_view = {
            text: 'View',
            type: 'default',
            icon: 'doc',
            width: 120,
            onClick: function (e) {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var data = $scope.dg_selected;
                $scope.InitAddAirport(data);
            }

        };
        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width: 120,

            bindingOptions: {},
            onClick: function (e) {

                //  $scope.$broadcast('getFilterQuery', null);
                $scope.dg_ds = null;
                //$scope.bind_new(function () {
                $scope.bind_approved(function () {

                   // $scope.bind_acc(function () {
                   //     $scope.bind_rej();

                   // });
                });
            }

        };
        $scope.btn_print = {
            text: 'Print',
            type: 'default',
            icon: 'print',
            width: 120,

        };
        $scope.btn_filter = {
            text: '',
            type: 'default',
            icon: 'filter',
            width: 40,
            onClick: function (e) {
                if ($scope.filterVisible) {
                    $scope.filterVisible = false;
                    $('.filter').fadeOut();
                }
                else {
                    $scope.filterVisible = true;
                    $('.filter').fadeIn();
                }
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
        $scope.selectedTabIndex = -1;
        $scope.selectedTabId = null;
        $scope.tabs = [
            { text: "New", id: 'new' },
            { text: "Accepted", id: 'accpeted' },
            { text: "Rejected", id: 'rejected' },


        ];

        $scope.$watch("selectedTabIndex", function (newValue) {
            //ati
            try {
                $('.tabc').hide();
                var id = $scope.tabs[newValue].id;
                $scope.selectedTabId = id;
                $('#' + id).fadeIn();


                if ($scope.dg_instance)
                    $scope.dg_instance.refresh();
                if ($scope.dg_instance_acc)
                    $scope.dg_instance_acc.refresh();
                if ($scope.dg_instance_rej)
                    $scope.dg_instance_rej.refresh();


                //$scope.dg_crew_instance.refresh();
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
        ///////////////////////////////////
        $scope.filters = [];

        $scope.dg_columns_publisher = [
            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },
            { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'desc', fixed: true, fixedPosition: 'left' },
            { dataField: 'ReasonStr', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
            { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },
            { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },

            { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
            { dataField: 'ResponsibleRemark', caption: 'Responsible Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
            // { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
            // { dataField: 'DateStatus', caption: '', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', fixed: true, fixedPosition: 'right' },
        ];
        $scope.dg_columns = [];
        $scope.dg_columns = $scope.dg_columns_publisher;

        $scope.dg_selected = null;
        $scope.dg_instance = null;
        $scope.dg_ds = null;
        $scope.dg = {
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
            width: '100%',
            columns: $scope.dg_columns,
            onContentReady: function (e) {
                if (!$scope.dg_instance)
                    $scope.dg_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_selected = null;
                }
                else
                    $scope.dg_selected = data;


            },
            onCellPrepared: function (e) {
                if (e.rowType === "data" && e.column.dataField == "Status") {
                    $scope.styleCell(e, e.data.Status);
                }
                if (e.rowType === "data" && e.column.dataField == "ReasonStr") {
                    var clr = "";
                    switch (e.data.Reason) {
                        case 1:
                            clr = '#e6ccff';
                            break;
                        case 2:
                            clr = '#b3e6ff';
                            break;
                        case 3:
                            clr = '#ffffb3';
                            break;
                        case 4:
                            clr = '#ffb3d1';
                            break;
                        case 5:
                            clr = '#b3ffff';
                            break;
                        case 6:
                            clr = '#ffb3b3';
                            break;
                        case 7:
                            clr = '#c6ffb3';
                            break;
                        case 8:
                            clr = '#c2c2a3';
                            break;
                        case 9:
                            clr = '#b3b3ff';
                            break;
                        case 10:
                            clr = '#d9d9d9';
                            break;
                        default:
                            break;
                    }
                    if (clr) {
                        e.cellElement.css("backgroundColor", clr);
                    }
                }
            },
            onRowPrepared: function (e) {
                if (e.rowType === "data") {
                    //$scope.styleCell(e, e.data.Status);
                    if (!e.data.Status) { } else
                        if (e.data.Status == 'Accepted') { e.rowElement.css("backgroundColor", "#e6fff5"); }
                        else { e.rowElement.css("backgroundColor", "#ffeecc"); }
                }
            },
            bindingOptions: {
                dataSource: 'dg_ds'
            }
        };

        ////////Accepted/////////////////////
        $scope.dg_columns_acc = [
            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },
            { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'desc', fixed: true, fixedPosition: 'left' },
            { dataField: 'ReasonStr', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
            { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },
            { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },

            { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
            { dataField: 'OperationRemak', caption: 'Scheduling Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
            { dataField: 'OperationRemak', caption: 'Responsible Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
            { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
            { dataField: 'DateStatus', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', fixed: true, fixedPosition: 'right' },
        ];


        $scope.dg_selected_acc = null;
        $scope.dg_instance_acc = null;
        $scope.dg_ds_acc = null;
        $scope.dg_acc = {
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
            width: '100%',
            columns: $scope.dg_columns_acc,
            onContentReady: function (e) {
                if (!$scope.dg_instance_acc)
                    $scope.dg_instance_acc = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_selected_acc = null;
                }
                else
                    $scope.dg_selected_acc = data;


            },
            onCellPrepared: function (e) {
                if (e.rowType === "data" && e.column.dataField == "Status") {
                    $scope.styleCell(e, e.data.Status);
                }
                if (e.rowType === "data" && e.column.dataField == "ReasonStr") {
                    var clr = "";
                    switch (e.data.Reason) {
                        case 1:
                            clr = '#e6ccff';
                            break;
                        case 2:
                            clr = '#b3e6ff';
                            break;
                        case 3:
                            clr = '#ffffb3';
                            break;
                        case 4:
                            clr = '#ffb3d1';
                            break;
                        case 5:
                            clr = '#b3ffff';
                            break;
                        case 6:
                            clr = '#ffb3b3';
                            break;
                        case 7:
                            clr = '#c6ffb3';
                            break;
                        case 8:
                            clr = '#c2c2a3';
                            break;
                        case 9:
                            clr = '#b3b3ff';
                            break;
                        case 10:
                            clr = '#d9d9d9';
                            break;
                        default:
                            break;
                    }
                    if (clr) {
                        e.cellElement.css("backgroundColor", clr);
                    }
                }
            },
            onRowPrepared: function (e) {
                if (e.rowType === "data") {
                    //$scope.styleCell(e, e.data.Status);
                    if (!e.data.Status) { } else
                        if (e.data.Status == 'Accepted') { e.rowElement.css("backgroundColor", "#b3ffe0"); }
                        else { e.rowElement.css("backgroundColor", "#ffeecc"); }
                }
            },
            bindingOptions: {
                dataSource: 'dg_ds_acc'
            }
        };
        /////REJECTED
        $scope.dg_columns_rej = [
            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },
            { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'desc', fixed: true, fixedPosition: 'left' },
            { dataField: 'ReasonStr', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
            { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },
            { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },

            { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
            { dataField: 'OperationRemak', caption: 'Ops. Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
            { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
            { dataField: 'DateStatus', caption: '', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', fixed: true, fixedPosition: 'right' },
        ];


        $scope.dg_selected_rej = null;
        $scope.dg_instance_rej = null;
        $scope.dg_ds_rej = null;
        $scope.dg_rej = {
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
            width: '100%',
            columns: $scope.dg_columns_rej,
            onContentReady: function (e) {
                if (!$scope.dg_instance_rej)
                    $scope.dg_instance_rej = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_selected_rej = null;
                }
                else
                    $scope.dg_selected_rej = data;


            },
            onCellPrepared: function (e) {
                if (e.rowType === "data" && e.column.dataField == "Status") {
                    $scope.styleCell(e, e.data.Status);
                }
                if (e.rowType === "data" && e.column.dataField == "ReasonStr") {
                    var clr = "";
                    switch (e.data.Reason) {
                        case 1:
                            clr = '#e6ccff';
                            break;
                        case 2:
                            clr = '#b3e6ff';
                            break;
                        case 3:
                            clr = '#ffffb3';
                            break;
                        case 4:
                            clr = '#ffb3d1';
                            break;
                        case 5:
                            clr = '#b3ffff';
                            break;
                        case 6:
                            clr = '#ffb3b3';
                            break;
                        case 7:
                            clr = '#c6ffb3';
                            break;
                        case 8:
                            clr = '#c2c2a3';
                            break;
                        case 9:
                            clr = '#b3b3ff';
                            break;
                        case 10:
                            clr = '#d9d9d9';
                            break;
                        default:
                            break;
                    }
                    if (clr) {
                        e.cellElement.css("backgroundColor", clr);
                    }
                }
            },
            onRowPrepared: function (e) {
                if (e.rowType === "data") {
                    //$scope.styleCell(e, e.data.Status);
                    if (!e.data.Status) { } else
                        if (e.data.Status == 'Accepted') { e.rowElement.css("backgroundColor", "#e6fff5"); }
                        else { e.rowElement.css("backgroundColor", "#ffd480"); }
                }
            },
            bindingOptions: {
                dataSource: 'dg_ds_rej'
            }
        };
        ///////////////////////////

        $scope.styleCell = function (e, value) {
            if (!value) {

                e.cellElement.css("backgroundColor", "#a6a6a6");
                e.cellElement.css("color", "#fff");
                return;
            }
            if (value > 45)
                return;
            //moradi2


            if (value == 'Accepted') {
                e.cellElement.css("backgroundColor", "#00e6ac");
                e.cellElement.css("color", "#000");
            }
            else {
                e.cellElement.css("backgroundColor", "#ff9966");
                e.cellElement.css("color", "#000");
            }

        }
        $scope.doRefresh = false;

        $scope.getFilters = function () {
            var filters = $scope.filters;
            if (filters.length == 0)
                filters = [['Id', '>', 0]];
            else {
                //filters.push('and');
                //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

            }


            return filters;
        };
        $scope.bind = function () {


            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: serviceForms + $scope.url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['Title'],

            };

            $scope.dg_instance.refresh();
            //if ($scope.doRefresh) {
            //    $scope.filters = $scope.getFilters();
            //    $scope.dg_ds.filter = $scope.filters;
            //    $scope.dg_instance.refresh();
            //    $scope.doRefresh = false;
            //}

        };
        $scope.bind_approved = function (callback) {
            flightService.getReqApproved().then(function (response) {
                console.log(response);
                $scope.ds_all=response;
                $scope.dg_ds = Enumerable.From($scope.ds_all).Where('$.Status != "Accepted" && $.Status != "Rejected"').ToArray();
                $scope.dg_ds_acc = Enumerable.From($scope.ds_all).Where('$.Status == "Accepted"').ToArray();
                $scope.dg_ds_rej = Enumerable.From($scope.ds_all).Where('$.Status == "Rejected"').ToArray();
                //$scope.dg_ds = response;

                if (callback)
                    callback();



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };
        //  $scope.bind_new = function (callback) {
        //    flightService.getReqNew().then(function (response) {
        //        console.log(response);

        //        $scope.dg_ds = response;

        //        if (callback)
        //            callback();



        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //};
        $scope.bind_acc = function (callback) {
            flightService.getReqAcc().then(function (response) {
                console.log(response);

                $scope.dg_ds_acc = response;

                if (callback)
                    callback();



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };
        $scope.bind_rej = function (callback) {
            flightService.getReqRej().then(function (response) {
                console.log(response);

                $scope.dg_ds_rej = response;

                if (callback)
                    callback();



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };
        /////////////////////////////
        $scope.dt_from = new Date();
        $scope.date_from = {
            type: "date",
            width: '100%',
            readOnly: true,
            pickerType: "rollers",
            displayFormat: "yyyy-MMM-dd",

            onValueChanged: function (arg) {

            },
            bindingOptions: {
                value: 'entity.DateFrom',

            }
        };
        $scope.dt_to = new Date();
        $scope.date_to = {
            type: "date",
            width: '100%',
            readOnly: true,
            pickerType: "rollers",
            displayFormat: "yyyy-MMM-dd",

            onValueChanged: function (arg) {

            },
            bindingOptions: {
                value: 'entity.DateTo',

            }
        };
        $scope.reasons = [
            { id: 1, title: 'Vacation' },
            // { id: 2, title: 'Medical Care' },
            // { id: 3, title: 'Other' },
        ];
        $scope.statusds = [
            { id: 1, title: 'Accepted' },
            { id: -1, title: 'Rejected' },

        ];

        $scope.reason = 'Vacation';
        $scope.sb_reason = {
            showClearButton: false,
            searchEnabled: false,
            dataSource: $scope.reasons,
            displayExpr: 'title',
            placeholder: '',
            valueExpr: 'id',
            readOnly: true,
            bindingOptions: {
                value: 'entity.Reason'

            }
        };
        $scope.sb_status = {
            showClearButton: false,
            searchEnabled: false,
            dataSource: $scope.statusds,
            displayExpr: 'title',
            placeholder: '',
            valueExpr: 'title',

            bindingOptions: {
                value: 'entity.Status'

            }
        };

        $scope.remark = '';
        $scope.txt_remark = {
            readOnly: true,
            rtlEnabled: true,
            bindingOptions: {
                value: 'entity.Remark',
                height: '170',

            }
        };
        $scope.txt_remarkops = {

            bindingOptions: {
                value: 'entity.OperationRemak',
                height: '320',

            }
        };
        $scope.txt_remarkscheduling = {

            bindingOptions: {
                value: 'entity.SchedulingRemark',
                height: '320',

            }
        };
        //txt_remarkscheduling
        $scope.txt_name = {
            readOnly: true,
            bindingOptions: {
                value: 'entity.Name',


            }
        };
        $scope.txt_group = {
            readOnly: true,
            bindingOptions: {
                value: 'entity.JobGroup',

            }
        };
        $scope.txt_mobile = {
            readOnly: true,
            bindingOptions: {
                value: 'entity.Mobile',


            }
        };
        $scope.txt_pid = {
            readOnly: true,
            bindingOptions: {
                value: 'entity.PID',


            }
        };
        $scope.date_create = {
            type: "date",
            width: '100%',
            pickerType: "rollers",
            displayFormat: "yyyy-MMM-dd",
            readOnly: true,
            onValueChanged: function (arg) {

            },
            bindingOptions: {
                value: 'entity.DateCreate',

            }
        };



        $scope.dg_duties_columns = [

            { dataField: 'DateStartLocal', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yyyy-MM-dd HH:mm', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
            { dataField: 'DateEndLocal', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yyyy-MM-dd HH:mm', fixed: true, fixedPosition: 'left' },
            { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            { dataField: 'InitRoute', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },


        ];


        $scope.dg_selected_duties = null;
        $scope.dg_instance_duties = null;
        $scope.dg_ds_duties = null;
        $scope.dg_duties = {
            headerFilter: {
                visible: false
            },
            filterRow: {
                visible: false,
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
            height: 445,
            width: '100%',

            columns: $scope.dg_duties_columns,
            onContentReady: function (e) {
                if (!$scope.dg_instance_duties)
                    $scope.dg_instance_duties = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_selected_duties = null;
                }
                else
                    $scope.dg_selected_duties = data;


            },
            onRowPrepared: function (e) {
                if (e.rowType === "data") {
                    //$scope.styleCell(e, e.data.Status);
                    if (e.data.conflict) {
                        e.rowElement.css("backgroundColor", "#ff704d");
                    }
                }
            },


            bindingOptions: {
                dataSource: 'dg_ds_duties'
            }
        };

        $scope.saveDuty = function (callback) {
            //2023

            //100008 Requested Off
            var dto = {
                DateStart: new Date($scope.entity.DateFrom),
                DateEnd: new Date($scope.entity.DateTo),
                CityId: -1,
                CrewId: $scope.entity.EmployeeId,
                DutyType:$scope.entity.Reason==0? 1169:100008,
                Remark: $scope.entity.Remark,
                EXTRERRP: 0,
            }
            dto.BL = 0;
            dto.FX = 0;


            $scope.loadingVisible = true;

            schedulingService.saveDuty(dto).then(function (response) {
                $scope.loadingVisible = false;
                //2023
                if (response.Code == '406') {

                    General.ShowNotify(response.message, 'error');
                    return;

                }
                ////////////
                console.log('saveDuty   ', response);
                var _ids = [];
                _ids.push(response.Id);
                var _dto = { Ids: _ids, Date: new Date(), UserName: $rootScope.userName };
                schedulingService.dutiesVisible(_dto).then(function (responsev) {
                     
                    callback(response.Id);
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };



        var duties_width = 1200;
        if ($(window).width() - 100 < 1200)
            duties_width = $(window).width();
        $scope.save = function (dto) {
			console.log('dto', dto);
            $scope.loadingVisible = true;
            flightService.updateFormVacation(dto).then(function (response) {
                $scope.loadingVisible = false;
               
                $scope.ds_all = Enumerable.From($scope.ds_all).Where('$.Id!=' + response.Id).ToArray();
                $scope.ds_all.push(JSON.parse(JSON.stringify(response)));
                $scope.dg_ds = Enumerable.From($scope.ds_all).Where('$.Status != "Accepted" && $.Status != "Rejected"').ToArray();
                $scope.dg_ds_acc = Enumerable.From($scope.ds_all).Where('$.Status == "Accepted"').ToArray();
                $scope.dg_ds_rej = Enumerable.From($scope.ds_all).Where('$.Status == "Rejected"').ToArray();

               /* if ($scope.old_status != dto.Status) {
                    if (!$scope.old_status)
                        $scope.dg_ds = Enumerable.From($scope.dg_ds).Where('$.Id!=' + dto.Id).ToArray();
                    if ($scope.old_status == 'Accepted')
                        $scope.dg_ds_acc = Enumerable.From($scope.dg_ds_acc).Where('$.Id!=' + dto.Id).ToArray();
                    if ($scope.old_status == 'Rejected')
                        $scope.dg_ds_rej = Enumerable.From($scope.dg_ds_rej).Where('$.Id!=' + dto.Id).ToArray();

                    if (dto.Status == 'Accepted')
                        $scope.dg_ds_acc.push(response);
                    if (dto.Status == 'Rejected')
                        $scope.dg_ds_rej.push(response);
                    if (!dto.Status)
                        $scope.dg_ds.push(response);


                }*/


                $scope.popup_newform_visible = false;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        $scope.popup_newform_visible = false;
        $scope.popup_newform = {
            height: 610,
            width: duties_width,//$(window).width()-100,
            title: 'Form',
            showTitle: true,

            toolbarItems: [



                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'default', text: 'Save', validationGroup: 'formvacupd', onClick: function (e) {
                            var result = e.validationGroup.validate();

                            if (!result.isValid) {
                                General.ShowNotify(Config.Text_FillRequired, 'error');
                                return;
                            }

                            var dto = {
                                Id: $scope.entity.Id,
                                UserId: $scope.entity.UserId,
                                DateFrom: $scope.entity.DateFrom,
                                DateTo: $scope.entity.DateTo,
                                ReasonStr: $scope.entity.ReasonStr,
                                Reason: $scope.entity.Reason,
                                Remark: $scope.entity.Remark,
                                SchedulingRemark: $scope.entity.SchedulingRemark,
                                Status: $scope.entity.Status,
                                OperatorId: $scope.entity.OperatorId,
                            };

console.log(dto);
console.log($scope.entity)



                            //alert($scope.entity.Status);
                            if ($scope.entity.Status =='Accepted') {
                                var not_allowed = [1165, 1167, 1170, 1168, 300010, 5000, 5001, 300014, 100001, 100025, 100003];
                                var conflict_types = Enumerable.From($scope.dg_ds_duties).Where(function (x) { return x.conflict == true && not_allowed.indexOf(x.DutyType) != -1; }).ToArray();
                                if (conflict_types && conflict_types.length > 0) {
                                    General.ShowNotify('Interuption Error', 'error');
                                    return;
                                }
                                //alert($scope.entity.FDPId);
                                if ($scope.entity.FDPId) {
                                    dto.FDPId = $scope.entity.FDPId;
                                    $scope.save(dto);
                                }
                                else {
                                    $scope.saveDuty(function (fdp_id) {
                                        dto.FDPId = fdp_id;
                                        $scope.save(dto);
                                    });
                                }
 
                               
                            }
                            else
                                $scope.save(dto);






                        }
                    }, toolbar: 'bottom'
                },
                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                            $scope.popup_newform_visible = false;
                        }
                    }, toolbar: 'bottom'
                }

            ],

            visible: false,
            dragEnabled: true,
            closeOnOutsideClick: false,
            onShowing: function (e) {

            },
            onShown: function (e) {
                $scope.dg_instance_duties.refresh();
                flightService.getRequesterDuties($scope.dg_selected.Id).then(function (response) {
                    //11-30

                    $.each(response, function (_i, _d) {
                        var dt_start = Number(moment(_d.DateStartLocal).format('YYYYMMDD'));
                        var dt_end = Number(moment(_d.DateEndLocal).format('YYYYMMDD'));
                        var req_start = Number(moment($scope.entity.DateFrom).format('YYYYMMDD'));
                        var req_end = Number(moment($scope.entity.DateTo).format('YYYYMMDD'));
                        if (
                            (dt_start >= req_start && dt_start <= req_end) ||
                            (dt_end >= req_start && dt_end <= req_end) ||
                            (req_start >= dt_start && req_start <= dt_end) ||
                            (req_end >= dt_start && req_end <= dt_end)
                        )
                            _d.conflict = true;

                    });
                    $scope.dg_ds_duties = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            },
            onHiding: function () {

                //$scope.clearEntity();
                $scope.dg_instance.refresh();
                $scope.popup_newform_visible = false;

            },
            onHidden: function () {

                if ($scope.dg_instance)
                    $scope.dg_instance.refresh();
                if ($scope.dg_instance_acc)
                    $scope.dg_instance_acc.refresh();
                if ($scope.dg_instance_rej)
                    $scope.dg_instance_rej.refresh();
            },
            onContentReady: function (e) {

            },
            bindingOptions: {
                visible: 'popup_newform_visible',


            }
        };
        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> ' + $scope.caption;
           
        }
        //////////////////////////////////////////
        $scope.$on('getFilterResponse', function (event, prms) {

            $scope.filters = prms;

            $scope.doRefresh = true;
            //$scope.bind_new();
            $scope.bind_approved();

        });
        $scope.$on('onTemplateSearch', function (event, prms) {

            $scope.$broadcast('getFilterQuery', null);
        });
        $scope.$on('onOrganizationSaved', function (event, prms) {

            $scope.doRefresh = true;
        });
        $scope.$on('onOrganizationHide', function (event, prms) {

            //$scope.bind_new();
            $scope.bind_approved();

        });
        //////////////////////////////////////////
        $rootScope.$broadcast('OrganizationLoaded', null);
        $scope.$on('$viewContentLoaded', function () {

            $('.vacationsx').fadeIn(400, function () {
                ////////////////////////////////
                setTimeout(function () {
                    //  $scope.$broadcast('getFilterQuery', null);
                    $scope.dg_ds = null;
                    //$scope.bind_new(function () {
                    $scope.bind_approved(function () {

                        // $scope.bind_acc(function () {
                        //     $scope.bind_rej();

                        // });
                    });
                }, 1000);








                ///////////////////////////////////
            });


        });
        ///end
    }]);