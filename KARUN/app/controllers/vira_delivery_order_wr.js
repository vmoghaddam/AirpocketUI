'use strict';
app.controller('vira_delivery_order_wrController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.dto_search = {
        locationId: 0,
        paperYear: 0,
        paperNo: null,
        description: null,
        partNumber: null,
        sN_BN: null,
        dateFrom: null,
        dateTo: null
    }



    ///////////////////



    $scope.btn_search = {
        icon: 'search',
        width: '15%',
        type: 'default',
        onClick: function (e) {
            vira_general_service.delivery_order_wr($scope.dto_search).then(function (res) {
                $scope.dg_delivery_ds = res.data;
            });
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

    //////////////////

    $scope.popup_delivery_visible = false;
    $scope.popup_height = 700;
    $scope.popup_width = 800;
    $scope.popup_delivery_title = "Delivery Order For WR";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_delivery = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {
                        var selected_rows = [];
                        selected_rows = Enumerable.From($scope.dg_inv_ds).Where(function (x) {
                            return x.selected_qty && x.selected_qty > 0 && x.selected_qty <= x.availableQuantity;
                        }).ToArray();
                        if (!selected_rows || selected_rows.length == 0) {
                            General.ShowNotify("No Items Selected", 'error');
                            return;
                        }
                        $rootScope.$broadcast('on_inventory_selected', selected_rows);
                        $scope.popup_delivery_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_delivery_visible = false;

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
        },
        onHiding: function () {


            $scope.popup_delivery_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_delivery_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_delivery_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    ////////////////////

    $scope.bind = function () {

        mntService.getPNSelection($scope.entity).then(function (res) {
            $scope.dg_delivery_ds = res.data;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.entity_req.userId = response[0].uM_UserId;
            $scope.entity_approve.userId = response[0].uM_UserId;
            $scope.entity_cancel.userId = response[0].uM_UserId;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        mntService.get_ata_chart().then(function (res) {
            console.log(res);
            $scope.ds_ata = res;
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

    $scope.sb_year = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Year',
        bindingOptions: {
            value: 'entity.paperYear',
            dataSource: ''
        }
    }

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        placeholder: 'Stock',
        onSelectionChanged: function (e) {
            $scope.entity_nis.sender_LocationId = e.selectedItem.gI_LocationId;
            $scope.entity_nis.sender_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.receiver_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.receiver_LocationId = e.selectedItem.gI_LocationId;
            $scope.entity_info.approver_UserId = e.selectedItem.uM_UserId;
            $scope.entity_info.approver_LocationId = e.selectedItem.gI_LocationId;
        },
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
            dataSource: 'ds_locations'
        }
    }

    $scope.dt_from = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        readOnly: true,
        bindingOptions: {
            value: 'dto_search.dateFrom'
        }
    }

    $scope.dt_to = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        readOnly: true,
        bindingOptions: {
            value: 'dto_search.dateTo'
        }
    }

    $scope.txt_snbn = {

        bindingOptions: {
            value: 'dto_search.sN_BN'
        }
    }

    $scope.txt_paper_number = {

        bindingOptions: {
            value: 'dto_search.partNumber'
        }
    }

    ///////////////////////


    $scope.dg_delivery_columns = [



        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        { dataField: '', caption: 'Paper No.', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Cost Center', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'left', dataType: 'null', allowEditing: false, minWidth: 350 },
        { dataField: '', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 300 },
        { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'null', allowEditing: false, width: 300 },
        { dataField: 'selected_qty', caption: 'Selected Qty', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 100 },
    ];



    $scope.dg_delivery_selected = null;
    $scope.dg_delivery_instance = null;
    $scope.dg_delivery_height = $(window).height() - 225;
    $scope.dg_delivery_width = '100%';
    $scope.dg_delivery = {



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

            console.log(data);



            if (!data) {
                $scope.dg_delivery_selected = null;
            }
            else
                $scope.dg_delivery_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_delivery_ds',
            height: 'dg_delivery_height',
            width: 'dg_delivery_width',
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.$on('InitReturnToStore', function (event, prms) {

        $scope.tempData = prms;

        $scope.bind();

        $scope.popup_delivery_visible = true;
    });

    $scope.$on('InitPNSelected', function (event, prms) {
        $scope.dto_search.partNumber = prms.partNumber;
    });


}]);


