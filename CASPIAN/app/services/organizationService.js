'use strict';
app.factory('organizationService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getOrders = function () {

        return $http.get(serviceBase + 'odata/options/all/1').then(function (results) {
            console.log('orders');
            console.log(results);

            return results;
        }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
    };

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/organizations/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/organizations/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getOrders = _getOrders;
    serviceFactory.save = _save;
    serviceFactory.delete = _delete;
    return serviceFactory;

}]);