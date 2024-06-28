'use strict';
app.controller('vira_company_addController', ['$scope', '$location', 'mntService', 'vira_general_service', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, vira_general_service, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.isNew = null;
    $scope.entity = {

        id: 0,
        countryId: null,
        shipmentId: null,
        currencyId: 0,
        name: null,
        address: null,
        telephone: null,
        fax: null,
        email: null,
        contactPerson: null,
        companyType: null,
        selected: true,
        active: true
    }

    //////////////////

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 480;
    $scope.popup_width = 600;
    $scope.popup_personnel_title = "New Company";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', validationGroup: 'val_company', onClick: function (e) {


                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.loadingVisible = true;
                        if ($scope.isNew) {
                            $scope.save(function (res) {
                                if (res.errorCode) {
                                    if (res.errorCode == 10029) {
                                        mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                            $scope.save();

                                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                    }
                                    else
                                        General.ShowNotify(res.errorMessage, 'error');
                                }
                                else {
                                    General.ShowNotify('Saving Was Done Successfully', 'success');
                                    $scope.popup_personnel_visible = false;
                                    $scope.loadingVisible = false;
                                }
                            });
                        }
                        else {
                            $scope.edit(function (res) {
                                if (res.errorCode) {
                                    if (res.errorCode == 10029) {
                                        mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                            $scope.edit();

                                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                    }
                                    else
                                        General.ShowNotify(res.errorMessage, 'error');
                                }
                                else {
                                    General.ShowNotify('Saving Was Done Successfully', 'success');
                                    $scope.popup_personnel_visible = false;
                                    $scope.loadingVisible = false;
                                }
                            });

                        }


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_personnel_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            //if ($scope.isNew) {
            //    $scope.isContentVisible = true;
            //}
            //if ($scope.tempData != null)

            $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {

            $scope.isNew = null;
            $scope.entity = {
                id: 0,
                ataId: null,
                title: null

            }
            $scope.popup_personnel_visible = false;
            $rootScope.$broadcast('company_closed', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_personnel_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_personnel_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    ////////////////////


    $scope.save = function (callback) {
        $scope.loadingVisible = true;
        vira_general_service.add_company($scope.entity).then(function (res) {
            $scope.loadingVisible = false;
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.loadingVisible = false;

                }
            }
        });
    };
    $scope.edit = function (callback) {
        $scope.loadingVisible = true;
        vira_general_service.edit_company($scope.entity).then(function (res) {
            $scope.loadingVisible = false;
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.loadingVisible = false;

                }
            }
        });
    };
    $scope.bind = function () {

        vira_general_service.get_company().then(function (res) {
            $scope.ds_company = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        mntService.getReceiptPN(194).then(function (res) {
            $scope.ds_currency = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        vira_general_service.get_shipment().then(function (response) {

            $scope.ds_shipment = response.data;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    }


    ////////////////////

    $scope.ds_type =
        [
            { id: 0, title: "Repair" },
            { id: 1, title: "Purchase" },
            { id: 2, title: "Repair And Purchase" }
        ]

    $scope.sb_type = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_type,
        bindingOptions: {
            value: 'entity.companyType',

        }
    }

    $scope.ds_country =
        [
            { id: 'IRN', title: 'IRN' },
            { id: 'GB', title: 'GB' },
            { id: 'TUR', title: 'TUR' },
            { id: 'ARE', title: 'ARE' },
            { id: 'FRA', title: 'FRA' },
            { id: 'DEU', title: 'DEU' },
            { id: 'CHN', title: 'CHN' },
            { id: 'AE', title: 'AE' },
            { id: 'AUT', title: 'AUT' },
            { id: 'ESP', title: 'ESP' },
            { id: 'UKR', title: 'UKR' },
            { id: 'HR', title: 'HR' },
            { id: 'BGR', title: 'BGR' },
            { id: 'IDN', title: 'IDN' },
            { id: 'MYS', title: 'MYS' },
        ]

    $scope.sb_country = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_country,
        bindingOptions: {
            value: 'entity.countryId',

        }
    }


    $scope.sb_shipment = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.shipmentId',
            dataSource: 'ds_shipment'
        }
    }


    $scope.sb_currency = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.currencyId',
            dataSource: 'ds_currency'

        }
    }


    $scope.txt_name = {
        bindingOptions: {
            value: 'entity.name'
        }
    }

    $scope.txt_phone = {
        bindingOptions: {
            value: 'entity.telephone'
        }
    }


    $scope.txt_fax = {
        bindingOptions: {
            value: 'entity.fax'
        }
    }


    $scope.txt_email = {
        bindingOptions: {
            value: 'entity.email'
        }
    }

    $scope.txt_address = {
        bindingOptions: {
            value: 'entity.address'
        }
    }

    $scope.txt_contact_person = {
        bindingOptions: {
            value: 'entity.contactPerson'
        }
    }



    ///////////////////////



    $scope.$on('InitNewPartType', function (event, prms) {

        $scope.tempData = prms;

        if ($scope.tempData == null)
            $scope.isNew = true;
        else {
            $scope.isNew = false
            $scope.entity = $scope.tempData
        }

        console.log('entity: ', $scope.entity);
        console.log('Is New: ', $scope.isNew);

        $scope.popup_personnel_visible = true;
    });


    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };

}]);


