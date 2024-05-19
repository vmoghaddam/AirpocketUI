'use strict';
app.controller('disaggregationController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


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

    $scope.sb_ata = {
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

    $scope.sb_pnCategory = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: '',
        }
    }

    $scope.ch_inventory = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }
   
    ///////////////////////


    $scope.dg_disAgg_columns = [


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
                { dataField: '', caption: ' Effectivity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        {
            caption: 'Location',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Control Point',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Min', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Reord.', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Max', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Opt.', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Quantity',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
      ];



    $scope.dg_disAgg_selected = null;
    $scope.dg_disAgg_instance = null;
    $scope.dg_disAgg = {



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
        columns: $scope.dg_disAgg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_disAgg_instance)
                $scope.dg_disAgg_instance = e.component;

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

            $scope.dg_disAgg_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_disAgg_id.id);
            if (!data) {
                $scope.dg_disAgg_selected = null;
            }
            else
                $scope.dg_disAgg_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_disAgg_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

}]);


