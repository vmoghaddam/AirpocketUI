'use strict';
app.controller('nisAddController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.entity =
    {
        paperItemId: 0,
        cmP_PartNumberId: 0,
        priorityId: 0,
        sender_LocationId: 0,
        sender_UserId: 0,
        quantity: 0,
        remark: null
    }

    $scope.clear_entity = function () {
        $scope.entity.paperItemId = 0;
        $scope.entity.cmP_PartNumberId = 0;
        $scope.entity.priorityId = 0;
        $scope.entity.sender_LocationId = 0;
        $scope.entity.sender_UserId = 0;
        $scope.entity.quantity = 0;
        $scope.entity.remark = null;

    }



    $scope.txt_remark = {
        height: 120,
        width: '100%',
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_pn = {
        height: 120,
        width: '100%',
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_newPn = {
        height: 120,
        width: '100%',
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_qty = {
        height: 120,
        width: '100%',
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_newQty = {
        height: 120,
        width: '100%',
        bindingOptions: {
            value: ''
        }
    }


    /////////////////////////////

    $scope.popup_nis_visible = false;
    $scope.popup_height = 410;
    $scope.popup_width = 650;
    $scope.popup_nis_title = "NIS Info";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_nis = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        $scope.popup_nis_visible = false;
                        vira_general_service.add_nis($scope.entity).then(function () {
                            $scope.clear_entity();
                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_nis_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            $scope.clear_entity
            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData == null)
                $scope.bind();

        },
        onHiding: function () {


            $scope.popup_nis_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_nis_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_nis_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };


    $scope.popup_result_visible = false;
    $scope.popup_result_title = "";


    $scope.popup_result = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'New Receipt', onClick: function (e) {
                        //$scope.loadingVisible = true;
                        //$scope.entity.receiptItems = $scope.dg_rec_ds
                        //mntService.addReceipt($scope.entity).then(function (res) {
                        //    $scope.loadingVisible = false;
                        //    console.log(res);
                        //    if (res.errorCode) {
                        //        General.ShowNotify(res.errorMessage, 'error');
                        //    }
                        //    else {
                        //        $scope.entity.paperNo = res.data.paperNo;
                        //        General.ShowNotify(Config.Text_SavedOk, 'success');
                        //        $scope.popup_receipt_visible = false;

                        //    }

                        //});
                        $scope.clear_entity();
                        $scope.popup_result_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_result_visible = false;
                        $scope.popup_receipt_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {




        },
        onHiding: function () {


            $scope.popup_result_visible = false;
        },
        onContentReady: function (e) {


        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_result_visible',

            title: 'popup_result_title',
            height: '300',
            width: '500',


        }
    };



    //////////////////////////


    $scope.$on('InitNISPopup', function (event, prms) {

        $scope.tempData = prms;



        $scope.popup_nis_visible = true;
    });



}]);


