'use strict';
app.controller('vira_rfq_resultController', ['$scope', '$rootScope', 'mntService', function ($scope, $rootScope, mntService) {


    $scope.btn_add_result = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: '100%',
        onClick: function (e) {

        }
    }

    $scope.btn_pn = {
        icon: 'search',
        width: 30,
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };

    //////////////////////////////

    $scope.sb_company = {
        bindingOptions: {
            value: 'company'
        }
    };

    $scope.txt_quotation_no = {
        bindingOptions: {
            value: 'quotationNo'
        }
    };

    $scope.sb_shipment = {
        bindingOptions: {
            value: 'shipment'
        }
    };

    $scope.txt_result_part_no = {
        bindingOptions: {
            value: 'resultPartNo'
        }
    };

    $scope.txt_result_description = {
        bindingOptions: {
            value: 'resultDescription'
        }
    };

    $scope.sb_condition = {
        bindingOptions: {
            value: 'condition'
        }
    };

    $scope.txt_result_quantity = {
        bindingOptions: {
            value: 'resultQuantity'
        }
    };

    $scope.sb_result_unit = {
        bindingOptions: {
            value: 'resultUnit'
        }
    };

    $scope.txt_result_price = {
        bindingOptions: {
            value: 'resultPrice'
        }
    };

    $scope.sb_result_currency = {
        bindingOptions: {
            value: 'resultCurrency'
        }
    };

    $scope.txt_result_discount = {
        bindingOptions: {
            value: 'resultDiscount'
        }
    };

    $scope.txt_result_moq = {
        bindingOptions: {
            value: 'resultMOQ'
        }
    };

    $scope.dt_man_date = {
        bindingOptions: {
            value: 'manDate'
        }
    };

    $scope.sb_doc_type = {
        bindingOptions: {
            value: 'docType'
        }
    };

    $scope.dt_overhaul_date = {
        bindingOptions: {
            value: 'overhaulDate'
        }
    };

    $scope.txt_result_remark = {
        bindingOptions: {
            value: 'resultRemark'
        }
    };




    //////////////////////////////
    $scope.dg_items_columns = [
        { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: '', caption: 'Model', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        { dataField: '', caption: 'Brand', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
    ];



    $scope.dg_items_selected = null;
    $scope.dg_items_instance = null;
    $scope.dg_items_height = 480;
    $scope.dg_items_id = null;
    $scope.dg_items = {



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
        height: $scope.dg_items_height,
        columns: $scope.dg_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_items_instance)
                $scope.dg_items_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "fullNo" && e.data.isApproved == 1) {

                e.cellElement.css('background', '#71dada');

            }
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            $scope.dg_items_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item_line($scope.dg_items_id).then(function (response) {
                $scope.dg_result_ds = response;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            $scope.entity_info.priority = data.priority;
            $scope.entity_info.deadline = data.deadline;
            $scope.entity_info.date = data.paperDate;
            $scope.entity_info.no = data.fullNo;
            $scope.entity_info.remark = data.remark;
            $scope.entity_info.status = data.lastStatusId;

            $scope.entity_approve.requestId = data.id;
            $scope.entity_approve.locationId = data.sender_LocationId;

            $scope.entity_cancel.paperId = data.id;
            $scope.entity_cancel.locationId = data.sender_LocationId;

            $scope.entity_edit = data;

            if (!data) {
                $scope.dg_items_selected = null;
            }
            else
                $scope.dg_items_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_items_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_result_columns = [

        {
            caption: 'Part Number',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Result Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Company', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },

        {
            caption: 'Quantity',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                { dataField: '', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            ]
        },

        {
            caption: '',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Quotation', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Price', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                { dataField: '', caption: 'Currency', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Discount', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Total Price', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'MOQ', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
            ]
        },

    ];


    $scope.dg_result_height = 270;
    $scope.dg_result_selected = null;
    $scope.dg_result_instance = null;
    $scope.dg_result_id = null;
    $scope.dg_result = {



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
        height: $scope.dg_result_height,
        columns: $scope.dg_result_columns,
        onContentReady: function (e) {
            if (!$scope.dg_result_instance)
                $scope.dg_result_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_result_selected = null;
            }
            else
                $scope.dg_result_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_result_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    
    $scope.$on('$viewContentLoaded', function () {
        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.entity_req.userId = response[0].uM_UserId;
            $scope.entity_approve.userId = response[0].uM_UserId;
            $scope.entity_cancel.userId = response[0].uM_UserId;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        $scope.bind();
        setTimeout(function () {

            //$scope.$broadcast('getFilterQuery', null);

        }, 500);
    });



    $scope.$on('InitPNSelected', function (event, prms) {

    });



}]);