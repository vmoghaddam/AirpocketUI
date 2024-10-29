'use strict';
app.controller('question_paging_controller', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', 'atoService', function ($scope, $location, authService, $routeParams, $rootScope, $window, atoService) {
    // Define the questions
    $scope.questions = [
        {
            Id: 0,
            question: 'پایتخت فرانسه کدام شهر است؟',
            options: [{ id: 0, title: 'پاریس' }, { id: 1, title: 'لندن' }, { id: 2, title: 'روم' }, { id: 3, title: 'برلین' },],
            dir: "rtl"
        },
        {
            Id: 1,
            question: 'Which planet is known as the Red Planet?',
            options: [{ id: 0, title: 'Mars' }, { id: 1, title: 'Jupiter' }, { id: 2, title: 'Earth' }, { id: 3, title: 'Saturn' }],
            dir: "ltr"
        }
        // Add more questions here
    ];

    $scope.currentQuestionIndex = 0;  // Start with the first question
    $scope.answers = [];  // To store user's answers

    // Function to move to the next question
    $scope.nextQuestion = function () {
        if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
            $scope.currentQuestionIndex++;
        }
    };

    // Function to move to the previous question
    $scope.prevQuestion = function () {
        if ($scope.currentQuestionIndex > 0) {
            $scope.currentQuestionIndex--;
        }
    };


    // Function to submit the exam
    $scope.submitExam = function () {
        console.log('User Answers:', $scope.answers);
        alert('Exam Submitted!');
        // Add additional logic to process the submitted answers
    };

    $scope.get_answer_class = function (d) {
        if (d == "rtl")
            return "right_class";
        else
            return "left_class";
    }

    $scope.save_answer = function (question, answer) {
        console.log(question, answer);

        $scope.answer_entity = {
            person_id: 308,
            question_id: question.Id,
            answer_id: Number(answer),

        }
        atoService.save_question_answer($scope.answer_entity).then(function (response) {

            console.log('----Save Answer Response', response)
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }

}]);
