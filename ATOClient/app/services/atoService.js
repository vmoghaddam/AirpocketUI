'use strict';
app.factory('atoService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _save_question_answer = function (entity) {
        var deferred = $q.defer();
        console.log('----service----', entity)
        $http.post(api_ato+"api/exam/student/answer", entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.save_question_answer = _save_question_answer;


    var _get_person_info = function (dto) {
        var deferred = $q.defer();

        $http.post(api_ato_client + "api/ato/client/profile", dto).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_person_info = _get_person_info;




    var _get_ato_exam = function (exam_id, client_id) {
        var deferred = $q.defer();
        $http.get(api_ato_client + 'api/ato/client/exam/' + exam_id + '/' + client_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_ato_exam = _get_ato_exam;


    var _save_ato_exam_answer = function (exam_id, client_id, answer_id) {
        var deferred = $q.defer();
        $http.post(api_ato_client + 'api/ato/client/exam/anwser/save/' + exam_id + '/' + client_id + '/' + answer_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_ato_exam_answer = _save_ato_exam_answer;



    var _get_instructor_course = function (id) {

        var deferred = $q.defer();
        $http.get(api_ato+'api/person/courses/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_instructor_course = _get_instructor_course;


    var _get_person_certificates = function (id) {

        var deferred = $q.defer();
        $http.get('https://ava.api.airpocket.app/api/crew/certificates/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_person_certificates = _get_person_certificates;

    var _get_person_exam = function (id) {

        var deferred = $q.defer();
        $http.get(api_ato_client + 'api/ato/client/exams/scheduled/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_person_exam = _get_person_exam;


    return serviceFactory;
}]);