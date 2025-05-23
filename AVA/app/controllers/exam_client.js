﻿'use strict';
app.controller('exam_client_controller', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', '$interval', 'atoService',
    function ($scope, $location, authService, $routeParams, $rootScope, $window, $interval, atoService) {

        $scope.windowHeight = $(window).height();
        $scope.height_dy = 150;
        $scope.prms = $routeParams.prms;
        $scope.exam_id = $routeParams.id;
        $scope.cid = $routeParams.cid;
        $scope.status_id = 0;
        var storedUserData = localStorage.getItem('profile')

        if (storedUserData) {
            var profile = JSON.parse(storedUserData)
            $scope.person_id = profile.Id;
            console.log($scope.person_id);
            // You can use userData here...
        } else {
            console.log('User data not found in local storage');
            $scope.person_id = $scope.cid;
        }



        $scope.currentQuestionIndex = 0;
        $scope.answers = [];

        $scope.nextQuestion = function () {
            if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
                $scope.currentQuestionIndex++;
            }
        };


        $scope.prevQuestion = function () {
            if ($scope.currentQuestionIndex > 0) {
                $scope.currentQuestionIndex--;
            }
        };



        $scope.submitExam = function () {
            //  console.log('User Answers:', $scope.answers);
            //  alert('Exam Submitted!');
        };

        $scope.get_answer_class = function (d) {
            if (d == "rtl")
                return "right_class";
            else
                return "left_class";
        }

        $scope.save_answer = function (question_id, answer_id) {
            console.log(question_id, answer_id);




            atoService.save_ato_exam_answer($scope.person_id, question_id, answer_id).then(function (response) {

                $scope.refresh_summary();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        $scope.formatDate = function (dt) {
            if (!dt)
                return "unknown";
            return moment(new Date(dt)).format('YYYY-MMM-DD').toUpperCase();
        };
        $scope.formatTime = function (dt) {
            if (!dt)
                return "unknown";
            return moment(new Date(dt)).format('HH:mm').toUpperCase();
        };

        $scope.formatDateTime = function (dt) {
            if (!dt)
                return "unknown";
            return moment(new Date(dt)).format('YYYY-MMM-DD (ddd) HH:mm').toUpperCase();
        };

        $scope.bind = function () {
            atoService.get_ato_exam($scope.exam_id, $scope.person_id).then(function (response) {
                console.log('---Get Exam----', response);
                $.each(response.Data.questions, function (_i, _d) {
                    _d.id2 = _d.id;
                });
                $scope.exam = response.Data.exam;
                $scope.status_id = $scope.exam.status_id;
                $scope.questions = response.Data.questions;

                $scope.profile = response.Data.profile;
                $scope.total_questions = response.Data.toal_questions;
                $scope.total_answered = response.Data.total_answerd;
                $scope.total_remained = response.Data.total_remained;
                $scope.refresh_summary();
                if ($scope.cid) {
                    $scope.status_id = 2;
                }
                else
                    $scope.startTimer();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }

        //get_exam_summary
        $scope.refresh_summary = function () {
            atoService.get_exam_summary($scope.exam_id, $scope.person_id).then(function (response) {


                $scope.total_questions = response.Data.total_questions;
                $scope.total_answered = response.Data.total_answered;
                $scope.total_remained = response.Data.total_remained;
                $scope.date_start = response.Data.date_start;
                $scope.date_end = response.Data.date_end;
                $scope.status_id = response.Data.status_id;
                $scope.duration = response.Data.duration;
                $scope.passed_minutes = response.Data.passed_minutes;
                $scope.remained_minutes = response.Data.remained_minutes;
                $scope.score = response.Data.score;
                $scope.correct_answer = response.Data.correct_answer;
                $scope.wrong_answer = response.Data.wrong_answer;
                $scope.negative_point = response.Data.negative_point;
                $scope.result = response.Data.result;
                $scope.result_id = response.Data.result_id;

                if ($scope.status_id != 0 && (!$scope.questions || $scope.questions.length == 0) && $scope.total_questions > 0)
                    $window.location.reload();
                if ($scope.status_id == 0)
                    $scope.questions = [];

                if ($scope.cid) {
                    $scope.status_id = 2;
                }


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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

        // Clean up the timer on scope destroy
        $scope.$on('$destroy', function () {
            $scope.stopTimer();
        });
        $scope.$on('PageLoaded', function (event, prms) {

        });

        $scope.bind();



        $scope.isModalVisible = false;

        $scope.openModal = function () {

            $scope.isModalVisible = true;
        };

        $scope.closeModal = function () {
            $scope.isModalVisible = false;
        };

        $scope.confirmAction = function () {
            $scope.isModalVisible = false;
            atoService.close_exam({ person_id: $scope.person_id, exam_id: $scope.exam_id }).then(function (response) {

                $window.location.reload();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };

        $scope.get_answer_title_class = function (ans) {
            if (ans.is_answer == 1)
                return 'correct_answer';
            return '';
        }

        $scope.get_result_class = function () {
            return $scope.result;
        }




    }]);
