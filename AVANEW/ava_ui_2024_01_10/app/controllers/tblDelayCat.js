'use strict';
app.controller('tblDelayCatController', ['$scope', '$location', 'personService', 'authService', 'biService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, biService, $routeParams, $rootScope) {

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
    $scope.isMasterVisible = true;
    $scope.popup_visible = false;
    $scope.popup_title = 'Details of Airport Delays';
    $scope.popup_instance = null;
    $scope.popup = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [
             
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
            $scope.dg_height = $(window).height() - 170;

        },
        onShown: function (e) {
            $scope.bindMaster();
            $scope.dg_master_instance.refresh();


        },
        onHiding: function () {
            $scope.dg_master_ds = [];
            $scope.dg_detail_ds = [];
            $scope.selectedTypes = [];
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
    $scope.bindMaster = function () {

        $scope.dg_master_ds = Enumerable.From($scope.categories)
            .Where(function (x) {
                return $scope.years.indexOf(x.Year) != -1 && $scope.selectedTypes.indexOf(x.ICategory) != -1;
            })
            .ToArray();

    };
    $scope.bindDetail = function () {
        var rows = $rootScope.getSelectedRows($scope.dg_master_instance);
        var keys = Enumerable.From(rows).Select('$.Year.toString()+$.Month.toString()+$.Airport').ToArray();
        $scope.dg_detail_ds = Enumerable.From($scope.catsDs).Where(function (x) {
            var key = x.Year.toString() + x.Month.toString() + x.Airport;
            return keys.indexOf(key) != -1 && $scope.selectedCats.indexOf(x.ICategory) != -1;
        }).ToArray();

       
    };
    $scope.showFlights = function (rec) {
        var data = rec.data;

        var prms = {
            isCat:true,
            cat: data.ICategory,
            
            year: data.Year,
            month: data.Month,
        };

        $rootScope.$broadcast('InittblDelayedFlights', prms);
    };
    $scope.dg_master_columns = [

        {
            dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 85, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'MonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },

        { dataField: 'ICategory', caption: 'Cat', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 125, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        {
            dataField: "Id", caption: '',
            width: 90,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'goFlightsTemplate',
            name: 'goflights',
            fixed: true, fixedPosition: 'left'
            //visible:false,

        },
        {
            caption: 'Cycles', columns: [
                { dataField: 'AFlightCount', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'FlightCount', caption: 'Delayed', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },


            ],
        },
        {
            caption: 'Delay', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 100, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Count', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreCount', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'CountDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },


            ],
        },
        {
            caption: 'Delay / Cycle', columns: [
                { dataField: 'DelayPerLeg2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'PreDelayPerLeg2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'DelayPerLegDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

            ],
        },


        {
            caption: 'Occurance / Cycle', columns: [
                { dataField: 'CountPerLeg', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'PreCountPerLeg', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'CountPerLegDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

            ],
        },
        {
            caption: 'Delays -30 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayUnder30Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayUnder30Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayUnder30TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayUnder30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayUnder30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayUnder30Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },
        {
            caption: 'Delays +30 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayOver30Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver30Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver30TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayOver30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver30Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays +3 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayOver180Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver180Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver180TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayOver180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver180Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 30-60 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay3060Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay3060Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay3060TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay3060', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay3060', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay3060Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 1-2 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay60120Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay60120Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay60120TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay60120', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay60120', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay60120Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 2-3 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay120180Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay120180Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay120180TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay120180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay120180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay120180Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },




    ];
    $scope.dg_master_selected = null;
    $scope.dg_master_instance = null;
    $scope.dg_master_ds = null;
    $scope.hideMaster = function () {
        alert('x');
    };
    $scope.dg_master = {
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,


        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_master_instance)
                $scope.dg_master_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_master_selected = null;
            //}
            //else
            //    $scope.dg_master_selected = data;

            $scope.bindDetail();
        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //                // .addClass("informer")
        //                .append(
        //                    "<span style='color:white;'>Airports</span><a ng-click='hideMaster' href=''>Hide</a>"
        //                );
        //        }
        //    });
        //},
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    template: "titleTemplate"
                },
                //{
                //location: "before",
                //widget: "dxSelectBox",
                //options: {
                //    width: 200,
                //    items: [{
                //        value: "CustomerStoreState",
                //        text: "Grouping by State"
                //    }, {
                //        value: "Employee",
                //        text: "Grouping by Employee"
                //    }],
                //    displayExpr: "text",
                //    valueExpr: "value",
                //    value: "CustomerStoreState",
                //    onValueChanged: function (e) {
                //        dataGrid.clearGrouping();
                //        dataGrid.columnOption(e.value, "groupIndex", 0);
                //        $scope.totalCount = getGroupCount(e.value);
                //    }
                //}
                //},
                //{
                //location: "before",
                //widget: "dxButton",
                //options: {
                //    text: "Collapse All",
                //    width: 136,
                //    onClick: function (e) {
                //        $scope.expanded = !$scope.expanded;
                //        e.component.option({
                //            text: $scope.expanded ? "Collapse All" : "Expand All"
                //        });
                //    }
                //}
                //},
                //{
                //location: "after",
                //widget: "dxButton",
                //options: {
                //    icon: "refresh",
                //    onClick: function () {
                //        dataGrid.refresh();
                //    }
                //}
                //}
            );
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
            //if (data && options.value && column.dataField=='DelayDiff') {
            //    var cls = data.DelayDiff <= 0 ? 'pos' : 'neg';
            //    var sign = "";
            //    if (!(data.DelayDiff == 0 && data.Delay == 0)) {
            //        sign = " <span style='display:inline-block;top:-2px;'> " + data.DelayDiff + "%" + (data.DelayDiff <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>") + " </span>";
            //    }
            //    fieldHtml += "<div class='" + cls + "'>"
            //        //+ options.value
            //        + sign
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}
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
                    + "<span style='font-size:11px'>" + options.value + "%" + "</span>"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }
            //if (data && options.value && column.dataField.includes('DelayPerLegDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + "<span style='font-size:11px'>"+options.value + "%"+"</span>"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}
            //if (data && options.value && column.dataField.includes('DelayDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + "<span style='font-size:11px'>" + options.value + "%" + "</span>"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}

            //if (data && options.value && column.dataField.includes('CountDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + "<span style='font-size:11px'>" + options.value + "%" + "</span>"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}
            //if (data && options.value && column.dataField.includes('CountPerLegDiff')) {
            //    var cls = options.value <= 0 ? 'pos' : 'neg';
            //    fieldHtml += "<div class='" + cls + "'>"
            //        + "<span style='font-size:11px'>" + options.value + "%" + "</span>"
            //        + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
            //        + "</div>";
            //    options.cellElement.html(fieldHtml);
            //}


        },
        columns: $scope.dg_master_columns,
        summary: {
            totalItems: [

                {
                    column: "Count",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },


                //{
                //    column: "AFlightCount",
                //    summaryType: "sum",
                //    customizeText: function (data) {
                //        return  Math.round(data.value);
                //    }
                //},
                //{
                //    column: "FlightCount",
                //    summaryType: "sum",
                //    customizeText: function (data) {
                //        return data.value;
                //    }
                //},

                {
                    column: "DelayUnder30",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "DelayOver30",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "DelayOver180",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "Delay3060",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    name: "Delay2",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayUnder30Time2",
                    showInColumn: "DelayUnder30Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayOver30Time2",
                    showInColumn: "DelayOver30Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayOver180Time2",
                    showInColumn: "DelayOver180Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "Delay3060Time2",
                    showInColumn: "Delay3060Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },




            ],
            calculateCustomSummary: function (options) {

                if (options.name === "Delay2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }




                if (options.name === "DelayUnder30Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayUnder30Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "DelayOver30Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOver30Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "DelayOver180Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOver180Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "Delay3060Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay3060Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            "dataSource": "dg_master_ds",
            "height": "dg_height",
            //columns: 'dg_monthly_columns',
        },
        keyExpr: ['Year', 'Month', 'Airport'],
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_detail_columns = [

        {
            dataField: 'Year', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'Month', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },
        { dataField: 'Airport', caption: 'A/P', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 85, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'ICategory', caption: 'Cat', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 120, fixed: true, fixedPosition: 'left', sortIndex: 3, sortOrder: 'asc' },

        {
            caption: 'Delay', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayAirport2', caption: 'A/P', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayAirportRatio', caption: 'Ratio', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Count', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreCount', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'CountDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },


            ],
        },
        {
            caption: 'Delay / Cycle', columns: [
                { dataField: 'DelayPerLeg2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'PreDelayPerLeg2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'DelayPerLegDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

            ],
        },


        {
            caption: 'Occurance / Cycle', columns: [
                { dataField: 'CountPerLeg', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'PreCountPerLeg', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                { dataField: 'CountPerLegDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

            ],
        },
        {
            caption: 'Delays -30 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayUnder30Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayUnder30Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayUnder30TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayUnder30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayUnder30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayUnder30Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },
        {
            caption: 'Delays +30 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayOver30Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver30Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver30TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayOver30', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver30', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver30Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays +3 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'DelayOver180Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver180Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver180TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'DelayOver180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelayOver180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'DelayOver180Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 30-60 mins', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay3060Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay3060Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay3060TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay3060', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay3060', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay3060Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 1-2 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay60120Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay60120Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay60120TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay60120', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay60120', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay60120Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },

        {
            caption: 'Delays 2-3 hrs', columns: [
                {
                    caption: 'Duration', columns: [
                        { dataField: 'Delay120180Time2', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay120180Time2', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay120180TimeDiff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                    ]
                },
                {
                    caption: 'Occurance', columns: [
                        { dataField: 'Delay120180', caption: 'Current', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'PreDelay120180', caption: 'Past', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },
                        { dataField: 'Delay120180Diff', caption: '%', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: false, fixedPosition: 'right' },

                    ]
                },


            ],
        },



    ];
    $scope.dg_detail_selected = null;
    $scope.dg_detail_instance = null;
    $scope.dg_detail_ds = null;
    $scope.dg_detail = {
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,


        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_detail_instance)
                $scope.dg_detail_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_detail_selected = null;
            }
            else
                $scope.dg_detail_selected = data;


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
                            "<span style='color:white;'>Airports-Categories</span>"
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
                    + "<span style='font-size:11px'>" + options.value + "%" + "</span>"
                    + (options.value <= 0 ? "<i class='fa fa-caret-down fsymbol-small'></i>" : "<i class='fa fa-caret-up fsymbol-small'></i>")
                    + "</div>";
                options.cellElement.html(fieldHtml);
            }



        },
        columns: $scope.dg_detail_columns,
        summary: {
            totalItems: [

                {
                    column: "Count",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },


                {
                    column: "AFlightCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },
                {
                    column: "FlightCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

                {
                    column: "DelayUnder30",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "DelayOver30",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "DelayOver180",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    column: "Delay3060",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },



                {
                    name: "Delay2",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "DelayAirport2",
                    showInColumn: "DelayAirport2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayUnder30Time2",
                    showInColumn: "DelayUnder30Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayOver30Time2",
                    showInColumn: "DelayOver30Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "DelayOver180Time2",
                    showInColumn: "DelayOver180Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },



                {
                    name: "Delay3060Time2",
                    showInColumn: "Delay3060Time2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },




            ],
            calculateCustomSummary: function (options) {

                if (options.name === "Delay2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DelayAirport2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayAirport;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }




                if (options.name === "DelayUnder30Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayUnder30Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "DelayOver30Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOver30Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "DelayOver180Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.DelayOver180Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



                if (options.name === "Delay3060Time2") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay3060Time;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            "dataSource": "dg_detail_ds",
            "height": "dg_height",
            //columns: 'dg_monthly_columns',
        },
        keyExpr: ['Year', 'Month', 'Airport', 'ICategory'],
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.prms = null;
    $scope.total = null;
    $scope.airports = [];

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
    $scope.selectCat = function (t) {

        var exists = $scope.selectedCats.indexOf(t) != -1;
        if (exists) {
            $scope.selectedCats = Enumerable.From($scope.selectedCats).Where('$!="' + t + '"').ToArray();
        }
        else {
            $scope.selectedCats.push(t);
        }
        $scope.bindDetail();

    };
    $scope.selectType = function (t) {
        var exists = $scope.selectedTypes.indexOf(t) != -1;



        if (exists) {
            $scope.selectedTypes = Enumerable.From($scope.selectedTypes).Where('$!="' + t + '"').ToArray();

        }
        else {
            $scope.selectedTypes.push(t);


        }
        $scope.bindMaster();
    };


    $scope.getMasterClass = function () {
        if ($scope.isMaster)
            return "padding-0";
        else
            return "col-lg-6 padding-0";
    };
    $scope.getDetailClass = function () {
        //class="col-lg-6 padding-0"
        if ($scope.isMasterVisible)
            return "col-lg-6 padding-0"
        else
            return "padding-0"
    };
    $scope.isDetailVisible = false;
    $scope.$on('InittblDelayCat', function (event, prms) {
        
        $scope.popup_visible = true;
        $scope.prms = prms.data;
       
        $scope.years = Enumerable.From(prms.years).Select('Number($)').ToArray();
        $scope.selectedTypes = Enumerable.From(prms.initialCats).ToArray();
        $scope.selectedCats = Enumerable.From(prms.initialCats).ToArray();
        $scope.total = $scope.prms.total;
        $scope.categories = $scope.total.categories;
        $scope.grouped = prms.grouped;
        $scope.catNames = prms.catNames;
        $scope.isMaster = prms.isMaster;
        $scope.isDetailVisible = !prms.isMaster;
       // $scope.catsDs = prms.catsDs;
       // $scope.groupedAirportsCats = prms.groupedAirportsCats;
    });
    /////////////////////////
}]);