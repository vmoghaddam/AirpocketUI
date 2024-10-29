'use strict';
app.controller('reportFlightsController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
	var isTaxiVisible=false;
	 if ($rootScope.userName.toLowerCase() == 'ashrafi')
		 isTaxiVisible=true;
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.bind();
            //var result = e.validationGroup.validate();

            //if (!result.isValid) {
            //    General.ShowNotify(Config.Text_FillRequired, 'error');
            //    return;
            //}
            //$scope.dg_flight_total_ds = null;
            //$scope.dg_flight_ds = null;
            //var caption = 'From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD');
            //$scope.dg_flight_total_instance.columnOption('date', 'caption', caption);
            //$scope.getCrewFlightsTotal($scope.dt_from, $scope.dt_to);
        }

    };
    /////////////////////////////////////////
    $scope.bind = function () {
        //iruser558387
        var dts = [];
        if ($scope.dt_to) {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('dt=' + _dt);
        }
        if ($scope.dt_from) {
            var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('df=' + _df);
        }
        dts.push('status=' + ($scope.fstatus ? $scope.fstatus : 'null'));
        dts.push('ip=' + ($scope.ip ? $scope.ip : 'null'));
        dts.push('cpt=' + ($scope.cpt ? $scope.cpt : 'null'));


        var prms = dts.join('&');


        var url = 'odata/report/flights';//2019-06-06T00:00:00';
        if (prms)
            url += '?' + prms;

        if (!$scope.dg_flight_ds) {

            $scope.dg_flight_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "ID",
                    version: 4,
                    onLoaded: function (e) {

                        //dooki
                        $.each(e, function (_i, _d) {

                            var std = (new Date(_d.STDDay));
                            persianDate.toLocale('en');
                            _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                            _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                            _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                            _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                            _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);

                            _d.TaxiTO = subtractDates(_d.Takeoff, _d.ChocksOut);
                            _d.TaxiLND = subtractDates(_d.ChocksIn, _d.Landing);
                            _d.TaxiTO2 = $scope.formatMinutes(_d.TaxiTO);
                            _d.TaxiLND2 = $scope.formatMinutes(_d.TaxiLND);


                        });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);


                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-30);
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
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
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
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;

                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                _d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
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
    ////////////////////////////////////
    $scope.statusDs = [
        { Id: 1, Title: 'Done' },
         { Id: 2, Title: 'Scheduled' },
         { Id: 3, Title: 'Canceled' },
         { Id: 4, Title: 'Starting' },
          { Id: 5, Title: 'All' },
    ];
    $scope.fstatus = 1;
    $scope.sb_Status = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.statusDs,

        onSelectionChanged: function (arg) {

        },
         
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fstatus',


        }
    };


    $scope.ip = null;
    $scope.sb_IP = {
        placeholder: 'IP',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceIP(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'ip',


        }
    };
    $scope.cpt = null;
    $scope.sb_CPT = {
        placeholder: 'Captain',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCaptain(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cpt',


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

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 1, sortOrder: 'asc' },
          { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'STDLocal', caption: 'Sch. Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
         { dataField: 'STALocal', caption: 'Sch. Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
          { dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
         { dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
         


           { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
             { dataField: 'PaxChild', caption: 'Child.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
               { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                 { dataField: 'TotalPax', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

                 // { dataField: 'FuelDeparture', caption: 'UpLift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
             { dataField: 'CargoCount', caption: 'Cargo', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
              { dataField: 'CargoWeight', caption: 'Cargo(W)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
              
                 { dataField: 'BaggageCount', caption: 'Baggage', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                  { dataField: 'BaggageWeight', caption: 'Baggage(W)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },



  //{ dataField: 'CockpitTotal', caption: 'Cockpit', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
 // { dataField: 'CabinTotal', caption: 'Cabin', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
           { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              { dataField: 'Captain', caption: 'Captain', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
              //   { dataField: 'FO', caption: 'FO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                 //   { dataField: 'Safety', caption: 'Safety', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

                  { dataField: 'TaxiTO2', caption: 'Taxi T/O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right',visible:isTaxiVisible },
                   { dataField: 'TaxiLND2', caption: 'Taxi LND', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right',visible:isTaxiVisible },

        { dataField: 'FlightTime2', caption: 'Sch. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'SITATime2', caption: 'SITA FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'FlightTimeActual2', caption: 'Act. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
       // { dataField: 'ActualFlightTimeToSITA', caption: 'Actual/SITA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },








    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
            totalItems: [
                 {
                     name: "TaxiTOTotal",
                     showInColumn: "TaxiTO2",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },
                  {
                      name: "TaxiLNDTotal",
                      showInColumn: "TaxiLND2",
                      displayFormat: "{0}",

                      summaryType: "custom"
                  },
                   {
                       name: "TaxiTOAvg",
                       showInColumn: "TaxiTO2",
                       displayFormat: "Avg: {0}",

                       summaryType: "custom"
                   },
                    {
                        name: "TaxiLNDAvg",
                        showInColumn: "TaxiLND2",
                        displayFormat: "Avg: {0}",

                        summaryType: "custom"
                    },

                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     name: "ActualFlightTimeTotal",
                     showInColumn: "FlightTimeActual2",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },
                 {
                     name: "ActualFlightTimeAvg",
                     showInColumn: "FlightTimeActual2",
                     displayFormat: "Avg: {0}",

                     summaryType: "custom"
                 },
                {
                    name: "SITATimeTotal",
                    showInColumn: "SITATime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "SITATimeAvg",
                    showInColumn: "SITATime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                 {
                     column: "PaxAdult",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                  {
                      column: "PaxAdult",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                  {
                      column: "PaxChild",
                      summaryType: "sum",
                      customizeText: function (data) {
                          return data.value;
                      }
                  },
                  {
                      column: "PaxChild",
                      summaryType: "avg",
                      customizeText: function (data) {
                          return 'Avg: ' + Number(data.value).toFixed(1);
                      }
                  },
                   {
                       column: "PaxInfant",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
                       }
                   },
                    {
                        column: "PaxInfant",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },
                   {
                       column: "TotalPax",
                       summaryType: "sum",
                       customizeText: function (data) {
                           return data.value;
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
                        column: "CockpitTotal",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },
                    {
                        column: "CabinTotal",
                        summaryType: "avg",
                        customizeText: function (data) {
                            return 'Avg: ' + Number(data.value).toFixed(1);
                        }
                    },

                     {
                         column: "FuelDeparture",
                         summaryType: "sum",
                         customizeText: function (data) {
                             return data.value;
                         }
                     },
                      {
                          column: "CargoCount",
                          summaryType: "sum",
                          customizeText: function (data) {
                              return data.value;
                          }
                      },
                        {
                            column: "CargoWeight",
                            summaryType: "sum",
                            customizeText: function (data) {
                                return data.value;
                            }
                        },
                          {
                              column: "BaggageWeight",
                              summaryType: "sum",
                              customizeText: function (data) {
                                  return data.value;
                              }
                          },
                           {
                               column: "BaggageCount",
                               summaryType: "sum",
                               customizeText: function (data) {
                                   return data.value;
                               }
                           },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "ActualFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "ActualFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
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
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.FlightTime);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "SITATimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "SITATimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
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

                if (options.name === "TaxiTOTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "TaxiLNDTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "TaxiTOAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "TaxiLNDAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "Flights_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
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

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus"  )
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: true
        },
       
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights Report';


        $('.reportflights').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);