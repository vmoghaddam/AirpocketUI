'use strict';
app.controller('zfdm_main_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {
        //2025-05-22

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
            name: 'A/C Type', valueField: 'score_per_flight', color: "#660033", hoverStyle: { color: "#000000" }, barWidth:50
        };

        ///////////////////////////////
        $scope.bar_reg_737 = {
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
                dataSource: 'bar_reg_737_ds',
                series: 'bar_reg_737_series',
                // 'argumentAxis.categories': 'yearMonth2',
                //size: 'chrt_size'
            },
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
                        text: arg.valueText ,//`${arg.seriesName} years: ${arg.valueText}`,
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
                        size:10
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
                        text: arg.valueText ,//`${arg.seriesName} years: ${arg.valueText}`,
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
                        text: arg.valueText ,//`${arg.seriesName} years: ${arg.valueText}`,
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
                        text: arg.valueText ,//`${arg.seriesName} years: ${arg.valueText}`,
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
        $('.zfdm_main').fadeIn();
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
        $scope.bind = function () {

            console.log($scope.dt_from);
            fdmService.get_fmd_all($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {

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

              //  $scope.build();

                //////////////////////////////////////
                fdmService.get_fmd_events($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response_events) {
                    $scope.result_events = response_events.Data;
                    $scope.bar_events_737_ds = Enumerable.From($scope.result_events.events_type).Where('$.ac_type=="B737"').OrderByDescending('$.count').Take(15).ToArray();
                    $scope.bar_events_md_ds = Enumerable.From($scope.result_events.events_type).Where('$.ac_type=="MD"').OrderByDescending('$.count').Take(15).ToArray();

                    console.log('events ', $scope.bar_events_737_ds);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
                        $scope.ds_cpt_MD = Enumerable.From($scope.result_crew).Where('$.ac_type=="MD"').OrderByDescending('$.total_score').ToArray();


                        console.log('$scope.result_cre', $scope.bar_cpt_737_ds);
                        /////////////////////

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                   

                    ///////////////////
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                $scope.$watch('ds_cpt_737', function (newVal) {
                    if (!newVal) return;

                    setTimeout(() => {
                        newVal.forEach((c, i) => {

                            const canvas = document.getElementById(`chart-${i}`);
                            if (!canvas) return;

                            const ctx = canvas.getContext('2d');

                            new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: c.ds_phase_labels, // مثلاً ['Takeoff', 'Cruise', 'Landing']
                                    datasets: [{
                                        label: 'Total Score',
                                        data: c.ds_phase_scores, // مثلاً [10, 12, 7]
                                        backgroundColor: '#cccccc',//'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'gray',//'rgba(75, 192, 192, 1)',
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    indexAxis: 'y',
                                    responsive: true,
                                    elements: {
                                        bar: {
                                            borderWidth: 1
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        x: {
                                            beginAtZero: true
                                        }
                                    }
                                }
                            });
                        });
                    }, 0); // برای اطمینان از اینکه DOM آماده‌ست
                });

                $scope.$watch('ds_cpt_MD', function (newVal) {
                    if (!newVal) return;

                    setTimeout(() => {
                        newVal.forEach((c, i) => {

                            const canvas = document.getElementById(`chartMD-${i}`);
                            if (!canvas) return;

                            const ctx = canvas.getContext('2d');

                            new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: c.ds_phase_labels, // مثلاً ['Takeoff', 'Cruise', 'Landing']
                                    datasets: [{
                                        label: 'Total Score',
                                        data: c.ds_phase_scores, // مثلاً [10, 12, 7]
                                        backgroundColor: '#cccccc',//'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'gray',//'rgba(75, 192, 192, 1)',
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    indexAxis: 'y',
                                    responsive: true,
                                    elements: {
                                        bar: {
                                            borderWidth: 1
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        x: {
                                            beginAtZero: true
                                        }
                                    }
                                }
                            });
                        });
                    }, 0); // برای اطمینان از اینکه DOM آماده‌ست
                });


                ///////////////////////////////////////
                //fdmService.get_fmd_route($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                ///////////////////////////////////////

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        };


        $scope.go_crew = function (x) {
            var dt1 = moment($scope.dt_from).format('YYYY_MM_DD');
            var dt2 = moment($scope.dt_to).format('YYYY_MM_DD');
           // $location.path("/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2);
            $window.open("#!/fdm/crew/z/" + x.crew_id + "/" + dt1 + "/" + dt2,'_blank')
        };


        ///////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {



        });

        //end of controller
    }]);