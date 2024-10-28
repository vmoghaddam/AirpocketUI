'use strict';
app.controller('cabin_reportsController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', 'flightBagService', '$sce', 'neerjaService', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, flightBagService, $sce, neerjaService, $window) {


    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "LOG", id: 'log' },
        { text: "SCC", id: 'scc' },
        { text: "Eval Form", id: 'evalForm' },
        { text: "Equipment", id: 'equepment' },
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




    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',bind 
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

    $scope.btn_sccFill = {
        text: 'Fill',
        type: 'success',
        width: '100%',

        onClick: function (e) {

            console.log('select flight crews', $scope.selectedFlightCrews);
            $scope.bindScc()


        },

    };



    $scope.btn_equpm_fill = {
        text: 'Fill',
        type: 'success',
        width: '100%',

        onClick: function (e) {

            $scope.bind_equip();


        },

    };

    //$scope.scc_report = {
    //    text: 'Print',
    //    type: 'success',
    //    width: '15%',
    //    onClick: function (e) {


    //        $window.open(apixls + 'api/scc/report/' + $scope.entity.crew + '/' + $scope.selectedFlight.FlightId);
    //    }

    //}

    $scope.btn_print = {
        text: 'Print',
        type: 'default',

        width: 120,
        // validationGroup: 'ctrsearch',bind 
        bindingOptions: {},
        onClick: function (e) {
            if ($scope.selectedTabId == 'scc')
                $window.open(apixls + 'api/scc/report/' + $scope.entity.crew + '/' + $scope.selectedFlight.FlightId);
           
        }

    };
    ///////////////////////////////

    $scope.sb_reporter2 = {
        showClearButton: true,
        searchEnabled: false,
        placeholder: '',
        displayExpr: 'Name',
        valueExpr: 'CrewId',
        bindingOptions: {
            value: 'entity.crew2',
            dataSource: 'ds_crew',
        }
    }

    $scope.sb_reporter = {
        showClearButton: true,
        searchEnabled: false,
        placeholder: '',
        displayExpr: 'Name',
        valueExpr: 'CrewId',
        bindingOptions: {
            value: 'entity.crew',
            dataSource: 'ds_crew',
        }
    }


    ///////////////////////////////

    $scope.statusDs = [
        { Id: 1, Title: 'Done' },
        { Id: 2, Title: 'Scheduled' },
        { Id: 3, Title: 'Canceled' },
        { Id: 4, Title: 'Starting' },
        { Id: 5, Title: 'All' },
    ];
    $scope.fstatus = 5;
    $scope.sb_Status = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.statusDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fstatus',


        }
    };

    $scope.ip = null;
    $scope.sb_IP = {
        placeholder: 'IP',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceIP(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'ip',


        }
    };
    $scope.cpt = null;
    $scope.sb_CPT = {
        placeholder: 'Captain',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCaptain(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cpt',


        }
    };

    ///////////////////////////////

    $scope.txt_catering = {
        height: 100,
        bindingOptions: {
            value: 'report.catering_issue',
        }
    }

    $scope.txt_general = {
        height: 100,
        bindingOptions: {
            value: 'report.general_issue',
        }
    }

    $scope.txt_safety = {
        height: 100,
        bindingOptions: {
            value: 'report.safety_issue',
        }
    }


    $scope.txt_tech = {
        height: 100,
        bindingOptions: {
            value: 'report.technical',
        }
    }

    $scope.txt_airport = {
        height: 100,
        bindingOptions: {
            value: 'report.airport_service',
        }
    }



    ///////////////////////////////

    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(0);
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


    ///////////////////////////////

    $scope.formatMinutes = function (mm) {
        if (!mm)
            return "";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };

    $scope.bind = function () {
        var dts = [];
        if ($scope.dt_to) {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('dt=' + _dt);
        }
        if ($scope.dt_from) {
            var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('df=' + _df);
        }
        dts.push('status=' + ($scope.fstatus ? $scope.fstatus : 'null'));
        dts.push('ip=' + ($scope.ip ? $scope.ip : 'null'));
        dts.push('cpt=' + ($scope.cpt ? $scope.cpt : 'null'));
        dts.push('asrvr=' + ($scope.fasrvr ? $scope.fasrvr : 'null'));


        var prms = dts.join('&');

        var url = 'api/applegs';//2019-06-06T00:00:00';
        if ($scope.isOPSStaff)
            url += "/1/";
        else
            url += "/0/";
        if (prms)
            url += '?' + prms;
        $scope.loadingVisible = true;

        flightBagService.getAppLegs(url).then(function (response) {
            $scope.loadingVisible = false;

            $.each(response, function (_i, _d) {
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                if (_d.JLSignedBy) {
                    //$scope.isEditable = false;
                    _d.url_sign = signFiles + _d.PICId + ".jpg";
                    _d.PIC2 = _d.PIC;
                    _d.signDate = moment(new Date(_d.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }

                //    var std = (new Date(_d.STDDay));
                //    persianDate.toLocale('en');
                //    _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                //    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                //    _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                //    _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                //    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);



                //    _d.TaxiTO = subtractDates(_d.Takeoff, _d.ChocksOut);
                //    _d.TaxiLND = subtractDates(_d.ChocksIn, _d.Landing);
                //    _d.TaxiTO2 = $scope.formatMinutes(_d.TaxiTO);
                //    _d.TaxiLND2 = $scope.formatMinutes(_d.TaxiLND);

                //    //magu6
                //    _d.TotalPaxAll = _d.TotalPax + _d.PaxInfant;
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };

    $scope.bindCrews = function (flightId) {
        $scope.selectedFlightCrews = [];


        $scope.loadingVisible = true;
        flightBagService.getAppLegCrews(flightId).then(function (response) {
            $scope.selectedFlightCrews = response;
            $scope.ds_crew = Enumerable.From(response).Where(function (x) {
                return ['CCM', 'SCCM', 'ISCCM'].indexOf(x.JobGroup) != -1;
            }).ToArray();

            console.log('Crew DataSource', $scope.ds_crew);
            $.each(response, function (_i, _d) {
                if (_d.JobGroup == "SCCM")
                    $scope.SCCM = _d;
            });
            $scope.loadingVisible = false;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //$scope.bindCrews = function (flightId) {
    //    $scope.selectedFlightCrews = [];


    //    //$scope.loadingVisible = true;
    //    flightBagService.getAppLegCrews(flightId).then(function (response) {
    //        $scope.selectedFlightCrews = response;
    //        $.each(response, function (_i, _d) {
    //            if (_d.JobGroup == "SCCM")
    //                $scope.SCCM = _d;
    //        });

    //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    //};

    $scope.bind_equip = function () {
        $scope.loadingVisible = true;
        neerjaService.get_pfc_items_grouped_ap($scope.selectedFlight.FlightId, $scope.entity.crew).then(function (response2) {

            $scope.loadingVisible = false;
            $scope.pfc_grouped = response2;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }

    $scope.bindEval = function () {
        $scope.loadingVisible = true;
        neerjaService.get_eval($scope.selectedFlight.FlightId, $scope.entity.crew).then(function (res) {
            $scope.loadingVisible = false;
            $scope.dg_eval_ds = res.Data;
        });
    }

    $scope.bind_equip = function () {
        $scope.loadingVisible = true;


        neerjaService.get_pfc_items_grouped_ap($scope.selectedFlight.FlightId, $scope.entity.crew).then(function (response2) {
            console.log(response2);
            $scope.loadingVisible = false;
            $scope.pfc_grouped = response2;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    }

    $scope.bindScc = function () {
        $scope.loadingVisible = true;
        neerjaService.get_scc($scope.selectedFlight.FlightId, $scope.entity.crew).then(function (response2) {

            $scope.report = response2;
            if (!$scope.report)
                $scope.report = {};
            $scope.loadingVisible = false;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    }

    $scope.item_click = function (item_id, cat_id) {
        var cat = Enumerable.From($scope.pfc_grouped).Where('$.category_id==' + cat_id).FirstOrDefault();
        var item = Enumerable.From(cat.items).Where('$.item_id==' + item_id).FirstOrDefault();
        if (item.is_servicable === 0 || item.is_servicable === false)
            item.is_servicable = 1;
        else if (item.is_servicable === 1 || item.is_servicable === true)
            item.is_servicable = 0;
        else item.is_servicable = 1;
        //  alert();
    }
    $scope.get_item_result = function (item_id, cat_id) {
        var cat = Enumerable.From($scope.pfc_grouped).Where('$.category_id==' + cat_id).FirstOrDefault();
        var item = Enumerable.From(cat.items).Where('$.item_id==' + item_id).FirstOrDefault();
        if (item.is_servicable === 0 || item.is_servicable === false)
            return 'U/S';
        else if (item.is_servicable === 1 || item.is_servicable === true)
            return 'S';
        else return '?';
    }

    $scope.get_item_class = function (item_id, cat_id) {
        var cat = Enumerable.From($scope.pfc_grouped).Where('$.category_id==' + cat_id).FirstOrDefault();
        var item = Enumerable.From(cat.items).Where('$.item_id==' + item_id).FirstOrDefault();
        if (item.is_servicable === 0 || item.is_servicable === false)
            return 'cls_item_us';
        else if (item.is_servicable === 1 || item.is_servicable === true)
            return 'cls_item_s';
        else return 'cls_item_x';
    }


    $scope.btn_evalFill = {
        text: 'Fill',
        type: 'success',
        width: '100%',
        onClick: function (e) {
            $scope.bindEval()
        },
    };
    ///////////////////////////////

    $scope.scroll_equeoment_height = 600;
    $scope.scroll_equeoment = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_equeoment_height', }
    };


    $scope.dg_eval_ds = [];
    $scope.dg_eval_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', minWidth: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { caption: 'نام', dataField: 'Name', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 200 },
        { caption: 'موقیت', dataField: 'position', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { caption: 'وضعیت حضور در بریفینگ', dataField: 'item_1', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { caption: 'نحوه انحام وظایف قبل و هنگام ورود مسافران', dataField: 'item_2', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 130 },
        { caption: 'کیفیت ارائه خدمات و جذب رضایت مسافر', dataField: 'item_3', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 180 },
        { caption: 'کیفیت وظایف ایمنی', dataField: 'item_4', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { caption: 'روحیه همکاری تیمی و حفظ اموال شرکت', dataField: 'item_5', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },
        { caption: 'مجموع نمرات', dataField: 'TotalScore', alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },

    ];

    $scope.dg_eval_selected = null;
    $scope.dg_eval_instance = null;
    $rootScope.dg_eval_ds = null;
    $scope.dg_eval = {


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
        height: $(window).height() - 248,

        columns: $scope.dg_eval_columns,
        onContentReady: function (e) {
            if (!$scope.dg_eval_instance)
                $scope.dg_eval_instance = e.component;

        },

        bindingOptions: {
            dataSource: 'dg_eval_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    $scope.bindEvalCrews = function (flightId) {

        $scope.loadingVisible = true;
        flightService.epGetFlightCrews(flightId).then(function (response) {

            if (response.IsSuccess) {

                // $.each(response.Data, function (_i, _d) {
                //     if (_d.JobGroup == "CCM")
                //         $scope.ds_crew.push(_d);

                //});
                $scope.ds_crew = Enumerable.From(response.Data).Where(function (x) {
                    console.log(x);
                    return
                    1 == 1 || ['CCM', 'SCCM', 'ISCCM'].indexOf(x.JobGroup) != -1;
                }).ToArray();
                $scope.ds_crew = response.Data;
                console.log('bind crfew', $scope.ds_crew);
                //$scope.main_ds = { flight_id: flightId, reporter_id: $rootScope.employeeId, scores: [] };
                $.each($scope.items, function (_i, _item) {
                    $.each($scope.ds_crew, function (_j, _crew) {
                        var obj = {
                            item_id: _item.id,
                            crew_id: _crew.CrewId,
                            item_title: _item.title,
                            flight_id: flightId,
                            score: 0,
                        };
                        $scope.main_ds.scores.push(obj);

                    });


                })
                $scope.loadingVisible = false;
                // $scope.selectedFlightCrews = response.Data;

            }
            else
                $rootScope.processErorrs(response);
            $scope.loadingVisible = false;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };



    $scope.dg_flight_columns = [];
    $scope.dg_flight_columns = [

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 110, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixedPosition: 'left' },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixedPosition: 'left' },
        { dataField: 'P1Name', caption: 'Captain', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },

    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;


    $scope.dg_flight = {
        wordWrapEnabled: false,
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
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 115,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(e);

            if (!data) {
                $scope.dg_flight_selected = null;
                $scope.selectedFlight = null;
                $scope.selectedFlightCrews = [];
            }
            else {
                $scope.dg_flight_selected = data;
                $scope.selectedFlight = data;
                $scope.bindCrews($scope.selectedFlight.FlightId);
            }


        },

        "export": {
            enabled: true,
            fileName: "Flights_Report",
            allowExportSelectedData: false,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Flights</span>"
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


            if (!$scope.isOPSStaff && e.rowType == 'data' && e.data && (e.data.AttASR == 1 || e.data.AttVoyageReport == 1)) {
                e.rowElement.css('background', '#d9d9d9');
            }

        },

        onCellPrepared: function (e) {
            if (!$scope.isOPSStaff && e.rowType === "data" && e.column.dataField == "FlightNumber")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
            if (e.rowType === "data" && e.column.dataField == "AttVoyageReport" && e.data.AttVoyageReport == 1) {
                if (!e.data.VR_OPSStaffStatusId)
                    e.cellElement.css('background', '#ff6600');
                if (e.data.VR_OPSStaffStatusId == 1)
                    e.cellElement.css('background', '#66ccff');
                if (e.data.VR_OPSStaffStatusId == 2)
                    e.cellElement.css('background', '#00ff99');
            }

            if (e.rowType === "data" && e.column.dataField == "AttASR" && e.data.AttASR == 1) {
                if (!e.data.ASR_OPSStaffStatusId)
                    e.cellElement.css('background', '#ff6600');
                if (e.data.ASR_OPSStaffStatusId == 1)
                    e.cellElement.css('background', '#66ccff');
                if (e.data.ASR_OPSStaffStatusId == 2)
                    e.cellElement.css('background', '#00ff99');
            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: true
        },

    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Cabin Reports';


        $('.reportEFB').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        $('.tabc').height($(window).height() - 150);
        $('#rightColumn').height($(window).height() - 220);
        $('#rightColumn2').height($(window).height() - 175);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);


    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };

}]);