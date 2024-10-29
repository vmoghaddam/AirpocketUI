'use strict';
app.controller('qaGroundController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window, $sce) {
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $rootScope.followUpEntity = {
        Type: 1,
    }

    $rootScope.result = {
        Result: null,
    };

    $scope.dmgOptions = [];
    $scope.wxOptions = [];
    $scope.surfaceOptions = [];
    $scope.lightingOptions = [];

    /////////////////////////////////



    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;

        $rootScope.result.Result = data.Result;

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

        qaService.getStation().then(function (res) {
            $scope.ds_airport = res.Data;
        });

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

        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.followUpEntity.isResponsible = true

        });

        qaService.getImportedFile($scope.followUpEntity.Id, $scope.followUpEntity.ProducerId, $scope.followUpEntity.Type).then(function (response) {
            console.log(response);
            $rootScope.dg_attachments_ds = response.Data;
        });
    };

    ////////////////////////////////

    $scope.scroll_qaGround_height = $(window).height() - 170;
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


    $scope.sb_airport = {
        showClearButton: false,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        placeholder: '',
        displayExpr: 'IATA',
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.AirportId',
            dataSource: 'ds_airport',
        }
    }

    $scope.txt_title = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
        }
    }


    $scope.txt_date = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }

    $scope.txt_OccurrenceTime = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }

    $scope.txt_optPhase = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OperationPhase',
        }
    }

    $scope.txt_occurrecneTime = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OccurrenceTime',
        }
    }

    $scope.txt_area = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Area',
        }
    }

    $scope.txt_acRegister = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AircraftType',
        }
    }

    $scope.txt_fltNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_gndTime = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.ScheduledGroundTime',
        }
    }

    $scope.txt_fltDelay = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
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
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.DamageDetails',
        }
    }

    $scope.txt_eeCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesFatalityNr',
        }
    }

    $scope.txt_eeNonCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeesNonFatalityNr',
        }
    }

    $scope.txt_paxCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersFatalityNr',
        }
    }

    $scope.txt_paxNonCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PassengersNonFatalityNr',
        }
    }

    $scope.txt_otherCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersFatalityNr',
        }
    }

    $scope.txt_otherNonCasualty = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OthersNonFatalityNr',
        }
    }

    $scope.txt_veFleetSerial = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VESerialFleetNr',
        }
    }

    $scope.txt_veType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEType',
        }
    }

    $scope.txt_veOwner = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEOwner',
        }
    }

    $scope.txt_eqArea = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEArea',
        }
    }

    $scope.txt_veAga = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VEAge',
        }
    }

    $scope.txt_veLastOverhaul = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.VELastOverhaul',
        }
    }


    $scope.txt_veRemarks = {
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

    $scope.dg_attachments_columns = [



        {
            dataField: "Id", caption: '',
            width: 115,
            cellTemplate: "download",
            allowFiltering: false,
            allowSorting: false,

            fixed: true, fixedPosition: 'right',
        },

        { dataField: 'Description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minwidth: 100, },
        { dataField: 'Lable', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },



    ];
    $scope.dg_attachments_selected = null;
    $rootScope.dg_attachments_instance = null;
    $rootScope.dg_attachments_ds = null;
    $scope.dg_attachments = {



        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 200,
        columns: $scope.dg_attachments_columns,
        onContentReady: function (e) {
            if (!$rootScope.dg_attachments_instance)
                $rootScope.dg_attachments_instance = e.component;

        },

        onRowClick: function (e) {

        },

        onRowPrepared: function (e) {
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_attachments_selected = null;
            }
            else
                $scope.dg_attachments_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_attachments_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.download = function (e) {

        var filename = e.data.Lable.split(".");
        console.log("file name", filename);
        qaService.downloadQa(filename[0], filename[1]).then(function (response) {

        });
    }

    ////////////////////////////////

    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.scroll_qaGround_height = $(window).height() - 170;
    });


    $scope.tempData = null;

    $scope.$on('InitQAGround', function (event, prms) {

        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;

        /* $scope.popup_add_visible = true;*/

        $scope.bind();
    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        console.log(prms);
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


