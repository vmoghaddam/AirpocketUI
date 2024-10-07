'use strict';
app.controller('fuelReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
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
                    airportService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
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
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $scope.InitAddAirport(data);
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'crewreportsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_ds = null;
            $scope.$broadcast('getFilterQuery', null);
        }

    };
    $scope.selected_employee_id = null;
    $scope.btn_flight = {
        text: 'Flights',
        type: 'default',
        icon: 'airplane',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.selected_employee_id = $scope.dg_selected.Id;
            $scope.fillPerson($scope.dg_selected);
            $scope.doSearch = false;
            $scope.popup_flight_visible = true;
        }

    };

    $scope.btn_person = {
        text: 'Details',
        type: 'default',
        icon: 'card',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitViewPerson', data);
        }

    };
    $scope.btn_flight_total = {
        text: 'Flights(Total)',
        type: 'default',
        icon: 'datafield',
        width: 180,

        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_flight_total_visible = true;
        }

    };
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

    };
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
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
    ///////////////////////////////////
    $scope.dt_from =  new Date() ;
    $scope.dt_to =  new Date();
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
    ///////////////////////////////////
    $scope.filters = [];
    $scope.dg_columnsX = [
        {
            caption: '',
            fixed: true, fixedPosition: 'left',
            columns: [
                { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
                 { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
                { dataField: 'FromAirport', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'ToAirport', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                  { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'MM-dd-yyyy', sortIndex: 0, sortOrder: "asc" },
                { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },

            ],
        },
        { dataField: 'IPScheduleName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'P1ScheduleName', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },

        { dataField: 'P2ScheduleName', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'PF', caption: 'P/I/F', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },


        {
            caption: 'Fuel',
            fixed: false, fixedPosition: 'right',
            columns: [
                //{ dataField: 'FuelUnit', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 40, fixed: false, fixedPosition: 'left' },
                { dataField: 'Remaining', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'UpLift', caption: 'UpLift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'Taxi', caption: 'Taxi', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, },
                 { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'FPTripFuel', caption: 'OFP Trip', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, },
                { dataField: 'FPFuel', caption: 'OFP Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, },

                { dataField: 'AVGFuelBurned', caption: 'Avg. Type', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'AVGFuelBurnedReg', caption: 'Avg. Reg.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },

                   { dataField: 'FPVar', caption: 'OFP Diff.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, customizeText: function (e) { return e.value ? e.value + ' %'  : '0' } },
                { dataField: 'AvgVar', caption: 'Type Diff.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, customizeText: function (e) { return e.value ? e.value + ' %' : '0' } },
                 { dataField: 'AvgVarReg', caption: 'Reg. Diff.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, customizeText: function (e) { return e.value ? e.value + ' %' : '0' } },



            ]
        },
        {
            caption: 'Flight',
            columns: [


                { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 1, sortOrder: "asc" },
                { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'BlockOff', caption: 'B/L OFF', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'BlockOn', caption: 'B/L ON', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

                { dataField: 'BlockTime2', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
                { dataField: 'FlightTime2', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },

                   { dataField: 'TotalPax', caption: 'PAX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Freight', caption: 'Freight', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'ALT1', caption: 'ALT1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'ALT2', caption: 'ALT2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'ALT3', caption: 'ALT3', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]

        },

    ];
    $scope.dg_columns2 = [

        {
            caption: 'Base', columns: [
                //{
                //    dataField: "ImageUrl",
                //    width: 80,
                //    alignment: 'center',
                //    caption:'',
                //    allowFiltering: false,
                //    allowSorting: false,
                //    cellTemplate: function (container, options) {
                //        $("<div>")
                //            .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value :'imguser.png'), "css": {height:'60px',borderRadius:'100%'} }))
                //            .appendTo(container);
                //    }
                //},
                { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, fixed: false, fixedPosition: 'left' },
                { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
                // { dataField: 'CurrentLocationAirporIATA', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        {
            caption: 'Current Day',
            alignment: 'center',
            columns: [
                { dataField: 'Day1_Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Day1_Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortOrder: 'desc', sortIndex: 0 },
            ],

        },
        {
            caption: 'Past 7 Days',
            alignment: 'center',
            columns: [
                { dataField: 'Day7_Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Day7_Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortOrder: 'desc', sortIndex: 1 },
            ],

        },
        {
            caption: 'Past 14 Days',
            alignment: 'center',
            columns: [
                { dataField: 'Day14_Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Day14_Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortOrder: 'desc', sortIndex: 2 },
            ],

        },
        {
            caption: 'Past 28 Days',
            alignment: 'center',
            columns: [
                { dataField: 'Day28_Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Day28_Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortOrder: 'desc', sortIndex: 3 },
            ],

        },
        {
            caption: 'Past Year',
            alignment: 'center',
            columns: [
                { dataField: 'Year_Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                { dataField: 'Year_Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortOrder: 'desc', sortIndex: 4 },
            ],

        },
        {
            caption: 'Alerts',
            columns: [


                ////////////////////////////////////////

                {
                    dataField: "", caption: 'MEDICAL',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsMedicalExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'LPR',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsLPRExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
                        var text = "";
                        if (options.data.IsLPRExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };

                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'SKILL',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';

                        if (options.data.IsProficiencyExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                        var text = "";
                        if (options.data.IsProficiencyExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'CMC',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsCMCExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                //{
                //    dataField: "", caption: 'CRM',
                //    width: 85,
                //    allowFiltering: false,
                //    allowSorting: false,
                //    alignment: 'center',
                //    cellTemplate: function (container, options) {

                //        var color = 'green';
                //        var icon = 'ion-md-checkmark-circle';
                //        if (options.data.IsCRMExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                //        $("<div>")
                //            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                //            .appendTo(container);

                //    },

                //},

                {
                    dataField: "", caption: 'CCRM',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsCCRMExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'AVSEC',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsAvSecExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'SEPT',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsSEPTExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'SEPTP',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsSEPTPExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'DG',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsDGExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'SMS',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsSMSExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'FIRSTAID',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsFirstAidExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                        var text = "";
                        if (options.data.IsFirstAidExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },


                {
                    dataField: "", caption: 'COLD W.',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsColdWeatherExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                        var text = "";
                        if (options.data.IsColdWeatherExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },

                {
                    dataField: "", caption: 'HOT W.',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsHotWeatherExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                        var text = "";
                        if (options.data.IsHotWeatherExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },


                {
                    dataField: "", caption: 'UPSET',
                    width: 85,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    cellTemplate: function (container, options) {

                        var color = 'green';
                        var icon = 'ion-md-checkmark-circle';
                        if (options.data.IsUpsetRecoveryTrainingExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
                        var text = "";
                        if (options.data.IsUpsetRecoveryTrainingExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };

                        $("<div>")
                            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                            .appendTo(container);

                    },

                },
                ////////////////////////////////////////


            ]
        },





    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_columnsX,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        summary: {
            totalItems: [{
                column: "UsedFuel",
                showInColumn: "UsedFuel",

                customizeText: function (e) {

                    return (e.value / 1000).toFixed(3).toString() + ' K';
                },
                summaryType: "sum"
            },
                {
                    column: "UpLift",
                    showInColumn: "UpLift",
                    customizeText: function (e) {

                        return (e.value / 1000).toFixed(3).toString() + ' K';
                    },
                    summaryType: "sum"
                },
                {
                    column: "UsedFuel",
                    showInColumn: "UsedFuel",

                    customizeText: function (e) {

                        return 'Avg: ' + (e.value / 1000).toFixed(3).toString() + ' K';
                    },
                    summaryType: "avg"
                },
                {
                    column: "UpLift",
                    showInColumn: "UpLift",
                    customizeText: function (e) {

                        return 'Avg: ' + (e.value / 1000).toFixed(3).toString() + ' K';
                    },
                    summaryType: "avg"
                },

            ],
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "UsedFuel" && e.data.UsedFuel > e.data.FPTripFuel)
                e.cellElement.css("backgroundColor", "#ffcccc");

            if (e.rowType === "data" && e.column.dataField == "AvgVar" && e.data.AvgVar > 0)
                e.cellElement.css("backgroundColor", "#ffcccc");
            else if (e.rowType === "data" && e.column.dataField == "AvgVar" /*&& e.data.AvgVar*/)
                e.cellElement.css("backgroundColor", "#ccffdd");

            if (e.rowType === "data" && e.column.dataField == "AvgVarReg" && e.data.AvgVarReg > 0)
                e.cellElement.css("backgroundColor", "#ffcccc");
            else if (e.rowType === "data" && e.column.dataField == "AvgVarReg" /*&& e.data.AvgVarReg*/)
                e.cellElement.css("backgroundColor", "#ccffdd");

            if (e.rowType === "data" && e.column.dataField == "FPVar" && e.data.FPVar > 0)
                e.cellElement.css("backgroundColor", "#ffcccc");
            else if (e.rowType === "data" && e.column.dataField == "FPVar" /*&& e.data.FPVar*/)
                e.cellElement.css("backgroundColor", "#ccffdd");


        },
        "export": {
            enabled: true,
            fileName: "Fuel_Report",
            allowExportSelectedData: false
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };
    //////////////////////////////////
    $scope.person = {
        FirstName: null,
        LastName: null,
        PID: null,
        JobGroup: null,
        Mobile: null,
    };
    $scope.fillPerson = function (data) {

        $scope.person.FirstName = data.FirstName;
        $scope.person.LastName = data.LastName;
        $scope.person.PID = data.PID;
        $scope.person.JobGroup = data.JobGroup;
        $scope.person.Mobile = data.Mobile;
    };
    $scope.clearPerson = function (data) {
        $scope.person.FirstName = null;
        $scope.person.LastName = null;
        $scope.person.PID = null;
        $scope.person.JobGroup = null;
        $scope.person.Mobile = null;
    };
    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'person.FirstName',

        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'person.LastName',

        }
    };
    $scope.txt_PID = {

        readOnly: true,
        hoverStateEnabled: false,

        rtlEnabled: false,
        bindingOptions: {
            value: 'person.PID',

        }
    };
    $scope.txt_group = {

        readOnly: true,
        hoverStateEnabled: false,

        rtlEnabled: false,

        bindingOptions: {
            value: 'person.JobGroup',

        }
    };
    $scope.txt_Mobile = {

        readOnly: true,
        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',

        bindingOptions: {
            value: 'person.Mobile',

        }
    };
    ///////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'yyyy-MMM-dd' },
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        {
            caption: 'Route', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
            ]
        },

        {
            caption: 'Departure',
            columns: [

                { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [

                { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
            ]
        },

        {
            caption: 'Times', fixed: true, fixedPosition: 'right', columns: [
                //  { dataField: 'DurationH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dhh', },
                //  { dataField: 'DurationM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dmm', },
                { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]
        },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
        height: $(window).height() - 235,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ActualFlightHOffBlock * 60 + options.value.ActualFlightMOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    //////////////////////////////////
    $scope.dg_flight_total_columns = [

        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', width: 150, allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', width: 150, allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },




        //   { dataField: 'DurationH', caption: 'Flights HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dhh', },
        //    { dataField: 'DurationM', caption: 'Flights MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dmm', },
        { dataField: 'FlightsCount', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



    ];

    $scope.dg_flight_total_selected = null;
    $scope.dg_flight_total_instance = null;
    $scope.dg_flight_total_ds = null;
    $scope.dg_flight_total = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_flight_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_total_instance)
                $scope.dg_flight_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_total_selected = null;
            }
            else
                $scope.dg_flight_total_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockH * 60 + options.value.BlockM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_total_ds'
        }
    };
    //////////////////////////////////
    $scope.doRefresh = false;

    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['FlightId', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };

    /////////////////////////////
    //////////////////////////////
    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };

    //////////////////////////////
    /////////////////////////////

    $scope.formatMinutesXXX = function (mm) {
        if (!mm && mm !== 0)
            return '-';
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.bind = function () {
        //iruser558387
        var dt = $scope.dt_to ? new Date($scope.dt_to) : new Date(2200, 4, 19, 0, 0, 0);
        var df = $scope.dt_from ? new Date($scope.dt_from) : new Date(1900, 4, 19, 0, 0, 0);
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        // var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        var offset = -1 * (new Date()).getTimezoneOffset();
        var url = 'odata/app/fuel/report/?dt=' + _dt + "&df=" + _df;//2019-06-06T00:00:00';
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    //   key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        $.each(e, function (_i, _d) {
                            _d.BlockTime2 = $scope.formatMinutesXXX(_d.BlockTime);
                            _d.FlightTime2 = $scope.formatMinutesXXX(_d.FlightTime);

                        });
                        // $scope.loadingVisible = false;
                        //filter
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
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };



    $scope.getCrewFlights = function (id, df, dt) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            });
            $scope.dg_flight_total_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.popup_flight_df = null;
    $scope.popup_flight_df_instance = null;
    $scope.popup_flight_dt = null;
    $scope.popup_flight_dt_instance = null;
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Flights';
    $scope.popup_flight = {
        shading: true,
        width: 1100,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxDateBox', location: 'before', options: {
                    onContentReady: function (e) {
                        if (!$scope.popup_flight_df_instance)
                            $scope.popup_flight_df_instance = e.component;
                    },
                    width: 150, placeholder: 'From', onValueChanged: function (e) { $scope.popup_flight_df = e.value; }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    onContentReady: function (e) {
                        if (!$scope.popup_flight_dt_instance)
                            $scope.popup_flight_dt_instance = e.component;
                    },
                    width: 150, placeholder: 'To', onValueChanged: function (e) { $scope.popup_flight_dt = e.value; }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'search', onClick: function (arg) {
                        var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
                        var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);

                        $scope.getCrewFlights($scope.selected_employee_id, df, dt);


                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_flight_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $('.dx-toolbar-items-container').addClass('dx-border');

            if ($scope.popup_flight_dt_instance && $scope.popup_flight_total_dt) {

                $scope.popup_flight_dt_instance.option('value', $scope.popup_flight_total_dt);

            }


            if ($scope.popup_flight_df_instance && $scope.popup_flight_total_df)
                $scope.popup_flight_df_instance.option('value', $scope.popup_flight_total_df);

            if ($scope.doSearch) {
                var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
                var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);

                $scope.getCrewFlights($scope.selected_employee_id, df, dt);
            }
        },
        onHiding: function () {
            $scope.dg_crew_flight_ds = [];
            $scope.clearPerson();
            $scope.popup_flight_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_visible',

            title: 'popup_flight_title',
            //  'toolbarItems[0].options.value': 'popup_flight_df',

        }
    };
    //////////////////////////////
    $scope.popup_flight_total_df = null;
    $scope.popup_flight_total_dt = null;
    $scope.popup_flight_total_visible = false;
    $scope.popup_flight_total_title = 'Flights (Total)';
    $scope.doSearch = false;
    $scope.popup_flight_total = {
        shading: true,
        width: 1100,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 150, placeholder: 'From', onValueChanged: function (e) {
                        $scope.popup_flight_total_df = e.value;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 150, placeholder: 'To', onValueChanged: function (e) {
                        $scope.popup_flight_total_dt = e.value;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'search', onClick: function (arg) {
                        var dt = $scope.popup_flight_total_dt ? $scope.popup_flight_total_dt : new Date(2200, 4, 19, 0, 0, 0);
                        var df = $scope.popup_flight_total_df ? $scope.popup_flight_total_df : new Date(1900, 4, 19, 0, 0, 0);
                        $scope.getCrewFlightsTotal(df, dt);


                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Details', icon: 'airplane', onClick: function (e) {
                        $scope.dg_flight_total_selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
                        if (!$scope.dg_flight_total_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.selected_employee_id = $scope.dg_flight_total_selected.Id;
                        $scope.fillPerson($scope.dg_flight_total_selected);
                        $scope.doSearch = true;
                        $scope.popup_flight_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_flight_total_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $('.dx-toolbar-items-container').addClass('dx-border');


        },
        onHiding: function () {
            $scope.dg_crew_flight_total_ds = [];
            $scope.popup_flight_total_dt = null;
            $scope.popup_flight_total_df = null;
            $scope.popup_flight_total_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_total_visible',

            title: 'popup_flight_total_title',

        }
    };


    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Fuel';
        $('.fuelreport').fadeIn();
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
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);