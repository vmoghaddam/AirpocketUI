'use strict';
app.factory('libraryService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    var _getKeywords = function () {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/library/keywords'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getBook = function (id) {

         
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/library/book/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
var _getEmployeeBook = function (id,itemId) {

         
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/library/item/' + id+"/"+itemId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getBookApplicableEmployees = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/library/books/applicable/employees/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonLibrary = function (id,type) {
         
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/library/' + id+(type?'/'+type:'')).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getLastExposed = function (cid,   top) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/library/exposed/' + cid +'?orderby=DateExposure desc&top='+top).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _exposeBook = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/library/book/expose', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/library/book/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //var _delete = function (entity) {
    //    var deferred = $q.defer();
    //    $http.post($rootScope.serviceUrl + 'odata/locations/delete', entity).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {

    //        deferred.reject(Exceptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //};

    //serviceFactory.getEmployee = _getEmployee;
    var _getFoldersItems = function (uid, fid,pid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/base/library/employee/folder/' + uid+'/'+fid+'/'+pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save = _save;
    serviceFactory.exposeBook = _exposeBook;
    serviceFactory.getBook = _getBook;
    serviceFactory.getEmployeeBook=_getEmployeeBook;
    serviceFactory.getPersonLibrary = _getPersonLibrary;
    serviceFactory.getKeywords = _getKeywords;
    serviceFactory.getBookApplicableEmployees = _getBookApplicableEmployees;
    serviceFactory.getLastExposed = _getLastExposed;
    serviceFactory.getFoldersItems = _getFoldersItems;
    //serviceFactory.delete = _delete;
    return serviceFactory;

}]);