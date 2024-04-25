'use strict';
app.controller('qahazardlog', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route','qahService', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route,qahService) {
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
	$scope.bind_log=function(){
		
		 qahService.getHazardLog().then(function (response) {
			 
			 $scope.dg_ds=response;
         }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
            $scope.bind_log();
        }

    };
	
	 
	
	$scope.btn_hazardLog = {
        text: 'Hazard Log',
        type: 'success',
        width: 160,
        bindingOptions: {},
        onClick: function (e) {
		     //$scope.popup_hazard_visible = true;
			 var data = { Id: null,   };
           
              
                $rootScope.$broadcast('InitAddHazard', data);
		}
    };
	
	
	$scope.btn_showForm = {
        text: 'Show Form',
        type: 'success',
        width: 160,
        bindingOptions: {},
        onClick: function (e) {
		    var data = {
     Id: $scope.dg_selected.form_id,
     Type: $scope.dg_selected.form_type,
     EmployeeId: $rootScope.employeeId,
 };
			 $rootScope.$broadcast('InitOperationPopup', data);
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
	$scope.dg_columnsY = [
	{caption:'Hazard Identification',columns:[
		{ dataField:"id_source",caption:"Source",alignment: "center", dataType: "string", allowEditing: false, width: 150},
		{ dataField:"fort_type_title",caption:"Form",alignment: "center", dataType: "string", allowEditing: false, width: 150},
		{ dataField:"form_no",caption:"No",alignment: "center", dataType: "string", allowEditing: false, width: 130},
		{ dataField:"id_date",caption:"Date",alignment: "center", dataType: "datetime",format: 'yyyy-MM-dd', allowEditing: false, width: 120},
		{ dataField:"id_department",caption:"Scope",alignment: "center", dataType: "string", allowEditing: false, width: 150},
//{ dataField:"id_risk_register_number",caption:"id_risk_register_number",alignment: "center", dataType: "string", allowEditing: false, width: 120},
		{ dataField:"id_hazard_description",caption:"Description",alignment: "left", dataType: "string", allowEditing: false, width: 250},
		{ dataField:"consequences",caption:"Consequences",alignment: "left", dataType: "string", allowEditing: false, width: 300},
		{ dataField:"root",caption:"Root Cause",alignment: "left", dataType: "string", allowEditing: false, width: 300},
		
		{ dataField:"has_relevant",caption:"Has Relevant",alignment: "center", dataType: "string", allowEditing: false, width: 100},
	]},
	{caption:'Risk Assessment',columns:[
	
		{ dataField:"initial_prob_level",caption:"Probability",alignment: "center", dataType: "string", allowEditing: false, width: 100},
		{ dataField:"initial_severity_level",caption:"Severity",alignment: "center", dataType: "string", allowEditing: false, width: 100},
		{ dataField:"initial_index",caption:"Risk Index",alignment: "center", dataType: "string", allowEditing: false, width: 100},
		{ dataField:"initial_acceptability",caption:"Acceptability",alignment: "center", dataType: "string", allowEditing: false, width: 150},
        { dataField:"initital_description",caption:"Description",alignment: "center", dataType: "string", allowEditing: false, width: 150},

	]},
	{caption:'Risk Elimination/Mitigation/Control Measures',columns:[
	   { dataField:"actions",caption:"actions",alignment: "left", dataType: "string", allowEditing: false, width: 300},
	   
	   { dataField:"actions_time_limit",caption:"Time Limits",alignment: "center", dataType: "string", allowEditing: false, width: 150},
	   
	   { dataField:"actions_responsible",caption:"Responsible Staff",alignment: "center", dataType: "string", allowEditing: false, width: 150},
	
	]},
	{caption:'Risk Assessment Review',columns:[
	   { dataField:"final_prob_level",caption:"Probability",alignment: "center", dataType: "string", allowEditing: false, width: 100},
{ dataField:"final_severity_level",caption:"Severity",alignment: "center", dataType: "string", allowEditing: false, width: 100},
{ dataField:"final_index",caption:"Risk Index",alignment: "center", dataType: "string", allowEditing: false, width: 100},
{ dataField:"final_acceptability",caption:"Acceptability",alignment: "center", dataType: "string", allowEditing: false, width: 150},
{ dataField:"final_date",caption:"Date",alignment: "center",  dataType: "datetime",format: 'yyyy-MM-dd', allowEditing: false, width: 120},
	]},
	{caption:'Monitor & Control',columns:[
	   { dataField:"monitor",caption:"Comments",alignment: "left", dataType: "string", allowEditing: false, width: 300},
	   { dataField:"monitor_date",caption:"Last Update",alignment: "center", dataType: "string", allowEditing: false, width: 120},
	  
	]},
	
	
	



 





	];
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

        columns: $scope.dg_columnsY,
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
       
        
        "export": {
            enabled: true,
            fileName: "Hazard_Log_Report",
            allowExportSelectedData: false
        },
		wordWrapEnabled: true,
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

	///////////////////////////
	//////////////////////////////
	$scope._txt_scope=null;
	$scope.txt_scope = {
        
        bindingOptions: {
            value: 'register.id_department',


        }
    };
	
	$scope._txt_index=null;
	$scope.txt_index = {
        
        bindingOptions: {
            value: 'register.initial_index',


        }
    };
	
	$scope._txt_index2=null;
	$scope.txt_index2 = {
        
        bindingOptions: {
            value: 'register.final_index',


        }
    };
	
	$scope._txt_qa_approval=null;
	$scope.txt_qa_approval = {
        
        bindingOptions: {
            value: '_txt_qa_approval',


        }
    };
	
	$scope._txt_hazard=null;
	$scope.txt_hazard = {
        bindingOptions: {
            value: 'register.id_hazard_description',
            height: '60',
             
        }
    };
	
	$scope._check_relevant=false;
	$scope.check_relevant = {
        
        text: "Relevant Previously Reported Incident Data",

        bindingOptions: {
            value: 'register.has_relevant',
        }
    };
	
	
	$scope._sb_severity=null;
	$scope.sb_severity = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['A','B','C','D','E'],
		 onValueChanged:function(){
			 $scope.register.initial_index=null;
             if ($scope.register.initial_severity_level && $scope.register.initial_prob_level){
				$scope.register.initial_index=$scope.register.initial_prob_level+$scope.register.initial_severity_level;
			}
		 },
		
        bindingOptions: {
            value: 'register.initial_severity_level',
            
        }
    };
	
	
	
	$scope._sb_severity2=null;
	$scope.sb_severity2 = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['A','B','C','D','E'],
        onValueChanged:function(){
			
			 $scope.register.final_index=null;
             if ($scope.register.final_severity_level && $scope.register.final_prob_level){
				$scope.register.final_index=$scope.register.final_prob_level+$scope.register.final_severity_level;
			}
		},
        bindingOptions: {
            value: 'register.final_severity_level',
            
        }
    };
	
	
	
	$scope._sb_prob=null;
	$scope.sb_prob = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: [1,2,3,4,5],
         onValueChanged:function(){
			 $scope.register.initial_index=null;
             if ($scope.register.initial_severity_level && $scope.register.initial_prob_level){
				$scope.register.initial_index=$scope.register.initial_prob_level+$scope.register.initial_severity_level;
			}
		 },
        bindingOptions: {
            value: 'register.initial_prob_level',
            
        }
    };
	
	
	$scope._sb_prob2=null;
	$scope.sb_prob2 = {
        showClearButton: true,
        searchEnabled: true,
         dataSource: [1,2,3,4,5],
         onValueChanged:function(){
			
			 $scope.register.final_index=null;
             if ($scope.register.final_severity_level && $scope.register.final_prob_level){
				$scope.register.final_index=$scope.register.final_prob_level+$scope.register.final_severity_level;
			}
		},
        bindingOptions: {
            value: 'register.final_prob_level',
            
        }
    };
	
	 
	
	
	$scope._sb_risk_type=null;
	$scope.sb_risk_type = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Tolerable and Acceptable','Intolerable'],
        
        bindingOptions: {
            value: 'register.initial_acceptability',
            
        }
    };
	
	
	$scope._sb_description=null;
	$scope.sb_description = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Control action is required','No control action is required','Urgent control action is','Stop operations'],
        
        bindingOptions: {
            value: 'register.initital_description',
            
        }
    };
	
	
	$scope._sb_responsible_manager=null;
	$scope.sb_responsible_manager = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Operations','E & M','Safety & Compliance Monitoring','Ground Operations','Dispatch','Security','Training','Catering'],
        
        bindingOptions: {
            value: 'register.initial_responsible_manager',
            
        }
    };
	
	
	$scope._sb_accept=null;
	$scope.sb_accept = {
        showClearButton: true,
        searchEnabled: true,
         dataSource: ['Tolerable and Acceptable','Intolerable'],
        
        bindingOptions: {
            value: 'register.final_acceptability',
            
        }
    };
	
	
	 
	$scope.dg_consequences_selected = null;
    $scope.dg_consequences_instance = null;
    $scope.dg_consequences_ds = [];
    $scope.dg_consequences = {
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
       
        height: 150, 

        columns: [
		      { dataField: 'title', caption: 'Hazard Consequence', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,},
			/*  {
            dataField: "id",
            caption: '',
            width: 80,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_con',
            name: 'delete_con',
            fixed: false,
            fixedPosition: 'right',
            },*/
			  
		],
        onContentReady: function (e) {
            if (!$scope.dg_consequences_instance)
                $scope.dg_consequences_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_consequences_selected = null;

            }
            else {
                $scope.dg_consequences_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_consequences_ds',

        }
    };
	$scope._txt_con=null;
	$scope.txt_con = {
        
        bindingOptions: {
            value: '_txt_con',


        }
    };
	$scope.btn_add_con={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
            
               if (!$scope._txt_con)
				return;
			 
            var _id=-1*($scope.dg_consequences_ds.length+1);
			$scope.dg_consequences_ds.push({id:_id,title:$scope._txt_con});
			$scope._txt_con=null;

        }

    };
	$scope.btn_remove_con={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	$scope.remove_dummy=function(ds){
		
		ds=Enumerable.From(ds).Where('!$.dummy').ToArray();
		return ds;
	};
	$scope.dg_action_taken_selected = null;
    $scope.dg_action_taken_instance = null;
    $scope.dg_action_taken_ds = [];
    $scope.dg_action_taken = {
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
        width:function(){ return $(window).width()*0.37;},
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
       
        height: 150, 

        columns: [
		   { dataField: 'action', caption: 'Action Taken', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,minWidth:300 },
		   { dataField: 'responsible_staff', caption: 'Responsible', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
		   { dataField: 'time_limit_remark', caption: 'Time Limit', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
		   
		   { dataField: 'date', caption: 'Date', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:120,format: 'yyyy-MMM-dd' },
		   { dataField: 'qa_approval_date', caption: 'QA App.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:120,format: 'yyyy-MMM-dd' },
		   /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_action',
            name: 'delete_action',
            fixed: true,
            fixedPosition: 'right',
        },*/
		   
		   
		],
        onContentReady: function (e) {
            if (!$scope.dg_action_taken_instance)
                $scope.dg_action_taken_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_action_taken_selected = null;

            }
            else {
                $scope.dg_action_taken_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_action_taken_ds',

        }
    };
	$scope._txt_action=null;
	$scope.txt_action = {
        
        bindingOptions: {
            value: '_txt_action',


        }
    };
	$scope._txt_action_staff=null;
	$scope.txt_action_staff = {
        
        bindingOptions: {
            value: '_txt_action_staff',


        }
    };
	
	$scope._txt_action_time_limit=null;
	$scope.txt_action_time_limit = {
        
        bindingOptions: {
            value: '_txt_action_time_limit',


        }
    };
	$scope._date_action_qa_approval=null;
	$scope.date_action_qa_approval = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_action_qa_approval',

        }
    };
	
	$scope._date_action_staff=null;
	$scope.date_action_staff = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_action_staff',

        }
    };
	
	$scope.btn_add_action={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
             if (!$scope._txt_action)
				return;
			
            var _id=-1*($scope.dg_action_taken_ds.length+1);
			$scope.dg_action_taken_ds.push({
				id:_id,
				action:$scope._txt_action,
				responsible_staff:$scope._txt_action_staff,
				time_limit_remark:$scope._txt_action_time_limit,
				qa_approval_date:$scope._date_action_qa_approval,
				date:$scope._date_action_staff,
			});
			 
            $scope._txt_action=null;
			//setTimeout(function(){alert('x');$scope.dg_action_taken_instance.refresh();}, 500);

        }

    };
	$scope.btn_remove_action={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	
	$scope.dg_monitoring_selected = null;
    $scope.dg_monitoring_instance = null;
    $scope.dg_monitoring_ds = [];
    $scope.dg_monitoring = {
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
       
        height: 120, 

         columns: [
		   
		   { dataField: 'date_last_updated', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MMM-dd' },
		   { dataField: 'cpmment', caption: 'Comment', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
		   /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_monitor',
            name: 'delete_monitor',
            fixed: true,
            fixedPosition: 'right',
        },*/
		],
        onContentReady: function (e) {
            if (!$scope.dg_monitoring_instance)
                $scope.dg_monitoring_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_monitoring_selected = null;

            }
            else {
                $scope.dg_monitoring_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_monitoring_ds',

        }
    };
	$scope._txt_monitor=null;
	$scope.txt_monitor = {
        
        bindingOptions: {
            value: '_txt_monitor',


        }
    };
	$scope._date_last_updated=null;
	$scope.date_last_updated = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_last_updated',

        }
    };
	$scope.btn_add_monitor={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
             if (!$scope._txt_monitor)
				return;
			
            var _id=-1*($scope.dg_monitoring_ds.length+1);
			$scope.dg_monitoring_ds.push({id:_id,cpmment:$scope._txt_monitor,date_last_updated:$scope._date_last_updated});
            $scope._txt_monitor=null;
			$scope._date_last_updated=null;

        }

    };
	$scope.btn_remove_monitor={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	
	$scope.dg_root_cause_selected = null;
    $scope.dg_root_cause_instance = null;
    $scope.dg_root_cause_ds = [];
    $scope.dg_root_cause = {
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
       
        height: 120, 

        columns: [
		 { dataField: 'root_cause', caption: 'Root Cause', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
		 /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_root',
            name: 'delete_root',
            fixed: true,
            fixedPosition: 'right',
        },*/
		],
        onContentReady: function (e) {
            if (!$scope.dg_root_cause_instance)
                $scope.dg_root_cause_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_root_cause_selected = null;

            }
            else {
                $scope.dg_root_cause_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_root_cause_ds',

        }
    };
	$scope._txt_root=null;
	$scope.txt_root = {
        
        bindingOptions: {
            value: '_txt_root',


        }
    };
	$scope.btn_add_root={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
            if (!$scope._txt_root)
				return;
			
            var _id=-1*($scope.dg_root_cause_ds.length+1);
			$scope.dg_root_cause_ds.push({id:_id,root_cause:$scope._txt_root});
			$scope._txt_root=null;

        }

    };
	$scope.btn_remove_root={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }
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
	
	
	
	$scope.popup_hazard_visible = false;
    $scope.popup_hazard_title = 'Hazard Log';
    $scope.popup_hazard = {
        shading: true,
        height: 750,
        width: 690,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {




        },
        onShown: function (e) {

        },
        onHiding: function () {
           
        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_hazard_visible',



        }
    };

	
	$scope.scroll_hazard_height = $(window).height() - 200;
    $scope.scroll_hazard = {
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
            height: 'scroll_hazard_height'
        }

    };
	
	$scope.get_hazard_style=function(){
		
		return {
			
		  height:690
		};
	};
	
	
	
	$scope.register={
		 id:-1,
	    // form_type:$scope.tempData.Type,
	    // form_id:$scope.tempData.Id,
        form_type:'log',
	     form_id:'log',
		id_date:null,
		 id_department:null,
		 id_risk_register_number:null,
	     id_hazard_description:null,
		 
		 initial_prob_level:null,
	     initial_severity_level:null,
	      initial_index:null,
		final_prob_level:null,
		final_severity_level:null,
		final_index:null,
		approval_relevant_department:null,
		approval_relevant_department_id:null,
		approval_relevant_department_date:null,
		approval_qa:null,
		approval_qa_id:null,
		approval_qa_date:null,
		
		initial_acceptability:null,
		initital_description:null,
		initial_responsible_manager:null,
		initial_responsible_sign:null,
		initial_qa_approval:null,
		initial_qa_sign:null,
		final_acceptability:null,
		final_date:null,
		
 
		remark:null,
		id_source:null,
		has_relevant:null,
		consequences:[],
		actions:[],
		monitors:[],
		
		root_causes:[],
	 };
	$scope.btn_save_register = {
        text: 'SAVE',
        //hint: 'Airport Weekly Report',
        type: 'default',
        //icon: 'fas fa-print',
        width: '120',

        onClick: function (e) {
            //2024-01-16
			$scope.register.actions=$scope.dg_action_taken_ds;
			$scope.register.monitors=$scope.dg_monitoring_ds;
			$scope.register.consequences=$scope.dg_consequences_ds;
			$scope.register.root_causes=$scope.dg_root_cause_ds;
			console.log($scope.register);
			$scope.loadingVisible = true;
			qahService.saveRegister($scope.register).then(function (res) {
                             
                                $scope.loadingVisible = false;
								$scope.register={
		 id:-1,
	    // form_type:$scope.tempData.Type,
	    // form_id:$scope.tempData.Id,
        form_type:'log',
	     form_id:'log',
		id_date:null,
		 id_department:null,
		 id_risk_register_number:null,
	     id_hazard_description:null,
		 
		 initial_prob_level:null,
	     initial_severity_level:null,
	      initial_index:null,
		final_prob_level:null,
		final_severity_level:null,
		final_index:null,
		approval_relevant_department:null,
		approval_relevant_department_id:null,
		approval_relevant_department_date:null,
		approval_qa:null,
		approval_qa_id:null,
		approval_qa_date:null,
		
		initial_acceptability:null,
		initital_description:null,
		initial_responsible_manager:null,
		initial_responsible_sign:null,
		initial_qa_approval:null,
		initial_qa_sign:null,
		final_acceptability:null,
		final_date:null,
		
 
		remark:null,
		id_source:null,
		has_relevant:null,
		consequences:[],
		actions:[],
		monitors:[],
		
		root_causes:[],
	 };
                     $scope.popup_hazard_visible = false;       

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		/*	var acc=[];
		acc.push(
		{
			id:-1,
	 
			risk_type:$scope._sb_risk_type,
			is_control_action:$scope._sb_description=='Control action is required',
			is_no_control_action:$scope._sb_description=='No control action is required',
			is_urgent_control_action:$scope._sb_description=='Urgent control action is',
			is_stop_operation:$scope._sb_description=='Stop operations',
			responsible_manager:$scope._sb_responsible_manager,
			responsible_manager_id:null,
			responsible_manager_date:null,
			responsible_manager_qa_date:null,
			responsible_manager_qa_id:null,
			level_id:1,
			level_remark:null,
		},
		{
			id:-2,
	 
			risk_type:$scope._sb_accept,
			is_control_action:null,
			is_no_control_action:null,
			is_urgent_control_action:null,
			is_stop_operation:null,
			responsible_manager:null,
			responsible_manager_id:null,
			responsible_manager_date:null,
			responsible_manager_qa_date:null,
			responsible_manager_qa_id:null,
			level_id:2,
			level_remark:null,
		}
		);*/
		
		
		
		
		
		
		
		
		// end of click
        }

    };
	
	$scope.bind_register=function(){
		
		qahService.getRegister($scope.tempData.Id,$scope.tempData.Type).then(function (res) {
                             
                                $scope.loadingVisible = false;
								//$scope.register.id=res;
								console.log('bound',res);
		
								 $scope.register.id= res.id;
	     $scope.register.form_type= 'log';
	     $scope.register.form_id= 'log';
         $scope.register.id_date= res.id_date;
		 $scope.register.id_department= res.id_department;
		 $scope.register.id_risk_register_number= res.id_risk_register_number;
	     $scope.register.id_hazard_description= res.id_hazard_description;
		 
		 $scope.register.initial_prob_level= res.initial_prob_level;
	     $scope.register.initial_severity_level= res.initial_severity_level;
	      //$scope.register.initial_index= res.initial_index;
		$scope.register.final_prob_level= res.final_prob_level;
		$scope.register.final_severity_level= res.final_severity_level;
		//$scope.register.final_index= res.final_index;
		$scope.register.approval_relevant_department= res.approval_relevant_department;
		$scope.register.approval_relevant_department_id= res.approval_relevant_department_id;
		$scope.register.approval_relevant_department_date= res.approval_relevant_department_date;
		$scope.register.approval_qa= res.approval_qa;
		$scope.register.approval_qa_id= res.approval_qa_id;
		$scope.register.approval_qa_date= res.approval_qa_date;
		
		$scope.register.initial_acceptability= res.initial_acceptability;
		$scope.register.initital_description= res.initital_description;
		$scope.register.initial_responsible_manager= res.initial_responsible_manager;
		$scope.register.initial_responsible_sign= res.initial_responsible_sign;
		$scope.register.initial_qa_approval= res.initial_qa_approval;
		$scope.register.initial_qa_sign= res.initial_qa_sign;
		$scope.register.final_acceptability= res.final_acceptability;
		$scope.register.final_date= res.final_date;
		$scope.register.remark= res.remark;
		$scope.register.id_source= res.id_source;
		
		$scope.register.consequences= res.consequences;
		$scope.dg_consequences_ds=res.consequences;
		
		$scope.register.actions= res.actions;
		$scope.dg_action_taken_ds=res.actions;
		
		$scope.register.monitors= res.monitors;
		$scope.dg_monitoring_ds=res.monitors;
		
		$scope.register.root_causes= res.root_causes;
		$scope.dg_root_cause_ds=res.root_causes;
		
 
		
                                
                            

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		 
		
		
	};
	$scope.get_register_style=function(){
		
		return {
			
		  height:$(window).height()-200
		};
	};


    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Hazard Log';
        $('.qahazardlog').fadeIn();
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