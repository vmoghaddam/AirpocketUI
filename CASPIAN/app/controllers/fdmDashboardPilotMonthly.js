'use strict';
app.controller('fdmDashboardPilotMonthlyController', ['$http', '$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'fdmService', 'aircraftService', 'authService', 'notificationService', '$route', function ($http, $scope, $location, $routeParams, $rootScope, flightService, fdmService, aircraftService, authService, notificationService, $route) {
    var lowColor = '#0099cc';
    var medColor = '#ffcc66';
    var highColor = '#ff1a1a';

    //$scope._crewId = parseInt($routeParams.crewId);
    //$scope._jobGroup = $routeParams.jobGroup;

    $scope._crewId = null;

    $scope.clearPopup = function () {
        $scope.isGround = false;
        $scope.isTraining = false;
    }

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {

            console.log($scope._jobGroup);

            if ($scope._crewId != null)
                $scope.bind();
            else
                alert("Select a Cpt")

        }
    };

    $scope.btn_training = {
        text: 'Training',
        type: 'normal',
        //icon: 'search',
        //width: 120,
        bindingOptions: {},
        onClick: function (e) {
            $scope.clearPopup();
            $scope.popup_action_title = "Training";
            $scope.isTraining = true;
            $scope.popup_action_visible = true;
        }
    };



    $scope.btn_ground = {
        text: 'Ground',
        type: 'normal',
        //icon: 'search',
        //width: 120,
        bindingOptions: {},
        onClick: function (e) {
            $scope.clearPopup();
            $scope.popup_action_title = "Ground";
            //$scope.isGround = true;
            $scope.popup_action_visible = true;
        }
    };

    $scope.btn_ops = {
        text: 'OPS-Safety-Board',
        type: 'normal',

        bindingOptions: {},
        onClick: function (e) {

        }
    };

    $scope.btn_sag = {
        text: 'SAG',
        type: 'normal',
        // width: 120,
        bindingOptions: {},
        onClick: function (e) {

        }
    };

    $scope.btn_safety = {
        text: 'Safety',
        type: 'normal',
        //width: 120,
        bindingOptions: {},
        onClick: function (e) {

        }
    };

    $scope.yt = new Date().getFullYear();
    $scope.mt = new Date().getMonth();

    if ($scope.mt - 6 < 0) {
        $scope.result = $scope.mt - 6;
        $scope.yf = $scope.yt - 1;
        $scope.mf = 12 + $scope.result
    } else {
        $scope.yf = $scope.yt;
        $scope.mf = $scope.mt - 6;
    }




    //$scope.btn_FDMEvents = {
    //    text: 'Events',
    //    type: 'success',
    //    width: 120,
    //    onClick: function (e) {
    //        $scope.df = new Date();
    //        $scope.dt = new Date();
    //        $scope.df.setFullYear($scope.yf, $scope.mf, 1);
    //        $scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
    //        $scope.dt = $scope.dt.toISOString().split('T')[0];
    //        $scope.df = $scope.df.toISOString().split('T')[0];



    //        fdmService.getCptFDMInfo($scope.df, $scope.dt, $scope._crewId).then(function (response) {

    //            $scope.popup_fdm_visible = true;
    //            $scope.dg_events_ds = response.Data;
    //        });
    //    }

    //};


    $scope.popup_fdm_visible = false;
    $scope.popup_fdm = {
        title: "FDM Events",
        fullScreen: true,
        show_Title: true,
        visible: false,
        showCloseButton: true,
        onHiding: function () {


            $scope.popup_fdm_visible = false;
        },
        bindingOptions: {
            visible: 'popup_fdm_visible',
        }
    }
    $scope.btn_action = {
        text: 'Actions',
        type: 'success',
        width: 120,
        bindingOptions: {},
        onClick: function (e) {
            if (!$scope.dg_fdmEvents_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            //alert( $scope._crewId);


            $scope.popup_actions_visible = true;
        }
    };
    $scope.popup_actions_visible = false;
    $scope.popup_actions = {
        title: "Actions",
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'GRND', onClick: function (e) { $scope.popup_ground_visible = true; } }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'TRN', onClick: function (e) { $scope.popup_trn_visible = true; } }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'OPS SAFETY BOARD', }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'SAG', }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'SAFETY NOTICE', }, toolbar: 'bottom' },

        ],
        fullScreen: false,
        height: 400,
        width: 750,
        visible: false,
        onShown: function (e) {
            fdmService.getEventActions($scope.dg_fdmEvents_selected.Id).then(function (response) {


                $scope.dg_action_ds = response;
            });

        },
        showCloseButton: true,

        bindingOptions: {
            visible: 'popup_actions_visible'
        }
    }

    $scope.dg_action_columns = [
        { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yyyy-MM-dd', allowEditing: false, width: 120, sortOrder: 'desc', sortIndex: 0 },
        { dataField: 'ActionType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },


        { dataField: 'StartDate', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MMM-dd', allowEditing: false, width: 100 },
        { dataField: 'EndDate', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MMM-dd', allowEditing: false, width: 100 },
        { dataField: 'CourseName', caption: 'Course', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'ActionInfo', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 200 },

    ];

    $scope.ground_from = null;
    $scope.date_ground_from = {
        type: "date",
        width: '100%',
        height: 25,
        //pickerType: 'rollers',
        interval: 15,

        bindingOptions: {
            value: 'ground_from',
        }
    };
    $scope.ground_to = null;
    $scope.date_ground_to = {
        type: "date",
        width: '100%',
        height: 25,
        //pickerType: 'rollers',
        interval: 15,

        bindingOptions: {
            value: 'ground_to',

        }
    };
    $scope.ground_remark = null;
    $scope.txt_ground_remark = {
        height: 30,
        bindingOptions: {
            value: 'ground_remark',

        }
    };
    $scope.popup_ground_visible = false;
    $scope.popup_ground = {
        fullScreen: false,
        height: 400,
        width: 400,
        visible: false,
        title: 'GROUND',

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', onClick: function (e) {

                        var dto = {};
                        dto.eventId = $scope.dg_fdmEvents_selected.Id;
                        dto.crew = $scope._crewId;
                        dto.type = 'GROUND';
                        dto.start = moment($scope.ground_from).format('YYYYMMDD');
                        dto.end = moment($scope.ground_to).format('YYYYMMDD');
                        dto.remark = $scope.ground_remark;

                        fdmService.saveAction(dto).then(function (response) {
                            $scope.popup_ground_visible = false;
                        });
                    }

                }, toolbar: 'bottom'
            },

        ],
        onHiding: function (e) {

            fdmService.getEventActions($scope.dg_fdmEvents_selected.Id).then(function (response) {
                $scope.dg_action_ds = response;

            });

        },

        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_ground_visible',

        }
    }




    $scope.trn_from = null;
    $scope.date_trn_from = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,

        bindingOptions: {
            value: 'trn_from',

        }
    };
    $scope.trn_to = null;
    $scope.date_trn_to = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,

        bindingOptions: {
            value: 'trn_to',

        }
    };
    $scope.trn_remark = null;
    $scope.txt_trn_remark = {
        bindingOptions: {
            value: 'trn_remark',
            height: '60',
        }
    };
    $scope.trn_ct = null;
    $scope.txt_trn_ct = {
        bindingOptions: {
            value: 'trn_ct',

        }
    };
    $scope.popup_trn_visible = false;
    $scope.popup_trn = {
        fullScreen: false,
        height: 340,
        width: 400,
        visible: false,
        title: 'TRAINING',
        showCloseButton: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'SAVE', onClick: function (e) {

                        var dto = {};
                        dto.eventId = $scope.dg_fdmEvents_selected.Id;
                        dto.crew = $scope._crewId;
                        dto.type = 'TRAINING';
                        dto.start = moment($scope.trn_from).format('YYYYMMDD');
                        dto.end = moment($scope.trn_to).format('YYYYMMDD');
                        dto.remark = $scope.trn_remark;
                        dto.course = $scope.trn_ct;

                        fdmService.saveAction(dto).then(function (response) {
                            $scope.popup_trn_visible = false;
                        });
                    }

                }, toolbar: 'bottom'
            },

        ],
        onHiding: function (e) {

            fdmService.getEventActions($scope.dg_fdmEvents_selected.Id).then(function (response) {
                $scope.dg_action_ds = response;
                $scope.popup_ground_visible = false;
            });
        },
        bindingOptions: {
            visible: 'popup_trn_visible',

        }
    }

    $scope.dg_action_selected = null;
    $scope.dg_action_instance = null;
    $scope.dg_action_ds = null;
    $scope.dg_action = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'Single' },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 250,
        onContentReady: function (e) {
            if (!$scope.dg_action_instance)
                $scope.dg_action_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_action_selected = null;
            }
            else
                $scope.dg_action_selected = data;


        },

        columns: $scope.dg_action_columns,
        bindingOptions: {
            dataSource: 'dg_action_ds',
        }
    }


    $scope.popup_action_visible = false;
    $scope.popup_action = {
        fullScreen: false,
        height: 295,
        width: 350,
        visible: false,
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_action_visible',
            title: 'popup_action_title'
        }
    }

    /////////////////////////////////////////


    $scope.isContentVisible = false;
    $scope.bind = function () {
        $scope.ymf = $scope.yf.toString() + $scope.mf.toString().padStart(2, '0');
        $scope.ymt = $scope.yt.toString() + $scope.mt.toString().padStart(2, '0');
        $scope.ymf = parseInt($scope.ymf);
        $scope.ymt = parseInt($scope.ymt);

        $scope.df = new Date();
        $scope.dt = new Date();
        $scope.df.setFullYear($scope.yf, $scope.mf, 1);
        $scope.dt.setFullYear($scope.yt, $scope.mt + 1, 0);
        $scope.dt = $scope.dt.toISOString().split('T')[0];
        $scope.df = $scope.df.toISOString().split('T')[0];
        $scope.isContentVisible = true;

        if ($scope._jobGroup == 'p2' || $scope._jobGroup == 'P2') {
            $scope.isCPT = false;

            fdmService.getFoEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptEventsMonthly = response.Data;
                $scope.arr = [];
                $.each($scope.ds_cptEventsMonthly, function (_i, _d) {
                    $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
                });
                $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getFDMFoMonthly2($scope.yt, $scope.mt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptMonthly = response.Data.data;
                $scope.ds_cptTotalEvents = [{ level: 'Low', Count: response.Data.TotalLowLevel }, { level: 'Medium', Count: response.Data.TotalMediumLevel }, { level: 'High', Count: response.Data.TotalHighLevel }];

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getFDMFoRegMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptRegEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptPhaseMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptPhaseScore = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getFoTotal($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptTotal = response.Data.data;
                $scope.ds_cptEventsGeneral = response.Data;
                $scope.ds_cptTotalEvents = [{ Event: 'Low', Count: response.Data.TotalLowCount }, { Event: 'Medium', Count: response.Data.TotalMediumCount }, { Event: 'High', Count: response.Data.TotalHighCount }, { Score: 'LowScore', Count: response.Data.TotalLowScore }, { Score: 'MediumScore', Count: response.Data.TotalMediumScore }, { Score: 'HighScore', Count: response.Data.TotalHighScore }];
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            fdmService.getCptFDMInfo($scope.df, $scope.dt, $scope._crewId).then(function (response) {

                $scope.dg_events_ds = response.Data;
            });
            fdmService.cptRoute($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {

                $scope.ds_cptRoute = response.Data;
            });
        } else {
            $scope.isCPT = true;

            //fdmService.getCptEventsMonthly($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
            //    $scope.ds_cptEventsMonthly = response.Data;

            //    $scope.arr = [];
            //    $.each($scope.ds_cptEventsMonthly, function (_i, _d) {
            //        $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
            //    });

            //    $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];


            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptMonthly2($scope.yt, $scope.mt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptMonthly = response.Data.data;

                //    console.log(response.Data.data);
                //    $scope.ds_cptTotalEvents = [{ Event: 'Low', Count: response.Data.TotalLowCount }, { Event: 'Medium', Count: response.Data.TotalMediumCount }, { Event: 'High', Count: response.Data.TotalHighCount }, { Score: 'LowScore', Count: response.Data.TotalLowScore }, { Score: 'MediumScore', Count: response.Data.TotalMediumScore }, { Score: 'HighScore', Count: response.Data.TotalHighScore }];
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptTotal($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptTotal = response.Data.data;
                $scope.ds_cptEventsGeneral = response.Data;
                $scope.ds_cptTotalEvents = [{ Event: 'Low', Count: response.Data.TotalLowCount }, { Event: 'Medium', Count: response.Data.TotalMediumCount }, { Event: 'High', Count: response.Data.TotalHighCount }, { Score: 'LowScore', Count: response.Data.TotalLowScore }, { Score: 'MediumScore', Count: response.Data.TotalMediumScore }, { Score: 'HighScore', Count: response.Data.TotalHighScore }];
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptFoEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptFoEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptIpEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptIpEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getIpCptEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_ipCptEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptRegEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptRegEventsMonthly = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptPhaseMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptPhaseScore = response.Data;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptEventsMonthly2($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {
                $scope.ds_cptEvents = response.Data;
                $scope.arr = [];
                $.each($scope.ds_cptEvents, function (_i, _d) {


                    $scope.arr.push({ name: _d.EventName, value: _d.EventCount });
                });


                $scope.ds_eventsNameTree = [{ name: 'Events', items: $scope.arr }];



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            fdmService.getCptFDMInfo($scope.df, $scope.dt, $scope._crewId).then(function (response) {

                $scope.dg_events_ds = response.Data;
            });
            fdmService.cptRoute($scope.ymf + 1, $scope.ymt + 1, $scope._crewId).then(function (response) {

                $scope.ds_cptRoute = response.Data;
            });
        }
    };


    //////////////////////////////////////////
    var MonthDataSource = [
        { Id: 0, Title: 'January' },
        { Id: 1, Title: 'February' },
        { Id: 2, Title: 'March' },
        { Id: 3, Title: 'April' },
        { Id: 4, Title: 'May' },
        { Id: 5, Title: 'June' },
        { Id: 6, Title: 'July' },
        { Id: 7, Title: 'August' },
        { Id: 8, Title: 'September' },
        { Id: 9, Title: 'October' },
        { Id: 10, Title: 'November' },
        { Id: 11, Title: 'December' },

    ];

    //$scope.yt = new Date().getFullYear();
    //$scope.mt = new Date().getMonth();
    //$scope.yt = new Date().getFullYear();
    //$scope.mt = new Date().getMonth();

    //if ($scope.mt - 6 < 0) {
    //    $scope.result = $scope.mt - 6;
    //    $scope.yf = $scope.yt - 1;
    //    $scope.mf = 12 + $scope.result
    //} else {
    //    $scope.yf = $scope.yt;
    //    $scope.mf = $scope.mt - 6;
    //}

    //$scope.yt = parseInt($routeParams.yt);
    //$scope.yf = parseInt($routeParams.yf);
    //$scope.mt = parseInt($routeParams.mt);
    //$scope.mf = parseInt($routeParams.mf);

    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.sb_yt = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [2021, 2022, 2023],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yt',


        }
    };
    $scope.sb_mf = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mf',


        }
    };
    $scope.sb_mt = {
        placeholder: 'Month',
        showClearButton: false,
        searchEnabled: false,
        dataSource: MonthDataSource,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'mt',


        }
    };


    $scope.sb_crew_selected = null;
    $scope.sb_cpt = {
        placeholder: 'Captian',
        showClearButton: false,
        searchEnabled: true,
        searchModeOption: 'contains',
        searchExprOption: 'Title',
        width: 215,
        displayExpr: 'Title',
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {

            $scope._jobGroup = arg.selectedItem.JobGroup;
        },

        bindingOptions: {
            value: '_crewId',
            dataSource: 'ds_crew',
        }
    };



    ///COLORS//////////////
    var lowColor = '#00cc99';
    var medColor = '#ff9933';
    var highColor = '#ff1a1a';
    var scoreColor = '#bfc3c4 ';
    var totalEvent = '#b3b300 ';
    var totalFlight = '#999966 ';
    /////////////////////////

    ///SIZES/////////////////
    $scope.chrt_size = { height: 600, width: $(window).width() - 100 };
    $scope.chrt_sizeXS = { height: 600, width: $(window).width() - 20 };
    $scope.treeChrt_size = { height: 500, width: $(window).width() - 60 };
    $scope.treeChrt_sizeXS = { height: 500, width: $(window).width() };
    $scope.pie_size = { height: 400 };



    /////////////// Charts ////////////////





    $scope.formatDateYYYYMMDD = function (dt) {
        return moment(dt).format('YYYY-MM-DD');
    };

    $scope.monthConvert = function (monthNo) {
        $.each(MonthDataSource, function (_i, _d) {
            if (_d.Id == monthNo - 1)
                $scope._title = _d.Title
        });

        return $scope._title;

    }

    $scope.convertYearMonth = function (yearMonth) {

        var year = yearMonth.substring(0, 4);
        var month = yearMonth.substring(4);

        $.each(MonthDataSource, function (_i, _d) {
            if (_d.Id == parseInt(month) - 1)
                $scope._title = _d.Title
        });

        return $scope._title + " (" + year + ")";
    }


    $scope.eventsTreeMap = {
        title: 'Events',
        tooltip: {
            enabled: true,
            format: 'thousands',
            customizeTooltip(arg) {
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span class='city'>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },

        bindingOptions:
        {
            dataSource: 'ds_eventsNameTree',
            size: 'treeChrt_size'
        },
    };

    $scope.eventsTreeMapXS = {
        title: 'Events',
        tooltip: {
            enabled: true,
            format: 'thousands',
            customizeTooltip(arg) {
                const { data } = arg.node;
                let result = null;

                if (arg.node.isLeaf()) {
                    result = `<span class='city'>${data.name}</span> <br/>Event count: ${arg.value}`;
                }

                return {
                    text: result,
                };
            },
        },

        bindingOptions:
        {
            dataSource: 'ds_eventsNameTree',
            size: 'treeChrt_sizeXS'
        },
    };



    $scope.typeLineChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'spline', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'spline', stack: 'total' },

        ],
        title: 'Scores & Event By Month',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],
        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            label: {
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);

                },
            }

        },

        bindingOptions:
        {
            dataSource: 'ds_cptMonthly',
            size: 'chrt_size'
        },
    };

    $scope.typeLineChartXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: 'transparent', pane: 'topPane', barWidth: 50, type: 'stackedbar', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: 'transparent', pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'total' },

        ],
        title: 'Scores & Event By Month',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],
        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            label: {
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);

                },
            }

        },

        bindingOptions:
        {
            dataSource: 'ds_cptMonthly',
            size: 'chrt_sizeXS'
        },
    };

    $scope.typeScoreChart = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
        },

        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Month',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            label: {
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);

                },
            }

        },

        bindingOptions:
        {
            dataSource: 'ds_cptMonthly',
            size: 'chrt_size'
        },

    }

    $scope.typeScoreChartXS = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText ,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'YearMonth',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
        },

        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Month',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],

        argumentAxis: { // or valueAxis, or commonAxisSettings
            tickInterval: 1,
            label: {
                customizeText: function (d) {
                    return $scope.convertYearMonth(this.value);

                },
            }

        },

        bindingOptions:
        {
            dataSource: 'ds_cptMonthly',
            size: 'chrt_sizeXS'
        },

    }







    $scope.regCptEventsChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        },
        {
            name: 'midPane',

        },
        {
            name: 'bottomPane',

        }
        ],
        series: [
            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Scores', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        title: 'Scores & Events By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],


        bindingOptions:
        {
            dataSource: 'ds_cptRegEventsMonthly',
            size: 'chrt_size'
        },
    };

    $scope.regCptEventsChartXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            label: {
                visible: false,
            },

        },
        panes: [{
            name: 'topPane',

        },
        {
            name: 'midPane',

        },
        {
            name: 'bottomPane',

        }
        ],
        series: [
            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Scores', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50, type: 'bar' },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        title: 'Scores & Events By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],


        bindingOptions:
        {
            dataSource: 'ds_cptRegEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };



    $scope.registerScoresChart = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 0
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText + '%',//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],


        bindingOptions:
        {
            dataSource: 'ds_cptRegEventsMonthly',
            size: 'chrt_size'
        },
    };

    $scope.registerScoresChartXS = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 0
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText + '%',//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Register',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Register',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],

        argumentAxis: {
            tickInterval: 1,
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        bindingOptions:
        {
            dataSource: 'ds_cptRegEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };

    $scope.cptFoEventsChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'P2Name',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        palette: 'bright',

        title: 'By FO/CPT',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            tickInterval: 1,
        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptFoEventsMonthly',
            size: 'chrt_size'
        },
    };

    $scope.cptFoEventsChartXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'P2Name',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        palette: 'bright',

        title: 'By FO/CPT',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },

            tickInterval: 1,
        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptFoEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };






    $scope.cptNotResEventsChart = {
        commonSeriesSettings: {
            argumentField: 'IpName',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        palette: 'bright',

        title: 'By IP/CPT',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptIpEventsMonthly',
            size: 'chrt_size'
        },
    };

    $scope.cptNotResEventsChartXS = {
        commonSeriesSettings: {
            argumentField: 'IpName',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        palette: 'bright',

        title: 'By IP/CPT',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptIpEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };

    $scope.cptIpEventsChart = {

        commonSeriesSettings: {
            argumentField: 'P1Name',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],
        palette: 'bright',

        title: 'By CPT/IP',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_ipCptEventsMonthly',
            size: 'chrt_size'
        },
    };

    $scope.cptIpEventsChartxs = {

        commonSeriesSettings: {
            argumentField: 'P1Name',
            type: 'stackedbar',

        },
        panes: [{
            name: 'topPane',

        },

        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],
        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],

        palette: 'bright',

        title: 'By CPT/IP',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",

            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_ipCptEventsMonthly',
            size: 'chrt_sizeXS'
        },
    };



    $scope.eventDoughnut = {

        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 410 },

        title: 'Events',

        series: {
            argumentField: 'Event',
            valueField: 'Count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },



        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptTotalEvents'
        },
    };

    $scope.scoreDoughnut = {

        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 410 },

        title: 'Scores',

        series: {
            argumentField: 'Score',
            valueField: 'Count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptTotalEvents'
        },
    };

    $scope.phaseScore = {
        type: 'doughnut',
        palette: 'office',
        size: { height: 410 },

        title: 'Score By Phase',

        series: {
            argumentField: 'Phase',
            valueField: 'Score',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },




        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],
        bindingOptions:
        {
            dataSource: 'ds_cptPhaseScore'
        },
    };

    $scope.phaseEvent = {
        type: 'doughnut',
        palette: 'office',
        size: { height: 410 },

        title: 'Event By Phase',
        series: {
            argumentField: 'Phase',
            valueField: 'EventCount',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],
        bindingOptions:
        {
            dataSource: 'ds_cptPhaseScore'
        },
    };

    $scope.eventDoughnutXS = {

        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 350, width: 350 },

        title: 'Event By Type',

        series: {
            argumentField: 'Event',
            valueField: 'Count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },



        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptTotalEvents'
        },
    };

    $scope.scoreDoughnutXS = {

        type: 'doughnut',
        palette: [lowColor, medColor, highColor],
        size: { height: 350, width: 350 },

        title: 'Score By Type',

        series: {
            argumentField: 'Score',
            valueField: 'Count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],

        bindingOptions:
        {
            dataSource: 'ds_cptTotalEvents'
        },
    };

    $scope.phaseScoreXS = {
        type: 'doughnut',
        palette: 'office',
        size: { height: 350, width: 350 },

        title: 'Score By Phase',

        series: {
            argumentField: 'Phase',
            valueField: 'Score',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },




        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],
        bindingOptions:
        {
            dataSource: 'ds_cptPhaseScore'
        },
    };

    $scope.phaseEventXS = {
        type: 'doughnut',
        palette: 'office',
        size: { height: 350, width: 350 },

        title: 'Event By Phase',
        series: {
            argumentField: 'Phase',
            valueField: 'EventCount',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 1,
                },

                position: 'columns',
            },
        },


        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },

        argumentAxis: {
            label: {
                customizeText: function () {

                    return $scope.monthConvert(this.value);

                },
            }
        },
        valueAxis: [{

            grid: {
                visible: true
            },
            tickInterval: 1,

        }

        ],
        bindingOptions:
        {
            dataSource: 'ds_cptPhaseScore'
        },
    };

    $scope.eventsNameChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'EventCount', name: 'Events Count', barWidth: 50 },

        ],
        title: 'Events Count',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_cptEventsMonthly'
        },
    };


    $scope.eventsScoreChart = {
        palette: 'Office',
        size: { height: 600, width: $(window).width() - 70 },
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'Scores', name: 'Events Score', barWidth: 50 },

        ],
        title: 'Events Score',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            }
        },
        bindingOptions:
        {
            dataSource: 'ds_cptEventsMonthly'
        },
    };












    $scope.eventsCountChart = {
        palette: 'Office',
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'EventCount', name: 'Events Count', barWidth: 50 },

        ],
        title: 'Events Name',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            },

        },
        bindingOptions:
        {
            dataSource: 'ds_cptEvents',
            size: 'treeChrt_size'
        },
    };


    $scope.eventsScoreChart = {
        palette: 'Office',
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'Scores', name: 'Events Score', barWidth: 50 },

        ],
        title: 'Events Score',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            },

        },
        bindingOptions:
        {
            dataSource: 'ds_cptEvents',
            size: 'treeChrt_size'
        },
    };


    $scope.eventsCountChartXS = {
        palette: 'Office',
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'EventCount', name: 'Events Count', barWidth: 50 },

        ],
        title: 'Events Name',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            },

        },
        bindingOptions:
        {
            dataSource: 'ds_cptEvents',
            size: 'treeChrt_sizeXS'
        },
    };


    $scope.eventsScoreChartXS = {
        palette: 'Office',
        commonSeriesSettings: {
            argumentField: 'EventName',
            type: 'bar',
            //  hoverMode: 'allArgumentPoints',
            //  selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        series: [
            { valueField: 'Scores', name: 'Events Score', barWidth: 50 },

        ],
        title: 'Events Score',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: {
            tickInterval: 1,

        },

        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -45,
                font: { size: 16 }

            },

        },
        bindingOptions:
        {
            dataSource: 'ds_cptEvents',
            size: 'treeChrt_sizeXS'
        },
    };

    $scope.cptRouteChart = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],

        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],

        title: 'Scores & Event By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],
        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -90
            }
        },

        bindingOptions:
        {
            dataSource: 'ds_cptRoute',
            size: 'chrt_size'
        },
    };

    $scope.cptRouteChartXS = {
        tooltip: {
            enabled: true,
            location: 'edge',
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',

        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },

        {
            name: 'bottomPane',
        }],

        series: [

            { valueField: 'HighScore', name: 'HighScore', color: highColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumScore', name: 'MediumScore', color: medColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowScore', name: 'LowScore', color: lowColor, pane: 'topPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'Score', name: 'Score', color: scoreColor, pane: 'topPane', type: 'scatter', stack: 'total' },
            { valueField: 'FlightCount', name: 'Flights', color: totalFlight, pane: 'midPane', barWidth: 50 },
            { valueField: 'HighCount', name: 'High', color: highColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'MediumCount', name: 'Medium', color: medColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'LowCount', name: 'Low', color: lowColor, pane: 'bottomPane', type: 'stackedbar', barWidth: 50, stack: 'detailed' },
            { valueField: 'EventCount', name: 'TotalEvent', color: totalEvent, pane: 'bottomPane', type: 'scatter', stack: 'total' },

        ],

        title: 'Scores & Event By Route',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [
            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores',
                },
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Flights',
                },
            },

            {
                height: '80%',
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Events',
                },
            }],
        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -90
            }
        },

        bindingOptions:
        {
            dataSource: 'ds_cptRoute',
            size: 'chrt_sizeXS'
        },
    };

    $scope.eventPerFlightRoute = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,
                precision: 2
            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Route ',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -90
            }
        },
        bindingOptions:
        {
            dataSource: 'ds_cptRoute',
            size: 'chrt_size'
        },
    };

    $scope.eventPerFlightRouteXS = {
        palette: 'Vintage',
        tooltip: {
            enabled: true,
            location: 'edge',
            format: {
                type: "fixedPoint",
                precision: 2
            },
            customizeTooltip(arg) {
                return {
                    text: arg.seriesName + ': ' + arg.valueText,//`${arg.seriesName} years: ${arg.valueText}`,
                };
            },
        },
        commonSeriesSettings: {
            argumentField: 'Route',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: false,

            },
        },
        panes: [{
            name: 'topPane',
        },
        {
            name: 'midPane',
        },
        {
            name: 'bottomPane',
        }],
        series: [
            { valueField: 'ScorePerEvent', name: 'ScorePerEvent', pane: 'topPane', barWidth: 50 },
            { valueField: 'EventPerFlight', name: 'EventPerFlight', pane: 'midPane', barWidth: 50 },
            { valueField: 'ScorePerFlight', name: 'ScorePerFlight', pane: 'bottomPane', barWidth: 50 },

        ],
        title: 'Events & Scores per Flight By Route ',
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: true,
        },
        onPointClick(e) {
            e.target.select();
        },
        valueAxis: [

            {
                pane: 'topPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Score Per Event',
                },

                //constantLines: [{
                //    value: 1.5,
                //    color: '#fc3535',
                //    dashStyle: 'dash',
                //    width: 2,
                //    label: { visible: false },
                //    //bindingOptions:
                //    //{
                //    //    value: 'cptAverage'
                //    //},
                //}],
            },

            {
                pane: 'midPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Event Per Flight',
                },
            },

            {
                pane: 'bottomPane',
                grid: {
                    visible: true,
                },
                title: {
                    text: 'Scores Per Flight',
                },
            },




        ],
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: -90
            }
        },
        bindingOptions:
        {
            dataSource: 'ds_cptRoute',
            size: 'chrt_sizeXS'
        },
    };



    ////////////////// scroll ////////////////


    $scope.rightHeight = $(window).height() - 95;
    $scope.fdm_scroll = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'rightHeight'
        }

    };


    ///////////////////crew //////////////////



    $scope.bindCrew = function () {
        var _dt = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;

        flightService.getCrewForRosterByDate(1, _dt).then(function (response) {
            $scope.loadingVisible = false;
            var _ds = Enumerable.From(response).Where(function (x) { return ['TRI', 'TRE', 'P1', 'P2'].indexOf(x.JobGroup) != -1; }).ToArray();

            $scope.ds_crew = []
            $.each(_ds, function (_i, _d) {

                $scope.ds_crew.push({ Id: _d.Id, Title: _d.LastName + " (" + (_d.JobGroup) + ")", crewId: _d.Id, JobGroup: _d.JobGroup });

            });




            //console.log($scope._crewId);

            //if ($routeParams.crewId) {

            //    //$.each($scope.ds_crew, function (_i, _d) {
            //    //    if (_d.crewId == $routeParams.crewId)
            //    //        $scope.sb_crew_index = _i;
            //    //});


            //}


            $scope.bind();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };


    ///////////////////Data Grid///////////////////
    $scope.dg_fdmEvents_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc' },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Phase', caption: 'Phase', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'StateName', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'PF', caption: 'PF', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'IPCode', caption: 'IPCode', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P1Name', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P1Code', caption: 'P1Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2Name', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },
        { dataField: 'P2Code', caption: 'P2Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Critical', caption: 'Critical', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Major', caption: 'Major', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Minor', caption: 'Minor', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'BlockOff', caption: 'BlockOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'BlockOn', caption: 'BlockOn', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'TakeOff', caption: 'TakeOff', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Landing', caption: 'Landing', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightTime', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'AircraftType', caption: 'AircraftType', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

    ];
    $scope.dg_fdmEvents_selected = null;
    $scope.dg_fdmEvents_instance = null;
    $scope.dg_fdmEvents = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'Single' },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: {
            visible: true,
            showOperationChooser: true,
        },

        columnAutoWidth: false,
        height: $(window).height() - 100,
        onContentReady: function (e) {
            if (!$scope.dg_fdmEvents_instance)
                $scope.dg_fdmEvents_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fdmEvents_selected = null;
            }
            else
                $scope.dg_fdmEvents_selected = data;


        },

        columns: $scope.dg_fdmEvents_columns,
        bindingOptions: {
            dataSource: 'dg_events_ds',
        }
    }


    $scope.dg_cptEvents_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150 },
        { dataField: 'FlightNumber', caption: 'Flight Number', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Severity', caption: 'Severity', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'EventName', caption: 'Event', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 280 },
        { dataField: 'Value', caption: 'Value', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'numeric', allowEditing: false, width: 80 },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P1Code', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'P2Code', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'yy-MMM-dd HH:MM', allowEditing: false, width: 150, sortOrder: 'desc' },
        { dataField: 'AircraftType', caption: 'AircraftType', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'StateName', caption: 'StateName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

    ];
    $scope.dg_cptEvents_selected = null;
    $scope.dg_cptEvents_instance = null;
    $scope.dg_cptEvents = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'Single' },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: {
            visible: true,
            showOperationChooser: true,
        },

        columnAutoWidth: false,
        height: 400,
        onContentReady: function (e) {
            if (!$scope.dg_cptEvents_instance)
                $scope.dg_cptEvents_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_cptEvents_selected = null;
            }
            else
                $scope.dg_cptEvents_selected = data;


        },

        columns: $scope.dg_cptEvents_columns,
        bindingOptions: {
            dataSource: 'dg_events_ds',
        }
    }



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

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> FDM Dashboard Capitan monthly';


        $('.fdmDashboardPilot').fadeIn(400, function () {

        });
    }

    $scope.bindCrew();




}]);