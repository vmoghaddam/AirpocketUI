'use strict';
app.controller('optionController', ['$scope', '$location', '$routeParams', '$rootScope', 'generalService', 'authService',  '$route', function ($scope, $location, $routeParams, $rootScope, generalService, authService,  $route) {
    $scope.prms = $routeParams.prms;
    $scope._parent = $routeParams.parent;
    //////////////////////////////////////

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
    
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

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
                    generalService.deleteOption(dto).then(function (response) {
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
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null, ParentId: $scope._parent};
            
                $rootScope.$broadcast('InitAddOption', data);


        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddOption', data);
        }

    };
    /////////////////////////////////////////
    $scope.dg_columns = [
        
         
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  sortIndex: 1, sortOrder: "asc" },
       
        { dataField: 'People', caption: 'People', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 200 },



    ];
    $scope.dg_height = 100;
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


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
            else {
                $scope.dg_selected = data;
                 

            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
     
    //////////////////////////////////////////
    var dataUrl = "odata/options/" + $scope._parent;
    $rootScope.page_title = 'Enums';
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        switch ($scope._parent) {
            case '36':
                $rootScope.page_title = '> Posts';
                dataUrl = "odata/base/posts/" + Config.CustomerId;
                break;
            case '59':
                $rootScope.page_title = '> Fileds of Study';
                dataUrl = "odata/base/studyfields/" + Config.CustomerId;
                break;
            
            default:
                break;
        }
        $('.option').fadeIn();
    }
    ///////////////////////////////////////////
    $scope.doRefresh = false;
    $scope.filters = [];
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
    $scope.bind = function () {
        var url = dataUrl;

        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
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
                sort: [{ getter: "Title", desc: false }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    $scope.applicableEmployees = [];
    $scope.bindEmployees = function () {
        $scope.loadingVisible = true;
        libraryService.getBookApplicableEmployees($scope.dg_selected.Id).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.applicableEmployees = (response);
            //$scope.dg_employees_ds = courseEmployee.ApplicablePeople;

            // $scope.dg_employees_instance.refresh();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onOptionSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onOptionHide', function (event, prms) {

        $scope.bind();

    });
    $rootScope.$broadcast('OptionLoaded', null);





}]);