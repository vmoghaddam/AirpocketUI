'use strict';
app.controller('tblDelayedFlightController', ['$scope', '$location', 'personService', 'authService', 'biService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, biService, $routeParams, $rootScope) {



    
    $scope.dg_master_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            dataField: 'PYear', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 85, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc',
            lookup: {
                dataSource: $scope.ds_year,

            }
        },
        { dataField: 'PMonth', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 1, sortOrder: 'asc', visible: false },
        {
            dataField: 'PMonthName', caption: 'Month', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: $scope.monthNames2,

            }
        },

        { dataField: 'FlightNumber', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 90, fixed: true, fixedPosition: 'left', },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 80, fixed: true, fixedPosition: 'left', },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 80, fixed: true, fixedPosition: 'left', },
        { dataField: 'ICategory', caption: 'Cat', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 130, fixed: true, fixedPosition: 'left', },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100, fixed: true, fixedPosition: 'left', },
        { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
        {
            caption: 'Departure', columns: [
                { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'DepartureLocal', caption: 'Actl', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
            ],
        },
        {
            caption: 'Arrival', columns: [
                { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm', },
                { dataField: 'ArrivalLocal', caption: 'Actl', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 80, format: 'HH:mm',   },
            ],
        },
        {
            caption: 'Duration', columns: [
                { dataField: 'FlightTime2', caption: 'F/L', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,   },
                { dataField: 'BlockTime2', caption: 'B/L', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,   },
            ],
        },
       
        




    ];
    $scope.dg_master_selected = null;
    $scope.dg_master_instance = null;
    $scope.dg_master_ds = null;

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
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: [],
        onContentReady: function (e) {
            if (!$scope.dg_master_instance)
                $scope.dg_master_instance = e.component;

        },
        onSelectionChanged: function (e) {


            $scope.bindDetail();
        },

        "export": {
            enabled: true,
            fileName: "File",
            allowExportSelectedData: false
        },

        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    template: "titleTemplate"
                },

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
        columns: $scope.dg_master_columns,
        summary: {
            totalItems: [
                {
                    column: "row",
                    summaryType: "count",
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


                 



            }
        },
        bindingOptions: {
            "dataSource": "dg_master_ds",
            "height": "dg_height",
            //columns: 'dg_monthly_columns',
        },
        // keyExpr: ['Year', 'Month', 'Airport'],
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_detail_columns = [

        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
       
        { dataField: 'Categoty', caption: 'Cat', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left',  },
        { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'numer', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'desc', },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth:300 },
        



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
                            "<span style='color:white;'>Items</span>"
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
                    column: "row",
                    summaryType: "count",
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

                 



            }
        },
        bindingOptions: {
            "dataSource": "dg_detail_ds",
            "height": "dg_height",
            //columns: 'dg_monthly_columns',
        },
        // keyExpr: ['Year', 'Month', 'Airport', 'ICategory'],
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
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

    $scope.popup_visible = false;
    $scope.popup_title = 'Delayed Flights';
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

            $scope.dg_height = $(window).height() - 170;

        },
        onShown: function (e) {
            $scope.dg_master_instance.columnOption('ICategory', 'visible', $scope.isCat);
            $scope.dg_master_instance.columnOption('Register', 'visible', $scope.isRegister);
            $scope.bindMaster();
            $scope.dg_master_instance.refresh();


        },
        onHiding: function () {
            $scope.dg_master_ds = [];
            $scope.dg_detail_ds = [];

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

        $scope.loadingDailyVisible = true;
        if ($scope.isCat) {
            biService.getDelayedFlightCats($scope.year, $scope.month,$scope.cat, $scope.airportId, $scope.min, $scope.max).then(function (response) {
                $scope.loadingDailyVisible = false;
                $.each(response, function (_i, _d) {
                    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                });
                $scope.dg_master_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else if ($scope.isRegister) {
            biService.getDelayedFlightCatRegister($scope.year, $scope.month, 'TECHNICAL', $scope.register, -1, $scope.min, $scope.max).then(function (response) {
                $scope.loadingDailyVisible = false;
                $.each(response, function (_i, _d) {
                    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                });
                $scope.dg_master_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else {
            biService.getDelayedFlights($scope.year, $scope.month, $scope.airportId, $scope.min, $scope.max).then(function (response) {
                $scope.loadingDailyVisible = false;
                $.each(response, function (_i, _d) {
                    _d.Delay2 = $scope.formatMinutes(_d.Delay);
                    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                });
                $scope.dg_master_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
       

    };
    $scope.bindDetail = function () {
        var rows = $rootScope.getSelectedRows($scope.dg_master_instance);
        var row = rows[0];
        $scope.loadingDailyVisible = true;
        biService.getFlightDelays(row.FlightId).then(function (response) {
            $scope.loadingDailyVisible = false;
            $.each(response, function (_i, _d) {
                _d.Delay2 = $scope.formatMinutes(_d.Delay);
                
            });
            $scope.dg_detail_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////////
    $scope.$on('InittblDelayedFlights', function (event, prms) {
        
        $scope.popup_visible = true;
        $scope.prms = prms;
       
        if (!prms.title)
            $scope.popup_title = prms.title;
        $scope.airport = prms.airport;
        $scope.airportId = prms.airportId;
        $scope.min = prms.min;
        $scope.max = prms.max;
        if (!$scope.airportId)
            $scope.airportId = -1;
        if (!$scope.min)
            $scope.min = -1;
        if (!$scope.max)
            $scope.max = -1;
        $scope.cat = prms.cat;
        $scope.isCat = prms.isCat;
        $scope.register = prms.register;
        $scope.isRegister = prms.isRegister;
        $scope.year = prms.year;
        $scope.month = prms.month;
        


    });
    /////////////////////////
}]);