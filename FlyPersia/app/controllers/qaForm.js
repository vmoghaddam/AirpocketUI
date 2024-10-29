'use strict';
app.controller('qaForm', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', 'qaService', function ($scope, $location, authService, $routeParams, $rootScope, qaService) {


    

    //////////////////////////
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
   

    /////////////////////////////
    $scope.pop_width = 800;
    $scope.pop_height = 500;
    $scope.popup_form_visible = false;
    
    $scope.popup_form = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Confirm', icon: 'check', onClick: function (e) {
                        qaService.confirmReport(4888, 0, $scope.entity.Id).then(function (response) {
                            console.log(response);
                        });
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Referre', onClick: function (e) {
                        $rootScope.$broadcast('InitCSR', { type: $scope.followUpEntity.Type, data: $scope.tempData });
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_form_visible = false;
                    }
                }, toolbar: 'bottom'
            }],



        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            if (size.width <= 800) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }
            $scope.dg_height = $scope.pop_height - 100;
            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {


            $scope.bind();

        },
        onHiding: function () {



            $scope.popup_form_visible = false;
            $rootScope.$broadcast('onEmployeeSelectHide', $scope.dg_selected);
        },
        bindingOptions: {
            visible: 'popup_form_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_form_title',
          
        }
    };

    //close button
    $scope.popup_form.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_form_visible = false;
    };

    //save button
    $scope.popup_form.toolbarItems[0].options.onClick = function (e) {
        console.log('entity', $scope.entity);
        qaService.referre($scope.entity).then(function (response) {
            console.log(response);
        });
    };
    ////////////////////////////
    $scope.bind = function () {
      
    };
    ////////////////////////////
   
    $scope.$on('InitQAForm', function (event, prms) {
        var type = 0
        switch (type) {
            case 0:
                $rootScope.$broadcast('InitCSR', { data: prms});
                $scope.show = true;
                break;
        }

        //if (prms) {
        //    $scope.entity.Type = prms.type;
        //    $scope.entity.ReferreId = $rootScope.EmployeeId;
        //    $scope.entity.EntityId = prms.data.recordData.Id;
        //}
        $scope.popup_form_visible = true;

    });
    //////////////////////////////

}]);