'use strict';
app.controller('vira_request_cartableController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.ds_req_order =
    {
        receiverLocationId: 0,
        statusId: null,
        priorityId: null,
        requestNo: null,
        register: null,
        description: null,
        partNumber: null,
        dateFrom: null,
        dateTo: null
    }


    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            alert("Refresh")

        }

    };

    $scope.btn_snbn = {
        text: 'Refresh',
        type: 'default',
        icon: '',
        width: 110,
        onClick: function (e) {
            alert("Refresh")

        }

    };

    $scope.btn_submit = {
        text: 'Refresh',
        type: 'default',
        icon: 'check',
        width: 140,
        onClick: function (e) {
            alert("Refresh")

        }

    };

    /////////////////////////

    $scope.bind = function () {
        vira_general_service.get_request_cartable($scope.ds_req_order).then(function (res) {
            $scope.dg_req_ds = res;
        });
        vira_general_service.get_request_cartable_item().then(function (res) {
            $scope.dg_req_ds = res;
        });
        vira_general_service.get_partnumebr_interchabge().then(function (res) {
            $scope.dg_req_ds = res;
        });
    }


    //////////////////////////

    $scope.txt_partNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_descNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_register = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.dt_reqDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.num_reqNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_shop = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_reqReg = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.priority =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_reqPriority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.txt_remark = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_apBy = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_receiver = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Receiver',
        width: 200,
        //height:30,
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        width: 200,
        placeholder: 'Stock',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    ////////////////////////

    $scope.dg_req_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: '', caption: 'Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Requested By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_req_selected = null;
    $scope.dg_req_instance = null;
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
        height: $(window).height() - 365,
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
            dataSource: 'dg_req_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_other_columns = [

        { dataField: '', caption: 'Stock', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 165 },
        { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
    ];


    $scope.dg_other_selected = null;
    $scope.dg_other_instance = null;
    $scope.dg_other = {



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
        height: $(window).height() - 650,
        width: '100%',
        columns: $scope.dg_other_columns,
        onContentReady: function (e) {
            if (!$scope.dg_other_instance)
                $scope.dg_other_instance = e.component;

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

            $scope.dg_other_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_other_id.id);
            if (!data) {
                $scope.dg_other_selected = null;
            }
            else
                $scope.dg_other_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_other_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_inter_columns = [

        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 165 },
        { dataField: '', caption: 'Stock', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
    ];


    $scope.dg_inter_selected = null;
    $scope.dg_inter_instance = null;
    $scope.dg_inter = {



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
        height: $(window).height() - 650,
        width: '100%',
        columns: $scope.dg_inter_columns,
        onContentReady: function (e) {
            if (!$scope.dg_inter_instance)
                $scope.dg_inter_instance = e.component;

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

            $scope.dg_inter_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_inter_id.id);
            if (!data) {
                $scope.dg_inter_selected = null;
            }
            else
                $scope.dg_inter_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_inter_ds'
        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.dg_reqItem_columns = [

        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_reqItem_selected = null;
    $scope.dg_reqItem_instance = null;
    $scope.dg_reqItem = {



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
        height: $(window).height() - 650,
        columns: $scope.dg_reqItem_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reqItem_instance)
                $scope.dg_reqItem_instance = e.component;

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

            $scope.dg_reqItem_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_reqItem_id.id);
            if (!data) {
                $scope.dg_reqItem_selected = null;
            }
            else
                $scope.dg_reqItem_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_reqItem_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_delivery_columns = [

        { dataField: '', caption: 'No. ', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_delivery_selected = null;
    $scope.dg_delivery_instance = null;
    $scope.dg_delivery = {



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
        height: $(window).height() - 615,
        width: '100%',
        columns: $scope.dg_delivery_columns,
        onContentReady: function (e) {
            if (!$scope.dg_delivery_instance)
                $scope.dg_delivery_instance = e.component;

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

            $scope.dg_delivery_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_delivery_id.id);
            if (!data) {
                $scope.dg_delivery_selected = null;
            }
            else
                $scope.dg_delivery_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_delivery_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

}]);


