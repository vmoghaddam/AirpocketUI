'use strict';
app.controller('coursepersonController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', function ($scope, $location, $routeParams, $rootScope, courseService, authService) {
    $scope.prms = $routeParams.prms;
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    courseService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddCourse', data);
        }

    };
    $scope.btn_employees = {
        text: 'Employees',
        type: 'default',
        icon: 'group',
        width: 200,
        onClick: function (e) {

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.courseEmployee.Id = $scope.dg_selected.Id;
            $scope.popup_employees_visible = true;
        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddCourse', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;


            $rootScope.$broadcast('InitAddCourse', data);
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
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

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
    $scope.dg_columns = [
        {
            dataField: "StatusId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = 'pending-24';
                switch (options.value) {
                    case 1:
                        fn = 'registered-24';
                        break;
                    case -1:
                        fn = 'canceled-24';
                        break;
                    case 2:
                        fn = 'Attended-24';
                        break;
                     
                    case 3:
                        fn = 'passed-24';
                        break;
                    default:
                        break;
                }
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
         { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "desc" },
        { dataField: 'No', caption: 'No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'AircraftType', caption: 'Aircraft Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120 },

        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

    ];
    $scope.dg_selected = null;
    $scope.summary = {
        Pending: '-',
        Canceled: '-',
        Total: '-',
      
        Registered: '-',
        Attended: '-',
      
        Failed: '-',
        Passed: '-'
    };
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
                $scope.summary = {
                    Pending: '-',
                    Canceled: '-',
                    Total: '-',

                    Registered: '-',
                    Attended: '-',

                    Failed: '-',
                    Passed: '-'
                };
            }
            else {
                $scope.dg_selected = data;
                $scope.summary = {
                    Pending: data.Pending,
                    Canceled: data.Canceled,
                    Total: data.Total,

                    Registered: data.Registered,
                    Attended: data.Attended,

                    Failed: data.Failed,
                    Passed: data.Passed
                };
            }



        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    ////////////////////////////
    $scope.selectedEmployees = null;
    $scope.pop_width_employees = 600;
    $scope.pop_height_employees = 450;
    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;
    $scope.popup_employees_visible = false;
    $scope.popup_employees_title = 'Employees';
    $scope.popup_employees = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', width: 200, text: 'change Status', icon: 'event', onClick: function (e) {
                        $scope.selectedEmployees = $rootScope.getSelectedRows($scope.dg_employees_instance);
                        if (!$scope.selectedEmployees) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        //bani
                        var dis = Enumerable.From($scope.selectedEmployees).Select('$.StatusId').Distinct().ToArray();

                        if (dis.length > 1) {
                            General.ShowNotify('The selected statuses are different.', 'error');
                            return;

                        }
                        $scope.courseStatus.People = Enumerable.From($scope.selectedEmployees).Select("$.PersonId").ToArray();
                        
                        $scope.courseStatus.CourseId = $scope.courseEmployee.Id;
                         
                        $scope.courseStatus.OldStatus = $scope.selectedEmployees[0].Status;

                        if (!$scope.courseStatus.OldStatus)
                            $scope.courseStatus.OldStatus = 'Pending';



                        $scope.popup_status_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', width: 200, text: 'Certification', icon: 'check', onClick: function (e) {
                        $scope.selectedEmployees = $rootScope.getSelectedRows($scope.dg_employees_instance);
                        if (!$scope.selectedEmployees) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.courseStatus.People = [];
                        $scope.courseStatus.People.push( $scope.selectedEmployees[0].PersonId);// Enumerable.From($scope.selectedEmployees).Select("$.PersonId").ToArray();

                        $scope.courseStatus.CourseId = $scope.courseEmployee.Id;
                        $scope.courseStatus.Name = $scope.selectedEmployees[0].Name;
                        $scope.courseStatus.OldStatus = $scope.selectedEmployees[0].Status;
                        $scope.courseStatus.StatusId = 71;

                        if (!$scope.courseStatus.OldStatus)
                            $scope.courseStatus.OldStatus = 'Pending';



                        $scope.popup_passed_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_employees_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();

            $scope.pop_width_employees = size.width - 20;
            //if ($scope.pop_width > 1200)
            //     $scope.pop_width = 1200;

            $scope.pop_height_employees = $(window).height() - 30; //630; //size.height;
            $scope.dg_height_full = $scope.pop_height_employees - 133;
            $scope.dg_employees_height = $scope.dg_height_full - 81;
            $scope.scroll_height_full = $scope.pop_height_employees - 133;






        },
        onShown: function (e) {

            $scope.bindEmployees();
        },
        onHiding: function () {

            $('.cn').removeClass('w3-2017-flame');
            $scope.courseEmployee = {
                Id: -1,
                Total: '-',
                Pending: '-',
                Registered: '-',
                Attended: '-',

                Canceled: '-',
                Failed: '-',
                Passed: '-',
                ApplicablePeople: [],
            };
            $scope.popup_employees_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_employees_visible',
            width: 'pop_width_employees',
            height: 'pop_height_employees',
            title: 'popup_employees_title',

        }
    };

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
                            $.each($scope.selectedEmployees, function (_i, _d) {
                                _d.StatusId = $scope.courseStatus.StatusId != 72 ? $scope.courseStatus.StatusId:null;
                                _d.Status = $scope.courseStatus.Status != 72 ? $scope.courseStatus.Status:null;
                                _d.CerNumber = null;
                                _d.DateIssue = null;
                            });
                            $scope.courseEmployee.Failed = response.Failed;
                            $scope.courseEmployee.Pending = response.Pending;
                            $scope.courseEmployee.Total = response.Total;
                            $scope.courseEmployee.Registered = response.Registered;
                            $scope.courseEmployee.Canceled = response.Canceled;
                            $scope.courseEmployee.Passed = response.Passed;
                            $scope.courseEmployee.Attended = response.Attended;
                           
                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;
                            $scope.dg_employees_instance.clearSelection();
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
                CourseId:null,
                SMS: true,
                Email: true,
                AppNotification: true,
                StatusId: null,
                Status : null,
                OldStatus: null,
                Remark: null,
                IssueDate: null,
                No:null,
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
                            $scope.selectedEmployees[0].StatusId = 71;
                            $scope.selectedEmployees[0].Status = 'Passed';
                            
                            $scope.selectedEmployees[0].CerNumber = $scope.courseStatus.No;
                            $scope.selectedEmployees[0].DateIssue = $scope.courseStatus.IssueDate;
                             
                            $scope.courseEmployee.Failed = response.Failed;
                            $scope.courseEmployee.Pending = response.Pending;
                            $scope.courseEmployee.Total = response.Total;
                            $scope.courseEmployee.Registered = response.Registered;
                            $scope.courseEmployee.Canceled = response.Canceled;
                            $scope.courseEmployee.Passed = response.Passed;
                            $scope.courseEmployee.Attended = response.Attended;
                            $scope.dg_employees_instance.refresh();
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
    ///////////////////////
    $scope.scroll_employees = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height_full', }
    };
    /////////////////////////
    $scope.txt_Title = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.Title',
        }
    };
    $scope.txt_Type = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.CT_Title',
        }
    };
    $scope.txt_No = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.No',
        }
    };
    $scope.txt_Organization = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.Organization',
        }
    };
    $scope.txt_Location = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.Location',
        }
    };
    $scope.txt_Instructor = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.Instructor',
        }
    };
    $scope.txt_TrainingDirector = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.TrainingDirector',
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.Remark',
        }
    };
    $scope.txt_Remaining = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseEmployee.RemainRegistration',
        }
    };
    $scope.date_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'courseEmployee.DateStart',
        }
    };
    $scope.date_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'courseEmployee.DateEnd',
        }
    };
    $scope.date_DateDeadlineRegistration = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'courseEmployee.DateDeadlineRegistration',
        }
    };
    ///////////////////////
    $scope.dg_employees_columns = [
        {
            dataField: "StatusId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = 'pending-24';
                switch (options.value) {
                    case 67:
                        fn = 'registered-24';
                        break;
                    case 69:
                        fn = 'canceled-24';
                        break;
                    case 68:
                        fn = 'Attended-24';
                        break;
                    case 70:
                        fn = 'failed-24';
                        break;
                    case 71:
                        fn = 'passed-24';
                        break;
                    default:
                        break;
                }
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        }
        , { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "desc" },
         
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'CerNumber', caption: 'Certificate No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateIssue', caption: 'Issue Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

       



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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: '100%',

        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employees_selected = null;
            }
            else
                $scope.dg_employees_selected = data;


        },
        bindingOptions: {
            dataSource: 'courseEmployee.ApplicablePeople', //'dg_employees_ds',
            height: 'dg_employees_height' 
        }
    };
    ///////////////////////
    $scope.courseStatus = {
        SMS: true,
        Email: true,
        AppNotification: true,
        StatusId: null,
        Status : null,
        CourseId:null,
        OldStatus: null,
        Remark: null,
        IssueDate: null,
        No: null,
        Name:null,
        People: [],
    };
    $scope.isCertidicateDisabled = true;
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
            text:'courseStatus.Status',
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
        readOnly:true,
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
    ////////////////////////

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
        if (!$scope.dg_ds && $scope.doRefresh) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/courses/active/' + Config.CustomerId,
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
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    $scope.courseEmployee = {
        Id: -1,
        Total: '-',
        Pending: '-',
        Registered: '-',
        Attended: '-',

        Canceled: '-',
        Failed: '-',
        Passed: '-',
        ApplicablePeople: [] 
    };

    $scope.bindEmployees = function () {
        $scope.loadingVisible = true;
        courseService.getActiveCourse($scope.courseEmployee.Id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.courseEmployee = (response);
            //$scope.dg_employees_ds = courseEmployee.ApplicablePeople;

            // $scope.dg_employees_instance.refresh();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };



    $scope.filterStatus = function ($event, statusId) {
        //$event.currentTarget

        var self = $($event.currentTarget).hasClass('w3-2017-flame');

        $('.cn').removeClass('w3-2017-flame');
        if (!self)
            $($event.currentTarget).addClass('w3-2017-flame');
        else
            statusId = null;
        if (statusId) {
            if (statusId != -1)
                $scope.dg_employees_instance.filter('StatusId', '=', Number(statusId));
            else
                $scope.dg_employees_instance.filter('StatusId', '=', null);

        }
        else
            $scope.dg_employees_instance.clearFilter();
    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Courses';
        $('.courseperson').fadeIn();
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
    $scope.$on('onCourseSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onCourseHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $('.sum-wrapper').height($(window).height() - 200);
    
    $rootScope.$broadcast('PersonLoaded', null);
    ///end


}]);