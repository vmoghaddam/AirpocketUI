'use strict';
app.controller('reportFlightPaxController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $window) {
    $scope.prms = $routeParams.prms;
    


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
    /////////////////////////////////////////
    
    
    $scope.bind = function () {
        

        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        
        $scope.loadingVisible = true;

        flightService.getFlightPaxDailyReport(_df, _dt).then(function (response) {
            $scope.loadingVisible = false;

            $.each(response, function (_i, _d) {

                //_d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                


            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //////////////////////////
        ///////////////////////////
        ////////////////////////////

        return;
        

        if ($scope.doRefresh) {
            
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };



    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(0);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        onValueChanged:function(e){
		
		},
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',
 onValueChanged:function(e){
		
		},
        bindingOptions: {
            value: 'dt_to',

        }
    };
    ///////////////////////////////////
   
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
    $scope.dg_flight_columns = [];

    $scope.dg_flight_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },

        
        { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
        
		{caption:'Date', alignment: 'center',columns:[
		 { dataField: 'Date', caption: 'AD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: false, fixedPosition: 'left' },
			
        { dataField: 'PDate', caption: 'Shamsi', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
			
		],fixed: true, fixedPosition: 'left'},
       
        { dataField: 'FlightNumber', caption: 'NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left' },
       // { dataField: 'AircraftType', caption: 'AC TYPE', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 1, sortOrder: 'asc' },
        
        { dataField: 'FromAirportIATA', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80,fixed: true, fixedPosition: 'left' },
        { dataField: 'ToAirportIATA', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80,fixed: true, fixedPosition: 'left' },
		{ dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 2, sortOrder: 'asc' },
		{caption:'STD',alignment: 'center',columns:[
		{ dataField: 'STDLocal', caption: 'LOCAL', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', sortIndex: 3, sortOrder: 'asc',name:'std_local' },
			{ dataField: 'STD', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', sortIndex: 4, sortOrder: 'asc',name:'std_utc' },
		]},
		{caption:'STA',alignment: 'center',columns:[
		  { dataField: 'STALocal', caption: 'LOCAL', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' ,name:'sta_local'},
			{ dataField: 'STA', caption: 'UTC', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' ,name:'sta_utc'},
		]},
			
		{ dataField: 'ChocksOut', caption: 'OffBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm',name:'offblock_utc' },
		{ dataField: 'Takeoff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm',name:'takeoff_utc' },
		{ dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm',name:'landing_utc' },
		{ dataField: 'ChocksIn', caption: 'OnBlock', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm',name:'onblock_utc' },
        

        {
            caption: 'Pax-RES', columns: [
                { dataField: 'RES_Adult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'RES_Child', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'RES_Infant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, }
            ]
        },
		{
            caption: 'Pax-STN', columns: [
                { dataField: 'STN_Adult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'STN_Child', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'STN_Infant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, }
            ]
        },
		{
            caption: 'Pax-CHR', columns: [
                { dataField: 'CHR_Adult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'CHR_Child', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'CHR_Infant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, }
            ]
        },
		{
            caption: 'Pax-FOC', columns: [
                { dataField: 'FOC_Adult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'FOC_Child', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'FOC_Infant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, }
            ]
        },
		{
            caption: 'Pax-OA', columns: [
                { dataField: 'OA_Adult', caption: 'ADL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'OA_Child', caption: 'CHD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'OA_Infant', caption: 'INF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, }
            ]
        },
		{ dataField: 'Total_Rev', caption: 'Rev Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        { dataField: 'Total_Pax', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
		
		{ dataField: 'Cargo', caption: 'Cargo', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		{ dataField: 'Baggage', caption: 'Baggage', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		
		{ dataField: 'FSG', caption: 'FSG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		{ dataField: 'WCR', caption: 'WCR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		{ dataField: 'MOC', caption: 'MOC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		{ dataField: 'ACM', caption: 'ACM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
		
        
        { dataField: 'ChrTitle', caption: 'Charterer', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },
        
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
        paging: { pageSize: 500 },
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
            totalItems: [
                {
                    column: "row",
                    summaryType: "count",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                


                {
                    column: "RES_Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "RES_Adult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "RES_Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "RES_Child",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "RES_Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "RES_Infant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
				{
                    column: "STN_Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "STN_Adult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "STN_Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "STN_Child",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "STN_Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "STN_Infant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
				{
                    column: "CHR_Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "CHR_Adult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "CHR_Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "CHR_Child",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "CHR_Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "CHR_Infant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
				{
                    column: "FOC_Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "FOC_Adult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "FOC_Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "FOC_Child",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "FOC_Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "FOC_Infant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
				{
                    column: "OA_Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "OA_Adult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "OA_Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "OA_Child",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "OA_Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "OA_Infant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "Total_Pax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Total_Pax",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "Total_Rev",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Total_Rev",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                
                {
                    column: "Cargo",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                
                {
                    column: "Baggage",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                

            ]
            
        },
        "export": {
            enabled: true,
            fileName: "FlightsPax_Report",
            allowExportSelectedData: false,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>FlightsPax</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
            e.component.columnOption("rn", "visible", true);


        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            

            if (e.rowType == 'data' && e.data) {
                e.data['RN'] = e.rowIndex + 1;
            }
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
    



    ///////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights Pax Report';


        $('.reportflightpax').fadeIn(400, function () {
           
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);