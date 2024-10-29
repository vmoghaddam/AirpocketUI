'use strict';
app.controller('personcertificateController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', function ($scope, $location, $routeParams, $rootScope, courseService, authService) {
    $scope.prms = $routeParams.prms;
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
    $scope.bindCourses = function (pid) {
        if (!pid) {
            var selected = $rootScope.getSelectedRow($scope.dg_employees_instance);
            if (!selected)
                return;
            pid = selected.PersonId;
        }
        courseService.getPersonLastCertificates(pid).then(function (response) {
            $scope.dg_course_ds = response;


        }, function (err) { General.ShowNotify(err.message, 'error'); });
        courseService.getPersonAllCertificates(pid).then(function (response) {
            $scope.dg_course_all_ds = response;


        }, function (err) { General.ShowNotify(err.message, 'error'); });
        //getPersonAllCertificates
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

            $scope.$broadcast('getFilterQuery', null);
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

            var data = { Id: null, PersonId: selected.PersonId, Name: selected.Name, PID: selected.PID, NID: selected.NID, Mobile: selected.Mobile, Type: null, Title: null, Organization: null, Interval: null, CalanderTypeId: null, CourseId: null, No: null, DateIssue: null, CourseTypeId: null, Title: null };

            $rootScope.$broadcast('InitAddCertificate', data);
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
            if (selected.IsNotificationEnabled == 1) {
                General.ShowNotify(Config.Text_CanNotDelete, 'error');
                return;
            }
            //Config.Text_CanNotDelete
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: selected.Id, };
                    $scope.loadingVisible = true;
                    courseService.deleteCertificate(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');

                        $scope.bindCourses();


                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
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
    $scope.dg_employees_columns = [
        {
            dataField: "CriticalCertificatesCount", caption: '',
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
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left', },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

        { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

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
                $scope.bindCourses(data.PersonId);
                 
            }


        },
        height: $(window).height() - 175,
        bindingOptions: {
            dataSource: 'dg_employees_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //$scope.dg_employees_height = $(window).height() - 200;
    ///////////////////////////////////
    $scope.dg_course_visible = true;
    $scope.dg_course_all_visible = false;
    $scope.dg_course_columns = [
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
        height: $(window).height() - 175,

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
        bindingOptions: {
            dataSource: 'dg_course_ds',
            visible: 'dg_course_visible'
        }
    };
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
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
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