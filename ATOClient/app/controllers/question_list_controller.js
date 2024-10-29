'use strict';
app.controller('question_list_controller', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', 'atoService', function ($scope, $location, authService, $routeParams, $rootScope, $window, atoService) {

    $scope.windowHeight = $(window).height()


    var storedUserData = localStorage.getItem('profile')

    if (storedUserData) {
        var profile = JSON.parse(storedUserData)
        $scope.person_id = profile.Id;
        console.log($scope.person_id);
        // You can use userData here...
    } else {
        console.log('User data not found in local storage')
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
        console.log('User Answers:', $scope.answers);
        alert('Exam Submitted!');
    };

    $scope.get_answer_class = function (d) {
        if (d == "rtl")
            return "right_class";
        else
            return "left_class";
    }

    $scope.save_answer = function (question_id, answer_id) {
        console.log(question_id, answer_id);

        //$scope.answer_entity = {
        //    person_id: 308,
        //    question_id: question.Id,
        //    answer_id: Number(answer),

        //}

      
        atoService.save_ato_exam_answer($scope.person_id, question_id, answer_id).then(function (response) {

            console.log('----Save Answer Response', response)
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }


    $scope.bind = function() {
        atoService.get_ato_exam(1, 4901).then(function (response) {
            console.log('---Get Exam----', response);

            $scope.exam = response.Data.exam;
            $scope.questions = response.Data.questions;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }

    $scope.$on('PageLoaded', function (event, prms) {
        
    });

    $scope.bind();

}]);
