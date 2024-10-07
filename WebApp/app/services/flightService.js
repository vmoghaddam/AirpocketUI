'use strict';
app.factory('flightService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    var _getRoutes = function (airlineid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/routes/airline/' + airlineid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRoute = function (from, to) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/route/' + from + '/' + to).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/flights/routes/destination/airline/{id}/{from}
    var _getRouteDestination = function (airlineid, from) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/routes/destination/airline/' + airlineid + '/' + from).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAirportByIATA = function (iata) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/airport/iata/' + iata).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getAverageRouteTime = function (from, to) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/routes/averagetime/' + from + '/' + to).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlights = function (cid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/customer/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getBoxFlights = function (bid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/box/' + bid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/plan/checkerrors/{id}
    var _checkPlanErrors = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/plan/checkerrors/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightsGrouped = function (cid, from, to) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/grouped/' + cid + '/' + from + '/' + to).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightsByRegister = function (cid, airport, register, from, to) {

        //odata/flights/register/{cid}/{airport}/{register}/{from}/{to}

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/register/' + cid + '/' + airport + '/' + register + '/' + from + '/' + to).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //2020-11-16
    var _getRealRegisters = function (cid) {

        //odata/flights/register/{cid}/{airport}/{register}/{from}/{to}

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafts/customer/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getDelayCodes = function () {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/delaycodes').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCodeCats = function () {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/delaycodecats').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightDelayCodes = function (fid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/delaycodes/' + fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightDelays = function (fid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/' + fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getUpdatedFlights = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/updated/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getUpdatedFlightsNew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/updated/new/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanBase = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/base/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItemsGantt = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/items/gantt/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItemsGanttCrewTest = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/items/gantt/crewtest', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItemsGanttCrewAssignReg = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/items/gantt/crew/assign/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //getPlanLastItem
    var _getPlanLastItem = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/last/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanLastItemByPlan = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/last/id/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItems = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/items/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItemsById = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/items/id', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //sookceo
    var _getFlightsGantt = function (cid, from, to, tzoffset, airport, filter) {
        var url = serviceBase + 'odata/flights/gantt/customer/' + cid + '/' + from + '/' + to + '/' + tzoffset;
        if (airport)
            url += '/' + airport;
        // if (utc)
        //    url += '/' + utc;

        ///{fstatus?}/{ftypes?}/{fregsiters?}/{ffrom?}/{fto?}

        //    public class FlightsFilter {
        //        public List<int> Status { get; set; }
        //    public List < int > Types { get; set; }
        //    public List < int > Registers { get; set; }
        //    public List < int > From { get; set; }
        //    public List < int > To { get; set; }

        //}


        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightsGanttUTC = function (cid, from, to, tzoffset, airport, filter) {
        var url = serviceBase + 'odata/flights/gantt/utc/customer/' + cid + '/' + from + '/' + to + '/' + tzoffset;
        if (airport)
            url += '/' + airport;



        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightsGantt2 = function (cid, from, to, tzoffset, airport, utc, filter) {
        var url = serviceBase + 'odata/flights/gantt2/customer/' + cid + '/' + from + '/' + to + '/' + tzoffset;
        if (airport)
            url += '/' + airport;

        url += '/' + utc;



        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightsGanttByFlights = function (fids, tzoffset, airport, filter) {

        //var url = serviceBase + 'odata/flights/gantt/' + fids + '/'  + tzoffset;
        var url = serviceBase + 'odata/flights/gantt/';
        if (airport)
            url += '/' + airport;



        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getPlanGantt = function (cid, from, to, tzoffset, airport, filter) {
        var url = serviceBase + 'odata/plan/gantt/customer/' + cid + '/' + from + '/' + to + '/' + tzoffset;
        if (airport)
            url += '/' + airport;



        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlight = function (id) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        var url = serviceBase + 'odata/flight/' + id + '/' + offset;

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getFlightPlanGantt = function (pid, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplanitems/gantt/plan/' + pid + '/' + offset + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlan = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplan/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanItem = function (id, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/plan/item/' + id + '/' + offset).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPlanItemBoard = function (id, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/plan/item/' + id + '/' + offset).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanView = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplan/view/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanSummary = function (id, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplan/summary/' + id + '/' + offset).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanAssignedRegisters = function (id, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplans/registers/assigned/' + id + '/' + offset + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _checkOverlap = function (pid, vid, rid, from, to) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplan/register/overlaps/' + pid + '/' + vid + '/' + rid + '/' + from + '/' + to).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanItems = function (pid, offset) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flightplanitems/plan/' + pid + '/' + offset + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanItemPermits = function (id, caid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/plan/item/permits/' + id + '/' + caid + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/flights/plan/crew/{id}/{calanderId}
    var _getFlightPlanCrew = function (id, caid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/plan/crew/' + id + '/' + caid + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPlanCrewBox = function (boxid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/plan/crew/box/' + boxid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getBoxCrew = function (boxid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/box/crew/' + boxid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightCrew2 = function (flightid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/crew/2/' + flightid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlights = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/report/flights/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlightsTotal = function (df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/report/flights/total/?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewSummary = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/summary/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewGrouped = function (cid, cockpit) {
        var url = 'odata/crew/cockpit/ordered/group/' + cid;

        if (!cockpit)
            url = 'odata/crew/cabin/ordered/group/' + cid;

        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getFlightPlanPermits = function (id, caid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/plan/permits/' + id + '/' + caid + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightPermits = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/plan/permits/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightsAbnormal = function (cid, airport, std) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/abnormal/' + cid + '/' + airport + '/' + std + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //"odata/crew/rest/check/{date}/{pid}"
    var _getRestDayOffCheck = function (date, pid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/rest/check/' + date + '/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/crew/rest/validation/{boxid}/{pid}
    var _getRestValidation = function (boxid, pid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/rest/validation/' + boxid + '/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/crew/over/{date}/{pid}/{duty}/{flight}
    var _getOverDuty = function (date, pid, duty, flight) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/over/' + date + '/' + pid + '/' + duty + '/' + flight).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    //odata/crew/calendar/save
    var _saveCrewCalendar = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/calendar/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/flight/plan/crew/save
    var _saveFlightPlanCrew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/plan/crew/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _offFlights = function (entity, callback) {
        //odata/fdpitems/onoff
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdpitems/onoff', entity).then(function (response) {

            deferred.resolve(response.data);
            if (callback)
                callback();

        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
    };
    var _boxItems = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/items/box', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _createFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdp/create', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _unboxItems = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/items/unbox', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlight = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/save', entity).then(function (response) {

            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _saveFlightRegister = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/register/assign', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/flight/register/change
    var _saveFlightRegisterChange = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/register/change', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _cancelFlights = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/cancel', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //magu2-16
    var _cancelFlightsGroup = function (entity) {
        var deferred = $q.defer();
        $http.post(/*$rootScope.serviceUrl + 'odata/flights/cancel/group'*/apiPlanning + 'api/plan/cancel/group', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightRegisterChange2 = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/register/change2', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //magu2-16
    var _saveFlightRegisterChangeGroup = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/register/change/group', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightAppy = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/apply/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlanItems = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplanitems/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _makePlanEditable = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/editable/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightPlanItemPermit = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/plan/item/permits/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _savePlanItem = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/planitem/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updatePlanItemFlight = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/planitem/flight/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _shiftFlight = function (entity) {
        var deferred = $q.defer();
        $http.post(/*$rootScope.serviceUrl + 'odata/flights/shift'*/apiPlanning + 'api/plan/shift', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlanItemBoard = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/planitems/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/flight/planitem/delete
    var _deletePlanItem = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/planitem/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deletePlanItemBoard = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/planitem/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteFlightPlanCrew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/plan/crew/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteFlight = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteBoxCrew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/box/crew/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deletePlanRegister = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/plan/register/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deletePlanItemPermit = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/plan/item/permit/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlanRegisters = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/registers/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlanRegister = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/register/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _lockPlanRegister = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/register/lock', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _unlockPlanRegister = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/register/unlock', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlanInterval = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/plan/interval/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _approvePlanRegisters = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/registers/approve', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _applyPlanCalander = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/calander/apply', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _closePlan = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/close/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _approvePlan60 = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/approve/60/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _approvePlan70 = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/approve/70/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _savePlan = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flightplan/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightDep = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/departure/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightLog = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/log/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getLeg = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/leg/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveJLog = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/jlog/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightDelays = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/delays/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightArr = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/arrival/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightOffBlock = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/offblock', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveReportingTime = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/reportingtime', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightOnBlock = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/onblock', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightTakeOff = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/takeoff', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightLanding = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/landing', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightCancel = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/cancel', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightRamp = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/ramp', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightRedirect = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/redirect', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightPax = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/pax', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightCargo = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/cargo', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightFuelArrival = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/fuel/arrival', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFlightFuelDeparture = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/fuel/departure', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCabinPositions = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/options/1156').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCockpitPositions = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/options/1159').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getDelaysTotalByCode = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/total/code/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //gigi
    var _getSummary = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/summary/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysTotalBySource = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/total/source/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysTotalByRegister = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/total/register/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysTotalByRoute = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/total/route/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };



    var _getDelaysDetailsByCode = function (id, code, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/details/code/' + id + '/' + code + '/' + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysDetailsBySource = function (id, source, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/details/source/' + id + '/' + source + '/' + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysDetailsByRegister = function (id, register, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/details/register/' + id + '/' + register + '/' + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelaysDetailsByRoute = function (id, route, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/details/route/' + id + '/' + route + '/' + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/fdp/children/
    var _getFDPChildren = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/children/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _notifyFDPCrew = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdp/notify/' + id, null).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFDPAssignedCrew = function (fdp) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fdp/assigned/' + fdp).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //GetFlights
    //odata/fights/
    var _getFlights = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fights/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getFlightCrews = function (id, arc) {
        var url = serviceBase + 'odata/flight/crews/' + id;
        // if (arc == 1)
        //     url = serviceBase + 'odata/flight/crews/archive/' + id;
        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightFDPs = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/fdps/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getJLData = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/jldata/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCLData = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/cldata/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getJLDataLegs = function (ids) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/jldata/legs/' + ids).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCLDataLegs = function (ids) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/cldata/legs/' + ids).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightsLine = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/line/flights/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getReporting = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdps/reporting/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFDPs = function (cockpit, year, month) {
        var url = 'odata/fdps/cockpit/' + year + '/' + month;
        if (!cockpit) {
            url = 'odata/fdps/cabin/' + year + '/' + month;
        }
        var deferred = $q.defer();
        $http.get(serviceBase + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getValidCrew = function (fdp, isvalid, cockpit) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/assign/valid/' + fdp + '/' + isvalid + '/' + cockpit).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getValidFDP = function (pid, year, month) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/assign/valid/' + pid + '/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getValidFDPDay = function (pid, year, month, day) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/assign/valid/' + pid + '/' + year + '/' + month + '/' + day).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFDPByYearMonth = function (crewid, year, month) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/crew/' + crewid + '/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getCrewDutiesByYearMonth = function (crewid, year, month) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/fdps/' + crewid + '/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDutiesByDay = function (type, year, month, day) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/duties/' + type + '/' + year + '/' + month + '/' + day).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFDPsByYearMonth = function (year, month) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/' + year + '/' + month + '?$orderby=DutyStart').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveAssignFDPToCrew = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/assign/fdp', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveAssignFDPToCrews = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crews/assign/fdp', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //odata/crews/assign/fdp
    var _saveAssignFDPToCrew2 = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/assign/fdp2', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveAssignFDPToCrew2Detail = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/assign/fdp2/detail', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveUpdateFDPPosition = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/crew/assign/fdp/position', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveDeleteFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdp/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveDuty = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duty/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdp/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveSTBY = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/stby/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdp/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveDutyDetail = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duty/save/detail', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _IsRERRPValid = function (pid, start, end) {
        var _start = moment(start).format('YYYY-MM-DDTHH:mm:ss');
        var _end = moment(end).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/isrerrpvalid/' + pid + '?start=' + _start + '&end=' + _end).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //odata/fdp/isevent/{pid}/{type}
    var _IsEventValid = function (pid, start, end, type) {
        var _start = moment(start).format('YYYY-MM-DDTHH:mm:ss');
        var _end = moment(end).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/isevent/' + pid + '/' + type + '?start=' + _start + '&end=' + _end).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveAog = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/aog/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAogs = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aogs/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveDeleteAog = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/aog/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveRoute = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/routes/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteRoute = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/routes/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ///////////////////
    var _saveDelayCode = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/delaycodes/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteDelayCode = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/delaycodes/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCode = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/delaycodes/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDailyRosterCrew = function (dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/daily/crew?date=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDailyRosterFlights = function (dt, id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/daily/crew/flight/' + id + '?date=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getSecurityRoster = function (_df, _dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/report/security?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getSecurityRosterDH = function (_df, _dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/report/security/dh?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };



    var _notifyDailyRoster = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/notify/roster/daily/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getBoardSummary = function (cid, year, month, day) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/board/summary/' + cid + '/' + year + '/' + month + '/' + day).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getBoardSummaryTotal = function (cid, year, month, day, year2, month2, day2) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/board/summary/total/' + cid + '/' + year + '/' + month + '/' + day + '/' + year2 + '/' + month2 + '/' + day2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _roster = function (entity, df, dt) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method?df=' + df + '&dt=' + dt, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _rosterDuty = function (entity, df, dt) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/duty?df=' + df + '&dt=' + dt, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _rosterTemp = function (entity, df, dt, crewid) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/temp?df=' + df + '&dt=' + dt + (crewid ? '&crewId=' + crewid : ''), entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _rosterPrePost = function (entity, df, dt, crewid) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/prepost?df=' + df + '&dt=' + dt + (crewid ? '&crewId=' + crewid : ''), entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _rosterTempCal = function (entity, df, dt, crewid, year, month) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/temp/cal?df=' + df + '&dt=' + dt + (crewid ? '&crewId=' + crewid : '') + '&year=' + year + '&month=' + month, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _rosterDuties = function (entity, df, dt) {

        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/duties?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _rosterSTBYs = function (entity, df, dt, loc, time) {

        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/stbys?df=' + df + '&dt=' + dt + '&loc=' + loc + '&time=' + time).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _rosterValidate = function (entity, df, dt) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/method/validate?df=' + df + '&dt=' + dt, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getRosterSheet = function (_df, _dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/sheet?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRosterSheetReport = function (_df) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/sheet/report?df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRosterSheetReportFP = function (_df) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/sheet/report/fp?df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getRosterCrewDetails = function (ids) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/crew/details/' + ids).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewDuties = function (df, dt, ca, co) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/duties/' + ca + '/' + co + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRosterFDPs = function (df, dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/fdps/' + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getOffItems = function (df, dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/offitems/' + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewDutiesGrouped = function (df, dt, ca, co) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/duties/grouped/' + ca + '/' + co + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewForRoster = function (cid) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/valid/1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewForRosterByDate = function (cid, dt) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roster/crew/valid/1?dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewFTLByDate = function (crewId, dt) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/ftl/crew/' + crewId + '?dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewDutyFlight = function (dt) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/dutyflight?df=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFDPStats = function (ids, dh) {
        if (!dh)
            dh = 0;
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/stat/' + ids + '/' + dh).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _checkStbyActivation = function (extended, stbyid, leg, duty, maxfdp) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/stby/ceased/stat/' + extended + '/' + stbyid + '/' + leg + '/' + duty + '/' + maxfdp).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deleteKeys = function () {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delete/keys').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewsFlights = function (_dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/flights?dt=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _fdpsOff = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdps/off', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _fdpsOffbyFlights = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/off', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    // odata/roster/fdpitem/delete
    var _deleteRosterFDPItems = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdpitem/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _activateStby = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/stby/activate', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deleteActivateStby = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/stby/activate/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getActivatedStbys = function (dt, df) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/stby/activated/list?dt=' + dt + '&df=' + df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _rosterSendSMS = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/sms/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _dutiesSendSMS = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/sms/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _dutiesSendSMSByDate = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/sms/save/date', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _dutiesHideVisible = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/visiblehide', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _dutiesVisible = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/visible', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _dutiesHide = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/hide', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _dutiesVisibleByDates = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/duties/visible/dates', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _sendSMS = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/sms/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _checkSMS = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/sms/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _updatePickupSMSStatus = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/sms/status/pickup/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _updateSMSStatus = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/sms/status/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getViewCrew = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDispatchSmsEmployees = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dispatch/sms/employees/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightChangeHistory = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/change/history/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFinMonthlyReport = function (yf, yt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fin/monthly/report/' + yf + '/' + yt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRegFlightsMonthlyReport = function (y, m, f) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/reg/flights/monthly/report/' + y + '/' + m + '/' + f).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightsMonthlyReport = function (y) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flights/monthly/report/' + y).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFixTimeMonthlyReport = function (y, m, r) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/monthly/report/' + y + '/' + m + '/' + r).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewFixTimePeriodReport = function (y, m, r) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/' + y + '/' + m + '/' + r).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewFixTimePeriodReportCrew = function (y, m, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/' + y + '/' + m + '/' + c).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCrewFixTimePeriodReportCrewNoFDP = function (y, m, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/nofdp/' + y + '/' + m + '/' + c).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFormAReport = function (yf, yt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/forma/' + yf + '/' + yt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //3-2
    var _getFormAYearlyReport = function (yf, yt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/forma/yearly/' + yf + '/' + yt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getIPAccess = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/ipaccess/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveIPs = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/ips/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteIPs = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/ips/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _deleteFixTime = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fixtime/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //audit
    var _saveFixTimeBase = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fixtime/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFixTimes = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fixtime/routes/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getNoCrews = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/nocrews/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _saveNoCrewFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdp/nocrew/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveNoCrewFDPGroup = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdp/nocrew/group/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deleteNoCrewFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/roster/fdp/nocrew/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayReportPeriodic = function (_df, _dt, period) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/periodic/report/' + period + '?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //getDelayFlightSummary
    var _getDelayFlightSummary = function (_df, _dt) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/flight/summary/' + '?dt=' + _dt + '&df=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getMappedTitle = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delays/mapped/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightGUID = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/guid/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //2021-1-17
    var _saveRemrak = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/log/remark/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //divargar 
    var _saveFlightGroup = function (entity) {
        var url = 'odata/flight/group/save';
        if (entity.ID != -1)
            url = 'odata/flight/group/update';
        var deferred = $q.defer();

        $http.post($rootScope.serviceUrl + url, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //11-18
    var _saveFlightGroupUTC = function (entity) {
      //  var url = 'odata/flight/group/save/utc';
        //if (entity.ID != -1)
          //  url = 'odata/flight/group/update/utc';

        var _url = 'api/plan/group/save/utc';
        if (entity.ID != -1)
            _url = 'api/plan/group/update/utc';
        var deferred = $q.defer();

        $http.post(/*$rootScope.serviceUrl*/ apiPlanning + _url, entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _activeFlights = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flights/active', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //magu38
    var _activeFlightsGroup = function (entity) {
        var deferred = $q.defer();
        $http.post(/*$rootScope.serviceUrl + 'odata/flights/active/group'*/apiPlanning + 'api/plan/active/group', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteFlightGroup = function (entity) {
        var deferred = $q.defer();
        $http.post(/*$rootScope.serviceUrl + 'odata/flight/delete/group'*/apiPlanning + 'api/plan/delete/group', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _notifyDelay2 = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notify/delay2/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getFlightReport = function (url) {

        var deferred = $q.defer();
        $http.get(serviceBase + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDayApts = function (dt) {

        var _dt = moment(dt).format('YYYY-MM-DD');
        var deferred = $q.defer();
        $http.get('http://localhost:12271/' + 'api/day/apts?dt=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _sendMVT = function (flightId, username) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/mail/mvt/' + flightId + '/' + username + '/vahid/Chico1359').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getTrainingSessionConvertingErrors = function () {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/idea/session/update/errors').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewsLight = function () {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/crew/light').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewTrainigDuties = function (crewid) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/training/duties/' + crewid + '/1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getNiraConflicts = function (df, dt) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/nira/conflicts/' + df + '/' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getOFP = function (id) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/ofp/flight/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveOFP = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/ofp/parse/text/input/varesh', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveOFPT = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/ofp/parse/text', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayedFlights = function () {
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/delayed/check/' + $rootScope.userName).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDelayedFlights = _getDelayedFlights;


    //12-05
    var _getFDPsCrewCount = function (d1, d2) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/fdps/crew/count?dt1=' + d1 + '&dt2=' + d2).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFDPsCrewCount = _getFDPsCrewCount;
    ///////
    var _getFTLByCrewIds = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/ftl/abs/crews/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFTLByCrewIds = _getFTLByCrewIds;



    var _getFTLExceedAll = function (id) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/ftl/crew/date/range/exceed/' + '?df&dt&crew=' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFTLExceedAll = _getFTLExceedAll;

    var _getDutyTimeLineMonthly = function (year, month, rank, type) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/duty/timeline/' + year + '/' + month + '/' + rank + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDutyTimeLineMonthly = _getDutyTimeLineMonthly;


    var _getDutyTimeLine = function (df, dt, rank, type) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/duty/timeline/' + rank + '/' + type + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDutyTimeLine = _getDutyTimeLine;

    var _getDutyTimeLineByCrew = function (df, dt, id) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/duty/timeline/crew/' + id + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDutyTimeLineByCrew = _getDutyTimeLineByCrew;

    var _getCrewForRosterByDateNew = function (cid, dt) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/crew/valid/1?dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewForRosterByDateNew = _getCrewForRosterByDateNew;

    var _getFTL = function (cid, df) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + "api/ftl/crew/date/?df=" + df + "&crew=" + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            alert(JSON.stringify(err));
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFTL = _getFTL;

    var _getFlightTimeYear = function (cid, y) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + "api/flighttime/crew/year/" + cid + "/" + y).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            alert(JSON.stringify(err));
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightTimeYear = _getFlightTimeYear;


    var API = 'https://fleet.caspianairlines.com/fbservicea/api/';
    var _runQuery = function (qry) {

        var deferred = $q.defer();
        $http.get(API + "crew/flights/query?" + qry).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            alert(JSON.stringify(err));
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.runQuery = _runQuery;

    var _getFlightsFromEFB = function (qry) {

        var deferred = $q.defer();
        $http.get(API + "crew/flights/query?" + qry).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            alert(JSON.stringify(err));
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightsFromEFB = _getFlightsFromEFB;



    var _saveFixTime = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/fixtime/save/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveFixTime = _saveFixTime;
    /////////////////////
    //2022-01-15
    //qeshm
    var _saveFDPGroup = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/groups/create', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveFDPGroup = _saveFDPGroup;
    var _deleteFDPGroup = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/flight/groups/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteFDPGroup = _deleteFDPGroup;


    var _cateringItemAdd = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/catering/add', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.cateringItemAdd = _cateringItemAdd;

    var _cateringItemRemove = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/catering/remove', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.cateringItemRemove = _cateringItemRemove;

    var _getCateringItems = function (id) {

        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + "odata/catering/items/" + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCateringItems = _getCateringItems;

    var _getCateringCodes = function () {

        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + "odata/catering/codes").then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCateringCodes = _getCateringCodes;


    var _getCateringReport = function (type, df, dt) {

        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + "odata/catering/report/" + type + "?df=" + df + "&dt=" + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCateringReport = _getCateringReport;
    ///////////////////
    //Reposition 
    var _getCrewFixTimePeriodReportNoFDP = function (y, m) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/nofdp/' + y + '/' + m).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportNoFDP = _getCrewFixTimePeriodReportNoFDP;
    var _deleteFDPs = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/fdps/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteFDPs = _deleteFDPs;


    var _getCrewFixTimePeriodReportCrewOthers = function (y, m, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/other/' + y + '/' + m + '/' + c).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportCrewOthers = _getCrewFixTimePeriodReportCrewOthers;

    //[Route("odata/crew/fixtime/period/report/daily/{from}/{to}/{rank}/{cid}")]
    var _getCrewFixTimePeriodReportDaily = function (df, dt, r) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/daily/' + df + '/' + dt + '/' + r + '/' + '-1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportDaily = _getCrewFixTimePeriodReportDaily;


    var _getCrewFixTimePeriodReportCrewDaily = function (df, dt, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/daily/' + c + '/' + df + '/' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportCrewDaily = _getCrewFixTimePeriodReportCrewDaily;

    var _getCrewFixTimePeriodReportCrewNoFDPDaily = function (df, dt, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/nofdp/daily/' + c + '/' + df + '/' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportCrewNoFDPDaily = _getCrewFixTimePeriodReportCrewNoFDPDaily;

    var _getCrewFixTimePeriodReportCrewOthersDaily = function (df, dt, c) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/fixtime/period/report/crew/other/daily/' + c + '/' + df + '/' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewFixTimePeriodReportCrewOthersDaily = _getCrewFixTimePeriodReportCrewOthersDaily;
    ////RAW/////////////////
    //var _getOFP = function (id) {


    //    var deferred = $q.defer();
    //    $http.get(serviceBaseAPI + 'api/ofp/flight/' + id).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {

    //        deferred.reject(Exceptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //};
    var _runRAW = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/raw', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.runRaw = _runRAW;


    var _getCharterers = function () {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/charterers/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCharterers = _getCharterers;

    var _getFlightCharterers = function (fid) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/flight/charterers/' + fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightCharterers = _getFlightCharterers;


    var _deleteFlightCharterer = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/flight/charterer/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteFlightCharterer = _deleteFlightCharterer;

    var _saveFlightCharterer = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/flight/charterer/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveFlightCharterer = _saveFlightCharterer;


    var _getCharterersReport = function (df, dt, chr) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/flight/charterers/report?df=' + df + '&dt=' + dt + '&chr=' + chr).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCharterersReport = _getCharterersReport;



    var _deleteCharterer = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/charterer/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteCharterer = _deleteCharterer;

    var _saveCharterer = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/charterer/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveCharterer = _saveCharterer;



    var _getFlightDailyReport = function (df, dt, from, to, regs, routes, no, idx, type, chr, status) {


        var deferred = $q.defer();
        $http.get(apireportflight + 'api/flight/daily?df=' + df + '&dt=' + dt + '&from=' + from + '&to=' + to + '&regs=' + regs + '&routes=' + routes + '&no=' + no + '&idx=' + idx + '&status=' + status + '&type2=' + type + '&chr=' + chr).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightDailyReport = _getFlightDailyReport;
    var _getFlightDailyReportFilters = function (df, dt) {


        var deferred = $q.defer();
        $http.get(apireportflight + 'api/flight/daily/filters?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightDailyReportFilters = _getFlightDailyReportFilters;

    var _getFlightDailyStationReport = function (df, dt, from, to, regs, routes, no, idx, type, chr, status) {


        var deferred = $q.defer();
        $http.get(apireportflight + 'api/flight/daily/station?df=' + df + '&dt=' + dt + '&from=' + from + '&to=' + to + '&regs=' + regs + '&routes=' + routes + '&no=' + no + '&idx=' + idx + '&status=' + status + '&type2=' + type + '&chr=' + chr + '&cnl=0').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightDailyStationReport = _getFlightDailyStationReport;
    /////////////////////////
    var _updateATC = function (id, fn) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/flight/atc/update/' + id + '/' + fn).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateATL = function (id, fn) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/flight/atl/update/' + id + '/' + fn).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.updateATC = _updateATC;
    serviceFactory.updateATL = _updateATL;



    ////////////////////////
    //07-29
    var _getDutyTimeLineById = function (id) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/duty/timeline/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDutyTimeLineById = _getDutyTimeLineById;
    ////////////////////////

    var _getAssignGrid = function (df, dt) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/assign/grid/' + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getAssignGrid = _getAssignGrid;


    ////////////////////////
    var _getAssignGridGroup = function (group, df, dt) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/assign/grid/group/' + group + '/' + + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getAssignGridGroup = _getAssignGridGroup;
    /////////////////////////
    var _getCrewForRosterByDateNewGroup = function (code, dt) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/crew/valid/group/' + code + '?dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCrewForRosterByDateNewGroup = _getCrewForRosterByDateNewGroup;

    //////////////////////////
    var _saveATC = function (entity) {
        var deferred = $q.defer();
        $http.post(apiapsb + 'api/atc/text/input', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveATC = _saveATC;

    var _getATC = function (id) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/atc/text/get/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getATC = _getATC;
    /////////////////////////
    var _getFuelOFP = function (df, dt) {



        var deferred = $q.defer();
        $http.get(apiFlightReport + 'api/fuel?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFuelOFP = _getFuelOFP;


    var _getRvsm = function (df, dt) {



        var deferred = $q.defer();
        $http.get(apiFlightReport + 'api/rvsm?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRvsm = _getRvsm;
    /////////////////////////
    var _saveFlightDoc = function (entity) {
        var deferred = $q.defer();
        $http.post(apiapsb + 'api/flight/doc/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveFlightDoc = _saveFlightDoc;


    var _getFlightDoc = function (id, type) {
        var deferred = $q.defer();
        $http.get(apiapsb + 'api/flight/doc/type/' + id + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getFlightDoc = _getFlightDoc;
    /////////////////////////
    serviceFactory.getOFP = _getOFP;
    serviceFactory.saveOFP = _saveOFP;

    serviceFactory.getNiraConflicts = _getNiraConflicts;

    serviceFactory.getTrainingSessionConvertingErrors = _getTrainingSessionConvertingErrors;
    serviceFactory.getCrewTrainigDuties = _getCrewTrainigDuties;
    serviceFactory.getCrewsLight = _getCrewsLight;

    serviceFactory.sendMVT = _sendMVT;
    serviceFactory.getDayApts = _getDayApts;


    serviceFactory.getFlightReport = _getFlightReport;
    serviceFactory.notifyDelay2 = _notifyDelay2;



    serviceFactory.saveFlightGroup = _saveFlightGroup;
    serviceFactory.saveFlightGroupUTC = _saveFlightGroupUTC;
    serviceFactory.activeFlights = _activeFlights;
    serviceFactory.deleteFlightGroup = _deleteFlightGroup;


    serviceFactory.saveRemrak = _saveRemrak;


    serviceFactory.saveNoCrewFDP = _saveNoCrewFDP;
    serviceFactory.deleteNoCrewFDP = _deleteNoCrewFDP;
    serviceFactory.getNoCrews = _getNoCrews;
    serviceFactory.getFixTimes = _getFixTimes;
    serviceFactory.saveFixTimeBase = _saveFixTimeBase;
    serviceFactory.deleteFixTime = _deleteFixTime;
    serviceFactory.getCrewFixTimeMonthlyReport = _getCrewFixTimeMonthlyReport;
    serviceFactory.getCrewFixTimePeriodReport = _getCrewFixTimePeriodReport;
    serviceFactory.getCrewFixTimePeriodReportCrew = _getCrewFixTimePeriodReportCrew;
    serviceFactory.getCrewFixTimePeriodReportCrewNoFDP = _getCrewFixTimePeriodReportCrewNoFDP;
    serviceFactory.saveIPs = _saveIPs;
    serviceFactory.deleteIPs = _deleteIPs;
    serviceFactory.getIPAccess = _getIPAccess;
    serviceFactory.getFormAReport = _getFormAReport;
    serviceFactory.sendSMS = _sendSMS;
    serviceFactory.getFinMonthlyReport = _getFinMonthlyReport;
    serviceFactory.getRegFlightsMonthlyReport = _getRegFlightsMonthlyReport;
    serviceFactory.getFlightsMonthlyReport = _getFlightsMonthlyReport;
    serviceFactory.getFlightChangeHistory = _getFlightChangeHistory;
    serviceFactory.deleteRosterFDPItems = _deleteRosterFDPItems;
    serviceFactory.getViewCrew = _getViewCrew;
    serviceFactory.saveJLog = _saveJLog;
    serviceFactory.getLeg = _getLeg;

    serviceFactory.deleteActivateStby = _deleteActivateStby;
    serviceFactory.getActivatedStbys = _getActivatedStbys;
    serviceFactory.fdpsOff = _fdpsOff;
    serviceFactory.fdpsOffbyFlights = _fdpsOffbyFlights;
    serviceFactory.activateStby = _activateStby;
    serviceFactory.getCrewsFlights = _getCrewsFlights;
    serviceFactory.deleteKeys = _deleteKeys;
    serviceFactory.getFDPStats = _getFDPStats;
    serviceFactory.checkStbyActivation = _checkStbyActivation;
    serviceFactory.getCrewForRoster = _getCrewForRoster;
    serviceFactory.getCrewForRosterByDate = _getCrewForRosterByDate;
    serviceFactory.getCrewFTLByDate = _getCrewFTLByDate;
    serviceFactory.getCrewDutyFlight = _getCrewDutyFlight;
    serviceFactory.getDelayCodes = _getDelayCodes;
    serviceFactory.getDelayCodeCats = _getDelayCodeCats;
    serviceFactory.getFlightDelayCodes = _getFlightDelayCodes;
    serviceFactory.getFlightDelays = _getFlightDelays;
    serviceFactory.getAverageRouteTime = _getAverageRouteTime;
    serviceFactory.getFlights = _getFlights;
    serviceFactory.getBoxFlights = _getBoxFlights;
    serviceFactory.getFlightPlan = _getFlightPlan;
    serviceFactory.getFlightPlanItem = _getFlightPlanItem;
    serviceFactory.getPlanItemBoard = _getPlanItemBoard;
    serviceFactory.checkOverlap = _checkOverlap;
    serviceFactory.getFlightPlanItems = _getFlightPlanItems;
    serviceFactory.getFlightsGantt = _getFlightsGantt;
    serviceFactory.getFlightsGantt2 = _getFlightsGantt2;
    serviceFactory.getFlightsGanttUTC = _getFlightsGanttUTC;
    serviceFactory.getFlightsGanttByFlights = _getFlightsGanttByFlights;
    serviceFactory.getFlightPlanGantt = _getFlightPlanGantt;
    serviceFactory.savePlanItems = _savePlanItems;
    serviceFactory.makePlanEditable = _makePlanEditable;
    serviceFactory.getFlightPlanItemPermits = _getFlightPlanItemPermits;
    serviceFactory.getFlightPlanCrew = _getFlightPlanCrew;
    serviceFactory.getFlightPlanCrewBox = _getFlightPlanCrewBox;
    serviceFactory.getBoxCrew = _getBoxCrew;
    serviceFactory.getFlightCrew2 = _getFlightCrew2;
    serviceFactory.getCrewFlights = _getCrewFlights;
    serviceFactory.getCrewFlightsTotal = _getCrewFlightsTotal;
    serviceFactory.getCrewSummary = _getCrewSummary;
    serviceFactory.getCrew = _getCrew;
    serviceFactory.getFlightPlanPermits = _getFlightPlanPermits;
    serviceFactory.getFlightPermits = _getFlightPermits;
    serviceFactory.savePlanItem = _savePlanItem;
    serviceFactory.updatePlanItemFlight = _updatePlanItemFlight;
    serviceFactory.shiftFlight = _shiftFlight;
    serviceFactory.savePlanItemBoard = _savePlanItemBoard;
    serviceFactory.deleteFlightPlanCrew = _deleteFlightPlanCrew;
    serviceFactory.deleteFlight = _deleteFlight;
    serviceFactory.deleteBoxCrew = _deleteBoxCrew;
    serviceFactory.deletePlanItem = _deletePlanItem;
    serviceFactory.deletePlanItemBoard = _deletePlanItemBoard;
    serviceFactory.deletePlanItemPermit = _deletePlanItemPermit;
    serviceFactory.deletePlanRegister = _deletePlanRegister;
    serviceFactory.lockPlanRegister = _lockPlanRegister;
    serviceFactory.unlockPlanRegister = _unlockPlanRegister;

    serviceFactory.savePlan = _savePlan;
    serviceFactory.savePlanRegisters = _savePlanRegisters;
    serviceFactory.savePlanRegister = _savePlanRegister;
    serviceFactory.savePlanInterval = _savePlanInterval;
    serviceFactory.approvePlanRegisters = _approvePlanRegisters;
    serviceFactory.applyPlanCalander = _applyPlanCalander;
    serviceFactory.offFlights = _offFlights;
    serviceFactory.boxItems = _boxItems;
    serviceFactory.createFDP = _createFDP;
    serviceFactory.unboxItems = _unboxItems;
    serviceFactory.saveFlightPlanCrew = _saveFlightPlanCrew;
    serviceFactory.saveCrewCalendar = _saveCrewCalendar;
    serviceFactory.saveFlightDep = _saveFlightDep;
    serviceFactory.saveFlightLog = _saveFlightLog;
    serviceFactory.saveFlightDelays = _saveFlightDelays;
    serviceFactory.saveFlightArr = _saveFlightArr;
    serviceFactory.saveFlightOffBlock = _saveFlightOffBlock;
    serviceFactory.saveReportingTime = _saveReportingTime;
    serviceFactory.saveFlightTakeOff = _saveFlightTakeOff;
    serviceFactory.saveFlightLanding = _saveFlightLanding;
    serviceFactory.saveFlightOnBlock = _saveFlightOnBlock;
    serviceFactory.saveFlightPax = _saveFlightPax;
    serviceFactory.saveFlightCargo = _saveFlightCargo;
    serviceFactory.saveFlightFuelArrival = _saveFlightFuelArrival;
    serviceFactory.saveFlightFuelDeparture = _saveFlightFuelDeparture;
    serviceFactory.saveFlightPlanItemPermit = _saveFlightPlanItemPermit;
    serviceFactory.getAirportByIATA = _getAirportByIATA;
    serviceFactory.getUpdatedFlights = _getUpdatedFlights;
    serviceFactory.getUpdatedFlightsNew = _getUpdatedFlightsNew;
    serviceFactory.getRoutes = _getRoutes;
    serviceFactory.getRouteDestination = _getRouteDestination;
    serviceFactory.closePlan = _closePlan;
    serviceFactory.getFlightPlanView = _getFlightPlanView;
    serviceFactory.approvePlan60 = _approvePlan60;
    serviceFactory.approvePlan70 = _approvePlan70;
    serviceFactory.getFlightPlanAssignedRegisters = _getFlightPlanAssignedRegisters;
    serviceFactory.getFlightPlanSummary = _getFlightPlanSummary;
    serviceFactory.saveFlight = _saveFlight;
    serviceFactory.getFlightsAbnormal = _getFlightsAbnormal;
    serviceFactory.getOverDuty = _getOverDuty;
    serviceFactory.getRestValidation = _getRestValidation;
    serviceFactory.getRestDayOffCheck = _getRestDayOffCheck;
    serviceFactory.saveFlightCancel = _saveFlightCancel;
    serviceFactory.saveFlightRamp = _saveFlightRamp;
    serviceFactory.saveFlightRedirect = _saveFlightRedirect;
    serviceFactory.getRoute = _getRoute;
    serviceFactory.getFlight = _getFlight;
    serviceFactory.saveFlightRegister = _saveFlightRegister;
    serviceFactory.saveFlightAppy = _saveFlightAppy;
    serviceFactory.getFlightsGrouped = _getFlightsGrouped;
    serviceFactory.checkPlanErrors = _checkPlanErrors;
    serviceFactory.getFlightsByRegister = _getFlightsByRegister;
    serviceFactory.getPlanBase = _getPlanBase;
    serviceFactory.getPlanItemsGantt = _getPlanItemsGantt;
    serviceFactory.getPlanItemsGanttCrewTest = _getPlanItemsGanttCrewTest;
    serviceFactory.getPlanItemsGanttCrewAssignReg = _getPlanItemsGanttCrewAssignReg;
    serviceFactory.getFlights = _getFlights;
    serviceFactory.getPlanLastItem = _getPlanLastItem;
    serviceFactory.getPlanLastItemByPlan = _getPlanLastItemByPlan;
    serviceFactory.getPlanItems = _getPlanItems;
    serviceFactory.getPlanItemsById = _getPlanItemsById;
    serviceFactory.saveFlightRegisterChange = _saveFlightRegisterChange;
    serviceFactory.saveFlightRegisterChange2 = _saveFlightRegisterChange2;
    serviceFactory.cancelFlights = _cancelFlights;
    serviceFactory.getCockpitPositions = _getCockpitPositions;
    serviceFactory.getCabinPositions = _getCabinPositions;


    serviceFactory.getDelaysTotalByCode = _getDelaysTotalByCode;
    serviceFactory.getDelaysTotalBySource = _getDelaysTotalBySource;
    serviceFactory.getDelaysTotalByRegister = _getDelaysTotalByRegister;
    serviceFactory.getDelaysTotalByRoute = _getDelaysTotalByRoute;

    serviceFactory.getDelaysDetailsByCode = _getDelaysDetailsByCode;
    serviceFactory.getDelaysDetailsBySource = _getDelaysDetailsBySource;
    serviceFactory.getDelaysDetailsByRegister = _getDelaysDetailsByRegister;
    serviceFactory.getDelaysDetailsByRoute = _getDelaysDetailsByRoute;
    serviceFactory.getValidCrew = _getValidCrew;
    serviceFactory.getValidFDP = _getValidFDP;
    serviceFactory.getFDPAssignedCrew = _getFDPAssignedCrew;
    serviceFactory.saveAssignFDPToCrew = _saveAssignFDPToCrew;
    serviceFactory.saveAssignFDPToCrews = _saveAssignFDPToCrews;
    serviceFactory.saveAssignFDPToCrew2 = _saveAssignFDPToCrew2;
    serviceFactory.saveAssignFDPToCrew2Detail = _saveAssignFDPToCrew2Detail;
    serviceFactory.saveUpdateFDPPosition = _saveUpdateFDPPosition;
    serviceFactory.saveDeleteFDP = _saveDeleteFDP;
    serviceFactory.getCrewFDPByYearMonth = _getCrewFDPByYearMonth;
    serviceFactory.getFDPsByYearMonth = _getFDPsByYearMonth;
    serviceFactory.IsRERRPValid = _IsRERRPValid;
    serviceFactory.IsEventValid = _IsEventValid;
    serviceFactory.saveDuty = _saveDuty;
    serviceFactory.saveDutyDetail = _saveDutyDetail;
    serviceFactory.saveFDP = _saveFDP;
    serviceFactory.saveSTBY = _saveSTBY;
    serviceFactory.deleteFDP = _deleteFDP;
    serviceFactory.getCrewGrouped = _getCrewGrouped;
    serviceFactory.getFDPs = _getFDPs;
    serviceFactory.getFlightFDPs = _getFlightFDPs;
    serviceFactory.getFlightCrews = _getFlightCrews;
    serviceFactory.getValidFDPDay = _getValidFDPDay;
    serviceFactory.getFDPChildren = _getFDPChildren;
    serviceFactory.notifyFDPCrew = _notifyFDPCrew;
    serviceFactory.getJLData = _getJLData;
    serviceFactory.getCLData = _getCLData;
    serviceFactory.getJLDataLegs = _getJLDataLegs;
    serviceFactory.getCLDataLegs = _getCLDataLegs;
    serviceFactory.getFlightsLine = _getFlightsLine;
    serviceFactory.getReporting = _getReporting;
    serviceFactory.saveAog = _saveAog;
    serviceFactory.getAogs = _getAogs;
    serviceFactory.saveDeleteAog = _saveDeleteAog;
    serviceFactory.saveRoute = _saveRoute;
    serviceFactory.deleteRoute = _deleteRoute;

    serviceFactory.saveDelayCode = _saveDelayCode;
    serviceFactory.deleteDelayCode = _deleteDelayCode;
    serviceFactory.getDelayCode = _getDelayCode;
    serviceFactory.getDailyRosterCrew = _getDailyRosterCrew;
    serviceFactory.getDailyRosterFlights = _getDailyRosterFlights;
    serviceFactory.notifyDailyRoster = _notifyDailyRoster;

    serviceFactory.getBoardSummary = _getBoardSummary;
    serviceFactory.getBoardSummaryTotal = _getBoardSummaryTotal;
    serviceFactory.getSecurityRoster = _getSecurityRoster;
    serviceFactory.getSecurityRosterDH = _getSecurityRosterDH;
    serviceFactory.getSummary = _getSummary;
    serviceFactory.getPlanGantt = _getPlanGantt;

    serviceFactory.roster = _roster;
    serviceFactory.rosterDuty = _rosterDuty;
    serviceFactory.rosterValidate = _rosterValidate;
    serviceFactory.rosterTemp = _rosterTemp;
    serviceFactory.rosterTempCal = _rosterTempCal;
    serviceFactory.rosterPrePost = _rosterPrePost;
    serviceFactory.rosterDuties = _rosterDuties;
    serviceFactory.rosterSTBYs = _rosterSTBYs;
    serviceFactory.getRosterSheet = _getRosterSheet;
    serviceFactory.getRosterSheetReport = _getRosterSheetReport;
    //magu313
    serviceFactory.getRosterSheetReportFP = _getRosterSheetReportFP;
    serviceFactory.getRosterCrewDetails = _getRosterCrewDetails;
    serviceFactory.rosterSendSMS = _rosterSendSMS;
    serviceFactory.dutiesSendSMS = _dutiesSendSMS;
    serviceFactory.checkSMS = _checkSMS;
    serviceFactory.updatePickupSMSStatus = _updatePickupSMSStatus;
    serviceFactory.updateSMSStatus = _updateSMSStatus;

    serviceFactory.getCrewDutiesGrouped = _getCrewDutiesGrouped;
    serviceFactory.getCrewDuties = _getCrewDuties;
    serviceFactory.getRosterFDPs = _getRosterFDPs;
    serviceFactory.getOffItems = _getOffItems;
    serviceFactory.getCrewDutiesByYearMonth = _getCrewDutiesByYearMonth;
    serviceFactory.getDutiesByDay = _getDutiesByDay;
    serviceFactory.getDispatchSmsEmployees = _getDispatchSmsEmployees;
    //2020-11-16
    serviceFactory.getRealRegisters = _getRealRegisters;
    serviceFactory.getDelayReportPeriodic = _getDelayReportPeriodic;
    serviceFactory.getDelayFlightSummary = _getDelayFlightSummary;
    serviceFactory.getMappedTitle = _getMappedTitle;
    serviceFactory.dutiesHideVisible = _dutiesHideVisible;
    serviceFactory.getFlightGUID = _getFlightGUID;
    serviceFactory.dutiesVisible = _dutiesVisible;
    serviceFactory.dutiesHide = _dutiesHide;
    serviceFactory.dutiesVisibleByDates = _dutiesVisibleByDates;
    serviceFactory.dutiesSendSMSByDate = _dutiesSendSMSByDate;

    serviceFactory.saveFlightRegisterChangeGroup = _saveFlightRegisterChangeGroup;
    serviceFactory.cancelFlightsGroup = _cancelFlightsGroup;
    serviceFactory.activeFlightsGroup = _activeFlightsGroup;
    serviceFactory.saveNoCrewFDPGroup = _saveNoCrewFDPGroup;


    serviceFactory.getFormAYearlyReport = _getFormAYearlyReport;

    return serviceFactory;

}]);