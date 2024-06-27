'use strict';
app.controller('vira_companyController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService', 'vira_general_service',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService, vira_general_service) {


        $scope.dto_search = {

        }

        $scope.entity = {
            Id: 0
        };
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
        $scope.dg_company_height = $(window).height() - 115;
        $scope.dg_company_columns = [
            { dataField: 'name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250},
            { dataField: 'address', caption: 'Address', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false  },
            { dataField: 'telephone', caption: 'Telephone', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'fax', caption: 'Fax', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,},
            { dataField: 'email', caption: 'Email', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            { dataField: 'contactPerson', caption: 'Contact Person', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'companyType', caption: 'Company Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,  },

        ];



        $scope.dg_company_selected = null;
        $scope.dg_company_instance = null;
        $scope.dg_company = {



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


            columns: $scope.dg_company_columns,
            onContentReady: function (e) {
                if (!$scope.dg_company_instance)
                    $scope.dg_company_instance = e.component;

            },

            onRowClick: function (e) {



            },

            onRowPrepared: function (e) {


            },


            onCellPrepared: function (e) {

            },

            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                //$scope.entity.Id = e.selectedRowsData[0].id;
                $scope.entity = data;

                console.log('entity', $scope.entity);

                if (!data) {
                    $scope.dg_company_selected = null;
                }
                else
                    $scope.dg_company_selected = data;


            },

            bindingOptions: {
                dataSource: 'dg_company_ds',
                height: 'dg_company_height'
            },
            columnChooser: {
                enabled: false
            },

        };

        $scope.txt_part_type = {
            bindingOptions: {
                value: ''
            }
        }
        $scope.txt_code = {
            bindingOptions: {
                value: ''
            }
        }


        $scope.btn_search = {
            text: 'Search',
            type: 'default',
            // icon: 'down',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {
                vira_general_service.get_part_type($scope.dto_search).then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.dg_company_ds = (response);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }

        };

        $scope.btn_new = {
            icon: 'plus',
            text: 'New',
            type: 'default',
            // icon: 'down',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {
                $rootScope.$broadcast('InitNewPartType', null);
            }

        };

        $scope.btn_edit = {
            icon: 'edit',
            text: 'Edit',
            type: 'default',
            // icon: 'down',
            width: '100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {

                $rootScope.$broadcast('InitNewPartType', $scope.entity);
            }

        };

        $scope.btn_delete = {
            icon: 'remove',
            text: 'Delete',
            type: 'danger',
            width: '100%',
            bindingOptions: {},
            onClick: function (e) {
                $scope.loadingVisible = true;
                $scope.delete(function (res) {
                    if (res.errorCode) {
                        if (res.errorCode == 10029) {
                            mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                $scope.delete();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else
                            General.ShowNotify(res.errorMessage, 'error');
                    }
                    else {
                        General.ShowNotify('Deleting Was Done Successfully', 'success');
                        $scope.loadingVisible = false;
                    }
                });

            }
        };

        $scope.delete = function (callback) {
            $scope.loadingVisible = true;
            vira_general_service.delete_company($scope.entity.id).then(function (res) {
                $scope.loadingVisible = false;
                if (callback)
                    callback(res);
                else {
                    if (res.errorCode) {
                        General.ShowNotify(res.errorMessage, 'error');
                    }
                    else {
                        $scope.loadingVisible = false;
                        General.ShowNotify('Deleting Was Done Successfully', 'success');

                    }
                }
            });
        };

        $scope.bind = function () {
            $scope.dg_company_ds = null;
            $scope.loadingVisible = true;
            vira_general_service.get_company().then(function (response) {

                $scope.loadingVisible = false;
                $scope.dg_company_ds = (response.data);

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
            $rootScope.page_title = '> Company';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            $scope.bind();
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                //$scope.ds_locations = response;
                //$scope.dto_search.locationId = response[0].gI_LocationId;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            setTimeout(function () {

                //$scope.$broadcast('getFilterQuery', null);
            }, 500);
        });

        ///////////////////////////////////////

        $scope.loadingVisible = false;
        $scope.loadPanel = {
            message: 'Please wait...',

            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            onShown: function () {

            },
            onHidden: function () {

            },
            bindingOptions: {
                visible: 'loadingVisible'
            }
        };

        //////////////////////////////

    }]);