'use strict';
app.controller('asrAddController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    $scope.entity = {
        Id: -1,
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null
    };

    $scope.followUpEntity = {
        Type: 8,
    }

    $rootScope.result = {
        Result: null,
    };



    $scope.isOPSManager = true;
    $scope.isOPSStaff = false;
    $scope.isSave = $scope.isOPSManager || $scope.isOPSStaff;

    //if (detector.mobile() && !detector.tablet())
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

    ////////////////////////
    $scope.OPSRemark = {
        min: 0,
        height: 130,
        bindingOptions: {
            value: 'entity.OPSRemark',
            readOnly: 'isOPSStaff',
        }
    };
    $scope.OPSStaffRemark = {
        min: 0,
        height: 130,
        bindingOptions: {
            value: 'entity.OPSStaffRemark',
            readOnly: 'isOPSManager',
        }
    };
    $scope.getOPSStaffRemark = function () {
        if ($scope.entity && $scope.entity.OPSStaffUser) {
            return "(" + $scope.entity.OPSStaffUser + "  " + moment(new Date($scope.entity.OPSStaffRemarkDate)).format("YYYY-MM-DD HH:mm") + ")";
        }
        else
            return "";
    };
    $scope.getOPSRemark = function () {
        if ($scope.entity && $scope.entity.OPSUser) {
            return "(" + $scope.entity.OPSSUser + "  " + moment(new Date($scope.entity.OPSRemarkDate)).format("YYYY-MM-DD HH:mm") + ")";
        }
        else
            return "";
    };
    $scope.OPSUser = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.OPSUser',

        }
    };

    $scope.sb_status_manager = {
        // openOnFieldClick: false,
        // showDropDownButton: false,
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: [{ title: 'Not Remarked', id: 0 }, { title: 'Remarked', id: 1 }],
        bindingOptions: {
            value: 'entity.OPSStatusId',
            readOnly: 'isOPSStaff',


        }
    };

    $scope.sb_status_staff = {
        // openOnFieldClick: false,
        // showDropDownButton: false,
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: [{ title: 'New', id: 0 }, { title: 'In Progress', id: 1 }, { title: 'Complete', id: 2 }],
        bindingOptions: {
            value: 'entity.OPSStaffStatusId',
            readOnly: 'isOPSManager',

        }
    };
    
    /////////////////////////////////


    /////////////////////////////////
    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
		 $rootScope.result.Result = data.Result
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;
        //if ($rootScope.getOnlineStatus()) {

        //    flightBagService.checkLock($scope.entity.FlightId, 'asr').then(function (response) {
        //        $scope.isLockVisible = false;
        //        if (response.IsSuccess && response.Data.canLock) {
        //            $scope.isLockVisible = true;
        //        }
        //    }, function (err) { });
        //}

        $scope.loadingVisible = true;

        flightBagService.epGetASRByFlight($scope.followUpEntity.Priority ).then(function (response2) {

            $scope.loadingVisible = false;
            //$scope.isEditable = (diff <= 24);

            $scope.flight = response2;
            if (!$scope.flight.OPSStaffStatusId)
                $scope.flight.OPSStaffStatusId = 0;
            if (!$scope.flight.OPSStatusId)
                $scope.flight.OPSStatusId = 0;

            $scope.isSave = $scope.isSave && ($scope.flight.OPSStatusId > 0 || $scope.isOPSManager);

            if (!response2) {
                $scope.entity.Id = -1;
                $scope.isNew = true;
                $scope.form_id = "-";

            }
            else {
				console.log(response2);
                $scope.form_id = response2.SerialNo;
                $scope.url_sign2 = '';
                $scope.PIC2 = '';
                $scope.signDate2 = '';
                response2.JLSignedBy = response2.PICId;
                if (response2.JLSignedBy) {

                    $scope.isEditable = false;
                    $scope.url_sign2 = signFiles + response2.PICId + ".jpg";
                    $scope.PIC2 = response2.PIC;
                    $scope.signDate2 = moment(new Date(response2.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }



                $scope.isNew = false;
                $scope.fill(response2);

            }

            //console.log('ASR',response2.Data);



            $scope.entity.FlightNo = response2.FlightNumber;
            $scope.entity.Date = new Date(response2.STDDay);
            $scope.entity.ACReg = response2.Register;
            $scope.entity.Route = response2.FromAirportIATA + ' - ' + response2.ToAirportIATA
            $scope.entity.FlightNo = response2.FlightNumber
            $scope.FlightNo = {
                min: 0,
                bindingOptions: {
                    value: 'entity.FlightNo',
                }
            };

            $scope.Date = {
                min: 0,
                bindingOptions: {
                    value: 'entity.Date',
                }
            };

            $scope.Route = {
                min: 0,
                bindingOptions: {
                    value: 'entity.Route',
                }
            };

            $scope.ACType = {
                min: 0,
                bindingOptions: {
                    value: 'entity.ACType',
                }
            };

            $scope.ACReg = {
                min: 0,
                bindingOptions: {
                    value: 'entity.ACReg',
                }
            };
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    }, function (err) {
        $scope.loadingVisible = false; General.ShowNotify(err.message, 'error');
    };
    ////////////////////////////////
    $scope.scroll_asradd_height = $(window).height() - 245;
    $scope.scroll_asradd = {
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
            height: 'scroll_asradd_height'
        }

    };

    /////////////////////////////////
    $scope.entity = {
        Id: -1,
        IsSecurityEvent: false,
        IsAirproxATC: false,
        IsTCASRA: false,
        IsWakeTur: false,
        IsBirdStrike: false,
        IsOthers: false,

    };
    $scope.txt_OccurrenceDate = {
        type: "datetime",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "yyyy-MM-dd HHmm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'entity.OccurrenceDate',

        }
    };
    $scope.chb_IsSecurityEvent = {

        text: 'SECURITY EVENT',
        bindingOptions: {
            value: 'entity.IsSecurityEvent',

        }
    };
    $scope.chb_IsAirproxATC = {

        text: 'AIRPROX/ATC',
        bindingOptions: {
            value: 'entity.IsAirproxATC',

        }
    };
    $scope.chb_IsTCASRA = {

        text: 'TCAS RA',
        bindingOptions: {
            value: 'entity.IsTCASRA',

        }
    };
    $scope.chb_IsWakeTur = {

        text: 'WAKE TURB.',
        bindingOptions: {
            value: 'entity.IsWakeTur',

        }
    };
    $scope.chb_IsBirdStrike = {

        text: 'BIRD STRIKE',
        bindingOptions: {
            value: 'entity.IsBirdStrike',

        }
    };
    $scope.chb_IsOthers = {

        text: 'OTHERS',
        bindingOptions: {
            value: 'entity.IsOthers',

        }
    };


    $scope.dsEventType = [
        { id: 100042, title: 'ASR' },
        { id: 100043, title: 'AIRPROX/ATC' },
        { id: 100044, title: 'TCAS RA' },
        { id: 100045, title: 'WAKE TURBULENCE' },
        { id: 100046, title: 'BIRD STRIKE' },

    ];
    $scope.sb_EventType = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsEventType,
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.EventTypeId'

        }
    };
    ///////////////////////////




    $scope.dsDayNightStatus = [
        { id: 100180, title: 'Day' },
        { id: 100181, title: 'Night' },

    ];
    $scope.sb_DayNightStatus = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsDayNightStatus,
        displayExpr: 'title',
        placeholder: 'Day/Night',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.DayNightStatusId'

        }
    };

    $scope.txt_squawk = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.SQUAWK',
        }
    }

    $scope.txt_fuel = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.FuelJettisoned',
        }
    }

    $scope.num_alt = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Altitude',
        }
    }

    $scope.num_speed = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Speed',
        }
    }

    $scope.num_mach = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.MachNo',
        }
    }

    $scope.num_acWeight = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACWeight',
        }
    }
    ////////////////////////////
    $scope.num_techLogPage = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.TechLogPageNO',
        }
    }

    $scope.num_item = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.TechLogItemNO',
        }
    }

    /////////////////////////////////
    $scope.dsFlightPhase = [
        { id: 100029, title: 'TOWING' },
        { id: 100030, title: 'PARKING' },
        { id: 100031, title: 'PUSHBACK' },
        { id: 100032, title: 'TAXI OUT' },
        { id: 100033, title: 'TAKEOFF' },
        { id: 100034, title: 'INITIAL CLIMB(BELOW 1500FT)' },
        { id: 100035, title: 'CLIMB' },
        { id: 100036, title: 'CRUISE' },
        { id: 100037, title: 'DESCENT' },
        { id: 100038, title: 'HOLDING' },
        { id: 100039, title: 'APPROACH(BELOW 1500FT)' },
        { id: 100040, title: 'LANDING' },

    ];
    $scope.sb_flightPhase = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsFlightPhase,
        displayExpr: 'title',
        placeholder: 'TOWING/PARKING/...',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.FlightPhaseId'

        }
    };

    ////////////////////////////////



    $scope.txt_airport = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.LOCAirport',

        }
    };

    $scope.txt_stand = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.LOCStand',

        }
    };

    $scope.txt_runway = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.LOCRunway',

        }
    };

    $scope.txt_geoPosAlt = {
        hoverStateEnabled: false,
        placeholder: 'Altitude',
        bindingOptions: {
            value: 'entity.LOCGEOAltitude',

        }
    };

    $scope.txt_geoPosLong = {
        hoverStateEnabled: false,
        placeholder: 'Longtitude',
        bindingOptions: {
            value: 'entity.LOCGEOLongtitude',

        }
    };
	
	 $scope.txt_result = {
        bindingOptions: {
            value: 'result.Result'
        }
    }


    ////////////////////////////////

    $scope.dsMET = [
        { id: 100051, title: 'IMC' },
        { id: 100052, title: 'VMC' },
    ];
    $scope.sb_MET = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsMET,
        displayExpr: 'title',
        placeholder: 'IMC/VMC',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.METId'

        }
    };

    ////////////////////////////////

    $scope.dsSignificantWxType = [
        { id: 100054, title: 'MODERATE' },
        { id: 100055, title: 'SEVERE' },
    ]
    $scope.sb_SignificantWxType = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsSignificantWxType,
        displayExpr: 'title',
        placeholder: 'MODERATE/SEVERE',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.SigxWXTypeId'

        }
    };

    $scope.dsSignificantWx = [
        { id: 100056, title: 'RAIN' },
        { id: 100057, title: 'SNOW' },
        { id: 100058, title: 'ICING' },
        { id: 100059, title: 'TURBULENCE' },
        { id: 100060, title: 'HAIL' },
        { id: 100061, title: 'STANDING - WATER' },
        { id: 100062, title: 'WINDSHEAR' },

    ];
    $scope.sb_SignificantWx = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsSignificantWx,
        displayExpr: 'title',
        placeholder: 'RAIN/SNOW/...',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.SigxWXId'

        }
    };
    ////////////////////////////////

    $scope.ActualWX = {
        bindingOptions: {
            value: 'entity.ActualWX',
            height: '80',

        }
    };

    ////////////////////////////////

    $scope.dsRunwayCondition = [
        { id: 100064, title: 'DRY' },
        { id: 100065, title: 'WET' },
        { id: 100066, title: 'ICE' },
        { id: 100067, title: 'SNOW' },
        { id: 100068, title: 'SLUSH' },

    ];
    $scope.sb_RunwayCondition = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsRunwayCondition,
        displayExpr: 'title',
        placeholder: 'DRY/WET/...',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.RunwayConditionId'

        }
    };

    ////////////////////////////////

    $scope.txt_AP = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigAP',

        }
    };

    $scope.txt_ATHR = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigATHR',

        }
    };

    $scope.txt_GEAR = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigGear',

        }
    };

    $scope.txt_FLAP = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigFlap',

        }
    };

    $scope.txt_SLAT = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigSlat',

        }
    };

    $scope.txt_SPOILERS = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ACConfigSpoilers',

        }
    };


    ////////////////////////////////

    $scope.Summary = {
        bindingOptions: {
            value: 'entity.Summary',
            height: '80',

        }
    };
    ///////////////////////////////
    $scope.Result = {
        bindingOptions: {
            value: 'entity.Result',
            height: '80',

        }
    };
    //////////////////////////////

    $scope.OthersInfo = {
        bindingOptions: {
            value: 'entity.OthersInfo',
            height: '80',

        }
    };

    ///////////////////////////////

    $scope.dsIncidentType = [
        { id: 100183, title: 'AIRMISS' },
        { id: 100184, title: 'ATC INCIDENT' },
        { id: 100185, title: 'TCAS RA' },

    ];
    $scope.sb_IncidentType = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsIncidentType,
        placeholder: 'AIRMISS/WET/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.IncidentTypeId'

        }
    };

    ///////////////////////////////

    $scope.dsRisk = [
        { id: 100070, title: 'Low' },
        { id: 100071, title: 'Med' },
        { id: 100072, title: 'High' },
    ];
    $scope.sb_Risk = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsRisk,
        placeholder: 'LOW/MED/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.AATRiskId'

        }
    };
    //////////////////////////////////
    $scope.dsAvoidingAction = [
        { value: true, title: 'YES' },
        { value: false, title: 'NO' },
    ];
    $scope.sb_AvoidingAction = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsAvoidingAction,
        placeholder: 'YES/NO',

        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.AATIsActionTaken'

        }
    };
    ///////////////////////////////
    $scope.txt_Reported = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATReportedToATC',

        }
    };
    $scope.txt_ATCInstruction = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATATCInstruction',

        }
    };

    $scope.txt_Frequency = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATFrequency',

        }
    };
    $scope.txt_Heading = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATHeading',

        }
    };
    $scope.txt_MinVertSep = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATMinVerticalSep',

        }
    };
    $scope.txt_MinHorizSep = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATMinHorizontalSep',

        }
    };

    $scope.dsTCASAlert = [
        { id: 100074, title: 'RA' },
        { id: 100075, title: 'TA' },
        { id: 100076, title: 'None' },
    ];
    $scope.sb_TCASAlert = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsTCASAlert,
        placeholder: 'RA/TA/...',

        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.AATTCASAlertId'

        }
    };

    $scope.txt_RAType = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATTypeRA',

        }
    };

    $scope.dsRAFollowed = [
        { value: true, title: 'YES' },
        { value: false, title: 'NO' },
    ];
    $scope.sb_RAFollowed = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsRAFollowed,
        placeholder: 'YES/NO',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.AATIsRAFollowed'

        }
    };

    $scope.txt_VerticalDeviation = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATVerticalDeviation',

        }
    };
    $scope.txt_OtherAircraft = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATOtherACType',

        }
    };
    $scope.txt_MarkingColour = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATMarkingColour',

        }
    };
    $scope.txt_CallSign = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATCallSign',

        }
    };
    $scope.txt_ClearedAltitude = {
        min: 0,
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATClearedAltitude',

        }
    };
    $scope.txt_Lighting = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.AATLighting',

        }
    };
    ////////////////////////////////

    $scope.txt_WTHeading = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.WTHeading',

        }
    };
    $scope.txt_BSHeading = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.BSHeading',

        }
    };
    $scope.dsTurning = [
        { id: 100078, title: 'Left' },
        { id: 100079, title: 'Right' },
        { id: 100080, title: 'No' },
    ];
    $scope.sb_Turning = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsTurning,
        placeholder: 'Left/Right/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.WTTurningId'

        }
    };

    $scope.sb_BSTurning = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsTurning,
        placeholder: 'Left/Right/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.BSTurningId'

        }
    };

    $scope.dsGlideSlopePos = [
        { id: 100082, title: 'High' },
        { id: 100083, title: 'Low' },
        { id: 100084, title: 'On' },

    ];
    $scope.sb_GlideSlopePos = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsGlideSlopePos,
        placeholder: 'High/Low/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.WTGlideSlopePosId'

        }
    };

    $scope.dsExtendedCenterlinePos = [
        { id: 100087, title: 'Left' },
        { id: 100088, title: 'Right' },
        { id: 100089, title: 'On' },

    ];
    $scope.sb_ExtendedCenterlinePos = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsExtendedCenterlinePos,
        placeholder: 'Left/Right/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.WTExtendedCenterlinePosId'

        }
    };

    $scope.dsAttitudeChange = [
        { id: 100091, title: 'Pitch' },
        { id: 100092, title: 'Roll' },
        { id: 100093, title: 'Yaw' },

    ];
    $scope.sb_AttitudeChange = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsAttitudeChange,
        placeholder: 'Pitch/Roll/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.WTAttitudeChangeId'

        }
    };
    $scope.txt_Deg = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.WTAttitudeChangeDeg',

        }
    };
    $scope.dsBuffet = [
        { value: true, title: 'YES' },
        { value: false, title: 'NO' },
    ];
    $scope.sb_IsBuffet = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsBuffet,
        placeholder: 'YES/NO',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.WTIsBuffet'

        }
    };
    $scope.dsStickShaker = [
        { value: true, title: 'YES' },
        { value: false, title: 'NO' },
    ];
    $scope.sb_StickShaker = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsStickShaker,
        placeholder: 'YES/NO',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.WTIsStickShaker'

        }
    };
    $scope.Suspect = {
        bindingOptions: {
            value: 'entity.WTSuspect',
            height: '80',

        }
    };
    $scope.Acceleration = {
        bindingOptions: {
            value: 'entity.WTDescribeVA',
            height: '80',

        }
    };
    $scope.Details = {
        bindingOptions: {
            value: 'entity.WTPrecedingAC',
            height: '80',

        }
    };
    $scope.dsAware = [
        { value: true, title: 'YES' },
        { value: false, title: 'NO' },
    ];
    $scope.sb_Aware = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsAware,
        placeholder: 'YES/NO',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.WTIsAware'

        }
    };
    ////////////////////////////////

    $scope.txt_BirdType = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.BSBirdType',

        }
    };

    $scope.dsTime = [
        { id: 100104, title: 'Dawn' },
        { id: 100105, title: 'Day' },
        { id: 100106, title: 'Dusk' },
        { id: 100107, title: 'Night' },


    ];
    $scope.sb_Time = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsTime,
        placeholder: 'Dawn/Day/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.BSTimeId'

        }
    };

    $scope.dsNrSeen = [
        { id: 100098, title: '1' },
        { id: 100099, title: '2-10' },
        { id: 100100, title: '11-100' },
        { id: 100101, title: 'More' },

    ];
    $scope.sb_NrSeen = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsNrSeen,
        placeholder: '1/2-10/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.BSNrSeenId'

        }
    };

    $scope.dsNrStruck = [
        { id: 100098, title: '1' },
        { id: 100099, title: '2-10' },
        { id: 100100, title: '11-100' },
        { id: 100101, title: 'More' },

    ];
    $scope.sb_NrStruck = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.dsNrStruck,
        placeholder: '1/2-10/...',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.BSNrStruckId'

        }
    };
    $scope.Impact = {
        bindingOptions: {
            value: 'entity.BSImpactDec',
            height: '80',

        }
    };

    $scope.dt_std = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'datetime',
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.STD',
        }
    };

    $scope.txt_reg = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    };

    $scope.num_no = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    };

   
    $scope.txt_route = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Route',
        }
    };

    $scope.dt_date = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'datetime',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.STD',
        }
    };

    $scope.txt_cap = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.P1Name',
        }
    };

    $scope.txt_fo = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.P2Name',
        }
    };

    $scope.txt_sccm = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.SIC',
        }
    };

  $scope.txt_ip = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.IPName',
        }
    };

   


    ///////////////////////////////

    $scope.tdWidth = $(window).width() / 31.0;
    $scope.rows = [-100, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
    $scope.columns = [-100, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    $scope.getTdClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }
        if (c == $scope.entity.AATXAbove && r == $scope.entity.AATYAbove) {
            cls += " ctd-selected";
        }

        return cls;

    }
    $scope.tableAboveClicked = function (r, c) {
        $scope.entity.AATXAbove = c;
        $scope.entity.AATYAbove = r;
    }



    $scope.getAsClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }


        if (c == $scope.entity.AATXAstern && r == $scope.entity.AATYAstern) {
            cls += " ctd-selected";
        }
        return cls;

    }
    $scope.tableAsternClicked = function (r, c) {
        $scope.entity.AATXAstern = c;
        $scope.entity.AATYAstern = r;
    }




    ////////////////////////////////
    $scope.isMaximise = true;
    $scope.maximise = function () {
        $scope.isMaximise = !$scope.isMaximise;
        //document.getElementById("#referForm").style.width = "100%"

    }

    $scope.getStyle = function(){
        var _width = '40%';
        if (!$scope.isMaximise)
            _width = '100%';
        return {
            'width':_width,
        }

    }


    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'asr')
            flightBagService.signDocLocal(prms, prms.doc).then(function (response) {
                $scope.isEditable = false;
                $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });

    $scope.tempData = null;
    $scope.$on('InitEfbAsr', function (event, prms) {


        $scope.tempData = prms;

        console.log($scope.tempData);

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.followUpEntity.ProducerId = parseInt($scope.tempData.ProducerId);
		$scope.followUpEntity.Priority = $scope.tempData.Priority;
        $scope.entity.FlightId = $scope.tempData.FlightId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;

		
        $scope.bind();
      

    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }


}]);


