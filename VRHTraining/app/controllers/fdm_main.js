'use strict';
app.controller('fdm_main_controller', ['$scope', '$location', '$routeParams', '$rootScope', 'fdmService', '$window', '$compile', '$interval', '$timeout'
    , function ($scope, $location, $routeParams, $rootScope, fdmService, $window, $compile, $interval, $timeout) {

        $scope.prms = $routeParams.prms;


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
        $scope.dt_from = new Date(2024,0,1);
        $scope.dt_to = new Date(2024,3,1);
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
        ///////////////////////////////////
        ///////////////////////
        //if (!authService.isAuthorized()) {

        //    authService.redirectToLogin();
        //}
        //else {
        //    $rootScope.page_title = '> Courses';
        //    $('.courseperson').fadeIn();
        //}
        $rootScope.page_title = '> FDM';
        $('.fdm_main').fadeIn();
        //////////////////////////////////////////

        $scope.result_type = [];
        $scope.result_register_flight = []; // داده‌ها از سرور اینجا ست میشه

        //    [
        //    {
        //        "ac_type": "B737",
        //        "count": 1916,
        //        "flight_count": 2955,
        //        "total_score": 3386,
        //        "score_per_flight": 1.1,
        //        "high_score": 1404,
        //        "medium_score": 834,
        //        "low_score": 1148,
        //        "high_count": 351,
        //        "medium_count": 417,
        //        "low_count": 1148
        //    },
        //    {
        //        "ac_type": "MD",
        //        "count": 2124,
        //        "flight_count": 5508,
        //        "total_score": 4559,
        //        "score_per_flight": 0.8,
        //        "high_score": 2392,
        //        "medium_score": 1282,
        //        "low_score": 885,
        //        "high_count": 598,
        //        "medium_count": 641,
        //        "low_count": 885
        //    }
        //];

        $scope.build = function () {
            $timeout(function () {
                $scope.result_type.forEach(function (type, index) {
                    // Donut Chart
                    Plotly.newPlot('donut-chart-' + index, [{
                        values: [type.high_count, type.medium_count, type.low_count],
                        labels: ['High', 'Medium', 'Low'],
                        type: 'pie',
                        hole: .5,
                        marker: {
                            colors: ['#42a5f5', '#ffca28', '#ef5350']
                        },
                        textinfo: "label+value",
                        textposition: "inside"
                    }], {
                        showlegend: false,
                        height: 300, // 🔧 افزایش ارتفاع
                        //margin: { t: 0, b: 30 }
                    }, { displayModeBar: false });
                    Plotly.Plots.resize(document.getElementById('donut-chart-' + index));

                    // Bar Chart
                    Plotly.newPlot('bar-chart-' + index, [{
                        x: ['High', 'Medium', 'Low'], // ✅ بدون "Score"
                        y: [type.high_score, type.medium_score, type.low_score],
                        type: 'bar',
                        marker: {
                            color: ['#42a5f5', '#ffca28', '#ef5350']
                        },
                        text: [type.high_score, type.medium_score, type.low_score],
                        textposition: 'auto'
                    }], {
                        margin: { t: 10 },
                        height: 200,
                        yaxis: { title: 'Score', rangemode: 'tozero' },
                        showlegend: false
                    }, { displayModeBar: false });
                });

                // Summary Bar Chart
                Plotly.newPlot('summary-bar-chart', [{
                    x: $scope.result_type.map(t => t.ac_type),
                    y: $scope.result_type.map(t => t.score_per_flight),
                    type: 'bar',
                    marker: {
                        color: '#26a69a'
                    },
                    text: $scope.result_type.map(t => t.score_per_flight),
                    textposition: 'auto'
                }], {
                    margin: { t: 10 },
                    yaxis: { title: 'Score/Flight', range: [0, 3] },
                    showlegend: false,
                    height: 300
                }, { displayModeBar: false });

                $scope.result_type.forEach(function (type, typeIndex) {
                    var registers = $scope.result_register_flight.filter(function (r) {
                        return r.ac_type === type.ac_type;
                    });
                    registers.forEach(function (reg, regIndex) {
                        Plotly.newPlot('donut-chart-reg-' + typeIndex + '-' + regIndex [{
                            values: [reg.high_count, reg.medium_count, reg.low_count],
                            labels: ['High', 'Medium', 'Low'],
                            type: 'pie',
                            hole: .5,
                            marker: {
                                colors: ['#42a5f5', '#ffca28', '#ef5350']
                            },
                            textinfo: "label+value",
                            textposition: "inside"
                        }], {
                            showlegend: false,
                            height: 300
                        }, { displayModeBar: false });

                        Plotly.newPlot('bar-chart-reg-' + regIndex, [{
                            x: ['High', 'Medium', 'Low'],
                            y: [reg.high_score, reg.medium_score, reg.low_score],
                            type: 'bar',
                            marker: {
                                color: ['#42a5f5', '#ffca28', '#ef5350']
                            },
                            text: [reg.high_score, reg.medium_score, reg.low_score],
                            textposition: 'auto'
                        }], {
                            margin: { t: 10 },
                            height: 200,
                            yaxis: { title: 'Score', rangemode: 'tozero' },
                            showlegend: false
                        }, { displayModeBar: false });
                    });

                    
                });

                // مقایسه score_per_flight برای رجیسترها
                var regLabels = $scope.result_register_flight.map(r => r.register + ' (' + r.ac_type + ')');
                var regScores = $scope.result_register_flight.map(r => r.score_per_flight);

                Plotly.newPlot('summary-register-bar-chart', [{
                    x: regLabels,
                    y: regScores,
                    type: 'bar',
                    marker: { color: '#7e57c2' },
                    text: regScores.map(x => x.toFixed(2)),
                    textposition: 'auto'
                }], {
                    margin: { t: 20, b: 80 },
                    height: 300,
                    yaxis: { title: 'Score per Flight' }
                }, { displayModeBar: false });





            }, 100);


        }

        $timeout(function () {


        }, 100);

        console.log('test console', $scope.result_type);
        $scope.formatDateYYYYMMDD = function (dt) {
            return moment(dt).format('YYYY-MM-DD');
        };
        $scope.bind = function () {

            console.log($scope.dt_from);
            fdmService.get_fmd_all($scope.formatDateYYYYMMDD($scope.dt_from), $scope.formatDateYYYYMMDD($scope.dt_to)).then(function (response) {
                 
                $scope.result_type = response.Data.result_type;
                $scope.result_register_flight = response.Data.result_register_flight;

                $scope.build();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        };


        /////////////////////////////////////////

        $scope.$on('$viewContentLoaded', function () {



        });

        //end of controller
    }]);