﻿'use strict';
app.controller('receiptController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {



    $scope.entity = {
        id: 0,
        //sender_LocationId: null,
        //sender_UserId: null,
        receiver_LocationId: 19, 
        

         receiptType:3,
        receivedPaperNo: null,
        receivedPaperDate: new Date(),
        companyId: null,
        receivedInvoiveNo: null,
        receivedInvoiveDate: null,
        receiptItems:
            []
    }

    $scope.itemEntity = {
        Id: -1,
        itemNo: 1,
        shelfFromId: 48875,
        shelfToId: 48875,
        documentTypeId: 187,
        documentNo: '-',

    }

    $scope.dg_rec_ds = [];

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



    $scope.btn_save = {
        text: 'Save',
        type: 'success',
        icon: '',
        width: '100%',
        onClick: function (e) {
            $scope.entity.receiptItems = $scope.dg_rec_ds
            mntService.addReceipt($scope.entity).then(function (res) {
                console.log(res);
            });
        }

    };

    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: '100%',
        validationGroup:  'recitemadd',
        onClick: function (e) {

            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }

          

            $scope.itemEntity.shelfFromId = 48875,
                $scope.itemEntity.shelfToId = 48875,


                $scope.itemEntity.Id = $scope.itemEntity.Id + 1
            $scope.dg_rec_ds.push($scope.itemEntity);
            $scope.itemEntity = {
                Id: $scope.itemEntity.Id,
                itemNo: 1,
                shelfFromId: 48875,
                shelfToId: 48875,
                documentTypeId: 187,
                documentNo: '-',

            }
        }

    };

    $scope.Delete = function (e) {
        $scope.dg_rec_ds = Enumerable.From($scope.dg_rec_ds).Where(function (x) {
            return x.Id != e.data.Id;
        }).ToArray();
    };

    //$scope.Delete = {
    //    text: 'Delete',
    //    type: 'danger',
    //    icon: 'check',
    //    width: 130,
    //    onClick: function (e) {


    //    }

    //};
    //////////////////////////


    $scope.popup_receipt_visible = false;
    $scope.popup_receipt_title = "Receipt";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_receipt = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        $scope.entity.receiptItems = $scope.dg_rec_ds
                        mntService.addReceipt($scope.entity).then(function (res) {
                            console.log(res);
                            $scope.popup_receipt_visible = false;
                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_receipt_visible = false;

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


            if ($scope.dg_rec_instance)
                $scope.dg_rec_instance.repaint();
            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $scope.popup_receipt_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_receipt_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_receipt_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    //////////////////////////

    $scope.bind = function () {
        mntService.getReceiptPN(101).then(function (res) {
            $scope.itemUnit = res;
        });

        mntService.getReceiptPN(124).then(function (res) {
            $scope.conditionDs = res;
        });


        mntService.getReceiptPN(186).then(function (res) {
            $scope.docTypeDs = res
        });


        mntService.getReceiptPN(194).then(function (res) {
            $scope.currencyDs = res;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.user = response;
            console.log($scope.user);
            $scope.entity.sender_LocationId = $scope.user[0].gI_LocationId;
            $scope.entity.sender_UserId = $rootScope.vira_user_id;
            $scope.entity.receiver_UserId = $rootScope.vira_user_id;
        });

        mntService.get_company().then(function (response) {
            $scope.ds_company = response;
        });

        mntService.get_register().then(function (response) {
            $scope.ds_register = response;
        });


    }

    /////////////////////

    $scope.awbButton = {
        icon: 'search',
        onClick: function () {
            $rootScope.$broadcast('InitAWBPopup', null);
        }

    };





    $scope.txt_awb = {

        bindingOptions: {
            value: 'test',
        },

    };


    $scope.txt_paperNo = {
        bindingOptions: {
            value: 'entity.receivedPaperNo'
        }
    }

    $scope.txt_paperRemark = {
        bindingOptions: {
            value: 'entity.remark'
        }
    }

    $scope.txt_descNo = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.txt_poNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_po = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_rmvRegister = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_rmvAssy = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_charge = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        bindingOptions: {
            value: 'entity.receiver_LocationId',
            dataSource: 'ds_locations',
        }
    }


    $scope.sb_poCompany = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "name",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.companyId',
            dataSource: 'ds_company',
        }
    }


    $scope.sb_rmvRegister = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "register",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.acfT_MSNId',
            dataSource: 'ds_register',
        }
    }


    $scope.sb_rmvAssy = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.accoutn_type_ds =
        [
            { Id: 1, title: "PO" },
            { Id: 2, title: "Removed From A Register" },
            { Id: 3, title: "Direct Charge" },
        ];

    $scope.sb_accountType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'Id',
        dataSource: $scope.accoutn_type_ds,
        bindingOptions: {
            value: 'entity.receiptType',
        }
    }

    $scope.dt_paperDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.receivedPaperDate'
        }
    }

    $scope.dt_poDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_invoice = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.receivedInvoiveDate'
        }
    }


    $scope.txt_awb = {
        bindingOptions: {
            value: ''
        }
    }



    $scope.txt_invoice = {
        bindingOptions: {
            value: 'entity.receivedInvoiveNo'
        }
    }

    $scope.txt_itemPnNo = {
        readOnly: true,
        bindingOptions: {
            value: 'itemEntity.partNumber'
        }
    }

    $scope.is_qty_readonly = false;
    $scope.txt_itemQuantity = {
        bindingOptions: {
            value: 'itemEntity.quantity',
            readOnly: 'is_qty_readonly'
        }
    }


    
    $scope.sb_itemCondition = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.itemEntity.conditionTitle = null;
                return;
            }
            $scope.itemEntity.conditionTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'itemEntity.conditionId',
            dataSource: 'conditionDs',
        }

    }


    $scope.sb_itemUnit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.itemEntity.measurementUnitTitle = null;
                return;
            }
            $scope.itemEntity.measurementUnitTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'itemEntity.measurementUnitId',
            dataSource: 'itemUnit',
        }
    }




    $scope.sb_itemCurrency = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.itemEntity.currencyTitle = null;
                return;
            }
            $scope.itemEntity.currencyTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'itemEntity.currencyId',
            dataSource: 'currencyDs',
        }
    }


    $scope.sb_itemDoc = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.itemEntity.docTypeTitle = null;
                return;
            }
            $scope.itemEntity.docTypeTitle = e.selectedItem.title;
        },
        bindingOptions: {
            value: 'itemEntity.documentTypeId',
            dataSource: 'docTypeDs',
        }
    }

    $scope.txt_itemNo = {
        bindingOptions: {
            value: 'itemEntity.documentNo',
        }
    }
    $scope.dt_itemDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'itemEntity.manufactureDate'
        }
    }

    $scope.dt_itemExp = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'itemEntity.expireDate'
        }
    }


    $scope.txt_itemPrice = {
        bindingOptions: {
            value: 'itemEntity.price'
        }
    }

    $scope.txt_itemId = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemDesc = {
        readOnly:true,
        bindingOptions: {
            value: 'itemEntity.description'
        }
    }

    $scope.txt_itemSnbn = {
        bindingOptions: {
            value: 'itemEntity.sN_BN'
        }
    }

    $scope.txt_itemShelf = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemRemark = {
        bindingOptions: {
            value: 'itemEntity.remark'
        }
    }

    ////////////////////////

    $scope.dg_rec_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        //{ dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left'  },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       

        { dataField: 'sN_BN', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },

        { dataField: 'conditionTitle', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'manufactureDate', caption: 'Man.Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, format: 'yyyy-MM-dd', width: 110 },
        { dataField: 'expireDate', caption: 'Exp. Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, format: 'yyyy-MM-dd', width: 110 },
        { dataField: 'price', caption: 'Price', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'currencyTitle', caption: 'Currency', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'docTypeTitle', caption: 'Doc. Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'documentNo', caption: 'Doc. No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'quantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        { dataField: 'measurementUnitTitle', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        {
            dataField: "Id", caption: '',
            width: 100,
            cellTemplate: "delete",
            allowFiltering: false,
            allowSorting: false,

            fixed: true, fixedPosition: 'right',
        },

    ];



    $scope.dg_rec_selected = null;
    $scope.dg_rec_instance = null;
    $scope.dg_rec = {



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
       // height: $(window).height() - 630,
        width: '100%',
        columns: $scope.dg_rec_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rec_instance)
                $scope.dg_rec_instance = e.component;

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

            $scope.dg_rec_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_rec_id.id);
            if (!data) {
                $scope.dg_rec_selected = null;
            }
            else
                $scope.dg_rec_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_rec_ds',
            height:'get_dg_height()'
        },
        columnChooser: {
            enabled: false
        },

    };
    $scope.get_dg_height = function () {
        return $scope.entity.receiptType == 1 ? $(window).height() - 500 : $(window).height() - 400;
    }
    $scope.$on('InitReceipt', function (event, prms) {

        $scope.tempData = prms;
        $scope.popup_receipt_visible = true;
        //console.log(prms);


    });


    $scope.$on('InitPNSelected', function (event, prms) {
        console.log(prms);
        $scope.itemEntity.cmP_PartNumberId = prms.id;
        $scope.itemEntity.partNumber = prms.partNumber;
        $scope.itemEntity.description = prms.description;
        $scope.itemEntity.ataChapter = prms.ataChapter;
        //console.log("quantity",prms.qty)
        //$scope.itemEntity.quantity = prms.qty;
        //if ($scope.itemEntity.quantity == 1)
        //    $scope.is_qty_readonly = true;
    });


    $scope.bind();


}]);


