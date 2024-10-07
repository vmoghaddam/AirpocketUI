'use strict';
app.controller('qaVoluntaryController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $scope.followUpEntity = {
        Type: 2,
    }


    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_add_title = 'Voluntary Hazard Reporting';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Referre', onClick: function (e) {

                        $rootScope.$broadcast('InitQAEmployee', { Type: $scope.followUpEntity.Type, Id: $scope.tempData.Id, Category: $scope.followUpEntity.Category });
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





        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.entity = {
                Id: -1,

            };
            $rootScope.followUpEntity.Result = null;
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onVhrHide', null);
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
    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {

        qaService.getVHRById($scope.entity.Id).then(function (response) {
            $scope.fill(response.Data);
            if ($scope.tempData.isNotDetermined == true)
                $scope.isSettled = true;
        })

        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.isResponsible = true

        });

    };
    ////////////////////////////////
    $scope.scroll_vhradd_height = $scope.popup_height - 12;
    $scope.scroll_vhradd = {
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
            height: 'scroll_vhradd_height'
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

    $scope.txt_hazardDate = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.HazardDate',
        }
    }

    $scope.txt_repDate = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReportDate',
        }
    }

    $scope.txt_affectedArea = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AffectedArea',
        }
    }

    $scope.txt_hazardDes = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.HazardDescription',
        }
    }

    $scope.txt_recAction = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.RecommendedAction',
        }
    }


    $scope.txt_telNumber = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.TelNumber',
        }
    }

    $scope.txt_Name = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Name',
        }
    }

    $scope.txt_email = {
        hoverStateEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
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

    $scope.tempData = null;

    ///////////////////////////////////

    $scope.$on('InitVHR', function (event, prms) {


        $scope.tempData = prms;
        $scope.entity.Id = $scope.tempData.Id;
        $scope.entity.Type = $scope.tempData.Type;
        $scope.entity.EmployeeId = $scope.tempData.EmployeeId;

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


