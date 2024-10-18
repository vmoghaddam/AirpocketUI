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
    var _getBookFiles = function (id) {


        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/library/book/files/' + id).then(function (response) {
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
    var _getPersonLibrary = function (id) {
         
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/library/' + id).then(function (response) {
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

    var _deleteBookFile = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/library/book/file/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/library/move

    var _move = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/library/move', entity).then(function (response) {
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
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/library/book/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ////////////Library Folder/////////////
     
    var _getFolders = function (cid, top) {

        var deferred = $q.defer();
        $http.get(serviceBase +'odata/base/library/folders/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveChapter = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/library/chapters/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFolder = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/library/folders/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteFolder = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/library/folders/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteChapter = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/library/chapters/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    ///////////////////////////////////////






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
    serviceFactory.save = _save;
    serviceFactory.delete = _delete;
    serviceFactory.saveFolder = _saveFolder;
    serviceFactory.saveChapter = _saveChapter;
    serviceFactory.exposeBook = _exposeBook;
    serviceFactory.move = _move;
    serviceFactory.getBook = _getBook;
    serviceFactory.getBookFiles = _getBookFiles;
    serviceFactory.getPersonLibrary = _getPersonLibrary;
    serviceFactory.getKeywords = _getKeywords;
    serviceFactory.getBookApplicableEmployees = _getBookApplicableEmployees;
    serviceFactory.getLastExposed = _getLastExposed;
    serviceFactory.deleteFolder = _deleteFolder;
    serviceFactory.deleteChapter = _deleteChapter;
    serviceFactory.getFolders = _getFolders;
    serviceFactory.deleteBookFile = _deleteBookFile;
    return serviceFactory;

}]);