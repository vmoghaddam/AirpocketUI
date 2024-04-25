'use strict';
app.controller('crewTimeReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route','$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route,$window) {
    $scope.prms = $routeParams.prms;
	$scope.search=function(){
	 $scope.dg_flight_total_ds = null;
            $scope.dg_flight_ds = null;
            var caption = 'From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD');
            $scope.dg_flight_total_instance.columnOption('date', 'caption', caption);
            $scope.getCrewFlightsTotal($scope.dt_from, $scope.dt_to);
	};
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
           $scope.search();
        }

    };
	 
	 $scope.btn_export = {
        text: 'Export',
        type: 'success',
        
        width: 120,
        
        bindingOptions: {},
        onClick: function (e) {
           $window.open(apixls +'api/xls/crew/flights/-1?df='+moment(new Date($scope.dt_from)).format('YYYY-MM-DD')+'&dt='
						+moment(new Date($scope.dt_to)).format('YYYY-MM-DD'), '_blank');
        }

    };
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-7);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

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
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                // _d.DurationH = Math.floor(_d.FlightTime / 60);
                // _d.DurationM = _d.FlightTime % 60;
                // var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //var bm = _d.BlockH * 60 + _d.BlockM;
                _d.JLBlockTime2 = $scope.formatMinutes(_d.JLBlockTime);
                _d.JLFlightTime2 = $scope.formatMinutes(_d.JLFlightTime);
            });
            $scope.dg_flight_total_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewFlights = function (id, df, dt) {
        $scope.dg_flight_ds = null;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
				_d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
				_d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
				_d.FixTime2 = $scope.formatMinutes(_d.FixTime);
				_d.JLBlockTime2 = $scope.formatMinutes(_d.JL_BlockTime);
				_d.JLFlightTime2 = $scope.formatMinutes(_d.JL_FlightTime);
               // _d.STA = (new Date(_d.STA)).addMinutes(offset);

                //_d.STD = (new Date(_d.STD)).addMinutes(offset);
                //if (_d.ChocksIn)
                //    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                //if (_d.ChocksOut)
                //    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                // if (_d.Takeoff)
                //    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                // if (_d.Landing)
                //     _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                //_d.DurationH = Math.floor(_d.FlightTime / 60);
                //_d.DurationM = _d.FlightTime % 60;
                //var fh = _d.FlightH * 60 + _d.FlightM;

                //_d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                //_d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                //var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                //_d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                //_d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                //_d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //_d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //_d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
    $scope.dg_flight_total_columns = [
          { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', width: 90, allowEditing: false, fixed: true, fixedPosition: 'left' },

                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', minWidth: 200 },

                { dataField: 'Legs', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                { dataField: 'DH', caption: 'DH', allowResizing: true, dataType: 'number', allowEditing: false, width: 80, alignment: 'center', },
                //  { dataField: 'LayOver', caption: 'LO', allowResizing: true, dataType: 'number', allowEditing: false, width: 90, alignment: 'center', },
                //{ dataField: 'FlightTime2', caption: 'Sch. Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
				 { dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
				{caption:'STATION',columns:[
				
				 { dataField: 'FlightTime2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,  },
                { dataField: 'BlockTime2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
				
				]},
				{caption:'Journey Log',columns:[
				
				 { dataField: 'JLFlightTime2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
                { dataField: 'JLBlockTime2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
				]},
				
               
               
                // { dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },




    ];

    $scope.dg_flight_total_selected = null;
    $scope.dg_flight_total_instance = null;
    $scope.dg_flight_total_ds = null;
    $scope.dg_flight_total = {
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
        height: $(window).height() - 140,

        columns: $scope.dg_flight_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_total_instance)
                $scope.dg_flight_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_ds = null;
                $scope.dg_flight_total_selected = null;
                $scope.dg_flight_instance.columnOption('crew', 'caption', 'Crew');
            }
            else {
                $scope.dg_flight_total_selected = data;
               /// var caption = data.Name + ' (From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD') + ' )';
               // $scope.dg_flight_instance.columnOption('crew', 'caption', caption);
                $scope.getCrewFlights($scope.dg_flight_total_selected.CrewId, $scope.dt_from, $scope.dt_to);
            }

            //nono

        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },

            {
                name: "JLBlockTimeTotal",
                showInColumn: "JLBlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "JLFlightTime2",
                showInColumn: "JLFlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "FixTimeTotal",
                showInColumn: "FixTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLFlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "JLBlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "CREW_TOTAL_TIMES",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Total</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        bindingOptions: {
            dataSource: 'dg_flight_total_ds'
        }
    };
    //////////////////////////////////
    $scope.dg_flight_columns = [
        {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },
                { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
                { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd',fixed: true, fixedPosition: 'left' },
                { dataField: 'Position', caption: 'Pos', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
                { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
				
              
                { dataField: 'JL_OffBlockLocal', caption: 'Off', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 0, sortOrder: 'asc' },

                { dataField: 'JL_TakeOffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 0, sortOrder: 'asc' },


                { dataField: 'JL_LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

                { dataField: 'JL_OnBlockLocal', caption: 'On', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },


                
                
				{caption:'STATION',columns:[
				
				  { dataField: 'FlightTime2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },

                { dataField: 'BlockTime2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
				
				]},
				{caption:'Journey Log',columns:[
				  { dataField: 'JLFlightTime2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },

                { dataField: 'JLBlockTime2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
				
				]},
				{ dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'right' },
             




    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
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

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 140,

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
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [{
                name: "BlockTimeTotal",
                showInColumn: "BlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }, {
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }, {
                name: "JLFlightTimeTotal",
                showInColumn: "JLFlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "JLBlockTimeTotal",
                showInColumn: "JLBlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "FixTimeTotal",
                showInColumn: "FixTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "JLFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JL_FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLBlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JL_BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        "export": {
            enabled: true,
            fileName: "CREW_TIMES",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Legs</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Crew Times Report';


        $('.crewtimereport').fadeIn(400, function () {
            $scope.search();
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('CrewTimeReportLoaded', null);

}]);