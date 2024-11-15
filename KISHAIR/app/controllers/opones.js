'use strict';
app.controller('oponesController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'fbService', '$http', '$q', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, fbService, $http, $q) {
    $scope.prms = $routeParams.prms;


    $scope.IsJLOG = false;
    if ($rootScope.userName.toLowerCase() == 'ops.rezabandehlou' || $rootScope.userName.toLowerCase() == 'demo' || $rootScope.userName.toLowerCase() == 'shelli')
        $scope.IsJLOG = true;

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

    $scope.btn_search = {
        //text: 'Search',
        type: 'success',
        icon: 'search',
        width: 40,
        validationGroup: 'oponesrch',
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
  
   $scope.showJLOG=function(){
	   
	    var leg = $rootScope.getSelectedRow($scope.dg_board_instance);
            if (!leg) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.flight = leg;
            $scope.jlogEntity = {
                OffBlock: leg.JLOffBlock ? leg.JLOffBlock : leg.ChocksOut,
                OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                PFLR: leg.notes, //leg.PFLR,
                FuelUnitID: leg.FuelUnitID,
                UsedFuel: leg.UsedFuel,
                FuelArrival: leg.FuelArrival,
                FuelDeparture: leg.FuelDeparture,
                UsedFuel: leg.UsedFuel,
                FPFuel: leg.FPFuel,
                FuelActual: leg.FuelActual,
                Defuel: leg.Defuel,
                TOW: leg.ALT4,
                LNDW: leg.ALT5,
            };
            
            $scope.popup_jlog_visible = true;
   };

    $scope.btn_jlog = {
        hint: 'Fuel & Journey Log',
        type: 'default',
        icon: 'fas fa-gas-pump',
        width: '100%',

        onClick: function (e) {
            $scope.showJLOG();
            return;
            if (!$scope.selectedFlights || $scope.selectedFlights.length == 0) {
                General.ShowNotify(Config.Text_NoFlightSelected, 'error');
                return;
            }
            $scope.flight = $scope.selectedFlights[0];

            flightService.getLeg($scope.flight.ID).then(function (leg) {

                //dooltopol
                $scope.jlogEntity = {
                    OffBlock: leg.JLOffBlock ? leg.JLOffBlock : leg.ChocksOut,
                    OnBlock: leg.JLOnBlock ? leg.JLOnBlock : leg.ChocksIn,
                    TakeOff: leg.JLTakeOff ? leg.JLTakeOff : leg.Takeoff,
                    Landing: leg.JLLanding ? leg.JLLanding : leg.Landing,
                    PFLR: leg.PFLR,
                    FuelUnitID: leg.FuelUnitID,
                    UsedFuel: leg.UsedFuel,
                    FuelArrival: leg.FuelArrival,
                    FuelDeparture: leg.FuelDeparture,
                    UsedFuel: leg.UsedFuel,
                    FPFuel: leg.FPFuel,
                    FuelActual: leg.FuelActual,
                    Defuel: leg.Defuel,
                    TOW: leg.ALT4,
                    LNDW: leg.ALT5,
                };
                $scope.popup_jlog_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //get flight

        }

    };
    $scope.jlogEntity = {
        OffBlock: null,
        OnBlock: null,
        TakeOff: null,
        Landing: null,
        PFLR: null,
        FLIGHTTIME: null,
        BLOCKTIME: null,
        FuelUnitID: 115,
        UsedFuel: null,
        FuelArrival: null,
        FuelDeparture: null,
        UsedFuel: null,
        TOW: null,
        LNDW: null,

    };
    $scope.jl_flighttime = {
        readOnly: true,
        bindingOptions: {
            value: 'jlogEntity.FLIGHTTIME',

        }
    };
    $scope.jl_blocktime = {
        readOnly: true,
        bindingOptions: {
            value: 'jlogEntity.BLOCKTIME',

        }
    };
    //2020-11-30
    //doolu
    $scope.sb_jlpflr = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ Id: 1, Title: 'Left' }, { Id: 2, Title: 'Right' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'jlogEntity.PFLR',


        }
    };
    $scope.jl_offblock = {
        //type: "datetime",
        //displayFormat: "yyyy MMM dd",
        type: "date",
        width: '100%',
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        interval: 5,
        bindingOptions: {
            value: 'jlogEntity.OffBlock',

        }
    };
    $scope.jl_offblock_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OffBlock',

        }
    };



    $scope.jl_onblock = {
        type: "date",
        width: '100%',
        interval: 5,
        onValueChanged: function (e) {
            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OnBlock',

        }
    };
    $scope.jl_onblock_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.OnBlock',

        }
    };



    $scope.jl_landing = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            $scope.calculatejlog();

        },
        bindingOptions: {
            value: 'jlogEntity.Landing',

        }
    };
    $scope.jl_landing_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.Landing',

        }
    };



    $scope.jl_takeoff = {
        type: "date",
        //displayFormat: "yyyy-MMM-dd HH:mm",
        width: '100%',
        //pickerType: 'rollers',
        interval: 5,
        onValueChanged: function (arg) {
            $scope.calculatejlog();

        },
        bindingOptions: {
            value: 'jlogEntity.TakeOff',

        }
    };
    $scope.jl_takeoff_hh = {
        type: "time",
        width: '100%',
        // pickerType: 'calendar',
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

            $scope.calculatejlog();
        },
        bindingOptions: {
            value: 'jlogEntity.TakeOff',

        }
    };

    $scope.calculatejlog = function () {
        if ($scope.jlogEntity.TakeOff && $scope.jlogEntity.Landing) {
            var diff = (subtractDates(new Date($scope.jlogEntity.TakeOff), new Date($scope.jlogEntity.Landing)));

            $scope.jlogEntity.FLIGHTTIME = minutesToHourString(diff);
        }
        else
            $scope.jlogEntity.FLIGHTTIME = null;
        if ($scope.jlogEntity.OffBlock && $scope.jlogEntity.OnBlock) {
            var diff = (subtractDates(new Date($scope.jlogEntity.OffBlock), new Date($scope.jlogEntity.OnBlock)));

            $scope.jlogEntity.BLOCKTIME = minutesToHourString(diff);
        }
        else
            $scope.jlogEntity.BLOCKTIME = null;



    };
    $scope.dsVolumeUnit = [
        { Id: 114, Title: 'Ltr', ParentId: 113, IsSystem: 1, OrderIndex: 1, Parent: 'Volume Unit' },
        { Id: 115, Title: 'Kgs', ParentId: 113, IsSystem: 1, OrderIndex: 2, Parent: 'Volume Unit' },
        { Id: 5002, Title: 'Lbs', ParentId: 113, IsSystem: 1, OrderIndex: 3, Parent: 'Volume Unit' }
    ];
    $scope.jl_volumeunit = {
        showClearButton: true,
        searchEnabled: false,
        //dataSource: $rootScope.getDatasourceOption(113),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            dataSource: 'dsVolumeUnit',
            value: 'jlogEntity.FuelUnitID',


        }
    };

    $scope.fueltotal = null;
    $scope.jl_fuel_total = {
        min: 0,
        readOnly: true,
        bindingOptions: {
            value: 'fueltotal'
        }
    };
    $scope.calFuelTotal = function () {
        return;
        if (!$scope.jlogEntity.FuelArrival || !$scope.jlogEntity.FuelDeparture)
            $scope.fueltotal = null;
        $scope.fueltotal = $scope.jlogEntity.FuelArrival + $scope.jlogEntity.FuelDeparture;
    }

    $scope.jl_fuel_arr = {
        min: 0,
        onValueChanged: function (e) {
            $scope.calFuelUsed();
        },
        bindingOptions: {
            value: 'jlogEntity.FuelArrival'
        }
    };


    $scope.jl_fuel_dep = {
        min: 0,
        onValueChanged: function (e) {
            $scope.calFuelTotal();
        },
        bindingOptions: {
            value: 'jlogEntity.FuelDeparture',

        }
    };

    $scope.jl_fuel_used = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.UsedFuel',

        }
    };
    //2020-12-01
    $scope.jl_fuel_fp = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.FPFuel',

        }
    };
    //11-23
    $scope.jl_fuel_pilot = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.FuelActual',

        }
    };
    $scope.jl_fuel_dep2 = {
        min: 0,
        onValueChanged: function (e) {
            $scope.calFuelUsed();
        },
        bindingOptions: {
            value: 'jlogEntity.Defuel',

        }
    };
    $scope.jl_tow = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.TOW',

        }
    };
    $scope.jl_lndw = {
        min: 0,
        bindingOptions: {
            value: 'jlogEntity.LNDW',

        }
    };

    $scope.calFuelUsed = function () {

        if ($scope.jlogEntity.Defuel && $scope.jlogEntity.FuelArrival)
            $scope.jlogEntity.UsedFuel = $scope.jlogEntity.Defuel - $scope.jlogEntity.FuelArrival;

    }
    Date.prototype.yyyymmddtimestring = function (utc) {


        if (!utc) {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
            var result = [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
            ].join('');
            var hh = this.getHours();
            var mi = this.getMinutes();
            var ss = this.getSeconds();
            result += "" //+ this.toLocaleTimeString();
                + ((hh > 9 ? '' : '0') + hh) + "" + ((mi > 9 ? '' : '0') + mi);

        }

        else {
            result = "";
            var umm = this.getUTCMonth() + 1; // getMonth() is zero-based
            var udd = this.getUTCDate();
            var uhh = this.getUTCHours();
            var umi = this.getUTCMinutes();
            var uss = this.getUTCSeconds();
            result = this.getUTCFullYear() + "/"
                + ((umm > 9 ? '' : '0') + umm) + "/"
                + ((udd > 9 ? '' : '0') + udd) + " "
                +
                ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi) + ":" + ((uss > 9 ? '' : '0') + uss);
        }

        return result;
    };
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
    $scope.popup_jlog_visible = false;
    $scope.popup_jlog_title = 'Journey Log';
    $scope.popup_jlog = {
        shading: true,
        width: 600,
        height: 550,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'jlog', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //takeoff save

                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {
                            Id: $scope.flight.ID,
                            OffBlock: !$scope.jlogEntity.OffBlock ? '' : (new Date($scope.jlogEntity.OffBlock)).yyyymmddtimestring(),
                            OnBlock: !$scope.jlogEntity.OnBlock ? '' : (new Date($scope.jlogEntity.OnBlock)).yyyymmddtimestring(),
                            TakeOff: !$scope.jlogEntity.TakeOff ? '' : (new Date($scope.jlogEntity.TakeOff)).yyyymmddtimestring(),
                            Landing: !$scope.jlogEntity.Landing ? '' : (new Date($scope.jlogEntity.Landing)).yyyymmddtimestring(),
                            PFLR: !$scope.jlogEntity.PFLR ? "-1" : $scope.jlogEntity.PFLR,
                            FuelUnitID: $scope.jlogEntity.FuelUnitID,
                            UsedFuel: $scope.jlogEntity.UsedFuel,
                            FuelArrival: $scope.jlogEntity.FuelArrival,
                            FuelDeparture: $scope.jlogEntity.FuelDeparture,
                            UsedFuel: $scope.jlogEntity.UsedFuel,
                            FPFuel: $scope.jlogEntity.FPFuel,
                            FuelActual: $scope.jlogEntity.FuelActual,
                            Defuel: $scope.jlogEntity.Defuel,
                            TOW: $scope.jlogEntity.TOW,
                            LNDW: $scope.jlogEntity.LNDW,

                        };



                       
                        $scope.loadingVisible = true;
                        flightService.saveJLog(dto).then(function (response) {

                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;
                            //var flt = Enumerable.From($scope.ds_flights).Where('$.ID==' + response.ID).FirstOrDefault();
                            //if (flt) {
                            //    flt =response;// JSON.parse(JSON.stringify(response));
                            //    console.log(flt);
                            //    $scope.dg_board_instance.repaint();
                           // }
						   $scope.search();
                            $scope.popup_jlog_visible = false;


                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jlog_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.calculatejlog();
            
        },
        onHiding: function () {
            $scope.dg_fuelflt_ds = null;
            $scope.jlogEntity = {
                OffBlock: null,
                OnBlock: null,
                TakeOff: null,
                Landing: null,
                PFLR: null,
                FLIGHTTIME: null,
                BLOCKTIME: null,
                FuelUnitID: 115,
                UsedFuel: null,
                FuelArrival: null,
                FuelDeparture: null,
                UsedFuel: null,
                TOW: null,
                LNDW: null,

            };
            $scope.popup_jlog_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jlog_visible',

            title: 'popup_jlog_title',

        }
    };



    $scope.formatMinutes = function (mm) {
        if (!mm)
            return "00:00";
        var _mm = Math.abs(mm);
        var sgn = _mm != mm ? "-" : "";
        return sgn + pad(Math.floor(_mm / 60)).toString() + ':' + pad(_mm % 60).toString();
    };
    $scope.dg_board_selected = null;
    $scope.dg_board_columns = [

       
        {
            caption: 'Flight', fixed: true, fixedPosition: 'left', columns: [
                { dataField: 'AircraftType', caption: 'A/C', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 0, sortOrder: 'asc' },
                { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, sortIndex: 1, sortOrder: 'asc' },
                { dataField: 'FlightNumber', caption: 'Flt No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left', },
              
                { dataField: 'FromAirportICAO', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportICAO', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            ]
        },


        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm' },

        {
            caption: 'Journey Log', columns: [
                { dataField: 'JLOffBlock', caption: 'OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'JLTakeOff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'JLLanding', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'JLOnBlock', caption: 'OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'JLFlightTime2', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'JLBlockTime2', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

            ]
        },
        {
            caption: 'Fuel', columns: [
                { dataField: 'FPFuel', caption: 'OFP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,  },
                { dataField: 'FuelActual', caption: 'Pilot', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,   },
                { dataField: 'FuelDeparture', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,  },
                { dataField: 'Defuel', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,   },
                { dataField: 'FuelArrival', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                { dataField: 'UsedFuel', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width:90 },

            ]
        },
        {
            caption: 'Weight', columns: [
                { dataField: 'ALT4', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'ALT5', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                

            ]
        },
        {
            caption: 'Station', columns: [
                { dataField: 'ChocksOut', caption: 'OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'Takeoff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'ChocksIn', caption: 'OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },

            ]
        },
        //{ dataField: 'Ready', caption: 'Ready', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
        //{ dataField: 'Start', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
       
        //{ dataField: 'Remark', caption: 'Remark', allowResizing: true, dataType: 'string', allowEditing: false, },
        
    ];
    $scope.dg_board_height = 100;

    $scope.dg_board_instance = null;
    $scope.dg_board_ds = [];
    $scope.dg_board = {
        editing: {
            allowUpdating: true,
            mode: 'cell'
        },
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
        sorting: { mode: 'none', showSortIndexes: true },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_board_columns,
        onContentReady: function (e) {
            if (!$scope.dg_board_instance)
                $scope.dg_board_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_board_selected = null;



            }
            else {
                $scope.dg_board_selected = data;


            }


        },
        onRowClick: function (e) {
			//shelli
            var component = e.component,
                prevClickTime = component.lastClickTime;
            component.lastClickTime = new Date();
            if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
                //Double click code  
                // alert('double click');
                //$scope.ati_flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + $scope.dg_board_selected.ID).FirstOrDefault();
                //$scope.ati_resid = $scope.ati_flight.RegisterID;
                //$scope.logFlight = JSON.parse(JSON.stringify($scope.ati_flight));
                //$scope.showLogX(false);
				$scope.showJLOG();
            }
            else {
                //Single click code  
                console.log('single click');
            }
        },
        onCellPrepared(e) {


            //if (e.rowType === "data" && e.column.dataField == "Delay") {

            //    e.cellElement.html($scope.formatMinutes(e.data.Delay));
            //    if (e.data.Delay > 15) {
            //        e.cellElement.css("backgroundColor", "#ffff99");
            //        e.cellElement.css("color", "#000");
            //    }

            //}
            //if (e.rowType === "data" && e.column.dataField == "FlightStatus") {
            //    e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
            //    switch (e.data.FlightStatusID) {

            //        case 2:
            //            e.cellElement.html("<span style='font-size:11px'>" + "TO" + "</span>");
            //            break;
            //        case 4:
            //            e.cellElement.html("<span style='font-size:11px'>" + "CNL" + "</span>");
            //            break;
            //        case 3:
            //            e.cellElement.html("<span style='font-size:11px'>" + "LND" + "</span>");
            //            break;
            //        case 15:
            //            e.cellElement.html("<span style='font-size:11px'>" + "ONB" + "</span>");
            //            break;
            //        case 14:
            //            e.cellElement.html("<span style='font-size:11px'>" + "OFFB" + "</span>");
            //            break;
            //        case 24:
            //            e.cellElement.html("<span style='font-size:11px'>" + "RDY" + "</span>");
            //            break;
            //        case 25:
            //            e.cellElement.html("<span style='font-size:11px'>" + "STRT" + "</span>");
            //            break;
            //        default:
            //            e.cellElement.html("<span style='font-size:11px'>" + e.data.FlightStatus.toUpperCase() + "</span>");
            //            break;
            //    }

            //}
            ////-CNL
            //if (e.rowType === "data" && e.column.dataField == "Register" && e.data.Register.includes("-CNL"))
            //    e.cellElement.html("");

            //if (e.rowType === "data" && e.data.FlightStatusID != 4) {
            //    if (e.rowType === "data" && e.column.dataField == "Start" && !e.data.IsStart) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }

            //    if (e.rowType === "data" && e.column.dataField == "Ready" && !e.data.IsReady) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }

            //    if (e.rowType === "data" && e.column.dataField == "ChocksOut" && !e.data.IsOffBlock) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }
            //    if (e.rowType === "data" && e.column.dataField == "Takeoff" && !e.data.IsTakeOff) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }

            //    if (e.rowType === "data" && e.column.dataField == "Landing" && !e.data.IsLanding) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }
            //    if (e.rowType === "data" && e.column.dataField == "ChocksIn" && !e.data.IsOnBlock) { e.cellElement.css("backgroundColor", "#ff8080"); e.cellElement.html(""); }


            //    if (e.rowType === "data" && e.column.dataField == "TotalPax" && !e.data.TotalPax) { e.cellElement.css("backgroundColor", "#ff8080"); }
            //    if (e.rowType === "data" && e.column.dataField == "PaxAdult" && !e.data.PaxAdult) { e.cellElement.css("backgroundColor", "#ff8080"); }
            //    if (e.rowType === "data" && e.column.dataField == "BaggageWeight" && !e.data.BaggageWeight) { e.cellElement.css("backgroundColor", "#ff8080"); }
            //    if (e.rowType === "data" && e.column.dataField == "BaggageCount" && !e.data.BaggageCount) { e.cellElement.css("backgroundColor", "#ff8080"); }

            //}



        },
        onRowPrepared: function (e) {

            if (e.rowType === "data" && e.data.JLOffBlock)
                e.rowElement.css('background', '#99ff99');
        },
        height: $(window).height() - 140,


        bindingOptions: {
            dataSource: 'ds_flights', //'dg_employees_ds',
            //visible: 'gridview'
        }
    };
    $scope.ds_flights = [];


    $scope.search = function () {
        var dt =  (moment(new Date($scope._datefrom)).format('YYYY-MM-DD'));
         flightService.getLegs(dt).then(function (response) {
                $scope.loadingVisible = false;

                $.each(response, function (_i, _d) {
                   /// _d.Title2 = _d.Code + ' ' + _d.Remark;
                    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.JLFlightTime2 = $scope.formatMinutes(_d.JLFlightTime);
                    _d.JLBlockTime2 = $scope.formatMinutes(_d.JLBlockTime);
                    

                });
             $scope.ds_flights = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.page_title = '> OP1';
        $('.opones').fadeIn(400, function () {

                setTimeout(function () {

                   $scope.search();
                   
                }, 1500);
            //$scope.loadingVisible = true;
            //flightService.getDelayCodes().then(function (response) {
            //    $scope.loadingVisible = false;

            //    $.each(response, function (_i, _d) {
            //        _d.Title2 = _d.Code + ' ' + _d.Remark;

            //    });
            //    $scope.delayCodes = response;

            //    setTimeout(function () {

            //        $scope.search();
            //        $scope.IsGNTVisible = true;
            //    }, 1500);

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });
    });



}]);

