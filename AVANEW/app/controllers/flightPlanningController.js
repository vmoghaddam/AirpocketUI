'use strict';





app.controller('flightPlanningController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    // console.log($location.search());
    //////////////////////////////////

    $scope.filterVisible = false;
    $scope.IsNew = true;

    //$scope._filterConsts = {
    //    key: 'library',
    //    values: [
    //        { id: 'TypeId', value: $scope._type ? Number($scope._type) : -1 },
    //    ],

    //};

    //$scope.$on('FilterLoaded', function (event, prms) {
    //    $scope.$broadcast('initFilters', $scope._filterConsts);
    //});

    $scope.entity = {
        Id: null,
        Title: null,
        DateFrom: null,
        DateTo: null,
        DateFirst: null,
        DateLast: null,
        BaseId: null,
        iDateFrom: new Date(),
        iDateTo: new Date(),
        CustomerId: Config.CustomerId,
        IsActive: false,
        DateActive: null,
        Interval: 101,

        TypeId: null,
        RegisterID: null,
        FlightTypeID: null,
        FromAirport: null,
        ToAirport: null,
        STA: null,
        STD: null,
        FlightH: null,
        FlightM: null,
        FlightNumber: null,
        RouteId: null,

        FlightPlanId: -1,
        Months: [],
        Days: [],

    };
    $scope.refreshEntity = function () {
        $scope.entity.Id = -1;


        $scope.entity.DateFirst = null;
        $scope.entity.DateLast = null;
      //  $scope.entity.iDateFrom = new Date();
      //  $scope.entity.iDateTo = new Date();
        $scope.entity.CustomerId = Config.CustomerId;
        $scope.entity.IsActive = false;
        $scope.entity.DateActive = null;
        $scope.entity.Interval = 101;


        $scope.entity.FlightH = null;
        $scope.entity.FlightM = null;
        $scope.entity.FlightNumber = null;
        $scope.entity.RouteId = null;


    };
    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.BaseId = null;
        $scope.entity.Title = null;
        $scope.entity.DateFrom = null;
        $scope.entity.DateTo = null;
        $scope.entity.DateFirst = null;
        $scope.entity.DateLast = null;
        $scope.entity.iDateFrom = new Date();
        $scope.entity.iDateTo = new Date();
        $scope.entity.CustomerId = Config.CustomerId;
        $scope.entity.IsActive = false;
        $scope.entity.DateActive = null;
        $scope.entity.Interval = 101;

        $scope.entity.TypeId = null;
        $scope.entity.RegisterID = null;
        $scope.entity.FlightTypeID = null;
        $scope.entity.FromAirport = null;
        $scope.entity.ToAirport = null;
        $scope.entity.STA = null;
        $scope.entity.STD = null;
        $scope.entity.FlightH = null;
        $scope.entity.FlightM = null;
        $scope.entity.FlightNumber = null;
        $scope.entity.RouteId = null;

        $scope.entity.Months = [];
        $scope.entity.Days = [];
        $scope.data = [];
    };

    $scope.DotBlockToBlock = true;
    $scope.bindEntity = function (data) {
        $scope.DotBlockToBlock = false;
        $scope.entity.Id = data.Id;
        $scope.entity.BaseId = data.BaseId;
        $scope.entity.Title = data.Title;
        $scope.entity.DateFrom = data.DateFrom;
        $scope.entity.DateTo = data.DateTo;
        $scope.entity.DateFirst = data.DateFirst;
        $scope.entity.DateLast = data.DateLast;
        $scope.entity.iDateFrom = data.DateFrom;
        $scope.entity.iDateTo = data.DateTo;
        $scope.entity.CustomerId = data.CustomerId;
        $scope.entity.IsActive = data.IsActive;
        $scope.entity.DateActive = data.DateActive;
        $scope.entity.Interval = data.Interval;
        $scope.entity.Months = data.Months;
        $scope.entity.Days = data.Days;

        $scope.entity.FlightPlanId = data.FlightPlanId;
        $scope.entity.TypeId = data.TypeId;
        $scope.entity.RegisterID = data.RegisterID;
        $scope.entity.FlightTypeID = data.FlightTypeID;
        $scope.entity.AirlineOperatorsID = data.AirlineOperatorsID;
        $scope.entity.FlightNumber = data.FlightNumber;
        $scope.entity.FromAirport = data.FromAirport;
        $scope.entity.ToAirport = data.ToAirport;
        $scope.entity.STA = data.STA;
        $scope.entity.STD = data.STD;
        $scope.entity.FlightH = data.FlightH;
        $scope.entity.FlightM = data.FlightM;
        $scope.entity.FlightStatus = data.FlightStatus;

        $scope.start = new Date($scope.entity.STD);
        $scope.tempToAirport = $scope.entity.ToAirport;




    };

    ////////////////////////////////
    $scope.tempData = null;

    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                $('.book-side').removeClass('col-lg-12').addClass('col-lg-8');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                $('.book-side').removeClass('col-lg-8').addClass('col-lg-12');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
            }
        }

    };
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    flightService.deletePlanItem(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.addMode = false;
    $scope.appendMode = false;
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {


       

            //var dto = {
            //    OldPassword: 'Atrina1359@a',
            //    NewPassword: '1234@bB',
            //    ConfirmPassword: '1234@bB',
            //};
            //authService.changePassword(dto).then(function (response) {

                 



            //}, function (err) {   General.ShowNotify(err.message, 'error'); });

            //return;


            $scope.doRefresh = false;
            $scope.entity.Id = -1;
            $scope.tempData = null;
            $scope.IsNew = true;
            $scope.addMode = true;
            $scope.popup_add_visible = true;

        }

    };
    var offset = -1 * (new Date()).getTimezoneOffset();
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            //$scope.bindEntity($scope.dg_selected);
            $scope.loadingVisible = true;
            flightService.getFlightPlanItem($scope.dg_selected.Id, offset).then(function (response) {
                $scope.loadingVisible = false;
                $scope.IsNew = false;
                $scope.tempData = response;
                $scope.doRefresh = false;
                $scope.popup_add_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };


    $scope.btn_append = {
        text: 'Append',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            //$scope.bindEntity($scope.dg_selected);
            $scope.loadingVisible = true;
            flightService.getFlightPlanItem($scope.dg_selected.Id, offset).then(function (response) {
                $scope.loadingVisible = false;
                $scope.IsNew = true;
                $scope.tempData = response;
                $scope.doRefresh = false;
                $scope.popup_add_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };



    $scope.btn_approve = {
        text: 'Approve',
        type: 'default',
        icon: 'check',
        width: 150,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            $scope.loadingVisible = true;
            flightService.checkPlanErrors($scope.dg_selected.FlightPlanId).then(function (response) {
                $scope.loadingVisible = false;

                if (response > 0) {
                    General.ShowNotify('The plan has error(s).', 'error');
                    return;
                }


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





            General.Confirm(Config.Text_SimpleConfirm, function (res) {
                if (res) {

                    $scope.loadingVisible = true;
                    flightService.closePlan($scope.dg_selected.FlightPlanId).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });


        }

    };
    $scope.btn_gantt_base = {
        text: 'Gantt View (Base)',
        type: 'default',
        icon: 'rowfield',
        width: 210,
        onClick: function (e) {
            //$rootScope.$broadcast('InitFlightDesign', { planId: 1 });
            // return;
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;


            // $rootScope.$broadcast('InitFlightDesign', $scope.flightData);

            $rootScope.$broadcast('InitFlightPlanningGanttViewBase', $scope.dg_selected);




        }
    };
    $scope.btn_gantt = {
        text: 'Gantt View (All)',
        type: 'default',
        icon: 'rowfield',
        width: 200,
        onClick: function (e) {
            //$rootScope.$broadcast('InitFlightDesign', { planId: 1 });
            // return;
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;


            // $rootScope.$broadcast('InitFlightDesign', $scope.flightData);
            $rootScope.$broadcast('InitFlightPlanningGanttView', $scope.dg_selected);




        }

    };
    $scope.btn_grid = {
        text: 'Grid View',
        type: 'default',
        icon: 'menu',
        width: 140,
        onClick: function (e) {

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;



            $rootScope.$broadcast('InitFlightDesignGrid', $scope.dg_selected);




        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);

        }

    };
    $scope.entityInterval = {
        FlightPlanId: null,
        DateFrom: null,
        DateTo: null,
        Interval: null,
        BaseIATA: null,
        Register:null,
        Months: [],
        Days: [],
    };
    $scope.clearEntityInterval = function () {
        $scope.entityInterval.FlightPlanId = null;
        $scope.entityInterval.DateFrom = null;
        $scope.entityInterval.DateTo = null;
        $scope.entityInterval.Interval = null;
        $scope.entityInterval.BaseIATA = null;
        $scope.entityInterval.Register = null;
        $scope.entityInterval.Months = [];
        $scope.entityInterval.Days = [];
    };
    $scope.btn_interval = {
        text: 'Interval',
        type: 'default',
        icon: 'event',
        width: 150,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.entityInterval.FlightPlanId = $scope.dg_selected.FlightPlanId;
            $scope.entityInterval.DateFrom = $scope.dg_selected.DateFrom;
            $scope.entityInterval.DateTo = $scope.dg_selected.DateTo;
            $scope.entityInterval.Interval = $scope.dg_selected.Interval;
            $scope.entityInterval.BaseIATA = $scope.dg_selected.BaseIATA;
            $scope.entityInterval.Register = $scope.dg_selected.Register;
            $scope.entityInterval.Months = [];
            $scope.entityInterval.Days = [];
            console.log($scope.entityInterval);

            if ($scope.entityInterval.Interval == 100) {

            }
            else
                $scope.popup_interval_visible = true;


        }

    };
    //////////////////////////////////
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
    //////////////////////////////////
    var Knockoutdata = [
        {
            "TaskID": 1,
            "TaskName": "Parent Task 1",
            "StartDate": new Date("02/27/2017"),
            "EndDate": new Date("03/03/2017"),
            "Progress": "40",
            "Children": [
                { "TaskID": 2, "TaskName": "Child Task 1", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40" },
                { "TaskID": 3, "TaskName": "Child Task 2", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40", },
                { "TaskID": 4, "TaskName": "Child Task 3", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Duration": 5, "Progress": "40", }
            ]
        },
        {
            "TaskID": 5,
            "TaskName": "Parent Task 2",
            "StartDate": new Date("03/18/2017"),
            "EndDate": new Date("03/22/2017"),
            "Progress": "40",
            "Children": [
                { "TaskID": 6, "TaskName": "Child Task 1", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/10/2017"), "Progress": "40" },
                { "TaskID": 7, "TaskName": "Child Task 2", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/10/2017"), "Progress": "40", },
                { "TaskID": 8, "TaskName": "Child Task 3", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/10/2017"), "Progress": "40", },
                { "TaskID": 9, "TaskName": "Child Task 4", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/10/2017"), "Progress": "40" }
            ]
        },
        {
            "TaskID": 10,
            "TaskName": "Parent Task 3",
            "StartDate": new Date("03/13/2017"),
            "EndDate": new Date("03/17/2017"),
            "Progress": "40",
            "Children": [
                { "TaskID": 11, "TaskName": "Child Task 1", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40" },
                { "TaskID": 12, "TaskName": "Child Task 2", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
                { "TaskID": 13, "TaskName": "Child Task 3", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
                { "TaskID": 14, "TaskName": "Child Task 4", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
                { "TaskID": 15, "TaskName": "Child Task 5", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", }
            ]
        }

    ];

    function rowSelected() {
        var ganttObject = this,
            treeGridObj = ganttObject._$treegridHelper.ejTreeGrid("instance"),
            rowIndex;
        if (treeGridObj.model.selectedItem == null)
            rowIndex = 2;
        ganttObject._$treegridHelper.ejTreeGrid("updateScrollBar", rowIndex);
    }
    function load() {
        this.getColumns()[0].width = window.theme == "material" ? 60 : 30;
    }

    ////////////// ati flight///////////////
    $scope.Day0 = "05/06/2019";
    $scope.Day1 = "05/07/2019";
    $scope.Day2 = "05/07/2019 23:59:00.000";
    $scope.setArrival = function () {

        if ($scope.entity.STD != null && $scope.entity.FlightH != null && $scope.entity.FlightM != null) {
            var std = new Date($scope.entity.STD);
            console.log($scope.entity.STD);
            console.log($scope.entity.FlightH);
            console.log($scope.entity.FlightM);
            $scope.entity.STA = new Date(std.addHours($scope.entity.FlightH).addMinutes($scope.entity.FlightM));

        }
        else
            $scope.entity.STA = null;
    };

    $scope.isBaseDisabled = true;
    $scope.sb_Base = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {

            if (!$scope.isBaseDisabled)
                $scope.entity.FromAirport = arg.selectedItem.Id;
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.BaseId',
            disabled: 'isBaseDisabled'

        }
    };


    $scope.tempToAirport = null;
    $scope.selectedFromAirport = null;
    $scope.selectedToAirport = null;
    $scope.sb_FromAirport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();
            //frombani
            $scope.entity.ToAirport = null;
            if (!arg.selectedItem) {
                $scope.ds_toairport = [];
                $scope.entity.FromAirportIATA = null;
                return;
            }
            $scope.entity.FromAirportIATA = arg.selectedItem.IATA;
            $scope.loadingVisible = true;
            flightService.getRouteDestination(Config.AirlineId, arg.selectedItem.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds_toairport = response;
                if ($scope.tempToAirport) {
                    $scope.entity.ToAirport = $scope.tempToAirport;
                    $scope.tempToAirport = null;
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FromAirport',
            selectedItem: 'selectedFromAirport',
        }
    };

    $scope.ds_toairport = [];
    $scope.sb_ToAirport = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRouteTo(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();

            //mool
            if (arg.selectedItem) {
                $scope.entity.RouteId = arg.selectedItem.Id;
                if ($scope.DotBlockToBlock) {
                    $scope.entity.FlightH = arg.selectedItem.FlightH;
                    $scope.entity.FlightM = arg.selectedItem.FlightM;
                }
                else
                    $scope.DotBlockToBlock = true;
               
                $scope.entity.ToAirportIATA = arg.selectedItem.ToAirportIATA;
            }
            else {
                $scope.entity.RouteId = null;
                $scope.entity.FlightH = null;
                $scope.entity.FlightM = null;
                $scope.entity.ToAirportIATA = null;
            }
            $scope.setArrival();
        },
        searchExpr: ["ToAirportIATA", "ToCity"],
        displayExpr: "ToAirportIATA",
        valueExpr: 'ToAirportId',
        bindingOptions: {
            value: 'entity.ToAirport',
            selectedItem: 'selectedRoute',
            dataSource: 'ds_toairport'
        }
    };
    $scope.selectedRoute = null;

    $scope.start = null;
    $scope.time_start = {
        type: "time",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            //nook

            if (arg.value) {
                var d = new Date(arg.value);

                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                var dt = (new Date($scope.entity.iDateFrom)).getDatePartSlash()/* $scope.Day1*/ + " " + timestring;

                var std = new Date(dt);
                $scope.entity.STD = std;

            }
            else
                $scope.entity.STD = null;
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'start',

        }
    };
    $scope.time_end = {
        readOnly: true,
        type: "time",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'entity.STA',

        }
    };



    $scope.text_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightH',

        }
    };
    $scope.text_flightm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightM',

        }
    };
    $scope.text_flightnumber = {

        bindingOptions: {
            value: 'entity.FlightNumber',

        }
    };
    $scope.sb_flighttype = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FlightTypeID',

        }
    };

    $scope.selectedType = null;
    $scope.sb_type = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Type', 'Manufacturer'],
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',

        onSelectionChanged: function (arg) {
            $scope.ds_msn = [];
            $scope.msn_readOnly = true;
            if (arg && arg.selectedItem) {
                $scope.entity.AircraftType = arg.selectedItem.Type;
                aircraftService.getVirtualMSNsByType(Config.CustomerId, arg.selectedItem.Id).then(function (response) {

                    $scope.msn_readOnly = false;
                    $scope.ds_msn = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.msn_readOnly = true;
                $scope.ds_msn = [];
                $scope.entity.AircraftType = null;
            }
        },
        bindingOptions: {
            value: 'entity.TypeId',
            selectedItem: 'selectedType',


        }
    };
    //var today = new Date();
    //if (today.isDstObserved()) {
    //    alert("Daylight saving time!");
    //}
    $scope.ds_msn = [];
    $scope.msn_readOnly = true;
    $scope.unknown_readOnly = false;
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAircraft(data);
        //},
        searchExpr: ['Register', 'MSN'],
        //dataSource: $scope.ds_msn,
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            //koor
            
                if (arg.selectedItem) {
                    $scope.entity.Register = arg.selectedItem.Register;
                    var offset = -1 * (new Date()).getTimezoneOffset();
                    var dto = {
                        CustomerId: Config.CustomerId,
                        Date: new Date($scope.entity.iDateFrom).ToUTC(),
                        RegisterId: arg.selectedItem.ID,
                        Offset: offset
                    };
                    $scope.loadingVisible = true;
                    //dook
                    flightService.getPlanLastItem(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        if (!response || response.Id == -1) {
                            $scope.isBaseDisabled = false;
                        }
                        else {
                            $scope.isBaseDisabled = true;
                            $scope.entity.BaseId = response.BaseId;

                            if ($scope.IsNew) {

                                $scope.entity.FromAirport = response.ToAirport;
                                $scope.entity.ToAirport = null;
                                $scope.entity.STD = new Date(response.STA);
                                $scope.start = new Date($scope.entity.STD);

                            }
                            ///////////////////////////
                            flightService.getPlanItems(dto).then(function (response2) {
                                $scope.dg2_ds = response2;
                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                            ///////////////////////////
                        }


                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





                }
                else {
                    $scope.entity.Register = null;
                    $scope.entity.BaseId = null;
                    $scope.isBaseDisabled = true;
                }
          
            

        },
        bindingOptions: {
            value: 'entity.RegisterID',
            disabled: 'msn_readOnly',
            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    ////////////////////////////////////

    $scope.pop_width_employees = 600;
    $scope.pop_height_employees = 450;
    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 501;

    $scope.scroll_add = {
        bindingOptions: {
            height: 'scroll_height_full'
        }
    };

    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {
        width:1200,
        height: 530,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplan', onClick: function (arg) {
                        //nook
                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.entity.DateFrom = new Date($scope.entity.iDateFrom).ToUTC();
                        $scope.entity.DateTo = new Date($scope.entity.iDateTo).ToUTC();
                        // $scope.entity.DateFirst = new Date($scope.data[0].startDate).ToUTC();
                         
                        $scope.entity.STD = (new Date($scope.entity.STD)).toUTCString();
                        
                        $scope.entity.STA = (new Date($scope.entity.STA)).toUTCString();
                        //startDate
                       
                        if ($scope.entity.Interval != 100) {
                            $scope.entity.Months = [];
                            $scope.entity.Days = [];
                        }






                        $scope.loadingVisible = true;
                        flightService.savePlanItem($scope.entity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            ////////////////
                            $scope.refreshEntity();
                            if ($scope.IsNew) {
                                $scope.isBaseDisabled = true;
                                $scope.entity.STD = (new Date($scope.entity.STA)).addMinutes(60);
                                $scope.start = $scope.entity.STD;
                                $scope.entity.STA = null;
                                $scope.entity.FromAirport = $scope.entity.ToAirport;
                                $scope.entity.ToAirport = null;
                                //jook
                                response.STD = (new Date(response.STD)).addMinutes(offset);
                                response.STA = (new Date(response.STA)).addMinutes(offset);
                                $scope.dg2_ds.push(response);
                                $scope.dg2_instance.refresh();



                            }
                            else {

                                $scope.popup_add_visible = false;
                            }

                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
          //dook
            if ($scope.tempData)
                $scope.bindEntity($scope.tempData);
        },
        onHiding: function () {
            $scope.clearEntity();
            $scope.dg2_ds = [];
            $scope.dg2_instance.refresh();
            $scope.popup_add_visible = false;
            if ($scope.doRefresh)
                $scope.bind();

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_add_title',

        }
    };

    //close button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;

    };
    ///////////////////////////////
    $scope.popup_interval_visible = false;
    $scope.popup_interval_title = 'Interval';
    $scope.popup_interval = {
        width: 1100,
        height: 620,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false, 
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplaninterval', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //cati
                        var dto = {
                            Id: $scope.entityInterval.FlightPlanId,
                            DateFrom: new Date($scope.entityInterval.DateFrom).ToUTC(),
                            DateTo: new Date($scope.entityInterval.DateTo).ToUTC(),
                            Interval: $scope.entityInterval.Interval,
                            Months: $scope.entityInterval.Months,
                            Days: $scope.entityInterval.Days,
                            DateFirst: new Date($scope.data[0].startDate).ToUTC(),

                        };
                        $scope.loadingVisible = true;
                        flightService.savePlanInterval(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            ////////////////
                            $scope.clearEntityInterval();
                            $scope.popup_interval_visible = false;

                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        return;
                        $scope.entity.DateFrom = new Date($scope.entity.iDateFrom).ToUTC();
                        $scope.entity.DateTo = new Date($scope.entity.iDateTo).ToUTC();
                        // $scope.entity.DateFirst = new Date($scope.data[0].startDate).ToUTC();

                        $scope.entity.STD = (new Date($scope.entity.STD)).toUTCString();
                        $scope.entity.STA = (new Date($scope.entity.STA)).toUTCString();
                        //startDate
                         
                        if ($scope.entity.Interval != 100) {
                            $scope.entity.Months = [];
                            $scope.entity.Days = [];
                        }






                        $scope.loadingVisible = true;
                        flightService.savePlanItem($scope.entity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            ////////////////
                            $scope.refreshEntity();
                            if ($scope.IsNew) {
                                $scope.isBaseDisabled = true;
                                $scope.entity.STD = $scope.entity.STA;
                                $scope.start = $scope.entity.STD;
                                $scope.entity.STA = null;
                                $scope.entity.FromAirport = $scope.entity.ToAirport;
                                $scope.entity.ToAirport = null;

                            }
                            else {

                                $scope.popup_add_visible = false;
                            }

                            /////////////////



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

            //if ($scope.tempData)
            //    $scope.bindEntity($scope.tempData);
        },
        onHiding: function () {


            $scope.popup_interval_visible = false;
            if ($scope.doRefresh)
                $scope.bind();

        },
        bindingOptions: {
            visible: 'popup_interval_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_interval_title',

        }
    };

    //close button
    $scope.popup_interval.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_interval_visible = false;

    };
    ///////////////////////////////
    $scope.isDouble = 0;
    var prevCellData = null;
    $scope.monthArray = [];
    $scope.dayArray = [];
    $scope.addCustom = function (min, max, months, days) {
        if (!months || months.length == 0)
            return;
        if (!days || days.length == 0)
            return;
        while (min <= max) {
            // console.log(min);
            var checkMonth = false;
            var checkDay = false;
            if (!months || months.length == 0)
                checkMonth = true;
            else
                checkMonth = months.indexOf(min.getMonth()) != -1;
            if (!days || days.length == 0)
                checkDay = true;
            else
                checkDay = days.indexOf(min.getDay()) != -1;
            if (checkMonth && checkDay)
                $scope.data.push({
                    text: "",
                    startDate: new Date(min),
                    endDate: new Date(min)
                });
            min = min.addDays(1);

        }
    };
    $scope.addDaily = function (min, max, day) {
        while (min <= max) {
            // console.log(min);
            $scope.data.push({
                text: "",
                startDate: new Date(min),
                endDate: new Date(min)
            });
            min = min.addDays(day);

        }
    };
    $scope.addMonthly = function (min, max) {
        while (min <= max) {
            $scope.data.push({
                text: "",
                startDate: new Date(min),
                endDate: new Date(min)
            });
            min = min.addDays(30);
        }
    };
    $scope.fillSchedule = function () {
        $scope.data = [];
        if ($scope.entity.Interval && $scope.entity.iDateFrom && $scope.entity.iDateTo) {
            var min = new Date($scope.entity.iDateFrom);
            min = new Date(min.setHours(0, 0, 0, 0));

            var max = new Date($scope.entity.iDateTo);
            max = new Date(max.setHours(23, 59, 59, 999));
            console.log(min);
            console.log(max);
            switch ($scope.entity.Interval) {
                case 1:
                    $scope.addDaily(min, max, 1);
                    break;
                case 2:
                    $scope.addDaily(min, max, 7);
                    break;
                case 3:
                    $scope.addDaily(min, max, 10);
                    break;
                case 4:
                    $scope.addDaily(min, max, 14);
                    break;
                case 5:
                    $scope.addDaily(min, max, 15);
                    break;
                case 100:
                    $scope.addCustom(min, max, $scope.entity.Months, $scope.entity.Days);
                    break;
                default:
                    break;
            }
        }


    };

    $scope.fillSchedule2 = function () {
        $scope.data = [];
        if ($scope.entityInterval.Interval && $scope.entityInterval.DateFrom && $scope.entityInterval.DateTo) {
            var min = new Date($scope.entityInterval.DateFrom);
            min = new Date(min.setHours(0, 0, 0, 0));

            var max = new Date($scope.entityInterval.DateTo);
            max = new Date(max.setHours(23, 59, 59, 999));

            switch ($scope.entityInterval.Interval) {
                case 1:
                    $scope.addDaily(min, max, 1);
                    break;
                case 2:
                    $scope.addDaily(min, max, 7);
                    break;
                case 3:
                    $scope.addDaily(min, max, 10);
                    break;
                case 4:
                    $scope.addDaily(min, max, 14);
                    break;
                case 5:
                    $scope.addDaily(min, max, 15);
                    break;
                case 100:
                    $scope.addCustom(min, max, $scope.entityInterval.Months, $scope.entityInterval.Days);
                    break;
                case 101:
                    $scope.addDaily(min, max, 1);
                    break;
                default:
                    break;
            }
        }


    };


    //  $scope.currentDate = new Date();
    $scope.data = [];
    $scope.scheduler_instance = null;
    $scope.schedulerOptions = {
        onContentReady: function (e) {
            if (!$scope.scheduler_instance)
                $scope.scheduler_instance = e.component;

        },
        //dataSource: [],
        views: [
            //{ name: "Months", type: "month", intervalCount: 12 }
            "month"
            // , "timelineMonth"
            //  { name: "timelineMonth", type: "timelineMonth", intervalCount: 12 }
            //  ,"agenda"
        ],
        currentView: "month",
        startDayHour: 0,
        endDayHour: 24,
        //  min: new Date("2019/01/01"),
        //  max: new Date("2019/12/31"),
       // currentDate: new Date("2019/01/01"),
        showCurrentTimeIndicator: false,
        height: 492,
        // width:500,
        // dataCellTemplate: 'dataCellTemplate',
        appointmentTemplate: function (data) {


            //return $("<div class='showtime-preview'>" +
            //    "<div>" + movieInfo.text + "</div>" +
            //    "<div>Ticket Price: <strong>$" + data.price + "</strong>" +
            //    "</div>" +
            //    "<div>" + Globalize.formatDate(data.startDate, { time: "short" }) +
            //    " - " + Globalize.formatDate(data.endDate, { time: "short" }) +
            //    "</div>" +
            //    "</div>");
            return $("<div style='text-align:center; height:38px;color:green;background:white;margin-top:-5px'><i style='font-size:32px' class='icon ion-md-checkmark'></i></div>");

        },
        editing: {
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: true,
            allowResizing: false,
            allowDragging: false
        },
        onAppointmentClick: function (e) {
            e.cancel = true;
        },
        onAppointmentDblClick: function (e) {
            e.cancel = true;
            // e.component.deleteAppointment(e.appointmentData);
        },
        onCellClick: function (e) {
            e.cancel = true;
            return;
            if ($scope.isDouble == 1)
                prevCellData = e.cellData;
            $scope.isDouble++;
            setTimeout(function () {
                if ($scope.isDouble == 2) {
                    if ((e.cellData.startDate == prevCellData.startDate) && (e.cellData.endDate == prevCellData.endDate))

                        $scope.data.push({
                            text: "",
                            startDate: new Date(e.cellData.startDate),
                            endDate: new Date(e.cellData.endDate)
                        });
                    e.component.repaint();

                }
                else if ($scope.isDouble == 1) { /*alert('Click');*/ }
                $scope.isDouble = 0;
                prevCellData = null;
            }, 300);
        },
        bindingOptions: {
            dataSource: "data",
            min: "entityInterval.DateFrom",
            max: "entityInterval.DateTo",
            currentDate:'entityInterval.DateFrom',
            // currentDate:"currentDate",


        },
        //onCellContextMenu: function (e) {
        //   // $scope.contextMenuCellData = e.cellData;
        //    alert('x');
        //},

    };
    $scope.date_from = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            // $scope.fillSchedule();
            $scope.entity.iDateTo = arg.value;
        },
        bindingOptions: {
            value: 'entity.iDateFrom',

        }
    };
    $scope.date_to = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            // $scope.fillSchedule();
        },
        bindingOptions: {
            value: 'entity.iDateTo',

        }
    };


    $scope.date_from2 = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
             $scope.fillSchedule2();
           // $scope.entityInterval.DateTo = arg.value;
        },
        bindingOptions: {
            value: 'entityInterval.DateFrom',

        }
    };
    $scope.date_to2 = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            $scope.fillSchedule2();
        },
        bindingOptions: {
            value: 'entityInterval.DateTo',

        }
    };
    $scope.intervalTypes = [{ Id: 1, Title: 'Daily' }, { Id: 2, Title: 'Weekly' }, { Id: 3, Title: 'Every 10 days' }, { Id: 4, Title: 'Every 14 days' }, { Id: 5, Title: 'Every 15 days' }, { Id: 100, Title: 'Custom' }, { Id: 101, Title: 'Once' }];
    $scope.sb_interval = {

        showClearButton: true,
        width: '100%',
        searchEnabled: false,
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

            $scope.customDisabled = arg.selectedItem && arg.selectedItem.Id != 100;
            $scope.fillSchedule();

        },
        bindingOptions: {
            value: 'entity.Interval',

            dataSource: 'intervalTypes',


        }
    };



    $scope.sb_interval2 = {

        showClearButton: true,
        width: '100%',
        searchEnabled: false,
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

            $scope.customDisabled = arg.selectedItem && arg.selectedItem.Id != 100;
            $scope.fillSchedule2();

        },
        bindingOptions: {
            value: 'entityInterval.Interval',

            dataSource: 'intervalTypes',


        }
    };


    $scope.customDisabled = true;
    $scope.tag_months_instance = null;
    $scope.tag_months = {
        dataSource: General.MonthDataSource,
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_months_instance)
                $scope.tag_months_instance = e.component;
        },
        onSelectionChanged: function (arg) {

            $scope.fillSchedule2();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entityInterval.Months"
        },

    };
    $scope.tag_days_instance = null;
    $scope.tag_days = {
        dataSource: General.WeekDayDataSource,
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Title",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_days_instance)
                $scope.tag_days_instance = e.component;
        },
        onSelectionChanged: function (arg) {

            $scope.fillSchedule2();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entityInterval.Days"
        },

    };
    $scope.text_title = {

        bindingOptions: {
            value: 'entity.Title',

        }
    };
    $scope.text_base = {
        readOnly: true,
        bindingOptions: {
            value: 'entityInterval.BaseIATA',

        }
    };
    $scope.text_type = {
        readOnly: true,
        bindingOptions: {
            value: 'dg_selected.AircraftType',

        }
    };
    $scope.text_msn = {
        readOnly: true,
        bindingOptions: {
            value: 'entityInterval.Register',

        }
    };
    /////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        {

            dataField: "status", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value == 12)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-add-circle'></i>")
                        .appendTo(container);
                if (options.value == 13)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#4CAF50' class='icon ion-md-create'></i>")
                        .appendTo(container);
                if (options.value == 10)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i>")
                        .appendTo(container);
                if (options.value == 11)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);

                if (options.value == 16)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i><i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);


            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'DateFrom', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', groupIndex: 0 },
        { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, groupIndex: 1 },

        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm',

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
       // { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' },

       { dataField: 'FlightPlanId', caption: 'Plan Id', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' },




    ];
    $scope.dg_height = $(window).height() - 135;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
        },
        searchPanel: {
            visible: false
        },
        groupPanel: {
            visible: false
        },
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_selected = null;



            }
            else {
                $scope.dg_selected = data;


            }


        },
        onCellPrepared: function (cellInfo) {
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'BaseIATA') {
                // if (cellInfo.data.sex === 'Male') { cellInfo.cellElement.addClass('Red'); }
                //if (cellInfo.data.sex === 'Female') { cellInfo.cellElement.addClass('Pink'); }
                var md = Flight.getBaseMetaData(cellInfo.data.BaseIATA);
                //console.log(md.bgcolor);
                if (md)
                    cellInfo.cellElement.css('background', md.bgcolor);
            }
        },
        //height: '500',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            height: 'dg_height'
        }
    };
    ///////////////////////////
    $scope.dg2_selected = null;
    $scope.dg2_columns = [
       
       
       
       
       

        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm', sortIndex: 0, sortOrder: "asc"

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
       





    ];
    $scope.dg2_height = 400;

    $scope.dg2_instance = null;
    $scope.dg2_ds = [];
    $scope.dg2 = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
        },
        searchPanel: {
            visible: false
        },
        groupPanel: {
            visible: false
        },
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg2_columns,
        onContentReady: function (e) {
            if (!$scope.dg2_instance)
                $scope.dg2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg2_selected = null;



            }
            else {
                $scope.dg2_selected = data;


            }


        },
        onCellPrepared: function (cellInfo) {
            
        },
        //height: '500',
        bindingOptions: {
            dataSource: 'dg2_ds', //'dg_employees_ds',
            height: 'dg2_height'
        }
    };
    ///////////////////////////

    $scope.bind = function () {
        var url = 'odata/flightplans/items/opened/' + Config.CustomerId;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $.each(e, function (_i, _d) {
                            _d.STD = (new Date(_d.STD)).addMinutes(offset);
                            _d.STA = (new Date(_d.STA)).addMinutes(offset);
                        });
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: [{ getter: "Id", desc: false }],
                sort: [{ getter: "DateFrom", desc: true }, 'BaseIATA','Register', 'STD'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

        //var myVar = setInterval(function () {
        //    console.log('x');
        //    if ($scope.dg_instance)
        //        $scope.dg_instance.repaint();
        //}, 1000);

    };
    ////////////////////////////
    $scope.flightData = null;
    $scope.doRefresh = false;
    $scope.filters = [];
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };
    $scope.getFlightsGantt = function () {

        $scope.loadingVisible = true;
        flightService.getFlightsGantt(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $scope.flightData = response;
            $.each($scope.flightData.flights, function (_i, _d) {
                _d.startDate = new Date(_d.startDate);
            });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights Planning 2';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flight').fadeIn(400, function () {
            //vmins = new viewModel();
            //ko.applyBindings(vmins);
            //var h = $(window).height() - 130;
            //vmins.height(h + 'px');

            //var ds = proccessDataSource(resourceGanttData);
            //activeDatasource = ds;

            //vmins.gantt_datasource(ds);
        });
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onFlightPlanItemsSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onFlightDesignHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    //ko.applyBindings(dataView);
    $scope.$on('$viewContentLoaded', function () {
        //Here your view content is fully loaded !!

        //if ($rootScope.AircraftTypes == null) {
        //    $scope.loadingVisible = true;
        //    aircraftService.getAircraftTypes(Config.CustomerId).then(function (response) {
        //        $scope.loadingVisible = false;
        //        $rootScope.AircraftTypes = response;
        //        console.log('types');
        //        console.log(response);

        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //}
        //else {
        //    var t = 0;
        //}

        //if ($rootScope.MSNs == null) {
        //    $scope.loadingVisible = true;
        //    aircraftService.getMSNs(Config.CustomerId).then(function (response) {
        //        $scope.loadingVisible = false;
        //        $rootScope.MSNs = response;
        //        console.log('msns');
        //        console.log(response);

        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //}

        //$scope.getFlightsGantt();

    });
    $rootScope.$broadcast('FlightLoaded', null);





}]);