'use strict';
app.controller('formsController', ['$scope', '$location', '$routeParams', '$rootScope', '$window', 'flightService', 'authService', 'notificationService', '$route', 'activityService', function ($scope, $location, $routeParams, $rootScope, $window, flightService, authService, notificationService, $route, activityService) {
    $scope.prms = $routeParams.prms;

    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return moment(dt).format('YYYY-MMM-DD');
    };


    $scope.scroll_height = $(window).height() - 110;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            $scope.bind();

            options.component.release();

        },
        bindingOptions: { height: 'scroll_height', }
    };

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

    $scope.popup_newform_visible = false;
    $scope.popup_newform = {
        height: 450,
        width: 400,
        title: 'Request',
        showTitle: true,

        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {
                        var _rstr = Enumerable.From($scope.reasons).Where('$.id==' + $scope.reason).FirstOrDefault().title;
                        var dto = {
                            UserId: $rootScope.employeeId,
                            DateFrom: new Date($scope.dt_from),
                            DateTo: new Date($scope.dt_to),
                            ReasonStr: _rstr,
                            Reason: $scope.reason,
                            Remark: $scope.remark,
                            OperatorId: -1,
                            Id: -1,
                        };
                        $scope.loadingVisible = true;
                        flightService.updateFormVacation(dto).then(function (response) {
                            $scope.loadingVisible = false;

                            $scope.bind();
                            $scope.popup_newform_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_newform_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {

        },
        onHiding: function () {

            //$scope.clearEntity();

            $scope.popup_newform_visible = false;

        },
        onContentReady: function (e) {

        },
        fullScreen: true,
        bindingOptions: {
            visible: 'popup_newform_visible',


        }
    };

    $scope.dt_from = new Date();
    $scope.date_from = {
        type: "date",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd",

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.dt_to = new Date();
    $scope.date_to = {
        type: "date",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd",

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'dt_to',

        }
    };
    $scope.reasons = [
        { id: 1, title: 'Vacation' },
        { id: 2, title: 'Medical Care' },
        { id: 8, title: 'Off' },
        { id: 3, title: 'Other' },
    ];

    $scope.reason = 1;
    $scope.sb_reason = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.reasons,
        displayExpr: 'title',
        placeholder: '',
        valueExpr: 'id',
        bindingOptions: {
            value: 'reason'

        }
    };

    $scope.remark = '';
    $scope.txt_remark = {
        rtlEnabled: true,
        bindingOptions: {
            value: 'remark',
            height: '120',

        }
    };

    $scope.bind = function () {

        $scope.loadingVisible = true;
        flightService.getForms($rootScope.employeeId).then(function (response) {
            $scope.loadingVisible = false;

            $scope.ds = response;
            // console.log('PIFs:');
            console.log(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.FormClick = function (x) {
        $.each($scope.ds, function (_i, _d) {
            _d.selected = false;
            if (_d.Id == x.Id)
                _d.selected = true;
        });
    };
    $scope.getFormClass = function (x) {
        return x.selected ? "form-selected" : "";
    };
    $scope.getStatusClass = function (x) {
        if (!x.Status)
            return "";
        return x.Status == 'Accepted' ? "st-accepted" : "st-rejected";
    };
    $scope.$on('new_form', function (evt, data) {
        $scope.popup_newform_visible = true;

    });

    $scope.$on('delete_form', function (evt, data) {
        var item = Enumerable.From($scope.ds).Where('$.selected').FirstOrDefault();

        if (item) {
            if (item.Status) {
                General.ShowNotify('The selected Request cannot be deleted.', 'error');
                return;
            }
            $scope.loadingVisible = true;
            flightService.deleteFormVacation({ id: item.Id }).then(function (response) {
                $scope.loadingVisible = false;

                $scope.ds = Enumerable.From($scope.ds).Where('$.Id!=' + item.Id).ToArray();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    });
    $scope.$on('$viewContentLoaded', function () {

        $scope.bind();
    });


    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        //alert('w: '+$(window).width());

        $scope.$apply(function () {
            $scope.scroll_height = $(window).height() - 110;
        });
    });
    ///////////////////////////////////////

}]);