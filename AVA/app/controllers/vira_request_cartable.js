'use strict';
app.controller('vira_request_cartableController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.reciver_location = 0;



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

    $scope.document = {

    }

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
        date: null,
        deliveryOrderItems: [

        ]
    }

    $scope.selected_stock_id = $rootScope.vira_user_delafult_stock_id;

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
    $scope.bind_requests = function () {
        $scope.ds_req_order.receiverLocationId = $scope.selected_stock_id;
        vira_general_service.get_request_cartable($scope.ds_req_order).then(function (res) {
            $scope.dg_req_ds = res;
        });
    };
    $scope.btn_search = {
        // text: 'Search',
        type: 'default',
        icon: 'search',
        width: '45',
        onClick: function (e) {
            $scope.bind_requests();
        }

    };


    $scope.do = function (e) {
        $scope.dg_reqItem_instance.selectRows([e], false);
        $rootScope.$broadcast('InitInventoryPopup', {
            location_id: $scope.selected_stock_id,
            pn_id: $scope.dg_reqItem_selected.cmP_PartNumberId,
            description: $scope.dg_reqItem_selected.description,
            partNumber: $scope.dg_reqItem_selected.partNumber
        });
    }

    $scope.nis = function (e) {
        $scope.dg_reqItem_instance.selectRows([e], false);
        var nis_dto = {
            "paperItemId": $scope.dg_reqItem_selected.id,
            "cmP_PartNumberId": $scope.dg_reqItem_selected.cmP_PartNumberId,
            "priorityId": $scope.dg_req_selected.priorityId,
            "sender_LocationId": $scope.selected_stock_id,
            "sender_UserId": $rootScope.vira_user_id,
            "quantity": $scope.dg_reqItem_selected.quantity,
            "remark": null,
            "pn_title": $scope.dg_reqItem_selected.partNumber,
            "rem_quantity": $scope.dg_reqItem_selected.doReaminingQuantity
        };

        $scope.$broadcast('InitNISPopup', nis_dto);
    }


    $scope.btn_submit = {
        text: 'Save D/O',
        type: 'default',
        icon: null,
        width: 140,
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
                    $scope.bind_items();
                    $scope._DONo = res.data.paperNo;

                    $scope.document.vira_no = res.data.paperNo;
                    $scope.document.vira_id = $scope.dg_req_selected.id;
                    $scope.document.paper_id = res.data.id;

                    vira_general_service.document_save_do($scope.document).then(function (response) {
                        vira_general_service.document_save_result($scope.document).then(function (response2) {

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    $scope.dg_delivery_ds = null;
                    $scope.popup_result_visible = true;

                }

            });
        }

    };

    $scope.$on('OnNISAdd', function (event, prms) {
        //alert('ddddddfdsdfd');
        console.log('nis out', prms);
        $scope.bind_items();
        $scope._DONo = prms.paperNo;
        $scope.popup_result_visible = true;
    });



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
    /////////////////////////
    $scope._DONo = null;
    $scope.txt_DONo = {
        readOnly: true,
        bindingOptions: {
            value: '_DONo'
        }
    }
    $scope.popup_result_visible = false;
    $scope.popup_result_title = "";


    $scope.popup_result = {


        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_result_visible = false;


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


            $scope.popup_result_visible = false;
        },
        onContentReady: function (e) {


        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_result_visible',

            title: 'popup_result_title',
            height: '300',
            width: '500',


        }
    };

    $scope.save = function (callback) {
        $scope.loadingVisible = true;
        // $scope.entity_info.deliveryOrderItems = $scope.dg_delivery_ds

        var dto = {
            "id": 0,
            "requestId": $scope.dg_req_selected.id,
            "acfT_TypeId": $scope.dg_req_selected.acfT_TypeId,
            "acfT_MSNId": $scope.dg_req_selected.acfT_MSNId,
            "sender_LocationId": $scope.selected_stock_id,
            "sender_UserId": $rootScope.vira_user_id,
            "receiver_LocationId": $scope.do_receiver.gI_LocationId,
            "receiver_UserId": $scope.do_receiver.uM_UserId,
            "remark": 'Request No.:' + $scope.dg_req_selected.fullNo,
            "deliveryOrderItems": [],
        };

        $.each($scope.dg_delivery_ds, function (_i, _d) {
            var _ci = 1;
            dto.deliveryOrderItems.push({
                "id": 0,
                "paperItemId": $scope.dg_reqItem_selected.id,
                "cmP_PartNumberId": _d.cmP_PartNumberId,
                "cmP_ComponentId": _d.cmP_ComponentId,
                "conditionId": _d.conditionId,
                "measurementUnitId": _d.conditionId,
                "itemNo": _ci,
                "quantity": _d.quantity,
                "shelfFrom": _d.shelf,
                "shelfTo": _d.shelf,
                "remark": "-",
            });
            _ci++;
        });
        //{
        //   // "id": 0,
        //       // "requestId": 0,
        //            //"acfT_TypeId": "string",
        //               // "acfT_MSNId": 0,
        //                   // "sender_LocationId": 0,
        //                       // "sender_UserId": 0,
        //                          //  "receiver_LocationId": 0,
        //                             //   "receiver_UserId": 0,
        //                                 //   "remark": "string",


        //                                        "deliveryOrderItems": [
        //                                            {
        //                                                "id": 0,
        //                                                "paperId": 0,
        //                                                "paperItemId": 0,
        //                                                "cmP_PartNumberId": 0,
        //                                                "cmP_ComponentId": 0,
        //                                                "conditionId": 0,
        //                                                "measurementUnitId": 0,
        //                                                "itemNo": 0,
        //                                                "quantity": 0,
        //                                                "shelfFrom": "string",
        //                                                "shelfTo": "string",
        //                                                "remark": "string"
        //                                            }
        //                                        ]
        //}




        $scope.loadingVisible = true;
        mntService.add_delivery_order(dto).then(function (res) {
            $scope.loadingVisible = false;
            console.log(res);
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.bind_items();
                    $scope._DONo = res.data.paperNo;
                    $scope.dg_delivery_ds = null;
                    $scope.popup_result_visible = true;

                }
            }

        });
    };

    $scope.format_date = function (dt) {
        if (!dt)
            return "";
        return moment(dt).format('YYYY-MM-DD')
    }
    $scope.bind = function () {
        vira_general_service.get_request_cartable($scope.ds_req_order).then(function (res) {
            $scope.dg_req_ds = res;
        });
        //vira_general_service.get_request_cartable_item().then(function (res) {
        //    $scope.dg_req_ds = res;
        //});
        //vira_general_service.get_partnumebr_interchabge().then(function (res) {
        //   $scope.dg_req_ds = res;
        // });


        mntService.get_register().then(function (res) {
            $scope.registers = res
        });

        if ($rootScope.vira_locations) {
            //$scope.ds_user_locations = $rootScope.vira_user_locations;

            $scope.ds_locations = $rootScope.vira_user_locations_all;


        }
        else {

            $rootScope.fill_vira_locations(function () {
                // $scope.ds_user_locations = $rootScope.vira_user_locations;
                // console.log('b', $scope.ds_user_locations);
                $scope.ds_locations = $rootScope.vira_user_locations_all;

            });
        }



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
    //$scope.sb_receiver = {
    //    showClearButton: false,
    //    searchEnabled: false,
    //    displayExpr: 'fullName',
    //    valueExpr: 'gI_LocationId',
    //    width: 300,
    //    placeholder: 'Reciver',
    //    bindingOptions: {
    //        value: 'reciver_location',
    //        dataSource: 'ds_locations'
    //    }
    //}

    $scope.do_receiver = null;
    $scope.sb_receiver = {
        showClearButton: false,
        searchEnabled: false,
        //displayExpr: 'title',
        // valueExpr: 'gI_LocationId',
        itemTemplate: function (data) {
            //return $rootScope.getSbTemplateAirport(data);
            var tmpl =
                "<div>"
                + "<div class='tmpl-col-left' style='width:50%'>" + data.title + "</div>"
                + "<div class='tmpl-col-right' style='width:50%'>" + data.fullName + "</div>"



                + "</div>";
            return tmpl;
        },
        fieldTemplate: 'field',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.do_receiver = null;
                return;
            }
            // $scope.entity.sender_UserId = e.selectedItem.uM_UserId;
        },
        bindingOptions: {
            value: 'do_receiver',
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



        { dataField: 'fullNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'paperDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 115, sortIndex: 0, sortOrder: 'desc' },
        { dataField: 'register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
        { dataField: 'senderUser_FullName', caption: 'Requested By', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 150 },
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
        height: $(window).height() - 250,
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
            $scope.dg_delivery_ds = null;


            $scope.dg_req_id = e.selectedRowsData[0].id;
            $scope.bind_items();

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
            else {
                $scope.dg_req_selected = data;


                $scope.do_receiver = Enumerable.From($scope.ds_locations).Where(function (x) {


                    return x.uM_UserId == data.sender_UserId && x.gI_LocationId == data.sender_LocationId;

                }).FirstOrDefault();
            }


        },

        bindingOptions: {
            dataSource: 'dg_req_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    $scope.bind_items = function () {
        $scope.dg_reqItem_ds = null;
        vira_general_service.get_request_cartable_item($scope.dg_req_id).then(function (response) {
            $scope.dg_reqItem_ds = response;
            if (!response || response.length == 0)
                $scope.bind_requests();

        });

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
        height: 200, //$(window).height() - 650,
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

        { dataField: 'partNumber', caption: 'P/N', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false },
        { dataField: 'quantity', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },
        { dataField: 'doReaminingQuantity', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60 },



        {
            dataField: "Id", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'do',
            width: 80,

        },
        {
            dataField: "Id", caption: '',
            alignment: 'center',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'nis',
            width: 80,

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
        height: 200, //$(window).height() - 650,
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

        { dataField: 'partNumber', caption: 'P/N', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'date', allowEditing: false, minWidth: 250, fixed: true, fixedPosition: 'left' },
        { dataField: 'sN_BN', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
        { dataField: 'quantity', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left' },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110 },

        { dataField: 'condition', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'shelf', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        //{ dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
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
        height: $(window).height() - 200 - 280,
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


