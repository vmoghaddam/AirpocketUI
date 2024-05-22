'use strict';
app.controller('aggregateController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce',  
    function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce ) {



        mntService.authenticate({ "username":"test","password":"1234"}).then(function (response) {

             



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            alert("Refresh")

        }

    };


    //////////////////


    $scope.txt_parNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_description = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.txt_snbn = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_plaque = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_remExp = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.type =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_acType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_asset = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_location = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: '',
        }
    }


    $scope.txt_shelf = {
        bindingOptions: {
            value: ''
        }
    }

 
    $scope.ch_shelfTime = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_from = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_to = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    ///////////////////////


    $scope.dg_agg_columns = [


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
                { dataField: '', caption: ' Plaque', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: ' Effectivity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Part Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'SN / BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        {
            caption: 'Keeping Location',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Personnel', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Shelf Time',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Remain Day', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Quantity',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Reserved', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
    ];



    $scope.dg_agg_selected = null;
    $scope.dg_agg_instance = null;
    $scope.dg_agg = {



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
        columns: $scope.dg_agg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_agg_instance)
                $scope.dg_agg_instance = e.component;

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

            $scope.dg_agg_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_agg_id.id);
            if (!data) {
                $scope.dg_agg_selected = null;
            }
            else
                $scope.dg_agg_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_agg_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

}]);


