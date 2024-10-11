'use strict';
app.controller('kpiDelayController', ['$scope', '$location', 'personService', 'authService', 'biService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, biService, $routeParams, $rootScope) {
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
    $scope.popup_title = 'RPK';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Details', onClick: function (e) {
                        //  $scope.dg_monthly2_instance.refresh();
                        //magu22
                        $scope.prms.years = $scope.years;
                        var data = $scope.prms;
                        $rootScope.$broadcast('InittblDelay', data);
                          
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
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
            // $scope.rebuild();



            //['RPK'].indexOf($scope.indexName) != -1
            //magu22
            //$scope.dg_monthly2_instance.columnOption('DC', 'visible', ['DC'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD30', 'visible', ['FD30'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD-30', 'visible', ['FD-30'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD30-60', 'visible', ['FD30-60'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD60-120', 'visible', ['FD60-120'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD120-180', 'visible', ['FD120-180'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD180', 'visible', ['FD180'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FD240', 'visible', ['FD240'].indexOf($scope.indexName) != -1);
           
            //$scope.dg_monthly2_instance.columnOption('FTK', 'visible', ['FTK'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FTB', 'visible', ['FTB'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FBL', 'visible', ['FBL'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FC', 'visible', ['FC'].indexOf($scope.indexName) != -1);

            //$scope.dg_monthly2_instance.columnOption('FU', 'visible', ['FU'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FRP', 'visible', ['FRP'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('FP', 'visible', ['FP'].indexOf($scope.indexName) != -1);
            //$scope.dg_monthly2_instance.columnOption('RPB', 'visible', ['RPB'].indexOf($scope.indexName) != -1);

            //$scope.dg_daily2_instance.columnOption('RPK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('ASK', 'visible', ['RPK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FTK', 'visible', ['FTK'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FTB', 'visible', ['FTB'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FBL', 'visible', ['FBL'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FC', 'visible', ['FC'].indexOf($scope.indexName) != -1);

            //$scope.dg_daily2_instance.columnOption('FU', 'visible', ['FU'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FRP', 'visible', ['FRP'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('FP', 'visible', ['FP'].indexOf($scope.indexName) != -1);
            //$scope.dg_daily2_instance.columnOption('RPB', 'visible', ['RPB'].indexOf($scope.indexName) != -1);

            //$scope.dg_monthly2_instance.refresh();
            //$scope.dg_daily2_instance.refresh();
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
        return;
        var sys = $scope.years.join('_');
        var sms = Enumerable.From($scope.months).Select('$.id').ToArray().join('_');
        if (!sys || !sms)
            return;
        $scope.loadingDailyVisible = true;
        biService.getFuelDaily(sys, sms).then(function (response) {
            $scope.loadingDailyVisible = false;
            $scope.ds_daily = response;

            $.each($scope.ds_daily.items, function (_i, _d) {
                //_d['UsedPerPaxKiloDistanceKM' + '_' + _d.Year /*+ '_' + _d.Month*/] = _d.UsedPerPaxKiloDistanceKM;
                //_d['UsedPerSeatKiloDistanceKM' + '_' + _d.Year  ] = _d.UsedPerSeatKiloDistanceKM;
                //_d['TotalPax' + '_' + _d.Year  ] = _d.TotalPax;
                //_d['UsedKilo' + '_' + _d.Year  ] = _d.UsedKilo;
                //_d['DistanceKM' + '_' + _d.Year] = _d.DistanceKM;
                ///////////////////////////////
                //zook
                _d['UsedPerPaxKiloDistanceKM' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerPaxKiloDistanceKM;
                _d['UsedPerSeatKiloDistanceKM' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerSeatKiloDistanceKM;
                _d['UsedPerWeightDistanceToneKM' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerWeightDistanceToneKM;

                _d['UsedPerWeightToneBlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerWeightToneBlockTime;
                _d['UsedPerUpLift' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerUpLift;
                _d['UsedPerFPFuel' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerFPFuel;
                _d['UsedPerPaxBlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerPaxBlockTime;


                _d['UsedPerLeg' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerLeg;
                _d['UsedPerWeightToneBlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerWeightToneBlockTime;
                _d['UsedPerBlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.UsedPerBlockTime;
                _d['TotalPax' + '_' + _d.Year + '_' + _d.Month] = _d.TotalPax;
                _d['UsedKilo' + '_' + _d.Year + '_' + _d.Month] = _d.UsedKilo;
                _d['UpliftKilo' + '_' + _d.Year + '_' + _d.Month] = _d.UpliftKilo;
                _d['DistanceKM' + '_' + _d.Year + '_' + _d.Month] = _d.DistanceKM;
                _d['WeightTone' + '_' + _d.Year + '_' + _d.Month] = _d.WeightTone;
                _d['Legs' + '_' + _d.Year + '_' + _d.Month] = _d.Legs;
                _d['BlockTime' + '_' + _d.Year + '_' + _d.Month] = _d.BlockTime;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d['BlockTime2' + '_' + _d.Year + '_' + _d.Month] = _d.BlockTime2;


                ///////////////////////////////

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




        $scope.bindDaily(function () {
            $scope.dg_daily2_ds = Enumerable.From($scope.ds_daily.items)
                .Where(function (x) { return sys.indexOf(Number(x.Year)) != -1 && smsids.indexOf(Number(x.Month)) != -1; })
                .OrderBy('Number($.Year)')
                .ThenBy('Number($.Month)')
                .ThenBy('Number($.Day)')

                .ToArray();
            /////////////////
            var c_rpk = { caption: 'RPK', columns: [] }
            var c_ask = { caption: 'ASK', columns: [] }
            var c_used = { caption: 'Used(K)', columns: [] };
            var c_pax = { caption: 'Pax(K)', columns: [] };
            var c_dis = { caption: 'Distance(KM)', columns: [] };
            var summary = {
                totalItems: [

                ],
            };

            //$.each(sms, function (_j, _m) {
            $.each(sys, function (_i, _y) {
                c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKMDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
                c_rpk.columns.push({ dataField: 'UsedPerPaxKiloDistanceKM' + '_' + _y /*+ '_' + _m.id*/, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });
                c_ask.columns.push({ dataField: 'UsedPerSeatKiloDistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 });



                c_used.columns.push({ dataField: 'UsedKiloDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
                c_used.columns.push({ dataField: 'UsedKilo' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
                c_pax.columns.push({ dataField: 'TotalPaxDiff' + '_', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
                c_pax.columns.push({ dataField: 'TotalPax' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
                c_dis.columns.push({ dataField: 'DistanceDiff' + '_' + _y, caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80 });
                c_dis.columns.push({ dataField: 'DistanceKM' + '_' + _y, caption: _y, allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 150 });
                summary.totalItems.push(
                    {
                        column: "UsedKilo_" + _y /*+ '_' + _m.id*/,
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
            // });



            //hasrat
            if ($scope.dg_daily_instance) {

                var dg_daily_ds = [];
                $.each(sms, function (_j, _m) {
                    var _dy;
                    for (_dy = 1; _dy <= _m.cnt; _dy++) {
                        var item = { Month: _m.id, ArgStr: _m.title, Day: _dy };
                        $.each(sys, function (_i, _y) {
                            var rec = Enumerable.From($scope.ds_daily.items).Where('$.Year==' + _y + ' && $.Month==' + _m.id + ' && $.Day==' + _dy).FirstOrDefault();
                            //dlui
                            //console.log('SDFSDFSDFSDFSDFSDFSDFSDFSDFSDFSDFSDFSDF');
                            // console.log(rec);
                            item['UsedPerPaxKiloDistanceKMDiff' + '_' + _y /*+ '_' + _m.id*/] = !rec ? null : rec['UsedPerPaxKiloDistanceKMDiff' + '_' + _y /*+ '_' + _m.id*/];
                            item['UsedPerPaxKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerPaxKiloDistanceKM' + '_' + _y/* + '_' + _m.id*/];
                            item['UsedPerSeatKiloDistanceKM' + '_' + _y] = !rec ? null : rec['UsedPerSeatKiloDistanceKM' + '_' + _y];
                            item['UsedKiloDiff' + '_' + _y] = !rec ? null : rec['UsedKiloDiff' + '_' + _y];
                            item['UsedKilo' + '_' + _y] = !rec ? null : rec['UsedKilo' + '_' + _y];
                            item['TotalPaxDiff' + '_' + _y] = !rec ? null : rec['TotalPaxDiff' + '_' + _y];
                            item['TotalPax' + '_' + _y] = !rec ? null : rec['TotalPax' + '_' + _y];
                            item['DistanceDiff' + '_' + _y] = !rec ? null : rec['DistanceDiff' + '_' + _y];
                            item['DistanceKM' + '_' + _y] = !rec ? null : rec['DistanceKM' + '_' + _y];
                        });
                        //console.log(item);
                        dg_daily_ds.push(item);
                    }
                });
                $scope.dg_daily_instance.beginUpdate();
                $scope.dg_daily_instance.option('dataSource', dg_daily_ds);

                $scope.dg_daily_instance.option('summary', summary);
                $scope.dg_daily_instance.endUpdate();


                $scope.dg_daily_instance.beginUpdate();

                $scope.dg_daily_instance.option('columns', []);

                $scope.dg_daily_instance.addColumn(
                    {
                        cellTemplate: function (container, options) {
                            $("<div style='text-align:center'/>")
                                .html(options.rowIndex + 1)
                                .appendTo(container);
                        }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
                    }
                );
                $scope.dg_daily_instance.addColumn({ dataField: 'ArgStr', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left' },);
                $scope.dg_daily_instance.addColumn({ dataField: 'Day', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, minWidth: 70, fixed: true, fixedPosition: 'left' },);
                $scope.dg_daily_instance.addColumn(c_rpk);
                $scope.dg_daily_instance.addColumn(c_ask);
                $scope.dg_daily_instance.addColumn(c_used);
                $scope.dg_daily_instance.addColumn(c_pax);
                $scope.dg_daily_instance.addColumn(c_dis);


                $scope.dg_daily_instance.endUpdate();
                $scope.dg_daily_instance.refresh();
            };

            /////////////
        });



        $scope.mainDailySeries = [];
        $scope.extraDailySeries = [];

        var c = 0;
        $.each(sys, function (_i, _y) {
            $.each(sms, function (_j, _m) {
                var rpkSeries = {
                    year: _y,
                    month: _m.id,

                    valueField: 'UsedPerPaxKiloDistanceKM' + '_' + _y + '_' + _m.id,
                    name: 'RPK(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet1(c),
                };
                var askSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerSeatKiloDistanceKM' + '_' + _y + '_' + _m.id,
                    name: 'ASK(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    dashStyle: 'dot',
                    color: $rootScope.getColorFromSet3(c),
                };
                var ftkSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerWeightDistanceKM' + '_' + _y + '_' + _m.id,
                    name: 'FTK(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var ftbSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerWeightToneBlockTime' + '_' + _y + '_' + _m.id,
                    name: 'FTB(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var fblSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerBlockTime' + '_' + _y + '_' + _m.id,
                    name: 'FBL(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var fcSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerLeg' + '_' + _y + '_' + _m.id,
                    name: 'FC(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var frpSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerPax' + '_' + _y + '_' + _m.id,
                    name: 'FRP(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var fuSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerUpLift' + '_' + _y + '_' + _m.id,
                    name: 'FU(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var fpSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerFPFuel' + '_' + _y + '_' + _m.id,
                    name: 'FP(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };
                var rpbSeries = {
                    year: _y,
                    month: _m.id,
                    valueField: 'UsedPerPaxBlockTime' + '_' + _y + '_' + _m.id,
                    name: 'RPB(' + _y + '-' + _m.title + ')',
                    showInLegend: true,
                    color: $rootScope.getColorFromSet2(c),

                };

                var paxSeries = {
                    year: _y,
                    month: _m.id,
                    name: 'Pax(' + _y + '-' + _m.title + ')', pane: "pax", type: 'bar', valueField: 'TotalPax' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,

                };
                var usedSeries = {
                    year: _y,
                    month: _m.id,
                    name: 'Used(' + _y + '-' + _m.title + ')', pane: "used", type: 'bar', valueField: 'UsedKilo' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,
                };
                var disSeries = {
                    year: _y,
                    month: _m.id,
                    name: 'Distance(' + _y + '-' + _m.title + ')', pane: "dis", type: 'bar', valueField: 'DistanceKM' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,
                };
                var weightSeries = {
                    year: _y,
                    month: _m.id,

                    nname: 'Weight(' + _y + '-' + _m.title + ')', pane: "weight", type: 'bar', valueField: 'WeightTone' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,

                };
                var legSeries = {
                    year: _y,
                    month: _m.id,

                    nname: 'Cycle(' + _y + '-' + _m.title + ')', pane: "legs", type: 'bar', valueField: 'Legs' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,

                };
                var blSeries = {
                    year: _y,
                    month: _m.id,

                    nname: 'Block Time(' + _y + '-' + _m.title + ')', pane: "bl", type: 'bar', valueField: 'BlockTime' + '_' + _y + '_' + _m.id,
                    color: $rootScope.getColorFromSet1(c), showInLegend: false,

                };


                $scope.extraDailySeries.push(paxSeries);
                $scope.extraDailySeries.push(usedSeries);
                $scope.extraDailySeries.push(disSeries);
                $scope.extraDailySeries.push(weightSeries);
                $scope.extraDailySeries.push(legSeries);
                $scope.extraDailySeries.push(blSeries);


                if (['RPK', 'FTK'].indexOf($scope.indexName) != -1) {



                }
                if (['RPK'].indexOf($scope.indexName) != -1) {



                }
                if (['FTK'].indexOf($scope.indexName) != -1) {



                }


                if (['RPK'].indexOf($scope.indexName) != -1) {
                    $scope.mainDailySeries.push(rpkSeries);
                    $scope.mainDailySeries.push(askSeries);
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
                if (['FRP'].indexOf($scope.indexName) != -1) {
                    $scope.mainDailySeries.push(frpSeries);

                }
                if (['FU'].indexOf($scope.indexName) != -1) {
                    $scope.mainDailySeries.push(fuSeries);

                }
                if (['FP'].indexOf($scope.indexName) != -1) {
                    $scope.mainDailySeries.push(fpSeries);

                }
                if (['RPB'].indexOf($scope.indexName) != -1) {
                    $scope.mainDailySeries.push(rpbSeries);

                }
                c++;
            });
        });


    };
    $scope.rebuild = function () {
        //$scope.dg_monthly_columns

        var oyears = Enumerable.From($scope.years).Select('Number($)').OrderBy('$').ToArray();
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
            .Where(function (x) { return oyears.indexOf(Number(x.Year)) != -1 })
            .OrderBy('Number($.Year)')
            .ThenBy('Number($.Month)')

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


        $scope.mainSeries = Enumerable.From($scope.mainSeries).Where(function (x) { return $scope.years.indexOf(x.year) != -1; }).ToArray();
        $scope.extraSeries = Enumerable.From($scope.extraSeries).Where(function (x) { return $scope.years.indexOf(x.year) != -1; }).ToArray();
        $scope.mainSeries = [];
        $scope.extraSeries = [];
        var c = 0;
        //magu3
        $.each(/*newMainSeries*/$scope.years, function (_i, _d) {
            var dlSeries = {
                year: _d,
                valueField: 'Delay' + '_' + _d,
                name: 'Delay(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),
            };
            var dcSeries = {
                year: _d,
                valueField: 'DelayPerLeg' + '_' + _d,
                name: 'DC(' + _d + ')',
                showInLegend: true,
               
                color: $rootScope.getColorFromSet3(c),
            };
            var otfSeries = {
                year: _d,
                valueField: 'OnTimeFlightCount' + '_' + _d,
                name: 'OTF(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var otfcSeries = {
                year: _d,
                valueField: 'OnTimeFlightsPerAll' + '_' + _d,
                name: 'OTFC(' + _d + ')',
                showInLegend: true,
                //color: $rootScope.getColorFromSet2(c),

            };
            //magu26
            var dfcSeries = {
                year: _d,
                valueField: 'DelayedFlightsPerAll' + '_' + _d,
                name: 'DFC(' + _d + ')',
                showInLegend: true,
               // color: $rootScope.getColorFromSet2(c),

            };
            var dotfSeries = {
                year: _d,
                valueField: 'DelayedFlightsPerOnTime' + '_' + _d,
                name: 'DOTF(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
             
            var dfcu30Series = {
                year: _d,
                valueField: 'FltDelayUnder30PerAll' + '_' + _d,
                name: 'DFC-30(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
            var dfco30Series = {
                year: _d,
                valueField: 'FltDelayOver30PerAll' + '_' + _d,
                name: 'DFC+30(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
            var dfc3060Series = {
                year: _d,
                valueField: 'FltDelay3060PerAll' + '_' + _d,
                name: 'DFC30-60(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
            var dfc60120Series = {
                year: _d,
                valueField: 'FltDelay60120PerAll' + '_' + _d,
                name: 'DFC60-120(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
            var dfc120180Series = {
                year: _d,
                valueField: 'FltDelay120180PerAll' + '_' + _d,
                name: 'DFC120-180(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };
            var dfco180Series = {
                year: _d,
                valueField: 'FltDelayOver180PerAll' + '_' + _d,
                name: 'DFC+180(' + _d + ')',
                showInLegend: true,
                // color: $rootScope.getColorFromSet2(c),

            };

            var fd30Series = {
                year: _d,
                valueField: 'FltDelayOver30' + '_' + _d,
                name: 'FD30(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd_30Series = {
                year: _d,
                valueField: 'FltDelayUnder30' + '_' + _d,
                name: 'FD-30(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd180Series = {
                year: _d,
                valueField: 'FltDelayOver180' + '_' + _d,
                name: 'FD180(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd240Series = {
                year: _d,
                valueField: 'FltDelayOver240' + '_' + _d,
                name: 'FD240(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd3060Series = {
                year: _d,
                valueField: 'FltDelay3060' + '_' + _d,
                name: 'FD30-60(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd60120Series = {
                year: _d,
                valueField: 'FltDelay60120' + '_' + _d,
                name: 'FD60-120(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fd120180Series = {
                year: _d,
                valueField: 'FltDelay120180' + '_' + _d,
                name: 'FD120-180(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fblSeries = {
                year: _d,
                valueField: 'UsedPerBlockTime' + '_' + _d,
                name: 'FBL(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fcSeries = {
                year: _d,
                valueField: 'UsedPerLeg' + '_' + _d,
                name: 'FC(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var frpSeries = {
                year: _d,
                valueField: 'UsedPerPax' + '_' + _d,
                name: 'FRP(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fuSeries = {
                year: _d,
                valueField: 'UsedPerUpLift' + '_' + _d,
                name: 'FU(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var fpSeries = {
                year: _d,
                valueField: 'UsedPerFPFuel' + '_' + _d,
                name: 'FP(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };
            var rpbSeries = {
                year: _d,
                valueField: 'UsedPerPaxBlockTime' + '_' + _d,
                name: 'RPB(' + _d + ')',
                showInLegend: true,
                color: $rootScope.getColorFromSet2(c),

            };



            var ontimeSeries = {
                year: _d,
                name: 'On-Time(' + _d + ')', pane: "on-time", type: 'bar', valueField: 'OnTimeFlightCount' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyedu30Series = {
                year: _d,
                name: 'Delayed-30(' + _d + ')', pane: "delayedu30", type: 'bar', valueField: 'FltDelayUnder30' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyedo30Series = {
                year: _d,
                name: 'Delayed+30(' + _d + ')', pane: "delayedo30", type: 'bar', valueField: 'FltDelayOver30' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyed3060Series = {
                year: _d,
                name: 'Delayed30-60(' + _d + ')', pane: "delayed3060", type: 'bar', valueField: 'FltDelay3060' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyed60120Series = {
                year: _d,
                name: 'Delayed60-120(' + _d + ')', pane: "delayed60120", type: 'bar', valueField: 'FltDelay60120' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyed120180Series = {
                year: _d,
                name: 'Delayed120-180(' + _d + ')', pane: "delayed120180", type: 'bar', valueField: 'FltDelay120180' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyedo180Series = {
                year: _d,
                name: 'Delayed+180(' + _d + ')', pane: "delayedo180", type: 'bar', valueField: 'FltDelayOver180' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,

            };
            var delyedSeries = {
                year: _d,
                name: 'Delayed(' + _d + ')', pane: "delayed", type: 'bar', valueField: 'FlightCount' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,
            };
            
            var cycleSeries = {
                year: _d,
                name: 'Cycle(' + _d + ')', pane: "cycle", type: 'bar', valueField: 'AFlightCount' + '_' + _d,
                color: $rootScope.getColorFromSet2($scope.mainSeries.length), showInLegend: false,
            };
            var delaySeries = {
                year: _d,
                name: 'Delay(' + _d + ')', pane: "delay", type: 'bar', valueField: 'Delay' + '_' + _d,

                color: $rootScope.getColorFromSet2(c), showInLegend: false,
            };
            var perAllSeries = {
                year: _d,
                name: $scope.indexName + '/Flts(' + _d + ')', pane: "perall", type: 'spline', valueField: $scope.fieldName + 'PerAll' + '_' + _d,

                color: $rootScope.getColorFromSet2(c), showInLegend: false,
            };
            
            var perDelayedSeries = {
                year: _d,
                name: $scope.indexName + '/Delayed Flts(' + _d + ')', pane: "perdelayed", type: 'spline', valueField: $scope.fieldName + 'PerDelayed' + '_' + _d,
                color: $rootScope.getColorFromSet2(c), showInLegend: false,

            };
            var plannedSeries = {
                year: _d,
                name: 'Planned(' + _d + ')', pane: "planned", type: 'bar', valueField: 'FPFuelKilo' + '_' + _d,
                color: $rootScope.getColorFromSet2(c), showInLegend: false,

            };
            var upliftSeries = {
                year: _d,
                name: 'Uplift(' + _d + ')', pane: "uplift", type: 'bar', valueField: 'UpliftKilo' + '_' + _d,
                color: $rootScope.getColorFromSet2(c), showInLegend: false,

            };

            $scope.extraSeries.push(delaySeries);
            
            $scope.extraSeries.push(delyedSeries);
            $scope.extraSeries.push(delyedu30Series);
            $scope.extraSeries.push(delyedo30Series);
            $scope.extraSeries.push(delyed3060Series);
            $scope.extraSeries.push(delyed60120Series);
            $scope.extraSeries.push(delyed120180Series);
            $scope.extraSeries.push(delyedo180Series);
            $scope.extraSeries.push(ontimeSeries);
            $scope.extraSeries.push(cycleSeries);
            $scope.extraSeries.push(perAllSeries);
            $scope.extraSeries.push(perDelayedSeries);
            //$scope.extraSeries.push(weightSeries);
            //$scope.extraSeries.push(legSeries);
            //$scope.extraSeries.push(blSeries);
            //$scope.extraSeries.push(plannedSeries);
            //$scope.extraSeries.push(upliftSeries);

             


            if (['DL'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(dlSeries);
                
            }
            if (['DC'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(dcSeries);

            }
            if (['OTF'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(otfSeries);

            }
            if (['OTFC'].indexOf($scope.indexName) != -1) {
                otfcSeries.dashStyle = 'solid';
                dfcSeries.dashStyle = 'dot';
                $scope.mainSeries.push(otfcSeries);
                $scope.mainSeries.push(dfcSeries);

            }
            if (['DFC'].indexOf($scope.indexName) != -1) {
                otfcSeries.dashStyle = 'dot';
                dfcSeries.dashStyle = 'solid';
                $scope.mainSeries.push(dfcSeries);
                $scope.mainSeries.push(otfcSeries);

            }
            if (['DOTF'].indexOf($scope.indexName) != -1) {
                 
                $scope.mainSeries.push(dotfSeries);
               

            }
            if (['DFC-30'].indexOf($scope.indexName) != -1) {
                dfc3060Series.dashStyle = 'dot';
                dfc60120Series.dashStyle = 'dot';
                dfc120180Series.dashStyle = 'dot';
                dfco180Series.dashStyle = 'dot';
                dfcu30Series.dashStyle = 'solid';
                $scope.mainSeries.push(dfcu30Series);
                $scope.mainSeries.push(dfc3060Series);
                $scope.mainSeries.push(dfc60120Series);
                $scope.mainSeries.push(dfc120180Series);
                $scope.mainSeries.push(dfco180Series);
                //$scope.mainSeries.push(otfcSeries);

            }
            if (['DFC+30'].indexOf($scope.indexName) != -1) {
                
                dfcu30Series.dashStyle = 'dot';
                dfco30Series.dashStyle = 'solid';
                $scope.mainSeries.push(dfco30Series);
                $scope.mainSeries.push(dfcu30Series);
                

            }
            if (['DFC3060'].indexOf($scope.indexName) != -1) {
                dfc3060Series.dashStyle = 'solid';
                dfc60120Series.dashStyle = 'dot';
                dfc120180Series.dashStyle = 'dot';
                dfco180Series.dashStyle = 'dot';
                dfcu30Series.dashStyle = 'dot';
                $scope.mainSeries.push(dfc3060Series);
                $scope.mainSeries.push(dfcu30Series);
              
                $scope.mainSeries.push(dfc60120Series);
                $scope.mainSeries.push(dfc120180Series);
                $scope.mainSeries.push(dfco180Series);
                

            }
            if (['DFC60120'].indexOf($scope.indexName) != -1) {
                dfc3060Series.dashStyle = 'dot';
                dfc60120Series.dashStyle = 'solid';
                dfc120180Series.dashStyle = 'dot';
                dfco180Series.dashStyle = 'dot';
                dfcu30Series.dashStyle = 'dot';
                $scope.mainSeries.push(dfc60120Series);
                $scope.mainSeries.push(dfcu30Series);
                $scope.mainSeries.push(dfc3060Series);
                $scope.mainSeries.push(dfc120180Series);
                $scope.mainSeries.push(dfco180Series);


            }
            if (['DFC120180'].indexOf($scope.indexName) != -1) {
                dfc3060Series.dashStyle = 'dot';
                dfc60120Series.dashStyle = 'dot';
                dfc120180Series.dashStyle = 'solid';
                dfco180Series.dashStyle = 'dot';
                dfcu30Series.dashStyle = 'dot';
                $scope.mainSeries.push(dfc120180Series);
                $scope.mainSeries.push(dfcu30Series);
                $scope.mainSeries.push(dfc3060Series);
                $scope.mainSeries.push(dfc60120Series);
                
                $scope.mainSeries.push(dfco180Series);


            }
            if (['DFC+180'].indexOf($scope.indexName) != -1) {
                dfc3060Series.dashStyle = 'dot';
                dfc60120Series.dashStyle = 'dot';
                dfc120180Series.dashStyle = 'dot';
                dfco180Series.dashStyle = 'solid';
                dfcu30Series.dashStyle = 'dot';
                $scope.mainSeries.push(dfco180Series);
                $scope.mainSeries.push(dfcu30Series);
                $scope.mainSeries.push(dfc3060Series);
                $scope.mainSeries.push(dfc60120Series);
                $scope.mainSeries.push(dfc120180Series);
               
                 
            }
            if (['FD30'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd30Series);

            }
            if (['FD30'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd30Series);

            }
            //fd_30Series
            if (['FD-30'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd_30Series);

            }
            if (['FD240'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd240Series);

            }
            if (['FD180'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd180Series);

            }
            if (['FD30-60'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd3060Series);

            }
            if (['FD60-120'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd60120Series);

            }
            if (['FD120-180'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fd120180Series);

            }
            if (['FRP'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(frpSeries);

            }
            if (['FU'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fuSeries);

            }
            if (['FP'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(fpSeries);

            }
            if (['RPB'].indexOf($scope.indexName) != -1) {
                $scope.mainSeries.push(rpbSeries);

            }
            c++;

        });
        $scope.rebuildDaily();

    };

    //magu3
    $scope.chart_monthly_rpk_instance = null;
    $scope.chartHeight = $(window).height() - 320;
    $scope.chartHeight2 = $(window).height() - 260;
    $scope.chart_monthly_rpk = {
        pointSelectionMode: "multiple",
        
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {

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
            argumentField: "ArgStr",
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
                if (['DL'].indexOf($scope.indexName) != -1)
                    return { text:$scope.formatMinutes(arg.value) + ', ' + arg.value + ' minutes' };
                else
                return {
                    text: (arg.value)
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
                    if (['DL'].indexOf($scope.indexName) != -1)
                        return $scope.formatMinutes(this.value);
                    else
                    return (this.value);
                }
            },
        }

        ],
        //size: {
        //    height: 550,
        //},
        palette: 'Bright',
        paletteExtensionMode:'Alternate',
        bindingOptions: {
            "dataSource": "total.items",
            series: 'mainSeries',
            'title.text': 'chartMonthlyTitle',
            'argumentAxis.categories': 'monthNames2',
            'size.height':'chartHeight'
        }
    };
    //////////////////////////////////
    $scope.chartPanes = [];
    $scope.chart_monthly_rpktotalpanes_instance = null;
    $scope.chart_monthly_rpktotalpanes = {
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
            if (!$scope.chart_monthly_rpktotalpanes_instance)
                $scope.chart_monthly_rpktotalpanes_instance = e.component;
        },

        commonSeriesSettings: {

            argumentField: "ArgStr",
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

            customizeTooltip: function (arg) {
                //alert(arg.seriesName + " " + (arg.value));

                return {
                    text: (arg.value)
                };
            }
        },
        
        defaultPane: "pax",
        
        valueAxis: [{
            pane: "on-time",
            grid: {
                visible: true
            },
            title: {
                text: "on-time"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }, {
            pane: "delayed",
            grid: {
                visible: true
            },
            title: {
                text: "delayed"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
            },
            {
                pane: "delayedu30",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed -30 mins"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "delayedo30",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed +30 mins"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "delayed3060",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed 30-60 mins"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "delayed60120",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed 1-2 hrs"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "delayed120180",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed 2-3 hrs"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
            {
                pane: "delayedo180",
                grid: {
                    visible: true
                },
                title: {
                    text: "delayed +3 hrs"
                },
                label: {
                    customizeText: function () {
                        return (this.value);
                    }
                },
            },
              {
            pane: "cycle",
            title: {
                text: "cycle"
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
            {
                pane: "perdelayed",
                title: {
                    text: "per delyad flts(%)"
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
                pane: "perall",
                title: {
                    text: "per flts(%)"
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

        ],
        //size: {
        //    height: 550,
        //},
        palette: 'Ocean',
        bindingOptions: {
            "dataSource": "total.items",
            series: 'extraSeries',
            'argumentAxis.categories': 'monthNames2',
            'panes': 'chartPanes',
            'size.height': 'chartHeight'
        }
    };
    //////////////////////////////////
    $scope.chart_daily_rpk_instance = null;
    $scope.chart_daily_rpk = {
        pointSelectionMode: "multiple",
        onDone: function (e) {

            // e.component.getSeriesByPos(0).getPointByPos($scope.month - 1).select();
            //  e.component.getSeriesByPos(1).getPointByPos($scope.month - 1).select();

        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {
            // text: "Daily Used Fuel Per RPK & ASK",
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

    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    
    /////////////////////////////////
    $scope.chart_daily_rpktotalpanes_instance = null;
    $scope.chart_daily_rpktotalpanes = {
        pointSelectionMode: "multiple",
        onDone: function (e) {

            // e.component.getSeriesByPos(0).getPointByPos($scope.month - 1).select();
            // e.component.getSeriesByPos(1).getPointByPos($scope.month - 1).select();
            //  e.component.getSeriesByPos(2).getPointByPos($scope.month - 1).select();

        },
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
        {
            pane: "planned",
            grid: {
                visible: true
            },
            title: {
                text: "planned(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        },
        {
            pane: "uplift",
            grid: {
                visible: true
            },
            title: {
                text: "uplift(k)"
            },
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }


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
    //////////////////////////////////
    //magu23
    $scope.chart_sum_delay = {
        pointSelectionMode: "single",
        
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {

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
                    weight: 500,
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
            if (!$scope.chart_sum_delay_instance)
                $scope.chart_sum_delay_instance = e.component;
        },

        commonSeriesSettings: {
            type: 'stackedBar',
            argumentField: "ArgStr",
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
        series: [

            { valueField: 'Delay30', name: '-30 mins', showInLegend: true, },
            { valueField: 'Delay3060', name: '30-60 mins', showInLegend: true, },
            { valueField: 'Delay60120', name: '1-2 hrs', showInLegend: true, },
            { valueField: 'Delay120180', name: '2-3 hrs', showInLegend: true, },
            { valueField: 'Delay180', name: '+3 hours', showInLegend: true,   },
            //{ valueField: 'BlockTime', name: 'BlockTime', showInLegend: true, },
            
        ],
        valueAxis: [{

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
            height: 350,
        },
        rotated:true,
        palette: ['#ffb3ff', '#ffcc66', '#ff9999', '#ffff00','#802000'],
        //palette:'Bright',
        bindingOptions: {
            "dataSource": "yearSummary",
            
        }
    };

    $scope.chart_sum_bl = {
        pointSelectionMode: "single",

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {

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
                    weight: 500,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },
         
        commonSeriesSettings: {
            type: 'stackedBar',
            argumentField: "ArgStr",
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
        series: [
 
            { valueField: 'BlockTime', name: 'BlockTime', showInLegend: true, color:'#009999' },

        ],
        valueAxis: [{

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
            height: 350,
        },
        palette: "Soft Pastel",
        onPointClick: function (e) {
            


        },
        bindingOptions: {
            "dataSource": "yearSummary",

        }
    };


    $scope.pie_flt = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_bl_instance)
                $scope.pie_bl_instance = e.component;
        },
       // sizeGroup: 'sg1',
        type: "doughnut",
        palette: ['#00cc66', '#ff5c33'],
        // diameter: 0.85,
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function () {
                return { text:   ( this.value) };
            }
        },
        "export": {
            enabled: true
        },
        series: [
 
            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "arg",
                valueField: "value",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            }

        ],
        title: {
            margin: {
                left:30
            },
            font: {
                size:16,
            }
        },
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'pie_bl_ds',
            'title.text':'pie_text',

        }
    };
    $scope.chart_sum_cycle = {
        pointSelectionMode: "single",

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        title: {

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
                    weight: 500,
                    size: 12,
                    family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,
        },
        "export": {
            enabled: true
        },

        commonSeriesSettings: {
            type: 'stackedBar',
            argumentField: "ArgStr",
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

                return { text:   arg.value   };

            }
        },
        series: [

            { valueField: 'OnTimeFlights', name: 'OnTime', showInLegend: true, color: '#00cc66' },
            { valueField: 'DelayedFlights', name: 'Delayed', showInLegend: true, color: '#ff5c33' },

        ],
        valueAxis: [{

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
        onPointClick: function (e) {
            var year = e.target.originalArgument;
            var rec = Enumerable.From($scope.yearSummary).Where('$.Year==' + year).FirstOrDefault();
            $scope.pie_bl_ds = [];
            $scope.pie_bl_ds.push({ arg: 'OnTime', value: rec.OnTimeFlights });
            $scope.pie_bl_ds.push({ arg: 'Delayed', value: rec.DelayedFlights });
            $scope.pie_text = year;
        },
        size: {
            height: 350,
        },
        palette: "Soft Pastel",
        bindingOptions: {
            "dataSource": "yearSummary",

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

    /////////////////////////////////
    //magu3
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
            dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },

        {
            caption: 'DC', columns: [
                { dataField: 'DelayPerLeg', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreDelayPerLeg', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'DelayPerLegDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD30', columns: [
                { dataField: 'FltDelayOver30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelayOver30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelayOver30Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver30PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver30PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD-30', columns: [
                { dataField: 'FltDelayUnder30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelayUnder30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelayUnder30Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayUnder30PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayUnder30PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD180', columns: [
                { dataField: 'FltDelayOver180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelayOver180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelayOver180Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver180PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver180PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD30-60', columns: [
                { dataField: 'FltDelay3060', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelay3060', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelay3060Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay3060PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay3060PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD60-120', columns: [
                { dataField: 'FltDelay60120', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelay60120', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelay60120Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay60120PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay60120PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD120-180', columns: [
                { dataField: 'FltDelay120180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelay120180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelay120180Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay120180PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelay120180PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FD240', columns: [
                { dataField: 'FltDelayOver240', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFltDelayOver240', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FltDelayOver240Diff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver240PerAll', caption: 'Per FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
                { dataField: 'FltDelayOver240PerDelayed', caption: 'Per Del. FLTs', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

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
                { dataField: 'UsedPerWeightDistanceKM', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerWeightDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerWeightDistanceDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        //{
        //    caption: 'FTB', columns: [
        //        { dataField: 'UsedPerWeightToneBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
        //        { dataField: 'PreUsedPerWeightToneBlockTime', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
        //        { dataField: 'UsedPerWeightToneBlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

        //    ], visible: false
        //},
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
                { dataField: 'UsedDiffPerLeg', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FU', columns: [
                { dataField: 'UsedPerUpLift', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerUpLift', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerUpLiftDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'FP', columns: [
                { dataField: 'UsedPerFPFuel', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerFPFuel', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerFPFuelDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'RPB', columns: [
                { dataField: 'UsedPerPaxBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreUsedPerPaxBlockTime', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'UsedPerPaxBlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        
        {
            caption: 'Delay', columns: [
                { dataField: 'Delay2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreDelay2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'DelayDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Cycles', columns: [
                { dataField: 'AFlightCount', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreAFlightCount', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'AFlightCountDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'On-Time', columns: [
                { dataField: 'OnTimeFlightCount', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreOnTimeFlightCount', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'OnTimeFlightCountDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Delayed', columns: [
                { dataField: 'FlightCount', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'PreFlightCount', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                { dataField: 'FlightCountDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
            ]
        },
        {
            caption: 'Block Time', columns: [
                { dataField: 'ABlockTime2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'PreABlockTime2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'ABlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
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
            if (data && options.value && column.dataField.includes('DelayDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            if (data && options.value && column.dataField.includes('DelayPerLegDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            if (data && options.value && column.dataField.startsWith('Flt') && options.value && column.dataField.endsWith('Diff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerWeightDistanceDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerPaxBlockTimeDiff')) {
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

            if (data && options.value && column.dataField.includes('UsedDiffPerLeg')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.includes('UsedPerUpLiftDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            if (data && options.value && column.dataField.includes('UsedPerFPFuelDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            if (data && options.value && column.dataField.includes('UsedPerPaxDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.startsWith('FlightCountDiff')) {
                var cls = options.value <= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }

            if (data && options.value && column.dataField.startsWith('AFlightCountDiff')) {
                var cls = options.value >= 0 ? 'pos' : 'neg';
                fieldHtml += "<div class='" + cls + "'>"
                    + options.value
                    + "%"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol'></i>" : "<i class='fa fa-caret-up fsymbol'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            if (data && options.value && column.dataField.startsWith('OnTimeFlightCountDiff')) {
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
                    column: "UpliftKilo",
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
                    column: "UsedPerWeightDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerBlockTime",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerPax",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerLeg",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerUpLift",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerFPFuel",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerPaxBlockTime",
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
        keyExpr: ['Year', 'Month'],
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

    /////////////////////////////////
    $scope.dg_daily2_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },
        { dataField: 'Day', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, sortIndex: 2, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },

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
            caption: 'FU', columns: [
                { dataField: 'UsedPerUpLift', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxKiloDistanceKM', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerPaxKiloDistanceKMDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ]
        },
        {
            caption: 'FP', columns: [
                { dataField: 'UsedPerFPFuel', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerFPFuel', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedPerFPFuelDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'RPB', columns: [
                { dataField: 'UsedPerPaxBlockTime', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedPerPaxBlockTime', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                //{ dataField: 'UsedPerPaxBlockTimeDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },

            ], visible: false
        },
        {
            caption: 'Used(K)', columns: [
                { dataField: 'UsedKilo', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'PreUsedKilo', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
                // { dataField: 'UsedKiloDiff', caption: 'Inc(%)', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 120 },
            ]
        },
        {
            caption: 'Uplift(K)', columns: [
                { dataField: 'UpliftKilo', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100 },
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
        keyExpr: ['Year', 'Month', 'Day'],
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
                    column: "UpliftKilo",
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
                    column: "UsedPerWeightDistanceKM",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerBlockTime",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerPax",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerLeg",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerUpLift",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerFPFuel",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return data.value ? 'AVG: ' + Number(data.value).toFixed(2) : '';
                    }
                },

                {
                    column: "UsedPerPaxBlockTime",
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
    $scope.prms = null;
    $scope.total = null;
    $scope.month = null;
    $scope.year = null;

    $scope.$on('InitkpiDelay', function (event, prms) {
        $scope.prms = null;
        $scope.total = null;
        $scope.month = null;
        $scope.year = null;
        $scope.years = null;
        $scope.months = null;
        $scope.chartPanes = [];
        $scope.prms = prms;
        $scope.fieldName = prms.field;
        $scope.indexName = prms.indexName;
        $scope.popup_title = $scope.indexName;
        //magu23
        switch ($scope.indexName) {
            case 'DL':
                $scope.chartMonthlyTitle = 'Total Delay';
                $scope.chartDailyTitle = 'Daily Total Delay';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayed" });
                $scope.chartPanes.push({ name: 'on-time' });
                break;
            case 'DC':
                $scope.chartMonthlyTitle = 'Delay(minute) / Total Performed Cycles';
                $scope.chartDailyTitle = 'Daily Delay(minute) / Total Performed Cycles';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delay" });
               
                break;
            case 'OTF':
                $scope.chartMonthlyTitle = 'OnTime Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayed" });
                $scope.chartPanes.push({ name: "delay" });
                break;
            case 'OTFC':
                $scope.chartMonthlyTitle = 'OnTime Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "on-time" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC':
                $scope.chartMonthlyTitle = 'Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "on-time" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DOTF':
                $scope.chartMonthlyTitle = 'Delayed Flights Per On-Time Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "on-time" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC-30':
                $scope.chartMonthlyTitle = '-30 mins Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayedu30" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC+30':
                $scope.chartMonthlyTitle = '+30 mins Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayedo30" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC3060':
                $scope.chartMonthlyTitle = '30-60 mins Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayed3060" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC60120':
                $scope.chartMonthlyTitle = '1-2 hrs Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayed60120" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC120180':
                $scope.chartMonthlyTitle = '2-3 hrs Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayed120180" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'DFC+180':
                $scope.chartMonthlyTitle = '+3 hrs Delayed Flights Per All Performed Flights';
                $scope.chartDailyTitle = 'Daily OnTime Flights';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "delayedo180" });
                $scope.chartPanes.push({ name: "delayed" });
                break;
            case 'FD30':
                $scope.chartMonthlyTitle = 'Flights Delayed +30 minutes';
                $scope.chartDailyTitle = 'Daily Flights Delayed +30 minutes';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FD180':
                $scope.chartMonthlyTitle = 'Flights Delayed +180 minutes';
                $scope.chartDailyTitle = 'Daily Flights Delayed +180 minutes';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FD240':
                $scope.chartMonthlyTitle = 'Flights Delayed +240 minutes';
                $scope.chartDailyTitle = 'Daily Flights Delayed +240 minutes';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FD-30':
                $scope.chartMonthlyTitle = 'Flights Delayed -30 minutes';
                $scope.chartDailyTitle = 'Daily Flights Delayed -30 minutes';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });
                break;
            case 'FD30-60':
                $scope.chartMonthlyTitle = 'Flights Delayed 30 to 60 minutes';
                $scope.chartDailyTitle = 'Daily Flights Delayed 30 to 60 minutes';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FD60-120':
                $scope.chartMonthlyTitle = 'Flights Delayed 1 to 2 hours';
                $scope.chartDailyTitle = 'Daily Flights Delayed 1 to 2 hours';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FD120-180':
                $scope.chartMonthlyTitle = 'Flights Delayed 2 to 3 hours';
                $scope.chartDailyTitle = 'Daily Flights Delayed 2 to 3 hours';
                $scope.chartPanes.push({ name: 'cycle' });
                $scope.chartPanes.push({ name: "perall" });
                $scope.chartPanes.push({ name: 'perdelayed' });

                break;
            case 'FP':
                $scope.chartMonthlyTitle = 'Used Fuel Per Planned Value';
                $scope.chartDailyTitle = 'Daily Used Fuel Per Planned Value';
                $scope.chartPanes.push({ name: 'used' });
                $scope.chartPanes.push({ name: "planned" });


                break;
            default:
                break;
        };
        $scope.total = prms.total;
        $scope.yearSummary = $scope.total.yearSummary;

        $scope.month = prms.month;
        $scope.year = prms.year;

        

        //var grouped = Enumerable.From($scope.total.items)
        //    //.GroupBy("$.ArgNum", null, (key, g) => {
        //    .GroupBy(function (item) { return  item.ArgNum+'_'+item.ArgStr  ; }, null, (key, g) => {
        //    return {
        //        Month: key.split('_')[0],
        //        MonthStr: key.split('_')[1],

        //    }
        //}).ToArray();
        //console.log(grouped);
        var cy = (new persianDate(new Date()).format("YYYY"));
        
        var rec = Enumerable.From($scope.yearSummary).Where('$.Year==' + cy).FirstOrDefault();
        $scope.pie_bl_ds = [];
        $scope.pie_bl_ds.push({ arg: 'OnTime', value: rec.OnTimeFlights });
        $scope.pie_bl_ds.push({ arg: 'Delayed', value: rec.DelayedFlights });
        $scope.pie_text = cy;
        $scope.popup_visible = true;

    });
    //////////////////////////////

}]);  