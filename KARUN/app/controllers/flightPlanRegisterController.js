'use strict';
app.controller('flightPlanRegsiterController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.filterVisible = false;
   
    $scope.minDate = new Date();
    $scope.maxDate = new Date();
    $scope.itemCaption = 'Plan Name';
    $scope.IsDetailsVisible = true;
    $scope.IsRegistersVisible = false;
    $scope.doSetRegisters = false;
    $scope.EditVisible = false;
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');

                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');

                $('.filter').show();
            }
        }

    };
    $scope.getOverlap = function (regid, dfrom, dto) {
        var q = Enumerable.From($scope.registers).Where(function (x) {
            return x.RegisterId == regid && ((new Date(dfrom) >= new Date(x.DateFrom) && new Date(dfrom) <= new Date(x.DateTo)) || (new Date(dto) >= new Date(x.DateFrom) && new Date(dto) <= new Date(x.DateTo)));
        }).ToArray();
        return q.length > 0;
    };
    $scope.createRanges = function (regid) {
        
        // alert(datediff( obj.DateFrom ,  obj.DateTo ));
        var totaldays = datediff(new Date($scope.plan.DateFrom), new Date($scope.plan.DateTo));
        
        var rows = Enumerable.From($scope.registers).Where("$.PlannedRegisterId==" + regid).OrderBy(function (x) { return new Date(x.DateFrom) }).ToArray();
        var last = Enumerable.From($scope.registers).Where("$.PlannedRegisterId==" + regid).OrderByDescending(function (x) { return new Date(x.DateFrom) }).FirstOrDefault();
        var emptydays = last ? datediff(new Date(last.DateTo), new Date($scope.plan.DateTo)) : totaldays;
        var rangeDs = [];// [{ ratio: 1, bgColor: 'red', text: 'atrina' }, { ratio: 2, bgColor: 'yellow', text: 'vahid' }];
        var groupedRecordsCollection = [];
        var grps = Enumerable.From(rows)
            .GroupBy(
                "{ Register: $.Register }",
                null,
                function (key, g) {
                    var result = {
                        Register: key.Register
                    };
                    var groupResults = [];
                    g.ForEach(function (item) {
                        groupResults.push(item);
                    });

                    //push into array
                    groupedRecordsCollection.push(groupResults);
                },
                "$.Register" // compare selector needed
            )
            .ToArray();

      //  console.log(grps);
     //   console.log(groupedRecordsCollection);
        var _rows = [];
        $.each(groupedRecordsCollection, function (_i, _d) {
            var item = { DateFrom: _d[0].DateFrom, DateTo: _d[_d.length - 1].DateTo, Register: _d[0].Register };
            _rows.push(item);
        });

        $.each(_rows, function (_i, _d) {
            var days = datediff(new Date(_d.DateFrom), new Date(_d.DateTo));
             
            var r = days; //* 1.0 / totaldays;
            if (r == 0)
                r = 1;
            rangeDs.push({
                ratio: r,
                text: _d.Register,
                bgColor: Colors.getColor(_i % Colors.Palette.length),
            });
        });
        if (emptydays > 0) {
            rangeDs.push({
                ratio: emptydays, //* 1.0 / totaldays,
                text: '',
                bgColor: 'white',
            });
        }
        console.log(rangeDs);
        if ($('#date_range').length > 0) {
            $("#date_range").dxBox("dispose");
            $("#date_range").remove();
        }
        if (rangeDs.length > 0) {
            var range = '<div   id="date_range" >';
            $.each(rangeDs, function (_id, _d) {
                range += '<div class="rect" style="background:' + _d.bgColor + '" data-options="dxItem: {ratio: ' + _d.ratio + '}">' + _d.text + '</div>';
            });
            range += '</div>';
            $('#range_container').html(range);

            $("#date_range").dxBox({
                direction: "row",
                width: "100%",
                height: 30
            });
        }
        
    };

    $scope.btn_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 40,
        validationGroup: 'fpregisteradd',
        onClick: function (e) {
            //bati
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            var day0 = General.getDayFirstHour($scope.entity.DateFrom);
            var day1 = General.getDayLastHour($scope.entity.DateTo);
            if (day1 < day0) {
                General.ShowNotify(Config.Text_InvalidDates, 'error');
                return;
            }
            
            $scope.entity.PlannedRegisterId = $scope.plan.VirtualRegisterId;// $scope.dg_res_selected.resourceId;
            var obj = $scope.duplicateEntity($scope.entity);
            obj.DateFrom = new Date($scope.entity.DateFrom).ToUTC();
            obj.DateTo = new Date($scope.entity.DateTo).ToUTC();
            obj.Register = $scope.selectedMsn.Register;
            obj.PlannedREgister = '-';
            obj.Id = -1 * ($scope.registers.length + 1);

            var overlaps = $scope.getOverlap(obj.RegisterId, obj.DateFrom, obj.DateTo);
            if (overlaps) {
                General.ShowNotify('Overlap', 'error');
                return;
            }
            $scope.loadingVisible = true;
            //(pid,vid,rid,from,to)
            //(new Date($scope.datefrom)).toUTCDateTimeDigits()
            flightService.checkOverlap($scope.plan.Id
                //, $scope.dg_res_selected.resourceId
              ,  $scope.plan.VirtualRegisterId
                , obj.RegisterId, (new Date(obj.DateFrom)).toUTCDateTimeDigits(), (new Date(obj.DateTo)).toUTCDateTimeDigits()).then(function (response) {
                $scope.loadingVisible = false;

                if (!response) {
                    General.ShowNotify('Overlap', 'error');
                    return;
                }
                $scope.registers.push(obj);
                //$scope.setRegisterDs($scope.dg_res_selected.resourceId, $scope.dg_res_selected.groupId);
                    $scope.setRegisterDs($scope.plan.VirtualRegisterId, $scope.plan.VirtualTypeId);
                    $scope.createRanges($scope.plan.VirtualRegisterId);
              //  $scope.createRanges($scope.dg_res_selected.resourceId);
                $scope.fillSchedule();
                $scope.clearEntity();
                var newFromDate = (new Date(obj.DateTo)).addDays(1);
                if (newFromDate > $scope.maxDate)
                    return;
                $scope.entity.DateFrom = newFromDate;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }

    };

    $scope.btn_approve = {
        text: 'Approve',
        type: 'default',
        icon: 'ion ion-md-lock',
        width: 150,
        bindingOptions: {
            disabled: 'IsApproved'
        },
        onClick: function (e) {

            General.Confirm(Config.Text_SimpleConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.plan.Id };
                    $scope.loadingVisible = true;
                    flightService.approvePlanRegisters(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.IsApproved = true;




                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }

    };
    $scope.IsDeleteDisabled = true;
    $scope.deleted = [];
    $scope.btn_delete = {
        text: '',
        type: 'danger',
        icon: 'clear',
        width: 40,
        bindingOptions: {
            disabled: 'IsDeleteDisabled',

        },

        onClick: function (e) {
            var _id = $scope.dg_reg_selected.Id;
            if ($scope.dg_reg_selected.Id > 0)
                $scope.deleted.push($scope.dg_reg_selected.Id);
            $scope.entity.DateFrom = new Date($scope.dg_reg_selected.DateFrom);
            var index = $scope.dg_reg_instance.getRowIndexByKey($scope.dg_reg_selected);
            $scope.dg_reg_instance.deleteRow(index);
            //$scope.registers = Enumerable.From($scope.registers).Where('$.Id!=' + _id).ToArray();
            //$scope.fillSchedule();
            //$scope.IsDeleteDisabled = true;


        }

    };
    $scope.boxOptions1 = {
        direction: "row",
        width: "100%",
        height: 50
    };
    $scope.getGantt = function () {
        var ganttObj = $("#resourceGanttpr").data("ejGantt");
        return ganttObj;
    };
    $scope.registers = null;
    $scope.ganttData = null;
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.dataSource = [];
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: '100%',

        bindingOptions: {},
        onClick: function (e) {

            $scope.loadingVisible = true;
            //flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), (new Date($scope.dateto)).toUTCDateTimeDigits())
            flightService.getFlightPlanGantt($scope.planId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ganttData = response;

                $scope.resourceGroups = response.resourceGroups;
                $scope.resources = response.resources;
                $scope.dataSource = Flight.proccessDataSource(response.flights);
                Flight.activeDatasource = $scope.dataSource;
                console.log($scope.ganttData);
                console.log($scope.resourceGroups);
                console.log($scope.dataSource);
                //if (!$scope.ganttCreated)
                $scope.createGantt();
                //else {
                //    $scope.getGantt().updateScheduleDates($scope.datefrom, $scope.dateto);
                //}

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }

    };
    $scope.btn_register = {
        text: 'Set/View Registers',
        type: 'default',
        icon: 'ion ion-md-airplane',
        width: 220,
        onClick: function (e) {

            $scope.popup_registers_visible = true;
        }

    };
    /////////////////////////////////////
    $scope.entity = {
        DateFrom: null,
        DateTo: null,
        RegisterId: null,
        PlannedRegisterId: null,
        FlightPlanId: $scope.planId,
    };
    $scope.clearEntity = function () {
        $scope.entity.DateFrom = null;
        $scope.entity.DateTo = null;
        $scope.entity.RegisterId = null;
        $scope.entity.PlannedRegisterId = null;
        $scope.entity.FlightPlanId = $scope.planId;

    };
    $scope.duplicateEntity = function () {
        var obj = {};
        obj.DateFrom = $scope.entity.DateFrom;
        obj.DateTo = $scope.entity.DateTo;
        obj.RegisterId = $scope.entity.RegisterId;
        obj.PlannedRegisterId = $scope.entity.PlannedRegisterId;
        obj.FlightPlanId = $scope.entity.FlightPlanId;
        return obj;
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
    $scope.date_from = {
        type: "date",
        width: '100%',
        readOnly: true,
        onValueChanged: function (arg) {
            $scope.fillSchedule();
        },
        bindingOptions: {
            value: 'plan.DateFrom',

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
            value: 'plan.DateTo',

        }
    };
    $scope.date_from_entity = {
        type: "date",
        width: '100%',
        readOnly: true,

        bindingOptions: {
            value: 'entity.DateFrom',
            max: 'maxDate',
            min: 'minDate'

        }
    };
    $scope.date_to_entity = {
        type: "date",
        width: '100%',


        bindingOptions: {
            value: 'entity.DateTo',
            max: 'maxDate',
            min: 'minDate'

        }
    };
    $scope.isCustomVisible = false;
    $scope.intervalTypes = [{ Id: 1, Title: 'Daily' }, { Id: 2, Title: 'Weekly' }, { Id: 3, Title: 'Every 10 days' }, { Id: 4, Title: 'Every 14 days' }, { Id: 5, Title: 'Every 15 days' }, { Id: 100, Title: 'Custom' }, { Id: 101, Title: 'Once' }];
    $scope.sb_interval = {
        readOnly: true,
        showClearButton: true,
        width: '100%',
        searchEnabled: false,
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {


        },
        bindingOptions: {
            value: 'plan.Interval',

            dataSource: 'intervalTypes',


        }
    };
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

        bindingOptions: {

            value: "plan.Months"
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

        bindingOptions: {

            value: "plan.Days"
        },

    };
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
        height: 430,
        // width:500,
        // dataCellTemplate: 'dataCellTemplate',
        appointmentTemplate: function (data) {
            var start = new Date(data.startDate).ToUTC();
           //  start.setHours(11, 59, 59, 0);
           // var reg = start >= new Date(_d.DateFrom) && start <= new Date(_d.DateTo);
            var reg = false;
            $.each($scope.registers, function (_i, _d) {
                //var df = new Date(_d.DateFrom);
                //df.setHours(0, 0, 0, 0);
                console.log('dates');
                console.log(start);
                console.log(new Date(_d.DateFrom).ToUTC());
                console.log(new Date(_d.DateTo).ToUTC());
                if (start >= new Date(_d.DateFrom).ToUTC() && start <= new Date(_d.DateTo).ToUTC())
                    reg = true;
                
                //optimize
            });
            if (!reg)
                return $("<div style='text-align:center; height:30px;color:red;background:white;margin-top:-5px'><i style='font-size:24px' class='icon ion-md-help-circle'></i></div>");
            else
                return $("<div style='text-align:center; height:30px;color:green;background:white;margin-top:-5px'><i style='font-size:24px' class='icon ion-md-airplane'></i></div>");


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
                case 101:
                    $scope.addDaily(min, max, 1);
                    break;
                default:
                    break;
            }
        }


    };


    ////////////////////////////////////////////////
    $scope.IsApproved = false;
    $scope.popup_registers_visible = false;
    $scope.popup_registers_title = 'Set Registers';
    $scope.popup_registers = {
        width: 1000,
        height: 620,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //var result = arg.validationGroup.validate();

                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}
                        //$scope.registers
                        var items = Enumerable.From($scope.registers).Where('$.Id<0').ToArray();
                        var dto = {};
                        dto.PlanId = $scope.plan.Id;
                        dto.Items = items;
                        dto.Deleted = $scope.deleted;

                        console.log(dto);
                        $scope.loadingVisible = true;
                        flightService.savePlanRegisters(dto).then(function (response) {


                            $.each(response, function (_i, _d) {
                                var row = Enumerable.From($scope.registers).Where('$.Id==' + _d.OldId).FirstOrDefault();
                                row.Id = _d.NewId;
                            });

                            General.ShowNotify(Config.Text_SavedOk, 'success');




                            $scope.loadingVisible = false;
                            $scope.popup_registers_visible = false;
                            $scope.bindGantt();

                            $rootScope.$broadcast('onRegisterAssigned', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            //if ($scope.plan.IsApproved70==1)
            //    $scope.dg_reg_height = 380;
            //else
            //    $scope.dg_reg_height = 330;

        },
        onShown: function (e) {
            
            $scope.dg_res_instance.deselectAll();
            $scope.IsRegistersVisible = false;
            $scope.dg_res_ds = $scope.resources;
            // if ($scope.tempData)
            //    $scope.bindEntity($scope.tempData);
        },
        onHiding: function () {
            $scope.deleted = [];

            $scope.popup_registers_visible = false;

        },
        bindingOptions: {
            visible: 'popup_registers_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_registers_title',

        }
    };

    //close button
    $scope.popup_registers.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_registers_visible = false;

    };
    ////////////////////////////////////////////
    $scope.dg_res_selected = null;
    $scope.dg_res_columns = [

        { dataField: 'group', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 0 },
        { dataField: 'resourceName', caption: 'Virtual Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },



    ];
    $scope.dg_res_height = 500;

    $scope.dg_res_instance = null;
    $scope.dg_res_ds = null;
    $scope.dg_res = {
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

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_res_columns,
        onContentReady: function (e) {
            if (!$scope.dg_res_instance)
                $scope.dg_res_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_res_selected = null;
                //$scope.doSetRegisters = !$scope.dg_reg_instance;
                // if (!$scope.doSetRegisters)
                $scope.setRegisterDs(null, null);
                $scope.IsRegistersVisible = false;

            }
            else {
                $scope.dg_res_selected = data;
                $scope.IsRegistersVisible = true;
                // $scope.doSetRegisters = !$scope.dg_reg_instance;
                // if (!$scope.doSetRegisters)
                $scope.setRegisterDs(data.resourceId, data.groupId);

            }


        },

        bindingOptions: {
            dataSource: 'dg_res_ds', //'dg_employees_ds',
            height: 'dg_res_height'
        }
    };

    $scope.dg_reg_selected = null;
    $scope.dg_reg_columns = [
        {
            caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var color = Colors.getColor(options.rowIndex % Colors.Palette.length);
                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "' class='icon ion-ios-airplane'></i>")
                    .appendTo(container);
            },

        },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false },
        { dataField: 'DateFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },



    ];
    $scope.dg_reg_height =$(window).height() -387;

    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = [];
    $scope.dg_reg = {

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

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_reg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reg_instance) {
                $scope.dg_reg_instance = e.component;
               
 
            }
            
            //if ($scope.dg_reg_filter && $scope.dg_reg_instance) {

               
                 
                
            //    $scope.dg_reg_instance.filter("PlannedRegisterId", "=", $scope.dg_reg_filter);
            //}

        },
        onRowRemoved: function (e) {
            
            if (e.data) {
                
                var pid = e.data.PlannedRegisterId;
                $scope.createRanges(pid);
                //dati
                var _id = e.data.Id;
                $scope.registers = Enumerable.From($scope.registers).Where('$.Id!=' + _id).ToArray();
                $scope.fillSchedule();
                $scope.IsDeleteDisabled = true;
            }
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            //alert(JSON.stringify( e.selectedRowKeys));
            if (!data) {

                $scope.dg_reg_selected = null;



            }
            else {
                $scope.dg_reg_selected = data;

                $scope.IsDeleteDisabled = $scope.dg_reg_instance.getRowIndexByKey(data) != $scope.dg_reg_instance.totalCount() - 1;
            }


        },

        bindingOptions: {
            dataSource: 'dg_reg_ds', //'dg_employees_ds',
            height: 'dg_reg_height'
        }
    };
    $scope.ds_msn = [];
    //////////////////////////////////////////
    $scope.ds_msn = [];
    $scope.msn_readOnly = true;
    $scope.unknown_readOnly = false;
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Register', 'MSN'],

        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            if (arg.selectedItem) {



            }

        },
        bindingOptions: {
            value: 'entity.RegisterId',

            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    $scope.dg_reg_filter = null;
    $scope.setRegisterDs = function (id, tid) {
       //xati
      //  $scope.dg_reg_instance.filter("PlannedRegisterId", "=", $scope.dg_reg_filter);
        if (!id) {
            $scope.dg_reg_filter = null;
            $scope.dg_reg_ds = null;
           
        }
        else {   
            //   $scope.dg_reg_instance.filter("PlannedRegisterId", "=", id);
           
            $scope.dg_reg_ds = Enumerable.From($scope.registers).Where('$.PlannedRegisterId==' + id).ToArray(); //$scope.registers;
          
            $scope.dg_reg_filter = id;
            $scope.dg_reg_instance.repaint();

            var last = Enumerable.From($scope.registers).Where("$.PlannedRegisterId==" + id).OrderByDescending(function (x) { return new Date(x.DateFrom) }).FirstOrDefault();
            if (!last)
                var df = $scope.plan.DateFrom;
            else
                var df = (new Date(last.DateTo)).addDays(1);
            $scope.clearEntity();
            $scope.entity.DateFrom = new Date(df);
            $scope.createRanges(id);
            $scope.loadingVisible = true;
            aircraftService.getAvailableMSNsByType(Config.CustomerId, tid).then(function (response) {

                $scope.loadingVisible = false;
                $scope.ds_msn = response;



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    /////////gantt//////////////////////////////
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.scroll = 0;


    ///////////////////////////


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
        $rootScope.page_title = '> Flights';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplanregister').fadeIn(400, function () {
            //vmins = new viewModel();
            //ko.applyBindings(vmins);
            //var h = $(window).height() - 130;
            //vmins.height(h + 'px');

            //var ds = proccessDataSource(resourceGanttData);
            //activeDatasource = ds;

            //vmins.gantt_datasource(ds);
        });
    }
    /////////////////////////////
    $scope.selectedFlights = [];
    $scope.addSelectedFlight = function (item) {
        var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        if (exist)
            $scope.selectedFlights = Enumerable.From($scope.selectedFlights).Where("$.taskId!=" + item.taskId).ToArray();
        else
            $scope.selectedFlights.push(item);


    };
    $scope.selectedResource = null;
    $scope.setSelectedResource = function (data) {
        var index = data.index;
        if ($scope.selectedResource && $scope.setSelectedResource.index == index) {
            $scope.selectedResource = null;
            $("#resourceGanttpr").data("ejGantt").clearSelection(index);
            alert('x');
        }
        else

            $scope.selectedResource = { index: data.index, item: data.item };
    };
    $scope.ganttCreated = false;
    $scope.Day0 = "01/31/2019";
    $scope.Day1 = new Date("02/01/2019");
    $scope.Day2 = new Date("02/02/2019 23:59:00.000");
    $scope.Day0 = "05/06/2019";
    $scope.Day1 = "05/07/2019";
    $scope.Day2 = "05/07/2019 23:59:00.000";
    var registerTemplateFunction = function (val, data) {
        //  alert(val+'  '+index);
        if (data.eResourceTaskType == "groupTask")
            return "<div style='padding-left:5px;font-weight:bold'>" + data.eResourceName + "</div>";
        var item = Enumerable.From($scope.resources).Where("$.resourceId==" + val).FirstOrDefault();
        if (!item) {
            return val;
        }
        //console.log('taskid: ' + val + '    ' + index);
        return "<div style='padding-left:10px'>" + item.resourceName + "</div>"
            + "<div style='padding-left:15px;font-size:12px'>" + item.registers + "</div>";

    };
    var myHelpers = { registerTemplate: registerTemplateFunction };

    $.views.helpers(myHelpers);
    $scope.createGantt = function () {
        var ganttObj = $("#resourceGanttpr").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        var h = $(window).height() - 110;
        h = h + 'px';
        h = '170px';
        $("#resourceGanttpr").ejGantt({
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.MultipleTask,
            taskbarClick: function (args) { $scope.addSelectedFlight(args.data.item); $("#resourceGanttpr").data("ejGantt").clearSelection(); },
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
            groupCollection: $scope.resourceGroups,
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
            rowHeight: 50,
            taskbarHeight: 35,
            scheduleStartDate: $scope.Day1, //$scope.datefrom,
            scheduleEndDate: $scope.Day2,// $scope.dateto,
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
                position: 240,
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

                $scope.ganttCreated = true;
                this.getColumns()[0].width = 180;
                // this.getColumns()[0].isTemplateColumn = true;
                // this.getColumns()[0].templateID = "columnTemplateRegister";
                this.getColumns()[0].visible = false;

                var customColumn = {
                    field: "resourceId",
                    mappingName: "resourceId",
                    allowEditing: false,
                    headerText: "Registers",
                    isTemplateColumn: true,
                    width: 180,
                    templateID: "columnTemplateRegister"
                    //  template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                this.getColumns().unshift(customColumn);
                //var customColumn = {
                //    field: "registers",
                //    mappingName: "registers",
                //    allowEditing: false,
                //    headerText: "Registers",
                //    isTemplateColumn: true,
                //    width:300,
                //  //  template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                //};
                //this.getColumns().push(customColumn);
                this.getColumns().unshift({
                    field: "assigned",
                    mappingName: "assigned",
                    allowEditing: false,
                    headerText: "",
                    isTemplateColumn: true,
                    width: 60,
                    templateID: "columnTemplate"
                });

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

                console.log(args.data);
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
                //console.log(args);
                //renderTasks();
                // renderLables();
                // renderLables();
            },

            //workingTimeScale: "TimeScale24Hours",
            //durationUnit: ej.Gantt.DurationUnit.Hour,
            //scheduleHeaderSettings: {
            //    scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
            //    dayHeaderFormat: "MMM MM ddd dd , yyyy",
            //    //dayHeaderFormat: "DAY dd",
            //    minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
            //    timescaleUnitSize: "450%"
            //},
            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Hour,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
                timescaleUnitSize: "200%"
            },

            taskbarTemplate: "#taskbarTemplate",
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


    //////////////////////////////////////////
    //$scope.$on('getFilterResponse', function (event, prms) {

    //    $scope.filters = prms;

    //    $scope.doRefresh = true;
    //    $scope.bind();
    //});
    //$scope.$on('onTemplateSearch', function (event, prms) {

    //    $scope.$broadcast('getFilterQuery', null);
    //});
    $scope.setResourceGroup = function () {
        $.each($scope.resources, function (_i, _d) {
            var g = Enumerable.From($scope.resourceGroups).Where("$.groupId==" + _d.groupId).FirstOrDefault();
            _d.group = g.Title;
        });
    };
    $scope.bindGantt = function () {
        
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getFlightPlanGantt($scope.planId, offset).then(function (response) {
            
            $scope.loadingVisible = false;
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.setResourceGroup();
            $scope.registers = response.registers;
            console.log($scope.registers);
            $scope.dataSource = Flight.proccessDataSource(response.flights);
            Flight.activeDatasource = $scope.dataSource;
           // console.log($scope.ganttData);
           // console.log($scope.resourceGroups);
            // console.log($scope.dataSource);
            var timer;

            function settimer() {
                timer = setTimeout(function () { clearTimeout(timer); $scope.createGantt(); }, 500);
            }
            settimer();
            $scope.setRegisterDs($scope.plan.VirtualRegisterId, $scope.plan.VirtualTypeId);
            $scope.fillSchedule();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bind = function () {
        //$('#gantt_container_ba').append('<div id="resourceGanttba" style="height:450px;width:100%;" data-bind="ejGantt: gantt_option" />');
        //vmins = new viewModel();
        //ko.applyBindings(vmins, document.getElementById("resourceGantt"));
        //var h = $(window).height() - 200;
        //vmins.height(h + 'px');
        $scope.loadingVisible = true;
        flightService.getFlightPlan($scope.planId).then(function (response) {
            
            $scope.loadingVisible = false;

            $scope.plan = response;
            $scope.plan.Title2 = $scope.plan.BaseIATA + ' (' + $scope.plan.BaseName+')';
            $scope.EditVisible = $scope.plan.IsApproved70 != 1;
            $scope.IsApproved = $scope.plan.IsApproved100 == 1;
            $scope.minDate = General.getDayFirstHour(new Date($scope.plan.DateFrom));
            $scope.maxDate = General.getDayLastHour(new Date($scope.plan.DateTo));
            $scope.plan.Interval = Number($scope.plan.Interval);
            $scope.isCustomVisible = $scope.plan.Interval == 100;
            $scope.scheduleCurrentDate = new Date($scope.plan.DateFrom);
         //   $scope.fillSchedule();
            $scope.bindGantt();

            //yati
           

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    /////////////////////////////////////////
    $scope.scroll_1_height = 300;
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions:{
            height:'scroll_1_height',
        }
        //height: 531,
    };
    $scope.IsEditView = true;
    $scope.pop_width = 900;
    $scope.pop_height = 600;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [
            //{
            //    widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
            //        type: 'default', text: 'Set/View Registers', width: 220, icon: 'ion ion-md-airplane', onClick: function (e) {
                        
                         
            //            $scope.popup_registers_visible = true;

            //        }
            //    }
            //},
            //pati
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //var result = arg.validationGroup.validate();

                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}
                        //$scope.registers
                        var items = Enumerable.From($scope.registers).Where('$.Id<0').ToArray();
                        var dto = {};
                        dto.PlanId = $scope.plan.Id;
                        dto.Items = items;
                        dto.Deleted = $scope.deleted;

                        console.log(dto);
                        $scope.loadingVisible = true;
                        flightService.savePlanRegisters(dto).then(function (response) {


                            $.each(response, function (_i, _d) {
                                var row = Enumerable.From($scope.registers).Where('$.Id==' + _d.OldId).FirstOrDefault();
                                row.Id = _d.NewId;
                            });

                            General.ShowNotify(Config.Text_SavedOk, 'success');




                            $scope.loadingVisible = false;
                            $scope.popup_registers_visible = false;
                            $scope.bindGantt();

                            $rootScope.$broadcast('onRegisterAssigned', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


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
             //bindingOptions: { height: 'scroll_height', }
            //height: function () { return $(window).height() * 0.95-120 },
            $scope.scroll_1_height = $(window).height() - 145;
            $scope.bind($scope.planId);
            $scope.dg_reg_instance.repaint();


        },
        onHiding: function () {

            var ganttObj = $("#resourceGanttpr").data("ejGantt");
            if (ganttObj)
                ganttObj.destroy();
            $scope.clearEntity();
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onFlightRegistersHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'IsEditView',
             

        }
    };
    ////////////////////////////////////////////

    //$scope.$on('$viewContentLoaded', function () {

    //    $scope.bind();


    //});
    //$rootScope.$broadcast('FlightPlanRegisterLoaded', null);
    

    ////////////////////////////////////////
    $scope.tempData = null;
    $scope.planId = null; //$routeParams.id;
    $scope.plan = null;
    $scope.$on('InitFlightPlanRegister', function (event, prms) {
         
         
        $scope.planId = prms.Id;
        
        $scope.plan = {};
        $scope.plan.Title = 'DFSDFSDF';

        
        $scope.popup_add_title = 'Registers';


        $scope.popup_add_visible = true;


    });
    //////////////////////////////////////////////



}]);