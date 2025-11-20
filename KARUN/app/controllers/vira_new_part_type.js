'use strict';
app.controller('vira_new_part_typeController', ['$scope', '$location', 'mntService', 'vira_general_service', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, vira_general_service, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.isNew = null;
    $scope.entity = {
        id: 0,
        ataId: null,
        title: null

    }

    //////////////////

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 230;
    $scope.popup_width = 400;
    $scope.popup_personnel_title = "New Part Type";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

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
        vira_general_service.add_part_type($scope.entity).then(function (res) {
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
        vira_general_service.edit_part_type($scope.entity).then(function (res) {
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

        mntService.get_ata_chart().then(function (res) {
            $scope.ds_ata = res;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }


    ////////////////////

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ataId',
            dataSource: 'ds_ata'
        }
    }


    $scope.txt_part_type = {
        bindingOptions: {
            value: 'entity.title'
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

        console.log('entity: ',$scope.entity);
        console.log('Is New: ',$scope.isNew);

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


