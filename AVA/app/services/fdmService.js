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

    var _get_fmd_crew_phase = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/eventsCrewPhase/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_crew_phase = _get_fmd_crew_phase;


    var _get_fmd_route = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/eventsRoute/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_route = _get_fmd_route;


    var _get_fmd_events = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/events/all/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_events = _get_fmd_events;



    var _get_fmd_crew_id = function (cid,dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/crew/"+cid+"/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_crew_id = _get_fmd_crew_id;

    var _get_fmd_crew_phase_id = function (cid,dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/crew/phase/"+cid+"/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_crew_phase_id = _get_fmd_crew_phase_id;

    var _get_fmd_crew_phase_route_id = function (cid,dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/crew/route/phase/"+cid+"/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_crew_phase_route_id = _get_fmd_crew_phase_route_id;



    ///////war
     



    return serviceFactory;

}]);