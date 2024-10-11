app.controller('crewassignController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    try {


        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Crew';
            //  $('#resourceGantt').height($(window).height() - 45 - 100);


        }

        $scope.prms = $routeParams.prms;
        $scope.IsCockpit = $route.current.isCockpit ? 1 : 0;


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
        $scope.selectedTabDateIndex = -1;
        $scope.tabsdatefirst = true;
        $scope.$watch("selectedTabDateIndex", function (newValue) {

            try {

                if ($scope.selectedTabDateIndex == -1)
                    return;
                $scope.selectedTab = $scope.tabs_date[newValue];

                $scope.selectedDate = new Date($scope.selectedTab.date);

                // $scope.StopNowLineTimer();
                $scope.createGantt();





            }
            catch (e) {
                alert('e1');
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
        /////////////////////////////////////


        $scope.btn_search = {
            //text: 'Search',
            type: 'success',
            icon: 'search',
            width: 40,
            validationGroup: 'assigncrewdate',
            bindingOptions: {},
            onClick: function (e) {
                var result = e.validationGroup.validate();

                if (!result.isValid) {
                    General.ShowNotify(Config.Text_FillRequired, 'error');
                    return;
                }
                $scope.fdpCrews = [];
                $scope.dg_calcrew_ds = null;
                $scope.dg_box_ds = null;
                $scope.assignedCrewDs = null;
                $scope.dg_calfdp_ds = null;
                $scope.cal_crew_ds = null;
                $scope.BeginSearch();

            }

        };
        $scope._datefrom = new Date();


        $scope.date_from = {
            type: "date",
            placeholder: 'From',
            width: '100%',
            displayFormat: "yyyy-MM-dd",
            bindingOptions: {
                value: '_datefrom',

            }
        };
        $scope.days_count = 14;
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
            $scope.cal_crew_current = General.getDayFirstHour(new Date($scope._datefrom));
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
               


                $scope.btn_crew_disabled = false;
                ////////////////////
                $scope.tabsdatefirst = true;
                $scope.tabs_date = [];
                var i;

                for (i = 1; i <= $scope.days_count; i++) {
                    var str = moment(stdate).format("ddd DD-MMM-YYYY");
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
                //doodool

                $scope.createGantt();
                // ganttObj = $("#resourceGanttba").data("ejGantt");

                //ganttObj._refreshDataSource($scope.dataSource);

                $scope.selectedBox = null;
                $scope.selectedBoxId = null;
                $scope.selectedIds = [];
                $scope.selectedItems = [];


            });



        };

        $scope.bindPosFlights = function (callback) {
            var _df = new Date(General.getDayFirstHour(new Date($scope.selectedDate)));
            var _dt = new Date(General.getDayLastHour(new Date($scope.selectedDate)));


            var offset = -1 * (new Date()).getTimezoneOffset();
            var stdate = new Date($scope._datefrom);
            var endate = new Date(stdate.addDays($scope.days_count - 1));
            $scope.plansDto = {
                CustomerId: 1,
                Date: new Date(_df.ToUTC()),
                DateTo: new Date(_dt.ToUTC()),
                Offset: offset,

            };

            $scope.loadingVisible = true;
            flightService.getFlights($scope.plansDto).then(function (response) {
                $scope.loadingVisible = false;

                callback(response);

            });
        };

        $scope.bindFlightCrews = function (id,callback) {
           

            $scope.loadingVisible = true;
            flightService.getFlightCrews(id).then(function (response) {
                $scope.loadingVisible = false;

                callback(response);

            });
        };

        $scope.bindFlightFDPs = function (id, callback) {


            
            flightService.getFlightFDPs(id).then(function (response) {
                 

                callback(response);

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
            var _d2 = (new Date($scope.selectedDate)).addDays(1);
            var _df = General.getDayFirstHour(new Date($scope.selectedDate));
            var _dt = General.getDayLastHour(_d2);



            // groupCollection: $scope.resourceGroups,
            // resources: $scope.resources, //resourceGanttResources,

            var _resources = Enumerable.From($scope.resources)//.Where('$.resourceId==378').ToArray();
             .Where(function (x) {
                 var _ds = new Date(x.DutyStartLocal);
                 var _de = new Date(x.DutyEndLocal);
                 return (_ds >= _df && _ds <= _dt) || (_de >= _df && _de <= _dt);
             }).ToArray();

            console.log('groups');
            console.log($scope.resourceGroups);

            console.log(_resources);

            var _data = Enumerable.From($scope.dataSource).Where(function (x) {
                var _ds = new Date(x.DutyStartLocal);
                var _de = new Date(x.DutyEndLocal);
                return (_ds >= _df && _ds <= _dt) || (_de >= _df && _de <= _dt);
            }).ToArray();
            console.log('_data');
            console.log(_data);

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
                dataSource: _data, //$scope.dataSource, //self.datasource, //resourceGanttData,
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
                resources: _resources, //$scope.resources, //resourceGanttResources,
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
                    position: 140,
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

                load: function () {

                    $scope.ganttCreated = true;
                    this.getColumns()[0].width = 140;

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
                      //  $('.e-scrollbar.e-js.e-widget.e-hscrollbar').remove();
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
                //kar
                enableContextMenu: true,
                contextMenuItems: [
                   // { text: 'Information', target: '.e-content', id: 'collapserow' },

                ],
                contextMenuClick: function (args) {

                },
                contextMenuOpen: function (args) {
                   
                    if (args.item.eResourceTaskType != "resourceChildTask") {
                        args.cancel = true;
                        return;
                    }

                    var flightId = -1;
                    var $target = $(args.targetElement.target);
                    
                    if ($target.hasClass('div-flight')) {
                        flightId = $target.data('flightid');
                    } else
                    {
                        var $flight = $target.closest(".div-flight");
                        flightId = $flight.data('flightid');
                         
                            
                       
                    }
                    
                    var item = args.item.item;
                     



                    if (!item.IsBox) {
                        args.cancel = true;
                        return;
                    }
                    if (flightId) {
                        args.contextMenuItems = [{
                            headerText: 'Flight Crews', menuId: 'flightcrews', eventHandler: function (e) {
                                
                                 $scope.$apply(function () {
                                     $scope.popup_fc_visible = true;
                                 });
                            }
                        }];
                    }
                    else {
                        args.contextMenuItems = [{
                            headerText: 'Information', menuId: 'information', eventHandler: function (e) {

                            }
                        }];
                    }
                   
                    // console.log(args);
                    //args.stopImmediatePropagation();
                    //args.stopPropagation();
                    //var record = args.rowData;
                    //if (args.type !== 'Header') {
                    //    if (!record.hasChildRecords) {
                    //        args.hideItems.push('Collapse the Row');
                    //        args.hideItems.push('Expand the Row');
                    //    } else {
                    //        if (record.expanded) {
                    //            args.hideItems.push("Expand the Row");
                    //        } else {
                    //            args.hideItems.push("Collapse the Row");
                    //        }
                    //    }
                    //}
                }

            });
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
            try {
                $scope.selectedBoxChanged();
            }
            catch (e) {
                alert('e2');
                alert(e);
            }

        });

        ///////////////////////////////
        $scope.btn_box = {
            //text: 'Add FDP',
            type: 'default',
            icon: 'plus',
            width: 40,

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
                if (!dto.cid)
                    dto.cid = -1;
                $scope.loadingVisible = true;
                flightService.boxItems(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.rebind();

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }

        };
        $scope.btn_unbox = {
           // text: 'Remove FDP',
            type: 'danger',
           icon: 'close',
            width: 40,

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
        $scope.btn_crew_disabled = true;
        $scope.btn_crew = {
            text: 'Assign Crew',
            type: 'default',
            icon: 'group',
            width: 160,
            bindingOptions: {
                disabled: 'btn_crew_disabled'
            },
            onClick: function (e) {
                //if (!$scope.selectedBox) {
                //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                //    return;
                //}
                //if ($scope.selectedBox.WOCLError == 1) {
                //    General.ShowNotify('WOCL Error', 'error');
                //    return;
                //}
                //if ($scope.selectedBox.IsDutyOver == 1) {
                //    General.ShowNotify('Over Duty Error', 'error');
                //    return;
                //}

                $scope.popup_crew_visible = true;
            }

        };
        $scope.btn_cal = {
            text: 'Calendar',
            type: 'default',
            icon: 'event',
            width: 140,

            onClick: function (e) {


                $scope.popup_cal_visible = true;
            }

        };
        $scope.btn_details = {
            text: 'Details',
            type: 'default',
            icon: 'event',
            width: 120,

            onClick: function (e) {
                if (!$scope.selectedBox) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                //var dto = { id: $scope.selectedBox.BoxId };
                $scope.popup_fdp_details_visible = true;
            }

        };
        $scope.btn_pos = {
            text: 'Positioning',
            type: 'default',
            icon: 'map',
            width: 160,

            onClick: function (e) {

                //var dto = { id: $scope.selectedBox.BoxId };
                $scope.popup_pos_visible = true;
            }

        };

        $scope.btn_fc = {
            text: 'Flight Crews',
            type: 'default',
            icon: 'airplane',
            width: 170,

            onClick: function (e) {

                //var dto = { id: $scope.selectedBox.BoxId };
                $scope.popup_fc_visible = true;
            }

        };
        //////////////////////////////

        $scope.crewGroup = $scope.IsCockpit ? 'Cockpit' : 'Cabin';
        $scope.sb_cabin = {
            showClearButton: false,
            searchEnabled: false,

            height: 35,
            //width: 150,
            disabled: true,
            dataSource: ['Cockpit', 'Cabin'],
            onValueChanged: function (e) {
                if (!e.value) {
                    $scope.dg_crew_ds = null;
                    return;
                }

                // $scope.IsCockpit = e.value == 'Cockpit';
                if ($scope.dg_box_keys && $scope.dg_box_keys.length > 0)
                    $scope.bindValidCrew($scope.dg_box_selected.BoxId, 1, e.value == 'Cockpit' ? 1 : 0);

            },
            bindingOptions: {

                value: 'crewGroup',
            }
        };
        /////////////////////////////////////
        $scope.dg_crew_columns = [

           { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
            { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
            {
                dataField: "Id", caption: '',
                width: 70,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: 'addCrewTemplate',
                //cellTemplate: function (container, options) {

                //    $("<div>")
                //        .append("<a   data-id='" + options.value + "'  href='' class='addCrew w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none;padding:5px 16px !important;'>Add</a>")
                //        .appendTo(container);


                //},
                //fixed: true, fixedPosition: 'right',
            },

        ];
        $scope.dg_crew_selected = null;
        $scope.dg_crew_instance = null;
        $scope.dg_crew_ds = null;
        $scope.dg_crew = {
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
            height: function () {
                return $(window).height() - 200 - 160;
            },

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
            onRowPrepared: function (e) {
                if (e.data && e.data.StandById!=-1)
                    e.rowElement.css('background', '#ffff80');

            },

            bindingOptions: {
                dataSource: 'dg_crew_ds',

            }
        };
        ///////////////////////////////////////
        $scope.dg_fcrew_columns = [
            {
                caption: 'Crew', columns: [
                     { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
                    { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                    { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                    { dataField: 'FDPTitle', caption: 'FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
                     { dataField: 'Sex', caption: 'Gender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                    //{ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                   
                    


                ]
            },
           

        ];
        $scope.dg_fcrew_selected = null;
        $scope.dg_fcrew_instance = null;
        $scope.dg_fcrew_ds = null;
        $scope.dg_fcrew = {
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
                return $(window).height() - 370;
            },

            columns: $scope.dg_fcrew_columns,
            onContentReady: function (e) {
                if (!$scope.dg_fcrew_instance)
                    $scope.dg_fcrew_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_fcrew_selected = null;

                }
                else {
                    $scope.dg_fcrew_selected = data;

                }
            },
            onRowPrepared: function (e) {
                if (e.data && e.data.IsPositioning )
                    e.rowElement.css('background', '#ffccff');

            },

            bindingOptions: {
                dataSource: 'dg_fcrew_ds',

            }
        };
        ///////////////////////////////////////
        $scope.dg_ffdp_columns = [
           {
               caption: 'FDPs', columns: [
                   { dataField: 'FDPTitle', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                  // { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                   { dataField: 'DutyStartLocal', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
                       { dataField: 'DutyEndLocal', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
               ]
           },


        ];
        $scope.dg_ffdp_selected = null;
        $scope.dg_ffdp_instance = null;
        $scope.dg_ffdp_ds = null;
        $scope.dg_ffdp = {
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
                return   250;
            },

            columns: $scope.dg_ffdp_columns,
            onContentReady: function (e) {
                if (!$scope.dg_ffdp_instance)
                    $scope.dg_ffdp_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_ffdp_selected = null;

                }
                else {
                    $scope.dg_ffdp_selected = data;

                }
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },

            bindingOptions: {
                dataSource: 'dg_ffdp_ds',

            }
        };
        ///////////////////////////////////////
        $scope.dg_box_columns = [
          // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
         //   { dataField: 'DutyStartLocal', caption: 'Start', allowResizing: true, alignment: 'center', allowEditing: false, width: 100 },
         { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },


        ];
        $scope.dg_box_selected = null;
        $scope.dg_box_instance = null;
        $scope.dg_box_ds = null;
        $scope.dg_box_keys = null;
        $scope.dg_box = {
            keyExpr: 'BoxId',
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
                return $(window).height() - 115;
            },

            columns: $scope.dg_box_columns,
            onContentReady: function (e) {
                if (!$scope.dg_box_instance)
                    $scope.dg_box_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_box_selected = null;
                    $scope.assignedCrewDs = null;

                }
                else {
                    $scope.dg_box_selected = data;
                    $scope.bindAssignedCrew(data);


                    $scope.dg_crew_ds = null;

                    $scope.bindValidCrew(data.BoxId, 1, $scope.IsCockpit ? 1 : 0);

                    //alert(data.BoxId);

                }
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },

            bindingOptions: {
                dataSource: 'dg_box_ds',
                selectedRowKeys: 'dg_box_keys',

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
                  cellTemplate: 'addFDPTemplate',
                  //    function (container, options) {

                  //    $("<div>")
                  //        .append("<a   data-id='" + options.value + "'  href='' class='addFDP w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none;padding:5px 0px !important;border-radius:50%;text-align:center'>+</a>")
                  //        .appendTo(container);


                  //},

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
                if (e.data && e.data.StandById != -1)
                    e.rowElement.css('background', '#ffff80');

            },

            bindingOptions: {
                dataSource: 'dg_calfdp_ds',

            }
        };

        /////////////////////////////////////////
        $scope.cal_crew_current = new Date();
        $scope.$watch('cal_crew_current', function (newValue, oldValue, scope) {
            //  alert(newValue);
            try {
                $scope.cal_change();
            }
            catch (e) {
                alert('e3');
                alert(e);
            }

        });
        //dlu
        $scope.assign1168 = function (e) {

            $scope.event_status = 1168;
            $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
            $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
            $scope.popup_event_title = 'StandBy AM';
            $scope.popup_event_visible = true;
        };
        $scope.assign1167 = function (e) {
            $scope.event_status = 1167;
            $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(12, 0, 0, 0);
            $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
            $scope.popup_event_title = 'StandBy PM';
            $scope.popup_event_visible = true;
        };
        $scope.assign5000 = function (e) {
            $scope.event_status = 5000;
            $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
            $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
            $scope.popup_event_title = 'Training';
            $scope.popup_event_visible = true;
        };
        $scope.assign5001 = function (e) {
            $scope.event_status = 5001;
            $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
            $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
            $scope.popup_event_title = 'Office';
            $scope.popup_event_visible = true;
        };
        $scope.assign10000 = function (e) {
            $scope.event_status = 10000;
            $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
            $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(12);
            $scope.popup_event_title = 'Day Off';
            $scope.popup_event_visible = true;
        };
        $scope.cellContextMenuItems = [
             { text: 'Assign Day Off', onItemClick: $scope.assign10000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Day Off</td></tr></table>", },
           { text: 'Assign Stan By AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>", },
           { text: 'Assign Stan By PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>", },

             { text: 'Assign Office', onItemClick: $scope.assign5001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Office</td></tr></table>", },
               { text: 'Assign Training', onItemClick: $scope.assign5000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Training</td></tr></table>", },

        ];
        $scope.cellContextMenuOptions = {
            target: ".dx-scheduler-date-table-cell",
            dataSource: $scope.cellContextMenuItems,
            width: 200,
            onShowing: function (e) {
                if (!$scope.dg_calcrew_selected)
                    e.cancel = true;
                //$scope.contextMenuCellData
                var cdate = new Date($scope.contextMenuCellData.startDate);
                var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
                var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
                if (cdate >= bdate && cdate <= edate)
                    e.cancel = true;
            },
            onItemClick: function (e) {
                if (!$scope.dg_calcrew_selected)
                    return;
                e.itemData.onItemClick(e.itemData);
            }
        };
        $scope.cal_crew_ds = null;
        $scope.cal_crew_instance = null;
        $scope.cal_crew = {
            //dataSource: data,
            editing: {
                allowAdding: false,
                allowDeleting: false,
                allowDragging: false,
                allowResizing: false,
                allowUpdating: false,
            },
            textExpr: 'Flights',
            startDateExpr: 'DutyStartLocal',
            endDateExpr: 'DutyEndLocal',
            views: ["month", "day"],
            currentView: "month",
            startDayHour: 0,
            appointmentTemplate: 'appointmentTemplate',
            appointmentTooltipTemplate: "tooltip-template",
            dataCellTemplate: 'dataCellTemplate',
            height: function () {
                return $(window).height() - 115 - 31;
            },
            onContentReady: function (e) {
                if (!$scope.cal_crew_instance) {
                    $scope.cal_crew_instance = e.component;

                    // alert($scope.cal_crew_instance);
                }

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
            onAppointmentDblClick: function (e) {
                e.cancel = true;
                return;
            },
            onCellContextMenu: function (e) {


                $scope.contextMenuCellData = e.cellData;
            },
            bindingOptions: {
                currentDate: 'cal_crew_current',
                dataSource: 'cal_crew_ds',
                //currentDate: '_datefromcal',

            }
        };
        $scope.getDutyClass = function (duty) {
            switch (duty.DutyType) {
                case 1165:
                    return 'duty-1165';
                default:
                    return 'duty-' + duty.DutyType;
            }
        };
        $scope.getCaption = function (duty) {
            switch (duty.DutyType) {
                case 5000:
                    return 'TRN';
                case 5001:
                    return 'OFC';
                case 1167:
                    return 'PM';
                case 1168:
                    return 'AM';
                case 10000:
                    return 'OFF';
                default:
                    return 'DTY';
            }
        };
        $scope.getDataCellTemplateClass = function (duty) {
            //kar
            if (!$scope.dg_calcrew_selected)
                return "";
            var cdate = new Date(duty.startDate);
            var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
            var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
            if (cdate >= bdate && cdate <= edate)
                return 'inactive-cell';
            return "";
        };
        $scope.getPosition = function (position) {
            //pati new
            switch (position) {
                case 'Captain':
                    return 'CPT';
                case 'Purser':
                    return 'PU';
                case 'Purser2':
                    return 'PU2';
                case 'Purser3':
                    return 'PU3';
                case 'SCCM(i)':
                    return 'SCI';
                case 'ISCCM':
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
                $scope.dg_crew_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        $scope.bindValidPosCrew = function (fdp, isvalid, cockpit) {
            $scope.loadingVisible = true;
            flightService.getValidCrew(fdp, isvalid, cockpit).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_pos_crew_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        $scope.bindValidFDP = function (pid, year, month) {
            $scope.loadingVisible = true;
            flightService.getValidFDP(pid, year, month).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_calfdp_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        ///////////////////////////////////
        $scope.popup_crew_visible = false;
        $scope.popup_crew = {
            width: function () {
                //var w = $(window).width() / 3;
                //if (w > 650)
                var w = 850;
                return w;
            },
            height: function () {
                return $(window).height();
            },
            fullScreen: false,
            showTitle: true,
            dragEnabled: true,
            toolbarItems: [
                {
                    widget: 'dxButton', location: 'before', options: {

                        type: 'default', text: 'Profile', icon: 'card', onClick: function (arg) {
                            //if (!$scope.dg_crew2_selected)
                            //    return;
                            //var eid = $scope.dg_crew2_selected.Id;
                            //$rootScope.$broadcast('InitViewPerson', $scope.dg_crew2_selected);
                            //console.log($scope.dg_box_instance.getSelectedRowKeys());


                        }
                    }, toolbar: 'bottom'
                },


                { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_crew_visible = false; } }, toolbar: 'bottom' },


            ],
            position: 'right',
            visible: false,

            closeOnOutsideClick: false,
            onShowing: function (e) {

                // $scope.dg_crew2_instance.repaint();


            },
            onShown: function (e) {
                $scope.crewGroup = $scope.IsCockpit ? 'Cockpit' : 'Cabin';
                var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').OrderBy('$.STD').ToArray();

                $scope.dg_box_ds = boxes;
                //var keys = [$scope.selectedBox.BoxId];
                // $scope.dg_box_instance.selectRows(keys, false);
                // console.log($scope.dg_box_instance.getSelectedRowKeys());
                $scope.dg_box_keys = [];
                $scope.dg_box_keys.push($scope.selectedBox.BoxId);



            },
            onHiding: function () {

                $scope.crewGroup = null;
                $scope.assignedCrewDs = null;
                $scope.dg_crew_ds = null;
                $scope.dg_box_instance.clearSelection();
                //var ganttObj = $("#resourceGanttba").data("ejGantt");
                //ganttObj._refreshDataSource($scope.dataSource);
                $scope.createGantt();
                $scope.popup_crew_visible = false;

            },
            bindingOptions: {
                visible: 'popup_crew_visible',
                //width: 'pop_width',
                //height: 'pop_height',
                //title: 'FlightsTitle',

            }
        };
        ////////////////////////////////
        $scope.dg_details_columns = [
             { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
             {
                 dataField: 'Id', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,
                 cellTemplate: 'detailTemplate',
             }

        ];
        $scope.dg_details_selected = null;
        $scope.dg_details_instance = null;
        $scope.dg_details_ds = null;

        $scope.dg_details = {

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
            //columnMinWidth: 100,
            // columnAutoWidth: true,

            height: '480',

            columns: $scope.dg_details_columns,
            onContentReady: function (e) {
                if (!$scope.dg_details_instance)
                    $scope.dg_details_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_details_selected = null;

                }
                else {
                    $scope.dg_details_selected = data;

                }
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },
            onCellPrepared: function (cellInfo) {

            },
            bindingOptions: {
                dataSource: 'dg_details_ds',

            }
        };
        ///////////////////////////////////
        $scope.dg_pos_crew_columns = [

           { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
            { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
            {
                dataField: "Id", caption: '',
                width: 70,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: 'addPosCrewTemplate',
                
            },

        ];
        $scope.dg_pos_crew_selected = null;
        $scope.dg_pos_crew_instance = null;
        $scope.dg_pos_crew_ds = null;
        $scope.dg_pos_crew = {
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
                // return $(window).height() - 200 - 160;
                return $(window).height() - 330;
            },

            columns: $scope.dg_pos_crew_columns,
            onContentReady: function (e) {
                if (!$scope.dg_pos_crew_instance)
                    $scope.dg_pos_crew_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_pos_crew_selected = null;

                }
                else {
                    $scope.dg_pos_crew_selected = data;

                }
            },
            onRowPrepared: function (e) {
                if (e.data && e.data.StandById != -1)
                    e.rowElement.css('background', '#ffff80');

            },

            bindingOptions: {
                dataSource: 'dg_pos_crew_ds',

            }
        };

        ////////////////////////////////////
        $scope.dg_pos_flights_columns = [
            {
                caption: 'Positioning Flights', columns: [
                     { dataField: 'taskName', caption: 'Flight', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                      { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                          { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                      { dataField: 'DepartureLocal', caption: 'Departure', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
                       { dataField: 'ArrivalLocal', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },

                ]
            }

          

        ];
        $scope.dg_pos_flights_selected = null;
        $scope.dg_pos_flights_instance = null;
        $scope.dg_pos_flights_ds = null;

        $scope.dg_pos_flights = {

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
            selection: { mode: 'multiple' },
            //columnMinWidth: 100,
            // columnAutoWidth: true,

            height: function () {
                return $(window).height() - 400;
            },

            columns: $scope.dg_pos_flights_columns,
            onContentReady: function (e) {
                if (!$scope.dg_pos_flights_instance)
                    $scope.dg_pos_flights_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData;
                $scope.dg_pos_flights_selected = data;
                var ids = Enumerable.From(data).Select('$.ID').ToArray();
                $scope.dg_main_flights_ds = Enumerable.From($scope.posFlights)
            .Where(function (x) {
                var _id = x.ID;

                return ids.indexOf(_id) == -1;
            }).ToArray();

                //pool
                //if (!data) {
                //    $scope.dg_details_selected = null;

                //}
                //else {
                //    $scope.dg_details_selected = data;

                //}
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },
            onCellPrepared: function (cellInfo) {

            },
            bindingOptions: {
                dataSource: 'dg_pos_flights_ds',

            }
        };

        /////////////////////////////////////

        $scope.dg_main_flights_columns = [
          {
              caption: 'Main Flights', columns: [
                   { dataField: 'taskName', caption: 'Flight', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                    { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                    { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                      { dataField: 'DepartureLocal', caption: 'Departure', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
                       { dataField: 'ArrivalLocal', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
              ]
          }

           //{
           //    dataField: 'Id', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,
           //    cellTemplate: 'detailTemplate',
           //}

        ];
        $scope.dg_main_flights_selected = null;
        $scope.dg_main_flights_instance = null;
        $scope.dg_main_flights_ds = null;

        $scope.dg_main_flights = {

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
            selection: { mode: 'multiple' },
            //columnMinWidth: 100,
            // columnAutoWidth: true,

            height: function () {
                return 270;
            },

            columns: $scope.dg_main_flights_columns,
            onContentReady: function (e) {
                if (!$scope.dg_main_flights_instance)
                    $scope.dg_main_flights_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData;
                $scope.dg_main_flights_selected = data;
                var ids = Enumerable.From(data).Select('$.ID').ToArray();
                $scope.dg_pos_flights_ds = Enumerable.From($scope.posFlights)
            .Where(function (x) {
                var _id = x.ID;

                return ids.indexOf(_id) == -1;
            }).ToArray();
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },
            onCellPrepared: function (cellInfo) {

            },
            bindingOptions: {
                dataSource: 'dg_main_flights_ds',

            }
        };

        /////////////////////////////////////
        $scope.dg_fc_columns = [
           {
               caption: 'Flights', columns: [
                    {
                        dataField: 'MatchingListErrors', caption: 'ML', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 35,
                        cellTemplate: function (container, options) {
                            if (options.value > 0) {
                                $("<div>")
                                 .append('<i class="fas fa-puzzle-piece" style="font-size:13px;position: relative;left:0px;top:-1px;color:red"></i>')

                                .appendTo(container);
                            }



                        },
                    },
          {
              dataField: 'MaleFemalError', caption: 'MF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 37,
              cellTemplate: function (container, options) {
                  if (options.value > 0) {
                      $("<div>")
                       .append('<i class="fas fa-restroom" style="font-size:13px;position: relative;left:-2px;top:-1px;color:red"></i>')
                           //.append('<i class="fas fa-female" style="font-size:12px;position: relative;left:-2px;top:-1px;color:red"></i>')

                      .appendTo(container);
                  }



              },
          },
                    { dataField: 'taskName', caption: 'Flight', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
                     { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                         { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                     { dataField: 'DepartureLocal', caption: 'Departure', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },
                      { dataField: 'ArrivalLocal', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170 },

               ]
           }



        ];
        $scope.dg_fc_selected = null;
        $scope.dg_fc_instance = null;
        $scope.dg_fc_ds = null;

        $scope.dg_fc = {

            onCellClick: function (e) {

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
            //columnMinWidth: 100,
            // columnAutoWidth: true,

            height: function () {
                return $(window).height() - 115;
            },

            columns: $scope.dg_fc_columns,
            onContentReady: function (e) {
                if (!$scope.dg_fc_instance)
                    $scope.dg_fc_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                //pool
                if (!data) {
                    $scope.dg_fc_selected = null;
                    $scope.dg_fcrew_ds = null;
                    $scope.dg_ffdp_ds = null;
                }
                else {
                    $scope.dg_fc_selected = data;
                    $scope.bindFlightCrews(data.ID, function (ds1) {
                        $scope.dg_fcrew_ds = ds1;
                        $scope.bindFlightFDPs(data.ID, function (ds2) {
                            $scope.dg_ffdp_ds = ds2;
                        });
                    });

                }
            },
            onRowPrepared: function (e) {
                //if (e.data && e.data.AvailabilityId != 1)
                //    e.rowElement.css('background', '#ffcccc');

            },
            onCellPrepared: function (cellInfo) {

            },
            bindingOptions: {
                dataSource: 'dg_fc_ds',

            }
        };

        ///////////////////////////////////////
        $scope.on_visible = false;
        $scope.off_visible = false;
        $scope.getTileFlightClass = function (row) {
            var cls = "tile-flight off";
            if (!row.IsOff)
                cls = "tile-flight on";
            if (row.selected == true)
                cls += " selected";
            return cls;
        };
        $scope.selectedTileFlight = null;
        $scope.tileFlightClicked = function (data) {
            var ds = $scope.dg_details_ds;

            $.each(ds, function (_i, row) {
                $.each(row.Items, function (_j, _x) {
                    if (_x.Id != data.Id)
                        _x.selected = false;
                })
            });
            data.selected = !data.selected;
            $scope.on_visible = false;
            $scope.off_visible = false;
            if (data.selected && !data.IsCanceled) {
                $scope.on_visible = data.IsOff;
                $scope.off_visible = !data.IsOff;
                $scope.selectedTileFlight = data;
            }
        };
        $scope.popup_fdp_details_visible = false;
        $scope.popup_fdp_details = {
            width: function () {
                //var w = $(window).width() / 3;
                //if (w > 650)
                var w = 1100;
                return w;
            },
            height: function () {
                //return $(window).height();
                return 600;
            },
            fullScreen: false,
            showTitle: true,
            dragEnabled: true,
            toolbarItems: [
                {
                    widget: 'dxButton', location: 'before', options: {

                        type: 'default', text: 'Notify',   onClick: function (arg) {
                             
                            $scope.loadingVisible = true;
                            flightService.notifyFDPCrew($scope.selectedBoxId).then(function (response) {
                                $scope.loadingVisible = false;

                                General.ShowNotify(Config.Text_SavedOk, 'success');

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                    }, toolbar: 'bottom'
                },

                 {
                     widget: 'dxButton', location: 'after', options: {

                         type: 'default', text: 'On', icon: 'airplane', onClick: function (arg) {
                             $scope.selectedTileFlight.IsOff = null;

                             $scope.on_visible = $scope.selectedTileFlight.IsOff;
                             $scope.off_visible = !$scope.selectedTileFlight.IsOff;

                         }
                     }, toolbar: 'bottom'
                 },
                  {
                      widget: 'dxButton', location: 'after', options: {

                          type: 'default', text: 'Off', icon: 'airplane', onClick: function (arg) {

                              $scope.selectedTileFlight.IsOff = true;

                              $scope.on_visible = $scope.selectedTileFlight.IsOff;
                              $scope.off_visible = !$scope.selectedTileFlight.IsOff;
                          }
                      }, toolbar: 'bottom'
                  },
                    {
                        widget: 'dxButton', location: 'after', options: {

                            type: 'success', text: 'Save', icon: 'save', onClick: function (arg) {

                                var entity = [];
                                $.each($scope.dg_details_ds, function (_i, _row) {
                                    var items = Enumerable.From(_row.Items).Where('$.IsOff!=$._IsOff').ToArray();
                                    if (items.length > 0) {
                                        var row = {};
                                        row.FDPId = _row.Id;
                                        var fis = [];
                                        $.each(items, function (_j, _x) {
                                            var _off = !_x.IsOff ? false : true;
                                            var x = { FDPItem: _x.Id, Off: _off };
                                            fis.push(x);
                                        });
                                        row.Items = fis;
                                        entity.push(row);
                                    }
                                });

                                if (entity.length > 0) {
                                    $scope.loadingVisible = true;
                                    flightService.offFlights(entity, function () {
                                        $scope.loadingVisible = false;

                                        $scope.popup_fdp_details_visible = false;
                                    });



                                    ///////////////////
                                }

                            }
                        }, toolbar: 'bottom'
                    },

                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                            $scope.popup_fdp_details_visible = false;
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

                //$scope.selectedBox = data;
                //$scope.selectedBoxId = data.BoxId;
                $scope.loadingVisible = true;
                flightService.getFDPChildren($scope.selectedBoxId).then(function (response) {
                    $scope.loadingVisible = false;

                    $.each(response.children, function (_i, _d) {
                        $.each(_d.Items, function (_j, _e) {
                            _e.selected = false;
                            _e._IsOff = _e.IsOff;
                        });
                    });
                    $scope.dg_details_ds = response.children;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            },
            onHiding: function () {

                $scope.popup_fdp_details_visible = false;

            },
            bindingOptions: {
                visible: 'popup_fdp_details_visible',
                'toolbarItems[1].visible': 'on_visible',
                'toolbarItems[2].visible': 'off_visible',

            }
        };
        ////////////////////////////////
        $scope.popup_pos_visible = false;
        $scope.posFDP = null;
        $scope.posFDPSaved = false;
        $scope.popup_pos = {
            width: function () {
                var w = $(window).width();
                //if (w > 650)
                //var w = 1200;
                return w;
            },
            height: function () {
                return $(window).height();
                // return 600;
            },
            fullScreen: false,
            showTitle: true,
            dragEnabled: true,
            toolbarItems: [


                 {
                     widget: 'dxButton', location: 'before', options: {

                         type: 'default', text: 'Create FDP', icon: 'airplane', onClick: function (arg) {

                             //$scope.dg_main_flights_selected
                             var _ids = [];
                             var _posIds = [];
                             $.each($scope.dg_pos_flights_selected, function (_i, _d) {
                                 _ids.push(_d.ID);
                                 _posIds.push(_d.ID);
                             });
                             $.each($scope.dg_main_flights_selected, function (_i, _d) {
                                 _ids.push(_d.ID);
                             });
                             var dto = { ids: _ids, cid: -1,posIds:_posIds };
                             $scope.loadingVisible = true;
                             flightService.createFDP(dto).then(function (response) {
                                 $scope.loadingVisible = false;
                                 $scope.posFDP = response;
                                 $scope.posFDPSaved = false;

                                 $scope.dg_pos_crew_ds = null;

                                 $scope.bindValidPosCrew($scope.posFDP.Id, 1, $scope.IsCockpit ? 1 : 0);

                             }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                         }
                     }, toolbar: 'bottom'
                 },
                   
                    {
                        widget: 'dxButton', location: 'after', options: {

                            type: 'success', text: 'Save', icon: 'save', onClick: function (arg) {

                                if ($scope.assignedPosCrewDs && $scope.assignedPosCrewDs.length > 0) {
                                    var items = [];
                                    $.each($scope.assignedPosCrewDs, function (_i, _d) {
                                        var dto = { fdp: _d.fdpId, crew: _d.CrewId, position: _d.PositionId, stby:_d.StandById };
                                        items.push(dto);
                                    });
                                    
                                    $scope.loadingVisible = true;
                                    flightService.saveAssignFDPToCrews(items).then(function (_response) {
                                        
                                        $scope.loadingVisible = false;
                                        $scope.crewFDPs = [];
                                        $scope.posFDPSaved = true;
                                        $scope.popup_pos_visible = false;

                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                }

                            }
                        }, toolbar: 'bottom'
                    },

                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                            $scope.popup_pos_visible = false;
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
                $scope.bindPosFlights(function (fs) {
                    $scope.posFlights = fs;
                    var ds1 = Enumerable.From(fs).ToArray();
                    var ds2 = Enumerable.From(fs).ToArray();
                    $scope.dg_pos_flights_ds = ds1;
                    $scope.dg_main_flights_ds = ds2;
                });

                //$scope.loadingVisible = true;
                //flightService.getFDPChildren($scope.selectedBoxId).then(function (response) {
                //    $scope.loadingVisible = false;

                //    $.each(response.children, function (_i, _d) {
                //        $.each(_d.Items, function (_j, _e) {
                //            _e.selected = false;
                //            _e._IsOff = _e.IsOff;
                //        });
                //    });
                //    $scope.dg_details_ds = response.children;

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            },
            onHiding: function () {

                if (!$scope.posFDPSaved && $scope.posFDP) {
                    var dto = { id: $scope.posFDP.Id };
                    
                    flightService.unboxItems(dto).then(function (response) {
                        $scope.posFDP = null;
                        $scope.posFDPSaved = false;
                        $scope.dg_pos_flights_ds = null;
                        $scope.dg_main_flights_ds = null;
                        $scope.dg_main_flights_selected = null;
                        $scope.dg_pos_flights_selected = null;

                        $scope.popup_pos_visible = false;
                       
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }
                else
                {
                    $scope.posFDP = null;
                    $scope.posFDPSaved = false;
                    $scope.dg_pos_flights_ds = null;
                    $scope.dg_main_flights_ds = null;
                    $scope.dg_main_flights_selected = null;
                    $scope.dg_pos_flights_selected = null;
                    $scope.rebind();
                    $scope.popup_pos_visible = false;
                }
               

            },
            bindingOptions: {
                visible: 'popup_pos_visible',
               

            }
        };
        ////////////////////////////////
        $scope.popup_fc_visible = false;
        
        $scope.popup_fc = {
            width: function () {
                var w = $(window).width();
                //if (w > 650)
                //var w = 1200;
                return w;
            },
            height: function () {
                return $(window).height();
                // return 600;
            },
            fullScreen: false,
            showTitle: true,
            dragEnabled: true,
            toolbarItems: [

 

                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                            $scope.popup_fc_visible = false;
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
                $scope.bindPosFlights(function (fs) {
                   
                    $scope.dg_fc_ds = fs;
                   
                });

               

            },
            onHiding: function () {
                $scope.dg_fc_ds = [];
                $scope.popup_fc_visible = false;
                 

            },
            bindingOptions: {
                visible: 'popup_fc_visible',


            }
        };

        //////////////////////////////////
        $scope.popup_cal_visible = false;
        $scope.btn_crewlist_visible = false;
        $scope.btn_duties_visible = true;
        var downloads = ["Download Trial For Visual Studio", "Download Trial For All Platforms", "Package Managers"];
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

                //{
                //    widget: 'dxButton', location: 'after', options: {

                //        type: 'default', text: 'Day Off', icon: 'card', onClick: function (arg) {
                //            $scope.event_status = 10000;
                //            $scope.popup_event_visible = true;
                //        }
                //    }, toolbar: 'bottom'
                //},
                 {
                     widget: 'dxButton', location: 'after', options: {

                         type: 'default', text: 'FDPs', icon: 'airplane', onClick: function (arg) {
                             $scope.btn_duties_visible = false;
                             $scope.btn_crewlist_visible = true;
                             $scope.dg_calfdp_ds = null;
                             $('.dgcalcrew').fadeOut('200', function () {

                                 $('.dgcalfdp').fadeIn('200', function () {

                                     var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
                                     if ($scope.dg_calcrew_selected) {
                                         var crewid = $scope.dg_calcrew_selected.Id;
                                         $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);
                                     }

                                 });
                             });


                         }
                     }, toolbar: 'bottom'
                 },
                 {
                     widget: 'dxButton', location: 'after', options: {

                         type: 'default', text: 'Crew List', icon: 'group', onClick: function (arg) {
                             $scope.btn_crewlist_visible = false;
                             $scope.btn_duties_visible = true;
                             $('.dgcalfdp').fadeOut('200', function () {

                                 $('.dgcalcrew').fadeIn('200', function () {

                                 });
                             });


                         }
                     }, toolbar: 'bottom'
                 },

                  //{



                  //    widget: 'dxDropDownButton', location: 'after', options: {
                  //        type: 'default',
                  //        text: "Assign Duty",
                  //        icon: "save",
                  //        dropDownOptions: {
                  //            width: 230
                  //        },
                  //        onItemClick: function (e) {
                  //            DevExpress.ui.notify("Download " + e.itemData, "success", 600);
                  //        },
                  //        items: downloads
                  //    }, toolbar: 'bottom'
                  //},
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
                if ($scope.cal_crew_instance)
                    $scope.cal_crew_instance.repaint();
                $scope.rebind();
                $scope.popup_cal_visible = false;

            },
            bindingOptions: {
                visible: 'popup_cal_visible',
                //width: 'pop_width',
                //height: 'pop_height',
                //title: 'FlightsTitle',
                'toolbarItems[0].visible': 'btn_duties_visible',
                'toolbarItems[1].visible': 'btn_crewlist_visible',

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
                            var crewid = $scope.dg_calcrew_selected.Id;
                            //////////////////////////////
                            if ($scope.event_status == 10000) {
                                $scope.loadingVisible = true;

                                flightService.IsRERRPValid(crewid, new Date($scope.FromDateEvent), new Date($scope.ToDateEvent)).then(function (response) {
                                    $scope.loadingVisible = false;

                                    if (false) {
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
                                        flightService.saveDuty(dto).then(function (response) {
                                            $scope.loadingVisible = false;
                                            $scope.fdpCrews = [];
                                            var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
                                            $.each(boxes, function (_i, _d) {
                                                _d.Synced = false;
                                            });
                                            $scope.cal_crew_ds.push(response);
                                            $scope.cal_crew_instance.repaint();
                                            $scope.popup_event_visible = false;

                                            if ($scope.btn_crewlist_visible)
                                                $scope.refreshValidFDP();

                                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                    }

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                            }
                            ///////////////////////////////////
                            if ($scope.event_status == 1167 || $scope.event_status == 1168 || $scope.event_status == 5000 || $scope.event_status == 5001) {
                                $scope.loadingVisible = true;

                                flightService.IsEventValid(crewid, new Date($scope.FromDateEvent), new Date($scope.ToDateEvent), $scope.event_status).then(function (response) {
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
                                        flightService.saveDuty(dto).then(function (response) {
                                            $scope.loadingVisible = false;
                                            $scope.fdpCrews = [];
                                            var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
                                            $.each(boxes, function (_i, _d) {
                                                _d.Synced = false;
                                            });
                                            $scope.cal_crew_ds.push(response);
                                            $scope.cal_crew_instance.repaint();
                                            $scope.popup_event_visible = false;

                                            if ($scope.btn_crewlist_visible)
                                                $scope.refreshValidFDP();

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
            var fdp = data.BoxId;
            if (!data.HasCrew) {
                $scope.assignedCrewDs = null;

                return;
            }
            if (data.Synced) {
                var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + fdp).FirstOrDefault();
                $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
                return;
            }
            flightService.getFDPAssignedCrew(fdp).then(function (response) {
                data.Synced = true;
                if (response && response.length > 0) {

                    var item = {
                        Id: fdp,
                        crew: [],
                    };
                    $scope.fdpCrews.push(item);

                    $.each(response, function (_i, _d) {
                        _d.fdpId = item.Id;
                        item.crew.push(_d);
                    });
                    $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();

                }


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };
        $scope.assignedCrewDs = [];

        $scope.assignedPosCrewDs = [];



        //pati new
        $scope.positions = [
            { title: 'P1', ds: ['Captain', 'FO',    'OBSP1'] },
            { title: 'P2', ds: ['FO', 'SO',  'OBSP2'] },
            { title: 'TRI', ds: ['Captain', 'TRI', 'FO', 'SO', 'TO'] },
            { title: 'TRE', ds: ['Captain', 'TRE', 'FO', 'SO', 'TO'] },
            { title: 'LTC', ds: ['Captain', 'TRI', 'TRE', 'FO', 'SO', 'TO'] },

            { title: 'CCM', ds: ['FA','OBS','Check'] },
             { title: 'SCCM', ds: ['Purser',  'Purser2', 'Purser3','OBS','Check'] },
              { title: 'SCCM(i)', ds: ['SCCM(i)', 'Purser', 'Purser2', 'Purser3'] },
                { title: 'ISCCM', ds: ['ISCCM', 'Purser', 'Purser2', 'Purser3'] },
        ];
        //pati new
        $scope.positionIds = [
            { id: 1160, title: 'Captain' }
            , { id: 1161, title: 'FO' }
            , { id: 1162, title: 'SO' }
            , { id: 1163, title: 'OBSP1' }
             , { id: 1164, title: 'OBSP2' }
            , { id: 1205, title: 'TRI' }
            , { id: 1206, title: 'TRE' }
             , { id: 1153, title: 'OBS' }
              , { id: 1154, title: 'Check' }
            , { id: 1158, title: 'FA' }
            , { id: 1157, title: 'Purser' }
            , { id: 1156, title: 'Purser2' }
            , { id: 1155, title: 'Purser3' }
             , { id: 10002, title: 'ISCCM' }

        ];
        //pati new
        $scope.IsCockpitCrew = function (row) {
            if (row.Position == 'Purser' || row.Position == 'Purser2' || row.Position == 'Purser3'
                || row.Position == 'FA' || row.Position == 'OBS' || row.Position == 'Check'
                || row.Position == 'SCCM(i)'
                 || row.Position == 'ISCCM'
                )
                return false;
            return true;
        };
        $scope.IsCrewTileEditable = function (row) {
            var c1 = $scope.IsCockpitCrew(row);
            var c2 = $scope.IsCockpit ? true : false;
            return c1 == c2;
        };
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
        $scope.addFDP = function (_fdp) {
            var fdpid = _fdp.data.Id;
            var fdp = Enumerable.From($scope.dg_calfdp_ds).Where('$.Id==' + fdpid).FirstOrDefault();
            var crewid = $scope.dg_calcrew_selected.Id;
            var posid = $scope.getDefaultPosition($scope.dg_calcrew_selected.JobGroup);
            var dto = { fdp: fdp.Id, crew: crewid, position: posid,stby:fdp.StandById };
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
        };
        $scope.addCrew = function (_crew) {
            var crewid = _crew.data.Id;; //$(this).data("id");

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

            var dto = { fdp: item.Id, crew: crewid, position: temp.PositionId, stby: temp.StandById };
           
            $scope.loadingVisible = true;
            flightService.saveAssignFDPToCrew(dto).then(function (_response) {
                var response = _response.fdp;


                $scope.loadingVisible = false;
                $scope.crewFDPs = [];
                temp.Id = response.Id;
                item.crew.push(temp);
                $scope.dg_crew_ds = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
                $scope.dg_crew_instance.refresh();
                //jiji
                $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
                $scope.dg_box_selected.HasCrew = true;
                // $scope.dg_box_selected.MaleFemalError = 1;
                //console.log('male female');
                // console.log($scope.dg_box_selected);
                var female = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 31).Count();
                var male = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 30).Count();

                if (male == 0 || female == 0)
                    $scope.dg_box_selected.MaleFemalError = 1;
                else
                    $scope.dg_box_selected.MaleFemalError = 0;
                $scope.dg_box_selected.MatchingListError = _response.matchingError;
                $.each($scope.dg_box_selected.BoxItems, function (_j, _f) {
                    _f.MaleFemalError = $scope.dg_box_selected.MaleFemalError;
                    _f.MatchingListError = $scope.dg_box_selected.MatchingListError;
                });


                // console.log('box ds');
                // console.log($scope.dg_box_ds);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        $scope.posFDPCrews = [];
        $scope.addPosCrew = function (_crew) {
            var crewid = _crew.data.Id;; //$(this).data("id");

            var item = Enumerable.From($scope.posFDPCrews).Where('$.Id==' + $scope.posFDP.Id).FirstOrDefault();
            if (!item) {
                item = {
                    Id: $scope.posFDP.Id,
                    crew: [],
                };
                $scope.posFDPCrews.push(item);
            }
            var crew = Enumerable.From($scope.dg_pos_crew_ds).Where('$.Id==' + crewid).FirstOrDefault();
            var temp = JSON.parse(JSON.stringify(crew));
            temp.CrewId = crewid;
            $scope.setDefaultPosition(temp);
            temp.fdpId = item.Id;
            temp.Id = item.crew.length + 1;
            item.crew.push(temp);
            $scope.dg_pos_crew_ds = Enumerable.From($scope.dg_pos_crew_ds).Where('$.Id!=' + crewid).ToArray();
            $scope.dg_pos_crew_instance.refresh();
            console.log('assigned crew');
            console.log(temp);
            $scope.assignedPosCrewDs = Enumerable.From(item.crew).ToArray();
           
        };


        $scope.removeAssignedCrew = function (id, fdpId, crewid) {
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
                //jiji

                $scope.dg_box_selected.HasCrew = $scope.assignedCrewDs.length > 0;

                var female = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 31).Count();
                var male = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 30).Count();
                if (male == 0 || female == 0)
                    $scope.dg_box_selected.MaleFemalError = 1;
                else
                    $scope.dg_box_selected.MaleFemalError = 0;
                $scope.dg_box_selected.MatchingListError = response.matchingError;



                $.each($scope.dg_box_selected.BoxItems, function (_j, _f) {
                    _f.MaleFemalError = $scope.dg_box_selected.MaleFemalError;
                    _f.MatchingListError = $scope.dg_box_selected.MatchingListError;
                });





            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };

        $scope.removeAssignedPosCrew = function (id, fdpId, crewid) {
            var item = Enumerable.From($scope.posFDPCrews).Where('$.Id==' + fdpId).FirstOrDefault();
            var crew = Enumerable.From(item.crew).Where('$.CrewId==' + crewid).FirstOrDefault();
            var temp = JSON.parse(JSON.stringify(crew));
            $scope.dg_pos_crew_ds.push(temp);
            $scope.dg_pos_crew_instance.refresh();
            item.crew = Enumerable.From(item.crew).Where('$.CrewId!=' + crewid).ToArray();
            $scope.assignedPosCrewDs = Enumerable.From(item.crew).ToArray();

             

        };

        $scope.removeAssignedFDP = function (duty) {


            var dto = { fdp: duty.Id };
            $scope.loadingVisible = true;
            flightService.saveDeleteFDP(dto).then(function (response) {
                $scope.loadingVisible = false;

                $scope.fdpCrews = [];
                var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
                $.each(boxes, function (_i, _d) {
                    _d.Synced = false;
                });

                $scope.cal_crew_instance.deleteAppointment(duty);
                $scope.cal_crew_instance.hideAppointmentTooltip();
                if ($scope.btn_crewlist_visible)
                    $scope.refreshValidFDP();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        };
        $scope.nextPosition = function (id, fdpId, crewid) {
            var item = Enumerable.From($scope.fdpCrews).Where('$.Id==' + fdpId).FirstOrDefault();
            var crew = Enumerable.From(item.crew).Where('$.CrewId==' + crewid).FirstOrDefault();
            var current = crew.Position;
            var positions = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault().ds;
            var index = positions.indexOf(current);
            if (index >= positions.length - 1)
                index = 0;
            else
                index++;
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
        $scope.prePosition = function (id, fdpId, crewid) {
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


        $scope.nextPosPosition = function (id, fdpId, crewid) {
            var item = Enumerable.From($scope.posFDPCrews).Where('$.Id==' + fdpId).FirstOrDefault();
            var crew = Enumerable.From(item.crew).Where('$.CrewId==' + crewid).FirstOrDefault();
            var current = crew.Position;
            var positions = Enumerable.From($scope.positions).Where('$.title=="' + crew.JobGroup + '"').FirstOrDefault().ds;
            var index = positions.indexOf(current);
            if (index >= positions.length - 1)
                index = 0;
            else
                index++;
            crew.Position = positions[index];
            var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + crew.Position + '"').FirstOrDefault().id;
            crew.PositionId = positionId;
            //$scope.crewFDPs = [];
            //if (current != crew.position) {
            //    var dto = { fdp: id, position: positionId };
            //    $scope.loadingVisible = true;

            //    flightService.saveUpdateFDPPosition(dto).then(function (response) {
            //        $scope.loadingVisible = false;


            //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //}
        };
        $scope.prePosPosition = function (id, fdpId, crewid) {
            var item = Enumerable.From($scope.posFDPCrews).Where('$.Id==' + fdpId).FirstOrDefault();
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
            //$scope.crewFDPs = [];
            //if (current != crew.position) {
            //    var dto = { fdp: id, position: positionId };
            //    $scope.loadingVisible = true;
            //    flightService.saveUpdateFDPPosition(dto).then(function (response) {
            //        $scope.loadingVisible = false;


            //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //}
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
            var str = $scope.IsCockpit ? 'cockpit' : 'cabin';
            var url = 'odata/crew/valid/' + str + '/ordered/group/' + Config.CustomerId;

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

        $scope.$on('$viewContentLoaded', function () {


            $('.crewassign').fadeIn(400, function () {
            });

            $(document).on("click", "._addCrew", function (e) {
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
                    //jiji
                    $scope.assignedCrewDs = Enumerable.From(item.crew).ToArray();
                    $scope.dg_box_selected.HasCrew = true;
                    // $scope.dg_box_selected.MaleFemalError = 1;
                    //console.log('male female');
                    // console.log($scope.dg_box_selected);
                    var female = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 31).Count();
                    var male = Enumerable.From($scope.assignedCrewDs).Where('$.SexId==' + 30).Count();


                    $scope.dg_box_selected.MaleFemalError = 1;


                    // console.log('box ds');
                    // console.log($scope.dg_box_ds);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            });
            $(document).on("click", "._addFDP", function (e) {
                e.preventDefault();
                var fdpid = $(this).data("id");
                var fdp = Enumerable.From($scope.dg_calfdp_ds).Where('$.Id==' + fdpid).FirstOrDefault();
                var crewid = $scope.dg_calcrew_selected.Id;
                var posid = $scope.getDefaultPosition($scope.dg_calcrew_selected.JobGroup);
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

    }
    catch (e) {
        alert(e);
    }



}]);