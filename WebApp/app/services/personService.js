'use strict';
app.factory('personService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getEmployee = function (nid,cid) {

        
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employee/nid/'+cid+'/' + nid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getEmployeeForView = function (nid, cid) {


        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employee/view/nid/' + cid + '/' + nid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getEmployeesByGroupId = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/group/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getEmployeesByGroupCode = function (code) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/group/code/' + code).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/employee/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _active = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/employee/active', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveMisc = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/person/misc/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveMatchingList = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/matchinglist/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/person/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteMisc = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/person/misc/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteMatchingList = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/matchinglist/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getCrewLight = function (cid,id) {


        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/light/crew/'+cid+'?$filter=Id eq '+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _saveHistory = function (entity) {


        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/person/history/save/' ,entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    serviceFactory.saveHistory = _saveHistory;
    serviceFactory.getCrewLight = _getCrewLight;

    serviceFactory.getEmployee = _getEmployee;
    serviceFactory.getEmployeeForView = _getEmployeeForView;
    serviceFactory.getEmployeesByGroupId = _getEmployeesByGroupId;
    serviceFactory.getEmployeesByGroupCode = _getEmployeesByGroupCode;
    serviceFactory.active = _active;
    serviceFactory.save = _save;
    serviceFactory.saveMisc = _saveMisc;
    serviceFactory.saveMatchingList = _saveMatchingList;
    serviceFactory.delete = _delete;
    serviceFactory.deleteMisc = _deleteMisc;
    serviceFactory.deleteMatchingList = _deleteMatchingList;
    return serviceFactory;

}]);