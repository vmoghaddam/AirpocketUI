'use strict';
app.controller('trnStatController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', '$window', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window) {
    $scope.prms = $routeParams.prms;


    var tabs = [
        { text: "Courses", id: 'course' },
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


    $scope.coursetype = null;
    $scope.sb_coursetype = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        placeholder: 'Course Type',
        onSelectionChanged: function (e) {


        },
        bindingOptions: {
            value: 'coursetype',

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
    $scope.bindTeachers = function () {
        trnService.getTeachers().then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_teachers = response;


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
        dataSource: [{ Id: -1, Title: 'All' }, { Id: 1, Title: 'Last' },  ],
        displayExpr: "Title",
        valueExpr: 'Id',
        placeholder: 'Rank',
        bindingOptions: {
            value: 'rank',

        }
    };

    $scope.active = 1;
    $scope.sb_active = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: [{ Id: -1, Title: 'InActive' }, { Id: 1, Title: 'Active' },],
        displayExpr: "Title",
        valueExpr: 'Id',
        placeholder: 'Active/InActive',
        bindingOptions: {
            value: 'active',

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
        { dataField: 'JobGroup', caption: 'JobGroup', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'LastName', caption: 'LastName', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'FirstName', caption: 'FirstName', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },

        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, fixed: true, fixedPosition: 'left' },
        { dataField: 'No', caption: 'ClassID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'Title', caption: 'Course Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },

        { dataField: 'Duration', caption: 'Duration(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Instructor1', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Instructor2', caption: 'Instructor 2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },

        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'Mandatory', caption: 'Man.', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },

        { dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 120, fixed: true, fixedPosition: 'right' },
        { dataField: 'Remains', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixedPosition: 'right', fixed: true },
        //04-30

        {
            dataField: "ImageUrl", caption: 'IMG',
            width: 55,
            name: 'ImageUrl',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value ? 'cer2' : 'certification-document';
                if (options.value)
                    $("<div>")
                        .append("<img style='height:30px;' src='content/images/" + fn + ".png' />")
                        .appendTo(container);
                else
                    $("<div>").appendTo(container);
            },
            fixed: true, fixedPosition: 'right',

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
        height: $(window).height() - 155  ,

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
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "CourseType") {
                $scope.styleCell(e, e.data.Remains, e.data.ValidStatus);
            }
        },

        //04-30
        onCellClick: function (e) {
            var clmn = e.column;
            var field = clmn.dataField;
            if (clmn.name == "ImageUrl" && e.data.ImageUrl)
                $scope.showImage({ url: $rootScope.clientsFilesUrl + e.data.ImageUrl, caption: '' });

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
                    column: "Duration",
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
        
        if ($scope.selectedTab.id == 'course') {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
            var _df = moment($scope.dt_from).format('YYYY-MM-DD');
            var result = !$scope.result && $scope.result != -1 ? -2 : $scope.result;

            //df, dt,  ct,   status,   cstatus,   cls,   pid
            $scope.loadingVisible = true;
            trnService.getTrnStatCoursePeople(_df, _dt, $scope.coursetype ? $scope.coursetype : -1, result, $scope.status ? $scope.status : -1, '-1', '-1', ($scope.inst1 ? $scope.inst1 : -1), ($scope.inst2 ? $scope.inst2 : -1), ($scope.rank ? $scope.rank : 1), ($scope.active ? $scope.active : 1), ($scope.grp ? $scope.grp:-1)).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_course_ds = (response.Data);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };

    $scope.group_ds = {
        store: {
            type: "odata",
            url: $rootScope.serviceUrl + 'odata/base/jobgroups/' + '1',

            version: 4,

        },
       
        sort: ['Remark'],

    };
    $scope.grp = null;
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        onInitialized: function (e) {

            if (!$scope.groupIns)
                $scope.groupIns = e.component;
        },
        displayExpr: "TitleFormated",
        valueExpr: 'Remark',
        bindingOptions: {
            value: 'grp',
            readOnly: 'isGroupReadOnly',
            dataSource: 'group_ds'
        }
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Statistics';
        $('.trnstat').fadeIn();
        $scope.bindTeachers();
    }
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);

