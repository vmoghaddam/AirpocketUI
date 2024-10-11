'use strict';
app.controller('qaCabinController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;

    var detector = new MobileDetect(window.navigator.userAgent);

    //if (detector.mobile() && !detector.tablet())
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        EventTitleIds: [],
    };

    $scope.followUpEntity = {
        Type: 0,
    }

    $scope.fpoptions = [];
    $scope.etoptions = [];




    ////////////////////////

    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_add_title = 'Cabin Safety Report (C.S.R)';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Referre', onClick: function (e) {

                        $rootScope.$broadcast('InitQAEmployee', { Type: $scope.followUpEntity.Type, Id: $scope.entity.Id, Category: $scope.followUpEntity.Category });
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
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            $rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {
            //$rootScope.IsRootSyncEnabled = true;
            //$scope.clearEntity();
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],

            };
            $scope.entity.Result = null;
            $scope.fpoptions = [];
            $scope.etoptions = [];
            $scope.popup_add_visible = false;
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
            'toolbarItems[0].visible': 'isNotLocked',
            'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };



    /////////////////////////////////
    $scope.fill = function (data) {
        $scope.entity = data.result;
        $scope.entity.EventTitleIds = [];
        $.each($scope.flightPhase, function (_i, _d) {
            if (_d.Id == data.result.PhaseId)
                _d.checked = true;
        });
        $.each(data.CSREvent, function (_i, _d) {
            $scope.etoptions[_d.EventTitleId] = true;
        });

    };
    $scope.isLockVisible = false;
    $scope.bind = function () {


        qaService.getEventTitle().then(function (res) {
            $scope.eventTitle = res.Data;

        });

        qaService.getFlightPhase().then(function (res) {
            $scope.flightPhase = res.Data;
            qaService.getCSRById($scope.followUpEntity.Id).then(function (res) {
                $scope.fill(res.Data);
            });
        });


        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.followUpEntity.isResponsible = true

        });

    };
    ////////////////////////////////
    $scope.scroll_qaCabin_height = $scope.popup_height - 12;
    $scope.scroll_qaCabin = {
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
            height: 'scroll_qaCabin_height'
        }

    };

    $scope.scroll_referre_height = $scope.popup_height - 300;
    $scope.scroll_referre = {
        width: 590,
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
            height: 'scroll_referre_height'
        }

    };

    /////////////////////////////////









    $scope.chkFlightPhase = function (index) {
        $scope.flightPhase[index].checked = !$scope.flightPhase[index].checked;
        console.log($scope.fpoptions);
        $scope.entity.FlightPhaseId = $scope.flightPhase[index].Id;
    }

    $scope.chkEventTitle = function (index) {
        $scope.eventTitle[index].checked = !$scope.eventTitle[index].checked;

        $.each($scope.eventTitle, function (_i, _d) {
            if (_d.Title.includes('Other')) {
                if (_d.checked)
                    $scope.showOther = true;
                else
                    $scope.showOther = false;
            }
        });

        $scope.entity.EventTitleIds.push($scope.eventTitle[index].Id);

    }

    $scope.txt_repFieldBy = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReportFiledBy',
        }
    }

    $scope.txt_OccurrenceDate = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.OccurrenceDateTime',
        }
    }

    $scope.num_fltNum = {
        min: 0,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_fltSeg = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightSegment',
        }
    }

    $scope.txt_eventOther = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventTitleRemark',
        }
    }

    $scope.txt_eventLoc = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventLocation',
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.TypeRegisteration',
        }
    }

    $scope.num_PAXNum = {
        min: 0,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PaxTotal',
        }
    }



    $scope.txt_desOccurrence = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Describtion',
        }
    }
    $scope.txt_Rec = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Recommendation',
        }
    }

    $scope.txt_wxCondition = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WeatherCondition',
        }
    }

    $scope.num_refNumber = {
        min: 0,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.RefNumber',
        }
    }

    $scope.txt_BOX = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.BOX',
        }
    }

    $scope.txt_Name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Name',
        }
    }

    $scope.txt_recived = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Recived',
        }
    }

    $scope.txt_followup = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FollowUp',
        }
    }

    $scope.txt_result = {
        bindingOptions: {
            value: 'entity.Result'
        }
    }

    ////////////////////////////////


    $scope.$on('InitQACabin', function (event, prms) {


        $scope.tempData = null;

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

