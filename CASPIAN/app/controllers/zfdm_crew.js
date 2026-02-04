'use strict';
app.controller('zfdm_crew_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {
        //2025-05-22

        $scope.prms = $routeParams.prms;

        $scope.crew_id = $routeParams.crew_id;
        $scope.ac_type = $routeParams.ac_type;

        $scope.dt_from = new Date(2024, 10, 1);
        $scope.dt_to = new Date(2025, 5, 1);
        $scope.position = $routeParams.position;

        $scope.get_date_prm = function (str) {

            var prts = str.split('_');
            return new Date(prts[0], Number(prts[1]) - 1, prts[2]);
        }

        $scope.dt_from = $scope.get_date_prm($routeParams.dt1);
        $scope.dt_to = $scope.get_date_prm($routeParams.dt2);




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
        $scope.chart_size_full_height = $(window).height() - 150;
        $scope.chart_size_half_height = $scope.chart_size_full_height / 2;
        $scope.chart_size_3rows_height = $scope.chart_size_full_height / 3;
        $scope.chart_size_full_width = $(window).width() - 35;
        $scope.chart_size_half_width = $scope.chart_size_full_width / 2;

        $scope.chart_size_3cols_width = $scope.chart_size_full_width / 3;
        $scope.chart_size_4cols_width = $scope.chart_size_full_width / 4;
        //////////////////////////////////
        $scope.rightHeight = $(window).height() - 124;
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
        /////////////////////////////////////
        $rootScope.page_title = '> Crew';
        $('.zfdm_crew').fadeIn();
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

        ////////////////////////////////////////
        var lowColor = '#A0E5C2';
        var medColor = '#ffcc66';
        var highColor = '#ff1a1a';
        $scope.monthConvert = function (monthNo) {
            $.each(MonthDataSource, function (_i, _d) {
                if (_d.Id == monthNo - 1)
                    $scope._title = _d.Title
            });

            return $scope._title;

        }

        var MonthDataSource = [
            { Id: 0, Title: 'January' },
            { Id: 1, Title: 'February' },
            { Id: 2, Title: 'March' },
            { Id: 3, Title: 'April' },
            { Id: 4, Title: 'May' },
            { Id: 5, Title: 'June' },
            { Id: 6, Title: 'July' },
            { Id: 7, Title: 'August' },
            { Id: 8, Title: 'September' },
            { Id: 9, Title: 'October' },
            { Id: 10, Title: 'November' },
            { Id: 11, Title: 'December' },

        ];


        $scope.pie_score = {

            type: 'doughnut',
            palette: [highColor,medColor,lowColor ],
            size: { height: 396 },

            title: 'Scores',

            series: {
                argumentField: 'title',
                valueField: 'value',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },

                    position: 'columns',
                },
            },


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
                    customizeText: function () {

                        return $scope.monthConvert(this.value);

                    },
                }
            },
            valueAxis: [{

                grid: {
                    visible: true
                },
                tickInterval: 1,

            }

            ],

            bindingOptions:
            {
                dataSource: 'pie_score_ds',
                'size.width': 'chart_size_4cols_width'
            },
        };
        $scope.pie_event = {

            type: 'doughnut',
            palette: [highColor, medColor, lowColor],
            size: { height: 410 },

            title: 'Events',

            series: {
                argumentField: 'title',
                valueField: 'value',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },

                    position: 'columns',
                },
            },


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
                    customizeText: function () {

                        return $scope.monthConvert(this.value);

                    },
                }
            },
            valueAxis: [{

                grid: {
                    visible: true
                },
                tickInterval: 1,

            }

            ],

            bindingOptions:
            {
                dataSource: 'pie_event_ds'
            },
        };
        $scope.pie_score_phase = {

            type: 'doughnut',
            palette: 'office',
            size: { height: 410 },

            title: 'Scores By Phase',

            series: {
                argumentField: 'title',
                valueField: 'value',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },

                    position: 'columns',
                },
            },


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
                    customizeText: function () {

                        return $scope.monthConvert(this.value);

                    },
                }
            },
            valueAxis: [{

                grid: {
                    visible: true
                },
                tickInterval: 1,

            }

            ],

            bindingOptions:
            {
                dataSource: 'pie_score_phase_ds'
            },
        };
        $scope.pie_event_phase = {

            type: 'doughnut',
            palette: 'office',
            size: { height: 396 },

            title: 'Events By Phase',

            series: {
                argumentField: 'title',
                valueField: 'value',
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1,
                    },

                    position: 'columns',
                },
            },


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
                    customizeText: function () {

                        return $scope.monthConvert(this.value);

                    },
                }
            },
            valueAxis: [{

                grid: {
                    visible: true
                },
                tickInterval: 1,

            }

            ],

            bindingOptions:
            {
                dataSource: 'pie_event_phase_ds'
            },
        };
 //-----------------------------------------------------------------
        $scope.bar_phase = {
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
            title: 'Event Count by Phase',
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

            },
             size: {
                height:396,

             },
            bindingOptions:
            {
                dataSource: 'bar_phase_ds',
                series: 'bar_phase_series',
                'size.width': 'chart_size_3cols_width'
                // 'argumentAxis.categories': 'yearMonth2',
                //'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_phase_series = {
            name: 'Phases', valueField: 'count', color: "#476b6b", hoverStyle: { color: "#000000" }, barWidth: 50
        };


        $scope.bar_register = {
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
            title: 'Event Count by Register',
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

            },
            size: {
                height: 396,

            },
            bindingOptions:
            {
                dataSource: 'bar_register_ds',
                series: 'bar_register_series',
                'size.width': 'chart_size_3cols_width'
                // 'argumentAxis.categories': 'yearMonth2',
                //'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_register_series = {
            name: 'Registers', valueField: 'event_count', color: "#ff3377", hoverStyle: { color: "#000000" }, barWidth: 50
        };

        //----------EWMA-------------------------
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

        $scope.CaptainEWMAEventsChart = {

            bindingOptions: { dataSource: 'CaptainEWMAEvents' },

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

                // { name: "CUSUM+", valueField: "CusumPos", axis: "cusumAxis", width: 1, color: COLOR_CPOS },
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
                //    {
                //        name: "cusumAxis",
                //        title: { text: "CUSUM" },
                //        position: "right",
                //        grid: { visible: false },
                //        constantLines: [{ value: 0, width: 1, dashStyle: "dash", color: "#9CA3AF" }]
                //    }
                //
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
                            //`CUSUM-: ${get("CUSUM-")}` +
                            `Alarm: ${get("Alarm")}`
                    };
                }
            },
            margin: { left: 70, right: 70, top: 10, bottom: 20 }
        };

        //---------Pareto-------------------------------

        $scope.CaptainParetoChart = {

            bindingOptions: { dataSource: 'CaptainPareto' },
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

        ////-----------------------------------------------------
        $scope.bar_event = {
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
            title: 'Events',

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
                     overlappingBehavior: "rotate",
                     rotationAngle: 45,
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
            //    height: 396,

            //},
            bindingOptions:
            {
                dataSource: 'bar_event_ds',
                series: 'bar_event_series',
                'size.height': 'chart_size_full_height',
                'size.width': 'chart_size_full_width'
                // 'argumentAxis.categories': 'yearMonth2',
                //'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_event_series = {
            name: 'Events', valueField: 'count', color: "#73264d", hoverStyle: { color: "#000000" }, barWidth: 50
        };

        $scope.bar_route = {
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
            title: 'Event Count by Route',
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
                    overlappingBehavior: "rotate",
                    rotationAngle: 45,
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
            //    height: 396,

            //},
            bindingOptions:
            {
                dataSource: 'bar_route_ds',
                series: 'bar_route_series',
                'size.height': 'chart_size_full_height',
                'size.width': 'chart_size_3cols_width'
                // 'argumentAxis.categories': 'yearMonth2',
                //'size.height': 'chart_size_half_height'
            },
        };
        $scope.bar_route_series = {
            name: 'Routes', valueField: 'count', color: "#2d5986", hoverStyle: { color: "#000000" }, barWidth: 50
        };

        // === CPT–FO Chart (Flights & Events/100) ===
        $scope.bar_cpt_fo_ds = [];

        $scope.bar_cpt_fo = {
            palette: 'Office',
            tooltip: { enabled: true, shared: true },
            commonSeriesSettings: {
                argumentField: 'fo_name',
                hoverMode: 'allArgumentPoints',
                selectionMode: 'allArgumentPoints',
                label: { visible: false },
                type: 'bar'
            },
            title: 'CPT–FO (Events & Events/100 Flights)',
            legend: { verticalAlignment: 'bottom', horizontalAlignment: 'center' },
            export: { enabled: false },
            // اگر Route شما rotated=true است، این را هم true بگذارید تا هم‌جهت شوند
            rotated: false,
            argumentAxis: {
                label: {
                    position: 'bottom',
                    overlappingBehavior: "rotate", rotationAngle: 90,
                    font: { size: 10 }
                }
            },
            valueAxis: [
                {
                    name: 'countAxis',
                    position: 'left',          // محور Flights پایین
                    title: { text: 'Events' }
                },
                {
                    name: 'rateAxis',
                    position: 'right',             // محور Events/100 بالا
                    title: { text: 'Events / 100 Flights' },
                    grid: { visible: false }
                }
            ],
            series: [
                { name: 'Event Count', valueField: 'event_count', axis: 'countAxis', type: 'bar', color: Color_event },
                { name: 'Flight Count', valueField: 'flight_count', axis: 'countAxis', type: 'bar', color: Color_flight },
                { name: 'Events/100', valueField: 'total_count_per_100', axis: 'rateAxis', type: 'spline', color: color_event_per100, width: 1, point: { visible: false, size: 3 }}
            ],
            bindingOptions: {
                dataSource: 'bar_cpt_fo_ds',
                'size.height': 'chart_size_full_height'
            }
        };

        //------------------- Captain Monthly Mix (year_month) ===
        $scope.cpt_month_mix_ds = [];
        $scope.cpt_month_mix =
        {
            title: 'Captain Monthly Events ',
            tooltip: { enabled: true, shared: true },
            legend: { verticalAlignment: 'bottom', horizontalAlignment: 'center' },

            commonSeriesSettings: {
                argumentField: 'year_month',
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
                label: { overlappingBehavior: 'stagger', font: { size: 10 } }
            },

            series: [
                // اگر می‌خواهی تعداد پرواز هم ستون جداگانه داشته باشد (در کنار استک L/M/H):
                {
                    name: 'Flights', valueField: 'flight_count', axis: 'countAxis',
                    type: 'stackedBar', stack: 'flights', color: Color_flight, opacity: 0.75
                },

                // سه ستون «روی هم» برای Low / Medium / High (همه در یک stack به نام 'sev')
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
                    name: 'Captains Average (Events/100)', valueField: 'avg_total_count_per100', axis: 'rateAxis',
                    type: 'spline', width: 2, color: color_avg_event_per100, point: { visible: false, size: 1 }
                }
            ],

            bindingOptions:
            {
                dataSource: 'cpt_month_mix_ds',
                //'size.height': 'chart_size_full_height'
            },
            margin: { left: 80, right: 80, top: 20, bottom: 20 },
            size: {
                height: 500,
                width: '100%'
            }
        };
        ////////////////////////////////////////////
        $scope.dg_events_columns = [
            //{
            //    cellTemplate: function (container, options) {
            //        $("<div style='text-align:center'/>")
            //            .html(options.rowIndex + 1)
            //            .appendTo(container);
            //    }, name: 'row', caption: '#', barWidth: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            //}, 
            { dataField: 'std', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yy-MM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
            { dataField: 'ac_type2', caption: 'Fleet', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            { dataField: 'register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            { dataField: 'flight_number', caption: 'Flight No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            { dataField: 'event_name', caption: 'Event', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 190 },
            { dataField: 'severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            // { dataField: 'type', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },




            { dataField: 'phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
            // { dataField: 'state_name', caption: 'State Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

            //{ dataField: 'arr_iata', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },

            { dataField: 'ip1_name', caption: 'IP', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 170 },
            { dataField: 'cp1_name', caption: 'P1', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 170 },
            { dataField: 'cp2_name', caption: 'P2', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 170 },


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
        $scope.dg_events_height = 500;

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
            selection: { mode: 'single' },
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


            onRowPrepared: function (e) {
                if (e.data && e.data.Severity && e.data.Severity == 'High') e.rowElement.css('background', '#ff8566');
                if (e.data && e.data.Severity && e.data.Severity == 'Medium') e.rowElement.css('background', '#ffd480');
                //  e.rowElement.css('background', '#ffccff');

            },

            onCellPrepared: function (e) {
                //lightgray
                if (e.rowType === "data" && e.column.dataField == "severity" && e.data.severity == 'Medium')
                    e.cellElement.css("backgroundColor", "#ffe699");
                if (e.rowType === "data" && e.column.dataField == "severity" && e.data.severity == 'High')
                    e.cellElement.css("backgroundColor", "#d98c8c");
                if (e.rowType === "data" && e.column.dataField == "severity" && e.data.severity == 'Low')
                    e.cellElement.css("backgroundColor", "#b3e6cc");

            },
        };
        $scope.get_events = function (type, register_id, cpt_id, route, phase, severity,position) {
            $scope.loadingVisible = true;
            fdmService.get_fmd_event_info_new(
                $scope.formatDateYYYYMMDD($scope.dt_from),
                $scope.formatDateYYYYMMDD($scope.dt_to),
                type,
                register_id,
                cpt_id,
                route,
                phase,
                severity,
                position
            ).then(function (response) {
                $scope.loadingVisible = false;
                //console.warn("Yesss", response.Data);

                // $scope.dg_events_ds = response.data.data?.Items;
                // $scope.dg_events_ds = response.data.data?.Items || [];
                if (response.Data) {
                    //console.warn("Yesss", response.Data);

                    $scope.dg_events_ds = response.Data.Items;
                    
                } else {
                    console.warn("No Items in response", response.Data);
                    $scope.dg_events_ds = [];
                   
                }


            });
        }
        ///////////////////////////////////////
        $scope.bind = function ()
        {
            fdmService.get_fmd_crew_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), $scope.position).then(function (response) {
                /*
                //$scope.result_type_crew = response.Data.result_type_crew[0];
               //$scope.result_type_crew=Enumerable.From(response.Data.result_type_crew[0]).Where(function (x) { return x.crew_position == $scope.position; }).ToArray();
                $scope.result_type_crew = (response.Data.result_type_crew || []).filter(function (x)
                {
                    return x.crew_position === $scope.position;
                });
                console.log('$scope.position', $scope.position);
                console.log('$scope.result_type_crew ', $scope.result_type_crew);

                $scope.crew_name = response.Data.result_type_crew[0].crew_name;
               // $scope.bar_event_ds = response.Data.result_events;
                $scope.pie_score_ds = [
                    { title: 'High', value: $scope.result_type_crew.high_score },
                    { title: 'Medium', value: $scope.result_type_crew.medium_score },
                    { title: 'Low', value: $scope.result_type_crew.low_score },
                ];
                $scope.pie_event_ds = [
                    { title: 'High', value: $scope.result_type_crew.high_count },
                    { title: 'Medium', value: $scope.result_type_crew.medium_count },
                    { title: 'Low', value: $scope.result_type_crew.low_count },
                ];
                */
               // $scope.result_type_crew = (response.Data.result_type_crew || []).filter(function (x) {  return x.crew_position == $scope.position;  });
                $scope.result_type_crew = response.Data.result_type_crew;
                console.log('$scope.result_type_crew', $scope.result_type_crew);

                // یک آیتم انتخاب کن (اگر وجود داشته باشد)
                $scope.crewItem = $scope.result_type_crew.length > 0 ? $scope.result_type_crew[0] : null;

                if ($scope.crewItem) {
                    // اگر می‌خواهی اسم را هم روی همین فیلتر بگیری، از crewItem استفاده کن
                    $scope.crew_name = $scope.crewItem.crew_name;

                    $scope.pie_score_ds = [
                        { title: 'High', value: $scope.crewItem.high_score || 0 },
                        { title: 'Medium', value: $scope.crewItem.medium_score || 0 },
                        { title: 'Low', value: $scope.crewItem.low_score || 0 }
                    ];

                    $scope.pie_event_ds = [
                        { title: 'High', value: $scope.crewItem.high_count || 0 },
                        { title: 'Medium', value: $scope.crewItem.medium_count || 0 },
                        { title: 'Low', value: $scope.crewItem.low_count || 0 }
                    ];
                } else {
                    // اگر هیچ رکوردی نباشد
                    $scope.crew_name = '';
                    $scope.pie_score_ds = [];
                    $scope.pie_event_ds = [];
                }
                $scope.bar_route_ds = Enumerable.From(response.Data.result_type_crew_route).Where(function (x) { return x.count > 0 ; }).OrderByDescending('$.count').ToArray();

                //$scope.result_register_crew = response.Data.result_register_crew;
                //$scope.result_register_crew_route = response.Data.result_register_crew_route;
                //$scope.result_type_crew_route = response.Data.result_type_crew_route;
                var all_register_crew = response.Data.result_register_crew || [];
                var all_register_crew_route = response.Data.result_register_crew_route || [];
                var all_type_crew_route = response.Data.result_type_crew_route || [];

                $scope.result_register_crew = all_register_crew.filter(function (x) { return x.crew_position == $scope.position;});
                $scope.result_register_crew_route = all_register_crew_route.filter(function (x) { return x.crew_position == $scope.position; });
                $scope.result_type_crew_route = all_type_crew_route.filter(function (x) { return x.crew_position === $scope.position;});

                fdmService.get_fmd_crew_phase_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), $scope.position).then(function (response_phase) {
                    $scope.result_type_crew_phase = response_phase.Data.result_type_crew_phase;
                    $scope.pie_score_phase_ds = [];
                    $scope.pie_event_phase_ds = [];
                    $.each($scope.result_type_crew_phase, function (_i, _d) {
                        $scope.pie_score_phase_ds.push({ title: _d.phase, value: _d.total_score});
                        $scope.pie_event_phase_ds.push({ title: _d.phase, value: _d.count});
                    });
                    $scope.bar_phase_ds = $scope.result_type_crew_phase;
                    $scope.bar_register_ds = response.Data.result_register_crew;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                fdmService.get_fmd_crew_phase_route_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), $scop.position).then(function (response_phase_route) {

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //-------EWMA---------------------
            fdmService.get_fmd_ewma_captain($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), $scope.crew_id, $scope.position).then(function (res) {
                $scope.CaptainEWMAEvents = (res && res.Data && res.Data.items) ? res.Data.items.map(function (r) {
                    const alarm = (r.Alarm !== undefined) ? r.Alarm : true;

                    return {
                        Date: new Date(r.Date),
                        Daily: r.EventRatePer100,
                        EWMA: r.Ewma,
                        CusumPos: r.CusumPos,
                        CusumNeg: r.CusumNeg,
                        Alarm: r.Alarm,
                        AlarmEWMA: alarm ? r.Ewma : null // فقط وقتی آلارم دارد مقدار EWMA؛ وگرنه null

                    };
                }) : [];

                //console.log('CaptainEWMAevents ', $scope.captainEWMAEvents);
                //}
            });
            //-----------------pareto-----------------
            fdmService.get_fmd_cpt_pareto($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to), 20, $scope.crew_id, $scope.position).then(function (res)
            {
                if (res.IsSuccess)
                {
                    $scope.CaptainPareto = res.Data.Items || [];
                }
                else
                {
                    console.error('Error fetching Pareto data:', res.Data);
                    $scope.CaptainPareto = []; // در صورت خطا، آرایه را خالی کنید

                }
            }).catch(function (error)
            {
                console.error('API Call Failed:', error);
                $scope.CaptainPareto = [];
            });
            //---------------CPT FO-----------------------
            fdmService.get_fmd_cpt_fo($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (res) {
                var all = (res && res.Data && res.Data.combined) ? res.Data.combined : [];
                //var ac = $scope.selected_ac_type || null;   // مثل 'A320'
                
                var pairs = Enumerable.From(all).Where(function (x) { return Number(x.cpt_id) === Number($scope.crew_id) && x.ac_type === $scope.ac_type; });
                //if (ac) pairs = pairs.Where(function (x) { return x.ac_type === $scope.ac_type; });
                var byFo = pairs.OrderByDescending("$.total_count_per_100").Select(function (x)
                {
                        return {
                            fo_id: x.fo_id,
                            fo_name: x.fo_name,
                            ac_type: x.ac_type,
                            flight_count: x.flight_count,
                            event_count: x.event_count,
                            total_count_per_100: x.total_count_per_100 
                        };
                    })
                    .ToArray();

                    $scope.bar_cpt_fo_ds = byFo;
                }, function (err) {
                    console.error('get_events_cpt_fo error', err);
                    $scope.bar_cpt_fo_ds = [];
            }); 

            // --- Monthly CPT ------------------------
            fdmService.get_fmd_monthlyCPT($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to),$scope.crew_id).then(function (res)
            {
                var items = (res && res.Data && res.Data.items) ? res.Data.items : [];
               // var cptId = Number($scope.crew_id);
                console.log('ca_type', $scope.ac_type);
                // فقط رکوردهای کاپیتان منتخب و همین ac_type
                var q = Enumerable.From(items)
                    .Where(function (x) { return Number(x.ac_type === $scope.ac_type); });

                var byMonth = q.OrderBy("$.year").ThenBy("$.month")
                    .Select(function (x) {
                        return {
                            year: x.year,
                            month: x.month,
                            year_month: x.year_month,

                            // داده‌های Count برای ستون‌های stacked
                            flight_count: x.flight_count,
                            low_count: x.low_count,
                            medium_count: x.medium_count,
                            high_count: x.high_count,
                            total_count_per_100: x.total_count_per_100,
                            avg_total_count_per100:
                                (x.FleetAvg && x.FleetAvg.avg_total_count_per100 != null)
                                    ? x.FleetAvg.avg_total_count_per100
                                    : null
                        };
                    })
                    .ToArray();

                $scope.cpt_month_mix_ds = byMonth;

                }, function (err) {
                    console.error('get_cpt_monthly error', err);
                    $scope.cpt_month_mix_ds = [];
                });
            //})();
            $scope.get_events("-", 0, $scope.crew_id, "-", "-", "-", $scope.position);

        }
        ///////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            setTimeout(function () {
                $scope.bind();

            }, 500);

        });

        //end of controller
    }]);