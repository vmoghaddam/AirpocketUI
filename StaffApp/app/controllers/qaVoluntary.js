'use strict';
app.controller('qaVoluntaryController', ['$scope', '$location', 'QAService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, QAService, authService, $routeParams, $rootScope, $window) {
    $scope.isEditable = true;
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null,
    };


    $scope.followUpEntity = {
        Type: 2,
        Feedback: "test test test test test test test test"
    }

    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = 'Voluntary Hazard Reporting';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'voluntary', icon: 'fas fa-signature', onClick: function (e) {

                        //var result = e.validationGroup.validate();

                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}


                        $scope.entity.Signed = "1";
                        /*  $scope.entity.FlightId = $scope.tempData.FlightId;*/
                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.followUpEntity.EntityId = $scope.entity.Id;
                        $scope.followUpEntity.ReferrerId = $scope.tempData.crewId;
                        $scope.followUpEntity.DateReferr = new Date();
                        $scope.followUpEntity.DateConfirmation = new Date();

                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');

                        $scope.loadingVisible = true
                        QAService.saveVHR($scope.entity).then(function (res) {

                            $scope.entity.Id = res.Data.Id;
                            $scope.followUpEntity.EntityId = res.Data.Id;
                            if (res.IsSuccess == true) {
                                $scope.entity.Id = res.Data.Id;
                                $scope.followUpEntity.EntityId = res.Data.Id;
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
                            }
                            else {
                                General.ShowNotify(Config.Text_SaveFailed, 'error');
                                $scope.entity.Id = -1;
                                $scope.followUpEntity.EntityId = -1;
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'voluntary', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.entity.EmployeeId = $scope.tempData.crewId;
                        $scope.entity.DateOccurrenceStr = moment(new Date($scope.entity.DateOccurrence)).format('YYYY-MM-DD-HH-mm');

                        $scope.entity.Signed = $scope.entity.DateSign ? "1" : null;

                        $scope.loadingVisible = true;
                        QAService.saveVHR($scope.entity).then(function (res) {
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
        onHiding: function (e) {
            $rootScope.IsRootSyncEnabled = true;
            $scope.entity = {
                Id: -1,
            };

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onQAVoluntaryHide', null);
            $scope.isLockVisible = false

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
        console.log(data);
        $scope.entity = data;
    };

    $scope.bind = function () {
        //QAService.getEmployee($scope.tempData.crewId).then(function (response) {
        //    $scope.entity.Email = response.Data.Email;
        //    $scope.entity.Name = response.Data.Name;
        //    $scope.entity.TelNumber = response.Data.Mobile;

        //});

        if ($scope.tempData.EntityId != null) {
            QAService.getVHRById($scope.tempData.EntityId).then(function (res) {
                $scope.fill(res.Data);
                $scope.isEditable = !$scope.entity.DateSign;


            });
        }
    };


    ////////////////////////////////
    $scope.scroll_qaVoluntary_height = $(window).height() - 130;
    $scope.scroll_qaVoluntary = {
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
            height: 'scroll_qaVoluntary_height'
        }

    };

    /////////////////////////////////




    $scope.txt_hazardDate = {
        hoverStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.DateReport',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_repDate = {
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_affectedArea = {
        hoverStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.AffectedArea',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_hazardDes = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.HazardDescription',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_recAction = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.RecommendedAction',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }


    $scope.txt_telNumber = {
        bindingOptions: {
            value: 'entity.TelNumber',
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

    $scope.txt_email = {
        bindingOptions: {
            value: 'entity.Email',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'

        }
    }


    $scope.txt_relatedDepartment = {
        bindingOptions: {
            value: 'entity.RelatedDepartment',
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
    $scope.$on('InitQAVoluntary', function (event, prms) {


        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

    $scope.$on('onAttachmentHide', function (event, prms) {
        $scope.entity.files = prms;
    });

}]);


