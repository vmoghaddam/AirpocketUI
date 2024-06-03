'use strict';
app.controller('nisAddController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


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
                    type: 'success', text: 'Select', onClick: function (e) {

                        $scope.popup_nis_visible = false;

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

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
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


    //////////////////////////


    $scope.$on('InitNISPopup', function (event, prms) {

        $scope.tempData = prms;

        

        $scope.popup_nis_visible = true;
    });



}]);


