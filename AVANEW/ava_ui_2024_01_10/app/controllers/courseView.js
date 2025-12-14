'use strict';
app.controller('courseViewController', ['$scope', '$location', 'courseService', 'authService', '$routeParams', '$rootScope', 'trnService', function ($scope, $location, courseService, authService, $routeParams, $rootScope, trnService) {

    $scope.IsEditable = true;

    $scope.isNew = true;


    $scope.entity = {
        Id: null,
        CourseTypeId: null,
        DateStart: null,
        DateStartP: null,
        DateEnd: null,
        DateEndP: null,
        Instructor: null,
        Location: null,
        Department: null,
        OrganizationId: null,
        Duration: null,
        DurationUnitId: null,
        StatusId: null,
        Remark: null,
        Capacity: null,
        Tuition: null,
        CurrencyId: null,
        DateDeadlineRegistration: null,
        DateDeadlineRegistrationP: null,
        TrainingDirector: null,
        Title: null,
        AircraftTypeId: null,
        AircraftModelId: null,
        CaoTypeId: null,
        Recurrent: null,
        Interval: null,
        CalanderTypeId: 12,
        StatusId: null,
        IsInside: null,
        Quarantine: null,
        DateStartPractical: null,
        DateEndPractical: null,
        DateStartPracticalP: null,
        DateEndPracticalP: null,
        DurationPractical: null,
        DurationPracticalUnitId: null,
        IsGeneral: null,
        CustomerId: null,
        No: null,
        IsNotificationEnabled: null,



        CourseRelatedAircraftTypes: [],
        CourseRelatedCourseTypes: [],
        CourseRelatedStudyFields: [],
        CourseRelatedEmployees: [],
        CourseRelatedCourses: [],
        CourseRelatedGroups: [],
        CourseCatRates: [],
        CourseAircraftTypes: [],


        Sessions: [],
    };


    $scope.clearEntity = function () {

        $scope.entity.Id = null;
        $scope.entity.CourseTypeId = null;
        $scope.entity.DateStart = null;
        $scope.entity.DateStartP = null;
        $scope.entity.DateEnd = null;
        $scope.entity.DateEndP = null;
        $scope.entity.Instructor = null;
        $scope.entity.Location = null;
        $scope.entity.Department = null;
        $scope.entity.OrganizationId = null;
        $scope.entity.Duration = null;
        $scope.entity.DurationUnitId = null;
        $scope.entity.StatusId = null;
        $scope.entity.Remark = null;
        $scope.entity.Capacity = null;
        $scope.entity.Tuition = null;
        $scope.entity.CurrencyId = null;
        $scope.entity.DateDeadlineRegistration = null;
        $scope.entity.DateDeadlineRegistrationP = null;
        $scope.entity.TrainingDirector = null;
        $scope.entity.Title = null;
        $scope.entity.AircraftTypeId = null;
        $scope.entity.AircraftModelId = null;
        $scope.entity.CaoTypeId = null;
        $scope.entity.Recurrent = null;
        $scope.entity.Interval = null;
        $scope.entity.CalanderTypeId = 12;
        $scope.entity.StatusId = null;
        $scope.entity.IsInside = null;
        $scope.entity.Quarantine = null;
        $scope.entity.DateStartPractical = null;
        $scope.entity.DateEndPractical = null;
        $scope.entity.DateStartPracticalP = null;
        $scope.entity.DateEndPracticalP = null;
        $scope.entity.DurationPractical = null;
        $scope.entity.DurationPracticalUnitId = null;
        $scope.entity.IsGeneral = null;
        $scope.entity.CustomerId = null;
        $scope.entity.No = null;
        $scope.entity.IsNotificationEnabled = null;
        $scope.entity.CourseRelatedAircraftTypes = [];
        $scope.entity.CourseRelatedCourseTypes = [];
        $scope.entity.CourseRelatedStudyFields = [];
        $scope.entity.CourseRelatedEmployees = [];
        $scope.entity.CourseRelatedCourses = [];
        $scope.entity.CourseRelatedGroups = [];
        $scope.entity.CourseCatRates = [];
        $scope.entity.CourseAircraftTypes = [];

        $scope.entity.Sessions = [];

    };

    $scope.bind = function (data, sessions) {
        $scope.entity.Id = data.Id;
        $scope.entity.CourseTypeId = data.CourseTypeId;
        $scope.entity.DateStart = data.DateStart;
        $scope.entity.DateStartP = data.DateStartP;
        $scope.entity.DateEnd = data.DateEnd;
        $scope.entity.DateEndP = data.DateEndP;
        $scope.entity.Instructor = data.Instructor;
        $scope.entity.Location = data.Location;
        $scope.entity.Department = data.Department;
        $scope.entity.OrganizationId = data.OrganizationId;
        $scope.entity.Duration = data.Duration;
        $scope.entity.DurationUnitId = data.DurationUnitId;
        $scope.entity.StatusId = data.StatusId;
        $scope.entity.Remark = data.Remark;
        $scope.entity.Capacity = data.Capacity;
        $scope.entity.Tuition = data.Tuition;
        $scope.entity.CurrencyId = data.CurrencyId;
        $scope.entity.DateDeadlineRegistration = data.DateDeadlineRegistration;
        $scope.entity.DateDeadlineRegistrationP = data.DateDeadlineRegistrationP;
        $scope.entity.TrainingDirector = data.TrainingDirector;
        $scope.entity.Title = data.Title;
        $scope.entity.AircraftTypeId = data.AircraftTypeId;
        $scope.entity.AircraftModelId = data.AircraftModelId;
        $scope.entity.CaoTypeId = data.CaoTypeId;
        $scope.entity.Recurrent = data.Recurrent;
        $scope.entity.Interval = data.Interval;
        $scope.entity.CalanderTypeId = data.CalanderTypeId;

        $scope.entity.IsInside = data.IsInside;
        $scope.entity.Quarantine = data.Quarantine;
        $scope.entity.DateStartPractical = data.DateStartPractical;
        $scope.entity.DateEndPractical = data.DateEndPractical;
        $scope.entity.DateStartPracticalP = data.DateStartPracticalP;
        $scope.entity.DateEndPracticalP = data.DateEndPracticalP;
        $scope.entity.DurationPractical = data.DurationPractical;
        $scope.entity.DurationPracticalUnitId = data.DurationPracticalUnitId;
        $scope.entity.IsGeneral = data.IsGeneral;
        $scope.entity.CustomerId = data.CustomerId;
        $scope.entity.No = data.No;
        $scope.entity.IsNotificationEnabled = data.IsNotificationEnabled;
        $scope.entity.CourseRelatedAircraftTypes = data.CourseRelatedAircraftTypes;
        $scope.entity.CourseRelatedCourseTypes = data.CourseRelatedCourseTypes;
        $scope.entity.CourseRelatedStudyFields = data.CourseRelatedStudyFields;
        $scope.entity.CourseRelatedEmployees = data.CourseRelatedEmployees;
        $scope.entity.CourseRelatedCourses = data.CourseRelatedCourses;
        $scope.entity.CourseRelatedGroups = data.CourseRelatedGroups;
        $scope.entity.CourseCatRates = data.CourseCatRates;
        $scope.entity.CourseAircraftTypes = data.CourseAircraftTypes;

        $scope.entity.Sessions = sessions;
    };



    $scope.entityEmployee = {

    };
    $scope.entityGroup = {

    };
    $scope.entityCourse = {

    };
    $scope.entityCourseType = {

    };
    $scope.entityAircrafttype = {

    };
    $scope.entityEducation = {

    };


    $scope.clearEntityEmployee = function () {

    };
    $scope.clearEntityGroup = function () {

    };
    $scope.clearEntityCourse = function () {

    };
    $scope.clearEntityCourseType = function () {

    };
    $scope.clearEntityAircrafttype = function () {

    };
    $scope.clearEntityEducation = function () {

    };



    ////////////////////////////
    var tabs = [
        { text: "Main", id: 'main', visible_btn: false },
        //{ text: "Aircraft Type", id: 'aircrafttype', visible_btn: false, visible: $scope.type == 'active' },

        //{ text: "Course Type", id: 'coursetype', visible_btn: true, visible: $scope.type == 'active' },
        //{ text: "Education", id: 'education', visible_btn: false, visible_btn2: true, visible: $scope.type == 'active' },

        //{ text: "Course", id: 'course', visible_btn: false, visible: $scope.type == 'active' },
        //{ text: "Group", id: 'group', visible_btn: false, visible: $scope.type == 'active' },
        //{ text: "Employee", id: 'employee', visible_btn: false, visible: $scope.type == 'active' },


    ];

    $scope.btn_visible_aircrafttype = false;
    $scope.btn_visible_coursetype = false;
    $scope.btn_visible_education = false;
    $scope.btn_visible_course = false;
    $scope.btn_visible_group = false;
    $scope.btn_visible_employee = false;


    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });

            $scope.dg_aircrafttype_instance.repaint();
            $scope.dg_coursetype_instance.repaint();
            $scope.dg_education_instance.repaint();
            $scope.dg_course_instance.repaint();
            $scope.dg_group_instance.repaint();
            $scope.dg_employee_instance.repaint();

            var myVar = setInterval(function () {

                var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
                scl.scrollTo({ left: 0 });
                var scl2 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
                var scl3 = $("#dg_coursetype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
                var scl4 = $("#dg_course").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl4.scrollTo({ left: 0 });
                var scl5 = $("#dg_group").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });
                var scl6 = $("#dg_employee").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl6.scrollTo({ left: 0 });

                clearInterval(myVar);
            }, 10);

            $scope.btn_visible_aircrafttype = newValue == 1;
            $scope.btn_visible_coursetype = newValue == 2;
            $scope.btn_visible_education = newValue == 3;
            $scope.btn_visible_course = newValue == 4;
            $scope.btn_visible_group = newValue == 5;
            $scope.btn_visible_employee = newValue == 6;





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
    ////////////////////////////
    $scope.addSession = function () {
        $scope.popup_session_visible = true;
    };
    $scope.removeSession = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_session_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.Sessions = Enumerable.From($scope.entity.Sessions).Where('$.Key!="' + dg_selected.Key + '"').ToArray();
    };
    $scope.dg_session_columns = [

        { dataField: "DateStart", caption: "Date", allowResizing: true, alignment: "left", dataType: 'datetime', format: 'yyyy-MMM-dd EEEE', allowEditing: false, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 100, format: 'HH:mm', sortIndex: 1, sortOrder: "asc" },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 100, format: 'HH:mm', },

    ];
    $scope.dg_session_selected = null;
    $scope.dg_session_instance = null;
    $scope.dg_session = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',
        showColumnHeaders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: false, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_session_columns,
        onContentReady: function (e) {
            if (!$scope.dg_session_instance)
                $scope.dg_session_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_session_selected = null;
            }
            else
                $scope.dg_session_selected = data;


        },
        height: 610,
        bindingOptions: {

            dataSource: 'entity.Sessions',
            // height: 'dg_height',
        },
        // dataSource:ds

    };
    $scope.getSessionKey = function (obj) {
        return moment(obj.DateStart).format('YYYY-MM-DD-HH-mm-') + moment(obj.DateEnd).format('HH-mm');
    };

    $scope.popup_session_visible = false;
    $scope.popup_session_title = 'Session';
    $scope.popup_session = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_session"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 300,
        width: 350,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'crsession', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        // moment($scope.selectedDate).format('YYYY-MM-DDTHH:mm:ss')
                        var date = (new Date($scope.sessionDate)).getDatePartArray();
                        var start = (new Date($scope.sessionStart)).getTimePartArray();
                        var end = (new Date($scope.sessionEnd)).getTimePartArray();
                        var _start = new Date(date[0], date[1], date[2], start[0], start[1], 0, 0);
                        var _end = new Date(date[0], date[1], date[2], end[0], end[1], 0, 0);

                        var obj = { DateStart: _start, DateEnd: _end };
                        var exist = Enumerable.From($scope.entity.Sessions).Where(function (x) {
                            return (new Date(obj.DateStart) >= new Date(x.Start) && new Date(obj.DateStart) <= new Date(x.DateEnd))
                                ||
                                (new Date(obj.DateEnd) >= new Date(x.DateStart) && new Date(obj.DateEnd) <= new Date(x.DateEnd));
                        }).FirstOrDefault();

                        if (exist) {
                            General.ShowNotify('The value is not valid.', 'error');
                            return;
                        }
                        obj.Key = $scope.getSessionKey(obj);
                        console.log(obj);
                        $scope.entity.Sessions.push(obj);

                        $scope.sessionDate = null;
                        $scope.sessionStart = null;
                        $scope.sessionEnd = null;
                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.popup_session_visible = false;

        },
        bindingOptions: {
            visible: 'popup_session_visible',

            title: 'popup_session_title',

        }
    };

    //close button
    $scope.popup_session.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_session_visible = false;

    };

    $scope.sessionDate = null;
    $scope.sessionStart = null;
    $scope.sessionEnd = null;
    $scope.date_session = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'sessionDate',

        }
    };
    $scope.start_session = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'sessionStart',

        }
    };
    $scope.end_session = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'sessionEnd',

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
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'educationadd', onClick: function (e) {

                        $rootScope.$broadcast('InitStudyFieldSelect', null);
                    }
                }, toolbar: 'bottom', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'educationadd', bindingOptions: { visible: 'btn_visible_education', }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_education_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedStudyFields = Enumerable.From($scope.entity.CourseRelatedStudyFields).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },



            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype', }, onClick: function (e) {
                        // $scope.popup_aircrafttype_visible = true;
                        $rootScope.$broadcast('InitAircraftSelect', null);
                    }
                }
            },
            //{ widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype' } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_aircrafttype_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedAircraftTypes = Enumerable.From($scope.entity.CourseRelatedAircraftTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },



            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' }, onClick: function (e) {

                        $rootScope.$broadcast('InitCourseTypeSelect', null);
                    }
                }, toolbar: 'bottom'
            },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_coursetype_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedCourseTypes = Enumerable.From($scope.entity.CourseRelatedCourseTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' }, onClick: function (e) {
                        $rootScope.$broadcast('InitCourseSelect', null);
                    }
                }, toolbar: 'bottom'
            },
            //{ widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_course_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedCourses = Enumerable.From($scope.entity.CourseRelatedCourses).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
                        $rootScope.$broadcast('InitJobGroupSelect', null);
                    }
                }, toolbar: 'bottom'
            },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedGroups = Enumerable.From($scope.entity.CourseRelatedGroups).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
                        $rootScope.$broadcast('InitEmployeeSelect', null);
                    }
                }, toolbar: 'bottom'
            },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_employee_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.CourseRelatedEmployees = Enumerable.From($scope.entity.CourseRelatedEmployees).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'courseadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }


        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();

            $scope.pop_width = size.width;
            if ($scope.pop_width > 1100)
                $scope.pop_width = 1100;

            $scope.pop_height = 780; //$(window).height() - 70; //630; //size.height;
            $scope.dg_height = $scope.pop_height - 133;
            $scope.scroll_height = $scope.pop_height - 100;

        },
        onShown: function (e) {

            if ($scope.isNew) {

            }

            //var dsclient = $rootScope.getClientsDatasource($scope.LocationId);
            //$scope.clientInstance.option('dataSource', dsclient);

            if ($scope.tempData != null) {
                $scope.loadingVisible = true;
                trnService.getCourseViewObject($scope.tempData.Id).then(function (response) {
                    $scope.loadingVisible = false;

                    $scope.bind(response.Data.course, response.Data.sessions);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }

            if ($scope.dg_session_instance)
                $scope.dg_session_instance.refresh();

        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;

        },
        onHidden: function () {
            $scope.selectedTabIndex = 0;
            $rootScope.$broadcast('onCourseHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',

            'toolbarItems[0].visible': 'btn_visible_education',
            'toolbarItems[1].visible': 'btn_visible_education',
            // 'toolbarItems[2].visible': 'btn_visible_education',
            'toolbarItems[2].visible': 'btn_visible_aircrafttype',
            'toolbarItems[3].visible': 'btn_visible_aircrafttype',
            //'toolbarItems[5].visible': 'btn_visible_aircrafttype',
            'toolbarItems[4].visible': 'btn_visible_coursetype',
            'toolbarItems[5].visible': 'btn_visible_coursetype',
            // 'toolbarItems[8].visible': 'btn_visible_coursetype',
            'toolbarItems[6].visible': 'btn_visible_course',
            'toolbarItems[7].visible': 'btn_visible_course',
            //'toolbarItems[11].visible': 'btn_visible_course',
            'toolbarItems[8].visible': 'btn_visible_group',
            'toolbarItems[9].visible': 'btn_visible_group',
            //'toolbarItems[14].visible': 'btn_visible_group',
            'toolbarItems[10].visible': 'btn_visible_employee',
            'toolbarItems[11].visible': 'btn_visible_employee',
            //'toolbarItems[17].visible': 'btn_visible_employee',
            'toolbarItems[12].visible': 'false',
        }
    };

    //close button
    $scope.popup_add.toolbarItems[13].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };


    //save button
    $scope.popup_add.toolbarItems[12].options.onClick = function (e) {

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto = {};
        if ($scope.isNew) {
            $scope.entity.Id = -1;
            $scope.entity.CustomerId = Config.CustomerId;
            $scope.entity.IsGeneral = 1;
        }
        $scope.entity.IsNotificationEnabled = 0;
        if ($scope.type == 'active')
            $scope.entity.IsNotificationEnabled = 1;


        dto.Id = $scope.entity.Id;
        dto.CustomerId = $scope.entity.CustomerId;
        dto.IsGeneral = $scope.entity.IsGeneral;
        dto.CourseTypeId = $scope.entity.CourseTypeId;
        dto.No = $scope.entity.No;
        dto.Title = $scope.entity.Title;
        dto.DateStart = moment($scope.entity.DateStart).format('YYYY-MM-DD');
        dto.DateEnd = moment($scope.entity.DateEnd).format('YYYY-MM-DD');
        dto.OrganizationId = $scope.entity.OrganizationId;
        dto.Location = $scope.entity.Location;
        dto.Instructor = $scope.entity.Instructor;
        dto.TrainingDirector = $scope.entity.TrainingDirector;
        dto.Duration = $scope.entity.Duration;
        dto.DurationUnitId = 27;
        dto.Interval = $scope.entity.Interval;
        dto.CalanderTypeId = $scope.entity.CalanderTypeId;
        dto.StatusId = $scope.entity.StatusId;
        dto.Recurrent = $scope.entity.Recurrent;
        dto.Remark = $scope.entity.Remark;
        dto.IsNotificationEnabled = $scope.entity.IsNotificationEnabled;
        dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
        console.log(dto);

        $scope.loadingVisible = true;
        trnService.saveCourse(dto).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onCourseSaved', response);



            $scope.loadingVisible = false;
            if (!$scope.isNew)
                $scope.popup_add_visible = false;




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //Transaction.Aid.save($scope.entity, function (data) {

        //    $scope.clearEntity();


        //    General.ShowNotify('تغییرات با موفقیت ذخیره شد', 'success');

        //    $rootScope.$broadcast('onAidSaved', data);

        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //        if (!$scope.isNew)
        //            $scope.popup_add_visible = false;
        //    });

        //}, function (ex) {
        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //    });
        //    General.ShowNotify(ex.message, 'error');
        //});

    };
    ///////////////////////////////////////////
    $scope.pop_width_education = 800;
    $scope.pop_height_education = 600;
    $scope.popup_education_visible = false;
    $scope.popup_education_title = 'Education';
    $scope.popup_education = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'educationadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_education_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_education > $scope.pop_width)
                $scope.pop_width_education = $scope.pop_width;
            if ($scope.pop_height_education > $scope.pop_height)
                $scope.pop_height_education = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityEducation();

            $scope.popup_education_visible = false;

        },
        bindingOptions: {
            visible: 'popup_education_visible',
            width: 'pop_width_education',
            height: 'pop_height_education',
            title: 'popup_education_title',

        }
    };
    /////////////////////////////////////////////
    $scope.pop_width_aircrafttype = 800;
    $scope.pop_height_aircrafttype = 600;
    $scope.popup_aircrafttype_visible = false;
    $scope.popup_aircrafttype_title = 'Aircraft Type';
    $scope.popup_aircrafttype = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'aircrafttypeadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_aircrafttype_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_aircrafttype > $scope.pop_width)
                $scope.pop_width_aircrafttype = $scope.pop_width;
            if ($scope.pop_height_aircrafttype > $scope.pop_height)
                $scope.pop_height_aircrafttype = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityAircrafttype();

            $scope.popup_aircrafttype_visible = false;

        },
        bindingOptions: {
            visible: 'popup_aircrafttype_visible',
            width: 'pop_width_aircrafttype',
            height: 'pop_height_aircrafttype',
            title: 'popup_aircrafttype_title',

        }
    };
    /////////////////////////////////////////////
    $scope.pop_width_coursetype = 800;
    $scope.pop_height_coursetype = 600;
    $scope.popup_coursetype_visible = false;
    $scope.popup_coursetype_title = 'Course Type';
    $scope.popup_coursetype = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'coursetypeadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_coursetype_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_coursetype > $scope.pop_width)
                $scope.pop_width_coursetype = $scope.pop_width;
            if ($scope.pop_height_coursetype > $scope.pop_height)
                $scope.pop_height_coursetype = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityCourseType();

            $scope.popup_coursetype_visible = false;

        },
        bindingOptions: {
            visible: 'popup_coursetype_visible',
            width: 'pop_width_coursetype',
            height: 'pop_height_coursetype',
            title: 'popup_coursetype_title',

        }
    };
    /////////////////////////////////////////////
    $scope.pop_width_course = 800;
    $scope.pop_height_course = 600;
    $scope.popup_course_visible = false;
    $scope.popup_course_title = 'Course';
    $scope.popup_course = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'courseadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_course_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_course > $scope.pop_width)
                $scope.pop_width_course = $scope.pop_width;
            if ($scope.pop_height_course > $scope.pop_height)
                $scope.pop_height_course = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityCourse();

            $scope.popup_course_visible = false;

        },
        bindingOptions: {
            visible: 'popup_course_visible',
            width: 'pop_width_course',
            height: 'pop_height_course',
            title: 'popup_course_title',

        }
    };
    /////////////////////////////////////////////
    $scope.pop_width_group = 800;
    $scope.pop_height_group = 600;
    $scope.popup_group_visible = false;
    $scope.popup_group_title = 'Group';
    $scope.popup_group = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'groupadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_group_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_group > $scope.pop_width)
                $scope.pop_width_group = $scope.pop_width;
            if ($scope.pop_height_group > $scope.pop_height)
                $scope.pop_height_group = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityGroup();

            $scope.popup_group_visible = false;

        },
        bindingOptions: {
            visible: 'popup_group_visible',
            width: 'pop_width_group',
            height: 'pop_height_group',
            title: 'popup_group_title',

        }
    };
    /////////////////////////////////////////////
    $scope.pop_width_employee = 800;
    $scope.pop_height_employee = 600;
    $scope.popup_employee_visible = false;
    $scope.popup_employee_title = 'Employee';
    $scope.popup_employee = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'employeeadd', bindingOptions: {} }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_employee_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_employee > $scope.pop_width)
                $scope.pop_width_employee = $scope.pop_width;
            if ($scope.pop_height_employee > $scope.pop_height)
                $scope.pop_height_employee = $scope.pop_height;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityEmployee();

            $scope.popup_employee_visible = false;

        },
        bindingOptions: {
            visible: 'popup_employee_visible',
            width: 'pop_width_employee',
            height: 'pop_height_employee',
            title: 'popup_employee_title',

        }
    };
    /////////////////////////////////////////////
    $scope.dg_education_columns = [
        { dataField: "Title", caption: "Field", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc" },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 300 },
    ];
    $scope.dg_education_selected = null;
    $scope.dg_education_instance = null;
    $scope.dg_education = {
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

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_education_columns,
        onContentReady: function (e) {
            if (!$scope.dg_education_instance)
                $scope.dg_education_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_education_selected = null;
            }
            else
                $scope.dg_education_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedStudyFields',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_aircrafttype_columns = [
        { dataField: "Type", caption: "Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200, sortIndex: 0, sortOrder: "asc" },
        { dataField: "Manufacturer", caption: "Manufacturer", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },

        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
    ];
    $scope.dg_aircrafttype_selected = null;
    $scope.dg_aircrafttype_instance = null;
    $scope.dg_aircrafttype = {
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

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_aircrafttype_columns,
        onContentReady: function (e) {
            if (!$scope.dg_aircrafttype_instance)
                $scope.dg_aircrafttype_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_aircrafttype_selected = null;
            }
            else
                $scope.dg_aircrafttype_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedAircraftTypes',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_coursetype_columns = [
        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc" },

        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 300 },
    ];
    $scope.dg_coursetype_selected = null;
    $scope.dg_coursetype_instance = null;
    $scope.dg_coursetype = {
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

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_coursetype_columns,
        onContentReady: function (e) {
            if (!$scope.dg_coursetype_instance)
                $scope.dg_coursetype_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_coursetype_selected = null;
            }
            else
                $scope.dg_coursetype_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedCourseTypes',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    ///////////////////////////
    $scope.dg_course_columns = [
        { dataField: 'No', caption: 'No', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
    ];
    $scope.dg_course_selected = null;
    $scope.dg_course_instance = null;
    $scope.dg_course = {
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

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
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
            else
                $scope.dg_course_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedCourses',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_group_columns = [
        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_group_selected = null;
    $scope.dg_group_instance = null;
    $scope.dg_group = {
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

        filterRow: { visible: true, showOperationChooser: true, },
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
            else
                $scope.dg_group_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedGroups',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_employee_columns = [
        { dataField: "Name", caption: "Name", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        // { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        //{ dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

    ];
    $scope.dg_employee_selected = null;
    $scope.dg_employee_instance = null;
    $scope.dg_employee = {
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

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_employee_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employee_instance)
                $scope.dg_employee_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employee_selected = null;
            }
            else
                $scope.dg_employee_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.CourseRelatedEmployees',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    /////////////////////////////
    $scope.category = null;
    $scope.txt_category = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'category',

        }
    };
    $scope.txt_No = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.No',
        }
    };
    $scope.txt_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
        }
    };
    $scope.txt_Duration = {
        min: 1,
        bindingOptions: {
            value: 'entity.Duration',
        }
    };
    $scope.txt_Interval = {
        min: 1,
        bindingOptions: {
            value: 'entity.Interval',
        }
    };
    $scope.txt_Tuition = {
        min: 1,
        bindingOptions: {
            value: 'entity.Tuition',
        }
    };
    $scope.txt_Instructor = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Instructor',
        }
    };
    $scope.txt_TrainingDirector = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.TrainingDirector',
        }
    };
    $scope.txt_Location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Location',
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
        }
    };
    $scope.chb_Recurrent = {

        text: 'Recurrent',
        bindingOptions: {
            value: 'entity.Recurrent',

        }
    };
    $scope.chb_IsNotificationEnabled = {

        text: 'Push Notifications',
        bindingOptions: {
            value: 'entity.IsNotificationEnabled',

        }
    };
    $scope.chb_IsInside = {

        text: 'Initial',
        bindingOptions: {
            value: 'entity.IsInside',

        }
    };
    $scope.date_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateStart',

        }
    };
    $scope.date_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateEnd',

        }
    };
    $scope.date_DateStartPractical = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateStartPractical',

        }
    };
    $scope.date_DateEndPractical = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateEndPractical',

        }
    };
    $scope.date_DateDeadlineRegistration = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateDeadlineRegistration',

        }
    };


    $scope.sb_DurationUnitId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(26),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.DurationUnitId',

        }
    };
    $scope.sb_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CalanderTypeId',

        }
    };
    $scope.sb_StatusId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: [{ Id: 1, Title: 'Scheduled' }, { Id: 2, Title: 'In Progress' }, { Id: 3, Title: 'Done' }, { Id: 4, Title: 'Canceled' }],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.StatusId',

        }
    };
    $scope.sb_CurrencyId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCurrencies(),
        displayExpr: "Code",
        valueExpr: 'Id',
        searchExpr: ["Title", "Code"],
        bindingOptions: {
            value: 'entity.CurrencyId',

        }
    };
    $scope.selectedType = null;
    $scope.sb_CourseTypeId = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {

            //if ($scope.isNew) {
            //    $scope.entity.Title = e.selectedItem ? e.selectedItem.Title : null;
            //}

            //if (e.selectedItem && e.selectedItem.Interval)
            //    $scope.entity.Interval = e.selectedItem.Interval;
            //if (e.selectedItem && e.selectedItem.CalenderTypeId)
            //    $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
            if ($scope.isNew) {
                if (e.selectedItem && e.selectedItem.Interval)
                    $scope.entity.Interval = e.selectedItem.Interval;
                if (e.selectedItem && e.selectedItem.CalenderTypeId)
                    $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
                if (e.selectedItem && e.selectedItem.Duration)
                    $scope.entity.Duration = e.selectedItem.Duration;
            }
            $scope.selectedType = e.selectedItem;
            $scope.certype = null;
            $scope.ctgroups = null;
            if (e.selectedItem) {
                $scope.certype = e.selectedItem.CertificateType;

                $scope.ctgroups = e.selectedItem.JobGroups;
            }

        },
        bindingOptions: {
            value: 'entity.CourseTypeId',

        }

    };
    $scope.certype = null;
    $scope.ctgroups = null;
    $scope.txt_groups = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'ctgroups',
        }
    };
    $scope.txt_certype = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'certype',
        }
    };
    $scope.sb_CaoTypeId = {
        dataSource: $rootScope.getDatasourceCaoType(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'entity.CaoTypeId',

        }

    };
    $scope.sb_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'entity.OrganizationId',

        }

    };
    $scope.tag_CourseCatRate = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        dataSource: $rootScope.getDatasourceOption(51),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CourseCatRates',


        }
    };
    $scope.tag_CourseAircraftType = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Type', 'Manufacturer'],
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CourseAircraftTypes',


        }
    };
    ///////////////////////////
    $scope.tempData = null;
    $scope.$on('InitViewCourse', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'New';

        }

        else {

            $scope.popup_add_title = 'Edit';
            // $scope.loadingVisible = true;


            $scope.tempData = prms;

            $scope.isNew = false;


        }

        $scope.popup_add_visible = true;

    });
    $scope.$on('onAircraftSelectHide', function (event, prms) {

        //alert('ac');
        //   console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedAircraftTypes).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedAircraftTypes.push(_d);
            }
        });
        $scope.dg_aircrafttype_instance.refresh();
    });
    $scope.$on('onCourseTypeSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedCourseTypes).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedCourseTypes.push(_d);
            }
        });
        $scope.dg_coursetype_instance.refresh();
    });
    $scope.$on('onStudyFieldSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedStudyFields).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedStudyFields.push(_d);
            }
        });
        $scope.dg_education_instance.refresh();
    });
    $scope.$on('onEmployeeSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedEmployees).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedEmployees.push(_d);
            }
        });
        $scope.dg_employee_instance.refresh();
    });
    //CourseRelatedCourses
    $scope.$on('onCourseSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedCourses).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedCourses.push(_d);
            }
        });
        $scope.dg_coursetype_instance.refresh();
    });
    $scope.$on('onJobGroupSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.CourseRelatedGroups).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.CourseRelatedGroups.push(_d);
            }
        });
        $scope.dg_group_instance.refresh();
    });
    //////////////////////////////

}]);  