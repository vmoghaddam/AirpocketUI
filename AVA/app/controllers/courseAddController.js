'use strict';
app.controller('courseAddController', ['$scope', '$location', 'courseService', 'authService', '$routeParams', '$rootScope', 'trnService', 'ztrnService', '$http', function ($scope, $location, courseService, authService, $routeParams, $rootScope, trnService, ztrnService, $http) {

    $scope.IsEditable = true; $rootScope.HasTrainingAdmin();

    $scope.isNew = true;

    $scope.sb_holding = {
        dataSource: ['Attendance Class', 'Online Class'],
        showClearButton: true,
        searchEnabled: true,

        bindingOptions: {
            value: 'entity.HoldingType',

        }

    };
    $scope.sb_director = {
        dataSource: ['DAVARI AMIN'],
        showClearButton: true,
        searchEnabled: true,

        bindingOptions: {
            value: 'entity.TrainingDirector',

        }

    };


    $scope.entity = {
        Id: null,
        CourseTypeId: null,
        DateStart: null,
        DateStartP: null,
        DateEnd: null,
        DateEndP: null,
        Instructor: null,
        Location: 'AVA TRAINING CENTER',
        Department: null,
        OrganizationId: 10,
        Duration: null,
        DurationUnitId: null,
        StatusId: 1,
        Remark: null,
        Capacity: null,
        Tuition: null,
        CurrencyId: null,
        DateDeadlineRegistration: null,
        DateDeadlineRegistrationP: null,
        TrainingDirector: 'CAPT. PEYMAN HOUSHYAR',
        Title: null,
        AircraftTypeId: null,
        AircraftModelId: null,
        CaoTypeId: null,
        Recurrent: null,
        Interval: null,
        CalanderTypeId: 12,
        StatusId: 1,
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
        CurrencyId: null,

        //04-30
        HoldingType: 'Attendance Class',
        Instructor2Id: null,
        Cost: null,

        SMSIns1: null,
        SMSIns2: null,
        SMSIns1Status: null,
        SMSIns2Status: null,
        SMSInsDate: null,

        CourseRelatedAircraftTypes: [],
        CourseRelatedCourseTypes: [],
        CourseRelatedStudyFields: [],
        CourseRelatedEmployees: [],
        CourseRelatedCourses: [],
        CourseRelatedGroups: [],
        CourseCatRates: [],
        CourseAircraftTypes: [],


        Sessions: [],
        Syllabi: [],
    };


    $scope.clearEntity = function () {

        $scope.entity.Id = null;
        $scope.entity.CourseTypeId = null;
        $scope.entity.DateStart = null;
        $scope.entity.DateStartP = null;
        $scope.entity.DateEnd = null;
        $scope.entity.DateEndP = null;
        $scope.entity.Instructor = null;
        $scope.entity.Location = 'AVA TRAINING CENTER';
        $scope.entity.Department = null;
        $scope.entity.OrganizationId = 10;
        $scope.entity.Duration = null;
        $scope.entity.DurationUnitId = null;
        $scope.entity.StatusId = 1;
        $scope.entity.Remark = null;
        $scope.entity.Capacity = null;
        $scope.entity.Tuition = null;
        $scope.entity.CurrencyId = null;
        $scope.entity.DateDeadlineRegistration = null;
        $scope.entity.DateDeadlineRegistrationP = null;
        $scope.entity.TrainingDirector = 'CAPT. PEYMAN HOUSHYAR';
        $scope.entity.Title = null;
        $scope.entity.AircraftTypeId = null;
        $scope.entity.AircraftModelId = null;
        $scope.entity.CaoTypeId = null;
        $scope.entity.Recurrent = null;
        $scope.entity.Interval = null;
        $scope.entity.CalanderTypeId = 12;
        $scope.entity.StatusId = 1;
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
        //04-30
        $scope.entity.HoldingType = 'Attendance Class';
        $scope.entity.Instructor2Id = null;

        $scope.entity.Cost = null;
        $scope.entity.SMSIns1 = null;
        $scope.entity.SMSIns2 = null;
        $scope.entity.SMSIns1Status = null;
        $scope.entity.SMSIns2Status = null;
        $scope.entity.SMSInsDate = null;

        $scope.CurrencyId = null;

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
        $scope.entity.Syllabi = [];

        $scope.selected_exam.id = null;
        $scope.selected_exam.course_id = null;
        $scope.selected_exam.exam_date = null;
        $scope.selected_exam.location_title = null;
        $scope.selected_exam.location_address = null;
        $scope.selected_exam.location_phone = null;
        $scope.selected_exam.duration = null;
        $scope.selected_exam.template = [];
        $scope.selected_exam.groups = [];
        $scope.selected_exam.people = [];
    };

    $scope.bind = function (data, sessions, syllabi, exams) {
        //2023-07-29
        if ($scope.tempData.ReadOnly == 100)
            $scope.IsEditable = false;
        ////////////////////////////
        //$scope.entity.Id = data.Id;
        //$scope.entity.CourseTypeId = data.CourseTypeId;
        //$scope.entity.DateStart = data.DateStart;
        //$scope.entity.DateStartP = data.DateStartP;
        //$scope.entity.DateEnd = data.DateEnd;
        //$scope.entity.DateEndP = data.DateEndP;
        //$scope.entity.Instructor = data.Instructor;
        //$scope.entity.Location = data.Location;
        //$scope.entity.Department = data.Department;
        //$scope.entity.OrganizationId = data.OrganizationId;
        //$scope.entity.Duration = data.Duration;
        //$scope.entity.DurationUnitId = data.DurationUnitId;
        //$scope.entity.StatusId = data.StatusId;
        //$scope.entity.Remark = data.Remark;
        //$scope.entity.Capacity = data.Capacity;
        //$scope.entity.Tuition = data.Tuition;
        //$scope.entity.CurrencyId = data.CurrencyId;
        //$scope.entity.DateDeadlineRegistration = data.DateDeadlineRegistration;
        //$scope.entity.DateDeadlineRegistrationP = data.DateDeadlineRegistrationP;
        //$scope.entity.TrainingDirector = data.TrainingDirector;
        //$scope.entity.Title = data.Title;
        //$scope.entity.AircraftTypeId = data.AircraftTypeId;
        //$scope.entity.AircraftModelId = data.AircraftModelId;
        //$scope.entity.CaoTypeId = data.CaoTypeId;
        //$scope.entity.Recurrent = data.Recurrent;
        //$scope.entity.Interval = data.Interval;
        //$scope.entity.CalanderTypeId = data.CalanderTypeId;

        //$scope.entity.IsInside = data.IsInside;
        //$scope.entity.Quarantine = data.Quarantine;
        //$scope.entity.DateStartPractical = data.DateStartPractical;
        //$scope.entity.DateEndPractical = data.DateEndPractical;
        //$scope.entity.DateStartPracticalP = data.DateStartPracticalP;
        //$scope.entity.DateEndPracticalP = data.DateEndPracticalP;
        //$scope.entity.DurationPractical = data.DurationPractical;
        //$scope.entity.DurationPracticalUnitId = data.DurationPracticalUnitId;
        //$scope.entity.IsGeneral = data.IsGeneral;
        //$scope.entity.CustomerId = data.CustomerId;
        //$scope.entity.No = data.No;
        //$scope.entity.CurrencyId = data.CurrencyId;
        //$scope.entity.IsNotificationEnabled = data.IsNotificationEnabled;
        //$scope.entity.CourseRelatedAircraftTypes = data.CourseRelatedAircraftTypes;
        //$scope.entity.CourseRelatedCourseTypes = data.CourseRelatedCourseTypes;
        //$scope.entity.CourseRelatedStudyFields = data.CourseRelatedStudyFields;
        //$scope.entity.CourseRelatedEmployees = data.CourseRelatedEmployees;
        //$scope.entity.CourseRelatedCourses = data.CourseRelatedCourses;
        //$scope.entity.CourseRelatedGroups = data.CourseRelatedGroups;
        //$scope.entity.CourseCatRates = data.CourseCatRates;
        //$scope.entity.CourseAircraftTypes = data.CourseAircraftTypes;
        //$scope.entity.HoldingType = data.HoldingType;
        //$scope.entity.Instructor2Id = data.Instructor2Id;
        //$scope.entity.Cost = data.Cost;
        //$scope.entity.SMSIns1 = data.SMSIns1;
        //$scope.entity.SMSIns2 = data.SMSIns2;
        //$scope.entity.SMSIns1Status = data.SMSIns1Status;
        //$scope.entity.SMSIns2Status = data.SMSIns2Status;
        //$scope.entity.SMSInsDate = data.SMSInsDate;

        $scope.entity = JSON.parse(JSON.stringify(data));

        $scope.entity.Sessions = sessions;
        $scope.entity.Syllabi = syllabi;

        //04-30


        if (!exams || exams == null)
            $scope.selected_exam = {
                "id": null,
                "course_id": null,
                "exam_date": null,
                "exam_date_persian": null,
                "location_title": null,
                "location_address": null,
                "location_phone": null,
                "remark": null,
                "status_id": null,
                "created_by": null,
                "confirmed_by": null,
                "created_date": null,
                "confirmed_date": null,
                "exam_type_id": null,
                "signed_by_ins1_date": null,
                "signed_by_ins2_date": null,
                "signed_by_director_date": null,
                "signed_by_staff_date": null,
                "duration": null,
                "date_start": null,
                "date_end_scheduled": null,
                "date_end_actual": null,
                "date_start_scheduled": null,
                "groups": [],
                "people": [],
                "template": [
                    { category_id: 1, category: 'Air condition', total: null },
                    { category_id: 2, category: 'APU', total: null },
                    { category_id: 3, category: 'Automatic Flight', total: null },
                    { category_id: 4, category: 'Communication', total: null },
                    { category_id: 5, category: 'Electrical', total: null },
                    { category_id: 6, category: 'Emergency', total: null },
                    { category_id: 7, category: 'Engine', total: null },
                    { category_id: 8, category: 'Fire Protection', total: null },
                    { category_id: 9, category: 'Flight Control', total: null },
                    { category_id: 10, category: 'Flight instrument', total: null },
                    { category_id: 11, category: 'Fuel', total: null },
                    { category_id: 12, category: 'General', total: null },
                    { category_id: 13, category: 'Hydraulic', total: null },
                    { category_id: 14, category: 'Ice&rain Protection', total: null },
                    { category_id: 15, category: 'Landing Gear', total: null },
                    { category_id: 16, category: 'Limitation', total: null },
                    { category_id: 17, category: 'Navigation', total: null },
                    { category_id: 18, category: 'Pneumatic', total: null },
                    { category_id: 19, category: 'Warning System', total: null },
                ],
            };
        else {
            $scope.selected_exam = exams[0];

            $http.get($rootScope.serviceUrl + 'odata/base/jobgroups/' + Config.CustomerId).then(function (response) {
                $scope._JobGroup = response.data;

                $scope.g = [];
                $.each($scope.selected_exam.groups, function (_i, _d) {

                    var exist = Enumerable.From($scope._JobGroup).Where("$.Id==" + _d).FirstOrDefault();

                    if (exist != null) {
                        var jg = { Id: exist.Id, Title: exist.Title, FullCode: exist.FullCode };

                        console.log(jg)
                        $scope.g.push(jg);

                    }



                });
                $scope.selected_exam.groups = $scope.g
            });



            console.log('-----selected-----', $scope.selected_exam)

        }



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
        { text: "Subjects", id: 'subjects', visible_btn: false },
        { text: "Exam", id: 'exam', visible_btn: false },
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
            if ($scope.dg_exam_template_instance)
                $scope.dg_exam_template_instance.refresh();
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

            // $scope.btn_visible_aircrafttype = newValue == 1;
            // $scope.btn_visible_coursetype = newValue == 2;
            //  $scope.btn_visible_education = newValue == 3;
            // $scope.btn_visible_course = newValue == 4;
            //  $scope.btn_visible_group = newValue == 5;
            //  $scope.btn_visible_employee = newValue == 6;





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
        $scope.sessionDate = $scope.entity.DateStart;
        $scope.popup_session_visible = true;
    };
    $scope.addSessionAll = function () {
        $scope.sessionDate = $scope.entity.DateStart;
        $scope.popup_sessionall_visible = true;
    };
    $scope.removeSession = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_session_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.Sessions = Enumerable.From($scope.entity.Sessions).Where('$.Key!="' + dg_selected.Key + '"').ToArray();
        $scope.session_changed = 1;
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
        height: 730 - 400,
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

                        var difference = $scope.sessionEnd.getTime() - $scope.sessionStart.getTime(); // This will give difference in milliseconds
                        var resultInMinutes = Math.round(difference / 60000);


                        var _new_start = new Date($scope.sessionEnd.addMinutes(15));
                        var _new_end = new Date(new Date(_new_start).addMinutes(resultInMinutes));


                        //$scope.sessionDate = null;
                        $scope.sessionStart = new Date(_new_start);

                        $scope.sessionEnd = new Date(_new_end);
                        $scope.session_changed = 1;
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
    ///////////////////////////////////
    $scope.session_duration = 120;
    $scope.txt_session_duration = {
        min: 1,
        bindingOptions: {
            value: 'session_duration',
        }
    };
    $scope.popup_sessionall_visible = false;
    $scope.popup_sessionall_title = 'Sessions';
    $scope.popup_sessionall = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_sessionall"
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'crsessionall', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var date = (new Date($scope.sessionDate)).getDatePartArray();
                        var start = (new Date($scope.sessionStart)).getTimePartArray();
                        var _start = new Date(date[0], date[1], date[2], start[0], start[1], 0, 0);

                        $scope.entity.Sessions = [];
                        //entity.Duration
                        var _cnt = $scope.entity.Duration * 60 / $scope.session_duration;
                        var _ellapsed = 0;
                        var session_start = _start;
                        while ($scope.entity.Sessions.length < _cnt) {
                            var session_end = General.add_minutes(session_start, $scope.session_duration);
                            var obj = { DateStart: session_start, DateEnd: session_end };
                            obj.Key = $scope.getSessionKey(obj);
                            $scope.entity.Sessions.push(obj);

                            _ellapsed += $scope.session_duration;
                            console.log('_ellapsed   ' + _ellapsed);
                            if (_ellapsed < 8 * 60) {
                                session_start = General.add_minutes(session_end, 15);
                            }
                            else {
                                var _date2 = (new Date(session_start).addDays(1)).getDatePartArray();
                                var _hhmm = (new Date($scope.sessionStart)).getTimePartArray();
                                var _start2 = new Date(_date2[0], _date2[1], _date2[2], _hhmm[0], _hhmm[1], 0, 0);
                                session_start = _start2;
                                _ellapsed = 0;
                            }

                        }
                        $scope.session_changed = 1;
                        $scope.popup_sessionall_visible = false;

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


            $scope.popup_sessionall_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sessionall_visible',

            title: 'popup_sessionall_title',

        }
    };

    //close button
    $scope.popup_sessionall.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_sessionall_visible = false;

    };

    //////////////////////////////////////

    $scope.sessionDate = null;
    $scope.sessionStart = null;
    $scope.sessionEnd = null;
    $scope.date_session = {
        type: "date",
        width: '100%',
        displayFormat: "yyyy-MM-dd",
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

    //////////////////////////////
    $scope.dg_syllabi_columns = [

        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc", minWidth: 300 },
        { dataField: "Instructor", caption: "Instructor", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc", width: 250 },

        { dataField: 'Duration', caption: 'Duration(mm)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, encodeHtml: false, width: 130, },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc", width: 250 },
    ];
    $scope.dg_syllabi_selected = null;
    $scope.dg_syllabi_instance = null;
    $scope.dg_syllabi = {
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
        columns: $scope.dg_syllabi_columns,
        onContentReady: function (e) {
            if (!$scope.dg_syllabi_instance)
                $scope.dg_syllabi_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_syllabi_selected = null;
            }
            else
                $scope.dg_syllabi_selected = data;


        },
        height: 470,
        bindingOptions: {

            dataSource: 'entity.Syllabi',
            // height: 'dg_height',
        },
        // dataSource:ds

    };

    $scope.fill_syllabi = function (item) {
        $scope.syllabi_type = item.CourseTypeId;
        $scope.syllabi_instructor = item.CurrencyId;
        $scope.syllabi_id = item.Id;
        $scope.syllabi_title = item.Title;
        $scope.syllabi_remark = item.Remark;
        $scope.syllabi_duration = item.Duration;
        $scope.new_syllabi = {
            Id: $scope.syllabi_id,
            Sessions: item.Sessions
        };


        $scope.popup_syllabus_visible = true;

    }

    $scope.syllabi_hrs = null;
    $scope.syllabi_title = null;
    $scope.hrs_syllabi = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'syllabi_hrs',

        }
    };
    $scope.txt_syllabi = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'syllabi_title',
        }
    };
    $scope.sb_syl_CourseTypeId = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {

            $scope.syllabi_title = e.selectedItem ? e.selectedItem.Title : null;

            if ($scope.syllabi_id <= 0) {
                if (e.selectedItem && e.selectedItem.Interval)
                    $scope.syllabi_interval = e.selectedItem.Interval;

                if (e.selectedItem && e.selectedItem.Duration)
                    $scope.syllabi_duration = e.selectedItem.Duration;
            }

        },
        bindingOptions: {
            value: 'syllabi_type',

        }

    };
    $scope.sb_syl_Instructor = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",
        onSelectionChanged: function (e) {

            $scope.syllabi_instructor_title = e.selectedItem ? e.selectedItem.Name : null;;

        },
        bindingOptions: {
            value: 'syllabi_instructor',
            dataSource: 'ds_teachers'

        }

    };
    $scope.txt_syl_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'syllabi_remark',
        }
    };
    $scope.txt_syl_Duration = {
        min: 1,
        bindingOptions: {
            value: 'syllabi_duration',
        }
    };
    $scope.txt_syl_Interval = {
        min: 1,
        bindingOptions: {
            value: 'syllabi_interval',
        }
    };
    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return moment(new Date(dt)).format('YYYY-MMM-DD').toUpperCase();
    };
    $scope.formatTime = function (dt) {
        if (!dt)
            return "";
        return moment(new Date(dt)).format('HH:mm').toUpperCase();
    };
    //#dde0e2
    $scope.get_syl_session_style = function (s, crs) {
        var key = Enumerable.From($scope.new_syllabi.Sessions).Where(function (x) { return x.Key == s.Key; }).FirstOrDefault();
        if (!key)
            return {
                'background': '#e5e8e9'
            };
        else
            return {
                'background': '#83b3b5'
            };
    }
    $scope.click_syl_session = function (s, crs) {
        // console.log(s);
        var key = Enumerable.From($scope.new_syllabi.Sessions).Where(function (x) { return x.Key == s.Key; }).FirstOrDefault();
        if (key)
            $scope.new_syllabi.Sessions = Enumerable.From($scope.new_syllabi.Sessions).Where(function (x) { return x.Key != s.Key; }).ToArray();
        else
            $scope.new_syllabi.Sessions.push(s);
    }
    $scope.popup_syllabus_visible = false;
    $scope.popup_syllabus_title = 'Syllabus';
    $scope.popup_syllabus = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_syllabus"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 510,
        width: 900,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'crsyllabi', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

                        var result = arg.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        // moment($scope.selectedDate).format('YYYY-MM-DDTHH:mm:ss')

                        // var hrs = (new Date($scope.syllabi_hrs)).getTimePartArray();
                        //  var mm = hrs[0] * 60 + hrs[1];

                        //var id = $scope.syllabi_id;
                        // -1 * ($scope.entity.Syllabi.length + 1);

                        //var obj = {
                        //    Id: id, Duration: mm, Title: $scope.syllabi_title, TypeId: $scope.syllabi_type,
                        //    InstructorId: $scope.syllabi_instructor, Instructor: $scope.syllabi_instructor_title
                        //};

                        $scope.new_syllabi.Title = $scope.syllabi_title;
                        $scope.new_syllabi.CourseTypeId = $scope.syllabi_type;
                        $scope.new_syllabi.CurrencyId = $scope.syllabi_instructor;
                        $scope.new_syllabi.Instructor = $scope.syllabi_instructor_title;
                        $scope.new_syllabi.Duration = $scope.syllabi_duration;
                        $scope.new_syllabi.Remark = $scope.syllabi_remark;
                        $scope.new_syllabi.Interval = $scope.syllabi_interval;

                        if ($scope.new_syllabi.Id <= 0) {
                            var obj = JSON.parse(JSON.stringify($scope.new_syllabi));
                            console.log(obj);
                            $scope.entity.Syllabi.push(obj);

                            $scope.syllabi_hrs = null;
                            $scope.syllabi_title = null;
                            $scope.syllabi_remark = null;
                            $scope.syllabi_interval = null;
                            $scope.syllabi_type = null;
                            $scope.syllabi_instructor = null;
                            $scope.syllabi_instructor_title = null;
                            $scope.syllabi_duration = null;

                            $scope.syllabi_id = -1 * ($scope.entity.Syllabi.length + 1);
                            $scope.new_syllabi = {
                                Id: $scope.syllabi_id,
                                Sessions: []
                            };
                        }
                        else {
                            var obj = Enumerable.From($scope.entity.Syllabi).Where(function (x) { return x.Id == $scope.new_syllabi.Id; }).FirstOrDefault();
                            obj.Title = $scope.new_syllabi.Title;
                            obj.TypeId = $scope.new_syllabi.TypeId;
                            obj.InstructorId = $scope.new_syllabi.InstructorId;
                            obj.Instructor = $scope.new_syllabi.Instructor;
                            obj.Duration = $scope.new_syllabi.Duration;
                            obj.Remark = $scope.new_syllabi.Remark;
                            obj.Interval = $scope.new_syllabi.Interval;
                            obj.Sessions = JSON.parse(JSON.stringify($scope.new_syllabi.Sessions));


                            $scope.popup_syllabus_visible = false;


                        }




                        // if (!$scope.dg_syllabi_instance)

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
            $scope.course_sessions = Enumerable.From($scope.entity.Sessions)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return moment(item.DateStart).format('YYYY-MMM-DD'); }, null, (key, g) => {
                    return {
                        Date: key,

                        items: Enumerable.From(g.source).OrderBy('$.DateStart').ToArray(),



                    }
                })

                .ToArray();

        },
        onShown: function (e) {


        },
        onHiding: function () {
            //2024-12-28
            if ($scope.dg_syllabi_instance)
                $scope.dg_syllabi_instance.refresh();

            $scope.popup_syllabus_visible = false;

        },
        bindingOptions: {
            visible: 'popup_syllabus_visible',

            title: 'popup_syllabus_title',

        }
    };

    //close button
    $scope.popup_syllabus.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_syllabus_visible = false;

    };


    $scope.addSyllabus = function () {
        $scope.syllabi_id = -1 * ($scope.entity.Syllabi.length + 1);
        $scope.syllabi_hrs = null;
        $scope.syllabi_title = null;
        $scope.syllabi_remark = null;
        $scope.syllabi_interval = null;
        $scope.syllabi_type = null;
        $scope.syllabi_instructor = null;
        $scope.syllabi_instructor_title = null;
        $scope.syllabi_duration = null;
        $scope.new_syllabi = {
            Id: $scope.syllabi_id,
            Sessions: []
        };
        $scope.popup_syllabus_visible = true;
    };
    $scope.editSyllabus = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_syllabi_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.fill_syllabi(dg_selected);
    }
    $scope.removeSyllabus = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_syllabi_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.Syllabi = Enumerable.From($scope.entity.Syllabi).Where('$.Id!="' + dg_selected.Id + '"').ToArray();
    };
    /////////////////////////////
    $scope.scroll_height = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };


    $scope.session_changed = 0;

    $scope.pop_width = 500;
    $scope.pop_height = 350;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'educationadd', onClick: function (e) {

            //            $rootScope.$broadcast('InitStudyFieldSelect', null);
            //        }
            //    }, toolbar: 'bottom', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }
            //},

            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'educationadd', bindingOptions: { visible: 'btn_visible_education', }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_education_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedStudyFields = Enumerable.From($scope.entity.CourseRelatedStudyFields).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},



            //{
            //    widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype', }, onClick: function (e) {
            //            // $scope.popup_aircrafttype_visible = true;
            //            $rootScope.$broadcast('InitAircraftSelect', null);
            //        }
            //    }
            //},
            ////{ widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype' } }, toolbar: 'bottom' },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype' }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_aircrafttype_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedAircraftTypes = Enumerable.From($scope.entity.CourseRelatedAircraftTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},



            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' }, onClick: function (e) {

            //            $rootScope.$broadcast('InitCourseTypeSelect', null);
            //        }
            //    }, toolbar: 'bottom'
            //},
            //// { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' } }, toolbar: 'bottom' },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'coursetypeadd', bindingOptions: { visible: 'btn_visible_coursetype' }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_coursetype_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedCourseTypes = Enumerable.From($scope.entity.CourseRelatedCourseTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},

            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' }, onClick: function (e) {
            //            $rootScope.$broadcast('InitCourseSelect', null);
            //        }
            //    }, toolbar: 'bottom'
            //},
            ////{ widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' } }, toolbar: 'bottom' },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'courseadd', bindingOptions: { visible: 'btn_visible_course' }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_course_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedCourses = Enumerable.From($scope.entity.CourseRelatedCourses).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},


            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
            //            $rootScope.$broadcast('InitJobGroupSelect', null);
            //        }
            //    }, toolbar: 'bottom'
            //},
            //// { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' } }, toolbar: 'bottom' },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedGroups = Enumerable.From($scope.entity.CourseRelatedGroups).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},


            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
            //            $rootScope.$broadcast('InitEmployeeSelect', null);
            //        }
            //    }, toolbar: 'bottom'
            //},
            //// { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' } }, toolbar: 'bottom' },
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
            //            var dg_selected = $rootScope.getSelectedRow($scope.dg_employee_instance);
            //            if (!dg_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            $scope.entity.CourseRelatedEmployees = Enumerable.From($scope.entity.CourseRelatedEmployees).Where('$.Id!=' + dg_selected.Id).ToArray();
            //        }
            //    }, toolbar: 'bottom'
            //},

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Follow Up', width: 150, onClick: function (e) {
                        if ($scope.entity.Id)
                            $rootScope.$broadcast('InitFollowUp', $scope.entity.Id);
                    }
                }, toolbar: 'bottom',
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
            if ($scope.pop_width > 1300)
                $scope.pop_width = 1300;

            $scope.pop_height = 730; //$(window).height() - 70; //630; //size.height;
            $scope.dg_height = $scope.pop_height - 133;
            $scope.scroll_height = $scope.pop_height - 160;
           

        },
        onShown: function (e) {
            $scope.session_changed = 0;
            $scope.bindTeachers();
            if ($scope.isNew) {
                //$scope.selected_exam = { id: -1, template:[]};
                //ztrnService.get_templates().then(function (response) {
                //    $scope.loadingVisible = false;
                //    //11-17
                //    $scope.selected_exam.template = response.Data;
                //    console.log($scope.selected_exam.tempData);

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                $scope.selected_exam = {
                    "id": null,
                    "course_id": null,
                    "exam_date": null,
                    "exam_date_persian": null,
                    "location_title": null,
                    "location_address": null,
                    "location_phone": null,
                    "remark": null,
                    "status_id": null,
                    "created_by": null,
                    "confirmed_by": null,
                    "created_date": null,
                    "confirmed_date": null,
                    "exam_type_id": null,
                    "signed_by_ins1_date": null,
                    "signed_by_ins2_date": null,
                    "signed_by_director_date": null,
                    "signed_by_staff_date": null,
                    "duration": null,
                    "date_start": null,
                    "date_end_scheduled": null,
                    "date_end_actual": null,
                    "date_start_scheduled": null,
                    "groups": [],
                    "people": [],
                    "template": [
                        { category_id: 1, category: 'Air condition', total: null },
                        { category_id: 2, category: 'APU', total: null },
                        { category_id: 3, category: 'Automatic Flight', total: null },
                        { category_id: 4, category: 'Communication', total: null },
                        { category_id: 5, category: 'Electrical', total: null },
                        { category_id: 6, category: 'Emergency', total: null },
                        { category_id: 7, category: 'Engine', total: null },
                        { category_id: 8, category: 'Fire Protection', total: null },
                        { category_id: 9, category: 'Flight Control', total: null },
                        { category_id: 10, category: 'Flight instrument', total: null },
                        { category_id: 11, category: 'Fuel', total: null },
                        { category_id: 12, category: 'General', total: null },
                        { category_id: 13, category: 'Hydraulic', total: null },
                        { category_id: 14, category: 'Ice&rain Protection', total: null },
                        { category_id: 15, category: 'Landing Gear', total: null },
                        { category_id: 16, category: 'Limitation', total: null },
                        { category_id: 17, category: 'Navigation', total: null },
                        { category_id: 18, category: 'Pneumatic', total: null },
                        { category_id: 19, category: 'Warning System', total: null },
                    ],
                };
            }

            //var dsclient = $rootScope.getClientsDatasource($scope.LocationId);
            //$scope.clientInstance.option('dataSource', dsclient);

            if ($scope.tempData != null) {

                $scope.loadingVisible = true;
                ztrnService.getCourseViewObject($scope.tempData.Id).then(function (response) {
                    $scope.loadingVisible = false;

                    $scope.bind(response.Data.course, response.Data.sessions, response.Data.syllabi, response.Data.exams);

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

            //'toolbarItems[0].visible': 'btn_visible_education',
            'toolbarItems[1].visible': 'IsEditable',


            //'toolbarItems[0].visible': 'btn_visible_education',
            //'toolbarItems[1].visible': 'btn_visible_education',
            //// 'toolbarItems[2].visible': 'btn_visible_education',
            //'toolbarItems[2].visible': 'btn_visible_aircrafttype',
            //'toolbarItems[3].visible': 'btn_visible_aircrafttype',
            ////'toolbarItems[5].visible': 'btn_visible_aircrafttype',
            //'toolbarItems[4].visible': 'btn_visible_coursetype',
            //'toolbarItems[5].visible': 'btn_visible_coursetype',
            //// 'toolbarItems[8].visible': 'btn_visible_coursetype',
            //'toolbarItems[6].visible': 'btn_visible_course',
            //'toolbarItems[7].visible': 'btn_visible_course',
            ////'toolbarItems[11].visible': 'btn_visible_course',
            //'toolbarItems[8].visible': 'btn_visible_group',
            //'toolbarItems[9].visible': 'btn_visible_group',
            ////'toolbarItems[14].visible': 'btn_visible_group',
            //'toolbarItems[10].visible': 'btn_visible_employee',
            //'toolbarItems[11].visible': 'btn_visible_employee',
            ////'toolbarItems[17].visible': 'btn_visible_employee',
            //'toolbarItems[12].visible': 'IsEditable',
        }
    };

    //close button
    $scope.popup_add.toolbarItems[2].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };


    //save button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto = {
            exams: []
        };
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
        dto.CurrencyId = $scope.entity.CurrencyId;
        dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
        dto.Syllabi = Enumerable.From($scope.entity.Syllabi).ToArray();
        $.each(dto.Syllabi, function (_j, _s) {
            _s.Sessions = Enumerable.From(_s.Sessions).Select('$.Key').ToArray();
        })
        //04-30
        dto.HoldingType = $scope.entity.HoldingType;
        dto.Instructor2Id = $scope.entity.Instructor2Id;

        dto.Cost = $scope.entity.Cost;
        dto.session_changed = $scope.session_changed;

        var _groups = []
        $.each($scope.selected_exam.groups, function (_i, _d) {
            _groups.push(_d.Id);
        });

        dto.exams.push({
            id: $scope.selected_exam.id,
            course_id: $scope.selected_exam.course_id,
            exam_date: $scope.selected_exam.exam_date,
            exam_date_persian: null,
            location_title: $scope.selected_exam.location_title,
            location_address: $scope.selected_exam.location_address,
            location_phone: $scope.selected_exam.location_phone,
            duration: $scope.selected_exam.duration,
            template: $scope.selected_exam.template,
            groups: _groups,
            people: $scope.selected_exam.people
        });
        console.log(dto.exams);
        // return;
        $scope.loadingVisible = true;
        ztrnService.saveCourse(dto).then(function (response) {

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
        readOnly: true,
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
    $scope.txt_Cost = {
        min: 0,
        bindingOptions: {
            value: 'entity.Cost',
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



    $scope.txt_sms = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.SMSIns1',
        }
    };
    $scope.txt_smsst1 = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.SMSIns1Status',
        }
    };
    $scope.txt_smsst2 = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.SMSIns2Status',
        }
    };
    $scope.txt_smsdate = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.SMSInsDate',
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
    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.entity.DateStart = new Date(unix);
                    });

                },

            });
            if ($scope.entity.DateStart)
                pd1.setDate(new Date($scope.entity.DateStart.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.entity.DateEnd = new Date(unix);
                    });
                },

            });
            if ($scope.entity.DateEnd)
                pd2.setDate(new Date($scope.entity.DateEnd.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



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
    $scope.bindTeachers = function () {
        trnService.getTeachers().then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_teachers = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.sb_Instructor = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",
        onSelectionChanged: function (e) {

            $scope.entity.Instructor = null;

            if (e.selectedItem) {
                $scope.entity.Instructor = e.selectedItem.Name;


            }

        },
        bindingOptions: {
            value: 'entity.CurrencyId',
            dataSource: 'ds_teachers'

        }

    };
    //04-30
    $scope.sb_Instructor2 = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",

        bindingOptions: {
            value: 'entity.Instructor2Id',
            dataSource: 'ds_teachers'

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
    /////////////////////////
    /////EXAM//////////////////
    $scope.xtabs = [
        { id: 0, title: "Exam 1" },

    ];
    $scope.selected_xtab_index = 0;

    $scope.select_xtab = function (index) {
        $scope.selected_xtab_index = index;
        console.log("Selected tab index:", $scope.selected_xtab_index);
    };

    $scope.add_xtab = function () {
        const newIndex = $scope.xtabs.length;
        $scope.xtabs.push({ id: newIndex, title: `Exam ${newIndex + 1}` });
    };

    $scope.remove_xtab = function () {
        if ($scope.xtabs.length > 0) {
            $scope.xtabs.splice($scope.selected_xtab_index, 1);
            $scope.selected_xtab_index = Math.max(0, $scope.selected_xtab_index - 1);
        }
    };


    $scope._exam_date = null;
    $scope._exam_time = null;
    $scope.exam_date_scheduled = {
        type: "date",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'selected_exam.exam_date',

        }
    };

    $scope.exam_time_scheduled = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HH:mm",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'selected_exam.exam_date',

        }
    };
    $scope.exam_duration = {
        min: 1,
        bindingOptions: {
            value: 'selected_exam.duration',
        }
    };
    $scope.exam_location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'selected_exam.location_title',
        }
    };
    $scope.exam_location_address = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'selected_exam.location_address',
        }
    };
    $scope.exam_location_phone = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'selected_exam.location_phone',
        }
    };
    $scope.removeGroup = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.JobGroups = Enumerable.From($scope.entity.JobGroups).Where('$.Id!=' + dg_selected.Id).ToArray();


    };
    $scope.addGroup = function () {
        $rootScope.$broadcast('InitJobGroupSelectSimple', null);
    };

    $scope.dg_exam_group_columns = [

        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_exam_group_selected = null;
    $scope.dg_exam_group_instance = null;
    $scope.dg_exam_group = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        noDataText: '',
        showColumnHeaders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },


        columnAutoWidth: false,
        columns: $scope.dg_exam_group_columns,
        onContentReady: function (e) {
            if (!$scope.dg_exam_group_instance)
                $scope.dg_exam_group_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_exam_group_selected = null;
            }
            else
                $scope.dg_exam_group_selected = data;


        },
        height: 250,
        bindingOptions: {

            dataSource: 'selected_exam.groups',
            // height: 'dg_height',
        },
        // dataSource:ds

    };
    $scope.$on('onJobGroupSelectSimpleHide', function (event, prms) {


        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.selected_exam.groups).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                var jg = { Id: _d.Id, Title: _d.Title, FullCode: _d.FullCode };

                $scope.selected_exam.groups.push(jg);
            }
        });
        $scope.dg_exam_group_instance.refresh();
    });
    $scope.dg_exam_people_columns = [
        { dataField: "Title", caption: "NID", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
        { dataField: "Title", caption: "Name", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },

        // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_exam_people_selected = null;
    $scope.dg_exam_people_instance = null;
    $scope.dg_exam_people = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        noDataText: '',
        showColumnHeaders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },


        columnAutoWidth: false,
        columns: $scope.dg_exam_people_columns,
        onContentReady: function (e) {
            if (!$scope.dg_exam_people_instance)
                $scope.dg_exam_people_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_exam_people_selected = null;
            }
            else
                $scope.dg_exam_people_selected = data;


        },
        height: 250,
        bindingOptions: {

            dataSource: 'selected_exam.people',
            // height: 'dg_height',
        },
        // dataSource:ds

    };


    $scope.dg_exam_template_columns = [
        { dataField: "category", caption: "Category", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        { dataField: "total", caption: "Count", allowResizing: true, alignment: "center", dataType: 'number', allowEditing: true, width: 150 },

        // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_exam_template_selected = null;
    $scope.dg_exam_template_instance = null;
    $scope.dg_exam_template = {
        editing: {
            allowUpdating: true,
            mode: 'cell',
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        noDataText: '',
        showColumnHeaders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        summary: {
            totalItems: [
                {
                    column: "total",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                }
            ]
        },
        columnAutoWidth: false,
        columns: $scope.dg_exam_template_columns,
        onContentReady: function (e) {
            if (!$scope.dg_exam_template_instance)
                $scope.dg_exam_template_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_exam_template_selected = null;
            }
            else
                $scope.dg_exam_template_selected = data;


        },
        height: 470,
        bindingOptions: {

            dataSource: 'selected_exam.template',
            // height: 'dg_height',
        },
        // dataSource:ds

    };
    $scope.btn_generate = {
        text: 'Generate Questions',
        type: 'success',
        icon: 'add',
        width: '100%',

        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.loadingVisible = true;
            ztrnService.generateQuestions({ exam_id: $scope.selected_exam.id }).then(function (response) {

                //$scope.clearEntity();


                General.ShowNotify(Config.Text_SavedOk, 'success');




                $scope.loadingVisible = false;




            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.popup_questions_visible = false;

    $scope.popup_questions = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_questions"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 830,
        width: 1300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_questions_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {

        },
        onShowing: function (e) {


        },
        onShown: function (e) {

            if ($scope.dg_questions_instance)
                $scope.dg_questions_instance.refresh();
        },
        onHiding: function () {
            //2024-12-28
            if ($scope.dg_questions_instance)
                $scope.dg_questions_instance.refresh();

            $scope.popup_questions_visible = false;

        },
        title: 'Questions',
        bindingOptions: {
            visible: 'popup_questions_visible',



        }
    };

    $scope.dg_questions_columns = [
        { dataField: "category", caption: "Category", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc", width: 150 },

        { dataField: "english_title", caption: "Question", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: "asc", minWidth: 600 },

        { dataField: 'correct_answer_title', caption: 'Answer', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, encodeHtml: false, minWidth: 400, },

    ];
    $scope.dg_questions_selected = null;
    $scope.dg_questions_instance = null;
    $scope.dg_questions = {
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
        columns: $scope.dg_questions_columns,
        onContentReady: function (e) {
            if (!$scope.dg_questions_instance)
                $scope.dg_questions_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_questions_selected = null;
            }
            else
                $scope.dg_questions_selected = data;


        },
        summary: {
            totalItems: [


                {
                    column: "category",
                    summaryType: "count",
                    customizeText: function (data) {
                        return "Count: " + data.value;
                    }
                },



            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "MissionTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Misson;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTimeTotal;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                }




            }
        },
        height: 700,
        bindingOptions: {

            dataSource: 'ds_questions',
            // height: 'dg_height',
        },
        // dataSource:ds

    };
    $scope.btn_questions_list = {
        text: 'Questions List',
        type: 'default',
        icon: 'add',
        width: '99%',

        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.loadingVisible = true;
            trnService.getExamQuestions($scope.selected_exam.id).then(function (response) {
                console.log(response);
                $scope.loadingVisible = false;
                $scope.ds_questions = response.questions;
                $scope.popup_questions_visible = true;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }

    };
    ///////////////////////////
    $scope.tempData = null;
    $scope.$on('InitAddCourse', function (event, prms) {


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