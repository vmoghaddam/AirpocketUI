'use strict';
app.controller('trnScheduleCourseController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', '$window', '$compile', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window, $compile) {
    $scope.prms = $routeParams.prms;

    $scope.momentDate = function (date) {
        if (!date)
            return '-';
        return moment(date).format('YYYY-MMM-DD');
    };
    $scope.momentTime = function (date) {
        if (!date)
            return '-';
        return moment(date).format('HH:mm');
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
    /////////////////////////
    $scope.getCourseStatusStyle = function (x) {
        
        var bk = '';
        switch (x.StatusId) {
            case 1:
                //scheduled
                bk = '#99ebff';
                break;
            case 2:
                //in progress
                bk = '#ffccff';
                break;
            case 3:
                //done
                bk = '#1affa3';
                break;
            case 4:
                //canceled
                bk = '#ffcc66';
                break;
            default: break;
        }
        return {
            background: bk,
        }
    };
    $scope.expand = function ($event) {
        var elem = $($event.currentTarget);
        var next = elem.next('.collapsed');
        if (next.hasClass('opened')) {
            next.removeClass('opened').fadeOut();
        }
        else {
            next.addClass('opened').fadeIn();
        }
        
    } 
    $scope.getMainStyle = function () {
        var h = $(window).height() - 110;
        return {
            height: h + 'px'
        }
    }
    $scope.getScheduleYearTableRowStyle = function () {
        var h = ($(window).height() - 160) / 3;
        return {
            height: h + 'px'
        }
    }
    $scope.getScheduleYearTableRowStyle2 = function () {
        var h = ($(window).height() - 183) / 3;
        return {
            height: h + 'px'
        }
    }
    $scope.getScrollStyle = function () {
        return { height: ($(window).height() - 155).toString() + 'px' };
    };
    $scope.getScrollStyle2 = function () {
        return { height: ($(window).height() - 180).toString() + 'px' };
    }
    class schedule_year {

        caption;
        date;
        year;

        constructor() {
            this.date = new Date();
            this.year = this.date.getFullYear();
            this.caption = this.year;
        }
        onChangeYear;
        build;
        dataSource;

        nextYear(n) {
            this.date = this.date.addYears(n);
            this.year = this.date.getFullYear();
            this.caption = this.year;
            this.onChangeYear(this.year);
        }
        getDataByMonth(m) {
            var data = Enumerable.From(this.dataSource).Where('$.Month==' + m).ToArray();
            return data;
        }
        getCoursesByMonth(m) {
            if (!this.dataSource)
                return [];
            var data = Enumerable.From(this.dataSource.courses).Where('$.Month==' + m).ToArray();
           
            return data;
        }
        getItemsByMonth(m) {
            var data = Enumerable.From(this.dataSource).Where('$.Month==' + m).FirstOrDefault();
            return data ? data.Items : [];
        }
    }

    $scope.schedule_year_ins = new schedule_year();
    $scope.schedule_year_ins.onChangeYear = function (y) {
        $scope.get_scheduleyear_ds();
    };
    $scope.schedule_year_ins.build = function (ds) {
        // alert(ds.length);
    };
    $scope.get_scheduleyear_ds = function () {
        $scope.loadingVisible = true;
        var y = $scope.schedule_year_ins.year;
        
        
        trnService.getTrnScheduleYear(y ).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.schedule_year_ins.dataSource = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };



    class schedule_month {
        id;
        caption;
        date;
        year;
        month;
        calendar;
        month_ds = [
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
        constructor(_id) {
            this.id = _id;
            this.date = new Date();
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();
            this.caption = this.year;
            this.caption = this.month_ds[this.month].Title + ' ' + this.year;
        }
        onChangeYear;
        onChangeMonth;
        calendar;
        dataSource;

        nextMonth(n) {
            //this.date = this.date.addYears(n);
            //this.year = this.date.getFullYear();
            //this.caption = this.year;
            //this.onChangeYear(this.year);
        }
        //getDataByMonth(m) {
        //    var data = Enumerable.From(this.dataSource).Where('$.Month==' + m).ToArray();
        //    return data;
        //}
        getScrollStyle = function () {
            return { height: (this.height - 40).toString() + 'px' };
        }


        getDataByDay(day) {

            var data = Enumerable.From(this.dataSource).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            // console.log('build2',data);
            return data;
        }

        getItemsByDay(day) {

            var data = Enumerable.From(this.dataSource).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).FirstOrDefault();
            // console.log('build2',data);
            return data ? data.Items : [];
        }

        getSessionsByDay(day) {

            var data = Enumerable.From(this.dataSource.sessions).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            var sessions = [];
            $.each(data, function (_i, _d) {
                $.each(_d.Items, function (_j, _s) {
                    sessions.push(_s);
                })
            });
            // console.log('build2',data);
            return sessions;
        }

        getExpiredByDay(day) {

            var data = Enumerable.From(this.dataSource.expired.Items).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            //var expired = [];
           // $.each(data, function (_i, _d) {
            //    $.each(_d.Items, function (_j, _s) {
            //        sessions.push(_s);
            //    })
            //});
             
            return data?data:[];
        }

        build(_height, ins) {
            this.height = _height;
            var _ch = _height * 1.0 / 6.4;//($(window).height() - 190) * 1.0 / 6.4;


            this.calendar = [];
            try {
                var today = moment(new Date()).format('YYYY-MM-DD');
                $('#' + this.id + ' .day-wrapper').html('');
                $('#' + this.id + ' .day-wrapper').hide();
                //$scope.date = new Date(_date);
                //$scope.month = $scope.date.getMonth();
                //$scope.year = $scope.date.getFullYear();
                // alert($scope.year);
                this.caption = this.month_ds[this.month].Title + ' ' + this.year;
                // alert($scope.caption);
                var day = new Date(this.year, this.month, 1);
                var lastDay = (new Date(this.year, this.month + 1, 0)).getDate();
                var dayWeek = day.getDay();
                var dayIndex = dayWeek;
                var dayMonth = day.getDate();

                var c = dayIndex - 1;
                var inactiveBack = (new Date(this.year, this.month, 0)).getDate();
                var inactiveBackYear = (new Date(this.year, this.month, 0)).getFullYear();
                var inactiveBackMonth = (new Date(this.year, this.month, 0)).getMonth();
                var inactiveForward = (new Date(this.year, this.month + 1, 1)).getDate();
                var inactiveForwardYear = (new Date(this.year, this.month + 1, 1)).getFullYear();
                var inactiveForwardMonth = (new Date(this.year, this.month + 1, 1)).getMonth();

                while (c >= 0) {
                    var data_date = inactiveBackYear + '-' + pad(Number(inactiveBackMonth) + 1) + '-' + pad(Number(inactiveBack));
                    console.log(data_date);
                    var isToday = data_date == today ? ' today' : '';
                    
                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption _inactive'>" + inactiveBack + "</div>"
                        + "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                        + "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        + "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                        + "</div>"
                        + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                        + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                        + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                        + "    </div>"
                        + "</div>"
                        //+ "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")' class='_event _expired' ng-click='expired_click(  x.CourseId  )'>"

                        + "</div>";


                  //  var _element = "<div class='_event _expired ' ng-click='expired_click(" + _d.id + "," + _j + ")'>"
                    //    + "<div class='_title'>" + _c.CertificateType + "(" + _c.Count + ")" + "</div>"

                   //     + "</div>";
                    
                    $('#' + this.id + ' #d' + c).html(html);
                    this.calendar.push({ cell: 'd' + c, date: data_date });
                    inactiveBack--;
                    c--;
                }

                while (dayMonth <= lastDay) {
                    //  console.log(data_date, this.getDataByDay(data_date));
                    // console.log(data_date, this.dataSource);
                    var data_date = this.year + '-' + pad(Number(this.month) + 1) + '-' + pad(Number(dayMonth));
                    var isToday = data_date == today ? ' today' : '';

                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption'>" + dayMonth + "</div>"
                        + "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                        + "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        + "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                        + "</div>"


                        + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                        + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                        + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                        + "    </div>"
                        + "</div>"


                        + "</div>";

                    this.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                    $('#' + this.id + ' #d' + dayIndex).html(html);

                    dayMonth++;
                    dayIndex++;
                }

                while (dayIndex <= 41) {
                    var data_date = inactiveForwardYear + '-' + pad(Number(inactiveForwardMonth) + 1) + '-' + pad(Number(inactiveForward));
                    var isToday = data_date == today ? ' today' : '';
                     
                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption _inactive'>" + inactiveForward + "</div>"
                        + "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                        + "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        + "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                        + "</div>"
                        + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                        + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                        + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                        + "    </div>"
                        + "</div>"
                        + "</div>";
                    $('#' + this.id + ' #d' + dayIndex).html(html);
                    this.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                    dayIndex++;
                    inactiveForward++;
                }
                // $scope.isCalVisible = true;
                $compile($('#' + this.id + ' .day-wrapper'))($scope);
                $('#' + this.id + ' .day-wrapper').show();



            }
            catch (e) { alert(e); }
        }


       
        fill() {
            //$.each(this.dataSource.GroupedItems, function (_j, _c) {
            //    var _element = "<div class='_event _session  _cid" + _c.CourseId + "' ng-click='session_click(" + _c.CourseId + ")'>"
            //        + "<div class='_title'>" + (_c.Title.length <= 25 ? _c.Title : _c.Title.substr(0, 25) + "...") + "</div>"
            //        + "<div style='font-size:12px;'>" + moment(_c.DateStart).format('HH:mm') + " - " + moment(_c.DateEnd).format('HH:mm') + "</div>"
            //        + "</div>";
            //    var cell = Enumerable.From($scope.calendar).Where(function (x) { return x.date == moment(_d.Date).format('YYYY-MM-DD'); }).FirstOrDefault();
            //    if (cell) {
            //        $('#' + cell.cell).find('.day-wrapper').append(_element);
            //        console.log(_d.Date);
            //    }
            //});
        }
    }

    $scope.schedule_month_01_ins = new schedule_month('sch_01');

    $scope.session_click = function (course_id) {
        //alert(course_id);
        $('._session').removeClass('selected');
        $('._cid' + course_id).addClass('selected');
       // $scope.schedule_cid = course_id;
    };



    $scope.showCourse = function (c) {
        //console.log(c);
        $scope.selectedCourse = {};
        $scope.selectedCourse.Id = c.Id;
       // $scope.popup_people_visible = true;


        var data = { Id: c.Id,ReadOnly:100 };
        $rootScope.$broadcast('InitAddCourse', data);

    }

    $scope.popup_month_visible = false;
    $scope.popup_month = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_emp"
        },
        shading: true,
        title: 'Details',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 100,
        width: $(window).width() - 300,
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_month_visible = false;

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
             
               $scope.schedule_month_01_ins.build($(window).height() - 130, 'schedule_month_01_ins');
            


        },
        onHiding: function () {

            $scope.emp_mode = false;
        },
        bindingOptions: {
            visible: 'popup_month_visible',



        }
    };



    $scope.get_schedulemonth_ds = function (m, callback) {
        $scope.loadingVisible = true;
        var y = $scope.schedule_year_ins.year;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        trnService.getTrnSchedule(y, m).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            callback(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.goMonth = function (m) {
        $scope.get_schedulemonth_ds(m,  function (ds) {
             $scope.schedule_month_01_ins.year = $scope.schedule_year_ins.year;
            $scope.schedule_month_01_ins.month = m - 1;
             $scope.schedule_month_01_ins.dataSource = ds;
           $scope.popup_month_visible = true;
        });

    };






    $scope.ds_people = [];
    $scope.ds_sessions = [];
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



    $scope.popup_people_visible = false;
    $scope.popup_people = {
        height: 800,
        width: $(window).width() - 200,
        fullScreen: false,
        showTitle: true,
        title: 'Follow Up',
        toolbarItems: [

            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'default', text: 'Add', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }
            //            var data = { groups: $scope.selectedCourse.JobGroupsCode, id: $scope.selectedCourse.Id };
            //            $rootScope.$broadcast('InitEmployeeSelectCourse', data);
            //        }
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxButton', location: 'before', options: {
            //        type: 'danger', text: 'Remove', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }
            //            var selected = $rootScope.getSelectedRow($scope.dg_people_instance);
            //            if (!selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            General.Confirm(Config.Text_DeleteConfirm, function (res) {
            //                if (res) {

            //                    var dto = { pid: selected.PersonId, cid: $scope.selectedCourse.Id };
            //                    $scope.loadingVisible = true;
            //                    trnService.deleteCoursePeople(dto).then(function (response) {
            //                        $scope.loadingVisible = false;
            //                        if (response.IsSuccess) {
            //                            General.ShowNotify(Config.Text_SavedOk, 'success');
            //                            $scope.dg_people_ds = Enumerable.From($scope.dg_people_ds).Where('$.PersonId!=' + selected.PersonId).ToArray();
            //                            $scope.ds_people = Enumerable.From($scope.ds_people).Where('$.PersonId!=' + selected.PersonId).ToArray();


            //                        }
            //                        else
            //                            General.ShowNotify(response.Errors[0], 'error');




            //                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //                }
            //            });
            //        }
            //    }, toolbar: 'bottom'
            //},
            ////{
            ////    widget: 'dxButton', location: 'after', options: {
            ////        type: 'default', text: 'Result', onClick: function (e) {

            ////            $scope.dg_people_selected = $rootScope.getSelectedRow($scope.dg_people_instance);
            ////            if (!$scope.dg_people_selected) {
            ////                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            ////                return;
            ////            }



            ////            $scope.resultId = $scope.dg_people_selected.CoursePeopleStatusId;
            ////            $scope.resultIssue = $scope.dg_people_selected.DateIssue;
            ////            $scope.resultExpire = $scope.dg_people_selected.DateExpire;
            ////            $scope.resultRemark = $scope.dg_people_selected.StatusRemark;
            ////            $scope.resultNo = $scope.dg_people_selected.CertificateNo;

            ////            $scope.popup_result_visible = true;
            ////        }
            ////    }, toolbar: 'bottom'
            ////},
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', text: 'Notify', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }


            //            $scope.popup_notify_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', text: 'Sync Roster', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }
            //            var dto = { id: $scope.selectedCourse.Id };
            //            $scope.loadingVisible = true;
            //            trnService.saveSessionsSyncGet($scope.selectedCourse.Id).then(function (response) {




            //                $scope.loadingVisible = false;
            //                if (!response.Data.errors || response.Data.errors.length == 0)
            //                    General.ShowNotify(Config.Text_SavedOk, 'success');
            //                else {
            //                    $scope.dg_syncerrors_ds = response.Data.errors;
            //                    $scope.popup_syncerrors_visible = true;
            //                }





            //            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            //        }
            //    }, toolbar: 'bottom'
            //},
            ////nasiri
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', text: 'Generate Certificate', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }
            //            var selected = $rootScope.getSelectedRow($scope.dg_people_instance);
            //            if (!selected) {
            //                General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                return;
            //            }
            //            if (selected.CoursePeopleStatusId == 1) {
            //                $window.open($rootScope.reportServerTRN + '?type=18&id=' + selected.Id, '_blank');
            //            }
            //            // $scope.popup_notify_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxFileUploader', location: 'after', options: {
            //        multiple: false,
            //        width: 200,
            //        selectButtonText: 'Upload Certificate',
            //        // selectButtonText: 'انتخاب تصویر',
            //        labelText: '',
            //        accept: "*",
            //        uploadMethod: 'POST',
            //        uploadMode: "instantly",
            //        rtlEnabled: true,
            //        showFileList: false,
            //        //uploadUrl: serviceBaseTRN + 'api/upload/certificate',
            //        onValueChanged: function (arg) {

            //        },
            //        onUploadStarted: function (e) { $scope.loadingVisible = true; },
            //        onUploaded: function (e) {
            //            $scope.uploadedFileImage = e.request.responseText;
            //            console.log('upload message', e.request);
            //            if (e.request.responseText) {
            //                var row = $rootScope.getSelectedRow($scope.dg_people_instance);
            //                row.ImgUrl = e.request.responseText.replace(/"/g, '');
            //                $scope.loadingVisible = false;
            //                // $scope.IsUploadVisible = false;
            //                try {
            //                    $scope.dg_people_instance.clearSelection();
            //                    $scope.dg_people_instance.refresh();

            //                }
            //                catch (e) {
            //                    alert(e);
            //                    console.log(e);
            //                }

            //            }

            //        },
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'default', text: 'PARTICIPANTS FORM', onClick: function (e) {
            //            if (!$scope.IsEditable) {
            //                General.ShowNotify("You Do Not Have Enough Access Privileges.", 'error');
            //                return;
            //            }

            //            $window.open($rootScope.reportServerTRN + '?type=100&cid=' + $scope.selectedCourse.Id, '_blank');
            //            // $scope.popup_notify_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
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
            console.log(response);
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

               // _d.fieldAttendance = 'SessionAttendance' + _d.Key;
              //  _d.captionAttendance = "Attendance";
              //  $scope.dg_people_instance.addColumn({ dataField: 'SessionAttendance' + _d.Key, caption: "Attendance", allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 });

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


          
            $scope.dg_people_instance.addColumn({ dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'StatusRemark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, });

            $scope.dg_people_instance.addColumn({ dataField: 'SMSDateSent', caption: 'Notif. Date', allowResizing: true, alignment: 'center', dataType: 'datetime', format: 'MM-dd-yyyy HH:mm', allowEditing: false, width: 150, });
            $scope.dg_people_instance.addColumn({ dataField: 'SMSStatus', caption: 'Notif. Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, });

            //CoursePeopleStatus

             
            $scope.dg_people_instance.addColumn({ dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' });
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

    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Courses';
        $('.trnschedulecoursetype').fadeIn();
    }
    ////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        setTimeout(function () {
            $scope.get_scheduleyear_ds();
            
        }, 500);

        //setTimeout(function () {
        //    $scope.rank = 'Cockpit';
        //}, 1000);


    });

    /////////////////////
}]);