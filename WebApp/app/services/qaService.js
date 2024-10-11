'use strict';
app.factory('qaService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    var _getQAByEmployee = function (employeeId) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/get/qa/" + employeeId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getQAStatus = function (entity) {
        var deferred = $q.defer();
        $http.post(apiQA + "api/get/qa/status", entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _confirmReport = function (employeeId, type, id) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/qa/confirm/report/" + employeeId + "/" + type + '/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _followUpHsitory = function (entityId, type) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/get/followup/" + entityId + "/" + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    var _getEventTitle = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/eventtitle').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getFlightPhase = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/flightphase').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getFlightInformation = function (Id) {

        var deferred = $q.defer();
        $http.get('https://localhost:44399/api/get/flightinformation/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDamageBy = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/dmgby').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getWeather = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/weather').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSurface = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/surface').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getLighting = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/lighting').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMORCompnSpec = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/mor/compnspec').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    //var _saveCRS = function (entity) {

    //    var deferred = $q.defer();
    //    $http.post('http://localhost:9063/api/save/csr', entity).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        deferred.reject(Exceptions.getMessage(err));
    //    })

    //    return deferred.promise;
    //}

    var _saveMOR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/mor', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    var _saveVHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/vhr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveGIA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/gia', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCSRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMORById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/mor/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getVHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/vhr/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getGIAById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveCHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/chr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/chr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCHRReason = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/chr/reason').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveSHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/shr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveFollowUp = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/followup', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/shr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSHRReason = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/shr/reason').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _saveDHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/dhr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/dhr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getOPCatagory = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/opcatagory').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDISCatagory = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/discatagory').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSecurityReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/security/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCateringReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/catering/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getGroundReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/ground/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getCabinReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/csr/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMaintenanceReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/maintenance/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMaintenanceRegReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/maintenance/reg/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDispatchReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/dispatch/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getQAEmployee = function (type, entityId, referrerId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/employee/' + type + '/' + entityId + '/' + referrerId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _saveFollowUp = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/followup', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _acceptQA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/accept', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _rejectQA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/reject', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _referre = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/referr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    var _getReferredList = function (referreId, type, entityId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/get/referred/' + referreId + '/' + type + '/' + entityId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getIsResponsible = function (employeeId, type, entityId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/isresponsible/' + employeeId + '/' + type + '/' + entityId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getComments = function (entityId, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/get/comments/' + entityId + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _sendComment = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/send/comment', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getProfiles = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/profiles?grp=-1'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getProfiles = _getProfiles;


    var _getProfileLog = function (id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/log?id='+).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    serviceFactory.getProfileLog = _getProfileLog;





    serviceFactory.getQAByEmployee = _getQAByEmployee;
    serviceFactory.getQAStatus = _getQAStatus;
    serviceFactory.confirmReport = _confirmReport;

    serviceFactory.getFlightInformation = _getFlightInformation;

    serviceFactory.getGIAById = _getGIAById;
    serviceFactory.saveGIA = _saveGIA;
    serviceFactory.getDamageBy = _getDamageBy;
    serviceFactory.getWeather = _getWeather;
    serviceFactory.getSurface = _getSurface;
    serviceFactory.getLighting = _getLighting;


    //serviceFactory.saveCSR = _saveCRS;
    serviceFactory.getCSRById = _getCSRById;
    serviceFactory.getEventTitle = _getEventTitle;
    serviceFactory.getFlightPhase = _getFlightPhase;


    serviceFactory.getCHRById = _getCHRById;
    serviceFactory.saveCHR = _saveCHR;
    serviceFactory.getCHRReason = _getCHRReason;

    serviceFactory.getSHRById = _getSHRById;
    serviceFactory.saveSHR = _saveSHR;
    serviceFactory.getSHRReason = _getSHRReason;

    serviceFactory.getVHRById = _getVHRById;
    serviceFactory.saveVHR = _saveVHR;

    serviceFactory.saveMOR = _saveMOR;
    serviceFactory.getMORById = _getMORById;
    serviceFactory.getMORCompnSpec = _getMORCompnSpec;

    serviceFactory.saveDHR = _saveDHR;
    serviceFactory.getDHRById = _getDHRById;
    serviceFactory.getOPCatagory = _getOPCatagory;
    serviceFactory.getDISCatagory = _getDISCatagory;

    serviceFactory.saveFollowUp = _saveFollowUp;
    serviceFactory.followUpHsitory = _followUpHsitory;

    serviceFactory.getCateringReport = _getCateringReport
    serviceFactory.getSecurityReport = _getSecurityReport
    serviceFactory.getGroundReport = _getGroundReport
    serviceFactory.getMaintenanceReport = _getMaintenanceReport
    serviceFactory.getMaintenanceRegReport = _getMaintenanceRegReport
    serviceFactory.getCabinReport = _getCabinReport
    serviceFactory.getDispatchReport = _getDispatchReport
    serviceFactory.getQAEmployee = _getQAEmployee

    serviceFactory.referre = _referre
    serviceFactory.getReferredList = _getReferredList

    serviceFactory.acceptQA = _acceptQA
    serviceFactory.rejectQA = _rejectQA

    serviceFactory.getIsResponsible = _getIsResponsible

    serviceFactory.getComments = _getComments
    serviceFactory.sendComment = _sendComment


    return serviceFactory;

}]);