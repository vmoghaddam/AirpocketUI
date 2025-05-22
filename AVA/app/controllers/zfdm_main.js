'use strict';
app.controller('zfdm_main_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {


        $scope.prms = $routeParams.prms;
        $scope.activeTab = 'fleet';


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
        ///////////////////////////////////
        $rootScope.page_title = '> FDM';
        $('.zfdm_main').fadeIn();
        /////////////////////////////////////////
        $scope.formatDateYYYYMMDD = function (dt) {
            return moment(dt).format('YYYY-MM-DD');
        };

        $scope.result_type_737 = null;
        $scope.bind = function () {

            console.log($scope.dt_from);
            fdmService.get_fmd_all($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {

                $scope.result_type = response.Data.result_type;
                $scope.result_route = response.Data.result_route_flight;
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
                $scope.result_register_flight = response.Data.result_register_flight;

                $scope.bar_reg_737_ds = Enumerable.From($scope.result_register_flight).Where('$.ac_type=="B737"').OrderByDescending('$.score_per_flight').ToArray();
                $scope.bar_reg_md_ds = Enumerable.From($scope.result_register_flight).Where('$.ac_type=="MD"').OrderByDescending('$.score_per_flight').ToArray();

                $scope.bar_route_737_ds = Enumerable.From($scope.result_route).Where('$.ac_type=="B737"').OrderByDescending('$.score_per_flight').Take(10).ToArray();
                $scope.bar_route_md_ds = Enumerable.From($scope.result_route).Where('$.ac_type=="MD"').OrderByDescending('$.score_per_flight').Take(10).ToArray();

              //  $scope.build();

                //////////////////////////////////////
                fdmService.get_fmd_crew($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response2) {
                    $scope.result_crew = response2.Data.result_register_flight_crew;
                   
                    $scope.bar_cpt_737_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="B737"').OrderByDescending('$.total_score').Take(10).ToArray();
                    $scope.bar_cpt_md_ds = Enumerable.From($scope.result_crew).Where('$.ac_type=="MD"').OrderByDescending('$.total_score').Take(10).ToArray();
                    console.log('$scope.result_cre', $scope.bar_cpt_737_ds);
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                ///////////////////////////////////////
                //fdmService.get_fmd_route($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                ///////////////////////////////////////

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        };


        ///////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {



        });

        //end of controller
    }]);