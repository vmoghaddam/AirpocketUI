'use strict';
app.controller('zfdm_crew_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {
        //2025-05-22

        $scope.prms = $routeParams.prms;

        $scope.crew_id = $routeParams.crew_id;


        $scope.dt_from = new Date(2024, 10, 1);
        $scope.dt_to = new Date(2025, 5, 1);


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
        var lowColor = '#0099cc';
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
            title: 'Routes',

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
        ///////////////////////////////////////
        $scope.bind = function () {
            fdmService.get_fmd_crew_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {
                $scope.result_type_crew = response.Data.result_type_crew[0];
                $scope.crew_name = response.Data.result_type_crew[0].crew_name;
                $scope.bar_event_ds = response.Data.result_events;
                $scope.bar_route_ds = Enumerable.From(response.Data.result_type_crew_route).Where(function (x) { return x.count > 0; }).OrderByDescending('$.count').ToArray();
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
                $scope.result_register_crew = response.Data.result_register_crew;
                $scope.result_register_crew_route = response.Data.result_register_crew_route;
                $scope.result_type_crew_route = response.Data.result_type_crew_route;

                fdmService.get_fmd_crew_phase_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response_phase) {
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

                fdmService.get_fmd_crew_phase_route_id($scope.crew_id, $scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response_phase_route) {

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        ///////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            setTimeout(function () {
                $scope.bind();

            }, 500);

        });

        //end of controller
    }]);