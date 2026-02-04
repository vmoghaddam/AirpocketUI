'use strict';
app.controller('fixTimeReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    $scope.IsEditable = $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('ops.soltani') || $rootScope.userName.toLowerCase().startsWith('ops.esmaeili')
        || $rootScope.userName.toLowerCase().includes('razbani') || $rootScope.userName.toLowerCase().startsWith('hr.') || $rootScope.userName.toLowerCase().startsWith('ops.');

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "Fix Time", id: 'fix' },
        { text: "No Flight", id: 'no' },

    ];
    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabfix').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'fix':
                    if ($scope.dg_fix_instance)
                        $scope.dg_fix_instance.repaint();

                    break;
                case 'no':
                    if ($scope.dg_no_instance)
                        $scope.dg_no_instance.repaint();

                    break;


                default:
                    break;
            }

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
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };


    ////Reposition
    $scope.selectedTabDetIndex = -1;
    $scope.selectedTabDetId = null;
    $scope.tabsdet = [
        { text: "FDPs", id: '_fdps' },
        { text: "Extra", id: '_extra' },
        { text: "Taxi", id: '_taxi' },
        { text: "Redirect", id: '_redirect' },
        { text: "DeadHead", id: '_deadhead' },

    ];
    $scope.$watch("selectedTabDetIndex", function (newValue) {
        //ati
        try {
            $('.tabfixdet').hide();
            var id = $scope.tabsdet[newValue].id;
            $scope.selectedTabDetId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case '_fdps':
                    if ($scope.dg_details_instance)
                        $scope.dg_details_instance.repaint();

                    break;
                case '_extra':
                    if ($scope.dg_stby_instance)
                        $scope.dg_stby_instance.repaint();

                    break;
                case '_taxi':
                    if ($scope.dg_repos_instance)
                        $scope.dg_repos_instance.repaint();

                    break;
                case '_redirect':
                    if ($scope.dg_redirect_instance)
                        $scope.dg_redirect_instance.repaint();

                    break;

                case '_deadhead':
                    if ($scope.dg_deadhead_instance)
                        $scope.dg_deadhead_instance.repaint();

                    break;



                default:
                    break;
            }

        }
        catch (e) {

        }

    });
    $scope.tabsdet_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDetIndex = -1;
            $scope.selectedTabDetIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabsdet", deep: true },
            selectedIndex: 'selectedTabDetIndex'
        }

    };

    ////////////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'fixtimerep',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }

            $scope.dg_fix_ds = null;
            $scope.dg_no_ds = null;
            if ($scope.dg_fix_instance)
                $scope.dg_fix_instance.repaint();

            $scope.bind();

        }

    };

    $scope.btn_fixtime = {
        text: 'Fix Times',
        type: 'default',
        icon: '',
        width: 150,
        
        bindingOptions: {},
        onClick: function (e) {
            $scope.popup_fixtime_visible = true;

        }

    };
    
    $scope.btn_details = {
        text: 'Details',
        type: 'default',
        icon: '',
        width: 150,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_fix_selected = $rootScope.getSelectedRow($scope.dg_fix_instance);
            if (!$scope.dg_fix_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            $scope.popup_details_title = $scope.dg_fix_selected.Name;
            $scope.popup_details_visible = true;

        }

    };
    /////////////////////////////////////////
    $scope.yf = 1400;
    $scope.month = null;
    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1401,1400,1399, 1398],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.monthDs = [
        { id: 1, title: 'فروردین' },
        { id: 2, title: 'اردیبهشت' },
        { id: 3, title: 'خرداد' },
        { id: 4, title: 'تیر' },
        { id: 5, title: 'مرداد' },
        { id: 6, title: 'شهریور' },
        { id: 7, title: 'مهر' },
        { id: 8, title: 'آبان' },
        { id: 9, title: 'آذر' },
        { id: 10, title: 'دی' },
        { id: 11, title: 'بهمن' },
        { id: 12, title: 'اسفند' },
    ];

    $scope.periodDs = [
         { id: 1, title: '12/16 - 01/15' },
         { id: 2, title: '01/16 - 02/15' },
         { id: 3, title: '02/16 - 03/15' },
         { id: 4, title: '03/16 - 04/15' },
         { id: 5, title: '04/16 - 05/15' },
         { id: 6, title: '05/16 - 06/15' },
         { id: 7, title: '06/16 - 07/15' },
         { id: 8, title: '07/16 - 08/15' },
         { id: 9, title: '08/16 - 09/15' },
         { id: 10, title: '09/16 - 10/15' },
         { id: 11, title: '10/16 - 11/15' },
         { id: 12, title: '11/16 - 12/15' },
    ];
    $scope.sb_month = {
        placeholder: 'Period',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.periodDs,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'month',


        }
    };
    $scope.rank = 'All';
    $scope.sb_rank = {
        placeholder: 'Rank',
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['All', 'Cockpit', 'Cabin', 'IP', 'P1', 'P2', 'SCCM', 'CCM', 'ISCCM'],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'rank',


        }
    };
    ////////////////////////////////
    $scope.dg_height = $(window).height() - 170;
    ////////////////////////////////
    $scope.dg_fix_columns = [


    { dataField: 'JobGroupRoot', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
     { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
     { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,minWidth:200 },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200 },
        { dataField: 'FixTime2', caption: 'Fixed Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'FixTimeTotal2', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Mission2', caption: 'Mission', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110 },
        {
            caption: 'Redirect', columns: [
                { dataField: 'RedirectFixTime2', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'Redirect', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width:80,   },
            ]
        },
        {
            caption: 'Taxi', columns: [
                { dataField: 'PosFixTime2', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'Pos', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, },
            ]
        },
        { dataField: 'FX3000032', caption: 'گارانتی', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FX3000022', caption: 'رمپ', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FX3000042', caption: 'مسئولیت', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FX3000052', caption: 'تاخیرات', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FX3000062', caption: 'متفرقه', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },


    
       
        {
            caption: 'DeadHead', columns: [
                { dataField: 'DeadHeadFixTime2', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'DeadHead', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, },
            ]
        },
        { dataField: 'StandBy', caption: 'STBY', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        //lay
        { dataField: 'FX300007', caption: 'LayOver', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left', },

        { dataField: 'FlightTime2', caption: 'F/L', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'BlockTime2', caption: 'B/L', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
           //Redirect
      //RedirectFixTime
      { dataField: 'Leg1', caption: '1 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
      { dataField: 'Leg2', caption: '2 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
      { dataField: 'Leg3', caption: '3 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
      { dataField: 'Leg4', caption: '4 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
      { dataField: 'Leg5', caption: '5 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
      { dataField: 'Leg6', caption: '6 Leg', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },


    ];
    $scope.dg_fix_selected = null;
    $scope.dg_fix_instance = null;
    $scope.dg_fix_ds = null;
    $scope.dg_fix = {
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


        columns: $scope.dg_fix_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fix_instance)
                $scope.dg_fix_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fix_selected = null;
            }
            else
                $scope.dg_fix_selected = data;


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
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                {
                    name: "FixTimeTotal",
                    showInColumn: "FixTimeTotal2",
                    displayFormat: "Total: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "MissionTotal",
                     showInColumn: "Mission2",
                     displayFormat: "Total: {0}",

                     summaryType: "custom"
                 },


                     {
                         column: "StandBy",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return "Total: " + data.value;
                         }
                     },
                      {
                          column: "Legs",
                          summaryType: "sum",
                          customizeText: function (data) {
                              return "Total: " + data.value;
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

                if (options.name === "MissionTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Misson;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTimeTotal;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

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
            dataSource: 'dg_fix_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_no_columns = [


 { dataField: 'JobGroupRoot', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
     { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },





    ];
    $scope.dg_no_selected = null;
    $scope.dg_no_instance = null;
    $scope.dg_no_ds = null;
    $scope.dg_no = {
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


        columns: $scope.dg_no_columns,
        onContentReady: function (e) {
            if (!$scope.dg_no_instance)
                $scope.dg_no_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_no_selected = null;
            }
            else
                $scope.dg_no_selected = data;


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
                        column: "TotalSeat",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return data.value;
                        }
                    },
                    {
                        column: "TotalSeat",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
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
            fileName: "MD_Monthly_Report",
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
            dataSource: 'dg_no_ds',
            height: 'dg_height',
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.bind_fixtimes = function () {
        $scope.dg_fixtime_ds = null;
        $scope.loadingVisible = true;
        flightService.getFixTimes().then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_fixtime_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.popup_fixtime_visible = false;
    $scope.popup_fixtime_title = 'Routes Fix Time';


    $scope.popup_fixtime = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fixtime"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: 1000,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
             {
                 widget: 'dxButton', location: 'before', options: {
                     type: 'default', text: 'New', icon: '', onClick: function (e) {
                         $scope.fx_edit = 0;
                         $scope.fx_changed = false;
                         $scope.popup_fixtimeadd_visible = true;
                         //$scope.loadingVisible = true;
                         //flightService.getFlightsLine($scope.flight.ID).then(function (response) {
                         //    $scope.loadingVisible = false;


                         //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                     }
                 }, toolbar: 'bottom'
             },
{
    widget: 'dxButton', location: 'before', options: {
        type: 'default', text: 'Edit', icon: '', onClick: function (e) {
            $scope.dg_fixtime_selected = $rootScope.getSelectedRow($scope.dg_fixtime_instance);
            if (!$scope.dg_fixtime_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.fx_route = $scope.dg_fixtime_selected.Route;
            $scope.fx_hh = $scope.dg_fixtime_selected.Hour;
            $scope.fx_mm = $scope.dg_fixtime_selected.Minute;
            $scope.fx_edit = 1;
            $scope.fx_changed = false;
            $scope.popup_fixtimeadd_visible = true;
            //$scope.loadingVisible = true;
            //flightService.getFlightsLine($scope.flight.ID).then(function (response) {
            //    $scope.loadingVisible = false;


            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




        }
    }, toolbar: 'bottom'
},
{
    widget: 'dxButton', location: 'before', options: {
        type: 'danger', text: 'Delete', icon: '', onClick: function (e) {
            $scope.dg_fixtime_selected = $rootScope.getSelectedRow($scope.dg_fixtime_instance);
            if (!$scope.dg_fixtime_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { route: $scope.dg_fixtime_selected.Route, userName: $rootScope.userName };
                    $scope.loadingVisible = true;
                    flightService.deleteFixTime(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        
                        $scope.bind_fixtimes();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });
            //$scope.loadingVisible = true;
            //flightService.getFlightsLine($scope.flight.ID).then(function (response) {
            //    $scope.loadingVisible = false;


            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




        }
    }, toolbar: 'bottom'
},
          {
              widget: 'dxButton', location: 'after', options: {
                  type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                      $scope.popup_fixtime_visible = false;

                  }
              }, toolbar: 'bottom'
          }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            $scope.bind_fixtimes();
            if ($scope.dg_fixtime_instance)
                $scope.dg_fixtime_instance.refresh();
        },
        onHiding: function () {


            $scope.dg_fixtime_ds = null;
            $scope.popup_fixtime_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fixtime_visible',

            title: 'popup_fixtime_title',

        }
    };
    /////////////////////////////////////

    
    $scope.popup_details_visible = false;
    $scope.popup_details_title = 'Details';


    $scope.popup_details = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_details"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 770,
        width: 1300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Set Fix Time', icon: '', onClick: function (e) {
                        $scope.dg_details_selected = $rootScope.getSelectedRow($scope.dg_details_instance);
                        if (!$scope.dg_details_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                    
                        if ($scope.dg_details_selected.FixTime2)
                        {
                            General.ShowNotify("The route fix time already defined", 'error');
                            return;
                        }
                        $scope.fx_route = $scope.dg_details_selected.Route;
                        $scope.fx_hh = Math.floor($scope.dg_details_selected.FixTime / 60);
                        $scope.fx_mm = Math.floor($scope.dg_details_selected.FixTime % 60);
                        
                        $scope.fx_edit = 0;
                        $scope.fx_changed = false;
                        $scope.popup_fixtimeadd_visible = true;
                        //$scope.loadingVisible = true;
                        //flightService.getFlightsLine($scope.flight.ID).then(function (response) {
                        //    $scope.loadingVisible = false;


                        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
          {
              widget: 'dxButton', location: 'after', options: {
                  type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                      $scope.popup_details_visible = false;

                  }
              }, toolbar: 'bottom'
          }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {
             
        },
        onShown: function (e) {
             
            $scope.bind_details($scope.dg_fix_selected.CrewId);
            if ($scope.dg_details_instance)
                $scope.dg_details_instance.refresh();
        },
        onHiding: function () {


            $scope.dg_details_ds = null;
            $scope.popup_details_visible = false;

        },
        bindingOptions: {
            visible: 'popup_details_visible',

            title: 'popup_details_title',

        }
    };
    //////////////////////////////////////
    $scope.fx_route = null;
    $scope.fx_hh = null;
    $scope.fx_mm = null;
    $scope.txt_fx_route = {
         
        bindingOptions: {
            value: 'fx_route',
 
        }
    };
    $scope.num_fx_hh = {
        min:0,
        bindingOptions: {
            value: 'fx_hh',

        }
    };
    $scope.num_fx_mm = {
        min: 0,
        bindingOptions: {
            value: 'fx_mm',

        }
    };
    $scope.popup_fixtimeadd_visible = false;
    $scope.popup_fixtimeadd_title = 'Fix Time';

    $scope.fx_edit = 0;
    $scope.fx_changed = false;
    $scope.popup_fixtimeadd = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fixtimeadd"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 270,
        width: 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
             {
                 widget: 'dxButton', location: 'after', options: {
                     type: 'success', text: 'Save', validationGroup: 'fxadd', icon: '', onClick: function (arg) {
                         var result = arg.validationGroup.validate();
                         if (!result.isValid) {
                             General.ShowNotify(Config.Text_FillRequired, 'error');
                             return;
                         }
                         var dto = {
                             edit: $scope.fx_edit,
                             route: $scope.fx_route,
                             hh: $scope.fx_hh,
                             mm: $scope.fx_mm,
                             userName: $rootScope.userName,
                         };
                         $scope.loadingVisible = true;
                         flightService.saveFixTimeBase(dto).then(function (response) {
                             $scope.loadingVisible = false;
                             console.log(response);
                             if (response.Code == 200) {
                                 $scope.fx_changed = true;
                                 General.ShowNotify(Config.Text_SavedOk, 'success');
                                 $scope.fx_route = null;
                                 $scope.fx_hh = null;
                                 $scope.fx_mm = null;
                                 if ($scope.fx_edit == 1) {
                                     $scope.dg_fixtime_selected.FixTime = response.data.FixtTime;
                                     $scope.dg_fixtime_selected.FixTime2 = response.data.FixTime2;
                                     //pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
                                     $scope.dg_fixtime_selected.Hour = Math.floor(response.data.FixtTime / 60);
                                     $scope.dg_fixtime_selected.Minute = Math.floor(response.data.FixtTime % 60);
                                     console.log($scope.dg_fixtime_selected);
                                     $scope.popup_fixtimeadd_visible = false;
                                 }
                                 else
                                 {
                                     if ($scope.popup_fixtime_visible)
                                         $scope.bind_fixtimes();
                                     else if ($scope.popup_details_visible)
                                     {
                                         $scope.bind();
                                         $scope.bind_details($scope.dg_fix_selected.CrewId);
                                         $scope.popup_fixtimeadd_visible = false;
                                     }
                                 }
                             }
                             else
                             {
                                 General.ShowNotify(response.data.message, 'error');
                             }
                             

                         }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                     }
                 }, toolbar: 'bottom'
             },
 
          {
              widget: 'dxButton', location: 'after', options: {
                  type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                      $scope.popup_fixtimeadd_visible = false;

                  }
              }, toolbar: 'bottom'
          }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {
             
        },
        onShown: function (e) {
            
            
        },
        onHiding: function () {
            $scope.fx_route = null;
            $scope.fx_hh = null;
            $scope.fx_mm = null;
            if ($scope.bound && $scope.fx_changed)
            {
                $scope.bind();
            }
            $scope.popup_fixtimeadd_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fixtimeadd_visible',

            title: 'popup_fixtimeadd_title',

        }
    };
    //////////////////////////////////////
    $scope.dg_fixtime_columns = [


    { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', },
     { dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 200, format: 'hh:mm', },

    ];
    $scope.dg_fixtime_selected = null;
    $scope.dg_fixtime_instance = null;
    $scope.dg_fixtime_ds = null;
    $scope.dg_fixtime = {
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
        height:580,
        columnAutoWidth: false,


        columns: $scope.dg_fixtime_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fixtime_instance)
                $scope.dg_fixtime_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fixtime_selected = null;
            }
            else
                $scope.dg_fixtime_selected = data;


        },
       
        onRowPrepared: function (e) {
            //if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },


        bindingOptions: {
            dataSource: 'dg_fixtime_ds',
             
        },
        columnChooser: {
            enabled: false
        },

    };
    /////////////////////////////////////
    $scope.dg_details_columns = [
         {
             cellTemplate: function (container, options) {
                 $("<div style='text-align:center'/>")
                     .html(options.rowIndex + 1)
                     .appendTo(container);
             }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false,
         },
{ dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
    { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
    
    { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left',width:280 },
    { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 230, },
    { dataField: 'Legs', caption: 'Legs', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, },
    //ScheduledTimeX
    { dataField: 'ScheduledTimeX', caption: 'SCH. Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
    { dataField: 'FlightTimeX', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
    { dataField: 'BlockTimeX', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
     { dataField: 'FixTimeX', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },

    ];
    $scope.dg_details_selected = null;
    $scope.dg_details_instance = null;
    $scope.dg_details_ds = null;
    $scope.dg_details = {
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
        height:600,
        columnAutoWidth: false,


        columns: $scope.dg_details_columns,
        onContentReady: function (e) {
            if (!$scope.dg_details_instance)
                $scope.dg_details_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_dg_details_selected = null;
            }
            else
                $scope.dg_dg_details_selected = data;


        },
       
        onRowPrepared: function (e) {
            //if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FixTimeX" && !e.data.FixTime2)
                e.cellElement.addClass('no-fixtime');
        },
        summary: {
            totalItems: [
                   {
                       column: "row",
                       summaryType: "count",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                  

                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTimeX",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                 
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTimeX",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "ScheduledTimeTotal",
                    showInColumn: "ScheduledTimeX",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                 {
                     name: "FixTimeTotal",
                     showInColumn: "FixTimeX",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },


                 {
                     column: "Legs",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
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

                if (options.name === "ScheduledTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ScheduledTime;
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
        bindingOptions: {
            dataSource: 'dg_details_ds',
             
        },
        columnChooser: {
            enabled: false
        },

    };
    ////////////////////////////////////
    $scope.dg_stby_columns = [
         {
             cellTemplate: function (container, options) {
                 $("<div style='text-align:center'/>")
                     .html(options.rowIndex + 1)
                     .appendTo(container);
             }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false,  
         },
{ dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
    { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },

    { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 200 },
    
   
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        { dataField: 'CountX', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
     { dataField: 'DurationX', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
     
    ];
    $scope.dg_stby_selected = null;
    $scope.dg_stby_instance = null;
    $scope.dg_stby_ds = null;
    $scope.dg_stby = {
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
        height: 600,
        columnAutoWidth: false,


        columns: $scope.dg_stby_columns,
        onContentReady: function (e) {
            if (!$scope.dg_stby_instance)
                $scope.dg_stby_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_dg_stby_selected = null;
            }
            else
                $scope.dg_dg_stby_selected = data;


        },

        onRowPrepared: function (e) {
            //if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },
        onCellPrepared: function (e) {
          //  if (e.rowType === "data" && e.column.dataField == "FixTimeX" && !e.data.FixTime2)
         //       e.cellElement.addClass('no-fixtime');
        },
        summary: {
            totalItems: [



                {
                    name: "DurationTotal",
                    showInColumn: "DurationX",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },

                 

                 {
                     column: "row",
                     summaryType: "count",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },



            ],
            calculateCustomSummary: function (options) {

                if (options.name === "DurationTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {
                        if (options.value.Duration) {
                            options.totalValueMinutes = options.totalValueMinutes + options.value.Duration;
                            options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                        }
                       


                    }
                }


                


            }
        },
        bindingOptions: {
            dataSource: 'dg_stby_ds',

        },
        columnChooser: {
            enabled: false
        },

    };

    ///////////////////////////
    //Reposition
    $scope.dg_deadhead_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false,
        },
        { dataField: 'PDate', caption: 'Date(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'STDDayLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },

        { dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },

    ];
    $scope.dg_deadhead_selected = null;
    $scope.dg_deadhead_instance = null;
    
    $scope.dg_deadhead = {
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
        height: 600,
        columnAutoWidth: false,


        columns: $scope.dg_deadhead_columns,
        onContentReady: function (e) {
            if (!$scope.dg_deadhead_instance)
                $scope.dg_deadhead_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_deadhead_selected = null;
            }
            else
                $scope.dg_deadhead_selected = data;


        },

        
      
        bindingOptions: {
            dataSource: 'details_deadhead',

        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.dg_redirect_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false,
        },
        { dataField: 'PDate', caption: 'Date(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'STDDayLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },

        { dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },


    ];
    $scope.dg_redirect_selected = null;
    $scope.dg_redirect_instance = null;

    $scope.dg_redirect = {
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
        height: 600,
        columnAutoWidth: false,


        columns: $scope.dg_redirect_columns,
        onContentReady: function (e) {
            if (!$scope.dg_redirect_instance)
                $scope.dg_redirect_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_redirect_selected = null;
            }
            else
                $scope.dg_redirect_selected = data;


        },



        bindingOptions: {
            dataSource: 'details_redirect',

        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.dg_repos_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false,
        },
        { dataField: 'PDate', caption: 'Date(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateFDP', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },

        { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',   },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',   },
       
        { dataField: 'Pos1', caption: 'Pos 1', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'Pos2', caption: 'Pos 2', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'Pos', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        


    ];
    $scope.dg_repos_selected = null;
    $scope.dg_repos_instance = null;

    $scope.dg_repos = {
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
        height: 600,
        columnAutoWidth: false,


        columns: $scope.dg_repos_columns,
        onContentReady: function (e) {
            if (!$scope.dg_repos_instance)
                $scope.dg_repos_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_repos_selected = null;
            }
            else
                $scope.dg_repos_selected = data;


        },



        bindingOptions: {
            dataSource: 'details_repos',

        },
        columnChooser: {
            enabled: false
        },

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
    //////////////////////////////////
    $scope.formatMinutes = function (mm) {
        if (!mm && mm!==0)
            return '-';
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    //////////////////////////////////
    $scope.bound = false;
    $scope.bind = function () {
        // var yf = 2020;
        // var yt = 2020;
        $scope.dg_fix_ds = null;
        $scope.dg_no_ds = null;


        $scope.loadingVisible = true;
        flightService.getCrewFixTimePeriodReport($scope.yf, $scope.month, $scope.rank).then(function (response) {



            $scope.loadingVisible = false;
            $.each(response.fixDs, function (_i, _d) {

                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Mission2 = $scope.formatMinutes(_d.Misson);
                _d.FixTimeTotal2 = $scope.formatMinutes(_d.FixTimeTotal);
                _d.ScheduledTime2 = $scope.formatMinutes(_d.ScheduledTime);

                if (!_d.RedirectFixTime)
                    _d.RedirectFixTime = 0;
                _d.RedirectFixTime2 = $scope.formatMinutes(_d.RedirectFixTime);

                if (!_d.DeadHeadFixTime)
                    _d.DeadHeadFixTime = 0;
                _d.DeadHeadFixTime2 = $scope.formatMinutes(_d.DeadHeadFixTime);

                if (!_d.PosFixTime) _d.PosFixTime = 0;
                _d.PosFixTime2 = $scope.formatMinutes(_d.PosFixTime);
                if (_d.PosFixTime != 0)
                    console.log('POS FIX', _d.PosFixTime);
                if (!_d.FX300003) _d.FX300003 = 0;
                _d.FX3000032 = $scope.formatMinutes(_d.FX300003);

                if (!_d.FX300002) _d.FX300002 = 0;
                _d.FX3000022 = $scope.formatMinutes(_d.FX300002);

                if (!_d.FX300004) _d.FX300004 = 0;
                _d.FX3000042 = $scope.formatMinutes(_d.FX300004);

                if (!_d.FX300005) _d.FX300005 = 0;
                _d.FX3000052 = $scope.formatMinutes(_d.FX300005);

                if (!_d.FX300006) _d.FX300006 = 0;
                _d.FX3000062 = $scope.formatMinutes(_d.FX300006);




            });


            $scope.bound = true;
            $scope.dg_fix_ds = response.fixDs;
            $scope.dg_no_ds = response.noDs;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.bind_details = function (crew) {
        // var yf = 2020;
        // var yt = 2020;
        $scope.dg_details_ds = null;
        


        $scope.loadingVisible = true;
        flightService.getCrewFixTimePeriodReportCrew($scope.yf, $scope.month, crew).then(function (response) {



            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.FixTimeX = $scope.formatMinutes(_d.FixTime);
                 _d.FlightTimeX = $scope.formatMinutes(_d.FlightTime);
                 _d.BlockTimeX = $scope.formatMinutes(_d.BlockTime);
                 
                 _d.ScheduledTimeX = $scope.formatMinutes(_d.ScheduledTime);
            });



            $scope.dg_details_ds = response;
            //momo
            flightService.getCrewFixTimePeriodReportCrewNoFDP($scope.yf, $scope.month, crew).then(function (response2) {
                $.each(response2, function (_i, _d) {
                     
                    _d.DurationX = $scope.formatMinutes(_d.Duration);
                    //lay
                    if (['StandBy','LayOver', 'OTHER AIRLINE STBY'].indexOf(_d.DutyTypeTitle) != -1) {
                        _d.CountX = _d.Duration;
                        _d.Duration = null;
                        _d.DurationX = null;
                    }
                    //if (['StandBy' ].indexOf( _d.DutyTypeTitle) != -1) {
                    //    _d.Duration = null;
                    //    _d.DurationX = null;
                    //}
                    
                });
                $scope.dg_stby_ds = response2;

                ////REPOSITIONING
                $scope.details_deadhead = null;
                $scope.details_repos = null;
                $scope.details_redirect = null;
                flightService.getCrewFixTimePeriodReportCrewOthers($scope.yf, $scope.month, crew).then(function (response3) {
                    console.log('others', response3);
                    $scope.details_deadhead = response3.deadhead;
                    $scope.details_repos = response3.repos;
                    $scope.details_redirect = response3.redirect;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                //////////////////////////



             }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    /////////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '>  Monthly Fix Time Report';


        $('.fixtimereport').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        if ($scope.dg_fix_instance)
            $scope.dg_fix_instance.repaint();
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);