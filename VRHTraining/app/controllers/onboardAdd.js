'use strict';
app.controller('OnboardAddController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    $scope.isEditable = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = fasle;





    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width =  $(window).width() - 500;
    $scope.popup_add_title = 'Onboard Document';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
           
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_add_visible = false;
                    }
                }, toolbar: 'bottom'
            }
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





        },
        onHiding: function () {

            //$scope.clearEntity();
            $rootScope.IsRootSyncEnabled = true;
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onOnboardAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isLockVisible',
            'toolbarItems[1].visible': 'isEditable',
           // 'toolbarItems[2].visible': 'isEditable',

        }
    };
    $scope.save = function (_item_id, _status) {
        var data = {
            flight_id: $scope.entity.FlightId
            , item_id: _item_id
            , status: _status
        };
        flightService.saveOnboard(data).then(function (response2) {
            $scope.loadingVisible = false;
            if (response2.IsSuccess) {
                ////////////////////
                

               // $rootScope.$broadcast('InitSignAdd', data);
                ///////////////////////////

            } else General.ShowNotify("An error occurred in  saving Onboard Document.", 'error');


        }, function (err) {
            $scope.loadingVisible = false;
            General.ShowNotify("An error occurred in  saving Onboard Document.", 'error');
           // General.ShowNotify(JSON.stringify(err), 'error');
        });
    };


    $scope.save_all = function (  _status) {
        var data = {
            flight_id: $scope.entity.FlightId
           // , item_id: _item_id
            , status: _status
        };
        flightService.saveOnboardAll(data).then(function (response2) {
            $scope.loadingVisible = false;
            if (response2.IsSuccess) {
                ////////////////////


                // $rootScope.$broadcast('InitSignAdd', data);
                ///////////////////////////

            } else General.ShowNotify("An error occurred in  saving Onboard Document.", 'error');


        }, function (err) {
            $scope.loadingVisible = false;
            General.ShowNotify("An error occurred in  saving Onboard Document.", 'error');
            // General.ShowNotify(JSON.stringify(err), 'error');
        });
    };
    $scope.entity = {

    };
    $scope.ds_category = [];
    /////////////////////////////////
    $scope.get_status_class = function (s) {
        if (!s)
            return "status_null_class";
        if (s == "S")
            return "status_s_class";
        return "status_us_class";

    }
    $scope.click_status = function (item) {
      
        if (!item.status || item.status == '') {
           // alert('x');
            item.status = "S";
            
        } else
        if (item.status=="S") {
            item.status = "US";
        } else 
        if (item.status == "US") {
            item.status = null;
                }
        $scope.save(item.id, item.status);
       
    };
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;
        flightService.getOnboard($scope.entity.FlightId).then(function (response2) {
            //console.log('onboard', response2);
            $scope.ds_category = response2.Data;
            $scope.isEditable = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }
    ////////////////////////////////
    $scope.scroll_obadd_height = '100%';
    $scope.scroll_obadd = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_obadd_height'
        }

    };
    /////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'dr')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitOnboardAdd', function (event, prms) {



        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);