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


    var _get_person_info = function (dto) {
        var deferred = $q.defer();
       
        $http.post("http://localhost:9066/" + "api/ato/client/profile", dto).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_person_info = _get_person_info;

    


    var _get_ato_exam = function (exam_id, client_id) {
        var deferred = $q.defer();
        $http.get('http://localhost:9066/' + 'api/ato/client/exam/' + exam_id + '/' + client_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_ato_exam = _get_ato_exam;


    var _save_ato_exam_answer = function (exam_id, client_id, answer_id) {
        var deferred = $q.defer();
        $http.post('http://localhost:9066/' + 'api/ato/client/exam/anwser/save/' + exam_id + '/' + client_id + '/' + answer_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_ato_exam_answer = _save_ato_exam_answer;


    return serviceFactory;
}]);