'use strict';
app.controller('statDelayController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'statService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, statService, weatherService, aircraftService, authService, notificationService, $route) {
    
    $scope.isMainVisible = false;
    $scope.prms = $routeParams.prms;
    /////////////////////////////////////
    $scope.height550 = 350;
     $scope.resize = function () {


        var headerheight = $('.hx').height() ? $('.hx').height() : $rootScope.headerHeight;
        //alert(headerheight);
        $scope.scroll_height = $(window).height() - headerheight - 40;
        $scope.scroll_height_det = $(window).height() - headerheight - 40 - 42 + 20;
        $scope.scroll_height_detd = $(window).height() - headerheight - 40 - 42 -10;
        $scope.barWidth = 50;
        $scope.diameter = 0.85;
        var width = $(window).width();
        //alert(width);
        if (width <= 400) {
            //goh
            $scope.height550 = 350;
            $scope.barWidth = 20;
            $scope.diameter = 0.65;
        } else {
            if (width > 400 && width <= 640) {
                $scope.barWidth = 30;
                $scope.height550 = 350;
            }
            else if (width > 640 && width <= 768) {
                $scope.height550 = 400;
            }
            else {
                $scope.height550 = 550;
            }
            
        }
       // alert($scope.height550);

    };
    $scope.resize();
    //////////////////////////////////
    var tabs = [
        { text: "Total", id: 'summery' },
         { text: "Category", id: 'category' },
           { text: "Airport", id: 'airport' },
        { text: "Detail", id: 'detail' },
        //{ text: "By Register", id: 'register' },
        //{ text: "By Route", id: 'route' },
        //{ text: "Details", id: 'details' },

    ];
    var tabs_detail = [
       { text: "Total", id: 'dsummery' },
        { text: "Category", id: 'dcategory' },
          { text: "Airport", id: 'dairport' },
       
       

    ];
    $scope.tabs = tabs;
    $scope.tabs_detail = tabs_detail;

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;
        $('#' + id).fadeIn(500, function () {
            $scope.dg_yearweekcat_instance.repaint();
            $scope.dg_yearcat_instance.repaint();
            $scope.dg_yearweekapt_instance.repaint();
            $scope.dg_yearapt_instance.repaint();
            $scope.dg_yearaptcat_instance.repaint();
            $scope.dg_yearweekaptcat_instance.repaint();
        });
        if (id == 'airport') {
            $('.pies1').each(function () {
                $(this).dxPieChart("instance").render();
            });
        }
        // $scope.dg_course_visible = newValue == 0;
        // $scope.dg_course_all_visible = newValue == 1;
    });
    $scope.$watch("selectedTabDetailIndex", function (newValue) {
        $('.tabcd').hide();
        var id = tabs_detail[newValue].id;
        $('#' + id).fadeIn(500, function () {
            if ($scope.line_daily_instance)
            $scope.line_daily_instance.render();
            if ($scope.line_dailydl_instance)
            $scope.line_dailydl_instance.render();
            if ($scope.line_daycat_instance)
            $scope.line_daycat_instance.render();
            if ($scope.bar_daycat_instance)
            $scope.bar_daycat_instance.render();
            if ($scope.pie_cat_instance)
            $scope.pie_cat_instance.render();
            if ($scope.bar_cat_instance)
            $scope.bar_cat_instance.render();
        });
        if (id == 'dairport') {
            $('.pies2').each(function () {
                $(this).dxPieChart("instance").render();
            });
            $scope.line_dayapt_instanse.render();
            $scope.bar_dayapt_instanse.render();
            $scope.line_dayaptcat_instanse.render();

            $scope.bar_dayaptcat_instanse.render();
        }
         
    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.tabs_detail_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_detail", deep: true },
            selectedIndex: 'selectedTabDetailIndex'
        }

    };
    $scope.selectedTabIndex = 0;
    $scope.selectedTabDetailIndex = -1;
    //////////////////////////////////
    $scope.boardSummary = {
        arrived: '-',

        flights: '-',
        flightTime: '-',
        flightTimeStr: '-',
        fixTime: '-',
        blockTime: '-',
        blockTimeStr: '-',
        cancled: '-',
        delayRatio: '-',
        delay: '-',
        delayStr: '-',

        pax: '-',
        seat: '-',

        paxLoad: '-',


    };
    //////////////////////////////////
    var offset = -1 * (new Date()).getTimezoneOffset();
    $scope.dsUrl = null;
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };

    $scope.data = null;
    $scope.lineDayCatSeries = [];
    $scope.lineDayAptSeries = [];
    $scope.lineDayAptCatSeries = [];
    $scope.lineDayAptCatSeriesTemp = [];
    $scope.chbDayCats = [];
    $scope.chbDayApts = [];
    $scope.selectedCatsDaily2 = {};
    $scope.selectedDailyAptCatsChangedEnabled = false;
    $scope.selectedDailyAptCatsChanged = function () {
        //suny
        if (!$scope.selectedDailyAptCatsChangedEnabled)
            return;
        $scope.lineDayAptCatSeries = [];
        for (var apt in $scope.selectedAptsDaily2) {
            
            for (var cat in $scope.selectedCatsDaily2) {
                var key = apt + '-' + cat;
                //$scope.line_dayaptcat_instanse.getSeriesByName(key).hide();
                //$scope.bar_dayaptcat_instanse.getSeriesByName(key).hide();
                //$scope.line_dayaptcat_instanse.getSeriesByName(key).showInLegend=false;
                //$scope.bar_dayaptcat_instanse.getSeriesByName(key).showInLegend = false;
                if ($scope.selectedAptsDaily2[apt] && $scope.selectedCatsDaily2[cat])
                {
                    var series = Enumerable.From($scope.lineDayAptCatSeriesTemp).Where('$.name=="'+key+'"').FirstOrDefault();
                    if (series) {
                        $scope.lineDayAptCatSeries.push(JSON.parse(JSON.stringify(series)));
                    }
                    //$scope.line_dayaptcat_instanse.getSeriesByName(key).show();
                    //$scope.bar_dayaptcat_instanse.getSeriesByName(key).show();
                    //$scope.line_dayaptcat_instanse.getSeriesByName(key).showInLegend = true;
                    //$scope.bar_dayaptcat_instanse.getSeriesByName(key).showInLegend = true;
                }
                
            }

        }
        
        $scope.line_dayaptcat_instanse.render();
        $scope.bar_dayaptcat_instanse.render();
    };
    $scope.bind = function () {
        // Config.CustomerId
        var dt = $scope.dt_to ? $scope.dt_to : new Date(2200, 4, 19, 0, 0, 0);
        var df = $scope.dt_from ? $scope.dt_from : new Date(1900, 4, 19, 0, 0, 0);
        ///////////////////////////////
        //init 
        $scope.lineDayAptCatSeriesTemp = [];
        $scope.lineDayAptCatSeries = [];
        //////////////////////////////
        $scope.loadingVisible = true;
        statService.getDelayStat(Config.CustomerId, df, dt).then(function (response) {
            $scope.loadingVisible = false;
             
            $scope.data = response;
            console.log('daily');
            console.log($scope.data);
            $scope.dg_cat_height = (response.category.length + 1) * 32;
            //  if ($scope.dg_cat_height > 250)
            //    $scope.dg_cat_height = 250;
            $scope.dg_cat_height = 300;
            $scope.barMax = 0;
            
            $scope.barMax += 5;
            $scope.dg_cat_ds = response.category;
            $scope.dg_cat_det_ds = response.categoryDetails;

            $scope.pie_cat_ds = response.category;
            $scope.pie_air_ds = response.airport;
            $scope.bar_cat_ds = response.category;

            $scope.dg_air_ds = response.airport;
            $scope.dg_airc_ds = response.airportCategory;
            $scope.dg_air_det_ds = response.airportDetails;
            var aircatgrouped = Enumerable.From(response.airportCategory).GroupBy("$.Airport", null,
                         function (key, g) {
                             var result = {
                                 Airport: key,

                                 Items: g.OrderBy('$.Category').ToArray(),
                             };
                             return result;
                         }).OrderBy('$.Airport').ToArray();

            var aircats = Enumerable.From(response.airportCategory).Select('$.Category').OrderBy('$').Distinct().ToArray();
            $scope.bar_airc_series = [];
            $.each(aircats, function (_i, _d) {
                $scope.bar_airc_series.push({ valueField: _d, name: _d, color: $scope.data.categoryColors[_d] });
            });
            $scope.bar_airc_ds = [];

            $.each(aircatgrouped, function (_i, _d) {
                var item = { Airport: _d.Airport };
                $.each(_d.Items, function (_j, _x) {
                    item[_x.Category] = _x.Delay;
                });
                $scope.bar_airc_ds.push(item);
            });
            ////////////////////////
            var catairgrouped = Enumerable.From(response.airportCategory).GroupBy("$.Category", null,
                       function (key, g) {
                           var result = {
                               Category: key,

                               Items: g.OrderBy('$.Airport').ToArray(),
                           };
                           return result;
                       }).OrderBy('$.Category').ToArray();
            var catairs = Enumerable.From(response.airportCategory).Select('$.Airport').OrderBy('$').Distinct().ToArray();
            $scope.bar_cata_series = [];
            $.each(catairs, function (_i, _d) {
                $scope.bar_cata_series.push({ valueField: _d, name: _d, color: $scope.data.airportColors[_d] });
            });
            $scope.bar_cata_ds = [];

            $.each(catairgrouped, function (_i, _d) {
                var item = { Category: _d.Category };
                $.each(_d.Items, function (_j, _x) {
                    item[_x.Airport] = _x.Delay;
                });
                $scope.bar_cata_ds.push(item);
            });

            /////////////////////////////////////
            $scope.catColors = [];
            for (var k in response.categoryColors) {
                $scope.catColors.push(response.categoryColors[k]);
            }

            $scope.airColors = [];
            for (var k in response.airportColors) {
                $scope.airColors.push(response.airportColors[k]);
            }
            $.each(response.category, function (_i, _d) {
                _d.AvgFormatted = $scope.formatMinutes(_d.Avg);
                if (_d.Delay > $scope.barMax)
                    $scope.barMax = _d.Delay;

                $scope.selectedCatsDaily[_d.Category] = true;
                _d.chb = ({ onValueChanged: function (e) { $scope.selectedCatsChangedDaily(); }, bindingOptions: { value: 'selectedCatsDaily["' + _d.Category + '"]' } });
                $scope.lineDayCatSeries.push({ valueField: _d.Category, name: _d.Category, color: response.categoryColors[_d.Category] });

                $scope.selectedCatsDaily2[_d.Category] = _i==0;
                $scope.chbDayCats.push({ text: _d.Category, onValueChanged: function (e) { $scope.selectedDailyAptCatsChanged(); }, bindingOptions: { value: 'selectedCatsDaily2["' + _d.Category + '"]' } });



            });
            //dlu
            $.each(response.airport, function (_i, _d) {
                

                $scope.selectedAptsDaily[_d.Airport] = true;
                _d.chb = ({ onValueChanged: function (e) { $scope.selectedAptsChangedDaily(); }, bindingOptions: { value: 'selectedAptsDaily["' + _d.Airport + '"]' } });
                $scope.lineDayAptSeries.push({ valueField: _d.Airport, name: _d.Airport, color: response.airportColors[_d.Airport] });
                //////////////////////////////////////////
                $scope.selectedAptsDaily2[_d.Airport] = true;
                $scope.chbDayApts.push({ text: _d.Airport, onValueChanged: function (e) {  $scope.selectedDailyAptCatsChanged();  }, bindingOptions: { value: 'selectedAptsDaily2["' + _d.Airport + '"]' } });
                //////////////////////////////////////
                //cool
                _d.cats = Enumerable.From(response.airportCategoryGrouped).Where('$.Airport =="' + _d.Airport + '"').ToArray();
                _d.pie = {
                    type: "doughnut",
                    palette: 'Harmony Light',
                    title: { verticalAlignment: 'bottom', horizontalAlignment: 'center', text: _d.Airport, font: { size: 14, weight: 900 } },
                    legend: { visible: false, },

                    series: [{
                        argumentField: "Category",
                        valueField: "Delay",
                        label: {
                            visible: true,
                            font: {
                                size: 11,
                                color: 'black',
                            },
                            //format: "percent",
                            connector: {
                                visible: true
                            },
                            customizeText: function (arg) {

                                return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                            }
                        }
                    }],
                    sizeGroup: 'piecat2',
                    size: {
                        height: 290,
                    },
                    bindingOptions: {
                        //  dataSource: 'pie_cat_ds',
                        //palette: 'catColors2',
                        //   diameter:'diameter',
                    }
                };
                _d.pie.dataSource =  _d.cats;
                //////////////////////////////////


            });


            for (var apt in $scope.selectedAptsDaily2) {
                var _cnt = 0;
                for (var cat in $scope.selectedCatsDaily2) {
                    console.log(apt + '-' + cat);
                    $scope.lineDayAptCatSeriesTemp.push({ valueField: apt + '-' + cat, name: apt + '-' + cat,  });
                    _cnt++;
                }
               
            }
            $scope.selectedDailyAptCatsChangedEnabled = true;
            $scope.selectedDailyAptCatsChanged();
            $scope.IsDetailVisible = true;
            $scope.selectedTabDetailIndex = 0;
           
            $scope.resize();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        ////////////////////

    };
    ///////////////////////////
    $scope.getVisibleCats = function () {
        var result = [];
        for (var key in $scope.selectedCats)
        {
            if ($scope.selectedCats[key])
                result.push(key);
        }
        return result;
    };
    $scope.getVisibleApts = function () {
        var result = [];
        for (var key in $scope.selectedApts) {
            if ($scope.selectedApts[key])
                result.push(key);
        }
        return result;
    };
    $scope.selectedCatsChanged = function () {
        //$scope.lineYearAptCatSeries
        var visibleApts = $scope.getVisibleApts();
        for (var key in $scope.selectedCats) {
            var visible = $scope.selectedCats[key];
            if (!visible) {
                $scope.lineYearAptCatSeries = Enumerable.From($scope.lineYearAptCatSeries).Where('$.name.indexOf("' + key + '")==-1').ToArray();
            }
            else
            {
                var ss = Enumerable.From($scope.lineYearAptCatSeriesTemp).Where('$.name.indexOf("' + key + '")!=-1').ToArray();
                $.each(ss, function (_i, _d) {
                    if (!Enumerable.From($scope.lineYearAptCatSeries).Where('$.name=="' + _d.name + '"').FirstOrDefault() && visibleApts.indexOf(_d.name.split('-')[0]) != -1)
                        $scope.lineYearAptCatSeries.push(JSON.parse(JSON.stringify(_d)));
                });
            }
        }
    };
    $scope.selectedAptsChanged = function () {
       // alert('x');
        
        //$.each($scope.selectedApts, function (_i, _d) {
        //    getSeriesByName(seriesName);
        //});
        var visibleCats = $scope.getVisibleCats();
        for (var key in $scope.selectedApts) {
            //console.log(' name=' + key + ' value=' + obj[key]);
            var visible = $scope.selectedApts[key];
            //var series = $scope.line_yearapt_instanse.getSeriesByName(key);
            if (visible)
            {
                $scope.line_yearapt_instanse.getSeriesByName(key).show();
                $scope.bar_yearapt_instanse.getSeriesByName(key).show();
                $scope.line_yearweekapt_instanse.getSeriesByName(key).show();
                $scope.bar_yearweekapt_instanse.getSeriesByName(key).show();

                var ss = Enumerable.From($scope.lineYearAptCatSeriesTemp).Where('$.name.indexOf("' + key + '")!=-1').ToArray();
                $.each(ss, function (_i, _d) {
                    if (!Enumerable.From($scope.lineYearAptCatSeries).Where('$.name=="' + _d.name + '"').FirstOrDefault() && visibleCats.indexOf(_d.name.split('-')[1])!=-1)
                        $scope.lineYearAptCatSeries.push(JSON.parse(JSON.stringify(_d)));
                });


            }
            else
            {
                $scope.line_yearapt_instanse.getSeriesByName(key).hide();
                $scope.bar_yearapt_instanse.getSeriesByName(key).hide();
                $scope.line_yearweekapt_instanse.getSeriesByName(key).hide();
                $scope.bar_yearweekapt_instanse.getSeriesByName(key).hide();
                $scope.lineYearAptCatSeries = Enumerable.From($scope.lineYearAptCatSeries).Where('$.name.indexOf("' + key + '")==-1').ToArray();
            }
            // do some more stuff with obj[key]
        }
    };
    $scope.selectedCatsChanged2 = function () {
        
        for (var key in $scope.selectedCats2) {
           
            var visible = $scope.selectedCats2[key];
            
            if (visible) {
                $scope.line_yearcat_instance.getSeriesByName(key).show();
                $scope.bar_yearcat_instance.getSeriesByName(key).show();
                $scope.line_yearweekcat_instance.getSeriesByName(key).show();
                $scope.bar_yearweekcat_instance.getSeriesByName(key).show();
 

            }
            else {
                $scope.line_yearcat_instance.getSeriesByName(key).hide();
                $scope.bar_yearcat_instance.getSeriesByName(key).hide();
                $scope.line_yearweekcat_instance.getSeriesByName(key).hide();
                $scope.bar_yearweekcat_instance.getSeriesByName(key).hide();
                 
            }
            // do some more stuff with obj[key]
        }
    };

    $scope.selectedCatsChangedDaily = function () {
         
        for (var key in $scope.selectedCatsDaily) {

            var visible = $scope.selectedCatsDaily[key];

            if (visible) {
                $scope.line_daycat_instance.getSeriesByName(key).show();
                $scope.bar_daycat_instance.getSeriesByName(key).show();
                


            }
            else {
                $scope.line_daycat_instance.getSeriesByName(key).hide();
                $scope.bar_daycat_instance.getSeriesByName(key).hide();
               

            }
            // do some more stuff with obj[key]
        }
    };

    $scope.selectedAptsChangedDaily = function () {

        for (var key in $scope.selectedAptsDaily) {

            var visible = $scope.selectedAptsDaily[key];

            if (visible) {
                
                $scope.line_dayapt_instanse.getSeriesByName(key).show();
                $scope.bar_dayapt_instanse.getSeriesByName(key).show();



            }
            else {
                $scope.line_dayapt_instanse.getSeriesByName(key).hide();
                $scope.bar_dayapt_instanse.getSeriesByName(key).hide();


            }
            // do some more stuff with obj[key]
        }
    };


    $scope.selectedCats2 = {};
    $scope.selectedCatsDaily = {};
    $scope.selectedAptsDaily = {};
    $scope.selectedAptsDaily2 = {};
    $scope.chbCats2 = [];

    $scope.selectedApts = {};
    $scope.selectedCats = {};
    $scope.chbCats = [];
    $scope.chbApts = [
        //{
        //    text: 'KIH',
        //    onValueChanged:function(e){
        //        $scope.selectedAptsChanged();
        //    },
        //    bindingOptions: {
        //        value: 'selectedApts["KIH"]',
               
        //    }
        //},
        // {
        //     text: 'THR',
        //     onValueChanged: function (e) {
        //         $scope.selectedAptsChanged();
        //     },
        //     bindingOptions: {
        //         value: 'selectedApts["THR"]',

        //     }
        // }
    ];
    //////////////////////////
    $scope.catDs = null;
    $scope.monthDs = null;
    $scope.lineYearSeries = [];
    $scope.lineYearDLSeries = [];
    $scope.lineYearWeekSeries = [];
    $scope.lineYearWeekDLSeries = [];
    $scope.lineYearCatSeries = [];
    $scope.lineYearCatMonthSeries = [];
    $scope.pieYearCatSeries = [];
    $scope.lineYearCatDs = [];
    $scope.lineYearWeekCatDs = [];
    $scope.lineYearAptSeries = [];
    $scope.lineYearAptCatSeries = [];
    $scope.lineYearAptCatSeriesTemp = [];
    $scope.lineYearDs = [{ Month: 'M01' }, { Month: 'M02' }, { Month: 'M03' }, { Month: 'M04' }, { Month: 'M05' },
    { Month: 'M06' }, { Month: 'M07' }, { Month: 'M08' }, { Month: 'M09' }, { Month: 'M10' }, { Month: 'M11' }, { Month: 'M12' }, ];
    $scope.lineYearWeekDs = [];
    //$scope.lineYearDLDs = [{ Month: 'M01' }, { Month: 'M02' }, { Month: 'M03' }, { Month: 'M04' }, { Month: 'M05' },
    //{ Month: 'M06' }, { Month: 'M07' }, { Month: 'M08' }, { Month: 'M09' }, { Month: 'M10' }, { Month: 'M11' }, { Month: 'M12' }, ];
    $scope.dataYear = null;
    $scope.categories2 = [];
    $scope.categoriesWeek2 = [];
    $scope.bindYearly = function () {
        $scope.loadingVisible = true;
        
        statService.getDelayStatYearly(Config.CustomerId).then(function (response) {
            $scope.catColors2 = [];
            for (var k in response.categoryColors) {
                $scope.catColors2.push(response.categoryColors[k]);
            }
            $scope.loadingVisible = false;
            $.each(response.categoriesSum, function (_i, _d) {
                $scope.selectedCats2[_d.category] = true;
                _d.chb = ({ onValueChanged: function (e) { $scope.selectedCatsChanged2(); }, bindingOptions: { value: 'selectedCats2["' + _d.category + '"]' } });
               
            });
            //momo
            $.each(response.airportsSum, function (_i, _d) {
                $scope.selectedApts[_d.airport] = true;
                 
                _d.chb = ({ onValueChanged: function (e) { $scope.selectedAptsChanged(); }, bindingOptions: { value: 'selectedApts["' + _d.airport + '"]' } });
                //$scope.chbApts.push({ text: _c, onValueChanged: function (e) { $scope.selectedAptsChanged(); }, bindingOptions: { value: 'selectedApts["'+_c+'"]' } });
                _d.cats = Enumerable.From(response.airportsCategoriesSum).Where('$.airport =="' + _d.airport + '"').ToArray();
                console.log('_d.cats');
                console.log(_d.cats);
                //_d.pie = JSON.parse(JSON.stringify($scope.pie_cat2));
                _d.pie={
                    type: "doughnut",
                    palette:'Harmony Light',
                    title: { verticalAlignment: 'bottom', horizontalAlignment: 'center', text: _d.airport, font: { size: 14, weight:900 } },
                    legend: {visible: false,},
                    
                    series: [{
                        argumentField: "category",
                        valueField: "sum",
                        label: {
                            visible: true,
                            
                            font: {
                                size: 11,
                                color: 'black',
                            },
                            //format: "percent",
                            connector: {
                                visible: true
                            },
                            customizeText: function (arg) {
                     
                                return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                            }
                        }
                    }],
                    sizeGroup:'piecat2',
                    size: {
                        height: 300,
                        width:'100%',
                    },
                    //diameter:0.2,
                    bindingOptions: {
                        //  dataSource: 'pie_cat_ds',
                        //palette: 'catColors2',
                        //   diameter:'diameter',
                    }
                };
                _d.pie.dataSource = _d.cats;
                //_d.pie.series[0].label.customizeText = function (arg) {

                //    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                //};
            });

            $scope.dataYear = response;
            $scope.dg_year_ds = response.delays;
            $scope.monthDs = Enumerable.From(response.delays).Distinct("[$.PassedYear, $.MonthOfYear].join(',')").OrderBy('$.PassedYear').ThenBy('$.MonthOfYear')
                .Select("{Year:$.PassedYear,Month:$.MonthOfYear,MonthStr:$.MonthStr,Title:$.Title,MonthFrom:$.MonthFrom,MonthTo:$.MonthTo}")
                .ToArray();
            $scope.dg_yearweek_ds = response.delaysWeek;
            $.each(response.grouped, function (_i, _d) {
                var ycmin = Enumerable.From(_d).Select('$.MonthOfYear').Min();
                var ycmax = Enumerable.From(_d).Select('$.MonthOfYear').Max();
                var str = 'Year' + (_i + 1).toString();
                $scope.lineYearSeries.push({ valueField: str, name: 'Year ' + (_i + 1).toString() });
                $scope.lineYearSeries.push({ valueField: 'TRND', name: 'Trend ' + (_i + 1).toString(), width: 3, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false } });
                $scope.lineYearDLSeries.push({ valueField: str + 'DL', name: 'Year ' + (_i + 1).toString() + ' Delay/Leg', pane: 'topPane', width: 4 });
                 $scope.lineYearDLSeries.push({ valueField: 'TRNDDL', name: 'Trend ' + (_i + 1).toString() + ' Delay/Leg', pane: 'topPane', width: 2, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false } });
                $scope.lineYearDLSeries.push({ valueField: str + 'DR', name: 'Year ' + (_i + 1).toString() + ' Delay Ratio', pane: 'middlePane' });
                $scope.lineYearDLSeries.push({ valueField: 'Legs', name: 'Year ' + (_i + 1).toString() + ' Legs', pane: 'bottomPane' });
                var i;
                for (i = ycmin - 1; i < ycmax; i++) {
                    var m = Enumerable.From(_d).Where('$.MonthOfYear==' + (i + 1)).FirstOrDefault();
                    if (!m)
                        m = { Delay: null, Count: null, DelayLeg: null, DelayRatio: null, BlockTime: null, TotalFlights: null };
                    $scope.lineYearDs[i][str] = m.Delay;
                    $scope.lineYearDs[i]['Count'] = m.Count;
                    $scope.lineYearDs[i][str + 'DL'] = m.DelayLeg;
                    $scope.lineYearDs[i][str + 'DR'] = m.DelayRatio;
                    $scope.lineYearDs[i]['BL'] = m.BlockTime ? $scope.formatMinutes(m.BlockTime) : '';
                    $scope.lineYearDs[i]['Legs'] = m.TotalFlights;
                    var trnd = Enumerable.From(response.delaysTrend).Where('$.X==' + (i+1).toString()).FirstOrDefault();
                    $scope.lineYearDs[i]['TRND'] = trnd ? trnd.Y : null;
                     var trnddl = Enumerable.From(response.delayLegTrend).Where('$.X==' + (i + 1).toString()).FirstOrDefault();
                     $scope.lineYearDs[i]['TRNDDL'] = trnddl ? trnddl.Y : null;
                }
            });
            $.each(response.groupedWeek, function (_i, _d) {
                var str = 'Year' + (_i + 1).toString();
                $scope.lineYearWeekSeries.push({ valueField: str, name: 'Year ' + (_i + 1).toString() });
                $scope.lineYearWeekSeries.push({ valueField: 'TRND', name: 'Trend ' + (_i + 1).toString(), width: 3, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false } });
                $scope.lineYearWeekDLSeries.push({ valueField: str + 'DL', name: 'Delay/Leg', pane: 'topPane' });
                $scope.lineYearWeekDLSeries.push({ valueField: 'TRNDDL', name: 'Trend ' + (_i + 1).toString() + ' Delay/Leg', pane: 'topPane', width: 2, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false } });
                $scope.lineYearWeekDLSeries.push({ valueField: str + 'DR', name: 'Delay Ratio', pane: 'middlePane' });
                $scope.lineYearWeekDLSeries.push({ valueField: 'Legs', name: 'Year ' + (_i + 1).toString() + ' Legs', pane: 'bottomPane' });
                var ycmin = Enumerable.From(_d).Select('$.MonthOfYear').Min();
                var ycmax = Enumerable.From(_d).Select('$.MonthOfYear').Max();
                var _c = 0;
                for (var _m = ycmin; _m <= ycmax; _m++) {
                    for (var w = 1; w <= 4; w++) {
                        var _row = { Week: 'M' + (_m).toString() + 'W' + w.toString() };
                        var item = Enumerable.From(_d).Where('$.MonthOfYear==' + _m + ' && $.WeekOfMonth==' + w).FirstOrDefault();
                        if (!item) {
                            item = { Delay: 0, Count: 0, DelayLeg: 0, DelayRatio: 0, BlockTime: 0, TotalFlights: 0 };
                        }
                        _row[str] = item.Delay;
                        _row[str + 'Count'] = item.Count;
                        _row[str + 'DL'] = item.DelayLeg;
                        _row[str + 'DR'] = item.DelayRatio;
                        _row[str + 'BL'] = item.BlockTime ? $scope.formatMinutes(item.BlockTime) : '';
                        _row['Legs'] = item.TotalFlights;
                        var trnd = Enumerable.From(response.delaysWeekTrend).Where('$.X=='+_c).FirstOrDefault();
                        _row['TRND'] = trnd ? trnd.Y : null;
                        var trnddl = Enumerable.From(response.delayLegWeekTrend).Where('$.X==' + _c).FirstOrDefault();
                        _row['TRNDDL'] = trnddl ? trnddl.Y : null;
                        $scope.lineYearWeekDs.push(_row);
                        _c++;
                    }
                }
            });
           

            //// Year - Category
            var yeards = Enumerable.From(response.categories).Where('$.PassedYear==1').ToArray();
            var aptds = Enumerable.From(response.airports).Where('$.PassedYear==1').ToArray();
            var yearweekds = Enumerable.From(response.categoriesWeek).Where('$.PassedYear==1').ToArray();
            var aptweekds = Enumerable.From(response.airportsWeek).Where('$.PassedYear==1').ToArray();
            var aptcatweekds = Enumerable.From(response.airportsCategoriesWeek).Where('$.PassedYear==1').ToArray();
            console.log(aptcatweekds);
            //soolc
            var aptcatds = Enumerable.From(response.airportsCategories).Where('$.PassedYear==1').ToArray();
          //  var aptcatweekds = Enumerable.From(response.airportsCategoriesWeek).Where('$.PassedYear==1').ToArray();
            var ycmin = Enumerable.From(yeards).Select('$.MonthOfYear').Min();
            var ycmax = Enumerable.From(yeards).Select('$.MonthOfYear').Max();
            var yccats = Enumerable.From(yeards).Select('$.Category').Distinct().OrderBy('$').ToArray();
            $scope.catDs = yccats;
            $scope.selectedCat = $scope.catDs[0];
            var ycapts = Enumerable.From(aptds).Select('$.Airport').Distinct().OrderBy('$').ToArray();
          //  $scope.selectedCats = {};
            $.each(yccats, function (_i, _c) {
               // $scope.selectedCats2[_c] = true;
                $scope.chbCats2.push({ text: _c, onValueChanged: function (e) { $scope.selectedCatsChanged2(); }, bindingOptions: { value: 'selectedCats2["' + _c + '"]' } });

               $scope.selectedCats[_c] = false;
               $scope.chbCats.push({ text: _c, onValueChanged: function (e) { $scope.selectedCatsChanged(); }, bindingOptions: { value: 'selectedCats["' + _c + '"]' } });
               if (_i == 0)
                   $scope.selectedCats[_c] = true;
                $scope.lineYearCatSeries.push({ valueField: _c, name: _c, color: response.categoryColors[_c] });
                $scope.pieYearCatSeries.push({ argumentField: _c, valueField: 'Month', name: _c, color: response.categoryColors[_c] });
                ///////////////////////////////////////
                for (var i = ycmin; i <= ycmax; i++) {
                    //kari
                    var c = Enumerable.From(response.categories).Where('$.MonthOfYear==' + i+' && $.Category=="'+_c+'"').FirstOrDefault();
                    if (!c)
                        $scope.categories2.push({ Title: 'M' + i, Delay: 0, Count: 0 ,Category:_c})
                    else
                        $scope.categories2.push({ Title: 'M' + i, Delay: c.Delay, Count: c.Count, Category: _c });
                    for (var j = 1; j <= 4; j++) {
                        var w = Enumerable.From(response.categoriesWeek).Where('$.MonthOfYear==' + i + ' && $.WeekOfMonth==' + j + ' && $.Category=="' + _c + '"').FirstOrDefault();
                        if (!w)
                            $scope.categoriesWeek2.push({ Title: 'M' + i + 'W' + j, Delay: 0, Count: 0, Category: _c,Month:i })
                        else
                            $scope.categoriesWeek2.push({ Title: 'M' + i + 'W' + j, Delay: w.Delay, Count: w.Count, Category: _c, Month: i });
                    }
                }
                /////////////////////////////////////////////
            });
           // $scope.selectedApts = {};
            $.each(ycapts, function (_i, _c) {
                // $scope.selectedApts[_c] = true;
                $scope.chbApts.push({ text: _c, onValueChanged: function (e) { $scope.selectedAptsChanged(); }, bindingOptions: { value: 'selectedApts["'+_c+'"]' } });

                $scope.lineYearAptSeries.push({ valueField: _c, name: _c, color: response.airportColors[_c], });
                $.each(yccats, function (_j, _cat) {
                    $scope.lineYearAptCatSeriesTemp.push({ valueField: _c + '-' + _cat, name: _c + '-' + _cat, });
                    if (_j==0)
                        $scope.lineYearAptCatSeries.push({ valueField: _c + '-' + _cat, name: _c + '-' + _cat, });
                });
            });

            
            
            for (var i = ycmin; i <= ycmax; i++) {
                //$scope.pieYearCatSeries.push()
                $scope.lineYearCatMonthSeries.push({ valueField: 'M'+i, name: 'M'+i, });
                var _row = { Month: 'M' + pad(i).toString() };

                $.each(yccats, function (_i, _cat) {
                    var item = Enumerable.From(yeards).Where('$.MonthOfYear==' + i + ' && $.Category=="' + _cat + '"').FirstOrDefault();
                    if (!item)
                    { _row[_cat] = 0; _row[_cat + 'Count'] = 0; }
                    else
                    { _row[_cat] = item.Delay; _row[_cat + 'Count'] = item.Count; }





                });
                $.each(ycapts, function (_i, _cat) {
                    var item = Enumerable.From(aptds).Where('$.MonthOfYear==' + i + ' && $.Airport=="' + _cat + '"').FirstOrDefault();
                    if (!item)
                    { _row[_cat] = 0; _row[_cat + 'Count'] = 0; }
                    else
                    { _row[_cat] = item.Delay; _row[_cat + 'Count'] = item.Count; }

                    $.each(yccats, function (_j, _ca ) {
                        var item2 = Enumerable.From(aptcatds).Where('$.MonthOfYear==' + i + ' && $.Category=="' + _ca + '" && $.Airport=="'+_cat+'"').FirstOrDefault();
                        if (!item2)
                        { _row[_cat+'-'+_ca] = 0; _row[_cat+'-'+_ca + 'Count'] = 0; }
                        else
                        { _row[_cat + '-' + _ca] = item2.Delay; _row[_cat + '-' + _ca + 'Count'] = item2.Count; }
                    });



                });
                $scope.lineYearCatDs.push(_row);
                for (var w = 1; w <= 4; w++) {
                    var _rowweek = { Month: 'M' + (i).toString() + 'W' + w.toString() };
                    $.each(yccats, function (_i, _cat) {
                        var item = Enumerable.From(yearweekds).Where('$.MonthOfYear==' + i + ' && $.WeekOfMonth=='+w + ' && $.Category=="' + _cat + '"').FirstOrDefault();
                        if (!item)
                        { _rowweek[_cat] = 0; _rowweek[_cat + 'Count'] = 0; }
                        else
                        { _rowweek[_cat] = item.Delay; _rowweek[_cat + 'Count'] = item.Count; }

                    });
                    $.each(ycapts, function (_i, _cat) {
                        var item = Enumerable.From(aptweekds).Where('$.MonthOfYear==' + i + ' && $.WeekOfMonth==' + w + ' && $.Airport=="' + _cat + '"').FirstOrDefault();
                        if (!item)
                        { _rowweek[_cat] = 0; _rowweek[_cat + 'Count'] = 0; }
                        else
                        { _rowweek[_cat] = item.Delay; _rowweek[_cat + 'Count'] = item.Count; }
                        $.each(yccats, function (_j, _ca) {
                            var item2 = Enumerable.From(aptcatweekds).Where('$.MonthOfYear==' + i + ' && $.Category=="' + _ca + '" && $.Airport=="' + _cat + '" && $.WeekOfMonth=='+w).FirstOrDefault();
                            if (!item2)
                            { _rowweek[_cat + '-' + _ca] = 0; _rowweek[_cat + '-' + _ca + 'Count'] = 0; }
                            else
                            { _rowweek[_cat + '-' + _ca] = item2.Delay; _rowweek[_cat + '-' + _ca + 'Count'] = item2.Count; }
                        });

                    });
                    $scope.lineYearWeekCatDs.push(_rowweek);
                }
                 


            }
            
            ///////////////////////
            console.log($scope.lineYearCatDs);
            $scope.isMainVisible = true;
        });
        
    };

    $scope.btn_search = {
        //text: 'Search',
        type: 'success',
        icon: 'search',
        width: 35,
        validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_dla_ds = null;
            $scope.doRefresh = true;
            $scope.binddla();
        }

    };
    $scope.btn_date = {
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
    
    $scope.btn_info = {
        //text: 'Search',
        type: 'default',
        icon: 'fas fa-exclamation',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dt_from = new Date($scope.dt_from1);
            $scope.dt_to = new Date($scope.dt_to1);
            $scope.popup_detail_visible = true;
        }

    };
    ///////////////////////
    $scope.dp_year1 = {

    };
    $scope.dp_year2 = {

    };

    /////////////////////////
    $scope.selected_employee_id = null;

    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
        }

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
    ///////////////////////////////////
    $scope.dt_from = new Date().addDays(-30);
    $scope.dt_to = new Date();
    $scope.date_from = {
        adaptivityEnabled: true,
        type: "date",
        placeholder: 'From',
        width: 125,
        useMaskBehavior: true,
        // displayFormat: "mm/dd/yy",
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        adaptivityEnabled: true,
        type: "date",
        placeholder: 'To',
        width: 125,
        useMaskBehavior: true,
        // displayFormat: "mm/dd/yy",
        bindingOptions: {
            value: 'dt_to',

        }
    };

    ////////////////////////////////////
    $scope.dt_from1 = new Date().addDays(-30);
    $scope.dt_to1 = new Date();
    $scope.date_from1 = {
        adaptivityEnabled: true,
        type: "date",
        placeholder: 'From',
        width: 125,
        useMaskBehavior: true,
        // displayFormat: "mm/dd/yy",
        bindingOptions: {
            value: 'dt_from1',

        }
    };
    $scope.date_to1 = {
        adaptivityEnabled: true,
        type: "date",
        placeholder: 'To',
        width: 125,
        useMaskBehavior: true,
        // displayFormat: "mm/dd/yy",
        bindingOptions: {
            value: 'dt_to1',

        }
    };
    ////////////////////////////////////
   // DevExpress.localization.locale('fa-IR');
    $scope.doRefresh = true;
    $scope.dg_dla_columns = [


                 {
                     cellTemplate: function (container, options) {
                         $("<div style='text-align:center'/>")
                             .html(options.rowIndex + 1)
                             .appendTo(container);
                     }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                 },

       { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
       { dataField: 'PDate', caption: 'P. Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, fixed: true, fixedPosition: 'left' },
       { dataField: 'PMonthName', caption: 'P. Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, fixed: true, fixedPosition: 'left' },
       
       { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },

      { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       { dataField: 'STDLocal', caption: 'Sch. Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        { dataField: 'STALocal', caption: 'Sch. Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
         { dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
         { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, sortIndex: 1, sortOrder: 'asc' },


          
             //   { dataField: 'TotalPax', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

       { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'right' },
       { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
         { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width:70, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
      { dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
      { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 500, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
       { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
 

    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_dla_selected = null;
    $scope.dg_dla_instance = null;
    $scope.dg_dla_ds = null;
    $scope.dg_dla = {
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
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 170,

        columns: $scope.dg_dla_columns,
        onContentReady: function (e) {
            if (!$scope.dg_dla_instance)
                $scope.dg_dla_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_dla_selected = null;
            }
            else
                $scope.dg_dla_selected = data;


        },
        summary: {
            totalItems: [
                   {
                      column: "row",
                      summaryType: "count",
                      customizeText: function (data) {
                          return   Number(data.value).toFixed(0);
                      }
                  },
                 {
                     name: "DelayTotal",
                     showInColumn: "Delay2",
                     displayFormat: "{0}",

                     summaryType: "custom"
                 },
                //{
                //    name: "FlightTimeTotal",
                //    showInColumn: "FlightTime2",
                //    displayFormat: "{0}",

                //    summaryType: "custom"
                //},
                //{
                //    name: "FlightTimeAvg",
                //    showInColumn: "FlightTime2",
                //    displayFormat: "Avg: {0}",

                //    summaryType: "custom"
                //},
                 //{
                 //    name: "ActualFlightTimeTotal",
                 //    showInColumn: "FlightTimeActual2",
                 //    displayFormat: "{0}",

                 //    summaryType: "custom"
                 //},
                // {
                //     name: "ActualFlightTimeAvg",
                //     showInColumn: "FlightTimeActual2",
                //     displayFormat: "Avg: {0}",

                //     summaryType: "custom"
                // },
                //{
                //    name: "SITATimeTotal",
                //    showInColumn: "SITATime2",
                //    displayFormat: "{0}",

                //    summaryType: "custom"
                //},
                //{
                //    name: "SITATimeAvg",
                //    showInColumn: "SITATime2",
                //    displayFormat: "Avg: {0}",

                //    summaryType: "custom"
                //},
                //{
                //    name: "BlockTimeTotal",
                //    showInColumn: "BlockTime2",
                //    displayFormat: "{0}",

                //    summaryType: "custom"
                //},
                //{
                //    name: "BlockTimeAvg",
                //    showInColumn: "BlockTime2",
                //    displayFormat: "Avg: {0}",

                //    summaryType: "custom"
                //},
                // {
                //     column: "PaxAdult",
                //     summaryType: "sum",
                //     customizeText: function (data) {
                //         return data.value;
                //     }
                // },
                //  {
                //      column: "PaxAdult",
                //      summaryType: "avg",
                //      customizeText: function (data) {
                //          return 'Avg: ' + Number(data.value).toFixed(1);
                //      }
                //  },
                //  {
                //      column: "PaxChild",
                //      summaryType: "sum",
                //      customizeText: function (data) {
                //          return data.value;
                //      }
                //  },
                //  {
                //      column: "PaxChild",
                //      summaryType: "avg",
                //      customizeText: function (data) {
                //          return 'Avg: ' + Number(data.value).toFixed(1);
                //      }
                //  },
                //   {
                //       column: "PaxInfant",
                //       summaryType: "sum",
                //       customizeText: function (data) {
                //           return data.value;
                //       }
                //   },
                //    {
                //        column: "PaxInfant",
                //        summaryType: "avg",
                //        customizeText: function (data) {
                //            return 'Avg: ' + Number(data.value).toFixed(1);
                //        }
                //    },
                //   {
                //       column: "TotalPax",
                //       summaryType: "sum",
                //       customizeText: function (data) {
                //           return data.value;
                //       }
                //   },
                //    {
                //        column: "TotalPax",
                //        summaryType: "avg",
                //        customizeText: function (data) {
                //            return 'Avg: ' + Number(data.value).toFixed(1);
                //        }
                //    },
                //    {
                //        column: "CockpitTotal",
                //        summaryType: "avg",
                //        customizeText: function (data) {
                //            return 'Avg: ' + Number(data.value).toFixed(1);
                //        }
                //    },
                //    {
                //        column: "CabinTotal",
                //        summaryType: "avg",
                //        customizeText: function (data) {
                //            return 'Avg: ' + Number(data.value).toFixed(1);
                //        }
                //    },

                //     {
                //         column: "FuelDeparture",
                //         summaryType: "sum",
                //         customizeText: function (data) {
                //             return data.value;
                //         }
                //     },
                //      {
                //          column: "CargoCount",
                //          summaryType: "sum",
                //          customizeText: function (data) {
                //              return data.value;
                //          }
                //      },
                //        {
                //            column: "CargoWeight",
                //            summaryType: "sum",
                //            customizeText: function (data) {
                //                return data.value;
                //            }
                //        },
                //          {
                //              column: "BaggageWeight",
                //              summaryType: "sum",
                //              customizeText: function (data) {
                //                  return data.value;
                //              }
                //          },
                //           {
                //               column: "BaggageCount",
                //               summaryType: "sum",
                //               customizeText: function (data) {
                //                   return data.value;
                //               }
                //           },

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
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
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



            }
        },
        "export": {
            enabled: true,
            fileName: "Delays_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Delays</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },
         
        bindingOptions: {
            dataSource: 'dg_dla_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    $scope.binddla = function () {
        //iruser558387
        var dts = [];
        if ($scope.dt_to1) {
            var _dt = moment($scope.dt_to1).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('dt=' + _dt);
        }
        if ($scope.dt_from1) {
            var _df = moment($scope.dt_from1).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('df=' + _df);
        }

       

        var prms = dts.join('&');


        var url = 'odata/delays2';//2019-06-06T00:00:00';
        if (prms)
            url += '?' + prms;

        if (!$scope.dg_dla_ds) {

            $scope.dg_dla_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "ID",
                    version: 4,
                    onLoaded: function (e) {

                        //dooki
                         $.each(e, function (_i, _d) {

                        //    var std = (new Date(_d.STDDay));
                        //    persianDate.toLocale('en');
                        //    _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                             _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                        //    _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                        //    _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                            _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                            _d.Delay2 = $scope.formatMinutes(_d.Delay);


                         });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                       // $scope.dsUrl = General.getDsUrl(e);


                        //$rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.dg_dla_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    ///////////////////////////////////
   
    $(window).on('resize', function () {
        
        $scope.$apply(function () {
            $scope.resize();
        });

    });
    
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_det1 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height_detd', }
    };
    $scope.scroll_det2 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height_detd', }
    };
    $scope.scroll_det3 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height_detd', }
    };
    ///////////////////////////////////
    $scope.filters = [];
    /////////////////////////////////////////////
    $scope.dg_cat_columns = [
        { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
         { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 90, alignment: 'center', },
         // { dataField: 'AvgFormatted', caption: 'Avg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                 { dataField: 'DelayFormatted', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },


    ];

    $scope.dg_cat_selected = null;
    $scope.dg_cat_instance = null;
    $scope.dg_cat_ds = null;
    $scope.dg_cat_height = 250;
    $scope.dg_cat = {
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_cat_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cat_instance)
                $scope.dg_cat_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_cat_selected = null;
            }
            else
                $scope.dg_cat_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Category") {
                var color = $scope.data.categoryColors[e.data.Category];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    name: "DelayTotal",
                    showInColumn: "DelayFormatted",

                    summaryType: "custom"
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_cat_ds',
            height: 'dg_cat_height',
        }
    };
    //////////////////////////////
    $scope.dg_cat_det_columns = [
          { dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 95, format: 'MM/dd/yyyy', sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'PDate', caption: 'P. Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },
        { dataField: 'FlightNumber', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        // { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
          { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },

                { dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

    ];

    $scope.dg_cat_det_selected = null;
    $scope.dg_cat_det_instance = null;
    $scope.dg_cat_det_ds = null;

    $scope.dg_cat_det = {
        wordWrapEnabled: true,
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

        columnAutoWidth: true,
        //  height: 240,

        columns: $scope.dg_cat_det_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cat_det_instance)
                $scope.dg_cat_det_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_cat_det_selected = null;
            }
            else
                $scope.dg_cat_det_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "ICategory") {
                var color = $scope.data.categoryColors[e.data.ICategory];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [

                {
                    name: "DelayTotal",
                    showInColumn: "Delay",

                    summaryType: "custom"
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_cat_det_ds',
            height: 'dg_cat_height',
        }
    };
    ////////////////////////////////////
    $scope.dg_air_columns = [
       { dataField: 'Airport', caption: 'A/P', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false },

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 70, alignment: 'center', },
        // { dataField: 'AvgFormatted', caption: 'Avg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
                { dataField: 'DelayFormatted', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },


    ];

    $scope.dg_air_selected = null;
    $scope.dg_air_instance = null;
    $scope.dg_air_ds = null;

    $scope.dg_air = {
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_air_columns,
        onContentReady: function (e) {
            if (!$scope.dg_air_instance)
                $scope.dg_air_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_air_selected = null;
            }
            else
                $scope.dg_air_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Airport") {
                var color = $scope.data.airportColors[e.data.Airport];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    name: "DelayTotal",
                    showInColumn: "DelayFormatted",

                    summaryType: "custom"
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_air_ds',
            height: 'dg_cat_height',
        }
    };

    $scope.dg_airc_columns = [
      { dataField: 'Airport', caption: 'A/P', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
         { dataField: 'Category', caption: 'CAT', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
       { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width: 70, alignment: 'center', },
       // { dataField: 'AvgFormatted', caption: 'Avg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
               { dataField: 'DelayFormatted', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },


    ];

    $scope.dg_airc_selected = null;
    $scope.dg_airc_instance = null;
    $scope.dg_airc_ds = null;

    $scope.dg_airc = {
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_airc_columns,
        onContentReady: function (e) {
            if (!$scope.dg_airc_instance)
                $scope.dg_airc_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_airc_selected = null;
            }
            else
                $scope.dg_airc_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Airport") {
                var color = $scope.data.airportColors[e.data.Airport];

                e.cellElement.css("backgroundColor", color);
            }
            if (e.rowType === "data" && e.column.dataField == "Category") {
                var color = $scope.data.categoryColors[e.data.Category];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    name: "DelayTotal",
                    showInColumn: "DelayFormatted",

                    summaryType: "custom"
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_airc_ds',
            height: 'dg_cat_height',
        }
    };


    $scope.dg_air_det_columns = [
         { dataField: 'FromAirportIATA', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 0, sortOrder: 'asc' },
          { dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 95, format: 'MM/dd/yyyy', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'PDate', caption: 'P. Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },
        { dataField: 'FlightNumber', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },
       // { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        // { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
          { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },

                { dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, },
        { dataField: 'DelayRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

    ];

    $scope.dg_air_det_selected = null;
    $scope.dg_air_det_instance = null;
    $scope.dg_air_det_ds = null;

    $scope.dg_air_det = {
        wordWrapEnabled: true,
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

        columnAutoWidth: true,
        //  height: 240,

        columns: $scope.dg_air_det_columns,
        onContentReady: function (e) {
            if (!$scope.dg_air_det_instance)
                $scope.dg_air_det_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_air_det_selected = null;
            }
            else
                $scope.dg_air_det_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "ICategory") {
                var color = $scope.data.categoryColors[e.data.ICategory];

                e.cellElement.css("backgroundColor", color);
            }
            if (e.rowType === "data" && e.column.dataField == "FromAirportIATA") {
                var color = $scope.data.airportColors[e.data.FromAirportIATA];

                e.cellElement.css("backgroundColor", color);
            }
        },
        summary: {
            totalItems: [

                {
                    name: "DelayTotal",
                    showInColumn: "Delay",

                    summaryType: "custom"
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_air_det_ds',
            height: 'dg_cat_height',
        }
    };
    /////////////////////////////////
    $scope.showDetail = function (data) {
        var row = (data.data);
        $scope.dt_from = new Date(row.DateFrom);
        $scope.dt_to = new Date(row.DateTo);
        $scope.popup_detail_visible = true;
    };

    ////////////////////////////////////
    //3-7
    $scope.dg_year_columns = [
     //  { dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
      // { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
      { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc',width:100 },
       { dataField: 'MonthFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority:2 },
       { dataField: 'MonthTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
        { dataField: 'MonthFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, hidingPriority: 0,visible:false, },
          { dataField: 'MonthToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, hidingPriority: 1,visible:false },

          {
              dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 4
          },
           {
               dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                   return $scope.formatMinutes(e.value);
               }, hidingPriority: 5
           },
            { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', },

        {
            dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                return $scope.formatMinutes(e.value);
            }
        },
         {
             dataField: 'DelayLeg', caption: 'D/L Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return $scope.formatMinutes(e.value);
             }, hidingPriority: 7
         },
         {
             dataField: 'DelayRatio', caption: 'D/L Ratio', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return  Math.floor(e.value)+'%';
             }, hidingPriority: 8
         },
          {
              dataField: "Title", caption: '',
              width: 55,
              allowFiltering: false,
              allowSorting: false,
              cellTemplate: 'detailTemplate',
              

          },


    ];

    $scope.dg_year_selected = null;
    $scope.dg_year_instance = null;
    $scope.dg_year_ds = null;
    $scope.dg_year_height = 350;
    $scope.dg_year = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_year_columns,
        onContentReady: function (e) {
            if (!$scope.dg_year_instance)
                $scope.dg_year_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_year_selected = null;
            }
            else
                $scope.dg_year_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Category") {
                var color = $scope.data.categoryColors[e.data.Category];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    column: "Delay",
                     summaryType: "sum",
                    customizeText: function (data) {
                        return  $scope.formatMinutes(data.value);
                    } 
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_year_ds',
            height: 'dg_year_height',
        }
    };
    /////////////////////////////////////
    $scope.dg_yearcat_columns = [
         
      // { dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc',width:120 },
      // { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc',width:100 },
      { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc',width:120 },
      {  dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'MonthFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2},
       { dataField: 'MonthTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3},
        { dataField: 'MonthFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
          { dataField: 'MonthToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1 },
          
          {
              dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 4
          },
           {
               dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                   return $scope.formatMinutes(e.value);
               }, hidingPriority: 5
           },
            { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 7 },

        {
            dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                return $scope.formatMinutes(e.value);
            }
        },
         //{
         //    dataField: 'DelayLeg', caption: 'D/L Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
         //        return $scope.formatMinutes(e.value);
         //    }
         //},
         //{
         //    dataField: 'DelayRatio', caption: 'D/L Ratio', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
         //        return Math.floor(e.value) + '%';
         //    }
         //},


    ];

    $scope.dg_yearcat_selected = null;
    $scope.dg_yearcat_instance = null;
    $scope.dg_yearcat_ds = null;
    $scope.dg_yearcat_height = 350;
    $scope.dg_yearcat = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearcat_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearcat_instance)
                $scope.dg_yearcat_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearcat_selected = null;
            }
            else
                $scope.dg_yearcat_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    column: "Delay",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return $scope.formatMinutes(data.value);
                    }
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.categories',
            height: 'dg_yearcat_height',
        }
    };
    ////////////////////////////////
    $scope.dg_yearapt_columns = [

     // { dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
      //{ dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', width: 100 },
     { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 100 },
        {dataField: 'Airport', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
      { dataField: 'MonthFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
      { dataField: 'MonthTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
       { dataField: 'MonthFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
         { dataField: 'MonthToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1 },

         {
             dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return $scope.formatMinutes(e.value);
             }, hidingPriority: 4
         },
          {
              dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 5
          },
           { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

       { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 7 },

       {
           dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
               return $scope.formatMinutes(e.value);
           }
       },
        


    ];

    $scope.dg_yearapt_selected = null;
    $scope.dg_yearapt_instance = null;
    $scope.dg_yearapt_ds = null;
    $scope.dg_yearapt_height = 350;
    $scope.dg_yearapt = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearapt_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearapt_instance)
                $scope.dg_yearapt_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearapt_selected = null;
            }
            else
                $scope.dg_yearapt_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    column: "Delay",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return $scope.formatMinutes(data.value);
                    }
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.airports',
            height: 'dg_yearapt_height',
        }
    };
    ////////////////////////////////////
    $scope.dg_yearaptcat_columns = [

      //{ dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
      //{ dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', width: 100 },
      { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 100 },
      { dataField: 'Airport', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
       { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
      { dataField: 'MonthFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
      { dataField: 'MonthTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
       { dataField: 'MonthFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
         { dataField: 'MonthToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1 },

         {
             dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return $scope.formatMinutes(e.value);
             }, hidingPriority: 4
         },
          {
              dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 5
          },
           { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

       { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 7 },

       {
           dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
               return $scope.formatMinutes(e.value);
           }
       },



    ];

    $scope.dg_yearaptcat_selected = null;
    $scope.dg_yearaptcat_instance = null;
    $scope.dg_yearaptcat_ds = null;
    $scope.dg_yearaptcat_height = 350;
    $scope.dg_yearaptcat = {
        columnHidingEnabled: true,

        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearaptcat_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearaptcat_instance)
                $scope.dg_yearaptcat_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearaptcat_selected = null;
            }
            else
                $scope.dg_yearaptcat_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
                {
                    column: "Delay",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return $scope.formatMinutes(data.value);
                    }
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.airportsCategories',
            height: 'dg_yearaptcat_height',
        }
    };
    ////////////////////////////////////
    $scope.dg_yearweek_columns = [
       
       //{ dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
    // { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc',width:100 },
      // { dataField: 'WeekStr', caption: '7-Day', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'WeekFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
       { dataField: 'WeekTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
        { dataField: 'WeekFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
          { dataField: 'WeekToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1},

          {
              dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              } ,hidingPriority: 4
          },
           {
               dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                   return $scope.formatMinutes(e.value);
               }, hidingPriority:5
           },
            { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 7 },

        {
            dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                return $scope.formatMinutes(e.value);
            }
        },
         {
             dataField: 'DelayLeg', caption: 'D/L Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return $scope.formatMinutes(e.value);
             }, hidingPriority: 9
         },
         {
             dataField: 'DelayRatio', caption: 'D/L Ratio', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return Math.floor(e.value) + '%';
             }, hidingPriority: 8
         },

          {
              dataField: "Title", caption: '',
              width: 65,
              allowFiltering: false,
              allowSorting: false,
              cellTemplate: 'detailTemplate',


          },
    ];

    $scope.dg_yearweek_selected = null;
    $scope.dg_yearweek_instance = null;
    $scope.dg_yearweek_ds = null;
    $scope.dg_yearweek_height = 350;
    $scope.dg_yearweek = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearweek_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearweek_instance)
                $scope.dg_yearweek_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearweek_selected = null;
            }
            else
                $scope.dg_yearweek_selected = data;


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Category") {
                var color = $scope.data.categoryColors[e.data.Category];

                e.cellElement.css("backgroundColor", color);
            }

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
               {
                   column: "Delay",
                   summaryType: "sum",
                   customizeText: function (data) {
                       return $scope.formatMinutes(data.value);
                   }
               },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dg_yearweek_ds',
            height: 'dg_yearweek_height',
        }
    };
    ////////////////////////////////////////
    $scope.dg_yearweekcat_columns = [
      // { dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
      // { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', width: 100 },
       { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
       //{ dataField: 'WeekStr', caption: '7-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc', width: 100 },
       { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 3, sortOrder: 'asc' },
       { dataField: 'WeekFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
       { dataField: 'WeekTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3},
        { dataField: 'WeekFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
          { dataField: 'WeekToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1 },

          {
              dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 4
          },
           {
               dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                   return $scope.formatMinutes(e.value);
               }, hidingPriority: 5
           },
            { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', },

        {
            dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                return $scope.formatMinutes(e.value);
            }
        },
         


    ];

    $scope.dg_yearweekcat_selected = null;
    $scope.dg_yearweekcat_instance = null;
    $scope.dg_yearweekcat_ds = null;
    $scope.dg_yearweekcat_height = 350;
    $scope.dg_yearweekcat = {
        columnHidingEnabled: true,

        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearweekcat_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearweekcat_instance)
                $scope.dg_yearweekcat_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearweekcat_selected = null;
            }
            else
                $scope.dg_yearweekcat_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
               {
                   column: "Delay",
                   summaryType: "sum",
                   customizeText: function (data) {
                       return $scope.formatMinutes(data.value);
                   }
               },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.categoriesWeek',
            height: 'dg_yearweek_height',
        }
    };
    ////////////////////////////////////////
    $scope.dg_yearweekapt_columns = [
       //{ dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
      // { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', width: 100 },
      // { dataField: 'WeekStr', caption: '7-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc', width: 100 },
      { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 100 },
       { dataField: 'Airport', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
       { dataField: 'WeekFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
       { dataField: 'WeekTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
        { dataField: 'WeekFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
          { dataField: 'WeekToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1},

          {
              dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 4
          },
           {
               dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                   return $scope.formatMinutes(e.value);
               }, hidingPriority: 5
           },
            { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6},

        { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority:7 },

        {
            dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                return $scope.formatMinutes(e.value);
            }
        },



    ];

    $scope.dg_yearweekapt_selected = null;
    $scope.dg_yearweekapt_instance = null;
    $scope.dg_yearweekapt_ds = null;
    $scope.dg_yearweekapt_height = 350;
    $scope.dg_yearweekapt = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearweekapt_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearweekapt_instance)
                $scope.dg_yearweekapt_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearweekapt_selected = null;
            }
            else
                $scope.dg_yearweekapt_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
               {
                   column: "Delay",
                   summaryType: "sum",
                   customizeText: function (data) {
                       return $scope.formatMinutes(data.value);
                   }
               },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.airportsWeek',
            height: 'dg_yearweekapt_height',
        }
    };
    /////////////////////////////////////
    $scope.dg_yearweekaptcat_columns = [
    //  { dataField: 'YearStr', caption: '336-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width: 120 },
    //  { dataField: 'MonthStr', caption: '28-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc', width: 100 },
    //  { dataField: 'WeekStr', caption: '7-Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc', width: 100 },
    { dataField: 'Title', caption: 'Period', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: 'asc', width:100 },
      { dataField: 'Airport', caption: 'Airport', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
       { dataField: 'Category', caption: 'Category', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 2, sortOrder: 'asc' },
      { dataField: 'WeekFrom', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 2 },
      { dataField: 'WeekTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width1: 95, format: 'MM/dd/yyyy', hidingPriority: 3 },
       { dataField: 'WeekFromPersian', caption: 'From(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 0 },
         { dataField: 'WeekToPersian', caption: 'To(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 95, visible: false, hidingPriority: 1 },

         {
             dataField: 'FlightTime', caption: 'F/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                 return $scope.formatMinutes(e.value);
             }, hidingPriority: 4
         },
          {
              dataField: 'BlockTime', caption: 'B/L Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
                  return $scope.formatMinutes(e.value);
              }, hidingPriority: 5
          },
           { dataField: 'TotalFlights', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 6 },

       { dataField: 'Count', caption: 'Count', allowResizing: true, dataType: 'number', allowEditing: false, width1: 90, alignment: 'center', hidingPriority: 7 },

       {
           dataField: 'Delay', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width1: 100, customizeText: function (e) {
               return $scope.formatMinutes(e.value);
           }
       },



    ];

    $scope.dg_yearweekaptcat_selected = null;
    $scope.dg_yearweekaptcat_instance = null;
    $scope.dg_yearweekaptcat_ds = null;
    $scope.dg_yearweekaptcat_height = 450;
    $scope.dg_yearweekaptcat = {
        columnHidingEnabled: true,
        wordWrapEnabled: true,
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
        //  height: 240,

        columns: $scope.dg_yearweekaptcat_columns,
        onContentReady: function (e) {
            if (!$scope.dg_yearweekaptcat_instance)
                $scope.dg_yearweekaptcat_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_yearweekaptcat_selected = null;
            }
            else
                $scope.dg_yearweekaptcat_selected = data;


        },
        onCellPrepared: function (e) {
            //if (e.rowType === "data" && e.column.dataField == "Category") {
            //    var color = $scope.data.categoryColors[e.data.Category];

            //    e.cellElement.css("backgroundColor", color);
            //}

        },
        summary: {
            totalItems: [
                 {
                     column: "Count",
                     summaryType: "sum",
                     customizeText: function (data) {
                         return data.value;
                     }
                 },
               {
                   column: "Delay",
                   summaryType: "sum",
                   customizeText: function (data) {
                       return $scope.formatMinutes(data.value);
                   }
               },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "DelayTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = $scope.formatMinutes(options.totalValueMinutes);



                    }
                }


            }
        },
        bindingOptions: {
            dataSource: 'dataYear.airportsCategoriesWeek',
            height: 'dg_yearweekaptcat_height',
        }
    };

    ///////////////////////////////////
    $scope.diameter = 0.85;
    $scope.catColors = [];
    $scope.pie_cat_ds = [];
    $scope.pie_cat = {
        onInitialized: function (e) {
            if (!$scope.pie_cat_instance)
                $scope.pie_cat_instance = e.component;
        },
        type: "doughnut",
        // palette: "Soft Pastel",
        // diameter:0.85,
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        //"export": {
        //    enabled: true
        //},
        series: [{
            argumentField: "Category",
            valueField: "Delay",
            label: {
                visible: true,
                font: {
                    size: 11,
                    color: 'black',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 300,
        },
        bindingOptions: {
            dataSource: 'pie_cat_ds',
            palette: 'catColors',
            //   diameter:'diameter',
        }
    };

    ///////////////////////////////
    $scope.pie_cat2 = {
        type: "doughnut",
        // palette: "Soft Pastel",
        // diameter:0.85,
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        //"export": {
        //    enabled: true
        //},
        series: [{
            argumentField: "category",
            valueField: "sum",
            label: {
                visible: false,
                font: {
                    size: 11,
                    color: 'black',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                     
                    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 300,
        },
        bindingOptions: {
          //  dataSource: 'pie_cat_ds',
           // palette: 'catColors',
            //   diameter:'diameter',
        }
    };

    //////////////////////////////////

    $scope.pie_air_ds = [];
    $scope.pie_air = {
        type: "doughnut",

        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },

        series: [{
            argumentField: "Airport",
            valueField: "Delay",
            label: {
                visible: true,
                font: {
                    size: 11,
                    color: 'black',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {
                    //console.log(arg);
                    return arg.argumentText.substr(0, 4) + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 300,
        },
        bindingOptions: {
            dataSource: 'pie_air_ds',
            palette: 'airColors',
            //   diameter:'diameter',
        }
    };
    ////////////////////////////////////////////
    $scope.barWidth = 50;
    $scope.bar_cat_ds = [];
    $scope.bar_cat_ins = null;
    $scope.bar_cat = {
        onInitialized: function (e) {
            if (!$scope.bar_cat_instance)
                $scope.bar_cat_instance = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        onInitialized: function (e) {
            if (!$scope.bar_cat_ins)
                $scope.bar_cat_ins = e.component;

        },
        commonSeriesSettings: {

        },
        //scrollBar: {
        //    visible: true,
        //    position: 'bottom',
        //    width: 7,
        //    opacity: 0.5,
        //},
        //scrollingMode: 'all',
        //zoomAndPan: {
        //    argumentAxis: "both"
        //},
        //zoomingMode: 'all',
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        legend: {
            visible: false,
            //position: 'inside',
            backgroundColor: 'transparent',
            margin: 5,
        },
        series: [

        {
            type: "bar",
            argumentField: "Category",
            valueField: "Delay",
            //barWidth:20,
            name: "Delay(mm)",
            label: {
                backgroundColor: 'gray',
                color: '#fff',
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: true,
            }
        },


        ],
        customizePoint: function () {

            var arg = this.argument;
            return { color: $scope.data.categoryColors[arg], hoverStyle: { color: "#bbb" } };

        },
        // seriesTemplate: {
        //     nameField: "Category"
        // },
        size: {
            height: 300,
            width: '100%',

        },
        bindingOptions: {
            dataSource: 'bar_cat_ds',
            palette: 'catColors',
           // 'valueAxis[0].max': 'barMax',
            'commonSeriesSettings.barWidth': 'barWidth',
        }

    };
    $scope.barMax = 0;

    $scope.bar_airc_series = [];
    $scope.bar_cata_series = [];
    $scope.bar_airc = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        commonSeriesSettings: {
            argumentField: "Airport",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            }
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            dataSource: 'bar_airc_ds',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',
            'commonSeriesSettings.barWidth': 'barWidth',
            series: 'bar_airc_series',
        }
    };


    $scope.bar_cata = {
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        commonSeriesSettings: {
            argumentField: "Category",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            }
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        bindingOptions: {
            dataSource: 'bar_cata_ds',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',
            'commonSeriesSettings.barWidth': 'barWidth',
            series: 'bar_cata_series',
        }
    };
    ////DETAILS////////////////////////////
    $scope.line_daily = {
        palette: "Violet",
        onInitialized: function (e) {
            if (!$scope.line_daily_instance)
                $scope.line_daily_instance = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Date",
            width: 4,
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        series: [
            { valueField: 'Delay', name: 'Daily', color: 'red' },
             { valueField: 'TRND', name: 'Trend', width: 2, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false } },
        ],
        bindingOptions: {
            "dataSource": "data.delaysTotal",
           // series: 'lineYearSeries',
        },

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                //format: { type: 'shortDate' }
                //moment().format('L')
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays",
            font: {
                size: 20
            },
             
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName.indexOf('Trend') != -1 ? '' : arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data.Count
                };
            }
        },
        size: {
            height: 550,
            width:'100%',
        },
    };

    $scope.line_dailydl = {
        onInitialized: function (e) {
            if (!$scope.line_dailydl_instance)
                $scope.line_dailydl_instance = e.component;
        },
        palette: "Harmony Light",
        size: {
            height: 550
        },
        commonSeriesSettings: {
            argumentField: "Date"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        series:[
            { valueField: 'DelayLeg', name:   'Delay/Leg', pane: 'topPane', width: 4 },
             { valueField: 'TRNDLeg', name: 'Trend', width: 2, color: '#660000', dashStyle: 'dot', label: { visible: false }, point: { visible: false }, pane: 'topPane' },
            { valueField:   'DelayRatio', name:   'Delay Ratio', pane: 'middlePane' },
            { valueField: 'TotalFlights', name: 'Legs', pane: 'bottomPane' },

        ],
        bindingOptions: {
            "dataSource": "data.delaysTotal",
            //series: 'lineYearDLSeries',
        },
        panes: [
        {
            name: "topPane",
            height: 250,
            border: {
                visible: true,
            }
        },
         {
             name: "middlePane",
             height: 150,
             border: {
                 visible: true,
             }
         },

        {
            name: "bottomPane",
            height: 150,
            border: {
                visible: true,
            }
        }],
        defaultPane: "bottomPane",
        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',
        },
        valueAxis: [{
            pane: "middlePane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay Ratio",
                margin: 12
            },
            label: {
                customizeText: function () {
                    return (this.value) + '%';
                }
            },
           
        }, {
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Legs",
                margin: 12
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }, {
            pane: "topPane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay/Leg"
            },
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        //title: {
        //    text: "Total Delays",
        //    font: {
        //        size: 20
        //    },
        //    subtitle: {
        //        text: "28-Day Period"
        //    }
        //},
        "export": {
            enabled: false
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

               
                return {
                    text: (arg.seriesName.indexOf('Ratio') != -1) ?
                        arg.seriesName + ", " + arg.argument + ": " + Math.floor(arg.value) + '%' + ", Block Time:" + arg.point.data.BL
                        : (arg.seriesName.indexOf('Legs') == -1 ? (arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Legs:" + arg.point.data.Legs) : arg.point.data.Legs)
                }

            }
        },
    };

    //////////////////////////////////
   
    $scope.line_year = {
        palette: "Violet",

        commonSeriesSettings: {
            argumentField: "Month",
            width:5,
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 2,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        bindingOptions: {
            "dataSource": "lineYearDs",
            series: 'lineYearSeries',
            'size.height':'height550',
        },

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible:false,

        },
        title: {
            text: "Total Delays",
            font: {
                size: 20
            },
            subtitle: {
                text: "28-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
              
                return {
                    text:arg.seriesName.indexOf('Trend')!=-1?'':arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data.Count
                };
            }
        },
        //size: {
        //    height: 550
        //},
    };

    $scope.line_yeardl = {
        palette: "Harmony Light",
        size: {
            height: 550
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        bindingOptions: {
            "dataSource": "lineYearDs",
            series: 'lineYearDLSeries',
        },
        panes: [
        {
            name: "topPane",
            height: 250,
            border: {
                visible:true,
            }
        },
         {
             name: "middlePane",
             height: 150,
             border: {
                 visible: true,
             }
         },
        
        {
            name: "bottomPane",
            height: 150,
            border: {
                visible: true,
            }
        }],
        defaultPane: "bottomPane",
        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        valueAxis: [{
            pane: "middlePane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay Ratio",
                margin: 12,
                font:{size:13}
            },
            label: {
                customizeText: function () {
                    return (this.value) + '%';
                }
            },
        }, {
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Legs",
                margin: 12,
                font: { size: 13 }
            },
            label: {
                customizeText: function () {
                    return (this.value) ;
                }
            },
        }, {
            pane: "topPane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay/Leg",
                font: { size: 13 }
            },
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible: false,

        },
        //title: {
        //    text: "Total Delays",
        //    font: {
        //        size: 20
        //    },
        //    subtitle: {
        //        text: "28-Day Period"
        //    }
        //},
        "export": {
            enabled: false
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
               
                //if (arg.seriesName.indexOf('Ratio')== -1) {
                //    return {
                //        text: arg.seriesName + ", " + arg.argument + ": " +  Math.floor(arg.value)+'%' + ", Block Time:" + arg.point.data.BL
                //    };
                //}
                //if (arg.seriesName.indexOf('Ratio') != -1)
                //{

                //    return
                //    {
                //        text:  arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Legs:" + arg.point.data.Legs
                //    };
                //}
                return {
                    text: (arg.seriesName.indexOf('Ratio') != -1) ?
                        arg.seriesName + ", " + arg.argument + ": " + Math.floor(arg.value) + '%' + ", Block Time:" + arg.point.data.BL
                        : (arg.seriesName.indexOf('Legs') == -1 ? (arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Legs:" + arg.point.data.Legs) : arg.point.data.Legs)
                }

            }
        },
    };
    $scope.line_yearcat_instance = null;
    $scope.line_daycat_instance = null;
    $scope.line_yearcatmonth_instance = null;
    $scope.line_yearcatweek_instance = null;
    $scope.bar_yearcat_instance = null;
    $scope.bar_daycat_instance = null;
    $scope.line_yearweekcat_instance = null;
    $scope.bar_yearweekcat_instance = null;

    $scope.line_yearcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearcat_instance)
                $scope.line_yearcat_instance = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Category",
            font: {
                size: 20
            },
            subtitle: {
                text: "28-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
               
                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500
        },
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearCatSeries',
        },
    };
    $scope.line_daycat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_daycat_instance)
                $scope.line_daycat_instance = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Date"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Category",
            font: {
                size: 20
            },
            
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500
        },
        bindingOptions: {
            "dataSource": "data.dailyCatsTbl",
            series: 'lineDayCatSeries',
        },
    };
    $scope.selectedCat = null;
    $scope.catMonthDs = null;
    $scope.catWeekDs = null;
    $scope.sb_cat = {
        onValueChanged:function(e){
            $scope.catMonthDs = Enumerable.From($scope.categories2).Where('$.Category=="' + e.value + '"').ToArray();
            if ($scope.selectedMonth)
                $scope.catWeekDs = Enumerable.From($scope.categoriesWeek2).Where('$.Category=="' + e.value + '"  && $.Month=='+$scope.selectedMonth.Month
                    ).ToArray();
            else
                $scope.catWeekDs = null;

        },
        bindingOptions: {
            dataSource: 'catDs',
            value: 'selectedCat',
        }
    };
    $scope.selectedMonth = null;
    $scope.sb_month = {
        onValueChanged: function (e) {
            //$scope.catMonthDs = Enumerable.From($scope.categories2).Where('$.Category=="' + e.value + '"').ToArray();
            //$scope.catWeekDs = Enumerable.From($scope.categoriesWeek2).Where('$.Category=="' + e.value + '"').ToArray();
             
            if ($scope.selectedCat)
                $scope.catWeekDs = Enumerable.From($scope.categoriesWeek2).Where('$.Category=="' + $scope.selectedCat + '" && $.Month==' + e.value.Month).ToArray();
                else $scope.catWeekDs=null;

        },
        displayExpr: "Title",
        bindingOptions: {
            dataSource: 'monthDs',
            value: 'selectedMonth',
        }
    };

    $scope.pie_catweek = {
        type: "doughnut",
        // palette: "Soft Pastel",
        // diameter:0.85,
        legend: {
            horizontalAlignment: "right",
            verticalAlignment: "top",
            margin: 0,
            visible: false,
        },
        //"export": {
        //    enabled: true
        //},
        series: [{
            argumentField: "Title",
            valueField: "Delay",
            label: {
                visible: true,
                font: {
                    size: 11,
                    color: 'black',
                },
                //format: "percent",
                connector: {
                    visible: true
                },
                customizeText: function (arg) {

                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        size: {
            height: 450,
        },
        bindingOptions: {
            dataSource: 'catWeekDs',
            // palette: 'catColors',
            //   diameter:'diameter',
        }
    };


    $scope.line_yearcatmonth = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearcatmonth_instance)
                $scope.line_yearcatmonth_instance = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Title"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        commonPaneSettings:{
            border: {
                visible:true,
            }
        },

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        //title: {
        //    text: "Total Delays By Category",
        //    font: {
        //        size: 20
        //    },
        //    subtitle: {
        //        text: "28-Day Period"
        //    }
        //},
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value)  
                };
            }
        },
        size: {
            height: 435
        },
        series:[ 
            { valueField: 'Delay', name: 'Delay', }
         ],
        bindingOptions: {
            "dataSource": "catMonthDs",
           // series: 'lineYearCatMonthSeries',
        },
    };
    $scope.line_yearcatweek = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearcatweek_instance)
                $scope.line_yearcatweek_instance = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Title"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        commonPaneSettings: {
            border: {
                visible: true,
            }
        },

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        //title: {
        //    text: "Total Delays By Category",
        //    font: {
        //        size: 20
        //    },
        //    subtitle: {
        //        text: "28-Day Period"
        //    }
        //},
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        size: {
            height: 435
        },
        series: [
            { valueField: 'Delay', name: 'Delay', }
        ],
        bindingOptions: {
            "dataSource": "catWeekDs",
            // series: 'lineYearCatMonthSeries',
        },
    };

    $scope.line_yearapt_instanse = null;
    $scope.line_yearapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized:function(e){
            if (!$scope.line_yearapt_instanse)
                $scope.line_yearapt_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport",
            font: {
                size: 20
            },
            subtitle: {
                text: "28-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                
                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        //size: {
       //     height: 500
        //},
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearAptSeries',
            'size.height':'height550',
        },
    };

    $scope.line_dayapt_instanse = null;
    $scope.line_dayapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_dayapt_instanse)
                $scope.line_dayapt_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Date"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                },
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }

            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport",
            font: {
                size: 20
            },
            
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500
        },
        bindingOptions: {
            "dataSource": "data.dailyAirportsTbl",
            series: 'lineDayAptSeries',
        },
    };

    $scope.bar_dayapt_instanse = null;
    $scope.bar_dayapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_dayapt_instanse)
                $scope.bar_dayapt_instanse = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Date",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 500,
        },
        bindingOptions: {
            "dataSource": "data.dailyAirportsTbl",
            series: 'lineDayAptSeries',


        }
    };

    //////////////APT CAT///////////////
    $scope.largeChartWidth = '100%';
    //if ($(window).width() > 1500)
    //    $scope.largeChartWidth = '1500';
    $scope.line_yearaptcat_instanse = null;
    $scope.line_yearaptcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearaptcat_instanse)
                $scope.line_yearaptcat_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport-Categories",
            font: {
                size: 20
            },
            subtitle: {
                text: "28-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500,
            width: $scope.largeChartWidth,
        },
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearAptCatSeries',
        },
    };
    ///////////////////////////////
    $scope.line_dayaptcat_instanse = null;
    $scope.line_dayaptcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_dayaptcat_instanse)
                $scope.line_dayaptcat_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Date"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport-Categories",
            font: {
                size: 20
            },
             
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500,
            width: '100%',
        },
        bindingOptions: {
            "dataSource": "data.airportCategoryDailyTbl",
            series: 'lineDayAptCatSeries',
        },
    };

    ////////////////////////////

    $scope.line_yearaptcatweek = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearaptcat_instanse)
                $scope.line_yearaptcat_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport-Categories",
            font: {
                size: 20
            },
            subtitle: {
                text: "7-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500,
            width: $scope.largeChartWidth,
        },
        bindingOptions: {
            "dataSource": "lineYearWeekCatDs",
            series: 'lineYearAptCatSeries',
        },
    };

    ///////////////////////////////////


    $scope.line_yearweekcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        commonSeriesSettings: {
            argumentField: "Month"
        },
        onInitialized: function (e) {
            if (!$scope.line_yearweekcat_instance)
                $scope.line_yearweekcat_instance = e.component;
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Category",
            font: {
                size: 20
            },
            subtitle: {
                text: "7-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                
                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        size: {
            height: 500
        },
        bindingOptions: {
            "dataSource": "lineYearWeekCatDs",
            series: 'lineYearCatSeries',
        },
    };

    $scope.line_yearweekapt_instanse = null;
    $scope.line_yearweekapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.line_yearweekapt_instanse)
                $scope.line_yearweekapt_instanse = e.component;
        },
        commonSeriesSettings: {
            argumentField: "Month"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },


        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",

        },
        title: {
            text: "Total Delays By Airport",
            font: {
                size: 20
            },
            subtitle: {
                text: "7-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                 
                return {
                    text: arg.seriesName + ", " + "Delay" + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data[arg.seriesName + "Count"]
                };
            }
        },
        //size: {
        //    height: 500
        //},
        bindingOptions: {
            "dataSource": "lineYearWeekCatDs",
            series: 'lineYearAptSeries',
            'size.height': 'height550',
        },
    };


    $scope.bar_yearcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_yearcat_instance)
                $scope.bar_yearcat_instance = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
            
        },
        commonSeriesSettings: {
            argumentField: "Month",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size:{
            height:500,
        },
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearCatSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',
            
            
        }
    };

    $scope.bar_daycat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_daycat_instance)
                $scope.bar_daycat_instance = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Date",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
           // location: "edge",
            customizeTooltip: function (arg) {
               // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 500,
            width:'100%'
        },
        bindingOptions: {
            "dataSource": "data.dailyCatsTbl",
            series: 'lineDayCatSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',


        }
    };

    $scope.bar_yearcatmonth_instance = null;
    $scope.bar_yearcatmonth = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
             if (!$scope.bar_yearcatmonth_instance)
                 $scope.bar_yearcatmonth_instance = e.component;
        },
        commonPaneSettings: {
            border: {
                visible: true,
            }
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Category",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 500,
        },
        bindingOptions: {
            "dataSource": "dataYear.categoriesTbl",
            series: 'lineYearCatMonthSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',


        }
    };

    

    $scope.bar_yearapt_instanse = null;
    $scope.bar_yearapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_yearapt_instanse)
                $scope.bar_yearapt_instanse = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Month",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        //size: {
        //    height: 500,
        //},
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearAptSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',
            'size.height': 'height550',

        }
    };
    ///////////////////////////////
    $scope.bar_yearaptcat_instanse = null;
    $scope.bar_yearaptcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_yearaptcat_instanse)
                $scope.bar_yearaptcat_instanse = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Month",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        //size: {
        //    height: 500,
        //},
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'lineYearAptCatSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',

            'size.height': 'height550',
        }
    };
    ////////////////////////////////
    $scope.bar_dayaptcat_instanse = null;
    $scope.bar_dayaptcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_dayaptcat_instanse)
                $scope.bar_dayaptcat_instanse = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                customizeText: function (e) {
                    return moment(new Date(e.value)).format('YY-MM-DD');
                }
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Date",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 500,
        },
        bindingOptions: {
            "dataSource": "data.airportCategoryDailyTbl",
            series: 'lineDayAptCatSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',


        }
    };

    /////////////////////////////////

    $scope.bar_yearweekcat = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_yearweekcat_instance)
                $scope.bar_yearweekcat_instance = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Month",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 500,
        },
        bindingOptions: {
            "dataSource": "lineYearWeekCatDs",
            series: 'lineYearCatSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',


        }
    };

    $scope.bar_yearweekapt_instanse = null;
    $scope.bar_yearweekapt = {
        palette: 'Dark Violet',
        paletteExtensionMode: 'Alternate',
        onInitialized: function (e) {
            if (!$scope.bar_yearweekapt_instanse)
                $scope.bar_yearweekapt_instanse = e.component;
        },
        argumentAxis: {
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',

        },
        commonSeriesSettings: {
            argumentField: "Month",
            type: "stackedBar",
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'black',
                font: {
                    color: 'black',
                    size: 11,
                },
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                },
                visible: false,
            },
            barWidth: 30,
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            //  itemTextPosition: 'top'
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        //size: {
        //    height: 500,
        //},
        bindingOptions: {
            "dataSource": "lineYearWeekCatDs",
            series: 'lineYearAptSeries',
            // palette: 'catColors',
            // 'valueAxis[0].max': 'barMax',
            'size.height': 'height550',

        }
    };
    $scope.pie_yearcat={
        palette: "ocean",
         
        type: "doughnut",
        //title: { 
        //    text: "Imports/Exports of Goods and Services",
        //    subtitle: {
        //        text: "(billion US$, 2012)"
        //    }
        //},
        legend: {
            visible: true
        },
        innerRadius: 0.2,
        commonSeriesSettings: {
            label: {
                    visible: false
            }
        },
        tooltip: {
            enabled: true,
            format: "currency",
            customizeTooltip: function() {
                return { text: this.argumentText + "<br>" + this.seriesName + ": " + this.valueText + "B" };
            }
        },
        "export": {
            enabled: false
        },
        bindingOptions: {
            "dataSource": "lineYearCatDs",
            series: 'pieYearCatSeries',
        },
    };
    /////////////////////////////////////
    $scope.line_yearweek = {
        palette: "Carmine",

        commonSeriesSettings: {
            argumentField: "Week"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        bindingOptions: {
            "dataSource": "lineYearWeekDs",
            series: 'lineYearWeekSeries',
            'size.height':'height550'
        },

        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible:false,
        },
        title: {
            text: "Total Delays",
            font: {
                size: 20
            },
            subtitle: {
                text: "7-Day Period"
            }
        },
        "export": {
            enabled: false
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                
                return {
                    text: arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Count:" + arg.point.data.Count
                };
            }
        },
        
    };

    $scope.line_yearweekdl = {
        palette: "Carmine",
        size: {
            height: 550
        },
        commonSeriesSettings: {
            argumentField: "Week"
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle: "dot",
            label: {
                visible: true,
                backgroundColor: "#949494",
                font: {
                    color: "#fff",
                    size: 12,
                }
            }
        },
        bindingOptions: {
            "dataSource": "lineYearWeekDs",
            series: 'lineYearWeekDLSeries',
        },
        panes: [{
            name: "topPane",
            border: {
                visible: true,
            }
        }, {
            name: "middlePane",
            border: {
                visible: true,
            }
        }, {
            name: "bottomPane",
            border: {
                visible: true,
            }
        }],
        defaultPane: "bottomPane",
        argumentAxis: {
            valueMarginsEnabled: false,

            grid: {
                visible: false
            },
            label: {
                //displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        valueAxis: [{
            pane: "bottomPane",
            grid: {
                visible: true
            },
            title: {
                text: "Legs",
                margin: 12,
                font: { size: 13 }
            },
            label: {
                customizeText: function () {
                    return (this.value)  ;
                }
            },
        },{
            pane: "middlePane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay Ratio",
                margin: 12,
                font: { size: 13 }
            },
            label: {
                customizeText: function () {
                    return (this.value) + '%';
                }
            },
        }, {
            pane: "topPane",
            grid: {
                visible: true
            },
            title: {
                text: "Delay/Leg",
                font: { size: 13 }
            },
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            visible:false,
        },
        //title: {
        //    text: "Total Delays",
        //    font: {
        //        size: 20
        //    },
        //    subtitle: {
        //        text: "28-Day Period"
        //    }
        //},
        "export": {
            enabled: false
        },

        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {

                return {
                    text: (arg.seriesName.indexOf('Ratio') != -1) ?
                        arg.seriesName + ", " + arg.argument + ": " + Math.floor(arg.value) + '%' + ", Block Time:" + arg.point.data.BL
                        : arg.seriesName + ", " + arg.argument + ": " + $scope.formatMinutes(arg.value) + ", Legs:" + arg.point.data.Legs
                }

            }
        },
    };
    //////////////////////////////////
    $scope.popup_detail_visible = false;
    $scope.popup_detail_title = 'Details';
    $scope.popup_detail_first = true;
    $scope.popup_detail = {
        
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 490,
        width: 700,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxDateBox', location: 'before', options: {
                    adaptivityEnabled: true,
                    type: "date",
                    placeholder: 'From',
                    width: 125,
                    useMaskBehavior: true,
                    elementAttr: {
                        
                        class: "dx-border"
                    },
                    onValueChanged: function (e) {
                        $scope.dt_from = e.value;
                    },
                    // displayFormat: "mm/dd/yy",
                    bindingOptions: {
                        value: 'dt_from',

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    adaptivityEnabled: true,
                    type: "date",
                    placeholder: 'To',
                    width: 125,
                    useMaskBehavior: true,
                    elementAttr: {

                        class: "dx-border"
                    },
                    onValueChanged: function (e) {
                        $scope.dt_to = e.value;
                    },
                    // displayFormat: "mm/dd/yy",
                    bindingOptions: {
                        value: 'dt_to',

                    }
                }, toolbar: 'bottom'
            },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'normal', text: '', icon: 'add',   bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
            //            $scope.popup_date_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: '', icon: 'search', validationGroup: 'fblink', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
                        //book
                        //  alert($scope.dt_from);
                        $scope.dg_ds = null;
                        $scope.bind();
                    }
                }, toolbar: 'bottom'
            },

            //{ widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick:function(e) {$scope.popup_detail_visible = false;} }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

            $('.tabcd').hide();


        },
        onShown: function (e) {
           
            $scope.dg_ds = null;
            $scope.bind();
            var allPanels = $('.accordion > dd').hide();
            $('.category').slideDown(500, "swing", function () {
               // $scope.renderCharts();
            });
            if ($scope.popup_detail_first) {
                $('.accordion > dt > a').click(function () {

                    allPanels.slideUp();
                    if (!$(this).parent().next().is(':visible'))
                        $(this).parent().next().slideDown(500, "swing", function () {
                            $scope.renderCharts();
                        });
                    return false;
                });
                $scope.popup_detail_first = false;
            }
           
        },
        onHiding: function () {
            $scope.IsDetailVisible = false;
            $scope.popup_link_visible = false;

        },
        showCloseButton:true,
        bindingOptions: {
            visible: 'popup_detail_visible',

            title: 'popup_detail_title',
            //'toolbarItems[0].options.value': 'dt_from',

        }
    };

    ////////////////////////////////////////
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title:'Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 180,
        width: 250,
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

             pd1= $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar:{
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    
                    //console.log(new Date(unix));
                     $scope.$apply(function () {
                         $scope.dt_from1 = new Date(unix);
                     });
                    
                },

           });
           pd1.setDate(new Date($scope.dt_from1.getTime()  ));
             pd2 = $(".date2").pDatepicker({
               format: 'l',
               autoClose: true,
               calendar:{
                   persian: {
                       locale: 'en'
                   }
               },
               onSelect: function (unix) {
                   $scope.$apply(function () {
                       $scope.dt_to1 = new Date(unix);
                   });
               },

           });
           pd2.setDate(new Date($scope.dt_to1.getTime()  ));

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

    
    //////////////////////////////////
    $scope.doRefresh = false;

    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };
    $scope.bind1 = function () {
        //iruser558387
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        
        var url = 'odata/crew/report/main?date=' + _dt;//2019-06-06T00:00:00';
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };








    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Delays';
        $('.statdelay').fadeIn(400, function () {
            $scope.bindYearly();
        });
    }

    $scope.renderCharts = function () {
        if ($scope.bar_cat_ins)
            $scope.bar_cat_ins.render();
        if ($scope.bar_daycat_instance)
            $scope.bar_daycat_instance.render();
        if ($scope.line_dayaptcat_instanse)
            $scope.line_dayaptcat_instanse.render();
        if ($scope.bar_dayaptcat_instanse)
            $scope.bar_dayaptcat_instanse.render();


    };

    var allPanels = $('.accordion > dd').hide();
    $('.airport').slideDown(500, "swing", function () {
        $scope.renderCharts();
    });
    // allPanels.slideDown();
    $('.accordion > dt > a').click(function () {

        allPanels.slideUp();
        if (!$(this).parent().next().is(':visible'))
            $(this).parent().next().slideDown(500, "swing", function () {
                $scope.renderCharts();
            });
        return false;
    });
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);