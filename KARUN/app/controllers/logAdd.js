'use strict';
app.controller('logAddController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', '$q', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window,$q) {
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    var detector = new MobileDetect(window.navigator.userAgent);
    
    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = true;
    
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
    }
    ///////////////////////////
    $scope.updateServer = function () {
        $scope.loadingVisible = true;
        flightBagService.epSaveLog($scope.dto).then(function (response) {
            $scope.loadingVisible = false;

            if (response.IsSuccess) {
                General.ShowNotify(Config.Text_SavedOk, 'success');
                $rootScope.$broadcast('onFlightLocgSaved', response.Data);
                $scope.popup_add_visible = false;
            }
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.updateLocal = function () {
        $scope.dto.Server = false;
        $scope.loadingVisible = true;
        flightBagService.epSaveLog($scope.dto).then(function (response) {
            $scope.loadingVisible = false;

            if (response.IsSuccess) {
                General.ShowNotify(Config.Text_SavedOk, 'success');
                $rootScope.$broadcast('onFlightLocgSaved', response.Data);
                $scope.popup_add_visible = false;
            }
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.syncFlight = function () {
        $scope.loadingVisible = true;
        flightBagService.epSyncFlight($scope.checkResult).then(function (response) {
            $scope.loadingVisible = false;

            if (response.IsSuccess) {
                General.ShowNotify(Config.Text_SavedOk, 'success');
                $rootScope.$broadcast('onFlightLocgSaved', response.Data);
                $scope.popup_add_visible = false;
            }
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////
    $scope.scrollStyle = {}; 

    $scope._saveServer = function () { };
    $scope._saveLocal = function () { };
    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_instance = null;
    $scope.popup_width = 700;
    $scope.popup_height = $(window).height() - 100;
    $scope.dto = null;
    $scope.popup_add = { 


        showTitle: true,

        toolbarItems: [

            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', visible: false, text: 'Local Save', icon: 'check', validationGroup: 'logadd'
                   
            //        , onClick: function (e) {
            //            //var result = e.validationGroup.validate();

            //            // if (!result.isValid) {
            //            //     General.ShowNotify(Config.Text_FillRequired, 'error');
            //            //     return;
            //            // }
            //            $scope.dto = { Server: true };
            //            $scope.dto.FlightId = $scope.entity.FlightId;
            //            $scope.dto.CrewId = $scope.entity.CrewId;
            //            $scope.dto.DelayBlockOff = null;
            //            $scope.dto.BlockTime = null;
            //            $scope.dto.FlightTime = null;
            //            if ($scope.blockOff) {
            //                $scope.dto.BlockOffDate = momentFromatFroServerUTC((new Date($scope.blockOff)).combineDate(new Date($scope.entity.STDDay), $scope.blockOffD));
            //                $scope.dto.DelayBlockOff = getMinutesDiff($scope.entity.STD, $scope.blockOff);
            //            }
            //            if ($scope.blockOn)
            //                $scope.dto.BlockOnDate = momentFromatFroServerUTC((new Date($scope.blockOn)).combineDate(new Date($scope.entity.STDDay), $scope.blockOnD));
            //            if ($scope.takeOff)
            //                $scope.dto.TakeOffDate = momentFromatFroServerUTC((new Date($scope.takeOff)).combineDate(new Date($scope.entity.STDDay), $scope.takeOffD));
            //            if ($scope.landing)
            //                $scope.dto.LandingDate = momentFromatFroServerUTC((new Date($scope.landing)).combineDate(new Date($scope.entity.STDDay), $scope.landingD));

            //            if ($scope.blockOff && $scope.blockOn) {
            //                $scope.dto.BlockTime = getMinutesDiff($scope.blockOff, $scope.blockOn);
            //            }
            //            if ($scope.takeOff && $scope.landing) {
            //                $scope.dto.FlightTime = getMinutesDiff($scope.takeOff, $scope.landing);
            //            }

            //            $scope.dto.FuelRemaining = $scope.entity.FuelRemaining;
            //            $scope.dto.FuelUplift = $scope.entity.FuelUplift;
            //            $scope.dto.FuelUsed = $scope.entity.FuelUsed;
            //            $scope.dto.FuelDensity = $scope.entity.FuelDensity;
            //            $scope.dto.FuelTotal = $scope.entity.FuelRemaining && $scope.entity.FuelUplift ? $scope.entity.FuelRemaining + $scope.entity.FuelUplift:null;

            //            $scope.dto.PaxAdult = $scope.entity.PaxAdult;
            //            $scope.dto.PaxChild = $scope.entity.PaxChild;
            //            $scope.dto.PaxInfant = $scope.entity.PaxInfant;
            //            $scope.dto.PaxTotal = $scope.entity.PaxTotal; 

            //            $scope.dto.BaggageWeight = $scope.entity.BaggageWeight;
            //            $scope.dto.CargoWeight = $scope.entity.CargoWeight;

            //            $scope.dto.SerialNo = $scope.entity.SerialNo;
            //            $scope.dto.LTR = $scope.entity.LTR;
            //            $scope.dto.PF = $scope.entity.PF;

            //            $scope.dto.RVSM_GND_CPT = $scope.entity.RVSM_GND_CPT;
            //            $scope.dto.RVSM_GND_STBY = $scope.entity.RVSM_GND_STBY;
            //            $scope.dto.RVSM_GND_FO = $scope.entity.RVSM_GND_FO;

            //            $scope.dto.RVSM_FLT_CPT = $scope.entity.RVSM_FLT_CPT;
            //            $scope.dto.RVSM_FLT_STBY = $scope.entity.RVSM_FLT_STBY;
            //            $scope.dto.RVSM_FLT_FO = $scope.entity.RVSM_FLT_FO;

            //            $scope.dto.CommanderNote = $scope.entity.CommanderNote;
            //            $scope.dto.AttRepositioning1 = $scope.entity.AttRepositioning1;
            //            $scope.dto.AttRepositioning2 = $scope.entity.AttRepositioning2;

            //            $scope.dto.JLDate = momentUtcNow();
            //            $scope.dto.JLUserId = $scope.entity.CrewId;
            //            $scope.dto.Version = $scope.entity.Version + 1;
                         
            //             $scope.updateLocal();




            //        }
            //    }, toolbar: 'bottom'
            //},
            { 
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature',   onClick: function (e) {
                        if ($rootScope.getOnlineStatus()) {
                            //$scope.entity.Id
                            var data = { FlightId: $scope.entity.Id, documentType:'log' };

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
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'logadd', onClick: function (e) {
                        //var result = e.validationGroup.validate();

                        // if (!result.isValid) {
                        //     General.ShowNotify(Config.Text_FillRequired, 'error');
                        //     General.ShowNotify(Config.Text_FillRequired, 'error');
                        //     return;
                        // }
                         
                       
                        $scope.dto = {Server:true};
                        $scope.dto.FlightId = $scope.entity.FlightId;
                        $scope.dto.CrewId = $scope.entity.CrewId;
                       
                        $scope.dto.DelayBlockOff = null;
                        $scope.dto.BlockTime = null;
                        $scope.dto.FlightTime = null;
                        if ($scope.blockOff) {
                            $scope.dto.BlockOffDate = momentFromatFroServerUTC((new Date($scope.blockOff)).combineDate(new Date($scope.entity.STDDay), $scope.blockOffD));
                           
                            $scope.dto.DelayBlockOff = getMinutesDiff($scope.entity.STD, $scope.blockOff);
                        }
                        if ($scope.blockOn)
                            $scope.dto.BlockOnDate = momentFromatFroServerUTC((new Date($scope.blockOn)).combineDate(new Date($scope.entity.STDDay), $scope.blockOnD));
                        if ($scope.takeOff)
                            $scope.dto.TakeOffDate = momentFromatFroServerUTC((new Date($scope.takeOff)).combineDate(new Date($scope.entity.STDDay), $scope.takeOffD));
                        if ($scope.landing)
                            $scope.dto.LandingDate = momentFromatFroServerUTC((new Date($scope.landing)).combineDate(new Date($scope.entity.STDDay), $scope.landingD));

                        if ($scope.blockOff && $scope.blockOn) {
                            $scope.dto.BlockTime = getMinutesDiff($scope.blockOff, $scope.blockOn);
                        }
                        if ($scope.takeOff && $scope.landing) {
                            $scope.dto.FlightTime = getMinutesDiff($scope.takeOff, $scope.landing);
                        }

                        $scope.dto.FuelRemaining = $scope.entity.FuelRemaining;
                        $scope.dto.FuelUplift = $scope.entity.FuelUplift;
                        $scope.dto.FuelUsed = $scope.entity.FuelUsed;
                        $scope.dto.FuelDensity = $scope.entity.FuelDensity;
                        $scope.dto.FuelTotal = $scope.entity.FuelRemaining && $scope.entity.FuelUplift ? $scope.entity.FuelRemaining + $scope.entity.FuelUplift : null;

                        $scope.dto.PaxAdult = $scope.entity.PaxAdult;
                        $scope.dto.PaxChild = $scope.entity.PaxChild;
                        $scope.dto.PaxInfant = $scope.entity.PaxInfant;
                        $scope.dto.PaxTotal = $scope.entity.PaxTotal;

                        $scope.dto.BaggageWeight = $scope.entity.BaggageWeight;
                        $scope.dto.CargoWeight = $scope.entity.CargoWeight;

                        $scope.dto.SerialNo = $scope.entity.SerialNo;
                        $scope.dto.LTR = $scope.entity.LTR;
                        $scope.dto.PF = $scope.entity.PF;

                        $scope.dto.RVSM_GND_CPT = $scope.entity.RVSM_GND_CPT;
                        $scope.dto.RVSM_GND_STBY = $scope.entity.RVSM_GND_STBY;
                        $scope.dto.RVSM_GND_FO = $scope.entity.RVSM_GND_FO;

                        $scope.dto.RVSM_FLT_CPT = $scope.entity.RVSM_FLT_CPT;
                        $scope.dto.RVSM_FLT_STBY = $scope.entity.RVSM_FLT_STBY;
                        $scope.dto.RVSM_FLT_FO = $scope.entity.RVSM_FLT_FO;

                        $scope.dto.CommanderNote = $scope.entity.CommanderNote; 
                        $scope.dto.AttRepositioning1 = $scope.entity.AttRepositioning1;
                        $scope.dto.AttRepositioning2 = $scope.entity.AttRepositioning2;

                        $scope.dto.JLDate = momentUtcNow();
                        // $scope.dto.JLUserId = $scope.entity.CrewId;
                        $scope.dto.Version = $scope.entity.Version + 1;


                        if ($rootScope.getOnlineStatus()) {
                            var dtoCheck = { JLDate: $scope.dto.JLDate, CrewId: $scope.dto.CrewId, FlightId: $scope.dto.FlightId };
                            $scope.loadingVisible = true;
                            flightBagService.epCheckLog(dtoCheck,'log').then(function (response) {
                                $scope.loadingVisible = false;
                                $scope.checkResult = response.Data;


                                if (($scope.checkResult.JLUserId && $scope.checkResult.JLUserId != $scope.entity.JLUserId)
                                    || ($scope.checkResult.JLUserId && getTimeForSync($scope.checkResult.JLDate) > getTimeForSync($scope.entity.JLDate))
                                ) {
                                    $scope.checkResult.JLDate2 = moment($scope.checkResult.JLDate).format('YYYY-MMM-DD');
                                    $scope.popup_check_visible = true;
                                }
                                else {
                                    $scope.updateServer();
                                }
                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }
                        else {
                            $scope.dto.JLUserId = $scope.entity.CrewId;
                            $scope.updateLocal();
                        }
                        
                       
                       




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
             
            if ($scope.isFullScreen)
                //  $scope.scrollHeight = $(window).height() - 230;
                $scope.scrollStyle = { height: ($(window).height() - 230).toString()+'px'};
            else
                $scope.scrollStyle = { height: ($scope.popup_height - 195).toString()+  'px' };
              //  $scope.scrollHeight = 200;



        },
        onHiding: function () {

            //$scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onLogAddHide', null);
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
            'toolbarItems[1].visible': 'isEditable', 
            'toolbarItems[0].visible': 'isLockVisible',

        }
    };


    $scope.scroll_logadd_height = $(window).height() - 200;
    $scope.scroll_logadd = {
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
            height: 'scroll_logadd_height'
        }

    };
    ///////////////////////////
    $scope.popup_check_visible = false;
    $scope.popup_check = {
        height: 200,
        width: 440,
        title: 'Alert',
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Update Local', onClick: function (e) {

                        $scope.syncFlight();
                        $scope.popup_check_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Update Server', onClick: function (e) {
                        $scope.updateServer();
                        $scope.popup_check_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Local Save', onClick: function (e) {

                        $scope.updateLocal();
                        $scope.popup_check_visible = false;
                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {

        },
        onHiding: function () {

            //$scope.clearEntity();

            $scope.popup_check_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_check_visible',


        }
    };
    ////////////////////////////
    $scope.entity = {
        Id: -1,
    };
    $scope.blockOff = null;
    $scope.blockOn = null;
    $scope.takeOff = null;
    $scope.landing = null;
    $scope.blockOffD = "D";
    $scope.takeOffD = "D";
    $scope.landingD = "D";
    $scope.blockOnD = "D";
    $scope.time_blockoff = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'blockOff',

        }
    };
    $scope.time_blockon = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'blockOn',

        }
    };
    $scope.time_takeoff = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'takeOff',

        }
    };
    $scope.time_landing = {
        type: "time",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'landing',

        }
    };
    
    $scope.fuel_remaining = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 500,
        useLargeSpinButtons:true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {
            $scope.entity.FuelTotal = null;
            if ($scope.entity.FuelUplift && $scope.entity.FuelRemaining)
                $scope.entity.FuelTotal = $scope.entity.FuelUplift + $scope.entity.FuelRemaining;
        },
        bindingOptions: {
            value: "entity.FuelRemaining"
        },
         
    };
    $scope.fuel_uplift = {
        valueChangeEvent:'keyup',
        showClearButton: false,
        step: 500,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {
            $scope.entity.FuelTotal = null;
            if ($scope.entity.FuelUplift && $scope.entity.FuelRemaining)
                $scope.entity.FuelTotal = $scope.entity.FuelUplift + $scope.entity.FuelRemaining;
        },
        bindingOptions: {
            value: "entity.FuelUplift"
        },

    };
    $scope.fuel_density = {
        showClearButton: false,
        step: 0.1,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: "entity.FuelDensity"
        },

    };
    $scope.fuel_total = {
        showClearButton: false,
        readOnly:true,
        useLargeSpinButtons: false,
        min: 0,
        showSpinButtons: false,
        bindingOptions: {
            value: "entity.FuelTotal"
        },

    };
    $scope.fuel_used = {
        showClearButton: false,
        step: 500,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: "entity.FuelUsed"
        },

    };
    ///////////////////////////////
    $scope.pass_adult = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 1,
        useLargeSpinButtons: true,
        min: 0, 
        showSpinButtons: true,
        onValueChanged: function (e) {
             
            $scope.entity.PaxTotal = nullZero($scope.entity.PaxAdult) + nullZero($scope.entity.PaxChild) + nullZero($scope.entity.PaxInfant);
        },
        bindingOptions: {
            value: "entity.PaxAdult"
        },

    };
    $scope.pass_child = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 1,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {

            $scope.entity.PaxTotal = nullZero($scope.entity.PaxAdult) + nullZero($scope.entity.PaxChild) + nullZero($scope.entity.PaxInfant);
        },
        bindingOptions: {
            value: "entity.PaxChild"
        },

    };
    $scope.pass_infant = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 1,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {

            $scope.entity.PaxTotal = nullZero($scope.entity.PaxAdult) + nullZero($scope.entity.PaxChild) + nullZero($scope.entity.PaxInfant);
        },
        bindingOptions: {
            value: "entity.PaxInfant"
        },

    };
    $scope.pass_total = {
        showClearButton: false,
        readOnly: true,
        useLargeSpinButtons: false,
        min: 0,
        showSpinButtons: false,
        bindingOptions: {
            value: "entity.PaxTotal"
        },

    };
   ///////////////////////////////////
    $scope.cargo = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {

            $scope.entity.Freight = nullZero($scope.entity.CargoWeight) + nullZero($scope.entity.BaggageWeight)  ;
        },
        bindingOptions: {
            value: "entity.CargoWeight"
        },

    };
    $scope.baggs = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: true,
        min: 0,
        showSpinButtons: true,
        onValueChanged: function (e) {

            $scope.entity.Freight = nullZero($scope.entity.CargoWeight) + nullZero($scope.entity.BaggageWeight) ;
        },
        bindingOptions: {
            value: "entity.BaggageWeight"
        },

    };
    
    $scope.freight = {
        showClearButton: false,
        readOnly: true,
        useLargeSpinButtons: false,
        min: 0,
        showSpinButtons: false,
        bindingOptions: {
            value: "entity.Freight"
        },

    };

    ///////////////////////////////
    $scope.gnd_cpt = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
        
        showSpinButtons: false,
       
        bindingOptions: {
            value: "entity.RVSM_GND_CPT"
        },

    };
    $scope.gnd_stby = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
        
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.RVSM_GND_STBY"
        },

    };
    $scope.gnd_fo = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
         
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.RVSM_GND_FO"
        },

    };

    $scope.flt_cpt = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
         
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.RVSM_FLT_CPT"
        },

    };
    $scope.flt_stby = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
         
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.RVSM_FLT_STBY"
        },

    };
    $scope.flt_fo = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        step: 100,
        useLargeSpinButtons: false,
        min: 0,
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.RVSM_FLT_FO"
        },

    };

    $scope.sb_pf = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: ['C','F','I'],
        bindingOptions: {
            value: 'entity.PF',


        }
    };

    $scope.serialNo = {
        valueChangeEvent: 'keyup',
        showClearButton: false,
        
        useLargeSpinButtons: false,
        
        showSpinButtons: false,

        bindingOptions: {
            value: "entity.SerialNo"
        },

    };
    $scope.ltr = {
        valueChangeEvent: 'keyup',
        showClearButton: false,

        useLargeSpinButtons: false,

        showSpinButtons: false,

        bindingOptions: {
            value: "entity.LTR"
        },

    };
    $scope.chb_rep1 = {

        text: '',
        bindingOptions: {
            value: 'entity.AttRepositioning1',

        }
    };
    $scope.chb_rep2 = {

        text: '',
        bindingOptions: {
            value: 'entity.AttRepositioning2',

        }
    };
    $scope.note = {
        bindingOptions: {
            value: 'entity.CommanderNote',
            height: '80',
           
        }
    };
    ////////////////////////////////
    $scope.clickD = function (prm) {

        switch ($scope[prm]) {

            case 'D':
                $scope[prm] = '+D';
                break;
            case '+D':
                $scope[prm] = '-D';
                break;
            case '-D':
                $scope[prm] = 'D';
                break;
            default: break;
        }
    };
    $scope.fillTime = function (des, src) {
        $scope[des] = $scope.entity[src];
    };
    var _day = function (dt) {
        return (new Date(dt)).getDate();
    };

   
    $scope.bind = function () {
        
        if ($rootScope.getOnlineStatus()) {
            
            flightBagService.checkLock($scope.entity.Id,'log').then(function (response) {
                $scope.isLockVisible = false;
                if (response.IsSuccess && response.Data.canLock) {
                    $scope.isLockVisible = true;
                }
            }, function (err) { });
        }


        $scope.loadingVisible = true;
        flightBagService.epGetFlightLocal($scope.entity.Id).then(function (response) {
            //moment.utc()
           
            
            var diff = Math.abs((new Date()).getTime() - (new Date(response.Data.STALocal)).getTime()) / 3600000; 
            $scope.isEditable = (diff <= 24);
            if (response.Data.JLSignedBy) {
                //$scope.isEditable = false;
                $scope.url_sign = signFiles + response.Data.PICId + ".jpg";
                $scope.PIC = response.Data.PIC;
                $scope.signDate = moment(new Date(response.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }

            
            $scope.loadingVisible = false;

            if (response.IsSuccess) {

                $scope.isContentVisible = true;
                //$scope.entity.FlightNumber = response.Data.FlightNumber;
                //$scope.entity.FromAirportIATA = response.Data.FromAirportIATA;
                //$scope.entity.ToAirportIATA = response.Data.ToAirportIATA;
                //$scope.entity.STDDay = response.Data.STDDay;
                //$scope.entity.STD = response.Data.STD;
                //$scope.entity.STA = response.Data.STA;
                $scope.entity = response.Data;
                 

                $scope.blockOff = $scope.entity.BlockOff;
                $scope.blockOn = $scope.entity.BlockOn;
                $scope.takeOff = $scope.entity.TakeOff;
                $scope.landing = $scope.entity.Landing;

                $scope.blockOffD = "D";
                $scope.takeOffD = "D";
                $scope.blockOnD = "D";
                $scope.landingD = "D";
                if ($scope.entity.BlockOff && _day($scope.entity.BlockOff) > _day($scope.entity.STD))
                    $scope.blockOffD = "+D";
                if ($scope.entity.BlockOff && _day($scope.entity.BlockOff) < _day($scope.entity.STD))
                    $scope.blockOffD = "-D";

                if ($scope.entity.TakeOff && _day($scope.entity.TakeOff) > _day($scope.entity.STD))
                    $scope.takeOffD = "+D";
                if ($scope.entity.TakeOff && _day($scope.entity.TakeOff) < _day($scope.entity.STD))
                    $scope.takeOffD = "-D";

                if ($scope.entity.Landing && _day($scope.entity.Landing) > _day($scope.entity.STA))
                    $scope.landingD = "+D";
                if ($scope.entity.Landing && _day($scope.entity.Landing) < _day($scope.entity.STA))
                    $scope.landingD = "-D";

                if ($scope.entity.BlockOn && _day($scope.entity.BlockOn) > _day($scope.entity.STA))
                    $scope.blockOnD = "+D";
                if ($scope.entity.BlockOn && _day($scope.entity.BlockOn) < _day($scope.entity.STA))
                    $scope.blockOnD = "-D";

                if (!$scope.entity.FuelDensity)
                    $scope.entity.FuelDensity = 0.8;



            }
            else
                $rootScope.processErorrs(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    ////////////////////////////
    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.$apply(function () {
            // $scope.leftHeight = $(window).height() - 135;
            // $scope.rightHeight = $(window).height() - 135 - 45;
        });
    });
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {
        
        if (prms.doc == 'log')
            flightBagService.signDocLocal(prms,prms.doc).then(function (response) {
                //alert('log signed');
                //$scope.isEditable = false;
               // $scope.isLockVisible = false; 
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    });
    $scope.$on('InitLogAdd', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;

            $scope.popup_add_title = 'Log';

        }

        else {

            $scope.popup_add_title = 'Log';
            $scope.tempData = prms;
            $scope.entity.Id = prms.Id;

        }

        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  

