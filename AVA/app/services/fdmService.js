'use strict';
app.factory('fdmService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    var _get_fmd_all = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/events/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_all = _get_fmd_all;


    var _get_fmd_crew = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/eventsCrew/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_crew = _get_fmd_crew;


    //var _get_fmd_route = function (dt1, dt2) {
    //    var deferred = $q.defer();
    //    $http.get(api_fdm + "api/fdm/V2/eventsCrew/" + dt1 + "/" + dt2).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}
    //serviceFactory.get_fmd_route = _get_fmd_route;



    return serviceFactory;

}]);