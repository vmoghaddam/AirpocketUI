'use strict';
app.controller('fdpsController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window) {
    $scope.OnlyRoster = false;
    if ($rootScope.userName.toLowerCase() == 'train.moradi' || $rootScope.userName.toLowerCase() == 'mohammadifard')
        $scope.OnlyRoster = true;
    //soltani
    $scope.OnlyTraining = false;
    if ($rootScope.userName.toLowerCase() == 'train.moradi' || $rootScope.userName.toLowerCase() == 'mohammadifard' || $rootScope.userName.toLowerCase() == 'demo')
        $scope.OnlyTraining = true;

    $scope.ShowFunctions = !$scope.OnlyRoster;


    $scope.Operator = $rootScope.CustomerName.toUpperCase();
    $scope.firstHour = new Date(General.getDayFirstHour(new Date()));
    $scope.editable = true;
    $scope.isAdmin =
        $route.current.isAdmin;

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
        { text: "Assigned", id: 'ASSIGNED' }

    ];
    $scope.$watch("selectedTabDetIndex", function (newValue) {
        //ati
        try {
            $('.tabdet').hide();
            var id = $scope.tabsdet[newValue].id;
            $scope.selectedTabDetId = id;
            $('#' + id).fadeIn();
            if (id == 'ASSIGNED')
                $scope.getAssigned();
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
    $scope._formatMinutes = function (mm) {

        if (!mm)
            return "00:00";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    $scope.formatMinutes = function (mm) {
        
        
        if (!mm && mm !== 0)
            return "-";
        var sgn = "";
        if (mm < 0)
            sgn = "-";
        mm = Math.abs(Math.round(mm));
        return sgn + pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.round((mm % 60) )).toString();
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
        flightService.getCrewForRosterByDateNew(1, _dt).then(function (response) {

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


            //$scope.popup_report_visible = true;
            $scope.popup_reportfp_visible = true;
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
    $scope.erptcd_caco = 'All';

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

                            //$scope.dg_cduties_instance.refresh();
                            ///////////////////////////
                            // $scope.start();



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            //2020-11-24
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Visible', onClick: function (arg) {
                        //$scope.dg_cduties_instance.refresh();


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
                                flightService.dutiesVisible(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $.each(selected, function (_i, _d) {
                                        if (!_d.DateConfirmed) { _d.IsConfirmed = 1; _d.DateConfirmed = new Date(); }

                                    });

                                    $scope.dg_cduties_instance.refresh();

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                        });






                    }
                }, toolbar: 'bottom'
            },
            //2020-11-24
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Notify By Date', onClick: function (arg) {

                        $scope.popup_datessms_visible = true;


                    }
                }, toolbar: 'bottom'
            },
            ///////////////////////////
            //2020-11-24
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Visible By Date', onClick: function (arg) {

                        $scope.popup_dates_visible = true;


                    }
                }, toolbar: 'bottom'
            },
            ///////////////////////////
            //2020-11-24
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Hide', onClick: function (arg) {

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
                                flightService.dutiesHide(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $.each(selected, function (_i, _d) {
                                        if (_d.DateConfirmed) { _d.IsConfirmed = null; _d.DateConfirmed = null; }

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
    $scope.popup_eduties_visible = false;
    $scope.popup_eduties_title = 'Exceeded FDPs Report';
    $scope.rptcd_caco = 'All';

    $scope.popup_eduties = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_eduties"
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
                        $scope.erptcd_dateFrom = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 120,
                    onValueChanged: function (e) {
                        $scope.erptcd_dateTo = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: ['All', 'COCKPIT', 'CABIN'],
                    onValueChanged: function (e) {
                        $scope.erptcd_caco = e.value;
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
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_eduties_visible = false;

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
            $scope.popup_eduties_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cduties_visible',

            title: 'popup_cduties_title',
            'toolbarItems[0].options.value': 'erptcd_dateFrom',
            'toolbarItems[1].options.value': 'erptcd_dateTo',
            'toolbarItems[2].options.value': 'erptcd_caco',
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


    ////FIXTIME 2021-12-26
    $scope.btn_fx = {
        text: 'Fixed Time',
        type: 'default',

        width: 175,

        onClick: function (e) {

            $scope.smsRecsKeys = [];

            $scope.bindSMSRecs();
            $scope.popup_fx_visible = true;

        }

    };
    $scope.dsFxType = [
        { id: 300000, title: 'عملیات پرواز - تاکسی' },
        {
            id: 300001, title: 'عملیات پرواز - دایورت'
        },
        {
            id: 300002, title: 'عملیات پرواز - بازگشت به رمپ'
        },
        {
            id: 300003, title: 'عملیات پرواز - گارانتی تایم'
        },
         {
            id: 300004, title: 'عملیات پرواز - حق مسئولیت'
        },
        { id: 300005, title: 'عملیات پرواز - تاخیرات' },
        //lay
        { id: 300007, title: 'عملیات پرواز - اقامت' },
        

    ];
    $scope.fxType = null;
    $scope.sb_fx_type = {
        placeholder: 'Type',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.dsFxType,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxType',


        }
    };
    $scope.fxPeriodDs = [
        { id: 1, title: '12/16 - 01/15' },
        { id: 2, title: '01/16 - 02/15' },
        { id: 3, title: '02/16 - 03/15' },
        { id: 4, title: '03/16 - 04/15' },
        { id: 5, title: '04/16 - 05/15' },
        { id: 6, title: '05/16 - 06/15' },
        { id: 7, title: '06/16 - 07/15' },
        { id: 8, title: '07/16 - 08/15' },
        { id: 9, title: '08/16 - 09/15' },
        { id: 10, title: '09/16 - 10/15' },
        { id: 11, title: '10/16 - 11/15' },
        { id: 12, title: '11/16 - 12/15' },
    ];
    $scope.fxyear = 1401;
    $scope.fxmonth = null;
    $scope.sb_fx_year = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1401,1400,1399, 1398],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxyear',


        }
    };
    $scope.sb_fx_period = {
        placeholder: 'Period',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.fxPeriodDs,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxmonth',


        }
    };
    $scope.fx_hh = 0;
    $scope.num_fx_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'fx_hh',

        }
    };
    $scope.fx_mm = 0;
    $scope.num_fx_mm = {
        min: 0,
        max:59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'fx_mm',

        }
    };
    //lay
    $scope.fx_cnt = 0;
    $scope.num_fx_cnt = {
        min: 1,
        
        showSpinButtons: true,
        bindingOptions: {
            value: 'fx_cnt',

        }
    };
    $scope.popup_fx_visible = false;
    $scope.popup_fx_title = 'Notification';
    $scope.popup_fx = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fx"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 520,
        width: 1000,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', validationGroup: "fxsave", onClick: function (arg) {
                        //lay
                        var result = arg.validationGroup.validate();

                        if (!result.isValid || !$scope.dg_smscrew_selected || $scope.dg_smscrew_selected.length == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if ($scope.fxType != 300007 && !$scope.fx_hh && !$scope.fx_mm) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if ($scope.fxType == 300007 && !$scope.fx_cnt) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        
                        var cids = Enumerable.From($scope.dg_smscrew_selected).Select('$.Id').ToArray();
                        var dto = {};
                        dto.Ids = cids;
                        dto.Year = $scope.fxyear;
                        dto.Period = $scope.fxmonth;
                        dto.Count = 0;
                        if ($scope.fxType == 300007) {
                            dto.HH = 0;
                            dto.MM = 0;
                            dto.Count = $scope.fx_cnt;
                        }
                        else {
                            dto.HH = $scope.fx_hh;
                            dto.MM = $scope.fx_mm;
                        }
                        dto.Type = $scope.fxType;
                        //var names = Enumerable.From($scope.dg_smscrew_selected).Select('$.Name').ToArray().join('_');
                        //var mobiles = Enumerable.From($scope.dg_smscrew_selected).Select('$.Mobile').ToArray().join('_');
                        //var dto = { names: names, mobiles: mobiles, message: $scope.sms_message, sender: $rootScope.userName };
                        $scope.loadingVisible = true;

                        flightService.saveFixTime(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            // $scope.popup_fx_visible = false;
                            $scope.fxType = null;
                            $scope.smsRecsKeys = [];
                            $scope.dg_smscrew_selected = null;
                            $scope.sms_message = null;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_fx_visible = false;

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
            $scope.popup_fx_visible = false;

        },
        bindingOptions: {
            visible: 'popup_fx_visible',

            title: 'popup_fx_title',

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
            alert('error1');
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
    //magu313
    $scope.popup_printfp_visible = false;
    $scope.popup_printfp_title = 'Print';
    $scope.popup_printfp = {

        fullScreen: false,
        showTitle: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#rtblfp'));

                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_printfp_visible = false;
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


            $scope.popup_printfp_visible = false;

        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_printfp_visible',

            title: 'popup_printfp_title',

        }
    };

    $scope.dg_fp_columns = [




        { dataField: 'FlightNumber', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 100 },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 80 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 110 },
        { dataField: 'STD', caption: 'Dep UTC', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },
        { dataField: 'STA', caption: 'Arr UTC', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },

        { dataField: 'STDLOC', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },
        { dataField: 'STALOC', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm', width: 80 },
        { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'CPT', caption: 'CPT', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'FO', caption: 'FO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'SAFETY', caption: 'SAFETY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'CHECK', caption: 'CHECK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'OBS', caption: 'OBS', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },

        { dataField: 'ISCCM', caption: 'ISCCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'SCCM', caption: 'SCCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'CCM', caption: 'CCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 350 },

        { dataField: 'CHECKC', caption: 'CHECK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
        { dataField: 'OBSC', caption: 'OBS', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },









    ];
    $scope.dg_fp_selected = null;
    $scope.dg_fp_instance = null;
    $scope.dg_fp_ds = null;
    $scope.dg_fp = {
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
        keyExpr: 'ID',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 280,

        columns: $scope.dg_fp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fp_instance)
                $scope.dg_fp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fp_selected = null;
            }
            else
                $scope.dg_fp_selected = data;


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
            dataSource: 'dg_fp_ds',
            //selectedRowKeys:'selectedIds',
        },
        columnChooser: {
            enabled: true
        },

    };
    $scope.bindDailyReportFP = function () {
        var _dt = moment($scope.rptdaily_dateFrom).format('YYYY-MM-DDTHH:mm:ss');
        //odata/crew/report/main?date=' + _dt
        $scope.loadingVisible = true;
        flightService.getRosterSheetReportFP(_dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_fp_ds = response.items;
            console.log('report fp');
            console.log($scope.dg_fp_ds);
            // $scope.ds_am = response.am;
            // $scope.ds_pm = response.pm;

            var ln = $scope.dg_fp_ds.length;
            if ($scope.dg_fp_ds.length < 12) {
                for (var i = 0; i <= 12 - ln; i++)
                    $scope.dg_fp_ds.push({ FltNo: '', Route: '', Id: -1 * i });
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.popup_reportfp_visible = false;
    $scope.popup_reportfp_title = 'Daily Report';
    $scope.popup_reportfp = {
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
                        $scope.bindDailyReportFP();

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Print', icon: 'print', onClick: function (arg) {

                        $scope.popup_printfp_visible = true;

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_reportfp_visible = false;

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
            if ($scope.dg_fp_instance)
                $scope.dg_fp_instance.refresh();
            $scope.dg_fp_ds = null;
            $scope.bindDailyReportFP();
        },
        onHiding: function () {

            $scope.dg_fp_instance.clearSelection();
            $scope.dg_fp_ds = null;
            $scope.popup_reportfp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_reportfp_visible',

            title: 'popup_reportfp_title',
            'toolbarItems[0].options.value': 'rptdaily_dateFrom',

        }
    };
    ////////////////////////////////////
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
    //$scope.formatMinutes = function (mm) {
    //    return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    //};
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
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_cduties_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cduties_instance)
                $scope.dg_cduties_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
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

            //2020-12-19
            if ($scope.OnlyRoster)
                $rootScope.navigatehome();

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
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'smsTemplate',

            //visible:false,

        },
        {
            dataField: "Id", caption: '',
            width: 65,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'profileTemplate',

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

    //2020-12-26
    $scope.assign1168 = function (e) {

        $scope.event_status = 1168;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(4, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(10 * 60);
        $scope.popup_event_title = 'STBY AM';
        $scope.popup_event_visible = true;
    };
    $scope.assign1167 = function (e) {
        $scope.event_status = 1167;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(13, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((10 * 60) + 59);
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
    //2020-10-27
    $scope.assign100025 = function (e) {
        $scope.event_status = 100025;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(0 * 60);
        $scope.popup_event_title = 'Mission';
        $scope.popup_event_visible = true;
    };
    //300008
    $scope.assign300008 = function (e) {
        $scope.event_status = 300008;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60+59);
        $scope.popup_event_title = 'Duty';
        $scope.popup_event_visible = true;
    };
    //300009
    $scope.assign300009 = function (e) {
        $scope.event_status = 300009;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60+59);
        $scope.popup_event_title = 'Rest';
        $scope.popup_event_visible = true;
    };
    //300010
    //lay
    $scope.assign300010 = function(e) {
        $scope.event_status = 300010;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60 + 59);
        $scope.popup_event_title = 'Other Airline STBY';
        $scope.popup_event_visible = true;
    };
    ////////////////////////////
    //2020-12-19
    $scope.cellContextMenuItems = [

        { visible: !$scope.OnlyRoster, text: 'STBY AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY AM</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'STBY PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY PM</td></tr></table>", },
        //lay
        { visible: !$scope.OnlyRoster, text: 'STBY Other Airline', onItemClick: $scope.assign300010, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY Other Airline</td></tr></table>", },
        /////////////////////////////////////



        { visible: !$scope.OnlyRoster, text: 'Day Off', onItemClick: $scope.assign10000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Day Off</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Requested Off', onItemClick: $scope.assign100008, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Requested Off</td></tr></table>", },
        // { text: 'Assign Stan By AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>", },
        // { text: 'Assign Stan By PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Office', onItemClick: $scope.assign5001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Office</td></tr></table>", },
        //soltani
        { visible: $scope.OnlyTraining, text: 'Training', onItemClick: $scope.assign5000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Training</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Meeting', onItemClick: $scope.assign100001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Meeting</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Reserve', onItemClick: $scope.assign1170, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1170' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Reserve</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Vacation', onItemClick: $scope.assign1169, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1169' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Vacation</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Ground', onItemClick: $scope.assign100000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Ground</td></tr></table>", },

        { text: 'Simulator', onItemClick: $scope.assign100003, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100003' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Simulator</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Sick', onItemClick: $scope.assign100002, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100002' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Sick</td></tr></table>", },
        { visible: !$scope.OnlyRoster, visible: !$scope.OnlyRoster, text: 'Expired Medical', onItemClick: $scope.assign100005, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100005' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Medical</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Expired Licence', onItemClick: $scope.assign100004, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100004' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Licence</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Expired Passport', onItemClick: $scope.assign100006, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100006' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Passport</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'No Flight', onItemClick: $scope.assign100007, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>No Flight</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Refuse', onItemClick: $scope.assign100009, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Refuse</td></tr></table>", },

        //2020-10-27
        { visible: !$scope.OnlyRoster, text: 'Mission', onItemClick: $scope.assign100025, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Mission</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Duty', onItemClick: $scope.assign300008, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-300008' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Duty</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Rest', onItemClick: $scope.assign300009, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-300009' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Rest</td></tr></table>", },
        ///////////////////////////////////

    ];
    $scope.cellContextMenuOptions = {
        target: ".dx-scheduler-date-table-cell",
        dataSource: $scope.cellContextMenuItems,
        width: 200,
        onShowing: function (e) {
            if (!$scope.dg_calcrew_selected)
                e.cancel = true;
            // $scope.contextMenuCellData
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
    //4-11
    var isDouble = 0;
    var prevCellData = null;
    $scope.saveNewDutyCalByDate = function (crewid, df, dt, etype, remark, callback) {
        var dto = {
            DateStart: new Date(df),
            DateEnd: new Date(dt),
            CityId: -1,
            CrewId: crewid,
            DutyType: etype,
            Remark: remark

        }
        $scope.loadingVisible = true;

        flightService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            response.dutyTypeTitle = response.DutyTypeTitle;
            response.dutyType = response.DutyType;
            $scope.cal_crew_ds.push(response);
            // $scope.cal_crew_instance.repaint();
            callback();



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.dblclick = function (cell) {
        //moradi
        if (!$scope.dg_calcrew_selected)
            return;
        var cdate = new Date(cell.startDate);
        var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
        var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
        if (cdate >= bdate && cdate <= edate)
            return;
        var eventFrom = (new Date(cdate)).setHours(6, 0, 0, 0);
        var eventEnd = (new Date(eventFrom)).addHours(17);

        var _event = $scope.createEvent($scope.dg_calcrew_selected, 10000, 'RERRP', eventFrom, eventEnd, '');
        var check = $scope.IsEventOverLapped(_event);
        if (check) {
            General.ShowNotify('Overlapped Duties Found', 'error');
            return;
        }
        else {

            $scope.saveNewDutyCalByDate($scope.dg_calcrew_selected.Id, eventFrom, eventEnd, 10000, '', function () {
                $scope.ToDateEvent = null;
                $scope.FromDateEvent = null;
                $scope.event_status = null;
                $scope.RemarkEvent = null;
            });


        }
    }
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
        onCellClick: function (e) {
            if (isDouble == 1) {
                prevCellData = e.cellData;

            }
            isDouble++;
            setTimeout(function () {
                if (isDouble == 2) {
                    if ((e.cellData.startDate == prevCellData.startDate) && (e.cellData.endDate == prevCellData.endDate))
                        $scope.dblclick(e.cellData);
                }
                else if (isDouble == 1) { };
                isDouble = 0;
                prevCellData = null;
            }, 300);
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
                return "No Flight";
            case 100008:
                return "Requested Off";
            case 100009:
                return "Refuse";
            case 1169:
                return "Vacation";
            case 1170:
                return "Reserve";
            //2020-10-27
            case 100025:
                return "Mission";
            case 300008:
                return "Duty";
            case 300009:
                return "Rest";
            //lay
            case 300010:
                return "Other Airline STBY";
            default:
                return "-";
        }
    }
    //lay
    $scope.createEvent = function (_crew, _type, _typeTitle, eventFrom, eventEnd, remark) {
        if ([300007, 300010].indexOf(_type) == -1 && new Date(eventFrom) < $scope.firstHour && !$scope.isAdmin) {

            var myDialog = DevExpress.ui.dialog.custom({
                rtlEnabled: true,
                title: "Error",
                message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
                buttons: [{ text: "OK", onClick: function () { } }]
            });
            myDialog.show();
            return;
        }
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
        if (_type != 10000 && _type != 1169 && _type != 100000 && _type != 100001 && _type != 100002 && _type != 100004 && _type != 100005 && _type != 100006 && _type != 100007 && _type != 100008 && _type != 100009
            //2020-10-27
            && _type != 100025
        ) {
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
        //4-20
        var f;
        if (event.dutyType == 10000) {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {

                var _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }
        else {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {
                //EndUTC
                var _until = x.RestUntil;
                if (!_until)
                    _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }

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
    //hoohoo

    //2020-11-22
    //2020-12-19
    $scope.notifyDutyCal = function (duty) {
        var type = duty.DutyType;
        if ($scope.OnlyRoster && type != 100003) {
            General.ShowNotify('You dont have enough permission to notify this type of events.', 'error');
            return;
        }
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

    //2020-12-19
    $scope.removeDutyCal = function (duty) {
        var type = duty.DutyType;
        if ($scope.OnlyRoster && type != 100003) {
            General.ShowNotify('You dont have enough permission to remove this type of events.', 'error');
            return;
        }
        //soltani
        if (!$scope.OnlyTraining && type == 5000) {
            General.ShowNotify('You dont have enough permission to remove this type of events.', 'error');
            return;
        }

        if (/*type == 1165 &&*/ !$scope.isAdmin) {
            //lay
            if ([300007, 300010].indexOf(type)==-1 && new Date(duty.End) < $scope.firstHour) {

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
                $scope.getAssigned();

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
        dto.BL = 0;
        if ($scope.event_status == 100025) {
            var _blmm = ($scope.bl_hh ? $scope.bl_hh : 0) * 60 + $scope.bl_mm;
            dto.BL = _blmm;
             
        }
        $scope.loadingVisible = true;

        flightService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            response.dutyTypeTitle = response.DutyTypeTitle;
            response.dutyType = response.DutyType;
            $scope.cal_crew_ds.push(response);
            // $scope.cal_crew_instance.repaint();
            $scope.bl_hh = null;
            $scope.bl_mm = null;
            callback();



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    var getMidNight = function (d) {
        return new Date(new Date(d.setHours(24)).setMinutes(0)).setSeconds(0);
    };
    $scope.bl_hh = null;
    $scope.num_bl_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_hh',

        }
    };
    $scope.bl_mm = null;
    $scope.num_bl_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_mm',

        }
    };
    $scope.popup_event = {
        width: 350,
        height: 400,
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
                            if (check) {
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
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });


                            }
                             

                        }
                        //2020-10-27
                        else if ($scope.event_status == 100025) {
                            $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });
                        }
                        //dlutopol
                        else {
                            //nool


                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = false; //$scope.IsEventOverLapped(_event);
                            if (check) {
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


    //2020-11-24
    $scope.FromDateVisible = new Date();
    $scope.ToDateVisible = new Date();
    $scope.date_from_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateVisible',

        }
    };
    $scope.date_to_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateVisible',

        }
    };
    $scope.popup_dates_visible = false;
    $scope.popup_dates_title = '';
    $scope.popup_dates = {
        width: 300,
        height: 250,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'datevisible', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        var eventFrom = (new Date($scope.FromDateVisible)).toUTCString();
                        var eventEnd = (new Date($scope.ToDateVisible)).toUTCString();
                        General.Confirm('Are you sure?', function (res) {
                            if (res) {

                                var dto = { datefrom: eventFrom, dateto: eventEnd, username: $rootScope.userName };
                                $scope.loadingVisible = true;
                                flightService.dutiesVisibleByDates(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $scope.getCrewDuties(function (ds) {
                                        $scope.dg_cduties_ds = ds;

                                    });

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                        });

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_dates_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.FromDateVisible = $scope.rptcd_dateFrom;
            $scope.ToDateVisible = $scope.rptcd_dateTo;
        },
        onHiding: function () {


        },
        bindingOptions: {
            visible: 'popup_dates_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_dates_title',

        }
    };



    $scope.FromDateSMS = new Date();
    $scope.ToDateSMS = new Date();
    $scope.datesms_from_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateSMS',

        }
    };
    $scope.datesms_to_visible = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateSMS',

        }
    };
    $scope.popup_datessms_visible = false;
    $scope.popup_datessms_title = '';
    $scope.popup_datessms = {
        width: 300,
        height: 250,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'datesms', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        var eventFrom = (new Date($scope.FromDateSMS)).toUTCString();
                        var eventEnd = (new Date($scope.ToDateSMS)).toUTCString();
                        General.Confirm('Are you sure?', function (res) {
                            if (res) {

                                var dto = { datefrom: eventFrom, dateto: eventEnd, username: $rootScope.userName };
                                $scope.loadingVisible = true;
                                flightService.dutiesSendSMSByDate(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $scope.getCrewDuties(function (ds) {
                                        $scope.dg_cduties_ds = ds;

                                    });

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                        });

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_datessms_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.FromDateSMS = $scope.rptcd_dateFrom;
            $scope.ToDateSMS = $scope.rptcd_dateTo;
        },
        onHiding: function () {


        },
        bindingOptions: {
            visible: 'popup_datessms_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_datessms_title',

        }
    };

    //////////////////////////////

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
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

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

            $scope.getAssigned();
        }
        catch (e) {
            alert('error2');
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
        if (flt.hasCabinExtra || flt.hasCockpitExtra)
            cls += ' has-crew-extra';
        return cls + ' flightitem';
    }
    $scope.getCockpitSignClass = function (f) {
        return f.hasCockpitExtra ? 'has-crew-extra' : '';
    };
    $scope.getCabinSignClass = function (f) {
        return f.hasCabinExtra ? 'has-crew-extra' : '';
    };
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
        var mm = (new Date($scope.datefrom)).getMonth();
        var dd = (new Date($scope.datefrom)).getDate();


        if (stdOffset < datefromOffset || (mm == 2 && dd == 22))
            dfirst = (new Date($scope.datefrom)).addMinutes(-60);
        if (stdOffset > datefromOffset)
            dfirst = (new Date($scope.datefrom)).addMinutes(60);



        var left = $scope.getDuration(/*new Date($scope.datefrom)*/new Date(dfirst), new Date(f.STD));
        style.left = (left * (hourWidth + 1)) + "px";
        var top = f.top;


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
    //5-17
    $scope.getResOrderIndex = function (reg) {
        try {
            var str = "";

            if (reg.includes("CNL"))
                str = "ZZZZZZ";
            else

                if (reg.includes(".")) {
                    str = "ZZZZ" + reg.charAt(reg.length - 2);

                }

                else
                    // str = reg.charAt(reg.length - 1);
                    str = reg.substring(0, 2) + reg.charAt(reg.length - 1);

            return str;
        }
        catch (ee) {

            return "";
        }

    }
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

                //5-17
                response.resources = Enumerable.From(response.resources).OrderBy(function (x) { return $scope.getResOrderIndex(x.resourceName); }).ToArray();


                $scope.ganttData = response;
                $scope.ati_flights = $scope.ganttData.flights;
                console.log('gantt', $scope.ganttData);
                callback();
            }
            catch (ex) {
                alert('error3');
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

    $scope.isExtendFDPVisible = function (y) {
        if (y.key == $scope.selectedFlightsKey.Id)
            return false;
        return true;
    };
    //12-08
    $scope.extendFDP = function (y) {
        
        console.log(y);
        // console.log($scope.selectedFlightsKey);
        // console.log($scope.selectedFlightsKey);
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



        //////////////////

        var _id = $scope.selectedFlightsKey.Id;
        var _fdps = Enumerable.From($scope.ati_fdps).Where("$.key=='" + _id + "' && $.rank=='" + y.rank + "'").ToArray();
        var _fdpsPoses = Enumerable.From(_fdps).Select('Number($.index)').ToArray();
        var poses = [1, 2, 3, 4, 5];
        var freePos = Enumerable.From(poses).Where(function (x) { return _fdpsPoses.indexOf(x) == -1; }).OrderBy('$').FirstOrDefault();
        if (!freePos)

            return;

        ////////////////// 
        var fdp = {};
        _fdp_id--;
        fdp.Id = _fdp_id;
        fdp.DeletedFDPId = y.Id;
        fdp.key = $scope.selectedFlightsKey.Id;
        fdp.no = $scope.selectedFlightsKey.no;
        fdp.crewId = y.crewId;
        fdp.rank = y.rank;
        fdp.index = freePos; //y.index ;
        fdp.group = y.group;
        fdp.scheduleName = y.scheduleName;
        //$scope.ati_flights
        var ordered = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.sta); }).ToArray();

        var first = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[0].Id).FirstOrDefault();
        var last = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[$scope.ati_selectedFlights.length - 1].Id).FirstOrDefault();
        fdp.start = (new Date(first.STD)).addMinutes(-60);
        fdp.end = (new Date(last.STA)).addMinutes(30);
        fdp.from = first.FromAirport;
        fdp.to = last.ToAirport;
        fdp.homeBase = y.homeBase;
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

        $scope.loadingVisible = true;

        //2020-11-22-2
        fdp.UserName = $rootScope.userName;
        //magu3-6
        fdp.IsAdmin = $scope.isAdmin ? 1 : 0;
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
                        $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where('$.Id!=' + y.Id).ToArray();
                        //$scope.currentAssigned.CrewIds.push(y.crewId);
                        //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'] = crew.Id;
                        //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString()] = crew.ScheduleName;
                        //$scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Group'] = crew.JobGroup;
                        //if (!crew.FlightSum)
                        //    crew.FlightSum = 0;
                        //crew.FlightSum += $scope.FDPStat.Flight;
                        //12-09
                        $scope.fillPos();
                        $scope.fillFilteredCrew();
                        $scope.fillRangeFdps();
                        $scope.fillFlightCrews();
                        $scope.fillRangeCrews();
                        $scope.getAssigned();
                    }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        ////////////////
        ///////////////






    };
    //12-08 
    $scope.dayAssigned = [];
    $scope.getAssigned = function () {
        try {
            $scope.dayAssigned = [];

            //(x.flights[0].split('_')[2]).startsWith(moment(new Date($scope.ati_selectedFlights[0].std)
            var dayFDPs = Enumerable.From($scope.ati_fdps).Where(function (x) {
                return (x.flights[0].split('_')[2]).startsWith(moment(new Date($scope.selectedDate)).format('YYYYMMDD'));

            }).ToArray();

            var grp = Enumerable.From(dayFDPs)

                .GroupBy(function (item) { return item.key + '%' + item.no + '%' + item.flights[0]; }, null, (ky, g) => {
                    var _item = {
                        _key: ky,
                        id: (ky.split('%')[0]),
                        no: (ky.split('%')[1]).replace(/_/g, ','),
                        // route: (ky.split('%')[2]),
                        std: Number((ky.split('%')[2]).split('_')[2]),
                        items: Enumerable.From(g.source).OrderBy(function (x) {
                            return $scope.getRankOrder(x.rank, x.index);
                        }).ThenBy('Number($.index)').ToArray(),



                    };

                    return _item;
                }).OrderBy(function (x) {

                    return x.std;

                }).ToArray();
            //$.each(grp, function (_i, _g) {
            //    $.each(_g.items, function (_j, _c) {
            //        _c.rankOrder = $scope.getRankOrder(_c.rank);
            //    });
            //});
            console.log('ddddddddddddddddddd', grp);
            $scope.dayAssigned = grp;
        }
        catch (eee) { }

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
    //hoohoo
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
    //////////////////////////////////////
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
                $scope.getAssigned();

            });


        }


    }
    //magu39
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

    //2021-1-4 

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
    //magu39
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
        //magu39
        $scope.refreshPos();

        $scope.clearPos(keep);
        var _id = $scope.selectedFlightsKey.Id;
        console.log(_id);
        console.log($scope.ati_fdps);
        var _fdps = Enumerable.From($scope.ati_fdps).Where("$.key=='" + _id + "'").ToArray();
        console.log(_fdps);
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
    $scope.offReasonDs = [
        //lay
         { id: 13, title: 'Refused' }
        ,{ id: 1, title: 'Refused-Sick' }
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

            $scope.ati_fdps = Enumerable.From($scope.ati_fdps).Where(function (x) { return response.removed.indexOf(x.Id) == -1 && response.updatedId.indexOf(x.Id) == -1; }).ToArray();
            $.each(response.updated, function (_i, _d) {
                $scope.ati_fdps.push(_d);
            });
            $scope.fillPos(true);
            $scope.fillFilteredCrew();
            $scope.fillRangeFdps();
            $scope.fillFlightCrews();
            $scope.fillRangeCrews();
            $scope.getAssigned();
            if (callback) {
                callback();
            }

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    //12-08
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
            $scope.getAssigned();
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
            _d.hasCabinExtra = false;
            _d.hasCockpitExtra = false;
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

                    if (dh == 0) {
                        flight[fdp.rank]++;
                        if (flight[fdp.rank] > 0)
                            flight.hasCrew = true;
                        if (fdp.rank == 'P1' || fdp.rank == 'P2' || fdp.rank == 'IP' || fdp.rank == 'SAFETY')
                            flight.hasCockpit = true;
                        if (fdp.rank == 'ISCCM' || fdp.rank == 'SCCM' || fdp.rank == 'CCM')
                            flight.hasCabin = true;
                    }




                }
            });
        });

        $.each($scope.ati_flights, function (_i, _d) {

            var _cbn = /*_d.ISCCM +*/ _d.SCCM + _d.CCM;
            _d.hasCabinExtra = _d.SCCM > 1 || _d.CCM > 3;
            _d.hasCockpitExtra = _d.P1 > 1 || _d.P2 > 1 || _d.IP > 1;

            if (((_d.P1 >= 1 && _d.P2 >= 1) || (_d.IP >= 1 && _d.P2 >= 1) || (_d.IP >= 1 && _d.P1 >= 1)) && /*_d.SCCM>=1 && _d.CCM>=3*/ _cbn >= 4)
                _d.hasCrewAll = true;
            _d.crew = Enumerable.From(_d.crew).OrderBy('$.order').ToArray();
            //if (flight.FlightStatusID==4)
            {
                var _offitems = Enumerable.From($scope.ati_offitems).Where('$.FlightId==' + _d.ID).ToArray();

                _d.offItems = _offitems;
                if (_d.offItems && _d.offItems.length > 0)
                    _d.hasOffItem = true;


            }
        });

        console.log('HAS CREW');
        console.log(Enumerable.From($scope.ati_flights).Where('$.hasCrew').ToArray());
    }
    ////////////////////////////////
    //magu39
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
                $scope.getAssigned();


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
    //2020-10-20 shamim
    $scope.IsNonNull = function (exp) {

        if (exp && exp != 'null')
            return true;
        return false;
    }
    ///////////////////////
    $scope.crewClick = function (crew, $event) {
        if ($event.ctrlKey) {

            if (!$scope.editable && !$scope.isAdmin && 1 == 2) {

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

            //2021-06-23
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



            if (!crew.RemainCCRM || crew.RemainCCRM < 0)
                expired.push('CCRM ' + (crew.CCRMExpired ? moment(crew.CCRMExpired).format('YYYY-MM-DD') : 'UNKNOWN'));



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
                //return;
            }

            var conflict = $scope.checkConflict2($scope.ati_selectedFlights);
            var continuity = $scope.checkContinuity2($scope.ati_selectedFlights);
            if (conflict || continuity) {
                General.ShowNotify('Interuption/Continuity Error', 'error');


                return;
            }
            if ($scope.currentAssigned[$scope.selectedPos.rank + $scope.selectedPos.index.toString() + 'Id'])
                return;

            var fdp = {};
            _fdp_id--;
            fdp.Id = _fdp_id;
            fdp.maxFDP = $scope.FDPStat.MaxFDPExtended;
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

            $scope.loadingVisible = true;

            //2020-11-22-2
            fdp.UserName = $rootScope.userName;
            //magu3-6
            fdp.IsAdmin = $scope.isAdmin ? 1 : 0;
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
                            $scope.getAssigned();
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
            $scope.getAssigned();
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
            $scope.getAssigned();
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

    //2020-10-20///////////
    $scope.getDaysDiff = function (d1, d2) {
        var date1 = new Date(General.getDayFirstHour(d1));
        var date2 = new Date(General.getDayLastHour(d2));

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days;
    };
    ///////////////////// 
    //4-14
    $scope.FLT28Avg = null;
    $scope.FLAvg = null;
    $scope.dg_used_crew_ds = [];
    $scope.fillFilteredCrew = function () {
        $scope.dg_used_crew_ds = [];
        var dateFirst = new Date();
        if ($scope.ati_selectedFlights && $scope.ati_selectedFlights.length > 0) {
            var ordered = Enumerable.From($scope.ati_selectedFlights).OrderBy(function (x) { return new Date(x.sta); }).ToArray();

            var first = Enumerable.From($scope.ati_flights).Where('$.ID==' + $scope.ati_selectedFlights[0].Id).FirstOrDefault();
            if (!first)
                return;
            dateFirst = new Date(first.ChocksOut);
        }

        var alldh = false;
        var dhflights = Enumerable.From($scope.ati_selectedFlights).Where('$.dh').ToArray();
        if (dhflights.length == $scope.ati_selectedFlights.length)
            alldh = true;



        var _ds = null;
        if (!$scope.selectedPos) {
            $scope.dg_crew_ds = null;
            $scope.dg_used_crew_ds = [];
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
                    return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || ((x.JobGroup == 'P1') && x.ValidTypes && (x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1 || alldh));
                }).ToArray();
                break;
            case 'P2':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'P2' || x.JobGroup == 'P1') && x.ValidTypes && (x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1 || alldh);
                }).ToArray();
                break;
            case 'Safety':
            case 'SAFETY':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || (x.JobGroup == 'P1' || x.JobGroup == 'P2') && (x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1 || alldh);
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
                    return x.JobGroup == 'CCM' || x.JobGroup == 'P2' || x.JobGroup == 'P1' || x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC';
                }).ToArray();
                break;
            case 'CHECK':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    //magu313
                    //return (x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC') || (x.JobGroup == 'P1' || x.JobGroup == 'P2') && x.ValidTypes && x.ValidTypes.indexOf($scope.ati_selectedTypes[0]) != -1;
                    return x;
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

        //2020-10-20 
       
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

            $scope.setCertificatesStatus(_d);

        });

        //2021-12-23

        var _cds = Enumerable.From(filtered).OrderBy('$.FlightSum').ThenBy('$.GroupOrder').ThenBy('$.ScheduleName').ToArray();
        var crewIds = Enumerable.From(_cds).Select('$.Id').ToArray();
        var date = moment(new Date($scope.ati_selectedFlights[0].std)).format("YYYY-MM-DD");
        var dto = {
            CDate: date,
            CrewIds: crewIds,
        };
        //12-11
        flightService.getFTLByCrewIds(dto).then(function (response) {
            var sumFLT28 = 0;
            var sumFL = 0;
            $.each(response, function (_i, _d) {
                sumFL += _d.Ratio ? _d.Ratio : 0;
                sumFLT28 += _d.Flight28 ? _d.Flight28 : 0;
                _d._Duty7 = $scope.formatMinutes(_d.Duty7);
                _d._Duty7Remain = $scope.formatMinutes(_d.Duty7Remain);
                _d._Duty14 = $scope.formatMinutes(_d.Duty14);
                _d._Duty14Remain = $scope.formatMinutes(_d.Duty14Remain);
                _d._Duty28 = $scope.formatMinutes(_d.Duty28);
                _d._Duty28Remain = $scope.formatMinutes(_d.Duty28Remain);
                _d._Flight28 = $scope.formatMinutes(_d.Flight28);
                _d._Flight28Remain = $scope.formatMinutes(_d.Flight28Remain);
                _d._FlightCYear = $scope.formatMinutes(_d.FlightCYear);
                _d._FlightCYearRemain = $scope.formatMinutes(_d.FlightCYearRemain);
                _d._FlightYear = $scope.formatMinutes(_d.FlightYear);
                _d._FlightYearRemain = $scope.formatMinutes(_d.FlightYearRemain);

                if ($scope.FDPDuty) {
                    _d._Duty7RemainByFDP = _d.Duty7Remain - $scope.FDPStat.Duty;
                    _d._Duty14RemainByFDP = _d.Duty14Remain - $scope.FDPStat.Duty;
                    _d._Duty28RemainByFDP = _d.Duty28Remain - $scope.FDPStat.Duty;
                }

                if ($scope.FDPFlight) {
                    _d._Flight28RemainByFDP = _d.Flight28Remain - $scope.FDPStat.Flight;
                    _d._FlightYearRemainByFDP = _d.FlightYearRemain - $scope.FDPStat.Flight;
                    _d._FlightCYearRemainByFDP = _d.FlightCYearRemain - $scope.FDPStat.Flight;
                }

                var _item = Enumerable.From(_cds).Where('$.Id==' + _d.CrewId).FirstOrDefault();


                if (_item) {
                    _item.FTL = {};
                    _item.FTL = _d;
                    _item.dayFDP = null;
                    var _item_fdp = Enumerable.From($scope.ati_fdps).Where(function (x) {
                        return x.crewId == _item.Id && (x.flights[0].split('_')[2]).startsWith(moment(new Date($scope.ati_selectedFlights[0].std)).format("YYYYMMDD"));
                    }).FirstOrDefault();
                    if (_item_fdp) {



                        _item.dayFDP = _item_fdp;
                        _item.dayFDP.no2 = _item.dayFDP.no.replace(/_/g, ',');
                    }
                }
            });
            if (response.length > 0) {
                $scope.FLT28Avg = (sumFLT28 * 1.0) / response.length;
                $scope.FLAvg = (sumFL * 1.0) / response.length;
            }
            $scope.dg_used_crew_ds = Enumerable.From(_cds).Where(function (x) { return x.dayFDP; }).OrderByDescending(function (x) { return $scope.calculateOrder(x); }).ToArray();
            //console.log('POS CLICK 2022 _cds', _cds);
            $scope.dg_crew_ds = Enumerable.From(_cds).Where(function (x) { return !x.dayFDP; }).OrderByDescending(function (x) { return $scope.calculateOrder(x); }).ToArray();
            console.log($scope.dg_crew_ds);
        }, function (err) { });
        //$scope.dg_crew_ds = Enumerable.From(filtered).OrderBy(function (x) {
        //    return x.FlightSum;
        //}).ToArray();

        // console.log($scope.dg_crew_ds);

    };
    $scope.setCertificatesStatus = function (_d) {
        //_d.RemainMedical = !_d.MedicalExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.MedicalExpired));
        //_d.RemainCMC = !_d.CMCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CMCExpired));

        //_d.RemainSEPT = !_d.SEPTExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SEPTExpired));
        //_d.RemainDG = !_d.DGExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.DGExpired));
        //_d.RemainCCRM = !_d.CCRMExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.CCRMExpired));
        //_d.RemainSMS = !_d.SMSExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.SMSExpired));
        //_d.RemainAvSec = !_d.AvSecExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.AvSecExpired));
        //_d.RemainLPC = !_d.LPCExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPCExpired));
        //_d.RemainLPR = !_d.LPRExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LPRExpired));
        //_d.RemainFirstAid = !_d.FirstAidExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.FirstAidExpired));
        //_d.RemainLicence = !_d.LicenceExpired ? null : $scope.getDaysDiff(dateFirst, new Date(_d.LicenceExpired));

    };
    $scope.getCertificationStyle = function (_d) {
        var style = { background: '#f7f7f7' };
        var isValid = true;
        if ((!_d.RemainMedical && _d.RemainMedical !== 0) || _d.RemainMedical < 0)
            return { background: '#cc0000' };

        return style;
    };
    $scope.calculateOrder = function (c) {
        if (!c.FTL) {
            console.log('c FTL is null',c);
            return;
        }
        if (!c.FTL.Flight28Remain && c.FTL.Flight28Remain !== 0)
            return 10000;
        return Number(c.FTL.Flight28Remain);
    };
    $scope.getCFTLStyle = function (v, t) {
        if (!$scope.FDPStat.Duty || !$scope.FDPStat.Flight)
            return;
        var m = $scope.FDPStat.Duty;
        if (t == 1)
            m = $scope.FDPStat.Flight;

        var n = v - m;

        if (n < 0) return " isover";
        else
            return "";

    };
    $scope.getFLClass = function (x) {
        if ($scope.FLAvg) {
            if (x >= $scope.FLAvg)
                return "";
            var diff = Math.abs((x - $scope.FLAvg) / ($scope.FLAvg * 1.0));
            if (diff > 0.15)
                return " aboveavg";
            return "";
        }

        return "";
    };
    $scope.getFLT28Class = function (x) {
        if ($scope.FLT28Avg) {
            if (x >= $scope.FLT28Avg)
                return "";
            var diff = Math.abs((x - $scope.FLT28Avg) / ($scope.FLT28Avg * 1.0));
            if (diff > 0.15)
                return " aboveavg";
            return "";
        }

        return "";
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
    $scope.FDPDuty = null;
    $scope.FDPFlight = null;
    $scope.getFDPStat = function () {
        $scope.FDPDuty = null;
        $scope.FDPFlight = null;
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
            $scope.FDPDuty = response.Duty;
            $scope.FDPFlight = response.Flight;
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
                    $scope.getRosterFDPs(function (ds) {
                        //2020-12-19
                        if ($scope.OnlyRoster) {
                            $scope.cal_crew_current = General.getDayFirstHour(new Date($scope.dt_fromSearched));
                            $scope.popup_cal_visible = true;
                        }

                    });



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

    ////////////////////////////
    $scope.popup_profile_visible = false;
    $scope.popup_profile_title = 'Profile';

    $scope.scroll_profile_height = $(window).height() - 100-150;
    $scope.scroll_profile = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_profile_height', }
    };
    
    $scope.popup_profile = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cduties"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 100,
        width: 870,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        title:'Profile',
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_profile_visible = false;

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
            $scope.dt_dty_to = new Date($scope.selectedDate);
            $scope.dt_dty_from = (new Date($scope.selectedDate)).addDays(-28);
            $scope.selectedTabProfileIndex = 0;
            $scope.bindExceed();
            if ($scope.dg_cer_instance)
                $scope.dg_cer_instance.refresh();
            if ($scope.dg_pdty_instance)
                $scope.dg_pdty_instance.refresh();
            if ($scope.chart_bl_instance)
                $scope.chart_bl_instance.render();
            if ($scope.chart_cnt_instance)
                $scope.chart_cnt_instance.render();
            if ($scope.chart_fltratio_instance)
                $scope.chart_fltratio_instance.render();

        },
        onHiding: function () {
            $scope.ds_exceed = [];
            $scope.ds_profile_duties = [];
            $scope.bl_year = null;
            $scope.data_bl = [];
            $scope.dt_ftl = null;
            $scope.data_ftl = null;
            $scope.Duties7 = [];
            $scope.DutyColors7 = [];
            $scope.Duties14 = [];
            $scope.DutyColors14 = [];
            $scope.Duties28 = [];
            $scope.DutyColors28 = [];

            $scope.Flights28 = [];
            $scope.FlightColors28 = [];
            $scope.FlightsYear = [];
            $scope.FlightColorsYear = [];
            $scope.FlightsCYear = [];
            $scope.FlightColorsCYear = [];
            $scope.popup_profile_visible = false;

        },
        bindingOptions: {
            visible: 'popup_profile_visible',


        }
    };
    $scope.tabsprofile = [
        { text: "Main", id: 'profilemain', visible_btn: false },
        { text: "FTL", id: 'profileftl', visible_btn: false },
        { text: "Flights", id: 'profileflights', visible_btn: false },
        { text: "Duties", id: 'profileduties', visible_btn: false },
        


    ];
    $scope.selectedTabProfileIndex = -1;
    $scope.$watch("selectedTabProfileIndex", function (newValue) {

        try {
            
            $scope.selectedTabProfile = $scope.tabsprofile[newValue];
            $('.tabprofile').hide();
            $('.' + $scope.selectedTabProfile.id).fadeIn(100, function () {

                if ($scope.chart_bl_instance)
                    $scope.chart_bl_instance.render();
                if ($scope.chart_cnt_instance)
                    $scope.chart_cnt_instance.render();
                if ($scope.chart_fltratio_instance)
                    $scope.chart_fltratio_instance.render();
            });
            if ($scope.selectedTabProfile.id == 'profileftl' && !$scope.dt_ftl)
                $scope.dt_ftl = new Date($scope.selectedDate);
            if ($scope.selectedTabProfile.id == 'profileflights' && !$scope.bl_year)
                $scope.bl_year = Number(moment(new Date()).format('YYYY'));
            if ($scope.dg_cer_instance)
                $scope.dg_cer_instance.repaint();
           


        }
        catch (e) {
            
        }

    });
    $scope.tabs_profile = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabsprofile", deep: true },
            selectedIndex: 'selectedTabProfileIndex'
        }

    };

    $scope.profile = { certificates:[]};
    $scope.showProfile = function (c) {
        console.log(c);
        $scope.profile = { certificates: [] };
        var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + c.Id).FirstOrDefault();
        if (!crew)
            return;
        $scope.profile = JSON.parse(JSON.stringify(crew));
        $scope.profile.certificates = [];

        $scope.profile.certificates.push({ Title: 'Flight Crew Licence', Issue: $scope.profile.LicenceIssued, Expire: $scope.profile.LicenceExpired });
        $scope.profile.certificates.push({ Title: 'Crew Member Certificate', Issue: null, Expire: $scope.profile.CMCExpired });
        $scope.profile.certificates.push({ Title: 'Medical', Issue: $scope.profile.MedicalIssued, Expire: $scope.profile.MedicalExpired });

         
        $scope.profile.certificates.push({ Title: 'SEPT Theoretical', Issue: $scope.profile.SEPTIssued, Expire: $scope.profile.SEPTExpired });
        $scope.profile.certificates.push({ Title: 'SEPT Practical', Issue: $scope.profile.SEPTPIssued, Expire: $scope.profile.SEPTPExpired });

        $scope.profile.certificates.push({ Title: 'Dangerous Goods', Issue: $scope.profile.DGIssued, Expire: $scope.profile.DGExpired });
        $scope.profile.certificates.push({ Title: 'CRM', Issue: $scope.profile.CRMIssued, Expire: $scope.profile.CRMExpired });
        $scope.profile.certificates.push({ Title: 'CCRM', Issue: $scope.profile.CCRMIssued, Expire: $scope.profile.CCRMExpired });

        $scope.profile.certificates.push({ Title: 'SMS', Issue: $scope.profile.SMSIssued, Expire: $scope.profile.SMSExpired }); 
        $scope.profile.certificates.push({ Title: 'Aviation Security', Issue: $scope.profile.AvSecIssued, Expire: $scope.profile.AvSecExpired });
        //cockpit
        if (crew.JobGroupCode.startsWith('00101')) {
            if (crew.JobGroupCode == '0010103' || crew.JobGroupCode == '0010104') {
                $scope.profile.certificates.push({ Title: 'TRE', Issue: null, Expire: $scope.profile.TREExpired });
                $scope.profile.certificates.push({ Title: 'TRI', Issue: null, Expire: $scope.profile.TRIExpired });
            }
            $scope.profile.certificates.push({ Title: 'Skill Test/Proficiency LPC', Issue: $scope.profile.LPCIssued, Expire: $scope.profile.LPCExpired });
            $scope.profile.certificates.push({ Title: 'Skill Test/Proficiency OPC', Issue: $scope.profile.OPCIssued, Expire: $scope.profile.OPCExpired });
            //ICAO LPR
            $scope.profile.certificates.push({ Title: 'ICAO LPR', Issue: null, Expire: $scope.profile.LPRExpired }); 
            //Cold Weather Operation
            $scope.profile.certificates.push({ Title: 'Cold Weather Operation', Issue: $scope.profile.ColdWXIssued, Expire: $scope.profile.ColdWXExpired }); 
            //Hot Weather Operation
            $scope.profile.certificates.push({ Title: 'Hot Weather Operation', Issue: $scope.profile.HotWXIssued, Expire: $scope.profile.HotWXExpired }); 
            //Line Check 
            $scope.profile.certificates.push({ Title: 'Line Check', Issue: $scope.profile.LineIssued, Expire: $scope.profile.LineExpired }); 
        }
        else {
             //Recurrent Training
            $scope.profile.certificates.push({ Title: 'Recurrent Training', Issue: $scope.profile.RecurrentIssued, Expire: $scope.profile.RecurrentExpired });
            //First Aid
            $scope.profile.certificates.push({ Title: 'First Aid', Issue: $scope.profile.FirstAidIssued, Expire: $scope.profile.FirstAidExpired });
        }
        $scope.popup_profile_visible = true;
    };

    $scope.txt_ScheduleName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.ScheduleName',
            
        }
    };
    $scope.txt_Group = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.JobGroup',

        }
    };
    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        readOnly:true,
        bindingOptions: {
            value: 'profile.FirstName',
            
        }
    }; 
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'profile.LastName',
             
        }
    };
    $scope.txt_Mobile = {


        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',
        readOnly:true,
        bindingOptions: {
            value: 'profile.Mobile',
             
        }
    };

    $scope.dg_cer_columns = [


        
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },


        
       { dataField: 'Issue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd', allowEditing: false, width: 200 },
        { dataField: 'Expire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd', allowEditing: false, width: 200 },


    ];
    $scope.dg_cer_selected = null;
    $scope.dg_cer_instance = null;
    $scope.dg_cer_ds = null;
    $scope.dg_cer = {

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
        height: $(window).height() -400, 

        columns: $scope.dg_cer_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cer_instance)
                $scope.dg_cer_instance = e.component;

        },
        onSelectionChanged: function (e) {
             
        },


        bindingOptions: {
            dataSource: 'profile.certificates',

        }
    };




    $scope.dg_pdty_columns = [



        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:100 },



        { dataField: 'StartLocal', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'EndLocal', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'RestToLocal', caption: 'Rest To', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd HH:mm', allowEditing: false, width: 150 },
        { dataField: 'InitRoute', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 220 },
        { dataField: 'InitFlts', caption: 'Flights', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'IsFDPOver', caption: 'IsOver', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'DurationDuty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DurationFDP2', caption: 'FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'MaxFDP2', caption: 'Max FDP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },

    ];
    $scope.dg_pdty_selected = null;
    $scope.dg_pdty_instance = null;
    
    $scope.dg_pdty = {

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
        height: $(window).height() - 320, 

        columns: $scope.dg_pdty_columns,
        onContentReady: function (e) {
            if (!$scope.dg_pdty_instance)
                $scope.dg_pdty_instance = e.component;

        },
        onSelectionChanged: function (e) {
            
        },

        onCellPrepared: function (e) {

            if (e.rowType === "data" && e.column.dataField == "RestToLocal" && e.data.InteruptedId) {
               // console.log('e.data.InteruptedId', e.data.InteruptedId);
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");
            }
        },
        onRowPrepared: function (e) {
            if (e.data &&   e.data.IsFDPOver) {
                e.rowElement.css('background', '#ffcc00');

            }

        },
        bindingOptions: {
            dataSource: 'ds_profile_duties',

        }
    };

   //////////////////////////
    $scope.dt_dty_from = null;
    $scope.date_dty_from = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width: '100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {


            
        },
        bindingOptions: {
            value: 'dt_dty_from'
        }
    };
    $scope.dt_dty_to = null;
    $scope.date_dty_to = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width: '100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {


            
        },
        bindingOptions: {
            value: 'dt_dty_to'
        }
    };

    $scope.btn_search_duties = {
        //text: 'Search',
        type: 'success',
        icon: 'search',
        width: 40,
        
        bindingOptions: {},
        onClick: function (e) {
            if (!$scope.dt_dty_to)
                return;
            if (!$scope.dt_dty_from)
                return;
            $scope.bindDuties();

        }

    };
    $scope.ds_profile_duties = [];
    $scope.bindDuties = function () {
        $scope.loadingVisible = true;

        var _df = moment($scope.dt_dty_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_dty_to).format('YYYY-MM-DD');
        flightService.getDutyTimeLineByCrew(_df, _dt, $scope.profile.Id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_profile_duties = response;
            $.each($scope.ds_profile_duties, function (_i, _d) {
                if (_d.DutyType == 1165) {
                    _d.MaxFDP2 = $scope.formatMinutes(_d.MaxFDP);
                    _d.DurationDuty2 = $scope.formatMinutes(_d.DurationDuty);
                    _d.DurationFDP2 = $scope.formatMinutes(_d.DurationFDP);
                }
            });
        }, function (err) { });
    };
    ///////////////////////////
    $scope.dtFtlGo = function (d) {
        $scope.dt_ftl = (new Date($scope.dt_ftl)).addDays(d);
    };
    $scope.dt_ftl = null;
    $scope.date_ftl = {
        displayFormat: "yy MMM dd",
        adaptivityEnabled: true,
        type: "date",
        width:'100%',
        //pickerType: "rollers",
        useMaskBehavior: true,
        onValueChanged: function (e) {
            

            $scope.bindFTL();
        },
        bindingOptions: {
            value: 'dt_ftl'
        }
    };
    $scope.data_ftl = null;
    $scope.ds_exceed = [];
    $scope.bindExceed = function () {
        flightService.getFTLExceedAll($scope.profile.Id).then(function (response2) {
            $scope.ds_exceed = response2;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindFTL = function () {
        if (!$scope.dt_ftl)
            return;
        $scope.data_ftl = null;
        $scope.Duties7 = [];
        $scope.DutyColors7 = [];
        $scope.Duties14 = [];
        $scope.DutyColors14 = [];
        $scope.Duties28 = [];
        $scope.DutyColors28 = [];

        $scope.Flights28 = [];
        $scope.FlightColors28 = [];
        $scope.FlightsYear = [];
        $scope.FlightColorsYear = [];
        $scope.FlightsCYear = [];
        $scope.FlightColorsCYear = [];

        $scope.loadingVisible = true;

        flightService.getFTL($scope.profile.Id, moment($scope.dt_ftl).format('YYYY-MM-DD')).then(function (response) {
            
            $scope.loadingVisible = false;
            if (!response.Duty7)
                response.Duty7 = 0;
            if (!response.Duty14)
                response.Duty14 = 0;
            if (!response.Duty28)
                response.Duty28 = 0;

            if (!response.Flight28)
                response.Flight28 = 0;
            if (!response.FlightYear)
                response.FlightYear = 0;
            if (!response.FlightCYear)
                response.FlightCYear = 0;

            $scope.data_ftl = response;

            /*response.Duty7 = 50*60;
            response.Duty14 = 110*60;
            response.Duty28 = 195*60;
            */

            /*response.Flight28 = 100 * 60;
            response.FlightYear = 1000 * 60;
            response.FlightCYear = 1000 * 60;*/

            var d7 = response.Duty7 / 60.0;
            $scope.d7 = $scope.formatMinutes(response.Duty7);
            var d14 = response.Duty14 / 60.0;
            $scope.d14 = $scope.formatMinutes(response.Duty14);
            var d28 = response.Duty28 / 60.0;
            $scope.d28 = $scope.formatMinutes(response.Duty28);

            $scope.Duties28.push(d28);
            var d28color = '#00cc99';
            if (response.Duty28 >= 0.80 * 190 * 60)
                d28color = "#e68a00";
            if (response.Duty28 >= 190 * 60)
                d28color = "#ff1a1a";
            $scope.DutyColors28.push(d28color);
            $scope.d28style.color = d28color;

            $scope.Duties14.push(d14);
            var d14color = '#00cc99';
            if (response.Duty14 >= 0.80 * 110 * 60)
                d14color = "#ff8000";
            if (response.Duty14 >= 110 * 60)
                d14color = "#ff1a1a";
            $scope.DutyColors14.push(d14color);
            $scope.d14style.color = d14color;

            $scope.Duties7.push(d7);
            var d7color = '#00cc99';

            if (response.Duty7 >= 0.80 * 60 * 60) { d7color = "#ffaa00"; }
            if (response.Duty7 >= 60 * 60)
                d7color = "#ff1a1a";
            $scope.DutyColors7.push(d7color);
            $scope.d7style.color = d7color;

            var f28 = response.Flight28 / 60.0;
            $scope.Flights28.push(f28);
            var _fcol = '#00cc99';
            if (response.Flight28 >= 0.80 * 100 * 60)
                _fcol = "#ff8000";
            if (response.Flight28 >= 100 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColors28.push(_fcol);

            $scope.FlightsYear.push(response.FlightYear / 60.0);
            _fcol = '#00cc99';
            if (response.FlightYear >= 0.80 * 1000 * 60)
                _fcol = "#ff8000";
            if (response.FlightYear >= 1000 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColorsYear.push(_fcol);

            $scope.FlightsCYear.push(response.FlightCYear / 60.0);
            _fcol = '#00cc99';
            if (response.FlightCYear >= 0.80 * 900 * 60)
                _fcol = "#ff8000";
            if (response.FlightCYear >= 900 * 60)
                _fcol = "#ff1a1a";
            $scope.FlightColorsCYear.push(_fcol);

            


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        



    };

    $scope.d7style = {
        display: 'inline-block',
    };
    $scope.yfstyle = {
        display: 'inline-block',
    };
    $scope.fstyle = {
        display: 'inline-block',
    };
    $scope.cyfstyle = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    ////////////////////////
    $scope.d14style = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    $scope.d28style = {
        display: 'inline-block',
        'margin-left': '5px',
    };
    $scope.d7 = null;
    $scope.d14 = null;
    $scope.d28 = null;

    $scope.f = null;
    $scope.yf = null;
    $scope.cyf = null;
    $scope.Duties7 = [];
    $scope.DutyColors7 = [];
    $scope.Duties14 = [];
    $scope.DutyColors14 = [];
    $scope.Duties28 = [];
    $scope.DutyColors28 = [];
    $scope.getDutyText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        var dvalue = $scope.data_ftl['Duty' + n] / 60.0;
        var dp = Number((dvalue * 100.0) / m).toFixed();
        var txt = $scope.formatMinutes(dvalue * 60) + ' (' + dp + '%)';
        return txt;
    };
    $scope.getFlightText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28";
        var m = 100;
        if (n == 12) { m = 1000; str = "FlightYear"; }
        if (n == 1) {
            m = 900; str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str] / 60.0;
        var dp = Number((dvalue * 100.0) / m).toFixed();
        var txt = $scope.formatMinutes(dvalue * 60) + ' (' + dp + '%)';
        return txt;
    };
    $scope.getFlightText2 = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getFlightRemainingText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var str = "Flight28Remain";

        if (n == 12) { str = "FlightYearRemain"; }
        if (n == 1) {
            str = "FlightCYearRemain";
        }
        var dvalue = ($scope.data_ftl[str]) / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };

    $scope.getDutyText2 = function (n) {
        if (!$scope.data_ftl)
            return "";

        var dvalue = $scope.data_ftl['Duty' + n] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getDutyText3 = function (rec,field) {
       

        var dvalue = rec[field] / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };
    $scope.getDutyCellStyle = function (n) {
        if (!$scope.data_ftl)
            return {};
        var dvalue = $scope.data_ftl['Duty' + n];
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };
    $scope.getFlightCellStyle = function (n) {
        if (!$scope.data_ftl)
            return {};
        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = $scope.data_ftl[str];
        var m = 100;
        if (n == 12)
            m = 1000;
        if (n == 1)
            m = 900;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };


    $scope.getDutyCellStyle3 = function (rec,n) {
       
        var dvalue = rec['Duty' + n];
        var m = 60;
        if (n == 14)
            m = 110;
        if (n == 28)
            m = 190;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };
    $scope.getFlightCellStyle3 = function (rec,n) {
        
        var str = "Flight28";

        if (n == 12) { str = "FlightYear"; }
        if (n == 1) {
            str = "FlightCYear";
        }
        var dvalue = rec[str];
        var m = 100;
        if (n == 12)
            m = 1000;
        if (n == 1)
            m = 900;
        if (dvalue >= m * 60)
            //d28color = "#e68a00";
            return {
                color: 'white',
                fontWeight: 'bold',
                background: '#ff1a1a'
            };
        if (dvalue >= 0.80 * m * 60)
            //d28color = "#e68a00";
            return {
                color: 'black',
                fontWeight: 'bold',
                background: '#e68a00'
            };

    };


    $scope.getDutyRemainingText = function (n) {
        if (!$scope.data_ftl)
            return "";
        var m = 60 * 60;
        if (n == 14)
            m = 110 * 60;
        if (n == 28)
            m = 190 * 60;
        var dvalue = (m - $scope.data_ftl['Duty' + n]) / 60.0;

        var txt = $scope.formatMinutes(dvalue * 60);
        return txt;
    };

    $scope.bl_year = null;
    $scope.sb_year = {
        // openOnFieldClick: false,
        // showDropDownButton: false,
        showClearButton: false,
        searchEnabled: false,

        onSelectionChanged: function (arg) {

           
            $scope.bindBL();
        },
        dataSource: [2019, 2020, 2021, 2022],
        bindingOptions: {
            value: 'bl_year',


        }
    };

    $scope.dt_bl = null;

    $scope.date_bl = {
        displayFormat: "yyyy",
        adaptivityEnabled: true,
        type: "date",
        width: 150,
        //pickerType: "rollers",

        useMaskBehavior: true,
        calendarOptions: {
            zoomLevel: 'decade',
            minZoomLevel: 'decade',
            maxZoomLevel: 'decade',
        },
        onValueChanged: function (e) {
            var _dt = moment($scope.dt_bl).format('YYYY-MM-DDTHH:mm:ss');
            localStorageService.set('stat_bl_date', _dt);
            $scope.bindBL();
        },
        bindingOptions: {
            value: 'dt_bl'
        }
    };

    $scope.chart_bl = {
        title: {
            text: 'FLIGHT & BLOCK TIME',
            font: { color: 'gray', size: 14 },
            horizontalAlignment:'center',
        },
        legend: {

            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#ccc', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_bl_instance)
                $scope.chart_bl_instance = e.component;
        },
        palette: "Green Mist",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return $scope.formatMinutes(this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'BlockTime', name: 'Block', },
            { valueField: 'FlightTime', name: 'Flight', },
        ],


        tooltip: { 
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 350,
             
        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };

    $scope.chart_cnt = {
        title: {
            text: 'TOTAL NUMBER OF FLIGHTS',
            font: { color: 'gray', size: 14 },
            horizontalAlignment: 'center',
        },     
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#eeeeee', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',   
                    weight: 800,     
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_cnt_instance)
                $scope.chart_cnt_instance = e.component;
        },
        palette: "Soft Blue",

        commonSeriesSettings: {
            type: "bar",

            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return (this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'Flights', name: 'Sectors', },

        ],


        tooltip: {
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            label: {
                customizeText: function () {
                    return (this.value);
                }
            },
        }],
        size: {
            height: 350,
        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };
        

    $scope.chart_fltratio = {
        title: {
            text: 'FLIGHT TIME / TOTAL NUMBER OF FLIGHTS (mm)',
            font: { color: 'gray', size: 14 },
            horizontalAlignment: 'center',
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'right',
        },
        commonPaneSettings: {
            backgroundColor: 'white',
            border: { top: true, bottom: true, left: true, right: true, color: '#eeeeee', visible: true }
        },
        commonAxisSettings: {
            label: {
                color: 'gray',
                font: {
                    color: 'gray',
                    weight: 800,
                    // size: 12,
                    // family: 'Tahoma'
                }
            },
            maxValueMargin: 0.1,

        },
        "export": {
            enabled: false
        },
        onInitialized: function (e) {
            if (!$scope.chart_fltratio_instance)
                $scope.chart_fltratio_instance = e.component;
        },
        palette: "Harmony Light",

        commonSeriesSettings: {
            type: "spline",
            width: 4,
            argumentField: "MonthName",
            ignoreEmptyPoints: true,
            label: {
                //backgroundColor: 'gray',
                position: 'outside',
                color: 'gray',
                backgroundColor: 'transparent',
                font: {
                    color: 'gray',
                    size: 11,
                    weight: 500,
                },
                customizeText: function () {
                    if (!this.value || this.value == 0)
                        return "";
                    return $scope.formatMinutes(this.value);
                },
                visible: true,

            },
            // barWidth: 30,
        },
        series: [
            { valueField: 'FLTRatio', name: 'Ratio', },

        ],


        tooltip: {
            enabled: false,
            zIndex: 10000,
            // location: "edge",
            customizeTooltip: function (arg) {
                // alert(arg.seriesName + " " + $scope.formatMinutes(arg.value));
                return {
                    text: arg.seriesName + ": " + $scope.formatMinutes(arg.value)
                };
            }
        },
        valueAxis: [{
            valueType: "numeric",
            label: {
                customizeText: function () {
                    return $scope.formatMinutes(this.value);
                }
            },
        }],
        size: {
            height: 350,
        },
        bindingOptions: {
            "dataSource": "data_bl",



        }
    };


    $scope.data_bl = null;
    $scope.bindBL = function () {
        if (!$scope.bl_year)
            return;
        $scope.loadingVisible = true;

        flightService.getFlightTimeYear($scope.profile.Id, /*moment($scope.dt_bl).format('YYYY')*/$scope.bl_year).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                if (!_d.FlightTime)
                    _d.FLTRatio = 0;
                else
                    _d.FLTRatio = ((_d.FlightTime * 1.0) / _d.Flights).toFixed();
            });
            $scope.data_bl = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.duty7Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 60,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties7[arg.index];
                var dp = Number((dvalue * 100.0) / 60).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "7 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties7',
            palette: 'DutyColors7',
        }
    };
    $scope.duty14Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 110,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties14[arg.index];
                var dp = Number((dvalue * 100.0) / 110).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "14 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties14',
            palette: 'DutyColors14',
        }
    };
    $scope.duty28Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 190,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Duties28[arg.index];
                var dp = Number((dvalue * 100.0) / 190).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "28 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Duties28',
            palette: 'DutyColors28',
        }
    };



    $scope.flight28Gauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 100,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.Flights28[arg.index];
                var dp = Number((dvalue * 100.0) / 100).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "28 Days",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'Flights28',
            palette: 'FlightColors28',
        }
    };
    $scope.flightYearGauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 1000,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.FlightsYear[arg.index];
                var dp = Number((dvalue * 100.0) / 1000).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "12 Consecutive Months",
            horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20
        },
        bindingOptions: {
            values: 'FlightsYear',
            palette: 'FlightColorsYear',
        }
    };
    $scope.flightCYearGauge = {
        barSpacing: 4,
        relativeInnerRadius: 0.7,
        startValue: 0,
        endValue: 900,

        label: {
            visible: false,
            indent: 20,
            connectorWidth: 0,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            font: {
                size: 14,
                color: 'gray',
            },
            customizeText: function (arg) {

                var dvalue = $scope.FlightsCYear[arg.index];
                var dp = Number((dvalue * 100.0) / 900).toFixed();
                return $scope.formatMinutes(dvalue * 60);//+ ' ('+dp+'%)'; //arg.valueText + " %";
            }
        },

        title: {
            text: "Calendar Year",
             horizontalAlignment: 'center',
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            font: {
                size: 15,
                weight: 900,
                color: 'gray',
            }
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 20, 
            right: 20
        },
        bindingOptions: {
            values: 'FlightsCYear',
            palette: 'FlightColorsCYear',
        }
    };


    $scope.barGaugeOptions = {
        size: { height: 500, width: 500 },
        startValue: 0,
        endValue: 200,
        values: [121.4, 135.4, 115.9, 141.1, 127.5],
        label: { visible: false },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: getText(arg, arg.valueText),
                };
            },
        },
        export: {
            enabled: true,
        },
        title: {
            text: 'Average Speed by Racer',
            font: {
                size: 28,
            },
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            customizeText(arg) {
                return getText(arg.item, arg.text);
            },
        },
    };

    function getText(item, text) {
        return `Racer ${item.index + 1} - ${text} km/h`;
    }

   
    $scope.goFlights = function (y, m) {
        var data = { crewId: $scope.profile.Id, yy:y,mm:m };

        $rootScope.$broadcast('InitRptFlights', data);
    };
    ///////////////////////////////
    $scope.popup_time_visible = false;
    $scope.popup_time_title = 'Duties Report';
    

    $scope.popup_time = {
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
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function(arg) {

                        $scope.popup_time_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function(e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function(e) {

        },
        onShown: function(e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            $scope.bindDutyTimeLine();
             
        },
        onHiding: function() {

          
            $scope.popup_time_visible = false;

        },
        bindingOptions: {
            visible: 'popup_time_visible',

           
        }
    };





    $scope.tlRes = [];
    $scope.tlGroup = [];
    $scope.tlData = [];

    const _resourcesData = [
        {
            text: 'AMIRI',
            CrewId: 3481,
            color: '#cb6bb2',
        }, {
            text: 'CHANGIZI',
            CrewId: 3493,
            color: '#56ca85',
        }, 
    ];

    var _priorityData = [
        {
            text: 'Low Priority',
            id: 3481,
            //color: '#1e90ff',
        }, {
            text: 'High Priority',
            id: 3493,
            //color: '#ff9747',
        },
    ]; 

    const _data = [{
        DutyTypeTitle: 'Google AdWords Strategy',
        ownerId: [3481],
        startDate: new Date('2021-02-01T16:00:00.000Z'),
        endDate: new Date('2021-02-01T17:30:00.000Z'),
        CrewId: 3481,
        priority:3481,
    }, {
            DutyTypeTitle: 'New Brochures',
            ownerId: [3493],
            startDate: new Date('2021-02-01T18:30:00.000Z'),
            endDate: new Date('2021-02-01T21:15:00.000Z'),
            CrewId: 3493,
            priority:3493,
    }
    ];
    const data = [
        {
            text: 'Website Re-Design Plan',
            priorityId: 2,
            startDate: new Date('2021-04-19T16:30:00.000Z'),
            endDate: new Date('2021-04-19T18:30:00.000Z'),
        }, {
            text: 'Book Flights to San Fran for Sales Trip',
            priorityId: 1,
            startDate: new Date('2021-04-22T17:00:00.000Z'),
            endDate: new Date('2021-04-22T19:00:00.000Z'),
        }, {
            text: 'Install New Router in Dev Room',
            priorityId: 1,
            startDate: new Date('2021-04-19T20:00:00.000Z'),
            endDate: new Date('2021-04-19T22:30:00.000Z'),
        }, {
            text: 'Approve Personal Computer Upgrade Plan',
            priorityId: 2,
            startDate: new Date('2021-04-20T17:00:00.000Z'),
            endDate: new Date('2021-04-20T18:00:00.000Z'),
        }, {
            text: 'Final Budget Review',
            priorityId: 2,
            startDate: new Date('2021-04-20T19:00:00.000Z'),
            endDate: new Date('2021-04-20T20:35:00.000Z'),
        }, {
            text: 'New Brochures',
            priorityId: 2,
            startDate: new Date('2021-04-19T20:00:00.000Z'),
            endDate: new Date('2021-04-19T22:15:00.000Z'),
        }, {
            text: 'Install New Database',
            priorityId: 1,
            startDate: new Date('2021-04-20T16:00:00.000Z'),
            endDate: new Date('2021-04-20T19:15:00.000Z'),
        }, {
            text: 'Approve New Online Marketing Strategy',
            priorityId: 2,
            startDate: new Date('2021-04-21T19:00:00.000Z'),
            endDate: new Date('2021-04-21T21:00:00.000Z'),
        }, {
            text: 'Upgrade Personal Computers',
            priorityId: 1,
            startDate: new Date('2021-04-19T16:00:00.000Z'),
            endDate: new Date('2021-04-19T18:30:00.000Z'),
        }, {
            text: 'Prepare 2021 Marketing Plan',
            priorityId: 2,
            startDate: new Date('2021-04-22T18:00:00.000Z'),
            endDate: new Date('2021-04-22T20:30:00.000Z'),
        }, {
            text: 'Brochure Design Review',
            priorityId: 1,
            startDate: new Date('2021-04-21T18:00:00.000Z'),
            endDate: new Date('2021-04-21T20:30:00.000Z'),
        }, {
            text: 'Create Icons for Website',
            priorityId: 2,
            startDate: new Date('2021-04-23T17:00:00.000Z'),
            endDate: new Date('2021-04-23T18:30:00.000Z'),
        }, {
            text: 'Upgrade Server Hardware',
            priorityId: 1,
            startDate: new Date('2021-04-23T16:00:00.000Z'),
            endDate: new Date('2021-04-23T22:00:00.000Z'),
        }, {
            text: 'Submit New Website Design',
            priorityId: 2,
            startDate: new Date('2021-04-23T23:30:00.000Z'),
            endDate: new Date('2021-04-24T01:00:00.000Z'),
        }, {
            text: 'Launch New Website',
            priorityId: 2,
            startDate: new Date('2021-04-23T19:20:00.000Z'),
            endDate: new Date('2021-04-23T21:00:00.000Z'),
        }, {
            text: 'Google AdWords Strategy',
            priorityId: 1,
            startDate: new Date('2021-04-26T16:00:00.000Z'),
            endDate: new Date('2021-04-26T19:00:00.000Z'),
        }, {
            text: 'Rollout of New Website and Marketing Brochures',
            priorityId: 1,
            startDate: new Date('2021-04-26T20:00:00.000Z'),
            endDate: new Date('2021-04-26T22:30:00.000Z'),
        }, {
            text: 'Non-Compete Agreements',
            priorityId: 2,
            startDate: new Date('2021-04-27T20:00:00.000Z'),
            endDate: new Date('2021-04-27T22:45:00.000Z'),
        }, {
            text: 'Approve Hiring of John Jeffers',
            priorityId: 2,
            startDate: new Date('2021-04-27T16:00:00.000Z'),
            endDate: new Date('2021-04-27T19:00:00.000Z'),
        }, {
            text: 'Update NDA Agreement',
            priorityId: 1,
            startDate: new Date('2021-04-27T18:00:00.000Z'),
            endDate: new Date('2021-04-27T21:15:00.000Z'),
        }, {
            text: 'Update Employee Files with New NDA',
            priorityId: 1,
            startDate: new Date('2021-04-30T16:00:00.000Z'),
            endDate: new Date('2021-04-30T18:45:00.000Z'),
        }, {
            text: 'Submit Questions Regarding New NDA',
            priorityId: 1,
            startDate: new Date('2021-04-28T17:00:00.000Z'),
            endDate: new Date('2021-04-28T18:30:00.000Z'),
        }, {
            text: 'Submit Signed NDA',
            priorityId: 1,
            startDate: new Date('2021-04-28T20:00:00.000Z'),
            endDate: new Date('2021-04-28T22:00:00.000Z'),
        }, {
            text: 'Review Revenue Projections',
            priorityId: 2,
            startDate: new Date('2021-04-28T18:00:00.000Z'),
            endDate: new Date('2021-04-28T21:00:00.000Z'),
        }, {
            text: 'Comment on Revenue Projections',
            priorityId: 2,
            startDate: new Date('2021-04-26T17:00:00.000Z'),
            endDate: new Date('2021-04-26T20:00:00.000Z'),
        }, {
            text: 'Provide New Health Insurance Docs',
            priorityId: 2,
            startDate: new Date('2021-04-30T19:00:00.000Z'),
            endDate: new Date('2021-04-30T22:00:00.000Z'),
        }, {
            text: 'Review Changes to Health Insurance Coverage',
            priorityId: 2,
            startDate: new Date('2021-04-29T16:00:00.000Z'),
            endDate: new Date('2021-04-29T20:00:00.000Z'),
        }, {
            text: 'Review Training Course for any Omissions',
            priorityId: 1,
            startDate: new Date('2021-04-29T18:00:00.000Z'),
            endDate: new Date('2021-04-29T21:00:00.000Z'),
        },
    ];

    const priorityData = [
        {
            text: 'Low Priority',
            id: 1,
            color: '#1e90ff',
        }, {
            text: 'High Priority',
            id: 2,
            color: '#ff9747',
        },
    ];

    $scope.bindDutyTimeLine = function(){ 

        flightService.getDutyTimeLine(2021, 2, 'P1', -1).then(function(response) {
            $scope.tlRes = Enumerable.From(response.resources).ToArray();
            //$scope.tlGroup = Enumerable.From(response.resources).ToArray();
            $.each(response.resources, function(_i, _d) {
                //if (_d.id == 3481 || _d.id == 3493)
                
                    $scope.tlGroup.push({
                        id: _d.id,
                        text: _d.text,
                    });
            });
            $.each(response.duties, function(_i, _d) {
                _d.ownerId = [];
                _d.ownerId.push(_d.CrewId);
                _d.StartLocal = new Date(_d.StartLocal);
                _d.EndLocal = new Date(_d.EndLocal);
            }); 
            $scope.tlData = response.duties;
            console.log($scope.tlGroup);
            $scope.schedulerOptions = {  
                timeZone: 'America/Los_Angeles',
                dataSource:data, //$scope.tlData,
               // views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
                views: [
                    {
                        type: 'timelineMonth',
                        name: 'Timeline',
                        groupOrientation: 'vertical',
                    },
                     
                ],
                currentView: 'Timeline',
                currentDate: new Date(2021, 1, 1),  
                firstDayOfWeek: 0,
                startDayHour: 8,
                endDayHour: 20,
                cellDuration: 60,
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'ownerId',
                    allowMultiple: true,
                    dataSource: $scope.tlRes,
                    label: 'Owner',
                    useColorAsDefault: true,
                }, {
                    fieldExpr: 'priority',
                    allowMultiple: false,
                        dataSource: $scope.tlGroup,  //$scope.tlGroup,
                    label: 'Priority',
                    }],
                scrolling: {
                    mode: 'standard',
                },
                height: 680,
                textExpr: 'DutyTypeTitle',
             //  startDateExpr: 'StartLocal',
             //   endDateExpr:'EndLocal',
            };



           


        }, function(err) { });

    };


    $scope.options = {
        timeZone: 'America/Los_Angeles',
        dataSource: data,
        views: [{
            type: 'workWeek',
            name: 'Vertical Grouping',
            groupOrientation: 'vertical',
            cellDuration: 60,
            intervalCount: 2,
        }, {
            type: 'workWeek',
            name: 'Horizontal Grouping',
            groupOrientation: 'horizontal',
            cellDuration: 30,
            intervalCount: 2,
        }],
        currentView: 'Vertical Grouping',
        crossScrollingEnabled: true,
        currentDate: new Date(2021, 3, 21),
        startDayHour: 9,
        endDayHour: 16,
        groups: ['priorityId'],
        resources: [
            {
                fieldExpr: 'priorityId',
                allowMultiple: false,
                dataSource: priorityData,
                label: 'Priority',
            },
        ],
        showCurrentTimeIndicator: false,
        showAllDayPanel: false,
    };
    //const resourcesData = [
    //    {
    //        text: 'Samantha Bright',
    //        id: 1,
    //        color: '#cb6bb2',
    //    }, {
    //        text: 'John Heart',
    //        id: 2,
    //        color: '#56ca85',
    //    }, {
    //        text: 'Todd Hoffman',
    //        id: 3,
    //        color: '#1e90ff',
    //    }, {
    //        text: 'Sandra Johnson',
    //        id: 4,
    //        color: '#ff9747',
    //    },
    //];

    //const priorityData = [
    //    {
    //        text: 'Low Priority',
    //        id: 1,
    //        color: '#1e90ff',
    //    }, {
    //        text: 'High Priority',
    //        id: 2,
    //        color: '#ff9747',
    //    },
    //];

    //const data = [{
    //    text: 'Google AdWords Strategy',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-01T16:00:00.000Z'),
    //    endDate: new Date('2021-02-01T17:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'New Brochures',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-01T18:30:00.000Z'),
    //    endDate: new Date('2021-02-01T21:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Brochure Design Review',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-01T20:15:00.000Z'),
    //    endDate: new Date('2021-02-01T23:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Website Re-Design Plan',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-01T23:45:00.000Z'),
    //    endDate: new Date('2021-02-02T18:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Rollout of New Website and Marketing Brochures',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-02T15:15:00.000Z'),
    //    endDate: new Date('2021-02-02T17:45:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Update Sales Strategy Documents',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-02T19:00:00.000Z'),
    //    endDate: new Date('2021-02-02T20:45:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Non-Compete Agreements',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-03T16:15:00.000Z'),
    //    endDate: new Date('2021-02-03T17:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Approve Hiring of John Jeffers',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-03T17:00:00.000Z'),
    //    endDate: new Date('2021-02-03T18:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Update NDA Agreement',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-03T18:45:00.000Z'),
    //    endDate: new Date('2021-02-03T20:45:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Update Employee Files with New NDA',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-03T21:00:00.000Z'),
    //    endDate: new Date('2021-02-03T23:45:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Submit Questions Regarding New NDA',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-05T01:00:00.000Z'),
    //    endDate: new Date('2021-02-04T16:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Submit Signed NDA',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-04T19:45:00.000Z'),
    //    endDate: new Date('2021-02-04T21:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Review Revenue Projections',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-05T00:15:00.000Z'),
    //    endDate: new Date('2021-02-04T15:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Comment on Revenue Projections',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-05T16:15:00.000Z'),
    //    endDate: new Date('2021-02-05T18:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Provide New Health Insurance Docs',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-05T19:45:00.000Z'),
    //    endDate: new Date('2021-02-05T21:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Review Changes to Health Insurance Coverage',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-05T21:15:00.000Z'),
    //    endDate: new Date('2021-02-05T22:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Review Training Course for any Omissions',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-08T21:00:00.000Z'),
    //    endDate: new Date('2021-02-09T19:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Recall Rebate Form',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-08T19:45:00.000Z'),
    //    endDate: new Date('2021-02-08T20:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Create Report on Customer Feedback',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-09T22:15:00.000Z'),
    //    endDate: new Date('2021-02-10T00:30:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Review Customer Feedback Report',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-09T23:15:00.000Z'),
    //    endDate: new Date('2021-02-10T01:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Customer Feedback Report Analysis',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-10T16:30:00.000Z'),
    //    endDate: new Date('2021-02-10T17:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Prepare Shipping Cost Analysis Report',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-10T19:30:00.000Z'),
    //    endDate: new Date('2021-02-10T20:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Provide Feedback on Shippers',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-10T21:15:00.000Z'),
    //    endDate: new Date('2021-02-10T23:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Select Preferred Shipper',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-11T00:30:00.000Z'),
    //    endDate: new Date('2021-02-11T03:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Complete Shipper Selection Form',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-11T15:30:00.000Z'),
    //    endDate: new Date('2021-02-11T17:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Upgrade Server Hardware',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-11T19:00:00.000Z'),
    //    endDate: new Date('2021-02-11T21:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Upgrade Personal Computers',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-11T21:45:00.000Z'),
    //    endDate: new Date('2021-02-11T23:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Upgrade Apps to Windows RT or stay with WinForms',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-12T17:30:00.000Z'),
    //    endDate: new Date('2021-02-12T20:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Estimate Time Required to Touch-Enable Apps',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-12T21:45:00.000Z'),
    //    endDate: new Date('2021-02-12T23:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Report on Tranistion to Touch-Based Apps',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-13T01:30:00.000Z'),
    //    endDate: new Date('2021-02-13T02:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Submit New Website Design',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-15T15:00:00.000Z'),
    //    endDate: new Date('2021-02-15T17:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Create Icons for Website',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-15T18:30:00.000Z'),
    //    endDate: new Date('2021-02-15T20:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Create New Product Pages',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-16T16:45:00.000Z'),
    //    endDate: new Date('2021-02-16T18:45:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Approve Website Launch',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-16T19:00:00.000Z'),
    //    endDate: new Date('2021-02-16T22:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Update Customer Shipping Profiles',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-17T16:30:00.000Z'),
    //    endDate: new Date('2021-02-17T18:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Create New Shipping Return Labels',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-17T19:45:00.000Z'),
    //    endDate: new Date('2021-02-17T21:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Get Design for Shipping Return Labels',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-17T22:00:00.000Z'),
    //    endDate: new Date('2021-02-17T23:30:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'PSD needed for Shipping Return Labels',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-18T15:30:00.000Z'),
    //    endDate: new Date('2021-02-18T16:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Contact ISP and Discuss Payment Options',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-18T18:30:00.000Z'),
    //    endDate: new Date('2021-02-18T23:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Prepare Year-End Support Summary Report',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-19T00:00:00.000Z'),
    //    endDate: new Date('2021-02-19T03:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Review New Training Material',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-19T15:00:00.000Z'),
    //    endDate: new Date('2021-02-19T16:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Distribute Training Material to Support Staff',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-19T19:45:00.000Z'),
    //    endDate: new Date('2021-02-19T21:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Training Material Distribution Schedule',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-19T21:15:00.000Z'),
    //    endDate: new Date('2021-02-19T23:15:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Approval on Converting to New HDMI Specification',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-22T16:30:00.000Z'),
    //    endDate: new Date('2021-02-22T17:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Create New Spike for Automation Server',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-22T17:00:00.000Z'),
    //    endDate: new Date('2021-02-22T19:30:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Code Review - New Automation Server',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-22T20:00:00.000Z'),
    //    endDate: new Date('2021-02-22T22:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Confirm Availability for Sales Meeting',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-23T17:15:00.000Z'),
    //    endDate: new Date('2021-02-23T22:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Reschedule Sales Team Meeting',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-23T23:15:00.000Z'),
    //    endDate: new Date('2021-02-24T01:00:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Send 2 Remotes for Giveaways',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-24T16:30:00.000Z'),
    //    endDate: new Date('2021-02-24T18:45:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Discuss Product Giveaways with Management',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-24T19:15:00.000Z'),
    //    endDate: new Date('2021-02-24T23:45:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Replace Desktops on the 3rd Floor',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-25T16:30:00.000Z'),
    //    endDate: new Date('2021-02-25T17:45:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Update Database with New Leads',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-25T19:00:00.000Z'),
    //    endDate: new Date('2021-02-25T21:15:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Mail New Leads for Follow Up',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-25T21:45:00.000Z'),
    //    endDate: new Date('2021-02-25T22:30:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Send Territory Sales Breakdown',
    //    ownerId: [2],
    //    startDate: new Date('2021-02-26T01:00:00.000Z'),
    //    endDate: new Date('2021-02-26T03:00:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Territory Sales Breakdown Report',
    //    ownerId: [1],
    //    startDate: new Date('2021-02-26T15:45:00.000Z'),
    //    endDate: new Date('2021-02-26T16:45:00.000Z'),
    //    priority: 1,
    //}, {
    //    text: 'Report on the State of Engineering Dept',
    //    ownerId: [3],
    //    startDate: new Date('2021-02-26T21:45:00.000Z'),
    //    endDate: new Date('2021-02-26T22:30:00.000Z'),
    //    priority: 2,
    //}, {
    //    text: 'Staff Productivity Report',
    //    ownerId: [4],
    //    startDate: new Date('2021-02-26T23:15:00.000Z'),
    //    endDate: new Date('2021-02-27T02:30:00.000Z'),
    //    priority: 2,
    //}];
    //$scope.schedulerOptions = {
    //   // timeZone: 'America/Los_Angeles',
    //    dataSource: data,
    //    views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
    //    currentView: 'timelineMonth',
    //    currentDate: new Date(2021, 1, 2),
    //    firstDayOfWeek: 0,
    //    startDayHour: 8,
    //    endDayHour: 20,
    //    cellDuration: 60,
    //    groups: ['CrewId'],
    //    resources: [{
    //        fieldExpr: 'ownerId',
    //        allowMultiple: true,
    //        dataSource: resourcesData,
    //        label: 'Owner',
    //        useColorAsDefault: true,
    //    }, {
    //        fieldExpr: 'priority',
    //        allowMultiple: false,
    //        dataSource: priorityData,
    //        label: 'Priority',
    //    }],
    //    height: 580,
    //};


   

    ////////////////////////////

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