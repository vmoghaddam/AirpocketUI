'use strict';
app.controller('employeeSelectCourseController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', 'trnService', function ($scope, $location, authService, $routeParams, $rootScope,trnService) {



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
        { dataField: 'GTitle', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 0, sortOrder: "asc" },
        {
            dataField: 'JobGroupCode', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 1, sortOrder: "asc", visible:false
        },

        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 2, sortOrder: "asc" },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 3, sortOrder: "asc" },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width:170 },
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        
        
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
    $scope.pop_width = 900;
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
            $scope.dg_ds = null;

            $scope.bind();

        },
        onHiding: function () {



            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onEmployeeSelectCourseHide', $scope.dg_selected);
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

        
        $scope.loadingVisible = true;
        trnService.getAllowedPeopleForCourse($scope.course_id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response.Data;
            console.log(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        //if (!$scope.dg_ds) {
        //    $scope.dg_ds = {
        //        store: {
        //            type: "odata",
        //            //url: $rootScope.serviceUrl + 'odata/employees/' + Config.CustomerId,
        //           // url: serviceBaseTRN+ 'api/employee/groups/query/' +'0', //$scope.groups,
        //            url: serviceBaseTRN + 'api/course/allowed/employees/' + '0',
        //            key: "Id",
                    

        //        },

        //    };
        //}
        //else {
        //    $scope.dg_instance.clearSelection();
        //}



    };
    ////////////////////////////
    $scope.groups = null;
    $scope.$on('InitEmployeeSelectCourse', function (event, prms) {

        if (prms) {
            $scope.groups = prms.groups;
            $scope.course_id = prms.id;
        }
        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  