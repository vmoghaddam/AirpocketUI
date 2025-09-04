'use strict';
app.controller('stbyController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;

    $scope.search = function () {
        
        $scope.dg_flight_ds = null;
        //var caption = 'From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD');

         //$scope.dt_from, $scope.dt_to
        $scope.loadingVisible = true;
        flightService.getCrewStby($scope.dt_from, $scope.dt_to,'ALL').then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                 
                _d.Duty2 = $scope.formatMinutes(_d.Duty);
                
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        /////////////////////////
        ///////////////////////
    };


    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.search();
        }

    };

    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-7);
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

    $scope.dg_flight_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
       // { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd',   fixed: true, fixedPosition: 'left' },
        //DutyTypeTitle
        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
        //, p.NID
        //, e.PID
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },


        
       


        {
            caption: 'Start', columns: [
                { dataField: 'DateStartLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd',   fixedPosition: 'left' },
                
                { dataField: 'DateStartLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HH:mm', fixedPosition: 'left' },


            ]
        },
        {
            caption: 'End', columns: [

                { dataField: 'DateEndLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', fixedPosition: 'left' },
                { dataField: 'DateEndLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HH:mm', fixedPosition: 'left' },

            ]
        },
         
        { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'right' },

        { dataField: 'IsActivated', caption: 'Activated', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 90 },




    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
        summary: {
            totalItems: [{
                name: "BlockTimeTotal",
                showInColumn: "BlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }, {
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }, {
                name: "JLFlightTimeTotal",
                showInColumn: "JLFlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "JLBlockTimeTotal",
                showInColumn: "JLBlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "FixTimeTotal",
                showInColumn: "FixTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
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

                if (options.name === "JLFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JL_FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLBlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JL_BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        "export": {
            enabled: true,
            fileName: "CREW_TIMES",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Legs</span>"
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
            if (e.data && e.data.IsActivated)
                e.rowElement.css('background', '#66ffcc');

        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };


    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Standby Report';


        $('.stbyreport').fadeIn(400, function () {
            $scope.search();
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('StbyReportLoaded', null);

}]);
