'use strict';
app.controller('fdpsflyController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window) {
    $scope.Operator = $rootScope.CustomerName.toUpperCase();
    $scope.firstHour = new Date(General.getDayFirstHour(new Date()));
    $scope.editable = true;
    $scope.isAdmin = $route.current.isAdmin || true;

    $scope.bottom = 385 + 50;
    $scope.prms = $routeParams.prms;
    $scope.footerfilter = true;
    var detector = new MobileDetect(window.navigator.userAgent);

    $scope.IsMobile = detector.mobile() ? true : false;
    $scope.IsLandscape = $(window).width() > $(window).height();
    authService.setModule(3);
    $scope.tabsdatevisible = false;
    //////////////////////////////////////
    $scope.selectedTabDetIndex = -1;
    $scope.selectedTabDetId = null;
    $scope.tabsdet = [
        { text: "FDPs", id: 'FDPs' },
        // { text: "Flights", id: 'Flights' },
        { text: "Crew", id: 'Crew' },

    ];
    $scope.$watch("selectedTabDetIndex", function (newValue) {
        //ati
        try {
            $('.tabdet').hide();
            var id = $scope.tabsdet[newValue].id;
            $scope.selectedTabDetId = id;
            $('#' + id).fadeIn();
        }
        catch (e) {

        }

    });
    //tabsdetoptions
    $scope.tabsdetoptions = {
        scrollByContent: true,
        showNavButtons: true,
        elementAttr: {
            // id: "elementId",
            class: "tabsdetoptions"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDetIndex = -1;
            $scope.selectedTabDetIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabsdet", deep: true },
            selectedIndex: 'selectedTabDetIndex'
        }

    };
    /////////////////////////////////////////
    $scope.formatMinutes = function (mm) {

        if (!mm)
            return "00:00";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    ////////////////////////////////////
    $scope.dt_fromSearched = new Date();
    $scope.dt_toSearched = new Date().addDays(0);
    $scope._datefrom = new Date();


    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '130px',
        displayFormat: "yyyy-MM-dd",
        adaptivityEnabled: true,
        //  pickerType: 'rollers',
        onValueChanged: function (arg) {
            //$scope.search();
        },
        bindingOptions: {
            value: '_datefrom',

        }
    };
    $scope.days_count = 2;
    $scope.num_days = {
        min: 1,
        showSpinButtons: false,
        bindingOptions: {
            value: 'days_count',

        }
    };


    $scope.fillCrew = function () {


        var _dt = moment($scope.dt_fromSearched).format('YYYY-MM-DDTHH:mm:ss');

        var d2 = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _d2 = moment(d2).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;
        flightService.getCrewForRosterByDate(1, _dt).then(function (response) {

            $scope.loadingVisible = false;

            $scope.ds_crew = response;
            console.log($scope.ds_crew);
            //$scope.updateFlightsDsInit();
            $.each($scope.ds_crew, function (_i, crw) {

                //var _cflts = $scope.getCrewFlightsObj(crw.Id);
                var _cfltsSum = 0;//Enumerable.From(_cflts).Sum('$.FlightTime');


                crw.isFtl = false;
                crw.CurrentFlightsTime = _cfltsSum;

                crw.RosterFlights = crw.Flight28 + _cfltsSum;
                crw.RosterFlightsStr = $scope.formatMinutes(crw.RosterFlights);



            });




            $scope.crewDuties = [];
            //flightService.rosterDuties({},_dt, _d2).then(function (response) {
            //    $.each(response, function (_k, _o) {
            //        var _dty = Enumerable.From($scope.ds_crew).Where('$.Id==' + _o.crewId).FirstOrDefault();
            //        if (_dty)
            //            _o.ScheduleName = _dty.ScheduleName;
            //    });
            //    $scope.crewDuties = (response);

            //    $scope.btnGanttDisabled = false;
            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.search = function () {
        $scope.stop();
        $scope.StopUTimer();
        $scope.bindFlights(function () {
            $scope.fillCrew();

            $scope.createGantt();
            $scope.initSelection();
            $scope.getRosterFDPs(function (ds) { });







        });
    };
    $scope.btn_search_mobile = {
        text: '',
        type: 'success',
        icon: 'search',
        width: 40,
        validationGroup: 'flightboarddate',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            //yati
            $scope.search();

        }

    };
    $scope.btnGanttDisabled = true;
    $scope.btn_stby = {
        text: 'StandBy',
        type: 'default',
        // icon: 'event',
        width: 140,
        bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {


            $scope.popup_stby_visible = true;
        }

    };
    $scope.btn_cal = {
        text: 'Roster',
        type: 'default',
        // icon: 'event',
        width: 140,
        // bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            //sheler

            $scope.cal_crew_current = General.getDayFirstHour(new Date($scope.dt_fromSearched));
            $scope.popup_cal_visible = true;
        }

    };
    $scope.btn_cduties = {
        text: 'Duties Report',
        type: 'default',
        //icon: 'event',
        width: 175,
        //bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            //sheler
            dfrom = $scope._datefrom;
            $scope.rptcd_dateFrom = General.getDayFirstHour(new Date(dfrom));
            $scope.rptcd_dateTo = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));

            $scope.popup_cduties_visible = true;
        }

    };
    $scope.btn_report = {
        text: 'Daily Report',
        type: 'default',
        //icon: 'event',
        width: 175,
        //bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            //sheler


            $scope.popup_report_visible = true;
        }

    };
    $scope.btn_history = {
        text: 'Notifications History',
        type: 'default',
        //icon: 'event',
        width: 250,
        //bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            $scope.popup_his_visible = true;
        }

    };
    ////////////////////////////////////
    $scope.popup_cduties_visible = false;
    $scope.popup_cduties_title = 'Duties Report';
    $scope.rptcd_caco = 'All';

    $scope.popup_cduties = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cduties"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 120,
                    onValueChanged: function (e) {
                        $scope.rptcd_dateFrom = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 120,
                    onValueChanged: function (e) {
                        $scope.rptcd_dateTo = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: ['All', 'COCKPIT', 'CABIN'],
                    onValueChanged: function (e) {
                        $scope.rptcd_caco = e.value;
                    },
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'find', onClick: function (arg) {

                        $scope.getCrewDuties(function (ds) {
                            $scope.dg_cduties_ds = ds;
                            $scope.dg_cduties_height = $(window).height() - 130;
                            setTimeout(function () {
                                $scope.dg_cduties_height = $(window).height() - 131;
                            }, 2000);
                        });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Notify', onClick: function (arg) {

                        var selected = $rootScope.getSelectedRows($scope.dg_cduties_instance);
                        var ids = Enumerable.From(selected).Select('$.Id').ToArray();
                        if (ids.length == 0)
                            return;
                        var dto = { Ids: ids, Date: new Date($scope.rptcd_dateFrom) };
                        //2020-11-22
                        var dto = { Ids: ids, Date: new Date($scope.rptcd_dateFrom), UserName: $rootScope.userName };
                        /////////////////////////////
                        $scope.loadingVisible = true;
                        flightService.dutiesSendSMS(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $.each(response, function (_i, _d) {
                                var rec = Enumerable.From($scope.dg_cduties_ds).Where('$.Id==' + _d.Id).FirstOrDefault();
                                rec.Ref = _d.Ref;
                                rec.ResStr = "Queue";

                            });
                            //2020-11-22
                            $.each(selected, function (_i, _d) {
                                if (_d.DateConfirmed) { _d.IsConfirmed = null; _d.DateConfirmed = null; }
                                else { _d.IsConfirmed = 1; _d.DateConfirmed = new Date(); }
                            });

                            $scope.dg_cduties_instance.refresh();
                            ///////////////////////////
                            // $scope.start();



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            //2020-11-22
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Visible/Hide', onClick: function (arg) {

                        var selected = $rootScope.getSelectedRows($scope.dg_cduties_instance);
                        var ids = Enumerable.From(selected).Select('$.Id').ToArray();


                        if (ids.length == 0) {
                            General.ShowNotify('No Rows Selected', 'error');
                            return;
                        }

                        General.Confirm('Are you sure?', function (res) {
                            if (res) {

                                var dto = { Ids: ids, Date: new Date(), UserName: $rootScope.userName };
                                $scope.loadingVisible = true;
                                flightService.dutiesHideVisible(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $.each(selected, function (_i, _d) {
                                        if (_d.DateConfirmed) { _d.IsConfirmed = null; _d.DateConfirmed = null; }
                                        else { _d.IsConfirmed = 1; _d.DateConfirmed = new Date(); }
                                    });

                                    $scope.dg_cduties_instance.refresh();

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                        });






                    }
                }, toolbar: 'bottom'
            },
            ///////////////////////////
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (arg) {

                        $scope.refreshDutiesSMSStatus();

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_cduties_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);

            if ($scope.dg_cduties_instance)
                $scope.dg_cduties_instance.refresh();
        },
        onHiding: function () {

            $scope.dg_cduties_instance.clearSelection();
            $scope.dg_cduties_ds = null;
            $scope.popup_cduties_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cduties_visible',

            title: 'popup_cduties_title',
            'toolbarItems[0].options.value': 'rptcd_dateFrom',
            'toolbarItems[1].options.value': 'rptcd_dateTo',
            'toolbarItems[2].options.value': 'rptcd_caco',
        }
    };

    /////////////////////
    //otol
    $scope.dg_his_columns = [


        { dataField: 'ScheduleName', caption: 'Sch. Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },


        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'DateLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'FltNo', caption: 'Flts', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Start', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'HH:mm', allowEditing: false, width: 100 },
        { dataField: 'End', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'HH:mm', allowEditing: false, width: 100 },
        // { dataField: 'DateSent', caption: 'Sent On', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'YY-MM-dd HH:mm', allowEditing: false, width: 200 },
        { dataField: 'ResStr', caption: 'Delivery', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Ref', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'SMS', caption: 'SMS', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 1000 },

    ];
    $scope.dg_his_selected = null;
    $scope.dg_his_instance = null;
    $scope.dg_his_ds = null;
    $scope.dg_his = {

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
        height: 650,

        columns: $scope.dg_his_columns,
        onContentReady: function (e) {
            if (!$scope.dg_his_instance)
                $scope.dg_his_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_his_selected = null;

            }
            else {
                $scope.dg_his_selected = data;

            }
        },


        bindingOptions: {
            dataSource: 'dg_his_ds',

        }
    };
    /////////////////////////////
    $scope.popup_his_visible = false;
    $scope.popup_his_title = 'Notification History';
    $scope.popup_his = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_his"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [



            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'find', onClick: function (arg) {



                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_his_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,

        onShowing: function (e) {

        },
        onShown: function (e) {

            if ($scope.dg_his_instance)
                $scope.dg_his_instance.refresh();
        },
        onHiding: function () {


            $scope.dg_his_ds = null;
            $scope.popup_his_visible = false;

        },
        bindingOptions: {
            visible: 'popup_his_visible',

            title: 'popup_his_title',

        }
    };

    /////////////////////
    //dlusms
    $scope.sms_message = null;
    $scope.sms_recs = null;
    $scope.txt_sms_message = {
        height: 160,
        bindingOptions: {
            value: 'sms_message',

        }
    };
    $scope.tag_sms_recs_ds = null;
    $scope.tag_sms_recs = {
        //deferRendering:false,
        showSelectionControls: true,
        applyValueMode: "instantly",
        //dataSource:$scope.ds_crew,
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["ScheduleName"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'sms_recs',
            dataSource: 'tag_sms_recs_ds',
        }
    };
    //////////////////////////////
    $scope.dg_smscrew_columns = [
        // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
        { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false, sortIndex: 0, sortOrder: 'asc' },


    ];
    $scope.dg_smscrew_selected = null;
    $scope.dg_smscrew_instance = null;
    $scope.dg_smscrew_ds = null;
    $scope.smsRecsKeys = [];
    $scope.bindSMSRecs = function () {
        $scope.dg_smscrew_selected = Enumerable.From($scope.ds_crew).Where(function (x) { return $scope.smsRecsKeys.indexOf(x.Id) != -1; }).OrderBy('$.ScheduleName').ToArray();
    };
    $scope.dg_smscrew = {
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
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: function () {
            return 400;
        },

        columns: $scope.dg_smscrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_smscrew_instance)
                $scope.dg_smscrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            $scope.bindSMSRecs();
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_smscrew_selected = null;

            //}
            //else {
            //    $scope.dg_smscrew_selected = data;

            //}

        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'ds_crew',
            selectedRowKeys: 'smsRecsKeys',
        }
    };
    //////////////////////////////
    $scope.popup_sms_visible = false;
    $scope.popup_sms_title = 'Notification';
    $scope.popup_sms = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_sms"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: 1000,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', validationGroup: "smsmessage", onClick: function (arg) {

                        var result = arg.validationGroup.validate();

                        if (!result.isValid || !$scope.dg_smscrew_selected || $scope.dg_smscrew_selected.length == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var names = Enumerable.From($scope.dg_smscrew_selected).Select('$.Name').ToArray().join('_');
                        var mobiles = Enumerable.From($scope.dg_smscrew_selected).Select('$.Mobile').ToArray().join('_');
                        var dto = { names: names, mobiles: mobiles, message: $scope.sms_message, sender: $rootScope.userName };
                        $scope.loadingVisible = true;

                        flightService.sendSMS(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.popup_sms_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_sms_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            if (!$scope.dg_smscrew_instance)
                $scope.dg_smscrew_instance.refresh();
            // $scope.tag_sms_recs_ds=Enumerable.From($scope.ds_crew).Select("{Id:$.Id,ScheduleName:$.ScheduleName}").ToArray();
        },
        onHiding: function () {
            $scope.smsRecsKeys = [];
            $scope.dg_smscrew_selected = null;
            $scope.sms_message = null;
            $scope.popup_sms_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sms_visible',

            title: 'popup_sms_title',

        }
    };

    /////////////////////////
    //dlui
    $scope.selectedTabDateIndex2 = -1;
    $scope.selectedTab2 = null;
    $scope.selectedDate2 = null;
    $scope.tabsdatefirst2 = true;
    $scope.$watch("selectedTabDateIndex2", function (newValue) {

        try {

            if ($scope.selectedTabDateIndex2 == -1)
                return;

            $scope.selectedTab2 = $scope.tabs_date2[newValue];

            $scope.selectedDate2 = new Date($scope.selectedTab2.date);
            //$scope.checkStbyAdd();
            $scope.setAmPmDs($scope.selectedDate2, 'AM');
            // $scope.setAmPmDs($scope.selectedDate2, 'PM');


        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_date2 = [


    ];
    // $scope.selectedTabDateIndex = 0;
    $scope.tabs_date_options2 = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate1"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex2 = -1;
            $scope.selectedTabDateIndex2 = 0;
        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_date2", deep: true },
            selectedIndex: 'selectedTabDateIndex2'
        }

    };
    /////////////////////////
    $scope.getDaySTBYs = function (year, month, day, callback) {

        $scope.loadingVisible = true;
        flightService.getDutiesByDay('stby', year, month, day).then(function (response) {
            $scope.loadingVisible = false;
            //var row = {
            //    CrewId: crewid,
            //    DateStartYear: year,
            //    DateStartMonth: month,
            //    FDPs: response,
            //};
            //$scope.crewFDPs.push(row);
            callback(response);


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.AmDs = [];
    $scope.PmDs = [];
    $scope.ReservedDs = [];
    $scope.setAmPmDs = function (day, type) {
        var prts = (new Date(day)).getDatePartArray();

        $scope.getDaySTBYs(prts[0], prts[1] + 1, prts[2], function (data) {
            console.log('$scope.setAmPmDs');
            console.log(data);
            var stbys = data;
            var stbyCrews = Enumerable.From(data).Select('$.CrewId').ToArray();
            $scope.dg_crew_stby_ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                return stbyCrews.indexOf(x.Id) == -1;
            }).OrderBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();
            $scope.AmDs = Enumerable.From(data).Where('$.DutyType==1168').OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
            $scope.PmDs = Enumerable.From(data).Where('$.DutyType==1167').OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
            $scope.ReservedDs = Enumerable.From(data).Where('$.DutyType==1170').OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
        });

    };
    //dlutamiz
    $scope.removeStby = function (stby, type) {
        var crewId = stby.CrewId;
        var crewobj = Enumerable.From($scope.ds_crew).Where('$.Id==' + crewId).FirstOrDefault();
        $scope.dg_crew_stby_ds.push(JSON.parse(JSON.stringify(crewobj)));

        $scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).OrderBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();
        if (type == 1168)
            $scope.AmDs = Enumerable.From($scope.AmDs).Where(function (x) {

                return x.Id != stby.Id;
            }).ToArray();
        else if (type == 1167)
            $scope.PmDs = Enumerable.From($scope.PmDs).Where(function (x) {

                return x.Id != stby.Id;
            }).ToArray();
        else
            $scope.ReservedDs = Enumerable.From($scope.ReservedDs).Where(function (x) {

                return x.Id != stby.Id;
            }).ToArray();

        var dto = { fdp: stby.Id };

        $scope.loadingVisible = true;
        flightService.saveDeleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;
            //khar


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };
    $scope.addStby = function (_crew, _type) {
        _crew = _crew.data;
        var dto = {
            date: new Date($scope.selectedDate2),
            crewId: _crew.Id,
            type: _type,
        };
        ///////////////////////////////
        $scope.loadingVisible = true;
        flightService.saveSTBY(dto).then(function (response) {
            $scope.loadingVisible = false;

            if (response.Code == 406) {
                if (response.data.message) {
                    var myDialog = DevExpress.ui.dialog.custom({
                        rtlEnabled: true,
                        title: "Error",
                        message: response.data.message,
                        buttons: [{ text: "OK", onClick: function () { } }]
                    });
                    myDialog.show();
                }

            }
            else {
                //dlubaz




                $scope.dg_crew_stby_ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.Id != _crew.Id;
                }).OrderBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();
                if (_type == 1168) {
                    $scope.AmDs.push(response.data);
                    $scope.AmDs = Enumerable.From($scope.AmDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                }
                else if (_type == 1167) {
                    $scope.PmDs.push(response.data);
                    $scope.PmDs = Enumerable.From($scope.PmDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                }
                else {
                    $scope.ReservedDs.push(response.data);
                    $scope.ReservedDs = Enumerable.From($scope.ReservedDs).OrderBy('$.OrderIndex').ThenBy('$.ScheduleName').ToArray();
                }


            }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        ////////////////////////////////
    };
    /////////////////////////
    $scope.dg_crew_stby_columns = [

        { dataField: 'JobGroup', caption: 'RNK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 85, },
        { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'LastLocation', caption: 'Apt', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },

        {
            dataField: "Id", caption: '',
            width: 70,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'addStbyAMTemplate',

        },
        {
            dataField: "Id", caption: '',
            width: 70,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'addStbyPMTemplate',

        },
        {
            dataField: "Id", caption: '',
            width: 70,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'addResTemplate',

        },

    ];
    $scope.dg_crew_stby_selected = null;

    $scope.dg_crew_stby_instance = null;
    $scope.dg_crew_stby_ds = null;
    $scope.dg_crew_stby = {
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
        height: 550,

        columns: $scope.dg_crew_stby_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_stby_instance)
                $scope.dg_crew_stby_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            $scope.IsStbyAMVisible = false;
            $scope.IsStbyPMVisible = false;
            if (!data) {
                $scope.dg_crew_stby_selected = null;
                //$scope.rowCrew = null;
                //$scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
                //$scope.outputTemps = [];
                //$scope.crewTempFDPs = [];
            }
            else {
                $scope.dg_crew_stby_selected = data;
                //$scope.rowCrew = data;
                //$scope.getPrePost($scope.rowCrew.Id, function (prepost) {
                //    $scope.getTempDutiesSTBY();
                //});

            }


        },



        bindingOptions: {
            dataSource: 'dg_crew_stby_ds'
        }
    };
    /////////////////////////
    $scope.popup_stby_visible = false;
    $scope.popup_stby = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 1200;
            return w;
        },
        height: function () {
            var h = 700;
            return h;
            //return $(window).height();
        },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_stby_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        //position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


            //$scope.IsStbyAMVisible = false;
            //$scope.IsStbyPMVisible = false;

            $scope.tabs_date2 = [];
            var i;
            var stdate = new Date($scope.dt_fromSearched);
            while (stdate <= $scope.dt_toSearched) {
                var str = moment(stdate).format("ddd DD-MMM-YYYY");
                $scope.tabs_date2.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                stdate = stdate.addDays(1);
            }
            //dluzard

        },
        onShown: function (e) {

            $scope.dg_crew_stby_instance.repaint();

            //$scope.tempContainerStyle.height = $(window).height() - 399;
            //$scope.tempContainerStyle.padding = '5px';
            //$scope.selectedTabDateIndex = 0;
        },
        onHiding: function () {
            $scope.selectedTabDateIndex2 = -1;
            $scope.popup_stby_visible = false;

        },
        bindingOptions: {
            visible: 'popup_stby_visible',


        }
    };

    /////////////////////
    $scope.dg_flight_columns = [




        { dataField: 'FltNo', caption: 'FltNo', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 200 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 80 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 200 },
        { dataField: 'STDLocal', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },
        { dataField: 'STALocal', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },

        { dataField: 'P1', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'P2', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },

        { dataField: 'SCCM', caption: 'SCCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'CCM1', caption: 'CCMs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 400 },
        { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'SAFETY', caption: 'SAFETY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'OBS', caption: 'OBS', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'CCM3', caption: 'CHECK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        // { dataField: 'CCM2', caption: 'CCM2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        //  { dataField: 'CCM3', caption: 'CCM3', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },









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
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 280,

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
            fileName: "Daily Report",
            allowExportSelectedData: false
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
            dataSource: 'dg_flight_ds',
            //selectedRowKeys:'selectedIds',
        },
        columnChooser: {
            enabled: true
        },

    };
    ///////////////////////////////////
    $scope.bindDailyReport = function () {
        var _dt = moment($scope.rptdaily_dateFrom).format('YYYY-MM-DDTHH:mm:ss');
        //odata/crew/report/main?date=' + _dt
        $scope.loadingVisible = true;
        flightService.getRosterSheetReport(_dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_flight_ds = response.fdps;
            $scope.ds_am = response.am;
            $scope.ds_pm = response.pm;

            var ln = $scope.dg_flight_ds.length;
            if ($scope.dg_flight_ds.length < 12) {
                for (var i = 0; i <= 12 - ln; i++)
                    $scope.dg_flight_ds.push({ FltNo: '', Route: '', Id: -1 * i });
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////////////////
    $scope.popup_report_visible = false;
    $scope.popup_report_title = 'Daily Report';
    $scope.rptdaily_dateFrom = new Date();
    $scope.ds_am = null;
    $scope.ds_pm = null;
    $scope.popup_report = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_reports"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [
            {
                widget: 'dxDateBox', location: 'before', options: {
                    onValueChanged: function (e) {
                        $scope.rptdaily_dateFrom = e.value;
                    },
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'find', onClick: function (arg) {

                        $scope.dg_flight_ds = null;
                        $scope.bindDailyReport();

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Print', icon: 'print', onClick: function (arg) {

                        $scope.popup_print_visible = true;

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_report_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_flight_instance)
                $scope.dg_flight_instance.refresh();
            $scope.dg_flight_ds = null;
            $scope.bindDailyReport();
        },
        onHiding: function () {

            $scope.dg_flight_instance.clearSelection();
            $scope.dg_flight_ds = null;
            $scope.popup_report_visible = false;

        },
        bindingOptions: {
            visible: 'popup_report_visible',

            title: 'popup_report_title',
            'toolbarItems[0].options.value': 'rptdaily_dateFrom',

        }
    };
    $scope.formatDay = function (date) {
        if (!date)
            return "";
        return moment(date).format('ddd');
    };
    $scope.formatDatePersian = function (date) {
        if (!date)
            return "";
        return new persianDate(date).format("DD/MM/YYYY")
    }
    $scope.formatDate = function (date) {
        if (!date)
            return "";
        return moment(date).format('YYYY-MM-DD');
    };
    ///////////////////////
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.scroll_jl_height = $(window).height() - 10 - 110;
    ////////////////////////////////
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
        frameDoc.document.write('<link href="content/css/print.css" rel="stylesheet" />');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');

        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');

        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');

        //frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 1500);
    }
    ///////////////////////////
    $scope.popup_print_visible = false;
    $scope.popup_print_title = 'Print';
    $scope.popup_print = {

        fullScreen: false,
        showTitle: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#rtbl'));

                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_print_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {

            $scope.scroll_jl_height = $(window).height() - 10 - 110;
        },
        onHiding: function () {


            $scope.popup_print_visible = false;

        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_print_visible',

            title: 'popup_print_title',

        }
    };

    ////////////////
    $scope.rptcd_dateFrom = new Date();
    $scope.rptcd_dateTo = new Date();
    //dluq
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getCrewDuties = function (callback) {
        var _df = moment($scope.rptcd_dateFrom).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment($scope.rptcd_dateTo).format('YYYY-MM-DDTHH:mm:ss');
        var ca = 0;
        var co = 0;
        if ($scope.rptcd_caco == 'COCKPIT') {
            co = 1;
        }
        if ($scope.rptcd_caco == 'CABIN') {
            ca = 1;
        }
        $scope.loadingVisible = true;
        flightService.getCrewDuties(_df, _dt, ca, co).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.ExtendedBySplitDuty2 = $scope.formatMinutes(Math.round(_d.ExtendedBySplitDuty));
                _d.Extension2 = $scope.formatMinutes(Math.round(_d.Extension));
                _d.MaxFDPExtended2 = $scope.formatMinutes(Math.round(_d.MaxFDPExtended));
                _d.DutyScheduled2 = $scope.formatMinutes(Math.round(_d.DutyScheduled));
                _d.Duty2 = $scope.formatMinutes(Math.round(_d.Duty));
            });
            callback(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    /////////////////REPORT////////////////////////////

    $scope.dg_cduties_columns = [
        {
            dataField: "IsConfirmed", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value == 1 ? 'registered-24' : 'red';

                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',//  sortIndex: 0, sortOrder: "desc"
        },
        {
            dataField: "IsVisitedStr", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value != 'Visited' ? 'notvisited' : 'visited';

                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',//  sortIndex: 0, sortOrder: "desc"
        },

        { dataField: 'ScheduleName', caption: 'Sch. Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left', },
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },


        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'DateLocal', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'FltNo', caption: 'Flts', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Start', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'HH:mm', allowEditing: false, width: 100 },
        { dataField: 'End', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'HH:mm', allowEditing: false, width: 100 },
        { dataField: 'ExtendedBySplitDuty2', caption: 'Split Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'IsExtendedBySplitDuty', caption: 'Splited', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        // { dataField: 'DateSent', caption: 'Sent On', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'YY-MM-dd HH:mm', allowEditing: false, width: 200 },



        { dataField: 'Extension2', caption: 'Extended', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        { dataField: 'MaxFDPExtended2', caption: 'Max FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        { dataField: 'DutyScheduled2', caption: 'Duty Sch.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        { dataField: 'Duty2', caption: 'Duty Act.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



        { dataField: 'ResStr', caption: 'Delivery', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Ref', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateVisit', caption: 'Visited', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 200 },
        { dataField: 'SMS', caption: 'SMS', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 1000 },
        //2020-11-22
        { dataField: 'UserName', caption: 'User', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];
    $scope.dg_cduties_selected = null;
    $scope.dg_cduties_instance = null;
    $scope.dg_cduties_ds = null;
    $scope.dg_cduties_height = $(window).height() - 130;
    $scope.dg_cduties = {
        sorting: {
            mode: "multiple"
        },
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 200 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_cduties_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cduties_instance)
                $scope.dg_cduties_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_cduties_selected = null;

            }
            else {
                $scope.dg_cduties_selected = data;

            }
        },


        bindingOptions: {
            dataSource: 'dg_cduties_ds',
            height: 'dg_cduties_height',
        }
    };
    ///////////////////
    $scope.refreshDutiesSMSStatus = function () {

        var ids = Enumerable.From($scope.dg_cduties_ds).Select('$.Ref').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.checkSMS(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_cduties_ds).Where('$.Ref==' + _d.RefId).FirstOrDefault();
                rec.Ref = _d.RefId;
                rec.ResStr = _d.Status;

            });


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////
    //////////////////////////////////
    $scope.popup_cal_visible = false;
    $scope.popup_cal = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 1400;
            return w;
        },
        height: function () {
            return $(window).height();
        },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            //{
            //    widget: 'dxButton', location: 'after', options: {

            //        type: 'default', text: 'Day Off', icon: 'card', onClick: function (arg) {
            //            $scope.event_status = 10000;
            //            $scope.popup_event_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxButton', location: 'after', options: {

            //        type: 'default', text: 'FDPs', icon: 'airplane', onClick: function (arg) {
            //            $scope.btn_duties_visible = false;
            //            $scope.btn_crewlist_visible = true;
            //            $scope.dg_calfdp_ds = null;
            //            $('.dgcalcrew').fadeOut('200', function () {

            //                $('.dgcalfdp').fadeIn('200', function () {

            //                    var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
            //                    if ($scope.dg_calcrew_selected) {
            //                        var crewid = $scope.dg_calcrew_selected.Id;
            //                        $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);
            //                    }

            //                });
            //            });


            //        }
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxButton', location: 'after', options: {

            //        type: 'default', text: 'Crew List', icon: 'group', onClick: function (arg) {
            //            $scope.btn_crewlist_visible = false;
            //            $scope.btn_duties_visible = true;
            //            $('.dgcalfdp').fadeOut('200', function () {

            //                $('.dgcalcrew').fadeIn('200', function () {

            //                });
            //            });


            //        }
            //    }, toolbar: 'bottom'
            //},

            //{



            //    widget: 'dxDropDownButton', location: 'after', options: {
            //        type: 'default',
            //        text: "Assign Duty",
            //        icon: "save",
            //        dropDownOptions: {
            //            width: 230
            //        },
            //        onItemClick: function (e) {
            //            DevExpress.ui.notify("Download " + e.itemData, "success", 600);
            //        },
            //        items: downloads
            //    }, toolbar: 'bottom'
            //},
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_cal_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        //position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            // $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {
            if ($scope._calCrewSelected) {

                var arr = [];
                arr.push($scope._calCrewSelected);

                $scope.dg_calcrew_instance.selectRows(arr, false);
            }
            // $scope.bind_calcrew();

            // $scope.cal_change();

        },
        onHiding: function () {




            $scope.cal_crew_ds = [];
            if ($scope.cal_crew_instance) {
                $scope.cal_crew_instance.repaint();

            }
            $scope.dg_calcrew_instance.clearSelection();
            // $scope.rebind();
            $scope._calCrewSelected = null;
            $scope.popup_cal_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cal_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            //title: 'FlightsTitle',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    $scope.formatDateTime = function (dt) {
        return moment(dt).format('MM-DD HH:mm');
    };
    $scope.formatTime = function (dt) {
        if (!dt)
            return null;
        return moment(dt).format('HH:mm');
    };
    //$scope.cal_change = function () {
    //    return;
    //    if (!$scope.cal_crew_current)
    //        return;
    //    if (!$scope.dg_calcrew_selected)
    //        return;
    //    var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
    //    var crewid = $scope.dg_calcrew_selected.Id;
    //    $scope.getCrewFDPs(prts[0], prts[1] + 1, crewid, function (data) {

    //        $scope.cal_crew_ds = data;
    //    });


    //};
    $scope.crewFDPs = [];
    $scope.cal_change = function () {
        if (!$scope.cal_crew_current)
            return;
        if (!$scope.dg_calcrew_selected)
            return;
        var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
        var crewid = $scope.dg_calcrew_selected.Id;
        $scope.getCrewFDPs(prts[0], prts[1] + 1, crewid, function (data) {
            console.log(data);
            $scope.cal_crew_ds = data;
        });


    };
    $scope.getCrewFDPs = function (year, month, crewid, callback) {

        if (year, month, crewid) {
            var data = Enumerable.From($scope.crewFDPs).Where('$.CrewId==' + crewid + ' && $.DateStartYear==' + year + ' && $.DateStartMonth==' + month).FirstOrDefault();
            if (!data) {
                $scope.loadingVisible = true;
                flightService.getCrewDutiesByYearMonth(crewid, year, month).then(function (response) {
                    $scope.loadingVisible = false;
                    var row = {
                        CrewId: crewid,
                        DateStartYear: year,
                        DateStartMonth: month,
                        FDPs: response,
                    };
                    //$scope.crewFDPs.push(row);
                    callback(response);


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                callback(data.FDPs);
        }
        else callback(null);;
    };
    $scope.smsCrew = function (crew) {
        var data = crew.data;
        $scope.smsRecsKeys = [];
        $scope.smsRecsKeys.push(data.Id);
        $scope.bindSMSRecs();
        $scope.popup_sms_visible = true;
    };

    $scope.dg_calcrew_columns = [
        // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
        { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false, sortIndex: 0, sortOrder: 'asc' },
        {
            dataField: "Id", caption: '',
            width: 70,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'smsTemplate',

            //visible:false,

        },

    ];
    $scope.dg_calcrew_selected = null;
    $scope.dg_calcrew_instance = null;
    $scope.dg_calcrew_ds = null;
    $scope.dg_calcrew = {
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
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: function () {
            return $(window).height() - 114;
        },

        columns: $scope.dg_calcrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_calcrew_instance)
                $scope.dg_calcrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_calcrew_selected = null;

            }
            else {
                $scope.dg_calcrew_selected = data;
                $scope.cal_change();
            }
            var scrollable = e.component.getView('rowsView')._scrollable;
            var selectedRowElements = e.component.element().find('tr.dx-selection');
            scrollable.scrollToElement(selectedRowElements);
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'ds_crew',

        }
    };
    $scope.cal_crew_current = new Date();
    $scope.$watch('cal_crew_current', function (newValue, oldValue, scope) {
        //  alert(newValue);
        try {
            $scope.cal_change();
        }
        catch (e) {
            alert('e3');
            alert(e);
        }

    });

    //$scope.sendNotification = function (e) {

    //    $scope.event_status = 1168;
    //    $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
    //    $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
    //    $scope.popup_event_title = 'STBY AM';
    //    $scope.popup_event_visible = true;
    //};

    $scope.assign1168 = function (e) {

        $scope.event_status = 1168;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
        $scope.popup_event_title = 'STBY AM';
        $scope.popup_event_visible = true;
    };
    $scope.assign1167 = function (e) {
        $scope.event_status = 1167;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(12, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(12 * 60);
        $scope.popup_event_title = 'STBY PM';
        $scope.popup_event_visible = true;
    };
    $scope.assign10000 = function (e) {
        $scope.event_status = 10000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(20, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(36);
        //$scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        //$scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(12);
        $scope.popup_event_title = 'Day Off';
        $scope.popup_event_visible = true;
    };
    $scope.assign5000 = function (e) {
        $scope.event_status = 5000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Training';
        $scope.popup_event_visible = true;
    };
    $scope.assign5001 = function (e) {
        $scope.event_status = 5001;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
        $scope.popup_event_title = 'Office';
        $scope.popup_event_visible = true;
    };

    $scope.assign1169 = function (e) {
        $scope.event_status = 1169;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Vacation';
        $scope.popup_event_visible = true;
    };
    $scope.assign100000 = function (e) {
        $scope.event_status = 100000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Ground';
        $scope.popup_event_visible = true;
    };
    $scope.assign100001 = function (e) {
        $scope.event_status = 100001;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Meeting';
        $scope.popup_event_visible = true;
    };

    $scope.assign100002 = function (e) {
        $scope.event_status = 100002;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Sick';
        $scope.popup_event_visible = true;
    };
    $scope.assign100003 = function (e) {
        $scope.event_status = 100003;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Simulator';
        $scope.popup_event_visible = true;
    };
    $scope.assign100004 = function (e) {
        $scope.event_status = 100004;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Licence';
        $scope.popup_event_visible = true;
    };
    $scope.assign100005 = function (e) {
        $scope.event_status = 100005;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Medical';
        $scope.popup_event_visible = true;
    };
    $scope.assign100006 = function (e) {
        $scope.event_status = 100006;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Passport';
        $scope.popup_event_visible = true;
    };
    $scope.assign100007 = function (e) {
        $scope.event_status = 100007;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'No Flt';
        $scope.popup_event_visible = true;

    };
    $scope.assign100008 = function (e) {
        $scope.event_status = 100008;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Requested Off';
        $scope.popup_event_visible = true;

    };
    $scope.assign100009 = function (e) {
        $scope.event_status = 100009;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Refuse';
        $scope.popup_event_visible = true;

    };
    $scope.assign1170 = function (e) {
        $scope.event_status = 1170;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Reserve';
        $scope.popup_event_visible = true;
    };

    $scope.cellContextMenuItems = [
        { text: 'STBY AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY AM</td></tr></table>", },
        { text: 'STBY PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY PM</td></tr></table>", },

        { text: 'Day Off', onItemClick: $scope.assign10000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Day Off</td></tr></table>", },
        { text: 'Requested Off', onItemClick: $scope.assign100008, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Requested Off</td></tr></table>", },
        // { text: 'Assign Stan By AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>", },
        // { text: 'Assign Stan By PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>", },

        { text: 'Office', onItemClick: $scope.assign5001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Office</td></tr></table>", },
        { text: 'Training', onItemClick: $scope.assign5000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Training</td></tr></table>", },

        { text: 'Meeting', onItemClick: $scope.assign100001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Meeting</td></tr></table>", },
        { text: 'Reserve', onItemClick: $scope.assign1170, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1170' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Reserve</td></tr></table>", },
        { text: 'Vacation', onItemClick: $scope.assign1169, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1169' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Vacation</td></tr></table>", },
        { text: 'Ground', onItemClick: $scope.assign100000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Ground</td></tr></table>", },
        { text: 'Simulator', onItemClick: $scope.assign100003, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100003' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Simulator</td></tr></table>", },
        { text: 'Sick', onItemClick: $scope.assign100002, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100002' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Sick</td></tr></table>", },
        { text: 'Expired Medical', onItemClick: $scope.assign100005, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100005' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Medical</td></tr></table>", },
        { text: 'Expired Licence', onItemClick: $scope.assign100004, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100004' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Licence</td></tr></table>", },
        { text: 'Expired Passport', onItemClick: $scope.assign100006, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100006' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Passport</td></tr></table>", },
        { text: 'No Flight/Off', onItemClick: $scope.assign100007, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>No Flight/Off</td></tr></table>", },
        { text: 'Refuse', onItemClick: $scope.assign100009, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Refuse</td></tr></table>", },

    ];
    $scope.cellContextMenuOptions = {
        target: ".dx-scheduler-date-table-cell",
        dataSource: $scope.cellContextMenuItems,
        width: 200,
        onShowing: function (e) {
            if (!$scope.dg_calcrew_selected)
                e.cancel = true;
            $scope.contextMenuCellData
            var cdate = new Date($scope.contextMenuCellData.startDate);
            var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
            var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
            if (cdate >= bdate && cdate <= edate)
                e.cancel = true;
        },
        onItemClick: function (e) {
            if (!$scope.dg_calcrew_selected)
                return;
            console.log(e.itemData);
            e.itemData.onItemClick(e.itemData);
        }
    };


    $scope.cal_crew_ds = null;
    $scope.cal_crew_instance = null;
    $scope.cal_crew = {
        //dataSource: data,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowDragging: false,
            allowResizing: false,
            allowUpdating: false,
        },
        textExpr: 'Flights',
        startDateExpr: 'Start',
        endDateExpr: 'End',
        views: ["month", "day"],
        currentView: "month",
        startDayHour: 0,
        appointmentTemplate: 'appointmentTemplate',
        appointmentTooltipTemplate: "tooltip-template",
        dataCellTemplate: 'dataCellTemplate',
        dateCellTemplate: 'dateCellTemplate',
        height: function () {
            return $(window).height() - 115 - 31;
        },
        onContentReady: function (e) {
            if (!$scope.cal_crew_instance) {
                $scope.cal_crew_instance = e.component;

                // alert($scope.cal_crew_instance);
            }

        },
        optionChanged: function (e) {
            //alert(e.name + '   ' + e.value);
        },
        onAppointmentClick: function (e) {
            e.cancel = true;
            return;
            var $el = $(e.event.target);
            if ($el.hasClass('cellposition')) {
                e.cancel = true;
                return;
            }
        },
        onAppointmentDblClick: function (e) {
            e.cancel = true;
            return;
        },
        onCellContextMenu: function (e) {


            $scope.contextMenuCellData = e.cellData;
        },
        bindingOptions: {
            currentDate: 'cal_crew_current',
            dataSource: 'cal_crew_ds',
            //currentDate: '_datefromcal',

        }
    };

    $scope._eventId = -1;
    $scope.event_status = null;
    function getEventTitle(id) {
        switch (id) {
            case 100000:
                return "Ground";
            case 100001:
                return "Meeting";
            case 100002:
                return "Sick";
            case 100003:
                return "Simulator";
            case 100004:
                return "Expired Licence";
            case 100005:
                return "Expired Medical";
            case 100006:
                return "Expired Passport";
            case 100007:
                return "No Flight/Off";
            case 100008:
                return "Requested Off";
            case 100009:
                return "Refuse";
            case 1169:
                return "Vacation";
            case 1170:
                return "Reserve";
            default:
                return "-";
        }
    }
    $scope.createEvent = function (_crew, _type, _typeTitle, eventFrom, eventEnd, remark) {

        var crewid = _crew.Id; //_crew.data.Id;
        var crew = _crew; //_crew.data;
        if (!_typeTitle)
            _typeTitle = getEventTitle(_type);

        //$scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).Where('$.Id!=' + crewid).ToArray();
        $scope._eventId = $scope._eventId - 1;
        var offset = 1 * (new Date()).getTimezoneOffset();
        var stby = {
            Id: $scope._eventId, //-($scope.crewDuties.length + 1),
            type: 0,
            JobGroup: crew.JobGroup,
            GroupId: crew.GroupId,
            ScheduleName: crew.ScheduleName,
            //Duty: 180,
        };
        stby.crewId = crewid;
        stby.isPrePost = false;
        stby.LastLocationId = crew.LastLocationId;
        stby.LastLocation = crew.LastLocation;
        stby.FirstLocationId = crew.LastLocationId;
        stby.FirstLocation = crew.LastLocation;
        stby.day = new Date(eventFrom);
        stby.DutyStartLocal = new Date(eventFrom);
        stby.Remark = remark;
        stby.DutyEndLocal = new Date(eventEnd);
        stby.dutyType = _type;
        stby.dutyTypeTitle = _typeTitle;


        stby.DutyStart = (new Date(stby.DutyStartLocal)).addMinutes(offset);
        stby.DutyEnd = (new Date(stby.DutyEndLocal)).addMinutes(offset);
        if (_type != 10000 && _type != 1169 && _type != 100000 && _type != 100001 && _type != 100002 && _type != 100004 && _type != 100005 && _type != 100006 && _type != 100007 && _type != 100008 && _type != 100009) {
            stby.RestToLocal = (new Date(stby.DutyEndLocal)).addMinutes(12 * 60);
            stby.RestTo = (new Date(stby.RestToLocal)).addMinutes(offset);
        }
        else {
            stby.RestToLocal = stby.DutyEndLocal;
            stby.RestTo = stby.DutyEnd;
        }
        var diff = Math.abs(new Date(eventEnd) - new Date(eventFrom));
        stby.Duty = Math.floor((diff / 1000) / 60);

        stby.flights = null;
        stby.IsOver = false;

        return stby;

    };
    $scope.IsEventOverLapped = function (event) {


        var f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {
            return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(x.RestUntil))
                ||
                (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(x.RestUntil))
                ||
                (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

        }).FirstOrDefault();
        console.log('IsEventOverLapped-------------------------------------');
        console.log(event);
        console.log($scope.cal_crew_ds);
        console.log('---------------');
        console.log(f);
        console.log('IsEventOverLapped-------------------------------------');
        if (f)
            return true;
        return false;
    };

    $scope.xgetDutyClass = function (duty) {
        switch (duty.DutyType) {
            case 1165:
                return 'duty-1165';
            default:
                return 'duty-' + duty.DutyType;
        }
    };
    //2020-11-22
    $scope.notifyDutyCal = function (duty) {
        var selected = $rootScope.getSelectedRows($scope.dg_cduties_instance);
        var ids = [];
        ids.push(duty.Id);

        var dto = { Ids: ids, Date: duty.DateLocal, UserName: $rootScope.userName };
        if (!dto.Date)
            dto.Date = duty.DaySTDLocal;
        $scope.loadingVisible = true;

        flightService.dutiesSendSMS(dto).then(function (response) {
            $scope.loadingVisible = false;
            General.ShowNotify(Config.Text_SavedOk, 'success');


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.removeDutyCal = function (duty) {
        var type = duty.DutyType;
        if (type == 1165 && !$scope.isAdmin) {

            if (new Date(duty.End) < $scope.firstHour) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }
        }
        var dto = { fdp: duty.Id };

        $scope.loadingVisible = true;
        flightService.saveDeleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;
            //khar
            var _cr = Enumerable.From($scope.ds_crew).Where('$.Id==' + duty.CrewId).FirstOrDefault();
            if (_cr && _cr.FlightSum) {
                _cr.FlightSum = _cr.FlightSum - response;
            }
            $scope.cal_crew_instance.deleteAppointment(duty);
            if (type == 1165) {
                $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where('$.Id!=' + duty.Id).ToArray();
                $scope.fillPos(true);
                $scope.fillRangeFdps();
                $scope.fillFlightCrews();

            }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };

    $scope.saveNewDutyCal = function (crewid, callback) {
        var dto = {
            DateStart: new Date($scope.FromDateEvent),
            DateEnd: new Date($scope.ToDateEvent),
            CityId: -1,
            CrewId: crewid,
            DutyType: $scope.event_status,
            Remark: $scope.RemarkEvent

        }
        $scope.loadingVisible = true;
        //dlumask
        flightService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            response.dutyTypeTitle = response.DutyTypeTitle;
            response.dutyType = response.DutyType;
            $scope.cal_crew_ds.push(response);
            // $scope.cal_crew_instance.repaint();
            callback();



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    var getMidNight = function (d) {
        return new Date(new Date(d.setHours(24)).setMinutes(0)).setSeconds(0);
    };
    $scope.popup_event = {
        width: 350,
        height: 360,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd2', onClick: function (arg) {
                         
                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var crewid = $scope.dg_calcrew_selected.Id;

                        var eventFrom = new Date($scope.FromDateEvent);
                        var eventEnd = new Date($scope.ToDateEvent);
                        var rosterFrom = new Date(General.getDayFirstHour(new Date($scope.dt_fromSearched)));
                        //getDayLastHour
                        var rosterTo = new Date(getMidNight(new Date($scope.dt_toSearched)));
                        //////////////////////////////
                        if ($scope.event_status == 10000) {
                            //nool

                            //  alert(crewid);
                            var _event = $scope.createEvent($scope.dg_calcrew_selected, 10000, 'RERRP', eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check  ) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {
                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        ///////////////////////////////////
                        //if ($scope.event_status == 5000 || $scope.event_status == 5001) {
                        //    if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                        //        // alert(crewid);

                        //        var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, ($scope.event_status==5000?'Training':'Office'), eventFrom, eventEnd);
                        //        var check = $scope.IsEventOverLapped(_event);
                        //        if (check) {
                        //            General.ShowNotify('Overlapped Duties Found', 'error');
                        //            return;
                        //        }
                        //        else
                        //        {
                        //            $scope.cal_crew_ds.push(_event);
                        //            $scope.cal_crew_instance.repaint();
                        //            $scope.crewDuties.push(_event);
                        //            console.log('event duties');
                        //            console.log($scope.crewDuties);
                        //            $scope.popup_event_visible = false;
                        //        }


                        //    }


                        //}
                        else if ($scope.event_status == 5000 || $scope.event_status == 5001
                            || $scope.event_status == 100001 || $scope.event_status == 100003 || $scope.event_status == 1170 || $scope.event_status == 1167
                            || $scope.event_status == 1168
                        ) {
                            //nool


                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check  ) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        //dlutopol
                        else {
                            //nool


                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = false; //$scope.IsEventOverLapped(_event);
                            if (check  ) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });

                            }


                        }

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.ToDateEvent = null;
            $scope.FromDateEvent = null;
            $scope.event_status = null;
            $scope.RemarkEvent = null;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };

    //close button
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    $scope.FromDateEvent = null;
    $scope.ToDateEvent = null;
    $scope.RemarkEvent = null;





    $scope.date_from_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_from_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'FromDateEvent',
        }
    };
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    $scope.date_to_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'ToDateEvent',
        }
    };
    $scope.remark_event = {
        height: 60,
        bindingOptions: {
            value: 'RemarkEvent',

        }
    };
    ///////////////////////////////////////
    $scope.daysds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    $scope.days_count = 2;
    $scope.sb_days = {

        showClearButton: false,
        width: '100%',
        searchEnabled: false,
        dataSource: $scope.daysds,

        onSelectionChanged: function (arg) {
            // $scope.search();
        },
        bindingOptions: {
            value: 'days_count',

        }
    };
    ///////////////////////////////////////
    $scope.selectedTabDateIndex = -1;
    $scope.tabsdatefirst = true;

    $scope.$watch("selectedTabDateIndex", function (newValue) {

        try {

            if ($scope.selectedTabDateIndex == -1)
                return;
            $scope.selectedTab = $scope.tabs_date[newValue];

            $scope.selectedDate = new Date($scope.selectedTab.date);
            $scope.scrollFirstFlightDate($scope.selectedDate);


        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_date = [


    ];
    $scope.tabs_date_options = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex = -1;
            $scope.selectedTabDateIndex = 0;

        },
        bindingOptions: {
            visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs_date", deep: true },
            selectedIndex: 'selectedTabDateIndex'
        }

    };
    ///////////////////////////////////////

    //var dfrom = new Date(2020, 6, 2, 0, 0, 0, 0);

    $scope.regs = ['CAR', 'KPA', 'KPB', 'CPD', 'CAS', 'CPV', 'FPA', 'FPC', 'CPQ', 'KPC', 'KPD', 'KPE', 'CNL'];
    /////config/////////////////
    var hourWidth = 80;
    ///////////////////////////

    $scope.refreshHeights = function () {


        $('.cell-hour').width(hourWidth);
        $('.cell-day').width((hourWidth + 1) * 24 - 1);
        $('.row-top-mirror').height($('.row-top').height() - 1);
        var h = ($('.reg-box').height());
        //$('.mid-line').height($('.flights').prop('scrollHeight') );
        //$('.hour-line').height($('.flights').prop('scrollHeight'));
        // $('.now-line').height($('.flights').prop('scrollHeight'));
        $('.mid-line').height(h);
        $('.hour-line').height(h);
        $('.now-line').height(h);

        $('.flights').on('scroll', function () {
            $('.regs').scrollTop($(this).scrollTop());
            //$('.timeline').scrollLeft($(this).scrollLeft());
        });



        $scope.start();

    };

    var stopped;
    $scope.countdown = function () {
        //var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
        //var nowleft = (_left * (hourWidth + 1));
        //var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
        //var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
        stopped = $timeout(function () {

            var time = moment(new Date()).format('HH:mm');
            var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
            var nowleft = (_left * (hourWidth + 1)) - 1;
            $('.now-line').css('left', nowleft + 'px');
            $('#nowTime').css('left', (nowleft + 5) + 'px');
            $('#nowTime').html(time);

            $scope.countdown();

        }, 10000);
    };


    $scope.stop = function () {
        $timeout.cancel(stopped);


    };
    $scope.start = function () {

        $scope.countdown();
    }

    function createDate(year, month, day, hh, mm, ss) {
        var d = new Date();
    }
    function _gpad2(n) {
        var str = "" + n
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        return ans;
    }

    persianDate.toLocale('en');
    $scope.getDep = function (flt) {
        if (flt.ChocksOut)
            return moment(flt.ChocksOut).format('HHmm');
        else
            return moment(flt.STD).format('HHmm');
    };
    $scope.getArr = function (flt) {

        if (flt.ChocksIn)
            return moment(flt.ChocksIn).format('HHmm');
        else
            return moment(flt.STA).format('HHmm');
    };
    $scope.getFlightClass = function (flt) {
        var cls = 'init-flt';
        if (flt.FlightStatusID == 4)
            cls += ' cnl';

        if (flt.hasCrew)
            cls += ' has-crew';
        if (flt.hasCrewAll)
            cls += ' has-crew-all';
        return cls + ' flightitem';
    }
    $scope.getDuration = function (d1, d2) {
        var diff = Math.abs(d1.getTime() - d2.getTime()) / 3600000;
        return diff;
    }

    $scope.getFlightWidth = function (flt) {
        var duration = $scope.getDuration(new Date(flt.ChocksIn ? flt.ChocksIn : flt.STA), new Date(flt.STD));
        var w = duration * hourWidth;
        return w + "px";
    }
    $scope.getDelayStyle = function (flt) {
        if (!flt.ChocksOut || new Date(flt.ChocksOut) <= new Date(flt.STD))
            return { width: 0 };
        var duration = $scope.getDuration(new Date(flt.ChocksOut), new Date(flt.STD));
        var w = duration * hourWidth;
        return { width: w + "px" };
    };
    $scope.getDelayText = function (flt) {
        if (!flt.ChocksOut || new Date(flt.ChocksOut) <= new Date(flt.STD))
            return "";
        var duration = $scope.getDuration(new Date(flt.ChocksOut), new Date(flt.STD)) * 60;

        return duration != 0 ? duration : "";
    };
    $scope.hasConflict = function (f1, f2) {
        if ((f1.STD >= f2.STD && f1.STD <= f2.STA) || (f1.STA >= f2.STD && f1.STA <= f2.STA))
            return true;
        if ((f2.STD >= f1.STD && f2.STD <= f1.STA) || (f2.STA >= f1.STD && f2.STA <= f1.STA))
            return true;


        if ((f1.ChocksOut >= f2.STD && f1.ChocksOut <= f2.STA) || (f1.ChocksIn >= f2.STD && f1.ChocksIn <= f2.STA))
            return true;
        if ((f2.ChocksOut >= f1.STD && f2.ChocksOut <= f1.STA) || (f2.ChocksIn >= f1.STD && f2.ChocksIn <= f1.STA))
            return true;



        if ((f1.ChocksOut >= f2.ChocksOut && f1.ChocksOut <= f2.ChocksIn) || (f1.ChocksIn >= f2.ChocksOut && f1.ChocksIn <= f2.ChocksIn))
            return true;
        if ((f2.ChocksOut >= f1.ChocksOut && f2.ChocksOut <= f1.ChocksIn) || (f2.ChocksIn >= f1.ChocksOut && f2.ChocksIn <= f1.ChocksIn))
            return true;




        return false;
    };
    $scope.timeType = 0;
    $scope.getFlightStyle = function (f, index, res) {

        /*var style = {};
        style.width = $scope.getFlightWidth(f);
        var left = $scope.getDuration(new Date($scope.datefrom), new Date(f.STD));
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;
        

        style.top = top + 'px';
        return style;*/
        var style = {};
        style.width = $scope.getFlightWidth(f);

        var std = f.STD;
        if ($scope.timeType == 1) {
            var offset = getOffset(new Date(std.getFullYear(), std.getMonth(), std.getDate(), 1, 0, 0, 0));
            std = (new Date(std)).addMinutes(offset)

        }

        var datefromOffset = (new Date($scope.datefrom)).getTimezoneOffset();
        var stdOffset = (new Date(std)).getTimezoneOffset();
        var dfirst = new Date($scope.datefrom);
        if (stdOffset < datefromOffset)
            dfirst = (new Date($scope.datefrom)).addMinutes(-60);
        if (stdOffset > datefromOffset)
            dfirst = (new Date($scope.datefrom)).addMinutes(60);


        var left = $scope.getDuration(new Date(dfirst), /*new Date(f.ChocksOut?f.ChocksOut: f.STD)*/new Date(std));
        if (new Date(std) < new Date($scope.datefrom))
            left = -1 * left;
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;
        if (f.FlightStatusID == 4)
            top += 30;
        //console.log(index); 
        //console.log(res);

        style.top = top + 'px';
        return style;
    }
    $scope.getResStyle = function (res) {
        return {
            minHeight: (res.maxTop + 50) + 'px'
        };
    };
    $scope.getResCaptionStyle = function (res) {
        return {
            lineHeight: (res.maxTop + 45) + 'px'
        };
    }

    $scope.IsNowLine = false;
    $scope.clearGantt = function () {
        $scope.ganttData = null;
        $scope.stop();
        var $timeBar = $('.header-time');
        var $dayBar = $('.header-date');
        var $flightArea = $('.flights');
        $timeBar.empty();
        $dayBar.empty();
        $flightArea.empty();

    };
    $scope.createGantt = function () {
        var tempDate = new Date(dfrom);
        var $timeBar = $('.header-time');
        var $dayBar = $('.header-date');
        var $flightArea = $('.flights');
        $timeBar.empty();
        $dayBar.empty();
        //$flightArea.empty();
        $('.reg-row').remove();
        $('.hour-line').remove();
        $('.mid-line').remove();
        $('.now-line').remove();
        $('#nowTime').remove();
        $('.flights').height(0);


        $('.flights').off('scroll');
        var c = 1;
        for (var i = 1; i <= $scope.days_count; i++) {
            for (var j = 0; j < 24; j++) {
                var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-270);

                var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "<span class='second-time'>" + moment(secondDate).format('HH:mm') + "</span></div>";
                $timeBar.append(hourElem);
                if (c < 24 * $scope.days_count) {
                    var hleft = c * (hourWidth + 1) - 0.8;
                    var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
                    $flightArea.append(hline);
                }

                c++;
            }
            var tbl = "<table style='padding:0;width:95%'><tr>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"
                + "<td style='font-size:11px;'>" + moment(tempDate).format('dd DD-MMM-YYYY') + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</td>"

                + "</tr></table>"
            var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + tbl + "</div>";
            $dayBar.append(dayElem);

            if (i < $scope.days_count) {
                var midleft = i * 24 * (hourWidth + 1) - 1;
                var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
                $flightArea.append(midline);
            }


            tempDate = tempDate.addDays(1);
        }
        //if ($scope.IsNowLine) {
        //    var _left = $scope.getDuration(new Date($scope.datefrom), new Date());
        //    var nowleft = (_left * (hourWidth + 1));
        //    var nowline = "<div class='now-line' style='top:0px;left:" + nowleft + "px'></div>";
        //    var nowTime = "<span style='display:inline-block;font-size:11px;position:absolute;top:2px;left:" + (nowleft + 5) + "px' id='nowTime'>" + moment(new Date()).format('HH:mm') + "</span>";
        //    $flightArea.append(nowline);
        //    $flightArea.append(nowTime);
        //}
        $dayBar.append("<div style='clear:both'></div>");
        $timeBar.append("<div style='clear:both'></div>");
        $('.timeline').width((hourWidth + 1) * $scope.days_count * 24);
        $('.flights').width((hourWidth + 1) * $scope.days_count * 24);


    };


    $scope.ganttData = null;

    $scope.checkConflict = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.STD) >= new Date(_d.STD) && new Date(x.STD) <= new Date(_d.STA))
                    ||
                    (new Date(x.STA) >= new Date(_d.STD) && new Date(x.STA) <= new Date(_d.STA))
                );
            }).ToArray();

        });

        return hasConflict;
    };
    var getMinDate = function (d1, d2) {
        var result = d1;
        if (d2 < d1)
            result = d2;
        return result;


    }
    var getMaxDate = function (d1, d2) {
        var result = d1;
        if (d2 > d1)
            result = d2;
        return result;


    }
    $scope.IsConflict = function (flt, x) {

        var fltDep = getMinDate(new Date(flt.STD), new Date(flt.ChocksOut));
        var xDep = getMinDate(new Date(x.STD), new Date(x.ChocksOut));

        var fltArr = getMaxDate(new Date(flt.STA), new Date(flt.ChocksIn));
        var xArr = getMaxDate(new Date(x.STA), new Date(x.ChocksIn));



        return (fltDep > xDep && fltDep < xArr) || (fltArr > xDep && fltArr < xArr)
            || (xDep > fltDep && xDep < fltArr) || (xArr > fltDep && xArr < fltArr);



    }
    $scope.findConflict = function (flt, flights) {
        //var query = Enumerable.From(flights).Where(function (x) {
        //    return new Date(x.STD) <= new Date(flt.STD) && x.ID != flt.ID

        //}).OrderByDescending(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenByDescending('$.ID').ToArray();
        var cnflt = Enumerable.From(flights).Where(function (x) {
            return new Date(x.STD) <= new Date(flt.STD) && x.ID != flt.ID
                && (
                    (new Date(flt.STD) >= new Date(x.STD) && new Date(flt.STD) < new Date(x.STA))
                    || (new Date(flt.STA) > new Date(x.STD) && new Date(flt.STA) < new Date(x.STA))

                    || (new Date(flt.ChocksOut) >= new Date(x.STD) && new Date(flt.ChocksOut) < new Date(x.STA))
                    || (new Date(flt.ChocksIn) > new Date(x.STD) && new Date(flt.ChocksIn) < new Date(x.STA))


                    || (new Date(flt.ChocksOut) >= new Date(x.ChocksOut) && new Date(flt.ChocksOut) < new Date(x.ChocksIn))
                    || (new Date(flt.ChocksIn) > new Date(x.ChocksOut) && new Date(flt.ChocksIn) < new Date(x.ChocksIn))


                    // || (new Date(flt.STD) == new Date(x.STD) && new Date(flt.STA) == new Date(x.STA))
                    //|| (moment(flt.STD).format('YYYYDDMMHHmm') == moment(x.STD).format('YYYYDDMMHHmm'))
                );
        }).OrderByDescending(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenByDescending('$.ID').FirstOrDefault();
        return cnflt;
    }

    var dfrom = null;
    $scope.flightsRendered = 0;

    $scope.setTop = function (flts) {

        var _flights = Enumerable.From(flts).ToArray();
        var j = 0;
        var last = null;

        while (_flights.length > 0) {
            for (var i = 0; i < _flights.length; i++) {
                var cf = _flights[i];
                //cf.top = null;
                if (i == 0) { cf.top = j; last = cf; }
                else {
                    if (!$scope.IsConflict(cf, last)) { cf.top = j; last = cf; }
                }

            }
            _flights = Enumerable.From(_flights).Where('$.top==null').ToArray();

            j = j + 50;
        }
    }

    $scope.ati_flights = null;
    $scope.bindFlights = function (callback) {
        $scope.baseDate = (new Date(Date.now())).toUTCString();
        dfrom = $scope._datefrom;
        $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
        $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));

        $scope.dt_fromSearched = new Date($scope.datefrom);
        $scope.dt_toSearched = new Date($scope.dateEnd);

        $scope.btnGanttDisabled = false;
        var now = new Date();
        if (now >= $scope.datefrom && now <= $scope.dateEnd)
            $scope.IsNowLine = true;
        else
            $scope.IsNowLine = false;
        $scope.flightsRendered = 0;

        $scope.midnightLines = [];
        $scope.doUtcEnabled = true;
        var xs = 0;

        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo,


        };

        $scope.selectedFlights = [];


        //xati
        $scope.selectedTabDateIndex = -1;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.totalHeight = 0;
        $scope.loadingVisible = true;
        var ed = (new Date($scope.dateEnd)).toUTCDateTimeDigits(); //(new Date($scope.dateto)).toUTCDateTimeDigits();
        //flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, offset, /*($scope.IsAdmin ? null : $scope.airportEntity.Id)*/-1, 0, filter).then(function (response) {
        //4-11
        var _dlight = new Date(2021, 2, 22, 0, 0, 0);
        var _dcor = 0;
        if (new Date($scope.datefrom) >= _dlight)
            _dcor = 1;
        _dcor = 0;
        //5-1
        flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), ed, offset, null, filter).then(function (response) {
            try {
                $scope.loadingVisible = false;
                $scope.tabsdatefirst = true;
                $scope.tabs_date = [];
                var i;
                var stdate = new Date($scope.datefrom);
                for (i = 1; i <= $scope.days_count; i++) {
                    var str = moment(stdate).format("ddd DD-MMM-YYYY");
                    $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                    stdate = stdate.addDays(1);

                }
                $scope.tabsdatevisible = true;

                // var nextdayFlight = Enumerable.From(response.flights).Where(function (x) { return new Date(x.STA) > $scope.dateEnd || (!x.ChocksIn ? false : new Date(x.ChocksIn) > $scope.dateEnd); }).FirstOrDefault();
                // if (nextdayFlight)
                //    $scope.days_count++;
                $.each(response.resources, function (_i, _d) {

                    var flights = Enumerable.From(response.flights).Where('$.RegisterID==' + _d.resourceId)
                        .OrderBy(function (x) { return moment(x.STD).format('YYYYDDMMHHmm') }).ThenBy('Number($.ID)')
                        .ToArray();
                    //if (_d.resourceId == 69)

                    $.each(flights, function (_j, _q) {
                        _q.STD = (new Date(_q.STD)).addHours(_dcor);


                        _q.STA = (new Date(_q.STA)).addHours(_dcor);
                        if (_q.ChocksIn)
                            _q.ChocksIn = (new Date(_q.ChocksIn)).addHours(_dcor);
                        if (_q.ChocksOut)
                            _q.ChocksOut = (new Date(_q.ChocksOut)).addHours(_dcor);

                        _q.STD = moment(_q.STD);
                        _q.STA = moment(_q.STA);

                        if (_q.ChocksIn)
                            _q.ChocksIn = moment(_q.ChocksIn);
                        if (_q.ChocksOut)
                            _q.ChocksOut = moment(_q.ChocksOut);


                        if (!_q.ChocksIn)
                            _q.ChocksIn = new Date(_q.STA);
                        if (!_q.ChocksOut)
                            _q.ChocksOut = new Date(_q.STD);


                        //_q.top = 0;
                        //if (_j > 0) {
                        //    var cnflt = $scope.findConflict(_q, flights);

                        //    if (cnflt)
                        //    { _q.top = 50 + (cnflt.top ? cnflt.top : 0); }
                        //}
                    });
                    $scope.setTop(flights);
                    _d.maxTop = Enumerable.From(flights).Select('Number($.top)').Max();
                    $scope.totalHeight += _d.maxTop;
                    _d.flights = flights;
                });
                $scope.ganttData = response;
                $scope.ati_flights = $scope.ganttData.flights;
                console.log($scope.ati_flights);
                callback();
            }
            catch (ex) {
                alert(ex);
            }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.utimer = null;
    $scope.baseDate = null;
    $scope.StartUTimer = function () {
        return;
        //tooki
        $scope.utimer = setTimeout(function () {
            //'info' | 'warning' | 'error' | 'success' | 'custom'


            //////////////////////////
            var dto = {
                from: (new Date($scope.datefrom)).toUTCString(),
                to: (new Date($scope.dateEnd)).toUTCString(),
                baseDate: $scope.baseDate,
                airport: $scope.airportEntity ? $scope.airportEntity.Id : -1,
                customer: Config.CustomerId,
                tzoffset: -1 * (new Date()).getTimezoneOffset(),
                //yati
                userid: $rootScope.userId ? $rootScope.userId : -1,

            };

            flightService.getUpdatedFlights(dto).then(function (response) {

                $scope.baseDate = (new Date(Date.now())).toUTCString();

                $.each(response.flights, function (_i, _d) {
                    _d.STD = moment(_d.STD);
                    _d.STA = moment(_d.STA);
                    _d.ChocksIn = moment(_d.ChocksIn);
                    _d.ChocksOut = moment(_d.ChocksOut);
                    var _flight = Enumerable.From($scope.ganttData.flights).Where('$.ID==' + _d.ID).FirstOrDefault();
                    if (_flight)
                        for (var key in _d) {
                            if (_d.hasOwnProperty(key)) {
                                _flight[key] = _d[key];

                            }
                        }
                    //var data = Enumerable.From($scope.dataSource).Where("$.ID==" + _d.ID).FirstOrDefault();
                    //if (data) {


                    //    $scope.doActionCompleteSave = false;
                    //    $scope.fillFlight(data, _d);
                    //    Flight.processDataOffBlock(data);
                    //    $scope.addUpdatedFlights(data);


                    //    ganttObj.reRenderChart();


                    //    if ($scope.flight)
                    //        $('.task-' + $scope.flight.ID).parent().addClass('e-gantt-taskbarSelection');

                    //    $scope.calculateSummary();

                    //}
                });
                if (response.summary != -1)
                    $scope.baseSum = response.summary;
                ///////////////////////////////////////////
                ////////////////////////////////////////////
                if (response && response.flights && response.flights.length > 0) {
                    var ff = response.flights[0];
                    var time = moment(ff.DateStatus).format("MMMM Do YYYY, h:mm:ss a");
                    var text = ff.FromAirportIATA + "-" + ff.ToAirportIATA + ", " + ff.FlightNumber + ", " + ff.FlightStatus;
                    //DevExpress.ui.notify({
                    //    contentTemplate: function (e) {
                    //        var html = "<div style='width:100%;text-align:center'><span style=' font-size:16px;display:inline-block'>" + time + ": </span> "
                    //            + "<span style=' font-size:16px;display:inline-block;font-weight:bold;margin-left:10px'>" + text + "</span> <div>";
                    //        return html;
                    //    },
                    //    // message: "fight updated",
                    //    position: {
                    //        my: "top center",
                    //        at: "top center"
                    //    },
                    //    type: 'custom',
                    //    displayTime: 5000,
                    //    minHeight: 100,
                    //});
                }

                //////////////////////////////////////////
                $scope.getBoardSummary($scope.selectedDate);
                ///////////////////////////////////////////

            }, function (err) { });

            /////////////////////////////
            $scope.StartUTimer();
        }, 1000 * 30);
    };
    $scope.StopUTimer = function () {
        if ($scope.utimer)
            clearTimeout($scope.utimer);
    };

    $scope.finished = function () {
        $scope.flightsRendered++;
        if ($scope.flightsRendered == $scope.ganttData.flights.length) {
            $scope.refreshHeights();
            //if ($scope.IsNowLine) {
            //    $scope.autoUpdate = true;
            //    $scope.StartUTimer();

            //}
            //if ( $scope.selectedTabDateIndex =-1)
            $scope.selectedTabDateIndex = 0;

        }

        //$scope.scrollFirstFlight();
    };

    $scope.scrollTo = function (dt) {
        var _left = $scope.getDuration(new Date($scope.datefrom), dt);
        var nowleft = (_left * (hourWidth + 1)) - 1;
        $('.col-flights').scrollLeft(nowleft - 50);
        //$('.col-flights').animate({
        //    scrollLeft: nowleft-50
        //}, 500);
    };

    $scope.scrollFirstFlight = function () {
        var std = new Date($scope.ganttData.flights[0].STD);
        $scope.scrollTo(std);
    };
    $scope.scrollFirstFlightDate = function (dt) {
        var std = Enumerable.From($scope.ganttData.flights).Where(function (x) { return new Date(x.STD) >= dt; }).ToArray();
        //ew Date($scope.ganttData.flights[0].STD);
        if (std && std.length > 0) {

            $scope.scrollTo(new Date(std[0].STD));
        }
        else
            $scope.scrollTo(new Date(dt));


    };

    $scope.test = function () {
        // $scope.ganttData.resources[0].flights.push($scope.ganttData.resources[1].flights[0]);
        // $scope.scrollTo(new Date());
        $scope.clearGantt();

    }
    $scope.flight = null;
    $scope.selectFlight = function (f) {
        $scope.flight = f;
        $scope.showLog();
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
    ///////////////////////////////////

    ////////////////////////////////
    $scope.FromWeatherVisible = true;
    $scope.formatCellDateDay = function (dt) {
        return moment(new Date(dt)).format('DD');
    };
    $scope.formatCellDatePersian = function (dt) {
        persianDate.toLocale('en');
        return new persianDate(new Date(dt)).format("DD-MM-YY");

    };
    $scope.moment = function (date) {
        return moment(date).format('MMMM Do YYYY');
    };
    $scope.momenttime = function (date) {
        if (!date)
            return '--';
        return moment(date).format('HH:mm');
    };
    $scope.getCrewAbs = function (fid) {
        $scope.loadingVisible = true;


        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_abs_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.scroll_1 = {
        scrollByContent: true,
        scrollByThumb: true,
        //bindingOptions: { height: 'scroll_height', }
        height: function () { return $(window).height() - 120 },
        //height: 571,
    };
    ////////////////////////////////
    //7-31
    $scope.dg_columns3 = [


        { dataField: 'Title', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'Value', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },



    ];
    $scope.dg3_selected = null;
    $scope.dg3_instance = null;
    $scope.dg3_ds = null;
    $scope.dg3_height = $scope.bottom - 108;
    $scope.dg3 = {
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

        columnAutoWidth: true,
        // height: $scope.bottom-108,

        columns: $scope.dg_columns3,
        onContentReady: function (e) {
            if (!$scope.dg3_instance)
                $scope.dg3_instance = e.component;

        },
        onRowPrepared: function (e) {
            //if (e.rowType === "data") {
            //    var day = (new Date(e.data.STDDay)).getDay();
            //    e.rowElement.css("backgroundColor", $scope.palete[day]);
            //}
            //42 %  10

        },
        showColumnHeaders: false,
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg3_selected = null;
            }
            else
                $scope.dg32_selected = data;


        },
        onCellPrepared: function (e) {
            //lightgray
            if (e.rowType === "data" && e.column.dataField == "Title")
                e.cellElement.css("backgroundColor", "lightgray");
            if (e.rowType === "data" && e.column.dataField == "Value" && e.data.Title == 'FDP' && $scope.FDPStat.IsOver)
                e.cellElement.css("backgroundColor", "#ffcccc");

        },

        bindingOptions: {
            dataSource: 'dg3_ds',
            height: 'dg3_height'
        }
    };


    //////////////////////////////////
    $scope.ati_selectedFlights = null;
    $scope.rangeFdps = [];
    $scope.rangeCrews = [];
    $scope.ati_fdps = [];
    $scope.selectedFlightsKey = null;
    $scope.setSelectedFlightsKey = function () {
        if (!$scope.ati_selectedFlights || $scope.ati_selectedFlights.length == 0) {
            $scope.selectedFlightsKey = null;

        }
        else {
            var _fs = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.sta); }).ToArray();
            var _fsid = [];
            var _fsno = [];
            $.each(_fs, function (_i, _d) {
                _fsid.push(_d.Id + (_d.dh == 1 ? '*1' : ''));
                _fsno.push(_d.no + (_d.dh == 1 ? '*1' : ''));
            });
            $scope.selectedFlightsKey = { Id: _fsid.join('_'), no: _fsno.join('_') };
        }
    };
    $scope.formatNOs = function (str) {
        return str.split('_').join(',');
    }
    $scope.getRangeStyle = function () {
        return {
            padding: '0px 2px 0 3px',
            //overflowY:'auto',
            height: ($(window).height() - $scope.bottom + 1) + 'px',
        };
    };
    $scope.getRangeStyleHeader = function () {
        return {

            height: ($(window).height() - $scope.bottom - 23) + 'px',
        };
    }
    $scope.getRankOrder = function (rnk, index) {
        if (rnk == 'IP')
            return 0;
        if (rnk == 'P1')
            return 1;
        if (rnk == 'P2')
            return 2;
        if (rnk == 'SAFETY')
            return 3;
        if (rnk == 'ISCCM')
            return 4;
        if (rnk == 'SCCM')
            return 5;
        if (rnk == 'CCM')
            return 6 + index;
        return 1000;

    };

    $scope.fillRangeCrews = function () {
        $scope.rangeCrews = [];
        //var _selectedfids=Enumerable.From($scope.ati_selectedFlights).Select('$.Id').ToArray();
        var table = [];
        console.log('fill range crews');
        var seletedIds = Enumerable.From($scope.ati_selectedFlights).Select('$.Id').ToArray();
        var flts = Enumerable.From($scope.ati_flights).Where(function (x) { return seletedIds.indexOf(x.ID) != -1; }).ToArray();
        console.log(flts);
        $.each(flts, function (_i, _f) {
            $.each(_f.crew, function (_j, _c) {

                var exist = Enumerable.From(table).Where('$.Id==' + _c.Id).FirstOrDefault();
                if (exist)
                    exist.count++;
                else
                    table.push({ Id: _c.Id, count: 1, rank: _c.rank, name: _c.name, order: _c.order });
            });
        });
        $scope.rangeCrews = Enumerable.From(table).Where('$.count==' + seletedIds.length).OrderBy('$.order').ToArray();

    };

    $scope.fillRangeFdps = function () {
        // $scope.ati_selectedFlights.push({Id:$d.data('flightid'), dh:!$d.data('dh')?0:$d.data('dh'), sta:new Date($d.data('sta')), std:new Date($d.data('std')), no:$d.data('no') });
        //$.each($scope.ati_selectedFlights,function(_i,_d){
        //    fdp.ids.push({id:_d.Id,dh:_d.dh});
        //});

        $scope.rangeFdps = [];
        var _selectedfids = Enumerable.From($scope.ati_selectedFlights).Select('$.Id').ToArray();
        var _selectedNos = Enumerable.From($scope.ati_selectedFlights).Select('$.no').ToArray().join(',');
        //alert(_selectedNos);
        $.each($scope.ati_fdps, function (_i, _d) {

            var _ids = Enumerable.From(_d.ids).Where(function (x) {
                return _selectedfids.indexOf(x.id) != -1;
            }).ToArray();
            if (_ids.length/*==_d.ids.length*/ > 0) {
                var exist = Enumerable.From($scope.rangeFdps).Where('$.key=="' + _d.key + '"').FirstOrDefault();
                if (!exist) {
                    exist = { key: _d.key, no: _d.no, fdps: [] };
                    $scope.rangeFdps.push(exist);
                }
                exist.fdps.push(_d);
            }
            //if (_selectedNos.indexOf(_d.flts)!=-1 || _d.flts.indexOf(_selectedNos)!=-1){
            //    var exist=Enumerable.From($scope.rangeFdps).Where('$.key=="'+_d.key+'"').FirstOrDefault();
            //        if (!exist){
            //            exist={key:_d.key,no:_d.no,fdps:[]};
            //            $scope.rangeFdps.push(exist);
            //        }
            //        exist.fdps.push(_d);
            //}
        });

        $.each($scope.rangeFdps, function (_i, _d) {
            console.log('piano');
            console.log(_d.key);
            if (_d.fdps) {
                _d.fdps = Enumerable.From(_d.fdps).OrderBy(function (x) { return $scope.getRankOrder(x.rank, x.index); }).ToArray();

            }
        });


    }
    $scope.removeAssignedFDP = function (id, callback) {


        var dto = { Id: id };
        $scope.loadingVisible = true;
        flightService.deleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;

            callback(response);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    //2020-11-22  
    $scope.notifyPos = function (id) {

        var fdp = Enumerable.From($scope.ati_fdps).Where('($.crewId==' + id + ' && $.key=="' + $scope.selectedFlightsKey.Id + '")').ToArray()[0];

        if (fdp) {


            var dto = { Ids: [fdp.Id] };

            dto.Date = new Date();
            dto.UserName = $rootScope.userName;
            $scope.loadingVisible = true;

            flightService.dutiesSendSMS(dto).then(function (response) {
                $scope.loadingVisible = false;
                General.ShowNotify("The message/notification was successfully sent.", 'success');


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }
    };
    $scope.removePos = function (id, rnk) {

        if (!$scope.editable && !$scope.isAdmin) {

            var myDialog = DevExpress.ui.dialog.custom({
                rtlEnabled: true,
                title: "Error",
                message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                buttons: [{ text: "OK", onClick: function () { } }]
            });
            myDialog.show();
            return;
        }
        var fdp = Enumerable.From($scope.ati_fdps).Where('($.crewId==' + id + ' && $.key=="' + $scope.selectedFlightsKey.Id + '")').ToArray()[0];

        if (fdp) {
            $scope.removeAssignedFDP(fdp.Id, function (_flt) {
                var _cr = Enumerable.From($scope.ds_crew).Where('$.Id==' + id).FirstOrDefault();
                if (_cr && _cr.FlightSum) {
                    _cr.FlightSum = _cr.FlightSum - _flt;
                }
                $scope.currentAssigned.CrewIds = Enumerable.From($scope.currentAssigned.CrewIds).Where('$!=' + id).ToArray();
                $scope.currentAssigned[rnk + 'Id'] = null;
                $scope.currentAssigned[rnk] = null;
                $scope.currentAssigned[rnk + 'Group'] = null;
                $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where('!($.crewId==' + id + ' && $.key=="' + $scope.selectedFlightsKey.Id + '")').ToArray();
                $scope.fillFilteredCrew();
                $scope.fillRangeFdps();
                $scope.fillFlightCrews();
                $scope.fillRangeCrews();

            });


        }


    }


    $scope.clearPos = function (keep) {
        var rnks = ['P11', 'P12', 'P13', 'P14', 'P15', 'P21',
            'P22', 'P23', 'P24', 'P25',
            'ISCCM1', 'ISCCM2', 'ISCCM3', 'ISCCM4', 'ISCCM5',
            'SCCM1', 'SCCM2', 'SCCM3', 'SCCM4', 'SCCM5',
            'CCM1', 'CCM2', 'CCM3', 'CCM4', 'CCM5',
            'IP1', 'IP2', 'IP3', 'IP4', 'IP5',
            'OBS1', 'OBS2', 'OBS3', 'OBS4', 'OBS5',
            'CHECK1', 'CHECK2', 'CHECK3', 'CHECK4', 'CHECK5',
            'SAFETY1', 'SAFETY2', 'SAFETY3', 'SAFETY4', 'SAFETY5',
        ];
        $.each(rnks, function (_i, rnk) {
            $scope.currentAssigned[rnk + 'Id'] = null;
            $scope.currentAssigned[rnk] = null;
            $scope.currentAssigned[rnk + 'Group'] = null;

        });
        $scope.currentAssigned.CrewIds = [];
        if (!keep) {
            $('.crewpos').removeClass('selected');

            $scope.selectedPos = null;
        }
        $scope.fillFilteredCrew();
    }

    $scope.indexPos = {
        SCCM: 1,
        P1: 1,
        P2: 1,
        IP: 0,
        OBS: 0,
        CHECK: 0,
        CCM: 3,
        ISCCM: 0,
        SAFETY: 0,

    };
    $scope.posVisible = {
        IP1: false,
        IP2: false,
        IP3: false,
        IP4: false,
        IP5: false,
        ISCCM1: false,
        ISCCM2: false,
        ISCCM3: false,
        ISCCM4: false,
        ISCCM5: false,
        SCCM2: false,
        SCCM3: false,
        SCCM4: false,
        SCCM5: false,
        OBS1: false,
        OBS2: false,
        OBS3: false,
        OBS4: false,
        OBS5: false,
        CHECK1: false,
        CHECK2: false,
        CHECK3: false,
        CHECK4: false,
        CHECK5: false,
        SAFETY1: false,
        SAFETY2: false,
        SAFETY3: false,
        SAFETY4: false,
        SAFETY5: false,
        P12: false,
        P13: false,
        P14: false,
        P15: false,
        P22: false,
        P23: false,
        P24: false,
        P25: false,
        CCM4: false,
        CCM5: false,

    };
    $scope.posVisibleClick = function (pos) {
        if ($scope.currentAssigned[pos]) {
            General.ShowNotify("Please remove ASSIGNED CREW.", 'error');
            return;
        };
        $scope.posVisible[pos] = !$scope.posVisible[pos];
    };
    $scope.posVisibleClick2 = function (pos) {

        if ($scope.indexPos[pos] == 5)
            return;


        $scope.indexPos[pos]++;
        if ($scope.posVisible[pos + $scope.indexPos[pos].toString()])
            $scope.posVisibleClick2(pos);
        $scope.posVisible[pos + $scope.indexPos[pos].toString()] = true;
    };
    $scope.getSelectedPosStyle = function (pos) {
        if ($scope.posVisible[pos])
            return {
                background: '#00b386',
                color: 'white',
            };
        else
            return {
                background: 'white',
                color: 'gray',
            };
    }
    $scope.refreshPos = function () {
        $scope.indexPos = {
            SCCM: 1,
            P1: 1,
            P2: 1,
            IP: 0,
            OBS: 0,
            CHECK: 0,
            CCM: 3,
            ISCCM: 0,
            SAFETY: 0,

        };
        $scope.posVisible.IP1 = false;
        $scope.posVisible.IP2 = false;
        $scope.posVisible.IP3 = false;
        $scope.posVisible.IP4 = false;
        $scope.posVisible.IP5 = false;
        $scope.posVisible.ISCCM1 = false;
        $scope.posVisible.ISCCM2 = false;
        $scope.posVisible.ISCCM3 = false;
        $scope.posVisible.ISCCM4 = false;
        $scope.posVisible.ISCCM5 = false;
        $scope.posVisible.SCCM2 = false;
        $scope.posVisible.SCCM3 = false;
        $scope.posVisible.SCCM4 = false;
        $scope.posVisible.SCCM5 = false;
        $scope.posVisible.CCM4 = false;
        $scope.posVisible.CCM5 = false;
        $scope.posVisible.OBS1 = false;
        $scope.posVisible.OBS2 = false;
        $scope.posVisible.OBS3 = false;
        $scope.posVisible.OBS4 = false;
        $scope.posVisible.OBS5 = false;
        $scope.posVisible.CHECK1 = false;
        $scope.posVisible.CHECK2 = false;
        $scope.posVisible.CHECK3 = false;
        $scope.posVisible.CHECK4 = false;
        $scope.posVisible.CHECK5 = false;
        $scope.posVisible.SAFETY1 = false;
        $scope.posVisible.SAFETY2 = false;
        $scope.posVisible.SAFETY3 = false;
        $scope.posVisible.SAFETY4 = false;
        $scope.posVisible.SAFETY5 = false;

        $scope.posVisible.P12 = false;
        $scope.posVisible.P13 = false;
        $scope.posVisible.P14 = false;
        $scope.posVisible.P15 = false;

        $scope.posVisible.P22 = false;
        $scope.posVisible.P23 = false;
        $scope.posVisible.P24 = false;
        $scope.posVisible.P25 = false;
    };

    $scope.fillPos = function (keep) {
        $scope.refreshPos();
        //2021-1-4
        $scope.posVisible.IP1 = false;
        $scope.posVisible.ISCCM1 = false;
        $scope.posVisible.SCCM2 = false;
        $scope.posVisible.OBS1 = false;
        $scope.posVisible.CHECK1 = false;
        $scope.posVisible.SAFETY1 = false;
        ///////////////////////
        $scope.clearPos(keep);
        var _id = $scope.selectedFlightsKey.Id;

        var _fdps = Enumerable.From($scope.ati_fdps).Where("$.key=='" + _id + "'").ToArray();

        $.each(_fdps, function (_i, _d) {
            $scope.currentAssigned.CrewIds.push(_d.crewId);
            $scope.currentAssigned[_d.rank + _d.index.toString() + 'Id'] = _d.crewId;
            $scope.currentAssigned[_d.rank + _d.index.toString()] = _d.scheduleName;
            $scope.currentAssigned[_d.rank + _d.index.toString() + 'Group'] = _d.group;


            //2021-1-4
            $scope.posVisible[_d.rank + _d.index.toString()] = true;

        });

        $scope.fillFilteredCrew();
    }
    /////////////////////////////////////////
    $scope.offReason = 5;
    $scope.offRemark = null;
    /*$scope.offReasonDs=[
         {id:5,title:'Canceled - Rescheduling'}
        ,{id:1,title:'Refused'}
         
        ,{id:2,title:'Canceled - Flight(s) cancellations'}
         ,{id:3,title:'Canceled - Change of Aircraft Type'}
           ,{id:4,title:'Canceled - Duty/Flight time limitation'}
            ,{id:6,title:'Canceled - Not using Split Duty'}
    ];*/
    $scope.offReasonDs = [

        { id: 1, title: 'Refused-Sick' }
        , { id: 7, title: 'Refused-Not Home' }
        , { id: 8, title: 'Refused-Family Problem' }

        , { id: 9, title: 'Canceled - Training' }
        , { id: 5, title: 'Canceled - Rescheduling' }
        , { id: 2, title: 'Canceled - Flight(s) cancellations' }
        , { id: 3, title: 'Canceled - Change of Aircraft Type' }
        , { id: 4, title: 'Canceled - Duty/Flight time limitation' }
        , { id: 6, title: 'Canceled - Not using Split Duty' }

        , { id: 10, title: 'Ground - Operation' }
        , { id: 11, title: 'Ground - Expired License' }
        , { id: 12, title: 'Ground - Medical' }
    ];
    $scope.offNotify = false;
    $scope.check_offnotify = {

        text: "Send Notification",

        bindingOptions: {
            value: 'offNotify',
        }
    };
    $scope.sb_offreason = {
        dataSource: $scope.offReasonDs,
        showClearButton: false,
        searchEnabled: false,

        searchExpr: ["Title"],
        valueExpr: "id",
        displayExpr: "title",
        onValueChanged: function (e) {
            // $scope.buildPickupMessage();
        },
        bindingOptions: {
            value: 'offReason',

        },


    };
    $scope.txt_offremark = {
        height: 100,
        bindingOptions: {
            value: 'offRemark'
        }
    };
    $scope.tempOffFDP = null;
    $scope.tempOffCrew = null;
    $scope.popup_off_visible = false;
    $scope.popup_off_title = 'Cancel/Refuse';
    $scope.popup_off = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_off"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 400,
        width: 500,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', validationGroup: "offflight", onClick: function (arg) {

                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        // $scope.offFlights=function(crew,reason,remark,notify,noflight){
                        //$scope.offNotify
                        //gooz
                        if ($scope.tempOffFDP) {
                            var flts = [];
                            $.each($scope.tempOffFDP.ids, function (_i, _d) {
                                flts.push({ Id: _d.id });
                            });
                            $scope.offFlights(flts, { Id: $scope.tempOffFDP.crewId }, $scope.offReason, $scope.offRemark, $scope.offNotify, 0, function () { $scope.popup_off_visible = false; });
                        }
                        else {
                            $scope.offFlights(null, $scope.tempOffCrew, $scope.offReason, $scope.offRemark, $scope.offNotify, 0, function () { $scope.popup_off_visible = false; });
                        }





                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_off_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {

        },
        onHiding: function () {
            //$scope.offReason=5;
            //$scope.offRemark=null;
            // $scope.offNotify = false;
            $scope.tempOffCrew = null;
            $scope.tempOffFDP = null;
            $scope.popup_off_visible = false;

        },
        bindingOptions: {
            visible: 'popup_off_visible',

            title: 'popup_off_title',

        }
    };

    ////////////////////////////////////////
    $scope.offFlights2 = function (crew) {
        $scope.tempOffCrew = crew;
        $scope.popup_off_visible = true;
    };
    $scope.offFlights3 = function (fdp) {
        $scope.tempOffFDP = fdp;
        $scope.popup_off_visible = true;
    };
    $scope.offFlights4 = function (cid) {
        $scope.tempOffCrew = { Id: cid };
        $scope.popup_off_visible = true;
    };
    $scope.offFlights = function (flights, crew, reason, remark, notify, noflight, callback) {
        //alert('x');
        //console.log('off flights');
        //console.log(crew);
        //console.log($scope.ati_selectedFlights);
        if (!$scope.editable && !$scope.isAdmin) {

            var myDialog = DevExpress.ui.dialog.custom({
                rtlEnabled: true,
                title: "Error",
                message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                buttons: [{ text: "OK", onClick: function () { } }]
            });
            myDialog.show();
            return;
        }
        if (!flights)
            flights = Enumerable.From($scope.ati_selectedFlights).ToArray();
        var fids = Enumerable.From(flights).Select('$.Id').ToArray().join('*');
        var dto = { crewId: crew.Id, flights: fids, reason: reason, remark: remark, notify: notify, noflight: noflight };
        //2020-11-22
        dto.UserName = $rootScope.userName;

        $scope.loadingVisible = true;
        flightService.fdpsOffbyFlights(dto).then(function (response) {
            $scope.loadingVisible = false;

            console.log('off flights result');
            console.log(response);
            //dlumikh
            $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where(function (x) { return response.removed.indexOf(x.Id) == -1 && response.updatedId.indexOf(x.Id) == -1; }).ToArray();
            $.each(response.updated, function (_i, _d) {
                $scope.ati_fdps.push(_d);
            });
            $scope.fillPos(true);
            $scope.fillFilteredCrew();
            $scope.fillRangeFdps();
            $scope.fillFlightCrews();
            $scope.fillRangeCrews();
            if (callback) {
                callback();
            }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.removeFDP = function (fdp) {
        //khar
        if (!$scope.editable && !$scope.isAdmin) {

            var myDialog = DevExpress.ui.dialog.custom({
                rtlEnabled: true,
                title: "Error",
                message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                buttons: [{ text: "OK", onClick: function () { } }]
            });
            myDialog.show();
            return;
        }

        $scope.removeAssignedFDP(fdp.Id, function (_flt) {
            var _cr = Enumerable.From($scope.ds_crew).Where('$.Id==' + fdp.crewId).FirstOrDefault();
            if (_cr && _cr.FlightSum) {
                _cr.FlightSum = _cr.FlightSum - _flt;
            }
            $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where('$.Id!=' + fdp.Id).ToArray();
            $scope.fillPos(true);
            $scope.fillRangeFdps();
            $scope.fillFlightCrews();
            $scope.fillRangeCrews();
        });

    }
    $scope.DatetoStr = function (tempDate) {
        return moment(tempDate).format('YYYYMMDDHHmm');
    };
    $scope.StrToDate = function (str) {
        var a = moment(str, 'YYYYMMDDHHmm');
        return new Date(a);
    };
    //dlutalk
    $scope.getFlightLength = function (fdp) {
        var total = 0;
        $.each(fdp.flights, function (_i, _d) {
            var prts = _d.split('_');
            var _std = prts[2];
            var _sta = prts[3];
            var std = $scope.StrToDate(_std);
            var sta = $scope.StrToDate(_sta);
            var diff = Math.abs(sta - std);
            total += Math.floor((diff / 1000) / 60);
        });

        return total;
    }
    //book
    $scope.fillFlightCrews = function () {
        $.each($scope.ati_flights, function (_i, _d) {
            _d.crew = [];
            _d.P1 = 0;
            _d.IP = 0;
            _d.P2 = 0;
            _d.SCCM = 0;
            _d.ISCCM = 0;
            _d.CCM = 0;
            _d.hasCrew = false;
            _d.hasCabin = false;
            _d.hasCockpit = false;
            _d.hasCrewAll = false;
            _d.hasOffItem = false;
            _d.offItems = [];
        });
        $.each($scope.ati_fdps, function (_i, fdp) {
            $.each(fdp.flights, function (_j, flt) {
                //fdp.flights.push(flt.ID+'_'+_d.dh+'_'+$scope.DatetoStr(new Date(flt.STD))+'_'+$scope.DatetoStr(new Date(flt.STA))+'_'+flt.FlightNumber+'_'+flt.FromAirportIATA+'_'+flt.ToAirportIATA);
                var fid = flt.split('_')[0];
                var dh = flt.split('_')[1];
                var flight = Enumerable.From($scope.ati_flights).Where('$.ID==' + fid).FirstOrDefault();
                if (flight) {

                    flight.crew.push({ name: fdp.scheduleName + (dh == 1 ? '(DH)' : ''), rank: fdp.rank, index: fdp.index, order: $scope.getRankOrder(fdp.rank, fdp.index), dh: dh, Id: fdp.crewId });
                    flight[fdp.rank]++;
                    if (flight[fdp.rank] > 0)
                        flight.hasCrew = true;
                    if (fdp.rank == 'P1' || fdp.rank == 'P2' || fdp.rank == 'IP' || fdp.rank == 'SAFETY')
                        flight.hasCockpit = true;
                    if (fdp.rank == 'ISCCM' || fdp.rank == 'SCCM' || fdp.rank == 'CCM')
                        flight.hasCabin = true;



                }
            });
        });

        $.each($scope.ati_flights, function (_i, _d) {

            var _cbn = _d.ISCCM + _d.SCCM + _d.CCM;

            if (((_d.P1 >= 1 && _d.P2 >= 1) || (_d.IP >= 1 && _d.P2 >= 1) || (_d.IP >= 1 && _d.P1 >= 1)) && /*_d.SCCM>=1 && _d.CCM>=3*/ _cbn >= 4)
                _d.hasCrewAll = true;
            _d.crew = Enumerable.From(_d.crew).OrderBy('$.order').ToArray();
            //if (flight.FlightStatusID==4)
            {
                var _offitems = Enumerable.From($scope.ati_offitems).Where('$.FlightId==' + _d.ID).ToArray();
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7');
                console.log(_offitems);
                _d.offItems = _offitems;
                if (_d.offItems && _d.offItems.length > 0)
                    _d.hasOffItem = true;


            }
        });

        console.log('HAS CREW');
        console.log(Enumerable.From($scope.ati_flights).Where('$.hasCrew').ToArray());
    }
    ////////////////////////////////
    $scope.getDefaultPositionId = function (pos) {

        switch (pos) {
            case 'IP':
            case 'IP1':
            case 'IP2':
            case 'IP3':
            case 'IP4':
            case 'IP5':
            case 'TRE':
            case 'TRI':
            case 'LTC':
                //return 1206;
                return 12000;
            case 'P1':
            case 'P12':
            case 'P13':
            case 'P14':
            case 'P15':
            case 'P11':
                return 1160;
            case 'P2':
            case 'P21':
            case 'P22':
            case 'P23':
            case 'P24':
            case 'P25':
                return 1161;
            case 'Safety':
            case 'Safety1':
            case 'Safety2':
            case 'SAFETY':
            case 'SAFETY1':
            case 'SAFETY2':
            case 'SAFETY3':
            case 'SAFETY4':
            case 'SAFETY5':
                return 1162;
            case 'ISCCM':
            case 'ISCCM1':
            case 'ISCCM2':
            case 'ISCCM3':
            case 'ISCCM4':
            case 'ISCCM5':
                return 10002;
            case 'SCCM':
            case 'SCCM1':
            case 'SCCM2':
            case 'SCCM3':
            case 'SCCM4':
            case 'SCCM5':
                return 1157;
            case 'CCM':
            case 'CCM1':
            case 'CCM2':
            case 'CCM3':
            case 'CCM4':
            case 'CCM5':
                return 1158;
            case 'OBS':
            case 'OBS1':
            case 'OBS2':
            case 'OBS3':
            case 'OBS4':
            case 'OBS5':
                return 1153;
            case 'CHECK':
            case 'CHECK1':
            case 'CHECK2':
            case 'CHECK3':
            case 'CHECK4':
            case 'CHECK5':
                return 1154;
            default:
                return pos;
        }
    };
    $scope.activeStby = function (crew, stbyid, rank, index, fdp) {

        //FDPId
        var flts = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.std); }).ToArray();
        var fltIds = Enumerable.From(flts).Select('$.Id').ToArray();
        var fltIdsStr = fltIds.join('*');

        console.log('stby');
        console.log(flts);

        $scope.loadingVisible = true;
        flightService.checkStbyActivation(($scope.FDPStat.Extended > 0 ? 1 : 0), stbyid, flts[0].Id, $scope.FDPStat.Duty, $scope.FDPStat.MaxFDPExtended).then(function (response) {
            $scope.loadingVisible = false;
            console.log('STBY STAT');
            console.log(response);
            if (response.maxFDPError) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: 'MAX FDP ERROR DUE TO STBY REDUCTION',
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }
            if (response.durationError) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: 'TOTAL DURATION IS GREATER THAN 18 HOURS',
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }

            //dlunaz
            var dto = {
                crewId: crew.Id,
                stbyId: stbyid,
                fids: fltIdsStr,
                rank: $scope.getDefaultPositionId(rank),
                index: index,
            };
            $scope.loadingVisible = true;

            flightService.activateStby(dto).then(function (response) {
                $scope.loadingVisible = false;
                console.log('stby activated');
                console.log(response);
                var fdpId = response.Id; //$scope.activatedStbys.length + 1;
                fdp.Id = fdpId;

                $scope.ati_fdps.push(fdp);

                $scope.currentAssigned.CrewIds.push(crew.Id);
                $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'] = crew.Id;
                $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString()] = crew.ScheduleName;
                $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Group'] = crew.JobGroup;
                if (!crew.FlightSum)
                    crew.FlightSum = 0;
                crew.FlightSum += $scope.FDPStat.Flight;
                $scope.fillFilteredCrew();
                $scope.fillRangeFdps();
                $scope.fillFlightCrews();
                $scope.fillRangeCrews();


                //dluparvar
                General.Confirm("Do you want to send notification?", function (res) {
                    if (res) {
                        $scope.notifyDutyCal(response);

                    }
                });


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    ////////////////////////////////
    var _fdp_id = -1;
    $scope.crewClick = function (crew, $event) {
        if ($event.ctrlKey) {

            if (!$scope.editable && !$scope.isAdmin) {

                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }


            if (!($scope.ati_selectedFlights && $scope.ati_selectedFlights.length > 0)) {
                General.ShowNotify("No Flight(s) Selected.", 'error');

                return;
            }

            if ($scope.FDPStat.IsOver) {
                if ($scope.FDPStat.AllowedExtension == 0 || !$scope.useExtension) {
                    General.ShowNotify('The FDP is OVER', 'error');
                    return;
                }



            }
            if ($scope.FDPStat.WOCLError == 1) {

                General.ShowNotify('Not Allowed(WOCL encroachment)', 'error');
                return;


            }

            /////////////10-15
           
            if (!crew.RemainMedical || crew.RemainMedical < 0) {
                var _mestr = 'Medical ' + (crew.MedicalExpired ? moment(crew.MedicalExpired).format('YYYY-MM-DD') : 'UNKNOWN');
                var _myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Confirm",
                    message: _mestr,
                    buttons: [{ text: "Ok", onClick: function () { } }]
                });
                _myDialog.show();
                return;
            }





            var expired = [];

            if (!crew.RemainSEPT || crew.RemainSEPT < 0) {

                expired.push('SEPT ' + (crew.SEPTExpired ? moment(crew.SEPTExpired).format('YYYY-MM-DD') : 'UNKNOWN'));
            }
            
            if (!crew.RemainMedical || crew.RemainMedical < 0)
                expired.push('Medical ' + (crew.MedicalExpired ? moment(crew.MedicalExpired).format('YYYY-MM-DD') : 'UNKNOWN'));

            if (!crew.RemainCMC || crew.RemainCMC < 0)
                expired.push('CMC ' + (crew.CMCExpired ? moment(crew.CMCExpired).format('YYYY-MM-DD') : 'UNKNOWN'));




            if (!crew.RemainDG || crew.RemainDG < 0)
                expired.push('DG ' + (crew.DGExpired ? moment(crew.DGExpired).format('YYYY-MM-DD') : 'UNKNOWN'));



          //  if (!crew.RemainCCRM || crew.RemainCCRM < 0)
           //     expired.push('CCRM ' + (crew.CCRMExpired ? moment(crew.CCRMExpired).format('YYYY-MM-DD') : 'UNKNOWN'));



            if (!crew.RemainSMS || crew.RemainSMS < 0)
                expired.push('SMS ' + (crew.SMSExpired ? moment(crew.SMSExpired).format('YYYY-MM-DD') : 'UNKNOWN'));

            if (!crew.RemainAvSec || crew.RemainAvSec < 0)
                expired.push('AvSec ' + (crew.AvSecExpired ? moment(crew.AvSecExpired).format('YYYY-MM-DD') : 'UNKNOWN'));
            if (crew.JobGroupCode.startsWith('00101')) {
                if (!crew.RemainLPC || crew.RemainLPC < 0)
                    expired.push('LPC ' + (crew.LPCExpired ? moment(crew.LPCExpired).format('YYYY-MM-DD') : 'UNKNOWN'));

                if (!crew.RemainLPR || crew.RemainLPR < 0)
                    expired.push('LPR ' + (crew.LPRExpired ? moment(crew.LPRExpired).format('YYYY-MM-DD') : 'UNKNOWN'));
                if (!crew.RemainLicence || crew.RemainLicence < 0)
                    expired.push('Licence ' + (crew.LicenceExpired ? moment(crew.LicenceExpired).format('YYYY-MM-DD') : 'UNKNOWN'));


            }

            //if (crew.RemainFirstAid<0)
            //    expired.push('FirstAid '+moment(crew.FirstAidExpired).format('YYYY-MM-DD'));


            /////////////////////////
            if (expired.length > 0) {
                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Expired Documents",
                    message: expired,
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                 return;
            }

            /////////end 10-15
            var conflict = $scope.checkConflict2($scope.ati_selectedFlights);
            var continuity = $scope.checkContinuity2($scope.ati_selectedFlights);
            /*if (conflict || continuity) {
                General.ShowNotify('Interuption/Continuity Error', 'error');
                 
                
                return;
            }*/
            if ($scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'])
                return;

            var fdp = {};
            _fdp_id--;
            fdp.Id = _fdp_id;
            fdp.key = $scope.selectedFlightsKey.Id;
            fdp.no = $scope.selectedFlightsKey.no;
            fdp.crewId = crew.Id;
            fdp.rank = $scope.selectedPos.rank;
            fdp.index = $scope.selectedPos.index;
            fdp.group = crew.JobGroup;
            fdp.scheduleName = crew.ScheduleName;
            //$scope.ati_flights
            var ordered = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.sta); }).ToArray();

            var first = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[0].Id).FirstOrDefault();
            var last = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].Id).FirstOrDefault();
            fdp.start = (new Date(first.STD)).addMinutes(-60);
            fdp.end = (new Date(last.STA)).addMinutes(30);
            fdp.from = first.FromAirport;
            fdp.to = last.ToAirport;
            fdp.homeBase = crew.BaseAirportId;
            fdp.split = $scope.useSplit;
            //dlutala
            fdp.ids = [];
            fdp.flights = [];
            var _tmp = [];
            $.each(ordered, function (_i, _d) {
                var flt = Enumerable.From($scope.ati_flights).Where('$.ID==' + _d.Id).FirstOrDefault();
                fdp.ids.push({ id: _d.Id, dh: _d.dh });
                _tmp.push(_d.Id + '*' + _d.dh);
                fdp.flights.push(flt.ID + '_' + _d.dh + '_' + $scope.DatetoStr(new Date(flt.STD)) + '_' + $scope.DatetoStr(new Date(flt.STA)) + '_' + flt.FlightNumber + '_' + flt.FromAirportIATA + '_' + flt.ToAirportIATA);
            });
            fdp.key2 = _tmp.join('_');
            if ($scope.useExtension)
                fdp.extension = $scope.FDPStat.AllowedExtension;
            else
                fdp.extension = 0;
            //2020-11-22-2
            fdp.UserName = $rootScope.userName;
            $scope.loadingVisible = true;
            flightService.saveFDP(fdp).then(function (response) {
                $scope.loadingVisible = false;

                if (response.Code == 406) {
                    if (response.data.message) {
                        var myDialog = DevExpress.ui.dialog.custom({
                            rtlEnabled: true,
                            title: "Error",
                            message: response.data.message,
                            buttons: [{ text: "OK", onClick: function () { } }]
                        });
                        myDialog.show();
                    }

                } else
                    if (response.Code == 501) {
                        General.Confirm("The selected crew is on STANDBY. Do you want to activate him/her?", function (res) {
                            if (res) {

                                $scope.activeStby(crew, response.data.Id, fdp.rank, fdp.index, fdp);
                                //personService.delete(dto).then(function (response) {

                                //}, function (err) {  $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error',5000); });

                            }
                        });
                    }
                    else
                        if (response.Code == 304) {
                            var myDialog = DevExpress.ui.dialog.custom({
                                rtlEnabled: true,
                                title: "Error",
                                message: "You can not activate this reserved crew.",
                                buttons: [{ text: "OK", onClick: function () { } }]
                            });
                            myDialog.show();
                        }
                        else {
                            fdp.Id = response.data.Id;

                            $scope.ati_fdps.push(fdp);

                            $scope.currentAssigned.CrewIds.push(crew.Id);
                            $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'] = crew.Id;
                            $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString()] = crew.ScheduleName;
                            $scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Group'] = crew.JobGroup;
                            if (!crew.FlightSum)
                                crew.FlightSum = 0;
                            crew.FlightSum += $scope.FDPStat.Flight;
                            $scope.fillFilteredCrew();
                            $scope.fillRangeFdps();
                            $scope.fillFlightCrews();
                            $scope.fillRangeCrews();
                        }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        }
    };

    $scope.checkConflict = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.STD) >= new Date(_d.STD) && new Date(x.STD) <= new Date(_d.STA))
                    ||
                    (new Date(x.STA) >= new Date(_d.STD) && new Date(x.STA) <= new Date(_d.STA))
                );
            }).FirstOrDefault();
            if (f)
                hasConflict = true;
        });

        return hasConflict;
    };
    $scope.checkContinuity = function (flights) {
        console.log('checkContinuity');
        console.log(flights);
        var hasError = false;
        var ordered = Enumerable.From(flights).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
        $.each(ordered, function (_i, _d) {
            if (_i >= 0 && _i < ordered.length - 1) {

                if (_d.ToAirport != ordered[_i + 1].FromAirport)
                    hasError = true;
            }
        });
        return hasError;

    };
    /////////////////
    $scope.checkConflict2 = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            //_d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.Id != _d.Id && (
                    (new Date(x.std) >= new Date(_d.std) && new Date(x.std) <= new Date(_d.sta))
                    ||
                    (new Date(x.sta) >= new Date(_d.std) && new Date(x.sta) <= new Date(_d.sta))
                );
            }).FirstOrDefault();
            if (f)
                hasConflict = true;
        });

        return hasConflict;
    };
    $scope.checkContinuity2 = function (flights) {

        var hasError = false;
        var ordered = Enumerable.From(flights).OrderBy(function (x) { return new Date(x.std); }).ToArray();
        $.each(ordered, function (_i, _d) {
            if (_i >= 0 && _i < ordered.length - 1) {

                if (_d.ToAirport != ordered[_i + 1].FromAirport)
                    hasError = true;
            }
        });
        return hasError;

    };
    ////////////////////////
    $scope.ati_selectedTypes = [];
    $scope.initSelection = function () {
        /////////////////////////////////


        // Initialize selectionjs
        const selection = Selection.create({

            // Class for the selection-area
            class: 'selection',

            // All elements in this container can be selected
            selectables: ['.box-wrap1 > .flightarea'],

            // The container is also the boundary in this case
            boundaries: ['.mainselection']
        }).on('beforestart', evt => {


            return evt.oe.target.tagName !== 'SPAN';

        }).on('start', ({ inst, selected, oe }) => {

            // Remove class if the user isn't pressing the control key or ⌘ key
            if (!oe.ctrlKey && !oe.metaKey) {

                // Unselect all elements
                for (const el of selected) {
                    el.classList.remove('selected');
                    inst.removeFromSelection(el);
                }

                // Clear previous selection
                inst.clearSelection();

            }
            $scope.rangeFdps = [];
            $scope.clearPos();

        }).on('move', ({ changed: { removed, added } }) => {

            // Add a custom class to the elements that where selected.
            for (const el of added) {
                el.classList.add('selected');
            }

            // Remove the class from elements that where removed
            // since the last selection
            for (const el of removed) {
                el.classList.remove('selected');
            }

        }).on('stop', ({ inst, selected }) => {
            inst.keepSelection();
            $scope.ati_selectedFlights = [];
            $scope.ati_selectedTypes = [];

            //var temps=[];
            //$.each(selected,function(_i,_d){

            //    var $d=$(_d);
            //    temps.push(Enumerable.From($scope.ati_flights).Where('$.ID=='+$d.data('flightid')).FirstOrDefault());


            //});
            //var conflict = $scope.checkConflict(temps);
            //var continuity = $scope.checkContinuity(temps);
            //if (conflict || continuity) {
            //    General.ShowNotify('Interuption/Continuity Error', 'error');
            //    selection.clearSelection();

            //    return;
            //}

            $.each(selected, function (_i, _d) {
                //  alert($(_d).data('flightid')+'    '+ $(_d).data('dh'));
                // console.log();
                var $d = $(_d);
                $scope.ati_selectedFlights.push({ Id: $d.data('flightid'), dh: !$d.data('dh') ? 0 : $d.data('dh'), sta: new Date($d.data('sta')), std: new Date($d.data('std')), no: $d.data('no'), FromAirport: $d.data('from'), ToAirport: $d.data('to') });
                $scope.ati_selectedTypes.push($d.data('type'));

            });
            $scope.ati_selectedTypes = Enumerable.From($scope.ati_selectedTypes).Distinct().ToArray();

            $scope.setSelectedFlightsKey();
            //console.log($scope.ati_selectedTypes);
            $scope.fillPos();
            $scope.fillRangeFdps();
            $scope.useExtension = false;
            $scope.getFDPStat();
            $scope.fillRangeCrews();
        });

        ///////////////////////////////////
    };
    /////////////////////////////////
    $scope.popup_crews_visible = false;
    $scope.popup_crews_title = '';
    $scope.popup_crews = {
        shading: false,

        width: 400,
        height: 400,
        position: 'right top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.shiftFlight = null;
        },
        bindingOptions: {
            visible: 'popup_crews_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_crews_title',

        }
    };

    //close button
    $scope.popup_crews.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_crews_visible = false;

    };
    //////////////////////////////////
    $scope.shiftFlight = null;
    $scope.clickFlight = function (f, $event) {

        $event.stopPropagation();
        if ($event.ctrlKey) {
            $scope.shiftFlight = Enumerable.From($scope.ati_flights).Where('$.Id==' + f.ID).FirstOrDefault();


            $scope.popup_crews_title = $scope.shiftFlight.FlightNumber + ' ' + $scope.shiftFlight.FromAirportIATA + '-' + $scope.shiftFlight.ToAirportIATA;
            if (!$scope.popup_crews_visible)
                $scope.popup_crews_visible = true;

        }
        else {
            var $elem = $($event.currentTarget);
            var dh = 0;
            if (!$elem.hasClass('flightitem')) {

                $elem = $elem.parents(".flightitem");
            }
            var flightarea = $elem.parents(".flightarea");
            if ($elem.hasClass('dh')) {
                $elem.removeClass('dh');
                $(flightarea).data('dh', 0);
                dh = 0;
            } else {
                $elem.addClass('dh');
                $(flightarea).data('dh', 1);
                dh = 1;
            }

            var flt = Enumerable.From($scope.ati_selectedFlights).Where('$.Id==' + f.ID).FirstOrDefault();
            if (flt)
                flt.dh = dh;
            $scope.rangeFdps = [];
            $scope.clearPos();
            $scope.setSelectedFlightsKey();

            $scope.fillPos();
            $scope.fillRangeFdps();
            $scope.getFDPStat();
        }


    };

    $scope.searchStr = null;
    $scope.text_search = {
        placeholder: 'Search',
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            $scope.fillFilteredCrew();
        },
        bindingOptions: {
            value: 'searchStr'
        }
    }
    $scope.selectedPos = null;
    $scope.tempAssignedCrews = [];
    $scope.dg_crew_ds = [];
    $scope.currentAssigned = { CrewIds: [] };
    $scope.getDaysDiff = function (d1, d2) {
        var date1 = new Date(General.getDayFirstHour(d1));
        var date2 = new Date(General.getDayLastHour(d2));

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days;
    };
    $scope.fillFilteredCrew = function () { 

        var dateFirst = new Date();
        if ($scope.ati_selectedFlights && $scope.ati_selectedFlights.length > 0) {
            var ordered = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.sta); }).ToArray();

            var first = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[0].Id).FirstOrDefault();
            dateFirst = new Date(first.ChocksOut);
        }

        var alldh = false;
        var dhflights = Enumerable.From($scope.ati_selectedFlights).Where('$.dh').ToArray();
        if (dhflights.length == $scope.ati_selectedFlights.length)
            alldh = true;


        var _ds = null;
        if (!$scope.selectedPos) {
            $scope.dg_crew_ds = null;
            return;
        }
        var id = $scope.selectedPos.rank;
        switch (id) {
            case 'IP':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') /*&& x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0])!=-1*/;
                }).ToArray();
                break;
            case 'P1':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || ((x.JobGroup == 'P1') && x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1);
                }).ToArray();
                break;
            case 'P2':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'P2' /*|| x.JobGroup=='P1'*/) && x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1;
                }).ToArray();
                break;
            case 'Safety':
            case 'SAFETY':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || (x.JobGroup == 'P1' || x.JobGroup == 'P2') && x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1;
                }).ToArray();
                break;
            case 'ISCCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'ISCCM';
                }).ToArray();
                break;
            case 'SCCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'SCCM' || x.JobGroup == 'ISCCM';
                }).ToArray();
                break;
            case 'CCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).ToArray();
                break;
            case 'CCM1':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).ToArray();
                break;
            case 'CCM2':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).ToArray();
                break;
            case 'CCM3':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).ToArray();
                break;
            case 'OBS':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'SCCM' || x.JobGroup == 'CCM' || x.JobGroup == 'P2' || x.JobGroup == 'P1' || x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC';
                }).ToArray();
                break;
            case 'CHECK':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'CCM' || x.JobGroup == 'SCCM') || ((x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || (x.JobGroup == 'P1' || x.JobGroup == 'P2') && x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1);
                }).ToArray();
                break;
            default:
                break;
        }
        var filtered = Enumerable.From(_ds).Where(function (x) {
            var fltr = $scope.currentAssigned.CrewIds.indexOf(x.Id) == -1;
            if ($scope.searchStr) {
                fltr = fltr && x.ScheduleName.toLowerCase().includes($scope.searchStr.toLowerCase());
            }
            return fltr;
            //var assigned = Enumerable.From($scope.currentAssigned).Where(function(q){ return q.CrewIds.indexOf(x.Id)!=-1;}).ToArray();
            //if (assigned && assigned.length > 0) {

            //    return false;
            //}
            //else
            //    return true;
        }).ToArray();
        //$scope.dg_crew_ds = Enumerable.From(filtered).OrderBy('$.GroupOrder').ThenBy('$.RosterFlights').ThenBy('$.Flight28').ThenBy('$.Duty7').ThenBy('$.ScheduleName').ToArray();
        $.each(filtered, function (_i, _d) {
            _d.RemainMedical = !_d.MedicalExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.MedicalExpired));
            _d.RemainCMC = !_d.CMCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CMCExpired));

            _d.RemainSEPT = !_d.SEPTExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SEPTExpired));
            _d.RemainDG = !_d.DGExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.DGExpired));
            _d.RemainCCRM = !_d.CCRMExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CCRMExpired));
            _d.RemainSMS = !_d.SMSExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SMSExpired));
            _d.RemainAvSec = !_d.AvSecExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.AvSecExpired));
            _d.RemainLPC = !_d.LPCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPCExpired));
            _d.RemainLPR = !_d.LPRExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPRExpired));
            _d.RemainFirstAid = !_d.FirstAidExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.FirstAidExpired));
            _d.RemainLicence = !_d.LicenceExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LicenceExpired));



        });


        $scope.dg_crew_ds = Enumerable.From(filtered).OrderBy('$.FlightSum').ThenBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();


    };


    //jooj
    $scope.posClick = function (rank, index, $event) {
        if ($scope.ati_selectedFlights && $scope.ati_selectedFlights.length > 0) {
            if ((rank == 'P1' || rank == 'P2' /*|| rank=='IP'*/) && $scope.ati_selectedTypes.length > 1) {
                General.ShowNotify("Multiple Types Not Allowd.", 'error');
                return;
            }
            var $elem = $($event.currentTarget);
            $scope.searchStr = null;
            $('.crewpos').removeClass('selected');
            $elem.addClass('selected');
            $scope.selectedPos = { rank: rank, index: index };
            $scope.fillFilteredCrew();
        }
        else {
            General.ShowNotify("No Flight(s) Selected.", 'error');
            return;
        }

    };

    $scope.useExtension = false;
    $scope.check_extension = {
        width: '100%',
        text: "Use Extension",

        bindingOptions: {
            value: 'useExtension',

        }
    };
    $scope.useSplit = false;
    $scope.check_split = {
        width: '100%',
        text: "Use Split",
        onValueChanged: function (e) {
            if ($scope.IsSplitVisible) {
                if (e.value) {
                    $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDPExtended;
                }
                else {
                    $scope.FDPStat.IsOver = $scope.FDPStat.Duration > $scope.FDPStat.MaxFDP;
                }
                $scope.dg3_instance.refresh();
            }
        },
        bindingOptions: {
            value: 'useSplit',

        }
    };
    $scope.FDPStat = null;
    $scope.IsExtensionVisible = false;
    $scope.IsSplitVisible = false;
    $scope.getFDPStat = function () {
        $scope.IsExtensionVisible = false;
        $scope.IsSplitVisible = false;
        $scope.loadingVisible = true;
        var ids = Enumerable.From($scope.ati_selectedFlights).Select('$.Id').ToArray();
        var dhs = Enumerable.From($scope.ati_selectedFlights).Where('$.dh==1').ToArray().length;
        flightService.getFDPStats(ids.join('_'), dhs).then(function (response) {


            $scope.loadingVisible = false;
            try {
                var _end = (new Date(response.RestFrom)).addMinutes(-30);

                $scope.editable = !(_end < $scope.firstHour);


            }
            catch (e) {

            }




            $scope.FDPStat = response;
            response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
            response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
            response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
            response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
            response.AllowedExtensionStr = pad(Math.floor(response.AllowedExtension / 60)).toString() + ':' + pad(Math.round(response.AllowedExtension % 60)).toString();
            response.WOCLStr = pad(Math.floor(response.WOCL / 60)).toString() + ':' + pad(Math.round(response.WOCL % 60)).toString();
            response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
            response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
            response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
            $scope.dg3_ds = [];
            $scope.dg3_height = $scope.bottom - 108;
            //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
            $scope.dg3_ds.push({ Title: 'WOCL', Value: response.WOCLStr });

            if (response.Extended > 0) {
                $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                $scope.dg3_ds.push({ Title: 'By Split', Value: response.ExtendedStr });
                $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });
                $scope.dg3_height = $scope.bottom - 108 - 60;
                $scope.IsSplitVisible = true;
                $scope.useSplit = true;
            } else
                if (response.AllowedExtension > 0) {
                    $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPExtendedStr });
                    $scope.dg3_ds.push({ Title: 'By Extension', Value: response.AllowedExtensionStr });
                    $scope.dg3_height = $scope.bottom - 108 - 60;
                    $scope.IsExtensionVisible = true;
                } else {
                    $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                    //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPExtendedStr });
                }


            $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
            $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
            $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
            $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });
        });
    };
    ///////////////////////////////////
    $scope.ati_offitems = [];
    $scope.getRosterFDPs = function (callback) {

        var _df = moment($scope.dt_fromSearched).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment($scope.dt_toSearched).format('YYYY-MM-DDTHH:mm:ss');
        $scope.ati_fdps = [];
        $scope.ati_offitems = [];
        $scope.loadingVisible = true;
        flightService.getRosterFDPs(_df, _dt).then(function (response) {

            flightService.getOffItems(_df, _dt).then(function (response2) {
                $scope.loadingVisible = false;
                $.each(response, function (_i, _d) {
                    $scope.ati_fdps.push(_d);
                });
                $.each(response2, function (_i, _d) {
                    $scope.ati_offitems.push(_d);
                });
                console.log('$scope.ati_offitems');
                console.log($scope.ati_offitems);
                $scope.fillFlightCrews();
                if (callback)
                    callback(response);
            });


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.$on('$viewContentLoaded', function () {

        $('.fdps').fadeIn(400, function () {
            ////////////////////////////////
            setTimeout(function () {
                $scope.bindFlights(function () {
                    $scope.fillCrew();
                    $scope.createGantt();
                    $scope.initSelection();
                    $scope.getRosterFDPs(function (ds) { });



                    if ($(window).width() > $(window).height()) {
                        //height: calc(100% - 300px);
                        //$scope.footerfilter = false;
                        $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
                    }
                    //else {
                    //    $scope.footerfilter = true;
                    //    $('.gantt-main-container').height($(window).height() - 205);
                    //}
                });
            }, 2000);








            ///////////////////////////////////
        });


    });

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }

    $scope.$on("$destroy", function (event) {
        $scope.StopUTimer();
        //$scope.StopNowLineTimer();
        $scope.stop();

    });

    var appWindow = angular.element($window);

    appWindow.bind('resize', function () {
        return;
        if ($(window).width() > $(window).height()) {
            $scope.$apply(function () {
                $scope.footerfilter = false;
                $scope.IsLandscape = true;

            });

            $('.gantt-main-container').height($(window).height() - 85);


        } else {
            // alert('x');
            $scope.$apply(function () {

                $scope.footerfilter = true;
                $scope.IsLandscape = false;

            });
            $('.gantt-main-container').height($(window).height() - 205);
        }

    });


    //////////////////////////////////////

}]);