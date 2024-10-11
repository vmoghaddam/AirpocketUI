'use strict';
app.controller('qaDispatchController', ['$scope', '$location', 'QAService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, QAService, authService, $routeParams, $rootScope, $window) {
    $scope.isEditable = false;
    $scope.isFullScreen = true;
    $scope.fltInfo = false;



    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "Operation", id: 'operation' },
        { text: "Dispatch", id: 'dispatch' },
    ];


    $scope.entity = {
        Id: -1,
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null
    };

    $scope.followUpEntity = {
        Type: 6,
        Feedback: "test test test test test test test test"
    }




    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'dispatch':

                    break;

                case 'operation':

                    break;

                default:
                    break;
            }

        }
        catch (e) {

        }


    });

    $scope.$watch("popupselectedTabIndex", function (newValue) {
        try {
            $('.tabEx').hide();
            var id = $scope.popup_tabs[newValue].id;
            $scope.popupselectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {

                case 'failedItems':

                    break;

                case 'failed':

                    break;

                default:
                    break;
            }
            if ($scope.dg_failed_instance)
                $scope.dg_failed_instance.refresh();
            if ($scope.dg_res_instance)
                $scope.dg_res_instance.refresh();

        }
        catch (e) {

        }


    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

    $scope.popup_tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
        },
        onItemRendered: function (e) {
            $scope.popupselectedTabIndex = -1;
            $scope.popupselectedTabIndex = 0;
        },
        bindingOptions: {
            dataSource: { dataPath: "popup_tabs", deep: true },
            selectedIndex: 'popupselectedTabIndex'
        }

    };





    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = 'Dispatch Hazard/Event Safety Report Form';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'dispatch', icon: 'fas fa-signature', onClick: function (e) {

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


                        var opcatagoryid = Enumerable.From($scope.opCatagory).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        var discatagoryid = Enumerable.From($scope.disCatagory).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        if (opcatagoryid != null)
                            $scope.entity.OpCatagoryId = opcatagoryid ? opcatagoryid : null;
                        else
                            $scope.entity.DisCatagoryId = discatagoryid ? discatagoryid : null;


                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');

                        $scope.loadingVisible = true
                        QAService.saveDispatch($scope.entity).then(function (res) {

                            $scope.entity.Id = res.Data.Id;
                            $scope.followUpEntity.EntityId = res.Data.Id;
                            if (res.IsSuccess == true) {
                                QAService.saveFollowUp($scope.followUpEntity).then(function (response) {

                                    $scope.loadingVisible = false;
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                    $scope.popup_add_visible = false;
                                    if ($scope.tempData.Status == "Not Signed") {
                                        var row = Enumerable.From($rootScope.ds_active).Where("$.EntityId==" + $scope.entity.Id).FirstOrDefault();
                                        row.Status = "In Progress";
                                    }

                                    $scope.popup_add_visible = false;

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                QAService.saveFeedBack($scope.followUpEntity).then(function (response) {
                                    console.log(response);
                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                $scope.entity.files = [];
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'dispatch', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.entity.FlightId = $scope.tempData.FlightId;
                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');
                        $scope.entity.ACChangedTimeStr = moment(new Date($scope.entity.ACChangedTime)).format('HH:mm');
                        $scope.entity.CrewChangedTimeStr = moment(new Date($scope.entity.CrewChangedTime)).format('HH:mm');
                        $scope.entity.FlightPerFormedTimeStr = moment(new Date($scope.entity.FlightPerFormedTime)).format('HH:mm');
                        $scope.entity.FlightCancelledTimeStr = moment(new Date($scope.entity.FlightCancelledTime)).format('HH:mm');



                        var damageid = Enumerable.From($scope.damageBy).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.DamageById = damageid ? damageid : null;

                        var lightingid = Enumerable.From($scope.lighting).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.WXLightingId = lightingid ? lightingid : null;



                        $scope.entity.Signed = $scope.entity.DateSign ? "1" : null;

                        $scope.loadingVisible = true;
                        QAService.saveDispatch($scope.entity).then(function (res) {
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
            $rootScope.$broadcast('onQADispatchHide', null);


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
    $scope.fill = function (data) {

        $scope.entity = data;
        $.each($scope.opCatagory, function (_i, _d) {

            if (_d.Id == data.OpCatagoryId)
                _d.checked = true;
        });

        $.each($scope.disCatagory, function (_i, _d) {
            if (_d.Id == data.DisCatagoryId)
                _d.checked = true;
        });




    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;

        QAService.getOPCatagory().then(function (res) {
            $scope.opCatagory = res.Data
        });

        QAService.getDISCatagory().then(function (res) {
            $scope.disCatagory = res.Data
            if ($scope.entity.FlightId == null) {
                if ($scope.tempData.EntityId != null) {
                    QAService.getDHRById($scope.tempData.EntityId).then(function (res) {
                        $scope.fill(res.Data);
                        $scope.isEditable = !$scope.entity.DateSign;
                    });
                } else {
                    $scope.isEditable = true
                }
            } else {
                QAService.getDHRByFlightId($scope.tempData.crewId, $scope.entity.FlightId).then(function (res) {
                    if (res.Data.Id != null) {
                        $scope.fill(res.Data);
                        $scope.isEditable = !$scope.entity.DateSign;
                    }
                    else {
                        $scope.entity.FlightNumber = res.Data.FlightNumber;
                        $scope.entity.Route = res.Data.Route;
                        $scope.entity.Register = res.Data.Register;
                        $scope.entity.EmployeeName = res.Data.EmployeeName;
                        $scope.entity.Email = res.Data.Email;
                        $scope.entity.Mobile = res.Data.Mobile;
                        $scope.entity.DateOccurrence = res.Data.DateOccurrence;
                        $scope.fltInfo = true;
                        $scope.isEditable = true;
                    }

                });
            }
        });




    };


    ////////////////////////////////
    $scope.scroll_qaDispatch_height = $(window).height() - 130;
    $scope.scroll_qaDispatch = {
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
            height: 'scroll_qaDispatch_height'
        }

    };

    /////////////////////////////////


    $scope.chkOPCatagory = function (obj) {

        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.opCatagory, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.OpCatagoryId = _id;
            }
            else
                _d.checked = false;

        });
    }


    $scope.chkDISCatagory = function (obj) {

        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.disCatagory, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.DisCatagoryId = _id;
            }
            else
                _d.checked = false;

        });
    }




    $scope.txt_dateReport = {
        hoverStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.DateReport',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_hazardDate = {
        hoverStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.DateTimeHazard',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_dateReport = {
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_opReportTime = {
        hoverStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity.OPTimeReceived',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_reporterPosision = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReporterPosition',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_reporterName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReporterName',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_opReporterName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPReportedBy',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_eventLocation = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPLocation',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_DisActionResult = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.DISActionResult',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_jobPos = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.JobPosition',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.ds_status = [
        { id: false, title: "NO" },
        { id: true, title: "YES" }
    ];

    $scope.sb_fltCancelled = {
        hoverStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.FlightCancelled',
        }
    }

    $scope.txt_fltCancelledTime = {
        hoverStateEnabled: false,
        useMaskBehavior: true,
        displayFormat: 'HH:mm',
        type: 'time',
        pickerType: "rollers",
        bindingOptions: {
            value: 'entity.FlightCancelledTime',
        }
    }


    $scope.sb_acChanged = {
        hoverStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ACChanged',
        }
    }

    $scope.txt_acChangeTime = {
        hoverStateEnabled: false,
        useMaskBehavior: true,
        displayFormat: 'HH:mm',
        type: 'time',
        pickerType: "rollers",
        bindingOptions: {
            value: 'entity.ACChangedTime',
        }
    }


    $scope.sb_crewChanged = {
        hoverStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.CrewChanged',
        }
    }

    $scope.txt_crewChangeTime = {
        hoverStateEnabled: false,
        useMaskBehavior: true,
        displayFormat: 'HH:mm',
        type: 'time',
        pickerType: "rollers",
        bindingOptions: {
            value: 'entity.CrewChangedTime',
        }
    }


    $scope.sb_fltPerformed = {
        hoverStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.FlightPerformed',
        }
    }

    $scope.txt_fltPerformedTime = {
        hoverStateEnabled: false,
        useMaskBehavior: true,
        displayFormat: 'HH:mm',
        type: 'time',
        pickerType: "rollers",
        bindingOptions: {
            value: 'entity.FlightPerformedTime',
        }
    }

    $scope.txt_PIC = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.PIC',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

   $scope.txt_opEventSummery = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPSummary',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_email = {
        bindingOptions: {
            value: 'entity.Email',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'

        }
    }

    $scope.txt_telNumber = {
        bindingOptions: {
            value: 'entity.Mobile',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'

        }
    }

    $scope.txt_name = {
        bindingOptions: {
            value: 'entity.EmployeeName',
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
    $scope.$on('InitQADispatch', function (event, prms) {


        $scope.tempData = null;
        $scope.tempData = prms;


        $scope.popup_add_visible = true;
    });


    $scope.$on('onAttachmentHide', function (event, prms) {
        $scope.entity.files = prms;
    });



}]);


