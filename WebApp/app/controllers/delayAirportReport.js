'use strict';
app.controller('delayAirportReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-30);
     

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
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
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
    $scope.btn_persiandate = {
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
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
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

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

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
    $scope.dg_flight_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'Airport', caption: 'ایستگاه', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110 },
        {
            caption: 'مجموع تمام تاخیرات', alignment: 'center',
            columns: [
                { dataField: 'Delay2', caption: 'hh:mm', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
                { dataField: 'Delay', name: 'Delaymm', caption: 'mm', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140 },

            ]
        },
        {
            caption: 'مجموع تاخیرات بیشتر از 30 دقیقه', alignment: 'center',
            columns: [
                { dataField: 'Delay302', caption: 'hh:mm', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
                { dataField: 'Delay30', name: 'Delay30mm', caption: 'mm', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140 },

            ]
        },
        { dataField: 'Cycle', caption: 'تعداد پرواز', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        {
            caption: 'تاخیر به ازای هر پرواز', alignment: 'center',
            columns: [
                { dataField: 'DC', caption: 'تمام تاخیرات', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,  },
                { dataField: 'DC30', caption: 'تاخیرات بیشتر از 30 دقیقه', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   },

            ]
        },
        {
            caption: 'درصد تاخیرات', alignment: 'center',
            columns: [
                { dataField: 'Ratio', caption: 'تمام تاخیرات', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   },
                { dataField: 'Ratio30', caption: 'تاخیرات بیشتر از 30 دقیقه', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   },

            ]
        },
 



    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        height: $(window).height() - 160,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


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
                {
                    name: "DelayTotal30",
                    showInColumn: "Delay302",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    column: "Delay30mm",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

                {
                    column: "Ratio",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },
                {
                    column: "Ratio30",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return Math.round(data.value);
                    }
                },
                {
                    column: "Cycle",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return  (data.value);
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

                if (options.name === "DelayTotal30") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Delay30;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                



            }
        },
        "export": {
            enabled: true,
            fileName: "Delays_Airports_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>میزان تاخیرات بر اساس ایستگاه</span>"
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
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////

    $scope.delayServiceUrl = $rootScope.serviceUrl;
    $scope.bind = function () {
        $scope.delayServiceUrl = "http://localhost:12271/";
        var dts = [];
        if ($scope.dt_to) {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('dt=' + _dt);
        }
        if ($scope.dt_from) {
            var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('df=' + _df);
        }
        

        var prms = dts.join('&');
        var url = 'api/delays/report/airports';//2019-06-06T00:00:00';
        if (prms)
            url += '?' + prms;

        if (!$scope.dg_flight_ds) {

            $scope.dg_flight_ds = {
                store: {
                    type: "odata",
                    url: $scope.delayServiceUrl + url,
                    key: "Airport",
                    version: 4,
                    onLoaded: function (e) {

                        //dooki
                        $.each(e, function (_i, _d) {
                            _d.Delay2 = $scope.formatMinutes(_d.Delay);
                            _d.Delay302 = $scope.formatMinutes(_d.Delay30);
                            _d.Ratio = Math.round(((_d.Ratio*100) + Number.EPSILON) * 1000) / 1000;
                            _d.Ratio30 = Math.round(((_d.Ratio30 * 100) + Number.EPSILON) * 1000) / 1000;
                        });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);


                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                
            };
        }

        if ($scope.doRefresh) {
            
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };


    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Airport Delays Report';


        $('.delaysairportreport').fadeIn(400, function () {

        });
    }

    $scope.$on('$viewContentLoaded', function () {

        
    });

     

}]);