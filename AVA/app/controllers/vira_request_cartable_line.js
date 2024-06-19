'use strict';
app.controller('vira_request_cartable_lineController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.reciver_location = 0;

    $scope.entity_req =
    {
        userId: 0,
        requestNo: null,
        description: null,
        partNumber: null,
        priorityId: null,
        status: null
    }

    $scope.entity_approve =
    {
        requestId: 0,
        userId: 0,
        locationId: 0
    };

    $scope.entity_cancel =
    {
        paperId: 0,
        userId: 0,
        locationId: 0,
        remark: "test test test test"
    };

    $scope.entity_edit = {};


    $scope.entity_info =
    {
        id: 0,
        requestId: null,
        acfT_TypeId: null,
        acfT_MSNId: 0,
        receiver_LocationId: null,
        //receiver_UserId: null,
        approver_LocationId: null,
        approver_UserId: null,
        remark: null,
        warehouse: null,
        date: null,
        deliveryOrderItems: [

        ]
    }

    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        onClick: function (e) {
            //$scope.entity_req.receiverLocationId = $scope.reciver_location
            vira_general_service.get_request_cartable_line($scope.entity_req).then(function (res) {
                console.log(res);
                $scope.dg_req_ds = res;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

    };


    $scope.do = function (e) {
        $rootScope.$broadcast('InitInventoryPopup', { location_id: $scope.entity_nis.sender_LocationId });
    }

    $scope.nis = function (e) {



        $scope.$broadcast('InitNISPopup', $scope.entity_nis);
    }


    $scope.btn_add = {
        text: 'Add',
        type: 'default',
        icon: null,
        width: 110,
        onClick: function (e) {
            $rootScope.$broadcast('InitNewReq', null);

        }

    };

    $scope.btn_approve = {
        text: 'Approve',
        type: 'success',
        icon: null,
        width: 110,
        onClick: function (e) {

            vira_general_service.approve_request($scope.entity_approve).then(function (resposne) {

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

    };

    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: null,
        width: 110,
        onClick: function (e) {
            $scope.$broadcast('InitEditReq', $scope.entity_edit);
        }

    };

    $scope.btn_cancel = {
        text: 'Cancel',
        type: 'danger',
        icon: null,
        width: 110,
        onClick: function (e) {
            vira_general_service.cancel_request($scope.entity_cancel).then(function (resposne) {

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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
        vira_general_service.get_request_cartable($scope.entity_req).then(function (res) {
            $scope.dg_req_ds = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        vira_general_service.get_request_cartable_item().then(function (res) {
            $scope.dg_req_ds = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        vira_general_service.get_partnumebr_interchabge().then(function (res) {
            $scope.dg_req_ds = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        mntService.getReceiptPN(76).then(function (res) {
            $scope.ds_priority = res;
            console.log(res);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        mntService.get_register().then(function (res) {
            $scope.registers = res
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
            value: 'entity_req.partNumber'
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: 'entity_req.requestNo'
        }
    }

    $scope.txt_desc = {
        bindingOptions: {
            value: 'entity_req.description'
        }
    }

    $scope.sb_priority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Priority',
        bindingOptions: {
            value: 'entity_req.priorityId',
            dataSource: 'ds_priority'
        }
    }

    $scope.ds_status =
        [
            { id: null, title: "All" },
            { id: 161, title: "Approved" },
            { id: 154, title: "Canceled" },
            { id: 150, title: "Waiting" }
        ]

    $scope.sb_status = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Priority',
        dataSource: $scope.ds_status,
        bindingOptions: {
            value: 'entity_req.status',

        }
    }



    $scope.dt_req_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        readOnly: true,
        bindingOptions: {
            value: 'entity_info.date'
        }
    }

    $scope.dt_req_deadline = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        readOnly: true,
        bindingOptions: {
            value: 'entity_info.deadline'
        }
    }

    $scope.txt_req_no = {
        bindingOptions: {
            value: 'entity_info.no'
        }
    }

    $scope.txt_req_priority = {
        bindingOptions: {
            value: 'entity_info.priority'
        }
    }



    $scope.txt_req_status = {
        bindingOptions: {
            value: 'entity_info.status',
        }
    }

    $scope.txt_req_remark = {
        bindingOptions: {
            value: 'entity_info.remark'
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
            //$scope.entity_info.receiver_UserId = e.selectedItem.uM_UserId;
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
        //{
        //    dataField: "isApproved", caption: '',
        //    width: 55,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {
        //        var fn = options.value == 1 ? 'registered-24' : 'red';

        //        $("<div>")
        //            .append("<img src='content/images/" + fn + ".png' />")
        //            .appendTo(container);
        //    },
        //    fixed: true, fixedPosition: 'left',//  sortIndex: 0, sortOrder: "desc"
        //},

        { dataField: 'fullNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 170,fixed: true, fixedPosition: 'left',sortIndex:0,sortOrder:'desc'},
        { dataField: 'paperDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'senderUser_FullName', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'senderLocation_Title', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'acfT_TypeId', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'register', caption: 'MSN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Reg./SN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
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
        height: $(window).height() - 310,
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
            if (e.rowType === "data" && e.column.dataField == "fullNo" && e.data.isApproved == 1) {
               
                e.cellElement.css('background', '#71dada');

            }
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            $scope.dg_req_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item_line($scope.dg_req_id).then(function (response) {
                $scope.dg_req_other_ds = response;
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

    $scope.dg_req_other_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        //{ dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 50 },
        //{ dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'partNumberStatus_Int', caption: 'P/N Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250 },
        { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'cmP_PositionId', caption: 'Position', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'quantity', caption: 'Qty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: true, fixedPosition: 'right' },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: true, fixedPosition: 'right' },
        { dataField: 'reference', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250 },
    ];



    $scope.dg_req_other_selected = null;
    $scope.dg_req_other_instance = null;
    $scope.dg_req_other_id = null;
    $scope.dg_req_other = {



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
        height: $(window).height() - 251,
        columns: $scope.dg_req_other_columns,
        onContentReady: function (e) {
            if (!$scope.dg_req_other_instance)
                $scope.dg_req_other_instance = e.component;

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
                $scope.dg_req_other_selected = null;
            }
            else
                $scope.dg_req_other_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_req_other_ds'
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


