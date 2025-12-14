'use strict';
app.controller('jobgroupAddController', ['$scope', '$location', 'jobgroupService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, jobgroupService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;


    $scope.entity = {
        Id: null,
        Title: null,
        Code: '',
        FullCode: '',
        CustomerId: null,
        Remark: null,
        
        ParentId: null,
       
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.Title = null;
        $scope.entity.Code = '';
        $scope.entity.FullCode = $scope.parentCode ? $scope.ParentCode:'';
        $scope.entity.CustomerId = null;
        $scope.entity.Remark = null;
        
        $scope.entity.ParentId = null;
        
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.Title = data.Title;
        $scope.entity.Code = data.Code;
        $scope.entity.FullCode = data.FullCode;
        $scope.entity.CustomerId = data.CustomerId;
        $scope.entity.Remark = data.Remark;
        
        $scope.entity.ParentId = data.ParentId;
       
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
        readOnly: true,
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
    $scope.codeMask = '00';
    $scope.txt_Code = {
      //  mask: "00",
        maskChar: '-',
        maskInvalidMessage: 'Wrong Code',
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            if (e.value) {
                $scope.entity.FullCode = ($scope.parentCode ? $scope.parentCode:'') + e.value;
            }
            else {
                $scope.entity.FullCode = ($scope.parentCode ? $scope.parentCode : '');
            }
        },
        bindingOptions: {
            value: 'entity.Code',
            mask:'codeMask'
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
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'jobgroupadd', bindingOptions: {} }, toolbar: 'bottom' },
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
            $rootScope.$broadcast('onJobGroupHide', null);
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
     
        $scope.entity.CustomerId = Config.CustomerId;

        $scope.loadingVisible = true;
        jobgroupService.save($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onJobGroupSaved', response);



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
    $scope.groups = null;
    $scope.sb_parent = {
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateLocation(data);
        },
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title","FullCode"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {

            $scope.parentCode = e.selectedItem ? e.selectedItem.FullCode : null;
            $scope.entity.FullCode = $scope.parentCode + $scope.entity.Code;
            if (!e.selectedItem  )
                $scope.codeMask = '000';
            else
                $scope.codeMask = '00';

        },
        bindingOptions: {
            value: 'parentId',
            dataSource:'groups',

        }

    };




    $scope.$on('InitAddJobGroup', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'New';
            $scope.parentData = prms.parent;
            $scope.parent = prms.parent? prms.parent.Title:null;
            $scope.parentCode = prms.parent ? prms.parent.FullCode:'';
            $scope.parentId = prms.parent ? prms.parent.Id : null;
            $scope.groups = Enumerable.From(prms.groups).OrderBy('$.FullCode').ToArray() ;
            
            //$scope.ParentCustomerId = prms.parent.CustomerId;
            //$scope.entity.FullCode = $scope.parentCode;
        }

        else {
            
            $scope.popup_add_title = 'Edit';
            $scope.tempData = prms.data;
            $scope.isNew = false;
           

            //// $scope.parentData = prms.parent;
            $scope.parent = prms.data.Parent;
            $scope.parentCode = prms.data.ParentCode ? prms.data.ParentCode:'';
            $scope.parentId = prms.data.ParentId;
            $scope.groups = Enumerable.From(prms.groups).OrderBy('$.FullCode').ToArray();
            //$scope.rootId = prms.RootLocation;
            //$scope.root = prms.Root;
            //$scope.rootCode = prms.RootCode;
            //$scope.ParentCustomerId = prms.CustomerId;
        }
        if ($scope.parentId == null)
            $scope.codeMask = '000';
        else
            $scope.codeMask = '00';
        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  