'use strict';
app.controller('courseTypeAddController', ['$scope', '$location', 'courseService', 'authService', '$routeParams', '$rootScope', 'trnService', function ($scope, $location, courseService, authService, $routeParams, $rootScope, trnService) {
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
        CertificateTypeId: null,
        Duration: null,
        Mandatory: null,

        JobGroups: [],
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
        $scope.entity.CertificateTypeId = null;
        $scope.entity.Duration = null;
        $scope.entity.Mandatory = null;
        $scope.entity.JobGroups = [];
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
        $scope.entity.Mandatory = data.Mandatory;
        $scope.entity.CertificateTypeId = data.CertificateTypeId;
        $scope.entity.Duration = data.Duration;
        $scope.entity.JobGroups = data.JobGroups;
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
    $scope.txt_duration = {
        min: 1,
        bindingOptions: {
            value: 'entity.Duration',
        }
    };
    //$scope.sb_CalanderTypeId = {
    //    showClearButton: true,
    //    searchEnabled: true,
    //    dataSource: $rootScope.getDatasourceOption(11),
    //    displayExpr: "Title",
    //    valueExpr: 'Id',
    //    readOnly:true,
    //    bindingOptions: {
    //        value:'13', //'entity.CalenderTypeId',

    //    }
    //};

    $scope.sb_CerTypes = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCertificateTypes(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["Title"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CertificateTypeId',


        }
    };
    $scope.chb_mandatory = {

        text: 'Is Mandatory',
        bindingOptions: {
            value: 'entity.Mandatory',

        }
    };
    $scope.chb_continual = {

        text: 'Is Continual',
        bindingOptions: {
            value: 'entity.Status',

        }
    };
    $scope.dg_group_columns = [

        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_group_selected = null;
    $scope.dg_group_instance = null;
    $scope.dg_group = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        noDataText: '',
        showColumnHeaders: false,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },


        columnAutoWidth: false,
        columns: $scope.dg_group_columns,
        onContentReady: function (e) {
            if (!$scope.dg_group_instance)
                $scope.dg_group_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_group_selected = null;
            }
            else
                $scope.dg_group_selected = data;


        },
        height: 370,
        bindingOptions: {

            dataSource: 'entity.JobGroups',
            // height: 'dg_height',
        },
        // dataSource:ds

    };
    /////////////////////////////
    $scope.pop_width = 850;
    $scope.pop_height = 550;
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

            if ($scope.tempData != null) {
                var _dt = {};
                JSON.copy($scope.tempData, _dt);
                $scope.loadingVisible = true;
                trnService.getCourseTypeGroups($scope.tempData.Id).then(function (response) {
                    $scope.loadingVisible = false;
                    _dt.JobGroups = response.Data;
                    $scope.bind(_dt);
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }


            if ($scope.dg_group_instance)
                $scope.dg_group_instance.refresh();

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
    //2022-03-07
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }

        //if (!$scope.entity.Status && (!$scope.entity.Interval || !$scope.entity.CalenderTypeId)){
        //    General.ShowNotify('Wrong Interval', 'error');
        //    return;
        //}


        if ($scope.isNew)
            $scope.entity.Id = -1;
        $scope.entity.Mandatory = $scope.entity.Mandatory ? 1 : 0;
        $scope.entity.CalenderTypeId = 13;
        $scope.loadingVisible = true;
        trnService.saveCourseType($scope.entity).then(function (response) {
            $scope.loadingVisible = false;
            if (response.IsSuccess) {
                General.ShowNotify(Config.Text_SavedOk, 'success');

                $rootScope.$broadcast('onCourseTypeSaved', response.Data);

                $scope.clearEntity();


                if (!$scope.isNew)
                    $scope.popup_add_visible = false;
            }
            else { General.ShowNotify(response.Errors[0], 'error'); }







        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    ////////////////////////////
    $scope.removeGroup = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.JobGroups = Enumerable.From($scope.entity.JobGroups).Where('$.Id!=' + dg_selected.Id).ToArray();


    };
    $scope.addGroup = function () {
        $rootScope.$broadcast('InitJobGroupSelectSimple', null);
    };
    $scope.$on('onJobGroupSelectSimpleHide', function (event, prms) {


        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.JobGroups).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                var jg = { Id: _d.Id, Title: _d.Title, FullCode: _d.FullCode };
                console.log($scope.entity.JobGroups);
                $scope.entity.JobGroups.push(jg);
            }
        });
        $scope.dg_group_instance.refresh();
    });

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