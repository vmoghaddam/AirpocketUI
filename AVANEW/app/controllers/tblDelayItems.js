'use strict';
app.controller('tblDelayItemsController', ['$scope', '$location', 'personService', 'authService', 'biService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, biService, $routeParams, $rootScope) {

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
    $scope.popup_title = 'Delays';
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
            // $scope.dg_master_instance.columnOption('ICategory', 'visible', $scope.isCat);
            // $scope.dg_master_instance.columnOption('Register', 'visible', $scope.isRegister);
            $scope.bindMaster();
            $scope.dg_master_instance.refresh();


        },
        onHiding: function () {
            $scope.dg_master_ds = [];


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
    $scope.dg_master_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'STDDayPersian', caption: 'Date(P)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, sortIndex: 2, sortOrder: 'asc' },
        {
            caption: 'Route',
            columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'Delay',
            columns: [
                { dataField: 'Delay2', caption: 'hh:mm', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
                { dataField: 'Delay', name: 'Delaymm', caption: 'mm', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
                //{ dataField: 'ICategory', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
                { dataField: 'MapTitle2', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
                { dataField: 'Remark', caption: 'Operator Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
                { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

                { dataField: 'Category', caption: 'IATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },


            ]
        },

        

        {
            caption: 'Dep/Arr',
            columns: [
                { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                { dataField: 'TakeOffLocal', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
                { dataField: 'LandingLocal', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                //   { dataField: 'Delay2', caption: 'Delay', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

            ]
        },
        //{
        //    caption: 'UTC',
        //    columns: [
        //          { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        //          { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
        //          { dataField: 'Takeoff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
        //          { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
        //    ]
        //},


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
        

        columns: $scope.dg_master_columns,
        onContentReady: function (e) {
            if (!$scope.dg_master_instance)
                $scope.dg_master_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_master_selected = null;
            }
            else
                $scope.dg_master_selected = data;


        },
        summary: {
            totalItems: [


                {
                    name: "DelayTotal",
                    showInColumn: "Delay2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "Delaymm",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
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

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
            if (e.rowType === "data" && e.column.dataField == "Delay2")
                e.cellElement.addClass('rptdelayfield');
        },
        bindingOptions: {
            dataSource: 'dg_master_ds',
            height:'dg_height',
        },
        columnChooser: {
            enabled: true
        },

    };
    //////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    ///////////////////////////////
    $scope.bindMaster = function () {
        $scope.loadingVisible = true;
        //(year, month,day,cat,apt)
        biService.getDelayItems($scope.year, $scope.month ? $scope.month : -1, $scope.day ? $scope.day : -1, $scope.cat ? $scope.cat : '-', $scope.apt ? $scope.apt : '-').then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                var std = (new Date(_d.STDDay));
                persianDate.toLocale('en');
                _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                _d.Delay2 = $scope.formatMinutes(_d.Delay);


            });
            $scope.dg_master_ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////////////
    $scope.$on('InittblDelayItems', function (event, prms) {

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
        $scope.day = prms.day;
        $scope.cat = prms.cat;
        $scope.apt = prms.apt;



    });
    /////////////////////////
}]);