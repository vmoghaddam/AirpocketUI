'use strict';
app.controller('vira_beginningController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService', 'vira_general_service',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService, vira_general_service) {

        $scope.entity =
        {
            stockLocationId: null,
            year: null,
            paperNo: null,
            description: null,
            partNumber: null,
            sN_BN: null,
            dateFrom: null,
            dateTo: null,
            locationId: null
        };

        $scope.item = {};

        $scope.btn_refresh = {
            text: 'Search',
            type: 'default',
            icon: '',
            width: 120,
            onClick: function (e) {
                $scope.loadingVisible = true;
                vira_general_service.get_stock_paper_item($scope.entity).then(function (response) {

                    $scope.dg_inv_ds = response;
                    $scope.loadingVisible = false;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }

        };

        $scope.btn_new = {
            text: 'New',
            type: 'default',
            icon: '',
            width: 120,
            onClick: function (e) {
                $scope.$broadcast('InitBeginningPopup', null);
            }

        };

        $scope.btn_edit = {
            text: 'Edit',
            type: 'default',
            icon: '',
            width: 120,
            onClick: function (e) {

                $scope.$broadcast('InitBeginningPopup', $scope.item);
            }

        };

        $scope.btn_delete = {
            text: 'Delete',
            type: 'danger',
            icon: '',
            width: 120,
            onClick: function (e) {
                $scope.loadingVisible = true;
                vira_general_service.delete_beginning_inventory($scope.item.id).then(function () {
                    $scope.dg_inv_ds = Enumerable.From($scope.dg_inv_ds).Where(function (x) {
                        return x.id != $scope.item.id;
                    }).ToArray();
                    $scope.loadingVisible = false;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }

        };

        //////////////////////////////

        //$scope.bind = function () {
        //    vira_general_service.get_stock_paper($scope.entity).then(function (resposne) {
        //        $scope.dg_inv_ds = response.data;
        //    });
        //};

        /////////////////////////////////////
       
        $scope.dg_inv_height = $(window).height() - 315;
        $scope.dg_inv_columns = [
            { dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
            { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
            { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120 },
            { dataField: 'sN_BN', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            { dataField: 'quantity', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80 },
            { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 50 },
            { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            { dataField: 'condition', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Man. Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Exp. Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Doc Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Document', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 400 },
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
            width: '100%',
            allowColumnReordering: true,
            allowColumnResizing: true,
            scrolling: { mode: 'infinite' },
            paging: { pageSize: 100 },
            showBorders: true,
            selection: { mode: 'single' },

            columnAutoWidth: false,


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

                $scope.item = data;
                if (!data) {
                    $scope.dg_inv_selected = null;
                }
                else
                    $scope.dg_inv_selected = data;


            },

            bindingOptions: {
                dataSource: 'dg_inv_ds',
                height: 'dg_inv_height'
            },
            columnChooser: {
                enabled: false
            },

        };

        $scope.ds_locations = null;
        $scope.sb_stock = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'gI_LocationId',
            bindingOptions: {
                value: 'entity.stockLocationId',
                dataSource: 'ds_locations',
            }
        }


        $scope.txt_parNo = {
            bindingOptions: {
                value: 'entity.partNumber'
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



        /////////////////////////////////////

        $scope.get_filters_style = function () {
            var _height = $(window).height() - 160;
            return {
                height: _height + 'px'
            }
        }
        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Beginning Inventory';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                $scope.ds_locations = response;
                $scope.entity.stockLocationId = response[0].gI_LocationId;
                vira_general_service.get_beginning_inventory(response[0].gI_LocationId).then(function (res) {
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            setTimeout(function () {


            }, 500);
        });


        $scope.loadingVisible = false;
        $scope.loadPanel = {
            message: 'Please wait...',

            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            // position: { of: "body" },
            onShown: function () {

            },
            onHidden: function () {

            },
            bindingOptions: {
                visible: 'loadingVisible'
            }
        };
        ///////////////////////////////////////

    }]);