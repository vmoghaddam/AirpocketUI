'use strict';
app.controller('reportFlightsController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route','$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route,$window) {
    $scope.prms = $routeParams.prms;
    $scope.IsFBVisible = $rootScope.userName.toLowerCase().includes("demo") || $rootScope.userName.toLowerCase().includes("kabiri")
        || $rootScope.userName.toLowerCase().includes("razbani");
    var isTaxiVisible=false;
	 if ($rootScope.userName.toLowerCase() == 'ashrafi')
        isTaxiVisible = true; 


    $scope.getStation = function () {
        switch ($rootScope.userName.toLowerCase()) {
            //H.GHASEMI
            case 'h.ghasemi':
                return 'THR';
            case 's.jokar':
                return 'SYZ';
            //G.Akhlaghi
            case 'g.akhlaghi':
                return 'KIH';
            case 'm.jabari':
                return 'MHD';

            default:
                return null;
        }
    };
    var _station = $scope.getStation();


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

    $scope.btn_efbs = {
        text: 'EFB Report',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            $window.open('#!/flights/efbs/', '_blank');



        },
        
    };



    $scope.btn_asr = {
        text: 'ASR',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitAsrAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };
    $scope.btn_vr = {
        text: 'Voyage Report',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitVrAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };
    $scope.btn_dr = {
        text: 'Dispatch Release',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
         
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitDrAdd', data);

           

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };
    $scope.btn_ofp = {
        text: 'OFP',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitOFPAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };
      $scope.btn_log = {
        text: 'Log',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitLogAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };

    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



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
        $scope.loadingVisible = true;
        
        flightService.getFlightReport(url).then(function (response) {
            $scope.loadingVisible = false;
            if (_station) {
                response = Enumerable.From(response).Where(function (x) { return x.FromAirportIATA == _station || x.ToAirportIATA == _station }).ToArray();
            }
            $.each(response, function (_i, _d) {
                var std = (new Date(_d.STDDay));
                persianDate.toLocale('en');
                _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);

                _d.JLBlockTime2 = $scope.formatMinutes(_d.JLBlockTime);
                _d.JLFlightTime2 = $scope.formatMinutes(_d.JLFlightTime);

                _d.TaxiTO = subtractDates(_d.Takeoff, _d.ChocksOut);
                _d.TaxiLND = subtractDates(_d.ChocksIn, _d.Landing);
                _d.TaxiTO2 = $scope.formatMinutes(_d.TaxiTO);
                _d.TaxiLND2 = $scope.formatMinutes(_d.TaxiLND);

                //magu6
                _d.TotalPaxAll = _d.TotalPax + _d.PaxInfant;
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        /*if (!$scope.dg_flight_ds) {

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

                            _d.JLBlockTime2 = $scope.formatMinutes(_d.JLBlockTime);
                            _d.JLFlightTime2 = $scope.formatMinutes(_d.JLFlightTime);

                            _d.TaxiTO = subtractDates(_d.Takeoff, _d.ChocksOut);
                            _d.TaxiLND = subtractDates(_d.ChocksIn, _d.Landing);
                            _d.TaxiTO2 = $scope.formatMinutes(_d.TaxiTO);
                            _d.TaxiLND2 = $scope.formatMinutes(_d.TaxiLND);

                            //magu6
                            _d.TotalPaxAll = _d.TotalPax + _d.PaxInfant;


                        });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);


                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                

            };
        }*/

        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(0);
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
    $scope.dg_flight_columns = [];
    if ($rootScope.userName.toLowerCase() !='bakhshi')
    $scope.dg_flight_columns = [


                  {
                      cellTemplate: function (container, options) {
                          $("<div style='text-align:center'/>")
                              .html(options.rowIndex + 1)
                              .appendTo(container);
                      }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible:false },
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightType', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, sortIndex: 1, sortOrder: 'asc' },
          { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'STDLocal', caption: 'Sch. Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
         { dataField: 'STALocal', caption: 'Sch. Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
          { dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
         { dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
         


           { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
             { dataField: 'PaxChild', caption: 'Child.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
               { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
               //magu6
        { dataField: 'TotalPax', caption: 'Revenued Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        { dataField: 'TotalPaxAll', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

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



                  { dataField: 'JLBlockTime2', caption: 'J/L Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
                   { dataField: 'JLFlightTime2', caption: 'J/L Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },

                  { dataField: 'TaxiTO2', caption: 'Taxi T/O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right',visible:isTaxiVisible },
                   { dataField: 'TaxiLND2', caption: 'Taxi LND', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right',visible:isTaxiVisible },

        { dataField: 'FlightTime2', caption: 'Sch. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'SITATime2', caption: 'SITA FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'FlightTimeActual2', caption: 'Act. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
       // { dataField: 'ActualFlightTimeToSITA', caption: 'Actual/SITA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },








        ];
    else
        $scope.dg_flight_columns = [


            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, name: 'row', caption: '#', width: 70, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },
            { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },
            { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
            { dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
            { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
            { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, sortIndex: 2, sortOrder: 'asc' },

            
             
            { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
            { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
            { dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
            { dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },



            { dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
            { dataField: 'PaxChild', caption: 'Child.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
            { dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
            //magu6
            { dataField: 'TotalPax', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, },
            //{ dataField: 'TotalPaxAll', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

             

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
        paging: { pageSize: 500 },
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
                     column: "row",
                     summaryType: "count",
                     customizeText: function (data) {
                         return  data.value;
                     }
                 },
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
                    name: "JLBlockTimeTotal",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLBlockTimeAvg",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "JLFlightTimeTotal",
                    showInColumn: "JLFlightTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLFlightTimeAvg",
                    showInColumn: "JLFlightTime2",
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
                    //magu6
                {
                    column: "TotalPaxAll",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "TotalPaxAll",
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
                if (options.name === "JLFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;

                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.JLFlightTime);
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
                if (options.name === "JLBlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
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
            allowExportSelectedData: false,
            
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
            e.component.columnOption("rn", "visible", true);
           
            
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
           e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');
            
            if (e.rowType == 'data' && e.data) {
                e.data['RN'] = e.rowIndex+1;
            }
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
    //12-05
    $scope.btn_fdp = {
        text: 'Crew Count',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            $scope.popup_fdp_visible = true;



        },

    };


    $scope.dg_fdp_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },
        { dataField: 'DateLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'FltNo', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,    fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        



        { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
        

        { dataField: 'CockpitCount', caption: 'Cockpit', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, },
        { dataField: 'CabinCount', caption: 'Cabin', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, },
         
        { dataField: 'TotalCrew', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150},
        //{ dataField: 'TotalPaxAll', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },



    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_fdp_selected = null;
    $scope.dg_fdp_instance = null;
    $scope.dg_fdp_ds = null;
    $scope.dg_fdp = {
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
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 170,

        columns: $scope.dg_fdp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fdp_instance)
                $scope.dg_fdp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fdp_selected = null;
            }
            else
                $scope.dg_fdp_selected = data;


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
                    column: "CockpitCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                
                {
                    column: "CabinCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                 
                {
                    column: "Total",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                 

            ],
            calculateCustomSummary: function (options) { 
                
                



            }
        },
        "export": {
            enabled: true,
            fileName: "Crew_Count",
            allowExportSelectedData: false,

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
            e.component.columnOption("rn", "visible", true);


        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            

            if (e.rowType == 'data' && e.data) {
                e.data['RN'] = e.rowIndex + 1;
            }
        },

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
        },
        bindingOptions: {
            dataSource: 'dg_fdp_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.bindFDP = function () {
        $scope.loadingVisible = true;
        if (!$scope.dt_from || !$scope.dt_to) {
            General.ShowNotify("Please select dates.", 'error');
            return;
        }
         
            var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
           
        
            var _df = moment($scope.dt_from).format('YYYY-MM-DD');
          

        flightService.getFDPsCrewCount(_df,_dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                if (!_d.CockpitCount) _d.CockpitCount = 0;
                if (!_d.CabinCount) _d.CabinCount = 0;
                _d.TotalCrew = _d.CockpitCount + _d.CabinCount;

            });
            $scope.dg_fdp_ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.popup_fdp_visible = false;
    $scope.popup_fdp_title = 'Crew Count';

    /////qeshm
    //catering
    $scope.btn_ctr = {
        text: 'Catering',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            $scope.popup_ctr_visible = true;



        },

    };


    $scope.dg_ctr_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: false, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },
       
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 2, sortOrder: 'asc' },
       
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string',width:100, allowEditing: false, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },



        { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
        { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm' },


        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
        { dataField: 'IATA', caption: 'Station', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, },
        { dataField: 'AmountLoaded', caption: 'Loaded', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        { dataField: 'AmountOffLoaded', caption: 'Off Loaded', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', },
        
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300, },
    
        



    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_ctr_selected = null;
    $scope.dg_ctr_instance = null;
    $scope.dg_ctr_ds = null;
    $scope.dg_ctr = {
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
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 170,

        columns: $scope.dg_ctr_columns,
        onContentReady: function (e) {
            if (!$scope.dg_ctr_instance)
                $scope.dg_ctr_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_ctr_selected = null;
            }
            else
                $scope.dg_ctr_selected = data;


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
                    column: "AmountLoaded",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

                {
                    column: "AmountOffLoaded",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

               

            ],
            calculateCustomSummary: function (options) {





            }
        },
        "export": {
            enabled: true,
            fileName: "Catering_Report",
            allowExportSelectedData: false,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Catering</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
            e.component.columnOption("rn", "visible", true);


        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {


            if (e.rowType == 'data' && e.data) {
                e.data['RN'] = e.rowIndex + 1;
            }
        },

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
        },
        bindingOptions: {
            dataSource: 'dg_ctr_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.bindCTR = function () {
        $scope.loadingVisible = true;
        if (!$scope.dt_from || !$scope.dt_to) {
            General.ShowNotify("Please select dates.", 'error');
            return;
        }

        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');


        var _df = moment($scope.dt_from).format('YYYY-MM-DD');


        flightService.getCateringReport($scope.ctr_type,_df, _dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ctr_ds = response.data;
            //$scope.dg_fdp_ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.popup_ctr_visible = false;
    $scope.popup_ctr_title = 'Catering';
    $scope.ctr_type = -1;
    $scope.ctr_code_ds = [{ Id: -1, Title: 'All' }];
    $scope.popup_ctr = {

        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 50,
        width: $(window).width() - 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
            {
                widget: 'dxTextBox', location: 'before', options: {
                    text: 'Type:',  
                    width: 50,
                    readOnly:true,
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                   // dataSource: ['All', 'COCKPIT', 'CABIN'],
                    width: 250,
                    stylingMode:'outlined',
                    displayExpr: "Title",
                    valueExpr: 'Id',
                    onValueChanged: function (e) {
                        $scope.ctr_type = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'find', onClick: function (arg) {

                        $scope.bindCTR();

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_ctr_visible = false;

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
            flightService.getCateringCodes().then(function (response) {
                 
                $.each(response.data, function (_i, _d) {
                    $scope.ctr_code_ds.push(_d);
                });
                 
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            if ($scope.dg_ctr_instance)
                $scope.dg_ctr_instance.refresh();
        },
        onHiding: function () {


            $scope.dg_ctr_ds = null;
            $scope.popup_ctr_visible = false;

        },
        bindingOptions: {
            visible: 'popup_ctr_visible',

            title: 'popup_ctr_title',
           // 'toolbarItems[0].dataSource': 'ctr_code_ds',
            'toolbarItems[1].options.dataSource': 'ctr_code_ds',
            'toolbarItems[1].options.value' : 'ctr_type',

        }
    };

    //////
    
    $scope.popup_cduties = {
       
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height()-50,
        width: $(window).width()-200,
        fullScreen: false,
        showTitle: true, 
        dragEnabled: true,

        toolbarItems: [
             

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'find', onClick: function (arg) {

                        $scope.bindFDP();

                    }
                }, toolbar: 'bottom'
            },
             
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_fdp_visible = false;

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
            
            if ($scope.dg_fdp_instance)
                $scope.dg_fdp_instance.refresh();
        },
        onHiding: function () {

            
            $scope.dg_fdp_ds = null;
            $scope.popup_fdp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fdp_visible',

            title: 'popup_fdp_title',
            
        }
    };



    ///////////////////
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