'use strict';

app.controller('flightPlanListController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////

    $scope.filterVisible = false;
    $scope.plan = { /*DateFrom: new Date(), DateTo: new Date()*/};
    $scope.IsDetailsVisible = false;
    $scope.IsTabDisabled = false;
    /////////////////////////////////
    $scope.tabs = [
    
        { text: "Calendar", id: 'calendar', },
           { text: "Legs", id: 'legs', },
        { text: "Information", id: 'information', },
        //  { text: "حساب بانکی", id: 'account', visible_btn: false },
        //{ text: "Certificate", id: 'certificate', visible_btn: true },
        { text: "Registers", id: 'registers', },
       // { text: "Permits", id: 'permits',   },
       
        

    ];
  
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
           
            $scope.selectedTab = $scope.tabs[newValue];
            $('.tab').hide();
           
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            $scope.dg_reg_instance.repaint();
           
            
 

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
            disabled:'IsTabDisabled'
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
        height:function() {
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



    $scope.btn_edit = {
        text: 'Make Editable',
        type: 'default',
        icon: 'info',
        width: 200,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if (!$scope.dg_selected.IsApproved50) {
                General.ShowNotify("The selected plan is not approved", 'error');
                return;
            }
            
            //kook
            $scope.loadingVisible = true;
            flightService.makePlanEditable($scope.dg_selected.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.$broadcast('getFilterQuery', null);
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
        bindingOptions: {value: 'plan.DateFrom',}
    };
    $scope.date_to = {
        type: "date",
        readOnly: true,
        width: '100%',
        bindingOptions: {value: 'plan.DateTo',}
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
            dataField: "", caption: 'Applied',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                

                if ( options.data.IsApproved50 || options.data.IsApproved50 == 1) 
                    $("<div>")
                        .append("<i style='font-size:22px;color:#4CAF50!important' class='icon ion-md-checkmark-circle'></i>")
                        .appendTo(container);

            },
            fixed: true, fixedPosition: 'left', alignment: 'center'
        },
        //{
        //    dataField: "", caption: 'Permits',
        //    width: 85,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {


        //        if ( options.data.IsApproved60 || options.data.IsApproved60 == 1)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#4CAF50!important' class='icon ion-md-checkmark-circle'></i>")
        //                .appendTo(container);

        //    },
        //    fixed: true, fixedPosition: 'left', alignment: 'center'
        //},
        //{
        //    dataField: "", caption: 'Registers',
        //    width: 85,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {


        //        if ( options.data.IsApproved70 || options.data.IsApproved70 == 1)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#4CAF50!important' class='icon ion-md-checkmark-circle'></i>")
        //                .appendTo(container);

        //    },
        //    fixed: true, fixedPosition: 'left', alignment: 'center'
        //},
        //{
        //    dataField: "", caption: 'Applied',
        //    width: 85,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {


        //        if ( options.data.IsApproved100 || options.data.IsApproved100 == 1)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#2196F3!important' class='icon ion-md-checkmark-circle'></i>")
        //                .appendTo(container);

        //    },
        //    fixed: true, fixedPosition: 'left', alignment: 'center'
        //},
        { dataField: 'Id', caption: 'No', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', fixed: true, fixedPosition: 'left' },
        { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',   },
         { dataField: 'Types', caption: 'Types', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 120 },
        //{ dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        //{ dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

        { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 130, alignment: 'center', sortIndex: 1, sortOrder: "asc", fixed: false, fixedPosition: 'right' },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: false, fixedPosition: 'right' },
         
          { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 120 },


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
                $scope.IsDetailsVisible = false;
                $scope.dg_reg_ds = null;
                $scope.dg_leg_ds = null;

            }
            else {
                $scope.dg_selected = data;
               
               
                
                if ($scope.dg_selected.summary) {
                   
                    $scope.dg_reg_ds = $scope.dg_selected.summary.AssignedRegisters;
                    $scope.fillPlan( $scope.dg_selected.summary);
                } else {
                    $scope.selectedTabIndex = 0;
                    $scope.IsTabDisabled = true;
                    $scope.loadingVisible = true;
                    var offset = -1 * (new Date()).getTimezoneOffset();
                    var dto1 = {
                        Id:$scope.dg_selected.Id,
                        Offset: offset
                    };
                    flightService.getPlanItemsById(dto1).then(function (response2) {
                        $scope.dg_leg_ds = response2;
                        flightService.getFlightPlanSummary($scope.dg_selected.Id, offset).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.IsDetailsVisible = true;
                            $scope.dg_selected.summary = response;
                            var myVar = setInterval(function () {
                                $scope.fillPlan($scope.dg_selected.summary);
                                $scope.IsTabDisabled = false;
                                clearInterval(myVar);
                            }, 200);

                            $scope.dg_reg_ds = $scope.dg_selected.summary.AssignedRegisters;
                            console.log($scope.dg_reg_ds);
                            //  $scope.fillPlan($scope.dg_selected.summary);


                            //$scope.dg_reg_ds = $scope.dg_selected.assignedRegisters;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                   
                }

            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };


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
            return window.innerHeight - 175;
        },
        bindingOptions: {
            dataSource: 'dg_reg_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////////
    $scope.dg_leg_columns = [
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

    $scope.dg_leg_selected = null;
    $scope.dg_leg_instance = null;
    $scope.dg_leg_ds = null;
    $scope.dg_leg_height = null;
    $scope.dg_leg = {
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


        columns: $scope.dg_leg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_leg_instance)
                $scope.dg_leg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_leg_selected = null;



            }
            else {
                $scope.dg_leg_selected = data;


            }


        },
        height: function () {
            return window.innerHeight - 175;
        },
        bindingOptions: {
            dataSource: 'dg_leg_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/approved/customer/' + Config.CustomerId + '/' + -1;
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
                sort: [{ getter: "Id", desc: false }],

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
        $rootScope.page_title = '> Flight Plans';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplanlist').fadeIn(400, function () {
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