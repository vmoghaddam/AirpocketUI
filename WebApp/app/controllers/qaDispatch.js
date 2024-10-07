'use strict';
app.controller('qaDispatchController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $scope.followUpEntity = {
        Type: 6,
    }

    $scope.optOPCatagory = [];
    $scope.optDISCatagory = [];


    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_add_title = 'Dispatch Hazard Report';
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
            $rootScope.IsRootSyncEnabled = true;
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
        $.each($scope.opCatagory, function (_i, _d) {

            if (_d.Id == data.CatagoryId)
                _d.checked = true;
        });

        $.each($scope.disCatagory, function (_i, _d) {
            if (_d.Id == data.CatagoryId)
                _d.checked = true;
        });




    };


    $scope.bind = function () {

        qaService.getOPCatagory().then(function (res) {
            $scope.opCatagory = res.Data

        });
        qaService.getDISCatagory().then(function (res) {
            $scope.disCatagory = res.Data
            console.log($scope.disCatagory);
            qaService.getDHRById($scope.followUpEntity.Id).then(function (res) {
                $scope.fill(res.Data);
            });
        });


        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.followUpEntity.isResponsible = true
        });


    };
    ////////////////////////////////
    $scope.scroll_qaDispatch_height = $scope.popup_height - 12;
    $scope.scroll_qaDispatch = {
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
            height: 'scroll_qaDispatch_height'
        }

    };




    /////////////////////////////////


    $scope.chkOPCatagory = function (index) {
        $scope.opCatagory[index].checked = !$scope.opCatagory[index].checked;
        $scope.entity.OPCatagoryId = $scope.opCatagory[index].Id;
    }

    $scope.chkDISCatagory = function (index) {

        $scope.disCatagory[index].checked = !$scope.disCatagory[index].checked;
        $scope.entity.DISCatagoryId = $scope.opCatagory[index].Id;
    }



    $scope.txt_dateReport = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.DateReport',
        }
    }

    $scope.ds_type = [
        { id: 0, title: "In Flight Operation" },
        { id: 1, title: "In Flight Dispatch Process" }
    ];

    $scope.sb_occuranceType = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_type,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.Type',
        }
    }

    $scope.txt_hazardDate = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.DateTimeHazard',
        }
    }

    $scope.txt_opEventDate = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.OPDateTimeEvent',
        }
    }

    $scope.txt_opReportTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity.DateTimeHazard',
        }
    }

    $scope.txt_opReporterName = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPReportedBy',
        }
    }


    $scope.txt_ActionTaken = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remarks',
        }
    }

    $scope.txt_eventLocation = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPLocation',
        }
    }

    $scope.ds_status = [
        { id: 0, title: "NO" },
        { id: 1, title: "YES" }
    ];

    $scope.sb_fltCancelled = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity',
        }
    }

    $scope.txt_fltCancelledTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity',
        }
    }


    $scope.sb_acChanged = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity',
        }
    }

    $scope.txt_acChangeTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity',
        }
    }


    $scope.sb_crewChanged = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity',
        }
    }

    $scope.txt_crewChangeTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity',
        }
    }


    $scope.sb_fltPerformed = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity',
        }
    }

    $scope.txt_fltPerformedTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        bindingOptions: {
            value: 'entity',
        }
    }

    $scope.txt_opEventSummery = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPSummary',
        }
    }

    $scope.txt_comment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.comment'
        }
    }

    $scope.txt_result = {
        bindingOptions: {
            value: 'entity.Result'
        }
    }

    ////////////////////////////////

    $scope.tempData = null;

    $scope.$on('InitQADispatch', function (event, prms) {

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


