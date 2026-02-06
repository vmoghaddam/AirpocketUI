'use strict';
app.factory('cmsService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var api_cms = 'http://localhost:9070/';
    var serviceFactory = {};


    var token = "-";



    var _get_reports = function (df,dt,type,register,flight_id) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/reports/'+token+'?df='+df+'&dt='+dt+'&type='+type+'&register='+register+'&flight_id='+flight_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_reports = _get_reports;

    var _get_auditors = function () {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/auditors').then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    serviceFactory.get_auditors = _get_auditors;

    var _get_locations = function () {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/locations').then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    serviceFactory.get_locations = _get_locations;

    var _get_auditees = function () {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/auditees').then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    serviceFactory.get_auditees = _get_auditees;

    var _get_audit_plan_form = function (planId) {
        var deferred = $q.defer();        
        $http.get(api_cms + 'api/cms/get/audit/plan/form/' + planId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_audit_plan_form = _get_audit_plan_form;


    var _save_audit_plan = function (dto) {
        var deferred = $q.defer();
        console.log("-----save-----------------", api_cms + 'api/cms/save/audit/plan/', dto);
        $http.post(api_cms + 'api/cms/save/audit/plan', dto).then(function (response) {
            
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_audit_plan = _save_audit_plan;

    var _get_audit = function (id) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/audit/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_audit = _get_audit;


    var _save_audit = function (entity) {
        var deferred = $q.defer();
        $http.post(api_cms + 'api/cms/save/audit', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.save_audit = _save_audit;

    var _get_finding = function (id) {
        var deferred = $q.defer();
        $http.get(api_cms + 'api/cms/get/finding/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.get_finding = _get_finding;


    var _save_finding = function (entity) {
        var deferred = $q.defer();
        $http.post(api_cms + 'api/cms/save/finding', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.save_finding = _save_finding;


    return serviceFactory;


}]);