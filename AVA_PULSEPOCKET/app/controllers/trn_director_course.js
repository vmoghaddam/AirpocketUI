﻿'use strict';
app.controller('trn_director_courseController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', 'instructorService', function ($scope, $location, authService, $routeParams, $rootScope, $window, instructorService) {

    $scope.course_id = $routeParams.id;


    $scope.instructor = { course_id: $scope.course_id, person_id: $rootScope.employeeId }

    $rootScope.show_exam = function () {
        $scope.popup_exam_visible = true;
    }

    $rootScope.show_attendance = function () {
        $scope.popup_attendance_visible = true;
    }

    $rootScope.show_signcourse = function () {
        General.Confirm('Are you sure?', function (res) {
            if (res) {
                instructorService.sign_director($scope.instructor).then(function (response) {
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    $scope.bind();
                });


            }
        });
    }

    $rootScope.show_ins_survay = function () {

        $scope.popup_survay_visible = true;
    }
    $rootScope.show_questions = function () {

        $rootScope.$broadcast('InitQuestions', null);
    }

    $scope.popup_exam_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_exam_title = 'Exam Result';
    $scope.popup_instance = null;

    $scope.popup_exam = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {

                        //instructorService.save_exam_result($scope.exam).then(function (response) {
                        //    console.log('----Exam Result Save Resposne\n', response);
                        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                        instructorService.sign_exam_coures($scope.instructor).then(function (response) {

                        });
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_exam_visible = false;

                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
          //  if ($scope.tempData != null)
           //     $scope.bind();
        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_exam_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_exam_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_exam_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };

    $scope.popup_attendance_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_attendance_title = 'Participants List';
    $scope.popup_instance = null;

    $scope.popup_attendance = {


        showTitle: true,

        toolbarItems: [
            //{
            //    widget: 'dxButton', location: 'after', options: {
            //        type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

            //            instructorService.sign_attendance_coures($scope.instructor).then(function (response) {

            //            });


            //        }
            //    }, toolbar: 'bottom'
            //},


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_attendance_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
          //  if ($scope.tempData != null)
          //      $scope.bind();
        },
        onHiding: function () {
            
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_attendance_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_attendance_title',
            height: 'popup_height',
            width: 'popup_width',
            // 'toolbarItems[0].visible': 'isEditable',
            // 'toolbarItems[2].visible': 'isEditable',

        }
    };



    $scope.popup_survay_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_survay_title = 'Survay';
    $scope.popup_instance = null;

    $scope.popup_survay = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

                        instructorService.sign_attendance_coures($scope.instructor).then(function (response) {

                        });


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'logadd', onClick: function (e) {





                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_survay_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            if ($scope.tempData != null)
                $scope.bind();
        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_survay_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_survay_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_survay_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };

    $scope.scroll_checklist_height = $(window).height() - 100;
    $scope.scroll_checklist = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_checklist_height'
        }

    };

    $scope.get_answer_class = function (d) {

        if (d == false)
            return "right_class";
        else
            return "left_class";
    }

    $scope.windowHeight = $(window).height();
    $scope.height_dy = 150;
    $scope.bind = function () {
        instructorService.get_course_object($scope.course_id).then(function (response) {
            $scope.course = response.Data.course;
            $scope.sessions = response.Data.sessions;
            if ($scope.sessions && $scope.sessions.length > 0) {

                $scope.course.DateStart = $scope.sessions[0].DateStart;
                $scope.course.DateEnd = $scope.sessions[$scope.sessions.length - 1].DateEnd;
            }


            $scope.exam_id = 1

            instructorService.get_people_sessions($scope.course_id).then(function (response) {
                $scope.followup = response.Data;
               // console.log(response.Data.sessions[0])
                // console.log("----Resposne Press-----\n", response.Data.press)

                //if (response.Data.sessions && response.Data.sessions.length > 0) {

                //    $scope.course.DateStart = response.Data.sessions[0].DateStart;
                //    $scope.course.DateEnd = response.Data.sessions[response.Data.sessions.length - 1].DateEnd;
                //}


                $scope.sessions_attend = response.Data.sessions

                $scope.participants = response.Data.people;
                //$scope.exam_attendance = response.Data.people

                $scope.exam = { course_id: $scope.course_id, exam_date: '2024-10-14', scores: [] }

                $.each(response.Data.people, function (_i, _p) {
                    $scope.exam.scores.push({ Id: _p.Id, person_id: _p.PersonId, score: _p.ExamResult, result: _p.ExamStatus, Name: _p.Name });
                });



                console.log("----People----\n", response.Data.people);


                $.each($scope.sessions_attend, function (_i, _s) {
                    var stat = Enumerable.From(response.Data.sessions_stats).Where(function (x) { return x.Id == _s.Id }).FirstOrDefault();
                    if (stat) {
                        _s.total = stat.total;
                        _s.absent = stat.absent;
                        _s.present = stat.present;
                    }
                    _s.people = angular.copy(response.Data.people);
                    _s.showDetails = false;

                    $.each(_s.people, function (_j, _p) {
                        var press = Enumerable.From(response.Data.press).Where(function (x) { return x.SessionId == _s.Id && x.PersonId == _p.PersonId; }).FirstOrDefault();

                        _p.press = !press ? 0 : press.IsPresent;

                    });
                });

                console.log("----Sessions Attend----\n", $scope.sessions_attend);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    }

    $scope.click_subject = function (sub) {
        var cid = sub.CourseId;
        if (!cid)
            cid = sub.Id;
        var stats = Enumerable.From($scope.followup.sessions_stats).Where('$.CourseId==' + cid).ToArray();
        $scope.sessions_attend = stats;
        $scope.popup_attendance_visible = true;

    };

    $scope.toggletrn_cardDetails = function (id) {
        var trainee = $scope.trainees.find(function (t) { return t.id === id; });
        trainee.showDetails = !trainee.showDetails;
    };


  

    $scope.toggle_attendance_details = function (id) {
        var session = $scope.sessions_attend.find(function (t) { return t.Id === id; });
        session.showDetails = !session.showDetails;
    };

    $scope.on_status_changed = function (session_id, session_key, course_id, person_id) {

        $scope.attendance_entity = { pid: person_id, cid: course_id, sid: "Session" + session_key }
        instructorService.save_person_press($scope.attendance_entity).then(function (response) {
            console.log('-----Save Perss Respoonse-----\n', response);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.updateFinalResult = function (id, result) {
        var trainee = $scope.exam.scores.find(function (t) { return t.Id === id; });
        trainee.result = result;
    };

    //$scope.updateScore = function (pid, score, result) {

    //    var trainee = $scope.exam.attendance.find(t => t.person_id === pid);
    //    if (trainee) {
    //        trainee.Score = score;
    //    }
    //};

    $scope.updateScore = function (person_id, score, result) {

        var trainee = $scope.exam.scores.find(t => t.person_id === person_id);
        if (trainee) {
            trainee.Score = score;
        }
    };

    $scope.isLargeScreen = function () {
        return $window.innerWidth >= 768;
    };

   

    $scope.$on('PageLoaded', function (event, prms) {
        $('.info-container').height($(window).height() - 150);
        $scope.bind();
    });

}]);


