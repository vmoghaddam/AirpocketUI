'use strict';
app.controller('nisFollowUpController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.btn_add = {
        text: 'Add',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            $rootScope.$broadcast("InitNISPopup", null);

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

    $scope.priority =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_reqPriority = {
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


    $scope.years =
        [
            { title: '96', id: 0 },
            { title: '97', id: 1 },
            { title: '98', id: 2 },
            { title: '90', id: 3 },
            { title: '00', id: 4 },
            { title: '01', id: 5 },
            { title: '02', id: 6 },
            { title: '03', id: 7 },
        ];

    $scope.sb_year = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.years,
        bindingOptions: {
            value: '',
        }
    }

    $scope.txt_nisNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.dt_dateFrom = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_dateTo = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    ///////////////////////


    $scope.dg_req_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            caption: 'Request',
            alignment: 'center',
            columns: [
                { dataField: '', caption: ' Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'NIS No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Issued By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Approver', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        {
            caption: 'Cancel NIS',
            alignment: 'center',
            columns: [
                { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'MRF NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'PO',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'PO No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Delivery Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Receiving',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Receiving No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
            ]
        },
    ];



    $scope.dg_req_selected = null;
    $scope.dg_req_instance = null;
    $scope.dg_req = {



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
        columns: $scope.dg_req_columns,
        onContentReady: function (e) {
            if (!$scope.dg_req_instance)
                $scope.dg_req_instance = e.component;

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

            $scope.dg_req_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_req_id.id);
            if (!data) {
                $scope.dg_req_selected = null;
            }
            else
                $scope.dg_req_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_req_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

}]);


