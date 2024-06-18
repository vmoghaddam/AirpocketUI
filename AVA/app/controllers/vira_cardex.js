'use strict';
app.controller('vira_cardexController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.reciver_location = 0;

    $scope.entity =
    {
        cmP_PartNumberId: 0,
        locationId: 0,
        sN_BN: null,
        paperYear: 0
    }


    $scope.btn_search = {
        text: 'Search',
        type: 'default',
        icon: 'search',
        width: 120,
        onClick: function (e) {
            $scope.entity.locationId = $scope.reciver_location
            vira_general_service.get_cardex($scope.entity).then(function (res) {
                $scope.dg_cardex_ds = res;
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



    /////////////////////////




    $scope.bind = function () {

        vira_general_service.get_year($scope.reciver_location).then(function (res) {
            $scope.entity.paperYear = res.id;
        });


    }


    //////////////////////////


    $scope.txt_pn = {
        bindingOptions: {
            value: 'entity.pnTitle'
        }
    }


    $scope.txt_desc = {
        bindingOptions: {
            value: 'entity.description'
        }
    }

    $scope.txt_snbn = {
        bindingOptions: {
            value: 'entity.sN_BN'
        }
    }


    $scope.dt_date_from = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity_info.date'
        }
    }

    $scope.dt_date_to = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity_info.date'
        }
    }



    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',
        placeholder: 'Stock',
        onSelectionChanged: function (e) {
        },
        dataSource: $scope.priority,
        bindingOptions: {
            value: 'reciver_location',
            dataSource: 'ds_locations'
        }
    }

    $scope.txt_year = {
        bindingOptions: {
            value: 'entity.paperYear',

        }
    }

    ////////////////////////


    $scope.dg_cardex_columns = [

        { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120 },
        { dataField: 'fullNo', caption: 'Paper No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'paperTypeDescription', caption: 'Paper Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'createDate', caption: 'Create Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 110 },
        { dataField: 'financialAccount', caption: 'Account', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'location_Title', caption: 'Receiver Dep.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'condition', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'sN_BN', caption: 'SN / BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'quantity', caption: 'Qty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'balance', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
    ];


    $scope.dg_cardex_selected = null;
    $scope.dg_cardex_instance = null;
    $scope.dg_cardex = {



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
        height: $(window).height() - 220,
        width: '100%',
        columns: $scope.dg_cardex_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cardex_instance)
                $scope.dg_cardex_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            $scope.dg_cardex_id.Id = e.selectedRowsData[0].Id;

            if (!data) {
                $scope.dg_cardex_selected = null;
            }
            else
                $scope.dg_cardex_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_cardex_ds'
        },
        columnChooser: {
            enabled: false
        },

    };





    $scope.$on('$viewContentLoaded', function () {
        mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
            $scope.ds_locations = response;
            $scope.reciver_location = response[0].gI_LocationId;
            console.log($scolpe.reciver_location);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        $scope.bind();
        setTimeout(function () {

            //$scope.$broadcast('getFilterQuery', null);

        }, 500);
    });



    $scope.$on('InitPNSelected', function (event, prms) {

        $scope.entity.cmP_PartNumberId = prms.id;
        $scope.entity.pnTitle = prms.partNumber;
    });




}]);


