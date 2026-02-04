'use strict';
app.factory('neerjaService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};
    var apicore='https://faap.api.airpocket.app/';
    var _get_pfc_items = function (flt_id) {
      
        var deferred = $q.defer();
        $http.get(apicore + 'neerja/pfc/items/' + flt_id + '/' + $rootScope.employeeId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_pfc_items = _get_pfc_items;


    var _get_pfc_items_grouped = function (flt_id) {

        var deferred = $q.defer();
        $http.get(apicore + 'neerja/pfc/items/grouped/' + flt_id + '/' + $rootScope.employeeId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_pfc_items_grouped = _get_pfc_items_grouped;
	
	
	 var _get_pfc_items_grouped_ap = function (flt_id, crew_id) {

     var deferred = $q.defer();
     $http.get('https://faap.api.airpocket.app/neerja/pfc/items/grouped/' + flt_id + '/' + crew_id).then(function (response) {
         deferred.resolve(response.data);
     }, function (err, status) {

         deferred.reject(Exceptions.getMessage(err));
     });

     return deferred.promise;
 };

 serviceFactory.get_pfc_items_grouped_ap = _get_pfc_items_grouped_ap;


    var _get_scc = function (flt_id, crew_id) {

        var deferred = $q.defer();
        $http.get(apicore + 'neerja/scc/' + flt_id + '/' + crew_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.get_scc = _get_scc;

    var _save_items = function (entity) {
        var deferred = $q.defer();

        $http.post(apicore + 'neerja/pfc/items/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_items = _save_items;


    var _save_scc = function (entity) {
        var deferred = $q.defer();

        $http.post(apicore + 'neerja/scc/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _get_eval = function (flightid, reporterid) {
        var deferred = $q.defer();

        $http.get(apicore + 'neerja/get/evaluation/report/' + flightid + '/' + reporterid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	  var _get_scc_report = function (crew_id, fligth_id) {
        var deferred = $q.defer();

        $http.get(apixls + 'api/scc/report/' + crew_id + '/' + fligth_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_scc = _save_scc;
    serviceFactory.get_eval = _get_eval;
    serviceFactory.get_scc_report = _get_scc_report;

    return serviceFactory;

}]);