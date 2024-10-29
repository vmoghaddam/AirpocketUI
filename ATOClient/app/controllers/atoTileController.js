'use strict';
app.controller('atoTileController', ['$scope', '$location', '$routeParams', '$rootScope', '$route', '$window', '$timeout', 'authService',
    function ($scope, $location, $routeParams, $rootScope, $route, $window, $timeout, authService) {
        $scope.prms = $routeParams.prms;

        ///////////////////////////////////

        // Bind the data from the JSON provided
        $scope.exam_result = [
            {
                exam_id: 1,
                person_id: 345,
                name: 'ALI DEHGHAN',
                true_answers: '58%',
                false_answers: '42%',
                result: 'PASSED',
                exam_question_count: '45',
                answers_count: '27',
            },
            {
                exam_id: 1,
                person_id: 347,
                name: 'VAHID MOGHADDAM',
                true_answers: '50%',
                false_answers: '50%',
                result: 'RE-EXAM',
                exam_question_count: '45',
                answers_count: '45',
            },
            {
                exam_id: 1,
                person_id: 143,
                name: 'AGHA TRUMP',
                true_answers: '25%',
                false_answers: '75%',
                result: 'FAILED',
                exam_question_count: '45',
                answers_count: '43',
            },
            {
                exam_id: 1,
                person_id: 3345,
                name: 'SAHAR BOLANDI',
                true_answers: '78%',
                false_answers: '22%',
                result: 'PASSED',
                exam_question_count: '45',
                answers_count: '36',
            }
        ];

        // Calculate the width of the progress bar based on the count of answers
        $scope.getProgressBarWidth = function (answersCount, questionCount) {
            return (parseInt(answersCount) / parseInt(questionCount)) * 100;
        };

        ///////////////////////
        if (!authService.isAuthorized()) {
            authService.redirectToLogin();
        } else {
            $rootScope.page_title = '> Profile';
            $('.profile').fadeIn();
        }

        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                // Additional initialization if needed
            }, 500);
        });

        $rootScope.$broadcast('ProfileLoaded', null);
        ///end
    }]);
