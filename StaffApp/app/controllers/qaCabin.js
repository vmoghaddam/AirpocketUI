'use strict';
app.controller('qaCabinController', ['$scope', '$location', 'QAService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, QAService, authService, $routeParams, $rootScope, $window) {
    $scope.isEditable = false;
    $scope.isFullScreen = true;
    $scope.fltInfo = false;

    $scope.entity = {
        Id: -1,
        EventTitleIds: [],
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null,
        files: null
    };

    $scope.followUpEntity = {
        Type: 0,
        Feedback: "test test test test test test test test"
    }


    ////////////////////////

    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = 'Cabin Hazard/Event Safety Report';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

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

                        $scope.entity.EventTitleIds = Enumerable.From($scope.eventTitle).Where(function (x) { return x.checked; }).Select('$.Id').ToArray();
                        var phaseid = Enumerable.From($scope.flightPhase).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.FlightPhaseId = phaseid ? phaseid : null;
                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');



                        $scope.loadingVisible = true
                        QAService.saveCSR($scope.entity).then(function (res) {

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
                            } else {
                                General.ShowNotify('error', 'error');
                            }
                            $scope.entity.files = [];
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'cabin', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        $scope.entity.FlightId = $scope.tempData.FlightId;
                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');


                        $scope.entity.EventTitleIds = Enumerable.From($scope.eventTitle).Where(function (x) { return x.checked; }).Select('$.Id').ToArray();
                        var phaseid = Enumerable.From($scope.flightPhase).Where(function (x) { return x.checked; }).Select('$.Id').FirstOrDefault();
                        $scope.entity.FlightPhaseId = phaseid ? phaseid : null;
                        $scope.entity.Signed = $scope.entity.DateSign ? "1" : null;

                        $scope.loadingVisible = true;
                        QAService.saveCSR($scope.entity).then(function (res) {
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
                EventTitleIds: [],

            };
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
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
    $scope.flight = null;

    $scope.chkFlightPhase = function (obj) {
        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.flightPhase, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.FlightPhaseId = _id;
            }
            else
                _d.checked = false;
        });


    }

    $scope.chkEventTitle = function (obj) {
        $.each($scope.eventTitle, function (_i, _d) {
            if (_d.Title.includes('Other')) {

                $scope.showOther = _d.checked;

            }
        });

    }
    $scope.fill = function (data) {
        $scope.entity = data.result;
        $.each($scope.flightPhase, function (_i, _d) {
            if (_d.Id == data.result.PhaseId)
                _d.checked = true;
        });
        $.each(data.CSREvent, function (_i, _d) {
            var et = Enumerable.From($scope.eventTitle).Where(function (x) { return x.Id == _d.EventTitleId; }).FirstOrDefault();
            if (et) {
                et.checked = true;
                if (et.Title.includes('Other')) {

                    $scope.showOther = true;

                }
            }
        });
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;

        QAService.getCabinReporter().then(function (res) {
            $scope.ds_reporter = res.Data;
        });

        QAService.getEventTitle().then(function (res) {
            $scope.eventTitle = res.Data;
            $.each($scope.eventTitle, function (_i, _d) {
                _d.checked = false;
            });


            QAService.getFlightPhase().then(function (res) {
                $scope.flightPhase = res.Data;


                if ($scope.entity.FlightId == null) {
                    if ($scope.tempData.EntityId != null) {
                        QAService.getCSRById($scope.tempData.EntityId).then(function (res) {
                            $scope.fill(res.Data);
                            $scope.isEditable = !$scope.entity.DateSign;
                        });
                    } else {
                        $scope.isEditable = true;
                    }
                } else {
                    $scope.fltInfo = true;
                    QAService.getCSRByFlightId($scope.entity.FlightId, $scope.tempData.crewId).then(function (res) {
                        if (res.Data.result.Id != null && res.Data.result.EmployeeId == $scope.tempData.crewId) {
                            $scope.fill(res.Data);
                            $scope.isEditable = !$scope.entity.DateSign;
                        }
                        else {
                            $scope.isEditable = true;
                            $scope.entity.FlightNumber = res.Data.result.FlightNumber;
                            $scope.entity.FlightSegment = res.Data.result.FlightSegment;
                            $scope.entity.PaxTotal = res.Data.result.PaxTotal;
                            $scope.entity.TypeRegisteration = res.Data.result.TypeRegisteration;
                            $scope.entity.Name = res.Data.result.EmployeeName;
                            $scope.entity.DateOccurrence = res.Data.result.DateOccurrence;

                        }

                    });
                }
            });



        });
    };


    ////////////////////////////////
    $scope.scroll_qaCabin_height = $(window).height() - 130;
    $scope.scroll_qaCabin = {
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
            height: 'scroll_qaCabin_height'
        }

    };

    /////////////////////////////////


    $scope.sb_reporter = {
        showClearButton: false,
        searchEnabled: false,
        placeholder: '',
        displayExpr: 'Title',
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.ReporterId',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable',
            dataSource: 'ds_reporter',
        }
    }

    $scope.txt_repFieldBy = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReportFiledBy',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_OccurrenceDate = {
        type: 'date',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            focusStateEnabled: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_OccurrenceTime = {

        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            focusStateEnabled: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.num_fltNum = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.FlightNumber',

        }
    }

    $scope.txt_fltSeg = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.FlightSegment',
        }
    }

    $scope.txt_eventOther = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventTitleRemark',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_eventLoc = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventLocation',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.TypeRegisteration',
        }
    }

    $scope.num_PAXNum = {
        readOnly: true,
        useMaskBehavior: false,
        bindingOptions: {
            value: 'entity.PaxTotal',
        }
    }



    $scope.txt_desOccurrence = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Describtion',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }
    $scope.txt_Rec = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Recommendation',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_wxCondition = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.WeatherCondition',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.num_refNumber = {
        min: 0,
        bindingOptions: {
            value: 'entity.RefNumber',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_BOX = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.BOX',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_refNumber = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.RefNumber',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_Name = {
        bindingOptions: {
            value: 'entity.Name',
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
    $scope.$on('InitQACabin', function (event, prms) {


        $scope.tempData = null;

        $scope.tempData = prms;



        $scope.popup_add_visible = true;

    });

    $scope.$on('onAttachmentHide', function (event, prms) {
        $scope.entity.files = prms;
    });



}]);

