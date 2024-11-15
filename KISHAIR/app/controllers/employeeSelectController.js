'use strict';
app.controller('employeeSelectController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', function ($scope, $location, authService, $routeParams, $rootScope) {



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
    $scope.dg_columns = [
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
      //  { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
     //   { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
       // { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

    ];
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData;

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        bindingOptions: {

            dataSource: 'dg_ds',
            height: 'dg_height',
        },
        // dataSource:ds

    };

    /////////////////////////////
    $scope.dg_height = 100;
    $scope.pop_width = 800;
    $scope.pop_height = 500;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'Employees';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Ok', icon: 'check', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            if (size.width <= 800) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }
            $scope.dg_height = $scope.pop_height - 100;
            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {


            $scope.bind();

        },
        onHiding: function () {



            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onEmployeeSelectHide', $scope.dg_selected);
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
        //console.log($scope.dg_selected);
        if (!$scope.dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.popup_add_visible = false;
    };
    ////////////////////////////
    $scope.bind = function () {
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/employees/' + Config.CustomerId,
                    key: "Id",
                    version: 4,

                },

            };
        }
        else {
            $scope.dg_instance.clearSelection();
        }



    };
    ////////////////////////////
    $scope.groups = null;
    $scope.$on('InitEmployeeSelect', function (event, prms) {
        
        if (prms) {
            $scope.groups = prms.groups;
        }
        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  