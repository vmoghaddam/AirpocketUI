'use strict';
app.factory('cmsService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var api_cms = 'http://localhost:9070/';
    var serviceFactory = {};


    var token = "-";

    var _get_reports = function (df,dt,type,register,flight_id) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/reports/'+token+'?df='+df+'&dt='+dt+'&type='+type+'&register='+register+'&flight_id='+flight_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_reports = _get_reports;


    var _get_audit = function (id) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/audit/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_audit = _get_audit;


    var _save_audit = function (entity) {
        var deferred = $q.defer();
        $http.post(api_cms + 'api/cms/save/audit', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.save_audit = _save_audit;


    return serviceFactory;


}]);