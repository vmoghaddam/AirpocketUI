'use strict';

app.controller('flightListController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService,weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.typeId = $route.current.type;
    $scope.airport = $routeParams.airport;
    $scope.airportEntity = null;
    //////////////////////////////////

    $scope.filterVisible = false;
    $scope.plan = { /*DateFrom: new Date(), DateTo: new Date()*/ };
    $scope.IsDetailsVisible = false;
    $scope.IsTabDisabled = false;
    /////////////////////////////////


    ////////////////////////////
    $scope.scroll_height = 200;

    $scope.scroll_info = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () {
            return window.innerHeight - 180;
        },
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

     
    $scope.IsApproveDisabled = true;
    $scope.btn_approve = {
        text: 'Approve',
        type: 'default',
        icon: 'check',
        width: 150,
        bindingOptions: {
            disabled: 'IsApproveDisabled'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_SimpleConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id };
                    $scope.loadingVisible = true;
                    flightService.approvePlanRegisters(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.IsApproveDisabled = true;
                        $scope.doRefresh = true;
                        $scope.bind();




                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });


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
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'info',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.popup_flight_visible = true;
            //$scope.loadingVisible = true;
            //flightService.getFlightPlanView($scope.dg_selected.Id).then(function (response) {
            //    $scope.loadingVisible = false;
            //    $scope.tempData = response;
            //    $scope.popup_add_visible = true;
            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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



    ////////////////////////////////////
    $scope.date_from = {
        type: "date",
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.DateFrom', }
    };
    $scope.date_to = {
        type: "date",
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.DateTo', }
    };
    $scope.text_interval = {
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.IntervalType', }
    };
    $scope.text_month = {
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.MonthsStr', }
    };
    $scope.text_day = {
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.DaysStr', }
    };
    $scope.text_type = {
        readOnly: true,
        width: '100%',
        bindingOptions: { value: 'plan.Types', }
    };


    ////////////////////////////////////


    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;



    /////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        {
            dataField: "delay1", caption: '',
            width: 50,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                var color = 'lightgray';
                if (options.data.FlightStatusID > 1) {

                    if (options.data.DelayOffBlock > 0 || options.data.DelayOnBlock > 0)
                        color = '#e51400';
                    else
                        color = '#60a917';
                }
                $("<div>")
                    .append('<i class="fas fa-clock" style="color:' + color + ';font-size:16px"></i>')
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
        {
            dataField: "FlightStatusID", caption: '',
            width: 150,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                /*if (options.value == 12)
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
                   */
                var st = Flight.getStatus(options.value);
                var color = st.bgcolor;
                var str = options.data.FlightStatus;
                // str = '';
                switch (options.value) {
                    case 1:

                        $("<div>")
                            .append('<i class="fas fa-calendar-day" style="color:' + 'lightgray' + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 14:

                        $("<div>")
                            .append('<i class="far fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 2:

                        $("<div>")
                            .append('<i class="fas fa-plane-departure" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 3:

                        $("<div>")
                            .append('<i class="fas fa-plane-arrival" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 15:

                        $("<div>")
                            .append('<i class="fas fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 7:

                        $("<div>")
                            .append('<i class="fas fa-level-down-alt" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 17:

                        $("<div>")
                            .append('<i class="fas fa-random" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 4:

                        $("<div>")
                            .append('<i class="fas fa-ban" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    default:
                        break;
                }

            },
            fixed: true, fixedPosition: 'left',
        },
        //{ dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,  },
        
        {
            caption: 'Aircraft', columns: [
                { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        { dataField: 'FlightTypeAbr', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: true, fixedPosition: 'left' },
        { dataField: 'ID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left' },

        {
            caption: 'Airports', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        {
            caption: 'Duration', columns: [
                { dataField: 'ActualFlightHOffBlock', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ActualFlightMOffBlock', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        {
            caption: 'Departure',
            columns: [
                { dataField: 'STD', caption: 'Scheduled Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 170, alignment: 'center', format: 'yyyy-MMM-dd, HH:mm', sortIndex: 0, sortOrder: "desc" },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [
                { dataField: 'STA', caption: 'Scheduled Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
            ]
        },
        // { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        // { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },

        // { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'right' },
        {
            caption: 'Pax',
            columns: [
                { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxChild', caption: 'Child', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'TotalPax', caption: 'Total', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', name: 'totalpax' },
                { dataField: 'TotalSeat', caption: 'Seats', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'PaxOver', caption: 'Over', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },
        {
            caption: 'Cargo',
            columns: [
                { dataField: 'CargoUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'CargoWeight', caption: 'Weight', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'cargoweight', },
                { dataField: 'CargoCount', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },

        {
            caption: 'Baggage',
            columns: [
                { dataField: 'CargoUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'BaggageWeight', caption: 'Weight', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'baggageweight', },
                { dataField: 'BaggageCount', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
            ]
        },
        {
            caption: 'Fuel',
            columns: [
                { dataField: 'FuelUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'FuelDeparture', caption: 'Dep.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FuelArrival', caption: 'Arr.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
            ]
        },
        {
            caption: 'Delays', fixed: true, fixedPosition: 'right', columns: [
                { dataField: 'DelayOffBlock', caption: 'Dep.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delay', },
                { dataField: 'DelayOnBlock', caption: 'Arr.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delayLanding', },

            ]
        },





    ];
    $scope.dg_height = 100;

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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 50 },
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
                $scope.IsDetailsVisible = false;
                $scope.flight = {};
                $scope.dg_delay_ds = null;

            }
            else {
                $scope.dg_selected = data;
                $scope.flight = data;
               


            }


        },
        height: $(window).height() - 135,
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    /////////////////////////////////
    $scope.getStatusClass = function (filght) {
        var status = Enumerable.From(Flight.statusDataSource).Where('$.id==' + filght.status).FirstOrDefault();
        return "col-lg-3 col-md-3 col-sm-3 col-xs-3 font-inherit " + status.class;
    };
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //height: function () { return $(window).height() * 0.95-120 },
        height: 534,
    };
    $scope.scroll_dep = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //    height: function () { return $(window).height() * 0.95 - 150 },
        height: 497,
    };
    $scope.scroll_weather = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //    height: function () { return $(window).height() * 0.95 - 150 },
        height: 497,
    };
    
    $scope.scroll_arr = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        //    height: function () { return $(window).height() * 0.95 - 150 },
        height: 497,
    };
    var tabs = [
        { text: "Main", id: 'departure', visible: true },
        

        { text: "Delays", id: 'delays', visible: true },
        { text: "Weather", id: 'weather', visible: true },
        //{ text: "Education", id: 'education', visible: true },

        //{ text: "Course", id: 'course', visible: true },
        //{ text: "Group", id: 'group', visible: true },
        //{ text: "Employee", id: 'employee', visible: true },


    ];
    //var tabs2 = [
    //    { text: "Main", id: 'arrival', visible: true },
    //    { text: "Departure", id: 'depparr', visible: true },


    //];
    $scope.tabs = tabs;
    $scope.selectedTabIndex = -1;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            $scope.dg_delay_instance.repaint();


        }
        catch (e) {
            //
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
    //////////////////////////
    $scope.dg_delay_selected = null;
    $scope.dg_delay_columns = [

        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, groupIndex: 0 },
        { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 90, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
        //  { dataField: 'HH', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 80 },
        { dataField: 'MM', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: true, width: 90 },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },





    ];
    $scope.dg_delay_height = 100;

    $scope.dg_delay_instance = null;
    $scope.dg_delay_ds = null;
    $scope.dg_delay = {
        editing: {
            allowUpdating: true,
            mode: 'cell'
        },
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
        onEditingStart: function (e) {
            if (e.column.dataField == 'MM' && !e.key.Selected)
                e.cancel = true;
        },
        onRowUpdating: function (e) {
            if (!e.newData.hasOwnProperty('Selected'))
                return;
            if (!e.newData.Selected) {
                //e.key.HH = null;
                // e.key.MM = null;
                e.newData.HH = null;
                e.newData.MM = null;
            }
        },
        onRowUpdated: function (e) {
            //if (!e.key.Selected) {
            //    e.key.HH = null;
            //    e.key.MM = null;
            //}
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_delay_columns,
        onContentReady: function (e) {
            if (!$scope.dg_delay_instance)
                $scope.dg_delay_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_delay_selected = null;



            }
            else {
                $scope.dg_delay_selected = data;


            }


        },
        height: 497,
        summary: {
            totalItems: [{
                column: "MM",
                summaryType: "sum"
            }]
        },

        bindingOptions: {
            dataSource: 'dg_delay_ds', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };
    ////////////////////////////
    $scope.flight = {};
    $scope.time_std = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.STD',

        }
    };
    $scope.time_sta = {
        type: "datetime",
        width: '100%',
        readOnly: true,
        bindingOptions: {
            value: 'flight.STA',

        }
    };
    $scope.time_offblock = {
        type: "datetime",
        width: '100%',
        interval: 5,
        readOnly: true,
        bindingOptions: {
            value: 'flight.ChocksOut',
            
        }
    };
    $scope.time_takeoff2 = {
        type: "datetime",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        readOnly:true,
        bindingOptions: {
            value: 'flight.Takeoff',
           
           
        }
    };
    $scope.time_landing = {
        type: "datetime",
        readOnly: true,
        width: '100%',
        
        interval: 5,
        
        bindingOptions: {
            value: 'flight.Landing',
           

        }
    };
    $scope.time_onblock = {
        type: "datetime",
        readOnly: true,
        width: '100%',

        interval: 5,

        bindingOptions: {
            value: 'flight.ChocksIn',


        }
    };

    $scope.total_seats = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.TotalSeat'
        }
    };
    $scope.total_pax = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.TotalPax'
        }
    };
    $scope.pax_adult = {
        readOnly: true,
        min: 0,
       
        bindingOptions: {
            value: 'flight.PaxAdult',
           
        }
    };
    $scope.pax_child = {
        readOnly: true,
        min: 0,
         
        bindingOptions: {
            value: 'flight.PaxChild',
            
        }
    };
    $scope.pax_infant = {
        readOnly: true,
        min: 0,
         
        bindingOptions: {
            value: 'flight.PaxInfant',
            
        }
    };
    $scope.pax_over = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            
            value: 'flight.PaxOver',
        }
    };
    $scope.cargo_piece = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.CargoCount',
           
        }
    };
    $scope.cargo_weight = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.CargoWeight',
           
        }
    };
    $scope.cargo_excess = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            
        }
    };
    $scope.bag_piece = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.BaggageCount',
            
        }
    };
    $scope.bag_weight = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.BaggageWeight',
            
        }
    };
    $scope.bag_excess = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            
        }
    };
    $scope.txt_massunit = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.CargoUnit'
        }
    };
    $scope.txt_fuelunit = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.FuelUnit'
        }
    };
    $scope.remark_dep = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.DepartureRemark',
           
        }
    };
    $scope.remark_arr = {
        readOnly: true,
        bindingOptions: {
            value: 'flight.ArrivalRemark',
        }
    };
    $scope.fuel_dep = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.FuelDeparture',
            
        }
    };
    $scope.fuel_arr = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.FuelArrival'
        }
    };
    $scope.fuel_actual = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.FuelActual'
        }
    };
    $scope.fuel_planned = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.FuelPlanned'
        }
    };
    $scope.fuel_variance = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.FuelVariance',

        }
    };
    $scope.txt_delay = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.DelayOffBlock',

        }
    };
    $scope.txt_delayLanding = {
        readOnly: true,
        min: 0,
        bindingOptions: {
            value: 'flight.DelayOnBlock',

        }
    };
    ///////////////////////////
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Departure';
    $scope.popup_flight = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_flight"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        width: 1200,
        //height: function () { return $(window).height() * 0.95 },
        height: 647,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

            //if ($scope.flight.ChocksOut)
            //    $scope.flightOffBlock2 = $scope.flight.ChocksOut;
            //else {

            //    $scope.flightOffBlock2 = Flight.getEstimatedOffBlock($scope.flight);
            //}
            //$scope.flightTakeOff2 = $scope.flight.Takeoff;
            //$scope.depReadOnly = false;
            $scope.selectedTabIndex = 0;
            //$scope.setWeather();

        },
        onShown: function (e) {
            if (!$scope.flight.delays) {
                $scope.loadingVisible = true;
                flightService.getFlightDelayCodes($scope.flight.ID).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.flight.delays = response;
                    $scope.dg_delay_ds = response;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                $scope.dg_delay_ds = $scope.flight.delays;

            if ($scope.flight.IsWeather != 1) {
                $scope.loadingVisible = true;
                weatherService.getFlightAll($scope.flight.ID).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.flight.IsWeather = 1;
                    $.each(response, function (_i, _d) {
                        if (_d.StatusId == 2) {
                            //Weather.prepareWeather
                            $scope.flight.WTakeoff = JSON.parse(_d.Details);
                            Weather.prepareWeather($scope.flight.WTakeoff);
                            $scope.flight.WTakeoffVisible = true;
                        }
                        if (_d.StatusId == 3) {
                            $scope.flight.WLanding = JSON.parse(_d.Details);
                            Weather.prepareWeather($scope.flight.WLanding);
                            $scope.flight.WLandingVisible = true;
                        }
                        if (_d.StatusId == 14) {
                            $scope.flight.WOffBlock = JSON.parse(_d.Details);
                            Weather.prepareWeather($scope.flight.WOffBlock);
                            $scope.flight.WOffBlockVisible = true;
                        }
                        if (_d.StatusId == 15) {
                            $scope.flight.WOnBlock = JSON.parse(_d.Details);
                            Weather.prepareWeather($scope.flight.WOnBlock);
                            $scope.flight.WOnBlockVisible = true;
                        }

                    });
                   


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
        },
        onHiding: function () {

            $scope.selectedTabIndex = -1;
            $scope.popup_flight_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_visible',

            title: 'popup_flight_title',

        }
    };

    //close button
    $scope.popup_flight.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_flight_visible = false;

    };
    ///////////////////////////
    $scope.bind = function () {
        //odata/flights/{cid}/{airport?}
        var url = 'odata/flights/' + Config.CustomerId + '/' + ($scope.airport ? $scope.airportEntity.Id : '-1');
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "ID",
                    version: 4,
                    onLoading: function (e) {

                    },
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //console.log(e);
                        $.each(e, function (_i, _d) {
                            _d.STD = new Date(_d.STD + '.000Z');
                            _d.STA = new Date(_d.STA + '.000Z');
                            if (_d.ChocksOut)
                                _d.ChocksOut = new Date(_d.ChocksOut + '.000Z');
                            if (_d.ChocksIn)
                                _d.ChocksIn = new Date(_d.ChocksIn + '.000Z');
                            if (_d.Takeoff)
                                _d.Takeoff = new Date(_d.Takeoff + '.000Z');
                            if (_d.Landing)
                                _d.Landing = new Date(_d.Landing + '.000Z');
                        });
                        //  console.log(e);
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
                sort: [{ getter: "ID", desc: false }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

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


    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights Archive';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightlist').fadeIn(400, function () {
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
        console.log(prms);
        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    //$scope.$on('onLibrarySaved', function (event, prms) {

    //    $scope.doRefresh = true;
    //});
    //$scope.$on('onLibraryHide', function (event, prms) {

    //    $scope.bind();

    //});
    //////////////////////////////////////////
    //ko.applyBindings(dataView);
    $scope.$on('$viewContentLoaded', function () {
        if ($scope.airport) {
            $scope.loadingVisible = true;
            flightService.getAirportByIATA($scope.airport).then(function (response) {
                $scope.airportEntity = response;

                $scope.airportEntity.Latitude2 = Number($scope.airportEntity.Latitude).toFixed(3);
                $scope.airportEntity.Longitude2 = Number($scope.airportEntity.Longitude).toFixed(3);
                $scope.airportEntity.LtLg = '(' + $scope.airportEntity.Latitude2 + ', ' + $scope.airportEntity.Longitude2 + ')';
                $scope.loadingVisible = false;



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }


    });
    $rootScope.$broadcast('FlightLoaded', null);





}]);