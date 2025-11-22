'use strict';
app.controller('reportFlightDailyStationController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    $scope.IsFBVisible = $rootScope.userName.toLowerCase().includes("demo") || $rootScope.userName.toLowerCase().includes("kabiri")
        || $rootScope.userName.toLowerCase().includes("razbani");
    var isTaxiVisible = false;
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

        }

    };

    $scope.btn_export = {
        text: 'Export',
        type: 'success',
        visible: false,
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.export();

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
    $scope.realMSNs = [];

    $scope.getRealMSNs = function (cid, callback) {

        flightService.getRealRegisters(cid).then(function (response) {
            $scope.realMSNs = Enumerable.From(response)
                //.Where('!$.isvirtual')
                .Where(function (x) { return !x.Register.startsWith('CNL'); })
                .OrderBy('$.isvirtual').ThenBy('$.TFC')
                .ThenBy('$.Register').ToArray();
            console.log('REAL MESNS', $scope.realMSNs);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    $scope.getDatasourceMSN = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/aircrafts/available/customer/type/' + Config.CustomerId + '/-1',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Register'],
        });
    };
    $scope.regs = [];
    $scope.tag_reg = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        // dataSource: $scope.getDatasourceMSN(),


        // searchExpr: ["Regsiter"],
        // displayExpr: "Register",
        // valueExpr: 'Register',
        bindingOptions: {
            value: 'regs',
            dataSource: '_dsRegisters',
        }
    };

    $scope.origins = [];
    $scope.tag_origin = {
        //dataSource: $rootScope.getDatasourceAirport(),
        showClearButton: true,
        searchEnabled: true,

        //searchExpr: ["IATA"],
        //displayExpr: "IATA",
        // valueExpr: 'IATA',
        bindingOptions: {
            value: 'origins',
            dataSource: '_dsFrom'
        }
    };

    $scope.destinations = [];
    $scope.tag_destination = {
        //dataSource: $rootScope.getDatasourceAirport(),
        showClearButton: true,
        searchEnabled: true,

        //searchExpr: ["IATA"],
        //displayExpr: "IATA",
        //valueExpr: 'IATA',
        bindingOptions: {
            value: 'destinations',
            dataSource: '_dsTo'
        }
    };

    $scope.fltnos = null;
    $scope.txt_fltnos = {
        height: 70,
        bindingOptions: {
            value: 'fltnos'
        }
    };

    $scope.routes = null;
    $scope.txt_routes = {
        height: 70,
        bindingOptions: {
            value: 'routes'
        }
    };

    $scope.statusDs = [
        { Id: 1, Title: 'Scheduled' },
        { Id: 7, Title: 'Diverted' },
        { Id: 4, Title: 'Canceled' },
        { Id: 15, Title: 'OnBlocked' },
        { Id: -1, Title: 'All' },
    ];
    $scope.statuses = [1,7,15];
    $scope.tag_status = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        // dataSource: $scope.getDatasourceMSN(),


        searchExpr: ["Title"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'statuses',
            dataSource: 'statusDs',
        }
    };

    $scope.ftDs = [
       'DOM','INT'
    ];
    $scope.fts = ['DOM', 'INT'];
    $scope.tag_ft = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        // dataSource: $scope.getDatasourceMSN(),

        bindingOptions: {
            value: 'fts',
            dataSource: 'ftDs',
        }
    };


    $scope.idxDs = [
        'ورودی', 'خروجی'
    ];
    $scope.idx = [];
    $scope.tag_idx = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        // dataSource: $scope.getDatasourceMSN(),

        bindingOptions: {
            value: 'idx',
            dataSource: 'idxDs',
        }
    };
    flightService.getCharterers().then(function (response) {
        $scope.chr_ds = response;
        console.log($scope.chr_ds);

    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    $scope.chrs = [];
    $scope.tag_chr = {

        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
        searchEnabled: true,
        // dataSource: $scope.getDatasourceMSN(),


        searchExpr: ["Title1"],
        displayExpr: "Title1",
        valueExpr: 'Title1',
        bindingOptions: {
            value: 'chrs',
            dataSource: 'chr_ds',
        }
    };

    $scope.dsMassUnit = [
        'KG', 'LBS', 'ALL'

    ];
    $scope.dsVolumeUnit = [
        'LTR', 'LBS', 'KG', 'ALL'
    ];

    $scope._mu = 'ALL';
    $scope._vu = 'ALL';
    $scope.sb_massunit = {
        showClearButton: false,
        searchEnabled: false,

        // dataSource: $rootScope.getDatasourceOption(110),

        onSelectionChanged: function (e) {
            if (!$scope.dg_flight_instance)
                return;
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;
            //$scope.dg_flight_instance
            console.log(e);
            $scope.dg_flight_instance.beginUpdate();
            switch (e.selectedItem) {
                case 'ALL':
                    $scope.dg_flight_instance.columnOption('cargo_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('cargo_lbs', 'visible', true);
                    $scope.dg_flight_instance.columnOption('bag_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('bag_lbs', 'visible', true);
                    break;
                case 'KG':
                    $scope.dg_flight_instance.columnOption('cargo_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('cargo_lbs', 'visible', false);
                    $scope.dg_flight_instance.columnOption('bag_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('bag_lbs', 'visible', false);
                    break;
                case 'LBS':
                    $scope.dg_flight_instance.columnOption('cargo_kg', 'visible', false);
                    $scope.dg_flight_instance.columnOption('cargo_lbs', 'visible', true);
                    $scope.dg_flight_instance.columnOption('bag_kg', 'visible', false);
                    $scope.dg_flight_instance.columnOption('bag_lbs', 'visible', true);
                    break;
                default: break;
            }

            $scope.dg_flight_instance.endUpdate();


        },
        bindingOptions: {
            dataSource: 'dsMassUnit',
            value: '_mu'

        }
    };
    $scope.sb_volumeunit = {

        showClearButton: false,
        searchEnabled: false,
        onSelectionChanged: function (e) {
            if (!$scope.dg_flight_instance)
                return;
            $scope.dg_flight_instance.beginUpdate();
            switch (e.selectedItem) {
                case 'ALL':
                    $scope.dg_flight_instance.columnOption('fuel_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('fuel_lbs', 'visible', true);
                    $scope.dg_flight_instance.columnOption('fuel_ltr', 'visible', true);

                    break;
                case 'KG':
                    $scope.dg_flight_instance.columnOption('fuel_kg', 'visible', true);
                    $scope.dg_flight_instance.columnOption('fuel_lbs', 'visible', false);
                    $scope.dg_flight_instance.columnOption('fuel_ltr', 'visible', false);
                    break;
                case 'LBS':
                    $scope.dg_flight_instance.columnOption('fuel_kg', 'visible', false);
                    $scope.dg_flight_instance.columnOption('fuel_lbs', 'visible', true);
                    $scope.dg_flight_instance.columnOption('fuel_ltr', 'visible', false);
                    break;
                case 'LTR':
                    $scope.dg_flight_instance.columnOption('fuel_kg', 'visible', false);
                    $scope.dg_flight_instance.columnOption('fuel_lbs', 'visible', false);
                    $scope.dg_flight_instance.columnOption('fuel_ltr', 'visible', true);
                    break;
                default: break;
            }

            $scope.dg_flight_instance.endUpdate();

        },

        bindingOptions: {
            dataSource: 'dsVolumeUnit',
            value: '_vu'

        }
    };

    $scope._tu = 'ALL';
    $scope.sb_timeunit = {
        dataSource: ['LOCAL', 'UTC', 'ALL'],
        showClearButton: false,
        searchEnabled: false,
        onSelectionChanged: function (e) {
            if (!$scope.dg_flight_instance)
                return;
            $scope.dg_flight_instance.beginUpdate();
            switch (e.selectedItem) {
                case 'ALL':
                    $scope.dg_flight_instance.columnOption('std_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('sta_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('takeoff_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('landing_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('offblock_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('onblock_local', 'visible', true);


                    $scope.dg_flight_instance.columnOption('std_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('sta_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('takeoff_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('landing_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('offblock_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('onblock_utc', 'visible', true);


                    break;
                case 'LOCAL':
                    $scope.dg_flight_instance.columnOption('std_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('sta_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('takeoff_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('landing_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('offblock_local', 'visible', true);
                    $scope.dg_flight_instance.columnOption('onblock_local', 'visible', true);


                    $scope.dg_flight_instance.columnOption('std_utc', 'visible', false);
                    $scope.dg_flight_instance.columnOption('sta_utc', 'visible', false);
                    $scope.dg_flight_instance.columnOption('takeoff_utc', 'visible', false);
                    $scope.dg_flight_instance.columnOption('landing_utc', 'visible', false);
                    $scope.dg_flight_instance.columnOption('offblock_utc', 'visible', false);
                    $scope.dg_flight_instance.columnOption('onblock_utc', 'visible', false);
                    break;
                case 'UTC':
                    $scope.dg_flight_instance.columnOption('std_local', 'visible', false);
                    $scope.dg_flight_instance.columnOption('sta_local', 'visible', false);
                    $scope.dg_flight_instance.columnOption('takeoff_local', 'visible', false);
                    $scope.dg_flight_instance.columnOption('landing_local', 'visible', false);
                    $scope.dg_flight_instance.columnOption('offblock_local', 'visible', false);
                    $scope.dg_flight_instance.columnOption('onblock_local', 'visible', false);


                    $scope.dg_flight_instance.columnOption('std_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('sta_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('takeoff_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('landing_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('offblock_utc', 'visible', true);
                    $scope.dg_flight_instance.columnOption('onblock_utc', 'visible', true);
                    break;

                default: break;
            }

            $scope.dg_flight_instance.endUpdate();

        },

        bindingOptions: {

            value: '_tu'

        }
    };



    $scope._code = 'IATA';
    $scope.sb_code = {
        dataSource: ['IATA','ICAO','ALL'],
        showClearButton: false,
        searchEnabled: false,
        onSelectionChanged: function (e) {
            if (!$scope.dg_flight_instance)
                return;
            $scope.dg_flight_instance.beginUpdate();
            switch (e.selectedItem) {
                case 'ALL':
                    $scope.dg_flight_instance.columnOption('FromAirportICAO', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportICAO2', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO2', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportIATA', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportIATA2', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA2', 'visible', true);
                   


                    break;
                case 'IATA':
                    $scope.dg_flight_instance.columnOption('ToAirportIATA', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportIATA2', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA2', 'visible', true);

                    $scope.dg_flight_instance.columnOption('FromAirportICAO', 'visible', false);
                    $scope.dg_flight_instance.columnOption('FromAirportICAO2', 'visible', false);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO', 'visible', false);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO2', 'visible', false);

                    break;
                case 'ICAO':
                    $scope.dg_flight_instance.columnOption('FromAirportICAO', 'visible', true);
                    $scope.dg_flight_instance.columnOption('FromAirportICAO2', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO', 'visible', true);
                    $scope.dg_flight_instance.columnOption('ToAirportICAO2', 'visible', true);

                    $scope.dg_flight_instance.columnOption('ToAirportIATA', 'visible', false);
                    $scope.dg_flight_instance.columnOption('ToAirportIATA2', 'visible', false);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA', 'visible', false);
                    $scope.dg_flight_instance.columnOption('FromAirportIATA2', 'visible', false);
                    break;

                default: break;
            }

            $scope.dg_flight_instance.endUpdate();

        },

        bindingOptions: {

            value: '_code'

        }
    };
    /////////////////////////////////////////
    var repall = function (str, search, replacement) {
        if (!str)
            return str;
        return str.replace(new RegExp(search, 'g'), replacement);
    }
    $scope.setFilters = function () {
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        flightService.getFlightDailyReportFilters(_df, _dt).then(function (response) {
            $scope._dsFrom = response.origins;
            $scope._dsTo = response.destinations;
            $scope._dsRegisters = response.registers;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    var stn_colors = [
        '#e6ffe6',
        '#e6e6ff',
        '#ffffcc',
        '#f2f2f2',
        '#ffb3cc',
        '#b3fff0',
        '#b3f0ff',
        '#ffd699',
        '#e6b3cc',
        '#c2d6d6',
        '#ddff99',
    ];

    var reg_colors = [
        { reg: 'RBC', bk: '#ffff00' },
        { reg: 'VAA', bk: '#e6b800' },
        { reg: 'VAI', bk: '#00e6e6' },
        { reg: 'VBM', bk: '#ff4d4d' },
        { reg: 'VAR', bk: '#e580ff' },
        { reg: 'VAF', bk: '#00e600' },
        

    ];

    $scope.bind = function () {
        //iruser558387
        var _regs = $scope.regs.length > 0 ? $scope.regs.join('_') : '-1';
        var _org = $scope.origins.length > 0 ? $scope.origins.join('_') : '-1';
        var _des = $scope.destinations.length > 0 ? $scope.destinations.join('_') : '-1';
        var _no = $scope.fltnos ? repall($scope.fltnos, ' ', '').split(',').join('_') : '-1';
        var _route = $scope.routes ? repall($scope.routes, ' ', '').split(',').join('_') : '-1';

        var _idx = $scope.idx.length > 0 ? $scope.idx.join('_') : '-1';
        var _type2 = $scope.fts.length > 0 ? $scope.fts.join('_') : '-1';
        var _chr = $scope.chrs.length > 0 ? $scope.chrs.join('_') : '-1';
        var _status = $scope.statuses.length > 0 ? $scope.statuses.join('_') : '-1';
        console.log(_idx);
        console.log(_type2);
        console.log(_chr);
        console.log(_status);

        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        // var _getFlightDailyReport = function (df, dt, from,to,regs,routes,no)
        $scope.loadingVisible = true;

        flightService.getFlightDailyStationReport(_df, _dt, _org, _des, _regs, _route, _no, _idx, _type2, _chr, _status).then(function (_response) {
            $scope.loadingVisible = false;
            $scope._stns = Enumerable.From(_response.stations).OrderByDescending('Number($.cnt)').ToArray();
            $.each($scope._stns, function (_i, _d) { _d.bk = stn_colors[_i]; });

            var response = _response.flts;
            $.each(response, function (_i, _d) {

                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.ScheduledTime2 = $scope.formatMinutes(_d.ScheduledTime);

                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.Delay2 = $scope.formatMinutes(_d.DelayOffBlock);

                var _stn = Enumerable.From($scope._stns).Where(function (x) { return x.Station == _d.Station; }).FirstOrDefault();
                if (_stn)
                    _d.bk = _stn.bk;
                else
                    _d.bk = '#ffffff';



            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //////////////////////////
        ///////////////////////////
        ////////////////////////////

        return;
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



    $scope.export = function () {
        //iruser558387
        var _regs = $scope.regs.length > 0 ? $scope.regs.join('_') : '-1';
        var _org = $scope.origins.length > 0 ? $scope.origins.join('_') : '-1';
        var _des = $scope.destinations.length > 0 ? $scope.destinations.join('_') : '-1';
        var _no = $scope.fltnos ? repall($scope.fltnos, ' ', '').split(',').join('_') : '-1';
        var _route = $scope.routes ? repall($scope.routes, ' ', '').split(',').join('_') : '-1';

        var _idx = $scope.idx.length > 0 ? $scope.idx.join('_') : '-1';
        var _type2 = $scope.fts.length > 0 ? $scope.fts.join('_') : '-1';
        var _chr = $scope.chrs.length > 0 ? $scope.chrs.join('_') : '-1';
        var _status = $scope.statuses.length > 0 ? $scope.statuses.join('_') : '-1';

        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        // var _getFlightDailyReport = function (df, dt, from,to,regs,routes,no)
        var _fuel = 'ltr';
        if ($scope._vu == 'ALL') _fuel = 'ltr';
        if ($scope._vu == 'LBS') _fuel = 'lbs';
        if ($scope._vu == 'KG') _fuel = 'kg';
        var _weight = 'kg';
        if ($scope._mu == 'LBS') _weight = 'lbs';

        $window.open(apiDaily + 'api/flight/daily/export?' + 'df=' + _df + '&dt=' + _dt + '&from=' + _org + '&to=' + _des + '&regs=' + _regs + '&routes=' + _route + '&no=' + _no + '&idx=' + _idx + '&status=' + _status + '&type2=' + _type2 + '&chr=' + _chr
            + '&time=' + ($scope._tu == 'UTC' ? 'utc' : 'lcl')
            + '&fuel=' + _fuel
            + '&weight=' + _weight
            , '_blank');

        //////////////////////////
        ///////////////////////////
        ////////////////////////////

        return;
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
        onValueChanged: function (e) {
            $scope.setFilters();
        },
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        onValueChanged: function (e) {
            $scope.setFilters();
        },
        bindingOptions: {
            value: 'dt_to',

        }
    };
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        if (!mm || mm < 0)
            return '00:00';
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

    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 170 },

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

    $scope.dg_flight_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 60, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },
        {
            caption: 'Date', alignment: 'center', columns: [
                { dataField: 'STDDay', caption: 'AD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
                { dataField: 'PDate', caption: 'Shamsi', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
            ], fixed: true, fixedPosition: 'left'
        },
        { dataField: 'FlightCount', caption: 'FLTS', allowResizing: true, visible: false, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 1, sortOrder: 'desc' },
        { dataField: 'RegFlightCount', caption: 'REGFLTS', allowResizing: true, visible: false, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 3, sortOrder: 'desc' },
        { dataField: 'Station', caption: 'STN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 2, sortOrder: 'asc', fixed: true, fixedPosition: 'left'  },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, sortIndex: 4, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        {
            caption: 'IN', alignment: 'center', fixed: true, fixedPosition: 'left', columns: [
                { dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },
                
                        { dataField: 'FromAirportIATA', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65 },
                        { dataField: 'ToAirportIATA', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65 },
                    
                        { dataField: 'FromAirportICAO', caption: 'Dep', visible: false, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                        { dataField: 'ToAirportICAO', caption: 'Arr', visible: false, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                   
                
               

            ]
        },
        {
            caption: 'OUT', alignment: 'center', fixed: true, fixedPosition: 'left',columns: [
                { dataField: 'FlightNumber2', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },
                
                    
                        { dataField: 'FromAirportIATA2', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65 },
                        { dataField: 'ToAirportIATA2', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65 },
                    
               
               
                        { dataField: 'FromAirportICAO2', caption: 'Dep',visible:false, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                        { dataField: 'ToAirportICAO2', caption: 'Arr',visible:false, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                   
                
                
            ]
        },
        {
            caption: 'IN', alignment: 'center', columns: [
                { dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', name: 'landing_local' },
                { dataField: 'BlockOnLocal', caption: 'ON/B', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', name: 'onblock_local' },
               { dataField: 'RevPax', caption: 'Rev. Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 95, },
         { dataField: 'TotalPax', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 95, },
            ]
        },
        {
            caption: 'OUT', alignment: 'center', columns: [
                { dataField: 'BlockOffLocal2', caption: 'OFF/B', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', name: 'offblock_local' },
                { dataField: 'TakeOffLocal2', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', name: 'takeoff_local' },
                 { dataField: 'RevPax2', caption: 'Rev.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 95, },
               { dataField: 'TotalPax2', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 95, },
            ]
        },
         { dataField: 'FlightType2', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'PMonth', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        //{ dataField: 'PDayName', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        //{ dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
       
        //{ dataField: 'FlightIndex', caption: 'Index', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },



        //{ dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },

       
        //{ dataField: 'FromAirportIATA', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        //{ dataField: 'ToAirportIATA', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

        //{
        //    caption: 'Pax', columns: [
        //        { dataField: 'PaxAdult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        //        { dataField: 'PaxChild', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        //        { dataField: 'PaxInfant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        //        { dataField: 'RevPax', caption: 'Rev.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        //        { dataField: 'TotalPax', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //    ]
        //},
        //{ dataField: 'AirlineSold', caption: 'Varesh Sale', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{ dataField: 'ChertererSold', caption: 'Charter Sale', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{
        //    caption: 'Baggage', alignment: 'center', columns: [
        //        { dataField: 'BaggageWeightKg', caption: 'KG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'bag_kg' },
        //        { dataField: 'BaggageWeightLbs', caption: 'LBS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'bag_lbs' },
        //    ]
        //},
        //{
        //    caption: 'Cargo', alignment: 'center', columns: [
        //        { dataField: 'CargoWeightKg', caption: 'KG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'cargo_kg' },
        //        { dataField: 'CargoWeightLbs', caption: 'LBS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'cargo_lbs' },
        //    ]
        //},




        //{ dataField: 'TotalSeat', caption: 'Total Seats', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        //{ dataField: 'EmptySeat', caption: 'Empty Seats', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },


        //{
        //    caption: 'STD', alignment: 'center', columns: [
        //        { dataField: 'STDLocal', caption: 'LOCAL', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', sortIndex: 3, sortOrder: 'asc', name: 'std_local' },
        //        { dataField: 'STD', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', sortIndex: 4, sortOrder: 'asc', name: 'std_utc' },
        //    ]
        //},
        //{
        //    caption: 'STA', alignment: 'center', columns: [
        //        { dataField: 'STALocal', caption: 'LOCAL', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'sta_local' },
        //        { dataField: 'STA', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'sta_utc' },
        //    ]
        //},




        //{ dataField: 'ScheduledTime2', caption: 'Scheduled Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{
        //    caption: 'TakeOff', alignment: 'center', columns: [
        
        //        { dataField: 'TakeOff', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'takeoff_utc' },
        //    ]
        //},
        //{
        //    caption: 'Landing', alignment: 'center', columns: [
       
        //        { dataField: 'Landing', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'landing_utc' },
        //    ]
        //},


        //{ dataField: 'FlightTime2', caption: 'Actual Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },

        //{
        //    caption: 'OffBlock', alignment: 'center', columns: [
        //        { dataField: 'BlockOffLocal', caption: 'LOCAL', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'offblock_local' },
        //        { dataField: 'BlockOff', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'offblock_utc' },
        //    ]
        //},
        //{
        //    caption: 'OnBlock', alignment: 'center', columns: [
       
        //        { dataField: 'BlockOn', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', name: 'onblock_utc' },
        //    ]
        //},

        //{ dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },

        //{ dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{ dataField: 'DelayReason', caption: 'Delay Reasons', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{
        //    caption: 'Fuel', alignment: 'center', columns: [
        //        { dataField: 'UpliftLtr', caption: 'LTR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'fuel_ltr' },
        //        { dataField: 'UpliftLbs', caption: 'LBS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'fuel_lbs' },
        //        { dataField: 'UpliftKg', caption: 'KG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, name: 'fuel_kg' },
        //    ]
        //},

        //{ dataField: 'Distance', caption: 'Distance (NM)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 130, },
        //{ dataField: 'ChrTitle', caption: 'Charterer', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        //{ dataField: 'StationIncome', caption: 'Station Income', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

        //{ caption: 'Agencies', width: 300 },
        //{ dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },







    ];
    var out_fields = ["FlightNumber2", "FromAirportIATA2", "ToAirportIATA2", "FromAirportICAO2", "ToAirportICAO2", "BlockOffLocal2", "TakeOffLocal2", "TotalPax2", "RevPax2"];
    var fixed_fields = ['STN', 'RN', 'STDDay', 'PDate'];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
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
                        return data.value;
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
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAvg",
                    showInColumn: "Delay2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "ScheduledTimeTotal",
                    showInColumn: "ScheduledTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "ScheduledTimeAvg",
                    showInColumn: "ScheduledTime2",
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
                {
                    column: "RevPax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "RevPax",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },





                {
                    column: "TotalPax2",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "TotalPax2",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "RevPax2",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "RevPax2",
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
                {
                    column: "EmptySeat",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "OverSeat",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Distance",
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

                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "DelayAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
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
                if (options.name === "ScheduledTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.ScheduledTime;
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
            //if (e.data && e.data.JLOffBlock)
            //    e.rowElement.css('background', '#33ffcc');

            //if (e.data) {
            //    e.rowElement.css('background', e.data.bk);
            //}
            

            if (e.rowType == 'data' && e.data) {
                e.data['RN'] = e.rowIndex + 1;
            }
        },

        onCellPrepared: function (e) {
            // if (e.rowType === "data" && e.column.dataField == "FlightStatus")
            //     e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
            //reg_colors
            if (e.rowType === "data" && (fixed_fields.indexOf(e.column.dataField) != -1   || e.column.dataField == "Station")) {
                e.cellElement.css('background', e.data.bk);
            }
            if (e.rowType === "data" && out_fields.indexOf(e.column.dataField)!=-1) {
                e.cellElement.css('background', '#e6e6e6');
            }
            if (e.rowType === "data" && e.column.dataField == "Register")
                e.cellElement.css('background', Enumerable.From(reg_colors).Where(function (x) { return x.reg == e.data.Register; }).FirstOrDefault().bk);
            if (e.rowType === "data" &&    e.column.dataField == "FlightType2" ) {
                e.cellElement.css('background', e.data.FlightType2 == 'INT' ? '#1ad1ff' :'#33cccc');
            }
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
        { dataField: 'FltNo', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },




        { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },


        { dataField: 'CockpitCount', caption: 'Cockpit', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, },
        { dataField: 'CabinCount', caption: 'Cabin', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, },

        { dataField: 'TotalCrew', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150 },
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


        flightService.getFDPsCrewCount(_df, _dt).then(function (response) {
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

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
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


        flightService.getCateringReport($scope.ctr_type, _df, _dt).then(function (response) {
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
                    readOnly: true,
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    // dataSource: ['All', 'COCKPIT', 'CABIN'],
                    width: 250,
                    stylingMode: 'outlined',
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
            'toolbarItems[1].options.value': 'ctr_type',

        }
    };

    //////

    $scope.popup_cduties = {

        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 50,
        width: $(window).width() - 200,
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
        $rootScope.page_title = '> Flights Daily Report';


        $('.reportflightdailystation').fadeIn(400, function () {
            $scope.setFilters();
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        $scope.getRealMSNs(4, function (e) { });
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);