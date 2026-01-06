'use strict';
app.controller('forms_vacation_responsibleController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, authService, $route) {

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
            $scope.old_status = $scope.entity.ResponsibleActionId;
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
            // $scope.bind_new(function () {
            $scope.bind_all_responsible(function () {

                //$scope.bind_acc(function () {
                //    $scope.bind_rej();

                //});
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
        { text: "Archived", id: 'accpeted' },
      //  { text: "Rejected", id: 'rejected' },


    ];
    $scope.btn_view_visible = false;
    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            $scope.btn_view_visible = id == 'accpeted';
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
        
        { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'desc', fixed: true, fixedPosition: 'left' },
      //  { dataField: 'ReasonStr', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
      //  { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
     //   { dataField: 'OperationRemak', caption: 'Ops. Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
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
    ////////////////////////////////
    $scope.format_date = function (dt) {
        if (!dt)
            return null;
        return moment(dt).format('YYYY-MMM-DD');
    }
    ////////Accepted/////////////////////
    $scope.dg_columns_acc = [
        
       // { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'yy-MM-dd', sortIndex: 0, sortOrder: 'desc', fixed: true, fixedPosition: 'left' },
       // { dataField: 'ReasonStr', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
       // { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'MMM-dd', },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'MMM-dd', },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
        { dataField: 'SchedulingRemark', caption: 'Scheduling Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, },
        {
            dataField: 'ResponsibleAction',
            caption: 'Status',
            allowResizing: true,
            alignment: 'center',
            allowEditing: false,
            width: 120,
            fixed: false,
            fixedPosition: 'right',
            dataType: 'string'
        },

        { dataField: 'ResponsibleActionDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd',  fixed: false, fixedPosition: 'right' },
        {
            dataField: 'Status',
            caption: 'Scheduling',
            allowResizing: true,
            alignment: 'center',
            allowEditing: false,
            width: 100,
            fixed: true,
            fixedPosition: 'right',
            dataType: 'string',
            sortIndex: 0, sortOrder: 'desc'
        },

        { dataField: 'DateStatus', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yy-MMM-dd', fixed: true, fixedPosition: 'right' },
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
            if (e.rowType === "data" && e.column.dataField == "ResponsibleAction") {
                $scope.styleCell(e, e.data.ResponsibleActionId==1);
            }
            if (e.rowType === "data" && e.column.dataField == "Status") {
                $scope.styleCell(e, !e.data.Status?'null': e.data.Status=='Accepted');
            }
            if (e.rowType === "data" && e.column.dataField == "ResponsibleActionDate") {
                $scope.styleCell(e, e.data.ResponsibleActionId == 1);
            }
            if (e.rowType === "data" && e.column.dataField == "DateStatus") {
                $scope.styleCell(e, !e.data.Status ? 'null' : e.data.Status == 'Accepted');
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
                if (!e.data.ResponsibleActionId) { } else
                    if (e.data.ResponsibleActionId == 1) { e.rowElement.css("backgroundColor", "#b3ffec"); }
                    else { e.rowElement.css("backgroundColor", "#ffd1b3"); }
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
        { dataField: 'ResponsibleAction', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'ResponsibleActionDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', fixed: true, fixedPosition: 'right' },
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
                if (!e.data.ResponsibleActionId) { } else
                    if (e.data.ResponsibleActionId == 1) { e.rowElement.css("backgroundColor", "#e6fff5"); }
                    else { e.rowElement.css("backgroundColor", "#ffd480"); }
            }
        },
        bindingOptions: {
            dataSource: 'dg_ds_rej'
        }
    };
    ///////////////////////////

    $scope.styleCell = function (e, value) {
        if (value == 'null')
            return;
        if (!value) {

            e.cellElement.css("backgroundColor", "#ff9966");
            e.cellElement.css("color", "#000");

        }
        else {
            e.cellElement.css("backgroundColor", "#00e6ac");
            e.cellElement.css("color", "#000");
        }
        return;
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

      //  $scope.dg_instance.refresh();
        //if ($scope.doRefresh) {
        //    $scope.filters = $scope.getFilters();
        //    $scope.dg_ds.filter = $scope.filters;
        //    $scope.dg_instance.refresh();
        //    $scope.doRefresh = false;
        //}

    };
    //$scope.bind_new = function (callback) {
    //    flightService.getReqNew().then(function (response) {
    //        console.log(response);

    //        $scope.dg_ds = response;

    //        if (callback)
    //            callback();



    //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    //};
    $scope.bind_all_responsible = function (callback) {
		if($rootScope.userName.toLowerCase() == 'cs.yazdani'){
		$scope.eid = 4758
		}
		else{
		$scope.eid = $rootScope.employeeId
		}
			
        flightService.getReqResponsibleAll($scope.eid).then(function (response) {

            $scope.ds_all = response;
            $scope.dg_ds = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId != 1 && $.ResponsibleActionId != -1').ToArray();
            $scope.dg_ds_acc = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId==1  || $.ResponsibleActionId==-1').ToArray();
          

            if (callback)
                callback();



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        


    };
    //$scope.bind_acc = function (callback) {
    //    flightService.getReqAcc().then(function (response) {
    //        console.log(response);

    //        $scope.dg_ds_acc = response;

    //        if (callback)
    //            callback();



    //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    //};
    //$scope.bind_rej = function (callback) {
    //    flightService.getReqRej().then(function (response) {
    //        console.log(response);

    //        $scope.dg_ds_rej = response;

    //        if (callback)
    //            callback();



    //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    //};
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
     //   { id: 3, title: 'Other' },
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
        valueExpr: 'id',

        bindingOptions: {
            value: 'entity.ResponsibleActionId'

        }
    };

    $scope.remark = '';
    $scope.txt_remark = {
        readOnly: true,
        rtlEnabled: true,
        bindingOptions: {
            value: 'entity.Remark',
            height: '235',

        }
    };
    $scope.txt_remarkops = {

        bindingOptions: {
            value: 'entity.ResponsibleRemark',
            height: '115',

        }
    };
    $scope.txt_remarksch = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.SchedulingRemark',
           
            height: '110',

        }
    };
    $scope.txt_status_sch = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.Status',
        }
    };
    $scope.get_sch_style = function () {
        if ($scope.entity.Status == 'Accepted')
            return { background:'#00e6ac'};
        if ($scope.entity.Status == 'Rejected')
            return { background:'#ff9966'};

    };
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
    $scope.get_height_style = function () {
        var _height = $(window).height() - 140;
        return { height: _height };
    }
    $scope.click_action = function (request, action_id) {
        if (!request.ResponsibleRemark) {
            General.ShowNotify('Please fill the Remark field.', 'error');
            return;
        }
        var dto = {
            employee_id: $rootScope.employeeId,
            form_id: request.Id,
            action_id: action_id  ,
            remark: request.ResponsibleRemark
        };
        
        $scope.loadingVisible = true;
        flightService.actionRequest(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_all = Enumerable.From($scope.ds_all).Where('$.Id!=' + response.Id).ToArray();
            $scope.ds_all.push(JSON.parse(JSON.stringify(response)));
            $scope.dg_ds = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId != 1 && $.ResponsibleActionId != -1').ToArray();
            $scope.dg_ds_acc = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId==1  || $.ResponsibleActionId==-1').ToArray();

            $scope.popup_newform_visible = false;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }
    $scope.popup_newform_visible = false;
    $scope.popup_width = 850;
    if ($(window).width() < 850)
        $scope.popup_width = $(window).width() - 20;
    $scope.popup_height = 610;
    if ($(window).height() < $scope.popup_height)
        $scope.popup_height = $(window).height()-10;

    $scope.get_xs_height = function () {
        return { height:$scope.popup_height - 110 };
    };
    $scope.popup_newform = {
       // height: 610,
        //width: 850,
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
                            employee_id: $rootScope.employeeId,
                            form_id: $scope.entity.Id,
                            action_id: $scope.entity.ResponsibleActionId,
                            remark: $scope.entity.ResponsibleRemark
                        };
                        $scope.loadingVisible = true;
                        flightService.actionRequest(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.ds_all = Enumerable.From($scope.ds_all).Where('$.Id!=' + response.Id).ToArray();
                            $scope.ds_all.push(JSON.parse(JSON.stringify(response)));
                            $scope.dg_ds = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId != 1 && $.ResponsibleActionId != -1').ToArray();
                            $scope.dg_ds_acc = Enumerable.From($scope.ds_all).Where('$.ResponsibleActionId==1  || $.ResponsibleActionId==-1').ToArray();

                            $scope.popup_newform_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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

        },
        onHiding: function () {

            //$scope.clearEntity();
           // $scope.dg_instance.refresh();
            $scope.popup_newform_visible = false;

        },
        onHidden: function () {

            //if ($scope.dg_instance)
            //    $scope.dg_instance.refresh();
            if ($scope.dg_instance_acc)
                $scope.dg_instance_acc.refresh();
            if ($scope.dg_instance_rej)
                $scope.dg_instance_rej.refresh();
        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_newform_visible',
            'toolbarItems[0].visible': '!entity.Status',
            width: 'popup_width',
            height:'popup_height'


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
        $scope.bind_all_responsible();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onOrganizationSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onOrganizationHide', function (event, prms) {

        //$scope.bind_new();
        $scope.bind_all_responsible();

    });
    $scope.$on('$viewContentLoaded', function () {

        $('.vacations').fadeIn(400, function () {
            ////////////////////////////////
            setTimeout(function () {
                $scope.dg_ds = null;
                // $scope.bind_new(function () {
                $scope.bind_all_responsible(function () {

                    //$scope.bind_acc(function () {
                    //    $scope.bind_rej();

                    //});
                });
            }, 1000);








            ///////////////////////////////////
        });


    });


    //////////////////////////////////////////
    $rootScope.$broadcast('OrganizationLoaded', null);
    ///end
}]);