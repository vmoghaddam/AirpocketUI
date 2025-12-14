'use strict';
app.controller('vira_new_part_typeController', ['$scope', '$location', 'mntService', 'vira_general_service', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, vira_general_service, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.entity = {
        id: 0,
        ataId: null,
        title: null
      
    }

    //////////////////

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 450;
    $scope.popup_width = 600;
    $scope.popup_personnel_title = "New Part Type";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        vira_general_service.add_part_type($scope.entity).then(function (res) {
                            $scope.dg_pn_ds = res.data;
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        $scope.popup_personnel_visible = false;

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

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


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

        $scope.bind();

        $scope.popup_personnel_visible = true;
    });



}]);


