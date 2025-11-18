'use strict';
app.controller('organizationAddController', ['$scope', '$location', 'organizationService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, organizationService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;
    $scope.TypeId = null;

    $scope.entity = {
        Id: null,
        Title: null,
        Website: null,
        Email: null,
        Tel: null,
        Fax: null,
        ContactPerson: null,
        Address: null,
        Remark: null,
        LogoUrl: null,
        TypeId: null,
        CountryId: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.Title = null;
        $scope.entity.Website = null;
        $scope.entity.Email = null;
        $scope.entity.Tel = null;
        $scope.entity.Fax = null;
        $scope.entity.ContactPerson = null;
        $scope.entity.Address = null;
        $scope.entity.Remark = null;
        $scope.entity.LogoUrl = null;
        $scope.entity.TypeId = null;
        $scope.entity.CountryId = null;
        $scope.img_url = 'content/images/image.png';
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.Title = data.Title;
        $scope.entity.Website = data.Website;
        $scope.entity.Email = data.Email;
        $scope.entity.Tel = data.Tel;
        $scope.entity.Fax = data.Fax;
        $scope.entity.ContactPerson = data.ContactPerson;
        $scope.entity.Address = data.Address;
        $scope.entity.Remark = data.Remark;
        $scope.entity.LogoUrl = data.LogoUrl;
        $scope.entity.TypeId = data.TypeId;
        $scope.entity.CountryId = data.CountryId;
        if (data.LogoUrl)
            $scope.img_url = $rootScope.clientsFilesUrl + data.LogoUrl;
        else
            $scope.img_url = 'content/images/image.png';
    };
    ////////////////////////////
    $scope.img_url = 'content/images/image.png';
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_image = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            $scope.entity.LogoUrl = e.request.responseText;
            $scope.img_url = $rootScope.clientsFilesUrl + $scope.uploadedFileImage;

        },
        bindingOptions: {
            value: 'uploaderValueImage'
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
    $scope.txt_Address = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Address',
        }
    };
    
    $scope.txt_Address = {
        hoverStateEnabled: false,
       
        bindingOptions: {
            value: 'entity.Address',

        }
    };
    
    $scope.txt_ContactPerson = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ContactPerson',
        }
    };
    
    $scope.txt_Tel = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Tel',
        }
    };
    
    $scope.txt_Fax = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Fax',
        }
    };
    $scope.sb_Country = {
        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/countries',
                version: 4
            }),
            sort: ['Name'],
        }),
        searchExpr: ["Name", "SortName"],
        valueExpr: "Id",
        searchMode: 'startsWith',
        displayExpr: "Name",
        bindingOptions: {
            value: 'entity.CountryId',
        }

    };
    $scope.emailValidationRules = {
        validationRules: [
            //    {
            //    type: "required",
            //    message: "Email is required"
            //},
            {
                type: "email",
                message: "Email is invalid"
            }]
    };
    $scope.txt_Email = {
        mode: 'email',
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
            
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
    $scope.pop_height = 585;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'organizationadd', bindingOptions: {} }, toolbar: 'bottom' },
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
            $rootScope.$broadcast('onOrganizationHide', null);
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
        organizationService.save($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onOrganizationSaved', response);



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
    $scope.$on('InitAddOrganization', function (event, prms) {


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