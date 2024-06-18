'use strict';
app.controller('vira_beginning_addController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {
    $scope.entity =
    {
        id: 0,
        stock_LocationId: 0,
        sender_LocationId: 0,
        sender_UserId: 0,
        cmP_PartNumberId: 0,
        cmP_ComponentId: 0,
        conditionId: 0,
        measurementUnitId: 0,
        currencyId: 0,
        documentTypeId: 0,
        documentNo: null,
        sN_BN: null,
        shelfFromId: 29358,
        shelfToId: 29358,
        quantity: null,
        price: null,
        expireDate: null,
        manufactureDate: null,
        remark: null
    }


    $scope.isNew = null;

    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            mntService.getPNSelection($scope.entity).then(function (res) {
                $scope.dg_pn_ds = res.data;
            });
        }

    };


    $scope.newPn = {
        icon: 'plus',
        width: '50%',
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitNewPNPopup', null);
        }

    };
    $scope.btn_pn = {
        icon: 'search',
        width: '50%',
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };

    //////////////////

    $scope.popup_add_visible = false;
    $scope.popup_height = 620;
    $scope.popup_width = 400;
    $scope.popup_add_title = "Beginning Document Add";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        if ($scope.isNew) {
                            vira_general_service.add_beginning_inventory($scope.entity).then(function (response) {
                                console.log(response);
                                $scope.entity =
                                {
                                    id: 0,
                                    stock_LocationId: 0,
                                    sender_LocationId: 0,
                                    sender_UserId: 0,
                                    cmP_PartNumberId: 0,
                                    cmP_ComponentId: 0,
                                    conditionId: 0,
                                    measurementUnitId: 0,
                                    currencyId: 0,
                                    documentTypeId: 0,
                                    documentNo: null,
                                    sN_BN: null,
                                    shelfFromId: 29358,
                                    shelfToId: 29358,
                                    quantity: null,
                                    price: null,
                                    expireDate: null,
                                    manufactureDate: null,
                                    remark: null
                                }
                            });
                        } else {
                            vira_general_service.edit_beginning_inventory($scope.entity).then(function (response) {
                                console.log(response);
                                $scope.entity =
                                {
                                    id: 0,
                                    stock_LocationId: 0,
                                    sender_LocationId: 0,
                                    sender_UserId: 0,
                                    cmP_PartNumberId: 0,
                                    cmP_ComponentId: 0,
                                    conditionId: 0,
                                    measurementUnitId: 0,
                                    currencyId: 0,
                                    documentTypeId: 0,
                                    documentNo: null,
                                    sN_BN: null,
                                    shelfFromId: 29358,
                                    shelfToId: 29358,
                                    quantity: null,
                                    price: null,
                                    expireDate: null,
                                    manufactureDate: null,
                                    remark: null
                                }
                            });
                        }
                        $scope.popup_add_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_add_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: false,
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


            $scope.popup_add_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',


        }
    };

    ////////////////////

    $scope.bind = function () {

        mntService.getReceiptPN(101).then(function (res) {
            $scope.itemUnit = res;
        });

        mntService.getReceiptPN(124).then(function (res) {
            $scope.conditionDs = res;
        });

        mntService.getReceiptPN(194).then(function (res) {
            $scope.currencyDs = res;
        });

        mntService.getReceiptPN(186).then(function (res) {
            $scope.docTypeDs = res
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.user = response;
            $scope.entity.stock_LocationId = $scope.user[0].gI_LocationId;
            $scope.entity.sender_LocationId = $scope.user[0].gI_LocationId;
            $scope.entity.sender_UserId = $rootScope.vira_user_id;
            //$scope.entity.receiver_UserId = $rootScope.vira_user_id;
        });

    }


    ////////////////////



    $scope.txt_pn = {
        bindingOptions: {
            value: 'entity.partNumber'
        }
    }

    $scope.txt_desc = {
        bindingOptions: {
            value: 'entity.description'
        }
    }

    $scope.txt_snbn = {
        bindingOptions: {
            value: 'entity.sN_BN'
        }
    }

    $scope.sb_condition = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.entity.conditionTitle = null;
                return;
            }
            $scope.entity.conditionTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'entity.conditionId',
            dataSource: 'conditionDs',
        }

    }





    $scope.txt_shelf = {
        bindingOptions: {
            value: 'entity.shelfFromId'
        }
    }


    $scope.txt_qty = {
        bindingOptions: {
            value: 'entity.quantity'
        }
    }


    $scope.sb_unit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.entity.measurementUnitTitle = null;
                return;
            }
            $scope.entity.measurementUnitTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'entity.measurementUnitId',
            dataSource: 'itemUnit',
        }
    }



    $scope.txt_price = {
        bindingOptions: {
            value: 'entity.price'
        }
    }


    $scope.sb_currency = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.entity.currencyTitle = null;
                return;
            }
            $scope.entity.currencyTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'entity.currencyId',
            dataSource: 'currencyDs',
        }
    }



    $scope.dt_man = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.manufactureDate'
        }
    }


    $scope.dt_exp = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.expireDate'
        }
    }


    $scope.sb_docType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.entity.docTypeTitle = null;
                return;
            }
            $scope.entity.docTypeTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'entity.documentTypeId',
            dataSource: 'docTypeDs',
        }
    }




    $scope.txt_docNo = {
        bindingOptions: {
            value: 'entity.documentNo'
        }
    }


    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity.remark'
        }
    }


    ///////////////////////


    $scope.dg_pn_columns = [



        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'acfT_Type', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_pn_selected = null;
    $scope.dg_pn_instance = null;
    $scope.dg_pn_height = 500,
        $scope.dg_pn = {



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

            width: $(window).width(),
            columns: $scope.dg_pn_columns,
            onContentReady: function (e) {
                if (!$scope.dg_pn_instance)
                    $scope.dg_pn_instance = e.component;

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



                if (!data) {
                    $scope.dg_pn_selected = null;
                }
                else
                    $scope.dg_pn_selected = data;


            },

            bindingOptions: {
                dataSource: 'dg_pn_ds',
                height: 'dg_pn_height',
            },
            columnChooser: {
                enabled: false
            },

        };

    $scope.$on('InitBeginningPopup', function (event, prms) {

        $scope.tempData = prms;
        if ($scope.tempData == null)
            $scope.isNew = true
        else {
            $scope.isNew = false
            console.log("It's in editing mode")
            $scope.entity.id = $scope.tempData.paperId;
            //$scope.entity.stock_LocationId= $scope.tempData.;
            $scope.entity.sender_LocationId = $scope.tempData.sender_LocationId;
            //$scope.entity.sender_UserId= $scope.tempData.;
            $scope.entity.cmP_PartNumberId = $scope.tempData.cmP_PartNumberId;
            $scope.entity.cmP_ComponentId = $scope.tempData.cmP_ComponentId;
            //$scope.entity.conditionId= $scope.tempData.;
            $scope.entity.measurementUnitId = $scope.tempData.measurementUnitId;
            //$scope.entity.currencyId= $scope.tempData.;
            $scope.entity.documentTypeId = 187;
            $scope.entity.documentNo= "-";
            $scope.entity.sN_BN = $scope.tempData.sN_BN;
            $scope.entity.shelfFromId = 29358;
            $scope.entity.shelfToId = 29358;
            $scope.entity.quantity = $scope.tempData.quantity;
            $scope.entity.price= null;
            //$scope.entity.expireDate= $scope.tempData.;
            //$scope.entity.manufactureDate= $scope.tempData.;
            $scope.entity.remark = $scope.tempData.remark

        }


        console.log($scope.tempData);


        $scope.bind();

        $scope.popup_add_visible = true;
    });

    $scope.$on('InitPNSelected', function (event, prms) {
        console.log(prms);
        $scope.entity.cmP_PartNumberId = prms.id;
        $scope.entity.partNumber = prms.partNumber;
        $scope.entity.description = prms.description;
        $scope.itemEntity.ataChapter = prms.ataChapter;
        console.log("quantity", prms.qty)
        $scope.itemEntity.quantity = prms.qty;
        if ($scope.itemEntity.quantity == 1)
            $scope.is_qty_readonly = true;
    });

}]);


