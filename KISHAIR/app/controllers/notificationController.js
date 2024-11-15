'use strict';
app.controller('notificationController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'notificationService', 'authService', function ($scope, $location, $routeParams, $rootScope, libraryService, notificationService, authService) {
    $scope.prms = $routeParams.prms;
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
   
    
    ////////////////////////////////
    
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
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
            }
        }

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
    $scope.Message = '';

    ////////////////////////////////
    $scope.courseCaption = 'Library Items';
    $scope.dg_employees_columns = [
        { dataField: 'DateSent', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 200 },
        { dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, },
        {
            caption: 'Receiver',
            columns: [
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, },
                { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        { dataField: 'SMS', caption: 'SMS', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'App', caption: 'App', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },



        

    ];
    $scope.dg_employees_height = 100;
    $scope.dg_employees_selected = null;
    $scope.dg_employees_instance = null;
    $scope.dg_employees_ds = null;
    $scope.dg_employees = {
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


        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.Message = null;
            }
            else {

                notificationService.getNotification(data.Id).then(function (response) {
                    $scope.Message = response.Message;
                   

                }, function (err) { General.ShowNotify(err.message, 'error'); });
            }


        },
        height: $(window).height() - 135,
        bindingOptions: {
            dataSource: 'dg_employees_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    
    

    ////////////////////////////
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
        if (!$scope.dg_employees_ds && $scope.doRefresh) {

            $scope.dg_employees_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/notifications/module/' + Config.CustomerId + '/' + $rootScope.moduleId,
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
                sort: [{ getter: "DateSent", desc: true }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_employees_ds.filter = $scope.filters;
            $scope.dg_employees_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Notifications';
        $('.notification').fadeIn();
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
    //////////////////////////////////////////
    $rootScope.$broadcast('NotificationLoaded', null);





}]);