﻿'use strict';
app.controller('journalAddController', ['$scope', '$location', 'generalService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, generalService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;
    $scope.TypeId = null;

    $scope.entity = {
        Id: null,
        TypeId: null,
        Title: null,
        Remark: null,
        Website: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.TypeId = null;
        $scope.entity.Title = null;
        $scope.entity.Remark = null;
        $scope.entity.Website = null;
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.TypeId = data.TypeId;
        $scope.entity.Title = data.Title;
        $scope.entity.Remark = data.Remark;
        $scope.entity.Website = data.Website;
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


     
    $scope.websiteValidationRules = {
        validationRules: [
            //    {
            //    type: "required",
            //    message: "Email is required"
            //},
            {
                type: "pattern",
                pattern: /^(http:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                message: "Url is invalid"
            }]
    };
    $scope.txt_Website = {
        mode: 'url',
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Website',

        }
    };
    /////////////////////////////
    $scope.pop_width = 700;
    $scope.pop_height = 370;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'journaladd', bindingOptions: {} }, toolbar: 'bottom' },
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

             

            if ($scope.tempData != null)
                $scope.bind($scope.tempData);

        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onJournalHide', null);
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

        if ($scope.isNew) {
            $scope.entity.Id = -1;
            $scope.entity.TypeId = $scope.TypeId;
        }

        $scope.loadingVisible = true;
        generalService.saveJournal($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onJournalSaved', response);



            $scope.loadingVisible = false;
            if (!$scope.isNew)
                $scope.popup_add_visible = false;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //Transaction.Aid.save($scope.entity, function (data) {

        //    $scope.clearEntity();


        //    General.ShowNotify('تغییرات با موفقیت ذخیره شد', 'success');

        //    $rootScope.$broadcast('onAidSaved', data);

        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //        if (!$scope.isNew)
        //            $scope.popup_add_visible = false;
        //    });

        //}, function (ex) {
        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //    });
        //    General.ShowNotify(ex.message, 'error');
        //});

    };
    ////////////////////////////
    $scope.tempData = null;
    $scope.$on('InitAddJournal', function (event, prms) {


        $scope.tempData = null;
        $scope.TypeId = prms._tid;
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