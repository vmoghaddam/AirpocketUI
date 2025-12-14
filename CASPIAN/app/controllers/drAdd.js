'use strict';
app.controller('drAddController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', 'flightBagService', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window, flightBagService) {
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = true;
    $scope.isEditable = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        ATSFlightPlanFOO: false,
        ATSFlightPlanCMDR: false,
        MinFuelRequiredDSP: false,
        MinFuelRequiredCPT: false,
        GeneralDeclarationDSP: false,
        GeneralDeclarationCPT: false,
        LoadSheetDSP: false,
        LoadSheetCPT: false,
        IPADDSP: false,
        IPADCPT: false,
        VldEFBFOO: false,
        VldEFBCMDR: false,
        VldFlightCrewCMDR: false,
        VldMedicalCMDR: false,
        VldPassportCMDR: false,
        VldCMCCMDR: false,
        VldRampPassCMDR: false,
        OperationalFlightPlanFOO: false,
        OperationalFlightPlanCMDR: false
    };



    $scope.chb_OFPFOO = {
        bindingOptions: {
            value: 'entity.OperationalFlightPlanFOO',
        }
    };

    $scope.chb_OFPCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.OperationalFlightPlanCMDR',
        }
    };

    $scope.txt_OFPRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.OperationalFlightPlanCMDRRemark',
        }
    };


    $scope.chb_ATSFPFOO = {
        text: '',
        bindingOptions: {
            value: 'entity.ATSFlightPlanFOO',
        }
    };

    $scope.chb_ATSFPCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.ATSFlightPlanCMDR',
        }
    };

    $scope.txt_ATSFPRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.ATSFlightPlanFOORemark',
        }
    };


    $scope.chb_ValidEFBFOO = {
        text: '',
        bindingOptions: {
            value: 'entity.VldEFBFOO',
        }
    };

    $scope.chb_ValidEFBCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldEFBCMDR',
        }
    };

    $scope.txt_ValidEFBRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldEFBCMDRRemark',
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

    $scope.chb_LoadSheetDSP = {
        text: '',
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


    $scope.chb_PersonalIpadFOO = {
        text: '',
        bindingOptions: {
            value: 'entity.IPADDSP',
        }
    };

    $scope.chb_PersonalIpadCMDR = {
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

    $scope.chb_FlightCrewCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldFlightCrewCMDR',
        }
    };

    $scope.txt_FlightCrewRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldFlightCrewCMDRRemark',
        }
    };


    $scope.chb_FlightCrewCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldFlightCrewCMDR',
        }
    };

    $scope.txt_FlightCrewRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldFlightCrewCMDRRemark',
        }
    };



    $scope.chb_MedicalCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldMedicalCMDR',
        }
    };

    $scope.txt_MedicalRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldMedicalCMDRRemark',
        }
    };


    $scope.chb_PassportCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldPassportCMDR',
        }
    };

    $scope.txt_PassportRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldPassportCMDRRemark',
        }
    };


    $scope.chb_CrewMemberCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldCMCCMDR',
        }
    };

    $scope.txt_CrewMemberCMDRRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldCMCCMDRRemark',
        }
    };


    $scope.chb_RampPassCMDR = {
        text: '',
        bindingOptions: {
            value: 'entity.VldRampPassCMDR',
        }
    };

    $scope.txt_RampPassRemark = {
        text: '',
        bindingOptions: {
            value: 'entity.VldRampPassCMDRRemark',
        }
    };


  $scope.txt_licno = {
        text: '',
        bindingOptions: {
            value: 'sgn_lic',
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
                        // if ($rootScope.getOnlineStatus()) {
                            // $rootScope.checkInternet(function (st) {
                                // if (st) {
                                    // $scope.entity.User = $rootScope.userTitle;

                                    // $scope.loadingVisible = true;
                                    // flightService.saveDR($scope.entity).then(function (response2) {
                                        // $scope.loadingVisible = false;
                                        // if (response2.IsSuccess) {
                                            // ////////////////////
                                            // var data = { FlightId: $scope.entity.FlightId, documentType: 'dr' };

                                            // $rootScope.$broadcast('InitSignAdd', data);
                                            // ///////////////////////////

                                        // } else General.ShowNotify("An error occurred in  saving Dispatch Release Form.", 'error');


                                    // }, function (err) {
                                        // $scope.loadingVisible = false;
                                        // General.ShowNotify("An error occurred in  saving Dispatch Release Form.", 'error');
                                        // General.ShowNotify(JSON.stringify(err), 'error');
                                    // });

                                // }
                                // else {
                                    // General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                                // }
                            // });
                            // //$scope.entity.Id

                        // }
                        // else {
                            // General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        // }
						
							$scope.save(1,function(){
								console.log("test test");
					$scope.popup_dr_sign_visible=true;
				});

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Check All', icon: 'check', onClick: function (e) {


                        $scope.entity.ATSFlightPlanFOO = true;
                        $scope.entity.ATSFlightPlanCMDR = true;
                        $scope.entity.MinFuelRequiredDSP = true;
                        $scope.entity.MinFuelRequiredCPT = true;
                        $scope.entity.GeneralDeclarationDSP = true;
                        $scope.entity.GeneralDeclarationCPT = true;
                        $scope.entity.LoadSheetDSP = true;
                        $scope.entity.LoadSheetCPT = true;
                        $scope.entity.IPADDSP = true;
                        $scope.entity.IPADCPT = true;
                        $scope.entity.VldEFBFOO = true;
                        $scope.entity.VldEFBCMDR = true;
                        $scope.entity.VldFlightCrewCMDR = true;
                        $scope.entity.VldMedicalCMDR = true;
                        $scope.entity.VldPassportCMDR = true;
                        $scope.entity.VldCMCCMDR = true;
                        $scope.entity.VldRampPassCMDR = true;
                        $scope.entity.OperationalFlightPlanFOO = true;
                        $scope.entity.OperationalFlightPlanCMDR = true;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'dradd', onClick: function (e) {
                        //12-06
										// $scope.entity.User = $rootScope.userTitle;

										// $scope.loadingVisible = true;
										// flightBagService.saveDR($scope.entity).then(function (response2) {
											// $scope.loadingVisible = false;
											// if (response2.IsSuccess) {
												// General.ShowNotify(Config.Text_SavedOk, 'success');
												// console.log('DR', response2.Data);
												// $scope.popup_add_visible = false;
											// }


										// }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
                ATSFlightPlanFOO: false,
        ATSFlightPlanCMDR: false,
        MinFuelRequiredDSP: false,
        MinFuelRequiredCPT: false,
        GeneralDeclarationDSP: false,
        GeneralDeclarationCPT: false,
        LoadSheetDSP: false,
        LoadSheetCPT: false,
        IPADDSP: false,
        IPADCPT: false,
        VldEFBFOO: false,
        VldEFBCMDR: false,
        VldFlightCrewCMDR: false,
        VldMedicalCMDR: false,
        VldPassportCMDR: false,
        VldCMCCMDR: false,
        VldRampPassCMDR: false,
        OperationalFlightPlanFOO: false,
        OperationalFlightPlanCMDR: false
            };

$scope.PIC = null;
						$scope.SgnCPTLicNo = null;
                        $scope.signDate =null;
                    
                        $scope.DSP = null;
						$scope.DSP_Lic=null;
                        $scope.signDate_dsp = null;
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
            //'toolbarItems[0].visible': 'isLockVisible',
            'toolbarItems[1].visible': 'isEditable',
            'toolbarItems[2].visible': 'true',

        }
    };




    /////////////////////////////////

