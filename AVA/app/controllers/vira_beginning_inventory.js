'use strict';
app.controller('vira_beginningController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService) {

        $scope.prms = $routeParams.prms;
        // mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {


        $scope.btn_refresh = {
            text: 'Refresh',
            type: 'Default',
            icon: '',
            width: 120,
            onClick: function (e) {
              
            }

        };



        // }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        /////////////////////////////////////
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
        $scope.dg_inv_height = $(window).height() - 305;
        $scope.dg_inv_columns = [
            { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70},
            { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300},

            //{ dataField: 'acfT_Type', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },

            { dataField: '', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

            { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80 },
            { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 50 },
            { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Man. Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Exp. Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Doc Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Document', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 400 },



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
            width:'100%',
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

                $scope.dg_inv_id.Id = e.selectedRowsData[0].Id;

                console.log($scope.dg_inv_id.id);
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

        $scope.dto_search = {};
        $scope.ds_locations = null;
        $scope.sb_location = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'gI_LocationId',

            bindingOptions: {
                dataSource: 'ds_locations',
                value: 'dto_search.locationId',
            }
        }
        $scope.sb_actype = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.type,
            bindingOptions: {
                value: '',
            }
        }
        $scope.sb_assettype = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.type,
            bindingOptions: {
                value: '',
            }
        }

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
        $scope.txt_shelf = {
            bindingOptions: {
                value: ''
            }
        }


        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {

                $scope.bind();


            }

        };
        $scope.btn_receipt = {
            text: 'Receipt',
            type: 'default',
            // icon: 'down',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {
                $rootScope.$broadcast('InitReceipt', null);



            }

        };
        $scope.btn_do = {
            text: 'D/O',
            type: 'default',
            // icon: 'up',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {

                $rootScope.$broadcast('InitDirectDelivery', null);


            }

        };

        $scope.bind = function () {
            $scope.dg_inv_ds = null;
            // $scope.dto_search.locationId = 6;
            $scope.loadingVisible = true;
            mntService.get_inventory($scope.dto_search).then(function (response) {

                $scope.loadingVisible = false;
                $scope.dg_inv_ds = (response);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };
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
            $rootScope.page_title = '> Inventory';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                $scope.ds_locations = response;
                $scope.dto_search.locationId = response[0].gI_LocationId;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            setTimeout(function () {

                //$scope.$broadcast('getFilterQuery', null);
            }, 500);
        });

        ///////////////////////////////////////

    }]);