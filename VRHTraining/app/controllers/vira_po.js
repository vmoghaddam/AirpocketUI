'use strict';
app.controller('vira_poController', ['$scope', '$rootScope', function ($scope, $rootScope) {




    $scope.newPn = {
        icon: 'plus',
        width: 30,
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitNewPNPopup', null);
        }

    };
    $scope.btn_pn = {
        icon: 'search',
        width: 30,
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };



    $scope.btn_save = {
        text: 'Save',
        type: 'success',
        icon: '',
        width: '100%',
        onClick: function (e) {
            $scope.entity.receiptItems = $scope.dg_item_ds
            mntService.addReceipt($scope.entity).then(function (res) {
                console.log(res);
            });
        }

    };

    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: 120,
        onClick: function (e) {

        }

    };

    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: '',
        width: 120,
        onClick: function (e) {

        }

    };


    $scope.btn_update = {
        text: 'Update',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {

        }

    };

    //////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };

    $scope.popup_add_visible = false;
    $scope.popup_add_title = "New RFQ";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;




    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {
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
                                $scope.entity.paperNo = res.data.paperNo;

                                $scope.popup_result_visible = true;

                            }

                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_add_visible = false;

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
            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            $scope.is_stock_readonly = false;
            if ($scope.tempData != null) {
                //$scope.bind();
                //goh
                if ($scope.tempData.location_id) {
                    $scope.entity.receiver_LocationId = $scope.tempData.location_id;
                }
            }


            if ($scope.dg_item_instance)
                $scope.dg_item_instance.repaint();
            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $rootScope.$broadcast('ReceiptClosed', {});
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
                    type: 'default', text: 'New Receipt', onClick: function (e) {
                        //$scope.loadingVisible = true;
                        //$scope.entity.receiptItems = $scope.dg_item_ds
                        //mntService.addReceipt($scope.entity).then(function (res) {
                        //    $scope.loadingVisible = false;
                        //    console.log(res);
                        //    if (res.errorCode) {
                        //        General.ShowNotify(res.errorMessage, 'error');
                        //    }
                        //    else {
                        //        $scope.entity.paperNo = res.data.paperNo;
                        //        General.ShowNotify(Config.Text_SavedOk, 'success');
                        //        $scope.popup_add_visible = false;

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

    //////////////////////////

    $scope.dt_po_date = {
        bindingOptions: {
            value: 'poDate'
        }
    };

    $scope.txt_company = {
        bindingOptions: {
            value: 'company'
        }
    };

    $scope.txt_purchase_no = {
        bindingOptions: {
            value: 'purchaseNo'
        }
    };

    $scope.txt_contract_no = {
        bindingOptions: {
            value: 'contractNo'
        }
    };

    $scope.sb_priority = {
        bindingOptions: {
            value: 'priority'
        }
    };

    $scope.dt_deadline = {
        bindingOptions: {
            value: 'deadline'
        }
    };

    $scope.txt_destination = {
        bindingOptions: {
            value: 'destination'
        }
    };

    $scope.txt_remark = {
        bindingOptions: {
            value: 'remark'
        }
    };

    $scope.txt_itemPnNo = {
        bindingOptions: {
            value: 'itemPnNo'
        }
    };

    $scope.newPn = {
        bindingOptions: {
            onClick: 'onNewPnClick'
        }
    };

    $scope.txt_ata = {
        bindingOptions: {
            value: 'ata'
        }
    };

    $scope.txt_itemQuantity = {
        bindingOptions: {
            value: 'itemQuantity'
        }
    };

    $scope.sb_itemUnit = {
        bindingOptions: {
            value: 'itemUnit'
        }
    };

    $scope.txt_price = {
        bindingOptions: {
            value: 'price'
        }
    };

    $scope.sb_currency = {
        bindingOptions: {
            value: 'currency'
        }
    };

    $scope.sb_condition = {
        bindingOptions: {
            value: 'condition'
        }
    };

    $scope.txt_days = {
        bindingOptions: {
            value: 'days'
        }
    };

    $scope.dt_delivery_date = {
        bindingOptions: {
            value: 'deliveryDate'
        }
    };

    $scope.txt_reference = {
        bindingOptions: {
            value: 'reference'
        }
    };

    $scope.txt_model = {
        bindingOptions: {
            value: 'model'
        }
    };

    $scope.txt_brand = {
        bindingOptions: {
            value: 'brand'
        }
    };

    $scope.txt_itemRemark = {
        bindingOptions: {
            value: 'itemRemark'
        }
    };

  


    //////////////////////////


    $scope.dg_item_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        //{ dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_item_selected = null;
    $scope.dg_item_instance = null;
    $scope.dg_item = {



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
        height: $(window).height() - 530,
        width: '100%',
        columns: $scope.dg_item_columns,
        onContentReady: function (e) {
            if (!$scope.dg_item_instance)
                $scope.dg_item_instance = e.component;

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

            $scope.dg_item_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_item_id.id);
            if (!data) {
                $scope.dg_item_selected = null;
            }
            else
                $scope.dg_item_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_item_ds',
        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.$on('InitNewPO', function (event, prms) {

        $scope.tempData = prms;
        $scope.popup_add_visible = true;
    });


    $scope.$on('InitPNSelected', function (event, prms) {

    });


}]);