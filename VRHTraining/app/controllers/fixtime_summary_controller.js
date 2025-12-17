'use strict';
app.controller('fixtime_summary_controller', [
    '$scope', '$timeout', '$location', '$routeParams', '$rootScope',
    'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', 'qahService',
    function ($scope, $timeout, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route, qahService) {

        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width: 120,
            bindingOptions: {},
            onClick: function (e) {

                $scope.bind();
            }

        };

        $scope.pyear = 1404;
        $scope.sb_pyear = {

            placeholder: 'Year',
            showClearButton: false,
            searchEnabled: false,
            dataSource: [1401, 1402, 1403,1404, 1405],

            bindingOptions: {
                value: 'pyear',


            }
        };

        $scope.rank = 'Cockpit';
        $scope.sb_rank = {
            placeholder: 'Rank',
            showClearButton: false,
            searchEnabled: false,
            dataSource: [  'Cockpit', 'Cabin', 'IP', 'P1', 'P2', 'SCCM', 'CCM', 'ISCCM'],

            bindingOptions: {
                value: 'rank',


            }
        };

        $scope.acType = 'B737';
        $scope.sb_acType = {
            placeholder: 'AC Type',
            showClearButton: false,
            searchEnabled: false,
            dataSource: [  'B737', 'MD'],
            

            bindingOptions: {
                value: 'acType',


            }
        };

        $scope.ds_period = [
            { title: '12/16 - 01/15', id: 1 },
            { title: '01/16 - 02/15', id: 2 },
            { title: '02/16 - 03/15', id: 3 },
            { title: '03/16 - 04/15', id: 4 },
            { title: '04/16 - 05/15', id: 5 },
            { title: '05/16 - 06/15', id: 6 },
            { title: '06/16 - 07/15', id: 7 },
            { title: '07/16 - 08/15', id: 8 },
            { title: '08/16 - 09/15', id: 9 },
            { title: '09/16 - 10/15', id: 10 },
            { title: '10/16 - 11/15', id: 11 },
            { title: '11/16 - 12/15', id: 12 },
        ];

       

        $scope.period = $scope.ds_period[0].id;
        $scope.sb_period = {

            placeholder: 'Period',
            showClearButton: false,
            searchEnabled: false,
            dataSource: $scope.ds_period,
            displayExpr: "title",
            valueExpr: 'id',
            bindingOptions: {
                value: 'period',


            }
        };

        function parseHHmmToMinutes(v) {
            if (!v || typeof v !== 'string') return null;
            var m = v.match(/^(\d{1,2}):(\d{2})$/);
            if (!m) return null;
            return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        }
        function headerMultiline(container, raw) {
            $('<div/>').css({ 'white-space': 'pre-line', 'text-align': 'center' })
                .text(String(raw).replace(/\r\n/g, '\n'))
                .appendTo(container);
        }

        function buildFlightColumns(sampleRow) {
            var baseCols = [
                //{
                //    name: 'row', caption: '#', width: 60, allowResizing: false, alignment: 'center',
                //    cellTemplate: function (container, options) {
                //        $('<div style="text-align:center"/>').text(options.rowIndex + 1).appendTo(container);
                //    }
                //},
               // { dataField: 'rank', caption: 'Rank', width: 60, alignment: 'center', fixed: true, fixedPosition: 'left' },
                { dataField: 'last_name', caption: 'Last Name', minWidth: 170, alignment: 'left', fixed: true, fixedPosition: 'left' },
                {
                    dataField: 'total', caption: 'Total', width: 90, alignment: 'center', fixed: true, fixedPosition: 'left',
                    calculateSortValue: function (r) { return parseHHmmToMinutes(r.total); }
                },
                {
                    dataField: 'fix_time', caption: 'Fix Time', width: 90, alignment: 'center',
                    calculateSortValue: function (r) { return parseHHmmToMinutes(r.fix_time); }
                },
                {
                    dataField: 'block_time', caption: 'Block Time', width: 100, alignment: 'center',
                    calculateSortValue: function (r) { return parseHHmmToMinutes(r.block_time); }
                },
                { dataField: 'stb', caption: 'STB', width: 60, alignment: 'center', dataType: 'number' },
                { dataField: 'flt_count', caption: 'Flights', width: 70, alignment: 'center', dataType: 'number' },
                { dataField: 'taxi', caption: 'Taxi', width: 60, alignment: 'center', dataType: 'number' },
                { dataField: 'req_off', caption: 'Req Off', width: 80, alignment: 'center' },
                { dataField: 'ref', caption: 'Ref', width: 70, alignment: 'center' },
                { dataField: 'off', caption: 'Off', width: 70, alignment: 'center' }
            ];

            var isRouteCol = function (k) { return /^[A-Za-z]{3}(?:\r\n[A-Za-z]{3})+$/.test(k); };

            var known = baseCols.reduce(function (acc, c) {
                if (c.dataField) acc[c.dataField] = true;
                if (c.name) acc[c.name] = true;
                return acc;
            }, {});

            var dynamicCols = [];
            if (sampleRow && typeof sampleRow === 'object') {
                Object.keys(sampleRow).forEach(function (k) {
                    if (known[k]) return;
                    if (isRouteCol(k)) {
                        dynamicCols.push({
                            dataField: k,
                            caption: k,
                            alignment: 'center',
                            width: 70,
                            headerCellTemplate: function (container) { headerMultiline(container, k); },
                            calculateSortValue: function (row) {
                                var v = row[k];
                                var n = (v == null) ? null : Number(v);
                                return isNaN(n) ? -Infinity : n;
                            }
                        });
                    }
                });
            }
            return baseCols.concat(dynamicCols);
        }

        // --- STATE ---
        $scope.dg_fixtime_selected = null;
        $scope.dg_fixtime_instance = null;
        $scope.dg_fixtime_columns = [];   // start empty; we’ll fill once data arrives
        $scope.dg_fixtime_ds = [];   // data array

        // If data arrives before the grid instance exists, stash pending columns
        var _pendingColumns = null;

        // --- GRID CONFIG ---
        $scope.dg_fixtime = {
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
            height: $(window).height() - 115,
            columns: $scope.dg_fixtime_columns,

            "export": {
                enabled: true,
                fileName: "FixTime",
                allowExportSelectedData: false
            },
            onContentReady: function (e) {
                if (!$scope.dg_fixtime_instance) $scope.dg_fixtime_instance = e.component;
                if (_pendingColumns) {
                    e.component.beginUpdate();
                    e.component.option('columns', _pendingColumns);
                    e.component.endUpdate();
                    _pendingColumns = null;
                }
            },

            onSelectionChanged: function (e) {
                $scope.dg_fixtime_selected = e.selectedRowsData[0] || null;
            },

            onRowPrepared: function (e) {
                if (e.data && e.data.IsPositioning) e.rowElement.css('background', '#ffccff');
                if (e.rowType === 'data' && e.data) e.data.RN = e.rowIndex + 1;
            },

            onCellPrepared: function (e) {
                if (e.rowType === 'data' && e.column.dataField === 'FlightStatus') {
                    e.cellElement.addClass(String(e.data.FlightStatus || '').toLowerCase());
                }
            },

            bindingOptions: { dataSource: 'dg_fixtime_ds' },
            columnChooser: { enabled: false },
            width:'100%'
        };

        $scope.$watchCollection('dg_fixtime_ds', function (ds) {
            if (!ds || !ds.length) return;
            var cols = buildFlightColumns(ds[0]);
            if ($scope.dg_fixtime_instance) {
                $scope.dg_fixtime_instance.beginUpdate();
                $scope.dg_fixtime_instance.option('columns', cols);
                $scope.dg_fixtime_instance.endUpdate();
            } else {
                _pendingColumns = cols;
            }
        });

     
        $scope.bind = function () {
            $scope.loadingVisible = true;
            flightService.getFixTimeByRoute($scope.pyear, $scope.period, $scope.rank, $scope.acType).then(function (response) {
              
                var rows = Array.isArray(response) ? response
                    : Array.isArray(response?.data) ? response.data
                        : Array.isArray(response?.Result) ? response.Result
                            : response; 

                if (!Array.isArray(rows)) {
                    console.error('Unexpected response shape for getFixTimeByRoute:', response);
                    notificationService.warn('No rows returned (unexpected response).');
                    return;
                }

                // Normalize route keys if backend used "\n" instead of "\r\n"
                if (rows.length && rows[0]) {
                    var first = rows[0];
                    Object.keys(first).forEach(function (k) {
                        if (/\n/.test(k) && !/\r\n/.test(k) && /^[A-Za-z]{3}(?:\n[A-Za-z]{3})+$/.test(k)) {
                            // Convert all rows’ keys to CRLF so regex matches
                            rows.forEach(function (r) {
                                if (r.hasOwnProperty(k)) {
                                    r[k.replace(/\n/g, '\r\n')] = r[k];
                                    delete r[k];
                                }
                            });
                        }
                    });
                }

                // Push data into scope in a digest-safe way
                $timeout(function () { $scope.dg_fixtime_ds = rows; }, 0);
                $scope.loadingVisible = false;
            }, function (err) {
                console.error(err);
                notificationService.error('Failed to load data.');
                $scope.loadingVisible = false;
            });
        };

        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> FixTime Summary';


            $('.fixTimeSumary').fadeIn(400, function () {
              
            });
        }

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
      
    }]);
