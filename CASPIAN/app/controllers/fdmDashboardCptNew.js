'use strict';
app.controller('fdmDashboardCptNew', ['$scope', 'fdmService', '$q', '$rootScope', function ($scope, fdmService, $q, $rootScope) {

    $scope.isContentVisible = false;


    $scope.selectCpt = function (cpt) {
        $rootScope.cpt = cpt;
        $rootScope.yt = $scope.yt;
        $rootScope.yf = $scope.yf;
        $rootScope.mt = $scope.mt;
        $rootScope.mf = $scope.mf;
         window.location = "#!/fdm/dashboard/cpt/monthly/" + cpt.CptId + "/" + cpt.JobGroup + "/" + $scope.yt + "/" + $scope.yf + "/" + $scope.mt + "/" + $scope.mf;
   }


    $scope.rightHeight = $(window).height() - 114;
    $scope.fdm_scroll = {
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


    $scope.yt = new Date().getFullYear();
    $scope.mt = new Date().getMonth();
    $scope.yt = 2022;
    $scope.mt = 11;
   

    if ($scope.mt - 6 < 0) {
        $scope.result = $scope.mt - 6;
        $scope.yf = $scope.yt - 1;
        $scope.mf = 12 + $scope.result
    } else {
        $scope.yf = $scope.yt;
        $scope.mf = $scope.mt - 6;
    }

    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };
    $scope.sb_mf = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mf',


        }
    };
    $scope.sb_mt = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mt',


        }
    };


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

    $scope.monthConvert = function (monthNo) {
        $.each(MonthDataSource, function (_i, _d) {
            if (_d.Id == monthNo - 1)
                $scope._title = _d.Title
        });

        return $scope._title;

    }

    $scope.bind = function () {

        fdmService.getTopCpt2($scope.yf, $scope.yt, $scope.mf + 1, $scope.mt + 1).then(function (response) {

            $scope.ds_topCpt = response.Data;
            $scope.isShow = true;
        })

        fdmService.getAllCptMonthly($scope.yf, $scope.yt, $scope.mf, $scope.mt).then(function (response) {
            $scope.TRECharts = [];
            $scope.TRICharts = [];
            $scope.P1Charts = [];
            $scope.P2Charts = [];

            console.log(response);

            $scope.Events = response.Data;


            $.each(response.Data, function (_i, _d) {

                switch (_d.JobGroup) {
                    case "P2":
                        $scope.P2Charts.push({ chart: $scope.getChart(_d), totalInfo: _d })
                        break;
                    case "P1":
                        $scope.P1Charts.push({ chart: $scope.getChart(_d), totalInfo: _d })
                        break;
                    case "TRI":
                        $scope.TRICharts.push({ chart: $scope.getChart(_d), totalInfo: _d })
                        break;
                    case "TRE":
                        $scope.TRECharts.push({ chart: $scope.getChart(_d), totalInfo: _d })
                        break;
                }

                //                $scope.charts.push({ chart: $scope.getChart(_d), totalInfo: _d })

            });


            setTimeout(function () {
                $.each($scope.P1Charts, function (_i, _d) {
                    $scope.totalEvent = _d.totalInfo;
                    zingchart.render({
                        id: 'id-1' + _i,
                        data: _d.chart,
                        height: 270,

                    });
                });
                $.each($scope.P2Charts, function (_i, _d) {
                    $scope.totalEvent = _d.totalInfo;
                    zingchart.render({
                        id: 'id-2' + _i,
                        data: _d.chart,
                        height: 270,

                    });
                });
                $.each($scope.TRICharts, function (_i, _d) {
                    $scope.totalEvent = _d.totalInfo;
                    zingchart.render({
                        id: 'id-3' + _i,
                        data: _d.chart,
                        height: 270,

                    });
                });
                $.each($scope.TRECharts, function (_i, _d) {
                    $scope.totalEvent = _d.totalInfo;
                    zingchart.render({
                        id: 'id-4' + _i,
                        data: _d.chart,
                        height: 270,

                    });
                });


            }, 1500);
            $scope.isContentVisible = true;
        });
    }




    $scope.getChart = function (item) {
        var values = [];
        var labels = [];
        $.each(item.Items, function (_i, _d) {
            values.push([_d.Month, _d.Score]);
            labels.push($scope.monthConvert(_d.Month))
        })


        var config = {
            type: "line",
            title: {
                // text: item.CptName,
                fontSize: 10,
            },
            legend: {
                draggable: true,
                visible: false
            },
            scaleX: {
                label: { text: 'Months' },
                //labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: labels,
            },
            scaleY: {
                label: { text: 'Scores' }
            },
            plot: {
                aspect: "spline",
                animation: {
                    effect: 'ANIMATION_EXPAND_BOTTOM',
                    method: 'ANIMATION_STRONG_EASE_OUT',
                    sequence: 'ANIMATION_BY_NODE',
                    speed: 275,
                }
            },

            series: [{
                values: values
            }]
        };

        /////////////////////////////
        return config;
    };


    $scope.topCptChart = {
        size: { height: 600, width: $(window).width() - 70 },
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },

        commonSeriesSettings: {
            argumentField: 'CptName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', barWidth: 50, color: 'red' },
        ],

        //palette: 'bright',

        title: 'Top Captain',
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

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

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
            dataSource: 'ds_topCpt'
        },
    };













}]);


