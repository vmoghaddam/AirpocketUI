'use strict';
app.controller('qaEmployee', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', 'qaService', function ($scope, $location, authService, $routeParams, $rootScope, qaService) {

    $scope.employeeList = [];


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
        { dataField: 'TypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'ReceiverEmployeeId', caption: 'ReceiverEmployeeId', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 260 },

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
            $scope.selectedEmployees = data;
            
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
   
    $scope.pop_width = 800;
    $scope.pop_height = 500;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'Employees';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Referr', icon: 'check'
                }, toolbar: 'bottom'
            },
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
            $scope.dg_height = $scope.pop_height - 200;
        },
        onShown: function (e) {


            $scope.bind();

        },
        onHiding: function () {


            $scope.selectedEmployees = null;
            $scope.employeeList = [];
            $scope.dg_ds = null;
            $scope.popup_add_visible = false;
            $scope.Comment = null;
            $rootScope.$broadcast('onEmployeeSelectHide', $scope.Category);
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

    //refer button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {
        $scope.loadingVisible = true;

        $.each($scope.selectedEmployees, function (_i, _d) {

            $scope.employeeList.push({
                EntityId: $scope.Id,
                ReferredId: _d.ReceiverEmployeeId,
                ReferrerId: $rootScope.employeeId,
                Type: $scope.Type,
                Comment: $scope.Comment
            });

        });

        $rootScope.employeeCount = $scope.employeeList.length;


        qaService.referre($scope.employeeList).then(function (response) {
            if (response.IsSuccess == true) {


                General.ShowNotify(Config.Text_QARefer, 'success');
                qaService.getReferredList($rootScope.employeeId, $scope.Type, $scope.Id).then(function (response) {
                    $rootScope.referred_list_ds = response.Data;
                });
                if (response.IsSuccess == true && $scope.Category == 'new') {

                    var row = Enumerable.From($rootScope.dg_new_ds).Where("$.Id==" + $scope.Id).FirstOrDefault();
                    row.ReferCount = row.ReferCount + $rootScope.employeeCount;
                    row.EmployeeStatus = "In Progress";
                    $rootScope.dg_open_ds.push(row);
                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds).Where(function (x) {
                        return x.Id != $scope.Id;
                    }).ToArray();
                    $scope.Category = 'open';
                } else {
                    var row = Enumerable.From($rootScope.dg_open_ds).Where("$.Id==" + $scope.Id).FirstOrDefault();
                    row.ReferCount = row.ReferCount + $rootScope.employeeCount;
                    $rootScope.dg_open_ds = Enumerable.From($rootScope.dg_open_ds).Where(function (x) {
                        return x.Id != $scope.Id;
                    }).ToArray();
                    $rootScope.dg_open_ds.push(row);
                    console.log(row);
                }
                

                $scope.popup_add_visible = false;
                $scope.loadingVisible = false;
                
            }
          
        });
    };

    $scope.referComment = {
        bindingOptions: {
            value: 'Comment'
        }
    }

    ////////////////////////////
    $scope.bind = function () {
        qaService.getQAEmployee($scope.Type, $scope.Id, $rootScope.employeeId).then(function (response) {
            $scope.dg_ds = response.Data;
        });
    };
    ////////////////////////////
    $scope.groups = null;
    $scope.$on('InitQAEmployee', function (event, prms) {
        $scope.Type = prms.Type;
        $scope.ReferrerId = $rootScope.employeeId;
        $scope.Id = prms.Id;
        $scope.popup_add_visible = true;
        $scope.Category = prms.Category
    });
    //////////////////////////////

}]);