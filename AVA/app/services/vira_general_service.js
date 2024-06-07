'use strict';
app.factory('vira_general_service', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$rootScope', function ($http, $q, localStorageService, ngAuthSettings, $rootScope) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _get_part_type = function () {
        var deferred = $q.defer();

        $http.get(vira_api + "api/CMPPartType/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_part_type = _get_part_type;

     var _get_position = function () {
        var deferred = $q.defer();

         $http.get(vira_api + "api/CMPPosition/GetAllPagination?page=1&size=1000", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_position = _get_position;

    var _add_part_type = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/CMPPartType/Add", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_part_type = _add_part_type;

    var _get_user_location = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/UMUser/GetUserLocationList", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_user_location = _get_user_location;

   var _validate_request = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSRequest/ValidateRequestItems", entity, {


       }).then(function (response) {
           deferred.resolve(response.data.errorCode);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.validate_request = _validate_request;

   var _add_request = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSRequest/Add", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_request = _add_request;

   var _get_request_cartable = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSStockManagement/GetRequestCartable?page=1&size:1000", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable = _get_request_cartable;

   var _get_request_cartable_item = function () {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSStockManagement/GetRequestItemCartable", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable_item = _get_request_cartable_item;

     var _get_partnumebr_interchabge = function () {
        var deferred = $q.defer();

         $http.post(vira_api + "api/LGSStockManagement/GetPartNumberInterchange", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_partnumebr_interchabge = _get_partnumebr_interchabge;

    var _get_stock_paper = function () {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetStockPaper?page=1&size=1000", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_stock_paper = _get_stock_paper;

    var _get_beginning_inventory = function (id) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetBeginningInventory?locationId=" + id ,  {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_beginning_inventory = _get_beginning_inventory;

    return ordersServiceFactory;

}]);