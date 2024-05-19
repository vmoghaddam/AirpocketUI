'use strict';
app.controller('directDeliveryController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: 120,
        onClick: function (e) {
         
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


    $scope.txt_plaque = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_snbn = {
        bindingOptions: {
            value: ''
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
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_register = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_warehouse = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


   

    $scope.sb_shop = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
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
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'SN / BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

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
        height: $(window).height() - 260,
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

}]);


