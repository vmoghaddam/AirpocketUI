'use strict';
app.controller('vira_po_listController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.btn_add = {
        text: 'New',
        type: 'default',
        icon: '',
        width: 120,
        onClick: function (e) {
            $scope.$broadcast('InitNewPO', null);
        }
    }

    $scope.selectedTabIndex = 0;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Purchase Item", id: 'purchase' },
        { text: "Reciving", id: 'reciving' },
    ];

    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'purchase':
                    break;
                case 'reciving':
                    break;
              
                default:
                    break;
            }
          
        }
        catch (e) {

        }

    });

    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

    $scope.tabs_options = {
        bindingOptions: {
            selectedIndex: 'selectedTabIndex',
            dataSource: 'tabs'
        },
        onItemClick: function (e) {
            // Handle tab click event
        }
    };



    /////////////

    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        onClick: function (e) {

        }
    };

    $scope.dg_purchase_columns = [

        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
                { dataField: '', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'Stock Control',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Issued By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Receiver Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
                { dataField: '', caption: 'Approved', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
            ]
        },
    ];
    $scope.dg_purchase_selected = null;
    $scope.dg_purchase_instance = null;
    $scope.dg_purchase_height = $(window).height() - 330;
    $scope.dg_purchase_id = null;
    $scope.dg_purchase = {



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
        height: $scope.dg_purchase_height,
        columns: $scope.dg_purchase_columns,
        onContentReady: function (e) {
            if (!$scope.dg_purchase_instance)
                $scope.dg_purchase_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "fullNo" && e.data.isApproved == 1) {

                e.cellElement.css('background', '#71dada');

            }
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            $scope.dg_purchase_id = e.selectedRowsData[0].id;
            vira_general_service.get_request_cartable_item_line($scope.dg_purchase_id).then(function (response) {
                $scope.dg_items_ds = response;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            $scope.entity_info.priority = data.priority;
            $scope.entity_info.deadline = data.deadline;
            $scope.entity_info.date = data.paperDate;
            $scope.entity_info.no = data.fullNo;
            $scope.entity_info.remark = data.remark;
            $scope.entity_info.status = data.lastStatusId;

            $scope.entity_approve.requestId = data.id;
            $scope.entity_approve.locationId = data.sender_LocationId;

            $scope.entity_cancel.paperId = data.id;
            $scope.entity_cancel.locationId = data.sender_LocationId;

            $scope.entity_edit = data;

            if (!data) {
                $scope.dg_purchase_selected = null;
            }
            else
                $scope.dg_purchase_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_purchase_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_items_columns = [

        { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: '', caption: 'Engineering Comment', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350 },
    ];
    $scope.dg_items_height = $(window).height() - 375;
    $scope.dg_items_selected = null;
    $scope.dg_items_instance = null;
    $scope.dg_items_id = null;
    $scope.dg_items = {



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
        height: $scope.dg_items_height,
        columns: $scope.dg_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_items_instance)
                $scope.dg_items_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_items_selected = null;
            }
            else
                $scope.dg_items_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_items_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


     $scope.dg_receiving_columns = [

        { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: '', caption: 'Engineering Comment', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350 },
    ];
    $scope.dg_receiving_height = $(window).height() - 586;
    $scope.dg_receiving_selected = null;
    $scope.dg_receiving_instance = null;
    $scope.dg_receiving_id = null;
    $scope.dg_receiving = {



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
        height: $scope.dg_receiving_height,
        columns: $scope.dg_receiving_columns,
        onContentReady: function (e) {
            if (!$scope.dg_receiving_instance)
                $scope.dg_receiving_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_receiving_selected = null;
            }
            else
                $scope.dg_receiving_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_receiving_ds'
        },
        columnChooser: {
            enabled: false
        },

    };



}]);