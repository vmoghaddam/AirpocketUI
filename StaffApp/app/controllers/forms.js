'use strict';
app.controller('formsController', ['$scope', '$location', '$routeParams', '$rootScope', '$window', 'flightService', 'authService', 'notificationService', '$route', 'activityService', 'QAService', function ($scope, $location, $routeParams, $rootScope, $window, flightService, authService, notificationService, $route, activityService, QAService) {
    $scope.flt = { ID: null };

    $scope.prms = $routeParams.prms;

    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return moment(dt).format('YYYY-MMM-DD');
    };

    $scope.formatDateTime = function (dt) {
        if (!dt)
            return "";
        return moment(dt).format('YYYY-MMM-DD HH:mm');
    };

    var tabs = [

        { text: "Closed", id: 'closed' },
        { text: "In Progress", id: 'inprogress' },
        { text: "Not Signed", id: 'notsigned' },


    ];
    $scope.tabs = tabs;

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;

        switch (id) {
            case 'closed':
                $scope.bind_closed();

                break;
            case 'inprogress':
                $scope.bind_inprogress();
                break;
            case 'notsigned':
                $scope.bind_notsigned();
                break;
            default:
                break;
        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.selectedTabIndex = 0;




    $scope.scroll_heightm = $(window).height() - 150;
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
        bindingOptions: { height: 'scroll_heightm', }
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

    $scope.showForm = function (obj) {
        var data = {
            FlightId: obj.FlightId,
            crewId: $rootScope.employeeId,
            Status: obj.Status,
            EntityId: obj.EntityId, 
        };

        switch (obj.type) {
            case 0:
                $rootScope.$broadcast('InitQACabin', data);
                break;
            case 1:
                $rootScope.$broadcast('InitQAGround', data);
                break;
            case 2:
                $rootScope.$broadcast('InitQAVoluntary', data);
                break;
            case 3:
                $rootScope.$broadcast('InitQAMaintenance', data);
                break;
            case 4:
                $rootScope.$broadcast('InitQACatering', data);
                break;
            case 5:
                $rootScope.$broadcast('InitQASecurity', data);
                break;
            case 6:
                $rootScope.$broadcast('InitQADispatch', data);
                break;
            case 7:
                $rootScope.$broadcast('InitQACyberSecurity', data);
                break;

        }
    }



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
        { id: 4, title: 'Standby AM' },
        { id: 5, title: 'Standby PM' },
        { id: 6, title: 'Standby AM (KIH)' },
        { id: 7, title: 'Standby PM (KIH)' },
        { id: 8, title: 'Off' },
        { id: 9, title: 'THR Flight' },
        { id: 10, title: 'KIH Flight' },
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

    $rootScope.ds_active = [];
    $scope.bind_closed = function () {
        $rootScope.ds_active = Enumerable.From($scope.ds).Where(function (x) { return x.Status == 'Closed'; }).ToArray();

    };
    $scope.bind_inprogress = function () {
        $rootScope.ds_active = Enumerable.From($scope.ds).Where(function (x) { return x.Status == 'In Progress'; }).ToArray();

    };
    $scope.bind_notsigned = function () {
        $rootScope.ds_active = Enumerable.From($scope.ds).Where(function (x) { return x.Status == 'Not Signed'; }).ToArray();

    };
    $scope.bind = function () {

        $scope.loadingVisible = true;
       
        QAService.getCreatorHistory($rootScope.employeeId).then(function (res) {
            $scope.loadingVisible = false;
            $scope.ds = res.Data;

            if ($scope.selectedTabIndex == 0)
                $scope.bind_closed();
            if ($scope.selectedTabIndex == 1)
                $scope.bind_inprogress();
            if ($scope.selectedTabIndex == 2)
                $scope.bind_notsigned();


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.FormClick = function (x) {
        alert('x');
        /* $.each($scope.ds, function (_i, _d) {
             _d.selected = false;
             if (_d.Id == x.Id)
                 _d.selected = true;
         });*/
    };
    $scope.getFormClass = function (x) {
        //return x.selected ? "form-selected":"";
        return "";
    };
    $scope.getHeaderClass = function (x) {

        switch (x.Status) {
            case 'Closed':
                return 'closed';
            case 'In Progress':
                return 'inprogress';
            case 'Not Signed':
                return 'notsigned';
            default:
                return "";
        }
    };
    $scope.getStatusClass = function (x) {
        if (!x.Status)
            return "";
        return x.Status == 'Accepted' ? "st-accepted" : "st-rejected";
    };
    $scope.$on('new_form', function (evt, data) {
        // $scope.popup_newform_visible = true;

        $scope.popup_select_visible = true;

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


    $scope.df = new Date();
    $scope.date_from = {
        displayFormat: "yyyy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        pickerType: "rollers",
        max: new Date(),
        useMaskBehavior: true,
        onValueChanged: function (e) {
            //$scope.bind();
            $scope.flt = null;
            $scope.bind_flts();
        },
        bindingOptions: {
            value: 'df'
        }
    };
    $scope.scroll_height = $(window).height() - 270;
    $scope.scroll_ft = {
        width: '100%',
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();

            options.component.release();

        },
        bindingOptions: { height: 'scroll_height', }
    };


    $scope.flt_no = null;
    $scope.flt = {ID: null};
    $scope.txt_route = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'flt_route',
        }
    };

    $scope.ds_flts = null;
    $scope.bind_flts = function () {
        $scope.flt_no = null;
        $scope.flt_route = null;
        var df = moment(new Date($scope.df)).format('YYYY-MM-DD');
        $scope.loadingVisible = true;
        flightService.getFlightsByDate(df).then(function (response) {
            $scope.loadingVisible = false;

            $scope.ds_flts = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


   
    $scope.sb_flts = {

        showClearButton: true,
        //searchEnabled: true,
        //searchExpr: ["FlightNumber"],
        placeholder: 'Flight No',
        displayExpr: "FlightNumber",
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.flt_no = null;
                $scope.flt_route = null;
                
            } else {

                $scope.flt_no = e.selectedItem.FlightNumber;
                $scope.flt_route = e.selectedItem.FromAirportIATA + '-' + e.selectedItem.ToAirportIATA + ' (' + e.selectedItem.Register + ') (' +
                    moment(new Date(e.selectedItem.STDLocal)).format('HH:mm') + ')';
            }

        },

        onValueChanged: function(e) {
            if (e.value === null) {
                $scope.flt = {ID: null};
            }
        },
        bindingOptions: {
            value: 'flt',
            dataSource: 'ds_flts',

        }

    };
    $scope.selected_type = '';
    $scope.type_click = function ($event, type) {

        $('._form_type').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.selected_type = type;

    }


   
    $scope.popup_select_visible = false;
    $scope.popup_select = {
        height: 450,
        width: 400,
        title: 'TYPE',
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'normal', text: 'Select', onClick: function (e) {
                        if ($scope.selected_type == "InitQAVoluntary") {
                            var data = { crewId: $rootScope.employeeId };
                            $rootScope.$broadcast($scope.selected_type, data);
                        }
                        else {
                            var fltId = $scope.flt.ID == null ? null : $scope.flt.ID
                            
                            var data = { FlightId: fltId, crewId: $rootScope.employeeId };
                            $rootScope.$broadcast($scope.selected_type, data);
                        }

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_select_visible = false;
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

            $scope.bind_flts();
        },
        onHiding: function () {

            //$scope.clearEntity();


            $scope.popup_newform_visible = false;
            $scope.bind();
        },
        onContentReady: function (e) {

        },
        fullScreen: true,
        bindingOptions: {
            visible: 'popup_select_visible',


        }
    };


    $scope.$on('$viewContentLoaded', function () {

        $scope.bind();
    });

    /////////////////

    $scope.$on('onQACabinHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQACateringHide', function () {

        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();

    });
    $scope.$on('onQAGroundHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQAMaintenanceHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQADispatchHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQASecurityHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQAVoluntaryHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });
    $scope.$on('onQACyberSecurityHide', function () {
        //$scope.bind_inprogress();
        //$scope.bind_notsigned();
        $scope.bind();
    });


    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        //alert('w: '+$(window).width());

        $scope.$apply(function () {
            $scope.scroll_height = $(window).height() - 150;
        });
    });
    ///////////////////////////////////////

}]);