'use strict';
app.factory('recencyService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getCockpit = function () {
         
        var deferred = $q.defer();
        $http.get(zapiScheduling + 'api/cockpit').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 serviceFactory.getCockpit = _getCockpit;
	 
	 
	 var _getRoutes = function () {
         
        var deferred = $q.defer();
        $http.get(zapiScheduling + 'api/recency/routes').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 serviceFactory.getRoutes = _getRoutes;
	
	
	
	 var _getRecencyCrew = function (id) {
         
        var deferred = $q.defer();
        $http.get(zapiScheduling + 'api/recency/crew/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	serviceFactory.getRecencyCrew=_getRecencyCrew;
	
	
	 var _getRecencyRoute = function (route) {
         
        var deferred = $q.defer();
        $http.get(zapiScheduling + 'api/recency/route/'+route).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	serviceFactory.getRecencyRoute=_getRecencyRoute;
	
	var _getRecencyAll = function () {
         
        var deferred = $q.defer();
        $http.get(zapiScheduling + 'api/recency/crew/all/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	serviceFactory.getRecencyAll=_getRecencyAll;

     
    var _saveCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/types/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
   
    return serviceFactory;

}]);