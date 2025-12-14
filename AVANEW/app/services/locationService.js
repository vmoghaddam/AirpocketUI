'use strict';
app.factory('locationService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getlocations = function (cid) {

        return $http.get(serviceBase + 'odata/locations/customer/' + cid +'?parentIds=-1&$orderby=FullCode').then(function (results) {
             
           // console.log(results);

            return results;
        }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
    };

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/locations/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/locations/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.getLocations = _getlocations;
    serviceFactory.save = _save;
    serviceFactory.delete = _delete;
    return serviceFactory;

}]);