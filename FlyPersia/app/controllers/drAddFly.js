'use strict';
app.controller('drAddFlyController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', 'flightBagService', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window, flightBagService) {
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
       
        bindingOptions: {
            value: 'entity.ActualWXDSP',
        }
    };

    $scope.chb_ActualWXCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ActualWXCPT',
        }
    };

    $scope.txt_ActualWXCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ActualWXCPTRemark',
        }
    };

    $scope.chb_WXForcastDSP = {
        text: '',
     
        bindingOptions: {
            value: 'entity.WXForcastDSP',
        }
    };

    $scope.chb_WXForcastCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WXForcastCPT',
        }
    };

    $scope.txt_WXForcastCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WXForcastCPTRemark',
        }
    };

    $scope.chb_SigxWXDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.SigxWXDSP',
        }
    };

    $scope.chb_SigxWXCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.SigxWXCPT',
        }
    };

    $scope.txt_SigxWXCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.SigxWXCPTRemark',
        }
    };

    $scope.chb_WindChartDSP = {
        text: '',
       
        bindingOptions: {
            value: 'entity.WindChartDSP',
        }
    };

    $scope.chb_WindChartCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WindChartCPT',
        }
    };

    $scope.txt_WindChartCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.WindChartCPTRemark',
        }
    };

    $scope.chb_NotamDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.NotamDSP',
        }
    };

    $scope.chb_NotamCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.NotamCPT',
        }
    };

    $scope.txt_NotamCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.NotamCPTRemark',
        }
    };

    $scope.chb_ComputedFligthPlanDSP = {
        text: '',
       
        bindingOptions: {
            value: 'entity.ComputedFligthPlanDSP',
        }
    };

    $scope.chb_ComputedFligthPlanCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ComputedFligthPlanCPT',
        }
    };

    $scope.txt_ComputedFligthPlanCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ComputedFligthPlanCPTRemark',
        }
    };

    $scope.chb_ATCFlightPlanDSP = {
        text: '',
       
        bindingOptions: {
            value: 'entity.ATCFlightPlanDSP',
        }
    };

    $scope.chb_ATCFlightPlanCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ATCFlightPlanCPT',
        }
    };

    $scope.txt_ATCFlightPlanCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.ATCFlightPlanCPTRemark',
        }
    };

    $scope.chb_PermissionsDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.PermissionsDSP',
        }
    };

    $scope.chb_PermissionsCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PermissionsCPT',
        }
    };

    $scope.txt_PermissionsCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PermissionsCPTRemark',
        }
    };

    $scope.chb_JeppesenAirwayManualDSP = {
        text: '',
         
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualDSP',
        }
    };

    $scope.chb_JeppesenAirwayManualCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualCPT',
        }
    };

    $scope.txt_JeppesenAirwayManualCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.JeppesenAirwayManualCPTRemark',
        }
    };

    $scope.chb_MinFuelRequiredDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.MinFuelRequiredDSP',
        }
    };

    $scope.chb_MinFuelRequiredCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.MinFuelRequiredCPT',
        }
    };
    //dool
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
        //readOnly:true,
        bindingOptions: {
            value: 'entity.MinFuelRequiredPilotReq',
        }
    };

    $scope.chb_GeneralDeclarationDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.GeneralDeclarationDSP',
        }
    };

    $scope.chb_GeneralDeclarationCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GeneralDeclarationCPT',
        }
    };

    $scope.txt_GeneralDeclarationCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GeneralDeclarationCPTRemark',
        }
    };

    $scope.chb_FlightReportDSP = {
        text: '',
       
        bindingOptions: {
            value: 'entity.FlightReportDSP',
        }
    };

    $scope.chb_FlightReportCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightReportCPT',
        }
    };

    $scope.txt_FlightReportCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightReportCPTRemark',
        }
    };

    $scope.chb_TOLndCardsDSP = {
        text: '',
       
        bindingOptions: {
            value: 'entity.TOLndCardsDSP',
        }
    };

    $scope.chb_TOLndCardsCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.TOLndCardsCPT',
        }
    };

    $scope.txt_TOLndCardsCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.TOLndCardsCPTRemark',
        }
    };

    $scope.chb_LoadSheetDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.LoadSheetDSP',
        }
    };

    $scope.chb_LoadSheetCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.LoadSheetCPT',
        }
    };

    $scope.txt_LoadSheetCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.LoadSheetCPTRemark',
        }
    };

    $scope.chb_FlightSafetyReportDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.FlightSafetyReportDSP',
        }
    };

    $scope.chb_FlightSafetyReportCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightSafetyReportCPT',
        }
    };

    $scope.txt_FlightSafetyReportCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.FlightSafetyReportCPTRemark',
        }
    };


    $scope.chb_AVSECIncidentReportDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.AVSECIncidentReportDSP',
        }
    };

    $scope.chb_AVSECIncidentReportCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.AVSECIncidentReportCPT',
        }
    };

    $scope.txt_AVSECIncidentReportCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.AVSECIncidentReportCPTRemark',
        }
    };

    $scope.chb_OperationEngineeringDSP = {
        text: '',
      
        bindingOptions: {
            value: 'entity.OperationEngineeringDSP',
        }
    };

    $scope.chb_OperationEngineeringCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.OperationEngineeringCPT',
        }
    };

    $scope.txt_OperationEngineeringCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.OperationEngineeringCPTRemark',
        }
    };

    $scope.chb_VoyageReportDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.VoyageReportDSP',
        }
    };

    $scope.chb_VoyageReportCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.VoyageReportCPT',
        }
    };

    $scope.txt_VoyageReportCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.VoyageReportCPTRemark',
        }
    };

    $scope.chb_PIFDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.PIFDSP',
        }
    };

    $scope.chb_PIFCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PIFCPT',
        }
    };

    $scope.txt_PIFCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.PIFCPTRemark',
        }
    };

    $scope.txt_GoodDeclarationCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GoodDeclarationCPTRemark',
        }
    };

    $scope.chb_GoodDeclarationDSP = {
        text: '',
         
        bindingOptions: {
            value: 'entity.GoodDeclarationDSP',
        }
    };

    $scope.chb_GoodDeclarationCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GoodDeclarationCPT',
        }
    };

    $scope.GoodDeclarationCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.GoodDeclarationCPTRemark',
        }
    };

    $scope.chb_IPADDSP = {
        text: '',
        
        bindingOptions: {
            value: 'entity.IPADDSP',
        }
    };

    $scope.chb_IPADCPT = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.IPADCPT',
        }
    };

    $scope.txt_IPADCPTRemark = {
        text: '',
        readOnly: true,
        bindingOptions: {
            value: 'entity.IPADCPTRemark',
        }
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
                        //12-06
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

                        $scope.entity.ActualWXDSP = true;
                        $scope.entity.WXForcastDSP = true;
                        $scope.entity.SigxWXDSP = true;
                        $scope.entity.WindChartDSP = true;
                        $scope.entity.NotamDSP = true;
                        $scope.entity.ComputedFligthPlanDSP = true;
                        $scope.entity.ATCFlightPlanDSP = true;
                        $scope.entity.IPADDSP = true;
                        $scope.entity.VoyageReportDSP = true;
                        $scope.entity.MinFuelRequiredDSP = true;
                        $scope.entity.TOLndCardsDSP = true;
                        $scope.entity.LoadSheetDSP = true;
                        $scope.entity.PIFDSP = true;
                        $scope.entity.FlightSafetyReportDSP = true;
                        $scope.entity.PermissionsDSP = true;
                        $scope.entity.GeneralDeclarationDSP = true;
                        $scope.entity.GoodDeclarationDSP = true;



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'dradd', onClick: function (e) {
                        //12-06
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
            $scope.entity = {
                Id: -1,
                ActualWXDSP: false,
                WXForcastDSP: false,
                SigxWXDSP: false,
                WindChartDSP: false,
                NotamDSP: false,
                ComputedFligthPlanDSP: false,
                ATCFlightPlanDSP: false,
                IPADDSP: false,
                VoyageReportDSP: false,
                MinFuelRequiredDSP: false,
                TOLndCardsDSP: false,
                LoadSheetDSP: false,
                PIFDSP: false,
                FlightSafetyReportDSP: false,
                PermissionsDSP: false,
                GeneralDeclarationDSP: false,
                GoodDeclarationDSP: false,


                ActualWXCPT: false,
                ActualWXCPTRemark: null,
                WXForcastCPT: false,
                WXForcastCPTRemark: null,
                SigxWXCPT: false,
                SigxWXCPTRemark: null,
                WindChartCPT: false,
                WindChartCPTRemark: null,
                NotamCPT: false,
                NotamCPTRemark: null,
                ComputedFligthPlanCPT: false,
                ComputedFligthPlanCPTRemark: null,
                ATCFlightPlanCPT: false,
                ATCFlightPlanCPTRemark: null,
                PermissionsCPT: false,
                PermissionsCPTRemark: null,
                JeppesenAirwayManualCPT: false,
                JeppesenAirwayManualCPTRemark: null,
                MinFuelRequiredCPT: null,
                MinFuelRequiredCFP: null,
                MinFuelRequiredPilotReq: null,
                GeneralDeclarationCPT: false,
                GeneralDeclarationCPTRemark: null,
                FlightReportCPT: false,
                FlightReportCPTRemark: null,
                TOLndCardsCPT: false,
                TOLndCardsCPTRemark: null,
                LoadSheetCPT: false,
                LoadSheetCPTRemark: null,
                FlightSafetyReportCPT: false,
                FlightSafetyReportCPTRemark: null,
                AVSECIncidentReportCPT: false,
                AVSECIncidentReportCPTRemark: null,
                OperationEngineeringCPT: false,
                OperationEngineeringCPTRemark: null,
                VoyageReportCPT: false,
                VoyageReportCPTRemark: null,
                PIFCPT: false,
                PIFCPTRemark: null,
                GoodDeclarationCPTRemark: null,
                GoodDeclarationCPT: false,
                GoodDeclarationCPTRemark: null,
                IPADCPT: false,
                IPADCPTRemark: null,


                 
            };


            $scope.url_sign = null;
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
            fullScreen: 'false',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isLockVisible',
            'toolbarItems[1].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };



    /////////////////////////////////

    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.isEditable = true;
        if ($scope.isReport) {
            $scope.isLockVisible = false;
            $scope.isEditable = false;
        }
        var fid = $scope.entity.FlightId;
        if (!data || data.Id == -1) {
             
            $scope.entity = {
                Id: -1,
                FlightId: fid,
                ActualWXDSP: false,
                WXForcastDSP: false,
                SigxWXDSP: false,
                WindChartDSP: false,
                NotamDSP: false,
                ComputedFligthPlanDSP: false,
                ATCFlightPlanDSP: false,
                IPADDSP: false,
                VoyageReportDSP: false,
                MinFuelRequiredDSP: false,
                TOLndCardsDSP: false,
                LoadSheetDSP: false,
                PIFDSP: false,
                FlightSafetyReportDSP: false,
                PermissionsDSP: false,
                GeneralDeclarationDSP: false,
                GoodDeclarationDSP: false,


                ActualWXCPT: false,
                ActualWXCPTRemark: null,
                WXForcastCPT: false,
                WXForcastCPTRemark: null,
                SigxWXCPT: false,
                SigxWXCPTRemark: null,
                WindChartCPT: false,
                WindChartCPTRemark: null,
                NotamCPT: false,
                NotamCPTRemark: null,
                ComputedFligthPlanCPT: false,
                ComputedFligthPlanCPTRemark: null,
                ATCFlightPlanCPT: false,
                ATCFlightPlanCPTRemark: null,
                PermissionsCPT: false,
                PermissionsCPTRemark: null,
                JeppesenAirwayManualCPT: false,
                JeppesenAirwayManualCPTRemark: null,
                MinFuelRequiredCPT: null,

                MinFuelRequiredCFP: data.MinFuelRequiredCFP   ,
                MinFuelRequiredPilotReq: data.MinFuelRequiredPilotReq,

                GeneralDeclarationCPT: false,
                GeneralDeclarationCPTRemark: null,
                FlightReportCPT: false,
                FlightReportCPTRemark: null,
                TOLndCardsCPT: false,
                TOLndCardsCPTRemark: null,
                LoadSheetCPT: false,
                LoadSheetCPTRemark: null,
                FlightSafetyReportCPT: false,
                FlightSafetyReportCPTRemark: null,
                AVSECIncidentReportCPT: false,
                AVSECIncidentReportCPTRemark: null,
                OperationEngineeringCPT: false,
                OperationEngineeringCPTRemark: null,
                VoyageReportCPT: false,
                VoyageReportCPTRemark: null,
                PIFCPT: false,
                PIFCPTRemark: null,
                GoodDeclarationCPTRemark: null,
                GoodDeclarationCPT: false,
                GoodDeclarationCPTRemark: null,
                IPADCPT: false,
                IPADCPTRemark: null,
            };
        }
        else
            $scope.entity = data;

        //$scope.fillFuel();

    };
    $scope.isLockVisible = false;
    //12-06
    //$scope.fillFuel = function () {
    //    return;
    //    //$scope.flight 
    //    // alert($scope.flight.FuelRemaining);
    //    // alert($scope.flight.FuelUplift);
    //    if ((!$scope.flight.FuelRemaining && $scope.flight.FuelRemaining !== 0) || (!$scope.flight.FuelUplift && $scope.flight.FuelUplift !== 0)) {
    //        $scope.entity.MinFuelRequiredPilotReq = null;
    //        return;
    //    }
    //    var remaining = $scope.flight.FuelRemaining ? Number($scope.flight.FuelRemaining) : 0;
    //    var uplift = $scope.flight.FuelUplift ? Number($scope.flight.FuelUplift) : 0;
    //    var total = remaining + uplift;
    //    $scope.entity.MinFuelRequiredPilotReq = total;
    //};

    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;
        $scope.loadingVisible = true;

        flightBagService.epGetDRByFlight($scope.entity.FlightId).then(function (response2) {

            $scope.loadingVisible = false;
            console.log('sdfsdfsfsdfsdfs',response2);
            $scope.fill(response2.Data);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope._bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;

        if ($rootScope.getOnlineStatus()) {
            $rootScope.checkInternet(function (st) {
                if (st) {
                    flightService.checkLock($scope.entity.FlightId, 'dr').then(function (response) {
                        $scope.isLockVisible = false;
                        if (response.IsSuccess && response.Data.canLock) {
                            $scope.isLockVisible = true;
                        }
                    }, function (err) { });
                }
                else {
                    General.ShowNotifyBottom("The application cannot connect to the Server. Please check your internet connection.", 'error');
                }
            });

        }

        $scope.loadingVisible = true;

        flightService.epGetFlightLocal($scope.entity.FlightId).then(function (response) {

            $scope.loadingVisible = false;
            var diff = Math.abs((new Date()).getTime() - (new Date(response.Data.STALocal)).getTime()) / 3600000;

            $scope.flight = response.Data;

            $scope.loadingVisible = true;

            flightService.epGetDRByFlight($scope.entity.FlightId).then(function (response2) {

                $scope.loadingVisible = false;


                $scope.isEditable = true;//(diff <= 24);


                if (!response2.Data) {

                    $scope.entity.Id = -1;
                    $scope.isNew = true;

                    $scope.entity.FlightId = $scope.tempData.FlightId;
                    //$scope.fillFuel();
                }
                else {
                    if (response2.Data.JLSignedBy) {
                        //$scope.isEditable = false;

                        $scope.url_sign = signFiles + response.Data.PICId + ".jpg";
                        $scope.PIC = response2.Data.PIC;
                        $scope.signDate = moment(new Date(response2.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                    }
                    if (response2.Data.Alert) {
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
                }

                //console.log('ASR',response2.Data);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





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
    $scope.$on('InitDrAdd', function (event, prms) {

        $scope.isReport = false;

        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });
    $scope.isReport = false;
    $scope.$on('InitDrAddReadOnly', function (event, prms) {



        $scope.tempData = null;

        $scope.tempData = prms;

        $scope.isReport = true;
        $scope.popup_add_visible = true;

    });

}]);