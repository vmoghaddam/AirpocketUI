'use strict';
app.controller('fdm_sand_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {
        //2025-05-22

        const COLOR_DAILY = "#F59E0B";   // نارنجی
        const COLOR_EWMA = "#3B82F6";   // آبی
        const COLOR_CPOS = "#8B5CF6";   // بنفش (CUSUM+)
        const COLOR_CNEG = "#22C55E";   // سبز  (CUSUM-)
        const COLOR_ALARM = "#EF4444";   // قرمز
        const THRESHOLD = 100; // آستانه دلخواه CUSUM+
        const Color_flight = "#6CA6D9";
        const Color_event = "#FFB000";
        const color_event_per100 = "#C2410C";
        const color_avg_event_per100 = "#8B5CF6";
        const lowColor = '#A0E5C2';
        const medColor = '#ffcc66';
        const highColor = '#ff1a1a';



        $scope.prms = $routeParams.prms;
        $scope.activeTab = 'fleet';
        $scope.activeTab2 = 'B737';
        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width: 120,
            // validationGroup: 'ctrsearch',
            bindingOptions: {},
            onClick: function (e) {
                $scope.bind();
            }

        };
        $scope.dt_from = new Date(2024, 10, 1);
        $scope.dt_to = new Date(2025, 5, 1);
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


        //////////////////////////////////b
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
        $scope.rightHeight = $(window).height() - 154;
        $scope.scroll_1 = {
            width: '100%',
            bounceEnabled: false,
            showScrollbar: 'never',
            pulledDownText: '',
            pullingDownText: '',
            useNative: true,
            refreshingText: 'Updating...',
            onPullDown: function (options) {

                options.component.release();

            },
            onInitialized: function (e) {


            },
            bindingOptions: {
                height: 'rightHeight'
            }

        };
        $scope.pie_size = { height: 409 };
        //----Event Info Table--------------------

        $scope.dg_events_columns = [
            //{
            //    cellTemplate: function (container, options) {
            //        $("<div style='text-align:center'/>")
            //            .html(options.rowIndex + 1)
            //            .appendTo(container);
            //    }, name: 'row', caption: '#', barWidth: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            //}, 
            { dataField: 'std', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 110, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
            { dataField: 'flight_number', caption: 'FlightNumber', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
           // { dataField: 'type', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            
            { dataField: 'event_name', caption: 'Event Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
            { dataField: 'ac_type2', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },

            { dataField: 'phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'state_name', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'route', caption: 'route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            //{ dataField: 'arr_iata', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },


            { dataField: 'cp1_name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110 },
            { dataField: 'cp2_name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'ip1_name', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },

           //  { dataField: 'type', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350 },

            // { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 115,  },
            // { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 115,  },
            //{ dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
            //{ dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
            //{ dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
            //{ dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
            //{ dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
            //{ dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },

        ];
        $scope.dg_events_selected = null;
        $scope.dg_events_instance = null;
        $scope.dg_events_ds = null;
        $scope.dg_events_height = 400;

        $scope.dg_events =
        {
            onContentReady: function (e) {
                if (!$scope.dg_events_instance)
                    $scope.dg_events_instance = e.component;

            },
            columns: $scope.dg_events_columns,

            bindingOptions: {
                "dataSource": "dg_events_ds",
                "height": "dg_events_height",

            },
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
            paging: { pageSize: 100 },
            showBorders: true,
            selection: { mode: 'multiple' },
            columnAutoWidth: false,

            onSelectionChanged: function (e) {
                //var data = e.selectedRowsData[0];

                //if (!data) {
                //    $scope.dg_master_selected = null;
                //}
                //else
                //    $scope.dg_master_selected = data;


            },

            "export": {
                enabled: false,
                fileName: "File",
                allowExportSelectedData: false
            },


            /* onRowPrepared: function (e) {
                 if (e.data && e.data.Severity && e.data.Severity == 'High') e.rowElement.css('background', '#ff8566');
                 if (e.data && e.data.Severity && e.data.Severity == 'Medium') e.rowElement.css('background', '#ffd480');
                 //  e.rowElement.css('background', '#ffccff');
         
             },
         
             onCellPrepared: function (options) {
                 var data = options.data;
                 var column = options.column;
                 var fieldHtml = "";
         
                 if (data && options.value && column.caption == 'Current') {
                     fieldHtml += "<span style='font-weight:bold'>" + options.value + "</span>";
                     options.cellElement.html(fieldHtml);
                 }
                 if (data && options.value && column.caption == 'Delayed') {
                     fieldHtml += "<span style='color:#cc5200'>" + options.value + "</span>";
                     options.cellElement.html(fieldHtml);
                 }
                 if (data && options.value && column.dataField.includes('Diff')) {
                     var cls = options.value <= 0 ? 'pos' : 'neg';
                     fieldHtml += "<div class='" + cls + "'>"
                         + "<span style='font-size:12px'>" + options.value + "%" + "</span>"
                         + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
                         + "</div>";
                     options.cellElement.html(fieldHtml);
                 }
         
         
         
             },*/
        };




        //----------EWMA-------------------------
        //const COLOR_DAILY = "#F59E0B";   // نارنجی
        //const COLOR_EWMA = "#3B82F6";   // آبی
        //const COLOR_CPOS = "#8B5CF6";   // بنفش (CUSUM+)
        //const COLOR_CNEG = "#22C55E";   // سبز  (CUSUM-)
        //const COLOR_ALARM = "#EF4444";   // قرمز
        //const THRESHOLD = 100; // آستانه دلخواه CUSUM+

        $scope.allEWMAEventsChart = {

            bindingOptions: { dataSource: 'allEWMAEvents' },

            palette: "Material",
            title: "Early Warning Trend of Flight Events(Smoothed Daily Rate)",//"EWMA & CUSUM (Alarm on Increase Only)",
            
            commonSeriesSettings: {
                argumentField: "Date",
                type: "spline",
                point: { visible: true, size: 1 }, // نقطه‌ها مثل تصویر
                hoverMode: "allArgumentPoints"
            },
            series: [
                { name: "Daily Event Rate / 100 flights", valueField: "Daily", axis: "rateAxis", width: 1, color: COLOR_DAILY },
                { name: "EWMA", valueField: "EWMA", axis: "rateAxis", width: 1, color: COLOR_EWMA },

                //{ name: "CUSUM+", valueField: "CusumPos", axis: "cusumAxis", width: 1, color: COLOR_CPOS },
                //{ name: "CUSUM-", valueField: "CusumNeg", axis: "cusumAxis", width: 1, color: COLOR_CNEG },

                // مارکرهای آلارم روی EWMA
                {
                    name: "Alarm ",
                    type: "scatter",
                    valueField: "AlarmEWMA",
                    axis: "rateAxis",
                    color: COLOR_ALARM,

                    point: { visible: true, size: 4, symbol: "triangleDown", border: { visible: false } },

                }
            ],
            argumentAxis: {
                argumentType: "datetime",
                label: {
                    format: 'dd MMM yyyy',      // سال را هم نشان می‌دهد
                    overlappingBehavior: 'rotate' // اختیاری
                },
                grid: { visible: true }
            },
            valueAxis: [
                {
                    name: "rateAxis",
                    title: { text: "Events per 100 Flights" },
                    position: "left",
                    grid: { visible: true },
                    constantLines: [{ value: 0, width: 1, dashStyle: "dash", color: "#9CA3AF" }]
                },
                //{
                //    name: "cusumAxis",
                //    title: { text: "CUSUM" },
                //    position: "right",
                //    grid: { visible: false },
                //    constantLines: [{ value: 0, width: 1, dashStyle: "dash", color: "#9CA3AF" }]
                //}
            ],
            crosshair: { enabled: true, label: { visible: true } },
            legend: { visible: true, verticalAlignment: "bottom", horizontalAlignment: "center" },
            tooltip: {
                enabled: true,
                shared: true,
                customizeTooltip: function (arg) {
                    const d = DevExpress.localization.formatDate(arg.argument, "yyyy-MM-dd");
                    const p = arg.points;
                    const get = (name) => {
                        const item = p.find(x => x.seriesName === name);
                        return item ? item.value.toFixed(1) : "-";
                    };
                    return {
                        text:
                            `Date: ${d}\n` +
                            `Daily: ${get("Daily Event Rate / 100 flights")}\n` +
                            `EWMA: ${get("EWMA")}\n` +
                           // `CUSUM+: ${get("CUSUM+")}\n` +
                           // `CUSUM-: ${get("CUSUM-")}` +
                            `Alarm: ${get("Alarm")}`
                    };
                }
            },
            margin: { left: 70, right: 70, top: 10, bottom: 20 }
        };

        //-----------------pareto-----------------
        $scope.AllParetoChart = {

            bindingOptions: { dataSource: 'AllPareto' },

            palette: "Material",
            title: "Pareto Chart Of Event Titles (Count & Cumulative %)",

            series: [
                { name: "EventCount", valueField: "Count", argumentField: "EventTitle", axis: "countAxis", color: COLOR_DAILY, type: 'bar' },
                { name: "Cumulative Percentage", valueField: "Cumulative", argumentField: "EventTitle", axis: "cumulativeAxis", width: 1, color: COLOR_EWMA, type: 'spline', point: { visible: true, size: 1 } },
            ],
            argumentAxis: {

                label: {
                    visible: true,
                    overlappingBehavior: 'rotate', // اختیاری
                    rotationAngle: 90, // چرخش 45 درجه
                    staggeringSpacing: 5,
                    customizeText: function (arg) {
                        // کوتاه کردن متن اگر طولانی است
                        if (arg.value && arg.value.length > 30) {
                            return arg.value.substring(0, 27) + '...';
                        }
                        return arg.value;
                    }

                },
                grid: { visible: true },
                discreteAxisDivisionMode: 'crossLabels'
            },
            valueAxis: [
                {
                    name: "countAxis",
                    title: { text: "Event Count" },
                    position: "left",
                    grid: { visible: true },
                    //constantLines: [{ value: 0, width: 1, dashStyle: "dash", color: "#9CA3AF" }]
                },
                {
                    name: "cumulativeAxis",
                    title: { text: "Cumulative Percentage" },
                    position: "right",
                    grid: { visible: false },
                    //constantLines: [{ value: 0, width: 1, dashStyle: "dash", color: "#9CA3AF" }]
                }
            ],
            crosshair: { enabled: true, label: { visible: true } },
            legend: { visible: true, verticalAlignment: "bottom", horizontalAlignment: "center" },
            /*tooltip: {
                enabled: true,
                shared: true,
                customizeTooltip: function (arg) {
                    const d = DevExpress.localization.formatDate(arg.argument, "yyyy-MM-dd");
                    const p = arg.points;
                    const get = (name) => {
                        const item = p.find(x => x.seriesName === name);
                        return item ? item.value.toFixed(1) : "-";
                    };
                    return {
                        text:
                            `Date: ${d}\n` +
                            `Daily: ${get("Daily Event Rate / 100 flights")}\n` +
                            `EWMA: ${get("EWMA")}\n` +
                            `CUSUM+: ${get("CUSUM+")}\n` +
                            `CUSUM-: ${get("CUSUM-")}` +
                            `Alarm: ${get("Alarm")}`
                    };
                }
            },
            */
            margin: { left: 80, right: 80, top: 20, bottom: 20 },
            size: {
                height: 600,
                width: '100%'
            }

        };
        //-----------------CPT FO--------------------
        $scope.pairs = {
            topN: 20, minFlights: 0,
            list737: [], listMD: [],       // برای نمودار Top Pairs
            matrix737: { fos: [], rows: [] }, // جدول ماتریسی B737
            matrixMD: { fos: [], rows: [] }  // جدول ماتریسی MD
        };

        // تنها تابع اصلی: دریافت، ساخت Top، ساخت ماتریس، ترسیم نمودار
        $scope.refreshPairs = function () {
            function ymd(d) {
                if ($scope.formatDateYYYYMMDD) return $scope.formatDateYYYYMMDD(d);
                var x = new Date(d), mm = ('0' + (x.getMonth() + 1)).slice(-2), dd = ('0' + x.getDate()).slice(-2); return x.getFullYear() + '-' + mm + '-' + dd;
            }
            var dt1 = ymd($scope.dt_from), dt2 = ymd($scope.dt_to), N = $scope.pairs.topN || 20, minF = $scope.pairs.minFlights || 0;

            $scope.loadingVisible = true;

            fdmService.get_fmd_cpt_fo(dt1, dt2).then(function (res) {
                var rows = (res && res.Data && res.Data.combined) ? res.Data.combined :
                    (res && res.data && res.data.Data && res.data.Data.combined) ? res.data.Data.combined : [];
                if (!rows.length) {
                    $scope.pairs.list737 = $scope.pairs.listMD = [];
                    $scope.pairs.matrix737 = { fos: [], rows: [] };
                    $scope.pairs.matrixMD = { fos: [], rows: [] };
                    ['topPairsChartB737', 'topPairsChartMD'].forEach(function (id) {
                        var el = document.getElementById(id); if (!el || !window.Chart) return;
                        var ch = Chart.getChart(el); if (ch) ch.destroy(); if (el.parentElement) el.parentElement.style.height = '220px';
                    });
                    return;
                }

                // تشخیص نام فیلد تایپ
                var s = rows[0] || {}, tf = ('ac_type' in s) ? 'ac_type' : (('ac_type2' in s) ? 'ac_type2' : null);
                function is737(t) { t = (t || '').toString().toUpperCase(); return t.indexOf('B73') >= 0 || /^B[- ]?737/.test(t); }
                function isMD(t) { t = (t || '').toString().toUpperCase(); return t.indexOf('MD-') >= 0 || /^MD/.test(t); }

                // سازنده‌ی لیست Top برای نمودار
                function top(src, pred) {
                    return src.filter(function (r) { return (!tf || pred(r[tf])) && (r.flight_count || 0) >= minF; })
                        .map(function (r) {
                            return {
                                cpt_name: r.cpt_name, fo_name: r.fo_name,
                                flights: r.flight_count || 0, events: r.event_count || 0,
                                per100: +(r.total_count_per_100 || 0)
                            };
                        })
                        .sort(function (a, b) { return (b.per100 || 0) - (a.per100 || 0); })
                        .slice(0, N);
                }

                // سازنده‌ی ماتریس (CPT×FO)
                function buildMatrix(src, pred, maxCPT, maxFO) {
                    var data = src.filter(function (r) { return (!tf || pred(r[tf])) && (r.flight_count || 0) >= minF; })
                        .map(function (r) {
                            return {
                                cpt: r.cpt_name, fo: r.fo_name, per100: +(r.total_count_per_100 || 0)
                            };
                        });
                    // لیست یکتا از CPT و FO
                    var cptSet = {}, foSet = {}, cpts = [], fos = [];
                    data.forEach(function (x) { if (!cptSet[x.cpt]) { cptSet[x.cpt] = 1; cpts.push(x.cpt); } if (!foSet[x.fo]) { foSet[x.fo] = 1; fos.push(x.fo); } });
                    cpts.sort(); fos.sort();
                    if (maxCPT) cpts = cpts.slice(0, maxCPT);
                    if (maxFO) fos = fos.slice(0, maxFO);
                    // نگاشت مقادیر
                    var map = {}; data.forEach(function (x) { map[x.cpt + '|' + x.fo] = x.per100; });
                    // ساخت سطرها
                    var rows = cpts.map(function (c) {
                        var o = { cpt: c }; fos.forEach(function (f) { o[f] = (map[c + '|' + f] != null ? map[c + '|' + f] : null); }); return o;
                    });
                    return { fos: fos, rows: rows };
                }

                // لیست‌ها برای نمودار
                $scope.pairs.list737 = top(rows, is737);
                $scope.pairs.listMD = top(rows, isMD);

                // ماتریس‌ها (محدودیت اختیاری روی اندازه برای خوانایی)
                $scope.pairs.matrix737 = buildMatrix(rows, is737, 20, 20); // حداکثر 20 CPT × 20 FO
                $scope.pairs.matrixMD = buildMatrix(rows, isMD, 20, 20);

                // نمودارها (ارتفاع دینامیک + فاصله بیشتر بین میله‌ها)
                function draw(id, list, title) {
                    var el = document.getElementById(id); if (!el || !window.Chart) return;
                    var old = Chart.getChart(el); if (old) old.destroy();
                    var bar = 15, gap = 10, pad = 24, h = Math.max(220, pad + list.length * (bar + gap));
                    if (el.parentElement) el.parentElement.style.height = h + 'px';
                    new Chart(el.getContext('2d'), {
                        type: 'bar',
                        data: {
                            labels: list.map(function (p) { return (p.cpt_name || '') + ' × ' + (p.fo_name || ''); }),
                            datasets: [{ label: title, data: list.map(function (p) { return p.per100; }), barThickness: bar, maxBarThickness: bar, barPercentage: 0.9, categoryPercentage: 0.5 }]
                        },
                        options: {
                            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                            scales: {
                                x: { beginAtZero: true, title: { display: true, text: 'events per 100 flights' } },
                                y: { offset: true, ticks: { autoSkip: false, padding: 8 }, grid: { display: false } }
                            },
                            plugins: { legend: { display: false } }
                        }
                    });
                }
                setTimeout(function () {
                    draw('topPairsChartB737', $scope.pairs.list737, 'B737 — per 100');
                    draw('topPairsChartMD', $scope.pairs.listMD, 'MD — per 100');
                }, 0);

            }).catch(function (err) {
                console.error('[TopPairs] API error', err);
                $scope.pairs.list737 = $scope.pairs.listMD = [];
                $scope.pairs.matrix737 = { fos: [], rows: [] };
                $scope.pairs.matrixMD = { fos: [], rows: [] };
            }).finally(function () { $scope.loadingVisible = false; });
        };

        //-------------------All pilots Comparison---------------------------
        $scope.cpt_all_737_ds = [];
        $scope.cpt_all_B737_chart =
        {
            title: 'B737 Pilots Event Comparison ',
            tooltip: { enabled: true, shared: true },
            legend: { verticalAlignment: 'bottom', horizontalAlignment: 'center' },

            commonSeriesSettings: {
                argumentField: 'crew_name',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                type: 'stackedBar',        // ← مهم: پیش‌فرض رو stackedBar بذار
                // barPadding: 0.2
                barGroupPadding: 0.01
            },
            valueAxis: [
                { name: 'countAxis', position: 'left', title: { text: 'Event Count' } },
                { name: 'rateAxis', position: 'right', title: { text: 'Event Count / 100 Flights' }, grid: { visible: false } }
            ],
            argumentAxis: {
                type: 'discrete',
                position: 'bottom',
                label: { overlappingBehavior: 'stagger', font: { size: 12 }, overlappingBehavior: 'rotate', rotationAngle:90 }
            },

            series: [
                {
                    name: 'Flights', valueField: 'flight_count', axis: 'countAxis',
                    type: 'stackedBar', stack: 'flights', color: Color_flight, opacity: 0.75
                },

                {
                    name: 'Low', valueField: 'low_count', axis: 'countAxis',
                    stack: 'sev', color: lowColor, opacity: 0.95
                },
                {
                    name: 'Medium', valueField: 'medium_count', axis: 'countAxis',
                    stack: 'sev', color: '#F59E0B', opacity: 0.95
                },
                {
                    name: 'High', valueField: 'high_count', axis: 'countAxis',
                    stack: 'sev', color: '#EF4444', opacity: 0.95
                },

                // خط نرخ (محور راست)
                {
                    name: 'Events/100 Flights', valueField: 'total_count_per_100', axis: 'rateAxis',
                    type: 'spline', width: 2, color: color_event_per100, point: { visible: false, size: 1 }
                },
                {
                    name: 'Pilots Average (Events/100)', valueField: 'avg_total_count_per100', axis: 'rateAxis',
                    type: 'spline', width: 2, color: color_avg_event_per100, point: { visible: false, size: 1 }
                }
            ],

            bindingOptions:
            {
                dataSource: 'cpt_all_737_ds',
                //'size.height': 'chart_size_full_height'
            },
            margin: { left: 80, right: 80, top: 20, bottom: 20 },
            size: {
                height: 700,
                width: '100%'
            }
        };

        $scope.cpt_all_MD_ds = [];
        $scope.cpt_all_MD_chart =
        {
            title: 'MD Pilots Event Comparison ',
            tooltip: { enabled: true, shared: true },
            legend: { verticalAlignment: 'bottom', horizontalAlignment: 'center' },

            commonSeriesSettings: {
                argumentField: 'crew_name',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                type: 'stackedBar',        // ← مهم: پیش‌فرض رو stackedBar بذار
                // barPadding: 0.2
                barGroupPadding: 0.01
            },
            valueAxis: [
                { name: 'countAxis', position: 'left', title: { text: 'Event Count' } },
                { name: 'rateAxis', position: 'right', title: { text: 'Event Count / 100 Flights' }, grid: { visible: false } }
            ],
            argumentAxis: {
                type: 'discrete',
                position: 'bottom',
                label: { overlappingBehavior: 'stagger', font: { size: 12 }, overlappingBehavior: 'rotate', rotationAngle: 90 }
            },

            series: [
                {
                    name: 'Flights', valueField: 'flight_count', axis: 'countAxis',
                    type: 'stackedBar', stack: 'flights', color: Color_flight, opacity: 0.75
                },

                {
                    name: 'Low', valueField: 'low_count', axis: 'countAxis',
                    stack: 'sev', color: lowColor, opacity: 0.95
                },
                {
                    name: 'Medium', valueField: 'medium_count', axis: 'countAxis',
                    stack: 'sev', color: '#F59E0B', opacity: 0.95
                },
                {
                    name: 'High', valueField: 'high_count', axis: 'countAxis',
                    stack: 'sev', color: '#EF4444', opacity: 0.95
                },

                // خط نرخ (محور راست)
                {
                    name: 'Events/100 Flights', valueField: 'total_count_per_100', axis: 'rateAxis',
                    type: 'spline', width: 2, color: color_event_per100, point: { visible: false, size: 1 }
                },
                {
                    name: 'Pilots Average (Events/100)', valueField: 'avg_total_count_per100', axis: 'rateAxis',
                    type: 'spline', width: 2, color: color_avg_event_per100, point: { visible: false, size: 1 }
                }
            ],

            bindingOptions:
            {
                dataSource: 'cpt_all_MD_ds',
                //'size.height': 'chart_size_full_height'
            },
            margin: { left: 80, right: 80, top: 20, bottom: 20 },
            size: {
                height: 700,
                width: '100%'
            }
        };

        //----------------------------------------
        $scope.pie_737_total_event = {
            type: "doughnut",
            //  size: {
            //     height:400,

            //  },
            // palette: 'bright',
            palette: ['#66cc97', '#ffcc33', '#bf4040'],
            series: [
                {
                    argumentField: 'level',
                    valueField: 'Count',
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1,
                        },
                        customizeText(arg) {
                            return arg.value;
                        },
                    },

                },
            ],
            //title: 'Events',
            export: {
                enabled: false,
            },
            onPointClick(e) {
                const point = e.target;

                toggleVisibility(point);
            },
            onLegendClick(e) {
                const arg = e.target;

                toggleVisibility(e.component.getAllSeries()[0].getPointsByArg(arg)[0]);
            },
            legend: {
                //verticalAlignment: 'bottom',
                //horizontalAlignment: 'center',
                verticalAlignment: 'top',
                horizontalAlignment: 'right',
                itemTextPosition: 'right',

            },
            bindingOptions:
            {
                dataSource: 'pie_737_total_event_ds',
                'size': 'pie_size'
            },
        };
        $scope.pie_737_total_event_pilot = {
            type: "doughnut",
            //  size: {
            //     height:400,

            //  },
            // palette: 'bright',
            palette: ['#66cc97', '#ffcc33', '#bf4040'],
            series: [
                {
                    argumentField: 'level',
                    valueField: 'Count',
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1,
                        },
                        customizeText(arg) {
                            return arg.value;
                        },
                    },

                },
            ],
            //title: 'Events',
            export: {
                enabled: false,
            },
            onPointClick(e) {
                const point = e.target;

                toggleVisibility(point);
            },
            onLegendClick(e) {
                const arg = e.target;

                toggleVisibility(e.component.getAllSeries()[0].getPointsByArg(arg)[0]);
            },
            legend: {
                //verticalAlignment: 'bottom',
                //horizontalAlignment: 'center',
                verticalAlignment: 'top',
                horizontalAlignment: 'right',
                itemTextPosition: 'right',

            },
            bindingOptions:
            {
                dataSource: 'pie_737_total_event_pilot_ds',
                'size': 'pie_size'
            },
        };
        $scope.pie_md_total_event = {
            type: "doughnut",
            //  size: {
            //     height:400,

            //  },
            // palette: 'bright',
            palette: ['#00cc99', '#ffcc33', '#ff4d4d'],
            series: [
                {
                    argumentField: 'level',
                    valueField: 'Count',
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1,
                        },
                        customizeText(arg) {
                            return arg.value;
                        },
                    },

                },
            ],
            //title: 'Events',
            export: {
                enabled: false,
            },
            onPointClick(e) {
                const point = e.target;

                toggleVisibility(point);
            },
            onLegendClick(e) {
                const arg = e.target;

                toggleVisibility(e.component.getAllSeries()[0].getPointsByArg(arg)[0]);
            },
            legend: {
                //verticalAlignment: 'bottom',
                //horizontalAlignment: 'center',
                verticalAlignment: 'top',
                horizontalAlignment: 'right',
                itemTextPosition: 'right',

            },
            bindingOptions:
            {
                dataSource: 'pie_md_total_event_ds',
                'size': 'pie_size'
            },
        };
        $scope.bar_type_comparison = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            commonSeriesSettings: {
                argumentField: 'ac_type',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },

            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,

            },
            size: {
                height: 400,

            },
            bindingOptions:
            {
                dataSource: 'bar_type_comparison_ds',
                series: 'bar_type_comparison_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_type_comparison_series = {
            name: 'A/C Type', valueField: 'score_per_flight', color: "#660033", hoverStyle: { color: "#000000" }, barWidth: 50
        };

        ///////////////////////////////
        $scope.bar_reg_737 = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },

            commonSeriesSettings: {
                argumentField: 'register',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,
                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
               
            },

            onPointClick: function (e) {
                var register_id = e.target.data.register_id;
                console.log("Clicked register_id:", register_id);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "B737",
                    register_id,
                    "0",
                    "-",
                    "-"
                ).then(function (response) {
                    //console.warn("Yesss", response.Data);

                    // $scope.dg_events_ds = response.data.data?.Items;
                    // $scope.dg_events_ds = response.data.data?.Items || [];
                    if (response.Data ) {
                        //console.warn("Yesss", response.Data);

                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }


                });
            },

            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },

            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title:"Score per Flight"
            },

            size: {
                height: 400,
            },

            bindingOptions: {
                dataSource: 'bar_reg_737_ds',
                series: 'bar_reg_737_series',
            }
        };


        $scope.bar_reg_737_series = {
            name: 'Registers', valueField: 'score_per_flight', color: "#660033", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////////
        $scope.bar_reg_md = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            onPointClick: function (e) {
                var register_id = e.target.data.register_id;
                console.log("Clicked register_id:", register_id);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "MD",
                    register_id,
                    "0",
                    "-",
                    "-"
                ).then(function (response) {
                    
                    // $scope.dg_events_ds = response.data.data?.Items;
                    if (response.Data) {
                        //console.warn("Yesss", response.Data);

                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }
                });
            },

            commonSeriesSettings: {
                argumentField: 'register',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            
            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Score per Flight"
            },
            size: {
                height: 400,

            },
            bindingOptions:
            {
                dataSource: 'bar_reg_md_ds',
                series: 'bar_reg_md_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_reg_md_series = {
            name: 'Registers', valueField: 'score_per_flight', color: "#b3003b", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////
        $scope.bar_cpt_737 = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            onPointClick: function (e) {
                var cpt_id = e.target.data.crew_id;
                console.log("Clicked cpt_id:", cpt_id);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "B737",
                    "0",
                    cpt_id,
                    "-",
                    "-"
                ).then(function (response) {
                    if (response.Data) {
                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }


                });
            },

            commonSeriesSettings: {
                argumentField: 'crew_name',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
           
            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Score per Flight"
            },
            size: {
                height: 500,

            },
            bindingOptions:
            {
                dataSource: 'bar_cpt_737_ds',
                series: 'bar_cpt_737_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_cpt_737_series = {
            name: 'Pilots', valueField: 'total_score', color: "#006666", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////////
        $scope.bar_cpt_md = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            onPointClick: function (e) {
                var cpt_id = e.target.data.crew_id;
                console.log("Clicked cpt_id:", cpt_id);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "MD",
                    "0",
                    cpt_id,
                    "-",
                    "-"
                ).then(function (response) {
                    if (response.Data) {
                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }


                });
            },

            commonSeriesSettings: {
                argumentField: 'crew_name',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
           
            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Score per Flight"

            },
            size: {
                height: 500,

            },
            bindingOptions:
            {
                dataSource: 'bar_cpt_md_ds',
                series: 'bar_cpt_md_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_cpt_md_series = {
            name: 'Pilots', valueField: 'total_score', color: "#005580", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////////
        $scope.bar_route_737 = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            onPointClick: function (e) {
                var route = e.target.data.route;
                console.log("Clicked route:", route);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "B737",
                    "0",
                    "0",
                    route,
                    "-"
                ).then(function (response) {
                    if (response.Data) {
                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }


                });
            },

            commonSeriesSettings: {
                argumentField: 'route',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            
            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Score per Flight"

            },
            size: {
                height: 400,

            },
            bindingOptions:
            {
                dataSource: 'bar_route_737_ds',
                series: 'bar_route_737_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_route_737_series = {
            name: 'Routes', valueField: 'score_per_flight', color: "#ac39ac", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////////
        $scope.bar_route_md = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 2
                },
            },
            onPointClick: function (e) {
                var route = e.target.data.route;
                console.log("Clicked route:", route);

                fdmService.get_fmd_event_info(
                    $scope.formatDateYYYYMMDD($scope.dt_from),
                    $scope.formatDateYYYYMMDD($scope.dt_to),
                    "MD",
                    "0",
                    "0",
                    route,
                    "-"
                ).then(function (response) {
                    if (response.Data) {
                        $scope.dg_events_ds = response.Data.Items;
                    } else {
                        console.warn("No Items in response", response.Data);
                        $scope.dg_events_ds = [];
                    }
                });
            },

            commonSeriesSettings: {
                argumentField: 'route',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            
            argumentAxis: {
                label: {
                    overlappingBehavior: "rotate",
                    rotationAngle: 90,
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Score per Flight"

            },
            size: {
                height: 400,

            },
            bindingOptions:
            {
                dataSource: 'bar_route_md_ds',
                series: 'bar_route_md_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
        };
        $scope.bar_route_md_series = {
            name: 'Routes', valueField: 'score_per_flight', color: "#ac39ac", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        //////////////////////////////////////
        $scope.bar_events_737 = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            title: {
                text: 'Top Events (B737)', subtitle: { text: 'Click on each bar to see the details' }
            },
            commonSeriesSettings: {
                argumentField: 'event_name',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: true,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,

            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            onPointClick(e) {
                e.target.select();
                if (e.target && e.target.argument) {

                    console.log(e.target);
                    //$scope.result_events
                    $scope.bar_events_737_regs_ds = Enumerable.From($scope.result_events.events_register).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    $scope.bar_events_737_phase_ds = Enumerable.From($scope.result_events.events_type_phase).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    $scope.bar_events_737_route_ds = Enumerable.From($scope.result_events.events_type_route).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    console.log('regs', $scope.bar_events_737_regs_ds);
                    //if (_phase)
                    //    $scope.ds_phase_event = _phase.Items;
                }
                //e.target.argument
                //e.target.value
            },
            bindingOptions:
            {
                dataSource: 'bar_events_737_ds',
                series: 'bar_events_737_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_full_height'
            },
        };
        $scope.bar_events_737_series = {
            name: 'Events', valueField: 'count', color: "#c6538c", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_737_regs = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'register',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: false,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"

            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_737_regs_ds',
                series: 'bar_events_737_regs_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_events_737_regs_series = {
            name: 'Registers', valueField: 'count', color: "#ff6600", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_737_phase = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'phase',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: false,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_737_phase_ds',
                series: 'bar_events_737_phase_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_events_737_phase_series = {
            name: 'Phases', valueField: 'count', color: "#476b6b", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_737_route = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'route_iata',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: true,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"

            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_737_route_ds',
                series: 'bar_events_737_route_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_full_height'
            },
        };
        $scope.bar_events_737_route_series = {
            name: 'Routes', valueField: 'count', color: "#5c85d6", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        ///////////////////////////////////
        $scope.bar_events_md = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            title: {
                text: 'Top Events (MD)', subtitle: { text: 'Click on each bar to see the details' }
            },
            commonSeriesSettings: {
                argumentField: 'event_name',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: true,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            onPointClick(e) {
                e.target.select();
                if (e.target && e.target.argument) {

                    console.log(e.target);
                    //$scope.result_events
                    $scope.bar_events_md_regs_ds = Enumerable.From($scope.result_events.events_register).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    $scope.bar_events_md_phase_ds = Enumerable.From($scope.result_events.events_type_phase).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    $scope.bar_events_md_route_ds = Enumerable.From($scope.result_events.events_type_route).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    $scope.bar_events_md_crew_ds = Enumerable.From($scope.result_events.events_crew).Where(function (x) { return x.ac_type == e.target.data.ac_type && x.event_name == e.target.data.event_name; }).ToArray();
                    console.log('regs', $scope.bar_events_md_crew_ds);
                    //if (_phase)
                    //    $scope.ds_phase_event = _phase.Items;
                }
                //e.target.argument
                //e.target.value
            },
            bindingOptions:
            {
                dataSource: 'bar_events_md_ds',
                series: 'bar_events_md_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_full_height'
            },
        };
        $scope.bar_events_md_series = {
            name: 'Events', valueField: 'count', color: "#997a00", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_md_regs = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'register',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: false,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_md_regs_ds',
                series: 'bar_events_md_regs_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_events_md_regs_series = {
            name: 'Registers', valueField: 'count', color: "#ff6600", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_md_phase = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'phase',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: false,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_md_phase_ds',
                series: 'bar_events_md_phase_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_events_md_phase_series = {
            name: 'Phases', valueField: 'count', color: "#476b6b", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_md_crew = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'last_name',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: false,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_md_crew_ds',
                series: 'bar_events_md_crew_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_events_md_crew_series = {
            name: 'Pilots', valueField: 'count', color: "#476b6b", hoverStyle: { color: "#000000" }, barWidth: 50
        };
        $scope.bar_events_md_route = {
            palette: 'Office',
            tooltip: {
                enabled: true,
                location: 'edge',
                customizeTooltip(arg) {
                    return {
                        text: arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                    };
                },
                format: {
                    type: "fixedPoint",
                    precision: 0
                },
            },
            // title: 'Top Events',
            commonSeriesSettings: {
                argumentField: 'route_iata',
                type: 'bar',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: {
                    visible: false,

                },
                point: {
                    hoverStyle: {
                        color: "#000000"
                    }
                }
            },


            // title: 'Score per Flight Comparison',
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: false,
            },
            onPointClick(e) {
                e.target.select();
            },
            rotated: true,
            argumentAxis: {
                label: {
                    // overlappingBehavior: "rotate",
                    // rotationAngle: 90,
                    font: {
                        size: 10
                    }
                    //customizeText: function (d) {
                    //    return $scope.convertYearMonth(this.value);
                    //},
                }
            },

            valueAxis: {
                tickInterval: 0.1,
                title: "Event Count"
            },
            //size: {
            //    height: function (x) { return $(window).height() - 100; },

            //},
            bindingOptions:
            {
                dataSource: 'bar_events_md_route_ds',
                series: 'bar_events_md_route_series',
                // 'argumentAxis.categories': 'yearMonth2',
                'size.height': 'chart_size_full_height'
            },
        };
        $scope.bar_events_md_route_series = {
            name: 'Routes', valueField: 'count', color: "#5c85d6", hoverStyle: { color: "#000000" }, barWidth: 50
        };

        /////////////////////////////////////
        $rootScope.page_title = '> FDM';
        $('.fdm_sand').fadeIn();
        /////////////////////////////////////////
        $scope.formatDateYYYYMMDD = function (dt) {
            return moment(dt).format('YYYY-MM-DD');
        };
        $scope.get_type_content_style = function () {
            var h = $(window).height() - 210;
            return {
                height: h + 'px',
            };
        }
        $scope.chart_size_full_height = $(window).height() - 240;
        $scope.chart_size_half_height = $scope.chart_size_full_height / 2;
        $scope.chart_size_3rows_height = $scope.chart_size_full_height / 3;
        $scope.result_type_737 = null;
        //if (!$scope._watchersAttached) {
        //    $scope._watchersAttached = true;

        //    $scope.$watch('ds_cpt_737', onCpt737);
        //    $scope.$watch('ds_cpt_MD', onCptMD);
        //    $scope.$watch('bar_route_737_ds', onRoute737);
        //}

        // نگه‌داشتن ریفرنس چارت‌ها برای destroy
        $scope._phaseCharts = $scope._phaseCharts || {};
        $scope.renderPhaseCharts = function (ds, prefix)
        {
            prefix = prefix || ''; // مثلا 'md-' یا 'b737-'
            if (!ds) return;

            $timeout(function () {
                ds.forEach(function (c, i) {
                    var id = prefix + 'chart-' + (c.crew_id || i);
                    var canvas = document.getElementById(id);
                    if (!canvas) return;

                    // destroy قبلی
                    if ($scope._phaseCharts[id]) {
                        try { $scope._phaseCharts[id].destroy(); } catch (e) { }
                    }

                    var ctx = canvas.getContext('2d');
                    $scope._phaseCharts[id] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: c.ds_phase_labels || [],
                            datasets: [{
                                label: 'Total Score',
                                data: c.ds_phase_scores || [],
                                backgroundColor: '#cccccc',
                                borderColor: 'gray',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            elements: { bar: { borderWidth: 1 } },
                            plugins: { legend: { display: false } },
                            scales: { x: { beginAtZero: true } }
                        }
                    });
                });
            }, 0);
        };

        $scope._routeCharts = {};
        $scope.renderRouteCharts = function (ds, prefix) {
            prefix = prefix || 'route-';
            $timeout(function () {
                (ds || []).forEach(function (c, i) {
                    var id = prefix + 'chart-' + (c.crew_id || i);           // مثل: route-chart-123
                    var canvas = document.getElementById(id);
                    if (!canvas) return;

                    var old = Chart.getChart ? Chart.getChart(canvas) : null;
                    if (old) old.destroy();

                    var ctx = canvas.getContext('2d');
                    $scope._routeCharts[id] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: c.ds_reg_labels || [],
                            datasets: [{ label: 'S/F', data: c.ds_reg_scores || [], backgroundColor: '#ccc', borderColor: 'gray', borderWidth: 1 }]
                        },
                        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
                    });
                });
            }, 0, false);
        };

        $scope.$watch('activeTab2', function (val, old) {
            if (!val || val === old) return;
            // تب B737
            if (val === 'B737') {
                $scope.$evalAsync(function () {
                    // اگه نگه‌دارنده‌ی رفرنس داری:
                    Object.values($scope._phaseCharts || {}).forEach(ch => ch && ch.resize());
                    Object.values($scope._routeCharts || {}).forEach(ch => ch && ch.resize());
                });
            }
            // تب MD
            if (val === 'MD') {
                $scope.$evalAsync(function () {
                    Object.values($scope._phaseCharts || {}).forEach(ch => ch && ch.resize());
                    Object.values($scope._routeCharts || {}).forEach(ch => ch && ch.resize());
                });
            }
        });


        $scope.bind = function () {
            console.log($scope.dt_from);
            //-------EWMA---------------------

            fdmService.get_fmd_ewma_all($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (res) {
                //if (res.IsSuccess) {
                //$scope.ds_ewma_all = res.Data.items;
                // بعد از دریافت پاسخ سرویس:
                $scope.allEWMAEvents = (res && res.Data && res.Data.items) ? res.Data.items.map(function (r) {
                    const alarm = (r.Alarm !== undefined) ? r.Alarm : true;

                    return {
                        Date: new Date(r.Date),
                        Daily: r.EventRatePer100,
                        EWMA: r.Ewma,
                        //CusumPos: r.CusumPos,
                        //CusumNeg: r.CusumNeg,
                        Alarm: r.Alarm,
                        AlarmEWMA: alarm ? r.Ewma : null // فقط وقتی آلارم دارد مقدار EWMA؛ وگرنه null

                    };
                }) : [];

                //console.log('EWMAevents ', $scope.ds_ewma_all);

                //}
            });

            //-----------------pareto-----------------
            fdmService.get_fmd_all_pareto($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), 20).then(function (res) {
                if (res.IsSuccess) {
                    $scope.AllPareto = res.Data.Items || [];
                }
                else {
                    console.error('Error fetching Pareto data:', res.Data);
                    $scope.AllPareto = []; // در صورت خطا، آرایه را خالی کنید
                    General.ShowNotify('Failed to load Pareto data: ' + (res.Data?.error || 'Unknown error'), 'error');
                }
            }).catch(function (error) {
                console.error('API Call Failed:', error);
                $scope.AllPareto = [];
                General.ShowNotify('API call failed: ' + error.message, 'error');

            });

            ///------------CPT FO-----------------------
            $scope.refreshPairs();
            //-----------------------------------
            fdmService.get_fmd_all($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response)
            {

                $scope.result_type = response.Data.result_type;
                // $scope.result_route = response.Data.result_register;
                $scope.result_type_737 = response.Data.result_type[0];
                $scope.pie_737_total_event_ds = [
                    { level: 'Low', Count: $scope.result_type_737.low_count },
                    { level: 'Medium', Count: $scope.result_type_737.medium_count },
                    { level: 'High', Count: $scope.result_type_737.high_count }
                ];
                $scope.result_type_md = response.Data.result_type[1];
                $scope.pie_md_total_event_ds = [
                    { level: 'Low', Count: $scope.result_type_md.low_count },
                    { level: 'Medium', Count: $scope.result_type_md.medium_count },
                    { level: 'High', Count: $scope.result_type_md.high_count }
                ];
                $scope.bar_type_comparison_ds = $scope.result_type;
                $scope.result_register = response.Data.result_register;

                $scope.bar_reg_737_ds = Enumerable.From($scope.result_register).Where('$.ac_type=="B737"').OrderByDescending('$.score_per_flight').ToArray();
                $scope.bar_reg_md_ds = Enumerable.From($scope.result_register).Where('$.ac_type=="MD"').OrderByDescending('$.score_per_flight').ToArray();

                $scope.bar_route_737_ds = Enumerable.From($scope.result_route).Where('$.ac_type=="B737"').OrderByDescending('$.score_per_flight').Take(10).ToArray();
                $scope.bar_route_md_ds = Enumerable.From($scope.result_route).Where('$.ac_type=="MD"').OrderByDescending('$.score_per_flight').Take(10).ToArray();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.get_fmd_events($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response_events)
            {
                $scope.result_events = response_events.Data;
                $scope.bar_events_737_ds = Enumerable.From($scope.result_events.events_type).Where('$.ac_type=="B737"').OrderByDescending('$.count').Take(15).ToArray();
                $scope.bar_events_md_ds = Enumerable.From($scope.result_events.events_type).Where('$.ac_type=="MD"').OrderByDescending('$.count').Take(15).ToArray();

                console.log('events ', $scope.bar_events_737_ds);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.get_fmd_route($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (responsex) {
                $scope.ds_route_type = responsex.Data.result_type_route;
                $.each($scope.ds_route_type, function (_i, _d) {
                    //var phase = Enumerable.From(response_phase.Data.result_type_crew_phase).Where(function (x) { return x.crew_id == _d.crew_id; }).OrderByDescending('$.total_score').ToArray();
                    //_d.ds_phase = phase;
                    _d.ds_reg_scores = Enumerable.From(_d.registers).Select('$.score_per_flight').ToArray();
                    _d.ds_reg_labels = Enumerable.From(_d.registers).Select('$.register').ToArray();
                });
                $scope.result_register_route = responsex.Data.result_register_route;
                $scope.ds_route_737 = Enumerable.From(responsex.Data.result_type_route).Where("$.ac_type=='B737'").OrderByDescending('$.score_per_flight').ToArray();
                $scope.ds_route_md = Enumerable.From(responsex.Data.result_type_route).Where("$.ac_type=='MD'").OrderByDescending('$.score_per_flight').ToArray();

               $scope.bar_route_737_ds = $scope.ds_route_737;
               $scope.bar_route_md_ds = $scope.ds_route_md;

               $scope.$evalAsync(() => $scope.renderRouteCharts($scope.ds_route_737, 'b737-route-'));
               $scope.$evalAsync(() => $scope.renderRouteCharts($scope.ds_route_md, 'md-route-'));


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //-----------Pilots-------------------------
            fdmService.get_fmd_crew($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response2) {
                //get_fmd_crew_phase
                $scope.result_crew = response2.Data.result_type_crew;
                fdmService.get_fmd_crew_phase($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response_phase) {
                    console.log(response_phase.Data.result_type_crew_phase);

                    $.each($scope.result_crew, function (_i, _d) {
                        var phase = Enumerable.From(response_phase.Data.result_type_crew_phase).Where(function (x) { return x.crew_id == _d.crew_id; }).OrderByDescending('$.total_score').ToArray();
                        _d.ds_phase = phase;
                        _d.ds_phase_scores = Enumerable.From(phase).Select('$.total_score').ToArray();
                        _d.ds_phase_labels = Enumerable.From(phase).Select('$.phase').ToArray();
                    });

                    $scope.bar_cpt_737_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="B737"').OrderByDescending('$.total_score').Take(10).ToArray();
                    $scope.bar_cpt_md_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="MD"').OrderByDescending('$.total_score').Take(10).ToArray();


                    $scope.ds_cpt_737 = Enumerable.From($scope.result_crew).Where('$.ac_type=="B737"').OrderByDescending('$.total_score').ToArray();
                    //$scope.renderPhaseCharts($scope.ds_cpt_737,'b737-'); // ← همین‌جا
                    $scope.$evalAsync(() => $scope.renderPhaseCharts($scope.ds_cpt_737, 'b737-'));

                    $scope.ds_cpt_MD = Enumerable.From($scope.result_crew).Where('$.ac_type=="MD"').OrderByDescending('$.total_score').ToArray();
                    $scope.$evalAsync(() => $scope.renderPhaseCharts($scope.ds_cpt_MD, 'md-'));

                    console.log('$scope.result_cre', $scope.bar_cpt_737_ds);
                    /////////////////////

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                $scope.cpt_all_737_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="B737"').OrderByDescending('$.total_count_per_100').ToArray();
                var avg = $scope.cpt_all_737_ds.length
                    ? $scope.cpt_all_737_ds.reduce(function (s, it) { return s + (+it.total_count_per_100 || 0); }, 0) / $scope.cpt_all_737_ds.length
                    : 0;
                avg = +avg.toFixed(2);
                // مقدار ثابت برای تمام نقاط سری میانگین
                $scope.cpt_all_737_ds.forEach(function (it) { it.avg_total_count_per100 = avg; });

                $scope.cpt_all_MD_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="MD"').OrderByDescending('$.total_count_per_100').ToArray();
                var avg = $scope.cpt_all_MD_ds.length
                    ? $scope.cpt_all_MD_ds.reduce(function (s, it) { return s + (+it.total_count_per_100 || 0); }, 0) / $scope.cpt_all_MD_ds.length
                    : 0;
                avg = +avg.toFixed(2);
                // مقدار ثابت برای تمام نقاط سری میانگین
                $scope.cpt_all_MD_ds.forEach(function (it) { it.avg_total_count_per100 = avg; });

                
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            // ---------- All CPT comparison------------------------
            //fdmService.get_fmd_all_cpts($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (res)
            //{
            //    var items = (res && res.Data && res.Data.result_type_crew) ? res.Data.result_type_crew : [];
            //    console.log('ca_type', x.ac_type);

            //    var q = Enumerable.From(items)
            //        .Where(function (y) { return y.ac_type === x.ac_type; })
            //        .OrderBy("$.total_count_per_100");
            //    $scope.cpt_all_ds = q.ToArray();

            //}, function (err) {
            //    console.error('get_fdm_all_cpts error', err);
            //    $scope.cpt_all_ds = [];
            //});


        };
        $scope.go_crew = function (x) {
            console.log('go_crew',x);
            var dt1 = moment($scope.dt_from).format('YYYY_MM_DD');
            var dt2 = moment($scope.dt_to).format('YYYY_MM_DD');
            // $location.path("/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2);
            $window.open("#!/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2 + "/"+x.ac_type, '_blank' )
        };

        $scope.show_events = function (x) {
            console.log('go_events', x);
            //fdmService.get_fmd_event_info($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response)

            //$scope.dg_events_ds
            // $location.path("/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2);
            $window.open("#!/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2 + "/" + x.ac_type, '_blank')
        };


        ///////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {



        });

        //end of controller
    }]);