'use strict';

app.controller('flightPlanApply2Controller', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////

    $scope.filterVisible = false;
    $scope.plan = { /*DateFrom: new Date(), DateTo: new Date()*/ };
    $scope.IsDetailsVisible = true;
    $scope.IsTabDisabled = false;
    /////////////////////////////////
    $scope.tabs = [

       // { text: "Calendar", id: 'calendar', },
       // { text: "Information", id: 'information', },
        //  { text: "حساب بانکی", id: 'account', visible_btn: false },
        //{ text: "Certificate", id: 'certificate', visible_btn: true },
       // { text: "Registers", id: 'registers', },
        { text: "Flights", id: 'flights', },
        { text: "Permits", id: 'permits', },
        { text: "Crew", id: 'crew', },



    ];

    $scope.$watch("selectedTabIndex", function (newValue) {

        try {

            $scope.selectedTab = $scope.tabs[newValue];
            $('.tab').hide();

            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            $scope.dg_flight_instance.repaint();
            $scope.dg_permits_instance.repaint();
            $scope.dg_crew_instance.repaint();




        }
        catch (e) {
            //exceptions
            //alert(e);
        }

    });
    $scope.selectedTabIndex = 0;
    //$('.tab').hide();
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex',
            disabled: 'IsTabDisabled'
        }

    };
    ///////////////////////////
    $scope.minDate = new Date();
    $scope.maxDate = new Date();
    $scope.scheduleCurrentDate = null;
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
        //currentDate: new Date("2019/01/01"),
        showCurrentTimeIndicator: false,
        //height: 430,
        height: function () {
            return window.innerHeight - 180;
        },
        // width:500,
        // dataCellTemplate: 'dataCellTemplate',
        appointmentTemplate: function (data) {


            return $("<div style='text-align:center; height:30px;color:green;background:white;margin-top:-5px'><i style='font-size:24px' class='icon ion-md-checkmark'></i></div>");

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

        },
        bindingOptions: {
            dataSource: "data",
            min: "plan.DateFrom",
            max: "plan.DateTo",
            currentDate: 'scheduleCurrentDate',
            // currentDate:"currentDate",


        },
        //onCellContextMenu: function (e) {
        //   // $scope.contextMenuCellData = e.cellData;
        //    alert('x');
        //},

    };
    ////////////////////////////
    $scope.scroll_height = 200;
    $scope.scroll_calendar = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () {
            return window.innerHeight - 180;
        },
    };
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
            $scope.loadingVisible = true;
            flightService.getFlightPlanView($scope.dg_selected.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.tempData = response;
                $scope.popup_add_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
    $scope.IsApproveDisabled = true;
    $scope.btn_approve = {
        text: 'Apply',
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

                    var dto = { Id: $scope.dg_selected.FlightPlanRegisterId };
                    $scope.loadingVisible = true;
                    flightService.applyPlanCalander(dto).then(function (response) {
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
        if ($scope.plan.Interval && $scope.plan.DateFrom && $scope.plan.DateTo) {
            var min = new Date($scope.plan.DateFrom);
            min = new Date(min.setHours(0, 0, 0, 0));

            var max = new Date($scope.plan.DateTo);
            max = new Date(max.setHours(23, 59, 59, 999));

            switch ($scope.plan.Interval) {
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
                    $scope.addCustom(min, max, $scope.plan.Months, $scope.plan.Days);
                    break;
                default:
                    break;
            }
        }
        $scope.scheduler_instance.repaint();

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
    ////////////////////////////////////
    $scope.fillPlan = function (data) {
        $scope.plan = data;

        $scope.plan.Interval = Number($scope.plan.Interval);
        $scope.scheduleCurrentDate = new Date($scope.plan.DateFrom);
        $scope.fillSchedule();
    };

    /////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        {
            dataField: "", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {


                if (options.data.IsApplied) {

                    $("<div>")
                        .append("<i style='font-size:22px;color:green!important' class='icon ion-md-checkmark-circle '></i>")
                        .appendTo(container);
                }
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:red!important' class='icon ion-md-help-circle'></i>")
                        .appendTo(container);

            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'Date', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', fixed: false, fixedPosition: 'right' },
         { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150, },
        { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',   },
     // { dataField: 'BaseName', caption: 'Base Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },
        // { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
       // { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

       // { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 170, alignment: 'center', fixed: false, fixedPosition: 'right' },
       // { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 170, fixed: false, fixedPosition: 'right' },
       
       // { dataField: 'VirtualRegister', caption: 'Design Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 180, },
        // { dataField: 'DateActive', caption: 'Applied Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
        
       




    ];
    $scope.mih = 140;
    $scope.dg_height = $(window).height() - 135 - $scope.mih;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    var offset = -1 * (new Date()).getTimezoneOffset();
    $scope.dg = {
        //masterDetail: {
        //    enabled: true,
        //    template: "detail"
        //},
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
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_columns,
        onRowExpanding: function (e) {
            //  alert(e.key);

        },
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
                $scope.IsApproveDisabled = true;
                $scope.dg_flight_ds = null;
                $scope.dg_crew_ds = null;
                $scope.dg_permits_ds = null;
            }
            else {
               
                $scope.dg_selected = data;
                
                $scope.IsApproveDisabled = data.IsApplied == 1;
                $scope.loadingVisible = true;
                flightService.getFlightPlanItems($scope.dg_selected.Id, offset).then(function (response) {

                     
                    $scope.dg_flight_ds  = response;
                    flightService.getFlightPlanPermits(data.Id, data.CalendarId).then(function (response2) {
                         
                         
                        $scope.dg_permits_ds = response2;
                        flightService.getFlightPlanCrew(data.Id, data.CalendarId).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.dg_crew_ds = response;

                            $scope.bindGantt();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            

            }


        },
        onRowPrepared: function (e) {
            if (e.data && !e.data.FlightPlanRegisterId) {
                e.rowElement.css('background', '#ffdddd');
            }

        },
        // height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
            height: 'dg_height'
        }
    };
    //////////////////////////////
    $scope.dg_flight_columns = [
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm',

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 400 },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight_height = null;
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


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
            else {
                $scope.dg_flight_selected = data;


            }


        },
        height: function () {
            return window.innerHeight - 173 - $scope.mih;
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////////
    $scope.dg_permits_columns = [
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130,groupIndex:0 },

        { dataField: 'Date', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 150, alignment: 'center' },
        { dataField: 'Title', caption: 'Title', allowResizing: true,   dataType: 'string', allowEditing: false, },


    ];

    $scope.dg_permits_selected = null;
    $scope.dg_permits_instance = null;
    $scope.dg_permits_ds = null;
    $scope.dg_permits_height = null;
    $scope.dg_permits = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_permits_columns,
        onContentReady: function (e) {
            if (!$scope.dg_permits_instance)
                $scope.dg_permits_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_permits_selected = null;



            }
            else {
                $scope.dg_permits_selected = data;


            }


        },
        height: function () {
            return window.innerHeight - 173 - $scope.mih;
        },
        bindingOptions: {
            dataSource: 'dg_permits_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };


    ///////////////////////////////
    $scope.dg_crew_columns = [
    //Flights
        { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200,groupIndex:0 },
        { dataField: 'JobGroup', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, dataType: 'string', allowEditing: false, width: 300, },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Phone', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

    ];

    $scope.dg_crew_selected = null;
    $scope.dg_crew_instance = null;
    $scope.dg_crew_ds = null;
    $scope.dg_crew_height = null;
    $scope.dg_crew = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_instance)
                $scope.dg_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_crew_selected = null;



            }
            else {
                $scope.dg_crew_selected = data;


            }


        },
        height: function () {
            return window.innerHeight - 173 - $scope.mih;
        },
        bindingOptions: {
            dataSource: 'dg_crew_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////////

    $scope.dg_reg_columns = [
        { dataField: 'DateFromTo', caption: 'Date', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 0, width: 200 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 1, width: 200 },
        { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },





        { dataField: 'STD', caption: 'Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 120, alignment: 'center', format: 'HH:mm' },
        { dataField: 'STA', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HH:mm' },





    ];

    $scope.dg_reg_selected = null;
    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = null;
    $scope.dg_reg_height = null;
    $scope.dg_reg = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_reg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reg_instance)
                $scope.dg_reg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_reg_selected = null;



            }
            else {
                $scope.dg_reg_selected = data;


            }


        },
        height: function () {
            return window.innerHeight - 173 - $scope.mih;
        },
        bindingOptions: {
            dataSource: 'dg_reg_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////
    $scope.Day0 = "05/06/2019";
    $scope.Day1 = "05/08/2019";
    $scope.Day2 = "05/08/2019 23:59:00.000";
    $scope.CurrentDate = new Date(2019, 4, 17, 0, 0, 0);

    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.flight = null;
    $scope.getGantt = function () {
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        return ganttObj;
    };
    $scope.ganttData = null;
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.dataSource = [];



    $scope.scrollGantt = function (data) {

        var df = new Date(data.STD);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    $scope.scrollGanttNow = function () {
        var d = new Date(Date.now());
        var df = new Date(d);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.ganttCreated = false;
    $scope.createGantt = function () {
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        var h = 125;
        h = h + 'px';
        $("#resourceGanttba").ejGantt({
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Multiple,
            taskbarClick: function (args) {
                //$scope.addSelectedFlight(args.data.item);
                // $("#resourceGanttba").data("ejGantt").clearSelection();
            },
            dataSource: $scope.dataSource, //self.datasource, //resourceGanttData,
            allowColumnResize: true,
            isResponsive: true,
            taskIdMapping: "taskId",
            taskNameMapping: "taskName",
            fromLocationMapping: "from",
            startDateMapping: "startDate",
            endDateMapping: "endDate",
            progressMapping: "progress",
            durationMapping: "duration",
            groupNameMapping: "Title",
            groupIdMapping: "groupId",
          //  groupCollection: $scope.resourceGroups,
            resources: $scope.resources, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: 55, //window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 40,
            taskbarHeight: 40,
            scheduleStartDate: $scope.dataSource[0].STD,
            scheduleEndDate: $scope.dateto,
            predecessorMapping: "predecessor",
            allowGanttChartEditing: false,
            allowDragAndDrop: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,

                editMode: "normal",
            },
            splitterSettings: {
                position: 180,
            },
            toolbarSettings: {
                showToolbar: false,
                toolbarItems: [ej.Gantt.ToolbarItems.Add,
                ej.Gantt.ToolbarItems.Delete,
                ej.Gantt.ToolbarItems.Update,
                ej.Gantt.ToolbarItems.Cancel,
                ej.Gantt.ToolbarItems.ExpandAll,
                ej.Gantt.ToolbarItems.CollapseAll,
                ej.Gantt.ToolbarItems.NextTimeSpan,
                ej.Gantt.ToolbarItems.PrevTimeSpan
                ]
            },
            enableContextMenu: false,
            load: function () {
                console.log('load');
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 180;
                //  console.log('load1');
                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                //this.getColumns().push(customColumn);

                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };
                //this.getColumns().push(columnFrom);

                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };
                //this.getColumns().push(columnbaseDuration);


            },
            create: function (args) {


                $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX($scope.scroll); //.scrollLeft(1000)  ;

            },

            cellSelecting: function (args) {
                if (!args)
                    return;

                if (args.data.eResourceTaskType != "resourceTask")
                    args.cancel = true;
            },
            cellSelected: function (args) {
                $('.e-gantt-taskbarSelection').removeClass('e-gantt-taskbarSelection');


                $scope.setSelectedResource(args.data);
            },
            //  cellSelected: function (args) { console.log(args); },
            actionBegin: function (args) {

                if (args.requestType && args.requestType == 'beginedit') {

                    args.cancel = true;

                    //  $scope.InitUpdate();
                }


            },
            actionComplete: function (args) {
                console.log(args);

                if (args.requestType == 'save') {
                    if ($scope.doActionCompleteSave)
                        setTimeout(function () {
                            var ganttObj = $("#resourceGanttba").data("ejGantt");
                            ganttObj._$ganttchartHelper.ejGanttChart("selectTaskbar", args.modifiedRecord);
                        }, 100);
                    else {

                        $scope.doActionCompleteSave = true;

                    }


                }

                //console.log(args);
                //renderTasks();
                // renderLables();
                // renderLables();
            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                dayHeaderFormat: "MMM MM ddd dd , yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
                timescaleUnitSize: "500%"
            },

            taskbarTemplate: "#taskbarTemplateBox",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
        });
    };
    $scope.bindGantt = function () {
         
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.plansDto = {
            CustomerId: 1,
            Date: (new Date($scope.dg_selected.Date)).ToUTC(),
            Offset: offset,
            Design: false,
            PlanId: $scope.dg_selected.Id,
        };

        $scope.loadingVisible = true;
        flightService.getPlanItemsGanttCrewTest($scope.plansDto).then(function (response) {
            $scope.loadingVisible = false;
           
            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;
            if (response.flights.length > 0)
                $scope.CalanderId = response.flights[0].CalendarId;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource(response.flights);
            Flight.activeDatasource = $scope.dataSource;
            $scope.createGantt();

            

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        ////////////////////
    };
    ///////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/calendar/' + Config.CustomerId + '/-1'  ;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    //key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                       // e.params.$filter = "(Date ge " + (new Date($scope.dt_from)).ToUTC2(1) + ") and (Date le " + (new Date($scope.dt_to)).ToUTC2() + ")";
                        e.params.$filter = (e.params.$filter ? e.params.$filter+ ' and ' : '') + '(IsLocked eq 1)';
                        console.log(e.params.$filter);
                        
                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['Date', '=', new Date()]],
                sort: [{ getter: "Date", desc: true }],

            };
        }

        if ($scope.doRefresh) {
            //$scope.filters = $scope.getFilters();
            // $scope.dg_ds.filter = [];
            //  $scope.dg_ds.filter = $scope.filters;
            // console.log('Filters');
            // console.log($scope.dg_ds.filter);
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
        $rootScope.page_title = '> Flight Plans';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplanapply2').fadeIn(400, function () {
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
    //$scope.$on('onLibrarySaved', function (event, prms) {

    //    $scope.doRefresh = true;
    //});
    //$scope.$on('onLibraryHide', function (event, prms) {

    //    $scope.bind();

    //});
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