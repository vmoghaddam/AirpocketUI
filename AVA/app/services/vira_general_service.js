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

    return ordersServiceFactory;

}]);