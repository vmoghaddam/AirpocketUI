'use strict';
app.controller('inventoryController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            alert("Refresh")
        }

    };

    //////////////////

    $scope.popup_inventory_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_inventory_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_inventory = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {

                       

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

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],

            };
            $scope.entity.Result = null;
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
            title: 'popup_inventory_title',
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
            value: ''
        }
    }

    $scope.ch_alt = {
        bindingOptions: {
            value: ''
        }
    }

   
    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_location = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_pnCategory = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


   
    ///////////////////////


    $scope.dg_inv_columns = [



        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            caption: 'Technical Information',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Effectivity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        {
            caption: 'Location',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Min', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Reorder', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Max', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Quantity',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Selected City', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
       
    ];



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

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 260,
        width: $(window).width(),
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

            console.log(data);

            $scope.dg_inv_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_inv_id.id);
            if (!data) {
                $scope.dg_inv_selected = null;
            }
            else
                $scope.dg_inv_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_inv_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.$on('InitInventoryPopup', function (event, prms) {

        $scope.tempData = prms;

        console.log("Inventory Called");

        $scope.popup_inventory_visible = true;
    });



}]);


