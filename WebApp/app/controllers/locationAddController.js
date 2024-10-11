'use strict';
app.controller('locationAddController', ['$scope', '$location', 'locationService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, locationService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;


    $scope.entity = {
        Id: null,
        Title: null,
        Code: null,
        FullCode: null,
        CustomerId: null,
        Remark: null,
        TypeId: 10,
        IsVirtual: false,
        IsDeleted: false,
        IsActive: true,
        ParentId: null,
        CityId: null,
        Address: null,
        PostalCode: null,
        Website: null,
        RootLocation: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.Title = null;
        $scope.entity.Code = null;
        $scope.entity.FullCode = $scope.parentCode;
        $scope.entity.CustomerId = null;
        $scope.entity.Remark = null;
        $scope.entity.TypeId = 10;
        $scope.entity.IsVirtual = false;
        $scope.entity.IsDeleted = false;
        $scope.entity.IsActive = true;
        $scope.entity.ParentId = null;
        $scope.entity.CityId = null;
        $scope.entity.Address = null;
        $scope.entity.PostalCode = null;
        $scope.entity.Website = null;
        $scope.entity.RootLocation = null;
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.Title = data.Title;
        $scope.entity.Code = data.Code;
        $scope.entity.FullCode = data.FullCode;
        $scope.entity.CustomerId = data.CustomerId;
        $scope.entity.Remark = data.Remark;
        $scope.entity.TypeId = data.TypeId;
        $scope.entity.IsVirtual = data.IsVirtual;
        $scope.entity.IsDeleted = data.IsDeleted;
        $scope.entity.IsActive = data.IsActive;
        $scope.entity.ParentId = data.ParentId;
        $scope.entity.CityId = data.CityId;
        $scope.entity.Address = data.Address;
        $scope.entity.PostalCode = data.PostalCode;
        $scope.entity.Website = data.Website;
        $scope.entity.RootLocation = data.RootLocation;
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

    //////////////////////////
    $scope.txt_parent = {
        hoverStateEnabled: false,
        readOnly:true,
        bindingOptions: {
            value: 'parent',
        }
    };
    $scope.txt_parentCode = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'parentCode',
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
    $scope.txt_Code = {
        mask: "00",
        maskChar: '-',
        maskInvalidMessage: 'Wrong Code',
        valueChangeEvent:'keyup',
        onValueChanged: function (e) {
            if (e.value) {
                $scope.entity.FullCode = $scope.parentCode + e.value;
            }
            else {
                $scope.entity.FullCode = $scope.parentCode;
            }
        },
        bindingOptions: {
            value: 'entity.Code'
        }
    };
    $scope.txt_FullCode = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.FullCode',
        }
    };
    ///////////////////////////
    $scope.sb_CityId = {
        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/cities/all',
                version: 4
            }),
            sort: ['City'],
        }),
        searchExpr: ["City", "Country"],
        valueExpr: "Id",
        searchMode: 'startsWith',
        displayExpr: "FullName",
        bindingOptions: {
            value: 'entity.CityId',
        }

    };
  
    $scope.txt_IATA = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.IATA',
        }
    };
    $scope.txt_ICAO = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ICAO',
        }
    };
    /////////////////////////////
    $scope.pop_width = 600;
    $scope.pop_height = 430;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'locationadd', bindingOptions: {} }, toolbar: 'bottom' },
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
            $rootScope.$broadcast('onLocationHide', null);
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
        //$scope.parent = null;
        //$scope.parentCode = null;
        //$scope.ParentCustomerId = null;
        //$scope.parentId = null;
        //$scope.rootId = null;
        //$scope.root = null;
        //$scope.rootCode = null;
        $scope.entity.ParentId = $scope.parentId;
        $scope.entity.RootLocation = $scope.rootId;
        $scope.entity.CustomerId = $scope.ParentCustomerId;

        $scope.loadingVisible = true;
        locationService.save($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onLocationSaved', response);



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
    $scope.parentData = null;
    $scope.parent = null;
    $scope.parentCode = null;
    $scope.ParentCustomerId = null;
    $scope.parentId = null;
    $scope.rootId = null;
    $scope.root = null;
    $scope.rootCode = null;

    $scope.$on('InitAddLocation', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'New';
            $scope.parentData = prms.parent;
            $scope.parent = prms.parent.Title;
            $scope.parentCode = prms.parent.FullCode;
            $scope.parentId = prms.parent.Id;
            $scope.rootId = prms.parent.RootLocation;
            $scope.root = prms.parent.Root;
            $scope.rootCode = prms.parent.RootCode;
            $scope.ParentCustomerId = prms.parent.CustomerId;
            $scope.entity.FullCode = $scope.parentCode;
        }

        else {

            $scope.popup_add_title = 'Edit';
            $scope.tempData = prms;
            $scope.isNew = false;

           // $scope.parentData = prms.parent;
            $scope.parent = prms.Parent;
            $scope.parentCode = prms.ParentCode;
            $scope.parentId = prms.ParentId;
            $scope.rootId = prms.RootLocation;
            $scope.root = prms.Root;
            $scope.rootCode = prms.RootCode;
            $scope.ParentCustomerId = prms.CustomerId;
        }

        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  