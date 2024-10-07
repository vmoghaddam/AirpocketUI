'use strict';
app.controller('qaMaintenanceController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };


    $scope.followUpEntity = {
        Type: 3,
    }

    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_add_title = 'Maintenance Occurrence Reporting';
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
            $rootScope.$broadcast('onQAMaintenanceHide', null);
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
    $scope.fill = function (data) {
        $scope.entity = data;

    };
    $scope.isLockVisible = false;
    $scope.bind = function () {


        qaService.getMORCompnSpec().then(function (res) {
            $scope.dsComponentSpect = [];
            $.each(res.Data, function (_i, _d) {
                $scope.dsComponentSpect.push({ "id": _d.Id, "title": _d.Title });
            });

            qaService.getMORById($scope.followUpEntity.Id).then(function (res) {
                $scope.fill(res.Data);
            });

        });

        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.followUpEntity.isResponsible = true

        });

    };
    ////////////////////////////////
    $scope.scroll_qaMaintenance_height = $scope.popup_height - 12;
    $scope.scroll_qaMaintenance = {
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
            height: 'scroll_qaMaintenance_height'
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

    $scope.OPTCompn = []

    $scope.chkCompnSpec = function (index) {
        $scope.componentSpecification[index].checked = !$scope.componentSpecification[index].checked;
        $scope.entity.componentSpecificationId = $scope.componentSpecification[index].Id;
        console.log($scope.componentSpecification);
    }

    $scope.txt_station = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: "entity.station"

        }
    };

    $scope.txt_OccurrenceDate = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.DateReport',
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AircraftType',
        }
    }

    $scope.txt_acReg = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_atlNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ATLNo',
        }
    }

    $scope.txt_taskNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.TaskNo',
        }
    }

    $scope.txt_reference = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Reference',
        }
    }

    $scope.txt_time = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.UTCTime',
        }
    }

    $scope.txt_route = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightRoute',
        }
    }

    $scope.txt_fltNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }



    $scope.txt_event = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventDescription',
        }
    }
    $scope.txt_actionTaken = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ActionTakenDescription',
        }
    }

    $scope.txt_name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Name',
        }
    }

    $scope.txt_CAALicense = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.CAALicenceNo',
        }
    }

    $scope.txt_authNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AuthorizationNo',
        }
    }

    $scope.nb_serialNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.SerialNumber'
        }
    }

    $scope.nb_partNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PartNumber'
        }
    }

    $scope.sb_compn = {
        showClearButton: false,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        displayExpr: 'title',
        placeholder: 'Component',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ComponentSpecificationId',
            dataSource: 'dsComponentSpect'
        }
    };

    $scope.txt_comment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.comment'
        }
    }

    $scope.txt_result = {
        bindingOptions: {
            value: 'followUpEntity.Result'
        }
    }


    /////////////////////////////////
    $scope.$on('InitQAMaintenance', function (event, prms) {


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
        console.log("loaded");
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


