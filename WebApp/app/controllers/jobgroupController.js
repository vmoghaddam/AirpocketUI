'use strict';
app.controller('jobgroupController', ['$scope', '$location', '$routeParams', '$rootScope', 'jobgroupService', 'personService', 'authService','$http', function ($scope, $location, $routeParams, $rootScope, jobgroupService, personService, authService,$http) {
    $scope.prms = $routeParams.prms;
    $scope.height_tree = $(window).height() - 177;
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            return;
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    jobgroupService.delete(dto).then(function (response) {
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
            return;
            //$scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            //if (!$scope.dg_selected) {
            //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //    return;
            //}
            var data = { parent: $scope.dg_selected ? $scope.dg_selected : null, Id: null, groups: $scope.dg_ds};

            $rootScope.$broadcast('InitAddJobGroup', data);
        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            return;
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;

            $rootScope.$broadcast('InitAddJobGroup', { Id: $scope.dg_selected.Id, data:data, groups: $scope.dg_ds});
        }

    };

    $scope._selected = null;
    $scope.btn_man = {
        text: 'Manager',
        type: 'default',
        icon: 'edit',
        width: 150,

        onClick: function (e) {
             
            $scope._selected = $rootScope.getSelectedRows($scope.dg_instance);
            if (!$scope._selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.popup_password_visible = true;
            
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            return;
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
    $scope.dg_employees_ds = [];
    $scope.dg_employees_columns = [
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
        { dataField: 'JobGroupCode', caption: 'Group Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: "asc"  },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left', sortIndex: 3, sortOrder: "asc" },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },


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

                $scope.dg_employees_selected = null;
               
            }
            else {
                $scope.dg_employees_selected = data;
                
            }


        },
        height: $(window).height() - 180,
       // height: '100%',
        bindingOptions: {
            dataSource: 'dg_employees_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [

        { dataField: 'TitleFormated', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false },
        { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'Employees', caption: 'Employees', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
        { dataField: 'ManagerTitle', caption: 'Manager', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200  },
    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null; //[{ "Parent": null, "ParentCode": null, "Root": "ATA Airline", "RootCode": "100", "Id": 3, "Title": "ATA Airline", "Code": "100", "FullCode": "100", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": null, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "ATA Airline", "ParentCode": "100", "Root": "ATA Airline", "RootCode": "100", "Id": 4, "Title": "Flight Line", "Code": "10", "FullCode": "10010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 3, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "Flight Line", "ParentCode": "10010", "Root": "ATA Airline", "RootCode": "100", "Id": 5, "Title": "Tabriz Station", "Code": "10", "FullCode": "1001010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 4, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 2, "HasItems": 1 }, { "Parent": "Tabriz Station", "ParentCode": "1001010", "Root": "ATA Airline", "RootCode": "100", "Id": 6, "Title": "Avionic", "Code": "10", "FullCode": "100101010", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 5, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "Tabriz Station", "ParentCode": "1001010", "Root": "ATA Airline", "RootCode": "100", "Id": 7, "Title": "Mechanic", "Code": "20", "FullCode": "100101020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 5, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "Flight Line", "ParentCode": "10010", "Root": "ATA Airline", "RootCode": "100", "Id": 8, "Title": "Tehran Station", "Code": "20", "FullCode": "1001020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 4, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }, { "Parent": "ATA Airline", "ParentCode": "100", "Root": "ATA Airline", "RootCode": "100", "Id": 9, "Title": "Shops", "Code": "20", "FullCode": "10020", "CustomerId": 1, "TypeId": 10, "Remark": null, "IsVirtual": false, "IsDeleted": false, "IsActive": true, "ParentId": 3, "CityId": null, "Address": null, "PostalCode": null, "Website": null, "RootLocation": 3, "City": null, "State": null, "Country": null, "CountryId": null, "StateId": null, "SortName": null, "Type": "General", "Items": 0, "HasItems": 0 }];
    $scope.expandedRow = null;
    
    $scope.tree = {
        selection: { mode: 'multiple' },
        
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
       
        dataSource: $scope.dg_ds,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[e.selectedRowsData.length-1];

            if (!data) {
                $scope.dg_selected = null;
                $scope.dg_employees_ds = [];
            }
            else {
                $scope.dg_selected = data;
                personService.getEmployeesByGroupCode(data.FullCode).then(function (response) {
                    $scope.dg_employees_ds = response;


                }, function (err) { General.ShowNotify(err.message, 'error'); });
            }


        },
       
        keyExpr: "Id",
        parentIdExpr: "ParentId",
         
        showBorders: true,
        columns: $scope.dg_columns,
        headerFilter: {
            visible: true
        },
        height: $(window).height() - 180,
        // dataStructure:'tree',
        bindingOptions: {
            dataSource: 'dg_ds',
            expandedRowKeys: 'expandedRow',
            //height:'height_tree',
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
        
        $http.get('http://localhost:4000/' + 'api/jobgroup/' ).then(function (results) {
 

            $scope.dg_ds = results.data;
            if (!temp && results.data && results.data.length > 0) {
                $scope.expandedRow = [];
                $scope.expandedRow.push(results.data[0].Id);
            }
            else
                $scope.expandedRow = temp;
            $scope.loadingVisible = false;
            $('#treecontainer').fadeIn();
           }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
        //jobgroupService.getGroups(Config.CustomerId).then(function (results) {

        //    //$scope.orders = results.data;
        //    $scope.dg_ds = results.data;
        //    if (!temp && results.data && results.data.length > 0) {
        //        $scope.expandedRow = [];
        //        $scope.expandedRow.push(results.data[0].Id);
        //    }
        //    else
        //        $scope.expandedRow = temp;
        //    $scope.loadingVisible = false;
        //    $('#treecontainer').fadeIn();

        //}, function (error) {
        //    $scope.loadingVisible = false;
        //    //alert(error.data.message);
        //});
       

    };


    $scope.manager = null;
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'manager',
            
        }
    };

    $scope.popup_password_visible = false;
    $scope.popup_password_title = '';

    $scope.popup_password = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 200,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();

            $scope.popup_password_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_password_visible',

        }
    };
    $scope.popup_password.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_password_visible = false;
    };

    //save button
    $scope.popup_password.toolbarItems[0].options.onClick = function (e) {
         

        if (!$scope.manager) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto = { managerId: $scope.manager, ids: Enumerable.From($scope._selected).Select('$.Id').ToArray().join('_') }

        $scope.loadingVisible = true;
        $http.post('http://localhost:4000/' + 'api/groups/manager/save', dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.bind();
            $scope.popup_password_visible = false;
        }, function (err, status) {

                $scope.loadingVisible = false;
        });
        //authService.setPassword(dto).then(function (response) {
        //    $scope.loadingVisible = false;
        //    $scope.newPassword = '';
        //    $scope.popup_password_visible = false;


        //},
        //    function (err) {
        //        $scope.loadingVisible = false;
        //        $scope.message = err.message;
        //        General.ShowNotify(err.message, 'error');

        //    });

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Groups';
        $('.jobgroup').fadeIn();
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
    $scope.$on('onJobGroupSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onJobGroupHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
   
    $scope.bind();
    $rootScope.$broadcast('JobGroupLoaded', null);
    ///end
}]);