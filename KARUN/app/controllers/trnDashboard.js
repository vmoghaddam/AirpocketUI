'use strict';
app.controller('trnDashboardController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', '$window', '$compile', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window, $compile) {
    $scope.prms = $routeParams.prms;
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
    $scope.isdrillvisble = false;
    $scope.active_header = '_summary_header'; //'_scheduleyear_header';
    $scope._header_click = function (h, tab) {
        $('._xheader').removeClass('selected');
        $('.' + h).addClass('selected');
        $scope.active_header = h;
        $('._header_child').hide();
        $scope.isdrillvisble = tab == "_group";
        $('.' + tab).fadeIn(300, function () {
            
            if (!$scope.pie_passed_instance)
                $scope.pie_passed_instance.render({
                    force: true, // forces redrawing
                    animate: false // redraws the widget without animation
                });
            $scope.dg_type_instance.repaint();

            

        });
    };

    $('._summary').fadeIn(300, function () {


    });

    $scope.df = (new Date()).addDays(-365);
    $scope.dt = (new Date()) ;
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'df',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'dt',

        }
    };
    $scope.momentDate = function (date) {
        if (!date)
            return '-';
        return moment(date).format('YYYY-MMM-DD');
    };
    $scope.momentTime = function (date) {
        if (!date)
            return '-';
        return moment(date).format('HH:mm');
    };

    $scope.getMainStyle = function () {
        var h = $(window).height() - 150;
        return {
            height: h + 'px',
            
        }
    }
    $scope.getMainStyle2 = function () {
        var h = $(window).height() - 160;
        return {
            height: h + 'px',

        }
    }



    /////////////////////////
    $scope.ds_summary = [];
    $scope.getSummary = function (callback) {
        var _df = moment($scope.df).format('YYYY-MM-DD');
        var _dt = moment($scope.dt).format('YYYY-MM-DD');
        $scope.loadingVisible = true;
        trnService.getTrnSummary(_df,_dt).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_summary = response;
            $scope.ds_pie_status = response.status;
            callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.getCourseTypes = function (callback) {
        var _df = moment($scope.df).format('YYYY-MM-DD');
        var _dt = moment($scope.dt).format('YYYY-MM-DD');
       // $scope.loadingVisible = true;
        trnService.getRptCourseType(_df, _dt).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_types = response;
            
            callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.getGroups = function (grp,callback) {
        var _df = moment($scope.df).format('YYYY-MM-DD');
        var _dt = moment($scope.dt).format('YYYY-MM-DD');
        // $scope.loadingVisible = true;
        grp = !grp ? -1 : grp;
        trnService.getRptCourseJobGroup(_df, _dt,-1,grp).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_group = response;

            setTimeout(function () {
                $scope.tile_group_click($scope.ds_group.summary[0].Group);
            }, 500);


            callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.getCoursePerson = function (pid,callback) {
        var _df = moment($scope.df).format('YYYY-MM-DD');
        var _dt = moment($scope.dt).format('YYYY-MM-DD');
         $scope.loadingVisible = true;
        trnService.getRptCoursePerson(_df, _dt,pid).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_person = response.people;

            callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };



    $scope.tile_group = "";
    $scope.tile_group_click = function (grp) {
        $('.grp-tile').removeClass('selected');
        $('#' + grp).addClass('selected');
        $scope.tile_group = grp;
        var ds = Enumerable.From($scope.ds_group.people).Where("$.Group=='" + grp + "'").ToArray();
        $scope.ds_dg_group = ds;
    };

    $scope.grp_nav = [""];
    $scope.group_drill = function (n) {
        if (n==1 && !$scope.tile_group)
            return;
        if (n == -1 && $scope.grp_nav.length==1)
            return;
        //$scope.pre_group = $scope.dg_group_selected.Group;
        $scope.ds_dg_group = [];
        $scope.loadingVisible = true;
        if (n == 1) {
            $scope.grp_nav.push($scope.tile_group);
            $scope.getGroups($scope.tile_group, function () {

            });
        }
        else {
          //  var _grp = $scope.tile_group.substr(0, $scope.tile_group.length - 2);
           // alert($scope.tile_group);
            // alert(_grp);
            $scope.getGroups($scope.grp_nav[$scope.grp_nav.length-2], function () {

            });
            if ($scope.grp_nav.length > 1)
                $scope.grp_nav.pop();
        }
        

    }

    $scope.btn_down = {
        text: 'Down',
        type: 'default',
        icon: 'arrowdown',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.group_drill(1);
        }

    };
    $scope.btn_up = {
        text: 'Up',
        type: 'default',
        icon: 'arrowup',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.group_drill(-1);
        }

    };

    $scope.getTileWrapperStyle = function () {
        var w = $scope.ds_group && $scope.ds_group.summary? $scope.ds_group.summary.length * 320:400;
        return {
            width:w+'px',
        };
    };

    $scope.rank = '';
    $scope.sb_rank = {

        showClearButton: false,
        searchEnabled: false,
        dataSource: ['Cockpit', 'Cabin', 'F/D', 'GRND', 'COMM', 'CAMO', 'MAINTENANCE', 'TRAINING', 'LEGAL', 'QA'
            , 'CATERING'
            , 'SECURITY'
            , 'SUPPORT'
            , 'ADMINISTRATIVE'
            , 'MANAGEMENT'
            , 'PUBLIC RELATIONS'
            , 'OPERATION'
            , 'CRM'
            , 'LOGISTIC'
            , 'IT'
            , 'All'],
        //readOnly:true,
        onValueChanged: function (e) {
            $scope.get_profiles_ds();

        },
        bindingOptions: {
            value: 'rank',

        }
    };

    $scope.get_profiles_ds = function () {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        trnService.getTrnProfilesAbs($scope.rank).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.dg_employees_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Dashboard';
        $('.trndashboard').fadeIn();
    }
    ////////////////////////
    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'success',
        icon: 'refresh',
        width: 150,

        bindingOptions: {},
        onClick: function (e) {
            $scope.getSummary(function () {

                $scope.getCourseTypes(function () {
                    $scope.getGroups('', function () {


                    });

                });

            });

            $scope.rank = 'Cockpit';
        }

    };

    $scope.pie_status_instance = null;
    $scope.pie_status = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_status_instance)
                $scope.pie_status_instance = e.component;
        },
         sizeGroup: 'sg1',
        type: "doughnut",
        palette: 'Harmony Light',
        // diameter: 0.85,
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function () {
                return { text: (this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "Status",
                valueField: "Count",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            }

        ],
        //title: {
        //    margin: {
        //        left: 30
        //    },
        //    font: {
        //        size: 16,
        //    }
        //},
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'ds_pie_status',
           // 'title.text': 'pie_text',

        }
    };
    $scope.pie_passed_instance = null;
    $scope.pie_passed = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_passed_instance)
                 $scope.pie_passed_instance = e.component;
        },
        sizeGroup: 'sg1',
        type: "doughnut",
        palette: 'Ocean',
        // diameter: 0.85,
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function () {
                return { text: (this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "Status",
                valueField: "Count",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            }

        ],
      
        size: {
            height: 350,
        },
        bindingOptions: {
            dataSource: 'ds_summary.passed',
            // 'title.text': 'pie_text',

        }
    };


    $scope.bar_status = {
        size: {
            height: 350,
        },
        sizeGroup: 'sg1',
        //palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'Status',
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
            barWidth: 30,
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        //title: {
        //    text: 'Expiring', font: { size: 13 }
        //},
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
        series: [
            { valueField: 'Count', name: 'Status', showInLegend: false, }         
            
        ],
        margin: {top:10,},
        bindingOptions: {
            
            dataSource: 'ds_pie_status',
        }
    };

    $scope.bar_type = {
        size: {
            height: 600,
        },
        //sizeGroup: 'sg1',
         palette: 'Harmony Light',
        commonSeriesSettings: {
            argumentField: 'CourseType',
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
            barWidth: 30,
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        //title: {
        //    text: 'Expiring', font: { size: 13 }
        //},
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
        series: [
            { valueField: 'Count', name: 'Count', showInLegend: true, },
          //  { valueField: 'Duration', name: 'Duration(hrs)', showInLegend: true, }

        ],
        margin: { top: 10, },
        bindingOptions: {

            dataSource: 'ds_summary.type',
        }
    };

    $scope.bar_group = {
        size: {
            height: 500,
        },
        //sizeGroup: 'sg1',
        palette: 'Bright',
        commonSeriesSettings: {
            argumentField: 'Title',
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
            barWidth: 30,
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        //title: {
        //    text: 'Expiring', font: { size: 13 }
        //},
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
        series: [
            { valueField: 'Count', name: 'Count', showInLegend: true, },
            //{ valueField: 'Duration', name: 'Duration(hrs)', showInLegend: true, }

        ],
        margin: { top: 10, },
        bindingOptions: {

            dataSource: 'ds_summary.group',
        }
    };


    $scope.bar_type2 = {
        size: {
            height: 600,
        },
        //sizeGroup: 'sg1',
        palette: 'Pastel',
        commonSeriesSettings: {
            argumentField: 'CourseType',
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
            barWidth: 30,
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        //title: {
        //    text: 'Expiring', font: { size: 13 }
        //},
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
        series: [
           // { valueField: 'Count', name: 'Count', showInLegend: true, },
            { valueField: 'Duration', name: 'Duration(hrs)', showInLegend: true, }

        ],
        margin: { top: 10, },
        bindingOptions: {

            dataSource: 'ds_summary.type',
        }
    };

    $scope.bar_group2 = {
        size: {
            height: 500,
        },
        //sizeGroup: 'sg1',
        palette: 'Pastel',
        commonSeriesSettings: {
            argumentField: 'Title',
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
            barWidth: 30,
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        //title: {
        //    text: 'Expiring', font: { size: 13 }
        //},
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
        series: [
          //  { valueField: 'Count', name: 'Count', showInLegend: true, },
            { valueField: 'Duration', name: 'Duration(hrs)', showInLegend: true, }

        ],
        margin: { top: 10, },
        bindingOptions: {

            dataSource: 'ds_summary.group',
        }
    };


    $scope.dg_type_columns = [
        { dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },
        { dataField: 'Done', caption: 'Done', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left',sortIndex:1,sortOrder:'desc' },
        { dataField: 'InProgress', caption: 'InProg.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width:90, fixed: false, fixedPosition: 'left', },
        { dataField: 'Scheduled', caption: 'Scheduled', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left', },
        { dataField: 'Canceled', caption: 'Canceled', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left', },
        { dataField: 'Duration', caption: 'Duration(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
       
    ];
    $scope.dg_type_selected = null;
    $scope.dg_type_instance = null;

    $scope.dg_type = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_type_columns,
        onContentReady: function (e) {
            if (!$scope.dg_type_instance)
                $scope.dg_type_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_type_selected = null; $scope.dg_typed_ds = []; }
            else {
                $scope.dg_type_selected = data;
                $scope.dg_typed_ds = data.Items;
            }


        },

        height: $(window).height() - 160,
        bindingOptions: {
            dataSource: 'ds_types.courses', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };



    $scope.dg_typed_selected = null;
    $scope.dg_typed_instance = null;
    $scope.dg_typed_ds = [];
    $scope.dg_typed_columns = [
        { dataField: 'No', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'DateStart', caption: 'Start', format:'yyyy-MMM-dd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'End', format: 'yyyy-MMM-dd',allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250, fixed: false, fixedPosition: 'left', },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'right', },

    ];
    $scope.dg_typed = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_typed_columns,
        onContentReady: function (e) {
            if (!$scope.dg_typed_instance)
                $scope.dg_typed_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_typed_selected = null; }
            else {
                $scope.dg_typed_selected = data;

            }


        },

        height: $(window).height() - 160,
        bindingOptions: {
            dataSource: 'dg_typed_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };




    $scope.dg_group_columns = [
        //{
        //    dataField: 'GroupTitle', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left',
        //},
        {
            dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left',
        },
        { dataField: 'Count', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'desc' },
        { dataField: 'Passed', caption: 'P.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Failed', caption: 'F.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Unknown', caption: 'U.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Duration', caption: 'Dur.(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },

    ];
    $scope.dg_group_selected = null;
    $scope.dg_group_instance = null;

    $scope.dg_group = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_group_columns,
        onContentReady: function (e) {
            if (!$scope.dg_group_instance)
                $scope.dg_group_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_group_selected = null; $scope.ds_dg_groupd = []; }
            else {
                $scope.dg_group_selected = data;
                $scope.ds_dg_groupd = data.Items;
            }


        },

        height: $(window).height() - 250,
        bindingOptions: {
            dataSource: 'ds_dg_group', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };



    $scope.dg_groupd_columns = [
        {
            dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', sortIndex:0,sortOrder:'asc'
        },
        {
            dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc'
        },
        {
            dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left',
        },
        {
            dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'left', dataType: 'center', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left',
        },
        {
            dataField: 'CourseId', caption: 'NO', allowResizing: true, alignment: 'left', dataType: 'center', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left',
        },
        {
            dataField: 'CoursePeopleStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left',
        },
        
    ];
    $scope.dg_groupd_selected = null;
    $scope.dg_groupd_instance = null;

    $scope.dg_groupd = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_groupd_columns,
        onContentReady: function (e) {
            if (!$scope.dg_group_instance)
                $scope.dg_group_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_groupd_selected = null;  }
            else {
                $scope.dg_groupd_selected = data;
                // $scope.dg_typed_ds = data.Items;
            }


        },

        height: $(window).height() - 250,
        bindingOptions: {
            dataSource: 'ds_dg_groupd', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };


    $scope.dg_employees_columns = [


        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixedPosition: 'left', },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixedPosition: 'left' },


    ];
    $scope.dg_employees_instance = null;
    $scope.dg_employees_ds = null;
    $scope.dg_employees = {
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
        height: $(window).height() - 195,

        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employees_selected = null;
                $scope.ds_person = [];

            }
            else {
                $scope.dg_employees_selected = data;
                $scope.getCoursePerson(data.PersonId, function () { });
            }



        },
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_employees_ds'
        }
    };





    $scope.dg_cp_columns = [
        //{
        //    dataField: 'GroupTitle', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left',
        //},
        {
            dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left',
        },
        { dataField: 'Count', caption: 'Total', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'desc' },
        { dataField: 'Passed', caption: 'P.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Failed', caption: 'F.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Unknown', caption: 'U.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', },
        { dataField: 'Duration', caption: 'Dur.(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },

    ];
    $scope.dg_cp_selected = null;
    $scope.dg_cp_instance = null;

    $scope.dg_cp = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_cp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cp_instance)
                $scope.dg_cp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_cp_selected = null; $scope.dg_cpd_ds = []; }
            else {
                $scope.dg_group_selected = data;
                $scope.dg_cpd_ds = data.Items;
            }


        },

        height: $(window).height() - 155,
        bindingOptions: {
            dataSource: 'ds_person', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };



    $scope.dg_cpd_selected = null;
    $scope.dg_cpd_instance = null;
    $scope.dg_cpd_ds = [];
    $scope.dg_cpd_columns = [
        { dataField: 'CourseId', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'DateIssue', caption: 'Issue', format: 'yyyy-MMM-dd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateExpire', caption: 'Expire', format: 'yyyy-MMM-dd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250, fixed: false, fixedPosition: 'left', },
        { dataField: 'CoursePeopleStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'right', },

    ];
    $scope.dg_cpd = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_cpd_columns,
        onContentReady: function (e) {
            if (!$scope.dg_cpd_instance)
                $scope.dg_cpd_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_cpd_selected = null; }
            else {
                $scope.dg_cpd_selected = data;

            }


        },

        height: $(window).height() - 160,
        bindingOptions: {
            dataSource: 'dg_cpd_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };


    $scope.$on('$viewContentLoaded', function () {
         setTimeout(function () {
             $scope.getSummary(function () {

                 $scope.getCourseTypes(function () {
                     $scope.getGroups('',function () {


                     });

                 });

             });

             $scope.rank = 'Cockpit';

         }, 500);
        //setTimeout(function () {
        //    $scope.get_scheduleyear_ds();

        //}, 1000);

        //setTimeout(function () {
        //    $scope.rank = 'Cockpit';
        //}, 1200);


    });

    /////////////////////
}]);