'use strict';
app.controller('kpiDelayAirportController', ['$scope', '$location', 'personService', 'authService', 'biService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, biService, $routeParams, $rootScope) {
    $scope.fieldName = '';
    $scope.indexName = '';
    $scope.ds_month = [
        { title: 'فروردین', id: 1, cnt: 31 },
        { title: 'اردیبهشت', id: 2, cnt: 31 },
        { title: 'خرداد', id: 3, cnt: 31 },
        { title: 'تیر', id: 4, cnt: 31 },
        { title: 'مرداد', id: 5, cnt: 31 },
        { title: 'شهریور', id: 6, cnt: 31 },
        { title: 'مهر', id: 7, cnt: 30 },
        { title: 'آبان', id: 8, cnt: 30 },
        { title: 'آذر', id: 9, cnt: 30 },
        { title: 'دی', id: 10, cnt: 30 },
        { title: 'بهمن', id: 11, cnt: 30 },
        { title: 'اسفند', id: 12, cnt: 30 },
    ];
    const _monthNames = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ];
    $scope.monthNames2 = _monthNames;
    $scope.ds_year = ['1398', '1399', '1400'];
    $scope.ds_daily = [];

    $scope.selectedTypes = [];
    $scope.getTypeSelectedClass = function (t) {
        var selected = $scope.selectedTypes.indexOf(t) != -1;
        if (selected)
            return 'on-type';
        return 'off-type';
    };

    $scope.selectedCats = [];
    $scope.getCatSelectedClass = function (t) {
         
        var selected = $scope.selectedCats.indexOf(t) != -1;
        if (selected)
            return 'on-type';
        return 'off-type';
    };
    $scope.totalCatsDs = [];
    $scope.bindCats = function (apt) {
        //kak2
        var exists = Enumerable.From($scope.totalCatsDs).Where('$.Airport=="' + apt + '"').FirstOrDefault();
        if (exists)
            return;
        biService.getDelayMonthlyCatAirportsByAirport(-1,apt).then(function (response) {
            $scope.loadingVisible = false;
           // if (callback)
            //    callback(response);
            $.each(response.airportsCats, function (_i, _d) {
                try {
                    var item = JSON.parse(JSON.stringify(_d));
                    item['Delay_' + _d.Airport + '_' + _d.ICategory + '_' + _d.Year] = _d.Delay;
                    item['DelayPerLeg_' + _d.Airport + '_' + _d.ICategory + '_' + _d.Year] = _d.DelayPerLeg;
                    item['CountPerLeg_' + _d.Airport + '_' + _d.ICategory + '_' + _d.Year] = _d.CountPerLeg;
                    item['Count_' + _d.Airport + '_' + _d.ICategory + '_' + _d.Year] = _d.Count;

                    //pride
                    item.DelayPerLeg2 = $scope.formatMinutes(item.DelayPerLeg);
                    item.PreDelayPerLeg2 = $scope.formatMinutes(item.PreDelayPerLeg);
                    item.Delay2 = $scope.formatMinutes(item.Delay);
                    item.PreDelay2 = $scope.formatMinutes(item.PreDelay);

                    item.DelayUnder30Time2 = $scope.formatMinutes(item.DelayUnder30Time);
                    item.DelayOver30Time2 = $scope.formatMinutes(item.DelayOver30Time);
                    item.PreDelayUnder30Time2 = $scope.formatMinutes(item.PreDelayUnder30Time);
                    item.PreDelayOver30Time2 = $scope.formatMinutes(item.PreDelayOver30Time);

                    item.Delay3060Time2 = $scope.formatMinutes(item.Delay3060Time);
                    item.Delay60120Time2 = $scope.formatMinutes(item.Delay60120Time);
                    item.Delay120180Time2 = $scope.formatMinutes(item.Delay120180Time);
                    item.DelayOver180Time2 = $scope.formatMinutes(item.DelayOver180Time);

                    item.PreDelay3060Time2 = $scope.formatMinutes(item.PreDelay3060Time);
                    item.PreDelay60120Time2 = $scope.formatMinutes(item.PreDelay60120Time);
                    item.PreDelay120180Time2 = $scope.formatMinutes(item.PreDelay120180Time);
                    item.PreDelayOver180Time2 = $scope.formatMinutes(item.PreDelayOver180Time);

                    item.DelayAirport2 = $scope.formatMinutes(item.DelayAirport);


                    $scope.totalCatsDs.push(item);
                }
                catch (e) {
                    console.log(e);
                }
               
            });
            $scope.buildCatsDs();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    //magu4
    $scope.$on('ngRepeatFinishedCatsAirports', function (ngRepeatFinishedEvent) {
        //$.each($scope.typeRegsCharts, function (_i, _d) {
        //    _d.destroy();
        //});
        //$.each($scope.typeRegsPolarCharts, function (_i, _d) {
        //    _d.destroy();
        //});
        //$scope.initTypesRegCard();
        
    });
    $scope.buildCatsDs = function () {
        $scope.groupedAirportsCats = Enumerable.From($scope.totalCatsDs   )
            //.GroupBy("$.ArgNum", null, (key, g) => {
            .GroupBy(function (item) { return item.AirportId + '_' + item.Airport; }, null, (key, g) => {
                return {
                    AirportId: Number(key.split('_')[0]),
                    Airport: key.split('_')[1],
                    items: Enumerable.From(g.source).OrderBy('$.Year').ThenBy('$.Month').ThenBy('$.ICategory').ToArray(),
                    current: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).ToArray(),
                    past: Enumerable.From(g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).ToArray(),
                    categories: Enumerable.From(g.source).GroupBy(function (x) { return x.ICategory; }, null, (_key, _g) => {
                        return {
                            ICategory: _key,
                            items: Enumerable.From(_g.source).OrderBy('$.Year').ThenBy('$.Month').ToArray(),
                            current: Enumerable.From(_g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).FirstOrDefault(),
                            past: Enumerable.From(_g.source).Where('$.Month==' + ($scope.month - 1) + ' && $.Year==' + $scope.year).FirstOrDefault(),
                        }

                    }).ToArray(),
                    
                    //sumDelay: Enumerable.From(g.source).Sum('$.Delay'),
                    //sumDelayCurrent: Enumerable.From(g.source).Where('$.Month==' + $scope.month + ' && $.Year==' + $scope.year).Sum('$.Delay'),


                }
            }).ToArray();

        //console.log($scope.groupedAirportsCats);
    };

    $scope.selectCat = function (t) {
        
        var exists = $scope.selectedCats.indexOf(t) != -1;
        if (exists) {
            $scope.selectedCats = Enumerable.From($scope.selectedCats).Where('$!="' + t + '"').ToArray();
        }
        else {
            $scope.selectedCats.push(t);
        }
        $scope.rebuildCat();
    };
    $scope.selectType = function (t) {
        var exists = $scope.selectedTypes.indexOf(t) != -1;

        //var mainsrs = $scope.chart_monthly_rpk_instance.getAllSeries();
        //var extrasrs = $scope.chart_monthly_rpktotalpanes_instance.getAllSeries();
        //var mainsrsdaily = $scope.chart_daily_rpk_instance.getAllSeries();
        //var extrasrsdaily = $scope.chart_daily_rpktotalpanes_instance.getAllSeries();

        if (exists) {
            $scope.selectedTypes = Enumerable.From($scope.selectedTypes).Where('$!="' + t + '"').ToArray();
            //$.each(mainsrs, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.hide();
            //});
            //$.each(extrasrs, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.hide();
            //});

            //$.each(mainsrsdaily, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.hide();
            //});
            //$.each(extrasrsdaily, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.hide();
            //});
        }
        else {
            $scope.selectedTypes.push(t);
            $scope.bindCats(t);
            //$.each(mainsrs, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.show();
            //});
            //$.each(extrasrs, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.show();
            //});
            //$.each(mainsrsdaily, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.show();
            //});
            //$.each(extrasrsdaily, function (_i, _s) {
            //    //console.log(_s.name);
            //    if (_s.name.includes(t))
            //        _s.show();
            //});
        }
        $scope.rebuild();
        $scope.rebuildCat();
        var oyears = Enumerable.From($scope.years).OrderBy('Number($)').Select('Number($)').ToArray();
        var smsids = Enumerable.From($scope.months).OrderBy('$.id').Select('Number($.id)').ToArray();
        $scope.dg_monthly2_ds = Enumerable.From($scope.total.items)
            .Where(function (x) { return oyears.indexOf(Number(x.Year)) != -1 && $scope.selectedTypes.indexOf(x.Airport) != -1; })
            .OrderBy('Number($.Year)')
            .ThenBy('Number($.Month)')
            .ThenBy('$.Airport')
            .ToArray();

        $scope.dg_daily2_ds = Enumerable.From($scope.ds_daily.items)
            .Where(function (x) { return oyears.indexOf(Number(x.Year)) != -1 && smsids.indexOf(Number(x.Month)) != -1 && $scope.selectedTypes.indexOf(x.Airport) != -1; })
            .OrderBy('Number($.Year)')
            .ThenBy('Number($.Month)')
            .ThenBy('Number($.Day)')
            .ThenBy('$.Airport')
            .ToArray();
    };
    ////////////////////////
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
    ////////////////////////////
    $scope.loadingDailyVisible = false;
    $scope.loadPanelDaily = {
        message: 'Please wait...',
        //container:'',
        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        position: { of: "#daily" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingDailyVisible'
        }
    };
    ////////////////////////////
    $scope.popup_visible = false;
    $scope.popup_title = '';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Details',   onClick: function (e) {
                        //  $scope.dg_monthly2_instance.refresh();
                        //magu8
                        var data = {
                            data: $scope.prms,
                            years: $scope.years,
                            initialAirports: $scope.selectedTypes,
                            initialCats: $scope.selectedCats,
                            grouped: $scope.grouped,  
                            catNames: $scope.catNames,
                            isMaster: $scope.IsOverallVisible,
                           catsDs: $scope.totalCatsDs,
                            groupedAirportsCats:  $scope.groupedAirportsCats
                        };
                        $rootScope.$broadcast('InittblDelayAirport', data)
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        //  $scope.dg_monthly2_instance.refresh();
                        $scope.popup_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();
            $scope.scroll_1_height = $(window).height() - 220;

        },
        onShown: function (e) {

            var ys = [];
            if ($scope.year > $rootScope.startingBIYear)
                ys.push(($scope.year - 1).toString());
            ys.push($scope.year.toString());
            $scope.years = ys;
            var ms = [];
            var cms = Enumerable.From($scope.ds_month).Where('$.id==' + $scope.month).FirstOrDefault();

            ms.push(cms);
            $scope.months = ms;
            
            //$scope.dg_monthly2_instance.refresh();
            //$scope.dg_daily2_instance.refresh();


            //['RPK'].indexOf($scope.indexName) != -1
            //$scope.dg_monthly2_instance.columnOption('RPK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('ASK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FTK', 'visible', ['FTK'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FTB', 'visible', ['FTB'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FBL', 'visible', ['FBL'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FC', 'visible', ['FC'].indexOf($scope.indexName) != -1);

            //$scope.dg_daily2_instance.columnOption('RPK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('ASK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FTK', 'visible', ['FTK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FTB', 'visible', ['FTB'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FBL', 'visible', ['FBL'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FC', 'visible', ['FC'].indexOf($scope.indexName) != -1);
        },
        onHiding: function () {

            $scope.popup_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },

        bindingOptions: {
            visible: 'popup_visible',

            title: 'popup_title',

        }
    };
    ////////////////////////////////
    $scope.years = [];
    $scope.tagYears = {
        searchEnabled: true,
        applyValueMode: 'useButtons',
        showSelectionControls: true,

        onValueChanged: function (e) {

            $scope.rebuild();
            $scope.rebuildCat();

        },
        bindingOptions: {
            dataSource: 'ds_year',
            value: 'years',

        }
    };

    $scope.months = [];
    $scope.tagMonths = {
        searchEnabled: true,
        applyValueMode: 'useButtons',
        showSelectionControls: true,
        displayExpr: 'title',
        //valueExpr:'id',
        onValueChanged: function (e) {

            $scope.rebuildDaily();

        },
        bindingOptions: {
            dataSource: 'ds_month',
            value: 'months',


        }
    };
    ////////////////////////////////
    $scope.mainSeries = [];
    $scope.mainDailySeries = [];
    $scope.extraSeries = [];
    $scope.extraDailySeries = [];
    ////////////////////////////////
    $scope.bindDaily = function (callback) {

        var sys = $scope.years.join('_');
        var sms = Enumerable.From($scope.months).Select('$.id').ToArray().join('_');
        if (!sys || !sms)
            return;
        $scope.loadingDailyVisible = true;
        biService.getFuelRegisterDaily(sys, sms).then(function (response) {
            $scope.loadingDailyVisible = false;
            $scope.ds_daily = response;

            $.each($scope.ds_daily.items, function (_i, _d) {
                _d['UsedPerPaxKiloDistanceKM' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerPaxKiloDistanceKM;
                _d['UsedPerSeatKiloDistanceKM' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerSeatKiloDistanceKM;
                _d['UsedPerWeightDistanceToneKM' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerWeightDistanceToneKM;
                _d['UsedPerLeg' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerLeg;
                _d['UsedPerWeightToneBlockTime' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerWeightToneBlockTime;
                _d['UsedPerBlockTime' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedPerBlockTime;
                _d['TotalPax' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.TotalPax;
                _d['UsedKilo' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.UsedKilo;
                _d['DistanceKM' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.DistanceKM;
                _d['WeightTone' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.WeightTone;
                _d['Legs' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.Legs;
                _d['BlockTime' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.BlockTime;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d['BlockTime2' + '_' + _d.Year + '_' + _d.Month + '_' + _d.RegisterID] = _d.BlockTime2;

            });

            if (callback)
                callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    /////////////////////////////////
    $scope.rebuildDaily = function () {
        var sys = Enumerable.From($scope.years).Select('Number($)').OrderBy('$').ToArray();
        var sms = Enumerable.From($scope.months).OrderBy('$.id').ToArray();
        var smsids = Enumerable.From($scope.months).OrderBy('$.id').Select('Number($.id)').ToArray();





        //$scope.bindDaily(function () {
        //    $scope.dg_daily2_ds = Enumerable.From($scope.ds_daily.items)
        //        .Where(function (x) { return sys.indexOf(Number(x.Year)) != -1 && smsids.indexOf(Number(x.Month)) != -1 && $scope.selectedTypes.indexOf(x.RegisterID) != -1; })
        //        .OrderBy('Number($.Year)')
        //        .ThenBy('Number($.Month)')
        //        .ThenBy('Number($.Day)')
        //        .ThenBy('$.Register')
        //        .ToArray();
        //    /////////////////
        //    var c_rpk = { caption: 'RPK', columns: [] }
        //    var c_ask = { caption: 'ASK', columns: [] }
        //    var c_used = { caption: 'Used(K)', columns: [] };
        //    var c_pax = { caption: 'Pax(K)', columns: [] };
        //    var c_dis = { caption: 'Distance(KM)', columns: [] };
        //    var summary = {
        //        totalItems: [

        //        ],
        //    };

        //    //$.each(sms, function (_j, _m) {
        //    $.each(sys, function (_i, _y) {
        //        c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKMDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
        //        c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKM' + '_' + _y /*+ '_' + _m.id*/, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
        //        c_ask.columns.push({ dataField: 'UsedPerSeatKiloDistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });



        //        c_used.columns.push({ dataField: 'UsedKiloDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
        //        c_used.columns.push({ dataField: 'UsedKilo' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
        //        c_pax.columns.push({ dataField: 'TotalPaxDiff' + '_', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
        //        c_pax.columns.push({ dataField: 'TotalPax' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
        //        c_dis.columns.push({ dataField: 'DistanceDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
        //        c_dis.columns.push({ dataField: 'DistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
        //        summary.totalItems.push(
        //            {
        //                column: "UsedKilo_" + _y /*+ '_' + _m.id*/,
        //                summaryType: "sum",
        //                customizeText: function (data) {
        //                    return Math.round(data.value);
        //                }
        //            },
        //        );
        //        summary.totalItems.push(
        //            {
        //                column: "TotalPax_" + _y,
        //                summaryType: "sum",
        //                customizeText: function (data) {
        //                    return data.value;
        //                }
        //            },
        //        );
        //        summary.totalItems.push(
        //            {
        //                column: "DistanceKM_" + _y,
        //                summaryType: "sum",
        //                customizeText: function (data) {
        //                    return data.value;
        //                }
        //            },
        //        );

        //    });
        //    // });



        //    //hasrat
        //    if ($scope.dg_daily_instance) {

        //        var dg_daily_ds = [];
        //        $.each(sms, function (_j, _m) {
        //            var _dy;
        //            for (_dy = 1; _dy <= _m.cnt; _dy++) {
        //                var item = { Month: _m.id, ArgStr: _m.title, Day: _dy };
        //                $.each(sys, function (_i, _y) {
        //                    var rec = Enumerable.From($scope.ds_daily.items).Where('$.Year==' + _y + ' && $.Month==' + _m.id + ' && $.Day==' + _dy).FirstOrDefault();
        //                    //dlui

        //                    item['UsedPerPaxKiloDistanceKMDiff' + '_' + _y /*+ '_' + _m.id*/] = !rec ? null : rec['UsedPerPaxKiloDistanceKMDiff' + '_' + _y /*+ '_' + _m.id*/];
        //                    item['UsedPerPaxKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerPaxKiloDistanceKM' + '_' + _y/* + '_' + _m.id*/];
        //                    item['UsedPerSeatKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerSeatKiloDistanceKM' + '_' + _y];
        //                    item['UsedPerWeightDistanceToneKM' + '_' + _y] = !rec ? null : rec['UsedPerSeatKiloDistanceKM' + '_' + _y];
        //                    item['UsedKiloDiff' + '_' + _y] = !rec ? null : rec['UsedKiloDiff' + '_' + _y];
        //                    item['UsedKilo' + '_' + _y] = !rec ? null : rec['UsedKilo' + '_' + _y];
        //                    item['TotalPaxDiff' + '_' + _y] = !rec ? null : rec['TotalPaxDiff' + '_' + _y];
        //                    item['TotalPax' + '_' + _y] = !rec ? null : rec['TotalPax' + '_' + _y];
        //                    item['DistanceDiff' + '_' + _y] = !rec ? null : rec['DistanceDiff' + '_' + _y];
        //                    item['DistanceKM' + '_' + _y] = !rec ? null : rec['DistanceKM' + '_' + _y];
        //                    item['WeightTone' + '_' + _y] = !rec ? null : rec['WeightTone' + '_' + _y];
        //                });

        //                dg_daily_ds.push(item);
        //            }
        //        });
        //        $scope.dg_daily_instance.beginUpdate();
        //        $scope.dg_daily_instance.option('dataSource', dg_daily_ds);

        //        $scope.dg_daily_instance.option('summary', summary);
        //        $scope.dg_daily_instance.endUpdate();


        //        $scope.dg_daily_instance.beginUpdate();

        //        $scope.dg_daily_instance.option('columns', []);

        //        $scope.dg_daily_instance.addColumn(
        //            {
        //                cellTemplate: function (container, options) {
        //                    $("<div style='text-align:center'/>")
        //                        .html(options.rowIndex + 1)
        //                        .appendTo(container);
        //                }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //            }
        //        );
        //        $scope.dg_daily_instance.addColumn({ dataField: 'ArgStr', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left' },);
        //        $scope.dg_daily_instance.addColumn({ dataField: 'Day', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, minWidth: 70, fixed: true, fixedPosition: 'left' },);
        //        $scope.dg_daily_instance.addColumn(c_rpk);
        //        $scope.dg_daily_instance.addColumn(c_ask);
        //        $scope.dg_daily_instance.addColumn(c_used);
        //        $scope.dg_daily_instance.addColumn(c_pax);
        //        $scope.dg_daily_instance.addColumn(c_dis);


        //        $scope.dg_daily_instance.endUpdate();
        //        $scope.dg_daily_instance.refresh();
        //    };



        //    if ($scope.dg_daily2_instance)
        //        $scope.dg_daily2_instance.refresh();
        //    /////////////
        //});



        $scope.mainDailySeries = [];
        $scope.extraDailySeries = [];


        var c = 0;
        $.each(sys, function (_i, _y) {
            $.each(sms, function (_j, _m) {
                $.each($scope.grouped, function (_j, _t) {
                    var rpkSeries = {
                        year: _y,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        valueField: 'UsedPerPaxKiloDistanceKM' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        name: 'RPK ' + _t.Register + ' (' + _y + '-' + _m.title + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet1(c),
                    };
                    var ftkSeries = {
                        year: _y,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        valueField: 'UsedPerWeightDistanceToneKM' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        name: 'FTK ' + _t.Register + ' (' + _y + '-' + _m.title + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet1(c),
                    };
                    var ftbSeries = {
                        year: _y,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        valueField: 'UsedPerWeightToneBlockTime' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        name: 'FTB ' + _t.Register + ' (' + _y + '-' + _m.title + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet1(c),
                    };
                    var fblSeries = {
                        year: _y,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        valueField: 'UsedPerBlockTime' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        name: 'FBL ' + _t.Register + ' (' + _y + '-' + _m.title + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet1(c),
                    };

                    var fcSeries = {
                        year: _y,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        valueField: 'UsedPerLeg' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        name: 'FC ' + _t.Register + ' (' + _y + '-' + _m.title + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet1(c),
                    };


                    var paxSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        name: 'Pax ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "pax", type: 'bar', valueField: 'TotalPax' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,

                    };
                    var usedSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        name: 'Used ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "used", type: 'bar', valueField: 'UsedKilo' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,
                    };
                    var disSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        name: 'Distance ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "dis", type: 'bar', valueField: 'DistanceKM' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,
                    };
                    var weightSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        nname: 'Weight ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "weight", type: 'bar', valueField: 'WeightTone' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,

                    };
                    var legSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        nname: 'Cycle ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "legs", type: 'bar', valueField: 'Legs' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,

                    };
                    var blSeries = {
                        year: _y, visible: $scope.selectedTypes.indexOf(_t.RegisterID) != -1,
                        month: _m.id,
                        typeId: _t.TypeId,
                        registerId: _t.RegisterID,
                        nname: 'Block Time ' + _t.Register + ' (' + _y + '-' + _m.title + ')', pane: "bl", type: 'bar', valueField: 'BlockTime' + '_' + _y + '_' + _m.id + '_' + _t.RegisterID,
                        color: $rootScope.getColorFromSet1(c), showInLegend: false,

                    };


                    $scope.extraDailySeries.push(paxSeries);
                    $scope.extraDailySeries.push(usedSeries);
                    $scope.extraDailySeries.push(disSeries);
                    $scope.extraDailySeries.push(weightSeries);
                    $scope.extraDailySeries.push(legSeries);
                    $scope.extraDailySeries.push(blSeries);


                    if (['RPK'].indexOf($scope.indexName) != -1) {
                        $scope.mainDailySeries.push(rpkSeries);
                    }
                    if (['FTK'].indexOf($scope.indexName) != -1) {
                        $scope.mainDailySeries.push(ftkSeries);

                    }
                    if (['FTB'].indexOf($scope.indexName) != -1) {
                        $scope.mainDailySeries.push(ftbSeries);

                    }
                    if (['FBL'].indexOf($scope.indexName) != -1) {
                        $scope.mainDailySeries.push(fblSeries);

                    }
                    if (['FC'].indexOf($scope.indexName) != -1) {
                        $scope.mainDailySeries.push(fcSeries);

                    }
                    c++;
                });

            });
        });


    };
    $scope.scroll_1_height = 200;
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_1_height', }
    };
    $scope.scroll_2 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_1_height', }
    };
    $scope.scroll_3 = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_1_height', }
    };
    $scope.rebuild = function () {
        //$scope.dg_monthly_columns

        var oyears = Enumerable.From($scope.years).OrderBy('Number($)').Select('Number($)').ToArray();
        var c_rpk = { caption: 'RPK', columns: [] }
        var c_ask = { caption: 'ASK', columns: [] }
        var c_used = { caption: 'Used(K)', columns: [] };
        var c_pax = { caption: 'Pax(K)', columns: [] };
        var c_dis = { caption: 'Distance(KM)', columns: [] };
        var summary = {
            totalItems: [

            ],
        };
        $.each(oyears, function (_i, _y) {
            c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKMDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
            c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
            c_ask.columns.push({ dataField: 'UsedPerSeatKiloDistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });



            c_used.columns.push({ dataField: 'UsedKiloDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
            c_used.columns.push({ dataField: 'UsedKilo' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
            c_pax.columns.push({ dataField: 'TotalPaxDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
            c_pax.columns.push({ dataField: 'TotalPax' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
            c_dis.columns.push({ dataField: 'DistanceDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
            c_dis.columns.push({ dataField: 'DistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
            summary.totalItems.push(
                {
                    column: "UsedKilo_" + _y,
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },
            );
            summary.totalItems.push(
                {
                    column: "TotalPax_" + _y,
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
            );
            summary.totalItems.push(
                {
                    column: "DistanceKM_" + _y,
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
            );
        });
         
        $scope.dg_monthly2_ds = Enumerable.From($scope.total.items)
            .Where(function (x) { return oyears.indexOf(Number(x.Year)) != -1 && $scope.selectedTypes.indexOf(x.Airport) != -1; })
            .OrderBy('Number($.Year)')
            .ThenBy('Number($.Month)')
            .ThenBy('$.Airport')
            .ToArray();

        if ($scope.dg_monthly_instance) {

            var dg_monthly_ds = [];
            $.each($scope.ds_month, function (_j, _m) {
                var item = { Id: _m.id, ArgStr: _m.title, };
                $.each(oyears, function (_i, _y) {
                    var rec = Enumerable.From($scope.total.items).Where('$.Year==' + _y + ' && $.ArgNum==' + _m.id).FirstOrDefault();

                    item['UsedPerPaxKiloDistanceKMDiff' + '_' + _y] = !rec ? null : rec['UsedPerPaxKiloDistanceKMDiff' + '_' + _y];
                    item['UsedPerPaxKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerPaxKiloDistanceKM' + '_' + _y];
                    item['UsedPerSeatKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerSeatKiloDistanceKM' + '_' + _y];
                    item['UsedKiloDiff' + '_' + _y] = !rec ? null : rec['UsedKiloDiff' + '_' + _y];
                    item['UsedKilo' + '_' + _y] = !rec ? null : rec['UsedKilo' + '_' + _y];
                    item['TotalPaxDiff' + '_' + _y] = !rec ? null : rec['TotalPaxDiff' + '_' + _y];
                    item['TotalPax' + '_' + _y] = !rec ? null : rec['TotalPax' + '_' + _y];
                    item['DistanceDiff' + '_' + _y] = !rec ? null : rec['DistanceDiff' + '_' + _y];
                    item['DistanceKM' + '_' + _y] = !rec ? null : rec['DistanceKM' + '_' + _y];
                });
                dg_monthly_ds.push(item);
            });
            $scope.dg_monthly_instance.beginUpdate();
            $scope.dg_monthly_instance.option('dataSource', dg_monthly_ds);

            $scope.dg_monthly_instance.option('summary', summary);
            $scope.dg_monthly_instance.endUpdate();


            $scope.dg_monthly_instance.beginUpdate();

            $scope.dg_monthly_instance.option('columns', []);

            $scope.dg_monthly_instance.addColumn(
                {
                    cellTemplate: function (container, options) {
                        $("<div style='text-align:center'/>")
                            .html(options.rowIndex + 1)
                            .appendTo(container);
                    }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                }
            );
            $scope.dg_monthly_instance.addColumn({ dataField: 'ArgStr', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left' },);
            $scope.dg_monthly_instance.addColumn(c_rpk);
            $scope.dg_monthly_instance.addColumn(c_ask);
            $scope.dg_monthly_instance.addColumn(c_used);
            $scope.dg_monthly_instance.addColumn(c_pax);
            $scope.dg_monthly_instance.addColumn(c_dis);


            $scope.dg_monthly_instance.endUpdate();
            $scope.dg_monthly_instance.refresh();
            /////////////////////////////////////////



            ///////////////////////////////////
        }

        var mainCurrent = Enumerable.From($scope.mainSeries).Select('$.year').ToArray();
        var newMainSeries = Enumerable.From($scope.years).Where(function (x) { return mainCurrent.indexOf(x) == -1; }).ToArray();


        // $scope.mainSeries = Enumerable.From($scope.mainSeries).Where(function (x) { return $scope.years.indexOf(x.year) != -1; }).ToArray();
        //$scope.extraSeries = Enumerable.From($scope.extraSeries).Where(function (x) { return $scope.years.indexOf(x.year) != -1; }).ToArray();
        $scope.mainSeries = [];
        $scope.mainSeriesDC = [];
        $scope.mainSeriesOC = [];
        $scope.extraSeries = [];
        $scope.aptDelaySeries = [];
        //4-17
        $scope.aptCycleSeries = [];
        $scope.extraSeriesDC = [];
        $scope.extraSeriesOC = [];
        $scope.polarTime30Series = [];
        $scope.polarTime30pSeries = [];
        $scope.polarTime180Series = [];
        $scope.polarTime3060Series = [];
        $scope.polarTime60120Series = [];
        $scope.polarTime120180Series = [];

        $scope.polar30Series = [];
        $scope.polar30pSeries = [];
        $scope.polar180Series = [];
        $scope.polar3060Series = [];
        $scope.polar60120Series = [];
        $scope.polar120180Series = [];
        //nool

        var c = 0;
        var q = 0;
        $.each(/*newMainSeries*/$scope.years, function (_i, _d) {

            var delaySeries = {
                year: _d,
               // axis: "total",
                name: 'Total Delay ' + ' (' + _d + ')',
                //pane: "delay",
                type: 'bar', valueField: 'DelayTotal' + '_' + _d,

                //visible: $scope.selected.indexOf(_t.Airport) != -1,
                color: $rootScope.getColorFromSetLight(q),
                showInLegend: true,
            };
            //$scope.mainSeries.push(delaySeries);
            //var legSeries = {
            //    year: _d,
            //    name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d,
            //    color: $rootScope.getColorFromSetLight(c), showInLegend: false,

            //};
            //var legSeriesOC = {
            //    year: _d,
            //    name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d,
            //    color: $rootScope.getColorFromSetLight(c), showInLegend: false,

            //};
            //var legSeriesDC = {
            //    year: _d,
            //    name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d,
            //    color: $rootScope.getColorFromSetLight(c), showInLegend: false,

            //};

            //$scope.extraSeries.push(legSeries);
            //$scope.extraSeriesOC.push(legSeriesOC);
            //$scope.extraSeriesDC.push(legSeriesDC);
            q++;

            $.each($scope.grouped, function (_j, _t) {
                if ($scope.selectedTypes.indexOf(_t.Airport) != -1) {

                    $scope.polarTime30Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D30Time_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });

                    $scope.polarTime30pSeries.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D30pTime_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });

                    $scope.polarTime180Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D180Time_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polarTime3060Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D3060Time_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polarTime60120Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D60120Time_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polarTime120180Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D120180Time_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });


                    ////////////////////////////

                    $scope.polar30Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D30_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });

                    $scope.polar30pSeries.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D30p_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });

                    $scope.polar180Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D180_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polar3060Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D3060_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polar60120Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D60120_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    $scope.polar120180Series.push({
                        name: _t.Airport + ' ' + _d,
                        argumentField: 'argStr',
                        valueField: _t.Airport + '_' + 'D120180_' + _d,
                        color: $rootScope.getColorFromSet2(c),
                    });
                    // item[row.ICategory + '_' + 'D30Time_' + row.Year]
                    var dlSeries = {
                        year: _d,
                        valueField: 'Delay' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var dl2Series = {
                        year: _d,
                        valueField: 'Delay' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: false,
                        pane: 'delay',
                        type: 'spline',
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var dl2CatSeries = {
                        year: _d,
                        valueField: 'Delay' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: true,
                        
                        type: 'bar',
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var aptCycleSeries = {
                        year: _d,
                        valueField: 'AFlightCount' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: true,

                        type: 'bar',
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var legSeries = {
                        year: _d,
                        name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d + '_' + _t.Airport,
                        color: $rootScope.getColorFromSet2(c), showInLegend: false,

                    };
                    var legSeriesOC = {
                        year: _d,
                        name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d + '_' + _t.Airport,
                        color: $rootScope.getColorFromSet2(c), showInLegend: false,

                    };
                    var legSeriesDC = {
                        year: _d,
                        name: 'Cycles ' + ' (' + _d + ')', pane: "legs", type: 'bar', valueField: 'AFlightCount' + '_' + _d + '_' + _t.Airport,
                        color: $rootScope.getColorFromSet2(c), showInLegend: false,

                    };

                    $scope.extraSeries.push(legSeries);
                    $scope.extraSeriesOC.push(legSeriesOC);
                    $scope.extraSeriesDC.push(legSeriesDC);
                    var countSeries = {
                        year: _d,
                        valueField: 'Count' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: false,
                        pane: 'occurance',
                        type: 'spline',
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var dcSeries = {
                        year: _d,
                        valueField: 'DelayPerLeg' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                    var ocSeries = {
                        year: _d,
                        valueField: 'CountPerLeg' + '_' + _d + '_' + _t.Airport,
                        name: _t.Airport + ' (' + _d + ')',
                        showInLegend: true,
                        color: $rootScope.getColorFromSet2(c),
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                 




                    var delayRatioSeries = {
                        year: _d,
                        name: 'Ratio ' + _t.Airport + ' (' + _d + ')', pane: "delayRatio", type: 'spline', valueField: 'DelayRatio' + '_' + _d + '_' + _t.Airport,
                        color: $rootScope.getColorFromSet2(c), showInLegend: false,
                        visible: $scope.selectedTypes.indexOf(_t.Airport) != -1,
                    };
                   




                    $scope.extraSeries.push(delayRatioSeries);
                    //$scope.extraSeries.push(paxSeries);
                    //$scope.extraSeries.push(weightSeries);
                    //$scope.extraSeries.push(legSeries);
                    //$scope.extraSeries.push(blSeries);

                    $scope.mainSeries.push(dlSeries);
                    $scope.extraSeriesDC.push(dl2Series);
                    $scope.aptDelaySeries.push(dl2CatSeries);
                    $scope.aptCycleSeries.push(aptCycleSeries);
                    $scope.extraSeriesOC.push(countSeries);

                    $scope.mainSeriesDC.push(dcSeries);
                    $scope.mainSeriesOC.push(ocSeries);

                    if (['DL'].indexOf($scope.indexName) != -1) {


                    }

                    c++;
                }
            });


        });
        //alert($scope.mainSeries.length);
        $scope.rebuildDaily();

        //if (!$scope.dg_monthly2_instance)
        //    $scope.dg_monthly2_instance.refresh();

    };
    //magu4
    $scope.rebuildCat = function () {
        $scope.catSeries = [];
        $scope.catdcSeries = [];
        $scope.catocSeries = [];
        $scope.catoccSeries = [];
        
       // alert($scope.selectedCats);
        var c = 0;
        var q = 0;
        $.each(/*newMainSeries*/$scope.years, function (_i, _d) {
            $.each($scope.selectedTypes, function (_j, _t) {
                $.each($scope.selectedCats, function (_q, _c) {
                    var dlSeries = {
                        year: _d,
                        valueField: 'Delay_' + _t + '_' + _c + '_' + _d,
                        name: _t+'-'+_c + ' (' + _d + ')',
                        showInLegend: true,
                        //color: $rootScope.getColorFromSet2(c),
                        type: 'spline',
                        
                    };
                    var dcSeries = {
                        year: _d,
                        valueField: 'DelayPerLeg_' + _t + '_' + _c + '_' + _d,
                        name: _t + '-' + _c + ' (' + _d + ')',
                        showInLegend: true,
                        //color: $rootScope.getColorFromSet2(c),
                        type: 'spline',

                    };
                    var ocSeries = {
                        year: _d,
                        valueField: 'CountPerLeg_' + _t + '_' + _c + '_' + _d,
                        name: _t + '-' + _c + ' (' + _d + ')',
                        showInLegend: true,
                        //color: $rootScope.getColorFromSet2(c),
                        type: 'spline',

                    };
                    var occSeries = {
                        year: _d,
                        valueField: 'Count_' + _t + '_' + _c + '_' + _d,
                        name: _t + '-' + _c + ' (' + _d + ')',
                        showInLegend: true,
                        //color: $rootScope.getColorFromSet2(c),
                        type: 'spline',

                    };
                    $scope.catSeries.push(dlSeries);
                    $scope.catdcSeries.push(dcSeries);
                    $scope.catocSeries.push(ocSeries);
                    $scope.catoccSeries.push(occSeries);
                    c++;
                });
            });
        });
    };
    //magu3
    ///////////////////////////////////////
    $scope.polar_time30 = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Under 30 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime30Series',

        }
    };
    $scope.polar_time30p = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Over 30 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime30pSeries',

        }
    };
    $scope.polar_time180 = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Over 3 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime180Series',

        }
    };

    $scope.polar_time3060 = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Betweeb 30 to 60 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime3060Series',

        }
    };

    $scope.polar_time60120 = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Betweeb 1 to 2 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime60120Series',

        }
    };

    $scope.polar_time120180 = {
        tooltip: {
            enabled: true,

            customizeTooltip: function () {
                return { text: this.seriesName + "<br><br>" + $scope.formatMinutes(this.value.toFixed(0)) };
            }
        },

        title: {
            text: 'Duration of Delays Betweeb 2 to 3 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polarTime120180Series',

        }
    };
    //////////////////////////////////////
    $scope.IsChartVisible = true;
    $scope.IsTableVisible = false;
    $scope.IsOverallVisible = true;
    $scope.IsCatsVisible = false;
    $scope.showCatTable = function (t) {
        $('.show-cat').removeClass('on-type');
        $('.show-cat-table').addClass('on-type');
        $scope.IsTableVisible = true;
        $scope.IsChartVisible = false;
    };
    $scope.showCatCharts = function (t) {
        $('.show-cat').removeClass('on-type');
        $('.show-cat-chart').addClass('on-type');
        $scope.IsChartVisible = true;
        $scope.IsTableVisible = false;
    };

    $scope.showOverall = function (t) {
        $('.show-tab').removeClass('on-type');
        $('.show-tab-overall').addClass('on-type');
        $scope.IsOverallVisible = true;
        $scope.IsCatsVisible = false;
    };
    $scope.showCats = function (t) {
        $('.show-tab').removeClass('on-type');
        $('.show-tab-cat').addClass('on-type');
        $scope.IsCatsVisible = true;
        $scope.IsOverallVisible = false;
    };
    $scope.polar_30 = {
        //argumentAxis: {
        //    strips: [{
        //        startValue: 'فروردین',
        //        endValue: 'اسفند',
        //        color: "#eee"
        //    },]
        //},
        title: {
            text: 'Occurance of Delays Under 30 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar30Series',

        }
    };
    $scope.polar_30p = {


        title: {
            text: 'Occurance of Delays Over 30 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar30pSeries',

        }
    };
    $scope.polar_180 = {
        title: {
            text: 'Occurance of Delays Over 3 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar180Series',

        }
    };

    $scope.polar_3060 = {

        title: {
            text: 'Occurance of Delays Betweeb 30 to 60 minutes',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar3060Series',

        }
    };

    $scope.polar_60120 = {


        title: {
            text: 'Occurance of Delays Betweeb 1 to 2 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar60120Series',

        }
    };

    $scope.polar_120180 = {

        title: {
            text: 'Occurance of Delays Betweeb 2 to 3 hours',
            font: {
                size: 18,
            }
        },
        commonSeriesSettings: {
            type: "bar"
        },

        size: {
            height: 450,
        },
        margin: {
            top: -20,
            bottom: 0,
            left: 0
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
            rowCount: 1,
            columnCount: 6
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },
        bindingOptions: {
            dataSource: 'polarTimeDs',
            series: 'polar120180Series',

        }
    };
    ///////////////////////////////////////
    $scope.chart_monthly_rpk_instance = null;
    $scope.chart_monthly_rpk = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        onDone: function (e) {

            // e.component.getSeriesByPos(0).getPointByPos($scope.month - 1).select();
            //  e.component.getSeriesByPos(1).getPointByPos($scope.month - 1).select();

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },
            //orientation:'vertical',
        },
        title: {
            //text: $scope.chartMonthlyTitle, //"Used Fuel Per RPK & ASK",
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_rpk_instance)
                $scope.chart_monthly_rpk_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));
                //if (['DL'].indexOf($scope.indexName) != -1)
                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };
                // else
                //    return {
                //        text: (arg.value)
                //     };
            }
        },
        //series: [

        //    { valueField: 'UsedPerPaxKiloDistanceKM', name: 'Per Revenue Passengers(kilo) Kilometers (APK)', showInLegend: true, },
        //    { valueField: 'UsedPerSeatKiloDistanceKM', name: 'Per Available Seats(kilo) Kilometers (ASK)', showInLegend: true, dashStyle: 'dot' },
        //],
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                     
                    return $scope.formatMinutes(this.value);
                    
                }
            },
        },
            {
                name: "total",
                position: "right",
                grid: {
                    visible: true
                },

                label: {
                    customizeText: function () {
                        
                        return $scope.formatMinutes(this.value);
                        
                    }
                },
            }

        ],
        size: {
            height: 450,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'mainSeries',
            'title.text': 'chartMonthlyTitle',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ///////////////////////////////////
    //magu4 chart
    $scope.chart_monthly_catdelay_instance = null;
    $scope.chart_monthly_catdelay = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
         
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },
            
        },
        title: {
             text: 'Delay (Airport,Category)',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_catdelay_instance)
                $scope.chart_monthly_catdelay_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                 
                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };
                 
            }
        },
         
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return $scope.formatMinutes(this.value);

                }
            },
        },
        {
            name: "total",
            position: "right",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return $scope.formatMinutes(this.value);

                }
            },
        }

        ],
        size: {
            height: 450,
        },
        palette:'Harmony Light',
        bindingOptions: {
            "dataSource": "totalCatsDs",
            series: 'catSeries',
             
            'argumentAxis.categories': 'monthNames2'
        }
    };

    $scope.chart_monthly_catdc_instance = null;
    $scope.chart_monthly_catdc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },

        },
        title: {
            text: 'Delay / Performed Cycles (Airport,Category)',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_catdc_instance)
                $scope.chart_monthly_catdc_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return $scope.formatMinutes(this.value);

                }
            },
        },
        {
            name: "total",
            position: "right",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return $scope.formatMinutes(this.value);

                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Harmony Light',
        bindingOptions: {
            "dataSource": "totalCatsDs",
            series: 'catdcSeries',

            'argumentAxis.categories': 'monthNames2'
        }
    };

    $scope.chart_monthly_catoc_instance = null;
    $scope.chart_monthly_catoc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },

        },
        title: {
            text: 'Occurance / Performed Cycles (Airport,Category)',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_catoc_instance)
                $scope.chart_monthly_catoc_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text:  (arg.value)   };

            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return (this.value);

                }
            },
        },
        {
            name: "total",
            position: "right",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return  (this.value);

                }
            },
        }

        ],
        size: {
            height: 500,
        },
        palette: 'Harmony Light',
        bindingOptions: {
            "dataSource": "totalCatsDs",
            series: 'catocSeries',

            'argumentAxis.categories': 'monthNames2'
        }
    };

    $scope.chart_monthly_catocc_instance = null;
    $scope.chart_monthly_catocc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },

        },
        title: {
            text: 'Occurance (Airport,Category)',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_catocc_instance)
                $scope.chart_monthly_catocc_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: (arg.value) };

            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return (this.value);

                }
            },
        },
        {
            name: "total",
            position: "right",
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return (this.value);

                }
            },
        }

        ],
        size: {
            height: 450,
        },
        palette: 'Harmony Light',
        bindingOptions: {
            "dataSource": "totalCatsDs",
            series: 'catoccSeries',

            'argumentAxis.categories': 'monthNames2'
        }
    };

    $scope.chart_monthly_aptdelay_instance = null;
    $scope.chart_monthly_aptdelay = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                font: {
                    weight: 200,
                    size:10,
                }
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            font: {
                size: 10,
            },

        },
        title: {
            text: 'Total Delay (Airport)',
            font: {
                size: 16,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_aptdelay_instance)
                $scope.chart_monthly_aptdelay_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };

            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return $scope.formatMinutes(this.value);

                },
                font: {
                    weight: 100,
                    size:12
                }
            },
        },
        

        ],
        size: {
            height: 260,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'aptDelaySeries',

            'argumentAxis.categories': 'monthNames2'
        }
    };

    $scope.chart_monthly_aptcycle_instance = null;
    $scope.chart_monthly_aptcycle = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
                font: {
                    weight: 200,
                    size: 10,
                }
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            font: {
                size: 10,
            },

        },
        title: {
            text: 'Total Cycles (Airport)',
            font: {
                size: 16,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_aptcycle_instance)
                $scope.chart_monthly_aptcycle_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {

                return { text:  (arg.value)   };

            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {

                    return  (this.value);

                },
                font: {
                    weight: 100,
                    size: 12
                }
            },
        },


        ],
        size: {
            height: 260,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'aptCycleSeries',

            'argumentAxis.categories': 'monthNames2'
        }
    };

    //////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    $scope.chartPanes = [];
    $scope.chart_monthly_rpktotalpanes_instance = null;
    $scope.chart_monthly_rpktotalpanes = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            font: {
                size: 10,
            },
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_rpktotalpanes_instance)
                $scope.chart_monthly_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
        },



        defaultPane: "bottomPane",
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },

        defaultPane: "pax",

        valueAxis: [
            {
                pane: "delay",
                grid: {
                    visible: true
                },
                title: {
                    text: "total delay"
                },
                label: {
                    customizeText: function () {
                        return $scope.formatMinutes(this.value);
                    }
                },
            },
            {
                pane: "delayRatio",
                grid: {
                    visible: true
                },
                title: {
                    text: "per total delay"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            }, {
                pane: "pax",
                grid: {
                    visible: true
                },
                title: {
                    text: "pax(k)"
                },
                label: {
                    customizeText: function () {
                        return (this.value / 1000.0);
                    }
                },
            }
            , {
                pane: "dis",
                title: {
                    text: "distance(km)"
                },
                grid: {
                    visible: true
                },

                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },

            },
            {
                pane: "weight",
                grid: {
                    visible: true
                },
                title: {
                    text: "weight(tone)"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "legs",
                grid: {
                    visible: true
                },
                title: {
                    text: "cycle"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },


        ],
        size: {
            height: 450,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'extraSeries',
            'argumentAxis.categories': 'monthNames2',
            'panes': 'chartPanes',

        }
    };
    /////////////////////////////////
    $scope.chart_monthly_dc_instance = null;
    $scope.chart_monthly_dc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Delay / Total Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_dc_instance)
                $scope.chart_monthly_dc_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));
                //if (['DL'].indexOf($scope.indexName) != -1)
                return { text: $scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };
                // else
                //    return {
                //        text: (arg.value)
                //     };
            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return $scope.formatMinutes(this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'mainSeriesDC',
            //'title.text': 'chartMonthlyTitle',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    /////////////////////////////////
    $scope.chart_monthly_oc_instance = null;
    $scope.chart_monthly_oc = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            font: {
                size: 10,
            },
            //orientation:'vertical',
        },
        title: {
            text: 'Occurence / Total Performed Cycles',
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_oc_instance)
                $scope.chart_monthly_oc_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));
                //if (['DL'].indexOf($scope.indexName) != -1)
                return { text: (arg.value) };
                // else
                //    return {
                //        text: (arg.value)
                //     };
            }
        },

        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    //  if (['DL'].indexOf($scope.indexName) != -1)
                    return (this.value);
                    // else
                    //      return (this.value);
                }
            },
        }

        ],
        size: {
            height: 450,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'mainSeriesOC',
            // 'title.text': 'chartMonthlyTitle',
            'argumentAxis.categories': 'monthNames2'
        }
    };
    ////////////////////////////////////
    $scope.chart_monthly_dcpanes_instance = null;
    $scope.chart_monthly_dcpanes = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            font: {
                size: 10,
            },
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_rpktotalpanes_instance)
                $scope.chart_monthly_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        panes: [
            { name: 'delay' },
            { name: 'legs' },
        ],
        valueAxis: [
            {
                pane: "delay",
                grid: {
                    visible: true
                },
                title: {
                    text: "delay"
                },
                label: {
                    customizeText: function () {
                        return $scope.formatMinutes(this.value);
                    }
                },
            },

            {
                pane: "legs",
                grid: {
                    visible: true
                },
                title: {
                    text: "cycle"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },


        ],
        size: {
            height: 450,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'extraSeriesDC',
            'argumentAxis.categories': 'monthNames2',


        }
    };
    /////////////////////////////////
    $scope.chart_monthly_ocpanes_instance = null;
    $scope.chart_monthly_ocpanes = {
        pointSelectionMode: "multiple",
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },

        legend: {
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            font: {
                size: 10,
            },
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_monthly_rpktotalpanes_instance)
                $scope.chart_monthly_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "MonthName",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        panes: [
            { name: 'occurance' },
            { name: 'legs' },
        ],
        valueAxis: [
            {
                pane: "occurance",
                grid: {
                    visible: true
                },
                title: {
                    text: "occurance"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },

            {
                pane: "legs",
                grid: {
                    visible: true
                },
                title: {
                    text: "cycle"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },


        ],
        size: {
            height: 450,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.airports",
            series: 'extraSeriesOC',
            'argumentAxis.categories': 'monthNames2',


        }
    };
    /////////////////////////////////
    $scope.chart_daily_rpk_instance = null;
    $scope.chart_daily_rpk = {
        pointSelectionMode: "multiple",

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',

        },
        title: {
            //text: $scope.chartDailyTitle, //"Daily Used Fuel Per RPK & ASK",
            font: {
                size: 20,
            },

        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_daily_rpk_instance)
                $scope.chart_daily_rpk_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'spline',
            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            // barWidth: 30,
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.point.data.ArgStr + ': ' + arg.value)
                };
            }
        },
        //series: [

        //    { valueField: 'UsedPerPaxKiloDistanceKM', name: 'Per Revenue Passengers(kilo) Kilometers (APK)', showInLegend: true, },
        //    { valueField: 'UsedPerSeatKiloDistanceKM', name: 'Per Available Seats(kilo) Kilometers (ASK)', showInLegend: true, dashStyle: 'dot' },
        //],
        valueAxis: [{

            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }

        ],
        argumentAxis: {
            type: 'discrete',
        },
        //discrete
        size: {
            height: 500,
        },
        // palette:'Soft Pastel',
        bindingOptions: {
            "dataSource": "ds_daily.items",
            series: 'mainDailySeries',
            'title.text': 'chartDailyTitle',

            //'argumentAxis.categories': 'monthNames2'
        }
    };
    //////////////////////////////////


    $scope.chart_daily_rpktotalpanes_instance = null;
    $scope.chart_daily_rpktotalpanes = {
        pointSelectionMode: "multiple",

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            text: "",
            font: {
                size: 17,
            }
            // subtitle: "as of January 2017"
        },
        commonPaneSettings: {
            backgroundColor: '#ffffff',
            border: { top: true, bottom: true, left: true, right: true, color: '#000000', visible: false }
        },
        commonAxisSettings: {
            label: {
                font: {
                    weight: 800,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
        onInitialized: function (e) {
            if (!$scope.chart_daily_rpktotalpanes_instance)
                $scope.chart_daily_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "Day",
            ignoreEmptyPoints: false,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'black',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    return (this.value);
                },
                visible: false,

            },
            point: { size: 6 }
            // barWidth: 30,
        },



        defaultPane: "bottomPane",
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
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.point.data.ArgStr + ': ' + arg.value)
                };
            }
        },
        //panes: [{
        //    name: "used",
        //}, {
        //    name: "dis"
        //}, {
        //    name: "pax"
        //},],
        defaultPane: "pax",
        //series: [
        //    { valueField: 'DistanceKM', name: 'Distance(KM)', pane: "bl", type: 'spline' },
        //    { valueField: 'TotalPax', name: 'Pax(K)', pane: "pax", type: 'spline' },
        //    { valueField: 'UsedKilo', name: 'Used(K)', pane: "used", type: 'spline' }
        //],
        valueAxis: [{
            pane: "used",
            grid: {
                visible: true
            },
            title: {
                text: "used(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }, {
            pane: "pax",
            grid: {
                visible: true
            },
            title: {
                text: "pax(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value / 1000.0);
                }
            },
        }
            , {
            pane: "dis",
            title: {
                text: "distance(km)"
            },
            grid: {
                visible: true
            },

            label: {
                customizeText: function () {
                    return (this.value);
                }
            },

        },
        {
            pane: "weight",
            grid: {
                visible: true
            },
            title: {
                text: "weight(tone)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        {
            pane: "legs",
            grid: {
                visible: true
            },
            title: {
                text: "cycle"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        {
            pane: "bl",
            grid: {
                visible: true
            },
            title: {
                text: "block-time"
            },
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        },

        ],
        size: {
            height: 500,
        },
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "ds_daily.items",
            series: 'extraDailySeries',
            'panes': 'chartPanes',


        }
    };
    /////////////////////////////////
    $scope.dg_monthly_columns = [

        /*
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
    
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
    
        {
            caption: 'Aircraft', columns: [
                { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 1, sortOrder: 'asc' },
                { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, sortIndex: 2, sortOrder: 'asc' },
            ]
        },
        {
            caption: 'Route',
            columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'Local',
            columns: [
                { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                { dataField: 'TakeoffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
                { dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
    
            ]
        },
        {
            caption: 'UTC',
            columns: [
                { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                { dataField: 'Takeoff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
                { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
            ]
        },
        {
            caption: 'Cockpit',
            columns: [
                { dataField: 'IPSCH', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'IPCode', caption: 'IP Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'P1SCH', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'P1Code', caption: 'P1 Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'P2SCH', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'P2Code', caption: 'P2 Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'PFLRTitle', caption: 'PF L/R', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Fuel',
            columns: [
                { dataField: 'FuelRemaining', caption: 'Remainig', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
                { dataField: 'FuelUplift', caption: 'Uplift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
                { dataField: 'FuelUsed', caption: 'Used', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FuelTotal', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FPFuel', caption: 'Plan', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FuelUnit', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
    
            ]
        },
    
    
    
    
    
    
    
    
    
    
    */


    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_monthly_selected = null;
    $scope.dg_monthly_instance = null;
    $scope.dg_monthly_ds = null;
    $scope.dg_monthly = {
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
        height: 500,

        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_monthly_instance)
                $scope.dg_monthly_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_monthly_selected = null;
            }
            else
                $scope.dg_monthly_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Records</span>"
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

        onCellPrepared: function (options) {
            var data = options.data;
            var column = options.column;
            var fieldHtml = "";
            if (data && options.value && column.dataField.includes('UsedPerPaxKiloDistanceKMDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            //////////////////
            //var fieldData = options.value,
            //    fieldHtml = "";
            //if (fieldData && fieldData.value) {
            //    if (fieldData.diff) {
            //        options.cellElement.addClass((fieldData.diff > 0) ? "inc" : "dec");
            //        fieldHtml += "<div class='current-value'>" +
            //            Globalize.formatCurrency(fieldData.value, "USD") +
            //            "</div> <div class='diff'>" +
            //            Math.abs(fieldData.diff).toFixed(2) +
            //            "  </div>";
            //    } else {
            //        fieldHtml = fieldData.value;
            //    }
            //    options.cellElement.html(fieldHtml);
            //}
        },
        dataSource: [],
        bindingOptions: {
            // "dataSource": "dg_monthly_ds",
            //columns: 'dg_monthly_columns',
        },
        keyExpr: 'Id',
        columnChooser: {
            enabled: false
        },

    };
    ////////////////////////////////
    //sool
    $scope.dg_monthly2_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 120, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left', },
        {
            caption: 'RPK', columns: [
                { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'ASK', columns: [
                { dataField: 'UsedPerSeatKiloDistanceKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                //  { dataField: 'PreUsedPerSeatKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ], visible: false
        },
        {
            caption: 'FTK', columns: [
                { dataField: 'UsedPerWeightToneDistance', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerWeightToneDistance', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerWeightToneDistanceDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FTB', columns: [
                { dataField: 'UsedPerWeightToneBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerWeightToneBlockTime', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerWeightToneBlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FBL', columns: [
                { dataField: 'UsedPerBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerBlockTime', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerBlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FC', columns: [
                { dataField: 'UsedPerLeg', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerLeg', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerLegDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'Used(K)', columns: [
                { dataField: 'UsedKilo', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedKilo', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedKiloDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Cycles', columns: [
                { dataField: 'Legs', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreLegs', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'LegsDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Block Time', columns: [
                { dataField: 'BlockTime2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'PreBlockTime2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'BlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Pax(K)', columns: [
                { dataField: 'TotalPax', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreTotalPax', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'TotalPaxDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Distance(KM)', columns: [
                { dataField: 'Distance', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreDistance', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'DistanceDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Weight(Tone)', columns: [
                { dataField: 'WeightTone', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreWeightTone', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'WeightToneDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },



    ];
    $scope.dg_monthly2_selected = null;
    $scope.dg_monthly2_instance = null;
    $scope.dg_monthly2_ds = null;
    $scope.dg_monthly2 = {
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
        height: 550,

        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_monthly2_instance)
                $scope.dg_monthly2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_monthly2_selected = null;
            }
            else
                $scope.dg_monthly2_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Records</span>"
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

        onCellPrepared: function (options) {
            var data = options.data;
            var column = options.column;
            var fieldHtml = "";
            if (data && options.value && column.dataField.includes('UsedPerPaxKiloDistanceKMDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerWeightToneDistanceDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerWeightToneBlockTimeDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerBlockTimeDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerLegDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedKiloDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('TotalPaxDiff')) {
                var cls = options.value >= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('DistanceDiff')) {
                var cls = 'nut';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
        },
        columns: $scope.dg_monthly2_columns,
        summary: {
            totalItems: [
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "UsedKilo",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
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
                    column: "Legs",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "WeightTone",
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
                {
                    column: "UsedPerPaxKiloDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
                {
                    column: "UsedPerSeatKiloDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
                {
                    column: "UsedPerWeightToneDistance",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
            ],
            calculateCustomSummary: function (options) {
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
            }
        },
        bindingOptions: {
            "dataSource": "dg_monthly2_ds",
            //columns: 'dg_monthly_columns',
        },
        keyExpr: ['Year', 'Month', 'TypeId'],
        columnChooser: {
            enabled: false
        },

    };

    /////////////////////////////////

    $scope.dg_daily_selected = null;
    $scope.dg_daily_instance = null;
    $scope.dg_daily_ds = null;
    $scope.dg_daily = {
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
        height: 500,

        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_daily_instance)
                $scope.dg_daily_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_daily_selected = null;
            }
            else
                $scope.dg_daily_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Records</span>"
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

        onCellPrepared: function (options) {
            //var data = options.data;
            //var column = options.column;
            //var fieldHtml = "";
            //if (data && options.value && column.dataField.includes('UsedPerPaxKiloDistanceKMDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + options.value
            //        + "%"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}

        },
        dataSource: [],

        //keyExpr: 'Id',
        columnChooser: {
            enabled: false
        },

    };
    ////////////////////////////////
    $scope.dg_daily2_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },
        { dataField: 'Day', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 2, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 120, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left', },
        {
            caption: 'RPK', columns: [
                { dataField: 'UsedPerPaxKiloDistanceKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'ASK', columns: [
                { dataField: 'UsedPerSeatKiloDistanceKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                //  { dataField: 'PreUsedPerSeatKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'FTK', columns: [
                { dataField: 'UsedPerWeightDistanceToneKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'FTB', columns: [
                { dataField: 'UsedPerWeightToneBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'FBL', columns: [
                { dataField: 'UsedPerBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'FC', columns: [
                { dataField: 'UsedPerLeg', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'Used(K)', columns: [
                { dataField: 'UsedKilo', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedKilo', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedKiloDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Cycles', columns: [
                { dataField: 'Legs', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreTotalPax', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'TotalPaxDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Block Time', columns: [
                { dataField: 'BlockTime2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                // { dataField: 'PreTotalPax', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'TotalPaxDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Pax(K)', columns: [
                { dataField: 'TotalPax', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreTotalPax', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'TotalPaxDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Distance(KM)', columns: [
                { dataField: 'Distance', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                //{ dataField: 'PreDistance', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'DistanceDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Weight(Tone)', columns: [
                { dataField: 'WeightTone', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                //{ dataField: 'PreDistance', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'DistanceDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },



    ];
    $scope.dg_daily2_selected = null;
    $scope.dg_daily2_instance = null;
    $scope.dg_daily2_ds = null;
    $scope.dg_daily2 = {
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
        height: 500,


        onContentReady: function (e) {
            if (!$scope.dg_daily2_instance)
                $scope.dg_daily2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_daily2_selected = null;
            }
            else
                $scope.dg_daily2_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Records</span>"
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

        onCellPrepared: function (options) {
            //var data = options.data;
            //var column = options.column;
            //var fieldHtml = "";
            //if (data && options.value && column.dataField.includes('UsedPerPaxKiloDistanceKMDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + options.value
            //        + "%"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}

        },

        columns: $scope.dg_daily2_columns,
        bindingOptions: {
            "dataSource": "dg_daily2_ds",
            //columns: 'dg_monthly_columns',
        },
        keyExpr: ['Year', 'Month', 'Day', 'TypeId'],
        summary: {
            totalItems: [
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "UsedKilo",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
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
                    column: "Legs",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "WeightTone",
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
                {
                    column: "UsedPerPaxKiloDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
                {
                    column: "UsedPerSeatKiloDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
                {
                    column: "UsedPerWeightDistanceToneKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },
            ],
            calculateCustomSummary: function (options) {
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
            }
        },
        columnChooser: {
            enabled: false
        },

    };
    ////////////////////////////////
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        height: 550,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        dataSource: {
            fields: [{
                caption: "Month",
                width: 120,
                dataField: "Month",
                area: "row"
            },
            //{
            //caption: "City",
            //dataField: "city",
            //width: 150,
            //area: "row",
            //  selector: function (data) {
            //    return data.city + " (" + data.country + ")";
            //  }
            //},

            {
                dataField: "Type",
                // dataType: "date",
                area: "column"
            },
            {
                caption: "Sales",
                dataField: "UsedKilo",
                dataType: "number",
                summaryType: "sum",
                //format: "currency",
                area: "data"
            }
            ],

        },
        bindingOptions: {
            'dataSource.store': 'total.items'
        }
    };
    /////////////////////////////////
    $scope.prms = null;
    $scope.total = null;
    $scope.month = null;
    $scope.year = null;
    $scope.grouped = null;
    $scope.$on('InitkpiAirport', function (event, prms) {
        $scope.selectedTypes = [];
        $scope.prms = null;
        $scope.total = null;
        $scope.month = null;
        $scope.year = null;
        $scope.grouped = null;  
        $scope.years = null;
        $scope.months = null;
        $scope.chartPanes = [];
        $scope.prms = prms;
        $scope.fieldName = prms.field;
        $scope.indexName = prms.indexName;
        $scope.popup_title = $scope.indexName;

        $scope.chartMonthlyTitle = 'Total Delay';
        $scope.chartPanes.push({ name: 'delayRatio' });
        $scope.chartPanes.push({ name: 'legs' });
        switch ($scope.indexName) {
            case 'RPK':
                $scope.chartMonthlyTitle = 'Used Fuel Per RPK & ASK';
                $scope.chartDailyTitle = 'Daily Used Fuel Per RPK & ASK';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "dis" });
                $scope.chartPanes.push({ name: 'pax' });
                break;
            case 'FTK':
                $scope.chartMonthlyTitle = 'Used Fuel Per Performed Tone-Kilometer';
                $scope.chartDailyTitle = 'Daily Used Fuel Per Performed Tone-Kilometer';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "dis" });
                $scope.chartPanes.push({ name: 'weight' });

                break;
            case 'FTB':
                $scope.chartMonthlyTitle = 'Used Fuel Per Performed Tone-Block Time';
                $scope.chartDailyTitle = 'Daily Used Fuel Per Performed Tone-Block Time';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "bl" });
                $scope.chartPanes.push({ name: 'weight' });

                break;
            case 'FBL':
                $scope.chartMonthlyTitle = 'Used Fuel Per Performed Block Time';
                $scope.chartDailyTitle = 'Daily Used Fuel Per Performed Block Time';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "bl" });


                break;
            case 'FC':
                $scope.chartMonthlyTitle = 'Used Fuel Per Performed Cycles';
                $scope.chartDailyTitle = 'Daily Used Fuel Per Performed Cycles';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "legs" });


                break;
            default:
                break;
        };
        $scope.selectedTypes.push(prms.type.Airport);
      
        $scope.bindCats(prms.type.Airport);
        $scope.total = prms.total;
        $scope.polarTimeDs = prms.polarTimeDs;
        $scope.catNames = prms.catNames;
        if ($scope.selectedCats.length == 0)
            $scope.selectedCats.push('TECHNICAL');

        $scope.month = prms.month;
        $scope.year = prms.year;
        $scope.grouped = prms.grouped;


        //var grouped = Enumerable.From($scope.total.items)
        //    //.GroupBy("$.ArgNum", null, (key, g) => {
        //    .GroupBy(function (item) { return  item.ArgNum+'_'+item.ArgStr  ; }, null, (key, g) => {
        //    return {
        //        Month: key.split('_')[0],
        //        MonthStr: key.split('_')[1],

        //    }
        //}).ToArray();
        //console.log(grouped);

        $scope.popup_visible = true;

    });
    //////////////////////////////

}]);  