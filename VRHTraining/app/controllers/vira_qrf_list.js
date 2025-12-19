'use strict';
app.controller('vira_qrf_listController', ['$scope', '$rootScope', 'mntService', function ($scope, $rootScope, mntService) {


    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        onClick: function (e) {

        }
    };

    $scope.btn_add = {
        text: 'New',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            $scope.$broadcast('InitNewRFQ', null);
        }
    }

    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            $scope.$broadcast('InitNewMRF', null);
        }
    }

    $scope.btn_cancel = {
        text: 'Cancel',
        type: 'danger',
        icon: '',
        width: 120,
        onClick: function (e) {
            $scope.popup_cnl_visible = true;
        }
    }


    $scope.btn_close = {
        text: 'Close',
        type: 'normal',
        icon: '',
        width: 120,
        onClick: function (e) {
            $scope.$broadcast('InitCloseMRF', null);
        }
    }
    ///////////////////////////

    $scope.txt_rfq_no = {
        bindingOptions: {
            value: 'rfqNo'
        }
    };

    $scope.sb_priority = {
        bindingOptions: {
            value: 'priority'
        }
    };

    $scope.txt_description = {
        bindingOptions: {
            value: 'description'
        }
    };

    $scope.txt_part_no = {
        bindingOptions: {
            value: 'partNo'
        }
    };

    $scope.sb_status = {
        bindingOptions: {
            value: 'status'
        }
    };


    $scope.dg_rfq = {
        bindingOptions: {
            dataSource: 'rfqListDataSource'
        }
    };

    $scope.txt_rfq_info_no = {
        bindingOptions: {
            value: 'rfqInfoNo'
        }
    };

    $scope.sb_priority_info = {
        bindingOptions: {
            value: 'priorityInfo'
        }
    };

    $scope.dt_rfq_date = {
        bindingOptions: {
            value: 'rfqDate'
        }
    };

    $scope.dt_rfq_deadline = {
        bindingOptions: {
            value: 'rfqDeadline'
        }
    };

    $scope.sb_status = {
        bindingOptions: {
            value: 'statusInfo'
        }
    };

    $scope.txt_remark_info = {
        bindingOptions: {
            value: 'remarkInfo'
        }
    };

    $scope.dg_rfq_item = {
        bindingOptions: {
            dataSource: 'rfqItemListDataSource'
        }
    };

    $scope.txt_cnl_remark = {
        bindingOptions: {
            value: 'cancelRemark'
        }
    };



    //////////////////////////
  

    $scope.popup_cnl_visible = false;
    $scope.popup_cnl_title = "Cancel MRF";
    $scope.popup_cnl = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Cancel', onClick: function (e) {

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_cnl_visible = false;
                        $scope.popup_add_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {




        },
        onHiding: function () {


            $scope.popup_cnl_visible = false;
        },
        onContentReady: function (e) {


        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_cnl_visible',
            title: 'popup_cnl_title',
            height: '300',
            width: '500',


        }
    };



    $scope.dg_rfq_columns = [


        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
                { dataField: '', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'Stock Control',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Issued By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Receiver Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
                { dataField: '', caption: 'Approved', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
            ]
        },
    ];



    $scope.dg_rfq_selected = null;
    $scope.dg_rfq_instance = null;
    $scope.dg_rfq_height = $(window).height() - 330;
    $scope.dg_rfq_id = null;
    $scope.dg_rfq = {



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
        height: $scope.dg_rfq_height,
        columns: $scope.dg_rfq_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rfq_instance)
                $scope.dg_rfq_instance = e.component;

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


            $scope.dg_rfq_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item_line($scope.dg_rfq_id).then(function (response) {
                $scope.dg_rfq_item_ds = response;
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
                $scope.dg_rfq_selected = null;
            }
            else
                $scope.dg_rfq_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_rfq_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_rfq_item_columns = [

        { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: '', caption: 'Engineering Comment', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350 },
    ];


    $scope.dg_rfq_item_height = $(window).height() - 340;
    $scope.dg_rfq_item_selected = null;
    $scope.dg_rfq_item_instance = null;
    $scope.dg_rfq_item_id = null;
    $scope.dg_rfq_item = {



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
        height: $scope.dg_rfq_item_height,
        columns: $scope.dg_rfq_item_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rfq_item_instance)
                $scope.dg_rfq_item_instance = e.component;

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
                $scope.dg_rfq_item_selected = null;
            }
            else
                $scope.dg_rfq_item_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_rfq_item_ds'
        },
        columnChooser: {
            enabled: false
        },

    };




    $scope.$on('$viewContentLoaded', function () {
       
    });






}]);