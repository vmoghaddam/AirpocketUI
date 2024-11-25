'use strict';
app.controller('courseTypeAddController', ['$scope', '$location', 'courseService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, courseService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;


    $scope.entity = {
        Id: null,
        CalenderTypeId: null,
        CourseCategoryId: null,
        LicenseResultBasicId: null,
        Title: null,
        Remark: null,
        Interval: null,
        IsGeneral: null,
        Status: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.CalenderTypeId = null;
        $scope.entity.CourseCategoryId = null;
        $scope.entity.LicenseResultBasicId = null;
        $scope.entity.Title = null;
        $scope.entity.Remark = null;
        $scope.entity.Interval = null;
        $scope.entity.IsGeneral = null;
        $scope.entity.Status = null;
    };

    $scope.bind = function (data) {
        console.log(data);
        $scope.entity.Id = data.Id;
        $scope.entity.CalenderTypeId = data.CalenderTypeId;
        $scope.entity.CourseCategoryId = data.CourseCategoryId;
        $scope.entity.LicenseResultBasicId = data.LicenseResultBasicId;
        $scope.entity.Title = data.Title;
        $scope.entity.Remark = data.Remark;
        $scope.entity.Interval = data.Interval;
        $scope.entity.IsGeneral = data.IsGeneral;
        $scope.entity.Status = data.Status;
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
    
    $scope.txt_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
        }
    };
    $scope.txt_Interval = {
        min: 1,
        bindingOptions: {
            value: 'entity.Interval',
        }
    };
    $scope.sb_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CalenderTypeId',

        }
    };
     
    /////////////////////////////
    $scope.pop_width = 600;
    $scope.pop_height = 380;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'coursetypeadd', bindingOptions: {} }, toolbar: 'bottom' },
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

            if ($scope.isNew) {

            }

            //var dsclient = $rootScope.getClientsDatasource($scope.LocationId);
            //$scope.clientInstance.option('dataSource', dsclient);

            if ($scope.tempData != null)
                $scope.bind($scope.tempData);

        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onCourseTypeHide', null);
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

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }

        if ($scope.isNew)
            $scope.entity.Id = -1;
        
        $scope.loadingVisible = true;
        courseService.saveType($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onCourseTypeSaved', response);



            $scope.loadingVisible = false;
            if (!$scope.isNew)
                $scope.popup_add_visible = false;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
 

    };
    ////////////////////////////
    $scope.tempData = null;
    $scope.$on('InitAddCourseType', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'New';

        }

        else {

            $scope.popup_add_title = 'Edit';
            $scope.tempData = prms;
            $scope.isNew = false;


        }

        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  