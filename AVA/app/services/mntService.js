'use strict';
app.factory('mntService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getLLP = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/llp/' + id).then(function (results) {
            return results;
        });
    };
    var _getCheck = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/checks/aircraft/' + id).then(function (results) {
            return results;
        });
    };
    var _getADSB = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/adsbs/aircraft/' + id).then(function (results) {
            return results;
        });
    };
   var _getEngADSB = function (id) {

       return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/adsbs/engine/' + id).then(function (results) {
            return results;
        });
    };
     var _getEngLlp = function (id) {

       return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/llps/engine/' + id).then(function (results) {
            return results;
        });
    };

    var _getMntTotal = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/total').then(function (results) {
            return results;
        });
    };
    var _getEngine = function (engid, engno) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/eng/' + engid + '/' + engno).then(function (results) {
            return results;
        });
    };
    var _saveLLP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveADSB = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/adsb/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCheck = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/check/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

     var _saveEngStatus = function (entity) {
        var deferred = $q.defer();
         $http.post($rootScope.serviceMnt + 'api/mnt/engine/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

   var _saveEngLlp = function (entity) {
        var deferred = $q.defer();
       $http.post($rootScope.serviceMnt + 'api/mnt/engine/llp/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveEngAdsb = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/adsb/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deletEngAdsb = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/adsb/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

   var _deletAcCheck = function (entity) {
        var deferred = $q.defer();
       $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/check/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

  var _deletAcAdsb = function (entity) {
        var deferred = $q.defer();
      $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/adsb/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

  
     var _deletEngLlp = function (entity) {
        var deferred = $q.defer();
         $http.post($rootScope.serviceMnt + 'api/mnt/engine/llp/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDashboard = function () {
        //00000
        var deferred = $q.defer();
        $http.get( $rootScope.serviceMnt + 'api/mnt/dashboard/-1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;


         
    };
    ordersServiceFactory.getDashboard = _getDashboard;

    ordersServiceFactory.getLLP = _getLLP;
    ordersServiceFactory.getADSB = _getADSB;
    ordersServiceFactory.getCheck = _getCheck;
    ordersServiceFactory.getEngADSB = _getEngADSB;
    ordersServiceFactory.getEngLlp = _getEngLlp;
    ordersServiceFactory.getMntTotal = _getMntTotal;
    ordersServiceFactory.getEngine = _getEngine;


    ordersServiceFactory.saveLLP = _saveLLP;
    ordersServiceFactory.saveADSB = _saveADSB;
    ordersServiceFactory.saveCheck = _saveCheck;
    ordersServiceFactory.saveEngStatus = _saveEngStatus;
    ordersServiceFactory.saveEngLlp = _saveEngLlp;
    ordersServiceFactory.saveEngAdsb = _saveEngAdsb;


    ordersServiceFactory.deleteEngAdsb = _deletEngAdsb;
    ordersServiceFactory.deleteAcCheck = _deletAcCheck;
    ordersServiceFactory.deleteAcAdsb = _deletAcAdsb;
    ordersServiceFactory.deleteEngLlp = _deletEngLlp;

    return ordersServiceFactory;

}]);