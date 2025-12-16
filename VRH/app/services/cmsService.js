'use strict';
app.factory('qahService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var api_cms = 'http://localhost:9070/';
    var serviceFactory = {};


    var token = "-";

    var _get_reports = function (df,dt,type,register) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/reports/'+token+'?df='+df+'&dt='+dt+'type='+type+'&register='+register).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_reports = _get_reports;

    return serviceFactory;


}]);