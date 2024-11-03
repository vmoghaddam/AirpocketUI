'use strict';
app.factory('instructorService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _get_instructor_course = function (id) {

        var deferred = $q.defer();
        $http.get('https://ava.apitrn.airpocket.app/api/instructor/courses/active/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _get_director_course = function (id) {

        var deferred = $q.defer();
        $http.get('https://ava.apitrn.airpocket.app/api/director/courses/active/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _get_course_object = function (id) {

        var deferred = $q.defer();
        $http.get('https://ava.apitrn.airpocket.app/api/course/view/object/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _get_people_sessions = function (id) {

        var deferred = $q.defer();
        $http.get('https://ava.apitrn.airpocket.app/api/course/peoplesessions/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _save_person_press = function (entity) {

        var deferred = $q.defer();
        $http.post('https://ava.apitrn.airpocket.app/api/course/session/pres/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _save_exam_result = function (entity) {

        var deferred = $q.defer();
        $http.post('https://ava.apitrn.airpocket.app/api/course/exam/result/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _sign_attendance_coures = function (entity) {

        var deferred = $q.defer();
        $http.post('https://ava.apitrn.airpocket.app/api/course/sign', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _sign_exam_coures = function (entity) {

        var deferred = $q.defer();
        $http.post('https://ava.apitrn.airpocket.app/api/course/exam/sign', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _get_questions_list = function (exam_id) {

        var deferred = $q.defer();
        $http.get("http://localhost:4005/" + 'api/exam/questions/' + exam_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };


    serviceFactory.get_instructor_course = _get_instructor_course;
    serviceFactory.get_director_course = _get_director_course;
    serviceFactory.get_course_object = _get_course_object;
    serviceFactory.get_people_sessions = _get_people_sessions;
    serviceFactory.get_questions_list = _get_questions_list;


    serviceFactory.save_person_press = _save_person_press;
    serviceFactory.save_exam_result = _save_exam_result;

    serviceFactory.sign_attendance_coures = _sign_attendance_coures;
    serviceFactory.sign_exam_coures = _sign_exam_coures;

    


    return serviceFactory;

}]);