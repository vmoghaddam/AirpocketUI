'use strict';
app.controller('formbController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    var isTaxiVisible = false;
    //if ($rootScope.userName.toLowerCase() == 'ashrafi')
    //    isTaxiVisible = true;
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
    $scope.btn_year = {
        text: 'Yearly Report',
        type: 'default',

        width: 200,

        bindingOptions: {},
        onClick: function (e) {

            $window.open('#!/citypair/yearly/', '_blank');
        }
    };

    $scope.btn_print = {
        text: 'PRINT',
        type: 'default',

        width: 150,

        bindingOptions: {},
        onClick: function (e) {


            $window.open(reportServer + '?type=b&year=' + $scope.year + '&qrt=' + ($scope.month), '_blank');
            //$scope.bindReport();

            //$scope.popup_print_visible = true;
        }
    };


    $scope.DOMINT = -1;
    $scope.sb_dom = {
        placeholder: 'DOM/INT',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Id: -1, Title: 'All' }, { Id: 1, Title: 'DOM' }, { Id: 0, Title: 'INT' }],
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'DOMINT',


        }
    };
    /////////////////////////////////////////
    $scope.bind = function () {
        //iruser558387
        var dts = [];

        if ($scope.year)
            dts.push('year=' + $scope.year);
        // if ($scope.month)
        dts.push('qrt=' + ($scope.month + 1));




        var prms = dts.join('&');


        var url = 'odata/formb/report';//2019-06-06T00:00:00';
        if (prms)
            url += '?' + prms;

        if (!$scope.dg_flight_ds) {

            $scope.dg_flight_ds = {
                store: {
                    type: "odata",
                    //serviceBaseV2
                    url: apiLog + url,
                    //key: "Id",
                    version: 4,
                    onLoaded: function (e) {

                        //dooki
                        $.each(e, function (_i, _d) {

                            var std = (new Date(_d.STDDay));
                            persianDate.toLocale('en');
                            _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                            _d.Delay2 = $scope.formatMinutes(_d.Delay);


                        });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);


                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-30);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

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
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
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
    ////////////////////////////////////




    //////////////////////////////////
    $scope.dg_flight_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        {
            caption: 'City - Pair', alignment: 'center',
            columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        
        { dataField: 'Legs', caption: 'Number of Flights', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 250 },


       

        {
            caption: 'Revenue Traffic', alignment: 'center',
            columns: [
                { dataField: 'RevPax', caption: 'Passengers (number)', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, minWidth: 200 },
                { dataField: 'FreightTone', caption: 'Freight (tonnes)', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, minWidth: 200 },
                { dataField: 'Mail', caption: 'Mail (tonnes)', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, minWidth: 200 },


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
        height: $(window).height() - 140,

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
       
        "export": {
            enabled: true,
            fileName: "Financial_Daily_Report",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'></span>"
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
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: true
        },

    };
    //////////////////////////////////


    /////////////////////////////
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 200 },

    };

    $scope.year = 2022;
    $scope.month = Math.floor(((new Date()).getMonth() + 3) / 3);
    $scope.sb_year = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2022],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'year',


        }
    };
    $scope.qrtDs = [{ id: 1, title: 'JAN-FEB-MAR' }, { id: 2, title: 'APR-MAY-JUN' }, { id: 3, title: 'JUL-AUG-SEP' }, { id: 4, title: 'OCT-NOV-DEC' }];
    $scope.sb_qrt = {
        placeholder: 'Quarter',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.qrtDs,
        displayExpr: 'title',
        valueExpr: 'id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'month',


        }
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Form B';


        $('.formb').fadeIn(400, function () {
            $scope.year = Number((new Date()).getFullYear());
             
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);