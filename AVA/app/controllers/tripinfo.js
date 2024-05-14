'use strict';
app.controller('tripInfoController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    $scope.isEditable = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = true;


    /////////////////////////
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
    ///////////////////////
    $scope.save = function (prm, callback) {
        $scope.entity.User = $rootScope.userTitle;

        $scope.loadingVisible = true;
        flightBagService.saveDR($scope.entity).then(function (response2) {
            $scope.loadingVisible = false;
            if (response2.IsSuccess) {

                console.log('DR', response2.Data);
                if (prm == 0) {
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    $scope.popup_add_visible = false;

                }
                else callback();
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 800;
    $scope.popup_add_title = 'Dispatch Release';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {
                        //if ($rootScope.getOnlineStatus()) {
                        //$scope.entity.Id
                        //    var data = { FlightId: $scope.entity.FlightId, documentType: 'dr' };

                        //     $rootScope.$broadcast('InitSignAdd', data);
                        // }
                        // else {
                        //     General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        // }


                        //$scope.popup_dr_sign_visible=true;

                        ////////////////////////////////////////////
                        $scope.save(1, function () {
                            var dto = {};
                            dto.flight_id = $scope.tempData.FlightId;
                            dto.lic_no = '4806';
                            dto.user_id = $rootScope.userId;

                            $scope.loadingVisible = true;
                            flightBagService.signDr(dto).then(function (response2) {
                                $scope.loadingVisible = false;
                                if (response2.done) {
                                    General.ShowNotify(Config.Text_SavedOk, 'success');

                                    $scope.popup_add_visible = false;
                                }
                                else {
                                    General.ShowNotify(response2.message, 'error');
                                }


                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        });



                        ////////////////////////////////////////////////

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'dradd', onClick: function (e) {

                        $scope.save(0);



                    }
                }, toolbar: 'bottom'
            },
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

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onDrAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        isFullScreen: false,
        bindingOptions: {
            visible: 'popup_add_visible',
            //fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isLockVisible',
            'toolbarItems[1].visible': 'isEditable',

        }
    };
    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        console.log($scope.tempData.FlightId)

        $scope.entity.FlightId = $scope.tempData.FlightId;
        $scope.isLockVisible = true;
        //if ($rootScope.getOnlineStatus()) {

        //    flightBagService.checkLock($scope.entity.FlightId, 'dr').then(function (response) {
        //        $scope.isLockVisible = false;
        //        if (response.IsSuccess && response.Data.canLock) {
        //            $scope.isLockVisible = true;
        //        }
        //    }, function (err) { });
        //}

        $scope.loadingVisible = true;



        flightBagService.epGetDRByFlight($scope.entity.FlightId).then(function (response2) {

            console.log('bind dr', response2)

            $scope.loadingVisible = false;
            $scope.flight = response2.Data;
            $scope.isEditable = true;// (diff <= 24);

            if (!response2) {

                $scope.isNew = true;
                $scope.entity = {
                    Id: -1,
                    ActualWXDSP: false,
                    ActualWXCPT: false,
                    WXForcastDSP: false,

                    WXForcastCPT: false,
                    SigxWXDSP: false,
                    SigxWXCPT: false,
                    WindChartDSP: false,
                    WindChartCPT: false,
                    NotamDSP: false,
                    NotamCPT: false,
                    ComputedFligthPlanDSP: false,
                    ComputedFligthPlanCPT: false,
                    ATCFlightPlanDSP: false,
                    ATCFlightPlanCPT: false,
                    PermissionsDSP: false,
                    PermissionsCPT: false,
                    JeppesenAirwayManualDSP: false,
                    JeppesenAirwayManualCPT: false,
                    MinFuelRequiredDSP: false,
                    MinFuelRequiredCPT: false,
                    GeneralDeclarationDSP: false,
                    GeneralDeclarationCPT: false,
                    FlightReportDSP: false,
                    FlightReportCPT: false,
                    TOLndCardsDSP: false,
                    TOLndCardsCPT: false,
                    LoadSheetDSP: false,
                    LoadSheetCPT: false,
                    FlightSafetyReportDSP: false,
                    FlightSafetyReportCPT: false,
                    AVSECIncidentReportDSP: false,
                    AVSECIncidentReportCPT: false,
                    OperationEngineeringDSP: false,
                    OperationEngineeringCPT: false,
                    VoyageReportDSP: false,
                    VoyageReportCPT: false,
                    PIFDSP: false,
                    PIFCPT: false,
                    GoodDeclarationDSP: false,
                    GoodDeclarationCPT: false,
                    IPADDSP: false,
                    IPADCPT: false,
                };
                $scope.entity.FlightId = $scope.tempData.FlightId;

            }
            else {

                $scope.url_sign4 = '';
                $scope.PIC4 = '';
                $scope.signDate4 = '';
                $scope.PIC = '';
                $scope.signDatePIC = '';
                if (response2.JLDSPSignDate) {
                    $scope.isEditable = false;
                    $scope.url_sign4 = signFiles + response2.DispatcherId + ".jpg";

                    $scope.PIC4 = response2.PIC;
                    $scope.signDate4 = moment(new Date(response2.JLDSPSignDate)).format('YYYY-MM-DD HH:mm');
                }

                if (response2.JLDatePICApproved) {
                    $scope.isEditable = false;
                    $scope.url_sign_pic = signFiles + response2.PICId + ".jpg";

                    $scope.PIC4 = response2.PIC;
                    $scope.signDatePIC = moment(new Date(response2.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }



                $scope.isNew = false;
                $scope.fill(response2);

            }

            //console.log('ASR',response2.Data);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





        // }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////////////////
    $scope.scroll_tiadd_height = '100%';
    $scope.scroll_tiadd = {
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
            height: 'scroll_tiadd_height'
        }

    };
    /////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

         

    });
    $scope.$on('InitTripInfoAdd', function (event, prms) {


        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);