$scope.save=function(prm,callback){
	$scope.entity.User = $rootScope.userTitle;

                    $scope.loadingVisible = true;
                    flightBagService.saveDR($scope.entity).then(function (response2) {
                        $scope.loadingVisible = false;
                        if (response2.IsSuccess) {
                           
                            console.log('DR', response2.Data);
                            if (prm==0)
							{
								 General.ShowNotify(Config.Text_SavedOk, 'success');
								$scope.popup_add_visible = false;
						
						    }
						    else callback();
                        }


                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
	
};
	

    $scope.flight = null;
    $scope.fill = function (data) {
        console.log(data);
        $scope.entity = data;
        console.log('----entity-----', $scope.entity);
       // $scope.fillFuel();

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
            console.log(response2);
            $scope.fill(response2);
			
			 if (response2.JLSignedBy) {
                        //$scope.isEditable = false;

                        $scope.PIC = response2.JLSignedBy;
						$scope.SgnCPTLicNo = response2.SgnCPTLicNo;
                        $scope.signDate = moment(new Date(response2.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                    }
					                    if (response2.JLDSPSignDate) {
                        //$scope.isEditable = false;
$scope.signed_by_dsp=true;
                        $scope.DSP = response2.SGNDSPName;
						$scope.DSP_Lic=response2.SgnDSPLicNo;
                        $scope.signDate_dsp = moment(new Date(response2.JLDSPSignDate)).format('YYYY-MM-DD HH:mm');
                    }

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
	
	$scope.popup_dr_sign_visible=false;
$scope.popup_dr_sign = {

    width:300,
	height:230,
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
                     var dto={};
					dto.flight_id=$scope.tempData.FlightId;
					dto.lic_no=$scope.sgn_lic;
					dto.user_id=$rootScope.userName;

                    $scope.loadingVisible = true;
                    flightBagService.signDr(dto).then(function (response2) {
                        $scope.loadingVisible = false;
                        if (response2.done) {
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                             
                            $scope.popup_dr_sign_visible = false;
                        }
						else
						{
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
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
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