'use strict';
app.factory('qahService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var apiqah='https://zscheduling.apvaresh.com/';
    var serviceFactory = {};
	
	 var _saveRegister = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
        $http.post(apiqah + 'api/sch/qa/register/save', entity).then(function (response) {
            deferred.resolve(response.data);
          }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
	serviceFactory.saveRegister = _saveRegister;
	
	
	
	 var _getRegister = function (fid, type) {
        var deferred = $q.defer();
        $http.get(apiqah + 'api/sch/qa/register/' + '/' + fid + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
	serviceFactory.getRegister = _getRegister;
	
	var _getHazardLog = function () {
        var deferred = $q.defer();
        $http.get(apiqah + 'api/sch/qa/hazard/logs/'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
	serviceFactory.getHazardLog = _getHazardLog;
	
	return serviceFactory;

}]);