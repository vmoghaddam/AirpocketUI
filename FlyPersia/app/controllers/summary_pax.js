'use strict';
app.controller('summary_pax_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
     
    
    //if ($rootScope.userName.toLowerCase() == 'ashrafi')
    //    isTaxiVisible = true;
    ////////////////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Overall", id: 'overall' },
        { text: "Pax", id: 'pax' },
        { text: "Technical", id: 'technical' },
        { text: "Airports", id: 'airport' },
       
        { text: 'Statistics', id: 'stats' }



    ];
    $scope.activeTab = "";
	
	 $scope.doTabChanged = function (id) {
        switch (id) {
            case 'overall':
                $scope.activeTab = id;
                break;
            case 'pax':
                $scope.activeTab = id;
                

                break;
            case 'technical':
                $scope.activeTab = id;
               

                break;
            case 'airport':
                $scope.activeTab = id;
                
                break;
            case 'route':
                $scope.activeTab = id;
               

                break;
            

            default:
                break;
        }
    };
    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {

            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $scope.activeTab = "";

            $scope.doTabChanged(id);


            //$scope.dg_crew_instance.refresh();
        }
        catch (e) {

        }

    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 1;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    //////////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'finmrpt',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_total_ds = null;
            $scope.dg_reg_ds = null;
            $scope.dg_route_ds = null;
            $scope.dg_regroute_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };
    /////////////////////////////////////////
    $scope.yf = 1402;
    $scope.yt = 2024;
    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1403,1402,1401,1400,1399, 1398],

        onSelectionChanged: function (arg) {
            $scope.bind();
        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'To Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2018, 2019, 2020, 2021,2022,2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };


    
    $scope.bind = function () {
         
        $scope.dg_737_ds = null;
        $scope.dg_md_ds = null;
        $scope.dg_reg_ds = null;

        $scope.dg_regroute_ds = null;
        $scope.doRefresh = true;

        $scope.loadingVisible = true;
        flightService.getFlightsMonthlyReport($scope.yf).then(function (response) {



            $scope.loadingVisible = false;
            $.each(response.total, function (_i, _d) {

                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            });
            ;

            $scope.dg_737_ds = Enumerable.From(response.total).OrderBy('$.Month').ToArray();

           
            $scope.pie_cat_ds = $scope.dg_737_ds;
            $scope.pie_det_ds = $scope.dg_737_ds;
            
            //$scope.pie_cat_ds = Enumerable.From(response.total).GroupBy("$.Fleet", null,
            //            function (key, g) {
            //                var result = {
            //                    Fleet: key,
            //                    FlightTime: g.Sum("$.FlightTime"),
            //                    //Items: g.OrderBy('$.TotalDelay').ToArray(),
            //                };
            //                return result;
            //            }).ToArray();

            //$scope.pie_det_ds = Enumerable.From(response.total).GroupBy("$.Register", null,
            //           function (key, g) {
            //               var result = {
            //                   Register: key,
            //                   FlightTime: g.Sum("$.FlightTime"),
            //                   //Items: g.OrderBy('$.TotalDelay').ToArray(),
            //               };
            //               return result;
            //           }).ToArray();
			
			//getSummaryPax
			flightService.getSummaryPax($scope.yf,$scope.yf).then(function (response2) {
				$.each(response2.result , function (_i, _d) {

                _d.flight_time2 = $scope.formatMinutes(_d.flight_time);
                _d.block_time2 = $scope.formatMinutes(_d.block_time);
				_d.route=_d.origin+'-'+_d.destination;
            });
			
			var _ds_flts=Enumerable.From(response2.result).OrderBy('Number($.grp_total_count)').ToArray();
				$scope.dg_pax_ds=response2.result;
				
				$scope.flightData =_ds_flts;
				 $scope.generateHeatmap();
				
			}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            setTimeout(function () {
                if ($scope.dg_737_instance)
                    $scope.dg_737_instance.repaint();

            }, 500);
           


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //////////////////////////////////////////
    
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
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
    

    $scope.dg_height = $(window).height() - 150;
    $scope.getChartBoxStyle = function () {
        return {
            height: $scope.dg_height + 'px'
        };
    };

    $scope.month = null;
    //$scope.$watch("month", function (newValue) {

    //    if (newValue) {
    //        $scope.bind();

    //    }

    //});
    $scope.monthClick = function (m, $event) {
        $('.month').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.month = m;
        $scope.bind();
    }

    ////////////////////////////////
    $scope.goDetail = function (row) {
        var y = row.data.Year;
        var m = row.data.Month;
        $window.open('#!/reg/flights/monthly/'+y+'/'+m, '_blank');
    };

    //////////////////////////////////
    $scope.dg_737_columns = [


                {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },

      { dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
      { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, sortIndex: 0, sortOrder: 'asc', visible: false },
   
     { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
      { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
       { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  },
        { dataField: 'TotalPax', caption: 'TotalPax', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
         {
             dataField: "Id", caption: '',
             width: 90,
             allowFiltering: false,
             allowSorting: false,
             cellTemplate: 'goDetailTemplate',
             name: 'godetail',
             //visible:false,

         },
     

    ];
    $scope.dg_737_selected = null;
    $scope.dg_737_instance = null;
    $scope.dg_737_ds = null;
    $scope.dg_737 = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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


        columns: $scope.dg_737_columns,
        onContentReady: function (e) {
            if (!$scope.dg_737_instance)
                $scope.dg_737_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_737_selected = null;
            }
            else
                $scope.dg_737_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "BlockTimeAvgLeg",
                     showInColumn: "BlockTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },
                 {
                     name: "FlightTimeAvgLeg",
                     showInColumn: "FlightTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },



                {
                    column: "TotalPax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return "Total: " + data.value;
                    }
                },
                  {
                      column: "TotalPax",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },

                    {
                        name: "TotalPaxLeg",
                        showInColumn: "TotalPax",
                        displayFormat: "Avg/Leg: {0}",

                        summaryType: "custom"
                    },


                     {
                         column: "Legs",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return "Total: " + data.value;
                         }
                     },
                     {
                         column: "Legs",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },


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
                if (options.name === "FlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
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
                if (options.name === "BlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "BlockTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TotalPaxLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalPax;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;


                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = options.totalValueMinutes;
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "B737_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'></span>"
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
            dataSource: 'dg_737_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
	
	
	
	 $scope.dg_pax_columns = [


              /*  {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                },*/

{ dataField: 'pyear', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, sortIndex: 0, sortOrder: 'asc', visible: false,fixed: true, fixedPosition: 'left', },
      { dataField: 'pmonth_name', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,fixed: true, fixedPosition: 'left',  },
      { dataField: 'pmonth', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, sortIndex: 1, sortOrder: 'asc', visible: false },
   
    { dataField: 'register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,fixed: true, fixedPosition: 'left',   },
	{ dataField: 'route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 ,fixed: true, fixedPosition: 'left',  },
 //  { dataField: 'origin', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100   },
 //  { dataField: 'destination', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100   },
   { dataField: 'flights_count', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 100,sortIndex: 2, sortOrder: 'desc', fixed: true, fixedPosition: 'right', },
   { dataField: 'pax_total', caption: 'pax', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 110,sortIndex: 3, sortOrder: 'desc', fixed: true, fixedPosition: 'right', },
   { dataField: 'fuel_used', caption: 'Fuel', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', },
 { dataField: 'flight_time2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110  },
       { dataField: 'block_time2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110 },
       

  // { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
     //  { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  },
      //  { dataField: 'TotalPax', caption: 'TotalPax', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
         /*{
             dataField: "Id", caption: '',
             width: 90,
             allowFiltering: false,
             allowSorting: false,
             cellTemplate: 'goDetailTemplate',
             name: 'godetail',
              

         },*/
     

    ];
    $scope.dg_pax_selected = null;
    $scope.dg_pax_instance = null;
    $scope.dg_pax_ds = null;
    $scope.dg_pax = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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


        columns: $scope.dg_pax_columns,
        onContentReady: function (e) {
            if (!$scope.dg_pax_instance)
                $scope.dg_pax_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_pax_selected = null;
            }
            else
                $scope.dg_pax_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "BlockTimeAvgLeg",
                     showInColumn: "BlockTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },
                 {
                     name: "FlightTimeAvgLeg",
                     showInColumn: "FlightTime2",
                     displayFormat: "Avg/Leg: {0}",

                     summaryType: "custom"
                 },



                {
                    column: "TotalPax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return "Total: " + data.value;
                    }
                },
                  {
                      column: "TotalPax",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },

                    {
                        name: "TotalPaxLeg",
                        showInColumn: "TotalPax",
                        displayFormat: "Avg/Leg: {0}",

                        summaryType: "custom"
                    },


                     {
                         column: "Legs",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return "Total: " + data.value;
                         }
                     },
                     {
                         column: "Legs",
                         summaryType: "avg",
                         customizeText: function (data) {
                             return 'Avg: ' + Number(data.value).toFixed(1);
                         }
                     },


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
                if (options.name === "FlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
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
                if (options.name === "BlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "BlockTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeAvgLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TotalPaxLeg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.totalValueLegs = 0;
                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TotalPax;
                        options.totalValueLegs = options.totalValueLegs + options.value.Legs;


                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.totalValueLegs);
                        options.totalValue = options.totalValueMinutes;
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "B737_Monthly_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'></span>"
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
            dataSource: 'dg_pax_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////
    $scope.bar_ftl_737_instance = null;
    $scope.bar_ftl_737 = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ftl_737_instance)
                $scope.bar_ftl_737_instance = e.component;
        },
        palette: "Dark Moon",
        title: {
            text: "Pax / Legs",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "PaxLeg",
            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //},
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "MonthName"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                //return {
                //    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                //};
            }
        },
        valueAxis: [{
            label: {
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //}
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };



    $scope.bar_btleg_instance = null;
    $scope.bar_btleg = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_btleg_instance)
                $scope.bar_btleg_instance = e.component;
        },
        palette: "Dark Violet",
        title: {
            text: "Flight Time / Legs",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "FtLeg",
            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //},
                visible: false,
            },
            barWidth: 30,
        },
        seriesTemplate: {
            nameField: "MonthName"
        },
        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };



     
    ///////////////////////////////
    $scope.bar_pax_instance = null;
    $scope.bar_pax = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_pax_instance)
                $scope.bar_pax_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Pax",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //},
                visible: false,
            },
            // barWidth: 30,
        },
        //seriesTemplate: {
        //    nameField: "Register"
        //},
        series: [
            { valueField: "TotalPax", name: "Pax", color: '#ff66cc' },
            //{ valueField: "BlockTime", name: "Block Time", color: '#0099cc' },
        ],

        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                //return {
                //    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                //};
            }
        },
        valueAxis: [{
            label: {
                //customizeText: function () {
                //    return $scope.formatMinutes(this.value);
                //}
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };

    //////////////////////////////
    $scope.bar_ft_instance = null;
    $scope.bar_ft = {
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.bar_ft_instance)
                $scope.bar_ft_instance = e.component;
        },
        palette: "GreenMist",
        title: {
            text: "Flight - Block Time",
            font: {
                size: 20,
            }
            // subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            // barWidth: 30,
        },
        //seriesTemplate: {
        //    nameField: "Register"
        //},
        series: [
            { valueField: "FlightTime", name: "Flight Time", color: '#00cc99' },
             { valueField: "BlockTime", name: "Block Time", color: '#0099cc' },
        ],

        tooltip: {
            enabled: true,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            "dataSource": "dg_737_ds",
        }
    };

    ////////////////////////////
    

    
    /////////////////////////////////////
    $scope.diameter = 0.85;

    

     
    //////////////////////////////////
    

    /////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 200 },

    };
    
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '>  Summary';


        $('.summary_pax').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////
   /*$scope.flightData = [
        { route: 'THR-MHD', pmonth: 'Farvardin', pax_total: 120 },
        { route: 'THR-MHD', pmonth: 'Ordibehesht', pax_total: 150 },
        { route: 'THR-MHD', pmonth: 'Khordad', pax_total: 200 },
        { route: 'IKA-MHD', pmonth: 'Farvardin', pax_total: 180 },
        { route: 'IKA-MHD', pmonth: 'Ordibehesht', pax_total: 190 },
        { route: 'IKA-MHD', pmonth: 'Khordad', pax_total: 220 },
        { route: 'THR-SYZ', pmonth: 'Farvardin', pax_total: 100 },
        { route: 'THR-SYZ', pmonth: 'Ordibehesht', pax_total: 170 },
        { route: 'THR-SYZ', pmonth: 'Khordad', pax_total: 250 },
        
    ];*/

    // Function to process data into the format required for the heatmap
     function prepareHeatmapData(flightData) {
        var routes = [];
        var months = ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'];
        var paxMatrix = [];

        // Get unique routes
        flightData.forEach(function(data) {
            if (routes.indexOf(data.route) === -1) {
                routes.push(data.route);
            }
        });

        // Initialize matrix with zeroes
        routes.forEach(function(route) {
            var paxRow = new Array(months.length).fill(0);
            paxMatrix.push(paxRow);
        });

        // Fill the matrix with pax_total values
        flightData.forEach(function(data) {
            var routeIndex = routes.indexOf(data.route);
            var monthIndex = months.indexOf(data.pmonth_name);
            paxMatrix[routeIndex][monthIndex] = data.pax_total;
        });

        return {
            routes: routes,
            months: months,
            paxMatrix: paxMatrix
        };
    }

    // Generate the heatmap using Plotly
    $scope.generateHeatmap = function() {
        var heatmapData = prepareHeatmapData($scope.flightData);

        var data = [{
            z: heatmapData.paxMatrix, // Total passengers matrix
            x: heatmapData.months, // Persian months
            y: heatmapData.routes, // Flight routes
            type: 'heatmap',
             colorscale: [
    ['0.0', '#f2f2f2'],
    ['0.111111111111', '#ffd480'],
    ['0.222222222222', '#ffff80'],
    ['0.333333333333', '#ccff99'],
    ['0.444444444444', '#ccffcc'],
    ['0.555555555556', '#99ffcc'],
    ['0.666666666667', '#4dffc3'],
    ['0.777777777778', '#1affff'],
    ['0.888888888889', '#00ccff'],
    ['1.0', '#0099cc']
  ],
        }];

        var layout = {
            //title: 'Total Passengers by Route',
            xaxis: { 
			   title: 'Month',
			   tickfont:{size:11},
			},
            yaxis: { title: {text:'Route',standoff:  10},automargin: true,
              tickfont: {      // Setting the font size for y-axis labels
					size: 11       // Font size set to 12px
					}
					//,scaleanchor: "x"
			},
            height: 500,
			margin: {
				t: 25,  // Decreasing the top margin (reduce top padding)
				b: 70,  // You can also adjust the bottom margin if necessary
				l: 20,  // Left margin
				r: 20   // Right margin
			}
            //width: 500
        };

        // Render the heatmap in the 'heatmap' div
        Plotly.newPlot('heatmap', data, layout);
    };

    // Call the generateHeatmap function to render the chart on load
   
	/////////////////////////
    $scope.$on('$viewContentLoaded', function () {
       

    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);