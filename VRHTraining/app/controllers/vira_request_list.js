'use strict';
app.controller('vira_request_listController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {







    $scope.btn_search = {
        icon: 'search',
        text: 'Search',
        type: 'default',
        onClick: function () {
            alert("Test Search");
        }

    }


    //////////////////////////

    $scope.dt_deadline = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_priority = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_status = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_serialNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_filter_reqNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_filter_desc = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_filter_partNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_filter_priority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.priorityId',
            dataSource: 'priority',
        }
    }

    $scope.ds_type =
        [
            { id: 0, title: 'All' },
            { id: 1, title: 'Approved' }
        ];

    $scope.sb_filter_type = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_type,
        bindingOptions: {
            value: '',
        }
    }

    $scope.ds_stat =
        [
            { id: 0, title: 'Canceled' },
            { id: 1, title: 'Waititng' }
        ];

    $scope.sb_filter_stat = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_stat,
        bindingOptions: {
            value: '',
        }
    }

    ////////////////////////

    $scope.bind = function () {
        mntService.getReceiptPN(76).then(function (res) {
            $scope.priority = res;
        });
    }


    ///////////////////////

    $scope.dg_req_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Position', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

    ];



    $scope.dg_req_selected = null;
    $scope.dg_req_instance = null;
    $scope.dg_req_height = $(window).height() - 274;
    $scope.dg_req = {



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
        columns: $scope.dg_req_columns,
        onContentReady: function (e) {
            if (!$scope.dg_req_instance)
                $scope.dg_req_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(data);

            $scope.dg_req_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_req_id.id);
            if (!data) {
                $scope.dg_req_selected = null;
            }
            else
                $scope.dg_req_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_req_ds',
            height: 'dg_req_height'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_filter_req_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            caption: 'Request',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 250 },
            ]
        },
        {
            caption: 'Aircraft / Engine',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'MSN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Reg. / SN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Receiver Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Approver', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_filter_req_selected = null;
    $scope.dg_filter_req_instance = null;
    $scope.dg_filter_req_height = $(window).height() - 325;
    $scope.dg_filter_req = {



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
        columns: $scope.dg_filter_req_columns,
        onContentReady: function (e) {
            if (!$scope.dg_filter_req_instance)
                $scope.dg_filter_req_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(data);

            $scope.dg_filter_req_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_filter_req_id.id);
            if (!data) {
                $scope.dg_filter_req_selected = null;
            }
            else
                $scope.dg_filter_req_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_filter_req_ds',
            height: 'dg_filter_req_height'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.bind();

}]);


