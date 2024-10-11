'use strict';
app.controller('personcertificateController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', '$window', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window) {
    $scope.prms = $routeParams.prms;
    //2022-01-19
    $scope.isDepManager = $rootScope.HasDepartmentManager();
    $scope.employee = null;
    /////////////////////////////////// 
    var tabs = [
        { text: "Last Certificates", id: 'last' },
        { text: "All Certificates", id: 'all' },

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
        $scope.dg_course_visible = newValue == 0;
        $scope.dg_course_all_visible = newValue == 1;
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
    //2022-03-07
    $scope.IsMandatory = 2;
    $scope.sb_mandatory = {
        showClearButton: false,
        searchEnabled: false,
        dataSource: [{ Title: 'Mandatory', Id: 1 }, { Title: 'All', Id: 2 }],
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) { $scope.bindCourses(); },
        bindingOptions: {
            value: 'IsMandatory',
             
        }
    };
    $scope.bindCourses = function (pid) {
        $scope.dg_course_ds = [];
        if (!pid) {
            var selected = $rootScope.getSelectedRow($scope.dg_employees_instance);
            if (!selected)
                return;
            pid = selected.Id;
        }
        trnService.getPersonMandatoryCourses(pid).then(function (response) {
            var ds = response.Data;
            if ($scope.IsMandatory==1)
                ds = Enumerable.From(ds).Where('$.Mandatory==1').ToArray();
            $.each(ds, function (_i, _d) {
                if (!_d.Mandatory)
                    _d.Mandatory = 0;
            });
            $scope.dg_course_ds = ds;
            //console.log(response);


        }, function (err) { General.ShowNotify(err.message, 'error'); });
        //courseService.getPersonLastCertificates(pid).then(function (response) {
        //    $scope.dg_course_ds = response;


        //}, function (err) { General.ShowNotify(err.message, 'error'); });
        //courseService.getPersonAllCertificates(pid).then(function (response) {
        //    $scope.dg_course_all_ds = response;


        //}, function (err) { General.ShowNotify(err.message, 'error'); });
        //getPersonAllCertificates
    };

    $scope.ds_maingroups = [];
    $scope.bindMainGroups = function () {
        trnService.getMainGroups().then(function (response) {
            var ds = response ;
            console.log('main groups',ds);
           // var item = { Title: 'All Groups', FullCode2: '000' };
            //ds.unshift(item);
            $scope.ds_maingroups = ds;
            //04-30
            var item = { Title: 'All Groups', FullCode2: '000' };
            ds.push(item);
            //2022-01-19
            if ($scope.isDepManager) {
                trnService.getEmployee($rootScope.employeeId).then(function (response) {
                    $scope.employee = response;
                    $scope.mainGroup = $scope.employee.JobGroupMainCode;
                    $scope.bindEmployees();
                }, function (err) { General.ShowNotify(err.message, 'error'); });
    
            }


        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindEmployees = function () {
        $scope.loadingVisible = true;
        $scope.dg_employees_ds = [];
        trnService.getEmployees($scope.mainGroup).then(function (response) {
            $scope.loadingVisible = false;
            var ds = response;
           
            $scope.dg_employees_ds = ds;

        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    $scope.mainGroup = "";
    $scope.sb_groups = {
        showClearButton: false,
        searchEnabled: false,
        
        displayExpr: "Title",
        valueExpr: 'FullCode2',
        onSelectionChanged: function (arg) {   },
        bindingOptions: {
            value: 'mainGroup',
            dataSource: 'ds_maingroups',
            //2022-01-19
            readOnly:'isDepManager',

        }
    };
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.selectedCourse = null;
    $scope.courseStatus = {
        SMS: true,
        Email: true,
        AppNotification: true,
        StatusId: null,
        Status: null,
        CourseId: null,
        OldStatus: null,
        Remark: null,
        IssueDate: null,
        No: null,
        Name: null,
        People: []
    };
    ////////////////////////////////
    $scope.sb_StatusId = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $rootScope.getDatasourcePersonCourseStatus(),
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem)
                return;
            var passed = e.selectedItem.Id == 71;
            $scope.isCertidicateDisabled = !passed;
        },
        bindingOptions: {
            value: 'courseStatus.StatusId',
            text: 'courseStatus.Status',
        }
    };
    $scope.txt_OldStatus = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseStatus.OldStatus',
        }
    };
    $scope.chb_SMS = {

        text: 'Send SMS',
        bindingOptions: {
            value: 'courseStatus.SMS',

        }
    };
    $scope.chb_Email = {

        text: 'Send Email',
        bindingOptions: {
            value: 'courseStatus.Email',

        }
    };
    $scope.chb_AppNotification = {

        text: 'Send Notification',
        bindingOptions: {
            value: 'courseStatus.AppNotification',

        }
    };
    $scope.txt_StatusRemark = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'courseStatus.Remark',
        }
    };
    $scope.txt_CertificateNo = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'courseStatus.No',
            //disabled:'isCertidicateDisabled',
        }
    };
    $scope.txt_Name = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseStatus.Name',
            //disabled:'isCertidicateDisabled',
        }
    };
    $scope.date_DateIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'courseStatus.IssueDate',
            // disabled: 'isCertidicateDisabled',
        }
    };
    ////////////////////////////////
    $scope.btn_status = {
        text: 'Change Status',
        type: 'default',
        icon: 'event',
        width: 200,
        onClick: function (e) {

            $scope.selectedCourse = $rootScope.getSelectedRow($scope.dg_course_instance);
            if (!$scope.selectedCourse) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var selectedPerson = $rootScope.getSelectedRow($scope.dg_employees_instance);
            $scope.courseStatus.People = [];
            $scope.courseStatus.People.push(selectedPerson.PersonId);

            $scope.courseStatus.CourseId = $scope.selectedCourse.CourseId;

            $scope.courseStatus.OldStatus = $scope.selectedCourse.Status;

            if (!$scope.courseStatus.OldStatus)
                $scope.courseStatus.OldStatus = 'Pending';
            $scope.popup_status_visible = true;
        }

    };
    $scope.btn_passed = {
        text: 'Certification',
        type: 'default',
        icon: 'event',
        width: 200,
        onClick: function (e) {

            $scope.selectedCourse = $rootScope.getSelectedRow($scope.dg_course_instance);
            if (!$scope.selectedCourse) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var selectedPerson = $rootScope.getSelectedRow($scope.dg_employees_instance);
            $scope.courseStatus.People = [];
            $scope.courseStatus.People.push(selectedPerson.PersonId);// Enumerable.From($scope.selectedEmployees).Select("$.PersonId").ToArray();

            $scope.courseStatus.CourseId = $scope.selectedCourse.CourseId;

            $scope.courseStatus.Name = selectedPerson.Name;

            $scope.courseStatus.OldStatus = $scope.selectedCourse.Status;
            $scope.courseStatus.StatusId = 71;

            if (!$scope.courseStatus.OldStatus)
                $scope.courseStatus.OldStatus = 'Pending';



            $scope.popup_passed_visible = true;
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

           // $scope.$broadcast('getFilterQuery', null);
            $scope.bindEmployees();
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
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
            }
        }

    };
    $scope.btn_new = {
        text: 'New Certificate',
        type: 'default',
        icon: 'plus',
        width: 200,
        onClick: function (e) {

            var selected = $rootScope.getSelectedRow($scope.dg_employees_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.selected_person_id = selected.PersonId;
            $scope.popup_cer_visible = true;
           // var data = { Id: null, PersonId: selected.PersonId, Name: selected.Name, PID: selected.PID, NID: selected.NID, Mobile: selected.Mobile, Type: null, Title: null, Organization: null, Interval: null, CalanderTypeId: null, CourseId: null, No: null, DateIssue: null, CourseTypeId: null, Title: null };

           // $rootScope.$broadcast('InitAddCertificate', data);
        },
        bindingOptions: {
            visible: '!isDepManager'
        }

    };
    $scope.btn_delete = {
        text: 'Delete Certificate',
        type: 'danger',
        icon: 'clear',
        width: 230,

        onClick: function (e) {
            var selected = null;
            if ($scope.selectedTabIndex==0)
                  selected = $rootScope.getSelectedRow($scope.dg_course_instance);
            else
                  selected = $rootScope.getSelectedRow($scope.dg_course_all_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            var selectedp = $rootScope.getSelectedRow($scope.dg_employees_instance);
            if (!selectedp) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.selected_person_id = selectedp.PersonId;
            if ($scope.selected_person_id) {
                //var selected = $rootScope.getSelectedRow($scope.dg_courses_instance);
                //if (!selected) {
                //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                //    return;
                //}

                General.Confirm(Config.Text_DeleteConfirm, function (res) {
                    if (res) {

                        var dto = { pid: $scope.selected_person_id, cid: selected.CourseId };
                        $scope.loadingVisible = true;
                        trnService.deleteCoursePeople(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            if (response.IsSuccess) {
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                                //zool
                                //$scope.personCourses = Enumerable.From($scope.personCourses).Where('$.CourseId!=' + selected.CourseId).ToArray();
                                //$scope.bindPersoncourses();
                                $scope.bindCourses();
                            }
                            else
                                General.ShowNotify(response.Errors[0], 'error');




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                });
                ////////////////


            }
            //Config.Text_CanNotDelete
            //General.Confirm(Config.Text_DeleteConfirm, function (res) {
            //    if (res) {

            //        var dto = { Id: selected.Id, };
            //        $scope.loadingVisible = true;
            //        courseService.deleteCertificate(dto).then(function (response) {
            //            $scope.loadingVisible = false;
            //            General.ShowNotify(Config.Text_SavedOk, 'success');

            //            $scope.bindCourses();


            //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //    }
            //});
        },
        bindingOptions: {
            visible: '!isDepManager'
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
    $scope.certificateCaption = 'Last Certificates';
    //04-30
    $scope.exportCertificates = function () {
        $scope.dg_course_instance.exportToExcel(false);
    };
    $scope.dg_employees_columns = [
        {
            dataField: "MandatoryExpired", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                 
                if (options.value > 0) {
                    $("<div>")
                        .append("<img src='content/images/" + "alert" + ".png' />")
                        .appendTo(container);
                }
               
            },
            fixed: true, fixedPosition: 'left'
        },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left', },
        //{ dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left', },
        //{ dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left', },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 270, fixed: true, fixedPosition: 'left', },
        { dataField: 'JobGroupMain', caption: 'Main Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        //{ dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        //{ dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

      

    ];
    $scope.dg_employees_height = 100;
    $scope.dg_employees_selected = null;
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


        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_employees_selected = null;
                $scope.dg_course_ds = null;
                $scope.dg_course_all_ds = null;
                $scope.courseCaption = 'Courses';
            }
            else {
                $scope.dg_employees_selected = data;
                $scope.courseCaption = 'Courses > ' + data.Name;
                $scope.dg_course_ds = null;
                $scope.dg_course_all_ds = null;
                //$scope.bindCourses(data.PersonId);
                $scope.bindCourses(data.Id);
                 
            }


        },
        height: $(window).height() - 145-45,
        bindingOptions: {
            dataSource: 'dg_employees_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //$scope.dg_employees_height = $(window).height() - 200;
    ///////////////////////////////////
    $scope.dg_course_visible = true;
    $scope.dg_course_all_visible = false;
    $scope._dg_course_columns = [
        {
            dataField: "ExpireStatus", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                
                var fn = 'green';
                switch (options.value) {
                    case 1:
                        fn = 'red';
                        break;
                    case 2:
                        fn = 'orange';
                        break;

                    default:
                        break;
                }
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left' 
        },

        

        { dataField: 'CerNumber', caption: 'Certificate No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'ExpireDate', caption: 'Expire Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },


        { dataField: 'CourseNo', caption: 'Course No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'CourseTitle', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseOrganization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        //  { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        // { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'CourseDateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },

        { dataField: 'CourseRecurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },





    ];
    $scope.dg_course_columns = [
        { dataField: 'Mandatory', caption: 'Man.', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 70, fixed: true, fixedPosition: 'left'},
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'No', caption: 'ClassID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'Remains', caption: 'Rem.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        //04-30

        {
            dataField: "ImgUrl", caption: 'IMG',
            width: 55,
            name: 'ImgUrl',
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
            fixed: true, fixedPosition: 'left',

        },

        { dataField: 'CourseTitle', caption: 'Course Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250,    },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'Duration', caption: 'Duration(hrs)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
       
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },

    ];
    $scope.dg_course_selected = null;
    //04-30
    $scope.showImage = function (item) {
        var data = { url: item.url, caption: item.caption };

        $rootScope.$broadcast('InitImageViewer', data);
    };

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
        height: $(window).height() - 155 -35  ,

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
        //04-30
        onCellClick: function (e) {
            var clmn = e.column;
            var field = clmn.dataField;
            if (clmn.name == "ImgUrl" && e.data.ImgUrl)
                $scope.showImage({ url: $rootScope.clientsFilesUrl + e.data.ImgUrl, caption: '' });
              //  $window.open($rootScope.clientsFilesUrl + e.data.ImgUrl, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_course_ds',
            visible: 'dg_course_visible'
        }
    };
    ////////////////////////////////
    $scope.styleCell = function (e, value,status) {
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
    //////////////////////////////////
    $scope.dg_course_all_columns = [
     

        //{ dataField: 'IsLast', caption: 'L.', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 40, fixed: true, fixedPosition: 'left'  },
        //{ dataField: 'IsFirst', caption: 'F.', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 40, fixed: true, fixedPosition: 'left'  },
        {
            dataField: "IsLast", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var fn = "";
                if (options.data.IsFirst == 1)
                    fn = "letter-f";
                if (options.data.IsLast == 1)
                    fn = "letter-l";
                
                 if (fn)
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left'
        },

        { dataField: 'CerNumber', caption: 'Certificate No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'ExpireDate', caption: 'Expire Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left' },
        

        { dataField: 'CourseNo', caption: 'Course No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'CourseTitle', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseOrganization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        //  { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        // { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'CourseDateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },

        { dataField: 'CourseRecurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },





    ];
    $scope.dg_course_all_selected = null;


    $scope.dg_course_all_instance = null;
    $scope.dg_course_all_ds = null;
    $scope.dg_course_all = {
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
        height: $(window).height() - 175,

        columns: $scope.dg_course_all_columns,
        onContentReady: function (e) {
            if (!$scope.dg_course_all_instance)
                $scope.dg_course_all_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_course_all_selected = null;

            }
            else {
                $scope.dg_course_all_selected = data;

            }



        },
        bindingOptions: {
            dataSource: 'dg_course_all_ds',
            visible:'dg_course_all_visible'
        }
    };
    //////////////////////////////
    $scope.popup_status_visible = false;
    $scope.popup_status = {
        height: 340,
        width: 550,
        fullScreen: false,
        showTitle: true,
        title: 'Change Status',
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'statusChange', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.loadingVisible = true;
                        courseService.changeStatus($scope.courseStatus).then(function (response) {
                            //$scope.selectedEmployees

                            $scope.selectedCourse.StatusId = $scope.courseStatus.StatusId != 72 ? $scope.courseStatus.StatusId : null;
                            $scope.selectedCourse.Status = $scope.courseStatus.Status != 72 ? $scope.courseStatus.Status : null;
                            $scope.selectedCourse.CerNumber = null;
                            $scope.selectedCourse.DateIssue = null;



                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;
                            $scope.dg_course_instance.clearSelection();
                            $scope.popup_status_visible = false;
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_status_visible = false;
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


        },
        onHidden: function () {
            $scope.dg_employees_instance.refresh();
        },
        onHiding: function () {
            //clearSelection()
            $scope.courseStatus = {
                CourseId: null,
                SMS: true,
                Email: true,
                AppNotification: true,
                StatusId: null,
                Status: null,
                OldStatus: null,
                Remark: null,
                IssueDate: null,
                No: null,
                People: [],
            };

            $scope.popup_status_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_status_visible',


        }
    };


    $scope.popup_passed_visible = false;
    $scope.popup_passed = {
        height: 440,
        width: 550,
        fullScreen: false,
        showTitle: true,
        title: 'Certification',
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'passed', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.loadingVisible = true;
                        courseService.changeStatus($scope.courseStatus).then(function (response) {
                            //$scope.selectedEmployees
                            $scope.selectedCourse.StatusId = 71;
                            $scope.selectedCourse.Status = 'Passed';

                            $scope.selectedCourse.CerNumber = $scope.courseStatus.No;
                            $scope.selectedCourse.DateIssue = $scope.courseStatus.IssueDate;


                            $scope.dg_course_instance.clearSelection();
                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;
                            $scope.popup_passed_visible = false;
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_passed_visible = false;
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


        },
        onHiding: function () {
            //clearSelection()
            $scope.courseStatus = {
                CourseId: null,
                SMS: true,
                Email: true,
                AppNotification: true,
                StatusId: null,
                Status: null,
                OldStatus: null,
                Remark: null,
                IssueDate: null,
                No: null,
                People: [],
            };

            $scope.popup_passed_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_passed_visible',


        }
    };
    ////////////////////////////
    $scope.doRefresh = false;
    $scope.filters = [];
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
    $scope.bind = function () {
        if (!$scope.dg_employees_ds && $scope.doRefresh) {

            $scope.dg_employees_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/employees/' + Config.CustomerId,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
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
                sort: [{ getter: "CriticalCertificatesCount", desc: true } , 'Name'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_employees_ds.filter = $scope.filters;
            $scope.dg_employees_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    //////////////////////////////
    $scope.popup_cer_visible = false;
    $scope.popup_cer = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cer"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: $(window).width() - 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', validationGroup: 'pceradd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {};

                        //dluo


                        dto.Id = -1;
                        dto.PersonId = $scope.selected_person_id;
                        dto.CustomerId = Config.CustomerId;
                        dto.IsGeneral = 1;
                        dto.CourseTypeId = $scope.course_Type;
                        dto.CertificateNo = $scope.course_CertificateNo;
                        dto.Title = $scope.course_Title;
                        dto.DateStart = moment($scope.course_DateStart).format('YYYY-MM-DD');
                        dto.DateEnd = moment($scope.course_DateEnd).format('YYYY-MM-DD');
                        dto.DateIssue = moment($scope.course_DateIssue).format('YYYY-MM-DD');
                        dto.DateExpire = moment($scope.course_DateExpire).format('YYYY-MM-DD');
                        dto.OrganizationId = $scope.course_OrganizationId;
                        dto.Location = $scope.course_Location;
                        dto.Instructor = $scope.course_Instructor;
                        dto.TrainingDirector = $scope.course_TrainingDirector;
                        dto.Duration = $scope.course_Duration;
                        dto.DurationUnitId = 27;
                        dto.Interval = $scope.course_Interval;
                        dto.CalanderTypeId = $scope.course_CalanderTypeId;
                        // dto.Recurrent = $scope.entity.Recurrent;
                        // dto.Remark = $scope.entity.Remark;
                        dto.IsNotificationEnabled = 0;
                        //dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
                       

                        $scope.loadingVisible = true;
                        trnService.saveCertificate(dto).then(function (response) {


                            $scope.clear_course();

                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            //var exists = Enumerable.From($scope.personCourses).Where('$.Id==' + response.Data.Id).FirstOrDefault();
                            //if (exists) {
                            //    $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.Id!=' + response.Data.Id).ToArray();
                            //}
                            //$scope.personCourses.push(response.Data);



                            $scope.loadingVisible = false;
                            //$scope.bindPersoncourses();

                            // $scope.popup_cer_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        //////////////////

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_cer_visible = false;

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
            var selected = $rootScope.getSelectedRow($scope.dg_course_instance);
            if (selected)
                $scope.course_Type = selected.CourseTypeId;
            if ($scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance.refresh();


        },
        onHiding: function () {
            $scope.clear_course();
            $scope.dg_arccourse_instance.clearSelection();
            $scope.dg_arccourse_ds = null;
            $scope.bindCourses();
            $scope.popup_cer_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cer_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };
    $scope.clear_course = function () {
        $scope.course_Type = null;
        $scope.course_CertificateNo = null;
        $scope.course_Title = null;
        $scope.course_DateStart = null;
        $scope.course_DateEnd = null;
        $scope.course_DateIssue = null;
        $scope.course_DateExpire = null;
        $scope.course_OrganizationId = null;
        $scope.course_Location = null;
        $scope.course_Instructor = null;
        $scope.course_TrainingDirector = null;
        $scope.course_Duration = null;

        $scope.course_Interval = null;
        $scope.course_CalanderTypeId = null;
    };
    $scope.course_Type = null;
    $scope.course_TypeItem = null;
    $scope.course_set_expire = function () {
        if ($scope.course_Interval && $scope.course_CalanderTypeId && $scope.course_DateIssue) {
            if ($scope.course_CalanderTypeId == 12) {
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addYears($scope.course_Interval);

            }
            if ($scope.course_CalanderTypeId == 13)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addMonths($scope.course_Interval);
            if ($scope.course_CalanderTypeId == 14)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addDays($scope.course_Interval);
        }
    };
    $scope.sb_course_type = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        placeholder: 'Select Course Type',
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {
            $scope.course_TypeItem = e.selectedItem;
            if (!e.selectedItem)
                return;
            //if (!$scope.course_Interval)
            $scope.course_Interval = e.selectedItem.Interval;
            //if (!$scope.course_Duration)
            $scope.course_Duration = e.selectedItem.Duration;
            //if (!$scope.course_CalanderTypeId)
            $scope.course_CalanderTypeId = e.selectedItem.CalenderTypeId;
            //if ($scope.isNew) {
            //    if (e.selectedItem && e.selectedItem.Interval)
            //        $scope.entity.Interval = e.selectedItem.Interval;
            //    if (e.selectedItem && e.selectedItem.CalenderTypeId)
            //        $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
            //    if (e.selectedItem && e.selectedItem.Duration)
            //        $scope.entity.Duration = e.selectedItem.Duration;
            //}
            //$scope.selectedType = e.selectedItem;
            //$scope.certype = null;
            //$scope.ctgroups = null;
            //if (e.selectedItem) {
            //    $scope.certype = e.selectedItem.CertificateType;

            //    $scope.ctgroups = e.selectedItem.JobGroups;
            //}
            $scope.course_set_expire();

            $scope.dg_arccourse_instance.clearSelection();

            $scope.loadingVisible = true;
            trnService.getCoursesByType(e.selectedItem.Id, 3).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_arccourses_ds = response.Data;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        bindingOptions: {
            value: 'course_Type',

        }

    };
    $scope.date_course_resultissue = {
        width: '100%',
        type: 'date',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateIssue',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Title',
        }
    };
    $scope.txt_course_Instructor = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Instructor',
        }
    };
    $scope.txt_course_TrainingDirector = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_TrainingDirector',
        }
    };


    $scope.date_course_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateStart',

        }
    };
    $scope.date_course_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (e.value) {
                $scope.course_DateIssue = (new Date(e.value)).addDays(1);
            }

        },
        bindingOptions: {
            value: 'course_DateEnd',

        }
    };

    $scope.txt_course_Location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Location',
        }
    };

    $scope.txt_course_Duration = {
        min: 1,

        bindingOptions: {
            value: 'course_Duration',
        }
    };
    $scope.txt_course_Interval = {
        min: 1,
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_Interval',
        }
    };
    $scope.sb_course_DurationUnitId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(26),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'course_DurationUnitId',

        }
    };
    $scope.sb_course_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_CalanderTypeId',

        }
    };
    $scope.sb_course_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'course_OrganizationId',

        }

    };

    $scope.date_course_resultexpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateExpire',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_resultno = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'course_CertificateNo',
            //disabled:'isCertidicateDisabled',
        }
    };
    $scope.dg_arccourse_columns = [
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },



    ];
    $scope.dg_arccourse_selected = null;
    $scope.dg_arccourse_instance = null;
    $scope.dg_arccourses_ds = null;
    $scope.dg_arccourse_height = 540;
    $scope.dg_arccourse = {
        sorting: {
            mode: "single"
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
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_arccourse_columns,
        onContentReady: function (e) {
            if (!$scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_arccourse_selected = null;

            }
            else {
                console.log('dg_course', data);
                $scope.dg_arccourse_selected = data;
                $scope.course_Title = data.Title;
                $scope.course_OrganizationId = Number(data.OrganizationId);
                $scope.course_Location = data.Location;
                $scope.course_Instructor = data.Instructor;
                $scope.course_TrainingDirector = data.TrainingDirector;
                $scope.course_Duration = data.Duration;
                $scope.course_Interval = data.Interval;
                $scope.course_CalanderTypeId = data.CalanderTypeId;
                $scope.course_DateStart = new Date(data.DateStart);
                $scope.course_DateEnd = new Date(data.DateEnd);

            }
        },

        onRowPrepared: function (e) {

        },
        bindingOptions: {
            dataSource: 'dg_arccourses_ds',
            height: 'dg_arccourse_height',
        }
    };
    //////////////////////////////
   

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $scope.bindMainGroups();
        $rootScope.page_title = '> Certificates';
        $('.personcertificate').fadeIn();
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

    $scope.doRefreshCertificates = false;
    $scope.$on('onCertificateSaved', function (event, prms) {
        $scope.doRefreshCertificates = true;

    });
    $scope.$on('onCertificateHide', function (event, prms) {
        if ($scope.doRefreshCertificates) {
            $scope.doRefreshCertificates = false;
            $scope.bindCourses();
        }

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);