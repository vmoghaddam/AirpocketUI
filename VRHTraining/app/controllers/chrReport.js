'use strict';
app.controller('chrReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'flightService', '$window', function ($scope, $location, $routeParams, $rootScope, courseService, authService, flightService, $window) {
    $scope.prms = $routeParams.prms;


    var tabs = [
        { text: "Details", id: 'details' },
        //{ text: "Teachers", id: 'teacher' },

    ];
    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {
        //if ($scope.dg_course_instance) {
        //    $scope.dg_course_instance.columnOption("ExpireStatus", "visible", newValue == 0);
        //    $scope.dg_course_instance.columnOption("Remain", "visible", newValue == 0);

        //    $scope.dg_course_instance.columnOption("IsLast", "visible", newValue == 1);
        //    $scope.dg_course_instance.columnOption("IsFirst", "visible", newValue == 1);

        //}
        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            if (newValue == 'course')
                $scope.dg_course_instance.repaint();
            //$scope.dg_education_instance.repaint();
            //$scope.dg_file_instance.repaint();
            //$scope.dg_exp_instance.repaint();
            //$scope.dg_rating_instance.repaint();
            //$scope.dg_aircrafttype_instance.repaint();

            //var myVar = setInterval(function () {

            //    var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
            //    scl.scrollTo({ left: 0 });
            //    var scl2 = $("#dg_file").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
            //    var scl3 = $("#dg_exp").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
            //    var scl4 = $("#dg_rating").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl4.scrollTo({ left: 0 });
            //    var scl5 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });

            //    clearInterval(myVar);
            //}, 100);




            //$scope.btn_visible_education = newValue == 1;


            //$scope.btn_visible_file = newValue == 2;
            //$scope.btn_visible_experience = newValue == 3;
            //$scope.btn_visible_rating = newValue == 4;
            //$scope.btn_visible_aircrafttype = newValue == 5;

            //$scope.btn_visible_course = newValue == 7;



        }
        catch (e) {

        }
    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

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


    $scope.chr_ds = null;
    $scope.chr_id = -1;
    $scope.sb_chr = {
        showClearButton: true,
        searchEnabled: true,
        placeholder:'Charterer',
        //dataSource: $rootScope.getDatasourceOption(1136),
        displayExpr: "Title1",
        valueExpr: 'Id',
        searchExpr: ["Title1", "Title2", "Code", "NiraCode"],
        onSelectionChanged: function (e) {
            $scope.chr.Code = null;
            if (e.selectedItem) {
                $scope.chr.Code = e.selectedItem.Code;


            }
        },
        bindingOptions: {
            dataSource: 'chr_ds',
            value: 'chr_id',


        }
    };

    $scope.inst1 = null;
    $scope.sb_inst1 = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",
        placeholder: 'Instructor 1',
        onSelectionChanged: function (e) {


        },
        bindingOptions: {
            value: 'inst1',
            dataSource: 'ds_teachers'
        }

    };

    $scope.inst2 = null;
    $scope.sb_inst2 = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",
        placeholder: 'Instructor 2',
        onSelectionChanged: function (e) {


        },
        bindingOptions: {
            value: 'inst2',
            dataSource: 'ds_teachers'
        }

    };
    $scope.bindChrs = function () {
        $scope.loadingVisible = true;
        flightService.getCharterers().then(function (response) {
            $scope.chr_ds = response;
            $scope.loadingVisible = false;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.status = null;
    $scope.sb_status = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: [{ Id: 1, Title: 'Scheduled' }, { Id: 2, Title: 'In Progress' }, { Id: 3, Title: 'Done' }, { Id: 4, Title: 'Canceled' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        placeholder: 'Status',
        bindingOptions: {
            value: 'status',

        }
    };


    $scope.rank = 1;
    $scope.sb_rank = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: [{ Id: -1, Title: 'All' }, { Id: 1, Title: 'Last' },],
        displayExpr: "Title",
        valueExpr: 'Id',
        placeholder: 'Rank',
        bindingOptions: {
            value: 'rank',

        }
    };

    $scope.result = null;
    $scope.resultText = null;
    $scope.sb_result = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ id: -1, title: 'UNKNOWN' }, { id: 0, title: 'FAILED' }, { id: 1, title: 'PASSED' }],
        displayExpr: "title",
        valueExpr: 'id',
        placeholder: 'Result',
        onSelectionChanged: function (e) {

        },
        bindingOptions: {
            value: 'result',
            text: 'resultText',
        }
    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 130,

        bindingOptions: {},
        onClick: function (e) {

            $scope.bind();
        }

    };
    $scope.btn_export = {
        text: 'Export',
        type: 'success',

        width: 130,

        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_course_instance.exportToExcel(false);
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


    $scope.dg_course_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        {
            caption: 'Flight', columns: [
                { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', },
                { dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
                { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

            ]
            , fixed: true, fixedPosition: 'left'
        },
        {
            caption: 'DEP/ARR', columns: [
                { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
                { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
                { dataField: 'DepartureLocal', caption: 'DEP', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 1, sortOrder: 'asc' },
                { dataField: 'ArrivalLocal', caption: 'ARR', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

            ]
             
        },
        {
            caption: 'REG', columns: [
                { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },
                { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, },

            ]

        },
        {
            caption: 'PAX', columns: [
                { dataField: 'PaxAdult', caption: 'FLT Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'PaxChild', caption: 'FLT Child.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'PaxInfant', caption: 'FLT Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
            ]

        },
        {
            caption: 'Charterer', columns: [
              
                { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
                { dataField: 'Capacity', caption: 'Capacity', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Adult', caption: 'Adult',name:'Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Child', caption: 'Child.', name: 'Child', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'Infant', caption: 'Infant', name: 'Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
               
                { dataField: 'Total', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'TotalRev', caption: 'Rev.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
                { dataField: 'TotalPax', caption: 'FLT Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, },
                { dataField: 'TotalPaxRev', caption: 'FRL Rev. Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, },
                { dataField: 'RevPercent', caption: '%', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
                { dataField: 'Title1', caption: 'Charterer', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300, },
            ]

        },
      
      
      
       
       

       


    ];

    $scope.dg_course_instance = null;
    $scope.dg_course_ds = null;
    $scope.dg_course = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 155,

        columns: $scope.dg_course_columns,
        onContentReady: function (e) {
            if (!$scope.dg_course_instance)
                $scope.dg_course_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_course_selected = null;

            }
            else {
                $scope.dg_course_selected = data;

            }



        },
        //2022-01-22
        onRowPrepared: function (e) {
            if (e.data) {
                if (e.data.TotalRev > e.data.Capacity)
                    e.rowElement.css('background', '#ffb3b3');
            }
               

            
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
                    column: "TotalRev",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Total",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Adult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Child",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Infant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
            ]
        },
        bindingOptions: {
            dataSource: 'dg_course_ds',

        }
    };
    $scope.showImage = function (item) {

        var data = { url: item.url, caption: item.caption };

        $rootScope.$broadcast('InitImageViewer', data);
    };
    $scope.styleCell = function (e, value, status) {
        if (!value && status) {
            e.cellElement.css("backgroundColor", "#80ffcc");
            e.cellElement.css("color", "#000");
            return;
        }
        if (value && value == 1000000) {
            //#a6a6a6

            return;
        }
        if (value > 45) {
            e.cellElement.css("backgroundColor", "#80ffcc");
            e.cellElement.css("color", "#000");
            return;
        }

        //#80ffcc

        if ((!value && value !== 0) || value == -100000) {
            //#a6a6a6
            e.cellElement.css("backgroundColor", "#d9d9d9");
            e.cellElement.css("color", "#000");
            return;
        }
        if (value > 30 && value <= 45) {
            e.cellElement.css("backgroundColor", "#ffd633");
            e.cellElement.css("color", "#000");
        }
        else if (value > 0 && value <= 30) {
            e.cellElement.css("backgroundColor", "#ffa64d");
            e.cellElement.css("color", "#000");
        }
        else if (value <= 0) {
            e.cellElement.css("backgroundColor", "#ff471a");
            e.cellElement.css("color", "#fff");
        }
        //e.cellElement.css("backgroundColor", "#ffcccc");
    }

    $scope.bind = function () {
        if ($scope.selectedTab.id == 'details') {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
            var _df = moment($scope.dt_from).format('YYYY-MM-DD');
            var result = !$scope.result && $scope.result != -1 ? -2 : $scope.result;

            //df, dt,  ct,   status,   cstatus,   cls,   pid
            $scope.loadingVisible = true;
            flightService.getCharterersReport(_df, _dt, $scope.chr_id ? $scope.chr_id : -1).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_course_ds = (response );

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Charteres Report';
        $('.chrreport').fadeIn();
        $scope.bindChrs();
    }
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);

