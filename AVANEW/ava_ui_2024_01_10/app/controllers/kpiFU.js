'use strict';
app.controller('kpiFUController', ['$scope', '$location', 'personService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, $routeParams, $rootScope) {


    ////////////////////////
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
    ////////////////////////////
    $scope.popup_visible = false;
    $scope.popup_title = 'FU';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {





        },
        onHiding: function () {

            $scope.popup_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },

        bindingOptions: {
            visible: 'popup_visible',

            title: 'popup_title',

        }
    };
    ////////////////////////////////

    $scope.prms = null;
    $scope.$on('InitkpiFU', function (event, prms) {
        $scope.prms = prms;

        $scope.popup_visible = true;

    });
    //////////////////////////////

}]);  