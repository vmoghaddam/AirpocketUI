'use strict';
app.factory('fdmService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};
    //------EWMA--------------------------------
    var _get_fmd_ewma_all = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/EWMAAllEvents/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_ewma_all = _get_fmd_ewma_all;
    var _get_fmd_ewma_captain = function (dt1, dt2,cid) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/EWMACpt/" + dt1 + "/" + dt2 + "/" + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_ewma_captain = _get_fmd_ewma_captain;
    //----------Pareto-------------------------------
    var _get_fmd_all_pareto = function (dt1, dt2,top) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/ParetoEvent/" + dt1 + "/" + dt2 + "/" +top).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_all_pareto = _get_fmd_all_pareto;

    var _get_fmd_cpt_pareto = function (dt1, dt2, top,cpt_id) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/ParetoEventCpt/" + dt1 + "/" + dt2 + "/" + top + "/" + cpt_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_cpt_pareto = _get_fmd_cpt_pareto;
    //-----------------------------------------------------------------
    var _get_fmd_cpt_fo = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/eventsCptFo/" + dt1 + "/" + dt2 ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_cpt_fo = _get_fmd_cpt_fo;
    //-----------------------------------------------------------------
    var _get_fmd_monthlyCPT = function (dt1, dt2) {
        var deferred = $q.defer();
        $http.get(api_fdm + "api/fdm/V2/MonthlyCPT/" + dt1 + "/" + dt2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
        });
        return deferred.promise;
    };
    serviceFactory.get_fmd_monthlyCPT = _get_fmd_monthlyCPT;


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

    var _get_fmd_event_info = function ( dt1, dt2,type,register_id,cpt_id,route,phase) {
        var deferred = $q.defer();
        console.log(api_fdm+"api/fdm/V2/eventsInfo/" + dt1 + "/" + dt2 + "/" + type + "/" + register_id + "/" + cpt_id + "/" + encodeURIComponent(route) + "/" + phase + "/");
        $http.get(api_fdm + "api/fdm/V2/eventsInfo/" +  dt1 + "/" + dt2 + "/" + type + "/" + register_id + "/" + cpt_id + "/" + encodeURIComponent(route) + "/"+phase+"/").then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    serviceFactory.get_fmd_event_info = _get_fmd_event_info;


    return serviceFactory;

}]);