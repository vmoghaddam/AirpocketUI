'use strict';
app.controller('drAddController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = true;
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

    $scope.txt_MinFuelRequiredCFP = {
        min: 0,
        readOnly: true,
        bindingOptions: {
            value: 'entity.MinFuelRequiredCFP',
        }
    };

    $scope.txt_MinFuelRequiredPilotReq = {
        min: 0,
        readOnly: true,
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



    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_add_title = 'Dispatch Release';
    $scope.popup_instance = null;
    $scope.dummy = true;
    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {
                        //12-06
                        if (!$scope.entity.MinFuelRequiredPilotReq) {
                            General.ShowNotify("The 'Pilot Requested Fuel' field can not be empty.", 'error');
                            return;
                        }
                        //if (!$scope.signed_by_dsp){
                        //	General.ShowNotify("The form has not been signed by a trusted dispatcher.", 'error');
                        //	return;
                        //}
                        if ($rootScope.getOnlineStatus()) {
                            $rootScope.checkInternet(function (st) {
                                if (st) {
                                    $scope.entity.User = $rootScope.userTitle;

                                    $scope.loadingVisible = true;
                                    flightService.saveDR($scope.entity).then(function (response2) {

                                        $scope.loadingVisible = false;
                                        if (response2.IsSuccess) {
                                            ////////////////////
                                            var data = { FlightId: $scope.entity.FlightId, documentType: 'dr' };

                                            $rootScope.$broadcast('InitSignAdd', data);
                                            ///////////////////////////

                                        } else General.ShowNotify("An error occurred in  saving Dispatch Release Form.", 'error');


                                    }, function (err) {
                                        $scope.loadingVisible = false;
                                        General.ShowNotify("An error occurred in  saving Dispatch Release Form.", 'error');
                                        General.ShowNotify(JSON.stringify(err), 'error');
                                    });

                                }
                                else {
                                    General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                                }
                            });
                            //$scope.entity.Id

                        }
                        else {
                            General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Check All', icon: 'check', onClick: function (e) {

                        $scope.entity.ActualWXCPT = true;
                        $scope.entity.WXForcastCPT = true;
                        $scope.entity.SigxWXCPT = true;
                        $scope.entity.WindChartCPT = true;
                        $scope.entity.NotamCPT = true;
                        $scope.entity.ComputedFligthPlanCPT = true;
                        $scope.entity.ATCFlightPlanCPT = true;
                        $scope.entity.PermissionsCPT = true;
                        $scope.entity.JeppesenAirwayManualCPT = true;
                        $scope.entity.MinFuelRequiredCPT = true;
                        $scope.entity.GeneralDeclarationCPT = true;
                        $scope.entity.FlightReportCPT = true;
                        $scope.entity.TOLndCardsCPT = true;
                        $scope.entity.LoadSheetCPT = true;
                        $scope.entity.FlightSafetyReportCPT = true;
                        $scope.entity.AVSECIncidentReportCPT = true;
                        $scope.entity.OperationEngineeringCPT = true;
                        $scope.entity.VoyageReportCPT = true;
                        $scope.entity.PIFCPT = true;
                        $scope.entity.GoodDeclarationCPT = true;
                        $scope.entity.IPADCPT = true;


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'dradd', onClick: function (e) {

                        $scope.entity.User = $rootScope.userTitle;
                        /*if (!$scope.entity.MinFuelRequiredPilotReq && $scope.entity.MinFuelRequiredPilotReq !== 0) {
                                      General.ShowNotify('The PILOT REQUESTED FUEL field is empty.Please fill Fuel Information in the first flight log.', 'error');
                                      return;
                                  }*/
                        $scope.loadingVisible = true;
                        flightService.saveDR($scope.entity).then(function (response2) {
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
            $rootScope.$broadcast('onDrAddHide', null);
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
            'toolbarItems[0].visible': 'dummy', //'isLockVisible',
            'toolbarItems[1].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };



    /////////////////////////////////

    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
        //alert($scope.entity.MinFuelRequiredPilotReq);

        $scope.fillFuel();

    };
    $scope.isLockVisible = false;
    //12-06
    $scope.fillFuel = function () {
        return;
        //$scope.flight 
        // alert($scope.flight.FuelRemaining);
        // alert($scope.flight.FuelUplift);
        if ((!$scope.flight.FuelRemaining && $scope.flight.FuelRemaining !== 0) || (!$scope.flight.FuelUplift && $scope.flight.FuelUplift !== 0)) {
            $scope.entity.MinFuelRequiredPilotReq = null;
            return;
        }
        var remaining = $scope.flight.FuelRemaining ? Number($scope.flight.FuelRemaining) : 0;
        var uplift = $scope.flight.FuelUplift ? Number($scope.flight.FuelUplift) : 0;
        var total = remaining + uplift;
        // $scope.entity.MinFuelRequiredPilotReq = total;
    };

    $scope.bind = function () {
        $scope.signed_by_dsp = false;
        $scope.DSP = ".";
        $scope.DSP_Lic = ".";
        $scope.signDate_dsp = ".";
        $scope.PIC = ".";
        $scope.PIC_Lic = ".";
        $scope.signDate = ".";


        $scope.entity.FlightId = $scope.tempData.FlightId;

        $scope.loadingVisible = true;

        flightService.epGetDRByFlight($scope.entity.FlightId).then(function (response2) {

            $scope.loadingVisible = false;

            $scope.isEditable = (diff <= 24);


            if (response2.Data.JLDSPSignDate) {
                //$scope.isEditable = false;
                $scope.signed_by_dsp = true;
                $scope.url_sign_dsp = $rootScope.is_sign_img_visible ? signFiles + response.Data.DispatcherId + ".jpg" : null;
                $scope.DSP = response2.Data.SGNDSPName;
                $scope.DSP_Lic = response2.Data.SgnDSPLicNo;
                $scope.signDate_dsp = moment(new Date(response2.Data.JLDSPSignDate)).format('YYYY-MM-DD HH:mm');
            }

            if (response2.Data.JLDatePICApproved) {
                //$scope.isEditable = false;

                $scope.url_sign = $rootScope.is_sign_img_visible ? signFiles + response.Data.PICId + ".jpg" : null;
                $scope.PIC = response2.Data.PIC;
                $scope.PIC_Lic = response2.Data.SgnCPTLicNo;
                $scope.signDate = moment(new Date(response2.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }
            /*if (response2.Data.Alert) {
                General.Confirm("The document updated by " + response2.Data.Alert + ". Would you like to get edited report?", function (res) {
                    if (res) {

                        //var dto = { Id: $scope.ati_flight.ID, };
                        $scope.loadingVisible = true;
                        flightService.epReplaceDR(response2.Data.server).then(function (res) {

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
            */
            $scope.isNew = false;
            $scope.fill(response2.Data);


            //console.log('ASR',response2.Data);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




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
    //2023-12-09
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'dr')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = $rootScope.is_sign_img_visible ? signFiles + prms.PICId + ".jpg" : null;
                $scope.PIC = prms.PIC;
                $scope.PIC_Lic = prms.SgnCPTLicNo;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');





            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitDrAdd', function (event, prms) {



        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);