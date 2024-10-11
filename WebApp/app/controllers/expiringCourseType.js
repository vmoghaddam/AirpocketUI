'use strict';
app.controller('expiringCourseTypeController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService) {
    $scope.prms = $routeParams.prms;
    $scope.isDepManager = $rootScope.HasDepartmentManager();
    $scope.employee = null;
    //////////////////////////////////////////

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
    ////////////////////////////
    $scope.dg_main_columns = [
         
        { dataField: 'Title', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  minWidth:200, fixed: true, fixedPosition: 'left', },
        { dataField: 'ValidCount', caption: 'Valid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },
        { dataField: 'UnknownCount', caption: 'Unknown', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'ExpiringCount', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        
        { dataField: 'ExpiredCount', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: true, fixedPosition: 'right' },


    ];
    $scope.dg_main_height = 100;
    $scope.dg_main_selected = null;
    $scope.dg_main_instance = null;
     
    $scope.dg_main = {
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


        columns: $scope.dg_main_columns,
        onContentReady: function (e) {
            if (!$scope.dg_main_instance)
                $scope.dg_main_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_main_selected = null;
                $scope.ds_maingroup = [];
                $scope.ds_groups = [];
            }
            else {
                $scope.dg_main_selected = data;
                if (!$scope.isDepManager)
                    $scope.bindMainGroups(data.TypeId);
                else
                    $scope.bindGroups($scope.dg_main_selected.TypeId, $scope.employee.JobGroupMainCode);

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "ExpiredCount" && e.data.ExpiredCount>0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");
               
            }
            if (e.rowType === "data" && e.column.dataField == "ExpiringCount" && e.data.ExpiringCount > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }
            if (e.rowType === "data" && e.column.dataField == "UnknownCount" && e.data.UnknownCount > 0) {
                e.cellElement.css("backgroundColor", "#d9d9d9");
                e.cellElement.css("color", "#000");
            }
            //UnknownCount
        },
        height: $(window).height() - 145 ,
        bindingOptions: {
            dataSource: 'ds_main', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    /////////////////////////////
    $scope.dg_maingroup_columns = [

        { dataField: 'JobGroupMain', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: true, fixedPosition: 'left', },
        { dataField: 'ValidCount', caption: 'Valid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },
        { dataField: 'UnknownCount', caption: 'Unknown', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'ExpiringCount', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },

        { dataField: 'ExpiredCount', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: true, fixedPosition: 'right' },


    ];
    $scope.dg_maingroup_height = 100;
    $scope.dg_maingroup_selected = null;
    $scope.dg_maingroup_instance = null;

    $scope.dg_maingroup = {
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


        columns: $scope.dg_maingroup_columns,
        onContentReady: function (e) {
            if (!$scope.dg_maingroup_instance)
                $scope.dg_maingroup_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_maingroup_selected = null;
                 
                $scope.ds_groups = [];
            }
            else {
                $scope.dg_maingroup_selected = data;
                $scope.bindGroups($scope.dg_main_selected.TypeId, data.JobGroupMainCode);

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "ExpiredCount" && e.data.ExpiredCount > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "ExpiringCount" && e.data.ExpiringCount > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }
            if (e.rowType === "data" && e.column.dataField == "UnknownCount" && e.data.UnknownCount > 0) {
                e.cellElement.css("backgroundColor", "#d9d9d9");
                e.cellElement.css("color", "#000");
            }
            //UnknownCount
        },
        height: $(window).height() - 145  ,
        bindingOptions: {
            dataSource: 'ds_maingroup', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ///////////////////////////
    $scope.dg_group_columns = [

        { dataField: 'JobGroup', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: true, fixedPosition: 'left', },
        { dataField: 'ValidCount', caption: 'Valid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },
        { dataField: 'UnknownCount', caption: 'Unknown', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'ExpiringCount', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },

        { dataField: 'ExpiredCount', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: true, fixedPosition: 'right' },


    ];
    $scope.dg_group_height = 100;
    $scope.dg_group_selected = null;
    $scope.dg_group_instance = null;

    $scope.dg_group = {
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

            if (!data) {

                $scope.dg_group_selected = null;

                 
            }
            else {
                $scope.dg_group_selected = data;
                //$scope.bindMainGroups(data.TypeId);

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "ExpiredCount" && e.data.ExpiredCount > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "ExpiringCount" && e.data.ExpiringCount > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }
            if (e.rowType === "data" && e.column.dataField == "UnknownCount" && e.data.UnknownCount > 0) {
                e.cellElement.css("backgroundColor", "#d9d9d9");
                e.cellElement.css("color", "#000");
            }
            //UnknownCount
        },
        height: $(window).height() - 145,
        bindingOptions: {
            dataSource: 'ds_group', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    //////////////////////////////
    $scope.dg_course_columns = [
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 270, fixed: true, fixedPosition: 'left' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'Remains', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseTitle', caption: 'Course Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'Duration', caption: 'Duration(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'No', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },

    ];
    $scope.dg_course_selected = null;


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
        height: $(window).height() - 230,

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
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Remains") {
                //2022-01-22
                $scope.styleCell(e, e.data.Remains, e.data.ValidStatus);
            }
            if (e.rowType === "data" && e.column.dataField == "Name") {
                //2022-01-22
                $scope.styleCell(e, e.data.Remains, e.data.ValidStatus);
            }
        },
        onRowClick: function (e) {
            var component = e.component;

            function initialClick() {
                console.log('initial click for key ' + e.key);
                component.clickCount = 1;
                component.clickKey = e.key;
                component.clickDate = new Date();
            }

            function doubleClick() {
                console.log('second click');
                component.clickCount = 0;
                component.clickKey = 0;
                component.clickDate = null;
                if (e.data.CourseId) {
                    var _data = { Id: e.data.CourseId };
                    $rootScope.$broadcast('InitViewCourse', _data);
                }


            }

            if ((!component.clickCount) || (component.clickCount != 1) || (component.clickKey != e.key)) {
                initialClick();
            }
            else if (component.clickKey == e.key) {
                if (((new Date()) - component.clickDate) <= 300)
                    doubleClick();
                else
                    initialClick();
            }

        },
        bindingOptions: {
            dataSource: 'ds_employee',
            
        }
    };
    //////////////////////////
    //2022-01-22
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
    /////////////////////////////
    $scope.popup_emp_visible = false;
    $scope.popup_emp = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_emp"
        },
        shading: true,
        title: 'Employees',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height()-100,
        width: $(window).width() - 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_emp_visible = false;

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
            
            if ($scope.dg_course_instance)
                $scope.dg_course_instance.refresh();


        },
        onHiding: function () {
             
            $scope.popup_emp_visible = false;

        },
        bindingOptions: {
            visible: 'popup_emp_visible',
           


        }
    };

    /////////////////////////////
    $scope.ds_main = [];
    $scope.ds_maingroup = [];
    $scope.ds_group = [];
    $scope.ds_employee = [];
    $scope.bind = function () {
        $scope.ds_main = [];
        $scope.ds_maingroup = [];
        $scope.ds_group = [];
        $scope.ds_employee = [];
        $scope.loadingVisible = true;
        if ($scope.isDepManager) {
            trnService.getEmployee($rootScope.employeeId).then(function (response) {
                $scope.employee = response;
                $scope.mainGroup = $scope.employee.JobGroupMainCode;
                trnService.getExpiringByMainCode($scope.employee.JobGroupMainCode).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.ds_main = response;


                }, function (err) { General.ShowNotify(err.message, 'error'); });
            }, function (err) { General.ShowNotify(err.message, 'error'); });

        }
        else
        trnService.getExpiring().then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_main = response;

            

        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };

    $scope.bindMainGroups = function (type) {
        $scope.ds_maingroup = [];
        $scope.ds_group = [];
        $scope.ds_employee = [];
        $scope.loadingVisible = true;

        trnService.getExpiringMain(type).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.ds_maingroup = response;



        }, function (err) { General.ShowNotify(err.message, 'error'); });
    }

    $scope.bindGroups = function (type,group) {
        
        $scope.ds_group = [];
        $scope.ds_employee = [];
        $scope.loadingVisible = true;

        trnService.getExpiringGroup(type,group).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.UnknownCount = _d.EmployeesCount - _d.ValidCount - _d.ExpiredCount - _d.ExpiringCount;
            });
            $scope.ds_group = response;



        }, function (err) { General.ShowNotify(err.message, 'error'); });
    }

    
    $scope.bindCourseTypeEmployee = function (type, group) {

        $scope.ds_employee = [];
        $scope.loadingVisible = true;

        trnService.getCourseTypePeople(type, group).then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.ds_employee = response.Data;

            $scope.popup_emp_visible = true;


        }, function (err) { General.ShowNotify(err.message, 'error'); });
    }

    //////////////////////////////
    $scope.btn_search = {
        text: 'Refresh',
        type: 'success',
        icon: 'search',
        width: 150,

        bindingOptions: {},
        onClick: function (e) {

            // $scope.$broadcast('getFilterQuery', null);
            $scope.bind();
        }

    };
    $scope.btn_employees = {
        text: 'Employees',
        type: 'default',
        icon: 'user',
        width: 150,

        bindingOptions: {},
        onClick: function (e) {
            var selected = $rootScope.getSelectedRow($scope.dg_group_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.bindCourseTypeEmployee(selected.TypeId, selected.JobGroupId);
           
        }

    };
    //////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
         
        $rootScope.page_title = '> Certificates';
        $('.expiringcts').fadeIn();
    }
    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {

            $scope.bind();
            
        }, 1500);
    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);