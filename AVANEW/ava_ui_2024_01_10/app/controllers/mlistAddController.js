'use strict';
app.controller('mlistAddController', ['$scope', '$location', 'personService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, $routeParams, $rootScope) {
    /////////////////////////////
    $scope.dg_first_columns = [
        {
            caption: 'First Crew',
            columns: [
                 { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                 { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                   { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false },
            ]
        } 

    ];



    $scope.dg_first_selected = null;
    $scope.dg_first_instance = null;
    $scope.dg_first_ds = null;
    $scope.dg_first = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_first_columns,
        onContentReady: function (e) {
            if (!$scope.dg_first_instance)
                $scope.dg_first_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_first_selected = null;
            }
            else
                $scope.dg_first_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_first_ds'
        }
    };
    /////////////////////////////
    $scope.dg_second_columns = [
        {
            caption: 'Second Crew',
            columns: [
                 { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                 { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                   { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false },
            ]
        }

    ];



    $scope.dg_second_selected = null;
    $scope.dg_second_instance = null;
    $scope.dg_second_ds = null;
    $scope.dg_second = {
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
        height: $(window).height() - 180,

        columns: $scope.dg_second_columns,
        onContentReady: function (e) {
            if (!$scope.dg_second_instance)
                $scope.dg_second_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_second_selected = null;
            }
            else
                $scope.dg_second_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_second_ds'
        }
    };
    //////////////////////////
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

   
    /////////////////////////////
    $scope.pop_width = 900;
    $scope.pop_height = 650;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'personmiscadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            if (size.width <= 600) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }
            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {
            $scope.bind_first();
            $scope.bind_second();

        },
        onHiding: function () {

            

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onMlistAddHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title'
        }
    };

    //close button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {

       

        if (!$scope.dg_first_selected) {
            General.ShowNotify('Please select First Crew', 'error');
            return;
        }

        if (!$scope.dg_second_selected) {
            General.ShowNotify('Please select Second Crew', 'error');
            return;
        }
        if ($scope.dg_second_selected.Id == $scope.dg_first_selected.Id) {
            General.ShowNotify('First Crew and Second Crew are equal.', 'error');
            return;
        }

        var dto = {
            First: $scope.dg_first_selected.Id,
            Second: $scope.dg_second_selected.Id,
        }
        $scope.loadingVisible = true;
        personService.saveMatchingList(dto).then(function (response) {

           


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onMlistSaved', response);



            $scope.loadingVisible = false;
            
                $scope.popup_add_visible = false;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        

    };
    ////////////////////////////
    $scope.tempData = null;
    $scope.$on('InitAddMlist', function (event, prms) {


       

            
            $scope.popup_add_title = 'New';
 

        $scope.popup_add_visible = true;

    });
    //////////////////////////////
    $scope.bind_first = function () {
      
        var url = 'odata/crew/ordered/group/' + Config.CustomerId;

        if (!$scope.dg_first_ds)
            $scope.dg_first_ds = {
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
 
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "GroupOrder", desc: false }, { getter: "JobGroup", desc: false }, { getter: "Name", desc: false }],

            };


    };
    $scope.bind_second = function () {

        var url = 'odata/crew/ordered/group/' + Config.CustomerId;

        if (!$scope.dg_second_ds)
            $scope.dg_second_ds = {
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

                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "GroupOrder", desc: false }, { getter: "JobGroup", desc: false }, { getter: "Name", desc: false }],

            };


    };
    //////////////////////////////
}]);