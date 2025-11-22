'use strict';
app.controller('airportAddController', ['$scope', '$location', 'airportService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, airportService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;


    $scope.entity = {
        Id: null,
        Name: null,
        IATA: null,
        ICAO: null,
        CityId: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.Name = null;
        $scope.entity.IATA = null;
        $scope.entity.ICAO = null;
        $scope.entity.CityId = null;
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.Name = data.Name;
        $scope.entity.IATA = data.IATA;
        $scope.entity.ICAO = data.ICAO;
        $scope.entity.CityId = data.CityId;
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
    $scope.txt_Name = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Name',
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
    /////////////////////////////////
    $scope.sb_from = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},
        onSelectionChanged: function (arg) {

           
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.SourceAirportId',


        }
    };
    $scope.sb_to = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},
        onSelectionChanged: function (arg) {

            
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.DestinationAirportId',

        }
    };
    /////////////////////////////
    $scope.pop_width = 600;
    $scope.pop_height = 350;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'airportadd', bindingOptions: {} }, toolbar: 'bottom' },
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
            $rootScope.$broadcast('onAirportHide', null);
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
        airportService.save($scope.entity).then(function (response) {
             
            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onAirportSaved', response);


            
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
    $scope.$on('InitAddAirport', function (event, prms) {


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