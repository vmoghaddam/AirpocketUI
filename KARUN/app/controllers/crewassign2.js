app.controller('crewassign2Controller', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Crew';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);


    }

    $scope.prms = $routeParams.prms;
    $scope.IsCockpit = $route.current.isCockpit;


    //////////////////////////////////
    $scope.getContent1165 = function (duty) {
        return "<table style='min-width:125px'>"
                            + "   <tr>"
                            + "        <td style='width:32px;'>"

                            + "            <a class='cellposition' href=''  style='background:white;width:28px;height:28px;border-radius:50%;color:gray;font-weight:bold;font-size:10px;text-align:center;display: inherit;vertical-align:middle;'>"
                            + $scope.getPosition(duty.Position)
                            + "            </a>"

                            + "        </td>"
                            + "        <td style='text-align:left;'>"
                            + "            <div style='font-size:9px;font-weight:bold'>" + duty.FDPTitle + "</div>"
                            + "            <div style='font-size:9px; '>" + duty.FDPRemark + "</div>"
                            + "        </td>"
                            + "    </tr>"
                            + "</table>";
    };
    $scope.getContentEvent = function (duty, caption) {
        return "<table style='min-width:125px'>"
                            + "   <tr>"
                            + "        <td style='width:32px;'>"

                            + "            <a class='cellposition' href=''  style='background:white;width:28px;height:28px;border-radius:50%;color:gray;font-weight:bold;font-size:10px;text-align:center;display: inherit;vertical-align:middle;'>"
                            + caption
                            + "            </a>"

                            + "        </td>"
                            + "        <td style='text-align:left;'>"
                            + "            <div style='font-size:10px;font-weight:bold'>" + duty.FDPTitle + "</div>"
                            + "            <div style='font-size:10px; '>" + duty.FDPRemark + "</div>"
                            + "        </td>"
                            + "    </tr>"
                            + "</table>";
    };
    $scope.getContent = function (item) {
        var content = "<div class='cell-duty duty-" + item.DutyType + "' data-id='" + item.FDPId + "' data-type='" + item.DutyType + "' data-crew='" + item.CrewId + "' data-position='" + item.Position + "' style='margin-bottom:2px'>";
        switch (item.DutyType) {
            case 10000:
            case 10001:

                content += "<div style='font-size:11px;font-weight:bold;text-align:left'>" + item.FDPTitle + "</div>";
                content += "<div style='font-size:11px;text-align:left'>" + item.FDPRemark + "</div>";
                break;
            case 1167:
                content += $scope.getContentEvent(item, 'PM');
                break;
            case 1168:

                content += $scope.getContentEvent(item, 'AM');
                break;
            case 5000:

                content += $scope.getContentEvent(item, 'TRN');
                break;
            case 5001:

                content += $scope.getContentEvent(item, 'OFC');
                break;
            case 1165:
                content += $scope.getContent1165(item);

                break;
            default: break;
        }


        content += "</div>";
        return content;
    };
    ////////////////////////////////////
    $scope.currentFDPS = null;
    $scope.selectedYear = null;
    $scope.selectedMonth = null;
    $scope.selectedTabDateIndex = -1;
    $scope.tabsdatefirst = true;
    $scope.$watch("selectedTabDateIndex", function (newValue) {

        try {
            var fdps = [];

            if ($scope.selectedTabDateIndex == -1)
                return;
            $scope.selectedTab = $scope.tabs_date[newValue];

            $scope.selectedDate = new Date($scope.selectedTab.date);
            $scope.selectedYear = $scope.selectedTab.year;
            $scope.selectedMonth = $scope.selectedTab.month;

            // $scope.StopNowLineTimer();
            // $scope.createGantt();
            var columns = $scope.dg_timeline_instance.option("columns");
            //kar

            // { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
            columns = [
                { dataField: 'JobGroup', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, fixed: true, fixedPosition: 'left' },
                { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 160, fixed: true, fixedPosition: 'left' },
            ];

            var days = $scope.selectedDate.getDaysInMonth();
            var bd = new Date($scope.selectedTab.date);
            var ed = (new Date($scope.selectedTab.date)).addDays(days - 1);

            while (bd <= ed) {
                var datafield = moment(bd).format("YYYYMMDD");
                var column = { dataField: datafield, caption: moment(bd).format("YYYY-MM-DD"), allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, };
                column.date = new Date(bd);
                var dateStr = datafield;//options.column.dataField;


                column.day = Number(dateStr.substr(6, 2));
                column.month = Number(dateStr.substr(4, 2));
                column.year = Number(dateStr.substr(0, 4));

                column.cellTemplate = function (container, options) {
                    // console.log('cell rendered ' + options.column.dataField);

                    //if (sbdate == options.column.dataField && options.data.RestRemark && (!options.value.CalendarStatusId || options.value.CalendarStatusId == 1167 || options.value.CalendarStatusId == 1168)) {
                    //    restremark = "<div style='font-weight:bold;color:red;font-size:12px'>" + options.data.RestRemark + "</div>";
                    //}

                    var dateStr = options.column.dataField;
                    var cyear = Number(dateStr.substr(0, 4));
                    var cmonth = Number(dateStr.substr(4, 2));
                    var cday = Number(dateStr.substr(6, 2));
                    var cid = options.data.Id;
                    var cfdp = Enumerable.From($scope.currentFDPS)
                    //.Where('$.CrewId==' + cid + ' && $.CDay==' + cday + ' && $.DateStartMonth==' + cmonth + ' && $.DateStartYear==' + cyear).FirstOrDefault();


                    //.Where('$.CrewId==' + cid + ' && $.CDay<=' + cday + ' && $.DateEndDay>=' + cday + ' && $.DateStartMonth==' + cmonth + ' && $.DateStartYear==' + cyear)
                       .Where(function (x) {
                           var dend = (new Date(x.DutyEndLocal));
                           if (dend.getHours() == 0 && dend.getMinutes() == 0 && dend.getSeconds() == 0)
                           {
                               dend.setSeconds(dend.getSeconds() -1);
                           }
                           var dutyStart = new Date(General.getDayFirstHour(new Date(x.DutyStartLocal)));
                           var dutyEnd = new Date(General.getDayFirstHour(new Date(dend)));
                           var bdDate = new Date(cyear, cmonth - 1, cday, 0, 0, 0);

                           return x.CrewId == cid && bdDate >= dutyStart && bdDate <=  dutyEnd;
                       })
                        .OrderBy('$.DutyStartLocal').Distinct('$.FDPId').ToArray();



                    //ds<=cday and de>=cday
                    var content = "";
                    $.each(cfdp, function (_j, _x) {
                        content += $scope.getContent(_x);

                    })

                    var value = options.value;

                    var cdate = new Date(cyear, cmonth - 1, cday, 0, 0, 0);
                    var bdate = new Date(options.data.DateInactiveBegin);
                    var edate = new Date(options.data.DateInactiveEnd);
                    if (cdate >= bdate && cdate <= edate)
                        content = "<div style='padding:5px 10px 5px 10px;background:#ccc'>Inactive<div>";
                    


                    var element = "<div>"
                        + content
                        + "</div>";

                    $("<div>")
                        .append(element)
                        .appendTo(container);



                };
                columns.push(column);
                bd = (new Date(bd)).addDays(1).setHours(0, 0, 0, 0);
            };


            $scope.dg_timeline_instance.option("columns", columns);
            $scope.dg_timeline_instance.repaint();
            ///////////////////////////////
            $scope.dg_timeline_ds = [];
            var _temp = [];
            $.each($scope.crews, function (_i, _d) {
                var crew = {};
                crew.Id = _d.Id;
                crew.ScheduleName = _d.ScheduleName;
                crew.GroupId = _d.GroupId;
                crew.JobGroup = _d.JobGroup;
                crew.JobGroupCode = _d.JobGroupCode;
                crew.Name = _d.Name;
                crew.IsValid = _d.IsValid;
                crew.DateInactiveBegin = _d.DateInactiveBegin;
                crew.DateInactiveEnd = _d.DateInactiveEnd;
                _temp.push(crew);

            });

            $scope.getFDPs($scope.selectedYear, $scope.selectedMonth + 1, function (data) {
                $scope.currentFDPS = data;
                $scope.dg_timeline_ds = Enumerable.From(_temp).ToArray();
                $scope.dg_timeline_instance.refresh();
            });


            ///////////////////////////////

        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_date = [


    ];

    $scope.tabsdatevisible = false;
    $scope.tabs_date_options = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex = -1;
            $scope.selectedTabDateIndex = 0;
        },
        bindingOptions: {
            visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs_date", deep: true },
            selectedIndex: 'selectedTabDateIndex'
        }

    };
    /////////////////////////////////////
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
    /////////////////////////////////////
    $scope.crews = [];
    $scope.fdps = [];
    $scope.getCrews = function (callback) {

        flightService.getCrewGrouped(Config.CustomerId, $scope.IsCockpit).then(function (response) {

            $scope.crews = response;

            if (callback)
                callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.getFDPs = function (year, month, callback) {
        var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + month).FirstOrDefault();
        if (fdps)
            callback(fdps.items);
        else {
            $scope.loadingVisible = true;
            flightService.getFDPs($scope.IsCockpit, year, month).then(function (response) {
                $scope.loadingVisible = false;
                var item = { Year: year, Month: month };
                item.items = Enumerable.From(response).ToArray();
                $scope.fdps.push(item);

                callback(item.items);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

    };

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'assigncrewdate',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.getCrews(function () {
                $scope.createTabs();
            });

            //$scope.BeginSearch();

        }

    };
    $scope._datefrom = (new Date(General.getDayFirstHour(new Date()))).setDate(1);


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        displayFormat: 'monthAndYear',
        maxZoomLevel: 'year',
        minZoomLevel: 'century',
        bindingOptions: {
            value: '_datefrom',

        }
    };

    $scope._datefdp = null;

    $scope.date_fdp = {
        type: "date",
        placeholder: 'Select Date',
        width: '100%',
        //displayFormat: 'monthAndYear',
        //maxZoomLevel: 'year',
        //minZoomLevel: 'century',
        onValueChanged: function (e) {
            $scope.bindValidFDPDay();
        },
        bindingOptions: {
            value: '_datefdp',

        }
    };


    $scope.days_count = 2;
    $scope.num_days = {
        min: 1,
        showSpinButtons: false,
        bindingOptions: {
            value: 'days_count',

        }
    };

    $scope.datefrom = null;
    $scope.dateEnd = null;
    $scope.dateto = null;

    $scope.BeginSearch = function () {
        $scope.datefrom = General.getDayFirstHour(new Date($scope._datefrom));
        $scope.dateEnd = General.getDayLastHour(new Date(new Date($scope._datefrom).addDays($scope.days_count - 1)));
        $scope.dateto = General.getDayLastHour(new Date($scope._datefrom)); //General.getDayLastHour( (new Date(Date.now())) );
        //$scope.StopNowLineTimer();
        $scope.search();
    };
    $scope.search = function () {

        $scope.bindFlights(false);
    };
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.baseDate = null;
    $scope.ganttData = null;
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.dataSource = [];
    $scope.createTabs = function () {
        var stdate = new Date($scope._datefrom);
        // var cmonth = from.getMonth();

        $scope.tabsdatefirst = true;
        $scope.tabs_date = [];
        var i;

        for (i = 1; i <= $scope.days_count; i++) {
            var str = moment(stdate).format("YYYY-MMM");
            $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD'), year: stdate.getFullYear(), month: stdate.getMonth() });
            stdate = stdate.addMonths(1);

        }
        $scope.tabsdatevisible = true;
        $scope.selectedTabDateIndex = 0;
    };
    $scope.bindFlights = function (saveState) {

        $scope.selectedTabDateIndex = -1;
        var offset = -1 * (new Date()).getTimezoneOffset();
        var stdate = new Date($scope._datefrom);
        var endate = new Date(stdate.addDays($scope.days_count - 1));
        $scope.plansDto = {
            CustomerId: 1,
            Date: stdate.ToUTC(),
            DateTo: endate.ToUTC(),
            Offset: offset,
            Design: false,
            PlanId: -1,
        };

        $scope.loadingVisible = true;
        flightService.getPlanItemsGanttCrewTest($scope.plansDto).then(function (response) {
            $scope.loadingVisible = false;

            ////////////////////
            $scope.tabsdatefirst = true;
            $scope.tabs_date = [];
            var i;

            for (i = 1; i <= $scope.days_count; i++) {
                var str = moment(stdate).format("DD-MMM-YYYY");
                $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                stdate = stdate.addDays(1);

            }
            $scope.tabsdatevisible = true;
            ////////////////////

            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource2(response.flights);
            Flight.activeDatasource = $scope.dataSource;

            $scope.selectedTabDateIndex = 0;



        });



    };

    $scope.rebind = function () {


        var offset = -1 * (new Date()).getTimezoneOffset();
        var stdate = new Date($scope._datefrom);
        var endate = new Date(stdate.addDays($scope.days_count - 1));
        $scope.plansDto = {
            CustomerId: 1,
            Date: stdate.ToUTC(),
            DateTo: endate.ToUTC(),
            Offset: offset,
            Design: false,
            PlanId: -1,
        };

        $scope.loadingVisible = true;
        flightService.getPlanItemsGanttCrewTest($scope.plansDto).then(function (response) {
            $scope.loadingVisible = false;




            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource2(response.flights);
            Flight.activeDatasource = $scope.dataSource;

            var ganttObj = $("#resourceGanttba").data("ejGantt");

            ganttObj._refreshDataSource($scope.dataSource);

            $scope.selectedBox = null;
            $scope.selectedBoxId = null;
            $scope.selectedIds = [];
            $scope.selectedItems = [];


        });



    };
    ////////////////////////////////////////////
    $scope.addSelectedFlight = function (item) {
    };
    //////////////////////////////////////////
    $scope.timeCellWidth = 0;
    $scope.selectedDate = null;
    $scope.createGantt = function (_scale) {
         
        var dtstr = (new Date($scope.datefrom)).yyyymmddtimenow(false);

        if (!_scale) {
            _scale = $(window).width() * 0.24;
        }

        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        $scope.StartNowLineTimerFirst = true;
        var h = $(window).height() - 139 - 50 + 50 - 38;
        h = h + 'px';
        var d2 = (new Date($scope.selectedDate)).addDays(0);
        var _df = General.getDayFirstHour(new Date($scope.selectedDate));
        var _dt = General.getDayLastHour(d2);
        


        $("#resourceGanttba").ejGantt({
            scheduleStartDate: _df, //$scope.datefrom,
            scheduleEndDate: _dt,//$scope.dateto,

            taskbarBackground: "red",
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,
            taskbarClick: function (args) {
                $scope.addSelectedFlight(args.data.item);
                $("#resourceGanttba").data("ejGantt").clearSelection();
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
            taskbarHeight: 30,





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
                position: 110,
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
                this.getColumns()[0].width = 110;

                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };


                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };


                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };


            },
            create: function (args) {
                try {

                    $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(1000000);
                    $('.e-scrollbar.e-js.e-widget.e-hscrollbar').remove();
                    $scope.renderTopTimeHeader();
                    $scope.renderTimeHeader();



                    $('.e-ganttviewerbodyContianer-stripLines').css('z-index', 0);
                    $scope.timeCellWidth = $('.e-schedule-day-headercell-content').width();



                    var nw = new Date();
                    var nf = new Date(_df); //new Date($scope.datefrom);
                    var nt = new Date(_dt); //new Date($scope.dateto);
                    if (nw.getTime() >= nf.getTime() && nw.getTime() <= nt.getTime()) {

                        //$scope.autoUpdate = true;
                        // $scope.StartNowLineTimer(1);
                    }
                    else {
                        // $scope.autoUpdate = false;

                    }

                }
                catch (ee) {
                    alert(ee);
                }






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

            actionBegin: function (args) {

                if (args.requestType && args.requestType == 'beginedit') {

                    args.cancel = true;


                }


            },
            actionComplete: function (args) {

                //check requestType=refresh
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


            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {

                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "dd-MM-yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.Auto,
                timescaleStartDateMode: ej.Gantt.TimescaleRoundMode.Auto,
                timescaleUnitSize: _scale + "%"
            },

            // taskbarTemplate: "#taskbarTemplateLight",
            taskbarTemplate: "#taskbarTemplateBoxNew",
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

    ///////////////////////////////////////////////
    $scope.dg_timeline_columns = [




    ];
    $scope.dg_timeline_selected = null;
    $scope.dg_timeline_instance = null;
    $scope.dg_timeline_ds = null;
    $scope.edit_selected_crewId = null;
    $scope.edit_selected_dutyId = null;
    $scope.edit_selected_position = null;
    $scope.dg_timeline = {
        onContextMenuPreparing: function (e) {
            if (e.target != 'content')
                return;
            // e.items can be undefined
            if (!e.items) e.items = [];
            if (e.row.data.IsValid == 0)
                return;

          

            var cdate = new Date(e.column.date);
            var bdate = new Date(e.row.data.DateInactiveBegin);
            var edate = new Date(e.row.data.DateInactiveEnd);
            if (cdate >= bdate && cdate <= edate)
                return;

            // Add a custom menu item
            e.items.push(
                {


                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1165' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign FDP</td></tr></table>",
                    onItemClick: function () {



                        $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.popup_crew_visible = true;
                    }
                },
                {
                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Day Off</td></tr></table>",

                    text: "Assign Day Off",
                    onItemClick: function () {

                        // $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.event_status = 10000;
                        $scope.FromDateEvent = (new Date(e.column.date)).setHours(20, 0, 0, 0);
                        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(36);
                        $scope.popup_event_title = 'Day Off';
                        $scope.popup_event_visible = true;
                    }
                },
                {
                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>",

                    text: "Assign StandBy AM",
                    onItemClick: function () {

                        // $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.event_status = 1168;
                        $scope.FromDateEvent = (new Date(e.column.date)).setHours(0, 0, 0, 0);
                        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60  );
                        $scope.popup_event_title = 'StandBy AM';
                        $scope.popup_event_visible = true;
                    }
                },
                {
                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>",

                    text: "Assign StandBy PM",
                    onItemClick: function () {

                        // $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.event_status = 1167;
                        $scope.FromDateEvent = (new Date(e.column.date)).setHours(12, 0, 0, 0);
                        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60 );
                        $scope.popup_event_title = 'StandBy PM';
                        $scope.popup_event_visible = true;
                    }
                },
                {
                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Office</td></tr></table>",

                    text: "Assign Office",
                    onItemClick: function () {

                        // $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.event_status = 5001;
                        $scope.FromDateEvent = (new Date(e.column.date)).setHours(8, 0, 0, 0);
                        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
                        $scope.popup_event_title = 'Office';
                        $scope.popup_event_visible = true;
                    }
                },
                {
                    template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Training</td></tr></table>",

                    text: "Assign Training",
                    onItemClick: function () {

                        // $scope._datefdp = e.column.date;
                        $scope.selectedCrewId = e.row.data.Id;
                        $scope.event_status = 5000;
                        $scope.FromDateEvent = (new Date(e.column.date)).setHours(8, 0, 0, 0);
                        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
                        $scope.popup_event_title = 'Training';
                        $scope.popup_event_visible = true;
                    }
                }

            );

            var $div = $(e.targetElement).closest('.cell-duty');

            if ($div && $div.length > 0) {
                var id = $($div).data('id');
                var type = $($div).data('type');
                var crewid = $($div).data('crew');
                var position = $($div).data('position');
                if (type == 10000 || type == 10001 || type == 1167 || type == 1168 || type==5000 || type==5001) {
                    e.items.push({
                        template: "<table><tr><td style='vertical-align:middle;'><div   style='width:15px;height:15px;border-radius:50%;background:red'></div></td><td style='vertical-align:top;padding-left:5px;'>Delete</td></tr></table>",

                        text: "Delete",
                        onItemClick: function () {
                            $scope.removeAssignedFDP(id, function () {
                                $scope.currentFDPS = Enumerable.From($scope.currentFDPS).Where('$.FDPId!=' + id).ToArray();
                                $.each($scope.fdps, function (_a, _q) {
                                    _q.items = Enumerable.From(_q.items).Where('$.FDPId!=' + id).ToArray();
                                });
                                $scope.dg_timeline_instance.refresh();
                            });




                        }
                    });
                }
                if (type == 1165) {
                    e.items.push(
                        {
                            template: "<table><tr><td style='vertical-align:middle;'><div   style='width:15px;height:15px;border-radius:50%;background:Green'></div></td><td style='vertical-align:top;padding-left:5px;'>Edit</td></tr></table>",

                            text: "Edit",
                            onItemClick: function () {
                                //doodool
                                //  alert(id + '   ' + type);
                                $scope.edit_selected_crewId = crewid;
                                $scope.edit_selected_dutyId = id;
                                $scope.edit_selected_position = position;

                                $scope.popup_edit_fdp_visible = true;
                            }
                        });
                    e.items.push({
                        template: "<table><tr><td style='vertical-align:middle;'><div   style='width:15px;height:15px;border-radius:50%;background:red'></div></td><td style='vertical-align:top;padding-left:5px;'>Delete</td></tr></table>",

                        text: "Delete",
                        onItemClick: function () {
                            $scope.removeAssignedFDP(id, function () {
                                $scope.currentFDPS = Enumerable.From($scope.currentFDPS).Where('$.FDPId!=' + id).ToArray();
                                $.each($scope.fdps, function (_a, _q) {
                                    _q.items = Enumerable.From(_q.items).Where('$.FDPId!=' + id).ToArray();
                                });
                                $scope.dg_timeline_instance.refresh();
                            });




                        }
                    });
                }
            }

        },
        onCellClick: function (e) {

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
        selection: { mode: 'none' },
        columnMinWidth: 100,
        columnAutoWidth: true,
        //height: function () {
        //    return $(window).height() - 200 - 0;
        //},
        height: '100%',

        columns: $scope.dg_timeline_columns,
        onContentReady: function (e) {
            if (!$scope.dg_timeline_instance)
                $scope.dg_timeline_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_timeline_selected = null;

            }
            else {
                $scope.dg_timeline_selected = data;

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },
        onCellPrepared: function (cellInfo) {
            if (cellInfo.rowType == "data" && (cellInfo.column.dataField === 'ScheduleName' || cellInfo.column.dataField === 'JobGroup')) {
               
                if (cellInfo.data.IsValid ==0) { cellInfo.cellElement.addClass('light-red'); }
                
            }
        },
        bindingOptions: {
            dataSource: 'dg_timeline_ds',

        }
    };

    /////////////////////////////////////////
    $scope.ganttCreated = false;
    $scope.renderTopTimeHeader = function () {

        var _whcs = $('.e-schedule-week-headercell-content');
        $.each(_whcs, function (_i, _d) {
            var whcs = $(_d);
            var oldwc = whcs.html().split('(')[0];
            var year = Number(oldwc.split('-')[2]);
            var prts = (oldwc.split('-'));
            var mo = prts[1];
            var da = prts[0];
            var wdate = new Date(year + "/" + mo + "/" + da);
            var newwc = oldwc + " (" + new persianDate(wdate).format("DD/MM/YYYY") + ")";
            whcs.html(newwc);
        });
    };
    $scope.renderTimeHeader = function () {

        var dhcs = $('.e-schedule-day-headercell-content');


        $.each(dhcs, function (_i, _d) {
            var $d = $(_d);
            var oldc = $d.html();


            var $dhour = Number($d.html());
            var spanlen = $d.find('span').length;
            if (spanlen > 0) {
                oldc = $($d.find('span')[1]).html();
                $dhour = Number(oldc);
            }
            var sech = 0;
            if (!$scope.IsUTC)
                sech = getUTCHour($dhour);
            else
                sech = getUTCHour($dhour);
            var newc = "<span style='font-size:10px;display:block;color:gray;text-align:left;padding-left:2px'>" + sech + "</span>" + "<span style='font-size:13px;display:block;position:relative;top:-5px'>" + oldc + "</span>";
            $d.html(newc);

        });




    };
    /////////////////////////////////////////
    $scope.selectedIds = [];
    $scope.selectedItems = [];
    $scope.selectedBox = null;
    $scope.selectedBoxId = null;
    $scope.selectedBoxChanged = function () {

        if (!$scope.selectedBox)
            return;
        var title = [];
        $.each($scope.selectedBox.BoxItems, function (_i, _d) {
            if (_i == 0)
                $scope.SourceLocation = _d.FromAirportIATA;
            title.push(_d.FlightNumber + ' (' + _d.FromAirportIATA + '-' + _d.ToAirportIATA + ')');
        });
        //$scope.AssignedCrew = 'Assigned crew for flights: ' + title.join(', ');
        // $scope.FlightsTitle = 'Flights: ' + title.join(', ');

        // $scope.getCrew($scope.selectedBox.BoxId);

    };
    $scope.selectedIdsChanged = function () {
        $scope.$apply(function () {
            $scope.selectedBox = null;
            $scope.selectedBoxId = null;
            $scope.AssignedCrew = "Assigned Crew";
            $scope.dg_crew_ds = [];
            $scope.dg_sum_ds = [];

        });

    };


    $scope.$watch('selectedBox', function () {
        $scope.selectedBoxChanged();
    });

    ///////////////////////////////
    $scope.btn_box = {
        text: 'Group',
        type: 'default',
        //icon: 'link',
        width: 150,

        onClick: function (e) {
            //var curdate = (new Date($scope.selectedDate)).getDatePart();
            //var deleted = Enumerable.From($scope.dataSource).Where('(new Date($.STD)).getDatePart()=="' + curdate + '" || (new Date($.STA)).getDatePart()=="'+ curdate + '"').ToArray();
            //console.log(deleted);
            //return;
            if ($scope.selectedIds.length < 1)
                return;
            if ($scope.selectedIds.length > 10) {
                General.ShowNotify('Invalid sector counts', 'error');
                return;
            }

            var check = Enumerable.From($scope.selectedItems).Select('$.CalendarId').Distinct().ToArray();


            var dto = { ids: $scope.selectedIds, cid: $scope.selectedItems[0].CalendarId };
            $scope.loadingVisible = true;
            flightService.boxItems(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.rebind();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.btn_unbox = {
        text: 'UnGroup',
        type: 'default',
        //icon: 'revert',
        width: 150,

        onClick: function (e) {
            if (!$scope.selectedBox)
                return;



            var dto = { id: $scope.selectedBox.BoxId };
            $scope.loadingVisible = true;
            flightService.unboxItems(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.rebind();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.btn_fdp = {
        text: 'FDPs',
        type: 'default',
        //icon: 'link',
        width: 150,

        onClick: function (e) {

            $scope.popup_fdp_visible = true;
        }

    };
    $scope.btn_cal = {
        text: 'Cal',
        type: 'default',
        //icon: 'link',
        width: 150,

        onClick: function (e) {


            $scope.popup_cal_visible = true;
        }

    };
    //////////////////////////////

    $scope.crewGroup = null;
    $scope.sb_cabin = {
        showClearButton: false,
        searchEnabled: false,

        height: 35,
        //width: 150,

        dataSource: ['Cockpit', 'Cabin'],
        onValueChanged: function (e) {
            if (!e.value) {
                $scope.dg_crew_ds = null;
                return;
            }

            $scope.IsCockpit = e.value == 'Cockpit';
            if ($scope.dg_box_keys && $scope.dg_box_keys.length > 0)
                $scope.bindValidCrew($scope.dg_box_selected.BoxId, 1, e.value == 'Cockpit' ? 1 : 0);

        },
        bindingOptions: {

            value: 'crewGroup',
        }
    };
    /////////////////////////////////////
    $scope.dg_valid_crew_columns = [

       { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        {
            dataField: "Id", caption: '',
            width: 70,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'addCrewTemplate',

        },

    ];
    $scope.dg_valid_crew_selected = null;
    $scope.dg_valid_crew_instance = null;
    $scope.dg_valid_crew_ds = null;
    $scope.dg_valid_crew = {
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
        height: function () {
            return $(window).height() - 200 - 120;
        },

        columns: $scope.dg_valid_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_valid_crew_instance)
                $scope.dg_valid_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_valid_crew_selected = null;

            }
            else {
                $scope.dg_valid_crew_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.StandById != -1)
                e.rowElement.css('background', '#ffff80');

        },

        bindingOptions: {
            dataSource: 'dg_valid_crew_ds',

        }
    };
    ///////////////////////////////////////
    $scope.dg_box_columns = [
      // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
        //{ dataField: 'DutyStartLocal', caption: 'Start', allowResizing: true, alignment: 'center', allowEditing: false, width: 100 },
     { dataField: 'FDPTitle', caption: 'FDP', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
      { dataField: 'FDPRemark', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120 },
       {
           dataField: "Id", caption: '',
           width: 65,
           allowFiltering: false,
           allowSorting: false,
           cellTemplate: 'addFDPTemplate',
           //cellTemplate: function (container, options) {

           //    $("<div>")
           //        .append("<a   data-id='" + options.value + "'  href=''  class='addFDP3 w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none;padding:5px 0px !important;border-radius:50%;text-align:center'>+</a>")
           //        .appendTo(container);


           //},

       },


    ];

    $scope.dg_box_selected = null;
    $scope.dg_box_instance = null;
    $scope.dg_box_ds = null;
    $scope.dg_box_keys = null;
    $scope.dg_box = {
        keyExpr: 'Id',
        wordWrapEnabled: true,
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
        height: function () {
            return $(window).height() - 230;
        },

        columns: $scope.dg_box_columns,
        onContentReady: function (e) {
            if (!$scope.dg_box_instance)
                $scope.dg_box_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_box_selected = null;
            //    $scope.assignedCrewDs = null;

            //}
            //else {
            //    $scope.dg_box_selected = data;
            //    $scope.bindAssignedCrew(data);


            //    $scope.dg_crew_ds = null;
            //    $scope.bindValidCrew(data.BoxId, 1, $scope.IsCockpit ? 1 : 0);

            //    //alert(data.BoxId);

            //}
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.StandById != -1)
                e.rowElement.css('background', '#ffff80');

        },

        bindingOptions: {
            dataSource: 'dg_box_ds',
            selectedRowKeys: 'dg_box_keys',

        }
    };

    //////////////////////////////////////
    $scope.dg_fdp_columns = [
         {
             dataField: 'MatchingListErrors', caption: 'ML', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 35,
             cellTemplate: function (container, options) {
                if (options.value > 0)
                 {
                     $("<div>")
                      .append('<i class="fas fa-puzzle-piece" style="font-size:13px;position: relative;left:0px;top:-1px;color:red"></i>')
                        
                     .appendTo(container);
                 }
                 


             },
         },
          {
              dataField: 'MaleFemaleError', caption: 'MF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 37,
              cellTemplate: function (container, options) {
                  if (options.value > 0) {
                      $("<div>")
                       .append('<i class="fas fa-restroom" style="font-size:13px;position: relative;left:-2px;top:-1px;color:red"></i>')
                           //.append('<i class="fas fa-female" style="font-size:12px;position: relative;left:-2px;top:-1px;color:red"></i>')

                      .appendTo(container);
                  }



              },
          },
        { dataField: 'DutyStartLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 110 },
      { dataField: 'FDPTitle', caption: 'FDP', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
      { dataField: 'FDPRemark', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 110 },

    ];
    $scope.dg_fdp_selected = null;
    $scope.dg_fdp_instance = null;
    $scope.dg_fdp_ds = null;
    $scope.dg_fdp = {
        //keyExpr: 'Id',
        wordWrapEnabled: true,
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
        height: function () {
            // return $(window).height() - 230;
            return $(window).height() - 115;
        },

        columns: $scope.dg_fdp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fdp_instance)
                $scope.dg_fdp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fdp_selected = null;
                $scope.assignedCrewDs = null;

            }
            else {
                $scope.dg_fdp_selected = data;
                $scope.bindAssignedCrew(data);

                //goh
                $scope.dg_valid_crew_ds = null;
                $scope.bindValidCrew(data.Id, 1, $scope.IsCockpit ? 1 : 0);

                //alert(data.BoxId);

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'dg_fdp_ds',
            //selectedRowKeys: 'dg_box_keys',

        }
    };
    //////////////////////////////////////
    $scope.dg_calcrew_columns = [
        // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
       { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
          { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false },


    ];
    $scope.dg_calcrew_selected = null;
    $scope.dg_calcrew_instance = null;
    $scope.dg_calcrew_ds = null;
    $scope.dg_calcrew = {
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
        height: function () {
            return $(window).height() - 114;
        },

        columns: $scope.dg_calcrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_calcrew_instance)
                $scope.dg_calcrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_calcrew_selected = null;

            }
            else {
                $scope.dg_calcrew_selected = data;
                $scope.cal_change();
            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'dg_calcrew_ds',

        }
    };
    //////////////////////////////////////
    $scope.dg_calfdp_columns = [
        // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
         { dataField: 'DutyStart', caption: 'Date', allowResizing: true, alignment: 'left', dataType: 'date', allowEditing: false, width: 110 },
       { dataField: 'FDPTitle', caption: 'Duty', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
       { dataField: 'FDPRemark', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 110 },
          {
              dataField: "Id", caption: '',
              width: 65,
              allowFiltering: false,
              allowSorting: false,
              cellTemplate: function (container, options) {

                  $("<div>")
                      .append("<a   data-id='" + options.value + "'  href='' class='addFDP w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none;padding:5px 0px !important;border-radius:50%;text-align:center'>+</a>")
                      .appendTo(container);


              },

          },

    ];
    $scope.dg_calfdp_selected = null;
    $scope.dg_calfdp_instance = null;
    $scope.dg_calfdp_ds = null;
    $scope.dg_calfdp = {
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
        height: function () {
            return $(window).height() - 114;
        },

        columns: $scope.dg_calfdp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_calfdp_instance)
                $scope.dg_calfdp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_calfdp_selected = null;

            }
            else {
                $scope.dg_calfdp_selected = data;
                $scope.cal_change();
            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'dg_calfdp_ds',

        }
    };

    /////////////////////////////////////////
    $scope.cal_crew_current = new Date();
    $scope.$watch('cal_crew_current', function (newValue, oldValue, scope) {
        //  alert(newValue);
        $scope.cal_change();
    });
    $scope.cal_crew_ds = null;
    $scope.cal_crew_instance = null;
    $scope.cal_crew = {
        //dataSource: data,
        textExpr: 'Flights',
        startDateExpr: 'DutyStartLocal',
        endDateExpr: 'DutyEndLocal',
        views: ["month", "day"],
        currentView: "month",
        startDayHour: 0,
        appointmentTemplate: 'appointmentTemplate',
        appointmentTooltipTemplate: "tooltip-template",
        height: function () {
            return $(window).height() - 115 - 31;
        },
        onContentReady: function (e) {
            if (!$scope.cal_crew_instance)
                $scope.cal_crew_instance = e.component;

        },
        optionChanged: function (e) {
            //alert(e.name + '   ' + e.value);
        },
        onAppointmentClick: function (e) {
            var $el = $(e.event.target);
            if ($el.hasClass('cellposition')) {
                e.cancel = true;
                return;
            }
        },
        bindingOptions: {
            currentDate: 'cal_crew_current',
            dataSource: 'cal_crew_ds',

        }
    };
    $scope.getDutyClass = function (duty) {
        switch (duty.DutyType) {
            case 1165:
                return 'duty-1165';
            default:
                return '';
        }
    };
    $scope.getPosition = function (position) {

        switch (position) {
            case 'Captain':
                return 'CPT';
            case 'Purser':
                return 'PU';
            case 'SCCM(i)':
                return 'SCI';
            default:
                return position;
        }

    };
    $scope.cellPositionClicked = function (id) {

        //  alert(id);
        //  $event.stopPropagation();
    };
    //////////////////////////////////////


    //////////////////////////////////////
    $scope.bindValidCrew = function (fdp, isvalid, cockpit) {
        $scope.loadingVisible = true;
        flightService.getValidCrew(fdp, isvalid, cockpit).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_valid_crew_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.bindValidFDP = function (pid, year, month) {
        $scope.loadingVisible = true;
        flightService.getValidFDP(pid, year, month).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_calfdp_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.bindFDPs = function () {
        $scope.loadingVisible = true;
        flightService.getFDPsByYearMonth($scope.selectedYear, $scope.selectedMonth + 1).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_fdp_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.getValidFDPDay = function (pid, year, month, day, callback) {
        $scope.loadingVisible = true;
        flightService.getValidFDPDay(pid, year, month, day).then(function (response) {
            $scope.loadingVisible = false;
            callback(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindValidFDPDay = function () {
        $scope.dg_box_ds = null;
        // $scope._datefdp = e.column.date;
        //$scope.selectedCrewId = e.row.data.Id;
        if (!$scope._datefdp)
            return;
        if (!$scope.selectedCrewId)
            return;
        var date = new Date($scope._datefdp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        $scope.loadingVisible = true;
        $scope.getValidFDPDay($scope.selectedCrewId, year, month, day, function (ds) {
            $scope.dg_box_ds = ds;
        });
    };
    ///////////////////////////////////
    //kar
    $scope.setSbPositionsDs = function (id) {

        var crew = Enumerable.From($scope.crews).Where('$.Id==' + id).FirstOrDefault();
        $scope.sb_position_ds = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault().ds;
        $scope.crew_default_position = $scope.sb_position_ds[0];
    };
    $scope.setSbPositions2Ds = function (id) {

        var crew = Enumerable.From($scope.crews).Where('$.Id==' + id).FirstOrDefault();
        $scope.sb_position2_ds = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault().ds;
        //sook
        $scope.sb_position2_value = $scope.edit_selected_position;
        // $scope.crew_default_position = $scope.sb_position_ds[0];
    };
    $scope.selectedCrewId = null;
    $scope.sb_crew = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        height: 35,
        //width: 150,
        onValueChanged: function (e) {
            if (!e.value) {
                $scope.sb_position_ds = null;
                $scope.dg_box_ds = null;
                return;
            }
            $scope.setSbPositionsDs(e.value);
            $scope.bindValidFDPDay();

            //$scope.IsCockpit = e.value == 'Cockpit';
            //if ($scope.dg_box_keys && $scope.dg_box_keys.length > 0)
            //    $scope.bindValidCrew($scope.dg_box_selected.BoxId, 1, e.value == 'Cockpit' ? 1 : 0);

        },
        bindingOptions: {
            dataSource: 'crews',
            value: 'selectedCrewId',
        }
    };
    $scope.sb_position_ds = null;
    $scope.crew_default_position = null;
    $scope.sb_position = {
        showClearButton: false,
        searchEnabled: false,
        //displayExpr: "ScheduleName",
        //valueExpr: 'Id',
        height: 35,
        //width: 150,
        onValueChanged: function (e) {
            //if (!e.value) {
            //    $scope.dg_crew_ds = null;
            //    return;
            //}

            //$scope.IsCockpit = e.value == 'Cockpit';
            //if ($scope.dg_box_keys && $scope.dg_box_keys.length > 0)
            //    $scope.bindValidCrew($scope.dg_box_selected.BoxId, 1, e.value == 'Cockpit' ? 1 : 0);

        },
        bindingOptions: {
            dataSource: 'sb_position_ds',
            value: 'crew_default_position',
        }
    };

    $scope.sb_position2_value = null;
    $scope.sb_position2_item = null;
    $scope.sb_position2_ds = null;
    $scope.sb_position2 = {
        showClearButton: false,
        searchEnabled: false,
        //displayExpr: "ScheduleName",
        //valueExpr: 'Id',
        height: 35,
        //width: 150,
        onValueChanged: function (e) {


        },
        bindingOptions: {
            dataSource: 'sb_position2_ds',
            value: 'sb_position2_value',
            selectedItem: 'sb_position2_item',
        }
    };
    ///////////////////////////////////
    $scope.popup_crew_visible = false;
    $scope.popup_crew = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 450;
            return w;
        },
        height: function () {
            return $(window).height();
        },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_crew_visible = false; } }, toolbar: 'bottom' },


        ],
        position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            // $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {
            //$scope.crewGroup = 'Cockpit';
            //var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
            //$scope.dg_box_ds = boxes;

            //$scope.dg_box_keys = [];
            //$scope.dg_box_keys.push($scope.selectedBox.BoxId);
            $scope.setSbPositionsDs($scope.selectedCrewId);
            $scope.bindValidFDPDay();


        },
        onHiding: function () {

            //$scope.crewGroup = null;
            //$scope.assignedCrewDs = null;
            //$scope.dg_crew_ds = null;
            //$scope.dg_box_instance.clearSelection();
            $scope.popup_crew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_crew_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            //title: 'FlightsTitle',

        }
    };
    /////////////////////////////////
    $scope.popup_fdp_visible = false;
    $scope.popup_fdp = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 930;
            return w;
        },
        height: function () {
            return $(window).height();
        },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_fdp_visible = false; } }, toolbar: 'bottom' },


        ],
        position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            // $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {
            //$scope.crewGroup = 'Cockpit';
            //var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
            //$scope.dg_box_ds = boxes;

            //$scope.dg_box_keys = [];
            //$scope.dg_box_keys.push($scope.selectedBox.BoxId);
            $scope.bindFDPs();

        },
        onHiding: function () {

            //$scope.crewGroup = null;
            $scope.assignedCrewDs = null;
            $scope.dg_valid_crew_ds = null;
            $scope.dg_fdp_instance.clearSelection();
            $scope.dg_fdp_ds = null;
            $scope.popup_fdp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fdp_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            //title: 'FlightsTitle',

        }
    };
    ////////////////////////////////
    $scope.popup_cal_visible = false;
    $scope.btn_crewlist_visible = false;
    $scope.btn_duties_visible = true;
    $scope.popup_cal = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 1400;
            return w;
        },
        height: function () {
            return $(window).height();
        },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {

                    type: 'default', text: 'Day Off', icon: 'card', onClick: function (arg) {
                        $scope.event_status = 10000;
                        $scope.popup_event_visible = true;
                    }
                }, toolbar: 'bottom'
            },
             {
                 widget: 'dxButton', location: 'after', options: {

                     type: 'default', text: 'Duties', icon: 'card', onClick: function (arg) {
                         $scope.btn_duties_visible = false;
                         $scope.btn_crewlist_visible = true;
                         $scope.dg_calfdp_ds = null;
                         $('.dgcalcrew').fadeOut('200', function () {

                             $('.dgcalfdp').fadeIn('200', function () {

                                 var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
                                 var crewid = $scope.dg_calcrew_selected.Id;
                                 $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);
                             });
                         });


                     }
                 }, toolbar: 'bottom'
             },
             {
                 widget: 'dxButton', location: 'after', options: {

                     type: 'default', text: 'Crew List', icon: 'card', onClick: function (arg) {
                         $scope.btn_crewlist_visible = false;
                         $scope.btn_duties_visible = true;
                         $('.dgcalfdp').fadeOut('200', function () {

                             $('.dgcalcrew').fadeIn('200', function () {

                             });
                         });


                     }
                 }, toolbar: 'bottom'
             },


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_cal_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        //position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            // $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {

            $scope.bind_calcrew();

            $scope.cal_change();
        },
        onHiding: function () {
            $scope.btn_crewlist_visible = false;
            $scope.btn_duties_visible = true;

            $('.dgcalfdp').hide();
            $('.dgcalcrew').show();

            //dlu 
            // $scope.dg_calcrew_instance.clearSelection();
            $scope.cal_crew_ds = [];
            $scope.cal_crew_instance.repaint();

            $scope.popup_cal_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cal_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            //title: 'FlightsTitle',
            'toolbarItems[1].visible': 'btn_duties_visible',
            'toolbarItems[2].visible': 'btn_crewlist_visible',

        }
    };

    //////////////////////////////////////////////
    $scope.FromDateEvent = null;
    $scope.ToDateEvent = null;
    $scope.date_from_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_to_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    //////////////////////////////////////////////
    $scope.event_status = null;
    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    $scope.popup_event = {
        width: 300,
        height: 260,
        position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd2', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var crewid = $scope.selectedCrewId;
                        //////////////////////////////
                        if ($scope.event_status == 10000) {
                            $scope.loadingVisible = true;

                            flightService.IsRERRPValid(crewid, $scope.FromDateEvent, $scope.ToDateEvent).then(function (response) {
                                $scope.loadingVisible = false;

                                if (response) {
                                    General.ShowNotify(response, 'error');
                                }
                                else {
                                    var dto = {
                                        DateStart: new Date($scope.FromDateEvent),
                                        DateEnd: new Date($scope.ToDateEvent),
                                        CityId: -1,
                                        CrewId: crewid,
                                        DutyType: $scope.event_status,

                                    }
                                    $scope.loadingVisible = true;
                                    flightService.saveDutyDetail(dto).then(function (response) {
                                        $scope.loadingVisible = false;
                                        //jiji2
                                        var sm = (new Date($scope.FromDateEvent)).getMonth() + 1;
                                        var em = (new Date($scope.ToDateEvent)).getMonth() + 1;
                                        var date = (new Date($scope.FromDateEvent));
                                        var year = date.getFullYear();
                                        //var bd = (new Date($scope.FromDateEvent)).setHours(0, 0, 0, 0);
                                        //var ed = (new Date($scope.ToDateEvent)).setHours(0, 0, 0, 0);
                                        while (sm <= em) {

                                            //var month = date.getMonth() + 1;
                                            //var day = date.getDate();
                                            ////////////////////////////////////////////
                                            var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + sm).FirstOrDefault();
                                            var res = Enumerable.From(response).Where('$.DateStartYear==' + year + ' && ($.DateStartMonth==' + sm + ' || $.DateEndMonth==' + sm + ')').ToArray();
                                            if (fdps) {
                                                $.each(res, function (_k, _z) {
                                                    fdps.items.push(_z);
                                                });

                                            }
                                            else {
                                                var item = { Year: year, Month: sm };
                                                item.items = [];
                                                //item.items.push(response);
                                                $.each(res, function (_k, _z) {
                                                    item.items.push(_z);
                                                });
                                                $scope.fdps.push(item);
                                            }
                                            sm++;
                                            /////////////////////////////////////////////
                                        }
                                        var curm = $scope.selectedMonth + 1;
                                        var cfdp = Enumerable.From($scope.fdps).Where('$.Year==' + $scope.selectedYear + ' && $.Month==' + curm).FirstOrDefault();

                                        $scope.currentFDPS = cfdp.items;

                                        $scope.dg_timeline_instance.refresh();

                                        $scope.popup_event_visible = false;



                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                }

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        /////////////////////////////////////////
                        if ($scope.event_status == 1167 || $scope.event_status == 1168 || $scope.event_status == 5000 || $scope.event_status == 5001) {
                            $scope.loadingVisible = true;

                            flightService.IsEventValid(crewid, $scope.FromDateEvent, $scope.ToDateEvent, $scope.event_status).then(function (response) {
                                $scope.loadingVisible = false;

                                if (response) {
                                    General.ShowNotify(response, 'error');
                                }
                                else {

                                    var dto = {
                                        DateStart: new Date($scope.FromDateEvent),
                                        DateEnd: new Date($scope.ToDateEvent),
                                        CityId: -1,
                                        CrewId: crewid,
                                        DutyType: $scope.event_status,

                                    }
                                    $scope.loadingVisible = true;
                                    flightService.saveDutyDetail(dto).then(function (response) {
                                        $scope.loadingVisible = false;
                                        //jiji2
                                        var sm = (new Date($scope.FromDateEvent)).getMonth() + 1;
                                        var em = (new Date($scope.ToDateEvent)).getMonth() + 1;
                                        var date = (new Date($scope.FromDateEvent));
                                        var year = date.getFullYear();
                                        //var bd = (new Date($scope.FromDateEvent)).setHours(0, 0, 0, 0);
                                        //var ed = (new Date($scope.ToDateEvent)).setHours(0, 0, 0, 0);
                                        while (sm <= em) {

                                            //var month = date.getMonth() + 1;
                                            //var day = date.getDate();
                                            ////////////////////////////////////////////
                                            var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + sm).FirstOrDefault();
                                            var res = Enumerable.From(response).Where('$.DateStartYear==' + year + ' && ($.DateStartMonth==' + sm + ' || $.DateEndMonth==' + sm + ')').ToArray();
                                            if (fdps) {
                                                $.each(res, function (_k, _z) {
                                                    fdps.items.push(_z);
                                                });

                                            }
                                            else {
                                                var item = { Year: year, Month: sm };
                                                item.items = [];
                                                //item.items.push(response);
                                                $.each(res, function (_k, _z) {
                                                    item.items.push(_z);
                                                });
                                                $scope.fdps.push(item);
                                            }
                                            sm++;
                                            /////////////////////////////////////////////
                                        }
                                        var curm = $scope.selectedMonth + 1;
                                        var cfdp = Enumerable.From($scope.fdps).Where('$.Year==' + $scope.selectedYear + ' && $.Month==' + curm).FirstOrDefault();

                                        $scope.currentFDPS = cfdp.items;

                                        $scope.dg_timeline_instance.refresh();

                                        $scope.popup_event_visible = false;



                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                }

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }


                        //////////////////////////////

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

        },
        onHiding: function () {
            $scope.ToDateEvent = null;
            $scope.FromDateEvent = null;
            $scope.event_status = null;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };

    //close button
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    //////////////////////////////////////////
    $scope.popup_edit_fdp_visible = false;
    $scope.popup_edit_fdp_title = '';
    $scope.popup_edit_fdp = {
        width: 300,
        height: 180,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'edit_fdp', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + $scope.sb_position2_value + '"').FirstOrDefault().id;

                        var dto = { fdp: $scope.edit_selected_dutyId, position: positionId };
                        $scope.loadingVisible = true;

                        flightService.saveUpdateFDPPosition(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            var fdps = Enumerable.From($scope.currentFDPS).Where('$.FDPId==' + $scope.edit_selected_dutyId).ToArray();
                            $.each(fdps, function (_i, _x) {
                                _x.positionId = positionId;
                                _x.Position = $scope.sb_position2_value;
                            });
                            $scope.dg_timeline_instance.refresh();
                            $scope.popup_edit_fdp_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        //////////////////////////////

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
            $scope.setSbPositions2Ds($scope.edit_selected_crewId);
        },
        onHiding: function () {
            $scope.sb_position2_value = null;


        },
        bindingOptions: {
            visible: 'popup_edit_fdp_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_edit_fdp_title',

        }
    };

    //close button
    $scope.popup_edit_fdp.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_edit_fdp_visible = false;

    };
    ///////////////////////////////////////////
    $scope.crewFDPs = [];
    $scope.cal_change = function () {
        if (!$scope.cal_crew_current)
            return;
        if (!$scope.dg_calcrew_selected)
            return;
        var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
        var crewid = $scope.dg_calcrew_selected.Id;
        $scope.getCrewFDPs(prts[0], prts[1] + 1, crewid, function (data) {

            $scope.cal_crew_ds = data;
        });


    };
    $scope.getCrewFDPs = function (year, month, crewid, callback) {

        if (year, month, crewid) {
            var data = Enumerable.From($scope.crewFDPs).Where('$.CrewId==' + crewid + ' && $.DateStartYear==' + year + ' && $.DateStartMonth==' + month).FirstOrDefault();
            if (!data) {
                $scope.loadingVisible = true;
                flightService.getCrewFDPByYearMonth(crewid, year, month).then(function (response) {
                    $scope.loadingVisible = false;
                    var row = {
                        CrewId: crewid,
                        DateStartYear: year,
                        DateStartMonth: month,
                        FDPs: response,
                    };
                    $scope.crewFDPs.push(row);
                    callback(response);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                callback(data.FDPs);
        }
        else callback(null);;
    }


    $scope.fdpCrews = [];
    $scope.bindAssignedCrew = function (data) {
        //mimi
        var cfdp = Enumerable.From($scope.currentFDPS)
                   //.Where('$.CrewId==' + cid + ' && $.CDay==' + cday + ' && $.DateStartMonth==' + cmonth + ' && $.DateStartYear==' + cyear).FirstOrDefault();


                   //.Where('$.CrewId==' + cid + ' && $.CDay<=' + cday + ' && $.DateEndDay>=' + cday + ' && $.DateStartMonth==' + cmonth + ' && $.DateStartYear==' + cyear)
                      .Where(function (x) {
                          return x.TemplateId == data.Id;
                      })
                          .Distinct('$.FDPId').ToArray();


        $scope.assignedCrewDs = cfdp;
        console.log('CFDP');
        console.log(cfdp);

    };
    $scope.assignedCrewDs = [];




    $scope.positions = [
        { title: 'P1', ds: ['Captain', 'FO', 'SO', 'TO'] },
        { title: 'P2', ds: ['FO', 'SO', 'TO'] },
        { title: 'TRI', ds: ['Captain', 'TRI', 'FO', 'SO', 'TO'] },
        { title: 'TRE', ds: ['Captain', 'TRE', 'FO', 'SO', 'TO'] },
        { title: 'LTC', ds: ['Captain', 'TRI', 'TRE', 'FO', 'SO', 'TO'] },

        { title: 'CCM', ds: ['FA'] },
         { title: 'SCCM', ds: ['Purser', 'FA'] },
          { title: 'SCCM(i)', ds: ['SCCM(i)', 'Purser', 'FA'] },
    ];
    $scope.positionIds = [
        { id: 1160, title: 'Captain' }
        , { id: 1161, title: 'FO' }
        , { id: 1162, title: 'SO' }
        , { id: 1163, title: 'TO' }
        , { id: 1205, title: 'TRI' }
        , { id: 1206, title: 'TRE' }
        , { id: 1158, title: 'FA' }
        , { id: 1157, title: 'Purser' }
        , { id: 10002, title: 'SCCM(i)' }

    ];

    $scope.setDefaultPosition = function (crew) {
        var item = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault();

        var position = item.ds[0];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + position + '"').FirstOrDefault().id;
        crew.Position = position;
        crew.PositionId = positionId;
    };
    $scope.getDefaultPosition = function (jobgroup) {
        var item = Enumerable.From($scope.positions).Where('$.title=="' + jobgroup + '"').FirstOrDefault();

        var position = item.ds[0];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + position + '"').FirstOrDefault().id;

        return positionId;
    };
    $scope.removeAssignedCrew = function (fdpId) {

        $scope.removeAssignedFDP(fdpId, function () {
            $scope.assignedCrewDs = Enumerable.From($scope.assignedCrewDs).Where('$.FDPId!=' + fdpId).ToArray();
            $scope.currentFDPS = Enumerable.From($scope.currentFDPS).Where('$.FDPId!=' + fdpId).ToArray();
            $.each($scope.fdps, function (_a, _q) {
                _q.items = Enumerable.From(_q.items).Where('$.FDPId!=' + fdpId).ToArray();
            });
            $scope.dg_timeline_instance.refresh();
        });

        return;

        var dto = { fdp: id };
        $scope.loadingVisible = true;
        flightService.saveDeleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.crewFDPs = [];
            var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + fdpId).FirstOrDefault();
            var crew = Enumerable.From(item.crew).Where('$.CrewId==' + crewid).FirstOrDefault();

            var temp = JSON.parse(JSON.stringify(crew));
            $scope.dg_crew_ds.push(temp);
            $scope.dg_crew_instance.refresh();
            item.crew = Enumerable.From(item.crew).Where('$.CrewId!=' + crewid).ToArray();
            $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.removeAssignedFDP = function (fdpid, callback) {


        var dto = { fdp: fdpid };
        $scope.loadingVisible = true;
        flightService.saveDeleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;

            callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.nextPosition = function (row, fdpid) {
        var fdp = Enumerable.From($scope.currentFDPS).Where('$.FDPId==' + fdpid).ToArray();
        if (!fdp || fdp.length == 0)
            return;
        var jobGroup = fdp[0].JobGroup;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + jobGroup + '"').FirstOrDefault().ds;
        var current = fdp[0].Position;
        var index = positions.indexOf(current);
        if (index >= positions.length - 1)
            index = 0;
        else
            index++;
        var newpos = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + newpos + '"').FirstOrDefault().id;
        row.Position = newpos;
        row.PositionId = positionId;
        $.each(fdp, function (_i, _d) {
            _d.Position = newpos;
            _d.PositionId = positionId;
        });
        $scope.dg_timeline_instance.refresh();

        var dto = { fdp: fdpid, position: positionId };
        $scope.loadingVisible = true;
        flightService.saveUpdateFDPPosition(dto).then(function (response) {
            $scope.loadingVisible = false;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.prePosition = function (row, fdpid) {
        var fdp = Enumerable.From($scope.currentFDPS).Where('$.FDPId==' + fdpid).ToArray();
        if (!fdp || fdp.length == 0)
            return;
        var jobGroup = fdp[0].JobGroup;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + jobGroup + '"').FirstOrDefault().ds;
        var current = fdp[0].Position;
        var index = positions.indexOf(current);
        if (index <= 0)
            index = positions.length - 1;
        else
            index--;
        var newpos = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + newpos + '"').FirstOrDefault().id;
        row.Position = newpos;
        row.PositionId = positionId;
        $.each(fdp, function (_i, _d) {
            _d.Position = newpos;
            _d.PositionId = positionId;
        });
        $scope.dg_timeline_instance.refresh();
        var dto = { fdp: fdpid, position: positionId };
        $scope.loadingVisible = true;
        flightService.saveUpdateFDPPosition(dto).then(function (response) {
            $scope.loadingVisible = false;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        return;
        var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + fdpId).FirstOrDefault();
        var crew = Enumerable.From(item.crew).Where('$.CrewId==' + crewid).FirstOrDefault();
        var current = crew.Position;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault().ds;
        var index = positions.indexOf(current);
        if (index <= 0)
            index = positions.length - 1;
        else
            index--;
        crew.Position = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + crew.Position + '"').FirstOrDefault().id;
        crew.PositionId = positionId;
        $scope.crewFDPs = [];
        if (current != crew.position) {
            var dto = { fdp: id, position: positionId };
            $scope.loadingVisible = true;
            flightService.saveUpdateFDPPosition(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.refreshValidFDP = function () {


        var crewid = $scope.dg_calcrew_selected.Id;
        $scope.dg_calfdp_ds = null;
        var prts = (new Date($scope.cal_crew_current)).getDatePartArray();

        $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);
    };

    $scope.nextCrew = function () {
        var keys = $scope.dg_calcrew_instance.getSelectedRowKeys();
        var index = $scope.dg_calcrew_instance.getRowIndexByKey(keys[0]);
        index++;
        if (!$scope.dg_calcrew_instance.getKeyByRowIndex(index))
            return;
        var arr = [];
        arr.push(index);

        $scope.dg_calcrew_instance.selectRowsByIndexes(arr).done(function (e) {
            if ($scope.btn_crewlist_visible)
                $scope.refreshValidFDP();
        });
    }
    $scope.preCrew = function () {
        var keys = $scope.dg_calcrew_instance.getSelectedRowKeys();
        var index = $scope.dg_calcrew_instance.getRowIndexByKey(keys[0]);
        index--;
        if (!$scope.dg_calcrew_instance.getKeyByRowIndex(index))
            return;
        var arr = [];
        arr.push(index);

        $scope.dg_calcrew_instance.selectRowsByIndexes(arr).done(function (e) {
            if ($scope.btn_crewlist_visible)
                $scope.refreshValidFDP();
        });
    }
    /////////////////////////
    $scope.nextPosition2 = function (duty) {

        var current = duty.Position;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + $scope.dg_calcrew_selected.JobGroup + '"').FirstOrDefault().ds;
        var index = positions.indexOf(current);
        if (index >= positions.length - 1)
            index = 0;
        else
            index++;
        duty.Position = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + duty.Position + '"').FirstOrDefault().id;
        duty.PositionId = positionId;
        $scope.fdpCrews = [];
        var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
        $.each(boxes, function (_i, _d) {
            _d.Synced = false;
        });
        if (current != duty.position) {
            var dto = { fdp: duty.Id, position: positionId };
            $scope.loadingVisible = true;

            flightService.saveUpdateFDPPosition(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.prePosition2 = function (duty) {

        var current = duty.Position;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + $scope.dg_calcrew_selected.JobGroup + '"').FirstOrDefault().ds;
        var index = positions.indexOf(current);
        if (index <= 0)
            index = positions.length - 1;
        else
            index--;
        duty.Position = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + duty.Position + '"').FirstOrDefault().id;
        duty.PositionId = positionId;
        $scope.fdpCrews = [];
        var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
        $.each(boxes, function (_i, _d) {
            _d.Synced = false;
        });
        if (current != duty.position) {
            var dto = { fdp: duty.Id, position: positionId };
            $scope.loadingVisible = true;
            flightService.saveUpdateFDPPosition(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };

    /////////////////////////
    $scope.bind_calcrew = function () {
        var url = 'odata/crew/ordered/group/' + Config.CustomerId;

        if (!$scope.dg_calcrew_ds)
            $scope.dg_calcrew_ds = {
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

                        //$scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        //$rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "GroupOrder", desc: false }, { getter: "JobGroup", desc: false }, { getter: "ScheduleName", desc: false }],

            };


    };
    ////////////////////////////////
    $scope.addCrew = function (crewrow) {
        //pipi
        var fdpid = $scope.dg_fdp_selected.Id;
        var crewid = crewrow.data.Id;
        var positionId = $scope.getDefaultPosition(crewrow.data.JobGroup);
        var dto = { fdp: fdpid, crew: crewid, position: positionId, stby: crewrow.data.StandById };
        
        $scope.loadingVisible = true
        flightService.saveAssignFDPToCrew2Detail(dto).then(function (response) {
            $scope.loadingVisible = false;
            if (!response || response.length == 0)
                return;
             
            $scope.dg_fdp_selected.MatchingListErrors = response[0].MatchingListErrors;
            $scope.dg_fdp_selected.MaleFemaleError = response[0].MaleFemaleError;
            var year = (new Date(response[0].DutyStartLocal)).getFullYear();
            var sm = (new Date(response[0].DutyStartLocal)).getMonth() + 1;
            var em = (new Date(response[0].DutyEndLocal)).getMonth() + 1;
            while (sm <= em) {
                var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + sm).FirstOrDefault();
                var res = Enumerable.From(response).Where('$.DateStartYear==' + year + ' && ($.DateStartMonth==' + sm + ' || $.DateEndMonth==' + sm + ')').ToArray();
                if (fdps) {
                    $.each(res, function (_k, _z) {
                        fdps.items.push(_z);
                    });

                }
                else {
                    var item = { Year: year, Month: sm };
                    item.items = [];
                    //item.items.push(response);
                    $.each(res, function (_k, _z) {
                        item.items.push(_z);
                    });
                    $scope.fdps.push(item);
                }
                sm++;
            }
            var curm = $scope.selectedMonth + 1;
            var cfdp = Enumerable.From($scope.fdps).Where('$.Year==' + $scope.selectedYear + ' && $.Month==' + curm).FirstOrDefault();

            $scope.currentFDPS = cfdp.items;
            $scope.bindAssignedCrew($scope.dg_fdp_selected);
            $scope.dg_timeline_instance.refresh();

            $scope.dg_valid_crew_ds = Enumerable.From($scope.dg_valid_crew_ds).Where('$.Id!=' + crewid).ToArray();
            $scope.dg_valid_crew_instance.refresh();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //alert(fdpid + '   ' + crewid);
        //console.log(crewrow);
        //ati

        return;
        var crewid = $(this).data("id");
        // alert(crewid);
        var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + $scope.dg_box_selected.BoxId).FirstOrDefault();
        if (!item) {
            item = {
                Id: $scope.dg_box_selected.BoxId,
                crew: [],
            };
            $scope.fdpCrews.push(item);
        }
        var crew = Enumerable.From($scope.dg_crew_ds).Where('$.Id==' + crewid).FirstOrDefault();
        var temp = JSON.parse(JSON.stringify(crew));
        temp.CrewId = crewid;
        $scope.setDefaultPosition(temp);
        temp.fdpId = item.Id;

        var dto = { fdp: item.Id, crew: crewid, position: temp.PositionId };
        $scope.loadingVisible = true;
        flightService.saveAssignFDPToCrew(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.crewFDPs = [];
            temp.Id = response.Id;
            item.crew.push(temp);
            $scope.dg_crew_ds = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
            $scope.dg_crew_instance.refresh();
            $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
            $scope.dg_box_selected.HasCrew = true;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.addFDP = function (fdprow) {
        //e.preventDefault();
        var fdp = fdprow.row.data;
        var fdpid = fdp.Id;


        var crewid = $scope.selectedCrewId;
        var posid = Enumerable.From($scope.positionIds).Where('$.title=="' + $scope.crew_default_position + '"').FirstOrDefault().id;
        var dto = { fdp: fdpid, crew: crewid, position: posid, stby: fdp.StandById };
        
        $scope.loadingVisible = true
        flightService.saveAssignFDPToCrew2Detail(dto).then(function (response) {
            $scope.loadingVisible = false;
            ///////////////////////////
            var date = new Date($scope._datefdp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + month).FirstOrDefault();
            if (fdps) {
                $.each(response, function (_k, _z) {
                    fdps.items.push(_z);
                });

            }
            else {
                var item = { Year: year, Month: month };
                item.items = [];
                //item.items.push(response);
                $.each(response, function (_k, _z) {
                    item.items.push(_z);
                });
                $scope.fdps.push(item);
            }

            $scope.currentFDPS = fdps.items;

            $scope.dg_timeline_instance.refresh();

            ///////////////////////////
            $scope.bindValidFDPDay();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    /////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {
        var h = $(window).height() - 139 - 50 + 20;
        $('#dg_container').height(h);

        $('.crewassign2').fadeIn(400, function () {
        });

        $(document).on("click", ".addCrew", function (e) {
            e.preventDefault();
            var crewid = $(this).data("id");
            // alert(crewid);
            var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + $scope.dg_box_selected.BoxId).FirstOrDefault();
            if (!item) {
                item = {
                    Id: $scope.dg_box_selected.BoxId,
                    crew: [],
                };
                $scope.fdpCrews.push(item);
            }
            var crew = Enumerable.From($scope.dg_crew_ds).Where('$.Id==' + crewid).FirstOrDefault();
            var temp = JSON.parse(JSON.stringify(crew));
            temp.CrewId = crewid;
            $scope.setDefaultPosition(temp);
            temp.fdpId = item.Id;

            var dto = { fdp: item.Id, crew: crewid, position: temp.PositionId };
            $scope.loadingVisible = true;
            flightService.saveAssignFDPToCrew(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.crewFDPs = [];
                temp.Id = response.Id;
                item.crew.push(temp);
                $scope.dg_crew_ds = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
                $scope.dg_crew_instance.refresh();
                $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
                $scope.dg_box_selected.HasCrew = true;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });
        $(document).on("click", ".addFDP2", function (e) {
            e.preventDefault();
            var fdpid = $(this).data("id");
            var crewid = $scope.selectedCrewId;
            var posid = Enumerable.From($scope.positionIds).Where('$.title=="' + $scope.crew_default_position + '"').FirstOrDefault().id;
            var dto = { fdp: fdpid, crew: crewid, position: posid };
            $scope.loadingVisible = true
            flightService.saveAssignFDPToCrew2Detail(dto).then(function (response) {
                $scope.loadingVisible = false;
                ///////////////////////////
                var date = new Date($scope._datefdp);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var fdps = Enumerable.From($scope.fdps).Where('$.Year==' + year + ' && $.Month==' + month).FirstOrDefault();
                if (fdps) {
                    fdps.items.push(response);
                }
                else {
                    var item = { Year: year, Month: month };
                    item.items = [];
                    item.items.push(response);
                    $scope.fdps.push(item);
                }
                $scope.currentFDPS = fdps;
                $scope.dg_timeline_instance.refresh();

                ///////////////////////////
                $scope.bindValidFDPDay();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            return;
            var fdp = Enumerable.From($scope.dg_calfdp_ds).Where('$.Id==' + fdpid).FirstOrDefault();

            var dto = { fdp: fdp.Id, crew: crewid, position: posid };
            $scope.loadingVisible = true;
            flightService.saveAssignFDPToCrew2(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.fdpCrews = [];
                var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
                $.each(boxes, function (_i, _d) {
                    _d.Synced = false;
                });
                $scope.cal_crew_ds.push(response);
                $scope.cal_crew_instance.repaint();

                $scope.dg_calfdp_ds = null;
                var prts = (new Date($scope.cal_crew_current)).getDatePartArray();

                $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            ///////////////////////////////////////////////////////////////


            //var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + $scope.dg_box_selected.BoxId).FirstOrDefault();
            //if (!item) {
            //    item = {
            //        Id: $scope.dg_box_selected.BoxId,
            //        crew: [],
            //    };
            //    $scope.fdpCrews.push(item);
            //}
            //var crew = Enumerable.From($scope.dg_crew_ds).Where('$.Id==' + crewid).FirstOrDefault();
            //var temp = JSON.parse(JSON.stringify(crew));
            //temp.CrewId = crewid;
            //$scope.setDefaultPosition(temp);
            //temp.fdpId = item.Id;
            
            //var dto = { fdp: item.Id, crew: crewid, position: temp.PositionId };
            //$scope.loadingVisible = true;
            //flightService.saveAssignFDPToCrew(dto).then(function (response) {
            //    $scope.loadingVisible = false;
            //    temp.Id = response.Id;
            //    item.crew.push(temp);
            //    $scope.dg_crew_ds = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
            //    $scope.dg_crew_instance.refresh();
            //    $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
            //    $scope.dg_box_selected.HasCrew = true;
            //    console.log($scope.fdpCrews);

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });
        $(document).on("click", ".xati", function () {

            var id = $(this).data("id");
            var $element = $('#task-' + id).parent();

            var data = Enumerable.From($scope.dataSource).Where('$.Id==' + id).FirstOrDefault();
            var isBox = data.IsBox;
            var BoxId = data.BoxId;
            if (!isBox) {
                if ($element.hasClass('flight-item-selected')) {
                    $scope.selectedIds = Enumerable.From($scope.selectedIds).Where('$!=' + id).ToArray();
                    $scope.selectedItems = Enumerable.From($scope.selectedItems).Where('$.Id!=' + id).ToArray();
                }
                else {
                    $scope.selectedIds.push(id);
                    $scope.selectedItems.push(data);
                }
                $('#task-' + id).parent().toggleClass('nobox').toggleClass('flight-item-selected');
                $scope.selectedIdsChanged();
                // $scope.dataSource = Enumerable.From($scope.dataSource).Where('$.Id!=' + id).ToArray();
            }
            else {
                //  $('#task-' + id).parent().toggleClass('box').toggleClass('flight-item-selected');
                $scope.$apply(function () {
                    $scope.selectedBox = data;
                    $scope.selectedBoxId = data.BoxId;
                });

            }






        });


    });

    $rootScope.$broadcast('FlightLoaded', null);


}]);