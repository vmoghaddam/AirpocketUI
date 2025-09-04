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
        readOnly: false,
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
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

    $scope.sb_briefing = {
        dataSource: [
            { text: 'Yes', value: true },
            { text: 'No', value: false }
        ],
        valueExpr: 'value',
        displayExpr: 'text',
        placeholder: '',
        bindingOptions: {
            value: 'entity.OperationalFlightPlanFOO'
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



    /////////////////////////////////

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
                $scope.signTime4 = '';
                $scope.PIC = '';
                $scope.signDatePIC = '';
                if (response2.JLDSPSignDate) {
                    $scope.isEditable = false;
                    $scope.url_sign4 = signFiles + response2.DispatcherId + ".jpg";

                    $scope.PIC4 = response2.PIC;
                    $scope.signDate4 = moment(new Date(response2.JLDSPSignDate)).format('YYYY-MM-DD HH:mm');
                    $scope.signTime4 = moment(new Date(response2.JLDSPSignDate)).format('YYYY-MM-DD HH:mm');
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
    ////////////////////////////////



    $scope.sgn_name = '';
    $scope.txt_name = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'sgn_name',

        }
    };
    $scope.sgn_lic = '';
    $scope.txt_licno = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'sgn_lic',

        }
    };
    $scope.popup_dr_sign_visible = false;
    $scope.popup_dr_sign = {

        width: 300,
        height: 230,
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'drsign', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {};
                        dto.flight_id = $scope.tempData.FlightId;
                        dto.lic_no = $scope.sgn_lic;
                        dto.user_id = $rootScope.userId;

                        $scope.loadingVisible = true;
                        flightBagService.signDr(dto).then(function (response2) {
                            $scope.loadingVisible = false;
                            if (response2.done) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');

                                $scope.popup_dr_sign_visible = false;
                            }
                            else {
                                General.ShowNotify(response2.message, 'error');
                            }


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_dr_sign_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            //  $scope.popup_dr_sign_instance.repaint();


        },
        onShown: function (e) {



        },
        onHiding: function () {

            //$scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onDrAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_dr_sign_instance)
                $scope.popup_dr_sign_instance = e.component;

        },
        isFullScreen: false,
        bindingOptions: {
            visible: 'popup_dr_sign_visible',



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