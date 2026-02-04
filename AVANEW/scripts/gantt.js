
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
Date.prototype.addMinutes = function (h) {
    this.setTime(this.getTime() + (h * 60 * 1000));
    return this;
}



var statusDataSource2 = [
    { id: 1, title: 'Schedule', bgcolor: '#f0f0f0', color: '#000', class: 'schedule' },

    { id: 4, title: 'Cancel', bgcolor: '#a65959', color: '#fff', class: 'cancel' },

    { id: 6, title: 'Inactive', bgcolor: '#ffff00', color: '#fff', class: 'inactive' },
    { id: 7, title: 'Diverted', bgcolor: '#ee82ee', color: '#fff', class: 'diverted' },
    { id: 8, title: 'Ground', bgcolor: '#ff8000', color: '#fff', class: 'ground' },
    { id: 9, title: 'NoData', bgcolor: '#787878', color: '#fff', class: 'nodata' },




];
var activeDatasource = resourceGanttData;
var renderlabelInterval;
var renderLables = function (id) {
    // var _d = Enumerable.From(activeDatasource).Where('$.taskID==' + id).FirstOrDefault();
    if ($('#task-' + activeDatasource[activeDatasource.length - 1].taskID).length > 0)
        clearInterval(renderlabelInterval);
    $('.lbl_from').remove();
    $('.lbl_to').remove();
    $.each(activeDatasource, function (_i, _d) {
        var el = $('#task-' + _d.taskID);

        var p1 = el.parents('.e-childContainer');
        var echartcell = p1.parents('.e-chartcell');
        var p1_left = parseInt(p1.css('left'));
        var div_from = "<div id='task-" + _d.taskID + "-from' style='position:absolute;color:black;' class='lbl_from'>" + _d.from + "</div>";
        echartcell.append(div_from);
        var from = $('#task-' + _d.taskID + '-from');
        from_left = p1_left - from.width() - 5;
        from.css('left', from_left + 'px');
        // from.css('top', 5 + 'px');

        var div_to = "<div id='task-" + _d.taskID + "-to' style='position:absolute;color:black;'  class='lbl_to'>" + _d.to + "</div>";
        echartcell.append(div_to);
        var to = $('#task-' + _d.taskID + '-to');
        to_left = p1_left + p1.width() + 5;;
        to.css('left', to_left + 'px');
        // to.css('top', 5 + 'px');
    });
};
var cindex = 0;
function renderCompletedFunction(val, index) {
    cindex++;
    //console.log('taskid: ' + val + '    ' + index + '#  ' + cindex + '   ' + activeDatasource.length);
    if (cindex == activeDatasource.length) {
        cindex = 0;
        // renderlabelInterval=setInterval(function () { renderLables(); }, 100);
    }
    // renderLables(val);
}

function getDelayFunction(val) {
    var dataItem = Enumerable.From(activeDatasource).Where('$.taskID==' + val).FirstOrDefault();

    return dataItem.delay;
}

var myHelpers = { renderCompleted: renderCompletedFunction, getDelay: getDelayFunction };

$.views.helpers(myHelpers);



$.views.converters("round", function (val) {
    // Convert data-value or expression to upper case
    return Math.round(val);
});
$.views.converters("statusClass", function (val) {



    // Convert data-value or expression to upper case
    var dataItem = Enumerable.From(activeDatasource).Where('$.taskID==' + val).FirstOrDefault();
    if (dataItem) {
        if (!dataItem.status)
            return "";
        var status = Enumerable.From(statusDataSource).Where('$.id==' + dataItem.status).FirstOrDefault();
        return status.class;
    }
    else
        return "";
});


