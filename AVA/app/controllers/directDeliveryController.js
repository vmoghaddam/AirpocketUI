'use strict';
app.controller('directDeliveryController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.entity = {

        "id": 0,
        "requestId": null,
        "receiver_LocationId": 3,
        "receiver_UserId": 5,
        "approver_LocationId": 19,
        "approver_UserId": 8,
        "remark": null,
        deliveryOrderItems: [

        ]
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
                locationId: 1,
                //"sN_BN": "SEP1000"
            }
            mntService.get_component(lgsEntity).then(function (response) {
                console.log("Response", response);

                var res = Enumerable.From(response).Where(function (x) {
                    return x.sN_BN == $scope.entity.sn_bn;
                }).ToArray();

                console.log("Enum Response", res);

                $scope.itemEntity.paperId = null
                $scope.itemEntity.paperItemId = 1
                $scope.itemEntity.cmP_PartNumberId = res[0].cmP_PartNumberId
                $scope.itemEntity.cmP_ComponentId = res[0].id
                $scope.itemEntity.conditionId = res[0].conditionId
                //$scope.itemEntity.measurementUnitId = 0
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
            $rootScope.$broadcast('InitInventoryPopup', null);
        }
    };
    //////////////////

    $scope.popup_pn_visible = false;
    $scope.popup_pn_title = "Direct Delivery";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_pn = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        $scope.entity.deliveryOrderItems = $scope.dg_del_ds
                        mntService.add_delivery_order($scope.entity).then(function (res) {
                            console.log(res);
                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
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

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
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

    //////////////////

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
            console.log("User ", res);
            $scope.user = res[0];

            $scope.entity.sender_LocationId = $scope.user.gI_LocationId;
            $scope.entity.sender_UserId = $scope.user.personalId;
        });


    }

    //////////////////

    $scope.txt_plaque = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_snbn = {
        bindingOptions: {
            value: 'entity.sn_bn'
        }

    }

    $scope.ch_rfid = {
        defaultValue: false,
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
            dataSource: 'ds_locations',
        }
    }




    $scope.sb_shop = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',

        bindingOptions: {
            value: 'entity.receiver_LocationId',
            dataSource: 'shop_ds'
        }
    }

    $scope.txt_issuedBy = {
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



    ///////////////////////


    $scope.dg_del_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'remark', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: 'cmP_PartNumberId', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'sN_BN', caption: 'SN / BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'conditionId', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'quantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'measurementUnitId', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

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
        height: $(window).height() - 350,
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

    $scope.$on('InitDirectDelivery', function (event, prms) {

        $scope.tempData = prms;
        $scope.popup_pn_visible = true;

        $scope.bind();
    });


}]);


