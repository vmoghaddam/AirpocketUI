'use strict';
app.factory('jobgroupService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getGroups = function (cid) {

        return $http.get(serviceBase + 'odata/base/jobgroups/' + cid ).then(function (results) {

            // console.log(results);

            return results;
        }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
    };

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/jobgroups/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/base/jobgroups/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.getGroups = _getGroups;
    serviceFactory.save = _save;
    serviceFactory.delete = _delete;
    return serviceFactory;

}]);