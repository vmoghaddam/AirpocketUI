'use strict';
app.controller('drAddController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window) {
    


    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    $scope.isEditable = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = true;

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

    $scope.chb_ActualWXDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ActualWXDSP',
        }
    };

    $scope.chb_ActualWXCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.ActualWXCPT',
        }
    };

    $scope.txt_ActualWXCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.ActualWXCPTRemark',
        }
    };

    $scope.chb_WXForcastDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WXForcastDSP',
        }
    };

    $scope.chb_WXForcastCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.WXForcastCPT',
        }
    };

    $scope.txt_WXForcastCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.WXForcastCPTRemark',
        }
    };

    $scope.chb_SigxWXDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.SigxWXDSP',
        }
    };

    $scope.chb_SigxWXCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.SigxWXCPT',
        }
    };

    $scope.txt_SigxWXCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.SigxWXCPTRemark',
        }
    };

    $scope.chb_WindChartDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WindChartDSP',
        }
    };

    $scope.chb_WindChartCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.WindChartCPT',
        }
    };

    $scope.txt_WindChartCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.WindChartCPTRemark',
        }
    };

    $scope.chb_NotamDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.NotamDSP',
        }
    };

    $scope.chb_NotamCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.NotamCPT',
        }
    };

    $scope.txt_NotamCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.NotamCPTRemark',
        }
    };

    $scope.chb_ComputedFligthPlanDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ComputedFligthPlanDSP',
        }
    };

    $scope.chb_ComputedFligthPlanCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.ComputedFligthPlanCPT',
        }
    };

    $scope.txt_ComputedFligthPlanCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.ComputedFligthPlanCPTRemark',
        }
    };

    $scope.chb_ATCFlightPlanDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ATCFlightPlanDSP',
        }
    };

    $scope.chb_ATCFlightPlanCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.ATCFlightPlanCPT',
        }
    };

    $scope.txt_ATCFlightPlanCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.ATCFlightPlanCPTRemark',
        }
    };

    $scope.chb_PermissionsDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PermissionsDSP',
        }
    };

    $scope.chb_PermissionsCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.PermissionsCPT',
        }
    };

    $scope.txt_PermissionsCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.PermissionsCPTRemark',
        }
    };

    $scope.chb_JeppesenAirwayManualDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualDSP',
        }
    };

    $scope.chb_JeppesenAirwayManualCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualCPT',
        }
    };

    $scope.txt_JeppesenAirwayManualCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualCPTRemark',
        }
    };

    $scope.chb_MinFuelRequiredDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.MinFuelRequiredDSP',
        }
    };

    $scope.chb_MinFuelRequiredCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.MinFuelRequiredCPT',
        }
    };
    //dool
    $scope.txt_MinFuelRequiredCFP = {
        min: 0,
        bindingOptions: {
            value: 'entity.MinFuelRequiredCFP',
        }
    };

    $scope.txt_MinFuelRequiredPilotReq = {
        min: 0,
        bindingOptions: {
            value: 'entity.MinFuelRequiredPilotReq',
        }
    };

    $scope.chb_GeneralDeclarationDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GeneralDeclarationDSP',
        }
    };

    $scope.chb_GeneralDeclarationCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.GeneralDeclarationCPT',
        }
    };

    $scope.txt_GeneralDeclarationCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.GeneralDeclarationCPTRemark',
        }
    };

    $scope.chb_FlightReportDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightReportDSP',
        }
    };

    $scope.chb_FlightReportCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.FlightReportCPT',
        }
    };

    $scope.txt_FlightReportCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.FlightReportCPTRemark',
        }
    };

    $scope.chb_TOLndCardsDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.TOLndCardsDSP',
        }
    };

    $scope.chb_TOLndCardsCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.TOLndCardsCPT',
        }
    };

    $scope.txt_TOLndCardsCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.TOLndCardsCPTRemark',
        }
    };

    $scope.chb_LoadSheetDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.LoadSheetDSP',
        }
    };

    $scope.chb_LoadSheetCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.LoadSheetCPT',
        }
    };

    $scope.txt_LoadSheetCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.LoadSheetCPTRemark',
        }
    };

    $scope.chb_FlightSafetyReportDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightSafetyReportDSP',
        }
    };

    $scope.chb_FlightSafetyReportCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.FlightSafetyReportCPT',
        }
    };

    $scope.txt_FlightSafetyReportCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.FlightSafetyReportCPTRemark',
        }
    };


    $scope.chb_AVSECIncidentReportDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.AVSECIncidentReportDSP',
        }
    };

    $scope.chb_AVSECIncidentReportCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.AVSECIncidentReportCPT',
        }
    };

    $scope.txt_AVSECIncidentReportCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.AVSECIncidentReportCPTRemark',
        }
    };

    $scope.chb_OperationEngineeringDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.OperationEngineeringDSP',
        }
    };

    $scope.chb_OperationEngineeringCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.OperationEngineeringCPT',
        }
    };

    $scope.txt_OperationEngineeringCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.OperationEngineeringCPTRemark',
        }
    };

    $scope.chb_VoyageReportDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.VoyageReportDSP',
        }
    };

    $scope.chb_VoyageReportCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.VoyageReportCPT',
        }
    };

    $scope.txt_VoyageReportCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VoyageReportCPTRemark',
        }
    };

    $scope.chb_PIFDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PIFDSP',
        }
    };

    $scope.chb_PIFCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.PIFCPT',
        }
    };

    $scope.txt_PIFCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.PIFCPTRemark',
        }
    };

    $scope.txt_GoodDeclarationCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.GoodDeclarationCPTRemark',
        }
    };

    $scope.chb_GoodDeclarationDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GoodDeclarationDSP',
        }
    };

    $scope.chb_GoodDeclarationCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.GoodDeclarationCPT',
        }
    };

    $scope.GoodDeclarationCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.GoodDeclarationCPTRemark',
        }
    };

    $scope.chb_IPADDSP = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.IPADDSP',
        }
    };

    $scope.chb_IPADCPT = {
        text: '',
        bindingOptions: {
            value: 'entity.IPADCPT',
        }
    };

    $scope.txt_IPADCPTRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.IPADCPTRemark',
        }
    };


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
    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height()-100;
    $scope.popup_width = 800;
    $scope.popup_add_title = 'Dispatch Release';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {
                        if ($rootScope.getOnlineStatus()) {
                            //$scope.entity.Id
                            var data = { FlightId: $scope.entity.FlightId, documentType: 'dr' };

                            $rootScope.$broadcast('InitSignAdd', data);
                        }
                        else {
                            General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'dradd', onClick: function (e) {

                        $scope.entity.User = $rootScope.userTitle;

                        $scope.loadingVisible = true;
                        flightBagService.saveDR($scope.entity).then(function (response2) {
                            $scope.loadingVisible = false;
                            if (response2.IsSuccess) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                console.log('DR', response2.Data);
                                $scope.popup_add_visible = false;
                            }


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



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



    /////////////////////////////////

    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        console.log($scope.tempData.FlightId)

        $scope.entity.FlightId = $scope.tempData.FlightId;

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

            console.log(response2)

                $scope.loadingVisible = false;
                $scope.flight = response2.Data;
            //    $scope.isEditable = (diff <= 24);
             
                if (!response2.Data) {

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
                    if (response2.Data.JLSignedBy) {
                        $scope.isEditable = false;
                        $scope.url_sign4 = signFiles + response2.Data.PICId + ".jpg";
                        $scope.PIC4 = response2.Data.PIC;
                        $scope.signDate4 = moment(new Date(response2.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                    }
                    if (response2.Data.Alert) {
                        General.Confirm("The document updated by " + response2.Data.Alert + ". Would you like to get edited report?", function (res) {
                            if (res) {

                                //var dto = { Id: $scope.ati_flight.ID, };
                                $scope.loadingVisible = true;
                                flightBagService.epReplaceDR(response2.Data.server).then(function (res) {

                                    $scope.isNew = false;
                                    $scope.fill(res);
                                    $scope.loadingVisible = false;


                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                            else {
                                $scope.$apply(function () {
                                    $scope.isNew = false;


                                    $scope.fill(response2.Data);
                                });

                            }
                        });
                    }
                    else {

                        $scope.isNew = false;
                        $scope.fill(response2.Data);
                    }
                }

                //console.log('ASR',response2.Data);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





       // }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.scroll_dradd_height = '100%';
    $scope.scroll_dradd = {
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
            height: 'scroll_dradd_height'
        }

    };
    /////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'dr')
            flightBagService.signDocLocal(prms, prms.doc).then(function (response) {
                $scope.isEditable = false;
                $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitDrAdd', function (event, prms) {

        
        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);