$(function () {




    var renderLables1 = function () {
        $.each(resourceGanttData, function (_i, _d) {
            var el = $('#task-' + _d.taskID);
            var p1 = el.parents('.e-childContainer');
            var echartcell = p1.parents('.e-chartcell');
            var p1_left = parseInt(p1.css('left'));
            var div_from = "<div id='task-" + _d.taskID + "-from' style='position:absolute;color:black;'>" + _d.from + "</div>";
            echartcell.append(div_from);
            var from = $('#task-' + _d.taskID + '-from');
            from_left = p1_left - from.width() - 10;
            from.css('left', from_left + 'px');

            var div_to = "<div id='task-" + _d.taskID + "-to' style='position:absolute;color:black;'>" + _d.to + "</div>";
            echartcell.append(div_to);
            var to = $('#task-' + _d.taskID + '-to');
            to_left = p1_left + p1.width() + 10;;
            to.css('left', to_left + 'px');
        });
    };

    var renderTasks = function () {
        $.each(resourceGanttData, function (_i, _d) {
            var $element = $('#task-' + _d.taskID);


            var $childtaskbar = $element.parents('.e-gantt-childtaskbar');
            if (_d.status) {

                var status = Enumerable.From(statusDataSource).Where('$.id==' + _d.status).FirstOrDefault();
                $childtaskbar.css('color', status.color).css('background-color', status.bgcolor);
                $childtaskbar.addClass(status.title);
                //   console.log($childtaskbar.css('background-color') + ' ' + _d.taskID);
            }

        });
    };
    var subtractDates = function (d1, d2) {

        //var diffMs = (d2 - d1); // milliseconds between now & Christmas
        //var diffDays = Math.floor(diffMs / 86400000); // days
        //var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        //var diffMins =  (((diffMs % 86400000) % 3600000) / 60000 ); // minutes
        //return {
        //    ms: diffMs,
        //    days: diffDays,
        //    hours: diffHrs,
        //    minutes: diffMins
        //};
        var diff = Math.abs(new Date(d1) - new Date(d2));
        var minutes = ((diff / 1000) / 60);
        return minutes;
    }
    var calculateDelay = function (item) {
        if (!item.takeOffDate)
            return;
        var d1 = new Date(item.startDate);
        var d2 = new Date(item.takeOffDate);
        var delay = (subtractDates(d1, d2));
        item.delay = delay;
        //if (item.delay && item.delay > 0)
        {
            item.duration = Number(item.baseDuration) + (item.delay / 60) + (item.delayLanding / 60);
            item.progress = ((item.delay / 60) / item.duration) * 100;

        }
        calculateBaseEndDate(item);
        calculateBaseStartDate(item);
        //  console.log(item);

    };

    var calculateDelayLanding = function (item) {
        if (!item.landingDate)
            return;
        var d1 = new Date(item.baseEndDate);
        var d2 = new Date(item.landingDate);
        var delay = (subtractDates(d1, d2));
        item.delayLanding = delay;
        // if (item.delayLanding && item.delayLanding > 0)
        {
            item.duration = Number(item.baseDuration) + (item.delay / 60) + (item.delayLanding / 60);


        }

        //  console.log(item);

    };

    var calculateBaseEndDate = function (item) {
        var edate = new Date(item.startDate);
        edate = edate.addHours(item.duration);
        item.baseEndDate = edate;

    };
    var calculateBaseStartDate = function (item) {
        var date = new Date(item.startDate);
        if (!item.delay || item.delay == 0) {
            item.baseStartDate = date;
            return;
        }


        date = date.addMinutes(item.delay);
        item.baseStartDate = date;

    };
    var proccessDataSource = function (ds) {
        $.each(ds, function (_i, _d) {
            _d.delay = 0;
            _d.delayLanding = 0;
            _d.baseDuration = Number(_d.duration);
            if (_d.takeOffDate) {
                var d1 = new Date(_d.startDate);
                var d2 = new Date(_d.takeOffDate);
                var delay = (subtractDates(d1, d2));
                _d.delay = delay;
                //          console.log(delay);
            }
            if (_d.delay && _d.delay > 0) {
                _d.duration = Number(_d.duration) + (_d.delay / 60);
                _d.progress = ((_d.delay / 60) / _d.duration) * 100;

            }
            calculateBaseEndDate(_d);
            calculateBaseStartDate(_d);
        });
        return ds;
    };

    var calculateNextTaskDelay = function (current, dataSource) {
        if (!current.delay)
            return;
        //Date.parse(datetimeStart) < Date.parse(datetimeEnd)
        var next = Enumerable.From(dataSource).Where('$.status==1 &&  $.startDate.getTime() > ' + current.startDate.getTime() + '  && $.resid==' + current.resid).OrderBy('$.startDate').FirstOrDefault();
        if (!next)
            return;
        next.delay = current.delay;
        next.duration = Number(next.baseDuration) + (next.delay / 60) + (next.delayLanding / 60);
        next.progress = ((next.delay / 60) / next.duration) * 100;
        calculateBaseEndDate(next);
        calculateBaseStartDate(next);
        // console.log(next);
        var ganttObj = $("#resourceGantt").data("ejGantt");
        ganttObj.updateRecordByTaskId(next);

        calculateNextTaskDelay(next, dataSource);

    };









    var vmins;
    var viewModel = function () {
        var self = this;
        self.btn_status = ko.observable({
            text: 'Change Status',
            onClick: function () {
                if (!self.selectedTaskData() || self.selectedTaskData().status == 2 || self.selectedTaskData().status == 3)
                    return;
                self.selectedStatus(self.selectedTaskData().status);

                self.pop_status_visible(true);
            },
        });
        self.btn_inf = ko.observable({
            text: 'inf',
            onClick: function () {
                var dataItem = Enumerable.From(activeDatasource).Where('$.taskID==' + '40').FirstOrDefault();
                console.log(dataItem);
                console.log('-----------------');
                console.log(activeDatasource);
            },
        });
        self.btn_takeoff = ko.observable({
            text: 'Take Off',
            onClick: function () {
                if (!self.selectedTaskData())
                    return;
                self.date_takeoff(new Date(self.selectedTaskData().baseStartDate));
                self.pop_takeoff_visible(true);

            },
        });
        self.btn_landing = ko.observable({
            text: 'Landing',
            onClick: function () {

                if (!self.selectedTaskData() || self.selectedTaskData().status != 2)
                    return;
                self.date_landing(new Date(self.selectedTaskData().baseEndDate));
                self.pop_landing_visible(true);

            },
        });
        self.btn_new = ko.observable({
            text: 'new',
            onClick: function () {

                var ganttObj = $("#resourceGantt").data("ejGantt");
                var data = { taskID: 40, from: 'THR', to: 'BAN', startDate: "02/27/2017 09:00:00 AM", duration: 5, status: 7, progress: 0, delay: 60, resourceId: [8] };
                data.taskName = data.from + '-' + data.to;
                if (data.delay) {
                    data.duration = Number(data.duration) + (data.delay / 60);
                    data.progress = ((data.delay / 60) / data.duration) * 100;

                }
                //var data = { taskId: "40", taskName: "New Task 40", startDate: "02/27/2017 09:00:00 AM", duration: 5, resourceId: [1] };
                ganttObj.addRecord(data, 0); // To add a task
                ////alert(self.gantt_datasource().length);

                //  $("#resourceGantt").ejGantt("instance").openAddDialog();
            }
        });

        self.viewType = ko.observable(ej.Gantt.ViewType.ResourceView);
        self.height = ko.observable("300px");
        self.gantt_datasource = ko.observable([]);
        self.selectedTask = ko.observable();
        self.selectedTaskData = ko.observable();
        //cmnt
        self.gantt_option = {
            ////////////////addDialogFields: [
            ////////////////   // { field: "from", editType: "stringedit", displayInGeneralTab: true },
            ////////////////    { field: "Id" },
            ////////////////    { field: "Name" },
            ////////////////    { field: "startDate" },
            ////////////////    { field: "Duration" },
            ////////////////    { field: "from" },
            ////////////////    { field:"isOverallocated"}
            ////////////////],
            ////////////////editDialogFields: [

            ////////////////    { field: "from", editType: "stringedit", displayInGeneralTab: true }
            ////////////////],
            ////////////////allowGanttChartEditing: false,
            ////////////////editSettings: { allowIndent: false },
            //////////////// readOnly: true,
            selectionMode: ej.Gantt.SelectionMode.Row,
            cellSelected: function (args) { alert('x'); },
            rowSelected: function (args) { /*console.log(args);*/ },
            taskbarClick: function (args) { self.selectedTask(args); self.selectedTaskData(args.data.item); },
            dataSource: self.gantt_datasource,  
            allowColumnResize: true,
            isResponsive: true,
            //taskIdMapping: "taskID",
            //taskNameMapping: "taskName",
            //fromLocationMapping: "from",
            //startDateMapping: "startDate",
            //endDateMapping: "endDate",
            //progressMapping: "progress",
            //durationMapping: "duration",
            //groupNameMapping: "groupName",
            //groupIdMapping: "groupId",
            //groupCollection: resourceGroups,
            //resources: resourceGanttResources,
            //resourceIdMapping: "resourceId",
            //resourceNameMapping: "resourceName",
            //resourceInfoMapping: "resourceId",
            //notesMapping: "notes",

            //rightTaskLabelMapping: "taskName",

            //baselineStartDateMapping: "BaselineStartDate",
            //baselineEndDateMapping: "BaselineEndDate",

            //highlightWeekEnds: true,
            //includeWeekend: false,
            //rowHeight: window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 40,
            //taskbarHeight: 35,
            //scheduleStartDate: new Date("02/27/2017"),
            //scheduleEndDate: new Date("02/27/2017"),
            //predecessorMapping: "predecessor",
            //allowGanttChartEditing: false,
            //allowDragAndDrop: true,
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
                showToolbar: true,
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
            enableContextMenu: true,
            load: function () {
                console.log('load');
                this.getColumns()[0].width = 180;
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
                // renderLables();
                // console.log('create');


            },
            actionBegin: function (args) {
                console.log(args);
            },
            actionComplete: function (args) {
                //  console.log(args);
                //renderTasks();
                // renderLables();
                // renderLables();
            },
            rowDataBound: function (args) { },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                dayHeaderFormat: "MMM MM ddd dd , yyyy",
                timescaleUnitSize: "400%"
            },
            // taskbarBackground: "red",
            taskbarTemplate: "#taskbarTemplate",
            leftTaskLabelTemplate: "#leftlableTemplate",
           // viewType: self.viewType,
            sizeSettings: { height: self.height }
        };
        self.test = ko.observable("vahid");

        self.date_takeoff = ko.observable();
        self.date_takeoff_options = ko.observable({
            type: "datetime",
            value: self.date_takeoff
        });

        self.updateTakeOffDate = function () {
            self.selectedTaskData().takeOffDate = new Date(self.date_takeoff());
            //console.log(self.selectedTaskData().takeOffDate);
            //console.log(activeDatasource);
            self.selectedTaskData().status = 2;
            calculateDelay(self.selectedTaskData());
            //console.log(self.selectedTaskData());
            calculateNextTaskDelay(self.selectedTaskData(), activeDatasource);
            var ganttObj = $("#resourceGantt").data("ejGantt");

            ganttObj.updateRecordByTaskId(self.selectedTaskData());
        };


        self.pop_takeoff_visible = ko.observable(false);
        self.pop_takeoff = ko.observable({
            rtlEnabled: false,
            fullScreen: false,
            showTitle: true,
            width: 400,
            height: 200,

            title: "TakeOff",
            visible: self.pop_takeoff_visible,
            dragEnabled: false,
            closeOnOutsideClick: false,
            toolbarItems: [
                {
                    widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', validationGroup: 'vgroup', }, toolbar: 'bottom',
                    onClick: function (e) {
                        self.updateTakeOffDate();
                        self.pop_takeoff_visible(false);
                    },
                },
                { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', onClick: function (e) { self.pop_takeoff_visible(false); } }, toolbar: 'bottom' }
            ],
            onHiding: function (arg) {

                self.pop_takeoff_visible(false);

            },
            onShowing: function (arg) {

            },
            onShown: function (arg) {

            },

        });

        /////Landing
        self.updateLandingDate = function () {
            self.selectedTaskData().landingDate = new Date(self.date_landing());
            //console.log(self.selectedTaskData().takeOffDate);
            //console.log(activeDatasource);
            self.selectedTaskData().status = 3;
            calculateDelayLanding(self.selectedTaskData());
            var ganttObj = $("#resourceGantt").data("ejGantt");

            ganttObj.updateRecordByTaskId(self.selectedTaskData());
        };
        self.date_landing = ko.observable();
        self.date_landing_options = ko.observable({
            type: "datetime",
            value: self.date_landing
        });
        self.pop_landing_visible = ko.observable(false);
        self.pop_landing = ko.observable({
            rtlEnabled: false,
            fullScreen: false,
            showTitle: true,
            width: 400,
            height: 200,

            title: "Landing",
            visible: self.pop_landing_visible,
            dragEnabled: false,
            closeOnOutsideClick: false,
            toolbarItems: [
                {
                    widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', validationGroup: 'vgroup', }, toolbar: 'bottom',
                    onClick: function (e) {
                        self.updateLandingDate();
                        self.pop_landing_visible(false);
                    },
                },
                { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', onClick: function (e) { self.pop_takeoff_visible(false); } }, toolbar: 'bottom' }
            ],
            onHiding: function (arg) {

                self.pop_landing_visible(false);

            },
            onShowing: function (arg) {

            },
            onShown: function (arg) {

            },

        });
        self.selectedStatus = ko.observable();
        self.status_options = ko.observable({
            dataSource: new DevExpress.data.ArrayStore({
                data: statusDataSource2,
                key: "id"
            }),
            displayExpr: "title",
            valueExpr: "id",
            value: self.selectedStatus,
        });

        self.updateStatus = function () {
            self.selectedTaskData().status = self.selectedStatus();
            var ganttObj = $("#resourceGantt").data("ejGantt");

            ganttObj.updateRecordByTaskId(self.selectedTaskData());
        };

        self.pop_status_visible = ko.observable(false);
        self.pop_status = ko.observable({
            rtlEnabled: false,
            fullScreen: false,
            showTitle: true,
            width: 400,
            height: 200,

            title: "Status",
            visible: self.pop_status_visible,
            dragEnabled: false,
            closeOnOutsideClick: false,
            toolbarItems: [
                {
                    widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', validationGroup: 'vgroup', }, toolbar: 'bottom',
                    onClick: function (e) {
                        self.updateStatus();
                        self.pop_status_visible(false);
                    },
                },
                { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', onClick: function (e) { self.pop_status_visible(false); } }, toolbar: 'bottom' }
            ],
            onHiding: function (arg) {

                self.pop_status_visible(false);
                self.selectedStatus(null);

            },



        });
        ///////////////////
    };
    vmins = new viewModel();
    ko.applyBindings(vmins);
    var h = $(window).height() - 130;
    vmins.height(h + 'px');

    var ds = proccessDataSource(resourceGanttData);
    activeDatasource = ds;

    vmins.gantt_datasource(ds);


    $("#resourceGantt1").ejGantt({
        dataSource: resourceGanttData,
        allowColumnResize: true,
        isResponsive: true,
        //taskIdMapping: "taskID",
        //taskNameMapping: "taskName",
        //fromLocationMapping: "from",
        //startDateMapping: "startDate",
        //endDateMapping: "endDate",
        //progressMapping: "progress",
        //durationMapping: "duration",
        //groupNameMapping: "groupName",
        //groupIdMapping: "groupId",
        groupCollection: resourceGroups,
        resources: resourceGanttResources,
        resourceIdMapping: "resourceId",
        resourceNameMapping: "resourceName",
        resourceInfoMapping: "resourceId",
        notesMapping: "notes",

        rightTaskLabelMapping: "taskName",

        baselineStartDateMapping: "BaselineStartDate",
        baselineEndDateMapping: "BaselineEndDate",

        highlightWeekEnds: true,
        includeWeekend: false,
        rowHeight: window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 40,
        taskbarHeight: 35,
        scheduleStartDate: new Date("02/27/2017"),
        scheduleEndDate: new Date("02/27/2017"),
        predecessorMapping: "predecessor",
        allowGanttChartEditing: true,
        allowDragAndDrop: true,
        editSettings: {
            allowEditing: true,
            allowAdding: true,
            allowDeleting: true,
            editMode: "normal",
        },
        splitterSettings: {
            position: 310,
        },
        toolbarSettings: {
            showToolbar: true,
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
        enableContextMenu: true,
        load: function () {

            this.getColumns()[0].width = 180;
            var customColumn = {
                field: "isOverallocated",
                mappingName: "isOverallocated",
                allowEditing: false,
                headerText: "Is Overallocated",
                isTemplateColumn: true,
                template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
            };
            this.getColumns().push(customColumn);
        },
        create: function (args) {
            // renderLables();
        },

        workingTimeScale: "TimeScale24Hours",
        durationUnit: ej.Gantt.DurationUnit.Hour,
        scheduleHeaderSettings: {
            scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
            dayHeaderFormat: "MMM MM ddd dd , yyyy",
            timescaleUnitSize: "400%"
        },
        // taskbarBackground: "red",
        taskbarTemplate: "#taskbarTemplate",
        leftTaskLabelTemplate: "#leftlableTemplate",
        viewType: ej.Gantt.ViewType.ResourceView,
        sizeSettings: { height: "600px" }
    });
});