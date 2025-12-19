'use strict';

app.controller('flightPlanPermitController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.typeId = 50;

    // console.log($location.search());
    //////////////////////////////////

    $scope.filterVisible = false;


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
        iDateFrom: new Date(),
        iDateTo: new Date(),
        CustomerId: Config.CustomerId,
        IsActive: false,
        DateActive: null,
        Interval: null,
        Months: [],
        Days: [],

    };
    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.Title = null;
        $scope.entity.DateFrom = null;
        $scope.entity.DateTo = null;
        $scope.entity.iDateFrom = new Date();
        $scope.entity.iDateTo = new Date();
        $scope.entity.CustomerId = Config.CustomerId;
        $scope.entity.IsActive = false;
        $scope.entity.DateActive = null;
        $scope.entity.Interval = null;
        $scope.entity.Months = [];
        $scope.entity.Days = [];
        $scope.data = [];
    };
    $scope.bindEntity = function (data) {
        //$scope.entity.Id = data.Id;
        //$scope.entity.Title = data.Title;
        //$scope.entity.DateFrom = data.DateFrom;
        //$scope.entity.DateTo = data.DateTo;
        //$scope.entity.iDateFrom =new Date( data.DateFrom);
        //$scope.entity.iDateTo =new Date( data.DateTo);

        //$scope.entity.CustomerId = data.CustomerId;
        //$scope.entity.IsActive = data.IsActive;
        //$scope.entity.DateActive = data.DateActive;
        //$scope.entity.Interval = data.Interval;
        //$scope.entity.Months = data.Months;
        //$scope.entity.Days = data.Days;

        var month = data.Month;
        var day = data.Days;
        data = data.plan;
        $scope.entity = data;
        $scope.entity.iDateFrom = new Date(data.DateFrom);
        $scope.entity.iDateTo = new Date(data.DateTo);
        $scope.entity.Months = month;
        $scope.entity.Days = day;


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

            //if ($scope.dg_selected.Gaps > 0 || $scope.dg_selected.Overlaps > 0 || $scope.dg_selected.GapOverlaps > 0) {
            //    General.ShowNotify('The plan has error(s).', 'error');
            //    return;
            //}

            General.Confirm(Config.Text_SimpleConfirm, function (res) {
                if (res) {

                    $scope.loadingVisible = true;
                    flightService.approvePlan60($scope.dg_selected.Id).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
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



    ////////////////////////////////////

    $scope.pop_width_employees = 600;
    $scope.pop_height_employees = 450;
    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {
        width: 1000,
        height: 620,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Flights (Gantt)', icon: 'rowfield', width: 200, onClick: function (e) {
                        //cmnt gantt
                        $rootScope.$broadcast('InitFlightDesignView', $scope.entity);
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Flights (Grid)', icon: 'menu', width: 200, onClick: function (e) {
                        //cmnt grid
                        $rootScope.$broadcast('InitFlightDesignGridView', $scope.entity);
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_add_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            //  var min = new Date("2019/01/01");
            // var max = new Date("2019/12/31");
            //  //1995-12-17T03:24:00
            //  $scope.addCustom(new Date(min),new Date(max),[0,2],[0,2,4]);
            if ($scope.tempData)
                $scope.bindEntity($scope.tempData);
        },
        onHiding: function () {
            $scope.clearEntity();

            $scope.popup_add_visible = false;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_add_title',

        }
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
        //currentDate: new Date("2019/03/03"),
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
            min: "entity.iDateFrom",
            max: "entity.iDateTo",
            //currentDate: "entity.iDateFrom",

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
        readOnly: true,
        onValueChanged: function (arg) {
            $scope.fillSchedule();
        },
        bindingOptions: {
            value: 'entity.iDateFrom',

        }
    };
    $scope.date_to = {
        type: "date",
        width: '100%',
        readOnly: true,
        onValueChanged: function (arg) {
            $scope.fillSchedule();
        },
        bindingOptions: {
            value: 'entity.iDateTo',

        }
    };
    $scope.intervalTypes = [{ Id: 1, Title: 'Daily' }, { Id: 2, Title: 'Weekly' }, { Id: 3, Title: 'Every 10 days' }, { Id: 4, Title: 'Every 14 days' }, { Id: 5, Title: 'Every 15 days' }, { Id: 100, Title: 'Custom' }];
    $scope.sb_interval = {
        readOnly: true,
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
    $scope.customDisabled = true;
    $scope.tag_months_instance = null;
    $scope.tag_months = {
        readOnly: true,
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

            $scope.fillSchedule();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entity.Months"
        },

    };
    $scope.tag_days_instance = null;
    $scope.tag_days = {
        readOnly: true,
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

            $scope.fillSchedule();

        },
        bindingOptions: {
            disabled: 'customDisabled',
            value: "entity.Days"
        },

    };
    $scope.text_title = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.Title',

        }
    };
    $scope.text_types = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.Types',

        }
    };
    $scope.text_no = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.Id',

        }
    };
    $scope.text_flights = {
        readOnly: true,
        bindingOptions: {
            value: 'entity.TotalFlights',

        }
    };
    /////////////////////////////////
    $scope.dg_selected1 = null;
    $scope.dg_columns1 = [
        {
            dataField: "", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                //if (!options.data.IsActive) {
                //    if (options.data.Gaps > 0 || options.data.Overlaps > 0)
                //        $("<div>")
                //            .append("<i style='font-size:22px;color:red' class='icon ion-md-warning'></i>")
                //            .appendTo(container);
                //}
                //else
                //    $("<div>")
                //        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-checkmark-circle'></i>")
                //        .appendTo(container);

                if (!options.data.IsApproved60 || options.data.IsApproved60 == 0) {

                    $("<div>")
                        .append("<i style='font-size:22px;color:#ff5722!important' class='icon ion-md-help-circle '></i>")
                        .appendTo(container);
                }
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:#8bc34a!important' class='icon ion-md-checkmark-circle'></i>")
                        .appendTo(container);

            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'Id', caption: 'No', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', sortIndex: 1, sortOrder: "asc", fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'Types', caption: 'Types', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

        { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', fixed: true, fixedPosition: 'right' },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200, fixed: true, fixedPosition: 'right' },
        // { dataField: 'DateActive', caption: 'Applied Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },




    ];
    $scope.dg_height1 = 100;

    $scope.dg_instance1 = null;
    $scope.dg_ds1 = null;
    $scope.dg1 = {
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
                $scope.IsApproveDisabled = true;


            }
            else {
                $scope.dg_selected = data;
                $scope.IsApproveDisabled = data.IsApproved60 == 1;

            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        //{

        //    dataField: "status", caption: '',
        //    width: 55,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {
        //        if (options.value == 12)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-add-circle'></i>")
        //                .appendTo(container);
        //        if (options.value == 13)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#4CAF50' class='icon ion-md-create'></i>")
        //                .appendTo(container);
        //        if (options.value == 10)
        //            $("<div>")
        //                .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i>")
        //                .appendTo(container);
        //        if (options.value == 11)
        //            $("<div>")
        //                //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
        //                .append("<i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
        //                .appendTo(container);

        //        if (options.value == 16)
        //            $("<div>")
        //                //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
        //                .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i><i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
        //                .appendTo(container);


        //    },
        //    fixed: true, fixedPosition: 'left',
        //},
        { dataField: 'Date', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', groupIndex: 0 },
        { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130,  },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
      
        //{ dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

     
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm',

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
        { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },




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
                $scope.IsPermitDisabled = true;


            }
            else {
                $scope.dg_selected = data;
                $scope.IsPermitDisabled = data.IsApproved60 == 1;
                if (!data.permits) {
                    $scope.loadingVisible = true;
                    flightService.getFlightPlanItemPermits(data.Id, data.CalendarId).then(function (response) {
                        $scope.loadingVisible = false;
                        if (response)
                            data.permits = response;
                        else
                            data.permits = [];
                        $scope.dg_permits_ds = data.permits;

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }
                else
                    $scope.dg_permits_ds = data.permits;


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
    $scope.IsPermitDisabled = true;
    $scope.btn_permit_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 40,
        onClick: function (e) {

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.popup_permit_add_visible = true;
            //var data = { parent: $scope.dg_selected, Id: null };

            //$rootScope.$broadcast('InitAddLocation', data);
        },
        bindingOptions: {
            disabled: 'IsPermitDisabled',
        }

    };
    $scope.btn_permit_delete = {
        text: '',
        type: 'danger',
        icon: 'remove',
        width: 40,
        onClick: function (e) {


        },
        bindingOptions: {
            disabled: 'IsPermitDisabled',
        }

    };
    $scope.sb_permit = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceFlightPermits(),

        onSelectionChanged: function (arg) {

            if (arg.selectedItem)
                $scope.permitEntity.Title = arg.selectedItem.Title;
            else
                $scope.permitEntity.Title = null;
        },
        searchExpr: ["Title",],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'permitEntity.PermitId',


        }
    };
    $scope.date_permit = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {
            // $scope.fillSchedule();

        },
        bindingOptions: {
            value: 'permitEntity.Date',

        }
    };
    //////////////////////////
    $scope.dg_permits_selected = null;
    $scope.dg_permits_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 150, alignment: 'center' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },





    ];
    $scope.dg_permits_height = $(window).height() - 220;

    $scope.dg_permits_instance = null;
    $scope.dg_permits_ds = null;
    $scope.dg_permits = {
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
        onCellPrepared: function (cellInfo) {

        },
        //height: '500',
        bindingOptions: {
            dataSource: 'dg_permits_ds', //'dg_employees_ds',
            height: 'dg_permits_height'
        }
    };
    /////////////////////////
    $scope.permitEntity = {

    };
    $scope.clearPermitEntity = function () {
        $scope.permitEntity.Title = null;
        $scope.permitEntity.Date = null;
        $scope.permitEntity.Remark = '';
        $scope.permitEntity.PermitId = null;
        $scope.permitEntity.DateFlight =null;
        $scope.permitEntity.CalanderId = null;
    };
    $scope.popup_permit_add_visible = false;
    $scope.popup_permit_add_title = 'New';
    $scope.popup_permit_add = {
        width: 600,
        height: 270,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'permitadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.permitEntity.Id = -1;
                        $scope.permitEntity.Remark = '';
                        $scope.permitEntity.FlightPlanId = $scope.dg_selected.Id;
                        $scope.permitEntity.DateFlight = $scope.dg_selected.Date;
                        $scope.permitEntity.CalanderId = $scope.dg_selected.CalendarId;
                        $scope.loadingVisible = true;
                        flightService.saveFlightPlanItemPermit($scope.permitEntity).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            var item = JSON.parse(JSON.stringify($scope.permitEntity));

                            $scope.dg_permits_ds.push(item);
                            $scope.clearPermitEntity();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_permit_add_visible = false;
                    }
                }, toolbar: 'bottom'
            }


        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.clearPermitEntity();

            $scope.popup_permit_add_visible = false;

        },
        bindingOptions: {
            visible: 'popup_permit_add_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_permit_add_title',

        }
    };

    ////////////////////////
    var offset = -1 * (new Date()).getTimezoneOffset();
    $scope.bind = function () {
        //  var url = 'odata/flightplans/approved/customer/' + Config.CustomerId + '/' + $scope.typeId;
        //odata/plan/items/approved/
        var url = 'odata/flight/plans/items/calendar/' + Config.CustomerId + '/' + $scope.typeId;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                 //   key: "Id",
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
        $rootScope.page_title = '> Flight Plans Permits';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplanpermit').fadeIn(400, function () {
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