'use strict'
app.controller('vira_nis_listController', ['$scope', 'vira_general_service', 'mntService', '$rootScope', function ($scope, vira_general_service, mntService, $rootScope) {
    $scope.selectedTabIndex = 0;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Active", id: 'active' },
        { text: "MRF", id: 'mrf' },
        { text: "Archive", id: 'archive' },
    ];

    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'active':
                    break;
                case 'mrf':
                    break;
                case 'archive':
                    break;

                default:
                    break;
            }
            //if ($scope.dg_errors_instance)
            //    $scope.dg_errors_instance.refresh();
            //if ($scope.dg_crew_instance)
            //    $scope.dg_crew_instance.refresh();
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
    /////////////////////////

  

    $scope.txt_nis_no = {
        bindingOptions: {
            value: 'nisNo'
        }
    };

    $scope.txt_desc = {
        bindingOptions: {
            value: 'description'
        }
    };

    $scope.txt_pn = {
        bindingOptions: {
            value: 'partNo'
        }
    };

    $scope.sb_priority = {
        bindingOptions: {
            value: 'priority'
        }
    };

    $scope.dt_from = {
        bindingOptions: {
            value: 'dateFrom'
        }
    };

    $scope.dt_to = {
        bindingOptions: {
            value: 'dateTo'
        }
    };

    $scope.txt_archive_nis = {
        bindingOptions: {
            value: 'archiveNisNo'
        }
    };

    $scope.txt_archive_mrf = {
        bindingOptions: {
            value: 'archiveMrfNo'
        }
    };

    $scope.txt_archive_pn = {
        bindingOptions: {
            value: 'archivePartNo'
        }
    };

    $scope.dt_archive_from = {
        bindingOptions: {
            value: 'archiveDateFrom'
        }
    };

    $scope.dt_archive_to = {
        bindingOptions: {
            value: 'archiveDateTo'
        }
    };

    /////////////////////////

    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            vira_general_service.get_nis_approving($scope.dto_search).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_nis_ds = (response.data);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };

    $scope.btn_archive_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            vira_general_service.get_nis_approving($scope.dto_search).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_nis_ds = (response.data);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };

    $scope.btn_pn = {
        icon: 'search',
        width: 30,
        type: 'default',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };

    $scope.dg_nis_height = $(window).height() - 295;
    $scope.dg_nis_columns = [
        {
            caption: 'NIS Information',
            alignment: 'center',
            columns: [
                { dataField: 'NisNo', caption: 'Nis No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'paper_date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
                { dataField: 'Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'deadline', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Creator', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180, },
                { dataField: 'Description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 320 },
                { dataField: 'PartNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'IpC_Reference', caption: 'IPC Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Quantity', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                { dataField: '', caption: 'Engineering Comments', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 450 },
            ]
        },

        {
            caption: 'Request',
            alignment: 'center',
            columns: [
                { dataField: 'Request_FullNo', caption: 'Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Request_Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Request_ACFTType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Request_Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Request_SenderUser_FullName', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, },
                { dataField: 'Stock_Title', caption: 'Stock', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 450 },
            ]
        },

    ];



    $scope.dg_nis_selected = null;
    $scope.dg_nis_instance = null;
    $scope.dg_nis = {



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


        columns: $scope.dg_nis_columns,
        onContentReady: function (e) {
            if (!$scope.dg_nis_instance)
                $scope.dg_nis_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e.selectedRowsData);
            //$scope.entity.Id = e.selectedRowsData[0].id;



            $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
            $scope.entity.approve_pn_title = data.description;
            $scope.entity.approve_priority_title = data.priority;
            $scope.priorityId = data.priorityId;
            $scope.entity.nisId = data.id;
            $scope.entity.remark = data.remark;

            console.log('entity', $scope.entity);

            if (!data) {
                $scope.dg_nis_selected = null;
            }
            else
                $scope.dg_nis_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_nis_ds',
            height: 'dg_nis_height'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_inter_height = $(window).height() - 700;
    $scope.dg_inter_columns = [

        { dataField: '', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
        { dataField: '', caption: 'Part Numebr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
    ];



    $scope.dg_inter_selected = null;
    $scope.dg_inter_instance = null;
    $scope.dg_inter = {



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


        columns: $scope.dg_inter_columns,
        onContentReady: function (e) {
            if (!$scope.dg_inter_instance)
                $scope.dg_inter_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e.selectedRowsData);
            //$scope.entity.Id = e.selectedRowsData[0].id;



            $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
            $scope.entity.approve_pn_title = data.description;
            $scope.entity.approve_priority_title = data.priority;
            $scope.priorityId = data.priorityId;
            $scope.entity.nisId = data.id;
            $scope.entity.remark = data.remark;

            console.log('entity', $scope.entity);

            if (!data) {
                $scope.dg_inter_selected = null;
            }
            else
                $scope.dg_inter_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_inter_ds',
            height: 'dg_inter_height'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_info_height = $(window).height() - 366;
    $scope.dg_info_columns = [
        {
            caption: 'Category',
            alignment: 'center',
            columns: [
                { dataField: '', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },

        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTy', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
            ]
        },

        {
            caption: 'PO/RO Info',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTy', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
            ]
        },

    ];



    $scope.dg_info_selected = null;
    $scope.dg_info_instance = null;
    $scope.dg_info = {



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


        columns: $scope.dg_info_columns,
        onContentReady: function (e) {
            if (!$scope.dg_info_instance)
                $scope.dg_info_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e.selectedRowsData);
            //$scope.entity.Id = e.selectedRowsData[0].id;



            $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
            $scope.entity.approve_pn_title = data.description;
            $scope.entity.approve_priority_title = data.priority;
            $scope.priorityId = data.priorityId;
            $scope.entity.nisId = data.id;
            $scope.entity.remark = data.remark;

            console.log('entity', $scope.entity);

            if (!data) {
                $scope.dg_info_selected = null;
            }
            else
                $scope.dg_info_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_info_ds',
            height: 'dg_info_height'
        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.dg_archive_height = $(window).height() - 250;
    $scope.dg_archive_columns = [
        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'MRF No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
                { dataField: '', caption: 'Creator', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'Request',
            alignment: 'center',
            columns: [
                { dataField: 'Request_FullNo', caption: 'Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Request_Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'NIS Information',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Verified By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            ]
        },
    ];



    $scope.dg_archive_selected = null;
    $scope.dg_archive_instance = null;
    $scope.dg_archive = {



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


        columns: $scope.dg_archive_columns,
        onContentReady: function (e) {
            if (!$scope.dg_archive_instance)
                $scope.dg_archive_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e.selectedRowsData);
            //$scope.entity.Id = e.selectedRowsData[0].id;



            $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
            $scope.entity.approve_pn_title = data.description;
            $scope.entity.approve_priority_title = data.priority;
            $scope.priorityId = data.priorityId;
            $scope.entity.nisId = data.id;
            $scope.entity.remark = data.remark;

            console.log('entity', $scope.entity);

            if (!data) {
                $scope.dg_archive_selected = null;
            }
            else
                $scope.dg_archive_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_archive_ds',
            height: 'dg_archive_height'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_mrf_height = $(window).height() - 250;
    $scope.dg_mrf_columns = [
        {
            caption: 'MRF',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'MRF No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
                { dataField: '', caption: 'Creator', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'Request',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Request No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
                { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: '', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },

        {
            caption: 'NIS Information',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'NIS No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Verified By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: '', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            ]
        },
    ];



    $scope.dg_mrf_selected = null;
    $scope.dg_mrf_instance = null;
    $scope.dg_mrf = {



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


        columns: $scope.dg_mrf_columns,
        onContentReady: function (e) {
            if (!$scope.dg_mrf_instance)
                $scope.dg_mrf_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e.selectedRowsData);
            //$scope.entity.Id = e.selectedRowsData[0].id;



            $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
            $scope.entity.approve_pn_title = data.description;
            $scope.entity.approve_priority_title = data.priority;
            $scope.priorityId = data.priorityId;
            $scope.entity.nisId = data.id;
            $scope.entity.remark = data.remark;

            console.log('entity', $scope.entity);

            if (!data) {
                $scope.dg_mrf_selected = null;
            }
            else
                $scope.dg_mrf_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_mrf_ds',
            height: 'dg_mrf_height'
        },
        columnChooser: {
            enabled: false
        },

    };

    ///////////////////////


    ////////////////
    $scope.$on('InitPNSelected', function (event, prms) {

    });

    $scope.$on('$viewContentLoaded', function () {


    });

}]);