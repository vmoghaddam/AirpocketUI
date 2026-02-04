'use strict';
app.controller('vira_mrf_listController', ['$scope', function ($scope) {

  
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
            $scope.$broadcast('InitNewMRF', null);
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

    //////////////////////////

    $scope.txt_mrf_no = {
        bindingOptions: {
            value: 'mrfNo'
        }
    };

    $scope.txt_nis_no = {
        bindingOptions: {
            value: 'nisNo'
        }
    };

    $scope.sb_status = {
        bindingOptions: {
            value: 'status'
        }
    };

    $scope.txt_partNo = {
        bindingOptions: {
            value: 'partNo'
        }
    };

    $scope.txt_req_no = {
        bindingOptions: {
            value: 'reqNo'
        }
    };

    $scope.dt_req_date = {
        bindingOptions: {
            value: 'reqDate'
        }
    };

    $scope.dt_req_deadline = {
        bindingOptions: {
            value: 'reqDeadline'
        }
    };

    $scope.txt_req_status = {
        bindingOptions: {
            value: 'reqStatus'
        }
    };

    $scope.txt_req_remark = {
        bindingOptions: {
            value: 'reqRemark'
        }
    };

    $scope.dg_mrf_item = {
        bindingOptions: {
            dataSource: 'mrfItemDataSource'
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



    $scope.dg_mrf_columns = [


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
    $scope.dg_mrf_selected = null;
    $scope.dg_mrf_instance = null;
    $scope.dg_mrf_height = $(window).height() - 330;
    $scope.dg_mrf_id = null;
    $scope.dg_mrf = {



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
        height: $scope.dg_mrf_height ,
        columns: $scope.dg_mrf_columns,
        onContentReady: function (e) {
            if (!$scope.dg_mrf_instance)
                $scope.dg_mrf_instance = e.component;

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


            $scope.dg_mrf_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item_line($scope.dg_mrf_id).then(function (response) {
                $scope.dg_mrf_item_ds = response;
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
                $scope.dg_mrf_selected = null;
            }
            else
                $scope.dg_mrf_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_mrf_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_mrf_item_columns = [

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
    $scope.dg_mrf_item_height = $(window).height() - 292;
    $scope.dg_mrf_item_selected = null;
    $scope.dg_mrf_item_instance = null;
    $scope.dg_mrf_item_id = null;
    $scope.dg_mrf_item = {



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
        height: $scope.dg_mrf_item_height,
        columns: $scope.dg_mrf_item_columns,
        onContentReady: function (e) {
            if (!$scope.dg_mrf_item_instance)
                $scope.dg_mrf_item_instance = e.component;

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
                $scope.dg_mrf_item_selected = null;
            }
            else
                $scope.dg_mrf_item_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_mrf_item_ds'
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
}]);