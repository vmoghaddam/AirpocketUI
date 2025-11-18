'use strict';
app.controller('flightDesignController', ['$scope', '$location', 'flightService', 'aircraftService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, flightService, aircraftService, authService, $routeParams, $rootScope) {
    $scope.Day0 = "01/31/2019";
    $scope.Day1 = "02/01/2019";
    $scope.Day2 = "02/02/2019 23:59:00.000";
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.scroll = 0;
    $scope.addSelectedFlight = function (item) {
         
       
        if (!$scope.selectedFlight) {
            $scope.selectedFlight =  item;

        }
        else {
            $scope.selectedFlight = null;
        }
        console.log($scope.selectedFlight);

    };
    var vmins;

    var viewModel = function () {
        var self = this;
        self.flightData = ko.observable();
        self.details = 'vahid';
        self.startDate = ko.observable(new Date($scope.Day1));
        self.endDate = ko.observable(new Date($scope.Day2));
        self.flights = ko.observable([]);
        self.resourceGroups = ko.observable([]);
        self.resources = ko.observableArray([]);
        self.viewType = ko.observable(ej.Gantt.ViewType.ResourceView);
        self.height = ko.observable("300px");
        self.datasource = ko.observableArray([]);
        self.selectedTask = ko.observable();
        self.selectedTaskData = ko.observable();
        self.gantt_option = {

            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,

            taskbarClick: function (args) {
                console.log('taskbarClick');
                 
                $scope.addSelectedFlight(args.data.item);
                //$scope.selectedFlight = args.data.item;
            },
            dataSource: [], //self.datasource, //resourceGanttData,
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
            groupCollection: self.resourceGroups,
            resources: self.resources, //resourceGanttResources,
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
            scheduleStartDate: self.startDate,
            scheduleEndDate: self.endDate,
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
                
               
                //console.log($scope.tempFlight);

                if ($scope.tempFlight)
                    $scope.addFlight($scope.tempFlight);
                
                $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX($scope.scroll); //.scrollLeft(1000)  ;

            },
            //selectionType: ej.Gantt.SelectionType.Single,

            rowSelected: function (args) {
                //$scope.selectedFlight = args.data;
                //console.log(args);
                //console.log(args.data);


            },
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
            rowDataBound: function (args) {
                // console.log('row');
                // console.log(args.data);
                if (args.data.eResourceTaskType == "resourceTask") {
                    // args.cancel = true;
                    //   $(args.rowElement).hide();
                }
            },
            beginEdit: function (args) {

            },


            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Hour,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
                timescaleUnitSize: "255%"
            },
            //// taskbarBackground: "red",
            taskbarTemplate: "#taskbarTemplate",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: self.viewType,
            sizeSettings: { height: self.height },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
        };
        self.test = ko.observable("vahid");

        self.date_takeoff = ko.observable();
        self.date_takeoff_options = ko.observable({
            type: "datetime",
            value: self.date_takeoff
        });


        ///////////////////
        //self.selectedRowIndex = ko.observable(2);
        //self.splitterposition = ko.observable("50%");
        //self.dataSource = ko.observableArray(Knockoutdata);
        //self.rowSelected = ko.observable(rowSelected);
        //self.rowHeight= ko.observable(window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 30);
        //self.load = ko.observable(load);

        ////////////////////////
    };


    /////////////////////////////

    $scope.entity = {
        Id: -1,
        FlightPlanId: null,
        TypeId: null,
        RegisterID: null,
        FlightTypeID: null,
        AirlineOperatorsID: null,
        FlightNumber: null,
        FromAirport: null,
        ToAirport: null,
        STD: null,
        STA: null,
        FlightH: null,
        FlightM: null,
        Unknown: null,
        RouteId:null,

    };
    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        // $scope.entity.FlightPlanId = null;
        $scope.entity.TypeId = null;
        $scope.entity.RegisterID = null;
        $scope.entity.FlightTypeID = null;
        // $scope.entity.AirlineOperatorsID = null;
        $scope.entity.FlightNumber = null;
        $scope.entity.FromAirport = null;
        $scope.entity.ToAirport = null;
        $scope.entity.STD = null;
        $scope.entity.STA = null;
        $scope.entity.FlightH = null;
        $scope.entity.FlightM = null;
        $scope.entity.Unknown = null;
        $scope.start = null;
        $scope.entity.RouteId = null;
    };
    $scope.refreshEntity = function () {
        $scope.entity.Id = null;



        $scope.entity.FlightTypeID = null;
        $scope.entity.AirlineOperatorsID = null;
        $scope.entity.FlightNumber = null;
        $scope.entity.FromAirport = $scope.entity.ToAirport;
        $scope.entity.ToAirport = null;
        $scope.entity.STD = $scope.entity.STA;
        $scope.start = $scope.entity.STD;
        $scope.entity.STA = null;
        $scope.entity.FlightH = null;
        $scope.entity.FlightM = null;
        $scope.entity.Unknown = null;
        $scope.entity.RouteId = null;

    };
    $scope.selectedFlight = null;
     $scope.tempToAirport = null;
    $scope.InitUpdate = function () {


        var data = Enumerable.From(vmins.datasource()).Where("$.taskId==" + $scope.selectedFlight.taskId).FirstOrDefault();

        if (data) {
            $scope.entity.Id = data.Id;
            $scope.entity.FlightNumber = data.FlightNumber;
            $scope.entity.FlightTypeID = data.FlightTypeID;
            $scope.entity.FromAirport = data.FromAirport;
            $scope.entity.ToAirport = data.ToAirport;
            $scope.tempToAirport = data.ToAirport;
            $scope.entity.TypeId = data.TypeId;
            $scope.entity.RegisterID = data.RegisterID;
            $scope.start =new Date(data.STD);
            $scope.entity.FlightH = data.FlightH;
            $scope.entity.FlightM = data.FlightM;
            $scope.entity.STA =new Date( data.STA);
            $scope.entity.STD =new Date( data.STD);
            $scope.IsNew = false;
            $scope.popup_item_title = 'Update';
            $scope.popup_item_visible = true;
            $scope.entity.status = data.status;
            $scope.entity.initStatus = data.initStatus;
            $scope.entity.isnew = false;
            

        }

    };
    /////////////////////////////
    $scope.setArrival = function () {

        if ($scope.entity.STD != null && $scope.entity.FlightH != null && $scope.entity.FlightM != null) {
            var std = new Date($scope.entity.STD);
            $scope.entity.STA = new Date(std.addHours($scope.entity.FlightH).addMinutes($scope.entity.FlightM));

        }
        else
            $scope.entity.STA = null;
    };
    $scope.selectedType = null;
    $scope.sb_type = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Type', 'Manufacturer'],
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',

        onSelectionChanged: function (arg) {
            $scope.ds_msn = [];
            $scope.msn_readOnly = true;
            if (arg && arg.selectedItem) {
                aircraftService.getVirtualMSNsByType(Config.CustomerId, arg.selectedItem.Id).then(function (response) {

                    $scope.msn_readOnly = false;
                    $scope.ds_msn = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.msn_readOnly = true;
                $scope.ds_msn = [];
            }
        },
        bindingOptions: {
            value: 'entity.TypeId',
            selectedItem: 'selectedType',


        }
    };
    $scope.ds_msn = [];
    $scope.msn_readOnly = true;
    $scope.unknown_readOnly = false;
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAircraft(data);
        //},
        searchExpr: ['Register', 'MSN'],
        //dataSource: $scope.ds_msn,
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            if (arg.selectedItem && $scope.IsNew==true) {
                 
                var last = Flight.getLastFlight(vmins.datasource(), arg.selectedItem.ID);
                if (last) {
                    $scope.entity.FromAirport = last.ToAirport;
                    $scope.entity.ToAirport = null;
                    $scope.entity.STD = new Date(last.STA);
                    $scope.start = new Date($scope.entity.STD);
                }
             
                 
            }
             
        },
        bindingOptions: {
            value: 'entity.RegisterID',
            disabled: 'msn_readOnly',
            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    $scope.getAverageRouteTime = function () {
        if ($scope.IsNew ==true && $scope.entity.FromAirport && $scope.entity.ToAirport) {
            $scope.loadingVisible = true;
            flightService.getAverageRouteTime($scope.entity.FromAirport, $scope.entity.ToAirport).then(function (response) {

               
                $scope.loadingVisible = false;
                $scope.entity.FlightH = response.FlightH;
                $scope.entity.FlightM = response.FlightM;
                $scope.setArrival();


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.sb_flighttype = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FlightTypeID',

        }
    };
    $scope.selectedFromAirport = null;
    $scope.selectedToAirport = null;
    $scope.sb_FromAirport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
           // $scope.getAverageRouteTime();
            
            $scope.entity.ToAirport = null;
            if (!arg.selectedItem) {
                $scope.ds_toairport = [];
                return;
            }
            $scope.loadingVisible = true;
            flightService.getRouteDestination(Config.AirlineId, arg.selectedItem.Id).then(function (response) {
                 $scope.loadingVisible = false;
                $scope.ds_toairport = response;
                if ($scope.tempToAirport) {
                    $scope.entity.ToAirport = $scope.tempToAirport;
                    $scope.tempToAirport = null;
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FromAirport',
            selectedItem: 'selectedFromAirport',
        }
    };
    //$scope.sb_ToAirport = {
    //    showClearButton: true,
    //    searchEnabled: true,
    //    dataSource: $rootScope.getDatasourceAirport(),
    //    itemTemplate: function (data) {
    //        return $rootScope.getSbTemplateAirport(data);
    //    },
    //    onSelectionChanged: function (arg) {
    //        $scope.getAverageRouteTime();
    //    },
    //    searchExpr: ["IATA", "Country", "SortName", "City"],
    //    displayExpr: "IATA",
    //    valueExpr: 'Id',
    //    bindingOptions: {
    //        value: 'entity.ToAirport',
    //        selectedItem: 'selectedToAirport',
    //    }
    //};
    $scope.ds_toairport = [];
    $scope.sb_ToAirport = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRouteTo(data);
        },
        onSelectionChanged: function (arg) {
           // $scope.getAverageRouteTime();
            if (arg.selectedItem) {
                $scope.entity.RouteId = arg.selectedItem.Id;
                $scope.entity.FlightH = arg.selectedItem.FlightH;
                $scope.entity.FlightM = arg.selectedItem.FlightM;
            }
            else {
                $scope.entity.RouteId = null;
                $scope.entity.FlightH = null;
                $scope.entity.FlightM = null;
            }
            $scope.setArrival();
        },
        searchExpr: ["ToAirportIATA", "ToCity"],
        displayExpr: "ToAirportIATA",
        valueExpr: 'ToAirportId',
        bindingOptions: {
            value: 'entity.ToAirport',
            selectedItem: 'selectedRoute',
            dataSource:'ds_toairport'
        }
    };

    $scope.selectedRoute = null;
    $scope.sb_route = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutes(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRoute(data);
        },
        onSelectionChanged: function (arg) {
            if (arg.selectedItem) {
                $scope.entity.FromAirport = arg.selectedItem.FromAirportId;
                $scope.entity.ToAirport = arg.selectedItem.ToAirportId;
                $scope.entity.FlightH = arg.selectedItem.FlightH;
                $scope.entity.FlightM = arg.selectedItem.FlightM;
            }
            else {
                $scope.entity.FromAirport = null;
                $scope.entity.ToAirport = null;
                $scope.entity.FlightH = null;
                $scope.entity.FlightM = null;
            }
            $scope.setArrival();
        },
        searchExpr: ["FromAirportIATA", "FromCity"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.RouteId',
            selectedItem: 'selectedRoute',
        }
    };


    $scope.start = null;
    $scope.time_start = {
        type: "time",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            if (arg.value) {
                var d = new Date(arg.value);
                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                var dt = $scope.Day1 + " " + timestring;
                var std = new Date(dt);
                $scope.entity.STD = std;

            }
            else
                $scope.entity.STD = null;
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'start',

        }
    };
    $scope.time_end = {
        readOnly: true,
        type: "time",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'entity.STA',

        }
    };
    $scope.text_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightH',

        }
    };
    $scope.text_flightm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightM',

        }
    };
    $scope.text_unknown = {

        bindingOptions: {
            value: 'entity.Unknown',
            disabled: 'unknown_readOnly',
        }
    };
    $scope.text_flightnumber = {

        bindingOptions: {
            value: 'entity.FlightNumber',
            
        }
    };




    //////////////////////////
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


    ///////////////////////////////
    $scope.scroll_height = 200;
    $scope.dg_height = 200;
    $scope.dg_height2 = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.deleted = [];
    $scope.pop_width = 900;
    $scope.pop_height = 600;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    
    $scope.apply = false;
    $scope.gaps = 'Gaps: 0';
    $scope.overlaps = 'Overlaps: 0';
    $scope.gapoverlaps = 'Gap & Overlaps: 0';
    $scope.gapsn = 0;
    $scope.overlapsn = 0;
    $scope.gapoverlapsn =
    $scope.popup_add = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: '', width: 40, icon: 'plus', onClick: function (e) {
                        //var ganttObj = $("#resourceGantt").data("ejGantt");
                        $scope.IsNew = true;
                        $scope.popup_item_visible = true;
                        $scope.popup_item_title = 'Add';


                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: '', width: 40, icon: 'edit', onClick: function (e) {
                        //var ganttObj = $("#resourceGantt").data("ejGantt");
                        if (!$scope.selectedFlight) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.InitUpdate();
                        // $scope.popup_item_visible = true;
                        // $scope.popup_item_title = 'Update';


                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'danger', text: '', width: 40, icon: 'remove', onClick: function (e) {
                       
                        
                         
                        if (!$scope.selectedFlight) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.deleted.push($scope.selectedFlight.taskId);
                        var regid = $scope.selectedFlight.RegisterID;
                        var ds = Enumerable.From(vmins.datasource()).Where("$.taskId!=" + $scope.selectedFlight.taskId).ToArray();

                        //var element = $('#resourceGantt')[0];
                        //ko.cleanNode(element);
                        //$('#resourceGantt').remove();

                        //$('#gantt_container').append('<div id="resourceGantt" style="height:450px;width:100%;" data-bind="ejGantt: gantt_option" />');
                        //  console.log(vmins.datasource().length);
                        var ganttObj = $("#resourceGantt").data("ejGantt");
                        Flight.findGaps(ds, vmins.resources());
                        Flight.findOverlaps(ds, regid);
                        ganttObj._refreshDataSource(ds);
                        $scope.selectedFlight = null;
                        vmins.datasource(ds);
                        Flight.activeDatasource = ds;
                        //  console.log(vmins.datasource().length);
                        $scope.getErrors();
                        //ko.applyBindings(vmins, document.getElementById("resourceGantt"));
                        //var h = $(window).height() - 100;
                        //vmins.height(h + 'px');


                        //Flight.findGaps(vmins.datasource(), vmins.resources());
                        //  Flight.findOverlaps(vmins.datasource(), regid);

                        //  ganttObj.updateScheduleDates($scope.Day1, $scope.Day2);
                    }
                }
            },
            { widget: 'dxTextBox', location: 'after', options: { width:70,readOnly:true,  bindingOptions: { value: 'gaps' } }, toolbar: 'bottom' },
            { widget: 'dxTextBox', location: 'after', options: { width: 100, readOnly: true, bindingOptions: { value: 'overlaps' } }, toolbar: 'bottom' },
            { widget: 'dxTextBox', location: 'after', options: { width: 130, readOnly: true, bindingOptions: { value: 'gapoverlaps' } }, toolbar: 'bottom' },

            { widget: 'dxCheckBox', location: 'after', options: {visible:false, width: 100, text: 'Apply', onValueChanged: function (e) { $scope.apply = e.value; }  }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (arg) {
                         
                         
                        if ($scope.apply == true && ($scope.gapsn > 0 || $scope.overlapsn>0)) {
                            General.ShowNotify(Config.Text_GanttErrors, 'error');
                            return;
                        }

                        var dsedited = Enumerable.From(vmins.datasource())
                            //.Where('$.status==12 || $.status==13')
                           // .Where('$.initStatus.indexOf(12)!=-1 || $.initStatus.indexOf(13)!=-1')
                            .ToArray();
                       
                       // console.log(vmins.datasource());
                        var edited = [];
                        $.each(dsedited, function (_i, _d) {
                             
                            edited.push(
                                {
                                    Id: _d.Id,
                                    FlightPlanId: $scope.planId,
 
                                    TypeId: _d.TypeId,
                                    RegisterID: _d.RegisterID,
                                    FlightTypeID: _d.FlightTypeID,
                                    AirlineOperatorsID: _d.AirlineOperatorsID,
                                    FlightNumber: _d.FlightNumber,
                                    FromAirport: _d.FromAirport,
                                    ToAirport: _d.ToAirport,
                                    STD: (new Date(_d.startDate)).toUTCString(),
                                    STA: (new Date(_d.endDate)).toUTCString(),
                                    FlightH: _d.FlightH,
                                    FlightM: _d.FlightM,
                                    StatusId: _d.status,


                                }
                            );
                        });

                         
                        var dto = {};
                        dto.Plan = $scope.plan;
                        dto.Items = edited;
                        dto.Deleted = $scope.deleted;
                        dto.Apply = $scope.apply;
                      
                        $scope.loadingVisible = true;
                        flightService.savePlanItems(dto).then(function (response) {

                            // $scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            //$rootScope.$broadcast('onLibrarySaved', response);
                            //console.log(response);
                            var ds = Enumerable.From(vmins.datasource()).ToArray();
                            $.each(ds, function (_i, _d) {
                                //_d.initStatus = [1];
                                //if (_d.status == 10 || _d.status == 11 || _d.status==16)
                                //    _d.initStatus.push(_d.status);
                                //else
                                //    _d.status = 1;
                                if (_d.Id >= 1000000) {
                                    var result = Enumerable.From(response).Where('$.InitId==' + _d.Id).FirstOrDefault();
                                    _d.Id = result.Id;
                                }
                                
                            });
                            var ganttObj = $("#resourceGantt").data("ejGantt");
                            ganttObj._refreshDataSource(ds);

                            vmins.datasource(ds);
                            ganttObj.reRenderChart();
                            $scope.selectedFlight = null;
                            $scope.loadingVisible = false;
                           
                            $rootScope.$broadcast('onFlightPlanItemsSaved', null);


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        
                       
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_add_visible = false;} }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $('#gantt_container').append('<div id="resourceGantt" style="height:450px;width:100%;" data-bind="ejGantt: gantt_option" />');

        },
        onShown: function (e) {
            //  $scope.loadingVisible = true;


            // ko.applyBindings(vmins);
            //alert(vmins.details);
            $scope.bind($scope.planId);


        },
        onHiding: function () {

            //  $scope.clearEntity();
            //  var ganttObj = $("#resourceGantt").data("ejGantt");
            // ganttObj.destroy();
            var element = $('#resourceGantt')[0];
            ko.cleanNode(element);
            $('#resourceGantt').remove();
            $scope.clearEntity();
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onFlightDesignHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'IsEditView',
            'toolbarItems[1].visible': 'IsEditView',
            'toolbarItems[2].visible': 'IsEditView',
            'toolbarItems[3].visible': 'IsEditView',
            'toolbarItems[4].visible': 'IsEditView',
            'toolbarItems[5].visible': 'IsEditView',
            'toolbarItems[6].visible': 'IsEditView',
            'toolbarItems[7].visible': 'IsEditView',
        }
    };
    $scope.detailType = 'gantt';
    

     
    ///////////////////////////
    $scope.copy = function (source, destination) {
        destination.Id = source.Id;
        destination.taskId = source.taskId;
        destination.FlightPlanId = source.FlightPlanId;
        destination.TypeId = source.TypeId;
        destination.RegisterID = source.RegisterID;
        destination.FlightTypeID = source.FlightTypeID;
        destination.AirlineOperatorsID = source.AirlineOperatorsID;
        destination.FlightNumber = source.FlightNumber;
        destination.FromAirport = source.FromAirport;
        destination.ToAirport = source.ToAirport;
        destination.STA = new Date(source.STA);
      
        destination.STD = new Date( source.STD);
        destination.FlightH = source.FlightH;
        destination.FlightM = source.FlightM;
        destination.Unknown = source.Unknown;
        destination.FlightPlan = source.FlightPlan;
        destination.CustomerId = source.CustomerId;
        destination.IsActive = source.IsActive;
        destination.DateActive = source.DateActive;
        destination.DateFrom = source.DateFrom;
        destination.DateTo = source.DateTo;
        destination.Customer = source.Customer;
        destination.FromAirportName = source.FromAirportName;
        destination.FromAirportIATA = source.FromAirportIATA;
        destination.from = source.from;
        destination.FromAirportCityId = source.FromAirportCityId;
        destination.ToAirportName = source.ToAirportName;
        destination.ToAirportIATA = source.ToAirportIATA;
        destination.to = source.to;
        destination.ToAirportCityId = source.ToAirportCityId;
        destination.notes = source.notes;
        destination.status = source.status;
        destination.progress = source.progress;
        destination.duration = source.duration;
        destination.startDate = new Date(source.startDate);
        destination.taskName = source.taskName;
        destination.FromAirportCity = source.FromAirportCity;
        destination.ToAirportCity = source.ToAirportCity;
        destination.MSN = source.MSN;
        destination.Register = source.Register;
        destination.AircraftType = source.AircraftType;
        destination.resourceId = source.resourceId;
        destination.initStatus = source.initStatus;
        destination.delay = source.delay;
        destination.delayLanding = source.delayLanding;
        destination.baseDuration = source.baseDuration;
        destination.baseEndDate = new Date(source.baseEndDate);
        destination.baseStartDate = new Date(source.baseStartDate);
        destination.endDate = new Date(source.endDate);
        destination.BaselineStartDate = source.BaselineStartDate;
        destination.BaselineEndDate = source.BaselineEndDate;
        destination.serialNumber = source.serialNumber;
        destination.isnew = source.isnew;
       // console.log(destination.STA);
    };
    $scope.IsNew = true;
    $scope.tempFlight = null;

    $scope.addFlight = function (data) {
        
        if ($scope.IsNew == true) {

            data.taskId = $scope.taskIndex;
             
            data.Id = data.taskId;
            $scope.taskIndex = $scope.taskIndex + 1;
        }
        else
            data.taskId = data.Id;




        
        if ($scope.IsNew) {
            data.isnew = true;
              data.status = 1;
             data.initStatus = [1];
          //  data.status = 12;
          //  data.initStatus = [12];
        }
        else if (!data.isnew) {
          //  data.status = 13;
          //  data.initStatus.push(13);
        }





        var ganttObj = $("#resourceGantt").data("ejGantt");
        $scope.tempFlight = null;



        var newdata = JSON.parse(JSON.stringify(data));
        newdata.startDate = new Date(data.startDate);
        newdata.endDate = new Date(data.endDate);


        Flight.processData(newdata);
        

        if ($scope.IsNew) {
           
            
            ganttObj.addRecord(newdata, 0);
            vmins.datasource().push(newdata);
          
            //Flight.findGaps(vmins.datasource(), vmins.resources());
            //Flight.findOverlaps(vmins.datasource(), data.RegisterID);
            
            $scope.refreshEntity();
        }
        else {

            var dsitem = Enumerable.From(vmins.datasource()).Where("$.taskId==" + data.taskId).FirstOrDefault();

            $scope.copy(newdata, dsitem);
            //console.log('addflight');
           // console.log(dsitem);
           // console.log(vmins.datasource());

             ganttObj.updateRecordByTaskId(newdata);

           // Flight.findGaps(vmins.datasource(), vmins.resources());
           // Flight.findOverlaps(vmins.datasource(), data.RegisterID);
            //console.log(data);
           // console.log(newdata);
           // console.log(dsitem);
           
            $scope.popup_item_visible = false;
        }


        ////New
        Flight.findGaps(vmins.datasource(), vmins.resources(), function () {
            Flight.findOverlaps(vmins.datasource(), data.RegisterID, function () {
                Flight.activeDatasource = vmins.datasource();
            });
        });
       

        
        ///////


       $scope.getErrors();
        

        
      ganttObj.reRenderChart();
        //scheduleStartDate

        // ganttObj.updateScheduleDates($scope.Day1, $scope.Day2);



    };
    $scope.popup_item_visible = false;
    $scope.popup_item_title = 'Add';
    $scope.popup_item = {

        fullScreen: false,
        showTitle: true,
        height: 480,
        width: 600,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplanitem', onClick: function (e) {
                        //vmins.resourceGroups().push({ groupId: 140, Title: "GRP", });
                        //  vmins.resources().push({ resourceName: "UNKNOWN 140", groupId: 140, resourceId: -140 });
                        //var ganttObj = $("#resourceGantt").data("ejGantt");
                        // ganttObj.reRenderChart(ej.Gantt.ScheduleHeaderType.Hour);
                        //return;

                        $scope.scroll = $('.e-ganttviewerbodyContianer').data("ejScroller").scrollLeft();
                        
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if (!$scope.entity.RegisterID && !$scope.entity.Unknown) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if ($scope.entity.FlightH == 0 && $scope.entity.FlightM == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        ///////
                     
                        $scope.entity.from =  $scope.selectedFromAirport.IATA;
                        $scope.entity.to = $scope.selectedRoute.ToAirportIATA; //$scope.selectedToAirport.IATA;
                       // $scope.entity.taskName = $scope.selectedFromAirport.IATA + ($scope.entity.FlightNumber ? ' -' + $scope.entity.FlightNumber+'- ':' -?- ') + $scope.selectedToAirport.IATA;
                        $scope.entity.taskName = $scope.selectedFromAirport.IATA + ($scope.entity.FlightNumber ? ' -' + $scope.entity.FlightNumber + '- ' : ' -?- ') + $scope.selectedRoute.ToAirportIATA;


                        $scope.entity.startDate = new Date($scope.entity.STD);
                        $scope.entity.endDate = new Date($scope.entity.STA);

                        $scope.entity.notes = "green";
                        $scope.entity.progress = 0;
                        $scope.entity.delay = 0;
                        $scope.entity.delayLanding = 0;
                        $scope.entity.duration = Flight.calculateDuration($scope.entity.FlightH, $scope.entity.FlightM);
                        $scope.entity.baseDuration = $scope.entity.duration;
                        $scope.entity.resourceId = [];
                        $scope.entity.resourceId.push($scope.entity.RegisterID);


                        ///////////////

                        var ganttObj = $("#resourceGantt").data("ejGantt");
                        var groupExist = Enumerable.From(vmins.resourceGroups()).Where("$.groupId==" + $scope.entity.TypeId).FirstOrDefault();
                        if (!groupExist) {
                            var grps = vmins.resourceGroups();
                            grps.push({ groupId: $scope.entity.TypeId, Title: $scope.selectedType.Type, });
                            vmins.resourceGroups(grps);
                        }
                        var resourceExist = Enumerable.From(vmins.resources()).Where("$.resourceId==" + $scope.entity.RegisterID).FirstOrDefault();
                        if (!resourceExist) {
                            var res = vmins.resources();
                            res.push({ resourceName: $scope.selectedMsn.Register, groupId: $scope.selectedMsn.AircraftTypeId, resourceId: $scope.entity.RegisterID });
                            vmins.resources(res);
                        }
                        //if (!resourceExist || !groupExist) {
                        //    $scope.tempFlight = JSON.parse(JSON.stringify($scope.entity));
                        //    ganttObj.reRenderChart();

                        //}
                        //else {

                        //    $scope.addFlight($scope.entity);
                        //}

                        
                        $scope.tempFlight = {};
                        $scope.copy($scope.entity, $scope.tempFlight);
                       // JSON.parse(JSON.stringify($scope.entity));
                        
                        ganttObj.reRenderChart();





                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_item_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.clearEntity();
            //$scope.expose = {
            //    BookId: null,
            //    SMS: true,
            //    Email: true,
            //    AppNotification: true,
            //    CustomerId: Config.CustomerId,
            //};
            $scope.popup_expose_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_item_visible',

            title: 'popup_item_title',

        }
    };
    ///////////////////////////
    $scope.applied = false;
    $scope.aircraftTypes = null;
    $scope.msns = null;
    $scope.buildResources = function () {

        var resgroups = [];
        $.each($scope.aircraftTypes, function (_i, _d) {

            resgroups.push({ groupId: Number(_d.Id), Title: _d.Type });
        });

        var res = [];
        res.push({ resourceName: 'Vahid', groupId: 6, resourceId: 1 });
        //$.each($scope.msns, function (_i, _d) {
        //    //new { resourceName = q.Register, groupId = q.TypeId, resourceId = (q.RegisterID >= 0 ? q.RegisterID : -1 * (i + 1)) }
        //    res.push({ resourceName: _d.Register, groupId: Number(_d.AircraftTypeId), resourceId: Number(_d.ID) });
        //});
        vmins.resourceGroups(resgroups);
        vmins.resources(res);
         
       

    };
    $scope.getErrors = function () {
        $scope.gapsn = Enumerable.From(vmins.datasource()).Where("$.status==11").ToArray().length;
        $scope.gaps = 'Gaps: ' + $scope.gapsn;
        $scope.overlapsn = Enumerable.From(vmins.datasource()).Where("$.status==10").ToArray().length;
        $scope.overlaps = 'Overlaps: ' + $scope.overlapsn;
        $scope.gapoverlapsn = Enumerable.From(vmins.datasource()).Where("$.status==16").ToArray().length;
        $scope.gapoverlaps = 'Gap & Overlaps: ' + $scope.gapoverlapsn;
         
    };
    $scope.bind = function (pid) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        aircraftService.getAircraftTypes(Config.CustomerId).then(function (response) {

            $scope.aircraftTypes = response;
            aircraftService.getMSNs(Config.CustomerId).then(function (response) {

                $scope.msns = response;
                flightService.getFlightPlanGantt(pid, offset).then(function (response) {
                    $scope.loadingVisible = false;

                    $.each(response.flights, function (_i, _d) {
                        _d.startDate = new Date(_d.startDate);
                        _d.initStatus = [1];
                        if (_d.status != 1)
                            _d.initStatus.push(_d.status);

                    });

                    vmins.flightData(response);
                    // vmins.flights(response.flights);

                    //$scope.buildResources();
                    vmins.resourceGroups(response.resourceGroups);
                    vmins.resources(response.resources);


                    //if (!$scope.applied)
                    {
                        $scope.applied = true;
                        ko.applyBindings(vmins, document.getElementById("resourceGantt"));
                        var h = $(window).height() - 100;
                        vmins.height(h + 'px');

                    }


                    var ds = Flight.proccessDataSource(response.flights);
                    Flight.activeDatasource = ds;

                    vmins.datasource(ds);
                    $scope.getErrors();
                    var ganttObj = $("#resourceGantt").data("ejGantt");
                    ganttObj._refreshDataSource(vmins.datasource());

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };


    /////////////////////////////
    $scope.tempData = null;
    $scope.plan = null;
    $scope.planId = null;
    $scope.$on('InitFlightDesign', function (event, prms) {
        $scope.plan = prms;
       
        $scope.planId = prms.Id;
        
        $scope.entity.FlightPlanId = $scope.planId;
        $scope.taskIndex = 1000000;
        vmins = new viewModel();
        //vmins.flightData(prms);
        //vmins.flights(prms.flights);
        //vmins.resourceGroups(prms.resourceGroups);
        //vmins.resources(prms.resources);

        $scope.tempData = null;
        $scope.popup_add_title = 'Plan Items';


        $scope.popup_add_visible = true;


    });
    $scope.IsReadonly = false;
    $scope.IsEditView = true;
    $scope.$on('InitFlightDesignView', function (event, prms) {
        $scope.plan = prms;
        $scope.IsReadonly = true;
        $scope.IsEditView = false;
        $scope.planId = prms.Id;

        $scope.entity.FlightPlanId = $scope.planId;
        $scope.taskIndex = 1000000;
        vmins = new viewModel();
        //vmins.flightData(prms);
        //vmins.flights(prms.flights);
        //vmins.resourceGroups(prms.resourceGroups);
        //vmins.resources(prms.resources);

        $scope.tempData = null;
        $scope.popup_add_title = 'Plan Items';


        $scope.popup_add_visible = true;


    });

    //////////////////////////////

}]);  