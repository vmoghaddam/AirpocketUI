'use strict';
app.factory('qalogService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

     

    var _getFlightLogMain = function ( from, to ) {
        var url = zapiqa + 'api/qa/log/main/?df=' + from +'&dt='+to;
       

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    
    serviceFactory.getFlightLogMain = _getFlightLogMain;
	
	
	
	var _getFlightLogDetail = function ( fid ) {
        var url = zapiqa + 'api/qa/log/detail/' + fid;
       

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    
    serviceFactory.getFlightLogDetail = _getFlightLogDetail;
	
	 var _getProfiles = function () {

        var deferred = $q.defer();
        $http.get(zapiqa + 'api/qa/profiles?grp=-1'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getProfiles = _getProfiles;


    var _getProfileLog = function (id) {

        var deferred = $q.defer();
        $http.get(zapiqa + 'api/qa/log/profile?id='+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getProfileLog = _getProfileLog;
	
	   serviceFactory.getProfileLog = _getProfileLog;
	
	
	  var _getDutyLog = function (id) {

        var deferred = $q.defer();
        $http.get(zapiqalog + 'api/qa/log/profile/duty?id='+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getDutyLog = _getDutyLog;
	
	 var _getProfilesCrew = function () {

        var deferred = $q.defer();
        $http.get(zapiqalog + 'api/qa/profiles/crew?grp=-1'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getProfilesCrew = _getProfilesCrew;


    return serviceFactory;

}]);