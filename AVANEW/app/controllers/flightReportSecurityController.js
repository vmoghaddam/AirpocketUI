'use strict';
app.controller('flightReportSecurityController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    airportService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $scope.InitAddAirport(data);
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'frssearch',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_ds = null;
            $scope.$broadcast('getFilterQuery', null);
        }

    };
    $scope.IsRemarkVisible = false;
    $scope.IsISCCMVisible = false;
    $scope.IsSCCM2Visible = false;
    $scope.IsIPVisible = false;
    $scope.cabinSpan = 3;
    $scope.cockpitSpan =2;

    $scope.buildTable = function () {
        $scope.cabinSpan = 3;
        $scope.cockpitSpan = 2;
        if (!$scope.IsISCCMVisible)
            $scope.cabinSpan--;
        if (!$scope.IsIPVisible)
            $scope.cockpitSpan--;
        $('#tb-container').empty();
        var str = '<table style="width:100%;margin-left:5px;margin-top:20px;" class="jl-table">'
        + '<thead>'
        + '<tr style="background-color:rgba(255,230,153,1) !important;">'
        + '<th rowspan="2">Airline</th>'
        + '<th rowspan="2">Date</th>'
                              + '  <th rowspan="2">Flight No</th>'
                                  + '  <th colspan="2">Route</th>'
                                  + '  <th colspan="2">Local</th>'
                                   + ' <th colspan="2">UTC</th>'
                                  + '  <th colspan="2">Aircraft</th>'
                                   + ' <th colspan="' + $scope.cockpitSpan + '">Cockpit</th>'
        + '<th colspan="' + $scope.cabinSpan + '">Cabin</th>'
        + ($scope.IsRemarkVisible ? ' <th   rowspan="2" class="col-remark">Remark</th>' : '')
        + '</tr>'
        + '<tr style="background-color:rgba(255,230,153,1) !important;">'

        + '    <th>From</th>'
        + '    <th>To</th>'

        + '    <th>Dep.</th>'
        + '    <th>Arr.</th>'
        + '    <th>Dep.</th>'
        + '    <th>Arr.</th>'
        + '    <th>Type</th>'
        + '    <th>Reg</th>'
        + ($scope.IsIPVisible?'    <th  >IP</th>':'')
        + '    <th>CPT</th>'
        + ($scope.IsISCCMVisible ? '    <th  class="col-isccm">ISCCM</th>' : '')
        + '    <th>SCCM1</th>'
        + '    <th   class="col-sccm2">SCCM2</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
        $.each($scope.rows, function (_i, x) {
            str += '<tr>'
                 + '<td>' + x.Airline + '</td>'
                                    + '<td>'+x.STDDay+'</td>'
                                    + '<td>'+x.FlightNumber+'</td>'
                                    + '<td>'+x.FromAirportIATA+'</td>'
                                    + '<td>'+x.ToAirportIATA+'</td>'
                                    + '<td>'+x.DepartureLocal2 +'</td>'
                                    + '<td>'+x.ArrivalLocal2+'</td>'
                                    + '<td>'+x.STD2+'</td>'
                                    + '<td>'+x.STA2+'</td>'
                                    + '<td>'+x.AircraftType+'</td>'
                                    + '<td>'+x.Register+'</td>'

                                    +($scope.IsIPVisible? '<td >' + (x.IP?x.IP:'') + '</td>':'')

            +'<td>' + (x.CPT?x.CPT:'') + '</td>'

                                    + ($scope.IsISCCMVisible?'<td  class="col-isccm">' + (x.ISCCM?x.ISCCM:'') + '</td>':'')

                                    + '<td>' + (x.Purser?x.Purser:'') + '</td>'

                                    + ('<td  class="col-sccm2">' + (x.Purser2?x.Purser2:'') + '</td>')

                                    + ($scope.IsRemarkVisible ?'<td  class="col-remark">'+(x.Remark?x.Remark:'')+'</td>':'')
            + '</tr>';
        });
        str+= '</tbody>'
        + '</table>';
        $('#tb-container').html(str);

    };
    $scope.rows = [];
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 130,
        onClick: function (e) {
            var ds = $scope.dg_instance.getDataSource();
            if (ds) {

                $scope.rows = Enumerable.From($scope.dg_instance.getDataSource()._items).ToArray();
                $.each($scope.rows, function (_i, _d) {
                    _d.DepartureLocal2 = moment(new Date(_d.DepartureLocal)).format('HH:mm');
                    _d.ArrivalLocal2 = moment(new Date(_d.ArrivalLocal)).format('HH:mm');
                    _d.STD2 = moment(new Date(_d.STD)).format('HH:mm');
                    _d.STA2 = moment(new Date(_d.STA)).format('HH:mm');
                });

                var remark = Enumerable.From($scope.rows).Where('$.Remark').FirstOrDefault();
                $scope.IsRemarkVisible = remark;

                $scope.IsISCCMVisible = Enumerable.From($scope.rows).Where('$.ISCCM').FirstOrDefault();
                //if (!$scope.IsISCCMVisible)
                //    $scope.cabinSpan = $scope.cabinSpan - 1;
                $scope.IsSCCM2Visible = Enumerable.From($scope.rows).Where('$.Purser2').FirstOrDefault();
               // if (!$scope.IsSCCM2Visible)
                //    $scope.cabinSpan = $scope.cabinSpan - 1;
                $scope.IsIPVisible = Enumerable.From($scope.rows).Where('$.IP').FirstOrDefault();
            }
            //  var ds = $scope.dg_instance.getDataSource()._items;
            // console.log(ds);

            $scope.popup_sec_visible = true;
        }
    };

    $scope.selected_employee_id = null;
    $scope.btn_flight = {
        text: 'Flights',
        type: 'default',
        icon: 'airplane',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.selected_employee_id = $scope.dg_selected.Id;
            $scope.fillPerson($scope.dg_selected);
            $scope.doSearch = false;
            $scope.popup_flight_visible = true;
        }

    };

    $scope.btn_person = {
        text: 'Details',
        type: 'default',
        icon: 'card',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitViewPerson', data);
        }

    };
    $scope.btn_flight_total = {
        text: 'Flights(Total)',
        type: 'default',
        icon: 'datafield',
        width: 180,

        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_flight_total_visible = true;
        }

    };

    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
        }

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
    ///////////////////////////////////
    $scope.dt_from = new Date();
    $scope.dt_to = new Date().addDays(0);
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
    $scope.filters = [];

    $scope.dg_columns = [

        { dataField: 'Airline', caption: 'Airline', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },


         //{ dataField: 'STDDay', caption: 'Date', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 110, alignment: 'center',format: 'yyyy-MM-dd',   sortIndex: 0, sortOrder: "asc" },
		 { dataField: 'STDDay', caption: 'Date', allowResizing: true, dataType: 'string', allowEditing: false, alignment: 'center', sortIndex: 0, sortOrder: "asc", width: 100 },
        //{ dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,  },
{ dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 70 },


        {
            caption: 'Route', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
                 { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
            ]
        },
         {
             caption: 'Local', columns: [
                 { dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, alignment: 'center', format: 'HH:mm', },
                  { dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, dataType: 'datetime', allowEditing: false, alignment: 'center', format: 'HH:mm', },
             ]
         },
        {
            caption: 'UTC', columns: [

                { dataField: 'STD', caption: 'Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, alignment: 'center', format: 'HH:mm', sortIndex: 2, sortOrder: "asc" },
                 { dataField: 'STA', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'HH:mm' },


            ]
        },
          {
              caption: 'Aircraft', columns: [

                  { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
                   { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: "asc" },
              ]
          },




        {
            caption: 'Cockpit',
            columns: [
                { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
				 { dataField: 'CPT', caption: 'CPT', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },



            ]
        },

          {
              caption: 'Cabin',
              columns: [
                    { dataField: 'ISCCM', caption: 'ISCCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
                    { dataField: 'Purser', caption: 'SCCM1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
                    { dataField: 'Purser2', caption: 'SCCM2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },

              ]
          },



        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: true, width: 200 },





    ];
    //ati
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        wordWrapEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height: $(window).height() - 135,
        editing: {
            allowUpdating: true,
            mode: 'cell'
        },
        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        "export": {
            enabled: true,
            fileName: "FlightReport-Security",
            allowExportSelectedData: false,
            excelWrapTextEnabled: true,
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    /////////////////////////////////
    function printElem($elem) {

        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.


        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');


        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');

        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }
    /////////////////////////////////
    $scope.scroll_sec_height = 200;
    $scope.scroll_sec = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_sec_height', }
    };
    $scope.popup_sec_visible = false;
    $scope.popup_sec_title = 'Security Report';
    $scope.popup_sec = {
        shading: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [




            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        if (!$scope.IsRemarkVisible) {

                            $('.col-remark').addClass('noprint');

                        }
                        else {
                            $('.col-remark').removeClass('noprint');
                        }

                        if (!$scope.IsISCCMVisible) {

                            $('.col-isccm').addClass('noprint');

                        }
                        else {
                            $('.col-isccm').removeClass('noprint');
                        }

                        if (!$scope.IsSCCM2Visible) {

                            $('.col-sccm2').addClass('noprint');

                        }
                        else {
                            $('.col-sccm2').removeClass('noprint');
                        }
                        printElem($('#sec'));

                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_sec_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_sec_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {
            $scope.buildTable();

        },
        onHiding: function () {


            $scope.popup_sec_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sec_visible',

            title: 'popup_sec_title',


        }
    };
    //////////////////////////////////

    ///////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'yyyy-MMM-dd' },
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        {
            caption: 'Route', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
            ]
        },

        {
            caption: 'Departure',
            columns: [

                { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [

                { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
            ]
        },

        {
            caption: 'Times', fixed: true, fixedPosition: 'right', columns: [
              //  { dataField: 'DurationH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dhh', },
              //  { dataField: 'DurationM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dmm', },
                { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                //{ dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]
        },



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
        height: $(window).height() - 235,

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
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime",
                    displayFormat: "{0}",

                    summaryType: "custom"
                }
                ,
                {
                    name: "DutyTotal",
                    showInColumn: "Duty",
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

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ActualFlightHOffBlock * 60 + options.value.ActualFlightMOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    //////////////////////////////////
    $scope.dg_flight_total_columns = [

        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', width: 150, allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', width: 150, allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },




             //   { dataField: 'DurationH', caption: 'Flights HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dhh', },
            //    { dataField: 'DurationM', caption: 'Flights MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dmm', },
        { dataField: 'FlightsCount', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



    ];

    $scope.dg_flight_total_selected = null;
    $scope.dg_flight_total_instance = null;
    $scope.dg_flight_total_ds = null;
    $scope.dg_flight_total = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_flight_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_total_instance)
                $scope.dg_flight_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_total_selected = null;
            }
            else
                $scope.dg_flight_total_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
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

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockH * 60 + options.value.BlockM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_total_ds'
        }
    };
    //////////////////////////////////
    $scope.doRefresh = false;

    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };

    $scope.jgroup = 'Cockpit';
    $scope.sb_group = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: ['Cockpit', 'Cabin'],


        bindingOptions: {
            value: 'jgroup',

        }
    };

    //ati
    $scope.bind = function () {
        var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
        var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;
        flightService.getSecurityRoster(_df, _dt).then(function (response) {

            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Remark = "";
                _d.Airline = 'FlyPersia';
                var std = (new Date(_d.STDDay));
                persianDate.toLocale('en');
                _d.STDDay = new persianDate(std).format("DD-MM-YYYY");
            });
            $scope.dg_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope._bind = function () {
        //iruser558387
        var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
        var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');


        var url = 'odata/flight/report/security?dt=' + _dt + '&df=' + _df;//2019-06-06T00:00:00';
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "ID",
                    version: 4,
                    onLoaded: function (e) {
                        //$.each(e, function (_i, _d) {
                        //    _d.Day1_Duty = pad(Math.floor(_d.Day1_Duty / 60)).toString() + ':' + pad(_d.Day1_Duty % 60).toString();
                        //    _d.Day1_Flight = pad(Math.floor(_d.Day1_Flight / 60)).toString() + ':' + pad(_d.Day1_Flight % 60).toString();

                        //    _d.Day7_Duty = pad(Math.floor(_d.Day7_Duty / 60)).toString() + ':' + pad(_d.Day7_Duty % 60).toString();

                        //    _d.Day14_Duty = pad(Math.floor(_d.Day14_Duty / 60)).toString() + ':' + pad(_d.Day14_Duty % 60).toString();

                        //    _d.Day28_Duty = pad(Math.floor(_d.Day28_Duty / 60)).toString() + ':' + pad(_d.Day28_Duty % 60).toString();
                        //    _d.Day28_Flight = pad(Math.floor(_d.Day28_Flight / 60)).toString() + ':' + pad(_d.Day28_Flight % 60).toString();

                        //    _d.Year_Flight = pad(Math.floor(_d.Year_Flight / 60)).toString() + ':' + pad(_d.Year_Flight % 60).toString();
                        //    _d.CYear_Flight = pad(Math.floor(_d.CYear_Flight / 60)).toString() + ':' + pad(_d.CYear_Flight % 60).toString();
                        //});
                        //dooki
                        $.each(e, function (_i, _d) {
                            _d.Airline = 'FlyPersia';
                            var std = (new Date(_d.STDDay));
                            persianDate.toLocale('en');
                            _d.STDDay = new persianDate(std).format("DD-MM-YYYY");

                        });

                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };



    $scope.getCrewFlights = function (id, df, dt) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            });
            $scope.dg_flight_total_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.popup_flight_df = null;
    $scope.popup_flight_df_instance = null;
    $scope.popup_flight_dt = null;
    $scope.popup_flight_dt_instance = null;
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Flights';


    function printCanvas(canvas) {

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('<style>');
        frameDoc.document.write('*{display: hidden;}');
        frameDoc.document.write('img{display: block; width: 100%; }');
        frameDoc.document.write('</style>');
        frameDoc.document.write('</head><body class="gantt">');

        frameDoc.document.write("<div style='height:100%'><div style='text-align:center;margin-top:30px'>Fly Persia</div><div style='text-align:center;margin-top:10px'>Flights</div><img style='margin-top:10px;height:65%'  src = '" + canvas.toDataURL() + "'/></div>");
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }

    //////////////////////////////
    $scope.popup_flight_total_df = null;
    $scope.popup_flight_total_dt = null;
    $scope.popup_flight_total_visible = false;
    $scope.popup_flight_total_title = 'Flights (Total)';
    $scope.doSearch = false;


    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights';
        $('.flightreportsecurity').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);