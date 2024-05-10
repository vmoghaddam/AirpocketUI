'use strict';
app.controller('RequestNewAddController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.item = {
        Id: -1
    };

    $scope.dg_item_id = {
        Id: null
    };

    $scope.dg_item_ds =
        [
            { Id: 1, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 2, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 3, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 4, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 5, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 6, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 },
            { Id: 7, ata: 1, pn: 2, reference: 3, position: 4, quantity: 5, unit: 6 }
        ];

    $scope.popup_req_visible = false;
    $scope.popup_req = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

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
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', onClick: function (e) {

                        $scope.engEntity.aircraft_id = $scope.selectedTabId;
                        $scope.engEntity.date_initial = $scope.engEntity.date_initial == null ? null : moment($scope.engEntity.date_initial).format('YYYY-MM-DD')
                        if ($scope.engEntity.engine_no == 1)
                            $scope.engEntity.id = $scope.eng1Id
                        else
                            $scope.engEntity.id = $scope.eng2Id

                        mntService.saveEngStatus($scope.engEntity).then(function (response) {

                        });

                        $scope.popup_req_visible = false;
                    }
                }, toolbar: 'bottom'
            },



        ],
        visible: false,
        title: 'New Request',
        closeOnOutsideClick: false,

        bindingOptions: {
            visible: 'popup_req_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    ///////////////////////////////

    $scope.btn_saveItem = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 35,
        onClick: function (e) {
            var row = $scope.dg_item_ds[$scope.dg_item_ds.length - 1];
            $scope.item.Id = row.Id + 1;
            $scope.dg_item_ds.push($scope.item);
            $scope.item = { Id: -1 };
        }

    };

    $scope.btn_deleteItem = {
        text: '',
        type: 'danger',
        icon: 'remove',
        width: 35,
        onClick: function (e) {
            $scope.dg_item_ds = Enumerable.From($scope.dg_item_ds).Where(function (x) {
                return x.Id != $scope.dg_item_id.Id;
            }).ToArray();
        }

    };

    ////////////////////////////////

    $scope.dt_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_deadline = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
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


    $scope.type =
        [
            { title: 'Usual', id: 0 },
            { title: 'A Check', id: 1 },
            { title: 'C Check', id: 2 },
        ];

    $scope.sb_type = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: '',
        }
    }

    $scope.actype =
        [
            { title: 'A320', id: 0 },
            { title: 'B737', id: 1 },
        ];

    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.actype,
        bindingOptions: {
            value: '',
        }
    }

    $scope.priority =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_priority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

  
    $scope.sb_unit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: 'item.unit',
        }
    }

    $scope.sb_position = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: 'item.position',
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

    $scope.txt_pn = {
        bindingOptions: {
            value: 'item.pn'
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

    $scope.num_reference = {
        bindingOptions: {
            value: 'item.reference'
        }
    }



    $scope.gridDataSource =
        [
            { ATA: "test1", Description: 'test test', Id: 0 },
            { ATA: "test2", Description: 'test', Id: 1 },
            { ATA: "test3", Description: 'test test', Id: 2 },
        ];


    $scope.gridBoxOptions = {
        bindingOptions: {
            value: "gridBoxValue",
            opened: "isTreeBoxOpened"
        },
        valueExpr: "ID",
        deferRendering: false,
        placeholder: "Select a value...",
        displayExpr: function (item) {
            return item && item.CompanyName + " <" + item.Phone + ">";
        },
        onValueChanged: function (e) {
            $scope.gridSelectedRowKeys = e.value || [];
        },
        showClearButton: true,
        dataSource: $scope.gridDataSource,
        dataGrid: {
            dataSource: $scope.gridDataSource,
            columns: ["ATA", "Description"],
            hoverStateEnabled: true,
            paging: { enabled: true, pageSize: 10 },
            filterRow: { visible: true },
            scrolling: { mode: "virtual" },
            selection: { mode: "single" },
            height: "100%",
            bindingOptions: {
                "selectedRowKeys": "gridSelectedRowKeys"
            },
            onSelectionChanged: function (selectedItems) {
                var keys = selectedItems.selectedRowKeys;
                $scope.gridBoxValue = keys.length && keys[0] || null;
                $scope.isTreeBoxOpened = false;
            }
        }
    };

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
        height: $(window).height() - 630,
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


        { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },


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
        selection: { mode: 'single' },

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


        $scope.popup_req_visible = true;


    });



}]);


