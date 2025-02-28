﻿'use strict';
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
	
	 var _getFlightsByDate = function (df) {

        var deferred = $q.defer();
        $http.get(zscheduling + 'api/sch/flts/date?df=' + df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	
	
	var _getFlightCrewsNew = function (id) {

        var deferred = $q.defer();
        $http.get(zscheduling + 'api/sch/flight/crews/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	var _getRoster = function (id,y,m ) {
       
        var deferred = $q.defer();
        $http.get( zscheduling  + 'api/pp/fdps/'+id+'/'+y+'/' + m ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
	serviceFactory.getRoster = _getRoster;
	
	var _getFDP = function (fdpid,type) {
       
        var deferred = $q.defer();
        $http.get( zscheduling  + 'api/pp/duty/'+fdpid+'/'+type ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
	serviceFactory.getFDP = _getFDP;
	
	
	var _getDuties = function (id,df,dt) {
       
        var deferred = $q.defer();
        $http.get( zscheduling  + 'api/pp/duty/date/'+id+'?df='+df+'&dt='+dt ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDuties = _getDuties;


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

	
    serviceFactory.getCrewFlights = _getCrewFlights;
    serviceFactory.getCrewFlightsGrouped = _getCrewFlightsGrouped;
    serviceFactory.getFlightCrews = _getFlightCrews;
	
	serviceFactory.getFlightsByDate  = _getFlightsByDate;
	 serviceFactory.getFlightCrewsNew = _getFlightCrewsNew;
    
    return serviceFactory;

}]);