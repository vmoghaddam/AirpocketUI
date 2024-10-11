'use strict';
app.controller('fuelReportOFPController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'crewreportsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_ds = null;
            $scope.bind();
        }

    };
    $scope.selected_employee_id = null;
   

  
  
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
    $scope.dt_from = new Date();
    $scope.dt_to = new Date();
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
               // { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
                { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yyyy-MM-dd', sortIndex: 0, sortOrder: "asc" },
                { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },

            ],
        },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },

        { dataField: 'P2Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'PF', caption: 'P/I/F', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
        {
            caption: 'Time',
            columns: [
                { dataField: 'OFPTripTime2', caption: 'OFP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
                { dataField: 'BlockTime2', caption: 'Act. Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
                { dataField: 'FlightTime2', caption: 'Act. Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },

            ]
        },
        { dataField: 'FuelRate', caption: 'Cons./hr', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, },
        {
            caption: 'Total Fuel',
            columns: [
                { dataField: 'OFPFuel', caption: 'OFP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'ReqFuel', caption: 'Requested', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Due', caption: 'Due', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left' },
                { dataField: 'DiffTotalFuel', caption: 'Diff', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'DiffPerTotalFuel', caption: 'Diff(%)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
            ]
        },
        {
            caption: 'Trip Fuel',
            columns: [
                { dataField: 'OFPTripFuel', caption: 'OFP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'TripFuel', caption: 'Actual', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'DiffTripFuel', caption: 'Diff', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'DiffPerTripFuel', caption: 'Diff(%)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },

            ]
        },
        {
            caption: 'Taxi Fuel',
            columns: [
                { dataField: 'OFPTaxi', caption: 'OFP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Taxi', caption: 'Actual', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'DiffTaxi', caption: 'Diff', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'DiffPerTaxi', caption: 'Diff(%)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },

            ]
        },
         
        {
            caption: 'Flight',
            columns: [


                 { dataField: 'BlockOff', caption: 'OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'BlockOn', caption: 'OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

                { dataField: 'TakeOff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

               
                { dataField: 'PaxTotal', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
               
                { dataField: 'BaggageWeight', caption: 'Bag. Weight', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'CargoWeight', caption: 'Cargo. Weight', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                 
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
                column: "ReqFuel",
                showInColumn: "ReqFuel",

                customizeText: function (e) {

                    return (e.value / 1000).toFixed(2).toString() + ' K';
                },
                summaryType: "sum"
            },
            {
                column: "TripFuel",
                showInColumn: "TripFuel",
                customizeText: function (e) {

                    return (e.value / 1000).toFixed(2).toString() + ' K';
                },
                summaryType: "sum"
                },
                {
                    column: "Taxi",
                    showInColumn: "Taxi",
                    customizeText: function (e) {

                        return (e.value / 1000).toFixed(2).toString() + ' K';
                    },
                    summaryType: "sum"
                },
            {
                column: "FuelRate",
                showInColumn: "FuelRate",

                customizeText: function (e) {

                    return 'Avg: ' + (e.value ).toFixed(1).toString() ;
                },
                summaryType: "avg"
            },
             
            ],
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "TripFuel" && e.data.TripFuel > e.data.OFPTripFuel)
                e.cellElement.css("backgroundColor", "#ffcccc");
            if (e.rowType === "data" && e.column.dataField == "ReqFuel" && e.data.ReqFuel > e.data.OFPFuel)
                e.cellElement.css("backgroundColor", "#ffcccc");

            if (e.rowType === "data" && e.column.dataField == "DiffPerTripFuel" && e.data.DiffPerTripFuel > 0)
                e.cellElement.css("backgroundColor", "#ffcccc");
            else if (e.rowType === "data" && e.column.dataField == "DiffPerTripFuel" /*&& e.data.AvgVar*/)
                e.cellElement.css("backgroundColor", "#ccffdd");

            if (e.rowType === "data" && e.column.dataField == "DiffPerTotalFuel" && e.data.DiffPerTotalFuel > 0)
                e.cellElement.css("backgroundColor", "#ffcccc");
            else if (e.rowType === "data" && e.column.dataField == "DiffPerTotalFuel" /*&& e.data.AvgVarReg*/)
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
     
    
    
    ///////////////////////////////////
    
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
        var _df = moment(df).format('YYYY-MM-DD');
        var _dt = moment(dt).format('YYYY-MM-DD');

        $scope.loadingVisible = true;
        flightService.getFuelOFP(_df, _dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.BlockTime2 = $scope.formatMinutesXXX(_d.BlockTime);
                _d.FlightTime2 = $scope.formatMinutesXXX(_d.FlightTime);
                _d.OFPTripTime2 = $scope.formatMinutesXXX(_d. OFPTripTime);
            });
            $scope.dg_ds  = response;

            

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        /*
         
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
        }*/

    };



    

 


    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Fuel';
        $('.fuelreportofp').fadeIn();
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