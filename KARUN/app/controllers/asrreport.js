'use strict';
app.controller('asrreportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$q', '$http', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route,$q, $http) {
    authService.setModule(3);
    $scope.prms = $routeParams.prms;

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        
        { text: "Air Safety Reports", id: 'errors' },

    ];

    $scope.$watch("selectedTabIndex", function (newValue) {
         
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'calendar':
                    $scope.bindCrew();
                    break;
                case 'route':

                    break;
                case 'register':

                    break;
                case 'errors':
                    $scope.bindASRs();
                    break;

                default:
                    break;
            }
            if ($scope.dg_errors_instance)
                $scope.dg_errors_instance.refresh();
            if ($scope.dg_crew_instance)
                $scope.dg_crew_instance.refresh();
        }
        catch (e) {

        }

    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

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
    //////////////////////////////////
    $scope.btn_refresh = {
        text: 'Show Report',
        type: 'success',
        
        width: 200,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_errors_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: $scope.dg_selected.FlightId };

            $rootScope.$broadcast('InitAsrAdd', data);
           // $scope.bindASR($scope.dg_selected.FlightId);

        }

    };
    ////////////////////////////////
    $scope.refresh = function () {
        $scope.dg_errors_ds = null;
        $scope.calendarDs = [];
        $scope.currentCalendar = null;
        switch ($scope.selectedTabId) {
            case 'calendar':
                $scope.bindCrew();
                break;
            case 'route':

                break;
            case 'register':

                break;
            case 'errors':
                $scope.bindErrors();
                break;

            default:
                break;
        }
    };
    ////////////////////////////////
    $scope.dg_regroute_columns = [

        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
         
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yyyy-MM-dd', fixed: true, fixedPosition: 'left' },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yyyy-MM-dd', fixed: true, fixedPosition: 'left' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'yyyy-MM-dd', fixed: true, fixedPosition: 'left' },
        
        { dataField: 'FlightNumber', caption: 'FLT NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left'},
        {
            caption: 'Route', columns: [
                { dataField: 'FromAirportIATA', caption: 'Origin', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'ToAirportIATA', caption: 'Destination', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
            ], fixed: true, fixedPosition: 'left'
        },
        {
            caption: 'MVT',
            columns: [
               
                //BlockOff
                { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HHmm', },
                //TakeOff
                { dataField: 'TakeOff', caption: 'T/O', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HHmm', },
                //Landing
                { dataField: 'Landing', caption: 'LND', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HHmm', },
                //BlockOn
                { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HHmm', },

            ]
        },
        {
            caption: 'Cockpit', columns: [
                { dataField: 'IPScheduleName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', },
                { dataField: 'P1ScheduleName', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', },
                { dataField: 'P2ScheduleName', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left', },
            ]
        },
        {
            caption: 'Summary',
            columns: [
                { dataField: 'OccurrenceDate', caption: 'Occurance', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yyyy-MM-dd HHmm', },
                
                { dataField: 'FlightPhase', caption: 'Flight Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsSecurityEvent', caption: 'Security Event', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsAirproxATC', caption: 'Airprox/ATC', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsTCASRA', caption: 'TCASRA', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsWakeTur', caption: 'Wake Turbulence', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsBirdStrike', caption: 'Bird Strike', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsOthers', caption: 'Others', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                
                
               
            ]
        }
        ////sortIndex: 2, sortOrder: 'asc'
 
        //{ dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left', },
        //{ dataField: 'CourseCode', caption: 'Course Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300, fixed: false, fixedPosition: 'left', },
        //{
        //    caption: 'Session', columns: [
        //        { dataField: 'SessionDateFrom', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', },
        //        { dataField: 'SessionDateFrom', caption: 'Begin', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
        //        { dataField: 'SessionDateTo', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
        //    ]
        //},
        //{
        //    caption: 'Interrupted By', columns: [
        //        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', },
        //        { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', },
        //        { dataField: 'DutyStart', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', },
        //        { dataField: 'DutyStart', caption: 'Begin', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
        //        { dataField: 'RestUntil', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
        //    ]
        //},
        ////{ dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm',  },


    ];
    $scope.dg_errors_selected = null;
    $scope.dg_errors_instance = null;
    $scope.dg_errors_ds = null;
    $scope.dg_errors = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
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
        height: $(window).height() - 180,

        columns: $scope.dg_regroute_columns,
        onContentReady: function (e) {
            if (!$scope.dg_errors_instance)
                $scope.dg_errors_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_errors_selected = null;
            }
            else
                $scope.dg_errors_selected = data;


        },

        //"export": {
        //    enabled: true,
        //    fileName: "Financial_Monthly_Register_Route_Report",
        //    allowExportSelectedData: false
        //},
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //                // .addClass("informer")
        //                .append(
        //                    "<span style='color:white;'>Flights</span>"
        //                );
        //        }
        //    });
        //},
        //onExporting: function (e) {
        //    e.component.beginUpdate();
        //    e.component.columnOption("row", "visible", false);
        //},
        //onExported: function (e) {
        //    e.component.columnOption("row", "visible", true);
        //    e.component.endUpdate();
        //},
        onRowPrepared: function (e) {
            if (e.data && e.data.IsVisited == 0) {
                e.rowElement.css('font-weight', 'bold');
                e.rowElement.css('background', '#fff3e6');
            }

        },


        bindingOptions: {
            dataSource: 'dg_errors_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.dg_crew_columns = [


        { dataField: 'IsCockpit', caption: 'Cockpit', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'desc' },
        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },

        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 150, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 170, fixed: false, fixedPosition: 'left', sortIndex: 3, sortOrder: 'asc' },




    ];
    $scope.dg_crew_selected = null;
    $scope.dg_crew_instance = null;
    $scope.dg_crew_ds = null;
    $scope.dg_crew = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
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
        height: $(window).height() - 147,

        columns: $scope.dg_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_instance)
                $scope.dg_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_selected = null;
            }
            else
                $scope.dg_crew_selected = data;

            $scope.bindCalendar();
        },



        bindingOptions: {
            dataSource: 'dg_crew_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    var _getASRs = function () {

        var deferred = $q.defer();
        $http.get('https://fleet.caspianairlines.com/fbservicea/api/asr/query').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getASR = function (id) {

        var deferred = $q.defer();
        $http.get('https://fleet.caspianairlines.com/fbservicea/api/asr/flight/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    $scope.bindASR = function (id) {
        $scope.loadingVisible = true;
        _getASR(id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.ASR = response.Data;
            alert('x');
            console.log('ASR', $scope.ASR);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindASRs = function () {
        //if ($scope.dg_errors_ds)
        //    return;
         $scope.loadingVisible = true;
        _getASRs().then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_errors_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindCrew = function () {

        if ($scope.dg_crew_ds) {
            $scope.bindCalendar();
            return;
        }
        $scope.loadingVisible = true;
        flightService.getCrewsLight().then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.IsCockpit = _d.JobGroupCode.startsWith('00101') ? 1 : 0;

            });
            $scope.dg_crew_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindCalendar = function () {
        if (!$scope.dg_crew_selected) {
            $scope.currentCalendar = null;
            return;
        }

        $scope.currentCalendar = Enumerable.From($scope.calendarDs).Where('$.CrewId==' + $scope.dg_crew_selected.Id).FirstOrDefault();

        if (!$scope.currentCalendar) {
            $scope.loadingVisible = true;
            flightService.getCrewTrainigDuties($scope.dg_crew_selected.Id).then(function (response) {
                $scope.loadingVisible = false;
                if (response) {
                    $scope.calendarDs.push(response);
                    $scope.currentCalendar = response;
                }
                else {
                    $scope.calendarDs.push({ CrewId: $scope.dg_crew_selected.Id, rows: [] });
                    $scope.currentCalendar = { CrewId: $scope.dg_crew_selected.Id, rows: [] };
                }



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.calendarDs = [];
    $scope.currentCalendar = null;
    ///////////////////////////////////
    $scope._toDate = function (dt) {
        return moment(dt).format("YYYY-MM-DD");
    };
    $scope._toTime = function (dt) {
        return moment(dt).format("HH:mm");
    };
    //////////////////////////////////
   
        $rootScope.page_title = '> ASR';


        $('.training').fadeIn(400, function () {

        });
     
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });



}]);