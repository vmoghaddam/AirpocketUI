'use strict';
app.controller('qaGroundController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window, $sce) {
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $rootScope.followUpEntity = {
        Type: 1,
    }

    $scope.dmgOptions = [];
    $scope.wxOptions = [];
    $scope.surfaceOptions = [];
    $scope.lightingOptions = [];




    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_add_title = 'Ground Incident/Accident/Damage';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Referre', onClick: function (e) {

                        $rootScope.$broadcast('InitQAEmployee', { Type: $rootScope.followUpEntity.Type, Id: $scope.entity.Id, Category: $rootScope.followUpEntity.Category });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Action', onClick: function (e) {

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'closed', validationGroup: 'result', onClick: function (e) {
                        $scope.loadingVisible = true;

                        $scope.entity.Category = $scope.tempData.Category;
                        $scope.entity.Id = $scope.tempData.Id;
                        $scope.entity.Type = $scope.tempData.Type;
                        $scope.entity.EmployeeId = $scope.tempData.EmployeeId;
                        $scope.entity.isResponsible = $scope.followUpEntity.isResponsible;
                        console.log($scope.entity.result);

                        qaService.acceptQA($scope.entity).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_QAAccept, 'success');

                            if ($scope.followUpEntity.isResponsible == true) {

                                if (response.IsSuccess == true && $scope.followUpEntity.Category == 'open') {
                                    var row = Enumerable.From($rootScope.dg_open_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                    row.Status = "Closed";
                                    row.EmployeeStatus = "Closed";
                                    row.Status = 1;
                                    $rootScope.dg_determined_ds.push(row);
                                    $rootScope.dg_open_ds = Enumerable.From($rootScope.dg_open_ds).Where(function (x) {
                                        return x.Id != $scope.entity.Id;
                                    }).ToArray();
                                }

                                if (response.IsSuccess == true && $scope.followUpEntity.Category == 'new') {
                                    var row = Enumerable.From($rootScope.dg_new_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                    row.Status = "Closed";
                                    row.EmployeeStatus = "Closed";
                                    row.Status = 1;
                                    $rootScope.dg_determined_ds.push(row);
                                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds).Where(function (x) {
                                        return x.Id != $scope.entity.Id;
                                    }).ToArray();
                                }
                            } else {
                                if (response.IsSuccess == true && $scope.followUpEntity.Category == 'open') {
                                    var row = Enumerable.From($rootScope.dg_open_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                    row.Status = "Closed";
                                    row.EmployeeStatus = "Closed";
                                    $rootScope.dg_determined_ds.push(row);
                                    $rootScope.dg_open_ds = Enumerable.From($rootScope.dg_open_ds).Where(function (x) {
                                        return x.Id != $scope.entity.Id;
                                    }).ToArray();
                                }

                                if (response.IsSuccess == true && $scope.followUpEntity.Category == 'new') {
                                    var row = Enumerable.From($rootScope.dg_new_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                    row.Status = "Closed";
                                    row.EmployeeStatus = "Closed";
                                    $rootScope.dg_determined_ds.push(row);
                                    $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds).Where(function (x) {
                                        return x.Id != $scope.entity.Id;
                                    }).ToArray();
                                }
                            }


                        });
                    }
                }, toolbar: 'bottom'
            },
          
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;

        },
        onShown: function (e) {
            if ($scope.tempData != null)
                $scope.bind();
            $rootScope.$broadcast('InitTest', $scope.tempData);




        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.entity = {
                Id: -1,
            };

            $rootScope.followUpEntity.Result = null;
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onGRFHide', null);
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
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };



    /////////////////////////////////



    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;

        $.each($scope.damageBy, function (_i, _d) {
            if (_d.Title.includes('Other')) {
                if (_d.checked)
                    $scope.showOther = true;
                else
                    $scope.showOther = false;
            }
        });

        $scope.dmgOptions[data.DamageById] = true;
        $scope.wxOptions[data.WXWeatherId] = true;
        $scope.surfaceOptions[data.WXSurfaceId] = true;
        $scope.lightingOptions[data.WXLightingId] = true;
    };


    $scope.bind = function () {

        qaService.getDamageBy().then(function (res) {
            $scope.damageBy = res.Data;
        });

        qaService.getSurface().then(function (res) {
            $scope.surface = res.Data;
        });

        qaService.getWeather().then(function (res) {
            $scope.weather = res.Data;
        });

        qaService.getLighting().then(function (res) {
            $scope.lighting = res.Data;
            qaService.getGIAById($rootScope.followUpEntity.Id).then(function (res) {
                $scope.fill(res.Data);
            });
        });

        qaService.getIsResponsible($rootScope.followUpEntity.EmployeeId, $rootScope.followUpEntity.Type, $rootScope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $rootScope.followUpEntity.isResponsible = true

        });
    };

    ////////////////////////////////

    $scope.scroll_qaGround_height = $scope.popup_height - 12;
    $scope.scroll_qaGround = {
        //width: 900,
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




    $scope.chkDamageBy = function (index) {

        $.each($scope.damageBy, function (_i, _d) {
            if (_d.Title.includes('Other')) {
                if (_d.checked)
                    $scope.showOther = true;
                else
                    $scope.showOther = false;
            }
        });

        $scope.damageBy[index].checked = !$scope.damageBy[index].checked;
        $scope.entity.DamageById = $scope.damageBy[index].Id;

    }

    $scope.chkLighting = function (index) {
        $scope.lighting[index].checked = !$scope.lighting[index].checked;
        $scope.entity.WXLightingId = $scope.lighting[index].Id;
    }

    $scope.chkWeather = function (index) {
        $scope.weather[index].checked = !$scope.weather[index].checked;
        $scope.entity.WXWeatherId = $scope.weather[index].Id;
    }

    $scope.chkSurface = function (index) {
        $scope.surface[index].checked = !$scope.surface[index].checked;
        $scope.entity.WXSurfaceId = $scope.surface[index].Id;
    }



    $scope.txt_date = {
        hoverStateEnabled: false,
        useMaskBehavior: true,
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.DamageDate',
        }
    }

    $scope.txt_optPhase = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OperationPhase',
        }
    }

    $scope.txt_occurrecneTime = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OccurrenceTime',
        }
    }

    $scope.txt_area = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Area',
        }
    }

    $scope.txt_acRegister = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_acType = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AircraftType',
        }
    }

    $scope.txt_fltNum = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_gndTime = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ScheduledGroundTime',
        }
    }

    $scope.txt_fltDelay = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightDelay',
        }
    }

    $scope.dsFlightCancelled = [
        { id: 0, title: 'NO' },
        { id: 1, title: 'YES' },
    ];

    $scope.sb_fltCancelled = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsFlightCancelled,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.flightCancelled',
        }
    }


    $scope.txt_damageDetail = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.DamageDetails',
        }
    }

    $scope.txt_eeCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesFatalityNr',
        }
    }

    $scope.txt_eeNonCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesNonFatalityNr',
        }
    }

    $scope.txt_paxCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersFatalityNr',
        }
    }

    $scope.txt_paxNonCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersNonFatalityNr',
        }
    }

    $scope.txt_otherCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersFatalityNr',
        }
    }

    $scope.txt_otherNonCasualty = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersNonFatalityNr',
        }
    }

    $scope.txt_veFleetSerial = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VESerialFleetNr',
        }
    }

    $scope.txt_veType = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEType',
        }
    }

    $scope.txt_veOwner = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEOwner',
        }
    }

    $scope.txt_eqArea = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEArea',
        }
    }

    $scope.txt_veAga = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEAge',
        }
    }

    $scope.txt_veLastOverhaul = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VELastOverhaul',
        }
    }


    $scope.txt_veRemarks = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VERemarks',
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
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VETyresCon',
        }
    }

    $scope.sb_veBrake = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEBrakesCon',
        }
    }



    $scope.sb_veSteering = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VESteeringCon',
        }
    }



    $scope.sb_veLight = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VELightsCon',
        }
    }



    $scope.sb_veWiper = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEWipersCon',
        }
    }



    $scope.sb_veProtection = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEProtectionCon',
        }
    }



    $scope.sb_veWarningDevices = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEWarningDevicesCon',
        }
    }

    $scope.sb_veStab = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEStabilizersCon',
        }
    }


    $scope.sb_veTow = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VETowHitchCon',
        }
    }


    $scope.sb_veVision = {
        showClearButton: true,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.dsVehicleDetail,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.VEFieldofVisionCon',
        }
    }


    $scope.txt_eventOther = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.DamageRemark',
        }
    }

    $scope.txt_p1Name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelName1',
        }
    }

    $scope.txt_p1Job = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelJobTitle1',
        }
    }

    $scope.txt_p1Compony = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelCompany1',
        }
    }

    $scope.txt_p1StaffNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelStaffNr1',
        }
    }

    $scope.txt_p1License = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelLicense1',
        }
    }



    $scope.txt_p2Name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelName2',
        }
    }

    $scope.txt_p2Job = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelJobTitle2',
        }
    }

    $scope.txt_p2Compony = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelCompany2',
        }
    }

    $scope.txt_p2StaffNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelStaffNr2',
        }
    }

    $scope.txt_p2License = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelLicense2',
        }
    }

    $scope.txt_p3Name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelName3',
        }
    }

    $scope.txt_p3Job = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelJobTitle3',
        }
    }

    $scope.txt_p3Compony = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelCompany3',
        }
    }

    $scope.txt_p3StaffNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelStaffNr3',
        }
    }

    $scope.txt_p3License = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PersonnelLicense3',
        }
    }

    $scope.txt_VISByMeter = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WXVisibilityM',
        }
    }

    $scope.txt_VISByKiloMeter = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WXVisibilityKM',
        }
    }


    $scope.txt_wind = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WXWind',
        }
    }

    $scope.txt_temp = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WXTemperature',
        }
    }

    $scope.txt_contributFact = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ContributoryFactors',
        }
    }

    $scope.txt_Event = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Event',
        }
    }

    $scope.txt_correctiveAction = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.CorrectiveActionTaken',
        }
    }

    $scope.txt_otherRMK = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OtherSuggestions',
        }
    }


    $scope.txt_result = {
        bindingOptions: {
            value: 'entity.Result'
        }
    }


    ////////////////////////////////

    $scope.tempData = null;

    $scope.$on('InitQAGround', function (event, prms) {

        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;

        $scope.popup_add_visible = true;
    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        console.log(prms);
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


