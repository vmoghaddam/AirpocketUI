'use strict';
app.controller('qaGroundController', ['$scope', '$location', 'QAService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, QAService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    $scope.fltInfo = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    //if (detector.mobile() && !detector.tablet())
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null,
    };

    $scope.followUpEntity = {
        Type: 1,
        Feedback: "test test test test test test test test"
    }



    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = ' Ground Operation Hazard/Event Report Form';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'ground', icon: 'fas fa-signature', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        $scope.entity.Signed = "1";
                        $scope.entity.FlightId = $scope.tempData.FlightId;
                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.followUpEntity.EntityId = $scope.entity.Id;
                        $scope.followUpEntity.ReferrerId = $scope.tempData.crewId;
                        $scope.followUpEntity.DateReferr = new Date();
                        $scope.followUpEntity.DateConfirmation = new Date();

                        var damageid = Enumerable.From($scope.damageBy).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.DamageById = damageid ? damageid : null;

                        var lightingid = Enumerable.From($scope.lighting).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXLightingId = lightingid ? lightingid : null;

                        var weatherid = Enumerable.From($scope.weather).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXWeatherId = weatherid ? weatherid : null;

                        var surfaceid = Enumerable.From($scope.surface).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXSurfaceId = surfaceid ? surfaceid : null;

                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');

                        $scope.entity.ScheduledGroundTimeStr = new Date($scope.entity.ScheduledGroundTime).getHours() + ":" + new Date($scope.entity.ScheduledGroundTime).getMinutes() + ":00";
                        $scope.entity.FlightDelayStr = new Date($scope.entity.FlightDelay).getHours() + ":" + new Date($scope.entity.FlightDelay).getMinutes() + ":00";

                        $scope.loadingVisible = true
                        QAService.saveGround($scope.entity).then(function (res) {

                            $scope.entity.Id = res.Data.Id;
                            $scope.followUpEntity.EntityId = res.Data.Id;
                            if (res.IsSuccess == true) {
                                QAService.saveFollowUp($scope.followUpEntity).then(function (response) {

                                    $scope.loadingVisible = false;
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                    if ($scope.tempData.Status == "Not Signed") {
                                        var row = Enumerable.From($rootScope.ds_active).Where("$.EntityId==" + $scope.entity.Id).FirstOrDefault();
                                        row.Status = "In Progress";
                                    }

                                    $scope.popup_add_visible = false;
                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                QAService.saveFeedBack($scope.followUpEntity).then(function (response) {
                                    console.log(response);
                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                            } else {
                                General.ShowNotify('error', 'error')
                            }
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: '', icon: 'fas fa-file', onClick: function (e) {
                        var data = {
                            EmployeeId: $scope.tempData.crewId,
                            Type: $scope.followUpEntity.Type,
                            EntityId: $scope.entity.Id,
                            isEditable: $scope.isEditable,
                            Files: $scope.entity.files,
                        }
                        $rootScope.$broadcast('InitAttachmentPopup', data);
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'ground', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.entity.FlightId = $scope.tempData.FlightId;
                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');


                        $scope.entity.ScheduledGroundTimeStr = new Date($scope.entity.ScheduledGroundTime).getHours() + ":" + new Date($scope.entity.ScheduledGroundTime).getMinutes() + ":00";
                        $scope.entity.FlightDelayStr = new Date($scope.entity.FlightDelay).getHours() + ":" + new Date($scope.entity.FlightDelay).getMinutes() + ":00";


                        var damageid = Enumerable.From($scope.damageBy).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.DamageById = damageid ? damageid : null;

                        var lightingid = Enumerable.From($scope.lighting).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXLightingId = lightingid ? lightingid : null;

                        var weatherid = Enumerable.From($scope.weather).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXWeatherId = weatherid ? weatherid : null;

                        var surfaceid = Enumerable.From($scope.surface).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXSurfaceId = surfaceid ? surfaceid : null;



                        $scope.entity.Signed = $scope.entity.DateSign ? "1" : null;

                        $scope.loadingVisible = true;
                        QAService.saveGround($scope.entity).then(function (res) {
                            $scope.loadingVisible = false;
                            if (res.IsSuccess == true) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                $scope.entity.Id = res.Data.Id;
                            }
                            else {
                                General.ShowNotify(Config.Text_SaveFailed, 'error');
                                $scope.entity.Id = -1;
                            }
                            $scope.entity.files = [];
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

            if ($scope.tempData != null)
                $scope.bind();





        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
            };

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onQAGroundHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };



    /////////////////////////////////

    $scope.chkDamageBy = function (obj) {

        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.damageBy, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.DamageById = _id;
            }
            else
                _d.checked = false;

        });


        //$.each($scope.damageBy, function (_i, _d) {
        //    if (_d.Title.includes('Other')) {
        //        if (_d.checked)
        //            $scope.showOther = true;
        //        else
        //            $scope.showOther = false;
        //    }
        //});
    }

    $scope.chkLighting = function (obj) {
        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.lighting, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.WXLightingId = _id;
            }
            else
                _d.checked = false;

        });
    }

    $scope.chkWeather = function (obj) {

        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.weather, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.WXWeatherId = _id;
            }
            else
                _d.checked = false;

        });
    }

    $scope.chkSurface = function (obj) {

        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.surface, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.WXSurfaceId = _id;
            }
            else
                _d.checked = false;

        });
    }



    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;

        //const timeString = data.ScheduledGroundTime;

        //$scope.entity.ScheduledGroundTime = new Date();
        //$scope.entity.ScheduledGroundTime.setHours(parseInt(timeString.split(':')[0], 10));
        //$scope.entity.ScheduledGroundTime.setMinutes(parseInt(timeString.split(':')[1], 10));
        //$scope.entity.ScheduledGroundTime.setSeconds(parseInt(timeString.split(':')[2], 10));

        //const delayTimeString = data.FlightDelay;

        //$scope.entity.FlightDelay = new Date();
        //$scope.entity.FlightDelay.setHours(parseInt(delayTimeString.split(':')[0], 10));
        //$scope.entity.FlightDelay.setMinutes(parseInt(delayTimeString.split(':')[1], 10));
        //$scope.entity.FlightDelay.setSeconds(parseInt(delayTimeString.split(':')[2], 10));


        $.each($scope.damageBy, function (_i, _d) {
            if (_d.Id == data.DamageById)
                _d.checked = true;

            //if (_d.Title.includes('Other')) {
            //    if (_d.checked)
            //        $scope.showOther = true;
            //    else
            //        $scope.showOther = false;
            //}
        });

        $.each($scope.weather, function (_i, _d) {
            if (_d.Id == data.WXWeatherId)
                _d.checked = true;
        });

        $.each($scope.surface, function (_i, _d) {

            if (_d.Id == data.WXSurfaceId)
                _d.checked = true;
        });

        $.each($scope.lighting, function (_i, _d) {
            if (_d.Id == data.WXLightingId)
                _d.checked = true;
        });

    };


    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;

        QAService.getStation().then(function (res) {
            $scope.ds_airport = res.Data;
        });


        QAService.getDamageBy().then(function (res) {
            $scope.damageBy = res.Data;
        })

        QAService.getSurface().then(function (res) {
            $scope.surface = res.Data;
        })

        QAService.getWeather().then(function (res) {
            $scope.weather = res.Data;
        })

        QAService.getLighting().then(function (res) {
            $scope.lighting = res.Data;

            if ($scope.entity.FlightId == null) {
                if ($scope.tempData.EntityId != null) {
                    QAService.getGIAById($scope.tempData.EntityId).then(function (res) {
                        $scope.fill(res.Data);
                        $scope.isEditable = !$scope.entity.DateSign;
                    });
                } else {
                    $scope.entity = {
                        Id: -1,
                        DateOccurrence: res.Data.DateOccurrence,
                        ScheduledGroundTime: "00:00:00",
                        FlightDelay: "00:00:00"
                    }
                    $scope.isEditable = true
                }
            } else {
                QAService.getGIAByFlightId($scope.tempData.crewId, $scope.entity.FlightId).then(function (res) {
                    if (res.Data.Id != null) {
                        $scope.fill(res.Data);
                        $scope.isEditable = !$scope.entity.DateSign;
                        $scope.fltInfo = true;
                    } else {
                        $scope.fltInfo = true;
                        $scope.entity = {
                            Id: -1,
                            FlightNumber: res.Data.FlightNumber,
                            AircraftType: res.Data.AircraftType,
                            Register: res.Data.Register,
                            flightCancelled: res.Data.flightCancelled,
                            DateOccurrence: res.Data.DateOccurrence,
                            ScheduledGroundTime: "00:00:00",
                            FlightDelay: "00:00:00"
                        }
                        $scope.isEditable = true
                    }
                });
            }
        });



    };


    ////////////////////////////////
    $scope.scroll_qaGround_height = $(window).height() - 130;
    $scope.scroll_qaGround = {
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
            height: 'scroll_qaGround_height'
        }

    };

    /////////////////////////////////
    $scope.txt_date = {
        type: 'date',
        pickerType: 'rollers',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_OccurrenceTime = {
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_optPhase = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OperationPhase',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_occurrecneTime = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OccurrenceTime',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_area = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Area',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_acRegister = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.AircraftType',
        }
    }

    $scope.txt_fltNum = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_gndTime = {
        hoverStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.ScheduledGroundTime',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_fltDelay = {
        hoverStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.FlightDelay',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.sb_airport = {
        showClearButton: false,
        searchEnabled: false,

        placeholder: '',
        displayExpr: 'IATA',
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.AirportId',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable',
            dataSource: 'ds_airport',
        }
    }



    $scope.dsFlightCancelled = [
        { id: 0, title: 'NO' },
        { id: 1, title: 'YES' },
    ];

    $scope.sb_fltCancelled = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsFlightCancelled,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.flightCancelled',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_damageDetail = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.DamageDetails',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_eeCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_eeNonCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesNonFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_paxCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_paxNonCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersNonFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_otherCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_otherNonCasualty = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersNonFatalityNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veFleetSerial = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VESerialFleetNr',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veType = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEType',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veOwner = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEOwner',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veArea = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEArea',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veAga = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEAge',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_veLastOverhaul = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VELastOverhaul',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_veRemarks = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.VERemarks',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }




    $scope.dsVehicleDetail = [
        { id: 0, title: 'Serviceable' },
        { id: 1, title: 'Faulty' },
        { id: 2, title: 'Unknown' }
    ];

    $scope.sb_veTyer = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VETyresCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.sb_veBrake = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEBrakesCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.sb_veSteering = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VESteeringCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.sb_veLight = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VELightsCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.sb_veWiper = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEWipersCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.sb_veProtection = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEProtectionCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.sb_veWarningDevices = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEWarningDevicesCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.sb_veStab = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEStabilizersCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.sb_veTow = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VETowHitchCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.sb_veVision = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEFieldofVisionCon',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_eventOther = {
        bindingOptions: {
            value: 'entity.DamageRemark',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p1Name = {
        bindingOptions: {
            value: 'entity.PersonnelName1',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p1Job = {
        bindingOptions: {
            value: 'entity.PersonnelJobTitle1',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p1Compony = {
        bindingOptions: {
            value: 'entity.PersonnelCompany1',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p1StaffNum = {
        bindingOptions: {
            value: 'entity.PersonnelStaffNr1',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p1License = {
        bindingOptions: {
            value: 'entity.PersonnelLicense1',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }



    $scope.txt_p2Name = {
        bindingOptions: {
            value: 'entity.PersonnelName2',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p2Job = {
        bindingOptions: {
            value: 'entity.PersonnelJobTitle2',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p2Compony = {
        bindingOptions: {
            value: 'entity.PersonnelCompany2',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p2StaffNum = {
        bindingOptions: {
            value: 'entity.PersonnelStaffNr2',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p2License = {
        bindingOptions: {
            value: 'entity.PersonnelLicense2',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }




    $scope.txt_p3Name = {
        bindingOptions: {
            value: 'entity.PersonnelName3',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p3Job = {
        bindingOptions: {
            value: 'entity.PersonnelJobTitle3',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p3Compony = {
        bindingOptions: {
            value: 'entity.PersonnelCompany3',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p3StaffNum = {
        bindingOptions: {
            value: 'entity.PersonnelStaffNr3',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_p3License = {
        bindingOptions: {
            value: 'entity.PersonnelLicense3',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_VISByMeter = {
        bindingOptions: {
            value: 'entity.WXVisibilityM',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_VISByKiloMeter = {
        bindingOptions: {
            value: 'entity.WXVisibilityKM',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_wind = {
        bindingOptions: {
            value: 'entity.WXWind',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_temp = {
        bindingOptions: {
            value: 'entity.WXTemperature',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_contributFact = {
        bindingOptions: {
            value: 'entity.ContributoryFactors',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    //$scope.sketch = {
    //    bindingOptions: {
    //        value: 'entity.sketch',
    //    }
    //}

    $scope.txt_Event = {
        bindingOptions: {
            value: 'entity.Event',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_correctiveAction = {
        bindingOptions: {
            value: 'entity.CorrectiveActionTaken',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_otherRMK = {
        bindingOptions: {
            value: 'entity.OtherSuggestions',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_delayReason = {
        bindingOptions: {
            value: 'entity.DelayReason',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.num_delay = {
        bindingOptions: {
            value: 'entity.Delay',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }





    ////////////////////////////////

    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'grf')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitQAGround', function (event, prms) {


        $scope.tempData = null;




        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });


    $scope.$on('onAttachmentHide', function (event, prms) {
        $scope.entity.files = prms;
    });


}]);


