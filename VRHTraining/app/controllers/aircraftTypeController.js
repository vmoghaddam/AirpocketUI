'use strict';
app.controller('aircraftTypeController', ['$scope', '$location', '$routeParams', '$rootScope', 'airportService', 'authService', function ($scope, $location, $routeParams, $rootScope, airportService, authService) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.btn_delete = {
        text: '',
        type: 'danger',
        icon: 'clear',
        width: 40,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    airportService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 40,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddAircraftType', data);
        }

    };
    $scope.btn_edit = {
        text: '',
        type: 'default',
        icon: 'edit',
        width: 40,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddAircraftType', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $scope.InitAddAirport(data);
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);
        }

    };


    $scope.btn_delete_man = {
        text: '',
        type: 'danger',
        icon: 'clear',
        width: 40,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    airportService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new_man = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 40,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddAircraftType', data);
        }

    };
    $scope.btn_edit_man = {
        text: '',
        type: 'default',
        icon: 'edit',
        width: 40,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddAircraftType', data);
        }

    };


    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

    };
    //////////////////////////////////
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
    ///////////////////////////////////

    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [
        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        { dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:200 },
        //{ dataField: 'Manufacturer', caption: 'Manufacturer', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false  },
    
    ];
    $scope.dg_columns_man = [
        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  },
        { dataField: 'Country', caption: 'Country', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    { dataField: 'Website', caption: 'Website', allowResizing: true, alignment: 'left', dataType:'string', allowEditing: false, width: 150 },
    { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
    //{ dataField: 'Tel', caption: 'Tel', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    //{ dataField: 'Fax', caption: 'Fax', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    //{ dataField: 'ContactPerson', caption: 'ContactPerson', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    //{ dataField: 'Address', caption: 'Address', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    //{ dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    //{ dataField: 'LogoUrl', caption: 'LogoUrl', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
    
   ];
 

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        height: $(window).height() - 175,

        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    //***** dg_man
    $scope.dg_selected_man = null;
    $scope.dg_instance_man = null;
    $scope.dg_ds_man = null;
    $scope.dg_man = {
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
        height: $(window).height() - 175,

        columns: $scope.dg_columns_man,
        onContentReady: function (e) {
            if (!$scope.dg_instance_man)
                $scope.dg_instance_man = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected_man = null;
            }
            else {

                $scope.dg_selected_man = data;
                $scope.dg_ds = null;
                $scope.typeFilters = [];
                $scope.typeFilters.push('ManufacturerId');
                $scope.typeFilters.push('=');
                $scope.typeFilters.push(Number(data.Id));
                $scope.bind();

            }


        },
        bindingOptions: {
            dataSource: 'dg_ds_man'
        }
    };

    //*********************

    $scope.doRefresh = false;
    $scope.doRefresh_man = false;

    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };

    $scope.typeFilters = [];
    $scope.bind = function () {
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/aircrafttypes/all',
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                filter: $scope.typeFilters,
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {

            $scope.dg_ds.filter = $scope.typeFilters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };


    $scope.bind_man = function () {
        if (!$scope.dg_ds_man) {
            $scope.dg_ds_man = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/manufactureres/all',
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh_man) {
            
            $scope.dg_instance_man.refresh();
            $scope.doRefresh_man = false;
        }

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Aircraft Types';
        $('.aircraftType').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onAircraftTypeSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onAircraftTypeHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $scope.bind_man();
    $rootScope.$broadcast('AircraftTypeLoaded', null);
    ///end
}]);