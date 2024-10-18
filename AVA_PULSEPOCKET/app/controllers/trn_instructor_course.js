'use strict';
app.controller('trn_instructor_courseController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', 'instructorService', function ($scope, $location, authService, $routeParams, $rootScope, $window, instructorService) {

    $scope.course_id = $routeParams.id;

 
    $scope.instructor = { course_id: $scope.course_id, person_id: $rootScope.employeeId }

    $rootScope.show_exam = function () {
        $scope.popup_exam_visible = true;
    }

    $rootScope.show_attendance = function () {
        $scope.popup_attendance_visible = true;
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
    $scope.popup_attendance_title = 'Attendance List';
    $scope.popup_instance = null;

    $scope.popup_attendance = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

                        instructorService.sign_attendance_coures($scope.instructor).then(function (response) {
                            
                        });


                    }
                }, toolbar: 'bottom'
            },


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
            $scope.popup_attendance_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
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

    $scope.bind = function () {
        instructorService.get_course_object($scope.course_id).then(function (response) {
            $scope.course = response.Data.course;
            $scope.sessions = response.Data.sessions;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        instructorService.get_people_sessions($scope.course_id).then(function (response) {

            console.log("----Resposne-----\n", response.Data)
            console.log("----Resposne Press-----\n", response.Data.press)

            $scope.sessions_attend = response.Data.sessions
            //$scope.exam_attendance = response.Data.people

            $scope.exam = { course_id: $scope.course_id, exam_date: '2024-10-14', scores : []}

            $.each(response.Data.people, function (_i, _p) {
                $scope.exam.scores.push({ Id: _p.Id, person_id: _p.PersonId, score: _p.ExamResult ,result: _p.ExamStatus,  Name: _p.Name });
            });



            console.log("----People----\n", response.Data.people);


            $.each($scope.sessions_attend, function (_i, _s) {
                console.log('---sessions_attend---\n', $scope.sessions_attend);
                _s.people = angular.copy(response.Data.people);
                _s.showDetails = false;
               
                $.each(_s.people, function (_j, _p) {
                    var press = Enumerable.From(response.Data.press).Where(function (x) { return x.SessionId == _s.Id && x.PersonId == _p.PersonId; }).FirstOrDefault();
                   
                    _p.press = !press ? 0 : press.IsPresent;
                    
                });
            });

            console.log("----Sessions Attend----\n", $scope.sessions_attend);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    }



    $scope.toggletrn_cardDetails = function (id) {
        var trainee = $scope.trainees.find(function (t) { return t.id === id; });
        trainee.showDetails = !trainee.showDetails;
    };


    //$scope.toggle_attendance_details = function (eid, sid) {
    //    var session = Enumerable.From($scope.sessions_attend).Where(function (x) { return x.Id == sid }).FirstOrDefault();
    //    var person = Enumerable.From(session.people).Where(function (x) { return x.Id == eid }).FirstOrDefault();


    //    person.showDetails = !person.showDetails;

    //};

    //$scope.toggle_attendance_details = function (eid, sid) {
    //    //var session = Enumerable.From($scope.sessions_attend).Where(function (x) { return x.Id == sid }).FirstOrDefault();
    //    //var person = Enumerable.From(session.people).Where(function (x) { return x.Id == eid }).FirstOrDefault();


    //    $.each($scope.sessions_attend, function (_i, _s) {
    //        $.each(_s.people, function (_j, _p) {
    //            if (_p.Id == eid && _s.Id == sid)
    //                _p.showDetails = true;
    //        });
    //    });

    //    console.log('-----sessions attend------\n', $scope.sessions_attend);

    //    //person.showDetails = !person.showDetails;

    //};

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

    //$scope.trainees = [
    //    { id: 1, name: 'AMIRHOSSEIN AKHLAGHI', presence: 90, score: 82, finalResult: 'Re-exam', showDetails: false },
    //    { id: 2, name: 'SEYED BAHRAM MADANI', presence: 100, score: '-', finalResult: 'Re-exam', showDetails: false },
    //    { id: 3, name: 'MAHDI RABIEI', presence: 85, score: 92, finalResult: 'Pass', showDetails: false },
    //    { id: 4, name: 'MOHSEN RAHIMI', presence: 100, score: 91, finalResult: 'Pass', showDetails: false },
    //    { id: 5, name: 'ALI RAJABI', presence: 100, score: 94, finalResult: 'Pass', showDetails: false },
    //    { id: 6, name: 'MOHAMMAD ALI GHADERI SAVIRI', presence: 100, score: 95, finalResult: 'Pass', showDetails: false },
    //    { id: 7, name: 'EHSAN SALIMI', presence: 90, score: 95, finalResult: 'Pass', showDetails: false },
    //    { id: 8, name: 'MOSTAFA BAHOUSH HASANJANI', presence: 70, score: 89, finalResult: 'Re-exam', showDetails: false },
    //    { id: 9, name: 'HAMIDREZA JABBARI', presence: 100, score: 90, finalResult: 'Pass', showDetails: false },
    //    { id: 10, name: 'POUYAN ABBASI', presence: 100, score: 95, finalResult: 'Pass', showDetails: false },
    //    { id: 11, name: 'SABA JOKAR', presence: 75, score: 100, finalResult: 'Pass', showDetails: false },
    //    { id: 12, name: 'VAHID NOROUZI KOKEH', presence: 0, score: '-', finalResult: 'Re-exam', showDetails: false }
    //];

    //$scope.sections = [
    //    {
    //        date: '2024-09-10',
    //        time: '08:00-10:00',
    //        trainees: [
    //            {
    //                id: 1,
    //                nationalCode: '0061686379',
    //                name: 'ALIREZA ABDOLALI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 2,
    //                nationalCode: '2281527123',
    //                name: 'AHAD BAGHERI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 3,
    //                nationalCode: '2281016986',
    //                name: 'ARMAN JAFARPOUR',
    //                department: 'QA',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 4,
    //                nationalCode: '4420357614',
    //                name: 'MOHAMMADHOSSEIN MIRAKHOR',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 5,
    //                nationalCode: '2281019748',
    //                name: 'MOHAMADREZA RAFIZADEH',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 6,
    //                nationalCode: '2301231623',
    //                name: 'ALI RAHMANI',
    //                department: 'Maintenance',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            }
    //        ]
    //    },
    //    {
    //        date: '2024-09-10',
    //        time: '10:00-12:00',
    //        trainees: [
    //            {
    //                id: 7,
    //                nationalCode: '0061686379',
    //                name: 'ALIREZA ABDOLALI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 8,
    //                nationalCode: '2281527123',
    //                name: 'AHAD BAGHERI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 9,
    //                nationalCode: '2281016986',
    //                name: 'ARMAN JAFARPOUR',
    //                department: 'QA',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 10,
    //                nationalCode: '4420357614',
    //                name: 'MOHAMMADHOSSEIN MIRAKHOR',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 11,
    //                nationalCode: '2281019748',
    //                name: 'MOHAMADREZA RAFIZADEH',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 12,
    //                nationalCode: '2301231623',
    //                name: 'ALI RAHMANI',
    //                department: 'Maintenance',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            }
    //        ]
    //    },
    //    {
    //        date: '2024-09-10',
    //        time: '14:00-16:00',
    //        trainees: [
    //            {
    //                id: 13,
    //                nationalCode: '0061686379',
    //                name: 'ALIREZA ABDOLALI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 14,
    //                nationalCode: '2281527123',
    //                name: 'AHAD BAGHERI',
    //                department: 'Flight Operation',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 15,
    //                nationalCode: '2281016986',
    //                name: 'ARMAN JAFARPOUR',
    //                department: 'QA',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 16,
    //                nationalCode: '4420357614',
    //                name: 'MOHAMMADHOSSEIN MIRAKHOR',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 17,
    //                nationalCode: '2281019748',
    //                name: 'MOHAMADREZA RAFIZADEH',
    //                department: 'Commercial',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            },
    //            {
    //                id: 18,
    //                nationalCode: '2301231623',
    //                name: 'ALI RAHMANI',
    //                department: 'Maintenance',
    //                presence: false,
    //                remark: '-',
    //                finalResult: '',
    //                showDetails: false
    //            }
    //        ]
    //    }
    //];

    $scope.$on('PageLoaded', function (event, prms) {
        $('.info-container').height($(window).height() - 100);
        $scope.bind();
    });

}]);


