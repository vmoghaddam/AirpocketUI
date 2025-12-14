'use strict';
app.factory('fuelService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
	
	
	var _getFuelReport = function (df,dt ) {
        var deferred = $q.defer();
        $http.get(zfuel+"api/fuel/report/"+'?dfrom=' + df+'&dto='+dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFuelReport = _getFuelReport;
	
	
	    return serviceFactory;

}]);