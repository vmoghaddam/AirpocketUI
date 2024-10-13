'use strict';
app.factory('instructorService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};
   
    var _get_teacher_course = function (id) {

        var deferred = $q.defer();
        $http.get('https://fleet.flypersia.aero/apitrn/api/teacher/courses/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    var _get_course_object = function (id) {

        var deferred = $q.defer();
        $http.get('https://fleet.flypersia.aero/ztrn/api/course/view/object/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

   var _get_people_sessions = function (id) {

        var deferred = $q.defer();
       $http.get('https://fleet.flypersia.aero/apitrn/api/course/peoplesessions/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_teacher_course = _get_teacher_course;
    serviceFactory.get_course_object = _get_course_object;
    serviceFactory.get_people_sessions = _get_people_sessions;

   

    return serviceFactory;

}]);