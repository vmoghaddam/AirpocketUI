'use strict';
app.controller('vira_return_storeController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.entity = {
        id: 0,
        receiver_LocationId: 0,
        receiver_UserId: 0,
        remark: null,
        warehouseReturnItems: [
            {
                id: 0,
                paperId: 0,
                paperItemId: 0,
                shelfFromId: 0,
                shelfToId: 0,
                itemNo: 0,
                quantity: 0,
                remark: null
            }
        ]

    }



    ///////////////////

    $scope.btn_remove = {
        text: 'Remove',
        type: 'danger',
        icon: 'close',
        width: 130,
        onClick: function (e) {
            vira_general_service.delete_component_cache().then(function (res) {

            });
        }

    };

    $scope.btn_component = {
        text: 'Component',
        type: 'normal',
        icon: '',
        width: 120,
        onClick: function (e) {
        }

    };

    $scope.btn_do = {
        text: 'D/O',
        type: 'normal',
        icon: '',
        width: 120,
        onClick: function (e) {
            $rootScope.$broadcast('InitReturnToStore', null);
        }

    };


    //////////////////

    $scope.popup_store_visible = false;
    $scope.popup_height = 700;
    $scope.popup_width = 800;
    $scope.popup_store_title = "Return To Store";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_store = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {
                        $scope.popup_store_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        General.Confirm("Are you sure you want to close the form?", function () {
                            vira_general_service.delete_component_cache().then(function (res) {

                            });
                            $scope.popup_store_visible = false;

                        });

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

            //if ($scope.isNew) {
            //    $scope.isContentVisible = true;
            //}
            //if ($scope.tempData != null)

            $scope.bind();
        },
        onHiding: function () {


            $scope.popup_store_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_store_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_store_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    ////////////////////

    $scope.bind = function () {

        mntService.getPNSelection($scope.entity).then(function (res) {
            $scope.dg_store_ds = res.data;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.entity_req.userId = response[0].uM_UserId;
            $scope.entity_approve.userId = response[0].uM_UserId;
            $scope.entity_cancel.userId = response[0].uM_UserId;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        mntService.get_ata_chart().then(function (res) {

            $scope.ds_ata = res;
        });

        mntService.getReceiptPN(209).then(function (res) {
            $scope.ds_tag = res;
        });
    }


    ////////////////////

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        placeholder: 'Stock',
        onSelectionChanged: function (e) {
            $scope.entity.receiver_LocationId = e.selectedItem.gI_LocationId;
            $scope.entity.receiver_UserId = e.selectedItem.uM_UserId;
            $scope.warehouse_type = e.selectedItem.warehouseType;


            vira_general_service.get_tag_location($scope.warehouse_type).then(function (res) {
                $scope.entity.tag = res.data.id

                if ($scope.entity.tag == 213)
                    $scope.isDO = true;
            });
        },
        bindingOptions: {
            value: 'entity.receiver_UserId',
            dataSource: 'ds_locations'
        }
    }

    $scope.sb_tag = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Stock',
        onSelectionChanged: function (e) {
            $scope.entity.tag = e.selectedItem.id

            if ($scope.entity.tag == 213)
                $scope.isDO = true;

        },
        bindingOptions: {
            value: 'entity.tag',
            dataSource: 'ds_tag'
        }
    }

    $scope.dt_date = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        readOnly: true,
        bindingOptions: {
            value: ''
        }
    }

    ///////////////////////


    $scope.dg_store_columns = [



        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'SN / BN', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
    ];



    $scope.dg_store_selected = null;
    $scope.dg_store_instance = null;
    $scope.dg_store_height = 500;
    $scope.dg_store_width = '100%';
    $scope.dg_store = {



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


        columns: $scope.dg_store_columns,
        onContentReady: function (e) {
            if (!$scope.dg_store_instance)
                $scope.dg_store_instance = e.component;

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
                $scope.dg_store_selected = null;
            }
            else
                $scope.dg_store_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_store_ds',
            height: 'dg_store_height',
            width: 'dg_store_width',
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.$on('InitReturnToStore', function (event, prms) {

        $scope.tempData = prms;

        $scope.bind();

        $scope.popup_store_visible = true;
    });



}]);


