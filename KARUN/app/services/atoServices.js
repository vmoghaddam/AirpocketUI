'use strict';
app.factory('atoService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _save_question_answer = function (entity) {
        var deferred = $q.defer();
        console.log('----service----', entity)
        $http.post("https://ava.apitrn.airpocket.app/api/exam/student/answer", entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.save_question_answer = _save_question_answer;

    var _get_questions_list = function (exam_id) {

        var deferred = $q.defer();
        $http.get("http://localhost:4005/" + 'api/exam/questions/' + exam_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_questions_list = _get_questions_list;

    return serviceFactory;

}]);