'use strict';
app.controller('vira_request_cartableController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.reciver_location = 0;

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

    $scope.entity_nis =
    {
        paperItemId: 0,
        cmP_PartNumberId: 0,
        priorityId: 0,
        sender_LocationId: 0,
        sender_UserId: 0,
        quantity: 0,
        remark: null
    };

   
    
     $scope.entity_info =
     {
         id: 0,
         requestId: null,
         acfT_TypeId: null,
         acfT_MSNId: 0,
         receiver_LocationId: null,
         receiver_UserId: null,
         approver_LocationId: null,
         approver_UserId: null,
         remark: null,
         warehouse: null,
         date: new Date(),
         deliveryOrderItems: [

         ]
     }

     $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
         onClick: function (e) {
             $scope.ds_req_order.receiverLocationId = $scope.reciver_location
            vira_general_service.get_request_cartable($scope.ds_req_order).then(function (res) {
                $scope.dg_req_ds = res;
            });
        }

    };

    
    $scope.do = function (e) {
        $rootScope.$broadcast('InitInventoryPopup', { location_id: $scope.entity_nis.sender_LocationId });
    }

    $scope.nis = function (e) {

        

       $scope.$broadcast('InitNISPopup', $scope.entity_nis);
    }

  
    $scope.btn_submit = {
        text: 'Save D/O',
        type: 'default',
        icon: null,
        width: 110,
        onClick: function (e) {
            
            $scope.save(function (res) {
                if (res.errorCode) {
                    if (res.errorCode == 10029) {
                        mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                            $scope.save();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                    else
                        General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    //$scope.entity.paperNo = res.data.paperNo;

                    $scope.popup_result_visible = true;

                }

            });
        }

    };

    /////////////////////////

    $scope.save = function (callback) {
        $scope.loadingVisible = true;
        $scope.entity_info.deliveryOrderItems = $scope.dg_delivery_ds
        mntService.add_delivery_order($scope.entity_info).then(function (res) {
            $scope.loadingVisible = false;
            console.log(res);
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.entity.paperNo = res.data.paperNo;

                    $scope.popup_result_visible = true;

                }
            }

        });
    };


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

        mntService.get_register().then(function (res) {
            $scope.registers = res
        });
        //mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
        //    $scope.ds_locations = response;
        //    $scope.user = response;
        //    $scope.entity.sender_LocationId = $scope.user[0].gI_LocationId;
        //    $scope.entity.sender_UserId = $rootScope.vira_user_id;
        //    $scope.entity.receiver_UserId = $rootScope.vira_user_id;
        //});
    }


    //////////////////////////

   
    $scope.txt_partNo = {
        bindingOptions: {
            value: 'ds_req_order.partNumber'
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: 'ds_req_order.requestNo'
        }
    }

    $scope.txt_desc = {
        bindingOptions: {
            value: 'ds_req_order.description'
        }
    }

    $scope.sb_register = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "register",
        valueExpr: 'register',
       
        bindingOptions: {
            value: 'ds_req_order.register',
            dataSource: 'registers',
        }
    }


    $scope.dt_req_info_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity_info.date'
        }
    }

    $scope.txt_req_info_no = {
        bindingOptions: {
            value: 'entity_info.no'
        }
    }

    $scope.txt_shop = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_reqReg = {
        bindingOptions: {
            value: 'entity_info.register',
        }
    }

    $scope.txt_acType = {
        bindingOptions: {
            value: 'entity_info.acfT_TypeId',
        }
    }

    $scope.priority =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.txt_reqPriority = {
        bindingOptions: {
            value: 'entity_info.priority',
        }
    }

    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity_info.remark'
        }
    }

    $scope.txt_apBy = {
        bindingOptions: {
            value: 'entity_info.approvedBy'
        }
    }

    $scope.ds_locations = null;
    $scope.sb_receiver = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'fullName',
        valueExpr: 'gI_LocationId',
        width: 200,
        placeholder: 'Reciver',
        bindingOptions: {
            value: 'reciver_location',
            dataSource: 'ds_locations'
        }
    }

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        width: 200,
        placeholder: 'Stock',
        onSelectionChanged: function (e) {
            console.log(e.selectedItem);
            $scope.entity_nis.sender_LocationId = e.selectedItem.gI_LocationId;
            $scope.entity_nis.sender_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.receiver_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.receiver_LocationId = e.selectedItem.gI_LocationId;
            $scope.entity_info.approver_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.approver_LocationId = e.selectedItem.gI_LocationId;
            console.log("nis entity", $scope.entity_nis);
        },
        dataSource: $scope.priority,
        bindingOptions: {
            value: 'reciver_location',
            dataSource: 'ds_locations'
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
        { dataField: 'fullNo', caption: 'Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'paperDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: 'register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'senderUser_FullName', caption: 'Requested By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_req_selected = null;
    $scope.dg_req_instance = null;
    $scope.dg_req_id = null;
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

           
            $scope.dg_req_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item($scope.dg_req_id).then(function (response) {
                $scope.dg_reqItem_ds = response;
            });

            $scope.entity_nis.cmP_PartNumberId = data.id;
            $scope.entity_nis.pn_title = data.fullNo;
            $scope.entity_nis.priorityId = data.priorityId;

            $scope.entity_info.date = data.paperDate;
            $scope.entity_info.no = data.fullNo;
            $scope.entity_info.remark = data.remark;
            $scope.entity_info.approvedBy = data.approverUser_FullName;
            $scope.entity_info.register = data.register;
            $scope.entity_info.acfT_TypeId = data.acfT_TypeId;
            $scope.entity_info.acfT_MSNId = data.acfT_MSNId;
            $scope.entity_info.priority = data.priority;



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

            
            $scope.dg_other_id.Id = e.selectedRowsData[0].Id;

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


            $scope.dg_inter_id.Id = e.selectedRowsData[0].Id;

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

        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false},
        { dataField: 'quantity', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },
        { dataField: 'doReaminingQuantity', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },

        {
            dataField: "Id", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'nis',
            width: 100,

        },

        {
            dataField: "Id", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'do',
            width: 100,

        },

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

            $scope.dg_reqItem_id = e.selectedRowsData[0].cmP_PartNumberId;

            $scope.entity_nis.paperItemId = data.id;
            $scope.entity_nis.rem_quantity = data.doReaminingQuantity;
            $scope.entity_nis.quantity = data.quantity;
            vira_general_service.get_partnumebr_interchabge($scope.dg_reqItem_id).then(function (response) {
                $scope.dg_inter_ds = response;
            });

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

        { dataField: 'partNumber', caption: 'No. ', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'selected_qty', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'shelf', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
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

            
            $scope.dg_delivery_id.Id = e.selectedRowsData[0].Id;


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


    $scope.$on('$viewContentLoaded', function () {
        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        $scope.bind();
        setTimeout(function () {

            //$scope.$broadcast('getFilterQuery', null);
          
        }, 500);
    });


  
    $scope.$on('on_inventory_selected', function (event, prms) {
        console.log("Init PN Data", prms);
        var dtos = [];
        $.each(prms, function (_i, _d) {
            dtos.push(
                {
                    "partNumberId": _d.cmP_PartNumberId,
                    "quantity": _d.selected_qty,
                    "stockLocationId": _d.receiver_LocationId,
                    "stockUserId": $scope.vira_user_id,
                    "componentId": null
                }
            );
        });


        mntService.get_selected_component_all(dtos).then(function (response) {

            $.each(response, function (_i, _d) {
                _d.ShelfTo = String(_d.shelfToId)
                _d.ShelfFrom = String(_d.shelfFromId)
            });

            console.log('SELECTED RESULT', response);
            $scope.dg_delivery_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });


  


}]);


