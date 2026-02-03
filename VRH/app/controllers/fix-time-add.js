'use strict';
app.controller('fix-time-addController', ['$scope', '$compile', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', 'flightBagService', '$sce', function ($scope, $compile, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, flightBagService, $sce) {



    $scope.ds_fix_time = [];
    $scope.entity = {
        Route: null,
        Duration: null,
        remark: null
    };
    $scope.dg_fix_time_columns = [
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 170 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 170 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250 }
    ];


    $scope.dg_fix_time = {

        height: $(window).height() - 110,
        selection: { mode: 'single' },
        scrolling: { mode: 'infinite' },
        showRowLines: true,
        showColumnLines: true,
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        //dataSource: $scope.ds_fix_time,
        columns: $scope.dg_fix_time_columns,

        onInitialized: function (e) {
            $scope.dgInstance = e.component;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            $scope.selectedRow = data;
        },

        bindingOptions: {
            dataSource: 'ds_fix_time'
        }

    };

    //////////////////////////

    $scope.txt_from = {
        bindingOptions: {
            value: 'entity.from',
        }
    };
    $scope.txt_to = {
        bindingOptions: {
            value: 'entity.to',
        }
    };
    $scope.num_hr = {
        min: 0,
        bindingOptions: {
            value: 'entity.hours',
        }
    };
    $scope.num_min = {
        min: 0,
        bindingOptions: {
            value: 'entity.minutes',
        }
    };
    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity.remark',
        }
    };

    //////////////////////////

    $scope.popup_add_visible = false;


    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        width: 120,
        onClick: function () {
            $scope.entity = { Route: "", Duration: "", remark: "" };
            $scope.popup_add_visible = true;
            $scope.$applyAsync();
        }
    };

    $scope.popup_add = {
        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Save', icon: 'check',
                    onClick: function () {
                        $scope.loadingVisible = true;
                        flightService.save_fixtime($scope.entity).then(function (response2) {
                            $scope.loadingVisible = false;
                            if (response2.IsSuccess) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');

                              
                                var existing = null;
                                $.each($scope.ds_fix_time, function (_i, _d) {
                                    if (_d.Route == $scope.entity.from.toUpperCase() + '-' + $scope.entity.to.toUpperCase()) {
                                        existing = _d
                                    }
                                });


                              
                                if (existing) {
                                    $.each($scope.ds_fix_time, function (_i, _d) {
                                        if (_d.Route == $scope.entity.from.toUpperCase() + '-' + $scope.entity.to.toUpperCase()) {
                                            _d.Duration = $scope.entity.hours * 60 + $scope.entity.minutes;
                                            _d.remark = $scope.entity.remark;
                                            $scope.dgInstance.refresh();
                                        }
                                    });
                                } else {
                                    $scope.ds_fix_time.push(angular.copy($scope.entity));
                                }



                                if ($scope.dgInstance) $scope.dgInstance.refresh();

                                $scope.popup_add_visible = false;
                            } else {
                                General.ShowNotify('Failed to save', 'error');
                            }
                        }, function (err) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(err.message || 'Error occurred', 'error');
                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', icon: 'remove',
                    onClick: function () {
                        $scope.popup_add_visible = false;
                    }
                }, toolbar: 'bottom'
            },
        ],
        width: 380,
        height: 380,
        showTitle: true,
        title: "Add FixTime",
        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "popup_add_visible"
        },
    };


    $scope.popup_edit_visible = false;

    function minutesToHoursMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return { hours, minutes };
    }

    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        width: 120,
        bindingOptions: {},
        onClick: function () {
            if (!$scope.selectedRow) {
                DevExpress.ui.notify("Please select a row to edit", "error", 3000);
                return;
            }

            $scope.entity = angular.copy($scope.selectedRow);
            var routes = $scope.entity.Route.split("-");
            $scope.entity.from = routes[0];
            $scope.entity.to = routes[1];
            $scope.entity.hours = minutesToHoursMinutes($scope.entity.Duration).hours;
            $scope.entity.minutes = minutesToHoursMinutes($scope.entity.Duration).minutes;
            $scope.popup_add_visible = true;
        }
    };





    $scope.bind = function () {

        $scope.loadingVisible = true;
        flightService.get_fixtime().then(function (data) {
            $scope.loadingVisible = false;
            $scope.ds_fix_time = data;
            $scope.dg_fix_time.dataSource = data;
            if ($scope.dgInstance) {
                $scope.dgInstance.option('dataSource', data);
                $scope.dgInstance.refresh();
            }

        }).catch(function (errorMsg) {
            console.error("Error loading fixtimes:", errorMsg);
        });

    };

    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            if (!$scope.selectedRow) {
                DevExpress.ui.notify("Please select a row to delete", "error", 3000);
                return;
            }
            
            flightService.delete_fixtime($scope.selectedRow).then(function (response) {
                if (response.IsSuccess) {
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    const index = $scope.ds_fix_time.indexOf($scope.selectedRow);
                    if (index !== -1) {
                        $scope.ds_fix_time.splice(index, 1);
                        $scope.entity.FixTimes = angular.copy($scope.ds_fix_time);
                        $scope.selectedRow = null;
                        let gridInstance = $("#dg_fix_time").dxDataGrid("instance");
                        gridInstance.refresh();
                    }
                } else {
                    General.ShowNotify("Save failed", "error");
                }
            });

            
        }

    };


    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = ' > Fix Time';
    }


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
    };
    $scope.$on('$viewContentLoaded', function () {
        $scope.bind();
    });


}]);