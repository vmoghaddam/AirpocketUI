'use strict';
app.controller('locationController', ['$scope', '$location', '$routeParams', '$rootScope', 'locationService', 'authService', function ($scope, $location, $routeParams, $rootScope, locationService, authService) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
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
                    locationService.delete(dto).then(function (response) {
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

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { parent: $scope.dg_selected, Id: null };

            $rootScope.$broadcast('InitAddLocation', data);
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
            
            $rootScope.$broadcast('InitAddLocation', data);
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
         
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'FullCode', caption: 'Full Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'Root', caption: 'Root', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        
    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null; //[{ "Parent": null, "ParentCode": null, "Root": "ATA Airline", "RootCode": "100", "Id": 3, "Title": "ATA Airline", "Code": "100", "FullCode": "100", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": null, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "ATA Airline", "ParentCode": "100", "Root": "ATA Airline", "RootCode": "100", "Id": 4, "Title": "Flight Line", "Code": "10", "FullCode": "10010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 3, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "Flight Line", "ParentCode": "10010", "Root": "ATA Airline", "RootCode": "100", "Id": 5, "Title": "Tabriz Station", "Code": "10", "FullCode": "1001010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 4, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "Tabriz Station", "ParentCode": "1001010", "Root": "ATA Airline", "RootCode": "100", "Id": 6, "Title": "Avionic", "Code": "10", "FullCode": "100101010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 5, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "Tabriz Station", "ParentCode": "1001010", "Root": "ATA Airline", "RootCode": "100", "Id": 7, "Title": "Mechanic", "Code": "20", "FullCode": "100101020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 5, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "Flight Line", "ParentCode": "10010", "Root": "ATA Airline", "RootCode": "100", "Id": 8, "Title": "Tehran Station", "Code": "20", "FullCode": "1001020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 4, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "ATA Airline", "ParentCode": "100", "Root": "ATA Airline", "RootCode": "100", "Id": 9, "Title": "Shops", "Code": "20", "FullCode": "10020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 3, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }];
    $scope.expandedRow = null;
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
        height: '100%',

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
    $scope.tree = {
        selection: { mode: 'single' },
        //dataSource: {
        //    load: function (options) {
        //        return $.ajax({
        //            url: "https://js.devexpress.com/Demos/Mvc/api/treeListData",
        //            dataType: "json",
        //            data: { parentIds: options.parentIds.join(",") }
        //        });
        //    }
        //},
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
        height: '100%',
        dataSource: $scope.dg_ds,
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
        //dataSource: {
        //    load: function (options) {
        //        return $.ajax({
        //            url: $rootScope.serviceUrl + 'odata/locations/customer/' + Config.CustomerId,
        //            dataType: "json",
        //            data: { parentIds: options.parentIds? options.parentIds.join(","):null }
        //        });
        //    }
        //},
        //dataSource: new DevExpress.data.DataSource({
        //    store:
            
        //    new DevExpress.data.ODataStore({
        //        url: $rootScope.serviceUrl + 'odata/locations/customer/' + Config.CustomerId,
        //        key: "Id",
        //        keyType: "Int32",
        //        version: 4
        //    }),
            
        //}),
        //remoteOperations: {
        //    filtering: true
        //},
        keyExpr: "Id",
        parentIdExpr: "ParentId",
       // hasItemsExpr: "HasItems",
       // rootValue: "",
        showBorders: true,
        columns: $scope.dg_columns,
        headerFilter: {
            visible: true
        },
       // dataStructure:'tree',
        bindingOptions: {
            dataSource: 'dg_ds',
            expandedRowKeys: 'expandedRow',
        }
    }; 


    $scope.doRefresh = true;

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
      //  if (!$scope.doRefresh)
       //     return;
        var temp = $scope.expandedRow;
        $scope.doRefresh = false;
        $scope.loadingVisible = true;
        locationService.getLocations(Config.CustomerId).then(function (results) {
           
            //$scope.orders = results.data;
            $scope.dg_ds = results.data;
            if (!temp && results.data && results.data.length > 0) {
                $scope.expandedRow = [];
                $scope.expandedRow.push(results.data[0].Id);
            }
            else
                $scope.expandedRow = temp;
            $scope.loadingVisible = false;
            $('#treecontainer').fadeIn();

        }, function (error) {
            $scope.loadingVisible = false; 
            //alert(error.data.message);
        });
        //if (!$scope.dg_ds) {
        //    $scope.dg_ds = {
        //        store: {
        //            type: "odata",
        //            url: $rootScope.serviceUrl + 'odata/airports/all',
        //            key: "Id",
        //            version: 4,
        //            onLoaded: function (e) {
        //                // $scope.loadingVisible = false;
        //                //filter
        //                $rootScope.$broadcast('OnDataLoaded', null);
        //            },
        //            beforeSend: function (e) {

        //                $scope.dsUrl = General.getDsUrl(e);

        //                // $scope.$apply(function () {
        //                //    $scope.loadingVisible = true;
        //                // });
        //                $rootScope.$broadcast('OnDataLoading', null);
        //            },
        //        },
        //        // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
        //        // sort: ['DatePay', 'Amount'],

        //    };
        //}

        //if ($scope.doRefresh) {
        //    $scope.filters = $scope.getFilters();
        //    $scope.dg_ds.filter = $scope.filters;
        //    $scope.dg_instance.refresh();
        //    $scope.doRefresh = false;
        //}

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Locations';
        $('.location').fadeIn();
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
    $scope.$on('onLocationSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onLocationHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $scope.bind();
    $rootScope.$broadcast('LocationLoaded', null);
    ///end
}]);