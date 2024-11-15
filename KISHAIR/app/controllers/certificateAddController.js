'use strict';
app.controller('certificateAddController', ['$scope', '$location', 'courseService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, courseService, authService, $routeParams, $rootScope) {



    $scope.isNew = true;
    $scope.entity = {
        Id:null,
        DateIssue: null,
        No: null,
        DateExpire: null,
        PersonId: null,
        CourseId: null,
        CourseTypeId: null,
        CourseTitle:null
    };
    $scope.employee = {
        Name: null,
        PID: null,
        NID: null,
        Mobile: null,
    };
    $scope.course = {
        Title: null,
        Type: null,
        Organization: null,
        CalanderTypeId: null,
        Interval: null,
    };
    $scope.clearEntity = function (all) {
        if (all) {
            $scope.employee.Name = null;
            $scope.employee.PID = null;
            $scope.employee.NID = null;
            $scope.employee.Mobile = null;
            $scope.entity.PersonId = null;
        }
        

        $scope.course.Title = null;
        $scope.course.Type = null;
        $scope.course.Organization = null;
        $scope.course.CalanderTypeId = null;
        $scope.course.Interval = null;
        $scope.entity.DateIssue = null;
        $scope.entity.No = null;
        $scope.entity.DateExpire = null;
        $scope.entity.CourseId = null;
        
        $scope.entity.CourseTypeId = null;
        $scope.entity.CourseTitle = null;
        if ($scope.dg_instance)
            $scope.dg_instance.clearSelection();
    };

    $scope.bindEmployee = function (data) {
        $scope.employee.Name = data.Name;
        $scope.employee.PID = data.PID;
        $scope.employee.NID = data.NID;
        $scope.employee.Mobile = data.Mobile;
    };
    $scope.bindCourse = function (data) {
        $scope.course.Title = data.Title;
        $scope.course.Type = data.Type;
        $scope.course.Organization = data.Organization;
        $scope.course.CalanderTypeId = data.CalanderTypeId;
        $scope.course.Interval = data.Interval;
    };
    $scope.bindEntity = function (data) {
        $scope.entity.DateIssue = data.DateIssue;
        $scope.entity.No = data.No;
        //$scope.entity.DateExpire = null;
        $scope.entity.CourseId = data.CourseId;
        $scope.entity.PersonId = data.PersonId;
        $scope.entity.CourseTypeId = data.CourseTypeId;
        $scope.entity.CourseTitle = data.Title;
    };
    $scope.bindCourses = function () {
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/courses/archived/' + Config.CustomerId,
                    key: "Id",
                    version: 4,

                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }
        else {
            // $scope.filters = $scope.getFilters();
            // $scope.dg_ds.filter = $scope.filters;
            if (!$scope.dg_instance)
                return;
            var filters = [['Id', '>', 0], 'and'];

            if ($scope.courseTypeId) {
                filters.push(['CourseTypeId', '=', $scope.courseTypeId]);
                filters.push('and');
            }
            if ($scope.organizationId) {
                filters.push(['OrganizationId', '=', $scope.organizationId]);
                filters.push('and');
            }
            if ($scope.courseTitle) {
                filters.push(['Title', 'contains', $scope.courseTitle]);
                filters.push('and');
            }
            filters = filters.slice(0, -1);
            console.log(filters);
            $scope.dg_ds.filter = filters;
            $scope.dg_instance.refresh();
        }


    };
    //////////////////////////
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

    /////////////////////////////
    $scope.scroll_height = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.pop_width = 600;
    $scope.pop_height = 350;
    $scope.dg_height = 100;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add Course', width: 150, icon: 'plus',   onClick: function (e) {

                        var data = { Id: null };

                        $rootScope.$broadcast('InitAddCourse', data);
                    }
                }, toolbar: 'bottom' 
            },
            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'certificateadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove' }, toolbar: 'bottom' }


        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();

            $scope.pop_width = size.width;
            if ($scope.pop_width > 1200)
                $scope.pop_width = 1200;

            $scope.pop_height = $(window).height() - 30; //630; //size.height;
            $scope.dg_height = $scope.pop_height - 200 - 100;
            $scope.scroll_height = $scope.pop_height - 90;

            $('._course').height($scope.pop_height - 115 - 100);
            //$('._certificate2').height($scope.pop_height - 115 - 100-98);

        },
        onShown: function (e) {
            $scope.dg_instance.clearSelection();
            $scope.bindCourses();
            if ($scope.tempData != null) {
                //$scope.loadingVisible = true;
                //courseService.getCourse($scope.tempData.Id).then(function (response) {
                //    $scope.loadingVisible = false;
                //    $scope.bind(response);

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }


        },
        onHiding: function () {

            $scope.clearEntity(true);

            $scope.popup_add_visible = false;

        },
        onHidden: function () {

            $rootScope.$broadcast('onCertificateHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',

        }
    };

    //close button
    $scope.popup_add.toolbarItems[2].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {
      
         
        //
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        //var d = new Date($scope.entity.DateIssue);

       // var x = d.yyyymmdd();
        //alert(d);
        //alert(x);
        $scope.entity.DateIssue = new Date($scope.entity.DateIssue).ToUTC();
        //$scope.entity.DateIssue = new Date($scope.entity.DateIssue).yyyymmdd();
       
        

        if ($scope.isNew) {
            $scope.entity.Id = -1;
            
        }

        $scope.entity.DateExpire = null;

       
         
        $scope.loadingVisible = true;
        courseService.saveCertificate($scope.entity).then(function (response) {

           


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onCertificateSaved', response);



            $scope.loadingVisible = false;
            $scope.clearEntity(false);
            if (!$scope.isNew)
                $scope.popup_add_visible = false;




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };
    /////////////////////////
    $scope.dg_columns = [
     //   { dataField: 'Id', caption: 'Id', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'AircraftType', caption: 'Aircraft Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120 },

        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {

        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        height: '100%',

        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
                $scope.course.Title = null;
                $scope.course.Type = null;
                $scope.course.Organization = null;
                $scope.course.Interval = null;
                $scope.course.CalanderTypeId = null;
                $scope.entity.DateExpire = null;
                $scope.entity.CourseId = null;
                $scope.entity.CourseTypeId = null;
                $scope.entity.CourseTitle = null;

            }
            else {
                $scope.dg_selected = data;

                $scope.course.Title = $scope.dg_selected.Title;
                $scope.course.Type = $scope.dg_selected.CT_Title;
                $scope.course.Organization = $scope.dg_selected.Organization;
                $scope.course.Interval = $scope.dg_selected.Interval;
                $scope.course.CalanderTypeId = $scope.dg_selected.CalanderTypeId;
                $scope.entity.DateExpire = $rootScope.getNextDate($scope.dg_selected.Interval, $scope.dg_selected.CalanderTypeId, $scope.entity.DateIssue);
                $scope.entity.CourseId = $scope.dg_selected.Id;
                $scope.entity.CourseTypeId = $scope.dg_selected.CourseTypeId;
                $scope.entity.CourseTitle = $scope.dg_selected.Title;
            }

        },
        bindingOptions: {
            dataSource: 'dg_ds',
            height: 'dg_height',
            //selectedRowKeys:'dg_selected_keys',
        }
    };

    ////////////////////////
    $scope.txt_Name = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'employee.Name'
        }
    };
    $scope.txt_PID = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'employee.PID'
        }
    };
    $scope.txt_NID = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'employee.NID'
        }
    };
    $scope.txt_Mobile = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'employee.Mobile'
        }
    };
    $scope.courseTypeId = null;
    $scope.$watch("courseTypeId", function (newValue) {

        // $scope.bindCourses();

    });
    $scope.sb_CourseTypeId = {
        dataSource: $rootScope.getDatasourceCourseType(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) { $scope.bindCourses(); },
        bindingOptions: {
            value: 'courseTypeId',

        }

    };
    $scope.organizationId = null;
    $scope.$watch("organizationId", function (newValue) {



    });
    $scope.sb_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) { $scope.bindCourses(); },
        bindingOptions: {
            value: 'organizationId',

        }

    };
    $scope.courseTitle = null;
    $scope.$watch("courseTitle", function (newValue) {



    });
    $scope.txt_courseTitle = {
        hoverStateEnabled: false,
        onValueChanged: function (e) {
            $scope.bindCourses();
        },
        bindingOptions: {
            value: 'courseTitle'
        }
    };
    $scope.txt_selectedCourseTitle = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'course.Title'
        }
    };
    $scope.txt_selectedCourseType = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'course.Type'
        }
    };
    $scope.txt_selectedCourseOrganization = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'course.Organization'
        }
    };
    $scope.txt_selectedInterval = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'course.Interval'
        }
    };

    $scope.sb_selectedCalType = {
        readOnly: true,
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'course.CalanderTypeId',

        }
    };
    $scope.date_DateIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
          $scope.entity.DateExpire = $rootScope.getNextDate($scope.course.Interval, $scope.course.CalanderTypeId, e.value);
            
        },
        bindingOptions: {
            value: 'entity.DateIssue',

        }
    };
    $scope.txt_CerNumber = {
        hoverStateEnabled: false,
         
        bindingOptions: {
            value: 'entity.No'
        }
    };
    $scope.date_DateExpire = {
        width: '100%',
        type: 'date',
        readOnly: true,
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateExpire',

        }
    };
    /////////////////////////
    $scope.tempData = null;
    $scope.$on('InitAddCertificate', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'New';
            $scope.bindEmployee(prms);
            $scope.bindCourse(prms);
            $scope.bindEntity(prms);

        }

        else {

            $scope.popup_add_title = 'Edit';
            // $scope.loadingVisible = true;


            $scope.tempData = prms;

            $scope.isNew = false;
            $scope.bindEmployee(prms);
            $scope.bindCourse(prms);
            $scope.bindEntity(prms);

        }

        $scope.popup_add_visible = true;

    });
    $scope.$on('onCourseHide', function (event, prms) {

        $scope.bindCourses();

    });
    //////////////////////////////

}]);

