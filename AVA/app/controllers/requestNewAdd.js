'use strict';
app.controller('RequestNewAddController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.entity = {
        id: 0,
        acfT_TypeId: null,
        acfT_MSNIds: [],
        priorityId: null, 
        requestType: null,
        sender_LocationId: null,
        sender_UserId: null,
        receiver_LocationId: null,
        deadline: null,
        remark: null,
        date: new Date(),
        requestItems: []
    }


    $scope.valEntity = {
        requestItems: [],
        acfT_MSNIds: [],
        acfT_TypeId: null,
        partNumberId: null,
        ignoreControls: false
    }

    $scope.item = {
        id: 0,
        paperId: 0,
        cmP_PartNumberId: 0,
        partNumber_TypeId: 0,
        measurementUnitId: 0,
        cmP_PositionId: 0,
        itemNo: 0,
        ataChapter: null,
        ataTitle: "",
        quantity: 0,
        reference: null,
        remark:  null
    };

    $scope.dg_item_ds = [];

    $scope.dg_item_id = {
        Id: null
    };

   

    $scope.popup_req_visible = false;
    $scope.popup_req = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {


                        vira_general_service.add_request($scope.entity).then(function (response) {

                        });

                        $scope.popup_req_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {

                        $scope.engEntity =
                        {
                            id: null,
                            engEntity: null
                        };
                        $scope.popup_req_visible = false;
                    }
                }, toolbar: 'bottom'
            },
           



        ],
        visible: false,
        title: 'New Request',
        closeOnOutsideClick: false,
        onShown: function (e) {
          

            if ($scope.dg_item_instance)
                $scope.dg_item_instance.repaint();
            


        },
        bindingOptions: {
            visible: 'popup_req_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    ///////////////////////////////

    $scope.btn_saveItem = {
        text: 'Save',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            $scope.valEntity.requestItems = $scope.dg_item_ds;
            $scope.valEntity.acfT_TypeId = $scope.entity.acfT_TypeId;

            vira_general_service.validate_request($scope.valEntity).then(function (res) {
                console.log(res);
                if (res == 0) {
                    var row = $scope.dg_item_ds[$scope.dg_item_ds.length - 1];
                    $scope.item.Id = row != null ? row.Id + 1: 1;
                    $scope.dg_item_ds.push($scope.item);
                    $scope.item = { Id: -1 };
                    $scope.entity.requestItems = [];
                    $scope.entity.requestItems = $scope.dg_item_ds;
                    $scope.entity.acfT_MSNIds = $scope.valEntity.acfT_MSNIds;
                };
            });
        }

    };

    $scope.btn_deleteItem = {
        text: 'Delete',
        type: 'danger',
        icon: 'remove',
        width: 120,
        onClick: function (e) {
            $scope.dg_item_ds = Enumerable.From($scope.dg_item_ds).Where(function (x) {
                return x.Id != $scope.dg_item_id.Id;
            }).ToArray();
        }

    };

    $scope.btn_pn = {
        icon: 'search',
        width: '15%',
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };


    ////////////////////////////////

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

        mntService.getReceiptPN(76).then(function (res) {
            $scope.priority = res;
        });

        mntService.getAFCTType().then(function (res) {
            $scope.acType = res;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.user = response;
            $scope.entity.sender_LocationId = $scope.user[0].gI_LocationId;
            $scope.entity.sender_UserId = $rootScope.vira_user_id;
            $scope.entity.receiver_UserId = $rootScope.vira_user_id;
        });

        mntService.get_company().then(function (response) {
            $scope.ds_company = response;
        });

        mntService.get_register().then(function (response) {
            $scope.registers = response;
        });

        mntService.get_ac_type().then(function (res) {

            $scope.ac_type_ds = res;

        });
        mntService.get_ata_chart().then(function (res) {
            $scope.ds_ata = res;
            console.log($scope.ds_ata);
        });

        mntService.get_shop().then(function (res) {
            $scope.ds_location = res;
        });

        vira_general_service.get_position().then(function (res) {
            $scope.ds_pos = res;
        });

    }

    ////////////////////////////////

    $scope.dt_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.date'
        }
    }

    $scope.dt_deadline = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.deadline'
        }
    }

    $scope.ch_shop = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_eng = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.sb_sender = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'title',
        valueExpr: 'gI_LocationId',
        bindingOptions: {
            value: 'entity.sender_LocationId',
            dataSource: 'user'
        }
    }

    $scope.sb_shop = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: '',
            dataSource: 'ds_location'
        }
    }


    $scope.sb_receiver = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'title',
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            console.log("eeee",e);
        },
        bindingOptions: {
            value: 'entity.receiver_LocationId',
            dataSource: 'ds_location'
        }
    }


    $scope.type =
        [
            { title: 'Usual', id: 0 },
            { title: 'A Check', id: 1 },
            { title: 'C Check', id: 2 },
        ];

    $scope.sb_type = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'title',
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: 'entity.requestType',
        }
    }


    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: 'id',
        valueExpr: 'id',
        onValueChanged: function (e) {
           
            $scope.dg_reg_ds = Enumerable.From($scope.registers).Where(function (x) {
                var models = x.acfT_ModelId.split("-")[0];
                return models == e.value;
            }).ToArray();
           
        },
        bindingOptions: {
            value: 'entity.acfT_TypeId',
            dataSource: 'ac_type_ds',
        }
    }



    $scope.sb_priority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.priorityId',
            dataSource: 'priority',
        }
    }


    $scope.sb_unit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'item.measurementUnitId',
            dataSource: 'itemUnit',
        }
    }

    $scope.sb_position = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'item.cmP_PositionId',
            dataSource: 'ds_pos',
        }
    }


    $scope.num_serialNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.num_reqNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity.remark'
        }
    }

      $scope.txt_itemRemark = {
        bindingOptions: {
            value: 'item.remark'
        }
    }

    $scope.txt_pn = {
        bindingOptions: {
            value: 'item.pnTitle'
        }
    }

    $scope.txt_availability = {
        bindingOptions: {
            value: 'item.availability'
        }
    }

    $scope.num_quantity = {
        bindingOptions: {
            value: 'item.quantity'
        }
    }

    $scope.txt_reference = {
        bindingOptions: {
            value: 'item.reference'
        }
    }


    $scope.isTreeBoxOpened = false;
    $scope.dg_ata_columns = [
        { dataField: 'ata', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 50 },
        { dataField: 'title', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false },
    ];

    //$scope.gridBoxOptions = {
    //    bindingOptions: {
    //        value: "item.ataTitle",
    //        opened: "isTreeBoxOpened",
    //    },

    //    valueExpr: "item.ataTitle",
    //    deferRendering: false,

    //    displayExpr: $scope.item.ataTitle,

    //    //onValueChanged: function (e) {
    //    //    $scope.gridSelectedRowKeys = e.value || [];
    //    //},
    //    showClearButton: false,

    //    dataGrid: {
    //        dataSource: $scope.gridDataSource,
    //        //columns: ["ATA", "Description"],
    //        columns: $scope.dg_ata_columns,
    //        hoverStateEnabled: true,
    //        paging: { enabled: true, pageSize: 10 },
    //        filterRow: { visible: true },
    //        scrolling: { mode: "virtual" },
    //        selection: { mode: "single" },
    //        height: "100%",
    //        bindingOptions: {
    //            "selectedRowKeys": "gridSelectedRowKeys",
    //            dataSource: 'ds_ata',
    //        },
    //        onSelectionChanged: function (selectedItems) {
    //            var keys = selectedItems.selectedRowKeys;
    //            $scope.gridBoxValue = keys.length && keys[0] || null;
    //            $scope.item.ataChapter = keys[0].ata;
    //            $scope.item.ataTitle = keys[0].title;
    //            $scope.isTreeBoxOpened = false;
    //        },

    //    }
    //};

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'ata',
        bindingOptions: {
            value: 'item.ataChapter',
            dataSource: 'ds_ata'
        }
    }

    ///////////////////////////////

    $scope.dg_item_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        { dataField: 'ata', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ata', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ata', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 200 },
        { dataField: 'pn', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'reference', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'position', caption: 'Position', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'quantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'unit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },


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
        height: $(window).height() - 430,
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
            dataSource: 'dg_item_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_reg_columns = [


        { dataField: 'register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },


    ];



    $scope.dg_reg_selected = null;
    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = [];
    $scope.dg_reg_id = { id: null };
    $scope.dg_reg = {



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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 115,
        width: '100%',
        columns: $scope.dg_reg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reg_instance)
                $scope.dg_reg_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            $scope.valEntity.acfT_MSNIds = Enumerable.From(e.selectedRowsData).Select(function (x) { return x.id }).ToArray();
            var data = e.selectedRowsData[0];

            $scope.dg_reg_id.id = e.selectedRowsData[0].id;

            if (!data) {
                $scope.dg_reg_selected = null;
            }
            else
                $scope.dg_reg_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_reg_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    ///////////////////////////////

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

    $scope.$on('InitNewReq', function (event, prms) {
        $scope.tempData = null;

        $scope.tempData = prms;

        $scope.bind();

        $scope.popup_req_visible = true;


    });


    $scope.$on('InitPNSelected', function (event, prms) {

        $scope.item.cmP_PartNumberId = prms.id;
        $scope.item.partNumber_TypeId = prms.partTypeId;
        $scope.valEntity.partNumberId = prms.id;
        $scope.item.pnTitle = prms.partNumber;
    });


}]);


