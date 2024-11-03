'use strict';
app.factory('flightService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};
    var _getCrewFlights = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/flights/app/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlightsGrouped = function (id ) {
       
        var deferred = $q.defer();
        $http.get( serviceBase2  + 'odata/crew/report/flights/app/grouped/' + id ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    var _getFlightCrews = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/crews/new/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	////////////////////
	 var _getForms = function (id) {

        var deferred = $q.defer();
        $http.get(serviceForms + 'api/vacation/forms/crew/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getForms = _getForms;
    var _updateFormVacation = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceForms + 'api/vacation/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.updateFormVacation = _updateFormVacation;

    var _deleteFormVacation = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceForms + 'api/vacation/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteFormVacation = _deleteFormVacation;
	
	//https://kapireportflight.airpocket.online/api/crew/flight/summary?df=2022-11-20&dt=2022-12-20&grps=-1&cid=369011
	var domain = "kishairlines.ir";
	var _getReport = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DD');
        var _dt = moment(dt).format('YYYY-MM-DD');
        var deferred = $q.defer();
        $http.get(/*'https://kapireportflight.airpocket.online/'*/'https://fms.'+domain+'/kapireportflight' + '/api/crew/flight/summary?df=' + _df + '&dt=' + _dt+'&cid='+id+'&grps=-1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 serviceFactory.getReport = _getReport;
	 
	 
	 var _getReportDH = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DD');
        var _dt = moment(dt).format('YYYY-MM-DD');
        var deferred = $q.defer();
        $http.get(/*'https://kapinet2.airpocket.online/'*/'https://fms.'+domain+'/kapinet2/' + 'odata/crew/fixtime/period/report/crew/other/daily/' +id+'/'+ _df + '/' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 serviceFactory.getReportDH = _getReportDH;
	 
	  var _getReportSTBY = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DD');
        var _dt = moment(dt).format('YYYY-MM-DD');
        var deferred = $q.defer();
        $http.get(/*'https://kapinet2.airpocket.online/' */'https://fms.'+domain+'/kapinet2/' + 'odata/crew/fixtime/period/report/crew/nofdp/daily/'+id+'/' + _df + '/' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 serviceFactory.getReportSTBY = _getReportSTBY;
	/////////////////
    serviceFactory.getCrewFlights = _getCrewFlights;
    serviceFactory.getCrewFlightsGrouped = _getCrewFlightsGrouped;
    serviceFactory.getFlightCrews = _getFlightCrews;
    
    return serviceFactory;

}]);