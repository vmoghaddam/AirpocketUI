'use strict';
app.factory('statService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _getDelayStat = function (cid,df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/report/delay/daily/'+cid+'?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayStatYearly = function (cid ) {
       
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/report/delay/yearly/' + cid  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    serviceFactory.getDelayStat = _getDelayStat;
    serviceFactory.getDelayStatYearly = _getDelayStatYearly;

    return serviceFactory;

}]);