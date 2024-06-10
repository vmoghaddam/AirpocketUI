'use strict';
app.controller('inventory_totalController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.form_type = 'do';

    $scope.entity =
    {
        partNumberTypeId: [],
        partNumber: null,
        showInterchanges: false,
        description: null,
        ataChapter: null,
        acfT_Type: [],
        shelf: null,
        locationId: null,
        showZeroStockInventory: false

    }

    $scope.cmpEntity = {
        locationId: null,
        partNumberTypeId: [],
        description: null,
        partNumber: null,
        showInterchanges: false,
        sN_BN: null,
        ataChapter: null,
        acfT_Type: [],
        shelf: null,
        remainToExpire: null,
        hasShelfTime: false
    }

    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        // icon: 'search',
        //  width: 120,
        onClick: function (e) {
            mntService.get_part_number($scope.entity).then(function (res) {
                $.each(res, function (_i, _d) {
                    _d.selected_qty = null;
                });

                $scope.dg_inv_ds = res;

            });
        }

    };

    //////////////////

    $scope.detail_height = $(window).height() - 252;

    //////////////////

    $scope.popup_inventory_visible = false;
    $scope.popup_height = $(window).height() - 50;
    $scope.popup_width = $(window).width() - 100;
    $scope.popup_inventory_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_inventory = {

        title: 'Inventory Total',
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {
                        if ($scope.form_type == 'do') {
                            console.log('dool', $scope.dg_inv_ds);
                            var selected_rows = [];
                            selected_rows = Enumerable.From($scope.dg_inv_ds).Where(function (x) {
                                //console.log('sel qty', x.selected_qty);
                                console.log('sel qty', x);
                                //<= x.availableQuantity
                                console.log('check', x.selected_qty <= x.availableQuantity);
                                return x.selected_qty && x.selected_qty > 0 && x.selected_qty <= x.availableQuantity;
                            }).ToArray();
                            //var query_items = [];

                            //var _result = [];
                            //$.each(selected_rows, function (_i, _d) {

                            //    var item = {
                            //        "partNumberId": _d.cmP_PartNumberId,
                            //        "quantity": _d.selected_qty,
                            //        "stockLocationId": _d.receiver_LocationId,
                            //        //"stockUserId": $scope.,
                            //        "componentId": null
                            //    };

                            //    //Fill Item By _d
                            //    //query_items.push(item);
                            //    mntService.get_selected_component().then(function (res) {
                            //        _result = _result.concat(res.data);
                            //    }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });

                            //});





                            $rootScope.$broadcast('on_inventory_selected', selected_rows);

                            //boro to cos 
                            //close
                            $scope.popup_inventory_visible = false;

                        }


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_inventory_visible = false;

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

            if ($scope.tempData && $scope.tempData.location_id)
                $scope.entity.locationId = $scope.tempData.location_id

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $scope.popup_inventory_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_inventory_visible',
            fullScreen: 'isFullScreen',

            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };




    ////////////////////

    $scope.txt_partNo = {
        bindingOptions: {
            value: 'entity.partNumber'
        }
    }

    $scope.ch_alt = {
        text: 'Alt.',
        bindingOptions: {
            value: 'entity.showInterchanges'
        }
    }


    $scope.txt_shelf = {
        bindingOptions: {
            value: 'entity.shelf'
        }
    }


    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "id",
        valueExpr: 'id',
        bindingOptions: {
            value: '',
            dataSource: 'ac_type_ds',
        }
    }

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ataChapter',
            dataSource: 'ds_ata'
        }
    }

    $scope.sb_location = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        bindingOptions: {
            value: 'entity.locationId',
            dataSource: 'ds_locations',
            readOnly: 'tempData.location_id',
        }
    }

    $scope.sb_pnCategory = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: '',
            dataSource: 'pn_category_ds',
        }
    }

    $scope.btn_pn = {
        icon: 'search',
        width: '10%',
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };

    $scope.bind = function () {

        mntService.get_ata_chart().then(function (res) {
            $scope.ds_ata = res;
        });
        mntService.get_ac_type().then(function (res) {

            $scope.ac_type_ds = res;

        });

        mntService.getReceiptPN(97).then(function (res) {
            $scope.pn_category_ds = res;
        });


        mntService.get_shop().then(function (res) {
            console.log(res);
            $scope.shop_ds = res;
        });

        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (res) {
            $scope.ds_locations = res;
        });









    }

    ///////////////////////


    $scope.dg_inv_columns = [



        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        { dataField: 'partNumber', caption: 'P/N', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 270, fixed: true, fixedPosition: 'left' },
        { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 80 },

        { dataField: '', caption: 'Effectivity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        {
            caption: 'Location',
            alignment: 'center',
            columns: [
                { dataField: 'receiverLocation_Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        {
            caption: 'Control',
            alignment: 'center',
            columns: [
                { dataField: 'minPoint', caption: 'Min', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'reorderPoint', caption: 'Reorder', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: 'maxPoint', caption: 'Max', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Quantity',
            alignment: 'center',
            fixedPosition: 'right',
            fixed: true,
            columns: [
                { dataField: 'availableQuantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },

    ];


    $scope.dg_height = $(window).height() - 105;
    $scope.dg_inv_selected = null;
    $scope.dg_inv_instance = null;
    $scope.dg_inv = {



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

        editing: {
            mode: "cell",
            allowUpdating: true
        },

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        //width: $(window).width(),
        columns: $scope.dg_inv_columns,
        onContentReady: function (e) {
            if (!$scope.dg_inv_instance)
                $scope.dg_inv_instance = e.component;

        },

        onRowClick: function (e) {


        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.cmpEntity.partNumber = data.partNumber;
            $scope.cmpEntity.locationId = data.receiver_LocationId;
            $scope.row_selected = data;
            mntService.get_inventory($scope.cmpEntity).then(function (res) {
                $scope.ds_details = res;
            });
            if (!data) {
                $scope.dg_inv_selected = null;
            }
            else
                $scope.dg_inv_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_inv_ds',
            height: 'dg_height'
        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.$on('InitInventoryTotalPopup', function (event, prms) {

        $scope.tempData = prms;
        //alert($scope.tempData.location_id);

        $scope.bind();

        $scope.popup_inventory_visible = true;
    });



}]);


