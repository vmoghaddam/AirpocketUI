'use strict';
app.controller('vira_direct_deliveryController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.entity = {

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
    };

    $scope.clear_entity = function () {
        $scope.entity.id = 0;
        $scope.entity.requestId = null;
        $scope.entity.receiver_LocationId = null;
        $scope.entity.receiver_UserId = null;
        $scope.entity.receiver = null;
        $scope.entity.location = null;
        $scope.entity.remark = null;
        $scope.entity.acfT_TypeId = null;
        $scope.entity.acfT_MSNId = 0;
        $scope.entity.warehouse = null;
        $scope.entity.date = new Date();
        $scope.entity.deliveryOrderItems = [];
        $scope.entity.remark = null;
        $scope.dg_del_ds = [];
    };


    $scope.itemEntity = {};

    $scope.dg_del_ds = [];

    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: 120,
        onClick: function (e) {

            var lgsEntity =
            {
                locationId: 19,
                //"sN_BN": "SEP1000"
            }
            mntService.get_component(lgsEntity).then(function (response) {
                console.log("Response", response);

                var res = Enumerable.From(response).Where(function (x) {
                    return x.sN_BN == $scope.entity.sn_bn;
                }).ToArray();

                console.log("Enum Response", res);


                $scope.itemEntity.paperId = 0
                $scope.itemEntity.paperItemId = null
                //$scope.itemEntity.cmP_PartNumberId = res[0].cmP_PartNumberId
                $scope.itemEntity.cmP_PartNumberId = res[0].cmP_PartNumberId
                $scope.itemEntity.cmP_ComponentId = res[0].id
                $scope.itemEntity.conditionId = res[0].conditionId
                $scope.itemEntity.shelfFrom = "48875"
                $scope.itemEntity.shelfTo = "48875"
                $scope.itemEntity.measurementUnitId = 106
                //$scope.itemEntity.itemNo = 0;
                //$scope.itemEntity.quantity = res[0].availablrQty
                $scope.itemEntity.quantity = res[0].availableQty;
                //$scope.itemEntity.remark = res[0].description
                //$scope.itemEntity.sN_BN = res[0].sN_bn
                console.log($scope.itemEntity);
                $scope.dg_del_ds.push($scope.itemEntity);
            });


            console.log("DataGrid Data Source", $scope.dg_del_ds);
        }

    };



    $scope.btn_remove = {
        text: 'Remove',
        type: 'danger',
        icon: '',
        width: 120,
        onClick: function (e) {

        }

    };

    $scope.btn_inventory = {
        text: 'Inventory',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            $rootScope.$broadcast('InitInventoryPopup', { location_id: $scope.entity.warehouse });
        }
    };
    //////////////////

    $scope.save = function (callback) {
        $scope.loadingVisible = true;
        $scope.entity.deliveryOrderItems = $scope.dg_del_ds
        mntService.add_delivery_order($scope.entity).then(function (res) {
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


    $scope.popup_pn_visible = false;
    $scope.popup_pn_title = "Direct Delivery";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_pn = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Inventory', onClick: function (e) {

                        $rootScope.$broadcast('InitInventoryTotalPopup', { location_id: $scope.entity.warehouse });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', validationGroup: 'deladd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.save(function (res) {
                            console.log(res);
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
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_pn_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            $scope.clear_entity();
            if ($scope.dg_del_instance) {
                $scope.dg_del_instance.repaint();
            }
            if ($scope.tempData == null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $scope.popup_pn_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_pn_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_pn_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    $scope.popup_result_visible = false;
    $scope.popup_result_title = "";


    $scope.popup_result = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'New Delivery Order', onClick: function (e) {
                        //$scope.loadingVisible = true;
                        //$scope.entity.receiptItems = $scope.dg_rec_ds
                        //mntService.addReceipt($scope.entity).then(function (res) {
                        //    $scope.loadingVisible = false;
                        //    console.log(res);
                        //    if (res.errorCode) {
                        //        General.ShowNotify(res.errorMessage, 'error');
                        //    }
                        //    else {
                        //        $scope.entity.paperNo = res.data.paperNo;
                        //        General.ShowNotify(Config.Text_SavedOk, 'success');
                        //        $scope.popup_receipt_visible = false;

                        //    }

                        //});
                        $scope.clear_entity();
                        $scope.popup_result_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_result_visible = false;
                        $scope.popup_pn_visible = false;

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

    //////////////////


    $scope.dt_date = {
        type: 'date',
        width: '100%',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.date'
        }
    }

    $scope.txt_no = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "id",
        valueExpr: 'id',
        onValueChanged: function (e) {
            $scope.reg_ds = [];
            $scope.reg_ds = Enumerable.From($scope.registers).Where(function (x) {
                var models = x.acfT_ModelId.split("-")[0];
                return models == e.value;
            }).ToArray();
            console.log($scope.reg_ds);
        },
        bindingOptions: {
            value: 'entity.acfT_TypeId',
            dataSource: 'ac_type_ds',
        }
    }

    $scope.sb_register = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "register",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.acfT_MSNId',
            dataSource: 'reg_ds'
        }
    }

    $scope.sb_warehouse = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',

        bindingOptions: {
            value: 'entity.warehouse',
            dataSource: 'ds_warehouse',
        }
    }

    $scope.txt_receiver_location = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.location',
        }
    }


    $scope.txt_issuedBy = {
        bindingOptions: {
            value: 'entity.issuedBy'
        }
    }

    $scope.txt_receiver = {
        bindingOptions: {
            value: 'entity.receiver'
        }
    }





    $scope.pnButton = {
        icon: 'search',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };


    $scope.btn_receiver = {
        icon: 'search',
        onClick: function () {
            $rootScope.$broadcast('InitPersonnelPopup', null);
        }

    };

    ///////////////////////


    $scope.dg_del_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        //{ dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250 },
        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'sN_BN', caption: 'SN / BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'condition', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'shelf', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'quantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

    ];



    $scope.dg_del_selected = null;
    $scope.dg_del_instance = null;
    $scope.dg_del = {



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
        height: $(window).height() - 330,
        width: $(window).width(),
        columns: $scope.dg_del_columns,
        onContentReady: function (e) {
            if (!$scope.dg_del_instance)
                $scope.dg_del_instance = e.component;

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

            $scope.dg_del_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_del_id.id);
            if (!data) {
                $scope.dg_del_selected = null;
            }
            else
                $scope.dg_del_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_del_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
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
            $scope.dg_del_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });




    $scope.bind = function () {
        mntService.get_ac_type().then(function (res) {

            $scope.ac_type_ds = res;
            mntService.get_register().then(function (res) {
                $scope.registers = res
            });
        });

        mntService.get_shop().then(function (res) {
            console.log(res);
            $scope.shop_ds = res;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (res) {
            $scope.ds_warehouse = res;
            $scope.user = res[0];

            $scope.entity.warehouse = $scope.user.gI_LocationId;
            $scope.entity.issuedBy = $scope.user.fullName;


            console.log($scope.user.gI_LocationId);

            $scope.entity.sender_LocationId = $scope.user.gI_LocationId;
            $scope.entity.sender_UserId = $scope.user.uM_UserId;
            $scope.entity.approver_LocationId = $scope.user.gI_LocationId;
            $scope.entity.approver_UserId = $scope.user.uM_UserId;
        });


    }





    $scope.$on('InitDirectDelivery', function (event, prms) {

        console.log('prms', prms);
        $scope.tempData = prms;
        $scope.popup_pn_visible = true;


    });

    $scope.$on('InitPersonnelSelected', function (event, prms) {

        $scope.tempData = prms;

        $scope.entity.receiver_LocationId = $scope.tempData.gI_LocationId;
        $scope.entity.receiver_UserId = $scope.tempData.uM_UserId;
        $scope.entity.receiver = $scope.tempData.fullName;
        $scope.entity.location = $scope.tempData.title;
        $scope.popup_pn_visible = true;

    });

    $scope.bind();
}]);


