'use strict';
app.controller('coursepersonController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', '$window', '$compile', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window, $compile) {
    $scope.prms = $routeParams.prms;
    $scope.IsEditable = $rootScope.HasTrainingAdmin();
    //////////////////////////////////
    $scope.active_header = '_schedule_header';
    $scope._header_click = function (h, tab) {
        $('._xheader').removeClass('selected');
        $('.' + h).addClass('selected');
        $scope.active_header = h;
        $('._header_child').hide();
        $scope.dg_height = $scope.dg_height - 1 ;
        $('.' + tab).fadeIn(300, function () {
           // $scope.dg_height = $scope.dg_height - 10;
            $scope.dg_height = $scope.dg_height + 1;
        }); 
    };
    //////////////////////////////////
    var tabs = [
        { text: "Schedule", id: '_schedule', visible_btn: false },
        { text: "List", id: '_list', visible_btn: false },
        

    ];

    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
             
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            $scope.dg_instance.repaint();
            //$scope.dg_education_instance.repaint();
            //$scope.dg_file_instance.repaint();
            //$scope.dg_exp_instance.repaint();
            //$scope.dg_rating_instance.repaint();
            //$scope.dg_aircrafttype_instance.repaint();

            



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


    ////SCHEDULE ///////////////////////
    $scope.getMainStyle = function () {
        var h = $(window).height() - 140;
        return {
            height: h + 'px'
        }
    }
    $scope.getScrollStyle = function () {
        return { height: ($(window).height() - 210).toString() + 'px'  };
    };





    $scope.nextMonth = function (n) {
        $scope.date = $scope.date.addMonths(n);
        $scope.build($scope.date);
    };

    $scope.caption = "";

    $scope.date = new Date();
    $scope.month = null;
    $scope.year = null;
    $scope.calendar = [];
    var GMonthDataSource = [
        { Id: 0, Title: 'January' },
        { Id: 1, Title: 'February' },
        { Id: 2, Title: 'March' },
        { Id: 3, Title: 'April' },
        { Id: 4, Title: 'May' },
        { Id: 5, Title: 'June' },
        { Id: 6, Title: 'July' },
        { Id: 7, Title: 'August' },
        { Id: 8, Title: 'September' },
        { Id: 9, Title: 'October' },
        { Id: 10, Title: 'November' },
        { Id: 11, Title: 'December' },

    ];
    //alert($scope.month + '   ' + $scope.year);
    $scope.build = function (_date) {
        var _ch = ($(window).height() - 190) * 1.0 / 6.4;


        $scope.calendar = [];
        try {
            var today = moment(new Date()).format('YYYY-MM-DD');
            $('.day-wrapper').html('');
            $('.day-wrapper').hide();
            $scope.date = new Date(_date);
            $scope.month = $scope.date.getMonth();
            $scope.year = $scope.date.getFullYear();
            // alert($scope.year);
            $scope.caption = GMonthDataSource[$scope.month].Title + ' ' + $scope.year;
            // alert($scope.caption);
            var day = new Date($scope.year, $scope.month, 1);
            var lastDay = (new Date($scope.year, $scope.month + 1, 0)).getDate();
            var dayWeek = day.getDay();
            var dayIndex = dayWeek;
            var dayMonth = day.getDate();

            var c = dayIndex - 1;
            var inactiveBack = (new Date($scope.year, $scope.month, 0)).getDate();
            var inactiveBackYear = (new Date($scope.year, $scope.month, 0)).getFullYear();
            var inactiveBackMonth = (new Date($scope.year, $scope.month, 0)).getMonth();
            var inactiveForward = (new Date($scope.year, $scope.month + 1, 1)).getDate();
            var inactiveForwardYear = (new Date($scope.year, $scope.month + 1, 1)).getFullYear();
            var inactiveForwardMonth = (new Date($scope.year, $scope.month + 1, 1)).getMonth();

            while (c >= 0) {
                var data_date = inactiveBackYear + '-' + pad(Number(inactiveBackMonth) + 1) + '-' + pad(Number(inactiveBack));
                var isToday = data_date == today ? ' today' : '';
                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                    + "<div class='day-caption _inactive'>" + inactiveBack + "</div>"
                    + "</div>";
                $('#d' + c).html(html);
                $scope.calendar.push({ cell: 'd' + c, date: data_date });
                inactiveBack--;
                c--;
            }

            while (dayMonth <= lastDay) {

                var data_date = $scope.year + '-' + pad(Number($scope.month) + 1) + '-' + pad(Number(dayMonth));
                var isToday = data_date == today ? ' today' : '';

                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                    + "<div class='day-caption'>" + dayMonth + "</div>"
                    //+ "<div class='event flight'><i class='fas fa-plane'></i><span>4<span></div>"
                    //+ "<div class='event office'><span>OFFICE<span></div>"
                    + "</div>";
                //if (dayMonth == 12)
                //    html = "<div class='day-wrapper'>"
                //        + "<div class='day-caption'>" + dayMonth + "</div>"
                //        + "<div class='event flight'><i class='fas fa-plane'></i><span>4<span></div>"
                //        + "<div class='event office'><span>OFFICE<span></div>"
                //        + "</div>";
                $scope.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                $('#d' + dayIndex).html(html);

                dayMonth++;
                dayIndex++;
            }

            while (dayIndex <= 41) {
                var data_date = inactiveForwardYear + '-' + pad(Number(inactiveForwardMonth) + 1) + '-' + pad(Number(inactiveForward));
                var isToday = data_date == today ? ' today' : '';
                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                    + "<div class='day-caption _inactive'>" + inactiveForward + "</div>"
                    + "</div>";
                $('#d' + dayIndex).html(html);
                $scope.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                dayIndex++;
                inactiveForward++;
            }
            $scope.isCalVisible = true;
            $('.day-wrapper').show();

             $scope.fill();

        }
        catch (e) { alert(e); }



    };

    $scope.schedule_cid = -1;
    $scope.session_click = function (course_id) {
        //alert(course_id);
        $('._session').removeClass('selected');
        $('._cid' + course_id).addClass('selected');
        $scope.schedule_cid = course_id;
    };
    $scope.expired_click = function (m, n) {
        var row = $scope.schedule_expired.Items[m].Items[n];
        console.log(row);
        //DateExpire
        $scope.popup_day_title = row.CertificateType;
        $scope.popup_day_date = row.DateExpire;
        $scope.popup_day_ds = row.Items[0].employees;
        $scope.popup_day_visible = true;
    }
    $scope.get_day_container_style = function () {
        var h = $(window).height() - 250;
        return {
            height: h + 'px',
        }
    }
    $scope.momentDate = function (date) {
        if (!date)
            return '-';
        return moment(date).format('YYYY-MMM-DD');
    };
    $scope.fill = function () {
       // alert($scope.date);
        var y = moment(new Date($scope.date)).format("YYYY");
        var m = moment(new Date($scope.date)).format("MM");
        trnService.getTrnSchedule(y, m).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $.each(response.sessions, function (_i, _d) {
                $.each(_d.Items, function (_j, _c) {
                    var _element = "<div class='_event _session  _cid" + _c.CourseId+"' ng-click='session_click(" + _c.CourseId+")'>"
                        + "<div class='_title'>" + (_c.Title.length <= 25 ? _c.Title : _c.Title.substr(0, 25) + "...") + "</div>"
                        + "<div style='font-size:12px;'>" + moment(_c.DateStart).format('HH:mm') + " - " + moment(_c.DateEnd).format('HH:mm')+"</div>"
                        + "</div>";
                    var cell = Enumerable.From($scope.calendar).Where(function (x) { return x.date == moment(_d.Date).format('YYYY-MM-DD'); }).FirstOrDefault();
                    if (cell) {
                        $('#' + cell.cell).find('.day-wrapper').append(_element);
                        console.log(_d.Date);
                    }
                });
               
            });



            $.each(response.expired.Items, function (_i, _d) {
                _d.id = _i;
                $.each(_d.Items, function (_j, _c) {
                    var _element = "<div class='_event _expired  _exid" + _d.id + " _itemid"+_j+"' ng-click='expired_click(" + _d.id+","+_j + ")'>"
                        + "<div class='_title'>" + _c.CertificateType+"("+_c.Count+")" + "</div>"
                         
                        + "</div>";
                    var cell = Enumerable.From($scope.calendar).Where(function (x) { return x.date == moment(_d.Date).format('YYYY-MM-DD'); }).FirstOrDefault();
                    if (cell) {
                        $('#' + cell.cell).find('.day-wrapper').append(_element);
                        console.log(_d.Date);
                    }
                });

            });
            $scope.schedule_expired = response.expired;

            $compile($('._event'))($scope);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    /////////////////////////////
    $scope.popup_day_date = null;
    $scope.popup_day_title = null;
    $scope.popup_day_ds = [];
    $scope.popup_day_visible = false;
    $scope.popup_day = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_emp"
        },
        shading: true,
        title: 'Details',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 100,
        width: $(window).width() - 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_day_visible = false;

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



        },
        onHiding: function () {
            $scope.popup_day_date = null;
            $scope.popup_day_ds = [];
            $scope.popup_day_visible = false;

        },
        bindingOptions: {
            visible: 'popup_day_visible',



        }
    };

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
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
    $scope.selectedCourse = null;
    $scope.selected_intervals = [];
    $scope.btn_people = {
        text: 'Follow Up',
        type: 'default',
        icon: 'group',
        width: 200,
        onClick: function (e) {

            if ($scope.active_header == '_list_header') {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                $scope.courseEmployee.Id = $scope.dg_selected.Id;
                $scope.selectedCourse = $scope.dg_selected;
                $scope.selected_intervals = [];
                if ($scope.selectedCourse.Intervals) {
                    var p1 = $scope.selectedCourse.Intervals.split('-');
                    $.each(p1, function (_i, _d) {
                        var p2 = _d.split('_');
                        $scope.selected_intervals.push({ title: p2[0], code: p2[1], value: p2[2] });
                    });
                }

                $scope.popup_people_visible = true;
            }
            else {
                //07-09
                if ($scope.schedule_cid == -1) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                $scope.courseEmployee.Id = $scope.schedule_cid;
                
                trnService.getCourseView($scope.schedule_cid).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.selectedCourse = response.Data;
                    $scope.selected_intervals = [];
                    if ($scope.selectedCourse.Intervals) {
                        var p1 = $scope.selectedCourse.Intervals.split('-');
                        $.each(p1, function (_i, _d) {
                            var p2 = _d.split('_');
                            $scope.selected_intervals.push({ title: p2[0], code: p2[1], value: p2[2] });
                        });
                    }

                    $scope.popup_people_visible = true;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


               
            }





            

        }

    };


    $scope.btn_notify = {
        text: 'Notify Teacher(s)',
        type: 'default',

        width: 250,
        onClick: function (e) {

            if ($scope.active_header == '_list_header') {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var id = $scope.dg_selected.Id;


                $scope.loadingVisible = true;
                trnService.courseNotifyTeachers(id).then(function (response) {
                    $scope.loadingVisible = false;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                //07-09
                if ($scope.schedule_cid == -1) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var id = $scope.schedule_cid;

                $scope.loadingVisible = true;
                trnService.courseNotifyTeachers(id).then(function (response) {
                    $scope.loadingVisible = false;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }







           

        }

    };
    $scope.btn_syncroster = {
        text: 'Sync. Teacher(s) Roster',
        type: 'default',

        width: 250,
        onClick: function (e) {



            if ($scope.active_header == '_list_header') {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var id = $scope.dg_selected.Id;


                $scope.loadingVisible = true;
                trnService.saveSessionsSyncTeachersGet(id).then(function (response) {
                    $scope.loadingVisible = false;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                //07-09
                if ($scope.schedule_cid == -1) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var id = $scope.schedule_cid;

                $scope.loadingVisible = true;
                trnService.saveSessionsSyncTeachersGet(id).then(function (response) {
                    $scope.loadingVisible = false;


                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }



           

        }

    };
    $scope.btn_edit = {
        text: 'Edit/View',
        type: 'default',
        icon: 'edit',
        width: 150,

        onClick: function (e) {

            if ($scope.active_header == '_list_header') {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if (!$scope.dg_selected) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var data = $scope.dg_selected;
                $rootScope.$broadcast('InitAddCourse', data);
            }
            else {
                //07-09
                if ($scope.schedule_cid == -1) {
                    General.ShowNotify(Config.Text_NoRowSelected, 'error');
                    return;
                }
                var data = { Id: $scope.schedule_cid};
                $rootScope.$broadcast('InitAddCourse', data);
            }
            
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
            $scope.build($scope.date);
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
    //////////////////////////////////b
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
        {
            dataField: "HoldingType", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = 'offlineclass';
                if (options.value == 'Online Class')
                    fn = 'onlineclass';

                $("<div>")
                    .append("<img style='width:30px' src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
        {
            dataField: "AttForm", caption: '',
            width: 55,
            name: 'AttForm',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value ? 'attform' : 'certification-document';
                if (options.value)
                    $("<div>")
                        .append("<img class='cell-img' src='content/images/" + fn + ".png' />")
                        .appendTo(container);
                else
                    $("<div>").appendTo(container);
            },
            fixed: true, fixedPosition: 'left',

        },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },

        { dataField: 'Interval', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70 },
        { dataField: 'CalendarType', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },

        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'JobGroups', caption: 'Groups', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },

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
    $scope.dg_height = $(window).height() - 155;
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
        //height: $(window).height() - 155,

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
        onCellClick: function (e) {
            //7-27
            var clmn = e.column;
            var field = clmn.dataField;

            if (clmn.name == "AttForm" && e.data.AttForm)
                $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_ds',
            height:'dg_height'
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
                        $scope.courseStatus.People.push($scope.selectedEmployees[0].PersonId);// Enumerable.From($scope.selectedEmployees).Select("$.PersonId").ToArray();

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
                                _d.StatusId = $scope.courseStatus.StatusId != 72 ? $scope.courseStatus.StatusId : null;
                                _d.Status = $scope.courseStatus.Status != 72 ? $scope.courseStatus.Status : null;
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
    //training

    $scope.dg_people_columns = [


    ];
    $scope.dg_people_height = 700;
    $scope.dg_people_selected = null;
    $scope.dg_people_instance = null;
    $scope.dg_people_ds = [];
    $scope.dg_people = {
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
        selection: { mode: 'multiple' },
        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,

        height: 640,
        columnAutoWidth: false,

        columns: $scope.dg_people_columns,
        onContentReady: function (e) {
            if (!$scope.dg_people_instance)
                $scope.dg_people_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //nasiri
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_people_selected = null;
                $scope.IsUploadVisible = false;
            }
            else {
                //soos
                $scope.dg_people_selected = data;
                $scope.IsUploadVisible = $scope.IsEditable && data.CoursePeopleStatusId == 1;
                var tid = data.CertificateTypeId ? data.CertificateTypeId : -1;
                console.log('selected', data);
                $scope.upload_url = serviceBaseTRN + 'api/upload/certificate/' + data.Id + '/' + data.PersonId + '/' + tid + '/' + $scope.selectedCourse.Id;
            }


        },
        onCellClick: function (e) {
            //7-27
            var clmn = e.column;
            var field = clmn.dataField;
            if (field.indexOf("Session") != -1 && field.indexOf("SessionAttendance") == -1) {
                var obj = { pid: e.data.PersonId, cid: $scope.selectedCourse.Id, sid: field };
                $scope.loadingVisible = true;
                trnService.saveCourseSessionPres(obj).then(function (response) {
                    $scope.loadingVisible = false;
                    e.data[field] = !e.data[field];

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            }
            if (clmn.name == "ImgUrl" && e.data.ImgUrl)
                $window.open($rootScope.clientsFilesUrl + e.data.ImgUrl, '_blank');
        },
        onCellPrepared: function (e) {
            if (e.column.name != "updateresult")
                return;
            if (e.data && e.data.CoursePeopleStatusId == 0) {

                e.cellElement.css('background', '#ffad99');
            }
            if (e.data && e.data.CoursePeopleStatusId == 1) {

                e.cellElement.css('background', '#99ffd6');
            }

        },
        bindingOptions: {
            dataSource: 'dg_people_ds', //'dg_employees_ds',

        }
    };

    //////////////////////////

    $scope.popup_syllabus_visible = false;
    $scope.popup_syllabus = {
        height: 450,
        width: 500,
        fullScreen: false,
        showTitle: true,
        title: 'Update',
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'updsyl', onClick: function (e) {
                        console.log($scope.syllabusDto);
                        $scope.syllabusDto.Done = $scope.syllabusDto.Done ? 1 : 0;
                        $scope.loadingVisible = true;
                        trnService.saveSyllabus($scope.syllabusDto).then(function (response) {
                            //$scope.selectedEmployees

                            $scope.dg_syllabi_selected.Status = response.Data.Status;
                            $scope.dg_syllabi_selected.Remark = response.Data.Remark;
                            $scope.dg_syllabi_selected.InstructorId = response.Data.InstructorId;
                            $scope.dg_syllabi_selected.SessionKey = response.Data.SessionKey;
                            $scope.dg_syllabi_selected.Instructor = response.Data.Instructor;

                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.loadingVisible = false;

                            $scope.dg_syllabi_instance.clearSelection();
                            $scope.dg_syllabi_instance.refresh();
                            $scope.popup_syllabus_visible = false;
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_syllabus_visible = false;
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
            $scope.dg_syllabi_instance.refresh();
        },
        onHiding: function () {
            //clearSelection()
            $scope.syllabusDto = {
                Id: null,
                Remark: null,
                Done: 0,
                Instructor: null,
                Session: null,
            };

            $scope.popup_syllabus_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_syllabus_visible',


        }
    };

    $scope.syllabusDto = {
        Id: null,
        Remark: null,
        Done: 0,
        Instructor: null,
        Session: null,
    };
    $scope.txt_syl_remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'syllabusDto.Remark',
        }
    };
    $scope.chb_syl_done = {

        text: 'Done',
        bindingOptions: {
            value: 'syllabusDto.Done',

        }
    };
    $scope.sb_syl_ins = {

        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Name"],
        valueExpr: "Id",
        displayExpr: "Name",

        bindingOptions: {
            value: 'syllabusDto.Instructor',
            dataSource: 'ds_syl_teachers'

        }

    };
    $scope.sb_syl_session = {

        showClearButton: true,
        searchEnabled: true,
        //searchExpr: ["Name"],
        //valueExpr: "Id",
        //displayExpr: "Name",

        bindingOptions: {
            value: 'syllabusDto.Session',
            dataSource: 'ds_syl_session'

        }

    };




    $scope.dg_syllabi_columns = [
        { dataField: 'Status', caption: 'Done', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'Duration', caption: 'Duration (mm)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120 },

        { dataField: 'SessionKey', caption: 'Session', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left' },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 350, fixed: false, fixedPosition: 'left' },

        {
            dataField: "Id", caption: '',
            width: 120,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'updateSyllabusTemplate',
            name: 'updatesyllabi',
            fixed: true,
            fixedPosition: 'right',
            //visible:false,

        }

    ];
    $scope.dg_syllabi_height = 700;
    $scope.dg_syllabi_selected = null;
    $scope.dg_syllabi_instance = null;
    $scope.dg_syllabi_ds = [];
    $scope.dg_syllabi = {
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
        selection: { mode: 'single' },
        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,

        height: 640,
        columnAutoWidth: false,

        columns: $scope.dg_syllabi_columns,
        onContentReady: function (e) {
            if (!$scope.dg_syllabi_instance)
                $scope.dg_syllabi_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //nasiri
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_syllabi_selected = null;

            }
            else {
                //soos
                $scope.dg_syllabi_selected = data;

            }


        },
        onCellClick: function (e) {
            //7-27
            /*var clmn = e.column;
            var field = clmn.dataField;
            if (field.indexOf("Session") != -1 && field.indexOf("SessionAttendance")==-1) {
                var obj = { pid: e.data.PersonId, cid: $scope.selectedCourse.Id, sid: field };
                $scope.loadingVisible = true;
                trnService.saveCourseSessionPres(obj).then(function(response) {
                    $scope.loadingVisible = false;
                    e.data[field] = !e.data[field];

                }, function(err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            }
            if (clmn.name == "ImgUrl" && e.data.ImgUrl)
                $window.open($rootScope.clientsFilesUrl +  e.data.ImgUrl, '_blank');
			*/
        },
        onCellPrepared: function (e) {


        },
        bindingOptions: {
            dataSource: 'dg_syllabi_ds', //'dg_employees_ds',

        }
    };

    $scope.updateSyllabus = function (row) {

        if (!$scope.IsEditable) {
            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            return;
        }
        $scope.dg_syllabi_selected = row.data;
        //$scope.dg_selected
        $scope.ds_syl_teachers = [];
        if ($scope.dg_selected.CurrencyId)
            $scope.ds_syl_teachers.push({ Id: $scope.dg_selected.CurrencyId, Name: $scope.dg_selected.Instructor });
        if ($scope.dg_selected.Instructor2Id)
            $scope.ds_syl_teachers.push({ Id: $scope.dg_selected.Instructor2Id, Name: $scope.dg_selected.Instructor2 });

        //$scope.ds_syl_session=[];
        $scope.syllabusDto = {
            Id: $scope.dg_syllabi_selected.Id,
            Remark: $scope.dg_syllabi_selected.Remark,
            Done: $scope.dg_syllabi_selected.Status ? 1 : 0,
            Instructor: $scope.dg_syllabi_selected.InstructorId,
            Session: $scope.dg_syllabi_selected.SessionKey,
        };



        // $scope.resultId = $scope.dg_people_selected.CoursePeopleStatusId;
        // $scope.resultIssue = $scope.dg_people_selected.DateIssue;
        // $scope.resultExpire = $scope.dg_people_selected.DateExpire;
        // $scope.resultRemark = $scope.dg_people_selected.StatusRemark;
        // $scope.resultNo = $scope.dg_people_selected.CertificateNo;

        $scope.popup_syllabus_visible = true;
    };
    //////////////////////////////

    var tabs_folder = [
        { text: "PARTICIPANTS", id: 'participants', visible_btn: false },
        { text: "SYLLABI", id: 'syllabi', visible_btn: false },



    ];
    $scope.tabs_folder = tabs_folder;
    $scope.selectedTabFolderIndex = -1;
    $scope.$watch("selectedTabFolderIndex", function (newValue) {

        try {
            $scope.selectedTabFolder = tabs_folder[newValue];
            $('.tabfolder').hide();
            $('.' + $scope.selectedTabFolder.id).fadeIn(100, function () {


            });

            $scope.dg_people_instance.repaint();
            $scope.dg_syllabi_instance.repaint();

        }
        catch (e) {

        }

    });
    $scope.tabs_folder_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs_folder", deep: true },
            selectedIndex: 'selectedTabFolderIndex'
        }

    };
    // $scope.IsEditable = false;
    $scope.IsUploadVisible = false;
    $scope.upload_url = "";
    $scope.popup_people_visible = false;
    $scope.popup_people = {
        height: 800,
        width: $(window).width() - 200,
        fullScreen: false,
        showTitle: true,
        title: 'Follow Up',
        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }
                        var data = { groups: $scope.selectedCourse.JobGroupsCode, id: $scope.selectedCourse.Id };
                        $rootScope.$broadcast('InitEmployeeSelectCourse', data);
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Remove', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }
                        var selected = $rootScope.getSelectedRow($scope.dg_people_instance);
                        if (!selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        General.Confirm(Config.Text_DeleteConfirm, function (res) {
                            if (res) {

                                var dto = { pid: selected.PersonId, cid: $scope.selectedCourse.Id };
                                $scope.loadingVisible = true;
                                trnService.deleteCoursePeople(dto).then(function (response) {
                                    $scope.loadingVisible = false;
                                    if (response.IsSuccess) {
                                        General.ShowNotify(Config.Text_SavedOk, 'success');
                                        $scope.dg_people_ds = Enumerable.From($scope.dg_people_ds).Where('$.PersonId!=' + selected.PersonId).ToArray();
                                        $scope.ds_people = Enumerable.From($scope.ds_people).Where('$.PersonId!=' + selected.PersonId).ToArray();


                                    }
                                    else
                                        General.ShowNotify(response.Errors[0], 'error');




                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                        });
                    }
                }, toolbar: 'bottom'
            },
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', text: 'Result', onClick: function (e) {

            //            $scope.dg_people_selected = $rootScope.getSelectedRow($scope.dg_people_instance);
            //            if (!$scope.dg_people_selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }



            //            $scope.resultId = $scope.dg_people_selected.CoursePeopleStatusId;
            //            $scope.resultIssue = $scope.dg_people_selected.DateIssue;
            //            $scope.resultExpire = $scope.dg_people_selected.DateExpire;
            //            $scope.resultRemark = $scope.dg_people_selected.StatusRemark;
            //            $scope.resultNo = $scope.dg_people_selected.CertificateNo;

            //            $scope.popup_result_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Notify', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }


                        $scope.popup_notify_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Sync Roster', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }
                        var dto = { id: $scope.selectedCourse.Id };
                        $scope.loadingVisible = true;
                        trnService.saveSessionsSyncGet($scope.selectedCourse.Id).then(function (response) {




                            $scope.loadingVisible = false;
                            if (!response.Data.errors || response.Data.errors.length == 0)
                                General.ShowNotify(Config.Text_SavedOk, 'success');
                            else {
                                $scope.dg_syncerrors_ds = response.Data.errors;
                                $scope.popup_syncerrors_visible = true;
                            }





                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }
                }, toolbar: 'bottom'
            },
            //nasiri
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Generate Certificate', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }
                        var selected = $rootScope.getSelectedRow($scope.dg_people_instance);
                        if (!selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        if (selected.CoursePeopleStatusId == 1) {
                            $window.open($rootScope.reportServerTRN + '?type=18&id=' + selected.Id, '_blank');
                        }
                        // $scope.popup_notify_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxFileUploader', location: 'after', options: {
                    multiple: false,
                    width: 200,
                    selectButtonText: 'Upload Certificate',
                    // selectButtonText: 'انتخاب تصویر',
                    labelText: '',
                    accept: "*",
                    uploadMethod: 'POST',
                    uploadMode: "instantly",
                    rtlEnabled: true,
                    showFileList: false,
                    //uploadUrl: serviceBaseTRN + 'api/upload/certificate',
                    onValueChanged: function (arg) {

                    },
                    onUploadStarted: function (e) { $scope.loadingVisible = true; },
                    onUploaded: function (e) {
                        $scope.uploadedFileImage = e.request.responseText;
                        console.log('upload message', e.request);
                        if (e.request.responseText) {
                            var row = $rootScope.getSelectedRow($scope.dg_people_instance);
                            row.ImgUrl = e.request.responseText.replace(/"/g, '');
                            $scope.loadingVisible = false;
                            // $scope.IsUploadVisible = false;
                            try {
                                $scope.dg_people_instance.clearSelection();
                                $scope.dg_people_instance.refresh();

                            }
                            catch (e) {
                                alert(e);
                                console.log(e);
                            }

                        }

                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'PARTICIPANTS FORM', onClick: function (e) {
                        if (!$scope.IsEditable) {
                            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
                            return;
                        }

                        $window.open($rootScope.reportServerTRN + '?type=100&cid=' + $scope.selectedCourse.Id, '_blank');
                        // $scope.popup_notify_visible = true;
                    }
                }, toolbar: 'bottom'
            },
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
            $scope.preparePeopleGrid();

        },
        onHidden: function () {
            //$scope.dg_employees_instance.refresh();
        },

        onHiding: function () {
            //clearSelection()

            $scope.ds_people = [];
            $scope.ds_sessions = [];
            $scope.dg_people_ds = [];
            $scope.popup_people_visible = false;
            $scope.dg_people_instance.option('columns', []);
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_people_visible',
            'toolbarItems[5].visible': 'IsUploadVisible',
            'toolbarItems[5].options.uploadUrl': 'upload_url',

        }
    };
    $scope.ddd = 'dool';
    $scope.preparePeopleGrid = function () {
        $scope.loadingVisible = true;

        trnService.getCoursePeopleSessions($scope.selectedCourse.Id).then(function (response) {
            $scope.loadingVisible = false;

            $scope.dg_syllabi_ds = response.Data.syllabi;


            $scope.dg_people_instance.addColumn({
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            });
            $scope.dg_people_instance.addColumn({ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "desc" });
            $scope.dg_people_instance.addColumn({ dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" });
            $scope.dg_people_instance.addColumn({ dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: true, fixedPosition: 'left', });

            $scope.ds_sessions = response.Data.sessions;

            $scope.ds_syl_session = [];
            $.each($scope.ds_sessions, function (_i, _d) {
                $scope.ds_syl_session.push(_d.Key);
                //2021-07-24-08-00-10-00
                var prts = _d.Key.split("-");
                var _caption = prts[0] + '-' + prts[1] + '-' + prts[2] + ' ' + prts[3] + ':' + prts[4] + '-' + prts[5] + ':' + prts[6];
                var field = 'Session' + _d.Key;
                _d.field = field;
                _d.caption = _caption;
                //if ($scope.dg_people_instance) {

                $scope.dg_people_instance.addColumn({ dataField: field, caption: _caption, allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 130 });

                _d.fieldAttendance = 'SessionAttendance' + _d.Key;
                _d.captionAttendance = "Attendance";
                $scope.dg_people_instance.addColumn({ dataField: 'SessionAttendance' + _d.Key, caption: "Attendance", allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 });

                //}

            });


            $.each(response.Data.people, function (_i, _d) {

                var dobj = { Id: _d.Id, PersonId: _d.PersonId, Name: _d.Name, FirstName: _d.FirstName, LastName: _d.LastName, JobGroup: _d.JobGroup };
                $scope.ds_people.push(dobj);
                var obj = {
                    Id: _d.Id, PersonId: _d.PersonId, Name: _d.Name, FirstName: _d.FirstName, LastName: _d.LastName, JobGroup: _d.JobGroup,
                    JobGroupCode: _d.JobGroupCode,
                    JobGroupCode2: _d.JobGroupCode2,
                    CoursePeopleStatus: _d.CoursePeopleStatus,
                    CoursePeopleStatusId: _d.CoursePeopleStatusId,
                    DateIssue: _d.DateIssue,
                    DateExpire: _d.DateExpire,
                    StatusRemark: _d.StatusRemark,
                    //nasiri
                    ImgUrl: _d.ImgUrl,
                    SMSStatus: _d.SMSStatus,
                    SMSDateSent: _d.SMSDateSent,
                    EmployeeId: _d.EmployeeId

                };
                $.each($scope.ds_sessions, function (_i, _s) {
                    console.log(_s.Key + '    ' + _d.PersonId);
                    console.log(response.Data.press);
                    var value = Enumerable.From(response.Data.press).Where('$.PersonId==' + _d.PersonId + ' && $.SessionKey=="' + _s.Key + '"').FirstOrDefault();
                    obj[_s.field] = value ? value.IsPresent : false;
                    obj[_s.fieldAttendance] = value ? value.AttendancePercent : 0;
                });
                $scope.dg_people_ds.push(obj);

            });


            $scope.dg_people_instance.addColumn({ dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'StatusRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, });

            $scope.dg_people_instance.addColumn({ dataField: 'SMSDateSent', caption: 'Notif. Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy HH:mm', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'SMSStatus', caption: 'Notif. Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, });

            $scope.dg_people_instance.addColumn(
                {
                    dataField: "Id", caption: '',
                    width: 120,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: 'AttendanceTemplate',
                    name: 'attendance',
                    fixed: true,
                    fixedPosition: 'right',
                    //visible:false,

                }
            );

            $scope.dg_people_instance.addColumn(
                {
                    dataField: "Id", caption: '',
                    width: 140,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: 'updateResultTemplate',
                    name: 'updateresult',
                    fixed: true,
                    fixedPosition: 'right',
                    //visible:false,

                }
            );

            //nasiri
            $scope.dg_people_instance.addColumn(
                {
                    dataField: "ImgUrl", caption: '',
                    width: 55,
                    name: 'ImgUrl',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: function (container, options) {
                        var fn = options.value ? 'cer2' : 'certification-document';
                        if (options.value)
                            $("<div>")
                                .append("<img class='cell-img' src='content/images/" + fn + ".png' />")
                                .appendTo(container);
                        else
                            $("<div>").appendTo(container);
                    },
                    fixed: true, fixedPosition: 'right',

                }
            );



            $scope.dg_people_instance.refresh();
            $scope.loadingVisible = false;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };


    $scope.popup_result_visible = false;
    $scope.popup_result = {
        height: 490,
        width: 550,
        fullScreen: false,
        showTitle: true,
        title: 'Course Result',
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'cresult', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {
                            Id: $scope.dg_people_selected.Id,
                            PersonId: $scope.dg_people_selected.PersonId,
                            CourseId: $scope.selectedCourse.Id,
                            StatusId: $scope.resultId,
                            Remark: $scope.resultRemark,
                            Issue: $scope.resultIssue ? moment($scope.resultIssue).format('YYYY-MM-DD') : '',
                            Expire: $scope.resultExpire ? moment($scope.resultExpire).format('YYYY-MM-DD') : '',
                            No: $scope.resultNo,
                            Group: $scope.dg_people_selected.JobGroupCode

                        };

                        $scope.loadingVisible = true;
                        trnService.saveCoursePeopleStatus(dto).then(function (response) {

                            $scope.dg_people_selected.CoursePeopleStatusId = $scope.resultId;
                            $scope.dg_people_selected.CoursePeopleStatus = $scope.resultText;
                            $scope.dg_people_selected.DateIssue = $scope.resultIssue;
                            $scope.dg_people_selected.DateExpire = $scope.resultExpire;
                            $scope.dg_people_selected.StatusRemark = $scope.resultRemark;
                            $scope.dg_people_selected.CertificateNo = $scope.resultNo;


                            $scope.loadingVisible = false;
                            $scope.popup_result_visible = false;
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_result_visible = false;
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
            $scope.resultId = null;
            $scope.resultIssue = null;
            $scope.resultExpire = null;
            $scope.resultRemark = null;
            $scope.resultNo = null;

            $scope.popup_result_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_result_visible',


        }
    };

    $scope.attfrom = null;
    $scope.time_attfrom = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'attfrom',

        }
    };
    $scope.attto = null;
    $scope.time_attto = {
        type: "time",
        width: '100%',
        //divargar-ok
        displayFormat: "HHmm",
        interval: 15,
        onValueChanged: function (arg) {


        },
        bindingOptions: {
            value: 'attto',

        }
    };
    $scope.attremark = null;
    $scope.txt_attremark = {
        bindingOptions: {
            value: 'attremark',

        }
    }
    $scope.btn_attadd = {
        text: 'Add',
        type: 'success',
        icon: 'add',
        width: '100%',
        validationGroup: 'attadd',
        bindingOptions: {},
        onClick: function (arg) {
            if (!$scope.selectedSessionTile) {
                General.ShowNotify("No Session Selected.", 'error');
                return;
            }
            var result = arg.validationGroup.validate();
            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }



            var dates = (new Date($scope.selectedSessionTile.Date)).getDatePartArray();
            var fromTimes = (new Date($scope.attfrom)).getTimePartArray();
            var toTimes = (new Date($scope.attto)).getTimePartArray();
            var attfrom = new Date(dates[0], dates[1], dates[2], fromTimes[0], fromTimes[1], 0, 0);
            var attto = new Date(dates[0], dates[1], dates[2], toTimes[0], toTimes[1], 0, 0);

            var entity = {
                Date: moment($scope.selectedSessionTile.Date).format('YYYY-MM-DD'),
                From: moment(attfrom).format('HH:mm'),
                To: moment(attto).format('HH:mm'),
                Remark: $scope.attremark,
                CourseId: $scope.selectedCourse.Id,
                PersonId: $scope.attPerson.PersonId,
                Key: $scope.selectedSessionTile.Key,

            };
            $scope.loadingVisible = true;
            trnService.saveCourseAttendance(entity).then(function (response) {
                $scope.loadingVisible = false;
                $scope.attRefresh = true;
                $scope.attremark = null;
                $scope.attfrom = null;
                $scope.attto = null;
                response.Data.Duration = $scope.formatMinutesXXX(response.Data.Attendance);
                $scope.ds_attendance.push(response.Data);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };


    $scope.attendance = [];
    $scope.popup_att_visible = false;
    $scope.attRefresh = false;
    $scope.popup_att = {
        height: 750,
        width: 1050,
        fullScreen: false,
        showTitle: true,
        title: 'People',
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_att_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {

            $scope.attRefresh = false;
        },
        onShown: function (e) {

            $scope.loadingVisible = true;
            trnService.getCourseAttendance($scope.selectedCourse.Id, $scope.attPerson.PersonId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.attendance = response.Data;
                $.each($scope.attendance, function (_i, _d) {
                    _d.Duration = $scope.formatMinutesXXX(_d.Attendance);
                });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        },
        onHidden: function () {
            //$scope.dg_employees_instance.refresh();
            if ($scope.attRefresh) {

                $scope.dg_people_instance.option('columns', []);
                $scope.ds_people = [];
                $scope.ds_sessions = [];
                $scope.dg_people_ds = [];

                $scope.preparePeopleGrid();
            }

        },
        onHiding: function () {
            $scope.ds_attendance = [];
            $scope.attendance = [];
            $scope.sessionTiles = [];
            $scope.attPerson = null;
            $scope.selectedSessionTile = null;
            //$scope.ds_people = [];
            //$scope.ds_sessions = [];
            //$scope.dg_people_ds = [];
            //$scope.popup_people_visible = false;
            //$scope.dg_people_instance.option('columns', []);

        },
        bindingOptions: {
            visible: 'popup_att_visible',


        }
    };
    $scope.formatMinutesXXX = function (mm) {
        if (!mm && mm !== 0)
            return "-";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.sessionTiles = [];
    $scope.attPerson = null;
    $scope.selectedSessionTile = null;
    $scope.ds_attendance = [];
    $scope.sessionTileClick = function (item) {
        $scope.selectedSessionTile = item;
        $scope.ds_attendance = [];
        $scope.ds_attendance = Enumerable.From($scope.attendance).Where('$.SessionKey=="' + item.Key + '"').ToArray();
        //   $scope.dg_att_instance.refresh();

    };
    $scope.getSessionTileClass = function (item) {
        if (!$scope.selectedSessionTile)
            return "";
        return $scope.selectedSessionTile.Key == item.Key ? "stSelected" : "";
    };
    $scope.updateAttendance = function (row) {
        if (!$scope.IsEditable) {
            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            return;
        }
        $scope.attPerson = (row.data);
        $scope.sessionTiles = [];
        console.log('     SESSSSESESESESE', $scope.ds_sessions);
        $.each($scope.ds_sessions, function (_i, _d) {
            var prts = _d.Key.split("-");
            var _caption = prts[0] + '-' + prts[1] + '-' + prts[2] + ' ' + prts[3] + ':' + prts[4] + '-' + prts[5] + ':' + prts[6];


            $scope.sessionTiles.push({
                Key: _d.Key,
                CourseId: _d.CourseId,
                Caption: _caption,
                Date: new Date(_d.DateEnd),


            });
        });

        $scope.popup_att_visible = true;
    };


    $scope.deleteAttendance = function (row) {
        if (!$scope.IsEditable) {
            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            return;
        }
        //$scope.attPerson = (row.data);
        General.Confirm(Config.Text_DeleteConfirm, function (res) {
            if (res) {

                var dto = { Id: row.data.Id };
                $scope.loadingVisible = true;
                trnService.deleteAttendance(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.attRefresh = true;
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    $scope.ds_attendance = Enumerable.From($scope.ds_attendance).Where('$.Id!=' + row.data.Id).ToArray();




                }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

            }
        });


    };

    $scope.dg_att_columns = [

        { dataField: 'DateFrom', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 150, format: 'HH:mm', sortIndex: 0, sortOrder: "asc" },
        { dataField: 'DateTo', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 150, format: 'HH:mm', },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'right' },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'right' },
        {
            dataField: "Id", caption: '',
            width: 120,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'AttendanceDeleteTemplate',
            name: 'deleteattendance',
            fixed: true,
            fixedPosition: 'right',
            //visible:false,

        }
    ];
    $scope.dg_att_selected = null;
    $scope.dg_att_instance = null;
    $scope.dg_att = {
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
        columns: $scope.dg_att_columns,
        onContentReady: function (e) {
            if (!$scope.dg_att_instance)
                $scope.dg_att_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_att_selected = null;
            }
            else
                $scope.dg_att_selected = data;


        },
        height: 450,
        bindingOptions: {

            dataSource: 'ds_attendance',
            // height: 'dg_height',
        },
        // dataSource:ds

    };













    ///////////////
    $scope.related_interval = null;
    $scope.updateResult = function (row) {
        if (!$scope.IsEditable) {
            General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            return;
        }
        $scope.dg_people_selected = row.data;
        $scope.resultId = $scope.dg_people_selected.CoursePeopleStatusId;
        $scope.resultIssue = $scope.dg_people_selected.DateIssue;
        $scope.resultExpire = $scope.dg_people_selected.DateExpire;
        $scope.resultRemark = $scope.dg_people_selected.StatusRemark;
        $scope.resultNo = $scope.dg_people_selected.CertificateNo;

        console.log('PERSON', $scope.dg_people_selected);
        //2023-07-18
        $scope.related_interval = null; //Enumerable.From($scope.selected_intervals).Where(function (x) { return $scope.dg_people_selected.JobGroupCode.startsWith(x.code); }).FirstOrDefault();
        if (!$scope.related_interval)
            $scope.related_interval = { value: $scope.selectedCourse.Interval };
        console.log('related_interval', $scope.related_interval);
        $scope.popup_result_visible = true;
    };

    $scope.ds_people = [];
    $scope.ds_sessions = [];


    $scope.resultId = null;
    $scope.resultText = null;
    $scope.resultIssue = null;
    $scope.resultExpire = null;
    $scope.resultRemark = null;
    $scope.resultNo = null;
    $scope.res_date_disabled = true;


    $scope.set_expire  = function () {
        if ($scope.resultIssue &&  $scope.related_interval && $scope.related_interval.value) {
            //$scope.resultIssue = (new Date($scope.selectedCourse.DateEnd)).addDays(0);
            $scope.resultExpire = (new Date($scope.resultIssue)).addMonths(Number($scope.related_interval.value));
            //  alert($scope.resultIssue);
            //  alert($scope.resultExpire);
            //  alert($scope.related_interval.value);
            //if ($scope.selectedCourse.CalanderTypeId == 12) {
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addYears($scope.selectedCourse.Interval);

            //}
            //if ($scope.selectedCourse.CalanderTypeId == 13)
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addMonths($scope.selectedCourse.Interval);
            //if ($scope.selectedCourse.CalanderTypeId == 14)
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addDays($scope.selectedCourse.Interval);

            var expMonth = $scope.resultExpire.getMonth();
            var expDay = $scope.resultExpire.getDate();
            var expYear = $scope.resultExpire.getFullYear();

            var expDt = new Date(expYear, expMonth + 1, 0);
            $scope.resultExpire = expDt;


        }
    };

    $scope.set_expire_first = function () {
        var m = 0;
        if ($scope.related_interval && $scope.related_interval.value)
            m = Number($scope.related_interval.value);
        if ($scope.selectedCourse.Continual)
            m = 1200;
       
        if (!$scope.resultIssue && /*$scope.related_interval && $scope.related_interval.value*/ m!=0) {
            $scope.resultIssue = (new Date($scope.selectedCourse.DateEnd)).addDays(0);
            $scope.resultExpire = (new Date($scope.resultIssue)).addMonths(/*Number($scope.related_interval.value)*/m);
          //  alert($scope.resultIssue);
          //  alert($scope.resultExpire);
          //  alert($scope.related_interval.value);
            //if ($scope.selectedCourse.CalanderTypeId == 12) {
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addYears($scope.selectedCourse.Interval);

            //}
            //if ($scope.selectedCourse.CalanderTypeId == 13)
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addMonths($scope.selectedCourse.Interval);
            //if ($scope.selectedCourse.CalanderTypeId == 14)
            //    $scope.resultExpire = (new Date($scope.resultIssue)).addDays($scope.selectedCourse.Interval);

            var expMonth = $scope.resultExpire.getMonth();
            var expDay = $scope.resultExpire.getDate();
            var expYear = $scope.resultExpire.getFullYear();

            var expDt = new Date(expYear, expMonth + 1, 0);
            $scope.resultExpire = expDt;


        }
    };
    $scope.sb_result = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: [{ id: -1, title: 'UNKNOWN' }, { id: 0, title: 'FAILED' }, { id: 1, title: 'PASSED' }],
        displayExpr: "title",
        valueExpr: 'id',
        onSelectionChanged: function (e) {
            if (e.selectedItem && e.selectedItem.id == 1) {
                $scope.set_expire_first();
                //if (!$scope.resultIssue) {
                //    $scope.resultIssue = (new Date($scope.selectedCourse.DateEnd)).addDays(0);
                //    if ($scope.selectedCourse.CalanderTypeId == 12) {
                //        $scope.resultExpire = (new Date($scope.resultIssue)).addYears($scope.selectedCourse.Interval);

                //    }
                //    if ($scope.selectedCourse.CalanderTypeId == 13)
                //        $scope.resultExpire = (new Date($scope.resultIssue)).addMonths($scope.selectedCourse.Interval);
                //    if ($scope.selectedCourse.CalanderTypeId == 14)
                //        $scope.resultExpire = (new Date($scope.resultIssue)).addDays($scope.selectedCourse.Interval);

                //    var expMonth = $scope.resultExpire.getMonth();
                //    var expDay = $scope.resultExpire.getDate();
                //    var expYear = $scope.resultExpire.getFullYear();

                //    var expDt = new Date(expYear, expMonth + 1, 0);
                //    $scope.resultExpire = expDt;


                //}
            }

            $scope.res_date_disabled= $scope.resultId != 1;
        },
        bindingOptions: {
            value: 'resultId',
            text: 'resultText',
        }
    };
    //date_resultexpire

    $scope.date_resultissue = {
        width: '100%',
        type: 'date',
        //$scope.set_expire
        onValueChanged: function (e) {
             
            $scope.set_expire();
        },
        bindingOptions: {
            value: 'resultIssue',
            disabled: 'res_date_disabled',
        }
    };
    $scope.date_resultexpire = {
        width: '100%',
        type: 'date',

        bindingOptions: {
            value: 'resultExpire',
            disabled: 'res_date_disabled',
            // disabled: 'isCertidicateDisabled',
        }
    };

    $scope.txt_resultremark = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'resultRemark',
        }
    };
    $scope.txt_resultno = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'resultNo',
            //disabled:'isCertidicateDisabled',
        }
    };


    $scope.$on('onEmployeeSelectCourseHide', function (event, prms) {


        //   console.log(prms);

        if (!prms || prms.length == 0)
            return;
        var dgids = Enumerable.From($scope.ds_people).Select('$.PersonId').ToArray();
        var news = Enumerable.From(prms).Where(function (x) { return dgids.indexOf(x.PersonId) == -1; }).ToArray();
        if (news && news.length > 0) {
            var pids = Enumerable.From(news).Select('$.PersonId').ToArray().join('-');
            var dto = { pid: pids, Id: $scope.selectedCourse.Id };
            $scope.loadingVisible = true;
            trnService.saveCoursePeople(dto).then(function (response) {
                $scope.loadingVisible = false;
                $.each(news, function (_i, _d) {


                    $scope.ds_people.push(_d);
                    var obj = {
                        Id: -1, PersonId: _d.PersonId, Name: _d.Name, FirstName: _d.FirstName, LastName: _d.LastName, JobGroup: _d.JobGroup,
                        CoursePeopleStatus: 'UNKNOWN',
                        CoursePeopleStatusId: -1,
                        DateIssue: null,
                        DateExpire: null,
                        StatusRemark: null
                    };
                    $.each($scope.ds_sessions, function (_i, _s) {
                        obj[_s.field] = false;
                    });
                    $scope.dg_people_ds.push(obj);

                });
                $scope.dg_people_instance.refresh();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }



    });

    /////////////////////////////
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
                    url: serviceBaseTRN + 'api/course/query/',
                    key: "Id",
                    //version: 4,
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


    //2021-08-01
    $scope.popup_syncerrors_visible = false;
    $scope.popup_syncerrors = {
        height: 600,
        width: 1100,
        fullScreen: false,
        showTitle: true,
        title: 'Sync Errors',
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_syncerrors_visible = false;
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

            if ($scope.dg_syncerrors_instance)
                $scope.dg_syncerrors_instance.refresh();
        },
        onHiding: function () {
            $scope.dg_syncerrors_ds = [];

            $scope.popup_syncerrors_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_syncerrors_visible',


        }
    };

    $scope.dg_syncerrors_columns = [

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "asc" },
        {
            caption: 'Session', fixed: true, fixedPosition: 'left', columns: [
                { dataField: 'SessionDateFrom', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', sortIndex: 1, sortOrder: "asc" },
                { dataField: 'SessionDateFrom', caption: 'Begin', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', sortIndex: 2, sortOrder: "asc" },
                { dataField: 'SessionDateTo', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
            ]
        },
        {
            caption: 'Interrupted By', columns: [
                { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', },
                { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', },
                { dataField: 'DutyStart', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', },
                { dataField: 'DutyStart', caption: 'Begin', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
                { dataField: 'RestUntil', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
            ]
        },
    ];


    $scope.dg_syncerrors_instance = null;
    $scope.dg_syncerrors_ds = [];
    $scope.dg_syncerrors = {
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
        height: 480,
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

        columns: $scope.dg_syncerrors_columns,
        onContentReady: function (e) {
            if (!$scope.dg_syncerrors_instance)
                $scope.dg_syncerrors_instance = e.component;

        },
        onSelectionChanged: function (e) {

        },

        bindingOptions: {
            dataSource: 'dg_syncerrors_ds', //'dg_employees_ds',

        }
    };


    ///////////////////////
    $scope.dg_notify_columns = [

        { dataField: 'Statu', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left', },
        { dataField: 'PersonName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },



        { dataField: 'DateSent', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200, format: 'yyyy-MMM-dd HH:mm' },


        { dataField: 'RefId', caption: 'Ref.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150 },

        { dataField: 'Msg', caption: 'Text', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 1500 },

    ];
    $scope.dg_notify_instance = null;
    $scope.ds_notify = [];
    $scope.dg_notify = {
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
        height: 550,

        columns: $scope.dg_notify_columns,
        onContentReady: function (e) {
            if (!$scope.dg_notify_instance)
                $scope.dg_notify_instance = e.component;

        },
        onSelectionChanged: function (e) {



        },
        bindingOptions: {
            dataSource: 'ds_notify'
        }
    };




    $scope.popup_notify_visible = false;
    $scope.popup_notify = {
        height: 680,
        width: 1200,
        fullScreen: false,
        showTitle: true,
        title: 'Course Notification Result',
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify_visible = false;
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

            if ($scope.dg_notify_instance)
                $scope.dg_notify_instance.refresh();

            var selected = $rootScope.getSelectedRows($scope.dg_people_instance);
            if (!selected || selected.length == 0) {
                General.ShowNotify("No Row(s) Selected.", 'error');
                return;
            }
            var pids = Enumerable.From(selected).Select('$.PersonId').ToArray().join('_');

            $scope.loadingVisible = true;
            trnService.courseNotify($scope.selectedCourse.Id, pids).then(function (response) {
                $scope.loadingVisible = false;

                $scope.ds_notify = response;
                console.log($scope.ds_notify);
                console.log($scope.dg_people_ds);
                $.each($scope.ds_notify, function (_i, _d) {
                    var rec = Enumerable.From($scope.dg_people_ds).Where('$.EmployeeId==' + _d.PersonId).FirstOrDefault();
                    rec.SMSStatus = _d.Statu;
                    rec.SMSDateSent = _d.DateSent;
                });
                //$scope.dg_people_ds
                console.log($scope.dg_people_ds);
                $scope.dg_people_instance.refresh();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        },
        onHiding: function () {
            $scope.ds_notify = [];

            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_notify_visible',


        }
    };


    //12-01
    $scope.uploader_file = {
        multiple: false,
        width: 200,
        selectButtonText: 'PARTICIPANTS FORM',
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        //uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        uploadUrl: serviceBaseTRN + 'api/upload/pf/',
        rtlEnabled: true,
        showFileList: false,
        //uploadUrl: serviceBaseTRN + 'api/upload/certificate',
        onValueChanged: function (arg) {

        },
        onUploadStarted: function (e) { $scope.loadingVisible = true; },
        onUploaded: function (e) {
            $scope.loadingVisible = false;
            console.log(e.request.responseText);
            var __fn = e.request.responseText.replace('"', '').replace('"', '');
            console.log(__fn);
            var dto = {
                courseId: $scope.dg_selected.Id,

                url: __fn
            };
            $scope.loadingVisible = true;
            trnService.saveCourseFP(dto).then(function (response) {
                $scope.dg_selected.AttForm = __fn;
                $scope.loadingVisible = false;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            /* $scope.uploadedFileImage = e.request.responseText;
             console.log('upload message', e.request);
             if (e.request.responseText) {
                 var row = $rootScope.getSelectedRow($scope.dg_people_instance);
                 row.ImgUrl = e.request.responseText.replace(/"/g, '');
                 $scope.loadingVisible = false;
                 
                 try {
                     $scope.dg_people_instance.clearSelection();
                     $scope.dg_people_instance.refresh();
 
                 }
                 catch (e) {
                     alert(e);
                     console.log(e);
                 }
 
             }*/

        },
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
        $scope.build($scope.date);
        $scope.bind();

    });
    //////////////////////////////////////////
    $('.sum-wrapper').height($(window).height() - 200);

    $rootScope.$broadcast('PersonLoaded', null);


    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {

            $('._schedule_wrapper').show();
            $('._schedule').fadeIn(300, function () {
                $scope.initDate = new Date();

               // $('._cal').on('click', '.day-wrapper', function (event) {
                //    $scope.click($(this).data('date'));
               // });

                $scope.build($scope.initDate);

            });
            $scope.$broadcast('getFilterQuery', null);
        },  500);

       // $scope.selectedTabIndex = 0;
       

        //  if ($scope.isFullScreen)


        //  else
        //      $scope.scrollStyle = { height: ($scope.popup_height - 190).toString() + 'px' };




    });



    ///end


}]);