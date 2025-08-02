'use strict';
app.controller('trnexamController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', 'ztrnService', 'atoService', '$window', '$compile', '$interval'
    , function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, ztrnService, atoService, $window, $compile, $interval) {
        $scope.prms = $routeParams.prms;
        $scope.IsEditable = $rootScope.HasTrainingAdmin();
        $scope.windowHeight = $(window).height();

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
        ///////////////////////
        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width: 120,

            bindingOptions: {},
            onClick: function (e) {
                $scope.build($scope.date);
                // $scope.$broadcast('getFilterQuery', null);
                $scope.doRefresh = true;
                $scope.bind();
            }

        };
        $scope.btn_people = {
            text: 'Follow Up',
            type: 'default',
            icon: 'group',
            width: 200,
            onClick: function (e) {

               
                    $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                    if (!$scope.dg_selected) {
                        General.ShowNotify(Config.Text_NoRowSelected, 'error');
                        return;
                    }
                    
                    $scope.selected_exam = $scope.dg_selected;
                    

                    $scope.popup_people_visible = true;
               


            }

        };
        $scope.btn_new = {
            text: 'New',
            type: 'default',
            icon: 'plus',
            width: 120,
            onClick: function (e) {

                $scope.isNew = true;
                $scope.popup_add_visible = true;
            }

        };

        $scope.btn_edit = {
            text: 'Edit/View',
            type: 'default',
            icon: 'edit',
            width: 150,

            onClick: function (e) {

                
                    $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                    if (!$scope.dg_selected) {
                        General.ShowNotify(Config.Text_NoRowSelected, 'error');
                        return;
                    }
                    var data = $scope.dg_selected;
                    
                

            }

        };

        $scope.btn_delete = {
            text: 'Delete',
            type: 'danger',
            icon: 'clear',
            width: 120,

            onClick: function (e) {


                if ($scope.active_header == '_list_header') {
                    $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                    if (!$scope.dg_selected) {
                        General.ShowNotify(Config.Text_NoRowSelected, 'error');
                        return;
                    }

                    General.Confirm(Config.Text_DeleteConfirm, function (res) {
                        if (res) {

                            var dto = { Id: $scope.dg_selected.Id, };
                            $scope.loadingVisible = true;
                            trnService.deleteCourse(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                if (response.IsSuccess) {
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                    $scope.doRefresh = true;
                                    $scope.bind();
                                    $scope.build($scope.date);
                                }
                                else
                                    General.ShowNotify(response.Errors[0], 'error');




                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }
                    });
                }
                else {
                    //07-09
                    if ($scope.schedule_cid == -1) {
                        General.ShowNotify(Config.Text_NoRowSelected, 'error');
                        return;
                    }
                    var id = $scope.schedule_cid;



                    General.Confirm(Config.Text_DeleteConfirm, function (res) {
                        if (res) {

                            var dto = { Id: $scope.schedule_cid, };
                            $scope.loadingVisible = true;
                            trnService.deleteCourse(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                if (response.IsSuccess) {
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                    $scope.doRefresh = true;
                                    $scope.bind();
                                    $scope.build($scope.date);
                                }
                                else
                                    General.ShowNotify(response.Errors[0], 'error');




                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }
                    });



                }




            }
        };
        //////////////////////////
        $scope.dg_columns = [
            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },
            {
                dataField: "StatusId", caption: '',
                width: 55,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: function (container, options) {
                    var fn = 'pending-24';
                    switch (options.value) {
                        case 1:
                            fn = 'pending-24';
                            break;
                        case 4:
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
             
            //{ dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', },
            { dataField: 'No', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "desc" },
           
            { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

            //{ dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
            { dataField: 'exam_date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120 },
            {
                caption: 'Start', alignment: 'center', columns: [
                    { dataField: 'date_start', caption: 'A/D', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd HH:mm' },
                    { dataField: 'PDateStart', caption: 'P/E', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120 },
                ]
            },
            {
                caption: 'End', alignment: 'center', columns: [
                    { dataField: 'date_end_actual', caption: 'A/D', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd HH:mm' },
                    { dataField: 'PDateEnd', caption: 'P/E', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120 },
                ]
            },

            { dataField: 'course_no', caption: 'Course No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left' },
            { dataField: 'attendants', caption: 'P/S', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
            { dataField: 'course_title', caption: 'Course', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left' },

        ];

        $scope.dg_selected = null;
        $scope.dg_instance = null;
        $scope.dg_ds = null;
        $scope.dg_height = $(window).height() - 155;
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
            // height: $(window).height() - 155,

            columns: $scope.dg_columns,
            onContentReady: function (e) {
                if (!$scope.dg_instance)
                    $scope.dg_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_selected = null;
                    $scope.selected_exam = null;
                }
                else {
                    $scope.dg_selected = data;
                    $scope.selected_exam = data;
                    
                }



            },
            onCellClick: function (e) {
                //7-27
                var clmn = e.column;
                var field = clmn.dataField;

                if (clmn.name == "AttForm" && e.data.AttForm)
                    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
            },
            bindingOptions: {
                dataSource: 'ds_exams',
                height: 'dg_height',
            }
        };

        //////////////////////////
        $scope.selected_exam = null;
        $scope.popup_add_visible = false;
        $scope.popup_add_title = 'New';




        $scope.popup_add = {

            fullScreen: false,
            showTitle: true,

            toolbarItems: [
                

                
                { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'addexam', bindingOptions: {} }, toolbar: 'bottom' },
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

                $scope.pop_height = 750; //$(window).height() - 70; //630; //size.height;
                $scope.dg_exam_template_height = $scope.pop_height - 190;
                $scope.scroll_height = $scope.pop_height - 160;


            },
            onShown: function (e) {
                
                
                if ($scope.isNew) {
                    
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

                

               

            },
            onHiding: function () {

               // $scope.clearEntity();

                $scope.popup_add_visible = false;

            },
            onHidden: function () {
                
                 
            },
            bindingOptions: {
                visible: 'popup_add_visible',
                width: 'pop_width',
                height: 'pop_height',
                title: 'popup_add_title',

                
               // 'toolbarItems[1].visible': 'IsEditable',


                
            }
        };

        //close button
        $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

            $scope.popup_add_visible = false;
        };

        $scope.popup_add.toolbarItems[0].options.onClick = function (e) {

            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
        }

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
                height: 'dg_exam_template_height',
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
        $scope.exam_remark = {
            hoverStateEnabled: false,
            bindingOptions: {
                value: 'selected_exam.remark',
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

        $scope.sb_courses = {

            showClearButton: true,
            searchEnabled: true,
            searchExpr: ["Title"],
            //valueExpr: "Id",
            displayExpr: "Title",
            itemTemplate: function (data) {
                return "<div>"
                    + "<div class='tmpl-col-left'>" + data.Title + "(" + data.Attendants + ")" + "</div>"
                    + "<div class='tmpl-col-right'>" + data.Id + "</div>"


                    + "</div>";
            },
            onSelectionChanged: function (e) {


                if (e.selectedItem) {
                    $scope.source_course = e.selectedItem;
                    //$scope.certype = e.selectedItem.CertificateType;

                    //$scope.ctgroups = e.selectedItem.JobGroups;


                    //war
                    //ztrnService.getCoursePeopleNames(e.selectedItem.Id).then(function (response2) {

                        
                    //    $scope.source_course = e.selectedItem.Id;

                    //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                }

            },
            bindingOptions: {
                dataSource: 'dg_ds',

            }

        };
        $scope.date_DateStart = {
            width: '100%',
            type: 'date',
            displayFormat: $rootScope.DateBoxFormat,
            bindingOptions: {
                value: 'source_course.DateStart',

            }
        };
        $scope.date_DateEnd = {
            width: '100%',
            type: 'date',
            displayFormat: $rootScope.DateBoxFormat,
            bindingOptions: {
                value: 'source_course.DateEnd',

            }
        };
        $scope.txt_instructor = {
            hoverStateEnabled: false,
            bindingOptions: {
                value: 'source_course.Instructor',
            }
        };
        $scope.txt_instructor2 = {
            hoverStateEnabled: false,
            bindingOptions: {
                value: 'source_course.Instructor2',
            }
        };


        $scope.popup_people_visible = false;
        $scope.popup_people = {
            height: 800,
            width: $(window).width() - 200,
            fullScreen: true,
            showTitle: true,
            title: 'Follow Up',
            toolbarItems: [

                 
                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                            $scope.popup_people_visible = false;
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

                $scope.selectedTabFolderIndex = 0;
               // $scope.preparePeopleGrid();

            },
            onHidden: function () {
                //$scope.dg_employees_instance.refresh();
            },

            onHiding: function () {
                //clearSelection()

                 
                $scope.popup_people_visible = false;
                
            },
            bindingOptions: {
                visible: 'popup_people_visible',
                

            }
        };


        $scope.tabs_folder_options = {


            onItemClick: function (arg) {
                //$scope.selectedTab = arg.itemData;

            },
            bindingOptions: {

                dataSource: { dataPath: "tabs_folder", deep: true },
                selectedIndex: 'selectedTabFolderIndex'
            }

        };
        var tabs_folder = [
            // { text: "EXAM", id: 'exam', visible_btn: false },
           // { text: "PARTICIPANTS", id: 'participants', visible_btn: false },
            { text: "EXAM", id: 'exam', visible_btn: false },
            // { text: "SYLLABI", id: 'syllabi', visible_btn: false },



        ];
        $scope.tabs_folder = tabs_folder;
        $scope.selectedTabFolderIndex = -1;
        $scope.$watch("selectedTabFolderIndex", function (newValue) {

            try {
                $scope.selectedTabFolder = tabs_folder[newValue];
                $('.tabfolder').hide();
                $('.' + $scope.selectedTabFolder.id).fadeIn(100, function () {


                });

              //  $scope.dg_people_instance.repaint();
              //  $scope.dg_syllabi_instance.repaint();

            }
            catch (e) {

            }

        });
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
        $scope.formatDateTime = function (dt) {
            if (!dt)
                return "";
            return moment(new Date(dt)).format('YYYY-MMM-DD HH:mm').toUpperCase();
        };

        $scope.formatDateTime_temp = function (dt) {
            // console.log('date start', dt);
            if (!dt)
                return "";
            return moment(new Date(dt)).format('YYYY-MMM-DD HH:mm').toUpperCase();
        };
        $scope.exam_pause_click = function (st) {
            $scope.selected_exam.is_running = 0;

            $scope.exam_pause_caption = 'PAUSED';

            $scope.exam_resume_caption = $scope.exam_pause_caption == 'PAUSED' ? 'RESUME' : null;
        }
        $scope.exam_resume_click = function (st) {
            $scope.selected_exam.is_running = 1;
            $scope.exam_pause_caption = 'PAUSE';
            $scope.exam_resume_caption = $scope.exam_pause_caption == 'PAUSED' ? 'RESUME' : null;
        }

        $scope.exam_status_click = function (st) {
            if (st == 1) {
                $scope.selected_exam.status_id = 1;
                $scope.selected_exam.date_end_actual = null;
                $scope.selected_exam.date_start = new Date();
                $scope.exam_start_caption = 'STARTED';
                $scope.exam_finish_caption = "FINISH";
                ztrnService.set_exam_status({ exam_id: $scope.selected_exam.id, status: $scope.selected_exam.status_id }).then(function (response) {


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            if (st == 2) {
                $scope.selected_exam.status_id = 2;
                $scope.selected_exam.date_end_actual = new Date();
                $scope.exam_finish_caption = "FINISHED";
                $scope.exam_start_caption = 'START';
                ztrnService.set_exam_status({ exam_id: $scope.selected_exam.id, status: $scope.selected_exam.status_id }).then(function (response) {


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }
            //switch ($scope.selected_exam.status_id) {
            //    case 0:
            //        $scope.selected_exam.status_id = 1;
            //        $scope.selected_exam.date_end_actual = null;
            //        $scope.selected_exam.date_start = new Date();
            //        //addMinutes
            //        $scope.exam_btn_caption = "STARTED";
            //        ztrnService.set_exam_status({ exam_id: $scope.selected_exam.id, status: $scope.selected_exam.status_id }).then(function (response) {


            //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //        break;
            //    case 1:
            //        $scope.selected_exam.status_id = 2;
            //        $scope.selected_exam.date_end_actual = new Date();
            //        $scope.exam_btn_caption = "FINISHED";
            //        ztrnService.set_exam_status({ exam_id: $scope.selected_exam.id, status: $scope.selected_exam.status_id }).then(function (response) {


            //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //        break;
            //    case 2:
            //        $scope.selected_exam.status_id = 0;
            //        $scope.selected_exam.date_end_actual = null;
            //        $scope.selected_exam.date_start = null;
            //        $scope.exam_btn_caption = "SCHEDULED";
            //        ztrnService.set_exam_status({ exam_id: $scope.selected_exam.id, status: $scope.selected_exam.status_id }).then(function (response) {


            //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //        break;
            //    default:
            //        break;
            //}
        }
        $scope.get_person_result_style = function (data) {
            if (data.result == 'PASSED' && data.status_id == 2) {
                return {
                    background: '#d9f2df'
                };
            }
            else if (data.result == 'FAILED' && data.status_id == 2) {
                return {
                    background: '#ffe6e9'
                };
            }

            else return {};

        }
        var timer;

        $scope.startTimer = function () {
            if (angular.isDefined(timer)) return;

            timer = $interval(function () {
                $scope.refresh_summary();
            }, 5000); // 10 seconds interval
        };

        // Method to stop the timer
        $scope.stopTimer = function () {
            if (angular.isDefined(timer)) {
                $interval.cancel(timer);
                timer = undefined;

            }
        };
        $scope.$on('$destroy', function () {
            $scope.stopTimer();
        });

        $scope.exam_btn_caption = "";
        $scope.exam_finish_btn_class = function () {
            if (!$scope.selected_exam)
                return "";
            switch ($scope.selected_exam.status_id) {
                case 0:
                case 1:
                    return "exam_scheduled";
                case 2:
                    return "exam_done";
                default:
                    return "";
            }
        };
        $scope.exam_start_btn_class = function () {
            if (!$scope.selected_exam)
                return "";
            switch ($scope.selected_exam.status_id) {
                case 0:
                    return "exam_scheduled";
                case 1:
                case 2:
                    return "exam_started";

                default:
                    return "";
            }
        };

        $scope.bind_course =function() {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: /*serviceBaseTRN*/ zapitrn + 'api/course/query/',
                    key: "Id",
                    //version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                // sort: ['DatePay', 'Amount'],

            };
        }
        $scope.bind = function () {
            ztrnService.get_exams().then(function (response) {
                $scope.ds_exams = response.Data;
                //  console.log($scope.person_exam_detail);


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Exams';
            $('.trnexam').fadeIn();
        }
        //////////////////////////////////////////

        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                $scope.bind_course();
                $scope.bind();
                
              //  $scope.bind();
            }, 500);

            




        });


        ///end


    }]);