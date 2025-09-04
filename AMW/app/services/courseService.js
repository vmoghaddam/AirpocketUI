'use strict';
app.factory('courseService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getCourse = function (id) {

        //return $http.get(serviceBase + 'odata/course/' + id  ).then(function (results) {

        //    // console.log(results);

        //    return results;
        //}
        //    //    , function (error) { console.log('errors'); console.log(error); }
        //);
        
        

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/course/' + id  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getActiveCourse = function (id) {

         

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/course/active/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonActiveCourse = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/activecourses/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getPersonLastCertificates = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/certificates/last/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };



    var _getPersonAllCertificates = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/certificates/all/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/courses/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveType = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/courses/types/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveCertificate = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/certifications/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCertificate = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/certifications/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/courses/types/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/courses/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _changeStatus = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/course/active/changeStatus', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourse = _getCourse;
    serviceFactory.getActiveCourse = _getActiveCourse;
    serviceFactory.getPersonActiveCourse = _getPersonActiveCourse;
    serviceFactory.getPersonLastCertificates = _getPersonLastCertificates;
    serviceFactory.getPersonAllCertificates = _getPersonAllCertificates;
    serviceFactory.save = _save;
    serviceFactory.saveType = _saveType;
    serviceFactory.saveCertificate = _saveCertificate;
    serviceFactory.changeStatus = _changeStatus;
    serviceFactory.delete = _delete;
    serviceFactory.deleteCertificate = _deleteCertificate;
    serviceFactory.deleteCourseType = _deleteCourseType;
    
    return serviceFactory;

}]);